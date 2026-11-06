import { $ } from './lib.js'
import { SITE } from './data.js'

const F = `font-family="DM Sans, sans-serif" font-weight="800"`
const url = `https://instagram.com/${SITE.instagram}`

// Miniaturas tipográficas inspiradas nos temas dos posts do perfil (ilustrativas).
const TILES = [
  {
    label: 'Post sobre embalagem Pasta Nobre',
    svg: `<rect width="200" height="200" fill="#5d5f34"/>
      <circle cx="100" cy="86" r="52" fill="none" stroke="#f2efe9" stroke-width="2"/><circle cx="100" cy="86" r="42" fill="none" stroke="#f2efe9" stroke-width="1" stroke-dasharray="3 4"/>
      <text x="100" y="82" text-anchor="middle" ${F} font-size="13" fill="#f2efe9">farinha italiana</text>
      <text x="100" y="98" text-anchor="middle" font-family="DM Sans" font-size="10" fill="#f2efe9">de grano duro</text>
      <rect x="22" y="150" width="156" height="30" rx="6" fill="#f4e9d4"/>
      <text x="100" y="171" text-anchor="middle" ${F} font-size="17" letter-spacing="1" fill="#5d5f34">PASTA NOBRE</text>`,
  },
  {
    label: 'Post: foco no consumidor, mindset no negócio',
    svg: `<rect width="200" height="200" fill="#1f7a7a"/>
      <g transform="rotate(-8 100 100)">
        <text x="30" y="70" ${F} font-size="26" letter-spacing="-1" fill="#f2efe9">FOCO no</text>
        <text x="30" y="98" ${F} font-size="26" letter-spacing="-1" fill="#ffc800">CONSUMIDOR</text>
        <text x="30" y="150" ${F} font-size="22" letter-spacing="-1" fill="#f2efe9">Mindset no</text>
        <text x="30" y="174" ${F} font-size="22" letter-spacing="-1" fill="#f2efe9">NEGÓCIO</text>
      </g>`,
  },
  {
    label: 'Post de identidade Coworka',
    svg: `<rect width="200" height="200" fill="#2a2c33"/>
      <g fill="none" stroke="#ffc800" stroke-width="5"><circle cx="100" cy="52" r="11"/><circle cx="86" cy="72" r="11"/><circle cx="114" cy="72" r="11"/><circle cx="100" cy="92" r="11"/></g>
      <text x="100" y="146" text-anchor="middle" ${F} font-size="32" letter-spacing="-1" fill="#f2efe9">COWORKA</text>`,
  },
  {
    label: 'Post: por que contratar uma agência',
    svg: `<rect width="200" height="200" fill="#ffc800"/>
      <circle cx="146" cy="56" r="34" fill="none" stroke="#ff5a16" stroke-width="12"/><circle cx="146" cy="56" r="10" fill="#ff5a16"/>
      <text x="16" y="120" font-family="Space Grotesk, sans-serif" font-weight="600" font-size="17" letter-spacing="3" fill="#ff5a16">por que</text>
      <text x="16" y="144" font-family="Space Grotesk, sans-serif" font-weight="600" font-size="17" letter-spacing="3" fill="#ff5a16">contratar</text>
      <text x="16" y="168" font-family="Space Grotesk, sans-serif" font-weight="600" font-size="17" letter-spacing="3" fill="#ff5a16">uma agência</text>`,
  },
]

export function initInstagram() {
  $('#ig-follow').href = url
  $('#ig-grid').innerHTML = TILES.map((t) => `
    <a class="ig-tile w-[68vw] max-w-[18rem] shrink-0 snap-center md:w-auto md:max-w-none" href="${url}" target="_blank" rel="noopener" aria-label="${t.label} — abrir no Instagram">
      <svg viewBox="0 0 200 200" class="size-full" aria-hidden="true">${t.svg}</svg>
    </a>`).join('')
}
