// app/chat/page.tsx
// ─── PAGE CHAT ────────────────────────────────────────────────────────────────
// Route : /chat
// Import dynamique pour éviter le SSR sur un composant full-client.

import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Hedgen — Analyse de couverture",
  description: "Démarrez votre analyse de hedge avec nos agents IA.",
};

const ChatInterface = dynamic(
  () => import("@/components/chat/ChatInterface"),
  { ssr: false }
);

export default function ChatPage() {
  return <ChatInterface />;
}
