// lib/chat-types.ts
// ─── TYPES DU CHAT ────────────────────────────────────────────────────────────

export type MessageRole = "user" | "agent" | "system";

export type StageId = "interview" | "analysis" | "execution";

export interface ChatMessage {
  id:        string;
  role:      MessageRole;
  content:   string;
  timestamp: Date;
  stage?:    StageId;   // quelle étape du workflow a produit ce message
}

export interface WorkflowStage {
  id:    StageId;
  label: string;
  description: string;
  icon:  "chat" | "chart" | "zap";
}

export const STAGES: WorkflowStage[] = [
  {
    id:          "interview",
    label:       "Collecte",
    description: "Comprendre votre exposition",
    icon:        "chat",
  },
  {
    id:          "analysis",
    label:       "Analyse",
    description: "Évaluation du hedge",
    icon:        "chart",
  },
  {
    id:          "execution",
    label:       "Exécution",
    description: "Passage de l'ordre",
    icon:        "zap",
  },
];
