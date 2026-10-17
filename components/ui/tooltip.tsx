"use client";

import React, { useState, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  delay?: number;
}

export function Tooltip({
  content,
  children,
  position = "top",
  className,
  delay = 150,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  return (
    <div
      className="ui-tooltip-wrapper"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn("ui-tooltip", `ui-tooltip-${position}`, className)}
        >
          {content}
          <div className="ui-tooltip-arrow" />
        </div>
      )}
    </div>
  );
}
