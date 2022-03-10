var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '/',
    '/fallback.json',
    '/css/main.css',
    '/js/main.js',
    'img/logo.jpg'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});


self.addEventListener('fetch', function (event) {
    var request = event.request;
    var url = new URL(request.url);

    if (url.origin === location.origin) {
        event.respondWith(
            caches.match(request).then(function (response) {
                return response || fetch(request);
            })
        );
    } else {
        event.respondWith(
            caches.open('data-cache-v1').then(function (cache) {
                return fetch(request).then(function (liveResponse) {
                    cache.put(request, liveResponse.clone());
                    return liveResponse;
                }).catch(function () {
                    return caches.match(request).then(function (response) {
                        if (response) return response;
                        return caches.match('/fallback.json')
                    });
                });
            })
        )
    }
});




self.addEventListener('activate', function (event) {

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName !== CACHE_NAME;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});