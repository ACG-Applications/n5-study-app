// ==================== PARTICLE MODULE ====================
let currentParticleTab = 'structure';
let furiganaHidden = false;
let masteredParticles = new Set();
let currentQuiz = [];
let currentQuizIndex = 0;
let quizAnswers = [];
let quizActive = false;

// DOM Elements
const sprintSelect = document.getElementById('sprintSelect');
const quizSprintSelect = document.getElementById('quizSprintSelect');
const furiToggleBtn = document.getElementById('furiToggleBtn');
const tabStructureBtn = document.getElementById('tabStructureBtn');
const tabParticlesBtn = document.getElementById('tabParticlesBtn');
const tabPairsBtn = document.getElementById('tabPairsBtn');
const tabQuizBtn = document.getElementById('tabQuizBtn');

// Load mastered particles from localStorage
function loadMasteredParticles() {
  const stored = localStorage.getItem('masteredParticles');
  if (stored) {
    masteredParticles = new Set(JSON.parse(stored));
  }
  updateMasteredCount();
}

function saveMasteredParticles() {
  localStorage.setItem('masteredParticles', JSON.stringify([...masteredParticles]));
  updateMasteredCount();
}

function updateMasteredCount() {
  const total = particleOrder.length;
  const count = masteredParticles.size;
  const countEl = document.getElementById('masteredCount');
  const totalEl = document.getElementById('totalCount');
  if (countEl) countEl.innerText = count;
  if (totalEl) totalEl.innerText = total;
}

