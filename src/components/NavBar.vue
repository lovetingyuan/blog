<template>
  <nav>
    <ul class="navbar">
      <li v-for="cate of cates" class="navbar-item">
        <route-link :to="cate[0]" class="navbar-item_link">{{cate[0]}} {{cate[1]}}</route-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import { computed } from 'vue'
import store from '../store'

export default {
  name: 'Navbar',
  setup() {
    return {
      cates: computed(() => {
        return store.cates
      })
    }
  }
}
</script>

<style scoped>
.navbar {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.navbar-item {
  float: left;
  margin: 10px;
}
.navbar-item_link {
  display: inline-block;
  padding: 5px 18px;
  border-radius: 100px;
  border: 1px solid var(--theme-color);
  text-decoration: none;
  transition: background-color .2s;
}
.navbar-item_link:hover {
  background-color: var(--theme-color-l);
}
</style>
