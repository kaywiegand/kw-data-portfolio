# website-portfolio

> Kay Wiegand — Professional portfolio website. Multi-audience platform for Data & AI positioning.

---

## Überblick

Portfolio-Website als Multi-Audience Platform. Primäre Zielgruppe Phase 1: Arbeitgeber in Data & AI.

Positioning: "Senior Tech Consultant transitioning into Data & AI Engineering."

## Stack

- **Vite** — Build tool (dev + production)
- **Three.js** — WebGL 3D Hero animation
- **GSAP + ScrollTrigger** — Scroll animations
- **Lato** — Font (brand continuity)
- Plain HTML · CSS · JS — no frameworks

## Setup

```bash
npm install
npm run dev    # localhost:5173
npm run build  # → dist/
```

## Struktur

```
src/
├── main.js
├── hero/network.js          ← Three.js Scene
├── scroll/animations.js     ← GSAP ScrollTrigger
└── styles/
    ├── variables.css
    ├── base.css
    ├── layout.css
    └── components.css
for-employers/
└── index.html
work/
└── zh-tram-flow.html
assets/
├── fonts/
└── img/
```
