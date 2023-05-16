import * as THREE from 'three'

export default async function (file: string | File, onload: (a: any) => void) {
  if (!file) return
  const isUrl = typeof file == 'string'
  const extension = (isUrl ? file : file.name).split('.').pop()?.toLowerCase()
  let reader
  if (isUrl) {
    reader = new FileReader()
  }
  switch (extension) {
    case '3dm':
      {
        const { Rhino3dmLoader } = await import('three/addons/loaders/3DMLoader.js')
        const loader = new Rhino3dmLoader()
        loader.setLibraryPath('./jsm/libs/rhino3dm/')
        if (isUrl) loader.load(file, onload)
        else {
          reader?.addEventListener(
            'load',
            (ev) => {
              const contents = ev.target?.result
              loader.parse(contents as ArrayBufferLike, onload)
            },
            false
          )
          reader?.readAsArrayBuffer(file)
        }
      }
      break
    case '3ds':
      {
        const { TDSLoader } = await import('three/addons/loaders/TDSLoader.js')
        const loader = new TDSLoader()
        if (isUrl) loader.load(file, onload)
        else {
          reader?.addEventListener(
            'load',
            (ev) => {
              const contents = ev.target?.result
              onload(loader.parse(contents as ArrayBufferLike, ''))
            },
            false
          )
          reader?.readAsArrayBuffer(file)
        }
      }
      break
  }
}
