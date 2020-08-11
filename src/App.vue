<template>
  <div class="container">
    <Header></Header>
    <hr />
    <main>
      <not-found v-if="store.errorPage"></not-found>
      <template v-else>
        <blog-content v-if="store.currentBlogName"></blog-content>
       <blog-list v-else></blog-list>
      </template>
    </main>
  </div>
</template>

<script lang="ts">
import NavBar from './components/NavBar.vue'
import Header from './components/Header.vue'
import BlogContent from './components/BlogContent.vue'
import BlogList from './components/BlogList.vue'
import NotFound from './components/NotFound.vue'
import store from './store'
import { fetchBlogMeta } from './request'

export default {
  name: 'App',
  components: {
    NavBar, Header, BlogContent, BlogList, NotFound
  },
  data() {
    return { store }
  },
  mounted() {
    fetchBlogMeta()
  }
}
</script>

<style scoped>
.container {
  width: 88%;
  min-width: 300px;
  max-width: 800px;
  margin: 0 auto;
}

@media screen and (max-width: 500px) {
  .container {
    width: 90%;
  }
}
</style>
