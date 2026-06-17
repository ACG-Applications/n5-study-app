// ==================== HELPER FUNCTIONS ====================
// These functions are for the main app (index.html only)
// They safely check for required globals before executing

function loadMastered() {
  if (typeof masteredSet === 'undefined') return;
  const stored = localStorage.getItem("n5_mastered");
  if (stored) masteredSet = new Set(JSON.parse(stored));
}

function saveMastered() {
  if (typeof masteredSet === 'undefined' || typeof updateStats !== 'function') return;
  localStorage.setItem("n5_mastered", JSON.stringify([...masteredSet]));
  updateStats();
}

function toggleMastered(idx) {
  if (typeof masteredSet === 'undefined' || typeof renderSentences !== 'function') return;
  if (masteredSet.has(idx)) {
    masteredSet.delete(idx);
  } else {
    masteredSet.add(idx);
  }
  saveMastered();
  renderSentences();
}

function resetMastered() {
  if (typeof masteredSet === 'undefined' || typeof renderSentences !== 'function') return;
  masteredSet.clear();
  saveMastered();
  renderSentences();
}

function updateStats() {
  if (typeof sprints === 'undefined' || typeof activeSprintIndex === 'undefined') return;
  if (typeof masteredSet === 'undefined') return;
  const {start, end} = sprints[activeSprintIndex];
  let total = end - start + 1, cnt = 0;
  for (let i = start; i <= end; i++) if (masteredSet.has(i)) cnt++;
  const statsEl = document.getElementById("masteredStats");
  if (statsEl) statsEl.innerHTML = `📊 Mastered: ${cnt} / ${total}`;
}

function getCurrentSprintSentences() {
  if (typeof sprints === 'undefined' || typeof activeSprintIndex === 'undefined') return [];
  if (typeof masteredSet === 'undefined') return [];
  const {start, end} = sprints[activeSprintIndex];
  const sentences = [];
  for (let i = start; i <= end; i++) {
    if (typeof showMastered === 'undefined' || showMastered || !masteredSet.has(i)) {
      sentences.push(sentencesData[i]);
    }
  }
  return sentences;
}

function getSprintName() {
  if (typeof sprints === 'undefined' || typeof activeSprintIndex === 'undefined') return "";
  return sprints[activeSprintIndex].name;
}

function getPlainJapanese(sentence) {
  if (!sentence || !sentence.jp) return "";
  return sentence.jp.replace(/（[^）]+）/g, '').trim();
}