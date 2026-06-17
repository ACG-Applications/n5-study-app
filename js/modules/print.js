// ==================== PRINT MODULE ====================
// Handles printing of sentences with kanji reference table

let currentPrintMode = 'kanji'; // 'kanji', 'furigana', 'translation'

// Get SVG filename for a kanji (5-digit format)
function getSvgFilename(kanji) {
    const unicode = kanji.codePointAt(0).toString(16);
    return unicode.padStart(5, '0') + '.svg';
}

// Extract all unique kanji from a sentence
function extractKanji(sentence) {
    // Match any CJK Unified Ideograph (kanji)
    const kanjiRegex = /[\u4e00-\u9faf\u3400-\u4dbf]/g;
    const matches = sentence.match(kanjiRegex);
    return matches ? [...new Set(matches)] : [];
}

// Extract all unique kanji from an array of sentences
function extractAllKanji(sentences) {
    const allKanji = [];
    for (const sentence of sentences) {
        const kanjiList = extractKanji(sentence.jp);
        for (const kanji of kanjiList) {
            if (!allKanji.includes(kanji)) {
                allKanji.push(kanji);
            }
        }
    }
    return allKanji;
}

// Get reading for a kanji (for display)
function getKanjiReading(kanji) {
    if (typeof kanjiData !== 'undefined') {
        const entry = kanjiData.find(k => k.kanji === kanji);
        if (entry) {
            return entry.onyomi || entry.kunyomi || '';
        }
    }
    return '';
}

// Get meaning for a kanji
function getKanjiMeaning(kanji) {
    if (typeof kanjiData !== 'undefined') {
        const entry = kanjiData.find(k => k.kanji === kanji);
        if (entry) {
            return entry.meaning;
        }
    }
    return '';
}

