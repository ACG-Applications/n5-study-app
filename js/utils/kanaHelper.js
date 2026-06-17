// ==================== KANA HELPER ====================
// Reusable popup component for Hiragana and Katakana

// Data for Hiragana and Katakana side by side
const kanaPairs = [
    { hiragana: 'あ', katakana: 'ア', romaji: 'a' },
    { hiragana: 'い', katakana: 'イ', romaji: 'i' },
    { hiragana: 'う', katakana: 'ウ', romaji: 'u' },
    { hiragana: 'え', katakana: 'エ', romaji: 'e' },
    { hiragana: 'お', katakana: 'オ', romaji: 'o' },
    { hiragana: 'か', katakana: 'カ', romaji: 'ka' },
    { hiragana: 'き', katakana: 'キ', romaji: 'ki' },
    { hiragana: 'く', katakana: 'ク', romaji: 'ku' },
    { hiragana: 'け', katakana: 'ケ', romaji: 'ke' },
    { hiragana: 'こ', katakana: 'コ', romaji: 'ko' },
    { hiragana: 'さ', katakana: 'サ', romaji: 'sa' },
    { hiragana: 'し', katakana: 'シ', romaji: 'shi' },
    { hiragana: 'す', katakana: 'ス', romaji: 'su' },
    { hiragana: 'せ', katakana: 'セ', romaji: 'se' },
    { hiragana: 'そ', katakana: 'ソ', romaji: 'so' },
    { hiragana: 'た', katakana: 'タ', romaji: 'ta' },
    { hiragana: 'ち', katakana: 'チ', romaji: 'chi' },
    { hiragana: 'つ', katakana: 'ツ', romaji: 'tsu' },
    { hiragana: 'て', katakana: 'テ', romaji: 'te' },
    { hiragana: 'と', katakana: 'ト', romaji: 'to' },
    { hiragana: 'な', katakana: 'ナ', romaji: 'na' },
    { hiragana: 'に', katakana: 'ニ', romaji: 'ni' },
    { hiragana: 'ぬ', katakana: 'ヌ', romaji: 'nu' },
    { hiragana: 'ね', katakana: 'ネ', romaji: 'ne' },
    { hiragana: 'の', katakana: 'ノ', romaji: 'no' },
    { hiragana: 'は', katakana: 'ハ', romaji: 'ha' },
    { hiragana: 'ひ', katakana: 'ヒ', romaji: 'hi' },
    { hiragana: 'ふ', katakana: 'フ', romaji: 'fu' },
    { hiragana: 'へ', katakana: 'ヘ', romaji: 'he' },
    { hiragana: 'ほ', katakana: 'ホ', romaji: 'ho' },
    { hiragana: 'ま', katakana: 'マ', romaji: 'ma' },
    { hiragana: 'み', katakana: 'ミ', romaji: 'mi' },
    { hiragana: 'む', katakana: 'ム', romaji: 'mu' },
    { hiragana: 'め', katakana: 'メ', romaji: 'me' },
    { hiragana: 'も', katakana: 'モ', romaji: 'mo' },
    { hiragana: 'や', katakana: 'ヤ', romaji: 'ya' },
    { hiragana: 'ゆ', katakana: 'ユ', romaji: 'yu' },
    { hiragana: 'よ', katakana: 'ヨ', romaji: 'yo' },
    { hiragana: 'ら', katakana: 'ラ', romaji: 'ra' },
    { hiragana: 'り', katakana: 'リ', romaji: 'ri' },
    { hiragana: 'る', katakana: 'ル', romaji: 'ru' },
    { hiragana: 'れ', katakana: 'レ', romaji: 're' },
    { hiragana: 'ろ', katakana: 'ロ', romaji: 'ro' },
    { hiragana: 'わ', katakana: 'ワ', romaji: 'wa' },
    { hiragana: 'を', katakana: 'ヲ', romaji: 'wo' },
    { hiragana: 'ん', katakana: 'ン', romaji: 'n' }
];

