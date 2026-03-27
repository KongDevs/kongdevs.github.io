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
// FUNCIÓN GENERADORA DE CERTIFICACIONES DINÁMICAS
// ==========================================
function getCertificationsOutput(statusText, btnText) {
    // 1. Convertimos el arreglo en un arreglo de objetos (clave-valor)
    const certs = [
        {
            name: "Microsoft Certified: Azure Fundamentals",
            url: "https://learn.microsoft.com/es-mx/users/mariojafetebromaresfuentes-6996/credentials/24cf43dbf49a53f4?ref=https%3A%2F%2Fwww.linkedin.com%2F"
        },
        {
            name: "CDP Certified Administrator - Private Cloud Base",
            url: "https://www.credly.com/badges/4f8cbe38-dae9-4665-957a-8962f292e654/linked_in_profile" 
        },
        {
            name: "Python 101 for Data Science IBM",
            url: "https://courses.cognitiveclass.ai/certificates/fd301bfa58754ab2b7de4d74a9b76c8d" 
        },
        {
            name: "Kali Linux. Cybersecurity. Penetration Testing. Hacking.",
            url: "https://www.udemy.com/certificate/UC-1f9474f0-2033-4da5-8677-02b9ebb58281/"
        },
        {
            name: "Full-Stack Web Development with HTML5, CSS3, JavaScript (AJAX), PHP, and MySQL.",
            url: "https://www.udemy.com/certificate/UC-901739a4-9d21-49d6-bfd9-e27e6995ccc6/" 
        },
        {
            name: "How to Implement Scrum and Extreme Programming (XP) in Your Company or Project.",
            url: "https://www.udemy.com/certificate/UC-c61fddef-ba59-4a0d-8d51-dc8071465c70/"
         },
    ];

    let output = ["<span class='section-title'>[ CERTIFICACIONES & STACK ]</span>"];
    
    // 2. Iteramos sobre los objetos extrayendo 'cert.name' y 'cert.url'
    certs.forEach(cert => {
        output.push(
            `<details class='cert-details'>
                <summary>${cert.name}</summary>
                <div class='cert-link-container'>
                    ↳ Status: <span style='color:#27c93f'>[ ${statusText} ]</span> <br>
                    <a href='${cert.url}' target='_blank' class='btn-verify'>${btnText}</a>
                </div>
            </details>`
        );
    });
    
    return output;

}

