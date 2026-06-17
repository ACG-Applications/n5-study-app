// ==================== KANJI STROKE ORDER VIEWER ====================

// Get Unicode hex for a kanji character
function getUnicodeHex(kanji) {
    return kanji.codePointAt(0).toString(16);
}

// Get both 4-digit and 5-digit versions
function getSvgPaths(unicode) {
    const padded4 = unicode;                 // e.g., "65e5"
    const padded5 = unicode.padStart(5, '0'); // e.g., "065e5"
    return {
        primary: `images/kanji-strokes/${padded5.toUpperCase()}.svg`,   // ← UPPERCASE
        fallback: `images/kanji-strokes/${padded4.toUpperCase()}.svg`    // ← UPPERCASE
    };
}

function getStrokeHint(kanji) {
    const hints = {
        '日': 'Box shape, then horizontal line inside',
        '一': 'Single horizontal line from left to right',
        '国': 'Enclosure first, then inside, then close',
        '人': 'Left to right, like a person standing',
        '年': 'Top horizontal, then vertical, then bottom',
        '大': 'Horizontal line, then left stroke, then right',
        '本': 'Horizontal, vertical, then four strokes',
        '中': 'Enclosure first, then vertical line through center',
        '川': 'Left vertical, center vertical, right vertical',
        '水': 'Center vertical, left, then right strokes'
    };
    return hints[kanji] || 'Follow the numbered stroke order from 1 to last.';
}

function getExampleSentencesForKanji(kanji) {
    if (typeof kanjiData !== 'undefined') {
        const kanjiEntry = kanjiData.find(k => k.kanji === kanji);
        if (kanjiEntry && kanjiEntry.examples) {
            return kanjiEntry.examples;
        }
    }
    return [];
}

