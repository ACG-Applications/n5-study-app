// ==================== KANJI MODULE ====================

let currentKanjiTab = "list";
let furiganaHidden = false;
let masteredKanji = new Set();
let attemptedKanji = new Set();
let currentSearchTerm = "";

// DOM Elements
const furiToggleBtn = document.getElementById("furiToggleBtn");
const tabListBtn = document.getElementById("tabListBtn");
const tabLearnBtn = document.getElementById("tabLearnBtn");
const tabQuizBtn = document.getElementById("tabQuizBtn");
const tabMasteredBtn = document.getElementById("tabMasteredBtn");
const kanjiSearchInput = document.getElementById("kanjiSearchInput");
const resetAllProgressBtn = document.getElementById("resetAllProgressBtn");
const resetMasteredOnlyBtn = document.getElementById("resetMasteredOnlyBtn");

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

// Helper: Get Unicode hex for a kanji character
function getUnicodeHex(kanji) {
  return kanji.codePointAt(0).toString(16).toUpperCase();
}

// Find example sentences from sentencesData containing this kanji
function findSentencesForKanji(kanjiChar) {
  if (typeof sentencesData === "undefined" || !sentencesData) return [];

  const results = [];
  for (const sentence of sentencesData) {
    if (sentence.jp && sentence.jp.includes(kanjiChar)) {
      results.push({
        sentence: sentence.jp,
        reading: sentence.reading || "",
        english: sentence.translation || "",
      });
      if (results.length >= 3) break;
    }
  }
  return results;
}

