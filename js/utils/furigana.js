// ==================== FURIGANA FUNCTIONS ====================

// Fixed: Better furigana parsing - no suffix splitting (was causing duplication bugs)
function splitIntoWordsWithFurigana(jpText) {
  let segments = jpText.split(/\s+/);
  const result = [];
  
  for (let seg of segments) {
    let cleanWord = seg.replace(/（[^）]+）/g, '');
    // Keep the original segment as-is, no splitting
    result.push({ original: seg, clean: cleanWord });
  }
  return result;
}

function getMeaningForWord(cleanWord) {
  if (wordDict[cleanWord]) return wordDict[cleanWord].meaning;
  if (cleanWord.endsWith("ます")) {
    let stem = cleanWord.slice(0, -2);
    if (wordDict[stem]) return wordDict[stem].meaning;
    stem = cleanWord.slice(0, -3);
    if (wordDict[stem]) return wordDict[stem].meaning;
  }
  if (cleanWord.endsWith("た")) {
    let stem = cleanWord.slice(0, -1);
    if (wordDict[stem]) return wordDict[stem].meaning;
  }
  if (cleanWord.endsWith("て")) {
    let stem = cleanWord.slice(0, -1);
    if (wordDict[stem]) return wordDict[stem].meaning;
  }
  return "?";
}

function injectWordMeanings() {
  for (let i = 0; i < sentencesData.length; i++) {
    const s = sentencesData[i];
    const words = splitIntoWordsWithFurigana(s.jp);
    const meanings = [];
    for (let w of words) meanings.push(getMeaningForWord(w.clean));
    s.wordMeanings = meanings;
    s.splitWords = words;
  }
}

// ============================================================
// VERSION 1: Simple - Handles single furigana + trailing kana
// Example: 好（す）き → <ruby>好<rt>す</rt></ruby>き
// ============================================================
function buildRubyHTML(text) {
  // Pattern: kanji + (furigana) + optional trailing kana
  return text.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）([\u3040-\u30FF]*)/g, (_, kanji, furigana, trailing) => 
    `<ruby>${kanji}<rt>${furigana}</rt></ruby>${trailing}`
  );
}

// ============================================================
// VERSION 2: Robust - Handles multiple furigana in one string
// Example: 一番（いちばん）好（す）き → 
//          <ruby>一番<rt>いちばん</rt></ruby><ruby>好<rt>す</rt></ruby>き
// ============================================================
/*
function buildRubyHTML(text) {
  // First pass: Handle all furigana with trailing kana
  // This handles: 好（す）き, 楽（たの）しい, 食（た）べて, etc.
  let result = text.replace(
    /([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）([\u3040-\u30FF]*)/g,
    (_, kanji, furigana, trailing) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>${trailing}`
  );
  // Second pass: Handle any remaining simple furigana (kanji without trailing kana)
  result = result.replace(
    /([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g,
    (_, kanji, furigana) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
  );
  return result;
}
*/

function wrapWordsWithTooltips(sentence) {
  const words = sentence.splitWords;
  const meanings = sentence.wordMeanings;
  let result = '';
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const meaning = meanings[i];
    if (word.original.includes('（')) {
      const rubyHtml = buildRubyHTML(word.original);
      result += `<span class="word-tooltip">${rubyHtml}<span class="tooltip-text">${meaning}</span></span>`;
    } else {
      result += `<span class="word-tooltip">${word.original}<span class="tooltip-text">${meaning}</span></span>`;
    }
    if (i < words.length - 1) result += ' ';
  }
  return result;
}