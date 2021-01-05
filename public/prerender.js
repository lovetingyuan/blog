const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const rootDir = path.resolve(__dirname, '../dist')
const indexPath = path.join(rootDir, 'nblog/index.html')
const domino = require('domino')

const createApp = require('../dist/ssr/assets/server')

module.exports = async () => {
  const stylesheets = []
  const doc = domino.createWindow(
    fs.readFileSync(indexPath, 'utf8'),
    'https://tingyuan.me/nblog/'
  ).document
  const ssrContent = await createApp()
  doc.getElementById('app').innerHTML = ssrContent
  doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    link.setAttribute('onload', "this.media='all';this.onload=null;")
    setTimeout(() => {
      link.setAttribute('media', 'print')
    }, 500);
    stylesheets.push(fs.readFileSync(path.join(rootDir, '.' + link.getAttribute('href')), 'utf8'))
  })
  const injectScript = doc.createElement('script')
  injectScript.textContent = [
    'window.blogMeta=' + JSON.stringify(require('../dist/nblog/blog/meta.json')),
    `window.__BuildTime=${Date.now()}`
  ].join(';')
  doc.head.appendChild(injectScript)
  const res = await fetch('https://uncss-online.com/api/uncss', {
    method: 'POST',
    headers: {
      'user-agent': 'Mozilla/4.0 JSDOM',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      inputCss: stylesheets.join('\n'),
      inputHtml: doc.body.outerHTML
    })
  }).then(res => res.json())
  const style = doc.createElement('style')
  style.textContent = res.outputCss
  doc.head.appendChild(style)
  fs.writeFileSync(indexPath, '<!DOCTYPE html>' + doc.documentElement.outerHTML)
}

if (require.main === module) {
  console.log('Start prerendering...')
  const start = Date.now()
  module.exports().then(() => {
    const cost = (Date.now() - start) / 1000
    console.log(`Prerender done in ${cost.toFixed(2)}s.`)
  }).catch(e => {
    console.error('Prerender failed: ', e)
  })
}