// Add furigana to text - handles both （furigana） and (furigana) formats
function addFuriganaToText(text) {
  if (!text) return "";
  if (furiganaHidden) {
    return text.replace(/[（(][^）)]*[）)]/g, "");
  }
  // Handle both Japanese brackets （） and English brackets ()
  return text
    .replace(
      /([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g,
      (_, kanji, furigana) => {
        return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
      },
    )
    .replace(
      /([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g,
      (_, kanji, furigana) => {
        return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
      },
    );
}

// ===== RENDER LEARN TAB =====
function renderLearnTab() {
  const container = document.getElementById("learnContent");
  if (!container) return;

  const content = `
        <div class="learn-container" style="background: #ffffff; border-radius: 20px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e8e0d5;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 4px;">
                <h2 style="color: #000000; font-weight: 700; font-size: 1.5rem; margin: 0;">📖 Mastering Kanji (N5 Level)</h2>
                <button onclick="printLesson()" style="background: #6c8b6b; color: white; border: none; padding: 8px 20px; border-radius: 40px; cursor: pointer; font-size: 0.9rem; font-weight: 500; font-family: inherit; transition: background 0.2s, transform 0.1s;" onmouseover="this.style.background='#5a7a59'" onmouseout="this.style.background='#6c8b6b'">🖨️ Print Lesson</button>
            </div>
            <p style="color: #444444; font-weight: 400; margin-bottom: 24px;">N5 Level - Complete Guide</p>
            
            <!-- SECTION 1: How to Study Kanji -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">1. How to Study Kanji</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    To study kanji efficiently, combine <strong>3</strong> methods:
                </p>
                <ul style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 12px; padding-left: 20px;">
                    <li><strong>1. Radicals &amp; Mnemonics</strong> - Break kanji into parts and create visual stories</li>
                    <li><strong>2. Learn in Context</strong> - Study through vocabulary words, not isolated readings</li>
                    <li><strong>3. Spaced Repetition</strong> - Review at increasing intervals</li>
                </ul>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>The most effective method: <strong>Structure + Context + Spaced Repetition</strong></em>
                </p>
                <div style="background: #fff3e0; border-radius: 12px; padding: 12px 16px; border-left: 4px solid #ff9800;">
                    <div style="font-size: 0.9rem; color: #856404; font-weight: 400;">
                        💡 <strong>Key Point:</strong> Don't memorize readings in isolation. Learn kanji through <strong>vocabulary words</strong>.
                    </div>
                </div>
            </div>
            
            <!-- SECTION 2: Radicals & Mnemonics -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">2. Radicals &amp; Mnemonics</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    Break kanji into <strong>component parts</strong> and create visual stories to remember them.
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>Break kanji into component parts and create <strong>visual stories</strong> to remember them.</em>
                </p>
                
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">Radical</th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">Meaning</th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">Example</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">亻</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Person</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" style="cursor: pointer;">休 - person leaning on tree</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">木</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Tree</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" style="cursor: pointer;">休, 林, 森</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">日</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Sun / Day</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" style="cursor: pointer;">時, 明, 曜</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">月</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Moon / Month</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" style="cursor: pointer;">月, 期</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">口</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Mouth</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" style="cursor: pointer;">食, 話</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">氵</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Water</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" style="cursor: pointer;">海, 洗</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">心</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Heart</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" style="cursor: pointer;">思, 意</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('きゅう')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('きゅう');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">💡 <strong>Example:</strong> 休</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">
                        亻 (person) + 木 (tree) = person leaning against a tree → <strong>rest</strong>
                    </div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
            </div>
            
            <!-- SECTION 3: Learn in Context -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">3. Learn in Context (Vocabulary)</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    Instead of memorizing readings alone, learn kanji through <strong>actual vocabulary words</strong>.
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>Instead of memorizing readings alone, learn kanji through <strong>actual vocabulary words</strong>.</em>
                </p>
                
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">Kanji</th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">Vocabulary</th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">Reading</th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">Meaning</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">日</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">日本</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('にほん')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('にほん');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">にほん 🔊</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Japan</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">本</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">日本</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('にほん')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('にほん');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">にほん 🔊</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Japan</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">食</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">食べる</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('たべる')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('たべる');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">たべる 🔊</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">to eat</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">行</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">行く</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('いく')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('いく');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">いく 🔊</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">to go</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style="background: #e8f0e7; border-radius: 12px; padding: 12px 16px; border-left: 4px solid #6c8b6b;">
                    <div style="font-size: 0.9rem; color: #000000; font-weight: 400;">
                        💡 <strong>Tip:</strong> By learning the word "日本", you naturally learn the readings of both "日" and "本".
                    </div>
                </div>
            </div>
            
            <!-- SECTION 4: Basic Stroke Order -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">4. Basic Stroke Order</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    Learning basic stroke order rules makes writing easier and your kanji look more natural.
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>Learning basic stroke order rules makes writing easier and your kanji look more natural.</em>
                </p>
                
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">Rule</th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">Explanation</th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">Example</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">1</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Left to right</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">一, 二, 三</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">2</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Top to bottom</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">二, 三, 十</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">3</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Outside to inside</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">口, 国, 図</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">4</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Horizontal before vertical</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">十, 王, 土</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- SECTION 5: Effective Review -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">5. Effective Review</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    <strong>Spaced Repetition</strong> is the best way to solidify kanji in your long-term memory.
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em><strong>Spaced Repetition</strong> is the best way to solidify kanji in your long-term memory.</em>
                </p>
                
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">Tool</th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">Features</th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">Recommendation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">Anki</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Flashcards + SRS</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">⭐⭐⭐⭐⭐ Most popular</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">WaniKani</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Gamified learning</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">⭐⭐⭐⭐⭐ Best for beginners</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">Renshuu</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Free &amp; multifunctional</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">⭐⭐⭐⭐ Customizable</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style="background: #e8f0fe; border-radius: 12px; padding: 12px 16px; border-left: 4px solid #1e4b6e;">
                    <div style="font-size: 0.9rem; color: #1e4b6e; font-weight: 400;">
                        💡 <strong>Recommended Study Method:</strong><br>
                        1. Learn 5-10 new kanji<br>
                        2. Review at the end of the day<br>
                        3. Review again the next day<br>
                        4. Review once more after 1 week
                    </div>
                </div>
            </div>
            
        </div>
    `;

  container.innerHTML = addFuriganaToText(content);

  document.querySelectorAll(".example-box, .example-click").forEach((el) => {
    if (!el.hasAttribute("data-tts-attached")) {
      el.setAttribute("data-tts-attached", "true");
      if (!el.hasAttribute("onclick")) {
        const text = el.textContent.trim().replace(/[🔊]/g, "").trim();
        if (text) {
          el.addEventListener("click", function (e) {
            const cleanText = text.replace(/[→].*$/, "").trim();
            if (cleanText && typeof speakText === "function") {
              speakText(cleanText);
            }
          });
        }
      }
    }
  });

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

// Load mastered from localStorage
function loadMasteredKanji() {
  const stored = localStorage.getItem("masteredKanji");
  if (stored) {
    masteredKanji = new Set(JSON.parse(stored));
  }
  const storedAttempted = localStorage.getItem("attemptedKanji");
  if (storedAttempted) {
    attemptedKanji = new Set(JSON.parse(storedAttempted));
  }
  updateMasteredCount();
}

function saveMasteredKanji() {
  localStorage.setItem("masteredKanji", JSON.stringify([...masteredKanji]));
  localStorage.setItem("attemptedKanji", JSON.stringify([...attemptedKanji]));
  updateMasteredCount();
}

function updateMasteredCount() {
  const total = kanjiData.length;
  const mastered = masteredKanji.size;
  const attempted = attemptedKanji.size;

  const masteredCountSpan = document.getElementById("masteredCount");
  const totalCountSpan = document.getElementById("totalCount");
  if (masteredCountSpan) masteredCountSpan.innerText = mastered;
  if (totalCountSpan) totalCountSpan.innerText = total;

  const quizMasteredEl = document.getElementById("quizMasteredCount");
  const quizAttemptedEl = document.getElementById("quizAttemptedCount");
  const quizTotalEl = document.getElementById("quizTotalKanji");
  const quizTotalEl2 = document.getElementById("quizTotalKanji2");
  if (quizMasteredEl) quizMasteredEl.innerText = mastered;
  if (quizAttemptedEl) quizAttemptedEl.innerText = attempted;
  if (quizTotalEl) quizTotalEl.innerText = total;
  if (quizTotalEl2) quizTotalEl2.innerText = total;
}

function markKanjiMastered(kanjiId, isFirstAttempt = true) {
  if (isFirstAttempt && !masteredKanji.has(kanjiId)) {
    masteredKanji.add(kanjiId);
  }
  if (!attemptedKanji.has(kanjiId)) {
    attemptedKanji.add(kanjiId);
  }
  saveMasteredKanji();
  renderKanjiList();
  renderMasteredList();
}

function unmarkKanjiMastered(kanjiId) {
  masteredKanji.delete(kanjiId);
  saveMasteredKanji();
  renderKanjiList();
  renderMasteredList();
}

// Render mastered list
function renderMasteredList() {
  const container = document.getElementById("masteredList");
  if (!container) return;

  const masteredIds = [...masteredKanji];

  if (masteredIds.length === 0) {
    container.innerHTML =
      '<p class="empty-message">No kanji mastered yet. Complete a quiz to master them!</p>';
    return;
  }

  let html = "";
  for (const kanjiId of masteredIds) {
    const kanji = kanjiData.find((k) => k.id === kanjiId);
    if (kanji) {
      html += `
                <div class="mastered-kanji-item">
                    <div>
                        <span class="mastered-kanji-char">${kanji.kanji}</span>
                        <span class="mastered-kanji-meaning">${kanji.meaning}</span>
                    </div>
                    <button class="unmaster-btn" data-kanji-id="${kanji.id}">Remove</button>
                </div>
            `;
    }
  }

  container.innerHTML = html;

  document.querySelectorAll(".unmaster-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const kanjiId = btn.dataset.kanjiId;
      unmarkKanjiMastered(kanjiId);
    });
  });
}

// Helper function to display a sentence with proper furigana handling
function displaySentenceWithFurigana(sentence) {
  if (!sentence) return "";
  return addFuriganaToText(sentence);
}

// RENDER KANJI LIST - MAIN FUNCTION
function renderKanjiList() {
  const container = document.getElementById("kanjiList");
  if (!container) {
    console.log("Container not found");
    return;
  }

  let filteredKanji = [...kanjiData];

  if (currentSearchTerm) {
    const searchLower = currentSearchTerm.toLowerCase();
    filteredKanji = filteredKanji.filter(
      (k) =>
        k.kanji.includes(currentSearchTerm) ||
        k.meaning.toLowerCase().includes(searchLower) ||
        (k.onyomi && k.onyomi.toLowerCase().includes(searchLower)) ||
        (k.kunyomi && k.kunyomi.toLowerCase().includes(searchLower)),
    );
  }

  let html = '<div class="kanji-grid">';

  for (const kanji of filteredKanji) {
    const isMastered = masteredKanji.has(kanji.id);

    const onyomiAttr = (kanji.onyomi || "-").replace(/"/g, "&quot;");
    const kunyomiAttr = (kanji.kunyomi || "-").replace(/"/g, "&quot;");

    let exampleSentences = [];
    if (kanji.examples && kanji.examples.length > 0) {
      exampleSentences = kanji.examples;
    } else {
      exampleSentences = findSentencesForKanji(kanji.kanji);
    }

    let examplesHtml = "";
    if (exampleSentences.length > 0) {
      examplesHtml = exampleSentences
        .map((ex) => {
          let displayJp = displaySentenceWithFurigana(ex.sentence);
          const reading =
            ex.reading || ex.sentence.replace(/[（(][^）)]*[）)]/g, "").trim();

          return `
                    <div class="example-item" data-reading="${reading}" data-sentence="${ex.sentence || ""}">
                        <div class="example-jp">${displayJp}</div>
                        <div class="example-trans">${ex.english}</div>
                        <button class="small-btn example-tts-btn" style="margin-top: 6px; font-size: 0.7rem; background: #6c8b6b; color: white; border: none; padding: 2px 12px; border-radius: 20px; cursor: pointer;" data-reading="${reading}">🔊 Listen</button>
                    </div>
                `;
        })
        .join("");
    } else {
      examplesHtml =
        '<p style="color: #999; font-style: italic;">No examples available</p>';
    }

    html += `
            <div class="kanji-card ${isMastered ? "mastered" : ""}" data-kanji-id="${kanji.id}">
                <div class="kanji-header-card">
                    <span class="kanji-pattern">${kanji.kanji}</span>
                    <span class="kanji-meaning">${kanji.meaning}</span>
                    ${isMastered ? '<span class="mastered-badge">✓ Mastered</span>' : ""}
                </div>
                <div class="kanji-readings">
                    <div>
                        <strong>On'yomi:</strong> 
                        <span class="reading-value">${kanji.onyomi || "-"}</span>
                        <button class="tts-reading-btn small-btn" data-text="${onyomiAttr}" data-lang="ja-JP" style="margin-left: 8px; padding: 2px 8px; font-size: 0.7rem;">🔊</button>
                    </div>
                    <div>
                        <strong>Kun'yomi:</strong> 
                        <span class="reading-value">${kanji.kunyomi || "-"}</span>
                        <button class="tts-reading-btn small-btn" data-text="${kunyomiAttr}" data-lang="ja-JP" style="margin-left: 8px; padding: 2px 8px; font-size: 0.7rem;">🔊</button>
                    </div>
                </div>
                <div class="kanji-examples">
                    <h4>📝 Example Sentences <span style="font-weight:normal;font-size:0.7rem;color:#999;">(click to listen)</span></h4>
                    ${examplesHtml}
                </div>
                <div class="kanji-buttons">
                    <button class="small-btn mark-mastered-btn" data-kanji-id="${kanji.id}">
                        ${isMastered ? "✓ Mastered" : "✓ Mark as Mastered"}
                    </button>
                    <button class="small-btn stroke-order-btn" data-kanji="${kanji.kanji}" data-unicode="${getUnicodeHex(kanji.kanji)}" data-meaning="${kanji.meaning}">
                        ✍️ Stroke Order
                    </button>
                </div>
            </div>
        `;
  }

  html += "</div>";

  if (filteredKanji.length === 0) {
    html =
      '<p style="text-align: center; padding: 40px;">No kanji match your search.</p>';
  }

  container.innerHTML = html;
  console.log("Kanji list rendered, count:", filteredKanji.length);
}

// ==================== RESET FUNCTIONS ====================
function resetAllProgress() {
  if (
    confirm(
      "⚠️ Are you sure you want to reset ALL progress? This will remove all mastered kanji and quiz history.",
    )
  ) {
    masteredKanji.clear();
    attemptedKanji.clear();
    saveMasteredKanji();

    if (typeof kanjiQuizState !== "undefined") {
      kanjiQuizState.isActive = false;
      kanjiQuizState.questions = [];
      kanjiQuizState.currentIndex = 0;
      kanjiQuizState.correctCount = 0;
      kanjiQuizState.incorrectCount = 0;
      kanjiQuizState.totalCount = 0;
      kanjiQuizState.score = 0;
    }

    renderKanjiList();
    renderMasteredList();
    updateMasteredCount();

    const quizArea = document.getElementById("quizArea");
    if (quizArea) {
      quizArea.innerHTML = `
                <p class="quiz-welcome" style="text-align: center; color: #666; padding: 40px; font-size: 1rem;">
                    Progress has been reset. Select a mode and number of questions, then click <strong>"Start New Quiz"</strong>
                </p>
            `;
    }
    const resultsDiv = document.getElementById("quizResults");
    if (resultsDiv) resultsDiv.style.display = "none";

    alert("✅ All progress has been reset.");
  }
}

function resetMasteredOnly() {
  if (
    confirm(
      "⚠️ Are you sure you want to reset only the mastered status? Quiz history will be preserved.",
    )
  ) {
    masteredKanji.clear();
    saveMasteredKanji();

    renderKanjiList();
    renderMasteredList();
    updateMasteredCount();

    const quizArea = document.getElementById("quizArea");
    if (quizArea && (!quizArea.innerHTML || quizArea.innerHTML.trim() === "")) {
      quizArea.innerHTML = `
                <p class="quiz-welcome" style="text-align: center; color: #666; padding: 40px; font-size: 1rem;">
                    Mastered status has been reset. Select a mode and number of questions, then click <strong>"Start New Quiz"</strong>
                </p>
            `;
    }

    alert("✅ Mastered status has been reset.");
  }
}

// ==================== QUIZ STATE ====================
const kanjiQuizState = {
  isActive: false,
  questions: [],
  currentIndex: 0,
  correctCount: 0,
  incorrectCount: 0,
  totalCount: 0,
  score: 0,
  usedShowAnswer: false,
  attempts: 0,
};

// ==================== QUIZ FUNCTIONS ====================

function attachStartQuizListener() {
  const startBtn = document.getElementById("startQuizBtn");
  if (startBtn) {
    startBtn.removeEventListener("click", generateKanjiQuiz);
    startBtn.addEventListener("click", generateKanjiQuiz);
    console.log("Start quiz listener attached");
  } else {
    console.log("Start quiz button not found");
  }
}

function getSelectedQuizMode() {
  const modeRadios = document.querySelectorAll('input[name="quizMode"]');
  for (const radio of modeRadios) {
    if (radio.checked) {
      return radio.value;
    }
  }
  return "kanji_to_reading";
}

function getReadingModes(kanji) {
  const readings = [];

  const onyomiList = kanji.onyomi
    ? kanji.onyomi.split(/[、,，\s]+/).filter((r) => r && r !== "-")
    : [];
  const kunyomiList = kanji.kunyomi
    ? kanji.kunyomi.split(/[、,，\s]+/).filter((r) => r && r !== "-")
    : [];

  for (const r of onyomiList) {
    readings.push({ reading: r, type: "on" });
  }
  for (const r of kunyomiList) {
    readings.push({ reading: r, type: "kun" });
  }

  return readings;
}

function generateKanjiQuiz() {
  console.log("generateKanjiQuiz called!");

  const quizArea = document.getElementById("quizArea");
  const resultsDiv = document.getElementById("quizResults");
  if (!quizArea) {
    console.log("Quiz area not found");
    return;
  }
  if (resultsDiv) resultsDiv.style.display = "none";

  const selectedMode = getSelectedQuizMode();
  console.log("Selected mode:", selectedMode);

  const questionCount =
    parseInt(document.getElementById("quizCountSelect")?.value) || 10;
  console.log("Question count:", questionCount);

  const availableKanji = kanjiData.filter(
    (k) => k.examples && k.examples.length > 0,
  );
  console.log("Available kanji with examples:", availableKanji.length);

  if (availableKanji.length < questionCount) {
    quizArea.innerHTML = `
            <p class="quiz-welcome" style="text-align: center; color: #c45d1e; padding: 40px;">
                ⚠️ Not enough kanji with examples. Available: ${availableKanji.length}, Requested: ${questionCount}
                <br><br>
                Please reduce the number of questions.
            </p>
        `;
    return;
  }

  for (let i = availableKanji.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableKanji[i], availableKanji[j]] = [
      availableKanji[j],
      availableKanji[i],
    ];
  }

  const selectedKanji = availableKanji.slice(0, questionCount);
  console.log("Selected kanji count:", selectedKanji.length);

  kanjiQuizState.isActive = true;
  kanjiQuizState.questions = [];
  kanjiQuizState.currentIndex = 0;
  kanjiQuizState.correctCount = 0;
  kanjiQuizState.incorrectCount = 0;
  kanjiQuizState.totalCount = questionCount;
  kanjiQuizState.score = 0;
  kanjiQuizState.usedShowAnswer = false;

  for (const kanji of selectedKanji) {
    let questionText = "";
    let correctAnswer = "";
    let answerType = "";
    let originalSentence = "";

    if (selectedMode === "kanji_to_reading") {
      const readings = getReadingModes(kanji);
      if (readings.length > 0) {
        const reading = readings[Math.floor(Math.random() * readings.length)];
        const readingType = reading.type === "on" ? "On'yomi" : "Kun'yomi";
        questionText = `What is the ${readingType} reading of: <strong>${kanji.kanji}</strong> (${kanji.meaning})?`;
        correctAnswer = reading.reading;
        answerType = "reading";
      }
    } else if (selectedMode === "reading_to_kanji") {
      const readings = getReadingModes(kanji);
      if (readings.length > 0) {
        const reading = readings[Math.floor(Math.random() * readings.length)];
        const readingType = reading.type === "on" ? "On'yomi" : "Kun'yomi";
        questionText = `Which kanji has the ${readingType} reading: <strong>${reading.reading}</strong>?`;
        correctAnswer = kanji.kanji;
        answerType = "kanji";
      }
    } else if (selectedMode === "in_context") {
      if (kanji.examples && kanji.examples.length > 0) {
        const example =
          kanji.examples[Math.floor(Math.random() * kanji.examples.length)];
        originalSentence = example.sentence;
        const regex = new RegExp(kanji.kanji, "g");
        const sentenceWithBlank = example.sentence.replace(regex, "_____");
        questionText = `Fill in the blank: ${sentenceWithBlank}`;
        correctAnswer = kanji.kanji;
        answerType = "kanji";
      }
    }

    if (questionText && correctAnswer) {
      kanjiQuizState.questions.push({
        question: questionText,
        correctAnswer: correctAnswer,
        kanjiId: kanji.id,
        kanji: kanji.kanji,
        meaning: kanji.meaning,
        answerType: answerType,
        attempts: 0,
        answered: false,
        originalSentence: originalSentence,
      });
    }
  }

  if (kanjiQuizState.questions.length === 0) {
    quizArea.innerHTML = `
            <p class="quiz-welcome" style="text-align: center; color: #c45d1e; padding: 40px;">
                ⚠️ Could not generate questions. Please try a different mode.
            </p>
        `;
    kanjiQuizState.isActive = false;
    return;
  }

  kanjiQuizState.totalCount = kanjiQuizState.questions.length;
  console.log("Generated", kanjiQuizState.questions.length, "questions");

  renderKanjiQuizQuestion();
}

// Helper function to apply furigana to quiz text
function displaySentenceWithFuriganaForQuiz(text) {
  if (!text) return "";
  let processed = addFuriganaToText(text);
  if (furiganaHidden) {
    processed = processed.replace(/[（(][^）)]*[）)]/g, "");
  }
  return processed;
}

