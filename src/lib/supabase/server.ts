import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerKey, getSupabaseUrl } from "./env";

let cached: SupabaseClient | null = null;

/** Service-role client used by API routes for authoritative writes. */
export function supabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  const url = getSupabaseUrl();
  const key = getSupabaseServerKey();
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
