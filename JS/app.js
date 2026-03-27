// ==========================================
// 1. MOTOR DEL FONDO MATRIX
// ==========================================
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; 
canvas.height = window.innerHeight;

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*アイウエオカキクケコサシスセソタチツテト';
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 35);
window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });

// ==========================================
// 2. DATA / DICCIONARIO MULTILINGÜE
// ==========================================
// Función Helper para generar el bloque de certificaciones repetitivo en cualquier idioma
function getCertificationsOutput(statusText, btnText) {
    const certs = [
        "Microsoft Certified: Azure Fundamentals",
        "CDP Certified Administrator - Private Cloud Base",
        "Python 101 for Data Science",
        "Kali Linux Seguridad Informática",
        "Desarrollo Web (HTML5, CSS3, JS, PHP, MySQL)",
        "Implementación de Scrum y XP"
    ];
    let output = ["<span class='section-title'>[ CERTIFICACIONES & STACK ]</span>"];
    certs.forEach(cert => {
        // Sustituye '#' por el enlace real a tus certificados en producción
        output.push(`<details class='cert-details'><summary>${cert}</summary><div class='cert-link-container'>↳ Status: <span style='color:#27c93f'>[ ${statusText} ]</span> <br><a href='#' target='_blank' class='btn-verify'>${btnText}</a></div></details>`);
    });
    return output;
}