function renderKanjiQuizQuestion() {
  console.log("renderKanjiQuizQuestion called");

  if (!kanjiQuizState.isActive || kanjiQuizState.questions.length === 0) {
    console.log("Quiz not active or no questions");
    return;
  }

  const quizArea = document.getElementById("quizArea");
  if (!quizArea) {
    console.log("Quiz area not found");
    return;
  }

  if (kanjiQuizState.currentIndex >= kanjiQuizState.questions.length) {
    console.log("Quiz complete, showing results");
    showKanjiQuizResults();
    return;
  }

  const question = kanjiQuizState.questions[kanjiQuizState.currentIndex];
  console.log(
    "Showing question",
    kanjiQuizState.currentIndex + 1,
    "of",
    kanjiQuizState.questions.length,
  );

  const progress = kanjiQuizState.currentIndex + 1;
  const total = kanjiQuizState.questions.length;
  const score = kanjiQuizState.score.toFixed(1);

  const options = generateOptions(question);

  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  let optionsHtml = options
    .map(
      (opt, index) => `
        <button class="quiz-option-btn" data-value="${opt.replace(/'/g, "\\'")}" onclick="checkKanjiQuizAnswer('${opt.replace(/'/g, "\\'")}')">
            ${opt}
        </button>
    `,
    )
    .join("");

  let processedQuestion = question.question;

  if (question.answerType === "kanji" && question.question.includes("_____")) {
    const sentenceMatch = question.question.match(/Fill in the blank: (.*)/);
    if (sentenceMatch) {
      const sentencePart = sentenceMatch[1];
      const processedSentence =
        displaySentenceWithFuriganaForQuiz(sentencePart);
      processedQuestion = `Fill in the blank: ${processedSentence}`;
    }
  } else {
    processedQuestion = displaySentenceWithFuriganaForQuiz(question.question);
  }

  quizArea.innerHTML = `
        <div class="quiz-question-container">
            <div class="quiz-progress-bar" style="display: flex; justify-content: space-between; padding: 10px 16px; background: #e8e0d5; border-radius: 12px; margin-bottom: 16px;">
                <span class="quiz-progress-text" style="font-weight: 500;">Question ${progress} of ${total}</span>
                <span class="quiz-score-text" style="font-weight: 500; color: #6c8b6b;">Score: ${score}</span>
            </div>
            <div class="quiz-question-box" style="background: #faf8f5; padding: 24px; border-radius: 16px;">
                <p class="quiz-question-text" style="font-size: 1.1rem; text-align: center; margin-bottom: 20px; line-height: 1.8;">${processedQuestion}</p>
                <div class="quiz-options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-width: 600px; margin: 0 auto;">
                    ${optionsHtml}
                </div>
                <div id="quizFeedback" class="quiz-feedback" style="margin-top: 16px; text-align: center;"></div>
            </div>
        </div>
    `;
}

