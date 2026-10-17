// src/components/EmptyState.tsx
"use client";

type Props = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export function EmptyState({ title, description, ctaLabel, ctaHref }: Props) {
  return (
    <section className="empty-state py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="mb-6">{description}</p>
      <a
        href={ctaHref}
        className="inline-block bg-primary text-white py-2 px-4 rounded hover:bg-primary/90"
      >
        {ctaLabel}
      </a>
    </section>
  );
}
