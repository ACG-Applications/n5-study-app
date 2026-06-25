// ==================== PRINT MODULE ====================
// Handles printing of sentences with kanji reference table

let currentPrintMode = 'kanji'; // 'kanji', 'furigana', 'translation'

// Print options state
const printOptions = {
    sentenceMode: 'kanji', // 'kanji' | 'furigana' | 'translation'
    includeKanjiStrokes: false,
    exportFormat: 'print' // 'print' | 'pdf'
};

// ==================== PRINT FUNCTIONS ====================

// Get SVG filename for a kanji (5-digit format - UPPERCASE)
function getSvgFilename(kanji) {
    const unicode = kanji.codePointAt(0).toString(16).toUpperCase();
    return unicode.padStart(5, '0') + '.svg';
}

// Extract all unique kanji from a sentence
function extractKanji(sentence) {
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

// Get reading for a kanji
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

// Generate kanji reference table HTML with improved pagination
function generateKanjiTableHtml(kanjiList) {
    if (!kanjiList || kanjiList.length === 0) return '';
    
    const sortedKanji = [...kanjiList].sort((a, b) => {
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
    
    let html = `<div class="print-kanji-reference">
            <h3>📖 Kanji Reference (Stroke Order)</h3>
            <div class="kanji-reference-grid">`;
    
    // Group kanji into rows of 4 for better pagination
    for (let i = 0; i < sortedKanji.length; i++) {
        const kanji = sortedKanji[i];
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
            </div>`;
    }
    
    html += `</div></div>`;
    return html;
}

// Generate print HTML content with improved pagination
function generatePrintHTML(sprintIndex, options, isKanjiOnly = false) {
    if (typeof sprints === 'undefined' || typeof sentencesData === 'undefined') {
        console.error('Required data not loaded');
        return null;
    }
    
    const sprint = sprints[sprintIndex];
    if (!sprint) return null;
    
    const { start, end } = sprint;
    const title = sprint.name;
    
    const sentences = [];
    for (let i = start; i <= end; i++) {
        if (sentencesData[i]) sentences.push(sentencesData[i]);
    }
    
    const allKanji = extractAllKanji(sentences);
    
    let printHtml = `<!DOCTYPE html>
        <html><head><meta charset="UTF-8"><title>N5 Japanese - ${title}</title>
        <style>
            /* Page setup */
            @page {
                size: A4;
                margin: 15mm 12mm 15mm 12mm;
            }
            
            body { 
                font-family: 'Segoe UI', 'Noto Sans', 'Hiragino Kaku Gothic Pro', sans-serif; 
                max-width: 1000px; 
                margin: 0 auto; 
                padding: 20px; 
                background: white; 
                font-size: 14px; 
                line-height: 1.5; 
                color: #2c3e2f;
            }
            
            h1 { 
                text-align: center; 
                color: #2c3e2f; 
                border-bottom: 2px solid #6c8b6b; 
                padding-bottom: 10px; 
                margin-bottom: 10px;
                font-size: 24px;
            }
            
            .sprint-title { 
                text-align: center; 
                color: #6c8b6b; 
                margin-bottom: 25px; 
                font-size: 18px;
            }
            
            .sentence-list { 
                margin-bottom: 30px; 
            }
            
            .sentence-item { 
                margin-bottom: 15px; 
                padding: 8px 10px; 
                border-bottom: 1px solid #eee; 
                page-break-inside: avoid;
            }
            
            .sentence-jp { 
                font-size: 16px; 
                margin-bottom: 3px; 
            }
            
            .sentence-en { 
                font-size: 13px; 
                color: #666; 
            }
            
            /* Kanji Reference - Improved Pagination */
            .print-kanji-reference { 
                margin-top: 30px; 
                padding-top: 15px; 
                border-top: 2px solid #6c8b6b; 
                page-break-before: auto;
            }
            
            .print-kanji-reference h3 { 
                color: #2c3e2f; 
                margin-bottom: 15px; 
                font-size: 18px;
                page-break-after: avoid;
            }
            
            .kanji-reference-grid { 
                display: grid; 
                grid-template-columns: repeat(4, 1fr); 
                gap: 15px; 
                margin-top: 15px; 
            }
            
            .kanji-reference-item { 
                text-align: center; 
                padding: 12px; 
                border: 1px solid #ddd; 
                border-radius: 8px; 
                background: #faf8f5; 
                page-break-inside: avoid;
                break-inside: avoid;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-height: 180px;
            }
            
            .kanji-reference-char { 
                font-size: 32px; 
                font-weight: bold; 
                margin-bottom: 8px; 
                color: #2c3e2f; 
            }
            
            .kanji-reference-svg { 
                width: 70px; 
                height: 70px; 
                margin: 0 auto 8px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                background: white;
                border-radius: 4px;
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
                margin-bottom: 3px; 
                font-weight: 500;
            }
            
            .kanji-reference-reading { 
                font-size: 10px; 
                color: #8a7b6e; 
            }
            
            .footer { 
                text-align: center; 
                margin-top: 30px; 
                font-size: 11px; 
                color: #999; 
                border-top: 1px solid #eee; 
                padding-top: 15px; 
            }
            
            /* Print-specific styles */
            @media print { 
                body { 
                    padding: 0; 
                    margin: 0;
                }
                
                .kanji-reference-grid { 
                    break-inside: auto;
                    page-break-inside: auto;
                }
                
                .kanji-reference-item { 
                    break-inside: avoid;
                    page-break-inside: avoid;
                    border-color: #ccc;
                }
                
                .sentence-item {
                    break-inside: avoid;
                    page-break-inside: avoid;
                }
                
                .print-kanji-reference {
                    break-inside: auto;
                    page-break-inside: auto;
                }
            }
            
            /* Responsive */
            @media (max-width: 700px) { 
                .kanji-reference-grid { 
                    grid-template-columns: repeat(3, 1fr); 
                    gap: 12px; 
                }
                .kanji-reference-item {
                    min-height: 160px;
                }
            }
            
            @media (max-width: 500px) { 
                .kanji-reference-grid { 
                    grid-template-columns: repeat(2, 1fr); 
                }
                .kanji-reference-item {
                    min-height: 150px;
                }
            }
        </style>
        </head><body>
            <h1>📚 N5 Japanese Study App</h1>
            <div class="sprint-title">${title}</div>
            <div class="sentence-list">`;
    
    // If kanji-only mode, only show the kanji reference
    if (isKanjiOnly) {
        printHtml += `<p style="text-align:center;color:#6c8b6b;margin-bottom:20px;">Stroke Order Reference for all kanji in this sprint</p>`;
        printHtml += `</div>`; // Close sentence-list
        if (allKanji.length > 0) {
            printHtml += generateKanjiTableHtml(allKanji);
        } else {
            printHtml += `<p style="text-align:center;color:#999;">No kanji found in this sprint.</p>`;
        }
    } else {
        // Regular sentence printing
        const showFurigana = options.sentenceMode === 'furigana' || options.sentenceMode === 'translation';
        const showTranslation = options.sentenceMode === 'translation';
        
        for (let i = 0; i < sentences.length; i++) {
            const sentence = sentences[i];
            let jpText = sentence.jp;
            
            if (!showFurigana) {
                jpText = jpText.replace(/[（(][^）)]*[）)]/g, '');
            }
            
            printHtml += `<div class="sentence-item">
                    <div class="sentence-jp">${start + i + 1}. ${jpText}</div>
                    ${showTranslation ? `<div class="sentence-en">→ ${sentence.translation}</div>` : ''}
                </div>`;
        }
        
        printHtml += `</div>`; // Close sentence-list
        
        if (options.includeKanjiStrokes && allKanji.length > 0) {
            printHtml += generateKanjiTableHtml(allKanji);
        }
    }
    
    printHtml += `
            <div class="footer">Generated by N5 Japanese Study App · ${new Date().toLocaleDateString()}</div>
        </body></html>`;
    
    return printHtml;
}

// ========== EXPORT FUNCTIONS ==========

function exportPrint(htmlContent) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = function() { 
        printWindow.print(); 
    };
}

function exportPDF(htmlContent) {
    // PDF is handled by the browser's "Save as PDF" option in the print dialog
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = function() { 
        printWindow.print(); 
    };
}

function printSprint(sprintIndex, options, isKanjiOnly = false) {
    const htmlContent = generatePrintHTML(sprintIndex, options, isKanjiOnly);
    if (!htmlContent) {
        alert('Error generating content. Please try again.');
        return;
    }
    
    // Both 'print' and 'pdf' use the same print dialog
    // User can select "Save as PDF" from the print dialog
    exportPrint(htmlContent);
}

function printCurrentSprint() {
    if (typeof activeSprintIndex === 'undefined') {
        alert('Please select a sprint first');
        return;
    }
    printSprint(activeSprintIndex, printOptions, false);
}

function printKanjiStrokesOnly() {
    if (typeof activeSprintIndex === 'undefined') {
        alert('Please select a sprint first');
        return;
    }
    // Override: set to kanji-only mode
    const kanjiOnlyOptions = {
        sentenceMode: 'kanji',
        includeKanjiStrokes: true,
        exportFormat: 'print'
    };
    printSprint(activeSprintIndex, kanjiOnlyOptions, true);
}

// ========== EVENT LISTENERS ==========

function initPrintModule() {
    console.log('Initializing print module...');
    
    // Print button - opens the modal
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            console.log('Print button clicked');
            if (typeof activeSprintIndex !== 'undefined') {
                const modal = document.getElementById('printModal');
                if (modal) {
                    modal.style.display = 'flex';
                    console.log('Modal opened');
                } else {
                    console.error('Modal not found');
                    alert('Print options not available. Please refresh the page.');
                }
            } else {
                alert('Please select a sprint first');
            }
        });
    } else {
        console.error('Print button not found');
    }
    
    // Sentence mode radio buttons
    const sentenceRadios = document.querySelectorAll('input[name="sentenceMode"]');
    console.log('Found sentence radios:', sentenceRadios.length);
    sentenceRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            printOptions.sentenceMode = e.target.value;
            console.log('Sentence mode changed to:', printOptions.sentenceMode);
        });
    });
    
    // Kanji strokes checkbox
    const strokesCheckbox = document.getElementById('includeKanjiStrokes');
    if (strokesCheckbox) {
        strokesCheckbox.addEventListener('change', (e) => {
            printOptions.includeKanjiStrokes = e.target.checked;
            console.log('Include kanji strokes:', printOptions.includeKanjiStrokes);
        });
    } else {
        console.error('Strokes checkbox not found');
    }
    
    // Print action button
    const actionBtn = document.getElementById('printActionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', () => {
            console.log('Print action button clicked');
            console.log('Current options:', printOptions);
            printCurrentSprint();
            const modal = document.getElementById('printModal');
            if (modal) modal.style.display = 'none';
        });
    } else {
        console.error('Action button not found');
    }
    
    // Kanji Strokes Only button
    const kanjiStrokesBtn = document.getElementById('printKanjiStrokesBtn');
    if (kanjiStrokesBtn) {
        kanjiStrokesBtn.addEventListener('click', () => {
            console.log('Kanji Strokes Only button clicked');
            printKanjiStrokesOnly();
            const modal = document.getElementById('printModal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    // Cancel button
    const cancelBtn = document.getElementById('cancelPrintBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            const modal = document.getElementById('printModal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    // Close button (keeping for compatibility)
    const closeBtn = document.getElementById('closePrintBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const modal = document.getElementById('printModal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    // Click outside to close
    const modal = document.getElementById('printModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    console.log('Print module initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrintModule);
} else {
    initPrintModule();
}