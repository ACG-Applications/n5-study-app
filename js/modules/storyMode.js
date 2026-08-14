// ==================== STORY MODE MODULE ====================
let currentStorySprint = 0;
let storyFuriganaHidden = false;
let storyTransHidden = false;
let storyBlockMode = true;
let isReadingActive = false;
let currentSentenceIndex = 0;
let storySentencesList = [];
let currentSpeechRate = 1.0;

// ============================================================
// SYNC STORY SPRINT WITH DROPDOWN
// ============================================================
function syncStorySprint() {
  const sprintSelect = document.getElementById("sprintSelect");
  if (sprintSelect) {
    const sprint = parseInt(sprintSelect.value);
    if (!isNaN(sprint)) {
      currentStorySprint = sprint;
      console.log("🔄 Story sprint synced to:", sprint);
    }
  }
}

// Expose sync function globally
window.syncStorySprint = syncStorySprint;

const storyModal = document.getElementById("storyModal");
const storyContentDiv = document.getElementById("storyContent");
const storyJapaneseBlock = document.getElementById("storyJapaneseBlock");
const storyEnglishBlock = document.getElementById("storyEnglishBlock");

function ensureWordMeanings() {
  if (typeof sentencesData[0]?.splitWords === "undefined") {
    injectWordMeanings();
  }
}

function getSentencesForSprint(sprintIndex) {
  ensureWordMeanings();
  const { start, end } = sprints[sprintIndex];
  const sentences = [];
  for (let i = start; i <= end; i++) {
    if (sentencesData[i]) sentences.push(sentencesData[i]);
  }
  return sentences;
}

function splitStoryIntoSentences(storyText) {
  return storyText.split(/(?<=[。！？])/g).filter((s) => s.trim().length > 0);
}

function highlightBlockSentence(index) {
  const allSentences = document.querySelectorAll(
    "#storyJapaneseBlock .highlight-sentence",
  );
  allSentences.forEach((el, i) => {
    if (i === index) {
      el.classList.add("highlight-sentence-active");
      el.style.backgroundColor = "#fff3c9";
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      el.classList.remove("highlight-sentence-active");
      el.style.backgroundColor = "";
    }
  });
}

function highlightSentenceModeSentence(index) {
  const allSentences = document.querySelectorAll(
    "#storyContent .story-sentence",
  );
  allSentences.forEach((el, i) => {
    if (i === index) {
      el.classList.add("active-sentence");
      el.style.backgroundColor = "#fff3c9";
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      el.classList.remove("active-sentence");
      el.style.backgroundColor = "";
    }
  });
}

function clearHighlights() {
  const blockSentences = document.querySelectorAll(
    "#storyJapaneseBlock .highlight-sentence",
  );
  blockSentences.forEach((el) => {
    el.classList.remove("highlight-sentence-active");
    el.style.backgroundColor = "";
  });
  const sentenceModeSentences = document.querySelectorAll(
    "#storyContent .story-sentence",
  );
  sentenceModeSentences.forEach((el) => {
    el.classList.remove("active-sentence");
    el.style.backgroundColor = "";
  });
}

function stopReading() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  isReadingActive = false;
  currentSentenceIndex = 0;
  clearHighlights();
  // Use the global currentUtterance from audio.js
  if (typeof currentUtterance !== "undefined") {
    currentUtterance = null;
  }
}

function readNextSentence() {
  if (!isReadingActive) return;

  if (currentSentenceIndex >= storySentencesList.length) {
    isReadingActive = false;
    currentSentenceIndex = 0;
    clearHighlights();
    return;
  }

  let cleanSentence = storySentencesList[currentSentenceIndex];

  if (storyBlockMode) {
    highlightBlockSentence(currentSentenceIndex);
  } else {
    highlightSentenceModeSentence(currentSentenceIndex);
  }

  const utterance = new SpeechSynthesisUtterance(cleanSentence);
  utterance.lang = "ja-JP";
  utterance.rate = currentSpeechRate;

  // Use the global currentUtterance from audio.js
  if (typeof currentUtterance !== "undefined") {
    window.currentUtterance = utterance;
  }

  utterance.onend = () => {
    currentSentenceIndex++;
    readNextSentence();
  };

  utterance.onerror = () => {
    currentSentenceIndex++;
    readNextSentence();
  };

  window.speechSynthesis.speak(utterance);
}

