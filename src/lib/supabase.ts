import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";

/**
 * Supabase admin client.
 * Chỉ dùng ở server/worker; không bao giờ gửi service role key xuống client.
 */
export const supabaseAdmin =
  env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;
