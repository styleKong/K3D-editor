<script setup lang="ts">
import { onMounted, ref, reactive, provide } from 'vue'
import kHeader from './components/k-header.vue'
import kAsideScene from './components/k-aside-scene.vue'
import kAsideProject from './components/k-aside-project.vue'
import Editor from './editor'
const canvas3d = ref()
let editor: Record<any, any>
onMounted(() => {
  editor = reactive(
    new Editor({
      domElement: canvas3d.value
    })
  )
})
provide('creatFile', () => {
  editor.render.domElement.remove()
  editor = reactive(
    new Editor({
      domElement: canvas3d.value
    })
  )
})
provide('importMode', () => {})
provide('exportOption', () => {})
provide('creatLight', (ev: string) => {})
provide('creatCamera', (ev: string) => {})
provide('creatControls', (ev: string) => {})
</script>

<template>
  <div class="container">
    <k-header></k-header>
    <main class="main" ref="canvas3d"></main>
    <aside class="aside">
      <el-tabs class="tabs" type="border-card">
        <el-tab-pane class="tabs-label" label="场景">
          <k-aside-scene></k-aside-scene>
        </el-tab-pane>
        <el-tab-pane class="tabs-label" label="项目">
          <k-aside-project></k-aside-project>
        </el-tab-pane>
        <el-tab-pane class="tabs-label" label="设置"> </el-tab-pane>
      </el-tabs>
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
    transition: transform 0.3s;
    z-index: 99;
    &::before {
      content: '';
      display: block;
      width: 120%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      z-index: -1;
      user-select: none;
    }
    &:hover {
      transform: translateX(0);
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
