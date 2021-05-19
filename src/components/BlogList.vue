<template>
  <transition-group name="blog-list" class="blog-list" tag="ul" v-if="list.length">
    <li v-for="name of list" :key="name" class="blog-title">
      <router-link :to="'/' + props.cate + '/' + name" v-if="props.cate">
        {{ name }}
      </router-link>
      <router-link v-else :to="'/' + name" class="blog-title">
        {{name.split('/')[1]}}
      </router-link>
    </li>
  </transition-group>
  <div v-else style="text-align: center; margin: 20vh 0;"> 暂无内容... </div>
</template>

<script lang="ts" setup>
import { defineProps, watch, computed } from 'vue'
import blogs from '../blogs'

const props = defineProps({
  cate: String
})
const list = computed<string[]>(() => blogs.articleList)
watch(() => props.cate, (c) => {
  blogs.setCateArticle([c || '', ''])
}, {
  immediate: true
})

</script>

<style scoped>
  .blog-list {
    margin: 40px 0;
  }
  .blog-title {
    font-size: 1.1em;
    width: fit-content;
    font-weight: 500;
    margin: 15px 0;
    text-transform: capitalize;
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
