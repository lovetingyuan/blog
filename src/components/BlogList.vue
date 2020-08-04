<template>
  <ul class="blog-list" v-if="store.currentBlogListView.length">
    <li v-for="post in store.currentBlogListView">
      <p class="blog-title">
        <route-link :to="post.cate + '/' + post.name">{{post.title}}</route-link>
      </p>
    </li>
  </ul>
  <div v-else>
    Loading...
  </div>
</template>

<script lang="ts">
import store from '../store'

export default {
  name: 'BlogList',
  setup: () => ({
    store
  })
}
</script>

<style scoped>
  .blog-list {
    margin: 40px 0;
  }
  .blog-title {
    font-size: 1.2em;
    font-weight: 500;
    transition: letter-spacing .2s;
  }
  .blog-title:hover {
    letter-spacing: 1px;
    font-weight: 600;
  }
</style>
