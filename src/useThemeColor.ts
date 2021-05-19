import { ref, watch } from 'vue'
import useStorage from './useStorage'

let defaultThemeColor = ''
// const cacheKey = '1:nblog:themeColor'

if (typeof document === 'object') {
  const root = document.documentElement
  const rootStyle = window.getComputedStyle(root)
  const themeMeta = document.head.querySelector('meta[name="theme-color"]')
  if (themeMeta) {
    defaultThemeColor = themeMeta.getAttribute('content') || ''
  } else {
    defaultThemeColor = rootStyle.getPropertyValue('--theme-color').trim()
  }
  // if (typeof localStorage === 'object') {
  //   const storedThemeColor = useStorage('themeColor').value
  //   if (storedThemeColor) {
  //     defaultThemeColor = storedThemeColor
  //   }
  // }
}

const themeColor = useStorage('themeColor')
if (!themeColor.value && defaultThemeColor) {
  themeColor.value = defaultThemeColor
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
    // localStorage.setItem(cacheKey, tc)
  }, {
    immediate: true
  })
  return themeColor;
}