function startReading() {
  stopReading();

  const story = sprintStories[currentStorySprint];
  if (!story) return;

  if (storyBlockMode) {
    // BLOCK MODE: Use story sentences from the story text
    storySentencesList = splitStoryIntoSentences(story.storyJp);
    // Clean each sentence: remove furigana in parentheses
    storySentencesList = storySentencesList.map((s) => {
      let cleaned = s.replace(/（[^）]+）/g, "");
      cleaned = cleaned.replace(/\([^)]+\)/g, "");
      cleaned = cleaned.replace(/\s+/g, " ").trim();
      return cleaned;
    });
  } else {
    // SENTENCE MODE: Get the visible sentence texts from the DOM
    const sentenceElements = document.querySelectorAll(
      "#storyContent .story-sentence",
    );
    storySentencesList = [];
    sentenceElements.forEach((el) => {
      const jpLine = el.querySelector(".jp-line");
      if (jpLine) {
        // Get the HTML content
        let html = jpLine.innerHTML;

        // Remove tooltip spans but keep their content
        html = html.replace(
          /<span class="word-tooltip">(.*?)<span class="tooltip-text">.*?<\/span><\/span>/g,
          "$1",
        );

        // Remove any ruby tags - keep only the kanji (remove the rt part)
        html = html.replace(/<ruby>(.*?)<rt>.*?<\/rt><\/ruby>/g, "$1");

        // Create a temporary div to extract text
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        let text = tempDiv.textContent;

        // Remove any remaining furigana in parentheses
        text = text.replace(/（[^）]+）/g, "");

        // Clean up extra spaces
        text = text.replace(/\s+/g, " ").trim();

        storySentencesList.push(text);
      }
    });
  }

  if (storySentencesList.length === 0) return;

  isReadingActive = true;
  currentSentenceIndex = 0;
  readNextSentence();
}

