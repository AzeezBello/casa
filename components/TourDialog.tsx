"use client";

import Image from "next/image";
import { useId, useRef, type ReactNode } from "react";
import { MapPin, Play, X } from "lucide-react";

// Native <dialog> gives us Escape-to-close, focus trapping and inert background for free.
export function TourDialog({ title, location, image, className, children }: {
  title: string; location: string; image: string; className: string; children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const close = () => ref.current?.close();

  return (
    <>
      <button type="button" className={className} onClick={() => ref.current?.showModal()}>{children}</button>
      <dialog
        ref={ref}
        className="tour-modal"
        aria-labelledby={headingId}
        onClick={e => { if (e.target === ref.current) close(); }}
      >
        <button type="button" className="modal-close" onClick={close} aria-label="Close tour"><X aria-hidden="true"/></button>
        <div className="tour-modal-media"><Image src={image} alt="" fill sizes="(max-width: 900px) 100vw, 900px"/></div>
        <div className="tour-modal-content">
          <div className="eyebrow">360° VIRTUAL TOUR</div>
          <h2 id={headingId}>{title}</h2>
          <p className="location"><MapPin size={16} aria-hidden="true"/>{location}</p>
          <div className="tour-placeholder"><Play size={28} fill="currentColor" aria-hidden="true"/> Interactive 360° viewer coming soon</div>
        </div>
      </dialog>
    </>
  );
}
