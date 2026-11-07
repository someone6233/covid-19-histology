/* ======================================================================
   Track 2: Sort the Symptoms
   Drag each COVID-19 symptom into the bin for the level of organization
   it comes from: cell, tissue, organ, or organ system.
   Works with a mouse or a finger on a touch screen.
   ====================================================================== */
'use strict';

T[1] = function(){
 var st = $('#stage');
 var placed = 0, firstTry = 0, tried = {}, isDone = {};

 st.innerHTML = '<div class="card"><h3>Where does each symptom start?</h3>'+
  '<p>Drag each card into the bin for the level it comes from, do not worry if you get them wrong, you will get a hint after! Remember: the cell is the smallest unit; organ system is the biggest.</p></div>'+
  '<div class="card" id="pool"><b>Symptom cards</b><div class="pool" id="poolcards"></div></div>'+
  '<div class="bins" id="bins">'+LEVELS.map(function(name, j){
    return '<div class="bin" data-lv="'+j+'"><h4>'+name+'</h4><div class="binlist"></div></div>';
  }).join('')+'</div>'+
  '<p class="fb" id="sfb">Drag a card to start.</p>';

 function drawPool(){
  var ids = shuffle(SORT_CARDS.map(function(c, k){ return k; }).filter(function(k){ return !isDone[k]; }));
  $('#poolcards').innerHTML = ids.map(function(k){
   return '<div class="sc" data-k="'+k+'">'+SORT_CARDS[k].t+'</div>';
  }).join('');
  if (!ids.length) $('#poolcards').innerHTML = '<p class="meta">YAY, all cards are sorted!</p>';
 }

 var drag = null;
 st.addEventListener('pointerdown', function(e){
  var c = e.target.closest('.sc');
  if (!c || !c.closest('#poolcards')) return;
  e.preventDefault();
  var r = c.getBoundingClientRect();
  var ghost = c.cloneNode(true);
  ghost.classList.add('ghost');
  ghost.style.width = r.width + 'px';
  ghost.style.left = r.left + 'px';
  ghost.style.top = r.top + 'px';
  document.body.appendChild(ghost);
  drag = {k: +c.getAttribute('data-k'), ghost: ghost, dx: e.clientX - r.left, dy: e.clientY - r.top, el: c};
  c.classList.add('dragging');
 });
 window.addEventListener('pointermove', function(e){
  if (!drag) return;
  drag.ghost.style.left = (e.clientX - drag.dx) + 'px';
  drag.ghost.style.top = (e.clientY - drag.dy) + 'px';
  $$('.bin').forEach(function(b){ b.classList.remove('over'); });
  var under = document.elementFromPoint(e.clientX, e.clientY);
  var bin = under && under.closest('.bin');
  if (bin) bin.classList.add('over');
 });
 window.addEventListener('pointerup', function(e){
  if (!drag) return;
  var d = drag; drag = null;
  d.ghost.remove();
  d.el.classList.remove('dragging');
  $$('.bin').forEach(function(b){ b.classList.remove('over'); });
  var under = document.elementFromPoint(e.clientX, e.clientY);
  var bin = under && under.closest('.bin');
  if (!bin) return;
  drop(d.k, +bin.getAttribute('data-lv'), bin);
 });

 function drop(k, lv, bin){
  var card = SORT_CARDS[k], fb = $('#sfb');
  var correct = card.lv === lv;
  if (!tried[k]) tried[k] = {wrong: 0};
  if (correct){
   if (tried[k].wrong === 0) firstTry++;
   isDone[k] = 1; placed++;
   var el = $('.sc[data-k="'+k+'"]');
   if (el) el.remove();
   bin.querySelector('.binlist').insertAdjacentHTML('beforeend', '<div class="sc placed">'+card.t+'</div>');
   fb.className = 'fb good';
   fb.textContent = 'Correct! ' + card.why;
   drawPool();
   if (placed === SORT_CARDS.length) done();
  } else {
   tried[k].wrong++;
   bin.classList.add('shake');
   setTimeout(function(){ bin.classList.remove('shake'); }, 400);
   fb.className = 'fb bad';
   fb.textContent = 'Not ' + LEVELS[lv] + '. That card belongs in ' + LEVELS[card.lv] + '. ' + card.why;
  }
 }

 function done(){
  STATS.sorted = firstTry; saveStats();
  $('#sfb').className = 'fb good';
  $('#sfb').innerHTML = 'All '+SORT_CARDS.length+' sorted! You got '+firstTry+' right on the first try!';
  finish(1);
 }

 drawPool();
};