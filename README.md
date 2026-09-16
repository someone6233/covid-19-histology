# COVID-19: Inside the Lung — Version 2

## What changed

Version 2 expands the experience to roughly 15–20 minutes and adds:

- Back/previous buttons throughout the investigation.
- Animated section transitions.
- Sound effects generated in the browser, with a mute button.
- A real scientific-style cell illustration instead of emoji/peanut organelles.
- A short embedded Scripps Research video with post-video interactive questions.
- A five-step virtual histology slide preparation lab.
- A final lab decision about H&E vs SARS-CoV-2 immunohistochemical staining.
- Real lung/alveolar microscopy images.
- Four clickable hotspots on a CDC COVID-19 histopathology figure.
- A drag-and-drop disease pathway that can be reset and where individual cards can be removed.
- An APA references page accessible from the final screen.
- A real `images/` folder containing the local cell illustration.

## Important scientific design choice

The virtual slide lab does NOT claim that routine H&E microscopy lets students directly see individual SARS-CoV-2 virions. Instead, it teaches that:

- H&E is useful for tissue architecture and pathology.
- Virus-specific immunohistochemistry can detect viral antigen in tissue.
- Electron microscopy can resolve structures at a much smaller scale.

## Video

The site currently embeds Scripps Research's:
"How the Novel Coronavirus Infects a Cell: Science, Simplified"

You can replace the YouTube video ID in `index.html` if your instructor prefers the video you originally suggested.

## Hosting

Upload all files/folders to a GitHub repository:

- index.html
- references.html
- style.css
- script.js
- images/

Then enable GitHub Pages from Settings → Pages → Deploy from a branch → main → /(root).

The public URL will look like:

https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/

## Image note

The site uses:
- a local original cell SVG in `images/`;
- a Wikimedia Commons alveolar photomicrograph;
- a CDC Emerging Infectious Diseases histopathology figure loaded from its official source.

The final references page includes attribution/source links. Review your course's image/copyright requirements before final submission.
