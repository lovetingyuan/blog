import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import App from './App.vue'
import createRouter from './router'

export default () => {
  const app = createSSRApp(App)
  const router = createRouter()
  app.use(router)
  return router.isReady().then(() => {
    return renderToString(app)
  })
}
