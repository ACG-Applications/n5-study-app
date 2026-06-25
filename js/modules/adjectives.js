// ==================== ADJECTIVES MODULE ====================

// DEBUG: Check if helpers are loaded
console.log('=== ADJECTIVES MODULE LOADED ===');
console.log('Testing helpers - getWordMeaningsForSentence:', typeof getWordMeaningsForSentence);
console.log('Testing helpers - createQuizWordTooltips:', typeof createQuizWordTooltips);
console.log('Testing helpers - attachQuizTooltipsGlobal:', typeof attachQuizTooltipsGlobal);
console.log('Testing helpers - window.wordDict:', typeof window.wordDict);
console.log('Testing speakText:', typeof speakText);

let currentAdjTab = 'conjugation';
let furiganaHidden = false;
let masteredAdjectives = new Set();
let attemptedAdjectives = new Set();
let currentQuiz = [];
let currentQuizIndex = 0;
let quizAnswers = [];
let quizActive = false;
let quizMode = 'easy';
let quizScore = 0;
let quizAttemptsRemaining = {};
let currentFilterType = 'all';
let currentSearchTerm = '';

// DOM Elements
const furiToggleBtn = document.getElementById('furiToggleBtn');
const tabConjugationBtn = document.getElementById('tabConjugationBtn');
const tabLearnBtn = document.getElementById('tabLearnBtn');
const tabQuizBtn = document.getElementById('tabQuizBtn');
const tabMasteredBtn = document.getElementById('tabMasteredBtn');
const quizEasyModeBtn = document.getElementById('quizEasyModeBtn');
const quizHardModeBtn = document.getElementById('quizHardModeBtn');
const typeSelect = document.getElementById('typeSelect');
const adjSearchInput = document.getElementById('adjSearchInput');

// ========== TTS FUNCTION ==========
function speakText(text, lang = 'ja-JP') {
  if (!text || text === '-' || text.trim() === '') return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.85;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}

// ========== PRINT FUNCTION ==========
function printLesson() {
  window.print();
}

// Helper function to add furigana
function addFuriganaToText(text) {
  if (!text) return '';
  if (furiganaHidden) {
    return text.replace(/[（(][^）)]*[）)]/g, '');
  }
  return text.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => {
    return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
  });
}

// ===== HELPER: Display sentence with proper furigana handling =====
function displaySentenceWithFurigana(sentence) {
  if (!sentence) return '';
  // First, try to use the word meanings/tooltip approach
  if (typeof getWordMeaningsForSentence === 'function' && typeof createQuizWordTooltips === 'function') {
    const wordMeanings = getWordMeaningsForSentence({ jp: sentence });
    if (wordMeanings && wordMeanings.length > 0) {
      // If furigana is hidden, strip furigana from the sentence before creating tooltips
      if (furiganaHidden) {
        const cleanSentence = sentence.replace(/[（(][^）)]*[）)]/g, '').trim();
        const cleanWordMeanings = getWordMeaningsForSentence({ jp: cleanSentence });
        return createQuizWordTooltips(cleanSentence, cleanWordMeanings);
      }
      return createQuizWordTooltips(sentence, wordMeanings);
    }
  }
  // Fallback to basic furigana
  return addFuriganaToText(sentence);
}

// Strip furigana for dropdown
function stripFuriganaForDropdown(text) {
  if (!text) return '';
  return text.replace(/[（(][^）)]*[）)]/g, '');
}

// Format adjective for display with furigana
function formatAdjectiveForDisplay(adj) {
  const displayText = `${adj.dictionary}（${adj.reading}）`;
  return addFuriganaToText(displayText);
}

