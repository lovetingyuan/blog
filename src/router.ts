import { createRouter, createWebHistory, createMemoryHistory, Router } from 'vue-router'
import BlogList from './components/BlogList.vue'

export let router: Router | null = null

function _createRouter() {
  const historyMethod = typeof document === 'object' ? createWebHistory : createMemoryHistory
  router = createRouter({
    history: historyMethod(import.meta.env.BASE_URL),
    routes: [
      { path: '/', component: BlogList },
      { path: '/:cate', component: BlogList, props: true },
      { path: '/:cate/:article', component: () => import('./components/BlogContent.vue'), props: true },
    ]
  })
  return router;
}

export default _createRouter
