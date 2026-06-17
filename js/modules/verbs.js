// ==================== VERBS MODULE ====================

let currentVerbTab = 'conjugation';
let furiganaHidden = false;
let masteredVerbs = new Set();
let attemptedVerbs = new Set();
let currentQuiz = [];
let currentQuizIndex = 0;
let quizAnswers = [];
let quizActive = false;
let quizMode = 'easy';
let quizScore = 0;
let quizAttemptsRemaining = {};
let currentFilterGroup = 'all';
let currentSearchTerm = '';

// DOM Elements
const furiToggleBtn = document.getElementById('furiToggleBtn');
const tabConjugationBtn = document.getElementById('tabConjugationBtn');
const tabQuizBtn = document.getElementById('tabQuizBtn');
const tabMasteredBtn = document.getElementById('tabMasteredBtn');
const quizEasyModeBtn = document.getElementById('quizEasyModeBtn');
const quizHardModeBtn = document.getElementById('quizHardModeBtn');
const groupSelect = document.getElementById('groupSelect');
const verbSearchInput = document.getElementById('verbSearchInput');

// Add furigana to text based on toggle state
function addFuriganaToText(text) {
    if (!text) return '';
    // When furiganaHidden = true, remove furigana (show plain text without parentheses)
    if (furiganaHidden) {
        return text.replace(/[（(][^）)]*[）)]/g, '');
    } else {
        // Add ruby HTML for furigana - convert "漢字（かんじ）" to <ruby>漢字<rt>かんじ</rt></ruby>
        return text.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => {
            return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
        });
    }
}

// Strip furigana for dropdown values (always plain text, no parentheses)
function stripFuriganaForDropdown(text) {
    if (!text) return '';
    return text.replace(/[（(][^）)]*[）)]/g, '');
}

// Format dictionary for display with proper furigana per kanji
function formatDictionaryForDisplay(verb) {
    const dict = verb.dictionary;
    const reading = verb.reading;
    
    // Handle special cases with known patterns
    // 食べる -> 食（た）べる
    if (dict === '食べる') {
        const displayText = '食（た）べる';
        return addFuriganaToText(displayText);
    }
    // 見る -> 見（み）る
    if (dict === '見る') {
        const displayText = '見（み）る';
        return addFuriganaToText(displayText);
    }
    // 寝る -> 寝（ね）る
    if (dict === '寝る') {
        const displayText = '寝（ね）る';
        return addFuriganaToText(displayText);
    }
    // 起きる -> 起（お）きる
    if (dict === '起きる') {
        const displayText = '起（お）きる';
        return addFuriganaToText(displayText);
    }
    // 教える -> 教（おし）える
    if (dict === '教える') {
        const displayText = '教（おし）える';
        return addFuriganaToText(displayText);
    }
    // 開ける -> 開（あ）ける
    if (dict === '開ける') {
        const displayText = '開（あ）ける';
        return addFuriganaToText(displayText);
    }
    // 会う -> 会（あ）う
    if (dict === '会う') {
        const displayText = '会（あ）う';
        return addFuriganaToText(displayText);
    }
    // 遊ぶ -> 遊（あそ）ぶ
    if (dict === '遊ぶ') {
        const displayText = '遊（あそ）ぶ';
        return addFuriganaToText(displayText);
    }
    // 行く -> 行（い）く
    if (dict === '行く') {
        const displayText = '行（い）く';
        return addFuriganaToText(displayText);
    }
    // 話す -> 話（はな）す
    if (dict === '話す') {
        const displayText = '話（はな）す';
        return addFuriganaToText(displayText);
    }
    // 読む -> 読（よ）む
    if (dict === '読む') {
        const displayText = '読（よ）む';
        return addFuriganaToText(displayText);
    }
    // 飲む -> 飲（の）む
    if (dict === '飲む') {
        const displayText = '飲（の）む';
        return addFuriganaToText(displayText);
    }
    // 買う -> 買（か）う
    if (dict === '買う') {
        const displayText = '買（か）う';
        return addFuriganaToText(displayText);
    }
    // 帰る -> 帰（かえ）る
    if (dict === '帰る') {
        const displayText = '帰（かえ）る';
        return addFuriganaToText(displayText);
    }
    // 書く -> 書（か）く
    if (dict === '書く') {
        const displayText = '書（か）く';
        return addFuriganaToText(displayText);
    }
    // 待つ -> 待（ま）つ
    if (dict === '待つ') {
        const displayText = '待（ま）つ';
        return addFuriganaToText(displayText);
    }
    // する
    if (dict === 'する') {
        return addFuriganaToText('する');
    }
    // 来る -> 来（く）る
    if (dict === '来る') {
        const displayText = '来（く）る';
        return addFuriganaToText(displayText);
    }
    // 勉強する -> 勉強（べんきょう）する
    if (dict === '勉強する') {
        const displayText = '勉強（べんきょう）する';
        return addFuriganaToText(displayText);
    }
    // 散歩する -> 散歩（さんぽ）する
    if (dict === '散歩する') {
        const displayText = '散歩（さんぽ）する';
        return addFuriganaToText(displayText);
    }
    // 旅行する -> 旅行（りょこう）する
    if (dict === '旅行する') {
        const displayText = '旅行（りょこう）する';
        return addFuriganaToText(displayText);
    }
    
    // Default fallback
    const displayText = `${dict}（${reading}）`;
    return addFuriganaToText(displayText);
}

