// ==================== PARTICLE DATA ====================
const particlesData = {
  // Core Particles
  は: {
    name: "wa (topic marker)",
    function:
      "Defines the topic of the sentence. Emphasizes information AFTER は.",
    position: "Topic + は + Comment",
    usageNote:
      "Used to mark what the sentence is about. Can be thought of as 'as for...' or 'speaking of...'",
    confusingWith: "が",
    category: "core",
    supplementaryExample: {
      jp: "私（わたし）は 学生（がくせい）です",
      reading: "わたしはがくせいです",
      translation: "As for me, I am a student.",
    },
  },
  が: {
    name: "ga (subject marker)",
    function:
      "Defines the doer of the action. Emphasizes information BEFORE が.",
    position: "Subject + が + Predicate",
    usageNote:
      "Used to mark new information, the subject of existence (ある/いる), and with likes/dislikes (好（す）き/嫌（きら）い/欲（ほ）しい).",
    confusingWith: "は",
    category: "core",
    supplementaryExample: {
      jp: "犬（いぬ）が 走（はし）ります",
      reading: "いぬがはしります",
      translation: "The dog runs.",
    },
  },
  を: {
    name: "wo (object marker)",
    function: "Marks the direct object of an action verb.",
    position: "Subject + Object + を + Verb",
    usageNote:
      "Only used with transitive verbs (actions done to something). The を is often pronounced 'o'.",
    confusingWith: null,
    category: "core",
    supplementaryExample: {
      jp: "本（ほん）を 読（よ）みます",
      reading: "ほんをよみます",
      translation: "I read a book.",
    },
  },
  に: {
    name: "ni (time/direction/existence)",
    function:
      "Indicates a specific point in time, direction of movement, or location of existence.",
    position: "Time/Place + に + Verb",
    usageNote:
      "Used with specific times (3時（じ）, 日曜日（にちようび）), destinations (学校（がっこう）に行（い）く), and existence location (公園（こうえん）にある).",
    confusingWith: "で",
    category: "core",
    supplementaryExample: {
      jp: "東京（とうきょう）に 行（い）きます",
      reading: "とうきょうにいきます",
      translation: "I will go to Tokyo.",
    },
  },
  で: {
    name: "de (location/means)",
    function:
      "Indicates where an action takes place or the means by which something is done.",
    position: "Place/Means + で + Action Verb",
    usageNote:
      "Used for action locations (公園（こうえん）で遊（あそ）ぶ) and methods/instruments (電車（でんしゃ）で行（い）く, ペンで書（か）く).",
    confusingWith: "に",
    category: "core",
    supplementaryExample: {
      jp: "学校（がっこう）で 勉強（べんきょう）します",
      reading: "がっこうでべんきょうします",
      translation: "I study at school.",
    },
  },
  へ: {
    name: "e (direction)",
    function: "Indicates the general direction of movement.",
    position: "Direction + へ + Movement Verb",
    usageNote:
      "Similar to に for destinations, but へ emphasizes the direction/general path rather than arrival. Pronounced 'e'.",
    confusingWith: "に",
    category: "core",
    supplementaryExample: {
      jp: "北（きた）へ 向（む）かいます",
      reading: "きたへむかいます",
      translation: "I head towards the north.",
    },
  },
  と: {
    name: "to (and/with)",
    function: "Connects nouns (and) or indicates accompaniment (with).",
    position: "Noun A + と + Noun B  OR  Person + と + Verb",
    usageNote:
      "Used to list items (犬（いぬ）と猫（ねこ）) or indicate doing something with someone (友達（ともだち）と行（い）く). Also used for quoting (と言（い）う).",
    confusingWith: null,
    category: "core",
    supplementaryExample: {
      jp: "友達（ともだち）と 話（はな）します",
      reading: "ともだちとはなします",
      translation: "I speak with a friend.",
    },
  },
  から: {
    name: "kara (from)",
    function: "Indicates origin, starting point in time or space.",
    position: "Origin + から + Verb",
    usageNote:
      "Can be used for time (10時（じ）から) and place (東京（とうきょう）から). Also means 'because' when used after a clause.",
    confusingWith: "まで",
    category: "core",
    supplementaryExample: {
      jp: "授業（じゅぎょう）は 九時（くじ）から 始（はじ）まります",
      reading: "じゅぎょうはくじからはじまります",
      translation: "Class starts at nine.",
    },
  },
  まで: {
    name: "made (until/to)",
    function: "Indicates an end point in time or space.",
    position: "End Point + まで + Verb",
    usageNote:
      "Used with time (5時（じ）まで) or place (大阪（おおさか）まで). Often paired with から (from...to).",
    confusingWith: "から",
    category: "core",
    supplementaryExample: {
      jp: "駅（えき）まで 歩（ある）きます",
      reading: "えきまであるきます",
      translation: "I walk to the station.",
    },
  },
  の: {
    name: "no (possession/linking)",
    function:
      "Connects nouns to show possession, description, or relationship.",
    position: "Noun A + の + Noun B",
    usageNote:
      "Shows possession (私（わたし）の本（ほん）), describes attributes (日本語（にほんご）の授業（じゅぎょう）), or indicates origin (東京（とうきょう）の友達（ともだち）). Also nominalizes verbs (食（た）べるの).",
    confusingWith: null,
    category: "core",
    supplementaryExample: {
      jp: "私（わたし）の 車（くるま）",
      reading: "わたしのくるま",
      translation: "My car.",
    },
  },
  も: {
    name: "mo (also/even)",
    function: "Indicates 'also', 'too', or 'even'.",
    position: "Replaces は, が, を; adds to other particles",
    usageNote:
      "Shows that something is in addition to something else. Can also mean 'as many as' with quantities.",
    confusingWith: null,
    category: "core",
    supplementaryExample: {
      jp: "私（わたし）も 行（い）きます",
      reading: "わたしもいきます",
      translation: "I will go too.",
    },
  },
  か: {
    name: "ka (question/or)",
    function: "Marks a question or indicates choice ('or').",
    position: "End of sentence (question) or between nouns (or)",
    usageNote:
      "At the end of a sentence makes it a question. Between nouns means 'or'.",
    confusingWith: null,
    category: "core",
    supplementaryExample: {
      jp: "これ は 本（ほん）ですか",
      reading: "これはほんですか",
      translation: "Is this a book?",
    },
  },
  よ: {
    name: "yo (emphasis)",
    function: "Adds emphasis, certainty, or new information.",
    position: "End of sentence",
    usageNote:
      "Used to inform the listener of something they may not know. Adds a sense of certainty or assertion.",
    confusingWith: "ね",
    category: "core",
    supplementaryExample: {
      jp: "これ は 本（ほん）ですよ",
      reading: "これはほんですよ",
      translation: "This is a book (I'm telling you).",
    },
  },
  ね: {
    name: "ne (confirmation)",
    function: "Seeks agreement or confirmation.",
    position: "End of sentence",
    usageNote:
      "Used to seek agreement, like 'isn't it?' or 'right?' Creates a friendly, inclusive tone.",
    confusingWith: "よ",
    category: "core",
    supplementaryExample: {
      jp: "いい天気（てんき）ですね",
      reading: "いいてんきですね",
      translation: "Nice weather, isn't it?",
    },
  },
  や: {
    name: "ya (partial listing)",
    function: "Lists examples ('things like...', 'such as...').",
    position: "Between nouns",
    usageNote:
      "Used to list incomplete examples, implying there are more items not listed. Unlike と which lists everything.",
    confusingWith: "と",
    category: "core",
    supplementaryExample: {
      jp: "りんごや バナナを 食（た）べます",
      reading: "りんごやバナナをたべます",
      translation: "I eat things like apples and bananas.",
    },
  },

  // Additional particles (single-token and compound) - these match the shared
  // PARTICLES list in helpers.js, so anything highlighted in the flashcards also
  // has a reference entry here.
  より: {
    name: "yori (than / from)",
    function:
      "Marks the standard in a comparison (B より A のほうが = A is more ... than B). Also marks a starting point, more formally than から.",
    position: "B + より + A + のほうが + Adjective",
    usageNote:
      "Comparison: 電車（でんしゃ）より バス の ほうが 安（やす）い です (the bus is cheaper than the train).",
    confusingWith: "から",
    category: "additional",
    supplementaryExample: {
      jp: "電車（でんしゃ）より バス の ほうが 安（やす）い です",
      reading: "でんしゃよりばすのほうがやすいです",
      translation: "The bus is cheaper than the train.",
    },
  },
  くらい: {
    name: "kurai / gurai (about, approximately)",
    function:
      "Shows an approximate amount, time or extent. Written ぐらい after some nouns.",
    position: "Amount/Time + くらい",
    usageNote:
      "About an amount: 十分（じゅっぷん）ぐらい かかります (it takes about ten minutes). くらい and ぐらい are interchangeable.",
    confusingWith: "ごろ",
    category: "additional",
    supplementaryExample: {
      jp: "駅（えき）まで 十分（じゅっぷん）ぐらい かかります",
      reading: "えきまでじゅっぷんぐらいかかります",
      translation: "It takes about ten minutes to the station.",
    },
  },
  ごろ: {
    name: "goro (around a time)",
    function: "Shows an approximate point in time - a clock time or a day.",
    position: "Time + ごろ",
    usageNote:
      "Around a time: 七時（しちじ）ごろ 起（お）きます (I get up around seven). Use くらい for amounts and ごろ for points in time.",
    confusingWith: "くらい",
    category: "additional",
    supplementaryExample: {
      jp: "七時（しちじ）ごろ 起（お）きます",
      reading: "しちじごろおきます",
      translation: "I get up around seven.",
    },
  },
  だけ: {
    name: "dake (only, just)",
    function: "Limits the preceding word: 'only that, nothing else'.",
    position: "Noun + だけ",
    usageNote:
      "水（みず）だけ 飲（の）みました (I drank only water). Can take で: 一人（ひとり）だけで (all alone).",
    confusingWith: "しか",
    category: "additional",
    supplementaryExample: {
      jp: "水（みず）だけ 飲（の）みました",
      reading: "みずだけのみました",
      translation: "I drank only water.",
    },
  },
  ほど: {
    name: "hodo (extent, about)",
    function:
      "Shows extent or an approximate amount. 〜ほど〜ない = not as ... as ...",
    position: "Amount + ほど",
    usageNote:
      "一時間（いちじかん）ほど 待（ま）ちました (I waited about an hour). 今年（ことし）は 去年（きょねん）ほど 暑（あつ）くない (this year is not as hot as last year).",
    confusingWith: "くらい",
    category: "additional",
    supplementaryExample: {
      jp: "一時間（いちじかん）ほど 待（ま）ちました",
      reading: "いちじかんほどまちました",
      translation: "I waited about an hour.",
    },
  },
  には: {
    name: "ni wa (location/target + topic)",
    function:
      "に (location, direction or target) plus the topic marker は, adding contrast or emphasis. 〜には also means 'for (someone)'.",
    position: "Place/Person + には",
    usageNote:
      "駅（えき）の 前（まえ）には 銀行（ぎんこう）が あります (there is a bank in front of the station). 私（わたし）には 難（むずか）しい です (it is difficult for me).",
    confusingWith: "に",
    category: "additional",
    supplementaryExample: {
      jp: "駅（えき）の 前（まえ）には 銀行（ぎんこう）が あります",
      reading: "えきのまえにはぎんこうがあります",
      translation: "There is a bank in front of the station.",
    },
  },
  ので: {
    name: "node (because - objective)",
    function:
      "Gives an objective reason or cause. Softer and more factual than から.",
    position: "Plain form + ので",
    usageNote:
      "寒（さむ）い ので 窓（まど）を 閉（し）めます (because it is cold, I will close the window). ので is politer than から when giving a reason.",
    confusingWith: "から",
    category: "additional",
    supplementaryExample: {
      jp: "寒（さむ）い ので 窓（まど）を 閉（し）めます",
      reading: "さむいのでまどをしめます",
      translation: "Because it is cold, I will close the window.",
    },
  },
  ながら: {
    name: "nagara (while doing)",
    function:
      "Two actions by the same person at the same time. The main action is the last verb.",
    position: "Verb stem + ながら + main verb",
    usageNote:
      "音楽（おんがく）を 聞（き）きながら 勉強（べんきょう）します (I study while listening to music).",
    confusingWith: "あいだ",
    category: "additional",
    supplementaryExample: {
      jp: "音楽（おんがく）を 聞（き）きながら 勉強（べんきょう）します",
      reading: "おんがくをききながらべんきょうします",
      translation: "I study while listening to music.",
    },
  },
  のに: {
    name: "noni (although)",
    function:
      "Marks contrast: 'although / even though'. Often expresses surprise or dissatisfaction.",
    position: "Plain form + のに",
    usageNote:
      "雨（あめ）が 降（ふ）っている のに 出（で）かけました (although it was raining, I went out).",
    confusingWith: "が",
    category: "additional",
    supplementaryExample: {
      jp: "雨（あめ）が 降（ふ）っている のに 出（で）かけました",
      reading: "あめがふっているのにでかけました",
      translation: "Although it was raining, I went out.",
    },
  },
  など: {
    name: "nado (etc., such as)",
    function: "Lists something as one example among others.",
    position: "Noun + など",
    usageNote:
      "りんご や みかん など を 買（か）いました (I bought things like apples and oranges).",
    confusingWith: "や",
    category: "additional",
    supplementaryExample: {
      jp: "りんご や みかん など を 買（か）いました",
      reading: "りんごやみかんなどをかいました",
      translation: "I bought things like apples and oranges.",
    },
  },
  しか: {
    name: "shika (only - with a negative verb)",
    function:
      "Means 'only', but always with a negative verb. Stronger than だけ.",
    position: "Noun + しか + negative verb",
    usageNote:
      "百円（ひゃくえん）しか ありません (I only have 100 yen). しか needs a negative ending; だけ does not.",
    confusingWith: "だけ",
    category: "additional",
    supplementaryExample: {
      jp: "百円（ひゃくえん）しか ありません",
      reading: "ひゃくえんしかありません",
      translation: "I only have 100 yen.",
    },
  },
  ばかり: {
    name: "bakari (only, nothing but)",
    function:
      "Shows that something keeps happening, or that there is nothing but that. Often carries a complaint.",
    position: "Verb て-form / Noun + ばかり",
    usageNote:
      "遊（あそ）んで ばかり います (he does nothing but play). ばかり can imply criticism.",
    confusingWith: "だけ",
    category: "additional",
    supplementaryExample: {
      jp: "遊（あそ）んで ばかり います",
      reading: "あそんでばかりいます",
      translation: "He does nothing but play.",
    },
  },
  って: {
    name: "tte (casual と / は)",
    function:
      "Casual spoken form of the quotation particle と, and of the topic marker は in conversation.",
    position: "Quote/Topic + って",
    usageNote:
      "明日（あした） 来（く）る って 言（い）いました (he said he would come tomorrow). 田中（たなか）さん って 誰（だれ）ですか (who is Tanaka?). Used in speech, not in formal writing.",
    confusingWith: "と",
    category: "additional",
    supplementaryExample: {
      jp: "田中（たなか）さん って 誰（だれ） です か",
      reading: "たなかさんってだれですか",
      translation: "Who is Tanaka-san? (casual topic marker)",
    },
  },
  さえ: {
    name: "sae (even)",
    function:
      "Shows an extreme example: 'even that', implying others are more likely.",
    position: "Noun + さえ",
    usageNote:
      "子供（こども）さえ 知（し）っています (even a child knows). さえ emphasises how surprising the example is.",
    confusingWith: "も",
    category: "additional",
    supplementaryExample: {
      jp: "子供（こども）さえ 知（し）っています",
      reading: "こどもさえしっています",
      translation: "Even a child knows.",
    },
  },
  こそ: {
    name: "koso (emphasis: precisely this)",
    function:
      "Emphasises the preceding word: 'this is exactly the one'. Adds emphasis, not a new meaning.",
    position: "Noun + こそ",
    usageNote:
      "これ こそ 私（わたし）が 欲（ほ）しかった 物（もの）です (this is exactly what I wanted).",
    confusingWith: "は",
    category: "additional",
    supplementaryExample: {
      jp: "これ こそ 私（わたし）が 欲（ほ）しかった 物（もの）です",
      reading: "これこそわたしがほしかったものです",
      translation: "This is exactly what I wanted.",
    },
  },

  // Confusing Pairs
  pair_wa_ga: {
    name: "は vs が",
    description:
      "The most common confusion for learners. Both mark the subject/topic but with different emphasis.",
    rule1: "は emphasizes what comes AFTER (the comment about the topic)",
    rule2: "が emphasizes what comes BEFORE (the subject doing the action)",
    example1:
      "私（わたし）は 学生（がくせい）です → I am a student (emphasis on 'student')",
    example2:
      "私（わたし）が 学生（がくせい）です → I am the student (emphasis on 'me', not someone else)",
    additionalNote:
      "が is also used with existence verbs (ある/いる) and with likes/dislikes (好（す）き/嫌（きら）い).",
    category: "pair",
  },
  pair_ni_de: {
    name: "に vs で (location)",
    description: "Both indicate location, but with different types of verbs.",
    rule1: "に is for existence (ある/いる) — where something IS",
    rule2: "で is for action — where something HAPPENS",
    example1:
      "公園（こうえん）に 犬（いぬ）がいます → There is a dog in the park (existence)",
    example2: "公園（こうえん）で 遊（あそ）びます → Play in the park (action)",
    additionalNote:
      "に can also indicate destination (学校（がっこう）に行（い）く) while で indicates means (電車（でんしゃ）で行（い）く).",
    category: "pair",
  },
  pair_ni_e: {
    name: "に vs へ (direction)",
    description:
      "Both indicate movement toward a place. Often interchangeable, but subtle differences exist.",
    rule1: "に emphasizes ARRIVAL at a specific destination",
    rule2: "へ emphasizes the DIRECTION of movement (more general)",
    example1:
      "東京（とうきょう）に 行（い）きます → Go TO Tokyo (arrival focused, destination is the goal)",
    example2:
      "東京（とうきょう）へ 行（い）きます → Go TOWARD Tokyo (direction focused, journey matters more)",
    additionalNote:
      "へ can be used even if you don't have a specific destination (e.g., 右（みぎ）へ曲（ま）がる - turn to the right).",
    category: "pair",
  },
};

// Particle order for display
const particleOrder = [
  "は",
  "が",
  "を",
  "に",
  "で",
  "へ",
  "と",
  "から",
  "まで",
  "の",
  "も",
  "か",
  "よ",
  "ね",
  "や",
  "より",
  "くらい",
  "ごろ",
  "だけ",
  "ほど",
  "には",
  "ので",
  "ながら",
  "のに",
  "など",
  "しか",
  "ばかり",
  "って",
  "さえ",
  "こそ",
];

// Particle pair order for display
const particlePairOrder = ["pair_wa_ga", "pair_ni_de", "pair_ni_e"];
