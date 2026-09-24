"use client";

import { useCallback, useSyncExternalStore } from "react";

// Saved homes live in localStorage until accounts exist; the store keeps every
// mounted SaveButton and the /saved page in sync, including across tabs.

const KEY = "casa:saved";
const EMPTY: string[] = [];
const listeners = new Set<() => void>();
let cache: string[] | null = null;

function read(): string[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(ids: string[]) {
  cache = ids;
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // Storage unavailable (private mode, quota) — keep the in-memory copy.
  }
  listeners.forEach(l => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useSaved() {
  const saved = useSyncExternalStore(subscribe, read, () => EMPTY);
  const toggle = useCallback((id: string) => {
    const current = read();
    write(current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  }, []);
  return { saved, toggle, isSaved: (id: string) => saved.includes(id) };
}
