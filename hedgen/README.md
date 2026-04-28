# Hedgen — Site marketing

Site Next.js 14 moderne pour Hedgen, une plateforme de hedging agentique pour les PMEs.

---

## 🚀 Démarrage rapide

```bash
npm install
npm run dev
# → http://localhost:3000
```

## 🌐 Déploiement Vercel

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Se connecter
vercel login

# 3. Déployer (depuis le dossier du projet)
vercel

# 4. Production
vercel --prod
```

Ou connectez directement le repo GitHub dans [vercel.com/new](https://vercel.com/new).

---

## 🗂️ Structure du projet

```
hedgen/
├── app/
│   ├── layout.tsx         ← Polices, métadonnées, balise <html>
│   ├── page.tsx           ← Assemblage des sections (ordre = page)
│   └── globals.css        ← Variables CSS, classes utilitaires
│
├── components/
│   ├── HeroCanvas.tsx     ← 🎨 Animation canvas (l'entrée animée)
│   ├── HeroSection.tsx    ← Section hero (texte + canvas)
│   ├── Navbar.tsx         ← Barre de navigation fixe
│   ├── StatsSection.tsx   ← Compteurs animés (4 métriques)
│   ├── FeaturesSection.tsx← Grille bento des fonctionnalités
│   ├── HowItWorksSection.tsx ← Timeline en 3 étapes
│   ├── CTASection.tsx     ← Appel à l'action final
│   └── Footer.tsx         ← Pied de page
│
├── tailwind.config.ts     ← 🎨 Tokens de design (couleurs, polices...)
└── README.md
```

---

## ✏️ Comment itérer

### Modifier les textes

Chaque composant expose ses textes en haut du fichier dans des constantes :

```tsx
// components/HeroSection.tsx
const HEADLINE_LINE1 = "Le risque, maîtrisé.";
const SUBLINE = "Hedgen protège...";
```

### Modifier les couleurs / design tokens

Tout part de `tailwind.config.ts` :

```ts
colors: {
  emerald: { hedge: "#00E87A" },  // ← couleur principale
  blue:    { accent: "#2A7FFF" }, // ← couleur secondaire
  bg:      { base: "#040810" },   // ← fond
}
```

### Modifier l'animation du hero

`components/HeroCanvas.tsx` — constantes en haut du fichier :

```ts
const CURVE_COUNT   = 28;      // nombre de courbes
const SPEED         = 0.0004;  // vitesse générale
const TURBULENCE    = 120;     // chaos côté gauche
const TRAIL_ALPHA   = 0.018;   // persistance des traînes
```

### Modifier les statistiques

```ts
// components/StatsSection.tsx
const STATS = [
  { value: 200, suffix: "+", label: "PMEs protégées", prefix: "" },
  ...
];
```

### Ajouter une section

1. Créer `components/MaSection.tsx`
2. L'importer dans `app/page.tsx`
3. L'ajouter dans le JSX à l'endroit voulu

---

## 🎨 Tokens de design

| Token | Valeur | Usage |
|-------|--------|-------|
| `emerald-hedge` | `#00E87A` | CTA, succès, accent |
| `blue-accent` | `#2A7FFF` | Secondaire, info |
| `bg-base` | `#040810` | Fond principal |
| `bg-surface` | `#070E1C` | Cards |
| `text-primary` | `#EEF2FF` | Titres |
| `text-secondary` | `#7B8DB0` | Corps de texte |

Polices :
- **Syne** (`font-display`) → titres, nav, labels
- **DM Sans** (`font-body`) → corps
- **DM Mono** (`font-mono`) → code, données
