// ==================== ADVERBS MODULE ====================

let currentAdvTab = "list";
let furiganaHidden = false;
let masteredAdverbs = new Set();
let attemptedAdverbs = new Set();
let currentQuiz = [];
let currentQuizIndex = 0;
let quizAnswers = [];
let quizActive = false;
let quizMode = "easy";
let quizScore = 0;
let quizAttemptsRemaining = {};
let currentSearchTerm = "";

// DOM Elements
const furiToggleBtn = document.getElementById("furiToggleBtn");
const tabListBtn = document.getElementById("tabListBtn");
const tabLearnBtn = document.getElementById("tabLearnBtn");
const tabQuizBtn = document.getElementById("tabQuizBtn");
const tabMasteredBtn = document.getElementById("tabMasteredBtn");
const quizEasyModeBtn = document.getElementById("quizEasyModeBtn");
const quizHardModeBtn = document.getElementById("quizHardModeBtn");
const adverbSearchInput = document.getElementById("adverbSearchInput");

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

  // If furigana is hidden, remove all parentheses and their contents
  if (furiganaHidden) {
    return text.replace(/[（(][^）)]*[）)]/g, "");
  }

  // Special handling for specific adverbs that have complex kanji patterns
  // 時々 -> 時々（ときどき）
  if (text === "時々（ときどき）") {
    return "<ruby>時々<rt>ときどき</rt></ruby>";
  }
  // 真っ直ぐ -> 真っ直ぐ（まっすぐ）
  if (text === "真っ直ぐ（まっすぐ）") {
    return "<ruby>真っ直ぐ<rt>まっすぐ</rt></ruby>";
  }
  // 一緒に -> 一緒（いっしょ）に
  if (text === "一緒（いっしょ）に") {
    return "<ruby>一緒<rt>いっしょ</rt></ruby>に";
  }
  // 段々 -> 段々（だんだん）
  if (text === "段々（だんだん）") {
    return "<ruby>段々<rt>だんだん</rt></ruby>";
  }
  // 色々 -> 色々（いろいろ）
  if (text === "色々（いろいろ）") {
    return "<ruby>色々<rt>いろいろ</rt></ruby>";
  }
  // 一番 -> 一番（いちばん）
  if (text === "一番（いちばん）") {
    return "<ruby>一番<rt>いちばん</rt></ruby>";
  }
  // 何故 -> 何故（なぜ）
  if (text === "何故（なぜ）") {
    return "<ruby>何故<rt>なぜ</rt></ruby>";
  }
  // 同じ -> 同じ（おなじ）
  if (text === "同じ（おなじ）") {
    return "<ruby>同じ<rt>おなじ</rt></ruby>";
  }
  // 直ぐに -> 直ぐに（すぐに）
  if (text === "直ぐに（すぐに）") {
    return "<ruby>直ぐに<rt>すぐに</rt></ruby>";
  }
  // 大丈夫 -> 大丈夫（だいじょうぶ）
  if (text === "大丈夫（だいじょうぶ）") {
    return "<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>";
  }
  // 結構 -> 結構（けっこう）
  if (text === "結構（けっこう）") {
    return "<ruby>結構<rt>けっこう</rt></ruby>";
  }
  // 多分 -> 多分（たぶん）
  if (text === "多分（たぶん）") {
    return "<ruby>多分<rt>たぶん</rt></ruby>";
  }
  // 大変 -> 大変（たいへん）
  if (text === "大変（たいへん）") {
    return "<ruby>大変<rt>たいへん</rt></ruby>";
  }
  // 一人 -> 一人（ひとり）
  if (text === "一人（ひとり）") {
    return "<ruby>一人<rt>ひとり</rt></ruby>";
  }
  // 皆 -> 皆（みんな）
  if (text === "皆（みんな）") {
    return "<ruby>皆<rt>みんな</rt></ruby>";
  }

  // General pattern: 漢字（ふりがな）
  return text.replace(
    /([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g,
    (_, kanji, furigana) => {
      return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
    },
  );
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

// ===== RENDER LEARN TAB =====
function renderLearnTab() {
  const container = document.getElementById("learnContent");
  if (!container) return;

  const content = `
        <div class="learn-container" style="background: #ffffff; border-radius: 20px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e8e0d5;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 4px;">
                <h2 style="color: #000000; font-weight: 700; font-size: 1.5rem; margin: 0;">📖 Understanding Adverbs in Japanese</h2>
                <button onclick="printLesson()" style="background: #6c8b6b; color: white; border: none; padding: 8px 20px; border-radius: 40px; cursor: pointer; font-size: 0.9rem; font-weight: 500; font-family: inherit; transition: background 0.2s, transform 0.1s;" onmouseover="this.style.background='#5a7a59'" onmouseout="this.style.background='#6c8b6b'">🖨️ Print Lesson</button>
            </div>
            <p style="color: #444444; font-weight: 400; margin-bottom: 24px;">N5 Level - Complete Guide</p>
            
            <!-- SECTION 1: Basic Placement -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">1. 基本（きほん）の 副詞（ふくし）の 位置（いち） / Basic Adverb Placement</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    副詞（ふくし）は 通（つう）常（じょう）、動詞（どうし）や 形容詞（けいようし）の <strong>前（まえ）</strong> に 置（お）きます。
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>Adverbs usually come <strong>before</strong> the word they modify (verb or adjective).</em>
                </p>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('わたし は はやく おきます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('わたし は はやく おきます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">私（わたし）は <strong>早（はや）く</strong> 起（お）きます。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I wake up <strong>early</strong>.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('かれ は しずかに はなします')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('かれ は しずかに はなします');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">彼（かれ）は <strong>静（しず）かに</strong> 話（はな）します。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">He speaks <strong>quietly</strong>.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
            </div>
            
            <!-- SECTION 2: Time Adverbs -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">2. 時間（じかん）の 副詞（ふくし） / Time Adverbs</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    時間（じかん）の 副詞（ふくし）は 文（ぶん）の <strong>最初（さいしょ）</strong> に 来（く）ることが 多（おお）い です。
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>Time adverbs often come at the <strong>beginning</strong> of the sentence.</em>
                </p>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('きのう わたし は はやく おきました')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('きのう わたし は はやく おきました');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;"><strong>きのう</strong> 私（わたし）は 早（はや）く 起（お）きました。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Yesterday I woke up early.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('あした ともだちと あいます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('あした ともだちと あいます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;"><strong>あした</strong> 友（とも）だちと 会（あ）います。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Tomorrow I will meet my friend.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('まいあさ こーひーを のみます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('まいあさ こーひーを のみます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;"><strong>まいあさ</strong> コーヒーを 飲（の）みます。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Every morning I drink coffee.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
            </div>
            
            <!-- SECTION 3: Converting Adjectives -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">3. 形容詞（けいようし）から 副詞（ふくし）へ / Converting Adjectives to Adverbs</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 12px;">
                    形容詞（けいようし）を 副詞（ふくし）に 変（か）えることが できます。
                </p>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">い-形容詞（けいようし）→ 副詞（ふくし） / i-Adjective → Adverb (い → く)</h4>
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">形容詞（けいようし）<br><span style="font-weight: 400; font-size: 0.8rem;">Adjective</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">意味（いみ）<br><span style="font-weight: 400; font-size: 0.8rem;">Meaning</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">副詞（ふくし）<br><span style="font-weight: 400; font-size: 0.8rem;">Adverb</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">意味（いみ）<br><span style="font-weight: 400; font-size: 0.8rem;">Meaning</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">早（はや）い</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">fast / early</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">早（はや）<strong>く</strong></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">quickly / early</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">遅（おそ）い</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">slow / late</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">遅（おそ）<strong>く</strong></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">slowly / late</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">強（つよ）い</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">strong</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">強（つよ）<strong>く</strong></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">strongly</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">な-形容詞（けいようし）→ 副詞（ふくし） / na-Adjective → Adverb (な → に)</h4>
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">形容詞（けいようし）<br><span style="font-weight: 400; font-size: 0.8rem;">Adjective</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">意味（いみ）<br><span style="font-weight: 400; font-size: 0.8rem;">Meaning</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">副詞（ふくし）<br><span style="font-weight: 400; font-size: 0.8rem;">Adverb</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">意味（いみ）<br><span style="font-weight: 400; font-size: 0.8rem;">Meaning</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">静（しず）かな</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">quiet</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">静（しず）か<strong>に</strong></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">quietly</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">綺麗（きれい）な</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">beautiful / clean</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">綺麗（きれい）<strong>に</strong></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">beautifully / cleanly</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">上手（じょうず）な</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">skillful</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">上手（じょうず）<strong>に</strong></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">skillfully</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- SECTION 4: Common N5 Adverbs -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">4. N5 で よく 使（つか）う 副詞（ふくし） / Common N5 Adverbs</h3>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">程度（ていど）の 副詞（ふくし） / Degree Adverbs (How much / intensity)</h4>
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">副詞（ふくし）<br><span style="font-weight: 400; font-size: 0.8rem;">Adverb</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">読（よ）み方（かた）<br><span style="font-weight: 400; font-size: 0.8rem;">Reading</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">意味（いみ）<br><span style="font-weight: 400; font-size: 0.8rem;">Meaning</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">例（れい）<br><span style="font-weight: 400; font-size: 0.8rem;">Example</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">とても</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">とても</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">very</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('とても おいしい です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('とても おいしい です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">とても おいしい です。🔊</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">すごく</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">すごく</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">very (informal)</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('すごく たのしかった です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('すごく たのしかった です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">すごく たのしかった です。🔊</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">ちょっと</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">ちょっと</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">a little / just a moment</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('ちょっと やすみます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('ちょっと やすみます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">ちょっと 休（やす）みます。🔊</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">たくさん</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">たくさん</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">a lot</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('たくさん たべました')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('たくさん たべました');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">たくさん 食（た）べました。🔊</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">頻度（ひんど）の 副詞（ふくし） / Frequency Adverbs (How often)</h4>
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">副詞（ふくし）<br><span style="font-weight: 400; font-size: 0.8rem;">Adverb</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">読（よ）み方（かた）<br><span style="font-weight: 400; font-size: 0.8rem;">Reading</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">意味（いみ）<br><span style="font-weight: 400; font-size: 0.8rem;">Meaning</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">例（れい）<br><span style="font-weight: 400; font-size: 0.8rem;">Example</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">いつも</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">いつも</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">always</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('いつも しちじに おきます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('いつも しちじに おきます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">いつも 7時（じ）に 起（お）きます。🔊</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">よく</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">よく</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">often / well</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('よく えいがを みます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('よく えいがを みます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">よく 映画（えいが）を 見（み）ます。🔊</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">ときどき</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">ときどき</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">sometimes</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('ときどき かふぇに いきます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('ときどき かふぇに いきます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">ときどき カフェに 行（い）きます。🔊</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">あまり</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">あまり</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">not much <span style="color: #d9534f;">(with negative)</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('あまり いきません')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('あまり いきません');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">あまり 行（い）きません。🔊</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- SECTION 5: Sentence-Level Adverbs -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">5. 文（ぶん）を 修飾（しゅうしょく）する 副詞（ふくし） / Sentence-Level Adverbs</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    これらの 副詞（ふくし）は 文（ぶん）の <strong>最初（さいしょ）</strong> に 来（く）ることが 多（おお）い です。
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>These adverbs modify the <strong>whole sentence</strong> and often come at the beginning.</em>
                </p>
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">副詞（ふくし）<br><span style="font-weight: 400; font-size: 0.8rem;">Adverb</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">読（よ）み方（かた）<br><span style="font-weight: 400; font-size: 0.8rem;">Reading</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">意味（いみ）<br><span style="font-weight: 400; font-size: 0.8rem;">Meaning</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">例（れい）<br><span style="font-weight: 400; font-size: 0.8rem;">Example</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">たぶん</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">たぶん</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">probably</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('たぶん あした あめが ふります')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('たぶん あした あめが ふります');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">たぶん あした 雨（あめ）が 降（ふ）ります。🔊</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">きっと</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">きっと</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">surely / definitely</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('きっと くる でしょう')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('きっと くる でしょう');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">きっと 来（く）る でしょう。🔊</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">もちろん</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">もちろん</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">of course</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('もちろん いきます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('もちろん いきます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">もちろん 行（い）きます。🔊</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- SECTION 6: もっと and もう -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">6. 「もっと」と「もう」の 特（とく）別（べつ）な 使（つか）い方（かた） / Special Cases: もっと and もう</h3>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">もっと (more)</h4>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 12px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('もっと べんきょうします')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('もっと べんきょうします');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">もっと 勉強（べんきょう）します。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I will study <strong>more</strong>.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                
                <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">もう (already / anymore)</h4>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('もう たべました')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('もう たべました');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">もう 食（た）べました。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I <strong>already</strong> ate.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('もう たべません')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('もう たべません');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">もう 食（た）べません。</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I won't eat <strong>anymore</strong>.</div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                    <div style="color: #d9534f; font-weight: 400; font-size: 0.85rem; margin-top: 4px;">⚠️ もう + 否定形（ひていけい）= "not anymore"</div>
                </div>
            </div>
            
            <!-- SECTION 7: Negative Polarity -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">7. 否定（ひてい）の 副詞（ふくし） / Negative Polarity Adverbs</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    これらの 副詞（ふくし）は <strong>必（かなら）ず</strong> 動詞（どうし）が 否定形（ひていけい）です。
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>These adverbs <strong>always</strong> require a negative verb.</em>
                </p>
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">副詞（ふくし）<br><span style="font-weight: 400; font-size: 0.8rem;">Adverb</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">読（よ）み方（かた）<br><span style="font-weight: 400; font-size: 0.8rem;">Reading</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">意味（いみ）<br><span style="font-weight: 400; font-size: 0.8rem;">Meaning</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">✅ 正（ただ）しい<br><span style="font-weight: 400; font-size: 0.8rem;">Correct</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">❌ 間違（まちが）い<br><span style="font-weight: 400; font-size: 0.8rem;">Incorrect</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">あまり</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">あまり</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">not much</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('あまり のみません')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('あまり のみません');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">あまり 飲（の）み<strong>ません</strong>。🔊</td>
                                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">あまり 飲（の）み<strong>ます</strong> ❌</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">ぜんぜん</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">ぜんぜん</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">not at all</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('ぜんぜん わかりません')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('ぜんぜん わかりません');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">ぜんぜん わかり<strong>ません</strong>。🔊</td>
                                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">ぜんぜん わかり<strong>ます</strong> ❌</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">まだ</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">まだ</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">not yet</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('まだ いっていません')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('まだ いっていません');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">まだ 行（い）って<strong>いません</strong>。🔊</td>
                                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">まだ 行（い）って<strong>います</strong> ❌</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- SECTION 8: Common Mistakes -->
            <div class="learn-section" style="margin-bottom: 20px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">8. よくある 間違（まちが）い / Common Mistakes</h3>
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
                                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">私（わたし）は 行（い）きます 早（はや）く。</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">私（わたし）は 早（はや）く 行（い）きます。</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">副詞（ふくし）は 動詞（どうし）の 前（まえ）</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">あまり 食（た）べます。</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">あまり 食（た）べ<strong>ません</strong>。</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">あまり = 否定（ひてい）の 副詞（ふくし）</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">静（しず）かな 話（はな）します。</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">静（しず）か<strong>に</strong> 話（はな）します。</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">な-形容詞（けいようし）は な → に</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">早（はや）い 起（お）きます。</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">早（はや）<strong>く</strong> 起（お）きます。</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">い-形容詞（けいようし）は い → く</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- SUMMARY BOX -->
            <div style="background: #e8f0e7; border-radius: 16px; padding: 20px; margin-top: 24px; border-left: 4px solid #6c8b6b;">
                <h4 style="color: #000000; font-weight: 700; font-size: 1.1rem; margin-bottom: 12px;">📌 まとめ / Summary</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px;">
                    <div style="color: #000000; font-weight: 500;">✅ 副詞（ふくし）+ 動詞（どうし）<br><span style="font-weight: 400; font-size: 0.85rem;">Adverb + Verb</span></div>
                    <div style="color: #000000; font-weight: 400;">早（はや）く 起（お）きます</div>
                    <div style="color: #000000; font-weight: 500;">✅ 副詞（ふくし）+ 形容詞（けいようし）<br><span style="font-weight: 400; font-size: 0.85rem;">Adverb + Adjective</span></div>
                    <div style="color: #000000; font-weight: 400;">とても おいしい</div>
                    <div style="color: #000000; font-weight: 500;">✅ 時間（じかん）の 副詞（ふくし）は 最初（さいしょ）<br><span style="font-weight: 400; font-size: 0.85rem;">Time adverbs come first</span></div>
                    <div style="color: #000000; font-weight: 400;">あした 行（い）きます</div>
                    <div style="color: #000000; font-weight: 500;">✅ い → く<br><span style="font-weight: 400; font-size: 0.85rem;">i-adjective → く</span></div>
                    <div style="color: #000000; font-weight: 400;">早い → 早く</div>
                    <div style="color: #000000; font-weight: 500;">✅ な → に<br><span style="font-weight: 400; font-size: 0.85rem;">na-adjective → に</span></div>
                    <div style="color: #000000; font-weight: 400;">静かな → 静かに</div>
                    <div style="color: #000000; font-weight: 500;">✅ あまり + 否定（ひてい）<br><span style="font-weight: 400; font-size: 0.85rem;">あまり + negative</span></div>
                    <div style="color: #000000; font-weight: 400;">あまり 行きません</div>
                    <div style="color: #000000; font-weight: 500;">✅ ぜんぜん + 否定（ひてい）<br><span style="font-weight: 400; font-size: 0.85rem;">ぜんぜん + negative</span></div>
                    <div style="color: #000000; font-weight: 400;">ぜんぜん わかりません</div>
                    <div style="color: #000000; font-weight: 500;">✅ もう = already (肯定)<br><span style="font-weight: 400; font-size: 0.85rem;">もう = already (positive)</span></div>
                    <div style="color: #000000; font-weight: 400;">もう 食べました</div>
                    <div style="color: #000000; font-weight: 500;">✅ もう = anymore (否定)<br><span style="font-weight: 400; font-size: 0.85rem;">もう = anymore (negative)</span></div>
                    <div style="color: #000000; font-weight: 400;">もう 食べません</div>
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
      // The onclick is already in the HTML, but we also add a fallback click listener
      if (!el.hasAttribute("onclick")) {
        const text = el.textContent.trim().replace(/[🔊]/g, "").trim();
        if (text) {
          el.addEventListener("click", function (e) {
            // Don't trigger if clicking on the listen indicator
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

// Strip furigana for comparison
function stripFuriganaForDropdown(text) {
  if (!text) return "";
  return text.replace(/[（(][^）)]*[）)]/g, "");
}

// Format adverb for display with furigana
function formatAdverbForDisplay(adv) {
  // Use the pre-formatted display property from adverbsData
  return addFuriganaToText(adv.display);
}

function loadMasteredAdverbs() {
  const stored = localStorage.getItem("masteredAdverbs");
  if (stored) {
    masteredAdverbs = new Set(JSON.parse(stored));
  }
  const storedAttempted = localStorage.getItem("attemptedAdverbs");
  if (storedAttempted) {
    attemptedAdverbs = new Set(JSON.parse(storedAttempted));
  }
  updateMasteredCount();
}

function saveMasteredAdverbs() {
  localStorage.setItem("masteredAdverbs", JSON.stringify([...masteredAdverbs]));
  localStorage.setItem(
    "attemptedAdverbs",
    JSON.stringify([...attemptedAdverbs]),
  );
  updateMasteredCount();
}

function updateMasteredCount() {
  const total = adverbOrder.length;
  const mastered = masteredAdverbs.size;
  const attempted = attemptedAdverbs.size;
  const countEl = document.getElementById("masteredCount");
  const totalEl = document.getElementById("totalCount");
  if (countEl) countEl.innerText = mastered;
  if (totalEl) totalEl.innerText = total;

  const quizMasteredEl = document.getElementById("quizMasteredCount");
  const quizAttemptedEl = document.getElementById("quizAttemptedCount");
  const quizTotalEl = document.getElementById("quizTotalAdverbs");
  const quizTotalEl2 = document.getElementById("quizTotalAdverbs2");
  if (quizMasteredEl) quizMasteredEl.innerText = mastered;
  if (quizAttemptedEl) quizAttemptedEl.innerText = attempted;
  if (quizTotalEl) quizTotalEl.innerText = total;
  if (quizTotalEl2) quizTotalEl2.innerText = total;
}

function markAdverbMastered(advId, isFirstAttempt = true) {
  if (isFirstAttempt && !masteredAdverbs.has(advId)) {
    masteredAdverbs.add(advId);
  }
  if (!attemptedAdverbs.has(advId)) {
    attemptedAdverbs.add(advId);
  }
  saveMasteredAdverbs();
  renderAdverbsList();
  renderMasteredList();
}

function unmarkAdverbMastered(advId) {
  masteredAdverbs.delete(advId);
  saveMasteredAdverbs();
  renderAdverbsList();
  renderMasteredList();
}

function applyFuriganaHide() {
  furiganaHidden = !furiganaHidden;
  if (furiToggleBtn) {
    furiToggleBtn.innerText = furiganaHidden
      ? "🔤 Furigana On"
      : "🔤 Furigana Off";
  }
  renderAdverbsList();
  renderLearnTab();
  renderMasteredList();
  if (quizActive && currentQuiz.length > 0) {
    renderQuizQuestion();
  }
}

function renderAdverbsList() {
  const container = document.getElementById("adverbsList");
  if (!container) return;

  let filteredAdverbs = [...adverbsData];

  if (currentSearchTerm) {
    const searchLower = currentSearchTerm.toLowerCase();
    filteredAdverbs = filteredAdverbs.filter(
      (a) =>
        a.dictionary.toLowerCase().includes(searchLower) ||
        a.reading.toLowerCase().includes(searchLower) ||
        a.meaning.toLowerCase().includes(searchLower),
    );
  }

  let html = "";

  for (const adv of filteredAdverbs) {
    const isMastered = masteredAdverbs.has(adv.id);

    let examplesHtml = "";
    if (adv.examples && adv.examples.length > 0) {
      for (const ex of adv.examples) {
        // ===== Use the helper that respects furigana toggle =====
        let displayJp = displaySentenceWithFurigana(ex.sentence);

        const reading =
          ex.reading || ex.sentence.replace(/[（(][^）)]*[）)]/g, "").trim();

        examplesHtml += `
                    <div class="example-item" data-reading="${reading}">
                        <div class="example-jp">${displayJp}</div>
                        <div class="example-trans">→ ${ex.english}</div>
                        <button class="small-btn example-tts-btn" style="margin-top: 6px; font-size: 0.7rem; background: #6c8b6b; color: white; border: none; padding: 2px 12px; border-radius: 20px; cursor: pointer;" data-reading="${reading}">🔊 Listen</button>
                    </div>
                `;
      }
    }

    const advDisplay = formatAdverbForDisplay(adv);

    html += `
            <div class="adverb-card ${isMastered ? "mastered" : ""}" data-adv-id="${adv.id}">
                <div class="adverb-header">
                    <div>
                        <span class="adverb-title">${advDisplay}</span>
                        ${adv.dictionary !== adv.reading ? `<span class="adverb-reading">(${adv.reading})</span>` : ""}
                        ${isMastered ? '<span class="mastered-badge">✓ Mastered</span>' : ""}
                    </div>
                    <div>
                        <span class="adverb-meaning">${adv.meaning}</span>
                    </div>
                </div>
                
                <div class="adverb-examples">
                    <h4>📝 Example Sentences</h4>
                    ${examplesHtml || '<p style="color: #999; font-style: italic;">No example sentences available.</p>'}
                </div>
                
                <button class="small-btn mark-mastered-btn" data-adv-id="${adv.id}">
                    ${isMastered ? "✓ Mastered" : "✓ Mark as Mastered"}
                </button>
            </div>
        `;
  }

  if (filteredAdverbs.length === 0) {
    html =
      '<p style="text-align: center; padding: 40px;">No adverbs match your search.</p>';
  }

  container.innerHTML = html;

  // ===== TTS SUPPORT: Add click listeners for example items and buttons =====
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
      const advId = btn.dataset.advId;
      if (masteredAdverbs.has(advId)) {
        unmarkAdverbMastered(advId);
      } else {
        markAdverbMastered(advId, true);
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

  const masteredIds = [...masteredAdverbs];

  if (masteredIds.length === 0) {
    container.innerHTML =
      '<p class="empty-message">No adverbs mastered yet. Complete a quiz to master adverbs!</p>';
    return;
  }

  let html = "";
  for (const advId of masteredIds) {
    const adv = getAdverbById(advId);
    if (adv) {
      const advDisplay = formatAdverbForDisplay(adv);
      html += `
                <div class="mastered-adverb-item">
                    <div>
                        <span class="mastered-adverb-dict">${advDisplay}</span>
                        <span class="mastered-adverb-meaning">${adv.meaning}</span>
                    </div>
                    <button class="unmaster-btn" data-adv-id="${adv.id}">Remove</button>
                </div>
            `;
    }
  }

  container.innerHTML = html;

  document.querySelectorAll(".unmaster-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const advId = btn.dataset.advId;
      unmarkAdverbMastered(advId);
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

  const availableAdverbs = adverbsData.filter(
    (a) => a.examples && a.examples.length > 0,
  );

  if (availableAdverbs.length === 0) {
    const quizArea = document.getElementById("quizArea");
    if (quizArea) {
      quizArea.innerHTML =
        '<p class="quiz-welcome" style="color: red;">No adverbs with examples available for quiz.</p>';
    }
    setModeButtonsEnabled(true);
    return;
  }

  // Shuffle
  for (let i = availableAdverbs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableAdverbs[i], availableAdverbs[j]] = [
      availableAdverbs[j],
      availableAdverbs[i],
    ];
  }

  for (const adv of availableAdverbs) {
    if (allQuestions.length >= questionCount) break;

    const example = adv.examples[0];
    if (!example) continue;

    // Create sentence with blank - replace the adverb with _______
    let sentenceWithBlank = example.sentence;
    const advInSentence = adv.dictionary;

    if (sentenceWithBlank.includes(advInSentence)) {
      sentenceWithBlank = sentenceWithBlank.replace(advInSentence, "______");
    } else {
      const cleanAdv = adv.dictionary.replace(/[（(][^）)]*[）)]/g, "");
      sentenceWithBlank = sentenceWithBlank.replace(cleanAdv, "______");
    }

    // Generate options (always 4 options) - USE DISPLAY for furigana
    const options = [adv.display];
    const otherAdverbs = availableAdverbs.filter((a) => a.id !== adv.id);

    while (options.length < 4 && otherAdverbs.length > 0) {
      const randomAdv =
        otherAdverbs[Math.floor(Math.random() * otherAdverbs.length)];
      if (!options.includes(randomAdv.display)) {
        options.push(randomAdv.display);
      }
    }

    const fallbacks = [
      "とても",
      "ちょっと",
      "いつも",
      "よく",
      "ゆっくり",
      "もっと",
      "もう",
      "まだ",
    ];
    while (options.length < 4) {
      const fb = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      if (!options.includes(fb)) {
        options.push(fb);
      }
    }

    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    allQuestions.push({
      sentence: sentenceWithBlank,
      translation: example.english,
      correctAnswer: adv.display,
      options: options,
      advDict: adv.dictionary,
      advDisplay: adv.display,
      advReading: adv.reading,
      advMeaning: adv.meaning,
      originalSentence: example.sentence,
      advId: adv.id,
      reading:
        example.reading ||
        example.sentence.replace(/[（(][^）)]*[）)]/g, "").trim(),
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

  const quizTitle = "📝 Adverb Quiz - choose the correct adverb";

  // ===== Use the helper that respects furigana toggle =====
  let sentenceDisplay = displaySentenceWithFurigana(q.sentence);

  let html = `
        <div style="margin-top: 16px;"></div>
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #ddd;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                <span style="font-weight: bold; font-size: 1rem; color: #1e4b6e;">${quizTitle}</span>
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

  if (quizMode === "easy") {
    html += `
            <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 16px 0;">
        `;
    for (const opt of q.options) {
      const isSelected = currentAnswer && currentAnswer.selected === opt;
      html += `
                <button class="quiz-option-btn" data-answer="${opt}" style="background: ${isSelected ? "#6c8b6b" : "#fff"}; color: ${isSelected ? "#fff" : "#000"}; border: 2px solid #6c8b6b; border-radius: 40px; padding: 10px 18px; font-size: 1rem; cursor: pointer;">
                    ${addFuriganaToText(opt)}
                </button>
            `;
    }
    html += `</div>`;
  } else {
    // HARD MODE - Grid of buttons - shuffled order
    const shuffledOptions = [...q.options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [
        shuffledOptions[j],
        shuffledOptions[i],
      ];
    }

    html += `
            <div style="text-align: center; margin: 8px 0 4px 0;">
                <span style="font-size: 0.85rem; color: #666;">Select the correct adverb:</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin: 16px 0;">
        `;

    for (const opt of shuffledOptions) {
      const isSelected = currentAnswer && currentAnswer.selected === opt;
      html += `
                <button class="hard-opt-btn" data-answer="${opt}" style="background: ${isSelected ? "#2196f3" : "#fff"}; color: ${isSelected ? "#fff" : "#333"}; border: 2px solid #2196f3; border-radius: 40px; padding: 12px 16px; font-size: 0.9rem; cursor: pointer;">
                    ${addFuriganaToText(opt)}
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

  // ===== TTS SUPPORT: Add click listener to the listen button =====
  const ttsBtn = quizArea.querySelector(".quiz-tts-btn");
  if (ttsBtn) {
    console.log("TTS: Found listen button");
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
          console.log("TTS: Using fallback speechSynthesis");
          const utterance = new SpeechSynthesisUtterance(btnReading);
          utterance.lang = "ja-JP";
          utterance.rate = 0.85;
          window.speechSynthesis.speak(utterance);
        } else {
          console.warn("TTS: No speech synthesis available");
        }
      }
    });
  } else {
    console.log("TTS: Listen button not found or no reading available");
  }

  // ===== TTS SUPPORT: Click on sentence to play audio =====
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
        console.log("TTS: Click on tooltip ignored");
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
          b.classList.remove("selected");
        });
        btn.style.background = "#6c8b6b";
        btn.style.color = "#fff";
        btn.classList.add("selected");
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
          b.style.color = "#333";
          b.classList.remove("selected");
        });
        btn.style.background = "#2196f3";
        btn.style.color = "#fff";
        btn.classList.add("selected");
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
      markAdverbMastered(q.advId, true);
    } else {
      pointsEarned = 0.5;
    }
    quizScore += pointsEarned;

    if (!attemptedAdverbs.has(q.advId)) {
      attemptedAdverbs.add(q.advId);
      saveMasteredAdverbs();
    }

    updateQuizStatsDisplay();

    // ===== Use the helper that respects furigana toggle =====
    let sentenceDisplay = displaySentenceWithFurigana(q.originalSentence);

    const reading = q.reading || "";
    const feedbackHtml = `
            <div style="background: #d4edda; color: #155724; padding: 12px; border-radius: 16px; margin: 12px 0;">
                ✅ ${isFirstAttempt ? "Correct! +1 point" : "Correct on 2nd try! +0.5 points"}
                <div style="margin-top: 8px; font-size: 0.85rem;">
                    ${reading ? `<span style="cursor: pointer; background: #6c8b6b; color: white; padding: 2px 12px; border-radius: 20px; font-size: 0.7rem; display: inline-block; margin-right: 8px;" onclick="if(typeof speakText==='function'){speakText('${reading}')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('${reading}');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">🔊 Listen</span>` : ""}
                    ${sentenceDisplay} → ${q.translation}
                </div>
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
                        ❌ Incorrect. The correct adverb is needed.<br>
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
          btn.style.color = "#333";
        });
      }
    } else {
      // ===== Use the helper that respects furigana toggle =====
      let sentenceDisplay = displaySentenceWithFurigana(q.originalSentence);

      const reading = q.reading || "";
      const feedbackHtml = `
                <div style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 16px; margin: 12px 0;">
                    ❌ Correct: "${addFuriganaToText(q.correctAnswer)}". No points awarded.
                    <div style="margin-top: 8px; font-size: 0.85rem;">
                        ${reading ? `<span style="cursor: pointer; background: #6c8b6b; color: white; padding: 2px 12px; border-radius: 20px; font-size: 0.7rem; display: inline-block; margin-right: 8px;" onclick="if(typeof speakText==='function'){speakText('${reading}')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('${reading}');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">🔊 Listen</span>` : ""}
                        ${sentenceDisplay} → ${q.translation}
                    </div>
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

  const reading = q.reading || "";
  const feedbackHtml = `
        <div style="background: #fff3e0; color: #856404; padding: 12px; border-radius: 16px; margin: 12px 0;">
            📖 Answer: ${addFuriganaToText(q.correctAnswer)}
            <div style="margin-top: 8px; font-size: 0.85rem;">
                ${reading ? `<span style="cursor: pointer; background: #6c8b6b; color: white; padding: 2px 12px; border-radius: 20px; font-size: 0.7rem; display: inline-block; margin-right: 8px;" onclick="if(typeof speakText==='function'){speakText('${reading}')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('${reading}');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">🔊 Listen</span>` : ""}
                ${sentenceDisplay} → ${q.translation}
            </div>
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
      "⚠️ Are you sure? This will reset ALL mastered and attempted adverbs. This cannot be undone.",
    )
  ) {
    masteredAdverbs.clear();
    attemptedAdverbs.clear();
    saveMasteredAdverbs();
    renderAdverbsList();
    renderMasteredList();
    updateMasteredCount();

    if (quizActive) {
      stopQuiz();
    }
  }
}

