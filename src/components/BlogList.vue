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
  <div v-else-if='error'>{{error}}</div>
  <div v-else> Loading... </div>
</template>

<script lang="ts" setup>
import { defineProps, watch, ref } from 'vue'
import { getBlogArticleList, getAllBlogList } from '../blog'

const props = defineProps({
  cate: String
})
const list = ref<string[]>([])
const error = ref('')
watch(() => props.cate, (c) => {
  error.value = ''
  if (!c) {
    list.value = getAllBlogList()
  } else {
    const articles = getBlogArticleList(c)
    if (articles) {
      list.value = articles
    } else {
      error.value = '请检查地址'
    }
  }
}, {
  immediate: true
})

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
