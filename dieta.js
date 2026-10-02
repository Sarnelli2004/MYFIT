/* MyFit · motore della dieta: alimenti, esigenze alimentari, struttura dei pasti in base al questionario */
(function(){
// [nome, kcal/100g, proteine/100g, peso unità, unità, unità plurale, "ml"?, etichette]
// Etichette: G glutine · L lattosio · D latticini · E uova · N frutta a guscio e arachidi · P pesce · M carne · R carne rossa · B legumi · H miele · W proteine in polvere
const F={
  avena:["Fiocchi d'avena",372,13.5,0,"","","","G"], avenagf:["Fiocchi d'avena senza glutine",372,13.5,0,"","",""],
  corn:["Corn flakes",378,7,0,"","","","G"], muesli:["Muesli senza zucchero",360,10,0,"","","","G"],
  fette:["Fette biscottate",410,11,8,"fetta","fette","","G"], fettegf:["Fette biscottate senza glutine",400,5,8,"fetta","fette",""],
  biscotti:["Biscotti secchi",420,7,8,"biscotto","biscotti","","GED"], biscgf:["Biscotti senza glutine",450,5,8,"biscotto","biscotti","","ED"],
  gallette:["Gallette di riso",380,8,8,"galletta","gallette",""],
  pane:["Pane comune",260,8,30,"fetta","fette","","G"], paneint:["Pane integrale",250,9,30,"fetta","fette","","G"],
  panegf:["Pane senza glutine",250,4,30,"fetta","fette",""], piadina:["Piadina",300,8,100,"piadina","piadine","","G"],
  latte:["Latte parz. scremato",46,3.3,0,"","","ml","LD"], lattesl:["Latte senza lattosio",46,3.3,0,"","","ml","D"],
  soia:["Bevanda di soia",40,3.3,0,"","","ml",""],
  greco:["Yogurt greco 0%",57,10,170,"vasetto","vasetti","","LD"], grecosl:["Yogurt greco senza lattosio",60,10,150,"vasetto","vasetti","","D"],
  yogurt:["Yogurt bianco intero",66,3.8,125,"vasetto","vasetti","","LD"], yogsoia:["Yogurt di soia",55,4,125,"vasetto","vasetti",""],
  skyr:["Skyr",63,11,150,"vasetto","vasetti","","LD"], kefir:["Kefir",50,3.5,0,"","","ml","LD"],
  banana:["Banana",89,1.1,120,"banana","banane"], mela:["Mela",52,.3,180,"mela","mele"], pera:["Pera",57,.4,170,"pera","pere"],
  arancia:["Arancia",47,.9,150,"arancia","arance"], kiwi:["Kiwi",61,1.1,75,"kiwi","kiwi"], fragole:["Fragole",32,.7],
  mirtilli:["Mirtilli",57,.7], uva:["Uva",69,.7], spremuta:["Spremuta d'arancia",44,.7,200,"bicchiere","bicchieri","ml"],
  miele:["Miele",304,.3,7,"cucchiaino","cucchiaini","","H"], marmellata:["Marmellata",250,.5,10,"cucchiaino","cucchiaini"],
  cioc:["Cioccolato fondente 70%",600,8,5,"quadratino","quadratini"],
  mandorle:["Mandorle",600,21,0,"","","","N"], noci:["Noci",654,15,5,"gheriglio","gherigli","","N"], anacardi:["Anacardi",553,18,0,"","","","N"],
  nocciole:["Nocciole",628,15,0,"","","","N"], pistacchi:["Pistacchi sgusciati",560,20,0,"","","","N"],
  semi:["Semi di zucca",560,30], arachidi:["Burro d'arachidi",590,25,15,"cucchiaio","cucchiai","","N"],
  cremamand:["Crema di mandorle",610,21,15,"cucchiaio","cucchiai","","N"],
  avocado:["Avocado",160,2], spalm:["Formaggio spalmabile light",150,10,0,"","","","LD"], hummus:["Hummus",250,7,15,"cucchiaio","cucchiai","","B"],
  pasta:["Pasta",355,12,0,"","","","G"], pastaint:["Pasta integrale",340,13,0,"","","","G"], pastagf:["Pasta senza glutine",355,7.5],
  riso:["Riso basmati",350,7.5], risoint:["Riso integrale",360,7.5], farro:["Farro",335,15,0,"","","","G"], cous:["Cous cous",360,12,0,"","","","G"],
  quinoa:["Quinoa",368,14], patate:["Patate",77,2], gnocchi:["Gnocchi di patate",150,4,0,"","","","GE"],
  pollo:["Petto di pollo",110,23,0,"","","","M"], tacchino:["Fesa di tacchino",107,24,0,"","","","M"], manzo:["Manzo magro",120,21,0,"","","","MR"],
  merluzzo:["Merluzzo",80,17,0,"","","","P"], orata:["Orata",120,20,0,"","","","P"], salmone:["Salmone",185,20,0,"","","","P"],
  tonno:["Tonno al naturale",103,24,56,"scatoletta","scatolette","","P"],
  uova:["Uova intere",143,12.5,60,"uovo","uova","","E"], albume:["Albume",52,11,0,"","","ml","E"], bresaola:["Bresaola",151,32,0,"","","","MR"],
  fiocchi:["Fiocchi di latte",98,11,150,"vasetto","vasetti","","LD"], mozzarella:["Mozzarella light",165,20,0,"","","","LD"],
  lenticchie:["Lenticchie secche",325,23,0,"","","","B"], ceci:["Ceci in scatola",120,7,0,"","","","B"], fagioli:["Fagioli in scatola",100,7,0,"","","","B"],
  tofu:["Tofu",120,13], tempeh:["Tempeh",192,20], seitan:["Seitan",120,21,0,"","","","G"],
  cotto:["Prosciutto cotto",136,20,0,"","","","MR"], crudo:["Prosciutto crudo",224,26,0,"","","","MR"], tacchinoaff:["Fesa di tacchino affettata",110,22,0,"","","","M"],
  salmaff:["Salmone affumicato",147,25,0,"","","","P"], ricotta:["Ricotta",146,9,0,"","","","LD"],
  zucchine:["Zucchine",17,1.2], insalata:["Insalata mista",18,1.5], pomodori:["Pomodorini",18,.9], broccoli:["Broccoli",34,2.8],
  spinaci:["Spinaci",23,2.9], carote:["Carote",41,.9], fagiolini:["Fagiolini",31,1.8], peperoni:["Peperoni",26,1],
  olio:["Olio extravergine",899,0,10,"cucchiaio","cucchiai"], parmigiano:["Parmigiano",392,33,10,"cucchiaio","cucchiai","","D"],
  pesto:["Pesto",450,5,15,"cucchiaio","cucchiai","","ND"], passata:["Sugo di pomodoro",45,1.3], pomolio:["Sugo di pomodorini con olio",60,1],
  ragu:["Ragù di carne",150,9,0,"","","","MR"], sugotonno:["Sugo al tonno",130,11,0,"","","","P"], ragveg:["Ragù di lenticchie",110,7,0,"","","","B"],
  whey:["Proteine whey",380,80,30,"misurino","misurini","","LDW"], isolata:["Whey isolata",370,88,30,"misurino","misurini","","DW"],
  veg:["Proteine vegetali",380,75,30,"misurino","misurini","","W"],
  pizza:["Pizza margherita",260,11,330,"pizza","pizze","","GLD"], pizzaprosc:["Pizza prosciutto e funghi",250,12,350,"pizza","pizze","","GLDMR"],
  marinara:["Pizza marinara",230,7,300,"pizza","pizze","","G"], pizzagf:["Pizza senza glutine",250,8,300,"pizza","pizze","","LD"],
  kebab:["Kebab nella piadina",230,12,350,"kebab","kebab","","GMR"], sushi:["Sushi misto",150,6,30,"pezzo","pezzi","","PG"],
  hamburger:["Panino con hamburger",260,13,250,"panino","panini","","GMRLD"], piadfarc:["Piadina farcita",290,12,250,"piadina","piadine","","GMLD"],
  burgerveg:["Panino con burger vegetale",230,10,250,"panino","panini","","G"], pokeveg:["Poke bowl vegetariana",140,6,0,"","",""]
};
const L={
  CARB_C:["pane","paneint","fette","avena","corn","muesli","biscotti","gallette","panegf","fettegf","avenagf","biscgf"],
  LATTE:["latte","soia","greco","yogurt","skyr","kefir","lattesl","grecosl","yogsoia"],
  FRUTTA:["banana","mela","pera","arancia","kiwi","fragole","mirtilli","uva"],
  DOLCE:["marmellata","miele","cioc"],
  SECCA:["mandorle","noci","anacardi","nocciole","pistacchi","arachidi","semi"],
  CARB_P:["pasta","pastaint","riso","risoint","farro","cous","quinoa","gnocchi","patate","pastagf"],
  PROT:["pollo","tacchino","manzo","merluzzo","orata","salmone","tonno","uova","albume","bresaola","fiocchi","mozzarella","lenticchie","ceci","fagioli","tofu","tempeh","seitan"],
  VERD:["zucchine","pomodori","insalata","broccoli","spinaci","carote","fagiolini","peperoni"],
  COND:["olio","ragu","sugotonno","pesto","passata","pomolio","ragveg","parmigiano","avocado"],
  SHAKE:["whey","isolata","veg","greco","skyr","grecosl","yogsoia"],
  PANE:["paneint","pane","gallette","fette","piadina","panegf"],
  SPALM:["arachidi","cremamand","avocado","spalm","hummus"],
  SERA_L:["greco","yogurt","latte","skyr","fiocchi","kefir","grecosl","lattesl","yogsoia","soia"],
  SAL_PANE:["pane","paneint","fette","gallette","piadina","panegf"],
  SAL_P:["uova","cotto","crudo","tacchinoaff","bresaola","salmaff","fiocchi","ricotta","spalm","hummus","tofu","mozzarella"],
  FRUTTA_S:["spremuta","banana","mela","pera","arancia","kiwi","fragole","mirtilli","uva"],
  SAL_C:["olio","avocado","parmigiano","hummus"],
  FUORI:["pizza","pizzaprosc","kebab","sushi","hamburger","piadfarc","marinara","pizzagf","burgerveg","pokeveg"],
  SERA_X:["biscotti","noci","mandorle","cioc","miele","fette","banana","mela","biscgf","semi","fettegf"]
};
// sostituti preferiti quando un alimento non va bene
const SUB={pasta:["pastagf","riso"],pastaint:["pastagf","risoint"],pane:["panegf","gallette"],paneint:["panegf","gallette"],fette:["fettegf","gallette"],
  avena:["avenagf"],corn:["avenagf","gallette"],muesli:["avenagf"],biscotti:["biscgf","fettegf","gallette"],piadina:["panegf","gallette"],farro:["quinoa","riso"],cous:["quinoa","riso"],gnocchi:["patate"],
  latte:["lattesl","soia"],kefir:["lattesl","soia"],greco:["grecosl","yogsoia"],yogurt:["grecosl","yogsoia"],skyr:["grecosl","yogsoia"],fiocchi:["tofu","uova"],spalm:["hummus","avocado"],
  whey:["isolata","veg"],isolata:["veg"],miele:["marmellata"],uova:["tofu","tempeh"],cotto:["hummus","tofu"],crudo:["hummus","tofu"],tacchinoaff:["hummus","tofu"],bresaola:["tofu","hummus"],salmaff:["tofu","hummus"],
  pizza:["pizzagf","marinara","pokeveg"],ragu:["ragveg","passata"],sugotonno:["passata","pomolio"],pesto:["pomolio","passata"],
  mandorle:["semi"],noci:["semi"],anacardi:["semi"],nocciole:["semi"],pistacchi:["semi"],arachidi:["avocado","hummus"],cremamand:["avocado","hummus"]};

const DEF_PREFS={esig:[],colazione:"alterno",pasti:5,sera:"si",carbo:"pasta",noPiace:[],polvere:"si",libero:"ven"};
const ESIG_TAGS={vegetariano:"MP",vegano:"MPDEH",celiaco:"G",lattosio:"L",guscio:"N",pesce:"P",uova:"E"};
const NOPIACE_TAGS={pesce:"P",carnerossa:"R",legumi:"B",uova:"E",latticini:"D"};
function banned(prefs){let t="";(prefs.esig||[]).forEach(e=>t+=ESIG_TAGS[e]||"");(prefs.noPiace||[]).forEach(e=>t+=NOPIACE_TAGS[e]||"");if(prefs.polvere==="no")t+="W";return t}
function allowed(id,prefs,ban){ban=ban??banned(prefs);const tags=F[id][7]||"";for(const c of tags)if(ban.includes(c))return false;return true}

// menu tipo della settimana (scelte preferite, poi adattate alle esigenze)
const WEEK=[
 {colazione:["pane","latte","banana","marmellata"],salata:["pane","cotto","arancia","olio"],spuntino:["mela","mandorle"],pranzo:["pasta","pollo","zucchine","olio"],merenda:["whey","paneint","arachidi"],cena:["merluzzo","patate","pane","pomodori","olio"],sera:["greco","biscotti"]},
 {colazione:["fette","greco","kiwi","miele"],salata:["fette","tacchinoaff","kiwi","avocado"],spuntino:["pera","noci"],pranzo:["pasta","tonno","pomodori","passata"],merenda:["whey","gallette","cremamand"],cena:["tacchino","riso","pane","zucchine","olio"],sera:["latte","biscotti"]},
 {colazione:["corn","yogurt","fragole","miele"],salata:["paneint","uova","spremuta","olio"],spuntino:["banana","anacardi"],pranzo:["pasta","uova","zucchine","parmigiano"],merenda:["whey","paneint","spalm"],cena:["salmone","patate","pane","insalata","olio"],sera:["greco","noci"]},
 {colazione:["pane","latte","banana","marmellata"],salata:["pane","fiocchi","mela","olio"],spuntino:["arancia","nocciole"],pranzo:["pasta","pollo","pomodori","pesto"],merenda:["whey","fette","arachidi"],cena:["manzo","patate","pane","insalata","olio"],sera:["skyr","cioc"]},
 {colazione:["fette","greco","mirtilli","miele"],salata:["gallette","bresaola","mirtilli","avocado"],spuntino:["mela","pistacchi"],pranzo:["pasta","pollo","pomodori","pomolio"],merenda:["whey","gallette","arachidi"],cena:["lenticchie","riso","pane","zucchine","olio"],sera:["greco","biscotti"]},
 {colazione:["biscotti","latte","mela","marmellata"],salata:["pane","crudo","kiwi","olio"],spuntino:["uva","mandorle"],pranzo:["pasta","manzo","insalata","ragu"],merenda:["whey","piadina","avocado"],cena:["orata","patate","pane","pomodori","olio"],sera:["latte","biscotti"]},
 {colazione:["paneint","yogurt","kiwi","cioc"],salata:["paneint","salmaff","arancia","avocado"],spuntino:["kiwi","noci"],pranzo:["pasta","bresaola","zucchine","sugotonno"],merenda:["whey","paneint","cremamand"],cena:["uova","patate","pane","zucchine","olio"],sera:["greco","miele"]}
];
const CARB_ROT={pasta:["pasta","pasta","pasta","pasta","pasta","pasta","pasta"],riso:["riso","risoint","quinoa","riso","risoint","riso","quinoa"],
  varia:["pasta","riso","pasta","farro","gnocchi","pasta","cous"]};
const SALTY_DAYS=[2,5,6];
const FREE={ven:[4,"cena"],sab:[5,"cena"],dom:[6,"pranzo"]};

// struttura dei pasti di un giorno: [{id, name, note, slots:[{cat,kcal,list}]}]
function structure(d,prefs,style){
  prefs=Object.assign({},DEF_PREFS,prefs||{});
  const ban=banned(prefs), ok=id=>allowed(id,prefs,ban);
  const free=FREE[prefs.libero]&&FREE[prefs.libero][0]===d?FREE[prefs.libero][1]:null;
  const S=(cat,kcal,list)=>({cat,kcal,list:L[list].filter(ok)});
  const M=[];
  if(prefs.colazione!=="no"){
    const st=style||(prefs.colazione==="alterno"?(SALTY_DAYS.includes(d)?"salata":"dolce"):prefs.colazione);
    M.push(st==="salata"?{id:"salata",name:"Colazione",style:"salata",slots:[S("Pane",250,"SAL_PANE"),S("Salato",140,"SAL_P"),S("Frutta o spremuta",105,"FRUTTA_S"),S("Condimento",45,"SAL_C")]}
      :{id:"colazione",name:"Colazione",style:"dolce",slots:[S("Pane o cereali",250,"CARB_C"),S("Latte o yogurt",140,"LATTE"),S("Frutta",105,"FRUTTA"),S("Marmellata o dolce",45,"DOLCE")]});
  }
  if(+prefs.pasti>=5)M.push({id:"spuntino",name:"Spuntino",slots:[S("Frutta",80,"FRUTTA"),S("Frutta secca o semi",160,"SECCA")]});
  if(free==="pranzo")M.push({id:"libero",name:"Pranzo fuori",note:"Scegli una cosa e goditi il pranzo, senza pesare niente.",slots:[S("Pasto libero",900,"FUORI")]});
  else M.push({id:"pranzo",name:"Pranzo",note:free==="cena"?"Un po' più leggero per lasciare spazio alla serata.":"",slots:[S("Pasta o cereali",free==="cena"?330:430,"CARB_P"),S("Proteine",110,"PROT"),S("Verdure",50,"VERD"),S("Condimento",free==="cena"?110:135,"COND")]});
  if(+prefs.pasti>=4)M.push({id:"merenda",name:"Merenda",slots:[S(prefs.polvere==="no"?"Yogurt proteico":"Frullato proteico",120,"SHAKE"),S("Pane o simili",free?100:120,"PANE"),S("Da spalmare",free?80:90,"SPALM")]});
  if(free==="cena")M.push({id:"libero",name:"Cena fuori",note:"Scegli una cosa e goditi la serata, senza pesare niente. Una birra media vale circa 215 kcal, un cocktail circa 200.",slots:[S("Pasto libero",900,"FUORI")]});
  else M.push({id:"cena",name:"Cena",note:free==="pranzo"?"Più leggera dopo il pranzo libero.":"",slots:[S("Proteine",110,"PROT"),S("Carboidrati",free==="pranzo"?150:230,"CARB_P"),S("Pane",50,"PANE"),S("Verdure",50,"VERD"),S("Condimento",free==="pranzo"?90:120,"COND")]});
  if(prefs.sera!=="no"&&free!=="cena")M.push({id:"sera",name:"Prima di dormire",note:prefs.sera==="volte"?"Facoltativo: se non hai fame, sposta queste calorie sulla cena.":"",slots:[S("Yogurt o latte",prefs.sera==="volte"?90:120,"SERA_L"),S("Extra",prefs.sera==="volte"?60:80,"SERA_X")]});
  // tolgo le porzioni rimaste senza alimenti e riporto il totale a 2.600 (base)
  M.forEach(m=>m.slots=m.slots.filter(s=>s.list.length));
  // verdure e pasto libero restano fissi, il resto si adatta
  const fixed=s=>s.cat==="Verdure"||s.cat==="Pasto libero";
  let fx=0,sc=0;M.forEach(m=>m.slots.forEach(s=>fixed(s)?fx+=s.kcal:sc+=s.kcal));
  const f=(2600-fx)/sc;M.forEach(m=>m.slots.forEach(s=>{if(!fixed(s))s.kcal=Math.round(s.kcal*f)}));
  return M;
}
// scelta predefinita per una porzione
function pick(d,meal,j,slot,prefs){
  const ban=banned(Object.assign({},DEF_PREFS,prefs||{}));
  let want=meal.id==="libero"?"pizza":(WEEK[d][meal.id]||[])[j];
  if(meal.id==="pranzo"&&j===0)want=(CARB_ROT[(prefs||{}).carbo]||CARB_ROT.pasta)[d];
  if(meal.id==="cena"&&j===1&&(prefs||{}).carbo==="riso"&&want==="patate"&&d%2)want="riso";
  const okIn=id=>id&&slot.list.includes(id)&&allowed(id,null,ban);
  if(okIn(want))return want;
  for(const s of (SUB[want]||[]))if(okIn(s))return s;
  return slot.list[(d+j)%slot.list.length];
}
function portion(id,kcal){
  const f=F[id];const [name,k,p,u,s,pl,unit]=f;
  let g=kcal/k*100; g=g<20?Math.max(1,Math.round(g)):Math.round(g/5)*5;
  const realK=Math.round(g*k/100), prot=Math.round(g*p/10)/10;
  let count="";if(u){const c=Math.round(g/u*2)/2;if(c>=0.5)count="≈ "+String(c).replace(".",",")+" "+(c<=1?s:pl)}
  return {id,name,g,unit:unit||"g",kcal:realK,prot,count};
}
// giorno completo con le scelte (salvate o predefinite) e le porzioni già calcolate
function day(d,prefs,selDay,target){
  selDay=selDay||{};const K=(target||2600)/2600;
  const meals=structure(d,prefs,selDay.style);
  let tot=0,prot=0;
  const out=meals.map(m=>{let mk=0,mt=0;
    const items=m.slots.map((s,j)=>{const key=m.id+"-"+j;let id=selDay[key];
      if(!id||!s.list.includes(id))id=pick(d,m,j,s,prefs);
      const kc=Math.round(s.kcal*K), p=portion(id,kc);mk+=p.kcal;mt+=kc;prot+=p.prot;return {key,cat:s.cat,list:s.list,kcal:kc,...p}});
    tot+=mk;return {...m,items,kcal:mk,target:mt}});
  return {meals:out,kcal:tot,prot:Math.round(prot)};
}
function dayTitle(plan){
  const by=id=>plan.meals.find(m=>m.id===id);
  const pr=by("pranzo"),ce=by("cena"),lib=by("libero");
  const short=n=>n.replace(/ (parz\. scremato|al naturale|di patate|basmati|magro|extravergine|in scatola|secche|intere|senza glutine)/g,"").toLowerCase();
  const a=pr?`${pr.items[0].name.split(" ")[0]} con ${short(pr.items[1]?pr.items[1].name:"verdure")}`:"Pranzo fuori";
  const b=ce?`${short(ce.items[0].name)} e ${short(ce.items[1]?ce.items[1].name:"verdure")}`:"cena fuori con gli amici";
  return a+" · "+b;
}
const LABELS={
  esig:{vegetariano:"Vegetariano",vegano:"Vegano",celiaco:"Senza glutine",lattosio:"Senza lattosio",guscio:"No frutta a guscio",pesce:"No pesce e crostacei",uova:"No uova"},
  colazione:{dolce:"Colazione dolce",salata:"Colazione salata",alterno:"Colazione dolce e salata",no:"Niente colazione"},
  pasti:{3:"3 pasti",4:"4 pasti",5:"5 pasti"},
  sera:{si:"Spuntino serale",volte:"Spuntino serale a volte",no:"Niente spuntino serale"},
  carbo:{pasta:"Pasta",riso:"Riso e cereali",varia:"Carboidrati vari"},
  noPiace:{pesce:"Niente pesce",carnerossa:"Niente carne rossa",legumi:"Niente legumi",uova:"Niente uova",latticini:"Niente latticini"},
  polvere:{si:"Proteine in polvere",no:"Senza proteine in polvere"},
  libero:{no:"Nessun pasto libero",ven:"Libero venerdì sera",sab:"Libero sabato sera",dom:"Libero domenica a pranzo"}
};
function prefChips(prefs){prefs=Object.assign({},DEF_PREFS,prefs||{});const c=[];
  (prefs.esig||[]).forEach(e=>c.push(LABELS.esig[e]));c.push(LABELS.colazione[prefs.colazione],LABELS.pasti[prefs.pasti],LABELS.sera[prefs.sera],LABELS.carbo[prefs.carbo]);
  (prefs.noPiace||[]).forEach(e=>c.push(LABELS.noPiace[e]));c.push(LABELS.polvere[prefs.polvere],LABELS.libero[prefs.libero]);return c.filter(Boolean)}
window.Dieta={F,L,structure,pick,portion,day,dayTitle,allowed,banned,prefChips,DEF_PREFS,LABELS,SEL_KEY:"myfit-dieta-scelte"};
})();
