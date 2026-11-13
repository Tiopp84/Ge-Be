import type { Session, User } from "@supabase/supabase-js";
import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env";
import { logger } from "../lib/logger";
import { revokeSupabaseSession, supabaseAuth } from "../lib/supabase-auth";
import { requireAdmin, requireAuth, userRole } from "../middleware/auth";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(200),
});

const registerSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

function serializeUser(user: User) {
  return {
    id: user.id,
    email: user.email ?? null,
    emailConfirmedAt: user.email_confirmed_at ?? null,
    createdAt: user.created_at,
    role: userRole(user),
  };
}

function serializeSession(session: Session) {
  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    tokenType: session.token_type,
    expiresIn: session.expires_in,
    expiresAt: session.expires_at
      ? new Date(session.expires_at * 1000).toISOString()
      : null,
  };
}

function isDuplicateEmailError(error: { code?: string; message: string }) {
  return (
    error.code === "user_already_exists" ||
    error.code === "email_exists" ||
    /already (registered|exists)/iu.test(error.message)
  );
}

function isWeakPasswordError(error: {
  code?: string;
  status?: number;
  message: string;
}) {
  return (
    error.code === "weak_password" ||
    (error.status === 422 && /password/iu.test(error.message))
  );
}

export const authRouter = Router();

/**
 * Tự đăng ký tài khoản user thường.
 *
 * - Không nhận role từ client: Supabase Auth chỉ cho phép set `app_metadata`
 *   bằng service role, nên tài khoản mới luôn có role `user`.
 * - Nếu Supabase bật "Confirm email", signUp không trả session; response có
 *   `requiresEmailConfirmation: true` và `session: null`.
 */
