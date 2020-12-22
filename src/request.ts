import store from './store'

const base = process.env.NODE_ENV === 'production' ? store.baseUrl : '/'

const blogCache: Record<string, string> = {}

let _fetch: typeof window.fetch

if (typeof window === 'object') {
  'blogMeta' in window && store.setMeta((window as any).blogMeta)
  _fetch = window.fetch
}

export function fetchBlog (cate: string, name: string, marked: (a: string) => string) {
  const path = cate + '/' + name
  if (blogCache[path]) return Promise.resolve(blogCache[path])
  return _fetch(base + `blog/${path}.md`).then(res => {
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

export const fetchBlogMeta = () => {
  let task
  if (!_fetch) {
    task = Promise.resolve(require('../../../public/blog/meta.json'))
  } else {
    task =  _fetch(base + 'blog/meta.json').then(res => res.json())
  }
  return task
    .then(data => {
      store.setMeta(data)
    }).catch(err => {
      console.error(err)
      if (typeof alert === 'function') {
        alert('请求博客信息出错，' + err)
      }
    })
}
