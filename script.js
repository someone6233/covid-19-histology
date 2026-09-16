/* ==========================================================================
   Histology Investigator — Case File: COVID-19
   ========================================================================== */

/* ---------------------------------------------------------------
   0. Tiny sound engine (Web Audio API — no audio files needed,
   so nothing can go missing when this is uploaded to GitHub).
---------------------------------------------------------------- */
const Sound = (() => {
  let actx = null;
  let on = true;
  let elevatorTimer = null;
  let elevatorStep = 0;
  const elevatorNotes = [392, 440, 494, 440, 392, 330, 349, 392];

  function getCtx() {
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    return actx;
  }

  function tone(freq, startOffset, dur, type = "sine", vol = 0.15) {
    if (!on) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t0 = ctx.currentTime + startOffset;
      gain.gain.setValueAtTime(vol, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.start(t0);
      osc.stop(t0 + dur + 0.03);
    } catch (e) { /* audio not available — fail silently */ }
  }

  return {
    setOn(v) { on = v; },
    isOn() { return on; },
    click() { tone(600, 0, 0.06, "square", 0.07); },
    correct() { tone(660, 0, 0.09, "sine", 0.12); tone(880, 0.1, 0.14, "sine", 0.12); },
    wrong() { tone(180, 0, 0.2, "sawtooth", 0.1); },
    yay() {
      tone(523, 0, 0.14, "triangle", 0.15);
      tone(659, 0.14, 0.14, "triangle", 0.15);
      tone(784, 0.28, 0.14, "triangle", 0.15);
      tone(1047, 0.42, 0.35, "triangle", 0.17);
    },
    startElevator() {
      if (elevatorTimer) return;
      elevatorTimer = setInterval(() => {
        tone(elevatorNotes[elevatorStep % elevatorNotes.length], 0, 0.38, "triangle", 0.045);
        elevatorStep++;
      }, 430);
    },
    stopElevator() {
      clearInterval(elevatorTimer);
      elevatorTimer = null;
      elevatorStep = 0;
    }
  };
})();

/* ---------------------------------------------------------------
   1. App state & navigation
---------------------------------------------------------------- */
const SCREEN_IDS = [
  "landing", "briefing", "virus", "cell", "tissue-basics", "lung",
  "slide", "examine", "video", "lab", "pathway", "final", "certificate"
];

const state = {
  current: 0,
  tally: {} // { key: {correct, total} }
};

function recordTally(key, correct, total) {
  state.tally[key] = { correct, total };
}

function totalScore() {
  let c = 0, t = 0;
  Object.values(state.tally).forEach(v => { c += v.correct; t += v.total; });
  return { c, t };
}

let rackDots = [];
function buildRack() {
  const rack = document.getElementById("slide-rack");
  rack.innerHTML = "";
  rackDots = SCREEN_IDS.map(() => {
    const d = document.createElement("div");
    d.className = "slide-dot";
    rack.appendChild(d);
    return d;
  });
}

function updateRack() {
  rackDots.forEach((d, i) => {
    d.classList.toggle("done", i < state.current);
    d.classList.toggle("current", i === state.current);
  });
}

function showScreen(index) {
  index = Math.max(0, Math.min(SCREEN_IDS.length - 1, index));
  state.current = index;
  SCREEN_IDS.forEach((id, i) => {
    const el = document.getElementById("screen-" + id);
    if (el) el.classList.toggle("active", i === index);
  });
  updateRack();
  window.scrollTo({ top: 0, behavior: "smooth" });

  const id = SCREEN_IDS[index];
  if (id === "video") setupVideoOnce();
  if (id === "certificate") finalizeCertificate();
}

function goNext() { showScreen(state.current + 1); }
function goBack() { showScreen(state.current - 1); }

