<template>
  <a
    data-route
    :href="href"
    @click.prevent.stop="onClick"
    :class="{ active: !noActive && active }"
  >
    <slot />
  </a>
</template>

<script lang="ts" setup>
import { ref, computed, watch, defineProps } from "vue";
import store from "../store";
const props = defineProps({
  to: { type: String, required: true },
  noActive: Boolean,
  baseUrl: { type: String, default: store.baseUrl },
});
const active = ref(false);
const href = computed(() => {
  return (props.baseUrl + props.to).replace(/\/\//g, "/");
});
watch(
  () => [store.currentBlogCate, store.currentBlogName],
  () => {
    if (typeof document === 'object') {
      active.value = location.pathname.startsWith(href.value);
    }
  },
  {
    immediate: true,
  }
);

const onClick = (evt: MouseEvent) => {
  const to = href.value;
  const from = location.pathname;
  if (from === to || !evt.target) return;
  const state = { to, from };
  const title = (evt.target as any).textContent;
  history.pushState(state, title, to);
  dispatchEvent(new PopStateEvent("popstate", { state }));
};

</script>

<style scoped>
.active {
  background-color: var(--theme-color-l) !important;
  color: white;
}
</style>
