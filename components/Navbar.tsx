"use client";

// components/Navbar.tsx
// ─── NAVIGATION BAR ───────────────────────────────────────────────────────────
// Transparent on top, blurs on scroll.
// To add nav links: edit NAV_LINKS array below.

import { useEffect, useState } from "react";

// ── Edit navigation links here ─────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Produit",      href: "#features"    },
  { label: "Comment ça marche", href: "#how-it-works" },
  { label: "À propos",     href: "#about"       },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500
        ${scrolled
          ? "bg-bg-base/80 backdrop-blur-xl border-b border-border shadow-[0_1px_0_#FFFFFF08]"
          : "bg-transparent"
        }
      `}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-emerald-hedge flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
              <path
                d="M10 3 L17 8 L17 15 Q10 18 3 15 L3 8 Z"
                fill="#040810"
                fillOpacity="0.9"
              />
              <path
                d="M7 11 L9.5 13.5 L14 8.5"
                stroke="#040810"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-text-primary">
            Hedgen
          </span>
        </a>

        {/* Navigation links (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden md:block text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Se connecter
          </a>
          <a href="#contact" className="btn-primary text-xs py-2 px-4">
            Demander une démo
          </a>
        </div>

      </div>
    </header>
  );
}
