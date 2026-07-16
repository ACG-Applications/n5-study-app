// ==================== HELPER FUNCTIONS ====================

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

// ==================== DICTIONARY LOOKUP ====================

// List of all particles for quick detection
const PARTICLES = ['は', 'が', 'を', 'に', 'へ', 'で', 'と', 'も', 'か', 'よ', 'ね', 'から', 'まで', 'より', 'くらい', 'ごろ', 'だけ', 'ほど', 'の', 'には', 'や'];

/**
 * Get meaning for a word from wordDict
 * Enhanced to handle particles and common word forms
 */
function getWordMeaning(word) {
  const dict = window.wordDict || null;
  if (!dict) return null;
  
  // Don't strip the word - keep it as-is
  let cleanWord = word.trim();
  
  // If the word is empty, return null
  if (!cleanWord) return null;
  
  // ===== 1. EXACT MATCH =====
  // Try exact match first (most reliable)
  if (dict[cleanWord]) {
    return dict[cleanWord].meaning;
  }
  
  // ===== 2. REMOVE FURIGANA MARKERS =====
  // Remove furigana markers like （ふりがな） or (furigana)
  let strippedWord = cleanWord.replace(/[（(][^）)]*[）)]/g, '').trim();
  if (strippedWord && dict[strippedWord]) {
    return dict[strippedWord].meaning;
  }
  
  // ===== 3. CHECK IF IT'S A PARTICLE =====
  // Particles are often at the end of words or standalone
  for (const particle of PARTICLES) {
    if (cleanWord === particle || strippedWord === particle) {
      if (dict[particle]) {
        return dict[particle].meaning;
      }
    }
    // Check if word ends with a particle (like "会社に" -> "に")
    if (cleanWord.endsWith(particle) && cleanWord.length > particle.length) {
      const base = cleanWord.slice(0, -particle.length);
      // Try to get meaning for the base word
      if (dict[base]) {
        return dict[base].meaning;
      }
      // If base not found, maybe the whole word with particle is in dict
      if (dict[cleanWord]) {
        return dict[cleanWord].meaning;
      }
    }
  }
  
  // ===== 4. CHECK FOR COMMON SUFFIXES =====
  // Try removing common suffixes
  const suffixes = ['い', 'な', 'ます', 'です', 'した', 'て', 'た', 'る', 'う', 'く', 'む', 'ぶ', 'ぬ', 'ぐ', 'す'];
  for (const suffix of suffixes) {
    if (strippedWord.endsWith(suffix) && strippedWord.length > suffix.length) {
      const base = strippedWord.slice(0, -suffix.length);
      if (dict[base]) {
        return dict[base].meaning;
      }
      // Try adding る to the base (for dictionary form)
      if (dict[base + 'る']) {
        return dict[base + 'る'].meaning;
      }
    }
  }
  
  // ===== 5. CHECK FOR VERB STEMS =====
  // Sometimes we have verb stems without the ます or る
  const verbStems = ['行き', '見', '食べ', '飲み', '読み', '書き', '聞き', '話し', '買い', '売り', '作り', '使い', '待ち', '持ち', '渡し', '曲がり', '止まり', '入り', '出', '上がり', '下がり', '寝', '起き', '浴び', '磨き', '洗い', '泳ぎ', '走り', '飛び', '立ち', '座り', '知り', '教え', '習い', '見せ', '弾き', '引き'];
  for (const stem of verbStems) {
    if (strippedWord === stem || cleanWord === stem) {
      // Try to find the dictionary form
      if (dict[stem + 'る']) {
        return dict[stem + 'る'].meaning;
      }
      if (dict[stem + 'く']) {
        return dict[stem + 'く'].meaning;
      }
      if (dict[stem + 'う']) {
        return dict[stem + 'う'].meaning;
      }
    }
  }
  
  // ===== 6. PARTIAL MATCH =====
  // Try to find any dictionary key that is a substring
  const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (key.length > 1 && (strippedWord.includes(key) || cleanWord.includes(key))) {
      return dict[key].meaning;
    }
  }
  
  // ===== 7. CHECK IF IT'S A NUMBER OR COUNTER =====
  // Numbers are common in N5 sentences
  const numbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万'];
  for (const num of numbers) {
    if (strippedWord === num || cleanWord === num) {
      if (dict[num]) return dict[num].meaning;
    }
  }
  
  // ===== 8. CHECK IF IT'S A COMMON WORD WITH DIFFERENT FORM =====
  const commonVariations = {
    '今日': '今日',
    '昨日': '昨日',
    '明日': '明日',
    '毎日': '毎日',
    '毎朝': '毎朝',
    '毎晩': '毎晩',
    '今週': '今週',
    '先週': '先週',
    '来週': '来週',
    '今月': '今月',
    '先月': '先月',
    '来月': '来月',
    '今年': '今年',
    '去年': '去年',
    '来年': '来年',
  };
  for (const [key, value] of Object.entries(commonVariations)) {
    if (strippedWord === key || cleanWord === key) {
      if (dict[value]) return dict[value].meaning;
    }
  }
  
  // If nothing found, return null
  return null;
}

/**
 * Get word meanings for a sentence
 */
