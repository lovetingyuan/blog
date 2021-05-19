import { ref, watch } from "vue"
import type { Ref } from 'vue'

const varsMap: Record<string, Ref<string>> = {}

export default function (name: string, value?: string) {
  if (varsMap[name]) return varsMap[name]
  if (typeof document === 'object') {
    const root = document.documentElement
    // const rootStyle = window.getComputedStyle(root)
    if (value) {
      // const currentValue = rootStyle.getPropertyValue('--' + name)
      root.style.setProperty('--' + name, value)
    }
  }
  const cssVar = ref('')
  watch(cssVar, (val) => {
    if (typeof document === 'object') {
      const root = document.documentElement
      root.style.setProperty('--' + name, val)
    }
  })
  varsMap[name] = cssVar
  return cssVar
}
