// ==================== VERBS DATA ====================

const verbsData = [
    // Group 1 (Godan) Verbs
    {
        id: "あう",
        dictionary: "会う",
        reading: "あう",
        meaning: "to meet",
        group: 1,
        conjugations: {
            masu: "会（あ）います",
            nai: "会（あ）わない",
            te: "会（あ）って",
            ta: "会（あ）った",
            potential: "会（あ）える",
            volitional: "会（あ）おう",
            conditional: "会（あ）えば"
        },
        examples: {
            masu: { sentence: "友達（ともだち）に会（あ）います", translation: "I meet my friend" },
            nai: { sentence: "友達（ともだち）に会（あ）わない", translation: "I don't meet my friend" },
            te: { sentence: "友達（ともだち）に会（あ）って", translation: "(Please) meet my friend" },
            ta: { sentence: "友達（ともだち）に会（あ）った", translation: "I met my friend" },
            potential: { sentence: "友達（ともだち）に会（あ）える", translation: "I can meet my friend" },
            volitional: { sentence: "友達（ともだち）に会（あ）おう", translation: "Let's meet my friend" },
            conditional: { sentence: "友達（ともだち）に会（あ）えば", translation: "If I meet my friend" }
        }
    },
    {
        id: "あそぶ",
        dictionary: "遊ぶ",
        reading: "あそぶ",
        meaning: "to play",
        group: 1,
        conjugations: {
            masu: "遊（あそ）びます",
            nai: "遊（あそ）ばない",
            te: "遊（あそ）んで",
            ta: "遊（あそ）んだ",
            potential: "遊（あそ）べる",
            volitional: "遊（あそ）ぼう",
            conditional: "遊（あそ）べば"
        },
        examples: {
            masu: { sentence: "子（こ）供（ども）は外（そと）で遊（あそ）びます", translation: "The children play outside" },
            nai: { sentence: "子（こ）供（ども）は外（そと）で遊（あそ）ばない", translation: "The children don't play outside" },
            te: { sentence: "外（そと）で遊（あそ）んで", translation: "(Please) play outside" },
            ta: { sentence: "子（こ）供（ども）は外（そと）で遊（あそ）んだ", translation: "The children played outside" },
            potential: { sentence: "外（そと）で遊（あそ）べる", translation: "I can play outside" },
            volitional: { sentence: "外（そと）で遊（あそ）ぼう", translation: "Let's play outside" },
            conditional: { sentence: "外（そと）で遊（あそ）べば", translation: "If I play outside" }
        }
    },
    {
        id: "いく",
        dictionary: "行く",
        reading: "いく",
        meaning: "to go",
        group: 1,
        conjugations: {
            masu: "行（い）きます",
            nai: "行（い）かない",
            te: "行（い）って",
            ta: "行（い）った",
            potential: "行（い）ける",
            volitional: "行（い）こう",
            conditional: "行（い）けば"
        },
        examples: {
            masu: { sentence: "学（がっ）校（こう）へ行（い）きます", translation: "I go to school" },
            nai: { sentence: "学（がっ）校（こう）へ行（い）かない", translation: "I don't go to school" },
            te: { sentence: "学（がっ）校（こう）へ行（い）って", translation: "(Please) go to school" },
            ta: { sentence: "学（がっ）校（こう）へ行（い）った", translation: "I went to school" },
            potential: { sentence: "学（がっ）校（こう）へ行（い）ける", translation: "I can go to school" },
            volitional: { sentence: "学（がっ）校（こう）へ行（い）こう", translation: "Let's go to school" },
            conditional: { sentence: "学（がっ）校（こう）へ行（い）けば", translation: "If I go to school" }
        }
    },
    {
        id: "はなす",
        dictionary: "話す",
        reading: "はなす",
        meaning: "to speak",
        group: 1,
        conjugations: {
            masu: "話（はな）します",
            nai: "話（はな）さない",
            te: "話（はな）して",
            ta: "話（はな）した",
            potential: "話（はな）せる",
            volitional: "話（はな）そう",
            conditional: "話（はな）せば"
        },
        examples: {
            masu: { sentence: "日（に）本（ほん）語（ご）を話（はな）します", translation: "I speak Japanese" },
            nai: { sentence: "日（に）本（ほん）語（ご）を話（はな）さない", translation: "I don't speak Japanese" },
            te: { sentence: "日（に）本（ほん）語（ご）を話（はな）して", translation: "(Please) speak Japanese" },
            ta: { sentence: "日（に）本（ほん）語（ご）を話（はな）した", translation: "I spoke Japanese" },
            potential: { sentence: "日（に）本（ほん）語（ご）が話（はな）せる", translation: "I can speak Japanese" },
            volitional: { sentence: "日（に）本（ほん）語（ご）を話（はな）そう", translation: "Let's speak Japanese" },
            conditional: { sentence: "日（に）本（ほん）語（ご）を話（はな）せば", translation: "If I speak Japanese" }
        }
    },
    {
        id: "よむ",
        dictionary: "読む",
        reading: "よむ",
        meaning: "to read",
        group: 1,
        conjugations: {
            masu: "読（よ）みます",
            nai: "読（よ）まない",
            te: "読（よ）んで",
            ta: "読（よ）んだ",
            potential: "読（よ）める",
            volitional: "読（よ）もう",
            conditional: "読（よ）めば"
        },
        examples: {
            masu: { sentence: "本（ほん）を読（よ）みます", translation: "I read a book" },
            nai: { sentence: "本（ほん）を読（よ）まない", translation: "I don't read a book" },
            te: { sentence: "本（ほん）を読（よ）んで", translation: "(Please) read a book" },
            ta: { sentence: "本（ほん）を読（よ）んだ", translation: "I read a book" },
            potential: { sentence: "本（ほん）が読（よ）める", translation: "I can read a book" },
            volitional: { sentence: "本（ほん）を読（よ）もう", translation: "Let's read a book" },
            conditional: { sentence: "本（ほん）を読（よ）めば", translation: "If I read a book" }
        }
    },
    {
        id: "のむ",
        dictionary: "飲む",
        reading: "のむ",
        meaning: "to drink",
        group: 1,
        conjugations: {
            masu: "飲（の）みます",
            nai: "飲（の）まない",
            te: "飲（の）んで",
            ta: "飲（の）んだ",
            potential: "飲（の）める",
            volitional: "飲（の）もう",
            conditional: "飲（の）めば"
        },
        examples: {
            masu: { sentence: "水（みず）を飲（の）みます", translation: "I drink water" },
            nai: { sentence: "水（みず）を飲（の）まない", translation: "I don't drink water" },
            te: { sentence: "水（みず）を飲（の）んで", translation: "(Please) drink water" },
            ta: { sentence: "水（みず）を飲（の）んだ", translation: "I drank water" },
            potential: { sentence: "水（みず）が飲（の）める", translation: "I can drink water" },
            volitional: { sentence: "水（みず）を飲（の）もう", translation: "Let's drink water" },
            conditional: { sentence: "水（みず）を飲（の）めば", translation: "If I drink water" }
        }
    },
    {
        id: "かう",
        dictionary: "買う",
        reading: "かう",
        meaning: "to buy",
        group: 1,
        conjugations: {
            masu: "買（か）います",
            nai: "買（か）わない",
            te: "買（か）って",
            ta: "買（か）った",
            potential: "買（か）える",
            volitional: "買（か）おう",
            conditional: "買（か）えば"
        },
        examples: {
            masu: { sentence: "りんごを買（か）います", translation: "I buy an apple" },
            nai: { sentence: "りんごを買（か）わない", translation: "I don't buy an apple" },
            te: { sentence: "りんごを買（か）って", translation: "(Please) buy an apple" },
            ta: { sentence: "りんごを買（か）った", translation: "I bought an apple" },
            potential: { sentence: "りんごが買（か）える", translation: "I can buy an apple" },
            volitional: { sentence: "りんごを買（か）おう", translation: "Let's buy an apple" },
            conditional: { sentence: "りんごを買（か）えば", translation: "If I buy an apple" }
        }
    },
    {
        id: "かえる",
        dictionary: "帰る",
        reading: "かえる",
        meaning: "to return (home)",
        group: 1,
        conjugations: {
            masu: "帰（かえ）ります",
            nai: "帰（かえ）らない",
            te: "帰（かえ）って",
            ta: "帰（かえ）った",
            potential: "帰（かえ）れる",
            volitional: "帰（かえ）ろう",
            conditional: "帰（かえ）れば"
        },
        examples: {
            masu: { sentence: "家（いえ）へ帰（かえ）ります", translation: "I return home" },
            nai: { sentence: "家（いえ）へ帰（かえ）らない", translation: "I don't return home" },
            te: { sentence: "家（いえ）へ帰（かえ）って", translation: "(Please) return home" },
            ta: { sentence: "家（いえ）へ帰（かえ）った", translation: "I returned home" },
            potential: { sentence: "家（いえ）へ帰（かえ）れる", translation: "I can return home" },
            volitional: { sentence: "家（いえ）へ帰（かえ）ろう", translation: "Let's return home" },
            conditional: { sentence: "家（いえ）へ帰（かえ）れば", translation: "If I return home" }
        }
    },
    {
        id: "かく",
        dictionary: "書く",
        reading: "かく",
        meaning: "to write",
        group: 1,
        conjugations: {
            masu: "書（か）きます",
            nai: "書（か）かない",
            te: "書（か）いて",
            ta: "書（か）いた",
            potential: "書（か）ける",
            volitional: "書（か）こう",
            conditional: "書（か）けば"
        },
        examples: {
            masu: { sentence: "手（て）紙（がみ）を書（か）きます", translation: "I write a letter" },
            nai: { sentence: "手（て）紙（がみ）を書（か）かない", translation: "I don't write a letter" },
            te: { sentence: "手（て）紙（がみ）を書（か）いて", translation: "(Please) write a letter" },
            ta: { sentence: "手（て）紙（がみ）を書（か）いた", translation: "I wrote a letter" },
            potential: { sentence: "手（て）紙（がみ）が書（か）ける", translation: "I can write a letter" },
            volitional: { sentence: "手（て）紙（がみ）を書（か）こう", translation: "Let's write a letter" },
            conditional: { sentence: "手（て）紙（がみ）を書（か）けば", translation: "If I write a letter" }
        }
    },
    {
        id: "まつ",
        dictionary: "待つ",
        reading: "まつ",
        meaning: "to wait",
        group: 1,
        conjugations: {
            masu: "待（ま）ちます",
            nai: "待（ま）たない",
            te: "待（ま）って",
            ta: "待（ま）った",
            potential: "待（ま）てる",
            volitional: "待（ま）とう",
            conditional: "待（ま）てば"
        },
        examples: {
            masu: { sentence: "バスを待（ま）ちます", translation: "I wait for the bus" },
            nai: { sentence: "バスを待（ま）たない", translation: "I don't wait for the bus" },
            te: { sentence: "バスを待（ま）って", translation: "(Please) wait for the bus" },
            ta: { sentence: "バスを待（ま）った", translation: "I waited for the bus" },
            potential: { sentence: "バスが待（ま）てる", translation: "I can wait for the bus" },
            volitional: { sentence: "バスを待（ま）とう", translation: "Let's wait for the bus" },
            conditional: { sentence: "バスを待（ま）てば", translation: "If I wait for the bus" }
        }
    },
    
    // Group 2 (Ichidan) Verbs
    {
        id: "たべる",
        dictionary: "食べる",
        reading: "たべる",
        meaning: "to eat",
        group: 2,
        conjugations: {
            masu: "食（た）べます",
            nai: "食（た）べない",
            te: "食（た）べて",
            ta: "食（た）べた",
            potential: "食（た）べられる",
            volitional: "食（た）べよう",
            conditional: "食（た）べれば"
        },
        examples: {
            masu: { sentence: "ご飯（はん）を食（た）べます", translation: "I eat rice" },
            nai: { sentence: "ご飯（はん）を食（た）べない", translation: "I don't eat rice" },
            te: { sentence: "ご飯（はん）を食（た）べて", translation: "(Please) eat rice" },
            ta: { sentence: "ご飯（はん）を食（た）べた", translation: "I ate rice" },
            potential: { sentence: "ご飯（はん）が食（た）べられる", translation: "I can eat rice" },
            volitional: { sentence: "ご飯（はん）を食（た）べよう", translation: "Let's eat rice" },
            conditional: { sentence: "ご飯（はん）を食（た）べれば", translation: "If I eat rice" }
        }
    },
    {
        id: "みる",
        dictionary: "見る",
        reading: "みる",
        meaning: "to see",
        group: 2,
        conjugations: {
            masu: "見（み）ます",
            nai: "見（み）ない",
            te: "見（み）て",
            ta: "見（み）た",
            potential: "見（み）られる",
            volitional: "見（み）よう",
            conditional: "見（み）れば"
        },
        examples: {
            masu: { sentence: "テレビを見（み）ます", translation: "I watch TV" },
            nai: { sentence: "テレビを見（み）ない", translation: "I don't watch TV" },
            te: { sentence: "テレビを見（み）て", translation: "(Please) watch TV" },
            ta: { sentence: "テレビを見（み）た", translation: "I watched TV" },
            potential: { sentence: "テレビが見（み）られる", translation: "I can watch TV" },
            volitional: { sentence: "テレビを見（み）よう", translation: "Let's watch TV" },
            conditional: { sentence: "テレビを見（み）れば", translation: "If I watch TV" }
        }
    },
    {
        id: "ねる",
        dictionary: "寝る",
        reading: "ねる",
        meaning: "to sleep",
        group: 2,
        conjugations: {
            masu: "寝（ね）ます",
            nai: "寝（ね）ない",
            te: "寝（ね）て",
            ta: "寝（ね）た",
            potential: "寝（ね）られる",
            volitional: "寝（ね）よう",
            conditional: "寝（ね）れば"
        },
        examples: {
            masu: { sentence: "夜（よる）10時（じ）に寝（ね）ます", translation: "I sleep at 10 PM" },
            nai: { sentence: "夜（よる）10時（じ）に寝（ね）ない", translation: "I don't sleep at 10 PM" },
            te: { sentence: "夜（よる）10時（じ）に寝（ね）て", translation: "(Please) sleep at 10 PM" },
            ta: { sentence: "夜（よる）10時（じ）に寝（ね）た", translation: "I slept at 10 PM" },
            potential: { sentence: "夜（よる）10時（じ）に寝（ね）られる", translation: "I can sleep at 10 PM" },
            volitional: { sentence: "夜（よる）10時（じ）に寝（ね）よう", translation: "Let's sleep at 10 PM" },
            conditional: { sentence: "夜（よる）10時（じ）に寝（ね）れば", translation: "If I sleep at 10 PM" }
        }
    },
    {
        id: "おきる",
        dictionary: "起きる",
        reading: "おきる",
        meaning: "to wake up",
        group: 2,
        conjugations: {
            masu: "起（お）きます",
            nai: "起（お）きない",
            te: "起（お）きて",
            ta: "起（お）きた",
            potential: "起（お）きられる",
            volitional: "起（お）きよう",
            conditional: "起（お）きれば"
        },
        examples: {
            masu: { sentence: "朝（あさ）7時（じ）に起（お）きます", translation: "I wake up at 7 AM" },
            nai: { sentence: "朝（あさ）7時（じ）に起（お）きない", translation: "I don't wake up at 7 AM" },
            te: { sentence: "朝（あさ）7時（じ）に起（お）きて", translation: "(Please) wake up at 7 AM" },
            ta: { sentence: "朝（あさ）7時（じ）に起（お）きた", translation: "I woke up at 7 AM" },
            potential: { sentence: "朝（あさ）7時（じ）に起（お）きられる", translation: "I can wake up at 7 AM" },
            volitional: { sentence: "朝（あさ）7時（じ）に起（お）きよう", translation: "Let's wake up at 7 AM" },
            conditional: { sentence: "朝（あさ）7時（じ）に起（お）きれば", translation: "If I wake up at 7 AM" }
        }
    },
    {
        id: "おしえる",
        dictionary: "教える",
        reading: "おしえる",
        meaning: "to teach",
        group: 2,
        conjugations: {
            masu: "教（おし）えます",
            nai: "教（おし）えない",
            te: "教（おし）えて",
            ta: "教（おし）えた",
            potential: "教（おし）えられる",
            volitional: "教（おし）えよう",
            conditional: "教（おし）えれば"
        },
        examples: {
            masu: { sentence: "英（えい）語（ご）を教（おし）えます", translation: "I teach English" },
            nai: { sentence: "英（えい）語（ご）を教（おし）えない", translation: "I don't teach English" },
            te: { sentence: "英（えい）語（ご）を教（おし）えて", translation: "(Please) teach English" },
            ta: { sentence: "英（えい）語（ご）を教（おし）えた", translation: "I taught English" },
            potential: { sentence: "英（えい）語（ご）が教（おし）えられる", translation: "I can teach English" },
            volitional: { sentence: "英（えい）語（ご）を教（おし）えよう", translation: "Let's teach English" },
            conditional: { sentence: "英（えい）語（ご）を教（おし）えれば", translation: "If I teach English" }
        }
    },
    {
        id: "あける",
        dictionary: "開ける",
        reading: "あける",
        meaning: "to open",
        group: 2,
        conjugations: {
            masu: "開（あ）けます",
            nai: "開（あ）けない",
            te: "開（あ）けて",
            ta: "開（あ）けた",
            potential: "開（あ）けられる",
            volitional: "開（あ）けよう",
            conditional: "開（あ）ければ"
        },
        examples: {
            masu: { sentence: "ドアを開（あ）けます", translation: "I open the door" },
            nai: { sentence: "ドアを開（あ）けない", translation: "I don't open the door" },
            te: { sentence: "ドアを開（あ）けて", translation: "(Please) open the door" },
            ta: { sentence: "ドアを開（あ）けた", translation: "I opened the door" },
            potential: { sentence: "ドアが開（あ）けられる", translation: "I can open the door" },
            volitional: { sentence: "ドアを開（あ）けよう", translation: "Let's open the door" },
            conditional: { sentence: "ドアを開（あ）ければ", translation: "If I open the door" }
        }
    },
    
    // Group 3 (Irregular) Verbs
    {
        id: "する",
        dictionary: "する",
        reading: "する",
        meaning: "to do",
        group: 3,
        conjugations: {
            masu: "します",
            nai: "しない",
            te: "して",
            ta: "した",
            potential: "できる",
            volitional: "しよう",
            conditional: "すれば"
        },
        examples: {
            masu: { sentence: "仕（し）事（ごと）をします", translation: "I do work" },
            nai: { sentence: "仕（し）事（ごと）をしない", translation: "I don't do work" },
            te: { sentence: "仕（し）事（ごと）をして", translation: "(Please) do work" },
            ta: { sentence: "仕（し）事（ごと）をした", translation: "I did work" },
            potential: { sentence: "仕（し）事（ごと）ができる", translation: "I can do work" },
            volitional: { sentence: "仕（し）事（ごと）をしよう", translation: "Let's do work" },
            conditional: { sentence: "仕（し）事（ごと）をすれば", translation: "If I do work" }
        }
    },
    {
        id: "くる",
        dictionary: "来る",
        reading: "くる",
        meaning: "to come",
        group: 3,
        conjugations: {
            masu: "来（き）ます",
            nai: "来（こ）ない",
            te: "来（き）て",
            ta: "来（き）た",
            potential: "来（こ）られる",
            volitional: "来（こ）よう",
            conditional: "来（く）れば"
        },
        examples: {
            masu: { sentence: "パーティーに来（き）ます", translation: "I come to the party" },
            nai: { sentence: "パーティーに来（こ）ない", translation: "I don't come to the party" },
            te: { sentence: "パーティーに来（き）て", translation: "(Please) come to the party" },
            ta: { sentence: "パーティーに来（き）た", translation: "I came to the party" },
            potential: { sentence: "パーティーに来（こ）られる", translation: "I can come to the party" },
            volitional: { sentence: "パーティーに来（こ）よう", translation: "Let's come to the party" },
            conditional: { sentence: "パーティーに来（く）れば", translation: "If I come to the party" }
        }
    },
    {
        id: "べんきょうする",
        dictionary: "勉強する",
        reading: "べんきょうする",
        meaning: "to study",
        group: 3,
        conjugations: {
            masu: "勉（べん）強（きょう）します",
            nai: "勉（べん）強（きょう）しない",
            te: "勉（べん）強（きょう）して",
            ta: "勉（べん）強（きょう）した",
            potential: "勉（べん）強（きょう）できる",
            volitional: "勉（べん）強（きょう）しよう",
            conditional: "勉（べん）強（きょう）すれば"
        },
        examples: {
            masu: { sentence: "図（と）書（しょ）館（かん）で勉（べん）強（きょう）します", translation: "I study at the library" },
            nai: { sentence: "図（と）書（しょ）館（かん）で勉（べん）強（きょう）しない", translation: "I don't study at the library" },
            te: { sentence: "図（と）書（しょ）館（かん）で勉（べん）強（きょう）して", translation: "(Please) study at the library" },
            ta: { sentence: "図（と）書（しょ）館（かん）で勉（べん）強（きょう）した", translation: "I studied at the library" },
            potential: { sentence: "図（と）書（しょ）館（かん）で勉（べん）強（きょう）できる", translation: "I can study at the library" },
            volitional: { sentence: "図（と）書（しょ）館（かん）で勉（べん）強（きょう）しよう", translation: "Let's study at the library" },
            conditional: { sentence: "図（と）書（しょ）館（かん）で勉（べん）強（きょう）すれば", translation: "If I study at the library" }
        }
    },
    {
        id: "さんぽする",
        dictionary: "散歩する",
        reading: "さんぽする",
        meaning: "to take a walk",
        group: 3,
        conjugations: {
            masu: "散（さん）歩（ぽ）します",
            nai: "散（さん）歩（ぽ）しない",
            te: "散（さん）歩（ぽ）して",
            ta: "散（さん）歩（ぽ）した",
            potential: "散（さん）歩（ぽ）できる",
            volitional: "散（さん）歩（ぽ）しよう",
            conditional: "散（さん）歩（ぽ）すれば"
        },
        examples: {
            masu: { sentence: "公（こう）園（えん）で散（さん）歩（ぽ）します", translation: "I take a walk in the park" },
            nai: { sentence: "公（こう）園（えん）で散（さん）歩（ぽ）しない", translation: "I don't take a walk in the park" },
            te: { sentence: "公（こう）園（えん）で散（さん）歩（ぽ）して", translation: "(Please) take a walk in the park" },
            ta: { sentence: "公（こう）園（えん）で散（さん）歩（ぽ）した", translation: "I took a walk in the park" },
            potential: { sentence: "公（こう）園（えん）で散（さん）歩（ぽ）できる", translation: "I can take a walk in the park" },
            volitional: { sentence: "公（こう）園（えん）で散（さん）歩（ぽ）しよう", translation: "Let's take a walk in the park" },
            conditional: { sentence: "公（こう）園（えん）で散（さん）歩（ぽ）すれば", translation: "If I take a walk in the park" }
        }
    },
    {
        id: "りょこうする",
        dictionary: "旅行する",
        reading: "りょこうする",
        meaning: "to travel",
        group: 3,
        conjugations: {
            masu: "旅（りょ）行（こう）します",
            nai: "旅（りょ）行（こう）しない",
            te: "旅（りょ）行（こう）して",
            ta: "旅（りょ）行（こう）した",
            potential: "旅（りょ）行（こう）できる",
            volitional: "旅（りょ）行（こう）しよう",
            conditional: "旅（りょ）行（こう）すれば"
        },
        examples: {
            masu: { sentence: "海（うみ）へ旅（りょ）行（こう）します", translation: "I travel to the sea" },
            nai: { sentence: "海（うみ）へ旅（りょ）行（こう）しない", translation: "I don't travel to the sea" },
            te: { sentence: "海（うみ）へ旅（りょ）行（こう）して", translation: "(Please) travel to the sea" },
            ta: { sentence: "海（うみ）へ旅（りょ）行（こう）した", translation: "I traveled to the sea" },
            potential: { sentence: "海（うみ）へ旅（りょ）行（こう）できる", translation: "I can travel to the sea" },
            volitional: { sentence: "海（うみ）へ旅（りょ）行（こう）しよう", translation: "Let's travel to the sea" },
            conditional: { sentence: "海（うみ）へ旅（りょ）行（こう）すれば", translation: "If I travel to the sea" }
        }
    }
];

const verbOrder = verbsData.map(v => v.id);

function getVerbById(id) {
    return verbsData.find(v => v.id === id);
}

function getConjugationDisplayName(conjType) {
    const names = {
        masu: "Masu (Polite - I do)",
        nai: "Nai (Negative - I don't do)",
        te: "Te-form (Please do / do and)",
        ta: "Ta-form (Past - I did)",
        potential: "Potential (Can do)",
        volitional: "Volitional (Let's do)",
        conditional: "Conditional (If I do)"
    };
    return names[conjType] || conjType;
}