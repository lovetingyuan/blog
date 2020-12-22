<template>
  <article v-if="blogContent" class="markdown-body" ref="blogContentRef" v-html="blogContent">
    
  </article>
  <div v-else style="text-align: center; padding: 50px; font-size: 1.2em;">
    Loading...
  </div>
</template>

<script lang="ts">
import { watch, ref, nextTick } from 'vue'
import store from '../store'
import { fetchBlog } from '../request'
import marked from 'marked'
import 'prismjs/themes/prism.css'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
;(Prism as any).manual = true

marked.setOptions({
  highlight(code, lang) {
    if (lang && Prism.languages[lang]) {
      try {
        return Prism.highlight(code, Prism.languages[lang], lang);
      } catch (_) {}
    }
    return code;
  },
});

const postMD = (el: HTMLElement | null) => {
  if (!el) return
  el.querySelectorAll('a').forEach(link => {
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
  })
  el.querySelectorAll('code').forEach(code => {
    if (code.attributes.length === 0) {
      code.style.fontWeight = 'bold'
    }
  })
}

export default {
  name: 'BlogContent',
  setup() {
    const blogContentRef = ref<HTMLElement | null>(null)
    const blogContent = ref('')
    watch(() => store.currentBlogName, () => {
      const { currentBlogCate: cate, currentBlogName: name } = store
      if (!cate || !name) return
      fetchBlog(cate, name, marked).then(blog => {
        blogContent.value = blog
        nextTick(() => postMD(blogContentRef.value))
      })
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
.markdown-body li > p {
  margin: 10px 0;
}
.markdown-body li, .markdown-body p {
  line-height: 2em;
}
</style>
