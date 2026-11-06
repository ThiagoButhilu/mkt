import { animate } from 'motion'
import { $, $$, clamp, reduced, frame } from './lib.js'

export function initNav() {
  const nav = $('#nav')
  const fab = $('#fab')
  const btn = $('#menu-btn')
  const menu = $('#menu')
  const label = $('#menu-label')

  // tema da página acompanha a seção que cruza o meio da tela
  const themed = $$('[data-theme]').filter((e) => e !== document.body)
  const io = new IntersectionObserver((es) => {
    for (const e of es) if (e.isIntersecting) {
      document.body.dataset.theme = e.target.dataset.theme
      document.querySelector('meta[name=theme-color]').content =
        { cream: '#f2efe9', ink: '#111111', orange: '#ff5a16', sun: '#ffc800' }[e.target.dataset.theme]
    }
  }, { rootMargin: '-50% 0px -50% 0px' })
  themed.forEach((s) => io.observe(s))

  // progresso, esconder/mostrar topo, botão de WhatsApp
  let last = scrollY
  const onScroll = frame(() => {
    const y = scrollY
    const max = document.documentElement.scrollHeight - innerHeight
    nav.style.setProperty('--p', clamp(y / max).toFixed(4))
    const down = y > last + 4, up = y < last - 4
    if (!menuOpen) {
      if (down && y > 120) nav.style.transform = 'translateY(-110%)'
      else if (up || y < 120) nav.style.transform = ''
    }
    if (down || up) last = y
    fab.style.transform = y > innerHeight * 0.9 ? 'translateY(0)' : ''
  })
  addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // menu mobile: círculo que abre a partir do botão
  let menuOpen = false
  const dur = reduced ? 0 : 0.7
  function toggle(open) {
    menuOpen = open
    btn.setAttribute('aria-expanded', String(open))
    label.textContent = open ? 'Fechar' : 'Menu'
    menu.setAttribute('aria-hidden', String(!open))
    document.documentElement.style.overflow = open ? 'hidden' : ''
    // com o menu escuro aberto, o topo precisa inverter as cores
    nav.style.color = open ? '#f2efe9' : ''
    nav.style.setProperty('--fg', open ? '#f2efe9' : '')
    nav.style.setProperty('--bg', open ? '#111111' : '')
    if (open) {
      menu.classList.remove('invisible')
      nav.style.transform = ''
      animate(menu, { clipPath: ['circle(0px at calc(100% - 3rem) 2.6rem)', 'circle(150vmax at calc(100% - 3rem) 2.6rem)'] }, { duration: dur, ease: [0.16, 1, 0.3, 1] })
    } else {
      animate(menu, { clipPath: 'circle(0px at calc(100% - 3rem) 2.6rem)' }, { duration: dur * 0.7, ease: [0.16, 1, 0.3, 1] })
        .finished.then(() => !menuOpen && menu.classList.add('invisible'))
    }
  }
  btn.addEventListener('click', () => toggle(!menuOpen))
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) toggle(false) })
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) { toggle(false); btn.focus() } })
}
