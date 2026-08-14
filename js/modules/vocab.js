// ==================== VOCAB MODULE ====================

let vocabDeck = [];
let vocabCurrentIndex = 0;
let vocabIsFlipped = false;
let vocabMastered = new Set();
let vocabFuriganaHidden = false;

// DOM Elements
const vocabModal = document.getElementById("vocabModal");
const vocabWord = document.getElementById("vocabWord");
const vocabReading = document.getElementById("vocabReading");
const vocabMeaning = document.getElementById("vocabMeaning");
const vocabCard = document.getElementById("vocabCard");
const vocabIndex = document.getElementById("vocabIndex");
const vocabTotal = document.getElementById("vocabTotal");
const vocabMasteredCount = document.getElementById("vocabMasteredCount");
const vocabOpenBtn = document.getElementById("vocabBtn");
const vocabCloseBtn = document.getElementById("closeVocabBtn");
const vocabPrevBtn = document.getElementById("vocabPrevBtn");
const vocabNextBtn = document.getElementById("vocabNextBtn");
const vocabFlipBtn = document.getElementById("vocabFlipBtn");
const vocabShuffleBtn = document.getElementById("vocabShuffleBtn");
const vocabResetBtn = document.getElementById("vocabResetBtn");
const vocabAudioBtn = document.getElementById("vocabAudioBtn");
const vocabMasteredBtn = document.getElementById("vocabMasteredBtn");
const vocabFuriToggleBtn = document.getElementById("vocabFuriToggleBtn");

// ==================== DATA VALIDATION ====================

function ensureVocabData() {
  const checks = [
    { name: "sentencesData", exists: typeof sentencesData !== "undefined" },
    { name: "wordDict", exists: typeof wordDict !== "undefined" },
    { name: "sprints", exists: typeof sprints !== "undefined" },
    { name: "masteredSet", exists: typeof masteredSet !== "undefined" },
  ];

  const missing = checks.filter((c) => !c.exists);
  if (missing.length > 0) {
    console.warn(
      "⚠️ Missing vocab data:",
      missing.map((m) => m.name).join(", "),
    );
    return false;
  }
  return true;
}

// ==================== HELPER FUNCTIONS ====================

function loadMasteredVocab() {
  try {
    const stored = localStorage.getItem("vocabMastered");
    if (stored) {
      vocabMastered = new Set(JSON.parse(stored));
    }
  } catch (e) {
    console.warn("⚠️ Could not load mastered vocab:", e);
    vocabMastered = new Set();
  }
}

function saveMasteredVocab() {
  try {
    localStorage.setItem("vocabMastered", JSON.stringify([...vocabMastered]));
  } catch (e) {
    console.warn("⚠️ Could not save mastered vocab:", e);
  }
  updateVocabUI();
}

function getUnicodeHex(kanji) {
  return kanji.codePointAt(0).toString(16).toUpperCase();
}

function extractKanjiFromWord(text) {
  if (!text) return [];
  const clean = text.replace(/[（(][^）)]*[）)]/g, "");
  const matches = clean.match(/[\u4e00-\u9faf\u3400-\u4dbf]/g);
  return matches ? [...new Set(matches)] : [];
}

function extractWordsFromSentence(text) {
  if (!text) return [];
  const clean = text.replace(/[（(][^）)]*[）)]/g, "").trim();
  const words = clean.split(/[\s,、。！？]+/);
  return words
    .map((w) => w.replace(/[、。，,、！!？?、]/g, "").trim())
    .filter((w) => w.length > 0);
}

function isKanji(char) {
  const code = char.charCodeAt(0);
  return (
    (code >= 0x4e00 && code <= 0x9faf) || (code >= 0x3400 && code <= 0x4dbf)
  );
}

