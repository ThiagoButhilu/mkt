import { SITE } from './data.js'

export const $ = (s, r = document) => r.querySelector(s)
export const $$ = (s, r = document) => [...r.querySelectorAll(s)]
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const smooth = (t) => t * t * (3 - 2 * t)

export const waLink = (text) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`
export const mailLink = (subject, body) =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

/** Roda `fn` no próximo frame, no máximo uma vez por frame. */
export function frame(fn) {
  let queued = false
  return (...a) => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => { queued = false; fn(...a) })
  }
}
