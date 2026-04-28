// components/FeaturesSection.tsx
// ─── FEATURES SECTION ─────────────────────────────────────────────────────────
// Bento-grid layout showcasing Hedgen's core capabilities.
// To add/edit features: update the FEATURES array.
// Large card is always index 0. Small cards fill the rest.

// ── Edit features here ────────────────────────────────────────────────────────
const FEATURES = [
  {
    tag: "Core",
    icon: "agent",
    title: "Agents IA autonomes",
    description:
      "Nos agents surveillent en continu vos expositions, détectent les risques et exécutent des opérations de couverture optimales — sans intervention humaine. Chaque agent est spécialisé sur une classe d'actifs.",
    large: true,
    accent: "green",
  },
  {
    tag: "Temps réel",
    icon: "monitor",
    title: "Monitoring 24/7",
    description:
      "Tableau de bord en temps réel. Alertes instantanées. Visualisation de vos positions et P&L à chaque instant.",
    large: false,
    accent: "blue",
  },
  {
    tag: "Intégration",
    icon: "plug",
    title: "Connexion sans friction",
    description:
      "Connectez votre ERP, votre banque ou votre broker en quelques clics. API REST + webhooks inclus.",
    large: false,
    accent: "blue",
  },
  {
    tag: "Conformité",
    icon: "shield",
    title: "Auditable & conforme",
    description:
      "Chaque décision agent est tracée, expliquée et exportable. Conforme MiFID II et EMIR.",
    large: false,
    accent: "green",
  },
];

// ── Icon SVGs ─────────────────────────────────────────────────────────────────
function Icon({ name, className }: { name: string; className?: string }) {
  const cls = `w-5 h-5 ${className}`;
  if (name === "agent") return (
    <svg viewBox="0 0 24 24" fill="none" className={cls}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M19 8l2-2M5 8L3 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="19" cy="6" r="1.5" fill="currentColor"/>
      <circle cx="5" cy="6" r="1.5" fill="currentColor"/>
    </svg>
  );
  if (name === "monitor") return (
    <svg viewBox="0 0 24 24" fill="none" className={cls}>
      <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 11l3-3 3 3 3-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  if (name === "plug") return (
    <svg viewBox="0 0 24 24" fill="none" className={cls}>
      <path d="M14 2v6M10 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 8h10l-1.5 6H8.5L7 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M12 14v4M10 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  if (name === "shield") return (
    <svg viewBox="0 0 24 24" fill="none" className={cls}>
      <path d="M12 3L4 7v6c0 4 3.5 7.5 8 9 4.5-1.5 8-5 8-9V7L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  return null;
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <div className="section-label mb-4">Fonctionnalités</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary max-w-xl leading-tight">
            Tout ce dont une PME a besoin.{" "}
            <span className="text-gradient-green">Rien de plus.</span>
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Large feature card (col-span-2) */}
          {(() => {
            const f = FEATURES[0];
            return (
              <div
                key={f.title}
                className="md:col-span-2 card group relative overflow-hidden"
              >
                {/* Background glow */}
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-hedge/5 blur-3xl group-hover:bg-emerald-hedge/10 transition-colors duration-700" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-hedge/10 flex items-center justify-center text-emerald-hedge">
                      <Icon name={f.icon} />
                    </div>
                    <span className="section-label text-[10px]">{f.tag}</span>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-text-primary mb-3">
                    {f.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">{f.description}</p>

                  {/* Decorative: mini agent activity visualization */}
                  <div className="mt-8 p-4 rounded-xl bg-bg-raised border border-border font-mono text-xs text-text-secondary space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-hedge animate-pulse-slow" />
                      <span>agent_fx</span>
                      <span className="text-emerald-hedge ml-auto">EXÉCUTÉ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-accent animate-pulse-slow delay-200" />
                      <span>agent_commodity</span>
                      <span className="text-blue-accent ml-auto">EN COURS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary" />
                      <span>agent_rates</span>
                      <span className="text-text-tertiary ml-auto">EN VEILLE</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Small cards (col-span-1 each) */}
          {FEATURES.slice(1).map((f) => (
            <div key={f.title} className="card group relative overflow-hidden">
              <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl transition-colors duration-700
                ${f.accent === "green"
                  ? "bg-emerald-hedge/5 group-hover:bg-emerald-hedge/10"
                  : "bg-blue-accent/5 group-hover:bg-blue-accent/10"
                }`}
              />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                    ${f.accent === "green"
                      ? "bg-emerald-hedge/10 text-emerald-hedge"
                      : "bg-blue-accent/10 text-blue-accent"
                    }`}
                  >
                    <Icon name={f.icon} />
                  </div>
                  <span className="section-label text-[10px]">{f.tag}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-text-primary mb-2">
                  {f.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
