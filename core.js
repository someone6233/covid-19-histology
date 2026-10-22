/* ======================================================================
   CORE
   Side library, player bar, album page, track page frame, and navigation.
   ====================================================================== */
'use strict';

/* ---------- Side library and bottom player ---------- */
function renderSide(){
 side.innerHTML='<div class="brand">'+coverSVG(36)+'<div><b>Under the Microscope</b><span>'+ARTIST+'</span></div></div>'+
 '<h2 class="slab">Your library</h2>'+
 '<button class="libitem'+(cur<0?' on':'')+'" data-go="-1">'+coverSVG(44)+'<span><b>Under the Microscope</b><i>Album: COVID-19</i></span></button>'+
 '<h2 class="slab">Tracks</h2><nav>'+TRACKS.map(function(t,i){return '<button class="libitem'+(cur===i?' on':'')+'" data-go="'+i+'"><span class="n">'+(done[i]?I.check:(i+1))+'</span><span><b>'+t.title+'</b></span></button>';}).join('')+'</nav>';
}
function renderPlayer(){
 var t=cur>=0?TRACKS[cur]:null,pct=Math.round(doneCount()/N*100);
 player.innerHTML='<div class="np">'+coverSVG(48)+'<div><b>'+(t?t.title:'Under the Microscope')+'</b><span>'+(t?('Track '+(cur+1)+' of '+N):ARTIST)+'</span></div></div>'+
 '<div class="ctl"><div class="btns"><button class="ic" data-step="-1" aria-label="Previous track">'+I.prev+'</button><button class="pl" data-play aria-label="'+(cur<0?'Play album':'Restart this track')+'">'+I.play+'</button><button class="ic" data-step="1" aria-label="Next track">'+I.next+'</button></div>'+
 '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'" aria-label="Album progress"><span style="width:'+pct+'%"></span></div></div>'+
 '<div class="rt"><span>'+doneCount()+' of '+N+' finished</span><button class="link" data-reset>Start over</button></div>';
}
function firstTodo(){for(var i=0;i<N;i++){if(!done[i])return i;}return 0;}

/* ---------- "You might also enjoy" section on the album page ---------- */
function recHTML(){
 return '<section class="rec"><h2>You might also enjoy</h2><p class="meta">Albums you should listen to</p><div class="recgrid">'+
  RECOMMENDATIONS.map(function(r){
   var has=!!r.image;
   return '<div class="rcard"><div class="rcover'+(has?'':' noimg')+'">'+
    (has?'<img src="'+r.image+'" alt="Cover of '+r.title+' by '+r.artist+'" loading="lazy" onerror="this.parentNode.classList.add(\'noimg\')">':'')+
    '<div class="ph"><strong>Add cover image</strong><span>'+(r.image?r.image.split('/').pop():'set image: in config.js')+'</span></div></div>'+
    '<div><b>'+r.title+'</b><span>'+r.artist+' \u00b7 '+r.year+'</span></div></div>';
  }).join('')+'</div></section>';
}

/* ---------- Album (first) page ---------- */
function renderAlbum(){
 var rows=TRACKS.map(function(t,i){return '<button class="row" data-go="'+i+'"><span class="num">'+(i+1)+'</span><span class="tt"><b>'+t.title+'</b></span><span class="tag">'+t.tag+'</span><span class="tm">'+t.dur+'</span><span class="ck">'+(done[i]?I.check:'')+'</span></button>';}).join('');
 main.innerHTML='<div class="hero"><div>'+coverSVG(220,true)+'</div><div class="htxt"><p class="eyebrow">Album</p><h1 class="big">Under the Microscope</h1><p class="meta"><b>'+ARTIST+'</b> · COVID-19 edition · '+N+' tracks · about 15 min</p><p class="lede">What does a virus do to your cells? Press play and find out. Tap, spot, build and play your way through six short tracks.</p></div></div>'+
 '<div class="body"><div class="actions"><button class="playbig" data-play aria-label="Play album">'+I.play+'</button><span class="prog-txt">'+doneCount()+' of '+N+' tracks finished</span></div>'+
 (doneCount()===N?'<div class="done-card"><b>Album complete.</b> You now know (roughly) how COVID-19 gets into a cell, what it does to lung tissue, and how the body fights back.</div>':'')+
 '<div class="thr"><span>#</span><span>Title</span><span class="tg">Science focus</span><span>Time</span><span></span></div>'+rows+
 recHTML()+'</div>';
}

/* ---------- Track page frame, finishing a track, navigation ---------- */
function trackShell(i){
 var t=TRACKS[i];
 main.innerHTML='<div class="topbar"><button class="chev" data-go="-1" aria-label="Back to album">'+I.back+'</button><span class="eyebrow">Now playing</span></div>'+
 '<header class="thead"><div class="tnum">'+(i+1)+'</div><div><p class="eyebrow">'+t.tag+'</p><h1>'+t.title+'</h1></div></header>'+
 '<div class="stage" id="stage"></div><div class="nextbar" id="nextbar" hidden></div><div style="height:24px"></div>';
}
function finish(i){
 if(!done[i]){done[i]=1;saveDone();}
 renderSide();renderPlayer();
 var nb=$('#nextbar');if(!nb)return;
 nb.hidden=false;
 nb.innerHTML=i<N-1?'<div><b>Track complete.</b> Nice work.</div><button class="btn pri" data-go="'+(i+1)+'">Next: '+TRACKS[i+1].title+' '+I.next+'</button>':'<div><b>Album complete!</b></div><button class="btn pri" data-go="-1">Back to the album</button>';
 nb.scrollIntoView({block:'nearest'});
}
var T=[];
function go(i){
 if(cleanup){cleanup();cleanup=null;}
 cur=i;renderSide();renderPlayer();
 if(i<0){renderAlbum();}else{trackShell(i);T[i]();}
 main.scrollTop=0;
}
document.addEventListener('click',function(e){
 var g=e.target.closest('[data-go]');if(g){go(parseInt(g.getAttribute('data-go'),10));return;}
 var p=e.target.closest('[data-play]');if(p){go(cur<0?firstTodo():cur);return;}
 var s=e.target.closest('[data-step]');if(s){go(Math.max(-1,Math.min(N-1,cur+parseInt(s.getAttribute('data-step'),10))));return;}
 var rs=e.target.closest('[data-reset]');
 if(rs){
  if(rs.getAttribute('data-arm')){done={};saveDone();go(-1);}
  else{rs.setAttribute('data-arm','1');rs.textContent='Tap again to reset';setTimeout(function(){if(rs.isConnected){rs.removeAttribute('data-arm');rs.textContent='Start over';}},3000);}
 }
});
document.addEventListener('keydown',function(e){
 var t=e.target;
 if((e.key==='Enter'||e.key===' ')&&t&&t.matches&&t.matches('svg [role="button"]')){e.preventDefault();t.dispatchEvent(new MouseEvent('click',{bubbles:true}));}
});
