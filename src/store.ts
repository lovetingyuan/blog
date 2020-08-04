import { reactive, computed } from 'vue'
import { BlogMetaItem, Store, BlogListMap } from './types'

// function asyncReactive<T extends object> (obj: T) {
//   const reactiveObj = reactive(obj)
//   Object.entries(obj).forEach(([key, val]) => {
//     if (val instanceof Promise) {
//       val.then((value) => {
//         reactiveObj[key] = value
//         return value
//       })
//     }
//   })
//   return reactiveObj
// }

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
  // showList: computed(() => {
  //   return !store.blogName
  // }),
  // showArticle: computed(() => {
  //   return !!store.blogName
  // })
})

if (process.env.NODE_ENV === 'development') {
  console.log('store', store)
}

export default store
