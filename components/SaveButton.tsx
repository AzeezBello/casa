"use client";

import { Heart } from "lucide-react";
import { useSaved } from "@/lib/saved";

export function SaveButton({ id, title, className = "heart" }: { id: string; title: string; className?: string }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(id);
  return (
    <button
      type="button"
      className={saved ? `${className} saved` : className}
      onClick={() => toggle(id)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved homes` : `Save ${title}`}
    >
      <Heart size={19} fill={saved ? "currentColor" : "none"} aria-hidden="true"/>
    </button>
  );
}
