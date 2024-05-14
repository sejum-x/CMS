/*
const CACHE_NAME = 'UCD cache';

function fetchAndCache(cache, url) {
    return fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url}, status: ${response.status}`);
            }
            // Only cache GET requests
            if (response.url.startsWith('http') && response.method === 'GET') {
                console.log(`Cached ${url}`);
                return cache.put(url, response.clone());
            }
        })
        .catch(function(error) {
            console.error('Caching failed:', error);
        });
}

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache', CACHE_NAME);
            console.log("Test");
            return Promise.all([
                fetchAndCache(cache, 'students_table.html'),
                fetchAndCache(cache, 'landing_page.html'),


                fetchAndCache(cache, 'cashing.js'),
                fetchAndCache(cache, 'js/responsive_navbar.js'),
                fetchAndCache(cache, 'js/login_singup.js'),
                fetchAndCache(cache, 'script.js'),

                fetchAndCache(cache, 'manifest.json'),
                fetchAndCache(cache, 'avatarplaceholder.png'),

                fetchAndCache(cache, 'style/modal.css'),
                fetchAndCache(cache, 'style/add_button.css'),
                fetchAndCache(cache, 'style/responsive_table.css'),
                fetchAndCache(cache, 'style/responsive_navbar.css'),
                fetchAndCache(cache, 'style/students_tasks.css'),
                fetchAndCache(cache, 'style/landing_page/landing_page.css'),

                
                fetchAndCache(cache, 'assets/landing_page_bg_jojo1.gif'),
                fetchAndCache(cache, 'assets/overlay.png'),
            ]);

        })
    );
});
self.addEventListener('fetch', (e) => {
    if (!(
        e.request.url.startsWith('http:') || e.request.url.startsWith('https:')
    )) {
        return;
    }

    e.respondWith((async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) return r;
        const response = await fetch(e.request);
        const cache = await caches.open(CACHE_NAME);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        await cache.put(e.request, response.clone());
        return response;
    })());
});*/