// Display stroke order modal
function showStrokeOrder(kanji, unicode, meaning) {
    console.log('showStrokeOrder called with:', kanji, unicode, meaning);
    
    let modal = document.getElementById('strokeOrderModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'strokeOrderModal';
        modal.className = 'stroke-modal';
        modal.innerHTML = `
            <div class="stroke-modal-content">
                <div class="stroke-modal-header">
                    <h3 id="strokeKanjiTitle"></h3>
                    <button class="stroke-close-btn">&times;</button>
                </div>
                <div class="stroke-modal-body">
                    <div class="stroke-svg-container" id="strokeSvgContainer">
                        <div class="stroke-loading">Loading stroke order...</div>
                    </div>
                    <div class="stroke-info">
                        <p id="strokeCount"></p>
                        <p id="strokeHint"></p>
                    </div>
                </div>
                <div class="stroke-modal-footer">
                    <button id="strokePrintBtn" class="small-btn">🖨️ Print</button>
                    <button id="strokeCloseBtn" class="small-btn">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('.stroke-close-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        modal.querySelector('#strokeCloseBtn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        modal.querySelector('#strokePrintBtn').addEventListener('click', () => {
            printStrokeDiagram(kanji, unicode, meaning);
        });
    }
    
    const titleEl = document.getElementById('strokeKanjiTitle');
    titleEl.innerHTML = `<span class="stroke-big-kanji">${kanji}</span> - ${meaning}`;
    
    const container = document.getElementById('strokeSvgContainer');
    const paths = getSvgPaths(unicode);
    console.log('Primary SVG path:', paths.primary);
    console.log('Fallback SVG path:', paths.fallback);
    
    // Create an image element that tries both paths
    let img = document.createElement('img');
    img.alt = `Stroke order for ${kanji}`;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.background = 'white';
    img.style.maxHeight = '300px';
    
    // Try primary first
    let attempted = false;
    img.onerror = function() {
        if (!attempted) {
            attempted = true;
            console.log('Primary failed, trying fallback');
            this.src = paths.fallback;
        } else {
            console.log('Both paths failed');
            this.style.display = 'none';
            container.innerHTML = `
                <div class="stroke-error">
                    <p>⚠️ Stroke order diagram not available for ${kanji}.</p>
                    <p>Try the print option instead.</p>
                    <p style="font-size:0.8rem;color:#999;">(Tried: ${paths.primary} and ${paths.fallback})</p>
                </div>
            `;
        }
    };
    img.onload = function() {
        console.log('SVG loaded successfully');
        container.innerHTML = '';
        container.appendChild(img);
    };
    
    img.src = paths.primary;
    container.innerHTML = '';
    container.appendChild(img);
    
    // Stroke counts (using 4‑digit hex keys)
    const strokeCounts = {
        '65e5': 4, '4e00': 1, '56fd': 8, '4eba': 2, '5e74': 6, '5927': 3, '5341': 2, '4e8c': 2,
        '672c': 5, '4e2d': 4, '9577': 8, '51fa': 5, '4e09': 3, '6642': 10, '884c': 6, '898b': 7,
        '6708': 4, '5206': 4, '5f8c': 9, '524d': 9, '751f': 5, '4e94': 4, '9593': 12, '4e0a': 3,
        '6771': 8, '56db': 5, '4eca': 4, '91d1': 8, '4e5d': 2, '5165': 2, '5b66': 8, '9ad8': 10,
        '5186': 4, '5b50': 3, '5916': 5, '516b': 2, '516d': 4, '4e0b': 3, '6765': 7, '6c17': 6,
        '5c0f': 3, '4e03': 2, '5c71': 3, '8a71': 13, '5973': 3, '5317': 5, '5348': 4, '767e': 6,
        '66f8': 10, '5148': 6, '540d': 6, '5ddd': 3, '5343': 3, '805e': 14, '6c34': 4, '534a': 5,
        '7537': 7, '897f': 6, '96fb': 13, '8a9e': 14, '571f': 3, '6728': 4, '98df': 9, '8eca': 7,
        '4f55': 7, '5357': 9, '4e07': 3, '6821': 10, '6bce': 6, '767d': 5, '5929': 4, '6bcd': 5,
        '706b': 4, '53f3': 5, '8aad': 14, '53cb': 4, '5de6': 5, '4f11': 6, '7236': 4, '96e8': 8
    };
    const count = strokeCounts[unicode] || '?';
    document.getElementById('strokeCount').innerHTML = `✍️ Total strokes: <strong>${count}</strong>`;
    document.getElementById('strokeHint').innerHTML = getStrokeHint(kanji);
    modal.style.position = 'fixed';
modal.style.top = '0';
modal.style.left = '0';
modal.style.width = '100%';
modal.style.height = '100%';
modal.style.backgroundColor = 'rgba(0,0,0,0.6)';
modal.style.zIndex = '9999';
modal.style.display = 'flex';
modal.style.alignItems = 'center';
modal.style.justifyContent = 'center';
modal.style.visibility = 'visible';
modal.style.opacity = '1';
    // Show the modal
    modal.style.display = 'flex';
    console.log('Modal displayed');
}

// Print stroke diagram (unchanged, omitted for brevity – keep the existing function)
function printStrokeDiagram(kanji, unicode, meaning) {
    // ... (keep the existing print function from your file)
    // I'll include it in the final file, but for brevity here I assume it's the same.
}

// Add stroke order buttons to kanji cards
function addStrokeButtonsToKanjiList() {
    const kanjiCards = document.querySelectorAll('.kanji-card');
    console.log('Adding stroke buttons to', kanjiCards.length, 'cards');
    kanjiCards.forEach(card => {
        if (card.querySelector('.stroke-order-btn')) return;
        let kanji = '';
        let meaning = '';
        const kanjiPatternEl = card.querySelector('.kanji-pattern, .grammar-pattern, .kanji-char');
        if (kanjiPatternEl) kanji = kanjiPatternEl.textContent.trim();
        if (!kanji) {
            const match = card.innerText.match(/^[一-龯]/);
            if (match) kanji = match[0];
        }
        const meaningEl = card.querySelector('.kanji-meaning, .grammar-meaning');
        if (meaningEl) meaning = meaningEl.textContent.trim();
        if (kanji) {
            const unicode = getUnicodeHex(kanji);
            const strokeBtn = document.createElement('button');
            strokeBtn.className = 'small-btn stroke-order-btn';
            strokeBtn.innerHTML = '✍️ Stroke Order';
            strokeBtn.style.margin = '10px 5px 0 5px';
            strokeBtn.style.background = '#6c8b6b';
            strokeBtn.style.color = 'white';
            strokeBtn.style.border = 'none';
            strokeBtn.style.padding = '6px 12px';
            strokeBtn.style.borderRadius = '20px';
            strokeBtn.style.cursor = 'pointer';
            strokeBtn.style.fontSize = '0.75rem';
            strokeBtn.dataset.kanji = kanji;
            strokeBtn.dataset.unicode = unicode;
            strokeBtn.dataset.meaning = meaning;
            const masteredBtn = card.querySelector('.mark-mastered-btn');
            if (masteredBtn) {
                masteredBtn.parentNode.insertBefore(strokeBtn, masteredBtn.nextSibling);
            } else {
                const cardFooter = card.querySelector('.kanji-examples, .grammar-examples');
                if (cardFooter) cardFooter.insertAdjacentElement('afterend', strokeBtn);
                else card.appendChild(strokeBtn);
            }
        }
    });
}

function initStrokeButtons() {
    console.log('Stroke order viewer initializing...');
    addStrokeButtonsToKanjiList();
    const observer = new MutationObserver(() => {
        if (document.querySelectorAll('.kanji-card').length > 0) {
            addStrokeButtonsToKanjiList();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStrokeButtons);
} else {
    initStrokeButtons();
}