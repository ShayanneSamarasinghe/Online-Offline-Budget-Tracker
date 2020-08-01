const CACHE_NAME = "my-site-cache-v1"
const DATA_CACHE_NAME = "data-cache-v1"

const filestoCache = [
    "/",
    "/db.js",
    "/index.js",
    "/manifest.json",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    

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
})