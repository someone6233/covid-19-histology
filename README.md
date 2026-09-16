

## IMPORTANT:
- **The video (Step 8):** the code embeds
  `https://www.youtube.com/watch?v=ZL1z3Uju-I0` and auto-pauses it at 40s,
  100s, and 160s to ask a question. Open `script.js`, find
  `VIDEO_CHECKPOINTS` near the top of section 11, and edit the `time`
  values and `prompt`/`options`/`correct`/`explain` text so the questions
  actually match what's on screen at those moments in the video you choose.
- **Sound:** all sound effects (clicks, correct/wrong dings, the "yay" at
  the end, and the landing-page elevator music) are generated in the
  browser with the Web Audio API — no audio files to upload or lose. Music
  starts after the first click/tap on the landing page (browsers require a
  user interaction before playing audio) and stops the instant "Start
  investigation" is clicked.
- **References:** the APA reference list is in the modal at the bottom of
  `index.html` (`id="ref-modal"`) — add/replace with your own sources if
  you use different ones while researching.
- **Difficulty:** every screen's "Next" button unlocks once the student has
  *attempted* that screen's activity (not necessarily gotten it 100%
  right), so students always keep moving forward — except the final case
  review and the pathway/sequencing checks, which really do need the
  correct answer/order before continuing, since those are the two
  "prove you understood it" moments.

## Accessibility & UX notes
- All clickable diagram markers are keyboard-accessible (Tab + Enter/Space).
- Reduced-motion is respected for anyone with that OS setting on.
- The Back button works on every screen, and drag-and-drop steps/pathway
  chips can always be undone and retried.
