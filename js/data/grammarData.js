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
    },

    // ============================================================
    // NEW: Additional N5 Grammar Points Added from JLPT N5 List
    // ============================================================

    {
        id: "g35",
        pattern: "〜おく",
        meaning: "to do in advance (preparatory action)",
        explanation: "Used to indicate that an action is done in advance or as preparation for something.",
        examples: [
            { sentence: "明日（あした）の試験（しけん）のために、勉強（べんきょう）しておく。", reading: "あしたのしけんのために、べんきょうしておく。", english: "I'll study in advance for tomorrow's exam." },
            { sentence: "お客（きゃく）さんが来（く）る前（まえ）に、部屋（へや）を掃除（そうじ）しておく。", reading: "おきゃくさんがくるまえに、へやをそうじしておく。", english: "I'll clean the room before the guests come." }
        ],
        questions: [
            {
                sentence: "友達（ともだち）が来（く）る前（まえ）に、ケーキを買（か）って（ ）。",
                correctAnswer: "おく",
                options: ["おく", "いる", "ある", "しまう"],
                explanation: "〜おく means to do something in advance as preparation."
            },
            {
                sentence: "旅行（りょこう）の前（まえ）に、切符（きっぷ）を予約（よやく）して（ ）。",
                correctAnswer: "おく",
                options: ["おく", "みる", "いく", "ある"],
                explanation: "〜おく indicates doing something in advance for future convenience."
            }
        ]
    },
    {
        id: "g36",
        pattern: "〜とか",
        meaning: "and/or, things like (non-exhaustive listing)",
        explanation: "Used to list examples of things, similar to 〜や but more casual. Often used with 〜とか～とか.",
        examples: [
            { sentence: "りんごとかバナナとか、果物（くだもの）が好（す）きです。", reading: "りんごとかばななとか、くだものがすきです。", english: "I like fruits like apples and bananas." },
            { sentence: "週末（しゅうまつ）は映画（えいが）とか音楽（おんがく）とかを楽（たの）しみます。", reading: "しゅうまつはえいがとかおんがくとかをたのしみます。", english: "I enjoy things like movies and music on weekends." }
        ],
        questions: [
            {
                sentence: "休（やす）みの日（ひ）は、テレビを見（み）る（ ）本（ほん）を読（よ）む（ ）して過（す）ごします。",
                correctAnswer: "とか",
                options: ["とか", "や", "と", "も"],
                explanation: "〜とか～とか is used to list non-exhaustive examples."
            },
            {
                sentence: "彼（かれ）はサッカー（ ）バスケットボール（ ）が好（す）きです。",
                correctAnswer: "とか",
                options: ["とか", "や", "と", "の"],
                explanation: "〜とか is used to list multiple examples in a casual way."
            }
        ]
    },
    {
        id: "g37",
        pattern: "〜ましょうか",
        meaning: "shall I? (offering to do something)",
        explanation: "Used when offering to do something for someone. It's a polite way to ask 'Shall I...?'",
        examples: [
            { sentence: "荷物（にもつ）を持（も）ちましょうか。", reading: "にもつをもちましょうか。", english: "Shall I carry your luggage?" },
            { sentence: "窓（まど）を開（あ）けましょうか。", reading: "まどをあけましょうか。", english: "Shall I open the window?" }
        ],
        questions: [
            {
                sentence: "重（おも）いスーツケースです。私（わたし）が（ ）か。",
                correctAnswer: "持ちましょう",
                options: ["持（も）ちましょう", "持（も）ちます", "持（も）ちません", "持（も）ちました"],
                explanation: "〜ましょうか is used when offering to do something for someone."
            },
            {
                sentence: "エアコンがついていません。（ ）か。",
                correctAnswer: "つけましょう",
                options: ["つけましょう", "つけます", "つけません", "つけた"],
                explanation: "〜ましょうか is a polite offer to do something."
            }
        ]
    },
    {
        id: "g38",
        pattern: "〜かもしれない",
        meaning: "may be, might, maybe",
        explanation: "Used to express uncertainty or possibility. Means 'might be' or 'maybe'.",
        examples: [
            { sentence: "明日（あした）は雨（あめ）が降（ふ）るかもしれない。", reading: "あしたはあめがふるかもしれない。", english: "It might rain tomorrow." },
            { sentence: "彼（かれ）は来（こ）ないかもしれない。", reading: "かれはこないかもしれない。", english: "He might not come." }
        ],
        questions: [
            {
                sentence: "明日（あした）は試験（しけん）がある（ ）。",
                correctAnswer: "かもしれない",
                options: ["かもしれない", "でしょう", "にちがいない", "はずだ"],
                explanation: "〜かもしれない expresses possibility or uncertainty."
            },
            {
                sentence: "あのレストランはもう閉（し）まっている（ ）。",
                correctAnswer: "かもしれない",
                options: ["かもしれない", "でしょう", "にちがいない", "はずだ"],
                explanation: "〜かもしれない is used when you're not sure about something."
            }
        ]
    },
    {
        id: "g39",
        pattern: "〜なければならない",
        meaning: "must, have to (obligation)",
        explanation: "Used to express obligation. Means 'must' or 'have to'.",
        examples: [
            { sentence: "毎日（まいにち）日本語（にほんご）を勉強（べんきょう）しなければならない。", reading: "まいにちにほんごをべんきょうしなければならない。", english: "I must study Japanese every day." },
            { sentence: "宿題（しゅくだい）を出（だ）さなければならない。", reading: "しゅくだいをださなければならない。", english: "I have to submit my homework." }
        ],
        questions: [
            {
                sentence: "学生（がくせい）は規則（きそく）を守（まも）ら（ ）。",
                correctAnswer: "なければならない",
                options: ["なければならない", "なくてもいい", "ないでください", "なければなりませんでした"],
                explanation: "〜なければならない expresses obligation or necessity."
            },
            {
                sentence: "明日（あした）は早（はや）く起（お）き（ ）。",
                correctAnswer: "なければならない",
                options: ["なければならない", "なくてもいい", "ないでください", "なければなりませんでした"],
                explanation: "〜なければならない means 'must' or 'have to'."
            }
        ]
    },
    {
        id: "g40",
        pattern: "〜やすい / 〜にくい",
        meaning: "easy to do / hard to do",
        explanation: "〜やすい means 'easy to do', 〜にくい means 'difficult to do'.",
        examples: [
            { sentence: "この本（ほん）は読（よ）みやすいです。", reading: "このほんはよみやすいです。", english: "This book is easy to read." },
            { sentence: "漢字（かんじ）は覚（おぼ）えにくいです。", reading: "かんじはおぼえにくいです。", english: "Kanji are hard to memorize." }
        ],
        questions: [
            {
                sentence: "このペンは書（か）き（ ）です。",
                correctAnswer: "やすい",
                options: ["やすい", "にくい", "づらい", "がち"],
                explanation: "〜やすい means 'easy to do'."
            },
            {
                sentence: "彼（かれ）は話（はな）し（ ）人（ひと）です。",
                correctAnswer: "にくい",
                options: ["やすい", "にくい", "づらい", "がち"],
                explanation: "〜にくい means 'difficult to do'."
            }
        ]
    },
    {
        id: "g41",
        pattern: "〜せる / 〜させる",
        meaning: "causative (make/let someone do something)",
        explanation: "Used to express causation - making or letting someone do something.",
        examples: [
            { sentence: "母（はは）は私（わたし）に野菜（やさい）を食（た）べさせる。", reading: "はははわたしにやさいをたべさせる。", english: "My mother makes me eat vegetables." },
            { sentence: "先生（せんせい）は生徒（せいと）に本（ほん）を読（よ）ませる。", reading: "せんせいはせいとにほんをよませる。", english: "The teacher makes the students read the book." }
        ],
        questions: [
            {
                sentence: "母（はは）は子供（こども）に野菜（やさい）を食（た）べ（ ）。",
                correctAnswer: "させる",
                options: ["させる", "られる", "てくれる", "てもらう"],
                explanation: "〜させる is the causative form meaning 'make/let someone do'."
            },
            {
                sentence: "上司（じょうし）は社員（しゃいん）に残業（ざんぎょう）を（ ）。",
                correctAnswer: "させる",
                options: ["させる", "られる", "てくれる", "てもらう"],
                explanation: "Causative form 〜させる means 'make someone do'."
            }
        ]
    },
    {
        id: "g42",
        pattern: "〜られる",
        meaning: "passive / potential (can do / is done)",
        explanation: "〜られる has two uses: passive (is done by) and potential (can do).",
        examples: [
            { sentence: "弟（おとうと）にケーキを食（た）べられた。", reading: "おとうとにけーきをたべられた。", english: "My cake was eaten by my little brother." },
            { sentence: "日本語（にほんご）が話（はな）せます。", reading: "にほんごがはなせます。", english: "I can speak Japanese." }
        ],
        questions: [
            {
                sentence: "友達（ともだち）に笑（わら）われ（ ）。",
                correctAnswer: "た",
                options: ["た", "る", "ない", "て"],
                explanation: "〜られる passive form: 'was laughed at by friend'."
            },
            {
                sentence: "私（わたし）は刺身（さしみ）が食（た）べ（ ）。",
                correctAnswer: "られる",
                options: ["られる", "させる", "てくれる", "てもらう"],
                explanation: "〜られる potential form: 'can eat'."
            }
        ]
    },
    {
        id: "g43",
        pattern: "〜という",
        meaning: "called, named, that (quotation)",
        explanation: "Used to introduce names, quotations, or to explain meaning.",
        examples: [
            { sentence: "これは「桜（さくら）」という花（はな）です。", reading: "これは「さくら」というはなです。", english: "This is a flower called 'Sakura'." },
            { sentence: "田中（たなか）さんという人（ひと）を知（し）っていますか。", reading: "たなかさんというひとをしっていますか。", english: "Do you know a person named Tanaka?" }
        ],
        questions: [
            {
                sentence: "これが「富士山（ふじさん）」という（ ）です。",
                correctAnswer: "山",
                options: ["山", "川", "湖", "海"],
                explanation: "〜という introduces the name of something."
            },
            {
                sentence: "「ありがとう」という（ ）は感謝（かんしゃ）を表（あらわ）します。",
                correctAnswer: "言葉（ことば）",
                options: ["言葉（ことば）", "名前（なまえ）", "場所（ばしょ）", "人（ひと）"],
                explanation: "〜という is used to explain the meaning of a word."
            }
        ]
    },
    {
        id: "g44",
        pattern: "〜について",
        meaning: "about, concerning",
        explanation: "Used to indicate the topic of discussion or thought.",
        examples: [
            { sentence: "日本（にほん）について話（はな）しましょう。", reading: "にほんについてはなしましょう。", english: "Let's talk about Japan." },
            { sentence: "その件（けん）について考（かんが）えています。", reading: "そのけんについてかんがえています。", english: "I'm thinking about that matter." }
        ],
        questions: [
            {
                sentence: "今日（きょう）の授業（じゅぎょう）は世界（せかい）の環境問題（かんきょうもんだい）（ ）です。",
                correctAnswer: "について",
                options: ["について", "にとって", "として", "によって"],
                explanation: "〜について means 'about' or 'concerning'."
            },
            {
                sentence: "この本（ほん）は日本（にほん）の文化（ぶんか）（ ）書（か）かれています。",
                correctAnswer: "について",
                options: ["について", "にとって", "として", "によって"],
                explanation: "〜について indicates the topic being discussed."
            }
        ]
    },
    {
        id: "g45",
        pattern: "〜にとって",
        meaning: "for, to (from someone's perspective)",
        explanation: "Used to express someone's perspective or opinion.",
        examples: [
            { sentence: "私（わたし）にとって、日本語（にほんご）は難（むずか）しいです。", reading: "わたしにとって、にほんごはむずかしいです。", english: "For me, Japanese is difficult." },
            { sentence: "学生（がくせい）にとって、この本（ほん）は役（やく）に立（た）ちます。", reading: "がくせいにとって、このほんはやくにたちます。", english: "This book is useful for students." }
        ],
        questions: [
            {
                sentence: "（ ）、健康（けんこう）が一番（いちばん）大切（たいせつ）です。",
                correctAnswer: "私（わたし）にとって",
                options: ["私（わたし）にとって", "私（わたし）について", "私（わたし）として", "私（わたし）によって"],
                explanation: "〜にとって expresses 'from my perspective'."
            },
            {
                sentence: "子供（こども）（ ）この映画（えいが）は少（すこ）し怖（こわ）いかもしれません。",
                correctAnswer: "にとって",
                options: ["にとって", "について", "として", "によって"],
                explanation: "〜にとって = 'for' or 'from the perspective of'."
            }
        ]
    },
    {
        id: "g46",
        pattern: "〜として",
        meaning: "as, in the capacity of",
        explanation: "Used to express someone's role, status, or position.",
        examples: [
            { sentence: "先生（せんせい）として、生徒（せいと）を指導（しどう）します。", reading: "せんせいとして、せいとをしどうします。", english: "I guide students as a teacher." },
            { sentence: "彼（かれ）は医者（いしゃ）として働（はたら）いています。", reading: "かれはいしゃとしてはたらいています。", english: "He works as a doctor." }
        ],
        questions: [
            {
                sentence: "彼（かれ）は日本人（にほんじん）（ ）日本語（にほんご）を教（おし）えています。",
                correctAnswer: "として",
                options: ["として", "にとって", "について", "によって"],
                explanation: "〜として = 'as' or 'in the capacity of'."
            },
            {
                sentence: "私（わたし）は父（ちち）の代理（だいり）（ ）会議（かいぎ）に出席（しゅっせき）しました。",
                correctAnswer: "として",
                options: ["として", "にとって", "について", "によって"],
                explanation: "〜として indicates acting in a certain role."
            }
        ]
    },
    {
        id: "g47",
        pattern: "〜によって",
        meaning: "by, according to, depending on",
        explanation: "Used to indicate means, cause, or depending on something.",
        examples: [
            { sentence: "この絵（え）は有名（ゆうめい）な画家（がか）によって描（か）かれました。", reading: "このえはゆうめいながかによってかかれました。", english: "This painting was done by a famous artist." },
            { sentence: "人（ひと）によって考（かんが）え方（かた）が違（ちが）います。", reading: "ひとによってかんがえかたがちがいます。", english: "People have different ways of thinking." }
        ],
        questions: [
            {
                sentence: "この商品（しょうひん）は高（たか）い（ ）生産（せいさん）されています。",
                correctAnswer: "技術（ぎじゅつ）によって",
                options: ["技術（ぎじゅつ）によって", "技術（ぎじゅつ）にとって", "技術（ぎじゅつ）について", "技術（ぎじゅつ）として"],
                explanation: "〜によって indicates the means or method."
            },
            {
                sentence: "結果（けっか）は状況（じょうきょう）（ ）変（か）わります。",
                correctAnswer: "によって",
                options: ["によって", "にとって", "について", "として"],
                explanation: "〜によって = 'depending on'."
            }
        ]
    }
];

const grammarOrder = grammarData.map(g => g.id);

function getGrammarById(id) {
    return grammarData.find(g => g.id === id);
}