// ==================== PARTICLE MODULE ====================
// Try to find wordDict from multiple sources
let wordDictRef = null;
if (typeof window !== 'undefined' && window.wordDict) {
  wordDictRef = window.wordDict;
} else if (typeof wordDict !== 'undefined') {
  wordDictRef = wordDict;
} else {
  // Try to load from the global scope
  try {
    // Check if it was loaded but not assigned to window
    if (typeof window.wordDict === 'undefined') {
      console.warn('wordDict not found. Tooltips will be disabled.');
    }
  } catch(e) {
    console.warn('Error accessing wordDict:', e);
  }
}

// Log status
if (wordDictRef) {
  console.log('wordDict found with', Object.keys(wordDictRef).length, 'entries');
} else {
  console.warn('wordDict NOT found. Word tooltips will be disabled.');
}

let currentParticleTab = 'structure';
let furiganaHidden = false;
let masteredParticles = new Set();
let attemptedParticles = new Set();
let currentQuiz = [];
let currentQuizIndex = 0;
let quizAnswers = [];
let quizActive = false;
let quizMode = 'easy';
let quizScore = 0;
let quizAttemptsRemaining = {};
let currentQuestionState = null;

// DOM Elements
const sprintSelect = document.getElementById('sprintSelect');
const quizSprintSelect = document.getElementById('quizSprintSelect');
const furiToggleBtn = document.getElementById('furiToggleBtn');
const tabStructureBtn = document.getElementById('tabStructureBtn');
const tabLearnBtn = document.getElementById('tabLearnBtn');
const tabParticlesBtn = document.getElementById('tabParticlesBtn');
const tabPairsBtn = document.getElementById('tabPairsBtn');
const tabQuizBtn = document.getElementById('tabQuizBtn');
const quizEasyModeBtn = document.getElementById('quizEasyModeBtn');
const quizHardModeBtn = document.getElementById('quizHardModeBtn');

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

// Add furigana to text based on toggle state
function addFuriganaToText(text) {
  if (!text) return '';
  if (furiganaHidden) {
    return text.replace(/[（(][^）)]*[）)]/g, '');
  }
  return text.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => {
    return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
  });
}

