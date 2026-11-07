export type PartOfSpeech = "noun" | "verb" | "phrase" | "adjective" | "adverb" | "pronoun";

export interface VerbForms {
  infinitiv: string;
  present: Record<string, string>;
  note?: string;
}

export interface VocabularyItem {
  id: string;
  lemma: string;
  pos: PartOfSpeech;
  posLabel: string;
  meaningVi: string;
  phonetic: string;
  article?: "der" | "die" | "das";
  gender?: "m" | "f" | "n";
  plural?: string;
  verbForms?: VerbForms;
  note?: string;
  examples: { de: string; vi: string }[];
  lessonId: string;
  topicIds: string[];
}

export interface GrammarTopic {
  id: string;
  lessonId: string;
  title: string;
  subtitle: string;
  rule: string[];
  formula?: string;
  table?: { headers: string[]; rows: string[][] };
  examples: { de: string; vi: string; note?: string }[];
  exception?: string;
  linkedExerciseIds: string[];
  linkedVocabularyIds: string[];
}

export type QuestionType = "mcq" | "truefalse" | "fill" | "order";

export interface ExerciseQuestion {
  id: string;
  type: QuestionType;
  instruction: string;
  prompt: string;
  options?: { id: string; label: string }[];
  answer: string | string[];
  acceptable?: string[];
  words?: string[];
  explanation: string;
  translation?: string;
}

export interface Exercise {
  id: string;
  category: "workbook" | "custom";
  lessonId: string;
  title: string;
  description: string;
  topicIds: string[];
  sourceKind: "workbook_reference" | "original";
  reference: string;
  estimatedMinutes: number;
  questions: ExerciseQuestion[];
}

export interface ReadingQuestion {
  id: string;
  type: "mcq" | "truefalse";
  prompt: string;
  options: { id: string; label: string }[];
  answer: string;
  explanation: string;
}

export interface ReadingPassage {
  id: string;
  lessonId: string;
  title: string;
  subtitle: string;
  paragraphs: { de: string; vi?: string }[];
  tip: string;
  questions: ReadingQuestion[];
}

export interface ListeningItem {
  id: string;
  lessonId: string;
  title: string;
  subtitle: string;
  transcript: string;
  translation: string;
  notes: string[];
}

export interface WritingPrompt {
  id: string;
  lessonId: string;
  type: "sentence" | "paragraph";
  title: string;
  instruction: string;
  requirements: string[];
  targetVocabulary: string[];
  targetGrammar: string[];
  wordGuidance: string;
  sample: string;
}

export interface ShadowingItem {
  id: string;
  text: string;
  translation: string;
  topic: string;
}

export interface SpeakingExamPrompt {
  id: string;
  title: string;
  topic: string;
  instructions: string[];
  keywords: string[];
  template: { de: string; vi: string }[];
}

export const lesson = {
  id: "lektion-1",
  number: 1,
  level: "A1",
  title: "Guten Tag!",
  subtitle: "Chào hỏi, giới thiệu bản thân và đánh vần tên",
  objectives: [
    "Chào hỏi và tạm biệt trong các tình huống trang trọng và thân mật",
    "Giới thiệu tên, quê quán và nơi sinh sống",
    "Chia động từ thường ở thì hiện tại với ich, du, Sie",
    "Đặt câu hỏi với W-Wort để hỏi thông tin cá nhân",
  ],
  bookReference: "Menschen A1, Lektion 1",
};

export const lessonList = [
  lesson,
  {
    id: "lektion-2",
    number: 2,
    level: "A1",
    title: "Freunde, Kollegen und ich",
    subtitle: "Nghề nghiệp, xuất thân, ngôn ngữ và đại từ nhân xưng",
    available: false,
  },
  {
    id: "lektion-3",
    number: 3,
    level: "A1",
    title: "In der Stadt",
    subtitle: "Hỏi đường, địa điểm công cộng, phương tiện giao thông",
    available: false,
  },
  {
    id: "lektion-4",
    number: 4,
    level: "A1",
    title: "Guten Appetit!",
    subtitle: "Đồ ăn, thức uống, thói quen ăn uống và đơn vị đo lường",
    available: false,
  },
];