function generateOptions(question) {
  const options = [];
  const correctAnswer = question.correctAnswer;
  const allKanji = kanjiData;

  options.push(correctAnswer);

  let distractors = [];

  if (question.answerType === "reading") {
    const otherReadings = [];
    for (const k of allKanji) {
      if (k.id !== question.kanjiId) {
        const readings = getReadingModes(k);
        for (const r of readings) {
          if (r.reading !== correctAnswer) {
            otherReadings.push(r.reading);
          }
        }
      }
    }
    for (let i = otherReadings.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherReadings[i], otherReadings[j]] = [
        otherReadings[j],
        otherReadings[i],
      ];
    }
    distractors = otherReadings.slice(0, 3);

    while (distractors.length < 3) {
      const commonReadings = [
        "にち",
        "がつ",
        "げつ",
        "か",
        "じ",
        "いち",
        "に",
        "さん",
        "よん",
        "ご",
        "ろく",
        "なな",
        "はち",
        "きゅう",
        "じゅう",
      ];
      for (const r of commonReadings) {
        if (r !== correctAnswer && !distractors.includes(r)) {
          distractors.push(r);
          if (distractors.length >= 3) break;
        }
      }
    }
  } else if (question.answerType === "kanji") {
    const otherKanji = [];
    for (const k of allKanji) {
      if (k.id !== question.kanjiId && k.kanji !== correctAnswer) {
        otherKanji.push(k.kanji);
      }
    }
    for (let i = otherKanji.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherKanji[i], otherKanji[j]] = [otherKanji[j], otherKanji[i]];
    }
    distractors = otherKanji.slice(0, 3);

    while (distractors.length < 3) {
      const commonKanji = [
        "日",
        "月",
        "火",
        "水",
        "木",
        "金",
        "土",
        "人",
        "大",
        "小",
        "中",
        "上",
        "下",
        "左",
        "右",
      ];
      for (const k of commonKanji) {
        if (k !== correctAnswer && !distractors.includes(k)) {
          distractors.push(k);
          if (distractors.length >= 3) break;
        }
      }
    }
  }

  for (const d of distractors) {
    if (options.length < 4 && d !== correctAnswer && !options.includes(d)) {
      options.push(d);
    }
  }

  while (options.length < 4) {
    const placeholders = ["???", "—", "●", "○"];
    for (const p of placeholders) {
      if (!options.includes(p) && options.length < 4) {
        options.push(p);
      }
    }
  }

  return options;
}

