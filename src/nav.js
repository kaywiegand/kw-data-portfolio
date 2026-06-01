// nav.js — Nav scroll behavior

export function initNav() {
  const nav = document.getElementById('nav')
  if (!nav) return

  const onScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled')
    } else {
      nav.classList.remove('scrolled')
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
}