const dakutenPairs = [
    { hiragana: 'が', katakana: 'ガ', romaji: 'ga' },
    { hiragana: 'ぎ', katakana: 'ギ', romaji: 'gi' },
    { hiragana: 'ぐ', katakana: 'グ', romaji: 'gu' },
    { hiragana: 'げ', katakana: 'ゲ', romaji: 'ge' },
    { hiragana: 'ご', katakana: 'ゴ', romaji: 'go' },
    { hiragana: 'ざ', katakana: 'ザ', romaji: 'za' },
    { hiragana: 'じ', katakana: 'ジ', romaji: 'ji' },
    { hiragana: 'ず', katakana: 'ズ', romaji: 'zu' },
    { hiragana: 'ぜ', katakana: 'ゼ', romaji: 'ze' },
    { hiragana: 'ぞ', katakana: 'ゾ', romaji: 'zo' },
    { hiragana: 'だ', katakana: 'ダ', romaji: 'da' },
    { hiragana: 'ぢ', katakana: 'ヂ', romaji: 'ji' },
    { hiragana: 'づ', katakana: 'ヅ', romaji: 'zu' },
    { hiragana: 'で', katakana: 'デ', romaji: 'de' },
    { hiragana: 'ど', katakana: 'ド', romaji: 'do' },
    { hiragana: 'ば', katakana: 'バ', romaji: 'ba' },
    { hiragana: 'び', katakana: 'ビ', romaji: 'bi' },
    { hiragana: 'ぶ', katakana: 'ブ', romaji: 'bu' },
    { hiragana: 'べ', katakana: 'ベ', romaji: 'be' },
    { hiragana: 'ぼ', katakana: 'ボ', romaji: 'bo' }
];

const handakutenPairs = [
    { hiragana: 'ぱ', katakana: 'パ', romaji: 'pa' },
    { hiragana: 'ぴ', katakana: 'ピ', romaji: 'pi' },
    { hiragana: 'ぷ', katakana: 'プ', romaji: 'pu' },
    { hiragana: 'ぺ', katakana: 'ペ', romaji: 'pe' },
    { hiragana: 'ぽ', katakana: 'ポ', romaji: 'po' }
];

const youonPairs = [
    { hiragana: 'きゃ', katakana: 'キャ', romaji: 'kya' },
    { hiragana: 'きゅ', katakana: 'キュ', romaji: 'kyu' },
    { hiragana: 'きょ', katakana: 'キョ', romaji: 'kyo' },
    { hiragana: 'しゃ', katakana: 'シャ', romaji: 'sha' },
    { hiragana: 'しゅ', katakana: 'シュ', romaji: 'shu' },
    { hiragana: 'しょ', katakana: 'ショ', romaji: 'sho' },
    { hiragana: 'ちゃ', katakana: 'チャ', romaji: 'cha' },
    { hiragana: 'ちゅ', katakana: 'チュ', romaji: 'chu' },
    { hiragana: 'ちょ', katakana: 'チョ', romaji: 'cho' },
    { hiragana: 'にゃ', katakana: 'ニャ', romaji: 'nya' },
    { hiragana: 'にゅ', katakana: 'ニュ', romaji: 'nyu' },
    { hiragana: 'にょ', katakana: 'ニョ', romaji: 'nyo' },
    { hiragana: 'ひゃ', katakana: 'ヒャ', romaji: 'hya' },
    { hiragana: 'ひゅ', katakana: 'ヒュ', romaji: 'hyu' },
    { hiragana: 'ひょ', katakana: 'ヒョ', romaji: 'hyo' },
    { hiragana: 'みゃ', katakana: 'ミャ', romaji: 'mya' },
    { hiragana: 'みゅ', katakana: 'ミュ', romaji: 'myu' },
    { hiragana: 'みょ', katakana: 'ミョ', romaji: 'myo' },
    { hiragana: 'りゃ', katakana: 'リャ', romaji: 'rya' },
    { hiragana: 'りゅ', katakana: 'リュ', romaji: 'ryu' },
    { hiragana: 'りょ', katakana: 'リョ', romaji: 'ryo' },
    { hiragana: 'ぎゃ', katakana: 'ギャ', romaji: 'gya' },
    { hiragana: 'ぎゅ', katakana: 'ギュ', romaji: 'gyu' },
    { hiragana: 'ぎょ', katakana: 'ギョ', romaji: 'gyo' },
    { hiragana: 'じゃ', katakana: 'ジャ', romaji: 'ja' },
    { hiragana: 'じゅ', katakana: 'ジュ', romaji: 'ju' },
    { hiragana: 'じょ', katakana: 'ジョ', romaji: 'jo' },
    { hiragana: 'びゃ', katakana: 'ビャ', romaji: 'bya' },
    { hiragana: 'びゅ', katakana: 'ビュ', romaji: 'byu' },
    { hiragana: 'びょ', katakana: 'ビョ', romaji: 'byo' },
    { hiragana: 'ぴゃ', katakana: 'ピャ', romaji: 'pya' },
    { hiragana: 'ぴゅ', katakana: 'ピュ', romaji: 'pyu' },
    { hiragana: 'ぴょ', katakana: 'ピョ', romaji: 'pyo' }
];

