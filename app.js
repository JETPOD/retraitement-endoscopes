(function(){
"use strict";
const M = window.MISSIONS, S = window.SOURCES;
const $main = document.getElementById("main");
const PTS = { sur:10, trace:5, exces:4, risque:0 };
const CAT = {
  sur:{ label:"Décision sûre" },
  risque:{ label:"Risque infectieux" },
  exces:{ label:"Mesure excessive" },
  trace:{ label:"Écart de traçabilité ou d'organisation" },
  partiel:{ label:"Réponse partielle" }
};
const PROFILES = {
  terrain:{ label:"IDE et agents de désinfection", missions:[1,2,3,4,5,6] },
  eoh:{ label:"Cadres, EOH et CLIN", missions:[4,5,6,7] },
  complet:{ label:"Parcours complet", missions:[1,2,3,4,5,6,7] }
};

/* ---------- état ---------- */
let state = load() || { profile:null, results:{} };
let cur = null; // {mi, si, answered, data}
/* État en mémoire uniquement : la partie repart de zéro au rechargement. */
function save(){}
function load(){ return null; }
/* Mesure d'audience Plausible : schéma fermé, sans score ni réponse ni identifiant.
   Active uniquement sur jetpod.github.io/retraitement-endoscopes/. */
const TRACK_ON = location.hostname==="jetpod.github.io" && location.pathname.startsWith("/retraitement-endoscopes/");
const TRACK_OK = /^(Attestation · (Participation|Réussite|Excellence)|Endoscopes · (Jeu démarré|Rapport consulté|Profil (terrain|eoh|complet)|Mission [1-7] (démarrée|terminée)))$/;
function track(name){
  const full="Endoscopes · "+name;
  if(!TRACK_ON || !TRACK_OK.test(full)) return;
  try{ if(typeof window.plausible==="function") window.plausible(full); }catch(e){}
}
if(TRACK_ON){
  window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)};
  window.plausible.init=window.plausible.init||function(i){window.plausible.o=i||{}};
  window.plausible.init({outboundLinks:false,fileDownloads:false,formSubmissions:false,transformRequest(p){
    if(!/^(pageview|engagement)$/.test(p.n) && !TRACK_OK.test(p.n)) return null;
    p.u=location.origin+location.pathname; p.r=null; delete p.p; delete p.$; return p; }});
  const s=document.createElement("script"); s.async=true; s.src="https://plausible.io/js/pa-tStNr5ifi5Ciowo1JXWCY.js"; document.head.appendChild(s);
}

const esc = s => String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; };
const refLink = k => S[k] ? `<a class="ref" href="${S[k].url}" target="_blank" rel="noopener">Référence : ${esc(S[k].label)}</a>` : "";
const badge = c => `<span class="badge b-${c}">${CAT[c].label}</span>`;

function totals(){
  let pts=0,max=0,c={risque:0,exces:0,trace:0,sur:0};
  M.forEach(m=>{ const r=state.results[m.id]; if(!r) return; r.steps.forEach(s=>{ if(!s) return; pts+=s.pts; max+=10; if(c[s.cat]!==undefined) c[s.cat]++; }); });
  return { pts, max, pct: max? Math.round(100*pts/max):0, c };
}
function missionDone(m){ const r=state.results[m.id]; return r && r.done; }
function recommended(){ return state.profile ? PROFILES[state.profile].missions : []; }

function setNav(v){ document.querySelectorAll(".topnav button").forEach(b=>b.classList.toggle("on", b.dataset.view===v)); }
function go(view, arg){
  window.scrollTo({top:0, behavior:"instant" in window ? "instant":"auto"});
  setNav(view);
  ({home:viewHome, mission:startMission, report:viewReport, memo:viewMemo, sources:viewSources})[view](arg);
  $main.focus && $main.setAttribute("tabindex","-1");
}
document.querySelectorAll(".topnav button").forEach(b=>b.addEventListener("click",()=>go(b.dataset.view)));
document.getElementById("homeBtn").addEventListener("click",()=>go("home"));