// ===== RENDER LEARN TAB =====
function renderLearnTab() {
  const container = document.getElementById("learnContent");
  if (!container) return;

  const content = `
    <div class="learn-container" style="background: #ffffff; border-radius: 20px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e8e0d5;">
      
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 4px;">
        <h2 style="color: #000000; font-weight: 700; font-size: 1.5rem; margin: 0;">📖 Understanding Particles in Japanese</h2>
        <button onclick="printLesson()" style="background: #6c8b6b; color: white; border: none; padding: 8px 20px; border-radius: 40px; cursor: pointer; font-size: 0.9rem; font-weight: 500; font-family: inherit; transition: background 0.2s, transform 0.1s;" onmouseover="this.style.background='#5a7a59'" onmouseout="this.style.background='#6c8b6b'">🖨️ Print Lesson</button>
      </div>
      <p style="color: #444444; font-weight: 400; margin-bottom: 24px;">N5 Level - Complete Guide</p>
      
      <!-- SECTION 1: Particle Basics -->
      <div class="learn-section" style="margin-bottom: 28px;">
        <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">1. 助詞（じょし）の 基本 / Particle Basics</h3>
        <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
          助詞（じょし）は 文（ぶん）の <strong>役割（やくわり）</strong> を 示（しめ）す 標識（ひょうしき）です。
        </p>
        <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
          <em>Particles are <strong>signposts</strong> that show the role of each word in a sentence.</em>
        </p>
        <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
          日本語（にほんご）の 動詞（どうし）は <strong>常（つね）に 文（ぶん）の 最後（さいご）</strong> に 来（く）る ので、助詞（じょし）が 誰（だれ）が 何（なに）を しているか を 教（おし）えて くれます。
        </p>
        <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
          <em>Because the verb is always at the <strong>end</strong> of the sentence, particles tell you exactly who is doing what.</em>
        </p>
        
        <div style="overflow-x: auto; margin-bottom: 16px;">
          <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
            <thead>
              <tr style="background: #e8e0d5;">
                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">助詞（じょし）<br><span style="font-weight: 400; font-size: 0.8rem;">Particle</span></th>
                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">役割（やくわり）<br><span style="font-weight: 400; font-size: 0.8rem;">Role</span></th>
                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">例（れい）<br><span style="font-weight: 400; font-size: 0.8rem;">Example</span></th>
                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">英語（えいご）<br><span style="font-weight: 400; font-size: 0.8rem;">English</span></th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">は (wa)</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">トピック / Topic</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('わたし は がくせい です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('わたし は がくせい です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">私（わたし）<strong>は</strong> 学生（がくせい）です。🔊</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">As for me, I am a student.</td>
              </tr>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">が (ga)</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">主語（しゅご）/ Subject</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('いぬ が はしります')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('いぬ が はしります');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">犬（いぬ）<strong>が</strong> 走（はし）ります。🔊</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">The dog runs.</td>
              </tr>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">を (wo/o)</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">目的語（もくてきご）/ Object</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('ほん を よみます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('ほん を よみます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">本（ほん）<strong>を</strong> 読（よ）みます。🔊</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">I read a book.</td>
              </tr>
              <tr>
                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">の (no)</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">所有（しょゆう）/ Possession</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('わたし の くるま')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('わたし の くるま');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">私（わたし）<strong>の</strong> 車（くるま）。🔊</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">My car</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- SECTION 2: The Big Four (Sentence Framework) -->
      <div class="learn-section" style="margin-bottom: 28px;">
        <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">2. 文（ぶん）の 枠組み（わくぐみ） / The Big Four (Sentence Framework)</h3>
        <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
          これら 4つ の 助詞（じょし）を マスターすれば、ほとんど の 日本（にほん）語（ご）の 文（ぶん）を 理解（りかい）できます。
        </p>
        <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
          <em>Master these four particles and you can understand almost any Japanese sentence structure.</em>
        </p>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">は (wa) - トピック / Topic Marker</h4>
        <p style="color: #000000; font-weight: 400; font-size: 0.95rem; margin-bottom: 8px;">
          <strong>機能（きのう）/ Function:</strong> 「何（なに）に ついて 話（はな）しているか」を 示（しめ）します。
        </p>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('わたし は がくせい です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('わたし は がくせい です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">私（わたし）<strong>は</strong> 学生（がくせい）です。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">As for me, I am a student.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">が (ga) - 主語（しゅご）/ Subject Marker</h4>
        <p style="color: #000000; font-weight: 400; font-size: 0.95rem; margin-bottom: 8px;">
          <strong>機能（きのう）/ Function:</strong> 「誰（だれ）が / 何（なに）が」 動（うご）いているか を 示（しめ）します。
        </p>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('いぬ が はしります')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('いぬ が はしります');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">犬（いぬ）<strong>が</strong> 走（はし）ります。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">The dog runs.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">を (wo/o) - 目的語（もくてきご）/ Object Marker</h4>
        <p style="color: #000000; font-weight: 400; font-size: 0.95rem; margin-bottom: 8px;">
          <strong>機能（きのう）/ Function:</strong> 動詞（どうし）の <strong>直接（ちょくせつ）</strong> の 対象（たいしょう）を 示（しめ）します。
        </p>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('ほん を よみます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('ほん を よみます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">本（ほん）<strong>を</strong> 読（よ）みます。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I read a book.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">の (no) - 所有（しょゆう）/ Possessive Marker</h4>
        <p style="color: #000000; font-weight: 400; font-size: 0.95rem; margin-bottom: 8px;">
          <strong>機能（きのう）/ Function:</strong> 2つ の 名詞（めいし）を つなぎます。（所有（しょゆう）や 種類（しゅるい）を 示（しめ）す）
        </p>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('わたし の くるま')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('わたし の くるま');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">私（わたし）<strong>の</strong> 車（くるま）。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">My car.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <div style="background: #f8d7da; border-radius: 12px; padding: 12px 16px; margin-top: 12px; border-left: 4px solid #dc3545;">
          <div style="font-size: 0.95rem; color: #721c24; font-weight: 400;">
            💡 <strong>は vs が の 違（ちが）い / Difference between は and が:</strong><br>
            は = トピック（話（はな）している テーマ）<br>
            が = 主語（しゅご）（動（うご）きの 主（おも）な 実行者（じっこうしゃ））
          </div>
        </div>
      </div>
      
      <!-- SECTION 3: Location, Direction & Means -->
      <div class="learn-section" style="margin-bottom: 28px;">
        <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">3. 場所（ばしょ）と 方向（ほうこう）と 手段（しゅだん） / Location, Direction &amp; Means</h3>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">に (ni) - 目的地（もくてきち）/ 時間（じかん）/ 対象（たいしょう）</h4>
        <p style="color: #000000; font-weight: 400; font-size: 0.95rem; margin-bottom: 8px;">
          <strong>機能（きのう）/ Function:</strong> 時間（じかん）の ポイント、目的地（もくてきち）、具体（ぐたい）的（てき）な 対象（たいしょう）を 示（しめ）します。
        </p>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('とうきょう に いきます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('とうきょう に いきます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">東京（とうきょう）<strong>に</strong> 行（い）きます。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I will go to Tokyo.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">へ (e) - 方向（ほうこう）</h4>
        <p style="color: #000000; font-weight: 400; font-size: 0.95rem; margin-bottom: 8px;">
          <strong>機能（きのう）/ Function:</strong> 方向（ほうこう）や 旅（たび）の 道（みち）のりを 強調（きょうちょう）します。
        </p>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('きた へ むかう')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('きた へ むかう');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">北（きた）<strong>へ</strong> 向（む）かう。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Head towards the north.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">で (de) - 場所（ばしょ）/ 手段（しゅだん）</h4>
        <p style="color: #000000; font-weight: 400; font-size: 0.95rem; margin-bottom: 8px;">
          <strong>機能（きのう）/ Function:</strong> 「どこで」 動（うご）きが 起（お）こっているか、または 何（なに）を 使（つか）って いるか を 示（しめ）します。
        </p>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('がっこう で べんきょうします')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('がっこう で べんきょうします');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">学校（がっこう）<strong>で</strong> 勉強（べんきょう）します。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I study at school.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <div style="background: #f8d7da; border-radius: 12px; padding: 12px 16px; margin-top: 12px; border-left: 4px solid #dc3545;">
          <div style="font-size: 0.95rem; color: #721c24; font-weight: 400;">
            💡 <strong>に vs で の 違（ちが）い / Difference between に and で:</strong><br>
            に = 目的地（もくてきち） (destination) / 到着（とうちゃく）点（てん） (arrival point)<br>
            で = 活動（かつどう）の 場所（ばしょ） (location of activity) / 手段（しゅだん） (means)
          </div>
        </div>
      </div>
      
      <!-- SECTION 4: Modifiers & Relationships -->
      <div class="learn-section" style="margin-bottom: 28px;">
        <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">4. 修飾（しゅうしょく）と 関係（かんけい） / Modifiers &amp; Relationships</h3>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">も (mo) - 「〜も」 / "Also / Too"</h4>
        <p style="color: #000000; font-weight: 400; font-size: 0.95rem; margin-bottom: 8px;">
          <strong>機能（きのう）/ Function:</strong> 主語（しゅご）も 同（おな）じ 行動（こうどう）を する ことを 示（しめ）します。
        </p>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('わたし も いきます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('わたし も いきます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">私（わたし）<strong>も</strong> 行（い）きます。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I will go too.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">と (to) - 「〜と」 / "With" / "And" (Exhaustive)</h4>
        <p style="color: #000000; font-weight: 400; font-size: 0.95rem; margin-bottom: 8px;">
          <strong>機能（きのう）/ Function:</strong> 一緒（いっしょ）に 行動（こうどう）する 人（ひと）や、完全（かんぜん）な リスト を 示（しめ）します。
        </p>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('ともだち と はなします')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('ともだち と はなします');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">友達（ともだち）<strong>と</strong> 話（はな）します。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I speak with a friend.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">や (ya) - 「〜や」 / "And" (Non-exhaustive)</h4>
        <p style="color: #000000; font-weight: 400; font-size: 0.95rem; margin-bottom: 8px;">
          <strong>機能（きのう）/ Function:</strong> リストに まだ 他（ほか）の アイテムが ある ことを 示（しめ）します。
        </p>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('りんご や バナナ')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('りんご や バナナ');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">りんご<strong>や</strong> バナナ。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Apples and bananas (and other things).</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
      </div>
      
      <!-- SECTION 5: Movement & Limits -->
      <div class="learn-section" style="margin-bottom: 28px;">
        <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">5. 移動（いどう）と 限界（げんかい） / Movement &amp; Limits</h3>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">から (kara) - 「〜から」 / "From" / "Because"</h4>
        <p style="color: #000000; font-weight: 400; font-size: 0.95rem; margin-bottom: 8px;">
          <strong>機能（きのう）/ Function:</strong> 時間（じかん）や 場所（ばしょ）の <strong>始（はじ）まり</strong> を 示（しめ）します。
        </p>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('さんじ から')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('さんじ から');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">3時（じ）<strong>から</strong>。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">From 3 o'clock.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">まで (made) - 「〜まで」 / "To" / "Until"</h4>
        <p style="color: #000000; font-weight: 400; font-size: 0.95rem; margin-bottom: 8px;">
          <strong>機能（きのう）/ Function:</strong> 時間（じかん）や 場所（ばしょ）の <strong>終（お）わり</strong> を 示（しめ）します。
        </p>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('えき まで')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('えき まで');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">駅（えき）<strong>まで</strong>。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Up to the station.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
      </div>
      
      <!-- SECTION 6: Sentence-Ending Particles -->
      <div class="learn-section" style="margin-bottom: 28px;">
        <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">6. 文末（ぶんまつ）の 助詞（じょし） / Sentence-Ending Particles</h3>
        <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
          文末（ぶんまつ）の 助詞（じょし）は <strong>感情（かんじょう）</strong> や <strong>意図（いと）</strong> を 伝（つた）えます。
        </p>
        <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
          <em>Sentence-ending particles convey <strong>emotion</strong> and <strong>intent</strong>.</em>
        </p>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">か (ka) - 疑問（ぎもん）/ Question Marker</h4>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('だれ です か')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('だれ です か');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">誰（だれ）です<strong>か</strong>？</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Who is it?</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">ね (ne) - 「〜ですね」 / "Right?" / "Isn't it?"</h4>
        <p style="color: #000000; font-weight: 400; font-size: 0.95rem; margin-bottom: 8px;">
          <strong>機能（きのう）/ Function:</strong> 相手（あいて）の 同意（どうい）を 求（もと）める 時（とき）に 使（つか）います。
        </p>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('いい てんき です ね')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('いい てんき です ね');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">いい 天気（てんき）です<strong>ね</strong>。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Nice weather, isn't it?</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">よ (yo) - 「〜ですよ」 / Emphasis / "I tell you!"</h4>
        <p style="color: #000000; font-weight: 400; font-size: 0.95rem; margin-bottom: 8px;">
          <strong>機能（きのう）/ Function:</strong> 強（つよ）い 確信（かくしん）や 新（あたら）しい 情報（じょうほう）を 伝（つた）える 時（とき）に 使（つか）います。
        </p>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('だいじょうぶ です よ')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('だいじょうぶ です よ');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">大丈夫（だいじょうぶ）です<strong>よ</strong>。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">It's okay, I assure you.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
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
                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">私（わたし）は 行（い）きます 学校（がっこう）へ</td>
                <td style="padding: 8px 16px; color: #28a745; font-weight: 400;">私（わたし）は 学校（がっこう）へ 行（い）きます</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">動詞（どうし）は 文（ぶん）の 最後（さいご）</td>
              </tr>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">学校（がっこう）を 行（い）きます</td>
                <td style="padding: 8px 16px; color: #28a745; font-weight: 400;">学校（がっこう）<strong>へ</strong> 行（い）きます</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">移動（いどう）は に/へ、を は 目的語（もくてきご）</td>
              </tr>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">11時（じ）で 寝（ね）ます</td>
                <td style="padding: 8px 16px; color: #28a745; font-weight: 400;">11時（じ）<strong>に</strong> 寝（ね）ます</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">時間（じかん）は に (で は 違（ちが）う)</td>
              </tr>
              <tr>
                <td style="padding: 8px 16px; color: #d9534f; font-weight: 400;">私（わたし）は 車（くるま）に 行（い）きます</td>
                <td style="padding: 8px 16px; color: #28a745; font-weight: 400;">私（わたし）は 車（くるま）<strong>で</strong> 行（い）きます</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">手段（しゅだん）は で</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- SUMMARY BOX -->
      <div style="background: #e8f0e7; border-radius: 16px; padding: 20px; margin-top: 24px; border-left: 4px solid #6c8b6b;">
        <h4 style="color: #000000; font-weight: 700; font-size: 1.1rem; margin-bottom: 12px;">📌 まとめ / Summary</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px;">
          <div style="color: #000000; font-weight: 500;">✅ は (wa)<br><span style="font-weight: 400; font-size: 0.85rem;">Topic marker</span></div>
          <div style="color: #000000; font-weight: 400;">私（わたし）<strong>は</strong> 学生（がくせい）です</div>
          <div style="color: #000000; font-weight: 500;">✅ が (ga)<br><span style="font-weight: 400; font-size: 0.85rem;">Subject marker</span></div>
          <div style="color: #000000; font-weight: 400;">犬（いぬ）<strong>が</strong> 走（はし）ります</div>
          <div style="color: #000000; font-weight: 500;">✅ を (wo)<br><span style="font-weight: 400; font-size: 0.85rem;">Object marker</span></div>
          <div style="color: #000000; font-weight: 400;">本（ほん）<strong>を</strong> 読（よ）みます</div>
          <div style="color: #000000; font-weight: 500;">✅ の (no)<br><span style="font-weight: 400; font-size: 0.85rem;">Possession</span></div>
          <div style="color: #000000; font-weight: 400;">私（わたし）<strong>の</strong> 車（くるま）</div>
          <div style="color: #000000; font-weight: 500;">✅ に (ni)<br><span style="font-weight: 400; font-size: 0.85rem;">Destination/Time</span></div>
          <div style="color: #000000; font-weight: 400;">東京（とうきょう）<strong>に</strong> 行（い）きます</div>
          <div style="color: #000000; font-weight: 500;">✅ で (de)<br><span style="font-weight: 400; font-size: 0.85rem;">Location/Means</span></div>
          <div style="color: #000000; font-weight: 400;">学校（がっこう）<strong>で</strong> 勉強（べんきょう）します</div>
          <div style="color: #000000; font-weight: 500;">✅ へ (e)<br><span style="font-weight: 400; font-size: 0.85rem;">Direction</span></div>
          <div style="color: #000000; font-weight: 400;">北（きた）<strong>へ</strong> 向（む）かう</div>
          <div style="color: #000000; font-weight: 500;">✅ も (mo)<br><span style="font-weight: 400; font-size: 0.85rem;">Also/Too</span></div>
          <div style="color: #000000; font-weight: 400;">私（わたし）<strong>も</strong> 行（い）きます</div>
          <div style="color: #000000; font-weight: 500;">✅ と (to)<br><span style="font-weight: 400; font-size: 0.85rem;">With/And (exhaustive)</span></div>
          <div style="color: #000000; font-weight: 400;">友達（ともだち）<strong>と</strong> 話（はな）します</div>
          <div style="color: #000000; font-weight: 500;">✅ や (ya)<br><span style="font-weight: 400; font-size: 0.85rem;">And (non-exhaustive)</span></div>
          <div style="color: #000000; font-weight: 400;">りんご<strong>や</strong> バナナ</div>
          <div style="color: #000000; font-weight: 500;">✅ から (kara)<br><span style="font-weight: 400; font-size: 0.85rem;">From</span></div>
          <div style="color: #000000; font-weight: 400;">3時（じ）<strong>から</strong></div>
          <div style="color: #000000; font-weight: 500;">✅ まで (made)<br><span style="font-weight: 400; font-size: 0.85rem;">To/Until</span></div>
          <div style="color: #000000; font-weight: 400;">駅（えき）<strong>まで</strong></div>
          <div style="color: #000000; font-weight: 500;">✅ か (ka)<br><span style="font-weight: 400; font-size: 0.85rem;">Question</span></div>
          <div style="color: #000000; font-weight: 400;">誰（だれ）です<strong>か</strong>？</div>
          <div style="color: #000000; font-weight: 500;">✅ ね (ne)<br><span style="font-weight: 400; font-size: 0.85rem;">Right?</span></div>
          <div style="color: #000000; font-weight: 400;">いい 天気（てんき）です<strong>ね</strong></div>
          <div style="color: #000000; font-weight: 500;">✅ よ (yo)<br><span style="font-weight: 400; font-size: 0.85rem;">Emphasis</span></div>
          <div style="color: #000000; font-weight: 400;">大丈夫（だいじょうぶ）です<strong>よ</strong></div>
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
          el.addEventListener("click", function(e) {
            if (e.target.closest(".tooltip-text") || e.target.closest(".particle-highlight") || e.target.closest(".word-tooltip")) return;
            const cleanText = text.replace(/[→].*$/, "").trim();
            if (cleanText && typeof speakText === "function") {
              speakText(cleanText);
            }
          });
        }
      }
    }
  });

  // Re-apply furigana hide state
  if (furiganaHidden) {
    container.querySelectorAll('rt').forEach(rt => {
      rt.style.display = 'none';
    });
  } else {
    container.querySelectorAll('rt').forEach(rt => {
      rt.style.display = '';
    });
  }
}

// Disable/enable mode buttons
function setModeButtonsEnabled(enabled) {
  if (quizEasyModeBtn) {
    quizEasyModeBtn.disabled = !enabled;
    quizEasyModeBtn.style.opacity = enabled ? '1' : '0.5';
    quizEasyModeBtn.style.cursor = enabled ? 'pointer' : 'not-allowed';
  }
  if (quizHardModeBtn) {
    quizHardModeBtn.disabled = !enabled;
    quizHardModeBtn.style.opacity = enabled ? '1' : '0.5';
    quizHardModeBtn.style.cursor = enabled ? 'pointer' : 'not-allowed';
  }
}

// Load mastered particles from localStorage
function loadMasteredParticles() {
  const stored = localStorage.getItem('masteredParticles');
  if (stored) {
    masteredParticles = new Set(JSON.parse(stored));
  }
  const storedAttempted = localStorage.getItem('attemptedParticles');
  if (storedAttempted) {
    attemptedParticles = new Set(JSON.parse(storedAttempted));
  }
  updateMasteredCount();
}

function saveMasteredParticles() {
  localStorage.setItem('masteredParticles', JSON.stringify([...masteredParticles]));
  localStorage.setItem('attemptedParticles', JSON.stringify([...attemptedParticles]));
  updateMasteredCount();
}

function updateMasteredCount() {
  const total = particleOrder.length;
  const mastered = masteredParticles.size;
  const attempted = attemptedParticles.size;
  const countEl = document.getElementById('masteredCount');
  const totalEl = document.getElementById('totalCount');
  if (countEl) countEl.innerText = mastered;
  if (totalEl) totalEl.innerText = total;
  
  const quizMasteredEl = document.getElementById('quizMasteredCount');
  const quizAttemptedEl = document.getElementById('quizAttemptedCount');
  if (quizMasteredEl) quizMasteredEl.innerText = mastered;
  if (quizAttemptedEl) quizAttemptedEl.innerText = attempted;
}

function markParticleMastered(particle, isFirstAttempt = true) {
  if (isFirstAttempt && !masteredParticles.has(particle)) {
    masteredParticles.add(particle);
  }
  if (!attemptedParticles.has(particle)) {
    attemptedParticles.add(particle);
  }
  saveMasteredParticles();
  renderParticleDetails();
}

// Populate sprint dropdowns
function populateSprintDropdowns() {
  if (!sprintSelect) return;
  const options = ['<option value="all">All Sprints</option>'];
  sprints.forEach((sp, idx) => {
    options.push(`<option value="${idx}">${sp.displayName}</option>`);
  });
  sprintSelect.innerHTML = options.join('');
  
  if (quizSprintSelect) {
    quizSprintSelect.innerHTML = options.join('');
  }
}

// Extract examples for a particle from sentences
function extractExamplesForParticle(particle, sprintIndex = null) {
  const examples = [];
  let sentencesToSearch = sentencesData;
  
  if (sprintIndex !== null && sprintIndex !== 'all') {
    const {start, end} = sprints[parseInt(sprintIndex)];
    sentencesToSearch = sentencesData.slice(start, end + 1);
  }
  
  sentencesToSearch.forEach((sentence) => {
    const pattern = new RegExp(`\\s${particle}\\s|^${particle}\\s|\\s${particle}$`);
    if (pattern.test(sentence.jp)) {
      examples.push(sentence);
    }
  });
  
  return examples.slice(0, 5);
}

function getSprintForSentence(sentence) {
  const index = sentencesData.findIndex(s => s === sentence);
  for (let i = 0; i < sprints.length; i++) {
    if (index >= sprints[i].start && index <= sprints[i].end) {
      return sprints[i].displayName;
    }
  }
  return "Unknown";
}

// Wrap particle examples with highlighting - FIXED furigana
function wrapParticleExample(text, particle) {
  if (!text) return '';
  
  // First, preserve furigana by wrapping in ruby tags
  let rubyText = text.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => {
    return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
  });
  
  // Also handle furigana with different pattern: 漢字(かんじ)
  rubyText = rubyText.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g, (_, kanji, furigana) => {
    return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
  });
  
  if (particle && particle !== '___') {
    const regex = new RegExp(`(${particle})(?![^<]*>|[^<]*<\\/rt>)`, 'g');
    rubyText = rubyText.replace(regex, `<span class="particle-highlight">$1</span>`);
  } else if (particle === '___') {
    rubyText = rubyText.replace(/___/g, '<span class="quiz-blank">___</span>');
  }
  
  return rubyText;
}

// Apply furigana hide - FIXED to re-render Learn tab
function applyFuriganaHide() {
  furiganaHidden = !furiganaHidden;
  if (furiToggleBtn) {
    furiToggleBtn.innerText = furiganaHidden ? '🔤 Furigana On' : '🔤 Furigana Off';
  }
  
  // Re-render Learn tab to apply furigana toggle
  renderLearnTab();
  
  // Apply to other elements
  renderParticleDetails();
  renderPairDetails();
  renderStructureExamples();
  populateParticleReference();
  
  if (quizActive && currentQuiz.length > 0) {
    renderQuizQuestion();
  }
}

function renderParticleDetails() {
  const container = document.getElementById('particleDetails');
  if (!container) return;
  
  const selectedSprint = sprintSelect ? sprintSelect.value : 'all';
  let html = '';
  
  for (const particle of particleOrder) {
    const data = particlesData[particle];
    const examples = extractExamplesForParticle(particle, selectedSprint);
    const isMastered = masteredParticles.has(particle);
    
    let examplesHtml = '';
    for (const ex of examples) {
      let displayHtml = '';
      if (typeof wrapWordsWithTooltips === 'function' && ex.splitWords && ex.wordMeanings) {
        displayHtml = wrapWordsWithTooltips(ex);
        const regex = new RegExp(`(${particle})(?![^<]*>|[^<]*<\\/rt>)`, 'g');
        displayHtml = displayHtml.replace(regex, `<span class="particle-highlight">$1</span>`);
      } else {
        displayHtml = wrapParticleExample(ex.jp, particle);
      }
      
      examplesHtml += `
        <div class="example-item n5-example" data-reading="${ex.reading}">
          <div class="example-jp">${displayHtml}</div>
          <div class="example-trans">→ ${ex.translation}</div>
          <div class="example-sprint">📚 ${getSprintForSentence(ex)} <span class="n5-badge">N5</span></div>
        </div>
      `;
    }
    
    if (examples.length === 0 && data.supplementaryExample) {
      const supp = data.supplementaryExample;
      let displayHtml = wrapParticleExample(supp.jp, particle);
      
      examplesHtml += `
        <div class="example-item supplementary-example" data-reading="${supp.reading}">
          <div class="example-jp">${displayHtml}</div>
          <div class="example-trans">→ ${supp.translation}</div>
          <div class="example-sprint">📖 Supplementary <span class="supp-badge">Extra</span></div>
        </div>
      `;
    }
    
    html += `
      <div class="particle-card" id="particle-${particle}">
        <h2>${particle} <span class="particle-name">${data.name}</span>
          ${isMastered ? '<span class="mastered-badge">✓ Mastered</span>' : ''}
        </h2>
        <div class="particle-function">${data.function}</div>
        <div class="particle-position">Position: ${data.position}</div>
        <div class="usage-note">
          <strong>📖 Usage Note:</strong> ${data.usageNote}
        </div>
        ${data.confusingWith ? `<div class="usage-note"><strong>⚠️ Confusing with:</strong> ${data.confusingWith}</div>` : ''}
        <div class="example-section">
          <h4>📝 Examples</h4>
          ${examplesHtml || '<p>No examples found for this particle.</p>'}
        </div>
        <button class="small-btn mark-mastered-btn" data-particle="${particle}">✓ Mark as Mastered</button>
      </div>
    `;
  }
  
  container.innerHTML = html;
  
  document.querySelectorAll('.example-item').forEach(el => {
    const reading = el.dataset.reading;
    if (reading && typeof speakText === 'function') {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.tooltip-text')) return;
        speakText(reading);
      });
    }
  });
  
  document.querySelectorAll('.mark-mastered-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const particle = btn.dataset.particle;
      markParticleMastered(particle, true);
    });
  });
  
  // Apply furigana hide state
  if (furiganaHidden) {
    container.querySelectorAll('rt').forEach(rt => {
      rt.style.display = 'none';
    });
  } else {
    container.querySelectorAll('rt').forEach(rt => {
      rt.style.display = '';
    });
  }
}

function renderPairDetails() {
  const container = document.getElementById('pairDetails');
  if (!container) return;
  
  let html = '';
  
  for (const pairKey of particlePairOrder) {
    const data = particlesData[pairKey];
    
    let example1Html = data.example1;
    let example2Html = data.example2;
    
    example1Html = example1Html.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => {
      return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
    });
    
    example2Html = example2Html.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => {
      return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
    });
    
    if (pairKey === 'pair_wa_ga') {
      example1Html = example1Html.replace(/は/g, '<span class="particle-highlight">は</span>');
      example2Html = example2Html.replace(/が/g, '<span class="particle-highlight">が</span>');
    } else if (pairKey === 'pair_ni_de') {
      example1Html = example1Html.replace(/に/g, '<span class="particle-highlight">に</span>');
      example2Html = example2Html.replace(/で/g, '<span class="particle-highlight">で</span>');
    } else if (pairKey === 'pair_ni_e') {
      example1Html = example1Html.replace(/に/g, '<span class="particle-highlight">に</span>');
      example2Html = example2Html.replace(/へ/g, '<span class="particle-highlight">へ</span>');
    }
    
    html += `
      <div class="pair-card">
        <h2>${data.name}</h2>
        <p>${data.description}</p>
        <div class="pair-rule">
          <strong>📌 ${data.rule1}</strong>
        </div>
        <div class="pair-rule">
          <strong>📌 ${data.rule2}</strong>
        </div>
        <div class="pair-example">
          <strong>✅ </strong> ${example1Html}
        </div>
        <div class="pair-example">
          <strong>✅ </strong> ${example2Html}
        </div>
        ${data.additionalNote ? `<div class="usage-note">💡 ${data.additionalNote}</div>` : ''}
      </div>
    `;
  }
  
  container.innerHTML = html;
  
  // Apply furigana hide state
  if (furiganaHidden) {
    container.querySelectorAll('rt').forEach(rt => {
      rt.style.display = 'none';
    });
  } else {
    container.querySelectorAll('rt').forEach(rt => {
      rt.style.display = '';
    });
  }
}

function renderStructureExamples() {
  const container = document.getElementById('structureExamples');
  if (!container) return;
  
  const allParticles = ['は', 'が', 'を', 'に', 'で', 'へ', 'と', 'から', 'まで', 'の'];
  const exampleIndices = [0, 7, 14, 21, 28];
  
  let html = '<div class="example-list">';
  
  for (const idx of exampleIndices) {
    const s = sentencesData[idx];
    if (!s) continue;
    
    const particlesInSentence = [];
    for (const particle of allParticles) {
      const pattern = new RegExp(`\\s${particle}\\s|^${particle}\\s|\\s${particle}$`);
      if (pattern.test(s.jp)) {
        particlesInSentence.push(particle);
      }
    }
    
    let displayHtml = '';
    if (typeof wrapWordsWithTooltips === 'function' && s.splitWords && s.wordMeanings) {
      displayHtml = wrapWordsWithTooltips(s);
      for (const particle of particlesInSentence) {
        const regex = new RegExp(`(${particle})(?![^<]*>|[^<]*<\\/rt>)`, 'g');
        displayHtml = displayHtml.replace(regex, `<span class="particle-highlight">$1</span>`);
      }
    } else {
      displayHtml = s.jp;
      for (const particle of particlesInSentence) {
        const regex = new RegExp(`(${particle})(?![^<]*>|[^<]*<\\/rt>)`, 'g');
        displayHtml = displayHtml.replace(regex, `<span class="particle-highlight">$1</span>`);
      }
      displayHtml = displayHtml.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => {
        return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
      });
    }
    
    html += `
      <div class="example-item n5-example" data-reading="${s.reading}">
        <div class="example-jp">${displayHtml}</div>
        <div class="example-trans">→ ${s.translation}</div>
        <div class="example-sprint">📚 N5 Example</div>
      </div>
    `;
  }
  html += '</div>';
  container.innerHTML = html;
  
  document.querySelectorAll('#structureExamples .example-item').forEach(el => {
    const reading = el.dataset.reading;
    if (reading && typeof speakText === 'function') {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.tooltip-text')) return;
        speakText(reading);
      });
    }
  });
  
  // Apply furigana hide state
  if (furiganaHidden) {
    container.querySelectorAll('rt').forEach(rt => {
      rt.style.display = 'none';
    });
  } else {
    container.querySelectorAll('rt').forEach(rt => {
      rt.style.display = '';
    });
  }
}

// Populate particle reference table
function populateParticleReference() {
  const particles = [
    { char: 'は', id: 'wa' },
    { char: 'が', id: 'ga' },
    { char: 'を', id: 'wo' },
    { char: 'に', id: 'ni' },
    { char: 'で', id: 'de' },
    { char: 'へ', id: 'e' },
    { char: 'と', id: 'to' },
    { char: 'から', id: 'kara' },
    { char: 'まで', id: 'made' },
    { char: 'の', id: 'no' },
    { char: 'も', id: 'mo' },
    { char: 'か', id: 'ka' },
    { char: 'よ', id: 'yo' },
    { char: 'ね', id: 'ne' },
    { char: 'や', id: 'ya' }
  ];
  
  for (const p of particles) {
    const container = document.getElementById(`ref-example-${p.id}`);
    if (!container) continue;
    
    const examples = extractExamplesForParticle(p.char, 'all');
    
    if (examples.length > 0) {
      const ex = examples[0];
      let displayHtml = '';
      if (typeof wrapWordsWithTooltips === 'function' && ex.splitWords && ex.wordMeanings) {
        displayHtml = wrapWordsWithTooltips(ex);
        const regex = new RegExp(`(${p.char})(?![^<]*>|[^<]*<\\/rt>)`, 'g');
        displayHtml = displayHtml.replace(regex, `<span class="particle-highlight">$1</span>`);
      } else {
        displayHtml = wrapParticleExample(ex.jp, p.char);
      }
      
      container.innerHTML = `
        <div class="example-item n5-example" data-reading="${ex.reading}" style="margin: 0; padding: 0;">
          <div class="example-jp">${displayHtml}</div>
          <div class="example-trans">→ ${ex.translation}</div>
          <div class="example-sprint" style="font-size: 0.65rem;">📚 N5</div>
        </div>
      `;
      
      const exampleDiv = container.querySelector('.example-item');
      if (exampleDiv && typeof speakText === 'function') {
        exampleDiv.addEventListener('click', (e) => {
          if (e.target.closest('.tooltip-text')) return;
          speakText(ex.reading);
        });
      }
    } else {
      const particleData = particlesData[p.char];
      if (particleData && particleData.supplementaryExample) {
        const supp = particleData.supplementaryExample;
        let displayHtml = wrapParticleExample(supp.jp, p.char);
        
        container.innerHTML = `
          <div class="example-item supplementary-example" data-reading="${supp.reading}" style="margin: 0; padding: 0;">
            <div class="example-jp">${displayHtml}</div>
            <div class="example-trans">→ ${supp.translation}</div>
            <div class="example-sprint" style="font-size: 0.65rem;">📖 Extra</div>
          </div>
        `;
        
        const exampleDiv = container.querySelector('.example-item');
        if (exampleDiv && typeof speakText === 'function') {
          exampleDiv.addEventListener('click', (e) => {
            if (e.target.closest('.tooltip-text')) return;
            speakText(supp.reading);
          });
        }
      } else {
        container.innerHTML = '<div class="example-jp" style="color: #999;">No example found</div>';
      }
    }
  }
  
  // Apply furigana hide state
  if (furiganaHidden) {
    document.querySelectorAll('.particle-ref-example rt').forEach(rt => {
      rt.style.display = 'none';
    });
  } else {
    document.querySelectorAll('.particle-ref-example rt').forEach(rt => {
      rt.style.display = '';
    });
  }
}

// ==================== QUIZ FUNCTIONS ====================

function findAllParticlesInSentence(sentenceText) {
  const particles = [];
  const allParticles = ['は', 'が', 'を', 'に', 'で', 'へ', 'と', 'から', 'まで', 'の', 'も', 'か', 'よ', 'ね', 'や'];
  
  const words = sentenceText.split(/\s+/);
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    for (const particle of allParticles) {
      if (word === particle || word.endsWith(particle)) {
        particles.push({
          particle: particle,
          position: i,
          beforeWord: word.replace(particle, ''),
          fullSegment: word
        });
        break;
      }
    }
  }
  
  return particles;
}

function generateQuiz() {
  if (!quizSprintSelect) return;
  
  setModeButtonsEnabled(false);
  
  const sprintValue = quizSprintSelect.value;
  const questionCount = parseInt(document.getElementById('quizCountSelect').value);
  const allQuestions = [];
  
  let sentencesToUse = sentencesData;
  if (sprintValue !== 'all') {
    const {start, end} = sprints[parseInt(sprintValue)];
    sentencesToUse = sentencesData.slice(start, end + 1);
  }
  
  for (const sentence of sentencesToUse) {
    const particles = findAllParticlesInSentence(sentence.jp);
    
    if (quizMode === 'easy') {
      if (particles.length > 0) {
        allQuestions.push({
          type: 'easy',
          sentence: sentence.jp,
          reading: sentence.reading,
          translation: sentence.translation,
          correctParticle: particles[0].particle,
          options: generateOptions(particles[0].particle),
          originalSentence: sentence.jp,
          wordMeanings: sentence.wordMeanings || null,
          splitWords: sentence.splitWords || null,
          sentenceData: sentence
        });
      }
    } else {
      if (particles.length > 0 && particles.length <= 4) {
        allQuestions.push({
          type: 'hard',
          sentence: sentence.jp,
          reading: sentence.reading,
          translation: sentence.translation,
          particles: particles,
          blankCount: particles.length,
          correctAnswers: particles.map(p => p.particle),
          originalSentence: sentence.jp,
          wordMeanings: sentence.wordMeanings || null,
          splitWords: sentence.splitWords || null,
          sentenceData: sentence
        });
      }
    }
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
  currentQuestionState = null;
  
  for (let i = 0; i < currentQuiz.length; i++) {
    quizAttemptsRemaining[i] = 2;
  }
  
  updateQuizStatsDisplay();
  renderQuizQuestion();
}

function generateOptions(correctParticle) {
  const allParticles = ['は', 'が', 'を', 'に', 'で', 'へ', 'と', 'から', 'まで', 'の'];
  const options = [correctParticle];
  const available = allParticles.filter(p => p !== correctParticle);
  while (options.length < 4 && available.length > 0) {
    const random = available[Math.floor(Math.random() * available.length)];
    if (!options.includes(random)) {
      options.push(random);
    }
  }
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

function createEasyDisplayText(sentence, correctParticle) {
  const pattern = new RegExp(`(\\s${correctParticle}\\s|^${correctParticle}\\s|\\s${correctParticle}$)`);
  const match = sentence.match(pattern);
  if (match) {
    return sentence.replace(pattern, ' ___ ');
  }
  const simplePattern = new RegExp(`${correctParticle}`, 'g');
  if (simplePattern.test(sentence)) {
    return sentence.replace(simplePattern, ' ___ ');
  }
  return sentence + ' ___ ';
}

function createHardDisplayText(sentence, particles) {
  let displayText = sentence;
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    const blankNum = i + 1;
    const pattern = new RegExp(`(\\s${p.particle}\\s|^${p.particle}\\s|\\s${p.particle}$)`);
    displayText = displayText.replace(pattern, ` [${blankNum}] `);
  }
  return displayText;
}

function updateQuizStatsDisplay() {
  const totalPossible = currentQuiz.length;
  const scoreEl = document.getElementById('quizRunningScore');
  const totalEl = document.getElementById('quizTotalPossible');
  if (scoreEl) scoreEl.innerText = quizScore.toFixed(1);
  if (totalEl) totalEl.innerText = totalPossible;
  updateMasteredCount();
}

function showStatsExplanation() {
  const explanation = document.getElementById('quizStatsExplanation');
  if (explanation) {
    explanation.style.display = explanation.style.display === 'none' ? 'block' : 'none';
  }
}

// Helper: Get word meanings for a sentence - IMPROVED VERSION
function getWordMeaningsForSentence(sentence) {
  // Try to get wordDict from multiple sources
  const dict = wordDictRef || 
               (typeof window !== 'undefined' && window.wordDict) || 
               (typeof wordDict !== 'undefined' ? wordDict : null);
  
  if (!dict) {
    return [];
  }
  
  // If we have a sentenceData object with wordMeanings, use it
  if (sentence && sentence.wordMeanings && sentence.wordMeanings.length > 0) {
    return sentence.wordMeanings;
  }
  
  // If we have a sentenceData object, use it to get meanings
  const sentenceObj = sentence.sentenceData || sentence;
  if (sentenceObj && sentenceObj.wordMeanings && sentenceObj.wordMeanings.length > 0) {
    return sentenceObj.wordMeanings;
  }
  
  // Get the text to parse
  const text = sentence.originalSentence || sentence.jp || sentence.sentence || '';
  if (!text) {
    return [];
  }
  
  // Split the text into words
  const words = text.split(/\s+/);
  const meanings = [];
  const usedKeys = new Set();
  
  for (const word of words) {
    // Clean the word (remove furigana)
    const cleanWord = word.replace(/（[^）]+）/g, '').replace(/\([^)]+\)/g, '').trim();
    
    // Try exact match first
    if (dict[cleanWord] && !usedKeys.has(cleanWord)) {
      meanings.push({
        word: cleanWord,
        meaning: dict[cleanWord].meaning
      });
      usedKeys.add(cleanWord);
      continue;
    }
    
    if (dict[word] && !usedKeys.has(word)) {
      meanings.push({
        word: word,
        meaning: dict[word].meaning
      });
      usedKeys.add(word);
      continue;
    }
    
    // Try partial match - find if any dictionary key is contained in this word
    let found = false;
    const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
      if (usedKeys.has(key)) continue;
      // Check if the word contains this dictionary key
      if (cleanWord.includes(key) && key.length > 1) {
        meanings.push({
          word: key,
          meaning: dict[key].meaning
        });
        usedKeys.add(key);
        found = true;
        break;
      }
    }
    
    if (!found) {
      // No meaning found
    }
  }
  
  return meanings;
}

// Helper: Create word tooltip HTML for quiz sentences
function createQuizWordTooltips(text, wordMeanings) {
  if (!text) return '';
  if (!wordMeanings || !wordMeanings.length) {
    // Still wrap furigana even without tooltips
    return wrapParticleExample(text, '');
  }
  
  // Split text by spaces while preserving particles
  const words = text.split(/\s+/);
  let result = '';
  let usedMeanings = [];
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let meaning = '';
    let found = false;
    
    // Clean the word (remove furigana)
    const cleanWord = word.replace(/（[^）]+）/g, '').replace(/\([^)]+\)/g, '').trim();
    
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
    
    // If not found, try to match partially
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
    // Wrap furigana
    displayWord = displayWord.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => {
      return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
    });
    displayWord = displayWord.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g, (_, kanji, furigana) => {
      return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
    });
    
    if (meaning) {
      // Check if this word contains a particle that should be highlighted
      const particleMatch = word.match(/^(.*?)([はがをにでへとかからまでのもよねや])$/);
      if (particleMatch) {
        const before = particleMatch[1];
        const particle = particleMatch[2];
        // Rebuild with furigana for the before part
        let beforeHtml = before;
        beforeHtml = beforeHtml.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => {
          return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
        });
        beforeHtml = beforeHtml.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g, (_, kanji, furigana) => {
          return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
        });
        result += `<span class="word-tooltip">${beforeHtml}<span class="particle-highlight">${particle}</span><span class="tooltip-text">${meaning}</span></span> `;
      } else {
        result += `<span class="word-tooltip">${displayWord}<span class="tooltip-text">${meaning}</span></span> `;
      }
    } else {
      // Check if this word contains a particle that should be highlighted
      const particleMatch = word.match(/^(.*?)([はがをにでへとかからまでのもよねや])$/);
      if (particleMatch) {
        const before = particleMatch[1];
        const particle = particleMatch[2];
        let beforeHtml = before;
        beforeHtml = beforeHtml.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => {
          return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
        });
        beforeHtml = beforeHtml.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g, (_, kanji, furigana) => {
          return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
        });
        result += `${beforeHtml}<span class="particle-highlight">${particle}</span> `;
      } else {
        result += `${displayWord} `;
      }
    }
  }
  
  return result.trim();
}

function renderQuizQuestion() {
  const quizArea = document.getElementById('quizArea');
  const resultsDiv = document.getElementById('quizResults');
  if (!quizArea) return;
  
  if (resultsDiv) resultsDiv.style.display = 'none';
  
  if (!quizActive || currentQuizIndex >= currentQuiz.length) {
    showQuizResults();
    return;
  }
  
  const q = currentQuiz[currentQuizIndex];
  const attemptsLeft = quizAttemptsRemaining[currentQuizIndex];
  const currentAnswer = quizAnswers[currentQuizIndex];
  
  // Get word meanings for tooltips
  const wordMeanings = getWordMeaningsForSentence(q);
  
  let html = `
    <div class="quiz-header-info">
      <span class="quiz-question-counter">Question ${currentQuizIndex + 1} / ${currentQuiz.length}</span>
      <span class="quiz-score-display">Score: ${quizScore.toFixed(1)}</span>
      <span class="attempts-left">Attempts left: ${attemptsLeft}</span>
      <button class="small-btn quiz-tts-btn" data-reading="${q.reading || ''}" style="margin-left: auto;">🔊 Listen</button>
    </div>
    <div id="quizFeedbackArea"></div>
  `;
  
  if (quizMode === 'easy') {
    const displayText = createEasyDisplayText(q.originalSentence, q.correctParticle);
    const displayHtml = wordMeanings && wordMeanings.length > 0 
      ? createQuizWordTooltips(displayText, wordMeanings)
      : wrapParticleExample(displayText, '___');
    
    html += `
      <div class="quiz-question easy-question">
        <div class="quiz-sentence" data-reading="${q.reading || ''}">${displayHtml}</div>
        <div class="quiz-translation">📖 ${q.translation}</div>
        <div class="quiz-options">
    `;
    
    for (const opt of q.options) {
      const isSelected = currentAnswer && currentAnswer.selected === opt;
      html += `
        <button class="quiz-option-btn ${isSelected ? 'selected' : ''}" data-particle="${opt}">
          ${opt}
        </button>
      `;
    }
    
    html += `
        </div>
        <div class="quiz-nav">
          <button id="quizSubmitBtn" class="action-btn">Check Answer</button>
          <button id="quizShowAnswerBtn" class="small-btn">📖 Show Answer</button>
          <button id="quizStopBtn" class="small-btn">⏹️ Stop Quiz</button>
          <button id="quizResetBtn" class="small-btn">🔄 Reset Quiz</button>
          <button id="quizSkipBtn" class="small-btn">Skip</button>
        </div>
      </div>
    `;
    
  } else {
    const displayText = createHardDisplayText(q.originalSentence, q.particles);
    const displayHtml = wordMeanings && wordMeanings.length > 0 
      ? createQuizWordTooltips(displayText, wordMeanings)
      : wrapParticleExample(displayText, '');
    
    const blankAnswers = currentAnswer && currentAnswer.blanks ? currentAnswer.blanks : {};
    
    html += `
      <div class="quiz-question hard-question">
        <div class="quiz-sentence hard-question-text" data-reading="${q.reading || ''}">${displayHtml}</div>
        <div class="quiz-translation">📖 ${q.translation}</div>
        <div class="quiz-blanks-container">
    `;
    
    for (let i = 0; i < q.particles.length; i++) {
      const blankNum = i + 1;
      const selectedValue = blankAnswers[blankNum] || '';
      
      html += `
        <div class="blank-row">
          <label class="blank-label">Blank [${blankNum}]:</label>
          <select class="blank-select" data-blank="${blankNum}">
            <option value="">-- Select particle --</option>
            <option value="は" ${selectedValue === 'は' ? 'selected' : ''}>は (topic)</option>
            <option value="が" ${selectedValue === 'が' ? 'selected' : ''}>が (subject)</option>
            <option value="を" ${selectedValue === 'を' ? 'selected' : ''}>を (object)</option>
            <option value="に" ${selectedValue === 'に' ? 'selected' : ''}>に (time/direction/location)</option>
            <option value="で" ${selectedValue === 'で' ? 'selected' : ''}>で (location/means)</option>
            <option value="へ" ${selectedValue === 'へ' ? 'selected' : ''}>へ (direction)</option>
            <option value="と" ${selectedValue === 'と' ? 'selected' : ''}>と (and/with)</option>
            <option value="から" ${selectedValue === 'から' ? 'selected' : ''}>から (from)</option>
            <option value="まで" ${selectedValue === 'まで' ? 'selected' : ''}>まで (until/to)</option>
            <option value="の" ${selectedValue === 'の' ? 'selected' : ''}>の (possession)</option>
          </select>
        </div>
      `;
    }
    
    html += `
        </div>
        <div class="quiz-nav">
          <button id="quizSubmitBtn" class="action-btn">Check Answers</button>
          <button id="quizShowAnswerBtn" class="small-btn">📖 Show Answer</button>
          <button id="quizStopBtn" class="small-btn">⏹️ Stop Quiz</button>
          <button id="quizResetBtn" class="small-btn">🔄 Reset Quiz</button>
          <button id="quizClearBtn" class="small-btn">Clear All</button>
          <button id="quizSkipBtn" class="small-btn">Skip</button>
        </div>
      </div>
    `;
  }
  
  quizArea.innerHTML = html;
  
  // ATTACH TOOLTIPS
  if (typeof attachQuizTooltips === 'function') {
    setTimeout(function() {
      attachQuizTooltips();
    }, 100);
    try {
      attachQuizTooltips();
    } catch(e) {
      // ignore
    }
  } else if (typeof attachTooltipLongPress === 'function') {
    setTimeout(function() {
      if (quizArea) attachTooltipLongPress(quizArea);
    }, 100);
  }
  
  // Add TTS to the listen button
  const ttsBtn = quizArea.querySelector('.quiz-tts-btn');
  if (ttsBtn) {
    ttsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const reading = ttsBtn.dataset.reading || q.reading || '';
      if (reading && typeof speakText === 'function') {
        speakText(reading);
      }
    });
  }
  
  // Apply furigana hide state to quiz
  if (furiganaHidden) {
    quizArea.querySelectorAll('rt').forEach(rt => {
      rt.style.display = 'none';
    });
  } else {
    quizArea.querySelectorAll('rt').forEach(rt => {
      rt.style.display = '';
    });
  }
  
  if (quizMode === 'easy') {
    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const selectedParticle = btn.dataset.particle;
        if (!quizAnswers[currentQuizIndex]) quizAnswers[currentQuizIndex] = {};
        quizAnswers[currentQuizIndex].selected = selectedParticle;
      });
    });
  } else {
    document.querySelectorAll('.blank-select').forEach(select => {
      select.addEventListener('change', () => {
        if (!quizAnswers[currentQuizIndex]) quizAnswers[currentQuizIndex] = { blanks: {} };
        if (!quizAnswers[currentQuizIndex].blanks) quizAnswers[currentQuizIndex].blanks = {};
        quizAnswers[currentQuizIndex].blanks[select.dataset.blank] = select.value;
      });
    });
    
    const clearBtn = document.getElementById('quizClearBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        document.querySelectorAll('.blank-select').forEach(select => {
          select.value = '';
        });
        quizAnswers[currentQuizIndex] = { blanks: {} };
      });
    }
  }
  
  const submitBtn = document.getElementById('quizSubmitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => checkAnswer());
  }
  
  const showAnswerBtn = document.getElementById('quizShowAnswerBtn');
  if (showAnswerBtn) {
    showAnswerBtn.addEventListener('click', () => showAnswer());
  }
  
  const skipBtn = document.getElementById('quizSkipBtn');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      currentQuizIndex++;
      renderQuizQuestion();
    });
  }
  
  const stopQuizBtn = document.getElementById('quizStopBtn');
  if (stopQuizBtn) {
    stopQuizBtn.addEventListener('click', () => stopQuiz());
  }
  
  const resetQuizBtn = document.getElementById('quizResetBtn');
  if (resetQuizBtn) {
    resetQuizBtn.addEventListener('click', () => resetQuiz());
  }
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
      <div class="quiz-score">${quizScore.toFixed(1)} / ${currentQuiz.length} (${percent}%)</div>
      <p>Quiz stopped early. You answered ${quizScore.toFixed(1)} out of ${currentQuiz.length} points.</p>
      <div class="stats-explanation" style="margin-top: 15px;">
        <h4>📖 How Scoring Worked</h4>
        <ul>
          <li>✓ 1st attempt correct → +1 point per particle & particle mastered</li>
          <li>✓ 2nd attempt correct → +0.5 points per particle (no mastery)</li>
          <li>📖 Used "Show Answer" → 0 points (no mastery)</li>
          <li>❌ Wrong both attempts → 0 points (no mastery)</li>
        </ul>
      </div>
      <button id="quizRestartBtn" class="action-btn">Take Another Quiz</button>
    `;
    
    const restartBtn = document.getElementById('quizRestartBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        const quizArea = document.getElementById('quizArea');
        if (quizArea) {
          quizArea.innerHTML = '<p class="quiz-welcome">Select mode, sprint, and number of questions, then click "Start New Quiz"</p>';
        }
        resultsDiv.style.display = 'none';
      });
    }
  }
  
  const quizArea = document.getElementById('quizArea');
  if (quizArea) {
    quizArea.innerHTML = '';
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

// Reset all progress (mastered and attempted particles)
function resetAllProgress() {
  if (confirm('⚠️ Are you sure? This will reset ALL mastered and attempted particles. This cannot be undone.')) {
    masteredParticles.clear();
    attemptedParticles.clear();
    saveMasteredParticles();
    renderParticleDetails();
    updateMasteredCount();
    
    if (quizActive) {
      stopQuiz();
    }
    
    const feedbackDiv = document.getElementById('quizFeedbackArea');
    if (feedbackDiv) {
      feedbackDiv.innerHTML = `
        <div class="quiz-feedback correct" style="background: #d4edda; color: #155724;">
          ✅ All progress has been reset. Mastered and attempted particles cleared.
        </div>
      `;
      setTimeout(() => {
        if (feedbackDiv) feedbackDiv.innerHTML = '';
      }, 3000);
    } else {
      alert('✅ All progress has been reset.');
    }
  }
}

// Reset only mastered particles (keep attempted)
function resetMasteredOnly() {
  if (confirm('⚠️ Reset mastered particles only? Attempted particles will be preserved.')) {
    masteredParticles.clear();
    saveMasteredParticles();
    renderParticleDetails();
    updateMasteredCount();
    
    const feedbackDiv = document.getElementById('quizFeedbackArea');
    if (feedbackDiv) {
      feedbackDiv.innerHTML = `
        <div class="quiz-feedback correct" style="background: #d4edda; color: #155724;">
          ✅ Mastered particles have been reset. Attempted particles preserved.
        </div>
      `;
      setTimeout(() => {
        if (feedbackDiv) feedbackDiv.innerHTML = '';
      }, 3000);
    }
  }
}

function showAnswer() {
  const q = currentQuiz[currentQuizIndex];
  let answerText = '';
  
  if (quizMode === 'easy') {
    answerText = `The correct particle is "${q.correctParticle}".`;
  } else {
    const correctList = q.particles.map((p, i) => `${i + 1}: ${p.particle}`).join(', ');
    answerText = `The correct particles are: ${correctList}.`;
  }
  
  const feedbackHtml = `
    <div class="quiz-feedback incorrect">
      📖 Answer revealed: ${answerText}<br>
      <div class="example-item" style="margin-top: 15px;">
        <div class="example-jp">${wrapParticleExample(q.originalSentence, '')}</div>
        <div class="example-trans">→ ${q.translation}</div>
      </div>
      <p style="margin-top: 10px; font-size: 0.8rem;">No points awarded for using Show Answer.</p>
    </div>
    <div class="quiz-nav">
      <button id="quizNextBtn" class="action-btn">Next Question →</button>
    </div>
  `;
  
  const quizArea = document.getElementById('quizArea');
  if (quizArea) {
    quizArea.innerHTML = feedbackHtml;
  }
  
  const nextBtn = document.getElementById('quizNextBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentQuizIndex++;
      renderQuizQuestion();
    });
  }
}

