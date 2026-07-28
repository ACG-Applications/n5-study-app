// ==================== FLASHCARD MODULE ====================
let flashIndices = [],
  flashPos = 0;
let flashFuriganaHidden = false;
let flashShuffled = false;
let flashTranslationRevealed = false;
const flashJpDiv = document.getElementById("flashJp");
const flashTransDiv = document.getElementById("flashTranslation");
const flashModal = document.getElementById("flashcardModal");

// Update flashcard modal title with current sprint name
function updateFlashcardTitle() {
  const sprintName = sprints[activeSprintIndex].displayName;
  const modalTitle = document.getElementById("flashcardTitle");
  if (modalTitle) {
    modalTitle.innerHTML = `📇 ${sprintName} · Flashcards`;
  }
}

function rebuildFlash() {
  const { start, end } = sprints[activeSprintIndex];
  flashIndices = [];
  for (let i = start; i <= end; i++) {
    if (
      (typeof showMastered !== "undefined" && showMastered) ||
      !masteredSet.has(i)
    ) {
      flashIndices.push(i);
    } else if (typeof showMastered === "undefined") {
      flashIndices.push(i);
    }
  }
  if (!flashIndices.length) {
    for (let i = start; i <= end; i++) flashIndices.push(i);
  }
  flashShuffled = false;
  flashPos = 0;
}

function shuffleFlashcards() {
  if (!flashIndices.length) return;
  for (let i = flashIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flashIndices[i], flashIndices[j]] = [flashIndices[j], flashIndices[i]];
  }
  flashShuffled = true;
  flashPos = 0;
  showFlash(flashPos);
}

function resetFlashcardOrder() {
  rebuildFlash();
  if (flashIndices.length) showFlash(0);
}

/**
 * Get dictionary meaning for a word
 */
function getWordMeaning(word) {
  const dict = window.wordDict || null;
  if (!dict) return null;

  // Clean the word (remove furigana markers)
  const cleanWord = word.replace(/[（(][^）)]*[）)]/g, "").trim();

  // Try exact match
  if (dict[cleanWord]) {
    return dict[cleanWord].meaning;
  }
  if (dict[word]) {
    return dict[word].meaning;
  }

  // Try partial match - look for dictionary keys that are substrings
  const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (key.length > 1 && cleanWord.includes(key)) {
      return dict[key].meaning;
    }
  }

  // Try removing common suffixes
  if (cleanWord.endsWith("い")) {
    const base = cleanWord.slice(0, -1);
    if (dict[base]) return dict[base].meaning;
  }
  if (cleanWord.endsWith("な")) {
    const base = cleanWord.slice(0, -1);
    if (dict[base]) return dict[base].meaning;
  }

  return null;
}

/**
 * Wrap a word with tooltip HTML
 */
