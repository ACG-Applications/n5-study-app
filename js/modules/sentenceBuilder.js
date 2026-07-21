// ============================================================
// SENTENCE BUILDER - Core Logic (3 Modes)
// Now using MasteryManager for stats/progress
// ============================================================

/**
 * SentenceBuilder - Main class for the sentence building game
 */
class SentenceBuilder {
  constructor() {
    // ========== STATE ==========
    this.sprints = [];
    this.activeSprintIndex = 0;
    this.sprintSentences = [];

    // Mastery Manager handles all stats/progress
    this.mastery = new MasteryManager(0);

    this.currentSentenceIndex = -1;
    this.currentSentence = null;
    this.words = [];
    this.blankIndices = [];
    this.wordBank = [];
    this.placements = {};
    this.isSubmitted = false;

    this.selectedWordIndex = null;
    this.selectedBlankIndex = null;
    this.showFurigana = true;
    this.showTranslation = false;
    this.ttsSpeed = 1.0;
    this.isSubmitting = false;

    // ========== Mode Support ==========
    this.mode = "fill";
    this.validModes = ["fill", "order", "select-order"];

    // ========== Select & Order specific ==========
    this.distractors = [];
    this.correctWordCount = 0;
    this.totalWordBankSize = 0;

    // ========== Debug Mode ==========
    this.debugMode = false;

    this.elements = {};

    // ========== BIND ALL METHODS ==========
    this.init = this.init.bind(this);
    this.loadSprint = this.loadSprint.bind(this);
    this.loadNextSentence = this.loadNextSentence.bind(this);
    this.preparePuzzle = this.preparePuzzle.bind(this);
    this.preparePuzzleFill = this.preparePuzzleFill.bind(this);
    this.preparePuzzleOrder = this.preparePuzzleOrder.bind(this);
    this.preparePuzzleSelectOrder = this.preparePuzzleSelectOrder.bind(this);
    this.renderSentence = this.renderSentence.bind(this);
    this.renderSentenceFill = this.renderSentenceFill.bind(this);
    this.renderSentenceOrder = this.renderSentenceOrder.bind(this);
    this.renderSentenceSelectOrder = this.renderSentenceSelectOrder.bind(this);
    this.renderWordBank = this.renderWordBank.bind(this);
    this.renderWordBankFill = this.renderWordBankFill.bind(this);
    this.renderWordBankOrder = this.renderWordBankOrder.bind(this);
    this.renderWordBankSelectOrder = this.renderWordBankSelectOrder.bind(this);
    this.renderTranslationAndHint = this.renderTranslationAndHint.bind(this);
    this.updateStats = this.updateStats.bind(this);
    this.selectWord = this.selectWord.bind(this);
    this.placeWord = this.placeWord.bind(this);
    this.placeWordFill = this.placeWordFill.bind(this);
    this.placeWordOrder = this.placeWordOrder.bind(this);
    this.placeWordSelectOrder = this.placeWordSelectOrder.bind(this);
    this.removeWord = this.removeWord.bind(this);
    this.removeWordFill = this.removeWordFill.bind(this);
    this.removeWordOrder = this.removeWordOrder.bind(this);
    this.removeWordSelectOrder = this.removeWordSelectOrder.bind(this);
    this.submitAnswer = this.submitAnswer.bind(this);
    this.submitAnswerFill = this.submitAnswerFill.bind(this);
    this.submitAnswerOrder = this.submitAnswerOrder.bind(this);
    this.submitAnswerSelectOrder = this.submitAnswerSelectOrder.bind(this);
    this.validatePlacementsFill = this.validatePlacementsFill.bind(this);
    this.validateOrder = this.validateOrder.bind(this);
    this.validateSelectOrder = this.validateSelectOrder.bind(this);
    this.showFeedback = this.showFeedback.bind(this);
    this.showFeedbackFillError = this.showFeedbackFillError.bind(this);
    this.showFeedbackOrderError = this.showFeedbackOrderError.bind(this);
    this.showFeedbackSelectOrderError = this.showFeedbackSelectOrderError.bind(this);
    this.showCompletion = this.showCompletion.bind(this);
    this.resetSprint = this.resetSprint.bind(this);
    this.resetMasteryProgress = this.resetMasteryProgress.bind(this);
    this.toggleFurigana = this.toggleFurigana.bind(this);
    this.toggleTranslation = this.toggleTranslation.bind(this);
    this.setSpeed = this.setSpeed.bind(this);
    this.speakSentence = this.speakSentence.bind(this);
    this.speakWord = this.speakWord.bind(this);
    this.saveProgress = this.saveProgress.bind(this);
    this.loadProgress = this.loadProgress.bind(this);
    this.getSentenceById = this.getSentenceById.bind(this);
    this.getSprintSentences = this.getSprintSentences.bind(this);
    this.setMode = this.setMode.bind(this);
    this.changePrimaryMode = this.changePrimaryMode.bind(this);
    this.syncModeUI = this.syncModeUI.bind(this);
    this.syncPrimaryModeUI = this.syncPrimaryModeUI.bind(this);
    this.calculateDistractors = this.calculateDistractors.bind(this);
    this.generateDistractors = this.generateDistractors.bind(this);
    this.fallbackFurigana = this.fallbackFurigana.bind(this);
    this.addBankClickHandlers = this.addBankClickHandlers.bind(this);
    this.addFeedbackButtons = this.addFeedbackButtons.bind(this);
    this.buildCorrectSentence = this.buildCorrectSentence.bind(this);
    this.hideFeedback = this.hideFeedback.bind(this);
    this.updateSubmitButton = this.updateSubmitButton.bind(this);
    this.updateStatsAndFeedback = this.updateStatsAndFeedback.bind(this);
    this.splitSentenceWords = this.splitSentenceWords.bind(this);
    this.calculateBlanks = this.calculateBlanks.bind(this);
    this.selectBlankIndices = this.selectBlankIndices.bind(this);
    this.extractFurigana = this.extractFurigana.bind(this);
    this.extractKanji = this.extractKanji.bind(this);
    this.isParticle = this.isParticle.bind(this);
    this.shuffleArray = this.shuffleArray.bind(this);
    this.buildDisplayWord = this.buildDisplayWord.bind(this);
    this.setupEventListeners = this.setupEventListeners.bind(this);
    this.setupDebugMode = this.setupDebugMode.bind(this);
    this.exposeTestHelpers = this.exposeTestHelpers.bind(this);
    this.autoCompleteSprint = this.autoCompleteSprint.bind(this);
    this.clearAllProgress = this.clearAllProgress.bind(this);
    this.debug = this.debug.bind(this);
    // Helper to reduce duplication
    this.buildCorrectSentenceHTML = this.buildCorrectSentenceHTML.bind(this);
    this.buildPlayButtonHTML = this.buildPlayButtonHTML.bind(this);
    this.buildNextButtonHTML = this.buildNextButtonHTML.bind(this);
  }

  // ============================================================
  // DATA HELPERS - More robust data loading
  // ============================================================

  getData() {
    // Check all possible places where sentencesData might be
    if (typeof sentencesData !== "undefined" && sentencesData) {
      console.log("📚 Found sentencesData in global scope:", sentencesData.length);
      return sentencesData;
    }
    if (typeof window !== "undefined" && window.sentencesData) {
      console.log("📚 Found sentencesData in window:", window.sentencesData.length);
      return window.sentencesData;
    }
    // Also check for other possible variable names
    if (typeof window.n5Sentences !== "undefined" && window.n5Sentences) {
      console.log("📚 Found n5Sentences in window:", window.n5Sentences.length);
      return window.n5Sentences;
    }
    console.error("❌ sentencesData not found!");
    return null;
  }

