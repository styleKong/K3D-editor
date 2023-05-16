import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * 加载纹理
 * @param url
 * @param fn
 */
export const textureLoader = function (url, fn) {
  let loader
  if (/hdr$/i.test(url)) {
    loader = new RGBELoader()
  } else {
    loader = new THREE.TextureLoader()
  }
  loader.load(url, fn)
}
/**
 * 加载模型
 * @param url
 * @param fn
 */
export const glbLoader = function (url, fn) {
  if (/\.pcd$/i.test(url)) {
    const loader = new PCDLoader()
    loader.load(url, fn)
  } else if (/\.obj$/i.test(url)) {
    const loader = new OBJLoader()
    loader.load(url, fn)
  } else if (/\.(glb|gltf)$/i.test(url)) {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./js/libs/draco/gltf/')
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    loader.load(
      url,
      (gltf) => {
        const mode = gltf.scene
        const mixer = new THREE.AnimationMixer(mode)
        const mixerActions = []
        // 收集动画
        if (gltf.animations && gltf?.animations?.length > 0) {
          for (let i = 0; i < gltf.animations.length; i++) {
            mixerActions.push(mixer.clipAction(gltf.animations[i]))
          }
          // 将模型动画剪辑列表添加到模型，以便使用
          Object.defineProperty(mode, 'mixerActions', { value: mixerActions, enumerable: true })
        }
        fn(mode, mixer, mixerActions)
      },
      () => {},
      (err) => {
        console.log(err)
      }
    )
  }
}

/**
 * 节流函数，第一次和最后一次必执行，中间间隔执行
 * @returns
 */
export function throttle(fn, delay = 500) {
  let timer = null
  let flag = false
  return function (...arg) {
    if (timer) return (flag = true)
    fn.apply(this, arg)
    timer = setTimeout(() => {
      clearTimeout(timer)
      timer = null
      if (flag) {
        fn.apply(this, arg)
      }
    }, delay)
  }
}