/* ---------- accueil ---------- */
function circuitHTML(){
  const rec = recommended();
  return `<ol class="circuit">${M.map(m=>{
    const cls = [missionDone(m)?"done":"", rec.length && rec.includes(m.num)?"rec":"", rec.length && !rec.includes(m.num)?"dim":""].join(" ");
    const r = state.results[m.id];
    const sub = missionDone(m) ? `Terminée · ${r.steps.reduce((a,s)=>a+s.pts,0)}/${m.steps.length*10}` : `${m.steps.length} décisions`;
    return `<li class="station ${cls}"><button data-m="${m.num}" aria-label="Mission ${m.num} : ${esc(m.titre)}">
      <span class="n">${missionDone(m)?"✓":m.num}</span><span class="t">${esc(m.titre)}</span><span class="s">${sub}</span></button></li>`;
  }).join("")}</ol>`;
}
function viewHome(){
  const t = totals(); const anyDone = M.some(missionDone);
  $main.innerHTML = `
  <section class="hero">
    <div>
      <p class="eyebrow">Serious game · Hygiène hospitalière</p>
      <h1>Une journée en salle de désinfection des endoscopes</h1>
      <p class="lead">Suivez un endoscope souple de la fin de l'examen jusqu'au résultat du prélèvement. Pré-traitement, test d'étanchéité, LDE en panne, stockage, contrôles non conformes : à chaque étape, une décision et son débriefing sourcé.</p>
      <ul class="facts"><li>7 missions</li><li>${M.reduce((a,m)=>a+m.steps.length,0)} décisions</li><li>20 à 40 minutes</li><li>Rapport imprimable</li></ul>
    </div>
    <div class="hero-art" aria-hidden="true">${heroSVG()}</div>
  </section>

  <section class="section">
    <h2>1. Choisissez votre parcours</h2>
    <div class="profiles">
      ${Object.entries(PROFILES).map(([k,p])=>`<button class="profile" data-p="${k}" aria-pressed="${state.profile===k}" style="${state.profile===k?"border-color:var(--primary);box-shadow:var(--shadow)":""}">
        <span class="tag">${k==="complet"?"7 missions":p.missions.length+" missions recommandées"}</span>
        <h3>${p.label}</h3>
        <p>${k==="terrain"?"Gestes du circuit : pré-traitement, étanchéité, nettoyage, LDE, panne, stockage.":k==="eoh"?"Pilotage : LDE, panne, stockage, interprétation des prélèvements et gestion de crise.":"L'ensemble du circuit, du chariot d'examen à la cellule de crise."}</p>
      </button>`).join("")}
    </div>
  </section>

  <section class="section">
    <h2>2. Parcourez le circuit</h2>
    ${circuitHTML()}
    <div class="legend"><span><i class="dot d-sur"></i> Décision sûre</span><span><i class="dot d-risque"></i> Risque infectieux</span><span><i class="dot d-exces"></i> Mesure excessive</span><span><i class="dot d-trace"></i> Écart de traçabilité</span></div>
  </section>

  <div class="cta-row">
    <button class="btn" id="startBtn">${anyDone?"Reprendre":"Commencer"} le parcours</button>
    ${anyDone?`<button class="btn ghost" id="repBtn">Voir le rapport (${t.pct} %)</button><button class="btn quiet" id="resetBtn">Recommencer à zéro</button>`:""}
  </div>`;
  $main.querySelectorAll(".profile").forEach(b=>b.addEventListener("click",()=>{ state.profile=b.dataset.p; save(); track("Profil "+b.dataset.p); viewHome(); }));
  $main.querySelectorAll(".station button").forEach(b=>b.addEventListener("click",()=>go("mission", +b.dataset.m)));
  document.getElementById("startBtn").addEventListener("click",()=>{
    if(!state.profile){ state.profile="complet"; save(); }
    const next = recommended().find(n=>!missionDone(M[n-1])) || recommended()[0];
    track("Jeu démarré");
    go("mission", next);
  });
  const rb=document.getElementById("repBtn"); rb && rb.addEventListener("click",()=>go("report"));
  const rs=document.getElementById("resetBtn"); rs && rs.addEventListener("click",()=>{ state={profile:state.profile,results:{}}; save(); viewHome(); });
}
function heroSVG(){
  const st=["Pré-traitement","Étanchéité","Nettoyage","LDE","Panne","Stockage","Prélèvements"];
  return `<svg viewBox="0 0 360 250" role="img"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#3fb59c"/><stop offset="1" stop-color="#a7ecd6"/></linearGradient></defs>
  <text x="0" y="14" fill="#a7ecd6" font-size="11" font-family="JetBrains Mono">CIRCUIT · ENDOSCOPE CF-07</text>
  <path d="M45 60 H330 Q345 60 345 75 V110 Q345 125 330 125 H30 Q15 125 15 140 V175 Q15 190 30 190 H250" fill="none" stroke="url(#g)" stroke-width="5" stroke-linecap="round" stroke-dasharray="6 7"/>
  ${st.map((s,i)=>{const pos=[[45,60],[150,60],[255,60],[330,125],[210,125],[80,125],[150,190]][i];return `<g><circle cx="${pos[0]}" cy="${pos[1]}" r="11" fill="#0f1b1a" stroke="#a7ecd6" stroke-width="2"/><text x="${pos[0]}" y="${pos[1]+4}" text-anchor="middle" fill="#fff" font-size="11" font-weight="700" font-family="JetBrains Mono">${i+1}</text><text x="${pos[0]}" y="${pos[1]+(i===3?-20:26)}" text-anchor="middle" fill="#a7ecd6" font-size="10" font-family="JetBrains Mono">${s}</text></g>`;}).join("")}
  <g transform="translate(258 176)"><rect width="96" height="34" rx="6" fill="#1d2d2b" stroke="#3fb59c"/><text x="48" y="14" text-anchor="middle" fill="#a7ecd6" font-size="9" font-family="JetBrains Mono">NIVEAU CIBLE</text><text x="48" y="27" text-anchor="middle" fill="#fff" font-size="10" font-weight="700" font-family="JetBrains Mono">&lt; 5 UFC</text></g>
  <text x="0" y="244" fill="#6fbfaa" font-size="10" font-family="JetBrains Mono">FIN DE CYCLE · CONFORME ?</text></svg>`;
}

