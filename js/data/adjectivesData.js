// ==================== ADJECTIVES DATA ====================
// N5 い-adjectives and な-adjectives with furigana in all conjugations

const adjectivesData = [
    // ========== い-ADJECTIVES (N5 Core) ==========
    {
        id: "あつい",
        dictionary: "暑い",
        reading: "あつい",
        meaning: "hot (weather)",
        type: "i",
        conjugations: {
            nai: "暑（あつ）くない",
            ta: "暑（あつ）かった",
            nakatta: "暑（あつ）くなかった",
            masu: "暑（あつ）いです",
            masu_nai: "暑（あつ）くありません",
            masu_ta: "暑（あつ）かったです",
            masu_nakatta: "暑（あつ）くありませんでした",
            conditional: "暑（あつ）ければ",
            te: "暑（あつ）くて",
            adverbial: "暑（あつ）く"
        },
        examples: [
            { sentence: "今日（きょう）はとても暑（あつ）いです", reading: "きょうはとてもあついです", english: "Today is very hot." }
        ]
    },
    {
        id: "さむい",
        dictionary: "寒い",
        reading: "さむい",
        meaning: "cold",
        type: "i",
        conjugations: {
            nai: "寒（さむ）くない",
            ta: "寒（さむ）かった",
            nakatta: "寒（さむ）くなかった",
            masu: "寒（さむ）いです",
            masu_nai: "寒（さむ）くありません",
            masu_ta: "寒（さむ）かったです",
            masu_nakatta: "寒（さむ）くありませんでした",
            conditional: "寒（さむ）ければ",
            te: "寒（さむ）くて",
            adverbial: "寒（さむ）く"
        },
        examples: [
            { sentence: "明日（あした）は寒（さむ）くなるでしょう", reading: "あしたはさむくなるでしょう", english: "It will probably get cold tomorrow." }
        ]
    },
    {
        id: "あつい2",
        dictionary: "熱い",
        reading: "あつい",
        meaning: "hot (to touch)",
        type: "i",
        conjugations: {
            nai: "熱（あつ）くない",
            ta: "熱（あつ）かった",
            nakatta: "熱（あつ）くなかった",
            masu: "熱（あつ）いです",
            masu_nai: "熱（あつ）くありません",
            masu_ta: "熱（あつ）かったです",
            masu_nakatta: "熱（あつ）くありませんでした",
            conditional: "熱（あつ）ければ",
            te: "熱（あつ）くて",
            adverbial: "熱（あつ）く"
        },
        examples: [
            { sentence: "スープが熱（あつ）いです", reading: "すーぷがあついです", english: "The soup is hot." }
        ]
    },
    {
        id: "つめたい",
        dictionary: "冷たい",
        reading: "つめたい",
        meaning: "cold (to touch)",
        type: "i",
        conjugations: {
            nai: "冷（つめ）たくない",
            ta: "冷（つめ）たかった",
            nakatta: "冷（つめ）たくなかった",
            masu: "冷（つめ）たいです",
            masu_nai: "冷（つめ）たくありません",
            masu_ta: "冷（つめ）たかったです",
            masu_nakatta: "冷（つめ）たくありませんでした",
            conditional: "冷（つめ）たければ",
            te: "冷（つめ）たくて",
            adverbial: "冷（つめ）たく"
        },
        examples: [
            { sentence: "夏（なつ）は冷（つめ）たいアイスクリームが一番好（いちばんす）きです", reading: "なつはつめたいあいすくりーむがいちばんすきです", english: "In summer, I like cold ice cream the most." }
        ]
    },
    {
        id: "おおきい",
        dictionary: "大きい",
        reading: "おおきい",
        meaning: "big",
        type: "i",
        conjugations: {
            nai: "大（おお）きくない",
            ta: "大（おお）きかった",
            nakatta: "大（おお）きくなかった",
            masu: "大（おお）きいです",
            masu_nai: "大（おお）きくありません",
            masu_ta: "大（おお）きかったです",
            masu_nakatta: "大（おお）きくありませんでした",
            conditional: "大（おお）きければ",
            te: "大（おお）きくて",
            adverbial: "大（おお）きく"
        },
        examples: [
            { sentence: "この町（まち）には大（おお）きな図書館（としょかん）があります", reading: "このまちにはおおきなとしょかんがあります", english: "There is a big library in this town." }
        ]
    },
    {
        id: "ちいさい",
        dictionary: "小さい",
        reading: "ちいさい",
        meaning: "small",
        type: "i",
        conjugations: {
            nai: "小（ちい）さくない",
            ta: "小（ちい）さかった",
            nakatta: "小（ちい）さくなかった",
            masu: "小（ちい）さいです",
            masu_nai: "小（ちい）さくありません",
            masu_ta: "小（ちい）さかったです",
            masu_nakatta: "小（ちい）さくありませんでした",
            conditional: "小（ちい）さければ",
            te: "小（ちい）さくて",
            adverbial: "小（ちい）さく"
        },
        examples: [
            { sentence: "公園（こうえん）で小（ちい）さい犬（いぬ）を見（み）ました", reading: "こうえんでちいさいいぬをみました", english: "I saw a small dog in the park." }
        ]
    },
    {
        id: "あたらしい",
        dictionary: "新しい",
        reading: "あたらしい",
        meaning: "new",
        type: "i",
        conjugations: {
            nai: "新（あたら）しくない",
            ta: "新（あたら）しかった",
            nakatta: "新（あたら）しくなかった",
            masu: "新（あたら）しいです",
            masu_nai: "新（あたら）しくありません",
            masu_ta: "新（あたら）しかったです",
            masu_nakatta: "新（あたら）しくありませんでした",
            conditional: "新（あたら）しければ",
            te: "新（あたら）しくて",
            adverbial: "新（あたら）しく"
        },
        examples: [
            { sentence: "新（あたら）しい隣人（りんじん）はとても親切（しんせつ）です", reading: "あたらしいりんじんはとてもしんせつです", english: "The new neighbor is very kind." }
        ]
    },
    {
        id: "ふるい",
        dictionary: "古い",
        reading: "ふるい",
        meaning: "old",
        type: "i",
        conjugations: {
            nai: "古（ふる）くない",
            ta: "古（ふる）かった",
            nakatta: "古（ふる）くなかった",
            masu: "古（ふる）いです",
            masu_nai: "古（ふる）くありません",
            masu_ta: "古（ふる）かったです",
            masu_nakatta: "古（ふる）くありませんでした",
            conditional: "古（ふる）ければ",
            te: "古（ふる）くて",
            adverbial: "古（ふる）く"
        },
        examples: [
            { sentence: "この町（まち）には古（ふる）い建物（たてもの）があります", reading: "このまちにはふるいたてものがあります", english: "There are old buildings in this town." }
        ]
    },
    {
        id: "たかい",
        dictionary: "高い",
        reading: "たかい",
        meaning: "high, expensive",
        type: "i",
        conjugations: {
            nai: "高（たか）くない",
            ta: "高（たか）かった",
            nakatta: "高（たか）くなかった",
            masu: "高（たか）いです",
            masu_nai: "高（たか）くありません",
            masu_ta: "高（たか）かったです",
            masu_nakatta: "高（たか）くありませんでした",
            conditional: "高（たか）ければ",
            te: "高（たか）くて",
            adverbial: "高（たか）く"
        },
        examples: [
            { sentence: "新幹線（しんかんせん）は速（はや）いですが少（すこ）し高（たか）いです", reading: "しんかんせんははやいですがすこしたかいです", english: "The Shinkansen is fast but a little expensive." }
        ]
    },
    {
        id: "やすい",
        dictionary: "安い",
        reading: "やすい",
        meaning: "cheap",
        type: "i",
        conjugations: {
            nai: "安（やす）くない",
            ta: "安（やす）かった",
            nakatta: "安（やす）くなかった",
            masu: "安（やす）いです",
            masu_nai: "安（やす）くありません",
            masu_ta: "安（やす）かったです",
            masu_nakatta: "安（やす）くありませんでした",
            conditional: "安（やす）ければ",
            te: "安（やす）くて",
            adverbial: "安（やす）く"
        },
        examples: [
            { sentence: "もっと安（やす）いのはありませんか", reading: "もっとやすいのはありませんか", english: "Don't you have something cheaper?" }
        ]
    },
    {
        id: "おいしい",
        dictionary: "美味しい",
        reading: "おいしい",
        meaning: "delicious",
        type: "i",
        conjugations: {
            nai: "美味（おい）しくない",
            ta: "美味（おい）しかった",
            nakatta: "美味（おい）しくなかった",
            masu: "美味（おい）しいです",
            masu_nai: "美味（おい）しくありません",
            masu_ta: "美味（おい）しかったです",
            masu_nakatta: "美味（おい）しくありませんでした",
            conditional: "美味（おい）しければ",
            te: "美味（おい）しくて",
            adverbial: "美味（おい）しく"
        },
        examples: [
            { sentence: "この料理（りょうり）は少（すこ）し辛（から）いですが美味（おい）しいです", reading: "このりょうりはすこしからいですがおいしいです", english: "This dish is a little spicy but delicious." }
        ]
    },
    {
        id: "まずい",
        dictionary: "まずい",
        reading: "まずい",
        meaning: "unpleasant tasting",
        type: "i",
        conjugations: {
            nai: "まずくない",
            ta: "まずかった",
            nakatta: "まずくなかった",
            masu: "まずいです",
            masu_nai: "まずくありません",
            masu_ta: "まずかったです",
            masu_nakatta: "まずくありませんでした",
            conditional: "まずければ",
            te: "まずくて",
            adverbial: "まずく"
        },
        examples: [
            { sentence: "この薬（くすり）はまずいです", reading: "このくすりはまずいです", english: "This medicine tastes bad." }
        ]
    },
    {
        id: "はやい",
        dictionary: "速い",
        reading: "はやい",
        meaning: "fast",
        type: "i",
        conjugations: {
            nai: "速（はや）くない",
            ta: "速（はや）かった",
            nakatta: "速（はや）くなかった",
            masu: "速（はや）いです",
            masu_nai: "速（はや）くありません",
            masu_ta: "速（はや）かったです",
            masu_nakatta: "速（はや）くありませんでした",
            conditional: "速（はや）ければ",
            te: "速（はや）くて",
            adverbial: "速（はや）く"
        },
        examples: [
            { sentence: "飛行機（ひこうき）は速（はや）いですが少（すこ）し高（たか）いです", reading: "ひこうきははやいですがすこしたかいです", english: "The airplane is fast but a little expensive." }
        ]
    },
    {
        id: "おそい",
        dictionary: "遅い",
        reading: "おそい",
        meaning: "slow, late",
        type: "i",
        conjugations: {
            nai: "遅（おそ）くない",
            ta: "遅（おそ）かった",
            nakatta: "遅（おそ）くなかった",
            masu: "遅（おそ）いです",
            masu_nai: "遅（おそ）くありません",
            masu_ta: "遅（おそ）かったです",
            masu_nakatta: "遅（おそ）くありませんでした",
            conditional: "遅（おそ）ければ",
            te: "遅（おそ）くて",
            adverbial: "遅（おそ）く"
        },
        examples: [
            { sentence: "電車（でんしゃ）が遅（おそ）れています", reading: "でんしゃがおくれています", english: "The train is late." }
        ]
    },
    {
        id: "たのしい",
        dictionary: "楽しい",
        reading: "たのしい",
        meaning: "fun, enjoyable",
        type: "i",
        conjugations: {
            nai: "楽（たの）しくない",
            ta: "楽（たの）しかった",
            nakatta: "楽（たの）しくなかった",
            masu: "楽（たの）しいです",
            masu_nai: "楽（たの）しくありません",
            masu_ta: "楽（たの）しかったです",
            masu_nakatta: "楽（たの）しくありませんでした",
            conditional: "楽（たの）しければ",
            te: "楽（たの）しくて",
            adverbial: "楽（たの）しく"
        },
        examples: [
            { sentence: "日本語（にほんご）の授業（じゅぎょう）は楽（たの）しいです", reading: "にほんごのじゅぎょうはたのしいです", english: "Japanese class is fun." }
        ]
    },
    {
        id: "つらい",
        dictionary: "辛い",
        reading: "つらい",
        meaning: "painful, hard",
        type: "i",
        conjugations: {
            nai: "辛（つら）くない",
            ta: "辛（つら）かった",
            nakatta: "辛（つら）くなかった",
            masu: "辛（つら）いです",
            masu_nai: "辛（つら）くありません",
            masu_ta: "辛（つら）かったです",
            masu_nakatta: "辛（つら）くありませんでした",
            conditional: "辛（つら）ければ",
            te: "辛（つら）くて",
            adverbial: "辛（つら）く"
        },
        examples: [
            { sentence: "仕事（しごと）が辛（つら）いです", reading: "しごとがつらいです", english: "Work is hard." }
        ]
    },
    {
        id: "かるい",
        dictionary: "軽い",
        reading: "かるい",
        meaning: "light",
        type: "i",
        conjugations: {
            nai: "軽（かる）くない",
            ta: "軽（かる）かった",
            nakatta: "軽（かる）くなかった",
            masu: "軽（かる）いです",
            masu_nai: "軽（かる）くありません",
            masu_ta: "軽（かる）かったです",
            masu_nakatta: "軽（かる）くありませんでした",
            conditional: "軽（かる）ければ",
            te: "軽（かる）くて",
            adverbial: "軽（かる）く"
        },
        examples: [
            { sentence: "この荷物（にもつ）は軽（かる）いです", reading: "このにもつはかるいです", english: "This luggage is light." }
        ]
    },
    {
        id: "おもい",
        dictionary: "重い",
        reading: "おもい",
        meaning: "heavy",
        type: "i",
        conjugations: {
            nai: "重（おも）くない",
            ta: "重（おも）かった",
            nakatta: "重（おも）くなかった",
            masu: "重（おも）いです",
            masu_nai: "重（おも）くありません",
            masu_ta: "重（おも）かったです",
            masu_nakatta: "重（おも）くありませんでした",
            conditional: "重（おも）ければ",
            te: "重（おも）くて",
            adverbial: "重（おも）く"
        },
        examples: [
            { sentence: "この荷物（にもつ）は重（おも）いです", reading: "このにもつはおもいです", english: "This luggage is heavy." }
        ]
    },
    {
        id: "ひろい",
        dictionary: "広い",
        reading: "ひろい",
        meaning: "wide, spacious",
        type: "i",
        conjugations: {
            nai: "広（ひろ）くない",
            ta: "広（ひろ）かった",
            nakatta: "広（ひろ）くなかった",
            masu: "広（ひろ）いです",
            masu_nai: "広（ひろ）くありません",
            masu_ta: "広（ひろ）かったです",
            masu_nakatta: "広（ひろ）くありませんでした",
            conditional: "広（ひろ）ければ",
            te: "広（ひろ）くて",
            adverbial: "広（ひろ）く"
        },
        examples: [
            { sentence: "この部屋（へや）は広（ひろ）いです", reading: "このへやはひろいです", english: "This room is spacious." }
        ]
    },
    {
        id: "せまい",
        dictionary: "狭い",
        reading: "せまい",
        meaning: "narrow, cramped",
        type: "i",
        conjugations: {
            nai: "狭（せま）くない",
            ta: "狭（せま）かった",
            nakatta: "狭（せま）くなかった",
            masu: "狭（せま）いです",
            masu_nai: "狭（せま）くありません",
            masu_ta: "狭（せま）かったです",
            masu_nakatta: "狭（せま）くありませんでした",
            conditional: "狭（せま）ければ",
            te: "狭（せま）くて",
            adverbial: "狭（せま）く"
        },
        examples: [
            { sentence: "キッチンは狭（せま）いですが綺麗（きれい）です", reading: "きっちんはせまいですがきれいです", english: "The kitchen is small but clean." }
        ]
    },
    {
        id: "むずかしい",
        dictionary: "難しい",
        reading: "むずかしい",
        meaning: "difficult",
        type: "i",
        conjugations: {
            nai: "難（むずか）しくない",
            ta: "難（むずか）しかった",
            nakatta: "難（むずか）しくなかった",
            masu: "難（むずか）しいです",
            masu_nai: "難（むずか）しくありません",
            masu_ta: "難（むずか）しかったです",
            masu_nakatta: "難（むずか）しくありませんでした",
            conditional: "難（むずか）しければ",
            te: "難（むずか）しくて",
            adverbial: "難（むずか）しく"
        },
        examples: [
            { sentence: "発音（はつおん）が難（むずか）しいです", reading: "はつおんがむずかしいです", english: "Pronunciation is difficult." }
        ]
    },
    {
        id: "やさしい",
        dictionary: "易しい",
        reading: "やさしい",
        meaning: "easy",
        type: "i",
        conjugations: {
            nai: "易（やさ）しくない",
            ta: "易（やさ）しかった",
            nakatta: "易（やさ）しくなかった",
            masu: "易（やさ）しいです",
            masu_nai: "易（やさ）しくありません",
            masu_ta: "易（やさ）しかったです",
            masu_nakatta: "易（やさ）しくありませんでした",
            conditional: "易（やさ）しければ",
            te: "易（やさ）しくて",
            adverbial: "易（やさ）しく"
        },
        examples: [
            { sentence: "この問題（もんだい）は易（やさ）しいです", reading: "このもんだいはやさしいです", english: "This problem is easy." }
        ]
    },
    {
        id: "いそがしい",
        dictionary: "忙しい",
        reading: "いそがしい",
        meaning: "busy",
        type: "i",
        conjugations: {
            nai: "忙（いそが）しくない",
            ta: "忙（いそが）しかった",
            nakatta: "忙（いそが）しくなかった",
            masu: "忙（いそが）しいです",
            masu_nai: "忙（いそが）しくありません",
            masu_ta: "忙（いそが）しかったです",
            masu_nakatta: "忙（いそが）しくありませんでした",
            conditional: "忙（いそが）しければ",
            te: "忙（いそが）しくて",
            adverbial: "忙（いそが）しく"
        },
        examples: [
            { sentence: "忙（いそが）しいですか", reading: "いそがしいですか", english: "Are you busy?" }
        ]
    },

    // ========== な-ADJECTIVES (N5 Core) ==========
    {
        id: "しずか",
        dictionary: "静か",
        reading: "しずか",
        meaning: "quiet",
        type: "na",
        conjugations: {
            nai: "静（しず）かじゃない",
            ta: "静（しず）かだった",
            nakatta: "静（しず）かじゃなかった",
            masu: "静（しず）かです",
            masu_nai: "静（しず）かじゃありません",
            masu_ta: "静（しず）かでした",
            masu_nakatta: "静（しず）かじゃありませんでした",
            conditional: "静（しず）かなら",
            te: "静（しず）かで",
            adverbial: "静（しず）かに"
        },
        examples: [
            { sentence: "この辺（へん）は静（しず）かでいいですね", reading: "このへんはしずかでいいですね", english: "This area is quiet and nice." }
        ]
    },
    {
        id: "にぎやか",
        dictionary: "賑やか",
        reading: "にぎやか",
        meaning: "lively, bustling",
        type: "na",
        conjugations: {
            nai: "賑（にぎ）やかじゃない",
            ta: "賑（にぎ）やかだった",
            nakatta: "賑（にぎ）やかじゃなかった",
            masu: "賑（にぎ）やかです",
            masu_nai: "賑（にぎ）やかじゃありません",
            masu_ta: "賑（にぎ）やかでした",
            masu_nakatta: "賑（にぎ）やかじゃありませんでした",
            conditional: "賑（にぎ）やかなら",
            te: "賑（にぎ）やかで",
            adverbial: "賑（にぎ）やかに"
        },
        examples: [
            { sentence: "東京（とうきょう）は賑（にぎ）やかな街（まち）です", reading: "とうきょうはにぎやかなまちです", english: "Tokyo is a lively city." }
        ]
    },
    {
        id: "きれい",
        dictionary: "綺麗",
        reading: "きれい",
        meaning: "beautiful, clean",
        type: "na",
        conjugations: {
            nai: "綺麗（きれい）じゃない",
            ta: "綺麗（きれい）だった",
            nakatta: "綺麗（きれい）じゃなかった",
            masu: "綺麗（きれい）です",
            masu_nai: "綺麗（きれい）じゃありません",
            masu_ta: "綺麗（きれい）でした",
            masu_nakatta: "綺麗（きれい）じゃありませんでした",
            conditional: "綺麗（きれい）なら",
            te: "綺麗（きれい）で",
            adverbial: "綺麗（きれい）に"
        },
        examples: [
            { sentence: "彼女（かのじょ）は綺麗（きれい）な声（こえ）で歌（うた）います", reading: "かのじょはきれいなこえでうたいます", english: "She sings with a beautiful voice." }
        ]
    },
    {
        id: "ゆうめい",
        dictionary: "有名",
        reading: "ゆうめい",
        meaning: "famous",
        type: "na",
        conjugations: {
            nai: "有名（ゆうめい）じゃない",
            ta: "有名（ゆうめい）だった",
            nakatta: "有名（ゆうめい）じゃなかった",
            masu: "有名（ゆうめい）です",
            masu_nai: "有名（ゆうめい）じゃありません",
            masu_ta: "有名（ゆうめい）でした",
            masu_nakatta: "有名（ゆうめい）じゃありませんでした",
            conditional: "有名（ゆうめい）なら",
            te: "有名（ゆうめい）で",
            adverbial: "有名（ゆうめい）に"
        },
        examples: [
            { sentence: "このレストランは有名（ゆうめい）です", reading: "このれすとらんはゆうめいです", english: "This restaurant is famous." }
        ]
    },
    {
        id: "しんせつ",
        dictionary: "親切",
        reading: "しんせつ",
        meaning: "kind",
        type: "na",
        conjugations: {
            nai: "親切（しんせつ）じゃない",
            ta: "親切（しんせつ）だった",
            nakatta: "親切（しんせつ）じゃなかった",
            masu: "親切（しんせつ）です",
            masu_nai: "親切（しんせつ）じゃありません",
            masu_ta: "親切（しんせつ）でした",
            masu_nakatta: "親切（しんせつ）じゃありませんでした",
            conditional: "親切（しんせつ）なら",
            te: "親切（しんせつ）で",
            adverbial: "親切（しんせつ）に"
        },
        examples: [
            { sentence: "店員（てんいん）さんは親切（しんせつ）に説明（せつめい）してくれました", reading: "てんいんさんはしんせつにせつめいしてくれました", english: "The clerk kindly explained for me." }
        ]
    },
    {
        id: "げんき",
        dictionary: "元気",
        reading: "げんき",
        meaning: "healthy, energetic",
        type: "na",
        conjugations: {
            nai: "元気（げんき）じゃない",
            ta: "元気（げんき）だった",
            nakatta: "元気（げんき）じゃなかった",
            masu: "元気（げんき）です",
            masu_nai: "元気（げんき）じゃありません",
            masu_ta: "元気（げんき）でした",
            masu_nakatta: "元気（げんき）じゃありませんでした",
            conditional: "元気（げんき）なら",
            te: "元気（げんき）で",
            adverbial: "元気（げんき）に"
        },
        examples: [
            { sentence: "お元気（げんき）ですか", reading: "おげんきですか", english: "How are you?" }
        ]
    },
    {
        id: "すき",
        dictionary: "好き",
        reading: "すき",
        meaning: "liked",
        type: "na",
        conjugations: {
            nai: "好（す）きじゃない",
            ta: "好（す）きだった",
            nakatta: "好（す）きじゃなかった",
            masu: "好（す）きです",
            masu_nai: "好（す）きじゃありません",
            masu_ta: "好（す）きでした",
            masu_nakatta: "好（す）きじゃありませんでした",
            conditional: "好（す）きなら",
            te: "好（す）きで",
            adverbial: "好（す）きに"
        },
        examples: [
            { sentence: "夏（なつ）は冷（つめ）たいアイスクリームが一番（いちばん）好（す）きです", reading: "なつはつめたいあいすくりーむがいちばんすきです", english: "In summer, I like cold ice cream the most." }
        ]
    },
    {
        id: "だいすき",
        dictionary: "大好き",
        reading: "だいすき",
        meaning: "love",
        type: "na",
        conjugations: {
            nai: "大好（だいす）きじゃない",
            ta: "大好（だいす）きだった",
            nakatta: "大好（だいす）きじゃなかった",
            masu: "大好（だいす）きです",
            masu_nai: "大好（だいす）きじゃありません",
            masu_ta: "大好（だいす）きでした",
            masu_nakatta: "大好（だいす）きじゃありませんでした",
            conditional: "大好（だいす）きなら",
            te: "大好（だいす）きで",
            adverbial: "大好（だいす）きに"
        },
        examples: [
            { sentence: "両親（りょうしん）は旅行（りょこう）が大好（だいす）きです", reading: "りょうしんはりょこうがだいすきです", english: "My parents love traveling." }
        ]
    },
    {
        id: "きらい",
        dictionary: "嫌い",
        reading: "きらい",
        meaning: "disliked",
        type: "na",
        conjugations: {
            nai: "嫌（きら）いじゃない",
            ta: "嫌（きら）いだった",
            nakatta: "嫌（きら）いじゃなかった",
            masu: "嫌（きら）いです",
            masu_nai: "嫌（きら）いじゃありません",
            masu_ta: "嫌（きら）いでした",
            masu_nakatta: "嫌（きら）いじゃありませんでした",
            conditional: "嫌（きら）いなら",
            te: "嫌（きら）いで",
            adverbial: "嫌（きら）いに"
        },
        examples: [
            { sentence: "野菜（やさい）が嫌（きら）いです", reading: "やさいがきらいです", english: "I dislike vegetables." }
        ]
    },
    {
        id: "じょうず",
        dictionary: "上手",
        reading: "じょうず",
        meaning: "skilled, good at",
        type: "na",
        conjugations: {
            nai: "上手（じょうず）じゃない",
            ta: "上手（じょうず）だった",
            nakatta: "上手（じょうず）じゃなかった",
            masu: "上手（じょうず）です",
            masu_nai: "上手（じょうず）じゃありません",
            masu_ta: "上手（じょうず）でした",
            masu_nakatta: "上手（じょうず）じゃありませんでした",
            conditional: "上手（じょうず）なら",
            te: "上手（じょうず）で",
            adverbial: "上手（じょうず）に"
        },
        examples: [
            { sentence: "ダンスを踊（おど）るのが上手（じょうず）です", reading: "だんすをおどるのがじょうずです", english: "I'm good at dancing." }
        ]
    },
    {
        id: "へた",
        dictionary: "下手",
        reading: "へた",
        meaning: "unskilled, bad at",
        type: "na",
        conjugations: {
            nai: "下手（へた）じゃない",
            ta: "下手（へた）だった",
            nakatta: "下手（へた）じゃなかった",
            masu: "下手（へた）です",
            masu_nai: "下手（へた）じゃありません",
            masu_ta: "下手（へた）でした",
            masu_nakatta: "下手（へた）じゃありませんでした",
            conditional: "下手（へた）なら",
            te: "下手（へた）で",
            adverbial: "下手（へた）に"
        },
        examples: [
            { sentence: "歌（うた）うのが下手（へた）です", reading: "うたうのがへたです", english: "I'm bad at singing." }
        ]
    },
    {
        id: "べんり",
        dictionary: "便利",
        reading: "べんり",
        meaning: "convenient",
        type: "na",
        conjugations: {
            nai: "便利（べんり）じゃない",
            ta: "便利（べんり）だった",
            nakatta: "便利（べんり）じゃなかった",
            masu: "便利（べんり）です",
            masu_nai: "便利（べんり）じゃありません",
            masu_ta: "便利（べんり）でした",
            masu_nakatta: "便利（べんり）じゃありませんでした",
            conditional: "便利（べんり）なら",
            te: "便利（べんり）で",
            adverbial: "便利（べんり）に"
        },
        examples: [
            { sentence: "この電車（でんしゃ）は便利（べんり）です", reading: "このでんしゃはべんりです", english: "This train is convenient." }
        ]
    },
    {
        id: "ふべん",
        dictionary: "不便",
        reading: "ふべん",
        meaning: "inconvenient",
        type: "na",
        conjugations: {
            nai: "不便（ふべん）じゃない",
            ta: "不便（ふべん）だった",
            nakatta: "不便（ふべん）じゃなかった",
            masu: "不便（ふべん）です",
            masu_nai: "不便（ふべん）じゃありません",
            masu_ta: "不便（ふべん）でした",
            masu_nakatta: "不便（ふべん）じゃありませんでした",
            conditional: "不便（ふべん）なら",
            te: "不便（ふべん）で",
            adverbial: "不便（ふべん）に"
        },
        examples: [
            { sentence: "田舎（いなか）は不便（ふべん）です", reading: "いなかはふべんです", english: "The countryside is inconvenient." }
        ]
    },
    {
        id: "たいせつ",
        dictionary: "大切",
        reading: "たいせつ",
        meaning: "important, precious",
        type: "na",
        conjugations: {
            nai: "大切（たいせつ）じゃない",
            ta: "大切（たいせつ）だった",
            nakatta: "大切（たいせつ）じゃなかった",
            masu: "大切（たいせつ）です",
            masu_nai: "大切（たいせつ）じゃありません",
            masu_ta: "大切（たいせつ）でした",
            masu_nakatta: "大切（たいせつ）じゃありませんでした",
            conditional: "大切（たいせつ）なら",
            te: "大切（たいせつ）で",
            adverbial: "大切（たいせつ）に"
        },
        examples: [
            { sentence: "よく寝（ね）ることが大切（たいせつ）です", reading: "よくねることがたいせつです", english: "Getting enough sleep is important." }
        ]
    },
    {
        id: "ひつよう",
        dictionary: "必要",
        reading: "ひつよう",
        meaning: "necessary",
        type: "na",
        conjugations: {
            nai: "必要（ひつよう）じゃない",
            ta: "必要（ひつよう）だった",
            nakatta: "必要（ひつよう）じゃなかった",
            masu: "必要（ひつよう）です",
            masu_nai: "必要（ひつよう）じゃありません",
            masu_ta: "必要（ひつよう）でした",
            masu_nakatta: "必要（ひつよう）じゃありませんでした",
            conditional: "必要（ひつよう）なら",
            te: "必要（ひつよう）で",
            adverbial: "必要（ひつよう）に"
        },
        examples: [
            { sentence: "手術（しゅじゅつ）が必要（ひつよう）です", reading: "しゅじゅつがひつようです", english: "Surgery is necessary." }
        ]
    },
    {
        id: "じゆう",
        dictionary: "自由",
        reading: "じゆう",
        meaning: "free",
        type: "na",
        conjugations: {
            nai: "自由（じゆう）じゃない",
            ta: "自由（じゆう）だった",
            nakatta: "自由（じゆう）じゃなかった",
            masu: "自由（じゆう）です",
            masu_nai: "自由（じゆう）じゃありません",
            masu_ta: "自由（じゆう）でした",
            masu_nakatta: "自由（じゆう）じゃありませんでした",
            conditional: "自由（じゆう）なら",
            te: "自由（じゆう）で",
            adverbial: "自由（じゆう）に"
        },
        examples: [
            { sentence: "時間（じかん）が自由（じゆう）です", reading: "じかんがじゆうです", english: "My time is free." }
        ]
    },
    {
        id: "しあわせ",
        dictionary: "幸せ",
        reading: "しあわせ",
        meaning: "happy, fortunate",
        type: "na",
        conjugations: {
            nai: "幸（しあわ）せじゃない",
            ta: "幸（しあわ）せだった",
            nakatta: "幸（しあわ）せじゃなかった",
            masu: "幸（しあわ）せです",
            masu_nai: "幸（しあわ）せじゃありません",
            masu_ta: "幸（しあわ）せでした",
            masu_nakatta: "幸（しあわ）せじゃありませんでした",
            conditional: "幸（しあわ）せなら",
            te: "幸（しあわ）せで",
            adverbial: "幸（しあわ）せに"
        },
        examples: [
            { sentence: "彼女（かのじょ）の笑顔（えがお）を見（み）るだけで幸（しあわ）せです", reading: "かのじょのえがおをみるだけでしあわせです", english: "Just seeing her smile makes me happy." }
        ]
    },
    {
        id: "じょうぶ",
        dictionary: "丈夫",
        reading: "じょうぶ",
        meaning: "strong, durable",
        type: "na",
        conjugations: {
            nai: "丈夫（じょうぶ）じゃない",
            ta: "丈夫（じょうぶ）だった",
            nakatta: "丈夫（じょうぶ）じゃなかった",
            masu: "丈夫（じょうぶ）です",
            masu_nai: "丈夫（じょうぶ）じゃありません",
            masu_ta: "丈夫（じょうぶ）でした",
            masu_nakatta: "丈夫（じょうぶ）じゃありませんでした",
            conditional: "丈夫（じょうぶ）なら",
            te: "丈夫（じょうぶ）で",
            adverbial: "丈夫（じょうぶ）に"
        },
        examples: [
            { sentence: "この鞄（かばん）は丈夫（じょうぶ）です", reading: "このかばんはじょうぶです", english: "This bag is durable." }
        ]
    },
    {
        id: "まじめ",
        dictionary: "真面目",
        reading: "まじめ",
        meaning: "serious, diligent",
        type: "na",
        conjugations: {
            nai: "真面目（まじめ）じゃない",
            ta: "真面目（まじめ）だった",
            nakatta: "真面目（まじめ）じゃなかった",
            masu: "真面目（まじめ）です",
            masu_nai: "真面目（まじめ）じゃありません",
            masu_ta: "真面目（まじめ）でした",
            masu_nakatta: "真面目（まじめ）じゃありませんでした",
            conditional: "真面目（まじめ）なら",
            te: "真面目（まじめ）で",
            adverbial: "真面目（まじめ）に"
        },
        examples: [
            { sentence: "彼（かれ）はとても真面目（まじめ）な人間（にんげん）です", reading: "かれはとてもまじめなにんげんです", english: "He is a very serious person." }
        ]
    }
];

const adjectiveOrder = adjectivesData.map(a => a.id);

function getAdjectiveById(id) {
    return adjectivesData.find(a => a.id === id);
}

function getAdjectiveTypeDisplay(type) {
    return type === 'i' ? 'い-adjective' : 'な-adjective';
}