export const vocabulary: VocabularyItem[] = [
  {
    id: "voc-name",
    lemma: "der Name",
    pos: "noun",
    posLabel: "Danh từ",
    meaningVi: "Tên, họ tên",
    phonetic: "[ˈnaːmə]",
    article: "der",
    gender: "m",
    plural: "die Namen",
    note: "Dùng trong chào hỏi, giới thiệu bản thân hoặc hỏi tên đối phương.",
    examples: [
      { de: "Mein Name ist Minh Anh.", vi: "Tên tôi là Minh Anh." },
      { de: "Wie ist Ihr Name?", vi: "Tên của ông/bà là gì?" },
      { de: "Der Name ist kurz und leicht.", vi: "Cái tên ngắn và dễ nhớ." },
    ],
    lessonId: "lektion-1",
    topicIds: ["begruessung"],
  },
  {
    id: "voc-heissen",
    lemma: "heißen",
    pos: "verb",
    posLabel: "Động từ",
    meaningVi: "Tên là, gọi là",
    phonetic: "[ˈhaɪ̯sn̩]",
    note: "Động từ bất quy tắc nhẹ: ngôi du mất -en và thêm -t → du heißt.",
    verbForms: {
      infinitiv: "heißen",
      present: {
        ich: "heiße",
        du: "heißt",
        "er/sie/es": "heißt",
        wir: "heißen",
        ihr: "heißt",
        "sie/Sie": "heißen",
      },
    },
    examples: [
      { de: "Ich heiße Minh Anh.", vi: "Tôi tên là Minh Anh." },
      { de: "Wie heißen Sie?", vi: "Ông/bà tên là gì?" },
      { de: "Er heißt Paco.", vi: "Anh ấy tên là Paco." },
    ],
    lessonId: "lektion-1",
    topicIds: ["praesens", "w-frage"],
  },
  {
    id: "voc-kommen",
    lemma: "kommen",
    pos: "verb",
    posLabel: "Động từ",
    meaningVi: "Đến từ, tới",
    phonetic: "[ˈkɔmən]",
    note: "Cấu trúc đến từ một nơi: kommen aus + quốc gia/thành phố.",
    verbForms: {
      infinitiv: "kommen",
      present: {
        ich: "komme",
        du: "kommst",
        "er/sie/es": "kommt",
        wir: "kommen",
        ihr: "kommt",
        "sie/Sie": "kommen",
      },
    },
    examples: [
      { de: "Ich komme aus Vietnam.", vi: "Tôi đến từ Việt Nam." },
      { de: "Woher kommen Sie?", vi: "Ông/bà đến từ đâu?" },
      { de: "Paco kommt aus Spanien.", vi: "Paco đến từ Tây Ban Nha." },
    ],
    lessonId: "lektion-1",
    topicIds: ["praesens", "w-frage"],
  },
  {
    id: "voc-guten-tag",
    lemma: "Guten Tag",
    pos: "phrase",
    posLabel: "Cụm từ",
    meaningVi: "Xin chào (trang trọng)",
    phonetic: "[ˌɡuːtn̩ ˈtaːk]",
    note: "Dùng vào ban ngày với người lạ hoặc trong ngữ cảnh trang trọng. Thân mật hơn: Hallo.",
    examples: [
      { de: "Guten Tag, ich heiße Paco.", vi: "Xin chào, tôi tên là Paco." },
      { de: "Guten Tag, Frau Weber!", vi: "Xin chào cô Weber!" },
    ],
    lessonId: "lektion-1",
    topicIds: ["begruessung"],
  },
  {
    id: "voc-sprache",
    lemma: "die Sprache",
    pos: "noun",
    posLabel: "Danh từ",
    meaningVi: "Ngôn ngữ, tiếng",
    phonetic: "[ˈʃpʁaːxə]",
    article: "die",
    gender: "f",
    plural: "die Sprachen",
    examples: [
      { de: "Deutsch ist eine schöne Sprache.", vi: "Tiếng Đức là một ngôn ngữ đẹp." },
      { de: "Welche Sprachen sprechen Sie?", vi: "Ông/bà nói những ngôn ngữ nào?" },
    ],
    lessonId: "lektion-1",
    topicIds: ["begruessung"],
  },
  {
    id: "voc-sprechen",
    lemma: "sprechen",
    pos: "verb",
    posLabel: "Động từ",
    meaningVi: "Nói, phát âm",
    phonetic: "[ˈʃpʁɛçn̩]",
    note: "Bất quy tắc: e → i/ie ở ngôi du và er/sie/es. du sprichst, er spricht.",
    verbForms: {
      infinitiv: "sprechen",
      present: {
        ich: "spreche",
        du: "sprichst",
        "er/sie/es": "spricht",
        wir: "sprechen",
        ihr: "sprecht",
        "sie/Sie": "sprechen",
      },
    },
    examples: [
      { de: "Ich spreche Vietnamesisch und Deutsch.", vi: "Tôi nói tiếng Việt và tiếng Đức." },
      { de: "Sprechen Sie Englisch?", vi: "Ông/bà nói tiếng Anh không?" },
    ],
    lessonId: "lektion-1",
    topicIds: ["praesens", "w-frage"],
  },
  {
    id: "voc-wohnen",
    lemma: "wohnen",
    pos: "verb",
    posLabel: "Động từ",
    meaningVi: "Sống, ở",
    phonetic: "[ˈvoːnən]",
    note: "wohnen in + thành phố/quốc gia: Ich wohne in Berlin.",
    verbForms: {
      infinitiv: "wohnen",
      present: {
        ich: "wohne",
        du: "wohnst",
        "er/sie/es": "wohnt",
        wir: "wohnen",
        ihr: "wohnt",
        "sie/Sie": "wohnen",
      },
    },
    examples: [
      { de: "Ich wohne jetzt in Berlin.", vi: "Hiện tôi sống ở Berlin." },
      { de: "Wo wohnen Sie?", vi: "Ông/bà sống ở đâu?" },
    ],
    lessonId: "lektion-1",
    topicIds: ["praesens", "w-frage"],
  },
  {
    id: "voc-land",
    lemma: "das Land",
    pos: "noun",
    posLabel: "Danh từ",
    meaningVi: "Đất nước, quốc gia",
    phonetic: "[lant]",
    article: "das",
    gender: "n",
    plural: "die Länder",
    examples: [
      { de: "Vietnam ist mein Land.", vi: "Việt Nam là đất nước của tôi." },
      { de: "Aus welchem Land kommen Sie?", vi: "Ông/bà đến từ nước nào?" },
    ],
    lessonId: "lektion-1",
    topicIds: ["begruessung"],
  },
  {
    id: "voc-stadt",
    lemma: "die Stadt",
    pos: "noun",
    posLabel: "Danh từ",
    meaningVi: "Thành phố",
    phonetic: "[ʃtat]",
    article: "die",
    gender: "f",
    plural: "die Städte",
    examples: [
      { de: "Berlin ist eine große Stadt.", vi: "Berlin là một thành phố lớn." },
      { de: "Ich wohne in einer kleinen Stadt.", vi: "Tôi sống ở một thành phố nhỏ." },
    ],
    lessonId: "lektion-1",
    topicIds: ["begruessung"],
  },
  {
    id: "voc-freund",
    lemma: "der Freund",
    pos: "noun",
    posLabel: "Danh từ",
    meaningVi: "Bạn (nam), người bạn",
    phonetic: "[fʁɔɪ̯nt]",
    article: "der",
    gender: "m",
    plural: "die Freunde",
    examples: [
      { de: "Mein Freund heißt Jan.", vi: "Bạn tôi tên là Jan." },
      { de: "Wir sind gute Freunde.", vi: "Chúng tôi là bạn tốt." },
    ],
    lessonId: "lektion-1",
    topicIds: ["begruessung"],
  },
  {
    id: "voc-frau",
    lemma: "die Frau",
    pos: "noun",
    posLabel: "Danh từ",
    meaningVi: "Phụ nữ, bà, cô",
    phonetic: "[fʁaʊ̯]",
    article: "die",
    gender: "f",
    plural: "die Frauen",
    examples: [
      { de: "Das ist Frau Weber.", vi: "Đây là cô Weber." },
      { de: "Die Frau kommt aus Österreich.", vi: "Người phụ nữ đến từ Áo." },
    ],
    lessonId: "lektion-1",
    topicIds: ["begruessung"],
  },
  {
    id: "voc-mann",
    lemma: "der Mann",
    pos: "noun",
    posLabel: "Danh từ",
    meaningVi: "Đàn ông, người đàn ông",
    phonetic: "[man]",
    article: "der",
    gender: "m",
    plural: "die Männer",
    examples: [
      { de: "Der Mann heißt Paco.", vi: "Người đàn ông tên là Paco." },
      { de: "Wer ist dieser Mann?", vi: "Người đàn ông này là ai?" },
    ],
    lessonId: "lektion-1",
    topicIds: ["begruessung"],
  },
  {
    id: "voc-herkunft",
    lemma: "die Herkunft",
    pos: "noun",
    posLabel: "Danh từ",
    meaningVi: "Nguồn gốc, xuất thân",
    phonetic: "[ˈheːɐ̯kʊnft]",
    article: "die",
    gender: "f",
    plural: "die Herkünfte",
    note: "Thường gặp trong biểu mẫu: Herkunftsland = quốc gia xuất thân.",
    examples: [
      { de: "Meine Herkunft ist Vietnam.", vi: "Nguồn gốc của tôi là Việt Nam." },
    ],
    lessonId: "lektion-1",
    topicIds: ["begruessung"],
  },
  {
    id: "voc-alter",
    lemma: "das Alter",
    pos: "noun",
    posLabel: "Danh từ",
    meaningVi: "Tuổi",
    phonetic: "[ˈaltɐ]",
    article: "das",
    gender: "n",
    plural: "die Alter",
    examples: [
      { de: "Wie ist Ihr Alter?", vi: "Tuổi của ông/bà là bao nhiêu?" },
      { de: "Mein Alter ist dreiundzwanzig.", vi: "Tuổi tôi là hai mươi ba." },
    ],
    lessonId: "lektion-1",
    topicIds: ["w-frage"],
  },
];

