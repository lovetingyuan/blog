<template>
  <div class="container">
    <Header></Header>
    <main>
      <nav-bar></nav-bar>
      <hr />
      <section>
        <blog-content></blog-content>
        <blog-list></blog-list>
        <not-found></not-found>
      </section>
    </main>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import Header from './components/Header.vue'
import BlogContent from './components/BlogContent.vue'
import BlogList from './components/BlogList.vue'
import NotFound from './components/NotFound.vue'

export default {
  name: 'App',
  components: {
    NavBar, Header, BlogContent, BlogList, NotFound
  }
}
</script>

<style scoped>
.container {
  width: 80%;
  min-width: 300px;
  max-width: 800px;
  margin: 0 auto;
}

@media screen and (max-width: 500px) {
  .container {
    width: 90%;
  }
}
</style>
