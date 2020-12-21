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
const html = fs.readFileSync(indexPath, 'utf8')
fs.writeFileSync(indexPath, html.replace('type="module"', 'defer'))

const serve = serveStatic(rootDir)
// Create server
const server = http.createServer(function onRequest (req, res) {
  serve(req, res, finalhandler(req, res))
})
// Listen
const port = process.env.PORT || 3333
server.listen(port)

console.log('Start prerendering...')

const host = `http://localhost:${port}`

module.exports = async () => {
  const { promise, resolve } = new function () {
    this.promise = new Promise((resolve) => {
      this.resolve = resolve
    })
  }
  const virtualConsole = new jsdom.VirtualConsole();
  virtualConsole.on('error', (...e) => {
    console.error(...e)
  })
  const buildTime = function () {
    var d = new Date(TIME);
    console.log('build: ' + d.toLocaleDateString() + ' ' + d.toLocaleTimeString());
  }
  
  const dom = await JSDOM.fromURL(`${host}/nblog/`, {
    runScripts: 'dangerously',
    resources: 'usable',
    virtualConsole,
    pretendToBeVisual: true,
    beforeParse(window) {
      window.fetch = window.fetch || ((url, option) => {
        return fetch(host + url, option)
      });
      window.__prerender = resolve
    }
  })
  await promise
  const stylesheets = []
  const doc = dom.window.document
  doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    link.setAttribute('onload', `this.media='all'; this.onload=null;`)
    setTimeout(() => {
      link.setAttribute('media', 'print')
    }, 500);
    stylesheets.push(fs.readFileSync(path.join(rootDir, '.' + link.getAttribute('href')), 'utf8'))
  })
  const injectScript = doc.createElement('script')
  injectScript.textContent = [
    'window.blogMeta=' + JSON.stringify(require('../dist/nblog/blog/meta.json')),
    `(${buildTime.toString().replace('TIME', Date.now()).replace(/\s{2,}/g, ' ')})()`
  ].join(';')
  doc.head.appendChild(injectScript)
  server.close()
  const res = await fetch('https://uncss-online.com/api/uncss', {
    method: 'POST',
    headers: {
      'user-agent': 'Mozilla/4.0 JSDOM',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      inputCss: stylesheets.join('\n'),
      inputHtml: doc.body.innerHTML
    })
  }).then(res => res.json())
  const style = doc.createElement('style')
  style.dataset.critical = true
  style.textContent = res.outputCss
  doc.head.appendChild(style)
  const html = dom.serialize()
  dom.window.close()
  fs.writeFileSync(indexPath, html)
  console.log('Prerender done.')
}

if (require.main === module) {
  try {
    module.exports()
  } catch (e) {
    console.error('build failed.', e)
  }
}
