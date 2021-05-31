import { createRouter, createWebHistory, createMemoryHistory, Router } from 'vue-router'
import BlogList from './components/BlogList.vue'
import { h } from 'vue'

export let router: Router | null = null

const NotFound = {
  name: 'NotFound',
  render() {
    return h('h3', {
      style: 'margin: 20vh 0; text-align: center'
    }, ['页面找不到，请检查地址'])
  }
}

export default function () {
  const historyMethod = typeof document === 'object' ? createWebHistory : createMemoryHistory
  router = createRouter({
    history: historyMethod(import.meta.env.BASE_URL),
    routes: [
      { path: '/:anyPath(.*)*', name: 'NotFound', component: NotFound },
      { path: '/', component: BlogList },
      { path: '/:cate', component: BlogList, props: true },
      { path: '/:cate/:article', component: () => import('./components/BlogContent.vue'), props: true },
    ]
  })
  return router;
}