const cvTranslations = {
    es: {
        dir: "ltr", title: "root@ebromares:~", prompt: "root@ebromares:~$ ",
        data: [
            { cmd: "./init_profile.sh", output: [
                "Iniciando sistema...", 
                "Iniciando memoria...",
                "Buscando data...",
                "Humano localizado...",
                "[OK] Datos biométricos verificados.",
                "==================================================",
                "<span class='highlight'>NOMBRE:</span> Lic. Mario Jafet Ebromares Fuentes",
                "<span class='highlight'>PERFIL:</span> Profesional en Ciencias de la Informática / Data Engineer / Ciberseguridad",
                "==================================================",
                "RESUMEN:", 
                "> Apasionado por la tecnología y la innovación.",
                "> Orgullosamente Politecnico",
                "> Creativo y gran autodidacta", 
                "> Capacidad analítica para el procesamiento de datos y arquitecturas cloud."
            ]},
            { cmd: "cat experiencia.log", output: [
                "<span class='section-title'>[ EXPERIENCIA PROFESIONAL ]</span>", "",
                "<span class='highlight'>[+] INGENIERO DE DATOS | Martinexsa </span>", 
                "> Supervisión integral de workflows mediante Apache Airflow, incluyendo el seguimiento de ejecución de DAGs, validación de task instances y gestión de dependencias. Implementación de estrategias de observabilidad para detección temprana de fallos, asegurando la continuidad operativa de pipelines batch y programados.",
                "> Monitoreo del estado y rendimiento del clúster en plataformas tipo Cloudera (CDH/CDP), evaluando métricas críticas como uso de recursos (CPU, memoria, I/O) y salud de servicios (HDFS, YARN). Diagnóstico de incidentes mediante herramientas como Hue y consolas SSH (MobaXTerm), garantizando alta disponibilidad y eficiencia del ecosistema Big Data.",
                "> Ejecución, optimización y validación de consultas en Impala, enfocadas en actualización de catálogos, validación de integridad de datos y soporte a procesos de ingesta. Uso de clientes como DBeaver para interacción eficiente con el Data Warehouse y análisis de resultados.",
                "> Desarrollo de scripts en Python para identificación de patrones, generación de alertas y procesamiento de datasets. Implementación de lógica analítica para clasificación, ordenamiento y depuración de datos, contribuyendo a la calidad y gobernanza de la información.",
                "> Definición de arquitecturas de datos escalables y resilientes utilizando herramientas de modelado como Draw.io, incluyendo la documentación de flujos de datos, componentes del ecosistema (ingesta, almacenamiento, procesamiento) y mejores prácticas basadas en arquitecturas tipo Lambda o Data Lakehouse.",
                "<span class='highlight'>[+] INGENIERO DE SOPORTE | Centro Medico DALINDE </span>", 
                "> Ejecución de mantenimiento preventivo y correctivo en equipos de cómputo y periféricos, incluyendo diagnóstico de fallas a nivel hardware, reemplazo de componentes y optimización del rendimiento. Ensamblaje de PCs bajo criterios de compatibilidad, eficiencia térmica y estabilidad operativa.",
                "> Estructuración, depuración y normalización de bases de datos de pacientes, asegurando integridad, consistencia y disponibilidad de la información. Aplicación de buenas prácticas en manejo de datos, incluyendo validación, limpieza y organización para facilitar su explotación y análisis.",
                "> Implementación de técnicas de recuperación de información en dispositivos de almacenamiento (HDD), incluyendo diagnóstico de fallos lógicos y físicos, uso de herramientas especializadas y aplicación de estrategias para minimizar pérdida de datos y garantizar la continuidad operativa.",
                "<span class='highlight'>[+] TECNICO DE SOPORTE TI | Casa del Jubilado y Pensionado IMSS </span>", 
                "> Registro, actualización y mantenimiento de información de integrantes en bases de datos, garantizando integridad, consistencia y correcta estructuración de los datos mediante prácticas de validación y control.",
                "> Diagnóstico de fallas en equipos de cómputo, ejecución de mantenimiento preventivo y correctivo, así como reemplazo de componentes dañados, asegurando la continuidad operativa y el rendimiento óptimo de los sistemas.",
                "> Análisis y solución de problemas a nivel de software, incluyendo configuración, depuración y restauración de sistemas, aplicando metodologías de troubleshooting para minimizar tiempos de inactividad y mejorar la estabilidad del entorno."
            ]},
            { cmd: "ls -l /certificaciones/", output: getCertificationsOutput("Validado", "Ejecutar_Verificación()") },
            { cmd: "echo 'Te invito a descargar mi cv si te gusto mi trabajo o contactarme por linkedin'", output: [ "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action'>[ Descargar_CV.pdf ]</a> <a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' class='btn-action'>[ Abrir_LinkedIn ]</a>" ] }
        ]
    },
    en: {
        dir: "ltr", title: "root@ebromares:~", prompt: "root@ebromares:~$ ",
        data: [
            { cmd: "./init_profile.sh", output: [
                "System initializing...", 
                "Memory initializing...",
                "Searching for data...",
                "Human located...",
                "[OK] Biometric data verified.",
                "==================================================",
                "<span class='highlight'>NAME:</span> Lic. Mario Jafet Ebromares Fuentes",
                "<span class='highlight'>PROFILE:</span> Computer Science Professional / Data Engineer / Cybersecurity",
                "==================================================",
                "SUMMARY:", 
                "> Passionate about technology and innovation.",
                "> Proudly Polytechnic",
                "> Creative and highly self-taught", 
                "> Analytical capacity for data processing and cloud architectures."
            ]},
            { cmd: "cat experience.log", output: [
                "<span class='section-title'>[ PROFESSIONAL EXPERIENCE ]</span>", "",
                "<span class='highlight'>[+] DATA ENGINEER | Martinexsa </span>", 
                "> Comprehensive workflow supervision using Apache Airflow, including tracking DAG execution, task instance validation, and dependency management. Implementation of observability strategies for early fault detection, ensuring operational continuity of batch and scheduled pipelines.",
                "> Cluster health and performance monitoring on Cloudera-like platforms (CDH/CDP), evaluating critical metrics such as resource usage (CPU, memory, I/O) and service health (HDFS, YARN). Incident diagnosis using tools like Hue and SSH consoles (MobaXTerm), ensuring high availability and efficiency of the Big Data ecosystem.",
                "> Execution, optimization, and validation of queries in Impala, focused on catalog updates, data integrity validation, and support for ingestion processes. Use of clients like DBeaver for efficient interaction with the Data Warehouse and results analysis.",
                "> Development of Python scripts for pattern identification, alert generation, and dataset processing. Implementation of analytical logic for data classification, sorting, and debugging, contributing to information quality and governance.",
                "> Definition of scalable and resilient data architectures using modeling tools like Draw.io, including documentation of data flows, ecosystem components (ingestion, storage, processing), and best practices based on Lambda or Data Lakehouse architectures.",
                "<span class='highlight'>[+] IT SUPPORT ENGINEER | Centro Medico DALINDE </span>", 
                "> Execution of preventive and corrective maintenance on computer equipment and peripherals, including hardware-level fault diagnosis, component replacement, and performance optimization. PC assembly under criteria of compatibility, thermal efficiency, and operational stability.",
                "> Structuring, debugging, and normalizing patient databases, ensuring data integrity, consistency, and availability. Application of best practices in data management, including validation, cleaning, and organization to facilitate exploitation and analysis.",
                "> Implementation of information recovery techniques on storage devices (HDD), including diagnosis of logical and physical faults, use of specialized tools, and application of strategies to minimize data loss and ensure operational continuity.",
                "<span class='highlight'>[+] IT SUPPORT TECHNICIAN | Casa del Jubilado y Pensionado IMSS </span>", 
                "> Registration, updating, and maintenance of member information in databases, ensuring integrity, consistency, and correct data structuring through validation and control practices.",
                "> Computer equipment fault diagnosis, execution of preventive and corrective maintenance, as well as damaged component replacement, ensuring operational continuity and optimal system performance.",
                "> Software-level problem analysis and resolution, including system configuration, debugging, and restoration, applying troubleshooting methodologies to minimize downtime and improve environment stability."
            ]},
            { cmd: "ls -l /certifications/", output: getCertificationsOutput("Validated", "Run_Verification()") },
            { cmd: "echo 'I invite you to download my CV if you liked my work or contact me via LinkedIn'", output: [ "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action'>[ Download_CV.pdf ]</a> <a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' class='btn-action'>[ Open_LinkedIn ]</a>" ] }
        ]
    },
    de: {
        dir: "ltr", title: "root@ebromares:~", prompt: "root@ebromares:~$ ",
        data: [
            { cmd: "./init_profile.sh", output: [
                "System wird initialisiert...", 
                "Speicher wird initialisiert...",
                "Suche nach Daten...",
                "Mensch lokalisiert...",
                "[OK] Biometrische Daten verifiziert.",
                "==================================================",
                "<span class='highlight'>NAME:</span> Lic. Mario Jafet Ebromares Fuentes",
                "<span class='highlight'>PROFIL:</span> Informatiker / Data Engineer / Cybersicherheit",
                "==================================================",
                "ZUSAMMENFASSUNG:", 
                "> Leidenschaft für Technologie und Innovation.",
                "> Stolzer Absolvent des Polytechnikums",
                "> Kreativ und sehr autodidaktisch", 
                "> Analytische Fähigkeiten für Datenverarbeitung und Cloud-Architekturen."
            ]},
            { cmd: "cat erfahrung.log", output: [
                "<span class='section-title'>[ BERUFSERFAHRUNG ]</span>", "",
                "<span class='highlight'>[+] DATA ENGINEER | Martinexsa </span>", 
                "> Umfassende Workflow-Überwachung mittels Apache Airflow, einschließlich der Verfolgung der DAG-Ausführung, der Validierung von Task-Instanzen und des Abhängigkeitsmanagements. Implementierung von Observability-Strategien zur frühzeitigen Fehlererkennung.",
                "> Überwachung des Zustands und der Leistung von Clustern auf Cloudera-Plattformen (CDH/CDP), Auswertung kritischer Metriken wie Ressourcennutzung (CPU, Speicher, E/O) und Dienstintegrität (HDFS, YARN). Fehlerdiagnose mit Tools wie Hue und SSH-Konsolen (MobaXTerm).",
                "> Ausführung, Optimierung und Validierung von Abfragen in Impala, fokussiert auf Katalogaktualisierungen, Datenintegritätsprüfung und Unterstützung von Ingestion-Prozessen. Nutzung von Clients wie DBeaver für effiziente Interaktion mit dem Data Warehouse.",
                "> Entwicklung von Python-Skripten zur Mustererkennung, Alarmgenerierung und Datensatzverarbeitung. Implementierung analytischer Logik zur Klassifizierung, Sortierung und Bereinigung von Daten.",
                "> Definition skalierbarer und belastbarer Datenarchitekturen mit Modellierungstools wie Draw.io, einschließlich der Dokumentation von Datenflüssen, Ökosystemkomponenten und Best Practices basierend auf Lambda- oder Data Lakehouse-Architekturen.",
                "<span class='highlight'>[+] IT SUPPORT ENGINEER | Centro Medico DALINDE </span>", 
                "> Durchführung von vorbeugender und korrigierender Wartung an Computerausrüstung und Peripheriegeräten, einschließlich Fehlerdiagnose auf Hardwareebene, Komponentenaustausch und Leistungsoptimierung.",
                "> Strukturierung, Bereinigung und Normalisierung von Patientendatenbanken zur Gewährleistung von Datenintegrität, Konsistenz und Verfügbarkeit.",
                "> Implementierung von Datenwiederherstellungstechniken auf Speichergeräten (HDD), einschließlich Diagnose logischer und physischer Fehler und Anwendung von Strategien zur Minimierung von Datenverlusten.",
                "<span class='highlight'>[+] IT SUPPORT TECHNICIAN | Casa del Jubilado y Pensionado IMSS </span>", 
                "> Registrierung, Aktualisierung und Pflege von Mitgliederinformationen in Datenbanken, Gewährleistung von Integrität, Konsistenz und korrekter Datenstrukturierung.",
                "> Fehlerdiagnose an Computern, Durchführung von vorbeugender und korrigierender Wartung sowie Austausch beschädigter Komponenten.",
                "> Analyse und Lösung von Problemen auf Softwareebene, einschließlich Systemkonfiguration, Debugging und Wiederherstellung unter Anwendung von Troubleshooting-Methoden."
            ]},
            { cmd: "ls -l /zertifizierungen/", output: getCertificationsOutput("Verifiziert", "Überprüfung_ausführen()") },
            { cmd: "echo 'Laden Sie meinen Lebenslauf herunter oder kontaktieren Sie mich auf LinkedIn'", output: [ "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action'>[ Lebenslauf_herunterladen.pdf ]</a> <a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' class='btn-action'>[ LinkedIn_öffnen ]</a>" ] }
        ]
    },
    pt: {
        dir: "ltr", title: "root@ebromares:~", prompt: "root@ebromares:~$ ",
        data: [
            { cmd: "./init_profile.sh", output: [
                "Iniciando sistema...", 
                "Iniciando memória...",
                "Buscando dados...",
                "Humano localizado...",
                "[OK] Dados biométricos verificados.",
                "==================================================",
                "<span class='highlight'>NOME:</span> Lic. Mario Jafet Ebromares Fuentes",
                "<span class='highlight'>PERFIL:</span> Profissional em Ciência da Computação / Engenheiro de Dados / Cibersegurança",
                "==================================================",
                "RESUMO:", 
                "> Apaixonado por tecnologia e inovação.",
                "> Orgulhosamente Politécnico",
                "> Criativo e altamente autodidata", 
                "> Capacidade analítica para processamento de dados e arquiteturas em nuvem."
            ]},
            { cmd: "cat experiencia.log", output: [
                "<span class='section-title'>[ EXPERIÊNCIA PROFISSIONAL ]</span>", "",
                "<span class='highlight'>[+] ENGENHEIRO DE DADOS | Martinexsa </span>", 
                "> Supervisão abrangente de fluxos de trabalho usando Apache Airflow, incluindo rastreamento de execução de DAGs, validação de instâncias de tarefas e gerenciamento de dependências. Implementação de estratégias de observabilidade para detecção precoce de falhas.",
                "> Monitoramento do status e desempenho do cluster em plataformas tipo Cloudera (CDH/CDP), avaliando métricas críticas como uso de recursos (CPU, memória, E/S) e integridade dos serviços (HDFS, YARN). Diagnóstico de incidentes utilizando ferramentas como Hue e consoles SSH.",
                "> Execução, otimização e validação de consultas no Impala, com foco em atualizações de catálogos, validação de integridade de dados e suporte a processos de ingestão. Uso de clientes como DBeaver para interação com o Data Warehouse.",
                "> Desenvolvimento de scripts em Python para identificação de padrões, geração de alertas e processamento de conjuntos de dados. Implementação de lógica analítica para classificação, ordenação e depuração de dados.",
                "> Definição de arquiteturas de dados escaláveis e resilientes usando ferramentas de modelagem como Draw.io, incluindo documentação de fluxos de dados, componentes do ecossistema e melhores práticas baseadas em arquiteturas Lambda ou Data Lakehouse.",
                "<span class='highlight'>[+] ENGENHEIRO DE SUPORTE | Centro Medico DALINDE </span>", 
                "> Execução de manutenção preventiva e corretiva em equipamentos de informática e periféricos, incluindo diagnóstico de falhas em nível de hardware, substituição de componentes e otimização de desempenho.",
                "> Estruturação, depuração e normalização de bancos de dados de pacientes, garantindo integridade, consistência e disponibilidade dos dados.",
                "> Implementação de técnicas de recuperação de informações em dispositivos de armazenamento (HDD), incluindo diagnóstico de falhas lógicas e físicas e aplicação de estratégias para minimizar a perda de dados.",
                "<span class='highlight'>[+] TÉCNICO DE SUPORTE TI | Casa del Jubilado y Pensionado IMSS </span>", 
                "> Registro, atualização e manutenção de informações de membros em bancos de dados, garantindo integridade e correta estruturação dos dados através de práticas de validação.",
                "> Diagnóstico de falhas em computadores, execução de manutenção preventiva e corretiva, bem como substituição de componentes danificados.",
                "> Análise e resolução de problemas em nível de software, incluindo configuração de sistema, depuração e restauração, aplicando metodologias de solução de problemas."
            ]},
            { cmd: "ls -l /certificacoes/", output: getCertificationsOutput("Validado", "Executar_Verificacao()") },
            { cmd: "echo 'Convido você a baixar meu currículo se gostou do meu trabalho ou me contate pelo LinkedIn'", output: [ "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action'>[ Baixar_CV.pdf ]</a> <a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' class='btn-action'>[ Abrir_LinkedIn ]</a>" ] }
        ]
    },
    ru: {
        dir: "ltr", title: "root@ebromares:~", prompt: "root@ebromares:~$ ",
        data: [
            { cmd: "./init_profile.sh", output: [
                "Инициализация системы...", 
                "Инициализация памяти...",
                "Поиск данных...",
                "Человек обнаружен...",
                "[OK] Биометрические данные подтверждены.",
                "==================================================",
                "<span class='highlight'>ИМЯ:</span> Lic. Mario Jafet Ebromares Fuentes",
                "<span class='highlight'>ПРОФИЛЬ:</span> Специалист по информатике / Data Engineer / Кибербезопасность",
                "==================================================",
                "РЕЗЮМЕ:", 
                "> Увлечен технологиями и инновациями.",
                "> Гордый выпускник Политехнического института",
                "> Креативный и способный к самообучению", 
                "> Аналитические способности для обработки данных и облачных архитектур."
            ]},
            { cmd: "cat experience.log", output: [
                "<span class='section-title'>[ ПРОФЕССИОНАЛЬНЫЙ ОПЫТ ]</span>", "",
                "<span class='highlight'>[+] ИНЖЕНЕР ДАННЫХ | Martinexsa </span>", 
                "> Комплексный контроль рабочих процессов с помощью Apache Airflow, включая отслеживание выполнения DAG, проверку экземпляров задач и управление зависимостями. Внедрение стратегий наблюдаемости для раннего обнаружения сбоев.",
                "> Мониторинг состояния и производительности кластера на платформах типа Cloudera (CDH/CDP), оценка критических метрик, таких как использование ресурсов (ЦП, память, ввод-вывод) и состояние сервисов (HDFS, YARN).",
                "> Выполнение, оптимизация и проверка запросов в Impala, ориентированных на обновление каталогов, проверку целостности данных и поддержку процессов загрузки. Использование клиентов, таких как DBeaver.",
                "> Разработка скриптов на Python для идентификации шаблонов, генерации предупреждений и обработки наборов данных. Реализация аналитической логики для классификации, сортировки и очистки данных.",
                "> Определение масштабируемых и отказоустойчивых архитектур данных с использованием инструментов моделирования, таких как Draw.io, включая документацию потоков данных и передовые методы на основе архитектур Lambda или Data Lakehouse.",
                "<span class='highlight'>[+] ИНЖЕНЕР ПОДДЕРЖКИ | Centro Medico DALINDE </span>", 
                "> Выполнение профилактического и корректирующего технического обслуживания компьютерного оборудования и периферийных устройств, включая диагностику неисправностей на аппаратном уровне и оптимизацию производительности.",
                "> Структурирование, отладка и нормализация баз данных пациентов, обеспечение целостности, согласованности и доступности данных.",
                "> Внедрение методов восстановления информации на устройствах хранения (HDD), включая диагностику логических и физических сбоев и применение стратегий для минимизации потери данных.",
                "<span class='highlight'>[+] ТЕХНИК ИТ-ПОДДЕРЖКИ | Casa del Jubilado y Pensionado IMSS </span>", 
                "> Регистрация, обновление и обслуживание информации об участниках в базах данных, обеспечение целостности, согласованности и правильного структурирования данных.",
                "> Диагностика неисправностей компьютерного оборудования, выполнение профилактического и корректирующего обслуживания, а также замена поврежденных компонентов.",
                "> Анализ и решение проблем на уровне программного обеспечения, включая конфигурацию системы, отладку и восстановление."
            ]},
            { cmd: "ls -l /certifications/", output: getCertificationsOutput("Подтверждено", "Запустить_проверку()") },
            { cmd: "echo 'Предлагаю скачать мое резюме, если вам понравилась моя работа, или связаться со мной в LinkedIn'", output: [ "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action'>[ Скачать_CV.pdf ]</a> <a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' class='btn-action'>[ Открыть_LinkedIn ]</a>" ] }
        ]
    },
    ja: {
        dir: "ltr", title: "root@ebromares:~", prompt: "root@ebromares:~$ ",
        data: [
            { cmd: "./init_profile.sh", output: [
                "システムを初期化しています...", 
                "メモリを初期化しています...",
                "データを検索中...",
                "人間を検知しました...",
                "[OK] 生体認証データが検証されました。",
                "==================================================",
                "<span class='highlight'>名前:</span> Lic. Mario Jafet Ebromares Fuentes",
                "<span class='highlight'>プロフィール:</span> コンピュータサイエンス専門家 / データエンジニア / サイバーセキュリティ",
                "==================================================",
                "概要:", 
                "> テクノロジーとイノベーションへの情熱。",
                "> 誇り高きポリテクニコの卒業生",
                "> 創造的で独学が得意", 
                "> データ処理とクラウドアーキテクチャのための分析能力。"
            ]},
            { cmd: "cat experience.log", output: [
                "<span class='section-title'>[ 職歴 ]</span>", "",
                "<span class='highlight'>[+] データエンジニア | Martinexsa </span>", 
                "> Apache Airflow を使用した包括的なワークフロー監視。DAG実行の追跡、タスクインスタンスの検証、依存関係の管理を含みます。早期の障害検出のための可観測性戦略の実装。",
                "> Cloudera (CDH/CDP) などのプラットフォームにおけるクラスターの状態とパフォーマンスの監視。リソース使用量（CPU、メモリ、I/O）やサービスの状態（HDFS、YARN）などの重要な指標を評価します。",
                "> Impala でのクエリの実行、最適化、および検証。カタログの更新、データ整合性の検証、取り込みプロセスのサポートに重点を置いています。DBeaver などのクライアントを使用した効率的な対話。",
                "> パターン識別、アラート生成、およびデータセット処理のための Python スクリプトの開発。分類、ソート、およびデータのデバッグのための分析ロジックの実装。",
                "> Draw.io のようなモデリングツールを使用したスケーラブルで復元力のあるデータアーキテクチャの定義。Lambda または Data Lakehouse アーキテクチャに基づいたデータフローとベストプラクティスの文書化を含みます。",
                "<span class='highlight'>[+] サポートエンジニア | Centro Medico DALINDE </span>", 
                "> コンピュータ機器や周辺機器の予防的および事後保全の実行。ハードウェアレベルの障害診断、コンポーネントの交換、パフォーマンスの最適化を含みます。",
                "> 患者データベースの構造化、デバッグ、および正規化。データの整合性、一貫性、および可用性を確保します。",
                "> ストレージデバイス (HDD) の情報復旧技術の実装。論理的および物理的な障害の診断、データ損失を最小限に抑える戦略の適用を含みます。",
                "<span class='highlight'>[+] ITサポート技術者 | Casa del Jubilado y Pensionado IMSS </span>", 
                "> データベース内のメンバー情報の登録、更新、および保守。検証および管理の慣行を通じて、データの整合性と正しい構造化を確保します。",
                "> コンピュータ機器の障害診断、予防的および事後保全の実行、損傷したコンポーネントの交換。",
                "> システム構成、デバッグ、復元を含むソフトウェアレベルの問題分析と解決。ダウンタイムを最小限に抑えるためのトラブルシューティング手法を適用します。"
            ]},
            { cmd: "ls -l /certifications/", output: getCertificationsOutput("検証済み", "検証を実行する()") },
            { cmd: "echo '私の仕事に興味を持たれた方は履歴書をダウンロードするか、LinkedInでご連絡ください'", output: [ "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action'>[ 履歴書のダウンロード.pdf ]</a> <a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' class='btn-action'>[ LinkedInを開く ]</a>" ] }
        ]
    },
    zh: {
        dir: "ltr", title: "root@ebromares:~", prompt: "root@ebromares:~$ ",
        data: [
            { cmd: "./init_profile.sh", output: [
                "正在初始化系统...", 
                "正在初始化内存...",
                "正在搜索数据...",
                "发现人类...",
                "[OK] 生物识别数据已验证。",
                "==================================================",
                "<span class='highlight'>姓名:</span> Lic. Mario Jafet Ebromares Fuentes",
                "<span class='highlight'>简介:</span> 计算机科学专业人员 / 数据工程师 / 网络安全",
                "==================================================",
                "摘要:", 
                "> 科技与创新的狂热爱好者。",
                "> 骄傲的理工学院校友",
                "> 富有创造力和极强的自学能力", 
                "> 具备数据处理和云架构的分析能力。"
            ]},
            { cmd: "cat experience.log", output: [
                "<span class='section-title'>[ 工作经验 ]</span>", "",
                "<span class='highlight'>[+] 数据工程师 | Martinexsa </span>", 
                "> 使用 Apache Airflow 进行全面的工作流监督，包括跟踪 DAG 执行、任务实例验证和依赖关系管理。实施可观测性策略以便及早发现故障，确保批处理和调度管道的运行连续性。",
                "> 在类似 Cloudera (CDH/CDP) 的平台上进行集群健康和性能监控，评估关键指标，如资源使用情况（CPU、内存、I/O）和服务健康状况（HDFS、YARN）。使用 Hue 和 SSH 控制台（MobaXTerm）诊断事件。",
                "> 在 Impala 中执行、优化和验证查询，重点是目录更新、数据完整性验证和支持数据摄取过程。使用像 DBeaver 这样的客户端与数据仓库进行高效交互和结果分析。",
                "> 开发 Python 脚本用于模式识别、警报生成和数据集处理。实施用于数据分类、排序和调试的分析逻辑，为信息质量和治理做出贡献。",
                "> 使用 Draw.io 等建模工具定义可扩展且具有弹性的数据架构，包括记录数据流、生态系统组件以及基于 Lambda 或 Data Lakehouse 架构的最佳实践。",
                "<span class='highlight'>[+] 支持工程师 | Centro Medico DALINDE </span>", 
                "> 对计算机设备和外围设备执行预防性和纠正性维护，包括硬件级故障诊断、组件更换和性能优化。在兼容性、热效率和运行稳定性的标准下进行 PC 组装。",
                "> 构建、调试和规范患者数据库，确保数据的完整性、一致性和可用性。在数据管理中应用最佳实践，包括验证、清理和组织，以促进数据的开发和分析。",
                "> 在存储设备 (HDD) 上实施信息恢复技术，包括诊断逻辑和物理故障、使用专用工具以及应用将数据丢失降至最低并确保运行连续性的策略。",
                "<span class='highlight'>[+] IT支持技术员 | Casa del Jubilado y Pensionado IMSS </span>", 
                "> 在数据库中注册、更新和维护成员信息，通过验证和控制实践确保数据的完整性、一致性和正确的数据结构化。",
                "> 计算机设备故障诊断，执行预防性和纠正性维护，以及更换损坏的组件，确保运行的连续性和最佳系统性能。",
                "> 软件级别的故障分析和解决，包括系统配置、调试和恢复，应用故障排除方法将停机时间降至最低并提高环境稳定性。"
            ]},
            { cmd: "ls -l /certifications/", output: getCertificationsOutput("已验证", "运行验证()") },
            { cmd: "echo '如果您喜欢我的工作，欢迎下载我的简历或通过LinkedIn联系我'", output: [ "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action'>[ 下载简历.pdf ]</a> <a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' class='btn-action'>[ 打开_LinkedIn ]</a>" ] }
        ]
    },
    ar: {
        dir: "rtl", title: "root@ebromares:~", prompt: "root@ebromares:~$ ",
        data: [
            { cmd: "./init_profile.sh", output: [
                "جاري تهيئة النظام...", 
                "جاري تهيئة الذاكرة...",
                "البحث عن البيانات...",
                "تم تحديد موقع بشري...",
                "[OK] تم التحقق من البيانات البيومترية.",
                "==================================================",
                "<span class='highlight'>الاسم:</span> Lic. Mario Jafet Ebromares Fuentes",
                "<span class='highlight'>الملف الشخصي:</span> متخصص في علوم الكمبيوتر / مهندس بيانات / الأمن السيبراني",
                "==================================================",
                "ملخص:", 
                "> شغوف بالتكنولوجيا والابتكار.",
                "> فخور كوني خريج معهد البوليتكنيك",
                "> مبدع وعصامي بامتياز", 
                "> قدرة تحليلية لمعالجة البيانات والبنى السحابية."
            ]},
            { cmd: "cat experience.log", output: [
                "<span class='section-title'>[ الخبرة المهنية ]</span>", "",
                "<span class='highlight'>[+] مهندس بيانات | Martinexsa </span>", 
                "> إشراف شامل على سير العمل باستخدام Apache Airflow، بما في ذلك تتبع تنفيذ DAGs والتحقق من صحة مهام العمل وإدارة التبعيات. تنفيذ استراتيجيات المراقبة للكشف المبكر عن الأعطال.",
                "> مراقبة حالة وأداء المجموعة السحابية على منصات مثل Cloudera (CDH/CDP)، وتقييم المقاييس الحاسمة مثل استخدام الموارد (وحدة المعالجة المركزية، الذاكرة، الإدخال/الإخراج) وصحة الخدمات (HDFS، YARN).",
                "> تنفيذ وتحسين والتحقق من صحة الاستعلامات في Impala، مع التركيز على تحديثات الكتالوج، والتحقق من سلامة البيانات، ودعم عمليات الإدخال. استخدام برامج مثل DBeaver للتفاعل الفعال.",
                "> تطوير نصوص Python لتحديد الأنماط وإنشاء التنبيهات ومعالجة مجموعات البيانات. تنفيذ المنطق التحليلي لتصنيف البيانات وفرزها وتصحيحها، مما يساهم في جودة المعلومات وحوكمتها.",
                "> تحديد بنى بيانات قابلة للتطوير ومرنة باستخدام أدوات النمذجة مثل Draw.io، بما في ذلك توثيق تدفقات البيانات ومكونات النظام البيئي وأفضل الممارسات القائمة على بنيات Lambda أو Data Lakehouse.",
                "<span class='highlight'>[+] مهندس دعم | Centro Medico DALINDE </span>", 
                "> تنفيذ الصيانة الوقائية والتصحيحية على أجهزة الكمبيوتر والأجهزة الطرفية، بما في ذلك تشخيص الأعطال على مستوى الأجهزة، واستبدال المكونات، وتحسين الأداء.",
                "> هيكلة وتصحيح وتطبيع قواعد بيانات المرضى، وضمان سلامة البيانات واتساقها وتوافرها. تطبيق أفضل الممارسات في إدارة البيانات لتسهيل استغلالها وتحليلها.",
                "> تنفيذ تقنيات استعادة المعلومات على أجهزة التخزين (HDD)، بما في ذلك تشخيص الأعطال المنطقية والمادية، واستخدام أدوات متخصصة، وتطبيق استراتيجيات لتقليل فقدان البيانات.",
                "<span class='highlight'>[+] فني دعم تكنولوجيا المعلومات | Casa del Jubilado y Pensionado IMSS </span>", 
                "> تسجيل وتحديث وصيانة معلومات الأعضاء في قواعد البيانات، وضمان النزاهة والاتساق والهيكلة الصحيحة للبيانات من خلال ممارسات التحقق والرقابة.",
                "> تشخيص أعطال أجهزة الكمبيوتر، وتنفيذ الصيانة الوقائية والتصحيحية، بالإضافة إلى استبدال المكونات التالفة، لضمان استمرارية التشغيل والأداء الأمثل للنظام.",
                "> تحليل مشاكل البرمجيات وحلها، بما في ذلك تكوين النظام وتصحيح الأخطاء والاستعادة، وتطبيق منهجيات استكشاف الأخطاء وإصلاحها لتقليل وقت التوقف عن العمل وتحسين استقرار البيئة."
            ]},
            { cmd: "ls -l /certifications/", output: getCertificationsOutput("موثق", "تشغيل_التحقق()") },
            { cmd: "echo 'أدعوك لتحميل سيرتي الذاتية إذا أعجبك عملي أو تواصل معي عبر لينكد إن'", output: [ "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action'>[ تحميل_السيرة_الذاتية.pdf ]</a> <a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' class='btn-action'>[ فتح_لينكد_إن ]</a>" ] }
        ]
    },
    fa: {
        dir: "rtl", title: "root@ebromares:~", prompt: "root@ebromares:~$ ",
        data: [
            { cmd: "./init_profile.sh", output: [
                "راه اندازی سیستم...", 
                "راه اندازی حافظه...",
                "جستجوی داده ها...",
                "انسان پیدا شد...",
                "[OK] داده های بیومتریک تایید شد.",
                "==================================================",
                "<span class='highlight'>نام:</span> Lic. Mario Jafet Ebromares Fuentes",
                "<span class='highlight'>نمایه:</span> متخصص علوم کامپیوتر / مهندس داده / امنیت سایبری",
                "==================================================",
                "خلاصه:", 
                "> علاقه مند به تکنولوژی و نوآوری.",
                "> فارغ التحصیل مفتخر پلی تکنیک",
                "> خلاق و بسیار خودآموز", 
                "> ظرفیت تحلیلی برای پردازش داده ها و معماری های ابری."
            ]},
            { cmd: "cat experience.log", output: [
                "<span class='section-title'>[ تجربه کاری ]</span>", "",
                "<span class='highlight'>[+] مهندس داده | Martinexsa </span>", 
                "> نظارت جامع بر گردش کار با استفاده از Apache Airflow، از جمله ردیابی اجرای DAG، اعتبارسنجی نمونه کار و مدیریت وابستگی ها. اجرای استراتژی های نظارت برای تشخیص زودهنگام خطا.",
                "> نظارت بر سلامت و عملکرد خوشه در پلتفرم‌های Cloudera (CDH/CDP)، ارزیابی معیارهای حیاتی مانند استفاده از منابع (CPU، حافظه، I/O) و سلامت خدمات (HDFS، YARN). تشخیص حوادث با استفاده از ابزارهایی مانند کنسول های Hue و SSH.",
                "> اجرا، بهینه سازی و اعتبارسنجی پرس و جوها در Impala، متمرکز بر به روز رسانی کاتالوگ، اعتبارسنجی یکپارچگی داده ها و پشتیبانی از فرآیندهای جذب. استفاده از کلاینت هایی مانند DBeaver برای تعامل کارآمد.",
                "> توسعه اسکریپت های Python برای شناسایی الگو، تولید هشدار و پردازش مجموعه داده ها. پیاده سازی منطق تحلیلی برای طبقه بندی داده ها، مرتب سازی و اشکال زدایی، کمک به کیفیت و حاکمیت اطلاعات.",
                "> تعریف معماری داده های مقیاس پذیر و انعطاف پذیر با استفاده از ابزارهای مدل سازی مانند Draw.io، از جمله مستندسازی جریان های داده، اجزای اکوسیستم و بهترین شیوه های مبتنی بر معماری Lambda یا Data Lakehouse.",
                "<span class='highlight'>[+] مهندس پشتیبانی | Centro Medico DALINDE </span>", 
                "> اجرای تعمیر و نگهداری پیشگیرانه و اصلاحی بر روی تجهیزات کامپیوتری و تجهیزات جانبی، از جمله تشخیص خطای سطح سخت افزار، تعویض قطعات و بهینه سازی عملکرد. مونتاژ رایانه شخصی تحت معیارهای سازگاری، راندمان حرارتی.",
                "> ساختار، اشکال زدایی، و عادی سازی پایگاه داده های بیمار، تضمین یکپارچگی، سازگاری و در دسترس بودن داده ها. به کارگیری بهترین شیوه ها در مدیریت داده ها، از جمله اعتبار سنجی، تمیز کردن، و سازماندهی.",
                "> پیاده‌سازی تکنیک‌های بازیابی اطلاعات بر روی دستگاه‌های ذخیره‌سازی (HDD)، از جمله تشخیص خطاهای منطقی و فیزیکی، استفاده از ابزارهای تخصصی و کاربرد استراتژی‌هایی برای به حداقل رساندن از دست دادن داده‌ها.",
                "<span class='highlight'>[+] تکنسین پشتیبانی فناوری اطلاعات | Casa del Jubilado y Pensionado IMSS </span>", 
                "> ثبت، به روز رسانی و نگهداری اطلاعات اعضا در پایگاه های داده، تضمین یکپارچگی، سازگاری و ساختار داده های صحیح از طریق اقدامات اعتبارسنجی و کنترل.",
                "> تشخیص خطای تجهیزات کامپیوتری، اجرای تعمیر و نگهداری پیشگیرانه و اصلاحی، و همچنین تعویض قطعات آسیب دیده، تضمین تداوم عملکرد و عملکرد مطلوب سیستم.",
                "> تجزیه و تحلیل و حل مسئله در سطح نرم افزار، از جمله پیکربندی سیستم، اشکال زدایی و بازیابی، به کارگیری متدولوژی های عیب یابی برای به حداقل رساندن زمان خرابی و بهبود پایداری محیط."
            ]},
            { cmd: "ls -l /certifications/", output: getCertificationsOutput("تایید شده", "اجرای_تایید()") },
            { cmd: "echo 'اگر از کار من خوشتان آمد، دعوت می کنم رزومه مرا دانلود کنید یا در لینکدین با من تماس بگیرید'", output: [ "<br><a href='assets/CV_EBROMARES.pdf' download class='btn-action'>[ دانلود_رزومه.pdf ]</a> <a href='https://www.linkedin.com/in/ebromaresmario/' target='_blank' class='btn-action'>[ باز_کردن_لینکدین ]</a>" ] }
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