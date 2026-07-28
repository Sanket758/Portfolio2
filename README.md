# Sanket Gadge — Personal Portfolio

Modern, responsive portfolio for an AI/ML Engineer. Dark scientific-instrument aesthetic with Canvas 2D signal-processing visuals. Zero backend — all content is static JSON, deployable anywhere.

---

## ✨ Features

- **FourierCanvas Hero** — 5-wave Fourier synthesis with mouse-bend interaction and 8 traveling signal nodes. Pure Canvas 2D, no WebGL/Three.js.
- **4 Signal Motifs** — MiniOscilloscope, PhaseStripe, EQBars, CompositeWaveUnderline — applied across sections for a cohesive instrumentation lab feel.
- **Dark Scientific Palette** — `#05070f` background with cyan/teal signal accents (`#00e5ff`, `#00b8d4`, `#7c4dff`).
- **DE/EN i18n** — Full German/English translations via `LanguageContext`. Language persisted in localStorage.
- **Static Data Layer** — JSON files (`blogs.json`, `education.json`, `experience.json`, `sections.json`, `skills.json`) — no database needed.
- **CV Generator** — Downloadable PDF CV built with jsPDF + html2canvas.
- **Legal Pages** — Impressum (§5 TMG) and Datenschutz (DSGVO) included.
- **Playwright Visual Regression** — 14 screenshot tests across desktop and mobile viewports.
- **Fully Responsive** — Mobile-first layout from 390px to 1440px+.
- **CI/CD Ready** — Vercel auto-deploys on push to `main`.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- npm

### Installation

```bash
git clone https://github.com/Sanket758/Portfolio2.git
cd Portfolio2
npm install
npm run dev
```

The dev server starts at `http://localhost:3000`.

No environment variables, API keys, or database setup required. The portfolio runs entirely on static data.

---

## 📁 Project Structure

```
├── App.tsx                  # Root — i18n provider, scroll observer, section layout
├── index.tsx                # Entry point
├── index.css                # Global styles + CSS custom properties (palette)
├── vite.config.ts           # Vite config, path aliases, dev server
├── tailwind.config.js       # Tailwind — dark palette tokens
├── playwright.config.ts     # Playwright — desktop (1440px) + mobile (390px)
├── vercel.json              # Vercel SPA deployment config
│
├── components/
│   ├── Header.tsx           # Sticky nav with active-section tracking
│   ├── Hero.tsx             # Section wrapper for FourierCanvas
│   ├── About.tsx            # Portrait + bio
│   ├── Experience.tsx       # Timeline
│   ├── Education.tsx        # Education timeline
│   ├── Projects.tsx         # Project cards
│   ├── Skills.tsx           # Skill bars
│   ├── Writing.tsx          # Blog links
│   ├── Contact.tsx          # Mailto form + social links
│   ├── Footer.tsx           # Footer with legal links
│   │
│   ├── visuals/             # Canvas 2D signal components
│   │   ├── FourierCanvas.tsx        # Hero — 5-wave Fourier synthesis
│   │   ├── MiniOscilloscope.tsx     # About — waveform visualizer
│   │   ├── PhaseStripe.tsx          # Experience — phase-shift stripes
│   │   ├── EQBars.tsx               # Skills — equalizer bars
│   │   ├── CompositeWaveUnderline.tsx # Section dividers
│   │   ├── GlowCard.tsx             # Card glow effect
│   │   ├── AboutPortrait.tsx        # About section portrait
│   │   └── canvas-utils.ts          # Shared drawing primitives
│   │
│   └── admin/               # Admin panel (dead code — not imported by App.tsx)
│
├── i18n/
│   ├── LanguageContext.tsx   # React context for DE/EN switching
│   ├── de.ts                # German translations
│   └── en.ts                # English translations
│
├── lib/
│   ├── dataLoader.ts        # JSON data fetch helper
│   └── generateCV.ts        # PDF CV generation (jsPDF + html2canvas)
│
├── pages/
│   ├── Impressum.tsx        # §5 TMG legal notice
│   └── Datenschutz.tsx      # DSGVO privacy policy
│
├── public/assets/           # Static images (headshot, pipeline illustration)
├── tests/                   # Playwright visual regression tests
└── *.json                   # Static data: blogs, education, experience, sections, skills
```

---

## 🧪 Testing

```bash
# Run all Playwright tests (requires dev server)
npm run test:e2e

# Update visual baselines after intentional design changes
npm run test:e2e:update

# Run tests in headed mode for debugging
npm run test:e2e:headed
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19, TypeScript 5.8 |
| **Build** | Vite 6 |
| **Styling** | Tailwind CSS 3.4 + CSS custom properties |
| **Animation** | Canvas 2D, Framer Motion |
| **i18n** | Custom React context (DE/EN) |
| **CV PDF** | jsPDF 3.x + html2canvas |
| **Testing** | Playwright 1.62 (visual regression) |
| **Deployment** | Vercel (auto-deploy from GitHub) |

---

## ☁️ Deployment

The repo includes `vercel.json` with Vite preset and SPA rewrites. To deploy:

1. Push to `main` on GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Vercel auto-detects Vite — settings are pre-configured in `vercel.json`
4. Click **Deploy** — subsequent pushes to `main` auto-deploy