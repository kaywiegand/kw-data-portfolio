// network.js — Three.js 3D Network Hero
// Dark space with floating nodes + edges — data topology aesthetic
// Mouse: direct node repulsion + camera parallax

import * as THREE from 'three'

// ─── Config ───────────────────────────────────────────────────────────────
const CONFIG = {
  nodes: {
    count: 100,
    size: 0.055,
    spread: 7,
    color: 0x00d4ff,
    colorAccent: 0xe8ff00,
    accentRatio: 0.08,
    opacity: 0.9,
  },
  edges: {
    maxDistance: 2.0,
    color: 0x00d4ff,
    opacity: 0.15,
  },
  camera: {
    fov: 60,
    z: 8,
  },
  mouse: {
    // Camera parallax
    parallaxStrength: 1.2,
    parallaxEase: 0.04,
    // Node repulsion
    repulsionRadius: 2.5,   // in 3D units
    repulsionStrength: 0.18,
    repulsionEase: 0.12,
  },
  drift: {
    speed: 0.0015,
    rotationY: 0.00015,
  },
}

// ─── State ─────────────────────────────────────────────────────────────────
let renderer, scene, camera
let nodesMesh, edgesGeometry, edgesLine
let nodePositions = []        // current positions (THREE.Vector3)
let nodeTargets = []          // rest positions (undisturbed)
let nodeVelocities = []
let mouse3D = new THREE.Vector3(9999, 9999, 0)
let mouseScreen = { x: 0, y: 0, targetX: 0, targetY: 0 }
let animationId = null
let frameCount = 0
let canvasEl = null

// ─── Init ──────────────────────────────────────────────────────────────────
export function initHero(canvasParam) {
  canvasEl = canvasParam || document.getElementById('hero-canvas')
  if (!canvasEl) return

  setupRenderer()
  setupScene()
  setupNodes()
  setupEdges()
  setupMouseTracking()
  window.addEventListener('resize', onResize, { passive: true })
  animate()
}

function setupRenderer() {
  renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
    antialias: true,
    alpha: true,
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvasEl.clientWidth || window.innerWidth, canvasEl.clientHeight || window.innerHeight)
  renderer.setClearColor(0x000000, 0)
}

function setupScene() {
  scene = new THREE.Scene()
  const w = canvasEl.clientWidth || window.innerWidth
  const h = canvasEl.clientHeight || window.innerHeight
  camera = new THREE.PerspectiveCamera(CONFIG.camera.fov, w / h, 0.1, 100)
  camera.position.z = CONFIG.camera.z
}

function setupNodes() {
  const { count, spread, color, colorAccent, accentRatio, size, opacity } = CONFIG.nodes
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    // Distribute in a sphere-ish volume, slightly flattened
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = Math.cbrt(Math.random()) * spread * 0.5  // cube root = uniform in sphere
    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta) * 0.55
    const z = r * Math.cos(phi) * 0.35

    positions[i * 3]     = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    nodePositions.push(new THREE.Vector3(x, y, z))
    nodeTargets.push(new THREE.Vector3(x, y, z))
    nodeVelocities.push(new THREE.Vector3(
      (Math.random() - 0.5) * CONFIG.drift.speed * 2,
      (Math.random() - 0.5) * CONFIG.drift.speed * 2,
      (Math.random() - 0.5) * CONFIG.drift.speed,
    ))

    const isAccent = Math.random() < accentRatio
    const c = new THREE.Color(isAccent ? colorAccent : color)
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  nodesMesh = new THREE.Points(geo, new THREE.PointsMaterial({
    size,
    vertexColors: true,
    transparent: true,
    opacity,
    sizeAttenuation: true,
  }))
  scene.add(nodesMesh)
}

function setupEdges() {
  edgesGeometry = new THREE.BufferGeometry()
  edgesLine = new THREE.LineSegments(edgesGeometry, new THREE.LineBasicMaterial({
    color: CONFIG.edges.color,
    transparent: true,
    opacity: CONFIG.edges.opacity,
  }))
  scene.add(edgesLine)
}

