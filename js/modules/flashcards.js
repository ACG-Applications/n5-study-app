// ==================== FLASHCARD MODULE ====================
let flashIndices = [],
  flashPos = 0;
let flashFuriganaHidden = false;
let flashShuffled = false;
let flashTranslationRevealed = false;

const flashJpDiv = document.getElementById("flashJp");
const flashTransDiv = document.getElementById("flashTranslation");
const flashModal = document.getElementById("flashcardModal");

// ==================== DATA VALIDATION ====================

function ensureFlashcardData() {
  const checks = [
    { name: "sentencesData", exists: typeof sentencesData !== "undefined" },
    { name: "sprints", exists: typeof sprints !== "undefined" },
    { name: "masteredSet", exists: typeof masteredSet !== "undefined" },
  ];

  const missing = checks.filter((c) => !c.exists);
  if (missing.length > 0) {
    console.warn(
      "⚠️ Missing flashcard data:",
      missing.map((m) => m.name).join(", "),
    );
    return false;
  }
  return true;
}

function rebuildFlash() {
  if (!ensureFlashcardData()) {
    console.warn("⚠️ Cannot rebuild flashcards: data missing");
    return;
  }

  const { start, end } = sprints[activeSprintIndex];
  flashIndices = [];
  for (let i = start; i <= end; i++) {
    if (sentencesData[i]) {
      const isMastered = masteredSet.has(i);
      if (
        (typeof showMastered !== "undefined" && showMastered) ||
        !isMastered
      ) {
        flashIndices.push(i);
      }
    }
  }

  // If no cards, show all sentences in sprint
  if (!flashIndices.length) {
    for (let i = start; i <= end; i++) {
      if (sentencesData[i]) flashIndices.push(i);
    }
  }

  flashShuffled = false;
  flashPos = 0;
}

// ==================== KANJI HELPER FUNCTIONS ====================

function getUnicodeHex(kanji) {
  return kanji.codePointAt(0).toString(16).toUpperCase();
}

function getKanjiDefinition(kanji) {
  if (typeof getWordMeaning === "function") {
    const meaning = getWordMeaning(kanji);
    if (meaning) return meaning;
  }

  if (typeof kanjiData !== "undefined" && kanjiData.length) {
    const found = kanjiData.find((k) => k.kanji === kanji);
    if (found) return found.meaning;
  }

  return null;
}

function extractKanjiFromSentence(text) {
  if (!text) return [];
  const clean = text.replace(/[（(][^）)]*[）)]/g, "");
  const matches = clean.match(/[\u4e00-\u9faf\u3400-\u4dbf]/g);
  return matches ? [...new Set(matches)] : [];
}

// ==================== KANJI CHIPS ====================

function addKanjiChips() {
  const idx = flashIndices[flashPos];
  if (idx === undefined) return;

  const sentence = sentencesData[idx].jp || "";
  const kanjiList = extractKanjiFromSentence(sentence);

  const counterP = document.querySelector("#flashcardModal p");
  if (!counterP) {
    console.warn("⚠️ Could not find flashcard counter");
    return;
  }

  const existingContainer = document.getElementById("flashKanjiChips");
  if (existingContainer) {
    existingContainer.remove();
  }

  if (kanjiList.length === 0) return;

  const container = document.createElement("span");
  container.id = "flashKanjiChips";
  container.style.cssText = `
        display: inline-flex;
        gap: 4px;
        margin-left: 12px;
        flex-wrap: wrap;
        align-items: center;
    `;

  const label = document.createElement("span");
  label.textContent = "🖌️";
  label.style.cssText = `
        font-size: 0.75rem;
        color: #8a7b6e;
        margin-right: 2px;
    `;
  container.appendChild(label);

  kanjiList.forEach((kanji) => {
    const chip = document.createElement("span");
    chip.textContent = kanji;
    chip.style.cssText = `
            display: inline-block;
            padding: 2px 10px;
            background: #6c8b6b;
            color: white;
            border-radius: 40px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 500;
            transition: all 0.15s ease;
            font-family: inherit;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        `;
    chip.onmouseover = () => {
      chip.style.background = "#5a7a59";
      chip.style.transform = "translateY(-1px)";
      chip.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    };
    chip.onmouseout = () => {
      chip.style.background = "#6c8b6b";
      chip.style.transform = "translateY(0)";
      chip.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
    };
    chip.onclick = (e) => {
      e.stopPropagation();
      const unicode = getUnicodeHex(kanji);
      if (typeof showStrokeOrder === "function") {
        showStrokeOrder(kanji, unicode, "");
      } else {
        alert(
          `✍️ ${kanji}\nUnicode: ${unicode}\n\n(Stroke order viewer loading...)`,
        );
      }
    };
    container.appendChild(chip);
  });

  counterP.appendChild(container);
}

// ==================== END KANJI CHIPS ====================

