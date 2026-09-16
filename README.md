# Histology Investigator: Case File — COVID-19

An interactive, ~15–20 minute web experience for Grade 7/8 students that
teaches how SARS-CoV-2 affects lung cells and tissue, built around the
Pennsylvania Science & Technology expectations for cell organelles and
tissue/organ/system organization.

## Files (all flat, no subfolders — safe to upload individually to GitHub)
- `index.html` — the whole app structure (all screens, all diagrams as inline SVG)
- `style.css` — all visual styling
- `script.js` — all interactivity, quizzes, and sound effects

There is **no `images/` folder** on purpose. Every diagram (the cell, the
lung, the tissue slide) is drawn directly in the HTML as SVG code, so
nothing can show up "broken" after upload — SVG code is just text, like the
rest of the page.

## How to publish it on GitHub Pages
1. Create a new repository on GitHub.
2. Click **Add file → Upload files**, and drag in `index.html`, `style.css`,
   and `script.js` (you can select all three at once — no folder needed).
3. Commit the files.
4. Go to **Settings → Pages**, set **Branch** to `main` (or your default
   branch) and folder to `/ (root)`, then save.
5. GitHub will give you a link like `https://yourusername.github.io/your-repo/`
   — that's the link to submit.

## Things you (the student) should double-check/customize
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
