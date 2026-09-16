/* =========================================================
   COVID-19: INSIDE THE LUNG — VERSION 2
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const sections = {
    landing: document.getElementById("landing"),
    mission: document.getElementById("mission"),
    healthy: document.getElementById("healthy"),
    virus: document.getElementById("virus"),
    video: document.getElementById("video"),
    slide: document.getElementById("slide"),
    tissue: document.getElementById("tissue"),
    pathway: document.getElementById("pathway"),
    final: document.getElementById("final")
  };

  const stageNames = ["mission","healthy","virus","video","slide","tissue","pathway","final"];
  let currentSection = "landing";
  let soundOn = true;

  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  const toast = document.getElementById("toast");

  /* ---------- tiny Web Audio feedback ---------- */

  let audioCtx = null;

  function beep(type = "click") {
    if (!soundOn) return;
    try {
      audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const settings = {
        click: [420, 0.045],
        correct: [720, 0.12],
        wrong: [180, 0.13],
        complete: [880, 0.20]
      }[type];

      osc.frequency.value = settings[0];
      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + settings[1]);
      osc.start();
      osc.stop(audioCtx.currentTime + settings[1] + 0.02);
    } catch (_) {}
  }

  document.getElementById("sound-toggle").addEventListener("click", () => {
    soundOn = !soundOn;
    document.getElementById("sound-toggle").textContent = soundOn ? "🔊" : "🔇";
    if (soundOn) beep("click");
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1800);
  }

  /* ---------- section navigation ---------- */

  function updateProgress(id) {
    if (id === "landing") {
      progressText.textContent = "Investigation: 0 / 7";
      progressBar.style.width = "0%";
      return;
    }
    const index = stageNames.indexOf(id);
    const completed = Math.max(0, Math.min(index, 7));
    progressText.textContent = `Investigation: ${completed} / 7`;
    progressBar.style.width = `${(completed / 7) * 100}%`;
  }

  function showSection(id) {
    if (!sections[id]) return;

    Object.values(sections).forEach(section => {
      section.classList.add("hidden");
      section.classList.remove("entering");
    });

    sections[id].classList.remove("hidden");
    void sections[id].offsetWidth;
    sections[id].classList.add("entering");

    currentSection = id;
    updateProgress(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
    beep("click");
  }

  document.getElementById("start-button").addEventListener("click", () => showSection("mission"));
  document.getElementById("home-button").addEventListener("click", () => showSection("landing"));

  document.querySelectorAll("[data-next]").forEach(button => {
    button.addEventListener("click", () => showSection(button.dataset.next));
  });

  document.querySelectorAll("[data-prev]").forEach(button => {
    button.addEventListener("click", () => showSection(button.dataset.prev));
  });


  /* ---------- organ/tissue/cell ---------- */

  const orgInfo = document.getElementById("org-info");
  const organizationInfo = {
    organ: ["🫁 Organ: The lung", "Your lungs are organs made of many different tissues. Their functions include helping your body exchange oxygen and carbon dioxide."],
    tissue: ["🔬 Tissue: Alveolar tissue", "A tissue is a group of similar cells working together. Lung tissue contains cells organized to help the lungs perform their functions."],
    cell: ["🧫 Cell: Alveolar epithelial cell", "Cells are the basic units of living organisms. Different cells have specialized structures and jobs."]
  };

  document.querySelectorAll(".org-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".org-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      const info = organizationInfo[card.dataset.org];
      orgInfo.innerHTML = `<h3>${info[0]}</h3><p>${info[1]}</p>`;
      beep("click");
    });
  });


  /* ---------- cell hotspots ---------- */

  const cellParts = {
    membrane: ["Cell membrane", "The cell membrane forms the cell's outer boundary and helps control what enters and leaves the cell."],
    nucleus: ["Nucleus", "The nucleus contains genetic information and helps control many activities of the cell."],
    mitochondria: ["Mitochondrion", "Mitochondria help provide usable energy for the cell."],
    cytoplasm: ["Cytoplasm", "Cytoplasm is the material inside the cell where many cellular activities occur."]
  };

  const foundParts = new Set();
  const partInfo = document.getElementById("part-info");

  document.querySelectorAll("[data-part]").forEach(hotspot => {
    hotspot.addEventListener("click", () => {
      const key = hotspot.dataset.part;
      const info = cellParts[key];
      foundParts.add(key);

      const item = document.getElementById(`found-${key}`);
      item.classList.add("found");
      item.textContent = `✓ ${info[0]}`;

      hotspot.style.background = "var(--success)";
      hotspot.textContent = "✓";
      partInfo.innerHTML = `<strong>${info[0]}</strong><span>${info[1]}</span>`;
      beep("correct");

      if (foundParts.size === 4) {
        document.getElementById("healthy-complete").classList.remove("hidden");
        partInfo.innerHTML += `<span style="color:var(--success);font-weight:800">🎉 All four found!</span>`;
      }
    });
  });


  /* ---------- ACE2 ---------- */

  document.querySelectorAll("#ace2-answers .answer-button").forEach(button => {
    button.addEventListener("click", () => {
      const correct = button.dataset.correct === "true";
      document.querySelectorAll("#ace2-answers .answer-button").forEach(b => b.classList.remove("correct","incorrect"));

      const feedback = document.getElementById("ace2-feedback");
      if (correct) {
        button.classList.add("correct");
        feedback.className = "feedback success";
        feedback.innerHTML = "<strong>🟢 Correct!</strong><br>SARS-CoV-2's spike protein can bind to ACE2 on susceptible cells. This interaction can help the virus enter the cell.";
        document.getElementById("mechanism").classList.remove("hidden");
        document.getElementById("virus-complete").classList.remove("hidden");
        beep("correct");
      } else {
        button.classList.add("incorrect");
        feedback.className = "feedback error";
        feedback.innerHTML = "<strong>🔴 Not quite.</strong><br>Think about a structure on the cell surface that could interact with a viral protein.";
        beep("wrong");
      }
    });
  });


  /* ---------- video quiz ---------- */

  let videoAnswers = {1:null, 2:null};

  document.getElementById("unlock-video-quiz").addEventListener("click", () => {
    if (!document.getElementById("video-watched").checked) {
      showToast("Check the box after you finish watching the video.");
      beep("wrong");
      return;
    }
    document.getElementById("video-quiz").classList.remove("hidden");
    showToast("Questions unlocked!");
    beep("correct");
  });

  document.querySelectorAll(".video-answer").forEach(button => {
    button.addEventListener("click", () => {
      const q = Number(button.dataset.q);
      const correct = button.dataset.correct === "true";
      document.querySelectorAll(`.video-answer[data-q="${q}"]`).forEach(b => b.classList.remove("correct","incorrect"));
      button.classList.add(correct ? "correct" : "incorrect");
      videoAnswers[q] = correct;

      const feedback = document.getElementById("video-feedback");
      const answered = Object.values(videoAnswers).filter(v => v !== null).length;

      if (correct) {
        feedback.className = "feedback success";
        feedback.textContent = answered < 2 ? "Correct! Keep going." : "🎉 Both video questions correct!";
        beep("correct");
      } else {
        feedback.className = "feedback error";
        feedback.textContent = "Not quite. Rewatch the relevant part and try again.";
        beep("wrong");
      }

      if (videoAnswers[1] === true && videoAnswers[2] === true) {
        document.getElementById("video-complete").classList.remove("hidden");
      }
    });
  });


  /* ---------- virtual slide lab ---------- */

  const slideSteps = [
    {
      icon:"🫁", title:"Choose a lung tissue sample",
      desc:"You need a piece of lung tissue containing alveoli to investigate.",
      options:[
        ["A lung tissue section containing alveoli","correct"],
        ["A random piece of plastic","wrong"],
        ["A shoe sole","wrong"]
      ]
    },
    {
      icon:"🧊", title:"Fix the tissue",
      desc:"Fixation preserves the tissue's structure so it can be processed.",
      options:[
        ["Fix the tissue with an appropriate fixative","correct"],
        ["Leave the tissue in the sun","wrong"],
        ["Blend the tissue into a liquid","wrong"]
      ]
    },
    {
      icon:"🔪", title:"Cut a thin section",
      desc:"A histology section must be thin enough for light to pass through it.",
      options:[
        ["Cut a very thin tissue section","correct"],
        ["Cut a 5 cm thick slice","wrong"],
        ["Skip sectioning completely","wrong"]
      ]
    },
    {
      icon:"🎨", title:"Stain and mount the section",
      desc:"A stain can increase contrast and make cells and tissue structures easier to see.",
      options:[
        ["Stain the section and mount it on a slide","correct"],
        ["Paint the slide with a marker","wrong"],
        ["Cover it with glue only","wrong"]
      ]
    },
    {
      icon:"🔬", title:"Examine the slide",
      desc:"Now you can examine tissue architecture under a microscope.",
      options:[
        ["Use a microscope to examine the tissue","correct"],
        ["Use your eyes from across the room","wrong"],
        ["Throw the slide away","wrong"]
      ]
    }
  ];

  let slideStep = 0;

  function renderSlideStep() {
    const step = slideSteps[slideStep];
    document.getElementById("slide-step-text").textContent = `Step ${slideStep + 1} of ${slideSteps.length}`;
    document.getElementById("slide-progress-bar").style.width = `${((slideStep + 1) / slideSteps.length) * 100}%`;
    document.getElementById("lab-icon").textContent = step.icon;
    document.getElementById("lab-title").textContent = step.title;
    document.getElementById("lab-description").textContent = step.desc;
    document.getElementById("lab-feedback").className = "feedback";
    document.getElementById("lab-feedback").textContent = "";

    const options = document.getElementById("lab-options");
    options.innerHTML = "";

    step.options.forEach(([text, state]) => {
      const button = document.createElement("button");
      button.className = "lab-option";
      button.textContent = text;
      button.addEventListener("click", () => {
        if (state === "correct") {
          button.classList.add("correct");
          document.getElementById("lab-feedback").className = "feedback success";
          document.getElementById("lab-feedback").innerHTML = "<strong>🟢 Correct!</strong> Move to the next lab step.";
          beep("correct");

          setTimeout(() => {
            slideStep++;
            if (slideStep < slideSteps.length) {
              renderSlideStep();
            } else {
              document.getElementById("slide-lab").classList.add("hidden");
              document.getElementById("slide-final-choice").classList.remove("hidden");
            }
          }, 650);
        } else {
          button.classList.add("incorrect");
          document.getElementById("lab-feedback").className = "feedback error";
          document.getElementById("lab-feedback").textContent = "Not quite. Think about what a histologist needs at this stage.";
          beep("wrong");
        }
      });
      options.appendChild(button);
    });
  }

  renderSlideStep();

  document.querySelectorAll(".slide-answer").forEach(button => {
    button.addEventListener("click", () => {
      const correct = button.dataset.correct === "true";
      document.querySelectorAll(".slide-answer").forEach(b => b.classList.remove("correct","incorrect"));

      const feedback = document.getElementById("slide-final-feedback");

      if (correct) {
        button.classList.add("correct");
        feedback.className = "feedback success";
        feedback.innerHTML = "<strong>🟢 Excellent!</strong><br>Immunohistochemical staining can use antibodies to detect viral proteins in tissue. H&E remains useful for seeing tissue damage and architecture.";
        document.getElementById("slide-complete").classList.remove("hidden");
        beep("complete");
      } else {
        button.classList.add("incorrect");
        feedback.className = "feedback error";
        feedback.innerHTML = "<strong>🔎 Think about specificity.</strong><br>Routine H&E shows tissue structure, but a virus-specific stain can identify viral antigen.";
        beep("wrong");
      }
    });
  });


  /* ---------- real tissue hotspots ---------- */

  const tissueInfo = {
    damage: ["Panel C: diffuse alveolar damage", "This panel shows an exudative phase of diffuse alveolar damage with hyaline membranes lining alveolar spaces."],
    pneumocytes: ["Panel D: type II pneumocyte proliferation", "This panel shows proliferation of type II pneumocytes, a change described in the proliferative phase of diffuse alveolar damage."],
    atypical: ["Panel E: atypical pneumocytes", "This panel shows atypical pneumocytes with enlarged and multiple nuclei and expanded cytoplasm."],
    inflammation: ["Panel F: bronchopneumonia", "This panel shows bronchopneumonia with alveolar spaces containing neutrophils and areas of hemorrhage."]
  };

  const foundTissue = new Set();

  document.querySelectorAll(".photo-hotspot").forEach(button => {
    button.addEventListener("click", () => {
      const key = button.dataset.hotspot;
      const info = tissueInfo[key];

      foundTissue.add(key);
      button.classList.add("found");
      button.textContent = "✓";

      document.getElementById("tissue-info").innerHTML = `<strong>${info[0]}</strong><span>${info[1]}</span>`;
      document.getElementById("tissue-count").textContent = `${foundTissue.size} / 4 found`;
      document.getElementById("tissue-progress-bar").style.width = `${(foundTissue.size / 4) * 100}%`;
      beep("correct");

      if (foundTissue.size === 4) {
        document.getElementById("tissue-info").innerHTML += `<span style="color:var(--success);font-weight:800">🎉 Tissue scan complete!</span>`;
        document.getElementById("tissue-complete").classList.remove("hidden");
      }
    });
  });


  /* ---------- drag/drop pathway with remove ---------- */

  const dropZone = document.getElementById("drop-zone");
  const dragBank = document.getElementById("drag-bank");
  let draggedCard = null;
  let pathwayOrder = [];

  function updatePathway() {
    const cards = [...dropZone.querySelectorAll(".dropped-card")];
    pathwayOrder = cards.map(card => Number(card.dataset.order));

    document.getElementById("pathway-status").textContent = `${cards.length} / 5 placed`;

    if (cards.length === 0) {
      dropZone.innerHTML = '<div class="drop-placeholder">Drag cards here in order</div>';
    }

    if (cards.length < 5) {
      document.getElementById("pathway-feedback").className = "feedback";
      document.getElementById("pathway-feedback").textContent = "";
      return;
    }

    const correct = pathwayOrder.every((value,index) => value === index + 1);
    if (correct) {
      document.getElementById("pathway-feedback").className = "feedback success";
      document.getElementById("pathway-feedback").innerHTML = "<strong>🎉 Correct!</strong><br>You connected the disease process from infection to cells, tissue changes, and possible symptoms.";
      document.getElementById("pathway-complete").classList.remove("hidden");
      beep("complete");
    } else {
      document.getElementById("pathway-feedback").className = "feedback error";
      document.getElementById("pathway-feedback").innerHTML = "<strong>🔄 The order needs another look.</strong><br>Use the × buttons to remove cards and try again.";
      beep("wrong");
    }
  }

  document.querySelectorAll(".drag-card").forEach(card => {
    card.addEventListener("dragstart", event => {
      draggedCard = card;
      event.dataTransfer.effectAllowed = "move";
    });
  });

  dropZone.addEventListener("dragover", event => {
    event.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));

  dropZone.addEventListener("drop", event => {
    event.preventDefault();
    dropZone.classList.remove("drag-over");
    if (!draggedCard || draggedCard.classList.contains("used")) return;

    const placeholder = dropZone.querySelector(".drop-placeholder");
    if (placeholder) placeholder.remove();

    const clone = document.createElement("div");
    clone.className = "dropped-card";
    clone.dataset.order = draggedCard.dataset.order;

    const text = document.createElement("span");
    text.textContent = draggedCard.textContent;

    const remove = document.createElement("button");
    remove.className = "remove-card";
    remove.textContent = "×";
    remove.title = "Remove this card";
    remove.addEventListener("click", () => {
      draggedCard.classList.remove("used");
      clone.remove();
      updatePathway();
      beep("click");
    });

    clone.appendChild(text);
    clone.appendChild(remove);
    dropZone.appendChild(clone);
    draggedCard.classList.add("used");
    updatePathway();
    beep("click");
  });

  document.getElementById("reset-pathway").addEventListener("click", () => {
    document.querySelectorAll(".drag-card").forEach(card => card.classList.remove("used"));
    dropZone.innerHTML = '<div class="drop-placeholder">Drag cards here in order</div>';
    pathwayOrder = [];
    document.getElementById("pathway-status").textContent = "0 / 5 placed";
    document.getElementById("pathway-feedback").className = "feedback";
    document.getElementById("pathway-feedback").textContent = "";
    document.getElementById("pathway-complete").classList.add("hidden");
    beep("click");
  });


  /* ---------- final case ---------- */

  document.querySelectorAll(".final-answer").forEach(button => {
    button.addEventListener("click", () => {
      const correct = button.dataset.correct === "true";
      document.querySelectorAll(".final-answer").forEach(b => b.classList.remove("correct","incorrect"));

      const feedback = document.getElementById("final-feedback");

      if (correct) {
        button.classList.add("correct");
        feedback.className = "feedback success";
        feedback.innerHTML = "<strong>🟢 Case solved!</strong><br>Infection and the resulting inflammatory response can cause lung injury and changes to tissue structure and function.";
        document.getElementById("completion").classList.remove("hidden");
        progressText.textContent = "Investigation: 7 / 7";
        progressBar.style.width = "100%";
        beep("complete");
      } else {
        button.classList.add("incorrect");
        feedback.className = "feedback error";
        feedback.innerHTML = "<strong>🔎 Keep investigating.</strong><br>Think about the connection between infected cells, inflammation, tissue structure, and lung function.";
        beep("wrong");
      }
    });
  });

  document.getElementById("restart-button").addEventListener("click", () => window.location.reload());
});
