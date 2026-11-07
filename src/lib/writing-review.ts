import type { WritingPrompt } from "../dev/legacy-content";
import { clamp, normalizeGerman, wordCount } from "./text";

export type WritingErrorType = "grammar" | "vocabulary" | "spelling" | "task";

export interface WritingError {
  type: WritingErrorType;
  excerpt: string;
  correction: string;
  explanation: string;
}

export interface WritingCriterion {
  id: string;
  label: string;
  score: number;
  comment: string;
}

export type WritingReviewProvider = "ai" | "local";

export interface WritingReview {
  score: number;
  summary: string;
  criteria: WritingCriterion[];
  errors: WritingError[];
  suggestedText: string;
  model: string;
  promptVersion: string;
  createdAt: string;
  /** Có thể vắng mặt ở bản ghi cũ trong localStorage. */
  provider?: WritingReviewProvider;
  /** true khi kết quả đến từ bộ quy tắc cục bộ. */
  isDemo?: boolean;
}

type VerbMap = Record<string, Record<string, string>>;

const VERBS: VerbMap = {
  kommen: { ich: "komme", du: "kommst", er: "kommt", sie: "kommen", es: "kommt", wir: "kommen", ihr: "kommt", Sie: "kommen" },
  wohnen: { ich: "wohne", du: "wohnst", er: "wohnt", sie: "wohnen", es: "wohnt", wir: "wohnen", ihr: "wohnt", Sie: "wohnen" },
  heißen: { ich: "heiße", du: "heißt", er: "heißt", sie: "heißen", es: "heißt", wir: "heißen", ihr: "heißt", Sie: "heißen" },
  sprechen: { ich: "spreche", du: "sprichst", er: "spricht", sie: "sprechen", es: "spricht", wir: "sprechen", ihr: "sprecht", Sie: "sprechen" },
  lernen: { ich: "lerne", du: "lernst", er: "lernt", sie: "lernen", es: "lernt", wir: "lernen", ihr: "lernt", Sie: "lernen" },
  sein: { ich: "bin", du: "bist", er: "ist", sie: "sind", es: "ist", wir: "sind", ihr: "seid", Sie: "sind" },
  haben: { ich: "habe", du: "hast", er: "hat", sie: "haben", es: "hat", wir: "haben", ihr: "habt", Sie: "haben" },
};

const NOUNS = [
  "Name",
  "Tag",
  "Sprache",
  "Sprachen",
  "Land",
  "Stadt",
  "Freund",
  "Freundin",
  "Frau",
  "Mann",
  "Herkunft",
  "Alter",
  "Deutsch",
  "Vietnamesisch",
  "Englisch",
  "Spanien",
  "Vietnam",
  "Berlin",
  "Schweiz",
  "Österreich",
  "Kaffee",
  "Klasse",
  "Lehrerin",
  "Lehrer",
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyCorrection(text: string, excerpt: string, correction: string) {
  if (!excerpt.trim()) return text;
  const pattern = new RegExp(escapeRegExp(excerpt).replace(/\s+/g, "\\s+"), "giu");
  return text.replace(pattern, correction);
}

function detectVerbErrors(text: string): WritingError[] {
  const errors: WritingError[] = [];
  const pattern = /\b(ich|du|er|sie|es|wir|ihr|Sie)\s+([A-Za-zÄÖÜäöüß]+)\b/gu;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const pronoun = match[1];
    const verb = match[2];
    const expected = VERBS[verb.toLocaleLowerCase("de-DE")]?.[pronoun];
    if (!expected) continue;
    if (verb === expected) continue;

    errors.push({
      type: "grammar",
      excerpt: `${pronoun} ${verb}`,
      correction: `${pronoun} ${expected}`,
      explanation: `Với ngôi “${pronoun}”, động từ ${verb.toLocaleLowerCase("de-DE")} phải chia thành “${expected}”.`,
    });
  }

  const auxiliary = /\b(ich|du|er|sie|es|wir|ihr|Sie)\s+(bin|bist|ist|sind|seid)\s+([A-Za-zÄÖÜäöüß]+en)\b/gu;
  while ((match = auxiliary.exec(text)) !== null) {
    errors.push({
      type: "grammar",
      excerpt: match[0],
      correction: `${match[1]} ${VERBS[match[3].toLocaleLowerCase("de-DE")]?.[match[1]] ?? match[3]}`,
      explanation: "Không dùng sein + động từ nguyên thể để tạo thì hiện tại. Hãy chia trực tiếp động từ chính.",
    });
  }

  return errors;
}

function detectNounCapitalization(text: string): WritingError[] {
  const errors: WritingError[] = [];
  for (const noun of NOUNS) {
    const lower = noun.toLocaleLowerCase("de-DE");
    const pattern = new RegExp(`(?<![A-Za-zÄÖÜäöüß])${escapeRegExp(lower)}(?![A-Za-zÄÖÜäöüß])`, "gu");
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      errors.push({
        type: "spelling",
        excerpt: match[0],
        correction: noun,
        explanation: `Trong tiếng Đức, danh từ “${noun}” phải được viết hoa chữ cái đầu.`,
      });
    }
  }
  return errors;
}

