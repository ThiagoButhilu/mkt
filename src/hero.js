import { animate, stagger } from 'motion'
import { $, $$, clamp, smooth, reduced, frame } from './lib.js'

const NS = 'http://www.w3.org/2000/svg'
const RINGS = [
  [1, '#ff5a16'], [0.78, '#f2efe9'], [0.58, '#ff5a16'], [0.38, '#f2efe9'], [0.18, '#111'],
]

/**
 * O fio começa embolado (trocoide prolata com variação) e vai sendo "puxado"
 * pelo alvo: a parte da direita desenrola primeiro. Em q = 1 vira uma reta
 * que termina no centro do alvo.
 */
export function initHero() {
  const hero = $('#top')
  const box = $('#scribble')
  const svg = $('svg', box)
  const hit = $('#hit')
  const hint = $('#hint')

  svg.innerHTML = `
    <g id="tg" style="transform-box:fill-box;transform-origin:center">
      ${RINGS.map(([k, c]) => `<circle data-k="${k}" fill="${c}"/>`).join('')}
    </g>
    <circle id="rip1" fill="none" stroke="#ff5a16" stroke-width="3" opacity="0" style="transform-box:fill-box;transform-origin:center"/>
    <circle id="rip2" fill="none" stroke="#ff5a16" stroke-width="3" opacity="0" style="transform-box:fill-box;transform-origin:center"/>
    <path id="line" pathLength="1" fill="none" stroke="#111" stroke-linecap="round" stroke-linejoin="round"/>
    <path id="head" fill="#111"/>`
  const line = $('#line', svg)
  const head = $('#head', svg)
  const tg = $('#tg', svg)
  const rips = [$('#rip1', svg), $('#rip2', svg)]
  const circles = $$('circle[data-k]', svg)

  let W = 0, H = 0, R = 0, cx = 0, cy = 0, x0 = -24, loops = 7, N = 150
  let q = 0, hitOn = false

  function measure() {
    const r = box.getBoundingClientRect()
    W = r.width; H = r.height
    if (!W || !H) return
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
    R = Math.min(H * 0.5 - 2, W * 0.26)
    cx = W - R - 4
    cy = H / 2
    loops = Math.max(4, Math.round((cx - x0) / (H * 0.62)))
    N = W < 600 ? 120 : 190
    line.setAttribute('stroke-width', W < 600 ? 4.5 : 6)
    circles.forEach((c) => {
      c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', R * c.dataset.k)
    })
    rips.forEach((c) => { c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', R * 0.2) })
    const hs = R * 0.13
    head.setAttribute('d', `M${cx} ${cy} L${cx - hs * 2.4} ${cy - hs} L${cx - hs * 1.7} ${cy} L${cx - hs * 2.4} ${cy + hs}Z`)
    render()
  }

  function render() {
    if (!W) return
    const pitch = (cx - x0) / loops
    const a = pitch / (2 * Math.PI)
    const bx = a * 2.25
    const ry = H * 0.4
    let d = ''
    for (let i = 0; i <= N; i++) {
      const u = i / N
      const env = Math.pow(Math.sin(Math.PI * u), 0.65)
      const m = 1 - smooth(clamp((q - (1 - u) * 0.55) / 0.45))
      const k = m * env
      const th = 2 * Math.PI * loops * u
      const bxs = bx * (0.85 + 0.25 * Math.sin(u * 11.1))
      const rys = ry * (0.72 + 0.34 * Math.sin(u * 17.3 + 1.2))
      const x = x0 + (cx - x0) * u - bxs * Math.sin(th) * k
      const y = cy - rys * Math.cos(th) * k + Math.sin(u * 6.1) * H * 0.1 * k
      d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)
    }
    line.setAttribute('d', d)
  }

  function setHit(on) {
    if (on === hitOn) return
    hitOn = on
    if (on) {
      animate(tg, { scale: [1, 1.09, 1] }, { duration: 0.55, ease: [0.16, 1, 0.3, 1] })
      rips.forEach((r, i) => animate(r, { scale: [1, 7], opacity: [0.8, 0] }, { duration: 1.1, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }))
      animate(hit, { opacity: [0, 1], y: [14, 0], scale: [0.85, 1] }, { duration: 0.6, ease: [0.16, 1, 0.3, 1] })
    } else {
      animate(hit, { opacity: 0, y: 8 }, { duration: 0.25 })
    }
  }

  function apply(p) {
    q = clamp(p / 0.7)
    hero.style.setProperty('--q', q.toFixed(3))
    hint.style.opacity = String(clamp(1 - p * 8) * 0.6)
    render()
    setHit(p > 0.84)
  }

  const onScroll = frame(() => {
    const r = hero.getBoundingClientRect()
    const total = r.height - innerHeight
    apply(total > 0 ? clamp(-r.top / total) : 0)
  })

  new ResizeObserver(measure).observe(box)
  measure()

  if (reduced) {
    apply(1)
    hit.style.opacity = '1'
    return
  }

  addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // entrada: título sobe, fio se desenha, resto aparece
  const ins = $$('.line-in', hero)
  ins.forEach((el) => (el.style.transform = 'translateY(110%)'))
  animate(ins, { y: ['110%', '0%'] }, { duration: 1.1, delay: stagger(0.12, { startDelay: 0.1 }), ease: [0.16, 1, 0.3, 1] })
    .finished.then(() => ins.forEach((el) => (el.style.willChange = 'auto')))
  line.style.strokeDasharray = '1 1'
  animate(line, { strokeDashoffset: [1, 0] }, { duration: 1.9, delay: 0.5, ease: [0.45, 0, 0.2, 1] })
    .finished.then(() => (line.style.strokeDasharray = 'none'))
  animate(tg, { scale: [0.6, 1], opacity: [0, 1] }, { duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] })
  animate(head, { opacity: [0, 1] }, { duration: 0.4, delay: 2.2 })
  animate($$('.btn, [data-intro]', hero), { opacity: [0, 1], y: [16, 0] }, { duration: 0.8, delay: stagger(0.08, { startDelay: 0.9 }), ease: [0.16, 1, 0.3, 1] })
}
