/* ======================================================================
   Track 6: Encore Quiz
   Six question review quiz.
   ====================================================================== */
'use strict';

T[5]=function(){
 var st=$('#stage');
 var Q=QUIZ;
 var qi=0,score=0;
 function ask(){
  var q=Q[qi],opts=shuffle(q.a.map(function(t,i){return {t:t,ok:i===0};}));
  st.innerHTML='<div class="card"><p class="eyebrow">Question '+(qi+1)+' of '+Q.length+'</p><h3>'+q.q+'</h3><div class="opts">'+opts.map(function(o,i){return '<button class="opt" data-ok="'+(o.ok?1:0)+'">'+o.t+'</button>';}).join('')+'</div><p class="fb" id="qfb"></p><div class="btnrow"><button class="btn pri" id="qn" hidden>'+(qi===Q.length-1?'See my score':'Next question')+'</button></div></div>';
  var locked=false;
  st.onclick=function(e){
   var b=e.target.closest('.opt');
   if(b&&!locked){
    locked=true;var ok=b.getAttribute('data-ok')==='1';if(ok)score++;
    $$('.opt').forEach(function(x){if(x.getAttribute('data-ok')==='1')x.classList.add('right');});
    if(!ok)b.classList.add('wrong');
    var f=$('#qfb');f.className='fb '+(ok?'good':'bad');f.textContent=(ok?'Correct! ':'Not quite. ')+q.e;
    $('#qn').hidden=false;
   }
   if(e.target.closest('#qn')){qi++;if(qi<Q.length)ask();else result();}
  };
 }
 function result(){
  var badge=score===6?'Platinum record':score>=5?'Gold record':score>=4?'Silver record':'Bronze record';
  st.onclick=function(e){if(e.target.closest('#again')){qi=0;score=0;ask();}};
  st.innerHTML='<div class="card"><p class="eyebrow">Final score</p><h3 style="font-size:32px">'+score+' out of '+Q.length+': '+badge+'</h3><p>You can explain how COVID-19 gets into a cell, what it does to the cell’s parts, and how that changes lung tissue.</p><div class="btnrow"><button class="btn ghost" id="again">Try again</button><button class="btn pri" data-go="-1">Back to the album</button></div></div>';
  finish(5);
 }
 ask();
};
