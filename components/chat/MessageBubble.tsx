"use client";

// components/chat/MessageBubble.tsx
// ─── BULLE DE MESSAGE ────────────────────────────────────────────────────────

import { ChatMessage } from "@/lib/chat-types";

const STAGE_LABELS: Record<string, string> = {
  interview: "Conseiller",
  analysis:  "Analyste des risques",
  execution: "Trader exécutif",
};

interface Props {
  message:   ChatMessage;
  isLatest?: boolean;
}

export default function MessageBubble({ message, isLatest }: Props) {
  const isUser   = message.role === "user";
  const isSystem = message.role === "system";

  // ── Message système (ex: "Analyse en cours...") ───────────────────────────
  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-bg-raised border border-border">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-accent animate-pulse-slow" />
          <span className="text-text-tertiary text-xs font-mono">{message.content}</span>
        </div>
      </div>
    );
  }

  // ── Message utilisateur ───────────────────────────────────────────────────
  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[70%]">
          <div className="bg-blue-accent/20 border border-blue-accent/30 rounded-2xl rounded-tr-sm px-4 py-3">
            <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          <p className="text-text-tertiary text-[10px] text-right mt-1 font-mono">
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  // ── Message agent ─────────────────────────────────────────────────────────
  const agentLabel = message.stage ? STAGE_LABELS[message.stage] : "Agent";

  return (
    <div className="flex gap-3 mb-4">
      {/* Avatar agent */}
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-hedge/10 border border-emerald-hedge/20 flex items-center justify-center mt-1">
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-emerald-hedge">
          <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M2 14c0-2.761 2.686-5 6-5s6 2.239 6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="flex-1 max-w-[80%]">
        {/* Label de l'agent */}
        <p className="text-emerald-hedge text-[10px] font-mono uppercase tracking-wider mb-1">
          {agentLabel}
        </p>

        {/* Bulle */}
        <div className={`
          bg-bg-surface border rounded-2xl rounded-tl-sm px-4 py-3
          ${isLatest ? "border-emerald-hedge/20" : "border-border"}
        `}>
          {/* Si le message contient des sections markdown-like (##) on les formate */}
          <FormattedContent content={message.content} />
        </div>

        <p className="text-text-tertiary text-[10px] mt-1 font-mono">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

// ── Formatage basique des sections ## ────────────────────────────────────────
function FormattedContent({ content }: { content: string }) {
  // Supprime les marqueurs internes ([RAPPORT FINAL], [HEDGE VALIDE], etc.)
  const cleaned = content
    .replace(/\[RAPPORT FINAL\]/g, "")
    .replace(/\[ANALYSE INTERNE\]/g, "")
    .replace(/\[HEDGE VALIDE\]/g, "")
    .replace(/\[HEDGE IMPOSSIBLE\]/g, "")
    .replace(/\[PLAN DE HEDGE\]/g, "")
    .replace(/\[ORDRE EXÉCUTÉ\]/g, "")
    .trim();

  const lines = cleaned.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <p key={i} className="text-text-primary font-display font-semibold text-sm mt-3 mb-1 first:mt-0">
              {line.replace("## ", "")}
            </p>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-emerald-hedge mt-1.5 text-[8px]">●</span>
              <p className="text-text-secondary text-sm leading-relaxed">{line.replace("- ", "")}</p>
            </div>
          );
        }
        if (line.trim() === "") {
          return <div key={i} className="h-1" />;
        }
        return (
          <p key={i} className="text-text-secondary text-sm leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
