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
            { sentence: "この 料理（りょうり） は ちょっと 辛（から）い です", reading: "この りょうり は ちょっと からい です", english: "This dish is a little spicy" }
        ]
    },
    {
        id: "choudo",
        dictionary: "丁度",
        display: "丁度（ちょうど）",
        reading: "ちょうど",
        meaning: "exactly",
        examples: [
            { sentence: "丁度（ちょうど） 一（いち）万（まん） 円（えん） です", reading: "ちょうど いちまん えん です", english: "It's exactly 10,000 yen" }
        ]
    },
    {
        id: "daijoubu",
        dictionary: "大丈夫",
        display: "大丈夫（だいじょうぶ）",
        reading: "だいじょうぶ",
        meaning: "OK, alright",
        examples: [
            { sentence: "大丈夫（だいじょうぶ） です か", reading: "だいじょうぶ です か", english: "Are you OK?" }
        ]
    },
    {
        id: "dandan",
        dictionary: "段々",
        display: "段々（だんだん）",
        reading: "だんだん",
        meaning: "gradually",
        examples: [
            { sentence: "天気（てんき） が 段々（だんだん） 良（よ）く なって きました", reading: "てんき が だんだん よく なって きました", english: "The weather has gradually gotten better" }
        ]
    },
    {
        id: "dou",
        dictionary: "どう",
        display: "どう",
        reading: "どう",
        meaning: "how",
        examples: [
            { sentence: "どう です か", reading: "どう です か", english: "How is it?" }
        ]
    },
    {
        id: "doumo",
        dictionary: "どうも",
        display: "どうも",
        reading: "どうも",
        meaning: "very much (thanks), very (sorry)",
        examples: [
            { sentence: "どうも ありがとう", reading: "どうも ありがとう", english: "Thank you very much" }
        ]
    },
    {
        id: "doushite",
        dictionary: "どうして",
        display: "どうして",
        reading: "どうして",
        meaning: "why",
        examples: [
            { sentence: "どうして 来（こ）なかった の", reading: "どうして こなかった の", english: "Why didn't you come?" }
        ]
    },
    {
        id: "douzo",
        dictionary: "どうぞ",
        display: "どうぞ",
        reading: "どうぞ",
        meaning: "please",
        examples: [
            { sentence: "どうぞ お召（め）し上（あ）がり ください", reading: "どうぞ おめしあがり ください", english: "Please enjoy your meal" }
        ]
    },
    {
        id: "hajimete",
        dictionary: "初めて",
        display: "初（はじ）めて",
        reading: "はじめて",
        meaning: "for the first time",
        examples: [
            { sentence: "初（はじ）めて 日本（にほん） に 行（い）きました", reading: "はじめて にほん に いきました", english: "I went to Japan for the first time" }
        ]
    },
    {
        id: "hitori",
        dictionary: "一人",
        display: "一人（ひとり）",
        reading: "ひとり",
        meaning: "alone, by oneself",
        examples: [
            { sentence: "一人（ひとり） で できる 限（かぎ）り やります", reading: "ひとり で できる かぎり やります", english: "I'll do as much as I can by myself" }
        ]
    },
    {
        id: "ichiban",
        dictionary: "一番",
        display: "一番（いちばん）",
        reading: "いちばん",
        meaning: "most, best",
        examples: [
            { sentence: "夏（なつ） は アイスクリーム が 一番（いちばん） 好（す）き です", reading: "なつ は あいすくりーむ が いちばん すき です", english: "In summer, I like ice cream the most" }
        ]
    },
    {
        id: "ikaga",
        dictionary: "いかが",
        display: "いかが",
        reading: "いかが",
        meaning: "how about",
        examples: [
            { sentence: "お茶（ちゃ） は いかが です か", reading: "おちゃ は いかが です か", english: "How about some tea?" }
        ]
    },
    {
        id: "ikura",
        dictionary: "いくら",
        display: "いくら",
        reading: "いくら",
        meaning: "how much",
        examples: [
            { sentence: "いくら です か", reading: "いくら です か", english: "How much is it?" }
        ]
    },
    {
        id: "ikutsu",
        dictionary: "いくつ",
        display: "いくつ",
        reading: "いくつ",
        meaning: "how many, how old",
        examples: [
            { sentence: "いくつ あります か", reading: "いくつ あります か", english: "How many are there?" }
        ]
    },
    {
        id: "iroiro",
        dictionary: "色々",
        display: "色々（いろいろ）",
        reading: "いろいろ",
        meaning: "various",
        examples: [
            { sentence: "色々（いろいろ）な 好（この）み が あります", reading: "いろいろな このみ が あります", english: "There are various preferences" }
        ]
    },
    {
        id: "isshoni",
        dictionary: "一緒に",
        display: "一緒（いっしょ）に",
        reading: "いっしょに",
        meaning: "together",
        examples: [
            { sentence: "友達（ともだち） と 一緒（いっしょ）に ご飯（はん） を 食（た）べました", reading: "ともだち と いっしょに ごはん を たべました", english: "I ate a meal together with my friend" }
        ]
    },
    {
        id: "itsumo",
        dictionary: "いつも",
        display: "いつも",
        reading: "いつも",
        meaning: "always, usually",
        examples: [
            { sentence: "いつも 笑顔（えがお） で 話（はな）します", reading: "いつも えがお で はなします", english: "I always speak with a smile" }
        ]
    },
    {
        id: "kekkou",
        dictionary: "結構",
        display: "結構（けっこう）",
        reading: "けっこう",
        meaning: "splendid, enough",
        examples: [
            { sentence: "結構（けっこう） です", reading: "けっこう です", english: "That's fine / No thank you" }
        ]
    },
    {
        id: "mada",
        dictionary: "まだ",
        display: "まだ",
        reading: "まだ",
        meaning: "still, not yet",
        examples: [
            { sentence: "まだ 着（つ）いて いない ようです", reading: "まだ ついて いない ようです", english: "It seems he hasn't arrived yet" }
        ]
    },
    {
        id: "maeni",
        dictionary: "前に",
        display: "前（まえ）に",
        reading: "まえに",
        meaning: "before, in front of",
        examples: [
            { sentence: "前（まえ）に 言（い）いました", reading: "まえに いいました", english: "I said it before" }
        ]
    },
    {
        id: "massugu",
        dictionary: "真っ直ぐ",
        display: "真っ直ぐ（まっすぐ）",
        reading: "まっすぐ",
        meaning: "straight ahead",
        examples: [
            { sentence: "真っ直（まっす）ぐ 行（い）って ください", reading: "まっすぐ いって ください", english: "Please go straight" }
        ]
    },
    {
        id: "minna",
        dictionary: "皆",
        display: "皆（みんな）",
        reading: "みんな",
        meaning: "all, everyone",
        examples: [
            { sentence: "皆（みんな） で 行（い）きます", reading: "みんな で いきます", english: "Everyone goes" }
        ]
    },
    {
        id: "motto",
        dictionary: "もっと",
        display: "もっと",
        reading: "もっと",
        meaning: "more",
        examples: [
            { sentence: "もっと 安（やす）い の は ありません か", reading: "もっと やすい の は ありません か", english: "Don't you have something cheaper?" }
        ]
    },
    {
        id: "mou",
        dictionary: "もう",
        display: "もう",
        reading: "もう",
        meaning: "already, anymore, again",
        examples: [
            { sentence: "もう 一度（いちど） 言（い）って ください", reading: "もう いちど いって ください", english: "Please say it one more time" }
        ]
    },
    {
        id: "naze",
        dictionary: "何故",
        display: "何故（なぜ）",
        reading: "なぜ",
        meaning: "why",
        examples: [
            { sentence: "何故（なぜ） 来（こ）なかった の", reading: "なぜ こなかった の", english: "Why didn't you come?" }
        ]
    },
    {
        id: "onaji",
        dictionary: "同じ",
        display: "同じ（おなじ）",
        reading: "おなじ",
        meaning: "same",
        examples: [
            { sentence: "同（おな）じ です", reading: "おなじ です", english: "It's the same" }
        ]
    },
    {
        id: "suguni",
        dictionary: "直ぐに",
        display: "直ぐに（すぐに）",
        reading: "すぐに",
        meaning: "immediately",
        examples: [
            { sentence: "直（す）ぐに 行（い）きます", reading: "すぐに いきます", english: "I'll go immediately" }
        ]
    },
    {
        id: "sukoshi",
        dictionary: "少し",
        display: "少（すこ）し",
        reading: "すこし",
        meaning: "a little",
        examples: [
            { sentence: "少（すこ）し 辛（から）い です", reading: "すこし からい です", english: "It's a little spicy" }
        ]
    },
    {
        id: "tabun",
        dictionary: "多分",
        display: "多分（たぶん）",
        reading: "たぶん",
        meaning: "perhaps, probably",
        examples: [
            { sentence: "多分（たぶん） 雨（あめ） が 降（ふ）る でしょう", reading: "たぶん あめ が ふる でしょう", english: "It will probably rain" }
        ]
    },
    {
        id: "taihen",
        dictionary: "大変",
        display: "大変（たいへん）",
        reading: "たいへん",
        meaning: "very, greatly",
        examples: [
            { sentence: "大変（たいへん） でした ね", reading: "たいへん でした ね", english: "That was tough, wasn't it?" }
        ]
    },
    {
        id: "tokidoki",
        dictionary: "時々",
        display: "時々（ときどき）",
        reading: "ときどき",
        meaning: "sometimes",
        examples: [
            { sentence: "時々（ときどき） 映画（えいが） を 見（み）ます", reading: "ときどき えいが を みます", english: "I sometimes watch movies" }
        ]
    },
    {
        id: "totemo",
        dictionary: "とても",
        display: "とても",
        reading: "とても",
        meaning: "very",
        examples: [
            { sentence: "今日（きょう） は とても 暑（あつ）い です", reading: "きょう は とても あつい です", english: "Today is very hot" }
        ]
    },
    {
        id: "yoku",
        dictionary: "良く",
        display: "良（よ）く",
        reading: "よく",
        meaning: "often, well",
        examples: [
            { sentence: "良（よ）く 音楽（おんがく） を 聞（き）きながら 散歩（さんぽ）します", reading: "よく おんがく を ききながら さんぽします", english: "I often take a walk while listening to music" }
        ]
    },
    {
        id: "yukkuri",
        dictionary: "ゆっくり",
        display: "ゆっくり",
        reading: "ゆっくり",
        meaning: "slowly",
        examples: [
            { sentence: "ゆっくり 話（はな）して ください", reading: "ゆっくり はなして ください", english: "Please speak slowly" }
        ]
    }
];

const adverbOrder = adverbsData.map(a => a.id);

function getAdverbById(id) {
    return adverbsData.find(a => a.id === id);
}