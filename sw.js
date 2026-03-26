var CACHE_NAME = 'studytracker-v118';
var ASSETS = [
    '/',
    '/index.html',
    '/features.html',
    '/about.html',
    '/style.css',
    '/mobile.css',
    '/app.js',
    '/mobile.js',
    '/presets.js',
    '/i18n.js',
    '/manifest.json'
];

// Install: cache core assets
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(names) {
            return Promise.all(
                names.filter(function(n) { return n !== CACHE_NAME; })
                    .map(function(n) { return caches.delete(n); })
            );
        })
    );
    self.clients.claim();
});

// Fetch: network-first for HTML/JS (always fresh), cache-first for static assets
self.addEventListener('fetch', function(e) {
    var url = new URL(e.request.url);

    // Skip non-GET and cross-origin requests
    if (e.request.method !== 'GET' || url.origin !== location.origin) return;

    // Network-first for app files (always get latest)
    if (url.pathname.endsWith('.html') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname === '/') {
        e.respondWith(
            fetch(e.request).then(function(res) {
                var clone = res.clone();
                caches.open(CACHE_NAME).then(function(cache) { cache.put(e.request, clone); });
                return res;
            }).catch(function() {
                return caches.match(e.request);
            })
        );
        return;
    }

    // Cache-first for everything else (images, fonts)
    e.respondWith(
        caches.match(e.request).then(function(cached) {
            return cached || fetch(e.request).then(function(res) {
                var clone = res.clone();
                caches.open(CACHE_NAME).then(function(cache) { cache.put(e.request, clone); });
                return res;
            });
        })
    );
});
