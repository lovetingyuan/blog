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
const port = process.env.PORT || 3000
server.listen(port)

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on('error', (e) => {
  console.error(e)
})

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
  const stylesheets = []
  dom.window.document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    link.setAttribute('onload', `this.media='all'; this.onload=null;`)
    setTimeout(() => {
      link.setAttribute('media', 'print')
    }, 500);
    stylesheets.push(fs.readFileSync(path.join(rootDir, 'nblog', link.getAttribute('href')), 'utf8'))
  })
  return new Promise(resolve => {
    setTimeout(() => {
      server.close()
      fetch('https://uncss-online.com/api/uncss', {
        method: 'POST',
        headers: {
          'user-agent': 'Mozilla/4.0 MDN Example',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          inputCss: stylesheets.join('\n'), inputHtml: dom.window.document.body.innerHTML
        })
      }).then(res => res.json()).then(res => {
        const style = dom.window.document.createElement('style')
        style.dataset.inject = true
        style.textContent = res.outputCss
        dom.window.document.head.appendChild(style)
      }).finally(() => {
        const prerenderhtml = dom.serialize()
        dom.window.close()
        fs.writeFileSync(indexPath, prerenderhtml)
        resolve()
      })
      // const critical = require('critical');

      // critical.generate({
      //   inline: true,
      //   base: path.join(rootDir, 'nblog'),
      //   src: 'index.html',
      //   target: 'index-critical.html',
      //   width: 1300,
      //   height: 900,
      // });
    }, 1000)
  })
});
