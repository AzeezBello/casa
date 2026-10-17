"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Compass, Eye, ShieldCheck, ArrowRight, ArrowLeft, X } from "lucide-react";
import { Button } from "./ui/button";

const STEPS = [
  {
    icon: Compass,
    eyebrow: "STEP 1 OF 3 · DISCOVERY",
    title: "Find a place that feels like home",
    description:
      "Explore curated homes, townhouses and apartments across Nigeria's prime locations—from Lekki and Ikoyi to Maitama and Guzape.",
    tag: "Search by Area & City",
  },
  {
    icon: Eye,
    eyebrow: "STEP 2 OF 3 · 360° TOURS",
    title: "Tour remotely before you visit",
    description:
      "Save hours in traffic with our interactive 360° virtual tours. Experience every room, patio and hallway directly from your phone or laptop.",
    tag: "Immersive Viewers",
  },
  {
    icon: ShieldCheck,
    eyebrow: "STEP 3 OF 3 · TRUST",
    title: "Transparent pricing & verified agents",
    description:
      "No hidden surprises. Verified badges indicate checked properties, transparent asking prices in Naira, and direct booking with licensed agents.",
    tag: "100% Upfront Naira",
  },
];

export function Onboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if onboarding was completed
    const seen = localStorage.getItem("casa_onboarding_completed");
    if (!seen) {
      // Delay slightly for smooth entrance after page settles
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    localStorage.setItem("casa_onboarding_completed", "true");
    setIsOpen(false);
  };

  const next = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      close();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div className="onboarding-backdrop" onClick={close}>
      <div
        className="onboarding-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          className="onboarding-close"
          onClick={close}
          aria-label="Skip onboarding"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="onboarding-header">
          <div className="onboarding-icon-wrapper">
            <Icon size={26} aria-hidden="true" />
          </div>
          <span className="onboarding-eyebrow">{step.eyebrow}</span>
          <h2 id="onboarding-title" className="onboarding-title">
            {step.title}
          </h2>
          <p className="onboarding-description">{step.description}</p>
          <div className="onboarding-tag">
            <Sparkles size={14} aria-hidden="true" />
            <span>{step.tag}</span>
          </div>
        </div>

        <div className="onboarding-footer">
          <div className="onboarding-stepper" aria-label="Step progress">
            {STEPS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`stepper-dot ${idx === currentStep ? "active" : ""} ${idx < currentStep ? "completed" : ""}`}
                onClick={() => setCurrentStep(idx)}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <div className="onboarding-actions">
            {currentStep > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={prev}
                className="onboarding-prev-btn"
              >
                <ArrowLeft size={16} aria-hidden="true" /> Back
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={next}
              className="onboarding-next-btn"
            >
              {currentStep === STEPS.length - 1 ? (
                "Get started"
              ) : (
                <>
                  Next <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
