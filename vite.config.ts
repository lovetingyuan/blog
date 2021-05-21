import { defineConfig, normalizePath } from 'vite'
import type { Plugin } from 'vite'
import type { OutputAsset } from 'rollup'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { readFileSync, lstatSync } from 'fs'
import marked from 'marked'
import { createDocument } from 'domino'
import critical from 'critical'
import fse from 'fs-extra'

const isSSR = process.argv.includes('--ssr')

const md = () => {
  return {
    name: 'md-plugin',
    load(id) {
      if (id.endsWith('.md')) {
        const code = readFileSync(id, 'utf-8')
        const src = JSON.stringify(marked(code))
        return `export default ${src};\n` + `
        if (import.meta.hot) {
          import.meta.hot.accept((m) => {
            window._hotUpdateBlog && window._hotUpdateBlog(import.meta, m)
          })
        }
        `.replace(/\s/g, '')
      }
    },
    generateBundle(options, bundles) {
      Object.keys(bundles).forEach(f => {
        const bundle = bundles[f];
        if (bundle.type === 'chunk' && (bundle.facadeModuleId || '').endsWith('.md')) {
          delete bundles[f]
        }
      })
    },
  } as Plugin
}

const prerender = () => {
  return {
    name: 'ssr-prerender-plugin',
    async transformIndexHtml(html, ctx) {
      if (ctx.server) return
      if (ctx.filename === normalizePath(resolve(__dirname, 'index.html'))) {
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
    async writeBundle(options, bundle) {
      if (isSSR) return;
      const target = 'index.html'
      const indexBundle = bundle[target]
      if (isAsset(indexBundle)) {
        await (critical as any).generate({
          inline: true,
          base: options.dir,
          html: indexBundle.source,
          target,
          width: 2500,
          height: 1500,
        })
      }
      const docsDir = resolve(__dirname, 'docs')
      // enable github page
      await fse.copy(resolve(__dirname, 'src/blogs'), resolve(options.dir, 'blogs'), {
        filter(src, dest) {
          if (lstatSync(src).isDirectory()) return true
          if (src.endsWith('.md')) {
            const mdContent = readFileSync(src, 'utf-8')
            const html = marked(mdContent)
            fse.outputFileSync(dest.replace('.md', '.html'), html)
          }
          return false
        }
      })
      await fse.emptyDir(docsDir)
      await fse.copy(options.dir, docsDir)
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
    minify: !isSSR,
  },
  optimizeDeps: {
    include: [
      'prismjs/components/prism-typescript'
    ]
  },
})