function wrapWordWithTooltip(word, meaning) {
  // Build display with furigana
  let displayWord = word;

  // Handle furigana format: kanji（ふりがな）
  displayWord = displayWord.replace(
    /([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g,
    (_, kanji, furigana) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>`,
  );
  displayWord = displayWord.replace(
    /([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g,
    (_, kanji, furigana) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>`,
  );

  // Check if this word contains a particle at the end
  const cleanWord = word.replace(/[（(][^）)]*[）)]/g, "").trim();
  // UPDATED: Match the whole particle (1-3 characters) at the end
  const particleMatch = cleanWord.match(
    /^(.*?)([はがをにでへとかからまでのもよねや]{1,3})$/,
  );

  if (particleMatch) {
    const before = particleMatch[1];
    const particle = particleMatch[2]; // Now captures the FULL particle (e.g., "から", "まで", "から")
    let beforeHtml = before;
    beforeHtml = beforeHtml.replace(
      /([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g,
      (_, kanji, furigana) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>`,
    );
    beforeHtml = beforeHtml.replace(
      /([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g,
      (_, kanji, furigana) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>`,
    );
    return `<span class="word-tooltip">${beforeHtml}<span class="particle-highlight">${particle}</span><span class="tooltip-text">${meaning}</span></span>`;
  }

  return `<span class="word-tooltip">${displayWord}<span class="tooltip-text">${meaning}</span></span>`;
}

/**
 * Wrap words with tooltips for flashcard display
 */
function wrapWordsWithTooltips(sentence) {
  if (!sentence || !sentence.jp) return "";

  const parts = sentence.jp.split(/\s+/);
  let result = "";

  for (const part of parts) {
    const meaning = getWordMeaning(part);

    if (meaning) {
      result += wrapWordWithTooltip(part, meaning);
    } else {
      // No meaning found - just display with furigana
      let displayPart = part;
      displayPart = displayPart.replace(
        /([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g,
        (_, kanji, furigana) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>`,
      );
      displayPart = displayPart.replace(
        /([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g,
        (_, kanji, furigana) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>`,
      );
      result += displayPart;
    }
    result += " ";
  }

  return result.trim();
}

function showFlash(pos) {
  if (!flashIndices.length || pos >= flashIndices.length) return;
  const idx = flashIndices[pos];
  const s = sentencesData[idx];
  const wrappedHtml = wrapWordsWithTooltips(s);
  flashJpDiv.innerHTML = wrappedHtml;
  flashJpDiv.classList.toggle("hide-furigana", flashFuriganaHidden);
  flashTransDiv.innerHTML = "???";
  document.getElementById("flashIndex").innerText = pos + 1;
  document.getElementById("flashTotal").innerText = flashIndices.length;
  flashJpDiv.onclick = () => speakText(s.reading);
  flashTranslationRevealed = false;
  const revealBtn = document.getElementById("revealTransBtn");
  if (revealBtn) revealBtn.innerText = "🔎 Reveal On";
}

// Update flashcard content when sprint changes
function updateFlashcardsForSprint() {
  if (flashModal && flashModal.style.display === "flex") {
    rebuildFlash();
    updateFlashcardTitle();
    if (flashIndices.length) showFlash(0);
  }
}

// Flashcard Speed Controls
document.getElementById("flashSpeed075Btn").onclick = () => {
  currentSpeechRate = 0.75;
  document.getElementById("flashSpeed075Btn").style.backgroundColor = "#6c8b6b";
  document.getElementById("flashSpeed100Btn").style.backgroundColor = "#555";
};

document.getElementById("flashSpeed100Btn").onclick = () => {
  currentSpeechRate = 1.0;
  document.getElementById("flashSpeed100Btn").style.backgroundColor = "#6c8b6b";
  document.getElementById("flashSpeed075Btn").style.backgroundColor = "#555";
};

// Initialize flashcard event listeners
document.getElementById("flashcardBtn").onclick = () => {
  rebuildFlash();
  updateFlashcardTitle();
  if (flashIndices.length) showFlash(0);
  flashModal.style.display = "flex";
};

document.getElementById("flashShuffleBtn").onclick = () => {
  shuffleFlashcards();
};

document.getElementById("flashResetOrderBtn").onclick = () => {
  resetFlashcardOrder();
};

document.getElementById("revealTransBtn").onclick = () => {
  const idx = flashIndices[flashPos];
  const btn = document.getElementById("revealTransBtn");
  if (!flashTranslationRevealed) {
    if (idx !== undefined)
      flashTransDiv.innerHTML = sentencesData[idx].translation;
    flashTranslationRevealed = true;
    btn.innerText = "🙈 Reveal Off";
  } else {
    flashTransDiv.innerHTML = "???";
    flashTranslationRevealed = false;
    btn.innerText = "🔎 Reveal On";
  }
};

document.getElementById("nextFlashBtn").onclick = () => {
  if (flashIndices.length) {
    flashPos = (flashPos + 1) % flashIndices.length;
    showFlash(flashPos);
  }
};

document.getElementById("prevFlashBtn").onclick = () => {
  if (flashIndices.length) {
    flashPos = (flashPos - 1 + flashIndices.length) % flashIndices.length;
    showFlash(flashPos);
  }
};

document.getElementById("closeFlashBtn").onclick = () => {
  flashModal.style.display = "none";
  if (typeof window.speechSynthesis !== "undefined") {
    window.speechSynthesis.cancel();
  }
};

document.getElementById("flashAudioBtn").onclick = () => {
  const idx = flashIndices[flashPos];
  if (idx !== undefined) speakText(sentencesData[idx].reading);
};

document.getElementById("flashFuriToggleBtn").onclick = () => {
  flashFuriganaHidden = !flashFuriganaHidden;
  flashJpDiv.classList.toggle("hide-furigana", flashFuriganaHidden);
  const btn = document.getElementById("flashFuriToggleBtn");
  btn.innerText = flashFuriganaHidden ? "🔤 Furigana On" : "🔤 Furigana Off";
};

// Set default speed button highlight
document.getElementById("flashSpeed100Btn").style.backgroundColor = "#6c8b6b";