function checkAnswer() {
  const q = currentQuiz[currentQuizIndex];
  const userAnswer = quizAnswers[currentQuizIndex];
  let isCorrect = false;
  let feedbackMessage = '';
  let pointsEarned = 0;
  let masteryParticles = [];
  const isFirstAttempt = (quizAttemptsRemaining[currentQuizIndex] === 2);
  
  if (quizMode === 'easy') {
    const userParticle = userAnswer ? userAnswer.selected : '';
    isCorrect = userParticle === q.correctParticle;
    
    if (isCorrect) {
      if (isFirstAttempt) {
        pointsEarned = 1;
        masteryParticles = [q.correctParticle];
        feedbackMessage = `✅ Correct on first attempt! +1 point. Particle "${q.correctParticle}" mastered!`;
      } else {
        pointsEarned = 0.5;
        feedbackMessage = `✅ Correct on second attempt! +0.5 points.`;
      }
      showFeedbackAndNext(feedbackMessage, q, true, pointsEarned, masteryParticles);
    } else {
      quizAttemptsRemaining[currentQuizIndex]--;
      if (quizAttemptsRemaining[currentQuizIndex] > 0) {
        const feedbackDiv = document.getElementById('quizFeedbackArea');
        if (feedbackDiv) {
          feedbackDiv.innerHTML = `
            <div class="quiz-feedback incorrect" style="background: #f8d7da; color: #721c24; border-left: 4px solid #dc3545;">
              ❌ Incorrect. You have ${quizAttemptsRemaining[currentQuizIndex]} attempt(s) left. Try again!
            </div>
          `;
        }
        document.querySelectorAll('.quiz-option-btn').forEach(btn => {
          btn.classList.remove('selected');
        });
        quizAnswers[currentQuizIndex] = null;
        return;
      } else {
        feedbackMessage = `❌ Incorrect. The correct particle is "${q.correctParticle}". No points awarded.`;
        showFeedbackAndNext(feedbackMessage, q, false, 0, []);
      }
    }
  } else {
    const userBlanks = userAnswer && userAnswer.blanks ? userAnswer.blanks : {};
    let allCorrect = true;
    const correctList = [];
    const wrongList = [];
    
    for (let i = 0; i < q.particles.length; i++) {
      const blankNum = i + 1;
      const userChoice = userBlanks[blankNum] || '';
      const correctChoice = q.correctAnswers[i];
      
      if (userChoice === correctChoice) {
        correctList.push(`${blankNum}: ${correctChoice}`);
      } else {
        allCorrect = false;
        wrongList.push(`${blankNum}: ${userChoice || 'empty'} (correct: ${correctChoice})`);
      }
    }
    
    isCorrect = allCorrect;
    
    if (isCorrect) {
      if (isFirstAttempt) {
        pointsEarned = q.particles.length;
        masteryParticles = q.correctAnswers;
        feedbackMessage = `✅ All particles correct on first attempt! +${q.particles.length} points. Particles mastered: ${masteryParticles.join(', ')}`;
      } else {
        pointsEarned = q.particles.length * 0.5;
        feedbackMessage = `✅ All particles correct on second attempt! +${(q.particles.length * 0.5).toFixed(1)} points.`;
      }
      showFeedbackAndNext(feedbackMessage, q, true, pointsEarned, masteryParticles);
    } else {
      quizAttemptsRemaining[currentQuizIndex]--;
      if (quizAttemptsRemaining[currentQuizIndex] > 0) {
        const feedbackDiv = document.getElementById('quizFeedbackArea');
        if (feedbackDiv) {
          feedbackDiv.innerHTML = `
            <div class="quiz-feedback incorrect" style="background: #f8d7da; color: #721c24; border-left: 4px solid #dc3545;">
              ❌ Some answers were incorrect.<br>✓ Correct: ${correctList.join(', ')}<br>✗ Wrong: ${wrongList.join(', ')}<br>You have ${quizAttemptsRemaining[currentQuizIndex]} attempt(s) left. Try again!
            </div>
          `;
        }
        return;
      } else {
        feedbackMessage = `❌ Some answers were incorrect.<br>✓ Correct: ${correctList.join(', ')}<br>✗ Wrong: ${wrongList.join(', ')}<br>The correct particles are: ${q.correctAnswers.join(', ')}. No points awarded.`;
        showFeedbackAndNext(feedbackMessage, q, false, 0, []);
      }
    }
  }
}

