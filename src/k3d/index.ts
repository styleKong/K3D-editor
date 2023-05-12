import * as THREE from 'three'
import WebGL from './module/WebGL'

import Events from './module/events'

import type { K3d, camera, render, scene } from './K3d'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import type { DragControls } from 'three/examples/jsm/controls/DragControls.js'
import type { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'
import type { FlyControls } from 'three/examples/jsm/controls/FlyControls.js'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import type { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import type { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

import * as cameras from './module/Camera'
import * as lights from './module/Light'
import * as controls from './module/Controls'
import { textureLoader, glbLoader, throttle } from './module/loader'
import * as _ from './module/utils'
type K3Dobject = { [a: string]: any }
interface K3Dlight {
  ambientLight?: THREE.AmbientLight
  directionalLight?: THREE.DirectionalLight
  hemisphereLight?: THREE.HemisphereLight
  pointLight?: THREE.PointLight
  rectAreaLight?: THREE.RectAreaLight
  spotLight?: THREE.SpotLight
}
interface K3Dcamera {
  orthographicCamera?: THREE.OrthographicCamera
  perspectiveCamera?: THREE.PerspectiveCamera
  stereoCamera?: THREE.StereoCamera
}
interface K3Dcontrols {
  dragControls?: DragControls
  firstPersonControls?: FirstPersonControls
  flyControls?: FlyControls
  orbitControls?: OrbitControls
  pointerLockControls?: PointerLockControls
  transformControls?: TransformControls
  trackballControls?: TrackballControls
}

export default class extends Events {
  domElement: Element | null = null
  width: number = 0
  height: number = 0
  config: { [a: string]: any } = {}
  clock: THREE.Clock | undefined
  stats: Stats | undefined
  render: THREE.WebGLRenderer | undefined
  scene: THREE.Scene | undefined
  camera: K3Dcamera | undefined
  light: K3Dlight | undefined
  controls: K3Dcontrols | undefined
  pmremGenerator: THREE.PMREMGenerator | undefined
  constructor(config: K3d) {
    super()
    this.config = config
    this.getDomElement(config.domElement)
    this.clock = new THREE.Clock()
    this.InitRender(config.render)
    this.InitScene(config.scene)
    if (config.camera) this.initCamera(config.camera)
  }
  /**
   *  获取放置场景dom元素,默认body
   *  @param domElement class|id|dom
   **/
  getDomElement(domElement: string | Element) {
    if (domElement) {
      if (typeof domElement === 'string') this.domElement = document.querySelector(domElement)
      else this.domElement = domElement
    }
    if (!this.domElement) this.domElement = document.body

    // 验证是否支持WebGL
    if (!WebGL.isWebGLAvailable()) {
      const warning = WebGL.getWebGLErrorMessage()
      this.domElement.appendChild(warning)
      return
    }
    this.width = this.domElement?.clientWidth || window.innerWidth
    this.height = this.domElement?.clientHeight || window.innerHeight
  }
  /**
   * 初始化渲染器
   */
  InitRender(config: render = {}) {
    this.render = new THREE.WebGLRenderer(config)
    if (_.hasOwnProperty.call(config, 'outputEncoding'))
      this.render.outputColorSpace = config.outputColorSpace as THREE.ColorSpace
    this.render.setSize(
      (this.width * window.devicePixelRatio) | 0,
      (this.height * window.devicePixelRatio) | 0,
      false
    )
    ;(this.domElement as Element).appendChild(this.render.domElement)
  }
  /**
   * 初始化场景
   */
  InitScene(config: scene = {}) {
    this.scene = new THREE.Scene()
    if (config.background) {
      if (config.backgroundType == 'color') {
        // 背景为颜色
        this.scene.background = new THREE.Color(config.background)
      } else {
        // 如果背景为图片,默认纹理使用网格的坐标来进行映射
        textureLoader(config.background, (texture: THREE.Texture) => {
          if (config.backgroundType == 'equirect') {
            texture.mapping = THREE.EquirectangularReflectionMapping
          }
          ;(this.scene as THREE.Scene).background = texture
          ;(this.scene as THREE.Scene).environment = texture
        })
      }
    }
    // 背景模糊度
    if (config.backgroundBlurriness) this.scene.backgroundBlurriness = config.backgroundBlurriness
    // 环境贴图
    if (config.environmentType == 'equirect') {
      if (!config.environment) return
      textureLoader(config.environment, (texture: THREE.Texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        ;(this.scene as THREE.Scene).environment = texture
      })
    } else if (config.environmentType == 'modeViewer') {
      // 使用模型纹理
      this.pmremGenerator = new THREE.PMREMGenerator(this.render as THREE.WebGLRenderer)
      ;(this.scene as THREE.Scene).environment = this.pmremGenerator.fromScene(
        new RoomEnvironment(),
        0.04
      ).texture
    }
  }
  /**
   * 初始化摄像机
   */
  initCamera(config: K3Dobject) {
    if (!this.camera) this.camera = {}
    if (Object.keys(config).length == 0) return
    for (const key in config) {
      if (_.hasOwnProperty.call(config, key)) {
        if (key == 'perspectiveCamera') {
          if (!config[key].aspect) config[key].aspect = this.width / this.height
        }
        if (key == 'orthographicCamera') {
          if (!config[key].left) config[key].left = this.width / -2
          if (!config[key].right) config[key].right = this.width / 2
          if (!config[key].top) config[key].top = this.height / 2
          if (!config[key].bottom) config[key].bottom = this.height / -2
        }
        if (typeof (cameras as K3Dobject)[key] == 'function') {
          const _c = (cameras as K3Dobject)[key](config[key])
          ;(this.scene as THREE.Scene).add(_c)
          ;(this.camera as K3Dobject)[key] = _c
        }
      }
    }
  }
}
