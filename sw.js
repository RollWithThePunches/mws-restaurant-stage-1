
//service worker install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('restaurants-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/restaurant.html',
        '/js/main.js',
        '/js/restaurant_info.js',
        '/js/dbhelper.js',
        '/css/styles.css',
        //'/data/restaurants.json',
        '/img'
      ])
    })
  );
});


self.addEventListener('fetch', (event) => {
  console.log(event.request.url);

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((response) => {
        return caches.open('restaurants-cache').then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});