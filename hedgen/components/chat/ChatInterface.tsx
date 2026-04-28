"use client";

// components/chat/ChatInterface.tsx
// ─── INTERFACE DE CHAT PRINCIPALE ────────────────────────────────────────────
// Gère l'état de la conversation, les appels API et l'affichage.
//
// Flux :
//   1. Utilisateur envoie un message
//   2. sendMessage() appelle le backend
//   3. On affiche la réponse + on met à jour l'étape du workflow
//   4. Si finished=true, on affiche l'état final

import { useState, useRef, useEffect, useCallback } from "react";
import { nanoid } from "nanoid"; // petit utilitaire d'ID unique
import { sendMessage, WorkflowNode } from "@/lib/hedgen-api";
import { ChatMessage, StageId } from "@/lib/chat-types";
import MessageBubble   from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import StageSidebar    from "./StageSidebar";

// ── Correspondance node API → stage UI ────────────────────────────────────────
function nodeToStage(node: WorkflowNode): StageId {
  if (node === "analysis") return "analysis";
  if (node === "execution" || node === "done") return "execution";
  return "interview";
}

// ── Message de bienvenue ──────────────────────────────────────────────────────
const WELCOME_MESSAGE: ChatMessage = {
  id:        "welcome",
  role:      "agent",
  content:   "Bonjour, je suis votre conseiller Hedgen. Je suis là pour vous aider à mettre en place une stratégie de couverture adaptée à votre entreprise.\n\nPour commencer, pouvez-vous me décrire votre activité et les risques financiers auxquels vous êtes exposé ? (risque de change, matières premières, taux d'intérêt…)",
  timestamp: new Date(),
  stage:     "interview",
};

