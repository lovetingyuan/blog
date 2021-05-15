import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import App from './App.vue'
import createRouter from './router'

const createApp = () => {
  const app = createSSRApp(App)
  const router = createRouter()
  app.use(router)
  return renderToString(app)
}

export default createApp
