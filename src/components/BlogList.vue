<template>
  <transition-group name="blog-list" class="blog-list" tag="ul" v-if="list.length">
    <li v-for="post of list" :key="post.id" class="blog-title">
      <route-link :to="post.id">
        {{post.title}}
        <span style="font-size: .8em;">({{post.date}})</span>
      </route-link>
    </li>
  </transition-group>
  <div v-else> Loading... </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import store from '../store'
const list = computed(() => store.blogList)

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
  /* .blog-list-enter-active, .blog-list-leave-active {
    transition: all .4s;
  }
  .blog-list-enter, .blog-list-leave-to {
    opacity: 0;
  } */
  .blog-list-enter-active, .blog-list-leave-active {
    transition: all .3s ease;
  }
  .blog-list-leave, .blog-list-enter-to {
    transform: translateY(50px);
  }
  .blog-list-enter, .blog-list-leave-to {
    opacity: 0;
    transform: translateX(50px);
  }
  .blog-list-move {
    transition: all .3s ease;
  }
</style>