/* ---------------------------------------------------------------
   2. Generic quiz renderer
   questions: [{prompt, options:[...], correct:index, explain}]
---------------------------------------------------------------- */
function renderQuiz(container, questions, tallyKey, onAllAnswered) {
  container.innerHTML = "";
  let answeredCount = 0, correctCount = 0;

  questions.forEach((q, qi) => {
    const block = document.createElement("div");
    block.className = "quiz-question";

    const p = document.createElement("p");
    p.innerHTML = `<strong>${qi + 1}.</strong> ${q.prompt}`;
    block.appendChild(p);

    const ul = document.createElement("ul");
    ul.className = "quiz-options";

    q.options.forEach((optText, oi) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.textContent = optText;
      btn.addEventListener("click", () => {
        if (btn.dataset.locked) return;
        Array.from(ul.children).forEach(c => { c.firstChild.dataset.locked = "1"; c.firstChild.disabled = true; });
        const fb = document.createElement("div");
        fb.className = "feedback";
        if (oi === q.correct) {
          btn.classList.add("correct");
          fb.textContent = "Correct! " + (q.explain || "");
          fb.classList.add("good");
          Sound.correct();
          correctCount++;
        } else {
          btn.classList.add("incorrect");
          const correctBtn = ul.children[q.correct].firstChild;
          correctBtn.classList.add("correct");
          fb.textContent = "Not quite. " + (q.explain || "");
          fb.classList.add("bad");
          Sound.wrong();
        }
        block.appendChild(fb);
        answeredCount++;
        if (answeredCount === questions.length) {
          recordTally(tallyKey, correctCount, questions.length);
          if (onAllAnswered) onAllAnswered(correctCount, questions.length);
        }
      });
      li.appendChild(btn);
      ul.appendChild(li);
    });

    block.appendChild(ul);
    container.appendChild(block);
  });
}

/* ---------------------------------------------------------------
   3. Hotspot helper (numbered/lettered SVG markers with a note)
---------------------------------------------------------------- */
function wireHotspots(spotDefs, noteEl, nextBtn, opts = {}) {
  let seenCount = 0;
  const total = spotDefs.length;
  spotDefs.forEach(def => {
    const g = document.getElementById(def.id);
    if (!g) return;
    const activate = () => {
      Sound.click();
      if (!def._seen) {
        def._seen = true;
        seenCount++;
        const circle = g.querySelector("circle");
        if (circle) circle.setAttribute("fill", opts.seenColor || "#1f6f6b");
      }
      noteEl.innerHTML = `<strong>${def.title}</strong><br>${def.text}`;
      if (seenCount === total && nextBtn) nextBtn.disabled = false;
    };
    g.addEventListener("click", activate);
    g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); } });
  });
}

