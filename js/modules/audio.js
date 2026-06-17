// ==================== AUDIO MODULE ====================
// Simple TTS (Text-to-Speech) function for pronunciation

let currentUtterance = null;
let voicesLoaded = false;

// Load voices when available
function loadVoices() {
    if (typeof window.speechSynthesis !== 'undefined') {
        // Try to force voices to load
        window.speechSynthesis.getVoices();
    }
}

// Speak Japanese text
function speakText(text) {
    if (!text) return;
    
    // Check if speech synthesis is available
    if (typeof window.speechSynthesis === 'undefined') {
        console.warn('Speech synthesis not supported in this browser');
        return;
    }
    
    // Cancel any ongoing speech
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to find a Japanese voice
    const voices = window.speechSynthesis.getVoices();
    const japaneseVoice = voices.find(voice => 
        voice.lang === 'ja-JP' || 
        voice.lang === 'ja' ||
        voice.name.includes('Japanese') ||
        voice.name.includes('Kyoko') ||
        voice.name.includes('Otoya')
    );
    
    if (japaneseVoice) {
        utterance.voice = japaneseVoice;
    }
    
    // Store current utterance
    currentUtterance = utterance;
    
    // Speak
    window.speechSynthesis.speak(utterance);
}

// Stop current speech
function stopSpeech() {
    if (typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.cancel();
        currentUtterance = null;
    }
}

// Speak a Japanese word/phrase (alias)
function speakJapanese(text) {
    speakText(text);
}

// Event listener for voices to load
if (typeof window.speechSynthesis !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = function() {
        voicesLoaded = true;
        console.log('Voices loaded for TTS');
    };
    
    // Initial load attempt
    setTimeout(loadVoices, 100);
}

// Export for global use
window.speakText = speakText;
window.stopSpeech = stopSpeech;
window.speakJapanese = speakJapanese;

console.log('Audio module loaded');