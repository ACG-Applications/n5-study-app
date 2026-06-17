// ==================== ADVERBS MODULE ====================

let currentAdvTab = 'list';
let furiganaHidden = false;
let masteredAdverbs = new Set();
let attemptedAdverbs = new Set();
let currentQuiz = [];
let currentQuizIndex = 0;
let quizAnswers = [];
let quizActive = false;
let quizMode = 'easy';
let quizScore = 0;
let quizAttemptsRemaining = {};
let currentSearchTerm = '';

// DOM Elements
const furiToggleBtn = document.getElementById('furiToggleBtn');
const tabListBtn = document.getElementById('tabListBtn');
const tabQuizBtn = document.getElementById('tabQuizBtn');
const tabMasteredBtn = document.getElementById('tabMasteredBtn');
const quizEasyModeBtn = document.getElementById('quizEasyModeBtn');
const quizHardModeBtn = document.getElementById('quizHardModeBtn');
const adverbSearchInput = document.getElementById('adverbSearchInput');

// Add furigana to text based on toggle state
function addFuriganaToText(text) {
    if (!text) return '';
    
    // If furigana is hidden, remove all parentheses and their contents
    if (furiganaHidden) {
        return text.replace(/[（(][^）)]*[）)]/g, '');
    }
    
    // Special handling for specific adverbs that have complex kanji patterns
    // 時々 -> 時々（ときどき）
    if (text === '時々（ときどき）') {
        return '<ruby>時々<rt>ときどき</rt></ruby>';
    }
    // 真っ直ぐ -> 真っ直ぐ（まっすぐ）
    if (text === '真っ直ぐ（まっすぐ）') {
        return '<ruby>真っ直ぐ<rt>まっすぐ</rt></ruby>';
    }
    // 一緒に -> 一緒（いっしょ）に
    if (text === '一緒（いっしょ）に') {
        return '<ruby>一緒<rt>いっしょ</rt></ruby>に';
    }
    // 段々 -> 段々（だんだん）
    if (text === '段々（だんだん）') {
        return '<ruby>段々<rt>だんだん</rt></ruby>';
    }
    // 色々 -> 色々（いろいろ）
    if (text === '色々（いろいろ）') {
        return '<ruby>色々<rt>いろいろ</rt></ruby>';
    }
    // 一番 -> 一番（いちばん）
    if (text === '一番（いちばん）') {
        return '<ruby>一番<rt>いちばん</rt></ruby>';
    }
    // 何故 -> 何故（なぜ）
    if (text === '何故（なぜ）') {
        return '<ruby>何故<rt>なぜ</rt></ruby>';
    }
    // 同じ -> 同じ（おなじ）
    if (text === '同じ（おなじ）') {
        return '<ruby>同じ<rt>おなじ</rt></ruby>';
    }
    // 直ぐに -> 直ぐに（すぐに）
    if (text === '直ぐに（すぐに）') {
        return '<ruby>直ぐに<rt>すぐに</rt></ruby>';
    }
    // 大丈夫 -> 大丈夫（だいじょうぶ）
    if (text === '大丈夫（だいじょうぶ）') {
        return '<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>';
    }
    // 結構 -> 結構（けっこう）
    if (text === '結構（けっこう）') {
        return '<ruby>結構<rt>けっこう</rt></ruby>';
    }
    // 多分 -> 多分（たぶん）
    if (text === '多分（たぶん）') {
        return '<ruby>多分<rt>たぶん</rt></ruby>';
    }
    // 大変 -> 大変（たいへん）
    if (text === '大変（たいへん）') {
        return '<ruby>大変<rt>たいへん</rt></ruby>';
    }
    // 一人 -> 一人（ひとり）
    if (text === '一人（ひとり）') {
        return '<ruby>一人<rt>ひとり</rt></ruby>';
    }
    // 皆 -> 皆（みんな）
    if (text === '皆（みんな）') {
        return '<ruby>皆<rt>みんな</rt></ruby>';
    }
    
    // General pattern: 漢字（ふりがな）
    return text.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => {
        return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
    });
}

// Strip furigana for comparison
function stripFuriganaForDropdown(text) {
    if (!text) return '';
    return text.replace(/[（(][^）)]*[）)]/g, '');
}

// Format adverb for display with furigana
function formatAdverbForDisplay(adv) {
    // Use the pre-formatted display property from adverbsData
    return addFuriganaToText(adv.display);
}

function loadMasteredAdverbs() {
    const stored = localStorage.getItem('masteredAdverbs');
    if (stored) {
        masteredAdverbs = new Set(JSON.parse(stored));
    }
    const storedAttempted = localStorage.getItem('attemptedAdverbs');
    if (storedAttempted) {
        attemptedAdverbs = new Set(JSON.parse(storedAttempted));
    }
    updateMasteredCount();
}