function showFeedbackAndNext(message, q, isCorrect, pointsEarned, masteryParticles) {
  if (pointsEarned > 0) {
    quizScore += pointsEarned;
    for (const particle of masteryParticles) {
      markParticleMastered(particle, true);
    }
  }
  
  if (quizMode === 'easy') {
    if (!attemptedParticles.has(q.correctParticle)) {
      attemptedParticles.add(q.correctParticle);
    }
  } else {
    for (const particle of q.correctAnswers) {
      if (!attemptedParticles.has(particle)) {
        attemptedParticles.add(particle);
      }
    }
  }
  saveMasteredParticles();
  updateQuizStatsDisplay();
  
  // Get word meanings for tooltips in feedback
  const wordMeanings = getWordMeaningsForSentence(q);
  const displayHtml = wordMeanings && wordMeanings.length > 0 
    ? createQuizWordTooltips(q.originalSentence, wordMeanings)
    : wrapParticleExample(q.originalSentence, '');
  
  const feedbackHtml = `
    <div class="quiz-feedback ${isCorrect && pointsEarned > 0 ? 'correct' : 'incorrect'}">
      ${message}
      <div class="example-item" style="margin-top: 15px;">
        <div class="example-jp" data-reading="${q.reading || ''}">${displayHtml}</div>
        <div class="example-trans">→ ${q.translation}</div>
        <button class="small-btn feedback-tts-btn" style="margin-top: 8px;">🔊 Listen</button>
      </div>
    </div>
    <div class="quiz-nav">
      <button id="quizNextBtn" class="action-btn">Next Question →</button>
    </div>
  `;
  
  const quizArea = document.getElementById('quizArea');
  if (quizArea) {
    quizArea.innerHTML = feedbackHtml;
    
    // Apply furigana hide state
    if (furiganaHidden) {
      quizArea.querySelectorAll('rt').forEach(rt => {
        rt.style.display = 'none';
      });
    } else {
      quizArea.querySelectorAll('rt').forEach(rt => {
        rt.style.display = '';
      });
    }
    
    const feedbackTtsBtn = quizArea.querySelector('.feedback-tts-btn');
    if (feedbackTtsBtn) {
      feedbackTtsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const reading = q.reading || '';
        if (reading && typeof speakText === 'function') {
          speakText(reading);
        }
      });
    }
  }
  
  const nextBtn = document.getElementById('quizNextBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentQuizIndex++;
      renderQuizQuestion();
    });
  }
}