/* ---------------------------------------------------------------
   4. Wire up on load
---------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  buildRack();
  showScreen(0);

  // Generic next/back buttons
  document.querySelectorAll("[data-next]").forEach(btn => {
    btn.addEventListener("click", () => { Sound.click(); goNext(); });
  });
  document.querySelectorAll("[data-back]").forEach(btn => {
    btn.addEventListener("click", () => { Sound.click(); goBack(); });
  });

  // Sound toggle
  const soundBtn = document.getElementById("sound-toggle");
  soundBtn.addEventListener("click", () => {
    const now = !Sound.isOn();
    Sound.setOn(now);
    soundBtn.textContent = now ? "🔊 Sound on" : "🔇 Sound off";
    soundBtn.setAttribute("aria-pressed", String(now));
  });

  // Landing: elevator music starts on first interaction, stops on Start
  let elevatorStarted = false;
  const landingScreen = document.getElementById("screen-landing");
  function tryStartElevator() {
    if (!elevatorStarted && landingScreen.classList.contains("active")) {
      elevatorStarted = true;
      Sound.startElevator();
    }
  }
  landingScreen.addEventListener("pointerdown", tryStartElevator);
  landingScreen.addEventListener("keydown", tryStartElevator);

  document.getElementById("btn-start").addEventListener("click", () => {
    Sound.stopElevator();
    Sound.click();
    goNext();
  });

  setupVirusScreen();
  setupCellScreen();
  setupTissueScreen();
  setupLungScreen();
  setupSlideScreen();
  setupExamineScreen();
  setupLabScreen();
  setupPathwayScreen();
  setupFinalScreen();
  setupCertificateScreen();
});

/* ---------------------------------------------------------------
   5. Meet the virus
---------------------------------------------------------------- */
function setupVirusScreen() {
  const spikesGroup = document.getElementById("virus-spikes");
  const spikeCount = 14;
  for (let i = 0; i < spikeCount; i++) {
    const angle = (i / spikeCount) * Math.PI * 2;
    const x1 = 130 + Math.cos(angle) * 70;
    const y1 = 110 + Math.sin(angle) * 70;
    const x2 = 130 + Math.cos(angle) * 92;
    const y2 = 110 + Math.sin(angle) * 92;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#b8412c");
    line.setAttribute("stroke-width", "5");
    line.setAttribute("stroke-linecap", "round");
    spikesGroup.appendChild(line);
    const knob = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    knob.setAttribute("cx", x2); knob.setAttribute("cy", y2);
    knob.setAttribute("r", "6");
    knob.setAttribute("fill", "#e2634b");
    spikesGroup.appendChild(knob);
  }

  const questions = [
    { prompt: "What part of a cell does the virus's spike protein attach to?", options: ["The nucleus", "A receptor on the cell membrane (ACE2)", "The mitochondria", "The cytoplasm"], correct: 1, explain: "The spike protein locks onto an ACE2 receptor on the cell membrane — that's the 'front door' the virus uses to get in." },
    { prompt: "Can a virus reproduce all by itself, without a host cell?", options: ["Yes, viruses can grow and divide on their own", "No — it must hijack a living cell's machinery to make copies of itself"], correct: 1, explain: "Viruses have no cytoplasm, organelles, or way to make their own energy, so they can't reproduce without taking over a host cell." },
    { prompt: "Which cells does SARS-CoV-2 mainly target first?", options: ["Cells lining the airway and lungs", "Bone cells", "Hair cells", "Nail cells"], correct: 0, explain: "Airway and lung cells carry lots of ACE2 receptors, which is why this virus causes a respiratory illness." },
    { prompt: "A virus is generally much ______ than the cell it infects.", options: ["bigger", "smaller", "the exact same size"], correct: 1, explain: "Viruses are far smaller than the cells they infect — that's part of how they can slip through the cell membrane." }
  ];
  renderQuiz(document.getElementById("virus-quiz"), questions, "virus", () => {
    document.getElementById("virus-next").disabled = false;
  });
}

/* ---------------------------------------------------------------
   6. Cell city
---------------------------------------------------------------- */
function setupCellScreen() {
  const spots = [
    { id: "hs-membrane", title: "1. Cell membrane", text: "A thin, flexible boundary that controls what goes in and out of the cell. This is exactly what the virus's spike protein tries to unlock." },
    { id: "hs-nucleus", title: "2. Nucleus", text: "The cell's control centre — it stores the genetic instructions (DNA) and directs everything the cell does." },
    { id: "hs-mito", title: "3. Mitochondria", text: "Often called the 'powerhouse' of the cell — they turn nutrients into usable energy so the cell can do its work." },
    { id: "hs-cytoplasm", title: "4. Cytoplasm", text: "The jelly-like fluid filling the inside of the cell, where the organelles sit and many chemical reactions happen." }
  ];
  wireHotspots(spots, document.getElementById("cell-note"), document.getElementById("cell-next"));
}

/* ---------------------------------------------------------------
   7. Tissue basics
---------------------------------------------------------------- */
function setupTissueScreen() {
  const questions = [
    { prompt: "Put these in order from smallest to largest:", options: ["Cell → Tissue → Organ → Organ system", "Organ → Cell → Tissue → Organ system", "Tissue → Organ system → Cell → Organ"], correct: 0, explain: "Cells team up into tissues, tissues team up into organs, and organs team up into organ systems." },
    { prompt: "What is an alveolus?", options: ["A large airway tube", "A tiny air sac where oxygen crosses into the blood", "A type of white blood cell", "A muscle in the chest"], correct: 1, explain: "Alveoli are the tiny, thin-walled sacs at the end of the airway where gas exchange happens." },
    { prompt: "The lung is an example of a...", options: ["Cell", "Tissue", "Organ", "Organ system"], correct: 2, explain: "The lung is an organ, made of several different tissues working together." }
  ];
  renderQuiz(document.getElementById("tissue-quiz"), questions, "tissue", () => {
    document.getElementById("tissue-next").disabled = false;
  });
}

