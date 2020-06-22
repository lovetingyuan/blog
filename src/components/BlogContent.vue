<template>
  <article v-show="blogContent" class="markdown-body" ref="blogContentRef" v-html="blogContent"></article>
</template>

<script>
import { watch, ref, nextTick } from 'vue'
import store from '../store'
import { fetchBlog } from '../request'

const postMD = (el) => {
  el.querySelectorAll('a').forEach(link => {
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
  })
}

export default {
  name: 'BlogContent',
  setup() {
    const blogContentRef = ref(null)
    const blogContent = ref('')
    watch(() => store.blogName, () => {
      if (store.blogName) {
        fetchBlog(store.cate, store.blogName).then(blog => {
          blogContent.value = blog
          nextTick(() => postMD(blogContentRef.value))
        })
      } else {
        blogContent.value = ''
      }
    }, {
      immediate: true
    })
    return { blogContentRef, blogContent }
  }
}
</script>

<style src="github-markdown-css"></style>
<style>
.markdown-body {
  margin: 40px 20px;
}
.markdown-body a {
  color: var(--text-color)!important;
}

.markdown-body ol ol, .markdown-body ol ul, .markdown-body ul ol, .markdown-body ul ul {
  margin-top: 0.5em;
}
.markdown-body pre {
  margin: 20px 0;
}
</style>
