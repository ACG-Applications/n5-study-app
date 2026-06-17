// ==================== KANJI HELPER ====================
// Floating helper to look up kanji stroke order, readings, and meanings

// State
let kanjiHelperVisible = false;
let currentKanjiResults = [];

// DOM elements
let helperToggle = null;
let helperPanel = null;

// Get Unicode hex for a kanji character
function getKanjiUnicodeHex(kanji) {
    return kanji.codePointAt(0).toString(16).padStart(5, '0').toUpperCase(); // ← UPPERCASE
}

// Find kanji data from kanjiData
function findKanjiData(kanji) {
    if (typeof kanjiData !== 'undefined') {
        return kanjiData.find(k => k.kanji === kanji);
    }
    return null;
}

// Extract all kanji from input text
function extractKanjiFromText(text) {
    const kanjiRegex = /[\u4e00-\u9faf\u3400-\u4dbf]/g;
    const matches = text.match(kanjiRegex);
    if (!matches) return [];
    return [...new Set(matches)];
}

// Render results
function renderKanjiResults(kanjiList) {
    const container = document.getElementById('kanjiHelperResults');
    if (!container) return;
    
    if (!kanjiList || kanjiList.length === 0) {
        container.innerHTML = '<div class="kanji-helper-no-result">No kanji found. Paste some Japanese text above.</div>';
        return;
    }
    
    let html = '';
    
    for (const kanji of kanjiList) {
        const kanjiData = findKanjiData(kanji);
        const unicode = getKanjiUnicodeHex(kanji);
        const svgPath = `images/kanji-strokes/${unicode}.svg`;
        
let meaning = '?';
let onyomi = '';
let kunyomi = '';

if (kanjiData) {
    meaning = kanjiData.meaning || '?';
    onyomi = kanjiData.onyomi || '';
    kunyomi = kanjiData.kunyomi || '';
} else {
    // Try to provide a basic meaning from common kanji
    const commonMeanings = {
        '暑': 'hot (weather)',
        '寒': 'cold (weather)',
        '優': 'kind, gentle',
        '素': 'plain, element',
        '難': 'difficult',
        '易': 'easy',
        '明': 'bright',
        '暗': 'dark',
        '温': 'warm',
        '冷': 'cold (to touch)',
        '面': 'face, surface',
        '賑': 'bustling',
        '静': 'quiet',
        '有': 'to have',
        '親': 'parent, kind',
        '便': 'convenience',
        '不': 'not',
        '必': 'necessary',
        '自': 'self',
        '幸': 'happiness',
        '丈': 'height',
        '真': 'true'
    };
    if (commonMeanings[kanji]) {
        meaning = commonMeanings[kanji];
        onyomi = '(common kanji)';
    }
}
        
        // Build readings display
        let readingsHtml = '';
        if (onyomi) readingsHtml += `<span>音: ${onyomi}</span>`;
        if (kunyomi) readingsHtml += `<span>訓: ${kunyomi}</span>`;
        if (!onyomi && !kunyomi) readingsHtml = '<span>No reading data</span>';
        
        html += `
            <div class="kanji-helper-result-item" data-kanji="${kanji}" data-unicode="${unicode}" data-meaning="${meaning}">
                <div class="kanji-helper-char">${kanji}</div>
                <div class="kanji-helper-svg">
                    <img src="${svgPath}" alt="Stroke order for ${kanji}" 
                         onerror="this.parentElement.innerHTML='<span style=\\'font-size:10px;color:#999;\\'>no SVG</span>'">
                </div>
                <div class="kanji-helper-info">
                    <div class="kanji-helper-meaning">${meaning}</div>
                    <div class="kanji-helper-readings">${readingsHtml}</div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    // Add click handlers to open full stroke order modal
    document.querySelectorAll('.kanji-helper-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const kanji = item.dataset.kanji;
            const unicode = item.dataset.unicode;
            const meaning = item.dataset.meaning;
            if (typeof showStrokeOrder === 'function') {
                showStrokeOrder(kanji, unicode, meaning);
            }
        });
    });
}

// Search kanji from input
function searchKanji() {
    const input = document.getElementById('kanjiHelperInput');
    if (!input) return;
    
    const text = input.value;
    if (!text.trim()) {
        renderKanjiResults([]);
        return;
    }
    
    const kanjiList = extractKanjiFromText(text);
    currentKanjiResults = kanjiList;
    renderKanjiResults(kanjiList);
}

// Clear input
function clearKanjiInput() {
    const input = document.getElementById('kanjiHelperInput');
    if (input) {
        input.value = '';
    }
    renderKanjiResults([]);
}

// Toggle panel visibility
function toggleKanjiHelper() {
    kanjiHelperVisible = !kanjiHelperVisible;
    
    if (helperPanel) {
        helperPanel.classList.toggle('active', kanjiHelperVisible);
    }
    
    if (kanjiHelperVisible && helperToggle) {
        helperToggle.style.transform = 'rotate(90deg)';
    } else if (helperToggle) {
        helperToggle.style.transform = 'rotate(0deg)';
    }
}

// Create the Kanji Helper UI
function createKanjiHelper() {
    // Check if already exists
    if (document.getElementById('kanjiHelperPanel')) return;
    
    // Create toggle button
    const toggle = document.createElement('button');
    toggle.id = 'kanjiHelperToggle';
    toggle.className = 'kanji-helper-toggle';
    toggle.innerHTML = '🈳';
    toggle.title = 'Kanji Helper';
    document.body.appendChild(toggle);
    
    // Create panel
    const panel = document.createElement('div');
    panel.id = 'kanjiHelperPanel';
    panel.className = 'kanji-helper-panel';
    panel.innerHTML = `
        <div class="kanji-helper-header">
            <h3>🈳 Kanji Helper</h3>
            <button class="kanji-helper-close">✖</button>
        </div>
        <div class="kanji-helper-input-area">
            <textarea id="kanjiHelperInput" rows="3" placeholder="Paste Japanese text here...&#10;Example: 日本語能力試験"></textarea>
            <div class="kanji-helper-buttons">
                <button class="kanji-helper-search-btn">🔍 Look Up</button>
                <button class="kanji-helper-clear-btn">🗑️ Clear</button>
            </div>
        </div>
        <div id="kanjiHelperResults" class="kanji-helper-results">
            <div class="kanji-helper-no-result">Paste Japanese text above and click "Look Up"</div>
        </div>
    `;
    document.body.appendChild(panel);
    
    // Store references
    helperToggle = toggle;
    helperPanel = panel;
    
    // Add event listeners
    toggle.addEventListener('click', toggleKanjiHelper);
    
    panel.querySelector('.kanji-helper-close').addEventListener('click', toggleKanjiHelper);
    
    panel.querySelector('.kanji-helper-search-btn').addEventListener('click', searchKanji);
    
    panel.querySelector('.kanji-helper-clear-btn').addEventListener('click', clearKanjiInput);
    
    // Allow Enter key in textarea to search (Ctrl+Enter or Cmd+Enter)
    const textarea = panel.querySelector('#kanjiHelperInput');
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            searchKanji();
        }
    });
    
    // Make panel draggable
    makeDraggable(panel, panel.querySelector('.kanji-helper-header'));
}

// Make element draggable
function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    handle.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        const newLeft = element.offsetLeft - pos1;
        const newTop = element.offsetTop - pos2;
        
        // Keep within viewport bounds
        const maxLeft = window.innerWidth - element.offsetWidth;
        const maxTop = window.innerHeight - element.offsetHeight;
        
        element.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
        element.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
        element.style.right = 'auto';
        element.style.bottom = 'auto';
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Initialize
function initKanjiHelper() {
    // Wait for DOM to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createKanjiHelper);
    } else {
        createKanjiHelper();
    }
}

// Start
initKanjiHelper();