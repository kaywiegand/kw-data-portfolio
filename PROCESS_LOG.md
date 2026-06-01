# PROCESS_LOG.md — website-portfolio

Verlauf + Entscheidungen. Pointer auf Files — kein Inhalt kopieren.
Metriken, Findings, Outputs gehören in Notebooks/Code — nicht hier.

---

## 2026-06-01 — Projekt-Setup

- Projekt initialisiert via `/project-init`
- MD-Files angelegt: CLAUDE.md · README.md · ROADMAP.md · BACKLOG.md · PROCESS_LOG.md
- Strategie definiert: Multi-Audience Platform (→ Plan `giggly-growing-rose.md`)
- Positioning: "Tech Consultant → Data & AI", primär Arbeitgeber Phase 1
- Stack entschieden: Vite · Three.js · GSAP · Lato · Plain HTML/CSS/JS
- Design Tokens festgelegt: `#0a0a0a` bg · `#e8ff00` accent · `#00d4ff` data
- Nächster Schritt: Vite + Three.js + GSAP installieren (Milestone A Schritt 2)

## 2026-06-01 — Milestone A abgeschlossen

**Setup**
- Vite 6 + Three.js 0.170 + GSAP 3.12 installiert via `package.json` (kein `npm create vite` — Ordner war nicht leer)
- Ordnerstruktur angelegt: `src/hero/` · `src/scroll/` · `src/styles/` · `for-employers/` · `work/` · `assets/`
- `.claude/launch.json` für Claude Preview MCP

**Implementiert**
- Design Tokens: `src/styles/variables.css` — alle Farben, Typo, Spacing, Z-Index
- Base Styles: `src/styles/base.css` — Reset, Lato Font, Selection, Scrollbar
- Layout: `src/styles/layout.css` — Nav, Hero, Sections, Grid, Footer, Responsive
- Components: `src/styles/components.css` — Buttons, Chips, Cards, Story Arc, Credibility Strip, Contact
- `index.html` — alle Sections live: Hero · Transition Story · Data Cases · Credibility Strip · Skills · Contact · Footer
- `src/hero/network.js` — Three.js 3D Network mit Mouse Parallax, Node Drift, Edge Animation
- `src/scroll/animations.js` — GSAP ScrollTrigger Stubs (Hero Text, Sections, Cards)
- `src/nav.js` — Scroll-based Nav Background
- `for-employers/index.html` — Stub mit Availability Badge + CTA
- `vite.config.js` — Multi-Page Build (index + for-employers)

**Entscheidungen**
- Three.js und GSAP bereits in Milestone A vollständig implementiert (nicht auf Milestone B/D verschoben) — sinnvoller als leere Shells
- Chunk-Warning ignoriert (Three.js ~585kb) — Code Splitting in Milestone D adressieren
- `for-employers/` als Stub live damit Build funktioniert; vollständiger Ausbau in Milestone E

**Visuell geprüft via Claude Preview MCP:** Hero ✅ · Story Arc ✅ · Data Cases ✅ · Credibility Strip ✅ · Skills ✅ · Contact ✅ · Footer ✅

- Nächster Schritt: Milestone B/C Review (Spacing, Mobile-Check) → dann Milestone D
