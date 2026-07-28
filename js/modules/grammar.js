// ==================== GRAMMAR MODULE ====================

let currentGrammarTab = "list";
let furiganaHidden = false;
let masteredGrammar = new Set();
let attemptedGrammar = new Set();
let currentQuiz = [];
let currentQuizIndex = 0;
let quizAnswers = [];
let quizActive = false;
let quizScore = 0;
let quizAttemptsRemaining = {};
let currentSearchTerm = "";

// DOM Elements
const furiToggleBtn = document.getElementById("furiToggleBtn");
const tabListBtn = document.getElementById("tabListBtn");
const tabLearnBtn = document.getElementById("tabLearnBtn");
const tabQuizBtn = document.getElementById("tabQuizBtn");
const tabMasteredBtn = document.getElementById("tabMasteredBtn");
const grammarSearchInput = document.getElementById("grammarSearchInput");
const startQuizBtn = document.getElementById("startQuizBtn");
const quizCountSelect = document.getElementById("quizCountSelect");
const quizArea = document.getElementById("quizArea");
const resultsDiv = document.getElementById("quizResults");
const quizRunningScore = document.getElementById("quizRunningScore");
const quizTotalPossible = document.getElementById("quizTotalPossible");
const quizMasteredCount = document.getElementById("quizMasteredCount");
const quizAttemptedCount = document.getElementById("quizAttemptedCount");
const quizTotalGrammar = document.getElementById("quizTotalGrammar");
const quizTotalGrammar2 = document.getElementById("quizTotalGrammar2");
const masteredCountSpan = document.getElementById("masteredCount");
const totalCountSpan = document.getElementById("totalCount");
const resetAllProgressBtn = document.getElementById("resetAllProgressBtn");
const resetMasteredOnlyBtn = document.getElementById("resetMasteredOnlyBtn");
const statHelpIcon = document.getElementById("statHelpIcon");
const closeStatsHelp = document.getElementById("closeStatsHelp");
const quizStatsExplanation = document.getElementById("quizStatsExplanation");

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

// Strip furigana for comparison and audio
function stripFurigana(text) {
  if (!text) return "";
  return text.replace(/[（(][^）)]*[）)]/g, "");
}

// ===== HELPER: Display sentence with furigana AND highlighted particles =====
function displaySentenceWithFuriganaAndParticles(sentence) {
  if (!sentence) return "";

  let result = "";

  // Step 1: Get the sentence with furigana using existing function
  if (
    typeof getWordMeaningsForSentence === "function" &&
    typeof createQuizWordTooltips === "function"
  ) {
    const wordMeanings = getWordMeaningsForSentence({ jp: sentence });
    if (wordMeanings && wordMeanings.length > 0) {
      if (furiganaHidden) {
        const cleanSentence = sentence.replace(/[（(][^）)]*[）)]/g, "").trim();
        const cleanWordMeanings = getWordMeaningsForSentence({
          jp: cleanSentence,
        });
        result = createQuizWordTooltips(cleanSentence, cleanWordMeanings);
      } else {
        result = createQuizWordTooltips(sentence, wordMeanings);
      }
    } else {
      result = addFuriganaToText(sentence);
    }
  } else {
    result = addFuriganaToText(sentence);
  }

  // Step 2: Highlight ALL particles
  const particles = [
    "は",
    "が",
    "を",
    "に",
    "へ",
    "で",
    "と",
    "も",
    "か",
    "よ",
    "ね",
    "から",
    "まで",
    "より",
    "くらい",
    "ごろ",
    "だけ",
    "ほど",
    "の",
    "や",
  ];

  for (const particle of particles) {
    const regex = new RegExp(`(${particle})(?![^<]*>|[^<]*<\\/rt>)`, "g");
    result = result.replace(regex, '<span class="particle">$1</span>');
  }

  return result;
}

