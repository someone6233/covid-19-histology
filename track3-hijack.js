/* ======================================================================
   Track 3: Hijack Session
   Part 1: find the virus whose spikes fit the ACE2 lock.
   Part 2: you are the virus. Make the right choice at each step, or
   the cell loses energy. Your energy is saved for the Wrapped.
   ====================================================================== */
'use strict';

T[2] = function(){
 var st = $('#stage');
 var TIP = {
  a:'<polygon points="0,-13 -9,0 9,0" fill="#FF5D7A"/>',
  b:'<rect x="-9" y="-14" width="18" height="14" fill="#FF5D7A"/>',
  c:'<circle cx="0" cy="-8" r="8" fill="#FF5D7A"/>'
 };
 var TARGET = {a:119, b:134, c:136};
 function keyVirus(x, y, t){
  var s = '', up = [-160, -125, -90, -55, -20], dn = [20, 55, 90, 125, 160];
  up.concat(dn).forEach(function(d, i){
   var a = d * Math.PI / 180, x2 = x + Math.cos(a) * 56, y2 = y + Math.sin(a) * 56;
   s += '<line x1="'+(x + Math.cos(a) * 34)+'" y1="'+(y + Math.sin(a) * 34)+'" x2="'+x2+'" y2="'+y2+'" stroke="#FF5D7A" stroke-width="4" stroke-linecap="round"/>';
   if (i < 5) s += '<g transform="translate('+x2+' '+y2+') rotate('+(d + 90)+')">'+TIP[t]+'</g>';
   else s += '<circle cx="'+x2+'" cy="'+y2+'" r="5" fill="#FF5D7A"/>';
  });
  return s + '<circle cx="'+x+'" cy="'+y+'" r="34" fill="#FF5D7A"/><circle cx="'+(x - 10)+'" cy="'+(y - 12)+'" r="6" fill="#fff" opacity=".25"/>';
 }
 var order = shuffle(['a', 'b', 'c']), xs = [110, 300, 490];
 var vs = order.map(function(t, i){ return '<g class="kv" data-t="'+t+'" data-x="'+xs[i]+'" tabindex="0" role="button" aria-label="Try virus '+(i + 1)+'">'+keyVirus(xs[i], 250, t)+'</g>'; }).join('');
 var lbs = order.map(function(t, i){ return '<text class="lb" x="'+xs[i]+'" y="322" text-anchor="middle" id="kl'+t+'">Virus '+(i + 1)+'</text>'; }).join('');
 st.innerHTML = '<div class="card"><h3>Part 1: Find the "key" that fits</h3><p>The cell membrane has a docking lock called <b>ACE2</b>. Tap a virus to test whether its spikes fit.</p></div>'+
  '<div class="card art"><svg viewBox="0 0 600 330" id="ksvg" role="group" aria-label="One ACE2 lock on the cell membrane and three viruses to test">'+
  '<rect x="0" y="0" width="600" height="28" fill="#3CDDC6"/><polygon points="270,28 270,62 288,62 300,46 312,62 330,62 330,28" fill="#2A8F84" stroke="#3CDDC6" stroke-width="3"/>'+
  '<text class="lb" x="346" y="52">ACE2 lock</text><text x="14" y="20" style="font-size:13px;font-weight:700;fill:#06221e">Cell membrane</text>'+vs+lbs+'</svg></div><p class="fb" id="kfb"></p>'+
  '<div id="partB" hidden></div>';

 var busy = false, solved = false;
 st.addEventListener('click', function(e){
  var g = e.target.closest('.kv'); if (!g || busy || solved) return;
  var t = g.getAttribute('data-t'), x = +g.getAttribute('data-x'), dx = 300 - x, dy = TARGET[t] - 250;
  busy = true; g.getAnimations().forEach(function(a){ a.cancel(); });
  var f = $('#kfb'); f.className = 'fb'; f.textContent = '';
  var an = g.animate([{transform:'translate(0px,0px)'}, {transform:'translate('+dx+'px,'+dy+'px)'}], {duration:800, easing:'ease-in-out', fill:'forwards'});
  an.onfinish = function(){
   if (t === 'a'){
    solved = true; busy = false;
    $$('.kv').forEach(function(o){ if (o !== g) o.style.opacity = '.25'; });
    $('#ksvg').insertAdjacentHTML('beforeend', '<circle cx="300" cy="48" r="16" fill="none" stroke="#FFD166" stroke-width="4"/>');
    var lb = $('#kl' + t); if (lb) lb.textContent = 'COVID-19 virus';
    f.className = 'fb good'; f.textContent = 'Click! The spike fits ACE2 like a key in a lock. This is the COVID-19 virus.';
    buildB();
   } else {
    var back = g.animate([{transform:'translate('+dx+'px,'+dy+'px)'}, {transform:'translate('+(dx + 10)+'px,'+(dy + 6)+'px)'}, {transform:'translate(0px,0px)'}], {duration:700, easing:'ease-out', fill:'forwards'});
    f.className = 'fb bad'; f.textContent = 'No fit. Those spikes do not match the lock, so the virus bounces off.';
    back.onfinish = function(){ busy = false; };
   }
  };
 });

 var POS = [[120,150],[330,300],[430,250],[280,160],[360,140],[150,300],[470,190],[230,270]];
 function scene(n){
  var s = '<ellipse cx="300" cy="220" rx="265" ry="140" fill="#1F4B5C" stroke="#3CDDC6" stroke-width="10"/>'+
   '<circle cx="200" cy="220" r="50" fill="#4C3FA3" stroke="#8B7BFF" stroke-width="4"/><circle cx="212" cy="210" r="14" fill="#2D2470"/>'+
   '<g transform="translate(420 200) rotate(15)"><ellipse rx="40" ry="20" fill="#FF9B6A" stroke="#FFD0B5" stroke-width="4"/></g>';
  for (var i = 0; i < n; i++) s += virus(POS[i % POS.length][0], POS[i % POS.length][1], 11, {n:8, len:6});
  return s;
 }

 function buildB(){
  var pb = $('#partB'); pb.hidden = false;
  var step = 0, energy = 100, n = 1, locked = false;
  pb.innerHTML = '<div class="card"><h3>Part 2: Become the virus</h3><p>The virus is inside. Try and make the right choice. The wrong moves drain the cell’s energy, and we don not want that.</p></div>'+
   '<div class="two" style="margin-top:16px"><div class="card art"><svg id="sc" viewBox="0 0 600 340" role="img" aria-label="A cell with virus particles inside"></svg></div>'+
   '<div class="card"><div class="pills" id="sp"></div><h3 id="sh"></h3><p id="stx"></p>'+
   '<div class="meter"><span>Cell energy: <b id="en"></b>%</span><div class="mbar"><span id="enb"></span></div></div>'+
   '<div id="qbox"></div><p class="fb" id="hb"></p></div></div>';

  function draw(){
   $('#sc').innerHTML = scene(n) + '<rect x="12" y="12" width="262" height="36" rx="10" fill="#171525" stroke="#3CDDC6" stroke-width="2.5"/><text class="lb" x="143" y="36" text-anchor="middle">Viruses inside: '+n+'</text>';
   $('#sh').textContent = TAKEOVER_STEPS[step].h;
   $('#stx').textContent = TAKEOVER_STEPS[step].t;
   $('#sp').innerHTML = TAKEOVER_STEPS.map(function(x, i){ return '<span class="pill'+(i <= step ? ' on' : '')+'">'+(i + 1)+'</span>'; }).join('');
   $('#en').textContent = energy;
   $('#enb').style.width = energy + '%';
  }

  function ask(){
   var q = HIJACK[step];
   var opts = shuffle(q.a.map(function(t, i){ return {t:t, ok:i === 0}; }));
   $('#qbox').innerHTML = '<p><b>'+q.q+'</b></p><div class="opts">'+opts.map(function(o){ return '<button class="opt" data-ok="'+(o.ok ? 1 : 0)+'">'+o.t+'</button>'; }).join('')+'</div>';
   locked = false;
  }
  function start(){ draw(); ask(); }

  var hint = $('#hb');
  $('#qbox').onclick = function(e){
   var b = e.target.closest('.opt'); if (!b || locked) return;
   var ok = b.getAttribute('data-ok') === '1';
   var q = HIJACK[step];
   locked = true;
   $$('.opt').forEach(function(x){ if (x.getAttribute('data-ok') === '1') x.classList.add('right'); });
   if (!ok){ b.classList.add('wrong'); energy = Math.max(0, energy - 20); }
   else { n = Math.min(8, n + 2); }
   hint.className = 'fb ' + (ok ? 'good' : 'bad');
   hint.textContent = (ok ? 'Good! ' : 'Maybe try again. ') + q.e;
   draw();
   var nxt = document.createElement('button');
   nxt.className = 'btn pri'; nxt.id = 'hnext';
   nxt.textContent = step < HIJACK.length - 1 ? 'Next round' : 'Finish the session';
   $('#qbox').appendChild(nxt);
   nxt.onclick = function(){
    if (step < HIJACK.length - 1){ step++; hint.textContent = ''; hint.className = 'fb'; draw(); ask(); }
    else {
     STATS.energy = energy; saveStats();
     hint.className = 'fb good';
     hint.innerHTML = 'Session over. You finished with <b>'+energy+'%</b> cell energy.';
     $('#qbox').innerHTML = '';
     finish(2);
    }
   };
  }
  start();
  pb.scrollIntoView({block:'nearest'});
 }
};