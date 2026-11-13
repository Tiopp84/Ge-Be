import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";

/**
 * Auth client dùng anon key — an toàn để dùng phía server cho đăng nhập.
 * Session không được persist trong process này.
 */
export const supabaseAuth =
  env.SUPABASE_URL && env.SUPABASE_ANON_KEY
    ? createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      })
    : null;

export function isAuthConfigured() {
  return supabaseAuth !== null;
}

/**
 * Revoke session hiện tại của user bằng chính access token.
 * Dùng endpoint logout của GoTrue, không cần service role key.
 */
export async function revokeSupabaseSession(accessToken: string) {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    return { ok: false, status: 0 };
  }

  const baseUrl = env.SUPABASE_URL.replace(/\/+$/u, "");
  const response = await fetch(`${baseUrl}/auth/v1/logout`, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return { ok: response.ok, status: response.status };
}