// ===== RENDER LEARN TAB =====
function renderLearnTab() {
  const container = document.getElementById("learnContent");
  if (!container) return;

  const content = `
        <div class="learn-container" style="background: #ffffff; border-radius: 20px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e8e0d5;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 4px;">
                <h2 style="color: #000000; font-weight: 700; font-size: 1.5rem; margin: 0;">📖 Understanding Adjectives in Japanese</h2>
                <button onclick="printLesson()" style="background: #6c8b6b; color: white; border: none; padding: 8px 20px; border-radius: 40px; cursor: pointer; font-size: 0.9rem; font-weight: 500; font-family: inherit; transition: background 0.2s, transform 0.1s;" onmouseover="this.style.background='#5a7a59'" onmouseout="this.style.background='#6c8b6b'">🖨️ Print Lesson</button>
            </div>
            <p style="color: #444444; font-weight: 400; margin-bottom: 24px;">N5 Level - Complete Guide</p>
            
            <!-- SECTION 1: Introduction -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">1. 形容詞（けいようし）の 基本 / Adjective Basics</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    日本語（にほんご）の 形容詞（けいようし）は <strong>2種類（にしゅるい）</strong> あります：
                </p>
                <ul style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 12px; padding-left: 20px;">
                    <li><strong>い-形容詞（けいようし）</strong> / i-Adjectives</li>
                    <li><strong>な-形容詞（けいようし）</strong> / na-Adjectives</li>
                </ul>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>The golden rule: adjectives always sit <strong>directly before</strong> the noun they modify, or at the <strong>end of a sentence</strong> to describe a state.</em>
                </p>
                
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">特徴（とくちょう）<br><span style="font-weight: 400; font-size: 0.8rem;">Feature</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">い-形容詞（けいようし）<br><span style="font-weight: 400; font-size: 0.8rem;">i-Adjective</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">な-形容詞（けいようし）<br><span style="font-weight: 400; font-size: 0.8rem;">na-Adjective</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">終（お）わり方（かた）<br><span style="font-size: 0.8rem;">Ending</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">い (i)</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Various (not い)</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">名詞（めいし）の 前（まえ）<br><span style="font-size: 0.8rem;">Before noun</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">暑（あつ）い 日（ひ）</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">静（しず）か<strong>な</strong> 人（ひと）</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">文（ぶん）の 終（お）わり<br><span style="font-size: 0.8rem;">End of sentence</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">日（ひ）は 暑（あつ）い です</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">人（ひと）は 静（しず）か です</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">例外（れいがい）<br><span style="font-size: 0.8rem;">Exception</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">いい → よくない</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">きれい (looks like i, but is na)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- SECTION 2: i-Adjectives -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">2. い-形容詞（けいようし） / i-Adjectives</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    い-形容詞（けいようし）は <strong>い (i)</strong> で 終（お）わります。
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>i-Adjectives end with the hiragana character <strong>い (i)</strong>.</em>
                </p>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">名詞（めいし）を 修飾（しゅうしょく）する / Describing a noun</h4>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('あつい ひ')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('あつい ひ');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">暑（あつ）い 日（ひ）</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Hot day</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">状態（じょうたい）を 表（あらわ）す / Describing a state</h4>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('ひ は あつい です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('ひ は あつい です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">日（ひ）は 暑（あつ）い です。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">The day is hot.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">否定形（ひていけい） / Negative form</h4>
                <div style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px;">
                    <div style="font-size: 1rem; color: #000000; font-weight: 400;">
                        <strong>ルール / Rule:</strong> い → くない
                    </div>
                </div>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('あつくない です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('あつくない です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">暑（あつ）<strong>くない</strong> です。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">It is <strong>not</strong> hot.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">過去形（かこけい） / Past form</h4>
                <div style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px;">
                    <div style="font-size: 1rem; color: #000000; font-weight: 400;">
                        <strong>ルール / Rule:</strong> い → かった
                    </div>
                </div>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('あつかった です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('あつかった です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">暑（あつ）<strong>かった</strong> です。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">It <strong>was</strong> hot.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">過去否定形（かこひていけい） / Past Negative form</h4>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('あつくなかった です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('あつくなかった です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">暑（あつ）<strong>くなかった</strong> です。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">It <strong>was not</strong> hot.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">接続（せつぞく） / Connecting adjectives (て-form)</h4>
                <div style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px;">
                    <div style="font-size: 1rem; color: #000000; font-weight: 400;">
                        <strong>ルール / Rule:</strong> い → くて
                    </div>
                </div>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('あつくて むしあつい')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('あつくて むしあつい');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">暑（あつ）<strong>くて</strong> 蒸（む）し暑（あつ）い。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Hot <strong>and</strong> humid.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
            </div>
            
            <!-- SECTION 3: na-Adjectives -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">3. な-形容詞（けいようし） / na-Adjectives</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    な-形容詞（けいようし）は <strong>な (na)</strong> を 使（つか）って 名詞（めいし）を 修飾（しゅうしょく）します。
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>na-Adjectives use <strong>な (na)</strong> to connect to the noun they modify.</em>
                </p>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">名詞（めいし）を 修飾（しゅうしょく）する / Describing a noun</h4>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('しずかな ひと')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('しずかな ひと');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">静（しず）か<strong>な</strong> 人（ひと）</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Quiet person</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">状態（じょうたい）を 表（あらわ）す / Describing a state</h4>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('ひと は しずか です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('ひと は しずか です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">人（ひと）は 静（しず）か です。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">The person is quiet.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">否定形（ひていけい） / Negative form</h4>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('しずか じゃない です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('しずか じゃない です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">静（しず）か<strong>じゃない</strong> です。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">It is <strong>not</strong> quiet.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 12px;">
                    <div style="font-size: 0.9rem; color: #000000; font-weight: 400;">
                        💡 <strong>Alternative:</strong> 静（しず）か<strong>ではありません</strong> (more formal)
                    </div>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">過去形（かこけい） / Past form</h4>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('しずか でした')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('しずか でした');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">静（しず）か<strong>でした</strong>。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">It <strong>was</strong> quiet.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">過去否定形（かこひていけい） / Past Negative form</h4>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('しずか じゃなかった です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('しずか じゃなかった です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">静（しず）か<strong>じゃなかった</strong> です。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">It <strong>was not</strong> quiet.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">接続（せつぞく） / Connecting adjectives (て-form)</h4>
                <div style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px;">
                    <div style="font-size: 1rem; color: #000000; font-weight: 400;">
                        <strong>ルール / Rule:</strong> な → で (Add で)
                    </div>
                </div>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('しずかで きれいな まち')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('しずかで きれいな まち');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">静（しず）か<strong>で</strong> 綺麗（きれい）な 町（まち）</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">A quiet <strong>and</strong> beautiful town.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
            </div>
            
            <!-- SECTION 4: Comparison -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">4. 比較（ひかく） / Comparison</h3>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">より (yori) - "more than" / "than"</h4>
                <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
                    <div style="font-size: 1rem; color: #000000; font-weight: 400;">
                        <strong>ルール / Rule:</strong> A は B より + Adjective
                    </div>
                </div>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('りんご は バナナ より やすい です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('りんご は バナナ より やすい です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">りんご は バナナ <strong>より</strong> 安（やす）い です。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Apples are cheaper <strong>than</strong> bananas.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">一番（いちばん） - "the most"</h4>
                <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
                    <div style="font-size: 1rem; color: #000000; font-weight: 400;">
                        <strong>ルール / Rule:</strong> A は [group] の 中（なか）で 一番（いちばん）+ Adjective
                    </div>
                </div>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('りんご は くだもの の なか で いちばん すき です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('りんご は くだもの の なか で いちばん すき です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">りんご は 果物（くだもの）の 中（なか）で <strong>一番（いちばん）</strong> 好（す）き です。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I like apples <strong>the most</strong> among fruits.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
            </div>
            
            <!-- SECTION 5: Key Exceptions -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">5. 例外（れいがい） / Key Exceptions</h3>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">いい (good) - Special Case</h4>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    「いい」は い-形容詞（けいようし）ですが、否定形（ひていけい）は 古（ふる）い 形（かたち）の 「よい」 から 作（つく）ります。
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>"いい (ii / good)" is an i-adjective, but its negative forms are built from its older form "よい (yoi)".</em>
                </p>
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">形（けい）<br><span style="font-weight: 400; font-size: 0.8rem;">Form</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">正（ただ）しい<br><span style="font-weight: 400; font-size: 0.8rem;">Correct</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">❌ 間違（まちが）い<br><span style="font-weight: 400; font-size: 0.8rem;">Incorrect</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Present</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">いい です</td>
                                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">—</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Negative</td>
                                <td style="padding: 8px 16px; color: #28a745; font-weight: 400;"><strong>よくない</strong> です</td>
                                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">い じゃない ❌</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Past</td>
                                <td style="padding: 8px 16px; color: #28a745; font-weight: 400;"><strong>よかった</strong> です</td>
                                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">い かった ❌</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('きょう は てんき が よくない です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('きょう は てんき が よくない です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">今日（きょう）は 天気（てんき）が <strong>よくない</strong> です。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">The weather is <strong>not</strong> good today.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">きれい (beautiful/clean) - Looks like i, but is na</h4>
                <div style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px;">
                    <div style="font-size: 1rem; color: #000000; font-weight: 400;">
                        ⚠️ <strong>重要（じゅうよう）！</strong> 「きれい」は <strong>な-形容詞（けいようし）</strong> です。
                    </div>
                    <div style="font-size: 0.95rem; color: #555555; font-weight: 400; margin-top: 4px;">
                        <em>⚠️ Important! "きれい (kirei)" is a <strong>na-adjective</strong>, even though it ends in い.</em>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('きれいな ひと')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('きれいな ひと');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                        <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">綺麗（きれい）<strong>な</strong> 人（ひと）</div>
                        <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Beautiful person ✅</div>
                        <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                    </div>
                    <div style="background: #f8d7da; border-radius: 12px; padding: 16px; border-left: 4px solid #dc3545;">
                        <div style="font-size: 1.1rem; color: #d9534f; font-weight: 500;">綺麗（きれい）<strong>い</strong> 人（ひと）</div>
                        <div style="color: #721c24; font-weight: 400; font-size: 0.95rem;">Beautiful person ❌</div>
                        <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">⚠️ 間違（まちが）い / Incorrect</div>
                    </div>
                </div>
            </div>
            
            <!-- SECTION 6: Common N5 Adjectives -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">6. N5 で よく 使（つか）う 形容詞（けいようし） / Common N5 Adjectives</h3>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">い-形容詞（けいようし） / i-Adjectives</h4>
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">形容詞（けいようし）<br><span style="font-weight: 400; font-size: 0.8rem;">Adjective</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">読（よ）み方（かた）<br><span style="font-weight: 400; font-size: 0.8rem;">Reading</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">意味（いみ）<br><span style="font-weight: 400; font-size: 0.8rem;">Meaning</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">暑（あつ）い</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">あつい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">hot</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">寒（さむ）い</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">さむい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">cold</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">高（たか）い</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">たかい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">tall / expensive</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">安（やす）い</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">やすい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">cheap</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">楽（たの）しい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">たのしい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">fun</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">難（むずか）しい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">むずかしい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">difficult</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">易（やさ）しい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">やさしい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">easy</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">忙（いそが）しい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">いそがしい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">busy</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">美味（おい）しい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">おいしい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">delicious</td></tr>
                            <tr><td style="padding: 8px 16px; color: #000000; font-weight: 400;">新（あたら）しい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">あたらしい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">new</td></tr>
                        </tbody>
                    </table>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">な-形容詞（けいようし） / na-Adjectives</h4>
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">形容詞（けいようし）<br><span style="font-weight: 400; font-size: 0.8rem;">Adjective</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">読（よ）み方（かた）<br><span style="font-weight: 400; font-size: 0.8rem;">Reading</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">意味（いみ）<br><span style="font-weight: 400; font-size: 0.8rem;">Meaning</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">静（しず）か</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">しずか</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">quiet</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">綺麗（きれい）</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">きれい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">beautiful / clean</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">好（す）き</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">すき</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">liked</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">嫌（きら）い</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">きらい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">disliked</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">上手（じょうず）</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">じょうず</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">skillful</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">下手（へた）</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">へた</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">unskillful</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">元気（げんき）</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">げんき</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">healthy / energetic</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">有名（ゆうめい）</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">ゆうめい</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">famous</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">便利（べんり）</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">べんり</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">convenient</td></tr>
                            <tr><td style="padding: 8px 16px; color: #000000; font-weight: 400;">簡単（かんたん）</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">かんたん</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">simple / easy</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- SECTION 7: Common Mistakes -->
            <div class="learn-section" style="margin-bottom: 20px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">7. よくある 間違（まちが）い / Common Mistakes</h3>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">❌ 間違（まちが）い<br><span style="font-weight: 400; font-size: 0.8rem;">Incorrect</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">✅ 正（ただ）しい<br><span style="font-weight: 400; font-size: 0.8rem;">Correct</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">理（り）由（ゆう）<br><span style="font-weight: 400; font-size: 0.8rem;">Reason</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">綺麗（きれい）い 人（ひと）</td>
                                <td style="padding: 8px 16px; color: #28a745; font-weight: 400;">綺麗（きれい）<strong>な</strong> 人（ひと）</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">きれい は な-形容詞（けいようし）</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">静（しず）かな です</td>
                                <td style="padding: 8px 16px; color: #28a745; font-weight: 400;">静（しず）か です</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">文（ぶん）の 終（お）わり は な が いらない</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">いい じゃない</td>
                                <td style="padding: 8px 16px; color: #28a745; font-weight: 400;"><strong>よくない</strong></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">いい の 否定形（ひていけい）は よくない</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">好（す）きな です</td>
                                <td style="padding: 8px 16px; color: #28a745; font-weight: 400;">好（す）き です</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">文（ぶん）の 終（お）わり は な が いらない</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- SUMMARY BOX -->
            <div style="background: #e8f0e7; border-radius: 16px; padding: 20px; margin-top: 24px; border-left: 4px solid #6c8b6b;">
                <h4 style="color: #000000; font-weight: 700; font-size: 1.1rem; margin-bottom: 12px;">📌 まとめ / Summary</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px;">
                    <div style="color: #000000; font-weight: 500;">✅ い-形容詞（けいようし）<br><span style="font-weight: 400; font-size: 0.85rem;">i-Adjective Rules</span></div>
                    <div style="color: #000000; font-weight: 400;">
                        終（お）わりは い<br>
                        名詞（めいし）の 前（まえ）：暑（あつ）い 日（ひ）<br>
                        否定（ひてい）：暑（あつ）くない<br>
                        過去（かこ）：暑（あつ）かった<br>
                        接続（せつぞく）：暑（あつ）くて
                    </div>
                    <div style="color: #000000; font-weight: 500;">✅ な-形容詞（けいようし）<br><span style="font-weight: 400; font-size: 0.85rem;">na-Adjective Rules</span></div>
                    <div style="color: #000000; font-weight: 400;">
                        名詞（めいし）の 前（まえ）：静（しず）かな 人（ひと）<br>
                        文（ぶん）の 終（お）わり：静（しず）か です<br>
                        否定（ひてい）：静（しず）かじゃない<br>
                        過去（かこ）：静（しず）かでした<br>
                        接続（せつぞく）：静（しず）かで
                    </div>
                    <div style="color: #000000; font-weight: 500;">✅ 例外（れいがい）<br><span style="font-weight: 400; font-size: 0.85rem;">Exceptions</span></div>
                    <div style="color: #000000; font-weight: 400;">
                        いい → よくない<br>
                        きれい は な-形容詞（けいようし）
                    </div>
                    <div style="color: #000000; font-weight: 500;">✅ 比較（ひかく）<br><span style="font-weight: 400; font-size: 0.85rem;">Comparison</span></div>
                    <div style="color: #000000; font-weight: 400;">
                        より = more than<br>
                        一番（いちばん）= the most
                    </div>
                </div>
            </div>
            
        </div>
    `;

  // Apply furigana to all Japanese text in the content
  container.innerHTML = addFuriganaToText(content);

  // Add TTS click listeners to all example elements
  document.querySelectorAll(".example-box, .example-click").forEach((el) => {
    if (!el.hasAttribute("data-tts-attached")) {
      el.setAttribute("data-tts-attached", "true");
      if (!el.hasAttribute("onclick")) {
        const text = el.textContent.trim().replace(/[🔊]/g, "").trim();
        if (text) {
          el.addEventListener("click", function (e) {
            if (
              e.target.closest(".tooltip-text") ||
              e.target.closest(".particle-highlight") ||
              e.target.closest(".word-tooltip")
            )
              return;
            const cleanText = text.replace(/[→].*$/, "").trim();
            if (cleanText && typeof speakText === "function") {
              speakText(cleanText);
            }
          });
        }
      }
    }
  });
}

