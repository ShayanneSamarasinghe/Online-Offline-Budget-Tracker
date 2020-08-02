const CACHE_NAME = "my-site-cache-v1"
const DATA_CACHE_NAME = "data-cache-v1"

const filestoCache = [
    "/",
    "/assets/style.css",
    "/assets/index.js",
    "/assets/manifest.json",
    "/assets/icons/icon-192x192.png",
    "/assets/icons/icon-512x512.png",
    

]

self.addEventListener("install", function (event){
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            console.log("Opened cache, storing the files in the array")
            return cache.addAll(filestoCache)
        })

    )
})

self.addEventListener("fetch", function(event){
    if(event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
            return fetch(event.request)
            .then(response => {
                if (response.status === 200) {
                    cache.put(event.request.url, request.clone())    
                }

                return response;            

            })
            .catch(err => {
                return cache.match(event.request)
            })
         }).catch(err => console.log(err))
        
       )
     return;  
        
    }
    event.respondWith(
        fetch(event.request).catch(function() {
          return caches.match(event.request).then(function(response) {
            if (response) {
              return response;
            } else if (event.request.headers.get("accept").includes("text/html")) {
            
              return caches.match("/");
            }
          });
        })
      );
});