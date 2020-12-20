<template>
  <header>
    <h3 class="title">
      <route-link to="/" no-active>
        <span>庭院 Blog </span>
      </route-link>
      <a href="https://github.com/lovetingyuan/nblog" style="vertical-align: middle" target="_blank" title="github" rel="noopener noreferrer">
        <img src="~../assets/github.svg" width="20" alt="github" />
      </a>
    </h3>
    <nav>
      <ul class="navbar">
        <li v-for="cate of cateList" :key="cate.name" class="navbar-item">
          <route-link :to="cate.name" class="navbar-item_link" dbto="/nblog/">{{cate.name}} {{cate.count}}</route-link>
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
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import { computed, ref } from 'vue'
import store from '../store'

export default {
  name: 'Header',
  setup() {
    const keyword = ref('')
    const handleSearch = () => {
      if (keyword.value.trim()) {
        const kw = keyword.value.trim()
        keyword.value = ''
        const searchParam = `q=${kw}+path%3Ablog+extension%3Amd`
        window.open(`https://github.com/lovetingyuan/nblog/search?` + (searchParam))
      }
    }
    return {
      cateList: computed(() => store.cateList),
      keyword,
      handleSearch
    }
  }
}
</script>

<style scoped>
.title {
  float: left;
  margin: 6px;
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
  background-color: var(--theme-color-l);
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
</style>
