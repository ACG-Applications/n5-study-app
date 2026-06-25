// ==================== KANJI MODULE ====================

let currentKanjiTab = 'list';
let furiganaHidden = false;
let masteredKanji = new Set();
let attemptedKanji = new Set();
let currentSearchTerm = '';

// DOM Elements
const furiToggleBtn = document.getElementById('furiToggleBtn');
const tabListBtn = document.getElementById('tabListBtn');
const tabLearnBtn = document.getElementById('tabLearnBtn');
const tabQuizBtn = document.getElementById('tabQuizBtn');
const tabMasteredBtn = document.getElementById('tabMasteredBtn');
const kanjiSearchInput = document.getElementById('kanjiSearchInput');
const resetAllProgressBtn = document.getElementById('resetAllProgressBtn');
const resetMasteredOnlyBtn = document.getElementById('resetMasteredOnlyBtn');

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

// Helper: Get Unicode hex for a kanji character
function getUnicodeHex(kanji) {
    return kanji.codePointAt(0).toString(16).toUpperCase();
}

// Find example sentences from sentencesData containing this kanji
function findSentencesForKanji(kanjiChar) {
    if (typeof sentencesData === 'undefined' || !sentencesData) return [];
    
    const results = [];
    for (const sentence of sentencesData) {
        if (sentence.jp && sentence.jp.includes(kanjiChar)) {
            results.push({
                sentence: sentence.jp,
                reading: sentence.reading || '',
                english: sentence.translation || ''
            });
            if (results.length >= 3) break;
        }
    }
    return results;
}

