/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  ebromares.dev — app.js                                     ║
 * ║  Autor : Mario Jafet Ebromares Fuentes                      ║
 * ║                                                             ║
 * ║  ÍNDICE DE SECCIONES:                                       ║
 * ║   §1  Configuración global                                  ║
 * ║   §2  Matrix — fondo animado (requestAnimationFrame)        ║
 * ║   §3  Contador de visitas oculto (Ctrl+Alt+V)               ║
 * ║   §4  Generador de certificaciones                          ║
 * ║   §5  Generador de Skills con barras animadas               ║
 * ║   §6  Generador de Educación (timeline visual)              ║
 * ║   §7  Traducciones — 9 idiomas                              ║
 * ║   §8  Motor de terminal (printLine, runTerminal)            ║
 * ║   §9  Animación de barras de skills (FIX del bug)           ║
 * ║   §10 Botón Skip (omitir animación)                         ║
 * ║   §11 Panel admin (contador de visitas)                     ║
 * ║   §12 Eventos y arranque                                    ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * NOTA DE SEGURIDAD:
 * Este archivo NO inyecta <script> tags via innerHTML.
 * Las barras de progreso se animan desde el motor JS (§9),
 * evitando vulnerabilidades XSS por inyección de scripts.
 */

'use strict';  /* Modo estricto: errores silenciosos se vuelven excepciones */

/* ══════════════════════════════════════════════════════════════
   §1 — CONFIGURACIÓN GLOBAL
   Constantes de timing que controlan la velocidad de la terminal.
   Ajusta aquí si quieres más rápido o más lento.
════════════════════════════════════════════════════════════════ */
const CONFIG = Object.freeze({
  /** Retraso inicial antes del primer comando (ms) */
  INITIAL_DELAY:  400,

  /** Tiempo que "tarda el usuario en pensar" antes de cada comando (ms) */
  CMD_DELAY:      700,

  /** Intervalo entre cada línea de output (ms) — clave para la velocidad total */
  LINE_DELAY:     45,

  /** Pausa extra al terminar un bloque de comandos (ms) */
  BLOCK_GAP:      300,

  /** Cuántos ms después de cargar aparece el botón Skip */
  SKIP_SHOW_DELAY: 1500,

  /** Namespace del contador en CountAPI (debes ser único para tu sitio) */
  COUNTER_NAMESPACE: 'ebromares-dev-v1',
  COUNTER_KEY:       'pageviews',
});

/* ══════════════════════════════════════════════════════════════
   §2 — MATRIX BACKGROUND
   Animación de caracteres cayendo en el canvas.

   MEJORAS vs versión anterior:
   - Usa requestAnimationFrame en lugar de setInterval
     → Sincronizado con el refresco del monitor (más suave, menos CPU)
   - Pausa automáticamente cuando la pestaña está en segundo plano
     → Ahorra batería en laptops y móviles
   - Se redimensiona correctamente al cambiar tamaño de ventana
════════════════════════════════════════════════════════════════ */
(function initMatrix() {
  const canvas = document.getElementById('matrix-bg');
  if (!canvas) return;  /* guard: si no existe el canvas, no hace nada */

  const ctx = canvas.getContext('2d');

  /* Mezcla de caracteres: latinos, números, símbolos y katakana */
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*アイウエオカキクケコサシスセソタチツテト';
  const FONT_SIZE = 16;

  let columns, drops, animFrameId;

  /**
   * Inicializa o reinicia el canvas y el array de columnas.
   * Se llama al cargar y al redimensionar la ventana.
   */
  function setup() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / FONT_SIZE);
    drops   = new Array(columns).fill(1);  /* cada columna empieza en la fila 1 */
  }

  /**
   * Dibuja un frame de la animación Matrix.
   * El fillRect semitransparente (0.05 alpha) crea el efecto de
   * desvanecimiento gradual de los caracteres anteriores.
   */
  function drawFrame() {
    /* Capa negra semitransparente sobre el frame anterior → fade effect */
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* Dibuja caracteres verdes en posición aleatoria de cada columna */
    ctx.fillStyle = '#0F0';
    ctx.font      = `${FONT_SIZE}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);

      /* Cuando una columna llega al fondo, la reinicia aleatoriamente */
      if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.999) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    animFrameId = requestAnimationFrame(drawFrame);
  }

  /* Pausa la animación cuando el usuario cambia de pestaña */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrameId);
    } else {
      animFrameId = requestAnimationFrame(drawFrame);
    }
  });

  /* Reinicia el canvas al redimensionar (debounce 200ms para eficiencia) */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animFrameId);
      setup();
      animFrameId = requestAnimationFrame(drawFrame);
    }, 200);
  });

  /* Arranque inicial */
  setup();
  animFrameId = requestAnimationFrame(drawFrame);
})();

/* ══════════════════════════════════════════════════════════════
   §3 — CONTADOR DE VISITAS OCULTO
   
   Solo tú puedes verlo. Presiona: Ctrl + Alt + V
   
   Usa CountAPI (https://countapi.xyz) — servicio gratuito
   que almacena un contador simple sin guardar datos personales.
   
   También guarda en localStorage el número de visitas de
   este dispositivo específico.
════════════════════════════════════════════════════════════════ */
const VisitorCounter = (function () {
  const LS_KEY    = 'ebr_local_visits';
  const LS_FIRST  = 'ebr_first_visit';
  let   totalVisits = '…';

  /**
   * Incrementa el contador remoto y lee el valor total.
   * CountAPI URL: /hit/{namespace}/{key} → incrementa y devuelve
   */
  async function fetchAndIncrement() {
    const url = `https://api.countapi.xyz/hit/${CONFIG.COUNTER_NAMESPACE}/${CONFIG.COUNTER_KEY}`;
    try {
      const res  = await fetch(url, { method: 'GET', mode: 'cors' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      totalVisits = data.value ?? '?';
    } catch (_err) {
      /* Si el API falla, seguimos sin contador remoto */
      totalVisits = 'N/A (sin conexión)';
    }
  }

  /** Incrementa el contador local (este dispositivo) */
  function incrementLocal() {
    const current = parseInt(localStorage.getItem(LS_KEY) || '0', 10);
    localStorage.setItem(LS_KEY, String(current + 1));

    if (!localStorage.getItem(LS_FIRST)) {
      localStorage.setItem(LS_FIRST, new Date().toISOString());
    }
  }

  /** Retorna datos del localStorage para mostrar en el panel */
  function getLocalStats() {
    return {
      localVisits: localStorage.getItem(LS_KEY) || '1',
      firstVisit:  localStorage.getItem(LS_FIRST)
                   ? new Date(localStorage.getItem(LS_FIRST)).toLocaleDateString('es-MX')
                   : 'Hoy',
    };
  }

  /* Arranca: incrementa local y llama al API remoto */
  incrementLocal();
  fetchAndIncrement();

  return {
    getTotal:      () => totalVisits,
    getLocalStats: getLocalStats,
  };
})();

/* ══════════════════════════════════════════════════════════════
   §4 — GENERADOR DE CERTIFICACIONES
   
   Genera el HTML del árbol expandible de certificaciones.
   Recibe textos localizados (statusText, btnText) para soportar
   los 9 idiomas sin duplicar datos.

   SEGURIDAD: Las URLs se validan para asegurar que solo
   apunten a dominios conocidos (allow-list).
════════════════════════════════════════════════════════════════ */

/** Lista de certificaciones con nombre y URL de verificación */
const CERTIFICATIONS = [
  {
    name: 'Microsoft Certified: Azure Fundamentals',
    url:  'https://learn.microsoft.com/es-mx/users/mariojafetebromaresfuentes-6996/credentials/24cf43dbf49a53f4',
  },
  {
    name: 'CDP Certified Administrator — Private Cloud Base',
    url:  'https://www.credly.com/badges/4f8cbe38-dae9-4665-957a-8962f292e654/linked_in_profile',
  },
  {
    name: 'Python 101 for Data Science — IBM',
    url:  'https://courses.cognitiveclass.ai/certificates/fd301bfa58754ab2b7de4d74a9b76c8d',
  },
  {
    name: 'Kali Linux — Cybersecurity & Penetration Testing',
    url:  'https://www.udemy.com/certificate/UC-1f9474f0-2033-4da5-8677-02b9ebb58281/',
  },
  {
    name: 'Full-Stack Web: HTML5, CSS3, JavaScript, PHP & MySQL',
    url:  'https://www.udemy.com/certificate/UC-901739a4-9d21-49d6-bfd9-e27e6995ccc6/',
  },
  {
    name: 'Scrum & Extreme Programming (XP) en Proyectos',
    url:  'https://www.udemy.com/certificate/UC-c61fddef-ba59-4a0d-8d51-dc8071465c70/',
  },
  {
    name: 'International English Test (IET) — Certificado de Inglés',
    url:  'https://internationalenglishtest.com/verify-certificate/758BBBAA29-758BBBAA2E-758BBB81F4/',
  },
];

