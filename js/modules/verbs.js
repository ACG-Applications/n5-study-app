// ==================== VERBS MODULE ====================

let currentVerbTab = "conjugation";
let furiganaHidden = false;
let masteredVerbs = new Set();
let attemptedVerbs = new Set();
let currentQuiz = [];
let currentQuizIndex = 0;
let quizAnswers = [];
let quizActive = false;
let quizMode = "easy";
let quizScore = 0;
let quizAttemptsRemaining = {};
let currentFilterGroup = "all";
let currentSearchTerm = "";

// DOM Elements
const furiToggleBtn = document.getElementById("furiToggleBtn");
const tabConjugationBtn = document.getElementById("tabConjugationBtn");
const tabLearnBtn = document.getElementById("tabLearnBtn");
const tabQuizBtn = document.getElementById("tabQuizBtn");
const tabMasteredBtn = document.getElementById("tabMasteredBtn");
const quizEasyModeBtn = document.getElementById("quizEasyModeBtn");
const quizHardModeBtn = document.getElementById("quizHardModeBtn");
const groupSelect = document.getElementById("groupSelect");
const verbSearchInput = document.getElementById("verbSearchInput");

// ========== TTS FUNCTION ==========
function speakText(text, lang = "ja-JP") {
  if (!text || text === "-" || text.trim() === "") return;
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

// Add furigana to text based on toggle state
function addFuriganaToText(text) {
  if (!text) return "";
  if (furiganaHidden) {
    return text.replace(/[（(][^）)]*[）)]/g, "");
  }
  return text.replace(
    /([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g,
    (_, kanji, furigana) => {
      return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
    },
  );
}

// Strip furigana for dropdown values
function stripFuriganaForDropdown(text) {
  if (!text) return "";
  return text.replace(/[（(][^）)]*[）)]/g, "");
}

// ===== HELPER: Display sentence with proper furigana handling =====
function displaySentenceWithFurigana(sentence) {
  if (!sentence) return "";
  // First, try to use the word meanings/tooltip approach
  if (
    typeof getWordMeaningsForSentence === "function" &&
    typeof createQuizWordTooltips === "function"
  ) {
    const wordMeanings = getWordMeaningsForSentence({ jp: sentence });
    if (wordMeanings && wordMeanings.length > 0) {
      // If furigana is hidden, strip furigana from the sentence before creating tooltips
      if (furiganaHidden) {
        const cleanSentence = sentence.replace(/[（(][^）)]*[）)]/g, "").trim();
        const cleanWordMeanings = getWordMeaningsForSentence({
          jp: cleanSentence,
        });
        return createQuizWordTooltips(cleanSentence, cleanWordMeanings);
      }
      return createQuizWordTooltips(sentence, wordMeanings);
    }
  }
  // Fallback to basic furigana
  return addFuriganaToText(sentence);
}

// Format dictionary for display with proper furigana per kanji
function formatDictionaryForDisplay(verb) {
  const dict = verb.dictionary;
  const reading = verb.reading;

  // Special cases with known patterns
  const specialCases = {
    食べる: "食（た）べる",
    見る: "見（み）る",
    寝る: "寝（ね）る",
    起きる: "起（お）きる",
    教える: "教（おし）える",
    開ける: "開（あ）ける",
    会う: "会（あ）う",
    遊ぶ: "遊（あそ）ぶ",
    行く: "行（い）く",
    話す: "話（はな）す",
    読む: "読（よ）む",
    飲む: "飲（の）む",
    買う: "買（か）う",
    帰る: "帰（かえ）る",
    書く: "書（か）く",
    待つ: "待（ま）つ",
    来る: "来（く）る",
    勉強する: "勉強（べんきょう）する",
    散歩する: "散歩（さんぽ）する",
    旅行する: "旅行（りょこう）する",
  };

  if (specialCases[dict]) {
    return addFuriganaToText(specialCases[dict]);
  }

  const displayText = `${dict}（${reading}）`;
  return addFuriganaToText(displayText);
}

