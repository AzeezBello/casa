import "server-only";
import type { Repository } from "./repository";
import { createMockRepository } from "./mock";
import { createSupabaseRepository } from "./supabase";

function selectRepository(): Repository {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && anonKey && serviceRoleKey) return createSupabaseRepository({ url, anonKey, serviceRoleKey });
  if (url || anonKey || serviceRoleKey) {
    // A half-configured backend would silently serve sample data in production.
    throw new Error("Set all of SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY, or none of them.");
  }
  return createMockRepository();
}

export const repository: Repository = selectRepository();
