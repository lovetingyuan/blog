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
        return `export default ${src}`
      }
    },
  } as Plugin
}

const prerender = () => {
  return {
    name: 'ssr-prerender-plugin',
    async transformIndexHtml(html, ctx) {
      if (ctx.filename === resolve(__dirname, 'index.html')) {
        const createApp = require('./dist/ssr/server').default
        const doc = createDocument(html)
        const ssrContent = await createApp()
        doc.getElementById('app').innerHTML = ssrContent
        return '<!DOCTYPE html>' + doc.documentElement.outerHTML
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
