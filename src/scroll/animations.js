// animations.js — GSAP ScrollTrigger Animations
// Milestone D: full implementation
// Stub for now — will be expanded with ScrollTrigger in Milestone D

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initAnimations() {
  animateHeroText()
  animateSections()
  animateCards()
}

function animateHeroText() {
  const tl = gsap.timeline({ delay: 0.3 })

  tl.from('.hero__text .section__eyebrow', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power2.out',
  })
  .from('.hero__headline', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power2.out',
  }, '-=0.3')
  .from('.hero__sub', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power2.out',
  }, '-=0.4')
  .from('.hero__actions', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power2.out',
  }, '-=0.3')
}

function animateSections() {
  gsap.utils.toArray('.section__header').forEach((header) => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
    })
  })

  gsap.utils.toArray('.story-arc__step').forEach((step, i) => {
    gsap.from(step, {
      scrollTrigger: {
        trigger: step,
        start: 'top 90%',
      },
      opacity: 0,
      y: 20,
      duration: 0.5,
      delay: i * 0.1,
      ease: 'power2.out',
    })
  })
}

function animateCards() {
  gsap.utils.toArray('.case-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
      },
      opacity: 0,
      y: 40,
      duration: 0.6,
      delay: (i % 2) * 0.15,
      ease: 'power2.out',
    })
  })

  gsap.utils.toArray('.skills-group').forEach((group, i) => {
    gsap.from(group, {
      scrollTrigger: {
        trigger: group,
        start: 'top 90%',
      },
      opacity: 0,
      y: 20,
      duration: 0.5,
      delay: i * 0.1,
      ease: 'power2.out',
    })
  })
}
