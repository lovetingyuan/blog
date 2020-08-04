const path = require('path')
const fs = require('fs')
const getFileUpdatedDate = (path) => {
  const stats = fs.statSync(path)
  return stats.mtime
}
const generateBlogMeta = () => {
  const blogDir = path.resolve(__dirname, './public/blog')
  const meta = {}
  fs.readdirSync(blogDir).map(name => {
    const f = path.join(blogDir, name)
    if (fs.statSync(f).isDirectory()) {
      meta[name] = {}
      fs.readdirSync(f).forEach(file => {
        const mdfile = path.resolve(f, file)
        const content = fs.readFileSync(mdfile, 'utf8')
        const fname = file.slice(0, -3) // strip .md ext
        meta[name][fname] = eval(`({${content.match(/\((.+?)\)/)[1]}})`)
        if (!meta[name][fname].date) {
          meta[name][fname].date = getFileUpdatedDate(mdfile)
        }
      })
    }
  })
  const _meta = JSON.stringify(meta)
  fs.writeFileSync(path.join(blogDir, 'meta.json'), _meta)

  return _meta
}

generateBlogMeta()

module.exports = {
  base: './',
  outDir: 'dist/nblog',
  assetsDir: 'assets',
  optimizeDeps: {
    include: [
      'prismjs/components/prism-typescript'
    ]
  }
}
