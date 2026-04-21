// Google Analytics — Consent Mode v2: default denied until user consents
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
});

// GA script loaded only after consent check
window.addEventListener('load', function() {
    setTimeout(function() {
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=G-HR9HLBQFCR';
        s.addEventListener('load', function() {
            gtag('js', new Date());
            gtag('config', 'G-HR9HLBQFCR');
        });
        document.head.appendChild(s);
    }, 2000);
});
