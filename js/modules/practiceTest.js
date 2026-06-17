// ==================== PRACTICE TEST MODULE ====================
// JLPT N5 Practice Test with Vocabulary, Grammar, Reading, Listening sections

let currentQuiz = [];
let currentQuizIndex = 0;
let quizAnswers = [];
let quizActive = false;
let quizScore = 0;
let quizAttemptsRemaining = {};
let timerInterval = null;
let timeRemaining = 0;
let timerEnabled = false;
let ttsEnabled = false;

// DOM Elements
const sectionSelect = document.getElementById('sectionSelect');
const quizCountSelect = document.getElementById('quizCountSelect');
const startQuizBtn = document.getElementById('startQuizBtn');
const timerToggle = document.getElementById('timerToggle');
const ttsToggle = document.getElementById('ttsToggle');
const resetProgressBtn = document.getElementById('resetProgressBtn');
const quizArea = document.getElementById('quizArea');
const resultsDiv = document.getElementById('quizResults');
const timerDisplay = document.getElementById('timerDisplay');
const masteredCountSpan = document.getElementById('masteredCount');
const totalCountSpan = document.getElementById('totalCount');
const startButtonContainer = document.querySelector('.start-button-container');

let masteredQuestions = new Set();
let attemptedQuestions = new Set();

// Format script for TTS with katakana speaker labels and segment breaks
function formatScriptForTTS(script) {
    if (!script) return [];
    
    const segments = [];
    let processed = script;
    
    // Replace speaker markers with katakana labels followed by a special marker
    processed = processed.replace(/M：/g, '|||SPEAKER_MALE|||');
    processed = processed.replace(/F：/g, '|||SPEAKER_FEMALE|||');
    processed = processed.replace(/男：/g, '|||SPEAKER_MALE|||');
    processed = processed.replace(/女：/g, '|||SPEAKER_FEMALE|||');
    processed = processed.replace(/先生：/g, '|||SPEAKER_TEACHER|||');
    processed = processed.replace(/学生：/g, '|||SPEAKER_STUDENT|||');
    processed = processed.replace(/店員：/g, '|||SPEAKER_STAFF|||');
    
    // Split into parts
    const parts = processed.split(/(\|\|\|SPEAKER_[A-Z]+\|\|\|)/g);
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part.startsWith('|||SPEAKER_')) {
            // This is a speaker label
            let speakerText = '';
            if (part.includes('MALE')) speakerText = 'ダンセイ';
            else if (part.includes('FEMALE')) speakerText = 'ジョセイ';
            else if (part.includes('TEACHER')) speakerText = 'センセイ';
            else if (part.includes('STUDENT')) speakerText = 'ガクセイ';
            else if (part.includes('STAFF')) speakerText = 'テンイン';
            
            // Add speaker segment
            segments.push({ type: 'speaker', text: speakerText });
        } else if (part.trim()) {
            // Split dialogue into sentences
            const sentences = part.split(/(?<=[。？！])/g);
            for (const sentence of sentences) {
                if (sentence.trim()) {
                    segments.push({ type: 'dialogue', text: sentence.trim() });
                }
            }
        }
    }
    
    return segments;
}

// Speak text using TTS with longer pause after speaker labels
function speakListeningScript(text) {
    if (!text) return;
    
    if (typeof window.speechSynthesis !== 'undefined') {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        
        const segments = formatScriptForTTS(text);
        
        if (segments.length === 0) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ja-JP';
            utterance.rate = 0.85;
            window.speechSynthesis.speak(utterance);
            return;
        }
        
        let index = 0;
        
        function speakNextSegment() {
            if (index >= segments.length) return;
            
            const segment = segments[index];
            const utterance = new SpeechSynthesisUtterance(segment.text);
            utterance.lang = 'ja-JP';
            utterance.rate = 0.85;
            
            utterance.onend = function() {
                index++;
                // Longer pause after speaker labels (600ms), shorter after dialogue (300ms)
                const pauseTime = (segment.type === 'speaker') ? 600 : 300;
                if (index < segments.length) {
                    setTimeout(speakNextSegment, pauseTime);
                }
            };
            
            window.speechSynthesis.speak(utterance);
        }
        
        speakNextSegment();
    }
}

// Stop current audio
function stopAudio() {
    if (typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.cancel();
    }
}

// Load mastered from localStorage
function loadMasteredPractice() {
    const stored = localStorage.getItem('masteredPractice');
    if (stored) {
        masteredQuestions = new Set(JSON.parse(stored));
    }
    const storedAttempted = localStorage.getItem('attemptedPractice');
    if (storedAttempted) {
        attemptedQuestions = new Set(JSON.parse(storedAttempted));
    }
    updateMasteredCount();
}

