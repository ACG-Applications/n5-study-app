// ==================== KANJI MODULE ====================

let currentKanjiTab = 'list';
let furiganaHidden = false;
let masteredKanji = new Set();
let attemptedKanji = new Set();
let currentSearchTerm = '';

// DOM Elements
const furiToggleBtn = document.getElementById('furiToggleBtn');
const tabListBtn = document.getElementById('tabListBtn');
const tabQuizBtn = document.getElementById('tabQuizBtn');
const tabMasteredBtn = document.getElementById('tabMasteredBtn');
const kanjiSearchInput = document.getElementById('kanjiSearchInput');
const resetAllProgressBtn = document.getElementById('resetAllProgressBtn');
const resetMasteredOnlyBtn = document.getElementById('resetMasteredOnlyBtn');

// ========== TTS FUNCTION ==========
function speakText(text, lang = 'ja-JP') {
    if (!text || text === '-' || text.trim() === '') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
}

// Helper: Get Unicode hex for a kanji character
function getUnicodeHex(kanji) {
    return kanji.codePointAt(0).toString(16);
}

// Find example sentences from sentencesData containing this kanji
function findSentencesForKanji(kanjiChar) {
    if (typeof sentencesData === 'undefined' || !sentencesData) return [];
    
    const results = [];
    for (const sentence of sentencesData) {
        if (sentence.jp && sentence.jp.includes(kanjiChar)) {
            results.push({
                sentence: sentence.jp,
                reading: sentence.reading || '',
                english: sentence.translation || ''
            });
            if (results.length >= 3) break;
        }
    }
    return results;
}

// Add furigana to text
function addFuriganaToText(text) {
    if (!text) return '';
    if (furiganaHidden) {
        return text.replace(/[（(][^）)]*[）)]/g, '');
    }
    return text.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, (_, kanji, furigana) => {
        return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
    });
}

// Load mastered from localStorage
function loadMasteredKanji() {
    const stored = localStorage.getItem('masteredKanji');
    if (stored) {
        masteredKanji = new Set(JSON.parse(stored));
    }
    const storedAttempted = localStorage.getItem('attemptedKanji');
    if (storedAttempted) {
        attemptedKanji = new Set(JSON.parse(storedAttempted));
    }
    updateMasteredCount();
}

function saveMasteredKanji() {
    localStorage.setItem('masteredKanji', JSON.stringify([...masteredKanji]));
    localStorage.setItem('attemptedKanji', JSON.stringify([...attemptedKanji]));
    updateMasteredCount();
}

function updateMasteredCount() {
    const total = kanjiData.length;
    const mastered = masteredKanji.size;
    const attempted = attemptedKanji.size;
    
    const masteredCountSpan = document.getElementById('masteredCount');
    const totalCountSpan = document.getElementById('totalCount');
    if (masteredCountSpan) masteredCountSpan.innerText = mastered;
    if (totalCountSpan) totalCountSpan.innerText = total;
}

function markKanjiMastered(kanjiId, isFirstAttempt = true) {
    if (isFirstAttempt && !masteredKanji.has(kanjiId)) {
        masteredKanji.add(kanjiId);
    }
    if (!attemptedKanji.has(kanjiId)) {
        attemptedKanji.add(kanjiId);
    }
    saveMasteredKanji();
    renderKanjiList();
    renderMasteredList();
}

function unmarkKanjiMastered(kanjiId) {
    masteredKanji.delete(kanjiId);
    saveMasteredKanji();
    renderKanjiList();
    renderMasteredList();
}

// Render mastered list
function renderMasteredList() {
    const container = document.getElementById('masteredList');
    if (!container) return;
    
    const masteredIds = [...masteredKanji];
    
    if (masteredIds.length === 0) {
        container.innerHTML = '<p class="empty-message">No kanji mastered yet. Complete a quiz to master them!</p>';
        return;
    }
    
    let html = '';
    for (const kanjiId of masteredIds) {
        const kanji = kanjiData.find(k => k.id === kanjiId);
        if (kanji) {
            html += `
                <div class="mastered-kanji-item">
                    <div>
                        <span class="mastered-kanji-char">${kanji.kanji}</span>
                        <span class="mastered-kanji-meaning">${kanji.meaning}</span>
                    </div>
                    <button class="unmaster-btn" data-kanji-id="${kanji.id}">Remove</button>
                </div>
            `;
        }
    }
    
    container.innerHTML = html;
    
    document.querySelectorAll('.unmaster-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const kanjiId = btn.dataset.kanjiId;
            unmarkKanjiMastered(kanjiId);
        });
    });
}