function updateEdges() {
  const verts = []
  const { maxDistance } = CONFIG.edges
  for (let i = 0; i < nodePositions.length; i++) {
    for (let j = i + 1; j < nodePositions.length; j++) {
      if (nodePositions[i].distanceTo(nodePositions[j]) < maxDistance) {
        verts.push(
          nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
          nodePositions[j].x, nodePositions[j].y, nodePositions[j].z,
        )
      }
    }
  }
  edgesGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3))
}

function updateNodes() {
  const posAttr = nodesMesh.geometry.attributes.position
  const { repulsionRadius, repulsionStrength, repulsionEase } = CONFIG.mouse
  const halfSpread = CONFIG.nodes.spread * 0.5

  for (let i = 0; i < nodePositions.length; i++) {
    const pos = nodePositions[i]
    const target = nodeTargets[i]
    const vel = nodeVelocities[i]

    // Gentle drift of the rest position
    target.x += vel.x
    target.y += vel.y
    target.z += vel.z

    // Bounce at boundaries
    if (Math.abs(target.x) > halfSpread) vel.x *= -1
    if (Math.abs(target.y) > halfSpread * 0.55) vel.y *= -1
    if (Math.abs(target.z) > halfSpread * 0.35) vel.z *= -1

    // Mouse repulsion — push node away from cursor
    const distToMouse = pos.distanceTo(mouse3D)
    if (distToMouse < repulsionRadius) {
      const force = (1 - distToMouse / repulsionRadius) * repulsionStrength
      const dir = pos.clone().sub(mouse3D).normalize()
      pos.addScaledVector(dir, force)
    }

    // Spring back to rest position
    pos.x += (target.x - pos.x) * repulsionEase
    pos.y += (target.y - pos.y) * repulsionEase
    pos.z += (target.z - pos.z) * repulsionEase

    posAttr.setXYZ(i, pos.x, pos.y, pos.z)
  }
  posAttr.needsUpdate = true
}

function setupMouseTracking() {
  const onMove = (e) => {
    const w = canvasEl.clientWidth || window.innerWidth
    const h = canvasEl.clientHeight || window.innerHeight

    // Normalized device coords for camera parallax
    mouseScreen.targetX = (e.clientX / w - 0.5) * 2
    mouseScreen.targetY = -(e.clientY / h - 0.5) * 2

    // Unproject mouse to 3D plane at z=0 for node repulsion
    const ndcX = (e.clientX / w) * 2 - 1
    const ndcY = -(e.clientY / h) * 2 + 1
    const vec = new THREE.Vector3(ndcX, ndcY, 0.5)
    vec.unproject(camera)
    const dir = vec.sub(camera.position).normalize()
    const dist = -camera.position.z / dir.z
    mouse3D.copy(camera.position).addScaledVector(dir, dist)
  }

  const onLeave = () => {
    mouseScreen.targetX = 0
    mouseScreen.targetY = 0
    mouse3D.set(9999, 9999, 0)
  }

  window.addEventListener('mousemove', onMove, { passive: true })
  if (canvasEl) canvasEl.addEventListener('mouseleave', onLeave)
}

function onResize() {
  const w = canvasEl.clientWidth || window.innerWidth
  const h = canvasEl.clientHeight || window.innerHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}

// ─── Animation Loop ────────────────────────────────────────────────────────
function animate() {
  animationId = requestAnimationFrame(animate)
  frameCount++

  // Camera parallax ease
  mouseScreen.x += (mouseScreen.targetX - mouseScreen.x) * CONFIG.mouse.parallaxEase
  mouseScreen.y += (mouseScreen.targetY - mouseScreen.y) * CONFIG.mouse.parallaxEase

  camera.position.x = mouseScreen.x * CONFIG.mouse.parallaxStrength
  camera.position.y = mouseScreen.y * CONFIG.mouse.parallaxStrength * 0.6
  camera.lookAt(scene.position)

  updateNodes()
  if (frameCount % 2 === 0) updateEdges()

  scene.rotation.y += CONFIG.drift.rotationY
  renderer.render(scene, camera)
}

export function destroyHero() {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
  renderer?.dispose()
  nodePositions = []; nodeTargets = []; nodeVelocities = []
  frameCount = 0
}