function saveMasteredPractice() {
    localStorage.setItem('masteredPractice', JSON.stringify([...masteredQuestions]));
    localStorage.setItem('attemptedPractice', JSON.stringify([...attemptedQuestions]));
    updateMasteredCount();
}

function updateMasteredCount() {
    if (typeof getAllPracticeQuestions !== 'undefined') {
        const total = getAllPracticeQuestions().length;
        const mastered = masteredQuestions.size;
        if (masteredCountSpan) masteredCountSpan.innerText = mastered;
        if (totalCountSpan) totalCountSpan.innerText = total;
    }
}

function markQuestionMastered(questionId, isFirstAttempt = true) {
    if (isFirstAttempt && !masteredQuestions.has(questionId)) {
        masteredQuestions.add(questionId);
    }
    if (!attemptedQuestions.has(questionId)) {
        attemptedQuestions.add(questionId);
    }
    saveMasteredPractice();
}

// Timer functions
function startTimer(seconds) {
    if (timerInterval) clearInterval(timerInterval);
    timeRemaining = seconds;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            if (quizActive) {
                alert('Time is up!');
                stopQuiz();
            }
        } else {
            timeRemaining--;
            updateTimerDisplay();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    if (timerDisplay) {
        const mins = Math.floor(timeRemaining / 60);
        const secs = timeRemaining % 60;
        timerDisplay.innerHTML = `⏱️ Time: ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// Generate quiz
function generateQuiz() {
    const section = sectionSelect.value;
    const questionCount = parseInt(quizCountSelect.value);
    
    let allQuestions = [];
    
    if (typeof getAllPracticeQuestions !== 'undefined') {
        if (section === 'all') {
            allQuestions = getAllPracticeQuestions();
        } else if (typeof getPracticeQuestionsBySection !== 'undefined') {
            allQuestions = getPracticeQuestionsBySection(section);
        }
    }
    
    if (allQuestions.length === 0) {
        quizArea.innerHTML = '<p class="quiz-welcome" style="color: red;">No questions available for this section.</p>';
        return;
    }
    
    // Shuffle
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
    
    if (timerEnabled) {
        const timePerQuestion = 60;
        startTimer(currentQuiz.length * timePerQuestion);
    }
    
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
        resultsDiv.innerHTML = '';
    }
    
    if (startButtonContainer) {
        startButtonContainer.style.display = 'none';
    }
    if (startQuizBtn) {
        startQuizBtn.style.display = 'none';
    }
    
    renderQuizQuestion();
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
            <div class="quiz-stats">Question ${currentQuizIndex + 1} / ${currentQuiz.length}</div>
            <div class="quiz-score-display">⭐ Score: ${quizScore.toFixed(1)}</div>
            <div class="quiz-attempts">❤️ Attempts: ${attemptsLeft}</div>
        </div>
        <div id="quizFeedbackArea"></div>
    `;
    
    // For listening questions, show play button and note with ruby
    if (q.script) {
        html += `
            <div class="listening-control">
                <button id="playListeningBtn" class="play-btn">▶️ Play Conversation</button>
                <button id="stopListeningBtn" class="stop-btn">⏹️ Stop</button>
            </div>
            <div class="listening-note">
                💡 The audio will identify speakers as 
                <ruby>男性<rt>だんせい</rt></ruby> (male), 
                <ruby>女性<rt>じょせい</rt></ruby> (female), 
                <ruby>先生<rt>せんせい</rt></ruby> (teacher), 
                <ruby>学生<rt>がくせい</rt></ruby> (student), etc. Listen carefully.
            </div>
        `;
    }
    
    html += `
        <div class="quiz-question">
            <div class="question-text">${q.question || q.sentence || ''}</div>
    `;
    
    if (q.passage) {
        html += `<div class="reading-passage">${q.passage}</div>`;
    }
    
    if (q.options && q.options.length > 0) {
        html += `<div class="quiz-options">`;
        for (let i = 0; i < q.options.length; i++) {
            const opt = q.options[i];
            const optNumber = i + 1;
            const isSelected = currentAnswer && currentAnswer.selected === opt;
            let cleanOpt = opt;
            cleanOpt = cleanOpt.replace(/^\d+\s/, '');
            html += `
                <button class="quiz-option-btn ${isSelected ? 'selected' : ''}" data-answer="${opt}">
                    <span class="opt-number">${optNumber}</span> ${cleanOpt}
                </button>
            `;
        }
        html += `</div>`;
    }
    
    html += `
            <div class="quiz-nav">
                <button id="quizSubmitBtn" class="action-btn">✅ Check Answer</button>
                <button id="quizShowAnswerBtn" class="small-btn">📖 Show Answer</button>
                <button id="quizStopBtn" class="small-btn">⏹️ Stop Test</button>
                <button id="quizSkipBtn" class="small-btn">⏭️ Skip</button>
            </div>
        </div>
    `;
    
    quizArea.innerHTML = html;
    
    // Listening button handlers
    if (q.script) {
        const playBtn = document.getElementById('playListeningBtn');
        const stopBtn = document.getElementById('stopListeningBtn');
        
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                speakListeningScript(q.script);
            });
        }
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                stopAudio();
            });
        }
    }
    
    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.quiz-option-btn').forEach(b => {
                b.classList.remove('selected');
            });
            btn.classList.add('selected');
            
            if (!quizAnswers[currentQuizIndex]) quizAnswers[currentQuizIndex] = {};
            quizAnswers[currentQuizIndex].selected = btn.dataset.answer;
        });
    });
    
    document.getElementById('quizSubmitBtn')?.addEventListener('click', () => checkAnswer());
    document.getElementById('quizShowAnswerBtn')?.addEventListener('click', () => showAnswer());
    document.getElementById('quizSkipBtn')?.addEventListener('click', () => {
        currentQuizIndex++;
        renderQuizQuestion();
    });
    document.getElementById('quizStopBtn')?.addEventListener('click', () => stopQuiz());
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
            feedbackDiv.innerHTML = `<div class="quiz-feedback incorrect">⚠️ Please select an answer.</div>`;
        }
        return;
    }
    
    const isCorrect = userChoice === q.correctAnswer;
    
    if (isCorrect) {
        if (isFirstAttempt) {
            pointsEarned = 1;
            markQuestionMastered(q.id, true);
        } else {
            pointsEarned = 0.5;
        }
        quizScore += pointsEarned;
        
        if (!attemptedQuestions.has(q.id)) {
            attemptedQuestions.add(q.id);
            saveMasteredPractice();
        }
        
        const feedbackHtml = `
            <div class="quiz-result-container">
                <div class="quiz-header-info">
                    <div class="quiz-stats">Question ${currentQuizIndex + 1} / ${currentQuiz.length}</div>
                    <div class="quiz-score-display">⭐ Score: ${quizScore.toFixed(1)}</div>
                </div>
                <div class="quiz-feedback correct">
                    ✅ ${isFirstAttempt ? 'Correct! +1 point' : 'Correct on 2nd try! +0.5 points'}
                </div>
                <div class="quiz-question">
                    <div class="question-text">${q.question || q.sentence || ''}</div>
                    ${q.passage ? `<div class="reading-passage">${q.passage}</div>` : ''}
                    <div class="answer-row">
                        <span class="answer-label">📖 Answer:</span>
                        <span class="answer-value">${q.correctAnswer}</span>
                    </div>
                    <div class="quiz-explanation">${q.explanation || 'Well done!'}</div>
                </div>
                <div class="quiz-nav">
                    <button id="quizNextBtn" class="action-btn next-btn">Next →</button>
                </div>
            </div>
        `;
        
        quizArea.innerHTML = feedbackHtml;
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
                btn.classList.remove('selected');
            });
        } else {
            const feedbackHtml = `
                <div class="quiz-result-container">
                    <div class="quiz-header-info">
                        <div class="quiz-stats">Question ${currentQuizIndex + 1} / ${currentQuiz.length}</div>
                        <div class="quiz-score-display">⭐ Score: ${quizScore.toFixed(1)}</div>
                    </div>
                    <div class="quiz-feedback incorrect">
                        ❌ Out of attempts!
                    </div>
                    <div class="quiz-question">
                        <div class="question-text">${q.question || q.sentence || ''}</div>
                        ${q.passage ? `<div class="reading-passage">${q.passage}</div>` : ''}
                        <div class="answer-row">
                            <span class="answer-label">📖 Answer:</span>
                            <span class="answer-value">${q.correctAnswer}</span>
                        </div>
                        <div class="quiz-explanation">${q.explanation || 'Review this topic.'}</div>
                    </div>
                    <div class="quiz-nav">
                        <button id="quizNextBtn" class="action-btn next-btn">Next →</button>
                    </div>
                </div>
            `;
            quizArea.innerHTML = feedbackHtml;
            document.getElementById('quizNextBtn')?.addEventListener('click', () => {
                currentQuizIndex++;
                renderQuizQuestion();
            });
        }
    }
}

