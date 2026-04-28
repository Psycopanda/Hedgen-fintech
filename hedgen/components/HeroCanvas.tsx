"use client";

// components/HeroCanvas.tsx
// ─── ANIMATION: THE HEDGE FIELD ───────────────────────────────────────────────
//
// Visual metaphor: Price/risk curves flow left → right across the canvas.
// On the LEFT they are turbulent and chaotic (unhedged exposure).
// On the RIGHT they converge and smooth out (hedged, orderly).
//
// To tweak:
//   CURVE_COUNT     → more/fewer flowing lines
//   SPEED           → animation speed
//   TURBULENCE      → chaos intensity on the left side
//   TRAIL_ALPHA     → how quickly trails fade (lower = longer trails)
//   COLOR_*         → color stops along the curve path

import { useEffect, useRef } from "react";

// ─── CONSTANTS (tweak here) ────────────────────────────────────────────────────
const CURVE_COUNT = 28;
const SPEED = 0.0004;
const TURBULENCE = 120;       // max vertical displacement on left side
const TRAIL_ALPHA = 0.018;    // background fade per frame (lower = longer trails)
const PARTICLE_RADIUS = 1.2;

// ─── TYPES ─────────────────────────────────────────────────────────────────────
interface Curve {
  id: number;
  y: number;           // base vertical position (0–1 normalized)
  phase: number;       // phase offset for noise
  speed: number;       // individual speed variation
  thickness: number;   // line width
  particleX: number;   // X position of the traveling dot (0–1)
}

// ─── NOISE FUNCTION ───────────────────────────────────────────────────────────
// Layered sin/cos gives organic-looking turbulence without a library
function noise(y: number, phase: number, t: number): number {
  return (
    Math.sin(y * 3.1 + phase + t * 1.3) * 0.5 +
    Math.sin(y * 6.7 - phase * 1.4 + t * 2.1) * 0.25 +
    Math.sin(y * 12.3 + phase * 0.7 - t * 0.9) * 0.15 +
    Math.sin(y * 1.9 - phase * 2.1 + t * 0.5) * 0.1
  );
}

// ─── INTERPOLATE COLOR ────────────────────────────────────────────────────────
// x: 0 (left/risky) → 1 (right/hedged)
function getColor(x: number, alpha: number): string {
  if (x < 0.35) {
    // Left zone: warm orange/amber (risk)
    const t = x / 0.35;
    const r = Math.round(255);
    const g = Math.round(80 + t * 100);
    const b = Math.round(20 + t * 40);
    return `rgba(${r},${g},${b},${alpha})`;
  } else if (x < 0.65) {
    // Middle zone: transitioning blue
    const t = (x - 0.35) / 0.3;
    const r = Math.round(255 - t * 210);
    const g = Math.round(180 + t * 50);
    const b = Math.round(60 + t * 200);
    return `rgba(${r},${g},${b},${alpha})`;
  } else {
    // Right zone: emerald green (hedged)
    const t = (x - 0.65) / 0.35;
    const r = Math.round(45 - t * 45);
    const g = Math.round(230 + t * 2);
    const b = Math.round(260 - t * 140);
    return `rgba(${r},${g},${b},${alpha})`;
  }
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Resize handler ────────────────────────────────────────────────────────
    let W = 0, H = 0;
    function resize() {
      W = canvas!.width = canvas!.offsetWidth;
      H = canvas!.height = canvas!.offsetHeight;
      // Fill background immediately on resize to avoid flash
      ctx!.fillStyle = "#040810";
      ctx!.fillRect(0, 0, W, H);
    }
    resize();
    window.addEventListener("resize", resize);

    // ── Mouse tracking ────────────────────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    }
    canvas.addEventListener("mousemove", onMouseMove);

    // ── Initialize curves ─────────────────────────────────────────────────────
    const curves: Curve[] = Array.from({ length: CURVE_COUNT }, (_, i) => ({
      id: i,
      y: (i + 0.5) / CURVE_COUNT,
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 0.8,
      thickness: 0.6 + Math.random() * 1.0,
      particleX: Math.random(),
    }));

    // ── Animation loop ────────────────────────────────────────────────────────
    let t = 0;

    function draw() {
      t += SPEED;

      // Fade background (creates trailing effect)
      ctx!.fillStyle = `rgba(4, 8, 16, ${TRAIL_ALPHA})`;
      ctx!.fillRect(0, 0, W, H);

      for (const curve of curves) {
        // Advance the traveling particle dot
        curve.particleX += SPEED * curve.speed * 80;
        if (curve.particleX > 1.05) curve.particleX = -0.05;

        // Draw the curve as a series of small segments
        const SEGMENTS = 120;
        ctx!.beginPath();

        for (let s = 0; s <= SEGMENTS; s++) {
          const nx = s / SEGMENTS; // normalized x (0→1)

          // Turbulence decreases as x increases (left = chaotic, right = smooth)
          const turbulenceScale = Math.pow(1 - nx, 2.2);

          // Mouse influence: subtle repulsion from mouse position
          const distToMouse = Math.abs(curve.y - mouseRef.current.y);
          const mouseInfluence = Math.max(0, 1 - distToMouse * 4) *
            Math.max(0, 1 - Math.abs(nx - mouseRef.current.x) * 3);

          // Calculate Y with noise + mouse effect
          const rawNoise = noise(curve.y, curve.phase, t * curve.speed);
          const displaced = rawNoise * TURBULENCE * turbulenceScale;
          const mouseOffset = (curve.y - mouseRef.current.y) * mouseInfluence * 30;

          const px = nx * W;
          const py = curve.y * H + displaced + mouseOffset;

          if (s === 0) {
            ctx!.moveTo(px, py);
          } else {
            ctx!.lineTo(px, py);
          }
        }

        // Stroke with gradient-like color (sample color at midpoint)
        const alpha = 0.35 + curve.thickness * 0.15;
        ctx!.strokeStyle = getColor(0.5, alpha);
        ctx!.lineWidth = curve.thickness;
        ctx!.lineCap = "round";
        ctx!.stroke();

        // ── Draw traveling particle dot ──────────────────────────────────────
        const px = curve.particleX * W;
        const turbAtParticle = Math.pow(1 - curve.particleX, 2.2);
        const pyOffset = noise(curve.y, curve.phase, t * curve.speed) * TURBULENCE * turbAtParticle;
        const py = curve.y * H + pyOffset;

        // Glow behind the dot
        const grd = ctx!.createRadialGradient(px, py, 0, px, py, 8);
        grd.addColorStop(0, getColor(curve.particleX, 0.6));
        grd.addColorStop(1, getColor(curve.particleX, 0));
        ctx!.fillStyle = grd;
        ctx!.beginPath();
        ctx!.arc(px, py, 8, 0, Math.PI * 2);
        ctx!.fill();

        // Solid dot
        ctx!.fillStyle = getColor(curve.particleX, 0.9);
        ctx!.beginPath();
        ctx!.arc(px, py, PARTICLE_RADIUS, 0, Math.PI * 2);
        ctx!.fill();
      }

      // ── Zone labels overlay (very subtle) ────────────────────────────────
      // Vertical separator at ~65% (the "hedge zone" starts)
      ctx!.strokeStyle = "rgba(0, 232, 122, 0.04)";
      ctx!.lineWidth = 1;
      ctx!.setLineDash([4, 8]);
      ctx!.beginPath();
      ctx!.moveTo(W * 0.65, 0);
      ctx!.lineTo(W * 0.65, H);
      ctx!.stroke();
      ctx!.setLineDash([]);

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