export const grammarTopics: GrammarTopic[] = [
  {
    id: "gram-sein",
    lessonId: "lektion-1",
    title: "Động từ sein & đại từ nhân xưng",
    subtitle: "Nền tảng để giới thiệu tên, quê quán và trạng thái",
    rule: [
      "sein tương đương “thì, là, ở” trong tiếng Việt và là động từ bất quy tắc quan trọng nhất.",
      "Đại từ nhân xưng chia theo ngôi: ich, du, er/sie/es, wir, ihr, sie/Sie.",
      "Dùng Sie (viết hoa) để xưng hô lịch sự với người lạ, người lớn tuổi hoặc trong ngữ cảnh công việc.",
    ],
    formula: "Subjekt + sein (chia) + thông tin",
    table: {
      headers: ["Ngôi", "sein", "Ví dụ"],
      rows: [
        ["ich", "bin", "Ich bin Minh Anh."],
        ["du", "bist", "Du bist Paco."],
        ["er / sie / es", "ist", "Er ist Jan."],
        ["wir", "sind", "Wir sind Freunde."],
        ["ihr", "seid", "Ihr seid Studenten."],
        ["sie / Sie", "sind", "Sie sind Frau Weber."],
      ],
    },
    examples: [
      { de: "Ich bin Minh Anh.", vi: "Tôi là Minh Anh." },
      { de: "Sind Sie Frau Weber?", vi: "Bà có phải cô Weber không?" },
      { de: "Wir sind aus Vietnam.", vi: "Chúng tôi đến từ Việt Nam." },
    ],
    exception: "Không dùng sein để nói “đến từ”: dùng kommen aus. “Ich bin aus Vietnam” nghe được nhưng kém tự nhiên trong bài giới thiệu.",
    linkedExerciseIds: ["wb-1", "wb-3"],
    linkedVocabularyIds: ["voc-guten-tag", "voc-name"],
  },
  {
    id: "gram-praesens",
    lessonId: "lektion-1",
    title: "Chia động từ thường ở thì hiện tại",
    subtitle: "Präsens: quy tắc chia đuôi cho động từ có quy tắc",
    rule: [
      "Bỏ đuôi -en của động từ nguyên thể để lấy thân từ (Verbstamm).",
      "Thêm đuôi theo ngôi: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en.",
      "Nếu thân từ kết thúc bằng -t hoặc -d, thêm -e trước đuôi ở ngôi du và er/sie/es: du arbeitest, er arbeitet.",
    ],
    formula: "komm-en → komm- + -e (ich) = ich komme",
    table: {
      headers: ["Ngôi", "kommen", "heißen", "wohnen"],
      rows: [
        ["ich", "komme", "heiße", "wohne"],
        ["du", "kommst", "heißt", "wohnst"],
        ["er / sie / es", "kommt", "heißt", "wohnt"],
        ["wir", "kommen", "heißen", "wohnen"],
        ["ihr", "kommt", "heißt", "wohnt"],
        ["sie / Sie", "kommen", "heißen", "wohnen"],
      ],
    },
    examples: [
      { de: "Ich komme aus Vietnam.", vi: "Tôi đến từ Việt Nam." },
      { de: "Wo wohnst du?", vi: "Bạn sống ở đâu?" },
      { de: "Er spricht Deutsch.", vi: "Anh ấy nói tiếng Đức.", note: "sprechen bất quy tắc: e → i ở ngôi er." },
    ],
    exception: "heißen có thân từ kết thúc bằng -ß nên ngôi du là heißt (không phải heißst).",
    linkedExerciseIds: ["wb-2", "ct-1"],
    linkedVocabularyIds: ["voc-kommen", "voc-heissen", "voc-wohnen", "voc-sprechen"],
  },
  {
    id: "gram-w-frage",
    lessonId: "lektion-1",
    title: "Câu hỏi W-Frage & trật tự từ",
    subtitle: "Hỏi tên, quê quán, nơi sống và ngôn ngữ",
    rule: [
      "Câu hỏi có từ để hỏi bắt đầu bằng W-Wort, sau đó là động từ chia, rồi chủ ngữ.",
      "Công thức: W-Wort + Verb + Subjekt + ...?",
      "Các từ hỏi quan trọng: Wie (như thế nào), Woher (từ đâu), Wo (ở đâu), Wer (ai), Was (cái gì).",
    ],
    formula: "Wie + heißt + du? · Woher + kommen + Sie?",
    examples: [
      { de: "Wie heißen Sie?", vi: "Ông/bà tên là gì?" },
      { de: "Woher kommst du?", vi: "Bạn đến từ đâu?" },
      { de: "Wo wohnen Sie?", vi: "Ông/bà sống ở đâu?" },
      { de: "Welche Sprachen sprechen Sie?", vi: "Ông/bà nói những ngôn ngữ nào?" },
    ],
    exception: "Với câu hỏi Ja/Nein, động từ đứng đầu câu: Sprechen Sie Deutsch?",
    linkedExerciseIds: ["wb-3", "ct-3"],
    linkedVocabularyIds: ["voc-heissen", "voc-kommen", "voc-wohnen", "voc-sprechen"],
  },
];

