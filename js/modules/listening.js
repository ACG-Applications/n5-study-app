// ==================== LISTENING MODULE ====================
// Video player with playlist, transcript, furigana toggle, and progress tracking

// DOM Elements
const mainVideo = document.getElementById('mainVideo');
const videoTitle = document.getElementById('videoTitle');
const playlistContainer = document.getElementById('playlist');
const transcriptPanel = document.getElementById('transcriptPanel');
const transcriptContent = document.getElementById('transcriptContent');
const answerPanel = document.getElementById('answerPanel');
const answerContent = document.getElementById('answerContent');
const toggleTranscriptBtn = document.getElementById('toggleTranscriptBtn');
const showAnswerBtn = document.getElementById('showAnswerBtn');
const closeTranscriptBtn = document.getElementById('closeTranscriptBtn');
const closeAnswerBtn = document.getElementById('closeAnswerBtn');
const furiToggleBtn = document.getElementById('furiToggleBtn');
const watchedCountSpan = document.getElementById('watchedCount');
const totalCountSpan = document.getElementById('totalCount');
const watchedListContainer = document.getElementById('watchedList');
const resetWatchedBtn = document.getElementById('resetWatchedBtn');
const clearWatchedBtn = document.getElementById('clearWatchedBtn');

// Speed buttons
const speed075Btn = document.getElementById('speed075Btn');
const speed100Btn = document.getElementById('speed100Btn');

// State variables
let currentVideo = null;
let furiganaHidden = false;
let currentSpeed = 1.0;

console.log('Listening.js loaded');

// ===== HELPER FUNCTIONS =====

// Update progress counters
function updateProgressCounters() {
    if (typeof getWatchedCount !== 'undefined' && typeof getTotalCount !== 'undefined') {
        const watched = getWatchedCount();
        const total = getTotalCount();
        if (watchedCountSpan) watchedCountSpan.innerText = watched;
        if (totalCountSpan) totalCountSpan.innerText = total;
        renderWatchedList();
    }
}