function loadMasteredVerbs() {
    const stored = localStorage.getItem('masteredVerbs');
    if (stored) {
        masteredVerbs = new Set(JSON.parse(stored));
    }
    const storedAttempted = localStorage.getItem('attemptedVerbs');
    if (storedAttempted) {
        attemptedVerbs = new Set(JSON.parse(storedAttempted));
    }
    updateMasteredCount();
}

function saveMasteredVerbs() {
    localStorage.setItem('masteredVerbs', JSON.stringify([...masteredVerbs]));
    localStorage.setItem('attemptedVerbs', JSON.stringify([...attemptedVerbs]));
    updateMasteredCount();
}

function updateMasteredCount() {
    const total = verbOrder.length;
    const mastered = masteredVerbs.size;
    const attempted = attemptedVerbs.size;
    const countEl = document.getElementById('masteredCount');
    const totalEl = document.getElementById('totalCount');
    if (countEl) countEl.innerText = mastered;
    if (totalEl) totalEl.innerText = total;
    
    const quizMasteredEl = document.getElementById('quizMasteredCount');
    const quizAttemptedEl = document.getElementById('quizAttemptedCount');
    const quizTotalEl = document.getElementById('quizTotalVerbs');
    const quizTotalEl2 = document.getElementById('quizTotalVerbs2');
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
        furiToggleBtn.innerText = furiganaHidden ? '🔤 Furigana On' : '🔤 Furigana Off';
    }
    renderVerbsList();
    renderMasteredList();
    if (quizActive && currentQuiz.length > 0) {
        renderQuizQuestion();
    }
}

