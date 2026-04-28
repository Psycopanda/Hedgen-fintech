import type { Metadata } from "next";
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

// ─── FONTS ────────────────────────────────────────────────────────────────────
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400", "500"],
});

// ─── METADATA ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Hedgen — Agentic Hedging for SMEs",
  description:
    "Hedgen protects SMEs from currency and commodity risk using autonomous AI agents. No complexity. No overhead.",
  keywords: ["hedging", "SME", "AI", "agentic", "risk management", "forex", "fintech"],
  openGraph: {
    title: "Hedgen — Agentic Hedging for SMEs",
    description: "Protect your margins. Automate your hedges.",
    type: "website",
  },
};

// ─── LAYOUT ───────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${syne.variable} ${dmSans.variable} ${dmMono.variable} font-body bg-bg-base text-text-primary antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
