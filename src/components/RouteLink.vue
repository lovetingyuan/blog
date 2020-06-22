<template>
  <a data-route :href="href" @click.prevent.stop="onClick" :class="{active: !noActive && active}">
    <slot />
  </a>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import store from '../store'

export const jumpTo = (state, title, url) => {
  history.pushState(state, title, url)
  dispatchEvent(new PopStateEvent('popstate', state));
}

export default {
  props: {
    to: String,
    noActive: Boolean
  },
  setup(props) {
    const active = ref(false)
    const href = computed(() => {
      let to = props.to
      if (!to.startsWith('/')) {
        to = '/' + to
      }
      return store.BASE_URL + to
    })
    watch(() => [store.cate, store.blogName], () => {
      active.value = location.pathname.startsWith(href.value)
    }, {
      immediate: true
    })

    const onClick = (evt) => {
      if (location.pathname === href.value) return
      const state = {
        to: href.value, from: location.pathname
      }
      jumpTo(state, evt.target.textContent, href.value)
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
