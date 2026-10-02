/* MyFit · animazioni: traguardi, coriandoli, avvisi incoraggianti, numeri che contano */
(function(){
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const css=`
.mfa-ov{position:fixed;inset:0;z-index:60;display:grid;place-items:center;padding:20px;background:rgba(14,20,16,.5);opacity:0;transition:opacity .25s}
.mfa-ov.show{opacity:1}
.mfa-pop{width:100%;max-width:360px;background:var(--surface);color:var(--ink);border-radius:24px;padding:24px 20px 20px;display:grid;justify-items:center;gap:8px;text-align:center;transform:scale(.8) translateY(20px);opacity:0}
.mfa-ov.show .mfa-pop{animation:mfaPop .5s cubic-bezier(.2,1.4,.4,1) forwards}
.mfa-pop h3{font:800 1.4rem var(--f-display,system-ui);margin:0;text-wrap:balance}
.mfa-pop p{margin:0;color:var(--muted);font-size:.92rem}
.mfa-pop .mfa-pts{font:800 1.35rem var(--f-display,system-ui);color:#b88a1b}
.mfa-pop button{margin-top:8px;border:0;background:var(--accent);color:var(--bg);font:600 1rem inherit;border-radius:12px;padding:12px 26px;cursor:pointer}
.mfa-em{width:100px;height:100px;display:grid;place-items:center}
@keyframes mfaPop{to{transform:none;opacity:1}}
.mfa-ring{stroke-dasharray:283;stroke-dashoffset:283;animation:mfaRing 1s ease .25s forwards}
.mfa-tick{stroke-dasharray:60;stroke-dashoffset:60;animation:mfaRing .45s ease 1s forwards}
@keyframes mfaRing{to{stroke-dashoffset:0}}
.mfa-medal{animation:mfaMedal 1s cubic-bezier(.2,1.2,.3,1) .1s both}
@keyframes mfaMedal{0%{transform:rotateY(540deg) scale(.3)}100%{transform:none}}
.mfa-bump{animation:mfaBump .9s cubic-bezier(.3,1.6,.5,1) .1s both}
@keyframes mfaBump{0%{transform:translateY(30px) scale(.5);opacity:0}60%{transform:translateY(-8px) scale(1.08);opacity:1}100%{transform:none}}
.mfa-fire{animation:mfaFire 1s ease-in-out infinite;transform-origin:50% 90%}
@keyframes mfaFire{0%,100%{transform:scale(1) rotate(-2deg)}50%{transform:scale(1.08,1.14) rotate(2deg)}}
.mfa-conf{position:fixed;inset:0;width:100%;height:100%;z-index:61;pointer-events:none}
.mfa-float{position:fixed;z-index:62;font:800 1.15rem var(--f-display,system-ui);pointer-events:none;animation:mfaFloat 1.3s ease-out forwards}
@keyframes mfaFloat{0%{opacity:0;transform:translateY(8px) scale(.8)}20%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-56px)}}
.mfa-ban{position:fixed;left:12px;right:12px;bottom:calc(84px + env(safe-area-inset-bottom,0px));max-width:536px;margin:0 auto;z-index:55;background:var(--surface);color:var(--ink);border:1px solid var(--line);border-radius:16px;padding:12px;display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;box-shadow:0 12px 30px rgba(0,0,0,.18);transform:translateY(160%);transition:transform .45s cubic-bezier(.2,1.2,.4,1)}
.mfa-ban.show{transform:none}
.mfa-ban b{display:block;font-size:.92rem}
.mfa-ban span{font-size:.82rem;color:var(--muted)}
.mfa-ban .bi{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;font-size:1.3rem}
.mfa-ban .bx{border:0;background:none;color:var(--muted);font-size:1.1rem;cursor:pointer;padding:4px}
.mfa-bell{display:inline-block;animation:mfaBell 1s ease;transform-origin:50% 10%}
@keyframes mfaBell{0%,100%{transform:none}15%{transform:rotate(16deg)}30%{transform:rotate(-14deg)}45%{transform:rotate(10deg)}60%{transform:rotate(-6deg)}}
.mfa-nudge{animation:mfaNudge .5s ease}
@keyframes mfaNudge{0%,100%{transform:none}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(2px)}}
.mfa-rise{opacity:0;animation:mfaRise .55s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes mfaRise{from{opacity:0;transform:translateY(18px) scale(.98)}to{opacity:1;transform:none}}
.mfa-splash{position:fixed;inset:0;z-index:70;background:#2f6b4f;display:grid;place-items:center;pointer-events:none;animation:mfaSplash 1.2s ease forwards}
.mfa-splash svg{width:130px;height:130px;animation:mfaLift 1.2s ease forwards}
.mfa-splash .wm{position:absolute;top:58%;font:800 1.6rem var(--f-display,system-ui);color:#f1f3ee;animation:mfaWm 1.2s ease forwards;opacity:0}
@keyframes mfaSplash{0%,62%{clip-path:circle(150% at 50% 50%)}100%{clip-path:circle(0% at 50% 6%)}}
@keyframes mfaLift{0%{transform:scale(.6) rotate(-8deg);opacity:0}25%{transform:scale(1.08) rotate(2deg);opacity:1}40%,62%{transform:none}100%{transform:scale(.4) translateY(-40%);opacity:0}}
@keyframes mfaWm{0%,20%{opacity:0;transform:translateY(8px)}38%,62%{opacity:1;transform:none}80%,100%{opacity:0}}
@media (prefers-reduced-motion:reduce){.mfa-ov *,.mfa-ban,.mfa-rise,.mfa-float{animation-duration:.01ms!important;animation-delay:0ms!important;transition-duration:.01ms!important}.mfa-rise{opacity:1}}
`;
const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
const fmt=n=>Math.round(n).toLocaleString("it-IT");
function countUp(el,from,to,ms=800,suf=""){if(!el)return;if(reduce){el.textContent=fmt(to)+suf;return}const t0=performance.now();
  const step=t=>{const k=Math.min(1,(t-t0)/ms),e=1-Math.pow(1-k,3);el.textContent=fmt(from+(to-from)*e)+suf;if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)}
function confetti(n=110){if(reduce)return;const c=document.createElement("canvas");c.className="mfa-conf";document.body.appendChild(c);
  const W=innerWidth,H=innerHeight,dpr=devicePixelRatio||1;c.width=W*dpr;c.height=H*dpr;const x=c.getContext("2d");x.scale(dpr,dpr);
  const cs=getComputedStyle(document.documentElement),cols=[cs.getPropertyValue("--accent").trim()||"#2f6b4f","#b88a1b","#d27a2c","#6b7fa0"];
  const P=Array.from({length:n},()=>({x:W/2,y:H*.38,vx:(Math.random()-.5)*10,vy:-Math.random()*10-3,w:4+Math.random()*5,h:6+Math.random()*6,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:cols[Math.floor(Math.random()*cols.length)]}));
  const t0=performance.now();(function f(t){const k=(t-t0)/1000;x.clearRect(0,0,W,H);
    P.forEach(p=>{p.vy+=.22;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.globalAlpha=Math.max(0,1-k/2.6);x.fillStyle=p.c;x.fillRect(-p.w/2,-p.h/2,p.w,p.h);x.restore()});
    if(k<2.6)requestAnimationFrame(f);else c.remove()})(t0)}
function floatAt(el,txt,color){if(!el)return;const r=el.getBoundingClientRect(),f=document.createElement("div");f.className="mfa-float";f.textContent=txt;f.style.color=color||"#b88a1b";
  f.style.left=(r.left+r.width/2-20)+"px";f.style.top=(r.top-8)+"px";document.body.appendChild(f);setTimeout(()=>f.remove(),1400)}
// coda dei traguardi: uno alla volta
const queue=[];let open=false;
function celebrate(o){queue.push(o);if(!open)next()}
function next(){const o=queue.shift();if(!o){open=false;return}open=true;
  const ov=document.createElement("div");ov.className="mfa-ov";ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");
  ov.innerHTML=`<div class="mfa-pop"><div class="mfa-em">${o.iconHtml||ICON[o.icon]||ICON.check}</div><h3>${o.title}</h3>${o.text?`<p>${o.text}</p>`:""}${o.pts?`<p class="mfa-pts">${o.pts}</p>`:""}<button type="button">${o.btn||"Grande!"}</button></div>`;
  document.body.appendChild(ov);requestAnimationFrame(()=>ov.classList.add("show"));if(o.confetti)setTimeout(()=>confetti(),250);
  const btn=ov.querySelector("button");setTimeout(()=>btn.focus({preventScroll:true}),350);
  const close=()=>{ov.classList.remove("show");setTimeout(()=>{ov.remove();next()},250)};
  btn.addEventListener("click",close);ov.addEventListener("click",e=>{if(e.target===ov)close()});ov.addEventListener("keydown",e=>{if(e.key==="Escape")close()})}
let bt;
function banner(ico,bg,title,sub,bell){let b=document.querySelector(".mfa-ban");if(!b){b=document.createElement("div");b.className="mfa-ban";b.setAttribute("role","status");document.body.appendChild(b)}
  b.innerHTML=`<div class="bi" style="background:${bg}">${bell?`<span class="mfa-bell">${ico}</span>`:ico}</div><div><b>${title}</b><span>${sub}</span></div><button class="bx" type="button" aria-label="Chiudi">✕</button>`;
  b.querySelector(".bx").onclick=()=>b.classList.remove("show");requestAnimationFrame(()=>b.classList.add("show"));clearTimeout(bt);bt=setTimeout(()=>b.classList.remove("show"),5200)}
function nudge(el){if(!el)return;el.classList.remove("mfa-nudge");void el.offsetWidth;el.classList.add("mfa-nudge")}
function stagger(els,delay=0){if(reduce)return;els.forEach((el,i)=>{el.classList.add("mfa-rise");el.style.animationDelay=(delay+i*90)+"ms"})}
function splash(){if(reduce)return 0;const s=document.createElement("div");s.className="mfa-splash";
  s.innerHTML=`<svg viewBox="0 0 100 100"><rect x="18" y="47" width="64" height="6" rx="3" fill="#f1f3ee"/><rect x="22" y="34" width="8" height="32" rx="2.5" fill="#e08a3e"/><rect x="31" y="39" width="6" height="22" rx="2" fill="#f1f3ee"/><rect x="63" y="39" width="6" height="22" rx="2" fill="#f1f3ee"/><rect x="70" y="34" width="8" height="32" rx="2.5" fill="#e08a3e"/></svg><div class="wm">MyFit</div>`;
  document.body.appendChild(s);setTimeout(()=>s.remove(),1250);return 1050}
const G="var(--accent)",GOLD="#b88a1b";
const ICON={
  check:`<svg viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="45" fill="none" stroke="var(--line)" stroke-width="7"/><circle class="mfa-ring" cx="50" cy="50" r="45" fill="none" stroke="${G}" stroke-width="7" stroke-linecap="round" transform="rotate(-90 50 50)"/><path class="mfa-tick" d="M31 52l13 13 26-28" fill="none" stroke="${G}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  record:`<svg class="mfa-bump" viewBox="0 0 100 100" width="100" height="100"><rect x="14" y="46" width="72" height="8" rx="4" fill="var(--ink)"/><rect x="18" y="28" width="11" height="44" rx="3" fill="${GOLD}"/><rect x="30" y="35" width="8" height="30" rx="3" fill="var(--ink)"/><rect x="62" y="35" width="8" height="30" rx="3" fill="var(--ink)"/><rect x="71" y="28" width="11" height="44" rx="3" fill="${GOLD}"/></svg>`,
  medal:`<svg class="mfa-medal" viewBox="0 0 100 100" width="100" height="100"><path d="M34 6h12l8 22H42zM66 6H54l-8 22h12z" fill="${G}"/><circle cx="50" cy="60" r="30" fill="${GOLD}"/><circle cx="50" cy="60" r="22" fill="none" stroke="#f6ecd2" stroke-width="3"/><path d="M50 46l4.3 8.8 9.7 1.4-7 6.8 1.7 9.6L50 68l-8.7 4.6 1.7-9.6-7-6.8 9.7-1.4z" fill="#f6ecd2"/></svg>`,
  fire:`<svg viewBox="0 0 24 24" width="100" height="100"><g class="mfa-fire"><path d="M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-3 1.5-4.5 2.5-6 .3 2 1.2 3 2.2 3C11 7.5 11 5 12 2z" fill="#d27a2c"/><path d="M12 9c.9 2.2 3 3 3 5.6a3 3 0 0 1-6 0c0-1.8 1.4-3 3-5.6z" fill="${GOLD}"/></g></svg>`,
  target:`<svg class="mfa-bump" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="42" fill="none" stroke="${GOLD}" stroke-width="9"/><circle cx="50" cy="50" r="26" fill="none" stroke="${G}" stroke-width="9"/><circle cx="50" cy="50" r="9" fill="#d27a2c"/></svg>`,
  sport:`<svg class="mfa-bump" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="40" fill="none" stroke="${G}" stroke-width="8"/><path d="M50 22l12 9-4 14H42l-4-14zM38 45l-14 6M62 45l14 6M42 45l-6 22M58 45l6 22" fill="none" stroke="${G}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
  level:n=>`<div class="mfa-bump" style="width:84px;height:84px;border-radius:22px;background:${GOLD};color:#fff;display:grid;place-items:center;font:800 2.7rem var(--f-display,system-ui)">${n}</div>`
};
/* traguardi automatici: confronta con ciò che è già stato festeggiato */
const SEEN="myfit-festeggiati";
function checkMilestones(){if(!window.Punti)return;
  let s;try{s=JSON.parse(localStorage.getItem(SEEN)||"null")}catch(e){}
  const c=Punti.compute(),M=Punti.medals().filter(m=>m.ok).map(m=>m.n),cur={lv:c.level.n,medals:M,best:c.best};
  if(!s){try{localStorage.setItem(SEEN,JSON.stringify(cur))}catch(e){}return} // prima volta: niente feste arretrate
  if(c.level.n>s.lv)celebrate({iconHtml:ICON.level(c.level.n),title:`Sei diventato ${c.level.name}!`,text:`Livello ${c.level.n}${c.level.next?` · il prossimo è ${c.level.next} a ${fmt(c.level.to)} punti`:""}`,confetti:true});
  M.filter(m=>!(s.medals||[]).includes(m)).forEach(m=>{const d=Punti.medals().find(x=>x.n===m);celebrate({icon:"medal",title:"Medaglia sbloccata",text:`<b>${m}</b><br>${d?d.d:""}`,confetti:true})});
  const ms=[7,14,30,60,100].filter(x=>c.streak>=x&&(s.best||0)<x).pop();
  if(ms)celebrate({icon:"fire",title:`${ms} giorni di fila!`,text:ms===7?"Una settimana intera senza fermarti: +50 punti bonus":"Costanza da campione: continua così"});
  try{localStorage.setItem(SEEN,JSON.stringify({lv:Math.max(c.level.n,s.lv),medals:[...new Set([...(s.medals||[]),...M])],best:Math.max(c.best,s.best||0,c.streak)}))}catch(e){}
}
window.MFA={countUp,confetti,floatAt,celebrate,banner,nudge,stagger,splash,checkMilestones,reduce,ICON};
})();
