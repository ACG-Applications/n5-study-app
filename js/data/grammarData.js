// ==================== GRAMMAR DATA ====================
// Extracted from JLPT N5 Practice Test (Grammar Section)
// All Japanese text now has furigana in parentheses format

const grammarData = [
    // ========== Particle Questions (1-16) ==========
    {
        id: "q1",
        pattern: "NounA の NounB",
        meaning: "NounB of NounA / NounA's NounB",
        explanation: "The particle の connects two nouns, showing possession or relationship.",
        examples: [
            { sentence: "日本（にほん）のラーメンはおいしいです", reading: "にほんのらーめんはおいしいです", english: "Japanese ramen is delicious" },
            { sentence: "私（わたし）の本（ほん）です", reading: "わたしのほんです", english: "It's my book" }
        ],
        questions: [
            {
                sentence: "日本（にほん）（ ）ラーメンは おいしいです",
                correctAnswer: "の",
                options: ["に", "の", "を", "へ"],
                explanation: "の connects Japan and ramen - 'Japanese ramen'"
            }
        ]
    },
    {
        id: "q2",
        pattern: "A と B",
        meaning: "A and B",
        explanation: "The particle と connects nouns to list items.",
        examples: [
            { sentence: "弟（おとうと）と妹（いもうと）です", reading: "おとうとといもうとです", english: "It's (my) younger brother and younger sister" }
        ],
        questions: [
            {
                sentence: "弟（おとうと）（ ）妹（いもうと）です",
                correctAnswer: "と",
                options: ["は", "も", "と", "か"],
                explanation: "と connects 'younger brother' and 'younger sister'"
            }
        ]
    },
    {
        id: "q3",
        pattern: "Topic は",
        meaning: "As for... (topic marker)",
        explanation: "は marks the topic of the sentence.",
        examples: [
            { sentence: "田中（たなか）さんはきのうどこかに出かけましたか", reading: "たなかさんはきのうどこかにでかけましたか", english: "Did Tanaka-san go out somewhere yesterday?" }
        ],
        questions: [
            {
                sentence: "田中（たなか）さん（ ）きのう どこかに 出（で）かけましたか",
                correctAnswer: "は",
                options: ["で", "は", "を", "に"],
                explanation: "は marks Tanaka as the topic of the question"
            }
        ]
    },
    {
        id: "q4",
        pattern: "Direction に 曲がる",
        meaning: "Turn to the (direction)",
        explanation: "に marks the direction when using 曲がる (to turn).",
        examples: [
            { sentence: "右（みぎ）に曲（ま）がってください", reading: "みぎにまがってください", english: "Please turn right" }
        ],
        questions: [
            {
                sentence: "次（つぎ）の 角（かど）を 右（みぎ）（ ）曲（ま）がって ください",
                correctAnswer: "に",
                options: ["が", "や", "か", "に"],
                explanation: "に indicates the direction to turn"
            }
        ]
    },
    {
        id: "q5",
        pattern: "ひとりで",
        meaning: "alone, by oneself",
        explanation: "で indicates the manner or state of doing something.",
        examples: [
            { sentence: "一人（ひとり）で映画（えいが）を見（み）に行（い）きました", reading: "ひとりでえいがをみにいきました", english: "I went to watch a movie alone" }
        ],
        questions: [
            {
                sentence: "昨日（きのう）、私（わたし）は 一人（ひとり）（ ）映画（えいが）を 見（み）に 行（い）きました",
                correctAnswer: "で",
                options: ["が", "を", "で", "は"],
                explanation: "で indicates the manner/state (alone)"
            }
        ]
    },
    {
        id: "q6",
        pattern: "Person に 来てください",
        meaning: "Please come to (person)",
        explanation: "に marks the person being addressed or the destination.",
        examples: [
            { sentence: "田中（たなか）さんに来（き）てください", reading: "たなかさんにきてください", english: "Please come to Tanaka-san (Please come, Tanaka-san)" }
        ],
        questions: [
            {
                sentence: "田中（たなか）さん（ ）来（き）て ください",
                correctAnswer: "に",
                options: ["に", "も", "や", "で"],
                explanation: "に marks the person being addressed"
            }
        ]
    },
    {
        id: "q7",
        pattern: "NounA は NounB の ですか",
        meaning: "Does NounA belong to NounB?",
        explanation: "の indicates possession when asking 'Is this yours?'",
        examples: [
            { sentence: "この帽子（ぼうし）は山田（やまだ）さんのですか", reading: "このぼうしはやまださんのですか", english: "Is this hat Yamada-san's?" }
        ],
        questions: [
            {
                sentence: "この 帽子（ぼうし）は 山田（やまだ）さん（ ）ですか",
                correctAnswer: "の",
                options: ["や", "は", "の", "か"],
                explanation: "の shows possession (Yamada's hat)"
            }
        ]
    },
    {
        id: "q8",
        pattern: "Number ぐらい",
        meaning: "about (number), approximately",
        explanation: "ぐらい indicates an approximate amount.",
        examples: [
            { sentence: "1000円（えん）ぐらいです", reading: "せんえんぐらいです", english: "It's about 1000 yen" }
        ],
        questions: [
            {
                sentence: "駅（えき）まで タクシーで 1000円（えん）（ ）です",
                correctAnswer: "ぐらい",
                options: ["ぐらい", "など", "ごろ", "も"],
                explanation: "ぐらい means 'about' or 'approximately'"
            }
        ]
    },
    {
        id: "q9",
        pattern: "また (time word)",
        meaning: "See you (later/next week)",
        explanation: "Time expressions used with また to say goodbye.",
        examples: [
            { sentence: "また来週（らいしゅう）", reading: "またらいしゅう", english: "See you next week" }
        ],
        questions: [
            {
                sentence: "また（ ）",
                correctAnswer: "来週（らいしゅう）",
                options: ["おととい", "今日（きょう）", "来週（らいしゅう）", "今月（こんげつ）"],
                explanation: "来週 (らいしゅう) (next week) is the natural expression with また"
            }
        ]
    },
    {
        id: "q10",
        pattern: "A より B",
        meaning: "B is more ... than A",
        explanation: "より compares two things. The thing before より is the standard.",
        examples: [
            { sentence: "母（はは）は父（ちち）より5歳（さい）若（わか）いです", reading: "はははちちより5さいわかいです", english: "My mother is 5 years younger than my father" }
        ],
        questions: [
            {
                sentence: "母（はは）は 父（ちち）（ ）5歳（さい） 若（わか）いです",
                correctAnswer: "より",
                options: ["から", "まで", "より", "のほうが"],
                explanation: "より marks the standard for comparison"
            }
        ]
    },
    {
        id: "q11",
        pattern: "Verb-dictionary まえに",
        meaning: "before doing",
        explanation: "まえに follows a verb to mean 'before doing'.",
        examples: [
            { sentence: "食（た）べる前（まえ）に手（て）を洗（あら）います", reading: "たべるまえにてをあらいます", english: "I wash my hands before eating" }
        ],
        questions: [
            {
                sentence: "手（て）を 洗（あら）いましょう（ ）",
                correctAnswer: "まえに",
                options: ["まえに", "のまえに", "あとに", "のあとに"],
                explanation: "まえに follows the verb to mean 'before doing'"
            }
        ]
    },
    {
        id: "q12",
        pattern: "あまり + Negative",
        meaning: "not very, not much",
        explanation: "あまり is used with negative verbs to mean 'not very'.",
        examples: [
            { sentence: "あまり降（ふ）りませんでした", reading: "あまりふりませんでした", english: "It didn't rain much" }
        ],
        questions: [
            {
                sentence: "去年（きょねん）は あまり（ ）",
                correctAnswer: "ふりませんでした",
                options: ["ふりませんでした", "ふりません", "ふりました", "ふります"],
                explanation: "あまり requires a negative verb"
            }
        ]
    },
    {
        id: "q13",
        pattern: "Te-iru form",
        meaning: "is/are doing (ongoing action)",
        explanation: "〜ている indicates an action in progress.",
        examples: [
            { sentence: "魚（さかな）が泳（およ）いでいます", reading: "さかながおよいでいます", english: "Fish are swimming" }
        ],
        questions: [
            {
                sentence: "小（ちい）さな 魚（さかな）が たくさん（ ）よ",
                correctAnswer: "およいでいます",
                options: ["およぎます", "およぎません", "およぎました", "およいでいます"],
                explanation: "〜ている shows ongoing action (are swimming)"
            }
        ]
    },
    {
        id: "q14",
        pattern: "Person に もらう",
        meaning: "receive from (person)",
        explanation: "に marks the giver when using もらう (to receive).",
        examples: [
            { sentence: "兄（あに）にもらいました", reading: "あににもらいました", english: "I received (it) from my older brother" }
        ],
        questions: [
            {
                sentence: "これは 兄（あに）に（ ）",
                correctAnswer: "もらいました",
                options: ["あげました", "もらいました", "うりました", "かいました"],
                explanation: "もらう means 'to receive'. に marks the giver."
            }
        ]
    },
    {
        id: "q15",
        pattern: "何かで",
        meaning: "by/with something",
        explanation: "何か means 'something', で indicates the means.",
        examples: [
            { sentence: "何（なに）かで読（よ）みました", reading: "なにかでよみました", english: "I read (it) in something / somewhere" }
        ],
        questions: [
            {
                sentence: "作（つく）り方（かた）を（ ）読（よ）みました",
                correctAnswer: "何（なに）かで",
                options: ["何（なに）に", "何（なに）も", "何（なに）かへ", "何（なに）かで"],
                explanation: "何かで = 'in/with something'"
            }
        ]
    },
    {
        id: "q16",
        pattern: "Telephone phrase",
        meaning: "Please call (person) to the phone",
        explanation: "〜をおねがいします is used when asking to speak to someone on the phone.",
        examples: [
            { sentence: "ひろこさんをお願（ねが）いします", reading: "ひろこさんをおねがいします", english: "May I speak to Hiroko-san?" }
        ],
        questions: [
            {
                sentence: "すみません、（ ）",
                correctAnswer: "ひろこさんをお願（ねが）いします",
                options: [
                    "ひろこさんをお願（ねが）いします",
                    "ひろこさんをください",
                    "ひろこさんと話（はな）しますか",
                    "ひろこさんと話（はな）しませんか"
                ],
                explanation: "Telephone phrase to ask for someone"
            }
        ]
    },
    
    // ========== Reading Comprehension Questions (22-26) ==========
    {
        id: "q22",
        pattern: "てから",
        meaning: "after doing",
        explanation: "〜てから means 'after doing something'.",
        examples: [
            { sentence: "日本（にほん）に来（き）てから、いろいろな店（みせ）で食（た）べました", reading: "にほんにきてから、いろいろなみせでたべました", english: "After coming to Japan, I ate at various shops" }
        ],
        questions: [
            {
                sentence: "日本（にほん）に（ ）、いろいろな 店（みせ）で 食（た）べました",
                correctAnswer: "来（き）てから",
                options: ["行（い）くから", "行（い）ってから", "来（く）るから", "来（き）てから"],
                explanation: "てから = after doing (after coming to Japan)"
            }
        ]
    },
    {
        id: "q23",
        pattern: "〜ませんか",
        meaning: "shall we..., won't you...",
        explanation: "〜ませんか is an invitation meaning 'shall we?'",
        examples: [
            { sentence: "一緒（いっしょ）に行（い）きませんか", reading: "いっしょにいきませんか", english: "Shall we go together?" }
        ],
        questions: [
            {
                sentence: "寿司（すし）が 好（す）きな 人（ひと）は、 一緒（いっしょ）に（ ）",
                correctAnswer: "行（い）きませんか",
                options: ["行（い）きましたか", "行（い）きませんか", "行（い）っていましたか", "行（い）っていませんか"],
                explanation: "〜ませんか = invitation (shall we go?)"
            }
        ]
    },
    {
        id: "q24",
        pattern: "Noun の Noun",
        meaning: "Noun of Noun / Noun's Noun",
        explanation: "の connects nouns to modify or describe.",
        examples: [
            { sentence: "駅（えき）の近（ちか）くの本屋（ほんや）", reading: "えきのちかくのほんや", english: "the bookstore near the station" }
        ],
        questions: [
            {
                sentence: "本屋（ほんや）（ ）大（おお）きい お店（みせ）です",
                correctAnswer: "の",
                options: ["か", "と", "の", "は"],
                explanation: "の connects 'bookstore' to 'big store'"
            }
        ]
    },
    {
        id: "q25",
        pattern: "もある",
        meaning: "also exists / also has",
        explanation: "も means 'also', ある means 'exist'.",
        examples: [
            { sentence: "私（わたし）の国（くに）の本（ほん）もあります", reading: "わたしのくにのほんもあります", english: "There are also books from my country" }
        ],
        questions: [
            {
                sentence: "私（わたし）の 国（くに）のも（ ）",
                correctAnswer: "あります",
                options: ["います", "読（よ）みます", "あります", "します"],
                explanation: "も + ある = 'also exists'"
            }
        ]
    },
    {
        id: "q26",
        pattern: "それから",
        meaning: "and then, after that",
        explanation: "それから is used to sequence actions.",
        examples: [
            { sentence: "それから、本（ほん）はいつも駅（えき）の近（ちか）くの本屋（ほんや）で買（か）います", reading: "それから、ほんはいつもえきのちかくのほんやでかいます", english: "And after that, I always buy books at the bookstore near the station" }
        ],
        questions: [
            {
                sentence: "（ ）、本（ほん）は いつも 駅（えき）の 近（ちか）くの 本屋（ほんや）で 買（か）います",
                correctAnswer: "それから",
                options: ["だから", "では", "それから", "でも"],
                explanation: "それから = and then / after that"
            }
        ]
    }
];

const grammarOrder = grammarData.map(g => g.id);

function getGrammarById(id) {
    return grammarData.find(g => g.id === id);
}