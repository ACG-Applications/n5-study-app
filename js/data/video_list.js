// ==================== VIDEO LIST ====================
// All N5 listening practice videos with metadata and answers

const videoList = [
    {
        id: "n5_video_01",
        title: "JLPT N5 Practice Test 1 - Shopping & School",
        duration: "28:30",
        file: "videos/n5_video_01.mp4",
        thumbnail: "videos/thumbnails/video_01_icon.png",
        watched: false,
        formattedTranscript: `**👨‍🏫 Narrator:** これからN5（エヌゴ）の聴解（ちょうかい）試験（しけん）を始（はじ）めます。メモを取（と）ってもいいです。問題用紙（もんだいようし）を開（あ）けてください。

**👨‍🏫 Narrator:** 問題（もんだい）1では初（はじ）めに質問（しつもん）を聞（き）いてください。それから話（はなし）を聞（き）いて、問題用紙（もんだいようし）の1から4の中（なか）から1番（ばん）いいものを1つ選（えら）んでください。

**👨‍🏫 Narrator:** では練習（れんしゅう）しましょう。

**👨‍🏫 Narrator:** 例（れい）。家（いえ）で女（おんな）の人（ひと）が男（おとこ）の人（ひと）と話（はな）しています。女（おんな）の人（ひと）は男（おとこ）の人（ひと）に何（なに）を出（だ）しますか？

**👩 Woman:** 今日（きょう）は寒（さむ）いですね。温（あたた）かいものを飲（の）みませんか？

**👨 Man:** ありがとうございます。

**👩 Woman:** コーヒー、紅茶（こうちゃ）、あとお茶（ちゃ）もありますけど。

**👨 Man:** じゃあ紅茶（こうちゃ）をお願（ねが）いします。

**👩 Woman:** 砂糖（さとう）やミルクは入（い）れますか？

**👨 Man:** あ、はい。

**👨‍🏫 Narrator:** 男（おとこ）の人（ひと）に何（なに）を出（だ）しますか？1番（ばん）いいものは3番（ばん）です。`,
        questions: [
            { timestamp: "00:00", question: "Where is the man going?", answer: "Restroom" },
            { timestamp: "04:04", question: "Which page should the student open first?", answer: "Page 1" },
            { timestamp: "07:49", question: "Which teacher will the female student go to?", answer: "Tanaka sensei (male teacher with glasses, tall)" },
            { timestamp: "11:51", question: "What is the woman's birthday?", answer: "11th" },
            { timestamp: "15:09", question: "Where will the two people eat?", answer: "Sakura Park" },
            { timestamp: "18:47", question: "What will the woman eat?", answer: "Chicken dish" },
            { timestamp: "23:12", question: "How long to Tokyo by train?", answer: "How long does it take?" }
        ]
    },
    {
        id: "n5_video_02",
        title: "JLPT N5 Practice Test 2 - Cooking & Shopping",
        duration: "24:30",
        file: "videos/n5_video_02.mp4",
        thumbnail: "videos/thumbnails/video_02_icon.png",
        watched: false,
        formattedTranscript: `**👨‍🏫 Narrator:** これから音（おと）を聞（き）いてください。2021年第2回（だいにかい）日本語能力試験（にほんごのうりょくしけん）公会（こうかい）N5（エヌゴ）。これからN5（エヌゴ）の聴解（ちょうかい）試験（しけん）を始（はじ）めます。

**👨‍🏫 Narrator:** 問題（もんだい）1では初（はじ）めに質問（しつもん）を聞（き）いてください。それから話（はなし）を聞（き）いて、問題用紙（もんだいようし）の1から4の中（なか）から1番（ばん）いいものを1つ選（えら）んでください。`,
        questions: [
            { timestamp: "00:00", question: "What will the male student do immediately after?", answer: "Cut the meat" },
            { timestamp: "03:57", question: "Who will the staff give the gloves to?", answer: "The person with short hair and glasses" },
            { timestamp: "07:58", question: "What color hat will the female student give?", answer: "Yellow" },
            { timestamp: "11:26", question: "What does the international student do on Friday?", answer: "Study at the nearby library" },
            { timestamp: "15:24", question: "What sport does the international student do every day?", answer: "Basketball" },
            { timestamp: "18:49", question: "Which postcard did the two people choose?", answer: "The bridge picture postcard" }
        ]
    },
    {
        id: "n5_video_03",
        title: "JLPT N5 Practice Test 3 - Department Store & School",
        duration: "29:00",
        file: "videos/n5_video_03.mp4",
        thumbnail: "videos/thumbnails/video_03_icon.png",
        watched: false,
        formattedTranscript: `**👨‍🏫 Narrator:** 日本語能力試験完全模試（にほんごのうりょくしけんかんぜんもし）N5（エヌゴ）第2回（だいにかい）。これからN5（エヌゴ）の聴解（ちょうかい）試験（しけん）を始（はじ）めます。メモを取（と）ってもいいです。問題用紙（もんだいようし）を開（あ）けてください。`,
        questions: [
            { timestamp: "00:00", question: "Where is the man going?", answer: "Restroom" },
            { timestamp: "04:04", question: "Which page should the student open first?", answer: "Page 1" },
            { timestamp: "07:49", question: "Which teacher will the female student go to?", answer: "Tanaka sensei (male teacher with glasses, tall)" },
            { timestamp: "11:51", question: "What is the woman's birthday?", answer: "11th" },
            { timestamp: "15:27", question: "What will the woman eat at the restaurant?", answer: "Chicken dish" },
            { timestamp: "18:53", question: "What will the woman drink at the party?", answer: "Warm tea" }
        ]
    },
    {
        id: "n5_video_04",
        title: "JLPT N5 Practice Test 4 - Travel & Shopping",
        duration: "28:30",
        file: "videos/n5_video_04.mp4",
        thumbnail: "videos/thumbnails/video_04_icon.png",
        watched: false,
        formattedTranscript: `**👨‍🏫 Narrator:** 日本語能力試験完全模試（にほんごのうりょくしけんかんぜんもし）N5（エヌゴ）第1回（だいいっかい）。これからN5（エヌゴ）の聴解（ちょうかい）試験（しけん）を始（はじ）めます。メモを取（と）ってもいいです。問題用紙（もんだいようし）を開（あ）けてください。`,
        questions: [
            { timestamp: "00:00", question: "What will the students do first on the trip?", answer: "Take a photo" },
            { timestamp: "04:03", question: "Which floor will the man go to?", answer: "6th floor" },
            { timestamp: "07:50", question: "What color curtain will the female student buy?", answer: "White with no design" },
            { timestamp: "11:48", question: "How much will the woman pay at the post office?", answer: "410 yen" },
            { timestamp: "15:35", question: "How did the man travel to Osaka?", answer: "By bus" },
            { timestamp: "19:14", question: "Where will the woman go tomorrow afternoon?", answer: "Library" }
        ]
    },
    {
        id: "n5_video_05",
        title: "JLPT N5 Practice Test 5 - Daily Conversations",
        duration: "18:30",
        file: "videos/n5_video_05.mp4",
        thumbnail: "videos/thumbnails/video_05_icon.png",
        watched: false,
        formattedTranscript: `**👨‍🏫 Narrator:** 日本語能力試験模擬試験（にほんごのうりょくしけんもぎしけん）朝会（ちょうかい）N5（エヌゴ）。これからN5（エヌゴ）の聴解（ちょうかい）試験（しけん）を始（はじ）めます。メモを取（と）ってもいいです。問題用紙（もんだいようし）を開（あ）けてください。`,
        questions: [
            { timestamp: "00:00", question: "What will the man do immediately after?", answer: "Clean the room" },
            { timestamp: "03:13", question: "What will the woman make before going to the sea?", answer: "Make a bento lunchbox" },
            { timestamp: "06:31", question: "When and where will the man and woman meet?", answer: "Day after tomorrow (Sunday) for a meal" },
            { timestamp: "09:41", question: "When will the woman start her part-time job?", answer: "Next Monday" },
            { timestamp: "13:03", question: "How many hours of internet does the woman use daily?", answer: "2 hours" }
        ]
    },
    {
        id: "n5_video_06",
        title: "JLPT N5 Practice Test 6 - Photo Description & Gifts",
        duration: "27:00",
        file: "videos/n5_video_06.mp4",
        thumbnail: "videos/thumbnails/video_06_icon.png",
        watched: false,
        formattedTranscript: `**👨‍🏫 Narrator:** 日本語能力試験（にほんごのうりょくしけん）聴解（ちょうかい）N5（エヌゴ）。これからN5（エヌゴ）の聴解（ちょうかい）試験（しけん）を始（はじ）めます。メモを取（と）ってもいいです。問題用紙（もんだいようし）を開（あ）けてください。`,
        questions: [
            { timestamp: "00:00", question: "Which photo are they looking at?", answer: "Spring sea, with younger sister, forgot hat" },
            { timestamp: "03:48", question: "What will the teacher bring?", answer: "Sweets" },
            { timestamp: "07:49", question: "Which plate will the woman buy?", answer: "Plate with flower drawing" },
            { timestamp: "12:26", question: "Where will the two people meet?", answer: "Inside the department store" },
            { timestamp: "16:49", question: "What will the man do after this conversation?", answer: "Go eat" }
        ]
    },
    {
        id: "n5_video_07",
        title: "JLPT N5 Practice Test 7 - Cafe & Hospital",
        duration: "27:00",
        file: "videos/n5_video_07.mp4",
        thumbnail: "videos/thumbnails/video_07_icon.png",
        watched: false,
        formattedTranscript: `**👨‍🏫 Narrator:** 日本語能力試験（にほんごのうりょくしけん）聴解（ちょうかい）N5（エヌゴ）。これからN5（エヌゴ）の聴解（ちょうかい）試験（しけん）を始（はじ）めます。メモを取（と）ってもいいです。問題用紙（もんだいようし）を開（あ）けてください。`,
        questions: [
            { timestamp: "00:00", question: "What will the woman drink at the cafe?", answer: "Warm drink (warm tea)" },
            { timestamp: "03:46", question: "Which bag does the woman want to see?", answer: "Black, small bag" },
            { timestamp: "07:18", question: "What time will the two people meet?", answer: "3:00 (one hour before)" },
            { timestamp: "11:56", question: "How many copies will the male student make?", answer: "100 copies" },
            { timestamp: "16:31", question: "What is the man's birthday?", answer: "February 2nd" },
            { timestamp: "21:32", question: "What do you say when visiting a sick friend?", answer: "Odaiji ni (Take care)" }
        ]
    },
    {
        id: "n5_video_08",
        title: "JLPT N5 Practice Test 8 - Bank & Post Office",
        duration: "29:00",
        file: "videos/n5_video_08.mp4",
        thumbnail: "videos/thumbnails/video_08_icon.png",
        watched: false,
        formattedTranscript: `**👨‍🏫 Narrator:** これからN5（エヌゴ）の聴解（ちょうかい）試験（しけん）を始（はじ）めます。問題用紙（もんだいようし）にメモを取（と）ってもいいです。問題用紙（もんだいようし）を開（あ）けてください。`,
        questions: [
            { timestamp: "00:00", question: "How should the man write on the bank form?", answer: "Name in katakana, address in kanji+hiragana" },
            { timestamp: "03:38", question: "What will the man bring to the flower viewing?", answer: "2 bottles each of juice and tea" },
            { timestamp: "07:25", question: "When will the woman pick up her umbrella?", answer: "Saturday lunchtime" },
            { timestamp: "11:07", question: "What does the man's younger brother like?", answer: "Games" },
            { timestamp: "14:33", question: "How did the man come to school yesterday?", answer: "By taxi" },
            { timestamp: "18:22", question: "How many people went on the trip?", answer: "4 people (woman, husband, husband's parents)" }
        ]
    },
    {
        id: "n5_video_09",
        title: "JLPT N5 Practice Test 9 - Restaurant & Flowers",
        duration: "28:00",
        file: "videos/n5_video_09.mp4",
        thumbnail: "videos/thumbnails/video_09_icon.png",
        watched: false,
        formattedTranscript: `**👨‍🏫 Narrator:** N5（エヌゴ）聴解（ちょうかい）。これからN5（エヌゴ）の聴解（ちょうかい）試験（しけん）を始（はじ）めます。`,
        questions: [
            { timestamp: "00:00", question: "What will the woman do first at the passport office?", answer: "Take a photo on the 2nd floor" },
            { timestamp: "03:34", question: "What will the woman buy for lunch?", answer: "Sandwich, onigiri, bento" },
            { timestamp: "07:21", question: "When will the man go to the restaurant?", answer: "The day after tomorrow" },
            { timestamp: "10:45", question: "Which bag did the man forget?", answer: "Black, large bag with keys and letter" },
            { timestamp: "14:05", question: "What will the students bring to the museum?", answer: "Money, pen, notebook" },
            { timestamp: "17:26", question: "What job does the man's sister do?", answer: "Teach Japanese to foreigners" }
        ]
    }
];

// Load watched status from localStorage
function loadWatchedStatus() {
    const stored = localStorage.getItem('listening_watched');
    if (stored) {
        const watchedIds = JSON.parse(stored);
        videoList.forEach(video => {
            video.watched = watchedIds.includes(video.id);
        });
    }
}

// Save watched status to localStorage
function saveWatchedStatus() {
    const watchedIds = videoList.filter(v => v.watched).map(v => v.id);
    localStorage.setItem('listening_watched', JSON.stringify(watchedIds));
}

// Mark a video as watched
function markVideoWatched(videoId) {
    const video = videoList.find(v => v.id === videoId);
    if (video && !video.watched) {
        video.watched = true;
        saveWatchedStatus();
        return true;
    }
    return false;
}

// Get watched count
function getWatchedCount() {
    return videoList.filter(v => v.watched).length;
}

// Get total videos count
function getTotalCount() {
    return videoList.length;
}

// Initialize
loadWatchedStatus();