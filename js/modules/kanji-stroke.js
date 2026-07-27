// ==================== KANJI STROKE ORDER VIEWER ====================

// Get Unicode hex for a kanji character - returns uppercase
function getUnicodeHex(kanji) {
    return kanji.codePointAt(0).toString(16).toUpperCase();
}

// Get both 4-digit and 5-digit versions
function getSvgPaths(unicode) {
    const cleanUnicode = String(unicode).trim().toUpperCase();
    const padded4 = cleanUnicode;
    const padded5 = cleanUnicode.padStart(5, '0');
    
    console.log('📁 SVG Paths:', {
        unicode: cleanUnicode,
        padded4: padded4,
        padded5: padded5,
        primary: `images/kanji-strokes/${padded5.toUpperCase()}.svg`,
        fallback: `images/kanji-strokes/${padded4.toUpperCase()}.svg`
    });
    
    return {
        primary: `images/kanji-strokes/${padded5.toUpperCase()}.svg`,
        fallback: `images/kanji-strokes/${padded4.toUpperCase()}.svg`
    };
}

function getStrokeHint(kanji) {
    const hints = {
        '日': 'Box shape, then horizontal line inside',
        '一': 'Single horizontal line from left to right',
        '二': 'Two horizontal lines, top then bottom',
        '三': 'Three horizontal lines, top to bottom',
        '四': 'Enclosure, then inside, then close',
        '五': 'Horizontal, then vertical, then horizontal, then vertical',
        '六': 'Top point, then horizontal, then bottom',
        '七': 'Horizontal, then vertical with hook',
        '八': 'Left to right, like an upside-down V',
        '九': 'Left stroke, then right hook',
        '十': 'Horizontal, then vertical through center',
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

// Stroke counts lookup using kanji character
function getStrokeCount(kanji) {
    const strokeCounts = {
        '一': 1, '二': 2, '三': 3, '四': 5, '五': 4,
        '六': 4, '七': 2, '八': 2, '九': 2, '十': 2,
        '日': 4, '月': 4, '火': 4, '水': 4, '木': 4,
        '金': 8, '土': 3, '本': 5, '人': 2, '子': 3,
        '女': 3, '男': 7, '父': 4, '母': 5, '兄': 5,
        '弟': 7, '姉': 8, '妹': 8, '友': 4, '私': 7,
        '名': 6, '国': 8, '中': 4, '外': 5, '上': 3,
        '下': 3, '左': 5, '右': 5, '前': 9, '後': 9,
        '時': 10, '分': 4, '年': 6, '曜': 18, '週': 11,
        '間': 12, '今': 4, '毎': 6, '朝': 12, '昼': 9,
        '夜': 8, '午': 4, '行': 6, '来': 7, '帰': 10,
        '入': 2, '出': 5, '見': 7, '聞': 14, '言': 7,
        '話': 13, '読': 14, '書': 10, '食': 9, '飲': 12,
        '買': 12, '売': 7, '作': 7, '持': 9, '考': 6,
        '思': 9, '会': 6, '社': 7, '員': 10, '校': 10,
        '先': 6, '生': 5, '大': 3, '小': 3, '多': 6,
        '少': 4, '高': 10, '安': 6, '新': 13, '古': 5,
        '白': 5, '赤': 7, '青': 8, '北': 5, '南': 9,
        '東': 8, '西': 6, '雨': 8, '雪': 11, '天': 4,
        '気': 6, '電': 13, '車': 7, '川': 3, '山': 3,
        '田': 5, '林': 8, '森': 12, '空': 8, '星': 9,
        '休': 6, '体': 7, '何': 7, '住': 7, '使': 8,
        '働': 13, '起': 10, '寝': 13, '話': 13, '聞': 14,
        '教': 11, '習': 11, '知': 8, '考': 6, '思': 9,
        '忘': 7, '楽': 13, '好': 6, '嫌': 13, '病': 10,
        '院': 10, '医': 7, '薬': 16, '服': 8, '着': 12
    };
    return strokeCounts[kanji] || '?';
}

// Display stroke order modal - FIXED with proper CSS
function showStrokeOrder(kanji, unicode, meaning) {
    console.log('🎨 showStrokeOrder called with:', { kanji, unicode, meaning });
    
    // If unicode is not provided or invalid, calculate it
    if (!unicode || unicode === 'undefined' || unicode === '' || unicode === 'NaN') {
        unicode = getUnicodeHex(kanji);
        console.log('🔢 Calculated Unicode:', unicode);
    }
    
    // Ensure unicode is uppercase
    unicode = String(unicode).toUpperCase();
    
    let modal = document.getElementById('strokeOrderModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'strokeOrderModal';
        modal.className = 'stroke-modal';
        // INLINE STYLES to ensure proper display
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 99999;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(4px);
        `;
        modal.innerHTML = `
            <div class="stroke-modal-content" style="
                background: white;
                border-radius: 24px;
                width: 90%;
                max-width: 500px;
                max-height: 85vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                animation: strokeFadeIn 0.2s ease;
                position: relative;
                z-index: 100000;
            ">
                <div class="stroke-modal-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    border-bottom: 1px solid #e8e0d5;
                    background: #6c8b6b;
                    border-radius: 24px 24px 0 0;
                ">
                    <h3 id="strokeKanjiTitle" style="margin: 0; color: white; font-size: 1.2rem;"></h3>
                    <button class="stroke-close-btn" style="
                        background: none;
                        border: none;
                        font-size: 1.8rem;
                        cursor: pointer;
                        color: white;
                        transition: opacity 0.2s;
                    ">&times;</button>
                </div>
                <div class="stroke-modal-body" style="padding: 24px; text-align: center;">
                    <div class="stroke-svg-container" id="strokeSvgContainer" style="
                        background: #faf8f5;
                        border-radius: 16px;
                        padding: 20px;
                        margin-bottom: 20px;
                        min-height: 200px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <div class="stroke-loading" style="text-align: center; color: #8a7b6e; padding: 40px;">Loading stroke order...</div>
                    </div>
                    <div class="stroke-info" style="
                        background: #e8f0e7;
                        border-radius: 12px;
                        padding: 12px;
                    ">
                        <p id="strokeCount" style="margin: 8px 0; color: #2c3e2f;"></p>
                        <p id="strokeHint" style="margin: 8px 0; color: #2c3e2f;"></p>
                    </div>
                </div>
                <div class="stroke-modal-footer" style="
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    padding: 16px 20px;
                    border-top: 1px solid #e8e0d5;
                    background: #faf8f5;
                    border-radius: 0 0 24px 24px;
                ">
                    <button id="strokePrintBtn" class="small-btn" style="
                        background: #6c8b6b;
                        color: white;
                        border: none;
                        padding: 8px 20px;
                        border-radius: 40px;
                        cursor: pointer;
                        font-size: 0.9rem;
                    ">🖨️ Print</button>
                    <button id="strokeCloseBtn" class="small-btn" style="
                        background: #e8e0d5;
                        border: none;
                        padding: 8px 20px;
                        border-radius: 40px;
                        cursor: pointer;
                        font-size: 0.9rem;
                    ">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes strokeFadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            .stroke-modal-content {
                animation: strokeFadeIn 0.2s ease;
            }
        `;
        document.head.appendChild(style);
        
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
    
    // Update title - FIXED to only show the kanji
    const titleEl = document.getElementById('strokeKanjiTitle');
    // Ensure we only use the first character for the title
    const cleanTitle = kanji.charAt(0);
    titleEl.innerHTML = `<span style="font-size: 1.8rem; font-weight: bold; margin-right: 8px;">${cleanTitle}</span> - ${meaning || 'Kanji'}`;
    
    const container = document.getElementById('strokeSvgContainer');
    const paths = getSvgPaths(unicode);
    console.log('📁 Trying SVG paths:', paths);
    
    // Clear container and show loading
    container.innerHTML = '<div class="stroke-loading" style="text-align: center; color: #8a7b6e; padding: 40px;">Loading stroke order...</div>';
    
    // Create an image element that tries both paths
    let img = document.createElement('img');
    img.alt = `Stroke order for ${kanji}`;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.background = 'white';
    img.style.maxHeight = '300px';
    img.style.display = 'block';
    img.style.margin = '0 auto';
    img.style.padding = '10px';
    
    let attempted = false;
    
    img.onerror = function() {
        if (!attempted) {
            attempted = true;
            console.log('❌ Primary failed, trying fallback:', paths.fallback);
            this.src = paths.fallback;
        } else {
            console.log('❌ Both paths failed');
            this.style.display = 'none';
            // Show a nice fallback with the kanji character
            const strokeCount = getStrokeCount(kanji.charAt(0));
            container.innerHTML = `
                <div style="text-align:center;padding:30px 20px;">
                    <div style="font-size:6rem;color:#2c3e2f;margin-bottom:10px;line-height:1.2;">${kanji.charAt(0)}</div>
                    <div style="font-size:1.1rem;font-weight:500;color:#1e4b6e;margin-bottom:8px;">
                        ✍️ ${strokeCount} strokes
                    </div>
                    <div style="font-size:0.95rem;color:#555;margin-bottom:12px;">
                        ${getStrokeHint(kanji.charAt(0))}
                    </div>
                    <div style="font-size:0.8rem;color:#999;padding:12px;background:#f5f0eb;border-radius:8px;margin-top:8px;">
                        💡 SVG stroke diagram not available.<br>
                        Use the <strong>🖨️ Print</strong> button for a text reference.
                    </div>
                </div>
            `;
        }
    };
    
    img.onload = function() {
        console.log('✅ SVG loaded successfully from:', this.src);
        container.innerHTML = '';
        container.appendChild(img);
        
        // Update stroke count and hint
        const count = getStrokeCount(kanji.charAt(0));
        document.getElementById('strokeCount').innerHTML = `✍️ Total strokes: <strong>${count}</strong>`;
        document.getElementById('strokeHint').innerHTML = getStrokeHint(kanji.charAt(0));
    };
    
    // Start loading the primary SVG
    img.src = paths.primary;
    container.innerHTML = '';
    container.appendChild(img);
    
    // Show the modal - FIXED to use proper display
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    console.log('🖼️ Modal displayed');
}

// Print stroke diagram
function printStrokeDiagram(kanji, unicode, meaning) {
    console.log('🖨️ printStrokeDiagram called:', { kanji, unicode, meaning });
    
    if (!unicode || unicode === 'undefined' || unicode === '' || unicode === 'NaN') {
        unicode = getUnicodeHex(kanji);
    }
    
    const cleanKanji = kanji.charAt(0);
    const strokeCount = getStrokeCount(cleanKanji);
    const hint = getStrokeHint(cleanKanji);
    const svgPath = getSvgPaths(unicode);
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow popups for this site.');
        return;
    }
    
    const svgHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Stroke Order - ${cleanKanji}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 20mm;
        }
        body {
            font-family: 'Segoe UI', 'Noto Sans', sans-serif;
            text-align: center;
            padding: 20px;
            background: white;
            color: #1a1a1a;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
        }
        .kanji-char {
            font-size: 6rem;
            color: #2c3e2f;
            margin-bottom: 10px;
        }
        .title {
            font-size: 1.2rem;
            font-weight: bold;
            color: #1e4b6e;
            margin-bottom: 4px;
        }
        .meaning {
            font-size: 1rem;
            color: #666;
            margin-bottom: 20px;
        }
        .svg-container {
            background: #faf8f5;
            border-radius: 12px;
            padding: 20px;
            margin: 20px auto;
            max-width: 400px;
            border: 1px solid #e8e0d5;
        }
        .svg-container img {
            max-width: 100%;
            height: auto;
        }
        .svg-fallback {
            font-size: 0.9rem;
            color: #999;
            padding: 20px;
        }
        .info {
            background: #e8f0e7;
            border-radius: 12px;
            padding: 16px;
            margin-top: 20px;
            text-align: left;
        }
        .info p {
            margin: 8px 0;
            color: #2c3e2f;
        }
        .footer {
            margin-top: 30px;
            font-size: 0.7rem;
            color: #999;
            border-top: 1px solid #eee;
            padding-top: 15px;
        }
        @media print {
            body { padding: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="kanji-char">${cleanKanji}</div>
        <div class="title">Stroke Order Diagram</div>
        <div class="meaning">${meaning || ''}</div>
        
        <div class="svg-container">
            <img src="${svgPath.primary}" 
                 alt="Stroke order for ${cleanKanji}"
                 onerror="this.parentElement.innerHTML='<div class=\\'svg-fallback\\'>⚠️ SVG not available.<br><br><span style=\\'font-size:2rem;\\'>${cleanKanji}</span><br><br>✍️ ${strokeCount} strokes<br><br>${hint}</div>'">
        </div>
        
        <div class="info">
            <p><strong>✍️ Total strokes:</strong> ${strokeCount}</p>
            <p><strong>📖 Hint:</strong> ${hint}</p>
            <p><strong>🔢 Unicode:</strong> ${unicode}</p>
        </div>
        
        <div class="footer">
            N5 Japanese Study App · ${new Date().toLocaleDateString()}
        </div>
    </div>
    <script>
        setTimeout(() => {
            window.print();
        }, 1000);
    <\/script>
</body>
</html>
    `;
    
    printWindow.document.write(svgHtml);
    printWindow.document.close();
}

// Add stroke order buttons to kanji cards
function addStrokeButtonsToKanjiList() {
    const kanjiCards = document.querySelectorAll('.kanji-card');
    console.log('Adding stroke buttons to', kanjiCards.length, 'cards');
    
    kanjiCards.forEach(card => {
        if (card.querySelector('.stroke-order-btn')) return;
        
        let kanji = '';
        let meaning = '';
        
        const kanjiPatternEl = card.querySelector('.kanji-pattern');
        if (kanjiPatternEl) {
            kanji = kanjiPatternEl.textContent.trim();
            // Keep only the first character (the kanji)
            kanji = kanji.charAt(0);
        }
        
        if (!kanji) {
            const match = card.innerText.match(/^[一-龯]/);
            if (match) kanji = match[0];
        }
        
        const meaningEl = card.querySelector('.kanji-meaning');
        if (meaningEl) {
            meaning = meaningEl.textContent.trim();
        }
        
        if (kanji && kanji.length === 1) {
            const unicode = getUnicodeHex(kanji);
            console.log(`🆕 Adding stroke button for "${kanji}" (${unicode})`);
            
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
            strokeBtn.dataset.meaning = meaning || '';
            
            const masteredBtn = card.querySelector('.mark-mastered-btn');
            if (masteredBtn) {
                masteredBtn.parentNode.insertBefore(strokeBtn, masteredBtn.nextSibling);
            } else {
                const cardFooter = card.querySelector('.kanji-examples');
                if (cardFooter) {
                    cardFooter.insertAdjacentElement('afterend', strokeBtn);
                } else {
                    card.appendChild(strokeBtn);
                }
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