function updateFlashcardTitle() {
  const sprintName = sprints[activeSprintIndex].displayName;
  const modalTitle = document.getElementById("flashcardTitle");
  if (modalTitle) {
    modalTitle.innerHTML = `📇 ${sprintName} · Flashcards`;
  }
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

function getWordMeaning(word) {
  const dict = window.wordDict || null;
  if (!dict) return null;

  const cleanWord = word.replace(/[（(][^）)]*[）)]/g, "").trim();

  if (dict[cleanWord]) {
    return dict[cleanWord].meaning;
  }
  if (dict[word]) {
    return dict[word].meaning;
  }

  const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (key.length > 1 && cleanWord.includes(key)) {
      return dict[key].meaning;
    }
  }

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

function wrapWordWithTooltip(word, meaning) {
  let displayWord = word;

  displayWord = displayWord.replace(
    /([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g,
    (_, kanji, furigana) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>`,
  );
  displayWord = displayWord.replace(
    /([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g,
    (_, kanji, furigana) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>`,
  );

  const cleanWord = word.replace(/[（(][^）)]*[）)]/g, "").trim();
  const particleMatch = cleanWord.match(
    /^(.*?)([はがをにでへとかからまでのもよねや]{1,3})$/,
  );

  if (particleMatch) {
    const before = particleMatch[1];
    const particle = particleMatch[2];
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

function wrapWordsWithTooltips(sentence) {
  if (!sentence || !sentence.jp) return "";

  const parts = sentence.jp.split(/\s+/);
  let result = "";

  for (const part of parts) {
    const meaning = getWordMeaning(part);

    if (meaning) {
      result += wrapWordWithTooltip(part, meaning);
    } else {
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
  if (revealBtn) revealBtn.innerText = "🔎 Reveal";

  const furiBtn = document.getElementById("flashFuriToggleBtn");
  if (furiBtn) {
    furiBtn.innerText = flashFuriganaHidden
      ? "🔤 Furigana On"
      : "🔤 Furigana Off";
  }

  addKanjiChips();
}

function updateFlashcardsForSprint() {
  if (flashModal && flashModal.style.display === "flex") {
    rebuildFlash();
    updateFlashcardTitle();
    if (flashIndices.length) showFlash(0);
  }
}

// ==================== EVENT LISTENERS ====================

// Speed Controls
document.getElementById("flashSpeed075Btn").onclick = function () {
  currentSpeechRate = 0.75;
  this.style.backgroundColor = "#6c8b6b";
  document.getElementById("flashSpeed100Btn").style.backgroundColor = "#555";
};

document.getElementById("flashSpeed100Btn").onclick = function () {
  currentSpeechRate = 1.0;
  this.style.backgroundColor = "#6c8b6b";
  document.getElementById("flashSpeed075Btn").style.backgroundColor = "#555";
};

// Flashcard Button - WAIT FOR DATA
document.getElementById("flashcardBtn").onclick = function () {
  if (typeof waitForData === "function") {
    waitForData(function () {
      rebuildFlash();
      updateFlashcardTitle();
      if (flashIndices.length) showFlash(0);
      flashModal.style.display = "flex";
    });
  } else {
    // Fallback: try direct
    rebuildFlash();
    updateFlashcardTitle();
    if (flashIndices.length) showFlash(0);
    flashModal.style.display = "flex";
  }
};

// Other flashcard controls
document.getElementById("flashShuffleBtn").onclick = shuffleFlashcards;
document.getElementById("flashResetOrderBtn").onclick = resetFlashcardOrder;

document.getElementById("revealTransBtn").onclick = function () {
  const idx = flashIndices[flashPos];
  const btn = this;
  if (!flashTranslationRevealed) {
    if (idx !== undefined)
      flashTransDiv.innerHTML = sentencesData[idx].translation;
    flashTranslationRevealed = true;
    btn.innerText = "🙈 Hide";
  } else {
    flashTransDiv.innerHTML = "???";
    flashTranslationRevealed = false;
    btn.innerText = "🔎 Reveal";
  }
};

document.getElementById("nextFlashBtn").onclick = function () {
  if (flashIndices.length) {
    flashPos = (flashPos + 1) % flashIndices.length;
    showFlash(flashPos);
  }
};

document.getElementById("prevFlashBtn").onclick = function () {
  if (flashIndices.length) {
    flashPos = (flashPos - 1 + flashIndices.length) % flashIndices.length;
    showFlash(flashPos);
  }
};

document.getElementById("closeFlashBtn").onclick = function () {
  const modal = document.getElementById("flashcardModal");
  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
    modal.style.visibility = "hidden";
    modal.style.opacity = "0";
    console.log("✅ Flashcard modal closed");
  }
  if (typeof window.speechSynthesis !== "undefined") {
    window.speechSynthesis.cancel();
  }
};

document.getElementById("flashAudioBtn").onclick = function () {
  const idx = flashIndices[flashPos];
  if (idx !== undefined) speakText(sentencesData[idx].reading);
};

document.getElementById("flashFuriToggleBtn").onclick = function () {
  flashFuriganaHidden = !flashFuriganaHidden;
  flashJpDiv.classList.toggle("hide-furigana", flashFuriganaHidden);
  this.innerText = flashFuriganaHidden ? "🔤 Furigana On" : "🔤 Furigana Off";
};

// Set default speed button highlight
document.getElementById("flashSpeed100Btn").style.backgroundColor = "#6c8b6b";

console.log("🃏 Flashcard module loaded");
