// main.js — Entry Point
// Initializes: Three.js hero, scroll dim effect, nav behavior

import { initHero } from './hero/network.js'
import { initNav } from './nav.js'
import { gsap } from 'gsap'

document.addEventListener('DOMContentLoaded', () => {
  initNav()
  initHero()
  initScrollDim()
})

function initScrollDim() {
  const dimOverlay = document.getElementById('dim-overlay')
  if (!dimOverlay) return

  const vh = window.innerHeight
  let currentOpacity = 0

  const onScroll = () => {
    const scrolled = window.scrollY
    // Start dimming after 20% of viewport scrolled, fully dimmed at 100% scrolled
    const progress = Math.max(0, Math.min((scrolled - vh * 0.2) / (vh * 0.8), 1))
    const targetOpacity = progress * 0.7  // max 70% dim

    // Smooth easing with gsap
    gsap.to(dimOverlay, {
      background: `rgba(10, 10, 10, ${targetOpacity})`,
      duration: 0.5,
      overwrite: 'auto',
    })
  }

  window.addEventListener('scroll', onScroll, { passive: true })
}