/* ---------------------------------------------------------------
   8. Healthy lung explore
---------------------------------------------------------------- */
function setupLungScreen() {
  const spots = [
    { id: "hs-trachea", title: "1. Trachea (windpipe)", text: "The main tube that carries air down from your throat toward the lungs." },
    { id: "hs-bronchi", title: "2. Bronchi", text: "The trachea splits into two bronchi, one heading into each lung, then branches again and again like an upside-down tree." },
    { id: "hs-lobe", title: "3. Lung lobe", text: "A section of the lung (an organ) made up of airway, blood vessels, and millions of alveoli, all working together." },
    { id: "hs-alveoli", title: "4. Alveoli cluster", text: "Grape-like clusters of tiny air sacs at the very end of the airway — this is where oxygen actually enters the blood." },
    { id: "hs-capillary", title: "5. Capillaries", text: "Very thin blood vessels wrapped around each alveolus. Oxygen crosses from the air sac into the blood here, and carbon dioxide crosses the other way." },
    { id: "hs-diaphragm", title: "6. Diaphragm", text: "A dome-shaped muscle below the lungs that contracts and relaxes to pull air in and push air out." }
  ];
  wireHotspots(spots, document.getElementById("lung-note"), document.getElementById("lung-next"));
}

/* ---------------------------------------------------------------
   9. Prepare a slide (drag-to-reorder)
---------------------------------------------------------------- */
function setupSlideScreen() {
  const steps = [
    { id: "collect", text: "Collect a small sample of the patient's lung tissue" },
    { id: "fix", text: "Fix the tissue (preserve it with chemicals so it stops changing)" },
    { id: "slice", text: "Slice the tissue into a wafer-thin section" },
    { id: "stain", text: "Stain the section so its structures show up under the microscope" },
    { id: "mount", text: "Mount the stained section on a glass slide under a cover slip" }
  ];
  let order = [...steps].sort(() => Math.random() - 0.5);
  const listEl = document.getElementById("seq-list");
  let dragIndex = null;

  function render() {
    listEl.innerHTML = "";
    order.forEach((step, i) => {
      const li = document.createElement("li");
      li.className = "seq-item";
      li.draggable = true;
      li.dataset.id = step.id;
      li.innerHTML = `<span class="seq-num">${i + 1}</span><span>${step.text}</span>`;
      li.addEventListener("dragstart", () => { dragIndex = i; li.classList.add("dragging"); });
      li.addEventListener("dragend", () => li.classList.remove("dragging"));
      li.addEventListener("dragover", e => e.preventDefault());
      li.addEventListener("drop", () => {
        if (dragIndex === null || dragIndex === i) return;
        const [moved] = order.splice(dragIndex, 1);
        order.splice(i, 0, moved);
        dragIndex = null;
        render();
      });
      listEl.appendChild(li);
    });
  }
  render();

  document.getElementById("seq-check").addEventListener("click", () => {
    Sound.click();
    const correctOrder = steps.map(s => s.id);
    const currentOrder = order.map(s => s.id);
    const isRight = correctOrder.every((id, i) => id === currentOrder[i]);
    const fb = document.getElementById("seq-feedback");
    if (isRight) {
      fb.textContent = "Correct order! That's exactly how a lab technician turns tissue into a slide you can examine.";
      fb.className = "feedback good";
      Sound.correct();
      document.getElementById("slide-next").disabled = false;
    } else {
      fb.textContent = "Not quite the right order yet — drag the steps and try again. (Hint: you can't stain tissue before it's sliced!)";
      fb.className = "feedback bad";
      Sound.wrong();
    }
  });
}