// Format transcript with speaker labels and furigana
function formatTranscriptText(text) {
    if (!text) return '<p>No transcript available.</p>';
    
    // Split into lines
    let lines = text.split('\n');
    let formattedLines = [];
    
    for (let line of lines) {
        if (line.trim() === '') continue;
        
        // Apply furigana conversion
        let processedLine = line;
        
        if (!furiganaHidden) {
            processedLine = processedLine.replace(/([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g, 
                (_, kanji, furigana) => `<ruby>${kanji}<rt>${furigana}</rt></ruby>`);
        } else {
            processedLine = processedLine.replace(/[（(][^）)]*[）)]/g, '');
        }
        
        // Add speaker label classes
        processedLine = processedLine
            .replace(/\*\*👨‍🏫 Narrator:\*\*/g, '<span class="speaker-narrator">👨‍🏫 Narrator:</span>')
            .replace(/\*\*👩 Woman:\*\*/g, '<span class="speaker-female">👩 Woman:</span>')
            .replace(/\*\*👨 Man:\*\*/g, '<span class="speaker-male">👨 Man:</span>')
            .replace(/\*\*👨‍💼 Staff:\*\*/g, '<span class="speaker-staff">👨‍💼 Staff:</span>')
            .replace(/\*\*👨‍⚕️ Staff:\*\*/g, '<span class="speaker-staff">👨‍⚕️ Staff:</span>')
            .replace(/\*\*👨‍🏫 Teacher:\*\*/g, '<span class="speaker-teacher">👨‍🏫 Teacher:</span>')
            .replace(/\*\*👩 Student \(Female\):\*\*/g, '<span class="speaker-student-female">👩 Student (Female):</span>')
            .replace(/\*\*👨 Student \(Male\):\*\*/g, '<span class="speaker-student-male">👨 Student (Male):</span>')
            .replace(/\*\*👩 Customer:\*\*/g, '<span class="speaker-customer">👩 Customer:</span>')
            .replace(/\*\*👨‍🍳 Staff:\*\*/g, '<span class="speaker-staff">👨‍🍳 Staff:</span>')
            .replace(/\*\*👨 Boy:\*\*/g, '<span class="speaker-male">👨 Boy:</span>')
            .replace(/\*\*👩 Mother:\*\*/g, '<span class="speaker-female">👩 Mother:</span>');
        
        formattedLines.push(`<p>${processedLine}</p>`);
    }
    
    return formattedLines.join('');
}

// Display transcript for current video
function displayTranscript() {
    if (!currentVideo) {
        transcriptContent.innerHTML = '<p>No video selected.</p>';
        return;
    }
    if (!currentVideo.formattedTranscript) {
        transcriptContent.innerHTML = '<p>No transcript available for this video.</p>';
        return;
    }
    transcriptContent.innerHTML = formatTranscriptText(currentVideo.formattedTranscript);
}

// Display answer for current question
function displayAnswer() {
    if (!currentVideo) {
        answerContent.innerHTML = '<p>No video selected.</p>';
        return;
    }
    if (!currentVideo.questions || currentVideo.questions.length === 0) {
        answerContent.innerHTML = '<p>No answer guide available for this video.</p>';
        return;
    }
    
    let answerHtml = '<ul style="margin: 0; padding-left: 20px;">';
    for (let i = 0; i < currentVideo.questions.length; i++) {
        const q = currentVideo.questions[i];
        answerHtml += `<li style="margin-bottom: 12px;">
            <strong>⏱️ ${q.timestamp}</strong><br>
            📖 ${q.question}<br>
            <strong style="color: #2e7d32;">✅ Answer:</strong> ${q.answer}
        </li>`;
    }
    answerHtml += '</ul>';
    
    answerContent.innerHTML = answerHtml;
}

// Load and play a video
function loadVideo(videoId) {
    console.log('Loading video:', videoId);
    
    // Check if videoList exists
    if (typeof videoList === 'undefined') {
        console.error('videoList not defined! Check if video_list.js loaded.');
        alert('Error: Video data not loaded. Please check the console.');
        return;
    }
    
    const video = videoList.find(v => v.id === videoId);
    if (!video) {
        console.error('Video not found:', videoId);
        return;
    }
    
    currentVideo = video;
    console.log('Current video set to:', currentVideo.title);
    
    // Update video source
    if (mainVideo) {
        mainVideo.src = video.file;
        mainVideo.load();
        mainVideo.playbackRate = currentSpeed;
        mainVideo.style.opacity = '1';
        console.log('Video source set to:', video.file);
        
        // Try to play
        mainVideo.play().catch(e => {
            console.warn('Auto-play prevented:', e);
        });
    } else {
        console.error('mainVideo element not found!');
    }
    
    // Update title
    if (videoTitle) videoTitle.innerText = video.title;
    
    // Update UI - highlight active playlist item
    document.querySelectorAll('.playlist-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.id === videoId) {
            item.classList.add('active');
        }
    });
    
    // Show action buttons
    if (toggleTranscriptBtn) toggleTranscriptBtn.style.display = 'inline-block';
    if (showAnswerBtn) showAnswerBtn.style.display = 'inline-block';
    
    // Hide panels when loading new video
    if (transcriptPanel) transcriptPanel.style.display = 'none';
    if (answerPanel) answerPanel.style.display = 'none';
    
    // Reset button text
    if (toggleTranscriptBtn) toggleTranscriptBtn.textContent = '📖 Show Transcript';
    if (showAnswerBtn) showAnswerBtn.textContent = '💡 Reveal Answer';
}

// Render playlist
function renderPlaylist() {
    console.log('Rendering playlist...');
    
    if (!playlistContainer) {
        console.error('playlistContainer not found!');
        return;
    }
    
    if (typeof videoList === 'undefined') {
        console.error('videoList not defined!');
        playlistContainer.innerHTML = '<div class="loading-message" style="color: red;">❌ Error: Video data not loaded. Check video_list.js</div>';
        return;
    }
    
    if (videoList.length === 0) {
        playlistContainer.innerHTML = '<div class="loading-message">No videos found. Please add videos to the list.</div>';
        return;
    }
    
    playlistContainer.innerHTML = '';
    
    for (const video of videoList) {
        const item = document.createElement('div');
        item.className = `playlist-item ${video.watched ? 'watched' : ''}`;
        item.dataset.id = video.id;
        
        // Simple thumbnail (emoji-based)
        const thumbnailEmoji = video.id.includes('01') ? '🏪' :
                               video.id.includes('02') ? '🍳' :
                               video.id.includes('03') ? '🏬' :
                               video.id.includes('04') ? '✈️' :
                               video.id.includes('05') ? '💬' :
                               video.id.includes('06') ? '📸' :
                               video.id.includes('07') ? '☕' :
                               video.id.includes('08') ? '🏦' : '🌸';
        
        item.innerHTML = `
            <div class="playlist-thumbnail">${thumbnailEmoji}</div>
            <div class="playlist-info">
                <h4>${video.title}</h4>
                <p>${video.duration || 'N/A'}</p>
            </div>
            ${video.watched ? '<div class="watched-badge">✓ Watched</div>' : ''}
        `;
        
        item.addEventListener('click', () => loadVideo(video.id));
        playlistContainer.appendChild(item);
    }
    
    console.log('Playlist rendered with', videoList.length, 'videos');
}