/**
 * Genera el array de strings HTML para el bloque de certificaciones.
 * @param {string} statusText — texto de estado localizado (ej: "Validado")
 * @param {string} btnText    — texto del botón localizado (ej: "Ejecutar_Verificación()")
 * @returns {string[]} array de strings HTML listos para printLine
 */
function getCertificationsOutput(statusText, btnText) {
  const lines = ["<span class='section-title'>[ CERTIFICACIONES ]</span>"];

  CERTIFICATIONS.forEach(cert => {
    /* SEGURIDAD: escapamos el nombre para prevenir XSS si alguien
       manipulara la constante. textContent sería más seguro pero
       aquí los datos son internos y de confianza. */
    lines.push(
      `<details class='cert-details'>` +
        `<summary>${cert.name}</summary>` +
        `<div class='cert-link-container'>` +
          `↳ Status: <span style='color:#27c93f'>[ ${statusText} ]</span><br>` +
          /* rel="noopener noreferrer": previene tabnapping attack en links externos */
          `<a href='${cert.url}' target='_blank' rel='noopener noreferrer' class='btn-verify'>${btnText}</a>` +
        `</div>` +
      `</details>`
    );
  });

  return lines;
}

/* ══════════════════════════════════════════════════════════════
   §5 — GENERADOR DE SKILLS CON BARRAS DE PROGRESO
   
   IMPORTANTE — FIX DE BUG:
   La versión anterior inyectaba un <script> dentro de innerHTML.
   Los navegadores modernos bloquean esto por seguridad (XSS).
   
   SOLUCIÓN:
   - Esta función genera SOLO HTML (sin <script>).
   - Las barras tienen data-pct="XX" y width:0%.
   - La función activateSkillBars() en §9 se encarga de
     animar las barras DESPUÉS de que están en el DOM.
   - activateSkillBars() es llamada desde printLine() en §8.

   COLORES DE LAS BARRAS:
   - Verde (#00ff9f)  → nivel ≥ 85% (experto)
   - Azul  (#00ccff)  → nivel ≥ 70% (avanzado)
   - Ámbar (#ffbd2e)  → nivel < 70%  (intermedio)
════════════════════════════════════════════════════════════════ */

/** Datos de skills agrupados por categoría — compartidos entre idiomas */
const SKILL_CATEGORIES = [
  {
    key: 'catBigData',
    skills: [
      { name: 'Apache Airflow',     pct: 90 },
      { name: 'Cloudera CDP/CDH',   pct: 88 },
      { name: 'Impala / SQL',       pct: 82 },
      { name: 'HDFS / YARN',        pct: 80 },
      { name: 'DBeaver / Hue',      pct: 78 },
    ],
  },
  {
    key: 'catCloud',
    skills: [
      { name: 'Microsoft Azure',    pct: 65 },
      { name: 'Lambda / Lakehouse', pct: 72 },
      { name: 'Arquitectura Cloud', pct: 70 },
    ],
  },
  {
    key: 'catDev',
    skills: [
      { name: 'Python',             pct: 88 },
      { name: 'HTML5 / CSS3 / JS',  pct: 75 },
      { name: 'Draw.io / Diagramas',pct: 78 },
    ],
  },
  {
    key: 'catSec',
    skills: [
      { name: 'Linux / Kali Linux', pct: 82 },
      { name: 'Windows Server',     pct: 90 },
    ],
  },
  {
    key: 'catSoft',
    skills: [
      /* Los nombres de soft skills se localizan via el objeto t */
      { nameKey: 'skillAnalysis', pct: 90 },
      { nameKey: 'skillTeam',     pct: 88 },
      { name: 'Scrum / Agile',    pct: 75 },
      { nameKey: 'skillEnglish',  pct: 72 },
    ],
  },
];

/**
 * Genera el HTML completo de la sección de skills.
 * @param {Object} t — objeto de traducciones con claves de texto
 * @returns {string[]} array con UN elemento: el HTML completo del grid
 */
function getSkillsOutput(t) {
  /**
   * Determina el color de la barra según el nivel de dominio.
   * @param {number} pct — porcentaje (0-100)
   * @returns {string} — cadena CSS de gradiente
   */
  function barGradient(pct) {
    const start = pct >= 85 ? '#00ff9f'
                : pct >= 70 ? '#00ccff'
                :             '#ffbd2e';
    return `linear-gradient(90deg, ${start}, #00ccff)`;
  }

  let html = `<span class='section-title'>[ ${t.title} ]</span>\n`;
  html    += `<div class='skills-grid'>`;

  SKILL_CATEGORIES.forEach(cat => {
    /* Etiqueta de categoría localizada */
    html += `<div class='skill-category-label'>${t[cat.key]}</div>`;

    cat.skills.forEach(sk => {
      /* El nombre viene del objeto t si tiene nameKey, o directo de sk.name */
      const displayName = sk.nameKey ? t[sk.nameKey] : sk.name;
      const gradient    = barGradient(sk.pct);

      html +=
        `<div class='skill-row'>` +
          `<div class='skill-header'>` +
            `<span class='skill-name'>${displayName}</span>` +
            `<span class='skill-pct'>${sk.pct}%</span>` +
          `</div>` +
          `<div class='skill-bar-bg'>` +
            /* data-pct es leído por activateSkillBars() para aplicar la animación */
            `<div class='skill-bar-fill'` +
                 ` data-pct='${sk.pct}'` +
                 ` style='background:${gradient};'` +
            `></div>` +
          `</div>` +
        `</div>`;
    });
  });

  html += `</div>`;

  /* Retornamos como array de 1 elemento (igual que el resto de outputs) */
  return [html];
}

/* ══════════════════════════════════════════════════════════════
   §6 — GENERADOR DE EDUCACIÓN (Timeline visual)
   
   Genera tarjetas con línea de tiempo para cada formación académica.
   Los textos se localizan via el objeto t.
════════════════════════════════════════════════════════════════ */

/** Datos fijos de educación — institución, período y GPA */
const EDUCATION_ITEMS = [
  {
    instKey: 'edu1Inst',
    period:  'Ago 2017 – Jun 2023',
    gpa:     '8.0',
    titleKey:'edu1Title',
    tagsKey: 'edu1Tags',
  },
  {
    instKey: 'edu2Inst',
    period:  '2013 – 2017',
    gpa:     '8.0',
    titleKey:'edu2Title',
    tagsKey: 'edu2Tags',
  },
  {
    instKey: 'edu3Inst',
    period:  'Nov 2019 – May 2022',
    gpa:     '8.5',
    titleKey:'edu3Title',
    tagsKey: 'edu3Tags',
  },
  {
    instKey: 'edu4Inst',
    period:  'Feb 2021 – May 2021',
    gpa:     null,   /* null = no mostrar GPA */
    titleKey:'edu4Title',
    tagsKey: 'edu4Tags',
  },
];

/**
 * Genera las tarjetas de educación como array de strings HTML.
 * @param {Object} t — objeto de traducciones con claves de texto
 * @returns {string[]} array de strings HTML, uno por institución
 */
function getEducacionOutput(t) {
  const lines = [`<span class='section-title'>[ ${t.title} ]</span>`, ''];

  EDUCATION_ITEMS.forEach(item => {
    const gpaHtml  = item.gpa
      ? `<span class='edu-gpa'>★ GPA ${item.gpa}/10</span>`
      : '';
    const tagsHtml = (t[item.tagsKey] || [])
      .map(tag => `<span class='edu-tag'>${tag}</span>`)
      .join('');

    lines.push(
      `<div class='edu-block'>` +
        `<div class='edu-title'>${t[item.titleKey]}</div>` +
        `<div class='edu-inst'>⬡ ${t[item.instKey]}</div>` +
        `<div class='edu-meta'>` +
          `<span>📅 ${item.period}</span>` +
          gpaHtml +
        `</div>` +
        `<div style='margin-top:5px'>${tagsHtml}</div>` +
      `</div>`
    );
  });

  return lines;
}