// Add furigana to text
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
                <h2 style="color: #000000; font-weight: 700; font-size: 1.5rem; margin: 0;">📖 Mastering Kanji (N5 Level)</h2>
                <button onclick="printLesson()" style="background: #6c8b6b; color: white; border: none; padding: 8px 20px; border-radius: 40px; cursor: pointer; font-size: 0.9rem; font-weight: 500; font-family: inherit; transition: background 0.2s, transform 0.1s;" onmouseover="this.style.background='#5a7a59'" onmouseout="this.style.background='#6c8b6b'">🖨️ Print Lesson</button>
            </div>
            <p style="color: #444444; font-weight: 400; margin-bottom: 24px;">N5 Level - Complete Guide</p>
            
            <!-- SECTION 1: How to Study Kanji -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">1. 漢字（かんじ）の 学（まな）び方（かた） / How to Study Kanji</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    漢字（かんじ）を 効率（こうりつ）よく 学（まな）ぶには <strong>3つ</strong> の 方法（ほうほう）を 組（く）み合（あ）わせます：
                </p>
                <ul style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 12px; padding-left: 20px;">
                    <li><strong>1. 部首（ぶしゅ）と 連想（れんそう）</strong> / Radicals &amp; Mnemonics</li>
                    <li><strong>2. 文脈（ぶんみゃく）で 学（まな）ぶ</strong> / Learn in Context (Vocabulary)</li>
                    <li><strong>3. 間隔（かんかく）を 置（お）いた 復習（ふくしゅう）</strong> / Spaced Repetition</li>
                </ul>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>The most effective method: <strong>Structure + Context + Spaced Repetition</strong></em>
                </p>
                <div style="background: #fff3e0; border-radius: 12px; padding: 12px 16px; border-left: 4px solid #ff9800;">
                    <div style="font-size: 0.9rem; color: #856404; font-weight: 400;">
                        💡 <strong>重要（じゅうよう）な ポイント / Key Point:</strong> 読（よ）み方（かた）を 単独（たんどく）で 覚（おぼ）えるのは 効率（こうりつ）が よくありません。<br>
                        <em>Don't memorize readings in isolation. Learn kanji through <strong>vocabulary words</strong>.</em>
                    </div>
                </div>
            </div>
            
            <!-- SECTION 2: Radicals & Mnemonics -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">2. 部首（ぶしゅ）と 連想（れんそう） / Radicals &amp; Mnemonics</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    漢字（かんじ）を <strong>部品（ぶひん）</strong> に 分（わ）けて、意味（いみ）を 連想（れんそう）します。
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>Break kanji into component parts and create <strong>visual stories</strong> to remember them.</em>
                </p>
                
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">部首（ぶしゅ）<br><span style="font-weight: 400; font-size: 0.8rem;">Radical</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">意味（いみ）<br><span style="font-weight: 400; font-size: 0.8rem;">Meaning</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">例（れい）<br><span style="font-weight: 400; font-size: 0.8rem;">Example</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">亻 (ひと)</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Person</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" style="cursor: pointer;">休（きゅう） - person leaning on tree</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">木 (き)</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Tree</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" style="cursor: pointer;">休, 林, 森</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">日 (ひ)</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Sun / Day</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" style="cursor: pointer;">時（じ）, 明（めい）, 曜（よう）</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">月 (つき)</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Moon / Month</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" style="cursor: pointer;">月（つき）, 期（き）</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">口 (くち)</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Mouth</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" style="cursor: pointer;">食（しょく）, 話（わ）</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">氵 (さんずい)</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Water</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" style="cursor: pointer;">海（かい）, 洗（せん）</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">心 (こころ)</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Heart</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" style="cursor: pointer;">思（し）, 意（い）</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="example-box" style="background: #f5f5f0; border-radius: 12px; padding: 16px; margin-bottom: 8px; cursor: pointer;" onclick="if(typeof speakText==='function'){speakText('きゅう')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('きゅう');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}">
                    <div style="font-size: 1.1rem; color: #000000; font-weight: 500;">💡 <strong>例（れい） / Example:</strong> 休（きゅう）</div>
                    <div style="color: #444444; font-weight: 400; font-size: 0.95rem;">
                        亻 (person) + 木 (tree) = person leaning against a tree → <strong>rest</strong>
                    </div>
                    <div style="color: #888888; font-size: 0.7rem; margin-top: 4px;">🔊 Click to listen</div>
                </div>
            </div>
            
            <!-- SECTION 3: Learn in Context -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">3. 文脈（ぶんみゃく）で 学（まな）ぶ / Learn in Context (Vocabulary)</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    読（よ）み方（かた）を 単独（たんどく）で 覚（おぼ）えるのでは なく、<strong>実際（じっさい）の 単語（たんご）</strong> で 学（まな）びます。
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>Instead of memorizing readings alone, learn kanji through <strong>actual vocabulary words</strong>.</em>
                </p>
                
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">漢字（かんじ）<br><span style="font-weight: 400; font-size: 0.8rem;">Kanji</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">単語（たんご）<br><span style="font-weight: 400; font-size: 0.8rem;">Vocabulary</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">読（よ）み方（かた）<br><span style="font-weight: 400; font-size: 0.8rem;">Reading</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">意味（いみ）<br><span style="font-weight: 400; font-size: 0.8rem;">Meaning</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">日 (にち)</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">日本（にほん）</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('にほん')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('にほん');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">にほん 🔊</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Japan</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">本 (ほん)</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">日本（にほん）</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('にほん')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('にほん');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">にほん 🔊</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">Japan</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">食 (しょく)</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">食（た）べる</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('たべる')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('たべる');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">たべる 🔊</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">to eat</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">行 (こう)</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">行（い）く</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;" class="example-click" onclick="if(typeof speakText==='function'){speakText('いく')}else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('いく');u.lang='ja-JP';u.rate=0.85;window.speechSynthesis.speak(u)}" style="cursor: pointer;">いく 🔊</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">to go</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style="background: #e8f0e7; border-radius: 12px; padding: 12px 16px; border-left: 4px solid #6c8b6b;">
                    <div style="font-size: 0.9rem; color: #000000; font-weight: 400;">
                        💡 <strong>ヒント / Tip:</strong> 「日本」を 覚（おぼ）えれば、「日」と「本」の 読（よ）み方（かた）が <strong>自然（しぜん）に</strong> 身（み）につきます。
                    </div>
                </div>
            </div>
            
            <!-- SECTION 4: Basic Stroke Order -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">4. 筆順（ひつじゅん）の 基本（きほん） / Basic Stroke Order</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    筆順（ひつじゅん）の 基本（きほん）ルールを 覚（おぼ）えると、書（か）くのが 楽（らく）になり、自然（しぜん）な 字（じ）に 見（み）えます。
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em>Learning basic stroke order rules makes writing easier and your kanji look more natural.</em>
                </p>
                
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">ルール<br><span style="font-weight: 400; font-size: 0.8rem;">Rule</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">説明（せつめい）<br><span style="font-weight: 400; font-size: 0.8rem;">Explanation</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">例（れい）<br><span style="font-weight: 400; font-size: 0.8rem;">Example</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">1</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">左（ひだり）から 右（みぎ）へ<br><span style="font-size: 0.8rem;">Left to right</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">一, 二, 三</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">2</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">上（うえ）から 下（した）へ<br><span style="font-size: 0.8rem;">Top to bottom</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">二, 三, 十</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">3</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">外（そと）から 内（うち）へ<br><span style="font-size: 0.8rem;">Outside to inside</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">口, 国, 図</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">4</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">水平（すいへい）の 前（まえ）に 垂直（すいちょく）<br><span style="font-size: 0.8rem;">Horizontal before vertical</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">十, 王, 土</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- SECTION 5: Effective Review -->
            <div class="learn-section" style="margin-bottom: 28px;">
                <h3 style="color: #000000; font-weight: 700; font-size: 1.2rem; margin-bottom: 8px;">5. 効果的（こうかてき）な 復習（ふくしゅう） / Effective Review</h3>
                <p style="color: #000000; font-weight: 400; font-size: 1rem; margin-bottom: 8px;">
                    <strong>間隔（かんかく）を 置（お）いた 復習（ふくしゅう）</strong> は 記憶（きおく）を 定着（ていちゃく）させる 最善（さいぜん）の 方法（ほうほう）です。
                </p>
                <p style="color: #555555; font-weight: 400; font-size: 0.95rem; margin-bottom: 12px;">
                    <em><strong>Spaced Repetition</strong> is the best way to solidify kanji in your long-term memory.</em>
                </p>
                
                <div style="overflow-x: auto; margin-bottom: 16px;">
                    <table style="width: 100%; border-collapse: collapse; background: #faf8f5; border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr style="background: #e8e0d5;">
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">ツール<br><span style="font-weight: 400; font-size: 0.8rem;">Tool</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">特徴（とくちょう）<br><span style="font-weight: 400; font-size: 0.8rem;">Features</span></th>
                                <th style="padding: 10px 16px; text-align: left; color: #000000; font-weight: 600; border-bottom: 2px solid #d4cbbc;">おすすめ<br><span style="font-weight: 400; font-size: 0.8rem;">Recommendation</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">Anki</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">フラッシュカード + SRS<br><span style="font-size: 0.8rem;">Flashcards + SRS</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">⭐⭐⭐⭐⭐ 最も（もっとも）人気（にんき）</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e8e0d5;">
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">WaniKani</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">ゲーム形式（けいしき）で 学習（がくしゅう）<br><span style="font-size: 0.8rem;">Gamified learning</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">⭐⭐⭐⭐⭐ 初心者（しょしんしゃ）に 最適（さいてき）</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 500;">Renshuu</td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">無料（むりょう）で 多機能（たきのう）<br><span style="font-size: 0.8rem;">Free &amp; multifunctional</span></td>
                                <td style="padding: 8px 16px; color: #000000; font-weight: 400;">⭐⭐⭐⭐ カスタマイズ 可能（かのう）</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style="background: #e8f0fe; border-radius: 12px; padding: 12px 16px; border-left: 4px solid #1e4b6e;">
                    <div style="font-size: 0.9rem; color: #1e4b6e; font-weight: 400;">
                        💡 <strong>おすすめの 勉強法（べんきょうほう） / Recommended Study Method:</strong><br>
                        1. 5-10個（こ）の 新（あたら）しい 漢字（かんじ）を 学（まな）ぶ<br>
                        2. その 日（ひ）の 終（お）わりに 復習（ふくしゅう）する<br>
                        3. 翌日（よくじつ）に もう 一度（いちど） 復習（ふくしゅう）する<br>
                        4. 1週間（しゅうかん）後（ご）に 再（ふたた）び 復習（ふくしゅう）する
                    </div>
                </div>
            </div>
            
            // ... (rest of renderLearnTab content remains the same) ...
            
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

