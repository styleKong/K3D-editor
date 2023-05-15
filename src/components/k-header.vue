<script lang="ts" setup>
// import { DArrowRight } from '@element-plus/icons-vue'
import { inject, reactive, ref } from 'vue'
/**
 * 控制显示
 */
const props = defineProps({
  show: Boolean
})

const menuList = reactive([
  {
    name: '文件',
    command: 'file',
    children: [
      {
        name: '新建',
        command: 'new'
      },
      {
        name: '导入模型',
        command: 'mode'
      },
      {
        name: '导出配置项',
        command: 'option'
      }
    ]
  },

  {
    name: '添加',
    command: 'add',
    children: [
      {
        name: '组(group)',
        command: 'group'
      },
      {
        name: '灯光',
        command: 'light',
        children: [
          {
            name: '环境光',
            command: 'AmbientLight'
          },
          {
            name: '平行光',
            command: 'DirectionalLight'
          },
          {
            name: '半球光',
            command: 'HemisphereLight'
          },
          {
            name: '点光源',
            command: 'PointLight'
          },
          {
            name: '平面光光源',
            command: 'RectAreaLight'
          },
          {
            name: '聚光灯',
            command: 'SpotLight'
          }
        ]
      },
      {
        name: '相机',
        command: 'camere',
        children: [
          {
            name: '正交相机',
            command: 'OrthographicCamera'
          },
          {
            name: '透视相机',
            command: 'PerspectiveCamera'
          },
          {
            name: '立体相机',
            command: 'StereoCamera'
          }
        ]
      },
      {
        name: '控制器',
        command: 'controls',
        children: [
          {
            name: '第一人称控制器',
            command: 'FirstPersonControls'
          },
          {
            name: '飞行控制器',
            command: 'FlyControls'
          },
          {
            name: '轨道控制器',
            command: 'OrbitControls'
          },
          {
            name: '指针锁定控制器',
            command: 'PointerLockControls'
          },
          {
            name: '轨迹球控制器',
            command: 'TrackballControls '
          },
          {
            name: '变换控制器',
            command: 'TransformControls '
          }
        ]
      }
    ]
  }
])
const autoSave = ref(true)
const creatFile = inject('creatFile')
const importMode = inject('importMode')
const exportOption = inject('exportOption')
const creatLight = inject('creatLight')
const creatCamera = inject('creatCamera')
const creatControls = inject('creatControls')

const file = (type: string, command: string) => {
  switch (type) {
    case 'file':
      switch (command) {
        case 'new':
          ;(creatFile as () => void)()
          break
        case 'mode':
          ;(importMode as () => void)()
          break
        case 'option':
          ;(exportOption as () => void)()
          break
      }
      break
    case 'add':
      switch (command) {
        case 'AmbientLight':
        case 'DirectionalLight':
        case 'HemisphereLight':
        case 'PointLight':
        case 'RectAreaLight':
        case 'SpotLight':
          ;(creatLight as (a: string) => void)(command)
          break
        case 'OrthographicCamera':
        case 'PerspectiveCamera':
        case 'StereoCamera':
          ;(creatCamera as (a: string) => void)(command)
          break
        default:
          ;(creatControls as (a: string) => void)(command)
          break
      }
      break
  }
}
</script>
<template>
  <header :class="{ header: true, show: show }">
    <div>
      <el-dropdown
        v-for="menu in menuList"
        :key="menu.command"
        @command="file(menu.command, $event)"
      >
        <span class="menu-item">{{ menu.name }}</span>
        <template #dropdown>
          <el-dropdown-menu>
            <template v-for="(item, index) in menu.children" :key="item.command">
              <el-dropdown-item
                :command="item.command"
                v-if="!item.children"
                :divided="index > 0 && !!menu.children[index - 1].children"
              >
                {{ item.name }}
              </el-dropdown-item>
              <el-dropdown-item
                v-for="(it, i) in item.children"
                :key="it.command"
                :divided="!i"
                :command="it.command"
              >
                {{ it.name }}
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-checkbox v-model="autoSave" label="自动保存" size="large" />
    <el-icon class="icon" :size="24" color="#999999" @click="$emit('update', !props.show)">
      <i-ep-d-arrow-right />
    </el-icon>
  </header>
</template>
<style lang="scss" scoped>
.header {
  height: 36px;
  padding: 0 15px;
  box-sizing: border-box;
  border-bottom: 1px solid #ddd;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  transform: translateY(-100%);
  transition: transform 0.3s;
  z-index: 99;
  .icon {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%) rotate(90deg);
    transition: transform 0.3s;
    box-sizing: content-box;
  }
  &.show {
    transform: translateY(0);
    .icon {
      transform: translateX(-50%) rotate(-90deg);
    }
  }
}
.menu-item {
  margin: 0 10px;
  font-size: 14px;
  line-height: 24px;
  outline: none;
  cursor: pointer;
}
</style>
