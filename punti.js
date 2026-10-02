/* MyFit · diario, punti, livelli, medaglie, record di forza e classifica online (facoltativa) */
(function(){
const DKEY="myfit-diario", WKEY="scheda3g", CKEY="myfit-classifica";
const DAY=864e5;
const pad=n=>String(n).padStart(2,"0");
const keyOf=t=>{const d=new Date(t);return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
const dateOf=k=>{const [y,m,d]=k.split("-").map(Number);return new Date(y,m-1,d,12)};
const weekday=k=>(dateOf(k).getDay()+6)%7;
const weekKey=k=>{const d=dateOf(k);d.setDate(d.getDate()-((d.getDay()+6)%7));return keyOf(d)};
const today=()=>keyOf(Date.now());
const read=(k,def)=>{try{return JSON.parse(localStorage.getItem(k)||"null")??def}catch(e){return def}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};

/* ---------- diario ---------- */
function diary(){return read(DKEY,{})}
function saveDiary(d){write(DKEY,d)}
function dayEntry(k){const d=diary();return d[k]||{}}
function setDay(k,fn){const d=diary();d[k]=d[k]||{};fn(d[k]);saveDiary(d);return d[k]}
// note preimpostate
const NOTE={
  fatto:["Tutto come da piano","Porzione più piccola","Porzione più grande"],
  diverso:["Mangiato fuori","Cambiato alimento","Ho sgarrato","Poca fame","Più fame del solito"],
  saltato:["Non avevo tempo","Non avevo fame","Ero fuori casa"],
  allenamento:["Mi sentivo forte","Ero stanco","Fastidio o dolore","Palestra affollata","Allenamento più corto","Nuovo record!"],
  riposo:["Ho camminato","Ho fatto stretching","Riposo totale","Altro sport"]
};
const ENERGIA=[["stanco","Stanco"],["normale","Normale"],["carico","Carico"]];
const SONNO=[["poco","Meno di 6 ore"],["giusto","7–8 ore"],["tanto","Più di 9 ore"]];

/* ---------- calorie della giornata ---------- */
function dayStatus(k){
  const P=window.MyFit&&MyFit.load();if(!P||!window.Dieta)return null;
  const wd=weekday(k),c=MyFit.calc(P),ex=window.Sport?Sport.extraFor(wd,k):{kcal:0,label:""};
  let sel={};try{sel=(JSON.parse(localStorage.getItem(Dieta.SEL_KEY)||"null")||{})[wd]||{}}catch(e){}
  const target=c.kcal+ex.kcal,plan=Dieta.day(wd,P.dieta,sel,target),e=dayEntry(k),pm=e.pasti||{};
  let eaten=0,prot=0,marked=0;
  const meals=plan.meals.map(m=>{const mp=m.items.reduce((a,i)=>a+i.prot,0),s=pm[m.id]||{};let kk=0;
    if(s.s){marked++;kk=s.s==="saltato"?0:(s.k??m.kcal);eaten+=kk;prot+=m.kcal?mp*kk/m.kcal:0}
    return {id:m.id,name:m.name,kcal:m.kcal,prot:mp,items:m.items,state:s.s||"",k:kk}});
  (e.extra||[]).forEach(x=>{eaten+=x.k;prot+=x.p||0});
  const protT=c.prot;
  return {target,base:c.kcal,sport:ex,eaten:Math.round(eaten),left:Math.round(target-eaten),prot:Math.round(prot),protT,meals,marked,all:marked>=meals.length,extra:e.extra||[]};
}
function dayVerdict(st){if(!st||!st.all)return "";const d=st.left;return Math.abs(d)<=st.target*.1?"centrata":d>0?"manca":"sopra"}

/* ---------- allenamenti salvati ---------- */
function workouts(){const s=read(WKEY,{});return (s.hist||[]).map(h=>({...h,k:keyOf(h.date)}))}

/* ---------- punti ---------- */
const LEVELS=[[0,"Principiante"],[400,"Costante"],[1200,"Determinato"],[3000,"Atleta"],[6000,"Campione"],[10000,"Leggenda"]];
function level(p){let i=0;while(i<LEVELS.length-1&&p>=LEVELS[i+1][0])i++;
  const cur=LEVELS[i],nx=LEVELS[i+1];return {n:i+1,name:cur[1],from:cur[0],to:nx?nx[0]:null,next:nx?nx[1]:null,pct:nx?Math.min(100,Math.round((p-cur[0])/(nx[0]-cur[0])*100)):100}}
function mealsPlanned(k,prefs){try{return window.Dieta?Dieta.structure(weekday(k),prefs).length:5}catch(e){return 5}}
function compute(){
  const P=window.MyFit&&MyFit.load(), prefs=(P&&P.dieta)||{}, D=diary(), W=workouts();
  const per={}; const add=(k,pts,why)=>{(per[k]=per[k]||{tot:0,why:[]});per[k].tot+=pts;per[k].why.push([why,pts])};
  const SP=window.Sport?Sport.log():[], spDays=new Set(SP.map(a=>keyOf(a.date))), gymDays=new Set(W.map(w=>w.k));
  const wDays=new Set([...gymDays,...spDays]);
  wDays.forEach(k=>add(k,50,gymDays.has(k)?"Allenamento completato":"Sport praticato"));
  gymDays.forEach(k=>{if(spDays.has(k))add(k,20,"Doppio allenamento")});
  Object.entries(D).forEach(([k,e])=>{
    const ms=Object.values(e.pasti||{});
    const done=ms.filter(m=>m.s==="fatto").length, diff=ms.filter(m=>m.s==="diverso").length;
    const mp=Math.min(50,done*10+diff*5);if(mp)add(k,mp,"Pasti segnati");
    if(done+diff>0&&dayVerdict(dayStatus(k))==="centrata")add(k,20,"Giornata centrata");
    if(e.riposo&&!wDays.has(k))add(k,10,"Riposo rispettato");
    if(e.energia||e.sonno)add(k,5,"Check-in del giorno");
    if((e.acqua||0)>=8)add(k,5,"2 litri d'acqua");
  });
  // pesate: 30 punti, al massimo una ogni 20 giorni
  if(P){let last=-1e15;P.pesi.forEach(p=>{if(p.d-last>=20*DAY){add(keyOf(p.d),30,"Pesata registrata");last=p.d}})}
  // settimana completa
  const S=window.MyFit?MyFit.scheda():{giorni:3}, wk={};
  W.forEach(w=>{const wk_=weekKey(w.k);(wk[wk_]=wk[wk_]||new Set()).add(w.k)});
  Object.entries(wk).forEach(([w,set])=>{if(set.size>=S.giorni){const last=[...set].sort().pop();add(last,100,"Settimana completa")}});
  // serie di giorni attivi (qualsiasi attività registrata); bonus ogni 7 giorni
  const days=Object.keys(per).sort();let run=0,prev=null,best=0;
  days.forEach(k=>{run=prev&&(dateOf(k)-dateOf(prev))<=DAY*1.5?run+1:1;prev=k;best=Math.max(best,run);if(run%7===0)add(k,50,`Serie di ${run} giorni`)});
  let streak=0;{let k=today();if(!per[k])k=keyOf(Date.now()-DAY);while(per[k]){streak++;k=keyOf(dateOf(k).getTime()-DAY)}}
  const total=Object.values(per).reduce((a,x)=>a+x.tot,0);
  const wkNow=weekKey(today()), week=Object.entries(per).filter(([k])=>weekKey(k)===wkNow).reduce((a,[,x])=>a+x.tot,0);
  return {per,total,week,streak,best,level:level(total),workouts:W.length,wDays:wDays.size};
}
/* ---------- record di forza (massimale stimato, formula di Epley) ---------- */
const REC_EX={panca:"Panca piana",squat:"Squat",stacco:"Stacco rumeno",shoulder:"Shoulder press manubri",inclinata:"Panca inclinata manubri",
  pancaman:"Panca piana manubri",lat:"Lat machine",rematore:"Rematore manubrio",curlez:"Curl bilanciere EZ",legpress:"Leg press",hipthrust:"Hip thrust"};
function records(){const R={};
  workouts().forEach(w=>Object.entries(w.sets||{}).forEach(([id,sets])=>{if(!REC_EX[id])return;
    sets.forEach(s=>{const kg=+s.kg,r=+s.reps;if(!(kg>0&&kg<=500&&r>0))return;
      const e1=Math.round(kg*(1+Math.min(r,12)/30)*2)/2;
      const cur=R[id]||{kg:0,e1rm:0,reps:0,d:0};
      if(e1>cur.e1rm)Object.assign(cur,{e1rm:e1,d:w.date});if(kg>cur.kg){cur.kg=kg;cur.reps=r}R[id]=cur})}));
  return R}
/* ---------- medaglie ---------- */
function medals(){const c=compute(),W=workouts(),D=diary(),R=records(),P=window.MyFit&&MyFit.load();
  const homeW=W.filter(w=>Object.keys(w.sets||{}).some(id=>id.startsWith("c_"))).length;
  const mealsLogged=Object.values(D).reduce((a,e)=>a+Object.keys(e.pasti||{}).length,0);
  const perfect=Object.values(c.per).some(x=>x.why.some(([w])=>w==="Settimana completa"));
  return [
    ["Primo passo","Primo allenamento salvato",W.length>=1||(window.Sport&&Sport.log().length>=1)],
    ["Multisport","3 sport diversi registrati",!!(window.Sport&&new Set(Sport.log().map(a=>a.sport)).size>=3)],
    ["50 km di corsa","Somma delle corse registrate",!!(window.Sport&&Sport.log().filter(a=>a.sport==="corsa").reduce((s,a)=>s+(+a.km||0),0)>=50)],
    ["In movimento","10 allenamenti",W.length>=10],
    ["Instancabile","50 allenamenti",W.length>=50],
    ["Settimana perfetta","Tutti gli allenamenti di una settimana",perfect],
    ["Una settimana di fila","7 giorni attivi consecutivi",c.best>=7],
    ["Un mese di fila","30 giorni attivi consecutivi",c.best>=30],
    ["Diario fedele","100 pasti segnati",mealsLogged>=100],
    ["Palestra in salotto","10 allenamenti a casa",homeW>=10],
    ["Più forte","Primo record di forza registrato",Object.keys(R).length>0],
    ["Costanza","Due pesate a distanza di un mese",!!(P&&P.pesi.length>=2&&P.pesi[P.pesi.length-1].d-P.pesi[0].d>=25*DAY)]
  ].map(([n,d,ok])=>({n,d,ok}))}

/* ---------- classifica online (Firebase) ---------- */
function cfg(){const c=window.MYFIT_FIREBASE;return c&&c.apiKey&&c.projectId?c:null}
function settings(){return read(CKEY,{on:false,nick:""})}
function saveSettings(s){write(CKEY,s)}
let fb=null;
function loadScript(src){return new Promise((ok,ko)=>{const s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=()=>ko(new Error("load"));document.head.appendChild(s)})}
async function firebase_(){
  if(fb)return fb;const c=cfg();if(!c)throw new Error("noconfig");
  const v="10.12.2",b=`https://www.gstatic.com/firebasejs/${v}/`;
  if(!window.firebase){await loadScript(b+"firebase-app-compat.js");await loadScript(b+"firebase-auth-compat.js");await loadScript(b+"firebase-firestore-compat.js")}
  if(!firebase.apps.length)firebase.initializeApp(c);
  const auth=firebase.auth();if(!auth.currentUser)await auth.signInAnonymously();
  fb={db:firebase.firestore(),uid:auth.currentUser.uid};return fb;
}
async function sync(){
  const s=settings();if(!s.on||!cfg())return {ok:false,why:"off"};
  try{const {db,uid}=await firebase_(),c=compute(),R=records(),rec={};
    Object.entries(R).forEach(([id,r])=>rec[id]={e1rm:r.e1rm,kg:r.kg,reps:r.reps});
    await db.collection("classifica").doc(uid).set({nick:s.nick.slice(0,20),punti:c.total,puntiSett:c.week,sett:weekKey(today()),
      livello:c.level.n,serie:c.streak,record:rec,agg:Date.now()});
    return {ok:true,uid}}catch(e){return {ok:false,why:e.message}}
}
async function board(){const {db,uid}=await firebase_();const snap=await db.collection("classifica").limit(500).get();
  const rows=[];snap.forEach(d=>rows.push({id:d.id,...d.data()}));return {rows,uid}}
async function leave(){try{const {db,uid}=await firebase_();await db.collection("classifica").doc(uid).delete()}catch(e){}
  const s=settings();s.on=false;saveSettings(s)}
// sincronizzo in automatico all'apertura (al massimo ogni 2 minuti)
function autoSync(){const s=settings();if(!s.on||!cfg())return;const last=+(sessionStorage.getItem("mf-sync")||0);
  if(Date.now()-last<120000)return;try{sessionStorage.setItem("mf-sync",Date.now())}catch(e){}setTimeout(sync,1500)}

window.Punti={dayStatus,dayVerdict,today,keyOf,dateOf,weekday,weekKey,diary,dayEntry,setDay,NOTE,ENERGIA,SONNO,workouts,compute,level,LEVELS,records,REC_EX,medals,
  cfg,settings,saveSettings,sync,board,leave,autoSync};
window.addEventListener("load",autoSync);
})();
