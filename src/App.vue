<template>
  <input type="checkbox" hidden v-model="isLightMode" id="lightDarkMode">
  <label for="lightDarkMode" class="light-dark"></label>
  <div class="app-container">
    <div class="container">
      <top-header title-text="庭院 𝔟𝔩𝔬𝔤"></top-header>
      <hr />
      <main>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in" appear>
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
    <footer>
      <span>© 𝘵𝘪𝘯𝘨𝘺𝘶𝘢𝘯 {{ time }}</span>
      &nbsp;
      <a
        href="https://github.com/lovetingyuan/nblog"
        target="_blank"
        title="github"
        rel="noopener noreferrer"
      >
        <img src="./assets/github.svg" width="14" height="14" alt="github" />
      </a>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import TopHeader from "./components/Header.vue";
import useStorage from "./useStorage";
let time = new Date().getFullYear() + "";
if (typeof window === 'object' && typeof (window as any)._buildTime === 'number') {
  time = new Date((window as any)._buildTime as unknown as number).toLocaleString();
}

const isLightMode = useStorage('is-light-mode', true)
</script>
<style>
.light-dark {
  position: fixed;
  right: 10px;
  top: 10px;
  cursor: pointer;
  display: inline-block;
  padding: 5px;
}
.light-dark::before {
  content: '🌑';
}
#lightDarkMode:checked ~ .light-dark::before {
  content: '☀️';
}
#lightDarkMode ~ .app-container {
  --text-color: white;
  --bg-color: #222;
  --link-color: rgb(188, 188, 248);
}
#lightDarkMode:checked ~ .app-container {
  --text-color: #222;
  --bg-color: white;
  --link-color: rgb(0, 87, 144);
}
.app-container {
  background-color: var(--bg-color);
  color: var(--text-color);
}
</style>
<style scoped>
.container {
  width: 88%;
  min-width: 300px;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
}
.not-found {
  height: 200px;
  width: 100%;
  margin: 100px 0;
  text-align: center;
  font-size: 1.6em;
  font-weight: bold;
}
@media screen and (max-width: 500px) {
  .container {
    width: 90%;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}
.container {
  min-height: calc(100vh - 40px);
}
footer {
  text-align: center;
  font-size: 12px;
  color: #888;
  height: 40px;
  line-height: 40px;
}
footer img {
  vertical-align: sub;
}
</style>