// ===== RENDER LEARN TAB =====
function renderLearnTab() {
  const container = document.getElementById("learnContent");
  if (!container) return;

  const content = `
        <div class="learn-container" style="background: #ffffff; border-radius: 20px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e8e0d5;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 4px;">
                <h2 style="color: #000000; font-weight: 700; font-size: 1.5rem; margin: 0;">📖 Understanding Verbs in Japanese</h2>
                <button onclick="printLesson()" style="background: #6c8b6b; color: white; border: none; padding: 8px 20px; border-radius: 40px; cursor: pointer; font-size: 0.9rem; font-weight: 500; font-family: inherit; transition: background 0.2s, transform 0.1s;" onmouseover="this.style.background='#5a7a59'" onmouseout="this.style.background='#6c8b6b'">🖨️ Print Lesson</button>
            </div>
            <p style="color: #444444; font-weight: 400; margin-bottom: 24px;">N5 Level - Complete Guide</p>
            
            <!-- SECTION 1: Verb Basics -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">1. 動詞（どうし）の 基本（きほん）/ Verb Basics</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    日本語（にほんご）の 動詞（どうし）は <strong>必（かなら）ず</strong> 文（ぶん）の <strong>最後（さいご）</strong> に 来（き）ます。
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>Japanese verbs <strong>always</strong> come at the <strong>end</strong> of the sentence.</em>
                </p>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    動詞（どうし）は <strong>3種類（しゅるい）</strong> に 分（わ）かれます：
                </p>
                <ul style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 12px; padding-left: 20px;">
                    <li><strong>グループ1: 五段（ごだん）動詞（どうし）</strong> / Godan (U-verbs)</li>
                    <li><strong>グループ2: 一段（いちだん）動詞（どうし）</strong> / Ichidan (Ru-verbs)</li>
                    <li><strong>グループ3: 不規則（ふきそく）動詞（どうし）</strong> / Irregular Verbs</li>
                </ul>
                
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">特徴（とくちょう）<br><span style="font-weight: 400; font-size: 0.8rem;">Feature</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">グループ1 (<ruby>五段<rt>ごだん</rt></ruby>)<br><span style="font-weight: 400; font-size: 0.8rem;">Group 1 (Godan)</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">グループ2 (<ruby>一段<rt>いちだん</rt></ruby>)<br><span style="font-weight: 400; font-size: 0.8rem;">Group 2 (Ichidan)</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">グループ3 (<ruby>不規則<rt>ふきそく</rt></ruby>)<br><span style="font-weight: 400; font-size: 0.8rem;">Group 3 (Irregular)</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">終（お）わり方（かた）<br><span style="font-size: 0.8rem;">Ending</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">う, く, す, つ, ぬ, ぶ, む, る</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">る (with い/え before)</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">する, くる</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">例（れい）<br><span style="font-size: 0.8rem;">Example</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">書（か）く</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">食（た）べる</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">する / 来（く）る</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">ます形（けい）<br><span style="font-size: 0.8rem;">masu form</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">書（か）きます</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">食（た）べます</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">します / 来（き）ます</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">て形（けい）<br><span style="font-size: 0.8rem;">te form</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">書（か）いて</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">食（た）べて</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">して / 来（き）て</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- SECTION 2: Sentence Patterns -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">2. 文（ぶん）の パターン / Sentence Patterns</h3>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">パターン1: 主語（しゅご）+ 目的語（もくてきご）+ 動詞（どうし）(SOV)</h4>
                <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
                    <div style="font-size: 1rem; color: #000000; font-weight: 400;">
                        <strong>ルール / Rule:</strong> [Subject] は [Object] を [Verb]
                    </div>
                </div>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('わたし は りんご を たべます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('わたし は りんご を たべます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">私（わたし）は りんご <strong>を</strong> 食（た）べます。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I eat an apple.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">パターン2: 場所（ばしょ）+ 移動（いどう）動詞（どうし）</h4>
                <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
                    <div style="font-size: 1rem; color: #000000; font-weight: 400;">
                        <strong>ルール / Rule:</strong> [Location] へ/に [Motion Verb]
                    </div>
                </div>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('わたし は がっこう へ いきます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('わたし は がっこう へ いきます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">私（わたし）は 学校（がっこう）<strong>へ</strong> 行（い）きます。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I will go to school.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">パターン3: 道具（どうぐ）/ 手段（しゅだん） + 動詞（どうし）</h4>
                <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
                    <div style="font-size: 1rem; color: #000000; font-weight: 400;">
                        <strong>ルール / Rule:</strong> [Tool/Language] で [Verb]
                    </div>
                </div>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('にほんご で はなします')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('にほんご で はなします');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">日本語（にほんご）<strong>で</strong> 話（はな）します。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I speak in Japanese.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">パターン4: 時間（じかん） + 動詞（どうし）</h4>
                <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
                    <div style="font-size: 1rem; color: #000000; font-weight: 400;">
                        <strong>ルール / Rule:</strong> [Time] に [Verb] (に is optional for relative time)
                    </div>
                </div>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('あさ しちじ に おきます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('あさ しちじ に おきます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">朝（あさ）7時（じ）<strong>に</strong> 起（お）きます。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I wake up at 7 AM.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
            </div>
            
            <!-- SECTION 3: Polite Forms (ます) -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">3. 丁寧形（ていねいけい） / Polite Forms (ます)</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    動詞（どうし）を 丁寧（ていねい）に する ときは <strong>ます (masu)</strong> を 使（つか）います。
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>To make verbs polite, use the <strong>ます (masu)</strong> form.</em>
                </p>
                
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">形（けい）<br><span style="font-weight: 400; font-size: 0.8rem;">Form</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">パターン<br><span style="font-weight: 400; font-size: 0.8rem;">Pattern</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">例（れい）<br><span style="font-weight: 400; font-size: 0.8rem;">Example</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">現在（げんざい） / 未来（みらい）<br><span style="font-size: 0.8rem;">Present / Future</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">〜ます</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">食（た）べます</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">過去（かこ）<br><span style="font-size: 0.8rem;">Past</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">〜ました</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">食（た）べました</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">否定（ひてい）<br><span style="font-size: 0.8rem;">Negative</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">〜ません</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">食（た）べません</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">過去否定（かこひてい）<br><span style="font-size: 0.8rem;">Past Negative</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">〜ませんでした</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">食（た）べませんでした</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- SECTION 4: Te-form -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">4. て形（けい） / Te-form</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    て形（けい）は <strong>非常（ひじょう）に 重要（じゅうよう）</strong> な 形（けい）です。いろいろな 場面（ばめん）で 使（つか）います。
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>The te-form is <strong>very important</strong>. It's used in many different situations.</em>
                </p>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">て形（けい）の 作（つく）り方 / How to make the te-form</h4>
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">グループ<br><span style="font-weight: 400; font-size: 0.8rem;">Group</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">ルール<br><span style="font-weight: 400; font-size: 0.8rem;">Rule</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">例（れい）<br><span style="font-weight: 400; font-size: 0.8rem;">Example</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">グループ1 (<ruby>五段<rt>ごだん</rt></ruby>)</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">
                                    う, つ, る → って<br>
                                    く → いて<br>
                                    ぐ → いで<br>
                                    す → して<br>
                                    ぶ, む, ぬ → んで
                                </td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">
                                    買う → 買って<br>
                                    書く → 書いて<br>
                                    泳ぐ → 泳いで<br>
                                    話す → 話して<br>
                                    読む → 読んで
                                </td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">グループ2 (<ruby>一段<rt>いちだん</rt></ruby>)</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">る → て</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">食（た）べる → 食（た）べて</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">グループ3 (<ruby>不規則<rt>ふきそく</rt></ruby>)</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">する → して<br>くる → きて</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">する → して<br>来（く）る → 来（き）て</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style="background: #f8d7da; border-radius: 12px; padding: 12px 16px; margin-bottom: 12px; border-left: 4px solid #dc3545;">
                    <div style="font-size: 0.95rem; color: #721c24; font-weight: 400;">
                        ⚠️ <strong>例外（れいがい）！</strong> 行（い）く → 行（い）<strong>って</strong> (NOT 行いて)
                    </div>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">て形（けい）の 使（つか）い方 / Uses of the te-form</h4>
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">使（つか）い方（かた）<br><span style="font-weight: 400; font-size: 0.8rem;">Use</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">パターン<br><span style="font-weight: 400; font-size: 0.8rem;">Pattern</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">例（れい）<br><span style="font-weight: 400; font-size: 0.8rem;">Example</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">丁寧（ていねい）な 命令（めいれい）<br><span style="font-size: 0.8rem;">Polite request</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">て形（けい） + ください</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('まって ください')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('まって ください');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">待（ま）って ください。🔊</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">動作（どうさ）の 接続（せつぞく）<br><span style="font-size: 0.8rem;">Connecting actions</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">て形（けい） + て形（けい）</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('たべて のんで')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('たべて のんで');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">食（た）べて、飲（の）んで。🔊</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">進行形（しんこうけい）<br><span style="font-size: 0.8rem;">Progressive / Continuous</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">て形（けい） + います</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('よんで います')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('よんで います');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">読（よ）んで います。🔊</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- SECTION 5: Group 1 (Godan) Verbs -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">5. グループ1: 五段（ごだん）動詞（どうし） / Godan (Group 1) Verbs</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    五段（ごだん）動詞（どうし）は <strong>あ、い、う、え、お</strong> の 五（いつ）つ の 段（だん）に 移動（いどう）します。
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>Godan means "five-level" - the ending shifts across all five vowel rows (a, i, u, e, o).</em>
                </p>
                
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">行（ぎょう）<br><span style="font-weight: 400; font-size: 0.8rem;">Row</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">終（お）わり<br><span style="font-weight: 400; font-size: 0.8rem;">Ending</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">形（けい）<br><span style="font-weight: 400; font-size: 0.8rem;">Form</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">例（れい）<br><span style="font-weight: 400; font-size: 0.8rem;">Example</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">あ</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">か</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">否定（ひてい）<br><span style="font-size: 0.8rem;">Negative</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">書（か）かない</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">い</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">き</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">丁寧（ていねい）<br><span style="font-size: 0.8rem;">Polite</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">書（か）きます</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">う</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">く</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">辞書（じしょ）形（けい）<br><span style="font-size: 0.8rem;">Dictionary</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">書（か）く</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">え</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">け</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">可能（かのう）<br><span style="font-size: 0.8rem;">Potential</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">書（か）ける</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">お</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">こ</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">意志（いし）<br><span style="font-size: 0.8rem;">Volitional</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">書（か）こう</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- SECTION 6: Group 2 (Ichidan) Verbs -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">6. グループ2: 一段（いちだん）動詞（どうし） / Ichidan (Group 2) Verbs</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    一段（いちだん）動詞（どうし）は <strong>る (ru)</strong> を <strong>取（と）る</strong> だけ です。
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>Ichidan means "one-level" - simply <strong>drop る (ru)</strong> and attach the ending.</em>
                </p>
                
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">形（けい）<br><span style="font-weight: 400; font-size: 0.8rem;">Form</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">作（つく）り方（かた）<br><span style="font-weight: 400; font-size: 0.8rem;">How to make</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">例（れい）<br><span style="font-weight: 400; font-size: 0.8rem;">Example</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">辞書（じしょ）形（けい）<br><span style="font-size: 0.8rem;">Dictionary</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">—</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">食（た）べる</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">丁寧（ていねい）<br><span style="font-size: 0.8rem;">Polite</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">る → ます</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">食（た）べます</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">否定（ひてい）<br><span style="font-size: 0.8rem;">Negative</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">る → ない</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">食（た）べない</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">て形（けい）<br><span style="font-size: 0.8rem;">Te-form</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">る → て</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">食（た）べて</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">過去（かこ）<br><span style="font-size: 0.8rem;">Past</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">る → た</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">食（た）べた</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('たべる')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('たべる');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">食（た）べる → 食（た）べます / 食（た）べて / 食（た）べた</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">to eat → eat (polite) / eating (te) / ate</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
            </div>
            
            <!-- SECTION 7: Group 3 (Irregular) Verbs -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">7. グループ3: 不規則（ふきそく）動詞（どうし） / Irregular Verbs</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    不規則（ふきそく）動詞（どうし）は <strong>2つ</strong> だけ です。暗記（あんき）しましょう！
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>There are only <strong>two</strong> irregular verbs. Memorize them!</em>
                </p>
                
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">形（けい）<br><span style="font-weight: 400; font-size: 0.8rem;">Form</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">する (to do)</th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">来（く）る (to come)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">辞書（じしょ）形（けい）<br><span style="font-size: 0.8rem;">Dictionary</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">する</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">来（く）る</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">丁寧（ていねい）<br><span style="font-size: 0.8rem;">Polite</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">します</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">来（き）ます</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">否定（ひてい）<br><span style="font-size: 0.8rem;">Negative</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">しない</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">来（こ）ない</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">て形（けい）<br><span style="font-size: 0.8rem;">Te-form</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">して</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">来（き）て</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">過去（かこ）<br><span style="font-size: 0.8rem;">Past</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">した</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">来（き）た</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- SECTION 8: Common N5 Verbs -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">8. N5 で よく 使（つか）う 動詞（どうし） / Common N5 Verbs</h3>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">グループ1 (五段) / Group 1 (Godan)</h4>
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">動詞（どうし）<br><span style="font-weight: 400; font-size: 0.8rem;">Verb</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">読（よ）み方（かた）<br><span style="font-weight: 400; font-size: 0.8rem;">Reading</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">意味（いみ）<br><span style="font-weight: 400; font-size: 0.8rem;">Meaning</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">会（あ）う</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">あう</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to meet</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">遊（あそ）ぶ</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">あそぶ</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to play</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">行（い）く</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">いく</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to go</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">話（はな）す</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">はなす</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to speak</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">読（よ）む</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">よむ</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to read</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">飲（の）む</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">のむ</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to drink</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">買（か）う</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">かう</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to buy</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">書（か）く</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">かく</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to write</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">待（ま）つ</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">まつ</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to wait</td></tr>
                            <tr><td style="padding: 8px 16px; color: #000000; font-weight: 400;">帰（かえ）る</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">かえる</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to return home</td></tr>
                        </tbody>
                    </table>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">グループ2 (一段) / Group 2 (Ichidan)</h4>
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">動詞（どうし）<br><span style="font-weight: 400; font-size: 0.8rem;">Verb</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">読（よ）み方（かた）<br><span style="font-weight: 400; font-size: 0.8rem;">Reading</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">意味（いみ）<br><span style="font-weight: 400; font-size: 0.8rem;">Meaning</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">食（た）べる</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">たべる</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to eat</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">見（み）る</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">みる</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to see / watch</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">寝（ね）る</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">ねる</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to sleep</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">起（お）きる</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">おきる</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to wake up</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">教（おし）える</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">おしえる</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to teach</td></tr>
                            <tr><td style="padding: 8px 16px; color: #000000; font-weight: 400;">開（あ）ける</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">あける</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to open</td></tr>
                        </tbody>
                    </table>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">グループ3 (不規則) / Group 3 (Irregular) + する Verbs</h4>
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">動詞（どうし）<br><span style="font-weight: 400; font-size: 0.8rem;">Verb</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">読（よ）み方（かた）<br><span style="font-weight: 400; font-size: 0.8rem;">Reading</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">意味（いみ）<br><span style="font-weight: 400; font-size: 0.8rem;">Meaning</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">する</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">する</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to do</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">来（く）る</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">くる</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to come</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">勉強（べんきょう）する</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">べんきょうする</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to study</td></tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;"><td style="padding: 8px 16px; color: #000000; font-weight: 400;">散歩（さんぽ）する</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">さんぽする</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to take a walk</td></tr>
                            <tr><td style="padding: 8px 16px; color: #000000; font-weight: 400;">旅行（りょこう）する</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">りょこうする</td><td style="padding: 8px 16px; color: #000000; font-weight: 400;">to travel</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- SECTION 9: Common Mistakes -->
            <div class="learn-section" style="margin-bottom: 20px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">9. よくある 間違（まちが）い / Common Mistakes</h3>
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
                                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">行（い）いて</td>
                                <td style="padding: 8px 16px; color: #28a745; font-weight: 400;">行（い）<strong>って</strong></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">行く は 例外（れいがい）</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">来（き）ない</td>
                                <td style="padding: 8px 16px; color: #28a745; font-weight: 400;">来（<strong>こ</strong>）ない</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">くる の 否定形（ひていけい）は こない</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">私（わたし）は 行（い）きます 学校（がっこう）へ</td>
                                <td style="padding: 8px 16px; color: #28a745; font-weight: 400;">私（わたし）は 学校（がっこう）へ 行（い）きます</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">動詞（どうし）は 文（ぶん）の 最後（さいご）</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">する を 五段（ごだん）と 間違（まちが）う</td>
                                <td style="padding: 8px 16px; color: #28a745; font-weight: 400;">する は 不規則（ふきそく）</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">する は グループ3 です</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- SUMMARY BOX -->
            <div style="background: #e8f0e7; border-radius: 16px; padding: 20px; margin-top: 24px; border-left: 4px solid #6c8b6b;">
                <h4 style="color: #000000; font-weight: 700; font-size: 1.1rem; margin-bottom: 12px;">📌 まとめ / Summary</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px;">
                    <div style="color: #000000; font-weight: 500;">✅ グループ1 (<ruby>五段<rt>ごだん</rt></ruby>)<br><span style="font-weight: 400; font-size: 0.85rem;">Group 1 (Godan)</span></div>
                    <div style="color: #000000; font-weight: 400;">
                        終（お）わり: う, く, す, つ, ぬ, ぶ, む, る<br>
                        例（れい）: 書（か）く<br>
                        ます: 書（か）きます<br>
                        て形（けい）: 書（か）いて
                    </div>
                    <div style="color: #000000; font-weight: 500;">✅ グループ2 (<ruby>一段<rt>いちだん</rt></ruby>)<br><span style="font-weight: 400; font-size: 0.85rem;">Group 2 (Ichidan)</span></div>
                    <div style="color: #000000; font-weight: 400;">
                        終（お）わり: る (with い/え before)<br>
                        例（れい）: 食（た）べる<br>
                        ます: 食（た）べます<br>
                        て形（けい）: 食（た）べて
                    </div>
                    <div style="color: #000000; font-weight: 500;">✅ グループ3 (<ruby>不規則<rt>ふきそく</rt></ruby>)<br><span style="font-weight: 400; font-size: 0.85rem;">Group 3 (Irregular)</span></div>
                    <div style="color: #000000; font-weight: 400;">
                        する → します / して / した<br>
                        来（く）る → 来（き）ます / 来（き）て / 来（き）た
                    </div>
                    <div style="color: #000000; font-weight: 500;">✅ 文（ぶん）の パターン<br><span style="font-weight: 400; font-size: 0.85rem;">Sentence Patterns</span></div>
                    <div style="color: #000000; font-weight: 400;">
                        SOV: 私（わたし）は りんごを 食（た）べます<br>
                        場所（ばしょ）: 学校（がっこう）へ 行（い）きます<br>
                        道具（どうぐ）: 日本語（にほんご）で 話（はな）します
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

function loadMasteredVerbs() {
  const stored = localStorage.getItem("masteredVerbs");
  if (stored) {
    masteredVerbs = new Set(JSON.parse(stored));
  }
  const storedAttempted = localStorage.getItem("attemptedVerbs");
  if (storedAttempted) {
    attemptedVerbs = new Set(JSON.parse(storedAttempted));
  }
  updateMasteredCount();
}

function saveMasteredVerbs() {
  localStorage.setItem("masteredVerbs", JSON.stringify([...masteredVerbs]));
  localStorage.setItem("attemptedVerbs", JSON.stringify([...attemptedVerbs]));
  updateMasteredCount();
}

function updateMasteredCount() {
  const total = verbOrder.length;
  const mastered = masteredVerbs.size;
  const attempted = attemptedVerbs.size;
  const countEl = document.getElementById("masteredCount");
  const totalEl = document.getElementById("totalCount");
  if (countEl) countEl.innerText = mastered;
  if (totalEl) totalEl.innerText = total;

  const quizMasteredEl = document.getElementById("quizMasteredCount");
  const quizAttemptedEl = document.getElementById("quizAttemptedCount");
  const quizTotalEl = document.getElementById("quizTotalVerbs");
  const quizTotalEl2 = document.getElementById("quizTotalVerbs2");
  if (quizMasteredEl) quizMasteredEl.innerText = mastered;
  if (quizAttemptedEl) quizAttemptedEl.innerText = attempted;
  if (quizTotalEl) quizTotalEl.innerText = total;
  if (quizTotalEl2) quizTotalEl2.innerText = total;
}

function markVerbMastered(verbId, isFirstAttempt = true) {
  if (isFirstAttempt && !masteredVerbs.has(verbId)) {
    masteredVerbs.add(verbId);
  }
  if (!attemptedVerbs.has(verbId)) {
    attemptedVerbs.add(verbId);
  }
  saveMasteredVerbs();
  renderVerbsList();
  renderMasteredList();
}

function unmarkVerbMastered(verbId) {
  masteredVerbs.delete(verbId);
  saveMasteredVerbs();
  renderVerbsList();
  renderMasteredList();
}

function applyFuriganaHide() {
  furiganaHidden = !furiganaHidden;
  if (furiToggleBtn) {
    furiToggleBtn.innerText = furiganaHidden
      ? "🔤 Furigana On"
      : "🔤 Furigana Off";
  }
  renderVerbsList();
  renderLearnTab();
  renderMasteredList();
  if (quizActive && currentQuiz.length > 0) {
    renderQuizQuestion();
  }
}

function renderVerbsList() {
  const container = document.getElementById("verbsList");
  if (!container) return;

  let filteredVerbs = [...verbsData];

  if (currentFilterGroup !== "all") {
    filteredVerbs = filteredVerbs.filter(
      (v) => v.group === parseInt(currentFilterGroup),
    );
  }

  if (currentSearchTerm) {
    const searchLower = currentSearchTerm.toLowerCase();
    filteredVerbs = filteredVerbs.filter(
      (v) =>
        v.dictionary.toLowerCase().includes(searchLower) ||
        v.reading.toLowerCase().includes(searchLower) ||
        v.meaning.toLowerCase().includes(searchLower),
    );
  }

  let html = "";

  for (const verb of filteredVerbs) {
    const isMastered = masteredVerbs.has(verb.id);
    const groupClass = `group-${verb.group}`;
    const groupName =
      verb.group === 1
        ? "Group 1 (Godan)"
        : verb.group === 2
          ? "Group 2 (Ichidan)"
          : "Group 3 (Irregular)";

    let examplesHtml = "";
    const exampleTypes = [
      "masu",
      "nai",
      "te",
      "ta",
      "potential",
      "volitional",
      "conditional",
    ];
    const displayNames = {
      masu: "Present (Polite)",
      nai: "Negative",
      te: "Te-form",
      ta: "Past",
      potential: "Potential",
      volitional: "Volitional",
      conditional: "Conditional",
    };

    for (const type of exampleTypes) {
      const ex = verb.examples[type];
      if (ex) {
        // ===== Use the helper that respects furigana toggle =====
        let displayJp = displaySentenceWithFurigana(ex.sentence);

        const reading = ex.sentence.replace(/[（(][^）)]*[）)]/g, "").trim();

        examplesHtml += `
                    <div class="example-item" data-reading="${reading}">
                        <div class="example-jp" style="font-size: 1rem;">${displayJp}</div>
                        <div class="example-trans" style="font-size: 0.85rem;">→ ${ex.translation}</div>
                        <div style="font-size: 0.7rem; color: #888; margin-top: 4px; display: flex; justify-content: space-between; align-items: center;">
                            <span>${displayNames[type]}</span>
                            <button class="small-btn example-tts-btn" style="font-size: 0.6rem; padding: 2px 10px; background: #6c8b6b; color: white; border: none; border-radius: 20px; cursor: pointer;" data-reading="${reading}">🔊</button>
                        </div>
                    </div>
                `;
      }
    }

    const dictDisplay = formatDictionaryForDisplay(verb);

    html += `
            <div class="verb-card ${isMastered ? "mastered" : ""}" data-verb-id="${verb.id}" style="margin-bottom: 16px; padding: 16px; border: 1px solid #e8e0d5; border-radius: 16px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div class="verb-header" style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                    <div>
                        <span class="verb-title" style="font-size: 1.3rem; font-weight: bold;">${dictDisplay}</span>
                        ${isMastered ? '<span class="mastered-badge" style="font-size: 0.7rem; background: #4caf50; color: white; padding: 2px 10px; border-radius: 20px; margin-left: 8px;">✓ Mastered</span>' : ""}
                    </div>
                    <div>
                        <span class="verb-meaning" style="font-size: 0.9rem; color: #555;">${verb.meaning}</span>
                        <span class="group-badge ${groupClass}" style="font-size: 0.7rem; background: #e8f0fe; padding: 2px 10px; border-radius: 20px; margin-left: 8px;">${groupName}</span>
                    </div>
                </div>
                
                <div class="conjugation-table" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 8px; margin-bottom: 12px;">
                    <div class="conj-item" style="padding: 8px; background: #f9fcff; border-radius: 8px;">
                        <div class="conj-label" style="font-size: 0.65rem; color: #666;">Present</div>
                        <div class="conj-value" style="font-size: 0.95rem;">${addFuriganaToText(verb.conjugations.masu)}</div>
                    </div>
                    <div class="conj-item" style="padding: 8px; background: #f9fcff; border-radius: 8px;">
                        <div class="conj-label" style="font-size: 0.65rem; color: #666;">Negative</div>
                        <div class="conj-value" style="font-size: 0.95rem;">${addFuriganaToText(verb.conjugations.nai)}</div>
                    </div>
                    <div class="conj-item" style="padding: 8px; background: #f9fcff; border-radius: 8px;">
                        <div class="conj-label" style="font-size: 0.65rem; color: #666;">Te-form</div>
                        <div class="conj-value" style="font-size: 0.95rem;">${addFuriganaToText(verb.conjugations.te)}</div>
                    </div>
                    <div class="conj-item" style="padding: 8px; background: #f9fcff; border-radius: 8px;">
                        <div class="conj-label" style="font-size: 0.65rem; color: #666;">Past</div>
                        <div class="conj-value" style="font-size: 0.95rem;">${addFuriganaToText(verb.conjugations.ta)}</div>
                    </div>
                    <div class="conj-item" style="padding: 8px; background: #f9fcff; border-radius: 8px;">
                        <div class="conj-label" style="font-size: 0.65rem; color: #666;">Potential</div>
                        <div class="conj-value" style="font-size: 0.95rem;">${addFuriganaToText(verb.conjugations.potential)}</div>
                    </div>
                    <div class="conj-item" style="padding: 8px; background: #f9fcff; border-radius: 8px;">
                        <div class="conj-label" style="font-size: 0.65rem; color: #666;">Volitional</div>
                        <div class="conj-value" style="font-size: 0.95rem;">${addFuriganaToText(verb.conjugations.volitional)}</div>
                    </div>
                    <div class="conj-item" style="padding: 8px; background: #f9fcff; border-radius: 8px;">
                        <div class="conj-label" style="font-size: 0.65rem; color: #666;">Conditional</div>
                        <div class="conj-value" style="font-size: 0.95rem;">${addFuriganaToText(verb.conjugations.conditional)}</div>
                    </div>
                </div>
                
                <div class="verb-examples" style="margin: 12px 0; padding: 10px; background: #faf8f5; border-radius: 12px;">
                    <h4 style="font-size: 0.9rem; margin-bottom: 8px;">📝 Example Sentences <span style="font-weight:normal;font-size:0.7rem;color:#999;">(click to listen)</span></h4>
                    ${examplesHtml}
                </div>
                
                <button class="small-btn mark-mastered-btn" data-verb-id="${verb.id}" style="font-size: 0.85rem; padding: 6px 16px; background: #e8e0d5; border: none; border-radius: 30px; cursor: pointer;">
                    ${isMastered ? "✓ Mastered" : "✓ Mark as Mastered"}
                </button>
            </div>
        `;
  }

  if (filteredVerbs.length === 0) {
    html =
      '<p style="text-align: center; padding: 40px;">No verbs match your filters.</p>';
  }

  container.innerHTML = html;

  // ===== TTS SUPPORT =====
  document.querySelectorAll(".example-item").forEach((el) => {
    const reading = el.dataset.reading;
    if (reading) {
      // Click on the example item itself plays audio
      el.addEventListener("click", (e) => {
        if (
          e.target.closest(".example-tts-btn") ||
          e.target.closest(".tooltip-text") ||
          e.target.closest(".word-tooltip")
        )
          return;
        console.log("TTS: Playing example sentence:", reading);
        if (typeof speakText === "function") {
          speakText(reading);
        } else if (typeof window.speakText === "function") {
          window.speakText(reading);
        }
      });
      // TTS button inside the example
      const ttsBtn = el.querySelector(".example-tts-btn");
      if (ttsBtn) {
        ttsBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const btnReading = ttsBtn.dataset.reading || reading;
          console.log("TTS: Playing from button:", btnReading);
          if (typeof speakText === "function") {
            speakText(btnReading);
          } else if (typeof window.speakText === "function") {
            window.speakText(btnReading);
          }
        });
      }
    }
  });

  document.querySelectorAll(".mark-mastered-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const verbId = btn.dataset.verbId;
      if (masteredVerbs.has(verbId)) {
        unmarkVerbMastered(verbId);
      } else {
        markVerbMastered(verbId, true);
      }
    });
  });

  // ===== ATTACH TOOLTIPS =====
  if (typeof attachQuizTooltipsGlobal === "function") {
    setTimeout(attachQuizTooltipsGlobal, 50);
  } else if (typeof attachQuizTooltips === "function") {
    setTimeout(attachQuizTooltips, 50);
  } else if (typeof attachTooltipLongPress === "function") {
    setTimeout(() => attachTooltipLongPress(container), 50);
  }
}

function renderMasteredList() {
  const container = document.getElementById("masteredList");
  if (!container) return;

  const masteredIds = [...masteredVerbs];

  if (masteredIds.length === 0) {
    container.innerHTML =
      '<p class="empty-message" style="text-align: center; padding: 40px; color: #999;">No verbs mastered yet. Complete a quiz to master verbs!</p>';
    return;
  }

  let html = "";
  for (const verbId of masteredIds) {
    const verb = getVerbById(verbId);
    if (verb) {
      const dictDisplay = formatDictionaryForDisplay(verb);
      html += `
                <div class="mastered-verb-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #eee;">
                    <div class="mastered-verb-info" style="display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap;">
                        <span class="mastered-verb-dict" style="font-size: 1rem; font-weight: bold;">${dictDisplay}</span>
                        <span class="mastered-verb-meaning" style="font-size: 0.8rem; color: #555;">${verb.meaning}</span>
                    </div>
                    <button class="unmaster-btn" data-verb-id="${verb.id}" style="font-size: 0.7rem; padding: 4px 12px; background: #dc3545; color: white; border: none; border-radius: 20px; cursor: pointer;">Remove</button>
                </div>
            `;
    }
  }

  container.innerHTML = html;

  document.querySelectorAll(".unmaster-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const verbId = btn.dataset.verbId;
      unmarkVerbMastered(verbId);
    });
  });
}

// ==================== QUIZ FUNCTIONS ====================

function generateQuiz() {
  console.log("generateQuiz called! Mode:", quizMode);
  setModeButtonsEnabled(false);

  const questionCount = parseInt(
    document.getElementById("quizCountSelect").value,
  );
  const allQuestions = [];

  const availableVerbs = verbsData.filter((v) => v.examples);

  if (availableVerbs.length === 0) {
    const quizArea = document.getElementById("quizArea");
    if (quizArea) {
      quizArea.innerHTML =
        '<p class="quiz-welcome">No verbs with examples available for quiz.</p>';
    }
    setModeButtonsEnabled(true);
    return;
  }

  for (let i = availableVerbs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableVerbs[i], availableVerbs[j]] = [
      availableVerbs[j],
      availableVerbs[i],
    ];
  }

  const conjugationTypes = [
    "masu",
    "nai",
    "te",
    "ta",
    "potential",
    "volitional",
    "conditional",
  ];
  const displayNames = {
    masu: "Present",
    nai: "Negative",
    te: "Te-form",
    ta: "Past",
    potential: "Potential",
    volitional: "Volitional",
    conditional: "Conditional",
  };

  for (const verb of availableVerbs) {
    if (allQuestions.length >= questionCount) break;

    const randomConj =
      conjugationTypes[Math.floor(Math.random() * conjugationTypes.length)];
    const example = verb.examples[randomConj];

    if (!example) continue;

    const correctForm = verb.conjugations[randomConj];

    let sentenceWithBlank = example.sentence;
    const verbFormInSentence = verb.conjugations[randomConj];

    if (sentenceWithBlank.includes(verbFormInSentence)) {
      sentenceWithBlank = sentenceWithBlank.replace(
        verbFormInSentence,
        "______",
      );
    } else {
      const cleanForm = verbFormInSentence.replace(/[（(][^）)]*[）)]/g, "");
      sentenceWithBlank = sentenceWithBlank.replace(cleanForm, "______");
    }

    const easyOptions = [correctForm];
    const otherVerbs = availableVerbs.filter((v) => v.id !== verb.id);

    while (easyOptions.length < 4 && otherVerbs.length > 0) {
      const randomVerb =
        otherVerbs[Math.floor(Math.random() * otherVerbs.length)];
      const randomOtherConj =
        conjugationTypes[Math.floor(Math.random() * conjugationTypes.length)];
      const otherForm = randomVerb.conjugations[randomOtherConj];
      if (!easyOptions.includes(otherForm) && otherForm !== correctForm) {
        easyOptions.push(otherForm);
      }
    }

    const fallbacks = ["行きます", "食べます", "見ます", "来ます", "します"];
    while (easyOptions.length < 4) {
      const fb = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      if (!easyOptions.includes(fb)) {
        easyOptions.push(fb);
      }
    }

    for (let i = easyOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [easyOptions[i], easyOptions[j]] = [easyOptions[j], easyOptions[i]];
    }

    allQuestions.push({
      sentence: sentenceWithBlank,
      translation: example.translation,
      correctAnswer: correctForm,
      easyOptions: easyOptions,
      verbDict: verb.dictionary,
      verbReading: verb.reading,
      verbMeaning: verb.meaning.replace("to ", ""),
      conjugationType: randomConj,
      conjugationDisplay: displayNames[randomConj],
      originalSentence: example.sentence,
      verbId: verb.id,
      conjugations: verb.conjugations,
      verb: verb,
      reading: example.sentence.replace(/[（(][^）)]*[）)]/g, "").trim(),
    });
  }

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
    quizEasyModeBtn.style.opacity = enabled ? "1" : "0.5";
  }
  if (quizHardModeBtn) {
    quizHardModeBtn.disabled = !enabled;
    quizHardModeBtn.style.opacity = enabled ? "1" : "0.5";
  }
}

function updateQuizStatsDisplay() {
  const totalPossible = currentQuiz.length;
  const scoreEl = document.getElementById("quizRunningScore");
  const totalEl = document.getElementById("quizTotalPossible");
  if (scoreEl) scoreEl.innerText = quizScore.toFixed(1);
  if (totalEl) totalEl.innerText = totalPossible;
  updateMasteredCount();
}

function renderQuizQuestion() {
  const quizArea = document.getElementById("quizArea");
  const resultsDiv = document.getElementById("quizResults");
  if (!quizArea) return;

  if (resultsDiv) resultsDiv.style.display = "none";

  if (!quizActive || currentQuizIndex >= currentQuiz.length) {
    showQuizResults();
    return;
  }

  const q = currentQuiz[currentQuizIndex];
  const attemptsLeft = quizAttemptsRemaining[currentQuizIndex];
  const currentAnswer = quizAnswers[currentQuizIndex];
  const reading = q.reading || "";

  const quizTitle =
    quizMode === "easy"
      ? "📝 Verb Conjugation Quiz - choose the correct verb"
      : "📝 Verb Conjugation Quiz - select the correct conjugation";

  const dictDisplay = formatDictionaryForDisplay(q.verb);

  // ===== Use the helper that respects furigana toggle =====
  let sentenceDisplay = displaySentenceWithFurigana(q.sentence);

  let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #ddd;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                <span style="font-weight: bold; font-size: 1rem; color: #1e4b6e;">${quizTitle}</span>
                <span style="background: #e8f0fe; padding: 6px 14px; border-radius: 20px; font-size: 0.9rem;">📚 Dictionary: ${dictDisplay} (${q.verbMeaning})</span>
            </div>
            <div style="display: flex; gap: 16px; align-items: center;">
                <span style="font-weight: bold; font-size: 1rem; color: #6c8b6b;">⭐ Score: ${quizScore.toFixed(1)}</span>
                <span style="font-weight: bold; font-size: 1rem; color: #c45d1e;">❤️ ${attemptsLeft}</span>
                ${reading ? `<button class="quiz-tts-btn" data-reading="${reading}" style="margin-left: 8px; background: #6c8b6b; color: white; border: none; padding: 4px 14px; border-radius: 30px; cursor: pointer; font-size: 0.85rem;">🔊 Listen</button>` : ""}
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

  if (quizMode === "easy") {
    html += `
            <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 16px 0;">
        `;
    for (const opt of q.easyOptions) {
      const isSelected = currentAnswer && currentAnswer.selected === opt;
      html += `
                <button class="quiz-option-btn" data-answer="${opt}" style="background: ${isSelected ? "#6c8b6b" : "#fff"}; color: ${isSelected ? "#fff" : "#000"}; border: 2px solid #6c8b6b; border-radius: 40px; padding: 10px 18px; font-size: 1rem; cursor: pointer;">
                    ${addFuriganaToText(opt)}
                </button>
            `;
    }
    html += `</div>`;
  } else {
    // HARD MODE
    const conjugationButtons = [
      {
        type: "Present",
        value: q.conjugations.masu,
        display: addFuriganaToText(q.conjugations.masu),
      },
      {
        type: "Negative",
        value: q.conjugations.nai,
        display: addFuriganaToText(q.conjugations.nai),
      },
      {
        type: "Te-form",
        value: q.conjugations.te,
        display: addFuriganaToText(q.conjugations.te),
      },
      {
        type: "Past",
        value: q.conjugations.ta,
        display: addFuriganaToText(q.conjugations.ta),
      },
      {
        type: "Potential",
        value: q.conjugations.potential,
        display: addFuriganaToText(q.conjugations.potential),
      },
      {
        type: "Volitional",
        value: q.conjugations.volitional,
        display: addFuriganaToText(q.conjugations.volitional),
      },
      {
        type: "Conditional",
        value: q.conjugations.conditional,
        display: addFuriganaToText(q.conjugations.conditional),
      },
    ];

    for (let i = conjugationButtons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [conjugationButtons[i], conjugationButtons[j]] = [
        conjugationButtons[j],
        conjugationButtons[i],
      ];
    }

    html += `
            <div style="text-align: center; margin: 8px 0 4px 0;">
                <span style="font-size: 0.85rem; color: #666;">Select the correct conjugation:</span>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 16px 0;">
        `;

    for (const btn of conjugationButtons) {
      const isSelected = currentAnswer && currentAnswer.selected === btn.value;
      html += `
                <button class="hard-opt-btn" data-answer="${btn.value.replace(/"/g, "&quot;")}" style="background: ${isSelected ? "#6c8b6b" : "#fff"}; color: ${isSelected ? "#fff" : "#000"}; border: 2px solid #6c8b6b; border-radius: 40px; padding: 10px 18px; font-size: 1rem; cursor: pointer;">
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

  // ===== TTS SUPPORT: Listen button =====
  const ttsBtn = quizArea.querySelector(".quiz-tts-btn");
  if (ttsBtn) {
    const btnReading = ttsBtn.dataset.reading || reading;
    ttsBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      console.log("TTS: Button clicked, reading:", btnReading);
      if (btnReading) {
        if (typeof speakText === "function") {
          speakText(btnReading);
        } else if (typeof window.speakText === "function") {
          window.speakText(btnReading);
        } else if (window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(btnReading);
          utterance.lang = "ja-JP";
          utterance.rate = 0.85;
          window.speechSynthesis.speak(utterance);
        }
      }
    });
  }

  // ===== TTS: Click on sentence =====
  const sentenceEl = quizArea.querySelector(".quiz-sentence");
  if (sentenceEl && reading) {
    sentenceEl.style.cursor = "pointer";
    sentenceEl.title = "Click to listen";
    sentenceEl.addEventListener("click", function (e) {
      if (
        e.target.closest(".tooltip-text") ||
        e.target.closest(".particle-highlight") ||
        e.target.closest(".word-tooltip")
      ) {
        return;
      }
      console.log("TTS: Playing from sentence click:", reading);
      if (typeof speakText === "function") {
        speakText(reading);
      } else if (typeof window.speakText === "function") {
        window.speakText(reading);
      } else if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(reading);
        utterance.lang = "ja-JP";
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      }
    });
  }

  // ===== ATTACH TOOLTIPS =====
  if (typeof attachQuizTooltipsGlobal === "function") {
    setTimeout(attachQuizTooltipsGlobal, 50);
  } else if (typeof attachQuizTooltips === "function") {
    setTimeout(attachQuizTooltips, 50);
  } else if (typeof attachTooltipLongPress === "function") {
    setTimeout(() => attachTooltipLongPress(quizArea), 50);
  }

  if (quizMode === "easy") {
    document.querySelectorAll(".quiz-option-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".quiz-option-btn").forEach((b) => {
          b.style.background = "#fff";
          b.style.color = "#000";
        });
        btn.style.background = "#6c8b6b";
        btn.style.color = "#fff";
        const selectedAnswer = btn.dataset.answer;
        if (!quizAnswers[currentQuizIndex]) quizAnswers[currentQuizIndex] = {};
        quizAnswers[currentQuizIndex].selected = selectedAnswer;
      });
    });
  } else {
    document.querySelectorAll(".hard-opt-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".hard-opt-btn").forEach((b) => {
          b.style.background = "#fff";
          b.style.color = "#000";
        });
        btn.style.background = "#6c8b6b";
        btn.style.color = "#fff";
        const selectedAnswer = btn.dataset.answer;
        if (!quizAnswers[currentQuizIndex]) quizAnswers[currentQuizIndex] = {};
        quizAnswers[currentQuizIndex].selected = selectedAnswer;
      });
    });
  }

  document
    .getElementById("quizSubmitBtn")
    ?.addEventListener("click", () => checkAnswer());
  document
    .getElementById("quizShowAnswerBtn")
    ?.addEventListener("click", () => showAnswer());
  document.getElementById("quizSkipBtn")?.addEventListener("click", () => {
    currentQuizIndex++;
    renderQuizQuestion();
  });
  document
    .getElementById("quizStopBtn")
    ?.addEventListener("click", () => stopQuiz());
  document
    .getElementById("quizResetBtn")
    ?.addEventListener("click", () => resetQuiz());
}

