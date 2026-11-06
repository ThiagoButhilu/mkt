import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // caminhos relativos: funciona em qualquer subpasta do GitHub Pages (usuario.github.io/nome-do-repo/)
  base: './',
  plugins: [tailwindcss()],
  server: { port: 5174 },
})
