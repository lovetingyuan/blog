<template>
  <div>
    <ul class="blog-directs" ref="directsRef">
      <li v-for="title of directs" :key="title">
        <a :href="'#' + title">{{title}}</a>
      </li>
      <li style="margin: 0">
        <a href="#" class="up-arrow">⬆</a>
      </li>
    </ul>
    <article v-if="blogContent" id="blog-content" class="markdown-body" ref="blogContentRef" v-html="blogContent">
    </article>
    <div v-else class="loader">
      Loading...
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, nextTick, defineProps } from 'vue'
import 'github-markdown-css/github-markdown.css'

import lightCodeCss from 'prismjs/themes/prism-solarizedlight.css?raw'
import darkCodeCss from 'prismjs/themes/prism-tomorrow.css?raw'

import * as Prism from 'prismjs'
import 'prismjs/components/prism-typescript'

import blogs from '../blogs'
import useStorage from '../useStorage'

const codeThemeStyle = document.createElement('style')
codeThemeStyle.dataset.codeTheme = ''
document.head.appendChild(codeThemeStyle)

const isLightMode = useStorage('is-light-mode', true)
watch(isLightMode, (light) => {
  codeThemeStyle.textContent = light ? lightCodeCss : darkCodeCss
}, {
  immediate: true
})
const props = defineProps({
  cate: { type: String, required: true },
  article: { type: String, required: true }
})

const blogContent = ref('')

const directs = ref<string[]>([])
const directsRef = ref<HTMLUListElement | null>(null)
const blogContentRef = ref<HTMLElement | null>(null)

const scrollTopHeight = ref('0px')

watch([props, blogs.blogs], async ([{ cate, article }]) => {
  blogs.setCateArticle([cate, article])
  const md = await blogs.fetchBlogContent().catch(() => {
    return '<h3 style="text-align: center">获取失败，请检查地址</h3>'
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
    scrollTopHeight.value = height + 'px'
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
    background-color: var(--bg-color);
    overflow: hidden;
    padding: 20px 0;
    margin: 0;
    box-sizing: border-box;
    list-style-position: inside;
    z-index: 9;
    border-bottom: 1px solid var(--theme-color-ll);
  }
  .blog-directs li {
    float: left;
    margin: 5px 10px;
  }
  .blog-directs li:last-child {
    float: right;
    list-style: none;
  }
  .up-arrow {
    display: inline-block;
    font-size: 24px;
    user-select: none;
  }
</style>
<style>
:target {
  color: var(--theme-color);
  text-shadow: 6px 3px 3px #ccc;
  scroll-margin-top: v-bind(scrollTopHeight);
}
.markdown-body {
  margin: 20px;
  color: var(--text-color);
}

.markdown-body table td, .markdown-body table tr, .markdown-body table th {
  background-color: var(--bg-color);
}

.markdown-body a {
  color: var(--theme-color);
}
.markdown-body hr {
  background-color: var(--theme-color-ll);
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
  font-size: 1.05em;
  line-height: 1.6em;
}
.markdown-body pre code {
  margin: 20px 0;
  font-weight: normal;
  transition: all .3s;
}
.markdown-body li > p {
  margin: 10px 0;
}
.markdown-body li, .markdown-body p {
  line-height: 2em;
}
</style>