// Load mastered adjectives from localStorage
function loadMasteredAdjectives() {
  const stored = localStorage.getItem('masteredAdjectives');
  if (stored) {
    masteredAdjectives = new Set(JSON.parse(stored));
  }
  const storedAttempted = localStorage.getItem('attemptedAdjectives');
  if (storedAttempted) {
    attemptedAdjectives = new Set(JSON.parse(storedAttempted));
  }
  updateMasteredCount();
}

function saveMasteredAdjectives() {
  localStorage.setItem('masteredAdjectives', JSON.stringify([...masteredAdjectives]));
  localStorage.setItem('attemptedAdjectives', JSON.stringify([...attemptedAdjectives]));
  updateMasteredCount();
}

function updateMasteredCount() {
  const total = adjectiveOrder.length;
  const mastered = masteredAdjectives.size;
  const attempted = attemptedAdjectives.size;
  const countEl = document.getElementById('masteredCount');
  const totalEl = document.getElementById('totalCount');
  if (countEl) countEl.innerText = mastered;
  if (totalEl) totalEl.innerText = total;
  
  const quizMasteredEl = document.getElementById('quizMasteredCount');
  const quizAttemptedEl = document.getElementById('quizAttemptedCount');
  const quizTotalEl = document.getElementById('quizTotalAdjs');
  const quizTotalEl2 = document.getElementById('quizTotalAdjs2');
  if (quizMasteredEl) quizMasteredEl.innerText = mastered;
  if (quizAttemptedEl) quizAttemptedEl.innerText = attempted;
  if (quizTotalEl) quizTotalEl.innerText = total;
  if (quizTotalEl2) quizTotalEl2.innerText = total;
}

function markAdjectiveMastered(adjId, isFirstAttempt = true) {
  if (isFirstAttempt && !masteredAdjectives.has(adjId)) {
    masteredAdjectives.add(adjId);
  }
  if (!attemptedAdjectives.has(adjId)) {
    attemptedAdjectives.add(adjId);
  }
  saveMasteredAdjectives();
  renderAdjectivesList();
  renderMasteredList();
}

function unmarkAdjectiveMastered(adjId) {
  masteredAdjectives.delete(adjId);
  saveMasteredAdjectives();
  renderAdjectivesList();
  renderMasteredList();
}