function checkKanjiQuizAnswer(selectedAnswer) {
  console.log("checkKanjiQuizAnswer called with:", selectedAnswer);

  const question = kanjiQuizState.questions[kanjiQuizState.currentIndex];
  if (!question) {
    console.log("No question found");
    return;
  }

  if (question.answered) {
    console.log("Question already answered");
    return;
  }

  const isCorrect = selectedAnswer === question.correctAnswer;

  question.attempts++;
  question.answered = true;

  console.log(
    "Selected:",
    selectedAnswer,
    "Correct:",
    question.correctAnswer,
    "Is correct:",
    isCorrect,
  );

  const feedback = document.getElementById("quizFeedback");

  document.querySelectorAll(".quiz-option-btn").forEach((btn) => {
    btn.disabled = true;
    if (btn.dataset.value === question.correctAnswer) {
      btn.style.background = "#28a745";
      btn.style.color = "white";
      btn.style.borderColor = "#1e7e34";
    } else if (btn.dataset.value === selectedAnswer && !isCorrect) {
      btn.style.background = "#dc3545";
      btn.style.color = "white";
      btn.style.borderColor = "#bd2130";
    }
    btn.style.opacity = "0.7";
    btn.style.cursor = "default";
  });

  if (isCorrect) {
    if (question.attempts === 1) {
      kanjiQuizState.score += 1;
      markKanjiMastered(question.kanjiId, true);
    } else {
      kanjiQuizState.score += 0.5;
    }
    kanjiQuizState.correctCount++;
    if (feedback) {
      feedback.innerHTML = `
                <p style="color: #28a745; font-weight: bold; font-size: 1.1rem;">✅ Correct!</p>
                <p style="color: #666;">Answer: ${question.correctAnswer}</p>
            `;
    }
  } else {
    kanjiQuizState.incorrectCount++;
    if (feedback) {
      feedback.innerHTML = `
                <p style="color: #dc3545; font-weight: bold; font-size: 1.1rem;">❌ Incorrect</p>
                <p style="color: #28a745;">Correct answer: ${question.correctAnswer}</p>
            `;
    }
    if (!attemptedKanji.has(question.kanjiId)) {
      attemptedKanji.add(question.kanjiId);
      saveMasteredKanji();
    }
  }

  const scoreText = document.querySelector(".quiz-score-text");
  if (scoreText) {
    scoreText.textContent = `Score: ${kanjiQuizState.score.toFixed(1)}`;
  }

  setTimeout(() => {
    if (feedback) {
      feedback.innerHTML += `
                <button class="small-btn quiz-next-btn" onclick="nextQuizQuestion()" style="margin-top: 12px; background: #6c8b6b; color: white; border: none; padding: 8px 28px; border-radius: 40px; cursor: pointer; font-size: 0.9rem; font-weight: 500;">
                    ➡️ Next Question
                </button>
            `;
    }
  }, 800);
}

