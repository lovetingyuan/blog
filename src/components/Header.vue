<template>
  <header>
    <h2 class="title">
      <route-link to="/" no-active>
        <span :title="title">庭院 Blog </span>
      </route-link>
      <a href="https://github.com/lovetingyuan/nblog" style="vertical-align: middle" target="_blank" title="github" rel="noopener noreferrer">
        <img src="~../assets/github.svg" width="24" alt="github" />
      </a>
    </h2>
    <nav-bar></nav-bar> 
  </header>
</template>

<script lang="ts">
import NavBar from './NavBar.vue'

export default {
  components: { NavBar },
  setup () {
    const buildtimestamp = document.querySelector('meta[name="buildtime"]')
    if (!buildtimestamp) return {
      title: '首页'
    }
    const builddate = new Date(+buildtimestamp.content)
    return {
      title: `首页（${builddate.toLocaleDateString()}）`
    }
  }
}
</script>

<style scoped>
.title {
  float: left;
  margin: 10px 0;
}
  header {
    padding-top: 30px;
  }
  header a  {
    color: #555;
  }
</style>