function buildVocabFuriganaHTML(word, reading) {
  if (!word) return word;
  if (!reading) return word;

  const chars = word.split("");
  let result = "";

  const kanjiIndices = [];
  chars.forEach((char, idx) => {
    if (isKanji(char)) {
      kanjiIndices.push(idx);
    }
  });

  if (kanjiIndices.length === 0) {
    return word;
  }

  let readingChars = reading.replace(/[（）()]/g, "").split("");

  if (kanjiIndices.length === 1) {
    const idx = kanjiIndices[0];
    for (let i = 0; i < chars.length; i++) {
      if (i === idx) {
        result += `<ruby>${chars[i]}<rt>${reading}</rt></ruby>`;
      } else {
        result += chars[i];
      }
    }
    return result;
  }

  const totalKanji = kanjiIndices.length;
  const baseLen = Math.floor(readingChars.length / totalKanji);
  let extra = readingChars.length - baseLen * totalKanji;

  let readingPos = 0;
  for (let i = 0; i < chars.length; i++) {
    if (kanjiIndices.includes(i)) {
      let len = baseLen + (extra > 0 ? 1 : 0);
      if (extra > 0) extra--;
      const furigana = readingChars
        .slice(readingPos, readingPos + len)
        .join("");
      result += `<ruby>${chars[i]}<rt>${furigana}</rt></ruby>`;
      readingPos += len;
    } else {
      result += chars[i];
    }
  }

  return result;
}

// ==================== CORE FUNCTIONS ====================

function buildVocabDeck() {
  if (!ensureVocabData()) return [];

  const sprint = sprints[activeSprintIndex];
  if (!sprint) {
    console.warn("⚠️ No sprint found for index:", activeSprintIndex);
    return [];
  }

  const { start, end } = sprint;
  const sentenceWords = new Set();

  for (let i = start; i <= end; i++) {
    if (sentencesData[i] && sentencesData[i].jp) {
      const words = extractWordsFromSentence(sentencesData[i].jp);
      words.forEach((w) => sentenceWords.add(w));
    }
  }

  const newDeck = [];
  for (const [key, data] of Object.entries(wordDict)) {
    if (data.is_conjugation || key.startsWith("～") || key.length === 0)
      continue;
    if (sentenceWords.has(key)) {
      newDeck.push({
        word: key,
        reading: data.reading || key,
        meaning: data.meaning || "",
      });
    }
  }

  return newDeck;
}

function buildFullDeck() {
  if (typeof wordDict === "undefined") return [];
  const newDeck = [];
  for (const [key, data] of Object.entries(wordDict)) {
    if (!data.is_conjugation && !key.startsWith("～") && key.length > 0) {
      newDeck.push({
        word: key,
        reading: data.reading || key,
        meaning: data.meaning || "",
      });
    }
  }
  return newDeck;
}

function initVocabDeck() {
  if (!ensureVocabData()) {
    console.warn("⚠️ Cannot initialize vocab: data missing");
    return;
  }

  loadMasteredVocab();

  let available = buildVocabDeck();

  if (available.length === 0) {
    console.log("📚 No sprint-specific words found, building full deck");
    available = buildFullDeck();
  }

  available = available.filter((item) => !vocabMastered.has(item.word));

  if (available.length === 0) {
    available = buildVocabDeck();
    if (available.length === 0) {
      available = buildFullDeck();
    }
    if (available.length === 0) {
      console.warn("⚠️ No vocabulary available");
      return;
    }
  }

  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }

  vocabDeck = available;
  vocabCurrentIndex = 0;
  vocabIsFlipped = false;

  updateVocabUI();
  updateVocabSprintInfo();
  showVocabCard();

  if (vocabFuriToggleBtn) {
    if (vocabFuriganaHidden) {
      vocabFuriToggleBtn.textContent = "🔤 Furigana On";
      vocabFuriToggleBtn.style.backgroundColor = "#555";
      vocabFuriToggleBtn.style.color = "white";
    } else {
      vocabFuriToggleBtn.textContent = "🔤 Furigana Off";
      vocabFuriToggleBtn.style.backgroundColor = "#6c8b6b";
      vocabFuriToggleBtn.style.color = "white";
    }
  }
}

function updateVocabSprintInfo() {
  const sprint = sprints[activeSprintIndex];
  if (sprint) {
    const titleEl = document.getElementById("vocabTitle");
    if (titleEl) {
      titleEl.textContent = `📖 ${sprint.displayName} · Vocab`;
    }
  }
}

