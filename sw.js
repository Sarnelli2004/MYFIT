// Prima la rete (così gli aggiornamenti arrivano subito), senza internet la copia salvata.
const C="myfit-v8";
const CORE=["./","index.html","pasti.html","allenamento.html","diario.html","classifica.html","myfit.js","dieta.js","punti.js","firebase-config.js","manifest-myfit.webmanifest","icona-myfit-180.png","icona-myfit-192.png","icona-myfit-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).catch(()=>{}));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
  e.respondWith(fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match("index.html"))))});