function markParticleMastered(particle) {
  if (!masteredParticles.has(particle)) {
    masteredParticles.add(particle);
    saveMasteredParticles();
    renderParticleDetails();
  }
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

// Extract examples for a particle from sentences (returns full sentence objects)
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

// Wrap particle examples with highlighting (only the particle character, not furigana)
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

// Apply furigana hide to all ruby elements
function applyFuriganaHide() {
  document.querySelectorAll('.example-jp, .quiz-sentence, .structure-examples .example-jp, .particle-ref-example .example-jp').forEach(el => {
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
    
    // Add supplementary example if no N5 examples found and particle has one defined
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
      markParticleMastered(particle);
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
          <strong>✅ ${data.example1}</strong>
        </div>
        <div class="pair-example">
          <strong>✅ ${data.example2}</strong>
        </div>
        ${data.additionalNote ? `<div class="usage-note">💡 ${data.additionalNote}</div>` : ''}
      </div>
    `;
  }
  
  container.innerHTML = html;
}

// Render structure examples with ALL particles highlighted
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

// Populate the complete particle reference table with examples
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
      // Check for supplementary example
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

// Quiz functions
function generateQuiz() {
  if (!quizSprintSelect) return;
  
  const sprintValue = quizSprintSelect.value;
  const questionCount = parseInt(document.getElementById('quizCountSelect').value);
  const allQuestions = [];
  
  let sentencesToUse = sentencesData;
  if (sprintValue !== 'all') {
    const {start, end} = sprints[parseInt(sprintValue)];
    sentencesToUse = sentencesData.slice(start, end + 1);
  }
  
  for (const sentence of sentencesToUse) {
    for (const particle of particleOrder) {
      const pattern = new RegExp(`\\s${particle}\\s|^${particle}\\s|\\s${particle}$`);
      if (pattern.test(sentence.jp)) {
        allQuestions.push({
          sentence: sentence.jp,
          reading: sentence.reading,
          translation: sentence.translation,
          correctParticle: particle,
          options: generateOptions(particle)
        });
        break;
      }
    }
  }
  
  // If not enough questions, add supplementary ones
  if (allQuestions.length < questionCount) {
    for (const particle of particleOrder) {
      const data = particlesData[particle];
      if (data && data.supplementaryExample && !allQuestions.some(q => q.correctParticle === particle)) {
        const supp = data.supplementaryExample;
        allQuestions.push({
          sentence: supp.jp,
          reading: supp.reading,
          translation: supp.translation,
          correctParticle: particle,
          options: generateOptions(particle)
        });
      }
      if (allQuestions.length >= questionCount) break;
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
  renderQuizQuestion();
}

function generateOptions(correctParticle) {
  const allParticles = [...particleOrder];
  const options = [correctParticle];
  while (options.length < 4 && allParticles.length > 0) {
    const random = allParticles[Math.floor(Math.random() * allParticles.length)];
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
  const selectedAnswer = quizAnswers[currentQuizIndex];
  
  let html = `
    <div class="quiz-question">
      <div class="quiz-sentence">${wrapParticleExample(q.sentence, '___')}</div>
      <div class="quiz-options">
  `;
  
  for (const opt of q.options) {
    html += `
      <div class="quiz-option ${selectedAnswer === opt ? 'selected' : ''}" data-particle="${opt}">
        ${opt}
      </div>
    `;
  }
  
  html += `
      </div>
      <div class="quiz-nav">
        <button id="quizSubmitBtn" class="small-btn">Submit Answer</button>
        ${currentQuizIndex > 0 ? '<button id="quizPrevBtn" class="small-btn">◀ Previous</button>' : ''}
        <button id="quizSkipBtn" class="small-btn">Skip</button>
      </div>
    </div>
  `;
  
  quizArea.innerHTML = html;
  applyFuriganaHide();
  
  document.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const selectedParticle = opt.dataset.particle;
      quizAnswers[currentQuizIndex] = selectedParticle;
    });
  });
  
  const submitBtn = document.getElementById('quizSubmitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      if (quizAnswers[currentQuizIndex]) {
        checkAnswer();
      } else {
        alert('Please select an answer');
      }
    });
  }
  
  const prevBtn = document.getElementById('quizPrevBtn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentQuizIndex--;
      renderQuizQuestion();
    });
  }
  
  const skipBtn = document.getElementById('quizSkipBtn');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      currentQuizIndex++;
      renderQuizQuestion();
    });
  }
}

function checkAnswer() {
  const q = currentQuiz[currentQuizIndex];
  const userAnswer = quizAnswers[currentQuizIndex];
  const isCorrect = userAnswer === q.correctParticle;
  
  if (isCorrect) {
    markParticleMastered(q.correctParticle);
  }
  
  const feedbackHtml = `
    <div class="quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}">
      ${isCorrect ? '✅ Correct!' : '❌ Incorrect!'}<br>
      ${isCorrect ? 'Great job!' : `The correct particle is <strong>${q.correctParticle}</strong>`}
      <div class="example-item ${isCorrect ? 'n5-example' : 'supplementary-example'}" style="margin-top: 10px;">
        <div class="example-jp">${wrapParticleExample(q.sentence, q.correctParticle)}</div>
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
  const correctCount = quizAnswers.filter((ans, idx) => ans === currentQuiz[idx]?.correctParticle).length;
  const percent = Math.round((correctCount / currentQuiz.length) * 100);
  
  const resultsDiv = document.getElementById('quizResults');
  if (!resultsDiv) return;
  
  resultsDiv.style.display = 'block';
  resultsDiv.innerHTML = `
    <div class="quiz-score">${correctCount} / ${currentQuiz.length} (${percent}%)</div>
    <p>${percent >= 80 ? '🎉 Excellent! You know your particles well!' : percent >= 60 ? '👍 Good job! Keep practicing!' : '📚 Keep studying! Review the particles and try again.'}</p>
    <button id="quizRestartBtn" class="action-btn">Take Another Quiz</button>
  `;
  
  const restartBtn = document.getElementById('quizRestartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      const quizArea = document.getElementById('quizArea');
      if (quizArea) {
        quizArea.innerHTML = '<p class="quiz-welcome">Select sprint and number of questions, then click "Start New Quiz"</p>';
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

// Furigana toggle
if (furiToggleBtn) {
  furiToggleBtn.addEventListener('click', () => {
    furiganaHidden = !furiganaHidden;
    furiToggleBtn.innerText = furiganaHidden ? '🔤 Furigana On' : '🔤 Furigana Off';
    applyFuriganaHide();
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParticles);
} else {
  initParticles();
}