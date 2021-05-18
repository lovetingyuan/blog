import { ref, watch } from 'vue'

const root = document.documentElement
const rootStyle = window.getComputedStyle(root)

let defaultThemeColor = ''
const cacheKey = '1:nblog:themeColor'

const themeMeta = document.head.querySelector('meta[name="theme-color"]')
if (themeMeta) {
  defaultThemeColor = themeMeta.getAttribute('content') || ''
} else {
  defaultThemeColor = rootStyle.getPropertyValue('--theme-color').trim()
}
const themeColor = ref(defaultThemeColor)
if (typeof localStorage === 'object') {
  const storedThemeColor = localStorage.getItem(cacheKey)
  if (storedThemeColor) {
    themeColor.value = storedThemeColor
  } else {
    themeColor.value = defaultThemeColor
  }
}

let watched = false

export default function useThemeColor() {
  if (watched) return themeColor
  watched = true
  watch(themeColor, (tc) => {
    if (themeMeta) {
      themeMeta.setAttribute('content', tc)
    }
    root.style.setProperty('--theme-color', tc)
    root.style.setProperty('--theme-color-l', tc + 'dd')
    root.style.setProperty('--theme-color-ll', tc + '30')
    localStorage.setItem(cacheKey, tc)
  }, {
    immediate: true
  })
  return themeColor;
}