function applyFuriganaHide() {
  furiganaHidden = !furiganaHidden;
  if (furiToggleBtn) {
    furiToggleBtn.innerText = furiganaHidden ? '🔤 Furigana On' : '🔤 Furigana Off';
  }
  renderAdjectivesList();
  renderLearnTab();
  renderMasteredList();
  if (quizActive && currentQuiz.length > 0) {
    renderQuizQuestion();
  }
}

function renderAdjectivesList() {
  const container = document.getElementById('adjectivesList');
  if (!container) return;
  
  let filteredAdjs = [...adjectivesData];
  
  if (currentFilterType !== 'all') {
    filteredAdjs = filteredAdjs.filter(a => a.type === currentFilterType);
  }
  
  if (currentSearchTerm) {
    const searchLower = currentSearchTerm.toLowerCase();
    filteredAdjs = filteredAdjs.filter(a => 
      a.dictionary.toLowerCase().includes(searchLower) ||
      a.reading.toLowerCase().includes(searchLower) ||
      a.meaning.toLowerCase().includes(searchLower)
    );
  }
  
  let html = '';
  
  const conjugationDisplayNames = {
    nai: 'Negative (ない)',
    ta: 'Past (た)',
    nakatta: 'Past Negative (なかった)',
    masu: 'Present (です)',
    masu_nai: 'Negative (じゃありません)',
    masu_ta: 'Past (でした)',
    masu_nakatta: 'Past Negative (じゃありませんでした)',
    conditional: 'Conditional (ば/なら)',
    te: 'Te-form (て/で)',
    adverbial: 'Adverbial (く/に)'
  };
  
  const conjOrder = ['masu', 'nai', 'ta', 'nakatta', 'te', 'conditional', 'adverbial'];
  
  for (const adj of filteredAdjs) {
    const isMastered = masteredAdjectives.has(adj.id);
    const typeClass = adj.type === 'i' ? 'type-i' : 'type-na';
    const typeName = adj.type === 'i' ? 'い-adjective' : 'な-adjective';
    
    let examplesHtml = '';
    if (adj.examples && adj.examples.length > 0) {
      for (const ex of adj.examples) {
        // ===== Use the helper that respects furigana toggle =====
        let displayJp = displaySentenceWithFurigana(ex.sentence);
        
        const reading = ex.reading || ex.sentence.replace(/[（(][^）)]*[）)]/g, '').trim();
        
        examplesHtml += `
          <div class="example-item" data-reading="${reading}">
            <div class="example-jp">${displayJp}</div>
            <div class="example-trans">→ ${ex.english}</div>
            <button class="small-btn example-tts-btn" style="margin-top: 6px; font-size: 0.7rem; background: #6c8b6b; color: white; border: none; padding: 2px 12px; border-radius: 20px; cursor: pointer;" data-reading="${reading}">🔊 Listen</button>
          </div>
        `;
      }
    }
    
    const dictDisplay = formatAdjectiveForDisplay(adj);
    
    html += `
      <div class="adj-card ${isMastered ? 'mastered' : ''}" data-adj-id="${adj.id}">
        <div class="adj-header">
          <div>
            <span class="adj-title">${dictDisplay}</span>
            <span class="adj-reading">(${adj.reading})</span>
            <span class="type-badge ${typeClass}">${typeName}</span>
            ${isMastered ? '<span class="mastered-badge">✓ Mastered</span>' : ''}
          </div>
          <div>
            <span class="adj-meaning">${adj.meaning}</span>
          </div>
        </div>
        
        <div class="conjugation-table">
    `;
    
    for (const conjType of conjOrder) {
      const conjValue = adj.conjugations[conjType];
      if (conjValue) {
        html += `
          <div class="conj-item">
            <div class="conj-label">${conjugationDisplayNames[conjType]}</div>
            <div class="conj-value">${addFuriganaToText(conjValue)}</div>
          </div>
        `;
      }
    }
    
    html += `
        </div>
        
        <div class="adj-examples">
          <h4>📝 Example Sentences</h4>
          ${examplesHtml || '<p style="color: #999; font-style: italic;">No example sentences available.</p>'}
        </div>
        
        <button class="small-btn mark-mastered-btn" data-adj-id="${adj.id}">
          ${isMastered ? '✓ Mastered' : '✓ Mark as Mastered'}
        </button>
      </div>
    `;
  }
  
  if (filteredAdjs.length === 0) {
    html = '<p style="text-align: center; padding: 40px;">No adjectives match your filters.</p>';
  }
  
  container.innerHTML = html;
  
  // ===== TTS SUPPORT: Add click listeners for example items and buttons =====
  document.querySelectorAll('.example-item').forEach(el => {
    const reading = el.dataset.reading;
    if (reading) {
      // Click on the example item itself plays audio
      el.addEventListener('click', (e) => {
        if (e.target.closest('.example-tts-btn') || e.target.closest('.tooltip-text') || e.target.closest('.word-tooltip')) return;
        console.log('TTS: Playing example sentence:', reading);
        if (typeof speakText === 'function') {
          speakText(reading);
        } else if (typeof window.speakText === 'function') {
          window.speakText(reading);
        }
      });
      // TTS button inside the example
      const ttsBtn = el.querySelector('.example-tts-btn');
      if (ttsBtn) {
        ttsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const btnReading = ttsBtn.dataset.reading || reading;
          console.log('TTS: Playing from button:', btnReading);
          if (typeof speakText === 'function') {
            speakText(btnReading);
          } else if (typeof window.speakText === 'function') {
            window.speakText(btnReading);
          }
        });
      }
    }
  });
  
  document.querySelectorAll('.mark-mastered-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const adjId = btn.dataset.adjId;
      if (masteredAdjectives.has(adjId)) {
        unmarkAdjectiveMastered(adjId);
      } else {
        markAdjectiveMastered(adjId, true);
      }
    });
  });
  
  // ===== ATTACH TOOLTIPS =====
  if (typeof attachQuizTooltipsGlobal === 'function') {
    setTimeout(attachQuizTooltipsGlobal, 100);
  } else if (typeof attachQuizTooltips === 'function') {
    setTimeout(attachQuizTooltips, 100);
  } else if (typeof attachTooltipLongPress === 'function') {
    setTimeout(() => attachTooltipLongPress(container), 100);
  }
}

function renderMasteredList() {
  const container = document.getElementById('masteredList');
  if (!container) return;
  
  const masteredIds = [...masteredAdjectives];
  
  if (masteredIds.length === 0) {
    container.innerHTML = '<p class="empty-message">No adjectives mastered yet. Complete a quiz to master adjectives!</p>';
    return;
  }
  
  let html = '';
  for (const adjId of masteredIds) {
    const adj = getAdjectiveById(adjId);
    if (adj) {
      const dictDisplay = formatAdjectiveForDisplay(adj);
      html += `
        <div class="mastered-adj-item">
          <div class="mastered-adj-info">
            <span class="mastered-adj-dict">${dictDisplay}</span>
            <span class="mastered-adj-meaning" style="margin-left: 10px; color: #666;">${adj.meaning}</span>
          </div>
          <button class="unmaster-btn" data-adj-id="${adj.id}">Remove</button>
        </div>
      `;
    }
  }
  
  container.innerHTML = html;
  
  document.querySelectorAll('.unmaster-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const adjId = btn.dataset.adjId;
      unmarkAdjectiveMastered(adjId);
    });
  });
}

// ==================== QUIZ FUNCTIONS ====================

