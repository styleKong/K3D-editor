import * as THREE from 'three'
import WebGL from './module/WebGL'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'

import Stats from 'three/examples/jsm/libs/stats.module.js'

import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

// 后期渲染关键库
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

// shader
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'

import * as camera from './module/Camera'
import * as light from './module/Light'
import * as controls from './module/Controls'
import { textureLoader, glbLoader, throttle } from './module/loader'

import Events from './module/events'
import * as _ from './module/utils'

interface light {
  ambientLight?: THREE.AmbientLight
  directionalLight?: THREE.DirectionalLight
  hemisphereLight?: THREE.HemisphereLight
  pointLight?: THREE.PointLight
  rectAreaLight?: THREE.RectAreaLight
  spotLight?: THREE.SpotLight
}
interface camera {
  orthographicCamera?: THREE.OrthographicCamera
  perspectiveCamera?: THREE.PerspectiveCamera
  stereoCamera?: THREE.StereoCamera
}
interface controls {
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
  oldConfig: { [a: string]: any } = {}
  clock: THREE.Clock | undefined
  stats: Stats | undefined
  render: THREE.WebGLRenderer | undefined
  scene: THREE.Scene | undefined
  camera: camera | undefined
  light: light | undefined
  controls: controls | undefined
  pmremGenerator: THREE.PMREMGenerator | undefined
  skyBox: THREE.Texture | undefined
  mixers: THREE.AnimationMixer[] = []
  mixerActions: { [a: string]: THREE.AnimationClip[] } = {}
  effectComposer: EffectComposer | undefined
  outlinePass: OutlinePass | undefined
  clickObjects: THREE.Object3D<THREE.Event>[] = []

