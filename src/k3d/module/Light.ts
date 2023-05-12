import * as THREE from 'three';
import * as _ from './utils';
// 环境光会均匀的照亮场景中的所有物体。
export function ambientLight(config) {
  const light = new THREE.AmbientLight();
  _.setProp(config, light);
  return light;
}
// 平行光 平行光是沿着特定方向发射的光。这种光的表现像是无限远,从它发出的光线都是平行的。
// 常常用平行光来模拟太阳光 的效果;
// 太阳足够远，因此我们可以认为太阳的位置是无限远，所以我们认为从太阳发出的光线也都是平行的。
export function directionalLight(config) {
  const light = new THREE.DirectionalLight();
  const target = new THREE.Object3D();
  light.target = target;
  if (config.target) {
    target.position.set(...(config.target as [number, number, number]));
    delete config.target;
  }
  _.setProp(config, light);
  return light;
}
// 半球光 光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。
export function hemisphereLight(config) {
  const light = new THREE.HemisphereLight();
  _.setProp(config, light);
  return light;
}
// 点光源 从一个点向各个方向发射的光源。一个常见的例子是模拟一个灯泡发出的光。
export function pointLight(config) {
  const light = new THREE.PointLight();
  _.setProp(config, light);
  return light;
}
// 平面光光源从一个矩形平面上均匀地发射光线。这种光源可以用来模拟像明亮的窗户或者条状灯光光源。
export function rectAreaLight(config) {
  const light = new THREE.RectAreaLight();
  _.setProp(config, light);
  return light;
}
// 聚光灯 光线从一个点沿一个方向射出，随着光线照射的变远，光线圆锥体的尺寸也逐渐增大。
export function spotLight(config) {
  const light = new THREE.SpotLight();
  const target = new THREE.Object3D();
  light.target = target;
  if (config.target) {
    target.position.set(...(config.target as [number, number, number]));
    delete config.target;
  }
  _.setProp(config, light);
  return light;
}