function generateQuiz() {
  console.log('generateQuiz called! Mode:', quizMode);
  setModeButtonsEnabled(false);
  
  const questionCount = parseInt(document.getElementById('quizCountSelect').value);
  const allQuestions = [];
  
  const availableAdjs = adjectivesData.filter(a => a.examples && a.examples.length > 0);
  
  if (availableAdjs.length === 0) {
    const quizArea = document.getElementById('quizArea');
    if (quizArea) {
      quizArea.innerHTML = '<p class="quiz-welcome" style="color: red;">No adjectives with examples available for quiz.</p>';
    }
    setModeButtonsEnabled(true);
    return;
  }
  
  // Shuffle
  for (let i = availableAdjs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableAdjs[i], availableAdjs[j]] = [availableAdjs[j], availableAdjs[i]];
  }
  
  const conjugationTypes = ['masu', 'nai', 'ta', 'nakatta', 'te', 'conditional', 'adverbial'];
  const displayNames = {
    masu: 'Present (polite)',
    nai: 'Negative',
    ta: 'Past',
    nakatta: 'Past Negative',
    te: 'Te-form',
    conditional: 'Conditional',
    adverbial: 'Adverbial form'
  };
  
  for (const adj of availableAdjs) {
    if (allQuestions.length >= questionCount) break;
    
    const randomConj = conjugationTypes[Math.floor(Math.random() * conjugationTypes.length)];
    const correctForm = adj.conjugations[randomConj];
    const example = adj.examples[0];
    if (!example) continue;
    
    // Create sentence with blank - replace the adjective with _______
    let sentenceWithBlank = example.sentence;
    const adjFormInSentence = adj.type === 'i' ? `${adj.dictionary}い` : adj.dictionary;
    
    if (sentenceWithBlank.includes(adjFormInSentence)) {
      sentenceWithBlank = sentenceWithBlank.replace(adjFormInSentence, '______');
    } else if (sentenceWithBlank.includes(adj.dictionary)) {
      sentenceWithBlank = sentenceWithBlank.replace(adj.dictionary, '______');
    } else {
      const cleanAdj = adj.dictionary.replace(/[（(][^）)]*[）)]/g, '');
      sentenceWithBlank = sentenceWithBlank.replace(cleanAdj, '______');
    }
    
    // Generate options for easy mode
    const easyOptions = [correctForm];
    const otherAdjs = availableAdjs.filter(a => a.id !== adj.id);
    
    while (easyOptions.length < 4 && otherAdjs.length > 0) {
      const randomAdj = otherAdjs[Math.floor(Math.random() * otherAdjs.length)];
      const randomOtherConj = conjugationTypes[Math.floor(Math.random() * conjugationTypes.length)];
      const otherForm = randomAdj.conjugations[randomOtherConj];
      if (!easyOptions.includes(otherForm) && otherForm !== correctForm) {
        easyOptions.push(otherForm);
      }
    }
    
    const fallbacks = ['高いです', '安いです', '楽しいです', '難しいです', '綺麗です'];
    while (easyOptions.length < 4) {
      const fb = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      if (!easyOptions.includes(fb)) {
        easyOptions.push(fb);
      }
    }
    
    // Shuffle easy options
    for (let i = easyOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [easyOptions[i], easyOptions[j]] = [easyOptions[j], easyOptions[i]];
    }
    
    allQuestions.push({
      sentence: sentenceWithBlank,
      translation: example.english,
      correctAnswer: correctForm,
      easyOptions: easyOptions,
      adjDict: adj.dictionary,
      adjReading: adj.reading,
      adjMeaning: adj.meaning,
      conjugationType: randomConj,
      conjugationDisplay: displayNames[randomConj],
      originalSentence: example.sentence,
      adjId: adj.id,
      type: adj.type,
      conjugations: adj.conjugations,
      reading: example.reading || example.sentence.replace(/[（(][^）)]*[）)]/g, '').trim()
    });
  }
  
  // Shuffle final questions
  for (let i = allQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
  }
  
  currentQuiz = allQuestions.slice(0, questionCount);
  currentQuizIndex = 0;
  quizAnswers = new Array(currentQuiz.length).fill(null);
  quizActive = true;
  quizScore = 0;
  quizAttemptsRemaining = {};
  
  for (let i = 0; i < currentQuiz.length; i++) {
    quizAttemptsRemaining[i] = 2;
  }
  
  updateQuizStatsDisplay();
  renderQuizQuestion();
}

function setModeButtonsEnabled(enabled) {
  if (quizEasyModeBtn) {
    quizEasyModeBtn.disabled = !enabled;
    quizEasyModeBtn.style.opacity = enabled ? '1' : '0.5';
  }
  if (quizHardModeBtn) {
    quizHardModeBtn.disabled = !enabled;
    quizHardModeBtn.style.opacity = enabled ? '1' : '0.5';
  }
}

function updateQuizStatsDisplay() {
  const totalPossible = currentQuiz.length;
  const scoreEl = document.getElementById('quizRunningScore');
  const totalEl = document.getElementById('quizTotalPossible');
  if (scoreEl) scoreEl.innerText = quizScore.toFixed(1);
  if (totalEl) totalEl.innerText = totalPossible;
  updateMasteredCount();
}

