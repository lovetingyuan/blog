<template>
  <a data-route :href="href" @click.prevent.stop="onClick" :class="{active: !noActive && active}">
    <slot />
  </a>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import store from '../store'

const BASE_URL = '/nblog'

export const jumpTo = (state, title, url) => {
  history.pushState(state, title, url)
  dispatchEvent(new PopStateEvent('popstate', state));
}

export default {
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
      let to = props.to
      if (!to.startsWith('/')) {
        to = '/' + to
      }
      return BASE_URL + to
    })
    watch(() => [store.currentCate, store.currentBlogName], () => {
      active.value = location.pathname.startsWith(href.value)
    }, {
      immediate: true
    })

    const onClick = (evt) => {
      let to = href.value
      if (location.pathname === to) {
        if (props.dbto && to !== props.dbto) {
          to = props.dbto
        } else return
      }
      const state = {
        to, from: location.pathname
      }
      jumpTo(state, evt.target.textContent, to)
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