function showAnswer() {
    const q = currentQuiz[currentQuizIndex];
    
    const html = `
        <div class="quiz-result-container">
            <div class="quiz-header-info">
                <div class="quiz-stats">Question ${currentQuizIndex + 1} / ${currentQuiz.length}</div>
                <div class="quiz-score-display">⭐ Score: ${quizScore.toFixed(1)}</div>
            </div>
            <div class="quiz-question">
                <div class="question-text">${q.question || q.sentence || ''}</div>
                ${q.passage ? `<div class="reading-passage">${q.passage}</div>` : ''}
                <div class="answer-row">
                    <span class="answer-label">📖 Answer:</span>
                    <span class="answer-value">${q.correctAnswer}</span>
                </div>
                <div class="quiz-explanation">${q.explanation || 'No explanation available.'}</div>
                <div class="no-points-note">⚠️ No points awarded for using "Show Answer"</div>
            </div>
            <div class="quiz-nav">
                <button id="quizNextBtn" class="action-btn next-btn">Next →</button>
            </div>
        </div>
    `;
    
    quizArea.innerHTML = html;
    document.getElementById('quizNextBtn')?.addEventListener('click', () => {
        currentQuizIndex++;
        renderQuizQuestion();
    });
}

function stopQuiz() {
    if (!quizActive) return;
    quizActive = false;
    stopTimer();
    stopAudio();
    
    if (quizArea) {
        quizArea.innerHTML = '<p class="quiz-welcome">Select section and number of questions, then click "Start Test"</p>';
    }
    
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
        resultsDiv.innerHTML = '';
    }
    
    if (startButtonContainer) {
        startButtonContainer.style.display = 'block';
    }
    if (startQuizBtn) {
        startQuizBtn.style.display = 'block';
    }
}

