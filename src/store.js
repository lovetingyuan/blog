import { reactive, computed } from 'vue'
import { fetchBlogMeta } from './request'

function asyncReactive (obj) {
  Object.entries(obj).forEach(([key, val]) => {
    if (val instanceof Promise) {
      val.then((value) => {
        reactiveObj[key] = value
        return value
      })
    }
  })
  const reactiveObj = reactive(obj)
  return reactiveObj
}

const store = asyncReactive({
  blogMeta: fetchBlogMeta().then(res => {
    Object.entries(res).forEach(([cate, posts]) => {
      Object.values(posts).forEach(postMeta => {
        postMeta.cate = cate
      })
    })
    return res
  }),
  cates: computed(() => {
    return Object.entries(store.blogMeta).map(([cate, list]) => [cate, Object.keys(list).length])
  }),
  blogList: computed(() => {
    if (store.cate) {
      return store.blogMeta[store.cate] || {}
    }
    return Object.assign({}, ...Object.values(store.blogMeta))
  }),
  cate: '',
  blogName: '',
})

export default store
