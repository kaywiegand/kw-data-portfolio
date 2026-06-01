# ROADMAP — website-portfolio

> Ausgangslage → Phasen → Ziel

---

## Ausgangslage

Kein Portfolio live. Alte Website kaywiegand.de veraltet (AngularJS, kein Data/AI-Bezug).
Neue Positionierung: Senior Tech Consultant → Data & AI.
Zielgruppe Phase 1: Arbeitgeber, Data & AI Jobs.

---

## Phasen

- [x] **Milestone A** — Fundament & Setup ✅
  - [x] `/project-init website-portfolio web` — MD-Files + git
  - [x] Vite + Three.js + GSAP installieren (node v24, npm 11)
  - [x] Design Tokens + Base Styles (`variables.css` · `base.css` · `layout.css` · `components.css`)
  - [x] index.html Grundgerüst — alle Sections live, `build` grün

- [ ] **Milestone B** — Hero (Three.js bereits implementiert in A)
  - [x] Three.js 3D Network Scene (`src/hero/network.js`)
  - [x] Mouse Parallax + Animation Loop
  - [x] Text Overlay + CTA
  - [ ] Review: Hero Timing, Spacing, Mobile-Check

- [ ] **Milestone C** — Content Sections (bereits in A gebaut, Review ausstehend)
  - [x] Transition Story Section
  - [x] Data Cases (zh-tram-flow featured + Teaser-Cards)
  - [x] Credibility Strip (Logos + Awards)
  - [x] Skills Section
  - [x] Contact + Footer
  - [ ] Review: Spacing, Typografie, Mobile-Check

- [ ] **Milestone D** — GSAP + Responsive + Build
  - [x] GSAP ScrollTrigger Animationen (Stub in `src/scroll/animations.js`)
  - [ ] Animationen ausbauen + tunen
  - [ ] Mobile Responsive vollständig prüfen
  - [ ] Code Splitting (Three.js lazy load)
  - [ ] `npm run build` → finaler Check

- [ ] **Milestone E** — Landing Pages
  - [x] `/for-employers/index.html` — Stub live
  - [ ] `/for-employers/` vollständig ausbauen
  - [ ] `/for-clients/` (Phase 2+)
  - [ ] `/for-ai-projects/` (Phase 2+)

---

## Ziel

Live-Portfolio das Kay als Senior Tech Consultant mit Data & AI Expertise positioniert.
Multi-Audience Platform: unterschiedliche Landing Pages je Zielgruppe.
AI Workflow Build-Prozess als eigenständiger Case dokumentiert.