function nextQuizQuestion() {
  kanjiQuizState.currentIndex++;
  updateMasteredCount();
  renderMasteredList();
  if (kanjiQuizState.currentIndex < kanjiQuizState.questions.length) {
    renderKanjiQuizQuestion();
  } else {
    showKanjiQuizResults();
  }
}

function toggleShowAnswer() {
  console.log("toggleShowAnswer called");

  const question = kanjiQuizState.questions[kanjiQuizState.currentIndex];
  if (!question) {
    console.log("No question found");
    return;
  }

  if (question.answered) {
    console.log("Question already answered");
    return;
  }

  const feedback = document.getElementById("quizFeedback");
  if (feedback) {
    feedback.innerHTML = `
            <p style="color: #17a2b8; font-weight: bold; font-size: 1.1rem;">👁️ Answer shown</p>
            <p style="color: #28a745;">Correct answer: ${question.correctAnswer}</p>
        `;
  }

  document.querySelectorAll(".quiz-option-btn").forEach((btn) => {
    btn.disabled = true;
    if (btn.dataset.value === question.correctAnswer) {
      btn.style.background = "#28a745";
      btn.style.color = "white";
      btn.style.borderColor = "#1e7e34";
    }
    btn.style.opacity = "0.7";
    btn.style.cursor = "default";
  });

  question.answered = true;
  question.attempts = 1;
  kanjiQuizState.incorrectCount++;

  setTimeout(() => {
    if (feedback) {
      feedback.innerHTML += `
                <button class="small-btn quiz-next-btn" onclick="nextQuizQuestion()" style="margin-top: 12px; background: #6c8b6b; color: white; border: none; padding: 8px 28px; border-radius: 40px; cursor: pointer; font-size: 0.9rem; font-weight: 500;">
                    ➡️ Next Question
                </button>
            `;
    }
  }, 500);
}

