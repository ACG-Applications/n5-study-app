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

// `renderSentences` is not defined anywhere in the app, so the previous guard
// made toggleMastered()/resetMastered() silent no-ops and the "Reset" button
// did nothing. Refresh whichever views actually exist instead.
function refreshMasteryViews() {
  if (typeof updateProgressDisplay === 'function') updateProgressDisplay();
  if (typeof updateFlashcardsForSprint === 'function') updateFlashcardsForSprint();
}

function toggleMastered(idx) {
  if (typeof masteredSet === 'undefined') return;
  if (masteredSet.has(idx)) {
    masteredSet.delete(idx);
  } else {
    masteredSet.add(idx);
  }
  saveMastered();
  refreshMasteryViews();
}

function resetMastered() {
  if (typeof masteredSet === 'undefined') return;
  masteredSet.clear();
  saveMastered();
  refreshMasteryViews();
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

// Escape user-supplied text before putting it into innerHTML. The global search
// interpolated the raw query into result markup and a data- attribute on every
// page, so typing markup executed it in page context (self-XSS) and a double
// quote broke the attribute.
function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Replace the first occurrence of `word` in a furigana-annotated sentence
// (`漢字（よみ）` form) with a blank, so quiz sentences blank the word that is
// actually there instead of looking for the un-annotated dictionary form.
function blankOutWord(sentence, word) {
  if (!sentence || !word) return sentence || "";
  const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const kanjiOnly = (String(word).match(/[\u4e00-\u9faf\u3400-\u4dbf\u3005]/g) || []).join("");
  if (kanjiOnly) {
    // annotated form: 漢字 run + （reading） + trailing okurigana
    const annotated = new RegExp(
      esc(kanjiOnly) + "[^\\s]*?（[^）]+）[\\u3040-\\u30ff]*",
    );
    if (annotated.test(sentence)) return sentence.replace(annotated, "______");
    // plain form
    const plain = new RegExp(esc(kanjiOnly) + "[\\u3040-\\u30ff]*");
    if (plain.test(sentence)) return sentence.replace(plain, "______");
  }
  const bare = String(word).replace(/[（(][^）)]*[）)]/g, "");
  if (bare && sentence.includes(bare)) {
    return sentence.replace(bare, "______");
  }
  return sentence;
}

// ==================== DICTIONARY LOOKUP ====================

// List of all particles for quick detection.
// Single-character particles plus the compound / multi-character particles used in
// the N5 sentence data (から まで より くらい ごろ だけ ほど には ので ながら のに など
// しか ばかり って さえ こそ). Kept in one place so that getWordMeaning() and
// wrapWordWithTooltip() can never disagree about what counts as a particle.
const PARTICLES = [
  'は', 'が', 'を', 'に', 'へ', 'で', 'と', 'も', 'か', 'よ', 'ね', 'や', 'の',
  'から', 'まで', 'より', 'くらい', 'ごろ', 'だけ', 'ほど', 'には',
  'ので', 'ながら', 'のに', 'など', 'しか', 'ばかり', 'って', 'さえ', 'こそ',
];

/**
 * Get meaning for a word from wordDict
 * Enhanced to handle particles and common word forms
 */
