import K3D from '@/k3d'
import * as THREE from 'three'
export default class extends K3D {
  constructor(config: any) {
    super(config)
    this.initGeo()
  }
  initGeo() {
    const helper = new THREE.GridHelper(100, 20)
    ;(this.scene as THREE.Scene).add(helper)
  }
  setScene(config) {}
  setRender() {}
}