function showQuizResults() {
  quizActive = false;
  setModeButtonsEnabled(true);
  
  const percent = Math.round((quizScore / currentQuiz.length) * 100);
  const resultsDiv = document.getElementById('quizResults');
  if (!resultsDiv) return;
  
  resultsDiv.style.display = 'block';
  resultsDiv.innerHTML = `
    <div class="quiz-score">${quizScore.toFixed(1)} / ${currentQuiz.length} (${percent}%)</div>
    <p>${percent >= 80 ? '🎉 Excellent! You know your particles well!' : percent >= 60 ? '👍 Good job! Keep practicing!' : '📚 Keep studying! Review the particles and try again.'}</p>
    <div class="stats-explanation" style="margin-top: 15px;">
      <h4>📖 How Scoring Worked</h4>
      <ul>
        <li>✓ 1st attempt correct → +1 point per particle & particle mastered</li>
        <li>✓ 2nd attempt correct → +0.5 points per particle (no mastery)</li>
        <li>📖 Used "Show Answer" → 0 points (no mastery)</li>
        <li>❌ Wrong both attempts → 0 points (no mastery)</li>
      </ul>
    </div>
    <button id="quizRestartBtn" class="action-btn">Take Another Quiz</button>
  `;
  
  const restartBtn = document.getElementById('quizRestartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      const quizArea = document.getElementById('quizArea');
      if (quizArea) {
        quizArea.innerHTML = '<p class="quiz-welcome">Select mode, sprint, and number of questions, then click "Start New Quiz"</p>';
      }
      resultsDiv.style.display = 'none';
    });
  }
}

