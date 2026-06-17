// ==================== FLASHCARD MODULE ====================
let flashIndices = [], flashPos = 0;
let flashFuriganaHidden = false;
let flashShuffled = false;
let flashTranslationRevealed = false;
const flashJpDiv = document.getElementById('flashJp');
const flashTransDiv = document.getElementById('flashTranslation');
const flashModal = document.getElementById('flashcardModal');

// Update flashcard modal title with current sprint name
function updateFlashcardTitle() {
  const sprintName = sprints[activeSprintIndex].displayName;
  const modalTitle = document.getElementById('flashcardTitle');
  if (modalTitle) {
    modalTitle.innerHTML = `📇 ${sprintName} · Flashcards`;
  }
}

function rebuildFlash() { 
  const {start, end} = sprints[activeSprintIndex]; 
  flashIndices = []; 
  for (let i = start; i <= end; i++) {
    if (typeof showMastered !== 'undefined' && showMastered || !masteredSet.has(i)) {
      flashIndices.push(i);
    } else if (typeof showMastered === 'undefined') {
      flashIndices.push(i);
    }
  }
  if (!flashIndices.length) {
    for (let i = start; i <= end; i++) flashIndices.push(i);
  }
  flashShuffled = false;
  flashPos = 0;
}

function shuffleFlashcards() {
  if (!flashIndices.length) return;
  for (let i = flashIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flashIndices[i], flashIndices[j]] = [flashIndices[j], flashIndices[i]];
  }
  flashShuffled = true;
  flashPos = 0;
  showFlash(flashPos);
}

function resetFlashcardOrder() {
  rebuildFlash();
  if (flashIndices.length) showFlash(0);
}

function showFlash(pos) { 
  if (!flashIndices.length || pos >= flashIndices.length) return;
  const idx = flashIndices[pos]; 
  const s = sentencesData[idx]; 
  const wrappedHtml = wrapWordsWithTooltips(s);
  flashJpDiv.innerHTML = wrappedHtml;
  flashJpDiv.classList.toggle('hide-furigana', flashFuriganaHidden);
  flashTransDiv.innerHTML = "???";
  document.getElementById('flashIndex').innerText = pos + 1; 
  document.getElementById('flashTotal').innerText = flashIndices.length; 
  flashJpDiv.onclick = () => speakText(s.reading);
  flashTranslationRevealed = false;
  const revealBtn = document.getElementById('revealTransBtn');
  if (revealBtn) revealBtn.innerText = '🔎 Reveal On';
  
  // Add long press support for tooltips on mobile
  if (typeof addLongPressSupport === 'function') {
    flashJpDiv.querySelectorAll('.word-tooltip').forEach(addLongPressSupport);
  }
}

// Update flashcard content when sprint changes
function updateFlashcardsForSprint() {
  if (flashModal && flashModal.style.display === 'flex') {
    rebuildFlash();
    updateFlashcardTitle();
    if (flashIndices.length) showFlash(0);
  }
}

// Flashcard Speed Controls
document.getElementById('flashSpeed075Btn').onclick = () => {
  currentSpeechRate = 0.75;
  document.getElementById('flashSpeed075Btn').style.backgroundColor = '#6c8b6b';
  document.getElementById('flashSpeed100Btn').style.backgroundColor = '#555';
};

document.getElementById('flashSpeed100Btn').onclick = () => {
  currentSpeechRate = 1.0;
  document.getElementById('flashSpeed100Btn').style.backgroundColor = '#6c8b6b';
  document.getElementById('flashSpeed075Btn').style.backgroundColor = '#555';
};

// Initialize flashcard event listeners
document.getElementById('flashcardBtn').onclick = () => { 
  rebuildFlash(); 
  updateFlashcardTitle();
  if (flashIndices.length) showFlash(0); 
  flashModal.style.display = 'flex'; 
};

document.getElementById('flashShuffleBtn').onclick = () => { 
  shuffleFlashcards(); 
};

document.getElementById('flashResetOrderBtn').onclick = () => { 
  resetFlashcardOrder(); 
};

document.getElementById('revealTransBtn').onclick = () => { 
  const idx = flashIndices[flashPos]; 
  const btn = document.getElementById('revealTransBtn');
  if (!flashTranslationRevealed) {
    if (idx !== undefined) flashTransDiv.innerHTML = sentencesData[idx].translation;
    flashTranslationRevealed = true;
    btn.innerText = '🙈 Reveal Off';
  } else {
    flashTransDiv.innerHTML = "???";
    flashTranslationRevealed = false;
    btn.innerText = '🔎 Reveal On';
  }
};

document.getElementById('nextFlashBtn').onclick = () => { 
  if (flashIndices.length) {
    flashPos = (flashPos + 1) % flashIndices.length; 
    showFlash(flashPos);
  }
};

document.getElementById('prevFlashBtn').onclick = () => { 
  if (flashIndices.length) {
    flashPos = (flashPos - 1 + flashIndices.length) % flashIndices.length; 
    showFlash(flashPos);
  }
};

document.getElementById('closeFlashBtn').onclick = () => { 
  flashModal.style.display = 'none'; 
  if (typeof window.speechSynthesis !== 'undefined') {
    window.speechSynthesis.cancel();
  }
};

document.getElementById('flashAudioBtn').onclick = () => { 
  const idx = flashIndices[flashPos]; 
  if (idx !== undefined) speakText(sentencesData[idx].reading); 
};

document.getElementById('flashFuriToggleBtn').onclick = () => { 
  flashFuriganaHidden = !flashFuriganaHidden; 
  flashJpDiv.classList.toggle('hide-furigana', flashFuriganaHidden);
  const btn = document.getElementById('flashFuriToggleBtn');
  btn.innerText = flashFuriganaHidden ? '🔤 Furigana On' : '🔤 Furigana Off';
};

// Set default speed button highlight
document.getElementById('flashSpeed100Btn').style.backgroundColor = '#6c8b6b';