function resetMasteredOnly() {
  if (
    confirm(
      "⚠️ Reset mastered adverbs only? Attempted adverbs will be preserved.",
    )
  ) {
    masteredAdverbs.clear();
    saveMasteredAdverbs();
    renderAdverbsList();
    renderMasteredList();
    updateMasteredCount();
  }
}

function switchTab(tabId) {
  currentAdvTab = tabId;

  const tabButtons = [tabListBtn, tabLearnBtn, tabQuizBtn, tabMasteredBtn];
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

  if (tabId === "list") {
    renderAdverbsList();
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

if (adverbSearchInput) {
  adverbSearchInput.addEventListener("input", () => {
    currentSearchTerm = adverbSearchInput.value;
    renderAdverbsList();
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

if (tabListBtn) tabListBtn.addEventListener("click", () => switchTab("list"));
if (tabLearnBtn)
  tabLearnBtn.addEventListener("click", () => switchTab("learn"));
if (tabQuizBtn) tabQuizBtn.addEventListener("click", () => switchTab("quiz"));
if (tabMasteredBtn)
  tabMasteredBtn.addEventListener("click", () => switchTab("mastered"));

function initAdverbs() {
  loadMasteredAdverbs();
  renderAdverbsList();
  renderLearnTab();
  switchTab("list");

  const totalAdverbs = adverbOrder.length;
  const totalEls = document.querySelectorAll(
    "#quizTotalAdverbs, #quizTotalAdverbs2",
  );
  totalEls.forEach((el) => {
    if (el) el.innerText = totalAdverbs;
  });

  attachStartQuizListener();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAdverbs);
} else {
  initAdverbs();
}