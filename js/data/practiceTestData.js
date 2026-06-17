// ==================== JLPT N5 PRACTICE TEST DATA ====================
// Complete questions from Vocabulary, Grammar, Reading, Listening sections

const practiceTestData = {
    vocabulary: [
        // Question 11: Katakana reading
        {
            id: "vocab_11",
            section: "vocabulary",
            type: "reading",
            question: "けさ しゃわーを あびました。",
            image: null,
            options: ["1 シャワー", "2 シャウー", "3 シャワー", "4 シャウー"],
            correctAnswer: "1",
            explanation: "シャワー = shower",
            furigana: "けさ シャワーを あびました"
        },
        // Question 12: Kanji selection - drink
        {
            id: "vocab_12",
            section: "vocabulary",
            type: "kanji",
            question: "コーヒーを のみました。",
            image: null,
            options: ["1 飯みました", "2 飲みました", "3 飲みました", "4 飲みました"],
            correctAnswer: "2",
            explanation: "飲む (のむ) = to drink",
            furigana: "コーヒーを 飲(の)みました"
        },
        // Question 13: Kanji selection - car
        {
            id: "vocab_13",
            section: "vocabulary",
            type: "kanji",
            question: "あたらしい くるまを かいました。",
            image: null,
            options: ["1 卓", "2 車", "3 車", "4 車"],
            correctAnswer: "2",
            explanation: "車 (くるま) = car",
            furigana: "新(あたら)しい 車(くるま)を 買(か)いました"
        },
        // Question 14: Kanji + counter - yen
        {
            id: "vocab_14",
            section: "vocabulary",
            type: "kanji",
            question: "この ぼうしは 1000えんです。",
            image: null,
            options: ["1 1000内", "2 1000用", "3 1000冊", "4 1000円"],
            correctAnswer: "4",
            explanation: "円 (えん) = yen (Japanese currency)",
            furigana: "この 帽子(ぼうし)は 1000円(えん)です"
        },
        // Question 15: Kanji selection - half
        {
            id: "vocab_15",
            section: "vocabulary",
            type: "kanji",
            question: "しゅくだいが はんぶん おわりました。",
            image: null,
            options: ["1 羊分", "2 半分", "3 羊分", "4 半分"],
            correctAnswer: "2",
            explanation: "半分 (はんぶん) = half",
            furigana: "宿題(しゅくだい)が 半分(はんぶん) 終(お)わりました"
        },
        // Question 16: Kanji selection - come
        {
            id: "vocab_16",
            section: "vocabulary",
            type: "kanji",
            question: "わたしの うちに きませんか。",
            image: null,
            options: ["1 来ませんか", "2 来ませんか", "3 木ませんか", "4 未ませんか"],
            correctAnswer: "1",
            explanation: "来る (くる) = to come",
            furigana: "私(わたし)の 家(うち)に 来(き)ませんか"
        },
        // Question 17: Kanji selection - meet
        {
            id: "vocab_17",
            section: "vocabulary",
            type: "kanji",
            question: "きのう たなかさんと あいました。",
            image: null,
            options: ["1 見いました", "2 書いました", "3 会いました", "4 話いました"],
            correctAnswer: "3",
            explanation: "会う (あう) = to meet",
            furigana: "昨日(きのう) 田中(たなか)さんと 会(あ)いました"
        },
        // Question 18: Kanji selection - same
        {
            id: "vocab_18",
            section: "vocabulary",
            type: "kanji",
            question: "いもうとと おなじ ふくを かいました。",
            image: null,
            options: ["1 同じ", "2 同じ", "3 同じ", "4 同じ"],
            correctAnswer: "1",
            explanation: "同じ (おなじ) = same",
            furigana: "妹(いもうと)と 同(おな)じ 服(ふく)を 買(か)いました"
        },
        // Question 19: Vocabulary choice - apartment
        {
            id: "vocab_19",
            section: "vocabulary",
            type: "choice",
            question: "わたしの へやは この（ ）の 2かいです。",
            image: null,
            options: ["1 エレベーター", "2 プール", "3 エアコン", "4 アパート"],
            correctAnswer: "4",
            explanation: "アパート = apartment",
            furigana: "私(わたし)の 部屋(へや)は この アパートの 2階(かい)です"
        },
        // Question 20: Verb choice - play instrument
        {
            id: "vocab_20",
            section: "vocabulary",
            type: "choice",
            question: "さとうさんは ギターを じょうずに（ ）。",
            image: null,
            options: ["1 うたいます", "2 ききます", "3 ひきます", "4 あそびます"],
            correctAnswer: "3",
            explanation: "弾く (ひく) = to play (string instrument)",
            furigana: "佐藤(さとう)さんは ギターを 上手(じょうず)に 弾(ひ)きます"
        },
        // Question 21: Verb choice - arrange
        {
            id: "vocab_21",
            section: "vocabulary",
            type: "choice",
            question: "テーブルに おさらと はしを（ ）ください。",
            image: null,
            options: ["1 ならべて", "2 とって", "3 たべて", "4 あらって"],
            correctAnswer: "1",
            explanation: "並べる (ならべる) = to arrange, line up",
            furigana: "テーブルに お皿(さら)と 箸(はし)を 並(なら)べてください"
        },
        // Question 22: Adjective choice - clean
        {
            id: "vocab_22",
            section: "vocabulary",
            type: "choice",
            question: "けさ そうじを したから へやは（ ）です。",
            image: null,
            options: ["1 きれい", "2 きたない", "3 あかるい", "4 くらい"],
            correctAnswer: "1",
            explanation: "きれい = clean, beautiful",
            furigana: "今朝(けさ) 掃除(そうじ)を したから 部屋(へや)は きれいです"
        },
        // Question 23: Counter - meters
        {
            id: "vocab_23",
            section: "vocabulary",
            type: "choice",
            question: "きょうは 500（ ）およぎました。",
            image: null,
            options: ["1 ど", "2 ばん", "3 メートル", "4 グラム"],
            correctAnswer: "3",
            explanation: "メートル = meter (unit of length)",
            furigana: "今日(きょう)は 500メートル 泳(およ)ぎました"
        },
        // Question 24: Noun choice - map
        {
            id: "vocab_24",
            section: "vocabulary",
            type: "choice",
            question: "えきから たいしかんまでの（ ）を かいて ください。",
            image: null,
            options: ["1 しゃしん", "2 ちず", "3 てがみ", "4 きっぷ"],
            correctAnswer: "2",
            explanation: "地図 (ちず) = map",
            furigana: "駅(えき)から 大使館(たいしかん)までの 地図(ちず)を 書(か)いてください"
        },
        // Question 25: Verb choice - turn off
        {
            id: "vocab_25",
            section: "vocabulary",
            type: "choice",
            question: "うるさいから テレビを（ ）ください。",
            image: null,
            options: ["1 けして", "2 つけて", "3 しめて", "4 あけて"],
            correctAnswer: "1",
            explanation: "消す (けす) = to turn off",
            furigana: "うるさいから テレビを 消(け)してください"
        },
        // Question 26: Noun choice - snow
        {
            id: "vocab_26",
            section: "vocabulary",
            type: "choice",
            question: "きょうは（ ）が ふって います。",
            image: null,
            options: ["1 くもり", "2 はれ", "3 かぜ", "4 ゆき"],
            correctAnswer: "4",
            explanation: "雪 (ゆき) = snow",
            furigana: "今日(きょう)は 雪(ゆき)が 降(ふ)っています"
        },
        // Question 27: Counter - four items
        {
            id: "vocab_27",
            section: "vocabulary",
            type: "choice",
            question: "はこに りんごが（ ）あります。",
            image: null,
            options: ["1 よっつ", "2 いっつ", "3 むっつ", "4 ななつ"],
            correctAnswer: "1",
            explanation: "四つ (よっつ) = four (general counter)",
            furigana: "箱(はこ)に 林檎(りんご)が 四(よ)っつ あります"
        },
        // Question 28: Position - on top
        {
            id: "vocab_28",
            section: "vocabulary",
            type: "choice",
            question: "めがねは つくえの（ ）に あります。",
            image: null,
            options: ["1 そば", "2 よこ", "3 した", "4 うえ"],
            correctAnswer: "4",
            explanation: "上 (うえ) = on top of",
            furigana: "眼鏡(めがね)は 机(つくえ)の 上(うえ)に あります"
        },
        // Question 31: Opposite meaning
        {
            id: "vocab_31",
            section: "vocabulary",
            type: "meaning",
            question: "その えいがは おもしろくなかったです。",
            image: null,
            options: [
                "1 その えいがは たのしかったです",
                "2 その えいがは つまらなかったです",
                "3 その えいがは みじかかったです",
                "4 その えいがは なかかったです"
            ],
            correctAnswer: "2",
            explanation: "おもしろくない = not interesting → つまらない = boring",
            furigana: "その 映画(えいが)は 面白(おもしろ)くなかったです"
        },
        // Question 32: Word meaning - birthday
        {
            id: "vocab_32",
            section: "vocabulary",
            type: "meaning",
            question: "たんじょうびは ６がつ15にちです。",
            image: null,
            options: [
                "1 6がつ15にちに けっこんしました",
                "2 6がつ15にちに テストが はじまりました",
                "3 6がつ15にちに うまれました",
                "4 6がつ15にちに くにへ かえりました"
            ],
            correctAnswer: "3",
            explanation: "たんじょうび = birthday → the day you were born",
            furigana: "誕生日(たんじょうび)は 6月15日(ろくがつじゅうごにち)です"
        },
        // Question 33: Time expression - two years ago
        {
            id: "vocab_33",
            section: "vocabulary",
            type: "meaning",
            question: "にねんまえに きょうとへ いきました。",
            image: null,
            options: [
                "1 きのう きょうとへ いきました",
                "2 おととい きょうとへ いきました",
                "3 きょねん きょうとへ いきました",
                "4 おととし きょうとへ いきました"
            ],
            correctAnswer: "4",
            explanation: "にねんまえ = two years ago → おととし = the year before last",
            furigana: "二年前(にねんまえ)に 京都(きょうと)へ 行(い)きました"
        }
    ],

    grammar: [
        // Question 1: Particle の
        {
            id: "grammar_1",
            section: "grammar",
            type: "particle",
            question: "日本（ ）ラーメンは おいしいです。",
            image: null,
            options: ["1 に", "2 の", "3 を", "4 へ"],
            correctAnswer: "2",
            explanation: "の connects nouns - 'Japanese ramen'",
            furigana: "日本(にほん)のラーメンは 美味(おい)しいです"
        },
        // Question 2: Particle と
        {
            id: "grammar_2",
            section: "grammar",
            type: "particle",
            question: "弟（ ）妹です。",
            image: null,
            options: ["1 は", "2 も", "3 と", "4 か"],
            correctAnswer: "3",
            explanation: "と connects nouns - 'A and B'",
            furigana: "弟(おとうと)と 妹(いもうと)です"
        },
        // Question 3: Particle は (topic)
        {
            id: "grammar_3",
            section: "grammar",
            type: "particle",
            question: "田中さん（ ）きのう どこかに 出かけましたか。",
            image: null,
            options: ["1 で", "2 は", "3 を", "4 に"],
            correctAnswer: "2",
            explanation: "は marks the topic of the sentence",
            furigana: "田中(たなか)さんは 昨日(きのう) どこかに 出(で)かけましたか"
        },
        // Question 4: Particle に (direction)
        {
            id: "grammar_4",
            section: "grammar",
            type: "particle",
            question: "つぎの かどを みぎ（ ）まがって ください。",
            image: null,
            options: ["1 が", "2 や", "3 か", "4 に"],
            correctAnswer: "4",
            explanation: "に indicates direction when turning",
            furigana: "次(つぎ)の 角(かど)を 右(みぎ)に 曲(ま)がってください"
        },
        // Question 5: Particle で (manner)
        {
            id: "grammar_5",
            section: "grammar",
            type: "particle",
            question: "きのう、わたしは ひとり（ ）えいがを 見に 行きました。",
            image: null,
            options: ["1 が", "2 を", "3 で", "4 は"],
            correctAnswer: "3",
            explanation: "で indicates manner/state (alone)",
            furigana: "昨日(きのう)、私(わたし)は 一人(ひとり)で 映画(えいが)を 見(み)に 行(い)きました"
        },
        // Question 6: Particle に (destination)
        {
            id: "grammar_6",
            section: "grammar",
            type: "particle",
            question: "田中さん（ ）来て ください。",
            image: null,
            options: ["1 に", "2 も", "3 や", "4 で"],
            correctAnswer: "1",
            explanation: "に marks the person being addressed",
            furigana: "田中(たなか)さんに 来(き)てください"
        },
        // Question 7: Particle の (possession)
        {
            id: "grammar_7",
            section: "grammar",
            type: "particle",
            question: "この ぼうしは 山田さん（ ）ですか。",
            image: null,
            options: ["1 や", "2 は", "3 の", "4 か"],
            correctAnswer: "3",
            explanation: "の shows possession - 'Yamada's hat?'",
            furigana: "この 帽子(ぼうし)は 山田(やまだ)さんのですか"
        },
        // Question 8: ぐらい (approximately)
        {
            id: "grammar_8",
            section: "grammar",
            type: "expression",
            question: "駅まで タクシーで 1000円（ ）です。",
            image: null,
            options: ["1 ぐらい", "2 など", "3 ごろ", "4 も"],
            correctAnswer: "1",
            explanation: "ぐらい = about, approximately",
            furigana: "駅(えき)まで タクシーで 1000円(えん)ぐらいです"
        },
        // Question 9: Time expression
        {
            id: "grammar_9",
            section: "grammar",
            type: "expression",
            question: "また（ ）。",
            image: null,
            options: ["1 おととい", "2 今日", "3 来週", "4 今月"],
            correctAnswer: "3",
            explanation: "また来週 = see you next week",
            furigana: "また 来週(らいしゅう)"
        },
        // Question 10: より (comparison)
        {
            id: "grammar_10",
            section: "grammar",
            type: "particle",
            question: "母は 父（ ）5さい わかいです。",
            image: null,
            options: ["1 から", "2 まで", "3 より", "4 のほうが"],
            correctAnswer: "3",
            explanation: "より marks the standard in comparison",
            furigana: "母(はは)は 父(ちち)より 5歳(さい) 若(わか)いです"
        },
        // Question 11: まえに (before)
        {
            id: "grammar_11",
            section: "grammar",
            type: "expression",
            question: "手を あらいましょう（ ）。",
            image: null,
            options: ["1 まえに", "2 のまえに", "3 あとに", "4 のあとに"],
            correctAnswer: "1",
            explanation: "〜まえに = before doing",
            furigana: "手(て)を 洗(あら)いましょう 前(まえ)に"
        },
        // Question 12: あまり + negative
        {
            id: "grammar_12",
            section: "grammar",
            type: "expression",
            question: "きょねんは あまり（ ）。",
            image: null,
            options: ["1 ふりませんでした", "2 ふりません", "3 ふりました", "4 ふります"],
            correctAnswer: "1",
            explanation: "あまり + negative = not very much",
            furigana: "去年(きょねん)は あまり 降(ふ)りませんでした"
        },
        // Question 13: Te-iru (ongoing action)
        {
            id: "grammar_13",
            section: "grammar",
            type: "conjugation",
            question: "小さな 魚が たくさん（ ）よ。",
            image: null,
            options: ["1 およぎます", "2 およぎません", "3 およぎました", "4 およいでいます"],
            correctAnswer: "4",
            explanation: "〜ている = is/are doing (ongoing action)",
            furigana: "小(ちい)さな 魚(さかな)が たくさん 泳(およ)いでいますよ"
        },
        // Question 14: もらう (receive)
        {
            id: "grammar_14",
            section: "grammar",
            type: "verb",
            question: "これは 兄に（ ）。",
            image: null,
            options: ["1 あげました", "2 もらいました", "3 うりました", "4 かいました"],
            correctAnswer: "2",
            explanation: "〜にもらう = receive from",
            furigana: "これは 兄(あに)に もらいました"
        },
        // Question 15: 何かで (something)
        {
            id: "grammar_15",
            section: "grammar",
            type: "expression",
            question: "作りかたを（ ）読みました。",
            image: null,
            options: ["1 何に", "2 何も", "3 何かへ", "4 何かで"],
            correctAnswer: "4",
            explanation: "何かで = in/with something",
            furigana: "作(つく)り方(かた)を 何(なに)かで 読(よ)みました"
        },
        // Question 16: Telephone phrase
        {
            id: "grammar_16",
            section: "grammar",
            type: "expression",
            question: "すみません、（ ）。",
            image: null,
            options: [
                "1 ひろこさんを おねがいします",
                "2 ひろこさんを ください",
                "3 ひろこさんと 話しますか",
                "4 ひろこさんと 話しませんか"
            ],
            correctAnswer: "1",
            explanation: "〜をおねがいします = May I speak to ~ (phone)",
            furigana: "すみません、ひろこさんを お願(ねが)いします"
        },
        // Question 22: てから (after)
        {
            id: "grammar_22",
            section: "grammar",
            type: "expression",
            question: "日本に（ ）、いろいろな 店で 食べました。",
            image: null,
            options: ["1 行くから", "2 行ってから", "3 来るから", "4 来てから"],
            correctAnswer: "4",
            explanation: "〜てから = after doing",
            furigana: "日本(にほん)に 来(き)てから、いろいろな 店(みせ)で 食(た)べました"
        },
        // Question 23: ませんか (invitation)
        {
            id: "grammar_23",
            section: "grammar",
            type: "expression",
            question: "すしが すきな 人は、 いっしょに（ ）。",
            image: null,
            options: ["1 行きましたか", "2 行きませんか", "3 行っていましたか", "4 行っていませんか"],
            correctAnswer: "2",
            explanation: "〜ませんか = shall we? (invitation)",
            furigana: "寿司(すし)が 好(す)きな 人(ひと)は、 一緒(いっしょ)に 行(い)きませんか"
        },
        // Question 24: Particle の (linking)
        {
            id: "grammar_24",
            section: "grammar",
            type: "particle",
            question: "本屋（ ）大きい お店です。",
            image: null,
            options: ["1 か", "2 と", "3 の", "4 は"],
            correctAnswer: "3",
            explanation: "の links nouns - 'bookstore that is a big shop'",
            furigana: "本屋(ほんや)の 大(おお)きい お店(みせ)です"
        },
        // Question 25: もある (also exists)
        {
            id: "grammar_25",
            section: "grammar",
            type: "expression",
            question: "わたしの 国のも（ ）。",
            image: null,
            options: ["1 います", "2 読みます", "3 あります", "4 します"],
            correctAnswer: "3",
            explanation: "もある = also exists",
            furigana: "私(わたし)の 国(くに)のも あります"
        },
        // Question 26: それから (and then)
        {
            id: "grammar_26",
            section: "grammar",
            type: "conjunction",
            question: "（ ）、本は いつも 駅の ちかくの 本屋で 買います。",
            image: null,
            options: ["1 だから", "2 では", "3 それから", "4 でも"],
            correctAnswer: "3",
            explanation: "それから = and then, after that",
            furigana: "それから、本(ほん)は いつも 駅(えき)の 近(ちか)くの 本屋(ほんや)で 買(か)います"
        }
    ],

    reading: [
        // Question 27: DVD shopping passage
        {
            id: "reading_27",
            section: "reading",
            type: "passage",
            passage: "わたしは 今日、友だちと 買い物に 行きました。３か月前に 見た えいがの DVDが ほしかったからです。買った DVDは、友だちや 姉と いっしょに 見ます。",
            question: "「わたし」は 今日、何を しましたか。",
            options: [
                "1 友だちと えいがを 見に 行きました",
                "2 友だちと DVDを 買いに 行きました",
                "3 姉と えいがを 見に 行きました",
                "4 姉と DVDを 買いに 行きました"
            ],
            correctAnswer: "2",
            explanation: "買い物に 行きました = went shopping; DVDが ほしかった = wanted a DVD",
            furigana: "私(わたし)は 今日(きょう)、友達(ともだち)と 買(か)い物(もの)に 行(い)きました"
        },
        // Question 28: Room diagram (conceptual)
        {
            id: "reading_28",
            section: "reading",
            type: "description",
            passage: "わたしの へやには、テーブルが ひとつ、いすが ひとつ、本だなが ひとつ あります。本が たくさん ありますから、もっと 大きい 本だなが ほしいです。",
            question: "今の へやは どれですか。",
            options: [
                "1 テーブルといすが あって、小さい本だながある",
                "2 テーブルといすが あって、大きい本だながある",
                "3 テーブルだけ あって、本だながない",
                "4 いすだけ あって、本だながない"
            ],
            correctAnswer: "1",
            explanation: "テーブルひとつ、いすひとつ、本だなひとつ。本が多いので bigger bookshelf wanted.",
            furigana: "私(わたし)の 部屋(へや)には、テーブルが 一(ひと)つ、椅子(いす)が 一(ひと)つ、本棚(ほんだな)が 一(ひと)つ あります"
        },
        // Question 29: Teacher's memo
        {
            id: "reading_29",
            section: "reading",
            type: "passage",
            passage: "クラスで 使う 本を 中川先生に かりました。5ページを 25枚 コピーして ください。コピーは 南さんに わたして ください。本は、わたしが あした かえしますから、わたしの 机の 上に おいて ください。",
            question: "森さんは コピーを した あとで、本を どうしますか。",
            options: [
                "1 クラスで 使います",
                "2 南さんに わたします",
                "3 中川先生に かえします",
                "4 山口先生の 机の 上に おきます"
            ],
            correctAnswer: "4",
            explanation: "本は、わたしが あした かえしますから、わたしの 机の 上に おいて ください。",
            furigana: "本(ほん)は、私(わたし)が 明日(あした) 返(かえ)しますから、私(わたし)の 机(つくえ)の 上(うえ)に 置(お)いてください"
        },
        // Question 30-31: Umbrella story
        {
            id: "reading_30",
            section: "reading",
            type: "passage",
            passage: "きのうの 夜 おそくまで しごとを しました。とても つかれました。しごとの あと、電車で 帰りました。家の 近くの 駅で 電車を おりました。外は 雨でしたが、わたしは かさが ありませんでした。とても こまりました。",
            question: "どうして こまりましたか。",
            options: [
                "1 おそい 時間に 駅に 着いたから",
                "2 しごとが たくさん あったから",
                "3 とても つかれたから",
                "4 かさが なかったから"
            ],
            correctAnswer: "4",
            explanation: "雨でしたが、かさが ありませんでした = It was raining but I had no umbrella",
            furigana: "外(そと)は 雨(あめ)でしたが、私(わたし)は 傘(かさ)が ありませんでした"
        },
        {
            id: "reading_31",
            section: "reading",
            type: "passage",
            passage: "駅の 人が わたしを 見て、「あの はこの 中の かさを 使って ください。」と言いました。はこの 中には かさが 3本 ありました。わたしは「えっ、いいんですか。」と 聞きました。駅の 人は「あれは『みんなの かさ』です。お金は いりません。あした、あの はこに かえして ください。」と言いました。",
            question: "「わたし」は、あした どうしますか。",
            options: [
                "1 かさを はこの 中に 入れます",
                "2 かさを 駅の 人に わたします",
                "3 お金を はこの 中に 入れます",
                "4 お金を 駅の 人に わたします"
            ],
            correctAnswer: "1",
            explanation: "あした、あの はこに かえして ください = Please return it to that box tomorrow",
            furigana: "明日(あした)、あの 箱(はこ)に 返(かえ)してください"
        },
        // Question 32: Shopping calendar
        {
            id: "reading_32",
            section: "reading",
            type: "calendar",
            passage: "あらきや スーパーの 安い日:\n月曜・火曜: トイレットペーパー\n水曜・木曜: 肉\n金曜・土曜: 野菜\n日曜: 全品5%OFF\n月曜: 全品10%OFF",
            question: "トイレットペーパーと 肉と 野菜を 同じ 日に 買いたいです。いつが 安いですか。",
            options: [
                "1 6月11日（月）と 12日（火）",
                "2 6月13日（水）と 14日（木）",
                "3 6月15日（金）と 16日（土）",
                "4 6月17日（日）と 18日（月）"
            ],
            correctAnswer: "4",
            explanation: "日曜は全品5%OFF、月曜は全品10%OFF → 月曜が一番安い",
            furigana: "月曜(げつよう)は 全品(ぜんぴん)10%OFF"
        }
    ],

    listening: [
        // Question 1: Socks shopping
        {
            id: "listening_1",
            section: "listening",
            type: "conversation",
            script: "F：子供の靴下、ありますか。 M：はい。長いのですか、短いのですか。 F：長いのです。 M：はい。果物の絵と動物の絵があります。どちらがいいですか。 F：そうですね、動物のを下さい。",
            question: "女の人は、どの靴下を買いますか。",
            options: [
                "1 長い 果物の絵",
                "2 長い 動物の絵",
                "3 短い 果物の絵",
                "4 短い 動物の絵"
            ],
            correctAnswer: "2",
            explanation: "長いのです + 動物のを下さい = long ones + animal pattern",
            furigana: "長(なが)いのです + 動物(どうぶつ)のを 下(くだ)さい"
        },
        // Question 2: Medicine timing
        {
            id: "listening_2",
            section: "listening",
            type: "conversation",
            script: "M：この薬は、朝と夜、ご飯を食べたあとで飲んでください。 F：昼ご飯のあとは？ M：昼は飲まないでください。",
            question: "女の人は、一日に何回薬を飲みますか。",
            options: ["1 1回", "2 2回", "3 3回", "4 4回"],
            correctAnswer: "2",
            explanation: "朝と夜 = morning and evening = 2 times a day",
            furigana: "朝(あさ)と 夜(よる)"
        },
        // Question 3: Bag selection
        {
            id: "listening_3",
            section: "listening",
            type: "conversation",
            script: "F：すみません、その上の黒いかばんを取ってください。 M：どちらですか。この小さいのですか。 F：いいえ。大きいのです。",
            question: "店の人は、どのかばんを取りますか。",
            options: [
                "1 上の 小さい 黒いかばん",
                "2 上の 大きい 黒いかばん",
                "3 下の 小さい 黒いかばん",
                "4 下の 大きい 黒いかばん"
            ],
            correctAnswer: "2",
            explanation: "その上の黒いかばん + 大きいのです = up there, black, big",
            furigana: "上(うえ)の 黒(くろ)い 大(おお)きいかばん"
        },
        // Question 4: What to put on desk
        {
            id: "listening_4",
            section: "listening",
            type: "conversation",
            script: "M：今からテストをします。このテストでは、辞書を使う問題がありますから、机の上に辞書を出してください。鉛筆と消しゴムも出してください。時計は、かばんの中に入れてください。 F：先生、ノートはどうしますか。 M：ノートもかばんの中に入れてください。",
            question: "学生は、机の上に何を置きますか。",
            options: [
                "1 辞書と鉛筆と消しゴム",
                "2 辞書とノートと鉛筆",
                "3 時計と鉛筆と消しゴム",
                "4 時計とノートと消しゴム"
            ],
            correctAnswer: "1",
            explanation: "辞書、鉛筆、消しゴムを机の上に出す",
            furigana: "辞書(じしょ)、鉛筆(えんぴつ)、消(け)しゴムを 机(つくえ)の 上(うえ)に 出(だ)す"
        },
        // Question 5: First action at hotel
        {
            id: "listening_5",
            section: "listening",
            type: "conversation",
            script: "F：皆さん、ホテルに着きました。今から１階のレストランで晩ご飯を食べます。晩ご飯は７時からです。今６時５０分ですから、すぐに行ってください。皆さんの荷物は、ホテルの人が部屋に持っていきます。",
            question: "学生は、始めに何をしますか。",
            options: [
                "1 部屋に行く",
                "2 レストランで食べる",
                "3 荷物を開ける",
                "4 テレビを見る"
            ],
            correctAnswer: "2",
            explanation: "すぐにレストランに行って晩ご飯を食べる",
            furigana: "すぐに レストランに 行(い)って 晩(ばん)ご飯(はん)を 食(た)べる"
        },
        // Question 6: What to bring
        {
            id: "listening_6",
            section: "listening",
            type: "conversation",
            script: "M：来週の日曜日、海へ行きますね。何を持っていきましょうか。 F：私はおにぎりを持っていきます。 M：じゃあ僕は。 F：飲み物とお菓子をお願いします。 M：はい。飲み物とお菓子ですね。 F：あ、飲み物は重いですね。海に着いてから買いましょう。",
            question: "男の人は、何を持っていきますか。",
            options: ["1 おにぎり", "2 飲み物", "3 お菓子", "4 何も持たない"],
            correctAnswer: "3",
            explanation: "飲み物は現地で買う → お菓子だけ持っていく",
            furigana: "お菓子(かし)だけ 持(も)っていく"
        },
        // Question 7: Which bus
        {
            id: "listening_7",
            section: "listening",
            type: "conversation",
            script: "F：すみません、1番のバスはみどり駅に行きますか。 M：いいえ、みどり駅に行くバスは3番と5番と7番ですよ。 F：そうですか。 M：あ、でも、今日は日曜日ですから、5番のバスはありません。 F：そうですか。 M：それから、3番は朝と夕方のバスですから、今の時間は7番ですね。",
            question: "女の人は、何番のバスに乗りますか。",
            options: ["1 1番", "2 3番", "3 5番", "4 7番"],
            correctAnswer: "4",
            explanation: "日曜日 → 5番なし、今は朝/夕方ではない → 7番",
            furigana: "日曜日(にちようび) → 7番(ばん)"
        }
    ]
};

// Helper functions
function getPracticeQuestionsBySection(section) {
    return practiceTestData[section] || [];
}

function getAllPracticeQuestions() {
    return [
        ...practiceTestData.vocabulary,
        ...practiceTestData.grammar,
        ...practiceTestData.reading,
        ...practiceTestData.listening
    ];
}

function getRandomPracticeQuestions(count, sections = null) {
    let allQuestions = [];
    if (sections) {
        for (const section of sections) {
            allQuestions = [...allQuestions, ...(practiceTestData[section] || [])];
        }
    } else {
        allQuestions = getAllPracticeQuestions();
    }
    
    // Shuffle
    for (let i = allQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }
    
    return allQuestions.slice(0, count);
}