import * as THREE from 'three'
export const hasOwnProperty = Object.prototype.hasOwnProperty
export const isObject = function (obj: any) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
export const setProp = function (config: { [a: string]: any }, target: { [a: string]: any }) {
  for (const key in config) {
    if (hasOwnProperty.call(config, key) && hasOwnProperty.call(target, key)) {
      if (Array.isArray(config[key])) target[key].set(...config[key])
      else if (isObject(config[key])) setProp(config[key], target[key])
      else if (/color/i.test(key) || key == 'background') target[key] = new THREE.Color(config[key])
      else target[key] = config[key]
    }
  }
}
/**
 * 监听对象更改
 * @param obj 被监听对象
 * @param fn 更改后执行的方法
 * @returns Proxy
 */
export const reactive = function (
  obj: { [a: string]: any },
  fn: (obj: { [a: string]: any }) => void
) {
  return new Proxy(obj, {
    get(target, prop: string, receiver): any {
      if (isObject(target[prop])) return reactive(target[prop], fn)
      return target[prop]
    },
    set(target, prop: string, value, receiver): boolean {
      target[prop] = value
      fn(target)
      return true
    }
  })
}
/**
 * 节流函数，第一次和最后一次必执行，中间间隔执行
 * @returns
 */
export function throttle(fn: (...arg: any[]) => void, delay = 500) {
  let timer: number | null = null
  let flag = false
  return function (this: any, ...arg: any[]) {
    if (timer) return (flag = true)
    fn.apply(this, arg)
    timer = setTimeout(() => {
      clearTimeout(timer as number)
      timer = null
      if (flag) {
        fn.apply(this, arg)
      }
    }, delay)
  }
}
