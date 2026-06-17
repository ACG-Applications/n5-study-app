// ==================== GRAMMAR MODULE ====================

let currentGrammarTab = 'list';
let furiganaHidden = false;
let masteredGrammar = new Set();
let attemptedGrammar = new Set();
let currentQuiz = [];
let currentQuizIndex = 0;
let quizAnswers = [];
let quizActive = false;
let quizScore = 0;
let quizAttemptsRemaining = {};
let currentSearchTerm = '';

// DOM Elements
const furiToggleBtn = document.getElementById('furiToggleBtn');
const tabListBtn = document.getElementById('tabListBtn');
const tabQuizBtn = document.getElementById('tabQuizBtn');
const tabMasteredBtn = document.getElementById('tabMasteredBtn');
const grammarSearchInput = document.getElementById('grammarSearchInput');
const startQuizBtn = document.getElementById('startQuizBtn');
const quizCountSelect = document.getElementById('quizCountSelect');
const quizArea = document.getElementById('quizArea');
const resultsDiv = document.getElementById('quizResults');
const quizRunningScore = document.getElementById('quizRunningScore');
const quizTotalPossible = document.getElementById('quizTotalPossible');
const quizMasteredCount = document.getElementById('quizMasteredCount');
const quizAttemptedCount = document.getElementById('quizAttemptedCount');
const quizTotalGrammar = document.getElementById('quizTotalGrammar');
const quizTotalGrammar2 = document.getElementById('quizTotalGrammar2');
const masteredCountSpan = document.getElementById('masteredCount');
const totalCountSpan = document.getElementById('totalCount');
const resetAllProgressBtn = document.getElementById('resetAllProgressBtn');
const resetMasteredOnlyBtn = document.getElementById('resetMasteredOnlyBtn');
const statHelpIcon = document.getElementById('statHelpIcon');
const closeStatsHelp = document.getElementById('closeStatsHelp');
const quizStatsExplanation = document.getElementById('quizStatsExplanation');

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

// Strip furigana for comparison and audio
function stripFurigana(text) {
    if (!text) return '';
    return text.replace(/[（(][^）)]*[）)]/g, '');
}

function loadMasteredGrammar() {
    const stored = localStorage.getItem('masteredGrammar');
    if (stored) {
        masteredGrammar = new Set(JSON.parse(stored));
    }
    const storedAttempted = localStorage.getItem('attemptedGrammar');
    if (storedAttempted) {
        attemptedGrammar = new Set(JSON.parse(storedAttempted));
    }
    updateMasteredCount();
}

function saveMasteredGrammar() {
    localStorage.setItem('masteredGrammar', JSON.stringify([...masteredGrammar]));
    localStorage.setItem('attemptedGrammar', JSON.stringify([...attemptedGrammar]));
    updateMasteredCount();
}

function updateMasteredCount() {
    const total = grammarOrder.length;
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
        furiToggleBtn.innerText = furiganaHidden ? '🔤 Furigana On' : '🔤 Furigana Off';
    }
    renderGrammarList();
    renderMasteredList();
    if (quizActive && currentQuiz.length > 0) {
        renderQuizQuestion();
    }
}

function renderGrammarList() {
    const container = document.getElementById('grammarList');
    if (!container) return;
    
    let filteredGrammar = [...grammarData];
    
    if (currentSearchTerm) {
        const searchLower = currentSearchTerm.toLowerCase();
        filteredGrammar = filteredGrammar.filter(g => 
            g.pattern.toLowerCase().includes(searchLower) ||
            g.meaning.toLowerCase().includes(searchLower) ||
            (g.explanation && g.explanation.toLowerCase().includes(searchLower))
        );
    }
    
    let html = '';
    
    for (const grammar of filteredGrammar) {
        const isMastered = masteredGrammar.has(grammar.id);
        
        let examplesHtml = '';
        if (grammar.examples && grammar.examples.length > 0) {
            for (const ex of grammar.examples) {
                let displayJp = addFuriganaToText(ex.sentence);
                examplesHtml += `
                    <div class="example-item" data-reading="${stripFurigana(ex.sentence)}">
                        <div class="example-jp">${displayJp}</div>
                        <div class="example-trans">→ ${ex.english}</div>
                    </div>
                `;
            }
        }
        
        html += `
            <div class="grammar-card ${isMastered ? 'mastered' : ''}" data-grammar-id="${grammar.id}">
                <div class="grammar-header-card">
                    <div>
                        <span class="grammar-pattern">${grammar.pattern}</span>
                        ${isMastered ? '<span class="mastered-badge">✓ Mastered</span>' : ''}
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
                    ${isMastered ? '✓ Mastered' : '✓ Mark as Mastered'}
                </button>
            </div>
        `;
    }
    
    if (filteredGrammar.length === 0) {
        html = '<p style="text-align: center; padding: 40px;">No grammar points match your search.</p>';
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
            const grammarId = btn.dataset.grammarId;
            if (masteredGrammar.has(grammarId)) {
                unmarkGrammarMastered(grammarId);
            } else {
                markGrammarMastered(grammarId, true);
            }
        });
    });
}

