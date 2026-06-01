# CLAUDE.md — website-portfolio

> Projektspezifische Anweisungen für Claude Code.
> Ergänzt die globale CLAUDE.md aus dem Workspace-Root.

---

## Projekt

| Feld | Inhalt |
| :--- | :--- |
| Slug | `website-portfolio` |
| Typ | web |
| Stack | Vite · Three.js · GSAP · Lato · Plain HTML/CSS/JS |
| Status | 🟢 aktiv |

---

## Architektur

Multi-Audience Platform — eine Codebase, mehrere Landing Pages:

```
index.html              ← Hauptseite: Arbeitgeber / Data & AI Jobs (Phase 1)
for-employers/          ← Landing Page: Arbeitgeber, Data & AI Jobs
for-clients/            ← Landing Page: Freelance Data Consultant (Phase 2+)
for-ai-projects/        ← Landing Page: AI Workflows & Agents (Phase 2+)
```

---

## Positioning

> "20+ years building digital products for global brands.
> Now channeling that technical depth into data engineering, analytics and AI."

Primäre Zielgruppe Phase 1: Arbeitgeber / HR in Data & AI

---

## Design Tokens

```css
--color-bg:       #0a0a0a;
--color-surface:  #111111;
--color-text:     #f0f0f0;
--color-muted:    #888888;
--color-accent:   #e8ff00;    /* Lemon Energy */
--color-data:     #00d4ff;    /* Data/AI Cyan */
--font:           'Lato', sans-serif;
```

---

## Session-Einstieg

1. PROCESS_LOG.md lesen — aktueller Stand und letzte Session
2. ROADMAP.md lesen — offene Phasen
3. Globale CLAUDE.md aus `/Users/kaywiegand/Workspace/` gilt weiterhin

---

## Projektspezifische Konventionen

- Code (JS, CSS, HTML) immer Englisch
- Three.js Scene in `src/hero/network.js` isoliert halten
- GSAP ScrollTrigger in `src/scroll/animations.js`
- Build: `npm run build` → `dist/`
- Dev: `npm run dev` → `localhost:5173`
- Keine Frameworks (React/Vue/Angular) — Plain HTML/CSS/JS
