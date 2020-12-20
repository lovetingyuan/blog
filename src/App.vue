<template>
  <div class="container">
    <Header></Header>
    <hr />
    <main>
      <div class="not-found" v-if="isNotFound">
        404, 页面不存在
      </div>
      <transition name="fade" mode="out-in" appear v-else>
        <component :is="view"></component>
      </transition>
    </main>
  </div>
</template>

<script lang="ts">
import Header from './components/Header.vue'
import BlogContent from './components/BlogContent.vue'
import BlogList from './components/BlogList.vue'
import store from './store'
import { fetchBlogMeta } from './request'

export default {
  name: 'App',
  components: {
    Header, BlogContent, BlogList
  },
  computed: {
    view() {
      return store.currentBlogName ? 'BlogContent' : 'BlogList'
    },
    isNotFound() {
      return store.isNotFound
    }
  },
  created() {
    fetchBlogMeta()
  }
}
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
  transition: transform 0.2s ease, opacity .2s ease;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}
</style>