function showKanjiQuizResults() {
  console.log("showKanjiQuizResults called");

  const resultsDiv = document.getElementById("quizResults");
  const quizArea = document.getElementById("quizArea");
  if (!resultsDiv) {
    console.log("Results div not found");
    return;
  }

  kanjiQuizState.isActive = false;

  const total = kanjiQuizState.totalCount || 1;
  const percentage = Math.round((kanjiQuizState.score / total) * 100);

  let emoji = "😅";
  let message = "Keep practicing!";
  if (percentage >= 90) {
    emoji = "🎉";
    message = "Excellent! You're a kanji master!";
  } else if (percentage >= 70) {
    emoji = "🌟";
    message = "Great job! Keep it up!";
  } else if (percentage >= 50) {
    emoji = "💪";
    message = "Good effort! Review the ones you missed.";
  }

  resultsDiv.style.display = "block";
  resultsDiv.innerHTML = `
        <div class="quiz-results-content" style="text-align: center; padding: 20px; background: #faf8f5; border-radius: 16px;">
            <h3 style="font-size: 1.8rem; margin-bottom: 16px;">${emoji} Quiz Complete!</h3>
            <div class="result-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 20px; max-width: 400px; margin: 0 auto; text-align: left;">
                <p><strong>Score:</strong> ${kanjiQuizState.score.toFixed(1)} / ${total}</p>
                <p><strong>Percentage:</strong> ${percentage}%</p>
                <p><strong>Correct:</strong> ${kanjiQuizState.correctCount}</p>
                <p><strong>Incorrect:</strong> ${kanjiQuizState.incorrectCount}</p>
                <p style="grid-column: span 2;"><strong>New Mastered:</strong> ${kanjiQuizState.correctCount} kanji</p>
                <p style="grid-column: span 2; font-style: italic; color: #666; margin-top: 8px;">${message}</p>
            </div>
            <div class="quiz-results-buttons" style="margin-top: 20px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <button class="small-btn" onclick="document.getElementById('quizResults').style.display='none'; generateKanjiQuiz();" style="background: #6c8b6b; color: white; border: none; padding: 8px 24px; border-radius: 40px; cursor: pointer; font-size: 0.9rem;">🔄 Try Again</button>
                <button class="small-btn" onclick="document.getElementById('quizResults').style.display='none';" style="background: #e8e0d5; color: #333; border: none; padding: 8px 24px; border-radius: 40px; cursor: pointer; font-size: 0.9rem;">✖ Close</button>
            </div>
        </div>
    `;

  if (quizArea) {
    quizArea.innerHTML = `
            <p class="quiz-complete" style="text-align: center; padding: 20px; color: #28a745; font-size: 1.2rem;">
                ✅ Quiz complete! Check your results below.
            </p>
        `;
  }

  updateMasteredCount();
  renderMasteredList();
}

function stopKanjiQuiz() {
  kanjiQuizState.isActive = false;
  kanjiQuizState.questions = [];
  kanjiQuizState.currentIndex = 0;

  const quizArea = document.getElementById("quizArea");
  if (quizArea) {
    quizArea.innerHTML = `
            <p class="quiz-welcome" style="text-align: center; color: #666; padding: 40px; font-size: 1rem;">
                Quiz stopped. Select a mode and number of questions, then click <strong>"Start New Quiz"</strong>
            </p>
        `;
  }

  const resultsDiv = document.getElementById("quizResults");
  if (resultsDiv) resultsDiv.style.display = "none";
}