function renderMasteredList() {
    const container = document.getElementById('masteredList');
    if (!container) return;
    
    const masteredIds = [...masteredGrammar];
    
    if (masteredIds.length === 0) {
        container.innerHTML = '<p class="empty-message">No grammar points mastered yet. Complete a quiz to master them!</p>';
        return;
    }
    
    let html = '';
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
    
    document.querySelectorAll('.unmaster-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const grammarId = btn.dataset.grammarId;
            unmarkGrammarMastered(grammarId);
        });
    });
}

// ==================== QUIZ FUNCTIONS ====================

function generateQuiz() {
    console.log('generateQuiz called!');
    
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
                grammarMeaning: grammar.meaning
            });
        }
    }
    
    if (allQuestions.length === 0) {
        if (quizArea) {
            quizArea.innerHTML = '<p class="quiz-welcome" style="color: red;">No questions available for quiz.</p>';
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
    
    if (resultsDiv) resultsDiv.style.display = 'none';
    
    if (!quizActive || currentQuizIndex >= currentQuiz.length) {
        showQuizResults();
        return;
    }
    
    const q = currentQuiz[currentQuizIndex];
    const attemptsLeft = quizAttemptsRemaining[currentQuizIndex];
    const currentAnswer = quizAnswers[currentQuizIndex];
    
    let html = `
        <div class="quiz-header-info">
            <span style="font-weight: bold;">Question ${currentQuizIndex + 1} / ${currentQuiz.length}</span>
            <span style="color: #6c8b6b;">⭐ Score: ${quizScore.toFixed(1)}</span>
            <span style="color: #c45d1e;">❤️ Attempts: ${attemptsLeft}</span>
        </div>
        <div id="quizFeedbackArea"></div>
        <div style="background: #f9fcff; border-radius: 20px; padding: 20px; margin-bottom: 16px;">
            <div class="quiz-sentence">${addFuriganaToText(q.sentence)}</div>
            <div class="quiz-options">
    `;
    
    // Shuffle options
    const shuffledOptions = [...q.options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    
    for (const opt of shuffledOptions) {
        const isSelected = currentAnswer && currentAnswer.selected === opt;
        html += `
            <button class="quiz-option-btn ${isSelected ? 'selected' : ''}" data-answer="${opt}" style="background: ${isSelected ? '#9c27b0' : '#fff'}; color: ${isSelected ? '#fff' : '#333'}; border: 2px solid #9c27b0; border-radius: 60px; padding: 12px 24px; font-size: 1rem; cursor: pointer;">
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
    
    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.quiz-option-btn').forEach(b => {
                b.style.background = '#fff';
                b.style.color = '#333';
                b.classList.remove('selected');
            });
            btn.style.background = '#9c27b0';
            btn.style.color = '#fff';
            btn.classList.add('selected');
            const selectedAnswer = btn.dataset.answer;
            if (!quizAnswers[currentQuizIndex]) quizAnswers[currentQuizIndex] = {};
            quizAnswers[currentQuizIndex].selected = selectedAnswer;
        });
    });
    
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
    return str.replace(/\s+/g, '').trim();
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
                <div class="quiz-feedback incorrect">
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
        
        const feedbackHtml = `
            <div class="quiz-feedback correct">
                ✅ ${isFirstAttempt ? 'Correct! +1 point' : 'Correct on 2nd try! +0.5 points'}
                <div class="quiz-explanation">📖 ${q.explanation}</div>
            </div>
            <div style="text-align: center; margin-top: 12px;">
                <button id="quizNextBtn" style="background: #1a2b4c; color: white; border: none; padding: 8px 24px; border-radius: 40px; cursor: pointer;">Next →</button>
            </div>
        `;
        
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
                    <div class="quiz-feedback incorrect">
                        ❌ Incorrect. You have ${quizAttemptsRemaining[currentQuizIndex]} attempt(s) left.
                    </div>
                `;
            }
            quizAnswers[currentQuizIndex] = null;
            document.querySelectorAll('.quiz-option-btn').forEach(btn => {
                btn.style.background = '#fff';
                btn.style.color = '#333';
                btn.classList.remove('selected');
            });
        } else {
            const feedbackHtml = `
                <div class="quiz-feedback incorrect">
                    ❌ The correct answer is "${q.correctAnswer}".
                    <div class="quiz-explanation">📖 ${q.explanation}</div>
                </div>
                <div style="text-align: center; margin-top: 12px;">
                    <button id="quizNextBtn" style="background: #1a2b4c; color: white; border: none; padding: 8px 24px; border-radius: 40px; cursor: pointer;">Next →</button>
                </div>
            `;
            
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
        <div class="quiz-feedback incorrect">
            📖 Answer: "${addFuriganaToText(q.correctAnswer)}"
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
    
    document.getElementById('quizNextBtn')?.addEventListener('click', () => {
        currentQuizIndex++;
        renderQuizQuestion();
    });
}

function stopQuiz() {
    if (!quizActive) return;
    
    quizActive = false;
    
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
                if (quizArea) {
                    quizArea.innerHTML = '<p class="quiz-welcome" style="text-align: center; color: #666; padding: 40px;">Select number of questions, then click "Start New Quiz"</p>';
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
    
    const percent = Math.round((quizScore / currentQuiz.length) * 100);
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
            if (quizArea) {
                quizArea.innerHTML = '<p class="quiz-welcome" style="text-align: center; color: #666; padding: 40px;">Select number of questions, then click "Start New Quiz"</p>';
            }
            resultsDiv.style.display = 'none';
        });
    }
}

