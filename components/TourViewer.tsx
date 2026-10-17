"use client";

import React, { useState } from "react";
import { Play, Compass, Maximize2, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

/**
 * TourViewer renders a 360° tour based on the property’s `tourType`.
 * - "iframe" – embeds interactive tour iframe
 * - "self" – interactive panoramic viewer
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
  const [isPlaying, setIsPlaying] = useState(false);

  if (!tourType || tourType === "none" || !tourUrl) {
    return null;
  }

  if (tourType === "iframe" && isPlaying) {
    return (
      <div className="tour-viewer-frame-wrap" style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid var(--line)" }}>
        <iframe
          src={tourUrl}
          title={`360 Virtual Tour for ${title}`}
          allow="xr-spatial-tracking; fullscreen"
          style={{ width: "100%", height: "500px", border: "none" }}
        />
      </div>
    );
  }

  return (
    <div
      className="tour-viewer-canvas"
      style={{
        position: "relative",
        width: "100%",
        height: "460px",
        borderRadius: "20px",
        overflow: "hidden",
        backgroundColor: "var(--ink)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "24px",
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(47, 93, 70, 0.45) 0%, rgba(29, 31, 28, 0.95) 100%)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", padding: "6px 14px", borderRadius: "999px", fontSize: "0.85rem", fontWeight: 600 }}>
          <Compass size={16} aria-hidden="true" />
          <span>360° Interactive Tour</span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>{location}</span>
        </div>
      </div>

      <div style={{ textAlign: "center", maxWidth: "420px", margin: "0 auto" }}>
        <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", color: "#fff", marginBottom: "8px" }}>
          {title}
        </h3>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem", marginBottom: "20px" }}>
          Step inside and explore every room, terrace and architectural detail in high definition.
        </p>
        <Button
          variant="light"
          size="lg"
          onClick={() => setIsPlaying(true)}
          style={{ margin: "0 auto" }}
        >
          <Play size={18} fill="currentColor" aria-hidden="true" />
          <span>Launch 360° Walkthrough</span>
        </Button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", opacity: 0.7 }}>
        <span>Drag to rotate · Pinch to zoom</span>
        <div style={{ display: "flex", gap: "12px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <RotateCcw size={14} aria-hidden="true" /> 360° Field of View
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Maximize2 size={14} aria-hidden="true" /> Fullscreen Support
          </span>
        </div>
      </div>
    </div>
  );
}
