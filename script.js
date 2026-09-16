/* =========================================================
   COVID-19: INSIDE THE LUNG
   Version 1 JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------
     SECTION NAVIGATION
     ----------------------------- */

  const sections = {
    landing: document.getElementById("landing"),
    mission: document.getElementById("mission"),
    healthy: document.getElementById("healthy"),
    virus: document.getElementById("virus"),
    tissue: document.getElementById("tissue"),
    pathway: document.getElementById("pathway"),
    final: document.getElementById("final")
  };

  const stageNames = ["mission", "healthy", "virus", "tissue", "pathway", "final"];
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  let currentStage = 0;

  function showSection(id) {
    Object.values(sections).forEach(section => {
      section.classList.add("hidden");
    });

    sections[id].classList.remove("hidden");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    updateProgress(id);
  }

  function updateProgress(id) {
    const index = stageNames.indexOf(id);

    if (id === "landing") {
      progressText.textContent = "Investigation: 0 / 5";
      progressBar.style.width = "0%";
      return;
    }

    const completed = Math.max(0, Math.min(index, 5));
    progressText.textContent = `Investigation: ${completed} / 5`;
    progressBar.style.width = `${(completed / 5) * 100}%`;
  }

  document.getElementById("start-button").addEventListener("click", () => {
    currentStage = 0;
    showSection("mission");
  });

  document.querySelectorAll("[data-next]").forEach(button => {
    button.addEventListener("click", () => {
      showSection(button.dataset.next);
    });
  });


  /* -----------------------------
     1. ORGAN → TISSUE → CELL
     ----------------------------- */

  const orgInfo = document.getElementById("org-info");

  const organizationInfo = {
    organ: {
      title: "🫁 Organ: The lung",
      text: "Your lungs are organs made of many different tissues. Their job includes helping your body exchange oxygen and carbon dioxide."
    },
    tissue: {
      title: "🔬 Tissue: Alveolar tissue",
      text: "A tissue is a group of similar cells working together. Lung tissue contains cells organized to help the lungs perform their functions."
    },
    cell: {
      title: "🧫 Cell: Alveolar epithelial cell",
      text: "Cells are the basic units of living organisms. Different cells have specialized structures and jobs."
    }
  };

  document.querySelectorAll(".org-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".org-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const info = organizationInfo[card.dataset.org];

      orgInfo.innerHTML = `
        <h3>${info.title}</h3>
        <p>${info.text}</p>
      `;
    });
  });


  /* -----------------------------
     2. CELL HOTSPOTS
     ----------------------------- */

  const cellParts = {
    membrane: {
      name: "Cell membrane",
      text: "The cell membrane forms the cell's outer boundary and helps control what enters and leaves the cell."
    },
    nucleus: {
      name: "Nucleus",
      text: "The nucleus contains genetic information and helps control many activities of the cell."
    },
    mitochondria: {
      name: "Mitochondrion",
      text: "Mitochondria help provide usable energy for the cell."
    },
    cytoplasm: {
      name: "Cytoplasm",
      text: "Cytoplasm is the material inside the cell where many cellular activities occur."
    }
  };

  const foundParts = new Set();
  const partInfo = document.getElementById("part-info");
  const healthyComplete = document.getElementById("healthy-complete");

  document.querySelectorAll("[data-part]").forEach(hotspot => {
    hotspot.addEventListener("click", () => {
      const part = hotspot.dataset.part;
      const info = cellParts[part];

      foundParts.add(part);

      const foundElement = document.getElementById(`found-${part}`);
      foundElement.classList.add("found");
      foundElement.textContent = `✓ ${info.name}`;

      partInfo.innerHTML = `
        <strong>${info.name}</strong>
        <span>${info.text}</span>
      `;

      hotspot.style.background = "var(--success)";
      hotspot.style.transform = "scale(1.08)";

      if (foundParts.size === 4) {
        healthyComplete.classList.remove("hidden");
        partInfo.innerHTML += `
          <span style="color: var(--success); font-weight: 800;">
            🎉 You found all four!
          </span>
        `;
      }
    });
  });


  /* -----------------------------
     3. ACE2 QUIZ
     ----------------------------- */

  const ace2Feedback = document.getElementById("ace2-feedback");
  const mechanism = document.getElementById("mechanism");
  const virusComplete = document.getElementById("virus-complete");

  document.querySelectorAll("#ace2-answers .answer-button").forEach(button => {
    button.addEventListener("click", () => {
      const correct = button.dataset.correct === "true";

      document.querySelectorAll("#ace2-answers .answer-button").forEach(b => {
        b.classList.remove("correct", "incorrect");
      });

      if (correct) {
        button.classList.add("correct");
        ace2Feedback.className = "feedback success";
        ace2Feedback.innerHTML = `
          <strong>🟢 Correct!</strong><br>
          SARS-CoV-2's spike protein can bind to ACE2 on susceptible cells.
          This interaction can help the virus enter the cell.
        `;

        mechanism.classList.remove("hidden");
        virusComplete.classList.remove("hidden");
      } else {
        button.classList.add("incorrect");
        ace2Feedback.className = "feedback error";
        ace2Feedback.innerHTML = `
          <strong>🔴 Not quite.</strong><br>
          Try again. Think about a structure on the cell surface that could
          interact with a viral protein.
        `;
      }
    });
  });


  /* -----------------------------
     4. TISSUE HOTSPOTS
     ----------------------------- */

  const tissueInfo = {
    inflammation: {
      title: "Inflammatory cells",
      text: "Immune cells can accumulate in tissue during an inflammatory response."
    },
    walls: {
      title: "Thickened or altered alveolar walls",
      text: "Inflammation and injury can alter the normal structure of the thin walls involved in gas exchange."
    },
    fluid: {
      title: "Fluid or cellular debris",
      text: "Injury and inflammation can contribute to material accumulating in alveolar spaces."
    },
    architecture: {
      title: "Disrupted tissue organization",
      text: "Healthy lung tissue has an organized architecture that supports its function. Disease-associated injury can disturb that organization."
    }
  };

  const foundHotspots = new Set();
  const tissueCount = document.getElementById("tissue-count");
  const tissueProgressBar = document.getElementById("tissue-progress-bar");
  const tissueInfoBox = document.getElementById("tissue-info");
  const tissueComplete = document.getElementById("tissue-complete");

  document.querySelectorAll(".tissue-hotspot").forEach(hotspot => {
    hotspot.addEventListener("click", () => {
      const type = hotspot.dataset.hotspot;

      if (foundHotspots.has(type)) return;

      foundHotspots.add(type);
      hotspot.classList.add("found");
      hotspot.textContent = "✓";

      const info = tissueInfo[type];

      tissueInfoBox.innerHTML = `
        <strong>${info.title}</strong>
        <span>${info.text}</span>
      `;

      tissueCount.textContent = `${foundHotspots.size} / 4 found`;
      tissueProgressBar.style.width = `${(foundHotspots.size / 4) * 100}%`;

      if (foundHotspots.size === 4) {
        tissueInfoBox.innerHTML += `
          <span style="color: var(--success); font-weight: 800;">
            🎉 Tissue scan complete!
          </span>
        `;
        tissueComplete.classList.remove("hidden");
      }
    });
  });


  /* -----------------------------
     5. DRAG AND DROP PATHWAY
     ----------------------------- */

  const dragBank = document.getElementById("drag-bank");
  const dropZone = document.getElementById("drop-zone");
  const pathwayFeedback = document.getElementById("pathway-feedback");
  const pathwayComplete = document.getElementById("pathway-complete");

  let draggedCard = null;
  let pathwayOrder = [];

  document.querySelectorAll(".drag-card").forEach(card => {
    card.addEventListener("dragstart", event => {
      draggedCard = card;
      event.dataTransfer.effectAllowed = "move";
    });

    card.addEventListener("dragend", () => {
      draggedCard = null;
    });
  });

  dropZone.addEventListener("dragover", event => {
    event.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
  });

  dropZone.addEventListener("drop", event => {
    event.preventDefault();
    dropZone.classList.remove("drag-over");

    if (!draggedCard || draggedCard.classList.contains("used")) return;

    const placeholder = dropZone.querySelector(".drop-placeholder");
    if (placeholder) placeholder.remove();

    const clone = document.createElement("div");
    clone.className = "dropped-card";
    clone.textContent = draggedCard.textContent;
    clone.dataset.order = draggedCard.dataset.order;

    dropZone.appendChild(clone);
    draggedCard.classList.add("used");

    pathwayOrder.push(Number(draggedCard.dataset.order));

    checkPathway();
  });

  function checkPathway() {
    if (pathwayOrder.length < 5) {
      pathwayFeedback.className = "";
      pathwayFeedback.textContent = "";
      return;
    }

    const correct = pathwayOrder.every((value, index) => value === index + 1);

    if (correct) {
      pathwayFeedback.className = "feedback success";
      pathwayFeedback.innerHTML = `
        <strong>🎉 Correct!</strong><br>
        You connected the disease process from infection to cells,
        tissue changes, and possible symptoms.
      `;
      pathwayComplete.classList.remove("hidden");
    } else {
      pathwayFeedback.className = "feedback error";
      pathwayFeedback.innerHTML = `
        <strong>🔄 Not quite.</strong><br>
        The order isn't correct. Reload this activity and try thinking
        from the smallest level to the largest effect.
      `;
    }
  }


  /* -----------------------------
     6. FINAL CASE
     ----------------------------- */

  const finalFeedback = document.getElementById("final-feedback");
  const completion = document.getElementById("completion");

  document.querySelectorAll(".final-answer").forEach(button => {
    button.addEventListener("click", () => {
      const correct = button.dataset.correct === "true";

      document.querySelectorAll(".final-answer").forEach(b => {
        b.classList.remove("correct", "incorrect");
      });

      if (correct) {
        button.classList.add("correct");

        finalFeedback.className = "feedback success";
        finalFeedback.innerHTML = `
          <strong>🟢 Case solved!</strong><br>
          Infection and the resulting inflammatory response can cause
          lung injury and changes to tissue structure and function.
        `;

        completion.classList.remove("hidden");

        progressText.textContent = "Investigation: 5 / 5";
        progressBar.style.width = "100%";
      } else {
        button.classList.add("incorrect");

        finalFeedback.className = "feedback error";
        finalFeedback.innerHTML = `
          <strong>🔎 Keep investigating.</strong><br>
          Think about the connection between infected cells, inflammation,
          tissue structure, and lung function.
        `;
      }
    });
  });


  /* -----------------------------
     RESTART
     ----------------------------- */

  document.getElementById("restart-button").addEventListener("click", () => {
    window.location.reload();
  });

});