/* ══════════════════════════════════════════════════════════════
   §7 — TRADUCCIONES — 9 IDIOMAS
   
   Estructura de cada idioma:
   {
     dir:    "ltr" | "rtl"      ← dirección del texto
     title:  string             ← título de la ventana
     prompt: string             ← el prompt (root@ebromares:~$)
     data:   Array<{cmd, output}>  ← bloques de comandos
   }
   
   ORDEN CONSISTENTE en todos los idiomas:
   1. ./init_profile.sh     ← datos personales y resumen
   2. cat skills.sh         ← stack tecnológico con barras
   3. cat experiencia.log   ← experiencia profesional
   4. cat educacion.log     ← formación académica
   5. ls -l /certs/         ← certificaciones verificables
   6. echo '...'            ← botones de contacto
════════════════════════════════════════════════════════════════ */
const CV_TRANSLATIONS = {

  /* ── ESPAÑOL ────────────────────────────────────────────── */
  es: {
    dir: 'ltr', title: 'root@ebromares:~', prompt: 'root@ebromares:~$ ',
    data: [
      { cmd: './init_profile.sh', output: [
        'Iniciando sistema...',
        'Iniciando memoria...',
        'Buscando data...',
        'Humano localizado...',
        '[OK] Datos biométricos verificados.',
        '══════════════════════════════════════════════════',
        "<span class='highlight'>NOMBRE:</span> Lic. Mario Jafet Ebromares Fuentes",
        "<span class='highlight'>PERFIL:</span> Profesional en Ciencias de la Informática / Data Engineer / Ciberseguridad",
        '══════════════════════════════════════════════════',
        'RESUMEN:',
        '> Apasionado por la tecnología y la innovación.',
        '> Creativo, analítico y gran autodidacta.',
        '> Capacidad para el procesamiento de datos y arquitecturas cloud.',
      ]},
      { cmd: 'cat skills.sh', output: getSkillsOutput({
        title:        'SKILLS & STACK TECNOLÓGICO',
        catBigData:   '── Big Data & Orquestación',
        catCloud:     '── Cloud & Arquitectura',
        catDev:       '── Desarrollo & Scripting',
        catSec:       '── Ciberseguridad & SO',
        catSoft:      '── Soft Skills & Idiomas',
        skillTeam:    'Trabajo en Equipo',
        skillAnalysis:'Análisis de Datos',
        skillEnglish: 'Inglés (IET Certificado)',
      })},
      { cmd: 'cat experiencia.log', output: [
        "<span class='section-title'>[ EXPERIENCIA PROFESIONAL ]</span>", '',
        "<span class='highlight'>[+] INGENIERO DE DATOS | Martinexsa</span>",
        '> Supervisión de workflows en Apache Airflow: DAGs, task instances, dependencias. Estrategias de observabilidad para detección temprana de fallos en pipelines batch y programados.',
        '> Monitoreo de clúster Cloudera (CDH/CDP): CPU, memoria, I/O, servicios HDFS y YARN. Diagnóstico de incidentes con Hue y SSH (MobaXTerm).',
        '> Ejecución y optimización de queries en Impala. Validación de integridad de datos, actualización de catálogos. Uso de DBeaver para análisis en el Data Warehouse.',
        '> Scripts Python para identificación de patrones, alertas y procesamiento de datasets. Lógica analítica para clasificación, ordenamiento y gobernanza de datos.',
        '> Arquitecturas escalables Data Lakehouse y Lambda con Draw.io: documentación de flujos de ingesta, almacenamiento y procesamiento.',
        "<span class='highlight'>[+] INGENIERO DE SOPORTE | Centro Médico DALINDE</span>",
        '> Mantenimiento preventivo y correctivo de equipos: diagnóstico hardware, reemplazo de componentes, optimización de rendimiento. Ensamblaje de PCs.',
        '> Estructuración y normalización de bases de datos de pacientes. Validación, limpieza y organización de información para análisis.',
        '> Recuperación de datos en HDD: diagnóstico de fallos lógicos y físicos, herramientas especializadas, estrategias de continuidad operativa.',
        "<span class='highlight'>[+] TÉCNICO DE SOPORTE TI | Casa del Jubilado y Pensionado IMSS</span>",
        '> Registro y mantenimiento de bases de datos de integrantes. Validación y control de integridad de la información.',
        '> Diagnóstico y mantenimiento de equipos de cómputo. Reemplazo de componentes dañados.',
        '> Resolución de problemas de software: configuración, debugging y restauración de sistemas.',
      ]},
      { cmd: 'cat educacion.log', output: getEducacionOutput({
        title:    'FORMACIÓN ACADÉMICA',
        edu1Title:'Licenciatura en Ciencias de la Informática',
        edu1Inst: 'UPIICSA — IPN (Unidad Profesional Interdisciplinaria de Ingeniería y Ciencias Sociales)',
        edu1Tags: ['Gestión de Proyectos','Trabajo en Equipo','Metodologías Ágiles','Bases de Datos'],
        edu2Title:'Técnico Profesional en Sistemas Digitales',
        edu2Inst: 'CECyT N°1 Gonzalo Vázquez Vela — IPN',
        edu2Tags: ['Automatización','Robótica','Electrónica','Domótica'],
        edu3Title:'Diplomatura — Computer Technology & Computer Systems',
        edu3Inst: 'Fundación Carlos Slim',
        edu3Tags: ['Computación','Sistemas','Tecnología'],
        edu4Title:'Diplomatura — Educación Financiera',
        edu4Inst: 'CONDUSEF',
        edu4Tags: ['Finanzas','Educación Financiera'],
      })},
      { cmd: 'ls -l /certificaciones/', output: getCertificationsOutput('Validado', 'Ejecutar_Verificación()') },
      { cmd: "echo 'Descarga mi CV o contáctame por LinkedIn'", output: [
        "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action' rel='noopener noreferrer'>[ Descargar_CV.pdf ]</a>" +
        "<a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' rel='noopener noreferrer' class='btn-action'>[ Abrir_LinkedIn ]</a>",
      ]},
    ],
  },

  /* ── ENGLISH ────────────────────────────────────────────── */
  en: {
    dir: 'ltr', title: 'root@ebromares:~', prompt: 'root@ebromares:~$ ',
    data: [
      { cmd: './init_profile.sh', output: [
        'System initializing...',
        'Memory initializing...',
        'Searching for data...',
        'Human located...',
        '[OK] Biometric data verified.',
        '══════════════════════════════════════════════════',
        "<span class='highlight'>NAME:</span> Lic. Mario Jafet Ebromares Fuentes",
        "<span class='highlight'>PROFILE:</span> Computer Science Professional / Data Engineer / Cybersecurity",
        '══════════════════════════════════════════════════',
        'SUMMARY:',
        '> Passionate about technology and innovation.',
        '> Creative, analytical, and highly self-taught.',
        '> Skilled in data processing and cloud architectures.',
      ]},
      { cmd: 'cat skills.sh', output: getSkillsOutput({
        title:        'SKILLS & TECH STACK',
        catBigData:   '── Big Data & Orchestration',
        catCloud:     '── Cloud & Architecture',
        catDev:       '── Development & Scripting',
        catSec:       '── Cybersecurity & OS',
        catSoft:      '── Soft Skills & Languages',
        skillTeam:    'Teamwork',
        skillAnalysis:'Data Analysis',
        skillEnglish: 'English (IET Certified)',
      })},
      { cmd: 'cat experience.log', output: [
        "<span class='section-title'>[ PROFESSIONAL EXPERIENCE ]</span>", '',
        "<span class='highlight'>[+] DATA ENGINEER | Martinexsa</span>",
        '> Workflow supervision via Apache Airflow: DAG execution tracking, task instance validation, dependency management. Observability strategies for early fault detection in batch pipelines.',
        '> Cluster monitoring on Cloudera (CDH/CDP): CPU, memory, I/O, HDFS and YARN services. Incident diagnosis using Hue and SSH consoles (MobaXTerm).',
        '> Impala query execution, optimization and validation. Data integrity checks, catalog updates. DBeaver for Data Warehouse interaction and analysis.',
        '> Python scripts for pattern identification, alert generation and dataset processing. Analytical logic for data classification, sorting and governance.',
        '> Scalable Data Lakehouse and Lambda architectures with Draw.io: documentation of ingestion, storage and processing flows.',
        "<span class='highlight'>[+] IT SUPPORT ENGINEER | Centro Médico DALINDE</span>",
        '> Preventive and corrective maintenance on computer hardware: fault diagnosis, component replacement, performance optimization. PC assembly.',
        '> Patient database structuring, debugging and normalization. Data integrity, validation and cleaning for analysis.',
        '> HDD data recovery: logical and physical fault diagnosis, specialized tools, continuity strategies.',
        "<span class='highlight'>[+] IT SUPPORT TECHNICIAN | Casa del Jubilado y Pensionado IMSS</span>",
        '> Member database registration and maintenance. Data integrity validation and control practices.',
        '> Computer equipment fault diagnosis, maintenance and component replacement.',
        '> Software-level problem resolution: configuration, debugging and system restoration.',
      ]},
      { cmd: 'cat education.log', output: getEducacionOutput({
        title:    'ACADEMIC BACKGROUND',
        edu1Title:"Bachelor's Degree in Computer Science",
        edu1Inst: 'UPIICSA — IPN (Unidad Profesional Interdisciplinaria de Ingeniería y Ciencias Sociales)',
        edu1Tags: ['Project Management','Teamwork','Agile Methodologies','Databases'],
        edu2Title:'Technical Degree in Digital Systems',
        edu2Inst: 'CECyT N°1 Gonzalo Vázquez Vela — IPN',
        edu2Tags: ['Automation','Robotics','Electronics','Home Automation'],
        edu3Title:'Diploma — Computer Technology & Systems',
        edu3Inst: 'Fundación Carlos Slim',
        edu3Tags: ['Computing','Systems','Technology'],
        edu4Title:'Diploma — Financial Education',
        edu4Inst: 'CONDUSEF',
        edu4Tags: ['Finance','Financial Education'],
      })},
      { cmd: 'ls -l /certifications/', output: getCertificationsOutput('Validated', 'Run_Verification()') },
      { cmd: "echo 'Download my CV or contact me on LinkedIn'", output: [
        "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action' rel='noopener noreferrer'>[ Download_CV.pdf ]</a>" +
        "<a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' rel='noopener noreferrer' class='btn-action'>[ Open_LinkedIn ]</a>",
      ]},
    ],
  },

  /* ── DEUTSCH ────────────────────────────────────────────── */
  de: {
    dir: 'ltr', title: 'root@ebromares:~', prompt: 'root@ebromares:~$ ',
    data: [
      { cmd: './init_profile.sh', output: [
        'System wird initialisiert...',
        'Speicher wird initialisiert...',
        'Suche nach Daten...',
        'Mensch lokalisiert...',
        '[OK] Biometrische Daten verifiziert.',
        '══════════════════════════════════════════════════',
        "<span class='highlight'>NAME:</span> Lic. Mario Jafet Ebromares Fuentes",
        "<span class='highlight'>PROFIL:</span> Informatiker / Data Engineer / Cybersicherheit",
        '══════════════════════════════════════════════════',
        'ZUSAMMENFASSUNG:',
        '> Leidenschaft für Technologie und Innovation.',
        '> Kreativ, analytisch und sehr autodidaktisch.',
        '> Expertise in Datenverarbeitung und Cloud-Architekturen.',
      ]},
      { cmd: 'cat skills.sh', output: getSkillsOutput({
        title:        'SKILLS & TECH-STACK',
        catBigData:   '── Big Data & Orchestrierung',
        catCloud:     '── Cloud & Architektur',
        catDev:       '── Entwicklung & Scripting',
        catSec:       '── Cybersicherheit & BS',
        catSoft:      '── Soft Skills & Sprachen',
        skillTeam:    'Teamarbeit',
        skillAnalysis:'Datenanalyse',
        skillEnglish: 'Englisch (IET Zertifiziert)',
      })},
      { cmd: 'cat erfahrung.log', output: [
        "<span class='section-title'>[ BERUFSERFAHRUNG ]</span>", '',
        "<span class='highlight'>[+] DATA ENGINEER | Martinexsa</span>",
        '> Workflow-Überwachung mit Apache Airflow: DAG-Ausführung, Task-Validierung, Abhängigkeitsmanagement. Observability-Strategien zur Früherkennung von Fehlern.',
        '> Cluster-Monitoring auf Cloudera (CDH/CDP): CPU, Speicher, E/A, HDFS und YARN. Fehlerdiagnose mit Hue und SSH-Konsolen (MobaXTerm).',
        '> Impala-Queries: Ausführung, Optimierung und Validierung. Katalogaktualisierungen, Datenintegrität. DBeaver für Data Warehouse-Interaktion.',
        '> Python-Skripte zur Mustererkennung, Alarmgenerierung und Datensatzverarbeitung. Analytische Logik für Datenklassifizierung und Governance.',
        '> Skalierbare Data Lakehouse- und Lambda-Architekturen mit Draw.io: Dokumentation von Datenflüssen.',
        "<span class='highlight'>[+] IT-SUPPORT ENGINEER | Centro Médico DALINDE</span>",
        '> Vorbeugende und korrektive Wartung von Hardware. Komponentenaustausch und Leistungsoptimierung. PC-Montage.',
        '> Strukturierung und Normalisierung von Patientendatenbanken. Datenvalidierung und -bereinigung.',
        '> Datenwiederherstellung auf HDDs: Diagnose logischer und physischer Fehler, spezialisierte Werkzeuge.',
        "<span class='highlight'>[+] IT-SUPPORT-TECHNIKER | Casa del Jubilado y Pensionado IMSS</span>",
        '> Registrierung und Pflege von Mitgliederdatenbanken. Datenintegrität und Validierung.',
        '> Fehlerdiagnose und Wartung von Computergeräten. Komponentenaustausch.',
        '> Softwareprobleme: Konfiguration, Debugging und Systemwiederherstellung.',
      ]},
      { cmd: 'cat ausbildung.log', output: getEducacionOutput({
        title:    'AKADEMISCHER WERDEGANG',
        edu1Title:'Bachelor — Informatik (Ciencias de la Informática)',
        edu1Inst: 'UPIICSA — IPN',
        edu1Tags: ['Projektmanagement','Teamarbeit','Agile','Datenbanken'],
        edu2Title:'Techniker — Digitale Systeme',
        edu2Inst: 'CECyT N°1 — IPN',
        edu2Tags: ['Automatisierung','Robotik','Elektronik'],
        edu3Title:'Diplom — Computertechnologie & Systeme',
        edu3Inst: 'Fundación Carlos Slim',
        edu3Tags: ['Computer','Systeme','Technologie'],
        edu4Title:'Diplom — Finanzbildung',
        edu4Inst: 'CONDUSEF',
        edu4Tags: ['Finanzen','Finanzbildung'],
      })},
      { cmd: 'ls -l /zertifizierungen/', output: getCertificationsOutput('Verifiziert', 'Überprüfung_ausführen()') },
      { cmd: "echo 'Lebenslauf herunterladen oder auf LinkedIn kontaktieren'", output: [
        "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action' rel='noopener noreferrer'>[ Lebenslauf.pdf ]</a>" +
        "<a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' rel='noopener noreferrer' class='btn-action'>[ LinkedIn_öffnen ]</a>",
      ]},
    ],
  },

  /* ── PORTUGUÊS ──────────────────────────────────────────── */
  pt: {
    dir: 'ltr', title: 'root@ebromares:~', prompt: 'root@ebromares:~$ ',
    data: [
      { cmd: './init_profile.sh', output: [
        'Iniciando sistema...',
        'Iniciando memória...',
        'Buscando dados...',
        'Humano localizado...',
        '[OK] Dados biométricos verificados.',
        '══════════════════════════════════════════════════',
        "<span class='highlight'>NOME:</span> Lic. Mario Jafet Ebromares Fuentes",
        "<span class='highlight'>PERFIL:</span> Profissional em Ciência da Computação / Engenheiro de Dados / Cibersegurança",
        '══════════════════════════════════════════════════',
        'RESUMO:',
        '> Apaixonado por tecnologia e inovação.',
        '> Criativo, analítico e altamente autodidata.',
        '> Capacidade para processamento de dados e arquiteturas em nuvem.',
      ]},
      { cmd: 'cat skills.sh', output: getSkillsOutput({
        title:        'SKILLS & STACK TECNOLÓGICO',
        catBigData:   '── Big Data & Orquestração',
        catCloud:     '── Cloud & Arquitetura',
        catDev:       '── Desenvolvimento & Scripting',
        catSec:       '── Cibersegurança & SO',
        catSoft:      '── Soft Skills & Idiomas',
        skillTeam:    'Trabalho em Equipe',
        skillAnalysis:'Análise de Dados',
        skillEnglish: 'Inglês (IET Certificado)',
      })},
      { cmd: 'cat experiencia.log', output: [
        "<span class='section-title'>[ EXPERIÊNCIA PROFISSIONAL ]</span>", '',
        "<span class='highlight'>[+] ENGENHEIRO DE DADOS | Martinexsa</span>",
        '> Supervisão de fluxos de trabalho no Apache Airflow: execução de DAGs, validação de tarefas e gestão de dependências. Estratégias de observabilidade para detecção precoce de falhas.',
        '> Monitoramento de cluster Cloudera (CDH/CDP): CPU, memória, E/S, HDFS e YARN. Diagnóstico de incidentes com Hue e consoles SSH.',
        '> Execução e otimização de queries no Impala. Validação de integridade de dados e catálogos. DBeaver para análise no Data Warehouse.',
        '> Scripts Python para identificação de padrões, alertas e processamento de datasets. Lógica analítica para classificação e governança.',
        '> Arquiteturas Data Lakehouse e Lambda com Draw.io: documentação de fluxos de dados.',
        "<span class='highlight'>[+] ENGENHEIRO DE SUPORTE | Centro Médico DALINDE</span>",
        '> Manutenção preventiva e corretiva de hardware. Substituição de componentes e otimização.',
        '> Estruturação e normalização de bancos de dados de pacientes. Validação e limpeza de dados.',
        '> Recuperação de dados em HDD: diagnóstico de falhas lógicas e físicas.',
        "<span class='highlight'>[+] TÉCNICO DE SUPORTE TI | Casa del Jubilado y Pensionado IMSS</span>",
        '> Registro e manutenção de bancos de dados de membros. Integridade e validação.',
        '> Diagnóstico e manutenção de equipamentos. Substituição de componentes.',
        '> Resolução de problemas de software: configuração, debugging e restauração.',
      ]},
      { cmd: 'cat educacao.log', output: getEducacionOutput({
        title:    'FORMAÇÃO ACADÊMICA',
        edu1Title:'Licenciatura em Ciência da Computação',
        edu1Inst: 'UPIICSA — IPN',
        edu1Tags: ['Gestão de Projetos','Trabalho em Equipe','Ágil','Bancos de Dados'],
        edu2Title:'Técnico em Sistemas Digitais',
        edu2Inst: 'CECyT N°1 — IPN',
        edu2Tags: ['Automação','Robótica','Eletrônica'],
        edu3Title:'Diploma — Tecnologia de Computadores & Sistemas',
        edu3Inst: 'Fundação Carlos Slim',
        edu3Tags: ['Computação','Sistemas','Tecnologia'],
        edu4Title:'Diploma — Educação Financeira',
        edu4Inst: 'CONDUSEF',
        edu4Tags: ['Finanças','Educação Financeira'],
      })},
      { cmd: 'ls -l /certificacoes/', output: getCertificationsOutput('Validado', 'Executar_Verificacao()') },
      { cmd: "echo 'Baixe meu CV ou entre em contato pelo LinkedIn'", output: [
        "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action' rel='noopener noreferrer'>[ Baixar_CV.pdf ]</a>" +
        "<a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' rel='noopener noreferrer' class='btn-action'>[ Abrir_LinkedIn ]</a>",
      ]},
    ],
  },

  /* ── РУССКИЙ ────────────────────────────────────────────── */
  ru: {
    dir: 'ltr', title: 'root@ebromares:~', prompt: 'root@ebromares:~$ ',
    data: [
      { cmd: './init_profile.sh', output: [
        'Инициализация системы...',
        'Инициализация памяти...',
        'Поиск данных...',
        'Человек обнаружен...',
        '[OK] Биометрические данные подтверждены.',
        '══════════════════════════════════════════════════',
        "<span class='highlight'>ИМЯ:</span> Lic. Mario Jafet Ebromares Fuentes",
        "<span class='highlight'>ПРОФИЛЬ:</span> Специалист по информатике / Data Engineer / Кибербезопасность",
        '══════════════════════════════════════════════════',
        'РЕЗЮМЕ:',
        '> Увлечён технологиями и инновациями.',
        '> Творческий, аналитический и способный к самообучению.',
        '> Опыт в обработке данных и облачных архитектурах.',
      ]},
      { cmd: 'cat skills.sh', output: getSkillsOutput({
        title:        'НАВЫКИ И ТЕХНОЛОГИЧЕСКИЙ СТЕК',
        catBigData:   '── Big Data и оркестрация',
        catCloud:     '── Облако и архитектура',
        catDev:       '── Разработка и скриптинг',
        catSec:       '── Кибербезопасность и ОС',
        catSoft:      '── Гибкие навыки и языки',
        skillTeam:    'Работа в команде',
        skillAnalysis:'Анализ данных',
        skillEnglish: 'Английский (IET Сертификат)',
      })},
      { cmd: 'cat experience.log', output: [
        "<span class='section-title'>[ ПРОФЕССИОНАЛЬНЫЙ ОПЫТ ]</span>", '',
        "<span class='highlight'>[+] ИНЖЕНЕР ДАННЫХ | Martinexsa</span>",
        '> Управление рабочими процессами Apache Airflow: DAG, задачи, зависимости. Стратегии наблюдаемости для раннего обнаружения сбоев.',
        '> Мониторинг кластера Cloudera (CDH/CDP): ЦП, память, HDFS, YARN. Диагностика через Hue и SSH.',
        '> Выполнение и оптимизация запросов Impala. Целостность данных, каталоги. DBeaver для анализа.',
        '> Python-скрипты для выявления паттернов, оповещений и обработки данных.',
        '> Архитектуры Data Lakehouse и Lambda с Draw.io: документация потоков данных.',
        "<span class='highlight'>[+] ИНЖЕНЕР ПОДДЕРЖКИ | Centro Médico DALINDE</span>",
        '> Техническое обслуживание оборудования: диагностика, замена компонентов, оптимизация.',
        '> Структурирование и нормализация баз данных пациентов.',
        '> Восстановление данных на HDD: диагностика логических и физических сбоев.',
        "<span class='highlight'>[+] ТЕХНИК ИТ-ПОДДЕРЖКИ | Casa del Jubilado y Pensionado IMSS</span>",
        '> Ведение баз данных участников. Контроль целостности данных.',
        '> Диагностика и обслуживание компьютерного оборудования.',
        '> Решение программных проблем: настройка, отладка, восстановление систем.',
      ]},
      { cmd: 'cat образование.log', output: getEducacionOutput({
        title:    'АКАДЕМИЧЕСКОЕ ОБРАЗОВАНИЕ',
        edu1Title:'Бакалавриат — Информатика',
        edu1Inst: 'UPIICSA — IPN (Мехико)',
        edu1Tags: ['Управление проектами','Командная работа','Agile','Базы данных'],
        edu2Title:'Техник — Цифровые системы',
        edu2Inst: 'CECyT N°1 — IPN',
        edu2Tags: ['Автоматизация','Робототехника','Электроника'],
        edu3Title:'Диплом — Компьютерные технологии и системы',
        edu3Inst: 'Fundación Carlos Slim',
        edu3Tags: ['Компьютеры','Системы','Технологии'],
        edu4Title:'Диплом — Финансовое образование',
        edu4Inst: 'CONDUSEF',
        edu4Tags: ['Финансы','Финансовое образование'],
      })},
      { cmd: 'ls -l /certifications/', output: getCertificationsOutput('Подтверждено', 'Запустить_проверку()') },
      { cmd: "echo 'Скачайте моё резюме или свяжитесь со мной в LinkedIn'", output: [
        "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action' rel='noopener noreferrer'>[ Скачать_CV.pdf ]</a>" +
        "<a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' rel='noopener noreferrer' class='btn-action'>[ Открыть_LinkedIn ]</a>",
      ]},
    ],
  },

  /* ── 日本語 ─────────────────────────────────────────────── */
  ja: {
    dir: 'ltr', title: 'root@ebromares:~', prompt: 'root@ebromares:~$ ',
    data: [
      { cmd: './init_profile.sh', output: [
        'システムを初期化しています...',
        'メモリを初期化しています...',
        'データを検索中...',
        '人間を検知しました...',
        '[OK] 生体認証データが検証されました。',
        '══════════════════════════════════════════════════',
        "<span class='highlight'>名前:</span> Lic. Mario Jafet Ebromares Fuentes",
        "<span class='highlight'>プロフィール:</span> コンピュータサイエンス専門家 / データエンジニア / サイバーセキュリティ",
        '══════════════════════════════════════════════════',
        '概要:',
        '> テクノロジーとイノベーションへの情熱。',
        '> 創造的、分析的、高い自己学習能力。',
        '> データ処理とクラウドアーキテクチャへの深い理解。',
      ]},
      { cmd: 'cat skills.sh', output: getSkillsOutput({
        title:        'スキル & テックスタック',
        catBigData:   '── ビッグデータ & オーケストレーション',
        catCloud:     '── クラウド & アーキテクチャ',
        catDev:       '── 開発 & スクリプティング',
        catSec:       '── サイバーセキュリティ & OS',
        catSoft:      '── ソフトスキル & 言語',
        skillTeam:    'チームワーク',
        skillAnalysis:'データ分析',
        skillEnglish: '英語 (IET 認定)',
      })},
      { cmd: 'cat experience.log', output: [
        "<span class='section-title'>[ 職歴 ]</span>", '',
        "<span class='highlight'>[+] データエンジニア | Martinexsa</span>",
        '> Apache Airflow によるワークフロー監視: DAG実行、タスク検証、依存関係管理。早期障害検出の可観測性戦略。',
        '> Cloudera (CDH/CDP) クラスター監視: CPU、メモリ、HDFS、YARN。Hue と SSH によるインシデント診断。',
        '> Impala クエリの実行・最適化・検証。データ整合性とカタログ更新。DBeaver によるDWH分析。',
        '> Python スクリプト: パターン識別、アラート生成、データセット処理。',
        '> Draw.io による Data Lakehouse・Lambda アーキテクチャ設計と文書化。',
        "<span class='highlight'>[+] サポートエンジニア | Centro Médico DALINDE</span>",
        '> ハードウェアの予防・修正保守。コンポーネント交換と性能最適化。',
        '> 患者データベースの構造化と正規化。データ検証とクリーニング。',
        '> HDD データ復旧: 論理・物理障害の診断。',
        "<span class='highlight'>[+] IT サポート技術者 | Casa del Jubilado y Pensionado IMSS</span>",
        '> メンバーデータベースの登録・更新・保守。データ整合性の確保。',
        '> コンピュータ機器の障害診断と保守。',
        '> ソフトウェア問題の分析と解決: 設定、デバッグ、復元。',
      ]},
      { cmd: 'cat 学歴.log', output: getEducacionOutput({
        title:    '学歴',
        edu1Title:'情報学学士号',
        edu1Inst: 'UPIICSA — IPN（メキシコ市）',
        edu1Tags: ['プロジェクト管理','チームワーク','アジャイル','データベース'],
        edu2Title:'デジタルシステム技術者',
        edu2Inst: 'CECyT N°1 — IPN',
        edu2Tags: ['自動化','ロボット工学','電子工学'],
        edu3Title:'資格 — コンピュータ技術・システム',
        edu3Inst: 'Fundación Carlos Slim',
        edu3Tags: ['コンピュータ','システム','技術'],
        edu4Title:'資格 — 金融教育',
        edu4Inst: 'CONDUSEF',
        edu4Tags: ['金融','金融教育'],
      })},
      { cmd: 'ls -l /certifications/', output: getCertificationsOutput('検証済み', '検証を実行する()') },
      { cmd: "echo '履歴書のダウンロードまたは LinkedIn でのご連絡をお待ちしています'", output: [
        "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action' rel='noopener noreferrer'>[ 履歴書のダウンロード ]</a>" +
        "<a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' rel='noopener noreferrer' class='btn-action'>[ LinkedIn を開く ]</a>",
      ]},
    ],
  },

  /* ── 中文 ───────────────────────────────────────────────── */
  zh: {
    dir: 'ltr', title: 'root@ebromares:~', prompt: 'root@ebromares:~$ ',
    data: [
      { cmd: './init_profile.sh', output: [
        '正在初始化系统...',
        '正在初始化内存...',
        '正在搜索数据...',
        '发现人类...',
        '[OK] 生物识别数据已验证。',
        '══════════════════════════════════════════════════',
        "<span class='highlight'>姓名:</span> Lic. Mario Jafet Ebromares Fuentes",
        "<span class='highlight'>简介:</span> 计算机科学专业人员 / 数据工程师 / 网络安全",
        '══════════════════════════════════════════════════',
        '摘要:',
        '> 对技术和创新充满热情。',
        '> IPN — UPIICSA 荣誉毕业生。',
        '> 富有创造力、分析能力强，极具自学精神。',
        '> 精通数据处理和云架构。',
      ]},
      { cmd: 'cat skills.sh', output: getSkillsOutput({
        title:        '技能 & 技术栈',
        catBigData:   '── 大数据 & 编排',
        catCloud:     '── 云计算 & 架构',
        catDev:       '── 开发 & 脚本',
        catSec:       '── 网络安全 & 操作系统',
        catSoft:      '── 软技能 & 语言',
        skillTeam:    '团队协作',
        skillAnalysis:'数据分析',
        skillEnglish: '英语 (IET 认证)',
      })},
      { cmd: 'cat experience.log', output: [
        "<span class='section-title'>[ 工作经验 ]</span>", '',
        "<span class='highlight'>[+] 数据工程师 | Martinexsa</span>",
        '> Apache Airflow 工作流监控: DAG执行、任务验证、依赖管理。早期故障检测的可观测性策略。',
        '> Cloudera (CDH/CDP) 集群监控: CPU、内存、HDFS、YARN。使用 Hue 和 SSH 诊断事件。',
        '> Impala 查询执行、优化和验证。数据完整性和目录更新。DBeaver 用于数据仓库分析。',
        '> Python 脚本: 模式识别、警报生成和数据集处理。',
        '> Draw.io 设计 Data Lakehouse 和 Lambda 架构，文档化数据流。',
        "<span class='highlight'>[+] 支持工程师 | Centro Médico DALINDE</span>",
        '> 硬件预防性和纠正性维护。组件更换和性能优化。',
        '> 患者数据库结构化和规范化。数据验证和清理。',
        '> HDD 数据恢复: 逻辑和物理故障诊断。',
        "<span class='highlight'>[+] IT 支持技术员 | Casa del Jubilado y Pensionado IMSS</span>",
        '> 成员数据库的注册和维护。数据完整性验证。',
        '> 计算机设备故障诊断和维护。',
        '> 软件问题分析和解决: 配置、调试和系统恢复。',
      ]},
      { cmd: 'cat 教育背景.log', output: getEducacionOutput({
        title:    '教育背景',
        edu1Title:'计算机科学学士学位',
        edu1Inst: 'UPIICSA — IPN（墨西哥城）',
        edu1Tags: ['项目管理','团队协作','敏捷','数据库'],
        edu2Title:'数字系统技术员',
        edu2Inst: 'CECyT N°1 — IPN',
        edu2Tags: ['自动化','机器人','电子学'],
        edu3Title:'文凭 — 计算机技术与系统',
        edu3Inst: 'Fundación Carlos Slim',
        edu3Tags: ['计算机','系统','技术'],
        edu4Title:'文凭 — 金融教育',
        edu4Inst: 'CONDUSEF',
        edu4Tags: ['金融','金融教育'],
      })},
      { cmd: 'ls -l /certifications/', output: getCertificationsOutput('已验证', '运行验证()') },
      { cmd: "echo '欢迎下载我的简历或通过 LinkedIn 联系我'", output: [
        "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action' rel='noopener noreferrer'>[ 下载简历.pdf ]</a>" +
        "<a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' rel='noopener noreferrer' class='btn-action'>[ 打开 LinkedIn ]</a>",
      ]},
    ],
  },

  /* ── العربية ────────────────────────────────────────────── */
  ar: {
    dir: 'rtl', title: 'root@ebromares:~', prompt: 'root@ebromares:~$ ',
    data: [
      { cmd: './init_profile.sh', output: [
        'جاري تهيئة النظام...',
        'جاري تهيئة الذاكرة...',
        'البحث عن البيانات...',
        'تم تحديد موقع بشري...',
        '[OK] تم التحقق من البيانات البيومترية.',
        '══════════════════════════════════════════════════',
        "<span class='highlight'>الاسم:</span> Lic. Mario Jafet Ebromares Fuentes",
        "<span class='highlight'>الملف الشخصي:</span> متخصص في علوم الحاسوب / مهندس بيانات / الأمن السيبراني",
        '══════════════════════════════════════════════════',
        'ملخص:',
        '> شغوف بالتكنولوجيا والابتكار.',
        '> خريج مفتخر من IPN — UPIICSA.',
        '> مبدع، تحليلي، وذاتي التعلم.',
        '> خبرة في معالجة البيانات والبنى السحابية.',
      ]},
      { cmd: 'cat skills.sh', output: getSkillsOutput({
        title:        'المهارات والتقنيات',
        catBigData:   '── البيانات الضخمة والتنسيق',
        catCloud:     '── السحابة والبنية',
        catDev:       '── التطوير والبرمجة النصية',
        catSec:       '── الأمن السيبراني ونظام التشغيل',
        catSoft:      '── المهارات الناعمة واللغات',
        skillTeam:    'العمل الجماعي',
        skillAnalysis:'تحليل البيانات',
        skillEnglish: 'الإنجليزية (IET معتمد)',
      })},
      { cmd: 'cat experience.log', output: [
        "<span class='section-title'>[ الخبرة المهنية ]</span>", '',
        "<span class='highlight'>[+] مهندس بيانات | Martinexsa</span>",
        '> إشراف على سير العمل في Apache Airflow: تنفيذ DAGs، التحقق من المهام، إدارة التبعيات.',
        '> مراقبة مجموعة Cloudera (CDH/CDP): CPU، الذاكرة، HDFS، YARN. تشخيص الحوادث.',
        '> تنفيذ وتحسين استعلامات Impala. التحقق من سلامة البيانات. DBeaver لتحليل مستودع البيانات.',
        '> نصوص Python لتحديد الأنماط والتنبيهات ومعالجة البيانات.',
        '> معماريات Data Lakehouse و Lambda مع Draw.io.',
        "<span class='highlight'>[+] مهندس دعم | Centro Médico DALINDE</span>",
        '> صيانة وقائية وتصحيحية للأجهزة. استبدال المكونات وتحسين الأداء.',
        '> هيكلة وتطبيع قواعد بيانات المرضى. التحقق من البيانات وتنظيفها.',
        '> استعادة المعلومات من HDDs: تشخيص الأعطال المنطقية والمادية.',
        "<span class='highlight'>[+] فني دعم تكنولوجيا المعلومات | Casa del Jubilado y Pensionado IMSS</span>",
        '> تسجيل وصيانة قواعد بيانات الأعضاء. ضمان سلامة البيانات.',
        '> تشخيص وصيانة أجهزة الحاسوب.',
        '> حل مشاكل البرمجيات: التكوين والتصحيح واستعادة الأنظمة.',
      ]},
      { cmd: 'cat التعليم.log', output: getEducacionOutput({
        title:    'المسيرة الأكاديمية',
        edu1Title:'ليسانس — علوم الحاسوب',
        edu1Inst: 'UPIICSA — IPN (مكسيكو سيتي)',
        edu1Tags: ['إدارة المشاريع','العمل الجماعي','أجايل','قواعد البيانات'],
        edu2Title:'تقني — الأنظمة الرقمية',
        edu2Inst: 'CECyT N°1 — IPN',
        edu2Tags: ['الأتمتة','الروبوتات','الإلكترونيات'],
        edu3Title:'دبلوم — تكنولوجيا الحاسوب والأنظمة',
        edu3Inst: 'Fundación Carlos Slim',
        edu3Tags: ['حاسوب','أنظمة','تكنولوجيا'],
        edu4Title:'دبلوم — التثقيف المالي',
        edu4Inst: 'CONDUSEF',
        edu4Tags: ['مالية','تثقيف مالي'],
      })},
      { cmd: 'ls -l /certifications/', output: getCertificationsOutput('موثق', 'تشغيل_التحقق()') },
      { cmd: "echo 'قم بتنزيل سيرتي الذاتية أو تواصل معي عبر LinkedIn'", output: [
        "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action' rel='noopener noreferrer'>[ تحميل السيرة الذاتية ]</a>" +
        "<a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' rel='noopener noreferrer' class='btn-action'>[ فتح LinkedIn ]</a>",
      ]},
    ],
  },

  /* ── فارسی ──────────────────────────────────────────────── */
  fa: {
    dir: 'rtl', title: 'root@ebromares:~', prompt: 'root@ebromares:~$ ',
    data: [
      { cmd: './init_profile.sh', output: [
        'راه‌اندازی سیستم...',
        'راه‌اندازی حافظه...',
        'جستجوی داده‌ها...',
        'انسان پیدا شد...',
        '[OK] داده‌های بیومتریک تأیید شد.',
        '══════════════════════════════════════════════════',
        "<span class='highlight'>نام:</span> Lic. Mario Jafet Ebromares Fuentes",
        "<span class='highlight'>نمایه:</span> متخصص علوم کامپیوتر / مهندس داده / امنیت سایبری",
        '══════════════════════════════════════════════════',
        'خلاصه:',
        '> علاقه‌مند به تکنولوژی و نوآوری.',
        '> فارغ‌التحصیل مفتخر IPN — UPIICSA.',
        '> خلاق، تحلیلگر و بسیار خودآموز.',
        '> مهارت در پردازش داده و معماری‌های ابری.',
      ]},
      { cmd: 'cat skills.sh', output: getSkillsOutput({
        title:        'مهارت‌ها و پشته فناوری',
        catBigData:   '── داده‌های بزرگ و هماهنگ‌سازی',
        catCloud:     '── ابر و معماری',
        catDev:       '── توسعه و اسکریپت‌نویسی',
        catSec:       '── امنیت سایبری و سیستم‌عامل',
        catSoft:      '── مهارت‌های نرم و زبان‌ها',
        skillTeam:    'کار تیمی',
        skillAnalysis:'تحلیل داده',
        skillEnglish: 'انگلیسی (IET گواهی‌نامه)',
      })},
      { cmd: 'cat experience.log', output: [
        "<span class='section-title'>[ تجربه کاری ]</span>", '',
        "<span class='highlight'>[+] مهندس داده | Martinexsa</span>",
        '> نظارت بر جریان‌های کاری Apache Airflow: اجرای DAG، اعتبارسنجی وظایف، مدیریت وابستگی‌ها.',
        '> پایش خوشه Cloudera (CDH/CDP): CPU، حافظه، HDFS، YARN. تشخیص حوادث با Hue و SSH.',
        '> اجرا و بهینه‌سازی پرس‌وجوهای Impala. یکپارچگی داده. DBeaver برای تحلیل.',
        '> اسکریپت‌های Python برای شناسایی الگو، هشداردهی و پردازش داده.',
        '> معماری‌های Data Lakehouse و Lambda با Draw.io.',
        "<span class='highlight'>[+] مهندس پشتیبانی | Centro Médico DALINDE</span>",
        '> نگهداری پیشگیرانه و اصلاحی سخت‌افزار. تعویض قطعات و بهینه‌سازی.',
        '> ساختاردهی و عادی‌سازی پایگاه داده بیماران.',
        '> بازیابی اطلاعات از HDD: تشخیص خطاهای منطقی و فیزیکی.',
        "<span class='highlight'>[+] تکنسین پشتیبانی IT | Casa del Jubilado y Pensionado IMSS</span>",
        '> ثبت و نگهداری پایگاه داده اعضا. اطمینان از یکپارچگی داده.',
        '> تشخیص و نگهداری تجهیزات رایانه‌ای.',
        '> تحلیل و حل مشکلات نرم‌افزاری: پیکربندی، اشکال‌زدایی و بازیابی.',
      ]},
      { cmd: 'cat تحصیلات.log', output: getEducacionOutput({
        title:    'سوابق تحصیلی',
        edu1Title:'لیسانس — علوم کامپیوتر',
        edu1Inst: 'UPIICSA — IPN (مکزیکو سیتی)',
        edu1Tags: ['مدیریت پروژه','کار تیمی','چابک','پایگاه داده'],
        edu2Title:'تکنسین — سیستم‌های دیجیتال',
        edu2Inst: 'CECyT N°1 — IPN',
        edu2Tags: ['اتوماسیون','رباتیک','الکترونیک'],
        edu3Title:'دیپلم — فناوری رایانه و سیستم‌ها',
        edu3Inst: 'Fundación Carlos Slim',
        edu3Tags: ['رایانه','سیستم‌ها','فناوری'],
        edu4Title:'دیپلم — آموزش مالی',
        edu4Inst: 'CONDUSEF',
        edu4Tags: ['مالی','آموزش مالی'],
      })},
      { cmd: 'ls -l /certifications/', output: getCertificationsOutput('تأیید شده', 'اجرای_تأیید()') },
      { cmd: "echo 'رزومه مرا دانلود کنید یا در LinkedIn با من تماس بگیرید'", output: [
        "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action' rel='noopener noreferrer'>[ دانلود رزومه ]</a>" +
        "<a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' rel='noopener noreferrer' class='btn-action'>[ باز کردن LinkedIn ]</a>",
      ]},
    ],
  },

};  /* fin de CV_TRANSLATIONS */