/* ---------------------------------------------------------------
   10. Examine the tissue
---------------------------------------------------------------- */
function setupExamineScreen() {
  const spots = [
    { id: "hs-a", title: "A. Alveolar space (air space)", text: "The open space in the middle of the air sac where air sits before oxygen crosses into the blood." },
    { id: "hs-b", title: "B. Type I pneumocyte", text: "A very thin, flat cell that makes up most of the alveolus wall. It's thin on purpose — so oxygen can cross through it easily." },
    { id: "hs-c", title: "C. Type II pneumocyte", text: "A rounder, chunkier cell that makes a soapy liquid called surfactant, which keeps the air sac from collapsing like a sticky balloon." },
    { id: "hs-d", title: "D. Capillary with red blood cells", text: "A tiny blood vessel running right next to the air sac. The red circles are red blood cells picking up the oxygen that just crossed over." }
  ];
  wireHotspots(spots, document.getElementById("examine-note"), document.getElementById("examine-next"));
}

/* ---------------------------------------------------------------
   11. Watch the video (YouTube IFrame API with timed questions)
---------------------------------------------------------------- */
const VIDEO_ID = "ZL1z3Uju-I0";
// NOTE for the student/teacher: watch the video once and adjust these
// timestamps (in seconds) and questions so they match what's actually
// on screen at that moment.
const VIDEO_CHECKPOINTS = [
  { time: 40, prompt: "Based on what you just watched, which part of the airway does the video focus on?", options: ["The alveoli (air sacs)", "The fingernails", "The stomach"], correct: 0, explain: "The video is focused on the lungs and airway, especially the alveoli." },
  { time: 100, prompt: "What happens to the airway/lung tissue when it becomes inflamed and filled with fluid?", options: ["It becomes easier for oxygen to cross into the blood", "It becomes harder for oxygen to cross into the blood", "Nothing changes at all"], correct: 1, explain: "Inflammation and fluid buildup thicken the gas-exchange surface, making it harder for oxygen to get through." },
  { time: 160, prompt: "Why does someone with damaged alveoli often feel short of breath?", options: ["Their bones are weaker", "Less oxygen is reaching their blood", "Their eyesight changes"], correct: 1, explain: "If oxygen can't cross into the blood efficiently, the body doesn't get enough oxygen — leading to shortness of breath." }
];

let videoState = { player: null, apiReady: false, doneCheckpoints: new Set(), pollTimer: null, quizContainerBuilt: false };

function setupVideoOnce() {
  if (videoState.quizContainerBuilt) return;
  videoState.quizContainerBuilt = true;

  const fallbackTimer = setTimeout(() => {
    if (!videoState.apiReady) {
      document.getElementById("video-fallback-msg").style.display = "block";
      document.getElementById("video-manual-btn").style.display = "inline-block";
    }
  }, 4000);

  window.onYouTubeIframeAPIReady = () => {
    videoState.apiReady = true;
    clearTimeout(fallbackTimer);
    videoState.player = new YT.Player("yt-player", {
      videoId: VIDEO_ID,
      playerVars: { rel: 0 },
      events: {
        onStateChange: onPlayerStateChange
      }
    });
  };

  if (!window.YT) {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.onerror = () => {
      document.getElementById("video-fallback-msg").style.display = "block";
      document.getElementById("video-manual-btn").style.display = "inline-block";
    };
    document.head.appendChild(tag);
  } else {
    window.onYouTubeIframeAPIReady();
  }

  document.getElementById("video-manual-btn").addEventListener("click", () => {
    Sound.click();
    showAllVideoQuestionsAtOnce();
  });
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    if (videoState.pollTimer) clearInterval(videoState.pollTimer);
    videoState.pollTimer = setInterval(() => {
      if (!videoState.player || typeof videoState.player.getCurrentTime !== "function") return;
      const t = videoState.player.getCurrentTime();
      VIDEO_CHECKPOINTS.forEach((cp, i) => {
        if (!videoState.doneCheckpoints.has(i) && t >= cp.time) {
          videoState.doneCheckpoints.add(i);
          videoState.player.pauseVideo();
          showVideoCheckpoint(cp, i);
        }
      });
    }, 500);
  }
}

