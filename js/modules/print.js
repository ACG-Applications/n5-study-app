// ==================== PRINT MODULE ====================
// Handles printing of sentences with kanji reference table
// Supports: Western Style and Genkouyoushi (horizontal only)

let currentPrintMode = 'kanji'; // 'kanji', 'furigana', 'translation'

// Print options state
const printOptions = {
    sentenceMode: 'kanji', // 'kanji' | 'furigana' | 'translation' | 'furigana_translation'
    includeKanjiStrokes: false,
    includeBlankWritingPaper: false,
    layoutStyle: 'western' // 'western' | 'genkouyoushi'
};

// ==================== PRINT FUNCTIONS ====================

// Open Kanji Blank Writing Paper PDF
function openBlankWritingPaperPDF() {
    const pdfPath = 'Kanji Blank Writing Paper.pdf';
    const win = window.open(pdfPath, '_blank');
    if (!win) {
        window.location.href = pdfPath;
    }
}

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

// ==================== RUBY CONVERSION FUNCTION ====================

function convertToRubyHtml(text) {
    // Convert 漢字（かんじ） to <ruby>漢字<rt>かんじ</rt></ruby>
    // Handles both Japanese parentheses （） and Western parentheses ()
    let result = text;
    
    // Pattern: kanji characters followed by furigana in parentheses
    // Matches: 漢字（かんじ） or 漢字(かんじ)
    const pattern = /([\u4e00-\u9faf\u3400-\u4dbf]+)[（(]([^）)]+)[）)]/g;
    
    result = result.replace(pattern, (match, kanji, furigana) => {
        return `<ruby>${kanji}<rt>${furigana}</rt></ruby>`;
    });
    
    return result;
}

// ==================== GENKOUYOUSHI CSS ====================

function getGenkouyoushiCSS() {
    return `
        @page {
            size: A4 portrait;
            margin: 12mm 10mm 12mm 10mm;
        }
        
        body {
            font-family: 'MS Mincho', 'KaiTi', 'SimSun', 'Noto Sans CJK JP', serif;
            background: white;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
            font-size: 12pt;
            line-height: 1.6;
        }
        
        .genkouyoushi-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 5px;
        }
        
        .genkouyoushi-header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 6px;
            margin-bottom: 12px;
        }
        
        .genkouyoushi-header h1 {
            font-size: 16pt;
            margin: 0;
            font-weight: bold;
            letter-spacing: 2px;
        }
        
        .genkouyoushi-header .subtitle {
            font-size: 10pt;
            color: #555;
            margin-top: 2px;
        }
        
        .genkouyoushi-grid {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 6px 8px;
        }
        
        .sentence-block {
            display: flex;
            flex-direction: column;
            padding: 6px 8px;
            border: 1px solid #e8e8e8;
            border-radius: 3px;
            background: white;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        
        .sentence-block .sentence-number {
            font-size: 8pt;
            color: #888;
            margin-bottom: 2px;
            font-weight: 500;
        }
        
        .char-row {
            display: flex;
            flex-wrap: wrap;
            gap: 1px;
        }
        
        .char-cell {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border: 1px solid #d0d0d0;
            margin: 0.5px;
            font-size: 16pt;
            line-height: 32px;
            text-align: center;
            background: white;
            font-weight: 500;
            font-family: 'MS Mincho', 'KaiTi', 'SimSun', serif;
        }
        
        .char-cell .char-main {
            font-size: 14pt;
            line-height: 1.2;
        }
        
        .char-cell.punctuation {
            font-size: 12pt;
            color: #333;
        }
        
        .translation-text {
            font-size: 9pt;
            color: #555;
            margin-top: 4px;
            font-family: 'Segoe UI', sans-serif;
            padding-left: 4px;
            font-style: italic;
        }
        
        .print-kanji-reference {
            margin-top: 25px;
            padding-top: 12px;
            border-top: 2px solid #333;
            page-break-before: auto;
        }
        
        .print-kanji-reference h3 {
            text-align: center;
            font-size: 13pt;
            margin-bottom: 12px;
            letter-spacing: 2px;
        }
        
        .kanji-reference-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-top: 8px;
        }
        
        .kanji-reference-item {
            text-align: center;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            background: #faf8f5;
            page-break-inside: avoid;
            break-inside: avoid;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 150px;
        }
        
        .kanji-reference-char {
            font-size: 26pt;
            font-weight: bold;
            margin-bottom: 3px;
            color: #2c3e2f;
        }
        
        .kanji-reference-svg {
            width: 70px;
            height: 70px;
            margin: 0 auto 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            border-radius: 4px;
            border: 1px solid #eee;
        }
        
        .kanji-reference-svg img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        
        .kanji-reference-svg .no-svg {
            font-size: 8pt;
            color: #999;
        }
        
        .kanji-reference-meaning {
            font-size: 8pt;
            color: #6c8b6b;
            font-weight: 500;
        }
        
        .kanji-reference-reading {
            font-size: 7pt;
            color: #8a7b6e;
        }
        
        .kanji-reference-strokes {
            font-size: 6pt;
            color: #999;
            margin-top: 2px;
        }
        
        .genkouyoushi-footer {
            text-align: center;
            margin-top: 25px;
            font-size: 7pt;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        
        @media print {
            body { padding: 0; margin: 0; }
            .genkouyoushi-container { padding: 3px; }
            .sentence-block {
                break-inside: avoid;
                page-break-inside: avoid;
            }
            .kanji-reference-item {
                break-inside: avoid;
                page-break-inside: avoid;
            }
        }
        
        @media (max-width: 700px) {
            .char-cell {
                width: 26px;
                height: 26px;
                font-size: 12pt;
                line-height: 26px;
            }
            .char-cell .char-main {
                font-size: 11pt;
            }
            .kanji-reference-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }
        
        @media (max-width: 500px) {
            .char-cell {
                width: 20px;
                height: 20px;
                font-size: 10pt;
                line-height: 20px;
            }
            .char-cell .char-main {
                font-size: 9pt;
            }
            .kanji-reference-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    `;
}