// TTS function
function speakKanaSound(kana) {
    if (typeof speakText === 'function') {
        speakText(kana);
    } else if (typeof window.speechSynthesis !== 'undefined') {
        const utterance = new SpeechSynthesisUtterance(kana);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.8;
        const voices = window.speechSynthesis.getVoices();
        const japaneseVoice = voices.find(voice => voice.lang === 'ja-JP');
        if (japaneseVoice) utterance.voice = japaneseVoice;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }
}

// Show modal
function showKanaHelperModal() {
    let modal = document.getElementById('kanaHelperModal');
    if (modal) {
        modal.style.display = 'flex';
        return;
    }
    
    modal = document.createElement('div');
    modal.id = 'kanaHelperModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: 'Segoe UI', sans-serif;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 24px;
        max-width: 95%;
        width: 750px;
        max-height: 85vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    `;
    
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 2px solid #6c8b6b; background: white; position: sticky; top: 0; z-index: 10;">
            <h2 style="margin: 0; color: #1e4b6e;">🈳 Kana Helper</h2>
            <button id="closeKanaHelperModal" style="background: #dc3545; color: white; border: none; border-radius: 40px; padding: 8px 20px; cursor: pointer;">Close</button>
        </div>
        <div id="kanaHelperModalContent" style="padding: 20px; overflow-y: auto; flex: 1;"></div>
        <div style="padding: 12px 20px; border-top: 1px solid #ddd; text-align: center; font-size: 0.8rem; color: #666; background: white; position: sticky; bottom: 0;">
            💡 Click any kana to hear pronunciation
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    const container = document.getElementById('kanaHelperModalContent');
    container.innerHTML = '';
    
    function renderSection(title, pairs) {
        let html = `<h3 style="color: #c45d1e; margin: 20px 0 10px 0;">${title}</h3>`;
        html += `<div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 20px;">`;
        for (const pair of pairs) {
            html += `
                <div class="kana-card" data-hiragana="${pair.hiragana}" style="background: #f0f4f8; border-radius: 12px; padding: 10px; text-align: center; cursor: pointer; transition: all 0.2s; border: 1px solid #ddd;">
                    <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 5px;">
                        <span style="font-size: 1.4rem; font-weight: bold; color: #1e4b6e;">${pair.hiragana}</span>
                        <span style="font-size: 1.4rem; font-weight: bold; color: #c45d1e;">${pair.katakana}</span>
                    </div>
                    <div style="font-size: 0.7rem; color: #666;">${pair.romaji}</div>
                </div>
            `;
        }
        html += `</div>`;
        container.innerHTML += html;
    }
    
    renderSection('📖 Basic Kana (五十音)', kanaPairs);
    renderSection('🔊 Dakuten (濁点)', dakutenPairs);
    renderSection('⚪ Handakuten (半濁点)', handakutenPairs);
    renderSection('🎵 Youon (拗音) - Contracted Sounds', youonPairs);
    
    document.querySelectorAll('.kana-card').forEach(el => {
        el.addEventListener('click', () => {
            const hiragana = el.dataset.hiragana;
            if (hiragana) speakKanaSound(hiragana);
        });
        el.addEventListener('mouseenter', () => {
            el.style.transform = 'scale(1.02)';
            el.style.backgroundColor = '#e8f5e9';
            el.style.borderColor = '#4caf50';
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'scale(1)';
            el.style.backgroundColor = '#f0f4f8';
            el.style.borderColor = '#ddd';
        });
    });
    
    document.getElementById('closeKanaHelperModal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

// Add floating button
function addKanaHelperButton() {
    if (document.getElementById('kanaHelperBtn')) return;
    
    const button = document.createElement('button');
    button.id = 'kanaHelperBtn';
    button.innerHTML = 'あ';
    button.title = 'Kana Helper';
    button.style.cssText = `
        position: fixed;
        left: 20px;
        bottom: 90px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #6c8b6b;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.8rem;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 999;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.05)';
        button.style.backgroundColor = '#5a7a59';
    });
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
        button.style.backgroundColor = '#6c8b6b';
    });
    button.addEventListener('click', showKanaHelperModal);
    document.body.appendChild(button);
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addKanaHelperButton);
} else {
    addKanaHelperButton();
}