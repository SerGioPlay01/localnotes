/**
 * Universal Cookies Banner for Local Notes
 * Supports all 12 languages with GDPR compliance
 * Author: SerGio Play
 * Version: 1.0.0
 */

(function() {
    'use strict';

    // Cookie banner translations for all supported languages
    const translations = {
        en: {
            title: "🍪 Cookie Notice",
            message: "Local Notes uses cookies to enhance your note-taking experience, save your preferences, and help us improve the application. By clicking 'Accept All', you consent to our use of cookies.",
            acceptAll: "Accept All",
            acceptNecessary: "Accept Necessary Only",
            customize: "Customize",
            learnMore: "Learn More",
            close: "Close",
            necessary: "Necessary",
            analytics: "Analytics",
            marketing: "Marketing",
            preferences: "Cookie Preferences",
            savePreferences: "Save Preferences",
            viewCookies: "View cookies used",
            necessaryDesc: "Essential cookies for Local Notes functionality: note storage, encryption keys, theme settings, language preferences, and PWA features.",
            analyticsDesc: "Google Analytics cookies to understand how users interact with Local Notes, which features are most used, and help us improve performance and user experience.",
            marketingDesc: "Currently not used in Local Notes. Reserved for future features like social sharing or promotional content."
        },
        ru: {
            title: "🍪 Уведомление о файлах cookie",
            message: "Local Notes использует файлы cookie для улучшения вашего опыта создания заметок, сохранения настроек и помощи в улучшении приложения. Нажав 'Принять все', вы соглашаетесь с использованием файлов cookie.",
            acceptAll: "Принять все",
            acceptNecessary: "Только необходимые",
            customize: "Настроить",
            learnMore: "Узнать больше",
            close: "Закрыть",
            necessary: "Необходимые",
            analytics: "Аналитика",
            marketing: "Маркетинг",
            preferences: "Настройки cookie",
            savePreferences: "Сохранить настройки",
            viewCookies: "Показать используемые куки",
            necessaryDesc: "Основные файлы cookie для функциональности Local Notes: хранение заметок, ключи шифрования, настройки темы, языковые предпочтения и функции PWA.",
            analyticsDesc: "Файлы cookie Google Analytics для понимания того, как пользователи взаимодействуют с Local Notes, какие функции используются чаще всего, и помощи в улучшении производительности и пользовательского опыта.",
            marketingDesc: "В настоящее время не используются в Local Notes. Зарезервированы для будущих функций, таких как социальный обмен или рекламный контент."
        },
        ua: {
            title: "🍪 Повідомлення про файли cookie",
            message: "Local Notes використовує файли cookie для покращення вашого досвіду створення нотаток, збереження налаштувань та допомоги в покращенні додатку. Натиснувши 'Прийняти все', ви погоджуєтеся з використанням файлів cookie.",
            acceptAll: "Прийняти все",
            acceptNecessary: "Тільки необхідні",
            customize: "Налаштувати",
            learnMore: "Дізнатися більше",
            close: "Закрити",
            necessary: "Необхідні",
            analytics: "Аналітика",
            marketing: "Маркетинг",
            preferences: "Налаштування cookie",
            savePreferences: "Зберегти налаштування",
            viewCookies: "Показати використовувані куки",
            necessaryDesc: "Основні файли cookie для функціональності Local Notes: зберігання нотаток, ключі шифрування, налаштування теми, мовні уподобання та функції PWA.",
            analyticsDesc: "Файли cookie Google Analytics для розуміння того, як користувачі взаємодіють з Local Notes, які функції використовуються найчастіше, та допомоги в покращенні продуктивності та користувацького досвіду.",
            marketingDesc: "Наразі не використовуються в Local Notes. Зарезервовані для майбутніх функцій, таких як соціальний обмін або рекламний контент."
        },
        pl: {
            title: "🍪 Powiadomienie o plikach cookie",
            message: "Local Notes używa plików cookie, aby poprawić Twoje doświadczenia w tworzeniu notatek, zapisywać preferencje i pomagać w ulepszaniu aplikacji. Klikając 'Zaakceptuj wszystkie', wyrażasz zgodę na używanie plików cookie.",
            acceptAll: "Zaakceptuj wszystkie",
            acceptNecessary: "Tylko niezbędne",
            customize: "Dostosuj",
            learnMore: "Dowiedz się więcej",
            close: "Zamknij",
            necessary: "Niezbędne",
            analytics: "Analityka",
            marketing: "Marketing",
            preferences: "Preferencje plików cookie",
            savePreferences: "Zapisz preferencje",
            viewCookies: "Zobacz używane pliki cookie",
            necessaryDesc: "Podstawowe pliki cookie dla funkcjonalności Local Notes: przechowywanie notatek, klucze szyfrowania, ustawienia motywu, preferencje językowe i funkcje PWA.",
            analyticsDesc: "Pliki cookie Google Analytics do zrozumienia, jak użytkownicy wchodzą w interakcję z Local Notes, które funkcje są najczęściej używane, i pomocy w poprawie wydajności i doświadczenia użytkownika.",
            marketingDesc: "Obecnie nie używane w Local Notes. Zarezerwowane dla przyszłych funkcji, takich jak udostępnianie społecznościowe lub treści promocyjne."
        },
        cs: {
            title: "🍪 Oznámení o souborech cookie",
            message: "Local Notes používá soubory cookie k vylepšení vašeho zážitku z vytváření poznámek, ukládání předvoleb a pomoci při zlepšování aplikace. Kliknutím na 'Přijmout vše' souhlasíte s používáním souborů cookie.",
            acceptAll: "Přijmout vše",
            acceptNecessary: "Pouze nezbytné",
            customize: "Přizpůsobit",
            learnMore: "Dozvědět se více",
            close: "Zavřít",
            necessary: "Nezbytné",
            analytics: "Analytika",
            marketing: "Marketing",
            preferences: "Předvolby souborů cookie",
            savePreferences: "Uložit předvolby",
            viewCookies: "Zobrazit používané soubory cookie",
            necessaryDesc: "Základní soubory cookie pro funkčnost Local Notes: ukládání poznámek, šifrovací klíče, nastavení témat, jazykové preference a funkce PWA.",
            analyticsDesc: "Soubory cookie Google Analytics k pochopení, jak uživatelé interagují s Local Notes, které funkce se používají nejčastěji, a pomoci při zlepšování výkonu a uživatelského zážitku.",
            marketingDesc: "V současné době se nepoužívají v Local Notes. Vyhrazeny pro budoucí funkce, jako je sociální sdílení nebo propagační obsah."
        },
        sk: {
            title: "🍪 Oznámenie o súboroch cookie",
            message: "Local Notes používa súbory cookie na zlepšenie vášho zážitku z vytvárania poznámok, ukladanie predvolieb a pomoc pri zlepšovaní aplikácie. Kliknutím na 'Prijať všetko' súhlasíte s používaním súborov cookie.",
            acceptAll: "Prijať všetko",
            acceptNecessary: "Len nevyhnutné",
            customize: "Prispôsobiť",
            learnMore: "Dozvedieť sa viac",
            close: "Zavrieť",
            necessary: "Nevyhnutné",
            analytics: "Analytika",
            marketing: "Marketing",
            preferences: "Predvoľby súborov cookie",
            savePreferences: "Uložiť predvoľby",
            viewCookies: "Zobraziť používané súbory cookie",
            necessaryDesc: "Základné súbory cookie pre funkčnosť Local Notes: ukladanie poznámok, šifrovacie kľúče, nastavenia tém, jazykové preferencie a funkcie PWA.",
            analyticsDesc: "Súbory cookie Google Analytics na pochopenie, ako používatelia interagujú s Local Notes, ktoré funkcie sa používajú najčastejšie, a pomoc pri zlepšovaní výkonu a používateľského zážitku.",
            marketingDesc: "V súčasnosti sa nepoužívajú v Local Notes. Vyhradené pre budúce funkcie, ako je sociálne zdieľanie alebo propagačný obsah."
        },
        bg: {
            title: "🍪 Известие за бисквитки",
            message: "Local Notes използва бисквитки за подобряване на вашето изживяване при създаване на бележки, запазване на предпочитания и помощ при подобряване на приложението. Като кликнете 'Приеми всички', вие се съгласявате с използването на бисквитки.",
            acceptAll: "Приеми всички",
            acceptNecessary: "Само необходимите",
            customize: "Персонализирай",
            learnMore: "Научи повече",
            close: "Затвори",
            necessary: "Необходими",
            analytics: "Аналитика",
            marketing: "Маркетинг",
            preferences: "Предпочитания за бисквитки",
            savePreferences: "Запази предпочитанията",
            viewCookies: "Покажи използваните бисквитки",
            necessaryDesc: "Основни бисквитки за функционалността на Local Notes: съхранение на бележки, ключове за криптиране, настройки на темата, езикови предпочитания и функции на PWA.",
            analyticsDesc: "Бисквитки Google Analytics за разбиране как потребителите взаимодействат с Local Notes, кои функции се използват най-често, и помощ при подобряване на производителността и потребителското изживяване.",
            marketingDesc: "В момента не се използват в Local Notes. Резервирани за бъдещи функции като социално споделяне или промоционално съдържание."
        },
        hr: {
            title: "🍪 Obavijest o kolačićima",
            message: "Local Notes koristi kolačiće za poboljšanje vašeg iskustva stvaranja bilješki, spremanje postavki i pomoć u poboljšanju aplikacije. Klikom na 'Prihvati sve' pristajete na korištenje kolačića.",
            acceptAll: "Prihvati sve",
            acceptNecessary: "Samo potrebni",
            customize: "Prilagodi",
            learnMore: "Saznaj više",
            close: "Zatvori",
            necessary: "Potrebni",
            analytics: "Analitika",
            marketing: "Marketing",
            preferences: "Postavke kolačića",
            savePreferences: "Spremi postavke",
            viewCookies: "Prikaži korištene kolačiće",
            necessaryDesc: "Osnovni kolačići za funkcionalnost Local Notes: spremanje bilješki, ključevi šifriranja, postavke teme, jezične preferencije i PWA funkcije.",
            analyticsDesc: "Kolačići Google Analytics za razumijevanje kako korisnici komuniciraju s Local Notes, koje se funkcije najviše koriste, i pomoć u poboljšanju performansi i korisničkog iskustva.",
            marketingDesc: "Trenutno se ne koriste u Local Notes. Rezervirani za buduće funkcije kao što su društveno dijeljenje ili promocijski sadržaj."
        },
        sr: {
            title: "🍪 Обавештење о колачићима",
            message: "Local Notes користи колачиће за побољшање вашег искуства стварања бележака, чување поставки и помоћ у побољшању апликације. Кликом на 'Прихвати све' пристајете на коришћење колачића.",
            acceptAll: "Прихвати све",
            acceptNecessary: "Само потребни",
            customize: "Прилагоди",
            learnMore: "Сазнај више",
            close: "Затвори",
            necessary: "Потребни",
            analytics: "Аналитика",
            marketing: "Маркетинг",
            preferences: "Поставке колачића",
            savePreferences: "Сачувај поставке",
            viewCookies: "Прикажи коришћене колачиће",
            necessaryDesc: "Основни колачићи за функционалност Local Notes: чување бележака, кључеви шифровања, поставке теме, језичке преференце и PWA функције.",
            analyticsDesc: "Колачићи Google Analytics за разумевање како корисници комуницирају са Local Notes, које се функције највише користе, и помоћ у побољшању перформанси и корисничког искуства.",
            marketingDesc: "Тренутно се не користе у Local Notes. Резервисани за будуће функције као што су друштвено дељење или промотивни садржај."
        },
        bs: {
            title: "🍪 Obavještenje o kolačićima",
            message: "Local Notes koristi kolačiće za poboljšanje vašeg iskustva kreiranja bilješki, čuvanje postavki i pomoć u poboljšanju aplikacije. Klikom na 'Prihvati sve' pristajete na korištenje kolačića.",
            acceptAll: "Prihvati sve",
            acceptNecessary: "Samo potrebni",
            customize: "Prilagodi",
            learnMore: "Saznaj više",
            close: "Zatvori",
            necessary: "Potrebni",
            analytics: "Analitika",
            marketing: "Marketing",
            preferences: "Postavke kolačića",
            savePreferences: "Spremi postavke",
            viewCookies: "Prikaži korištene kolačiće",
            necessaryDesc: "Osnovni kolačići za funkcionalnost Local Notes: čuvanje bilješki, ključevi šifriranja, postavke teme, jezične preferencije i PWA funkcije.",
            analyticsDesc: "Kolačići Google Analytics za razumijevanje kako korisnici komuniciraju s Local Notes, koje se funkcije najviše koriste, i pomoć u poboljšanju performansi i korisničkog iskustva.",
            marketingDesc: "Trenutno se ne koriste u Local Notes. Rezervirani za buduće funkcije kao što su društveno dijeljenje ili promocijski sadržaj."
        },
        mk: {
            title: "🍪 Известување за колачиња",
            message: "Local Notes користи колачиња за подобрување на вашето искуство при создавање на белешки, зачувување на поставки и помош при подобрување на апликацијата. Со кликнување на 'Прифати сите' се согласувате со користењето на колачиња.",
            acceptAll: "Прифати сите",
            acceptNecessary: "Само потребни",
            customize: "Прилагоди",
            learnMore: "Дознај повеќе",
            close: "Затвори",
            necessary: "Потребни",
            analytics: "Аналитика",
            marketing: "Маркетинг",
            preferences: "Поставки за колачиња",
            savePreferences: "Зачувај поставки",
            viewCookies: "Прикажи користени колачиња",
            necessaryDesc: "Основни колачиња за функционалноста на Local Notes: зачувување на белешки, клучови за шифрирање, поставки на темата, јазични преференци и PWA функции.",
            analyticsDesc: "Колачиња Google Analytics за разбирање како корисниците комуницираат со Local Notes, кои функции се користат најчесто, и помош при подобрување на перформансите и корисничкото искуство.",
            marketingDesc: "Моментално не се користат во Local Notes. Резервирани за идни функции како што се социјално споделување или промотивна содржина."
        },
        sl: {
            title: "🍪 Obvestilo o piškotkih",
            message: "Local Notes uporablja piškotke za izboljšanje vašega izkušnje ustvarjanja opomb, shranjevanje nastavitev in pomoč pri izboljšanju aplikacije. S klikom na 'Sprejmi vse' se strinjate z uporabo piškotkov.",
            acceptAll: "Sprejmi vse",
            acceptNecessary: "Samo potrebni",
            customize: "Prilagodi",
            learnMore: "Izvedi več",
            close: "Zapri",
            necessary: "Potrebni",
            analytics: "Analitika",
            marketing: "Marketing",
            preferences: "Nastavitve piškotkov",
            savePreferences: "Shrani nastavitve",
            viewCookies: "Prikaži uporabljene piškotke",
            necessaryDesc: "Osnovni piškotki za funkcionalnost Local Notes: shranjevanje opomb, šifrirni ključi, nastavitve teme, jezikovne preference in PWA funkcije.",
            analyticsDesc: "Piškotki Google Analytics za razumevanje, kako uporabniki komunicirajo z Local Notes, katere funkcije se uporabljajo najpogosteje, in pomoč pri izboljšanju zmogljivosti in uporabniške izkušnje.",
            marketingDesc: "Trenutno se ne uporabljajo v Local Notes. Rezervirani za prihodnje funkcije, kot so družbeno deljenje ali promocijska vsebina."
        }
    };

    // Cookie banner configuration
    const config = {
        cookieName: 'localnotes_cookie_consent',
        cookieExpiry: 365, // days
        showDelay: 1000, // milliseconds
        animationDuration: 300,
        zIndex: 10000,
        // Local Notes specific cookies information
        cookiesInfo: {
            necessary: [
                'localnotes_notes_data', // Encrypted notes storage
                'localnotes_encryption_key', // AES-256 encryption keys
                'localnotes_theme', // Dark/light theme preference
                'preferredLanguage', // User language preference
                'localnotes_view_mode', // Grid/list view preference
                'localnotes_pwa_install', // PWA installation status
                'localnotes_session', // Session management
                'localnotes_cookie_consent' // This consent banner
            ],
            analytics: [
                '_ga', // Google Analytics
                '_ga_*', // Google Analytics 4
                '_gid', // Google Analytics
                '_gat', // Google Analytics throttling
                'G-HR9HLBQFCR' // Local Notes GA tracking ID
            ],
            marketing: [
                // Currently no marketing cookies used
                // Reserved for future features
            ]
        },
        theme: {
            primary: '#4CAF50',
            secondary: '#2196F3',
            background: '#ffffff',
            text: '#333333',
            border: '#e0e0e0',
            shadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            borderRadius: '12px',
            fontFamily: '"Golos Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }
    };

    // Get current language
    function getCurrentLanguage() {
        // First, check if the main app has already set the language
        if (window.currentLang && translations[window.currentLang]) {
            return window.currentLang;
        }

        // Check pathname for language (most reliable for language-specific pages)
        const pathname = window.location.pathname;
        const pathLang = pathname.split('/')[1];
        if (pathLang && translations[pathLang]) {
            return pathLang;
        }

        // Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam && translations[langParam]) {
            return langParam;
        }

        // Check localStorage
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && translations[savedLang]) {
            return savedLang;
        }

        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();
        if (translations[langCode]) {
            return langCode;
        }

        // Check for special cases (like ru for by, kz, md)
        const countryCode = browserLang.split('-')[1]?.toLowerCase();
        if (countryCode) {
            if (countryCode === 'ua') {
                return 'ua';
            }
            if (['by', 'kz', 'md'].includes(countryCode)) {
                return 'ru';
            }
        }

        return 'en'; // default
    }

    // Check if consent is already given
    function hasConsent() {
        return localStorage.getItem(config.cookieName) !== null;
    }

    // Save consent
    function saveConsent(consent) {
        const consentData = {
            necessary: true,
            analytics: consent.analytics || false,
            marketing: consent.marketing || false,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
        
        localStorage.setItem(config.cookieName, JSON.stringify(consentData));
        
        // Set cookie expiry
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + config.cookieExpiry);
        document.cookie = `${config.cookieName}=${JSON.stringify(consentData)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
        
        // Manage Google Analytics based on consent
        manageGoogleAnalytics(consentData.analytics);
    }
    
    // Manage Google Analytics based on consent
    function manageGoogleAnalytics(analyticsConsent) {
        if (analyticsConsent) {
            // Enable Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'granted'
                });
            }
            console.log('Google Analytics enabled with user consent');
        } else {
            // Disable Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'denied'
                });
            }
            console.log('Google Analytics disabled - user declined consent');
        }
    }

    // Get consent data
    function getConsent() {
        const consent = localStorage.getItem(config.cookieName);
        return consent ? JSON.parse(consent) : null;
    }

    // Create banner HTML
    function createBannerHTML(lang) {
        const t = translations[lang];
        
        return `
            <div id="cookies-banner" class="cookies-banner" style="display: none;">
                <div class="cookies-banner-content">
                    <div class="cookies-banner-header">
                        <h3 class="cookies-banner-title">${t.title}</h3>
                        <button class="cookies-banner-close" aria-label="${t.close}">×</button>
                    </div>
                    <div class="cookies-banner-body">
                        <p class="cookies-banner-message">${t.message}</p>
                        <div class="cookies-banner-actions">
                            <button class="cookies-banner-btn cookies-banner-btn-primary" data-action="accept-all">
                                ${t.acceptAll}
                            </button>
                            <button class="cookies-banner-btn cookies-banner-btn-secondary" data-action="accept-necessary">
                                ${t.acceptNecessary}
                            </button>
                            <button class="cookies-banner-btn cookies-banner-btn-link" data-action="customize">
                                ${t.customize}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="cookies-preferences" class="cookies-preferences" style="display: none;">
                <div class="cookies-preferences-content">
                    <div class="cookies-preferences-header">
                        <h3 class="cookies-preferences-title">${t.preferences}</h3>
                        <button class="cookies-preferences-close" aria-label="${t.close}">×</button>
                    </div>
                    <div class="cookies-preferences-body">
                        <div class="cookies-preference-item">
                            <div class="cookies-preference-info">
                                <h4 class="cookies-preference-title">${t.necessary}</h4>
                                <p class="cookies-preference-desc">${t.necessaryDesc}</p>
                                <details class="cookies-details">
                                    <summary>${t.viewCookies}</summary>
                                    <ul class="cookies-list">
                                        <li>localnotes_notes_data - Encrypted notes storage</li>
                                        <li>localnotes_encryption_key - AES-256 encryption keys</li>
                                        <li>localnotes_theme - Theme preference</li>
                                        <li>preferredLanguage - Language setting</li>
                                        <li>localnotes_view_mode - View mode preference</li>
                                        <li>localnotes_pwa_install - PWA status</li>
                                        <li>localnotes_session - Session management</li>
                                    </ul>
                                </details>
                            </div>
                            <label class="cookies-preference-toggle">
                                <input type="checkbox" checked disabled>
                                <span class="cookies-preference-slider"></span>
                            </label>
                        </div>
                        <div class="cookies-preference-item">
                            <div class="cookies-preference-info">
                                <h4 class="cookies-preference-title">${t.analytics}</h4>
                                <p class="cookies-preference-desc">${t.analyticsDesc}</p>
                                <details class="cookies-details">
                                    <summary>${t.viewCookies}</summary>
                                    <ul class="cookies-list">
                                        <li>_ga - Google Analytics user identification</li>
                                        <li>_ga_* - Google Analytics 4 measurement</li>
                                        <li>_gid - Google Analytics session data</li>
                                        <li>_gat - Google Analytics throttling</li>
                                        <li>G-HR9HLBQFCR - Local Notes tracking ID</li>
                                    </ul>
                                </details>
                            </div>
                            <label class="cookies-preference-toggle">
                                <input type="checkbox" id="analytics-toggle">
                                <span class="cookies-preference-slider"></span>
                            </label>
                        </div>
                        <div class="cookies-preference-item">
                            <div class="cookies-preference-info">
                                <h4 class="cookies-preference-title">${t.marketing}</h4>
                                <p class="cookies-preference-desc">${t.marketingDesc}</p>
                            </div>
                            <label class="cookies-preference-toggle">
                                <input type="checkbox" id="marketing-toggle">
                                <span class="cookies-preference-slider"></span>
                            </label>
                        </div>
                    </div>
                    <div class="cookies-preferences-actions">
                        <button class="cookies-banner-btn cookies-banner-btn-primary" data-action="save-preferences">
                            ${t.savePreferences}
                        </button>
                        <button class="cookies-banner-btn cookies-banner-btn-secondary" data-action="back-to-banner">
                            ${t.close}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Create banner styles
    function createBannerStyles() {
        const styles = `
            <style id="cookies-banner-styles">
                .cookies-banner {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: ${config.theme.background};
                    border-top: 1px solid ${config.theme.border};
                    box-shadow: ${config.theme.shadow};
                    z-index: ${config.zIndex};
                    font-family: ${config.theme.fontFamily};
                    transform: translateY(100%);
                    transition: transform ${config.animationDuration}ms ease-in-out;
                }
                
                .cookies-banner.show {
                    transform: translateY(0);
                }
                
                .cookies-banner-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .cookies-banner-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }
                
                .cookies-banner-title {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: ${config.theme.text};
                }
                
                .cookies-banner-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: ${config.theme.text};
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background-color 0.2s ease;
                }
                
                .cookies-banner-close:hover {
                    background-color: rgba(0, 0, 0, 0.1);
                }
                
                .cookies-banner-message {
                    margin: 0 0 20px 0;
                    color: ${config.theme.text};
                    line-height: 1.5;
                    font-size: 14px;
                }
                
                .cookies-banner-actions {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                
                .cookies-banner-btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: ${config.theme.borderRadius};
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: inherit;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 40px;
                }
                
                .cookies-banner-btn-primary {
                    background: ${config.theme.primary};
                    color: white;
                }
                
                .cookies-banner-btn-primary:hover {
                    background: #45a049;
                    transform: translateY(-1px);
                }
                
                .cookies-banner-btn-secondary {
                    background: transparent;
                    color: ${config.theme.text};
                    border: 1px solid ${config.theme.border};
                }
                
                .cookies-banner-btn-secondary:hover {
                    background: ${config.theme.border};
                }
                
                .cookies-banner-btn-link {
                    background: none;
                    color: ${config.theme.secondary};
                    text-decoration: underline;
                    padding: 10px 0;
                }
                
                .cookies-banner-btn-link:hover {
                    color: #1976d2;
                }
                
                .cookies-preferences {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: ${config.zIndex + 1};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                
                .cookies-preferences-content {
                    background: ${config.theme.background};
                    border-radius: ${config.theme.borderRadius};
                    box-shadow: ${config.theme.shadow};
                    max-width: 500px;
                    width: 100%;
                    max-height: 80vh;
                    overflow-y: auto;
                }
                
                .cookies-preferences-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 20px 0 20px;
                    border-bottom: 1px solid ${config.theme.border};
                    margin-bottom: 20px;
                }
                
                .cookies-preferences-title {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 600;
                    color: ${config.theme.text};
                }
                
                .cookies-preferences-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: ${config.theme.text};
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background-color 0.2s ease;
                }
                
                .cookies-preferences-close:hover {
                    background-color: rgba(0, 0, 0, 0.1);
                }
                
                .cookies-preferences-body {
                    padding: 0 20px;
                }
                
                .cookies-preference-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 15px 0;
                    border-bottom: 1px solid ${config.theme.border};
                }
                
                .cookies-preference-item:last-child {
                    border-bottom: none;
                }
                
                .cookies-preference-info {
                    flex: 1;
                    margin-right: 15px;
                }
                
                .cookies-preference-title {
                    margin: 0 0 5px 0;
                    font-size: 16px;
                    font-weight: 500;
                    color: ${config.theme.text};
                }
                
                .cookies-preference-desc {
                    margin: 0;
                    font-size: 13px;
                    color: ${config.theme.text};
                    opacity: 0.7;
                    line-height: 1.4;
                }
                
                .cookies-preference-toggle {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                    flex-shrink: 0;
                }
                
                .cookies-preference-toggle input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                
                .cookies-preference-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: 0.2s;
                    border-radius: 24px;
                }
                
                .cookies-preference-slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: 0.2s;
                    border-radius: 50%;
                }
                
                .cookies-preference-toggle input:checked + .cookies-preference-slider {
                    background-color: ${config.theme.primary};
                }
                
                .cookies-preference-toggle input:checked + .cookies-preference-slider:before {
                    transform: translateX(26px);
                }
                
                .cookies-preference-toggle input:disabled + .cookies-preference-slider {
                    background-color: ${config.theme.primary};
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                .cookies-preferences-actions {
                    padding: 20px;
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }
                
                .cookies-details {
                    margin-top: 10px;
                }
                
                .cookies-details summary {
                    cursor: pointer;
                    font-size: 12px;
                    color: ${config.theme.secondary};
                    font-weight: 500;
                    padding: 5px 0;
                    border-bottom: 1px dotted ${config.theme.border};
                    display: inline-block;
                }
                
                .cookies-details summary:hover {
                    color: #1976d2;
                }
                
                .cookies-list {
                    margin: 10px 0 0 0;
                    padding: 0;
                    list-style: none;
                    background: #f8f9fa;
                    border-radius: 6px;
                    padding: 10px;
                    font-size: 11px;
                    line-height: 1.4;
                }
                
                .cookies-list li {
                    padding: 2px 0;
                    color: #666;
                    font-family: monospace;
                }
                
                .cookies-list li:before {
                    content: "• ";
                    color: ${config.theme.primary};
                    font-weight: bold;
                }
                
                /* Mobile responsive styles */
                @media (max-width: 768px) {
                    .cookies-banner-content {
                        padding: 15px;
                    }
                    
                    .cookies-banner-title {
                        font-size: 16px;
                    }
                    
                    .cookies-banner-message {
                        font-size: 13px;
                    }
                    
                    .cookies-banner-actions {
                        flex-direction: column;
                    }
                    
                    .cookies-banner-btn {
                        width: 100%;
                        justify-content: center;
                    }
                    
                    .cookies-preferences-content {
                        margin: 10px;
                        max-height: 90vh;
                    }
                    
                    .cookies-preferences-header,
                    .cookies-preferences-body,
                    .cookies-preferences-actions {
                        padding-left: 15px;
                        padding-right: 15px;
                    }
                    
                    .cookies-preference-item {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .cookies-preference-info {
                        margin-right: 0;
                        margin-bottom: 10px;
                    }
                    
                    .cookies-preferences-actions {
                        flex-direction: column;
                    }
                }
                
                @media (max-width: 480px) {
                    .cookies-banner-content {
                        padding: 12px;
                    }
                    
                    .cookies-banner-title {
                        font-size: 15px;
                    }
                    
                    .cookies-banner-message {
                        font-size: 12px;
                    }
                    
                    .cookies-banner-btn {
                        padding: 8px 16px;
                        font-size: 13px;
                        min-height: 36px;
                    }
                }
            </style>
        `;
        
        return styles;
    }

    // Show banner
    function showBanner() {
        const banner = document.getElementById('cookies-banner');
        if (banner) {
            banner.style.display = 'block';
            setTimeout(() => {
                banner.classList.add('show');
            }, 10);
        }
    }

    // Hide banner
    function hideBanner() {
        const banner = document.getElementById('cookies-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.style.display = 'none';
            }, config.animationDuration);
        }
    }

    // Show preferences
    function showPreferences() {
        const preferences = document.getElementById('cookies-preferences');
        if (preferences) {
            preferences.style.display = 'flex';
        }
    }

    // Hide preferences
    function hidePreferences() {
        const preferences = document.getElementById('cookies-preferences');
        if (preferences) {
            preferences.style.display = 'none';
        }
    }

    // Handle banner actions
    function handleBannerAction(action) {
        switch (action) {
            case 'accept-all':
                saveConsent({ analytics: true, marketing: true });
                hideBanner();
                break;
            case 'accept-necessary':
                saveConsent({ analytics: false, marketing: false });
                hideBanner();
                break;
            case 'customize':
                hideBanner();
                showPreferences();
                break;
            case 'save-preferences':
                const analyticsToggle = document.getElementById('analytics-toggle');
                const marketingToggle = document.getElementById('marketing-toggle');
                saveConsent({
                    analytics: analyticsToggle ? analyticsToggle.checked : false,
                    marketing: marketingToggle ? marketingToggle.checked : false
                });
                hidePreferences();
                break;
            case 'back-to-banner':
                hidePreferences();
                showBanner();
                break;
        }
    }

    // Initialize banner
    function initBanner() {
        // Check existing consent and manage analytics
        const existingConsent = getConsent();
        if (existingConsent) {
            manageGoogleAnalytics(existingConsent.analytics);
            return; // Don't show banner if consent already given
        }

        const lang = getCurrentLanguage();
        
        // Add styles to head
        const styleElement = document.createElement('div');
        styleElement.innerHTML = createBannerStyles();
        document.head.appendChild(styleElement.firstElementChild);
        
        // Add banner HTML to body
        const bannerElement = document.createElement('div');
        bannerElement.innerHTML = createBannerHTML(lang);
        document.body.appendChild(bannerElement.firstElementChild);
        document.body.appendChild(bannerElement.lastElementChild);
        
        // Add event listeners
        document.addEventListener('click', function(e) {
            const action = e.target.getAttribute('data-action');
            if (action) {
                e.preventDefault();
                handleBannerAction(action);
            }
            
            if (e.target.classList.contains('cookies-banner-close') || 
                e.target.classList.contains('cookies-preferences-close')) {
                e.preventDefault();
                if (e.target.classList.contains('cookies-banner-close')) {
                    hideBanner();
                } else {
                    hidePreferences();
                }
            }
        });
        
        // Show banner after delay
        setTimeout(showBanner, config.showDelay);
    }

    // Update banner language
    function updateBannerLanguage(newLang) {
        if (!translations[newLang]) {
            console.warn(`Language '${newLang}' not supported by cookies banner`);
            return;
        }

        const banner = document.getElementById('cookies-banner');
        const preferences = document.getElementById('cookies-preferences');
        
        if (banner || preferences) {
            // Remove existing banner and preferences
            if (banner) banner.remove();
            if (preferences) preferences.remove();
            
            // Create new banner with updated language
            const bannerElement = document.createElement('div');
            bannerElement.innerHTML = createBannerHTML(newLang);
            document.body.appendChild(bannerElement.firstElementChild);
            document.body.appendChild(bannerElement.lastElementChild);
            
            // Show banner if it was visible before
            if (banner && banner.style.display !== 'none') {
                showBanner();
            }
        }
    }

    // Public API
    window.CookiesBanner = {
        init: initBanner,
        hasConsent: hasConsent,
        getConsent: getConsent,
        saveConsent: saveConsent,
        show: showBanner,
        hide: hideBanner,
        manageAnalytics: manageGoogleAnalytics,
        getCookiesInfo: () => config.cookiesInfo,
        updateLanguage: updateBannerLanguage
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBanner);
    } else {
        initBanner();
    }

})();