authRouter.post("/register", async (request, response, next) => {
  if (!supabaseAuth) {
    response.status(503).json({
      error: {
        code: "auth_not_configured",
        message: "Supabase Auth chưa được cấu hình.",
      },
    });
    return;
  }

  try {
    const input = registerSchema.parse(request.body);

    const { data, error } = await supabaseAuth.auth.signUp({
      email: input.email,
      password: input.password,
      options: env.appPublicUrl
        ? { emailRedirectTo: `${env.appPublicUrl}/login?confirmed=1` }
        : undefined,
    });

    if (error) {
      logger.warn(
        { code: error.code ?? "unknown", status: error.status ?? null },
        "auth register rejected",
      );

      if (error.status === 429) {
        const isEmailSendLimit = error.code === "over_email_send_rate_limit";

        response.setHeader("Retry-After", isEmailSendLimit ? "3600" : "60");
        response.status(429).json({
          error: {
            code: isEmailSendLimit ? "email_rate_limited" : "rate_limited",
            message: isEmailSendLimit
              ? "Supabase đã đạt giới hạn 2 email xác nhận/giờ của email provider mặc định. Vui lòng thử lại sau (tối đa khoảng 1 giờ) hoặc cấu hình SMTP riêng."
              : "Bạn đã thử đăng ký quá nhiều lần. Vui lòng thử lại sau ít phút.",
          },
        });
        return;
      }

      if (isDuplicateEmailError(error)) {
        response.status(409).json({
          error: {
            code: "email_already_registered",
            message: "Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.",
          },
        });
        return;
      }

      if (isWeakPasswordError(error)) {
        response.status(400).json({
          error: {
            code: "weak_password",
            message: `Mật khẩu chưa đủ mạnh. Dùng ít nhất ${PASSWORD_MIN_LENGTH} ký tự.`,
          },
        });
        return;
      }

      if (
        error.code === "signup_disabled" ||
        error.code === "email_provider_disabled" ||
        error.code === "phone_provider_disabled"
      ) {
        response.status(403).json({
          error: {
            code: "signup_disabled",
            message: "Chức năng đăng ký đang tạm khóa. Vui lòng thử lại sau.",
          },
        });
        return;
      }

      if (
        error.code === "email_address_invalid" ||
        error.code === "email_address_not_authorized"
      ) {
        response.status(400).json({
          error: {
            code: "invalid_email",
            message:
              "Email không hợp lệ hoặc không nhận được thư. Hãy dùng một địa chỉ email thật.",
          },
        });
        return;
      }

      if (error.status && error.status >= 400 && error.status < 500) {
        response.status(400).json({
          error: {
            code: "register_rejected",
            message: "Không thể tạo tài khoản với thông tin này.",
          },
        });
        return;
      }

      response.status(503).json({
        error: {
          code: "auth_unavailable",
          message: "Không kết nối được dịch vụ đăng ký. Vui lòng thử lại sau.",
        },
      });
      return;
    }

    if (!data.user) {
      response.status(503).json({
        error: {
          code: "auth_unavailable",
          message: "Dịch vụ đăng ký không trả về tài khoản hợp lệ.",
        },
      });
      return;
    }

    const requiresEmailConfirmation = !data.session;

    logger.info(
      { userId: data.user.id, requiresEmailConfirmation },
      "auth registered",
    );

    response.status(201).json({
      user: serializeUser(data.user),
      session: data.session ? serializeSession(data.session) : null,
      requiresEmailConfirmation,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(error);
      return;
    }

    logger.error({ err: error }, "auth register failed");
    response.status(503).json({
      error: {
        code: "auth_unavailable",
        message: "Không kết nối được dịch vụ đăng ký. Vui lòng thử lại sau.",
      },
    });
  }
});

authRouter.post("/login", async (request, response, next) => {
  if (!supabaseAuth) {
    response.status(503).json({
      error: {
        code: "auth_not_configured",
        message: "Supabase Auth chưa được cấu hình.",
      },
    });
    return;
  }

  try {
    const input = loginSchema.parse(request.body);
    const { data, error } = await supabaseAuth.auth.signInWithPassword(input);

    if (error) {
      const label =
        error.code === "email_not_confirmed"
          ? "auth login requires email confirmation"
          : error.status === 429
            ? "auth login rate limited"
            : error.status === 400 || error.status === 401
              ? "auth login rejected"
              : "auth provider unavailable";

      logger.warn(
        { code: error.code ?? "unknown", status: error.status ?? null },
        label,
      );

      if (error.code === "email_not_confirmed") {
        response.status(403).json({
          error: {
            code: "email_not_confirmed",
            message:
              "Email chưa được xác nhận. Mở email xác nhận của Supabase rồi đăng nhập lại.",
          },
        });
        return;
      }

      if (error.status === 429) {
        response.setHeader("Retry-After", "60");
        response.status(429).json({
          error: {
            code: "rate_limited",
            message: "Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau ít phút.",
          },
        });
        return;
      }

      if (error.status !== 400 && error.status !== 401) {
        response.status(503).json({
          error: {
            code: "auth_unavailable",
            message: "Không kết nối được dịch vụ đăng nhập. Vui lòng thử lại sau.",
          },
        });
        return;
      }

      response.status(401).json({
        error: {
          code: "invalid_credentials",
          message: "Email hoặc mật khẩu không đúng.",
        },
      });
      return;
    }

    if (!data.user || !data.session) {
      response.status(503).json({
        error: {
          code: "auth_unavailable",
          message: "Dịch vụ đăng nhập không trả về phiên hợp lệ.",
        },
      });
      return;
    }

    response.json({
      user: serializeUser(data.user),
      session: serializeSession(data.session),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(error);
      return;
    }

    logger.error({ err: error }, "auth login failed");
    response.status(503).json({
      error: {
        code: "auth_unavailable",
        message: "Không kết nối được dịch vụ đăng nhập. Vui lòng thử lại sau.",
      },
    });
  }
});

authRouter.post("/refresh", async (request, response, next) => {
  if (!supabaseAuth) {
    response.status(503).json({
      error: {
        code: "auth_not_configured",
        message: "Supabase Auth chưa được cấu hình.",
      },
    });
    return;
  }

  try {
    const input = refreshSchema.parse(request.body);
    const { data, error } = await supabaseAuth.auth.refreshSession({
      refresh_token: input.refreshToken,
    });

    if (error || !data.user || !data.session) {
      const invalidToken = error?.status === 400 || error?.status === 401;

      logger.warn(
        { code: error?.code ?? "unknown", status: error?.status ?? null },
        invalidToken ? "auth refresh rejected" : "auth provider unavailable",
      );

      response.status(invalidToken ? 401 : 503).json({
        error: invalidToken
          ? {
              code: "invalid_refresh_token",
              message: "Refresh token không hợp lệ hoặc đã hết hạn.",
            }
          : {
              code: "auth_unavailable",
              message: "Không kết nối được dịch vụ đăng nhập. Vui lòng thử lại sau.",
            },
      });
      return;
    }

    response.json({
      user: serializeUser(data.user),
      session: serializeSession(data.session),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(error);
      return;
    }

    logger.error({ err: error }, "auth refresh failed");
    response.status(503).json({
      error: {
        code: "auth_unavailable",
        message: "Không kết nối được dịch vụ đăng nhập. Vui lòng thử lại sau.",
      },
    });
  }
});

authRouter.post("/logout", requireAuth, async (_request, response) => {
  const accessToken = response.locals.accessToken as string | undefined;

  if (!accessToken) {
    response.status(401).json({
      error: { code: "unauthorized", message: "Thiếu access token." },
    });
    return;
  }

  try {
    const result = await revokeSupabaseSession(accessToken);

    if (!result.ok) {
      response.status(502).json({
        error: {
          code: "logout_failed",
          message: "Không thu hồi được session. Hãy xóa token trên client.",
        },
      });
      return;
    }

    response.status(204).send();
  } catch (error) {
    logger.error({ err: error }, "auth logout failed");
    response.status(503).json({
      error: {
        code: "auth_unavailable",
        message: "Không kết nối được dịch vụ đăng nhập. Vui lòng thử lại sau.",
      },
    });
  }
});

authRouter.get("/me", requireAuth, (_request, response) => {
  response.json({
    user: serializeUser(response.locals.authUser as User),
  });
});

authRouter.get("/admin-check", requireAuth, requireAdmin, (_request, response) => {
  response.json({ ok: true, role: "admin" });
});