// ==================== GENKOUYOUSHI GENERATION ====================

function splitTextIntoChars(text) {
    const chars = [];
    let i = 0;
    while (i < text.length) {
        if (
            i + 1 < text.length &&
            /[\u4e00-\u9faf]/.test(text[i]) &&
            text[i + 1] === '（'
        ) {
            const start = i;
            let end = text.indexOf('）', i + 2);
            if (end !== -1) {
                const kanji = text.substring(i, i + 1);
                const furigana = text.substring(i + 2, end);
                chars.push({
                    type: 'kanji_with_furigana',
                    kanji: kanji,
                    furigana: furigana,
                    full: text.substring(start, end + 1),
                    length: end - start + 1
                });
                i = end + 1;
                continue;
            }
        }
        chars.push({
            type: 'char',
            char: text[i],
            length: 1
        });
        i++;
    }
    return chars;
}

function generateGenkouyoushiHorizontal(sentence, index) {
    const chars = splitTextIntoChars(sentence.jp);
    let html = `<div class="sentence-block">`;
    html += `<div class="sentence-number">${index + 1}.</div>`;
    html += `<div class="char-row">`;
    
    for (const char of chars) {
        if (char.type === 'kanji_with_furigana') {
            html += `<span class="char-cell">`;
            html += `<span class="char-main">${char.kanji}</span>`;
            html += `</span>`;
        } else {
            const isPunctuation = /[、。．，！？]/.test(char.char);
            html += `<span class="char-cell${isPunctuation ? ' punctuation' : ''}">`;
            html += char.char;
            html += `</span>`;
        }
    }
    
    html += `</div>`;
    html += `</div>`;
    return html;
}