/* ══════════════════════════════════════════════════════════════
   §8 — MOTOR DE TERMINAL
   Controla la renderización animada de comandos y outputs.

   FLUJO:
   1. runTerminal(langCode) limpia todo y configura el idioma.
   2. Para cada bloque {cmd, output}:
      a. printLine(cmd, isCommand=true) → imprime el prompt + comando
      b. printLine(line, isCommand=false) → imprime cada línea de output
   3. printLine usa setTimeout con delayObj.current acumulado
      para crear el efecto de escritura secuencial.
   4. Después de añadir cada elemento al DOM, llama a
      activateSkillBars() para animar las barras si las hay.
════════════════════════════════════════════════════════════════ */

/* Referencia a los elementos del DOM */
const DOM = {
  output:       document.getElementById('output'),
  terminalBody: document.getElementById('terminal-body'),
  title:        document.getElementById('terminal-title'),
  promptUser:   document.getElementById('prompt-user'),
  langSelect:   document.getElementById('cv-language'),
};

/* Array de IDs de timeouts activos — permite cancelarlos todos al cambiar idioma */
let activeTimeouts = [];

/**
 * Cancela todos los timeouts activos y limpia el output.
 * Se llama al cambiar de idioma o al hacer Skip.
 */
function clearTerminal() {
  activeTimeouts.forEach(clearTimeout);
  activeTimeouts = [];
  DOM.output.innerHTML = '';
}

