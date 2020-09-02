<template>
  <nav>
    <ul class="navbar">
      <li v-for="cate of store.cateListView" class="navbar-item">
        <route-link :to="cate[0]" class="navbar-item_link" dbto="/nblog/">{{cate[0]}} {{cate[1]}}</route-link>
      </li>
      <li class="navbar-item">
        <input type="text" autocomplete="on" placeholder="搜索@github" class="searchinput" v-model="keyword" @keyup.enter="search">
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import store from '../store'
import { ref } from 'vue'

export default {
  name: 'Navbar',
  setup() {
    const keyword = ref('')
    const search = () => {
      if (keyword.value.trim()) {
        const kw = keyword.value.trim()
        keyword.value = ''
        const searchParam = `q=${kw}+path%3Ablog+extension%3Amd`
        window.open(`https://github.com/lovetingyuan/nblog/search?` + (searchParam))
      }
    }
    return {
      store,
      keyword,
      search
    }
  }
}
</script>

<style scoped>
.navbar {
  list-style: none;
  margin: 0;
  padding: 0 12px;
  overflow: hidden;
}
.navbar-item {
  float: left;
  margin: 6px 10px;
  text-transform: capitalize;
}
.navbar-item_link {
  display: inline-block;
  padding: 5px 16px;
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