function renderVerbsList() {
    const container = document.getElementById('verbsList');
    if (!container) return;
    
    let filteredVerbs = [...verbsData];
    
    if (currentFilterGroup !== 'all') {
        filteredVerbs = filteredVerbs.filter(v => v.group === parseInt(currentFilterGroup));
    }
    
    if (currentSearchTerm) {
        const searchLower = currentSearchTerm.toLowerCase();
        filteredVerbs = filteredVerbs.filter(v => 
            v.dictionary.toLowerCase().includes(searchLower) ||
            v.reading.toLowerCase().includes(searchLower) ||
            v.meaning.toLowerCase().includes(searchLower)
        );
    }
    
    let html = '';
    
    for (const verb of filteredVerbs) {
        const isMastered = masteredVerbs.has(verb.id);
        const groupClass = `group-${verb.group}`;
        const groupName = verb.group === 1 ? 'Group 1 (Godan)' : verb.group === 2 ? 'Group 2 (Ichidan)' : 'Group 3 (Irregular)';
        
        let examplesHtml = '';
        const exampleTypes = ['masu', 'nai', 'te', 'ta', 'potential', 'volitional', 'conditional'];
        const displayNames = {
            masu: 'Present (Polite)',
            nai: 'Negative',
            te: 'Te-form',
            ta: 'Past',
            potential: 'Potential',
            volitional: 'Volitional',
            conditional: 'Conditional'
        };
        
        for (const type of exampleTypes) {
            const ex = verb.examples[type];
            if (ex) {
                let displayJp = addFuriganaToText(ex.sentence);
                examplesHtml += `
                    <div class="example-item" data-reading="${ex.sentence.replace(/[（(][^）)]*[）)]/g, '')}">
                        <div class="example-jp" style="font-size: 1rem;">${displayJp}</div>
                        <div class="example-trans" style="font-size: 0.85rem;">→ ${ex.translation}</div>
                        <div style="font-size: 0.7rem; color: #888; margin-top: 4px;">${displayNames[type]}</div>
                    </div>
                `;
            }
        }
        
        const dictDisplay = formatDictionaryForDisplay(verb);
        
        html += `
            <div class="verb-card ${isMastered ? 'mastered' : ''}" data-verb-id="${verb.id}" style="margin-bottom: 16px; padding: 16px;">
                <div class="verb-header" style="margin-bottom: 12px;">
                    <div>
                        <span class="verb-title" style="font-size: 1.3rem;">${dictDisplay}</span>
                        ${isMastered ? '<span class="mastered-badge" style="font-size: 0.7rem;">✓ Mastered</span>' : ''}
                    </div>
                    <div>
                        <span class="verb-meaning" style="font-size: 0.9rem;">${verb.meaning}</span>
                        <span class="group-badge ${groupClass}" style="font-size: 0.7rem;">${groupName}</span>
                    </div>
                </div>
                
                <div class="conjugation-table" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 8px;">
                    <div class="conj-item" style="padding: 8px;">
                        <div class="conj-label" style="font-size: 0.65rem;">Present</div>
                        <div class="conj-value" style="font-size: 0.95rem;">${addFuriganaToText(verb.conjugations.masu)}</div>
                    </div>
                    <div class="conj-item" style="padding: 8px;">
                        <div class="conj-label" style="font-size: 0.65rem;">Negative</div>
                        <div class="conj-value" style="font-size: 0.95rem;">${addFuriganaToText(verb.conjugations.nai)}</div>
                    </div>
                    <div class="conj-item" style="padding: 8px;">
                        <div class="conj-label" style="font-size: 0.65rem;">Te-form</div>
                        <div class="conj-value" style="font-size: 0.95rem;">${addFuriganaToText(verb.conjugations.te)}</div>
                    </div>
                    <div class="conj-item" style="padding: 8px;">
                        <div class="conj-label" style="font-size: 0.65rem;">Past</div>
                        <div class="conj-value" style="font-size: 0.95rem;">${addFuriganaToText(verb.conjugations.ta)}</div>
                    </div>
                    <div class="conj-item" style="padding: 8px;">
                        <div class="conj-label" style="font-size: 0.65rem;">Potential</div>
                        <div class="conj-value" style="font-size: 0.95rem;">${addFuriganaToText(verb.conjugations.potential)}</div>
                    </div>
                    <div class="conj-item" style="padding: 8px;">
                        <div class="conj-label" style="font-size: 0.65rem;">Volitional</div>
                        <div class="conj-value" style="font-size: 0.95rem;">${addFuriganaToText(verb.conjugations.volitional)}</div>
                    </div>
                    <div class="conj-item" style="padding: 8px;">
                        <div class="conj-label" style="font-size: 0.65rem;">Conditional</div>
                        <div class="conj-value" style="font-size: 0.95rem;">${addFuriganaToText(verb.conjugations.conditional)}</div>
                    </div>
                </div>
                
                <div class="verb-examples" style="margin: 12px 0; padding: 10px;">
                    <h4 style="font-size: 0.9rem; margin-bottom: 8px;">📝 Examples</h4>
                    ${examplesHtml}
                </div>
                
                <button class="small-btn mark-mastered-btn" data-verb-id="${verb.id}" style="font-size: 0.85rem; padding: 8px 16px;">
                    ${isMastered ? '✓ Mastered' : '✓ Mark as Mastered'}
                </button>
            </div>
        `;
    }
    
    if (filteredVerbs.length === 0) {
        html = '<p style="text-align: center; padding: 40px;">No verbs match your filters.</p>';
    }
    
    container.innerHTML = html;
    
    document.querySelectorAll('.example-item').forEach(el => {
        const reading = el.dataset.reading;
        if (reading && typeof speakText === 'function') {
            el.addEventListener('click', () => speakText(reading));
        }
    });
    
    document.querySelectorAll('.mark-mastered-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const verbId = btn.dataset.verbId;
            if (masteredVerbs.has(verbId)) {
                unmarkVerbMastered(verbId);
            } else {
                markVerbMastered(verbId, true);
            }
        });
    });
}

