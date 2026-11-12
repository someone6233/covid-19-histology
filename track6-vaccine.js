/* ======================================================================
   Track 7: Race to a Vaccine (fictional)
   Students run a made-up race against a spreading virus. They choose
   each step of making a vaccine (create, formulate, distribute). Every
   choice takes months. Finish before the virus has spread too far.
   Each step and each choice is a picture. Months are shown as calendar
   tiles. Short labels (s) and icon names (ic) live in config.js.
   ====================================================================== */
'use strict';

T[6] = function(){
 var st = $('#stage');
 var step = 0, spent = 0;

 var VIAL = '<rect x="20" y="8" width="24" height="8" rx="3" fill="#F3F0FA"/><path d="M22 16h20v30a10 10 0 01-20 0z" fill="none" stroke="#F3F0FA" stroke-width="4" stroke-linejoin="round"/><path d="M23 34h18v12a9 9 0 01-18 0z" fill="#3CDDC6"/>';
 var DOC = '<rect x="10" y="6" width="36" height="46" rx="5" fill="#F3F0FA"/><path d="M17 18h22M17 26h22M17 34h14" stroke="#A9A4C4" stroke-width="3"/>';
 var FLASK = '<path d="M26 8h12M28 8v18L14 52a4 4 0 004 6h28a4 4 0 004-6L36 26V8" fill="none" stroke="#F3F0FA" stroke-width="4" stroke-linejoin="round"/><path d="M20 44h24l6 10a2 2 0 01-2 4H16a2 2 0 01-2-4z" fill="#8B7BFF"/><circle cx="30" cy="49" r="3" fill="#C9B8FF"/>';
 var PEOPLE = '<g fill="#F3F0FA"><circle cx="14" cy="26" r="6"/><circle cx="32" cy="22" r="6"/><circle cx="50" cy="26" r="6"/><path d="M4 56a10 10 0 0120 0zM22 52a10 10 0 0120 0zM40 56a10 10 0 0120 0z"/></g>';
 var ICONS = {
  /* steps (neutral pictures for the road and the heading) */
  s0:'<circle cx="32" cy="32" r="24" fill="none" stroke="#F3F0FA" stroke-width="4"/><circle cx="32" cy="32" r="14" fill="none" stroke="#FF5D7A" stroke-width="4"/><circle cx="32" cy="32" r="5" fill="#FFD166"/>',
  s1:DOC+'<path d="M40 46l14-14 6 6-14 14-8 2z" fill="#FFD166"/>',
  s2:FLASK,
  s3:PEOPLE,
  s4:VIAL,
  s5:DOC+'<circle cx="44" cy="44" r="12" fill="none" stroke="#FFD166" stroke-width="4"/>',
  s6:'<rect x="4" y="22" width="34" height="24" rx="3" fill="#F3F0FA"/><path d="M38 30h12l10 10v6H38z" fill="#8B7BFF"/><circle cx="16" cy="50" r="6" fill="#0E0D16" stroke="#F3F0FA" stroke-width="3"/><circle cx="48" cy="50" r="6" fill="#0E0D16" stroke="#F3F0FA" stroke-width="3"/>',
  /* choices */
  spike:'<circle cx="32" cy="42" r="14" fill="#FF5D7A"/><path d="M32 28V12M32 12l-8-6M32 12l8-6" stroke="#FFD166" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M19 36l-9-4M45 36l9-4M22 51l-6 7M42 51l6 7" stroke="#FF5D7A" stroke-width="4" stroke-linecap="round"/>',
  dna:'<path d="M20 6c0 14 24 14 24 26S20 46 20 58M44 6c0 14-24 14-24 26s24 14 24 26" stroke="#8B7BFF" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M24 14h16M22 32h20M24 50h16" stroke="#C9B8FF" stroke-width="4"/>',
  dice:'<rect x="10" y="10" width="44" height="44" rx="10" fill="#F3F0FA"/><g fill="#0E0D16"><circle cx="23" cy="23" r="4"/><circle cx="41" cy="23" r="4"/><circle cx="32" cy="32" r="4"/><circle cx="23" cy="41" r="4"/><circle cx="41" cy="41" r="4"/></g>',
  mrna:'<path d="M6 24q6-12 12 0t12 0t12 0t12 0" stroke="#3CDDC6" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="32" cy="46" r="12" fill="none" stroke="#8B7BFF" stroke-width="4"/><circle cx="32" cy="46" r="4" fill="#8B7BFF"/>',
  weak:'<circle cx="32" cy="32" r="16" fill="#FF5D7A" opacity=".5"/><path d="M32 16V8M32 56v-8M16 32H8M56 32h-8M21 21l-6-6M43 43l6 6M43 21l6-6M21 43l-6 6" stroke="#FF5D7A" stroke-width="4" stroke-linecap="round" opacity=".5"/><path d="M24 30h6M34 30h6" stroke="#0E0D16" stroke-width="3" stroke-linecap="round"/><path d="M26 40q6 4 12 0" stroke="#0E0D16" stroke-width="3" fill="none" stroke-linecap="round"/>',
  flask:FLASK,
  lab:'<path d="M14 14h10M16 14v12L8 46a3 3 0 003 5h18a3 3 0 003-5L22 26V14" fill="none" stroke="#F3F0FA" stroke-width="3.5" stroke-linejoin="round"/><path d="M12 42h14l4 6H8z" fill="#3CDDC6"/><ellipse cx="46" cy="44" rx="12" ry="9" fill="#F3F0FA"/><circle cx="55" cy="40" r="4" fill="#F3F0FA"/><circle cx="52" cy="33" r="4" fill="#C9B8FF"/><circle cx="50" cy="42" r="1.8" fill="#0E0D16"/><path d="M34 44q-6 6-8 12" stroke="#F3F0FA" stroke-width="2.5" fill="none"/>',
  skip:'<path d="M10 16l22 16-22 16zM32 16l22 16-22 16z" fill="#F3F0FA"/><path d="M8 8l48 48M56 8L8 56" stroke="#FF5D7A" stroke-width="6" stroke-linecap="round"/>',
  phases:'<rect x="6" y="40" width="14" height="18" rx="3" fill="#3CDDC6" opacity=".5"/><rect x="25" y="28" width="14" height="30" rx="3" fill="#3CDDC6" opacity=".75"/><rect x="44" y="12" width="14" height="46" rx="3" fill="#3CDDC6"/><g font-size="12" font-weight="800" fill="#06221e" text-anchor="middle"><text x="13" y="54">1</text><text x="32" y="54">2</text><text x="51" y="54">3</text></g>',
  crowd:'<path d="M32 4l12 20H20z" fill="#FFD166"/><path d="M32 11v7" stroke="#0E0D16" stroke-width="3"/><circle cx="32" cy="21" r="1.6" fill="#0E0D16"/><g fill="#F3F0FA"><circle cx="12" cy="38" r="5"/><circle cx="26" cy="38" r="5"/><circle cx="40" cy="38" r="5"/><circle cx="54" cy="38" r="5"/><circle cx="19" cy="50" r="5"/><circle cx="33" cy="50" r="5"/><circle cx="47" cy="50" r="5"/><circle cx="12" cy="60" r="3"/><circle cx="26" cy="60" r="3"/><circle cx="40" cy="60" r="3"/><circle cx="54" cy="60" r="3"/></g>',
  vial:VIAL+'<circle cx="48" cy="46" r="11" fill="#3CDDC6" stroke="#0E0D16" stroke-width="3"/><path d="M43 46l4 4 7-8" stroke="#06221e" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  rush:VIAL+'<path d="M42 38l14 14M56 38L42 52" stroke="#FF5D7A" stroke-width="5" stroke-linecap="round"/><path d="M4 22h10M2 32h10M4 42h10" stroke="#A9A4C4" stroke-width="3" stroke-linecap="round"/>',
  eua:DOC+'<circle cx="44" cy="44" r="13" fill="#FFD166" stroke="#0E0D16" stroke-width="3"/><path d="M46 35l-8 11h6l-2 8 9-12h-6z" fill="#0E0D16"/>',
  wait:DOC+'<circle cx="44" cy="45" r="14" fill="#0E0D16" stroke="#FFD166" stroke-width="3"/><path d="M38 37h12M38 53h12M40 37c0 6 4 7 4 8s-4 2-4 8M48 37c0 6-4 7-4 8s4 2 4 8" stroke="#FFD166" stroke-width="3" fill="none" stroke-linecap="round"/>',
  cold:'<circle cx="20" cy="22" r="8" fill="#FF5D7A"/><path d="M6 54a14 14 0 0128 0z" fill="#FF5D7A"/><g stroke="#8FD3FF" stroke-width="3.5" stroke-linecap="round"><path d="M46 28v28M34 42h24M37 33l18 18M55 33L37 51"/></g><circle cx="10" cy="10" r="8" fill="#FFD166"/><text x="10" y="14" text-anchor="middle" font-size="11" font-weight="800" fill="#0E0D16">1</text>',
  hands:PEOPLE+'<path d="M12 36L6 14M32 32V8M52 36l6-22" stroke="#FF5D7A" stroke-width="3" stroke-linecap="round"/>'
 };
 function ic(k, sz){ return '<svg viewBox="0 0 64 64" width="'+sz+'" height="'+sz+'" aria-hidden="true">'+(ICONS[k] || '')+'</svg>'; }
 function tiles(n, cls){ var s = ''; for (var i = 0; i < n; i++) s += '<i class="mon '+(cls || '')+'"></i>'; return s; }
 /* "Step 1: Find the target. Which part...?" -> heading + short question */
 function parts(q){ var m = q.match(/^Step \d+: ([^.]*)\.\s*(.*)$/); return m ? {h:m[1], k:m[2]} : {h:'', k:q}; }

 st.innerHTML = '<div class="card"><h3>Vaccine</h3>'+
  '<p>The here steps follow the order a vaccine would be made. Each choice that is going to be given takes some months. Try and finish all 7 steps before the virus spreads too far :).</p>'+
  '<div class="vroad" id="vroad"></div>'+
  '<div class="meter"><span>Months used: <b id="vm"></b> of '+VACCINE_BUDGET+'</span><div class="tiles" id="vt"></div></div>'+
  '<div class="pills" id="vacts"></div></div>'+
  '<div class="card" id="vcard"></div>';

 function meter(){
  var total = Math.max(VACCINE_BUDGET, spent), t = '';
  for (var i = 0; i < total; i++) t += '<i class="mon '+(i < spent ? (i >= VACCINE_BUDGET ? 'over' : 'used') : '')+'"></i>';
  $('#vt').innerHTML = t;
  $('#vm').textContent = spent + (spent > VACCINE_BUDGET ? ' (virus is ahead of you)' : '');
 }

 function draw(){
  var q = VACCINE_GAME[step], p = parts(q.q);
  meter();
  $('#vroad').innerHTML = VACCINE_GAME.map(function(g, i){
   return (i ? '<i class="vl"></i>' : '')+'<span class="vn'+(i < step ? ' ok' : i === step ? ' on' : '')+'" title="'+parts(g.q).h+'">'+(i < step ? I.check : ic('s' + i, 28))+'</span>';
  }).join('');
  $('#vacts').innerHTML = VACCINE_ACTS.map(function(a, i){ return '<span class="pill'+(i === q.act ? ' on' : '')+'">'+a+'</span>'; }).join('');
  var order = shuffle(q.opts.map(function(o, i){ return i; }));
  $('#vcard').innerHTML = '<p class="eyebrow">Step '+(step + 1)+' of '+VACCINE_GAME.length+' · '+VACCINE_ACTS[q.act]+'</p>'+
   '<div class="vhead">'+ic('s' + step, 56)+'<div><h3>'+p.h+'</h3><p class="meta">'+p.k+'</p></div></div>'+
   '<div class="vopts">'+order.map(function(i){
    var o = q.opts[i];
    return '<button class="opt vopt" data-o="'+i+'" title="'+o.t+'" aria-label="'+o.t+'">'+ic(o.ic, 64)+'<b>'+o.s+'</b></button>';
   }).join('')+'</div>'+
   '<p class="fb" id="vfb">Choose one option.</p>';
 }

 function result(){
  var left = VACCINE_BUDGET - spent;
  var card = $('#vcard');
  if (left >= 0){
   STATS.vaccine = left; saveStats();
   card.innerHTML = '<p class="eyebrow">Vaccine delivered</p><h3>You finished with '+(left === 0 ? 'no months to spare. Nice work!' : left+(left === 1 ? ' month' : ' months')+' to spare.')+'</h3>'+
    (left ? '<div class="tiles">'+tiles(left, 'spare')+'</div>' : '')+
    '<p></p>';
  } else {
   STATS.vaccine = -1; saveStats();
   card.innerHTML = '<p class="eyebrow">Too late</p><h3>The virus spread first. You went over by '+(-left)+(-left === 1 ? ' month' : ' months')+'.</h3>'+
    '<div class="tiles">'+tiles(-left, 'over')+'</div>'+
    '<p>Look at the steps where one choice took much longer than another.</p>';
  }
  finish(6);
 }

 st.addEventListener('click', function(e){
  if (e.target.closest('#vnext')){
   if (step < VACCINE_GAME.length - 1){ step++; draw(); } else { result(); }
   return;
  }
  var b = e.target.closest('[data-o]'); if (!b || b.disabled) return;
  if (b.closest('.vopts').querySelector('[disabled]')) return;
  var q = VACCINE_GAME[step], o = q.opts[+b.getAttribute('data-o')];
  spent += o.m;
  $$('.vopt').forEach(function(x){
   x.disabled = true;
   var opt = q.opts[+x.getAttribute('data-o')];
   if (opt.ok) x.classList.add('right');
   x.insertAdjacentHTML('beforeend', '<span class="tiles">'+tiles(opt.m, 'used')+'</span>');
  });
  if (!o.ok) b.classList.add('wrong');
  var fb = $('#vfb');
  fb.className = 'fb ' + (o.ok ? 'good' : 'bad');
  fb.innerHTML = (o.ok ? 'Good choice :). ' : 'That choice cost time :(. ') + 'It took ' + o.m + (o.m === 1 ? ' month. ' : ' months. ') + o.why;
  meter();
  $('#vcard').insertAdjacentHTML('beforeend', '<div class="btnrow"><button class="btn pri" id="vnext">'+(step < VACCINE_GAME.length - 1 ? 'Next step' : 'See the result')+'</button></div>');
 });

 draw();
};