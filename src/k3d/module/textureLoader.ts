import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
export default function (url: string, fn: (textrue: any) => void) {
  let loader
  if (/hdr$/i.test(url)) {
    loader = new RGBELoader()
  } else {
    loader = new THREE.TextureLoader()
  }
  loader.load(url, fn)
}