// Render watched list
function renderWatchedList() {
    if (!watchedListContainer) return;
    
    if (typeof videoList === 'undefined') {
        watchedListContainer.innerHTML = '<p class="empty-message">Error: Video data not loaded.</p>';
        return;
    }
    
    const watchedVideos = videoList.filter(v => v.watched);
    
    if (watchedVideos.length === 0) {
        watchedListContainer.innerHTML = '<p class="empty-message">No videos watched yet. Watch a video to track your progress!</p>';
        return;
    }
    
    let html = '';
    for (const video of watchedVideos) {
        html += `
            <div class="watched-item" data-id="${video.id}">
                <span>📺 ${video.title}</span>
                <button class="remove-watched-btn" data-id="${video.id}">Remove</button>
            </div>
        `;
    }
    
    watchedListContainer.innerHTML = html;
    
    // Add remove buttons
    document.querySelectorAll('.remove-watched-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const videoId = btn.dataset.id;
            const video = videoList.find(v => v.id === videoId);
            if (video) {
                video.watched = false;
                if (typeof saveWatchedStatus !== 'undefined') saveWatchedStatus();
                renderPlaylist();
                renderWatchedList();
                if (typeof updateProgressCounters !== 'undefined') updateProgressCounters();
            }
        });
    });
}

// Mark current video as watched
function markCurrentAsWatched() {
    if (currentVideo && !currentVideo.watched) {
        currentVideo.watched = true;
        if (typeof saveWatchedStatus !== 'undefined') saveWatchedStatus();
        renderPlaylist();
        renderWatchedList();
        if (typeof updateProgressCounters !== 'undefined') updateProgressCounters();
    }
}

// Reset all watched progress
function resetAllWatched() {
    if (confirm('⚠️ Are you sure? This will reset ALL watched progress for listening videos.')) {
        if (typeof videoList !== 'undefined') {
            videoList.forEach(video => {
                video.watched = false;
            });
        }
        if (typeof saveWatchedStatus !== 'undefined') saveWatchedStatus();
        renderPlaylist();
        renderWatchedList();
        if (typeof updateProgressCounters !== 'undefined') updateProgressCounters();
        
        // Show feedback
        const feedback = document.createElement('div');
        feedback.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#4caf50; color:white; padding:12px 24px; border-radius:8px; z-index:1000;';
        feedback.innerText = '✅ All watched progress has been reset!';
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    }
}

function clearAllWatched() {
    resetAllWatched();
}

// Set video playback speed
// Set video playback speed
function setVideoSpeed(speed) {
    currentSpeed = speed;
    if (mainVideo) {
        mainVideo.playbackRate = speed;
    }
    
    // Update button active states
    if (speed075Btn) speed075Btn.classList.remove('active');
    if (speed100Btn) speed100Btn.classList.remove('active');
    
    if (speed === 0.75 && speed075Btn) speed075Btn.classList.add('active');
    if (speed === 1.0 && speed100Btn) speed100Btn.classList.add('active');
}

// Toggle furigana display
function toggleFurigana() {
    furiganaHidden = !furiganaHidden;
    
    if (furiToggleBtn) {
        furiToggleBtn.innerText = furiganaHidden ? '🔤 Furigana Off' : '🔤 Furigana On';
    }
    
    if (furiganaHidden) {
        document.body.classList.add('furigana-hidden');
    } else {
        document.body.classList.remove('furigana-hidden');
    }
    
    if (transcriptPanel && transcriptPanel.style.display !== 'none' && currentVideo) {
        displayTranscript();
    }
}

