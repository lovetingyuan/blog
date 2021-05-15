import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path"
import { readFileSync } from "fs"
import marked from 'marked'
import { createDocument } from 'domino'

const isSSR = process.argv.includes('--ssr')

const md = () => {
  return {
    name: 'md-plugin',
    load(id) {
      if (id.endsWith('.md')) {
        const code = readFileSync(id, 'utf-8')
        const src = JSON.stringify(marked(code))
        return `export default ${src}`
      }
    },
  }
}

const prerender = () => {
  return {
    name: 'ssr-prerender-plugin',
    transformIndexHtml(html, ctx) {
      if (ctx.filename === resolve(__dirname, 'index.html')) {
        const createApp = require('./dist/ssr/server').default
        const doc = createDocument(html)
        return createApp().then(ssrContent => {
          doc.getElementById('app').innerHTML = ssrContent
          return '<!DOCTYPE html>' + doc.documentElement.outerHTML
        })
      }
    }
  }
}

export default defineConfig({
  plugins: [vue(), md(), prerender()],
  base: '/nblog/',
  define: {
    'import.meta.env._buildTime': Date.now()
  },
  build: {
    outDir: isSSR ? 'dist/ssr' : 'dist/nblog',
    assetsDir: 'assets',
    minify: !isSSR,
  },
  optimizeDeps: {
    include: [
      'prismjs/components/prism-typescript'
    ]
  },
})