export const exercises: Exercise[] = [
  {
    id: "wb-1",
    category: "workbook",
    lessonId: "lektion-1",
    title: "Übung 1: Begrüßung & Kennenlernen",
    description: "Luyện các mẫu câu chào hỏi, tạm biệt và tự giới thiệu bản thân bằng tiếng Đức cơ bản.",
    topicIds: ["begruessung", "w-frage"],
    sourceKind: "workbook_reference",
    reference: "Menschen A1 Arbeitsbuch, Lektion 1, Übung 1–2 (biên soạn tương đương)",
    estimatedMinutes: 6,
    questions: [
      {
        id: "q1",
        type: "mcq",
        instruction: "Chọn câu chào phù hợp với ngữ cảnh trang trọng.",
        prompt: "Bạn gặp giáo viên lần đầu vào buổi sáng. Câu nào phù hợp nhất?",
        options: [
          { id: "a", label: "Hallo, Paco!" },
          { id: "b", label: "Guten Tag, Frau Weber!" },
          { id: "c", label: "Tschüs, Frau Weber!" },
        ],
        answer: "b",
        explanation: "“Guten Tag” là lời chào trang trọng dùng ban ngày. “Hallo” thân mật, “Tschüs” là tạm biệt.",
      },
      {
        id: "q2",
        type: "truefalse",
        instruction: "Đúng hay sai?",
        prompt: "“Wie heißen Sie?” dùng để hỏi tên một cách lịch sự.",
        options: [
          { id: "true", label: "Richtig" },
          { id: "false", label: "Falsch" },
        ],
        answer: "true",
        explanation: "Wie heißen Sie? = Ông/bà tên là gì? Đây là cách hỏi tên lịch sự với Sie.",
      },
      {
        id: "q3",
        type: "fill",
        instruction: "Điền từ còn thiếu.",
        prompt: "Guten Tag, ich ______ Paco.",
        answer: "heiße",
        acceptable: ["heiße", "heisse"],
        explanation: "Với ngôi ich, heißen → heiße.",
        translation: "Xin chào, tôi tên là Paco.",
      },
      {
        id: "q4",
        type: "order",
        instruction: "Sắp xếp các từ thành câu hỏi hoàn chỉnh.",
        prompt: "Sắp xếp thành câu hỏi: bạn đến từ đâu?",
        words: ["Woher", "kommst", "du"],
        answer: ["Woher", "kommst", "du"],
        explanation: "Câu hỏi W-Frage: W-Wort + Verb + Subjekt → Woher kommst du?",
        translation: "Bạn đến từ đâu?",
      },
      {
        id: "q5",
        type: "mcq",
        instruction: "Chọn đáp án đúng.",
        prompt: "“Ich komme aus Vietnam.” trả lời cho câu hỏi nào?",
        options: [
          { id: "a", label: "Wo wohnst du?" },
          { id: "b", label: "Woher kommst du?" },
          { id: "c", label: "Wie heißt du?" },
        ],
        answer: "b",
        explanation: "kommen aus trả lời cho Woher (từ đâu). Wo hỏi nơi sống, Wie heißt hỏi tên.",
      },
    ],
  },
  {
    id: "wb-2",
    category: "workbook",
    lessonId: "lektion-1",
    title: "Übung 2: Chia động từ thường (Präsens)",
    description: "Luyện quy tắc chia đuôi động từ ở thì hiện tại cho ich, du, Sie và số nhiều.",
    topicIds: ["praesens"],
    sourceKind: "workbook_reference",
    reference: "Menschen A1 Arbeitsbuch, Lektion 1, Übung 3–4 (biên soạn tương đương)",
    estimatedMinutes: 8,
    questions: [
      {
        id: "q1",
        type: "fill",
        instruction: "Chia động từ trong ngoặc.",
        prompt: "Ich ______ aus Vietnam. (kommen)",
        answer: "komme",
        explanation: "Ngôi ich: bỏ -en, thêm -e → komme.",
        translation: "Tôi đến từ Việt Nam.",
      },
      {
        id: "q2",
        type: "fill",
        instruction: "Chia động từ trong ngoặc.",
        prompt: "Wo ______ du? (wohnen)",
        answer: "wohnst",
        explanation: "Ngôi du: wohn- + -st → wohnst.",
        translation: "Bạn sống ở đâu?",
      },
      {
        id: "q3",
        type: "mcq",
        instruction: "Chọn dạng đúng của động từ.",
        prompt: "Er ______ Deutsch. (sprechen)",
        options: [
          { id: "a", label: "spreche" },
          { id: "b", label: "sprichst" },
          { id: "c", label: "spricht" },
        ],
        answer: "c",
        explanation: "sprechen bất quy tắc: ngôi er/sie/es đổi e → i và thêm -t → spricht.",
      },
      {
        id: "q4",
        type: "fill",
        instruction: "Chia động từ trong ngoặc.",
        prompt: "Sie ______ Frau Weber. (sein)",
        answer: "sind",
        explanation: "Ngôi Sie (lịch sự) dùng sind, giống ngôi sie số nhiều.",
        translation: "Bà là cô Weber.",
      },
      {
        id: "q5",
        type: "truefalse",
        instruction: "Đúng hay sai?",
        prompt: "Dạng đúng của heißen ở ngôi du là “du heißst”.",
        options: [
          { id: "true", label: "Richtig" },
          { id: "false", label: "Falsch" },
        ],
        answer: "false",
        explanation: "Thân từ heiße- đã có -ß, chỉ thêm -t: du heißt. Không viết heißst.",
      },
      {
        id: "q6",
        type: "order",
        instruction: "Sắp xếp thành câu hoàn chỉnh.",
        prompt: "Sắp xếp: Tôi nói tiếng Việt và tiếng Đức.",
        words: ["Ich", "spreche", "Vietnamesisch", "und", "Deutsch"],
        answer: ["Ich", "spreche", "Vietnamesisch", "und", "Deutsch"],
        explanation: "Trật tự câu trần thuật: Subjekt + Verb + ... → Ich spreche Vietnamesisch und Deutsch.",
        translation: "Tôi nói tiếng Việt và tiếng Đức.",
      },
    ],
  },
  {
    id: "wb-3",
    category: "workbook",
    lessonId: "lektion-1",
    title: "Übung 3: Đại từ nhân xưng ich, du, Sie",
    description: "Phân biệt cách xưng hô thân mật (du) và trang trọng (Sie) trong hội thoại thực tế.",
    topicIds: ["w-frage", "begruessung"],
    sourceKind: "workbook_reference",
    reference: "Menschen A1 Arbeitsbuch, Lektion 1, Übung 5 (biên soạn tương đương)",
    estimatedMinutes: 5,
    questions: [
      {
        id: "q1",
        type: "mcq",
        instruction: "Chọn đại từ phù hợp.",
        prompt: "Bạn nói với một người bạn cùng tuổi. Dùng đại từ nào?",
        options: [
          { id: "a", label: "Sie" },
          { id: "b", label: "du" },
          { id: "c", label: "ihr" },
        ],
        answer: "b",
        explanation: "Với bạn bè cùng tuổi dùng du (thân mật). Sie dùng cho người lạ/trang trọng.",
      },
      {
        id: "q2",
        type: "fill",
        instruction: "Điền đại từ thích hợp.",
        prompt: "Guten Tag, wie heißen ______?",
        answer: "Sie",
        acceptable: ["Sie", "sie"],
        explanation: "Trong ngữ cảnh trang trọng, dùng Sie: Wie heißen Sie?",
      },
      {
        id: "q3",
        type: "truefalse",
        instruction: "Đúng hay sai?",
        prompt: "“Ihr seid Freunde.” dùng ihr cho nhóm người đang nói chuyện trực tiếp.",
        options: [
          { id: "true", label: "Richtig" },
          { id: "false", label: "Falsch" },
        ],
        answer: "true",
        explanation: "ihr = các bạn (số nhiều, thân mật), dùng khi nói với một nhóm người.",
      },
      {
        id: "q4",
        type: "mcq",
        instruction: "Chọn câu đúng.",
        prompt: "Cách nói lịch sự “Ông/Bà sống ở đâu?”",
        options: [
          { id: "a", label: "Wo wohnst du?" },
          { id: "b", label: "Wo wohnen Sie?" },
          { id: "c", label: "Wo wohnt ihr?" },
        ],
        answer: "b",
        explanation: "Sie lịch sự đi với động từ chia như số nhiều: wohnen Sie.",
      },
    ],
  },
  {
    id: "ct-1",
    category: "custom",
    lessonId: "lektion-1",
    title: "Phản xạ chia động từ trong 60 giây",
    description: "Bộ bài tập tự tạo giúp phản xạ nhanh đuôi động từ thì hiện tại.",
    topicIds: ["praesens"],
    sourceKind: "original",
    reference: "Biên soạn mới cho Language Web",
    estimatedMinutes: 3,
    questions: [
      {
        id: "q1",
        type: "mcq",
        instruction: "Chọn nhanh đáp án đúng.",
        prompt: "du + kommen = ?",
        options: [
          { id: "a", label: "komme" },
          { id: "b", label: "kommst" },
          { id: "c", label: "kommt" },
        ],
        answer: "b",
        explanation: "du + -st → kommst.",
      },
      {
        id: "q2",
        type: "mcq",
        instruction: "Chọn nhanh đáp án đúng.",
        prompt: "wir + wohnen = ?",
        options: [
          { id: "a", label: "wohne" },
          { id: "b", label: "wohnt" },
          { id: "c", label: "wohnen" },
        ],
        answer: "c",
        explanation: "wir giữ nguyên đuôi -en → wohnen.",
      },
      {
        id: "q3",
        type: "mcq",
        instruction: "Chọn nhanh đáp án đúng.",
        prompt: "ihr + heißen = ?",
        options: [
          { id: "a", label: "heißt" },
          { id: "b", label: "heißen" },
          { id: "c", label: "heiße" },
        ],
        answer: "a",
        explanation: "ihr + -t → heißt.",
      },
      {
        id: "q4",
        type: "fill",
        instruction: "Điền dạng đúng.",
        prompt: "Sie ______ aus Österreich. (kommen)",
        answer: "kommen",
        explanation: "Sie (lịch sự) chia như số nhiều: kommen.",
      },
      {
        id: "q5",
        type: "mcq",
        instruction: "Chọn nhanh đáp án đúng.",
        prompt: "er + sprechen = ?",
        options: [
          { id: "a", label: "spreche" },
          { id: "b", label: "sprichst" },
          { id: "c", label: "spricht" },
        ],
        answer: "c",
        explanation: "Bất quy tắc e → i: er spricht.",
      },
    ],
  },
  {
    id: "ct-2",
    category: "custom",
    lessonId: "lektion-1",
    title: "Hội thoại tại quán cà phê",
    description: "Hoàn thành đoạn hội thoại thực tế theo ngữ cảnh Menschen Lektion 1.",
    topicIds: ["begruessung", "w-frage"],
    sourceKind: "original",
    reference: "Biên soạn mới cho Language Web",
    estimatedMinutes: 6,
    questions: [
      {
        id: "q1",
        type: "mcq",
        instruction: "Chọn lời đáp phù hợp.",
        prompt: "— Guten Tag! Wie heißen Sie?\n— ______",
        options: [
          { id: "a", label: "Ich heiße Minh Anh." },
          { id: "b", label: "Ich komme aus Vietnam." },
          { id: "c", label: "Ich wohne in Berlin." },
        ],
        answer: "a",
        explanation: "Câu hỏi hỏi tên nên trả lời bằng heißen: Ich heiße ...",
      },
      {
        id: "q2",
        type: "fill",
        instruction: "Điền từ còn thiếu.",
        prompt: "— Woher ______ Sie?\n— Ich komme aus Vietnam.",
        answer: "kommen",
        explanation: "Woher kommen Sie? = Ông/bà đến từ đâu?",
        translation: "— Ông/bà đến từ đâu? — Tôi đến từ Việt Nam.",
      },
      {
        id: "q3",
        type: "order",
        instruction: "Sắp xếp câu trả lời.",
        prompt: "Sắp xếp: Tôi sống ở Berlin.",
        words: ["Ich", "wohne", "in", "Berlin"],
        answer: ["Ich", "wohne", "in", "Berlin"],
        explanation: "wohnen in + địa điểm: Ich wohne in Berlin.",
        translation: "Tôi sống ở Berlin.",
      },
      {
        id: "q4",
        type: "truefalse",
        instruction: "Đúng hay sai?",
        prompt: "“Tschüs” là lời chào khi gặp mặt lần đầu.",
        options: [
          { id: "true", label: "Richtig" },
          { id: "false", label: "Falsch" },
        ],
        answer: "false",
        explanation: "Tschüs dùng khi tạm biệt, không dùng để chào lần đầu.",
      },
    ],
  },
  {
    id: "ct-3",
    category: "custom",
    lessonId: "lektion-1",
    title: "W-Fragen & số đếm cơ bản",
    description: "Ôn từ hỏi, trật tự câu hỏi và số đếm 0–20 trong ngữ cảnh giới thiệu.",
    topicIds: ["w-frage"],
    sourceKind: "original",
    reference: "Biên soạn mới cho Language Web",
    estimatedMinutes: 5,
    questions: [
      {
        id: "q1",
        type: "mcq",
        instruction: "Chọn từ hỏi đúng.",
        prompt: "______ wohnen Sie? — In Berlin.",
        options: [
          { id: "a", label: "Woher" },
          { id: "b", label: "Wo" },
          { id: "c", label: "Wie" },
        ],
        answer: "b",
        explanation: "Wo = ở đâu, dùng hỏi nơi sống. Woher hỏi nguồn gốc.",
      },
      {
        id: "q2",
        type: "fill",
        instruction: "Điền từ hỏi thích hợp.",
        prompt: "______ heißen Sie? — Ich heiße Paco.",
        answer: "Wie",
        acceptable: ["wie"],
        explanation: "Wie heißen Sie? là mẫu câu hỏi tên lịch sự.",
      },
      {
        id: "q3",
        type: "order",
        instruction: "Sắp xếp thành câu hỏi.",
        prompt: "Sắp xếp: Ông/bà nói những ngôn ngữ nào?",
        words: ["Welche", "Sprachen", "sprechen", "Sie"],
        answer: ["Welche", "Sprachen", "sprechen", "Sie"],
        explanation: "W-Frage: Welche Sprachen + sprechen + Sie?",
        translation: "Ông/bà nói những ngôn ngữ nào?",
      },
      {
        id: "q4",
        type: "mcq",
        instruction: "Chọn cách viết đúng của số 12.",
        prompt: "12 = ?",
        options: [
          { id: "a", label: "zwölf" },
          { id: "b", label: "zwei" },
          { id: "c", label: "zwanzig" },
        ],
        answer: "a",
        explanation: "zwölf = 12; zwei = 2; zwanzig = 20.",
      },
    ],
  },
];

