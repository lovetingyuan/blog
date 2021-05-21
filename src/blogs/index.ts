import { reactive } from 'vue'

type DSM = { default: string }

const mdCache: Record<string, DSM> = {}

const fetchMd = (importMap: ReturnType<ImportMeta["glob"]>) => {
  if (import.meta.env.DEV) {
    return importMap
  }
  const fetchMdMap: Record<string, () => Promise<DSM>> = {}
  Object.keys(importMap).forEach(k => {
    fetchMdMap[k] = () => {
      const url = k.replace('./', import.meta.env.BASE_URL + 'blogs/').replace('.md', '.html')
      if (mdCache[url]) {
        return Promise.resolve(mdCache[url])
      }
      return fetch(url).then(r => r.text()).then(v => {
        mdCache[url] = { default: v }
        return mdCache[url]
      })
    }
  })
  return fetchMdMap
}

const store = reactive(new class {
  static namespace = 'blogs'
  blogs = fetchMd(import.meta.glob('./**/*.md'))
  cate = ''
  article = ''
  fetchBlogContent = () => {
    const { cate, article, blogsMap } = this;
    if (!article || !cate) return Promise.reject()
    const fetchBlog = blogsMap[cate][article]
    if (!fetchBlog) {
      return Promise.reject()
    }
    return fetchBlog().then(res => res.default)
  }
  setCateArticle([cate, article]: [string, string]) {
    this.cate = cate
    this.article = article
  }
  get articleList() {
    const { article, cate, blogsMap } = this
    if (article) return []
    if (cate) {
      return blogsMap[cate] ? Object.keys(blogsMap[cate]) : [];
    }
    const list: string[] = []
    Object.keys(blogsMap).forEach(c => {
      Object.keys(blogsMap[c]).forEach(name => {
        list.push(c + '/' + name)
      })
    })
    return list
  }
  get blogsMap() {
    const blogsMap: {
      [k: string]: {
        [k: string]: (() => Promise<DSM>)
      }
    } = {}
    const { blogs } = this
    Object.keys(blogs).forEach(path => {
      const paths = path.split('/')
      const name = paths.pop()?.slice(0, -3) as string
      const cate = paths.pop() as string
      if (!blogsMap[cate]) {
        blogsMap[cate] = {
          [name]: blogs[path] as () => Promise<any>
        }
      } else {
        blogsMap[cate][name] = blogs[path] as () => Promise<any>
      }
    })
    return blogsMap
  }
  get cateList() {
    return Object.keys(this.blogsMap).map(cate => {
      return {
        name: cate,
        count: Object.keys(this.blogsMap[cate]).length
      }
    })
  }
})

if (import.meta.env.DEV) {
  console.log('store', store)
  if (typeof window === 'object' && import.meta.hot) {
    (window as any)._hotUpdateBlog = (meta: ImportMeta, module: DSM) => {
      const { pathname } = new URL(meta.url)
      const mdPath = decodeURIComponent(pathname.replace(import.meta.env.BASE_URL, '/'))
      store.blogs[mdPath] = () => Promise.resolve(module)
    }
  }
}

export default store