// ===== HELPER: Display sentence with proper furigana handling (legacy) =====
function displaySentenceWithFurigana(sentence) {
  if (!sentence) return "";
  if (
    typeof getWordMeaningsForSentence === "function" &&
    typeof createQuizWordTooltips === "function"
  ) {
    const wordMeanings = getWordMeaningsForSentence({ jp: sentence });
    if (wordMeanings && wordMeanings.length > 0) {
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
  return addFuriganaToText(sentence);
}

function loadMasteredGrammar() {
  const stored = localStorage.getItem("masteredGrammar");
  if (stored) {
    masteredGrammar = new Set(JSON.parse(stored));
  }
  const storedAttempted = localStorage.getItem("attemptedGrammar");
  if (storedAttempted) {
    attemptedGrammar = new Set(JSON.parse(storedAttempted));
  }
  updateMasteredCount();
}

function saveMasteredGrammar() {
  localStorage.setItem("masteredGrammar", JSON.stringify([...masteredGrammar]));
  localStorage.setItem(
    "attemptedGrammar",
    JSON.stringify([...attemptedGrammar]),
  );
  updateMasteredCount();
}

function updateMasteredCount() {
  const total = grammarOrder ? grammarOrder.length : 0;
  const mastered = masteredGrammar.size;
  const attempted = attemptedGrammar.size;
  if (masteredCountSpan) masteredCountSpan.innerText = mastered;
  if (totalCountSpan) totalCountSpan.innerText = total;

  if (quizMasteredCount) quizMasteredCount.innerText = mastered;
  if (quizAttemptedCount) quizAttemptedCount.innerText = attempted;
  if (quizTotalGrammar) quizTotalGrammar.innerText = total;
  if (quizTotalGrammar2) quizTotalGrammar2.innerText = total;
}

function markGrammarMastered(grammarId, isFirstAttempt = true) {
  if (isFirstAttempt && !masteredGrammar.has(grammarId)) {
    masteredGrammar.add(grammarId);
  }
  if (!attemptedGrammar.has(grammarId)) {
    attemptedGrammar.add(grammarId);
  }
  saveMasteredGrammar();
  renderGrammarList();
  renderMasteredList();
}

function unmarkGrammarMastered(grammarId) {
  masteredGrammar.delete(grammarId);
  saveMasteredGrammar();
  renderGrammarList();
  renderMasteredList();
}

function applyFuriganaHide() {
  furiganaHidden = !furiganaHidden;
  if (furiToggleBtn) {
    furiToggleBtn.innerText = furiganaHidden
      ? "🔤 Furigana On"
      : "🔤 Furigana Off";
  }
  renderGrammarList();
  renderLearnTab();
  renderMasteredList();
  if (quizActive && currentQuiz.length > 0) {
    renderQuizQuestion();
  }
}

// ===== RENDER GRAMMAR LIST =====
function renderGrammarList() {
  const container = document.getElementById("grammarList");
  if (!container) return;

  let filteredGrammar = [...grammarData];

  if (currentSearchTerm) {
    const searchLower = currentSearchTerm.toLowerCase();
    filteredGrammar = filteredGrammar.filter(
      (g) =>
        g.pattern.toLowerCase().includes(searchLower) ||
        g.meaning.toLowerCase().includes(searchLower) ||
        (g.explanation && g.explanation.toLowerCase().includes(searchLower)),
    );
  }

  let html = "";

  for (const grammar of filteredGrammar) {
    const isMastered = masteredGrammar.has(grammar.id);

    let examplesHtml = "";
    if (grammar.examples && grammar.examples.length > 0) {
      for (const ex of grammar.examples) {
        let displayJp = displaySentenceWithFuriganaAndParticles(ex.sentence);
        const reading = stripFurigana(ex.sentence);

        examplesHtml += `
                    <div class="example-item" data-reading="${reading}">
                        <div class="example-jp">${displayJp}</div>
                        <div class="example-trans">→ ${ex.english}</div>
                        <button class="small-btn example-tts-btn" style="margin-top: 6px; font-size: 0.7rem; background: #6c8b6b; color: white; border: none; padding: 2px 12px; border-radius: 20px; cursor: pointer;" data-reading="${reading}">🔊 Listen</button>
                    </div>
                `;
      }
    }

    html += `
            <div class="grammar-card ${isMastered ? "mastered" : ""}" data-grammar-id="${grammar.id}">
                <div class="grammar-header-card">
                    <div>
                        <span class="grammar-pattern">${grammar.pattern}</span>
                        ${isMastered ? '<span class="mastered-badge">✓ Mastered</span>' : ""}
                    </div>
                    <div>
                        <span class="grammar-meaning">${grammar.meaning}</span>
                    </div>
                </div>
                
                <div class="grammar-explanation">
                    📖 ${grammar.explanation}
                </div>
                
                <div class="grammar-examples">
                    <h4>📝 Example Sentences</h4>
                    ${examplesHtml || '<p style="color: #999; font-style: italic;">No example sentences available.</p>'}
                </div>
                
                <button class="small-btn mark-mastered-btn" data-grammar-id="${grammar.id}">
                    ${isMastered ? "✓ Mastered" : "✓ Mark as Mastered"}
                </button>
            </div>
        `;
  }

  if (filteredGrammar.length === 0) {
    html =
      '<p style="text-align: center; padding: 40px;">No grammar points match your search.</p>';
  }

  container.innerHTML = html;

  document.querySelectorAll(".example-item").forEach((el) => {
    const reading = el.dataset.reading;
    if (reading) {
      el.addEventListener("click", (e) => {
        if (
          e.target.closest(".example-tts-btn") ||
          e.target.closest(".tooltip-text") ||
          e.target.closest(".word-tooltip")
        )
          return;
        if (typeof speakText === "function") {
          speakText(reading);
        } else if (typeof window.speakText === "function") {
          window.speakText(reading);
        }
      });
      const ttsBtn = el.querySelector(".example-tts-btn");
      if (ttsBtn) {
        ttsBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const btnReading = ttsBtn.dataset.reading || reading;
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
      const grammarId = btn.dataset.grammarId;
      if (masteredGrammar.has(grammarId)) {
        unmarkGrammarMastered(grammarId);
      } else {
        markGrammarMastered(grammarId, true);
      }
    });
  });

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

  const masteredIds = [...masteredGrammar];

  if (masteredIds.length === 0) {
    container.innerHTML =
      '<p class="empty-message">No grammar points mastered yet. Complete a quiz to master them!</p>';
    return;
  }

  let html = "";
  for (const grammarId of masteredIds) {
    const grammar = getGrammarById(grammarId);
    if (grammar) {
      html += `
                <div class="mastered-grammar-item">
                    <div>
                        <span class="mastered-grammar-pattern">${grammar.pattern}</span>
                        <span class="mastered-grammar-meaning">${grammar.meaning}</span>
                    </div>
                    <button class="unmaster-btn" data-grammar-id="${grammar.id}">Remove</button>
                </div>
            `;
    }
  }

  container.innerHTML = html;

  document.querySelectorAll(".unmaster-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const grammarId = btn.dataset.grammarId;
      unmarkGrammarMastered(grammarId);
    });
  });
}

