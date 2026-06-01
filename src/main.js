// main.js — Entry Point
// Initializes all modules: Three.js hero, GSAP scroll animations, nav behavior

import { initHero } from './hero/network.js'
import { initAnimations } from './scroll/animations.js'
import { initNav } from './nav.js'

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initNav()
  initHero()
  initAnimations()
})
