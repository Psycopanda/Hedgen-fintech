// components/HowItWorksSection.tsx
// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
// Timeline-style 3-step section explaining the agentic hedging flow.
// To edit steps: update the STEPS array.

// ── Edit steps here ───────────────────────────────────────────────────────────
const STEPS = [
  {
    number: "01",
    title: "Connectez votre exposition",
    description:
      "Hedgen se connecte à votre ERP, vos contrats fournisseurs ou votre banque pour identifier automatiquement vos expositions en devises et matières premières. Aucune saisie manuelle.",
    detail: "Connecteurs : SAP, Sage, QuickBooks, Kyriba, API bancaire…",
    accent: "green",
  },
  {
    number: "02",
    title: "Les agents analysent & décident",
    description:
      "Nos agents IA analysent en temps réel les marchés, votre tolérance au risque et vos flux prévisionnels. Ils calculent la stratégie de couverture optimale et la soumettent à validation (ou l'exécutent directement, selon votre configuration).",
    detail: "Forward, options, swaps — les agents choisissent l'instrument adapté.",
    accent: "blue",
  },
  {
    number: "03",
    title: "Rapport & audit complet",
    description:
      "Chaque opération est documentée, expliquée et archivée. Vous disposez d'un reporting complet pour votre équipe financière, vos auditeurs et vos régulateurs.",
    detail: "Export PDF / Excel. API reporting. Compatible MiFID II & EMIR.",
    accent: "green",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-32 px-6 bg-bg-surface relative overflow-hidden">

      {/* Background accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-blue-accent/5 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="section-label mb-4">Comment ça marche</div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary leading-tight">
              De l&apos;exposition<br />
              <span className="text-gradient-blue-green">à la couverture</span>
              <br />en 3 étapes.
            </h2>
          </div>
          <p className="text-text-secondary max-w-xs leading-relaxed">
            Déployé en moins de 4 minutes. Pas de DSI. Pas d'intégrateur. Juste vos agents qui travaillent.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical connector line (desktop) */}
          <div className="hidden md:block absolute left-[3.25rem] top-8 bottom-8 w-px bg-gradient-to-b from-emerald-hedge/40 via-blue-accent/30 to-emerald-hedge/40" />

          <div className="space-y-12">
            {STEPS.map((step, i) => (
              <div key={step.number} className="md:flex gap-12 items-start">

                {/* Number bubble */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div
                    className={`
                      w-[6.5rem] h-[6.5rem] rounded-2xl border flex items-center justify-center
                      font-display font-bold text-3xl
                      ${step.accent === "green"
                        ? "border-emerald-hedge/30 bg-emerald-hedge/5 text-emerald-hedge"
                        : "border-blue-accent/30 bg-blue-accent/5 text-blue-accent"
                      }
                    `}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-4 md:pt-6 pb-8">
                  <h3 className="font-display font-bold text-2xl text-text-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-4 max-w-xl">
                    {step.description}
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-raised border border-border">
                    <svg className="w-3.5 h-3.5 text-text-tertiary" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="text-xs text-text-secondary font-mono">{step.detail}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