function normalizeForCompare(str) {
  if (!str) return "";
  let cleaned = str.replace(/[（(][^）)]*[）)]/g, "");
  cleaned = cleaned.replace(/\s+/g, "");
  return cleaned;
}

function checkAnswer() {
  const q = currentQuiz[currentQuizIndex];
  const userAnswer = quizAnswers[currentQuizIndex];
  const userChoice = userAnswer ? userAnswer.selected : "";
  const isFirstAttempt = quizAttemptsRemaining[currentQuizIndex] === 2;
  let pointsEarned = 0;

  if (!userChoice) {
    const feedbackDiv = document.getElementById("quizFeedbackArea");
    if (feedbackDiv) {
      feedbackDiv.innerHTML = `
                <div style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 16px; margin: 12px 0;">
                    ⚠️ Please select an answer.
                </div>
            `;
    }
    return;
  }

  const isCorrect =
    normalizeForCompare(userChoice) === normalizeForCompare(q.correctAnswer);

  if (isCorrect) {
    if (isFirstAttempt) {
      pointsEarned = 1;
      markVerbMastered(q.verbId, true);
    } else {
      pointsEarned = 0.5;
    }
    quizScore += pointsEarned;

    if (!attemptedVerbs.has(q.verbId)) {
      attemptedVerbs.add(q.verbId);
      saveMasteredVerbs();
    }

    updateQuizStatsDisplay();

    // ===== Use the helper that respects furigana toggle =====
    let sentenceDisplay = displaySentenceWithFurigana(q.originalSentence);

    const feedbackHtml = `
            <div style="background: #d4edda; color: #155724; padding: 12px; border-radius: 16px; margin: 12px 0;">
                ✅ ${isFirstAttempt ? "Correct! +1 point" : "Correct on 2nd try! +0.5 points"}
                <div style="margin-top: 8px; font-size: 0.85rem;">${sentenceDisplay} → ${q.translation}</div>
            </div>
            <div style="text-align: center; margin-top: 12px;">
                <button id="quizNextBtn" style="background: #1a2b4c; color: white; border: none; padding: 8px 24px; border-radius: 40px; cursor: pointer;">Next →</button>
            </div>
        `;

    const quizArea = document.getElementById("quizArea");
    if (quizArea) {
      quizArea.innerHTML = feedbackHtml;
    }

    document.getElementById("quizNextBtn")?.addEventListener("click", () => {
      currentQuizIndex++;
      renderQuizQuestion();
    });
  } else {
    quizAttemptsRemaining[currentQuizIndex]--;

    if (quizAttemptsRemaining[currentQuizIndex] > 0) {
      const feedbackDiv = document.getElementById("quizFeedbackArea");
      if (feedbackDiv) {
        feedbackDiv.innerHTML = `
                    <div style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 16px; margin: 12px 0;">
                        ❌ Incorrect. "${q.translation}" needs <strong>${q.conjugationDisplay}</strong> form.<br>
                        ${quizAttemptsRemaining[currentQuizIndex]} attempt(s) left.
                    </div>
                `;
      }
      quizAnswers[currentQuizIndex] = null;
      if (quizMode === "easy") {
        document.querySelectorAll(".quiz-option-btn").forEach((btn) => {
          btn.style.background = "#fff";
          btn.style.color = "#000";
        });
      } else {
        document.querySelectorAll(".hard-opt-btn").forEach((btn) => {
          btn.style.background = "#fff";
          btn.style.color = "#000";
        });
      }
    } else {
      // ===== Use the helper that respects furigana toggle =====
      let sentenceDisplay = displaySentenceWithFurigana(q.originalSentence);

      const feedbackHtml = `
                <div style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 16px; margin: 12px 0;">
                    ❌ Correct: ${addFuriganaToText(q.correctAnswer)} (${q.conjugationDisplay})
                    <div style="margin-top: 8px; font-size: 0.85rem;">${sentenceDisplay} → ${q.translation}</div>
                </div>
                <div style="text-align: center; margin-top: 12px;">
                    <button id="quizNextBtn" style="background: #1a2b4c; color: white; border: none; padding: 8px 24px; border-radius: 40px; cursor: pointer;">Next →</button>
                </div>
            `;

      const quizArea = document.getElementById("quizArea");
      if (quizArea) {
        quizArea.innerHTML = feedbackHtml;
      }

      document.getElementById("quizNextBtn")?.addEventListener("click", () => {
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

  const feedbackHtml = `
        <div style="background: #fff3e0; color: #856404; padding: 12px; border-radius: 16px; margin: 12px 0;">
            📖 Answer: ${addFuriganaToText(q.correctAnswer)} (${q.conjugationDisplay})
            <div style="margin-top: 8px; font-size: 0.85rem;">${sentenceDisplay} → ${q.translation}</div>
            <p style="margin-top: 8px; font-size: 0.7rem;">No points awarded.</p>
        </div>
        <div style="text-align: center; margin-top: 12px;">
            <button id="quizNextBtn" style="background: #1a2b4c; color: white; border: none; padding: 8px 24px; border-radius: 40px; cursor: pointer;">Next →</button>
        </div>
    `;

  const quizArea = document.getElementById("quizArea");
  if (quizArea) {
    quizArea.innerHTML = feedbackHtml;
  }

  document.getElementById("quizNextBtn")?.addEventListener("click", () => {
    currentQuizIndex++;
    renderQuizQuestion();
  });
}

function stopQuiz() {
  if (!quizActive) return;

  quizActive = false;
  setModeButtonsEnabled(true);

  const resultsDiv = document.getElementById("quizResults");
  if (resultsDiv) {
    const percent = Math.round((quizScore / currentQuiz.length) * 100);
    resultsDiv.style.display = "block";
    resultsDiv.innerHTML = `
            <div style="font-size: 1.8rem; font-weight: bold; color: #6c8b6b; text-align: center;">${quizScore.toFixed(1)} / ${currentQuiz.length} (${percent}%)</div>
            <p style="text-align: center;">Quiz stopped early.</p>
            <div style="text-align: center; margin-top: 16px;">
                <button id="quizRestartBtn" style="background: #1a2b4c; color: white; border: none; padding: 10px 24px; border-radius: 40px; cursor: pointer;">Take Another Quiz</button>
            </div>
        `;

    const restartBtn = document.getElementById("quizRestartBtn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        const quizArea = document.getElementById("quizArea");
        if (quizArea) {
          quizArea.innerHTML =
            '<p style="text-align: center; color: #666; padding: 40px;">Select mode and number of questions, then click "Start New Quiz"</p>';
        }
        resultsDiv.style.display = "none";
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

  const feedbackDiv = document.getElementById("quizFeedbackArea");
  if (feedbackDiv) feedbackDiv.innerHTML = "";

  updateQuizStatsDisplay();
  renderQuizQuestion();
}

function showQuizResults() {
  quizActive = false;
  setModeButtonsEnabled(true);

  const percent = Math.round((quizScore / currentQuiz.length) * 100);
  const resultsDiv = document.getElementById("quizResults");
  if (!resultsDiv) return;

  resultsDiv.style.display = "block";
  resultsDiv.innerHTML = `
        <div style="font-size: 1.8rem; font-weight: bold; color: #6c8b6b; text-align: center;">${quizScore.toFixed(1)} / ${currentQuiz.length} (${percent}%)</div>
        <p style="text-align: center;">${percent >= 80 ? "🎉 Excellent!" : percent >= 60 ? "👍 Good job!" : "📚 Keep studying!"}</p>
        <div style="text-align: center; margin-top: 16px;">
            <button id="quizRestartBtn" style="background: #1a2b4c; color: white; border: none; padding: 10px 24px; border-radius: 40px; cursor: pointer;">Take Another Quiz</button>
        </div>
    `;

  const restartBtn = document.getElementById("quizRestartBtn");
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      const quizArea = document.getElementById("quizArea");
      if (quizArea) {
        quizArea.innerHTML =
          '<p style="text-align: center; color: #666; padding: 40px;">Select mode and number of questions, then click "Start New Quiz"</p>';
      }
      resultsDiv.style.display = "none";
    });
  }
}

function resetAllProgress() {
  if (
    confirm(
      "⚠️ Are you sure? This will reset ALL mastered and attempted verbs. This cannot be undone.",
    )
  ) {
    masteredVerbs.clear();
    attemptedVerbs.clear();
    saveMasteredVerbs();
    renderVerbsList();
    renderMasteredList();
    updateMasteredCount();

    if (quizActive) {
      stopQuiz();
    }
  }
}

function resetMasteredOnly() {
  if (
    confirm("⚠️ Reset mastered verbs only? Attempted verbs will be preserved.")
  ) {
    masteredVerbs.clear();
    saveMasteredVerbs();
    renderVerbsList();
    renderMasteredList();
    updateMasteredCount();
  }
}

function switchTab(tabId) {
  currentVerbTab = tabId;

  const tabButtons = [
    tabConjugationBtn,
    tabLearnBtn,
    tabQuizBtn,
    tabMasteredBtn,
  ];
  tabButtons.forEach((btn) => {
    if (btn) btn.classList.remove("active");
  });

  const activeBtn = document.getElementById(
    `tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}Btn`,
  );
  if (activeBtn) activeBtn.classList.add("active");

  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  const activeContent = document.getElementById(
    `tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`,
  );
  if (activeContent) activeContent.classList.add("active");

  if (tabId === "conjugation") {
    renderVerbsList();
  } else if (tabId === "learn") {
    renderLearnTab();
  } else if (tabId === "mastered") {
    renderMasteredList();
  } else if (tabId === "quiz") {
    updateMasteredCount();
  }
}

function attachStartQuizListener() {
  const startQuizBtn = document.getElementById("startQuizBtn");
  if (startQuizBtn) {
    const newBtn = startQuizBtn.cloneNode(true);
    startQuizBtn.parentNode.replaceChild(newBtn, startQuizBtn);
    newBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Start Quiz button clicked! Mode:", quizMode);
      generateQuiz();
    });
    console.log("Start Quiz button listener attached");
  } else {
    console.log("Start Quiz button not found, retrying...");
    setTimeout(attachStartQuizListener, 100);
  }
}

// Event Listeners
if (furiToggleBtn) {
  furiToggleBtn.addEventListener("click", () => {
    applyFuriganaHide();
  });
}

if (quizEasyModeBtn) {
  quizEasyModeBtn.addEventListener("click", () => {
    quizMode = "easy";
    quizEasyModeBtn.classList.add("active");
    quizHardModeBtn.classList.remove("active");
    console.log("Switched to Easy Mode");
    if (quizActive && currentQuiz.length > 0) {
      renderQuizQuestion();
    }
  });
}

if (quizHardModeBtn) {
  quizHardModeBtn.addEventListener("click", () => {
    quizMode = "hard";
    quizHardModeBtn.classList.add("active");
    quizEasyModeBtn.classList.remove("active");
    console.log("Switched to Hard Mode");
    if (quizActive && currentQuiz.length > 0) {
      renderQuizQuestion();
    }
  });
}

if (groupSelect) {
  groupSelect.addEventListener("change", () => {
    currentFilterGroup = groupSelect.value;
    renderVerbsList();
  });
}

if (verbSearchInput) {
  verbSearchInput.addEventListener("input", () => {
    currentSearchTerm = verbSearchInput.value;
    renderVerbsList();
  });
}

const resetAllProgressBtn = document.getElementById("resetAllProgressBtn");
if (resetAllProgressBtn) {
  resetAllProgressBtn.addEventListener("click", resetAllProgress);
}

const resetMasteredOnlyBtn = document.getElementById("resetMasteredOnlyBtn");
if (resetMasteredOnlyBtn) {
  resetMasteredOnlyBtn.addEventListener("click", resetMasteredOnly);
}

// Stats help
const statHelpIcon = document.getElementById("statHelpIcon");
if (statHelpIcon) {
  statHelpIcon.addEventListener("click", () => {
    const explanation = document.getElementById("quizStatsExplanation");
    if (explanation) {
      explanation.style.display =
        explanation.style.display === "none" ? "block" : "none";
    }
  });
}

const closeStatsHelp = document.getElementById("closeStatsHelp");
if (closeStatsHelp) {
  closeStatsHelp.addEventListener("click", () => {
    const explanation = document.getElementById("quizStatsExplanation");
    if (explanation) explanation.style.display = "none";
  });
}

if (tabConjugationBtn)
  tabConjugationBtn.addEventListener("click", () => switchTab("conjugation"));
if (tabLearnBtn)
  tabLearnBtn.addEventListener("click", () => switchTab("learn"));
if (tabQuizBtn) tabQuizBtn.addEventListener("click", () => switchTab("quiz"));
if (tabMasteredBtn)
  tabMasteredBtn.addEventListener("click", () => switchTab("mastered"));

function initVerbs() {
  loadMasteredVerbs();
  renderVerbsList();
  renderLearnTab();
  switchTab("conjugation");

  const totalVerbs = verbOrder.length;
  const totalEls = document.querySelectorAll(
    "#quizTotalVerbs, #quizTotalVerbs2",
  );
  totalEls.forEach((el) => {
    if (el) el.innerText = totalVerbs;
  });

  attachStartQuizListener();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initVerbs);
} else {
  initVerbs();
}
