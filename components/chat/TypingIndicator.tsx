"use client";

// components/chat/TypingIndicator.tsx
// ─── INDICATEUR "L'AGENT RÉFLÉCHIT" ─────────────────────────────────────────

const STAGE_MESSAGES: Record<string, string> = {
  interview: "Le conseiller analyse votre réponse…",
  analysis:  "L'analyste des risques évalue votre dossier…",
  execution: "Le trader prépare l'exécution de l'ordre…",
  default:   "Les agents travaillent…",
};

interface Props {
  stage: string;
}

export default function TypingIndicator({ stage }: Props) {
  const label = STAGE_MESSAGES[stage] ?? STAGE_MESSAGES.default;

  return (
    <div className="flex gap-3 mb-4">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-hedge/10 border border-emerald-hedge/20 flex items-center justify-center animate-pulse-slow">
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-emerald-hedge">
          <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M2 14c0-2.761 2.686-5 6-5s6 2.239 6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>

      <div>
        <p className="text-emerald-hedge text-[10px] font-mono uppercase tracking-wider mb-1">
          Hedgen Agent
        </p>

        <div className="bg-bg-surface border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-3">
          {/* Dots animation */}
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-emerald-hedge"
                style={{
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          <span className="text-text-tertiary text-xs font-mono">{label}</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%            { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