  onprogress: ((e: any) => void) | undefined
  onload: ((e: any) => void) | undefined
  constructor(config: { [a: string]: any } = {}) {
    super()
    if (config.onload) this.onload = config.onload
    if (config.onprogress) this.onprogress = config.onprogress
    this.getDomElement(config.domElement)
    this.InitRender(config.render)
    this.InitScene(config.scene)
    if (_.hasOwnProperty.call(config, 'camera')) this.initCamera(config.camera)
    if (_.hasOwnProperty.call(config, 'light')) this.initLight(config.light)
    if (_.hasOwnProperty.call(config, 'controls')) this.initControls(config.controls)
    if (_.hasOwnProperty.call(config, 'skyBox')) this.initSkyBox(config.skyBox)
    if (_.hasOwnProperty.call(config, 'shadow')) this.initShadow(config.shadow)
    if (_.hasOwnProperty.call(config, 'models')) this.loadMode(config.models)
    if (_.hasOwnProperty.call(config, 'scene') && config.scene.type == 'room')
      this.enterRoomEnvironment()
    this.initComposer()
    this.clock = new THREE.Clock()
    if (config.stats) this.stats = new Stats()
    this.bindEvent()
    this.animate()
    window.addEventListener(
      'resize',
      throttle(() => this.onresize(config.camera))
    )
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
  InitRender(config: { [a: string]: any } = {}) {
    this.render = new THREE.WebGLRenderer(config)
    if (_.hasOwnProperty.call(config, 'outputEncoding'))
      this.render.outputEncoding = config.outputEncoding
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
  InitScene(config: { [a: string]: any }) {
    this.scene = new THREE.Scene()
    if (typeof config.background == 'string' && /\.[a-z]{2}$/.test(config.background)) {
      // 如果背景为图片,默认纹理使用网格的坐标来进行映射
      textureLoader(config.background, (texture: THREE.Texture) => {
        ;(this.scene as THREE.Scene).background = texture
        ;(this.scene as THREE.Scene).environment = texture
      })
    } else if (config.background) {
      // 背景为颜色
      this.scene.background = new THREE.Color(config.background)
    }
    // 背景模糊度
    if (config.backgroundBlurriness) this.scene.backgroundBlurriness = config.backgroundBlurriness
    //  如果场景类型为room 不使用场景贴图
    if (config.type == 'room') return
    // 环境贴图
    if (config.environment)
      textureLoader(config.environment, (texture: THREE.Texture) => {
        ;(this.scene as THREE.Scene).environment = texture
      })
  }
  /**
   * 进入房间环境
   */
  enterRoomEnvironment() {
    this.pmremGenerator = new THREE.PMREMGenerator(this.render as THREE.WebGLRenderer)
    // 将现有的环境贴图保存备用（退出时使用）
    this.oldConfig.environment = (this.scene as THREE.Scene).environment
    ;(this.scene as THREE.Scene).environment = this.pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture
    for (const key in this.light) {
      if (_.hasOwnProperty.call(this.light, key)) {
        ;(this.scene as THREE.Scene).remove(this.light[key])
      }
    }
  }
  /**
   * 退出房间环境
   */
  quitRoomEnvironment() {
    this.scene.environment = this.oldConfig?.environment ?? null
    for (const key in this.light) {
      if (_.hasOwnProperty.call(this.light, key)) {
        this.scene.add(this.light[key])
      }
    }
  }
  /**
   * 初始化摄像机
   */
  initCamera(config: { [a: string]: any }) {
    if (!this.camera) this.camera = {}
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
        if (typeof camera[key] == 'function') {
          const _c = camera[key](config[key])
          this.scene.add(_c)
          Object.defineProperty(this.camera, key, {
            value: _c,
            configurable: true,
            enumerable: true
          })
        }
      }
    }
  }
  // 创建光源
  initLight(config: { [a: string]: any }) {
    if (!this.light) this.light = {}
    for (const key in config) {
      if (_.hasOwnProperty.call(config, key)) {
        if (typeof light[key] == 'function') {
          const _c = light[key](config[key])
          this.scene.add(_c)
          Object.defineProperty(this.light, key, {
            value: _c,
            configurable: true,
            enumerable: true
          })
        }
      }
    }
  }
  // 创建控制器
  initControls(config: { [a: string]: any }) {
    if (!this.controls) this.controls = {}
    for (const key in config) {
      if (_.hasOwnProperty.call(config, key)) {
        if (!config[key].camera)
          config[key].camera = this.camera.perspectiveCamera || this.camera.orthographicCamera
        config[key].domElement = this.render.domElement
        if (typeof controls[key] == 'function') {
          Object.defineProperty(this.controls, key, {
            value: controls[key](config[key]),
            configurable: true,
            enumerable: true
          })
        }
      }
    }
  }
  // 创建天空盒
  initSkyBox(urls: string | string[]) {
    if (typeof urls === 'string' && urls?.length == 1) {
      if (urls?.length == 1) urls = urls[0]
      this.pmremGenerator.compileEquirectangularShader()
      textureLoader(urls, (texture) => {
        this.skyBox = texture
        texture.mapping = THREE.EquirectangularRefractionMapping
        this.scene.background = texture
        // 默认环境贴图，如模型有自己的贴图则使用自己的贴图
        this.scene.environment = texture
      })
    }
  }
  // 创建阴影
  initShadow(config) {
    if (config) config = JSON.parse(JSON.stringify(config))
    for (const key in this.light) {
      if (_.hasOwnProperty.call(this.light, key)) {
        // 有阴影的灯光执行
        if (_.hasOwnProperty.call(this.light[key], 'shadow')) {
          if (_.hasOwnProperty.call(config, 'castShadow')) {
            this.render.shadowMap.enabled = config.castShadow
            this.light[key].castShadow = config.castShadow
            delete config.castShadow
          }
          if (_.hasOwnProperty.call(config, 'type')) {
            this.render.shadowMap.type = config.type
          }
          if (!config.camera) config.camera = {}
          if (!config.sharpness) config.sharpness = 2
          if (!config.near) config.near = 0.1
          if (!config.far) config.far = 40
          config.camera.top = config.sharpness
          config.camera.bottom = -config.sharpness
          config.camera.left = -config.sharpness
          config.camera.right = config.sharpness
          config.camera.far = config.far
          config.camera.near = config.near
          delete config.sharpness
          delete config.near
          delete config.far
          _.setProp(config, this.light[key].shadow)
        }
      }
    }
  }
  loadMode(urls: string | string[]) {
    const load = (url) => {
      return new Promise((reslove, reject) => {
        try {
          glbLoader(url, (mode, mixer, mixerActions) => {
            if (mixer) this.mixers.push(mixer)
            if (mixerActions) this.mixerActions[mode.name] = mixerActions
            this.scene.add(mode)
            mode.traverse((child: any) => {
              if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
              }
            })
            if (typeof this.onprogress === 'function') this.onprogress(mode)
            reslove(mode)
          })
        } catch (err) {
          reject(err)
        }
      })
    }
    if (typeof urls == 'string') {
      load(urls).then(() => {
        if (typeof this.onload === 'function') this.onload(this)
      })
    } else {
      let loads = []
      for (const iterator of urls) {
        loads.push(load(iterator))
      }
      Promise.all(loads).then(() => {
        if (typeof this.onload === 'function') this.onload(this)
      })
    }
  }
  /**
   * 后期
   */
  initComposer() {
    this.effectComposer = new EffectComposer(this.render)
    this.effectComposer.addPass(
      new RenderPass(this.scene, this.camera.perspectiveCamera || this.camera.orthographicCamera)
    )
  }
  /**
   * 描边效果
   */
  initOutLine(config) {
    this.outlinePass = new OutlinePass(
      new THREE.Vector2(this.width, this.height),
      this.scene,
      this.camera.perspectiveCamera
    )
    for (const key in config) {
      if (_.hasOwnProperty.call(config, key) && _.hasOwnProperty.call(this.outlinePass, key)) {
        if (Array.isArray(config[key])) this.outlinePass[key].set(...config[key])
        else if (key == 'color')
          this.outlinePass.visibleEdgeColor.set(config.color) // 设置显示的颜色
        else this.outlinePass[key] = config[key]
      }
    }
    this.outlinePass.hiddenEdgeColor.set('white') // 设置显示的颜色
    this.effectComposer.addPass(this.outlinePass)
  }

  /**
   * 点击拾取
   */
  bindEvent() {
    // 模拟点击事件
    this.render.domElement.onmousedown = () => {
      // 当按下,绑定鼠标放开事件
      this.render.domElement.onmouseup = (event: MouseEvent) => {
        if (this.camera?.perspectiveCamera)
          this.emit({
            type: 'click',
            target: this.getSelectObject(event)
          })
      }
      // 当按下时间超过200ms,解绑鼠标放开事件
      let timer = setTimeout(() => {
        clearTimeout(timer)
        this.render.domElement.onmouseup = null
      }, 200)
    }
    this.render.domElement.addEventListener(
      'pointermove',
      throttle((event) => {
        if (this.camera?.perspectiveCamera) {
          let mode = this.getSelectObject(event)
          this.emit({
            type: 'hover',
            target: mode
          })
          if (mode && this.outlinePass) this.outlinePass.selectedObjects = [mode.object]
        }
      }, 200)
    )
  }
  getSelectObject(event): THREE.Intersection<THREE.Object3D<THREE.Event>> {
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(pointer, this.camera.perspectiveCamera)
    // 计算物体和射线的焦点
    const intersects = raycaster.intersectObjects(this.clickObjects)
    return intersects[0]
  }

  /**
   * 窗口变化执行，可被重写
   * @param config 相机的默认参数
   */
  onresize(config) {
    this.width = this.domElement?.clientWidth || window.innerWidth
    this.height = this.domElement?.clientHeight || window.innerHeight
    if (!this.camera) return
    if (this.camera.orthographicCamera) {
      const {
        left = this.width / -2,
        right = this.width / 2,
        top = this.height / 2,
        bottom = this.height / -2
      } = config.orthographicCamera
      this.camera.orthographicCamera.left = left
      this.camera.orthographicCamera.right = right
      this.camera.orthographicCamera.top = top
      this.camera.orthographicCamera.bottom = bottom
      this.camera.orthographicCamera.updateProjectionMatrix()
    }
    if (this.camera.perspectiveCamera) {
      // 当相机是透视摄像机
      const { aspect = this.width / this.height } = config.perspectiveCamera
      this.camera.perspectiveCamera.aspect = aspect
      this.camera.perspectiveCamera.updateProjectionMatrix()
    }
    if (this.outlinePass) this.outlinePass.resolution = new THREE.Vector2(this.width, this.height)
    if (this.render) this.render.setSize(this.width, this.height)
  }
  /**
   * 销毁
   * @param target
   */
  dispose(target) {
    if (target.dispose) target.dispose()
    target.removeFromParent()
  }
  // 动画循环
  animate() {
    requestAnimationFrame(() => this.animate())
    if (this.stats) this.stats.update()
    // 使用后期处理的render方法
    this.effectComposer.render()
    for (let key in this.controls) {
      if (_.hasOwnProperty.call(this.controls, key)) {
        this.controls[key].update()
      }
    }
    for (const iterator of this.mixers) {
      const mixerUpdateDelta = this.clock.getDelta()
      iterator.update(mixerUpdateDelta)
    }
    this.emit('loop')
  }
}
