import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import * as _ from './utils';

export function orbitControls(config) {
  const { camera, domElement } = config;
  const controls = new OrbitControls(camera, domElement);
  _.setProp(config, controls);
  return controls;
}
export function dragControls(config) {
  const { camera, domElement, objects } = config;
  const controls = new DragControls(objects, camera, domElement);
  _.setProp(config, controls);
  return controls;
}
export function firstPersonControls(config) {
  const { camera, domElement } = config;
  const controls = new FirstPersonControls(camera, domElement);
  _.setProp(config, controls);
  return controls;
}
export function flyControls(config) {
  const { camera, domElement } = config;
  const controls = new FlyControls(camera, domElement);
  _.setProp(config, controls);
  return controls;
}
export function pointerLockControls(config) {
  const { camera, domElement } = config;
  const controls = new PointerLockControls(camera, domElement);
  _.setProp(config, controls);
  return controls;
}
export function transformControls(config) {
  const { camera, domElement } = config;
  const controls = new TransformControls(camera, domElement);
  _.setProp(config, controls);
  return controls;
}
export function trackballControls(config) {
  const { camera, domElement } = config;
  const controls = new TrackballControls(camera, domElement);
  _.setProp(config, controls);
  return controls;
}
