"use client";

import React, { type ReactNode } from "react";
import Link from "next/link";
import { Search, Heart, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  icon?: "search" | "heart" | "lightbulb";
  title: string;
  description: string;
  tips?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  children?: ReactNode;
};

export function EmptyState({
  icon = "search",
  title,
  description,
  tips = [],
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  children,
}: Props) {
  const IconComponent = icon === "heart" ? Heart : icon === "lightbulb" ? Lightbulb : Search;

  return (
    <div className="ui-empty-state">
      <div className="ui-empty-icon-wrap" aria-hidden="true">
        <IconComponent size={28} />
      </div>

      <h2 className="ui-empty-title">{title}</h2>
      <p className="ui-empty-desc">{description}</p>

      {tips.length > 0 && (
        <div className="ui-empty-guide">
          <div className="ui-empty-guide-header">
            <Lightbulb size={16} aria-hidden="true" />
            <span>Helpful tips to get started:</span>
          </div>
          <ul className="ui-empty-tips">
            {tips.map((tip, idx) => (
              <li key={idx}>
                <span className="tip-bullet">{idx + 1}</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(ctaLabel || secondaryCtaLabel) && (
        <div className="ui-empty-actions">
          {ctaLabel && ctaHref && (
            <Link href={ctaHref}>
              <Button variant="default">
                {ctaLabel} <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </Link>
          )}
          {secondaryCtaLabel && secondaryCtaHref && (
            <Link href={secondaryCtaHref}>
              <Button variant="outline">{secondaryCtaLabel}</Button>
            </Link>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
