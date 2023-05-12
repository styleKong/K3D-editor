import * as THREE from 'three';
import * as _ from './utils';
// 透视相机
export const perspectiveCamera = function (config) {
  const { fov, aspect, near, far } = config;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  _.setProp(config, camera);
  camera.updateProjectionMatrix();
  return camera;
};
// 正交相机
export const orthographicCamera = function (config) {
  const { left, right, top, bottom, near, far } = config;
  const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
  _.setProp(config, camera);
  camera.updateProjectionMatrix();
  return camera;
};
// 立方相机
export const cubeCamera = function (config) {
  const { near, far, cubeRenderTarget } = config;
  const camera = new THREE.CubeCamera(near, far, cubeRenderTarget);
  _.setProp(config, camera);
  return camera;
};

// 立方相机
export const stereoCamera = function (config) {
  const camera = new THREE.StereoCamera();
  if (config.eyeSep) camera.eyeSep = config.eyeSep;
  _.setProp(config.cameraL, camera.cameraL);
  _.setProp(config.cameraR, camera.cameraR);
  return camera;
};
