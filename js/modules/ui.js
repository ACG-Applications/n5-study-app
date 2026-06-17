// ==================== UI RENDERING (SIMPLIFIED) ====================
let activeSprintIndex = 0;

// DOM Elements
const sprintSelect = document.getElementById('sprintSelect');
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');

// Populate Sprint Dropdown
function populateSprintSelect() {
  sprintSelect.innerHTML = '';
  sprints.forEach((sp, idx) => {
    const option = document.createElement('option');
    option.value = idx;
    option.textContent = `${sp.displayName} (${sp.start + 1}-${sp.end + 1})`;
    if (idx === activeSprintIndex) option.selected = true;
    sprintSelect.appendChild(option);
  });
}

// Update Progress Display
function updateProgressDisplay() {
  const {start, end} = sprints[activeSprintIndex];
  let total = end - start + 1;
  let mastered = 0;
  for (let i = start; i <= end; i++) {
    if (masteredSet.has(i)) mastered++;
  }
  const percent = Math.round((mastered / total) * 100);
  progressText.innerText = `${mastered} / ${total} (${percent}%)`;
  progressBar.style.width = `${percent}%`;
}

// Override updateStats to also update progress bar
const originalUpdateStats = updateStats;
updateStats = function() {
  originalUpdateStats();
  updateProgressDisplay();
};

// Sprint Change Handler
sprintSelect.addEventListener('change', (e) => {
  activeSprintIndex = parseInt(e.target.value);
  updateProgressDisplay();
  // Update flashcard view if open
  if (typeof updateFlashcardsForSprint === 'function') updateFlashcardsForSprint();
  // Update story mode's current sprint variable
  if (typeof currentStorySprint !== 'undefined') {
    currentStorySprint = activeSprintIndex;
  }
});

// Mastered Controls
document.getElementById('showMasteredBtn').onclick = () => { 
  showMastered = true; 
  if (typeof updateFlashcardsForSprint === 'function') updateFlashcardsForSprint();
};
document.getElementById('hideMasteredBtn').onclick = () => { 
  showMastered = false; 
  if (typeof updateFlashcardsForSprint === 'function') updateFlashcardsForSprint();
};
document.getElementById('resetMasteredBtn').onclick = () => { 
  resetMastered(); 
  if (typeof updateFlashcardsForSprint === 'function') updateFlashcardsForSprint();
};

// CSV Export
document.getElementById('csvBtn').onclick = () => {
  let csv = [["Sentence","Reading","Translation","Grammar"]];
  sentencesData.forEach(s => csv.push([s.jp, s.reading, s.translation, s.grammarHint || ""]));
  const blob = new Blob(["\uFEFF" + csv.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")], {type: "text/csv"});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `n5_sentences_${sprints[activeSprintIndex].name}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
};

// Export/Import Mastered Data
document.getElementById('exportMasteredBtn').onclick = () => {
  const data = JSON.stringify([...masteredSet]);
  const blob = new Blob([data], {type: "application/json"});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = "n5_mastered_backup.json";
  a.click();
  URL.revokeObjectURL(a.href);
};

document.getElementById('importMasteredBtn').onclick = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        masteredSet = new Set(imported);
        saveMastered();
        updateProgressDisplay();
        if (typeof updateFlashcardsForSprint === 'function') updateFlashcardsForSprint();
        alert(`Imported ${masteredSet.size} mastered items!`);
      } catch (err) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };
  input.click();
};

// Print Button - Opens Print Modal
const printModal = document.getElementById('printModal');
document.getElementById('printBtn').onclick = () => {
  printModal.style.display = 'flex';
};
document.getElementById('closePrintBtn').onclick = () => {
  printModal.style.display = 'none';
};

// Print Options
document.getElementById('printKanjiOnlyBtn').onclick = () => {
  printModal.style.display = 'none';
  const sentences = getCurrentSprintSentences();
  if (!sentences.length) { alert('No sentences to print!'); return; }
  openPrintWindow(generatePrintContent(sentences, false, false), 'N5 Writing Practice - Kanji Only');
};
document.getElementById('printWithFuriganaBtn').onclick = () => {
  printModal.style.display = 'none';
  const sentences = getCurrentSprintSentences();
  if (!sentences.length) { alert('No sentences to print!'); return; }
  openPrintWindow(generatePrintContent(sentences, true, false), 'N5 Writing Practice - with Furigana');
};
document.getElementById('printWithTranslationBtn').onclick = () => {
  printModal.style.display = 'none';
  const sentences = getCurrentSprintSentences();
  if (!sentences.length) { alert('No sentences to print!'); return; }
  openPrintWindow(generatePrintContent(sentences, false, true), 'N5 Writing Practice - with Translation');
};

// Initialize App
function init() {
  loadMastered();
  injectWordMeanings();
  populateSprintSelect();
  updateProgressDisplay();
}

init();