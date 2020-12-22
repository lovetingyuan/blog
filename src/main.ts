import 'normalize.css'
import './index.css'
import { createApp, watchEffect } from 'vue'
import App from './App.vue'
import store from './store'
import { fetchBlogMeta } from './request'
import RouteLink from './components/RouteLink.vue'

const app = createApp(App)
app.component('route-link', RouteLink)
app.mount('#app')
fetchBlogMeta()

const updateCateAndName = () => {
  let pathname = location.pathname
  const base = store.baseUrl
  if (pathname.startsWith(base) || (pathname + '/').startsWith(base)) {
    pathname = pathname.substring(base.length, pathname.length)
  }
  const [cate = '', name = ''] = pathname.split('/').filter(Boolean)
  store.setCateName(cate, name)
  return updateCateAndName
}

watchEffect(() => {
  document.title = store.docTitle
})
window.addEventListener('popstate', updateCateAndName())

const redirect = decodeURIComponent(new URLSearchParams(location.search).get('redirect') || '')
if (redirect) {
  history.pushState({ redirect }, 'redirect', redirect)
  updateCateAndName()
}
