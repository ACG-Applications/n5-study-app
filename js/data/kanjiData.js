// ==================== KANJI DATA ====================
// Complete kanji list extracted from all app data (sentences, adjectives, adverbs, grammar, verbs, practice test, stories, videos)
// Total kanji: Complete N5-N4 + all kanji appearing in study materials

const kanjiData = [
    // ========== N5 CORE KANJI (1-80) ==========
    { id: "nichi", kanji: "日", onyomi: "ニチ、ジツ", kunyomi: "ひ、-び、-か", meaning: "day, sun, Japan", examples: [{ sentence: "今日（きょう） は いい 天気（てんき） です", reading: "きょう は いい てんき です", english: "Today is nice weather" }, { sentence: "毎日（まいにち） コーヒー を 飲（の）みます", reading: "まいにち こーひー を のみます", english: "I drink coffee every day" }] },
    { id: "ichi", kanji: "一", onyomi: "イチ", kunyomi: "ひと（つ）", meaning: "one", examples: [{ sentence: "一人（ひとり） で 映画（えいが） を 見（み）ました", reading: "ひとり で えいが を みました", english: "I watched a movie alone" }, { sentence: "一番（いちばん） 好（す）きな 料理（りょうり） は 寿司（すし） です", reading: "いちばん すきな りょうり は すし です", english: "My favorite food is sushi" }] },
    { id: "kuni", kanji: "国", onyomi: "コク", kunyomi: "くに", meaning: "country", examples: [{ sentence: "日本（にほん） は 美（うつく）しい 国（くに） です", reading: "にほん は うつくしい くに です", english: "Japan is a beautiful country" }, { sentence: "外国（がいこく） の 本（ほん） を 読（よ）みました", reading: "がいこく の ほん を よみました", english: "I read a foreign book" }] },
    { id: "hito", kanji: "人", onyomi: "ジン、ニン", kunyomi: "ひと", meaning: "person", examples: [{ sentence: "あの 人（ひと） は 誰（だれ） です か", reading: "あの ひと は だれ です か", english: "Who is that person?" }, { sentence: "日本人（にほんじん） です か", reading: "にほんじん です か", english: "Are you Japanese?" }] },
    { id: "toshi", kanji: "年", onyomi: "ネン", kunyomi: "とし", meaning: "year", examples: [{ sentence: "来年（らいねん） 日本（にほん） へ 行（い）きます", reading: "らいねん にほん へ いきます", english: "I will go to Japan next year" }, { sentence: "今年（ことし） は 何歳（なんさい） です か", reading: "ことし は なんさい です か", english: "How old are you this year?" }] },
    { id: "oo", kanji: "大", onyomi: "ダイ、タイ", kunyomi: "おお（きい）", meaning: "large, big", examples: [{ sentence: "大（おお）きい 犬（いぬ） が います", reading: "おおきい いぬ が います", english: "There is a big dog" }, { sentence: "大変（たいへん） でした", reading: "たいへん でした", english: "It was tough" }] },
    { id: "juu", kanji: "十", onyomi: "ジュウ", kunyomi: "とお", meaning: "ten", examples: [{ sentence: "十人（じゅうにん） います", reading: "じゅうにん います", english: "There are ten people" }, { sentence: "十月（じゅうがつ） に 誕生日（たんじょうび） です", reading: "じゅうがつ に たんじょうび です", english: "My birthday is in October" }] },
    { id: "ni", kanji: "二", onyomi: "ニ", kunyomi: "ふた（つ）", meaning: "two", examples: [{ sentence: "二人（ふたり） で 行（い）きました", reading: "ふたり で いきました", english: "Two people went" }, { sentence: "二階（にかい） に 上（あ）がります", reading: "にかい に あがります", english: "I go up to the second floor" }] },
    { id: "hon", kanji: "本", onyomi: "ホン", kunyomi: "もと", meaning: "book, origin, counter for long objects", examples: [{ sentence: "本（ほん） を 読（よ）みます", reading: "ほん を よみます", english: "I read a book" }, { sentence: "日本（にほん） から 来（き）ました", reading: "にほん から きました", english: "I came from Japan" }] },
    { id: "naka", kanji: "中", onyomi: "チュウ", kunyomi: "なか", meaning: "in, inside, middle", examples: [{ sentence: "箱（はこ） の 中（なか） に あります", reading: "はこ の なか に あります", english: "It's inside the box" }, { sentence: "中国（ちゅうごく） から 来（き）ました", reading: "ちゅうごく から きました", english: "I came from China" }] },
    { id: "nagai", kanji: "長", onyomi: "チョウ", kunyomi: "なが（い）", meaning: "long, leader", examples: [{ sentence: "長（なが）い 時間（じかん） 待（ま）ちました", reading: "ながい じかん まちました", english: "I waited for a long time" }, { sentence: "部長（ぶちょう） は 親切（しんせつ） です", reading: "ぶちょう は しんせつ です", english: "The department manager is kind" }] },
    { id: "deru", kanji: "出", onyomi: "シュツ", kunyomi: "で（る）、だ（す）", meaning: "exit, leave, go out", examples: [{ sentence: "駅（えき） を 出（で）ました", reading: "えき を でました", english: "I left the station" }, { sentence: "宿題（しゅくだい） を 出（だ）しました", reading: "しゅくだい を だしました", english: "I submitted my homework" }] },
    { id: "san", kanji: "三", onyomi: "サン", kunyomi: "み（っつ）", meaning: "three", examples: [{ sentence: "三時（さんじ） に 会（あ）いましょう", reading: "さんじ に あいましょう", english: "Let's meet at 3 o'clock" }, { sentence: "三日間（みっかかん） 旅行（りょこう） しました", reading: "みっかかん りょこう しました", english: "I traveled for three days" }] },
    { id: "toki", kanji: "時", onyomi: "ジ", kunyomi: "とき", meaning: "time, hour", examples: [{ sentence: "今（いま） 何時（なんじ） です か", reading: "いま なんじ です か", english: "What time is it now?" }, { sentence: "時々（ときどき） 映画（えいが） を 見（み）ます", reading: "ときどき えいが を みます", english: "I sometimes watch movies" }] },
    { id: "iku", kanji: "行", onyomi: "コウ、ギョウ", kunyomi: "い（く）、おこな（う）", meaning: "go, conduct", examples: [{ sentence: "学校（がっこう） へ 行（い）きます", reading: "がっこう へ いきます", english: "I go to school" }, { sentence: "旅行（りょこう） が 好（す）き です", reading: "りょこう が すき です", english: "I like traveling" }] },
    { id: "miru", kanji: "見", onyomi: "ケン", kunyomi: "み（る）", meaning: "see, watch", examples: [{ sentence: "テレビ を 見（み）ます", reading: "てれび を みます", english: "I watch TV" }, { sentence: "見（み）て ください", reading: "みて ください", english: "Please look" }] },
    { id: "tsuki", kanji: "月", onyomi: "ゲツ、ガツ", kunyomi: "つき", meaning: "month, moon", examples: [{ sentence: "来月（らいげつ） 帰（かえ）ります", reading: "らいげつ かえります", english: "I will return next month" }, { sentence: "月曜日（げつようび） に 会（あ）いましょう", reading: "げつようび に あいましょう", english: "Let's meet on Monday" }] },
    { id: "fun", kanji: "分", onyomi: "ブン、フン", kunyomi: "わ（ける）", meaning: "minute, part, understand", examples: [{ sentence: "十分（じゅっぷん） 待（ま）ちました", reading: "じゅっぷん まちました", english: "I waited for 10 minutes" }, { sentence: "日本語（にほんご） が 分（わ）かります", reading: "にほんご が わかります", english: "I understand Japanese" }] },
    { id: "ato", kanji: "後", onyomi: "ゴ、コウ", kunyomi: "あと、うし（ろ）", meaning: "after, behind, later", examples: [{ sentence: "食（た）べた 後（あと） に 薬（くすり） を 飲（の）みます", reading: "たべた あと に くすり を のみます", english: "I take medicine after eating" }, { sentence: "後（うし）ろ に 立（た）って ください", reading: "うしろ に たって ください", english: "Please stand behind" }] },
    { id: "mae", kanji: "前", onyomi: "ゼン", kunyomi: "まえ", meaning: "in front, before", examples: [{ sentence: "食（た）べる 前（まえ） に 手（て） を 洗（あら）います", reading: "たべる まえ に て を あらいます", english: "I wash my hands before eating" }, { sentence: "店（みせ） の 前（まえ） で 待（ま）ちましょう", reading: "みせ の まえ で まちましょう", english: "Let's wait in front of the shop" }] },
    { id: "sei", kanji: "生", onyomi: "セイ、ショウ", kunyomi: "い（きる）、う（まれる）、なま", meaning: "life, genuine, birth", examples: [{ sentence: "誕生日（たんじょうび） おめでとう", reading: "たんじょうび おめでとう", english: "Happy birthday" }, { sentence: "生（なま） の 魚（さかな） は 好（す）きじゃありません", reading: "なま の さかな は すきじゃありません", english: "I don't like raw fish" }] },
    { id: "go", kanji: "五", onyomi: "ゴ", kunyomi: "いつ（つ）", meaning: "five", examples: [{ sentence: "五時（ごじ） に 起（お）きます", reading: "ごじ に おきます", english: "I wake up at 5 o'clock" }, { sentence: "五個（ごこ） 買（か）いました", reading: "ごこ かいました", english: "I bought five items" }] },
    { id: "aida", kanji: "間", onyomi: "カン、ケン", kunyomi: "あいだ、ま", meaning: "interval, space, between", examples: [{ sentence: "一時間（いちじかん） 勉強（べんきょう） しました", reading: "いちじかん べんきょう しました", english: "I studied for one hour" }, { sentence: "休み時間（やすみじかん） に 話（はな）しましょう", reading: "やすみじかん に はなしましょう", english: "Let's talk during break time" }] },
    { id: "ue", kanji: "上", onyomi: "ジョウ", kunyomi: "うえ、あ（げる）、のぼ（る）", meaning: "above, up, top", examples: [{ sentence: "机（つくえ） の 上（うえ） に 本（ほん） が あります", reading: "つくえ の うえ に ほん が あります", english: "There is a book on the desk" }, { sentence: "東京（とうきょう） に 上（のぼ）ります", reading: "とうきょう に のぼります", english: "I go up to Tokyo" }] },
    { id: "higashi", kanji: "東", onyomi: "トウ", kunyomi: "ひがし", meaning: "east", examples: [{ sentence: "東（ひがし） の 方（ほう） へ 行（い）きます", reading: "ひがし の ほう へ いきます", english: "I go toward the east" }, { sentence: "東京（とうきょう） は 東日本（ひがしにほん） に あります", reading: "とうきょう は ひがしにほん に あります", english: "Tokyo is in eastern Japan" }] },
    { id: "yon", kanji: "四", onyomi: "シ", kunyomi: "よん、よ（っつ）", meaning: "four", examples: [{ sentence: "四人（よにん） で 行（い）きます", reading: "よにん で いきます", english: "Four people go" }, { sentence: "四月（しがつ） に 日本（にほん） へ 行（い）きます", reading: "しがつ に にほん へ いきます", english: "I go to Japan in April" }] },
    { id: "ima", kanji: "今", onyomi: "コン、キン", kunyomi: "いま", meaning: "now", examples: [{ sentence: "今（いま） 何時（なんじ） です か", reading: "いま なんじ です か", english: "What time is it now?" }, { sentence: "今日（きょう） は 忙（いそが）しい です", reading: "きょう は いそがしい です", english: "I'm busy today" }] },
    { id: "kane", kanji: "金", onyomi: "キン、コン", kunyomi: "かね", meaning: "gold, money", examples: [{ sentence: "お金（かね） が ありません", reading: "おかね が ありません", english: "I have no money" }, { sentence: "金曜日（きんようび） に 会（あ）いましょう", reading: "きんようび に あいましょう", english: "Let's meet on Friday" }] },
    { id: "kyuu", kanji: "九", onyomi: "キュウ、ク", kunyomi: "ここの（つ）", meaning: "nine", examples: [{ sentence: "九時（くじ） に 寝（ね）ます", reading: "くじ に ねます", english: "I sleep at 9 o'clock" }, { sentence: "九人（きゅうにん） います", reading: "きゅうにん います", english: "There are nine people" }] },
    { id: "hairu", kanji: "入", onyomi: "ニュウ", kunyomi: "はい（る）、い（る）", meaning: "enter, insert", examples: [{ sentence: "部屋（へや） に 入（はい）ります", reading: "へや に はいります", english: "I enter the room" }, { sentence: "お金（かね） を 入（い）れて ください", reading: "おかね を いれて ください", english: "Please insert the money" }] },
    { id: "manabu", kanji: "学", onyomi: "ガク", kunyomi: "まな（ぶ）", meaning: "study, learning", examples: [{ sentence: "大学（だいがく） で 勉強（べんきょう） します", reading: "だいがく で べんきょう します", english: "I study at university" }, { sentence: "日本語（にほんご） を 学（まな）びたい です", reading: "にほんご を まなびたい です", english: "I want to learn Japanese" }] },
    { id: "takai", kanji: "高", onyomi: "コウ", kunyomi: "たか（い）", meaning: "tall, high, expensive", examples: [{ sentence: "山（やま） が 高（たか）い です", reading: "やま が たかい です", english: "The mountain is high" }, { sentence: "値段（ねだん） が 高（たか）い です", reading: "ねだん が たかい です", english: "The price is high/expensive" }] },
    { id: "en", kanji: "円", onyomi: "エン", kunyomi: "まる（い）", meaning: "circle, yen", examples: [{ sentence: "百円（ひゃくえん） です", reading: "ひゃくえん です", english: "It's 100 yen" }, { sentence: "円（まる）い テーブル が あります", reading: "まるい てーぶる が あります", english: "There is a round table" }] },
    { id: "ko", kanji: "子", onyomi: "シ、ス", kunyomi: "こ", meaning: "child", examples: [{ sentence: "子供（こども） が 公園（こうえん） で 遊（あそ）んでいます", reading: "こども が こうえん で あそんでいます", english: "Children are playing in the park" }, { sentence: "子犬（こいぬ） が 好（す）き です", reading: "こいぬ が すき です", english: "I like puppies" }] },
    { id: "soto", kanji: "外", onyomi: "ガイ、ゲ", kunyomi: "そと、はず（す）", meaning: "outside", examples: [{ sentence: "外（そと） は 雨（あめ） です", reading: "そと は あめ です", english: "It's raining outside" }, { sentence: "外国人（がいこくじん） です", reading: "がいこくじん です", english: "I'm a foreigner" }] },
    { id: "hachi", kanji: "八", onyomi: "ハチ", kunyomi: "や（っつ）", meaning: "eight", examples: [{ sentence: "八時（はちじ） に 起（お）きます", reading: "はちじ に おきます", english: "I wake up at 8 o'clock" }, { sentence: "八人（はちにん） います", reading: "はちにん います", english: "There are eight people" }] },
    { id: "roku", kanji: "六", onyomi: "ロク", kunyomi: "む（っつ）", meaning: "six", examples: [{ sentence: "六時（ろくじ） に 起（お）きます", reading: "ろくじ に おきます", english: "I wake up at 6 o'clock" }, { sentence: "六日間（むいかかん） 旅行（りょこう） しました", reading: "むいかかん りょこう しました", english: "I traveled for six days" }] },
    { id: "shita", kanji: "下", onyomi: "カ、ゲ", kunyomi: "した、くだ（る）、さ（げる）", meaning: "below, down, descend", examples: [{ sentence: "机（つくえ） の 下（した） に あります", reading: "つくえ の した に あります", english: "It's under the desk" }, { sentence: "電車（でんしゃ） を 下（お）ります", reading: "でんしゃ を おります", english: "I get off the train" }] },
    { id: "kuru", kanji: "来", onyomi: "ライ", kunyomi: "く（る）、き（たす）", meaning: "come, next, cause", examples: [{ sentence: "日本（にほん） に 来（き）ました", reading: "にほん に きました", english: "I came to Japan" }, { sentence: "来週（らいしゅう） 帰（かえ）ります", reading: "らいしゅう かえります", english: "I'll return next week" }] },
    { id: "ki", kanji: "気", onyomi: "キ", kunyomi: "いき", meaning: "spirit, mind, air, mood", examples: [{ sentence: "元気（げんき） です か", reading: "げんき です か", english: "How are you?" }, { sentence: "気分（きぶん） が 悪（わる）い です", reading: "きぶん が わるい です", english: "I feel sick" }] },
    { id: "chii", kanji: "小", onyomi: "ショウ", kunyomi: "ちい（さい）、こ", meaning: "small, little", examples: [{ sentence: "小（ちい）さい 犬（いぬ） を 見（み）ました", reading: "ちいさい いぬ を みました", english: "I saw a small dog" }, { sentence: "小学生（しょうがくせい） です", reading: "しょうがくせい です", english: "I'm an elementary school student" }] },
    { id: "shichi", kanji: "七", onyomi: "シチ", kunyomi: "なな（つ）、なの", meaning: "seven", examples: [{ sentence: "七時（しちじ） に 起（お）きます", reading: "しちじ に おきます", english: "I wake up at 7 o'clock" }, { sentence: "七日（なのか）間（かん） 旅行（りょこう） しました", reading: "なのかかん りょこう しました", english: "I traveled for seven days" }] },
    { id: "yama", kanji: "山", onyomi: "サン", kunyomi: "やま", meaning: "mountain", examples: [{ sentence: "富士山（ふじさん） に 登（のぼ）りました", reading: "ふじさん に のぼりました", english: "I climbed Mount Fuji" }, { sentence: "山（やま） が 高（たか）い です", reading: "やま が たかい です", english: "The mountain is high" }] },
    { id: "hanashi", kanji: "話", onyomi: "ワ", kunyomi: "はな（す）、はなし", meaning: "tale, talk, story", examples: [{ sentence: "日本語（にほんご） を 話（はな）します", reading: "にほんご を はなします", english: "I speak Japanese" }, { sentence: "面白（おもしろ）い 話（はなし） を 聞（き）きました", reading: "おもしろい はなし を ききました", english: "I heard an interesting story" }] },
    { id: "onna", kanji: "女", onyomi: "ジョ", kunyomi: "おんな、め", meaning: "woman, female", examples: [{ sentence: "女（おんな） の 人（ひと） が います", reading: "おんな の ひと が います", english: "There is a woman" }, { sentence: "彼女（かのじょ） は 優（やさ）しい です", reading: "かのじょ は やさしい です", english: "She is kind" }] },
    { id: "kita", kanji: "北", onyomi: "ホク", kunyomi: "きた", meaning: "north", examples: [{ sentence: "北（きた） の 方（ほう） へ 行（い）きます", reading: "きた の ほう へ いきます", english: "I go toward the north" }, { sentence: "北海道（ほっかいどう） に 行（い）きました", reading: "ほっかいどう に いきました", english: "I went to Hokkaido" }] },
    { id: "uma", kanji: "午", onyomi: "ゴ", kunyomi: "うま", meaning: "noon, sign of the horse", examples: [{ sentence: "午前（ごぜん） に 勉強（べんきょう） します", reading: "ごぜん に べんきょう します", english: "I study in the morning" }, { sentence: "午後（ごご） 映画（えいが） を 見（み）ます", reading: "ごご えいが を みます", english: "I watch a movie in the afternoon" }] },
    { id: "hyaku", kanji: "百", onyomi: "ヒャク", kunyomi: "もも", meaning: "hundred", examples: [{ sentence: "百円（ひゃくえん） です", reading: "ひゃくえん です", english: "It's 100 yen" }, { sentence: "三百（さんびゃく） メートル 歩（ある）きました", reading: "さんびゃく めーとる あるきました", english: "I walked 300 meters" }] },
    { id: "kaku", kanji: "書", onyomi: "ショ", kunyomi: "か（く）", meaning: "write", examples: [{ sentence: "手紙（てがみ） を 書（か）きます", reading: "てがみ を かきます", english: "I write a letter" }, { sentence: "図書館（としょかん） で 勉強（べんきょう） します", reading: "としょかん で べんきょう します", english: "I study at the library" }] },
    { id: "saki", kanji: "先", onyomi: "セン", kunyomi: "さき、ま（ず）", meaning: "before, ahead, previous", examples: [{ sentence: "先週（せんしゅう） 友達（ともだち） に 会（あ）いました", reading: "せんしゅう ともだち に あいました", english: "I met my friend last week" }, { sentence: "先（さき） に 行（い）って ください", reading: "さき に いって ください", english: "Please go ahead" }] },
    { id: "na", kanji: "名", onyomi: "メイ、ミョウ", kunyomi: "な", meaning: "name, noted, distinguished", examples: [{ sentence: "名前（なまえ） は 何（なん） です か", reading: "なまえ は なん です か", english: "What is your name?" }, { sentence: "有名（ゆうめい）な レストラン です", reading: "ゆうめいな れすとらん です", english: "It's a famous restaurant" }] },
    { id: "kawa", kanji: "川", onyomi: "セン", kunyomi: "かわ", meaning: "river", examples: [{ sentence: "川（かわ） で 泳（およ）ぎました", reading: "かわ で およぎました", english: "I swam in the river" }, { sentence: "子供（こども） の 頃（ころ） よく 川（かわ） で 泳（およ）ぎました", reading: "こども の ころ よく かわ で およぎました", english: "When I was a child, I often swam in the river" }] },
    { id: "sen", kanji: "千", onyomi: "セン", kunyomi: "ち", meaning: "thousand", examples: [{ sentence: "千円（せんえん） ください", reading: "せんえん ください", english: "Please give me 1000 yen" }, { sentence: "二千（にせん） メートル です", reading: "にせん めーとる です", english: "It's 2000 meters" }] },
    { id: "kiku", kanji: "聞", onyomi: "ブン、モン", kunyomi: "き（く）", meaning: "to hear, to listen, to ask", examples: [{ sentence: "音楽（おんがく） を 聞（き）きます", reading: "おんがく を ききます", english: "I listen to music" }, { sentence: "先生（せんせい） に 聞（き）きました", reading: "せんせい に ききました", english: "I asked the teacher" }] },
    { id: "mizu", kanji: "水", onyomi: "スイ", kunyomi: "みず", meaning: "water", examples: [{ sentence: "水（みず） を 飲（の）みます", reading: "みず を のみます", english: "I drink water" }, { sentence: "水曜日（すいようび） に 会（あ）いましょう", reading: "すいようび に あいましょう", english: "Let's meet on Wednesday" }] },
    { id: "han", kanji: "半", onyomi: "ハン", kunyomi: "なか（ば）", meaning: "half, middle", examples: [{ sentence: "半分（はんぶん） ください", reading: "はんぶん ください", english: "Please give me half" }, { sentence: "一時間半（いちじかんはん） 待（ま）ちました", reading: "いちじかんはん まちました", english: "I waited for one and a half hours" }] },
    { id: "otoko", kanji: "男", onyomi: "ダン、ナン", kunyomi: "おとこ", meaning: "male, man", examples: [{ sentence: "男（おとこ） の 人（ひと） です", reading: "おとこ の ひと です", english: "He is a man" }, { sentence: "彼（かれ） は 元気（げんき） です", reading: "かれ は げんき です", english: "He is healthy" }] },
    { id: "nishi", kanji: "西", onyomi: "セイ、サイ", kunyomi: "にし", meaning: "west", examples: [{ sentence: "西（にし） の 方（ほう） へ 行（い）きました", reading: "にし の ほう へ いきました", english: "I went toward the west" }, { sentence: "大阪（おおさか） は 西日本（にしにほん） に あります", reading: "おおさか は にしにほん に あります", english: "Osaka is in western Japan" }] },
    { id: "den", kanji: "電", onyomi: "デン", kunyomi: null, meaning: "electricity", examples: [{ sentence: "電車（でんしゃ） に 乗（の）ります", reading: "でんしゃ に のります", english: "I take the train" }, { sentence: "電気（でんき） を つけます", reading: "でんき を つけます", english: "I turn on the light" }] },
    { id: "go_kanji", kanji: "語", onyomi: "ゴ", kunyomi: "かた（る）", meaning: "word, speech, language", examples: [{ sentence: "日本語（にほんご） を 勉強（べんきょう） します", reading: "にほんご を べんきょう します", english: "I study Japanese" }, { sentence: "英語（えいご） が 話（はな）せます", reading: "えいご が はなせます", english: "I can speak English" }] },
    { id: "tsuchi", kanji: "土", onyomi: "ド、ト", kunyomi: "つち", meaning: "soil, earth, ground", examples: [{ sentence: "土曜日（どようび） に 遊（あそ）びます", reading: "どようび に あそびます", english: "I play on Saturday" }, { sentence: "土（つち） の 上（うえ） に 座（すわ）ります", reading: "つち の うえ に すわります", english: "I sit on the ground" }] },
    { id: "ki_tree", kanji: "木", onyomi: "ボク、モク", kunyomi: "き、こ", meaning: "tree, wood", examples: [{ sentence: "木（き） が たくさん あります", reading: "き が たくさん あります", english: "There are many trees" }, { sentence: "木曜日（もくようび） に 試験（しけん） が あります", reading: "もくようび に しけん が あります", english: "There is an exam on Thursday" }] },
    { id: "taberu", kanji: "食", onyomi: "ショク、ジキ", kunyomi: "た（べる）、く（う）", meaning: "eat, food", examples: [{ sentence: "ご飯（はん） を 食（た）べます", reading: "ごはん を たべます", english: "I eat rice/meal" }, { sentence: "食べ物（たべもの） が 好（す）き です", reading: "たべもの が すき です", english: "I like food" }] },
    { id: "kuruma", kanji: "車", onyomi: "シャ", kunyomi: "くるま", meaning: "car, wheel", examples: [{ sentence: "車（くるま） で 行（い）きます", reading: "くるま で いきます", english: "I go by car" }, { sentence: "彼女（かのじょ） は 赤（あか）い 車（くるま） を 持（も）っています", reading: "かのじょ は あかい くるま を もっています", english: "She has a red car" }] },
    { id: "nani", kanji: "何", onyomi: "カ", kunyomi: "なに、なん", meaning: "what", examples: [{ sentence: "何（なに） を 食（た）べます か", reading: "なに を たべます か", english: "What will you eat?" }, { sentence: "何時（なんじ） です か", reading: "なんじ です か", english: "What time is it?" }] },
    { id: "minami", kanji: "南", onyomi: "ナン", kunyomi: "みなみ", meaning: "south", examples: [{ sentence: "南（みなみ） の 方（ほう） へ 行（い）きます", reading: "みなみ の ほう へ いきます", english: "I go toward the south" }, { sentence: "南国（なんごく） の 果物（くだもの） が 好（す）き です", reading: "なんごく の くだもの が すき です", english: "I like southern fruits" }] },
    { id: "man", kanji: "万", onyomi: "マン、バン", kunyomi: null, meaning: "ten thousand", examples: [{ sentence: "一万円（いちまんえん） です", reading: "いちまんえん です", english: "It's 10,000 yen" }, { sentence: "十万（じゅうまん） 人（にん） が います", reading: "じゅうまん にん が います", english: "There are 100,000 people" }] },
    { id: "kou", kanji: "校", onyomi: "コウ", kunyomi: null, meaning: "school", examples: [{ sentence: "学校（がっこう） に 行（い）きます", reading: "がっこう に いきます", english: "I go to school" }, { sentence: "高校（こうこう） の 時（とき） に 勉強（べんきょう） しました", reading: "こうこう の とき に べんきょう しました", english: "I studied in high school" }] },
    { id: "mai", kanji: "毎", onyomi: "マイ", kunyomi: "ごと", meaning: "every", examples: [{ sentence: "毎日（まいにち） 勉強（べんきょう） します", reading: "まいにち べんきょう します", english: "I study every day" }, { sentence: "毎週（まいしゅう） 映画（えいが） を 見（み）ます", reading: "まいしゅう えいが を みます", english: "I watch a movie every week" }] },
    { id: "shiro", kanji: "白", onyomi: "ハク、ビャク", kunyomi: "しろ（い）", meaning: "white", examples: [{ sentence: "白（しろ）い 車（くるま） を 持（も）っています", reading: "しろい くるま を もっています", english: "I have a white car" }, { sentence: "白雪（しらゆき） が 降（ふ）りました", reading: "しらゆき が ふりました", english: "White snow fell" }] },
    { id: "ten", kanji: "天", onyomi: "テン", kunyomi: "あまつ", meaning: "heavens, sky", examples: [{ sentence: "天気（てんき） が いい です ね", reading: "てんき が いい です ね", english: "The weather is nice" }, { sentence: "天国（てんごく） の ような 場所（ばしょ） です", reading: "てんごく の ような ばしょ です", english: "It's a heaven-like place" }] },
    { id: "haha", kanji: "母", onyomi: "ボ", kunyomi: "はは", meaning: "mother", examples: [{ sentence: "母（はは） は 医者（いしゃ） です", reading: "はは は いしゃ です", english: "My mother is a doctor" }, { sentence: "お母（かあ）さん、ありがとう", reading: "おかあさん、ありがとう", english: "Thank you, Mom" }] },
    { id: "hi", kanji: "火", onyomi: "カ", kunyomi: "ひ、ほ", meaning: "fire", examples: [{ sentence: "火曜日（かようび） に 会（あ）いましょう", reading: "かようび に あいましょう", english: "Let's meet on Tuesday" }, { sentence: "火（ひ） を つけて ください", reading: "ひ を つけて ください", english: "Please light the fire" }] },
    { id: "migi", kanji: "右", onyomi: "ウ、ユウ", kunyomi: "みぎ", meaning: "right (direction)", examples: [{ sentence: "右（みぎ） に 曲（ま）がって ください", reading: "みぎ に まがって ください", english: "Please turn right" }, { sentence: "右手（みぎて） で 書（か）きます", reading: "みぎて で かきます", english: "I write with my right hand" }] },
    { id: "yomu", kanji: "読", onyomi: "ドク、トク", kunyomi: "よ（む）", meaning: "to read", examples: [{ sentence: "本（ほん） を 読（よ）みます", reading: "ほん を よみます", english: "I read a book" }, { sentence: "新聞（しんぶん） を 読（よ）んでいます", reading: "しんぶん を よんでいます", english: "I am reading a newspaper" }] },
    { id: "tomo", kanji: "友", onyomi: "ユウ", kunyomi: "とも", meaning: "friend", examples: [{ sentence: "友達（ともだち） と 遊（あそ）びます", reading: "ともだち と あそびます", english: "I play with my friend" }, { sentence: "親友（しんゆう） に 会（あ）いました", reading: "しんゆう に あいました", english: "I met my best friend" }] },
    { id: "hidari", kanji: "左", onyomi: "サ、シャ", kunyomi: "ひだり", meaning: "left (direction)", examples: [{ sentence: "左（ひだり） に 曲（ま）がって ください", reading: "ひだり に まがって ください", english: "Please turn left" }, { sentence: "左手（ひだりて） に 時計（とけい） を しています", reading: "ひだりて に どけい を しています", english: "I wear a watch on my left hand" }] },
    { id: "yasumu", kanji: "休", onyomi: "キュウ", kunyomi: "やす（む）", meaning: "rest, day off", examples: [{ sentence: "日曜日（にちようび） は 休（やす）みます", reading: "にちようび は やすみます", english: "I rest on Sunday" }, { sentence: "夏休（なつやす）み に 旅行（りょこう） します", reading: "なつやすみ に りょこう します", english: "I travel during summer vacation" }] },
    { id: "chichi", kanji: "父", onyomi: "フ", kunyomi: "ちち", meaning: "father", examples: [{ sentence: "父（ちち） は 会社員（かいしゃいん） です", reading: "ちち は かいしゃいん です", english: "My father is a company employee" }, { sentence: "お父（とう）さん、お元気（げんき） です か", reading: "おとうさん、おげんき です か", english: "How are you, Dad?" }] },
    { id: "ame", kanji: "雨", onyomi: "ウ", kunyomi: "あめ、あま", meaning: "rain", examples: [{ sentence: "雨（あめ） が 降（ふ）っています", reading: "あめ が ふっています", english: "It is raining" }, { sentence: "雨（あめ） の 日（ひ） は 家（いえ） で 過（す）ごします", reading: "あめ の ひ は いえ で すごします", english: "I spend rainy days at home" }] },

    // ========== ADDITIONAL KANJI FROM APP DATA ==========
    { id: "asa", kanji: "朝", onyomi: "チョウ", kunyomi: "あさ", meaning: "morning", examples: [{ sentence: "毎朝（まいあさ） 六時（ろくじ） に 起（お）きます", reading: "まいあさ ろくじ に おきます", english: "Every morning I wake up at 6 o'clock" }, { sentence: "朝（あさ）ごはん を 食（た）べて から 歯（は） を 磨（みが）きます", reading: "あさごはん を たべて から は を みがきます", english: "After eating breakfast, I brush my teeth" }] },
    { id: "yoru", kanji: "夜", onyomi: "ヤ", kunyomi: "よる、よ", meaning: "night, evening", examples: [{ sentence: "夜（よる） 十時（じゅうじ） に 寝（ね）ます", reading: "よる じゅうじ に ねます", english: "I go to bed at 10 PM" }, { sentence: "夜（よる） 遅（おそ）く まで 勉強（べんきょう） しました", reading: "よる おそく まで べんきょう しました", english: "I studied late at night" }] },
    { id: "ne", kanji: "寝", onyomi: "シン", kunyomi: "ね（る）", meaning: "sleep, go to bed", examples: [{ sentence: "夜（よる） 十時（じゅうじ） に 寝（ね）ます", reading: "よる じゅうじ に ねます", english: "I go to bed at 10 PM" }, { sentence: "赤（あか）ちゃん は 今（いま） 寝（ね）ています", reading: "あかちゃん は いま ねています", english: "The baby is sleeping now" }] },
    { id: "oku", kanji: "起", onyomi: "キ", kunyomi: "お（きる）", meaning: "wake up, get up", examples: [{ sentence: "毎朝（まいあさ） 六時（ろくじ） に 起（お）きます", reading: "まいあさ ろくじ に おきます", english: "Every morning I wake up at 6 o'clock" }, { sentence: "朝（あさ） 早（はや）く 起（お）きました", reading: "あさ はやく おきました", english: "I woke up early in the morning" }] },
    { id: "ha", kanji: "歯", onyomi: "シ", kunyomi: "は", meaning: "tooth", examples: [{ sentence: "歯（は） を 磨（みが）きます", reading: "は を みがきます", english: "I brush my teeth" }, { sentence: "歯（は） が 痛（いた）い ので 歯医者（はいしゃ） に 行（い）きます", reading: "は が いたい ので はいしゃ に いきます", english: "I have a toothache, so I'll go to the dentist" }] },
    { id: "migaku", kanji: "磨", onyomi: "マ", kunyomi: "みが（く）", meaning: "brush, polish", examples: [{ sentence: "歯（は） を 磨（みが）きます", reading: "は を みがきます", english: "I brush my teeth" }, { sentence: "毎朝（まいあさ） 歯（は） を 磨（みが）きます", reading: "まいあさ は を みがきます", english: "I brush my teeth every morning" }] },
    { id: "kaisha", kanji: "会", onyomi: "カイ、エ", kunyomi: "あ（う）", meaning: "meet, company", examples: [{ sentence: "会社（かいしゃ） へ 八時（はちじ） に 行（い）きます", reading: "かいしゃ へ はちじ に いきます", english: "I go to the office at 8 o'clock" }, { sentence: "友達（ともだち） に 会（あ）いました", reading: "ともだち に あいました", english: "I met my friend" }] },
    { id: "toshokan", kanji: "図", onyomi: "ズ、ト", kunyomi: "はか（る）", meaning: "plan, diagram", examples: [{ sentence: "図書館（としょかん） で 勉強（べんきょう） します", reading: "としょかん で べんきょう します", english: "I study at the library" }, { sentence: "この 町（まち） に は 大（おお）きな 図書館（としょかん） が あります", reading: "この まち に は おおきな としょかん が あります", english: "There is a big library in this town" }] },
    { id: "benkyou", kanji: "勉", onyomi: "ベン", kunyomi: "つと（める）", meaning: "exertion, endeavor", examples: [{ sentence: "図書館（としょかん） で 勉強（べんきょう） します", reading: "としょかん で べんきょう します", english: "I study at the library" }, { sentence: "日本語（にほんご） を 勉強（べんきょう） しています", reading: "にほんご を べんきょう しています", english: "I am studying Japanese" }] },
    { id: "hataraku", kanji: "働", onyomi: "ドウ", kunyomi: "はたら（く）", meaning: "work", examples: [{ sentence: "昨日（きのう） は 十時間（じゅうじかん） 働（はたら）きました", reading: "きのう は じゅうじかん はたらきました", english: "Yesterday I worked for 10 hours" }, { sentence: "毎日（まいにち） 働（はたら）きます", reading: "まいにち はたらきます", english: "I work every day" }] },
    { id: "nichiyoubi", kanji: "曜", onyomi: "ヨウ", kunyomi: null, meaning: "weekday", examples: [{ sentence: "日曜日（にちようび） に 映画（えいが） を 見（み）ます", reading: "にちようび に えいが を みます", english: "I'll watch a movie on Sunday" }, { sentence: "月曜日（げつようび） に 会（あ）いましょう", reading: "げつようび に あいましょう", english: "Let's meet on Monday" }] },
    { id: "eiga", kanji: "映", onyomi: "エイ", kunyomi: "うつ（る）、は（える）", meaning: "reflect, projection", examples: [{ sentence: "映画（えいが） を 見（み）ます", reading: "えいが を みます", english: "I watch a movie" }, { sentence: "映画（えいが） が 好（す）き です", reading: "えいが が すき です", english: "I like movies" }] },
    { id: "kazoku", kanji: "族", onyomi: "ゾク", kunyomi: null, meaning: "family, tribe", examples: [{ sentence: "私（わたし） の 家族（かぞく） は 両親（りょうしん） と 妹（いもうと） です", reading: "わたし の かぞく は りょうしん と いもうと です", english: "My family is my parents and my younger sister" }, { sentence: "家族（かぞく） と 一緒（いっしょ）に 住（す）んでいます", reading: "かぞく と いっしょに すんでいます", english: "I live with my family" }] },
    { id: "ryoushin", kanji: "両", onyomi: "リョウ", kunyomi: "てる", meaning: "both", examples: [{ sentence: "私（わたし） の 家族（かぞく） は 両親（りょうしん） と 妹（いもうと） です", reading: "わたし の かぞく は りょうしん と いもうと です", english: "My family is my parents and my younger sister" }, { sentence: "両親（りょうしん） は 旅行（りょこう） が 大好（だいす）き です", reading: "りょうしん は りょこう が だいすき です", english: "My parents love traveling" }] },
    { id: "imouto", kanji: "妹", onyomi: "マイ", kunyomi: "いもうと", meaning: "younger sister", examples: [{ sentence: "私（わたし） の 家族（かぞく） は 両親（りょうしん） と 妹（いもうと） です", reading: "わたし の かぞく は りょうしん と いもうと です", english: "My family is my parents and my younger sister" }, { sentence: "妹（いもうと） は 小（ちい）さい 時（とき） から ピアノ を 弾（ひ）きます", reading: "いもうと は ちいさい とき から ぴあの を ひきます", english: "My younger sister has played piano since she was small" }] },
    { id: "ryouri", kanji: "料", onyomi: "リョウ", kunyomi: null, meaning: "fee, materials", examples: [{ sentence: "母（はは） は 野菜（やさい） を 切（き）りながら 料理（りょうり） します", reading: "はは は やさい を きりながら りょうり します", english: "My mother cooks while cutting vegetables" }, { sentence: "この 料理（りょうり） は 少（すこ）し 辛（から）い です", reading: "この りょうり は すこし からい です", english: "This dish is a little spicy" }] },
    { id: "yasai", kanji: "菜", onyomi: "サイ", kunyomi: "な", meaning: "vegetable, greens", examples: [{ sentence: "母（はは） は 野菜（やさい） を 切（き）りながら 料理（りょうり） します", reading: "はは は やさい を きりながら りょうり します", english: "My mother cooks while cutting vegetables" }, { sentence: "野菜（やさい） が 好（す）き です か", reading: "やさい が すき です か", english: "Do you like vegetables?" }] },
    { id: "kiru", kanji: "切", onyomi: "セツ、サイ", kunyomi: "き（る）", meaning: "cut, important", examples: [{ sentence: "母（はは） は 野菜（やさい） を 切（き）りながら 料理（りょうり） します", reading: "はは は やさい を きりながら りょうり します", english: "My mother cooks while cutting vegetables" }, { sentence: "切符（きっぷ） を 買（か）います", reading: "きっぷ を かいます", english: "I buy a ticket" }] },
    { id: "inu", kanji: "犬", onyomi: "ケン", kunyomi: "いぬ", meaning: "dog", examples: [{ sentence: "公園（こうえん） で 小（ちい）さい 犬（いぬ） を 見（み）ました", reading: "こうえん で ちいさい いぬ を みました", english: "I saw a small dog in the park" }, { sentence: "犬（いぬ） が 好（す）き です", reading: "いぬ が すき です", english: "I like dogs" }] },
    { id: "machi", kanji: "町", onyomi: "チョウ", kunyomi: "まち", meaning: "town", examples: [{ sentence: "この 町（まち） に は 大（おお）きな 図書館（としょかん） が あります", reading: "この まち に は おおきな としょかん が あります", english: "There is a big library in this town" }, { sentence: "町（まち） で 友達（ともだち） に 会（あ）いました", reading: "まち で ともだち に あいました", english: "I met my friend in town" }] },
    { id: "shinkansen", kanji: "新", onyomi: "シン", kunyomi: "あたら（しい）", meaning: "new", examples: [{ sentence: "新幹線（しんかんせん） は 速（はや）い です", reading: "しんかんせん は はやい です", english: "The Shinkansen is fast" }, { sentence: "新（あたら）しい 隣人（りんじん） は 親切（しんせつ） です", reading: "あたらしい りんじん は しんせつ です", english: "The new neighbor is kind" }] },
    { id: "hayai", kanji: "速", onyomi: "ソク", kunyomi: "はや（い）", meaning: "fast", examples: [{ sentence: "新幹線（しんかんせん） は 速（はや）い です", reading: "しんかんせん は はやい です", english: "The Shinkansen is fast" }, { sentence: "速（はや）い 電車（でんしゃ） に 乗（の）ります", reading: "はやい でんしゃ に のります", english: "I take a fast train" }] },
    { id: "furu", kanji: "降", onyomi: "コウ", kunyomi: "お（りる）、ふ（る）", meaning: "descend, precipitate", examples: [{ sentence: "雨（あめ） が 降（ふ）りました", reading: "あめ が ふりました", english: "It rained" }, { sentence: "雪（ゆき） が 降（ふ）っています", reading: "ゆき が ふっています", english: "It is snowing" }] },
    { id: "shuumatsu", kanji: "末", onyomi: "マツ、バツ", kunyomi: "すえ", meaning: "end", examples: [{ sentence: "週末（しゅうまつ） は 何（なに） を します か", reading: "しゅうまつ は なに を します か", english: "What do you do on weekends?" }, { sentence: "週末（しゅうまつ） に 映画（えいが） を 見（み）ます", reading: "しゅうまつ に えいが を みます", english: "I watch a movie on the weekend" }] },
    { id: "ongaku", kanji: "音", onyomi: "オン、イン", kunyomi: "おと、ね", meaning: "sound", examples: [{ sentence: "音楽（おんがく） を 聞（き）きます", reading: "おんがく を ききます", english: "I listen to music" }, { sentence: "音楽（おんがく） が 好（す）き です", reading: "おんがく が すき です", english: "I like music" }] },
    { id: "sanpo", kanji: "散", onyomi: "サン", kunyomi: "ち（る）", meaning: "scatter", examples: [{ sentence: "散歩（さんぽ） します", reading: "さんぽ します", english: "I take a walk" }, { sentence: "よく 散歩（さんぽ） します", reading: "よく さんぽ します", english: "I often take a walk" }] },
    { id: "natsu", kanji: "夏", onyomi: "カ、ゲ", kunyomi: "なつ", meaning: "summer", examples: [{ sentence: "夏（なつ） は 冷（つめ）たい アイスクリーム が 一番（いちばん） 好（す）き です", reading: "なつ は つめたい あいすくりーむ が いちばん すき です", english: "In summer, I like cold ice cream the most" }, { sentence: "夏（なつ） 休（やす）み に 旅行（りょこう） します", reading: "なつやすみ に りょこう します", english: "I travel during summer vacation" }] },
    { id: "ocha", kanji: "茶", onyomi: "チャ、サ", kunyomi: "ちゃ", meaning: "tea", examples: [{ sentence: "コーヒー、紅茶（こうちゃ）、あと お茶（ちゃ） も あります", reading: "こーひー、こうちゃ、あと おちゃ も あります", english: "Coffee, black tea, and also green tea" }, { sentence: "お茶（ちゃ） を 飲（の）みます", reading: "おちゃ を のみます", english: "I drink tea" }] },
    { id: "kagi", kanji: "鍵", onyomi: "ケン", kunyomi: "かぎ", meaning: "key", examples: [{ sentence: "鍵（かぎ） を 忘（わす）れました", reading: "かぎ を わすれました", english: "I forgot my key" }, { sentence: "鍵（かぎ） を かけました", reading: "かぎ を かけました", english: "I locked it" }] },
    { id: "wasure", kanji: "忘", onyomi: "ボウ", kunyomi: "わす（れる）", meaning: "forget", examples: [{ sentence: "鍵（かぎ） を 忘（わす）れました", reading: "かぎ を わすれました", english: "I forgot my key" }, { sentence: "宿題（しゅくだい） を 忘（わす）れました", reading: "しゅくだい を わすれました", english: "I forgot my homework" }] },
    { id: "heya", kanji: "部", onyomi: "ブ", kunyomi: "べ", meaning: "part, department", examples: [{ sentence: "部屋（へや） に 入（はい）れません", reading: "へや に はいれません", english: "I can't enter the room" }, { sentence: "部屋（へや） が 狭（せま）い です", reading: "へや が せまい です", english: "The room is small" }] },
    { id: "karai", kanji: "辛", onyomi: "シン", kunyomi: "から（い）", meaning: "spicy", examples: [{ sentence: "この 料理（りょうり） は 少（すこ）し 辛（から）い です", reading: "この りょうり は すこし からい です", english: "This dish is a little spicy" }, { sentence: "辛（から）い もの が 好（す）き です か", reading: "からい もの が すき です か", english: "Do you like spicy things?" }] },
    { id: "oishii", kanji: "美", onyomi: "ビ", kunyomi: "うつく（しい）", meaning: "beautiful", examples: [{ sentence: "この 料理（りょうり） は 美味（おい）しい です", reading: "この りょうり は おいしい です", english: "This dish is delicious" }, { sentence: "日本（にほん） は 美（うつく）しい 国（くに） です", reading: "にほん は うつくしい くに です", english: "Japan is a beautiful country" }] },
    { id: "yuubinkyoku", kanji: "郵", onyomi: "ユウ", kunyomi: null, meaning: "mail", examples: [{ sentence: "郵便局（ゆうびんきょく） が あります", reading: "ゆうびんきょく が あります", english: "There is a post office" }, { sentence: "郵便局（ゆうびんきょく） で 切手（きって） を 買（か）いました", reading: "ゆうびんきょく で きって を かいました", english: "I bought stamps at the post office" }] },
    { id: "byouin", kanji: "病", onyomi: "ビョウ、ヘイ", kunyomi: "や（む）", meaning: "ill, sick", examples: [{ sentence: "病院（びょういん） に 行（い）きます", reading: "びょういん に いきます", english: "I go to the hospital" }, { sentence: "病院（びょういん） で 診察（しんさつ） を 受（う）けました", reading: "びょういん で しんさつ を うけました", english: "I received a medical examination at the hospital" }] },
    { id: "kusuri", kanji: "薬", onyomi: "ヤク", kunyomi: "くすり", meaning: "medicine", examples: [{ sentence: "薬（くすり） を 飲（の）みます", reading: "くすり を のみます", english: "I take medicine" }, { sentence: "薬（くすり） を 飲（の）みました か", reading: "くすり を のみました か", english: "Did you take your medicine?" }] },

    // ========== ADDITIONAL COMMON KANJI (N3+) ==========
    { id: "atsui", kanji: "暑", onyomi: "ショ", kunyomi: "あつ（い）", meaning: "hot (weather)", examples: [{ sentence: "今日（きょう） は とても 暑（あつ）い です", reading: "きょう は とても あつい です", english: "Today is very hot" }, { sentence: "暑（あつ）くて 眠（ねむ）れません", reading: "あつくて ねむれません", english: "It's so hot I can't sleep" }] },
    { id: "yasashii", kanji: "優", onyomi: "ユウ", kunyomi: "やさ（しい）", meaning: "gentle, kind", examples: [{ sentence: "彼女（かのじょ） は 優（やさ）しい です", reading: "かのじょ は やさしい です", english: "She is kind" }, { sentence: "優（やさ）しい 人（ひと） です", reading: "やさしい ひと です", english: "He is a kind person" }] },
    { id: "subarashii", kanji: "素", onyomi: "ソ、ス", kunyomi: "もと", meaning: "element, plain", examples: [{ sentence: "素晴（すば）らしい アイデア です", reading: "すばらしい あいであ です", english: "That's a wonderful idea" }, { sentence: "素晴（すば）らしい 天気（てんき） です ね", reading: "すばらしい てんき です ね", english: "The weather is wonderful, isn't it?" }] },
    { id: "muzukashii", kanji: "難", onyomi: "ナン", kunyomi: "むずか（しい）", meaning: "difficult", examples: [{ sentence: "発音（はつおん） が 難（むずか）しい です", reading: "はつおん が むずかしい です", english: "Pronunciation is difficult" }, { sentence: "日本語（にほんご） は 難（むずか）しい です か", reading: "にほんご は むずかしい です か", english: "Is Japanese difficult?" }] },
    { id: "yasashii_easy", kanji: "易", onyomi: "エキ、イ", kunyomi: "やさ（しい）", meaning: "easy", examples: [{ sentence: "この 問題（もんだい） は 易（やさ）しい です", reading: "この もんだい は やさしい です", english: "This problem is easy" }, { sentence: "易（やさ）しい 言葉（ことば） で 説明（せつめい）して ください", reading: "やさしい ことば で せつめいして ください", english: "Please explain in easy words" }] },
    { id: "akarui", kanji: "明", onyomi: "メイ、ミョウ", kunyomi: "あか（るい）", meaning: "bright, clear", examples: [{ sentence: "明（あか）るい 部屋（へや）", reading: "あかるい へや", english: "Bright room" }, { sentence: "明日（あした） は 明（あか）るい です ね", reading: "あした は あかるい です ね", english: "Tomorrow is bright, isn't it?" }] },
    { id: "kurai", kanji: "暗", onyomi: "アン", kunyomi: "くら（い）", meaning: "dark", examples: [{ sentence: "暗（くら）い 部屋（へや）", reading: "くらい へや", english: "Dark room" }, { sentence: "外（そと） は 暗（くら）い です", reading: "そと は くらい です", english: "It's dark outside" }] },
    { id: "atatakai", kanji: "温", onyomi: "オン", kunyomi: "あたた（かい）", meaning: "warm", examples: [{ sentence: "温（あたた）かい お茶（ちゃ）", reading: "あたたかい おちゃ", english: "Warm tea" }, { sentence: "今日（きょう） は 温（あたた）かい です ね", reading: "きょう は あたたかい です ね", english: "Today is warm, isn't it?" }] },
    { id: "tsumetai", kanji: "冷", onyomi: "レイ", kunyomi: "つめ（たい）", meaning: "cold (to touch)", examples: [{ sentence: "冷（つめ）たい 飲（の）み物（もの）", reading: "つめたい のみもの", english: "Cold drink" }, { sentence: "夏（なつ） は 冷（つめ）たい アイスクリーム が 一番（いちばん） 好（す）き です", reading: "なつ は つめたい あいすくりーむ が いちばん すき です", english: "In summer, I like cold ice cream the most" }] },
    { id: "samui", kanji: "寒", onyomi: "カン", kunyomi: "さむ（い）", meaning: "cold (weather)", examples: [{ sentence: "今日（きょう） は 寒（さむ）い です", reading: "きょう は さむい です", english: "Today is cold" }, { sentence: "冬（ふゆ） は 寒（さむ）い です", reading: "ふゆ は さむい です", english: "Winter is cold" }] },
    { id: "omoshiroi", kanji: "面", onyomi: "メン", kunyomi: "おも、つら", meaning: "face, surface", examples: [{ sentence: "面白（おもしろ）い 映画（えいが）", reading: "おもしろい えいが", english: "Interesting movie" }, { sentence: "面白（おもしろ）い 本（ほん） を 読（よ）みました", reading: "おもしろい ほん を よみました", english: "I read an interesting book" }] },
    { id: "nigiyaka", kanji: "賑", onyomi: "シン", kunyomi: "にぎ（わう）", meaning: "bustling", examples: [{ sentence: "賑（にぎ）やかな 街（まち）", reading: "にぎやかな まち", english: "Lively town" }, { sentence: "東京（とうきょう） は 賑（にぎ）やかな 街（まち） です", reading: "とうきょう は にぎやかな まち です", english: "Tokyo is a lively city" }] },
    { id: "shizuka", kanji: "静", onyomi: "セイ、ジョウ", kunyomi: "しず（か）", meaning: "quiet", examples: [{ sentence: "静（しず）かな 場所（ばしょ）", reading: "しずかな ばしょ", english: "Quiet place" }, { sentence: "この 辺（へん） は 静（しず）か です", reading: "この へん は しずか です", english: "This area is quiet" }] },
    { id: "yuumei", kanji: "有", onyomi: "ユウ、ウ", kunyomi: "あ（る）", meaning: "to have, exist", examples: [{ sentence: "有名（ゆうめい）な レストラン", reading: "ゆうめいな れすとらん", english: "Famous restaurant" }, { sentence: "有名（ゆうめい）な 人（ひと）", reading: "ゆうめいな ひと", english: "Famous person" }] },
    { id: "shinsetsu", kanji: "親", onyomi: "シン", kunyomi: "おや、した（しい）", meaning: "parent, intimate", examples: [{ sentence: "親切（しんせつ）な 人（ひと）", reading: "しんせつな ひと", english: "Kind person" }, { sentence: "店員（てんいん）さん は 親切（しんせつ）でした", reading: "てんいんさん は しんせつでした", english: "The clerk was kind" }] },
    { id: "benri", kanji: "便", onyomi: "ベン、ビン", kunyomi: "たよ（り）", meaning: "convenience", examples: [{ sentence: "便利（べんり）な 電車（でんしゃ）", reading: "べんりな でんしゃ", english: "Convenient train" }, { sentence: "この アプリ は 便利（べんり） です", reading: "この あぷり は べんり です", english: "This app is convenient" }] },
    { id: "fuben", kanji: "不", onyomi: "フ、ブ", kunyomi: null, meaning: "not, un-", examples: [{ sentence: "不便（ふべん）な 場所（ばしょ）", reading: "ふべんな ばしょ", english: "Inconvenient place" }, { sentence: "田舎（いなか） は 不便（ふべん） です", reading: "いなか は ふべん です", english: "The countryside is inconvenient" }] },
    { id: "taisetsu", kanji: "大", onyomi: "ダイ、タイ", kunyomi: "おお（きい）", meaning: "large, important", examples: [{ sentence: "大切（たいせつ）な 人（ひと）", reading: "たいせつな ひと", english: "Important person" }, { sentence: "よく 寝（ね）る こと が 大切（たいせつ） です", reading: "よく ねる こと が たいせつ です", english: "Getting enough sleep is important" }] },
    { id: "hitsuyou", kanji: "必", onyomi: "ヒツ", kunyomi: "かなら（ず）", meaning: "certainly, necessarily", examples: [{ sentence: "必要（ひつよう）な もの", reading: "ひつような もの", english: "Necessary thing" }, { sentence: "手術（しゅじゅつ） が 必要（ひつよう） です", reading: "しゅじゅつ が ひつよう です", english: "Surgery is necessary" }] },
    { id: "jiyuu", kanji: "自", onyomi: "ジ、シ", kunyomi: "みずか（ら）", meaning: "self", examples: [{ sentence: "自由（じゆう）な 時間（じかん）", reading: "じゆうな じかん", english: "Free time" }, { sentence: "自由（じゆう）に 使（つか）えます", reading: "じゆうに つかえます", english: "You can use it freely" }] },
    { id: "shiawase", kanji: "幸", onyomi: "コウ", kunyomi: "さいわ（い）", meaning: "happiness", examples: [{ sentence: "幸（しあわ）せな 生活（せいかつ）", reading: "しあわせな せいかつ", english: "Happy life" }, { sentence: "幸（しあわ）せ です か", reading: "しあわせ です か", english: "Are you happy?" }] },
    { id: "joubu", kanji: "丈", onyomi: "ジョウ", kunyomi: "たけ", meaning: "height, length", examples: [{ sentence: "丈夫（じょうぶ）な 鞄（かばん）", reading: "じょうぶな かばん", english: "Durable bag" }, { sentence: "この 鞄（かばん） は 丈夫（じょうぶ） です", reading: "この かばん は じょうぶ です", english: "This bag is durable" }] },
    { id: "majime", kanji: "真", onyomi: "シン", kunyomi: "ま", meaning: "true, reality", examples: [{ sentence: "真面目（まじめ）な 人（ひと）", reading: "まじめな ひと", english: "Serious person" }, { sentence: "彼（かれ） は 真面目（まじめ）な 人間（にんげん） です", reading: "かれ は まじめな にんげん です", english: "He is a serious person" }] },

    // ========== NEWLY ADDED MISSING KANJI ==========
    // From wordDict, sentences, and other app data
    
    // Drink - appears everywhere
    { id: "nomu", kanji: "飲", onyomi: "イン", kunyomi: "の（む）", meaning: "drink", examples: [{ sentence: "水（みず） を 飲（の）みます", reading: "みず を のみます", english: "I drink water" }, { sentence: "毎日（まいにち） コーヒー を 飲（の）みます", reading: "まいにち こーひー を のみます", english: "I drink coffee every day" }] },
    
    // Thing/object
    { id: "mono", kanji: "物", onyomi: "ブツ、モツ", kunyomi: "もの", meaning: "thing, object", examples: [{ sentence: "飲（の）み物（もの） を 買（か）いに コンビニ へ 行（い）きます", reading: "のみもの を かいに こんびに へ いきます", english: "I go to the convenience store to buy a drink" }, { sentence: "食べ物（たべもの） が 好（す）き です", reading: "たべもの が すき です", english: "I like food" }] },
    
    // Goods/article
    { id: "shina", kanji: "品", onyomi: "ヒン", kunyomi: "しな", meaning: "goods, article", examples: [{ sentence: "商品（しょうひん） を 買（か）いました", reading: "しょうひん を かいました", english: "I bought a product" }, { sentence: "この 商品（しょうひん） は お値打（ねう）ち です", reading: "この しょうひん は おねうち です", english: "This product is a good value" }] },
    
    // Sell
    { id: "uru", kanji: "売", onyomi: "バイ", kunyomi: "う（る）", meaning: "sell", examples: [{ sentence: "売（う）り切（き）れました", reading: "うりきれました", english: "It's sold out" }, { sentence: "この 店（みせ） は 魚（さかな） を 売（う）っています", reading: "この みせ は さかな を うっています", english: "This shop sells fish" }] },
    
    // Make
    { id: "tsukuru", kanji: "作", onyomi: "サク、サ", kunyomi: "つく（る）", meaning: "make", examples: [{ sentence: "料理（りょうり） を 作（つく）ります", reading: "りょうり を つくります", english: "I make a dish" }, { sentence: "何（なに） を 作（つく）っています か", reading: "なに を つくっています か", english: "What are you making?" }] },
    
    // Use
    { id: "tsukau", kanji: "使", onyomi: "シ", kunyomi: "つか（う）", meaning: "use", examples: [{ sentence: "この ペン を 使（つか）います", reading: "この ぺん を つかいます", english: "I use this pen" }, { sentence: "クレジットカード は 使（つか）えます か", reading: "くれじっとかーど は つかえます か", english: "Can I use a credit card?" }] },
    
    // Cross/hand over
    { id: "wataru", kanji: "渡", onyomi: "ト", kunyomi: "わた（る）、わた（す）", meaning: "cross, hand over", examples: [{ sentence: "交差点（こうさてん） を 渡（わた）ります", reading: "こうさてん を わたります", english: "I cross the intersection" }, { sentence: "資料（しりょう） を 渡（わた）しました", reading: "しりょう を わたしました", english: "I handed over the documents" }] },
    
    // Turn
    { id: "magaru", kanji: "曲", onyomi: "キョク", kunyomi: "ま（がる）", meaning: "turn, bend", examples: [{ sentence: "右（みぎ） に 曲（ま）がって ください", reading: "みぎ に まがって ください", english: "Please turn right" }, { sentence: "角（かど） を 曲（ま）がりました", reading: "かど を まがりました", english: "I turned the corner" }] },
    
    // Stop
    { id: "tomaru", kanji: "止", onyomi: "シ", kunyomi: "と（まる）、と（める）", meaning: "stop", examples: [{ sentence: "ここ で 止（と）まって ください", reading: "ここ で とまって ください", english: "Please stop here" }, { sentence: "雨（あめ） が 止（や）みました", reading: "あめ が やみました", english: "The rain stopped" }] },
    
    // Bathe
    { id: "abiru", kanji: "浴", onyomi: "ヨク", kunyomi: "あ（びる）", meaning: "bathe, shower", examples: [{ sentence: "シャワー を 浴（あ）びます", reading: "しゃわー を あびます", english: "I take a shower" }, { sentence: "毎朝（まいあさ） シャワー を 浴（あ）びます", reading: "まいあさ しゃわー を あびます", english: "I take a shower every morning" }] },
    
    // Wash
    { id: "arau", kanji: "洗", onyomi: "セン", kunyomi: "あら（う）", meaning: "wash", examples: [{ sentence: "手（て） を 洗（あら）います", reading: "て を あらいます", english: "I wash my hands" }, { sentence: "洗濯（せんたく） を します", reading: "せんたく を します", english: "I do laundry" }] },
    
    // Practice
    { id: "renshuu", kanji: "練", onyomi: "レン", kunyomi: "ね（る）", meaning: "practice, train", examples: [{ sentence: "練習（れんしゅう） します", reading: "れんしゅう します", english: "I practice" }, { sentence: "毎日（まいにち） 練習（れんしゅう） します", reading: "まいにち れんしゅう します", english: "I practice every day" }] },
    
    // Work
    { id: "shigoto", kanji: "仕", onyomi: "シ、ジ", kunyomi: "つか（える）", meaning: "serve, work", examples: [{ sentence: "仕事（しごと） を します", reading: "しごと を します", english: "I work" }, { sentence: "仕事（しごと） が 終（お）わりました", reading: "しごと が おわりました", english: "Work is finished" }] },
    
    // Marry
    { id: "kekkon", kanji: "結", onyomi: "ケツ", kunyomi: "むす（ぶ）", meaning: "tie, bind", examples: [{ sentence: "結婚（けっこん） します", reading: "けっこん します", english: "I get married" }, { sentence: "来年（らいねん） 結婚（けっこん） します", reading: "らいねん けっこん します", english: "I'll get married next year" }] },
    
    // Drive
    { id: "unten", kanji: "運", onyomi: "ウン", kunyomi: "はこ（ぶ）", meaning: "carry, transport", examples: [{ sentence: "運転（うんてん） します", reading: "うんてん します", english: "I drive" }, { sentence: "車（くるま） を 運転（うんてん） します", reading: "くるま を うんてん します", english: "I drive a car" }] },
    
    // Turn (rotate)
    { id: "ten", kanji: "転", onyomi: "テン", kunyomi: "ころ（がる）", meaning: "turn, revolve", examples: [{ sentence: "転（ころ）びました", reading: "ころびました", english: "I fell over" }, { sentence: "事故（じこ） で 転（ころ）びました", reading: "じこ で ころびました", english: "I fell in the accident" }] },
    
    // Phone/talk
    { id: "wa", kanji: "話", onyomi: "ワ", kunyomi: "はな（す）", meaning: "talk, speak", examples: [{ sentence: "電話（でんわ） を します", reading: "でんわ を します", english: "I make a phone call" }, { sentence: "日本語（にほんご） を 話（はな）します", reading: "にほんご を はなします", english: "I speak Japanese" }] },
    
    // Promise
    { id: "yakusoku", kanji: "約", onyomi: "ヤク", kunyomi: "つづ（まる）", meaning: "promise, approximately", examples: [{ sentence: "約束（やくそく） します", reading: "やくそく します", english: "I promise" }, { sentence: "約束（やくそく） を 守（まも）ります", reading: "やくそく を まもります", english: "I keep a promise" }] },
    
    // Promise (bundle)
    { id: "soku", kanji: "束", onyomi: "ソク", kunyomi: "たば", meaning: "bundle, bind", examples: [{ sentence: "約束（やくそく） を します", reading: "やくそく を します", english: "I promise" }, { sentence: "束（たば）ねます", reading: "たばねます", english: "I bundle" }] },
    
    // Counter for flat objects
    { id: "mai", kanji: "枚", onyomi: "マイ", kunyomi: null, meaning: "counter for flat objects", examples: [{ sentence: "五枚（ごまい） ください", reading: "ごまい ください", english: "Please give me five (flat objects)" }, { sentence: "紙（かみ） を 一枚（いちまい） ください", reading: "かみ を いちまい ください", english: "Please give me one sheet of paper" }] },
    
    // Counter for cups
    { id: "hai", kanji: "杯", onyomi: "ハイ", kunyomi: "さかずき", meaning: "counter for cups/glasses", examples: [{ sentence: "コーヒー を 二杯（にはい） 飲（の）みます", reading: "こーひー を にはい のみます", english: "I drink two cups of coffee" }, { sentence: "一杯（いっぱい） ください", reading: "いっぱい ください", english: "Please give me one cup" }] },
    
    // Counter for times
    { id: "kai", kanji: "回", onyomi: "カイ", kunyomi: "まわ（る）", meaning: "counter for times, turn", examples: [{ sentence: "三回（さんかい） 行（い）きました", reading: "さんかい いきました", english: "I went three times" }, { sentence: "もう 一度（いちど） お願（ねが）いします", reading: "もう いちど おねがいします", english: "Please do it one more time" }] },
    
    // Second (time)
    { id: "byou", kanji: "秒", onyomi: "ビョウ", kunyomi: null, meaning: "second", examples: [{ sentence: "十秒（じゅうびょう） で 終（お）わります", reading: "じゅうびょう で おわります", english: "It finishes in 10 seconds" }, { sentence: "一分（いっぷん） は 六十秒（ろくじゅうびょう） です", reading: "いっぷん は ろくじゅうびょう です", english: "One minute is 60 seconds" }] },
    
    // Wind
    { id: "kaze", kanji: "風", onyomi: "フウ、フ", kunyomi: "かぜ", meaning: "wind, style", examples: [{ sentence: "風（かぜ） が 強（つよ）い です", reading: "かぜ が つよい です", english: "The wind is strong" }, { sentence: "風邪（かぜ） を 引（ひ）きました", reading: "かぜ を ひきました", english: "I caught a cold" }] },
    
    // Counter/typhoon
    { id: "dai", kanji: "台", onyomi: "ダイ", kunyomi: "うてな", meaning: "counter for machines, pedestal", examples: [{ sentence: "台風（たいふう） が 来（き）ています", reading: "たいふう が きています", english: "A typhoon is coming" }, { sentence: "一台（いちだい） の 車（くるま）", reading: "いちだい の くるま", english: "One car" }] },
    
    // Star
    { id: "hoshi", kanji: "星", onyomi: "セイ、ショウ", kunyomi: "ほし", meaning: "star", examples: [{ sentence: "星（ほし） が 綺麗（きれい） です", reading: "ほし が きれい です", english: "The stars are beautiful" }, { sentence: "星（ほし） を 見（み）ます", reading: "ほし を みます", english: "I look at the stars" }] },
    
    // Sun (great)
    { id: "taiyou", kanji: "太", onyomi: "タイ、タ", kunyomi: "ふと（い）", meaning: "thick, great", examples: [{ sentence: "太陽（たいよう） が 昇（のぼ）ります", reading: "たいよう が のぼります", english: "The sun rises" }, { sentence: "太陽（たいよう） が 明（あか）るい です", reading: "たいよう が あかるい です", english: "The sun is bright" }] },
    
    // Sun (yang)
    { id: "you", kanji: "陽", onyomi: "ヨウ", kunyomi: "ひ", meaning: "sun, positive", examples: [{ sentence: "太陽（たいよう） が 昇（のぼ）ります", reading: "たいよう が のぼります", english: "The sun rises" }, { sentence: "陽（ひ） が 当（あ）たります", reading: "ひ が あたります", english: "The sun shines on it" }] },
    
    // Face
    { id: "kao", kanji: "顔", onyomi: "ガン", kunyomi: "かお", meaning: "face", examples: [{ sentence: "顔（かお） を 洗（あら）います", reading: "かお を あらいます", english: "I wash my face" }, { sentence: "彼女（かのじょ） の 顔（かお） が 好（す）き です", reading: "かのじょ の かお が すき です", english: "I like her face" }] },
    
    // Nose
    { id: "hana", kanji: "鼻", onyomi: "ビ", kunyomi: "はな", meaning: "nose", examples: [{ sentence: "鼻（はな） が 高（たか）い です", reading: "はな が たかい です", english: "The nose is high" }, { sentence: "鼻（はな） が 詰（つ）まっています", reading: "はな が つまっています", english: "My nose is stuffed" }] },
    
    // Arm
    { id: "ude", kanji: "腕", onyomi: "ワン", kunyomi: "うで", meaning: "arm", examples: [{ sentence: "腕（うで） を 上（あ）げます", reading: "うで を あげます", english: "I raise my arm" }, { sentence: "腕（うで） が 痛（いた）い です", reading: "うで が いたい です", english: "My arm hurts" }] },
    
    // Shoulder
    { id: "kata", kanji: "肩", onyomi: "ケン", kunyomi: "かた", meaning: "shoulder", examples: [{ sentence: "肩（かた） が 凝（こ）ります", reading: "かた が こります", english: "My shoulders are stiff" }, { sentence: "肩（かた） を 揉（も）みます", reading: "かた を もみます", english: "I massage my shoulders" }] },
    
    // Back
    { id: "se", kanji: "背", onyomi: "ハイ", kunyomi: "せ、せ（い）", meaning: "height, back", examples: [{ sentence: "背（せ） が 高（たか）い です", reading: "せ が たかい です", english: "I am tall" }, { sentence: "背（せ）中（なか） が 痛（いた）い です", reading: "せなか が いたい です", english: "My back hurts" }] },
    
    // Stomach
    { id: "onaka", kanji: "腹", onyomi: "フク", kunyomi: "はら", meaning: "belly, abdomen", examples: [{ sentence: "お腹（なか） が 空（す）きました", reading: "おなか が すきました", english: "I'm hungry" }, { sentence: "お腹（なか） が 痛（いた）い です", reading: "おなか が いたい です", english: "I have a stomachache" }] },
    
    // Organ
    { id: "zou", kanji: "臓", onyomi: "ゾウ", kunyomi: null, meaning: "internal organ", examples: [{ sentence: "心臓（しんぞう） が 強（つよ）い です", reading: "しんぞう が つよい です", english: "My heart is strong" }, { sentence: "心臓（しんぞう） の 病気（びょうき）", reading: "しんぞう の びょうき", english: "Heart disease" }] },
    
    // Hair
    { id: "kami", kanji: "髪", onyomi: "ハツ", kunyomi: "かみ", meaning: "hair", examples: [{ sentence: "髪（かみ） を 切（き）ります", reading: "かみ を きります", english: "I cut my hair" }, { sentence: "髪（かみ） が 長（なが）い です", reading: "かみ が ながい です", english: "My hair is long" }] },
    
    // Fever
    { id: "netsu", kanji: "熱", onyomi: "ネツ", kunyomi: "あつ（い）", meaning: "heat, fever", examples: [{ sentence: "熱（ねつ） が あります", reading: "ねつ が あります", english: "I have a fever" }, { sentence: "熱（ねつ） が 下（さ）がりました", reading: "ねつ が さがりました", english: "The fever went down" }] },
    
    // Rescue
    { id: "kyuu", kanji: "救", onyomi: "キュウ", kunyomi: "すく（う）", meaning: "rescue, save", examples: [{ sentence: "救急車（きゅうきゅうしゃ） を 呼（よ）びます", reading: "きゅうきゅうしゃ を よびます", english: "I call an ambulance" }, { sentence: "命（いのち） を 救（すく）いました", reading: "いのち を すくいました", english: "I saved a life" }] },
    
    // Emergency
    { id: "kyuu2", kanji: "急", onyomi: "キュウ", kunyomi: "いそ（ぐ）", meaning: "urgent, sudden", examples: [{ sentence: "救急車（きゅうきゅうしゃ）", reading: "きゅうきゅうしゃ", english: "Ambulance" }, { sentence: "急（いそ）いで ください", reading: "いそいで ください", english: "Please hurry" }] },
    
    // Washer
    { id: "sen", kanji: "洗", onyomi: "セン", kunyomi: "あら（う）", meaning: "wash", examples: [{ sentence: "洗濯機（せんたくき） を 回（まわ）します", reading: "せんたくき を まわします", english: "I run the washing machine" }, { sentence: "洗濯（せんたく） を します", reading: "せんたく を します", english: "I do laundry" }] },
    
    // Wash (rinse)
    { id: "taku", kanji: "濯", onyomi: "タク", kunyomi: "すすぐ", meaning: "rinse, wash", examples: [{ sentence: "洗濯（せんたく） を します", reading: "せんたく を します", english: "I do laundry" }, { sentence: "洗濯機（せんたくき）", reading: "せんたくき", english: "Washing machine" }] },
    
    // Sweep
    { id: "sou", kanji: "掃", onyomi: "ソウ", kunyomi: "は（く）", meaning: "sweep, clean", examples: [{ sentence: "掃除機（そうじき） を かけます", reading: "そうじき を かけます", english: "I vacuum" }, { sentence: "部屋（へや） を 掃除（そうじ） します", reading: "へや を そうじ します", english: "I clean the room" }] },
    
    // Remove
    { id: "jo", kanji: "除", onyomi: "ジョ", kunyomi: "のぞ（く）", meaning: "remove, exclude", examples: [{ sentence: "掃除機（そうじき）", reading: "そうじき", english: "Vacuum cleaner" }, { sentence: "邪魔（じゃま） を 除（のぞ）きます", reading: "じゃま を のぞきます", english: "I remove the obstacle" }] },
    
    // Refrigerator (cold)
    { id: "rei", kanji: "冷", onyomi: "レイ", kunyomi: "つめ（たい）、ひ（える）", meaning: "cold, cool", examples: [{ sentence: "冷蔵庫（れいぞうこ） に 牛乳（ぎゅうにゅう） が あります", reading: "れいぞうこ に ぎゅうにゅう が あります", english: "There is milk in the refrigerator" }, { sentence: "冷（つめ）たい 飲（の）み物（もの）", reading: "つめたい のみもの", english: "Cold drink" }] },
    
    // Store/warehouse
    { id: "souko", kanji: "蔵", onyomi: "ゾウ", kunyomi: "くら", meaning: "storehouse, warehouse", examples: [{ sentence: "冷蔵庫（れいぞうこ）", reading: "れいぞうこ", english: "Refrigerator" }, { sentence: "蔵（くら） に 保管（ほかん） します", reading: "くら に ほかん します", english: "I store it in the warehouse" }] },
    
    // Field
    { id: "ya", kanji: "野", onyomi: "ヤ", kunyomi: "の", meaning: "field, plain", examples: [{ sentence: "野球（やきゅう） が 好（す）き です", reading: "やきゅう が すき です", english: "I like baseball" }, { sentence: "野原（のはら） を 走（はし）ります", reading: "のはら を はしります", english: "I run through the field" }] },
    
    // Ball
    { id: "kyuu3", kanji: "球", onyomi: "キュウ", kunyomi: "たま", meaning: "ball, sphere", examples: [{ sentence: "野球（やきゅう）", reading: "やきゅう", english: "Baseball" }, { sentence: "地球（ちきゅう） は 丸（まる）い です", reading: "ちきゅう は まるい です", english: "The Earth is round" }] },
    
    // Copy
    { id: "sha", kanji: "写", onyomi: "シャ", kunyomi: "うつ（す）", meaning: "copy, photograph", examples: [{ sentence: "写真（しゃしん） を 撮（と）ります", reading: "しゃしん を とります", english: "I take a photo" }, { sentence: "写（うつ）します", reading: "うつします", english: "I copy" }] },
    
    // Truth/reality
    { id: "shin", kanji: "真", onyomi: "シン", kunyomi: "ま", meaning: "true, reality", examples: [{ sentence: "真面目（まじめ）な 人（ひと）", reading: "まじめな ひと", english: "Serious person" }, { sentence: "本当（ほんとう） です か", reading: "ほんとう です か", english: "Is it true?" }] },
    
    // Take photo
    { id: "toru", kanji: "撮", onyomi: "サツ", kunyomi: "と（る）", meaning: "take (photo), film", examples: [{ sentence: "写真（しゃしん） を 撮（と）ります", reading: "しゃしん を とります", english: "I take a photo" }, { sentence: "映画（えいが） を 撮（と）ります", reading: "えいが を とります", english: "I film a movie" }] },
    
    // Dance
    { id: "odoru", kanji: "踊", onyomi: "ヨウ", kunyomi: "おど（る）", meaning: "dance", examples: [{ sentence: "ダンス を 踊（おど）ります", reading: "だんす を おどります", english: "I dance" }, { sentence: "上手（じょうず）に 踊（おど）ります", reading: "じょうずに おどります", english: "I dance well" }] },
    
    // Draw
    { id: "kaku2", kanji: "描", onyomi: "ビョウ", kunyomi: "えが（く）、か（く）", meaning: "draw, paint", examples: [{ sentence: "絵（え） を 描（か）きます", reading: "え を かきます", english: "I draw a picture" }, { sentence: "絵（え） を 描（えが）きます", reading: "え を えがきます", english: "I paint a picture" }] },
    
    // Request
    { id: "tanomu", kanji: "頼", onyomi: "ライ", kunyomi: "たの（む）", meaning: "request, rely on", examples: [{ sentence: "助（たす）け を 頼（たの）みます", reading: "たすけ を たのみます", english: "I ask for help" }, { sentence: "友達（ともだち） に 頼（たの）みました", reading: "ともだち に たのみました", english: "I asked my friend" }] },
    
    // Match/competition
    { id: "shiai", kanji: "試", onyomi: "シ", kunyomi: "こころ（みる）", meaning: "test, try", examples: [{ sentence: "試合（しあい） に 勝（か）ちます", reading: "しあい に かちます", english: "I win the match" }, { sentence: "試験（しけん） が あります", reading: "しけん が あります", english: "There is an exam" }] },
    
    // Win
    { id: "katsu", kanji: "勝", onyomi: "ショウ", kunyomi: "か（つ）", meaning: "win", examples: [{ sentence: "試合（しあい） に 勝（か）ちました", reading: "しあい に かちました", english: "I won the match" }, { sentence: "勝（か）つ こと が 大切（たいせつ） です", reading: "かつ こと が たいせつ です", english: "Winning is important" }] },
    
    // Lose
    { id: "makeru", kanji: "負", onyomi: "フ", kunyomi: "ま（ける）", meaning: "lose, negative", examples: [{ sentence: "ゲーム に 負（ま）けました", reading: "げーむ に まけました", english: "I lost the game" }, { sentence: "負（ま）けないで ください", reading: "まけないで ください", english: "Please don't give up" }] },
    
    // Examine
    { id: "shin", kanji: "診", onyomi: "シン", kunyomi: "み（る）", meaning: "diagnose, examine", examples: [{ sentence: "診察（しんさつ） を 受けます", reading: "しんさつ を うけます", english: "I receive a medical examination" }, { sentence: "医者（いしゃ） に 診（み）てもらいました", reading: "いしゃ に みてもらいました", english: "I had a doctor examine me" }] },
    
    // Injection
    { id: "shin", kanji: "針", onyomi: "シン", kunyomi: "はり", meaning: "needle", examples: [{ sentence: "注射（ちゅうしゃ） を します", reading: "ちゅうしゃ を します", english: "I get an injection" }, { sentence: "針（はり） が 痛（いた）い", reading: "はり が いたい", english: "The needle hurts" }] },
    
    // Shoot
    { id: "sha2", kanji: "射", onyomi: "シャ", kunyomi: "い（る）", meaning: "shoot", examples: [{ sentence: "注射（ちゅうしゃ） を します", reading: "ちゅうしゃ を します", english: "I get an injection" }, { sentence: "矢（や） を 射（い）ます", reading: "や を います", english: "I shoot an arrow" }] },
    
    // Health
    { id: "kou", kanji: "康", onyomi: "コウ", kunyomi: null, meaning: "healthy", examples: [{ sentence: "健康（けんこう） の ため に 運動（うんどう） します", reading: "けんこう の ため に うんどう します", english: "I exercise for my health" }, { sentence: "健康（けんこう） が 一番（いちばん） です", reading: "けんこう が いちばん です", english: "Health is the most important" }] },
    
    // Suitable
    { id: "teki", kanji: "適", onyomi: "テキ", kunyomi: "かな（う）", meaning: "suitable, appropriate", examples: [{ sentence: "適当（てきとう）な 例（れい）", reading: "てきとうな れい", english: "Appropriate example" }, { sentence: "適切（てきせつ）な 言葉（ことば）", reading: "てきせつな ことば", english: "Appropriate words" }] },
    
    // Plant
    { id: "ueru", kanji: "植", onyomi: "ショク", kunyomi: "う（える）", meaning: "plant", examples: [{ sentence: "庭（にわ） に 木（き） を 植（う）えました", reading: "にわ に き を うえました", english: "I planted a tree in the garden" }, { sentence: "花（はな） を 植（う）えます", reading: "はな を うえます", english: "I plant flowers" }] },
    
    // Close
    { id: "shimeru", kanji: "閉", onyomi: "ヘイ", kunyomi: "と（じる）、し（める）", meaning: "close, shut", examples: [{ sentence: "ドア を 閉（し）めます", reading: "どあ を しめます", english: "I close the door" }, { sentence: "カーテン を 閉（し）めます", reading: "かーてん を しめます", english: "I close the curtains" }] },
    
    // Dry
    { id: "hosu", kanji: "干", onyomi: "カン", kunyomi: "ほ（す）", meaning: "dry", examples: [{ sentence: "洗濯物（せんたくもの） を 干（ほ）します", reading: "せんたくもの を ほします", english: "I hang the laundry to dry" }, { sentence: "布団（ふとん） を 干（ほ）します", reading: "ふとん を ほします", english: "I air out the futon" }] },
    
    // Remain
    { id: "nokoru", kanji: "残", onyomi: "ザン", kunyomi: "のこ（る）", meaning: "remain, left over", examples: [{ sentence: "残業（ざんぎょう） を します", reading: "ざんぎょう を します", english: "I work overtime" }, { sentence: "食べ物（たべもの） が 残（のこ）りました", reading: "たべもの が のこりました", english: "Food is left over" }] },
    
    // Work (business)
    { id: "gyou", kanji: "業", onyomi: "ギョウ、ゴウ", kunyomi: "わざ", meaning: "work, business, industry", examples: [{ sentence: "残業（ざんぎょう） を します", reading: "ざんぎょう を します", english: "I work overtime" }, { sentence: "授業（じゅぎょう） が 終（お）わりました", reading: "じゅぎょう が おわりました", english: "Class ended" }] },
    
    // Discussion
    { id: "gi", kanji: "議", onyomi: "ギ", kunyomi: null, meaning: "discussion, deliberation", examples: [{ sentence: "会議（かいぎ） が あります", reading: "かいぎ が あります", english: "There is a meeting" }, { sentence: "会議（かいぎ） に 出席（しゅっせき） します", reading: "かいぎ に しゅっせき します", english: "I attend the meeting" }] },
    
    // End
    { id: "owaru", kanji: "終", onyomi: "シュウ", kunyomi: "お（わる）", meaning: "end, finish", examples: [{ sentence: "仕事（しごと） が 終（お）わりました", reading: "しごと が おわりました", english: "Work is finished" }, { sentence: "授業（じゅぎょう） が 終（お）わりました", reading: "じゅぎょう が おわりました", english: "Class ended" }] },
    
    // Report
    { id: "houkoku", kanji: "報", onyomi: "ホウ", kunyomi: "むく（いる）", meaning: "report, news", examples: [{ sentence: "報告（ほうこく） します", reading: "ほうこく します", english: "I report" }, { sentence: "天気予報（てんきよほう）", reading: "てんきよほう", english: "Weather forecast" }] },
    
    // Report (tell)
    { id: "koku", kanji: "告", onyomi: "コク", kunyomi: "つ（げる）", meaning: "tell, announce", examples: [{ sentence: "報告（ほうこく） します", reading: "ほうこく します", english: "I report" }, { sentence: "知（し）らせ を 告（つ）げます", reading: "しらせ を つげます", english: "I deliver the news" }] },
    
    // Material
    { id: "shi", kanji: "資", onyomi: "シ", kunyomi: null, meaning: "resources, capital", examples: [{ sentence: "資料（しりょう） を 準備（じゅんび） します", reading: "しりょう を じゅんび します", english: "I prepare the materials" }, { sentence: "資金（しきん） が 足（た）りません", reading: "しきん が たりません", english: "I don't have enough funds" }] },
    
    // Material/fee
    { id: "ryou", kanji: "料", onyomi: "リョウ", kunyomi: null, meaning: "fee, materials", examples: [{ sentence: "資料（しりょう） を 準備（じゅんび） します", reading: "しりょう を じゅんび します", english: "I prepare the materials" }, { sentence: "入場料（にゅうじょうりょう） を 払（はら）います", reading: "にゅうじょうりょう を はらいます", english: "I pay the entrance fee" }] },
    
    // Prepare
    { id: "junbi", kanji: "準", onyomi: "ジュン", kunyomi: null, meaning: "standard, semi-", examples: [{ sentence: "準備（じゅんび） します", reading: "じゅんび します", english: "I prepare" }, { sentence: "準備（じゅんび） が できました", reading: "じゅんび が できました", english: "Preparation is complete" }] },
    
    // Prepare (equip)
    { id: "bi", kanji: "備", onyomi: "ビ", kunyomi: "そな（える）", meaning: "prepare, equip", examples: [{ sentence: "準備（じゅんび） します", reading: "じゅんび します", english: "I prepare" }, { sentence: "備（そな）えます", reading: "そなえます", english: "I equip" }] },
    
    // Breakdown
    { id: "koshi", kanji: "故", onyomi: "コ", kunyomi: "ゆえ", meaning: "reason, cause", examples: [{ sentence: "故障（こしょう） しました", reading: "こしょう しました", english: "It broke down" }, { sentence: "故郷（こきょう） に 帰（かえ）ります", reading: "こきょう に かえります", english: "I return to my hometown" }] },
    
    // Breakdown (obstacle)
    { id: "shou", kanji: "障", onyomi: "ショウ", kunyomi: "さわ（る）", meaning: "obstacle, hinder", examples: [{ sentence: "故障（こしょう） しました", reading: "こしょう しました", english: "It broke down" }, { sentence: "障害（しょうがい） が あります", reading: "しょうがい が あります", english: "There is an obstacle" }] },
    
    // Absent
    { id: "ketsu", kanji: "欠", onyomi: "ケツ", kunyomi: "か（ける）", meaning: "lack, be absent", examples: [{ sentence: "欠席（けっせき） します", reading: "けっせき します", english: "I will be absent" }, { sentence: "お金（かね） が 欠（か）けています", reading: "おかね が かけています", english: "I'm short of money" }] },
    
    // Seat
    { id: "seki", kanji: "席", onyomi: "セキ", kunyomi: null, meaning: "seat", examples: [{ sentence: "欠席（けっせき） します", reading: "けっせき します", english: "I will be absent" }, { sentence: "席（せき） に 座（すわ）ります", reading: "せき に すわります", english: "I sit in the seat" }] },
    
    // Pass
    { id: "gou", kanji: "合", onyomi: "ゴウ", kunyomi: "あ（う）", meaning: "join, fit, pass", examples: [{ sentence: "試験（しけん） に 合格（ごうかく） しました", reading: "しけん に ごうかく しました", english: "I passed the exam" }, { sentence: "サイズ が 合（あ）います", reading: "さいず が あいます", english: "The size fits" }] },
    
    // Pass (rank)
    { id: "kaku", kanji: "格", onyomi: "カク", kunyomi: null, meaning: "status, rank", examples: [{ sentence: "合格（ごうかく） しました", reading: "ごうかく しました", english: "I passed" }, { sentence: "格（かく） が 違（ちが）います", reading: "かく が ちがいます", english: "The status is different" }] },
    
    // Submit
    { id: "teishutsu", kanji: "提", onyomi: "テイ", kunyomi: "さ（げる）", meaning: "propose, submit", examples: [{ sentence: "提出（ていしゅつ） します", reading: "ていしゅつ します", english: "I submit" }, { sentence: "課題（かだい） を 提出（ていしゅつ） します", reading: "かだい を ていしゅつ します", english: "I submit the assignment" }] },
    
    // Question
    { id: "mon", kanji: "問", onyomi: "モン", kunyomi: "と（う）", meaning: "question, problem", examples: [{ sentence: "質問（しつもん） が あります", reading: "しつもん が あります", english: "I have a question" }, { sentence: "問題（もんだい） を 解（と）きます", reading: "もんだい を ときます", english: "I solve the problem" }] },
    
    // Open
    { id: "hiraku", kanji: "開", onyomi: "カイ", kunyomi: "あ（ける）、ひら（く）", meaning: "open", examples: [{ sentence: "教科書（きょうかしょ） を 開（ひら）きます", reading: "きょうかしょ を ひらきます", english: "I open the textbook" }, { sentence: "ドア を 開（あ）けます", reading: "どあ を あけます", english: "I open the door" }] },
    
    // Pronunciation (depart)
    { id: "hatsu", kanji: "発", onyomi: "ハツ", kunyomi: "た（つ）", meaning: "departure, emit", examples: [{ sentence: "発音（はつおん） が 難（むずか）しい です", reading: "はつおん が むずかしい です", english: "Pronunciation is difficult" }, { sentence: "出発（しゅっぱつ） します", reading: "しゅっぱつ します", english: "I depart" }] }
];

const kanjiOrder = kanjiData.map(k => k.id);

function getKanjiById(id) {
    return kanjiData.find(k => k.id === id);
}