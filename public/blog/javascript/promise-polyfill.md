[meta]: <javascript> (title: 'Promise的polyfill实现', keywords: 'promise, polyfill', date: '2020-8-25')

## Promise的polyfill实现

```javascript
// 用来resolve一个值，这个值可能是pomise,thenable或者其他
function resolveValue (promise, value, resolve, reject) {
  if (promise === value) { // 不能resolve自身
    return reject(new TypeError('Can not resolve or return the current promise.'))
  }
  let called = false // 所有的回调只能调用一次
  if (value === null || (typeof value !== 'object' && typeof value !== 'function')) {
    return resolve(value)
  }
  let then // thenable可能是对象或者函数，它的then只能读取一次并且需要捕获可能的错误
  try {
    then = value.then
  } catch (err) {
    return reject(err)
  }
  if (typeof then !== 'function') return resolve(value)
  try { // 处理thenable，当然promise本身也是thenable
    then.call(value, val => {
      if (called) return
      called = true
      resolveValue(promise, val, resolve, reject) // 需要递归resolve，因为可能多次返回thenable
    }, err => {
      if (called) return
      called = true
      reject(err) // reject就直接调用即可
    })
  } catch (err) {
    if (!called) reject(err)
  }
}
class Promise {
  constructor (callback) {
    if (!(this instanceof Promise)) throw new TypeError('Promise cannot be invoked without "new".')
    if (typeof callback !== 'function') throw new TypeError('Promise callback is not a function.')
    this._status = 'pending'
    this._value = undefined
    this._callbacks = { resolved: [], rejected: [] }
    const setStatus = (status, val) => {
      this._value = val
      this._status = status
      this._callbacks[status].forEach(cb => cb(val))
    }
    let settled = false
    const onResolve = val => {
      if (settled) return
      settled = true
      resolveValue(this, val, val => setStatus('resolved', val), err => setStatus('rejected', err))
    }
    const onReject = err => {
      if (settled) return
      settled = true
      setStatus('rejected', err)
    }
    try {
      callback(onResolve, onReject)
    } catch (err) {
      onReject(err)
    }
  }
  then (onResolve, onReject) {
    const handleCallback = (promise, status, resolve, reject) => {
      const callback = status === 'resolved' ? onResolve : onReject
      const settle = status === 'resolved' ? resolve : reject
      setTimeout(() => {
        try {
          if (typeof callback === 'function') {
            resolveValue(promise, callback(this._value), resolve, reject)
          } else {
            settle(this._value)
          }
        } catch (err) {
          reject(err)
        }
      })
    }
    let promise // then必须返回一个新的promise
    if (this._status === 'pending') { // 如果是异步执行需要先把回调存储在队列中
      promise = new Promise((resolve, reject) => {
        this._callbacks.resolved.push(() => handleCallback(promise, 'resolved', resolve, reject))
        this._callbacks.rejected.push(() => handleCallback(promise, 'rejected', resolve, reject))
      })
    } else {
      const { resolve, reject } = new function () {
        promise = new Promise((...args) => [this.resolve, this.reject] = args)
      }
      handleCallback(promise, this._status, resolve, reject)
    }
    return promise
  }
}

```

-----

以上是对`Promise`的简单实现，实际上Promise/A+规范只要求实例对象必须要有then方法，ES规范中还规定了一些静态和实例方法，这些都可以依赖Promise核心来实现



