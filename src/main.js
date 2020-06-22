import 'normalize.css'
import './index.css'
import { createApp, reactive } from 'vue'
// import * as Vue from 'vue'
// console.log('vue', Vue)
import { getCurrentPaths } from './request'
import App from './App.vue'
import store from './store'
import RouteLink from './components/RouteLink.vue'

if (location.search.includes('redirect')) {
  const redirect = decodeURIComponent(new URLSearchParams(location.search).get('redirect'))
  if (redirect) {
    const state = { redirect }
    history.pushState(state, 'redirect', redirect)
    dispatchEvent(new PopStateEvent('popstate', state));
  }
} else {
  const app = createApp(App)
  app.component('route-link', RouteLink).mount('#app')
  
  const updateCateAndName = () => {
    const [cate, name] = getCurrentPaths()
    store.cate = cate
    store.blogName = name
    return updateCateAndName
  }

  window.addEventListener('popstate', updateCateAndName())
}