function saveMasteredAdverbs() {
    localStorage.setItem('masteredAdverbs', JSON.stringify([...masteredAdverbs]));
    localStorage.setItem('attemptedAdverbs', JSON.stringify([...attemptedAdverbs]));
    updateMasteredCount();
}

function updateMasteredCount() {
    const total = adverbOrder.length;
    const mastered = masteredAdverbs.size;
    const attempted = attemptedAdverbs.size;
    const countEl = document.getElementById('masteredCount');
    const totalEl = document.getElementById('totalCount');
    if (countEl) countEl.innerText = mastered;
    if (totalEl) totalEl.innerText = total;
    
    const quizMasteredEl = document.getElementById('quizMasteredCount');
    const quizAttemptedEl = document.getElementById('quizAttemptedCount');
    const quizTotalEl = document.getElementById('quizTotalAdverbs');
    const quizTotalEl2 = document.getElementById('quizTotalAdverbs2');
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
        furiToggleBtn.innerText = furiganaHidden ? '🔤 Furigana On' : '🔤 Furigana Off';
    }
    renderAdverbsList();
    renderMasteredList();
    if (quizActive && currentQuiz.length > 0) {
        renderQuizQuestion();
    }
}

function renderAdverbsList() {
    const container = document.getElementById('adverbsList');
    if (!container) return;
    
    let filteredAdverbs = [...adverbsData];
    
    if (currentSearchTerm) {
        const searchLower = currentSearchTerm.toLowerCase();
        filteredAdverbs = filteredAdverbs.filter(a => 
            a.dictionary.toLowerCase().includes(searchLower) ||
            a.reading.toLowerCase().includes(searchLower) ||
            a.meaning.toLowerCase().includes(searchLower)
        );
    }
    
    let html = '';
    
    for (const adv of filteredAdverbs) {
        const isMastered = masteredAdverbs.has(adv.id);
        
        let examplesHtml = '';
        if (adv.examples && adv.examples.length > 0) {
            for (const ex of adv.examples) {
                let displayJp = addFuriganaToText(ex.sentence);
                examplesHtml += `
                    <div class="example-item" data-reading="${ex.reading || ex.sentence.replace(/[（(][^）)]*[）)]/g, '')}">
                        <div class="example-jp">${displayJp}</div>
                        <div class="example-trans">→ ${ex.english}</div>
                    </div>
                `;
            }
        }
        
        const advDisplay = formatAdverbForDisplay(adv);
        
        html += `
            <div class="adverb-card ${isMastered ? 'mastered' : ''}" data-adv-id="${adv.id}">
                <div class="adverb-header">
                    <div>
                        <span class="adverb-title">${advDisplay}</span>
                        ${adv.dictionary !== adv.reading ? `<span class="adverb-reading">(${adv.reading})</span>` : ''}
                        ${isMastered ? '<span class="mastered-badge">✓ Mastered</span>' : ''}
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
                    ${isMastered ? '✓ Mastered' : '✓ Mark as Mastered'}
                </button>
            </div>
        `;
    }
    
    if (filteredAdverbs.length === 0) {
        html = '<p style="text-align: center; padding: 40px;">No adverbs match your search.</p>';
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
            const advId = btn.dataset.advId;
            if (masteredAdverbs.has(advId)) {
                unmarkAdverbMastered(advId);
            } else {
                markAdverbMastered(advId, true);
            }
        });
    });
}

function renderMasteredList() {
    const container = document.getElementById('masteredList');
    if (!container) return;
    
    const masteredIds = [...masteredAdverbs];
    
    if (masteredIds.length === 0) {
        container.innerHTML = '<p class="empty-message">No adverbs mastered yet. Complete a quiz to master adverbs!</p>';
        return;
    }
    
    let html = '';
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
    
    document.querySelectorAll('.unmaster-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const advId = btn.dataset.advId;
            unmarkAdverbMastered(advId);
        });
    });
}

// ==================== QUIZ FUNCTIONS ====================