function resetAllProgress() {
    if (confirm('⚠️ Are you sure? This will reset ALL mastered and attempted grammar points. This cannot be undone.')) {
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
    if (confirm('⚠️ Reset mastered grammar points only? Attempted will be preserved.')) {
        masteredGrammar.clear();
        saveMasteredGrammar();
        renderGrammarList();
        renderMasteredList();
        updateMasteredCount();
    }
}

function switchTab(tabId) {
    currentGrammarTab = tabId;
    
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
        renderGrammarList();
    } else if (tabId === 'mastered') {
        renderMasteredList();
    } else if (tabId === 'quiz') {
        updateMasteredCount();
    }
}

function attachStartQuizListener() {
    if (!startQuizBtn) return;
    
    const newBtn = startQuizBtn.cloneNode(true);
    startQuizBtn.parentNode.replaceChild(newBtn, startQuizBtn);
    newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Start Quiz button clicked!');
        generateQuiz();
    });
    console.log('Start Quiz button listener attached');
}

// Stats help
if (statHelpIcon) {
    statHelpIcon.addEventListener('click', () => {
        if (quizStatsExplanation) {
            quizStatsExplanation.style.display = quizStatsExplanation.style.display === 'none' ? 'block' : 'none';
        }
    });
}

if (closeStatsHelp) {
    closeStatsHelp.addEventListener('click', () => {
        if (quizStatsExplanation) quizStatsExplanation.style.display = 'none';
    });
}

// Event Listeners
if (furiToggleBtn) {
    furiToggleBtn.addEventListener('click', () => {
        applyFuriganaHide();
    });
}

if (grammarSearchInput) {
    grammarSearchInput.addEventListener('input', () => {
        currentSearchTerm = grammarSearchInput.value;
        renderGrammarList();
    });
}

if (resetAllProgressBtn) {
    resetAllProgressBtn.addEventListener('click', resetAllProgress);
}

if (resetMasteredOnlyBtn) {
    resetMasteredOnlyBtn.addEventListener('click', resetMasteredOnly);
}

if (tabListBtn) tabListBtn.addEventListener('click', () => switchTab('list'));
if (tabQuizBtn) tabQuizBtn.addEventListener('click', () => switchTab('quiz'));
if (tabMasteredBtn) tabMasteredBtn.addEventListener('click', () => switchTab('mastered'));

function initGrammar() {
    loadMasteredGrammar();
    renderGrammarList();
    switchTab('list');
    
    const totalGrammar = grammarOrder.length;
    if (quizTotalGrammar) quizTotalGrammar.innerText = totalGrammar;
    if (quizTotalGrammar2) quizTotalGrammar2.innerText = totalGrammar;
    
    attachStartQuizListener();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGrammar);
} else {
    initGrammar();
}