function renderMasteredList() {
    const container = document.getElementById('masteredList');
    if (!container) return;
    
    const masteredIds = [...masteredVerbs];
    
    if (masteredIds.length === 0) {
        container.innerHTML = '<p class="empty-message" style="text-align: center; padding: 40px;">No verbs mastered yet. Complete a quiz to master verbs!</p>';
        return;
    }
    
    let html = '';
    for (const verbId of masteredIds) {
        const verb = getVerbById(verbId);
        if (verb) {
            const dictDisplay = formatDictionaryForDisplay(verb);
            html += `
                <div class="mastered-verb-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #eee;">
                    <div class="mastered-verb-info" style="display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap;">
                        <span class="mastered-verb-dict" style="font-size: 1rem; font-weight: bold;">${dictDisplay}</span>
                        <span class="mastered-verb-meaning" style="font-size: 0.8rem;">${verb.meaning}</span>
                    </div>
                    <button class="unmaster-btn" data-verb-id="${verb.id}" style="font-size: 0.7rem; padding: 4px 10px;">Remove</button>
                </div>
            `;
        }
    }
    
    container.innerHTML = html;
    
    document.querySelectorAll('.unmaster-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const verbId = btn.dataset.verbId;
            unmarkVerbMastered(verbId);
        });
    });
}

// ==================== QUIZ FUNCTIONS ====================

