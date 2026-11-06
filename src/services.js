import { animate } from 'motion'
import { $, $$, reduced } from './lib.js'
import { SERVICES } from './data.js'

const ICONS = {
  target: '<circle cx="32" cy="32" r="26"/><circle cx="32" cy="32" r="15"/><circle cx="32" cy="32" r="4" fill="currentColor"/>',
  hex: '<path d="M32 6l22 13v26L32 58 10 45V19z"/><path d="M32 22v20M22 32h20"/>',
  box: '<path d="M8 20l24-12 24 12v26L32 58 8 46z"/><path d="M8 20l24 12 24-12M32 32v26"/>',
  wave: '<circle cx="32" cy="32" r="6" fill="currentColor"/><path d="M18 18a20 20 0 0 0 0 28M46 18a20 20 0 0 1 0 28M10 10a32 32 0 0 0 0 44M54 10a32 32 0 0 1 0 44"/>',
}

/** Escada de serviços: cada degrau se apoia no anterior; um abre por vez. */
export function initServices() {
  const host = $('#stairs')
  host.innerHTML = SERVICES.map((s, i) => `
    <div class="stair" style="--i:${i}" data-i="${i}">
      <h3>
        <button class="stair-btn" id="sb-${i}" aria-expanded="false" aria-controls="sp-${i}">
          <svg class="stair-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[s.icon]}</svg>
          <span class="stair-name">${s.name}</span>
          <span class="stair-plus" aria-hidden="true"></span>
        </button>
      </h3>
      <div class="stair-panel" id="sp-${i}" role="region" aria-labelledby="sb-${i}" hidden>
        <div class="pb-7 pt-1 md:pb-10" style="padding-left:calc(var(--i) * clamp(0.6rem, 4.4vw, 4.4rem))">
          <p class="max-w-[34ch] text-[1.25rem] font-medium leading-snug md:text-[1.6rem]">${s.text}</p>
          <ul class="mt-5 flex flex-wrap gap-2" role="list">${s.items.map((t) => `<li class="tag">${t}</li>`).join('')}</ul>
        </div>
      </div>
    </div>`).join('')

  const rows = $$('.stair', host)
  const btns = rows.map((r) => $('.stair-btn', r))
  const panels = rows.map((r) => $('.stair-panel', r))

  const set = (i, open, instant = false) => {
    const btn = btns[i], panel = panels[i]
    btn.setAttribute('aria-expanded', String(open))
    rows[i].style.background = ''
    const dur = instant || reduced ? 0 : 0.55
    if (open) {
      panel.hidden = false
      const h = panel.scrollHeight
      animate(panel, { height: [0, h] }, { duration: dur, ease: [0.16, 1, 0.3, 1] }).finished.then(() => (panel.style.height = 'auto'))
    } else if (!panel.hidden) {
      const h = panel.offsetHeight
      animate(panel, { height: [h, 0] }, { duration: dur, ease: [0.16, 1, 0.3, 1] }).finished.then(() => (panel.hidden = true))
    }
  }

  btns.forEach((b, i) => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') === 'true'
    btns.forEach((_, j) => { if (j !== i && btns[j].getAttribute('aria-expanded') === 'true') set(j, false) })
    set(i, !open)
  }))
  set(0, true, true)
  panels[0].style.height = 'auto'
}
