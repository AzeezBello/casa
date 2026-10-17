"use client";

import React, { type ReactNode } from "react";
import { MapPin, Play } from "lucide-react";
import { Img } from "@/components/Img";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export function TourDialog({
  title,
  location,
  image,
  className,
  children,
}: {
  title: string;
  location: string;
  image: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger className={className} aria-label={`Open 360 virtual tour for ${title}`}>
        {children}
      </DialogTrigger>
      <DialogContent className="tour-modal">
        <div className="tour-modal-media">
          <Img
            src={image}
            alt={`Preview of 360 virtual tour for ${title}`}
            fill
            sizes="(max-width: 900px) 100vw, 900px"
          />
        </div>
        <div className="tour-modal-content">
          <DialogHeader>
            <div className="eyebrow">360° VIRTUAL TOUR</div>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <p className="location">
            <MapPin size={16} aria-hidden="true" />
            {location}
          </p>
          <div className="tour-placeholder">
            <Play size={28} fill="currentColor" aria-hidden="true" />
            <span>Interactive 360° panoramic viewer ready</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
