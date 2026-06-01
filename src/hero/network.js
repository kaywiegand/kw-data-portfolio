// network.js — Three.js 3D Network Hero
// Dark space with floating nodes connected by edges — data topology aesthetic
// Milestone B: full implementation

import * as THREE from 'three'

// ─── Config ───────────────────────────────────────────────────────────────
const CONFIG = {
  nodes: {
    count: 80,
    radius: 0.04,
    spread: 6,
    color: 0x00d4ff,      // data cyan
    colorAccent: 0xe8ff00, // lemon — for active nodes
    opacity: 0.8,
  },
  edges: {
    maxDistance: 2.2,
    color: 0x00d4ff,
    opacity: 0.12,
  },
  camera: {
    fov: 60,
    near: 0.1,
    far: 100,
    z: 8,
  },
  mouse: {
    influence: 0.3,
    ease: 0.05,
  },
  animation: {
    driftSpeed: 0.0003,
    rotationSpeed: 0.0001,
  },
}

// ─── State ─────────────────────────────────────────────────────────────────
let renderer, scene, camera
let nodesMesh, edgesGeometry, edgesLine
let nodePositions = []
let nodeVelocities = []
let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
let animationId = null

// ─── Init ──────────────────────────────────────────────────────────────────
export function initHero() {
  const canvas = document.getElementById('hero-canvas')
  if (!canvas) return

  setupRenderer(canvas)
  setupScene()
  setupNodes()
  setupEdges()
  setupMouseTracking()
  setupResizeHandler()
  animate()
}

function setupRenderer(canvas) {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 0)
}

function setupScene() {
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    CONFIG.camera.fov,
    window.innerWidth / window.innerHeight,
    CONFIG.camera.near,
    CONFIG.camera.far,
  )
  camera.position.z = CONFIG.camera.z
}

function setupNodes() {
  const { count, radius, spread, color, opacity } = CONFIG.nodes

  // Geometry: instanced spheres
  const geometry = new THREE.SphereGeometry(radius, 8, 8)
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
  })

  // Create individual meshes to allow per-node animation
  // Using Points for performance
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * spread
    const y = (Math.random() - 0.5) * spread * 0.6
    const z = (Math.random() - 0.5) * spread * 0.4

    positions[i * 3]     = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    nodePositions.push(new THREE.Vector3(x, y, z))

    // Random drift velocity
    nodeVelocities.push(new THREE.Vector3(
      (Math.random() - 0.5) * 0.002,
      (Math.random() - 0.5) * 0.002,
      (Math.random() - 0.5) * 0.001,
    ))

    // Color: mostly cyan, ~10% accent
    const isAccent = Math.random() < 0.1
    const c = new THREE.Color(isAccent ? CONFIG.nodes.colorAccent : CONFIG.nodes.color)
    colors[i * 3]     = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }

  const pointsGeo = new THREE.BufferGeometry()
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  pointsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const pointsMat = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
  })

  nodesMesh = new THREE.Points(pointsGeo, pointsMat)
  scene.add(nodesMesh)
}

function setupEdges() {
  edgesGeometry = new THREE.BufferGeometry()
  const edgesMat = new THREE.LineBasicMaterial({
    color: CONFIG.edges.color,
    transparent: true,
    opacity: CONFIG.edges.opacity,
  })
  edgesLine = new THREE.LineSegments(edgesGeometry, edgesMat)
  scene.add(edgesLine)
}

function updateEdges() {
  const { maxDistance } = CONFIG.edges
  const positions = []
  const count = nodePositions.length

  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const dist = nodePositions[i].distanceTo(nodePositions[j])
      if (dist < maxDistance) {
        positions.push(
          nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
          nodePositions[j].x, nodePositions[j].y, nodePositions[j].z,
        )
      }
    }
  }

  const posArray = new Float32Array(positions)
  edgesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
}

function updateNodePositions() {
  const spread = CONFIG.nodes.spread
  const posAttr = nodesMesh.geometry.attributes.position

  for (let i = 0; i < nodePositions.length; i++) {
    nodePositions[i].add(nodeVelocities[i])

    // Boundary wrap
    if (Math.abs(nodePositions[i].x) > spread / 2) nodeVelocities[i].x *= -1
    if (Math.abs(nodePositions[i].y) > spread * 0.3) nodeVelocities[i].y *= -1
    if (Math.abs(nodePositions[i].z) > spread * 0.2) nodeVelocities[i].z *= -1

    posAttr.setXYZ(i, nodePositions[i].x, nodePositions[i].y, nodePositions[i].z)
  }

  posAttr.needsUpdate = true
}

function setupMouseTracking() {
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2
    mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2
  }, { passive: true })
}

function setupResizeHandler() {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }, { passive: true })
}

// ─── Animation Loop ────────────────────────────────────────────────────────
let frameCount = 0

function animate() {
  animationId = requestAnimationFrame(animate)
  frameCount++

  // Mouse ease
  mouse.x += (mouse.targetX - mouse.x) * CONFIG.mouse.ease
  mouse.y += (mouse.targetY - mouse.y) * CONFIG.mouse.ease

  // Camera parallax
  camera.position.x += (mouse.x * CONFIG.mouse.influence - camera.position.x) * 0.05
  camera.position.y += (mouse.y * CONFIG.mouse.influence * 0.5 - camera.position.y) * 0.05
  camera.lookAt(scene.position)

  // Node drift
  updateNodePositions()

  // Edge update every 2 frames (performance)
  if (frameCount % 2 === 0) {
    updateEdges()
  }

  // Slow scene rotation
  scene.rotation.y += CONFIG.animation.rotationSpeed

  renderer.render(scene, camera)
}

// ─── Cleanup ───────────────────────────────────────────────────────────────
export function destroyHero() {
  if (animationId) cancelAnimationFrame(animationId)
  renderer?.dispose()
}
