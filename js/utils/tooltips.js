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
  return sentence.jp.replace(/（[^）]+）/g, '').trim();
}

// ==================== TOOLTIP HELPERS (GLOBAL) ====================

/**
 * Get word meanings for a sentence from wordDict
 * @param {Object} sentence - Sentence object with .jp property
 * @returns {Array} Array of {word, meaning} objects
 */
function getWordMeaningsForSentence(sentence) {
  if (!sentence || !sentence.jp) return [];
  
  // If sentence already has wordMeanings, use them
  if (sentence.wordMeanings && sentence.wordMeanings.length > 0) {
    return sentence.wordMeanings;
  }
  
  // Get dictionary from global scope
  const dict = window.wordDict || null;
  if (!dict) return [];
  
  const meanings = [];
  const words = sentence.jp.split(/\s+/);
  
  for (const word of words) {
    const cleanWord = word.replace(/（[^）]+）/g, '').replace(/\([^)]+\)/g, '').trim();
    
    // Try exact match first
    if (dict[cleanWord]) {
      meanings.push({ word: cleanWord, meaning: dict[cleanWord].meaning });
    } else if (dict[word]) {
      meanings.push({ word: word, meaning: dict[word].meaning });
    } else {
      // Try partial match - check if word contains any dictionary key
      let found = false;
      const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
      for (const key of sortedKeys) {
        if (cleanWord.includes(key) && key.length > 1) {
          meanings.push({ word: key, meaning: dict[key].meaning });
          found = true;
          break;
        }
      }
      if (!found) {
        // No meaning found - skip
      }
    }
  }
  
  return meanings;
}

/**
 * Create HTML with word tooltips for quiz sentences
 * @param {string} text - The sentence text
 * @param {Array} wordMeanings - Array of {word, meaning} objects
 * @returns {string} HTML with tooltips
 */
function createQuizWordTooltips(text, wordMeanings) {
  if (!text) return '';
  if (!wordMeanings || !wordMeanings.length) {
    // Still wrap furigana even without tooltips
    return text.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => 
      `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
    );
  }
  
  const words = text.split(/\s+/);
  let result = '';
  let usedMeanings = [];
  
  for (const word of words) {
    const cleanWord = word.replace(/（[^）]+）/g, '').replace(/\([^)]+\)/g, '').trim();
    let meaning = '';
    let found = false;
    
    // Try to find meaning for this word
    for (let j = 0; j < wordMeanings.length; j++) {
      if (usedMeanings.includes(j)) continue;
      const w = wordMeanings[j];
      const cleanW = w.word ? w.word.replace(/（[^）]+）/g, '').replace(/\([^)]+\)/g, '').trim() : '';
      if (cleanW === cleanWord || w.word === word || cleanW === word) {
        meaning = w.meaning || w.meaning_en || '';
        usedMeanings.push(j);
        found = true;
        break;
      }
    }
    
    // If not found, try partial match
    if (!found) {
      for (let j = 0; j < wordMeanings.length; j++) {
        if (usedMeanings.includes(j)) continue;
        const w = wordMeanings[j];
        const cleanW = w.word ? w.word.replace(/（[^）]+）/g, '').replace(/\([^)]+\)/g, '').trim() : '';
        if (cleanW && cleanWord.includes(cleanW)) {
          meaning = w.meaning || w.meaning_en || '';
          usedMeanings.push(j);
          found = true;
          break;
        }
      }
    }
    
    // Build the word with furigana
    let displayWord = word;
    displayWord = displayWord.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => 
      `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
    );
    displayWord = displayWord.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g, (_, kanji, furigana) => 
      `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
    );
    
    if (meaning) {
      // Check if this word contains a particle
      const particleMatch = word.match(/^(.*?)([はがをにでへとかからまでのもよねや])$/);
      if (particleMatch) {
        const before = particleMatch[1];
        const particle = particleMatch[2];
        let beforeHtml = before;
        beforeHtml = beforeHtml.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => 
          `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
        );
        beforeHtml = beforeHtml.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g, (_, kanji, furigana) => 
          `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
        );
        result += `<span class="word-tooltip">${beforeHtml}<span class="particle-highlight">${particle}</span><span class="tooltip-text">${meaning}</span></span> `;
      } else {
        result += `<span class="word-tooltip">${displayWord}<span class="tooltip-text">${meaning}</span></span> `;
      }
    } else {
      // Check if this word contains a particle
      const particleMatch = word.match(/^(.*?)([はがをにでへとかからまでのもよねや])$/);
      if (particleMatch) {
        const before = particleMatch[1];
        const particle = particleMatch[2];
        let beforeHtml = before;
        beforeHtml = beforeHtml.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => 
          `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
        );
        beforeHtml = beforeHtml.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g, (_, kanji, furigana) => 
          `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
        );
        result += `${beforeHtml}<span class="particle-highlight">${particle}</span> `;
      } else {
        result += `${displayWord} `;
      }
    }
  }
  
  return result.trim();
}

/**
 * Attach tooltips to a container (wrapper for attachTooltipLongPress)
 * @param {HTMLElement} container - The container element
 */
function attachTooltipsToContainer(container) {
  if (!container) return;
  if (typeof attachTooltipLongPress === 'function') {
    attachTooltipLongPress(container);
  }
}

/**
 * Global function to attach tooltips to quiz area
 * This is called after rendering quiz content
 */
function attachQuizTooltipsGlobal() {
  if (typeof attachQuizTooltips === 'function') {
    attachQuizTooltips();
  } else {
    // Fallback: try to attach to quiz area directly
    const quizArea = document.getElementById('quizArea');
    if (quizArea && typeof attachTooltipLongPress === 'function') {
      attachTooltipLongPress(quizArea);
    }
    // Also attach to any word-tooltip elements
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