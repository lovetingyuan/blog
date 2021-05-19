import { createApp, ref } from 'vue'
import App from './App.vue'
import createRouter from './router'
const app = createApp(App)
const router = createRouter()
app.use(router)
app.mount('#app')

const redirect = decodeURIComponent(new URLSearchParams(location.search).get('redirect') || '')
if (redirect) {
  router.replace(redirect.replace(import.meta.env.BASE_URL, '/'))
}
