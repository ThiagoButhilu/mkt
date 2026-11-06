import { scroll } from 'motion'
import { $, clamp, reduced } from './lib.js'

/** Palavras acendem com o scroll; ~riscada~ e =marcada= desenham o efeito quando acendem. */
export function initStatement() {
  const p = $('#statement')
  const raw = p.textContent.trim().split(/\s+/)
  p.setAttribute('aria-label', raw.join(' ').replace(/[~=]/g, ''))
  p.innerHTML = raw
    .map((w) => {
      const kind = w.startsWith('~') ? 'strike' : w.startsWith('=') ? 'mark' : ''
      const clean = w.replace(/[~=]/g, '')
      const m = clean.match(/^(.*?)([.,]*)$/)
      const core = kind ? `<span class="${kind}">${m[1]}</span>${m[2]}` : clean
      return `<span class="w" aria-hidden="true">${core}</span>`
    })
    .join(' ')
  const words = [...p.querySelectorAll('.w')]

  const light = (progress) => {
    words.forEach((s, i) => {
      const k = clamp(progress * 1.3 * words.length - i, 0, 1)
      s.style.setProperty('--k', k.toFixed(3))
      const fx = s.firstElementChild
      if (fx) fx.classList.toggle('on', k >= 1)
    })
  }
  if (reduced) {
    words.forEach((s) => s.style.setProperty('--k', 1))
    p.querySelectorAll('.strike,.mark').forEach((e) => e.classList.add('on'))
    return
  }
  scroll(light, { target: p, offset: ['start 85%', 'end 50%'] })
}
