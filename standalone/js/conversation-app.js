// ============================================================
// CONVERSATION PRACTICE APP - Main Application
// ============================================================

(function () {
  "use strict";

  // ============================================================
  // STATE
  // ============================================================
  const state = {
    currentSprint: 0,
    currentTopic: 0,
    conversation: [],
    exchangeCount: 0,
    maxExchanges: 8,
    isListening: false,
    isProcessing: false,
    isSessionActive: false,
    apiKey: null,
    useAPI: false,
    fallbackUsed: false,
    sessionStartTime: null,
    currentTopicName: "",
    furiganaVisible: true,
    autoPlayTTS: true,
    showTranslations: true,
    isSpeaking: false,
    isWaitingForUser: false,
    isAISpeaking: false,
    hasSubmitted: false,
    hasExportableContent: false,
    toastTimeout: null,
    isSetupComplete: false,
    isInitialized: false,
    isProcessingCorrections: false,
    // For random start tracking
    _storyStartIndex: 0,
    _lastFallbackIndex: -1,
  };

  // ============================================================
  // DOM REFS
  // ============================================================
  function getElement(id) {
    const el = document.getElementById(id);
    if (!el) console.warn(`⚠️ Element not found: #${id}`);
    return el;
  }

  const $ = (id) => getElement(id);

  // ============================================================
  // ENCRYPTED API KEY STORAGE (Option C)
  // ============================================================
  const ENCRYPT_KEY = 42;

  function encrypt(text) {
    if (!text) return "";
    let result = "";
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ ENCRYPT_KEY);
    }
    return btoa(result);
  }

  function decrypt(encoded) {
    if (!encoded) return null;
    try {
      const decoded = atob(encoded);
      let result = "";
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) ^ ENCRYPT_KEY);
      }
      return result;
    } catch (e) {
      console.warn("Failed to decrypt API key:", e);
      return null;
    }
  }

  // ============================================================
  // SETUP FUNCTIONS
  // ============================================================

  function validateApiKey(key) {
    if (!key || key.trim().length < 10) {
      return {
        valid: false,
        message: "❌ API key is too short. Please check and try again.",
      };
    }
    const trimmed = key.trim();
    if (!trimmed.startsWith("sk-")) {
      return {
        valid: false,
        message:
          '❌ API key should start with "sk-". Please check and try again.',
      };
    }
    if (trimmed.length < 30) {
      return {
        valid: false,
        message:
          "❌ API key appears incomplete. Please copy the full key from DeepSeek.",
      };
    }
    return { valid: true, message: "✅ API key format looks valid!" };
  }

  function hasUserSetup() {
    return localStorage.getItem("conversation_mode") !== null;
  }

  function getUserMode() {
    return localStorage.getItem("conversation_mode") || "offline";
  }

  function getStoredApiKey() {
    const encrypted = localStorage.getItem("deepseek_api_key");
    if (encrypted) {
      return decrypt(encrypted);
    }
    return null;
  }

  function showSetupScreen() {
    const screen = $("setupScreen");
    if (screen) screen.classList.add("active");
  }

  function hideSetupScreen() {
    const screen = $("setupScreen");
    if (screen) screen.classList.remove("active");
  }

  function updateModeIndicator() {
    const indicator = $("modeIndicator");
    if (!indicator) return;
    if (state.useAPI && state.apiKey) {
      indicator.textContent = "🔑 API Mode";
      indicator.className = "mode-indicator api-mode";
    } else {
      indicator.textContent = "📖 Offline Mode";
      indicator.className = "mode-indicator offline-mode";
    }
  }

  function handleSetup() {
    const apiMode = document.getElementById("apiMode");
    const offlineMode = document.getElementById("offlineMode");

    if (apiMode && apiMode.checked) {
      const keyInput = $("setupApiKey");
      if (!keyInput) return;
      const key = keyInput.value.trim();
      const validation = validateApiKey(key);
      const statusEl = $("setupApiStatus");
      if (!validation.valid) {
        if (statusEl) {
          statusEl.textContent = validation.message;
          statusEl.className = "setup-api-status error";
        }
        return;
      }
      const encrypted = encrypt(key);
      localStorage.setItem("conversation_mode", "api");
      localStorage.setItem("deepseek_api_key", encrypted);
      state.apiKey = key;
      state.useAPI = true;
      state.isSetupComplete = true;
    } else {
      localStorage.setItem("conversation_mode", "offline");
      localStorage.removeItem("deepseek_api_key");
      state.apiKey = null;
      state.useAPI = false;
      state.isSetupComplete = true;
    }

    hideSetupScreen();
    updateModeIndicator();
    showToast(
      "✅ Setup complete! Starting conversation practice...",
      "success",
    );
    initApp();
  }

  // ============================================================
  // TOAST
  // ============================================================
  function showToast(message, type = "success") {
    const toast = $("exportToast");
    const toastMessage = $("toastMessage");
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    void toast.offsetWidth;
    toast.classList.add("show");
    if (state.toastTimeout) {
      clearTimeout(state.toastTimeout);
    }
    state.toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  // ============================================================
  // FURIGANA
  // ============================================================
  function renderWithFurigana(text) {
    if (!text) return text;
    let processed = text.replace(
      /([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g,
      (_, kanji, furigana) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>`,
    );
    processed = processed.replace(
      /([\u4e00-\u9faf\u3400-\u4dbf]+)\(([^()]+)\)/g,
      (_, kanji, furigana) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>`,
    );
    return processed;
  }

  function stripFurigana(text) {
    if (!text) return "";
    return text
      .replace(/（[^（）]+）/g, "")
      .replace(/\([^()]+\)/g, "")
      .trim();
  }

  // ============================================================
  // TRANSLATION CACHE
  // ============================================================
  const translationCache = new Map();

  // ============================================================
  // EXACT MATCH TRANSLATION
  // ============================================================
  function findExactTranslation(text) {
    if (!text || typeof sentencesData === "undefined" || !sentencesData) {
      return "";
    }

    const cleanText = stripFurigana(text);

    for (const s of sentencesData) {
      const sentenceClean = stripFurigana(s.jp);
      if (sentenceClean === cleanText) {
        return s.translation || "";
      }
    }

    return "";
  }

  // ============================================================
  // WORD DICT TRANSLATION (Fallback)
  // ============================================================
  function translateWithWordDict(text) {
    if (!text || typeof wordDict === "undefined" || !wordDict) return "";

    const words = text.split(/[、。！？\s]+/).filter((w) => w.length > 1);
    const meanings = [];
    let unknownCount = 0;

    for (const word of words) {
      const cleanWord = word.replace(/[（(][^）)]*[）)]/g, "").trim();
      if (wordDict[cleanWord]) {
        meanings.push(wordDict[cleanWord].meaning);
        continue;
      }
      let found = false;
      for (const [key, value] of Object.entries(wordDict)) {
        if (key.length > 1 && cleanWord.includes(key)) {
          meanings.push(value.meaning);
          found = true;
          break;
        }
      }
      if (!found) {
        unknownCount++;
      }
    }

    if (meanings.length >= 2) {
      return meanings.join(" ");
    }
    if (meanings.length === 1 && unknownCount <= 2) {
      return meanings[0];
    }
    if (meanings.length === 0 && unknownCount <= 3) {
      if (text.includes("か")) {
        for (const [key, value] of Object.entries(wordDict)) {
          if (text.includes(key) && key.length > 1) {
            return `(Question about ${value.meaning})`;
          }
        }
        return "(Question)";
      }
    }
    return "";
  }

  // ============================================================
  // API TRANSLATION
  // ============================================================
  async function translateSingleSentence(text) {
    if (!text || text.trim().length < 2) return "";

    console.log("🔍 Translating sentence:", text);

    try {
      const response = await fetch(
        "https://api.deepseek.com/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.apiKey}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content:
                  "You are a Japanese-to-English translator for JLPT N5 level. Translate the following Japanese sentence to natural, clear English. Keep it simple and appropriate for a beginner learner. Respond with ONLY the translation, nothing else. If it's a question, translate it as a question.",
              },
              { role: "user", content: text },
            ],
            max_tokens: 200,
            temperature: 0.3,
          }),
        },
      );

      const data = await response.json();
      const translation = data.choices?.[0]?.message?.content?.trim();
      console.log("✅ Translation result:", translation);
      if (translation && translation.length > 1) {
        return translation;
      }
    } catch (e) {
      console.warn("Translation API failed for sentence:", text, e);
    }
    return "";
  }

  async function getTranslationWithAPI(text, force = false) {
    const cacheKey = text.trim();

    // Check cache
    if (translationCache.has(cacheKey)) {
      const cached = translationCache.get(cacheKey);
      console.log("📖 Using cached translation for:", text.substring(0, 30));
      return cached;
    }

    // Try exact match
    const exactMatch = findExactTranslation(text);
    if (exactMatch) {
      translationCache.set(cacheKey, exactMatch);
      return exactMatch;
    }

    // Split into sentences
    const sentences = text
      .split(/[。！？]/g)
      .filter((s) => s.trim().length > 1);
    console.log("📝 Splitting into:", sentences.length, "sentences");

    // Use API if available
    if (state.apiKey && state.useAPI) {
      try {
        let fullTranslation = "";

        if (sentences.length > 1) {
          for (const sentence of sentences) {
            const trimmed = sentence.trim();
            if (trimmed.length < 2) continue;
            const sentResult = await translateSingleSentence(trimmed);
            if (sentResult) {
              fullTranslation += sentResult + " ";
            }
          }
          if (fullTranslation.trim()) {
            translationCache.set(cacheKey, fullTranslation.trim());
            return fullTranslation.trim();
          }
        } else {
          const result = await translateSingleSentence(text);
          if (result) {
            translationCache.set(cacheKey, result);
            return result;
          }
        }
      } catch (e) {
        console.warn("Translation API failed:", e);
      }
    }

    // Word-by-word fallback
    const fallback = translateWithWordDict(text);
    if (fallback) {
      translationCache.set(cacheKey, fallback);
      return fallback;
    }

    console.log("⚠️ No translation found for:", text.substring(0, 30));
    return "";
  }

  // ============================================================
  // GRAMMAR CORRECTION
  // ============================================================
  const correctionCache = {};

  function checkLocalRules(text) {
    const cleanText = stripFurigana(text);
    const rules = [];

    // Rule 1: Time expression missing に
    const timeMatch = cleanText.match(/([0-9一二三四五六七八九十時半分]+)/);
    if (timeMatch && !cleanText.includes("に")) {
      rules.push({
        corrected: cleanText.replace(
          /([0-9一二三四五六七八九十時半分]+)/,
          "$1に",
        ),
        issue: "Missing particle に after time expression",
        type: "particle",
      });
    }

    // Rule 2: Object missing を (verb ending)
    const verbPatterns = [
      "食べ",
      "飲み",
      "見",
      "読",
      "書き",
      "買",
      "聞",
      "話",
      "し",
    ];
    for (const pattern of verbPatterns) {
      const verbMatch = cleanText.match(new RegExp(`([^\\s]+)(${pattern})`));
      if (verbMatch && !cleanText.includes("を")) {
        rules.push({
          corrected: cleanText.replace(/([^\s]+)([' + pattern + '])/, "$1を$2"),
          issue: "Missing particle を with verb",
          type: "particle",
        });
        break;
      }
    }

    // Rule 3: Missing です in question (FIXED)
    if (!cleanText.match(/[ですます]$/) && !cleanText.match(/[？。！]$/)) {
      if (
        cleanText.includes("か") &&
        !cleanText.match(/ですか$/) &&
        !cleanText.match(/ますか$/)
      ) {
        const hasVerb = verbPatterns.some((p) => cleanText.includes(p));
        if (!hasVerb) {
          rules.push({
            corrected: cleanText + "ですか",
            issue: "Missing です in question",
            type: "formality",
          });
        }
      }
    }

    return rules.length > 0 ? rules[0] : null;
  }

  async function getCorrectionFromAPI(text) {
    const cleanText = stripFurigana(text);

    if (correctionCache[cleanText]) {
      return correctionCache[cleanText];
    }

    if (!state.apiKey || !state.useAPI) {
      return null;
    }

    try {
      const response = await fetch(
        "https://api.deepseek.com/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.apiKey}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content: `You are a Japanese language teacher for JLPT N5 level students.

Review the following Japanese sentence and check for grammar/vocabulary errors.

Rules:
1. If the sentence is grammatically correct → respond with: {"correct": true}
2. If there is an error → respond with: {"correct": false, "correction": "corrected sentence", "note": "brief explanation in English"}

Response must be valid JSON only.`,
              },
              { role: "user", content: text },
            ],
            max_tokens: 150,
            temperature: 0.3,
          }),
        },
      );

      const data = await response.json();
      const result = data.choices?.[0]?.message?.content?.trim();
      if (result) {
        try {
          const parsed = JSON.parse(result);
          correctionCache[cleanText] = parsed;
          return parsed;
        } catch (e) {
          console.warn("Failed to parse correction response:", e);
          return null;
        }
      }
    } catch (e) {
      console.warn("Correction API failed:", e);
    }
    return null;
  }

  async function getUserCorrection(text) {
    const cleanText = stripFurigana(text);

    if (correctionCache[cleanText]) {
      return correctionCache[cleanText];
    }

    const localResult = checkLocalRules(cleanText);
    if (localResult) {
      const result = {
        status: "corrected",
        original: text,
        corrected: localResult.corrected,
        note: localResult.issue,
        source: "local",
      };
      correctionCache[cleanText] = result;
      return result;
    }

    if (state.apiKey && state.useAPI) {
      const apiResult = await getCorrectionFromAPI(text);
      if (apiResult) {
        if (apiResult.correct) {
          const result = { status: "correct", original: text, source: "api" };
          correctionCache[cleanText] = result;
          return result;
        } else {
          const result = {
            status: "corrected",
            original: text,
            corrected: apiResult.correction || text,
            note: apiResult.note || "Grammar issue detected",
            source: "api",
          };
          correctionCache[cleanText] = result;
          return result;
        }
      }
    }

    const result = { status: "unknown", original: text };
    correctionCache[cleanText] = result;
    return result;
  }

  // ============================================================
  // REFRESH FUNCTIONS
  // ============================================================
  function refreshAllMessages() {
    const messages = document.querySelectorAll(".message-bubble .jp-text");
    messages.forEach((el) => {
      const originalText = el.dataset.originalText || el.textContent;
      if (state.furiganaVisible) {
        el.innerHTML = renderWithFurigana(originalText);
      } else {
        el.textContent = stripFurigana(originalText);
      }
    });
  }

  function refreshTranslations() {
    const translations = document.querySelectorAll(
      ".message-bubble .translation-text",
    );
    translations.forEach((el) => {
      if (state.showTranslations) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    });
  }

  function clearTranslationCache() {
    translationCache.clear();
    console.log("🗑️ Translation cache cleared");
  }

  // ============================================================
  // SPEECH RECOGNITION
  // ============================================================
  let recognition = null;
  let recognitionSupported = false;
  let interimTranscript = "";

  async function checkMicrophonePermission() {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: "microphone",
      });
      if (permissionStatus.state === "denied") {
        showToast(
          "⚠️ Microphone access denied. Please enable in browser settings.",
          "error",
        );
        return false;
      } else if (permissionStatus.state === "prompt") {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          stream.getTracks().forEach((track) => track.stop());
          return true;
        } catch (e) {
          showToast(
            "⚠️ Please allow microphone access to use voice input.",
            "error",
          );
          return false;
        }
      }
      return true;
    } catch (e) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch (err) {
        showToast(
          "⚠️ Could not access microphone. Please check permissions.",
          "error",
        );
        return false;
      }
    }
  }

  function initSpeechRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const statusText = $("statusText");
      if (statusText)
        statusText.textContent =
          "⚠️ Speech recognition not supported in this browser.";
      const speakBtn = $("speakBtn");
      if (speakBtn) speakBtn.disabled = true;
      return false;
    }

    recognition = new SpeechRecognition();
    recognition.lang = "ja-JP";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      state.isListening = true;
      state.isWaitingForUser = true;
      state.hasSubmitted = false;
      interimTranscript = "";
      const speakBtn = $("speakBtn");
      const stopBtn = $("stopBtn");
      const statusText = $("statusText");
      const statusBar = $("statusBar");
      if (speakBtn) {
        speakBtn.textContent = "🔴 Listening...";
        speakBtn.classList.add("listening");
        speakBtn.disabled = true;
      }
      if (stopBtn) stopBtn.disabled = false;
      if (statusText)
        statusText.textContent =
          "🎙️ Listening... Press Stop when finished speaking";
      if (statusBar) statusBar.className = "status-bar listening";
    };

    recognition.onend = () => {
      state.isListening = false;
      const speakBtn = $("speakBtn");
      const stopBtn = $("stopBtn");
      const statusText = $("statusText");
      const statusBar = $("statusBar");
      if (speakBtn) {
        speakBtn.textContent = "🎙️ Speak";
        speakBtn.classList.remove("listening");
        speakBtn.disabled = false;
      }

      if (interimTranscript && state.isWaitingForUser && !state.hasSubmitted) {
        const finalText = interimTranscript.trim();
        if (finalText && finalText.length >= 2) {
          if (statusText)
            statusText.textContent = `📝 You said: "${finalText}"`;
          state.hasSubmitted = true;
          if (stopBtn) stopBtn.disabled = true;
          if (statusBar) statusBar.className = "status-bar";
          handleUserInput(finalText);
        }
        interimTranscript = "";
        state.isWaitingForUser = false;
      } else if (
        !state.isProcessing &&
        !state.isAISpeaking &&
        !state.isWaitingForUser
      ) {
        if (statusText)
          statusText.textContent = '🎤 Ready — Press "Speak" to start';
        if (statusBar) statusBar.className = "status-bar";
      }
    };

    recognition.onresult = (event) => {
      const results = event.results;
      let transcript = "";
      const statusText = $("statusText");
      const stopBtn = $("stopBtn");

      for (let i = event.resultIndex; i < results.length; i++) {
        if (results[i].isFinal) {
          transcript += results[i][0].transcript + " ";
        } else {
          transcript += results[i][0].transcript;
        }
      }

      if (transcript.trim()) {
        interimTranscript = transcript.trim();
        if (statusText)
          statusText.textContent = `📝 You said: "${interimTranscript}" — Press Stop to submit`;
        if (stopBtn) stopBtn.disabled = false;
      }
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      const statusText = $("statusText");
      const speakBtn = $("speakBtn");
      const stopBtn = $("stopBtn");
      const statusBar = $("statusBar");

      if (event.error === "no-speech") {
        if (statusText)
          statusText.textContent =
            '🎤 No speech detected. Press "Speak" to try again, or "Stop" to cancel.';
        state.isWaitingForUser = false;
        state.isListening = false;
        if (speakBtn) {
          speakBtn.textContent = "🎙️ Speak";
          speakBtn.classList.remove("listening");
          speakBtn.disabled = false;
        }
        if (stopBtn) stopBtn.disabled = false;
        if (statusBar) statusBar.className = "status-bar";
        return;
      }

      if (statusText) statusText.textContent = `⚠️ Error: ${event.error}`;
      state.isListening = false;
      state.isWaitingForUser = false;
      if (speakBtn) {
        speakBtn.textContent = "🎙️ Speak";
        speakBtn.classList.remove("listening");
        speakBtn.disabled = false;
      }
      if (stopBtn) stopBtn.disabled = true;
      state.isProcessing = false;
      if (statusBar) statusBar.className = "status-bar";

      if (event.error === "aborted") {
        if (statusText) statusText.textContent = "🎤 Stopped listening.";
        if (stopBtn) stopBtn.disabled = true;
      }
    };

    recognitionSupported = true;
    return true;
  }

  // ============================================================
  // TTS
  // ============================================================
  function speakText(text, lang = "ja-JP", rate = 0.9) {
    if (!text || text.trim() === "") return;
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    const cleanText = stripFurigana(text);
    if (!cleanText) return;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const jpVoice = voices.find((v) => v.lang.startsWith("ja"));
    if (jpVoice) utterance.voice = jpVoice;
    state.isSpeaking = true;
    state.isAISpeaking = true;
    const lastMessage = document.querySelector(
      ".message-ai:last-child .message-bubble",
    );
    if (lastMessage) {
      lastMessage.classList.add("speaking");
    }
    utterance.onend = () => {
      state.isSpeaking = false;
      state.isAISpeaking = false;
      if (lastMessage) {
        lastMessage.classList.remove("speaking");
      }
      if (!state.isProcessing && state.isSessionActive) {
        const statusText = $("statusText");
        const statusBar = $("statusBar");
        if (statusText) statusText.textContent = '🎤 Press "Speak" to respond';
        if (statusBar) statusBar.className = "status-bar";
      }
    };
    utterance.onerror = () => {
      state.isSpeaking = false;
      state.isAISpeaking = false;
      if (lastMessage) {
        lastMessage.classList.remove("speaking");
      }
    };
    window.speechSynthesis.speak(utterance);
  }

  function stopTTS() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    state.isSpeaking = false;
    state.isAISpeaking = false;
    document.querySelectorAll(".message-bubble.speaking").forEach((el) => {
      el.classList.remove("speaking");
    });
  }

  // ============================================================
  // MESSAGE RENDERING
  // ============================================================
  function addSystemMessage(text) {
    const chatMessages = $("chatMessages");
    if (!chatMessages) return;
    const msgDiv = document.createElement("div");
    msgDiv.className = "system-message";
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const chatMessages = $("chatMessages");
    const statusBar = $("statusBar");
    if (!chatMessages) return;
    const indicator = document.createElement("div");
    indicator.className = "typing-indicator active";
    indicator.id = "typingIndicator";
    indicator.innerHTML = '<span class="typing-dots">🤖 AI is thinking</span>';
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (statusBar) statusBar.className = "status-bar thinking";
  }

  function hideTypingIndicator() {
    const indicator = document.getElementById("typingIndicator");
    const statusBar = $("statusBar");
    if (indicator) indicator.remove();
    if (statusBar) statusBar.className = "status-bar";
  }

  // ============================================================
  // ADD MESSAGE - WITH ELEMENT REFERENCE FOR TRANSLATION
  // ============================================================
  function addMessage(speaker, text) {
    const isAI = speaker === "AI";
    const isUser = speaker === "User";
    const className = isAI ? "message-ai" : "message-user";
    const label = isAI ? "🤖 AI" : "👤 You";
    const time = new Date().toLocaleTimeString();
    const chatMessages = $("chatMessages");
    if (!chatMessages) return;

    let translation = "";
    let correction = null;

    if (isAI) {
      const cacheKey = text.trim();

      if (translationCache.has(cacheKey)) {
        translation = translationCache.get(cacheKey);
        console.log("📖 Cached translation:", translation);
      } else {
        translation = findExactTranslation(text);
        if (translation) {
          translationCache.set(cacheKey, translation);
          console.log("📖 Exact match translation:", translation);
        }
      }
    }

    state.conversation.push({ speaker, text, time, translation, correction });

    const cleanText = stripFurigana(text);
    const displayHtml = state.furiganaVisible
      ? renderWithFurigana(text)
      : cleanText;

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${className}`;

    let translationHtml = "";
    let translationSpanId = "";
    if (isAI) {
      translationSpanId = `trans-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const showClass = translation && state.showTranslations ? "" : "hidden";
      translationHtml = `<span id="${translationSpanId}" class="translation-text ${showClass}">${translation ? "📖 " + translation : ""}</span>`;
    }

    messageDiv.innerHTML = `
      <span class="speaker-label">${label}</span>
      <div class="message-bubble ${state.furiganaVisible ? "" : "furigana-off"}">
        <span class="jp-text" data-original-text="${text.replace(/"/g, "&quot;")}">${displayHtml}</span>
        ${isAI ? `<button class="tts-btn" data-text="${cleanText.replace(/"/g, "&quot;")}" title="Listen again">🔊</button>` : ""}
        ${translationHtml}
      </div>
      <span class="timestamp">${time}</span>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 🔧 API translation for AI messages (async)
    if (isAI && !translation && state.apiKey && state.useAPI) {
      console.log("🌐 Calling API for translation...");
      getTranslationWithAPI(text, true).then((apiTranslation) => {
        if (apiTranslation && apiTranslation.length > 2) {
          console.log("🌐 API translation result:", apiTranslation);
          const translationEl = document.getElementById(translationSpanId);
          if (translationEl) {
            translationEl.textContent = `📖 ${apiTranslation}`;
            translationEl.classList.remove("hidden");
          }
          const lastEntry = state.conversation[state.conversation.length - 1];
          if (lastEntry && lastEntry.speaker === "AI") {
            lastEntry.translation = apiTranslation;
          }
        }
      });
    }

    if (isAI && state.autoPlayTTS && cleanText) {
      speakText(cleanText, "ja-JP", 0.9);
    }

    if (isAI) {
      state.exchangeCount++;
      updateExchangeCounter();
      updateProgress();
      if (state.isSessionActive && !state.isProcessing && !state.isAISpeaking) {
        const statusText = $("statusText");
        const statusBar = $("statusBar");
        if (statusText) statusText.textContent = '🎤 Press "Speak" to respond';
        if (statusBar) statusBar.className = "status-bar";
      }
    }

    updateExportButtons();
  }

  // ============================================================
  // EXPORT BUTTONS
  // ============================================================
  function updateExportButtons() {
    const hasContent = state.conversation.length > 0;
    state.hasExportableContent = hasContent;
    const downloadBtn = $("downloadBtn");
    const copyScriptBtn = $("copyScriptBtn");
    if (downloadBtn) {
      downloadBtn.disabled = !hasContent;
      downloadBtn.style.opacity = hasContent ? "1" : "0.4";
      downloadBtn.style.cursor = hasContent ? "pointer" : "not-allowed";
    }
    if (copyScriptBtn) {
      copyScriptBtn.disabled = !hasContent;
      copyScriptBtn.style.opacity = hasContent ? "1" : "0.4";
      copyScriptBtn.style.cursor = hasContent ? "pointer" : "not-allowed";
    }
  }

  function updateExchangeCounter() {
    const exchangeCounter = $("exchangeCounter");
    if (exchangeCounter) {
      exchangeCounter.textContent = `${state.exchangeCount} / ${state.maxExchanges} exchanges`;
    }
  }

  function updateProgress() {
    const pct = Math.min((state.exchangeCount / state.maxExchanges) * 100, 100);
    const progressBar = $("progressBar");
    const progressText = $("progressText");
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (progressText) progressText.textContent = `${Math.round(pct)}% complete`;
  }

  // ============================================================
  // TOPIC GENERATORS
  // ============================================================
  function getSprintName(sprintIndex) {
    if (typeof sprints === "undefined" || !sprints) {
      return `Sprint ${sprintIndex + 1}`;
    }
    const sprint = sprints[sprintIndex];
    return sprint ? sprint.displayName : `Sprint ${sprintIndex + 1}`;
  }

  function getTopicsForSprint(sprintIndex) {
    const sprintName = getSprintName(sprintIndex);
    const topics = [sprintName];
    const sprintNum = sprintIndex + 1;
    switch (sprintNum) {
      case 1:
        topics.push(
          "Morning Routine",
          "Work Schedule",
          "Weekend Plans",
          "Evening Activities",
        );
        break;
      case 2:
        topics.push(
          "Introducing Family",
          "Talking About Friends",
          "Describing People",
          "Family Activities",
        );
        break;
      case 3:
        topics.push(
          "Getting Around Town",
          "Asking for Directions",
          "Using Public Transport",
          "Places in the City",
        );
        break;
      case 4:
        topics.push(
          "Buying Things",
          "Ordering at a Restaurant",
          "Talking About Food",
          "Prices and Quantities",
        );
        break;
      case 5:
        topics.push(
          "Weather Conditions",
          "How You Feel",
          "Seasonal Activities",
          "Describing Days",
        );
        break;
      case 6:
        topics.push(
          "Talking About Hobbies",
          "Giving and Receiving",
          "Free Time Activities",
          "Learning New Things",
        );
        break;
      case 7:
        topics.push(
          "Health Issues",
          "Visiting the Doctor",
          "Body Parts",
          "Staying Healthy",
        );
        break;
      case 8:
        topics.push(
          "Rooms in the House",
          "Daily Chores",
          "Objects Around the House",
          "Home Activities",
        );
        break;
      case 9:
        topics.push(
          "Weekend Plans",
          "Talking About Experiences",
          "Future Goals",
          "Reflecting on Learning",
        );
        break;
      default:
        topics.push("General Conversation");
    }
    return topics;
  }

  function getGrammarForSprint(sprintIndex) {
    if (typeof sentencesData === "undefined" || !sentencesData)
      return "N5 grammar patterns";
    const { start, end } = sprints[sprintIndex];
    const sentences = sentencesData.slice(start, end + 1);
    const grammarSet = new Set();
    sentences.forEach((s) => {
      if (s.grammarHint) {
        const hint = s.grammarHint.replace(/[📘🎯]/g, "").trim();
        if (hint) grammarSet.add(hint);
      }
    });
    return (
      Array.from(grammarSet).slice(0, 5).join(" • ") || "N5 grammar patterns"
    );
  }

  function getVocabForSprint(sprintIndex) {
    if (
      typeof sentencesData === "undefined" ||
      !sentencesData ||
      typeof wordDict === "undefined"
    ) {
      return "N5 vocabulary";
    }
    const { start, end } = sprints[sprintIndex];
    const sentences = sentencesData.slice(start, end + 1);
    const vocabSet = new Set();
    sentences.forEach((s) => {
      const words = s.jp.split(/\s+/);
      words.forEach((word) => {
        const clean = word.replace(/[（(][^）)]*[）)]/g, "").trim();
        if (clean.length > 1 && wordDict[clean]) {
          vocabSet.add(clean);
        }
      });
    });
    return Array.from(vocabSet).slice(0, 10).join(" • ") || "N5 vocabulary";
  }

  // ============================================================
  // CONVERSATION LOGIC
  // ============================================================
  function startConversation() {
    // Reset random tracking
    state._storyStartIndex = 0;
    state._lastFallbackIndex = -1;

    clearTranslationCache();

    state.conversation = [];
    state.exchangeCount = 0;
    state.isSessionActive = true;
    state.sessionStartTime = new Date();
    state.fallbackUsed = false;
    state.isWaitingForUser = false;
    state.isAISpeaking = false;
    state.hasSubmitted = false;
    interimTranscript = "";

    const chatMessages = $("chatMessages");
    if (chatMessages) chatMessages.innerHTML = "";
    updateExchangeCounter();
    updateProgress();
    updateExportButtons();

    const topics = getTopicsForSprint(state.currentSprint);
    state.currentTopicName =
      topics[state.currentTopic] || "General Conversation";

    addSystemMessage(`💬 Starting conversation: ${state.currentTopicName}`);
    addSystemMessage(`🎯 Focus: ${getGrammarForSprint(state.currentSprint)}`);

    getAIResponse(null);
  }

  function getAIResponse(userInput) {
    if (state.exchangeCount >= state.maxExchanges) {
      endConversation();
      return;
    }

    showTypingIndicator();
    state.isProcessing = true;

    if (state.apiKey && state.useAPI) {
      callDeepSeekAPI(userInput)
        .then((response) => {
          hideTypingIndicator();
          if (response) {
            state.fallbackUsed = false;
            addMessage("AI", response);
            state.isProcessing = false;
            if (state.exchangeCount >= state.maxExchanges) {
              endConversation();
            }
          } else {
            hideTypingIndicator();
            useFallbackResponse(userInput);
          }
        })
        .catch((error) => {
          console.warn("API error:", error);
          hideTypingIndicator();
          useFallbackResponse(userInput);
        });
    } else {
      hideTypingIndicator();
      useFallbackResponse(userInput);
    }
  }

  // ============================================================
  // FALLBACK RESPONSE - WITH RANDOM START (Option A)
  // ============================================================
  function useFallbackResponse(userInput) {
    state.fallbackUsed = true;
    if (typeof sprintStories === "undefined" || !sprintStories) {
      addSystemMessage("⚠️ No story found for this sprint.");
      state.isProcessing = false;
      if (state.exchangeCount >= state.maxExchanges) {
        endConversation();
      }
      return;
    }

    const story = sprintStories[state.currentSprint];
    if (story) {
      const sentences = story.storyJp
        .split(/[。！？]/g)
        .filter((s) => s.trim().length > 0)
        .map((s) => s.trim() + "。");

      if (sentences.length > 0) {
        let safeIndex;

        // Option A: Sequential with Random Start
        if (state.exchangeCount === 0) {
          // First exchange: pick a random start position
          const maxStart = Math.max(0, sentences.length - state.maxExchanges);
          safeIndex = Math.floor(Math.random() * (maxStart + 1));
          state._storyStartIndex = safeIndex;
          console.log(
            `🎲 [FALLBACK] Starting story at sentence ${safeIndex + 1} of ${sentences.length}`,
          );
        } else {
          // Continue from where we left off
          const startIndex = state._storyStartIndex || 0;
          safeIndex = (startIndex + state.exchangeCount - 1) % sentences.length;
        }

        const response = sentences[safeIndex];
        addMessage("AI", response);
      } else {
        addSystemMessage("⚠️ No more responses available.");
      }
    } else {
      addSystemMessage("⚠️ No story found for this sprint.");
    }

    state.isProcessing = false;
    if (state.exchangeCount >= state.maxExchanges) {
      endConversation();
    }
  }

  function endConversation() {
    state.isSessionActive = false;
    state.isProcessing = false;
    state.isWaitingForUser = false;
    state.isAISpeaking = false;
    state.hasSubmitted = false;
    addSystemMessage("✅ Conversation complete! Well done! 🎉");
    const statusText = $("statusText");
    const speakBtn = $("speakBtn");
    const stopBtn = $("stopBtn");
    const statusBar = $("statusBar");
    if (statusText)
      statusText.textContent =
        "🎉 Session complete — Copy or download your script below.";
    if (speakBtn) speakBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = true;
    if (statusBar) statusBar.className = "status-bar";
    updateExportButtons();
    showToast("🎉 Conversation complete! Export your script below.", "success");
  }

  // ============================================================
  // END SESSION EARLY
  // ============================================================
  function endSessionEarly() {
    if (!state.isSessionActive && state.exchangeCount === 0) {
      showToast("⚠️ No active session to end.", "error");
      return;
    }

    if (state.exchangeCount > 0) {
      if (
        !confirm(
          `End this session early? (${state.exchangeCount} exchanges completed)\n\nYour progress will be saved and you can export the transcript.`,
        )
      ) {
        return;
      }
    }

    if (recognition && state.isListening) {
      try {
        recognition.stop();
      } catch (e) {}
    }
    stopTTS();
    state.isListening = false;
    state.isProcessing = false;

    state.isSessionActive = false;
    state.hasSubmitted = false;

    const statusText = $("statusText");
    const speakBtn = $("speakBtn");
    const stopBtn = $("stopBtn");
    const statusBar = $("statusBar");

    if (statusText) {
      if (state.conversation.length > 0) {
        statusText.textContent = `⏹️ Session ended early (${state.exchangeCount} exchanges). Copy or download your script below.`;
      } else {
        statusText.textContent =
          '⏹️ Session ended. Press "Speak" to start a new conversation.';
      }
    }

    if (speakBtn) {
      speakBtn.textContent = "🎙️ Speak";
      speakBtn.classList.remove("listening");
      speakBtn.disabled = false;
    }

    if (stopBtn) stopBtn.disabled = true;
    if (statusBar) statusBar.className = "status-bar";

    updateExportButtons();

    if (state.conversation.length > 0) {
      addSystemMessage(
        `⏹️ Session ended early (${state.exchangeCount}/${state.maxExchanges} exchanges completed).`,
      );
      addSystemMessage("💡 You can copy or download your script below.");
    } else {
      addSystemMessage("⏹️ Session ended with no exchanges.");
    }

    showToast(`⏹️ Session ended (${state.exchangeCount} exchanges)`, "info");
  }

  // ============================================================
  // DEEPSEEK API - WITH RANDOM OPENING QUESTIONS
  // ============================================================
  async function callDeepSeekAPI(userInput) {
    if (!state.apiKey) {
      console.warn("No API key available");
      return null;
    }

    const sprintName = getSprintName(state.currentSprint);
    const grammarFocus = getGrammarForSprint(state.currentSprint);
    const vocabFocus = getVocabForSprint(state.currentSprint);
    const topicName = state.currentTopicName;
    const sprintIndex = state.currentSprint;

    let historyText = "";
    const recentExchanges = state.conversation.slice(-6);
    for (const ex of recentExchanges) {
      const prefix = ex.speaker === "AI" ? "AI" : "User";
      historyText += `${prefix}: ${stripFurigana(ex.text)}\n`;
    }

    // 🆕 Generate a random opening question based on the sprint
    function getRandomOpening(sprintIdx) {
      const openings = {
        0: [
          // Daily Routine & Time
          "こんにちは！朝は何時に起きますか？",
          "おはようございます！毎日何時に起きていますか？",
          "こんにちは！朝ごはんは何を食べますか？",
          "おはようございます！今日は何時に起きましたか？",
          "こんにちは！毎日何時に寝ますか？",
          "おはようございます！週末は何時に起きますか？",
          "こんにちは！朝起きて最初に何をしますか？",
          "おはようございます！今朝は何時に起きましたか？",
        ],
        1: [
          // Family & People
          "こんにちは！家族は何人ですか？",
          "おはようございます！兄弟はいますか？",
          "こんにちは！お父さんは何をしていますか？",
          "おはようございます！お母さんは何をしていますか？",
          "こんにちは！友達は多いですか？",
          "おはようございます！誰と住んでいますか？",
          "こんにちは！一番好きな家族は誰ですか？",
        ],
        2: [
          // Location & Transport
          "こんにちは！駅は近いですか？",
          "おはようございます！毎日何で学校や会社へ行きますか？",
          "こんにちは！町には何がありますか？",
          "おはようございます！バスに乗りますか？",
          "こんにちは！道に迷った時はどうしますか？",
          "おはようございます！自転車を持っていますか？",
        ],
        3: [
          // Shopping & Food
          "こんにちは！何が一番好きな食べ物ですか？",
          "おはようございます！よく買い物に行きますか？",
          "こんにちは！昨日何を食べましたか？",
          "おはようございます！何が一番美味しいですか？",
          "こんにちは！スーパーで何を買いますか？",
          "おはようございます！外食は好きですか？",
        ],
        4: [
          // Weather & Feelings
          "こんにちは！今日の天気はどうですか？",
          "おはようございます！好きな季節はいつですか？",
          "こんにちは！今の気分はどうですか？",
          "おはようございます！昨日はどんな天気でしたか？",
          "こんにちは！雨の日は何をしますか？",
          "おはようございます！今日は元気ですか？",
        ],
        5: [
          // Hobbies & Giving
          "こんにちは！趣味は何ですか？",
          "おはようございます！何が一番楽しいですか？",
          "こんにちは！週末は何をしますか？",
          "おはようございます！友達と何をしますか？",
          "こんにちは！誰かに何かをあげましたか？",
          "おはようございます！何か新しいことを学びましたか？",
        ],
        6: [
          // Health & Body
          "こんにちは！体調はどうですか？",
          "おはようございます！よく運動しますか？",
          "こんにちは！何か痛いところはありますか？",
          "おはようございます！健康のために何をしていますか？",
          "こんにちは！よく寝ていますか？",
          "おはようございます！病院に行きましたか？",
        ],
        7: [
          // House & Objects
          "こんにちは！家には何がありますか？",
          "おはようございます！どの部屋が一番好きですか？",
          "こんにちは！毎日家事をしますか？",
          "おはようございます！冷蔵庫に何がありますか？",
          "こんにちは！掃除は好きですか？",
          "おはようございます！自分の部屋はありますか？",
        ],
        8: [
          // Work & School
          "こんにちは！仕事は何ですか？",
          "おはようございます！学校はどうですか？",
          "こんにちは！毎日何時に仕事が終わりますか？",
          "おはようございます！勉強は楽しいですか？",
          "こんにちは！誰に質問がありますか？",
          "おはようございます！宿題はありますか？",
        ],
        9: [
          // Mixed Review
          "こんにちは！最近どうですか？",
          "おはようございます！何か計画はありますか？",
          "こんにちは！日本に行ったことがありますか？",
          "おはようございます！将来の夢は何ですか？",
          "こんにちは！一番の思い出は何ですか？",
          "おはようございます！挑戦したいことはありますか？",
        ],
      };

      const sprintOpenings = openings[sprintIdx] || openings[0];
      return sprintOpenings[Math.floor(Math.random() * sprintOpenings.length)];
    }

    const randomOpening = getRandomOpening(sprintIndex);

    // Determine if this is the first exchange (no user input yet)
    const isFirstExchange = !userInput || state.exchangeCount === 0;

    const systemPrompt = `You are a Japanese conversation teacher for JLPT N5 level students.

**STRICT RULES:**
1. Use ONLY N5-level vocabulary and grammar
2. Keep sentences short (max 10 words)
3. Use basic particles: は, が, を, に, で, へ, と, から, まで
4. Use basic verb forms: 〜ます, 〜ました, 〜ましょう, 〜たい, 〜てください
5. Use basic adjectives: い-adjectives and な-adjectives

**CONTEXT:**
- Sprint: ${sprintName}
- Topic: ${topicName}
- Grammar focus: ${grammarFocus}
- Vocabulary: ${vocabFocus}

**CONVERSATION STYLE:**
- ${isFirstExchange ? `Start with this exact question: "${randomOpening}"` : `Respond naturally to what the user said`}
- If the user makes a mistake, gently correct them
- Keep the conversation flowing for ${state.maxExchanges} exchanges
- Be encouraging and supportive
- End each response with a follow-up question

**IMPORTANT:**
- Write ALL Japanese with furigana in parentheses: 毎朝（まいあさ）
- Always include furigana for ALL kanji
- Keep responses to 1-2 sentences

${isFirstExchange ? `Start the conversation with this exact question: "${randomOpening}"` : `User said: "${userInput}"`}

Generate your response:`;

    try {
      const response = await fetch(
        "https://api.deepseek.com/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.apiKey}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: isFirstExchange ? randomOpening : userInput },
            ],
            max_tokens: 150,
            temperature: 0.7,
            top_p: 0.9,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", errorData);
        return null;
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content?.trim();

      // Track usage
      if (data.usage) {
        trackCost(data.usage.prompt_tokens, data.usage.completion_tokens);
      }

      return aiResponse || null;
    } catch (error) {
      console.error("API call failed:", error);
      return null;
    }
  }

  // ============================================================
  // USER INPUT HANDLING
  // ============================================================
  function handleUserInput(text) {
    if (!text || text.trim() === "") {
      const statusText = $("statusText");
      if (statusText)
        statusText.textContent = "⚠️ Could not hear you. Please try again.";
      return;
    }

    const cleanText = text.trim();

    if (cleanText.length < 2) {
      console.log("⚠️ Input too short, ignoring:", cleanText);
      const statusText = $("statusText");
      if (statusText)
        statusText.textContent = "⚠️ Input too short. Please speak clearly.";
      return;
    }

    if (!state.isSessionActive) {
      startConversation();
      setTimeout(() => {
        addMessage("User", cleanText);
        getAIResponse(cleanText);
      }, 300);
      return;
    }

    if (state.exchangeCount >= state.maxExchanges) {
      addSystemMessage("⚠️ Session is complete. Please start a new session.");
      return;
    }

    addMessage("User", cleanText);
    getAIResponse(cleanText);
  }

  // ============================================================
  // SCRIPT EXPORT
  // ============================================================
  async function generateScriptWithCorrections() {
    if (state.conversation.length === 0) {
      return "No conversation to export.";
    }

    const sprintName = getSprintName(state.currentSprint);
    const date = new Date().toLocaleString();
    let script = `📝 N5 Conversation Practice Transcript\n`;
    script += `${"═".repeat(50)}\n`;
    script += `📅 Date: ${date}\n`;
    script += `📚 Sprint: ${sprintName}\n`;
    script += `📖 Topic: ${state.currentTopicName}\n`;
    script += `🔄 Exchanges: ${state.exchangeCount}\n`;
    script += `${"═".repeat(50)}\n\n`;

    let correctionsCount = 0;

    for (const exchange of state.conversation) {
      const label = exchange.speaker === "AI" ? "🤖 AI" : "👤 You";
      script += `${label}: ${exchange.text}\n`;

      let translation = exchange.translation;
      if (!translation) {
        translation = findExactTranslation(exchange.text);
        if (!translation && state.apiKey && state.useAPI) {
          translation = await getTranslationWithAPI(exchange.text, true);
        }
        exchange.translation = translation;
      }
      if (translation) {
        script += `   📖 ${translation}\n`;
      }

      if (exchange.speaker === "User") {
        let correction = exchange.correction;
        if (!correction) {
          correction = await getUserCorrection(exchange.text);
          exchange.correction = correction;
        }

        if (correction.status === "correct") {
          script += `   ✅ Correct!\n`;
        } else if (correction.status === "corrected") {
          script += `   💡 Suggestion: ${correction.corrected}\n`;
          if (correction.note) {
            script += `   📝 ${correction.note}\n`;
          }
          correctionsCount++;
        }
      }
    }

    if (correctionsCount > 0) {
      script += `\n${"─".repeat(30)}\n`;
      script += `⚠️ Note: ${correctionsCount} correction(s) suggested above.\n`;
    }

    script += `\n${"═".repeat(50)}\n`;
    script += `🎯 Keep practicing! がんばってください！\n`;
    return script;
  }

  async function copyScript() {
    showToast("⏳ Generating script...", "info");
    try {
      const script = await generateScriptWithCorrections();
      if (!script || script === "No conversation to export.") {
        showToast("⚠️ Nothing to copy — start a conversation first!", "error");
        return;
      }
      await navigator.clipboard.writeText(script);
      showToast("✅ Script copied to clipboard!", "success");
    } catch (e) {
      const script = await generateScriptWithCorrections();
      const textarea = document.createElement("textarea");
      textarea.value = script;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      showToast("✅ Script copied to clipboard!", "success");
    }
  }

  async function downloadScript() {
    showToast("⏳ Generating script...", "info");
    try {
      const script = await generateScriptWithCorrections();
      if (!script || script === "No conversation to export.") {
        showToast(
          "⚠️ Nothing to download — start a conversation first!",
          "error",
        );
        return;
      }
      const blob = new Blob([script], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const sprintName = getSprintName(state.currentSprint);
      a.download = `conversation-${sprintName}-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("✅ Script downloaded successfully!", "success");
    } catch (e) {
      console.error("Download error:", e);
      showToast("❌ Failed to download script", "error");
    }
  }

  // ============================================================
  // API KEY MANAGEMENT - ENCRYPTED (Option C)
  // ============================================================
  function loadApiKey() {
    try {
      const encrypted = localStorage.getItem("deepseek_api_key");
      if (encrypted) {
        const decrypted = decrypt(encrypted);
        if (decrypted) {
          state.apiKey = decrypted;
          state.useAPI = true;
          const apiKeyInput = $("apiKeyInput");
          const settingsApiKey = $("settingsApiKey");
          if (apiKeyInput) apiKeyInput.value = "••••••••••••••••";
          if (settingsApiKey) settingsApiKey.value = "••••••••••••••••";
          updateApiStatus("✅ API key loaded", "success");
          return true;
        }
      }
    } catch (e) {
      console.warn("Failed to load API key:", e);
    }
    state.apiKey = null;
    state.useAPI = false;
    updateApiStatus("💡 No API key set — using fallback scripts", "info");
    return false;
  }

  function saveApiKey(key) {
    const validation = validateApiKey(key);
    if (!validation.valid) {
      updateSettingsApiStatus(validation.message, "error");
      showToast("❌ Invalid API key", "error");
      return false;
    }
    try {
      const encrypted = encrypt(key.trim());
      localStorage.setItem("deepseek_api_key", encrypted);
      localStorage.setItem("conversation_mode", "api");
      state.apiKey = key.trim();
      state.useAPI = true;
      const apiKeyInput = $("apiKeyInput");
      const settingsApiKey = $("settingsApiKey");
      if (apiKeyInput) apiKeyInput.value = "••••••••••••••••";
      if (settingsApiKey) settingsApiKey.value = "••••••••••••••••";
      updateSettingsApiStatus("✅ API key saved successfully!", "success");
      updateApiStatus("✅ API key saved successfully!", "success");
      updateModeIndicator();
      showToast("✅ API key saved successfully!", "success");
      return true;
    } catch (e) {
      console.error("Failed to save API key:", e);
      updateSettingsApiStatus("❌ Failed to save API key", "error");
      showToast("❌ Failed to save API key", "error");
      return false;
    }
  }

  function clearApiKey() {
    try {
      localStorage.removeItem("deepseek_api_key");
      localStorage.setItem("conversation_mode", "offline");
      state.apiKey = null;
      state.useAPI = false;
      const apiKeyInput = $("apiKeyInput");
      const settingsApiKey = $("settingsApiKey");
      if (apiKeyInput) apiKeyInput.value = "";
      if (settingsApiKey) settingsApiKey.value = "";
      updateSettingsApiStatus(
        "🗑️ API key cleared. Using fallback scripts.",
        "info",
      );
      updateApiStatus("🗑️ API key cleared. Using fallback scripts.", "info");
      updateModeIndicator();
      showToast("🗑️ API key cleared", "info");
      return true;
    } catch (e) {
      console.error("Failed to clear API key:", e);
      return false;
    }
  }

  function updateApiStatus(message, type) {
    const apiStatus = $("apiStatus");
    if (apiStatus) {
      apiStatus.textContent = message;
      apiStatus.className = "api-status " + (type || "");
    }
  }

  function updateSettingsApiStatus(message, type) {
    const settingsApiStatus = $("settingsApiStatus");
    if (settingsApiStatus) {
      settingsApiStatus.textContent = message;
      settingsApiStatus.className = "api-status " + (type || "");
    }
  }

  // ============================================================
  // UI CONTROLS
  // ============================================================
  function populateSprints() {
    const sprintSelect = $("sprintSelect");
    if (!sprintSelect) {
      console.warn("Sprint select not found");
      return;
    }
    sprintSelect.innerHTML = "";
    if (typeof sprints === "undefined" || !sprints) {
      console.warn("Sprints data not loaded");
      return;
    }
    sprints.forEach((sprint, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = `${index + 1}: ${sprint.displayName}`;
      sprintSelect.appendChild(option);
    });
    sprintSelect.value = state.currentSprint;
  }

  function populateTopics() {
    const topicSelect = $("topicSelect");
    if (!topicSelect) return;
    topicSelect.innerHTML = "";
    const topics = getTopicsForSprint(state.currentSprint);
    topics.forEach((topic, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = topic;
      topicSelect.appendChild(option);
    });
    topicSelect.value = state.currentTopic;
    updateHints();
  }

  function updateHints() {
    const grammarHint = $("grammarHint");
    const vocabHint = $("vocabHint");
    if (grammarHint)
      grammarHint.textContent = getGrammarForSprint(state.currentSprint);
    if (vocabHint)
      vocabHint.textContent = getVocabForSprint(state.currentSprint);
  }

  // ============================================================
  // SETUP UI EVENT LISTENERS
  // ============================================================
  function setupSetupListeners() {
    const setupOptions = document.querySelectorAll(".setup-option");
    setupOptions.forEach((option) => {
      option.addEventListener("click", function () {
        setupOptions.forEach((o) => o.classList.remove("selected"));
        this.classList.add("selected");
        const radio = this.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        const apiKeyContainer = document.getElementById("apiKeyInputContainer");
        if (radio && radio.id === "apiMode") {
          if (apiKeyContainer) apiKeyContainer.classList.add("active");
        } else {
          if (apiKeyContainer) apiKeyContainer.classList.remove("active");
        }
      });
    });

    const setupSaveKey = $("setupSaveKey");
    if (setupSaveKey) {
      setupSaveKey.addEventListener("click", function () {
        const setupApiKey = $("setupApiKey");
        if (!setupApiKey) return;
        const key = setupApiKey.value.trim();
        const validation = validateApiKey(key);
        const statusEl = $("setupApiStatus");
        if (validation.valid) {
          if (statusEl) {
            statusEl.textContent = validation.message;
            statusEl.className = "setup-api-status success";
          }
          localStorage.setItem("temp_api_key", key);
        } else {
          if (statusEl) {
            statusEl.textContent = validation.message;
            statusEl.className = "setup-api-status error";
          }
        }
      });
    }

    const setupStartBtn = $("setupStartBtn");
    if (setupStartBtn) {
      setupStartBtn.addEventListener("click", handleSetup);
    }

    const setupApiKey = $("setupApiKey");
    if (setupApiKey) {
      setupApiKey.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          const startBtn = $("setupStartBtn");
          if (startBtn) startBtn.click();
        }
      });
    }
  }

  // ============================================================
  // EVENT LISTENERS
  // ============================================================
  function setupEventListeners() {
    const sprintSelect = $("sprintSelect");
    if (sprintSelect) {
      sprintSelect.addEventListener("change", function () {
        console.log("📋 Sprint changed to:", this.value);
        state.currentSprint = parseInt(this.value);
        state.currentTopic = 0;
        populateTopics();
        state.isSessionActive = false;
        state.isWaitingForUser = false;
        state.isAISpeaking = false;
        state.hasSubmitted = false;
        const chatMessages = $("chatMessages");
        if (chatMessages) chatMessages.innerHTML = "";
        state.conversation = [];
        updateExportButtons();
        addSystemMessage(
          '💡 Select a topic and press "Speak" to start a new conversation!',
        );
        const exchangeCounter = $("exchangeCounter");
        if (exchangeCounter) exchangeCounter.textContent = "0 / 8 exchanges";
        const progressBar = $("progressBar");
        const progressText = $("progressText");
        if (progressBar) progressBar.style.width = "0%";
        if (progressText) progressText.textContent = "0% complete";
        const speakBtn = $("speakBtn");
        const stopBtn = $("stopBtn");
        const statusText = $("statusText");
        const statusBar = $("statusBar");
        if (speakBtn) speakBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
        if (statusText)
          statusText.textContent = '🎤 Ready — Press "Speak" to start';
        if (statusBar) statusBar.className = "status-bar";
      });
    }

    const topicSelect = $("topicSelect");
    if (topicSelect) {
      topicSelect.addEventListener("change", function () {
        console.log("📋 Topic changed to:", this.value);
        state.currentTopic = parseInt(this.value);
        state.currentTopicName =
          getTopicsForSprint(state.currentSprint)[state.currentTopic] ||
          "General Conversation";
        state.isSessionActive = false;
        state.isWaitingForUser = false;
        state.isAISpeaking = false;
        state.hasSubmitted = false;
        const chatMessages = $("chatMessages");
        if (chatMessages) chatMessages.innerHTML = "";
        state.conversation = [];
        updateExportButtons();
        addSystemMessage(
          `💡 Topic: ${state.currentTopicName} — Press "Speak" to start!`,
        );
        const exchangeCounter = $("exchangeCounter");
        if (exchangeCounter) exchangeCounter.textContent = "0 / 8 exchanges";
        const progressBar = $("progressBar");
        const progressText = $("progressText");
        if (progressBar) progressBar.style.width = "0%";
        if (progressText) progressText.textContent = "0% complete";
        const speakBtn = $("speakBtn");
        const stopBtn = $("stopBtn");
        const statusText = $("statusText");
        const statusBar = $("statusBar");
        if (speakBtn) speakBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
        if (statusText)
          statusText.textContent = '🎤 Ready — Press "Speak" to start';
        if (statusBar) statusBar.className = "status-bar";
        updateHints();
      });
    }

    const speakBtn = $("speakBtn");
    if (speakBtn) {
      speakBtn.addEventListener("click", async function () {
        console.log("🔘 Speak button clicked");
        console.log("  state.isListening:", state.isListening);
        console.log("  state.isSessionActive:", state.isSessionActive);
        console.log("  state.isAISpeaking:", state.isAISpeaking);
        console.log("  recognition:", !!recognition);

        if (state.isListening) {
          console.log("  ⚠️ Already listening, ignoring click");
          return;
        }

        if (state.isAISpeaking) {
          console.log("  ⚠️ AI is speaking, please wait");
          const statusText = $("statusText");
          if (statusText)
            statusText.textContent = "⏳ AI is speaking... Please wait";
          return;
        }

        const hasPermission = await checkMicrophonePermission();
        if (!hasPermission) {
          console.warn("  ❌ Microphone permission denied");
          return;
        }

        if (!state.isSessionActive) {
          console.log("  🚀 Starting new conversation...");
          startConversation();
          const statusText = $("statusText");
          if (statusText)
            statusText.textContent =
              '🤖 AI is speaking... Press "Speak" when ready to respond';
          return;
        }

        if (state.exchangeCount >= state.maxExchanges) {
          addSystemMessage(
            "⚠️ Session is complete. Please start a new session.",
          );
          return;
        }

        if (recognition) {
          try {
            console.log("  🎤 Starting speech recognition...");
            state.isWaitingForUser = true;
            state.hasSubmitted = false;
            const stopBtn = $("stopBtn");
            const statusBar = $("statusBar");
            if (stopBtn) stopBtn.disabled = false;
            if (statusBar) statusBar.className = "status-bar listening";
            recognition.start();
          } catch (e) {
            console.warn("Recognition start error:", e);
            const statusText = $("statusText");
            const statusBar = $("statusBar");
            if (statusText) statusText.textContent = "⚠️ Please try again";
            if (statusBar) statusBar.className = "status-bar";
          }
        } else {
          console.warn("  ❌ Recognition not initialized");
          const statusText = $("statusText");
          if (statusText)
            statusText.textContent =
              "⚠️ Speech recognition not ready. Please refresh.";
        }
      });
    }

    const stopBtn = $("stopBtn");
    if (stopBtn) {
      stopBtn.addEventListener("click", function () {
        console.log("⏹️ Stop button clicked");

        if (recognition && state.isListening) {
          try {
            recognition.stop();
          } catch (e) {
            console.warn("Recognition stop error:", e);
          }
        }

        const statusText = $("statusText");
        const speakBtn = $("speakBtn");
        const statusBar = $("statusBar");

        if (interimTranscript && state.isWaitingForUser) {
          const finalText = interimTranscript.trim();
          if (finalText && finalText.length >= 2) {
            if (statusText)
              statusText.textContent = `📝 You said: "${finalText}"`;
            state.hasSubmitted = true;
            if (stopBtn) stopBtn.disabled = true;
            if (statusBar) statusBar.className = "status-bar";
            handleUserInput(finalText);
          } else {
            if (statusText)
              statusText.textContent =
                '🎤 No valid speech detected. Press "Speak" to try again.';
            state.isWaitingForUser = false;
            if (stopBtn) stopBtn.disabled = true;
            if (statusBar) statusBar.className = "status-bar";
          }
          interimTranscript = "";
        } else {
          if (statusText)
            statusText.textContent =
              '🎤 No speech detected. Press "Speak" to try again.';
          state.isWaitingForUser = false;
          if (stopBtn) stopBtn.disabled = true;
          if (statusBar) statusBar.className = "status-bar";
        }

        stopTTS();

        state.isListening = false;
        if (speakBtn) {
          speakBtn.textContent = "🎙️ Speak";
          speakBtn.classList.remove("listening");
          speakBtn.disabled = false;
        }

        if (
          !state.isProcessing &&
          !state.isWaitingForUser &&
          !state.isAISpeaking
        ) {
          if (statusText)
            statusText.textContent = '🎤 Ready — Press "Speak" to start';
          if (statusBar) statusBar.className = "status-bar";
        }
      });
    }

    const newSessionBtn = $("newSessionBtn");
    if (newSessionBtn) {
      newSessionBtn.addEventListener("click", function () {
        if (recognition && state.isListening) {
          try {
            recognition.stop();
          } catch (e) {}
        }
        stopTTS();
        state.isListening = false;
        state.isProcessing = false;
        state.isWaitingForUser = false;
        state.isAISpeaking = false;
        state.hasSubmitted = false;
        interimTranscript = "";
        const speakBtn = $("speakBtn");
        const stopBtn = $("stopBtn");
        const statusBar = $("statusBar");
        if (speakBtn) {
          speakBtn.textContent = "🎙️ Speak";
          speakBtn.classList.remove("listening");
          speakBtn.disabled = false;
        }
        if (stopBtn) stopBtn.disabled = true;
        if (statusBar) statusBar.className = "status-bar";
        startConversation();
      });
    }

    const copyScriptBtn = $("copyScriptBtn");
    if (copyScriptBtn) copyScriptBtn.addEventListener("click", copyScript);

    const downloadBtn = $("downloadBtn");
    if (downloadBtn) downloadBtn.addEventListener("click", downloadScript);

    const clearHistoryBtn = $("clearHistoryBtn");
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener("click", function () {
        if (confirm("Clear the current conversation?")) {
          stopTTS();
          if (recognition && state.isListening) {
            try {
              recognition.stop();
            } catch (e) {}
          }
          const chatMessages = $("chatMessages");
          if (chatMessages) chatMessages.innerHTML = "";
          state.conversation = [];
          state.exchangeCount = 0;
          state.isSessionActive = false;
          state.isWaitingForUser = false;
          state.isAISpeaking = false;
          state.hasSubmitted = false;
          interimTranscript = "";
          updateExchangeCounter();
          updateProgress();
          updateExportButtons();
          addSystemMessage(
            '💡 Conversation cleared. Press "Speak" to start a new session!',
          );
          const statusText = $("statusText");
          const speakBtn = $("speakBtn");
          const stopBtn = $("stopBtn");
          const statusBar = $("statusBar");
          if (statusText)
            statusText.textContent = '🎤 Ready — Press "Speak" to start';
          if (speakBtn) {
            speakBtn.disabled = false;
            speakBtn.textContent = "🎙️ Speak";
            speakBtn.classList.remove("listening");
          }
          if (stopBtn) stopBtn.disabled = true;
          if (statusBar) statusBar.className = "status-bar";
          showToast("🗑️ Conversation cleared", "info");
        }
      });
    }

    // End Session button
    const endSessionBtn = $("endSessionBtn");
    if (endSessionBtn) {
      endSessionBtn.addEventListener("click", endSessionEarly);
    }

    const settingsBtn = $("settingsBtn");
    const settingsModal = $("settingsModal");
    const closeSettingsBtn = $("closeSettingsBtn");

    if (settingsBtn) {
      settingsBtn.addEventListener("click", function () {
        if (settingsModal) settingsModal.classList.add("active");
        const settingsApiMode = $("settingsApiMode");
        const settingsOfflineMode = $("settingsOfflineMode");
        const settingsApiSection = $("settingsApiSection");
        if (settingsApiMode) {
          settingsApiMode.checked = state.useAPI && state.apiKey;
        }
        if (settingsOfflineMode) {
          settingsOfflineMode.checked = !state.useAPI || !state.apiKey;
        }
        if (settingsApiSection) {
          settingsApiSection.style.display =
            state.useAPI && state.apiKey ? "block" : "none";
        }
      });
    }

    const settingsApiMode = $("settingsApiMode");
    const settingsOfflineMode = $("settingsOfflineMode");
    const settingsApiSection = $("settingsApiSection");

    if (settingsApiMode) {
      settingsApiMode.addEventListener("change", function () {
        if (this.checked && settingsApiSection) {
          settingsApiSection.style.display = "block";
        }
      });
    }

    if (settingsOfflineMode) {
      settingsOfflineMode.addEventListener("change", function () {
        if (this.checked) {
          if (settingsApiSection) settingsApiSection.style.display = "none";
          clearApiKey();
        }
      });
    }

    if (closeSettingsBtn) {
      closeSettingsBtn.addEventListener("click", function () {
        if (settingsModal) settingsModal.classList.remove("active");
      });
    }

    if (settingsModal) {
      settingsModal.addEventListener("click", function (e) {
        if (e.target === settingsModal) {
          settingsModal.classList.remove("active");
        }
      });
    }

    const settingsSaveKeyBtn = $("settingsSaveKeyBtn");
    if (settingsSaveKeyBtn) {
      settingsSaveKeyBtn.addEventListener("click", function () {
        const settingsApiKey = $("settingsApiKey");
        if (!settingsApiKey) return;
        const key = settingsApiKey.value.trim();
        if (key && key !== "••••••••••••••••") {
          saveApiKey(key);
        } else {
          updateSettingsApiStatus("❌ Please enter a valid API key", "error");
          showToast("❌ Please enter a valid API key", "error");
        }
      });
    }

    const settingsClearKeyBtn = $("settingsClearKeyBtn");
    if (settingsClearKeyBtn) {
      settingsClearKeyBtn.addEventListener("click", function () {
        if (confirm("Clear your saved API key?")) {
          clearApiKey();
        }
      });
    }

    const furiganaToggleBtn = document.getElementById("furiganaToggleBtn");
    if (furiganaToggleBtn) {
      furiganaToggleBtn.addEventListener("click", function () {
        state.furiganaVisible = !state.furiganaVisible;
        this.textContent = state.furiganaVisible
          ? "🔤 Furigana: ON"
          : "🔤 Furigana: OFF";
        this.classList.toggle("furigana-off", !state.furiganaVisible);
        document.querySelectorAll(".message-bubble").forEach((bubble) => {
          bubble.classList.toggle("furigana-off", !state.furiganaVisible);
        });
        refreshAllMessages();
        showToast(
          state.furiganaVisible ? "🔤 Furigana: ON" : "🔤 Furigana: OFF",
          "info",
        );
      });
    }

    const ttsToggleBtn = document.getElementById("ttsToggleBtn");
    if (ttsToggleBtn) {
      ttsToggleBtn.addEventListener("click", function () {
        state.autoPlayTTS = !state.autoPlayTTS;
        this.textContent = state.autoPlayTTS ? "🔊 Auto: ON" : "🔊 Auto: OFF";
        this.classList.toggle("tts-off", !state.autoPlayTTS);
        showToast(
          state.autoPlayTTS ? "🔊 Auto TTS: ON" : "🔊 Auto TTS: OFF",
          "info",
        );
      });
    }

    const translationToggleBtn = document.getElementById(
      "translationToggleBtn",
    );
    if (translationToggleBtn) {
      const savedTranslationPref = localStorage.getItem("show_translations");
      if (savedTranslationPref !== null) {
        state.showTranslations = savedTranslationPref === "true";
      }
      translationToggleBtn.textContent = state.showTranslations
        ? "🌎 Translation: ON"
        : "🌎 Translation: OFF";

      translationToggleBtn.addEventListener("click", function () {
        state.showTranslations = !state.showTranslations;
        this.textContent = state.showTranslations
          ? "🌎 Translation: ON"
          : "🌎 Translation: OFF";
        this.classList.toggle("translation-off", !state.showTranslations);
        localStorage.setItem("show_translations", state.showTranslations);
        refreshTranslations();
        showToast(
          state.showTranslations
            ? "🌎 Translations: ON"
            : "🌎 Translations: OFF",
          "info",
        );
      });
    }

    document.addEventListener("click", function (e) {
      const btn = e.target.closest(".tts-btn");
      if (btn) {
        const text = btn.dataset.text;
        if (text) {
          speakText(text, "ja-JP");
          btn.style.transform = "scale(1.2)";
          setTimeout(() => {
            btn.style.transform = "scale(1)";
          }, 200);
        }
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        if (
          document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA" &&
          document.activeElement?.tagName !== "SELECT"
        ) {
          const speakBtn = $("speakBtn");
          if (speakBtn) speakBtn.click();
        }
      }
      if (e.key === "Escape") {
        const settingsModal = $("settingsModal");
        if (settingsModal && settingsModal.classList.contains("active")) {
          settingsModal.classList.remove("active");
        }
        if (state.isListening) {
          const stopBtn = $("stopBtn");
          if (stopBtn) stopBtn.click();
        }
        if (state.isSpeaking) {
          stopTTS();
        }
      }
    });
  }

  // ============================================================
  // INIT APP
  // ============================================================
  function initApp() {
    if (state.isInitialized) return;
    state.isInitialized = true;

    const mode = getUserMode();
    if (mode === "api") {
      const key = getStoredApiKey();
      if (key) {
        state.apiKey = key;
        state.useAPI = true;
        const apiKeyInput = $("apiKeyInput");
        const settingsApiKey = $("settingsApiKey");
        if (apiKeyInput) apiKeyInput.value = "••••••••••••••••";
        if (settingsApiKey) settingsApiKey.value = "••••••••••••••••";
        updateApiStatus("✅ API key loaded", "success");
        if (settingsApiStatus) {
          settingsApiStatus.textContent = "✅ API key loaded";
          settingsApiStatus.className = "api-status success";
        }
      } else {
        state.useAPI = false;
        updateApiStatus("💡 No API key found — using fallback scripts", "info");
      }
    } else {
      state.useAPI = false;
      state.apiKey = null;
      updateApiStatus("💡 Offline mode — using fallback scripts", "info");
    }

    updateModeIndicator();

    const supported = initSpeechRecognition();

    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = function () {
        window.speechSynthesis.getVoices();
      };
    }

    populateSprints();
    populateTopics();

    state.currentSprint = 0;
    const sprintSelect = $("sprintSelect");
    if (sprintSelect) sprintSelect.value = 0;
    state.currentTopic = 0;
    populateTopics();

    const topics = getTopicsForSprint(state.currentSprint);
    state.currentTopicName =
      topics[state.currentTopic] || "General Conversation";

    addSystemMessage("💬 Welcome to N5 Conversation Practice!");
    addSystemMessage(`📚 Current: ${getSprintName(state.currentSprint)}`);
    addSystemMessage(`📖 Topic: ${state.currentTopicName}`);
    addSystemMessage('🎙️ Press "Speak" to start the conversation!');
    addSystemMessage(
      "💡 Tip: Speak clearly in Japanese. Press Stop when finished speaking.",
    );

    if (!supported) {
      addSystemMessage("⚠️ Speech recognition not available.");
    }

    if (!state.apiKey || !state.useAPI) {
      addSystemMessage(
        "💡 No API key set. Using fallback scripts. Click ⚙️ to add your DeepSeek API key.",
      );
    }

    const statusText = $("statusText");
    if (statusText)
      statusText.textContent = '🎤 Ready — Press "Speak" to start';
    updateExchangeCounter();
    updateProgress();
    updateExportButtons();

    setupEventListeners();

    console.log("📚 Conversation Practice initialized");
    console.log(
      "   Sprint:",
      state.currentSprint,
      getSprintName(state.currentSprint),
    );
    console.log("   Topic:", state.currentTopicName);
    console.log("   Mode:", state.useAPI ? "API" : "Offline");
    console.log(
      "   API Key:",
      state.apiKey ? "✅ Set (Encrypted)" : "❌ Not set",
    );
    console.log(
      "   Speech Recognition:",
      supported ? "✅ Supported" : "❌ Not supported",
    );
    console.log(
      "   TTS:",
      window.speechSynthesis ? "✅ Available" : "❌ Not available",
    );
    console.log("   recognition object:", !!recognition);
  }

  // ============================================================
  // MAIN INIT
  // ============================================================
  function init() {
    console.log("🚀 Initializing Conversation Practice...");

    setupSetupListeners();

    if (hasUserSetup()) {
      const mode = getUserMode();
      if (mode === "api") {
        const key = getStoredApiKey();
        if (key) {
          state.apiKey = key;
          state.useAPI = true;
        } else {
          state.useAPI = false;
        }
      } else {
        state.useAPI = false;
      }
      state.isSetupComplete = true;
      hideSetupScreen();
      initApp();
    } else {
      showSetupScreen();
      const tempKey = localStorage.getItem("temp_api_key");
      const setupApiKey = $("setupApiKey");
      if (tempKey && setupApiKey) {
        setupApiKey.value = tempKey;
      }
      addSystemMessage(
        "👋 Welcome! Please complete the setup to start practicing.",
      );
      populateSprints();
      populateTopics();
    }
  }

  // ============================================================
  // URL PARAMETER HANDLING
  // ============================================================
  function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const sprintParam = params.get("sprint");
    if (sprintParam !== null) {
      const sprintIndex = parseInt(sprintParam);
      if (sprintIndex >= 0 && sprintIndex < sprints.length) {
        state.currentSprint = sprintIndex;
        const sprintSelect = $("sprintSelect");
        if (sprintSelect) sprintSelect.value = sprintIndex;
        state.currentTopic = 0;
        populateTopics();
        const topics = getTopicsForSprint(sprintIndex);
        state.currentTopicName =
          topics[state.currentTopic] || "General Conversation";
        addSystemMessage(`📚 Loaded: ${getSprintName(sprintIndex)}`);
        addSystemMessage(`📖 Topic: ${state.currentTopicName}`);
        updateHints();
      }
    }
  }

  // ============================================================
  // 💰 USAGE TRACKER - Cost monitoring
  // ============================================================
  let totalCost = 0;

  function trackCost(inputTokens, outputTokens) {
    const inputCost = (inputTokens / 1_000_000) * 0.14;
    const outputCost = (outputTokens / 1_000_000) * 0.28;
    const cost = inputCost + outputCost;
    totalCost += cost;
    console.log(`💰 This exchange: $${cost.toFixed(6)}`);
    console.log(`💰 Total spent: $${totalCost.toFixed(6)}`);
    return cost;
  }

  window.trackCost = trackCost;
  window.totalCost = totalCost;

  // ============================================================
  // EXPOSE FUNCTIONS
  // ============================================================
  window.stripFurigana = stripFurigana;
  window.renderWithFurigana = renderWithFurigana;
  window.speakText = speakText;
  window.stopTTS = stopTTS;
  window.startConversation = startConversation;
  window.addSystemMessage = addSystemMessage;
  window.addMessage = addMessage;
  window.getSprintName = getSprintName;
  window.state = state;
  window.recognition = recognition;
  window.showToast = showToast;
  window.downloadScript = downloadScript;
  window.copyScript = copyScript;
  window.clearTranslationCache = clearTranslationCache;
  window.encrypt = encrypt;
  window.decrypt = decrypt;
  window.endSessionEarly = endSessionEarly;
  window.trackCost = trackCost;
  window.totalCost = totalCost;

  console.log("✅ Usage tracker loaded!");
  console.log("💰 Type 'trackCost(100, 50)' to test usage tracking");

  // ============================================================
  // START APP
  // ============================================================
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init();
      setTimeout(handleUrlParams, 300);
    });
  } else {
    init();
    setTimeout(handleUrlParams, 300);
  }

  console.log("✅ Conversation Practice ready!");
  console.log('   Type "startConversation()" to begin');
  console.log("   Type \"speakText('こんにちは')\" to test TTS");
  console.log("   🔒 API key is stored with encryption");
  console.log("   💰 Cost tracking is active — check console for usage");
  console.log("   🎲 Random opening questions for each session!");
})();