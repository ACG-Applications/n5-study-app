// ==================== ADJECTIVES MODULE ====================

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
const tabQuizBtn = document.getElementById('tabQuizBtn');
const tabMasteredBtn = document.getElementById('tabMasteredBtn');
const quizEasyModeBtn = document.getElementById('quizEasyModeBtn');
const quizHardModeBtn = document.getElementById('quizHardModeBtn');
const typeSelect = document.getElementById('typeSelect');
const adjSearchInput = document.getElementById('adjSearchInput');

// Helper function to add furigana
function addFuriganaToText(text) {
    if (!text) return '';
    if (furiganaHidden) {
        return text.replace(/[（(][^）)]*[）)]/g, '');
    }
    // Convert "漢字（ふりがな）" to <ruby>漢字<rt>ふりがな</rt></ruby>
    return text.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => {
        return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
    });
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
                let displayJp = addFuriganaToText(ex.sentence);
                examplesHtml += `
                    <div class="example-item" data-reading="${ex.reading || ex.sentence.replace(/[（(][^）)]*[）)]/g, '')}">
                        <div class="example-jp">${displayJp}</div>
                        <div class="example-trans">→ ${ex.english}</div>
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
    
    document.querySelectorAll('.example-item').forEach(el => {
        const reading = el.dataset.reading;
        if (reading && typeof speakText === 'function') {
            el.addEventListener('click', () => speakText(reading));
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
            conjugations: adj.conjugations
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
        ? "📝 Adjective Conjugation Quiz - choose the correct form"
        : "📝 Adjective Conjugation Quiz - select the correct form";
    
    const dictDisplay = formatAdjectiveForDisplay({dictionary: q.adjDict, reading: q.adjReading});
    
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #ddd;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                <span style="font-weight: bold; font-size: 1rem; color: #1e4b6e;">${quizTitle}</span>
                <span style="background: #e8f0fe; padding: 6px 14px; border-radius: 20px; font-size: 0.9rem;">📚 Dictionary: ${dictDisplay} (${q.adjMeaning})</span>
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
        
        // Create array of conjugation buttons and shuffle
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
        
        // Shuffle randomly
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
    
    if (quizMode === 'easy') {
        document.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.quiz-option-btn').forEach(b => {
                    b.style.background = '#fff';
                    b.style.color = '#000';
                    b.classList.remove('selected');
                });
                btn.style.background = '#6c8b6b';
                btn.style.color = '#fff';
                btn.classList.add('selected');
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
                    b.classList.remove('selected');
                });
                btn.style.background = '#6c8b6b';
                btn.style.color = '#fff';
                btn.classList.add('selected');
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
        renderAdjectivesList();
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
if (tabQuizBtn) tabQuizBtn.addEventListener('click', () => switchTab('quiz'));
if (tabMasteredBtn) tabMasteredBtn.addEventListener('click', () => switchTab('mastered'));

function initAdjectives() {
    loadMasteredAdjectives();
    renderAdjectivesList();
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