export const readingPassage: ReadingPassage = {
  id: "reading-1",
  lessonId: "lektion-1",
  title: "Hallo, ich bin Jan!",
  subtitle: "A1 – Lektion 1: Bài đọc giới thiệu bản thân",
  paragraphs: [
    {
      de: "Hallo, ich bin Jan. Ich komme aus Polen, aber ich wohne jetzt in Berlin. Ich spreche Polnisch und Deutsch.",
      vi: "Xin chào, tôi là Jan. Tôi đến từ Ba Lan nhưng hiện tôi sống ở Berlin. Tôi nói tiếng Ba Lan và tiếng Đức.",
    },
    {
      de: "Meine Freundin heißt Nicole. Sie kommt aus der Schweiz und wohnt auch in Berlin. Nicole spricht Deutsch, Französisch und Italienisch.",
      vi: "Bạn gái tôi tên là Nicole. Cô ấy đến từ Thụy Sĩ và cũng sống ở Berlin. Nicole nói tiếng Đức, tiếng Pháp và tiếng Ý.",
    },
    {
      de: "Wir lernen zusammen Deutsch. Unsere Lehrerin heißt Frau Weber. Sie kommt aus Österreich.",
      vi: "Chúng tôi cùng học tiếng Đức. Giáo viên của chúng tôi tên là cô Weber. Cô ấy đến từ Áo.",
    },
  ],
  tip: "Hãy chú ý phân biệt “kommen aus” (nguồn gốc xuất thân) và “wohnen in” (nơi ở hiện tại). Đây là bẫy câu hỏi thường gặp trong đề thi Goethe/TELC A1.",
  questions: [
    {
      id: "rq1",
      type: "truefalse",
      prompt: "Jan wohnt in Polen.",
      options: [
        { id: "true", label: "Richtig" },
        { id: "false", label: "Falsch" },
      ],
      answer: "false",
      explanation: "Jan đến từ Ba Lan (“Ich komme aus Polen”) nhưng hiện sống tại Berlin (“aber ich wohne jetzt in Berlin”).",
    },
    {
      id: "rq2",
      type: "mcq",
      prompt: "Nicole spricht welche Sprachen?",
      options: [
        { id: "a", label: "Deutsch und Polnisch" },
        { id: "b", label: "Deutsch, Französisch und Italienisch" },
        { id: "c", label: "Deutsch und Englisch" },
      ],
      answer: "b",
      explanation: "Đoạn văn ghi rõ: “Nicole spricht Deutsch, Französisch und Italienisch.”",
    },
    {
      id: "rq3",
      type: "mcq",
      prompt: "Woher kommt Nicole?",
      options: [
        { id: "a", label: "Aus Polen" },
        { id: "b", label: "Aus Österreich" },
        { id: "c", label: "Aus der Schweiz" },
      ],
      answer: "c",
      explanation: "Nicole đến từ Thụy Sĩ: “Sie kommt aus der Schweiz.” Lưu ý giới từ aus + der Schweiz.",
    },
    {
      id: "rq4",
      type: "truefalse",
      prompt: "Frau Weber ist die Lehrerin.",
      options: [
        { id: "true", label: "Richtig" },
        { id: "false", label: "Falsch" },
      ],
      answer: "true",
      explanation: "“Unsere Lehrerin heißt Frau Weber.” → Cô Weber là giáo viên.",
    },
  ],
};