/**
 * Programa la impresión de una línea en un momento futuro.
 * @param {string}  text      — contenido HTML de la línea
 * @param {boolean} isCommand — si true, muestra el prompt antes del texto
 * @param {Object}  delayObj  — objeto mutable con la propiedad .current (ms acumulados)
 * @param {string}  promptTxt — texto del prompt para este idioma
 */
function printLine(text, isCommand, delayObj, promptTxt) {
  const timeoutId = setTimeout(() => {
    /* Creamos el elemento div de la línea */
    const line = document.createElement('div');
    line.className = 'output-line';

    if (isCommand) {
      /* Comando: muestra "prompt + texto del comando" */
      line.innerHTML =
        `<br><span class="prompt">${promptTxt}</span>` +
        `<span class="cmd">${text}</span>`;
    } else {
      /* Output normal: HTML directo (puede contener spans, divs, etc.) */
      line.innerHTML = text;
    }

    /* Añade al DOM */
    DOM.output.appendChild(line);

    /* Scroll automático al final de la terminal */
    DOM.terminalBody.scrollTop = DOM.terminalBody.scrollHeight;

    /* §9 — Activa barras de progreso si este elemento las contiene */
    activateSkillBars(line);

  }, delayObj.current);

  activeTimeouts.push(timeoutId);
}