// ===== RENDER LEARN TAB - COMPLETE =====
function renderLearnTab() {
  const container = document.getElementById("learnContent");
  if (!container) return;

  const content = `
    <div class="learn-container" style="background: #ffffff; border-radius: 20px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e8e0d5;">
      
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 4px;">
        <h2 style="color: #000000; font-weight: 700; font-size: 1.5rem; margin: 0;">📖 Grammar Guide · N5 Japanese</h2>
        <button onclick="printLesson()" style="background: #6c8b6b; color: white; border: none; padding: 8px 20px; border-radius: 40px; cursor: pointer; font-size: 0.9rem; font-weight: 500; font-family: inherit; transition: background 0.2s, transform 0.1s;" onmouseover="this.style.background='#5a7a59'" onmouseout="this.style.background='#6c8b6b'">🖨️ Print Lesson</button>
      </div>
      <p style="color: #444444; font-weight: 400; margin-bottom: 24px;">A concise overview of essential N5 grammar patterns</p>
      
      <!-- SECTION 1: Basic Sentence Structure -->
      <div class="learn-section" style="margin-bottom: 28px;">
        <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">1. 文（ぶん）の 基本構造（きほんこうぞう） / Basic Sentence Structure</h3>
        <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
          日本語（にほんご）の 文（ぶん）は <strong>SOV (主語＋目的語＋動詞）</strong> の 順序（じゅんじょ）です。
        </p>
        <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
          <em>Japanese sentences follow <strong>SOV (Subject-Object-Verb)</strong> order.</em>
        </p>
        
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('わたし は りんご を たべます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('わたし は りんご を たべます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">私（わたし）は りんご <strong>を</strong> 食（た）べます。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I eat an apple.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">です (desu) - Copula "to be"</h4>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('わたし は がくせい です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('わたし は がくせい です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">私（わたし）は 学生（がくせい）<strong>です</strong>。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I am a student.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">あります / います - Existence "there is/are"</h4>
        <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
          <div style="font-size: 1rem; color: #000000; font-weight: 400;">
            <strong>ルール / Rule:</strong> あります = 物（もの） (inanimate objects) &nbsp;|&nbsp; います = 人（ひと）・動物（どうぶつ） (people/animals)
          </div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('つくえ が あります')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('つくえ が あります');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">机（つくえ）が <strong>あります</strong>。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">There is a desk.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('いぬ が います')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('いぬ が います');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">犬（いぬ）が <strong>います</strong>。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">There is a dog.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
      </div>
      
      <!-- SECTION 2: Essential Particles (Quick Reference) -->
      <div class="learn-section" style="margin-bottom: 28px;">
        <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">2. 助詞（じょし）の 基本 / Essential Particles (Quick Reference)</h3>
        <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
          <em>For detailed explanations, visit the <strong>Particles</strong> module. Here's a quick reference:</em>
        </p>
        
        <div style="overflow-x: auto; margin-bottom: 16px;">
          <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
            <thead>
              <tr style="background: #e8e0d5;">
                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">助詞（じょし）<br><span style="font-weight: 400; font-size: 0.8rem;">Particle</span></th>
                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">役割（やくわり）<br><span style="font-weight: 400; font-size: 0.8rem;">Role</span></th>
                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">例（れい）<br><span style="font-weight: 400; font-size: 0.8rem;">Example</span></th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">は (wa)</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">トピック / Topic</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">私（わたし）<strong>は</strong> 学生（がくせい）です</td>
              </tr>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">が (ga)</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">主語（しゅご）/ Subject</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">犬（いぬ）<strong>が</strong> 走（はし）ります</td>
              </tr>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">を (wo)</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">目的語（もくてきご）/ Object</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">本（ほん）<strong>を</strong> 読（よ）みます</td>
              </tr>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">に (ni)</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">目的地（もくてきち）/ 時間（じかん）</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">学校（がっこう）<strong>に</strong> 行（い）きます</td>
              </tr>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">で (de)</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">場所（ばしょ）/ 手段（しゅだん）</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">学校（がっこう）<strong>で</strong> 勉強（べんきょう）します</td>
              </tr>
              <tr>
                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">の (no)</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">所有（しょゆう）/ Possession</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">私（わたし）<strong>の</strong> 車（くるま）</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="background: #fff3e0; border-radius: 12px; padding: 12px 16px; border-left: 4px solid #ff9800;">
          <div style="font-size: 0.9rem; color: #856404; font-weight: 400;">
            💡 <strong>覚（おぼ）え方（かた） / Memory Tip:</strong> は = "as for", が = "the one that", を = "action done to", に = "toward", で = "at/by", の = "of"
          </div>
        </div>
      </div>
      
      <!-- SECTION 3: Verb Conjugations (Quick Reference) -->
      <div class="learn-section" style="margin-bottom: 28px;">
        <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">3. 動詞（どうし）の 活用（かつよう） / Verb Conjugations (Quick Reference)</h3>
        <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
          <em>For detailed explanations, visit the <strong>Verbs</strong> module. Here's a quick reference:</em>
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
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">現在（げんざい）<br><span style="font-size: 0.8rem;">Present</span></td>
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
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">過去否定（かこひてい）<br><span style="font-size: 0.8rem;">Past Negative</span></td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">〜ませんでした</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">食（た）べませんでした</td>
              </tr>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">て形（けい）<br><span style="font-size: 0.8rem;">Te-form</span></td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Verb-specific</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">食（た）べて</td>
              </tr>
              <tr>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">〜ている<br><span style="font-size: 0.8rem;">Ongoing/State</span></td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">て-form + います</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">食（た）べて います</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- SECTION 4: Adjective Conjugations (Quick Reference) -->
      <div class="learn-section" style="margin-bottom: 28px;">
        <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">4. 形容詞（けいようし）の 活用（かつよう） / Adjective Conjugations (Quick Reference)</h3>
        <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
          <em>For detailed explanations, visit the <strong>Adjectives</strong> module. Here's a quick reference:</em>
        </p>
        
        <div style="overflow-x: auto; margin-bottom: 16px;">
          <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
            <thead>
              <tr style="background: #e8e0d5;">
                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">形（けい）<br><span style="font-weight: 400; font-size: 0.8rem;">Form</span></th>
                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">い-形容詞<br><span style="font-weight: 400; font-size: 0.8rem;">i-Adjective</span></th>
                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">な-形容詞<br><span style="font-weight: 400; font-size: 0.8rem;">na-Adjective</span></th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">現在（げんざい）<br><span style="font-size: 0.8rem;">Present</span></td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">暑（あつ）い です</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">静（しず）か です</td>
              </tr>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">過去（かこ）<br><span style="font-size: 0.8rem;">Past</span></td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">暑（あつ）かった です</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">静（しず）か でした</td>
              </tr>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">否定（ひてい）<br><span style="font-size: 0.8rem;">Negative</span></td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">暑（あつ）くない です</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">静（しず）かじゃない です</td>
              </tr>
              <tr>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">過去否定（かこひてい）<br><span style="font-size: 0.8rem;">Past Negative</span></td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">暑（あつ）くなかった です</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">静（しず）かじゃなかった です</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- SECTION 5: Time & Frequency -->
      <div class="learn-section" style="margin-bottom: 28px;">
        <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">5. 時（とき）と 頻度（ひんど） / Time &amp; Frequency</h3>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">時間（じかん）の 表現（ひょうげん） / Time Expressions</h4>
        <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
          <div style="font-size: 1rem; color: #000000; font-weight: 400;">
            <strong>ルール / Rule:</strong> 特定（とくてい）の 時間（じかん） + <strong>に</strong>
          </div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('ろくじ に おきます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('ろくじ に おきます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">6時（じ）<strong>に</strong> 起（お）きます。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I wake up at 6 o'clock.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        <div style="background: #f8d7da; border-radius: 12px; padding: 12px 16px; margin-bottom: 12px; border-left: 4px solid #dc3545;">
          <div style="font-size: 0.9rem; color: #721c24; font-weight: 400;">
            ⚠️ <strong>注意（ちゅうい） / Note:</strong> 今日（きょう）, 明日（あした）, 毎日（まいにち） は <strong>に</strong> を 使（つか）いません。
          </div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">から / まで - "From" / "Until"</h4>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('くじ から ごじ まで べんきょうします')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('くじ から ごじ まで べんきょうします');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">9時（じ）<strong>から</strong> 5時（じ）<strong>まで</strong> 勉強（べんきょう）します。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I study from 9 to 5.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
      </div>
      
      <!-- SECTION 6: Question Formation -->
      <div class="learn-section" style="margin-bottom: 28px;">
        <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">6. 疑問文（ぎもんぶん） / Question Formation</h3>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">か - Question Particle</h4>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('がくせい です か')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('がくせい です か');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">学生（がくせい）です<strong>か</strong>？</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Are you a student?</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">疑問詞（ぎもんし） / Question Words</h4>
        <div style="overflow-x: auto; margin-bottom: 16px;">
          <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
            <thead>
              <tr style="background: #e8e0d5;">
                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">疑問詞（ぎもんし）<br><span style="font-weight: 400; font-size: 0.8rem;">Question Word</span></th>
                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">意味（いみ）<br><span style="font-weight: 400; font-size: 0.8rem;">Meaning</span></th>
                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">例（れい）<br><span style="font-weight: 400; font-size: 0.8rem;">Example</span></th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">何（なに/なん）</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">what</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('なに を たべます か')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('なに を たべます か');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">何（なに）を 食（た）べます か？🔊</td>
              </tr>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">誰（だれ）</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">who</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('だれ が きます か')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('だれ が きます か');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">誰（だれ）が 来（き）ます か？🔊</td>
              </tr>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">どこ</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">where</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('どこ に いきます か')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('どこ に いきます か');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">どこ に 行（い）きます か？🔊</td>
              </tr>
              <tr>
                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">いくら</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">how much</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('いくら です か')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('いくら です か');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">いくら です か？🔊</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- SECTION 7: Connecting Sentences -->
      <div class="learn-section" style="margin-bottom: 28px;">
        <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">7. 文（ぶん）を つなぐ / Connecting Sentences</h3>
        
        <div style="overflow-x: auto; margin-bottom: 16px;">
          <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
            <thead>
              <tr style="background: #e8e0d5;">
                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">接続詞（せつぞくし）<br><span style="font-weight: 400; font-size: 0.8rem;">Connector</span></th>
                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">意味（いみ）<br><span style="font-weight: 400; font-size: 0.8rem;">Meaning</span></th>
                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">例（れい）<br><span style="font-weight: 400; font-size: 0.8rem;">Example</span></th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">そして</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">and then / and</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('あさごはん を たべて、そして がっこう に いきます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('あさごはん を たべて、そして がっこう に いきます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">朝ごはんを食べて、<strong>そして</strong> 学校に行きます。🔊</td>
              </tr>
              <tr style="border-bottom: 1px solid #e8e0d5;">
                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">でも</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">but</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('にほんご は むずかしい です。でも おもしろい です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('にほんご は むずかしい です。でも おもしろい です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">日本語は難しいです。<strong>でも</strong>、面白いです。🔊</td>
              </tr>
              <tr>
                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">それから</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">after that</td>
                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('しゅくだい を します。それから テレビ を みます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('しゅくだい を します。それから テレビ を みます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">宿題をします。<strong>それから</strong>、テレビを見ます。🔊</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- SECTION 8: Invitations & Suggestions -->
      <div class="learn-section" style="margin-bottom: 28px;">
        <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">8. 誘（さそ）い / Invitations &amp; Suggestions</h3>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">～ませんか - "Would you like to...?"</h4>
        <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
          <div style="font-size: 1rem; color: #000000; font-weight: 400;">
            <strong>ルール / Rule:</strong> ます → ませんか
          </div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('いっしょ に えいが を みません か')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('いっしょ に えいが を みません か');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">一緒（いっしょ）に 映画（えいが）を 見（み）<strong>ませんか</strong>？</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Would you like to watch a movie together?</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">～ましょう - "Let's..."</h4>
        <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
          <div style="font-size: 1rem; color: #000000; font-weight: 400;">
            <strong>ルール / Rule:</strong> ます → ましょう
          </div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('いっしょ に べんきょう しましょう')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('いっしょ に べんきょう しましょう');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">一緒（いっしょ）に 勉強（べんきょう）<strong>しましょう</strong>。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Let's study together.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        <div style="background: #fff3e0; border-radius: 12px; padding: 12px 16px; border-left: 4px solid #ff9800;">
          <div style="font-size: 0.9rem; color: #856404; font-weight: 400;">
            💡 <strong>違い（ちがい） / Difference:</strong> ませんか = 相手（あいて）に 尋（たず）ねる (asking someone) &nbsp;|&nbsp; ましょう = みんなで する (doing together as a group)
          </div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">～ましょうか - "Shall I...?" (Offering)</h4>
        <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
          <div style="font-size: 1rem; color: #000000; font-weight: 400;">
            <strong>ルール / Rule:</strong> ます → ましょうか (offering to do for someone)
          </div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('にもつ を もちましょうか')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('にもつ を もちましょうか');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">荷物（にもつ）を 持（も）ち<strong>ましょうか</strong>。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Shall I carry your luggage?</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('まど を あけましょうか')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('まど を あけましょうか');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">窓（まど）を 開（あ）け<strong>ましょうか</strong>。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Shall I open the window?</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
      </div>
      
      <!-- SECTION 9: Expressing Obligation & Possibility -->
      <div class="learn-section" style="margin-bottom: 28px;">
        <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">9. 義務（ぎむ）と 可能性（かのうせい） / Expressing Obligation &amp; Possibility</h3>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">〜なければならない - "Must / Have to"</h4>
        <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
          <div style="font-size: 1rem; color: #000000; font-weight: 400;">
            <strong>ルール / Rule:</strong> Verb (ない-form) + なければならない
          </div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('まいにち にほんご を べんきょうしなければならない')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('まいにち にほんご を べんきょうしなければならない');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">毎日（まいにち）日本語（にほんご）を 勉強（べんきょう）し<strong>なければならない</strong>。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I must study Japanese every day.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">〜かもしれない - "Might / Maybe"</h4>
        <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
          <div style="font-size: 1rem; color: #000000; font-weight: 400;">
            <strong>ルール / Rule:</strong> Verb (plain form) + かもしれない
          </div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('あした は あめ が ふる かもしれない')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('あした は あめ が ふる かもしれない');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">明日（あした）は 雨（あめ）が 降（ふ）る<strong>かもしれない</strong>。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">It might rain tomorrow.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('かれ は こない かもしれない')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('かれ は こない かもしれない');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">彼（かれ）は 来（こ）ない<strong>かもしれない</strong>。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">He might not come.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
      </div>
      
      <!-- SECTION 10: Additional N5 Grammar Patterns -->
      <div class="learn-section" style="margin-bottom: 28px;">
        <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">10. N5 の その他（ほか）の 文法（ぶんぽう）パターン / Additional N5 Grammar Patterns</h3>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">〜おく - "To do in advance" (Preparatory)</h4>
        <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
          <div style="font-size: 1rem; color: #000000; font-weight: 400;">
            <strong>ルール / Rule:</strong> Verb (te-form) + おく
          </div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('あしたのしけんのためにべんきょうしておく')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('あしたのしけんのためにべんきょうしておく');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">明日（あした）の試験（しけん）のために、勉強（べんきょう）して<strong>おく</strong>。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I'll study in advance for tomorrow's exam.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">〜とか - "Things like..." (Listing examples)</h4>
        <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
          <div style="font-size: 1rem; color: #000000; font-weight: 400;">
            <strong>ルール / Rule:</strong> NounA + とか + NounB + とか
          </div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('りんご とか バナナ とか が すき です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('りんご とか バナナ とか が すき です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">りんご<strong>とか</strong> バナナ<strong>とか</strong> が 好（す）きです。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I like things like apples and bananas.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">〜やすい / 〜にくい - "Easy/Hard to do"</h4>
        <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
          <div style="font-size: 1rem; color: #000000; font-weight: 400;">
            <strong>ルール / Rule:</strong> Verb (stem) + やすい (easy) / にくい (hard)
          </div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('この ほん は よみやすい です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('この ほん は よみやすい です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">この 本（ほん）は 読（よ）み<strong>やすい</strong>です。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">This book is easy to read.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('かんじ は おぼえにくい です')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('かんじ は おぼえにくい です');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">漢字（かんじ）は 覚（おぼ）え<strong>にくい</strong>です。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Kanji are hard to memorize.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">〜について - "About, concerning"</h4>
        <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
          <div style="font-size: 1rem; color: #000000; font-weight: 400;">
            <strong>ルール / Rule:</strong> Noun + について
          </div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('にほん に ついて はなしましょう')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('にほん に ついて はなしましょう');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">日本（にほん）<strong>について</strong> 話（はな）しましょう。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">Let's talk about Japan.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">〜にとって - "For / From the perspective of"</h4>
        <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
          <div style="font-size: 1rem; color: #000000; font-weight: 400;">
            <strong>ルール / Rule:</strong> Noun + にとって
          </div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('わたし に とって にほんご は むずかしい')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('わたし に とって にほんご は むずかしい');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">私（わたし）<strong>にとって</strong>、日本語（にほんご）は 難（むずか）しいです。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">For me, Japanese is difficult.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">〜として - "As / In the capacity of"</h4>
        <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
          <div style="font-size: 1rem; color: #000000; font-weight: 400;">
            <strong>ルール / Rule:</strong> Noun + として
          </div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('せんせい と して せいと を しどうします')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('せんせい と して せいと を しどうします');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">先生（せんせい）<strong>として</strong>、生徒（せいと）を 指導（しどう）します。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">I guide students as a teacher.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">〜によって - "By / Depending on"</h4>
        <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
          <div style="font-size: 1rem; color: #000000; font-weight: 400;">
            <strong>ルール / Rule:</strong> Noun + によって
          </div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('ひと に よって かんがえかた が ちがいます')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('ひと に よって かんがえかた が ちがいます');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">人（ひと）<strong>によって</strong> 考（かんが）え方（かた）が 違（ちが）います。</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">People have different ways of thinking.</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
        
        <h4 style="color: #000000; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">〜という - "Called / Named"</h4>
        <div style="background: #f5f5f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
          <div style="font-size: 1rem; color: #000000; font-weight: 400;">
            <strong>ルール / Rule:</strong> Noun + という + Noun
          </div>
        </div>
        <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('さくら と いう はな')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('さくら と いう はな');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
          <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">「桜（さくら）」<strong>という</strong> 花（はな）</div>
          <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">A flower called "Sakura"</div>
          <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
        </div>
      </div>
      
      <!-- SECTION 11: Common Mistakes -->
      <div class="learn-section" style="margin-bottom: 28px;">
        <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">11. よくある 間違（まちが）い / Common Mistakes</h3>
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
      
      <!-- ============================================================
           SECTION 12: SUMMARY BOX ← THIS WAS MISSING!
           ============================================================ -->
      <div style="background: #e8f0e7; border-radius: 16px; padding: 20px; margin-top: 24px; border-left: 4px solid #6c8b6b;">
        <h4 style="color: #000000; font-weight: 700; font-size: 1.1rem; margin-bottom: 12px;">📌 まとめ / Summary</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px;">
          <div style="color: #000000; font-weight: 500;">✅ 文（ぶん）の 構造（こうぞう）<br><span style="font-weight: 400; font-size: 0.85rem;">Sentence Structure</span></div>
          <div style="color: #000000; font-weight: 400;">SOV: 私（わたし）は りんごを 食（た）べます</div>
          <div style="color: #000000; font-weight: 500;">✅ 助詞（じょし）<br><span style="font-weight: 400; font-size: 0.85rem;">Particles</span></div>
          <div style="color: #000000; font-weight: 400;">は, が, を, に, で, の</div>
          <div style="color: #000000; font-weight: 500;">✅ 動詞（どうし）の 活用（かつよう）<br><span style="font-weight: 400; font-size: 0.85rem;">Verb Conjugations</span></div>
          <div style="color: #000000; font-weight: 400;">ます, ました, ません, ませんでした, て-form</div>
          <div style="color: #000000; font-weight: 500;">✅ 形容詞（けいようし）の 活用（かつよう）<br><span style="font-weight: 400; font-size: 0.85rem;">Adjective Conjugations</span></div>
          <div style="color: #000000; font-weight: 400;">い-adj: 暑（あつ）い / な-adj: 静（しず）か</div>
          <div style="color: #000000; font-weight: 500;">✅ 質問（しつもん）<br><span style="font-weight: 400; font-size: 0.85rem;">Questions</span></div>
          <div style="color: #000000; font-weight: 400;">か, 何（なに）, 誰（だれ）, どこ, いくら</div>
          <div style="color: #000000; font-weight: 500;">✅ 接続（せつぞく）<br><span style="font-weight: 400; font-size: 0.85rem;">Connectors</span></div>
          <div style="color: #000000; font-weight: 400;">そして, でも, それから</div>
          <div style="color: #000000; font-weight: 500;">✅ 誘（さそ）い<br><span style="font-weight: 400; font-size: 0.85rem;">Invitations</span></div>
          <div style="color: #000000; font-weight: 400;">～ませんか, ～ましょう, ～ましょうか</div>
          <div style="color: #000000; font-weight: 500;">✅ 義務（ぎむ）と 可能性（かのうせい）<br><span style="font-weight: 400; font-size: 0.85rem;">Obligation &amp; Possibility</span></div>
          <div style="color: #000000; font-weight: 400;">〜なければならない, 〜かもしれない</div>
          <div style="color: #000000; font-weight: 500;">✅ その他（ほか）の パターン<br><span style="font-weight: 400; font-size: 0.85rem;">Other Patterns</span></div>
          <div style="color: #000000; font-weight: 400;">〜おく, 〜とか, 〜やすい/にくい, 〜について, 〜にとって, 〜として, 〜によって, 〜という</div>
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

  // Re-apply furigana hide state
  if (furiganaHidden) {
    container.querySelectorAll("rt").forEach((rt) => {
      rt.style.display = "none";
    });
  } else {
    container.querySelectorAll("rt").forEach((rt) => {
      rt.style.display = "";
    });
  }
}

// ==================== QUIZ FUNCTIONS ====================

function generateQuiz() {
  console.log("generateQuiz called!");

  const questionCount = parseInt(quizCountSelect.value);
  const allQuestions = [];

  // Collect all questions from all grammar points
  for (const grammar of grammarData) {
    for (const q of grammar.questions) {
      allQuestions.push({
        sentence: q.sentence,
        correctAnswer: q.correctAnswer,
        options: [...q.options],
        explanation: q.explanation || grammar.explanation,
        grammarId: grammar.id,
        grammarPattern: grammar.pattern,
        grammarMeaning: grammar.meaning,
        reading: q.sentence.replace(/[（(][^）)]*[）)]/g, "").trim(),
      });
    }
  }

  if (allQuestions.length === 0) {
    if (quizArea) {
      quizArea.innerHTML =
        '<p class="quiz-welcome" style="color: red;">No questions available for quiz.</p>';
    }
    return;
  }

  // Shuffle all questions
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

function updateQuizStatsDisplay() {
  const totalPossible = currentQuiz.length;
  if (quizRunningScore) quizRunningScore.innerText = quizScore.toFixed(1);
  if (quizTotalPossible) quizTotalPossible.innerText = totalPossible;
  updateMasteredCount();
}

function renderQuizQuestion() {
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

  let sentenceDisplay = displaySentenceWithFuriganaAndParticles(q.sentence);

  let html = `
        <div class="quiz-header-info">
            <span style="font-weight: bold;">Question ${currentQuizIndex + 1} / ${currentQuiz.length}</span>
            <span style="color: #6c8b6b;">⭐ Score: ${quizScore.toFixed(1)}</span>
            <span style="color: #c45d1e;">❤️ Attempts: ${attemptsLeft}</span>
            ${reading ? `<button class="quiz-tts-btn" data-reading="${reading}" style="margin-left: 8px; background: #6c8b6b; color: white; border: none; padding: 4px 14px; border-radius: 30px; cursor: pointer; font-size: 0.85rem;">🔊 Listen</button>` : ""}
        </div>
        <div id="quizFeedbackArea"></div>
        <div style="background: #f9fcff; border-radius: 20px; padding: 20px; margin-bottom: 16px;">
            <div class="quiz-sentence" style="font-size: 1.3rem; text-align: center; margin-bottom: 20px; cursor: pointer;" data-reading="${reading}">${sentenceDisplay}</div>
            <div class="quiz-options" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 16px 0;">
    `;

  const shuffledOptions = [...q.options];
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [
      shuffledOptions[j],
      shuffledOptions[i],
    ];
  }

  for (const opt of shuffledOptions) {
    const isSelected = currentAnswer && currentAnswer.selected === opt;
    html += `
            <button class="quiz-option-btn ${isSelected ? "selected" : ""}" data-answer="${opt}" style="background: ${isSelected ? "#9c27b0" : "#fff"}; color: ${isSelected ? "#fff" : "#333"}; border: 2px solid #9c27b0; border-radius: 60px; padding: 12px 24px; font-size: 1rem; cursor: pointer;">
                ${addFuriganaToText(opt)}
            </button>
        `;
  }

  html += `
            </div>
            <div class="quiz-nav">
                <button id="quizSubmitBtn" style="background: #1a2b4c; color: white; border: none; padding: 10px 22px; border-radius: 40px; cursor: pointer; font-size: 0.9rem;">✅ Check Answer</button>
                <button id="quizShowAnswerBtn" style="background: #ffc107; border: none; padding: 10px 22px; border-radius: 40px; cursor: pointer; font-size: 0.9rem;">📖 Show Answer</button>
                <button id="quizStopBtn" style="background: #dc3545; color: white; border: none; padding: 10px 22px; border-radius: 40px; cursor: pointer; font-size: 0.9rem;">⏹️ Stop Quiz</button>
                <button id="quizResetBtn" style="background: #6c757d; color: white; border: none; padding: 10px 22px; border-radius: 40px; cursor: pointer; font-size: 0.9rem;">🔄 Reset Quiz</button>
                <button id="quizSkipBtn" style="background: #17a2b8; color: white; border: none; padding: 10px 22px; border-radius: 40px; cursor: pointer; font-size: 0.9rem;">⏭️ Skip</button>
            </div>
        </div>
    `;

  quizArea.innerHTML = html;

  // ===== TTS SUPPORT =====
  const ttsBtn = quizArea.querySelector(".quiz-tts-btn");
  if (ttsBtn) {
    const btnReading = ttsBtn.dataset.reading || reading;
    ttsBtn.addEventListener("click", function (e) {
      e.stopPropagation();
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

  if (typeof attachQuizTooltipsGlobal === "function") {
    setTimeout(attachQuizTooltipsGlobal, 50);
  } else if (typeof attachQuizTooltips === "function") {
    setTimeout(attachQuizTooltips, 50);
  } else if (typeof attachTooltipLongPress === "function") {
    setTimeout(() => attachTooltipLongPress(quizArea), 50);
  }

  document.querySelectorAll(".quiz-option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".quiz-option-btn").forEach((b) => {
        b.style.background = "#fff";
        b.style.color = "#333";
        b.classList.remove("selected");
      });
      btn.style.background = "#9c27b0";
      btn.style.color = "#fff";
      btn.classList.add("selected");
      const selectedAnswer = btn.dataset.answer;
      if (!quizAnswers[currentQuizIndex]) quizAnswers[currentQuizIndex] = {};
      quizAnswers[currentQuizIndex].selected = selectedAnswer;
    });
  });

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
  return str.replace(/\s+/g, "").trim();
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
                <div class="quiz-feedback incorrect">
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
      markGrammarMastered(q.grammarId, true);
    } else {
      pointsEarned = 0.5;
    }
    quizScore += pointsEarned;

    if (!attemptedGrammar.has(q.grammarId)) {
      attemptedGrammar.add(q.grammarId);
      saveMasteredGrammar();
    }

    updateQuizStatsDisplay();

    let sentenceDisplay = displaySentenceWithFuriganaAndParticles(q.sentence);

    const feedbackHtml = `
            <div class="quiz-feedback correct">
                ✅ ${isFirstAttempt ? "Correct! +1 point" : "Correct on 2nd try! +0.5 points"}
                <div style="margin-top: 8px; font-size: 0.85rem;">${sentenceDisplay}</div>
                <div class="quiz-explanation">📖 ${q.explanation}</div>
            </div>
            <div style="text-align: center; margin-top: 12px;">
                <button id="quizNextBtn" style="background: #1a2b4c; color: white; border: none; padding: 8px 24px; border-radius: 40px; cursor: pointer;">Next →</button>
            </div>
        `;

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
                    <div class="quiz-feedback incorrect">
                        ❌ Incorrect. You have ${quizAttemptsRemaining[currentQuizIndex]} attempt(s) left.
                    </div>
                `;
      }
      quizAnswers[currentQuizIndex] = null;
      document.querySelectorAll(".quiz-option-btn").forEach((btn) => {
        btn.style.background = "#fff";
        btn.style.color = "#333";
        btn.classList.remove("selected");
      });
    } else {
      let sentenceDisplay = displaySentenceWithFuriganaAndParticles(q.sentence);

      const feedbackHtml = `
                <div class="quiz-feedback incorrect">
                    ❌ The correct answer is "${addFuriganaToText(q.correctAnswer)}".
                    <div style="margin-top: 8px; font-size: 0.85rem;">${sentenceDisplay}</div>
                    <div class="quiz-explanation">📖 ${q.explanation}</div>
                </div>
                <div style="text-align: center; margin-top: 12px;">
                    <button id="quizNextBtn" style="background: #1a2b4c; color: white; border: none; padding: 8px 24px; border-radius: 40px; cursor: pointer;">Next →</button>
                </div>
            `;

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

  let sentenceDisplay = displaySentenceWithFuriganaAndParticles(q.sentence);

  const feedbackHtml = `
        <div class="quiz-feedback incorrect">
            📖 Answer: "${addFuriganaToText(q.correctAnswer)}"
            <div style="margin-top: 8px; font-size: 0.85rem;">${sentenceDisplay}</div>
            <div class="quiz-explanation">📖 ${q.explanation}</div>
            <p style="margin-top: 8px; font-size: 0.7rem;">No points awarded.</p>
        </div>
        <div style="text-align: center; margin-top: 12px;">
            <button id="quizNextBtn" style="background: #1a2b4c; color: white; border: none; padding: 8px 24px; border-radius: 40px; cursor: pointer;">Next →</button>
        </div>
    `;

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
        if (quizArea) {
          quizArea.innerHTML =
            '<p class="quiz-welcome" style="text-align: center; color: #666; padding: 40px;">Select number of questions, then click "Start New Quiz"</p>';
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

  const percent = Math.round((quizScore / currentQuiz.length) * 100);
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
      if (quizArea) {
        quizArea.innerHTML =
          '<p class="quiz-welcome" style="text-align: center; color: #666; padding: 40px;">Select number of questions, then click "Start New Quiz"</p>';
      }
      resultsDiv.style.display = "none";
    });
  }
}