// ========== EVENT DELEGATION ==========
function setupDelegation() {
  const container = document.getElementById("kanjiList");
  if (!container) return;

  container.addEventListener("click", function (e) {
    const btn = e.target.closest(".stroke-order-btn");
    if (!btn) return;
    e.stopPropagation();

    const kanji = btn.dataset.kanji;
    const unicode = btn.dataset.unicode;
    const meaning = btn.dataset.meaning;

    if (typeof showStrokeOrder === "function") {
      showStrokeOrder(kanji, unicode, meaning);
    } else {
      console.error("showStrokeOrder is not defined!");
      alert("Stroke order feature not available. Please check console.");
    }
  });

  container.addEventListener("click", function (e) {
    const btn = e.target.closest(".mark-mastered-btn");
    if (!btn) return;
    e.stopPropagation();

    const kanjiId = btn.dataset.kanjiId;
    if (masteredKanji.has(kanjiId)) {
      unmarkKanjiMastered(kanjiId);
    } else {
      markKanjiMastered(kanjiId, true);
    }
  });

  container.addEventListener("click", function (e) {
    const btn = e.target.closest(".tts-reading-btn");
    if (!btn) return;
    e.stopPropagation();

    const text = btn.dataset.text;
    const lang = btn.dataset.lang || "ja-JP";
    if (text && text !== "-") {
      speakText(text, lang);
    }
  });

  container.addEventListener("click", function (e) {
    const item = e.target.closest(".example-item");
    if (!item) return;
    e.stopPropagation();

    if (e.target.closest(".example-tts-btn")) {
      const btn = e.target.closest(".example-tts-btn");
      const btnReading = btn.dataset.reading || item.dataset.reading || "";
      if (btnReading) {
        speakText(btnReading, "ja-JP");
      }
      return;
    }

    const reading = item.dataset.reading;
    if (reading && reading.trim() !== "") {
      speakText(reading, "ja-JP");
    } else {
      const sentence = item.dataset.sentence || "";
      const cleanSentence = sentence.replace(/[（(][^）)]*[）)]/g, "").trim();
      if (cleanSentence) {
        speakText(cleanSentence, "ja-JP");
      }
    }
  });
}

function applyFuriganaHide() {
  furiganaHidden = !furiganaHidden;
  if (furiToggleBtn) {
    furiToggleBtn.innerText = furiganaHidden
      ? "🔤 Furigana On"
      : "🔤 Furigana Off";
  }
  renderKanjiList();
  renderLearnTab();
  renderMasteredList();

  if (
    typeof kanjiQuizState !== "undefined" &&
    kanjiQuizState &&
    kanjiQuizState.isActive &&
    kanjiQuizState.questions.length > 0
  ) {
    renderKanjiQuizQuestion();
  }
}

// ===== switchTab function =====
function switchTab(tabId) {
  currentKanjiTab = tabId;

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
    renderKanjiList();
  } else if (tabId === "learn") {
    renderLearnTab();
  } else if (tabId === "mastered") {
    renderMasteredList();
  } else if (tabId === "quiz") {
    updateMasteredCount();
    const quizArea = document.getElementById("quizArea");
    if (quizArea && !quizArea.innerHTML.includes("quiz-welcome")) {
      if (!quizArea.innerHTML || quizArea.innerHTML.trim() === "") {
        quizArea.innerHTML = `
                    <p class="quiz-welcome" style="text-align: center; color: #666; padding: 40px; font-size: 1rem;">
                        Select a mode and number of questions, then click <strong>"Start New Quiz"</strong>
                    </p>
                `;
      }
    }
    if (
      typeof kanjiQuizState !== "undefined" &&
      kanjiQuizState &&
      kanjiQuizState.isActive &&
      kanjiQuizState.questions.length > 0
    ) {
      renderKanjiQuizQuestion();
    }
  }
}

// Event Listeners
if (furiToggleBtn) {
  furiToggleBtn.addEventListener("click", applyFuriganaHide);
}

if (kanjiSearchInput) {
  kanjiSearchInput.addEventListener("input", () => {
    currentSearchTerm = kanjiSearchInput.value;
    renderKanjiList();
  });
}

if (tabListBtn) tabListBtn.addEventListener("click", () => switchTab("list"));
if (tabLearnBtn)
  tabLearnBtn.addEventListener("click", () => switchTab("learn"));
if (tabQuizBtn) tabQuizBtn.addEventListener("click", () => switchTab("quiz"));
if (tabMasteredBtn)
  tabMasteredBtn.addEventListener("click", () => switchTab("mastered"));

if (resetAllProgressBtn)
  resetAllProgressBtn.addEventListener("click", resetAllProgress);
if (resetMasteredOnlyBtn)
  resetMasteredOnlyBtn.addEventListener("click", resetMasteredOnly);

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

function initKanji() {
  console.log("Initializing kanji module...");
  loadMasteredKanji();
  renderKanjiList();
  renderLearnTab();
  updateMasteredCount();
  switchTab("list");
  setupDelegation();
  attachStartQuizListener();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initKanji);
} else {
  initKanji();
}