function containsTargetPart(text: string, part: string) {
  if (new RegExp(`\\b${escapeRegExp(part)}\\b`, "u").test(text)) return true;

  // A1 thường dùng động từ đã chia, ví dụ "heiße" thay vì "heißen".
  const stem = part.replace(/(en|n|e)$/u, "");
  return stem.length >= 3 && new RegExp(`\\b${escapeRegExp(stem)}`, "u").test(text);
}

function missingTargetWords(text: string, prompt: WritingPrompt) {
  const normalized = text.toLocaleLowerCase("de-DE");
  return prompt.targetVocabulary.filter((word) => {
    const parts = word.toLocaleLowerCase("de-DE").split(/\s+/).filter(Boolean);
    return !parts.every((part) => containsTargetPart(normalized, part));
  });
}

function sentenceCount(text: string) {
  return normalizeGerman(text)
    .split(/[.!?]+/u)
    .map((part) => part.trim())
    .filter(Boolean).length;
}

export function runLocalWritingReview(prompt: WritingPrompt, original: string): WritingReview {
  const text = normalizeGerman(original);
  const words = wordCount(text);

  if (words === 0) {
    return {
      score: 0,
      summary: "Chưa có nội dung để chấm. Hãy viết bài trước khi gửi.",
      criteria: [],
      errors: [],
      suggestedText: "",
      model: "local-demo-v1",
      promptVersion: "writing-v1",
      createdAt: new Date().toISOString(),
      provider: "local",
      isDemo: true,
    };
  }

  const verbErrors = detectVerbErrors(text);
  const nounErrors = detectNounCapitalization(text);
  const missing = missingTargetWords(text, prompt);
  const sentenceTotal = sentenceCount(text);
  const tooShort = words < (prompt.type === "sentence" ? 12 : 28);
  const targetScore = clamp(10 - missing.length * 1.2 - (tooShort ? 2 : 0), 3, 10);
  const grammarScore = clamp(10 - verbErrors.length * 2.2, 2, 10);
  const vocabularyScore = clamp(10 - nounErrors.length * 1.1 - missing.length * 0.8, 2, 10);
  const coherenceScore = clamp(
    7 + Math.min(2, sentenceTotal * 0.4) + (words > 25 ? 1 : 0) - (tooShort ? 2 : 0),
    3,
    10,
  );

  const errors: WritingError[] = [...verbErrors, ...nounErrors];

  if (tooShort) {
    errors.push({
      type: "task",
      excerpt: `${words} từ`,
      correction: prompt.wordGuidance,
      explanation: "Bài viết ngắn hơn gợi ý. Hãy bổ sung thông tin để đáp ứng đủ yêu cầu của đề.",
    });
  }

  for (const word of missing) {
    errors.push({
      type: "vocabulary",
      excerpt: word,
      correction: `Bổ sung “${word}”`,
      explanation: "Từ/cụm từ này nằm trong mục tiêu của đề nhưng chưa xuất hiện trong bài.",
    });
  }

  const rawScore =
    grammarScore * 0.35 + vocabularyScore * 0.25 + targetScore * 0.25 + coherenceScore * 0.15;
  const score = Math.round(clamp(rawScore, 0, 10) * 2) / 2;

  let suggestedText = text;
  for (const error of errors) {
    if (error.type === "grammar" || error.type === "spelling") {
      suggestedText = applyCorrection(suggestedText, error.excerpt, error.correction);
    }
  }

  const summary =
    score >= 8.5
      ? "Bài viết đáp ứng tốt yêu cầu A1: ý rõ, dùng đúng mẫu câu và ít lỗi."
      : score >= 6.5
        ? "Bài viết đạt yêu cầu cơ bản. Cần chú ý thêm cách chia động từ và viết hoa danh từ."
        : "Bài viết cần chỉnh sửa thêm. Hãy xem từng lỗi bên dưới rồi viết lại một lần nữa.";

  return {
    score,
    summary,
    criteria: [
      {
        id: "grammar",
        label: "Ngữ pháp",
        score: Math.round(grammarScore * 2) / 2,
        comment: verbErrors.length
          ? `Có ${verbErrors.length} lỗi chia động từ cần sửa.`
          : "Không phát hiện lỗi chia động từ cơ bản.",
      },
      {
        id: "vocabulary",
        label: "Từ vựng & chính tả",
        score: Math.round(vocabularyScore * 2) / 2,
        comment: nounErrors.length
          ? `Có ${nounErrors.length} chỗ cần viết hoa danh từ.`
          : "Dùng từ phù hợp ngữ cảnh A1.",
      },
      {
        id: "task",
        label: "Đáp ứng đề bài",
        score: Math.round(targetScore * 2) / 2,
        comment: missing.length
          ? `Còn thiếu: ${missing.join(", ")}.`
          : "Đã bao phủ các thông tin chính của đề.",
      },
      {
        id: "coherence",
        label: "Độ rõ ràng & liên kết",
        score: Math.round(coherenceScore * 2) / 2,
        comment: sentenceTotal >= 3
          ? "Các câu có trình tự giới thiệu hợp lý."
          : "Nên thêm câu để ý diễn đạt đầy đủ và liên kết hơn.",
      },
    ],
    errors,
    suggestedText,
    model: "local-demo-v1",
    promptVersion: "writing-v1",
    createdAt: new Date().toISOString(),
    provider: "local",
    isDemo: true,
  };
}
