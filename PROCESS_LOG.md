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

## 2026-06-02 — Hero Animation Überarbeitung + Varianten

**Entscheidung**
- Three.js Network als PRIMARY Hero-Animation gewählt
- Fullscreen background-Style: Canvas fixed im Viewport, Content scrolls oben drüber
- Scroll-Dim-Effekt: Dezentes Abdimmen auf 70% Opacity beim Scrollen (easing curve)

**Implementiert**
- `src/hero/network.js` v2: Vollständig neu mit direkter Maus-Interaktion (Node Repulsion statt nur Camera Parallax)
- `src/hero/swarm.js` + `src/hero/flow.js`: Zwei alternative Canvas 2D Animationen für A/B Compare
- `/compare/index.html`: Vergleichsseite mit Tab-Switch zwischen 3 Varianten (Network · Swarm · Flow)
- `index.html`: Hero refactored → fullscreen Network BG + Dim-Overlay mit GSAP scroll animation
- `src/main.js`: Scroll-Dim-Logic mit easing
- `assets/fonts/`: Self-hosted Lato-Fonts von kaywiegand.de (kein Google Fonts dependency)

**Feedback → Entscheidung**
- A (Network): "fehlt interaction" → Fixed: Node Repulsion auf Cursor (3D Unprojection)
- B (Swarm): "buggy dispersed elements" → Keep für Compare-Seite, aber nicht primary
- C (Flow): Kandidat für zukünftige Variante, nicht für MVP

**Build & Deploy**
- Vite build grün, Code Splitting aktiv (Three.js 468kb separater Chunk)
- Production: localhost:5173 fullscreen Network working mit Scroll-Dim
- Committed + gepusht zu origin/main

**Nächster Schritt**
- Milestone D: Mobile Responsive, weitere GSAP ScrollTrigger (Sections)
- Milestone E: `/for-employers/` vollständig ausbauen