function generateQuiz() {
    console.log('generateQuiz called! Mode:', quizMode);
    setModeButtonsEnabled(false);
    
    const questionCount = parseInt(document.getElementById('quizCountSelect').value);
    const allQuestions = [];
    
    const availableVerbs = verbsData.filter(v => v.examples);
    
    if (availableVerbs.length === 0) {
        const quizArea = document.getElementById('quizArea');
        if (quizArea) {
            quizArea.innerHTML = '<p class="quiz-welcome">No verbs with examples available for quiz.</p>';
        }
        setModeButtonsEnabled(true);
        return;
    }
    
    for (let i = availableVerbs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableVerbs[i], availableVerbs[j]] = [availableVerbs[j], availableVerbs[i]];
    }
    
    const conjugationTypes = ['masu', 'nai', 'te', 'ta', 'potential', 'volitional', 'conditional'];
    const displayNames = {
        masu: 'Present',
        nai: 'Negative',
        te: 'Te-form',
        ta: 'Past',
        potential: 'Potential',
        volitional: 'Volitional',
        conditional: 'Conditional'
    };
    
    for (const verb of availableVerbs) {
        if (allQuestions.length >= questionCount) break;
        
        const randomConj = conjugationTypes[Math.floor(Math.random() * conjugationTypes.length)];
        const example = verb.examples[randomConj];
        
        if (!example) continue;
        
        const correctForm = verb.conjugations[randomConj];
        
        let sentenceWithBlank = example.sentence;
        const verbFormInSentence = verb.conjugations[randomConj];
        
        if (sentenceWithBlank.includes(verbFormInSentence)) {
            sentenceWithBlank = sentenceWithBlank.replace(verbFormInSentence, '______');
        } else {
            const cleanForm = verbFormInSentence.replace(/[（(][^）)]*[）)]/g, '');
            sentenceWithBlank = sentenceWithBlank.replace(cleanForm, '______');
        }
        
        const easyOptions = [correctForm];
        const otherVerbs = availableVerbs.filter(v => v.id !== verb.id);
        
        while (easyOptions.length < 4 && otherVerbs.length > 0) {
            const randomVerb = otherVerbs[Math.floor(Math.random() * otherVerbs.length)];
            const randomOtherConj = conjugationTypes[Math.floor(Math.random() * conjugationTypes.length)];
            const otherForm = randomVerb.conjugations[randomOtherConj];
            if (!easyOptions.includes(otherForm) && otherForm !== correctForm) {
                easyOptions.push(otherForm);
            }
        }
        
        const fallbacks = ['行きます', '食べます', '見ます', '来ます', 'します'];
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
            verbMeaning: verb.meaning.replace('to ', ''),
            conjugationType: randomConj,
            conjugationDisplay: displayNames[randomConj],
            originalSentence: example.sentence,
            verbId: verb.id,
            conjugations: verb.conjugations,
            verb: verb
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
    
    const quizTitle = quizMode === 'easy' 
        ? "📝 Verb Conjugation Quiz - choose the correct verb"
        : "📝 Verb Conjugation Quiz - select the correct conjugation";
    
    const dictDisplay = formatDictionaryForDisplay(q.verb);
    
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #ddd;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                <span style="font-weight: bold; font-size: 1rem; color: #1e4b6e;">${quizTitle}</span>
                <span style="background: #e8f0fe; padding: 6px 14px; border-radius: 20px; font-size: 0.9rem;">📚 Dictionary: ${dictDisplay} (${q.verbMeaning})</span>
            </div>
            <div style="display: flex; gap: 16px;">
                <span style="font-weight: bold; font-size: 1rem; color: #6c8b6b;">⭐ Score: ${quizScore.toFixed(1)}</span>
                <span style="font-weight: bold; font-size: 1rem; color: #c45d1e;">❤️ ${attemptsLeft}</span>
            </div>
        </div>
        <div id="quizFeedbackArea"></div>
        <div style="background: #f9fcff; border-radius: 20px; padding: 20px; margin-bottom: 16px;">
            <div style="font-size: 1.4rem; text-align: center; margin: 16px 0; line-height: 1.5;">${addFuriganaToText(q.sentence)}</div>
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
                <button class="quiz-option-btn" data-answer="${opt}" style="background: ${isSelected ? '#6c8b6b' : '#fff'}; color: ${isSelected ? '#fff' : '#000'}; border: 2px solid #6c8b6b; border-radius: 40px; padding: 10px 18px; font-size: 1rem; cursor: pointer;">
                    ${addFuriganaToText(opt)}
                </button>
            `;
        }
        html += `</div>`;
    } else {
        // HARD MODE - Create an array of conjugation objects and shuffle them randomly
        const conjugationButtons = [
            { type: 'Present', value: q.conjugations.masu, display: addFuriganaToText(q.conjugations.masu) },
            { type: 'Negative', value: q.conjugations.nai, display: addFuriganaToText(q.conjugations.nai) },
            { type: 'Te-form', value: q.conjugations.te, display: addFuriganaToText(q.conjugations.te) },
            { type: 'Past', value: q.conjugations.ta, display: addFuriganaToText(q.conjugations.ta) },
            { type: 'Potential', value: q.conjugations.potential, display: addFuriganaToText(q.conjugations.potential) },
            { type: 'Volitional', value: q.conjugations.volitional, display: addFuriganaToText(q.conjugations.volitional) },
            { type: 'Conditional', value: q.conjugations.conditional, display: addFuriganaToText(q.conjugations.conditional) }
        ];
        
        // Fisher-Yates shuffle - randomizes order every time
        for (let i = conjugationButtons.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [conjugationButtons[i], conjugationButtons[j]] = [conjugationButtons[j], conjugationButtons[i]];
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
                <button class="hard-opt-btn" data-answer="${btn.value.replace(/"/g, '&quot;')}" style="background: ${isSelected ? '#6c8b6b' : '#fff'}; color: ${isSelected ? '#fff' : '#000'}; border: 2px solid #6c8b6b; border-radius: 40px; padding: 10px 18px; font-size: 1rem; cursor: pointer;">
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
    
    if (quizMode === 'easy') {
        document.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.quiz-option-btn').forEach(b => {
                    b.style.background = '#fff';
                    b.style.color = '#000';
                });
                btn.style.background = '#6c8b6b';
                btn.style.color = '#fff';
                const selectedAnswer = btn.dataset.answer;
                if (!quizAnswers[currentQuizIndex]) quizAnswers[currentQuizIndex] = {};
                quizAnswers[currentQuizIndex].selected = selectedAnswer;
            });
        });
    } else {
        document.querySelectorAll('.hard-opt-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.hard-opt-btn').forEach(b => {
                    b.style.background = '#fff';
                    b.style.color = '#000';
                });
                btn.style.background = '#6c8b6b';
                btn.style.color = '#fff';
                const selectedAnswer = btn.dataset.answer;
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
        
        const feedbackHtml = `
            <div style="background: #d4edda; color: #155724; padding: 12px; border-radius: 16px; margin: 12px 0;">
                ✅ ${isFirstAttempt ? 'Correct! +1 point' : 'Correct on 2nd try! +0.5 points'}
                <div style="margin-top: 8px; font-size: 0.85rem;">${addFuriganaToText(q.originalSentence)} → ${q.translation}</div>
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
            const feedbackHtml = `
                <div style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 16px; margin: 12px 0;">
                    ❌ Correct: ${addFuriganaToText(q.correctAnswer)} (${q.conjugationDisplay})
                    <div style="margin-top: 8px; font-size: 0.85rem;">${addFuriganaToText(q.originalSentence)} → ${q.translation}</div>
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
    
    const feedbackHtml = `
        <div style="background: #fff3e0; color: #856404; padding: 12px; border-radius: 16px; margin: 12px 0;">
            📖 Answer: ${addFuriganaToText(q.correctAnswer)} (${q.conjugationDisplay})
            <div style="margin-top: 8px; font-size: 0.85rem;">${addFuriganaToText(q.originalSentence)} → ${q.translation}</div>
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
    if (confirm('⚠️ Are you sure? This will reset ALL mastered and attempted verbs. This cannot be undone.')) {
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
    if (confirm('⚠️ Reset mastered verbs only? Attempted verbs will be preserved.')) {
        masteredVerbs.clear();
        saveMasteredVerbs();
        renderVerbsList();
        renderMasteredList();
        updateMasteredCount();
    }
}

