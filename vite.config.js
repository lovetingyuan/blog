import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const isSSR = !!process.env.VUE_SSR

export default defineConfig({
  plugins: [vue()],
  base: '/nblog/',
  build: {
    outDir: isSSR ? 'dist/ssr' : 'dist/nblog',
    assetsDir: 'assets',
    minify: !isSSR,
    lib: isSSR && {
      entry: './src/server.ts',
      name: 'ssr.js',
      formats: ['cjs']
    }
  },
  optimizeDeps: {
    include: [
      'prismjs/components/prism-typescript'
    ]
  },
})
