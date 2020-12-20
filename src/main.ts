import 'normalize.css'
import './index.css'
import { createApp, watchEffect } from 'vue'
import App from './App.vue'
import store from './store'
import RouteLink from './components/RouteLink.vue'

const BASE_URL = '/nblog/'

const _createApp = () => {
  const app = createApp(App)
  RouteLink.BASE_URL = BASE_URL
  app.component('route-link', RouteLink)
  return app
}

export default _createApp

const updateCateAndName = () => {
  let pathname = location.pathname
  if (pathname.startsWith(BASE_URL) || (pathname + '/').startsWith(BASE_URL)) {
    pathname = pathname.substring(BASE_URL.length, pathname.length)
  }
  const [cate = '', name = ''] = pathname.split('/').filter(Boolean)
  store.currentBlogCate = cate
  store.currentBlogName = name
  return updateCateAndName
}

if (typeof document === 'object') {
  watchEffect(() => {
    document.title = store.docTitle
  })
}

if (typeof window === 'object') {
  _createApp().mount('#app')
  window.addEventListener('popstate', updateCateAndName())

  if (location.search.includes('redirect')) {
    const redirect = decodeURIComponent(new URLSearchParams(location.search).get('redirect') || '')
    if (redirect) {
      history.pushState({ redirect }, 'redirect', redirect)
      updateCateAndName()
    }
  }
}
