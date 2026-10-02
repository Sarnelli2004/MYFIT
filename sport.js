/* MyFit · sport: piano settimanale, registro attività, calorie consumate, import GPX/TCX dagli orologi */
(function(){
const KEY="myfit-sport", DAY=864e5;
// MET (Compendium of Physical Activities) per intensità: leggera, media, intensa
const SPORTS={
  calcio:{n:"Calcio",met:[7,8.5,10],gambe:true,dist:false,ico:"⚽"},
  calcetto:{n:"Calcetto",met:[7,8,9.5],gambe:true,dist:false,ico:"⚽"},
  corsa:{n:"Corsa",met:[7,9.8,11.5],gambe:true,dist:true,ico:"🏃"},
  padel:{n:"Padel",met:[5,6,7.3],gambe:true,dist:false,ico:"🎾"},
  tennis:{n:"Tennis",met:[5,7,8],gambe:true,dist:false,ico:"🎾"},
  nuoto:{n:"Nuoto",met:[6,8.3,10],gambe:false,dist:true,ico:"🏊"},
  bici:{n:"Bici",met:[6.8,8,10],gambe:true,dist:true,ico:"🚴"},
  camminata:{n:"Camminata",met:[3,3.8,5],gambe:false,dist:true,ico:"🚶"}
};
const INT=[["leggera","Leggera"],["media","Media"],["intensa","Intensa"]];
const IDX={leggera:0,media:1,intensa:2};
const GIORNI=["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"];
const NOTE=["Partita","Allenamento di squadra","Gara","Uscita lunga","Ripetute","Vinto 🎉","Perso","Mi sentivo bene","Gambe pesanti"];
const TIPS={
  calcio:["Niente gambe pesanti in palestra il giorno prima della partita.","Utili in palestra: affondi, stacco rumeno, leg curl per i femorali e tanto core.","Dopo la partita: stretching di femorali, polpacci e adduttori."],
  calcetto:["Il giorno prima: carichi leggeri sulle gambe.","Scatti e cambi di direzione: allena glutei, adduttori e caviglie.","Riscaldati bene: 5 minuti di corsetta e allunghi prima di giocare."],
  corsa:["Fai i pesi gambe il giorno dopo la corsa, non il giorno prima delle ripetute.","Utili: polpacci, glutei (ponte, hip thrust) e core.","Aumenta i km di non più del 10% a settimana."],
  padel:["Spalle e avambracci lavorano tanto: non saltare le alzate laterali.","Spostamenti laterali: rinforza glutei e adduttori.","Scaldati bene il polso e la spalla prima di giocare."],
  tennis:["Allena la cuffia dei rotatori con elastici e carichi leggeri.","Core e gambe per gli spostamenti laterali.","Stretching di spalle e avambracci dopo la partita."],
  nuoto:["Spalle e dorsali lavorano tanto: in palestra carichi moderati sulle spalle.","Utili: rematore, lat machine e core.","Dopo la piscina recupera con una buona merenda proteica."],
  bici:["Allena glutei e core: aiutano la pedalata e proteggono la schiena.","Stretching dei flessori dell'anca dopo le uscite lunghe.","Uscite oltre le 2 ore: porta acqua e qualcosa da mangiare."],
  camminata:["Ottima nei giorni di riposo: aiuta il recupero.","10.000 passi sono circa 7–8 km.","Scarpe comode e passo svelto per farla contare di più."]
};
const read=()=>{try{return Object.assign({piano:[],log:[]},JSON.parse(localStorage.getItem(KEY)||"null")||{})}catch(e){return {piano:[],log:[]}}};
const write=d=>{try{localStorage.setItem(KEY,JSON.stringify(d));return true}catch(e){return false}};
const uid=()=>Math.random().toString(36).slice(2,9);
const kg=()=>{const P=window.MyFit&&MyFit.load();return P?MyFit.lastW(P).kg:70};
const pad=n=>String(n).padStart(2,"0");
const keyOf=t=>{const d=new Date(t);return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};

// calorie totali e calorie "extra" (oltre a quelle già contate nel fabbisogno)
function kcal(sport,min,int,km){const S=SPORTS[sport];if(!S)return {tot:0,extra:0};let met=S.met[IDX[int]??1];
  if(km&&S.dist&&min>0){const v=km/(min/60); // velocità reale, se c'è la distanza
    if(sport==="corsa")met=Math.max(6,Math.min(16,v*1.0));
    else if(sport==="bici")met=v<16?6:v<20?7:v<23?8.5:v<26?10:12;
    else if(sport==="camminata")met=v<4?3:v<5.5?3.8:5;}
  const h=min/60,w=kg();return {tot:Math.round(met*w*h),extra:Math.round((met-1)*w*h)}}
const round50=n=>Math.round(n/50)*50;

/* piano settimanale */
function piano(){return read().piano}
function addPiano(p){const d=read();d.piano.push({id:uid(),...p});write(d)}
function delPiano(id){const d=read();d.piano=d.piano.filter(x=>x.id!==id);write(d)}
function onWeekday(w){return piano().filter(p=>p.giorno===w)}
/* registro */
function log(){return read().log.sort((a,b)=>b.date-a.date)}
function addLog(a){const d=read();const k=kcal(a.sport,a.durata,a.intensita,a.km);d.log.push({id:uid(),...a,kcal:a.kcal||k.tot,extra:k.extra});write(d)}
function delLog(id){const d=read();d.log=d.log.filter(x=>x.id!==id);write(d)}
function onDate(k){return log().filter(a=>keyOf(a.date)===k)}

/* calorie da aggiungere alla dieta: per la data reale usa ciò che è registrato, altrimenti il piano */
function extraFor(weekday,dateKey){
  const done=dateKey?onDate(dateKey):[];
  const src=done.length?done.map(a=>({sport:a.sport,extra:a.extra??kcal(a.sport,a.durata,a.intensita,a.km).extra,fonte:"fatto"}))
    :onWeekday(weekday).map(p=>({sport:p.sport,extra:kcal(p.sport,p.durata,p.intensita).extra,fonte:"piano"}));
  const tot=round50(src.reduce((s,x)=>s+x.extra,0));
  return {kcal:tot,list:src,label:src.map(x=>SPORTS[x.sport].n.toLowerCase()).join(" e ")};
}
/* avvisi per la palestra: sport con le gambe il giorno dopo o lo stesso giorno */
function gymWarning(weekday,dayName){
  const legs=/gambe|total/i.test(dayName||"");
  const tom=onWeekday((weekday+1)%7).filter(p=>SPORTS[p.sport].gambe&&p.intensita!=="leggera");
  const same=onWeekday(weekday);
  if(legs&&tom.length)return `Domani hai ${SPORTS[tom[0].sport].n.toLowerCase()}: oggi gambe con carichi più leggeri (circa −20%) e niente serie a cedimento.`;
  if(same.length)return `Oggi hai anche ${SPORTS[same[0].sport].n.toLowerCase()}: se riesci, fai i pesi prima dello sport o spostali al giorno dopo.`;
  return "";
}

/* lettura file GPX e TCX esportati dagli orologi */
function parseFile(text,name){
  const doc=new DOMParser().parseFromString(text,"application/xml");
  if(doc.querySelector("parsererror"))throw new Error("File non leggibile");
  const q=(el,tag)=>[...el.getElementsByTagNameNS("*",tag)];
  const R=6371,rad=x=>x*Math.PI/180;
  const dist=pts=>{let s=0;for(let i=1;i<pts.length;i++){const [a,b]=[pts[i-1],pts[i]];const dl=rad(b[0]-a[0]),dn=rad(b[1]-a[1]);
    const h=Math.sin(dl/2)**2+Math.cos(rad(a[0]))*Math.cos(rad(b[0]))*Math.sin(dn/2)**2;s+=2*R*Math.asin(Math.sqrt(h))}return s};
  const guess=s=>{s=(s||"").toLowerCase();return /run|corsa|jog/.test(s)?"corsa":/bik|cycl|ride|bici/.test(s)?"bici":/swim|nuot/.test(s)?"nuoto":/walk|hik|cammin/.test(s)?"camminata":/soccer|football|calc/.test(s)?"calcio":/tennis/.test(s)?"tennis":/padel/.test(s)?"padel":""};
  let out={sport:"",durata:0,km:0,kcal:0,fc:0,date:Date.now()};
  if(q(doc,"Activity").length){ // TCX
    const act=q(doc,"Activity")[0];out.sport=guess(act.getAttribute("Sport"))||guess(name);
    const laps=q(doc,"Lap");let sec=0,m=0,cal=0;laps.forEach(l=>{sec+=+(q(l,"TotalTimeSeconds")[0]?.textContent||0);m+=+(q(l,"DistanceMeters")[0]?.textContent||0);cal+=+(q(l,"Calories")[0]?.textContent||0)});
    const hr=q(doc,"HeartRateBpm").map(h=>+q(h,"Value")[0]?.textContent).filter(Boolean);
    const id=q(act,"Id")[0]?.textContent;out={...out,durata:Math.round(sec/60),km:Math.round(m/100)/10,kcal:Math.round(cal),fc:hr.length?Math.round(hr.reduce((a,b)=>a+b,0)/hr.length):0,date:id?Date.parse(id):Date.now()};
  }else{ // GPX
    const pts=q(doc,"trkpt").map(p=>[+p.getAttribute("lat"),+p.getAttribute("lon"),Date.parse(q(p,"time")[0]?.textContent||"")]);
    if(pts.length<2)throw new Error("Nel file non c'è un percorso");
    const t=pts.map(p=>p[2]).filter(x=>!isNaN(x));
    out.sport=guess(q(doc,"type")[0]?.textContent)||guess(q(doc,"name")[0]?.textContent)||guess(name);
    out.durata=t.length>1?Math.round((t[t.length-1]-t[0])/60000):0;out.km=Math.round(dist(pts)*10)/10;out.date=t[0]||Date.now();
    const hr=q(doc,"hr").map(h=>+h.textContent).filter(Boolean);out.fc=hr.length?Math.round(hr.reduce((a,b)=>a+b,0)/hr.length):0;
  }
  if(!out.durata)throw new Error("Nel file non trovo la durata dell'attività");
  // intensità dalla frequenza cardiaca, se c'è (rispetto alla FC massima stimata 220 − età)
  const P=window.MyFit&&MyFit.load(),fcMax=220-(P?MyFit.age(P):30);
  out.intensita=out.fc?(out.fc<fcMax*.65?"leggera":out.fc<fcMax*.8?"media":"intensa"):"media";
  return out;
}
function settimana(){const now=new Date(),d=(now.getDay()+6)%7,start=new Date(now.getFullYear(),now.getMonth(),now.getDate()-d).getTime();
  const L=log().filter(a=>a.date>=start);return {n:L.length,min:L.reduce((s,a)=>s+(+a.durata||0),0),kcal:L.reduce((s,a)=>s+(+a.kcal||0),0),km:Math.round(L.reduce((s,a)=>s+(+a.km||0),0)*10)/10}}
window.Sport={SPORTS,INT,GIORNI,NOTE,TIPS,kcal,piano,addPiano,delPiano,onWeekday,log,addLog,delLog,onDate,extraFor,gymWarning,parseFile,settimana,keyOf,round50};
})();