function generateGenkouyoushiHTML(sprintIndex, options) {
    if (typeof sprints === 'undefined' || typeof sentencesData === 'undefined') {
        console.error('Required data not loaded');
        return null;
    }

    const sprint = sprints[sprintIndex];
    if (!sprint) return null;

    const { start, end } = sprint;
    const title = sprint.name || `Sprint ${sprintIndex + 1}`;

    const sentences = [];
    for (let i = start; i <= end; i++) {
        if (sentencesData[i]) sentences.push(sentencesData[i]);
    }

    const allKanji = extractAllKanji(sentences);
    const showTranslation = options.sentenceMode === 'translation';

    let printHtml = `<!DOCTYPE html>
        <html><head><meta charset="UTF-8"><title>N5 Japanese - ${title}</title>
        <style>${getGenkouyoushiCSS()}</style>
        </head><body>
            <div class="genkouyoushi-container">
                
                <div class="genkouyoushi-header">
                    <h1>${title}</h1>
                    <div class="subtitle">N5 Japanese · Genkouyoushi · ${sentences.length} sentences</div>
                </div>
                
                <div class="genkouyoushi-grid">`;

    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];
        printHtml += generateGenkouyoushiHorizontal(sentence, i);

        if (showTranslation && sentence.translation) {
            printHtml += `<div class="translation-text">→ ${sentence.translation}</div>`;
        }
    }

    printHtml += `</div>`;

    if (options.includeKanjiStrokes && allKanji.length > 0) {
        printHtml += generateKanjiTableHtml(allKanji);
    }

    printHtml += `
                <div class="genkouyoushi-footer">
                    Generated by N5 Japanese Study App · ${new Date().toLocaleDateString()}
                </div>
            </div>
        </body></html>`;

    return printHtml;
}

// ==================== WESTERN STYLE PRINT - WITH RUBY FURIGANA ====================