function renderQuizQuestion() {
  console.log('=== renderQuizQuestion called ===');
  const quizArea = document.getElementById('quizArea');
  const resultsDiv = document.getElementById('quizResults');
  if (!quizArea) {
    console.warn('quizArea not found!');
    return;
  }
  
  if (resultsDiv) resultsDiv.style.display = 'none';
  
  if (!quizActive || currentQuizIndex >= currentQuiz.length) {
    showQuizResults();
    return;
  }
  
  const q = currentQuiz[currentQuizIndex];
  console.log('Current question:', q);
  const attemptsLeft = quizAttemptsRemaining[currentQuizIndex];
  const currentAnswer = quizAnswers[currentQuizIndex];
  const reading = q.reading || '';
  
  const quizTitle = quizMode === 'easy' 
    ? "📝 Adjective Conjugation Quiz - choose the correct form"
    : "📝 Adjective Conjugation Quiz - select the correct form";
  
  const dictDisplay = formatAdjectiveForDisplay({dictionary: q.adjDict, reading: q.adjReading});
  
  // ===== Use the helper that respects furigana toggle =====
  let sentenceDisplay = displaySentenceWithFurigana(q.sentence);
  console.log('Final sentence display:', sentenceDisplay);
  
  // Build the HTML
  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #ddd;">
      <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <span style="font-weight: bold; font-size: 1rem; color: #1e4b6e;">${quizTitle}</span>
        <span style="background: #e8f0fe; padding: 6px 14px; border-radius: 20px; font-size: 0.9rem;">📚 Dictionary: ${dictDisplay} (${q.adjMeaning})</span>
      </div>
      <div style="display: flex; gap: 16px; align-items: center;">
        <span style="font-weight: bold; font-size: 1rem; color: #6c8b6b;">⭐ Score: ${quizScore.toFixed(1)}</span>
        <span style="font-weight: bold; font-size: 1rem; color: #c45d1e;">❤️ ${attemptsLeft}</span>
        ${reading ? `<button class="quiz-tts-btn" data-reading="${reading}" style="margin-left: 8px; background: #6c8b6b; color: white; border: none; padding: 4px 14px; border-radius: 30px; cursor: pointer; font-size: 0.85rem;">🔊 Listen</button>` : '<span style="font-size: 0.7rem; color: #999;">(no audio)</span>'}
      </div>
    </div>
    <div id="quizFeedbackArea"></div>
    <div style="background: #f9fcff; border-radius: 20px; padding: 20px; margin-bottom: 16px;">
      <div style="font-size: 1.4rem; text-align: center; margin: 16px 0; line-height: 1.5; cursor: pointer;" class="quiz-sentence" data-reading="${reading}">${sentenceDisplay}</div>
      <div style="text-align: center; margin: 16px 0; padding: 12px; background: #e8f0fe; border-radius: 12px;">
        <div style="font-size: 0.75rem; color: #666;">📖 English</div>
        <div style="font-size: 1.1rem; font-weight: bold; color: #1e4b6e;">"${q.translation}"</div>
      </div>
  `;
  
  if (quizMode === 'easy') {
    html += `
      <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 16px 0;">
    `;
    for (const opt of q.easyOptions) {
      const isSelected = currentAnswer && currentAnswer.selected === opt;
      html += `
        <button class="quiz-option-btn" data-answer="${opt.replace(/"/g, '&quot;')}" style="background: ${isSelected ? '#6c8b6b' : '#fff'}; color: ${isSelected ? '#fff' : '#000'}; border: 2px solid #6c8b6b; border-radius: 40px; padding: 10px 18px; font-size: 1rem; cursor: pointer;">
          ${addFuriganaToText(opt)}
        </button>
      `;
    }
    html += `</div>`;
  } else {
    // HARD MODE - Shuffle the order of conjugations
    const conjOrder = ['masu', 'nai', 'ta', 'nakatta', 'te', 'conditional', 'adverbial'];
    const conjLabels = {
      masu: 'Present',
      nai: 'Negative',
      ta: 'Past',
      nakatta: 'Past Negative',
      te: 'Te-form',
      conditional: 'Conditional',
      adverbial: 'Adverbial'
    };
    
    const conjugationButtons = [];
    for (const conjType of conjOrder) {
      const conjValue = q.conjugations[conjType];
      if (conjValue) {
        conjugationButtons.push({
          type: conjLabels[conjType],
          value: conjValue,
          display: addFuriganaToText(conjValue)
        });
      }
    }
    
    for (let i = conjugationButtons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [conjugationButtons[i], conjugationButtons[j]] = [conjugationButtons[j], conjugationButtons[i]];
    }
    
    html += `
      <div style="text-align: center; margin: 8px 0 4px 0;">
        <span style="font-size: 0.85rem; color: #666;">Select the correct form:</span>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 16px 0;">
    `;
    
    for (const btn of conjugationButtons) {
      const isSelected = currentAnswer && currentAnswer.selected === btn.value;
      html += `
        <button class="hard-opt-btn" data-answer="${btn.value.replace(/"/g, '&quot;')}" style="background: ${isSelected ? '#6c8b6b' : '#fff'}; color: ${isSelected ? '#fff' : '#000'}; border: 2px solid #6c8b6b; border-radius: 40px; padding: 10px 18px; font-size: 0.9rem; cursor: pointer;">
          ${btn.display}
        </button>
      `;
    }
    html += `</div>`;
  }
  
  html += `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 20px;">
        <button id="quizSubmitBtn" style="background: #1a2b4c; color: white; border: none; padding: 10px 22px; border-radius: 40px; cursor: pointer; font-size: 0.9rem;">✅ Check</button>
        <button id="quizShowAnswerBtn" style="background: #ffc107; border: none; padding: 10px 22px; border-radius: 40px; cursor: pointer; font-size: 0.9rem;">📖 Show</button>
        <button id="quizStopBtn" style="background: #dc3545; color: white; border: none; padding: 10px 22px; border-radius: 40px; cursor: pointer; font-size: 0.9rem;">⏹️ Stop</button>
        <button id="quizResetBtn" style="background: #6c757d; color: white; border: none; padding: 10px 22px; border-radius: 40px; cursor: pointer; font-size: 0.9rem;">🔄 Reset</button>
        <button id="quizSkipBtn" style="background: #17a2b8; color: white; border: none; padding: 10px 22px; border-radius: 40px; cursor: pointer; font-size: 0.9rem;">⏭️ Skip</button>
      </div>
    </div>
  `;
  
  quizArea.innerHTML = html;
  console.log('Quiz HTML rendered');
  
  // ===== TTS SUPPORT: Add click listener to the listen button =====
  const ttsBtn = quizArea.querySelector('.quiz-tts-btn');
  if (ttsBtn) {
    console.log('TTS: Found listen button');
    const btnReading = ttsBtn.dataset.reading || reading;
    ttsBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log('TTS: Button clicked, reading:', btnReading);
      if (btnReading) {
        if (typeof speakText === 'function') {
          speakText(btnReading);
        } else if (typeof window.speakText === 'function') {
          window.speakText(btnReading);
        } else if (window.speechSynthesis) {
          console.log('TTS: Using fallback speechSynthesis');
          const utterance = new SpeechSynthesisUtterance(btnReading);
          utterance.lang = 'ja-JP';
          utterance.rate = 0.85;
          window.speechSynthesis.speak(utterance);
        } else {
          console.warn('TTS: No speech synthesis available');
        }
      }
    });
  } else {
    console.log('TTS: Listen button not found or no reading available');
  }
  
  // ===== TTS SUPPORT: Click on sentence to play audio =====
  const sentenceEl = quizArea.querySelector('.quiz-sentence');
  if (sentenceEl && reading) {
    sentenceEl.style.cursor = 'pointer';
    sentenceEl.title = 'Click to listen';
    sentenceEl.addEventListener('click', function(e) {
      if (e.target.closest('.tooltip-text') || e.target.closest('.particle-highlight') || e.target.closest('.word-tooltip')) {
        console.log('TTS: Click on tooltip ignored');
        return;
      }
      console.log('TTS: Playing from sentence click:', reading);
      if (typeof speakText === 'function') {
        speakText(reading);
      } else if (typeof window.speakText === 'function') {
        window.speakText(reading);
      } else if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(reading);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      }
    });
  }
  
  // ===== ATTACH TOOLTIPS =====
  console.log('Attaching tooltips...');
  if (typeof attachQuizTooltipsGlobal === 'function') {
    setTimeout(function() {
      console.log('Calling attachQuizTooltipsGlobal');
      attachQuizTooltipsGlobal();
    }, 150);
  } else if (typeof attachQuizTooltips === 'function') {
    setTimeout(function() {
      console.log('Calling attachQuizTooltips');
      attachQuizTooltips();
    }, 150);
  } else if (typeof attachTooltipLongPress === 'function') {
    setTimeout(function() {
      console.log('Calling attachTooltipLongPress');
      attachTooltipLongPress(quizArea);
    }, 150);
  }
  
  // Option button event listeners
  if (quizMode === 'easy') {
    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.quiz-option-btn').forEach(b => {
          b.style.background = '#fff';
          b.style.color = '#000';
          b.classList.remove('selected');
        });
        this.style.background = '#6c8b6b';
        this.style.color = '#fff';
        this.classList.add('selected');
        const selectedAnswer = this.dataset.answer;
        if (!quizAnswers[currentQuizIndex]) quizAnswers[currentQuizIndex] = {};
        quizAnswers[currentQuizIndex].selected = selectedAnswer;
      });
    });
  } else {
    document.querySelectorAll('.hard-opt-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.hard-opt-btn').forEach(b => {
          b.style.background = '#fff';
          b.style.color = '#000';
          b.classList.remove('selected');
        });
        this.style.background = '#6c8b6b';
        this.style.color = '#fff';
        this.classList.add('selected');
        const selectedAnswer = this.dataset.answer;
        if (!quizAnswers[currentQuizIndex]) quizAnswers[currentQuizIndex] = {};
        quizAnswers[currentQuizIndex].selected = selectedAnswer;
      });
    });
  }
  
  document.getElementById('quizSubmitBtn')?.addEventListener('click', () => checkAnswer());
  document.getElementById('quizShowAnswerBtn')?.addEventListener('click', () => showAnswer());
  document.getElementById('quizSkipBtn')?.addEventListener('click', () => {
    currentQuizIndex++;
    renderQuizQuestion();
  });
  document.getElementById('quizStopBtn')?.addEventListener('click', () => stopQuiz());
  document.getElementById('quizResetBtn')?.addEventListener('click', () => resetQuiz());
}

function normalizeForCompare(str) {
  if (!str) return '';
  let cleaned = str.replace(/[（(][^）)]*[）)]/g, '');
  cleaned = cleaned.replace(/\s+/g, '');
  cleaned = cleaned.replace(/[〜〜]/g, '');
  return cleaned;
}

function checkAnswer() {
  const q = currentQuiz[currentQuizIndex];
  const userAnswer = quizAnswers[currentQuizIndex];
  const userChoice = userAnswer ? userAnswer.selected : '';
  const isFirstAttempt = (quizAttemptsRemaining[currentQuizIndex] === 2);
  let pointsEarned = 0;
  
  if (!userChoice) {
    const feedbackDiv = document.getElementById('quizFeedbackArea');
    if (feedbackDiv) {
      feedbackDiv.innerHTML = `
        <div style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 16px; margin: 12px 0;">
          ⚠️ Please select an answer.
        </div>
      `;
    }
    return;
  }
  
  const isCorrect = normalizeForCompare(userChoice) === normalizeForCompare(q.correctAnswer);
  
  if (isCorrect) {
    if (isFirstAttempt) {
      pointsEarned = 1;
      markAdjectiveMastered(q.adjId, true);
    } else {
      pointsEarned = 0.5;
    }
    quizScore += pointsEarned;
    
    if (!attemptedAdjectives.has(q.adjId)) {
      attemptedAdjectives.add(q.adjId);
      saveMasteredAdjectives();
    }
    
    updateQuizStatsDisplay();
    
    // ===== Use the helper that respects furigana toggle =====
    let sentenceDisplay = displaySentenceWithFurigana(q.originalSentence);
    
    const reading = q.reading || '';
    const feedbackHtml = `
      <div style="background: #d4edda; color: #155724; padding: 12px; border-radius: 16px; margin: 12px 0;">
        ✅ ${isFirstAttempt ? 'Correct! +1 point' : 'Correct on 2nd try! +0.5 points'}
        <div style="margin-top: 8px; font-size: 0.85rem;">
          ${reading ? `<span style="cursor: pointer; background: #6c8b6b; color: white; padding: 2px 12px; border-radius: 20px; font-size: 0.7rem; display: inline-block; margin-right: 8px;" onclick="if(typeof speakText==='function'){speakText('${reading}')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('${reading}');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">🔊 Listen</span>` : ''}
          ${sentenceDisplay} → ${q.translation}
        </div>
      </div>
      <div style="text-align: center; margin-top: 12px;">
        <button id="quizNextBtn" style="background: #1a2b4c; color: white; border: none; padding: 8px 24px; border-radius: 40px; cursor: pointer;">Next →</button>
      </div>
    `;
    
    const quizArea = document.getElementById('quizArea');
    if (quizArea) {
      quizArea.innerHTML = feedbackHtml;
    }
    
    document.getElementById('quizNextBtn')?.addEventListener('click', () => {
      currentQuizIndex++;
      renderQuizQuestion();
    });
  } else {
    quizAttemptsRemaining[currentQuizIndex]--;
    
    if (quizAttemptsRemaining[currentQuizIndex] > 0) {
      const feedbackDiv = document.getElementById('quizFeedbackArea');
      if (feedbackDiv) {
        feedbackDiv.innerHTML = `
          <div style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 16px; margin: 12px 0;">
            ❌ Incorrect. "${q.translation}" needs <strong>${q.conjugationDisplay}</strong> form.<br>
            ${quizAttemptsRemaining[currentQuizIndex]} attempt(s) left.
          </div>
        `;
      }
      quizAnswers[currentQuizIndex] = null;
      if (quizMode === 'easy') {
        document.querySelectorAll('.quiz-option-btn').forEach(btn => {
          btn.style.background = '#fff';
          btn.style.color = '#000';
        });
      } else {
        document.querySelectorAll('.hard-opt-btn').forEach(btn => {
          btn.style.background = '#fff';
          btn.style.color = '#000';
        });
      }
    } else {
      // ===== Use the helper that respects furigana toggle =====
      let sentenceDisplay = displaySentenceWithFurigana(q.originalSentence);
      
      const reading = q.reading || '';
      const feedbackHtml = `
        <div style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 16px; margin: 12px 0;">
          ❌ Correct: ${addFuriganaToText(q.correctAnswer)} (${q.conjugationDisplay})
          <div style="margin-top: 8px; font-size: 0.85rem;">
            ${reading ? `<span style="cursor: pointer; background: #6c8b6b; color: white; padding: 2px 12px; border-radius: 20px; font-size: 0.7rem; display: inline-block; margin-right: 8px;" onclick="if(typeof speakText==='function'){speakText('${reading}')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('${reading}');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">🔊 Listen</span>` : ''}
            ${sentenceDisplay} → ${q.translation}
          </div>
        </div>
        <div style="text-align: center; margin-top: 12px;">
          <button id="quizNextBtn" style="background: #1a2b4c; color: white; border: none; padding: 8px 24px; border-radius: 40px; cursor: pointer;">Next →</button>
        </div>
      `;
      
      const quizArea = document.getElementById('quizArea');
      if (quizArea) {
        quizArea.innerHTML = feedbackHtml;
      }
      
      document.getElementById('quizNextBtn')?.addEventListener('click', () => {
        currentQuizIndex++;
        renderQuizQuestion();
      });
    }
  }
}

function showAnswer() {
  const q = currentQuiz[currentQuizIndex];
  
  // ===== Use the helper that respects furigana toggle =====
  let sentenceDisplay = displaySentenceWithFurigana(q.originalSentence);
  
  const reading = q.reading || '';
  const feedbackHtml = `
    <div style="background: #fff3e0; color: #856404; padding: 12px; border-radius: 16px; margin: 12px 0;">
      📖 Answer: ${addFuriganaToText(q.correctAnswer)} (${q.conjugationDisplay})
      <div style="margin-top: 8px; font-size: 0.85rem;">
        ${reading ? `<span style="cursor: pointer; background: #6c8b6b; color: white; padding: 2px 12px; border-radius: 20px; font-size: 0.7rem; display: inline-block; margin-right: 8px;" onclick="if(typeof speakText==='function'){speakText('${reading}')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('${reading}');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">🔊 Listen</span>` : ''}
        ${sentenceDisplay} → ${q.translation}
      </div>
      <p style="margin-top: 8px; font-size: 0.7rem;">No points awarded.</p>
    </div>
    <div style="text-align: center; margin-top: 12px;">
      <button id="quizNextBtn" style="background: #1a2b4c; color: white; border: none; padding: 8px 24px; border-radius: 40px; cursor: pointer;">Next →</button>
    </div>
  `;
  
  const quizArea = document.getElementById('quizArea');
  if (quizArea) {
    quizArea.innerHTML = feedbackHtml;
  }
  
  document.getElementById('quizNextBtn')?.addEventListener('click', () => {
    currentQuizIndex++;
    renderQuizQuestion();
  });
}

function stopQuiz() {
  if (!quizActive) return;
  
  quizActive = false;
  setModeButtonsEnabled(true);
  
  const resultsDiv = document.getElementById('quizResults');
  if (resultsDiv) {
    const percent = Math.round((quizScore / currentQuiz.length) * 100);
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = `
      <div style="font-size: 1.8rem; font-weight: bold; color: #6c8b6b; text-align: center;">${quizScore.toFixed(1)} / ${currentQuiz.length} (${percent}%)</div>
      <p style="text-align: center;">Quiz stopped early.</p>
      <div style="text-align: center; margin-top: 16px;">
        <button id="quizRestartBtn" style="background: #1a2b4c; color: white; border: none; padding: 10px 24px; border-radius: 40px; cursor: pointer;">Take Another Quiz</button>
      </div>
    `;
    
    const restartBtn = document.getElementById('quizRestartBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        const quizArea = document.getElementById('quizArea');
        if (quizArea) {
          quizArea.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Select mode and number of questions, then click "Start New Quiz"</p>';
        }
        resultsDiv.style.display = 'none';
      });
    }
  }
}

function resetQuiz() {
  if (!quizActive || currentQuiz.length === 0) return;
  
  currentQuizIndex = 0;
  quizScore = 0;
  quizAnswers = new Array(currentQuiz.length).fill(null);
  
  for (let i = 0; i < currentQuiz.length; i++) {
    quizAttemptsRemaining[i] = 2;
  }
  
  const feedbackDiv = document.getElementById('quizFeedbackArea');
  if (feedbackDiv) feedbackDiv.innerHTML = '';
  
  updateQuizStatsDisplay();
  renderQuizQuestion();
}

function showQuizResults() {
  quizActive = false;
  setModeButtonsEnabled(true);
  
  const percent = Math.round((quizScore / currentQuiz.length) * 100);
  const resultsDiv = document.getElementById('quizResults');
  if (!resultsDiv) return;
  
  resultsDiv.style.display = 'block';
  resultsDiv.innerHTML = `
    <div style="font-size: 1.8rem; font-weight: bold; color: #6c8b6b; text-align: center;">${quizScore.toFixed(1)} / ${currentQuiz.length} (${percent}%)</div>
    <p style="text-align: center;">${percent >= 80 ? '🎉 Excellent!' : percent >= 60 ? '👍 Good job!' : '📚 Keep studying!'}</p>
    <div style="text-align: center; margin-top: 16px;">
      <button id="quizRestartBtn" style="background: #1a2b4c; color: white; border: none; padding: 10px 24px; border-radius: 40px; cursor: pointer;">Take Another Quiz</button>
    </div>
  `;
  
  const restartBtn = document.getElementById('quizRestartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      const quizArea = document.getElementById('quizArea');
      if (quizArea) {
        quizArea.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Select mode and number of questions, then click "Start New Quiz"</p>';
      }
      resultsDiv.style.display = 'none';
    });
  }
}

function resetAllProgress() {
  if (confirm('⚠️ Are you sure? This will reset ALL mastered and attempted adjectives. This cannot be undone.')) {
    masteredAdjectives.clear();
    attemptedAdjectives.clear();
    saveMasteredAdjectives();
    renderAdjectivesList();
    renderMasteredList();
    updateMasteredCount();
    
    if (quizActive) {
      stopQuiz();
    }
  }
}

function resetMasteredOnly() {
  if (confirm('⚠️ Reset mastered adjectives only? Attempted adjectives will be preserved.')) {
    masteredAdjectives.clear();
    saveMasteredAdjectives();
    renderAdjectivesList();
    renderMasteredList();
    updateMasteredCount();
  }
}

function switchTab(tabId) {
  currentAdjTab = tabId;
  
  const tabButtons = [tabConjugationBtn, tabLearnBtn, tabQuizBtn, tabMasteredBtn];
  tabButtons.forEach(btn => {
    if (btn) btn.classList.remove('active');
  });
  
  const activeBtn = document.getElementById(`tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}Btn`);
  if (activeBtn) activeBtn.classList.add('active');
  
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  const activeContent = document.getElementById(`tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
  if (activeContent) activeContent.classList.add('active');
  
  if (tabId === 'conjugation') {
    renderAdjectivesList();
  } else if (tabId === 'learn') {
    renderLearnTab();
  } else if (tabId === 'mastered') {
    renderMasteredList();
  } else if (tabId === 'quiz') {
    updateMasteredCount();
  }
}

