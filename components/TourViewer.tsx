// src/components/TourViewer.tsx
"use client";

import React from "react";

/**
 * TourViewer renders a 360° tour based on the property’s `tourType`.
 * - "iframe"  – simply embeds the provided URL in an <iframe>.
 * - "self"   – placeholder when Marzipano viewer is unavailable.
 */
export function TourViewer({
  tourType,
  tourUrl,
  title,
  location,
}: {
  tourType?: "none" | "iframe" | "self";
  tourUrl?: string;
  title: string;
  location: string;
}) {
  if (!tourType || tourType === "none" || !tourUrl) {
    return null;
  }

  if (tourType === "iframe") {
    return (
      <iframe
        src={tourUrl}
        title={title}
        allow="xr-spatial-tracking"
        style={{ width: "100%", height: "500px", border: "none" }}
      />
    );
  }

  // Self‑hosted Marzipano viewer placeholder
  return (
    <div style={{ width: "100%", height: "500px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0", color: "#555" }}>
      360° Tour viewer unavailable. Please install <code>react-marzipano</code> to enable.
    </div>
  );
}
