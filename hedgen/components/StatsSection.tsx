"use client";

// components/StatsSection.tsx
// ─── STATS BAR ────────────────────────────────────────────────────────────────
// Animated number counters that play when section enters viewport.
// To update numbers: edit the STATS array below.

import { useEffect, useRef, useState } from "react";

// ── Edit stats here ──────────────────────────────────────────────────────────
const STATS = [
  { value: 200,   suffix: "+",   label: "PMEs protégées",        prefix: ""   },
  { value: 2.3,   suffix: "Md€", label: "Volume hedgé",          prefix: ""   },
  { value: 99.7,  suffix: "%",   label: "Disponibilité agents",  prefix: ""   },
  { value: 4,     suffix: "min", label: "Déploiement moyen",     prefix: "<"  },
];

function useCountUp(target: number, duration = 1800, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;
    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = eased * target;
      setValue(isDecimal ? parseFloat(current.toFixed(1)) : Math.round(current));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return value;
}

function StatItem({ stat, active }: { stat: typeof STATS[0]; active: boolean }) {
  const count = useCountUp(stat.value, 1800, active);
  return (
    <div className="flex flex-col items-center text-center py-8 px-4">
      <div className="metric mb-1">
        <span className="text-text-tertiary text-2xl mr-1">{stat.prefix}</span>
        <span className="text-gradient-green">{count}</span>
        <span className="text-emerald-hedge">{stat.suffix}</span>
      </div>
      <p className="text-text-secondary text-sm">{stat.label}</p>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative border-y border-border bg-bg-surface">
      {/* Subtle glow at top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-hedge/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
          {STATS.map((stat) => (
            <StatItem key={stat.label} stat={stat} active={active} />
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-accent/20 to-transparent" />
    </section>
  );
}
