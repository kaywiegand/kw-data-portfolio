// flow.js — Aether Flow Field
// Canvas 2D — particles follow a time-varying vector field
// Smooth, organic, data-stream aesthetic

// ─── Config ────────────────────────────────────────────────────────────────
const CONFIG = {
  particleCount: 600,
  fieldScale: 0.0018,         // zoom of the field
  fieldEvolution: 0.0008,     // how fast the field changes
  speed: 1.6,
  trailLength: 0.06,          // opacity of trail clear (lower = longer trails)
  lineWidth: 0.8,
  maxAge: 220,                 // frames before particle resets
  primaryColor: '0, 212, 255',   // data cyan
  accentColor: '232, 255, 0',    // lemon
  accentRatio: 0.06,
}

// ─── State ──────────────────────────────────────────────────────────────────
let canvas, ctx
let particles = []
let time = 0
let animId = null
let w, h

class FlowParticle {
  constructor() {
    this.reset()
    this.age = Math.random() * CONFIG.maxAge // stagger initial ages
    this.isAccent = Math.random() < CONFIG.accentRatio
  }

  reset() {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.px = this.x
    this.py = this.y
    this.age = 0
    this.maxAge = CONFIG.maxAge * (0.6 + Math.random() * 0.8)
    this.speed = CONFIG.speed * (0.5 + Math.random() * 0.8)
    this.isAccent = Math.random() < CONFIG.accentRatio
  }

  update() {
    this.age++
    if (this.age > this.maxAge ||
        this.x < 0 || this.x > w ||
        this.y < 0 || this.y > h) {
      this.reset()
      return
    }

    this.px = this.x
    this.py = this.y

    // Sample flow field angle
    const angle = fieldAngle(this.x, this.y, time)
    this.x += Math.cos(angle) * this.speed
    this.y += Math.sin(angle) * this.speed
  }

  draw(ctx) {
    const lifeRatio = this.age / this.maxAge
    // Fade in + fade out
    const alpha = Math.sin(lifeRatio * Math.PI) * 0.5
    if (alpha < 0.01) return

    const color = this.isAccent ? CONFIG.accentColor : CONFIG.primaryColor
    ctx.strokeStyle = `rgba(${color}, ${alpha})`
    ctx.lineWidth = CONFIG.lineWidth * (0.5 + (1 - lifeRatio) * 0.5)
    ctx.beginPath()
    ctx.moveTo(this.px, this.py)
    ctx.lineTo(this.x, this.y)
    ctx.stroke()
  }
}

// ─── Flow Field ─────────────────────────────────────────────────────────────
// Multi-octave sine field — no noise library needed
function fieldAngle(x, y, t) {
  const s = CONFIG.fieldScale
  const e = CONFIG.fieldEvolution

  // Octave 1 — large slow swirls
  const a1 = Math.sin(x * s + t * e) * Math.cos(y * s * 0.7 - t * e * 0.6) * Math.PI

  // Octave 2 — medium detail
  const a2 = Math.cos(x * s * 2.1 - t * e * 1.3 + 0.5) *
              Math.sin(y * s * 2.4 + t * e * 0.9) * Math.PI * 0.5

  // Octave 3 — subtle variation
  const a3 = Math.sin((x + y) * s * 0.5 + t * e * 0.4) * 0.3

  return a1 + a2 + a3
}

// ─── Init ───────────────────────────────────────────────────────────────────
export function initFlow(canvasEl) {
  canvas = canvasEl
  ctx = canvas.getContext('2d')

  resize()
  particles = Array.from({ length: CONFIG.particleCount }, () => new FlowParticle())

  window.addEventListener('resize', resize, { passive: true })
  loop()
}

function resize() {
  const rect = canvas.getBoundingClientRect()
  w = Math.round(rect.width) || canvas.offsetWidth || window.innerWidth || 1280
  h = Math.round(rect.height) || canvas.offsetHeight || window.innerHeight || 800
  canvas.width = w
  canvas.height = h
  // Reset particles on resize
  if (particles.length) {
    for (const p of particles) p.reset()
  }
}

function loop() {
  animId = requestAnimationFrame(loop)
  time++

  // Trail effect — clear with low opacity overlay
  ctx.fillStyle = `rgba(10, 10, 10, ${CONFIG.trailLength})`
  ctx.fillRect(0, 0, w, h)

  for (const p of particles) {
    p.update()
    p.draw(ctx)
  }
}

export function destroyFlow() {
  if (animId) cancelAnimationFrame(animId)
}
