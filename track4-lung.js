/* ======================================================================
   Track 4: Lung Detective
   Healthy vs COVID-19 lung tissue and the four clues.
   ====================================================================== */
'use strict';

T[3]=function(){
 var st=$('#stage');
 var A=[150,125,68],B=[370,115,62],C=[250,285,70],D=[500,270,66];
 var rbc=[[262,108],[258,172],[335,200],[430,196],[385,288],[132,256],[572,150],[360,365]];
 function reds(){return rbc.map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="9" fill="#D4364A"/><circle cx="'+p[0]+'" cy="'+p[1]+'" r="3" fill="#F08A96"/>';}).join('');}
 function nuc(c,n,off){var s='';for(var k=0;k<n;k++){var a=(k/n*360+off)*Math.PI/180,x=c[0]+Math.cos(a)*c[2],y=c[1]+Math.sin(a)*c[2];s+='<ellipse cx="'+x+'" cy="'+y+'" rx="8" ry="4.5" fill="#5B3A9A" transform="rotate('+(k/n*360+off+90)+' '+x+' '+y+')"/>';}return s;}
 function lab(x,y,t,x2,y2){return (x2!==undefined?'<line class="ll" x1="'+x+'" y1="'+(y+6)+'" x2="'+x2+'" y2="'+y2+'"/>':'')+'<text class="lt" x="'+x+'" y="'+y+'">'+t+'</text>';}
 var healthy='<g class="hl">'+[A,B,C,D].map(function(c){return '<circle cx="'+c[0]+'" cy="'+c[1]+'" r="'+c[2]+'" fill="#FFFFFF" stroke="#C9708C" stroke-width="7"/>';}).join('')+
  nuc(A,8,10)+nuc(B,8,25)+nuc(C,9,5)+nuc(D,8,30)+reds()+
  lab(250,292,'Air sac')+lab(60,34,'Thin wall',100,72)+lab(262,38,'Red blood cell',262,98)+lab(520,200,'Lining cell',D[0]+30,D[1]-60)+'</g>';
 var imm='';for(var k=0;k<10;k++){var a=k/10*Math.PI*2+0.3,x=D[0]+Math.cos(a)*(D[2]+4),y=D[1]+Math.sin(a)*(D[2]+4);imm+='<circle cx="'+x+'" cy="'+y+'" r="10" fill="#5B3A9A" stroke="#C9B8FF" stroke-width="2.5"/><circle cx="'+(x-2)+'" cy="'+(y-2)+'" r="3.5" fill="#2D2470"/>';}
 [[490,262],[515,280],[480,288]].forEach(function(p){imm+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="9" fill="#5B3A9A" stroke="#C9B8FF" stroke-width="2.5"/>';});
 var debris='<circle cx="95" cy="95" r="4" fill="#6B5A78"/><circle cx="78" cy="140" r="5" fill="#6B5A78"/><circle cx="112" cy="165" r="4" fill="#6B5A78"/><circle cx="64" cy="112" r="3.5" fill="#6B5A78"/>';
 function hs(k,x,y,n,labsvg){return '<g class="hs" data-h="'+k+'" tabindex="0" role="button" aria-label="Clue '+n+'"><g class="lab">'+labsvg+'</g><circle class="ring" cx="'+x+'" cy="'+y+'" r="20" fill="none" stroke="#FFD166" stroke-width="4"/><circle class="bg" cx="'+x+'" cy="'+y+'" r="20" stroke="#2A1233" stroke-width="3"/><text x="'+x+'" y="'+(y+7)+'" text-anchor="middle" style="font-size:20px;font-weight:800;fill:#2A1233">'+n+'</text></g>';}
 var inf='<g class="inf">'+
  '<circle cx="'+A[0]+'" cy="'+A[1]+'" r="'+A[2]+'" fill="#FFFFFF" stroke="#B5557A" stroke-width="7" stroke-dasharray="60 26"/>'+debris+
  [B,C,D].map(function(c){return '<circle cx="'+c[0]+'" cy="'+c[1]+'" r="'+c[2]+'" fill="#BCD7F0" stroke="#B5557A" stroke-width="16"/>';}).join('')+
  '<circle cx="'+B[0]+'" cy="'+B[1]+'" r="'+(B[2]-9)+'" fill="#FFFFFF"/><path d="M'+(B[0]-B[2]+9)+' '+(B[1]+6)+' Q'+(B[0]-20)+' '+(B[1]-6)+' '+B[0]+' '+(B[1]+6)+' T'+(B[0]+B[2]-9)+' '+(B[1]+6)+' A'+(B[2]-9)+' '+(B[2]-9)+' 0 0 1 '+(B[0]-B[2]+9)+' '+(B[1]+6)+'Z" fill="#BCD7F0"/>'+
  imm+reds()+
  hs('fluid',C[0],C[1],1,lab(C[0],C[1]+50,'Fluid'))+
  hs('lining',72,170,2,lab(88,222,'Damaged lining',72,190))+
  hs('immune',D[0]+10,D[1]-20,3,lab(540,196,'Immune cells',D[0]+30,D[1]-70))+
  hs('wall',B[0],B[1]-B[2]-4,4,lab(B[0]+30,28,'Swollen wall'))+
  '</g>';
 var CL=TISSUE_CLUES;
 st.innerHTML='<div class="card"><h3>How scientists see tissue</h3><p>This is lung tissue under a microscope. Scientists stain it so the parts show up in different colors. Look at the healthy lung first. Then switch to the COVID-19 lung and find 4 clues.</p><div class="seg"><button class="segb on" data-v="h">1. Healthy lung</button><button class="segb" data-v="i">2. COVID-19 lung</button></div></div>'+
  '<div class="two wide"><div class="card art"><svg id="lsvg" viewBox="0 0 640 400" role="group" aria-label="Lung tissue under a microscope"><rect width="640" height="400" rx="10" fill="#F2A9BC"/>'+healthy+inf+'</svg></div><div style="display:flex;flex-direction:column;gap:12px;min-width:0"><div class="card" id="lt"></div><div class="card"><b>Clues to find</b><div class="pills" id="lp"></div></div></div></div>';
 var view='h',got={},svg=$('#lsvg');
 function pills(){$('#lp').innerHTML=Object.keys(CL).map(function(k,i){return '<span class="pill'+(got[k]?' on':'')+'">'+(i+1)+'. '+(got[k]?CL[k][0]:CL[k][3])+'</span>';}).join('');}
 function setView(v){
  view=v;
  $$('.segb').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-v')===v);});
  $('.hl',svg).style.display=v==='h'?'':'none';
  $('.inf',svg).style.display=v==='i'?'':'none';
  if(v==='h'){
   $('#lt').innerHTML='<h3>Healthy lung tissue</h3><div class="legend"><span><i style="background:#fff;border:2px solid #C9708C"></i>Air sac (full of air)</span><span><i style="background:#5B3A9A"></i>Lining cells</span><span><i style="background:#D4364A"></i>Red blood cells</span></div><p>Thin walls and empty air sacs let oxygen slip from the air into the blood. Remember how this looks, then tap <b>COVID-19 lung</b>.</p>';
  }else{
   $('#lt').innerHTML='<h3>What changed?</h3><div class="legend"><span><i style="background:#BCD7F0"></i>Fluid</span><span><i style="background:#5B3A9A"></i>Immune cells</span></div><p>Tap the gold numbers on the picture to investigate each clue.</p>';
  }
 }
 st.addEventListener('click',function(e){
  var sg=e.target.closest('[data-v]');if(sg){setView(sg.getAttribute('data-v'));return;}
  var h=e.target.closest('.hs');if(!h)return;
  var k=h.getAttribute('data-h'),c=CL[k];got[k]=1;h.classList.add('ok');
  $('#lt').innerHTML='<h3>'+c[0]+'</h3><span class="chip job">What changed</span><p>'+c[1]+'</p><span class="chip sy">Symptom link</span><p>'+c[2]+'</p>';
  pills();
  if(Object.keys(got).length===4){finish(3);}
 });
 pills();setView('h');
};
