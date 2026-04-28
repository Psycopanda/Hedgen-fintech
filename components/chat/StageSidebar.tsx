"use client";

// components/chat/StageSidebar.tsx
// ─── BARRE DE PROGRESSION DU WORKFLOW ────────────────────────────────────────
// Affiche les 3 étapes du workflow et l'étape courante.

import { STAGES, StageId } from "@/lib/chat-types";

interface Props {
  currentStage: StageId | "done" | "impossible" | null;
  finished:     boolean;
  impossible:   boolean;
}

function StageIcon({ icon, active, done }: { icon: string; active: boolean; done: boolean }) {
  const color = done ? "text-emerald-hedge" : active ? "text-blue-accent" : "text-text-tertiary";

  if (icon === "chat") return (
    <svg viewBox="0 0 20 20" fill="none" className={`w-4 h-4 ${color}`}>
      <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H6l-4 3V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
  if (icon === "chart") return (
    <svg viewBox="0 0 20 20" fill="none" className={`w-4 h-4 ${color}`}>
      <path d="M2 15l5-5 4 3 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`w-4 h-4 ${color}`}>
      <path d="M11 2L4 11h7l-2 7 7-9h-7l2-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

export default function StageSidebar({ currentStage, finished, impossible }: Props) {
  const stageOrder: (StageId | "done" | "impossible")[] = [
    "interview", "analysis", "execution",
  ];

  const currentIndex = currentStage ? stageOrder.indexOf(currentStage as StageId) : -1;

  return (
    <aside className="w-64 border-r border-border bg-bg-surface flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-hedge flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
              <path d="M10 3L17 8L17 15Q10 18 3 15L3 8Z" fill="#040810" fillOpacity="0.9"/>
              <path d="M7 11L9.5 13.5L14 8.5" stroke="#040810" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-display font-bold text-base text-text-primary">Hedgen</span>
        </a>
      </div>

      {/* Étapes */}
      <div className="flex-1 p-6">
        <p className="text-text-tertiary text-xs font-mono uppercase tracking-wider mb-6">
          Workflow
        </p>

        <div className="relative">
          {/* Ligne verticale de connexion */}
          <div className="absolute left-4 top-8 bottom-8 w-px bg-border" />

          <div className="space-y-2">
            {STAGES.map((stage, i) => {
              const isDone    = finished || (currentIndex > i);
              const isActive  = !finished && currentIndex === i;
              const isPending = currentIndex < i && !finished;

              return (
                <div
                  key={stage.id}
                  className={`
                    relative flex items-start gap-3 p-3 rounded-xl transition-all duration-300
                    ${isActive  ? "bg-blue-accent/10 border border-blue-accent/20" : ""}
                    ${isDone    ? "bg-emerald-hedge/5" : ""}
                    ${isPending ? "opacity-40" : ""}
                  `}
                >
                  {/* Icône / Bullet */}
                  <div className={`
                    relative z-10 w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center
                    transition-all duration-300
                    ${isDone   ? "bg-emerald-hedge/20" : ""}
                    ${isActive ? "bg-blue-accent/20 animate-pulse-slow" : ""}
                    ${isPending ? "bg-bg-raised" : ""}
                  `}>
                    {isDone ? (
                      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-emerald-hedge">
                        <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <StageIcon icon={stage.icon} active={isActive} done={isDone} />
                    )}
                  </div>

                  <div>
                    <p className={`text-sm font-display font-semibold ${
                      isDone    ? "text-emerald-hedge" :
                      isActive  ? "text-blue-accent"   :
                                  "text-text-tertiary"
                    }`}>
                      {stage.label}
                    </p>
                    <p className="text-xs text-text-tertiary mt-0.5">{stage.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badge final */}
        {finished && !impossible && (
          <div className="mt-6 p-3 rounded-xl bg-emerald-hedge/10 border border-emerald-hedge/30">
            <p className="text-emerald-hedge text-xs font-semibold font-display">✓ Hedge exécuté</p>
            <p className="text-text-secondary text-xs mt-1">Confirmation envoyée</p>
          </div>
        )}
        {impossible && (
          <div className="mt-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-xs font-semibold font-display">✗ Hedge non réalisable</p>
            <p className="text-text-secondary text-xs mt-1">Voir l'explication ci-contre</p>
          </div>
        )}
      </div>

      {/* Footer sidebar */}
      <div className="p-6 border-t border-border">
        <p className="text-text-tertiary text-xs font-mono">Session sécurisée</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-hedge animate-pulse-slow" />
          <span className="text-emerald-hedge text-xs">Agents actifs</span>
        </div>
      </div>
    </aside>
  );
}
