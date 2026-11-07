import { Router } from "express";
import { writingPrompts } from "../dev/legacy-content";
import { runLocalWritingReview } from "../lib/writing-review";

export const writingRouter = Router();

writingRouter.get("/config", (_request, response) => {
  response.json({
    configured: false,
    provider: "local",
    label: "Local demo",
    model: "local-demo-v1",
  });
});

writingRouter.post("/review", (request, response) => {
  const body = request.body as { promptId?: unknown; text?: unknown } | null;

  if (!body || typeof body.promptId !== "string" || typeof body.text !== "string") {
    response.status(400).json({
      error: {
        code: "invalid_body",
        message: "Thiếu đề bài hoặc nội dung bài viết.",
      },
    });
    return;
  }

  const prompt = writingPrompts.find((item) => item.id === body.promptId);
  if (!prompt) {
    response.status(404).json({
      error: { code: "unknown_prompt", message: "Không tìm thấy đề bài." },
    });
    return;
  }

  const text = body.text.trim();
  if (text.length < 10) {
    response.status(400).json({
      error: {
        code: "text_too_short",
        message: "Bài viết quá ngắn để chấm. Hãy viết thêm vài câu.",
      },
    });
    return;
  }

  const review = runLocalWritingReview(prompt, text);

  response.json({
    review,
    provider: "local",
    fallback: true,
    reason: "not_configured",
    notice:
      "API AI chưa được cấu hình; bài được chấm bằng bộ quy tắc cục bộ. Bài viết của bạn vẫn được giữ.",
  });
});