function showVideoCheckpoint(cp, index) {
  const overlay = document.getElementById("video-overlay");
  const body = document.getElementById("vq-body");
  overlay.classList.add("show");
  body.innerHTML = "";
  const p = document.createElement("p");
  p.textContent = cp.prompt;
  body.appendChild(p);
  const ul = document.createElement("ul");
  ul.className = "quiz-options";
  cp.options.forEach((opt, oi) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz-option";
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      if (btn.dataset.locked) return;
      Array.from(ul.children).forEach(c => { c.firstChild.dataset.locked = "1"; c.firstChild.disabled = true; });
      if (oi === cp.correct) { btn.classList.add("correct"); Sound.correct(); videoCorrectTally(true, cp); }
      else { btn.classList.add("incorrect"); ul.children[cp.correct].firstChild.classList.add("correct"); Sound.wrong(); videoCorrectTally(false, cp); }
      const fb = document.createElement("div");
      fb.className = "feedback " + (oi === cp.correct ? "good" : "bad");
      fb.style.color = "#fff";
      fb.textContent = cp.explain;
      body.appendChild(fb);
      const cont = document.createElement("button");
      cont.className = "btn btn-primary btn-small";
      cont.style.marginTop = "12px";
      cont.textContent = "Continue video";
      cont.addEventListener("click", () => {
        overlay.classList.remove("show");
        if (videoState.player) videoState.player.playVideo();
        checkVideoDone();
      });
      body.appendChild(cont);
    });
    li.appendChild(btn);
    ul.appendChild(li);
  });
  body.appendChild(ul);
}

let videoScore = { c: 0, t: 0 };
function videoCorrectTally(right, cp) {
  videoScore.t++;
  if (right) videoScore.c++;
  recordTally("video", videoScore.c, videoScore.t);
}

function checkVideoDone() {
  if (videoState.doneCheckpoints.size === VIDEO_CHECKPOINTS.length) {
    document.getElementById("video-next").disabled = false;
  }
}

function showAllVideoQuestionsAtOnce() {
  document.getElementById("video-manual-btn").style.display = "none";
  const overlay = document.getElementById("video-overlay");
  const body = document.getElementById("vq-body");
  overlay.classList.add("show");
  document.getElementById("vq-title").textContent = "Answer these about the video";
  body.innerHTML = "";
  const wrap = document.createElement("div");
  body.appendChild(wrap);
  renderQuiz(wrap, VIDEO_CHECKPOINTS.map(cp => ({ prompt: cp.prompt, options: cp.options, correct: cp.correct, explain: cp.explain })), "video", () => {
    document.getElementById("video-next").disabled = false;
    const doneBtn = document.createElement("button");
    doneBtn.className = "btn btn-primary btn-small";
    doneBtn.style.marginTop = "10px";
    doneBtn.textContent = "Close";
    doneBtn.addEventListener("click", () => overlay.classList.remove("show"));
    body.appendChild(doneBtn);
  });
}

