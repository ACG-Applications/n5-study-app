// ==================== SPRINT STORIES ====================
// One short graded reading per sprint. Each passage is a single coherent
// first-person scene; the ten passages replace an earlier version that was a
// re-sequenced list of the sprint's sentences rather than a narrative.
// Furigana format: 漢字（よみ）.

const sprintStories = [
  {
    title: "A Typical Day",
    storyJp:
      "私（わたし）は 毎朝（まいあさ） 六時（ろくじ）に 起（お）きます。まず 顔（かお）を 洗（あら）って、歯（は）を 磨（みが）きます。それから 朝（あさ）ごはんを 食（た）べて、七時半（しちじはん）に 家（いえ）を 出（で）ます。駅（えき）まで 歩（ある）いて 十分（じゅっぷん）ぐらい かかります。会社（かいしゃ）は 八時半（はちじはん）に 始（はじ）まります。仕事（しごと）は 五時（ごじ）に 終（おわ）ります。夜（よる）は 十時（じゅうじ）に 寝（ね）ます。",
    storyEn:
      "I get up at six every morning. First I wash my face and brush my teeth. Then I eat breakfast and leave the house at seven thirty. It takes about ten minutes to walk to the station. Work starts at eight thirty. Work finishes at five. I go to bed at ten at night.",
  },
  {
    title: "My Family",
    storyJp:
      "私（わたし）の 家族（かぞく）は 四人（よにん）です。父（ちち）は 銀行（ぎんこう）で 働（はたら）いています。母（はは）は 毎日（まいにち） 家（いえ）で 料理（りょうり）を します。兄（あに）は 大学生（だいがくせい）で、東京（とうきょう）に 住（す）んでいます。私（わたし）は 妹（いもうと）と 一緒（いっしょ）に 学校（がっこう）へ 行（い）きます。妹（いもうと）は ピアノが 上手（じょうず）です。日曜日（にちようび）には、家族（かぞく） みんなで 晩（ばん）ごはんを 食（た）べます。",
    storyEn:
      "There are four people in my family. My father works at a bank. My mother cooks at home every day. My older brother is a university student and lives in Tokyo. I go to school together with my younger sister. My younger sister is good at the piano. On Sundays the whole family eats dinner together.",
  },
  {
    title: "Finding My Way Around Town",
    storyJp:
      "私（わたし）の 家（いえ）は 駅（えき）の 近（ちか）くに あります。駅（えき）の 前（まえ）に 大（おお）きい スーパーが あります。郵便局（ゆうびんきょく）は スーパーの 隣（となり）です。学校（がっこう）までは、バスで 十五分（じゅうごふん）ぐらい かかります。バス停（ばすてい）は 家（いえ）から 歩（ある）いて 五分（ごふん）です。雨（あめ）の 日（ひ）は タクシーで 行（い）きます。駅（えき）の 中（なか）に 小（ちい）さい 本屋（ほんや）が あります。",
    storyEn:
      "My house is near the station. In front of the station there is a big supermarket. The post office is next to the supermarket. It takes about fifteen minutes by bus to school. The bus stop is a five-minute walk from my house. On rainy days I go by taxi. Inside the station there is a small bookshop.",
  },
  {
    title: "A Day of Shopping and Eating",
    storyJp:
      "今日（きょう）は 友達（ともだち）と デパートへ 行（い）きました。デパートで 青（あお）い シャツを 買（か）いました。シャツは 三千円（さんぜんえん）でした。それから レストランで 昼（ひる）ごはんを 食（た）べました。私（わたし）は 寿司（すし）を 食（た）べました。友達（ともだち）は ラーメンを 食（た）べて、「とても おいしい」と 言（い）いました。帰（かえ）りに スーパーで 果物（くだもの）を 買（か）いました。",
    storyEn:
      "Today I went to a department store with a friend. I bought a blue shirt at the department store. The shirt was three thousand yen. After that we ate lunch at a restaurant. I ate sushi. My friend ate ramen and said it was very good. On the way home I bought fruit at the supermarket.",
  },
  {
    title: "Weather and Feelings",
    storyJp:
      "今日（きょう）は とても 寒（さむ）いです。朝（あさ）から 雨（あめ）が 降（ふ）っています。午後（ごご）は 風（かぜ）も 強（つよ）いです。私（わたし）は 雨（あめ）の 日（ひ）が 少（すこ）し 嫌（きら）いです。でも、雨（あめ）の 音（おと）は 好（す）きです。昨日（きのう）は 晴（は）れでした。だから、公園（こうえん）で サッカーを して、とても 楽（たの）しかったです。",
    storyEn:
      "Today it is very cold. It has been raining since morning. In the afternoon the wind is strong too. I dislike rainy days a little. But I like the sound of the rain. Yesterday was sunny. So I played soccer in the park and it was a lot of fun.",
  },
  {
    title: "Hobbies and Giving",
    storyJp:
      "私（わたし）の 趣味（しゅみ）は 写真（しゃしん）を 撮（と）ることです。週末（しゅうまつ）は よく 公園（こうえん）へ 行（い）きます。先週（せんしゅう）、友達（ともだち）に カメラを 貸（か）しました。そして、妹（いもうと）に きれいな 花（はな）を あげました。母（はは）から 本（ほん）を もらいました。その 本（ほん）は 日本（にほん）の 写真（しゃしん）の 本（ほん）です。今度（こんど）、友達（ともだち）と 一緒（いっしょ）に 山（やま）へ 行（い）きたいです。",
    storyEn:
      "My hobby is taking photographs. On weekends I often go to the park. Last week I lent my camera to a friend. And I gave my younger sister some pretty flowers. I received a book from my mother. That book is a book of photographs of Japan. Next time I want to go to the mountains with a friend.",
  },
  {
    title: "Taking Care of My Health",
    storyJp:
      "昨日（きのう）は 体調（たいちょう）が 悪（わる）かったです。朝（あさ）から 頭（あたま）が 痛（いた）くて、熱（ねつ）も ありました。それで、病院（びょういん）へ 行（い）きました。医者（いしゃ）は 私（わたし）の 話（はなし）を 聞（き）いて、薬（くすり）を くれました。薬（くすり）を 飲（の）んで、家（いえ）で ゆっくり 寝（ね）ました。今日（きょう）は もう 元気（げんき）です。でも、まだ 咳（せき）が 少（すこ）し 出（で）ます。",
    storyEn:
      "Yesterday I felt unwell. Since the morning my head hurt and I also had a fever. So I went to the hospital. The doctor listened to me and gave me some medicine. I took the medicine and slept peacefully at home. Today I am already well. But I still cough a little.",
  },
  {
    title: "Around My House",
    storyJp:
      "私（わたし）の 家（いえ）は 小（ちい）さいですが、静（しず）かです。一階（いっかい）に 台所（だいどころ）と リビングが あります。リビングに テレビと ソファが あります。二階（にかい）に 私（わたし）の 部屋（へや）が あります。部屋（へや）の 中（なか）に 机（つくえ）と 本棚（ほんだな）が あります。机（つくえ）の 上（うえ）に パソコンが あります。毎晩（まいばん）、部屋（へや）で 音楽（おんがく）を 聞（き）きます。",
    storyEn:
      "My house is small but quiet. On the first floor there is a kitchen and a living room. In the living room there is a television and a sofa. On the second floor there is my room. In my room there is a desk and a bookshelf. On the desk there is a computer. Every evening I listen to music in my room.",
  },
  {
    title: "A Busy Day at Work",
    storyJp:
      "今朝（けさ）、私（わたし）は 会社（かいしゃ）に 遅刻（ちこく）しました。電車（でんしゃ）が 止（と）まっていたからです。だから、今日（きょう）は 残業（ざんぎょう）を しなければなりません。午後（ごご）の 会議（かいぎ）は 三時（さんじ）に 始（はじ）まります。会議（かいぎ）の 後（あと）で、コピー機（き）が 故障（こしょう）しました。それで、課長（かちょう）に 報告（ほうこく）しました。明日（あした）は 早（はや）く 会社（かいしゃ）へ 行（い）く つもりです。",
    storyEn:
      "This morning I was late for work. It was because the train had stopped. So today I have to work overtime. The afternoon meeting starts at three. After the meeting the copier broke down. So I reported it to the section chief. Tomorrow I intend to go to the office early.",
  },
  {
    title: "Looking Back and Moving Forward",
    storyJp:
      "今年（ことし）の 春（はる）、私（わたし）は 日本（にほん）へ 来（き）ました。最初（さいしょ）は 日本語（にほんご）が あまり 分（わ）かりませんでした。でも、毎日（まいにち） 勉（べん）強（きょう）して、少（すこ）しずつ 話（はな）せる ように なりました。もし 時間（じかん）が あれば、週末（しゅうまつ）は 友達（ともだち）と 旅行（りょこう）に 行（い）きます。先月（せんげつ）は 京都（きょうと）へ 行（い）って、古（ふる）い お寺（てら）を 見（み）ました。来年（らいねん）は 日本（にほん）で 仕事（しごと）を したいです。その ために、もっと 漢字（かんじ）を 覚（おぼ）えなければなりません。",
    storyEn:
      "This spring I came to Japan. At first I did not understand Japanese very well. But I studied every day and gradually became able to speak. If I have time, I go on trips with friends on weekends. Last month I went to Kyoto and saw old temples. Next year I want to work in Japan. For that I have to learn more kanji.",
  },
];