  getWordDict() {
    if (typeof wordDict !== "undefined" && wordDict) {
      return wordDict;
    }
    if (typeof window !== "undefined" && window.wordDict) {
      return window.wordDict;
    }
    console.error("❌ wordDict not found!");
    return {};
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  init() {
    console.log("🚀 Initializing Sentence Builder...");

    this.elements = {
      sprintSelect: document.getElementById("sprintSelect"),
      furiganaToggle: document.getElementById("furiganaToggle"),
      translationToggle: document.getElementById("translationToggleBtn"),
      sentenceJp: document.getElementById("sentenceJp"),
      sentenceEn: document.getElementById("sentenceEn"),
      sentenceTtsBtn: document.getElementById("sentenceTtsBtn"),
      sentenceHint: document.getElementById("sentenceHint"),
      wordBank: document.getElementById("wordBank"),
      bankCount: document.getElementById("bankCount"),
      submitBtn: document.getElementById("submitBtn"),
      resetBtn: document.getElementById("resetBtn"),
      clearProgressBtn: document.getElementById("clearProgressBtn"),
      resetMasteryBtn: document.getElementById("resetMasteryBtn"),
      feedbackArea: document.getElementById("feedbackArea"),
      feedbackTitle: document.getElementById("feedbackTitle"),
      feedbackDetail: document.getElementById("feedbackDetail"),
      progressBar: document.getElementById("progressBar"),
      progressText: document.getElementById("progressText"),
      progressPercent: document.getElementById("progressPercent"),
      correctCount: document.getElementById("correctCount"),
      incorrectCount: document.getElementById("incorrectCount"),
      attemptsCount: document.getElementById("attemptsCount"),
      cycleCount: document.getElementById("cycleCount"),
      masteredCount: document.getElementById("masteredCount"),
      completionOverlay: document.getElementById("completionOverlay"),
      completionStats: document.getElementById("completionStats"),
      compCorrect: document.getElementById("compCorrect"),
      compIncorrect: document.getElementById("compIncorrect"),
      compAttempts: document.getElementById("compAttempts"),
      compCycles: document.getElementById("compCycles"),
      compResetBtn: document.getElementById("compResetBtn"),
      compNextSprintBtn: document.getElementById("compNextSprintBtn"),
    };

    // Get data ONCE
    const data = this.getData();
    if (!data || !data.length) {
      console.error("❌ sentencesData not found!");
      setTimeout(() => this.retryDataLoad(), 500);
      return;
    }

    // Build sprints
    this.buildSprints();
    this.populateSprintSelector();

    // Load progress
    this.loadProgress();

    // Setup event listeners and UI
    this.setupEventListeners();
    this.setupDebugMode();
    this.exposeTestHelpers();
    this.syncModeUI();

    // Load the first sprint if available
    if (this.sprints.length > 0) {
      this.activeSprintIndex = 0;
      this.sprintSentences = this.getSprintSentences(0);

      if (this.sprintSentences && this.sprintSentences.length > 0) {
        // Initialize mastery
        this.mastery.init(0, this.sprintSentences.length, "fill");
        this.mastery.isPracticeMode = false;
        this.mastery.sprintStarted = false;
        this.mastery.updatePracticeMode(this.mode);
        this.mastery.save();

        this.elements.sprintSelect.value = 0;
        this.elements.completionOverlay.classList.remove("visible");
        this.hideFeedback();

        this.syncModeUI();
        this.syncPrimaryModeUI();
        this.loadNextSentence();
        this.updateStats();

        console.log(
          `📚 Sprint 0 loaded with ${this.sprintSentences.length} sentences`,
        );
      } else {
        console.error("❌ No sentences found for sprint 0");
      }
    }

    console.log(`✅ Sentence Builder initialized! Mode: ${this.mode}`);
  }

  retryDataLoad() {
    console.log("🔄 Retrying data load...");
    const data = this.getData();
    if (data && data.length) {
      console.log("✅ Data found on retry!");
      this.buildSprints();
      this.populateSprintSelector();
      this.loadProgress();
      this.setupEventListeners();
      this.syncModeUI();
      if (this.sprints.length > 0) {
        this.loadSprint(0);
      }
    }
  }

  // ============================================================
  // MODE UI SYNC
  // ============================================================

  syncModeUI() {
    const buttons = document.querySelectorAll(".mode-btn");
    const progress = this.mastery.getProgress();
    const isLocked = progress.isLocked;
    const primaryMode = this.mastery.primaryMode;
    const modeLabels = {
      fill: "📝 Fill",
      order: "🔄 Order",
      "select-order": "🎯 Select",
    };

    buttons.forEach((btn) => {
      const mode = btn.dataset.mode;
      const isActive = mode === this.mode;

      // Check if this mode is locked (mastery in progress, trying to switch to non-mastery mode)
      const isModeLocked = isLocked && mode !== primaryMode;

      if (isModeLocked) {
        btn.classList.add("locked");
        btn.style.background = "#f0ebe3";
        btn.style.color = "#b8a58b";
        btn.style.borderColor = "#d4c9b8";
        btn.style.cursor = "not-allowed";
        btn.style.opacity = "0.5";
        btn.title = `🔒 Complete ${modeLabels[primaryMode]} mastery first! (${progress.mastered}/${progress.total})`;
        btn.disabled = true;
      } else {
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.classList.remove("locked");
        btn.style.background = isActive ? "#5a8a6a" : "#faf8f5";
        btn.style.color = isActive ? "white" : "#3d352b";
        btn.style.borderColor = isActive ? "#4a7a5a" : "#d4c9b8";
        btn.style.cursor = "pointer";
        btn.title = "";
      }
    });

    // Show/hide reset mastery button
    if (this.elements.resetMasteryBtn) {
      const showReset =
        this.mastery.sprintStarted && !this.mastery.allCompleted;
      this.elements.resetMasteryBtn.style.display = showReset
        ? "inline-block"
        : "none";
    }

    console.log(`🎯 UI synced to mode: ${this.mode}, locked: ${isLocked}`);
  }

  syncPrimaryModeUI() {
    const select = document.getElementById("primaryModeSelect");
    if (select) {
      select.value = this.mastery.primaryMode || "fill";
    }

    const statusEl = document.getElementById("modeStatus");
    if (!statusEl) return;

    const modeLabels = {
      fill: "📝 Fill",
      order: "🔄 Order",
      "select-order": "🎯 Select",
    };
    const label = modeLabels[this.mastery.primaryMode] || "Fill";
    const currentLabel = modeLabels[this.mode] || this.mode;

    const progress = this.mastery.getProgress();
    const sprintStarted = progress.sprintStarted;
    const isLocked = progress.isLocked;

    // CASE 1: Sprint not started yet
    if (!sprintStarted && !this.mastery.allCompleted) {
      statusEl.textContent = `📊 Mastery: ${label} (Not started)`;
      statusEl.style.background = "#f5f0eb";
      statusEl.style.color = "#7a6f60";
      statusEl.style.border = "1px solid #d4c9b8";
      statusEl.style.padding = "2px 10px";
      statusEl.style.borderRadius = "12px";
      statusEl.style.fontSize = "0.65rem";
      statusEl.title = `Mastery mode: ${label}. Sprint not started yet.`;
      return;
    }

    // CASE 2: Locked mastery mode (in progress)
    if (isLocked) {
      const practiceLabel = modeLabels[this.mode] || this.mode;
      statusEl.textContent = `🔒 Mastery: ${label} (${progress.mastered}/${progress.total}) | Practicing: ${practiceLabel}`;
      statusEl.style.background = "#fff8e8";
      statusEl.style.color = "#8a7a4a";
      statusEl.style.border = "1px solid #d4c9b8";
      statusEl.style.padding = "2px 10px";
      statusEl.style.borderRadius = "12px";
      statusEl.style.fontSize = "0.65rem";
      statusEl.title = `Complete ${label} mastery to unlock other modes! (${progress.mastered}/${progress.total})`;
      return;
    }

    // CASE 3: Practice mode active
    if (this.mastery.isPracticeMode) {
      statusEl.textContent = `🏋️ Practice (Mastery: ${label} | Current: ${currentLabel})`;
      statusEl.style.background = "#e3f0ff";
      statusEl.style.color = "#1a5a8a";
      statusEl.style.border = "1px solid #4a8aba";
      statusEl.style.padding = "2px 10px";
      statusEl.style.borderRadius = "12px";
      statusEl.style.fontSize = "0.65rem";
      statusEl.title = `You're practicing in ${currentLabel}. Mastery is tracked in ${label}.`;
      return;
    }

    // CASE 4: Sprint complete
    if (this.mastery.allCompleted) {
      statusEl.textContent = `🏆 Complete! (${label})`;
      statusEl.style.background = "#eaf5ea";
      statusEl.style.color = "#2d7a4a";
      statusEl.style.border = "1px solid #5a8a6a";
      statusEl.style.padding = "2px 10px";
      statusEl.style.borderRadius = "12px";
      statusEl.style.fontSize = "0.65rem";
      statusEl.title = `Sprint complete! Practice in any mode.`;
      return;
    }

    // CASE 5: Normal mastery mode (sprint started, not locked, not complete)
    statusEl.textContent = `📊 Mastery: ${label} (${progress.mastered}/${progress.total})`;
    statusEl.style.background = "#eaf5ea";
    statusEl.style.color = "#2d7a4a";
    statusEl.style.border = "1px solid #5a8a6a";
    statusEl.style.padding = "2px 10px";
    statusEl.style.borderRadius = "12px";
    statusEl.style.fontSize = "0.65rem";
    statusEl.title = `Mastery mode: ${label} (${progress.mastered}/${progress.total})`;
  }

  // ============================================================
  // SPRINT MANAGEMENT - COMPLETE FIX
  // ============================================================

  buildSprints() {
    this.sprints = [];
    const data = this.getData();

    if (!data || !data.length) {
      console.error("❌ sentencesData not found or empty");
      return;
    }

    console.log("📚 Building sprints from", data.length, "sentences");

    // Check if sprints are already defined globally
    if (
      typeof sprints !== "undefined" &&
      Array.isArray(sprints) &&
      sprints.length > 0
    ) {
      // CRITICAL FIX: Deep copy the sprints array and ensure consistent properties
      this.sprints = JSON.parse(JSON.stringify(sprints));
      
      // Ensure each sprint has the properties we need
      this.sprints.forEach((s, i) => {
        if (!s.displayName && s.name) {
          s.displayName = s.name;
        }
        if (!s.name && s.displayName) {
          s.name = s.displayName;
        }
        if (!s.name && !s.displayName) {
          s.name = `Sprint ${i + 1}`;
          s.displayName = `Sprint ${i + 1}`;
        }
        console.log(`📚 Sprint ${i}: ${s.displayName} (${s.start}-${s.end})`);
      });
      return;
    }

    const totalSentences = data.length;
    const sentencesPerSprint = 25;
    const sprintNames = [
      "Time & Daily Routine",
      "Family & People",
      "Location & Direction",
      "Food & Shopping",
      "Weather & Feelings",
      "Hobbies & Giving",
      "Body & Health",
      "House & Objects",
      "Work & School",
      "Mixed Review",
    ];

    for (let i = 0; i < totalSentences; i += sentencesPerSprint) {
      const start = i;
      const end = Math.min(i + sentencesPerSprint - 1, totalSentences - 1);
      const sprintNum = Math.floor(i / sentencesPerSprint) + 1;
      const name = sprintNames[sprintNum - 1] || `Sprint ${sprintNum}`;
      this.sprints.push({
        id: sprintNum - 1,
        displayName: name,
        name: name,
        start: start,
        end: end,
        count: end - start + 1,
      });
    }

    console.log("📚 Built sprints:", this.sprints.length);
  }

  populateSprintSelector() {
    const select = this.elements.sprintSelect;
    if (!select) return;
    select.innerHTML = "";

    for (let i = 0; i < this.sprints.length; i++) {
      const sprint = this.sprints[i];
      const option = document.createElement("option");
      option.value = i;
      const displayName = sprint.displayName || sprint.name || `Sprint ${i + 1}`;
      option.textContent = `${i + 1}. ${displayName} (${sprint.count || sprint.end - sprint.start + 1} sentences)`;
      select.appendChild(option);
    }

    if (this.sprints.length > 0) {
      const currentIndex = this.activeSprintIndex || 0;
      if (currentIndex < this.sprints.length) {
        select.value = currentIndex;
      } else {
        select.value = 0;
      }
    }
    
    console.log(`📚 Populated sprint selector with ${this.sprints.length} sprints`);
  }

  getSprintSentences(sprintIndex) {
    const sprint = this.sprints[sprintIndex];
    if (!sprint) {
      console.error(`❌ Sprint ${sprintIndex} not found`);
      return [];
    }

    console.log(`📚 Getting sentences for sprint ${sprintIndex}:`, sprint);
    console.log(`📚 Sprint range: ${sprint.start} to ${sprint.end}`);

    const sentences = [];
    const data = this.getData();
    if (!data || !data.length) {
      console.error("❌ No data found");
      return [];
    }

    console.log(`📚 Data has ${data.length} sentences total`);

    for (let i = sprint.start; i <= sprint.end; i++) {
      if (data[i]) {
        sentences.push({
          index: i,
          data: data[i],
        });
      } else {
        console.warn(`⚠️ Sentence at index ${i} not found`);
      }
    }
    
    console.log(`📚 Found ${sentences.length} sentences for sprint ${sprintIndex}`);
    
    if (sentences.length > 0) {
      console.log(`📚 First sentence: ${sentences[0].data.jp}`);
      if (sentences.length > 1) {
        console.log(`📚 Second sentence: ${sentences[1].data.jp}`);
      }
    }
    
    return sentences;
  }

  loadSprint(sprintIndex) {
    console.log(`📚 Loading sprint ${sprintIndex}...`);

    if (sprintIndex < 0 || sprintIndex >= this.sprints.length) {
      console.error(`❌ Invalid sprint index: ${sprintIndex}`);
      return;
    }

    this.activeSprintIndex = sprintIndex;
    this.sprintSentences = this.getSprintSentences(sprintIndex);

    if (!this.sprintSentences || !this.sprintSentences.length) {
      console.error("❌ No sentences found for sprint", sprintIndex);
      this.buildSprints();
      this.sprintSentences = this.getSprintSentences(sprintIndex);
      if (!this.sprintSentences || !this.sprintSentences.length) {
        console.error("❌ Still no sentences after rebuild");
        return;
      }
    }

    // CRITICAL FIX: Reset mastery manager with new sprint data
    this.mastery = new MasteryManager(sprintIndex);
    this.mastery.init(sprintIndex, this.sprintSentences.length, this.mastery.primaryMode || "fill");
    
    // Reset all state
    this.mastery.isPracticeMode = false;
    this.mastery.sprintStarted = false;
    this.mastery.allCompleted = false;
    this.mastery.masteredIndices = new Set();
    this.mastery.failedIndices = new Set();
    this.mastery.currentCycleSentences = Array.from({ length: this.sprintSentences.length }, (_, i) => i);
    this.mastery.shuffleArray(this.mastery.currentCycleSentences);
    this.mastery.cycleNumber = 1;
    this.mastery.stats = {
      correct: 0,
      incorrect: 0,
      attempts: 0,
      sentenceAttempts: {},
      sentenceCorrect: {},
    };
    this.mastery.save();

    this.elements.sprintSelect.value = sprintIndex;
    this.elements.completionOverlay.classList.remove("visible");
    this.hideFeedback();

    this.currentSentenceIndex = -1;
    this.currentSentence = null;
    this.words = [];
    this.blankIndices = [];
    this.wordBank = [];
    this.placements = {};
    this.isSubmitted = false;
    this.isSubmitting = false;

    this.syncModeUI();
    this.syncPrimaryModeUI();
    this.loadNextSentence();
    this.updateStats();

    console.log(
      `📚 Sprint ${sprintIndex} loaded with ${this.sprintSentences.length} sentences`,
    );
    console.log(`📚 First sentence:`, this.sprintSentences[0]?.data?.jp);
  }

  // ============================================================
  // SENTENCE LOADING - FIXED: Map relative indices to global indices
  // ============================================================

  loadNextSentence() {
    // Check if sprint is complete
    if (this.mastery.allCompleted) {
      // If we're not already in practice mode, switch to it
      if (!this.mastery.isPracticeMode) {
        console.log(`🔄 Sprint complete! Switching to practice mode.`);
        this.mastery.isPracticeMode = true;
        this.mastery.save();

        // Show completion overlay once
        if (this.mastery.shouldShowCompletion()) {
          this.showCompletion();
          this.mastery.markCompletionShown();
          this.mastery.save();
        }
      }

      // In practice mode, get the next sentence (cycling through)
      if (this.mastery.isPracticeMode) {
        const data = this.getData();
        if (!data || !data.length) {
          console.warn("⚠️ No data available for practice");
          return;
        }

        // Find the next sentence to practice using relative indices
        const totalSentences = this.sprintSentences.length;
        let nextRelativeIndex = this.currentSentenceIndex;
        let found = false;

        // If currentSentenceIndex is a global index, find its relative position
        let currentRelativeIndex = -1;
        for (let i = 0; i < this.sprintSentences.length; i++) {
          if (this.sprintSentences[i].index === this.currentSentenceIndex) {
            currentRelativeIndex = i;
            break;
          }
        }
        if (currentRelativeIndex === -1) {
          currentRelativeIndex = 0;
        }

        for (let i = 0; i < totalSentences; i++) {
          nextRelativeIndex = (currentRelativeIndex + 1 + i) % totalSentences;
          const sentence = this.sprintSentences[nextRelativeIndex];
          if (sentence && data[sentence.index]) {
            found = true;
            break;
          }
        }

        if (found) {
          const sentenceData = this.sprintSentences[nextRelativeIndex];
          this.currentSentenceIndex = sentenceData.index;
          this.currentSentence = sentenceData.data;
          this.preparePuzzle();
          this.renderSentence();
          this.renderWordBank();
          this.updateStats();
          this.hideFeedback();
          this.updateSubmitButton();
          this.elements.sentenceHint.textContent = `🏋️ Practice mode (${this.mode}). All sentences mastered! Keep practicing!`;
          this.elements.sentenceHint.style.color = "#4a8aba";
          this.elements.sentenceTtsBtn.disabled = false;
          this.syncModeUI();
          this.syncPrimaryModeUI();
          return;
        }
      }

      console.warn("⚠️ No practice sentences available");
      return;
    }

    // Get next sentence from mastery manager (returns RELATIVE index)
    const relativeIndex = this.mastery.getNextSentence();

    if (relativeIndex === null) {
      if (this.mastery.checkCompletion()) {
        if (this.mastery.shouldShowCompletion()) {
          this.showCompletion();
          this.mastery.markCompletionShown();
          this.mastery.save();
        }
      }
      return;
    }

    // CRITICAL FIX: Map the relative index to the global index using sprintSentences
    const sentenceInfo = this.sprintSentences[relativeIndex];
    if (!sentenceInfo) {
      console.error(`❌ No sentence info for relative index ${relativeIndex}`);
      this.loadNextSentence();
      return;
    }

    const globalIndex = sentenceInfo.index;
    const data = this.getData();
    const sentenceData = data && data[globalIndex] ? data[globalIndex] : null;

    if (!sentenceData) {
      console.error(`❌ Sentence at global index ${globalIndex} not found`);
      this.loadNextSentence();
      return;
    }

    this.currentSentenceIndex = globalIndex;
    this.currentSentence = sentenceData;

    this.preparePuzzle();
    this.renderSentence();
    this.renderWordBank();
    this.updateStats();
    this.hideFeedback();

    this.elements.submitBtn.disabled = true;
    this.elements.sentenceTtsBtn.disabled = false;

    this.syncModeUI();
    this.syncPrimaryModeUI();

    console.log(
      `📖 Loaded sentence: relative[${relativeIndex}] → global[${globalIndex}]: ${this.currentSentence.jp}`,
    );
  }

  // ============================================================
  // PUZZLE PREPARATION
  // ============================================================

  preparePuzzle() {
    console.log(`🎯 preparePuzzle called, mode: ${this.mode}`);

    switch (this.mode) {
      case "order":
        this.preparePuzzleOrder();
        break;
      case "select-order":
        this.preparePuzzleSelectOrder();
        break;
      default:
        this.preparePuzzleFill();
    }
  }

  preparePuzzleFill() {
    const jp = this.currentSentence.jp;
    this.words = this.splitSentenceWords(jp);

    const totalWords = this.words.length;
    let numBlanks = this.calculateBlanks(totalWords);

    if (totalWords >= 3 && numBlanks < 2) numBlanks = 2;
    if (numBlanks >= totalWords) numBlanks = Math.max(1, totalWords - 1);

    this.blankIndices = this.selectBlankIndices(totalWords, numBlanks);

    if (this.blankIndices.length === 0 && totalWords >= 2) {
      this.blankIndices = [0, Math.min(1, totalWords - 1)];
      if (this.blankIndices[0] === this.blankIndices[1]) {
        this.blankIndices = [0, totalWords - 1];
      }
    }

    this.wordBank = this.blankIndices.map((idx) => ({
      ...this.words[idx],
      originalIndex: idx,
      used: false,
      isDistractor: false,
    }));

    this.shuffleArray(this.wordBank);
    this.resetPlacements();
  }

  preparePuzzleOrder() {
    console.log("📊 preparePuzzleOrder called");
    const jp = this.currentSentence.jp;
    this.words = this.splitSentenceWords(jp);

    this.blankIndices = this.words.map((_, i) => i);

    this.wordBank = this.words.map((word, idx) => ({
      ...word,
      originalIndex: idx,
      used: false,
      orderPosition: null,
      isDistractor: false,
    }));
    this.shuffleArray(this.wordBank);
    this.resetPlacements();

    console.log(`📊 Order mode: ${this.words.length} words`);
  }

  preparePuzzleSelectOrder() {
    console.log("🎯 preparePuzzleSelectOrder called");
    const jp = this.currentSentence.jp;
    this.words = this.splitSentenceWords(jp);
    this.correctWordCount = this.words.length;

    const numDistractors = this.calculateDistractors(this.correctWordCount);
    console.log(
      `🎯 Select mode: ${this.correctWordCount} correct words, ${numDistractors} distractors`,
    );

    this.distractors = this.generateDistractors(numDistractors);

    const allWords = [
      ...this.words.map((w, i) => ({
        ...w,
        isDistractor: false,
        originalIndex: i,
        used: false,
      })),
      ...this.distractors.map((w) => ({
        ...w,
        isDistractor: true,
        originalIndex: -1,
        used: false,
      })),
    ];

    this.shuffleArray(allWords);
    this.wordBank = allWords;
    this.totalWordBankSize = this.wordBank.length;

    this.blankIndices = this.words.map((_, i) => i);
    this.resetPlacements();

    console.log(`📊 Select mode: ${this.wordBank.length} total words`);
  }

  resetPlacements() {
    this.placements = {};
    for (const idx of this.blankIndices) {
      this.placements[idx] = null;
    }
    this.selectedWordIndex = null;
    this.selectedBlankIndex = null;
    this.isSubmitted = false;
    this.isSubmitting = false;
  }

  // ============================================================
  // HELPERS
  // ============================================================

  splitSentenceWords(jpText) {
    const parts = jpText.split(/\s+/);
    const result = [];
    const dict = this.getWordDict();

    for (const part of parts) {
      const regex = /([\u4e00-\u9faf\u3400-\u4dbf]*[（(][^）)]+[）)])/g;
      let match;
      const splitParts = [];
      let lastEnd = 0;

      while ((match = regex.exec(part)) !== null) {
        const before = part.substring(lastEnd, match.index);
        if (before && before.trim()) {
          splitParts.push(before.trim());
        }
        splitParts.push(match[0]);
        lastEnd = regex.lastIndex;
      }

      if (lastEnd < part.length) {
        const remainingText = part.substring(lastEnd);
        if (remainingText && remainingText.trim()) {
          splitParts.push(remainingText.trim());
        }
      }

      if (splitParts.length > 1) {
        for (const seg of splitParts) {
          if (seg && seg.trim()) {
            result.push(this.createWordObject(seg, result.length));
          }
        }
      } else {
        const hasFurigana = /[（(][^）)]+[）)]/.test(part);
        if (!hasFurigana) {
          const clean = part.replace(/[（(][^）)]*[）)]/g, "").trim();
          if (dict && dict[clean] && dict[clean].reading) {
            const reading = dict[clean].reading;
            if (reading) {
              const wordWithFurigana = `${clean}（${reading}）`;
              result.push(
                this.createWordObject(wordWithFurigana, result.length),
              );
              continue;
            }
          }
        }
        result.push(this.createWordObject(part, result.length));
      }
    }

    return result;
  }

  createWordObject(part, index) {
    const clean = part.replace(/[（(][^）)]*[）)]/g, "").trim();
    let furigana = this.extractFurigana(part);
    let original = part;
    const dict = this.getWordDict();

    if (!furigana && dict && dict[clean]) {
      const dictEntry = dict[clean];
      if (dictEntry.reading) {
        furigana = dictEntry.reading;
        original = `${clean}（${furigana}）`;
      }
    }

    if (
      !furigana &&
      !/[\u4e00-\u9faf\u3400-\u4dbf]/.test(clean) &&
      dict &&
      dict[clean]
    ) {
      const dictEntry = dict[clean];
      if (dictEntry.reading) {
        furigana = dictEntry.reading;
        original = `${clean}（${furigana}）`;
      }
    }

    const kanji = this.extractKanji(part);
    const isParticle = this.isParticle(clean);

    return {
      original: original,
      clean: clean,
      kanji: kanji,
      furigana: furigana,
      index: index,
      isParticle: isParticle,
    };
  }

  calculateBlanks(totalWords) {
    if (totalWords <= 6) return 2;
    if (totalWords <= 9) return 3;
    return 4;
  }

  calculateDistractors(totalWords) {
    if (totalWords <= 7) return 2;
    if (totalWords <= 10) return 3;
    return 3;
  }

  generateDistractors(count) {
    const allWords = [];
    const usedCleanWords = new Set(this.words.map((w) => w.clean));
    const dict = this.getWordDict();

    if (dict && Object.keys(dict).length > 0) {
      const dictKeys = Object.keys(dict);
      this.shuffleArray(dictKeys);

      for (const key of dictKeys) {
        if (allWords.length >= count * 2) break;
        const clean = key;

        if (usedCleanWords.has(clean)) continue;
        if (!/^[\u3040-\u30FF]+$/.test(clean)) continue;
        if (clean.length > 12 || clean.length < 1) continue;

        const dictEntry = dict[key];
        const reading = dictEntry.reading || "";

        if (reading !== clean) continue;

        const original = `${clean}（${reading}）`;

        if (!allWords.some((aw) => aw.clean === clean)) {
          allWords.push({
            clean: clean,
            original: original,
            furigana: reading,
            isParticle: this.isParticle(clean),
          });
        }
      }
    }

    this.shuffleArray(allWords);
    const selected = allWords.slice(0, Math.min(count, allWords.length));

    return selected.map((w) => ({
      original: w.original || w.clean,
      clean: w.clean,
      kanji: w.clean,
      furigana: w.furigana || "",
      isParticle: w.isParticle || this.isParticle(w.clean),
      isDistractor: true,
    }));
  }

  selectBlankIndices(totalWords, numBlanks) {
    const safeNumBlanks = Math.min(numBlanks, totalWords);
    const indices = Array.from({ length: totalWords }, (_, i) => i);
    this.shuffleArray(indices);
    const selected = indices.slice(0, safeNumBlanks).sort((a, b) => a - b);

    if (selected.length < 2 && totalWords >= 3) {
      const fallbackIdx = (selected[0] + 1) % totalWords;
      if (!selected.includes(fallbackIdx)) {
        selected.push(fallbackIdx);
        selected.sort((a, b) => a - b);
      }
    }

    return selected;
  }

  extractFurigana(word) {
    const match = word.match(/[（(]([^）)]+)[）)]/);
    return match ? match[1] : "";
  }

  extractKanji(word) {
    return word.replace(/[（(][^）)]*[）)]/g, "").trim();
  }

  isParticle(word) {
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
      "には",
      "や",
    ];
    return particles.includes(word);
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ============================================================
  // BUILD DISPLAY WORD - with slot mode support
  // ============================================================
  buildDisplayWord(word, forSlot = false) {
    if (!word) return "";

    if (!this.showFurigana) {
      return word.replace(/[（(][^）)]*[）)]/g, "").trim();
    }

    if (forSlot && (this.mode === "order" || this.mode === "select-order")) {
      return word.replace(/[（(][^）)]*[）)]/g, "").trim();
    }

    return this.fallbackFurigana(word);
  }

  // ============================================================
  // FALLBACK FURIGANA - Trailing kana INSIDE ruby element
  // ============================================================
  fallbackFurigana(text) {
    if (!text) return "";
    let result = text;

    result = result.replace(
      /([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）([\u3040-\u30FF]*)/g,
      (_, kanji, furigana, trailing) =>
        `<ruby>${kanji}<rt>${furigana}</rt>${trailing}</ruby>`,
    );
    result = result.replace(
      /([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)([\u3040-\u30FF]*)/g,
      (_, kanji, furigana, trailing) =>
        `<ruby>${kanji}<rt>${furigana}</rt>${trailing}</ruby>`,
    );

    return result.replace(/[（(][^）)]*[）)]/g, "");
  }

  // ============================================================
  // RENDERING
  // ============================================================

  renderSentence() {
    console.log(`🎨 renderSentence called, mode: ${this.mode}`);

    switch (this.mode) {
      case "order":
        this.renderSentenceOrder();
        break;
      case "select-order":
        this.renderSentenceSelectOrder();
        break;
      default:
        this.renderSentenceFill();
    }
  }

  renderSentenceFill() {
    const container = this.elements.sentenceJp;
    const enContainer = this.elements.sentenceEn;

    let html = "";

    for (let i = 0; i < this.words.length; i++) {
      const word = this.words[i];
      const isBlank = this.blankIndices.includes(i);

      if (isBlank) {
        const blankIndex = this.blankIndices.indexOf(i);
        const placedWord = this.placements[i];
        const wordObj = placedWord !== null ? this.wordBank[placedWord] : null;

        let slotClass = "blank-slot";
        let content = "";

        if (placedWord !== null && wordObj) {
          slotClass += " filled";
          if (this.isSubmitted) {
            const isCorrect = this.words[i].clean === wordObj.clean;
            slotClass += isCorrect ? " correct" : " incorrect";
          }

          const displayHtml = this.buildDisplayWord(wordObj.original);
          content = `<span class="placed-word" data-blank="${i}" data-word-index="${placedWord}">${displayHtml}</span>`;
        } else {
          content = `<span class="blank-number">${blankIndex + 1}</span>`;
        }

        html += `<span class="${slotClass}" data-blank-index="${i}" data-blank-number="${blankIndex + 1}">${content}</span>`;
      } else {
        html += this.buildDisplayWord(word.original);
      }

      if (i < this.words.length - 1) {
        const nextWord = this.words[i + 1];
        if (!nextWord.isParticle) {
          html += " ";
        }
      }
    }

    container.innerHTML = html;
    this.addBlankSlotHandlers(container);
    this.renderTranslationAndHint(enContainer);
  }

  addBlankSlotHandlers(container) {
    container.querySelectorAll(".blank-slot").forEach((el) => {
      const newEl = el.cloneNode(true);
      el.parentNode.replaceChild(newEl, el);

      newEl.addEventListener("click", () => {
        const blankIndex = parseInt(newEl.dataset.blankIndex);
        if (isNaN(blankIndex)) return;

        if (this.placements[blankIndex] !== null) {
          this.removeWord(blankIndex);
        } else {
          this.placeWord(blankIndex);
        }
      });
    });

    container.querySelectorAll(".blank-slot:not(.filled)").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        if (this.selectedWordIndex !== null) {
          el.classList.add("highlight");
        }
      });
      el.addEventListener("mouseleave", () => {
        el.classList.remove("highlight");
      });
    });
  }

  renderSentenceOrder() {
    console.log("🎨 renderSentenceOrder called");
    const container = this.elements.sentenceJp;

    let html = '<div class="order-sentence-container">';

    const hasPlacements = this.blankIndices.some(
      (idx) => this.placements[idx] !== null,
    );

    if (!hasPlacements && !this.isSubmitted) {
      html +=
        '<div class="order-instruction">⬅️ Click words from the bank below to build the sentence</div>';
    }

    html += '<div class="order-slots-wrapper">';

    for (let i = 0; i < this.words.length; i++) {
      const placedWordIndex = this.placements[i];
      const wordObj =
        placedWordIndex !== null ? this.wordBank[placedWordIndex] : null;

      if (wordObj) {
        const displayHtml = this.buildDisplayWord(wordObj.original, true);
        const isCorrect =
          this.isSubmitted && wordObj.clean === this.words[i].clean;

        html += `<span class="order-slot filled ${isCorrect ? "correct" : ""}" 
                        data-position="${i}" 
                        data-word-index="${placedWordIndex}">
                        ${displayHtml}
                        <span class="order-number">${i + 1}</span>
                    </span>`;
      } else {
        html += `<span class="order-slot empty" 
                        data-position="${i}" 
                        data-blank-index="${i}">
                        <span class="order-number">${i + 1}</span>
                        <span class="slot-placeholder">⬜</span>
                    </span>`;
      }

      if (i < this.words.length - 1) {
        html += " ";
      }
    }

    html += "</div></div>";
    container.innerHTML = html;

    container.querySelectorAll(".order-slot.empty").forEach((el) => {
      el.addEventListener("click", () => {
        const blankIndex = parseInt(el.dataset.blankIndex);
        if (!isNaN(blankIndex)) {
          this.placeWordOrder(blankIndex);
        }
      });
    });

    container.querySelectorAll(".order-slot.filled").forEach((el) => {
      el.addEventListener("click", () => {
        const position = parseInt(el.dataset.position);
        if (!isNaN(position)) {
          this.removeWordOrder(position);
        }
      });
    });

    const enContainer = this.elements.sentenceEn;
    this.renderTranslationAndHint(enContainer);
  }

  renderSentenceSelectOrder() {
    console.log("🎨 renderSentenceSelectOrder called");
    const container = this.elements.sentenceJp;

    let html = '<div class="order-sentence-container">';

    html += `<div class="select-mode-instruction">
            📝 Place the <span class="highlight-count">${this.correctWordCount}</span> correct words in the right order 
            <span class="distractor-warning">(ignore the extra words!)</span>
        </div>`;

    html += '<div class="order-slots-wrapper">';

    for (let i = 0; i < this.words.length; i++) {
      const placedWordIndex = this.placements[i];
      const wordObj =
        placedWordIndex !== null ? this.wordBank[placedWordIndex] : null;

      if (wordObj) {
        const displayHtml = this.buildDisplayWord(wordObj.original, true);
        const isCorrect =
          this.isSubmitted &&
          !wordObj.isDistractor &&
          wordObj.clean === this.words[i].clean;
        const isDistractor = this.isSubmitted && wordObj.isDistractor;

        let slotClass = "order-slot filled";
        if (this.isSubmitted) {
          if (isCorrect) slotClass += " correct";
          else if (isDistractor) slotClass += " incorrect";
        }

        html += `<span class="${slotClass}" data-position="${i}" data-word-index="${placedWordIndex}">
                    ${displayHtml}
                    <span class="order-number">${i + 1}</span>
                </span>`;
      } else {
        html += `<span class="order-slot empty" data-position="${i}" data-blank-index="${i}">
                    <span class="order-number">${i + 1}</span>
                    <span class="slot-placeholder">⬜</span>
                </span>`;
      }

      if (i < this.words.length - 1) {
        html += " ";
      }
    }

    html += "</div></div>";
    container.innerHTML = html;

    container.querySelectorAll(".order-slot.empty").forEach((el) => {
      el.addEventListener("click", () => {
        const blankIndex = parseInt(el.dataset.blankIndex);
        if (!isNaN(blankIndex)) {
          this.placeWordSelectOrder(blankIndex);
        }
      });
    });

    container.querySelectorAll(".order-slot.filled").forEach((el) => {
      el.addEventListener("click", () => {
        const position = parseInt(el.dataset.position);
        if (!isNaN(position)) {
          this.removeWordSelectOrder(position);
        }
      });
    });

    const enContainer = this.elements.sentenceEn;
    this.renderTranslationAndHint(enContainer);
  }

  renderTranslationAndHint(enContainer) {
    if (this.showTranslation && this.currentSentence.translation) {
      enContainer.textContent = this.currentSentence.translation;
      enContainer.classList.add("visible");
    } else {
      enContainer.classList.remove("visible");
    }

    const modeStatus = this.mastery.getModeStatus();
    const modeLabels = {
      fill: "📝 Fill",
      order: "🔄 Order",
      "select-order": "🎯 Select",
    };
    const currentModeLabel = modeLabels[this.mode] || this.mode;
    const primaryModeLabel =
      modeLabels[this.mastery.primaryMode] || this.mastery.primaryMode;

    const progress = this.mastery.getProgress();

    if (!progress.sprintStarted && !this.mastery.allCompleted) {
      this.elements.sentenceHint.textContent = `📊 Sprint not started yet. Choose a mastery mode and start practicing! (Mastery: ${primaryModeLabel})`;
      this.elements.sentenceHint.style.color = "#7a6f60";
      this.updateSubmitButton();
      return;
    }

    if (progress.isLocked) {
      const practiceLabel = modeLabels[this.mode] || this.mode;
      this.elements.sentenceHint.textContent = `🔒 Mastery: ${primaryModeLabel} (${progress.mastered}/${progress.total}) | Practicing: ${practiceLabel}. Complete ${primaryModeLabel} to unlock other modes!`;
      this.elements.sentenceHint.style.color = "#8a7a4a";
      this.updateSubmitButton();
      return;
    }

    if (this.mastery.isPracticeMode) {
      this.elements.sentenceHint.textContent = `🏋️ Practice mode (${currentModeLabel}). All sentences mastered! Keep practicing! (Mastery tracked in ${primaryModeLabel})`;
      this.elements.sentenceHint.style.color = "#4a8aba";
    } else if (this.mastery.allCompleted) {
      this.elements.sentenceHint.textContent = `🎉 Sprint complete! Switch to any mode for practice!`;
      this.elements.sentenceHint.style.color = "#2d7a4a";
    } else {
      this.elements.sentenceHint.textContent = `📊 Mastery mode — your progress counts! (${primaryModeLabel})`;
      this.elements.sentenceHint.style.color = "#2d7a4a";
    }

    this.updateSubmitButton();
  }

  // ============================================================
  // WORD BANK RENDERING
  // ============================================================

  renderWordBank() {
    console.log(`📦 renderWordBank called, mode: ${this.mode}`);

    switch (this.mode) {
      case "order":
        this.renderWordBankOrder();
        break;
      case "select-order":
        this.renderWordBankSelectOrder();
        break;
      default:
        this.renderWordBankFill();
    }
  }

  renderWordBankFill() {
    const container = this.elements.wordBank;
    const countEl = this.elements.bankCount;

    const unusedCount = this.wordBank.filter((w) => !w.used).length;
    countEl.textContent = `${unusedCount} words`;

    if (this.wordBank.length === 0) {
      container.innerHTML = `<span class="empty-bank-message">No words to place!</span>`;
      return;
    }

    let html = "";
    for (let i = 0; i < this.wordBank.length; i++) {
      const word = this.wordBank[i];
      const isSelected = this.selectedWordIndex === i;
      const isUsed = word.used;

      const displayWord = this.buildDisplayWord(word.original);
      const ttsBtn = `<button class="word-tts-btn" data-word-index="${i}" title="🔊 Listen to word">🔊</button>`;

      html += `<span class="bank-word ${isSelected ? "selected" : ""} ${isUsed ? "used" : ""}" data-word-index="${i}">
                ${displayWord}
                ${!isUsed ? ttsBtn : ""}
            </span>`;
    }

    container.innerHTML = html;
    this.addBankClickHandlers(container);
  }

  renderWordBankOrder() {
    const container = this.elements.wordBank;
    const countEl = this.elements.bankCount;

    const unusedCount = this.wordBank.filter((w) => !w.used).length;
    countEl.textContent = `${unusedCount} words remaining`;

    if (this.wordBank.length === 0) {
      container.innerHTML = `<span class="empty-bank-message">No words to place!</span>`;
      return;
    }

    let html = "";
    for (let i = 0; i < this.wordBank.length; i++) {
      const word = this.wordBank[i];
      const isSelected = this.selectedWordIndex === i;
      const isUsed = word.used;

      const displayWord = this.buildDisplayWord(word.original);
      const ttsBtn = `<button class="word-tts-btn" data-word-index="${i}" title="🔊 Listen to word">🔊</button>`;

      html += `<span class="bank-word ${isSelected ? "selected" : ""} ${isUsed ? "used" : ""}" data-word-index="${i}">
                ${displayWord}
                ${!isUsed ? ttsBtn : ""}
            </span>`;
    }

    container.innerHTML = html;
    this.addBankClickHandlers(container);
  }

  renderWordBankSelectOrder() {
    const container = this.elements.wordBank;
    const countEl = this.elements.bankCount;

    const unusedCount = this.wordBank.filter((w) => !w.used).length;
    const totalWords = this.wordBank.length;
    countEl.textContent = `${unusedCount} / ${totalWords} words remaining`;

    if (this.wordBank.length === 0) {
      container.innerHTML = `<span class="empty-bank-message">No words to place!</span>`;
      return;
    }

    let html = "";
    for (let i = 0; i < this.wordBank.length; i++) {
      const word = this.wordBank[i];
      const isUsed = word.used;
      const isSelected = this.selectedWordIndex === i && !isUsed;

      let wordClass = "bank-word";
      if (isUsed) wordClass += " used";
      if (isSelected) wordClass += " selected";

      const displayWord = this.buildDisplayWord(word.original);
      const ttsBtn = `<button class="word-tts-btn" data-word-index="${i}" title="🔊 Listen">🔊</button>`;

      html += `<span class="${wordClass}" data-word-index="${i}">
                ${displayWord}
                ${!isUsed ? ttsBtn : ""}
            </span>`;
    }

    container.innerHTML = html;
    this.addBankClickHandlers(container);
  }

  addBankClickHandlers(container) {
    container.querySelectorAll(".bank-word:not(.used)").forEach((el) => {
      el.addEventListener("click", (e) => {
        if (e.target.classList.contains("word-tts-btn")) return;

        const index = parseInt(el.dataset.wordIndex);
        if (!isNaN(index)) {
          this.selectWord(index);
        }
      });
    });

    container.querySelectorAll(".word-tts-btn").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = parseInt(el.dataset.wordIndex);
        if (
          !isNaN(index) &&
          this.wordBank[index] &&
          !this.wordBank[index].used
        ) {
          this.speakWord(this.wordBank[index].original);
        }
      });
    });
  }

  // ============================================================
  // UPDATE SUBMIT BUTTON
  // ============================================================

  updateSubmitButton() {
    const allFilled = this.blankIndices.every(
      (idx) => this.placements[idx] !== null,
    );
    const isSubmitting = this.isSubmitting;

    this.elements.submitBtn.disabled = !allFilled || isSubmitting;

    if (isSubmitting) {
      this.elements.submitBtn.textContent = "⏳ Checking...";
    } else {
      this.elements.submitBtn.textContent = "✅ Submit";
    }
  }

  // ============================================================
  // UI INTERACTIONS
  // ============================================================

  selectWord(index) {
    if (this.isSubmitting) return;
    if (index < 0 || index >= this.wordBank.length) return;
    if (this.wordBank[index].used) return;

    if (this.selectedWordIndex === index) {
      this.selectedWordIndex = null;
      this.renderWordBank();
      return;
    }

    this.selectedWordIndex = index;
    this.renderWordBank();

    if (this.mode === "order" || this.mode === "select-order") {
      const firstEmpty = this.blankIndices.find(
        (idx) => this.placements[idx] === null,
      );
      if (firstEmpty !== undefined) {
        const placeMethod =
          this.mode === "order"
            ? this.placeWordOrder.bind(this)
            : this.placeWordSelectOrder.bind(this);
        placeMethod(firstEmpty);
      }
    }
  }

  // ============================================================
  // PLACE & REMOVE WORDS
  // ============================================================

  placeWord(blankIndex) {
    switch (this.mode) {
      case "order":
        this.placeWordOrder(blankIndex);
        break;
      case "select-order":
        this.placeWordSelectOrder(blankIndex);
        break;
      default:
        this.placeWordFill(blankIndex);
    }
  }

  placeWordFill(blankIndex) {
    if (this.isSubmitting) return;
    if (this.selectedWordIndex === null) return;
    if (this.placements[blankIndex] !== null) return;

    const wordIndex = this.selectedWordIndex;
    const word = this.wordBank[wordIndex];
    if (word.used) return;

    this.placements[blankIndex] = wordIndex;
    word.used = true;
    this.selectedWordIndex = null;

    this.renderSentence();
    this.renderWordBank();
    this.updateSubmitButton();
  }

  placeWordOrder(blankIndex) {
    if (this.isSubmitting) return;
    if (this.selectedWordIndex === null) return;
    if (this.placements[blankIndex] !== null) return;

    const wordIndex = this.selectedWordIndex;
    const word = this.wordBank[wordIndex];
    if (word.used) return;

    this.placements[blankIndex] = wordIndex;
    word.used = true;
    word.orderPosition = blankIndex;
    this.selectedWordIndex = null;

    this.renderSentenceOrder();
    this.renderWordBank();
    this.updateSubmitButton();
  }

  placeWordSelectOrder(blankIndex) {
    if (this.isSubmitting) return;
    if (this.selectedWordIndex === null) return;
    if (this.placements[blankIndex] !== null) return;

    const wordIndex = this.selectedWordIndex;
    const word = this.wordBank[wordIndex];
    if (word.used) return;

    this.placements[blankIndex] = wordIndex;
    word.used = true;
    this.selectedWordIndex = null;

    this.renderSentenceSelectOrder();
    this.renderWordBank();
    this.updateSubmitButton();
  }

  removeWord(blankIndex) {
    switch (this.mode) {
      case "order":
        this.removeWordOrder(blankIndex);
        break;
      case "select-order":
        this.removeWordSelectOrder(blankIndex);
        break;
      default:
        this.removeWordFill(blankIndex);
    }
  }

  removeWordFill(blankIndex) {
    if (this.isSubmitting) return;
    if (this.placements[blankIndex] === null) return;

    const wordIndex = this.placements[blankIndex];
    this.wordBank[wordIndex].used = false;
    this.placements[blankIndex] = null;

    this.renderSentence();
    this.renderWordBank();
    this.updateSubmitButton();
  }

  removeWordOrder(blankIndex) {
    if (this.isSubmitting) return;
    if (this.placements[blankIndex] === null) return;

    const wordIndex = this.placements[blankIndex];
    const word = this.wordBank[wordIndex];
    word.used = false;
    word.orderPosition = null;
    this.placements[blankIndex] = null;

    this.renderSentenceOrder();
    this.renderWordBank();
    this.updateSubmitButton();
  }

  removeWordSelectOrder(blankIndex) {
    if (this.isSubmitting) return;
    if (this.placements[blankIndex] === null) return;

    const wordIndex = this.placements[blankIndex];
    this.wordBank[wordIndex].used = false;
    this.placements[blankIndex] = null;

    this.renderSentenceSelectOrder();
    this.renderWordBank();
    this.updateSubmitButton();
  }

  // ============================================================
  // SUBMIT & VALIDATION
  // ============================================================

  submitAnswer() {
    if (this.isSubmitting) return;

    switch (this.mode) {
      case "order":
        this.submitAnswerOrder();
        break;
      case "select-order":
        this.submitAnswerSelectOrder();
        break;
      default:
        this.submitAnswerFill();
    }
  }

  submitAnswerFill() {
    const allFilled = this.blankIndices.every(
      (idx) => this.placements[idx] !== null,
    );
    if (!allFilled) {
      this.showFeedback(false, "Please fill all blanks before submitting.");
      return;
    }

    this.isSubmitting = true;
    this.updateSubmitButton();

    const results = this.validatePlacementsFill();
    const allCorrect = results.every((r) => r.correct);

    if (!this.mastery.isPracticeMode) {
      this.mastery.trackAttempt(
        this.currentSentenceIndex,
        allCorrect,
        this.mode,
      );
      this.mastery.save();
    }

    if (allCorrect) {
      this.showFeedback(true);
      this.isSubmitted = true;
      this.isSubmitting = false;
      this.updateSubmitButton();
      this.updateStats();
    } else {
      this.showFeedback(false, results);
      this.isSubmitted = true;
      this.isSubmitting = false;
      this.updateSubmitButton();
      this.updateStats();

      if (this.mastery.isPracticeMode) {
        this.elements.sentenceHint.textContent = `💡 Practice mode: Click "Next Sentence" to continue, or fix your answer.`;
        this.elements.sentenceHint.style.color = "#7a6f60";
      } else {
        setTimeout(() => {
          this.isSubmitted = false;
          this.updateSubmitButton();
        }, 2000);
      }
    }

    this.renderSentence();
  }

  validatePlacementsFill() {
    return this.blankIndices.map((blankIndex) => {
      const wordIndex = this.placements[blankIndex];
      const placedWord = this.wordBank[wordIndex];
      const correctWord = this.words[blankIndex];
      const isCorrect = placedWord.clean === correctWord.clean;

      return {
        blankIndex: blankIndex,
        placed: placedWord,
        correct: correctWord,
        correct: isCorrect,
      };
    });
  }

  submitAnswerOrder() {
    const allFilled = this.blankIndices.every(
      (idx) => this.placements[idx] !== null,
    );
    if (!allFilled) {
      this.showFeedback(false, "Please place all words in the correct order.");
      return;
    }

    this.isSubmitting = true;
    this.updateSubmitButton();

    const { results, allCorrect } = this.validateOrder();

    if (!this.mastery.isPracticeMode) {
      this.mastery.trackAttempt(
        this.currentSentenceIndex,
        allCorrect,
        this.mode,
      );
      this.mastery.save();
    }

    if (allCorrect) {
      this.showFeedback(true);
      this.isSubmitted = true;
      this.isSubmitting = false;
      this.updateSubmitButton();
      this.updateStats();
    } else {
      this.showFeedback(false, results);
      this.isSubmitted = true;
      this.isSubmitting = false;
      this.updateSubmitButton();
      this.updateStats();

      if (this.mastery.isPracticeMode) {
        this.elements.sentenceHint.textContent = `💡 Practice mode: Click "Next Sentence" to continue, or fix your answer.`;
        this.elements.sentenceHint.style.color = "#7a6f60";
      } else {
        setTimeout(() => {
          this.isSubmitted = false;
          this.updateSubmitButton();
        }, 2000);
      }
    }

    this.renderSentenceOrder();
  }

  validateOrder() {
    const results = [];
    let allCorrect = true;

    for (let i = 0; i < this.words.length; i++) {
      const wordIndex = this.placements[i];
      const placedWord = wordIndex !== null ? this.wordBank[wordIndex] : null;
      const correctWord = this.words[i];
      const isCorrect = placedWord && placedWord.clean === correctWord.clean;

      results.push({
        position: i,
        placed: placedWord,
        correct: correctWord,
        isCorrect: isCorrect,
      });

      if (!isCorrect) allCorrect = false;
    }

    return { results, allCorrect };
  }

  submitAnswerSelectOrder() {
    const allFilled = this.blankIndices.every(
      (idx) => this.placements[idx] !== null,
    );
    if (!allFilled) {
      this.showFeedback(false, "Please place all correct words in order.");
      return;
    }

    this.isSubmitting = true;
    this.updateSubmitButton();

    const { results, allCorrect } = this.validateSelectOrder();

    if (!this.mastery.isPracticeMode) {
      this.mastery.trackAttempt(
        this.currentSentenceIndex,
        allCorrect,
        this.mode,
      );
      this.mastery.save();
    }

    if (allCorrect) {
      this.showFeedback(true);
      this.isSubmitted = true;
      this.isSubmitting = false;
      this.updateSubmitButton();
      this.updateStats();
    } else {
      this.showFeedback(false, results);
      this.isSubmitted = true;
      this.isSubmitting = false;
      this.updateSubmitButton();
      this.updateStats();

      if (this.mastery.isPracticeMode) {
        this.elements.sentenceHint.textContent = `💡 Practice mode: Click "Next Sentence" to continue, or fix your answer.`;
        this.elements.sentenceHint.style.color = "#7a6f60";
      } else {
        setTimeout(() => {
          this.isSubmitted = false;
          this.updateSubmitButton();
        }, 2000);
      }
    }

    this.renderSentenceSelectOrder();
  }

  validateSelectOrder() {
    const results = [];
    let allCorrect = true;

    for (let i = 0; i < this.words.length; i++) {
      const wordIndex = this.placements[i];
      const placedWord = wordIndex !== null ? this.wordBank[wordIndex] : null;
      const correctWord = this.words[i];

      if (placedWord === null) {
        allCorrect = false;
        results.push({
          position: i,
          placed: null,
          correct: correctWord,
          isCorrect: false,
          error: "missing",
        });
        continue;
      }

      if (placedWord.isDistractor) {
        allCorrect = false;
        results.push({
          position: i,
          placed: placedWord,
          correct: correctWord,
          isCorrect: false,
          error: "distractor",
        });
        continue;
      }

      const isCorrect = placedWord.clean === correctWord.clean;
      if (!isCorrect) allCorrect = false;

      results.push({
        position: i,
        placed: placedWord,
        correct: correctWord,
        isCorrect: isCorrect,
        error: isCorrect ? null : "wrong_order",
      });
    }

    const unusedCorrectWords = this.wordBank.filter(
      (w) => !w.used && !w.isDistractor,
    );
    if (unusedCorrectWords.length > 0) {
      allCorrect = false;
      results.push({
        position: -1,
        placed: null,
        correct: unusedCorrectWords[0],
        isCorrect: false,
        error: "missing_word",
        missingWords: unusedCorrectWords.map((w) => w.clean),
      });
    }

    const usedDistractors = this.wordBank.filter(
      (w) => w.used && w.isDistractor,
    );
    if (
      usedDistractors.length > 0 &&
      !results.some((r) => r.error === "distractor")
    ) {
      allCorrect = false;
      results.push({
        position: -2,
        placed: usedDistractors[0],
        correct: null,
        isCorrect: false,
        error: "distractor_used",
        distractorWords: usedDistractors.map((w) => w.clean),
      });
    }

    return { results, allCorrect };
  }

  // ============================================================
  // SHARED STATS & FEEDBACK
  // ============================================================

  updateStatsAndFeedback(allCorrect, results) {
    console.log("updateStatsAndFeedback called - use submit methods instead");
  }

  // ============================================================
  // FEEDBACK - Helper methods to reduce duplication
  // ============================================================

  buildPlayButtonHTML() {
    return `
      <button class="play-correct-btn" id="playCorrectBtn" title="Play correct sentence">🔊</button>
    `;
  }

  buildNextButtonHTML() {
    return `
      <div style="margin-top:14px;">
        <button class="action-btn secondary" id="nextAfterWrongBtn" style="font-size:0.85rem;padding:8px 24px;">
          ➡️ Next Sentence
        </button>
      </div>
    `;
  }

  buildCorrectSentenceHTML() {
    const correctedSentence = this.buildCorrectSentence();
    return `
      <div class="correct-sentence-container">
        <strong class="correct-sentence-label">✅ Correct sentence:</strong>
        <span class="correct-sentence-text">${correctedSentence}</span>
        ${this.buildPlayButtonHTML()}
      </div>
    `;
  }

  // ============================================================
  // FEEDBACK
  // ============================================================

  showFeedback(isCorrect, data = null) {
    const area = this.elements.feedbackArea;
    const title = this.elements.feedbackTitle;
    const detail = this.elements.feedbackDetail;

    const existingButtons = area.querySelectorAll('.feedback-action-btn');
    existingButtons.forEach(btn => btn.remove());

    area.classList.add("visible");
    area.className = "feedback-area visible";
    area.classList.add(isCorrect ? "success" : "error");

    if (isCorrect) {
      const practiceNote = this.mastery.isPracticeMode
        ? " (Practice mode)"
        : "";
      const messages = {
        "select-order": `✅ Perfect! Correct words in the right order! 🎉${practiceNote}`,
        order: `✅ Perfect order! Well done! 🎉${practiceNote}`,
        default: `✅ Correct! Well done!${practiceNote}`,
      };
      title.textContent = messages[this.mode] || messages.default;

      let detailHtml = "";
      if (this.mastery.isPracticeMode) {
        detailHtml = `You placed all the words correctly! (Practice mode — stats not tracked)`;
      } else {
        detailHtml =
          this.mode === "select-order"
            ? `You selected the right words and arranged them perfectly!`
            : this.mode === "order"
              ? `You arranged all the words correctly!`
              : `You placed all the words correctly!`;
      }

      detail.innerHTML = detailHtml;

      const btnContainer = document.createElement('div');
      btnContainer.className = 'feedback-action-btn';
      btnContainer.style.marginTop = '14px';
      
      const nextBtn = document.createElement('button');
      nextBtn.className = 'action-btn secondary';
      nextBtn.textContent = '➡️ Next Sentence';
      nextBtn.style.fontSize = '0.85rem';
      nextBtn.style.padding = '8px 24px';
      nextBtn.style.cursor = 'pointer';
      
      nextBtn.addEventListener('click', () => {
        this.isSubmitted = false;
        this.isSubmitting = false;
        this.updateSubmitButton();
        this.hideFeedback();
        this.loadNextSentence();
      });
      
      nextBtn.addEventListener('mouseenter', () => {
        nextBtn.style.transform = 'scale(0.97)';
        nextBtn.style.background = '#7a6a5a';
      });
      nextBtn.addEventListener('mouseleave', () => {
        nextBtn.style.transform = 'scale(1)';
        nextBtn.style.background = '#8a7a6a';
      });
      
      btnContainer.appendChild(nextBtn);
      area.appendChild(btnContainer);
      
    } else {
      switch (this.mode) {
        case "select-order":
          this.showFeedbackSelectOrderError(data, title, detail);
          break;
        case "order":
          this.showFeedbackOrderError(data, title, detail);
          break;
        default:
          this.showFeedbackFillError(data, title, detail);
      }
    }
  }

  showFeedbackFillError(data, title, detail) {
    title.textContent = "❌ Not quite right.";
    let detailHtml = "";

    if (this.currentSentence.grammarHint) {
      detailHtml += `<div class="grammar-hint">💡 ${this.currentSentence.grammarHint}</div>`;
    }

    detailHtml += this.buildCorrectSentenceHTML();
    detailHtml += this.buildNextButtonHTML();

    detail.innerHTML = detailHtml;
    this.addFeedbackButtons();
  }

  showFeedbackOrderError(data, title, detail) {
    title.textContent = "❌ Not quite right. Check the order:";

    let detailHtml = '<div style="margin-top:8px;">';

    if (this.currentSentence.grammarHint) {
      detailHtml += `<div class="grammar-hint">💡 ${this.currentSentence.grammarHint}</div>`;
    }

    detailHtml += this.buildCorrectSentenceHTML();

    detailHtml += this.buildNextButtonHTML();
    detailHtml += "</div>";
    detail.innerHTML = detailHtml;
    this.addFeedbackButtons();
  }

  showFeedbackSelectOrderError(data, title, detail) {
    title.textContent = "❌ Not quite right.";

    let detailHtml = '<div style="margin-top:8px;">';

    if (this.currentSentence.grammarHint) {
      detailHtml += `<div class="grammar-hint">💡 ${this.currentSentence.grammarHint}</div>`;
    }

    detailHtml += this.buildCorrectSentenceHTML();

    detailHtml += this.buildNextButtonHTML();
    detailHtml += "</div>";
    detail.innerHTML = detailHtml;
    this.addFeedbackButtons();
  }

  // ============================================================
  // ADD FEEDBACK BUTTONS
  // ============================================================

  addFeedbackButtons() {
    const playBtn = document.getElementById("playCorrectBtn");
    if (playBtn) {
      const newPlayBtn = playBtn.cloneNode(true);
      playBtn.parentNode.replaceChild(newPlayBtn, playBtn);

      newPlayBtn.addEventListener("mouseenter", () => {
        newPlayBtn.style.transform = "scale(1.2)";
      });
      newPlayBtn.addEventListener("mouseleave", () => {
        newPlayBtn.style.transform = "scale(1)";
      });

      newPlayBtn.addEventListener("click", () => {
        const jpText = this.currentSentence.jp;
        console.log("🔊 Playing correct sentence:", jpText);
        if (typeof speakText === "function") {
          speakText(jpText, "ja-JP", this.ttsSpeed);
        } else if (typeof audioManager !== "undefined") {
          audioManager.speak(jpText, "ja-JP", this.ttsSpeed);
        } else {
          console.warn("⚠️ TTS not available for correct sentence");
        }
      });
    }

    const nextBtn = document.getElementById("nextAfterWrongBtn");
    if (nextBtn) {
      const newNextBtn = nextBtn.cloneNode(true);
      nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

      newNextBtn.addEventListener("click", () => {
        this.isSubmitted = false;
        this.isSubmitting = false;
        this.updateSubmitButton();
        this.hideFeedback();
        this.loadNextSentence();
      });
    }
  }

  buildCorrectSentence() {
    return this.words
      .map((word, i) => {
        const isBlank = this.blankIndices.includes(i);
        const displayWord = this.buildDisplayWord(word.original);

        if (isBlank) {
          return `<span class="highlight-word">${displayWord}</span>`;
        }
        return displayWord;
      })
      .join(" ");
  }

  hideFeedback() {
    this.elements.feedbackArea.classList.remove("visible");
    this.elements.feedbackArea.className = "feedback-area";
  }

  // ============================================================
  // COMPLETION - FIXED with better next sprint handling
  // ============================================================

  showCompletion() {
    const overlay = this.elements.completionOverlay;
    overlay.classList.add("visible");

    const stats = this.mastery.getStats();
    const progress = this.mastery.getProgress();
    const modeStatus = this.mastery.getModeStatus();

    if (!this.mastery.isPracticeMode) {
      this.mastery.isPracticeMode = true;
      this.mastery.save();
    }

    const modeLabels = {
      fill: "📝 Fill",
      order: "🔄 Order",
      "select-order": "🎯 Select",
    };

    const primaryModeLabel =
      modeLabels[this.mastery.primaryMode] || this.mastery.primaryMode;
    const practiceModeLabel = modeLabels[this.mode] || this.mode;

    let statsHtml = `
      <p style="color:#5a8a6a;font-weight:500;font-size:1.1rem;">🏆 Mastered in ${primaryModeLabel} mode!</p>
      <p style="color:#3d352b;margin-top:8px;">You've mastered all sentences in this sprint!</p>
      <p style="margin-top:12px;">✅ Correct: <span class="highlight-num">${stats.correct}</span></p>
      <p>❌ Incorrect: <span class="highlight-num">${stats.incorrect}</span></p>
      <p>📝 Total attempts: <span class="highlight-num">${stats.attempts}</span></p>
      <p>🔄 Cycles: <span class="highlight-num">${stats.cycleNumber}</span></p>
      <p style="color:#4a8aba;margin-top:12px;font-size:0.95rem;">🏋️ You are now in <strong>Practice Mode</strong> — keep practicing!</p>
    `;

    if (this.mastery.isPracticeMode) {
      statsHtml += `
        <p style="color:#7a6f60;font-size:0.85rem;margin-top:12px;padding:8px 12px;background:#f5f0eb;border-radius:8px;border-left:3px solid #b8a58b;">
          💡 You were practicing in <strong>${practiceModeLabel}</strong> mode. 
          Mastery is tracked in <strong>${primaryModeLabel}</strong> mode.
        </p>
      `;
    }

    if (this.sprints.length > 1) {
      const nextIndex = (this.activeSprintIndex + 1) % this.sprints.length;
      const nextName = this.sprints[nextIndex].displayName || this.sprints[nextIndex].name || `Sprint ${nextIndex + 1}`;
      statsHtml += `
        <p style="color:#2d7a4a;font-size:0.9rem;margin-top:12px;">
          ➡️ Click "Next Sprint" to go to <strong>${nextName}</strong>
        </p>
      `;
    } else {
      statsHtml += `
        <p style="color:#7a6f60;font-size:0.9rem;margin-top:12px;">
          ℹ️ This is the only sprint. Click "Reset Sprint" to start over.
        </p>
      `;
    }

    this.elements.completionStats.innerHTML = statsHtml;

    this.elements.submitBtn.disabled = true;
    this.elements.sentenceTtsBtn.disabled = false;

    this.syncModeUI();
    this.syncPrimaryModeUI();
    this.updateStats();

    console.log(
      `🎉 Sprint complete! Now in practice mode. Practice was in: ${this.mode}`,
    );
  }

  // ============================================================
  // STATS & PROGRESS
  // ============================================================

  updateStats() {
    const progress = this.mastery.getProgress();
    const stats = this.mastery.getStats();
    const modeStatus = this.mastery.getModeStatus();

    this.elements.progressBar.style.width = `${progress.progress}%`;

    const modeLabel =
      modeStatus.primaryMode === "fill"
        ? "📝 Fill"
        : modeStatus.primaryMode === "order"
          ? "🔄 Order"
          : "🎯 Select";

    let progressText = `${progress.mastered} / ${progress.total} mastered (${modeLabel})`;
    if (this.mastery.isPracticeMode) {
      progressText += ` | 🏋️ Practicing: ${this.mode}`;
    } else if (progress.isLocked) {
      const practiceLabel = modeLabels[this.mode] || this.mode;
      progressText += ` | 🔒 Practicing: ${practiceLabel}`;
    }
    this.elements.progressText.textContent = progressText;
    this.elements.progressPercent.textContent = `${Math.round(progress.progress)}%`;

    this.elements.correctCount.textContent = stats.correct;
    this.elements.incorrectCount.textContent = stats.incorrect;
    this.elements.attemptsCount.textContent = stats.attempts;
    this.elements.cycleCount.textContent = stats.cycleNumber;
    this.elements.masteredCount.textContent = progress.mastered;

    if (progress.isLocked) {
      this.elements.masteredCount.style.color = "#8a7a4a";
      this.elements.progressText.style.color = "#8a7a4a";
      this.elements.progressBar.style.background = "#f0ebe3";
    } else if (this.mastery.isPracticeMode) {
      this.elements.masteredCount.style.color = "#4a8aba";
      this.elements.progressText.style.color = "#4a8aba";
      this.elements.progressBar.style.background = "#e3f0ff";
    } else {
      this.elements.masteredCount.style.color = "";
      this.elements.progressText.style.color = "";
      this.elements.progressBar.style.background = "";
    }

    if (progress.isLocked) {
      const practiceLabel = modeLabels[this.mode] || this.mode;
      const primaryLabel =
        modeLabels[this.mastery.primaryMode] || this.mastery.primaryMode;
      this.elements.sentenceHint.textContent = `🔒 Mastery: ${primaryLabel} (${progress.mastered}/${progress.total}) | Practicing: ${practiceLabel}. Complete ${primaryLabel} to unlock other modes!`;
      this.elements.sentenceHint.style.color = "#8a7a4a";
    } else if (this.mastery.isPracticeMode) {
      this.elements.sentenceHint.textContent = `🏋️ Practice mode (${this.mode}). All sentences mastered! Keep practicing!`;
      this.elements.sentenceHint.style.color = "#4a8aba";
    } else if (this.mastery.allCompleted) {
      this.elements.sentenceHint.textContent = `🎉 Sprint complete! Switch to any mode for practice!`;
      this.elements.sentenceHint.style.color = "#2d7a4a";
    } else if (!this.mastery.allCompleted) {
      this.elements.sentenceHint.textContent = `📊 Mastery mode — your progress counts! (${modeStatus.primaryMode})`;
      this.elements.sentenceHint.style.color = "#2d7a4a";
    }

    this.syncModeUI();
    this.syncPrimaryModeUI();
  }

  // ============================================================
  // RESET MASTERY PROGRESS
  // ============================================================

  resetMasteryProgress() {
    if (
      !confirm("⚠️ This will reset ALL progress for this sprint. Are you sure?")
    ) {
      return;
    }

    console.log("🔄 Resetting mastery progress...");
    this.mastery.resetMasteryProgress();

    this.elements.completionOverlay.classList.remove("visible");

    this.hideFeedback();
    this.loadNextSentence();
    this.updateStats();
    this.syncModeUI();
    this.syncPrimaryModeUI();

    console.log("✅ Mastery progress reset");
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  resetSprint() {
    this.mastery.reset(true);
    this.mastery.isPracticeMode = false;
    this.mastery.sprintStarted = false;
    this.mastery.save();

    this.elements.completionOverlay.classList.remove("visible");

    this.hideFeedback();
    this.loadNextSentence();
    this.updateStats();
    this.syncModeUI();
    this.syncPrimaryModeUI();

    console.log("⟳ Sprint reset");
  }

  // ============================================================
  // CLEAR ALL PROGRESS
  // ============================================================

  clearAllProgress() {
    if (
      !confirm(
        "⚠️ This will delete ALL your progress for ALL sprints. Are you sure?",
      )
    ) {
      return;
    }

    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("sentence_builder_")) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));

      console.log(`🗑️ Cleared ${keysToRemove.length} progress items`);

      location.reload();
    } catch (error) {
      console.error("Error clearing progress:", error);
      alert("Failed to clear progress. Please try again.");
    }
  }

  // ============================================================
  // PRIMARY MODE MANAGEMENT
  // ============================================================

  changePrimaryMode(mode) {
    if (!this.validModes.includes(mode)) {
      console.warn(`Invalid primary mode: ${mode}`);
      return;
    }

    if (!this.mastery.canChangePrimaryMode()) {
      const modeLabels = {
        fill: "📝 Fill",
        order: "🔄 Order",
        "select-order": "🎯 Select",
      };
      const currentLabel =
        modeLabels[this.mastery.primaryMode] || this.mastery.primaryMode;
      alert(
        `🔒 Cannot change mastery mode mid-sprint!\n\nYou have progress in ${currentLabel} mode.\n\nComplete the sprint or use "Reset Mastery Progress" to switch.`,
      );
      return;
    }

    console.log(
      `🎯 Changing primary mode from ${this.mastery.primaryMode} to ${mode}`,
    );

    const success = this.mastery.setPrimaryMode(mode, this.mode);
    if (success) {
      this.mastery.save();
      this.syncPrimaryModeUI();
      this.updateStats();
      this.syncModeUI();

      if (this.currentSentence) {
        this.preparePuzzle();
        this.renderSentence();
        this.renderWordBank();
        this.hideFeedback();
        this.updateSubmitButton();
      }

      console.log(`✅ Primary mode changed to: ${mode}`);
    }
  }

  // ============================================================
  // MODE SWITCHING
  // ============================================================

  setMode(mode) {
    console.log(`🔄 setMode called with: ${mode}`);

    if (!this.validModes.includes(mode)) {
      console.warn(`⚠️ Invalid mode: ${mode}`);
      return;
    }

    if (this.mode === mode) {
      console.log(`ℹ️ Already in ${mode} mode`);
      return;
    }

    const progress = this.mastery.getProgress();
    if (progress.isLocked && mode !== this.mastery.primaryMode) {
      const modeLabels = {
        fill: "📝 Fill",
        order: "🔄 Order",
        "select-order": "🎯 Select",
      };
      const primaryLabel =
        modeLabels[this.mastery.primaryMode] || this.mastery.primaryMode;
      const targetLabel = modeLabels[mode] || mode;
      console.warn(
        `⚠️ Cannot switch to ${targetLabel} mode. Complete ${primaryLabel} mastery first!`,
      );
      this.elements.sentenceHint.textContent = `🔒 Cannot switch to ${targetLabel} mode. Complete ${primaryLabel} mastery first! (${progress.mastered}/${progress.total})`;
      this.elements.sentenceHint.style.color = "#b34a4a";
      setTimeout(() => {
        this.renderTranslationAndHint(this.elements.sentenceEn);
      }, 3000);
      return;
    }

    console.log(`🔄 Switching mode from ${this.mode} to ${mode}`);
    this.mode = mode;

    this.mastery.updatePracticeMode(mode);
    this.mastery.save();

    this.syncModeUI();
    this.syncPrimaryModeUI();

    if (this.currentSentence) {
      console.log(`🔄 Reloading sentence in ${mode} mode`);
      this.preparePuzzle();
      this.renderSentence();
      this.renderWordBank();
      this.hideFeedback();
      this.updateSubmitButton();
      console.log(`✅ Sentence reloaded in ${mode} mode`);
    }

    this.updateStats();
    this.saveProgress();
    console.log(`✅ Mode switched to: ${mode}`);
  }

  // ============================================================
  // TTS
  // ============================================================

  speakSentence() {
    if (!this.currentSentence) return;

    let userSentence = "";
    let hasPlacements = false;

    for (let i = 0; i < this.words.length; i++) {
      const word = this.words[i];
      const isBlank = this.blankIndices.includes(i);

      if (isBlank) {
        const placedWord = this.placements[i];
        if (placedWord !== null) {
          const wordObj = this.wordBank[placedWord];
          userSentence += wordObj.clean;
          hasPlacements = true;
        } else {
          userSentence += " ";
        }
      } else {
        userSentence += word.clean;
      }

      if (i < this.words.length - 1) {
        const nextWord = this.words[i + 1];
        if (!nextWord.isParticle) {
          userSentence += " ";
        }
      }
    }

    userSentence = userSentence.replace(/\s+/g, " ").trim();

    if (!hasPlacements) {
      const message = "Please place some words from the word bank.";
      this.speakWithFallback(message, "en-US");
      return;
    }

    if (userSentence.trim() === "" || userSentence.trim() === " ") {
      const message = "Please place some words first.";
      this.speakWithFallback(message, "en-US");
      return;
    }

    this.speakWithFallback(userSentence, "ja-JP");
  }

  speakWithFallback(text, lang) {
    if (typeof speakText === "function") {
      speakText(text, lang, this.ttsSpeed);
    } else if (typeof audioManager !== "undefined") {
      audioManager.speak(text, lang, this.ttsSpeed);
    } else {
      console.warn("⚠️ TTS not available");
    }
  }

  speakWord(word) {
    if (!word) return;
    const cleanWord = word.replace(/[（(][^）)]*[）)]/g, "").trim();

    if (typeof speakWord === "function") {
      speakWord(cleanWord);
    } else {
      this.speakWithFallback(cleanWord, "ja-JP");
    }
  }

  // ============================================================
  // EVENT LISTENERS - FIXED
  // ============================================================

  setupEventListeners() {
    console.log("🎯 Setting up event listeners...");

    this.elements.sprintSelect.addEventListener("change", (e) => {
      const index = parseInt(e.target.value);
      if (!isNaN(index) && index !== this.activeSprintIndex) {
        this.loadSprint(index);
      }
    });

    this.elements.furiganaToggle.addEventListener("click", this.toggleFurigana);
    this.elements.translationToggle.addEventListener(
      "click",
      this.toggleTranslation,
    );

    document.querySelectorAll(".speed-btn").forEach((el) => {
      el.addEventListener("click", () => {
        const speed = parseFloat(el.dataset.speed);
        if (!isNaN(speed)) {
          this.setSpeed(speed);
        }
      });
    });

    const modeButtons = document.querySelectorAll(".mode-btn");
    console.log(`🎯 Found ${modeButtons.length} mode buttons`);

    modeButtons.forEach((el) => {
      const mode = el.dataset.mode;
      console.log(`  Button: ${mode}`);

      el.addEventListener("click", () => {
        console.log(`🖱️ Mode button clicked: ${mode}`);
        if (mode && mode !== this.mode) {
          this.setMode(mode);
        }
      });
    });

    const primaryModeSelect = document.getElementById("primaryModeSelect");
    if (primaryModeSelect) {
      primaryModeSelect.addEventListener("change", (e) => {
        const mode = e.target.value;
        if (mode && this.validModes.includes(mode)) {
          this.changePrimaryMode(mode);
        }
      });
    }

    if (this.elements.resetMasteryBtn) {
      this.elements.resetMasteryBtn.addEventListener("click", () => {
        this.resetMasteryProgress();
      });
    }

    this.elements.submitBtn.addEventListener("click", this.submitAnswer);
    this.elements.resetBtn.addEventListener("click", this.resetSprint);
    this.elements.sentenceTtsBtn.addEventListener("click", this.speakSentence);

    this.elements.compResetBtn.addEventListener("click", this.resetSprint);
    
    this.elements.compNextSprintBtn.addEventListener("click", () => {
      if (this.sprints.length <= 1) {
        this.loadSprint(0);
        this.mastery.reset(true);
        this.mastery.isPracticeMode = false;
        this.mastery.sprintStarted = false;
        this.mastery.save();
        this.elements.completionOverlay.classList.remove("visible");
        this.hideFeedback();
        this.loadNextSentence();
        this.updateStats();
        this.syncModeUI();
        this.syncPrimaryModeUI();
        return;
      }
      
      const nextIndex = (this.activeSprintIndex + 1) % this.sprints.length;
      this.elements.sprintSelect.value = nextIndex;
      this.loadSprint(nextIndex);
    });

    if (this.elements.clearProgressBtn) {
      this.elements.clearProgressBtn.addEventListener("click", () => {
        this.clearAllProgress();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !this.elements.submitBtn.disabled) {
        this.submitAnswer();
      }
      if (e.key === "r" || e.key === "R") {
        this.resetSprint();
      }
    });

    console.log("🎯 Event listeners set up");
  }

  // ============================================================
  // DEBUG MODE & TEST HELPERS
  // ============================================================

  setupDebugMode() {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        this.debugMode = !this.debugMode;
        console.log(`🔧 Debug mode: ${this.debugMode ? "ON" : "OFF"}`);
        this.elements.sentenceHint.textContent = this.debugMode
          ? "🔧 Debug Mode ON"
          : "";
        this.elements.sentenceHint.style.color = this.debugMode
          ? "#b34a4a"
          : "";
        return;
      }

      if (!this.debugMode) return;

      if (e.ctrlKey && e.key === "ArrowRight") {
        e.preventDefault();
        if (this.currentSentenceIndex !== -1) {
          this.mastery.masteredIndices.add(this.currentSentenceIndex);
          this.mastery.save();
          this.loadNextSentence();
          this.updateStats();
          console.log("⏭️ Skipped sentence");
        }
      }

      if (e.ctrlKey && e.key === "m") {
        e.preventDefault();
        this.sprintSentences.forEach((s) => {
          this.mastery.masteredIndices.add(s.index);
        });
        this.mastery.save();
        this.loadNextSentence();
        this.updateStats();
        console.log("🏆 All sentences mastered");
      }

      if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        this.resetSprint();
        console.log("⟳ Sprint reset");
      }
    });
  }

  exposeTestHelpers() {
    if (typeof window === "undefined") return;

    window.testHelpers = {
      masterCurrent: () => {
        if (this.currentSentenceIndex !== -1) {
          const idx = this.currentSentenceIndex;
          this.mastery.masteredIndices.add(idx);
          if (!this.mastery.stats.sentenceCorrect[idx]) {
            this.mastery.stats.correct++;
            this.mastery.stats.attempts++;
            this.mastery.stats.sentenceAttempts[idx] = 1;
            this.mastery.stats.sentenceCorrect[idx] = true;
          }
          this.mastery.save();
          this.loadNextSentence();
          this.updateStats();
          console.log("✅ Marked current sentence as mastered");
        }
      },
      masterAll: () => {
        const total = this.sprintSentences.length;
        this.sprintSentences.forEach((s) => {
          this.mastery.masteredIndices.add(s.index);
        });
        this.mastery.stats.correct = total;
        this.mastery.stats.attempts = total;
        this.sprintSentences.forEach((s) => {
          this.mastery.stats.sentenceAttempts[s.index] = 1;
          this.mastery.stats.sentenceCorrect[s.index] = true;
        });
        this.mastery.allCompleted = true;
        this.mastery.completionShown = false;
        this.mastery.save();
        this.loadNextSentence();
        this.updateStats();
        console.log(`🏆 All ${total} sentences mastered`);
      },
      completeSprint: () => {
        this.autoCompleteSprint();
      },
      resetSprint: () => {
        this.resetSprint();
        console.log("⟳ Sprint reset");
      },
      resetMastery: () => {
        this.resetMasteryProgress();
        console.log("⟳ Mastery progress reset");
      },
      setMode: (mode) => {
        this.setMode(mode);
        console.log(`🔄 Switched to ${mode} mode`);
      },
      setPrimaryMode: (mode) => {
        this.changePrimaryMode(mode);
        console.log(`🎯 Primary mode set to ${mode}`);
      },
      state: () => {
        const progress = this.mastery.getProgress();
        const stats = this.mastery.getStats();
        const modeStatus = this.mastery.getModeStatus();
        console.log({
          sprint: this.activeSprintIndex,
          total: progress.total,
          mastered: progress.mastered,
          progress: progress.progress,
          isLocked: progress.isLocked,
          mode: this.mode,
          primaryMode: modeStatus.primaryMode,
          isPracticeMode: modeStatus.isPracticeMode,
          allCompleted: this.mastery.allCompleted,
          stats: stats,
        });
      },
    };

    console.log("🧪 Test helpers available: window.testHelpers");
    console.log("  - masterCurrent()    → Mark current sentence as mastered");
    console.log("  - masterAll()        → Mark all as mastered");
    console.log("  - completeSprint()   → Auto-complete sprint");
    console.log("  - resetSprint()      → Reset sprint");
    console.log("  - resetMastery()     → Reset mastery progress only");
    console.log(
      "  - setMode(mode)      → Switch modes (fill/order/select-order)",
    );
    console.log("  - setPrimaryMode(mode) → Set mastery mode");
    console.log("  - state()            → Show current state");
  }

  autoCompleteSprint() {
    if (!this.sprintSentences || this.sprintSentences.length === 0) {
      console.warn("No sprint loaded");
      return;
    }

    const total = this.sprintSentences.length;
    console.log(`⚡ Auto-completing ${total} sentences...`);

    this.sprintSentences.forEach((s) => {
      this.mastery.masteredIndices.add(s.index);
    });

    this.mastery.stats.correct = total;
    this.mastery.stats.incorrect = 0;
    this.mastery.stats.attempts = total;

    this.sprintSentences.forEach((s) => {
      this.mastery.stats.sentenceAttempts[s.index] = 1;
      this.mastery.stats.sentenceCorrect[s.index] = true;
    });

    this.mastery.allCompleted = true;
    this.mastery.completionShown = false;
    this.mastery.isPracticeMode = true;

    this.mastery.save();
    this.updateStats();
    this.loadNextSentence();

    console.log(`✅ Sprint auto-completed! (${total} sentences mastered)`);
  }

  // ============================================================
  // TOGGLES
  // ============================================================

  toggleFurigana() {
    this.showFurigana = !this.showFurigana;
    this.elements.furiganaToggle.textContent = this.showFurigana
      ? "🔤 ON"
      : "🔤 OFF";
    this.elements.furiganaToggle.classList.toggle("active", this.showFurigana);
    this.renderSentence();
    this.renderWordBank();
  }

  toggleTranslation() {
    this.showTranslation = !this.showTranslation;
    this.elements.translationToggle.textContent = this.showTranslation
      ? "📖 Hide Translation"
      : "📖 Show Translation";
    this.elements.translationToggle.classList.toggle(
      "active",
      this.showTranslation,
    );
    this.renderSentence();
  }

  setSpeed(speed) {
    this.ttsSpeed = speed;

    document.querySelectorAll(".speed-btn").forEach((el) => {
      el.classList.toggle("active", parseFloat(el.dataset.speed) === speed);
    });

    if (typeof audioManager !== "undefined") {
      audioManager.setSpeed(speed);
    }

    console.log(`🎤 Speed set to ${speed}x`);
  }

  // ============================================================
  // SAVE / LOAD (delegated to MasteryManager)
  // ============================================================

  saveProgress() {
    this.mastery.save();
    console.log("💾 Progress saved for sprint", this.activeSprintIndex);
  }

  loadProgress() {
    this.mastery.load(this.activeSprintIndex);
    console.log(`📂 Progress loaded for sprint ${this.activeSprintIndex}`);
  }

  // ============================================================
  // UTILITY
  // ============================================================

  getSentenceById(index) {
    const data = this.getData();
    return data && data[index] ? data[index] : null;
  }

  debug() {
    console.log("=== Sentence Builder Debug ===");
    console.log(
      "Sprint:",
      this.activeSprintIndex,
      this.sprints[this.activeSprintIndex],
    );
    console.log("Sentences in sprint:", this.sprintSentences.length);

    const progress = this.mastery.getProgress();
    const stats = this.mastery.getStats();
    const modeStatus = this.mastery.getModeStatus();

    console.log("Mastered:", progress.mastered, "/", progress.total);
    console.log("Failed:", this.mastery.getFailedCount());
    console.log("Cycle:", stats.cycleNumber);
    console.log("All completed:", this.mastery.allCompleted);
    console.log("Locked:", progress.isLocked);
    console.log("Practice mode:", this.mastery.isPracticeMode);
    console.log("Stats:", stats);
    console.log("Current sentence:", this.currentSentenceIndex);
    console.log("Show furigana:", this.showFurigana);
    console.log("Mode:", this.mode);
    console.log("Primary mode:", modeStatus.primaryMode);
    console.log("Practice mode:", modeStatus.isPracticeMode);
    if (this.mode === "select-order") {
      console.log("Distractors:", this.distractors.length);
      console.log("Correct words:", this.correctWordCount);
      console.log("Total bank:", this.totalWordBankSize);
    }
    console.log("===============================");
  }
}

if (typeof window !== "undefined") {
  window.SentenceBuilder = SentenceBuilder;
}

console.log("🧩 Sentence Builder module loaded");