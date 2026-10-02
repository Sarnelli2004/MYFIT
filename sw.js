// Prima prova la rete (così gli aggiornamenti arrivano subito), senza internet usa la copia salvata.
const C="pasti";
const CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-180.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(self.clients.claim())});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
  e.respondWith(fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match("index.html"))))});