export const listeningItem: ListeningItem = {
  id: "listening-1",
  lessonId: "lektion-1",
  title: "Hội thoại chào hỏi tại sân bay",
  subtitle: "Nghe và chép lại chính xác những gì bạn nghe được",
  transcript: "Guten Tag, mein Name ist Paco. Ich komme aus Spanien. Und wie heißen Sie?",
  translation: "Xin chào, tên tôi là Paco. Tôi đến từ Tây Ban Nha. Còn ông/bà tên là gì?",
  notes: [
    "Trong tiếng Đức, tất cả danh từ đều viết hoa chữ cái đầu: der Name, der Tag, das Land.",
    "Đại từ lịch sự “Sie” luôn viết hoa để phân biệt với “sie” (cô ấy/họ).",
    "Tên quốc gia “Spanien” luôn viết hoa chữ S.",
  ],
};

export const writingPrompts: WritingPrompt[] = [
  {
    id: "writing-1",
    lessonId: "lektion-1",
    type: "sentence",
    title: "Sich vorstellen – Giới thiệu bản thân",
    instruction: "Viết 3 câu giới thiệu bản thân bằng tiếng Đức: tên, quê quán và ngôn ngữ bạn nói.",
    requirements: [
      "Dùng ít nhất 3 câu hoàn chỉnh.",
      "Có mẫu câu “Ich heiße …”, “Ich komme aus …”, “Ich spreche …”.",
      "Chia đúng động từ ở thì hiện tại với ngôi ich.",
    ],
    targetVocabulary: ["heißen", "kommen aus", "sprechen", "Vietnam", "Deutsch"],
    targetGrammar: ["Präsens", "Đại từ ich", "Trật tự câu trần thuật"],
    wordGuidance: "Khoảng 20–40 từ",
    sample:
      "Ich heiße Minh Anh. Ich komme aus Vietnam. Ich spreche Vietnamesisch und ein bisschen Deutsch.",
  },
  {
    id: "writing-2",
    lessonId: "lektion-1",
    type: "paragraph",
    title: "Meine Klasse – Lớp học của tôi",
    instruction: "Viết một đoạn văn ngắn 4–6 câu giới thiệu lớp học tiếng Đức của bạn: giáo viên, bạn học và nơi học.",
    requirements: [
      "Giới thiệu ít nhất một người bạn và giáo viên.",
      "Sử dụng “er/sie ist”, “wir lernen”, “mein/meine”.",
      "Có ít nhất 4 câu, câu văn liên kết rõ ràng.",
    ],
    targetVocabulary: ["die Klasse", "der Lehrer", "die Lehrerin", "der Freund", "lernen"],
    targetGrammar: ["Präsens", "Đại từ nhân xưng", "Câu hỏi W-Frage"],
    wordGuidance: "Khoảng 40–70 từ",
    sample:
      "Meine Klasse ist klein. Unsere Lehrerin heißt Frau Weber. Sie kommt aus Österreich. Mein Freund Paco kommt aus Spanien. Wir lernen zusammen Deutsch. Ich spreche schon ein bisschen Deutsch.",
  },
];

