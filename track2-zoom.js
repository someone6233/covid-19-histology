/* ======================================================================
   Track 2: Zoom Out
   Cell, tissue, organ, organ system, then the ordering challenge.
   ====================================================================== */
'use strict';

T[1]=function(){
 var st=$('#stage');
 var S=ZOOM_LEVELS;
 function lab(x,y,t,x2,y2,anc){return '<text class="lb" x="'+x+'" y="'+y+'" text-anchor="'+(anc||'start')+'">'+t+'</text>'+(x2?'<line class="lbl" x1="'+x2[0]+'" y1="'+x2[1]+'" x2="'+x2[2]+'" y2="'+x2[3]+'"/>':'');}
 var LL='M280 110 C225 100 165 150 145 235 C130 295 160 322 215 320 C258 318 280 290 280 250 Z';
 var RL='M320 110 C375 100 435 150 455 235 C470 295 440 322 385 320 C342 318 320 290 320 250 Z';
 function svg(i){
  var s='<svg viewBox="0 0 600 350" role="img" aria-label="'+S[i].k+' diagram">';
  if(i===0){
   s+='<ellipse cx="300" cy="170" rx="210" ry="115" fill="#F2B8C6" stroke="#C7708A" stroke-width="9"/><ellipse cx="300" cy="170" rx="58" ry="46" fill="#5B3A9A"/><circle cx="312" cy="160" r="14" fill="#3C2470"/>'+
    lab(16,70,'Cell membrane',[60,78,103,131])+lab(440,318,'Cytoplasm',[470,300,425,215])+lab(390,40,'Nucleus',[410,48,340,135]);
  }else if(i===1){
   for(var r=0;r<4;r++)for(var c=0;c<6;c++){var x=18+c*82+(r%2?41:0),y=30+r*62,hi=(r===1&&c===2);
    s+='<rect x="'+x+'" y="'+y+'" width="74" height="52" rx="18" fill="#F2B8C6" stroke="'+(hi?'#FFD166':'#C7708A')+'" stroke-width="'+(hi?5:3)+'"/><ellipse cx="'+(x+37)+'" cy="'+(y+26)+'" rx="11" ry="8" fill="#5B3A9A"/>';}
   s+=lab(300,318,'Many similar cells combined = a tissue',null,'middle')+lab(300,336,'Gold outline: one cell',null,'middle').replace('class="lb"','class="lb" style="font-weight:500;fill:#FFD166"');
  }else if(i===2){
   s+='<rect x="292" y="26" width="16" height="104" rx="8" fill="#8FB8D8"/><path d="M300 128 C296 160 270 180 245 205 M300 128 C304 160 330 180 355 205 M258 192 L225 214 M342 192 L375 214" stroke="#8FB8D8" stroke-width="9" stroke-linecap="round" fill="none"/>'+
    '<path d="'+LL+'" fill="#F29DB0" fill-opacity=".85" stroke="#C7708A" stroke-width="5"/><path d="'+RL+'" fill="#F29DB0" fill-opacity=".85" stroke="#C7708A" stroke-width="5"/>'+
    '<circle cx="405" cy="255" r="30" fill="none" stroke="#FFD166" stroke-width="4" stroke-dasharray="7 6"/>'+
    lab(326,50,'Trachea (windpipe)')+lab(470,200,'Lung tissue lives here',[470,208,432,240])+lab(300,342,'The lungs = an organ',null,'middle');
  }else{
   s+='<circle cx="300" cy="52" r="34" fill="#F2B8C6" stroke="#C7708A" stroke-width="5"/><path d="M334 52 l12 8 l-12 4" fill="#F2B8C6" stroke="#C7708A" stroke-width="4" stroke-linejoin="round"/>'+
    '<path class="flow" d="M300 8 L300 150" stroke="#3CDDC6" stroke-width="5" fill="none"/><rect x="293" y="86" width="14" height="70" rx="7" fill="#8FB8D8"/>'+
    '<g transform="translate(300 130) scale(.6) translate(-300 -110)"><path d="'+LL+'" fill="#F29DB0" stroke="#C7708A" stroke-width="7"/><path d="'+RL+'" fill="#F29DB0" stroke="#C7708A" stroke-width="7"/></g>'+
    '<path d="M185 262 Q300 304 415 262" fill="none" stroke="#FFD166" stroke-width="8" stroke-linecap="round"/>'+
    lab(352,40,'Nose and mouth')+lab(326,120,'Windpipe')+lab(430,185,'Lungs',[428,180,385,190])+lab(300,306,'Diaphragm (breathing muscle)',null,'middle')+'<rect x="12" y="12" width="196" height="36" rx="10" fill="rgba(60,221,198,.12)" stroke="#3CDDC6" stroke-width="2.5"/><text class="lb" x="110" y="36" text-anchor="middle">Respiratory system</text>'+lab(318,14,'Air in').replace('class="lb"','class="lb" style="fill:#3CDDC6"');
  }
  return s+'</svg>';
 }
 st.innerHTML='<div class="two"><div class="card art" id="zsvg"></div><div style="display:flex;flex-direction:column;gap:12px;min-width:0"><div class="seg">'+S.map(function(s,i){return '<button class="segb" data-z="'+i+'">'+s.k+'</button>';}).join('')+'</div><div><input id="zr" type="range" min="0" max="3" step="1" value="0" aria-label="Zoom level"><div class="rl"><span>Zoomed in</span><span>Zoomed out</span></div></div><div class="card" id="ztxt"></div></div></div><div id="order" hidden></div>';
 var seen={};
 function show(i){
  $('#zsvg').innerHTML=svg(i);$('#zr').value=i;
  $$('.segb').forEach(function(b){b.classList.toggle('on',+b.getAttribute('data-z')===i);});
  $('#ztxt').innerHTML='<h3>'+S[i].k+'</h3><p>'+S[i].tx+'</p><span class="chip tw">COVID-19 twist</span><p>'+S[i].tw+'</p>';
  seen[i]=1;if(Object.keys(seen).length===4&&$('#order').hidden){buildOrder();}
 }
 $('#zr').addEventListener('input',function(e){show(+e.target.value);});
 st.addEventListener('click',function(e){var b=e.target.closest('[data-z]');if(b)show(+b.getAttribute('data-z'));});
 function buildOrder(){
  var o=$('#order');o.hidden=false;
  var items=shuffle([{k:'Organ system',s:'Respiratory system',r:3},{k:'Cell',s:'One lung lining cell',r:0},{k:'Organ',s:'The lungs',r:2},{k:'Tissue',s:'Lung lining',r:1}]);
  o.innerHTML='<div class="card"><h3>Your turn: put them in order</h3><p>Tap from smallest to biggest.</p><div class="ord">'+items.map(function(it){return '<button class="ordb" data-r="'+it.r+'"><span class="bn"></span><b>'+it.k+'</b><span>'+it.s+'</span></button>';}).join('')+'</div><p class="fb" id="ofb"></p></div>';
  var nxt=0;
  o.onclick=function(e){
   var b=e.target.closest('.ordb');if(!b||b.classList.contains('set'))return;
   if(+b.getAttribute('data-r')===nxt){
    b.classList.add('set');b.querySelector('.bn').textContent=nxt+1;nxt++;
    var f=$('#ofb');
    if(nxt===4){f.className='fb good';f.textContent='Correct! Cell, tissue, organ, organ system.';finish(1);}else{f.className='fb good';f.textContent='Yes. What comes next?';}
   }else{
    b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');
    var f2=$('#ofb');f2.className='fb bad';f2.textContent='Not that one. Which of the rest is smallest?';
   }
  };
 }
 show(0);
};
