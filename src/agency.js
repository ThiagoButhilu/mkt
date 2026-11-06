import { animate, scroll, inView } from 'motion'
import { $, $$, clamp, reduced } from './lib.js'

const NS = 'http://www.w3.org/2000/svg'
const TICKS = 25

/** Anel de 25 marcas (uma por ano) que acendem com o scroll; o número acompanha. */
export function initAgency() {
  const svg = $('#ring svg')
  const years = $('#years')
  const ticks = []
  for (let i = 0; i < TICKS; i++) {
    const a = (i / TICKS) * Math.PI * 2 - Math.PI / 2
    const l = document.createElementNS(NS, 'line')
    const [r1, r2] = [112, 154]
    l.setAttribute('x1', 160 + Math.cos(a) * r1); l.setAttribute('y1', 160 + Math.sin(a) * r1)
    l.setAttribute('x2', 160 + Math.cos(a) * r2); l.setAttribute('y2', 160 + Math.sin(a) * r2)
    l.setAttribute('stroke', '#111'); l.setAttribute('stroke-width', 9); l.setAttribute('stroke-linecap', 'round')
    l.setAttribute('opacity', 0.14)
    l.style.transition = 'opacity .35s'
    svg.appendChild(l)
    ticks.push(l)
  }

  const show = (n) => {
    ticks.forEach((t, i) => t.setAttribute('opacity', i < n ? 1 : 0.14))
    years.textContent = String(n)
  }

  if (reduced) { show(TICKS) } else {
    show(0)
    scroll((p) => show(Math.round(clamp(p * 1.15) * TICKS)), { target: $('#ring'), offset: ['start 90%', 'end 55%'] })
  }

  // toque / clique reanima a contagem
  $('#ring').addEventListener('click', () => {
    if (reduced) return
    animate(0, TICKS, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => show(Math.round(v)) })
  })

  // "Sem ..." as linhas riscadas se desenham quando entram
  $$('.not').forEach((li) => {
    const s = $('.strike', li)
    if (reduced) return s.classList.add('on')
    inView(li, () => { setTimeout(() => s.classList.add('on'), 250) }, { margin: '0px 0px -25% 0px' })
  })
}
