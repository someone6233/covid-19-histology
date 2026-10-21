/* ======================================================================
   Track 1: Meet the Cell
   Tap the cell parts (nucleus, membrane, mitochondria, cytoplasm).
   ====================================================================== */
'use strict';

T[0]=function(){
 var st=$('#stage');
 var parts=CELL_PARTS;
 var rec='';
 for(var i=0;i<14;i++){var a=i/14*Math.PI*2,c=Math.cos(a),s=Math.sin(a);
  rec+='<line x1="'+(300+c*276)+'" y1="'+(210+s*181)+'" x2="'+(300+c*292)+'" y2="'+(210+s*196)+'" stroke="#3CDDC6" stroke-width="4" stroke-linecap="round"/><circle cx="'+(300+c*296)+'" cy="'+(210+s*200)+'" r="5" fill="#3CDDC6"/>';}
 function mito(x,y,r){return '<g transform="translate('+x+' '+y+') rotate('+r+')"><ellipse rx="44" ry="22" fill="#FF9B6A" stroke="#FFD0B5" stroke-width="4"/><path d="M-30 0 q8 -14 15 0 t15 0 t15 0 t15 0" fill="none" stroke="#B8532D" stroke-width="4" stroke-linecap="round"/></g>';}
 function badge(k,x,y){return '<g class="badge" data-b="'+k+'" pointer-events="none"><circle class="ring" cx="'+x+'" cy="'+y+'" r="14" fill="#FFD166"/><circle cx="'+x+'" cy="'+y+'" r="14" fill="#FFD166"/><text x="'+x+'" y="'+(y+6)+'">?</text></g>';}
 st.innerHTML='<div class="two"><div class="card art"><svg viewBox="0 0 600 420" role="group" aria-label="Diagram of an animal cell. Tap each part.">'+rec+
  '<g class="hot" data-k="cytoplasm" tabindex="0" role="button" aria-label="Cytoplasm"><ellipse cx="300" cy="210" rx="262" ry="167" fill="#1F4B5C"/></g>'+
  '<g class="hot" data-k="nucleus" tabindex="0" role="button" aria-label="Nucleus"><circle cx="300" cy="205" r="72" fill="#4C3FA3" stroke="#8B7BFF" stroke-width="5"/><circle cx="322" cy="190" r="24" fill="#2D2470"/><path d="M250 225 q10 -12 20 0 M265 245 q10 -10 20 0 M330 238 q10 -12 20 0" fill="none" stroke="#8B7BFF" stroke-width="3" stroke-linecap="round"/></g>'+
  '<g class="hot" data-k="mito" tabindex="0" role="button" aria-label="Mitochondria">'+mito(150,150,-35)+mito(455,285,25)+mito(170,305,30)+'</g>'+
  '<g class="hot" data-k="membrane" tabindex="0" role="button" aria-label="Cell membrane"><ellipse cx="300" cy="210" rx="270" ry="175" fill="none" stroke="#3CDDC6" stroke-width="14"/><ellipse cx="300" cy="210" rx="270" ry="175" fill="none" stroke="transparent" stroke-width="40"/></g>'+
  badge('nucleus',300,205)+badge('membrane',300,35)+badge('cytoplasm',455,170)+badge('mito',150,150)+
  '</svg></div><div class="side-col" style="display:flex;flex-direction:column;gap:12px;min-width:0"><div class="card" id="info"><p>Tap a glowing <b>?</b> to meet a part of the cell. Find all four.</p></div><div class="pills" id="pl4"></div></div></div>';
 var found={};
 function pills(){$('#pl4').innerHTML=Object.keys(parts).map(function(k){return '<span class="pill'+(found[k]?' on':'')+'">'+parts[k].name+'</span>';}).join('');}
 pills();
 st.addEventListener('click',function(e){
  var h=e.target.closest('.hot');if(!h)return;
  var k=h.getAttribute('data-k'),p=parts[k];found[k]=1;
  $('#info').innerHTML='<h3>'+p.name+'</h3><span class="chip job">What it does</span><p>'+p.job+'</p><span class="chip tw">COVID-19 twist</span><p>'+p.tw+'</p>';
  var b=$('[data-b="'+k+'"]');if(b){b.classList.add('ok');b.querySelector('text').textContent='✓';}
  pills();
  if(Object.keys(found).length===4){finish(0);}
 });
};
