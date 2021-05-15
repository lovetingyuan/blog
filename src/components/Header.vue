<template>
  <header>
    <h3 class="title">
      <router-link to="/#" no-active>庭院 Blog</router-link>
    </h3>
    <nav>
      <ul class="navbar">
        <li v-for="cate of cateList" :key="cate.name" class="navbar-item">
          <router-link :to="'/' + cate.name" class="navbar-item_link">{{cate.name}} {{cate.count}}</router-link>
        </li>
        <li class="navbar-item">
          <input type="text"
            autocomplete="on"
            placeholder="搜索@github"
            class="searchinput"
            v-model="keyword"
            @keyup.enter="handleSearch"
          >
        </li>
        <li class="navbar-item">
          <input type="color" v-model="themeColor">
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
// import store from '../store'
import { getBlogCateList } from '../blog'
const keyword = ref('')
const cateList = getBlogCateList()
const handleSearch = () => {
  if (keyword.value.trim()) {
    const kw = keyword.value.trim()
    keyword.value = ''
    const searchParam = `q=${kw}+path%3Ablog+extension%3Amd`
    window.open(`https://github.com/lovetingyuan/nblog/search?` + (searchParam))
  }
}
let themeColor: typeof keyword
if (typeof document === 'object') {
  const root = document.documentElement
  const rootStyle = window.getComputedStyle(root)
  themeColor = ref(rootStyle.getPropertyValue('--theme-color').trim())
  const storedThemeColor = localStorage.getItem('1:nblog:themeColor')
  if (storedThemeColor) {
    themeColor.value = storedThemeColor
  }
  watchEffect(() => {
    const color = themeColor.value
    const root = document.documentElement
    root.style.setProperty('--theme-color', color)
    root.style.setProperty('--theme-color-ll', color + '30')
    root.style.setProperty('--theme-color-l', color + 'dd')
    localStorage.setItem('1:nblog:themeColor', color)
  })
}

</script>

<style scoped>
.title {
  float: left;
  margin: 6px;
}
.title a {
  color: var(--theme-color);
}
header {
  padding-top: 30px;
}
header a  {
  color: #555;
}
.navbar {
  list-style: none;
  margin: 0;
  padding: 0 1px;
  overflow: hidden;
}
.navbar-item {
  float: left;
  margin: 6px 10px;
  text-transform: capitalize;
}
.navbar-item_link {
  display: inline-block;
  padding: 4px 14px;
  font-size: 14px;
  border-radius: 100px;
  border: 1px solid var(--theme-color);
  text-decoration: none;
  transition: background-color .2s;
}
.navbar-item_link:hover {
  background-color: var(--theme-color-ll);
}
.searchinput {
  padding: 5px 12px;
  font-size: .9em;
  border-radius: 100px 100px;
  outline: none;
  border: 1px solid #aaa;
  width: 100px;
  transition: width .3s;
}
.searchinput:focus {
  box-shadow: 0 0 4px 0px var(--theme-color);
  border-color: var(--theme-color);
  width: 160px;
}
input[type=color] {
  display: inline-block;
  border: none;
  padding: 0;
  background: transparent;
  width: 20px;
}
</style>