function wrapSentencesWithSpans(text) {
  const sentences = splitStoryIntoSentences(text);
  let wrappedHtml = "";
  for (let i = 0; i < sentences.length; i++) {
    let sentence = sentences[i];
    // FIX: Match one or more kanji (including 々) followed by furigana in parentheses
    sentence = sentence.replace(
      /([\u4e00-\u9faf\u3400-\u4dbf\u3005]+)（([^（）]+)）/g,
      (_, kanji, furigana) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>`,
    );
    wrappedHtml += `<span class="highlight-sentence">${sentence}</span>`;
  }
  return wrappedHtml;
}

function buildSentenceBySentenceHTML(sprintIndex) {
  ensureWordMeanings();
  const story = sprintStories[sprintIndex];
  if (!story) return "<p>Story not found.</p>";

  const sentences = getSentencesForSprint(sprintIndex);
  let html = `<div class="story-paragraph">`;
  const storySentences = splitStoryIntoSentences(story.storyJp);
  let sentenceIndex = 0;

  for (let i = 0; i < storySentences.length; i++) {
    const storySentence = storySentences[i].trim();
    if (storySentence.length === 0) continue;

    let originalSentence = null;
    if (sentenceIndex < sentences.length)
      originalSentence = sentences[sentenceIndex];

    let displayText = storySentence;
    if (
      originalSentence &&
      originalSentence.splitWords &&
      originalSentence.wordMeanings
    ) {
      displayText = wrapWordsWithTooltips(originalSentence);
    }

    html += `<div class="story-sentence" data-sentence-index="${sentenceIndex}"><div class="jp-line">${displayText}</div>`;

    if (!storyTransHidden) {
      const enSentences = story.storyEn.split(/(?<=[.?!])/g);
      const enText = enSentences[i] || story.storyEn;
      html += `<div class="translation-text">📖 ${enText}</div>`;
    }

    html += `</div>`;
    sentenceIndex++;
  }
  html += `</div>`;
  return html;
}

function buildBlockHTML(sprintIndex) {
  const story = sprintStories[sprintIndex];
  if (!story)
    return { japaneseHtml: "<p>Story not found.</p>", englishHtml: "" };
  let japaneseHtml = wrapSentencesWithSpans(story.storyJp);
  return { japaneseHtml, englishHtml: story.storyEn };
}

function showStory() {
  ensureWordMeanings();
  stopReading();

  const story = sprintStories[currentStorySprint];
  if (!story) return;

  document.getElementById("storyTitle").innerHTML =
    `${story.title} · ${sprints[currentStorySprint].displayName}`;
  document.getElementById("storySprintNum").innerText = currentStorySprint + 1;
  document.getElementById("storyTotalSprints").innerText = sprintStories.length;

  storyContentDiv.innerHTML = "";
  storyJapaneseBlock.innerHTML = "";
  storyEnglishBlock.innerHTML = "";

  if (storyBlockMode) {
    storyContentDiv.classList.remove("sentence-mode");
    storyContentDiv.classList.add("block-mode");

    storyJapaneseBlock.style.display = "block";
    storyEnglishBlock.style.display = storyTransHidden ? "none" : "block";

    storyContentDiv.appendChild(storyJapaneseBlock);
    storyContentDiv.appendChild(storyEnglishBlock);

    const blocks = buildBlockHTML(currentStorySprint);
    storyJapaneseBlock.innerHTML = blocks.japaneseHtml;
    storyEnglishBlock.innerHTML = `📖 ${blocks.englishHtml}`;

    if (storyFuriganaHidden) {
      storyJapaneseBlock.classList.add("hide-furigana");
    } else {
      storyJapaneseBlock.classList.remove("hide-furigana");
    }
  } else {
    storyContentDiv.classList.remove("block-mode");
    storyContentDiv.classList.add("sentence-mode");

    storyJapaneseBlock.style.display = "none";
    storyEnglishBlock.style.display = "none";

    const html = buildSentenceBySentenceHTML(currentStorySprint);
    storyContentDiv.innerHTML = html;
    storyContentDiv.classList.toggle("hide-furigana", storyFuriganaHidden);

    const sentences = getSentencesForSprint(currentStorySprint);
    const sentenceElements = document.querySelectorAll(
      "#storyContent .story-sentence",
    );

    sentenceElements.forEach((el, idx) => {
      const originalSentence = sentences[idx];
      if (originalSentence && originalSentence.reading) {
        el.removeEventListener("click", el.clickHandler);
        el.clickHandler = () => {
          stopReading();
          let cleanText = originalSentence.reading.replace(/（[^）]+）/g, "");
          speakText(cleanText);
        };
        el.addEventListener("click", el.clickHandler);
      }
    });
  }
}

// Event Listeners
document.getElementById("storyModeBtn").onclick = () => {
  currentStorySprint = activeSprintIndex;
  showStory();
  storyModal.style.display = "flex";
};

document.getElementById("closeStoryBtn").onclick = () => {
  stopReading();
  storyModal.style.display = "none";
};

document.getElementById("storyPrevSprintBtn").onclick = () => {
  stopReading();
  currentStorySprint =
    (currentStorySprint - 1 + sprintStories.length) % sprintStories.length;
  activeSprintIndex = currentStorySprint;
  if (sprintSelect) sprintSelect.value = activeSprintIndex;
  if (typeof updateProgressDisplay === "function") updateProgressDisplay();
  showStory();
};

document.getElementById("storyNextSprintBtn").onclick = () => {
  stopReading();
  currentStorySprint = (currentStorySprint + 1) % sprintStories.length;
  activeSprintIndex = currentStorySprint;
  if (sprintSelect) sprintSelect.value = activeSprintIndex;
  if (typeof updateProgressDisplay === "function") updateProgressDisplay();
  showStory();
};

document.getElementById("storyFuriToggleBtn").onclick = () => {
  storyFuriganaHidden = !storyFuriganaHidden;
  const btn = document.getElementById("storyFuriToggleBtn");
  btn.innerText = storyFuriganaHidden ? "🔤 Furigana On" : "🔤 Furigana Off";
  if (storyBlockMode) {
    if (storyFuriganaHidden) {
      storyJapaneseBlock.classList.add("hide-furigana");
    } else {
      storyJapaneseBlock.classList.remove("hide-furigana");
    }
  } else {
    storyContentDiv.classList.toggle("hide-furigana", storyFuriganaHidden);
  }
};

document.getElementById("storyTransToggleBtn").onclick = () => {
  storyTransHidden = !storyTransHidden;
  const btn = document.getElementById("storyTransToggleBtn");
  btn.innerText = storyTransHidden ? "🌎 Translation On" : "🌎 Translation Off";
  if (!storyBlockMode) {
    showStory();
  } else {
    storyEnglishBlock.style.display = storyTransHidden ? "none" : "block";
  }
};

document.getElementById("storyBlockToggleBtn").onclick = () => {
  stopReading();
  storyBlockMode = !storyBlockMode;
  const btn = document.getElementById("storyBlockToggleBtn");
  const audioBtn = document.getElementById("storyAudioBtn");

  btn.innerText = storyBlockMode ? "📄 Sentence Mode" : "📄 Block View";
  audioBtn.innerText = "📖 Read";

  showStory();
};

document.getElementById("storyAudioBtn").onclick = () => {
  if (isReadingActive) {
    stopReading();
  } else {
    startReading();
  }
};

document.getElementById("storyStopBtn").onclick = () => {
  stopReading();
};

document.getElementById("storySpeed075Btn").onclick = () => {
  currentSpeechRate = 0.75;
  document.getElementById("storySpeed075Btn").style.backgroundColor = "#6c8b6b";
  document.getElementById("storySpeed100Btn").style.backgroundColor = "#555";
  if (isReadingActive) {
    startReading();
  }
};

document.getElementById("storySpeed100Btn").onclick = () => {
  currentSpeechRate = 1.0;
  document.getElementById("storySpeed100Btn").style.backgroundColor = "#6c8b6b";
  document.getElementById("storySpeed075Btn").style.backgroundColor = "#555";
  if (isReadingActive) {
    startReading();
  }
};
// ============================================================
// DOWNLOAD STORY AUDIO
// ============================================================

// Map sprint index to MP3 filename
function getStoryAudioFile(sprintIndex) {
  const filenames = [
    "01-Daily-Routine.mp3",
    "02-Family-and-People.mp3",
    "03-Location-and-Transport.mp3",
    "04-Shopping-and-Food.mp3",
    "05-Weather-and-Feelings.mp3",
    "06-Hobbies-Giving.mp3",
    "07-Health-and-Body.mp3",
    "08-House-and-Objects.mp3",
    "09-Work-School.mp3",
    "10-Mixed-Review.mp3",
  ];
  return filenames[sprintIndex] || null;
}

// Download story audio
function downloadStoryAudio() {
  const sprintIndex = currentStorySprint;
  const filename = getStoryAudioFile(sprintIndex);

  if (!filename) {
    showToast("⚠️ Audio file not found for this story.", "error");
    return;
  }

  const audioPath = `assets/${filename}`;

  // Check if the file exists by fetching it
  fetch(audioPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Audio file not found");
      }
      return response.blob();
    })
    .then((blob) => {
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`✅ Downloading: ${filename}`, "success");
    })
    .catch((error) => {
      console.error("Download failed:", error);
      showToast(
        "⚠️ Audio file not found. Please check the assets folder.",
        "error",
      );
    });
}

// ============================================================
// EVENT LISTENER FOR DOWNLOAD BUTTON
// ============================================================

document.getElementById("storyDownloadAudioBtn").onclick = downloadStoryAudio;
