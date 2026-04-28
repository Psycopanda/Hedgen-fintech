// components/CTASection.tsx
// ─── CALL TO ACTION ───────────────────────────────────────────────────────────
// Bold, minimal final CTA before the footer.

export default function CTASection() {
  return (
    <section id="contact" className="py-40 px-6 relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[300px] rounded-full bg-emerald-hedge/8 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="section-label mb-8 mx-auto">Prêt à protéger vos marges ?</div>

        <h2 className="font-display font-bold text-5xl md:text-7xl text-text-primary leading-[1.05] mb-8">
          Vos agents<br />
          <span className="text-gradient-green">vous attendent.</span>
        </h2>

        <p className="text-text-secondary text-xl max-w-md mx-auto mb-12 leading-relaxed">
          Rejoignez les PMEs qui automatisent leur risk management avec Hedgen.
          Démo personnalisée en 20 minutes.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a href="/chat" className="btn-primary text-base px-8 py-4">
            Démarrer mon analyse de hedge
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="mailto:hello@hedgen.io" className="btn-ghost text-base px-8 py-4">
            Nous contacter
          </a>
        </div>

        {/* Trust signals */}
        <div className="mt-14 flex flex-wrap gap-8 justify-center items-center text-text-tertiary text-sm">
          {["Aucun engagement", "Déploiement en 4 min", "Support dédié", "Données EU uniquement"].map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-hedge" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
