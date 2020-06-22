import 'prismjs/themes/prism.css'
import Prism from 'prismjs';
import marked from 'marked'

const BASE_URL = process.env.NODE_ENV === 'production' ? '/nblog' : ''

Prism.manual = true

marked.setOptions({
  highlight(code, lang) {
    if (lang && Prism.languages[lang]) {
      try {
        return Prism.highlight(code, Prism.languages[lang], lang);
      } catch (__) {}
    }
    return code;
  },
});

const blogCache = {}

export function getCurrentPaths () {
  const paths = location.pathname.split('/').filter(Boolean)
  if (paths[0] === 'nblog') {
    paths.shift()
  }
  return paths;
}

function realFetchBlog (path) {
  const url = BASE_URL + `/blog/${path}.md`
  return fetch(url).then(res => {
    if (!res.ok) {
      throw new Error(`请求"${path}"失败\n${res.status}: ${res.statusText}.`)
    }
    return res.text()
  }).then(md => {
    const html = marked(md)
    blogCache[path] = html
    return html
  }).catch(err => {
    alert(err && err.message)
  })
}

export async function fetchBlog () {
  const paths = getCurrentPaths()
  const path = paths.join('/')
  const storedBlog = blogCache[path]
  if (storedBlog) {
    return storedBlog
  }
  return realFetchBlog(path)
}

export const fetchBlogMeta = () => {
  return fetch(BASE_URL + '/blog/meta.json').then(res => res.json())
}