function getWordMeaning(word) {
  const dict = window.wordDict || null;
  if (!dict) return null;

  let cleanWord = word.trim();
  if (!cleanWord) return null;

  // ===== 1. EXACT MATCH =====
  if (dict[cleanWord]) {
    return dict[cleanWord].meaning;
  }

  // ===== 2. REMOVE FURIGANA MARKERS =====
  let strippedWord = cleanWord.replace(/[（(][^）)]*[）)]/g, '').trim();
  if (strippedWord && dict[strippedWord]) {
    return dict[strippedWord].meaning;
  }

  // ===== 3. CHECK IF IT'S A PARTICLE =====
  for (const particle of PARTICLES) {
    if (cleanWord === particle || strippedWord === particle) {
      if (dict[particle]) {
        return dict[particle].meaning;
      }
    }
    if (cleanWord.endsWith(particle) && cleanWord.length > particle.length) {
      const base = cleanWord.slice(0, -particle.length);
      if (dict[base]) {
        return dict[base].meaning;
      }
      if (dict[cleanWord]) {
        return dict[cleanWord].meaning;
      }
    }
  }

  // ===== 4. CHECK FOR COMMON SUFFIXES =====
  const suffixes = ['い', 'な', 'ます', 'です', 'した', 'て', 'た', 'る', 'う', 'く', 'む', 'ぶ', 'ぬ', 'ぐ', 'す'];
  for (const suffix of suffixes) {
    if (strippedWord.endsWith(suffix) && strippedWord.length > suffix.length) {
      const base = strippedWord.slice(0, -suffix.length);
      if (dict[base]) {
        return dict[base].meaning;
      }
      if (dict[base + 'る']) {
        return dict[base + 'る'].meaning;
      }
    }
  }

  // ===== 5. CHECK FOR VERB STEMS =====
  const verbStems = ['行き', '見', '食べ', '飲み', '読み', '書き', '聞き', '話し', '買い', '売り', '作り', '使い', '待ち', '持ち', '渡し', '曲がり', '止まり', '入り', '出', '上がり', '下がり', '寝', '起き', '浴び', '磨き', '洗い', '泳ぎ', '走り', '飛び', '立ち', '座り', '知り', '教え', '習い', '見せ', '弾き', '引き'];
  for (const stem of verbStems) {
    if (strippedWord === stem || cleanWord === stem) {
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

  // ===== 6. PREFIX / SUFFIX MATCH =====
  // Only match a dictionary key if it sits at the START or END of the word.
  // (Restricting to prefix/suffix prevents short keys like した from matching
  // inside longer words like 働きました and returning nonsense meanings.)
  const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (key.length > 1 &&
        (strippedWord.startsWith(key) || strippedWord.endsWith(key) ||
         cleanWord.startsWith(key) || cleanWord.endsWith(key))) {
      return dict[key].meaning;
    }
  }

  // ===== 7. CHECK IF IT'S A NUMBER OR COUNTER =====
  const numbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万'];
  for (const num of numbers) {
    if (strippedWord === num || cleanWord === num) {
      if (dict[num]) return dict[num].meaning;
    }
  }

  // ===== 8. CHECK IF IT'S A COMMON WORD WITH DIFFERENT FORM =====
  const commonVariations = {
    '今日': '今日', '昨日': '昨日', '明日': '明日',
    '毎日': '毎日', '毎朝': '毎朝', '毎晩': '毎晩',
    '今週': '今週', '先週': '先週', '来週': '来週',
    '今月': '今月', '先月': '先月', '来月': '来月',
    '今年': '今年', '去年': '去年', '来年': '来年',
  };
  for (const [key, value] of Object.entries(commonVariations)) {
    if (strippedWord === key || cleanWord === key) {
      if (dict[value]) return dict[value].meaning;
    }
  }

  return null;
}

/**
 * Get word meanings for a sentence
 */
function getWordMeaningsForSentence(sentence) {
  if (!sentence || !sentence.jp) return [];
  
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
      const stripped = part.replace(/[（(][^）)]*[）)]/g, '').trim();
      const strippedMeaning = getWordMeaning(stripped);
      if (strippedMeaning) {
        meanings.push(strippedMeaning);
      } else {
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
 * Wrap a word with tooltip HTML (Restored)
 */
function wrapWordWithTooltip(word, meaning) {
  const toRuby = (text) =>
    String(text)
      .replace(/([\u4e00-\u9faf\u3400-\u4dbf\u3005]+)（([^（）]+)）/g, (_, kanji, furigana) =>
        `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
      )
      .replace(/([\u4e00-\u9faf\u3400-\u4dbf\u3005]+)\(([^()]+)\)/g, (_, kanji, furigana) =>
        `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
      );

  const cleanWord = word.replace(/[（(][^）)]*[）)]/g, '').trim();

  // Only a standalone particle token is highlighted. Splitting a trailing
  // "particle" character off anything else mis-read ordinary word endings
  // (降（ふ）ったら -> ら, 待（ま）たないで -> で, 静（しず）か -> か) AND dropped
  // that word's furigana, because the left-hand side was taken from the
  // annotation-stripped string and had nothing left to convert to <ruby>.
  // Uses the shared PARTICLES list above (single + compound particles).
  if (PARTICLES.includes(cleanWord)) {
    return `<span class="word-tooltip"><span class="particle-highlight">${cleanWord}</span><span class="tooltip-text">${meaning}</span></span>`;
  }

  return `<span class="word-tooltip">${toRuby(word)}<span class="tooltip-text">${meaning}</span></span>`;
}

/**
 * Create HTML with word tooltips (Restored)
 */
function createQuizWordTooltips(text, wordMeanings) {
  if (!text) return '';
  
  if (!wordMeanings || !wordMeanings.length) {
    let result = text;
    result = result.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>`);
    result = result.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g, (_, kanji, furigana) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>`);
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
      let displayPart = part;
      displayPart = displayPart.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>`);
      displayPart = displayPart.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g, (_, kanji, furigana) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>`);
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