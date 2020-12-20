import 'prismjs/themes/prism.css'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import marked from 'marked'
import store from './store'

const BASE_URL = process.env.NODE_ENV === 'production' ? '/nblog' : ''

;(Prism as any).manual = true

marked.setOptions({
  highlight(code, lang) {
    if (lang && Prism.languages[lang]) {
      try {
        return Prism.highlight(code, Prism.languages[lang], lang);
      } catch (_) {}
    }
    return code;
  },
});

const blogCache: Record<string, string> = {}

export function fetchBlog (cate: string, name: string) {
  const path = cate + '/' + name
  if (blogCache[path]) return Promise.resolve(blogCache[path])
  return fetch(BASE_URL + `/blog/${path}.md`).then(res => {
    if (!res.ok) {
      throw new Error(`请求"${path}"失败\n${res.status}: ${res.statusText}.`)
    }
    return res.text()
  }).then(md => {
    const html = marked(md)
    blogCache[path] = html
    return html
  }).catch(err => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(err)
    }
    if (typeof alert === 'function') {
      alert(err && err.message)
    }
    return '';
  })
}

export const fetchBlogMeta = async () => {
  if ('blogMeta' in window) {
    store.blogMeta = (window as any).blogMeta
    return
  }
  return fetch(BASE_URL + '/blog/meta.json').then(res => res.json()).then(data => {
    store.blogMeta = data
  }).catch(err => {
    console.error(err)
    if (typeof alert === 'function') {
      alert('请求博客信息出错，' + err)
    }
  })
}
