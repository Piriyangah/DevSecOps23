self.addEventListener('install', event => {
    console.log('sw installing...', event);
    event.waitUntil(caches.open('static')
    .then(cache => {
        console.log('cache geöffnet');
        cache.addAll([
            '/',
            '/index.html',
            '/src/js/app.js',
            '/src/js/feed.js',
            '/src/js/material.min.js',
            '/src/js/idb.js',
            '/src/css/app.css',
            '/src/css/feed.css',
            '/src/css/responsive.css',
            'https://fonts.googleapis.com/css?family=Roboto:400,700',
            'https://fonts.googleapis.com/icon?family=Material+Icons',
            'https://code.getmdl.io/1.3.0/material.blue_grey-red.min.css'
        ]);
    })
    );
})

self.addEventListener('activate', event => {
    console.log('sw activating...', event);
    return self.clients.claim();
})

self.addEventListener('fetch', event => {
    console.log('sw fetching...', event.request);
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if(response){
                return response;
            }else{
                return fetch(event.request)
                .then(res => {
                    return caches.open('dynamic')
                    .then(cache => {
                        cache.put(event.request.url, res);
                        return res;
                    })
                })
            }
        })
    )
})