// Tab switching
function switchTab(tabId) {
  currentParticleTab = tabId;
  
  const tabButtons = [tabStructureBtn, tabLearnBtn, tabParticlesBtn, tabPairsBtn, tabQuizBtn];
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
  
  if (tabId === 'structure') {
    renderStructureExamples();
    populateParticleReference();
  } else if (tabId === 'learn') {
    renderLearnTab();
  } else if (tabId === 'particles') {
    renderParticleDetails();
  } else if (tabId === 'pairs') {
    renderPairDetails();
  }
}

// Quiz mode toggle
if (quizEasyModeBtn) {
  quizEasyModeBtn.addEventListener('click', () => {
    quizMode = 'easy';
    quizEasyModeBtn.classList.add('active');
    quizHardModeBtn.classList.remove('active');
  });
}

if (quizHardModeBtn) {
  quizHardModeBtn.addEventListener('click', () => {
    quizMode = 'hard';
    quizHardModeBtn.classList.add('active');
    quizEasyModeBtn.classList.remove('active');
  });
}

// Furigana toggle
if (furiToggleBtn) {
  furiToggleBtn.addEventListener('click', () => {
    applyFuriganaHide();
  });
}

// Stats help icon
const statHelpIcon = document.getElementById('statHelpIcon');
if (statHelpIcon) {
  statHelpIcon.addEventListener('click', showStatsExplanation);
}

