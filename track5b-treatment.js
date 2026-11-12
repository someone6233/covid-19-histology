/* ======================================================================
   Track 6: Treatment of COVID-19
   Three treatments from TREATMENTS (config.js), each with its own
   hands-on picture instead of a paragraph:
   - Antivirals: pick the day the medicine starts and watch the virus count.
   - Monoclonal antibodies: tap antibodies onto every spike, then send the virus.
   - Steroids: change the dose for a mild or a very sick patient.
   The track is finished once all three have been explored.
   ====================================================================== */
'use strict';

T[5] = function(){
 var st = $('#stage'), which = 0, fin = {}, busy = false;
 var S = {day:null, early:0, late:0, ab:[0,0,0,0,0], sick:1, dose:0, good:0, warn:0};
 var USE = [[1,1,0],[1,0,0],[0,0,1]];   /* where each treatment is used */
 var USEL = ['Early infection', 'Mild or moderate', 'Very sick, needs oxygen'];
 var ANG = [-160, -125, -90, -55, -20];

 st.innerHTML = '<div class="card"><h3>Pick a treatment</h3><div class="seg" id="txseg">'+
  TREATMENTS.map(function(t, i){ return '<button class="segb'+(i === 0 ? ' on' : '')+'" data-tab="'+i+'">'+t.name+'</button>'; }).join('')+'</div></div>'+
  '<div class="two"><div class="card art"><svg id="txsvg" viewBox="0 0 600 340" role="img" aria-label="Treatment diagram"></svg></div><div class="card" id="txctl"></div></div>';

 function mark(i){
  if (fin[i]) return;
  fin[i] = 1;
  $$('#txseg .segb')[i].textContent = '✓ ' + TREATMENTS[i].name;
  if (fin[0] && fin[1] && fin[2]) finish(5);
 }
 function foot(){
  var t = TREATMENTS[which];
  return '<p class="eyebrow">Used when</p><div class="pills">'+USEL.map(function(l, i){
   return '<span class="pill'+(USE[which][i] ? ' on' : '')+'"'+(USE[which][i] ? '' : ' style="opacity:.45"')+'>'+l+'</span>';
  }).join('')+'</div><p class="meta">'+t.what+' '+t.when+'</p>';
 }

 /* ---------- Antivirals: the day the medicine starts ---------- */
 function drawAnti(){
  var D = S.day, end = 0;
  var s = '<line x1="40" y1="300" x2="470" y2="300" stroke="#2F2B49" stroke-width="3"/><text class="lb" x="14" y="326">Day</text>';
  for (var d = 1; d <= 6; d++){
   var free = Math.pow(2, d - 1);
   var c = (D === null || d <= D) ? free : Math.max(1, Math.pow(2, D - 1) / Math.pow(2, d - D));
   var x = 56 + (d - 1) * 68, h = c * 6;
   if (d === 6) end = c;
   s += '<rect x="'+x+'" y="'+(300 - free * 6)+'" width="50" height="'+(free * 6)+'" rx="6" fill="none" stroke="#6B6590" stroke-width="2" stroke-dasharray="5 5"/>'+
    '<rect x="'+x+'" y="'+(300 - h)+'" width="50" height="'+h+'" rx="6" fill="'+(D !== null && d > D ? '#3CDDC6' : '#FF5D7A')+'"/>'+
    virus(x + 25, 300 - h - 16, 9, {n:8, len:4})+
    '<text class="lb" x="'+(x + 25)+'" y="326" text-anchor="middle">'+d+'</text>';
  }
  s += '<rect x="490" y="56" width="90" height="62" rx="12" fill="#4C3FA3" stroke="#8B7BFF" stroke-width="4"/><circle cx="535" cy="87" r="15" fill="none" stroke="#C9B8FF" stroke-width="5" stroke-dasharray="8 6"/>';
  if (D === null){
   s += '<line class="flow" x1="535" y1="122" x2="535" y2="158" stroke="#FF5D7A" stroke-width="4"/>'+virus(520, 184, 9, {n:8, len:4})+virus(552, 184, 9, {n:8, len:4});
  } else {
   var mx = 56 + (D - 1) * 68 + 25;
   s += '<path d="M505 68L565 106M565 68L505 106" stroke="#FF5D7A" stroke-width="8" stroke-linecap="round"/>'+
    '<g transform="translate(535 30) rotate(-35)"><rect x="-22" y="-10" width="44" height="20" rx="10" fill="#3CDDC6" stroke="#06221e" stroke-width="3"/><rect x="0" y="-10" width="22" height="20" rx="10" fill="#FFD166" stroke="#06221e" stroke-width="3"/></g>'+
    '<line x1="'+mx+'" y1="60" x2="'+mx+'" y2="300" stroke="#FFD166" stroke-width="3" stroke-dasharray="6 6"/>'+
    '<g transform="translate('+mx+' 44) rotate(-35)"><rect x="-20" y="-9" width="40" height="18" rx="9" fill="#3CDDC6"/><rect x="0" y="-9" width="20" height="18" rx="9" fill="#FFD166"/></g>';
  }
  s += '<text class="lb" x="535" y="236" text-anchor="middle">Copy machine</text>';
  $('#txsvg').innerHTML = s;
  $('#txctl').innerHTML = '<h3>When does the medicine start?</h3><div class="seg">'+
   [0,1,2,3,4,5,6].map(function(v){
    var on = (D === null && v === 0) || D === v;
    return '<button class="segb'+(on ? ' on' : '')+'" data-d="'+v+'">'+(v === 0 ? 'None' : 'Day ' + v)+'</button>';
   }).join('')+'</div>'+
   '<p class="fb'+(fin[0] ? ' good' : '')+'">Viruses on Day 6: <b>'+end+'</b> (no medicine: 32)'+(fin[0] ? '. Early beats late!' : '. Try an early start and a late start.')+'</p>'+foot();
 }

 /* ---------- Monoclonal antibodies: cover every spike ---------- */
 function abScene(){
  var cx = 300, cy = 250;
  var s = '<rect width="600" height="28" fill="#3CDDC6"/><polygon points="270,28 270,62 288,62 300,46 312,62 330,62 330,28" fill="#2A8F84" stroke="#3CDDC6" stroke-width="3"/>'+
   '<text class="lb" x="346" y="52">ACE2 lock</text><g id="abv" style="transform-origin:300px 250px">';
  ANG.forEach(function(d, i){
   var a = d * Math.PI / 180, x2 = cx + Math.cos(a) * 56, y2 = cy + Math.sin(a) * 56;
   s += '<g class="kv" data-s="'+i+'" tabindex="0" role="button" aria-label="Spike '+(i + 1)+(S.ab[i] ? ', antibody attached' : ', no antibody')+'">'+
    '<line x1="'+(cx + Math.cos(a) * 34)+'" y1="'+(cy + Math.sin(a) * 34)+'" x2="'+x2+'" y2="'+y2+'" stroke="#FF5D7A" stroke-width="4" stroke-linecap="round"/>'+
    '<g transform="translate('+x2+' '+y2+') rotate('+(d + 90)+')"><polygon points="0,-13 -9,0 9,0" fill="#FF5D7A"/>'+
    (S.ab[i] ? '<path d="M0 -12V-26M0 -26L-9 -37M0 -26L9 -37" stroke="#3CDDC6" stroke-width="5" fill="none" stroke-linecap="round"/>' : '<circle cx="0" cy="-8" r="20" fill="#FFD166" opacity=".2"/>')+
    '</g><circle cx="'+x2+'" cy="'+y2+'" r="26" fill="transparent"/></g>';
  });
  s += '<circle cx="300" cy="250" r="34" fill="#FF5D7A"/><circle cx="290" cy="238" r="6" fill="#fff" opacity=".25"/></g>'+
   '<text class="lb" x="300" y="330" text-anchor="middle">Antibodies: '+S.ab.filter(Boolean).length+' of 5</text>';
  $('#txsvg').innerHTML = s;
 }
 function drawAb(){
  abScene();
  $('#txctl').innerHTML = '<h3>Tap each spike to attach an antibody</h3>'+
   '<div class="btnrow"><button class="btn pri" id="absend">Send the virus to the cell</button><button class="btn ghost" id="abclr">Clear</button></div>'+
   '<p class="fb" id="abfb"></p>'+foot();
 }
 function abSend(){
  if (busy) return;
  busy = true;
  var g = $('#abv'), fb = $('#abfb');
  var free = [0,1,2,3,4].filter(function(i){ return !S.ab[i]; });
  fb.className = 'fb'; fb.textContent = '';
  var opt = {duration:700, easing:'ease-in-out', fill:'forwards'};
  if (!free.length){
   g.animate([{transform:'translate(0px,0px)'}, {transform:'translate(0px,-86px)'}], opt).onfinish = function(){
    if (which !== 1) return;
    $('#txsvg').insertAdjacentHTML('beforeend', '<path d="M286 34L314 58M314 34L286 58" stroke="#FF5D7A" stroke-width="7" stroke-linecap="round"/>');
    fb.className = 'fb good'; fb.textContent = 'Blocked! Antibodies on every spike stop the virus from docking.';
    g.animate([{transform:'translate(0px,-86px)'}, {transform:'translate(0px,10px)'}, {transform:'translate(0px,0px)'}], {duration:700, easing:'ease-out', fill:'forwards'}).onfinish = function(){ busy = false; };
    mark(1);
   };
  } else {
   free.sort(function(a, b){ return Math.abs(ANG[a] + 90) - Math.abs(ANG[b] + 90); });
   var r = -90 - ANG[free[0]];
   g.animate([{transform:'translate(0px,0px) rotate(0deg)'}, {transform:'translate(0px,-60px) rotate(0deg)', offset:.4}, {transform:'translate(0px,-131px) rotate('+r+'deg)'}], {duration:1200, easing:'ease-in-out', fill:'forwards'}).onfinish = function(){
    if (which !== 1) return;
    $('#txsvg').insertAdjacentHTML('beforeend', '<circle cx="300" cy="48" r="16" fill="none" stroke="#FFD166" stroke-width="4"/>');
    fb.className = 'fb bad'; fb.textContent = 'Docked! A spike with no antibody still fits the lock. Cover every spike.';
    setTimeout(function(){ busy = false; if (which === 1) abScene(); }, 1800);
   };
  }
 }

 /* ---------- Steroids: calm inflammation, but not for mild illness ---------- */
 function drawSt(){
  $('#txctl').innerHTML = '<h3>Who is the patient?</h3><div class="seg">'+
   '<button class="segb'+(S.sick ? '' : ' on')+'" data-sick="0">Mild illness</button><button class="segb'+(S.sick ? ' on' : '')+'" data-sick="1">Very sick (needs oxygen)</button></div>'+
   '<div class="rl"><span>Steroid dose</span><span id="sdv">0</span></div><input id="sdose" type="range" min="0" max="100" value="'+S.dose+'" aria-label="Steroid dose">'+
   '<div class="meter"><span>Inflammation: <b id="sin"></b>%</span><div class="mbar"><span id="sinb" style="background:var(--virus)"></span></div></div>'+
   '<div class="meter"><span>Immune defense: <b id="sdf"></b>%</span><div class="mbar"><span id="sdfb" style="background:var(--violet)"></span></div></div>'+
   '<div class="legend"><span><i style="background:#5B3A9A"></i>Immune cells</span><span><i style="background:#E23D5F"></i>Inflammation</span><span><i style="background:#FF5D7A"></i>Virus</span></div>'+
   '<p class="fb" id="sfb"></p>'+foot();
  stScene();
 }
 function stScene(){
  var infl = Math.round((S.sick ? 90 : 25) * (1 - S.dose / 100 * 0.85)), def = Math.round(100 - S.dose * 0.7);
  var nV = Math.round(1 + (100 - def) / 12 + (S.sick ? 1 : 0)), nI = Math.round(def / 25), nR = Math.round(infl / 18);
  var col = infl > 60 ? '#E23D5F' : infl > 30 ? '#E8809A' : '#C9708C';
  var s = '<rect width="600" height="340" rx="12" fill="#F2A9BC"/>';
  for (var k = 0; k < 6; k++){
   var cx = 120 + (k % 3) * 180, cy = 100 + Math.floor(k / 3) * 140;
   s += '<circle cx="'+cx+'" cy="'+cy+'" r="50" fill="'+(infl > 60 ? '#FFC9D4' : '#FFFFFF')+'" stroke="'+col+'" stroke-width="'+(3 + infl / 12)+'"/>';
   for (var j = 0; j < nR; j++){ var b = j * 1.26 + k; s += '<circle cx="'+(cx + Math.cos(b) * 28)+'" cy="'+(cy + Math.sin(b) * 28)+'" r="5" fill="#E23D5F"/>'; }
   for (var m = 0; m < nI; m++){ var a = m * 1.57 + k; s += '<circle cx="'+(cx + Math.cos(a) * 68)+'" cy="'+(cy + Math.sin(a) * 68)+'" r="8" fill="#5B3A9A" stroke="#C9B8FF" stroke-width="2"/>'; }
  }
  for (var v = 0; v < nV; v++){ var q = v % 6; s += virus(120 + (q % 3) * 180 - 12 + (v > 5 ? 26 : 0), 100 + Math.floor(q / 3) * 140 + 8, 8, {n:8, len:3}); }
  $('#txsvg').innerHTML = s;
  $('#sdv').textContent = S.dose;
  $('#sin').textContent = infl; $('#sinb').style.width = infl + '%';
  $('#sdf').textContent = def; $('#sdfb').style.width = def + '%';
  var msg, cls = 'fb bad';
  if (S.sick){
   if (S.dose < 50) msg = 'Inflammation is still hurting the lungs. Try a bigger dose.';
   else if (S.dose <= 80){ msg = 'Inflammation is calmed and the lungs are protected. This is when steroids help.'; cls = 'fb good'; S.good = 1; }
   else msg = 'Inflammation is low, but a very high dose weakens the defenses too much.';
  } else if (S.dose < 50){ msg = 'The immune system is already handling a mild illness. Try a high dose to see why steroids are not used here.'; cls = 'fb'; }
  else { msg = 'Not needed here. Steroids weaken the immune system, so the virus spreads.'; S.warn = 1; }
  $('#sfb').className = cls; $('#sfb').textContent = msg;
  if (S.good && S.warn) mark(2);
 }

 function draw(){ [drawAnti, drawAb, drawSt][which](); }

 st.addEventListener('click', function(e){
  var t = e.target.closest('[data-tab]');
  if (t){
   which = +t.getAttribute('data-tab'); busy = false;
   $$('#txseg .segb').forEach(function(b, i){ b.classList.toggle('on', i === which); });
   draw(); return;
  }
  var d = e.target.closest('[data-d]');
  if (d){
   var v = +d.getAttribute('data-d'); S.day = v || null;
   if (v && v <= 2) S.early = 1;
   if (v >= 5) S.late = 1;
   if (S.early && S.late) mark(0);
   drawAnti(); return;
  }
  var sp = e.target.closest('.kv');
  if (sp){
   if (busy) return;
   var i = +sp.getAttribute('data-s'); S.ab[i] = S.ab[i] ? 0 : 1; abScene();
   var f = $('.kv[data-s="'+i+'"]'); if (f) f.focus();
   return;
  }
  if (e.target.closest('#absend')){ abSend(); return; }
  if (e.target.closest('#abclr')){ if (!busy){ S.ab = [0,0,0,0,0]; abScene(); } return; }
  var sk = e.target.closest('[data-sick]');
  if (sk){
   S.sick = +sk.getAttribute('data-sick');
   $$('[data-sick]').forEach(function(b){ b.classList.toggle('on', b === sk); });
   stScene();
  }
 });
 st.addEventListener('input', function(e){ if (e.target.id === 'sdose'){ S.dose = +e.target.value; stScene(); } });

 draw();
};