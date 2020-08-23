import { reactive, computed, watchEffect } from 'vue'
import { BlogMetaItem, Store, BlogListMap } from './types'

const parseDateStrToTimestamp = (date: string) => {
  date = date.split('T')[0]
  const [year, month, day] = date.split('-').map(v => parseInt(v, 10))
  return new Date(year, month - 1, day).getTime()
}

const store: Store = reactive({
  blogMetaApi: {},
  blogMetaView: computed<BlogListMap>(() => {
    const map: BlogListMap = {}
    Object.entries(store.blogMetaApi).forEach(([cate, blogMap]) => {
      map[cate] = Object.entries(blogMap).map(([name, meta]) => {
        return { cate, name, ...meta }
      }).sort((a, b) => {
        return parseDateStrToTimestamp(b.date) - parseDateStrToTimestamp(a.date) 
      })
    })
    return map
  }),
  cateListView: computed<[string, number][]>(() => {
    return Object.entries(store.blogMetaView).map(([cate, list]) => [cate, list.length])
  }),
  currentBlogName: '',
  currentCate: '',
  allBlogListView: computed<BlogMetaItem[]>(() => {
    return Object.values(store.blogMetaView).reduce((a, b) => a.concat(b), []).sort((a, b) => {
      return parseDateStrToTimestamp(b.date) - parseDateStrToTimestamp(a.date)
    })
  }),
  currentBlogListView: computed<BlogMetaItem[]>(() => {
    if (store.currentCate) return store.blogMetaView[store.currentCate] || []
    return store.allBlogListView || []
  }),
  errorPage: computed<boolean>(() => {
    if (store.currentCate && !store.blogMetaApi[store.currentCate]) return true
    if (store.currentCate && store.currentBlogName && !store.blogMetaApi[store.currentCate][store.currentBlogName]) return true
    return false
  })
})

if (process.env.NODE_ENV === 'development') {
  console.log('store', store)
}

watchEffect(() => {
  const title = ['tingyuan blog']
  if (store.currentCate) {
    title.push(store.currentCate)
    if (store.currentBlogName) {
      try {
        const blog = store.blogMetaApi[store.currentCate][store.currentBlogName]
        title.push(blog.title)
      } catch (e) {}
    }
  }
  document.title = title.join(' - ')
})

export default store
