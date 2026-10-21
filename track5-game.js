/* ======================================================================
   Track 5: Defense Squad
   The 45 second canvas game.
   ====================================================================== */
'use strict';

T[4]=function(){
 var st=$('#stage');
 st.innerHTML='<div class="card"><h3>How to play</h3><p>Viruses fall onto the lung lining. <b>Tap a virus</b> to stop it with antibodies. If a cell turns red, <b>tap it</b> so a killer T cell removes it before it bursts. Lost cells grow back, because lungs can repair themselves.</p></div>'+
  '<div class="gamewrap"><canvas id="gc" aria-label="Lung defense game"></canvas><div class="hud"><span id="g-time">45s</span><span id="g-score">Viruses stopped: 0</span><span id="g-health">Lung health: 100%</span></div>'+
  '<div class="ov" id="g-ov"><div class="card"><h3>Defense Squad</h3><p>Protect the lung lining for 45 seconds. Use the power-ups below when you need them.</p><button class="btn pri" id="g-go">Start</button></div></div></div>'+
  '<div class="btnrow"><button class="btn ghost" id="pu-mask" title="Blocks about half of the viruses for 8 seconds">Mask</button><button class="btn ghost" id="pu-boost" title="Antibodies pop viruses by themselves for 8 seconds">Vaccine boost</button></div>';
 var cv=$('#gc'),ctx=cv.getContext('2d'),TAU=Math.PI*2;
 var W=300,H=300,dpr=1,cells=[],vir=[],fx=[],raf=0,run=false,tleft=45,spawnT=0,score=0,mask=0,boost=0,maskCd=0,boostCd=0,boostT=0,last=0;
 var COLS=6,ROWS=3;
 function fit(){var r=cv.getBoundingClientRect();dpr=Math.min(2,window.devicePixelRatio||1);W=Math.max(200,r.width);H=Math.max(200,r.height);cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
 function cpos(c){var gw=W/COLS,gy0=H*0.56,gh=(H*0.4)/ROWS;return{x:(c.c+0.5)*gw,y:gy0+(c.r+0.5)*gh,rad:Math.min(gw,gh)*0.42};}
 function reset(){cells=[];for(var r=0;r<ROWS;r++)for(var c=0;c<COLS;c++)cells.push({c:c,r:r,s:'ok',t:0});vir=[];fx=[];tleft=45;score=0;mask=0;boost=0;maskCd=0;boostCd=0;boostT=0;spawnT=0.5;}
 function health(){return Math.round(cells.reduce(function(a,c){return a+(c.s==='ok'?1:c.s==='inf'?0.5:0);},0)/cells.length*100);}
 function pop(v){v.dead=true;score++;fx.push({x:v.x,y:v.y,t:0,col:'#3CDDC6'});}
 function burst(c){var p=cpos(c);for(var k=0;k<2;k++){vir.push({x:p.x,y:p.y,vx:(Math.random()-0.5)*90,vy:(Math.random()-0.3)*H*0.18,r:13});}c.s='gone';c.t=8;}
 function step(dt){
  tleft-=dt;mask=Math.max(0,mask-dt);boost=Math.max(0,boost-dt);maskCd=Math.max(0,maskCd-dt);boostCd=Math.max(0,boostCd-dt);
  spawnT-=dt;
  if(spawnT<=0){spawnT=Math.max(0.55,1.2-(45-tleft)*0.014);vir.push({x:20+Math.random()*(W-40),y:-10,vx:(Math.random()-0.5)*30,vy:H*(0.14+Math.random()*0.08),r:13});}
  if(boost>0){boostT-=dt;if(boostT<=0){boostT=0.55;var nv=null;vir.forEach(function(v){if(!v.dead&&(!nv||v.y>nv.y))nv=v;});if(nv)pop(nv);}}
  vir.forEach(function(v){
   if(v.dead)return;
   v.x+=v.vx*dt;v.y+=v.vy*dt;if(v.x<10||v.x>W-10)v.vx*=-1;
   for(var i=0;i<cells.length;i++){var c=cells[i];if(c.s!=='ok')continue;var p=cpos(c);
    if(Math.hypot(v.x-p.x,v.y-p.y)<p.rad+v.r*0.6){v.dead=true;if(mask>0&&Math.random()<0.5){fx.push({x:v.x,y:v.y,t:0,col:'#FFD166'});}else{c.s='inf';c.t=7;}break;}}
   if(v.y>H+20)v.dead=true;
  });
  vir=vir.filter(function(v){return !v.dead;});
  cells.forEach(function(c){
   if(c.s==='inf'){c.t-=dt;if(c.t<=0)burst(c);}
   else if(c.s==='gone'){c.t-=dt;if(c.t<=0){c.s='ok';var p=cpos(c);fx.push({x:p.x,y:p.y,t:0,col:'#3CDDC6'});}}
  });
  fx.forEach(function(f){f.t+=dt;});fx=fx.filter(function(f){return f.t<0.5;});
  if(tleft<=0)end();
 }
 function drawVirus(v){
  var n=8,i,a;ctx.strokeStyle='#FF5D7A';ctx.lineWidth=3;
  for(i=0;i<n;i++){a=i*TAU/n;ctx.beginPath();ctx.moveTo(v.x+Math.cos(a)*v.r,v.y+Math.sin(a)*v.r);ctx.lineTo(v.x+Math.cos(a)*(v.r+6),v.y+Math.sin(a)*(v.r+6));ctx.stroke();}
  ctx.fillStyle='#FF5D7A';ctx.beginPath();ctx.arc(v.x,v.y,v.r,0,TAU);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(v.x-4,v.y-2,3.2,0,TAU);ctx.arc(v.x+4,v.y-2,3.2,0,TAU);ctx.fill();
  ctx.fillStyle='#2A1233';ctx.beginPath();ctx.arc(v.x-3.4,v.y-2,1.5,0,TAU);ctx.arc(v.x+4.6,v.y-2,1.5,0,TAU);ctx.fill();
 }
 function draw(){
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(242,184,198,.08)';ctx.fillRect(0,H*0.54,W,H*0.46);
  ctx.fillStyle='#A9A4C4';ctx.font='600 13px system-ui,sans-serif';ctx.fillText('Lung lining tissue',12,H*0.54-6);
  cells.forEach(function(c){
   var p=cpos(c);ctx.beginPath();ctx.arc(p.x,p.y,p.rad,0,TAU);
   if(c.s==='ok'){ctx.fillStyle='#1F4B5C';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='#3CDDC6';ctx.stroke();ctx.beginPath();ctx.arc(p.x,p.y,p.rad*0.38,0,TAU);ctx.fillStyle='#8B7BFF';ctx.fill();}
   else if(c.s==='inf'){
    var k=0.5+0.5*Math.sin(performance.now()/120);
    ctx.fillStyle='#6B2A45';ctx.fill();ctx.lineWidth=3+k*2;ctx.strokeStyle='#FF5D7A';ctx.stroke();
    ctx.fillStyle='#FF5D7A';[[-0.35,-0.2],[0.3,-0.3],[0,0.3]].forEach(function(o){ctx.beginPath();ctx.arc(p.x+o[0]*p.rad,p.y+o[1]*p.rad,p.rad*0.16,0,TAU);ctx.fill();});
    ctx.beginPath();ctx.arc(p.x,p.y,p.rad+6,-Math.PI/2,-Math.PI/2+TAU*(c.t/7));ctx.strokeStyle='#FFD166';ctx.lineWidth=3;ctx.stroke();
   }else{ctx.setLineDash([5,5]);ctx.lineWidth=2;ctx.strokeStyle='rgba(169,164,196,.5)';ctx.stroke();ctx.setLineDash([]);}
  });
  vir.forEach(drawVirus);
  fx.forEach(function(f){ctx.beginPath();ctx.arc(f.x,f.y,8+f.t*60,0,TAU);ctx.strokeStyle=f.col;ctx.globalAlpha=Math.max(0,1-f.t/0.5);ctx.lineWidth=3;ctx.stroke();ctx.globalAlpha=1;});
  ctx.fillStyle='#FFD166';ctx.font='700 13px system-ui,sans-serif';
  var y0=H*0.54-6,txt=[];if(mask>0)txt.push('Mask on');if(boost>0)txt.push('Antibody boost');
  if(txt.length)ctx.fillText(txt.join(' + '),W-12-ctx.measureText(txt.join(' + ')).width,y0);
 }
 function hud(){
  $('#g-time').textContent=Math.max(0,Math.ceil(tleft))+'s';
  $('#g-score').textContent='Viruses stopped: '+score;
  $('#g-health').textContent='Lung health: '+health()+'%';
  var m=$('#pu-mask'),b=$('#pu-boost');
  m.disabled=!run||maskCd>0;b.disabled=!run||boostCd>0;
  m.textContent=maskCd>0?'Mask ('+Math.ceil(maskCd)+'s)':'Mask';
  b.textContent=boostCd>0?'Vaccine boost ('+Math.ceil(boostCd)+'s)':'Vaccine boost';
 }
 function loop(ts){
  var dt=Math.min(0.05,(ts-last)/1000||0);last=ts;
  step(dt);draw();hud();
  if(run)raf=requestAnimationFrame(loop);
 }
 function end(){
  run=false;
  var hp=health(),msg=hp>=75?'Your defense held strong.':hp>=40?'Tough fight. The tissue was damaged but kept going.':'The virus got ahead of you. In real life, vaccines help your body get ready before the virus arrives.';
  var ov=$('#g-ov');ov.hidden=false;
  ov.innerHTML='<div class="card"><h3>Lung health: '+hp+'%</h3><p>'+msg+' You stopped '+score+' viruses.</p><p>Real lungs can heal too. After the infection clears, the body grows new lining cells to replace the damaged ones.</p><button class="btn pri" id="g-go">Play again</button></div>';
  finish(4);hud();
 }
 function start(){reset();$('#g-ov').hidden=true;run=true;last=performance.now();raf=requestAnimationFrame(loop);}
 st.addEventListener('click',function(e){if(e.target.closest('#g-go'))start();});
 cv.addEventListener('pointerdown',function(e){
  if(!run)return;
  var r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,best=null,bd=1e9;
  vir.forEach(function(v){var d=Math.hypot(v.x-x,v.y-y);if(d<v.r+14&&d<bd){bd=d;best=v;}});
  if(best){pop(best);return;}
  for(var i=0;i<cells.length;i++){var c=cells[i];if(c.s!=='inf')continue;var p=cpos(c);
   if(Math.hypot(p.x-x,p.y-y)<p.rad+6){c.s='gone';c.t=6;fx.push({x:p.x,y:p.y,t:0,col:'#FFD166'});return;}}
 });
 $('#pu-mask').onclick=function(){if(run&&maskCd<=0){mask=8;maskCd=18;}};
 $('#pu-boost').onclick=function(){if(run&&boostCd<=0){boost=8;boostCd=20;boostT=0;}};
 reset();fit();hud();
 window.addEventListener('resize',fit);
 cleanup=function(){run=false;cancelAnimationFrame(raf);window.removeEventListener('resize',fit);};
};
