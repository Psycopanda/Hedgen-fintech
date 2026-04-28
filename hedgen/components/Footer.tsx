// components/Footer.tsx
// ─── FOOTER ───────────────────────────────────────────────────────────────────

const LINKS = {
  Produit:  ["Fonctionnalités", "Tarifs", "Sécurité", "Roadmap"],
  Ressources: ["Documentation", "API", "Blog", "Cas clients"],
  Légal:    ["Politique de confidentialité", "CGU", "Mentions légales", "RGPD"],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-surface">
      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-emerald-hedge flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                  <path d="M10 3 L17 8 L17 15 Q10 18 3 15 L3 8 Z" fill="#040810" fillOpacity="0.9"/>
                  <path d="M7 11 L9.5 13.5 L14 8.5" stroke="#040810" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display font-bold text-base text-text-primary">Hedgen</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Hedging agentique pour les PMEs. Protégez vos marges. Libérez votre croissance.
            </p>
            <p className="text-text-tertiary text-xs font-mono">Paris, France 🇫🇷</p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-display font-semibold text-sm text-text-primary mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-tertiary text-xs">
            © 2025 Hedgen SAS. Tous droits réservés.
          </p>
          <p className="text-text-tertiary text-xs font-mono">
            v0.1.0 — Propulsé par l&apos;IA agentique
          </p>
        </div>

      </div>
    </footer>
  );
}
