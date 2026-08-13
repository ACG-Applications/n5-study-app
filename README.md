# 📚 N5 Japanese Study App

A comprehensive, offline-first web application for Japanese language learners preparing for the JLPT N5 level. Built as a Progressive Web App (PWA) with a focus on reading, vocabulary, grammar, and listening practice.

![N5 Study App](https://img.shields.io/badge/JLPT-N5-brightgreen.svg)
![PWA](https://img.shields.io/badge/PWA-Enabled-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## 🌟 Features

### Core Study Tools
- **📇 Flashcards** - Study N5 vocabulary with built-in TTS (Text-to-Speech) and furigana support
- **💬 Conversation Practice** - Interactive dialogues with real-life scenarios
- **📖 Vocabulary Builder** - Comprehensive word lists with meanings and readings
- **🧩 Sentence Builder** - Practice constructing Japanese sentences with interactive word banks
- **🧭 Directions Practice** - Learn and practice giving/receiving directions in Japanese
- **🔍 Word Search** - Interactive word search puzzles with furigana
- **📖 Story Mode** - Graded reading practice with furigana and translations

### Reference Guides
- **🔘 Particles Guide** - Complete N5 particle reference with examples and quizzes
- **🔤 Verbs Guide** - Conjugation tables for all N5 verbs with practice quizzes
- **📝 Adjectives Guide** - い-adjective and な-adjective reference with quizzes
- **💨 Adverbs Guide** - N5 adverb reference with example sentences
- **📚 Grammar Guide** - Essential JLPT N5 grammar patterns with explanations
- **📖 Kanji Guide** - N5 kanji reference with stroke order and vocabulary

### Practice Tests
- **📝 JLPT N5 Practice Test** - Full practice tests covering vocabulary, grammar, reading, and listening
- **🎧 Listening Practice** - Video-based listening comprehension with transcripts

### Learning Resources
- **📚 Reading Resources** - Graded reading materials (Levels 0-4) with video support
- **📚 Reference & Grammar** - Comprehensive grammar guides and cheat sheets
- **✍️ Writing Practice** - Hiragana, Katakana, and Kanji writing practice sheets

### Technical Features
- **🌐 Offline Support** - Progressive Web App (PWA) with service worker
- **🔊 Text-to-Speech** - Native TTS support for all Japanese content
- **📱 Responsive Design** - Works on desktop, tablet, and mobile devices
- **🔍 Global Search** - Search any word across the entire app with Jisho.org integration
- **📊 Progress Tracking** - Mastery tracking with local storage persistence

## 🚀 Quick Start

### Option 1: Open Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/n5-study-app.git
Open index.html in your browser

Option 2: Use a Local Server
bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve

# Using VS Code Live Server
# Install the Live Server extension and click "Go Live"
Option 3: Deploy to GitHub Pages
Push your repository to GitHub

Go to Settings > Pages

Select the main branch as the source

Your app will be available at https://yourusername.github.io/n5-study-app/

📁 Project Structure
text
n5-study-app/
├── index.html                 # Main app entry point
├── manifest.json             # PWA manifest
├── sw.js                     # Service worker for offline support
├── css/
│   ├── variables.css         # CSS variables (colors, fonts, spacing)
│   ├── style.css            # Global styles
│   ├── components.css       # Shared component styles
│   ├── adjectives.css       # Adjectives module styles
│   ├── adverbs.css          # Adverbs module styles
│   ├── conversation.css     # Conversation module styles
│   ├── grammar.css          # Grammar module styles
│   ├── kanji.css            # Kanji module styles
│   ├── listening.css        # Listening module styles
│   ├── particles.css        # Particles module styles
│   ├── practice-test.css    # Practice test styles
│   ├── sentenceBuilder.css  # Sentence builder styles
│   ├── verbs.css            # Verbs module styles
│   ├── kana-helper.css      # Kana helper styles
│   └── kanji-helper.css     # Kanji helper styles
├── js/
│   ├── data/
│   │   ├── adjectivesData.js     # Adjective data
│   │   ├── adverbsData.js        # Adverb data
│   │   ├── grammarData.js        # Grammar data
│   │   ├── kanjiData.js          # Kanji data
│   │   ├── particlesData.js      # Particle data
│   │   ├── practiceTestData.js   # Practice test questions
│   │   ├── sentences.js          # Sentence collection
│   │   ├── sprints.js            # Sprint/lesson data
│   │   ├── stories.js            # Story data
│   │   ├── verbsData.js          # Verb data
│   │   ├── video_list.js         # Video metadata
│   │   └── wordDict.js           # Word dictionary
│   ├── modules/
│   │   ├── adjectives.js         # Adjectives module logic
│   │   ├── adverbs.js            # Adverbs module logic
│   │   ├── audio.js              # Audio/TTS management
│   │   ├── flashcards.js         # Flashcard functionality
│   │   ├── grammar.js            # Grammar module logic
│   │   ├── kanji.js              # Kanji module logic
│   │   ├── kanji-helper.js       # Kanji helper utilities
│   │   ├── kanji-stroke.js       # Kanji stroke order
│   │   ├── listening.js          # Listening module logic
│   │   ├── mastered.js           # Mastery tracking
│   │   ├── particles.js          # Particles module logic
│   │   ├── practiceTest.js       # Practice test logic
│   │   ├── print.js              # Print functionality
│   │   ├── sentenceBuilder.js    # Sentence builder logic
│   │   ├── storyMode.js          # Story mode logic
│   │   ├── ui.js                 # UI utilities
│   │   ├── verbs.js              # Verbs module logic
│   │   └── vocab.js              # Vocabulary module logic
│   └── utils/
│       ├── furigana.js           # Furigana rendering utilities
│       ├── helpers.js            # General helper functions
│       ├── kanaHelper.js         # Kana utilities
│       ├── particleExtractor.js  # Particle extraction utilities
│       └── tooltips.js           # Tooltip functionality
├── images/                      # App icons and assets
├── pdf/                         # PDF resources
│   ├── reading/                 # Reading practice materials
│   ├── reference/               # Grammar reference PDFs
│   └── writing/                 # Writing practice sheets
├── standalone/                  # Standalone HTML apps
│   ├── Dr-Wes-Robertson-Japanese.html
│   ├── Tony&Tamara-Japanese-Adventure.html
│   └── n5-Kanji-reference.html
└── videos/
    └── reading/                 # Video-based reading materials
        ├── level0/              # Level 0 reading videos
        ├── level1/              # Level 1 reading videos
        ├── level2/              # Level 2 reading videos
        ├── level3/              # Level 3 reading videos
        └── level4/              # Level 4 reading videos
🎯 Learning Modules
Vocabulary & Words
Word Search Puzzle: Find N5 vocabulary words in a letter grid with furigana support

Vocabulary Flashcards: Master N5 vocabulary with flip cards and TTS

Word Bank: Search any word with Jisho.org integration

Grammar & Particles
Particle Guide: Complete reference for は, が, を, に, で, へ, と, から, まで, の, も, か, よ, ね, や

Verb Conjugation: All N5 verbs with conjugation tables and quizzes

Adjective Guide: い-adjective and な-adjective conjugation with examples

Grammar Patterns: Essential JLPT N5 grammar with explanations and examples

Reading Practice
Story Mode: Graded reading with furigana and translation

Reading Resources: Video-based reading practice (Levels 0-4)

Conversations: Real-life dialogue practice

Listening Practice
Video Library: Listening comprehension with transcripts

TTS Support: All Japanese text can be read aloud

Speed Control: Adjustable speech speed (0.75x, 1.0x, 1.25x)

Writing Practice
Hiragana Practice: Writing practice sheets

Katakana Practice: Writing practice sheets

Kanji Practice: N5 kanji stroke order and writing practice

Practice Tests
Full JLPT N5 Practice Test: 50+ questions covering all sections

Timer Mode: Practice with timed conditions

Section Selection: Focus on specific JLPT sections

🔧 Configuration
Browser Requirements
Modern browser with ES6 support

Speech Synthesis API (for TTS)

Service Worker support (for PWA)

Data Structure
The app uses modular JavaScript with the following data structures:

Word Dictionary:

javascript
wordDict = {
  "食べる": {
    reading: "たべる",
    meaning: "to eat"
  }
}
Sentences:

javascript
sentencesData = [
  {
    jp: "日本語を勉強します。",
    translation: "I study Japanese."
  }
]
Kanji Data:

javascript
kanjiData = {
  "日": {
    on: ["ニチ", "ジツ"],
    kun: ["ひ", "か"],
    meaning: "sun, day",
    examples: ["日本", "日曜日"]
  }
}
🎨 Customization
Styling
The app uses CSS variables for easy customization:

css
:root {
  --bg-main: #f5f0eb;
  --text-primary: #2c3e2f;
  --accent-green: #6c8b6b;
  --font-family: 'Noto Sans JP', 'Segoe UI', sans-serif;
}
Fonts
The app uses Google Fonts:

Noto Sans JP: Main Japanese text

Noto Serif JP: Serif Japanese text

Inter: UI elements

Colors
Primary: #6c8b6b (Japanese green)

Background: #f5f0eb (Warm white)

Text: #2c3e2f (Dark green-gray)

Accent: #d4a373 (Warm gold)

🛠️ Development
Adding New Content
Add vocabulary: Update js/data/wordDict.js

Add sentences: Update js/data/sentences.js

Add kanji: Update js/data/kanjiData.js

Add stories: Update js/data/stories.js

Debugging
Open browser console for logs

All data loading is logged

Check localStorage for mastery data

Building for Production
Update manifest.json with your app details

Update sw.js with your cache strategy

Minify CSS and JS files

Optimize images

📱 PWA Installation
Chrome/Edge
Visit the app URL

Click the install icon in the address bar

Click "Install"

Safari (iOS)
Visit the app URL

Tap the Share button

Scroll down and tap "Add to Home Screen"

Android
Visit the app URL

Tap the three-dot menu

Tap "Install app"

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is for educational purposes. All content is free to use for personal study.

🙏 Acknowledgments
Dr. Wes Robertson (@ScriptingJapan) - Grammar guides and explanations

LingualabJP - Kanji reference materials

Jisho.org - Dictionary integration

All contributors and language learners

📞 Support
Issues: Open an issue on GitHub

Questions: Feel free to ask in the discussions

Happy Learning! 日本語の勉強をがんばりましょう！ 🎌

