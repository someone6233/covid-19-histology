UNDER THE MICROSCOPE: where to change things

Everything is in ONE flat folder (no sub-folders), so it can be drag-and-dropped
straight into GitHub. Keep every file next to index.html.

  index.html            page skeleton and the order scripts load in
  style.css             all colors, fonts and layout (colors are at the top)
  config.js             EDIT HERE FIRST: your name, track titles, recommended
                        albums, and every piece of teaching text
  helpers.js            saving progress, icons, the cartoon virus and album cover art
  core.js               sidebar, player bar, album page, moving between tracks
  track1-cell.js        Track 1: Cell Introduction
  track2-zoom.js        Track 2: Cellular Organization
  track3-takeover.js    Track 3: COVID-19 Invasion
  track4-lung.js        Track 4: COVID-19 & The Lungs
  track5-game.js        Track 5: Protect the Lungs (the game)
  track6-quiz.js        Track 6: Final Quiz
  main.js               starts the app (keep it last)

Common changes
  Change your name:              ARTIST in config.js
  Change a track title:          TRACKS in config.js
  Change album covers:           RECOMMENDATIONS in config.js
  Change what a cell part says:  CELL_PARTS in config.js
  Change quiz questions:         QUIZ in config.js (first answer is the correct one)
  Change the site colors:        section 1 at the top of style.css
  Change game length or speed:   track5-game.js
