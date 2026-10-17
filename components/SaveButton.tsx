"use client";

import { Heart } from "lucide-react";
import { useSaved } from "@/lib/saved";
import { Tooltip } from "./ui/tooltip";

export function SaveButton({
  id,
  title,
  className = "heart",
}: {
  id: string;
  title: string;
  className?: string;
}) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(id);

  const button = (
    <button
      type="button"
      className={`${saved ? `${className} saved heart-active` : className} transition-transform active:scale-90`}
      onClick={() => toggle(id)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved homes` : `Save ${title} to shortlist`}
    >
      <Heart
        size={19}
        fill={saved ? "currentColor" : "none"}
        aria-hidden="true"
      />
    </button>
  );

  return (
    <Tooltip content={saved ? "Remove from shortlist" : "Save to shortlist"}>
      {button}
    </Tooltip>
  );
}
