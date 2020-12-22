import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import App from './App.vue'
import RouteLink from './components/RouteLink.vue'
import { fetchBlogMeta } from './request'

const createApp = () => {
  const app = createSSRApp(App)
  app.component('route-link', RouteLink)
  return fetchBlogMeta().then(() => {
    return renderToString(app)
  })
}

module.exports = createApp
