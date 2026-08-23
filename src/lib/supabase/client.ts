import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured, supabaseConfig } from "@/lib/supabase/config";

/** Browser Supabase client, or null while running in seeded demo mode. */
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(supabaseConfig.url!, supabaseConfig.anonKey!);
}
