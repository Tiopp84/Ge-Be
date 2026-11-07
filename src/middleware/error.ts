import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger";

export function notFound(request: Request, response: Response) {
  response.status(404).json({
    error: {
      code: "not_found",
      message: `Không tìm thấy ${request.method} ${request.originalUrl}.`,
    },
  });
}

export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        code: "validation_error",
        message: "Dữ liệu không hợp lệ.",
        details: error.flatten(),
      },
    });
    return;
  }

  logger.error(
    {
      err: error instanceof Error ? error : { message: String(error) },
      method: request.method,
      url: request.originalUrl,
    },
    "request failed",
  );

  response.status(500).json({
    error: {
      code: "internal_error",
      message: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
    },
  });
}
