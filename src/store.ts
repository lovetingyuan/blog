import { reactive, computed } from 'vue'

function init<T extends {[k: string]: any}>(model: T) {
  const newModel = {} as typeof model;
  Object.keys(model).forEach((k: keyof T) => {
    const desc = Object.getOwnPropertyDescriptor(model, k)
    if (desc && desc.get) {
      newModel[k] = computed(desc.get) as any
    } else {
      newModel[k] = model[k]
    }
  })
  return reactive(newModel)
}

const parseDateStrToTimestamp = (date: string) => {
  date = date.split('T')[0]
  const [year, month, day] = date.split('-').map(v => parseInt(v, 10))
  return new Date(year, month - 1, day).getTime()
}

type BlogCate = string
type BlogName = string
interface BlogItem {
  title: string
  date: string
  keywords: string
  cate?: string
  name?: string
  id?: string
}
type BlogMeta = Record<BlogCate, Record<BlogName, BlogItem>>
type BlogCateMap = Record<BlogCate, Required<BlogItem>[]>

const sortByTime = (a: BlogItem, b: BlogItem) => {
  return parseDateStrToTimestamp(b.date) - parseDateStrToTimestamp(a.date)
}

const model = {
  baseUrl: '/nblog/',
  blogMeta: {} as BlogMeta,
  currentBlogName: '',
  currentBlogCate: '',
  setMeta(meta: BlogMeta) {
    store.blogMeta = meta;
  },
  setCateName(cate: string, name: string) {
    store.currentBlogName = name
    store.currentBlogCate = cate
  },
  get blogMap () {
    const map: BlogCateMap = {}
    Object.entries(store.blogMeta).forEach(([cate, blogMap]) => {
      map[cate] = Object.entries(blogMap).map(([name, meta]) => {
        return { cate, name, id: cate + '/' + name, ...meta }
      }).sort(sortByTime)
    })
    return map
  },
  get blogList () {
    if (store.currentBlogCate) {
      return store.blogMap[store.currentBlogCate]
    }
    return Object.values(store.blogMap).reduce((a, b) => a.concat(b), []).sort(sortByTime)
  },
  get cateList () {
    return Object.entries(store.blogMap).map(([cate, list]) => {
      return {
        name: cate, count: list.length
      }
    })
  },
  get isNotFound () {
    const { currentBlogCate: cate, currentBlogName: name, blogMeta } = store
    if (cate) {
      if (!blogMeta[cate]) return true
      if (name && !blogMeta[cate][name]) return true
    }
    return false
  },
  get docTitle () {
    const title = ['tingyuan blog']
    if (store.isNotFound) {
      title.push('not found')
    } else {
      const { currentBlogCate: cate, currentBlogName: name } = store
      title.push(cate)
      title.push(name)
    }
    return title.filter(Boolean).join(' - ')
  }
}

const store = init(model)

if (process.env.NODE_ENV === 'development') {
  console.log('store', store)
}

export default store
