import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  LOG_LEVEL: z.string().default("info"),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
  /** URL công khai của frontend, dùng cho link xác nhận email của Supabase. */
  APP_PUBLIC_URL: z.string().url().optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const data = parsed.data;

export const env = {
  ...data,
  corsOrigins: data.CORS_ORIGINS.split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  appPublicUrl: data.APP_PUBLIC_URL?.replace(/\/+$/u, "") ?? null,
};