function showVocabCard() {
  if (vocabDeck.length === 0) {
    vocabWord.textContent = "🎉 All Mastered!";
    vocabReading.textContent = "";
    vocabMeaning.textContent = "";
    return;
  }

  const card = vocabDeck[vocabCurrentIndex];
  const wordWithFurigana = buildVocabFuriganaHTML(card.word, card.reading);
  vocabWord.innerHTML = wordWithFurigana;

  if (vocabFuriganaHidden) {
    vocabWord.classList.add("hide-furigana");
    if (vocabFuriToggleBtn) {
      vocabFuriToggleBtn.textContent = "🔤 Furigana On";
      vocabFuriToggleBtn.style.backgroundColor = "#555";
      vocabFuriToggleBtn.style.color = "white";
    }
  } else {
    vocabWord.classList.remove("hide-furigana");
    if (vocabFuriToggleBtn) {
      vocabFuriToggleBtn.textContent = "🔤 Furigana Off";
      vocabFuriToggleBtn.style.backgroundColor = "#6c8b6b";
      vocabFuriToggleBtn.style.color = "white";
    }
  }

  vocabReading.textContent = "";
  vocabReading.style.display = "none";
  vocabMeaning.textContent = card.meaning;

  if (vocabIsFlipped) {
    vocabMeaning.style.display = "block";
  } else {
    vocabMeaning.style.display = "none";
  }

  const isMastered = vocabMastered.has(card.word);
  vocabMasteredBtn.textContent = isMastered ? "⭐ Mastered ✓" : "⭐ Mastered";
  vocabMasteredBtn.style.background = isMastered ? "#4caf50" : "#6c8b6b";

  // Kanji Chips
  const statsDiv = document.querySelector(
    "#vocabModal .modal-card > div:last-child",
  );
  if (statsDiv) {
    const existingContainer = document.getElementById("vocabKanjiChips");
    if (existingContainer) {
      existingContainer.remove();
    }

    const kanjiList = extractKanjiFromWord(card.word);
    statsDiv.innerHTML = "";

    const flexContainer = document.createElement("div");
    flexContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            width: 100%;
        `;

    const statsText = document.createElement("span");
    const total = vocabDeck.length;
    statsText.textContent = `${vocabCurrentIndex + 1} / ${total}`;
    statsText.style.cssText = `
            font-size: 0.85rem;
            color: #666;
            font-weight: 500;
            white-space: nowrap;
        `;
    flexContainer.appendChild(statsText);

    if (kanjiList.length > 0) {
      const container = document.createElement("span");
      container.id = "vocabKanjiChips";
      container.style.cssText = `
                display: inline-flex;
                gap: 4px;
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

      flexContainer.appendChild(container);
    }

    const masteredCount = document.createElement("span");
    masteredCount.textContent = `✅ ${vocabMastered.size} Mastered`;
    masteredCount.style.cssText = `
            margin-left: auto;
            font-size: 0.85rem;
            color: #4CAF50;
            font-weight: 500;
            white-space: nowrap;
        `;
    flexContainer.appendChild(masteredCount);

    statsDiv.appendChild(flexContainer);
  }
}

function updateVocabUI() {
  const total = vocabDeck.length;
  const masteredCount = vocabMastered.size;
  vocabIndex.textContent = total > 0 ? vocabCurrentIndex + 1 : 0;
  vocabTotal.textContent = total;
  vocabMasteredCount.textContent = masteredCount;
}

// ==================== CONTROLS ====================

function nextVocabCard() {
  if (vocabDeck.length === 0) return;
  if (vocabCurrentIndex < vocabDeck.length - 1) {
    vocabCurrentIndex++;
    vocabIsFlipped = false;
    showVocabCard();
    updateVocabUI();
  }
}

function prevVocabCard() {
  if (vocabDeck.length === 0) return;
  if (vocabCurrentIndex > 0) {
    vocabCurrentIndex--;
    vocabIsFlipped = false;
    showVocabCard();
    updateVocabUI();
  }
}

function flipVocabCard() {
  if (vocabDeck.length === 0) return;
  vocabIsFlipped = !vocabIsFlipped;
  showVocabCard();
}

function shuffleVocabDeck() {
  if (vocabDeck.length === 0) return;
  for (let i = vocabDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [vocabDeck[i], vocabDeck[j]] = [vocabDeck[j], vocabDeck[i]];
  }
  vocabCurrentIndex = 0;
  vocabIsFlipped = false;
  updateVocabUI();
  showVocabCard();
}

function resetVocabMastered() {
  if (confirm("Reset all mastered vocabulary progress?")) {
    vocabMastered.clear();
    saveMasteredVocab();
    initVocabDeck();
  }
}

