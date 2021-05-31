import { ref, watch } from 'vue'
import type { Ref } from 'vue'

const CacheNs = 'tingyuan.me:nblog:'

const CacheMap: Record<string, Ref<any>> = {}

export default function (key: string, val?: any) {
  if (typeof localStorage !== 'object') return ref(null)
  const name = CacheNs + key
  if (!CacheMap[key]) {
    const _val = localStorage.getItem(name)
    CacheMap[key] = ref(_val === null ? null : JSON.parse(_val))
    watch(CacheMap[key], v => {
      if (v === null) {
        localStorage.removeItem(name)
      } else if (v !== undefined) {
        localStorage.setItem(name, JSON.stringify(v))
      }
    })
  }
  const valRef = CacheMap[key]

  if (val === undefined) {
    val = localStorage.getItem(name)
    if (val !== null) {
      val = JSON.parse(val)
    }
    return val
  }
  const currentVal = localStorage.getItem(name)
  if (currentVal === null || val === null) {
    valRef.value = val
  }
  return valRef
}
