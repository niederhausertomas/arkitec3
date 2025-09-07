// Sistema de Multilenguaje para ARKITEC3
// Español por defecto, soporte para Catalán

class I18nManager {
    constructor() {
        this.currentLanguage = 'es'; // Idioma por defecto: español
        this.translations = {};
        this.init();
    }

    init() {
        // Cargar traducciones
        this.loadTranslations();
        
        // Aplicar idioma por defecto
        this.setLanguage(this.currentLanguage);
        
        // Crear selector de idioma
        this.createLanguageSwitcher();
    }

    loadTranslations() {
        // Las traducciones se cargan desde los archivos externos
        // translationsES y translationsCA deben estar disponibles globalmente
        this.translations = {
            'es': typeof translationsES !== 'undefined' ? translationsES : {},
            'ca': typeof translationsCA !== 'undefined' ? translationsCA : {}
        };
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            this.updatePageContent();
            this.updateLanguageSwitcher();
            localStorage.setItem('arkitec3-language', lang);
        }
    }

    getTranslation(key) {
        return this.translations[this.currentLanguage][key] || key;
    }

    updatePageContent() {
        // Actualizar todos los elementos con atributo data-i18n
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Actualizar elementos con atributo data-i18n-html para contenido HTML
        const htmlElements = document.querySelectorAll('[data-i18n-html]');
        htmlElements.forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            const translation = this.getTranslation(key);
            element.innerHTML = translation;
        });
    }

    createLanguageSwitcher() {
        // Crear selector de idioma
        const languageSwitcher = document.createElement('div');
        languageSwitcher.id = 'language-switcher';
        languageSwitcher.innerHTML = `
            <button id="lang-es" class="lang-btn ${this.currentLanguage === 'es' ? 'active' : ''}" onclick="i18n.setLanguage('es')">
                <span>ES</span>
            </button>
            <button id="lang-ca" class="lang-btn ${this.currentLanguage === 'ca' ? 'active' : ''}" onclick="i18n.setLanguage('ca')">
                <span>CA</span>
            </button>
        `;

        // Añadir estilos CSS
        const style = document.createElement('style');
        style.textContent = `
            #language-switcher {
                position: fixed;
                top: 30px;
                left: 20px;
                z-index: 1000;
                display: flex;
                gap: 5px;
                background: rgba(255, 255, 255, 0.9);
                padding: 5px;
                border-radius: 25px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            
            .lang-btn {
                background: transparent;
                border: none;
                padding: 8px 12px;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
                font-size: 12px;
                transition: all 0.3s ease;
                color: #666;
            }
            
            .lang-btn:hover {
                background: rgba(0, 0, 0, 0.1);
                color: #333;
            }
            
            .lang-btn.active {
                background: #2c3e50;
                color: white;
            }
            
            @media (max-width: 768px) {
                #language-switcher {
                    top: 10px;
                    left: 10px;
                    padding: 3px;
                }
                
                .lang-btn {
                    padding: 2px 10px;
                    font-size: 11px;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(languageSwitcher);
    }

    updateLanguageSwitcher() {
        const esBtn = document.getElementById('lang-es');
        const caBtn = document.getElementById('lang-ca');
        
        if (esBtn && caBtn) {
            esBtn.classList.toggle('active', this.currentLanguage === 'es');
            caBtn.classList.toggle('active', this.currentLanguage === 'ca');
        }
    }

    // Cargar idioma guardado del localStorage
    loadSavedLanguage() {
        const savedLang = localStorage.getItem('arkitec3-language');
        if (savedLang && this.translations[savedLang]) {
            this.setLanguage(savedLang);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que se carguen las traducciones
    setTimeout(() => {
        window.i18n = new I18nManager();
        window.i18n.loadSavedLanguage();
    }, 100);
});