function toggleVocabMastered() {
  if (vocabDeck.length === 0) return;
  const card = vocabDeck[vocabCurrentIndex];
  if (vocabMastered.has(card.word)) {
    vocabMastered.delete(card.word);
  } else {
    vocabMastered.add(card.word);
  }
  saveMasteredVocab();
  initVocabDeck();
}

function playVocabAudio() {
  if (vocabDeck.length === 0) return;
  const card = vocabDeck[vocabCurrentIndex];
  if (typeof speakText === "function") {
    speakText(card.reading);
  } else if (window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance(card.reading);
    utterance.lang = "ja-JP";
    utterance.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}

function toggleVocabFurigana() {
  vocabFuriganaHidden = !vocabFuriganaHidden;

  if (vocabDeck.length > 0) {
    const card = vocabDeck[vocabCurrentIndex];
    if (card) {
      const wordWithFurigana = buildVocabFuriganaHTML(card.word, card.reading);
      vocabWord.innerHTML = wordWithFurigana;

      if (vocabFuriganaHidden) {
        vocabWord.classList.add("hide-furigana");
        vocabReading.textContent = "";
        vocabReading.style.display = "none";
        vocabFuriToggleBtn.textContent = "🔤 Furigana On";
        vocabFuriToggleBtn.style.backgroundColor = "#555";
        vocabFuriToggleBtn.style.color = "white";
      } else {
        vocabWord.classList.remove("hide-furigana");
        vocabReading.textContent = "";
        vocabReading.style.display = "none";
        vocabFuriToggleBtn.textContent = "🔤 Furigana Off";
        vocabFuriToggleBtn.style.backgroundColor = "#6c8b6b";
        vocabFuriToggleBtn.style.color = "white";
      }

      if (vocabIsFlipped) {
        vocabMeaning.style.display = "block";
      } else {
        vocabMeaning.style.display = "none";
      }
    }
  }
}

// ==================== EVENT LISTENERS ====================

if (vocabOpenBtn) {
  vocabOpenBtn.addEventListener("click", function () {
    if (typeof waitForData === "function") {
      waitForData(function () {
        initVocabDeck();
        vocabModal.style.display = "flex";
      });
    } else {
      initVocabDeck();
      vocabModal.style.display = "flex";
    }
  });
}

if (vocabCloseBtn) {
  vocabCloseBtn.addEventListener("click", function () {
    const modal = document.getElementById("vocabModal");
    if (modal) {
      modal.style.display = "none";
      modal.classList.remove("show");
      modal.style.visibility = "hidden";
      modal.style.opacity = "0";
      console.log("✅ Vocab modal closed");
    }
    if (typeof window.speechSynthesis !== "undefined") {
      window.speechSynthesis.cancel();
    }
  });
}

if (vocabModal) {
  vocabModal.addEventListener("click", function (e) {
    if (e.target === vocabModal) {
      vocabModal.style.display = "none";
      if (typeof window.speechSynthesis !== "undefined") {
        window.speechSynthesis.cancel();
      }
    }
  });
}

if (vocabFuriToggleBtn) {
  vocabFuriToggleBtn.addEventListener("click", toggleVocabFurigana);
}

if (vocabCard) vocabCard.addEventListener("click", flipVocabCard);
if (vocabFlipBtn) vocabFlipBtn.addEventListener("click", flipVocabCard);
if (vocabNextBtn) vocabNextBtn.addEventListener("click", nextVocabCard);
if (vocabPrevBtn) vocabPrevBtn.addEventListener("click", prevVocabCard);
if (vocabShuffleBtn)
  vocabShuffleBtn.addEventListener("click", shuffleVocabDeck);
if (vocabResetBtn) vocabResetBtn.addEventListener("click", resetVocabMastered);
if (vocabMasteredBtn)
  vocabMasteredBtn.addEventListener("click", toggleVocabMastered);
if (vocabAudioBtn) vocabAudioBtn.addEventListener("click", playVocabAudio);

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  if (vocabModal && vocabModal.style.display === "flex") {
    if (e.key === "ArrowLeft") prevVocabCard();
    if (e.key === "ArrowRight") nextVocabCard();
    if (e.key === " " || e.key === "Space") {
      e.preventDefault();
      flipVocabCard();
    }
    if (e.key === "m" || e.key === "M") toggleVocabMastered();
    if (e.key === "Escape") vocabCloseBtn.click();
    if (e.key === "f" || e.key === "F") toggleVocabFurigana();
  }
});

console.log("🔧 Vocab module loaded");
