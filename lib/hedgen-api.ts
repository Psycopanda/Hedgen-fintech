// lib/hedgen-api.ts
// ─── CLIENT API HEDGEN ────────────────────────────────────────────────────────
// Toutes les communications avec le backend FastAPI passent par ici.
// Pour changer l'URL du backend : modifier NEXT_PUBLIC_API_URL dans .env.local

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type WorkflowNode =
  | "interview"   // l'interviewer pose des questions
  | "analysis"    // le risk analyst travaille
  | "execution"   // le market executor passe l'ordre
  | "done"        // hedge exécuté avec succès
  | "impossible"; // hedge non réalisable

export interface ApiResponse {
  session_id: string;
  reply:      string;
  node:       WorkflowNode;
  finished:   boolean;
}

export interface SendMessageParams {
  message:    string;
  session_id?: string; // absent = nouvelle conversation
}

// ─── FONCTION PRINCIPALE ──────────────────────────────────────────────────────

export async function sendMessage({
  message,
  session_id,
}: SendMessageParams): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/chat`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      session_id: session_id ?? null,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Erreur inconnue" }));
    throw new Error(error.detail ?? `Erreur ${res.status}`);
  }

  return res.json() as Promise<ApiResponse>;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}