export const shadowingItems: ShadowingItem[] = [
  {
    id: "sh-1",
    text: "Guten Tag! Ich heiße Minh Anh.",
    translation: "Xin chào! Tôi tên là Minh Anh.",
    topic: "Chào hỏi",
  },
  {
    id: "sh-2",
    text: "Woher kommen Sie?",
    translation: "Ông/bà đến từ đâu?",
    topic: "Hỏi thông tin",
  },
  {
    id: "sh-3",
    text: "Ich komme aus Vietnam.",
    translation: "Tôi đến từ Việt Nam.",
    topic: "Giới thiệu",
  },
  {
    id: "sh-4",
    text: "Ich wohne in Berlin.",
    translation: "Tôi sống ở Berlin.",
    topic: "Giới thiệu",
  },
  {
    id: "sh-5",
    text: "Sprechen Sie Deutsch?",
    translation: "Ông/bà nói tiếng Đức không?",
    topic: "Hỏi thông tin",
  },
  {
    id: "sh-6",
    text: "Wie heißen Sie?",
    translation: "Ông/bà tên là gì?",
    topic: "Chào hỏi",
  },
];

export const speakingExamPrompts: SpeakingExamPrompt[] = [
  {
    id: "sp-1",
    title: "Sich vorstellen – Giới thiệu bản thân",
    topic: "Giới thiệu bản thân",
    instructions: [
      "Nói 4–6 câu về bản thân trong khoảng 1 phút.",
      "Bao gồm: tên, tuổi, quê quán, nơi sống, nghề nghiệp và ngôn ngữ.",
      "Nói thành tiếng, sau đó tự đối chiếu với các gợi ý bên dưới.",
    ],
    keywords: ["Name", "Alter", "Herkunft", "Wohnort", "Beruf", "Sprachen"],
    template: [
      { de: "Ich heiße …", vi: "Tôi tên là …" },
      { de: "Ich bin … Jahre alt.", vi: "Tôi … tuổi." },
      { de: "Ich komme aus …", vi: "Tôi đến từ …" },
      { de: "Ich wohne in …", vi: "Tôi sống ở …" },
      { de: "Ich spreche …", vi: "Tôi nói tiếng …" },
    ],
  },
  {
    id: "sp-2",
    title: "Fragen stellen – Đặt câu hỏi",
    topic: "Hỏi đáp cơ bản",
    instructions: [
      "Đóng vai người mới quen, đặt 5 câu hỏi để làm quen với một người bạn.",
      "Dùng các từ hỏi Wie, Woher, Wo, Was, Welche.",
      "Sau mỗi câu hỏi, tự trả lời như thể người kia vừa đáp.",
    ],
    keywords: ["Wie", "Woher", "Wo", "Was", "Welche"],
    template: [
      { de: "Wie heißen Sie?", vi: "Ông/bà tên là gì?" },
      { de: "Woher kommen Sie?", vi: "Ông/bà đến từ đâu?" },
      { de: "Wo wohnen Sie?", vi: "Ông/bà sống ở đâu?" },
      { de: "Welche Sprachen sprechen Sie?", vi: "Ông/bà nói ngôn ngữ nào?" },
    ],
  },
  {
    id: "sp-3",
    title: "Im Café – Tình huống quen thuộc",
    topic: "Tình huống giao tiếp",
    instructions: [
      "Đóng vai khách gọi đồ uống tại quán cà phê.",
      "Chào, gọi món, hỏi giá và cảm ơn.",
      "Tự nói thành tiếng trong khoảng 1–2 phút.",
    ],
    keywords: ["Guten Tag", "Ich möchte", "Wie viel kostet", "Danke"],
    template: [
      { de: "Guten Tag! Ich möchte einen Kaffee, bitte.", vi: "Xin chào! Tôi muốn một ly cà phê." },
      { de: "Wie viel kostet das?", vi: "Cái này giá bao nhiêu?" },
      { de: "Danke schön. Auf Wiedersehen!", vi: "Cảm ơn. Tạm biệt!" },
    ],
  },
];

export const speakingSelfCheck = [
  "Tôi đã nói thành tiếng, không chỉ đọc trong đầu.",
  "Tôi dùng đúng ít nhất 3 mẫu câu đã học.",
  "Tôi chia đúng động từ ở ngôi ich/du/Sie.",
  "Tôi phát âm rõ các âm ä, ö, ü và ch.",
  "Tôi có thể nói lại một lần nữa mà không nhìn transcript.",
];