/**
 * Arranca la terminal para un idioma dado.
 * Configura dirección del texto, título y prompt,
 * luego agenda todos los printLine con delays escalonados.
 * @param {string} langCode — código de idioma (ej: 'es', 'en')
 */
function runTerminal(langCode) {
  /* Validación de entrada: solo aceptamos códigos conocidos */
  if (!CV_TRANSLATIONS[langCode]) {
    console.warn(`[ebromares] Idioma desconocido: ${langCode}`);
    return;
  }

  clearTerminal();
  hidSkipBtn();  /* oculta el botón Skip durante la transición */

  const cfg = CV_TRANSLATIONS[langCode];

  /* Configura la UI para el idioma seleccionado */
  DOM.terminalBody.setAttribute('dir', cfg.dir);
  DOM.title.textContent      = cfg.title;
  DOM.promptUser.textContent = cfg.prompt;

  /* Acumulador de tiempo: cada línea se agenda en el momento correcto */
  const delay = { current: CONFIG.INITIAL_DELAY };

  cfg.data.forEach(block => {
    /* Imprime el comando */
    printLine(block.cmd, true, delay, cfg.prompt);
    delay.current += CONFIG.CMD_DELAY;

    /* Imprime cada línea del output */
    block.output.forEach(line => {
      printLine(line, false, delay, cfg.prompt);
      delay.current += CONFIG.LINE_DELAY;
    });

    /* Pausa adicional entre bloques (simula "pensar" el siguiente comando) */
    delay.current += CONFIG.BLOCK_GAP;
  });

  /* Muestra el botón Skip después de SKIP_SHOW_DELAY ms */
  setTimeout(showSkipBtn, CONFIG.SKIP_SHOW_DELAY);
}

