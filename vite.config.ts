import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import type { OutputAsset } from 'rollup'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import marked from 'marked'
import { createDocument } from 'domino'
import critical from 'critical'

const isSSR = process.argv.includes('--ssr')

const md = () => {
  return {
    name: 'md-plugin',
    load(id) {
      if (id.endsWith('.md')) {
        const code = readFileSync(id, 'utf-8')
        const src = JSON.stringify(marked(code))
        return `export default ${src};` + `
        console.log(import.meta)
        if (import.meta.hot) {
          import.meta.hot.accept((n) => {
            console.log(3423, n)
          })
        }
        `
      }
    },
  } as Plugin
}

const prerender = () => {
  return {
    name: 'ssr-prerender-plugin',
    async transformIndexHtml(html, ctx) {
      if (ctx.server) return
      if (ctx.filename === resolve(__dirname, 'index.html')) {
        try {
          const createApp = require('./dist/ssr/server').default
          const doc = createDocument(html)
          const ssrContent = await createApp()
          doc.getElementById('app').innerHTML = ssrContent
          return '<!DOCTYPE html>' + doc.documentElement.outerHTML
        } catch (e) {
          console.error('ssr prerender error: ', e)
        }
      }
    },
  } as Plugin
}

const criticalCss = () => {
  const isAsset = (b): b is OutputAsset => b && b.type === 'asset'
  return {
    name: 'critical-css-plugin',
    writeBundle(options, bundle) {
      if (isSSR) return;
      const target = 'index.html'
      const indexBundle = bundle[target]
      if (isAsset(indexBundle)) {
        return (critical as any).generate({
          inline: true,
          base: options.dir,
          html: indexBundle.source,
          target,
          width: 2500,
          height: 1500,
        })
      }
    },
  } as Plugin
}

export default defineConfig({
  plugins: [vue(), md(), prerender(), criticalCss()],
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