const cvTranslations = {
    es: {
        dir: "ltr", title: "root@ebromares:~", prompt: "root@ebromares:~$ ",
        data: [
            { cmd: "./init_profile.sh", output: [
                "Iniciando volcado de memoria...", "[OK] Datos biométricos verificados.", "==================================================",
                "<span class='highlight'>NOMBRE:</span> Ing. Mario Jafet Ebromares Fuentes",
                "<span class='highlight'>PERFIL:</span> Profesional en Ciencias de la Informática / Data Engineer",
                "==================================================",
                "RESUMEN:", "> Apasionado por la tecnología y la innovación.", "> Capacidad analítica para el procesamiento de datos y arquitecturas cloud."
            ]},
            { cmd: "cat experiencia.log", output: [
                "<span class='section-title'>[ EXPERIENCIA PROFESIONAL ]</span>", "",
                "<span class='highlight'>[+] INGENIERO DE DATOS | Martinexsa</span>", "> Monitoreo y optimización de clusters en entornos cloud.",
                "<span class='highlight'>[+] INGENIERO DE SOPORTE | Grupo Tecno</span>", "> Recuperación de datos críticos desde discos duros dañados."
            ]},
            { cmd: "ls -l /certificaciones/", output: getCertificationsOutput("Validado", "Ejecutar_Verificación()") },
            { cmd: "echo 'Acciones:'", output: [ "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action'>[ Descargar_CV.pdf ]</a> <a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' class='btn-action'>[ Abrir_LinkedIn ]</a>" ] }
        ]
    },
    en: {
        dir: "ltr", title: "root@ebromares:~", prompt: "root@ebromares:~$ ",
        data: [
            { cmd: "./init_profile.sh", output: [
                "Initiating memory dump...", "[OK] Biometric data verified.", "==================================================",
                "<span class='highlight'>NAME:</span> Eng. Mario Jafet Ebromares Fuentes",
                "<span class='highlight'>PROFILE:</span> Computer Science Professional / Data Engineer",
                "==================================================",
                "SUMMARY:", "> Passionate about technology and innovation.", "> Analytical capacity for data processing and cloud architectures."
            ]},
            { cmd: "cat experience.log", output: [
                "<span class='section-title'>[ PROFESSIONAL EXPERIENCE ]</span>", "",
                "<span class='highlight'>[+] DATA ENGINEER | Martinexsa</span>", "> Cluster monitoring and optimization in cloud environments.",
                "<span class='highlight'>[+] IT SUPPORT ENGINEER | Grupo Tecno</span>", "> Critical data recovery from damaged HDDs."
            ]},
            { cmd: "ls -l /certifications/", output: getCertificationsOutput("Validated", "Run_Verification()") },
            { cmd: "echo 'Actions:'", output: [ "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action'>[ Download_CV.pdf ]</a> <a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' class='btn-action'>[ Open_LinkedIn ]</a>" ] }
        ]
    },
    de: {
        dir: "ltr", title: "root@ebromares:~", prompt: "root@ebromares:~$ ",
        data: [
            { cmd: "./init_profile.sh", output: [
                "Speicherauszug wird initiiert...", "[OK] Biometrische Daten verifiziert.", "==================================================",
                "<span class='highlight'>NAME:</span> Ing. Mario Jafet Ebromares Fuentes",
                "<span class='highlight'>PROFIL:</span> Informatiker / Data Engineer",
                "==================================================",
                "ZUSAMMENFASSUNG:", "> Leidenschaft für Technologie und Innovation.", "> Analytische Fähigkeiten für Datenverarbeitung und Cloud-Architekturen."
            ]},
            { cmd: "cat erfahrung.log", output: [
                "<span class='section-title'>[ BERUFSERFAHRUNG ]</span>", "",
                "<span class='highlight'>[+] DATA ENGINEER | Martinexsa</span>", "> Cluster-Überwachung und Optimierung in Cloud-Umgebungen.",
                "<span class='highlight'>[+] IT SUPPORT ENGINEER | Grupo Tecno</span>", "> Kritische Datenrettung von beschädigten Festplatten."
            ]},
            { cmd: "ls -l /zertifizierungen/", output: getCertificationsOutput("Bestätigt", "Verifizierung_ausführen()") },
            { cmd: "echo 'Aktionen:'", output: [ "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action'>[ Lebenslauf_Download.pdf ]</a> <a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' class='btn-action'>[ LinkedIn_öffnen ]</a>" ] }
        ]
    },
    ja: {
        dir: "ltr", title: "root@ebromares:~", prompt: "root@ebromares:~$ ",
        data: [
            { cmd: "./init_profile.sh", output: [
                "メモリダンプを開始しています...", "[OK] 生体認証データが検証されました。", "==================================================",
                "<span class='highlight'>名前:</span> Mario Jafet Ebromares Fuentes 技師",
                "<span class='highlight'>プロフィール:</span> コンピュータサイエンス専門家 / データエンジニア",
                "==================================================",
                "概要:", "> テクノロジーとイノベーションへの情熱。", "> データ処理とクラウドアーキテクチャの分析能力。"
            ]},
            { cmd: "cat 職歴.log", output: [
                "<span class='section-title'>[ 職歴 ]</span>", "",
                "<span class='highlight'>[+] データエンジニア | Martinexsa</span>", "> クラウド環境でのクラスター監視と最適化。",
                "<span class='highlight'>[+] ITサポートエンジニア | Grupo Tecno</span>", "> 破損したHDDからの重要なデータ復旧。"
            ]},
            { cmd: "ls -l /資格/", output: getCertificationsOutput("検証済み", "検証を実行する()") },
            { cmd: "echo 'アクション:'", output: [ "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action'>[ 履歴書のダウンロード.pdf ]</a> <a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' class='btn-action'>[ LinkedInを開く ]</a>" ] }
        ]
    },
    ru: {
        dir: "ltr", title: "root@ebromares:~", prompt: "root@ebromares:~$ ",
        data: [
            { cmd: "./init_profile.sh", output: [
                "Инициализация дампа памяти...", "[OK] Биометрические данные подтверждены.", "==================================================",
                "<span class='highlight'>ИМЯ:</span> Инж. Mario Jafet Ebromares Fuentes",
                "<span class='highlight'>ПРОФИЛЬ:</span> Специалист по информатике / Data Engineer",
                "==================================================",
                "РЕЗЮМЕ:", "> Увлечен технологиями и инновациями."
            ]},
            { cmd: "cat опыт.log", output: [
                "<span class='section-title'>[ ОПЫТ РАБОТЫ ]</span>", "",
                "<span class='highlight'>[+] ИНЖЕНЕР ДАННЫХ | Martinexsa</span>", "> Мониторинг и оптимизация кластеров в облачных средах."
            ]},
            { cmd: "ls -l /certifications/", output: getCertificationsOutput("Проверено", "Запустить_проверку()") },
            { cmd: "echo 'Действия:'", output: [ "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action'>[ Скачать_CV.pdf ]</a> <a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' class='btn-action'>[ Открыть_LinkedIn ]</a>" ] }
        ]
    },
    pt: {
        dir: "ltr", title: "root@ebromares:~", prompt: "root@ebromares:~$ ",
        data: [
            { cmd: "./init_profile.sh", output: [
                "Iniciando dump de memória...", "[OK] Dados verificados.", "==================================================",
                "<span class='highlight'>NOME:</span> Eng. Mario Jafet Ebromares Fuentes",
                "<span class='highlight'>PERFIL:</span> Profissional em Informática / Data Engineer",
                "==================================================",
                "RESUMO:", "> Apaixonado por tecnologia e inovação."
            ]},
            { cmd: "cat experiencia.log", output: [
                "<span class='section-title'>[ EXPERIÊNCIA ]</span>", "",
                "<span class='highlight'>[+] ENGENHEIRO DE DADOS | Martinexsa</span>", "> Monitoramento de clusters em nuvem."
            ]},
            { cmd: "ls -l /certifications/", output: getCertificationsOutput("Validado", "Executar_Verificação()") },
            { cmd: "echo 'Ações:'", output: [ "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action'>[ Baixar_CV.pdf ]</a> <a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' class='btn-action'>[ Abrir_LinkedIn ]</a>" ] }
        ]
    },
    zh: {
        dir: "ltr", title: "root@ebromares:~", prompt: "root@ebromares:~$ ",
        data: [
            { cmd: "./init_profile.sh", output: [
                "正在启动内存转储...", "[OK] 生物识别数据已验证。", "==================================================",
                "<span class='highlight'>姓名:</span> Mario Jafet Ebromares Fuentes 工程师",
                "<span class='highlight'>简介:</span> 计算机科学专业人员 / Data Engineer",
                "==================================================",
                "摘要:", "> 热爱技术与创新。"
            ]},
            { cmd: "cat work.log", output: [
                "<span class='section-title'>[ 工作经验 ]</span>", "",
                "<span class='highlight'>[+] 数据工程师 | Martinexsa</span>", "> 云环境中的集群监控和优化。"
            ]},
            { cmd: "ls -l /certifications/", output: getCertificationsOutput("已验证", "运行验证()") },
            { cmd: "echo '操作:'", output: [ "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action'>[ 下载_CV.pdf ]</a> <a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' class='btn-action'>[ 打开_LinkedIn ]</a>" ] }
        ]
    },
    ar: {
        dir: "rtl", title: "root@ebromares:~", prompt: "root@ebromares:~$ ",
        data: [
            { cmd: "./init_profile.sh", output: [
                "جاري تفريغ الذاكرة...", "[OK] تم التحقق من البيانات.", "==================================================",
                "<span class='highlight'>الاسم:</span> المهندس Mario Jafet Ebromares Fuentes",
                "<span class='highlight'>الملف:</span> متخصص في علوم الكمبيوتر / Data Engineer",
                "==================================================",
                "ملخص:", "> شغوف بالتكنولوجيا والابتكار."
            ]},
            { cmd: "cat experience.log", output: [
                "<span class='section-title'>[ الخبرة المهنية ]</span>", "",
                "<span class='highlight'>[+] مهندس بيانات | Martinexsa</span>", "> مراقبة وتحسين المجموعات السحابية."
            ]},
            { cmd: "ls -l /certifications/", output: getCertificationsOutput("موثق", "تشغيل_التحقق()") },
            { cmd: "echo 'الإجراءات:'", output: [ "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action'>[ تحميل_CV.pdf ]</a> <a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' class='btn-action'>[ فتح_لينكد_إن ]</a>" ] }
        ]
    },
    fa: {
        dir: "rtl", title: "root@ebromares:~", prompt: "root@ebromares:~$ ",
        data: [
            { cmd: "./init_profile.sh", output: [
                "شروع تخلیه حافظه...", "[OK] داده ها تایید شد.", "==================================================",
                "<span class='highlight'>نام:</span> مهندس Mario Jafet Ebromares Fuentes",
                "<span class='highlight'>نمایه:</span> متخصص علوم کامپیوتر / Data Engineer",
                "==================================================",
                "خلاصه:", "> علاقه مند به تکنولوژی و نوآوری."
            ]},
            { cmd: "cat work.log", output: [
                "<span class='section-title'>[ تجربه کاری ]</span>", "",
                "<span class='highlight'>[+] مهندس داده | Martinexsa</span>", "> نظارت بر کلاسترها در فضای ابری."
            ]},
            { cmd: "ls -l /certifications/", output: getCertificationsOutput("تایید شده", "اجرای_تایید()") },
            { cmd: "echo 'عملیات:'", output: [ "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action'>[ دانلود_CV.pdf ]</a> <a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' class='btn-action'>[ لینکدین ]</a>" ] }
        ]
    }
};

