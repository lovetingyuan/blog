<template>
  <a data-route :href="href" @click.prevent.stop="onClick" :class="{active: !noActive && active}">
    <slot />
  </a>
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue'
import store from '../store'

export default {
  name: 'route-link',
  props: {
    to: { type: String, required: true, },
    noActive: Boolean,
    baseUrl: { type: String, default: store.baseUrl }
  },
  setup(props) {
    const active = ref(false)
    const href = computed(() => {
      return (props.baseUrl + props.to).replace(/\/\//g, '/')
    })
    watch(() => [store.currentBlogCate, store.currentBlogName], () => {
      if (typeof location === 'object') {
        active.value = location.pathname.startsWith(href.value)
      }
    }, {
      immediate: true
    })

    const onClick = (evt: MouseEvent) => {
      const to = href.value
      const from = location.pathname
      if (from === to || !evt.target) return
      const state = { to, from }
      const title = (evt.target as any).textContent
      history.pushState(state, title, to)
      dispatchEvent(new PopStateEvent('popstate', { state }));
    }
    return {
      onClick, active, href
    }
  }
}
</script>

<style scoped>
.active {
  background-color: var(--theme-color)!important;
  color: white;
}
</style>