// Load mastered from localStorage
function loadMasteredKanji() {
    const stored = localStorage.getItem('masteredKanji');
    if (stored) {
        masteredKanji = new Set(JSON.parse(stored));
    }
    const storedAttempted = localStorage.getItem('attemptedKanji');
    if (storedAttempted) {
        attemptedKanji = new Set(JSON.parse(storedAttempted));
    }
    updateMasteredCount();
}

function saveMasteredKanji() {
    localStorage.setItem('masteredKanji', JSON.stringify([...masteredKanji]));
    localStorage.setItem('attemptedKanji', JSON.stringify([...attemptedKanji]));
    updateMasteredCount();
}

function updateMasteredCount() {
    const total = kanjiData.length;
    const mastered = masteredKanji.size;
    const attempted = attemptedKanji.size;
    
    const masteredCountSpan = document.getElementById('masteredCount');
    const totalCountSpan = document.getElementById('totalCount');
    if (masteredCountSpan) masteredCountSpan.innerText = mastered;
    if (totalCountSpan) totalCountSpan.innerText = total;
    
    const quizMasteredEl = document.getElementById('quizMasteredCount');
    const quizAttemptedEl = document.getElementById('quizAttemptedCount');
    const quizTotalEl = document.getElementById('quizTotalKanji');
    const quizTotalEl2 = document.getElementById('quizTotalKanji2');
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
    const container = document.getElementById('masteredList');
    if (!container) return;
    
    const masteredIds = [...masteredKanji];
    
    if (masteredIds.length === 0) {
        container.innerHTML = '<p class="empty-message">No kanji mastered yet. Complete a quiz to master them!</p>';
        return;
    }
    
    let html = '';
    for (const kanjiId of masteredIds) {
        const kanji = kanjiData.find(k => k.id === kanjiId);
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
    
    document.querySelectorAll('.unmaster-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const kanjiId = btn.dataset.kanjiId;
            unmarkKanjiMastered(kanjiId);
        });
    });
}

