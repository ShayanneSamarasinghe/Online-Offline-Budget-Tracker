var CACHE_NAME = "site-cache";
var DATA_CACHE_NAME = "data-cache";

const filesToCache = [
  "/",
  "/db.js",
  "/assets/index.js",
  "/manifest.json",
  "/assets/styles.css",
  "/assets/icons/icon-192x192.png",
  "/assets/icons/icon-512x512.png"
];

self.addEventListener("install", function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("Opened cache, storing the files in the array");
      return cache.addAll(filesToCache);
    })
  );
});


self.addEventListener("fetch", function(event) {
    // cache all get requests to /api routes
    if (event.request.url.includes("/api/")) {
      event.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(event.request)
            .then(response => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(event.request.url, response.clone());
              }
  
              return response;
            })
            .catch(err => {
              // Network request failed, try to get it from the cache.
              return cache.match(event.request);
            });
        }).catch(err => console.log(err))
      );
  
      return;
    }

    
    event.respondWith(
        fetch(event.request).catch(function() {
          return caches.match(event.request).then(function(response) {
            if (response) {
              return response;
            } else if (event.request.headers.get("accept").includes("text/html")) {
              // return the cached home page for all requests for html pages
              return caches.match("/");
            }
          });
        })
      );
    });