// ==========================================
// 3. MOTOR DE TERMINAL (LOGICA)
// ==========================================
const outputDiv = document.getElementById('output');
const terminalBody = document.getElementById('terminal-body');
const terminalTitle = document.getElementById('terminal-title');
const promptUser = document.getElementById('prompt-user');
let activeTimeouts = [];

// Función para reiniciar la terminal al cambiar de idioma
function clearTerminalProcesses() {
    activeTimeouts.forEach(clearTimeout);
    activeTimeouts = [];
    outputDiv.innerHTML = '';
}

// Inyección y scroll automático
function printLine(text, isCommand, delayObj, promptTxt) {
    const timeoutId = setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'output-line';
        if (isCommand) { 
            line.innerHTML = `<br><span class="prompt">${promptTxt}</span><span class="cmd">${text}</span>`; 
        } else { 
            line.innerHTML = text; 
        }
        outputDiv.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }, delayObj.current);
    
    activeTimeouts.push(timeoutId);
}

// Ejecución general
function runTerminal(langCode) {
    clearTerminalProcesses();
    const config = cvTranslations[langCode];
    
    terminalBody.setAttribute("dir", config.dir);
    terminalTitle.textContent = config.title;
    promptUser.textContent = config.prompt;
    
    let delayObj = { current: 500 };

    config.data.forEach(block => {
        printLine(block.cmd, true, delayObj, config.prompt);
        delayObj.current += 800; // Simula que el usuario piensa el comando
        
        block.output.forEach(line => { 
            printLine(line, false, delayObj, config.prompt); 
            delayObj.current += 100; // Velocidad de renderizado del texto
        });
        delayObj.current += 600; 
    });
}

// Escuchador de eventos para el select de idiomas
document.getElementById('cv-language').addEventListener('change', (e) => {
    runTerminal(e.target.value);
});

// Auto-inicio en Español
document.addEventListener("DOMContentLoaded", () => {
    runTerminal('es');
});