function generateWesternPrintHTML(sprintIndex, options, isKanjiOnly = false) {
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
            
            /* ============================================================
               BODY BACKGROUND & FONT COLOR - Change these values
               ============================================================
               background: Page background color - change to #f5f0eb for warm cream
               color: Main text color - change to #1a1a1a for darker text
               font-size: Base font size for the entire page
            */
            body { 
                font-family: 'Segoe UI', 'Noto Sans', 'Hiragino Kaku Gothic Pro', sans-serif; 
                max-width: 1000px; 
                margin: 0 auto; 
                padding: 20px; 
                background: white; 
                font-size: 14px; 
                line-height: 2.2; 
                color: #2c3e2f;
            }
            
            /* ============================================================
               TITLE FONT SIZE & COLOR - Change these values
               ============================================================
               font-size: 24px = title size - increase to 28px or 30px for larger title
               color: #2c3e2f = title color - change to #1a1a1a for darker
               border-bottom: 2px solid #6c8b6b = underline color
            */
            h1 { 
                text-align: center; 
                color: #2c3e2f; 
                border-bottom: 2px solid #6c8b6b; 
                padding-bottom: 10px; 
                margin-bottom: 10px;
                font-size: 24px;
            }
            
            /* ============================================================
               SPRINT TITLE FONT SIZE & COLOR - Change these values
               ============================================================
               font-size: 18px = sprint name size - increase to 20px or 22px
               color: #6c8b6b = sprint name color - change to #4a6741 for darker green
            */
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
            
            /* ============================================================
               JAPANESE SENTENCE FONT SIZE - Change this value
               ============================================================
               Default: 18px
               - Increase to 20px or 22px for larger Japanese text
               - Decrease to 16px for smaller Japanese text
               - font-family: Can change to 'Noto Serif JP' for serif style
            */
            .sentence-jp { 
                font-size: 18px; 
                margin-bottom: 3px; 
                line-height: 2.4;
                font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic Pro', 'Yu Gothic', 'Meiryo', sans-serif;
            }
            
            /* ============================================================
               FURIGANA (RUBY) FONT SIZE & COLOR - Change these values
               ============================================================
               font-size: 0.55em = furigana size relative to .sentence-jp
                 - Increase to 0.65em or 0.7em for larger furigana
                 - Decrease to 0.45em for smaller furigana
               color: #8b0000 = furigana color (dark red)
                 - Change to #555 for gray, #0066cc for blue, #2c3e2f for same as text
               font-weight: 400 = furigana weight - change to 300 for lighter, 600 for bold
               letter-spacing: 0.5px = spacing between furigana characters
            */
            .sentence-jp ruby {
                ruby-align: center;
            }
            
            .sentence-jp ruby rt {
                font-size: 0.55em;
                color: #8b0000;
                font-weight: 400;
                letter-spacing: 0.5px;
            }
            
            /* ============================================================
               ENGLISH TRANSLATION FONT SIZE & COLOR - Change these values
               ============================================================
               font-size: 13px = English text size
                 - Increase to 15px or 16px for larger English text
                 - Decrease to 11px for smaller English text
               color: #666 = English text color - change to #333 for darker
               font-family: English font - change to 'Inter', 'Roboto', etc.
            */
            .sentence-en { 
                font-size: 13px; 
                color: #666; 
                margin-top: 4px;
                font-family: 'Segoe UI', 'Inter', sans-serif;
            }
            
            /* ============================================================
               KANJI REFERENCE SECTION - Change these values
               ============================================================
               margin-top: 30px = spacing above reference
               border-top: 2px solid #6c8b6b = border color
            */
            .print-kanji-reference { 
                margin-top: 30px; 
                padding-top: 15px; 
                border-top: 2px solid #6c8b6b; 
                page-break-before: auto;
            }
            
            /* ============================================================
               KANJI REFERENCE TITLE - Change these values
               ============================================================
               font-size: 18px = title size - increase to 20px
               color: #2c3e2f = title color
            */
            .print-kanji-reference h3 { 
                color: #2c3e2f; 
                margin-bottom: 15px; 
                font-size: 18px;
                page-break-after: avoid;
            }
            
            /* ============================================================
               KANJI REFERENCE GRID - Change these values
               ============================================================
               grid-template-columns: repeat(4, 1fr) = 4 columns
                 - Change to repeat(3, 1fr) for 3 columns (larger items)
                 - Change to repeat(2, 1fr) for 2 columns (even larger)
               gap: 15px = spacing between items - increase for more breathing room
            */
            .kanji-reference-grid { 
                display: grid; 
                grid-template-columns: repeat(4, 1fr); 
                gap: 15px; 
                margin-top: 15px; 
            }
            
            /* ============================================================
               KANJI REFERENCE ITEM - Change these values
               ============================================================
               background: #faf8f5 = item background (warm cream)
                 - Change to #f0ebe3 for darker, #ffffff for white
               border: 1px solid #ddd = border color
               border-radius: 8px = roundness - increase for more rounded
               padding: 12px = inner spacing
            */
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
            
            /* ============================================================
               KANJI CHARACTER IN REFERENCE - Change these values
               ============================================================
               font-size: 32px = kanji size - increase to 36px or 40px
               color: #2c3e2f = kanji color
            */
            .kanji-reference-char { 
                font-size: 32px; 
                font-weight: bold; 
                margin-bottom: 8px; 
                color: #2c3e2f; 
            }
            
            /* ============================================================
               KANJI REFERENCE SVG CONTAINER - Change these values
               ============================================================
               width: 70px = SVG width - increase to 80px or 90px
               height: 70px = SVG height - increase to 80px or 90px
               background: white = SVG background color
            */
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
            
            /* ============================================================
               KANJI MEANING & READING - Change these values
               ============================================================
               font-size: 11px = meaning size
               color: #6c8b6b = meaning color (green)
               font-size: 10px = reading size
               color: #8a7b6e = reading color (warm gray)
            */
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
            
            /* ============================================================
               FOOTER TEXT - Change these values
               ============================================================
               font-size: 11px = footer size
               color: #999 = footer color (light gray)
            */
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
            
            /* ============================================================
               RESPONSIVE FONT SIZES - Change these values
               ============================================================
               These control how the page looks on smaller screens
            */
            @media (max-width: 700px) { 
                .kanji-reference-grid { 
                    grid-template-columns: repeat(3, 1fr); 
                    gap: 12px; 
                }
                .kanji-reference-item {
                    min-height: 160px;
                }
                .sentence-jp {
                    font-size: 16px;
                }
            }
            
            @media (max-width: 500px) { 
                .kanji-reference-grid { 
                    grid-template-columns: repeat(2, 1fr); 
                }
                .kanji-reference-item {
                    min-height: 150px;
                }
                .sentence-jp {
                    font-size: 14px;
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
        // ============================================================
        // DISPLAY LOGIC - How each option works:
        // ============================================================
        // kanji:                 Just the kanji text (no furigana, no translation)
        // furigana:              Kanji + Furigana (no translation)
        // translation:           Kanji + Translation (no furigana)
        // furigana_translation:  Kanji + Furigana + Translation (ALL)
        // ============================================================
        
        // showFurigana is true when 'furigana' OR 'furigana_translation' is selected
        const showFurigana = options.sentenceMode === 'furigana' || options.sentenceMode === 'furigana_translation';
        // showTranslation is true when 'translation' OR 'furigana_translation' is selected
        const showTranslation = options.sentenceMode === 'translation' || options.sentenceMode === 'furigana_translation';
        
        for (let i = 0; i < sentences.length; i++) {
            const sentence = sentences[i];
            let jpText = sentence.jp;
            
            if (!showFurigana) {
                // Remove furigana entirely (strip parentheses and their contents)
                jpText = jpText.replace(/[（(][^）)]*[）)]/g, '');
            } else {
                // Convert (furigana) to <ruby> tags for printing
                jpText = convertToRubyHtml(jpText);
            }
            
            printHtml += `<div class="sentence-item">
                    <div class="sentence-jp">${start + i + 1}. ${jpText}</div>`;
            
            // Only show translation if selected
            if (showTranslation && sentence.translation) {
                printHtml += `<div class="sentence-en">→ ${sentence.translation}</div>`;
            }
            
            printHtml += `</div>`;
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

// ==================== KANJI REFERENCE TABLE ====================

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

// ==================== EXPORT FUNCTIONS ====================

function exportPrint(htmlContent) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow popups for this site.');
        return;
    }
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = function() { 
        printWindow.print(); 
    };
}

function printSprint(sprintIndex, options, isKanjiOnly = false) {
    let htmlContent;
    
    if (options.layoutStyle === 'genkouyoushi') {
        htmlContent = generateGenkouyoushiHTML(sprintIndex, options);
    } else {
        htmlContent = generateWesternPrintHTML(sprintIndex, options, isKanjiOnly);
    }
    
    if (!htmlContent) {
        alert('Error generating content. Please try again.');
        return;
    }
    exportPrint(htmlContent);
}

function printCurrentSprint() {
    if (typeof activeSprintIndex === 'undefined' || activeSprintIndex === null) {
        alert('Please select a sprint first');
        return;
    }
    printSprint(activeSprintIndex, printOptions, false);
}

function printKanjiStrokesOnly() {
    if (typeof activeSprintIndex === 'undefined' || activeSprintIndex === null) {
        alert('Please select a sprint first');
        return;
    }
    const kanjiOnlyOptions = {
        sentenceMode: 'kanji',
        includeKanjiStrokes: true,
        includeBlankWritingPaper: false,
        layoutStyle: printOptions.layoutStyle || 'western'
    };
    printSprint(activeSprintIndex, kanjiOnlyOptions, true);
}

// ==================== UI HELPERS ====================

function updatePrintUI() {
    const isGenkouyoushi = printOptions.layoutStyle === 'genkouyoushi';
    
    // Show/hide genkouyoushi note
    const note = document.getElementById('genkouyoushiNote');
    if (note) {
        note.style.display = isGenkouyoushi ? 'block' : 'none';
    }
    
    // Enable/disable Furigana option in Genkouyoushi mode
    // In Genkouyoushi: Only Kanji Only or Kanji + Translation
    // In Western: All options available
    const furiganaOption = document.getElementById('furiganaOption');
    if (furiganaOption) {
        const furiganaRadio = furiganaOption.querySelector('input[type="radio"]');
        if (isGenkouyoushi) {
            // Disable Furigana in Genkouyoushi mode
            furiganaOption.style.opacity = '0.4';
            furiganaOption.style.cursor = 'not-allowed';
            if (furiganaRadio) {
                furiganaRadio.disabled = true;
                // If Furigana was selected, switch to Kanji Only
                if (furiganaRadio.checked) {
                    const kanjiRadio = document.querySelector('input[name="sentenceMode"][value="kanji"]');
                    if (kanjiRadio) {
                        kanjiRadio.checked = true;
                        printOptions.sentenceMode = 'kanji';
                    }
                }
            }
        } else {
            // Enable Furigana in Western mode
            furiganaOption.style.opacity = '1';
            furiganaOption.style.cursor = 'pointer';
            if (furiganaRadio) {
                furiganaRadio.disabled = false;
            }
        }
    }
}

// ========== EVENT LISTENERS ==========

function initPrintModule() {
    console.log('Initializing print module...');
    
    // Get active sprint index from UI
    const sprintSelect = document.getElementById('sprintSelect');
    if (sprintSelect) {
        activeSprintIndex = parseInt(sprintSelect.value) || 0;
        sprintSelect.addEventListener('change', function() {
            activeSprintIndex = parseInt(this.value) || 0;
            console.log('Active sprint changed to:', activeSprintIndex);
        });
    }
    
    // Print button - opens the modal
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            console.log('Print button clicked');
            const sprintSelect = document.getElementById('sprintSelect');
            if (sprintSelect) {
                activeSprintIndex = parseInt(sprintSelect.value) || 0;
            }
            if (activeSprintIndex !== undefined && activeSprintIndex !== null) {
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
    
    // Layout style radio buttons
    const layoutRadios = document.querySelectorAll('input[name="layoutStyle"]');
    console.log('Found layout radios:', layoutRadios.length);
    layoutRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            printOptions.layoutStyle = e.target.value;
            console.log('Layout style changed to:', printOptions.layoutStyle);
            updatePrintUI();
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
    
    // Blank Writing Paper checkbox
    const blankPaperCheckbox = document.getElementById('includeBlankWritingPaper');
    if (blankPaperCheckbox) {
        blankPaperCheckbox.addEventListener('change', (e) => {
            printOptions.includeBlankWritingPaper = e.target.checked;
            console.log('Include blank writing paper:', printOptions.includeBlankWritingPaper);
        });
    } else {
        console.error('Blank writing paper checkbox not found');
    }
    
    // Print action button
    const actionBtn = document.getElementById('printActionBtn');
    if (actionBtn) {
        // Remove existing listeners to prevent duplicates
        const newActionBtn = actionBtn.cloneNode(true);
        actionBtn.parentNode.replaceChild(newActionBtn, actionBtn);
        
        newActionBtn.addEventListener('click', () => {
            console.log('Print action button clicked');
            console.log('Current options:', printOptions);
            
            // Open blank writing paper PDF if checked
            if (printOptions.includeBlankWritingPaper) {
                console.log('Opening blank writing paper PDF...');
                openBlankWritingPaperPDF();
            }
            
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
        const newKanjiBtn = kanjiStrokesBtn.cloneNode(true);
        kanjiStrokesBtn.parentNode.replaceChild(newKanjiBtn, kanjiStrokesBtn);
        
        newKanjiBtn.addEventListener('click', () => {
            console.log('Kanji Strokes Only button clicked');
            printKanjiStrokesOnly();
            const modal = document.getElementById('printModal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    // Cancel buttons
    const cancelBtn = document.getElementById('cancelPrintBtn');
    if (cancelBtn) {
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        
        newCancelBtn.addEventListener('click', () => {
            const modal = document.getElementById('printModal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    const cancelBtn2 = document.getElementById('cancelPrintBtn2');
    if (cancelBtn2) {
        const newCancelBtn2 = cancelBtn2.cloneNode(true);
        cancelBtn2.parentNode.replaceChild(newCancelBtn2, cancelBtn2);
        
        newCancelBtn2.addEventListener('click', () => {
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
    
    // Initialize UI state
    updatePrintUI();
    
    console.log('Print module initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrintModule);
} else {
    initPrintModule();
}