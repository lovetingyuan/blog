<template>
  <ul class="blog-list" v-if="store.currentBlogListView.length">
    <li v-for="post in store.currentBlogListView" :key="post.name" class="blog-title">
      <route-link :to="post.cate + '/' + post.name">{{post.title}}
        <span style="font-size: .8em">({{post.date}})</span>
      </route-link>
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
    width: fit-content;
    font-weight: 500;
    margin: 15px 0;
  }
  .blog-title:hover {
    font-weight: 600;
  }
</style>