/* ---------- mission ---------- */
function startMission(num){
  const mi = num-1; const m = M[mi];
  const prev = state.results[m.id];
  state.results[m.id] = { steps: [], done:false };
  if(prev && !prev.done && prev.steps.length && prev.steps.length < m.steps.length){ state.results[m.id] = prev; }
  save();
  track("Mission "+num+" démarrée");
  cur = { mi, si: state.results[m.id].steps.length };
  renderStep();
}
function sidebar(){
  const t=totals(); const m=M[cur.mi];
  return `<aside class="side no-print">
    <div class="panel"><h3>Sécurité du circuit</h3>
      <div class="gauge-big">${t.max?t.pct:"–"}<small> %</small></div>
      <div class="bar"><i style="width:${t.pct}%"></i></div>
      <small style="color:var(--muted)">${t.pts} / ${t.max} points</small></div>
    <div class="panel"><h3>Bilan des décisions</h3><ul class="counters">
      <li><i class="dot d-sur"></i>Sûres<b>${t.c.sur}</b></li>
      <li><i class="dot d-risque"></i>Risque infectieux<b>${t.c.risque}</b></li>
      <li><i class="dot d-exces"></i>Mesures excessives<b>${t.c.exces}</b></li>
      <li><i class="dot d-trace"></i>Traçabilité<b>${t.c.trace}</b></li></ul></div>
    <div class="panel circ"><h3>Circuit</h3><div class="mini-circuit">${M.map(x=>`<span class="${missionDone(x)?"done":""} ${x.id===m.id?"cur":""}" title="${esc(x.titre)}">${x.num}</span>`).join("")}</div></div>
  </aside>`;
}
function cardHTML(c){
  if(!c) return "";
  if(c.kind==="ticket") return `<div class="card-ticket" aria-label="Ticket de traçabilité du LDE">${c.lines.map(([a,b])=>`<div class="row"><span>${esc(a)}</span><span class="${/ALARME|NON CONFORME/.test(b)?"bad":""}">${esc(b)}</span></div>`).join("")}</div>`;
  if(c.kind==="alarm") return `<div class="card-alarm" role="status"><span class="blink"></span>${esc(c.text)}</div>`;
  if(c.kind==="lab") return `<div class="card-lab ${c.alert?"alert":""}"><div class="h"><span>Résultat de laboratoire</span><span>${c.alert?"Alerte":"Contrôle"}</span></div><dl>${c.rows.map(([a,b])=>`<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join("")}</dl></div>`;
  if(c.kind==="gauge") return `<div class="card-gauge"><svg width="80" height="56" viewBox="0 0 80 56" aria-hidden="true"><path d="M8 44 A32 32 0 0 1 72 44" fill="none" stroke="#d6dfdc" stroke-width="6" stroke-linecap="round"/><path d="M8 44 A32 32 0 0 1 22 18" fill="none" stroke="#b13a2b" stroke-width="6" stroke-linecap="round"/><line class="needle" x1="40" y1="40" x2="40" y2="12" stroke="#11201e" stroke-width="3" stroke-linecap="round"/><circle cx="40" cy="40" r="4" fill="#11201e"/></svg><span>Manomètre du testeur : <b>chute de pression immédiate</b>, endoscope hors de l'eau.</span></div>`;
  if(c.kind==="clock") return `<div class="card-clock"><span>Dernier traitement <b>${esc(c.from)}</b></span><span>→</span><span>Examen <b>${esc(c.to)}</b></span><span class="badge b-trace">${esc(c.hours)}</span></div>`;
  return "";
}
function renderStep(){
  const m=M[cur.mi]; const st=m.steps[cur.si];
  cur.answered=false;
  const prog = m.steps.map((_,i)=>`<i class="${i<cur.si?"done":i===cur.si?"on":""}"></i>`).join("");
  let body="";
  if(st.type==="choice"){
    cur.order = shuffle(st.options.map((_,i)=>i));
    body = `<div class="opts">${cur.order.map((oi,k)=>`<button class="opt" data-o="${oi}"><span class="k">${"ABCD"[k]}</span><span class="tx">${esc(st.options[oi].t)}</span></button>`).join("")}</div>`;
  } else if(st.type==="multi"){
    cur.order = shuffle(st.items.map((_,i)=>i)); cur.sel=new Set();
    body = `<div class="opts multi">${cur.order.map(oi=>`<button class="opt" role="checkbox" aria-checked="false" data-o="${oi}"><span class="k"></span><span class="tx">${esc(st.items[oi].t)}</span></button>`).join("")}</div>
      <div class="actions"><button class="btn" id="validate">Valider ma sélection</button></div>`;
  } else if(st.type==="order"){
    cur.pool = shuffle(st.items.map((_,i)=>i)); cur.seq=[];
    body = `<div class="order-seq" id="seq" aria-live="polite"></div><div class="order-pool" id="pool"></div>
      <div class="actions"><button class="btn" id="validate" disabled>Valider l'ordre</button><button class="btn quiet" id="clear">Effacer</button></div>`;
  }
  $main.innerHTML = `<div class="play">
    <section class="scene">
      <header class="scene-head"><div><div class="meta">Mission ${m.num} sur 7 · ${esc(m.lieu)}</div><h2>${esc(m.titre)}</h2></div><span class="pill">${esc(m.heure)}</span></header>
      <div class="scene-body">
        <div class="progress" aria-label="Décision ${cur.si+1} sur ${m.steps.length}">${prog}</div>
        ${cur.si===0?`<p class="intro">${esc(m.intro)}</p>`:""}
        ${cardHTML(st.card)}
        <p class="q">${esc(st.q)}</p>
        ${body}
        <div id="fb"></div>
      </div>
    </section>
    ${sidebar()}
  </div>`;
  if(st.type==="choice") $main.querySelectorAll(".opt").forEach(b=>b.addEventListener("click",()=>answerChoice(+b.dataset.o)));
  if(st.type==="multi"){
    $main.querySelectorAll(".opt").forEach(b=>b.addEventListener("click",()=>{ if(cur.answered) return; const o=+b.dataset.o; cur.sel.has(o)?cur.sel.delete(o):cur.sel.add(o); b.classList.toggle("checked"); b.setAttribute("aria-checked", cur.sel.has(o)); b.querySelector(".k").textContent=cur.sel.has(o)?"✓":""; }));
    document.getElementById("validate").addEventListener("click",answerMulti);
  }
  if(st.type==="order"){ renderOrder(); document.getElementById("validate").addEventListener("click",answerOrder); document.getElementById("clear").addEventListener("click",()=>{ if(cur.answered) return; cur.seq=[]; renderOrder(); }); }
}
function renderOrder(){
  const st=M[cur.mi].steps[cur.si];
  const seq=document.getElementById("seq"), pool=document.getElementById("pool");
  seq.innerHTML = cur.seq.map((i,k)=>`<button class="chip" data-i="${i}"><span class="k">${k+1}</span>${esc(st.items[i])}</button>`).join("");
  pool.innerHTML = cur.pool.filter(i=>!cur.seq.includes(i)).map(i=>`<button class="chip" data-i="${i}"><span class="k" style="background:var(--line);color:var(--muted)">+</span>${esc(st.items[i])}</button>`).join("");
  pool.querySelectorAll(".chip").forEach(b=>b.addEventListener("click",()=>{ cur.seq.push(+b.dataset.i); renderOrder(); }));
  seq.querySelectorAll(".chip").forEach(b=>b.addEventListener("click",()=>{ if(cur.answered) return; cur.seq=cur.seq.filter(x=>x!==+b.dataset.i); renderOrder(); }));
  document.getElementById("validate").disabled = cur.seq.length!==st.items.length;
}
function record(cat, pts, extra){
  const m=M[cur.mi], st=m.steps[cur.si];
  state.results[m.id].steps[cur.si] = { cat, pts, q: st.q, ...extra };
  save();
}
function showFeedback(cat, html, ref){
  cur.answered=true;
  const v=document.getElementById("validate"); if(v) v.closest(".actions").remove();
  const last = cur.si===M[cur.mi].steps.length-1;
  document.getElementById("fb").innerHTML = `<div class="feedback f-${cat}" role="status">${badge(cat)}${html}${refLink(ref)}</div>
    <div class="actions"><button class="btn" id="next">${last?"Terminer la mission":"Décision suivante"}</button></div>`;
  const n=document.getElementById("next"); n.addEventListener("click",nextStep); n.focus({preventScroll:true});
  document.getElementById("fb").scrollIntoView({behavior:"smooth", block:"nearest"});
  // rafraîchir la barre latérale
  const side=$main.querySelector(".side"); if(side){ side.outerHTML = sidebar(); }
}
function answerChoice(oi){
  if(cur.answered) return;
  const st=M[cur.mi].steps[cur.si]; const o=st.options[oi];
  $main.querySelectorAll(".opt").forEach(b=>{
    const i=+b.dataset.o, op=st.options[i]; b.disabled=true;
    if(i===oi){ b.classList.add("sel","c-"+op.cat); b.insertAdjacentHTML("beforeend", badge(op.cat)); }
    else if(op.cat==="sur"){ b.classList.add("c-sur"); b.insertAdjacentHTML("beforeend", `<span class="badge b-sur">Réponse attendue</span>`); }
    else b.classList.add("faded");
  });
  record(o.cat, PTS[o.cat], { fb:o.fb, choix:o.t, attendu: (st.options.find(x=>x.cat==="sur")||{}).t, ref:st.ref });
  const good = st.options.find(x=>x.cat==="sur");
  showFeedback(o.cat, `<p>${esc(o.fb)}</p>${o.cat!=="sur"&&good?`<p><b>Réponse attendue :</b> ${esc(good.fb)}</p>`:""}`, st.ref);
}
function answerMulti(){
  if(cur.answered) return;
  const st=M[cur.mi].steps[cur.si]; let correct=0; const wrongCats=[]; let missed=0;
  $main.querySelectorAll(".opt").forEach(b=>{
    const i=+b.dataset.o, it=st.items[i], sel=cur.sel.has(i); b.disabled=true;
    if(sel===it.ok) correct++;
    if(it.ok){ b.classList.add(sel?"c-sur":"c-risque"); b.insertAdjacentHTML("beforeend", `<span class="badge ${sel?"b-sur":"b-partiel"}">${sel?"Conforme":"Oublié"}</span>`); if(!sel) missed++; }
    else { if(sel){ b.classList.add("c-"+it.cat); b.insertAdjacentHTML("beforeend", badge(it.cat)); wrongCats.push(it.cat); } else b.classList.add("faded"); }
  });
  const pts=Math.round(10*correct/st.items.length);
  let cat = correct===st.items.length ? "sur" : wrongCats.includes("risque") ? "risque" : wrongCats.includes("trace") ? "trace" : wrongCats.includes("exces") ? "exces" : "partiel";
  record(cat, pts, { fb:st.fb, ref:st.ref, detail:`${correct}/${st.items.length} éléments justes` });
  showFeedback(cat, `<p><b>${correct}/${st.items.length}</b> éléments correctement classés${missed?`, ${missed} geste${missed>1?"s":""} attendu${missed>1?"s":""} oublié${missed>1?"s":""}`:""}.</p><p>${esc(st.fb)}</p>`, st.ref);
}
function answerOrder(){
  if(cur.answered) return;
  const st=M[cur.mi].steps[cur.si]; let ok=0;
  cur.seq.forEach((v,k)=>{ if(v===k) ok++; });
  const seq=document.getElementById("seq");
  seq.innerHTML = cur.seq.map((i,k)=>`<div class="chip ${i===k?"ok":"ko"}"><span class="k">${k+1}</span>${esc(st.items[i])}${i!==k?`<span class="exp">attendu en ${i+1}</span>`:""}</div>`).join("");
  document.getElementById("validate").disabled=true; document.getElementById("clear").disabled=true;
  const cat = ok===st.items.length ? "sur" : "partiel";
  const pts = Math.round(10*ok/st.items.length);
  record(cat, pts, { fb:st.fb, ref:st.ref, detail:`${ok}/${st.items.length} étapes bien placées` });
  showFeedback(cat, `<p><b>${ok}/${st.items.length}</b> étapes à la bonne place.</p><p><b>Séquence attendue :</b></p><ol style="margin:6px 0 0;padding-left:20px">${st.items.map(x=>`<li>${esc(x)}</li>`).join("")}</ol><p>${esc(st.fb)}</p>`, st.ref);
}
function nextStep(){
  const m=M[cur.mi];
  if(cur.si < m.steps.length-1){ cur.si++; renderStep(); window.scrollTo({top:0}); return; }
  state.results[m.id].done=true; save();
  track("Mission "+m.num+" terminée");
  missionEnd();
}
function missionEnd(){
  const m=M[cur.mi]; const r=state.results[m.id];
  const pts=r.steps.reduce((a,s)=>a+s.pts,0), max=m.steps.length*10;
  const rec=recommended(); const nextNum = rec.find(n=>!missionDone(M[n-1])) || (M.find(x=>!missionDone(x))||{}).num;
  $main.innerHTML = `<div class="play"><section class="scene"><header class="scene-head"><div><div class="meta">Mission ${m.num} terminée</div><h2>${esc(m.titre)}</h2></div><span class="pill">${pts} / ${max}</span></header>
    <div class="scene-body">
      <div class="retenir"><h3>À retenir</h3><ul>${m.retenir.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
      <h3 style="margin-top:22px">Vos décisions</h3>
      <ul class="counters" style="margin-top:8px">${r.steps.map((s,i)=>`<li><i class="dot d-${s.cat==="partiel"?"trace":s.cat}" style="${s.cat==="partiel"?"background:#5d6d6a":""}"></i><span>Décision ${i+1} · ${CAT[s.cat].label}</span><b>${s.pts}/10</b></li>`).join("")}</ul>
      <div class="actions">
        ${nextNum?`<button class="btn" id="nx">Mission suivante : ${esc(M[nextNum-1].titre)}</button>`:`<button class="btn" id="rp">Voir le rapport final</button>`}
        <button class="btn quiet" id="again">Rejouer cette mission</button>
        <button class="btn quiet" id="hm">Retour au circuit</button>
      </div>
    </div></section>${sidebar()}</div>`;
  const nx=document.getElementById("nx"); nx && nx.addEventListener("click",()=>go("mission",nextNum));
  const rp=document.getElementById("rp"); rp && rp.addEventListener("click",()=>go("report"));
  document.getElementById("again").addEventListener("click",()=>{ delete state.results[m.id]; go("mission",m.num); });
  document.getElementById("hm").addEventListener("click",()=>go("home"));
}

/* ---------- rapport ---------- */
function viewReport(){
  const t=totals();
  const profile = PROFILES[state.profile || "complet"];
  const doneCount = profile.missions.filter(n=>missionDone(M[n-1])).length;
  const complete = doneCount === profile.missions.length;
  const progress = `${complete ? "Parcours terminé" : "Parcours incomplet"} · ${doneCount}/${profile.missions.length} missions requises terminées`;
  if(!t.max){ $main.innerHTML=`<div class="prose"><h1>Rapport</h1><p class="lead">${progress}</p><p>Aucune décision enregistrée pour l'instant.</p><button class="btn" id="b">Commencer</button></div>`; document.getElementById("b").onclick=()=>go("home"); return; }
  track("Rapport consulté");
  const [verdict, ringColor] = t.c.risque > 0 ? ["Circuit à risque : reprise conseillée", "#b13a2b"]
    : !complete ? ["Parcours incomplet", "#5d6d6a"]
    : t.pct >= 85 ? ["Circuit maîtrisé", "#1d7349"]
    : t.pct >= 65 ? ["Circuit à consolider", "#9a6210"]
    : ["Circuit à risque : reprise conseillée", "#b13a2b"];
  const C=2*Math.PI*54, off=C*(1-t.pct/100);
  const errs=[]; M.forEach(m=>{ const r=state.results[m.id]; if(!r) return; r.steps.forEach((s,i)=>{ if(s && ["risque","exces","trace"].includes(s.cat)) errs.push({m,s,i}); }); });
  const date=new Date().toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});
  $main.innerHTML = `<div class="prose" style="max-width:none">
    <p class="eyebrow">Rapport de parcours · ${date}</p>
    <div class="score-head">
      <svg class="ring" viewBox="0 0 130 130" role="img" aria-label="Score ${t.pct} %"><circle cx="65" cy="65" r="54" fill="none" stroke="#d6dfdc" stroke-width="12"/><circle cx="65" cy="65" r="54" fill="none" stroke="${ringColor}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${off}" transform="rotate(-90 65 65)"/><text x="65" y="72" text-anchor="middle" font-family="Cabinet Grotesk, sans-serif" font-weight="800" font-size="30" fill="#11201e">${t.pct} %</text></svg>
      <div><h1 style="margin-bottom:6px">${verdict}</h1><p class="lead" style="margin:0">${t.pts} points sur ${t.max} · parcours « ${esc(profile.label)} »</p><p>${progress}</p></div>
    </div>
    <div class="grid-2" style="margin-bottom:24px">
      <div class="panel"><h3>Bilan des décisions</h3><ul class="counters">
        <li><i class="dot d-sur"></i>Décisions sûres<b>${t.c.sur}</b></li>
        <li><i class="dot d-risque"></i>Risque infectieux<b>${t.c.risque}</b></li>
        <li><i class="dot d-exces"></i>Mesures excessives<b>${t.c.exces}</b></li>
        <li><i class="dot d-trace"></i>Traçabilité ou organisation<b>${t.c.trace}</b></li></ul></div>
      <div class="panel"><h3>Missions</h3><table class="table"><tbody>${M.map(m=>{const r=state.results[m.id]; const p=r?r.steps.reduce((a,s)=>a+(s?s.pts:0),0):null; return `<tr><td>${m.num}. ${esc(m.titre)}</td><td style="text-align:right;font-family:var(--font-mono)">${r&&r.done?`${p}/${m.steps.length*10}`:"non jouée"}</td></tr>`;}).join("")}</tbody></table></div>
    </div>
    <h2>Points à revoir</h2>
    ${errs.length?`<ul class="errs">${errs.map(({m,s,i})=>`<li class="${s.cat}"><div class="m">Mission ${m.num} · ${esc(m.titre)} · ${CAT[s.cat].label}</div><p style="margin:4px 0"><b>${esc(s.q)}</b></p>${s.choix?`<p style="margin:4px 0">Votre choix : ${esc(s.choix)}</p>`:`<p style="margin:4px 0">${esc(s.detail||"")}</p>`}${s.attendu?`<p style="margin:4px 0"><b>Attendu :</b> ${esc(s.attendu)}</p>`:""}${refLink(s.ref)}</li>`).join("")}</ul>`:`<p>Aucune décision à risque, excessive ou d'écart de traçabilité. Bravo.</p>`}
    <div class="actions no-print" style="margin-top:24px">
      ${complete?`<button class="btn" id="att">Obtenir mon attestation</button>`:""}
      <button class="btn ${complete?"quiet":""}" id="pr">Imprimer le rapport</button>
      <button class="btn quiet" id="hm">Retour au circuit</button>
    </div>
    <p style="font-size:13px;color:var(--muted);margin-top:18px">Ce rapport mesure des choix dans des scénarios fictifs. Il ne vaut ni validation des compétences ni validation par l'EOH. ${complete?"L'attestation n'indique que le palier atteint.":"L'attestation sera proposée une fois toutes les missions du parcours terminées."}</p>
  </div>`;
  document.getElementById("pr").addEventListener("click",()=>{ try{ window.print(); }catch(e){} });
  const att=document.getElementById("att"); att && att.addEventListener("click",()=>{ const tt=totals(); window.SGAttestation && window.SGAttestation.open({ jeu:"Retraitement des endoscopes", module:(state.profile||"complet")==="complet"?`parcours complet des ${M.length} missions`:`parcours « ${PROFILES[state.profile].label} »`, code:"END", color:"#0d5f5b", ratio: tt.pts/tt.max, critical: tt.c.risque, track: n=>{ if(TRACK_ON && TRACK_OK.test(n)) try{ window.plausible(n); }catch(e){} } }); });
  document.getElementById("hm").addEventListener("click",()=>go("home"));
}

/* ---------- aide-mémoire ---------- */
function viewMemo(){
  $main.innerHTML = `<div class="prose" style="max-width:none">
  <p class="eyebrow">Aide-mémoire</p><h1>Les repères du circuit</h1>
  <p class="lead">Synthèse des repères utilisés dans le jeu. Le protocole de l'établissement et les notices des fabricants prévalent.</p>
  <div class="memo">
    <div class="panel"><h3>Pré-traitement</h3><ul><li>Immédiatement après l'acte, en salle d'examen.</li><li>Essuyage externe à usage unique, aspiration-insufflation de tous les canaux.</li><li>Eau pour soins standard renouvelée après chaque endoscopie.</li><li>Transport immédiat, à sec, contenant fermé étiqueté « sale ».</li></ul></div>
    <div class="panel"><h3>Test d'étanchéité</h3><ul><li>Avant tout contact avec l'eau.</li><li>Gonflage hors de l'eau, vérification, immersion dans l'eau sans détergent, béquillage, dégonflage et débranchement hors de l'eau.</li><li>Fuite : arrêt du traitement, endoscope identifié « souillé, potentiellement contaminant », maintenance tracée.</li></ul></div>
    <div class="panel"><h3>Nettoyage</h3><ul><li>Étape manuelle toujours requise, même avant LDE.</li><li>Premier nettoyage d'au moins 10 minutes ; second nettoyage d'au moins 5 minutes en traitement manuel.</li><li>Bain renouvelé pour chaque endoscope, écouvillonnage immergé jusqu'à brosse propre, matériel à usage unique.</li><li>Duodénoscopes : extrémité distale et canal érecteur, dernière procédure du fabricant.</li></ul></div>
    <div class="panel"><h3>LDE</h3><ul><li>Auto-désinfection avant le programme, vérifications quotidiennes.</li><li>Tous les canaux connectés, modèle qualifié pour le LDE.</li><li>Ticket lu à chaque fin de cycle : alarme ou incohérence = endoscope non libéré.</li><li>Eau de rinçage terminal contrôlée chaque trimestre. Action : P. aeruginosa ≥ 1 UFC/100 mL ou flore à 22 °C ≥ 10 UFC/100 mL.</li></ul></div>
    <div class="panel"><h3>LDE non fonctionnel</h3><ul><li>Cycle interrompu = endoscope non désinfecté, cycle complet dans un LDE fonctionnel.</li><li>Appareil mis en doute hors service jusqu'à confirmation de son bon fonctionnement.</li><li>Jamais d'endoscope sale en ESET.</li><li>Mode dégradé écrit et validé, adaptation du programme, endoscope à usage unique si besoin.</li></ul></div>
    <div class="panel"><h3>Stockage</h3><ul><li>Hors ESET : 12 heures ou plus = désinfection avant utilisation ; plus d'une semaine = cycle complet.</li><li>ESET qualifiée : durée du fabricant dans la limite d'une semaine, utilisation immédiate à la sortie (semi-critique).</li><li>Défaut de l'ESET = traitement complet des endoscopes concernés.</li></ul></div>
    <div class="panel"><h3>Contrôles microbiologiques</h3><ul><li>Chaque endoscope au moins une fois par an ; duodénoscopes et écho-endoscopes chaque trimestre.</li><li>Contrôle ponctuel avec attente du résultat : acquisition, prêt, retour de maintenance, changement de procédure, alerte, cas groupés, levée de séquestration.</li><li>Prélèvement après au moins 6 heures de stockage.</li></ul></div>
    <div class="panel"><h3>Résultats (niveau intermédiaire, rinçage EBM)</h3><ul><li><b>Cible</b> : &lt; 5 UFC et aucun indicateur.</li><li><b>Alerte</b> : 5 à 25 UFC sans indicateur. Endoscope maintenu, vérifications, recontrôle.</li><li><b>Action</b> : &gt; 25 UFC ou un indicateur. Arrêt, procédure renforcée, canal par canal, enquête, patients exposés, cellule de crise.</li><li>Endoscopes critiques : action dès 1 UFC/100 mL.</li></ul></div>
  </div></div>`;
}
function viewSources(){
  $main.innerHTML = `<div class="prose"><p class="eyebrow">Sources</p><h1>Références utilisées</h1>
  <p class="lead">Les débriefings renvoient à ces textes. Vérifiez la version en vigueur et votre protocole local avant tout usage institutionnel.</p>
  <ul class="src">${Object.values(S).map(s=>`<li><a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul>
  <h2 style="margin-top:28px">Limites</h2>
  <ul><li>Scénarios fictifs, numéros de série inventés.</li><li>Les conduites à tenir en cas de panne de LDE et de mode dégradé relèvent en grande partie de l'organisation locale : l'instruction de 2016 ne détaille pas de procédure générale.</li><li>Les décisions d'information des patients et de signalement externe se prennent en cellule de crise, avec l'EOH.</li><li>Relecture clinique par l'EOH et le CLIN nécessaire avant diffusion institutionnelle.</li></ul></div>`;
}

go("home");
})();
