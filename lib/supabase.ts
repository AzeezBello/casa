// lib/supabase.ts
// Supabase client initialization for the Next.js app.
// Replace the placeholder values with your actual Supabase project URL and anon key.
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "YOUR_SUPABASE_URL";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example helper to get a session (if you later add auth).
export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) console.error("Supabase auth error:", error);
  return data?.user;
};
