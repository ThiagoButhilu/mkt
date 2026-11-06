import { $, $$, waLink, mailLink } from './lib.js'
import { SITE, PROBLEMS } from './data.js'

export function initContact() {
  const wa = waLink('Olá! Vim pelo site e quero conversar sobre um projeto.')
  ;['#menu-wa', '#wa-direct', '#fab'].forEach((s) => ($(s).href = wa))
  $('#ig-direct').href = `https://instagram.com/${SITE.instagram}`
  const mail = $('#mail')
  mail.href = `mailto:${SITE.email}`
  mail.textContent = SITE.email
  $('#addr').textContent = SITE.address

  const chips = $('#problems')
  chips.innerHTML = PROBLEMS.map((p) => `<button type="button" class="chip" aria-pressed="false">${p}</button>`).join('')
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('.chip')
    if (!b) return
    b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'))
  })

  // botão "Quero algo assim" dos cases
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-prefill]')
    if (!a) return
    $('#msg').value = `Vi o case ${a.dataset.prefill} e quero um trabalho nesse nível para a minha marca.`
    setTimeout(() => $('#name').focus({ preventScroll: true }), 900)
  })

  const form = $('#brief')
  const status = $('#form-status')
  const name = $('#name')
  const phone = $('#phone')

  const picked = () => $$('.chip[aria-pressed="true"]', chips).map((c) => c.textContent)
  const compose = () => {
    const parts = [`Olá! Sou ${name.value.trim()}.`]
    const p = picked()
    if (p.length) parts.push(`Quero conversar sobre: ${p.join(', ')}.`)
    if ($('#msg').value.trim()) parts.push($('#msg').value.trim())
    parts.push(`Meu WhatsApp: ${phone.value.trim()}.`)
    return parts.join(' ')
  }

  const validate = () => {
    const okName = name.value.trim().length >= 2
    const okPhone = phone.value.replace(/\D/g, '').length >= 10
    name.setAttribute('aria-invalid', String(!okName))
    phone.setAttribute('aria-invalid', String(!okPhone))
    if (!okName || !okPhone) {
      status.textContent = !okName ? 'Escreva seu nome para a gente saber com quem falar.' : 'Confira o WhatsApp: precisa do DDD e do número.'
      ;(!okName ? name : phone).focus()
      return false
    }
    status.textContent = ''
    return true
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (!validate()) return
    window.open(waLink(compose()), '_blank', 'noopener')
    status.textContent = 'Abrimos o WhatsApp com a sua mensagem pronta. É só enviar.'
  })
  $('#by-mail').addEventListener('click', () => {
    if (!validate()) return
    location.href = mailLink('Contato pelo site', compose())
    status.textContent = 'Abrimos o seu e-mail com a mensagem pronta.'
  })
  ;[name, phone].forEach((i) => i.addEventListener('input', () => i.setAttribute('aria-invalid', 'false')))

  // mapa só quando a seção chega perto
  const map = $('#map')
  new IntersectionObserver((es, io) => {
    if (!es[0].isIntersecting) return
    io.disconnect()
    map.innerHTML = `<iframe title="Mapa: ${SITE.address}" class="absolute inset-0 size-full border-0 grayscale" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed"></iframe>`
  }, { rootMargin: '1200px 0px' }).observe(map)
}