// Generate kanji reference table HTML
function generateKanjiTableHtml(kanjiList) {
    if (!kanjiList || kanjiList.length === 0) {
        return '';
    }
    
    // Sort kanji by stroke count (if available) or by Unicode
    const sortedKanji = [...kanjiList].sort((a, b) => {
        // Try to sort by stroke count from known data
        const strokeCounts = {
            '一': 1, '二': 2, '三': 3, '四': 5, '五': 4, '六': 4, '七': 2, '八': 2, '九': 2, '十': 2,
            '日': 4, '月': 4, '火': 4, '水': 4, '木': 4, '金': 8, '土': 3, '本': 5, '人': 2, '子': 3,
            '女': 3, '男': 7, '父': 4, '母': 5, '兄': 5, '弟': 7, '姉': 8, '妹': 8, '友': 4, '私': 7,
            '名': 6, '国': 8, '中': 4, '外': 5, '上': 3, '下': 3, '左': 5, '右': 5, '前': 9, '後': 9,
            '時': 10, '分': 4, '年': 6, '月': 4, '日': 4, '曜': 18, '週': 11, '間': 12, '今': 4, '毎': 6,
            '朝': 12, '昼': 9, '夜': 8, '午': 4, '前': 9, '後': 9, '行': 6, '来': 7, '帰': 10, '入': 2,
            '出': 5, '見': 7, '聞': 14, '言': 7, '話': 13, '読': 14, '書': 10, '食': 9, '飲': 12, '買': 12,
            '売': 7, '作': 7, '持': 9, '考': 6, '思': 9, '会': 6, '社': 7, '員': 10, '校': 10, '先': 6,
            '生': 5, '大': 3, '小': 3, '多': 6, '少': 4, '高': 10, '安': 6, '新': 13, '古': 5, '白': 5,
            '赤': 7, '青': 8, '北': 5, '南': 9, '東': 8, '西': 6, '雨': 8, '雪': 11, '天': 4, '気': 6,
            '電': 13, '車': 7, '川': 3, '山': 3, '田': 5, '林': 8, '森': 12
        };
        return (strokeCounts[a] || 99) - (strokeCounts[b] || 99);
    });
    
    // Create table with 4 columns
    let html = `
        <div class="print-kanji-reference">
            <h3>📖 Kanji Reference (Stroke Order)</h3>
            <div class="kanji-reference-grid">
    `;
    
    for (const kanji of sortedKanji) {
        const svgFilename = getSvgFilename(kanji);
        const svgPath = `images/kanji-strokes/${svgFilename}`;
        const meaning = getKanjiMeaning(kanji) || '';
        const reading = getKanjiReading(kanji) || '';
        
        html += `
            <div class="kanji-reference-item">
                <div class="kanji-reference-char">${kanji}</div>
                <div class="kanji-reference-svg">
                    <img src="${svgPath}" alt="Stroke order for ${kanji}" 
                         onerror="this.parentElement.innerHTML='<div class=\\'no-svg\\'>No SVG</div>'">
                </div>
                <div class="kanji-reference-meaning">${meaning}</div>
                <div class="kanji-reference-reading">${reading}</div>
            </div>
        `;
    }
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

// Print function - generates HTML for printing
function printSprint(sprintIndex, showFurigana, showTranslation) {
    if (typeof sprints === 'undefined' || typeof sentencesData === 'undefined') {
        console.error('Required data not loaded');
        return;
    }
    
    const sprint = sprints[sprintIndex];
    if (!sprint) return;
    
    const { start, end } = sprint;
    const title = sprint.name;
    
    // Get sentences for this sprint
    const sentences = [];
    for (let i = start; i <= end; i++) {
        if (sentencesData[i]) {
            sentences.push(sentencesData[i]);
        }
    }
    
    // Extract all unique kanji from these sentences
    const allKanji = extractAllKanji(sentences);
    
    // Build print HTML
    let printHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>N5 Japanese - ${title}</title>
            <style>
                body {
                    font-family: 'Segoe UI', 'Noto Sans', 'Hiragino Kaku Gothic Pro', sans-serif;
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 40px 20px;
                    background: white;
                    font-size: 14px;
                    line-height: 1.5;
                }
                h1 {
                    text-align: center;
                    color: #2c3e2f;
                    border-bottom: 2px solid #6c8b6b;
                    padding-bottom: 10px;
                }
                .sprint-title {
                    text-align: center;
                    color: #6c8b6b;
                    margin-bottom: 30px;
                }
                .sentence-list {
                    margin-bottom: 40px;
                }
                .sentence-item {
                    margin-bottom: 20px;
                    padding: 10px;
                    border-bottom: 1px solid #eee;
                }
                .sentence-jp {
                    font-size: 16px;
                    margin-bottom: 5px;
                }
                .sentence-en {
                    font-size: 13px;
                    color: #666;
                }
                .sentence-reading {
                    font-size: 12px;
                    color: #8a7b6e;
                    margin-bottom: 5px;
                }
                .print-kanji-reference {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #6c8b6b;
                    page-break-before: avoid;
                }
                .print-kanji-reference h3 {
                    color: #2c3e2f;
                    margin-bottom: 20px;
                }
                .kanji-reference-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    margin-top: 20px;
                }
                .kanji-reference-item {
                    text-align: center;
                    padding: 15px;
                    border: 1px solid #ddd;
                    border-radius: 12px;
                    background: #faf8f5;
                    break-inside: avoid;
                }
                .kanji-reference-char {
                    font-size: 32px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #2c3e2f;
                }
                .kanji-reference-svg {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .kanji-reference-svg img {
                    max-width: 100%;
                    max-height: 100%;
                }
                .kanji-reference-svg .no-svg {
                    font-size: 10px;
                    color: #999;
                }
                .kanji-reference-meaning {
                    font-size: 11px;
                    color: #6c8b6b;
                    margin-bottom: 4px;
                }
                .kanji-reference-reading {
                    font-size: 10px;
                    color: #8a7b6e;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    font-size: 11px;
                    color: #999;
                    border-top: 1px solid #eee;
                    padding-top: 20px;
                }
                @media print {
                    body {
                        padding: 20px;
                    }
                    .kanji-reference-grid {
                        break-inside: avoid;
                    }
                    .kanji-reference-item {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                }
                @media (max-width: 700px) {
                    .kanji-reference-grid {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 15px;
                    }
                }
                @media (max-width: 500px) {
                    .kanji-reference-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            </style>
        </head>
        <body>
            <h1>📚 N5 Japanese Study App</h1>
            <div class="sprint-title">${title}</div>
            <div class="sentence-list">
    `;
    
    // Add sentences
    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];
        let jpText = sentence.jp;
        let readingText = sentence.reading || '';
        
        // Apply furigana if needed
        if (showFurigana && readingText) {
            // Convert reading to furigana format or just show reading
            jpText = `${jpText}<br><span style="font-size: 11px; color: #8a7b6e;">${readingText}</span>`;
        } else if (!showFurigana) {
            // Strip furigana parentheses
            jpText = jpText.replace(/[（(][^）)]*[）)]/g, '');
        }
        
        printHtml += `
            <div class="sentence-item">
                <div class="sentence-jp">${start + i + 1}. ${jpText}</div>
                ${showTranslation ? `<div class="sentence-en">→ ${sentence.en}</div>` : ''}
            </div>
        `;
    }
    
    // Add kanji reference table
    if (allKanji.length > 0) {
        printHtml += generateKanjiTableHtml(allKanji);
    }
    
    printHtml += `
            </div>
            <div class="footer">
                Generated by N5 Japanese Study App · Page ${new Date().toLocaleDateString()}
            </div>
        </body>
        </html>
    `;
    
    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printHtml);
    printWindow.document.close();
    
    // Auto-print after load
    printWindow.onload = function() {
        printWindow.print();
    };
}

// Print with current sprint
function printCurrentSprint() {
    if (typeof activeSprintIndex === 'undefined') {
        console.error('No active sprint');
        return;
    }
    
    const options = {
        kanji: false,
        furigana: false,
        translation: false
    };
    
    if (currentPrintMode === 'kanji') {
        options.kanji = true;
        options.furigana = false;
        options.translation = false;
    } else if (currentPrintMode === 'furigana') {
        options.kanji = true;
        options.furigana = true;
        options.translation = false;
    } else if (currentPrintMode === 'translation') {
        options.kanji = true;
        options.furigana = true;
        options.translation = true;
    }
    
    printSprint(activeSprintIndex, options.furigana, options.translation);
}

// Event listeners for print buttons
function initPrintModule() {
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            if (typeof activeSprintIndex !== 'undefined') {
                printCurrentSprint();
            } else {
                alert('Please select a sprint first');
            }
        });
    }
    
    // Print modal buttons
    const printKanjiOnlyBtn = document.getElementById('printKanjiOnlyBtn');
    const printWithFuriganaBtn = document.getElementById('printWithFuriganaBtn');
    const printWithTranslationBtn = document.getElementById('printWithTranslationBtn');
    
    if (printKanjiOnlyBtn) {
        printKanjiOnlyBtn.addEventListener('click', () => {
            currentPrintMode = 'kanji';
            printCurrentSprint();
            const modal = document.getElementById('printModal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    if (printWithFuriganaBtn) {
        printWithFuriganaBtn.addEventListener('click', () => {
            currentPrintMode = 'furigana';
            printCurrentSprint();
            const modal = document.getElementById('printModal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    if (printWithTranslationBtn) {
        printWithTranslationBtn.addEventListener('click', () => {
            currentPrintMode = 'translation';
            printCurrentSprint();
            const modal = document.getElementById('printModal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    // Close modal button
    const closePrintBtn = document.getElementById('closePrintBtn');
    if (closePrintBtn) {
        closePrintBtn.addEventListener('click', () => {
            const modal = document.getElementById('printModal');
            if (modal) modal.style.display = 'none';
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrintModule);
} else {
    initPrintModule();
}