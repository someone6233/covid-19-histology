/* ======================================================================
   Track 5: Symptom Playlist
   Search for symptoms, add the real COVID-19 songs to your playlist
   (one is a trap), then balance the immune mix to protect the lungs.
   ====================================================================== */
'use strict';

T[4] = function(){
 var st = $('#stage');
 var list = STATS.playlist.slice();   // indexes into SONGS
 var lastNote = null;

 st.innerHTML = '<div class="card"><h3>Search for a symptom</h3><p>Type a symptom such as <b>cough</b>, <b>breathe</b>, <b>fever</b> or <b>smell</b>. Add the songs that match a real COVID-19 symptom. Watch out for one of them that might not be correct, who knows, I might be evil.</p>'+
  '<input id="q" class="search" type="search" placeholder="Search songs or symptoms" aria-label="Search songs or symptoms"></div>'+
  '<div class="two"><div class="card"><h3>Results</h3><div id="res" class="list"></div></div>'+
  '<div class="card"><h3>Your playlist: <span id="pc"></span></h3><div id="pl" class="list"></div><p class="fb" id="pf"></p></div></div>'+
  '<div class="card" id="np" hidden></div>'+
  '<div class="card" id="mixer" hidden><h3>Balance the immune response</h3>'+
  '<p>Your immune system is like a a coordinated assault (for lack of a better descriptor). If there are too few immune cells, the virus can spread. On the other hand, too much inflammation could make the tissue damaged. So, maybe try and find a balance!</p>'+
  '<div class="rl"><span>Few immune cells</span><span>Many immune cells</span></div>'+
  '<input id="im" type="range" min="0" max="100" value="40" aria-label="Immune cell strength">'+
  '<div class="rl"><span>Calm inflammation</span><span>Strong inflammation</span></div>'+
  '<input id="inf" type="range" min="0" max="100" value="40" aria-label="Inflammation strength">'+
  '<div class="meter"><span>Lung health: <b id="hv"></b>%</span><div class="mbar"><span id="hb"></span></div></div>'+
  '<p id="mt" class="fb"></p>'+
  '<div class="btnrow"><button class="btn pri" id="lock" disabled>Lock in the mix</button></div>'+
  '<p class="meta" style="font-size:13px">Nice nice nice</p></div>';

 function okCount(){ return list.filter(function(i){ return SONGS[i].ok; }).length; }

 function drawResults(){
  var q = ($('#q').value || '').trim().toLowerCase();
  var rows = SONGS.map(function(s, i){ return {s:s, i:i}; }).filter(function(r){
   if (!q) return true;
   return r.s.title.toLowerCase().indexOf(q) > -1 || r.s.artist.toLowerCase().indexOf(q) > -1 || r.s.keys.some(function(k){ return k.indexOf(q) > -1 || q.indexOf(k) > -1; });
  });
  $('#res').innerHTML = rows.length ? rows.map(function(r){
   var on = list.indexOf(r.i) > -1;
   return '<div class="song"><div><b>'+r.s.title+'</b><span>'+r.s.artist+'</span></div>'+
    '<button class="pill'+(on ? '' : ' on')+'" data-add="'+r.i+'"'+(on ? ' disabled' : '')+'>'+(on ? 'Added' : 'Add')+'</button></div>';
  }).join('') : '<p class="meta">No songs match that. Try again.</p>';
 }
 function drawPlaylist(){
  $('#pc').textContent = okCount() + ' of ' + PLAYLIST_GOAL;
  $('#pl').innerHTML = list.length ? list.map(function(i){
   return '<div class="song"><div><b>'+SONGS[i].title+'</b><span>'+(SONGS[i].ok ? 'Symptom song' : 'Trap')+'</span></div></div>';
  }).join('') : '<p class="meta">Your playlist is empty. Search and add songs.</p>';
  if (okCount() >= PLAYLIST_GOAL){ $('#mixer').hidden = false; }
  STATS.playlist = list; saveStats();
 }

 st.addEventListener('input', function(e){ if (e.target.id === 'q') drawResults(); });
 st.addEventListener('click', function(e){
  var b = e.target.closest('[data-add]');
  if (b){
   var i = +b.getAttribute('data-add'), s = SONGS[i], pf = $('#pf');
   if (list.indexOf(i) > -1) return;
   if (!s.ok){
    pf.className = 'fb bad';
    pf.textContent = 'Trap! “'+s.title+'” is not a COVID-19 symptom, so we should not add it!';
    return;
   }
   list.push(i);
   pf.className = 'fb good'; pf.textContent = 'Added: '+s.title;
   showNote(s);
   drawResults(); drawPlaylist(); mixUpdate();
   return;
  }
  if (e.target.closest('#lock') && !$('#lock').disabled){ finish(4); }
 });

 function showNote(s){
  var np = $('#np'); np.hidden = false;
  np.innerHTML = '<h3>Liner notes: '+s.title+'</h3><p>'+s.note+'</p>';
  np.scrollIntoView({block:'nearest'});
 }

 function mixUpdate(){
  var im = +$('#im').value, inf = +$('#inf').value;
  var virus = Math.max(0, 80 - im);
  var damage = Math.min(100, virus * 0.4 + Math.max(0, inf - 55) * 1.6);
  var health = Math.round(100 - damage);
  $('#hv').textContent = health;
  var hb = $('#hb'); hb.style.width = health + '%';
  var mt = $('#mt'), lock = $('#lock');
  if (health >= 90 && okCount() >= PLAYLIST_GOAL){
   mt.className = 'fb good';
   mt.textContent = 'Balanced, yay! The virus is cleared and the lung tissue is mostly protected.';
   lock.disabled = false;
  } else if (virus > 20){
   mt.className = 'fb bad'; mt.textContent = 'The virus is still spreading, this is not good. The immune cells need to be stronger maybe.';
   lock.disabled = true;
  } else if (inf > 70){
   mt.className = 'fb bad'; mt.textContent = 'The virus is under control, but too much inflammation is damaging the tissue. Try something to fix this!';
   lock.disabled = true;
  } else {
   mt.className = 'fb'; mt.textContent = okCount() >= PLAYLIST_GOAL ? 'Almost. Adjust the sliders.' : 'Add ' + (PLAYLIST_GOAL - okCount()) + ' more symptom songs to unlock it.';
   lock.disabled = true;
  }
 }
 st.addEventListener('input', function(e){ if (e.target.id === 'im' || e.target.id === 'inf') mixUpdate(); });

 drawResults(); drawPlaylist();
 if (list.length){ var last = list[list.length - 1]; if (SONGS[last] && SONGS[last].ok) showNote(SONGS[last]); }
 mixUpdate();
};