function showQuizResults() {
    quizActive = false;
    stopTimer();
    stopAudio();
    
    const percent = Math.round((quizScore / currentQuiz.length) * 100);
    if (resultsDiv) {
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <div class="quiz-score">${quizScore.toFixed(1)} / ${currentQuiz.length} (${percent}%)</div>
            <p>${percent >= 80 ? '🎉 Excellent!' : percent >= 60 ? '👍 Good job!' : '📚 Keep studying!'}</p>
            <div style="margin-top: 20px;"></div>
            <button id="quizRestartBtn" class="action-btn">Take Another Test</button>
        `;
        
        document.getElementById('quizRestartBtn')?.addEventListener('click', () => {
            if (quizArea) {
                quizArea.innerHTML = '<p class="quiz-welcome">Select section and number of questions, then click "Start Test"</p>';
            }
            if (resultsDiv) {
                resultsDiv.style.display = 'none';
            }
            if (startButtonContainer) {
                startButtonContainer.style.display = 'block';
            }
            if (startQuizBtn) {
                startQuizBtn.style.display = 'block';
            }
        });
    }
}

function resetAllProgress() {
    if (confirm('⚠️ Are you sure? This will reset ALL practice test progress.')) {
        masteredQuestions.clear();
        attemptedQuestions.clear();
        saveMasteredPractice();
        updateMasteredCount();
    }
}

function initTimerToggle() {
    if (!timerToggle) return;
    timerToggle.addEventListener('click', () => {
        timerEnabled = !timerEnabled;
        timerToggle.textContent = timerEnabled ? '⏱️ Timer On' : '⏱️ Timer Off';
        timerToggle.style.background = timerEnabled ? '#4caf50' : '#e8e0d5';
        if (timerDisplay) {
            timerDisplay.style.display = timerEnabled ? 'block' : 'none';
        }
    });
}

function initTtsToggle() {
    if (!ttsToggle) return;
    ttsToggle.addEventListener('click', () => {
        ttsEnabled = !ttsEnabled;
        ttsToggle.textContent = ttsEnabled ? '🔊 TTS On' : '🔊 TTS Off';
        ttsToggle.style.background = ttsEnabled ? '#4caf50' : '#e8e0d5';
    });
}

function attachStartQuizListener() {
    if (!startQuizBtn) return;
    const newBtn = startQuizBtn.cloneNode(true);
    startQuizBtn.parentNode.replaceChild(newBtn, startQuizBtn);
    newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        generateQuiz();
    });
}

function initPracticeTest() {
    console.log('Practice test initializing...');
    loadMasteredPractice();
    updateMasteredCount();
    attachStartQuizListener();
    initTimerToggle();
    initTtsToggle();
    
    if (resetProgressBtn) {
        resetProgressBtn.addEventListener('click', resetAllProgress);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPracticeTest);
} else {
    initPracticeTest();
}