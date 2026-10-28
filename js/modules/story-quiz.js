// ==================== STORY QUIZ MODULE ====================
// Renders comprehension questions from storyQuizData.js.
// Types: "comprehension", "synthesis", "negative".
// All options are full Japanese sentences with furigana.
// TTS: question, each option, and green/red feedback.
// Story Audio: plays full sprint MP3 narration.
// Progress persisted in localStorage per sprint.

(function () {
  "use strict";

  // ─── Data guard ──────────────────────────────────────────────
  if (typeof storyQuizData === "undefined" || !Array.isArray(storyQuizData)) {
    console.error("❌ storyQuizData not loaded — Story Quiz disabled.");
    const placeholder = document.getElementById("quizCardPlaceholder");
    if (placeholder) {
      placeholder.innerHTML =
        "<p style='color:#dc3545;'>⚠️ Story Quiz data not loaded. Check that <code>js/data/storyQuizData.js</code> is included before this module.</p>";
    }
    return;
  }

  // ─── DOM refs ────────────────────────────────────────────────
  const sprintSelect = document.getElementById("quizSprintSelect");
  const furiToggleBtn = document.getElementById("quizFuriToggleBtn");
  const transToggleBtn = document.getElementById("quizTransToggleBtn");
  const resetBtn = document.getElementById("quizResetBtn");

  const answeredCountEl = document.getElementById("quizAnsweredCount");
  const totalCountEl = document.getElementById("quizTotalCount");
  const correctCountEl = document.getElementById("quizCorrectCount");

  const placeholderEl = document.getElementById("quizCardPlaceholder");
  const contentEl = document.getElementById("quizCardContent");
  const completionEl = document.getElementById("quizCompletionPanel");
  const completionTextEl = document.getElementById("quizCompletionText");
  const restartBtn = document.getElementById("quizRestartSprintBtn");

  const sprintLabelEl = document.getElementById("quizSprintLabel");
  const questionIndexEl = document.getElementById("quizQuestionIndex");
  const questionJpEl = document.getElementById("quizQuestionJp");
  const questionSpeakBtn = document.getElementById("quizQuestionSpeakBtn");
  const optionsEl = document.getElementById("quizOptions");
  const feedbackEl = document.getElementById("quizFeedback");
  const feedbackTextEl = document.getElementById("quizFeedbackText");
  const compositionNoteEl = document.getElementById("quizCompositionNote");

  const prevBtn = document.getElementById("quizPrevBtn");
  const nextBtn = document.getElementById("quizNextBtn");
  const speakBtn = document.getElementById("quizSpeakBtn");

  const speed075Btn = document.getElementById("quizSpeed075Btn");
  const speed100Btn = document.getElementById("quizSpeed100Btn");

  // ─── Audio Bar DOM refs ──────────────────────────────────────
  const audioBar = document.getElementById("quizAudioBar");
  const audioPlayBtn = document.getElementById("quizAudioPlayBtn");
  const audioStopBtn = document.getElementById("quizAudioStopBtn");
  const audioTimeEl = document.getElementById("quizAudioTime");
  const audioPlayer = document.getElementById("quizAudioPlayer");

  // ─── State ───────────────────────────────────────────────────
  let currentSprintIdx = 0;
  let currentQuestionIdx = 0;
  let furiganaHidden = false;
  let translationHidden = false;
  let speechRate = 1.0;

  // answers[sprintIdx][questionIdx] = { picked: n, correct: bool }
  let answers = {};

  // ─── Persistence ─────────────────────────────────────────────
  const STORAGE_KEY = "n5_storyQuizProgress_v1";

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) answers = JSON.parse(raw);
      if (typeof answers !== "object" || answers === null) answers = {};
    } catch (e) {
      console.warn("Could not load quiz progress:", e);
      answers = {};
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch (e) {
      console.warn("Could not save quiz progress:", e);
    }
  }

  function getSprintAnswers(sprintIdx) {
    if (!answers[sprintIdx]) answers[sprintIdx] = {};
    return answers[sprintIdx];
  }

  // ─── Helpers ─────────────────────────────────────────────────
  function currentSprint() {
    return storyQuizData[currentSprintIdx];
  }

  function currentQuestion() {
    const s = currentSprint();
    if (!s) return null;
    return s.questions[currentQuestionIdx];
  }

  function toRuby(text) {
    if (!text) return "";
    if (typeof buildRubyHTML === "function") return buildRubyHTML(text);
    if (typeof window.buildRubyHTML === "function")
      return window.buildRubyHTML(text);
    return text.replace(
      /([\u4e00-\u9faf\u3400-\u4dbf\u3005]+)（([^（）]+)）/g,
      (_, k, f) => `<ruby>${k}<rt>${f}</rt></ruby>`
    );
  }

  function speak(text) {
    if (!text) return;
    if (typeof speakText === "function") {
      try {
        speakText(text, "ja-JP", speechRate);
        return;
      } catch (e) {}
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ja-JP";
      u.rate = speechRate;
      window.speechSynthesis.speak(u);
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // ─── Story Audio Helpers ─────────────────────────────────────
  const STORY_AUDIO_FILES = [
    "01-Daily-Routine.mp3",
    "02-Family-and-People.mp3",
    "03-Location-and-Transport.mp3",
    "04-Shopping-and-Food.mp3",
    "05-Weather-and-Feelings.mp3",
    "06-Hobbies-Giving.mp3",
    "07-Health-and-Body.mp3",
    "08-House-and-Objects.mp3",
    "09-Work-School.mp3",
    "10-Mixed-Review.mp3",
  ];

  function getStoryAudioFile(sprintIdx) {
    const entry = storyQuizData[sprintIdx];
    if (!entry) return null;
    return STORY_AUDIO_FILES[entry.sprint] || null;
  }

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function setAudioButtonsState(playing, enabled) {
    if (audioPlayBtn) {
      audioPlayBtn.disabled = !enabled;
      audioPlayBtn.textContent = playing ? "⏸ Pause" : "▶ Play";
    }
    if (audioStopBtn) {
      audioStopBtn.disabled = !enabled || !playing;
    }
  }

  function loadAudioForCurrentSprint() {
    if (!audioPlayer) return;
    const filename = getStoryAudioFile(currentSprintIdx);
    if (!filename) {
      if (audioBar) audioBar.style.display = "none";
      return;
    }
    if (audioBar) audioBar.style.display = "";

    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    audioPlayer.src = "assets/" + filename;
    audioPlayer.load();

    if (audioTimeEl) audioTimeEl.textContent = "0:00 / 0:00";
    setAudioButtonsState(false, true);
  }

  function playPauseAudio() {
    if (!audioPlayer || !audioPlayer.src) return;
    if (audioPlayer.paused) {
      const p = audioPlayer.play();
      if (p && typeof p.catch === "function") {
        p.catch((err) => {
          console.warn("Audio play failed:", err);
          setAudioButtonsState(false, true);
        });
      }
    } else {
      audioPlayer.pause();
    }
  }

  function stopAudio() {
    if (!audioPlayer) return;
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    if (audioTimeEl) audioTimeEl.textContent = "0:00 / 0:00";
    setAudioButtonsState(false, true);
  }

  function wireAudioEvents() {
    if (!audioPlayer) return;

    audioPlayer.addEventListener("loadedmetadata", () => {
      if (audioTimeEl) {
        audioTimeEl.textContent = `0:00 / ${formatTime(audioPlayer.duration)}`;
      }
    });

    audioPlayer.addEventListener("play", () => {
      setAudioButtonsState(true, true);
    });

    audioPlayer.addEventListener("pause", () => {
      setAudioButtonsState(false, true);
    });

    audioPlayer.addEventListener("ended", () => {
      setAudioButtonsState(false, true);
      if (audioTimeEl) {
        audioTimeEl.textContent = `${formatTime(audioPlayer.duration)} / ${formatTime(audioPlayer.duration)}`;
      }
    });

    audioPlayer.addEventListener("timeupdate", () => {
      if (audioTimeEl && isFinite(audioPlayer.duration)) {
        audioTimeEl.textContent = `${formatTime(audioPlayer.currentTime)} / ${formatTime(audioPlayer.duration)}`;
      }
    });

    audioPlayer.addEventListener("error", () => {
      console.warn("Story audio failed to load:", audioPlayer.src);
      if (audioTimeEl) audioTimeEl.textContent = "⚠️ Audio unavailable";
      setAudioButtonsState(false, false);
    });

    if (audioPlayBtn) audioPlayBtn.addEventListener("click", playPauseAudio);
    if (audioStopBtn) audioStopBtn.addEventListener("click", stopAudio);
  }

  // ─── Sprint dropdown ─────────────────────────────────────────
  function populateSprintSelect() {
    if (!sprintSelect) return;
    sprintSelect.innerHTML = "";
    storyQuizData.forEach((entry, i) => {
      const sprintMeta = (typeof sprints !== 'undefined' && sprints[entry.sprint]) ? sprints[entry.sprint] : {};
      const label = (sprintMeta.displayName || `Sprint ${entry.sprint + 1}`) + ` (${entry.questions.length} Q)`;
      const opt = document.createElement("option");
      opt.value = String(i);
      opt.textContent = label;
      sprintSelect.appendChild(opt);
    });
    sprintSelect.value = String(currentSprintIdx);
  }

  // ─── Progress counters ───────────────────────────────────────
  function updateCounters() {
    const sprint = currentSprint();
    if (!sprint) return;
    const total = sprint.questions.length;
    const sprintAns = getSprintAnswers(currentSprintIdx);
    const answered = Object.keys(sprintAns).length;
    let correct = 0;
    for (const k in sprintAns) if (sprintAns[k].correct) correct++;

    if (answeredCountEl) answeredCountEl.textContent = String(answered);
    if (totalCountEl) totalCountEl.textContent = String(total);
    if (correctCountEl) correctCountEl.textContent = String(correct);
  }

  // ─── Render a question ───────────────────────────────────────
  function renderQuestion() {
    const sprint = currentSprint();
    const q = currentQuestion();
    if (!sprint || !q) return;

    if (placeholderEl) placeholderEl.style.display = "none";
    if (contentEl) contentEl.style.display = "block";
    if (completionEl) completionEl.style.display = "none";

    const sprintMeta = (typeof sprints !== 'undefined' && sprints[sprint.sprint]) ? sprints[sprint.sprint] : {};
    const sprintName = sprintMeta.displayName || `Sprint ${sprint.sprint + 1}`;

    if (sprintLabelEl) sprintLabelEl.textContent = sprintName;
    if (questionIndexEl) {
      questionIndexEl.textContent = `Q${currentQuestionIdx + 1} / ${sprint.questions.length}`;
    }

    if (questionJpEl) {
      questionJpEl.innerHTML = toRuby(q.questionJp || "");
      questionJpEl.classList.toggle("hide-furigana", furiganaHidden);
    }

    if (compositionNoteEl) {
      if (q.compositionNote) {
        compositionNoteEl.textContent = "🧩 " + q.compositionNote;
        compositionNoteEl.style.display = "";
      } else {
        compositionNoteEl.textContent = "";
        compositionNoteEl.style.display = "none";
      }
    }

    renderOptions(q);

    const sprintAns = getSprintAnswers(currentSprintIdx);
    const prior = sprintAns[currentQuestionIdx];
    if (prior) {
      showFeedback(prior.correct, prior.picked, q, true);
    } else {
      hideFeedback();
    }

    if (prevBtn) prevBtn.disabled = currentQuestionIdx <= 0;
    if (nextBtn) nextBtn.disabled = currentQuestionIdx >= sprint.questions.length - 1;

    updateCounters();
  }

  function renderOptions(q) {
    if (!optionsEl) return;
    optionsEl.innerHTML = "";

    const sprintAns = getSprintAnswers(currentSprintIdx);
    const prior = sprintAns[currentQuestionIdx];
    const letters = ["A", "B", "C", "D", "E"];

    q.optionsJp.forEach((option, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.dataset.idx = String(idx);

      const letter = document.createElement("span");
      letter.className = "opt-letter";
      letter.textContent = letters[idx] || String(idx + 1);

      const textSpan = document.createElement("span");
      textSpan.className = "opt-text";
      textSpan.innerHTML = toRuby(option);
      textSpan.classList.toggle("hide-furigana", furiganaHidden);

      const speakBtnInner = document.createElement("button");
      speakBtnInner.type = "button";
      speakBtnInner.className = "opt-speak";
      speakBtnInner.title = "🔊 Listen to this option";
      speakBtnInner.textContent = "🔊";
      speakBtnInner.dataset.reading = q.optionsReading[idx] || "";

      btn.appendChild(letter);
      btn.appendChild(textSpan);
      btn.appendChild(speakBtnInner);

      speakBtnInner.addEventListener("click", (e) => {
        e.stopPropagation();
        if (speakBtnInner.dataset.reading) speak(speakBtnInner.dataset.reading);
      });

      if (prior) {
        btn.disabled = true;
        if (idx === q.answerIndex) btn.classList.add("is-correct");
        if (idx === prior.picked && !prior.correct) btn.classList.add("is-wrong");
      } else {
        btn.addEventListener("click", () => selectAnswer(idx));
      }

      optionsEl.appendChild(btn);
    });
  }

  // ─── Answer selection ────────────────────────────────────────
  function selectAnswer(pickedIdx) {
    const q = currentQuestion();
    if (!q) return;

    const sprintAns = getSprintAnswers(currentSprintIdx);
    if (sprintAns[currentQuestionIdx]) return;

    const correct = pickedIdx === q.answerIndex;
    sprintAns[currentQuestionIdx] = { picked: pickedIdx, correct };
    saveProgress();

    const buttons = optionsEl.querySelectorAll(".quiz-option");
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      btn.classList.remove("is-selected");
      if (idx === q.answerIndex) btn.classList.add("is-correct");
      if (idx === pickedIdx && !correct) btn.classList.add("is-wrong");
    });

    showFeedback(correct, pickedIdx, q, false);
    updateCounters();

    if (Object.keys(sprintAns).length >= currentSprint().questions.length) {
      setTimeout(showCompletion, 800);
    }
  }

  // ─── Feedback ────────────────────────────────────────────────
  function showFeedback(correct, pickedIdx, q, restore) {
    if (!feedbackEl || !feedbackTextEl) return;

    feedbackEl.style.display = "block";
    feedbackEl.classList.remove("correct", "incorrect");

    let msg = correct ? "✅ Correct!" : "❌ Not quite.";
    feedbackEl.classList.add(correct ? "correct" : "incorrect");

    const correctJp = q.optionsJp[q.answerIndex] || "";
    const correctReading = q.optionsReading[q.answerIndex] || q.optionsReading[0] || "";

    feedbackTextEl.innerHTML = `${escapeHtml(msg)} <button class="feedback-tts-btn" data-reading="${escapeHtml(correctReading)}" title="Listen to the correct answer">🔊 Read answer</button>`;

    const fbBtn = feedbackTextEl.querySelector(".feedback-tts-btn");
    if (fbBtn) {
      fbBtn.addEventListener("click", () => {
        if (fbBtn.dataset.reading) speak(fbBtn.dataset.reading);
      });
    }

    if (!restore) {
      const toSpeak = correct ? correctReading : (q.optionsReading[pickedIdx] || correctReading);
      speak(toSpeak);
    }
  }

  function hideFeedback() {
    if (feedbackEl) feedbackEl.style.display = "none";
    if (feedbackTextEl) feedbackTextEl.innerHTML = "";
  }

  // ─── Completion panel ────────────────────────────────────────
  function showCompletion() {
    const sprint = currentSprint();
    if (!sprint) return;

    const sprintAns = getSprintAnswers(currentSprintIdx);
    const total = sprint.questions.length;
    const answered = Object.keys(sprintAns).length;
    let correct = 0;
    for (const k in sprintAns) if (sprintAns[k].correct) correct++;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    if (completionTextEl) {
      completionTextEl.textContent = `You answered ${answered}/${total} questions with ${correct} correct (${pct}%).`;
    }

    if (contentEl) contentEl.style.display = "none";
    if (completionEl) completionEl.style.display = "block";
  }

  function hideCompletion() {
    if (completionEl) completionEl.style.display = "none";
  }

  // ─── Navigation & Sprint Switching ───────────────────────────
  function goPrev() {
    if (currentQuestionIdx > 0) {
      currentQuestionIdx--;
      renderQuestion();
    }
  }

  function goNext() {
    const sprint = currentSprint();
    if (!sprint) return;
    if (currentQuestionIdx < sprint.questions.length - 1) {
      currentQuestionIdx++;
      renderQuestion();
    }
  }

  function switchSprint(newIdx) {
    if (newIdx < 0 || newIdx >= storyQuizData.length) return;
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }
    currentSprintIdx = newIdx;
    currentQuestionIdx = 0;
    hideCompletion();
    renderQuestion();
    loadAudioForCurrentSprint();
  }

  function resetCurrentSprint() {
    if (!confirm("Reset progress for this sprint? This only affects the quiz, not your sentence mastery.")) return;
    delete answers[currentSprintIdx];
    saveProgress();
    currentQuestionIdx = 0;
    hideCompletion();
    renderQuestion();
  }

  // ─── Toggles & Speed ─────────────────────────────────────────
  function applyFuriganaToggle() {
    if (furiToggleBtn) {
      furiToggleBtn.textContent = furiganaHidden ? "🔤 Furigana On" : "🔤 Furigana Off";
      furiToggleBtn.classList.toggle("active", furiganaHidden);
    }
    renderQuestion();
  }

  function applyTranslationToggle() {
    if (transToggleBtn) {
      transToggleBtn.textContent = translationHidden ? "🌎 Translation On" : "🌎 Translation Off";
      transToggleBtn.classList.toggle("active", translationHidden);
    }
  }

  function setSpeed(rate) {
    speechRate = rate;
    if (speed075Btn) speed075Btn.classList.toggle("speed-btn-active", rate === 0.75);
    if (speed100Btn) speed100Btn.classList.toggle("speed-btn-active", rate === 1.0);
  }

  // ─── Event wiring ────────────────────────────────────────────
  if (sprintSelect) sprintSelect.addEventListener("change", (e) => switchSprint(parseInt(e.target.value, 10)));
  if (furiToggleBtn) furiToggleBtn.addEventListener("click", () => { furiganaHidden = !furiganaHidden; applyFuriganaToggle(); });
  if (transToggleBtn) transToggleBtn.addEventListener("click", () => { translationHidden = !translationHidden; applyTranslationToggle(); });
  if (resetBtn) resetBtn.addEventListener("click", resetCurrentSprint);
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      delete answers[currentSprintIdx];
      saveProgress();
      currentQuestionIdx = 0;
      hideCompletion();
      renderQuestion();
    });
  }

  if (prevBtn) prevBtn.addEventListener("click", goPrev);
  if (nextBtn) nextBtn.addEventListener("click", goNext);

  if (speakBtn) speakBtn.addEventListener("click", () => { const q = currentQuestion(); if (q && q.questionReading) speak(q.questionReading); });
  if (questionSpeakBtn) questionSpeakBtn.addEventListener("click", () => { const q = currentQuestion(); if (q && q.questionReading) speak(q.questionReading); });

  if (speed075Btn) speed075Btn.addEventListener("click", () => setSpeed(0.75));
  if (speed100Btn) speed100Btn.addEventListener("click", () => setSpeed(1.0));

  // ─── Boot ────────────────────────────────────────────────────
  loadProgress();
  populateSprintSelect();
  setSpeed(1.0);

  // Open on the first sprint that has unanswered questions
  let startIdx = 0;
  for (let i = 0; i < storyQuizData.length; i++) {
    const ans = getSprintAnswers(i);
    if (Object.keys(ans).length < storyQuizData[i].questions.length) {
      startIdx = i;
      break;
    }
  }
  currentSprintIdx = startIdx;
  currentQuestionIdx = 0;
  if (sprintSelect) sprintSelect.value = String(currentSprintIdx);

  wireAudioEvents();
  loadAudioForCurrentSprint();
  renderQuestion();

  console.log(
    `📝 Story Quiz module loaded — ${storyQuizData.length} sprints, ${storyQuizData.reduce((n, s) => n + s.questions.length, 0)} questions total.`
  );
})();