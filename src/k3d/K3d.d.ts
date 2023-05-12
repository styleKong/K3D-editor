import { Camera, Object3D, WebGLRendererParameters, ColorSpace } from 'three'
export type render = WebGLRendererParameters & {
  /**
   * 用于输出到HTMLCanvasElement的颜色空间。支持的值有
   * {@link SRGBColorSpace} and {@link LinearSRGBColorSpace}.
   * @default THREE.SRGBColorSpace.
   */
  outputColorSpace?: ColorSpace
}
export type scene = {
  /**
   * 场景背景类型，支持的值有
   * color 和 texture 和 equirect
   * @default color
   */
  backgroundType?: string
  /**
   * 背景颜色或者背景纹理图片,默认为null
   */
  background?: string
  /**
   * 背景模糊度 取值范围
   * 0 至 1
   * @default 0
   */
  backgroundBlurriness?: number
  /**
   * 场环境贴图类型，支持的值有
   * equirect 和 modelviewer
   * @default null
   */
  environmentType?: string
  /**
   * 环境贴图 若不为空则该纹理贴图将会被设为场景中所有物理材质的环境贴图；否则背景为纹理时，使用背景纹理
   */
  environment?: string
}
export type orthographicCamera = {
  /**
   * 摄像机视锥体近端面
   */
  near?: number
  /**
   * 摄像机视锥体远端面
   */
  far?: number
  /**
   * 获取或者设置摄像机的缩放倍数
   */
  zoom?: number
}
export type perspectiveCamera = orthographicCamera & {
  fov?: number // 摄像机视锥体垂直视野角度
  filmGauge?: number // 胶片尺寸
  filmOffset?: number // 水平偏离中心偏移量
  focus?: number // 用于立体视觉和景深效果的物体的距离
}
export type stereoCamera = perspectiveCamera & {
  eyeSep?: number
  cameraL?: perspectiveCamera
  cameraR?: perspectiveCamera
}
export type camera = {
  orthographicCamera?: orthographicCamera
  perspectiveCamera?: perspectiveCamera
  stereoCamera?: stereoCamera
}
export type ambientLight = {
  color?: string | number //颜色
  intensity?: number // 强度
}
export type directionalLight = ambientLight & {
  position?: [number, number, number] // 光源位置
  target?: [number, number, number] // 目标位置
}
export type hemisphereLight = {
  color?: string | number // 天空颜色
  groundColor?: string | number // 地面颜色
}
export type pointLight = ambientLight & {
  distance?: number // 这个距离表示从光源到光照强度为0的位置
  decay?: number //沿着光照距离的衰退量
  power?: number //光功率
  position?: [number, number, number] // 光源位置
}
export type rectAreaLight = ambientLight & {
  width?: number
  height?: number
  position?: [number, number, number] // 光源位置
}
export type spotLight = pointLight &
  ambientLight & {
    angle?: number //光线散射角度
    penumbra?: number // 聚光锥的半影衰减百分比
  }
export type light = {
  ambientLight?: ambientLight
  directionalLight?: directionalLight
  hemisphereLight?: hemisphereLight
  pointLight?: pointLight
  rectAreaLight?: rectAreaLight
  spotLight?: spotLight
}
export type orbitControls = {
  camera: Camera
  domElement: HTMLElement
  enabled?: boolean
}
export type dragControls = orbitControls & {
  objects: Object3D[]
}
export type firstPersonControls = orbitControls & {
  activeLook?: boolean
  autoForward?: boolean
  constrainVertical?: boolean
  heightCoef?: number
  heightMax?: number
  heightMin?: number
  heightSpeed?: boolean
  lookVertical?: boolean
  lookSpeed?: number
  movementSpeed?: number
  verticalMax?: number
  verticalMin?: number
}
export type flyControls = orbitControls & {
  autoForward?: boolean
  dragToLook?: boolean
  movementSpeed?: number
  rollSpeed?: number
}
export type pointerLockControls = orbitControls & {
  isLocked?: boolean
  maxPolarAngle?: number
  minPolarAngle?: number
}
export type mouseButtons = {
  LEFT: number
  MIDDLE: number
  RIGHT: number
}
export type trackballControls = orbitControls & {
  staticMoving?: boolean
  dynamicDampingFactor?: number
  maxDistance?: number
  minDistance?: number
  maxZoom?: number
  minZoom?: number
  keys?: string[]
  mouseButtons?: mouseButtons
  noPan?: boolean
  noRotate?: boolean
  noZoom?: boolean
  panSpeed?: number
  rotateSpeed?: number
  zoomSpeed?: number
}
export type transformControls = orbitControls & {
  axis?: string
  mode?: 'translate' | 'rotate' | 'scale'
  rotationSnap?: number
  showX?: boolean
  showY?: boolean
  showZ?: boolean
  size?: number
  space?: 'world' | 'local'
  translationSnap?: number
}
export type controls = {
  orbitControls?: orbitControls
  firstPersonControls?: firstPersonControls
  flyControls?: flyControls
  pointerLockControls?: pointerLockControls
  trackballControls?: trackballControls
  transformControls?: transformControls
}
export type K3d = {
  domElement: Element
  render?: render
  scene?: scene
  /**
   * 相机列表 请务必在
   * {@link camera}
   * 中选至少一个相机
   * @default null
   */
  camera?: camera
  /**
   * 灯光列表
   *
   */
  light?: light
  controls?: controls
  skyBox?: string | string[]
}
