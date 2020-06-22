<template>
  <ul v-show="!store.blogName" class="blog-list">
    <li v-for="(post, name) in store.blogList">
      <p class="blog-title">
        <route-link :to="post.cate + '/' + name">{{post.title}}</route-link>
      </p>
    </li>
  </ul>
</template>

<script>
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
    font-size: 1.4em;
    font-weight: 500;
    transition: letter-spacing .2s;
  }
  .blog-title:hover {
    letter-spacing: 1px;
  }
</style>
