// ==================== MASTERED TRACKING ====================
let masteredSet = new Set();
let showMastered = true;  // true = show mastered sentences in flashcards

function loadMastered() {
  const stored = localStorage.getItem("n5_mastered");
  if (stored) masteredSet = new Set(JSON.parse(stored));
  if (typeof updateProgressDisplay === 'function') updateProgressDisplay();
}

function saveMastered() {
  localStorage.setItem("n5_mastered", JSON.stringify([...masteredSet]));
  if (typeof updateProgressDisplay === 'function') updateProgressDisplay();
}

function toggleMastered(idx) {
  if (masteredSet.has(idx)) {
    masteredSet.delete(idx);
  } else {
    masteredSet.add(idx);
  }
  saveMastered();
  // Update flashcard view if open
  if (typeof updateFlashcardsForSprint === 'function') updateFlashcardsForSprint();
}

function resetMastered() {
  masteredSet.clear();
  saveMastered();
  if (typeof updateFlashcardsForSprint === 'function') updateFlashcardsForSprint();
}

function updateStats() {
  const {start, end} = sprints[activeSprintIndex];
  let total = end - start + 1, cnt = 0;
  for (let i = start; i <= end; i++) if (masteredSet.has(i)) cnt++;
  const statsEl = document.getElementById("masteredStats");
  if (statsEl) statsEl.innerHTML = `📊 Mastered: ${cnt} / ${total}`;
}