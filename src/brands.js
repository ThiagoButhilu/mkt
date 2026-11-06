import { $, $$, reduced } from './lib.js'
import { BRANDS } from './data.js'

/** Duas faixas de marcas em sentidos opostos; pausam fora da tela e no hover. */
export function initBrands() {
  const host = $('#brand-rows')
  const half = Math.ceil(BRANDS.length / 2)
  const rows = [BRANDS.slice(0, half), BRANDS.slice(half)]

  host.innerHTML = rows.map((names, r) => {
    const items = names.map((n) => `
      <span class="mq-item">
        <span class="display text-[clamp(2.4rem,8vw,7rem)] ${r ? 'hollow' : ''}">${n}</span>
        <span class="size-[clamp(0.9rem,2vw,1.6rem)] shrink-0 rounded-full bg-orange" aria-hidden="true"></span>
      </span>`).join('')
    const dur = 38 + names.length * 3
    return `<div class="overflow-hidden"><div class="mq ${r ? 'rev' : ''}" style="--dur:${dur}s">
      <div class="flex shrink-0">${items}</div><div class="flex shrink-0" aria-hidden="true">${items}</div></div></div>`
  }).join('')

  if (reduced) return
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => e.target.classList.toggle('paused', !e.isIntersecting))
  })
  $$('.mq', host).forEach((m) => io.observe(m))
}
