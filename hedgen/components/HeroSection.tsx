"use client";

// components/HeroSection.tsx
// ─── HERO SECTION ─────────────────────────────────────────────────────────────
// Gère l'intro animation puis révèle le contenu avec un stagger.
//
// Éditer :
//   HEADLINE_*, SUBLINE, CTA_* → les textes

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import IntroAnimation from "./IntroAnimation";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-bg-base" />,
});

// ── Textes ──────────────────────────────────────────────────────────────────
const BADGE_TEXT      = "Propulsé par l'IA agentique";
const HEADLINE_LINE1  = "Le risque, maîtrisé.";
const HEADLINE_ACCENT = "La croissance,";
const HEADLINE_LINE2  = "libérée.";
const SUBLINE = "Hedgen protège automatiquement les PMEs contre les risques de change et de matières premières — sans complexité, sans overhead. Nos agents IA travaillent 24h/24 à votre place.";
const CTA_PRIMARY = { label: "Demander une démo", href: "#contact" };
const CTA_GHOST   = { label: "Voir comment ça marche", href: "#how-it-works" };

// ── Helper : style inline pour stagger reveal ────────────────────────────────
function revealStyle(visible: boolean, delayMs: number) {
  return {
    opacity:    visible ? 1 : 0,
    transform:  visible ? "translateY(0)" : "translateY(28px)",
    transition: visible
      ? `opacity 0.7s ease ${delayMs}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delayMs}ms`
      : "none",
  };
}

export default function HeroSection() {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <>
      {/* ── Intro overlay (se joue une seule fois au chargement) ─────────── */}
      <IntroAnimation onComplete={handleIntroComplete} />

      {/* ── Section principale ──────────────────────────────────────────── */}
      <section className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden">

        {/* Canvas de fond (courbes de risque qui se hedgent) */}
        <HeroCanvas />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-bg-base/60 to-bg-base/90 pointer-events-none" />

        {/* Grille texture */}
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

        {/* Contenu — stagger reveal après la fin de l'intro */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">

          <div style={revealStyle(introComplete, 0)} className="section-label mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-hedge animate-pulse-slow" />
            {BADGE_TEXT}
          </div>

          <h1 className="font-display font-bold leading-[1.08] tracking-tight mb-6">
            <span style={revealStyle(introComplete, 80)} className="text-5xl md:text-7xl text-text-primary block mb-1">
              {HEADLINE_LINE1}
            </span>
            <span style={revealStyle(introComplete, 160)} className="text-5xl md:text-7xl text-gradient-blue-green block">
              {HEADLINE_ACCENT}
            </span>
            <span style={revealStyle(introComplete, 240)} className="text-5xl md:text-7xl text-text-primary block">
              {HEADLINE_LINE2}
            </span>
          </h1>

          <p style={revealStyle(introComplete, 340)} className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-xl mb-10">
            {SUBLINE}
          </p>

          <div style={revealStyle(introComplete, 440)} className="flex flex-wrap gap-4 justify-center">
            <a href={CTA_PRIMARY.href} className="btn-primary">
              {CTA_PRIMARY.label}
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href={CTA_GHOST.href} className="btn-ghost">
              {CTA_GHOST.label}
            </a>
          </div>

        </div>

        {/* Indicateur de scroll */}
        <div
          style={revealStyle(introComplete, 600)}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-text-tertiary text-xs font-mono tracking-wider uppercase">Défiler</span>
          <div className="w-px h-8 bg-gradient-to-b from-border to-transparent animate-scroll-hint" />
        </div>

        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-bg-base to-transparent pointer-events-none" />
      </section>
    </>
  );
}
