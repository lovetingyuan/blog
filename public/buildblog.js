const path = require('path')
const fs = require('fs')

const generateBlogMeta = () => {
  const blogDir = path.resolve(__dirname, './blog')
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
      })
    }
  })
  const _meta = JSON.stringify(meta)
  fs.writeFileSync(path.join(blogDir, 'meta.json'), _meta)

  return _meta
}

module.exports = generateBlogMeta

if (require.main === module) {
  generateBlogMeta()
}