function resetAllProgress() {
  if (
    confirm(
      "⚠️ Are you sure? This will reset ALL mastered and attempted grammar points. This cannot be undone.",
    )
  ) {
    masteredGrammar.clear();
    attemptedGrammar.clear();
    saveMasteredGrammar();
    renderGrammarList();
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
      "⚠️ Reset mastered grammar points only? Attempted will be preserved.",
    )
  ) {
    masteredGrammar.clear();
    saveMasteredGrammar();
    renderGrammarList();
    renderMasteredList();
    updateMasteredCount();
  }
}

function switchTab(tabId) {
  currentGrammarTab = tabId;

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
    renderGrammarList();
  } else if (tabId === "learn") {
    renderLearnTab();
  } else if (tabId === "mastered") {
    renderMasteredList();
  } else if (tabId === "quiz") {
    updateMasteredCount();
  }
}

function attachStartQuizListener() {
  if (!startQuizBtn) return;

  const newBtn = startQuizBtn.cloneNode(true);
  startQuizBtn.parentNode.replaceChild(newBtn, startQuizBtn);
  newBtn.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("Start Quiz button clicked!");
    generateQuiz();
  });
  console.log("Start Quiz button listener attached");
}

// Stats help
if (statHelpIcon) {
  statHelpIcon.addEventListener("click", () => {
    if (quizStatsExplanation) {
      quizStatsExplanation.style.display =
        quizStatsExplanation.style.display === "none" ? "block" : "none";
    }
  });
}