function getWordMeaningsForSentence(sentence) {
  if (!sentence || !sentence.jp) return [];
  
  // If sentence already has wordMeanings, use them
  if (sentence.wordMeanings && sentence.wordMeanings.length > 0) {
    return sentence.wordMeanings;
  }
  
  const parts = sentence.jp.split(/\s+/);
  const meanings = [];
  
  for (const part of parts) {
    const meaning = getWordMeaning(part);
    if (meaning) {
      meanings.push(meaning);
    } else {
      // Try to get meaning from stripped version
      const stripped = part.replace(/[（(][^）)]*[）)]/g, '').trim();
      const strippedMeaning = getWordMeaning(stripped);
      if (strippedMeaning) {
        meanings.push(strippedMeaning);
      } else {
        // Try to extract a single character
        const chars = stripped.split('');
        let found = false;
        for (const char of chars) {
          const charMeaning = getWordMeaning(char);
          if (charMeaning) {
            meanings.push(charMeaning);
            found = true;
            break;
          }
        }
        if (!found) {
          meanings.push('?');
        }
      }
    }
  }
  
  sentence.wordMeanings = meanings;
  return meanings;
}

/**
 * Wrap a word with tooltip HTML
 */
function wrapWordWithTooltip(word, meaning) {
  // Build display with furigana
  let displayWord = word;
  
  // Handle furigana format: kanji（ふりがな）
  displayWord = displayWord.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => 
    `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
  );
  displayWord = displayWord.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g, (_, kanji, furigana) => 
    `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
  );
  
  // Check if this word contains a particle at the end
  const cleanWord = word.replace(/[（(][^）)]*[）)]/g, '').trim();
  const particleMatch = cleanWord.match(/^(.*?)([はがをにでへとかからまでのもよねや])$/);
  
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
    return `<span class="word-tooltip">${beforeHtml}<span class="particle-highlight">${particle}</span><span class="tooltip-text">${meaning}</span></span>`;
  }
  
  return `<span class="word-tooltip">${displayWord}<span class="tooltip-text">${meaning}</span></span>`;
}

/**
 * Create HTML with word tooltips
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
  
  const parts = text.split(/\s+/);
  let result = '';
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const meaning = (wordMeanings[i] && wordMeanings[i] !== '?') ? wordMeanings[i] : null;
    
    if (meaning) {
      result += wrapWordWithTooltip(part, meaning);
    } else {
      // No meaning found - just display with furigana
      let displayPart = part;
      displayPart = displayPart.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => 
        `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
      );
      displayPart = displayPart.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g, (_, kanji, furigana) => 
        `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
      );
      result += displayPart;
    }
    
    if (i < parts.length - 1) result += ' ';
  }
  
  return result;
}

/**
 * Add long press support for mobile devices
 */
function addLongPressSupport(element) {
  if (!element) return;
  
  let timer = null;
  let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (isTouchDevice) {
    element.addEventListener('touchstart', function(e) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        this.classList.toggle('active');
        this.classList.toggle('touched');
        timer = null;
      }, 500);
    });
    
    element.addEventListener('touchend', function(e) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      setTimeout(() => {
        this.classList.remove('active');
        this.classList.remove('touched');
      }, 3000);
    });
    
    element.addEventListener('touchmove', function(e) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    });
  } else {
    element.addEventListener('click', function(e) {
      this.classList.toggle('active');
      setTimeout(() => {
        this.classList.remove('active');
      }, 3000);
    });
  }
}

/**
 * Attach tooltips to a container
 */
function attachTooltipsToContainer(container) {
  if (!container) return;
  const tooltips = container.querySelectorAll('.word-tooltip');
  tooltips.forEach(el => {
    addLongPressSupport(el);
  });
}

/**
 * Attach tooltips to quiz area
 */
function attachQuizTooltips() {
  const quizArea = document.getElementById('quizArea');
  if (!quizArea) {
    const tooltips = document.querySelectorAll('.word-tooltip');
    tooltips.forEach(el => {
      addLongPressSupport(el);
    });
    return;
  }
  const tooltips = quizArea.querySelectorAll('.word-tooltip');
  tooltips.forEach(el => {
    addLongPressSupport(el);
  });
}

function attachQuizTooltipsGlobal() {
  attachQuizTooltips();
}

// Make helper functions globally available
if (typeof window !== 'undefined') {
  window.loadMastered = loadMastered;
  window.saveMastered = saveMastered;
  window.toggleMastered = toggleMastered;
  window.resetMastered = resetMastered;
  window.updateStats = updateStats;
  window.getCurrentSprintSentences = getCurrentSprintSentences;
  window.getSprintName = getSprintName;
  window.getPlainJapanese = getPlainJapanese;
  window.getWordMeaning = getWordMeaning;
  window.getWordMeaningsForSentence = getWordMeaningsForSentence;
  window.wrapWordWithTooltip = wrapWordWithTooltip;
  window.createQuizWordTooltips = createQuizWordTooltips;
  window.addLongPressSupport = addLongPressSupport;
  window.attachTooltipsToContainer = attachTooltipsToContainer;
  window.attachQuizTooltips = attachQuizTooltips;
  window.attachQuizTooltipsGlobal = attachQuizTooltipsGlobal;
}