function generateQuiz() {
    console.log('generateQuiz called! Mode:', quizMode);
    setModeButtonsEnabled(false);
    
    const questionCount = parseInt(document.getElementById('quizCountSelect').value);
    const allQuestions = [];
    
    const availableAdverbs = adverbsData.filter(a => a.examples && a.examples.length > 0);
    
    if (availableAdverbs.length === 0) {
        const quizArea = document.getElementById('quizArea');
        if (quizArea) {
            quizArea.innerHTML = '<p class="quiz-welcome" style="color: red;">No adverbs with examples available for quiz.</p>';
        }
        setModeButtonsEnabled(true);
        return;
    }
    
    // Shuffle
    for (let i = availableAdverbs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableAdverbs[i], availableAdverbs[j]] = [availableAdverbs[j], availableAdverbs[i]];
    }
    
    for (const adv of availableAdverbs) {
        if (allQuestions.length >= questionCount) break;
        
        const example = adv.examples[0];
        if (!example) continue;
        
        // Create sentence with blank - replace the adverb with _______
        let sentenceWithBlank = example.sentence;
        const advInSentence = adv.dictionary;
        
        if (sentenceWithBlank.includes(advInSentence)) {
            sentenceWithBlank = sentenceWithBlank.replace(advInSentence, '______');
        } else {
            const cleanAdv = adv.dictionary.replace(/[（(][^）)]*[）)]/g, '');
            sentenceWithBlank = sentenceWithBlank.replace(cleanAdv, '______');
        }
        
        // Generate options (always 4 options) - USE DISPLAY for furigana
        const options = [adv.display];
        const otherAdverbs = availableAdverbs.filter(a => a.id !== adv.id);
        
        while (options.length < 4 && otherAdverbs.length > 0) {
            const randomAdv = otherAdverbs[Math.floor(Math.random() * otherAdverbs.length)];
            if (!options.includes(randomAdv.display)) {
                options.push(randomAdv.display);
            }
        }
        
        const fallbacks = ['とても', 'ちょっと', 'いつも', 'よく', 'ゆっくり', 'もっと', 'もう', 'まだ'];
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
            reading: example.reading
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
    
    const quizTitle = "📝 Adverb Quiz - choose the correct adverb";
    
    let html = `
        <div style="margin-top: 16px;"></div>
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #ddd;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                <span style="font-weight: bold; font-size: 1rem; color: #1e4b6e;">${quizTitle}</span>
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
    
    // ... rest of the function remains the same ...
    
    if (quizMode === 'easy') {
        html += `
            <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 16px 0;">
        `;
        for (const opt of q.options) {
            const isSelected = currentAnswer && currentAnswer.selected === opt;
            html += `
                <button class="quiz-option-btn" data-answer="${opt}" style="background: ${isSelected ? '#6c8b6b' : '#fff'}; color: ${isSelected ? '#fff' : '#000'}; border: 2px solid #6c8b6b; border-radius: 40px; padding: 10px 18px; font-size: 1rem; cursor: pointer;">
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
            [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
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
                <button class="hard-opt-btn" data-answer="${opt}" style="background: ${isSelected ? '#2196f3' : '#fff'}; color: ${isSelected ? '#fff' : '#333'}; border: 2px solid #2196f3; border-radius: 40px; padding: 12px 16px; font-size: 0.9rem; cursor: pointer;">
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
                    b.style.color = '#333';
                    b.classList.remove('selected');
                });
                btn.style.background = '#2196f3';
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
                        ❌ Incorrect. The correct adverb is needed.<br>
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
                    btn.style.color = '#333';
                });
            }
        } else {
            const feedbackHtml = `
                <div style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 16px; margin: 12px 0;">
                    ❌ Correct: "${addFuriganaToText(q.correctAnswer)}". No points awarded.
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
            📖 Answer: ${addFuriganaToText(q.correctAnswer)}
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
    if (confirm('⚠️ Are you sure? This will reset ALL mastered and attempted adverbs. This cannot be undone.')) {
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
    if (confirm('⚠️ Reset mastered adverbs only? Attempted adverbs will be preserved.')) {
        masteredAdverbs.clear();
        saveMasteredAdverbs();
        renderAdverbsList();
        renderMasteredList();
        updateMasteredCount();
    }
}

function switchTab(tabId) {
    currentAdvTab = tabId;
    
    const tabButtons = [tabListBtn, tabQuizBtn, tabMasteredBtn];
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
        renderAdverbsList();
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

if (adverbSearchInput) {
    adverbSearchInput.addEventListener('input', () => {
        currentSearchTerm = adverbSearchInput.value;
        renderAdverbsList();
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

if (tabListBtn) tabListBtn.addEventListener('click', () => switchTab('list'));
if (tabQuizBtn) tabQuizBtn.addEventListener('click', () => switchTab('quiz'));
if (tabMasteredBtn) tabMasteredBtn.addEventListener('click', () => switchTab('mastered'));

function initAdverbs() {
    loadMasteredAdverbs();
    renderAdverbsList();
    switchTab('list');
    
    const totalAdverbs = adverbOrder.length;
    const totalEls = document.querySelectorAll('#quizTotalAdverbs, #quizTotalAdverbs2');
    totalEls.forEach(el => {
        if (el) el.innerText = totalAdverbs;
    });
    
    attachStartQuizListener();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdverbs);
} else {
    initAdverbs();
}