/* ======================================================================
   Track 3: Knock Knock
   ACE2 key and lock, then the step by step takeover animation.
   ====================================================================== */
'use strict';

T[2]=function(){
 var st=$('#stage');
 var TIP={
  a:'<polygon points="0,-13 -9,0 9,0" fill="#FF5D7A"/>',
  b:'<rect x="-9" y="-14" width="18" height="14" fill="#FF5D7A"/>',
  c:'<circle cx="0" cy="-8" r="8" fill="#FF5D7A"/>'
 };
 var TARGET={a:119,b:134,c:136};
 function keyVirus(x,y,t){
  var s='',up=[-160,-125,-90,-55,-20],dn=[20,55,90,125,160];
  up.concat(dn).forEach(function(d,i){
   var a=d*Math.PI/180,x1=x+Math.cos(a)*34,y1=y+Math.sin(a)*34,x2=x+Math.cos(a)*56,y2=y+Math.sin(a)*56;
   s+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#FF5D7A" stroke-width="4" stroke-linecap="round"/>';
   if(i<5){s+='<g transform="translate('+x2+' '+y2+') rotate('+(d+90)+')">'+TIP[t]+'</g>';}else{s+='<circle cx="'+x2+'" cy="'+y2+'" r="5" fill="#FF5D7A"/>';}
  });
  return s+'<circle cx="'+x+'" cy="'+y+'" r="34" fill="#FF5D7A"/><circle cx="'+(x-10)+'" cy="'+(y-12)+'" r="6" fill="#fff" opacity=".25"/>';
 }
 var order=shuffle(['a','b','c']),xs=[110,300,490];
 var vs=order.map(function(t,i){return '<g class="kv" data-t="'+t+'" data-x="'+xs[i]+'" tabindex="0" role="button" aria-label="Try virus '+(i+1)+'">'+keyVirus(xs[i],250,t)+'</g>';}).join('');
 var lbs=order.map(function(t,i){return '<text class="lb" x="'+xs[i]+'" y="322" text-anchor="middle" id="kl'+t+'">Virus '+(i+1)+'</text>';}).join('');
 st.innerHTML='<div class="card"><h3>Part 1: Find the key that fits</h3><p>The cell membrane has a lock called <b>ACE2</b>. Tap a virus to test whether its spikes fit.</p></div>'+
  '<div class="card art"><svg viewBox="0 0 600 330" id="ksvg" role="group" aria-label="One ACE2 lock on the cell membrane and three viruses to test">'+
  '<rect x="0" y="0" width="600" height="28" fill="#3CDDC6"/><polygon points="270,28 270,62 288,62 300,46 312,62 330,62 330,28" fill="#2A8F84" stroke="#3CDDC6" stroke-width="3"/>'+
  '<text class="lb" x="346" y="52">ACE2 lock</text><text x="14" y="20" style="font-size:13px;font-weight:700;fill:#06221e">Cell membrane</text>'+vs+lbs+'</svg></div><p class="fb" id="kfb"></p>'+
  '<div id="partB" hidden></div>';
 var busy=false,solved=false;
 st.addEventListener('click',function(e){
  var g=e.target.closest('.kv');if(!g||busy||solved)return;
  var t=g.getAttribute('data-t'),x=+g.getAttribute('data-x'),dx=300-x,dy=TARGET[t]-250;
  busy=true;g.getAnimations().forEach(function(a){a.cancel();});
  var f=$('#kfb');f.className='fb';f.textContent='';
  var an=g.animate([{transform:'translate(0px,0px)'},{transform:'translate('+dx+'px,'+dy+'px)'}],{duration:800,easing:'ease-in-out',fill:'forwards'});
  an.onfinish=function(){
   if(t==='a'){
    solved=true;busy=false;
    $$('.kv').forEach(function(o){if(o!==g)o.style.opacity='.25';});
    $('#ksvg').insertAdjacentHTML('beforeend','<circle cx="300" cy="48" r="16" fill="none" stroke="#FFD166" stroke-width="4"/><text class="lb" x="300" y="100" style="display:none"></text>');
    var lb=$('#kl'+t);if(lb)lb.textContent='COVID-19 virus';
    f.className='fb good';f.textContent='Click! The spike fits ACE2 like a key in a lock. This is the COVID-19 virus.';
    buildB();
   }else{
    var back=g.animate([{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'translate('+(dx+10)+'px,'+(dy+6)+'px)'},{transform:'translate(0px,0px)'}],{duration:700,easing:'ease-out',fill:'forwards'});
    f.className='fb bad';f.textContent='No fit. Those spikes do not match the lock, so the virus bounces off.';
    back.onfinish=function(){busy=false;};
   }
  };
 });
 function buildB(){
  var pb=$('#partB');pb.hidden=false;
  var STEPS=TAKEOVER_STEPS;
  var pts=(function(){var a=[],s=7;function rnd(){s=(s*16807)%2147483647;return s/2147483647;}
   while(a.length<32){var x=300+(rnd()*2-1)*225,y=235+(rnd()*2-1)*80;
    if(Math.pow((x-300)/228,2)+Math.pow((y-235)/82,2)>1)continue;
    if(Math.hypot(x-180,y-240)<54||Math.hypot(x-430,y-245)<50||Math.hypot(x-300,y-235)<26)continue;
    a.push([x,y]);}
   return a;})();
  var counts=[1,2,4,8,16,32],step=0,ci=0;
  pb.innerHTML='<div class="card"><h3>Part 2: The takeover</h3></div><div class="two" style="margin-top:16px"><div class="card art"><svg id="sc" viewBox="0 0 600 340" role="img" aria-label="A virus entering a cell and making copies"></svg></div><div class="card"><div class="pills" id="sp"></div><h3 id="sh"></h3><p id="stx"></p><div class="meter"><span>Cell energy</span><div class="mbar"><span id="en"></span></div></div><div class="btnrow"><button class="btn ghost" id="sb">Back</button><button class="btn pri" id="sn">Next step</button><button class="btn" id="mk" hidden>Make copies</button></div></div></div>';
  function draw(){
   var s='<ellipse cx="300" cy="235" rx="255" ry="100" fill="'+(step===3?'#3B2A45':'#1F4B5C')+'" stroke="'+(step===3?'#FF5D7A':'#3CDDC6')+'" stroke-width="12"'+(step===3?' stroke-dasharray="38 24"':'')+'/>'+
    '<circle cx="180" cy="240" r="44" fill="#4C3FA3" stroke="#8B7BFF" stroke-width="4"/><circle cx="192" cy="230" r="14" fill="#2D2470"/>'+
    '<g transform="translate(430 245) rotate(15)"><ellipse rx="40" ry="20" fill="#FF9B6A" stroke="#FFD0B5" stroke-width="4"/><path d="M-26 0 q7 -12 13 0 t13 0 t13 0 t13 0" fill="none" stroke="#B8532D" stroke-width="4" stroke-linecap="round"/></g>';
   if(step===0){s+=virus(300,92,34,{n:12,len:14,face:true});}
   else if(step===1){s+=virus(300,235,20,{n:10,len:8,face:true});}
   else if(step===2){for(var i=0;i<counts[ci];i++){s+=virus(pts[i][0],pts[i][1],8,{n:8,len:4});}}
   else{
    for(var j=0;j<32;j++){var x=Math.max(14,Math.min(586,300+(pts[j][0]-300)*1.45)),y=Math.max(66,Math.min(326,235+(pts[j][1]-235)*2.1));s+=virus(x,y,8,{n:8,len:4});}
   }
   var cap=step===0?'A lung cell and a virus':step===1?'The virus is inside':step===2?counts[ci]+(counts[ci]===1?' virus':' viruses')+' in the cytoplasm':'Viruses spreading out';
   s+='<rect x="12" y="12" width="262" height="36" rx="10" fill="#171525" stroke="#3CDDC6" stroke-width="2.5"/><text class="lb" x="143" y="36" text-anchor="middle">'+cap+'</text>';
   $('#sc').innerHTML=s;
   $('#sh').textContent=STEPS[step].h;$('#stx').textContent=STEPS[step].t;
   $('#sp').innerHTML=STEPS.map(function(x,i){return '<span class="pill'+(i<=step?' on':'')+'">'+(i+1)+'</span>';}).join('');
   $('#en').style.width=(step===2?100-ci*18:step===3?8:100)+'%';
   $('#sb').disabled=step===0;$('#sn').disabled=step===3;
   var mk=$('#mk');mk.hidden=step!==2;mk.disabled=ci>=5;mk.textContent=ci>=5?'The cell is full!':'Make copies (x2)';
   if(step===3){finish(2);}
  }
  $('#sn').onclick=function(){if(step<3){step++;if(step===2)ci=0;draw();}};
  $('#sb').onclick=function(){if(step>0){step--;if(step===2)ci=0;draw();}};
  $('#mk').onclick=function(){if(ci<5){ci++;draw();}};
  draw();
  pb.scrollIntoView({block:'nearest'});
 }
};
