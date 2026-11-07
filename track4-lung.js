/* ======================================================================
   Track 4: Lung Mixer
   Change three dials (fluid, infected cells, immune response) and watch
   the air sacs, oxygen reaching the blood, and breathing rate change.
   Try the presets to finish the track.
   ====================================================================== */
'use strict';

T[3] = function(){
 var st = $('#stage');
 var SAC_ORDER = [5, 10, 2, 14, 7, 0, 12, 9, 3, 15, 6, 1, 11, 4, 13, 8];
 var INF_ORDER = [9, 1, 13, 6, 0, 11, 4, 15, 2, 8, 14, 3, 10, 7, 12, 5];
 var presetsSeen = {};
 var lowest = 100;

 st.innerHTML = '<div class="two"><div class="card art"><svg id="lungsvg" viewBox="0 0 600 400" role="img" aria-label="A grid of air sacs that changes with the dials"></svg></div>'+
  '<div class="card"><h3>Presets</h3><div class="seg" id="presets">'+
  Object.keys(LUNG_PRESETS).map(function(k){ return '<button class="segb" data-p="'+k+'">'+LUNG_PRESETS[k].name+'</button>'; }).join('')+
  '</div><p class="meta" id="pmsg">Try the presets. Then play with the dials.</p>'+
  '<div class="rl"><span>Fluid in air sacs</span><span id="fv">0</span></div><input id="d-fluid" type="range" min="0" max="100" value="0" aria-label="Fluid in the air sacs">'+
  '<div class="rl"><span>Lining cells infected</span><span id="iv">0</span></div><input id="d-inf" type="range" min="0" max="100" value="0" aria-label="Infected lining cells">'+
  '<div class="rl"><span>Immune response</span><span id="mv">10</span></div><input id="d-inflam" type="range" min="0" max="100" value="10" aria-label="Immune response and inflammation">'+
  '</div></div>'+
  '<div class="two"><div class="card"><div class="meter"><span>Oxygen reaching the blood: <b id="ox"></b>%</span><div class="mbar"><span id="oxb"></span></div></div>'+
  '<div class="meter"><span>Breathing rate: <b id="br"></b> breaths per minute</span><div class="mbar"><span id="brb" style="background:#FF5D7A"></span></div></div></div>'+
  '<div class="card"><h3 id="lh">Healthy lungs</h3><p id="lx"></p></div></div>';

 function drawScene(f, inf, m){
  var nFluid = Math.round(f / 100 * 16), nInf = Math.round(inf / 100 * 16), nImm = Math.round(m / 100 * 5);
  var s = '<rect width="600" height="400" rx="12" fill="#F2A9BC"/>';
  var cols = 4, cw = 130, ch = 90;
  for (var k = 0; k < 16; k++){
   var idx = SAC_ORDER[k], cx = 75 + (idx % cols) * cw, cy = 60 + Math.floor(idx / cols) * ch;
   var isFluid = SAC_ORDER.slice(0, nFluid).indexOf(idx) > -1;
   var isInf = INF_ORDER.slice(0, nInf).indexOf(idx) > -1;
   var wall = 4 + m / 25;
   s += '<circle cx="'+cx+'" cy="'+cy+'" r="36" fill="'+(isFluid ? '#BCD7F0' : '#FFFFFF')+'" stroke="'+(isInf ? '#7A2D66' : '#C9708C')+'" stroke-width="'+wall+'"/>';
   if (isInf) s += '<circle cx="'+(cx + 14)+'" cy="'+(cy - 10)+'" r="7" fill="#5B3A9A"/><circle cx="'+(cx - 12)+'" cy="'+(cy + 12)+'" r="5" fill="#5B3A9A"/>';
   if (isFluid) s += '<path d="M'+(cx - 26)+' '+(cy + 8)+' Q'+cx+' '+(cy - 4)+' '+(cx + 26)+' '+(cy + 8)+'" stroke="#8FB8D8" stroke-width="3" fill="none"/>';
   for (var j = 0; j < nImm; j++){
    var a = (j / 5) * Math.PI * 2 + 0.4 + k;
    s += '<circle cx="'+(cx + Math.cos(a) * 46)+'" cy="'+(cy + Math.sin(a) * 46)+'" r="6" fill="#5B3A9A" stroke="#C9B8FF" stroke-width="2"/>';
   }
  }
  s += '<text class="lb" x="300" y="390" text-anchor="middle">Air sacs: '+(16 - nFluid)+' open, '+nFluid+' filled with fluid, '+nInf+' infected</text>';
  return s;
 }

 function update(){
  var f = +$('#d-fluid').value, inf = +$('#d-inf').value, m = +$('#d-inflam').value;
  $('#fv').textContent = f; $('#iv').textContent = inf; $('#mv').textContent = m;
  $('#lungsvg').innerHTML = drawScene(f, inf, m);
  var ox = Math.round(Math.max(0, Math.min(100, 100 - f * 0.5 - inf * 0.3 - Math.max(0, m - 50) * 0.4)));
  var br = Math.round(14 + (100 - ox) * 0.25);
  $('#ox').textContent = ox; $('#oxb').style.width = ox + '%';
  $('#br').textContent = br; $('#brb').style.width = Math.min(100, (br / 40) * 100) + '%';
  var lx = $('#lx'), lh = $('#lh');
  if (ox >= 85){ lh.textContent = 'Mostly healthy lungs'; lx.textContent = 'Most air sacs are open, so oxygen moves into the blood easily.'; }
  else if (ox >= 50){ lh.textContent = 'Lungs under strain'; lx.textContent = 'Less oxygen reaches the blood, so breathing speeds up to make up for it.'; }
  else { lh.textContent = 'Lungs in serious trouble'; lx.textContent = 'Very little oxygen reaches the blood. Real low oxygen needs urgent medical care.'; }
  if (ox < lowest){ lowest = ox; STATS.lowO2 = lowest; saveStats(); }
  $$('.segb').forEach(function(b){ b.classList.remove('on'); });
 }

 st.addEventListener('input', function(e){
  if (e.target.id && e.target.id.indexOf('d-') === 0) update();
 });
 st.addEventListener('click', function(e){
  var b = e.target.closest('[data-p]');
  if (!b) return;
  var p = LUNG_PRESETS[b.getAttribute('data-p')];
  $('#d-fluid').value = p.fluid; $('#d-inf').value = p.infected; $('#d-inflam').value = p.inflam;
  update();
  b.classList.add('on');
  presetsSeen[b.getAttribute('data-p')] = 1;
  $('#pmsg').textContent = p.name + ' lungs loaded. Now try changing one dial at a time.';
  if (presetsSeen.mild && presetsSeen.moderate && presetsSeen.severe){ finish(3); }
 });

 update();
};