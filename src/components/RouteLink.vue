<template>
  <a data-route :href="href" @click.prevent.stop="onClick" :class="{active: !noActive && active}">
    <slot />
  </a>
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue'
import store from '../store'

const BASE_URL = '/nblog/'

export default {
  name: 'route-link',
  props: {
    to: String,
    noActive: Boolean,
    dbto: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const active = ref(false)
    const href = computed(() => {
      return (BASE_URL + props.to).replace(/\/\//g, '/')
    })
    watch(() => [store.currentBlogCate, store.currentBlogName], () => {
      active.value = location.pathname.startsWith(href.value)
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
