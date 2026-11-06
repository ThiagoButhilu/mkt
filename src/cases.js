import { $, $$ } from './lib.js'
import { CASES } from './data.js'

const F = `font-family="DM Sans, sans-serif" font-weight="800"`

// Artes ilustrativas dos cases (desenhadas em SVG), com camadas que reagem ao ponteiro.
const ART = {
  niuhen: `
    <svg viewBox="0 0 400 400" class="h-full w-full" role="img" aria-label="Ilustração de embalagem congelada Niuhen">
      <g data-depth="0.2"><circle cx="205" cy="205" r="170" fill="#ff5a16"/></g>
      <g data-depth="0.35"><text x="-6" y="388" ${F} font-size="46" letter-spacing="-2" fill="none" stroke="#111" stroke-width="1.6" transform="rotate(-90 12 388)">RUPTURA VISUAL</text></g>
      <g data-depth="0.7"><g transform="rotate(-7 205 210)">
        <rect x="118" y="62" width="174" height="288" rx="16" fill="#111"/>
        <path d="M118 62h174v22l-10 8-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8-10-8-9 8z" fill="#2a2a2a"/>
        <text x="205" y="172" text-anchor="middle" ${F} font-size="36" letter-spacing="-1.5" fill="#f2efe9">NIUHEN</text>
        <text x="205" y="204" text-anchor="middle" ${F} font-size="22" letter-spacing="3" fill="#ffc800">FROZEN</text>
        <g><circle cx="205" cy="268" r="40" fill="#f2efe9"/><circle cx="205" cy="268" r="28" fill="#ff5a16"/><circle cx="205" cy="268" r="15" fill="#f2efe9"/><circle cx="205" cy="268" r="6" fill="#111"/></g>
        <text x="205" y="334" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-weight="500" font-size="12" fill="#f2efe9">HEN · smart food</text>
      </g></g>
    </svg>`,
  fsw: `
    <svg viewBox="0 0 400 400" class="h-full w-full" role="img" aria-label="Ilustração de caixa FSW Carnes">
      <g data-depth="0.2"><circle cx="318" cy="94" r="62" fill="#ff5a16"/></g>
      <g data-depth="0.7"><g transform="rotate(4 200 220)">
        <rect x="52" y="120" width="296" height="214" rx="14" fill="#111"/>
        <rect x="52" y="120" width="296" height="40" rx="14" fill="#2a2a2a"/>
        <rect x="178" y="120" width="44" height="214" fill="#ff5a16"/>
        <text x="200" y="262" text-anchor="middle" ${F} font-size="104" letter-spacing="-6" fill="#f2efe9" stroke="#111" stroke-width="10" paint-order="stroke">FSW</text>
        <text x="200" y="300" text-anchor="middle" ${F} font-size="22" letter-spacing="9" fill="#ffc800" stroke="#111" stroke-width="8" paint-order="stroke">CARNES</text>
        <text x="200" y="330" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-weight="500" font-size="11" letter-spacing="3" fill="#f2efe9" stroke="#111" stroke-width="6" paint-order="stroke">FOOD SERVICE</text>
      </g></g>
      <g data-depth="0.4"><circle cx="86" cy="76" r="9" fill="#111"/><circle cx="116" cy="76" r="9" fill="none" stroke="#111" stroke-width="3"/><circle cx="146" cy="76" r="9" fill="none" stroke="#111" stroke-width="3"/></g>
    </svg>`,
  granfri: `
    <svg viewBox="0 0 400 400" class="h-full w-full" role="img" aria-label="Ilustração da marca Granfri">
      <g data-depth="0.2" fill="none" stroke="#111" stroke-opacity=".28" stroke-width="1.2">
        <rect x="52" y="82" width="300" height="240" transform="rotate(-5 200 200)"/>
        <rect x="76" y="62" width="250" height="280" transform="rotate(4 200 200)"/>
        <path d="M0 140L400 110M0 300L400 330"/>
      </g>
      <g data-depth="0.65">
        <polygon points="200,76 296,131 296,241 200,296 104,241 104,131" fill="#f4e9d4"/>
        <text x="200" y="239" text-anchor="middle" ${F} font-size="150" letter-spacing="-8" fill="#bdbcb6">G</text>
      </g>
      <g data-depth="0.35">
        <text x="200" y="350" text-anchor="middle" ${F} font-size="40" letter-spacing="-1.5" fill="#111">GRANFRI</text>
        <text x="200" y="374" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-weight="500" font-size="12" letter-spacing="5" fill="#111">FOODS</text>
      </g>
    </svg>`,
}

export function initCases() {
  const host = $('#cases')
  host.innerHTML = CASES.map((c, i) => `
    <article class="case" style="--i:${i};--card:${c.bg};--cardfg:${c.fg}" aria-labelledby="case-${c.id}">
      <div class="case-art relative min-h-0 p-4 md:p-10" data-tilt>${ART[c.id]}</div>
      <div class="flex flex-col justify-end gap-4 p-5 pt-1 md:justify-between md:p-10 md:pl-2">
        <p class="label hidden text-lg md:block">${c.client}</p>
        <div>
          <h3 id="case-${c.id}" class="display text-[clamp(1.9rem,4.6vw,4.2rem)]">${c.title}</h3>
          <p class="label mt-3 text-[0.92rem] opacity-75 md:mt-5 md:text-base">${c.tags.join(' · ')}</p>
        </div>
        <a href="#contact" data-prefill="${c.client}" class="btn btn-main w-fit">Quero algo assim <i data-arr></i></a>
      </div>
    </article>`).join('')

  // parallax leve das camadas, só com mouse
  if (!matchMedia('(hover: hover)').matches) return
  $$('[data-tilt]', host).forEach((art) => {
    const layers = $$('[data-depth]', art)
    art.addEventListener('pointermove', (e) => {
      const r = art.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      layers.forEach((l) => {
        const d = Number(l.dataset.depth) * 46
        l.style.transform = `translate(${(x * d).toFixed(1)}px, ${(y * d).toFixed(1)}px)`
      })
    })
    art.addEventListener('pointerleave', () => layers.forEach((l) => (l.style.transform = '')))
  })
}
