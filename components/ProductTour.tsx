"use client";

import React, { useState } from "react";
import { HelpCircle, Check, ArrowRight, ArrowLeft, X, Layers, Compass, Heart, Box } from "lucide-react";
import { Button } from "./ui/button";

const TOUR_ITEMS = [
  {
    title: "1. Smart Search & Filters",
    icon: Compass,
    description:
      "Filter by location (Lagos, Abuja), budget ranges in Naira, number of bedrooms, and whether the home includes an immersive 360° tour.",
    highlight: "filter-bar",
  },
  {
    title: "2. 360° Virtual Walkthroughs",
    icon: Layers,
    description:
      "Look for the 360° tour pill on property cards to take a full interactive panoramic walkthrough before scheduling a physical viewing.",
    highlight: "tour-grid",
  },
  {
    title: "3. Shortlist Your Favorites",
    icon: Heart,
    description:
      "Click the heart button on any property card to save it to your private shortlist. Access your saved homes anytime from the navigation header.",
    highlight: "saved-link",
  },
  {
    title: "4. Modular Homes & Insights",
    icon: Box,
    description:
      "Explore modular housing models with rapid construction times, transparent cost estimation, and flexible Nigerian-tailored floor plans.",
    highlight: "modular",
  },
];

export function ProductTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const startTour = () => {
    setActiveStep(0);
    setIsOpen(true);
  };

  const next = () => {
    if (activeStep < TOUR_ITEMS.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      setIsOpen(false);
    }
  };

  const prev = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const current = TOUR_ITEMS[activeStep];
  const Icon = current.icon;

  return (
    <>
      <button
        type="button"
        className="product-tour-trigger"
        onClick={startTour}
        aria-label="Start Product Feature Tour"
        title="Explore features"
      >
        <HelpCircle size={15} aria-hidden="true" />
        <span>Product Tour</span>
      </button>

      {isOpen && (
        <div className="product-tour-backdrop" onClick={() => setIsOpen(false)}>
          <div
            className="product-tour-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-step-title"
            onClick={e => e.stopPropagation()}
          >
            <div className="product-tour-head">
              <div className="tour-badge">
                <Icon size={16} aria-hidden="true" />
                <span>Feature Guide ({activeStep + 1} of {TOUR_ITEMS.length})</span>
              </div>
              <button
                type="button"
                className="tour-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close tour"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <h3 id="tour-step-title" className="product-tour-title">
              {current.title}
            </h3>
            <p className="product-tour-desc">{current.description}</p>

            <div className="product-tour-controls">
              <div className="tour-dots">
                {TOUR_ITEMS.map((_, i) => (
                  <span
                    key={i}
                    className={`tour-dot ${i === activeStep ? "active" : ""}`}
                  />
                ))}
              </div>

              <div className="tour-actions">
                {activeStep > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prev}
                    className="tour-btn"
                  >
                    <ArrowLeft size={14} aria-hidden="true" /> Prev
                  </Button>
                )}
                <Button
                  variant="default"
                  size="sm"
                  onClick={next}
                  className="tour-btn"
                >
                  {activeStep === TOUR_ITEMS.length - 1 ? (
                    <>
                      Finish <Check size={14} aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      Next <ArrowRight size={14} aria-hidden="true" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
