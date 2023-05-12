import * as THREE from 'three';
export const hasOwnProperty = Object.prototype.hasOwnProperty;
export const isObject = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
};
export const setProp = function (config, target) {
  for (const key in config) {
    if (hasOwnProperty.call(config, key) && hasOwnProperty.call(target, key)) {
      if (Array.isArray(config[key])) target[key].set(...config[key]);
      else if (isObject(config[key])) setProp(config[key], target[key]);
      else if (/color/i.test(key) || key == 'background') target[key] = new THREE.Color(config[key]);
      else target[key] = config[key];
    }
  }
};
/**
 * 监听对象更改
 * @param obj 被监听对象
 * @param fn 更改后执行的方法
 * @returns Proxy
 */
export const reactive = function (obj, fn) {
  return new Proxy(obj, {
    get(target, prop, receiver): any {
      if (isObject(target[prop])) return reactive(target[prop], fn);
      return target[prop];
    },
    set(target, prop, value, receiver): boolean {
      target[prop] = value;
      fn(target);
      return true;
    },
  });
};
