import { watch } from "vue"
import type { Ref } from 'vue'
import useStorage from './useStorage'

const varsMap: Record<string, Ref<string>> = {}

export default function (name: string, value?: string) {
  if (varsMap[name]) return varsMap[name]
  if (typeof document === 'object') {
    const root = document.documentElement
    if (value) {
      root.style.setProperty('--' + name, value)
    }
  }
  const cssVar = useStorage('--' + name)
  watch(cssVar, (val) => {
    if (typeof document === 'object' && val) {
      const root = document.documentElement
      root.style.setProperty('--' + name, val)
    }
  }, {
    immediate: true
  })
  varsMap[name] = cssVar
  return cssVar
}