// RENDER KANJI LIST - MAIN FUNCTION (with TTS buttons and sentence TTS)
function renderKanjiList() {
    const container = document.getElementById('kanjiList');
    if (!container) {
        console.log('Container not found');
        return;
    }
    
    let filteredKanji = [...kanjiData];
    
    if (currentSearchTerm) {
        const searchLower = currentSearchTerm.toLowerCase();
        filteredKanji = filteredKanji.filter(k => 
            k.kanji.includes(currentSearchTerm) ||
            k.meaning.toLowerCase().includes(searchLower) ||
            (k.onyomi && k.onyomi.toLowerCase().includes(searchLower)) ||
            (k.kunyomi && k.kunyomi.toLowerCase().includes(searchLower))
        );
    }
    
    let html = '<div class="kanji-grid">';
    
    for (const kanji of filteredKanji) {
        const isMastered = masteredKanji.has(kanji.id);
        
        // Escape reading strings
        const onyomiAttr = (kanji.onyomi || '-').replace(/"/g, '&quot;');
        const kunyomiAttr = (kanji.kunyomi || '-').replace(/"/g, '&quot;');
        
        // Try kanjiData.examples first, then fall back to sentencesData
        let exampleSentences = [];
        if (kanji.examples && kanji.examples.length > 0) {
            exampleSentences = kanji.examples;
        } else {
            exampleSentences = findSentencesForKanji(kanji.kanji);
        }
        
        // Build examples HTML with data attributes for TTS
        let examplesHtml = '';
        if (exampleSentences.length > 0) {
            examplesHtml = exampleSentences.map(ex => `
                <div class="example-item" data-reading="${ex.reading || ''}" data-sentence="${ex.sentence || ''}">
                    <div class="example-jp">${addFuriganaToText(ex.sentence)}</div>
                    <div class="example-trans">${ex.english}</div>
                </div>
            `).join('');
        } else {
            examplesHtml = '<p style="color: #999; font-style: italic;">No examples available</p>';
        }
        
        html += `
            <div class="kanji-card ${isMastered ? 'mastered' : ''}" data-kanji-id="${kanji.id}">
                <div class="kanji-header-card">
                    <span class="kanji-pattern">${kanji.kanji}</span>
                    <span class="kanji-meaning">${kanji.meaning}</span>
                    ${isMastered ? '<span class="mastered-badge">✓ Mastered</span>' : ''}
                </div>
                <div class="kanji-readings">
                    <div>
                        <strong>On'yomi:</strong> 
                        <span class="reading-value">${kanji.onyomi || '-'}</span>
                        <button class="tts-reading-btn small-btn" data-text="${onyomiAttr}" data-lang="ja-JP" style="margin-left: 8px; padding: 2px 8px; font-size: 0.7rem;">🔊</button>
                    </div>
                    <div>
                        <strong>Kun'yomi:</strong> 
                        <span class="reading-value">${kanji.kunyomi || '-'}</span>
                        <button class="tts-reading-btn small-btn" data-text="${kunyomiAttr}" data-lang="ja-JP" style="margin-left: 8px; padding: 2px 8px; font-size: 0.7rem;">🔊</button>
                    </div>
                </div>
                <div class="kanji-examples">
                    <h4>📝 Example Sentences <span style="font-weight:normal;font-size:0.7rem;color:#999;">(click to listen)</span></h4>
                    ${examplesHtml}
                </div>
                <div class="kanji-buttons">
                    <button class="small-btn mark-mastered-btn" data-kanji-id="${kanji.id}">
                        ${isMastered ? '✓ Mastered' : '✓ Mark as Mastered'}
                    </button>
                    <button class="small-btn stroke-order-btn" data-kanji="${kanji.kanji}" data-unicode="${getUnicodeHex(kanji.kanji)}" data-meaning="${kanji.meaning}">
                        ✍️ Stroke Order
                    </button>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    
    if (filteredKanji.length === 0) {
        html = '<p style="text-align: center; padding: 40px;">No kanji match your search.</p>';
    }
    
    container.innerHTML = html;
    console.log('Kanji list rendered, count:', filteredKanji.length);
}

// ========== EVENT DELEGATION ==========
function setupDelegation() {
    const container = document.getElementById('kanjiList');
    if (!container) return;
    
    // Stroke Order buttons
    container.addEventListener('click', function(e) {
        const btn = e.target.closest('.stroke-order-btn');
        if (!btn) return;
        e.stopPropagation();
        
        const kanji = btn.dataset.kanji;
        const unicode = btn.dataset.unicode;
        const meaning = btn.dataset.meaning;
        
        if (typeof showStrokeOrder === 'function') {
            showStrokeOrder(kanji, unicode, meaning);
        } else {
            console.error('showStrokeOrder is not defined!');
            alert('Stroke order feature not available. Please check console.');
        }
    });
    
    // Mastery buttons
    container.addEventListener('click', function(e) {
        const btn = e.target.closest('.mark-mastered-btn');
        if (!btn) return;
        e.stopPropagation();
        
        const kanjiId = btn.dataset.kanjiId;
        if (masteredKanji.has(kanjiId)) {
            unmarkKanjiMastered(kanjiId);
        } else {
            markKanjiMastered(kanjiId, true);
        }
    });
    
    // TTS buttons (for On'yomi/Kun'yomi readings)
    container.addEventListener('click', function(e) {
        const btn = e.target.closest('.tts-reading-btn');
        if (!btn) return;
        e.stopPropagation();
        
        const text = btn.dataset.text;
        const lang = btn.dataset.lang || 'ja-JP';
        if (text && text !== '-') {
            speakText(text, lang);
        }
    });
    
    // Example sentence TTS (click the sentence to hear it)
    container.addEventListener('click', function(e) {
        const item = e.target.closest('.example-item');
        if (!item) return;
        e.stopPropagation();
        
        // First try to use the reading (furigana)
        const reading = item.dataset.reading;
        if (reading && reading.trim() !== '') {
            speakText(reading, 'ja-JP');
        } else {
            // Fallback: clean the sentence of furigana markers
            const sentence = item.dataset.sentence || '';
            const cleanSentence = sentence.replace(/[（(][^）)]*[）)]/g, '').trim();
            if (cleanSentence) {
                speakText(cleanSentence, 'ja-JP');
            }
        }
    });
}

// Apply furigana hide
function applyFuriganaHide() {
    furiganaHidden = !furiganaHidden;
    if (furiToggleBtn) {
        furiToggleBtn.innerText = furiganaHidden ? '🔤 Furigana On' : '🔤 Furigana Off';
    }
    renderKanjiList();
    renderMasteredList();
}

// Switch tabs
function switchTab(tabId) {
    currentKanjiTab = tabId;
    
    const tabButtons = [tabListBtn, tabQuizBtn, tabMasteredBtn];
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
    
    if (tabId === 'list') {
        renderKanjiList();
    } else if (tabId === 'mastered') {
        renderMasteredList();
    }
}

// Reset functions
function resetAllProgress() {
    if (confirm('⚠️ Are you sure? This will reset ALL mastered and attempted kanji. This cannot be undone.')) {
        masteredKanji.clear();
        attemptedKanji.clear();
        saveMasteredKanji();
        renderKanjiList();
        renderMasteredList();
        updateMasteredCount();
    }
}

function resetMasteredOnly() {
    if (confirm('⚠️ Reset mastered kanji only? Attempted will be preserved.')) {
        masteredKanji.clear();
        saveMasteredKanji();
        renderKanjiList();
        renderMasteredList();
        updateMasteredCount();
    }
}

// Event Listeners
if (furiToggleBtn) {
    furiToggleBtn.addEventListener('click', applyFuriganaHide);
}

if (kanjiSearchInput) {
    kanjiSearchInput.addEventListener('input', () => {
        currentSearchTerm = kanjiSearchInput.value;
        renderKanjiList();
    });
}

if (tabListBtn) tabListBtn.addEventListener('click', () => switchTab('list'));
if (tabQuizBtn) tabQuizBtn.addEventListener('click', () => switchTab('quiz'));
if (tabMasteredBtn) tabMasteredBtn.addEventListener('click', () => switchTab('mastered'));

if (resetAllProgressBtn) resetAllProgressBtn.addEventListener('click', resetAllProgress);
if (resetMasteredOnlyBtn) resetMasteredOnlyBtn.addEventListener('click', resetMasteredOnly);

// Initialize
function initKanji() {
    console.log('Initializing kanji module...');
    loadMasteredKanji();
    renderKanjiList();
    updateMasteredCount();
    switchTab('list');
    setupDelegation();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKanji);
} else {
    initKanji();
}