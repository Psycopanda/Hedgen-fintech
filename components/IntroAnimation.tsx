"use client";

// components/IntroAnimation.tsx
// ─── INTRO ANIMATION ──────────────────────────────────────────────────────────
//
// Overlay plein écran qui se joue au premier chargement.
// Séquence :
//   0ms      → Canvas de courbes commence à jouer
//   400ms    → Logo pulse
//   900ms    → Tagline character-by-character
//   2600ms   → Barre de progression
//   3400ms   → Overlay monte et révèle le site
//
// Pour modifier les timings : ajustez les PHASE_* ci-dessous.
// Pour désactiver : passez `enabled={false}` depuis HeroSection.

import { useEffect, useRef, useState, useCallback } from "react";

// ── Timings (ms) ───────────────────────────────────────────────────────────
const PHASE_LOGO    = 400;
const PHASE_TAGLINE = 900;
const PHASE_BAR     = 2400;
const PHASE_EXIT    = 3400;

// ── Noise pour l'animation canvas interne ─────────────────────────────────
function noise(y: number, phase: number, t: number): number {
  return (
    Math.sin(y * 3.1 + phase + t * 1.3) * 0.5 +
    Math.sin(y * 6.7 - phase * 1.4 + t * 2.1) * 0.25 +
    Math.sin(y * 12.3 + phase * 0.7 - t * 0.9) * 0.15
  );
}

function getColor(x: number, alpha: number): string {
  if (x < 0.4) {
    const t = x / 0.4;
    return `rgba(255,${Math.round(80 + t * 110)},30,${alpha})`;
  } else if (x < 0.7) {
    const t = (x - 0.4) / 0.3;
    return `rgba(${Math.round(255 - t * 210)},${Math.round(190 + t * 40)},${Math.round(30 + t * 210)},${alpha})`;
  } else {
    const t = (x - 0.7) / 0.3;
    return `rgba(${Math.round(45 - t * 45)},${Math.round(230)},${Math.round(260 - t * 150)},${alpha})`;
  }
}

interface Props {
  onComplete: () => void;
}

const TAGLINE = "Le risque, maîtrisé.";

