import { ref, watch } from 'vue'

let defaultThemeColor = ''
const themeColor = ref(defaultThemeColor)
const cacheKey = '1:nblog:themeColor'

if (typeof document === 'object') {
  const root = document.documentElement
  const rootStyle = window.getComputedStyle(root)
  const themeMeta = document.head.querySelector('meta[name="theme-color"]')
  if (themeMeta) {
    themeColor.value = themeMeta.getAttribute('content') || ''
  } else {
    themeColor.value = rootStyle.getPropertyValue('--theme-color').trim()
  }
  if (typeof localStorage === 'object') {
    const storedThemeColor = localStorage.getItem(cacheKey)
    if (storedThemeColor) {
      themeColor.value = storedThemeColor
    }
  }
}

let watched = false

export default function useThemeColor() {
  if (typeof document !== 'object') return themeColor
  if (watched) return themeColor
  watched = true
  const root = document.documentElement
  const themeMeta = document.head.querySelector('meta[name="theme-color"]')
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
