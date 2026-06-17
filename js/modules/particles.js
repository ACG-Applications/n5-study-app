// ==================== PARTICLE MODULE ====================
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
const tabParticlesBtn = document.getElementById('tabParticlesBtn');
const tabPairsBtn = document.getElementById('tabPairsBtn');
const tabQuizBtn = document.getElementById('tabQuizBtn');
const quizEasyModeBtn = document.getElementById('quizEasyModeBtn');
const quizHardModeBtn = document.getElementById('quizHardModeBtn');

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

// Wrap particle examples with highlighting
function wrapParticleExample(text, particle) {
  if (!text) return '';
  
  let rubyText = text.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => {
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

// Apply furigana hide
function applyFuriganaHide() {
  document.querySelectorAll('.example-jp, .quiz-sentence, .structure-examples .example-jp, .particle-ref-example .example-jp, .pair-example, .hard-question-text').forEach(el => {
    if (furiganaHidden) {
      el.classList.add('hide-furigana');
    } else {
      el.classList.remove('hide-furigana');
    }
  });
}

// Render particle details
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
  
  applyFuriganaHide();
}

// Render confusing pairs
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
  applyFuriganaHide();
}

// Render structure examples
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
  
  applyFuriganaHide();
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
  applyFuriganaHide();
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
          originalSentence: sentence.jp
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
          originalSentence: sentence.jp
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
  
  let html = `
    <div class="quiz-header-info">
      <span class="quiz-question-counter">Question ${currentQuizIndex + 1} / ${currentQuiz.length}</span>
      <span class="quiz-score-display">Score: ${quizScore.toFixed(1)}</span>
      <span class="attempts-left">Attempts left: ${attemptsLeft}</span>
    </div>
    <div id="quizFeedbackArea"></div>
  `;
  
  if (quizMode === 'easy') {
    const displayText = createEasyDisplayText(q.originalSentence, q.correctParticle);
    
    html += `
      <div class="quiz-question easy-question">
        <div class="quiz-sentence">${wrapParticleExample(displayText, '___')}</div>
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
    const blankAnswers = currentAnswer && currentAnswer.blanks ? currentAnswer.blanks : {};
    
    html += `
      <div class="quiz-question hard-question">
        <div class="quiz-sentence hard-question-text">${wrapParticleExample(displayText, '')}</div>
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
  applyFuriganaHide();
  
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
    applyFuriganaHide();
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
  
  const feedbackHtml = `
    <div class="quiz-feedback ${isCorrect && pointsEarned > 0 ? 'correct' : 'incorrect'}">
      ${message}
      <div class="example-item" style="margin-top: 15px;">
        <div class="example-jp">${wrapParticleExample(q.originalSentence, '')}</div>
        <div class="example-trans">→ ${q.translation}</div>
      </div>
    </div>
    <div class="quiz-nav">
      <button id="quizNextBtn" class="action-btn">Next Question →</button>
    </div>
  `;
  
  const quizArea = document.getElementById('quizArea');
  if (quizArea) {
    quizArea.innerHTML = feedbackHtml;
    applyFuriganaHide();
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
  
  const tabButtons = [tabStructureBtn, tabParticlesBtn, tabPairsBtn, tabQuizBtn];
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
    furiganaHidden = !furiganaHidden;
    furiToggleBtn.innerText = furiganaHidden ? '🔤 Furigana On' : '🔤 Furigana Off';
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
if (tabParticlesBtn) tabParticlesBtn.addEventListener('click', () => switchTab('particles'));
if (tabPairsBtn) tabPairsBtn.addEventListener('click', () => switchTab('pairs'));
if (tabQuizBtn) tabQuizBtn.addEventListener('click', () => switchTab('quiz'));

// Initialize
function initParticles() {
  loadMasteredParticles();
  populateSprintDropdowns();
  renderStructureExamples();
  populateParticleReference();
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