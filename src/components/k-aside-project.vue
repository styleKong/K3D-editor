<script lang="ts" setup>
import { reactive, watchEffect } from 'vue'
import * as THREE from 'three'

const form = reactive({
  antialias: false,
  useLegacyLights: false,
  shadow: false,
  shadowType: '',
  Tonemapping: '',
  toneMappingExposure: ''
})
watchEffect(() => {
  if (form.antialias) {
    console.log(form.antialias)
  }
})
</script>
<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="抗锯齿" label-width="70px">
      <el-switch v-model="form.antialias" size="small" />
    </el-form-item>
    <el-form-item label="传统灯" label-width="70px">
      <el-switch v-model="form.useLegacyLights" size="small" />
    </el-form-item>
    <el-form-item label="阴影" label-width="70px">
      <el-switch v-model="form.shadow" size="small" />
      <el-select v-show="form.shadow" class="select" v-model="form.shadowType" size="small">
        <el-option label="BasicShadowMap" :value="THREE.BasicShadowMap"></el-option>
        <el-option label="PCFShadowMap" :value="THREE.PCFShadowMap"></el-option>
        <el-option label="PCFSoftShadowMap" :value="THREE.PCFSoftShadowMap"></el-option>
        <el-option label="VSMShadowMap" :value="THREE.VSMShadowMap"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="色调映射" label-width="70px" size="small">
      <el-select class="select" v-model="form.Tonemapping">
        <el-option label="NoToneMapping" :value="THREE.NoToneMapping"></el-option>
        <el-option label="LinearToneMapping" :value="THREE.LinearToneMapping"></el-option>
        <el-option label="ReinhardToneMapping" :value="THREE.ReinhardToneMapping"></el-option>
        <el-option label="CineonToneMapping" :value="THREE.CineonToneMapping"></el-option>
        <el-option label="ACESFilmicToneMapping" :value="THREE.ACESFilmicToneMapping"></el-option>
      </el-select>
      <el-input
        v-show="form.Tonemapping"
        class="input"
        v-model="form.toneMappingExposure"
        size="small"
      ></el-input>
    </el-form-item>
  </el-form>
</template>
<style lang="scss" scoped>
.select {
  width: 100px;
  &:not(:first-child) {
    margin-left: 5px;
  }
}
.input {
  width: 60px;
  margin: 0 5px;
}
</style>