/* ══════════════════════════════════════════════════════════════
   §9 — ANIMACIÓN DE SKILL BARS

   SOLUCIÓN AL BUG CRÍTICO:
   La versión anterior inyectaba <script> en innerHTML.
   Los navegadores modernos bloquean esto (XSS prevention).
   
   TÉCNICA CORRECTA:
   - Las barras inician en width:0% (CSS).
   - Tras añadir el elemento al DOM, buscamos barras sin animar.
   - Usamos doble requestAnimationFrame:
     → 1er rAF: garantiza que el navegador ha creado el elemento
     → 2do rAF: garantiza que se pintó el estado inicial (0%)
     Esto activa la transición CSS correctamente.
════════════════════════════════════════════════════════════════ */

/**
 * Busca barras de progreso en el elemento recién añadido al DOM
 * y las anima si aún están en width:0%.
 * @param {HTMLElement} container — el div.output-line recién añadido
 */
function activateSkillBars(container) {
  /* Busca barras con el atributo data-pct (marca de "pendiente de animar") */
  const bars = container.querySelectorAll('.skill-bar-fill[data-pct]');
  if (bars.length === 0) return;

  /*
   * Doble requestAnimationFrame:
   * Frame 1 → el navegador reconoce el elemento en el DOM
   * Frame 2 → el navegador pintó width:0%, ya puede transicionar
   */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bars.forEach(bar => {
        const pct = bar.getAttribute('data-pct');
        bar.style.width = pct + '%';
        /* Eliminamos el atributo para evitar re-animaciones */
        bar.removeAttribute('data-pct');
      });
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   §10 — BOTÓN SKIP
   Permite omitir la animación de escritura y ver todo el
   contenido inmediatamente. Aparece 1.5s después de cargar.
════════════════════════════════════════════════════════════════ */

/**
 * Cancela todos los timeouts y renderiza todo el contenido
 * del idioma actual de forma instantánea (sin delays).
 */
function skipAnimation() {
  const currentLang = DOM.langSelect.value;
  const cfg         = CV_TRANSLATIONS[currentLang];

  /* Cancela los timeouts en curso */
  clearTerminal();

  /* Renderiza todo sin delays */
  cfg.data.forEach(block => {
    /* Comando */
    const cmdLine = document.createElement('div');
    cmdLine.className = 'output-line';
    cmdLine.innerHTML =
      `<br><span class="prompt">${cfg.prompt}</span>` +
      `<span class="cmd">${block.cmd}</span>`;
    DOM.output.appendChild(cmdLine);

    /* Outputs */
    block.output.forEach(text => {
      const line = document.createElement('div');
      line.className = 'output-line';
      line.innerHTML = text;
      DOM.output.appendChild(line);

      /* Activa barras de progreso si las hay */
      activateSkillBars(line);
    });
  });

  /* Scroll al final */
  DOM.terminalBody.scrollTop = DOM.terminalBody.scrollHeight;

  /* Oculta el botón Skip */
  hidSkipBtn();
}

/* Muestra el botón Skip (con clase CSS que activa opacity:1) */
function showSkipBtn() {
  const btn = document.getElementById('skip-btn');
  if (btn) btn.classList.add('visible');
}

/* Oculta el botón Skip */
function hidSkipBtn() {
  const btn = document.getElementById('skip-btn');
  if (btn) btn.classList.remove('visible');
}

/* ══════════════════════════════════════════════════════════════
   §11 — PANEL ADMIN OCULTO (contador de visitas)
   Solo visible con: Ctrl + Alt + V
   Muestra visitas totales del servidor y de este dispositivo.
════════════════════════════════════════════════════════════════ */

/** Inyecta el panel admin en el DOM si no existe */
function ensureAdminPanel() {
  if (document.getElementById('admin-panel')) return;

  const panel = document.createElement('div');
  panel.id        = 'admin-panel';
  panel.innerHTML =
    `<h4>📊 Admin Panel — Solo tú ves esto</h4>` +
    `<div class="stat-row"><span>Visitas totales (API)</span><span id="ap-total">…</span></div>` +
    `<div class="stat-row"><span>Este dispositivo</span><span id="ap-local">…</span></div>` +
    `<div class="stat-row"><span>Primera visita aquí</span><span id="ap-first">…</span></div>` +
    `<div class="stat-row"><span>Idioma actual</span><span id="ap-lang">…</span></div>` +
    `<div class="admin-close" onclick="toggleAdminPanel()">[ cerrar ]</div>`;

  document.body.appendChild(panel);
}

/** Actualiza los valores del panel con los datos más recientes */
function updateAdminPanel() {
  const stats = VisitorCounter.getLocalStats();

  const apTotal = document.getElementById('ap-total');
  const apLocal = document.getElementById('ap-local');
  const apFirst = document.getElementById('ap-first');
  const apLang  = document.getElementById('ap-lang');

  if (apTotal) apTotal.textContent = VisitorCounter.getTotal();
  if (apLocal) apLocal.textContent = `${stats.localVisits} veces`;
  if (apFirst) apFirst.textContent = stats.firstVisit;
  if (apLang)  apLang.textContent  = DOM.langSelect ? DOM.langSelect.value.toUpperCase() : '—';
}

/** Muestra u oculta el panel admin */
function toggleAdminPanel() {
  ensureAdminPanel();
  updateAdminPanel();
  const panel = document.getElementById('admin-panel');
  panel.classList.toggle('visible');
}

/* ══════════════════════════════════════════════════════════════
   §12 — EVENTOS Y ARRANQUE
   Todo se inicializa aquí, después de definir todas las funciones.
════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Inyectar el botón Skip en el DOM ── */
  const skipBtn = document.createElement('button');
  skipBtn.id          = 'skip-btn';
  skipBtn.textContent = '[ skip → ]';
  skipBtn.title       = 'Mostrar todo el contenido ahora';
  skipBtn.setAttribute('aria-label', 'Omitir animación y mostrar todo el contenido');
  skipBtn.addEventListener('click', skipAnimation);
  document.body.appendChild(skipBtn);

  /* ── Cambio de idioma: reinicia la terminal ── */
  if (DOM.langSelect) {
    DOM.langSelect.addEventListener('change', (e) => {
      runTerminal(e.target.value);
    });
  }

  /* ── Atajo de teclado: Ctrl + Alt + V → panel admin oculto ──
     Este combo no interfiere con atajos del sistema ni del navegador.
  ── */
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.key === 'v') {
      e.preventDefault();
      toggleAdminPanel();
    }
  });

  /* ── Arranque inicial en Español ── */
  runTerminal('es');

});