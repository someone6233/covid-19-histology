/* ======================================================================
   Track 6: Your Wrapped
   A Wrapped-style slideshow built from everything the student did.
   One slide is the Guess-the-Song quiz, played inside the slideshow.
   ====================================================================== */
'use strict';

T[5] = function(){
 var st = $('#stage');
 var Q = QUIZ;
 var score = 0;

 function titleFor(s){
  return s === Q.length ? 'Wow, ok that is kind of impressive' : s >= 6 ? 'Congrats, great job!' : s >= 4 ? 'Decent Effort' : 'Maybe Try Again';
 }

 function slides(){
  var energy = STATS.energy === null ? '—' : STATS.energy + '%';
  var bugs = STATS.bugs === null ? '—' : STATS.bugs;
  var sorted = STATS.sorted === null ? '—' : STATS.sorted;
  var low = STATS.lowO2 === null ? '—' : STATS.lowO2 + '%';
  var songs = STATS.playlist.length;
  return [
   {bg:'linear-gradient(160deg,#4A1B3A,#171525 60%,#0E0D16)', kicker:'Your Cell Biology Wrapped', big:'Let’s go', text:'Here is everything you explored!'},
   {bg:'linear-gradient(160deg,#3CDDC6,#1F4B5C 70%,#0E0D16)', kicker:'"Songs" finished', big:doneCount() + ' of ' + N, text:'Every "song" is was aimed to help to understand how cells and COVID-19 both work and interact.'},
   {bg:'linear-gradient(160deg,#FF5D7A,#4A1B3A 70%,#0E0D16)', kicker:'Cell Error Report', big:bugs + ' of ' + BUGS.length, text:'errors fixed on your first try. ' + (STATS.bugs >= 3 ? 'You are great at seeing errors.' : 'Every error you missed still taught you something, though.')},
   {bg:'linear-gradient(160deg,#8B7BFF,#221F36 70%,#0E0D16)', kicker:'Symptoms', big:sorted + ' of ' + SORT_CARDS.length, text:'symptoms placed at the right level of organization on the first try.'},
   {bg:'linear-gradient(160deg,#FFD166,#4A1B3A 75%,#0E0D16)', kicker:'Lung Damage', big:low, text:'The lowest oxygen you pushed the lungs to. Reminder: less oxygen means harder breathing.'},
   {bg:'linear-gradient(160deg,#3CDDC6,#8B7BFF 80%,#0E0D16)', kicker:'Your symptom playlist', big:songs + ' songs', text:'You built a playlist of COVID-19 symptoms, yay.'},
   {bg:'linear-gradient(160deg,#FF5D7A,#3A1634 70%,#0E0D16)', kicker:'COVID-19 Infection', big:energy, text:'cell energy left after the virus took over. Maybe next time you can try to make this higher!'},
   {type:'quiz', bg:'linear-gradient(160deg,#FFD166,#8B7BFF 80%,#0E0D16)', kicker:'Guess the Song'},
   {type:'final', bg:'linear-gradient(160deg,#4A1B3A,#0E0D16)', kicker:'That’s a wrap (im so funny)', big:'Thanks for playing!', text:''}
  ];
 }

 function quizHTML(qi, scoreNow){
  var q = Q[qi], opts = shuffle(q.a.map(function(t, i){ return {t:t, ok:i === 0}; }));
  return '<p class="meta">Question '+(qi + 1)+' of '+Q.length+'</p>'+
   '<div class="lyriccard"><p class="meta">Clue</p><h3>'+q.q+'</h3></div>'+
   '<div class="opts">'+opts.map(function(o){ return '<button class="opt" data-ok="'+(o.ok ? 1 : 0)+'">'+o.t+'</button>'; }).join('')+'</div>'+
   '<p class="fb" id="qfb"></p>';
 }

 function show(list, idx, qi){
  var s = list[idx];
  var locked = false, scoreNow = score;
  var inner;
  if (s.type === 'quiz'){
   inner = '<p class="eyebrow">'+s.kicker+'</p>'+quizHTML(qi, scoreNow);
  } else if (s.type === 'final'){
   inner = '<p class="eyebrow">'+s.kicker+'</p><h2 class="wbig">'+s.big+'</h2>'+
    '<p class="wtext">You now know how COVID-19 gets into a cell, how it changes organs, and how the immune system can help or harm in these situations. My verdict: <b>'+titleFor(score)+'</b> ('+score+' of '+Q.length+' on the quiz).</p>';
  } else {
   inner = '<p class="eyebrow">'+s.kicker+'</p><h2 class="wbig">'+s.big+'</h2><p class="wtext">'+s.text+'</p>';
  }
  var isLast = idx === list.length - 1;
  st.innerHTML = '<div class="wslide" style="background:'+s.bg+'">'+inner+'</div>'+
   '<div class="wnav"><button class="btn ghost" id="wprev"'+(idx === 0 ? ' disabled' : '')+'>Back</button>'+
   '<div class="wdots">'+list.map(function(_, i){ return '<span class="'+(i === idx ? 'on' : '')+'"></span>'; }).join('')+'</div>'+
   '<button class="btn pri" id="wnext"'+(s.type === 'quiz' ? ' hidden' : '')+'>'+(isLast ? 'Finish' : 'Next')+'</button></div>';

  st.onclick = function(e){
   if (s.type === 'quiz'){
    var b = e.target.closest('.opt');
    if (b && !locked){
     locked = true;
     var ok = b.getAttribute('data-ok') === '1';
     if (ok) score++;
     $$('.opt').forEach(function(x){ if (x.getAttribute('data-ok') === '1') x.classList.add('right'); });
     if (!ok) b.classList.add('wrong');
     var f = $('#qfb'); f.className = 'fb ' + (ok ? 'good' : 'bad'); f.textContent = (ok ? 'Correct! ' : 'Not quite. ') + Q[qi].e;
     var nb = document.createElement('button');
     nb.className = 'btn pri'; nb.id = 'qnext';
     nb.textContent = qi < Q.length - 1 ? 'Next question' : 'Next';
     $('#stage .wslide').appendChild(nb);
     return;
    }
    if (e.target.closest('#qnext')){
     if (qi < Q.length - 1){ show(list, idx, qi + 1); }
     else { STATS.quiz = score; saveStats(); show(list, idx + 1, 0); }
     return;
    }
   }
   if (e.target.closest('#wnext')){
    if (isLast){ finish(5); st.innerHTML = '<div class="card"><p class="meta">Wrapped complete. Head back to the album to replay any song.</p><div class="btnrow"><button class="btn pri" data-go="-1">Back to the album</button></div></div>'; }
    else show(list, idx + 1, 0);
   }
   if (e.target.closest('#wprev') && idx > 0){ show(list, idx - 1, 0); }
  };
 }

 show(slides(), 0, 0);
};