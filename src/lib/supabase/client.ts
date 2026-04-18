"use client";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseBrowserKey, getSupabaseUrl } from "./env";

let cached: SupabaseClient | null = null;

/** Anon client for the browser (reads + realtime). */
export function supabaseBrowser(): SupabaseClient {
  if (cached) return cached;
  const url = getSupabaseUrl();
  const key = getSupabaseBrowserKey();
  cached = createClient(url, key, { realtime: { params: { eventsPerSecond: 20 } } });
  return cached;
}
