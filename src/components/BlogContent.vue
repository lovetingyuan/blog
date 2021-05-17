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

<script lang="ts" setup>
import { watch, ref, nextTick, defineProps } from 'vue'
import 'prismjs/themes/prism.css'
import * as Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'github-markdown-css'

import { getBlogContent } from '../blog'

const props = defineProps({
  cate: { type: String, required: true },
  article: { type: String, required: true }
})

const blogContent = ref('')

const directs = ref<string[]>([])
const directsRef = ref<HTMLUListElement | null>(null)
const blogContentRef = ref<HTMLElement | null>(null)

watch(props, async ({ cate, article }) => {
  const md = await getBlogContent(cate, article).catch(() => {
    return '获取失败，请检查地址'
  })
  blogContent.value = md;
  await nextTick()
  const el: HTMLElement | null = blogContentRef.value;
  if (!el) return
  Prism.highlightAllUnder(el)
  directs.value.length = 0
  el.querySelectorAll('[id]').forEach(v => {
    directs.value.push(v.id)
  })
  if (directsRef.value) {
    const { height } = directsRef.value.getBoundingClientRect()
    const root = document.documentElement
    root.style.setProperty('--scroll-margin-top', height + 'px')
  }
}, {
  deep: true,
  immediate: true
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
