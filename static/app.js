const workoutInput = document.querySelector("#workout-input");
const generateButton = document.querySelector("#generate-button");
const globalMessage = document.querySelector("#global-message");
const centerCards = [...document.querySelectorAll(".center-card")];
const generateCenterCheckboxes = [...document.querySelectorAll(".generate-center-checkbox")];

function setMessage(node, message, isError = false) {
  node.textContent = message;
  node.style.color = isError ? "#9b2226" : "";
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Ha ocurrido un error inesperado.");
  }
  return data;
}

function collectCenterForm(card) {
  const fields = ["name", "class_size", "available_equipment", "permanent_feedback"];
  return Object.fromEntries(
    fields.map((field) => [field, card.querySelector(`[data-field="${field}"]`).value.trim()])
  );
}

function updateCenterResult(card, text, createdAt) {
  card.querySelector(".result-output").value = text;
  setMessage(card.querySelector(".center-message"), `Ultima generacion guardada: ${createdAt}`);
}

function updateCenterBriefing(card, text) {
  card.querySelector(".briefing-output").value = text;
}

function selectedCenterIds() {
  return generateCenterCheckboxes
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => Number(checkbox.value));
}

function collectTemporaryMaterialBlocks() {
  const blocks = {};
  centerCards.forEach((card) => {
    const centerId = Number(card.dataset.centerId);
    const value = card.querySelector(".temporary-material-block-input").value.trim();
    if (value) {
      blocks[centerId] = value;
    }
  });
  return blocks;
}

async function handleGenerate() {
  const workoutText = workoutInput.value.trim();
  const centerIds = selectedCenterIds();

  if (!workoutText) {
    setMessage(globalMessage, "Pega primero un entrenamiento completo.", true);
    return;
  }

  if (centerIds.length === 0) {
    setMessage(globalMessage, "Elige al menos un centro para generar.", true);
    return;
  }

  generateButton.disabled = true;
  setMessage(globalMessage, `Generando ${centerIds.length} centro${centerIds.length === 1 ? "" : "s"} seleccionado${centerIds.length === 1 ? "" : "s"}...`);

  try {
    const data = await postJson("/api/generate", {
      workout_text: workoutText,
      center_ids: centerIds,
      temporary_material_blocks: collectTemporaryMaterialBlocks(),
    });
    data.results.forEach((result) => {
      const card = document.querySelector(`[data-center-id="${result.center_id}"]`);
      updateCenterResult(card, result.full_output, result.generation.created_at);
      updateCenterBriefing(card, result.briefing);
    });
    setMessage(globalMessage, "Generacion completada y guardada para los centros seleccionados.");
  } catch (error) {
    setMessage(globalMessage, error.message, true);
  } finally {
    generateButton.disabled = false;
  }
}

async function handleSaveCenter(card) {
  const centerId = card.dataset.centerId;
  const button = card.querySelector(".save-center-button");
  const message = card.querySelector(".center-message");
  button.disabled = true;
  setMessage(message, "Guardando configuracion del centro...");

  try {
    await postJson(`/api/centers/${centerId}`, collectCenterForm(card));
    setMessage(message, "Configuracion guardada. Se usara en las siguientes generaciones.");
  } catch (error) {
    setMessage(message, error.message, true);
  } finally {
    button.disabled = false;
  }
}

async function handleSaveMemory(card, regenerate) {
  const centerId = card.dataset.centerId;
  const message = card.querySelector(".center-message");
  const button = regenerate
    ? card.querySelector(".save-feedback-regenerate-button")
    : card.querySelector(".save-feedback-button");

  button.disabled = true;
  setMessage(message, regenerate ? "Guardando memoria y regenerando..." : "Guardando memoria...");

  try {
    await postJson(`/api/centers/${centerId}`, collectCenterForm(card));

    if (!regenerate) {
      setMessage(message, "Memoria guardada. Se usara en las proximas generaciones.");
      return;
    }

    const workoutText = workoutInput.value.trim();
    if (!workoutText) {
      setMessage(message, "Memoria guardada. Pega un entrenamiento si quieres regenerar ahora.", true);
      return;
    }

    const data = await postJson("/api/generate", {
      workout_text: workoutText,
      center_ids: [Number(centerId)],
      temporary_material_blocks: collectTemporaryMaterialBlocks(),
    });

    const result = data.results[0];
    updateCenterResult(card, result.full_output, result.generation.created_at);
    updateCenterBriefing(card, result.briefing);
    setMessage(message, "Memoria guardada y centro regenerado con la nueva memoria.");
  } catch (error) {
    setMessage(message, error.message, true);
  } finally {
    button.disabled = false;
  }
}

async function handleCopy(card) {
  const output = card.querySelector(".result-output").value;
  const message = card.querySelector(".center-message");

  if (!output.trim()) {
    setMessage(message, "Todavia no hay resultado para copiar.", true);
    return;
  }

  try {
    await navigator.clipboard.writeText(output);
    setMessage(message, "Resultado copiado al portapapeles.");
  } catch (error) {
    setMessage(message, "No se pudo copiar automaticamente. Puedes copiarlo manualmente.", true);
  }
}

async function handleCopyBriefing(card) {
  const output = card.querySelector(".briefing-output").value;
  const message = card.querySelector(".center-message");

  if (!output.trim()) {
    setMessage(message, "Todavia no hay briefing para copiar.", true);
    return;
  }

  try {
    await navigator.clipboard.writeText(output);
    setMessage(message, "Briefing copiado al portapapeles.");
  } catch (error) {
    setMessage(message, "No se pudo copiar automaticamente. Puedes copiarlo manualmente.", true);
  }
}

generateButton.addEventListener("click", handleGenerate);

centerCards.forEach((card) => {
  const toggleButton = card.querySelector(".config-toggle-button");
  const configPanel = card.querySelector(".center-config-panel");
  toggleButton.addEventListener("click", () => {
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    toggleButton.setAttribute("aria-expanded", isExpanded ? "false" : "true");
    toggleButton.textContent = isExpanded ? "Ver configuracion" : "Ocultar configuracion";
    configPanel.hidden = isExpanded;
  });

  card.querySelector(".save-center-button").addEventListener("click", () => handleSaveCenter(card));
  card.querySelector(".save-feedback-button").addEventListener("click", () => handleSaveMemory(card, false));
  card.querySelector(".save-feedback-regenerate-button").addEventListener("click", () => handleSaveMemory(card, true));
  card.querySelector(".copy-button").addEventListener("click", () => handleCopy(card));
  card.querySelector(".copy-briefing-button").addEventListener("click", () => handleCopyBriefing(card));
});