/* ---------------------------------------------------------------
   12. Virtual histology lab
---------------------------------------------------------------- */
function setupLabScreen() {
  const questions = [
    { prompt: "Why do histologists stain tissue before looking at it under a microscope?", options: ["To make the tissue smell nicer", "Because unstained tissue is almost see-through and hard to tell apart", "To make the slide waterproof", "To kill any remaining cells"], correct: 1, explain: "Fresh tissue is nearly transparent under a microscope — stains add colour so structures stand out from each other." },
    { prompt: "An 'immune stain' (like the one you'll choose from) works by...", options: ["Randomly colouring everything the same colour", "Using an antibody that only sticks to one specific target, like a virus protein", "Melting the tissue", "Making the tissue glow automatically, with no target needed"], correct: 1, explain: "It's a very selective highlighter — the antibody only grabs onto its one matching target, so only that target lights up." }
  ];
  renderQuiz(document.getElementById("lab-quiz-1"), questions, "lab", () => {
    document.getElementById("lab-stain-heading").style.display = "block";
    document.getElementById("lab-stain-choices").style.display = "grid";
  });

  const choices = [
    { name: "General stain (H&E)", desc: "Colours the whole tissue pink and purple so you can see overall shape and structure.", good: false, result: "Good for seeing the overall shape of the lung tissue — but it won't confirm whether the virus is actually inside these cells. Try the other stain to be sure." },
    { name: "Immune stain for the virus", desc: "Only lights up if SARS-CoV-2 proteins are present in a cell.", good: true, result: "This is the right call. Because this stain only lights up cells that contain the virus, you can now confirm exactly where SARS-CoV-2 is hiding in the tissue." }
  ];
  const grid = document.getElementById("lab-stain-choices");
  choices.forEach(choice => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "choice-card";
    card.innerHTML = `<h4>${choice.name}</h4><p>${choice.desc}</p>`;
    card.addEventListener("click", () => {
      Sound.click();
      const resEl = document.getElementById("lab-stain-result");
      resEl.style.display = "block";
      resEl.textContent = choice.result;
      if (choice.good) {
        Sound.correct();
        document.getElementById("lab-next").disabled = false;
      } else {
        Sound.wrong();
      }
    });
    grid.appendChild(card);
  });
}

/* ---------------------------------------------------------------
   13. Cells to symptoms — pathway builder
---------------------------------------------------------------- */
function setupPathwayScreen() {
  const chips = [
    { id: "enter", text: "Virus spike proteins latch onto ACE2 receptors and enter airway cells" },
    { id: "infect", text: "The virus hijacks the cell's own machinery to make thousands of new virus copies" },
    { id: "damage", text: "Infected Type I and Type II pneumocytes are damaged or die" },
    { id: "fluid", text: "The immune response causes inflammation, filling alveoli with fluid and immune cells" },
    { id: "gas", text: "Thickened, fluid-filled alveolus walls make it harder for oxygen to cross into the blood" },
    { id: "symptom", text: "The patient feels short of breath and tired, with a lower blood-oxygen level" }
  ];
  const correctOrder = chips.map(c => c.id);
  const shuffled = [...chips].sort(() => Math.random() - 0.5);

  const bank = document.getElementById("pathway-bank");
  const track = document.getElementById("pathway-track");
  let chosen = [];

  function renderBank() {
    bank.innerHTML = "";
    shuffled.forEach(chip => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pathway-chip";
      btn.textContent = chip.text;
      btn.disabled = chosen.includes(chip.id);
      btn.addEventListener("click", () => {
        Sound.click();
        chosen.push(chip.id);
        renderAll();
      });
      bank.appendChild(btn);
    });
  }

  function renderTrack() {
    track.innerHTML = "";
    if (chosen.length === 0) {
      track.innerHTML = "<span style='color:var(--ink-soft);font-size:0.9rem;'>Click chips below to build the pathway, in order.</span>";
      return;
    }
    chosen.forEach((id, i) => {
      const chip = chips.find(c => c.id === id);
      const slot = document.createElement("div");
      slot.className = "pathway-slot";
      slot.innerHTML = `<span>${i + 1}. ${chip.text}</span>`;
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.setAttribute("aria-label", "Remove this step");
      removeBtn.textContent = "×";
      removeBtn.addEventListener("click", () => {
        Sound.click();
        chosen.splice(i, 1);
        renderAll();
      });
      slot.appendChild(removeBtn);
      track.appendChild(slot);
    });
  }

  function renderAll() { renderBank(); renderTrack(); }
  renderAll();

  document.getElementById("pathway-check").addEventListener("click", () => {
    Sound.click();
    const fb = document.getElementById("pathway-feedback");
    if (chosen.length !== correctOrder.length) {
      fb.textContent = "Add all the steps to the pathway before checking.";
      fb.className = "feedback bad";
      Sound.wrong();
      return;
    }
    const isRight = correctOrder.every((id, i) => id === chosen[i]);
    if (isRight) {
      fb.textContent = "That's the correct chain of events! You've explained exactly how COVID-19 damages the lungs.";
      fb.className = "feedback good";
      Sound.correct();
      document.getElementById("pathway-next").disabled = false;
    } else {
      fb.textContent = "Not quite the right order yet — remove any step with the × and try again.";
      fb.className = "feedback bad";
      Sound.wrong();
    }
  });
}

