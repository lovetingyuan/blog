import { ref, watch } from 'vue'
import type { Ref } from 'vue'

const CacheNs = '1:nblog:'

const CacheMap: Record<string, Ref<any>> = {}

export default function (key: string, val?: any) {
  if (typeof localStorage !== 'object') return ref(null)
  const name = CacheNs + key
  if (!CacheMap[key]) {
    CacheMap[key] = ref(null)
    watch(CacheMap[key], v => {
      if (v === null) {
        localStorage.removeItem(name)
      } else {
        localStorage.setItem(name, JSON.stringify(v))
      }
    })
  }
  const valRef = CacheMap[key]

  if (arguments.length === 1) {
    val = localStorage.getItem(name)
    if (val !== null) {
      val = JSON.parse(val)
    }
  }
  valRef.value = val

  return valRef
}
