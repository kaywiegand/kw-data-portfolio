// swarm.js — AI Swarm Visualization
// Canvas 2D — particles cluster around attractors, connect when close, break apart
// Inspired by emergent AI behavior / neural network feel

// ─── Config ───────────────────────────────────────────────────────────────
const CONFIG = {
  particleCount: 180,
  attractorCount: 5,
  connectionDistance: 90,
  attractionStrength: 0.018,
  repulsionDistance: 30,
  maxSpeed: 1.8,
  particleColor: '0, 212, 255',       // data cyan
  accentColor: '232, 255, 0',          // lemon accent
  connectionOpacity: 0.12,
  particleOpacity: 0.85,
  mouse: { x: -9999, y: -9999, influence: 120, strength: 0.04 },
}

// ─── State ─────────────────────────────────────────────────────────────────
let canvas, ctx
let particles = []
let attractors = []
let mouse = { x: -9999, y: -9999 }
let animId = null
let time = 0

class Particle {
  constructor(w, h) {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.vx = (Math.random() - 0.5) * 1.5
    this.vy = (Math.random() - 0.5) * 1.5
    this.size = Math.random() * 2.5 + 1
    this.isAccent = Math.random() < 0.08
    this.pulse = Math.random() * Math.PI * 2
  }

  update(w, h, attractors) {
    this.pulse += 0.03

    // Attraction to nearest attractor
    let nearestDist = Infinity
    let nearestAtt = null
    for (const att of attractors) {
      const d = Math.hypot(att.x - this.x, att.y - this.y)
      if (d < nearestDist) { nearestDist = d; nearestAtt = att }
    }
    if (nearestAtt) {
      this.vx += (nearestAtt.x - this.x) * CONFIG.attractionStrength * 0.01
      this.vy += (nearestAtt.y - this.y) * CONFIG.attractionStrength * 0.01
    }

    // Repulsion from others (simplified — only check attractors for perf)
    for (const att of attractors) {
      const d = Math.hypot(att.x - this.x, att.y - this.y)
      if (d < CONFIG.repulsionDistance) {
        this.vx -= (att.x - this.x) * 0.05
        this.vy -= (att.y - this.y) * 0.05
      }
    }

    // Mouse repulsion
    const md = Math.hypot(mouse.x - this.x, mouse.y - this.y)
    if (md < CONFIG.mouse.influence) {
      const force = (1 - md / CONFIG.mouse.influence) * CONFIG.mouse.strength
      this.vx -= (mouse.x - this.x) / md * force * 8
      this.vy -= (mouse.y - this.y) / md * force * 8
    }

    // Speed cap
    const speed = Math.hypot(this.vx, this.vy)
    if (speed > CONFIG.maxSpeed) {
      this.vx = (this.vx / speed) * CONFIG.maxSpeed
      this.vy = (this.vy / speed) * CONFIG.maxSpeed
    }

    // Slight damping
    this.vx *= 0.99
    this.vy *= 0.99

    this.x += this.vx
    this.y += this.vy

    // Wrap edges
    if (this.x < 0) this.x = w
    if (this.x > w) this.x = 0
    if (this.y < 0) this.y = h
    if (this.y > h) this.y = 0
  }

  draw(ctx) {
    const pulse = 0.7 + Math.sin(this.pulse) * 0.3
    const color = this.isAccent ? CONFIG.accentColor : CONFIG.particleColor
    const alpha = CONFIG.particleOpacity * pulse
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${color}, ${alpha})`
    ctx.fill()
  }
}

class Attractor {
  constructor(w, h, index, total) {
    // Spread attractors in a loose grid
    const col = index % 3
    const row = Math.floor(index / 3)
    this.x = (w * 0.15) + (w * 0.7 / 2) * col + (Math.random() - 0.5) * 80
    this.y = (h * 0.2) + (h * 0.6 / Math.ceil(total / 3)) * row + (Math.random() - 0.5) * 80
    this.baseX = this.x
    this.baseY = this.y
    this.phase = Math.random() * Math.PI * 2
    this.speed = 0.003 + Math.random() * 0.003
    this.radius = 40 + Math.random() * 60
  }

  update(time) {
    this.x = this.baseX + Math.cos(this.phase + time * this.speed) * this.radius
    this.y = this.baseY + Math.sin(this.phase + time * this.speed * 0.7) * this.radius * 0.5
  }
}

// ─── Init ──────────────────────────────────────────────────────────────────
export function initSwarm(canvasEl) {
  canvas = canvasEl
  ctx = canvas.getContext('2d')

  resize()
  buildParticles()

  window.addEventListener('resize', resize, { passive: true })
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
  }, { passive: true })
  canvas.addEventListener('mouseleave', () => {
    mouse.x = -9999; mouse.y = -9999
  })

  loop()
}

function resize() {
  const rect = canvas.getBoundingClientRect()
  canvas.width = Math.round(rect.width) || canvas.offsetWidth || window.innerWidth || 1280
  canvas.height = Math.round(rect.height) || canvas.offsetHeight || window.innerHeight || 800
  buildParticles()
}

function buildParticles() {
  const w = canvas.width, h = canvas.height
  particles = Array.from({ length: CONFIG.particleCount }, () => new Particle(w, h))
  attractors = Array.from({ length: CONFIG.attractorCount }, (_, i) =>
    new Attractor(w, h, i, CONFIG.attractorCount))
}

function loop() {
  animId = requestAnimationFrame(loop)
  time++

  const w = canvas.width, h = canvas.height
  ctx.clearRect(0, 0, w, h)

  // Update attractors
  for (const att of attractors) att.update(time)

  // Update + draw particles
  for (const p of particles) p.update(w, h, attractors)

  // Draw connections
  ctx.lineWidth = 0.6
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < CONFIG.connectionDistance) {
        const alpha = (1 - d / CONFIG.connectionDistance) * CONFIG.connectionOpacity
        ctx.strokeStyle = `rgba(${CONFIG.particleColor}, ${alpha})`
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
      }
    }
  }

  // Draw particles on top
  for (const p of particles) p.draw(ctx)
}

export function destroySwarm() {
  if (animId) cancelAnimationFrame(animId)
}