function attachStartQuizListener() {
  const startQuizBtn = document.getElementById('startQuizBtn');
  if (startQuizBtn) {
    const newBtn = startQuizBtn.cloneNode(true);
    startQuizBtn.parentNode.replaceChild(newBtn, startQuizBtn);
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Start Quiz button clicked! Mode:', quizMode);
      generateQuiz();
    });
    console.log('Start Quiz button listener attached');
  } else {
    console.log('Start Quiz button not found, retrying...');
    setTimeout(attachStartQuizListener, 100);
  }
}

// Event Listeners
if (furiToggleBtn) {
  furiToggleBtn.addEventListener('click', () => {
    applyFuriganaHide();
  });
}

if (quizEasyModeBtn) {
  quizEasyModeBtn.addEventListener('click', () => {
    quizMode = 'easy';
    quizEasyModeBtn.classList.add('active');
    quizHardModeBtn.classList.remove('active');
    console.log('Switched to Easy Mode');
    if (quizActive && currentQuiz.length > 0) {
      renderQuizQuestion();
    }
  });
}

if (quizHardModeBtn) {
  quizHardModeBtn.addEventListener('click', () => {
    quizMode = 'hard';
    quizHardModeBtn.classList.add('active');
    quizEasyModeBtn.classList.remove('active');
    console.log('Switched to Hard Mode');
    if (quizActive && currentQuiz.length > 0) {
      renderQuizQuestion();
    }
  });
}

