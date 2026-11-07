/* ======================================================================
   Track 1: Cell Bug Report
   Each bug report describes an error COVID-19 causes in the cell.
   The student taps the organelle responsible on the cell diagram.
   ====================================================================== */
'use strict';

T[0] = function(){
 var st = $('#stage');
 var i = 0, firstTry = 0, attempts = 0, hintUsed = false, solved = false;

 st.innerHTML = '<div class="two"><div class="card art" id="cellbox"></div>'+
  '<div class="card" id="bugcard"></div></div>';

 function drawCell(){
  $('#cellbox').innerHTML = '<svg viewBox="0 0 600 440" role="group" aria-label="Animal cell. Tap the organelle that is causing the error.">'+
   '<g class="hot" data-k="cytoplasm" tabindex="0" role="button" aria-label="Cytoplasm"><ellipse cx="300" cy="230" rx="262" ry="167" fill="#1F4B5C"/></g>'+
   '<g class="hot" data-k="nucleus" tabindex="0" role="button" aria-label="Nucleus"><circle cx="300" cy="225" r="68" fill="#4C3FA3" stroke="#8B7BFF" stroke-width="5"/><circle cx="322" cy="210" r="22" fill="#2D2470"/></g>'+
   '<g class="hot" data-k="mito" tabindex="0" role="button" aria-label="Mitochondria">'+mitoSVG(150, 170, -35)+mitoSVG(455, 310, 25)+'</g>'+
   '<g class="hot" data-k="membrane" tabindex="0" role="button" aria-label="Cell membrane"><ellipse cx="300" cy="230" rx="270" ry="175" fill="none" stroke="#3CDDC6" stroke-width="14"/><ellipse cx="300" cy="230" rx="270" ry="175" fill="none" stroke="transparent" stroke-width="40"/></g>'+
   '</svg>';
 }

 function drawBug(){
  var b = BUGS[i];
  solved = false; attempts = 0; hintUsed = false;
  $('#bugcard').innerHTML = '<p class="eyebrow">Bug '+(i + 1)+' of '+BUGS.length+'</p>'+
   '<h3>Error report</h3><p>'+b.report+'</p>'+
   '<p class="fb" id="bfb">Tap the organelle that is causing this error.</p>'+
   '<div class="btnrow" id="bbtns"><button class="btn ghost" id="bhint">Show a hint</button></div>';
  drawCell();
 }

 st.addEventListener('click', function(e){
  if (e.target.closest('#bhint')){
   hintUsed = true;
   $('#bfb').className = 'fb';
   $('#bfb').textContent = 'Hint: ' + BUGS[i].hint;
   e.target.closest('#bhint').disabled = true;
   return;
  }
  if (e.target.closest('#bnext')){
   i++;
   if (i < BUGS.length) drawBug();
   else { STATS.bugs = firstTry; saveStats(); showDone(); }
   return;
  }
  var h = e.target.closest('.hot');
  if (!h || solved) return;
  var k = h.getAttribute('data-k'), b = BUGS[i], fb = $('#bfb');
  attempts++;
  if (k === b.part){
   solved = true;
   if (attempts === 1 && !hintUsed) firstTry++;
   $('#cellbox svg').insertAdjacentHTML('beforeend', '<text class="lt" x="300" y="436" style="fill:#3CDDC6;stroke:#06221e">Error fixed!</text>');
   fb.className = 'fb good';
   fb.innerHTML = 'Fixed! <b>'+CELL_PARTS[k].name+'</b>. '+b.why;
   $('#bbtns').innerHTML = '<button class="btn pri" id="bnext">'+(i < BUGS.length - 1 ? 'Next error' : 'See results')+'</button>';
  } else {
   var svg = $('#cellbox svg');
   svg.classList.remove('shake'); void svg.getBoundingClientRect(); svg.classList.add('shake');
   fb.className = 'fb bad';
   fb.textContent = 'Oh no, that is the wrong one, maybe you should look at the error again.';
  }
 });

 function showDone(){
  st.innerHTML = '<div class="card"><p class="eyebrow">YAY NO ERRORS!</p><h3>You fixed all '+BUGS.length+' errors.</h3>'+
   '<p>You got '+firstTry+' of '+BUGS.length+' right on the first try, without a hint. Each error was the job of one organelle breaking.</p>'+
   '<p class="meta">Next, you will see how these errors in cells add up to whole organs and organ systems.</p></div>';
  finish(0);
 }

 drawBug();
};
