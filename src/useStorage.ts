import { ref, watch } from 'vue'
import type { Ref } from 'vue'

const CacheNs = '1:nblog:'

const CacheMap: Record<string, Ref<any>> = {}

export default function (key: string, val?: any) {
  const name = CacheNs + key
  if (arguments.length === 1) {
    let value = localStorage.getItem(name)
    if (value !== null) {
      value = JSON.parse(value)
    }
    if (CacheMap[key]) {
      CacheMap[key].value = value
    } else {
      CacheMap[key] = ref(value)
    }
    return CacheMap[key]
  }
  if (CacheMap[key]) {
    CacheMap[key].value = val
    return CacheMap[key]
  }
  const valRef: Ref<any> = ref(val)
  watch(valRef, v => {
    if (v === null) {
      localStorage.removeItem(name)
    } else {
      localStorage.setItem(name, JSON.stringify(v))
    }
  }, {
    immediate: true
  })
  CacheMap[key] = valRef
  return valRef
}