if (typeSelect) {
  typeSelect.addEventListener('change', () => {
    currentFilterType = typeSelect.value;
    renderAdjectivesList();
  });
}

if (adjSearchInput) {
  adjSearchInput.addEventListener('input', () => {
    currentSearchTerm = adjSearchInput.value;
    renderAdjectivesList();
  });
}

const resetAllProgressBtn = document.getElementById('resetAllProgressBtn');
if (resetAllProgressBtn) {
  resetAllProgressBtn.addEventListener('click', resetAllProgress);
}

const resetMasteredOnlyBtn = document.getElementById('resetMasteredOnlyBtn');
if (resetMasteredOnlyBtn) {
  resetMasteredOnlyBtn.addEventListener('click', resetMasteredOnly);
}

// Stats help
const statHelpIcon = document.getElementById('statHelpIcon');
if (statHelpIcon) {
  statHelpIcon.addEventListener('click', () => {
    const explanation = document.getElementById('quizStatsExplanation');
    if (explanation) {
      explanation.style.display = explanation.style.display === 'none' ? 'block' : 'none';
    }
  });
}

const closeStatsHelp = document.getElementById('closeStatsHelp');
if (closeStatsHelp) {
  closeStatsHelp.addEventListener('click', () => {
    const explanation = document.getElementById('quizStatsExplanation');
    if (explanation) explanation.style.display = 'none';
  });
}

if (tabConjugationBtn) tabConjugationBtn.addEventListener('click', () => switchTab('conjugation'));
if (tabLearnBtn) tabLearnBtn.addEventListener('click', () => switchTab('learn'));
if (tabQuizBtn) tabQuizBtn.addEventListener('click', () => switchTab('quiz'));
if (tabMasteredBtn) tabMasteredBtn.addEventListener('click', () => switchTab('mastered'));

function initAdjectives() {
  loadMasteredAdjectives();
  renderAdjectivesList();
  renderLearnTab();
  switchTab('conjugation');
  
  const totalAdjs = adjectiveOrder.length;
  const totalEls = document.querySelectorAll('#quizTotalAdjs, #quizTotalAdjs2');
  totalEls.forEach(el => {
    if (el) el.innerText = totalAdjs;
  });
  
  attachStartQuizListener();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdjectives);
} else {
  initAdjectives();
}