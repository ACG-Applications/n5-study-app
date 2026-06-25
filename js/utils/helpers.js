// ==================== HELPER FUNCTIONS ====================
// These functions are for the main app (index.html only)
// They safely check for required globals before executing

function loadMastered() {
  if (typeof masteredSet === 'undefined') return;
  const stored = localStorage.getItem("n5_mastered");
  if (stored) masteredSet = new Set(JSON.parse(stored));
}

function saveMastered() {
  if (typeof masteredSet === 'undefined' || typeof updateStats !== 'function') return;
  localStorage.setItem("n5_mastered", JSON.stringify([...masteredSet]));
  updateStats();
}

function toggleMastered(idx) {
  if (typeof masteredSet === 'undefined' || typeof renderSentences !== 'function') return;
  if (masteredSet.has(idx)) {
    masteredSet.delete(idx);
  } else {
    masteredSet.add(idx);
  }
  saveMastered();
  renderSentences();
}

function resetMastered() {
  if (typeof masteredSet === 'undefined' || typeof renderSentences !== 'function') return;
  masteredSet.clear();
  saveMastered();
  renderSentences();
}

function updateStats() {
  if (typeof sprints === 'undefined' || typeof activeSprintIndex === 'undefined') return;
  if (typeof masteredSet === 'undefined') return;
  const {start, end} = sprints[activeSprintIndex];
  let total = end - start + 1, cnt = 0;
  for (let i = start; i <= end; i++) if (masteredSet.has(i)) cnt++;
  const statsEl = document.getElementById("masteredStats");
  if (statsEl) statsEl.innerHTML = `📊 Mastered: ${cnt} / ${total}`;
}

function getCurrentSprintSentences() {
  if (typeof sprints === 'undefined' || typeof activeSprintIndex === 'undefined') return [];
  if (typeof masteredSet === 'undefined') return [];
  const {start, end} = sprints[activeSprintIndex];
  const sentences = [];
  for (let i = start; i <= end; i++) {
    if (typeof showMastered === 'undefined' || showMastered || !masteredSet.has(i)) {
      sentences.push(sentencesData[i]);
    }
  }
  return sentences;
}

function getSprintName() {
  if (typeof sprints === 'undefined' || typeof activeSprintIndex === 'undefined') return "";
  return sprints[activeSprintIndex].name;
}

function getPlainJapanese(sentence) {
  if (!sentence || !sentence.jp) return "";
  return sentence.jp.replace(/[（(][^）)]*[）)]/g, '').trim();
}

// ==================== TOOLTIP HELPERS (GLOBAL) ====================
// Using furigana.js approach for maximum compatibility

/**
 * Get word meanings for a sentence - uses furigana.js functions if available
 */
function getWordMeaningsForSentence(sentence) {
  if (!sentence || !sentence.jp) return [];
  
  // If sentence already has wordMeanings, use them
  if (sentence.wordMeanings && sentence.wordMeanings.length > 0) {
    return sentence.wordMeanings;
  }
  
  // ===== Try using furigana.js functions =====
  if (typeof splitIntoWordsWithFurigana === 'function' && typeof getMeaningForWord === 'function') {
    try {
      const words = splitIntoWordsWithFurigana(sentence.jp);
      const meanings = [];
      for (const w of words) {
        meanings.push(getMeaningForWord(w.clean));
      }
      sentence.wordMeanings = meanings;
      sentence.splitWords = words;
      return meanings;
    } catch(e) {
      console.warn('furigana.js error, falling back:', e);
    }
  }
  
  // ===== Fallback: manual dictionary lookup =====
  const dict = window.wordDict || null;
  if (!dict) return [];
  
  // Split by spaces
  const parts = sentence.jp.split(/\s+/);
  const meanings = [];
  
  for (const part of parts) {
    const cleanPart = part.replace(/[（(][^）)]*[）)]/g, '').trim();
    let meaning = null;
    
    // Try exact match
    if (dict[cleanPart]) {
      meaning = dict[cleanPart].meaning;
    } else if (dict[part]) {
      meaning = dict[part].meaning;
    } else {
      // Try to find any dictionary key that is a substring
      const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
      for (const key of sortedKeys) {
        if (key.length > 1 && cleanPart.includes(key)) {
          meaning = dict[key].meaning;
          break;
        }
      }
      // Try removing common suffixes
      if (!meaning && cleanPart.endsWith('い')) {
        const base = cleanPart.slice(0, -1);
        if (dict[base]) meaning = dict[base].meaning;
      }
      if (!meaning && cleanPart.endsWith('な')) {
        const base = cleanPart.slice(0, -1);
        if (dict[base]) meaning = dict[base].meaning;
      }
    }
    
    meanings.push(meaning || '?');
  }
  
  sentence.wordMeanings = meanings;
  return meanings;
}

/**
 * Create HTML with word tooltips - uses furigana.js approach
 */
function createQuizWordTooltips(text, wordMeanings) {
  if (!text) return '';
  
  // If no word meanings, just return text with furigana
  if (!wordMeanings || !wordMeanings.length) {
    let result = text;
    result = result.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => 
      `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
    );
    result = result.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g, (_, kanji, furigana) => 
      `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
    );
    return result;
  }
  
  // Split the text by spaces
  const parts = text.split(/\s+/);
  let result = '';
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const meaning = (wordMeanings[i] && wordMeanings[i] !== '?') ? wordMeanings[i] : null;
    
    // Build the display with furigana
    let displayPart = part;
    displayPart = displayPart.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => 
      `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
    );
    displayPart = displayPart.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g, (_, kanji, furigana) => 
      `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
    );
    
    if (meaning) {
      // Check if this word contains a particle at the end
      const cleanWord = part.replace(/[（(][^）)]*[）)]/g, '').trim();
      const particleMatch = cleanWord.match(/^(.*?)([はがをにでへとかからまでのもよねや])$/);
      if (particleMatch && displayPart.includes(particleMatch[2])) {
        const before = particleMatch[1];
        const particle = particleMatch[2];
        let beforeHtml = displayPart.replace(particle, '');
        result += `<span class="word-tooltip">${beforeHtml}<span class="particle-highlight">${particle}</span><span class="tooltip-text">${meaning}</span></span>`;
      } else {
        result += `<span class="word-tooltip">${displayPart}<span class="tooltip-text">${meaning}</span></span>`;
      }
    } else {
      result += displayPart;
    }
    
    if (i < parts.length - 1) result += ' ';
  }
  
  return result;
}

/**
 * Attach tooltips to a container (wrapper for attachTooltipLongPress)
 */
function attachTooltipsToContainer(container) {
  if (!container) return;
  if (typeof attachTooltipLongPress === 'function') {
    attachTooltipLongPress(container);
  }
}

/**
 * Global function to attach tooltips to quiz area
 */
function attachQuizTooltipsGlobal() {
  if (typeof attachQuizTooltips === 'function') {
    attachQuizTooltips();
  } else {
    const quizArea = document.getElementById('quizArea');
    if (quizArea && typeof attachTooltipLongPress === 'function') {
      attachTooltipLongPress(quizArea);
    }
    document.querySelectorAll('.word-tooltip').forEach(el => {
      if (typeof addLongPressSupport === 'function') {
        addLongPressSupport(el);
      }
    });
  }
}

// Make helper functions globally available
if (typeof window !== 'undefined') {
  window.getWordMeaningsForSentence = getWordMeaningsForSentence;
  window.createQuizWordTooltips = createQuizWordTooltips;
  window.attachTooltipsToContainer = attachTooltipsToContainer;
  window.attachQuizTooltipsGlobal = attachQuizTooltipsGlobal;
}