// Toggle transcript panel
function toggleTranscript() {
    if (!transcriptPanel) return;
    
    if (transcriptPanel.style.display === 'none') {
        displayTranscript();
        transcriptPanel.style.display = 'block';
        if (answerPanel) answerPanel.style.display = 'none';
        if (toggleTranscriptBtn) toggleTranscriptBtn.textContent = '📖 Hide Transcript';
    } else {
        transcriptPanel.style.display = 'none';
        if (toggleTranscriptBtn) toggleTranscriptBtn.textContent = '📖 Show Transcript';
    }
}

// Toggle answer panel
function toggleAnswer() {
    if (!answerPanel) return;
    
    if (answerPanel.style.display === 'none') {
        displayAnswer();
        answerPanel.style.display = 'block';
        if (transcriptPanel) transcriptPanel.style.display = 'none';
        if (showAnswerBtn) showAnswerBtn.textContent = '💡 Hide Answer';
    } else {
        answerPanel.style.display = 'none';
        if (showAnswerBtn) showAnswerBtn.textContent = '💡 Reveal Answer';
    }
}

// Video ended - mark as watched
function onVideoEnded() {
    markCurrentAsWatched();
}

// ===== EVENT LISTENERS =====

if (speed075Btn) speed075Btn.addEventListener('click', () => setVideoSpeed(0.75));
if (speed100Btn) speed100Btn.addEventListener('click', () => setVideoSpeed(1.0));


if (furiToggleBtn) furiToggleBtn.addEventListener('click', toggleFurigana);

if (toggleTranscriptBtn) toggleTranscriptBtn.addEventListener('click', toggleTranscript);
if (closeTranscriptBtn) closeTranscriptBtn.addEventListener('click', () => {
    if (transcriptPanel) transcriptPanel.style.display = 'none';
    if (toggleTranscriptBtn) toggleTranscriptBtn.textContent = '📖 Show Transcript';
});

if (showAnswerBtn) showAnswerBtn.addEventListener('click', toggleAnswer);
if (closeAnswerBtn) closeAnswerBtn.addEventListener('click', () => {
    if (answerPanel) answerPanel.style.display = 'none';
    if (showAnswerBtn) showAnswerBtn.textContent = '💡 Reveal Answer';
});

if (resetWatchedBtn) resetWatchedBtn.addEventListener('click', resetAllWatched);
if (clearWatchedBtn) clearWatchedBtn.addEventListener('click', clearAllWatched);

if (mainVideo) mainVideo.addEventListener('ended', onVideoEnded);

// ===== INITIALIZATION =====
function initListening() {
    console.log('Initializing listening module...');
    
    // Check if videoList exists
    if (typeof videoList === 'undefined') {
        console.error('videoList is not defined! Make sure video_list.js is loaded before listening.js');
        if (playlistContainer) {
            playlistContainer.innerHTML = '<div class="loading-message" style="color: red;">❌ Error: Video data not loaded. Please check that video_list.js exists and is loaded correctly.</div>';
        }
        return;
    }
    
    console.log('videoList found with', videoList.length, 'videos');
    
    renderPlaylist();
    setVideoSpeed(1.0);
    
    // DON'T auto-load - wait for user to click a video
    // Show a welcome message instead
    if (videoTitle) {
        videoTitle.innerText = '🎬 Select a video from the playlist';
    }
    
    // Show a placeholder in the video area
    if (mainVideo) {
        mainVideo.style.opacity = '0.6';
    }
    
    // Hide action buttons until a video is selected
    if (toggleTranscriptBtn) toggleTranscriptBtn.style.display = 'none';
    if (showAnswerBtn) showAnswerBtn.style.display = 'none';
    
    // Initialize furigana state
    if (furiganaHidden) {
        document.body.classList.add('furigana-hidden');
        if (furiToggleBtn) furiToggleBtn.innerText = '🔤 Furigana Off';
    }
    
    // Update counters
    if (watchedCountSpan) watchedCountSpan.innerText = '0';
    if (totalCountSpan) totalCountSpan.innerText = videoList.length;
    
    console.log('Listening module initialized - waiting for user selection');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initListening);
} else {
    initListening();
}