export default function ChatInterface() {
  const [messages,    setMessages]    = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [sessionId,   setSessionId]   = useState<string | null>(null);
  const [input,       setInput]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [currentNode, setCurrentNode] = useState<WorkflowNode>("interview");
  const [finished,    setFinished]    = useState(false);
  const [impossible,  setImpossible]  = useState(false);

  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLTextAreaElement>(null);

  // Scroll automatique vers le bas à chaque nouveau message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Envoi d'un message ──────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || finished) return;

    // 1. Affiche immédiatement le message utilisateur
    const userMsg: ChatMessage = {
      id:        nanoid(),
      role:      "user",
      content:   text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // 2. Si c'est la première fois, affiche un message système
    if (!sessionId) {
      setMessages((prev) => [...prev, {
        id:        nanoid(),
        role:      "system",
        content:   "Connexion aux agents Hedgen…",
        timestamp: new Date(),
      }]);
    }

    try {
      // 3. Appel API backend
      const response = await sendMessage({
        message:    text,
        session_id: sessionId ?? undefined,
      });

      // 4. Sauvegarde le session_id (première réponse)
      if (!sessionId) {
        setSessionId(response.session_id);
      }

      // 5. Met à jour le nœud courant
      setCurrentNode(response.node);

      // 6. Message système si changement d'étape
      if (response.node === "analysis" && currentNode === "interview") {
        setMessages((prev) => [...prev, {
          id:        nanoid(),
          role:      "system",
          content:   "Dossier transmis à l'analyste des risques…",
          timestamp: new Date(),
        }]);
      }
      if (response.node === "execution" || response.node === "done") {
        setMessages((prev) => [...prev, {
          id:        nanoid(),
          role:      "system",
          content:   "Plan de hedge validé — transmission au trader…",
          timestamp: new Date(),
        }]);
      }

      // 7. Affiche la réponse de l'agent
      const agentMsg: ChatMessage = {
        id:        nanoid(),
        role:      "agent",
        content:   response.reply,
        timestamp: new Date(),
        stage:     nodeToStage(response.node),
      };
      setMessages((prev) => [...prev, agentMsg]);

      // 8. État final
      if (response.finished) {
        setFinished(true);
        if (response.node === "impossible") {
          setImpossible(true);
        }
      }

    } catch (err) {
      // Erreur réseau ou API
      setMessages((prev) => [...prev, {
        id:        nanoid(),
        role:      "system",
        content:   `Erreur : ${err instanceof Error ? err.message : "Connexion impossible au backend."}`,
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, finished, sessionId, currentNode]);

  // ── Envoi avec Entrée (Shift+Entrée = saut de ligne) ──────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Redémarrer la conversation ────────────────────────────────────────────
  const handleRestart = () => {
    setMessages([WELCOME_MESSAGE]);
    setSessionId(null);
    setInput("");
    setLoading(false);
    setCurrentNode("interview");
    setFinished(false);
    setImpossible(false);
  };

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden">

      {/* ── Sidebar étapes ────────────────────────────────────────────────── */}
      <StageSidebar
        currentStage={finished ? (impossible ? "impossible" : "done") : nodeToStage(currentNode)}
        finished={finished && !impossible}
        impossible={impossible}
      />

      {/* ── Zone principale ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="h-14 border-b border-border bg-bg-surface flex items-center justify-between px-6 flex-shrink-0">
          <div>
            <h1 className="font-display font-semibold text-sm text-text-primary">
              Analyse de couverture
            </h1>
            <p className="text-text-tertiary text-xs font-mono">
              {sessionId ? `Session ${sessionId.slice(0, 8)}…` : "Nouvelle session"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Indicateur de connexion */}
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-hedge animate-pulse-slow" />
              <span className="text-text-tertiary text-xs">Backend connecté</span>
            </div>

            {/* Bouton relancer */}
            {finished && (
              <button
                onClick={handleRestart}
                className="btn-ghost text-xs py-1.5 px-3"
              >
                Nouvelle analyse
              </button>
            )}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-1">
          {messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isLatest={i === messages.length - 1 && msg.role === "agent"}
            />
          ))}

          {/* Indicateur de chargement */}
          {loading && <TypingIndicator stage={currentNode} />}

          {/* Ancre de scroll */}
          <div ref={bottomRef} />
        </div>

        {/* Zone de saisie */}
        <div className={`
          border-t border-border bg-bg-surface px-6 py-4 flex-shrink-0
          transition-opacity duration-300
          ${finished ? "opacity-50 pointer-events-none" : ""}
        `}>
          {finished ? (
            // Message si conversation terminée
            <div className="flex items-center justify-center py-2">
              <p className="text-text-tertiary text-sm font-mono">
                {impossible
                  ? "Cette demande ne peut pas être couverte dans les conditions actuelles."
                  : "Votre ordre de couverture a été transmis. Notre équipe vous contactera sous 24h."
                }
              </p>
            </div>
          ) : (
            <div className="flex gap-3 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Décrivez votre situation ou répondez à la question…"
                rows={1}
                className={`
                  flex-1 bg-bg-raised border border-border rounded-xl px-4 py-3
                  text-text-primary text-sm placeholder:text-text-tertiary
                  resize-none outline-none
                  focus:border-emerald-hedge/50 focus:ring-1 focus:ring-emerald-hedge/20
                  transition-all duration-200
                  max-h-32 overflow-y-auto
                  font-body leading-relaxed
                `}
                style={{
                  height: "auto",
                  minHeight: "48px",
                }}
                onInput={(e) => {
                  const t = e.target as HTMLTextAreaElement;
                  t.style.height = "auto";
                  t.style.height = Math.min(t.scrollHeight, 128) + "px";
                }}
                disabled={loading}
                autoFocus
              />

              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className={`
                  w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                  transition-all duration-200
                  ${input.trim() && !loading
                    ? "bg-emerald-hedge text-bg-base hover:scale-105 hover:shadow-[0_0_20px_#00E87A44]"
                    : "bg-bg-raised text-text-tertiary cursor-not-allowed"
                  }
                `}
              >
                {loading ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8h12M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          )}

          <p className="text-text-tertiary text-[10px] mt-2 font-mono text-center">
            Entrée pour envoyer · Shift+Entrée pour un saut de ligne
          </p>
        </div>

      </div>
    </div>
  );
}
