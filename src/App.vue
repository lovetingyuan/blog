<template>
  <div class="container">
    <top-header></top-header>
    <hr />
    <main>
      <transition name="fade" mode="out-in" appear>
        <component :is="view"></component>
      </transition>
    </main>
  </div>
  <footer>
    <span>© tingyuan {{ time }}</span>
    &nbsp;
    <a
      href="https://github.com/lovetingyuan/nblog"
      target="_blank"
      title="github"
      rel="noopener noreferrer"
    >
      <img src="./assets/github.svg" width="14" height="14" alt="github" />
    </a>
  </footer>
</template>

<script lang="ts" setup>
import TopHeader from "./components/Header.vue";
import BlogList from "./components/BlogList.vue";
import store from "./store";
import { computed, defineAsyncComponent, h, watch } from "vue";

const BlogContent = defineAsyncComponent({
  loader: () => import("./components/BlogContent.vue"),
  loadingComponent: () =>
    h("div", {
      class: 'loader',
      innerHTML: "loading...",
    }),
});
const isNotFound = computed(() => store.isNotFound);
watch(isNotFound, () => {
  if (isNotFound.value) {
    alert(`当前地址 ${location.href} 有误`);
    location.href = store.baseUrl;
  }
});
let time = new Date().getFullYear() + "";
if (typeof document === 'object' && '__BuildTime' in window) {
  time = new Date((window as any).__BuildTime).toLocaleString();
}
const view = computed(() => {
  return store.currentBlogName ? BlogContent : BlogList;
});
</script>

<style scoped>
.container {
  width: 88%;
  min-width: 300px;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
}
.not-found {
  height: 200px;
  width: 100%;
  margin: 100px 0;
  text-align: center;
  font-size: 1.6em;
  font-weight: bold;
}
@media screen and (max-width: 500px) {
  .container {
    width: 90%;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}
.container {
  min-height: calc(100vh - 40px);
}
footer {
  text-align: center;
  font-size: 12px;
  color: #888;
  height: 40px;
  line-height: 40px;
}
footer img {
  vertical-align: sub;
}
</style>
