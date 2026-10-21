/* ======================================================================
   HELPERS
   Progress tracking, small utility functions, icons and cartoon art.
   ====================================================================== */
'use strict';
var N=TRACKS.length;
var done={};
try{JSON.parse(localStorage.getItem('utm-done-v1')||'[]').forEach(function(i){done[i]=1;});}catch(e){}
function saveDone(){try{localStorage.setItem('utm-done-v1',JSON.stringify(Object.keys(done).map(Number)));}catch(e){}}
function doneCount(){return Object.keys(done).length;}
var cur=-1,cleanup=null;
var main=document.getElementById('main'),side=document.getElementById('side'),player=document.getElementById('player');
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
var I={
 play:'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>',
 prev:'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 6h2v12H7zM20 6v12L10 12z" fill="currentColor"/></svg>',
 next:'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 6h2v12h-2zM4 6l10 6-10 6z" fill="currentColor"/></svg>',
 check:'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 back:'<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
/* A friendly cartoon virus: spikes, body, optional eyes. */
function virus(cx,cy,r,o){
 o=o||{};var n=o.n||14,len=o.len||r*0.4,col=o.col||'#FF5D7A',s='';
 for(var i=0;i<n;i++){
  var a=i*2*Math.PI/n,x1=cx+Math.cos(a)*r,y1=cy+Math.sin(a)*r,x2=cx+Math.cos(a)*(r+len),y2=cy+Math.sin(a)*(r+len);
  s+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+col+'" stroke-width="'+Math.max(2,r*0.1)+'" stroke-linecap="round"/><circle cx="'+x2+'" cy="'+y2+'" r="'+Math.max(2,r*0.16)+'" fill="'+col+'"/>';
 }
 s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+col+'"/><circle cx="'+(cx-r*0.3)+'" cy="'+(cy-r*0.35)+'" r="'+(r*0.18)+'" fill="#fff" opacity=".25"/>';
 if(o.face){
  var ex=r*0.32,ey=cy-r*0.05,er=r*0.2;
  s+='<circle cx="'+(cx-ex)+'" cy="'+ey+'" r="'+er+'" fill="#fff"/><circle cx="'+(cx+ex)+'" cy="'+ey+'" r="'+er+'" fill="#fff"/><circle cx="'+(cx-ex+er*0.2)+'" cy="'+ey+'" r="'+(er*0.5)+'" fill="#2A1233"/><circle cx="'+(cx+ex+er*0.2)+'" cy="'+ey+'" r="'+(er*0.5)+'" fill="#2A1233"/>';
 }
 return s;
}
function coverSVG(sz,big){
 var cs='';
 [[40,48,9],[162,38,6],[170,150,11],[36,150,7],[100,172,5]].forEach(function(c){cs+='<circle cx="'+c[0]+'" cy="'+c[1]+'" r="'+c[2]+'" fill="none" stroke="#3CDDC6" stroke-width="3"/><circle cx="'+c[0]+'" cy="'+c[1]+'" r="'+(c[2]*0.4)+'" fill="#8B7BFF"/>';});
 var cy=big?88:95;
 return '<svg class="cov" width="'+sz+'" height="'+sz+'" viewBox="0 0 200 200" role="img" aria-label="Album cover: a cartoon virus seen through a microscope"><rect width="200" height="200" rx="10" fill="#3A1634"/><circle cx="100" cy="'+cy+'" r="78" fill="#4F1D45"/><circle cx="100" cy="'+cy+'" r="60" fill="#5F2253"/>'+cs+virus(100,cy,34,{n:14,len:14,face:true})+(big?'<text x="100" y="188" text-anchor="middle" font-family="ui-rounded,Trebuchet MS,system-ui,sans-serif" font-weight="800" font-size="12" fill="#F3F0FA" letter-spacing=".8">UNDER THE MICROSCOPE</text>':'')+'</svg>';
}
