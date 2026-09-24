"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import type { Property } from "@/lib/types";
import { useSaved } from "@/lib/saved";
import { PropertyCard } from "./PropertyCard";

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

  if (load.status === "loading") return <p className="loading" role="status">Loading your saved homes…</p>;
  if (load.status === "error") return <p className="field-error" role="alert">We couldn’t load your saved homes. Please refresh to try again.</p>;

  const homes = load.properties.filter(p => saved.includes(p.id));
  if (homes.length === 0) {
    return (
      <div className="empty">
        <Heart size={30} aria-hidden="true"/>
        <h2>No saved homes yet</h2>
        <p>Tap the heart on any listing to keep it here. Saved homes are stored on this device.</p>
        <Link className="outline-btn" href="/properties">Browse homes</Link>
      </div>
    );
  }
  return <div className="property-grid">{homes.map(p => <PropertyCard key={p.id} property={p}/>)}</div>;
}
