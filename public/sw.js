/* --- WANDERING ARCANUM: SERVICE WORKER --- */
const CACHE_NAME = "arcanum-spell-cache-v1";
const API_URL = "https://www.dnd5eapi.co";

// Install: Wake up and skip the waiting line
self.addEventListener("install", () => {
  console.log("[Service Worker] Installed and ready to scribe.");
  self.skipWaiting();
});

// Activate: Take control of the app immediately
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activated and watching the Weave.");
  event.waitUntil(self.clients.claim());
});

// Fetch: Intercepting the network requests
self.addEventListener("fetch", (event) => {
  // 📍 THE SAFETY CHECK: Only intercept D&D API requests.
  // Leave local files (HTML, CSS, JSX) alone so hot-reloading still works!
  if (event.request.url.startsWith(API_URL)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // 1. THE VAULT: If we already have the spell saved, return it instantly (0ms)
        if (cachedResponse) {
          console.log("[Service Worker] Serving from cache:", event.request.url);
          return cachedResponse;
        }

        // 2. THE FETCH: If it's not in the vault, go to the internet
        console.log("[Service Worker] Fetching from network:", event.request.url);
        return fetch(event.request).then((networkResponse) => {
          // Make sure we actually got a good response before saving it
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            (networkResponse.type !== "basic" && networkResponse.type !== "cors")
          ) {
            return networkResponse;
          }

          // 3. THE CLONE: A network response is a stream and can only be consumed once.
          // We need to clone it: one copy for the browser, one copy for the cache.
          const responseToCache = networkResponse.clone();

          // 4. THE SAVE: Open our vault and store the clone
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          // 5. THE DELIVERY: Hand the original response back to the React app
          return networkResponse;
        });
      })
    );
  }
});