const closeStatsHelp = document.getElementById('closeStatsHelp');
if (closeStatsHelp) {
  closeStatsHelp.addEventListener('click', () => {
    const explanation = document.getElementById('quizStatsExplanation');
    if (explanation) explanation.style.display = 'none';
  });
}

// Event Listeners
if (sprintSelect) {
  sprintSelect.addEventListener('change', () => {
    if (currentParticleTab === 'particles') {
      renderParticleDetails();
    }
  });
}

const startQuizBtn = document.getElementById('startQuizBtn');
if (startQuizBtn) {
  startQuizBtn.addEventListener('click', () => {
    generateQuiz();
  });
}

// Reset All Progress button
const resetAllProgressBtn = document.getElementById('resetAllProgressBtn');
if (resetAllProgressBtn) {
  resetAllProgressBtn.addEventListener('click', resetAllProgress);
}

// Reset Mastered Only button
const resetMasteredOnlyBtn = document.getElementById('resetMasteredOnlyBtn');
if (resetMasteredOnlyBtn) {
  resetMasteredOnlyBtn.addEventListener('click', resetMasteredOnly);
}

if (tabStructureBtn) tabStructureBtn.addEventListener('click', () => switchTab('structure'));
if (tabLearnBtn) tabLearnBtn.addEventListener('click', () => switchTab('learn'));
if (tabParticlesBtn) tabParticlesBtn.addEventListener('click', () => switchTab('particles'));
if (tabPairsBtn) tabPairsBtn.addEventListener('click', () => switchTab('pairs'));
if (tabQuizBtn) tabQuizBtn.addEventListener('click', () => switchTab('quiz'));

// Initialize
function initParticles() {
  loadMasteredParticles();
  populateSprintDropdowns();
  renderStructureExamples();
  populateParticleReference();
  renderLearnTab();
  switchTab('structure');
  
  const totalParticles = particleOrder.length;
  const totalEls = document.querySelectorAll('#quizTotalParticles, #quizTotalParticles2');
  totalEls.forEach(el => {
    if (el) el.innerText = totalParticles;
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParticles);
} else {
  initParticles();
}