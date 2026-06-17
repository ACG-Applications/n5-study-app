// ==================== KANJI DATA ====================
// Complete kanji list extracted from all app data (sentences, adjectives, adverbs, grammar, verbs, practice test, stories, videos)
// Total kanji: Complete N5-N4 + all kanji appearing in study materials

const kanjiData = [
    // ========== N5 CORE KANJI (1-80) ==========
    { id: "nichi", kanji: "日", onyomi: "ニチ、ジツ", kunyomi: "ひ、-び、-か", meaning: "day, sun, Japan", examples: [{ sentence: "今日（きょう）はいい天気（てんき）です", reading: "きょうはいいてんきです", english: "Today is nice weather" }, { sentence: "毎日（まいにち）コーヒーを飲（の）みます", reading: "まいにちこーひーをのみます", english: "I drink coffee every day" }] },
    { id: "ichi", kanji: "一", onyomi: "イチ", kunyomi: "ひと（つ）", meaning: "one", examples: [{ sentence: "一人（ひとり）で映画（えいが）を見（み）ました", reading: "ひとりでえいがをみました", english: "I watched a movie alone" }, { sentence: "一番（いちばん）好（す）きな料理（りょうり）は寿司（すし）です", reading: "いちばんすきなりょうりはすしです", english: "My favorite food is sushi" }] },
    { id: "kuni", kanji: "国", onyomi: "コク", kunyomi: "くに", meaning: "country", examples: [{ sentence: "日本（にほん）は美（うつく）しい国（くに）です", reading: "にほんはうつくしいくにです", english: "Japan is a beautiful country" }, { sentence: "外国（がいこく）の本（ほん）を読（よ）みました", reading: "がいこくのほんをよみました", english: "I read a foreign book" }] },
    { id: "hito", kanji: "人", onyomi: "ジン、ニン", kunyomi: "ひと", meaning: "person", examples: [{ sentence: "あの人（ひと）は誰（だれ）ですか", reading: "あのひとはだれですか", english: "Who is that person?" }, { sentence: "日本人（にほんじん）ですか", reading: "にほんじんですか", english: "Are you Japanese?" }] },
    { id: "toshi", kanji: "年", onyomi: "ネン", kunyomi: "とし", meaning: "year", examples: [{ sentence: "来年（らいねん）日本（にほん）へ行（い）きます", reading: "らいねんにほんへいきます", english: "I will go to Japan next year" }, { sentence: "今年（ことし）は何歳（なんさい）ですか", reading: "ことしはなんさいですか", english: "How old are you this year?" }] },
    { id: "oo", kanji: "大", onyomi: "ダイ、タイ", kunyomi: "おお（きい）", meaning: "large, big", examples: [{ sentence: "大（おお）きい犬（いぬ）がいます", reading: "おおきいいぬがいます", english: "There is a big dog" }, { sentence: "大変（たいへん）でした", reading: "たいへんでした", english: "It was tough" }] },
    { id: "juu", kanji: "十", onyomi: "ジュウ", kunyomi: "とお", meaning: "ten", examples: [{ sentence: "十人（じゅうにん）います", reading: "じゅうにんいます", english: "There are ten people" }, { sentence: "十月（じゅうがつ）に誕生日（たんじょうび）です", reading: "じゅうがつにたんじょうびです", english: "My birthday is in October" }] },
    { id: "ni", kanji: "二", onyomi: "ニ", kunyomi: "ふた（つ）", meaning: "two", examples: [{ sentence: "二人（ふたり）で行（い）きました", reading: "ふたりでいきました", english: "Two people went" }, { sentence: "二階（にかい）に上（あ）がります", reading: "にかいにあがります", english: "I go up to the second floor" }] },
    { id: "hon", kanji: "本", onyomi: "ホン", kunyomi: "もと", meaning: "book, origin, counter for long objects", examples: [{ sentence: "本（ほん）を読（よ）みます", reading: "ほんをよみます", english: "I read a book" }, { sentence: "日本（にほん）から来（き）ました", reading: "にほんからきました", english: "I came from Japan" }] },
    { id: "naka", kanji: "中", onyomi: "チュウ", kunyomi: "なか", meaning: "in, inside, middle", examples: [{ sentence: "箱（はこ）の中（なか）にあります", reading: "はこのなかにあります", english: "It's inside the box" }, { sentence: "中国（ちゅうごく）から来（き）ました", reading: "ちゅうごくからきました", english: "I came from China" }] },
    { id: "nagai", kanji: "長", onyomi: "チョウ", kunyomi: "なが（い）", meaning: "long, leader", examples: [{ sentence: "長（なが）い時間（じかん）待（ま）ちました", reading: "ながいじかんまちました", english: "I waited for a long time" }, { sentence: "部長（ぶちょう）は親切（しんせつ）です", reading: "ぶちょうはしんせつです", english: "The department manager is kind" }] },
    { id: "deru", kanji: "出", onyomi: "シュツ", kunyomi: "で（る）、だ（す）", meaning: "exit, leave, go out", examples: [{ sentence: "駅（えき）を出（で）ました", reading: "えきをでました", english: "I left the station" }, { sentence: "宿題（しゅくだい）を出（だ）しました", reading: "しゅくだいをだしました", english: "I submitted my homework" }] },
    { id: "san", kanji: "三", onyomi: "サン", kunyomi: "み（っつ）", meaning: "three", examples: [{ sentence: "三時（さんじ）に会（あ）いましょう", reading: "さんじにあいましょう", english: "Let's meet at 3 o'clock" }, { sentence: "三日間（みっかかん）旅行（りょこう）しました", reading: "みっかかんりょこうしました", english: "I traveled for three days" }] },
    { id: "toki", kanji: "時", onyomi: "ジ", kunyomi: "とき", meaning: "time, hour", examples: [{ sentence: "今（いま）何時（なんじ）ですか", reading: "いまなんじですか", english: "What time is it now?" }, { sentence: "時々（ときどき）映画（えいが）を見（み）ます", reading: "ときどきえいがをみます", english: "I sometimes watch movies" }] },
    { id: "iku", kanji: "行", onyomi: "コウ、ギョウ", kunyomi: "い（く）、おこな（う）", meaning: "go, conduct", examples: [{ sentence: "学校（がっこう）へ行（い）きます", reading: "がっこうへいきます", english: "I go to school" }, { sentence: "旅行（りょこう）が好（す）きです", reading: "りょこうがすきです", english: "I like traveling" }] },
    { id: "miru", kanji: "見", onyomi: "ケン", kunyomi: "み（る）", meaning: "see, watch", examples: [{ sentence: "テレビを見（み）ます", reading: "てれびをみます", english: "I watch TV" }, { sentence: "見（み）てください", reading: "みてください", english: "Please look" }] },
    { id: "tsuki", kanji: "月", onyomi: "ゲツ、ガツ", kunyomi: "つき", meaning: "month, moon", examples: [{ sentence: "来月（らいげつ）帰（かえ）ります", reading: "らいげつかえります", english: "I will return next month" }, { sentence: "月曜日（げつようび）に会（あ）いましょう", reading: "げつようびにあいましょう", english: "Let's meet on Monday" }] },
    { id: "fun", kanji: "分", onyomi: "ブン、フン", kunyomi: "わ（ける）", meaning: "minute, part, understand", examples: [{ sentence: "十分（じゅっぷん）待（ま）ちました", reading: "じゅっぷんまちました", english: "I waited for 10 minutes" }, { sentence: "日本語（にほんご）が分（わ）かります", reading: "にほんごがわかります", english: "I understand Japanese" }] },
    { id: "ato", kanji: "後", onyomi: "ゴ、コウ", kunyomi: "あと、うし（ろ）", meaning: "after, behind, later", examples: [{ sentence: "食（た）べた後（あと）に薬（くすり）を飲（の）みます", reading: "たべたあとにくすりをのみます", english: "I take medicine after eating" }, { sentence: "後（うし）ろに立（た）ってください", reading: "うしろにたってください", english: "Please stand behind" }] },
    { id: "mae", kanji: "前", onyomi: "ゼン", kunyomi: "まえ", meaning: "in front, before", examples: [{ sentence: "食（た）べる前（まえ）に手（て）を洗（あら）います", reading: "たべるまえにてをあらいます", english: "I wash my hands before eating" }, { sentence: "店（みせ）の前（まえ）で待（ま）ちましょう", reading: "みせのまえでまちましょう", english: "Let's wait in front of the shop" }] },
    { id: "sei", kanji: "生", onyomi: "セイ、ショウ", kunyomi: "い（きる）、う（まれる）、なま", meaning: "life, genuine, birth", examples: [{ sentence: "誕生日（たんじょうび）おめでとう", reading: "たんじょうびおめでとう", english: "Happy birthday" }, { sentence: "生（なま）の魚（さかな）は好（す）きじゃありません", reading: "なまのさかなはすきじゃありません", english: "I don't like raw fish" }] },
    { id: "go", kanji: "五", onyomi: "ゴ", kunyomi: "いつ（つ）", meaning: "five", examples: [{ sentence: "五時（ごじ）に起（お）きます", reading: "ごじにおきます", english: "I wake up at 5 o'clock" }, { sentence: "五個（ごこ）買（か）いました", reading: "ごこかいました", english: "I bought five items" }] },
    { id: "aida", kanji: "間", onyomi: "カン、ケン", kunyomi: "あいだ、ま", meaning: "interval, space, between", examples: [{ sentence: "一時間（いちじかん）勉強（べんきょう）しました", reading: "いちじかんべんきょうしました", english: "I studied for one hour" }, { sentence: "休み時間（やすみじかん）に話（はな）しましょう", reading: "やすみじかんにはなしましょう", english: "Let's talk during break time" }] },
    { id: "ue", kanji: "上", onyomi: "ジョウ", kunyomi: "うえ、あ（げる）、のぼ（る）", meaning: "above, up, top", examples: [{ sentence: "机（つくえ）の上（うえ）に本（ほん）があります", reading: "つくえのうえにほんがあります", english: "There is a book on the desk" }, { sentence: "東京（とうきょう）に上（のぼ）ります", reading: "とうきょうにのぼります", english: "I go up to Tokyo" }] },
    { id: "higashi", kanji: "東", onyomi: "トウ", kunyomi: "ひがし", meaning: "east", examples: [{ sentence: "東（ひがし）の方（ほう）へ行（い）きます", reading: "ひがしのほうへいきます", english: "I go toward the east" }, { sentence: "東京（とうきょう）は東日本（ひがしにほん）にあります", reading: "とうきょうはひがしにほんにあります", english: "Tokyo is in eastern Japan" }] },
    { id: "yon", kanji: "四", onyomi: "シ", kunyomi: "よん、よ（っつ）", meaning: "four", examples: [{ sentence: "四人（よにん）で行（い）きます", reading: "よにんでいきます", english: "Four people go" }, { sentence: "四月（しがつ）に日本（にほん）へ行（い）きます", reading: "しがつににほんへいきます", english: "I go to Japan in April" }] },
    { id: "ima", kanji: "今", onyomi: "コン、キン", kunyomi: "いま", meaning: "now", examples: [{ sentence: "今（いま）何時（なんじ）ですか", reading: "いまなんじですか", english: "What time is it now?" }, { sentence: "今日（きょう）は忙（いそが）しいです", reading: "きょうはいそがしいです", english: "I'm busy today" }] },
    { id: "kane", kanji: "金", onyomi: "キン、コン", kunyomi: "かね", meaning: "gold, money", examples: [{ sentence: "お金（かね）がありません", reading: "おかねがありません", english: "I have no money" }, { sentence: "金曜日（きんようび）に会（あ）いましょう", reading: "きんようびにあいましょう", english: "Let's meet on Friday" }] },
    { id: "kyuu", kanji: "九", onyomi: "キュウ、ク", kunyomi: "ここの（つ）", meaning: "nine", examples: [{ sentence: "九時（くじ）に寝（ね）ます", reading: "くじにねます", english: "I sleep at 9 o'clock" }, { sentence: "九人（きゅうにん）います", reading: "きゅうにんいます", english: "There are nine people" }] },
    { id: "hairu", kanji: "入", onyomi: "ニュウ", kunyomi: "はい（る）、い（る）", meaning: "enter, insert", examples: [{ sentence: "部屋（へや）に入（はい）ります", reading: "へやにはいります", english: "I enter the room" }, { sentence: "お金（かね）を入（い）れてください", reading: "おかねをいれてください", english: "Please insert the money" }] },
    { id: "manabu", kanji: "学", onyomi: "ガク", kunyomi: "まな（ぶ）", meaning: "study, learning", examples: [{ sentence: "大学（だいがく）で勉強（べんきょう）します", reading: "だいがくでべんきょうします", english: "I study at university" }, { sentence: "日本語（にほんご）を学（まな）びたいです", reading: "にほんごをまなびたいです", english: "I want to learn Japanese" }] },
    { id: "takai", kanji: "高", onyomi: "コウ", kunyomi: "たか（い）", meaning: "tall, high, expensive", examples: [{ sentence: "山（やま）が高（たか）いです", reading: "やまがたかいです", english: "The mountain is high" }, { sentence: "値段（ねだん）が高（たか）いです", reading: "ねだんがたかいです", english: "The price is high/expensive" }] },
    { id: "en", kanji: "円", onyomi: "エン", kunyomi: "まる（い）", meaning: "circle, yen", examples: [{ sentence: "百円（ひゃくえん）です", reading: "ひゃくえんです", english: "It's 100 yen" }, { sentence: "円（まる）いテーブルがあります", reading: "まるいてーぶるがあります", english: "There is a round table" }] },
    { id: "ko", kanji: "子", onyomi: "シ、ス", kunyomi: "こ", meaning: "child", examples: [{ sentence: "子供（こども）が公園（こうえん）で遊（あそ）んでいます", reading: "こどもがこうえんであそんでいます", english: "Children are playing in the park" }, { sentence: "子犬（こいぬ）が好（す）きです", reading: "こいぬがすきです", english: "I like puppies" }] },
    { id: "soto", kanji: "外", onyomi: "ガイ、ゲ", kunyomi: "そと、はず（す）", meaning: "outside", examples: [{ sentence: "外（そと）は雨（あめ）です", reading: "そとはあめです", english: "It's raining outside" }, { sentence: "外国人（がいこくじん）です", reading: "がいこくじんです", english: "I'm a foreigner" }] },
    { id: "hachi", kanji: "八", onyomi: "ハチ", kunyomi: "や（っつ）", meaning: "eight", examples: [{ sentence: "八時（はちじ）に起（お）きます", reading: "はちじにおきます", english: "I wake up at 8 o'clock" }, { sentence: "八人（はちにん）います", reading: "はちにんいます", english: "There are eight people" }] },
    { id: "roku", kanji: "六", onyomi: "ロク", kunyomi: "む（っつ）", meaning: "six", examples: [{ sentence: "六時（ろくじ）に起（お）きます", reading: "ろくじにおきます", english: "I wake up at 6 o'clock" }, { sentence: "六日間（むいかかん）旅行（りょこう）しました", reading: "むいかかんりょこうしました", english: "I traveled for six days" }] },
    { id: "shita", kanji: "下", onyomi: "カ、ゲ", kunyomi: "した、くだ（る）、さ（げる）", meaning: "below, down, descend", examples: [{ sentence: "机（つくえ）の下（した）にあります", reading: "つくえのしたにあります", english: "It's under the desk" }, { sentence: "電車（でんしゃ）を下（お）ります", reading: "でんしゃをおります", english: "I get off the train" }] },
    { id: "kuru", kanji: "来", onyomi: "ライ", kunyomi: "く（る）、き（たす）", meaning: "come, next, cause", examples: [{ sentence: "日本（にほん）に来（き）ました", reading: "にほんにきました", english: "I came to Japan" }, { sentence: "来週（らいしゅう）帰（かえ）ります", reading: "らいしゅうかえります", english: "I'll return next week" }] },
    { id: "ki", kanji: "気", onyomi: "キ", kunyomi: "いき", meaning: "spirit, mind, air, mood", examples: [{ sentence: "元気（げんき）ですか", reading: "げんきですか", english: "How are you?" }, { sentence: "気分（きぶん）が悪（わる）いです", reading: "きぶんがわるいです", english: "I feel sick" }] },
    { id: "chii", kanji: "小", onyomi: "ショウ", kunyomi: "ちい（さい）、こ", meaning: "small, little", examples: [{ sentence: "小（ちい）さい犬（いぬ）を見（み）ました", reading: "ちいさいいぬをみました", english: "I saw a small dog" }, { sentence: "小学生（しょうがくせい）です", reading: "しょうがくせいです", english: "I'm an elementary school student" }] },
    { id: "shichi", kanji: "七", onyomi: "シチ", kunyomi: "なな（つ）、なの", meaning: "seven", examples: [{ sentence: "七時（しちじ）に起（お）きます", reading: "しちじにおきます", english: "I wake up at 7 o'clock" }, { sentence: "七日（なのか）間（かん）旅行（りょこう）しました", reading: "なのかかんりょこうしました", english: "I traveled for seven days" }] },
    { id: "yama", kanji: "山", onyomi: "サン", kunyomi: "やま", meaning: "mountain", examples: [{ sentence: "富士山（ふじさん）に登（の）ぼりました", reading: "ふじさんにのぼりました", english: "I climbed Mount Fuji" }, { sentence: "山（やま）が高（たか）いです", reading: "やまがたかいです", english: "The mountain is high" }] },
    { id: "hanashi", kanji: "話", onyomi: "ワ", kunyomi: "はな（す）、はなし", meaning: "tale, talk, story", examples: [{ sentence: "日本語（にほんご）を話（はな）します", reading: "にほんごをはなします", english: "I speak Japanese" }, { sentence: "面白（おもしろ）い話（はなし）を聞（き）きました", reading: "おもしろいはなしをききました", english: "I heard an interesting story" }] },
    { id: "onna", kanji: "女", onyomi: "ジョ", kunyomi: "おんな、め", meaning: "woman, female", examples: [{ sentence: "女（おんな）の人（ひと）がいます", reading: "おんなのひとがいます", english: "There is a woman" }, { sentence: "彼女（かのじょ）は優（やさ）しいです", reading: "かのじょはやさしいです", english: "She is kind" }] },
    { id: "kita", kanji: "北", onyomi: "ホク", kunyomi: "きた", meaning: "north", examples: [{ sentence: "北（きた）の方（ほう）へ行（い）きます", reading: "きたのほうへいきます", english: "I go toward the north" }, { sentence: "北海道（ほっかいどう）に行（い）きました", reading: "ほっかいどうにいきました", english: "I went to Hokkaido" }] },
    { id: "uma", kanji: "午", onyomi: "ゴ", kunyomi: "うま", meaning: "noon, sign of the horse", examples: [{ sentence: "午前（ごぜん）に勉強（べんきょう）します", reading: "ごぜんにべんきょうします", english: "I study in the morning" }, { sentence: "午後（ごご）映画（えいが）を見（み）ます", reading: "ごごえいがをみます", english: "I watch a movie in the afternoon" }] },
    { id: "hyaku", kanji: "百", onyomi: "ヒャク", kunyomi: "もも", meaning: "hundred", examples: [{ sentence: "百円（ひゃくえん）です", reading: "ひゃくえんです", english: "It's 100 yen" }, { sentence: "三百（さんびゃく）メートル歩（ある）きました", reading: "さんびゃくめーとるあるきました", english: "I walked 300 meters" }] },
    { id: "kaku", kanji: "書", onyomi: "ショ", kunyomi: "か（く）", meaning: "write", examples: [{ sentence: "手紙（てがみ）を書（か）きます", reading: "てがみをかきます", english: "I write a letter" }, { sentence: "図書館（としょかん）で勉強（べんきょう）します", reading: "としょかんでべんきょうします", english: "I study at the library" }] },
    { id: "saki", kanji: "先", onyomi: "セン", kunyomi: "さき、ま（ず）", meaning: "before, ahead, previous", examples: [{ sentence: "先週（せんしゅう）友達（ともだち）に会（あ）いました", reading: "せんしゅうともだちにあいました", english: "I met my friend last week" }, { sentence: "先（さき）に行（い）ってください", reading: "さきにいってください", english: "Please go ahead" }] },
    { id: "na", kanji: "名", onyomi: "メイ、ミョウ", kunyomi: "な", meaning: "name, noted, distinguished", examples: [{ sentence: "名前（なまえ）は何（なん）ですか", reading: "なまえはなんですか", english: "What is your name?" }, { sentence: "有名（ゆうめい）なレストランです", reading: "ゆうめいなれすとらんです", english: "It's a famous restaurant" }] },
    { id: "kawa", kanji: "川", onyomi: "セン", kunyomi: "かわ", meaning: "river", examples: [{ sentence: "川（かわ）で泳（およ）ぎました", reading: "かわでおよぎました", english: "I swam in the river" }, { sentence: "子供（こども）の頃（ころ）よく川（かわ）で泳（およ）ぎました", reading: "こどものころよくかわでおよぎました", english: "When I was a child, I often swam in the river" }] },
    { id: "sen", kanji: "千", onyomi: "セン", kunyomi: "ち", meaning: "thousand", examples: [{ sentence: "千円（せんえん）ください", reading: "せんえんください", english: "Please give me 1000 yen" }, { sentence: "二千（にせん）メートルです", reading: "にせんめーとるです", english: "It's 2000 meters" }] },
    { id: "kiku", kanji: "聞", onyomi: "ブン、モン", kunyomi: "き（く）", meaning: "to hear, to listen, to ask", examples: [{ sentence: "音楽（おんがく）を聞（き）きます", reading: "おんがくをききます", english: "I listen to music" }, { sentence: "先生（せんせい）に聞（き）きました", reading: "せんせいにききました", english: "I asked the teacher" }] },
    { id: "mizu", kanji: "水", onyomi: "スイ", kunyomi: "みず", meaning: "water", examples: [{ sentence: "水（みず）を飲（の）みます", reading: "みずをのみます", english: "I drink water" }, { sentence: "水曜日（すいようび）に会（あ）いましょう", reading: "すいようびにあいましょう", english: "Let's meet on Wednesday" }] },
    { id: "han", kanji: "半", onyomi: "ハン", kunyomi: "なか（ば）", meaning: "half, middle", examples: [{ sentence: "半分（はんぶん）ください", reading: "はんぶんください", english: "Please give me half" }, { sentence: "一時間半（いちじかんはん）待（ま）ちました", reading: "いちじかんはんまちました", english: "I waited for one and a half hours" }] },
    { id: "otoko", kanji: "男", onyomi: "ダン、ナン", kunyomi: "おとこ", meaning: "male, man", examples: [{ sentence: "男（おとこ）の人（ひと）です", reading: "おとこのひとです", english: "He is a man" }, { sentence: "彼（かれ）は元気（げんき）です", reading: "かれはげんきです", english: "He is healthy" }] },
    { id: "nishi", kanji: "西", onyomi: "セイ、サイ", kunyomi: "にし", meaning: "west", examples: [{ sentence: "西（にし）の方（ほう）へ行（い）きました", reading: "にしのほうへいきました", english: "I went toward the west" }, { sentence: "大阪（おおさか）は西日本（にしにほん）にあります", reading: "おおさかはにしにほんにあります", english: "Osaka is in western Japan" }] },
    { id: "den", kanji: "電", onyomi: "デン", kunyomi: null, meaning: "electricity", examples: [{ sentence: "電車（でんしゃ）に乗（の）ります", reading: "でんしゃにのります", english: "I take the train" }, { sentence: "電気（でんき）をつけます", reading: "でんきをつけます", english: "I turn on the light" }] },
    { id: "go_kanji", kanji: "語", onyomi: "ゴ", kunyomi: "かた（る）", meaning: "word, speech, language", examples: [{ sentence: "日本語（にほんご）を勉強（べんきょう）します", reading: "にほんごをべんきょうします", english: "I study Japanese" }, { sentence: "英語（えいご）が話（はな）せます", reading: "えいごがはなせます", english: "I can speak English" }] },
    { id: "tsuchi", kanji: "土", onyomi: "ド、ト", kunyomi: "つち", meaning: "soil, earth, ground", examples: [{ sentence: "土曜日（どようび）に遊（あそ）びます", reading: "どようびにあそびます", english: "I play on Saturday" }, { sentence: "土（つち）の上（うえ）に座（すわ）ります", reading: "つちのうえにすわります", english: "I sit on the ground" }] },
    { id: "ki_tree", kanji: "木", onyomi: "ボク、モク", kunyomi: "き、こ", meaning: "tree, wood", examples: [{ sentence: "木（き）がたくさんあります", reading: "きがたくさんあります", english: "There are many trees" }, { sentence: "木曜日（もくようび）に試験（しけん）があります", reading: "もくようびにしけんがあります", english: "There is an exam on Thursday" }] },
    { id: "taberu", kanji: "食", onyomi: "ショク、ジキ", kunyomi: "た（べる）、く（う）", meaning: "eat, food", examples: [{ sentence: "ご飯（はん）を食（た）べます", reading: "ごはんをたべます", english: "I eat rice/meal" }, { sentence: "食べ物（たべもの）が好（す）きです", reading: "たべものがすきです", english: "I like food" }] },
    { id: "kuruma", kanji: "車", onyomi: "シャ", kunyomi: "くるま", meaning: "car, wheel", examples: [{ sentence: "車（くるま）で行（い）きます", reading: "くるまでいきます", english: "I go by car" }, { sentence: "彼女（かのじょ）は赤（あか）い車（くるま）を持（も）っています", reading: "かのじょはあかいくるまをもっています", english: "She has a red car" }] },
    { id: "nani", kanji: "何", onyomi: "カ", kunyomi: "なに、なん", meaning: "what", examples: [{ sentence: "何（なに）を食（た）べますか", reading: "なにをたべますか", english: "What will you eat?" }, { sentence: "何時（なんじ）ですか", reading: "なんじですか", english: "What time is it?" }] },
    { id: "minami", kanji: "南", onyomi: "ナン", kunyomi: "みなみ", meaning: "south", examples: [{ sentence: "南（みなみ）の方（ほう）へ行（い）きます", reading: "みなみのほうへいきます", english: "I go toward the south" }, { sentence: "南国（なんごく）の果物（くだもの）が好（す）きです", reading: "なんごくのくだものがすきです", english: "I like southern fruits" }] },
    { id: "man", kanji: "万", onyomi: "マン、バン", kunyomi: null, meaning: "ten thousand", examples: [{ sentence: "一万円（いちまんえん）です", reading: "いちまんえんです", english: "It's 10,000 yen" }, { sentence: "十万（じゅうまん）人（にん）がいます", reading: "じゅうまんにんがいます", english: "There are 100,000 people" }] },
    { id: "kou", kanji: "校", onyomi: "コウ", kunyomi: null, meaning: "school", examples: [{ sentence: "学校（がっこう）に行（い）きます", reading: "がっこうにいきます", english: "I go to school" }, { sentence: "高校（こうこう）の時（とき）に勉強（べんきょう）しました", reading: "こうこうのときにべんきょうしました", english: "I studied in high school" }] },
    { id: "mai", kanji: "毎", onyomi: "マイ", kunyomi: "ごと", meaning: "every", examples: [{ sentence: "毎日（まいにち）勉強（べんきょう）します", reading: "まいにちべんきょうします", english: "I study every day" }, { sentence: "毎週（まいしゅう）映画（えいが）を見（み）ます", reading: "まいしゅうえいがをみます", english: "I watch a movie every week" }] },
    { id: "shiro", kanji: "白", onyomi: "ハク、ビャク", kunyomi: "しろ（い）", meaning: "white", examples: [{ sentence: "白（しろ）い車（くるま）を持（も）っています", reading: "しろいくるまをもっています", english: "I have a white car" }, { sentence: "白雪（しらゆき）が降（ふ）りました", reading: "しらゆきがふりました", english: "White snow fell" }] },
    { id: "ten", kanji: "天", onyomi: "テン", kunyomi: "あまつ", meaning: "heavens, sky", examples: [{ sentence: "天気（てんき）がいいですね", reading: "てんきがいいですね", english: "The weather is nice" }, { sentence: "天国（てんごく）のような場所（ばしょ）です", reading: "てんごくのようなばしょです", english: "It's a heaven-like place" }] },
    { id: "haha", kanji: "母", onyomi: "ボ", kunyomi: "はは", meaning: "mother", examples: [{ sentence: "母（はは）は医者（いしゃ）です", reading: "はははいしゃです", english: "My mother is a doctor" }, { sentence: "お母（かあ）さん、ありがとう", reading: "おかあさん、ありがとう", english: "Thank you, Mom" }] },
    { id: "hi", kanji: "火", onyomi: "カ", kunyomi: "ひ、ほ", meaning: "fire", examples: [{ sentence: "火曜日（かようび）に会（あ）いましょう", reading: "かようびにあいましょう", english: "Let's meet on Tuesday" }, { sentence: "火（ひ）をつけてください", reading: "ひをつけてください", english: "Please light the fire" }] },
    { id: "migi", kanji: "右", onyomi: "ウ、ユウ", kunyomi: "みぎ", meaning: "right (direction)", examples: [{ sentence: "右（みぎ）に曲（ま）がってください", reading: "みぎにまがってください", english: "Please turn right" }, { sentence: "右手（みぎて）で書（か）きます", reading: "みぎてでかきます", english: "I write with my right hand" }] },
    { id: "yomu", kanji: "読", onyomi: "ドク、トク", kunyomi: "よ（む）", meaning: "to read", examples: [{ sentence: "本（ほん）を読（よ）みます", reading: "ほんをよみます", english: "I read a book" }, { sentence: "新聞（しんぶん）を読（よ）んでいます", reading: "しんぶんをよんでいます", english: "I am reading a newspaper" }] },
    { id: "tomo", kanji: "友", onyomi: "ユウ", kunyomi: "とも", meaning: "friend", examples: [{ sentence: "友達（ともだち）と遊（あそ）びます", reading: "ともだちとあそびます", english: "I play with my friend" }, { sentence: "親友（しんゆう）に会（あ）いました", reading: "しんゆうにあいました", english: "I met my best friend" }] },
    { id: "hidari", kanji: "左", onyomi: "サ、シャ", kunyomi: "ひだり", meaning: "left (direction)", examples: [{ sentence: "左（ひだり）に曲（ま）がってください", reading: "ひだりにまがってください", english: "Please turn left" }, { sentence: "左手（ひだりて）に時計（とけい）をしています", reading: "ひだりてにどけいをしています", english: "I wear a watch on my left hand" }] },
    { id: "yasumu", kanji: "休", onyomi: "キュウ", kunyomi: "やす（む）", meaning: "rest, day off", examples: [{ sentence: "日曜日（にちようび）は休（やす）みます", reading: "にちようびはやすみます", english: "I rest on Sunday" }, { sentence: "夏休（なつやす）みに旅行（りょこう）します", reading: "なつやすみにりょこうします", english: "I travel during summer vacation" }] },
    { id: "chichi", kanji: "父", onyomi: "フ", kunyomi: "ちち", meaning: "father", examples: [{ sentence: "父（ちち）は会社員（かいしゃいん）です", reading: "ちちはかいしゃいんです", english: "My father is a company employee" }, { sentence: "お父（とう）さん、お元気（げんき）ですか", reading: "おとうさん、おげんきですか", english: "How are you, Dad?" }] },
    { id: "ame", kanji: "雨", onyomi: "ウ", kunyomi: "あめ、あま", meaning: "rain", examples: [{ sentence: "雨（あめ）が降（ふ）っています", reading: "あめがふっています", english: "It is raining" }, { sentence: "雨（あめ）の日（ひ）は家（いえ）で過（す）ごします", reading: "あめのひはいえですごします", english: "I spend rainy days at home" }] },

    // ========== ADDITIONAL KANJI FROM APP DATA ==========
    { id: "asa", kanji: "朝", onyomi: "チョウ", kunyomi: "あさ", meaning: "morning", examples: [{ sentence: "毎朝（まいあさ）六時（ろくじ）に起（お）きます", reading: "まいあさろくじにおきます", english: "Every morning I wake up at 6 o'clock" }, { sentence: "朝（あさ）ごはんを食（た）べてから歯（は）を磨（みが）きます", reading: "あさごはんをたべてからはをみがきます", english: "After eating breakfast, I brush my teeth" }] },
    { id: "yoru", kanji: "夜", onyomi: "ヤ", kunyomi: "よる、よ", meaning: "night, evening", examples: [{ sentence: "夜（よる）十時（じゅうじ）に寝（ね）ます", reading: "よるじゅうじにねます", english: "I go to bed at 10 PM" }, { sentence: "夜（よる）遅（おそ）くまで勉強（べんきょう）しました", reading: "よるおそくまでべんきょうしました", english: "I studied late at night" }] },
    { id: "ne", kanji: "寝", onyomi: "シン", kunyomi: "ね（る）", meaning: "sleep, go to bed", examples: [{ sentence: "夜（よる）十時（じゅうじ）に寝（ね）ます", reading: "よるじゅうじにねます", english: "I go to bed at 10 PM" }, { sentence: "赤（あか）ちゃんは今（いま）寝（ね）ています", reading: "あかちゃんはいまねています", english: "The baby is sleeping now" }] },
    { id: "oku", kanji: "起", onyomi: "キ", kunyomi: "お（きる）", meaning: "wake up, get up", examples: [{ sentence: "毎朝（まいあさ）六時（ろくじ）に起（お）きます", reading: "まいあさろくじにおきます", english: "Every morning I wake up at 6 o'clock" }, { sentence: "朝（あさ）早（はや）く起（お）きました", reading: "あさはやくおきました", english: "I woke up early in the morning" }] },
    { id: "ha", kanji: "歯", onyomi: "シ", kunyomi: "は", meaning: "tooth", examples: [{ sentence: "歯（は）を磨（みが）きます", reading: "はをみがきます", english: "I brush my teeth" }, { sentence: "歯（は）が痛（いた）いので歯医者（はいしゃ）に行（い）きます", reading: "はがいたいのではいしゃにいきます", english: "I have a toothache, so I'll go to the dentist" }] },
    { id: "migaku", kanji: "磨", onyomi: "マ", kunyomi: "みが（く）", meaning: "brush, polish", examples: [{ sentence: "歯（は）を磨（みが）きます", reading: "はをみがきます", english: "I brush my teeth" }, { sentence: "毎朝（まいあさ）歯（は）を磨（みが）きます", reading: "まいあさはをみがきます", english: "I brush my teeth every morning" }] },
    { id: "kaisha", kanji: "会", onyomi: "カイ、エ", kunyomi: "あ（う）", meaning: "meet, company", examples: [{ sentence: "会社（かいしゃ）へ八時（はちじ）に行（い）きます", reading: "かいしゃへはちじにいきます", english: "I go to the office at 8 o'clock" }, { sentence: "友達（ともだち）に会（あ）いました", reading: "ともだちにあいました", english: "I met my friend" }] },
    { id: "toshokan", kanji: "図", onyomi: "ズ、ト", kunyomi: "はか（る）", meaning: "plan, diagram", examples: [{ sentence: "図書館（としょかん）で勉強（べんきょう）します", reading: "としょかんでべんきょうします", english: "I study at the library" }, { sentence: "この町（まち）には大（おお）きな図書館（としょかん）があります", reading: "このまちにはおおきなとしょかんがあります", english: "There is a big library in this town" }] },
    { id: "benkyou", kanji: "勉", onyomi: "ベン", kunyomi: "つと（める）", meaning: "exertion, endeavor", examples: [{ sentence: "図書館（としょかん）で勉強（べんきょう）します", reading: "としょかんでべんきょうします", english: "I study at the library" }, { sentence: "日本語（にほんご）を勉強（べんきょう）しています", reading: "にほんごをべんきょうしています", english: "I am studying Japanese" }] },
    { id: "hataraku", kanji: "働", onyomi: "ドウ", kunyomi: "はたら（く）", meaning: "work", examples: [{ sentence: "昨日（きのう）は十時間（じゅうじかん）働（はたら）きました", reading: "きのうはじゅうじかんはたらきました", english: "Yesterday I worked for 10 hours" }, { sentence: "毎日（まいにち）働（はたら）きます", reading: "まいにちはたらきます", english: "I work every day" }] },
    { id: "nichiyoubi", kanji: "曜", onyomi: "ヨウ", kunyomi: null, meaning: "weekday", examples: [{ sentence: "日曜日（にちようび）に映画（えいが）を見（み）ます", reading: "にちようびにえいがをみます", english: "I'll watch a movie on Sunday" }, { sentence: "月曜日（げつようび）に会（あ）いましょう", reading: "げつようびにあいましょう", english: "Let's meet on Monday" }] },
    { id: "eiga", kanji: "映", onyomi: "エイ", kunyomi: "うつ（る）、は（える）", meaning: "reflect, projection", examples: [{ sentence: "映画（えいが）を見（み）ます", reading: "えいがをみます", english: "I watch a movie" }, { sentence: "映画（えいが）が好（す）きです", reading: "えいががすきです", english: "I like movies" }] },
    { id: "kazoku", kanji: "族", onyomi: "ゾク", kunyomi: null, meaning: "family, tribe", examples: [{ sentence: "私（わたし）の家族（かぞく）は両親（りょうしん）と妹（いもうと）です", reading: "わたしのかぞくはりょうしんといもうとです", english: "My family is my parents and my younger sister" }, { sentence: "家族（かぞく）と一緒（いっしょ）に住（す）んでいます", reading: "かぞくといっしょにすんでいます", english: "I live with my family" }] },
    { id: "ryoushin", kanji: "両", onyomi: "リョウ", kunyomi: "てる", meaning: "both", examples: [{ sentence: "私（わたし）の家族（かぞく）は両親（りょうしん）と妹（いもうと）です", reading: "わたしのかぞくはりょうしんといもうとです", english: "My family is my parents and my younger sister" }, { sentence: "両親（りょうしん）は旅行（りょこう）が大好（だいす）きです", reading: "りょうしんはりょこうがだいすきです", english: "My parents love traveling" }] },
    { id: "imouto", kanji: "妹", onyomi: "マイ", kunyomi: "いもうと", meaning: "younger sister", examples: [{ sentence: "私（わたし）の家族（かぞく）は両親（りょうしん）と妹（いもうと）です", reading: "わたしのかぞくはりょうしんといもうとです", english: "My family is my parents and my younger sister" }, { sentence: "妹（いもうと）は小（ちい）さい時（とき）からピアノを弾（ひ）きます", reading: "いもうとはちいさいときからぴあのをひきます", english: "My younger sister has played piano since she was small" }] },
    { id: "ryouri", kanji: "料", onyomi: "リョウ", kunyomi: null, meaning: "fee, materials", examples: [{ sentence: "母（はは）は野菜（やさい）を切（き）りながら料理（りょうり）します", reading: "はははやさいをきりながらりょうりします", english: "My mother cooks while cutting vegetables" }, { sentence: "この料理（りょうり）は少（すこ）し辛（から）いです", reading: "このりょうりはすこしからいです", english: "This dish is a little spicy" }] },
    { id: "yasai", kanji: "菜", onyomi: "サイ", kunyomi: "な", meaning: "vegetable, greens", examples: [{ sentence: "母（はは）は野菜（やさい）を切（き）りながら料理（りょうり）します", reading: "はははやさいをきりながらりょうりします", english: "My mother cooks while cutting vegetables" }, { sentence: "野菜（やさい）が好（す）きですか", reading: "やさいがすきですか", english: "Do you like vegetables?" }] },
    { id: "kiru", kanji: "切", onyomi: "セツ、サイ", kunyomi: "き（る）", meaning: "cut, important", examples: [{ sentence: "母（はは）は野菜（やさい）を切（き）りながら料理（りょうり）します", reading: "はははやさいをきりながらりょうりします", english: "My mother cooks while cutting vegetables" }, { sentence: "切符（きっぷ）を買（か）います", reading: "きっぷをかいます", english: "I buy a ticket" }] },
    { id: "inu", kanji: "犬", onyomi: "ケン", kunyomi: "いぬ", meaning: "dog", examples: [{ sentence: "公園（こうえん）で小（ちい）さい犬（いぬ）を見（み）ました", reading: "こうえんでちいさいいぬをみました", english: "I saw a small dog in the park" }, { sentence: "犬（いぬ）が好（す）きです", reading: "いぬがすきです", english: "I like dogs" }] },
    { id: "machi", kanji: "町", onyomi: "チョウ", kunyomi: "まち", meaning: "town", examples: [{ sentence: "この町（まち）には大（おお）きな図書館（としょかん）があります", reading: "このまちにはおおきなとしょかんがあります", english: "There is a big library in this town" }, { sentence: "町（まち）で友達（ともだち）に会（あ）いました", reading: "まちでともだちにあいました", english: "I met my friend in town" }] },
    { id: "shinkansen", kanji: "新", onyomi: "シン", kunyomi: "あたら（しい）", meaning: "new", examples: [{ sentence: "新幹線（しんかんせん）は速（はや）いです", reading: "しんかんせんははやいです", english: "The Shinkansen is fast" }, { sentence: "新（あたら）しい隣人（りんじん）は親切（しんせつ）です", reading: "あたらしいりんじんはしんせつです", english: "The new neighbor is kind" }] },
    { id: "hayai", kanji: "速", onyomi: "ソク", kunyomi: "はや（い）", meaning: "fast", examples: [{ sentence: "新幹線（しんかんせん）は速（はや）いです", reading: "しんかんせんははやいです", english: "The Shinkansen is fast" }, { sentence: "速（はや）い電車（でんしゃ）に乗（の）ります", reading: "はやいでんしゃにのります", english: "I take a fast train" }] },
    { id: "furu", kanji: "降", onyomi: "コウ", kunyomi: "お（りる）、ふ（る）", meaning: "descend, precipitate", examples: [{ sentence: "雨（あめ）が降（ふ）りました", reading: "あめがふりました", english: "It rained" }, { sentence: "雪（ゆき）が降（ふ）っています", reading: "ゆきがふっています", english: "It is snowing" }] },
    { id: "shuumatsu", kanji: "末", onyomi: "マツ、バツ", kunyomi: "すえ", meaning: "end", examples: [{ sentence: "週末（しゅうまつ）は何（なに）をしますか", reading: "しゅうまつはなにをしますか", english: "What do you do on weekends?" }, { sentence: "週末（しゅうまつ）に映画（えいが）を見（み）ます", reading: "しゅうまつにえいがをみます", english: "I watch a movie on the weekend" }] },
    { id: "ongaku", kanji: "音", onyomi: "オン、イン", kunyomi: "おと、ね", meaning: "sound", examples: [{ sentence: "音楽（おんがく）を聞（き）きます", reading: "おんがくをききます", english: "I listen to music" }, { sentence: "音楽（おんがく）が好（す）きです", reading: "おんがくがすきです", english: "I like music" }] },
    { id: "sanpo", kanji: "散", onyomi: "サン", kunyomi: "ち（る）", meaning: "scatter", examples: [{ sentence: "散歩（さんぽ）します", reading: "さんぽします", english: "I take a walk" }, { sentence: "よく散歩（さんぽ）します", reading: "よくさんぽします", english: "I often take a walk" }] },
    { id: "natsu", kanji: "夏", onyomi: "カ、ゲ", kunyomi: "なつ", meaning: "summer", examples: [{ sentence: "夏（なつ）は冷（つめ）たいアイスクリームが一番（いちばん）好（す）きです", reading: "なつはつめたいあいすくりーむがいちばんすきです", english: "In summer, I like cold ice cream the most" }, { sentence: "夏（なつ）休（やす）みに旅行（りょこう）します", reading: "なつやすみにりょこうします", english: "I travel during summer vacation" }] },
    { id: "ocha", kanji: "茶", onyomi: "チャ、サ", kunyomi: "ちゃ", meaning: "tea", examples: [{ sentence: "コーヒー、紅茶（こうちゃ）、あとお茶（ちゃ）もあります", reading: "こーひー、こうちゃ、あとおちゃもあります", english: "Coffee, black tea, and also green tea" }, { sentence: "お茶（ちゃ）を飲（の）みます", reading: "おちゃをのみます", english: "I drink tea" }] },
    { id: "kagi", kanji: "鍵", onyomi: "ケン", kunyomi: "かぎ", meaning: "key", examples: [{ sentence: "鍵（かぎ）を忘（わす）れました", reading: "かぎをわすれました", english: "I forgot my key" }, { sentence: "鍵（かぎ）をかけました", reading: "かぎをかけました", english: "I locked it" }] },
    { id: "wasure", kanji: "忘", onyomi: "ボウ", kunyomi: "わす（れる）", meaning: "forget", examples: [{ sentence: "鍵（かぎ）を忘（わす）れました", reading: "かぎをわすれました", english: "I forgot my key" }, { sentence: "宿題（しゅくだい）を忘（わす）れました", reading: "しゅくだいをわすれました", english: "I forgot my homework" }] },
    { id: "heya", kanji: "部", onyomi: "ブ", kunyomi: "べ", meaning: "part, department", examples: [{ sentence: "部屋（へや）に入（はい）れません", reading: "へやにはいれません", english: "I can't enter the room" }, { sentence: "部屋（へや）が狭（せま）いです", reading: "へやがせまいです", english: "The room is small" }] },
    { id: "karai", kanji: "辛", onyomi: "シン", kunyomi: "から（い）", meaning: "spicy", examples: [{ sentence: "この料理（りょうり）は少（すこ）し辛（から）いです", reading: "このりょうりはすこしからいです", english: "This dish is a little spicy" }, { sentence: "辛（から）いものが好（す）きですか", reading: "からいものがすきですか", english: "Do you like spicy things?" }] },
    { id: "oishii", kanji: "美", onyomi: "ビ", kunyomi: "うつく（しい）", meaning: "beautiful", examples: [{ sentence: "この料理（りょうり）は美味（おい）しいです", reading: "このりょうりはおいしいです", english: "This dish is delicious" }, { sentence: "日本（にほん）は美（うつく）しい国（くに）です", reading: "にほんはうつくしいくにです", english: "Japan is a beautiful country" }] },
    { id: "yuubinkyoku", kanji: "郵", onyomi: "ユウ", kunyomi: null, meaning: "mail", examples: [{ sentence: "郵便局（ゆうびんきょく）があります", reading: "ゆうびんきょくがあります", english: "There is a post office" }, { sentence: "郵便局（ゆうびんきょく）で切手（きって）を買（か）いました", reading: "ゆうびんきょくできってをかいました", english: "I bought stamps at the post office" }] },
    { id: "byouin", kanji: "病", onyomi: "ビョウ、ヘイ", kunyomi: "や（む）", meaning: "ill, sick", examples: [{ sentence: "病院（びょういん）に行（い）きます", reading: "びょういんにいきます", english: "I go to the hospital" }, { sentence: "病院（びょういん）で診察（しんさつ）を受（う）けました", reading: "びょういんでしんさつをうけました", english: "I received a medical examination at the hospital" }] },
    { id: "kusuri", kanji: "薬", onyomi: "ヤク", kunyomi: "くすり", meaning: "medicine", examples: [{ sentence: "薬（くすり）を飲（の）みます", reading: "くすりをのみます", english: "I take medicine" }, { sentence: "薬（くすり）を飲（の）みましたか", reading: "くすりをのみましたか", english: "Did you take your medicine?" }] },

    // ========== ADDITIONAL COMMON KANJI (N3+) ==========
    { id: "atsui", kanji: "暑", onyomi: "ショ", kunyomi: "あつ（い）", meaning: "hot (weather)", examples: [{ sentence: "今日（きょう）はとても暑（あつ）いです", reading: "きょうはとてもあついです", english: "Today is very hot" }, { sentence: "暑（あつ）くて眠（ねむ）れません", reading: "あつくてねむれません", english: "It's so hot I can't sleep" }] },
    { id: "yasashii", kanji: "優", onyomi: "ユウ", kunyomi: "やさ（しい）", meaning: "gentle, kind", examples: [{ sentence: "彼女（かのじょ）は優（やさ）しいです", reading: "かのじょはやさしいです", english: "She is kind" }, { sentence: "優（やさ）しい人（ひと）です", reading: "やさしいひとです", english: "He is a kind person" }] },
    { id: "subarashii", kanji: "素", onyomi: "ソ、ス", kunyomi: "もと", meaning: "element, plain", examples: [{ sentence: "素晴（すば）らしいアイデアです", reading: "すばらしいあいであです", english: "That's a wonderful idea" }, { sentence: "素晴（すば）らしい天気（てんき）ですね", reading: "すばらしいてんきですね", english: "The weather is wonderful, isn't it?" }] },
    { id: "muzukashii", kanji: "難", onyomi: "ナン", kunyomi: "むずか（しい）", meaning: "difficult", examples: [{ sentence: "発音（はつおん）が難（むずか）しいです", reading: "はつおんがむずかしいです", english: "Pronunciation is difficult" }, { sentence: "日本語（にほんご）は難（むずか）しいですか", reading: "にほんごはむずかしいですか", english: "Is Japanese difficult?" }] },
    { id: "yasashii_easy", kanji: "易", onyomi: "エキ、イ", kunyomi: "やさ（しい）", meaning: "easy", examples: [{ sentence: "この問題（もんだい）は易（やさ）しいです", reading: "このもんだいはやさしいです", english: "This problem is easy" }, { sentence: "易（やさ）しい言葉（ことば）で説明（せつめい）してください", reading: "やさしいことばでせつめいしてください", english: "Please explain in easy words" }] },
    { id: "akarui", kanji: "明", onyomi: "メイ、ミョウ", kunyomi: "あか（るい）", meaning: "bright, clear", examples: [{ sentence: "明（あか）るい部屋（へや）", reading: "あかるいへや", english: "Bright room" }, { sentence: "明日（あした）は明（あか）るいですね", reading: "あしたはあかるいですね", english: "Tomorrow is bright, isn't it?" }] },
    { id: "kurai", kanji: "暗", onyomi: "アン", kunyomi: "くら（い）", meaning: "dark", examples: [{ sentence: "暗（くら）い部屋（へや）", reading: "くらいへや", english: "Dark room" }, { sentence: "外（そと）は暗（くら）いです", reading: "そとはくらいです", english: "It's dark outside" }] },
    { id: "atatakai", kanji: "温", onyomi: "オン", kunyomi: "あたた（かい）", meaning: "warm", examples: [{ sentence: "温（あたた）かいお茶（ちゃ）", reading: "あたたかいおちゃ", english: "Warm tea" }, { sentence: "今日（きょう）は温（あたた）かいですね", reading: "きょうはあたたかいですね", english: "Today is warm, isn't it?" }] },
    { id: "tsumetai", kanji: "冷", onyomi: "レイ", kunyomi: "つめ（たい）", meaning: "cold (to touch)", examples: [{ sentence: "冷（つめ）たい飲（の）み物（もの）", reading: "つめたいのみもの", english: "Cold drink" }, { sentence: "夏（なつ）は冷（つめ）たいアイスクリームが一番（いちばん）好（す）きです", reading: "なつはつめたいあいすくりーむがいちばんすきです", english: "In summer, I like cold ice cream the most" }] },
    { id: "samui", kanji: "寒", onyomi: "カン", kunyomi: "さむ（い）", meaning: "cold (weather)", examples: [{ sentence: "今日（きょう）は寒（さむ）いです", reading: "きょうはさむいです", english: "Today is cold" }, { sentence: "冬（ふゆ）は寒（さむ）いです", reading: "ふゆはさむいです", english: "Winter is cold" }] },
    { id: "omoshiroi", kanji: "面", onyomi: "メン", kunyomi: "おも、つら", meaning: "face, surface", examples: [{ sentence: "面白（おもしろ）い映画（えいが）", reading: "おもしろいえいが", english: "Interesting movie" }, { sentence: "面白（おもしろ）い本（ほん）を読（よ）みました", reading: "おもしろいほんをよみました", english: "I read an interesting book" }] },
    { id: "nigiyaka", kanji: "賑", onyomi: "シン", kunyomi: "にぎ（わう）", meaning: "bustling", examples: [{ sentence: "賑（にぎ）やかな街（まち）", reading: "にぎやかなまち", english: "Lively town" }, { sentence: "東京（とうきょう）は賑（にぎ）やかな街（まち）です", reading: "とうきょうはにぎやかなまちです", english: "Tokyo is a lively city" }] },
    { id: "shizuka", kanji: "静", onyomi: "セイ、ジョウ", kunyomi: "しず（か）", meaning: "quiet", examples: [{ sentence: "静（しず）かな場所（ばしょ）", reading: "しずかなばしょ", english: "Quiet place" }, { sentence: "この辺（へん）は静（しず）かです", reading: "このへんはしずかです", english: "This area is quiet" }] },
    { id: "yuumei", kanji: "有", onyomi: "ユウ、ウ", kunyomi: "あ（る）", meaning: "to have, exist", examples: [{ sentence: "有名（ゆうめい）なレストラン", reading: "ゆうめいなれすとらん", english: "Famous restaurant" }, { sentence: "有名（ゆうめい）な人（ひと）", reading: "ゆうめいなひと", english: "Famous person" }] },
    { id: "shinsetsu", kanji: "親", onyomi: "シン", kunyomi: "おや、した（しい）", meaning: "parent, intimate", examples: [{ sentence: "親切（しんせつ）な人（ひと）", reading: "しんせつなひと", english: "Kind person" }, { sentence: "店員（てんいん）さんは親切（しんせつ）でした", reading: "てんいんさんはしんせつでした", english: "The clerk was kind" }] },
    { id: "benri", kanji: "便", onyomi: "ベン、ビン", kunyomi: "たよ（り）", meaning: "convenience", examples: [{ sentence: "便利（べんり）な電車（でんしゃ）", reading: "べんりなでんしゃ", english: "Convenient train" }, { sentence: "このアプリは便利（べんり）です", reading: "このあぷりはべんりです", english: "This app is convenient" }] },
    { id: "fuben", kanji: "不", onyomi: "フ、ブ", kunyomi: null, meaning: "not, un-", examples: [{ sentence: "不便（ふべん）な場所（ばしょ）", reading: "ふべんなばしょ", english: "Inconvenient place" }, { sentence: "田舎（いなか）は不便（ふべん）です", reading: "いなかはふべんです", english: "The countryside is inconvenient" }] },
    { id: "taisetsu", kanji: "大", onyomi: "ダイ、タイ", kunyomi: "おお（きい）", meaning: "large, important", examples: [{ sentence: "大切（たいせつ）な人（ひと）", reading: "たいせつなひと", english: "Important person" }, { sentence: "よく寝（ね）ることが大切（たいせつ）です", reading: "よくねることがたいせつです", english: "Getting enough sleep is important" }] },
    { id: "hitsuyou", kanji: "必", onyomi: "ヒツ", kunyomi: "かなら（ず）", meaning: "certainly, necessarily", examples: [{ sentence: "必要（ひつよう）なもの", reading: "ひつようなもの", english: "Necessary thing" }, { sentence: "手術（しゅじゅつ）が必要（ひつよう）です", reading: "しゅじゅつがひつようです", english: "Surgery is necessary" }] },
    { id: "jiyuu", kanji: "自", onyomi: "ジ、シ", kunyomi: "みずか（ら）", meaning: "self", examples: [{ sentence: "自由（じゆう）な時間（じかん）", reading: "じゆうなじかん", english: "Free time" }, { sentence: "自由（じゆう）に使（つか）えます", reading: "じゆうにつかえます", english: "You can use it freely" }] },
    { id: "shiawase", kanji: "幸", onyomi: "コウ", kunyomi: "さいわ（い）", meaning: "happiness", examples: [{ sentence: "幸（しあわ）せな生活（せいかつ）", reading: "しあわせなせいかつ", english: "Happy life" }, { sentence: "幸（しあわ）せですか", reading: "しあわせですか", english: "Are you happy?" }] },
    { id: "joubu", kanji: "丈", onyomi: "ジョウ", kunyomi: "たけ", meaning: "height, length", examples: [{ sentence: "丈夫（じょうぶ）な鞄（かばん）", reading: "じょうぶなかばん", english: "Durable bag" }, { sentence: "この鞄（かばん）は丈夫（じょうぶ）です", reading: "このかばんはじょうぶです", english: "This bag is durable" }] },
    { id: "majime", kanji: "真", onyomi: "シン", kunyomi: "ま", meaning: "true, reality", examples: [{ sentence: "真面目（まじめ）な人（ひと）", reading: "まじめなひと", english: "Serious person" }, { sentence: "彼（かれ）は真面目（まじめ）な人間（にんげん）です", reading: "かれはまじめなにんげんです", english: "He is a serious person" }] },

    // ========== NEWLY ADDED MISSING KANJI ==========
    // From wordDict, sentences, and other app data
    
    // Drink - appears everywhere
    { id: "nomu", kanji: "飲", onyomi: "イン", kunyomi: "の（む）", meaning: "drink", examples: [{ sentence: "水（みず）を飲（の）みます", reading: "みずをのみます", english: "I drink water" }, { sentence: "毎日（まいにち）コーヒーを飲（の）みます", reading: "まいにちこーひーをのみます", english: "I drink coffee every day" }] },
    
    // Thing/object
    { id: "mono", kanji: "物", onyomi: "ブツ、モツ", kunyomi: "もの", meaning: "thing, object", examples: [{ sentence: "飲（の）み物（もの）を買（か）いにコンビニへ行（い）きます", reading: "のみものをかいにこんびにへいきます", english: "I go to the convenience store to buy a drink" }, { sentence: "食べ物（たべもの）が好（す）きです", reading: "たべものがすきです", english: "I like food" }] },
    
    // Goods/article
    { id: "shina", kanji: "品", onyomi: "ヒン", kunyomi: "しな", meaning: "goods, article", examples: [{ sentence: "商品（しょうひん）を買（か）いました", reading: "しょうひんをかいました", english: "I bought a product" }, { sentence: "この商品（しょうひん）はお値打（ねう）ちです", reading: "このしょうひんはおねうちです", english: "This product is a good value" }] },
    
    // Sell
    { id: "uru", kanji: "売", onyomi: "バイ", kunyomi: "う（る）", meaning: "sell", examples: [{ sentence: "売（う）り切（き）れました", reading: "うりきれました", english: "It's sold out" }, { sentence: "この店（みせ）は魚（さかな）を売（う）っています", reading: "このみせはさかなをうっています", english: "This shop sells fish" }] },
    
    // Make
    { id: "tsukuru", kanji: "作", onyomi: "サク、サ", kunyomi: "つく（る）", meaning: "make", examples: [{ sentence: "料理（りょうり）を作（つく）ります", reading: "りょうりをつくります", english: "I make a dish" }, { sentence: "何（なに）を作（つく）っていますか", reading: "なにをつくっていますか", english: "What are you making?" }] },
    
    // Use
    { id: "tsukau", kanji: "使", onyomi: "シ", kunyomi: "つか（う）", meaning: "use", examples: [{ sentence: "このペンを使（つか）います", reading: "このぺんをつかいます", english: "I use this pen" }, { sentence: "クレジットカードは使（つか）えますか", reading: "くれじっとかーどはつかえますか", english: "Can I use a credit card?" }] },
    
    // Cross/hand over
    { id: "wataru", kanji: "渡", onyomi: "ト", kunyomi: "わた（る）、わた（す）", meaning: "cross, hand over", examples: [{ sentence: "交差点（こうさてん）を渡（わた）ります", reading: "こうさてんをわたります", english: "I cross the intersection" }, { sentence: "資料（しりょう）を渡（わた）しました", reading: "しりょうをわたしました", english: "I handed over the documents" }] },
    
    // Turn
    { id: "magaru", kanji: "曲", onyomi: "キョク", kunyomi: "ま（がる）", meaning: "turn, bend", examples: [{ sentence: "右（みぎ）に曲（ま）がってください", reading: "みぎにまがってください", english: "Please turn right" }, { sentence: "角（かど）を曲（ま）がりました", reading: "かどをまがりました", english: "I turned the corner" }] },
    
    // Stop
    { id: "tomaru", kanji: "止", onyomi: "シ", kunyomi: "と（まる）、と（める）", meaning: "stop", examples: [{ sentence: "ここで止（と）まってください", reading: "ここでとまってください", english: "Please stop here" }, { sentence: "雨（あめ）が止（や）みました", reading: "あめがやみました", english: "The rain stopped" }] },
    
    // Bathe
    { id: "abiru", kanji: "浴", onyomi: "ヨク", kunyomi: "あ（びる）", meaning: "bathe, shower", examples: [{ sentence: "シャワーを浴（あ）びます", reading: "しゃわーをあびます", english: "I take a shower" }, { sentence: "毎朝（まいあさ）シャワーを浴（あ）びます", reading: "まいあさしゃわーをあびます", english: "I take a shower every morning" }] },
    
    // Wash
    { id: "arau", kanji: "洗", onyomi: "セン", kunyomi: "あら（う）", meaning: "wash", examples: [{ sentence: "手（て）を洗（あら）います", reading: "てをあらいます", english: "I wash my hands" }, { sentence: "洗濯（せんたく）をします", reading: "せんたくをします", english: "I do laundry" }] },
    
    // Practice
    { id: "renshuu", kanji: "練", onyomi: "レン", kunyomi: "ね（る）", meaning: "practice, train", examples: [{ sentence: "練習（れんしゅう）します", reading: "れんしゅうします", english: "I practice" }, { sentence: "毎日（まいにち）練習（れんしゅう）します", reading: "まいにちれんしゅうします", english: "I practice every day" }] },
    
    // Work
    { id: "shigoto", kanji: "仕", onyomi: "シ、ジ", kunyomi: "つか（える）", meaning: "serve, work", examples: [{ sentence: "仕事（しごと）をします", reading: "しごとをします", english: "I work" }, { sentence: "仕事（しごと）が終（お）わりました", reading: "しごとがおわりました", english: "Work is finished" }] },
    
    // Marry
    { id: "kekkon", kanji: "結", onyomi: "ケツ", kunyomi: "むす（ぶ）", meaning: "tie, bind", examples: [{ sentence: "結婚（けっこん）します", reading: "けっこんします", english: "I get married" }, { sentence: "来年（らいねん）結婚（けっこん）します", reading: "らいねんけっこんします", english: "I'll get married next year" }] },
    
    // Drive
    { id: "unten", kanji: "運", onyomi: "ウン", kunyomi: "はこ（ぶ）", meaning: "carry, transport", examples: [{ sentence: "運転（うんてん）します", reading: "うんてんします", english: "I drive" }, { sentence: "車（くるま）を運転（うんてん）します", reading: "くるまをうんてんします", english: "I drive a car" }] },
    
    // Turn (rotate)
    { id: "ten", kanji: "転", onyomi: "テン", kunyomi: "ころ（がる）", meaning: "turn, revolve", examples: [{ sentence: "転（ころ）びました", reading: "ころびました", english: "I fell over" }, { sentence: "事故（じこ）で転（ころ）びました", reading: "じこでころびました", english: "I fell in the accident" }] },
    
    // Phone/talk
    { id: "wa", kanji: "話", onyomi: "ワ", kunyomi: "はな（す）", meaning: "talk, speak", examples: [{ sentence: "電話（でんわ）をします", reading: "でんわをします", english: "I make a phone call" }, { sentence: "日本語（にほんご）を話（はな）します", reading: "にほんごをはなします", english: "I speak Japanese" }] },
    
    // Promise
    { id: "yakusoku", kanji: "約", onyomi: "ヤク", kunyomi: "つづ（まる）", meaning: "promise, approximately", examples: [{ sentence: "約束（やくそく）します", reading: "やくそくします", english: "I promise" }, { sentence: "約束（やくそく）を守（まも）ります", reading: "やくそくをまもります", english: "I keep a promise" }] },
    
    // Promise (bundle)
    { id: "soku", kanji: "束", onyomi: "ソク", kunyomi: "たば", meaning: "bundle, bind", examples: [{ sentence: "約束（やくそく）をします", reading: "やくそくをします", english: "I promise" }, { sentence: "束（たば）ねます", reading: "たばねます", english: "I bundle" }] },
    
    // Counter for flat objects
    { id: "mai", kanji: "枚", onyomi: "マイ", kunyomi: null, meaning: "counter for flat objects", examples: [{ sentence: "五枚（ごまい）ください", reading: "ごまいください", english: "Please give me five (flat objects)" }, { sentence: "紙（かみ）を一枚（いちまい）ください", reading: "かみをいちまいください", english: "Please give me one sheet of paper" }] },
    
    // Counter for cups
    { id: "hai", kanji: "杯", onyomi: "ハイ", kunyomi: "さかずき", meaning: "counter for cups/glasses", examples: [{ sentence: "コーヒーを二杯（にはい）飲（の）みます", reading: "こーひーをにはいのみます", english: "I drink two cups of coffee" }, { sentence: "一杯（いっぱい）ください", reading: "いっぱいください", english: "Please give me one cup" }] },
    
    // Counter for times
    { id: "kai", kanji: "回", onyomi: "カイ", kunyomi: "まわ（る）", meaning: "counter for times, turn", examples: [{ sentence: "三回（さんかい）行（い）きました", reading: "さんかいいきました", english: "I went three times" }, { sentence: "もう一度（いちど）お願（ねが）いします", reading: "もういちどおねがいします", english: "Please do it one more time" }] },
    
    // Second (time)
    { id: "byou", kanji: "秒", onyomi: "ビョウ", kunyomi: null, meaning: "second", examples: [{ sentence: "十秒（じゅうびょう）で終（お）わります", reading: "じゅうびょうでおわります", english: "It finishes in 10 seconds" }, { sentence: "一分（いっぷん）は六十秒（ろくじゅうびょう）です", reading: "いっぷんはろくじゅうびょうです", english: "One minute is 60 seconds" }] },
    
    // Wind
    { id: "kaze", kanji: "風", onyomi: "フウ、フ", kunyomi: "かぜ", meaning: "wind, style", examples: [{ sentence: "風（かぜ）が強（つよ）いです", reading: "かぜがつよいです", english: "The wind is strong" }, { sentence: "風邪（かぜ）を引（ひ）きました", reading: "かぜをひきました", english: "I caught a cold" }] },
    
    // Counter/typhoon
    { id: "dai", kanji: "台", onyomi: "ダイ", kunyomi: "うてな", meaning: "counter for machines, pedestal", examples: [{ sentence: "台風（たいふう）が来（き）ています", reading: "たいふうがきています", english: "A typhoon is coming" }, { sentence: "一台（いちだい）の車（くるま）", reading: "いちだいのくるま", english: "One car" }] },
    
    // Star
    { id: "hoshi", kanji: "星", onyomi: "セイ、ショウ", kunyomi: "ほし", meaning: "star", examples: [{ sentence: "星（ほし）が綺麗（きれい）です", reading: "ほしがきれいです", english: "The stars are beautiful" }, { sentence: "星（ほし）を見（み）ます", reading: "ほしをみます", english: "I look at the stars" }] },
    
    // Sun (great)
    { id: "taiyou", kanji: "太", onyomi: "タイ、タ", kunyomi: "ふと（い）", meaning: "thick, great", examples: [{ sentence: "太陽（たいよう）が昇（のぼ）ります", reading: "たいようがのぼります", english: "The sun rises" }, { sentence: "太陽（たいよう）が明（あか）るいです", reading: "たいようがあかるいです", english: "The sun is bright" }] },
    
    // Sun (yang)
    { id: "you", kanji: "陽", onyomi: "ヨウ", kunyomi: "ひ", meaning: "sun, positive", examples: [{ sentence: "太陽（たいよう）が昇（のぼ）ります", reading: "たいようがのぼります", english: "The sun rises" }, { sentence: "陽（ひ）が当（あ）たります", reading: "ひがあたります", english: "The sun shines on it" }] },
    
    // Face
    { id: "kao", kanji: "顔", onyomi: "ガン", kunyomi: "かお", meaning: "face", examples: [{ sentence: "顔（かお）を洗（あら）います", reading: "かおをあらいます", english: "I wash my face" }, { sentence: "彼女（かのじょ）の顔（かお）が好（す）きです", reading: "かのじょのかおがすきです", english: "I like her face" }] },
    
    // Nose
    { id: "hana", kanji: "鼻", onyomi: "ビ", kunyomi: "はな", meaning: "nose", examples: [{ sentence: "鼻（はな）が高（たか）いです", reading: "はながたかいです", english: "The nose is high" }, { sentence: "鼻（はな）が詰（つ）まっています", reading: "はながつまっています", english: "My nose is stuffed" }] },
    
    // Arm
    { id: "ude", kanji: "腕", onyomi: "ワン", kunyomi: "うで", meaning: "arm", examples: [{ sentence: "腕（うで）を上（あ）げます", reading: "うでをあげます", english: "I raise my arm" }, { sentence: "腕（うで）が痛（いた）いです", reading: "うでがいたいです", english: "My arm hurts" }] },
    
    // Shoulder
    { id: "kata", kanji: "肩", onyomi: "ケン", kunyomi: "かた", meaning: "shoulder", examples: [{ sentence: "肩（かた）が凝（こ）ります", reading: "かたがこります", english: "My shoulders are stiff" }, { sentence: "肩（かた）を揉（も）みます", reading: "かたをもみます", english: "I massage my shoulders" }] },
    
    // Back
    { id: "se", kanji: "背", onyomi: "ハイ", kunyomi: "せ、せ（い）", meaning: "height, back", examples: [{ sentence: "背（せ）が高（たか）いです", reading: "せがたかいです", english: "I am tall" }, { sentence: "背（せ）中（なか）が痛（いた）いです", reading: "せなかがいたいです", english: "My back hurts" }] },
    
    // Stomach
    { id: "onaka", kanji: "腹", onyomi: "フク", kunyomi: "はら", meaning: "belly, abdomen", examples: [{ sentence: "お腹（なか）が空（す）きました", reading: "おなかがすきました", english: "I'm hungry" }, { sentence: "お腹（なか）が痛（いた）いです", reading: "おなかがいたいです", english: "I have a stomachache" }] },
    
    // Organ
    { id: "zou", kanji: "臓", onyomi: "ゾウ", kunyomi: null, meaning: "internal organ", examples: [{ sentence: "心臓（しんぞう）が強（つよ）いです", reading: "しんぞうがつよいです", english: "My heart is strong" }, { sentence: "心臓（しんぞう）の病気（びょうき）", reading: "しんぞうのびょうき", english: "Heart disease" }] },
    
    // Hair
    { id: "kami", kanji: "髪", onyomi: "ハツ", kunyomi: "かみ", meaning: "hair", examples: [{ sentence: "髪（かみ）を切（き）ります", reading: "かみをきります", english: "I cut my hair" }, { sentence: "髪（かみ）が長（なが）いです", reading: "かみがながいです", english: "My hair is long" }] },
    
    // Fever
    { id: "netsu", kanji: "熱", onyomi: "ネツ", kunyomi: "あつ（い）", meaning: "heat, fever", examples: [{ sentence: "熱（ねつ）があります", reading: "ねつがあります", english: "I have a fever" }, { sentence: "熱（ねつ）が下（さ）がりました", reading: "ねつがさがりました", english: "The fever went down" }] },
    
    // Rescue
    { id: "kyuu", kanji: "救", onyomi: "キュウ", kunyomi: "すく（う）", meaning: "rescue, save", examples: [{ sentence: "救急車（きゅうきゅうしゃ）を呼（よ）びます", reading: "きゅうきゅうしゃをよびます", english: "I call an ambulance" }, { sentence: "命（いのち）を救（すく）いました", reading: "いのちをすくいました", english: "I saved a life" }] },
    
    // Emergency
    { id: "kyuu2", kanji: "急", onyomi: "キュウ", kunyomi: "いそ（ぐ）", meaning: "urgent, sudden", examples: [{ sentence: "救急車（きゅうきゅうしゃ）", reading: "きゅうきゅうしゃ", english: "Ambulance" }, { sentence: "急（いそ）いでください", reading: "いそいでください", english: "Please hurry" }] },
    
    // Washer
    { id: "sen", kanji: "洗", onyomi: "セン", kunyomi: "あら（う）", meaning: "wash", examples: [{ sentence: "洗濯機（せんたくき）を回（まわ）します", reading: "せんたくきをまわします", english: "I run the washing machine" }, { sentence: "洗濯（せんたく）をします", reading: "せんたくをします", english: "I do laundry" }] },
    
    // Wash (rinse)
    { id: "taku", kanji: "濯", onyomi: "タク", kunyomi: "すすぐ", meaning: "rinse, wash", examples: [{ sentence: "洗濯（せんたく）をします", reading: "せんたくをします", english: "I do laundry" }, { sentence: "洗濯機（せんたくき）", reading: "せんたくき", english: "Washing machine" }] },
    
    // Sweep
    { id: "sou", kanji: "掃", onyomi: "ソウ", kunyomi: "は（く）", meaning: "sweep, clean", examples: [{ sentence: "掃除機（そうじき）をかけます", reading: "そうじきをかけます", english: "I vacuum" }, { sentence: "部屋（へや）を掃除（そうじ）します", reading: "へやをそうじします", english: "I clean the room" }] },
    
    // Remove
    { id: "jo", kanji: "除", onyomi: "ジョ", kunyomi: "のぞ（く）", meaning: "remove, exclude", examples: [{ sentence: "掃除機（そうじき）", reading: "そうじき", english: "Vacuum cleaner" }, { sentence: "邪魔（じゃま）を除（のぞ）きます", reading: "じゃまをのぞきます", english: "I remove the obstacle" }] },
    
    // Refrigerator (cold)
    { id: "rei", kanji: "冷", onyomi: "レイ", kunyomi: "つめ（たい）、ひ（える）", meaning: "cold, cool", examples: [{ sentence: "冷蔵庫（れいぞうこ）に牛乳（ぎゅうにゅう）があります", reading: "れいぞうこにぎゅうにゅうがあります", english: "There is milk in the refrigerator" }, { sentence: "冷（つめ）たい飲（の）み物（もの）", reading: "つめたいのみもの", english: "Cold drink" }] },
    
    // Store/warehouse
    { id: "souko", kanji: "蔵", onyomi: "ゾウ", kunyomi: "くら", meaning: "storehouse, warehouse", examples: [{ sentence: "冷蔵庫（れいぞうこ）", reading: "れいぞうこ", english: "Refrigerator" }, { sentence: "蔵（くら）に保管（ほかん）します", reading: "くらにほかんします", english: "I store it in the warehouse" }] },
    
    // Field
    { id: "ya", kanji: "野", onyomi: "ヤ", kunyomi: "の", meaning: "field, plain", examples: [{ sentence: "野球（やきゅう）が好（す）きです", reading: "やきゅうがすきです", english: "I like baseball" }, { sentence: "野原（のはら）を走（はし）ります", reading: "のはらをはしります", english: "I run through the field" }] },
    
    // Ball
    { id: "kyuu3", kanji: "球", onyomi: "キュウ", kunyomi: "たま", meaning: "ball, sphere", examples: [{ sentence: "野球（やきゅう）", reading: "やきゅう", english: "Baseball" }, { sentence: "地球（ちきゅう）は丸（まる）いです", reading: "ちきゅうはまるいです", english: "The Earth is round" }] },
    
    // Copy
    { id: "sha", kanji: "写", onyomi: "シャ", kunyomi: "うつ（す）", meaning: "copy, photograph", examples: [{ sentence: "写真（しゃしん）を撮（と）ります", reading: "しゃしんをとります", english: "I take a photo" }, { sentence: "写（うつ）します", reading: "うつします", english: "I copy" }] },
    
    // Truth/reality
    { id: "shin", kanji: "真", onyomi: "シン", kunyomi: "ま", meaning: "true, reality", examples: [{ sentence: "真面目（まじめ）な人（ひと）", reading: "まじめなひと", english: "Serious person" }, { sentence: "本当（ほんとう）ですか", reading: "ほんとうですか", english: "Is it true?" }] },
    
    // Take photo
    { id: "toru", kanji: "撮", onyomi: "サツ", kunyomi: "と（る）", meaning: "take (photo), film", examples: [{ sentence: "写真（しゃしん）を撮（と）ります", reading: "しゃしんをとります", english: "I take a photo" }, { sentence: "映画（えいが）を撮（と）ります", reading: "えいがをとります", english: "I film a movie" }] },
    
    // Dance
    { id: "odoru", kanji: "踊", onyomi: "ヨウ", kunyomi: "おど（る）", meaning: "dance", examples: [{ sentence: "ダンスを踊（おど）ります", reading: "だんすをおどります", english: "I dance" }, { sentence: "上手（じょうず）に踊（おど）ります", reading: "じょうずにおどります", english: "I dance well" }] },
    
    // Draw
    { id: "kaku2", kanji: "描", onyomi: "ビョウ", kunyomi: "えが（く）、か（く）", meaning: "draw, paint", examples: [{ sentence: "絵（え）を描（か）きます", reading: "えをかきます", english: "I draw a picture" }, { sentence: "絵（え）を描（えが）きます", reading: "えをえがきます", english: "I paint a picture" }] },
    
    // Request
    { id: "tanomu", kanji: "頼", onyomi: "ライ", kunyomi: "たの（む）", meaning: "request, rely on", examples: [{ sentence: "助（たす）けを頼（たの）みます", reading: "たすけをたのみます", english: "I ask for help" }, { sentence: "友達（ともだち）に頼（たの）みました", reading: "ともだちにたのみました", english: "I asked my friend" }] },
    
    // Match/competition
    { id: "shiai", kanji: "試", onyomi: "シ", kunyomi: "こころ（みる）", meaning: "test, try", examples: [{ sentence: "試合（しあい）に勝（か）ちます", reading: "しあいにかちます", english: "I win the match" }, { sentence: "試験（しけん）があります", reading: "しけんがあります", english: "There is an exam" }] },
    
    // Win
    { id: "katsu", kanji: "勝", onyomi: "ショウ", kunyomi: "か（つ）", meaning: "win", examples: [{ sentence: "試合（しあい）に勝（か）ちました", reading: "しあいにかちました", english: "I won the match" }, { sentence: "勝（か）つことが大切（たいせつ）です", reading: "かつことがたいせつです", english: "Winning is important" }] },
    
    // Lose
    { id: "makeru", kanji: "負", onyomi: "フ", kunyomi: "ま（ける）", meaning: "lose, negative", examples: [{ sentence: "ゲームに負（ま）けました", reading: "げーむにまけました", english: "I lost the game" }, { sentence: "負（ま）けないでください", reading: "まけないでください", english: "Please don't give up" }] },
    
    // Examine
    { id: "shin", kanji: "診", onyomi: "シン", kunyomi: "み（る）", meaning: "diagnose, examine", examples: [{ sentence: "診察（しんさつ）を受けます", reading: "しんさつをうけます", english: "I receive a medical examination" }, { sentence: "医者（いしゃ）に診（み）てもらいました", reading: "いしゃにみてもらいました", english: "I had a doctor examine me" }] },
    
    // Injection
    { id: "shin", kanji: "針", onyomi: "シン", kunyomi: "はり", meaning: "needle", examples: [{ sentence: "注射（ちゅうしゃ）をします", reading: "ちゅうしゃをします", english: "I get an injection" }, { sentence: "針（はり）が痛（いた）い", reading: "はりがいたい", english: "The needle hurts" }] },
    
    // Shoot
    { id: "sha2", kanji: "射", onyomi: "シャ", kunyomi: "い（る）", meaning: "shoot", examples: [{ sentence: "注射（ちゅうしゃ）をします", reading: "ちゅうしゃをします", english: "I get an injection" }, { sentence: "矢（や）を射（い）ます", reading: "やをいます", english: "I shoot an arrow" }] },
    
    // Health
    { id: "kou", kanji: "康", onyomi: "コウ", kunyomi: null, meaning: "healthy", examples: [{ sentence: "健康（けんこう）のために運動（うんどう）します", reading: "けんこうのためにうんどうします", english: "I exercise for my health" }, { sentence: "健康（けんこう）が一番（いちばん）です", reading: "けんこうがいちばんです", english: "Health is the most important" }] },
    
    // Suitable
    { id: "teki", kanji: "適", onyomi: "テキ", kunyomi: "かな（う）", meaning: "suitable, appropriate", examples: [{ sentence: "適当（てきとう）な例（れい）", reading: "てきとうなれい", english: "Appropriate example" }, { sentence: "適切（てきせつ）な言葉（ことば）", reading: "てきせつなことば", english: "Appropriate words" }] },
    
    // Plant
    { id: "ueru", kanji: "植", onyomi: "ショク", kunyomi: "う（える）", meaning: "plant", examples: [{ sentence: "庭（にわ）に木（き）を植（う）えました", reading: "にわにきをうえました", english: "I planted a tree in the garden" }, { sentence: "花（はな）を植（う）えます", reading: "はなをうえます", english: "I plant flowers" }] },
    
    // Close
    { id: "shimeru", kanji: "閉", onyomi: "ヘイ", kunyomi: "と（じる）、し（める）", meaning: "close, shut", examples: [{ sentence: "ドアを閉（し）めます", reading: "どあをしめます", english: "I close the door" }, { sentence: "カーテンを閉（し）めます", reading: "かーてんをしめます", english: "I close the curtains" }] },
    
    // Dry
    { id: "hosu", kanji: "干", onyomi: "カン", kunyomi: "ほ（す）", meaning: "dry", examples: [{ sentence: "洗濯物（せんたくもの）を干（ほ）します", reading: "せんたくものをほします", english: "I hang the laundry to dry" }, { sentence: "布団（ふとん）を干（ほ）します", reading: "ふとんをほします", english: "I air out the futon" }] },
    
    // Remain
    { id: "nokoru", kanji: "残", onyomi: "ザン", kunyomi: "のこ（る）", meaning: "remain, left over", examples: [{ sentence: "残業（ざんぎょう）をします", reading: "ざんぎょうをします", english: "I work overtime" }, { sentence: "食べ物（たべもの）が残（のこ）りました", reading: "たべものがのこりました", english: "Food is left over" }] },
    
    // Work (business)
    { id: "gyou", kanji: "業", onyomi: "ギョウ、ゴウ", kunyomi: "わざ", meaning: "work, business, industry", examples: [{ sentence: "残業（ざんぎょう）をします", reading: "ざんぎょうをします", english: "I work overtime" }, { sentence: "授業（じゅぎょう）が終（お）わりました", reading: "じゅぎょうがおわりました", english: "Class ended" }] },
    
    // Discussion
    { id: "gi", kanji: "議", onyomi: "ギ", kunyomi: null, meaning: "discussion, deliberation", examples: [{ sentence: "会議（かいぎ）があります", reading: "かいぎがあります", english: "There is a meeting" }, { sentence: "会議（かいぎ）に出席（しゅっせき）します", reading: "かいぎにしゅっせきします", english: "I attend the meeting" }] },
    
    // End
    { id: "owaru", kanji: "終", onyomi: "シュウ", kunyomi: "お（わる）", meaning: "end, finish", examples: [{ sentence: "仕事（しごと）が終（お）わりました", reading: "しごとがおわりました", english: "Work is finished" }, { sentence: "授業（じゅぎょう）が終（お）わりました", reading: "じゅぎょうがおわりました", english: "Class ended" }] },
    
    // Report
    { id: "houkoku", kanji: "報", onyomi: "ホウ", kunyomi: "むく（いる）", meaning: "report, news", examples: [{ sentence: "報告（ほうこく）します", reading: "ほうこくします", english: "I report" }, { sentence: "天気予報（てんきよほう）", reading: "てんきよほう", english: "Weather forecast" }] },
    
    // Report (tell)
    { id: "koku", kanji: "告", onyomi: "コク", kunyomi: "つ（げる）", meaning: "tell, announce", examples: [{ sentence: "報告（ほうこく）します", reading: "ほうこくします", english: "I report" }, { sentence: "知（し）らせを告（つ）げます", reading: "しらせをつげます", english: "I deliver the news" }] },
    
    // Material
    { id: "shi", kanji: "資", onyomi: "シ", kunyomi: null, meaning: "resources, capital", examples: [{ sentence: "資料（しりょう）を準備（じゅんび）します", reading: "しりょうをじゅんびします", english: "I prepare the materials" }, { sentence: "資金（しきん）が足（た）りません", reading: "しきんがたりません", english: "I don't have enough funds" }] },
    
    // Material/fee
    { id: "ryou", kanji: "料", onyomi: "リョウ", kunyomi: null, meaning: "fee, materials", examples: [{ sentence: "資料（しりょう）を準備（じゅんび）します", reading: "しりょうをじゅんびします", english: "I prepare the materials" }, { sentence: "入場料（にゅうじょうりょう）を払（はら）います", reading: "にゅうじょうりょうをはらいます", english: "I pay the entrance fee" }] },
    
    // Prepare
    { id: "junbi", kanji: "準", onyomi: "ジュン", kunyomi: null, meaning: "standard, semi-", examples: [{ sentence: "準備（じゅんび）します", reading: "じゅんびします", english: "I prepare" }, { sentence: "準備（じゅんび）ができました", reading: "じゅんびができました", english: "Preparation is complete" }] },
    
    // Prepare (equip)
    { id: "bi", kanji: "備", onyomi: "ビ", kunyomi: "そな（える）", meaning: "prepare, equip", examples: [{ sentence: "準備（じゅんび）します", reading: "じゅんびします", english: "I prepare" }, { sentence: "備（そな）えます", reading: "そなえます", english: "I equip" }] },
    
    // Breakdown
    { id: "koshi", kanji: "故", onyomi: "コ", kunyomi: "ゆえ", meaning: "reason, cause", examples: [{ sentence: "故障（こしょう）しました", reading: "こしょうしました", english: "It broke down" }, { sentence: "故郷（こきょう）に帰（かえ）ります", reading: "こきょうにかえります", english: "I return to my hometown" }] },
    
    // Breakdown (obstacle)
    { id: "shou", kanji: "障", onyomi: "ショウ", kunyomi: "さわ（る）", meaning: "obstacle, hinder", examples: [{ sentence: "故障（こしょう）しました", reading: "こしょうしました", english: "It broke down" }, { sentence: "障害（しょうがい）があります", reading: "しょうがいがあります", english: "There is an obstacle" }] },
    
    // Absent
    { id: "ketsu", kanji: "欠", onyomi: "ケツ", kunyomi: "か（ける）", meaning: "lack, be absent", examples: [{ sentence: "欠席（けっせき）します", reading: "けっせきします", english: "I will be absent" }, { sentence: "お金（かね）が欠（か）けています", reading: "おかねがかけています", english: "I'm short of money" }] },
    
    // Seat
    { id: "seki", kanji: "席", onyomi: "セキ", kunyomi: null, meaning: "seat", examples: [{ sentence: "欠席（けっせき）します", reading: "けっせきします", english: "I will be absent" }, { sentence: "席（せき）に座（すわ）ります", reading: "せきにすわります", english: "I sit in the seat" }] },
    
    // Pass
    { id: "gou", kanji: "合", onyomi: "ゴウ", kunyomi: "あ（う）", meaning: "join, fit, pass", examples: [{ sentence: "試験（しけん）に合格（ごうかく）しました", reading: "しけんにごうかくしました", english: "I passed the exam" }, { sentence: "サイズが合（あ）います", reading: "さいずがあいます", english: "The size fits" }] },
    
    // Pass (rank)
    { id: "kaku", kanji: "格", onyomi: "カク", kunyomi: null, meaning: "status, rank", examples: [{ sentence: "合格（ごうかく）しました", reading: "ごうかくしました", english: "I passed" }, { sentence: "格（かく）が違（ちが）います", reading: "かくがちがいます", english: "The status is different" }] },
    
    // Submit
    { id: "teishutsu", kanji: "提", onyomi: "テイ", kunyomi: "さ（げる）", meaning: "propose, submit", examples: [{ sentence: "提出（ていしゅつ）します", reading: "ていしゅつします", english: "I submit" }, { sentence: "課題（かだい）を提出（ていしゅつ）します", reading: "かだいをていしゅつします", english: "I submit the assignment" }] },
    
    // Question
    { id: "mon", kanji: "問", onyomi: "モン", kunyomi: "と（う）", meaning: "question, problem", examples: [{ sentence: "質問（しつもん）があります", reading: "しつもんがあります", english: "I have a question" }, { sentence: "問題（もんだい）を解（と）きます", reading: "もんだいをときます", english: "I solve the problem" }] },
    
    // Open
    { id: "hiraku", kanji: "開", onyomi: "カイ", kunyomi: "あ（ける）、ひら（く）", meaning: "open", examples: [{ sentence: "教科書（きょうかしょ）を開（ひら）きます", reading: "きょうかしょをひらきます", english: "I open the textbook" }, { sentence: "ドアを開（あ）けます", reading: "どあをあけます", english: "I open the door" }] },
    
    // Pronunciation (depart)
    { id: "hatsu", kanji: "発", onyomi: "ハツ", kunyomi: "た（つ）", meaning: "departure, emit", examples: [{ sentence: "発音（はつおん）が難（むずか）しいです", reading: "はつおんがむずかしいです", english: "Pronunciation is difficult" }, { sentence: "出発（しゅっぱつ）します", reading: "しゅっぱつします", english: "I depart" }] }
];

const kanjiOrder = kanjiData.map(k => k.id);

function getKanjiById(id) {
    return kanjiData.find(k => k.id === id);
}