function switchTab(tabId) {
    currentVerbTab = tabId;
    
    const tabButtons = [tabConjugationBtn, tabQuizBtn, tabMasteredBtn];
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
        renderVerbsList();
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

if (groupSelect) {
    groupSelect.addEventListener('change', () => {
        currentFilterGroup = groupSelect.value;
        renderVerbsList();
    });
}

if (verbSearchInput) {
    verbSearchInput.addEventListener('input', () => {
        currentSearchTerm = verbSearchInput.value;
        renderVerbsList();
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

if (tabConjugationBtn) tabConjugationBtn.addEventListener('click', () => switchTab('conjugation'));
if (tabQuizBtn) tabQuizBtn.addEventListener('click', () => switchTab('quiz'));
if (tabMasteredBtn) tabMasteredBtn.addEventListener('click', () => switchTab('mastered'));

function initVerbs() {
    loadMasteredVerbs();
    renderVerbsList();
    switchTab('conjugation');
    
    const totalVerbs = verbOrder.length;
    const totalEls = document.querySelectorAll('#quizTotalVerbs, #quizTotalVerbs2');
    totalEls.forEach(el => {
        if (el) el.innerText = totalVerbs;
    });
    
    attachStartQuizListener();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVerbs);
} else {
    initVerbs();
}