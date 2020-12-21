const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const finalhandler = require('finalhandler')
const http = require('http')
const serveStatic = require('serve-static')

const rootDir = path.resolve(__dirname, '../dist')
const indexPath = path.join(rootDir, 'nblog/index.html')
const indexhtmlcontent = fs.readFileSync(indexPath, 'utf8')
fs.writeFileSync(indexPath, indexhtmlcontent.replace('type="module"', ''))

const serve = serveStatic(rootDir)
// Create server
const server = http.createServer(function onRequest (req, res) {
  serve(req, res, finalhandler(req, res))
})
// Listen
const port = process.env.PORT || 3333
server.listen(port)

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on('error', (e) => {
  console.error(e)
})
console.log('Start prerendering...')
module.exports = JSDOM.fromURL(`http://localhost:${port}/nblog/`, {
  runScripts: 'dangerously',
  resources: 'usable',
  virtualConsole,
  beforeParse(window) {
    window.fetch = window.fetch || ((url, option) => {
      return fetch('http://localhost:' + port + url, option)
    })
  }
}).then(dom => {
  const stylesheets = [], doc = dom.window.document
  doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    link.setAttribute('onload', `this.media='all'; this.onload=null;`)
    setTimeout(() => {
      link.setAttribute('media', 'print')
    }, 500);
    stylesheets.push(fs.readFileSync(path.join(rootDir, 'nblog', link.getAttribute('href')), 'utf8'))
  })
  const injectScript = doc.createElement('script')
  injectScript.textContent = [
    'window.blogMeta=' + JSON.stringify(require('../dist/nblog/blog/meta.json')),
    'window.__buildTime__=' + Date.now()
  ].join(';')
  doc.head.appendChild(injectScript)
  const headScripts = doc.head.querySelectorAll('script')
  const bodyScript = doc.body.querySelector('script')
  headScripts.forEach(v => {
    if (v === injectScript) return
    bodyScript ? doc.body.insertBefore(v, bodyScript) : doc.body.appendChild(v)
  })
  server.close()
  return fetch('https://uncss-online.com/api/uncss', {
    method: 'POST',
    headers: {
      'user-agent': 'Mozilla/4.0 JSDOM',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      inputCss: stylesheets.join('\n'),
      inputHtml: doc.body.innerHTML
    })
  }).then(res => res.json()).then(res => {
    const style = doc.createElement('style')
    style.dataset.critical = true
    style.textContent = res.outputCss
    doc.head.appendChild(style)
  }).finally(() => {
    const html = dom.serialize()
    dom.window.close()
    fs.writeFileSync(indexPath, html)
    console.log('Prerender done.')
  })
});