// Helper function to display a sentence with proper furigana handling
function displaySentenceWithFurigana(sentence) {
    if (!sentence) return '';
    
    if (typeof getWordMeaningsForSentence === 'function' && typeof createQuizWordTooltips === 'function') {
        const wordMeanings = getWordMeaningsForSentence({ jp: sentence });
        if (wordMeanings && wordMeanings.length > 0) {
            if (furiganaHidden) {
                const cleanSentence = sentence.replace(/[（(][^）)]*[）)]/g, '').trim();
                const cleanWordMeanings = getWordMeaningsForSentence({ jp: cleanSentence });
                return createQuizWordTooltips(cleanSentence, cleanWordMeanings);
            }
            return createQuizWordTooltips(sentence, wordMeanings);
        }
    }
    return addFuriganaToText(sentence);
}

// RENDER KANJI LIST - MAIN FUNCTION
function renderKanjiList() {
    const container = document.getElementById('kanjiList');
    if (!container) {
        console.log('Container not found');
        return;
    }
    
    let filteredKanji = [...kanjiData];
    
    if (currentSearchTerm) {
        const searchLower = currentSearchTerm.toLowerCase();
        filteredKanji = filteredKanji.filter(k => 
            k.kanji.includes(currentSearchTerm) ||
            k.meaning.toLowerCase().includes(searchLower) ||
            (k.onyomi && k.onyomi.toLowerCase().includes(searchLower)) ||
            (k.kunyomi && k.kunyomi.toLowerCase().includes(searchLower))
        );
    }
    
    let html = '<div class="kanji-grid">';
    
    for (const kanji of filteredKanji) {
        const isMastered = masteredKanji.has(kanji.id);
        
        const onyomiAttr = (kanji.onyomi || '-').replace(/"/g, '&quot;');
        const kunyomiAttr = (kanji.kunyomi || '-').replace(/"/g, '&quot;');
        
        let exampleSentences = [];
        if (kanji.examples && kanji.examples.length > 0) {
            exampleSentences = kanji.examples;
        } else {
            exampleSentences = findSentencesForKanji(kanji.kanji);
        }
        
        let examplesHtml = '';
        if (exampleSentences.length > 0) {
            examplesHtml = exampleSentences.map(ex => {
                let displayJp = displaySentenceWithFurigana(ex.sentence);
                const reading = ex.reading || ex.sentence.replace(/[（(][^）)]*[）)]/g, '').trim();
                
                return `
                    <div class="example-item" data-reading="${reading}" data-sentence="${ex.sentence || ''}">
                        <div class="example-jp">${displayJp}</div>
                        <div class="example-trans">${ex.english}</div>
                        <button class="small-btn example-tts-btn" style="margin-top: 6px; font-size: 0.7rem; background: #6c8b6b; color: white; border: none; padding: 2px 12px; border-radius: 20px; cursor: pointer;" data-reading="${reading}">🔊 Listen</button>
                    </div>
                `;
            }).join('');
        } else {
            examplesHtml = '<p style="color: #999; font-style: italic;">No examples available</p>';
        }
        
        html += `
            <div class="kanji-card ${isMastered ? 'mastered' : ''}" data-kanji-id="${kanji.id}">
                <div class="kanji-header-card">
                    <span class="kanji-pattern">${kanji.kanji}</span>
                    <span class="kanji-meaning">${kanji.meaning}</span>
                    ${isMastered ? '<span class="mastered-badge">✓ Mastered</span>' : ''}
                </div>
                <div class="kanji-readings">
                    <div>
                        <strong>On'yomi:</strong> 
                        <span class="reading-value">${kanji.onyomi || '-'}</span>
                        <button class="tts-reading-btn small-btn" data-text="${onyomiAttr}" data-lang="ja-JP" style="margin-left: 8px; padding: 2px 8px; font-size: 0.7rem;">🔊</button>
                    </div>
                    <div>
                        <strong>Kun'yomi:</strong> 
                        <span class="reading-value">${kanji.kunyomi || '-'}</span>
                        <button class="tts-reading-btn small-btn" data-text="${kunyomiAttr}" data-lang="ja-JP" style="margin-left: 8px; padding: 2px 8px; font-size: 0.7rem;">🔊</button>
                    </div>
                </div>
                <div class="kanji-examples">
                    <h4>📝 Example Sentences <span style="font-weight:normal;font-size:0.7rem;color:#999;">(click to listen)</span></h4>
                    ${examplesHtml}
                </div>
                <div class="kanji-buttons">
                    <button class="small-btn mark-mastered-btn" data-kanji-id="${kanji.id}">
                        ${isMastered ? '✓ Mastered' : '✓ Mark as Mastered'}
                    </button>
                    <button class="small-btn stroke-order-btn" data-kanji="${kanji.kanji}" data-unicode="${getUnicodeHex(kanji.kanji)}" data-meaning="${kanji.meaning}">
                        ✍️ Stroke Order
                    </button>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    
    if (filteredKanji.length === 0) {
        html = '<p style="text-align: center; padding: 40px;">No kanji match your search.</p>';
    }
    
    container.innerHTML = html;
    console.log('Kanji list rendered, count:', filteredKanji.length);
    
    if (typeof attachQuizTooltipsGlobal === 'function') {
        setTimeout(attachQuizTooltipsGlobal, 50);
    } else if (typeof attachQuizTooltips === 'function') {
        setTimeout(attachQuizTooltips, 50);
    } else if (typeof attachTooltipLongPress === 'function') {
        setTimeout(() => attachTooltipLongPress(container), 50);
    }
}

// ========== EVENT DELEGATION ==========
function setupDelegation() {
    const container = document.getElementById('kanjiList');
    if (!container) return;
    
    container.addEventListener('click', function(e) {
        const btn = e.target.closest('.stroke-order-btn');
        if (!btn) return;
        e.stopPropagation();
        
        const kanji = btn.dataset.kanji;
        const unicode = btn.dataset.unicode;
        const meaning = btn.dataset.meaning;
        
        if (typeof showStrokeOrder === 'function') {
            showStrokeOrder(kanji, unicode, meaning);
        } else {
            console.error('showStrokeOrder is not defined!');
            alert('Stroke order feature not available. Please check console.');
        }
    });
    
    container.addEventListener('click', function(e) {
        const btn = e.target.closest('.mark-mastered-btn');
        if (!btn) return;
        e.stopPropagation();
        
        const kanjiId = btn.dataset.kanjiId;
        if (masteredKanji.has(kanjiId)) {
            unmarkKanjiMastered(kanjiId);
        } else {
            markKanjiMastered(kanjiId, true);
        }
    });
    
    container.addEventListener('click', function(e) {
        const btn = e.target.closest('.tts-reading-btn');
        if (!btn) return;
        e.stopPropagation();
        
        const text = btn.dataset.text;
        const lang = btn.dataset.lang || 'ja-JP';
        if (text && text !== '-') {
            speakText(text, lang);
        }
    });
    
    container.addEventListener('click', function(e) {
        const item = e.target.closest('.example-item');
        if (!item) return;
        e.stopPropagation();
        
        if (e.target.closest('.example-tts-btn')) {
            const btn = e.target.closest('.example-tts-btn');
            const btnReading = btn.dataset.reading || item.dataset.reading || '';
            if (btnReading) {
                speakText(btnReading, 'ja-JP');
            }
            return;
        }
        
        const reading = item.dataset.reading;
        if (reading && reading.trim() !== '') {
            speakText(reading, 'ja-JP');
        } else {
            const sentence = item.dataset.sentence || '';
            const cleanSentence = sentence.replace(/[（(][^）)]*[）)]/g, '').trim();
            if (cleanSentence) {
                speakText(cleanSentence, 'ja-JP');
            }
        }
    });
}

function applyFuriganaHide() {
    furiganaHidden = !furiganaHidden;
    if (furiToggleBtn) {
        furiToggleBtn.innerText = furiganaHidden ? '🔤 Furigana On' : '🔤 Furigana Off';
    }
    renderKanjiList();
    renderLearnTab();
    renderMasteredList();
    
    if (kanjiQuizState && kanjiQuizState.isActive && kanjiQuizState.questions.length > 0) {
        renderKanjiQuizQuestion();
    }
}

// ===== UPDATED switchTab function with learn tab support =====
function switchTab(tabId) {
    currentKanjiTab = tabId;
    
    // ===== ADD tabLearnBtn to the array =====
    const tabButtons = [tabListBtn, tabLearnBtn, tabQuizBtn, tabMasteredBtn];
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
    
    if (tabId === 'list') {
        renderKanjiList();
    } else if (tabId === 'learn') {
        renderLearnTab();  // ===== ADD THIS CASE =====
    } else if (tabId === 'mastered') {
        renderMasteredList();
    } else if (tabId === 'quiz') {
        updateMasteredCount();
        const quizArea = document.getElementById('quizArea');
        if (quizArea && !quizArea.innerHTML.includes('quiz-welcome')) {
            if (!quizArea.innerHTML || quizArea.innerHTML.trim() === '') {
                quizArea.innerHTML = `
                    <p class="quiz-welcome" style="text-align: center; color: #666; padding: 40px; font-size: 1rem;">
                        Select a mode and number of questions, then click <strong>"Start New Quiz"</strong>
                    </p>
                `;
            }
        }
        if (kanjiQuizState && kanjiQuizState.isActive && kanjiQuizState.questions.length > 0) {
            renderKanjiQuizQuestion();
        }
    }
}

// ==================== QUIZ FUNCTIONS ====================
// ... (rest of the quiz functions remain the same) ...

function getSelectedQuizMode() {
    const modeRadios = document.querySelectorAll('input[name="quizMode"]');
    for (const radio of modeRadios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return 'kanji_to_reading';
}

function getReadingModes(kanji) {
    const readings = [];
    
    const onyomiList = kanji.onyomi ? kanji.onyomi.split(/[、,，\s]+/).filter(r => r && r !== '-') : [];
    const kunyomiList = kanji.kunyomi ? kanji.kunyomi.split(/[、,，\s]+/).filter(r => r && r !== '-') : [];
    
    for (const r of onyomiList) {
        readings.push({ reading: r, type: 'on' });
    }
    for (const r of kunyomiList) {
        readings.push({ reading: r, type: 'kun' });
    }
    
    return readings;
}

function generateKanjiQuiz() {
    console.log('generateKanjiQuiz called!');
    
    const quizArea = document.getElementById('quizArea');
    const resultsDiv = document.getElementById('quizResults');
    if (!quizArea) return;
    if (resultsDiv) resultsDiv.style.display = 'none';
    
    const selectedMode = getSelectedQuizMode();
    console.log('Selected mode:', selectedMode);
    
    const questionCount = parseInt(document.getElementById('quizCountSelect')?.value) || 10;
    
    const availableKanji = kanjiData.filter(k => k.examples && k.examples.length > 0);
    
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
        [availableKanji[i], availableKanji[j]] = [availableKanji[j], availableKanji[i]];
    }
    
    const questions = [];
    const usedKanji = new Set();
    const kanjiPool = availableKanji.slice(0, questionCount * 2);
    
    // ... (rest of quiz generation remains the same) ...
    
    // For brevity, I'm showing the key fix. The full quiz functions remain unchanged.
}

// ... (rest of the file - renderKanjiQuizQuestion, toggleShowAnswer, checkKanjiQuizAnswer, stopKanjiQuiz, showKanjiQuizResults, attachStartQuizListener, resetAllProgress, resetMasteredOnly, event listeners, initKanji) ...

// Event Listeners
if (furiToggleBtn) {
    furiToggleBtn.addEventListener('click', applyFuriganaHide);
}

if (kanjiSearchInput) {
    kanjiSearchInput.addEventListener('input', () => {
        currentSearchTerm = kanjiSearchInput.value;
        renderKanjiList();
    });
}

if (tabListBtn) tabListBtn.addEventListener('click', () => switchTab('list'));
if (tabLearnBtn) tabLearnBtn.addEventListener('click', () => switchTab('learn'));
if (tabQuizBtn) tabQuizBtn.addEventListener('click', () => switchTab('quiz'));
if (tabMasteredBtn) tabMasteredBtn.addEventListener('click', () => switchTab('mastered'));

if (resetAllProgressBtn) resetAllProgressBtn.addEventListener('click', resetAllProgress);
if (resetMasteredOnlyBtn) resetMasteredOnlyBtn.addEventListener('click', resetMasteredOnly);

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

function initKanji() {
    console.log('Initializing kanji module...');
    loadMasteredKanji();
    renderKanjiList();
    renderLearnTab();
    updateMasteredCount();
    switchTab('list');
    setupDelegation();
    attachStartQuizListener();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKanji);
} else {
    initKanji();
}