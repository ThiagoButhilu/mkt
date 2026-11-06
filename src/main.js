import './style.css'
import { $$ } from './lib.js'
import { initHero } from './hero.js'
import { initStatement } from './statement.js'
import { initCases } from './cases.js'
import { initServices } from './services.js'
import { initAgency } from './agency.js'
import { initBrands } from './brands.js'
import { initInstagram } from './instagram.js'
import { initContact } from './contact.js'
import { initNav } from './nav.js'

const ARROW = '<svg class="arr" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12L12 4M5 4h7v7"/></svg>'

initCases()
initServices()
initBrands()
initInstagram()
initContact()
initStatement()
initAgency()
// setas depois de todo o HTML gerado existir
$$('i[data-arr]').forEach((i) => i.replaceWith(Object.assign(document.createElement('span'), { innerHTML: ARROW, className: 'inline-flex' }).firstChild))
initNav()
initHero()