/* ---------------------------------------------------------------
   14. Final case review
---------------------------------------------------------------- */
function setupFinalScreen() {
  const questions = [
    { prompt: "Which organelle acts like the cell's control centre and holds its genetic instructions?", options: ["Mitochondria", "Nucleus", "Cytoplasm", "Cell membrane"], correct: 1, explain: "The nucleus stores the cell's DNA and directs its activities." },
    { prompt: "What is the main job of mitochondria?", options: ["Store genetic material", "Produce energy for the cell", "Form the cell's outer boundary", "Make new viruses"], correct: 1, explain: "Mitochondria are often called the 'powerhouse' of the cell — they produce most of its usable energy." },
    { prompt: "What controls what enters and leaves a cell?", options: ["The nucleus", "The cell membrane", "The cytoplasm", "A mitochondrion"], correct: 1, explain: "The cell membrane is a selective boundary — this is also what the virus's spike protein exploits." },
    { prompt: "Put in order from smallest to largest:", options: ["Organ → Tissue → Cell → System", "Cell → Tissue → Organ → System", "System → Organ → Cell → Tissue"], correct: 1, explain: "Cells build tissues, tissues build organs, organs build organ systems." },
    { prompt: "Where in the lung does oxygen actually cross into the blood?", options: ["The trachea", "The alveoli", "The diaphragm", "The bronchi"], correct: 1, explain: "Gas exchange happens across the very thin walls of the alveoli." },
    { prompt: "How does SARS-CoV-2 first get inside a lung cell?", options: ["It digs through the cell with legs", "Its spike protein binds to an ACE2 receptor on the cell membrane", "It enters through the nucleus directly", "It is absorbed by mitochondria"], correct: 1, explain: "The spike protein / ACE2 lock-and-key is the virus's entry point." },
    { prompt: "Why did the lab stain the tissue before examining it?", options: ["Unstained tissue is nearly transparent, so stains reveal structures", "To disinfect the slide", "Stains are only decorative", "Staining is not actually necessary"], correct: 0, explain: "Stains add contrast so structures like cells and their parts become visible." },
    { prompt: "Overall, why does a COVID-19 patient often feel short of breath?", options: ["Their bones are affected", "Damaged, fluid-filled alveoli make it harder for oxygen to cross into the blood", "Their nucleus stops working", "Their cell membranes disappear completely"], correct: 1, explain: "Inflammation and fluid buildup in the alveoli thicken the gas-exchange surface, reducing how much oxygen reaches the blood." }
  ];
  renderQuiz(document.getElementById("final-quiz"), questions, "final", () => {
    document.getElementById("final-next").disabled = false;
  });
}

/* ---------------------------------------------------------------
   15. Certificate & references
---------------------------------------------------------------- */
let certificateShown = false;
function finalizeCertificate() {
  const { c, t } = totalScore();
  document.getElementById("final-score-text").textContent = `${c} / ${t}`;
  if (!certificateShown) {
    certificateShown = true;
    Sound.yay();
  }
}

function setupCertificateScreen() {
  document.getElementById("btn-references").addEventListener("click", () => {
    Sound.click();
    document.getElementById("ref-modal").classList.add("show");
  });
  document.getElementById("ref-close").addEventListener("click", () => {
    Sound.click();
    document.getElementById("ref-modal").classList.remove("show");
  });
  document.getElementById("ref-modal").addEventListener("click", e => {
    if (e.target.id === "ref-modal") document.getElementById("ref-modal").classList.remove("show");
  });
  document.getElementById("btn-restart").addEventListener("click", () => {
    Sound.click();
    window.location.reload();
  });
}
