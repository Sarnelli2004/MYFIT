/* MyFit: profilo condiviso, calcoli e barra di navigazione comune alle tre pagine */
(function(){
  const KEY="myfit-profilo";
  const GOALS={massa:{f:1.10,label:"Massa muscolare"},mantenimento:{f:1.00,label:"Mantenimento"},dimagrimento:{f:0.80,label:"Dimagrimento"}};
  const ACT={1.4:"Lavoro seduto, poco movimento",1.55:"Un po' di movimento durante il giorno",1.7:"Lavoro in piedi o molto attivo"};

  function load(){try{const p=JSON.parse(localStorage.getItem(KEY)||"null");return p&&p.pesi&&p.pesi.length?p:null}catch(e){return null}}
  function save(p){try{localStorage.setItem(KEY,JSON.stringify(p));return true}catch(e){return false}}
  function age(p){return p.eta+Math.floor((Date.now()-p.etaData)/(365.25*864e5))}
  function lastW(p){return p.pesi[p.pesi.length-1]}
  function calc(p,kgOverride){
    const w=kgOverride??lastW(p).kg, h=p.altezza, a=age(p);
    const bmr=10*w+6.25*h-5*a+(p.sesso==="F"?-161:5);
    const tdee=bmr*p.attivita, g=GOALS[p.obiettivo]||GOALS.massa;
    const kcal=Math.round((tdee*g.f+(p.correzione||0))/50)*50;
    const prot=Math.round(w*(p.obiettivo==="dimagrimento"?2:1.8));
    const bmi=w/Math.pow(h/100,2);
    return {kcal,prot,bmi,tdee:Math.round(tdee),age:a,kg:w};
  }
  function bmiLabel(b){return b<18.5?["Sottopeso","warn"]:b<25?["Normopeso","ok"]:b<30?["Sovrappeso","warn"]:["Obesità","bad"]}

  const ICONS={
    home:'<path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1z"/>',
    dieta:'<path d="M7 3v8a2 2 0 0 0 2 2v8M5 3v5M9 3v5M16 21V3c2.5 1.5 3.5 4 3.5 7.5S18 14 16 14"/>',
    palestra:'<path d="M3 9.5v5M6 7v10M18 7v10M21 9.5v5M6 12h12"/>'
  };
  function nav(active){
    const st=document.createElement("style");
    st.textContent=`.mf-nav{position:fixed;left:0;right:0;bottom:0;z-index:20;background:var(--surface);border-top:1px solid var(--line);
      display:grid;grid-template-columns:repeat(3,1fr);padding:6px 8px calc(6px + env(safe-area-inset-bottom,0px))}
      .mf-nav a{display:grid;justify-items:center;gap:2px;padding:6px 0;border-radius:12px;text-decoration:none;color:var(--muted);font:600 .72rem/1.1 inherit;font-family:inherit}
      .mf-nav svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
      .mf-nav a[aria-current="page"]{color:var(--accent)}
      .mf-nav a[aria-current="page"] svg{stroke-width:2.4}
      .mf-nav a:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
      body{padding-bottom:calc(68px + env(safe-area-inset-bottom,0px))}`;
    document.head.appendChild(st);
    const n=document.createElement("nav");n.className="mf-nav";n.setAttribute("aria-label","Sezioni");
    n.innerHTML=[["home","index.html","Home"],["dieta","pasti.html","Dieta"],["palestra","allenamento.html","Palestra"]]
      .map(([k,h,l])=>`<a href="${h}" ${k===active?'aria-current="page"':""}><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg>${l}</a>`).join("");
    document.body.appendChild(n);
  }
  const fmt=(n,d=0)=>Number(n).toLocaleString("it-IT",{minimumFractionDigits:d,maximumFractionDigits:d});
  // nomi dei giorni di allenamento (stessi della pagina Palestra)
  const SPLIT_NAMES={2:["Total body A","Total body B"],3:["Petto e tricipiti","Schiena e bicipiti","Gambe e spalle"],
    4:["Petto e tricipiti","Gambe e glutei","Schiena e bicipiti","Spalle e addome"],5:["Petto","Schiena","Gambe","Spalle e addome","Braccia"]};
  const WHEN={2:[0,3],3:[0,2,4],4:[0,1,3,4],5:[0,1,2,3,4]};
  function scheda(){let S={luogo:"palestra",giorni:3,tipo:"massa",durata:60};try{Object.assign(S,JSON.parse(localStorage.getItem("myfit-scheda-impostazioni")||"null")||{})}catch(e){}return S}
  function workoutOn(d){const S=scheda(),i=WHEN[S.giorni].indexOf(d);return i<0?null:{name:SPLIT_NAMES[S.giorni][i],n:i+1,of:S.giorni,luogo:S.luogo,tipo:S.tipo,durata:S.durata}}
  function macros(c){const fat=Math.round(c.kcal*.25/9), carb=Math.round((c.kcal-c.prot*4-fat*9)/4);return {prot:c.prot,fat,carb}}
  window.MyFit={load,save,calc,age,lastW,bmiLabel,nav,fmt,GOALS,ACT,BASE_KCAL:2600,scheda,workoutOn,macros};
})();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js",{scope:"./"}).catch(()=>{}));
