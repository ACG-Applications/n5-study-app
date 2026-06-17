// ==================== FURIGANA FUNCTIONS ====================
function splitIntoWordsWithFurigana(jpText) {
  let segments = jpText.split(/\s+/);
  const result = [];
  
  for (let seg of segments) {
    let cleanWord = seg.replace(/（[^）]+）/g, '');
    const suffixes = ['好き', '嫌い', '欲しい', '楽しい', '悲しい', '嬉しい', '怖い', '痛い', '辛い', '甘い', '美味しい', '忙しい', '難しい'];
    
    let splitHappened = false;
    
    for (let suffix of suffixes) {
      if (cleanWord.endsWith(suffix) && cleanWord.length > suffix.length) {
        const firstPart = cleanWord.slice(0, -suffix.length);
        const secondPart = suffix;
        
        let firstOriginal = seg;
        let secondOriginal = suffix;
        const suffixPattern = suffix;
        let matchIndex = -1;
        
        for (let i = 0; i <= seg.length - suffixPattern.length; i++) {
          let testStr = seg.substr(i, suffixPattern.length).replace(/（[^）]+）/g, '');
          if (testStr === suffixPattern) {
            matchIndex = i;
            break;
          }
        }
        
        if (matchIndex > 0) {
          firstOriginal = seg.substring(0, matchIndex);
          secondOriginal = seg.substring(matchIndex);
        }
        
        result.push({ original: firstOriginal, clean: firstPart });
        result.push({ original: secondOriginal, clean: secondPart });
        splitHappened = true;
        break;
      }
    }
    
    if (!splitHappened) {
      result.push({ original: seg, clean: cleanWord });
    }
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

function buildRubyHTML(text) {
  return text.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>`);
}

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