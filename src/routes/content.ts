import { Router } from "express";
import {
  exercises,
  grammarTopics,
  lesson,
  lessonList,
  listeningItem,
  readingPassage,
  shadowingItems,
  speakingExamPrompts,
  speakingSelfCheck,
  vocabulary,
  writingPrompts,
} from "../dev/legacy-content";

export const contentRouter = Router();

function isAvailable(item: (typeof lessonList)[number]) {
  return "available" in item ? item.available !== false : true;
}

function bookReferenceOf(item: (typeof lessonList)[number]) {
  return "bookReference" in item && typeof item.bookReference === "string"
    ? item.bookReference
    : null;
}

/**
 * Dữ liệu mẫu tạm thời cho giai đoạn FE-first.
 * Khi làm BE + Supabase, thay các mảng legacy-content bằng repository.
 */
export const lessonSummaries = lessonList.map((item) => {
  const current = item.id === lesson.id;

  return {
    id: item.id,
    number: item.number,
    level: item.level,
    title: item.title,
    subtitle: item.subtitle,
    available: isAvailable(item),
    bookReference: bookReferenceOf(item),
    counts: {
      vocabulary: current ? vocabulary.length : 0,
      grammar: current ? grammarTopics.length : 0,
      exercises: current ? exercises.length : 0,
      workbook: current
        ? exercises.filter((exercise) => exercise.category === "workbook").length
        : 0,
      custom: current
        ? exercises.filter((exercise) => exercise.category === "custom").length
        : 0,
      writingPrompts: current ? writingPrompts.length : 0,
      shadowing: current ? shadowingItems.length : 0,
      exams: current ? speakingExamPrompts.length : 0,
    },
  };
});

contentRouter.get("/catalog", (_request, response) => {
  response.json({ lessons: lessonSummaries });
});

contentRouter.get("/lessons/:lessonId", (request, response) => {
  const key = request.params.lessonId;
  const summary = lessonSummaries.find(
    (item) => item.id === key || String(item.number) === key,
  );

  if (!summary || !summary.available) {
    response.status(404).json({
      error: { code: "lesson_not_found", message: "Không tìm thấy bài học." },
    });
    return;
  }

  const isCurrent = summary.id === lesson.id;

  response.json({
    lesson: summary,
    objectives: isCurrent ? lesson.objectives : [],
    vocabulary: isCurrent ? vocabulary : [],
    grammarTopics: isCurrent ? grammarTopics : [],
    exercises: isCurrent ? exercises : [],
    reading: isCurrent ? readingPassage : null,
    listening: isCurrent ? listeningItem : null,
    writingPrompts: isCurrent ? writingPrompts : [],
    speaking: {
      shadowing: isCurrent ? shadowingItems : [],
      examPrompts: isCurrent ? speakingExamPrompts : [],
      selfCheck: isCurrent ? speakingSelfCheck : [],
    },
  });
});

contentRouter.get("/exercises/:exerciseId", (request, response) => {
  const exercise = exercises.find((item) => item.id === request.params.exerciseId);

  if (!exercise) {
    response.status(404).json({
      error: { code: "exercise_not_found", message: "Không tìm thấy bài tập." },
    });
    return;
  }

  const summary = lessonSummaries.find((item) => item.id === exercise.lessonId);

  response.json({
    exercise,
    lesson: summary ?? null,
    grammarTopics,
    vocabulary,
  });
});
