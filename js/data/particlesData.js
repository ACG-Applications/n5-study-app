// ==================== PARTICLE DATA ====================
const particlesData = {
  // Core Particles
  "は": {
    name: "wa (topic marker)",
    function: "Defines the topic of the sentence. Emphasizes information AFTER は.",
    position: "Topic + は + Comment",
    usageNote: "Used to mark what the sentence is about. Can be thought of as 'as for...' or 'speaking of...'",
    confusingWith: "が",
    category: "core",
    supplementaryExample: null
  },
  "が": {
    name: "ga (subject marker)",
    function: "Defines the doer of the action. Emphasizes information BEFORE が.",
    position: "Subject + が + Predicate",
    usageNote: "Used to mark new information, the subject of existence (ある/いる), and with likes/dislikes (好き/嫌い/欲しい).",
    confusingWith: "は",
    category: "core",
    supplementaryExample: null
  },
  "を": {
    name: "wo (object marker)",
    function: "Marks the direct object of an action verb.",
    position: "Subject + Object + を + Verb",
    usageNote: "Only used with transitive verbs (actions done to something). The を is often pronounced 'o'.",
    confusingWith: null,
    category: "core",
    supplementaryExample: null
  },
  "に": {
    name: "ni (time/direction/existence)",
    function: "Indicates a specific point in time, direction of movement, or location of existence.",
    position: "Time/Place + に + Verb",
    usageNote: "Used with specific times (3時, 日曜日), destinations (学校に行く), and existence location (公園にある).",
    confusingWith: "で",
    category: "core",
    supplementaryExample: null
  },
  "で": {
    name: "de (location/means)",
    function: "Indicates where an action takes place or the means by which something is done.",
    position: "Place/Means + で + Action Verb",
    usageNote: "Used for action locations (公園で遊ぶ) and methods/instruments (電車で行く, ペンで書く).",
    confusingWith: "に",
    category: "core",
    supplementaryExample: null
  },
  "へ": {
    name: "e (direction)",
    function: "Indicates the general direction of movement.",
    position: "Direction + へ + Movement Verb",
    usageNote: "Similar to に for destinations, but へ emphasizes the direction/general path rather than arrival. Pronounced 'e'.",
    confusingWith: "に",
    category: "core",
    supplementaryExample: null
  },
  "と": {
    name: "to (and/with)",
    function: "Connects nouns (and) or indicates accompaniment (with).",
    position: "Noun A + と + Noun B  OR  Person + と + Verb",
    usageNote: "Used to list items (犬と猫) or indicate doing something with someone (友達と行く). Also used for quoting (と言う).",
    confusingWith: null,
    category: "core",
    supplementaryExample: null
  },
  "から": {
    name: "kara (from)",
    function: "Indicates origin, starting point in time or space.",
    position: "Origin + から + Verb",
    usageNote: "Can be used for time (10時から) and place (東京から). Also means 'because' when used after a clause.",
    confusingWith: "まで",
    category: "core",
    supplementaryExample: null
  },
  "まで": {
    name: "made (until/to)",
    function: "Indicates an end point in time or space.",
    position: "End Point + まで + Verb",
    usageNote: "Used with time (5時まで) or place (大阪まで). Often paired with から (from...to).",
    confusingWith: "から",
    category: "core",
    supplementaryExample: null
  },
  "の": {
    name: "no (possession/linking)",
    function: "Connects nouns to show possession, description, or relationship.",
    position: "Noun A + の + Noun B",
    usageNote: "Shows possession (私の本), describes attributes (日本語の授業), or indicates origin (東京の友達). Also nominalizes verbs (食べるの).",
    confusingWith: null,
    category: "core",
    supplementaryExample: null
  },
  "も": {
    name: "mo (also/even)",
    function: "Indicates 'also', 'too', or 'even'.",
    position: "Replaces は, が, を; adds to other particles",
    usageNote: "Shows that something is in addition to something else. Can also mean 'as many as' with quantities.",
    confusingWith: null,
    category: "core",
    supplementaryExample: {
      jp: "私（わたし）も行（い）きます",
      reading: "わたしもいきます",
      translation: "I will go too."
    }
  },
  "か": {
    name: "ka (question/or)",
    function: "Marks a question or indicates choice ('or').",
    position: "End of sentence (question) or between nouns (or)",
    usageNote: "At the end of a sentence makes it a question. Between nouns means 'or'.",
    confusingWith: null,
    category: "core",
    supplementaryExample: {
      jp: "これ（は）本（ほん）ですか",
      reading: "これはほんですか",
      translation: "Is this a book?"
    }
  },
  "よ": {
    name: "yo (emphasis)",
    function: "Adds emphasis, certainty, or new information.",
    position: "End of sentence",
    usageNote: "Used to inform the listener of something they may not know. Adds a sense of certainty or assertion.",
    confusingWith: "ね",
    category: "core",
    supplementaryExample: {
      jp: "これ（は）本（ほん）ですよ",
      reading: "これはほんですよ",
      translation: "This is a book (I'm telling you)."
    }
  },
  "ね": {
    name: "ne (confirmation)",
    function: "Seeks agreement or confirmation.",
    position: "End of sentence",
    usageNote: "Used to seek agreement, like 'isn't it?' or 'right?' Creates a friendly, inclusive tone.",
    confusingWith: "よ",
    category: "core",
    supplementaryExample: {
      jp: "いい天気（てんき）ですね",
      reading: "いいてんきですね",
      translation: "Nice weather, isn't it?"
    }
  },
  "や": {
    name: "ya (partial listing)",
    function: "Lists examples ('things like...', 'such as...').",
    position: "Between nouns",
    usageNote: "Used to list incomplete examples, implying there are more items not listed. Unlike と which lists everything.",
    confusingWith: "と",
    category: "core",
    supplementaryExample: {
      jp: "りんごやバナナを食（た）べます",
      reading: "りんごやバななをたべます",
      translation: "I eat things like apples and bananas."
    }
  },
  
  // Confusing Pairs
  "pair_wa_ga": {
    name: "は vs が",
    description: "The most common confusion for learners. Both mark the subject/topic but with different emphasis.",
    rule1: "は emphasizes what comes AFTER (the comment about the topic)",
    rule2: "が emphasizes what comes BEFORE (the subject doing the action)",
    example1: "私（わたし）は学生（がくせい）です → I am a student (emphasis on 'student')",
    example2: "私（わたし）が学生（がくせい）です → I am the student (emphasis on 'me', not someone else)",
    additionalNote: "が is also used with existence verbs (ある/いる) and with likes/dislikes (好き/嫌い).",
    category: "pair"
  },
  "pair_ni_de": {
    name: "に vs で (location)",
    description: "Both indicate location, but with different types of verbs.",
    rule1: "に is for existence (ある/いる) — where something IS",
    rule2: "で is for action — where something HAPPENS",
    example1: "公園（こうえん）に犬（いぬ）がいます → There is a dog in the park (existence)",
    example2: "公園（こうえん）で遊（あそ）びます → Play in the park (action)",
    additionalNote: "に can also indicate destination (学校に行く) while で indicates means (電車で行く).",
    category: "pair"
  },
  "pair_ni_e": {
    name: "に vs へ (direction)",
    description: "Both indicate movement toward a place. Often interchangeable, but subtle differences exist.",
    rule1: "に emphasizes ARRIVAL at a specific destination",
    rule2: "へ emphasizes the DIRECTION of movement (more general)",
    example1: "東京（とうきょう）に行（い）きます → Go TO Tokyo (arrival focused, destination is the goal)",
    example2: "東京（とうきょう）へ行（い）きます → Go TOWARD Tokyo (direction focused, journey matters more)",
    additionalNote: "へ can be used even if you don't have a specific destination (e.g., 右へ曲がる - turn to the right).",
    category: "pair"
  }
};

// Particle order for display
const particleOrder = ["は", "が", "を", "に", "で", "へ", "と", "から", "まで", "の", "も", "か", "よ", "ね", "や"];

// Particle pair order for display
const particlePairOrder = ["pair_wa_ga", "pair_ni_de", "pair_ni_e"];