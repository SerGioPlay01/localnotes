// Service Worker для Local Notes
const CACHE_NAME = 'local-notes-v1.0.2';
const STATIC_CACHE = 'static-v1.0.2';
const DYNAMIC_CACHE = 'dynamic-v1.0.2';
const CACHE_LIMIT = 50; // Максимальное количество файлов в динамическом кэше

// Файлы для кэширования
const STATIC_FILES = [
    '/',
    '/index.html',
    '/css/index.css',
    '/css/img.css',
    '/css/preloader.css',
    '/css/highlight.css',
    '/css/tinymce-custom.css',
    '/js/index.js',
    '/js/magicurl.js',
    '/js/highlight.min.js',
    '/js/img.js',
    '/js/preloader.js',
    '/js/translations.js',
    '/js/translate.js',
    '/js/themes.js',
    '/js/tinymce-translations.js',
    '/favicon/favicon-16x16.png',
    '/favicon/favicon-32x32.png',
    '/favicon/android-chrome-192x192.png',
    '/favicon/android-chrome-512x512.png',
    '/favicon/apple-touch-icon.png',
    '/favicon/favicon.ico',
    '/manifest.json',
    '/robots.txt'
];

// Языковые версии для кэширования
const LANGUAGE_VERSIONS = [
    '/ru/',
    '/ua/',
    '/pl/',
    '/cs/',
    '/sk/',
    '/bg/',
    '/hr/',
    '/sr/',
    '/bs/',
    '/mk/',
    '/sl/'
];

// Функция для ограничения размера кэша
async function limitCacheSize(cacheName, limit) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > limit) {
        await cache.delete(keys[0]);
        await limitCacheSize(cacheName, limit);
    }
}

// Установка Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                // Кэшируем файлы по одному, чтобы не падать при отсутствии одного файла
                return Promise.allSettled(
                    STATIC_FILES.map(url => 
                        fetch(url)
                            .then(response => {
                                if (response.ok) {
                                    return cache.put(url, response);
                                } else {
                                    console.warn(`Service Worker: Failed to cache ${url} - ${response.status}`);
                                }
                            })
                            .catch(error => {
                                console.warn(`Service Worker: Failed to fetch ${url}:`, error);
                            })
                    )
                );
            })
            .then(() => {
                console.log('Service Worker: Static files cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Error caching static files', error);
                // Продолжаем работу даже при ошибках кэширования
                return self.skipWaiting();
            })
    );
});

// Активация Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Перехват запросов
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Пропускаем запросы к внешним ресурсам
    if (url.origin !== location.origin) {
        return;
    }
    
    // Стратегия кэширования для разных типов ресурсов
    if (request.method === 'GET') {
        // Статические ресурсы - Cache First
        if (STATIC_FILES.includes(url.pathname) || 
            url.pathname.endsWith('.css') || 
            url.pathname.endsWith('.js') || 
            url.pathname.endsWith('.png') || 
            url.pathname.endsWith('.jpg') || 
            url.pathname.endsWith('.ico') ||
            url.pathname.endsWith('.json') ||
            url.pathname.startsWith('/editor_news/')) {
            
            event.respondWith(cacheFirst(request));
        }
        // HTML страницы - Network First
        else if (url.pathname.endsWith('.html') || 
                 url.pathname === '/' || 
                 LANGUAGE_VERSIONS.some(lang => url.pathname.startsWith(lang))) {
            
            event.respondWith(networkFirst(request));
        }
        // Остальные запросы - Network First
        else {
            event.respondWith(networkFirst(request));
        }
    }
});

// Стратегия Cache First
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.warn('Cache First strategy failed for:', request.url, error);
        // Возвращаем fallback вместо ошибки
        if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/index.html');
        }
        return new Response('Offline content not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Стратегия Network First
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            // Ограничиваем размер кэша
            await limitCacheSize(DYNAMIC_CACHE, CACHE_LIMIT);
        }
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fallback для HTML страниц
        if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/index.html');
        }
        
        return new Response('Offline content not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Обработка сообщений от основного потока
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Периодическая очистка кэша
self.addEventListener('periodicsync', event => {
    if (event.tag === 'cache-cleanup') {
        event.waitUntil(cleanupCache());
    }
});

// Функция очистки кэша
async function cleanupCache() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const requests = await cache.keys();
        const now = Date.now();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 дней
        
        for (const request of requests) {
            const response = await cache.match(request);
            const dateHeader = response.headers.get('date');
            
            if (dateHeader) {
                const responseDate = new Date(dateHeader).getTime();
                if (now - responseDate > maxAge) {
                    await cache.delete(request);
                }
            }
        }
    } catch (error) {
        console.error('Cache cleanup failed:', error);
    }
}

// Обработка push уведомлений (для будущего использования)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/favicon/android-chrome-192x192.png',
            badge: '/favicon/favicon-32x32.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Open App',
                    icon: '/favicon/favicon-32x32.png'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: '/favicon/favicon-32x32.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
