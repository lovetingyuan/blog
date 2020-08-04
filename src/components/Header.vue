<template>
  <header>
    <h2 class="title">
      <route-link to="/" no-active>庭院 Blog </route-link>
      &nbsp;&nbsp;
      <a href="https://github.com/lovetingyuan/nblog" style="vertical-align: middle" target="_blank">
        <img src="~../assets/github.svg" width="24" alt />
      </a>
    </h2>
    <nav-bar></nav-bar> 
  </header>
</template>

<script lang="ts">
import NavBar from './NavBar.vue'

export default {
  components: { NavBar }
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
