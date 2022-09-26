importScripts('/src/js/idb.js');
importScripts('/src/js/db.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');


const CURRENT_STATIC_CACHE = 'static-v3';
const CURRENT_DYNAMIC_CACHE = 'dynamic-v3';
const STATIC_FILES = [
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
];


const db = idb.openDB('posts-store', 1, {
    upgrade(db) {
        // Create a store of objects
        const store = db.createObjectStore('posts', {
            // The '_id' property of the object will be the key.
            keyPath: '_id',
            // If it isn't explicitly set, create a value by auto incrementing.
            autoIncrement: true,
        });
        // Create an index on the '_id' property of the objects.
        store.createIndex('_id', '_id');
    },
});


self.addEventListener('install', event => {
    console.log('sw installing...', event);
    event.waitUntil(caches.open(CURRENT_STATIC_CACHE)
    .then(cache => {
        console.log('cache geöffnet');
        cache.addAll(STATIC_FILES);
    })
    );
})


self.addEventListener('activate', event => {
    console.log('sw activating...', event);
    event.waitUntil(
        caches.keys()
            .then( keyList => {
                return Promise.all(keyList.map( key => {
                    if(key !== CURRENT_STATIC_CACHE && key !== CURRENT_DYNAMIC_CACHE) {
                        console.log('service worker --> old cache removed :', key);
                        return caches.delete(key);
                    }
                }))
            })
    );
    return self.clients.claim();
})



self.addEventListener('sync', event => {
    console.log('service worker --> background syncing ...', event);
    if(event.tag === 'sync-new-post') {
        console.log('service worker --> syncing new posts ...');
        event.waitUntil(
            readAllData('sync-posts')
                .then( dataArray => {
                    for(let data of dataArray) {
                        console.log('data from IndexedDB', data);
                        const formData = new FormData();
                        formData.append('title', data.title);
                        formData.append('location', data.location);
                        formData.append('file', data.image_id);

                        console.log('formData', formData)

                        fetch('http://localhost:3000/posts', {
                            method: 'POST',
                            body: formData
                        })
                            .then( response => {
                                console.log('Data sent to backend ...', response);
                                if(response.ok) {
                                    deleteOneData('sync-posts', data.id)
                                }
                            })
                            .catch( err => {
                                console.log('Error while sending data to backend ...', err);
                            })
                    }
                })
        );
    }
})


self.addEventListener('notificationclick', event => {
    let notification = event.notification;
    let action = event.action;

    console.log(notification);

    if(action === 'confirm') {
        console.log('confirm was chosen');
        notification.close();
    } else {
        console.log(action);
        event.waitUntil(
            clients.matchAll()      // clients sind alle Windows (Browser), fuer die der Service Worker verantwortlich ist
                .then( clientsArray => {
                    let client = clientsArray.find( c => {
                        return c.visibilityState === 'visible';
                    });

                    if(client !== undefined) {
                        client.navigate('http://localhost:8080');
                        client.focus();
                    } else {
                        clients.openWindow('http://localhost:8080');
                    }
                    notification.close();
                })
        );
    }
});


self.addEventListener('notificationclose', event => {
    console.log('notification was closed', event);
});

self.addEventListener('push', event => {
    console.log('push notification received', event);
    let data = { title: 'Test', content: 'Fallback message', openUrl: '/'};
    if(event.data) {
        data = JSON.parse(event.data.text());
    }
    let options = {
        body: data.content,
        icon: '/src/images/1.png',
        data: {
            url: data.openUrl
        }
    };
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});


self.addEventListener('fetch', event => {
    if (!(event.request.url.indexOf('http') === 0)) return;
    const url = 'http://localhost:3000/posts';
    if(event.request.url.indexOf(url) >= 0) {
        event.respondWith(
            fetch(event.request)
            .then ( res => {
                const clonedResponse = res.clone();
                clearAllData('posts')
                .then( () => {
                    return clonedResponse.json();
                })
                .then( data => {
                            for(let key in data)
                            {
                                console.log('write data', data[key]);
                                writeData('posts', data[key]);
                            }
                    });
                    return res;
                })
        )
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response;
                    } else {
                        return fetch(event.request)
                            .then(res => { // nicht erneut response nehmen, haben wir schon
                                return caches.open(CURRENT_DYNAMIC_CACHE) // neuer, weiterer Cache namens dynamic
                                    .then(cache => {
                                        cache.put(event.request.url, res.clone());
                                        return res;
                                    })
                            });
                    }
                })
        )
    }    
})
