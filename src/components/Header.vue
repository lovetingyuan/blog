<template>
  <header>
    <h3 class="title">
      <router-link to="/" no-active>{{props.titleText}}</router-link>
    </h3>
    <nav>
      <ul class="navbar">
        <li v-for="cate of cateList" :key="cate.name" class="navbar-item">
          <router-link
            :to="'/' + cate.name" class="navbar-item_link"
            :class="currentCate === cate.name ? 'router-link-active' : ''"
          >
            {{cate.name}}
            <span style="font-size: .9em; vertical-align: super;">{{cate.count}}</span>
          </router-link>
        </li>
        <li class="navbar-item">
          <input type="text"
            autocomplete="on"
            placeholder="搜索@github"
            class="searchinput"
            v-model.trim="keyword"
            @keyup.enter="handleSearch"
          >
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref } from 'vue'
import blogs from '../blogs'

const props = defineProps({
  titleText: {
    type: String
  }
})
const keyword = ref('')
const cateList = computed(() => blogs.cateList)
const currentCate = computed(() => blogs.cate)
const handleSearch = () => {
  if (keyword.value) {
    const searchParam = `q=${keyword.value}+path%3Ablog+extension%3Amd`
    keyword.value = ''
    window.open(`https://github.com/lovetingyuan/nblog/search?` + (searchParam))
  }
}

</script>

<style scoped>

.title {
  margin: 6px;
  position: fixed;
  left: 20px;
  user-select: none;
}
.title a {
  color: var(--theme-color);
}
header {
  padding-top: 20px;
  padding-bottom: 10px;
  user-select: none;
}

.navbar {
  list-style: none;
  margin: 0;
  padding: 0 1px;
  overflow: hidden;
}
.navbar-item {
  float: left;
  margin: 4px;
  text-transform: uppercase;
}
.navbar-item:last-child {
  float: right;
}
.navbar-item_link {
  display: inline-block;
  padding: 4px 14px;
  font-size: 16px;
  text-decoration: none;
}
.router-link-active.navbar-item_link {
  font-weight: bold;
}
.navbar-item_link:hover {
  font-weight: bold;
}
.searchinput {
  padding: 5px 14px;
  font-size: .9em;
  border-radius: 100px 100px;
  outline: none;
  border: 1px solid #999;
  width: 100px;
  transition: width .3s;
  position: relative;
  top: 4px;
  left: -10px;
}
.searchinput:focus {
  box-shadow: 0 0 4px 0px #999;
  border-color: #666;
  width: 160px;
}
@media screen and (max-width: 1100px) {
  .title {
    writing-mode: vertical-rl;
    left: 10px;
  }
}
</style>


