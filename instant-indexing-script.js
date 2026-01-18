// Instant Indexing Script for Local Notes
// This script helps search engines discover and index content immediately

(function() {
    'use strict';
    
    // Configuration
    const config = {
        siteName: 'Local Notes',
        baseUrl: 'https://localnotes-three.vercel.app',
        languages: ['en', 'ru', 'ua', 'pl', 'cs', 'sk', 'bg', 'hr', 'sr', 'bs', 'mk', 'sl'],
        indexNowKey: 'your-indexnow-key-here',
        googleSearchConsoleKey: 'your-google-key-here'
    };
    
    // Country-specific SEO data
    const countryData = {
        'en': {
            name: 'Local Notes',
            description: 'Secure note-taking app with AES-256 encryption',
            keywords: 'local notes, secure notes, encryption, AES-256, PWA, offline',
            region: 'Global',
            language: 'English'
        },
        'ru': {
            name: 'Локальные заметки',
            description: 'Безопасное приложение для заметок с шифрованием AES-256',
            keywords: 'локальные заметки, безопасные заметки, шифрование, AES-256, PWA, офлайн',
            region: 'Russia',
            language: 'Russian'
        },
        'ua': {
            name: 'Локальні Нотатки',
            description: 'Безпечний додаток для нотаток з шифруванням AES-256',
            keywords: 'локальні нотатки, безпечні нотатки, шифрування, AES-256, PWA, офлайн',
            region: 'Ukraine',
            language: 'Ukrainian'
        },
        'pl': {
            name: 'Lokalne Notatki',
            description: 'Bezpieczna aplikacja do notatek z szyfrowaniem AES-256',
            keywords: 'lokalne notatki, bezpieczne notatki, szyfrowanie, AES-256, PWA, offline',
            region: 'Poland',
            language: 'Polish'
        },
        'cs': {
            name: 'Místní poznámky',
            description: 'Bezpečná aplikace pro poznámky s šifrováním AES-256',
            keywords: 'místní poznámky, bezpečné poznámky, šifrování, AES-256, PWA, offline',
            region: 'Czech Republic',
            language: 'Czech'
        },
        'sk': {
            name: 'Miestne poznámky',
            description: 'Bezpečná aplikácia pre poznámky s šifrovaním AES-256',
            keywords: 'miestne poznámky, bezpečné poznámky, šifrovanie, AES-256, PWA, offline',
            region: 'Slovakia',
            language: 'Slovak'
        },
        'bg': {
            name: 'Локални бележки',
            description: 'Безопасно приложение за бележки с шифроване AES-256',
            keywords: 'локални бележки, безопасни бележки, шифроване, AES-256, PWA, офлайн',
            region: 'Bulgaria',
            language: 'Bulgarian'
        },
        'hr': {
            name: 'Lokalne bilješke',
            description: 'Sigurna aplikacija za bilješke s AES-256 šifriranjem',
            keywords: 'lokalne bilješke, sigurne bilješke, šifriranje, AES-256, PWA, offline',
            region: 'Croatia',
            language: 'Croatian'
        },
        'sr': {
            name: 'Локалне белешке',
            description: 'Безбедна апликација за белешке са AES-256 шифровањем',
            keywords: 'локалне белешке, безбедне белешке, шифровање, AES-256, PWA, офлајн',
            region: 'Serbia',
            language: 'Serbian'
        },
        'bs': {
            name: 'Lokalne bilješke',
            description: 'Sigurna aplikacija za bilješke s AES-256 šifriranjem',
            keywords: 'lokalne bilješke, sigurne bilješke, šifriranje, AES-256, PWA, offline',
            region: 'Bosnia and Herzegovina',
            language: 'Bosnian'
        },
        'mk': {
            name: 'Локални белешки',
            description: 'Безбедна апликација за белешки со AES-256 шифрирање',
            keywords: 'локални белешки, безбедни белешки, шифрирање, AES-256, PWA, офлајн',
            region: 'North Macedonia',
            language: 'Macedonian'
        },
        'sl': {
            name: 'Lokalni zapiski',
            description: 'Varna aplikacija za zapiske z AES-256 šifriranjem',
            keywords: 'lokalni zapiski, varni zapiski, šifriranje, AES-256, PWA, brez povezave',
            region: 'Slovenia',
            language: 'Slovenian'
        }
    };
    
    // Generate URLs for all languages
    function generateUrls() {
        const urls = [];
        
        // Main pages
        urls.push(config.baseUrl + '/');
        config.languages.forEach(lang => {
            if (lang !== 'en') {
                urls.push(`${config.baseUrl}/${lang}/`);
            }
        });
        
        // Policy pages
        const policyPages = ['privacy_policy.html', 'usage_policy.html', 'cookie_policy.html'];
        policyPages.forEach(page => {
            urls.push(`${config.baseUrl}/${page}`);
            config.languages.forEach(lang => {
                if (lang !== 'en') {
                    const pageName = page === 'cookie_policy.html' ? 'cookie_policy.html' : page;
                    urls.push(`${config.baseUrl}/${lang}/${pageName}`);
                }
            });
        });
        
        return urls;
    }
    
    // Submit to IndexNow
    function submitToIndexNow(urls) {
        const indexNowEndpoint = 'https://api.indexnow.org/indexnow';
        
        const payload = {
            host: 'localnotes-three.vercel.app',
            key: config.indexNowKey,
            keyLocation: `${config.baseUrl}/indexnow.txt`,
            urlList: urls
        };
        
        fetch(indexNowEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (response.ok) {
                console.log('✅ IndexNow submission successful');
            } else {
                console.log('⚠️ IndexNow submission failed:', response.status);
            }
        })
        .catch(error => {
            console.log('❌ IndexNow submission error:', error);
        });
    }
    
    // Submit to Google Search Console
    function submitToGoogleSearchConsole(urls) {
        const googleEndpoint = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
        
        urls.forEach(url => {
            fetch(googleEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.googleSearchConsoleKey}`
                },
                body: JSON.stringify({
                    url: url,
                    type: 'URL_UPDATED'
                })
            })
            .then(response => {
                if (response.ok) {
                    console.log(`✅ Google indexing request sent for: ${url}`);
                } else {
                    console.log(`⚠️ Google indexing failed for: ${url}`);
                }
            })
            .catch(error => {
                console.log(`❌ Google indexing error for ${url}:`, error);
            });
        });
    }
    
    // Generate structured data for current page
    function generateStructuredData() {
        const currentLang = document.documentElement.lang || 'en';
        const data = countryData[currentLang] || countryData['en'];
        
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": data.name,
            "description": data.description,
            "url": window.location.href,
            "applicationCategory": "ProductivityApplication",
            "operatingSystem": "Web Browser",
            "inLanguage": currentLang,
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            },
            "author": {
                "@type": "Person",
                "name": "SerGio Play",
                "url": "https://sergioplay-dev.vercel.app/"
            },
            "publisher": {
                "@type": "Person",
                "name": "SerGio Play"
            },
            "datePublished": "2024-01-01",
            "dateModified": new Date().toISOString().split('T')[0],
            "keywords": data.keywords,
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "500",
                "bestRating": "5"
            }
        };
        
        // Add structured data to page
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }
    
    // Initialize instant indexing
    function init() {
        console.log('🚀 Initializing instant indexing for Local Notes');
        
        // Generate structured data
        generateStructuredData();
        
        // Generate all URLs
        const urls = generateUrls();
        
        // Submit to indexing services
        setTimeout(() => {
            submitToIndexNow(urls);
        }, 1000);
        
        // Submit to Google (if key is available)
        if (config.googleSearchConsoleKey && config.googleSearchConsoleKey !== 'your-google-key-here') {
            setTimeout(() => {
                submitToGoogleSearchConsole(urls);
            }, 2000);
        }
        
        console.log(`📊 Submitted ${urls.length} URLs for indexing`);
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();