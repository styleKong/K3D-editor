<script setup lang="ts">
import { onMounted, ref, reactive, provide } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import kHeader from './components/k-header.vue'
import kAsideScene from './components/k-aside-scene.vue'
import kAsideProject from './components/k-aside-project.vue'
import Editor from './editor'

import { selectFile } from './editor/utils'
import { glbLoader } from './k3d/module/loader'
/**
 * 侧边栏菜单显示
 */
const asideShow = ref(false)
const canvas3d = ref()
let editor: Record<any, any>
onMounted(() => {
  editor = reactive(
    new Editor({
      domElement: canvas3d.value,
      render: {
        antialias: true
      },
      scene: {
        background: 0xbfe3dd
      },
      light: {
        directionalLight: {
          color: '#fffffff'
        }
      },
      camera: {
        perspectiveCamera: {
          position: [5, 2, 8],
          target: [0, 1, 0],
          fov: 40,
          near: 1,
          far: 500
        }
      },
      stats: true,
      // models: ['./models/gltf/LittlestTokyo.glb'],
      controls: {
        orbitControls: {
          target: [0, 0.5, 0],
          enablePan: false,
          enableDamping: true
        }
      }
    })
  )
  console.log(editor)
})
provide('creatFile', () => {
  editor.render.domElement.remove()
  editor = reactive(
    new Editor({
      domElement: canvas3d.value
    })
  )
})
provide(
  'importMode',
  selectFile((event: Event) => {
    const file = event.target && (event.target as any).files[0]
    let reader = new FileReader()
    //将上传的文件读取成text
    reader.onload = function (ev) {
      glbLoader(ev.target.result, (gltf) => {
        console.log('gltf', gltf)
      })
    }
    reader.readAsArrayBuffer(file)
  })
)
provide('exportOption', () => {})
provide('creatLight', (ev: string) => {
  console.log(ev)
})
provide('creatCamera', (ev: string) => {
  console.log(ev)
})
provide('creatControls', (ev: string) => {
  console.log(ev)
})
</script>

<template>
  <div class="container">
    <k-header :show="asideShow" @update="asideShow = $event"></k-header>
    <main class="main" ref="canvas3d"></main>
    <aside :class="{ aside: true, show: asideShow }">
      <el-tabs class="tabs" type="border-card">
        <el-tab-pane class="tabs-label" label="场景">
          <k-aside-scene></k-aside-scene>
        </el-tab-pane>
        <el-tab-pane class="tabs-label" label="项目">
          <k-aside-project></k-aside-project>
        </el-tab-pane>
        <el-tab-pane class="tabs-label" label="设置"> </el-tab-pane>
      </el-tabs>
      <el-icon class="icon" :size="24" color="#999999" @click="asideShow = !asideShow">
        <i-ep-d-arrow-right />
      </el-icon>
    </aside>
  </div>
</template>

<style lang="scss" scoped>
.container {
  height: 100vh;
  .main {
    height: 100vh;
    width: 100%;
    padding: 0;
  }
  .aside {
    width: 300px;
    height: calc(100vh - 46px);
    top: 41px;
    right: 5px;
    position: fixed;
    transform: translateX(calc(100% + 5px));
    transition: transform 0.5s;
    z-index: 99;
    .icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%) rotate(180deg);
      right: 100%;
      transition: transform 0.3s;
    }
    &.show {
      transform: translateX(0);
      .icon {
        transform: translateY(-50%);
      }
    }
    :deep(.el-tabs__content) {
      padding: 10px;
    }
    .tabs {
      margin: 5px 5px 5px 0;
      height: calc(100% - 10px);
      .tabs-label {
        height: 100%;
      }
    }
  }
}
</style>
