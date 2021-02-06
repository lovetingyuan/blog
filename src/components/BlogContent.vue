<template>
  <div>
    <ul class="blog-directs" ref="directsRef">
      <li v-for="title of directs" :key="title">
        <a :href="'#' + title">{{title}}</a>
      </li>
      <li>
        <a href="#">⬆</a>
      </li>
    </ul>
    <article v-if="blogContent" class="markdown-body" ref="blogContentRef" v-html="blogContent">
    </article>
    <div v-else class="loader">
      Loading...
    </div>
  </div>
</template>

<script lang="ts">
import { watch, ref, nextTick, computed, defineComponent } from 'vue'
import store from '../store'
import { fetchBlog } from '../request'
import marked from 'marked'
import 'prismjs/themes/prism.css'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'github-markdown-css'
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
}

export default defineComponent({
  name: 'BlogContent',
  setup() {
    const blogContentRef = ref<HTMLElement | null>(null)
    const blogContent = ref('')
    const directs = ref<string[]>([])
    const directsRef = ref<HTMLUListElement | null>(null)
    const blogName = computed(() => store.currentBlogName)
    watch(() => blogName, () => {
      const { currentBlogCate: cate, currentBlogName: name } = store
      if (!cate || !name) return
      fetchBlog(cate, name, marked).then(blog => {
        blogContent.value = blog
        nextTick(() => {
          const el = blogContentRef.value
          if (!el) return
          postMD(el)
          directs.value.length = 0
          el.querySelectorAll('[id]').forEach(v => {
            directs.value.push(v.id)
          })
          nextTick(() => {
            const el = directsRef.value
            if (el) {
              const { height } = el.getBoundingClientRect()
              const root = document.documentElement
              root.style.setProperty('--scroll-margin-top', height + 'px')
            }
          })
        })
      })
    }, {
      immediate: true
    })
    return { blogContentRef, blogContent, directs, directsRef, blogName }
  }
})
</script>

<style scoped>
  .blog-directs {
    position: sticky;
    top: 0;
    background-color: var(--theme-bg-color);
    overflow: hidden;
    padding: 20px 0;
    margin: 0;
    box-sizing: border-box;
    list-style-position: inside;
    z-index: 9;
  }
  .blog-directs li {
    float: left;
    margin: 5px 10px;
  }
  .blog-directs li:last-child {
    float: right;
    list-style: none;
  }
</style>
<style>
:target {
  color: var(--theme-color);
  text-shadow: 6px 3px 3px #ccc;
  scroll-margin-top: var(--scroll-margin-top);
}
.markdown-body {
  margin: 20px;
}

.markdown-body a {
  color: var(--theme-color);
}

.markdown-body ol ol, .markdown-body ol ul, .markdown-body ul ol, .markdown-body ul ul {
  margin-top: 0.5em;
}
.markdown-body li::marker {
  color: var(--theme-color);
}
.markdown-body code {
  font-weight: bold;
}
.markdown-body pre {
  margin: 20px 0;
}
.markdown-body pre code {
  margin: 20px 0;
  font-weight: normal;
}
.markdown-body li > p {
  margin: 10px 0;
}
.markdown-body li, .markdown-body p {
  line-height: 2em;
}
</style>
