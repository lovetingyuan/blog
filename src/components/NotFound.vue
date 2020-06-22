<template>
  <div class="not-found" v-if="show">
    404, 页面不存在
  </div>
</template>

<script>
import { computed } from 'vue'
import store from '../store'

export default {
  name: 'NotFound',
  setup() {
    const show = computed(() => {
      if (store.cate) {
        if (!store.blogMeta[store.cate]) return true
        if (store.blogName) {
          if (!store.blogMeta[store.cate][store.blogName]) return true
        }
      }
      return false
    })

    return {show}
  }
}
</script>

<style scoped>
  .not-found {
    height: 200px;
    width: 100%;
    margin: 100px 0;
    text-align: center;
    font-size: 1.6em;
    font-weight: bold;
  }
</style>
