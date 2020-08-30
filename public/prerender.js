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
  return new Promise(resolve => {
    setTimeout(() => {
      server.close()
      const prerenderhtml = dom.serialize()
      dom.window.close()
      fs.writeFileSync(indexPath, prerenderhtml)
      resolve()
    }, 1000)
  })
});