export default function IntroAnimation({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase]     = useState<"logo" | "tagline" | "bar" | "exit" | "done">("logo");
  const [charIndex, setCharIndex] = useState(0);
  const [barWidth, setBarWidth]   = useState(0);
  const [logoVisible, setLogoVisible] = useState(false);

  // ── Canvas animation ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      ctx.fillStyle = "#040810";
      ctx.fillRect(0, 0, W, H);
    };
    resize();
    window.addEventListener("resize", resize);

    const CURVE_COUNT = 22;
    const curves = Array.from({ length: CURVE_COUNT }, (_, i) => ({
      y: (i + 0.5) / CURVE_COUNT,
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 0.8,
      thickness: 0.5 + Math.random() * 1.2,
      particleX: Math.random(),
    }));

    let t = 0;
    let startTime = performance.now();

    const draw = (now: number) => {
      // Ramp-in: animation s'intensifie sur les 1.5 premières secondes
      const elapsed = (now - startTime) / 1500;
      const ramp = Math.min(1, elapsed);

      t += 0.0004;

      ctx.fillStyle = `rgba(4,8,16,0.025)`;
      ctx.fillRect(0, 0, W, H);

      for (const curve of curves) {
        curve.particleX += 0.0004 * curve.speed * 80;
        if (curve.particleX > 1.05) curve.particleX = -0.05;

        const SEGS = 100;
        ctx.beginPath();
        for (let s = 0; s <= SEGS; s++) {
          const nx = s / SEGS;
          const turbScale = Math.pow(1 - nx, 2.2) * ramp;
          const raw = noise(curve.y, curve.phase, t * curve.speed);
          const py = curve.y * H + raw * 100 * turbScale;
          s === 0 ? ctx.moveTo(nx * W, py) : ctx.lineTo(nx * W, py);
        }

        ctx.strokeStyle = getColor(0.5, (0.3 + curve.thickness * 0.1) * ramp);
        ctx.lineWidth = curve.thickness;
        ctx.stroke();

        // Particule voyageuse
        if (ramp > 0.3) {
          const px = curve.particleX * W;
          const turbAtP = Math.pow(1 - curve.particleX, 2.2) * ramp;
          const pyDot = curve.y * H + noise(curve.y, curve.phase, t * curve.speed) * 100 * turbAtP;

          const grd = ctx.createRadialGradient(px, pyDot, 0, px, pyDot, 10);
          grd.addColorStop(0, getColor(curve.particleX, 0.5 * ramp));
          grd.addColorStop(1, getColor(curve.particleX, 0));
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(px, pyDot, 10, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = getColor(curve.particleX, 0.9 * ramp);
          ctx.beginPath();
          ctx.arc(px, pyDot, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── Séquence temporelle ──────────────────────────────────────────────────
  useEffect(() => {
    const t1 = setTimeout(() => setLogoVisible(true),  PHASE_LOGO);
    const t2 = setTimeout(() => setPhase("tagline"),   PHASE_TAGLINE);
    const t3 = setTimeout(() => setPhase("bar"),       PHASE_BAR);
    const t4 = setTimeout(() => setPhase("exit"),      PHASE_EXIT);
    const t5 = setTimeout(() => { setPhase("done"); onComplete(); }, PHASE_EXIT + 900);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onComplete]);

  // ── Typewriter character by character ────────────────────────────────────
  useEffect(() => {
    if (phase !== "tagline") return;
    if (charIndex >= TAGLINE.length) return;
    const t = setTimeout(() => setCharIndex((c) => c + 1), 60);
    return () => clearTimeout(t);
  }, [phase, charIndex]);

  // ── Progress bar animation ────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "bar") return;
    const duration = PHASE_EXIT - PHASE_BAR - 100;
    const start = performance.now();
    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setBarWidth(p * 100);
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{
        transform: phase === "exit" ? "translateY(-100%)" : "translateY(0)",
        transition: phase === "exit" ? "transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)" : "none",
        backgroundColor: "#040810",
      }}
    >
      {/* Canvas plein écran */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Vignette centrale */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-bg-base/50 to-bg-base/80 pointer-events-none" />

      {/* Contenu centré */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">

        {/* Logo */}
        <div
          style={{
            opacity: logoVisible ? 1 : 0,
            transform: logoVisible ? "scale(1) translateY(0)" : "scale(0.85) translateY(12px)",
            transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
          className="flex flex-col items-center gap-4"
        >
          {/* Icône */}
          <div
            className="w-16 h-16 rounded-2xl bg-emerald-hedge flex items-center justify-center"
            style={{ boxShadow: "0 0 60px #00E87A55, 0 0 120px #00E87A22" }}
          >
            <svg viewBox="0 0 32 32" fill="none" className="w-9 h-9">
              <path
                d="M16 4 L27 11 L27 23 Q16 28 5 23 L5 11 Z"
                fill="#040810"
                fillOpacity="0.95"
              />
              <path
                d="M11 17 L15 21 L22 13"
                stroke="#040810"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Nom */}
          <span className="font-display font-bold text-4xl tracking-tight text-text-primary">
            Hedgen
          </span>
        </div>

        {/* Tagline typewriter */}
        <div
          style={{
            opacity: phase === "tagline" || phase === "bar" || phase === "exit" ? 1 : 0,
            transition: "opacity 0.4s ease",
            minHeight: "2rem",
          }}
          className="font-mono text-base text-text-secondary tracking-wide"
        >
          {TAGLINE.slice(0, charIndex)}
          {charIndex < TAGLINE.length && (
            <span className="inline-block w-0.5 h-4 bg-emerald-hedge ml-0.5 animate-pulse" />
          )}
        </div>

        {/* Barre de progression */}
        <div
          style={{
            opacity: phase === "bar" || phase === "exit" ? 1 : 0,
            transition: "opacity 0.3s ease",
            width: "200px",
          }}
        >
          <div className="h-px bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-accent to-emerald-hedge rounded-full"
              style={{
                width: `${barWidth}%`,
                transition: "width 0.05s linear",
                boxShadow: "0 0 8px #00E87A88",
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
