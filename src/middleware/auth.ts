import type { User } from "@supabase/supabase-js";
import type { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger";
import { supabaseAuth } from "../lib/supabase-auth";

export function bearerToken(request: Request) {
  const header = request.header("authorization");
  if (!header?.startsWith("Bearer ")) return null;

  const token = header.slice("Bearer ".length).trim();
  return token || null;
}

export function userRole(user: User | undefined) {
  return user?.app_metadata?.role === "admin" ? "admin" : "user";
}

export function requireAdmin(_request: Request, response: Response, next: NextFunction) {
  const user = response.locals.authUser as User | undefined;

  if (userRole(user) !== "admin") {
    response.status(403).json({
      error: {
        code: "forbidden",
        message: "Bạn không có quyền admin.",
      },
    });
    return;
  }

  next();
}

export async function requireAuth(request: Request, response: Response, next: NextFunction) {
  const token = bearerToken(request);

  if (!token) {
    response.status(401).json({
      error: { code: "unauthorized", message: "Thiếu access token." },
    });
    return;
  }

  if (!supabaseAuth) {
    response.status(503).json({
      error: { code: "auth_not_configured", message: "Supabase Auth chưa được cấu hình." },
    });
    return;
  }

  try {
    const { data, error } = await supabaseAuth.auth.getUser(token);

    if (error) {
      const invalidToken =
        error.status === 400 || error.status === 401 || error.status === 403;

      logger.warn(
        { code: error.code ?? "unknown", status: error.status ?? null },
        invalidToken ? "auth token rejected" : "auth provider unavailable",
      );

      response.status(invalidToken ? 401 : 503).json({
        error: invalidToken
          ? { code: "invalid_token", message: "Access token không hợp lệ hoặc đã hết hạn." }
          : {
              code: "auth_unavailable",
              message: "Không kết nối được dịch vụ đăng nhập. Vui lòng thử lại sau.",
            },
      });
      return;
    }

    if (!data.user) {
      response.status(401).json({
        error: { code: "invalid_token", message: "Access token không hợp lệ hoặc đã hết hạn." },
      });
      return;
    }

    response.locals.authUser = data.user;
    response.locals.accessToken = token;
    next();
  } catch (error) {
    logger.error({ err: error }, "auth token verification failed");
    response.status(503).json({
      error: {
        code: "auth_unavailable",
        message: "Không kết nối được dịch vụ đăng nhập. Vui lòng thử lại sau.",
      },
    });
  }
}
