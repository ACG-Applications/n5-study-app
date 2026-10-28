// ============================================================
// STORY QUIZ DATA — N5 Japanese Study App
// ============================================================
// Powers the "Story Quiz" tab.
//
// Each entry corresponds to one sprint (indexed 0–8, matching
// sprints.js). Sprint 10 has no quiz entry by design.
//
// Question types:
//   "comprehension" — direct comprehension of a story fact
//   "synthesis"     — combines multiple sentences into one answer
//   "negative"      — "which of these is NOT true/happened?"
//
// ⚠️  evidenceSentenceIndex values point into sentencesData.
//     Do NOT insert or remove sentences in sentences.js without
//     re-indexing every index in this file.
//
// ⚠️  All question/option strings use the 漢字（ふりがな）
//     convention; buildRubyHTML() converts to <ruby> at render.
//     optionsReading is plain hiragana for TTS.
// ============================================================

const storyQuizData = [
  // ============================================================
  // SPRINT 01 — Daily Routine & Time
  // ============================================================
  {
    sprint: 0,
    questions: [
      {
        type: "comprehension",
        questionJp: "毎朝（まいあさ）何時（なんじ）に起（お）きますか。",
        questionReading: "まいあさ なんじ に おきます か",
        optionsJp: [
          "朝（あさ）十時（じゅうじ）に起（お）きます。",
          "毎朝（まいあさ）六時半（ろくじはん）に起（お）きます。",
          "毎朝（まいあさ）六時（ろくじ）に起（お）きます。",
        ],
        optionsReading: [
          "あさ じゅうじ に おきます",
          "まいあさ ろくじはん に おきます",
          "まいあさ ろくじ に おきます",
        ],
        answerIndex: 2,
        evidenceSentenceIndex: 0,
      },
      {
        type: "comprehension",
        questionJp: "朝（あさ）ごはんの後（あと）で何（なに）をしますか。",
        questionReading: "あさごはん の あと で なに を します か",
        optionsJp: [
          "朝（あさ）ごはんの後（あと）で散歩（さんぽ）します。",
          "朝（あさ）ごはんを食（た）べてから歯（は）を磨（みが）きます。",
          "朝（あさ）ごはんの後（あと）で音楽（おんがく）を聞（き）きます。",
        ],
        optionsReading: [
          "あさごはん の あと で さんぽします",
          "あさごはん を たべて から は を みがきます",
          "あさごはん の あと で おんがく を ききます",
        ],
        answerIndex: 1,
        evidenceSentenceIndex: 2,
      },
      {
        type: "comprehension",
        questionJp: "日曜日（にちようび）の予定（よてい）は何（なん）ですか。",
        questionReading: "にちようび の よてい は なん です か",
        optionsJp: [
          "友達（ともだち）と図書館（としょかん）へ行（い）きます。",
          "映画（えいが）を見（み）ます。",
          "予定（よてい）はありません。",
        ],
        optionsReading: [
          "ともだち と としょかん へ いきます",
          "えいが を みます",
          "よてい は ありません",
        ],
        answerIndex: 1,
        evidenceSentenceIndex: 6,
      },
      {
        type: "comprehension",
        questionJp: "先週（せんしゅう）公園（こうえん）で何（なに）を見（み）ましたか。",
        questionReading: "せんしゅう こうえん で なに を みました か",
        optionsJp: [
          "小（ちい）さい犬（いぬ）を見（み）ました。",
          "絵（え）を描（か）いているおじいさんを見（み）ました。",
          "小（ちい）さい男（おとこ）の子（こ）を見（み）ました。",
        ],
        optionsReading: [
          "ちいさい いぬ を みました",
          "え を かいている おじいさん を みました",
          "ちいさい おとこのこ を みました",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 9,
      },
      {
        type: "comprehension",
        questionJp: "昨日（きのう）友達（ともだち）と図書館（としょかん）へ行（い）きましたか。",
        questionReading: "きのう ともだち と としょかん へ いきました か",
        optionsJp: [
          "はい、仕事（しごと）の後（あと）で友達（ともだち）と図書館（としょかん）へ行（い）きました。",
          "いいえ、雨（あめ）が降（ふ）ったので、家（いえ）で本（ほん）を読（よ）みました。",
          "いいえ、疲（つか）れたので図書館（としょかん）へ行（い）きませんでした。",
        ],
        optionsReading: [
          "はい しごと の あと で ともだち と としょかん へ いきました",
          "いいえ あめ が ふった ので いえ で ほん を よみました",
          "いいえ つかれた ので としょかん へ いきませんでした",
        ],
        answerIndex: 1,
        evidenceSentenceIndex: 13,
      },
      {
        type: "comprehension",
        questionJp: "母（はは）は台所（だいどころ）で何（なに）をしますか。",
        questionReading: "はは は だいどころ で なに を します か",
        optionsJp: [
          "野菜（やさい）を切（き）って料理（りょうり）します。",
          "台所（だいどころ）を掃除（そうじ）します。",
          "テレビを見（み）ます。",
        ],
        optionsReading: [
          "やさい を きって りょうりします",
          "だいどころ を そうじします",
          "てれび を みます",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 8,
      },
      {
        type: "comprehension",
        questionJp: "切符（きっぷ）を買（か）った後（あと）で何（なに）をしましたか。",
        questionReading: "きっぷ を かった あと で なに を しました か",
        optionsJp: [
          "切符（きっぷ）を買（か）った後（あと）で家（いえ）へ帰（かえ）りました。",
          "切符（きっぷ）を買（か）った後（あと）で電車（でんしゃ）に乗（の）りました。",
          "切符（きっぷ）は買（か）いませんでした。バスの切符（きっぷ）を買（か）いました。",
        ],
        optionsReading: [
          "きっぷ を かった あと で いえ へ かえりました",
          "きっぷ を かった あと で でんしゃ に のりました",
          "きっぷ は かいませんでした ばす の きっぷ を かいました",
        ],
        answerIndex: 1,
        evidenceSentenceIndex: 12,
      },
      {
        type: "comprehension",
        questionJp: "昨日（きのう）雨（あめ）が降（ふ）りましたね。家（いえ）で何（なに）をしましたか。",
        questionReading: "きのう あめ が ふりました ね いえ で なに を しました か",
        optionsJp: [
          "映画（えいが）を見（み）て、日本語（にほんご）を勉強（べんきょう）しました。",
          "雨（あめ）が降（ふ）ったので、家（いえ）で本（ほん）を読（よ）みました。",
          "雨（あめ）が降（ふ）ったので、仕事（しごと）に行（い）きませんでした。",
        ],
        optionsReading: [
          "えいが を みて にほんご を べんきょうしました",
          "あめ が ふった ので いえ で ほん を よみました",
          "あめ が ふった ので しごと に いきませんでした",
        ],
        answerIndex: 1,
        evidenceSentenceIndex: 13,
      },
      {
        type: "comprehension",
        questionJp: "週末（しゅうまつ）は何（なに）をしますか。",
        questionReading: "しゅうまつ は なに を します か",
        optionsJp: [
          "週末（しゅうまつ）はたいていテレビを見（み）ます。",
          "週末（しゅうまつ）は時々（ときどき）友達（ともだち）と出（で）かけます。",
          "よく音楽（おんがく）を聞（き）きながら散歩（さんぽ）します。",
        ],
        optionsReading: [
          "しゅうまつ は たいてい てれび を みます",
          "しゅうまつ は ときどき ともだち と でかけます",
          "よく おんがく を きき ながら さんぽします",
        ],
        answerIndex: 2,
        evidenceSentenceIndex: 15,
      },
      {
        type: "comprehension",
        questionJp: "夏（なつ）に一番（いちばん）好（す）きな食（た）べ物（もの）は何（なん）ですか。",
        questionReading: "なつ に いちばん すきな たべもの は なん です か",
        optionsJp: [
          "夏（なつ）に一番（いちばん）好（す）きな食（た）べ物（もの）は寿司（すし）です。",
          "夏（なつ）に一番（いちばん）好（す）きな食（た）べ物（もの）は冷（つめ）たいアイスクリームです。",
          "冬（ふゆ）に一番（いちばん）好（す）きな食（た）べ物（もの）は鍋（なべ）です。",
        ],
        optionsReading: [
          "なつ に いちばん すきな たべもの は すし です",
          "なつ に いちばん すきな たべもの は つめたい あいすくりーむ です",
          "ふゆ に いちばん すきな たべもの は なべ です",
        ],
        answerIndex: 1,
        evidenceSentenceIndex: 16,
      },
      {
        type: "comprehension",
        questionJp: "毎日（まいにち）コーヒーをどのくらい飲（の）みますか。",
        questionReading: "まいにち こーひー を どのくらい のみます か",
        optionsJp: [
          "毎日（まいにち）コーヒーを二杯（にはい）飲（の）みます。",
          "毎日（まいにち）コーヒーと水（みず）を飲（の）みます。",
          "コーヒーはよく飲（の）みますが、毎日（まいにち）ではありません。",
        ],
        optionsReading: [
          "まいにち こーひー を にはい のみます",
          "まいにち こーひー と みず を のみます",
          "こーひー は よく のみます が まいにち では ありません",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 17,
      },
      {
        type: "comprehension",
        questionJp: "なぜ部屋（へや）に入（はい）れませんでしたか。",
        questionReading: "なぜ へや に はいれませんでした か",
        optionsJp: [
          "鍵（かぎ）が入（はい）っている鞄（かばん）をなくしたからです。",
          "部屋（へや）の鍵（かぎ）を忘（わす）れたからです。",
          "友達（ともだち）が部屋（へや）を使（つか）っていたからです。",
        ],
        optionsReading: [
          "かぎ が はいっている かばん を なくした から です",
          "へや の かぎ を わすれた から です",
          "ともだち が へや を つかっていた から です",
        ],
        answerIndex: 1,
        evidenceSentenceIndex: 18,
      },
      {
        type: "comprehension",
        questionJp: "辛（から）い食（た）べ物（もの）は好（す）きですか。",
        questionReading: "からい たべもの は すき です か",
        optionsJp: [
          "いいえ、辛（から）い食（た）べ物（もの）は食（た）べられません。",
          "はい、辛（から）い食（た）べ物（もの）が好（す）きです。美味（おい）しいです。",
          "はい、辛（から）い食（た）べ物（もの）が好（す）きですが、少（すこ）し辛（から）い時（とき）だけです。",
        ],
        optionsReading: [
          "いいえ からい たべもの は たべられません",
          "はい からい たべもの が すき です おいしい です",
          "はい からい たべもの が すき です が すこし からい とき だけ です",
        ],
        answerIndex: 2,
        evidenceSentenceIndex: 19,
      },
      {
        type: "comprehension",
        questionJp: "先週（せんしゅう）友達（ともだち）はなぜプレゼントをくれましたか。",
        questionReading: "せんしゅう ともだち は なぜ ぷれぜんと を くれました か",
        optionsJp: [
          "私（わたし）の誕生日（たんじょうび）だったので、ペンをくれました。",
          "プレゼントではなく、私（わたし）のペンを返（かえ）してくれました。",
          "どうして友達（ともだち）がプレゼントをくれたと知（し）っていますか。",
        ],
        optionsReading: [
          "わたし の たんじょうび だった ので ぺん を くれました",
          "ぷれぜんと では なく わたし の ぺん を かえして くれました",
          "どうして ともだち が ぷれぜんと を くれた と しっています か",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 20,
      },
      {
        type: "comprehension",
        questionJp: "図書館（としょかん）の前（まえ）に何（なに）がありますか。",
        questionReading: "としょかん の まえ に なに が あります か",
        optionsJp: [
          "図書館（としょかん）の前（まえ）に銀行（ぎんこう）があります。",
          "図書館（としょかん）の前（まえ）に小（ちい）さい公園（こうえん）があると思（おも）います。",
          "図書館（としょかん）の前（まえ）に大（おお）きな郵便局（ゆうびんきょく）があります。",
        ],
        optionsReading: [
          "としょかん の まえ に ぎんこう が あります",
          "としょかん の まえ に ちいさい こうえん が ある と おもいます",
          "としょかん の まえ に おおきな ゆうびんきょく が あります",
        ],
        answerIndex: 2,
        evidenceSentenceIndex: 21,
      },
      {
        type: "comprehension",
        questionJp: "いつ試験（しけん）がありますか。",
        questionReading: "いつ しけん が あります か",
        optionsJp: [
          "二週間（にしゅうかん）後（ご）に試験（しけん）があります。",
          "明日（あした）試験（しけん）があるので、今晩（こんばん）勉強（べんきょう）します。",
          "試験（しけん）はあまりありません。学校（がっこう）は楽（たの）しい所（ところ）です。",
        ],
        optionsReading: [
          "にしゅうかん ご に しけん が あります",
          "あした しけん が ある ので こんばん べんきょうします",
          "しけん は あまり ありません がっこう は たのしい ところ です",
        ],
        answerIndex: 1,
        evidenceSentenceIndex: 24,
      },
      {
        type: "comprehension",
        questionJp: "スーパーとコンビニで何（なに）を買（か）いましたか。",
        questionReading: "すーぱー と こんびに で なに を かいました か",
        optionsJp: [
          "スーパーで飲（の）み物（もの）を、コンビニで肉（にく）と魚（さかな）を買（か）いました。",
          "スーパーで肉（にく）と魚（さかな）を、コンビニで飲（の）み物（もの）を買（か）いました。",
          "スーパーで肉（にく）と飲（の）み物（もの）を、コンビニで魚（さかな）を買（か）いました。",
        ],
        optionsReading: [
          "すーぱー で のみもの を こんびに で にく と さかな を かいました",
          "すーぱー で にく と さかな を こんびに で のみもの を かいました",
          "すーぱー で にく と のみもの を こんびに で さかな を かいました",
        ],
        answerIndex: 1,
        evidenceSentenceIndex: [25, 28],
      },
      {
        type: "comprehension",
        questionJp: "子供（こども）の頃（ころ）、何（なに）をしましたか。",
        questionReading: "こども の ころ なに を しました か",
        optionsJp: [
          "子供（こども）の頃（ころ）、よく川（かわ）で泳（およ）ぎました。",
          "子供（こども）の頃（ころ）、よく海（うみ）で泳（およ）ぎました。",
          "子供（こども）の頃（ころ）、よく川（かわ）と海（うみ）で泳（およ）ぎました。",
        ],
        optionsReading: [
          "こども の ころ よく かわ で およぎました",
          "こども の ころ よく うみ で およぎました",
          "こども の ころ よく かわ と うみ で およぎました",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 26,
      },
    ],
  },

  // ============================================================
  // SPRINT 02 — Family & People
  // ============================================================
  {
    sprint: 1,
    questions: [
      {
        type: "comprehension",
        questionJp: "お父（とう）さんは何（なん）の仕事（しごと）をしていますか。",
        questionReading: "おとうさん は なん の しごと を しています か",
        optionsJp: [
          "歯医者（はいしゃ）さんです。",
          "会社員（かいしゃいん）です。",
          "医者（いしゃ）です。",
        ],
        optionsReading: ["はいしゃさん です", "かいしゃいん です", "いしゃ です"],
        answerIndex: 2,
        evidenceSentenceIndex: 30,
      },
      {
        type: "comprehension",
        questionJp: "お母（かあ）さんは毎朝（まいあさ）何（なに）をしますか。",
        questionReading: "おかあさん は まいあさ なに を します か",
        optionsJp: [
          "毎朝（まいあさ）朝（あさ）ごはんを作（つく）ります。",
          "毎朝（まいあさ）新聞（しんぶん）を読（よ）みます。",
          "毎朝（まいあさ）音楽（おんがく）を聞（き）きます。",
        ],
        optionsReading: [
          "まいあさ あさごはん を つくります",
          "まいあさ しんぶん を よみます",
          "まいあさ おんがく を ききます",
        ],
        answerIndex: 1,
        evidenceSentenceIndex: 31,
      },
      {
        type: "comprehension",
        questionJp: "お兄（にい）さんは大学（だいがく）にいますか。",
        questionReading: "おにいさん は だいがく に います か",
        optionsJp: [
          "はい、大学（だいがく）にいます。英語（えいご）を勉強（べんきょう）しています。",
          "はい、大学（だいがく）にいます。工学（こうがく）を勉強（べんきょう）しています。",
          "はい、大学（だいがく）にいます。ピアノを勉強（べんきょう）しています。",
        ],
        optionsReading: [
          "はい だいがく に います えいご を べんきょうしています",
          "はい だいがく に います こうがく を べんきょうしています",
          "はい だいがく に います ぴあの を べんきょうしています",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 32,
      },
      {
        type: "comprehension",
        questionJp: "妹（いもうと）さんは何（なに）をしていますか。",
        questionReading: "いもうとさん は なに を しています か",
        optionsJp: [
          "高校（こうこう）へ行（い）って、バイオリンを弾（ひ）いています。",
          "スーパーで働（はたら）いています。",
          "小（ちい）さい時（とき）からピアノを弾（ひ）いています。",
        ],
        optionsReading: [
          "こうこう へ いって ばいおりん を ひいています",
          "すーぱー で はたらいて います",
          "ちいさい とき から ぴあの を ひいています",
        ],
        answerIndex: 2,
        evidenceSentenceIndex: 33,
      },
      {
        type: "comprehension",
        questionJp: "お祖父（じい）さんとお祖母（ばあ）さんはどこに住（す）んでいますか。",
        questionReading: "おじいさん と おばあさん は どこ に すんで います か",
        optionsJp: [
          "東京（とうきょう）に住（す）んでいます。時々（ときどき）遊（あそ）びに行（い）きます。",
          "田舎（いなか）に住（す）んでいます。時々（ときどき）遊（あそ）びに行（い）きます。",
          "私（わたし）たちと一緒（いっしょ）に住（す）んでいます。",
        ],
        optionsReading: [
          "とうきょう に すんで います ときどき あそび に いきます",
          "いなか に すんで います ときどき あそび に いきます",
          "わたしたち と いっしょ に すんで います",
        ],
        answerIndex: 1,
        evidenceSentenceIndex: 34,
      },
      {
        type: "comprehension",
        questionJp: "お叔父（じ）さんはどうやって会社（かいしゃ）へ行（い）きますか。",
        questionReading: "おじさん は どうやって かいしゃ へ いきます か",
        optionsJp: [
          "車（くるま）で会社（かいしゃ）へ行（い）きます。",
          "仕事（しごと）をしていません。退職（たいしょく）しました。",
          "車（くるま）で行（い）って、それから電車（でんしゃ）に乗（の）ります。",
        ],
        optionsReading: [
          "くるま で かいしゃ へ いきます",
          "しごと を して いません たいしょく しました",
          "くるま で いって それから でんしゃ に のります",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 35,
      },
      {
        type: "comprehension",
        questionJp: "隣（となり）の人（ひと）はどんな人（ひと）ですか。",
        questionReading: "となり の ひと は どんな ひと です か",
        optionsJp: [
          "隣（となり）の人（ひと）は優（やさ）しくないです。",
          "運（うん）がいいです。隣（となり）の人（ひと）はとても親切（しんせつ）です。",
          "隣（となり）の人（ひと）は親切（しんせつ）ですが、とてもうるさいです。",
        ],
        optionsReading: [
          "となり の ひと は やさしく ない です",
          "うん が いい です となり の ひと は とても しんせつ です",
          "となり の ひと は しんせつ です が とても うるさい です",
        ],
        answerIndex: 1,
        evidenceSentenceIndex: 37,
      },
      {
        type: "comprehension",
        questionJp: "隣（となり）の人（ひと）たちは何（なに）をしていますか。",
        questionReading: "となり の ひとたち は なに を しています か",
        optionsJp: [
          "彼（かれ）は毎日（まいにち）一時間（いちじかん）日本語（にほんご）を練習（れんしゅう）しています。彼女（かのじょ）は綺麗（きれい）な声（こえ）で歌（うた）います。",
          "彼（かれ）は仕事（しごと）に行（い）って、彼女（かのじょ）は子（こ）どもたちの面倒（めんどう）を見（み）ています。",
          "二人（ふたり）とも退職（たいしょく）して、いつも出（で）かけています。",
        ],
        optionsReading: [
          "かれ は まいにち いちじかん にほんご を れんしゅうしています かのじょ は きれいな こえ で うたいます",
          "かれ は しごと に いって かのじょ は こどもたち の めんどう を みています",
          "ふたり とも たいしょく して いつも でかけて います",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: [38, 39],
      },
      {
        type: "comprehension",
        questionJp: "従兄弟（いとこ）は結婚（けっこん）していますか。",
        questionReading: "いとこ は けっこん して います か",
        optionsJp: [
          "いいえ、来年（らいねん）結婚（けっこん）します。",
          "いいえ、結婚（けっこん）していませんが、赤（あか）ちゃんがいます。",
          "はい、先週（せんしゅう）結婚（けっこん）しました。",
        ],
        optionsReading: [
          "いいえ らいねん けっこんします",
          "いいえ けっこん して いません が あかちゃん が います",
          "はい せんしゅう けっこん しました",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 36,
      },
      {
        type: "comprehension",
        questionJp: "先生（せんせい）は学生（がくせい）に何（なに）をあげましたか。",
        questionReading: "せんせい は がくせい に なに を あげました か",
        optionsJp: [
          "先生（せんせい）は学生（がくせい）にアドバイスをあげました。",
          "先生（せんせい）は学生（がくせい）に宿題（しゅくだい）を出（だ）しました。",
          "先生（せんせい）は学生（がくせい）みんなにりんごをあげました。",
        ],
        optionsReading: [
          "せんせい は がくせい に あどばいす を あげました",
          "せんせい は がくせい に しゅくだい を だしました",
          "せんせい は がくせい みんな に りんご を あげました",
        ],
        answerIndex: 1,
        evidenceSentenceIndex: 41,
      },
      {
        type: "comprehension",
        questionJp: "友達（ともだち）と何（なに）をしましたか。",
        questionReading: "ともだち と なに を しました か",
        optionsJp: [
          "友達（ともだち）と一緒（いっしょ）にご飯（はん）を食（た）べて、楽（たの）しかったです。",
          "友達（ともだち）と映画（えいが）を見（み）に行（い）きました。",
          "友達（ともだち）は一人（ひとり）もいません。",
        ],
        optionsReading: [
          "ともだち と いっしょ に ごはん を たべて たのしかった です",
          "ともだち と えいが を み に いきました",
          "ともだち は ひとり も いません",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 42,
      },
      {
        type: "comprehension",
        questionJp: "どうして同僚（どうりょう）は会社（かいしゃ）を休（やす）みましたか。",
        questionReading: "どうして どうりょう は かいしゃ を やすみました か",
        optionsJp: [
          "ウイルスにかかったからです。",
          "風邪（かぜ）を引（ひ）いたからです。",
          "バスに乗（の）り遅（おく）れたからです。",
        ],
        optionsReading: [
          "ういるす に かかった から です",
          "かぜ を ひいた から です",
          "ばす に のりおくれた から です",
        ],
        answerIndex: 1,
        evidenceSentenceIndex: 43,
      },
      {
        type: "comprehension",
        questionJp: "娘（むすめ）は学校（がっこう）で何（なに）をしますか。",
        questionReading: "むすめ は がっこう で なに を します か",
        optionsJp: [
          "学校（がっこう）で友達（ともだち）を待（ま）ちます。",
          "野球（やきゅう）をします。",
          "友達（ともだち）の家（いえ）へ行（い）きます。",
        ],
        optionsReading: [
          "がっこう で ともだち を まちます",
          "やきゅう を します",
          "ともだち の いえ へ いきます",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 46,
      },
      {
        type: "comprehension",
        questionJp: "息子（むすこ）はどんな人（ひと）ですか。",
        questionReading: "むすこ は どんな ひと です か",
        optionsJp: [
          "とても優（やさ）しい人（ひと）です。",
          "とても元気（げんき）な人（ひと）です。",
          "とても真面目（まじめ）な人（ひと）です。",
        ],
        optionsReading: [
          "とても やさしい ひと です",
          "とても げんきな ひと です",
          "とても まじめな ひと です",
        ],
        answerIndex: 2,
        evidenceSentenceIndex: 50,
      },
      {
        type: "comprehension",
        questionJp: "子供（こども）たちは公園（こうえん）で何（なに）をしていますか。",
        questionReading: "こどもたち は こうえん で なに を しています か",
        optionsJp: [
          "公園（こうえん）で遊（あそ）んでいます。",
          "公園（こうえん）で本（ほん）を読（よ）んでいます。",
          "川（かわ）で泳（およ）いでいます。",
        ],
        optionsReading: [
          "こうえん で あそんで います",
          "こうえん で ほん を よんで います",
          "かわ で およいで います",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 52,
      },
      {
        type: "comprehension",
        questionJp: "あなたとお兄（にい）さんとでは、どちらが背（せ）が高（たか）いですか。",
        questionReading: "あなた と おにいさん と では どちら が せ が たかい です か",
        optionsJp: [
          "私（わたし）の方（ほう）がお兄（にい）さんより背（せ）が高（たか）いです。",
          "お兄（にい）さんの方（ほう）が私（わたし）より背（せ）が高（たか）いです。",
          "お兄（にい）さんと私（わたし）は同（おな）じ背（せ）です。",
        ],
        optionsReading: [
          "わたし の ほう が おにいさん より せ が たかい です",
          "おにいさん の ほう が わたし より せ が たかい です",
          "おにいさん と わたし は おなじ せ です",
        ],
        answerIndex: 1,
        evidenceSentenceIndex: 54,
      },
    ],
  },

  // ============================================================
  // SPRINT 03 — Location & Transport
  // ============================================================
  {
    sprint: 2,
    questions: [
      {
        type: "synthesis",
        questionJp: "どんな道順（みちじゅん）を教（おし）えてもらいましたか。",
        questionReading: "どんな みちじゅん を おしえて もらいました か",
        optionsJp: [
          "右（みぎ）に曲（ま）がってまっすぐ行（い）って、交差点（こうさてん）を渡（わた）ったら左（ひだり）にあると言（い）われました。",
          "左（ひだり）に曲（ま）がってまっすぐ行（い）って、交差点（こうさてん）を渡（わた）ったら右（みぎ）にあると言（い）われました。",
          "右（みぎ）に曲（ま）がってまっすぐ行（い）って、交差点（こうさてん）を渡（わた）ったら右（みぎ）にあると言（い）われました。",
        ],
        optionsReading: [
          "みぎ に まがって まっすぐ いって こうさてん を わたったら ひだり に ある と いわれました",
          "ひだり に まがって まっすぐ いって こうさてん を わたったら みぎ に ある と いわれました",
          "みぎ に まがって まっすぐ いって こうさてん を わたったら みぎ に ある と いわれました",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: [55, 56, 57],
        compositionNote: "Collapses quoted directions into 〜て-chain + と言われました",
      },
      {
        type: "synthesis",
        questionJp: "バス停（てい）の近（ちか）くにはどんな目印（めじるし）がありますか。",
        questionReading: "ばすてい の ちかく には どんな めじるし が あります か",
        optionsJp: [
          "銀行（ぎんこう）はスーパーの隣（となり）に、図書館（としょかん）は学校（がっこう）の向（む）かいに、郵便局（ゆうびんきょく）は角（かど）にあります。",
          "銀行（ぎんこう）は学校（がっこう）の向（む）かいに、図書館（としょかん）はスーパーの隣（となり）に、郵便局（ゆうびんきょく）は駅（えき）の後（うし）ろにあります。",
          "バス停（てい）の近（ちか）くにはコンビニしかありません。",
        ],
        optionsReading: [
          "ぎんこう は すーぱー の となり に としょかん は がっこう の むかい に ゆうびんきょく は かど に あります",
          "ぎんこう は がっこう の むかい に としょかん は すーぱー の となり に ゆうびんきょく は えき の うしろ に あります",
          "ばすてい の ちかく には こんびに しか ありません",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: [58, 59, 60],
        compositionNote: "Three landmark sentences combined with は…に parallel structure",
      },
      {
        type: "comprehension",
        questionJp: "バス停（てい）まで歩（ある）いてどのくらいかかりますか。",
        questionReading: "ばすてい まで あるいて どのくらい かかります か",
        optionsJp: [
          "バス停（てい）まで歩（ある）いて五分（ごふん）です。",
          "バス停（てい）まで歩（ある）いて十分（じゅっぷん）です。",
          "バス停（てい）まで電車（でんしゃ）で五分（ごふん）です。",
        ],
        optionsReading: [
          "ばすてい まで あるいて ごふん です",
          "ばすてい まで あるいて じゅっぷん です",
          "ばすてい まで でんしゃ で ごふん です",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 61,
      },
      {
        type: "synthesis",
        questionJp: "大阪（おおさか）へは何（なに）で行（い）くのが一番（いちばん）いいと思（おも）いますか。",
        questionReading: "おおさか へ は なに で いく の が いちばん いい と おもいます か",
        optionsJp: [
          "新幹線（しんかんせん）は二時間半（にじかんはん）なので、新幹線（しんかんせん）で行（い）くのがいいと思（おも）います。",
          "飛行機（ひこうき）は速（はや）いですが少（すこ）し高（たか）いので、飛行機（ひこうき）で行（い）くのがいいと思（おも）います。",
          "地下鉄（ちかてつ）は二駅（にえき）なので、地下鉄（ちかてつ）で行（い）くのがいいと思（おも）います。",
        ],
        optionsReading: [
          "しんかんせん は にじかんはん なので しんかんせん で いく の が いい と おもいます",
          "ひこうき は はやい です が すこし たかい ので ひこうき で いく の が いい と おもいます",
          "ちかてつ は にえき なので ちかてつ で いく の が いい と おもいます",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: [62, 65],
        compositionNote: "Combines Shinkansen duration (#62) with the taxi-recommendation logic (#65) — reframed as Shinkansen recommendation",
      },
      {
        type: "comprehension",
        questionJp: "新幹線（しんかんせん）は東京（とうきょう）から大阪（おおさか）までどのくらいかかりますか。",
        questionReading: "しんかんせん は とうきょう から おおさか まで どのくらい かかります か",
        optionsJp: [
          "二時間半（にじかんはん）かかります。",
          "二時間（にじかん）少（すこ）しかかりません。",
          "十分（じゅっぷん）ぐらいかかります。",
        ],
        optionsReading: [
          "にじかんはん かかります",
          "にじかん すこし かかりません",
          "じゅっぷん ぐらい かかります",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 62,
      },
      {
        type: "comprehension",
        questionJp: "地下鉄（ちかてつ）で何駅（なんえき）ですか。",
        questionReading: "ちかてつ で なんえき です か",
        optionsJp: [
          "地下鉄（ちかてつ）で二駅（にえき）です。",
          "地下鉄（ちかてつ）で三駅（さんえき）です。",
          "地下鉄（ちかてつ）で五駅（ごえき）です。",
        ],
        optionsReading: [
          "ちかてつ で にえき です",
          "ちかてつ で さんえき です",
          "ちかてつ で ごえき です",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 63,
      },
      {
        type: "comprehension",
        questionJp: "エレベーターで何階（なんがい）まで行（い）きますか。",
        questionReading: "えれべーたー で なんがい まで いきます か",
        optionsJp: [
          "三階（さんかい）まで行（い）きます。",
          "二階（にかい）まで行（い）きます。",
          "五階（ごかい）まで行（い）きます。",
        ],
        optionsReading: [
          "さんかい まで いきます",
          "にかい まで いきます",
          "ごかい まで いきます",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 73,
      },
      {
        type: "comprehension",
        questionJp: "出口（でぐち）はどちらですか。",
        questionReading: "でぐち は どちら です か",
        optionsJp: [
          "出口（でぐち）は左側（ひだりがわ）です。",
          "出口（でぐち）は右側（みぎがわ）です。",
          "出口（でぐち）は三階（さんかい）です。",
        ],
        optionsReading: [
          "でぐち は ひだりがわ です",
          "でぐち は みぎがわ です",
          "でぐち は さんかい です",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 74,
      },
      {
        type: "comprehension",
        questionJp: "駐車場（ちゅうしゃじょう）はどこにありますか。",
        questionReading: "ちゅうしゃじょう は どこ に あります か",
        optionsJp: [
          "駐車場（ちゅうしゃじょう）は建物（たてもの）の後（うし）ろにあります。",
          "駐車場（ちゅうしゃじょう）は建物（たてもの）の前（まえ）にあります。",
          "駐車場（ちゅうしゃじょう）は建物（たてもの）の隣（となり）にあります。",
        ],
        optionsReading: [
          "ちゅうしゃじょう は たてもの の うしろ に あります",
          "ちゅうしゃじょう は たてもの の まえ に あります",
          "ちゅうしゃじょう は たてもの の となり に あります",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 77,
      },
      {
        type: "comprehension",
        questionJp: "遠（とお）くに何（なに）が見（み）えますか。",
        questionReading: "とおく に なに が みえます か",
        optionsJp: [
          "遠（とお）くに山（やま）が見（み）えます。",
          "遠（とお）くに海（うみ）が見（み）えます。",
          "遠（とお）くにコンビニが見（み）えます。",
        ],
        optionsReading: [
          "とおく に やま が みえます",
          "とおく に うみ が みえます",
          "とおく に こんびに が みえます",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 72,
      },
    ],
  },

  // ============================================================
  // SPRINT 04 — Shopping & Food
  // ============================================================
  {
    sprint: 3,
    questions: [
      {
        type: "synthesis",
        questionJp: "デパートでお客（きゃく）さんは何（なに）について聞（き）きましたか。",
        questionReading: "でぱーと で おきゃくさん は なに に ついて ききました か",
        optionsJp: [
          "りんごの値段（ねだん）、試着（しちゃく）、クレジットカード、袋（ふくろ）の有料（ゆうりょう）、レシートについて聞（き）きました。",
          "りんごの値段（ねだん）と袋（ふくろ）の有料（ゆうりょう）だけについて聞（き）きました。",
          "ラーメンの値段（ねだん）とアルコールがあるかどうかについて聞（き）きました。",
        ],
        optionsReading: [
          "りんご の ねだん しちゃく くれじっとかーど ふくろ の ゆうりょう れしーと に ついて ききました",
          "りんご の ねだん と ふくろ の ゆうりょう だけ に ついて ききました",
          "らーめん の ねだん と あるこーる が ある か どうか に ついて ききました",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: [81, 82, 84, 85, 87, 89],
        compositionNote: "Combines shopper's questions into a 〜について聞きました list",
      },
      {
        type: "comprehension",
        questionJp: "三本（さんぼん）でいくらですか。",
        questionReading: "さんぼん で いくら です か",
        optionsJp: [
          "三本（さんぼん）で五百円（ごひゃくえん）です。",
          "三本（さんぼん）で千円（せんえん）です。",
          "三本（さんぼん）で百円（ひゃくえん）です。",
        ],
        optionsReading: [
          "さんぼん で ごひゃくえん です",
          "さんぼん で せんえん です",
          "さんぼん で ひゃくえん です",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 82,
      },
      {
        type: "comprehension",
        questionJp: "どうやって払（はら）いますか。",
        questionReading: "どうやって はらいます か",
        optionsJp: [
          "現金（げんきん）だけです。",
          "クレジットカードで払（はら）います。",
          "ポイントカードで払（はら）います。",
        ],
        optionsReading: [
          "げんきん だけ です",
          "くれじっとかーど で はらいます",
          "ぽいんとかーど で はらいます",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 87,
      },
      {
        type: "negative",
        questionJp: "デパートで聞（き）かなかったことはどれですか。",
        questionReading: "でぱーと で きかなかった こと は どれ です か",
        optionsJp: [
          "服（ふく）を試着（しちゃく）してもいいかどうか。",
          "袋（ふくろ）は有料（ゆうりょう）かどうか。",
          "飲（の）み放題（ほうだい）があるかどうか。",
        ],
        optionsReading: [
          "ふく を しちゃくして も いい か どうか",
          "ふくろ は ゆうりょう か どうか",
          "のみほうだい が ある か どうか",
        ],
        answerIndex: 2,
        evidenceSentenceIndex: [81, 84, 85, 87, 89, 96],
        compositionNote: "All-you-can-drink belongs to restaurant scene (#96); other two are department-store facts",
      },
      {
        type: "synthesis",
        questionJp: "レストランで何（なに）がありましたか。",
        questionReading: "れすとらん で なに が ありました か",
        optionsJp: [
          "寿司（すし）が食（た）べたかったので料理（りょうり）について聞（き）いて、お会計（かいけい）を頼（たの）んで、予約（よやく）をしようとしましたが、満席（まんせき）でした。",
          "ラーメンを食（た）べて、クレジットカードで払（はら）いました。",
          "飲（の）み物（もの）だけを注文（ちゅうもん）しました。",
        ],
        optionsReading: [
          "すし が たべたかった ので りょうり に ついて きいて おかいけい を たのんで よやく を しよう と しました が まんせき でした",
          "らーめん を たべて くれじっとかーど で はらいました",
          "のみもの だけ を ちゅうもん しました",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: [91, 92, 95, 97, 98],
        compositionNote: "Collapses restaurant sequence into 〜ので + 〜て + 〜が chain",
      },
      {
        type: "comprehension",
        questionJp: "何（なに）を食（た）べたいですか。",
        questionReading: "なに を たべたい です か",
        optionsJp: [
          "寿司（すし）が食（た）べたいです。",
          "ラーメンが食（た）べたいです。",
          "カレーが食（た）べたいです。",
        ],
        optionsReading: [
          "すし が たべたい です",
          "らーめん が たべたい です",
          "かれー が たべたい です",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 91,
      },
      {
        type: "comprehension",
        questionJp: "予約（よやく）できましたか。",
        questionReading: "よやく できました か",
        optionsJp: [
          "いいえ、満席（まんせき）でした。",
          "はい、一階（いっかい）で予約（よやく）しました。",
          "はい、昼（ひる）だけ予約（よやく）しました。",
        ],
        optionsReading: [
          "いいえ まんせき でした",
          "はい いっかい で よやく しました",
          "はい ひる だけ よやく しました",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 98,
      },
      {
        type: "comprehension",
        questionJp: "支払（しはら）いで何（なに）が問題（もんだい）でしたか。",
        questionReading: "しはらい で なに が もんだい でした か",
        optionsJp: [
          "お釣（つ）りが違（ちが）いました。",
          "クレジットカードが使（つか）えませんでした。",
          "ポイントカードが使（つか）えませんでした。",
        ],
        optionsReading: [
          "おつり が ちがいました",
          "くれじっとかーど が つかえませんでした",
          "ぽいんとかーど が つかえませんでした",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 102,
      },
      {
        type: "negative",
        questionJp: "レストランで聞（き）かなかったことはどれですか。",
        questionReading: "れすとらん で きかなかった こと は どれ です か",
        optionsJp: [
          "料理（りょうり）に何（なに）が入（はい）っているかどうか。",
          "飲（の）み放題（ほうだい）があるかどうか。",
          "服（ふく）を試着（しちゃく）してもいいかどうか。",
        ],
        optionsReading: [
          "りょうり に なに が はいっている か どうか",
          "のみほうだい が ある か どうか",
          "ふく を しちゃくして も いい か どうか",
        ],
        answerIndex: 2,
        evidenceSentenceIndex: [85, 94, 96],
        compositionNote: "Clothes try-on belongs to department store scene (#85); other two are restaurant facts",
      },
    ],
  },

  // ============================================================
  // SPRINT 05 — Weather & Feelings
  // ============================================================
  {
    sprint: 4,
    questions: [
      {
        type: "comprehension",
        questionJp: "今日（きょう）の天気（てんき）はどうですか。",
        questionReading: "きょう の てんき は どう です か",
        optionsJp: [
          "今日（きょう）はとても暑（あつ）いです。",
          "今日（きょう）はとても寒（さむ）いです。",
          "今日（きょう）は雨（あめ）が降（ふ）っています。",
        ],
        optionsReading: [
          "きょう は とても あつい です",
          "きょう は とても さむい です",
          "きょう は あめ が ふって います",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 105,
      },
      {
        type: "comprehension",
        questionJp: "昨日（きのう）の天気（てんき）はどうでしたか。",
        questionReading: "きのう の てんき は どう でした か",
        optionsJp: [
          "昨日（きのう）は暑（あつ）かったです。",
          "昨日（きのう）は涼（すず）しかったです。",
          "昨日（きのう）は雪（ゆき）が降（ふ）っていました。",
        ],
        optionsReading: [
          "きのう は あつかった です",
          "きのう は すずしかった です",
          "きのう は ゆき が ふって いました",
        ],
        answerIndex: 1,
        evidenceSentenceIndex: 106,
      },
      {
        type: "comprehension",
        questionJp: "明日（あした）の天気（てんき）はどうなるでしょう。",
        questionReading: "あした の てんき は どう なる でしょう",
        optionsJp: [
          "明日（あした）は寒（さむ）くなるでしょう。",
          "明日（あした）は暑（あつ）くなるでしょう。",
          "明日（あした）は晴（は）れるでしょう。",
        ],
        optionsReading: [
          "あした は さむく なる でしょう",
          "あした は あつく なる でしょう",
          "あした は はれる でしょう",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 107,
      },
      {
        type: "comprehension",
        questionJp: "天気予報（てんきよほう）によると、天気（てんき）はどうなりますか。",
        questionReading: "てんきよほう に よると てんき は どう なります か",
        optionsJp: [
          "まず曇（くも）りのち雨（あめ）、その後（あと）は晴（は）れのち曇（くも）りです。",
          "まず晴（は）れのち曇（くも）り、その後（あと）は雨（あめ）のち雪（ゆき）です。",
          "まず雨（あめ）のち曇（くも）り、その後（あと）は晴（は）れのち雪（ゆき）です。",
        ],
        optionsReading: [
          "まず くもり のち あめ そのあと は はれ のち くもり です",
          "まず はれ のち くもり そのあと は あめ のち ゆき です",
          "まず あめ のち くもり そのあと は はれ のち ゆき です",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 108,
      },
      {
        type: "comprehension",
        questionJp: "気温（きおん）は何度（なんど）ですか。",
        questionReading: "きおん は なんど です か",
        optionsJp: [
          "気温（きおん）は二十度（にじゅうど）です。",
          "気温（きおん）は三十度（さんじゅうど）です。",
          "気温（きおん）は十度（じゅうど）です。",
        ],
        optionsReading: [
          "きおん は にじゅうど です",
          "きおん は さんじゅうど です",
          "きおん は じゅうど です",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 114,
      },
      {
        type: "comprehension",
        questionJp: "湿度（しつど）はどうですか。",
        questionReading: "しつど は どう です か",
        optionsJp: [
          "湿度（しつど）が高（たか）くて不快（ふかい）です。",
          "湿度（しつど）が低（ひく）くて快適（かいてき）です。",
          "湿度（しつど）は普通（ふつう）で問題（もんだい）ありません。",
        ],
        optionsReading: [
          "しつど が たかくて ふかい です",
          "しつど が ひくくて かいてき です",
          "しつど は ふつう で もんだい ありません",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 111,
      },
      {
        type: "comprehension",
        questionJp: "なぜ目（め）がかゆいですか。",
        questionReading: "なぜ め が かゆい です か",
        optionsJp: [
          "花粉（かふん）のせいです。",
          "風邪（かぜ）のせいです。",
          "強（つよ）い風（かぜ）のせいです。",
        ],
        optionsReading: ["かふん の せい です", "かぜ の せい です", "つよい かぜ の せい です"],
        answerIndex: 0,
        evidenceSentenceIndex: 117,
      },
      {
        type: "comprehension",
        questionJp: "昨日（きのう）、悲（かな）しい映画（えいが）を見（み）てどうしましたか。",
        questionReading: "きのう かなしい えいが を みて どう しました か",
        optionsJp: ["泣（な）きました。", "笑（わら）いました。", "寝（ね）てしまいました。"],
        optionsReading: ["なきました", "わらいました", "ねて しまいました"],
        answerIndex: 0,
        evidenceSentenceIndex: 121,
      },
      {
        type: "negative",
        questionJp: "この話（はなし）に書（か）いてないことはどれですか。",
        questionReading: "この はなし に かいて ない こと は どれ です か",
        optionsJp: [
          "先週（せんしゅう）の旅行（りょこう）は楽（たの）しかったです。",
          "先週（せんしゅう）の会議（かいぎ）は退屈（たいくつ）でした。",
          "先週（せんしゅう）、海（うみ）へ行（い）きました。",
        ],
        optionsReading: [
          "せんしゅう の りょこう は たのしかった です",
          "せんしゅう の かいぎ は たいくつ でした",
          "せんしゅう うみ へ いきました",
        ],
        answerIndex: 2,
        evidenceSentenceIndex: [122, 123, 124],
        compositionNote: "Options a and b are stated facts (#122, #123); option c (beach) is not in the story",
      },
      {
        type: "negative",
        questionJp: "この話（はなし）に書（か）いてないことはどれですか。",
        questionReading: "この はなし に かいて ない こと は どれ です か",
        optionsJp: [
          "風（かぜ）が強（つよ）いです。",
          "湿度（しつど）が高（たか）いです。",
          "今（いま）、雪（ゆき）が降（ふ）っています。",
        ],
        optionsReading: ["かぜ が つよい です", "しつど が たかい です", "いま ゆき が ふって います"],
        answerIndex: 2,
        evidenceSentenceIndex: [110, 111, 112],
        compositionNote: "Options a and b are stated facts (#110 wind, #111 humidity); option c conflates 'in winter it snows' (#112) with 'now'",
      },
    ],
  },

  // ============================================================
  // SPRINT 06 — Hobbies & Giving
  // ============================================================
  {
    sprint: 5,
    questions: [
      {
        type: "comprehension",
        questionJp: "趣味（しゅみ）は何（なん）ですか。",
        questionReading: "しゅみ は なん です か",
        optionsJp: [
          "写真（しゃしん）を撮（と）ることです。",
          "ギターを弾（ひ）くことです。",
          "映画（えいが）を見（み）ることです。",
        ],
        optionsReading: [
          "しゃしん を とる こと です",
          "ぎたー を ひく こと です",
          "えいが を みる こと です",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 129,
      },
      {
        type: "comprehension",
        questionJp: "どんな楽器（がっき）が弾（ひ）けますか。",
        questionReading: "どんな がっき が ひけます か",
        optionsJp: [
          "ピアノが弾（ひ）けます。",
          "ギターが弾（ひ）けます。",
          "バイオリンが弾（ひ）けます。",
        ],
        optionsReading: ["ぴあの が ひけます", "ぎたー が ひけます", "ばいおりん が ひけます"],
        answerIndex: 1,
        evidenceSentenceIndex: 130,
      },
      {
        type: "synthesis",
        questionJp: "先週（せんしゅう）、何（なに）をもらって、何（なに）をあげましたか。",
        questionReading: "せんしゅう なに を もらって なに を あげました か",
        optionsJp: [
          "友達（ともだち）に本（ほん）を貸（か）して、お兄（にい）さんから時計（とけい）をもらって、彼女（かのじょ）の誕生日（たんじょうび）に花（はな）をあげました。",
          "友達（ともだち）から本（ほん）をもらって、お兄（にい）さんに時計（とけい）を貸（か）して、花（はな）をもらいました。",
          "お兄（にい）さんに本（ほん）をあげて、友達（ともだち）から時計（とけい）をもらって、彼女（かのじょ）に花（はな）をあげました。",
        ],
        optionsReading: [
          "ともだち に ほん を かして おにいさん から とけい を もらって かのじょ の たんじょうび に はな を あげました",
          "ともだち から ほん を もらって おにいさん に とけい を かして はな を もらいました",
          "おにいさん に ほん を あげて ともだち から とけい を もらって かのじょ に はな を あげました",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: [134, 135, 137],
        compositionNote: "Collapses three giving/receiving events (#134 lent, #135 received, #137 gave) into a 〜て-chain preserving に/から direction",
      },
      {
        type: "comprehension",
        questionJp: "誰（だれ）が時計（とけい）をくれましたか。",
        questionReading: "だれ が とけい を くれました か",
        optionsJp: [
          "友達（ともだち）がくれました。",
          "お兄（にい）さんがくれました。",
          "先生（せんせい）がくれました。",
        ],
        optionsReading: ["ともだち が くれました", "おにいさん が くれました", "せんせい が くれました"],
        answerIndex: 1,
        evidenceSentenceIndex: 135,
      },
      {
        type: "comprehension",
        questionJp: "彼女（かのじょ）の誕生日（たんじょうび）に何（なに）をあげましたか。",
        questionReading: "かのじょ の たんじょうび に なに を あげました か",
        optionsJp: ["花（はな）をあげました。", "本（ほん）をあげました。", "時計（とけい）をあげました。"],
        optionsReading: ["はな を あげました", "ほん を あげました", "とけい を あげました"],
        answerIndex: 0,
        evidenceSentenceIndex: 137,
      },
      {
        type: "comprehension",
        questionJp: "お祖母（ばあ）さんに何（なに）を書（か）きましたか。",
        questionReading: "おばあさん に なに を かきました か",
        optionsJp: ["手紙（てがみ）を書（か）きました。", "本（ほん）を書（か）きました。", "詩（し）を書（か）きました。"],
        optionsReading: ["てがみ を かきました", "ほん を かきました", "し を かきました"],
        answerIndex: 0,
        evidenceSentenceIndex: 140,
      },
      {
        type: "comprehension",
        questionJp: "誰（だれ）が手伝（てつだ）ってくれましたか。",
        questionReading: "だれ が てつだって くれました か",
        optionsJp: [
          "先生（せんせい）が手伝（てつだ）ってくれました。",
          "友達（ともだち）が手伝（てつだ）ってくれました。",
          "お兄（にい）さんが手伝（てつだ）ってくれました。",
        ],
        optionsReading: [
          "せんせい が てつだって くれました",
          "ともだち が てつだって くれました",
          "おにいさん が てつだって くれました",
        ],
        answerIndex: 1,
        evidenceSentenceIndex: 139,
      },
      {
        type: "comprehension",
        questionJp: "先週（せんしゅう）、何（なに）に勝（か）ちましたか。",
        questionReading: "せんしゅう なに に かちました か",
        optionsJp: ["試合（しあい）に勝（か）ちました。", "ゲームに勝（か）ちました。", "試験（しけん）に勝（か）ちました。"],
        optionsReading: ["しあい に かちました", "げーむ に かちました", "しけん に かちました"],
        answerIndex: 0,
        evidenceSentenceIndex: 142,
      },
      {
        type: "comprehension",
        questionJp: "何（なに）を習（なら）いたいですか。",
        questionReading: "なに を ならいたい です か",
        optionsJp: [
          "ギターを習（なら）いたいです。",
          "ヨガを習（なら）いたいです。",
          "釣（つ）りを習（なら）いたいです。",
        ],
        optionsReading: ["ぎたー を ならいたい です", "よが を ならいたい です", "つり を ならいたい です"],
        answerIndex: 1,
        evidenceSentenceIndex: 144,
      },
      {
        type: "negative",
        questionJp: "この話（はなし）で起（お）こらなかったことはどれですか。",
        questionReading: "この はなし で おこらなかった こと は どれ です か",
        optionsJp: [
          "先週（せんしゅう）、試合（しあい）に勝（か）ちました。",
          "その前（まえ）の週（しゅう）にゲームに負（ま）けました。",
          "先週（せんしゅう）、釣（つ）りに行（い）きました。",
        ],
        optionsReading: [
          "せんしゅう しあい に かちました",
          "その まえ の しゅう に げーむ に まけました",
          "せんしゅう つり に いきました",
        ],
        answerIndex: 2,
        evidenceSentenceIndex: [142, 143, 146],
        compositionNote: "Options a and b are stated facts (#142 won match, #143 lost game); option c conflates 'likes fishing' (#146) with 'went fishing last week'",
      },
    ],
  },

  // ============================================================
  // SPRINT 07 — Health & Body
  // ============================================================
  {
    sprint: 6,
    questions: [
      {
        type: "synthesis",
        questionJp: "どうして病院（びょういん）に行（い）こうと思（おも）いましたか。",
        questionReading: "どうして びょういん に いこう と おもいました か",
        optionsJp: [
          "頭（あたま）が痛（いた）くて、熱（ねつ）もあって、咳（せき）も出（で）て、気分（きぶん）が悪（わる）かったからです。",
          "歯（は）が痛（いた）くて、歯医者（はいしゃ）に行（い）きたかったからです。",
          "運動（うんどう）中（ちゅう）に足（あし）を捻挫（ねんざ）したからです。",
        ],
        optionsReading: [
          "あたま が いたくて ねつ も あって せき も でて きぶん が わるかった から です",
          "は が いたくて はいしゃ に いきたかった から です",
          "うんどうちゅう に あし を ねんざ した から です",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: [156, 159, 160, 161, 162],
        compositionNote: "Collapses symptoms (#156 headache, #159 fever, #160 cough, #161 sneezing, #162 sick) into 〜て-chain + からです",
      },
      {
        type: "comprehension",
        questionJp: "昨日（きのう）、最初（さいしょ）の症状（しょうじょう）は何（なん）でしたか。",
        questionReading: "きのう さいしょ の しょうじょう は なん でした か",
        optionsJp: [
          "頭（あたま）が痛（いた）かったです。",
          "熱（ねつ）がありました。",
          "咳（せき）が出（で）ました。",
        ],
        optionsReading: ["あたま が いたかった です", "ねつ が ありました", "せき が でました"],
        answerIndex: 0,
        evidenceSentenceIndex: 156,
      },
      {
        type: "comprehension",
        questionJp: "どうして歯医者（はいしゃ）に行（い）きましたか。",
        questionReading: "どうして はいしゃ に いきました か",
        optionsJp: [
          "頭（あたま）が痛（いた）かったからです。",
          "歯（は）が痛（いた）かったからです。",
          "熱（ねつ）があったからです。",
        ],
        optionsReading: ["あたま が いたかった から です", "は が いたかった から です", "ねつ が あった から です"],
        answerIndex: 1,
        evidenceSentenceIndex: 157,
      },
      {
        type: "comprehension",
        questionJp: "医者（いしゃ）は何（なに）をするように言（い）いましたか。",
        questionReading: "いしゃ は なに を する よう に いいました か",
        optionsJp: [
          "薬（くすり）を飲（の）むように言（い）いました。",
          "安静（あんせい）にするように言（い）いました。",
          "病院（びょういん）に行（い）くように言（い）いました。",
        ],
        optionsReading: [
          "くすり を のむ よう に いいました",
          "あんせい に する よう に いいました",
          "びょういん に いく よう に いいました",
        ],
        answerIndex: 1,
        evidenceSentenceIndex: 164,
      },
      {
        type: "comprehension",
        questionJp: "どうして目（め）が疲（つか）れましたか。",
        questionReading: "どうして め が つかれました か",
        optionsJp: [
          "パソコンを使（つか）いすぎたからです。",
          "本（ほん）を読（よ）みすぎたからです。",
          "よく寝（ね）られなかったからです。",
        ],
        optionsReading: ["ぱそこん を つかいすぎた から です", "ほん を よみすぎた から です", "よく ねられなかった から です"],
        answerIndex: 0,
        evidenceSentenceIndex: 165,
      },
      {
        type: "comprehension",
        questionJp: "先週（せんしゅう）、何（なに）がありましたか。",
        questionReading: "せんしゅう なに が ありました か",
        optionsJp: [
          "頭（あたま）が痛（いた）くなりました。",
          "運動中（うんどうちゅう）に足（あし）を捻挫（ねんざ）しました。",
          "事故（じこ）に遭（あ）いました。",
        ],
        optionsReading: ["あたま が いたく なりました", "うんどうちゅう に あし を ねんざ しました", "じこ に あいました"],
        answerIndex: 1,
        evidenceSentenceIndex: 166,
      },
      {
        type: "comprehension",
        questionJp: "大変（たいへん）な時（とき）はどうしますか。",
        questionReading: "たいへん な とき は どう します か",
        optionsJp: [
          "救急車（きゅうきゅうしゃ）を呼（よ）びます。",
          "歯医者（はいしゃ）に行（い）きます。",
          "薬（くすり）を飲（の）みます。",
        ],
        optionsReading: ["きゅうきゅうしゃ を よびます", "はいしゃ に いきます", "くすり を のみます"],
        answerIndex: 0,
        evidenceSentenceIndex: 168,
      },
      {
        type: "comprehension",
        questionJp: "去年（きょねん）、何（なに）がありましたか。",
        questionReading: "きょねん なに が ありました か",
        optionsJp: [
          "事故（じこ）に遭（あ）って、手術（しゅじゅつ）が必要（ひつよう）でした。",
          "足（あし）を捻挫（ねんざ）して、手術（しゅじゅつ）が必要（ひつよう）でした。",
          "熱（ねつ）があって、薬（くすり）が必要（ひつよう）でした。",
        ],
        optionsReading: [
          "じこ に あって しゅじゅつ が ひつよう でした",
          "あし を ねんざ して しゅじゅつ が ひつよう でした",
          "ねつ が あって くすり が ひつよう でした",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: [169, 171],
        compositionNote: "Combines accident (#169) with surgery necessity (#171) into 〜て + でした",
      },
      {
        type: "comprehension",
        questionJp: "何（なに）が怖（こわ）いですか。",
        questionReading: "なに が こわい です か",
        optionsJp: ["病院（びょういん）が怖（こわ）いです。", "注射（ちゅうしゃ）が怖（こわ）いです。", "歯医者（はいしゃ）が怖（こわ）いです。"],
        optionsReading: ["びょういん が こわい です", "ちゅうしゃ が こわい です", "はいしゃ が こわい です"],
        answerIndex: 1,
        evidenceSentenceIndex: 172,
      },
      {
        type: "negative",
        questionJp: "昨日（きのう）起（お）こらなかったことはどれですか。",
        questionReading: "きのう おこらなかった こと は どれ です か",
        optionsJp: [
          "頭（あたま）が痛（いた）かったです。",
          "足（あし）を捻挫（ねんざ）しました。",
          "熱（ねつ）がありました。",
        ],
        optionsReading: ["あたま が いたかった です", "あし を ねんざ しました", "ねつ が ありました"],
        answerIndex: 1,
        evidenceSentenceIndex: [156, 159, 166],
        compositionNote: "Options a and c are yesterday's symptoms (#156 headache, #159 fever); option b (sprained ankle) happened last week (#166)",
      },
    ],
  },

  // ============================================================
  // SPRINT 08 — House & Objects
  // ============================================================
  {
    sprint: 7,
    questions: [
      {
        type: "synthesis",
        questionJp: "家（いえ）はどんな家（いえ）ですか。",
        questionReading: "いえ は どんな いえ です か",
        optionsJp: [
          "駅（えき）から近（ちか）くて便利（べんり）です。リビングにソファがあって、寝室（しんしつ）は二階（にかい）で、キッチンは狭（せま）いですが綺麗（きれい）です。",
          "駅（えき）から遠（とお）くて不便（ふべん）です。",
          "大（おお）きな家（いえ）で、部屋（へや）がたくさんあります。",
        ],
        optionsReading: [
          "えき から ちかくて べんり です りびんぐ に そふぁ が あって しんしつ は にかい で きっちん は せまい です が きれい です",
          "えき から とおくて ふべん です",
          "おおきな いえ で へや が たくさん あります",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: [174, 175, 176, 177, 178],
        compositionNote: "Collapses five house-facts (#174–#178) into 〜て/〜で chain",
      },
      {
        type: "comprehension",
        questionJp: "ソファはどこにありますか。",
        questionReading: "そふぁ は どこ に あります か",
        optionsJp: ["リビングにあります。", "寝室（しんしつ）にあります。", "キッチンにあります。"],
        optionsReading: ["りびんぐ に あります", "しんしつ に あります", "きっちん に あります"],
        answerIndex: 0,
        evidenceSentenceIndex: 176,
      },
      {
        type: "comprehension",
        questionJp: "寝室（しんしつ）は何階（なんがい）ですか。",
        questionReading: "しんしつ は なんがい です か",
        optionsJp: ["一階（いっかい）です。", "二階（にかい）です。", "三階（さんかい）です。"],
        optionsReading: ["いっかい です", "にかい です", "さんかい です"],
        answerIndex: 1,
        evidenceSentenceIndex: 177,
      },
      {
        type: "comprehension",
        questionJp: "キッチンはどんなキッチンですか。",
        questionReading: "きっちん は どんな きっちん です か",
        optionsJp: ["広（ひろ）くて綺麗（きれい）です。", "狭（せま）いですが綺麗（きれい）です。", "狭（せま）くて汚（きたな）いです。"],
        optionsReading: ["ひろくて きれい です", "せまい です が きれい です", "せまくて きたない です"],
        answerIndex: 1,
        evidenceSentenceIndex: 178,
      },
      {
        type: "comprehension",
        questionJp: "毎日（まいにち）何（なに）をしますか。",
        questionReading: "まいにち なに を します か",
        optionsJp: [
          "お風呂（ふろ）に入（はい）ります。",
          "木（き）を植（う）えます。",
          "洗濯物（せんたくもの）を干（ほ）します。",
        ],
        optionsReading: ["おふろ に はいります", "き を うえます", "せんたくもの を ほします"],
        answerIndex: 0,
        evidenceSentenceIndex: 179,
      },
      {
        type: "comprehension",
        questionJp: "先週（せんしゅう）、何（なに）をしましたか。",
        questionReading: "せんしゅう なに を しました か",
        optionsJp: ["窓（まど）を開（あ）けました。", "庭（にわ）に木（き）を植（う）えました。", "カーテンを閉（し）めました。"],
        optionsReading: ["まど を あけました", "にわ に き を うえました", "かーてん を しめました"],
        answerIndex: 1,
        evidenceSentenceIndex: 180,
      },
      {
        type: "comprehension",
        questionJp: "朝（あさ）、何（なに）をしますか。",
        questionReading: "あさ なに を します か",
        optionsJp: [
          "窓（まど）を開（あ）けて空気（くうき）を入（い）れます。",
          "カーテンを閉（し）めます。",
          "洗濯機（せんたくき）を回（まわ）します。",
        ],
        optionsReading: ["まど を あけて くうき を いれます", "かーてん を しめます", "せんたくき を まわします"],
        answerIndex: 0,
        evidenceSentenceIndex: 181,
      },
      {
        type: "comprehension",
        questionJp: "冷蔵庫（れいぞうこ）に何（なに）がありませんか。",
        questionReading: "れいぞうこ に なに が ありません か",
        optionsJp: ["牛乳（ぎゅうにゅう）がありません。", "卵（たまご）がありません。", "バターがありません。"],
        optionsReading: ["ぎゅうにゅう が ありません", "たまご が ありません", "ばたー が ありません"],
        answerIndex: 0,
        evidenceSentenceIndex: 184,
      },
      {
        type: "comprehension",
        questionJp: "いつベランダに洗濯物（せんたくもの）を干（ほ）しますか。",
        questionReading: "いつ べらんだ に せんたくもの を ほします か",
        optionsJp: ["晴（は）れた日（ひ）です。", "雨（あめ）の日（ひ）です。", "毎日（まいにち）です。"],
        optionsReading: ["はれた ひ です", "あめ の ひ です", "まいにち です"],
        answerIndex: 0,
        evidenceSentenceIndex: 188,
      },
      {
        type: "negative",
        questionJp: "この家（いえ）について正（ただ）しくないことはどれですか。",
        questionReading: "この いえ に ついて ただしく ない こと は どれ です か",
        optionsJp: [
          "リビングにソファがあります。",
          "キッチンは広（ひろ）くて綺麗（きれい）です。",
          "寝室（しんしつ）は二階（にかい）です。",
        ],
        optionsReading: ["りびんぐ に そふぁ が あります", "きっちん は ひろくて きれい です", "しんしつ は にかい です"],
        answerIndex: 1,
        evidenceSentenceIndex: [176, 177, 178],
        compositionNote: "Options a and c are stated facts (#176 sofa in living room, #177 bedroom on 2F); option b contradicts #178 (kitchen is small, not large)",
      },
    ],
  },

  // ============================================================
  // SPRINT 09 — Work & School
  // ============================================================
  {
    sprint: 8,
    questions: [
      {
        type: "synthesis",
        questionJp: "今日（きょう）、会社（かいしゃ）で何（なに）がありましたか。",
        questionReading: "きょう かいしゃ で なに が ありました か",
        optionsJp: [
          "会社（かいしゃ）に遅刻（ちこく）して、残業（ざんぎょう）しなければならなくて、コピー機（き）も故障（こしょう）して困（こま）りました。",
          "宿題（しゅくだい）を忘（わす）れて、授業（じゅぎょう）を欠席（けっせき）しました。",
          "試験（しけん）に合格（ごうかく）して、嬉（うれ）しかったです。",
        ],
        optionsReading: [
          "かいしゃ に ちこくして ざんぎょう しなければ ならなくて こぴーき も こしょうして こまりました",
          "しゅくだい を わすれて じゅぎょう を けっせき しました",
          "しけん に ごうかくして うれしかった です",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: [194, 195, 201, 202],
        compositionNote: "Collapses work-problems (#194 late, #195 overtime, #201 copier, #202 in trouble) into 〜て-chain",
      },
      {
        type: "comprehension",
        questionJp: "何（なに）が壊（こわ）れましたか。",
        questionReading: "なに が こわれました か",
        optionsJp: ["コピー機（き）が壊（こわ）れました。", "パソコンが壊（こわ）れました。", "エアコンが壊（こわ）れました。"],
        optionsReading: ["こぴーき が こわれました", "ぱそこん が こわれました", "えあこん が こわれました"],
        answerIndex: 0,
        evidenceSentenceIndex: 201,
      },
      {
        type: "comprehension",
        questionJp: "誰（だれ）に報告（ほうこく）しますか。",
        questionReading: "だれ に ほうこく します か",
        optionsJp: [
          "部長（ぶちょう）に報告（ほうこく）します。",
          "先生（せんせい）に報告（ほうこく）します。",
          "同僚（どうりょう）に報告（ほうこく）します。",
        ],
        optionsReading: ["ぶちょう に ほうこく します", "せんせい に ほうこく します", "どうりょう に ほうこく します"],
        answerIndex: 0,
        evidenceSentenceIndex: 198,
      },
      {
        type: "comprehension",
        questionJp: "先週（せんしゅう）、何（なに）を送（おく）りましたか。",
        questionReading: "せんしゅう なに を おくりました か",
        optionsJp: ["メールを送（おく）りました。", "手紙（てがみ）を送（おく）りました。", "資料（しりょう）を送（おく）りました。"],
        optionsReading: ["めーる を おくりました", "てがみ を おくりました", "しりょう を おくりました"],
        answerIndex: 0,
        evidenceSentenceIndex: 199,
      },
      {
        type: "synthesis",
        questionJp: "学校（がっこう）で何（なに）がありましたか。",
        questionReading: "がっこう で なに が ありました か",
        optionsJp: [
          "宿題（しゅくだい）を忘（わす）れたので授業（じゅぎょう）を欠席（けっせき）しますが、先週（せんしゅう）の試験（しけん）には合格（ごうかく）しました。",
          "会社（かいしゃ）に遅刻（ちこく）して、残業（ざんぎょう）しなければなりません。",
          "メールを送（おく）って、資料（しりょう）を準備（じゅんび）しました。",
        ],
        optionsReading: [
          "しゅくだい を わすれた ので じゅぎょう を けっせき します が せんしゅう の しけん には ごうかく しました",
          "かいしゃ に ちこくして ざんぎょう しなければ なりません",
          "めーる を おくって しりょう を じゅんび しました",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: [203, 204, 205],
        compositionNote: "Combines absent-because-forgot (#203–#204) with passed-exam-last-week (#205) via 〜が contrast",
      },
      {
        type: "comprehension",
        questionJp: "どうして今日（きょう）授業（じゅぎょう）を欠席（けっせき）しますか。",
        questionReading: "どうして きょう じゅぎょう を けっせき します か",
        optionsJp: ["病気（びょうき）だからです。", "宿題（しゅくだい）を忘（わす）れたからです。", "仕事（しごと）があるからです。"],
        optionsReading: ["びょうき だ から です", "しゅくだい を わすれた から です", "しごと が ある から です"],
        answerIndex: 1,
        evidenceSentenceIndex: 203,
      },
      {
        type: "comprehension",
        questionJp: "先週（せんしゅう）、何（なに）がありましたか。",
        questionReading: "せんしゅう なに が ありました か",
        optionsJp: ["試験（しけん）に合格（ごうかく）しました。", "課題（かだい）を提出（ていしゅつ）しました。", "休暇（きゅうか）を取りました。"],
        optionsReading: ["しけん に ごうかく しました", "かだい を ていしゅつ しました", "きゅうか を とりました"],
        answerIndex: 0,
        evidenceSentenceIndex: 205,
      },
      {
        type: "comprehension",
        questionJp: "今（いま）、何（なに）をしますか。",
        questionReading: "いま なに を します か",
        optionsJp: ["課題（かだい）を提出（ていしゅつ）します。", "休暇（きゅうか）を取（と）ります。", "会議（かいぎ）に行（い）きます。"],
        optionsReading: ["かだい を ていしゅつ します", "きゅうか を とります", "かいぎ に いきます"],
        answerIndex: 0,
        evidenceSentenceIndex: 207,
      },
      {
        type: "comprehension",
        questionJp: "何（なに）が難（むずか）しいですか。",
        questionReading: "なに が むずかしい です か",
        optionsJp: ["発音（はつおん）が難（むずか）しいです。", "書（か）くのが難（むずか）しいです。", "読（よ）むのが難（むずか）しいです。"],
        optionsReading: ["はつおん が むずかしい です", "かく の が むずかしい です", "よむ の が むずかしい です"],
        answerIndex: 0,
        evidenceSentenceIndex: 210,
      },
      {
        type: "comprehension",
        questionJp: "発音（はつおん）について何（なに）をお願（ねが）いしましたか。",
        questionReading: "はつおん に ついて なに を おねがい しました か",
        optionsJp: [
          "もう一度（いちど）言（い）ってくださいとお願（ねが）いしました。",
          "書（か）いてくださいとお願（ねが）いしました。",
          "読（よ）んでくださいとお願（ねが）いしました。",
        ],
        optionsReading: [
          "もういちど いって ください と おねがい しました",
          "かいて ください と おねがい しました",
          "よんで ください と おねがい しました",
        ],
        answerIndex: 0,
        evidenceSentenceIndex: 211,
      },
      {
        type: "negative",
        questionJp: "会社（かいしゃ）で起（お）こらなかったことはどれですか。",
        questionReading: "かいしゃ で おこらなかった こと は どれ です か",
        optionsJp: [
          "コピー機（き）が故障（こしょう）しました。",
          "宿題（しゅくだい）を忘（わす）れました。",
          "会社（かいしゃ）に遅刻（ちこく）しました。",
        ],
        optionsReading: ["こぴーき が こしょう しました", "しゅくだい を わすれました", "かいしゃ に ちこく しました"],
        answerIndex: 1,
        evidenceSentenceIndex: [194, 201, 203],
        compositionNote: "Options a and c are work-events (#201 copier, #194 late); option b (forgot homework) is a school-event (#203)",
      },
    ],
  },
];

// Make storyQuizData available globally
if (typeof window !== "undefined") {
  window.storyQuizData = storyQuizData;
}