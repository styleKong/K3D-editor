<script lang="ts" setup>
interface Tree {
  label: string
  children?: Tree[]
}
import { reactive, ref } from 'vue'

const treeDate = reactive([
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1'
          }
        ]
      }
    ]
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1'
          }
        ]
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1'
          }
        ]
      }
    ]
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1'
          }
        ]
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1'
          }
        ]
      }
    ]
  }
])
const defaultProps = {
  children: 'children',
  label: 'label'
}
// function setData(data) {
//   const treeDate
// }
const handleNodeClick = (data: Tree) => {
  console.log(data)
}
</script>
<template>
  <div class="scene">
    <div class="tree-container">
      <el-tree :data="treeDate" :props="defaultProps" @node-click="handleNodeClick" />
    </div>
    <el-tabs class="scene-tabs" type="border-card">
      <el-tab-pane label="属性"></el-tab-pane>
      <el-tab-pane label="几何组件"></el-tab-pane>
      <el-tab-pane label="材质组件"></el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" scoped>
.scene {
}
.tree-container {
  width: 100%;
  height: 200px;
  overflow: auto;
}
.scene-option {
  height: 32px;
  .option-label {
    margin-right: 5px;
  }
}
.scene-tabs {
  border-bottom: none;
  border-left: none;
  border-right: none;
  margin: 10px -10px 0;
}
</style>
