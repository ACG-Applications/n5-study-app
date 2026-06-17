// ==================== ADVERBS DATA ====================
// N5 Adverbs with furigana embedded in display property

const adverbsData = [
    {
        id: "chotto",
        dictionary: "ちょっと",
        display: "ちょっと",
        reading: "ちょっと",
        meaning: "a little",
        examples: [
            { sentence: "この料理（りょうり）はちょっと辛（から）いです", reading: "このりょうりはちょっとからいです", english: "This dish is a little spicy" }
        ]
    },
    {
        id: "choudo",
        dictionary: "丁度",
        display: "丁度（ちょうど）",
        reading: "ちょうど",
        meaning: "exactly",
        examples: [
            { sentence: "丁度（ちょうど）一（いち）万（まん）円（えん）です", reading: "ちょうどいちまんえんです", english: "It's exactly 10,000 yen" }
        ]
    },
    {
        id: "daijoubu",
        dictionary: "大丈夫",
        display: "大丈夫（だいじょうぶ）",
        reading: "だいじょうぶ",
        meaning: "OK, alright",
        examples: [
            { sentence: "大丈夫（だいじょうぶ）ですか", reading: "だいじょうぶですか", english: "Are you OK?" }
        ]
    },
    {
        id: "dandan",
        dictionary: "段々",
        display: "段々（だんだん）",
        reading: "だんだん",
        meaning: "gradually",
        examples: [
            { sentence: "天気（てんき）が段々（だんだん）良（よ）くなってきました", reading: "てんきがだんだんよくなってきました", english: "The weather has gradually gotten better" }
        ]
    },
    {
        id: "dou",
        dictionary: "どう",
        display: "どう",
        reading: "どう",
        meaning: "how",
        examples: [
            { sentence: "どうですか", reading: "どうですか", english: "How is it?" }
        ]
    },
    {
        id: "doumo",
        dictionary: "どうも",
        display: "どうも",
        reading: "どうも",
        meaning: "very much (thanks), very (sorry)",
        examples: [
            { sentence: "どうもありがとう", reading: "どうもありがとう", english: "Thank you very much" }
        ]
    },
    {
        id: "doushite",
        dictionary: "どうして",
        display: "どうして",
        reading: "どうして",
        meaning: "why",
        examples: [
            { sentence: "どうして来（こ）なかったの", reading: "どうしてこなかったの", english: "Why didn't you come?" }
        ]
    },
    {
        id: "douzo",
        dictionary: "どうぞ",
        display: "どうぞ",
        reading: "どうぞ",
        meaning: "please",
        examples: [
            { sentence: "どうぞお召（め）し上（あ）がりください", reading: "どうぞおめしあがりください", english: "Please enjoy your meal" }
        ]
    },
    {
        id: "hajimete",
        dictionary: "初めて",
        display: "初（はじ）めて",
        reading: "はじめて",
        meaning: "for the first time",
        examples: [
            { sentence: "初（はじ）めて日本（にほん）に行（い）きました", reading: "はじめてにほんにいきました", english: "I went to Japan for the first time" }
        ]
    },
    {
        id: "hitori",
        dictionary: "一人",
        display: "一人（ひとり）",
        reading: "ひとり",
        meaning: "alone, by oneself",
        examples: [
            { sentence: "一人（ひとり）でできる限（かぎ）りやります", reading: "ひとりでできるかぎりやります", english: "I'll do as much as I can by myself" }
        ]
    },
    {
        id: "ichiban",
        dictionary: "一番",
        display: "一番（いちばん）",
        reading: "いちばん",
        meaning: "most, best",
        examples: [
            { sentence: "夏（なつ）はアイスクリームが一番（いちばん）好（す）きです", reading: "なつはあいすくりーむがいちばんすきです", english: "In summer, I like ice cream the most" }
        ]
    },
    {
        id: "ikaga",
        dictionary: "いかが",
        display: "いかが",
        reading: "いかが",
        meaning: "how about",
        examples: [
            { sentence: "お茶（ちゃ）はいかがですか", reading: "おちゃはいかがですか", english: "How about some tea?" }
        ]
    },
    {
        id: "ikura",
        dictionary: "いくら",
        display: "いくら",
        reading: "いくら",
        meaning: "how much",
        examples: [
            { sentence: "いくらですか", reading: "いくらですか", english: "How much is it?" }
        ]
    },
    {
        id: "ikutsu",
        dictionary: "いくつ",
        display: "いくつ",
        reading: "いくつ",
        meaning: "how many, how old",
        examples: [
            { sentence: "いくつありますか", reading: "いくつありますか", english: "How many are there?" }
        ]
    },
    {
        id: "iroiro",
        dictionary: "色々",
        display: "色々（いろいろ）",
        reading: "いろいろ",
        meaning: "various",
        examples: [
            { sentence: "色々（いろいろ）な好（この）みがあります", reading: "いろいろなこのみがあります", english: "There are various preferences" }
        ]
    },
    {
        id: "isshoni",
        dictionary: "一緒に",
        display: "一緒（いっしょ）に",
        reading: "いっしょに",
        meaning: "together",
        examples: [
            { sentence: "友達（ともだち）と一緒（いっしょ）にご飯（はん）を食（た）べました", reading: "ともだちといっしょにごはんをたべました", english: "I ate a meal together with my friend" }
        ]
    },
    {
        id: "itsumo",
        dictionary: "いつも",
        display: "いつも",
        reading: "いつも",
        meaning: "always, usually",
        examples: [
            { sentence: "いつも笑顔（えがお）で話（はな）します", reading: "いつもえがおではなします", english: "I always speak with a smile" }
        ]
    },
    {
        id: "kekkou",
        dictionary: "結構",
        display: "結構（けっこう）",
        reading: "けっこう",
        meaning: "splendid, enough",
        examples: [
            { sentence: "結構（けっこう）です", reading: "けっこうです", english: "That's fine / No thank you" }
        ]
    },
    {
        id: "mada",
        dictionary: "まだ",
        display: "まだ",
        reading: "まだ",
        meaning: "still, not yet",
        examples: [
            { sentence: "まだ着（つ）いていないようです", reading: "まだついていないようです", english: "It seems he hasn't arrived yet" }
        ]
    },
    {
        id: "maeni",
        dictionary: "前に",
        display: "前（まえ）に",
        reading: "まえに",
        meaning: "before, in front of",
        examples: [
            { sentence: "前（まえ）に言（い）いました", reading: "まえにいいました", english: "I said it before" }
        ]
    },
    {
        id: "massugu",
        dictionary: "真っ直ぐ",
        display: "真っ直ぐ（まっすぐ）",
        reading: "まっすぐ",
        meaning: "straight ahead",
        examples: [
            { sentence: "真っ直（まっす）ぐ行（い）ってください", reading: "まっすぐいってください", english: "Please go straight" }
        ]
    },
    {
        id: "minna",
        dictionary: "皆",
        display: "皆（みんな）",
        reading: "みんな",
        meaning: "all, everyone",
        examples: [
            { sentence: "皆（みんな）で行（い）きます", reading: "みんなでいきます", english: "Everyone goes" }
        ]
    },
    {
        id: "motto",
        dictionary: "もっと",
        display: "もっと",
        reading: "もっと",
        meaning: "more",
        examples: [
            { sentence: "もっと安（やす）いのはありませんか", reading: "もっとやすいのはありませんか", english: "Don't you have something cheaper?" }
        ]
    },
    {
        id: "mou",
        dictionary: "もう",
        display: "もう",
        reading: "もう",
        meaning: "already, anymore, again",
        examples: [
            { sentence: "もう一度（いちど）言（い）ってください", reading: "もういちどいってください", english: "Please say it one more time" }
        ]
    },
    {
        id: "naze",
        dictionary: "何故",
        display: "何故（なぜ）",
        reading: "なぜ",
        meaning: "why",
        examples: [
            { sentence: "何故（なぜ）来（こ）なかったの", reading: "なぜこなかったの", english: "Why didn't you come?" }
        ]
    },
    {
        id: "onaji",
        dictionary: "同じ",
        display: "同じ（おなじ）",
        reading: "おなじ",
        meaning: "same",
        examples: [
            { sentence: "同（おな）じです", reading: "おなじです", english: "It's the same" }
        ]
    },
    {
        id: "suguni",
        dictionary: "直ぐに",
        display: "直ぐに（すぐに）",
        reading: "すぐに",
        meaning: "immediately",
        examples: [
            { sentence: "直（す）ぐに行（い）きます", reading: "すぐにいきます", english: "I'll go immediately" }
        ]
    },
    {
        id: "sukoshi",
        dictionary: "少し",
        display: "少（すこ）し",
        reading: "すこし",
        meaning: "a little",
        examples: [
            { sentence: "少（すこ）し辛（から）いです", reading: "すこしからいです", english: "It's a little spicy" }
        ]
    },
    {
        id: "tabun",
        dictionary: "多分",
        display: "多分（たぶん）",
        reading: "たぶん",
        meaning: "perhaps, probably",
        examples: [
            { sentence: "多分（たぶん）雨（あめ）が降（ふ）るでしょう", reading: "たぶんあめがふるでしょう", english: "It will probably rain" }
        ]
    },
    {
        id: "taihen",
        dictionary: "大変",
        display: "大変（たいへん）",
        reading: "たいへん",
        meaning: "very, greatly",
        examples: [
            { sentence: "大変（たいへん）でしたね", reading: "たいへんでしたね", english: "That was tough, wasn't it?" }
        ]
    },
    {
        id: "tokidoki",
        dictionary: "時々",
        display: "時々（ときどき）",
        reading: "ときどき",
        meaning: "sometimes",
        examples: [
            { sentence: "時々（ときどき）映画（えいが）を見（み）ます", reading: "ときどきえいがをみます", english: "I sometimes watch movies" }
        ]
    },
    {
        id: "totemo",
        dictionary: "とても",
        display: "とても",
        reading: "とても",
        meaning: "very",
        examples: [
            { sentence: "今日（きょう）はとても暑（あつ）いです", reading: "きょうはとてもあついです", english: "Today is very hot" }
        ]
    },
    {
        id: "yoku",
        dictionary: "良く",
        display: "良（よ）く",
        reading: "よく",
        meaning: "often, well",
        examples: [
            { sentence: "良（よ）く音楽（おんがく）を聞（き）きながら散歩（さんぽ）します", reading: "よくおんがくをききながらさんぽします", english: "I often take a walk while listening to music" }
        ]
    },
    {
        id: "yukkuri",
        dictionary: "ゆっくり",
        display: "ゆっくり",
        reading: "ゆっくり",
        meaning: "slowly",
        examples: [
            { sentence: "ゆっくり話（はな）してください", reading: "ゆっくりはなしてください", english: "Please speak slowly" }
        ]
    }
];

const adverbOrder = adverbsData.map(a => a.id);

function getAdverbById(id) {
    return adverbsData.find(a => a.id === id);
}