"use client";

import { useEffect, useState } from "react";
import type { Property } from "@/lib/types";
import { useSaved } from "@/lib/saved";
import { PropertyCard } from "./PropertyCard";
import { EmptyState } from "./EmptyState";

type Load = { status: "loading" } | { status: "error" } | { status: "done"; properties: Property[] };

export function SavedList() {
  const { saved } = useSaved();
  const [load, setLoad] = useState<Load>({ status: "loading" });
  // Only refetch when ids are added; unsaving just filters what we already have.
  const [fetchedFor, setFetchedFor] = useState<string[] | null>(null);
  const needsFetch = fetchedFor === null || saved.some(id => !fetchedFor.includes(id));

  useEffect(() => {
    if (!needsFetch) return;
    if (saved.length === 0) {
      setFetchedFor([]);
      setLoad({ status: "done", properties: [] });
      return;
    }
    const controller = new AbortController();
    fetch(`/api/properties?ids=${saved.map(encodeURIComponent).join(",")}`, { signal: controller.signal })
      .then(r => r.ok ? r.json() as Promise<{ properties: Property[] }> : Promise.reject(r.status))
      .then(data => { setFetchedFor(saved); setLoad({ status: "done", properties: data.properties }); })
      .catch(() => { if (!controller.signal.aborted) setLoad({ status: "error" }); });
    return () => controller.abort();
  }, [saved, needsFetch]);

  if (load.status === "loading") {
    return (
      <div className="py-12 text-center" role="status">
        <p className="loading">Loading your saved homes…</p>
      </div>
    );
  }

  if (load.status === "error") {
    return (
      <div className="py-12 text-center" role="alert">
        <p className="field-error">We couldn’t load your saved homes. Please refresh to try again.</p>
      </div>
    );
  }

  const homes = load.properties.filter(p => saved.includes(p.id));
  if (homes.length === 0) {
    return (
      <EmptyState
        icon="heart"
        title="Your shortlist is empty"
        description="Tap the heart icon on any listing card to keep track of homes you love."
        tips={[
          "Shortlisted homes are saved locally on your device across visits",
          "Compare floor sizes, bedroom counts, and indicative prices at a glance",
          "Check out 360° virtual tours before booking an in-person viewing"
        ]}
        ctaLabel="Explore homes"
        ctaHref="/properties"
        secondaryCtaLabel="Take 360° tours"
        secondaryCtaHref="/properties?tour=1"
      />
    );
  }

  return (
    <div className="property-grid">
      {homes.map(p => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}