if (closeStatsHelp) {
  closeStatsHelp.addEventListener("click", () => {
    if (quizStatsExplanation) quizStatsExplanation.style.display = "none";
  });
}

// Event Listeners
if (furiToggleBtn) {
  furiToggleBtn.addEventListener("click", () => {
    applyFuriganaHide();
  });
}

if (grammarSearchInput) {
  grammarSearchInput.addEventListener("input", () => {
    currentSearchTerm = grammarSearchInput.value;
    renderGrammarList();
  });
}

if (resetAllProgressBtn) {
  resetAllProgressBtn.addEventListener("click", resetAllProgress);
}

if (resetMasteredOnlyBtn) {
  resetMasteredOnlyBtn.addEventListener("click", resetMasteredOnly);
}

if (tabListBtn) tabListBtn.addEventListener("click", () => switchTab("list"));
if (tabLearnBtn)
  tabLearnBtn.addEventListener("click", () => switchTab("learn"));
if (tabQuizBtn) tabQuizBtn.addEventListener("click", () => switchTab("quiz"));
if (tabMasteredBtn)
  tabMasteredBtn.addEventListener("click", () => switchTab("mastered"));

function initGrammar() {
  loadMasteredGrammar();
  renderGrammarList();
  renderLearnTab();
  switchTab("list");

  const totalGrammar = grammarOrder ? grammarOrder.length : 0;
  if (quizTotalGrammar) quizTotalGrammar.innerText = totalGrammar;
  if (quizTotalGrammar2) quizTotalGrammar2.innerText = totalGrammar;

  attachStartQuizListener();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGrammar);
} else {
  initGrammar();
}
