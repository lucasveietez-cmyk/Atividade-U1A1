const CACHE_NAME = 'busca-cep-v1';
const ASSETS = [
  './',
  './index.html',
  './js/script.js',
  './js/materialize.js',
  './css/materialize.css',
  './css/style.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://code.jquery.com/jquery-2.1.1.min.js'
];

// Instalação e Cache dos arquivos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Intercepta as requisições para funcionar offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.eventRequest || event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});