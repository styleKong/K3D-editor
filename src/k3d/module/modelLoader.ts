import * as THREE from 'three'
export default async function (
  file: string | File,
  onload: (
    mode: THREE.Mesh,
    mixer?: THREE.AnimationMixer,
    mixerActions?: THREE.AnimationAction[]
  ) => void
) {
  if (!file) return
  const isUrl = typeof file == 'string'
  const extension = (isUrl ? file : file.name).split('.').pop()?.toLowerCase()
  let reader
  if (!isUrl) {
    reader = new FileReader()
  }
  let readerBack, loader: any
  switch (extension) {
    case 'gltf':
    case 'glb': {
      const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js')
      const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js')
      loader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/examples/jsm/libs/draco/')
      loader.setDRACOLoader(dracoLoader)
      if (!isUrl)
        readerBack = (ev: any) => {
          const contents = ev.target?.result
          loader.parse(contents as ArrayBufferLike, '', glbBack)
        }
      break
    }
    case 'obj': {
      const { OBJLoader } = await import('three/addons/loaders/OBJLoader.js')
      loader = new OBJLoader()
      if (!isUrl)
        readerBack = (ev: any) => {
          const contents = ev.target?.result
          onload(loader.parse(contents as string))
        }
      break
    }
    case 'pcd': {
      const { PCDLoader } = await import('three/addons/loaders/PCDLoader.js')
      loader = new PCDLoader()
      if (!isUrl)
        readerBack = (ev: any) => {
          const contents = ev.target?.result
          onload(loader.parse(contents as string))
        }
      break
    }
  }
  // 如果没有找到对应后缀的加载器，返回
  if (!loader || !readerBack) return
  // glb 和 gltf格式的模型加载回调
  function glbBack(gltf: { [a: string]: any }) {
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
    onload(mode, mixer, mixerActions)
  }
  if (isUrl) loader.load(file, ['gltf', 'glb'].includes(extension as string) ? glbBack : onload)
  else {
    reader?.addEventListener('load', readerBack, false)
    reader?.readAsArrayBuffer(file)
  }
}
