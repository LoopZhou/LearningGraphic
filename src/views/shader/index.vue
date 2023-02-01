<template>
  <div>
    <canvas ref="threeRef" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import vertexShader from './vertex/basic.vert?raw';
// import fragmentShader from './frag/mix-color.frag?raw';
// import fragmentShader from './frag/mix-texture.frag?raw';
// import fragmentShader from './frag/texture-gray.frag?raw';
// import fragmentShader from './frag/step-texture.frag?raw';
// import fragmentShader from './frag/texture-reverse.frag?raw';
// import fragmentShader from './frag/texture-blend.frag?raw';
// import fragmentShader from './frag/uv.frag?raw';
import fragmentShader from './frag/texture-stroke.frag?raw';

const threeRef = ref(null);

let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;
let renderer: THREE.WebGLRenderer;
const stats: Stats = Stats();
let mesh: THREE.Mesh;
const uniforms = {
  time: {
    value: 0.0,
  },
  colorTexture: {
    value: new THREE.TextureLoader().load('textures/disturb.jpg'),
  },
  blendTexture: {
    value: new THREE.TextureLoader().load('textures/simpleShadow.jpg'),
  },
  whiteDocTexture: {
    value: new THREE.TextureLoader().load('textures/white-dot.png'),
  },
  v: {
    value: 1.0 / 256.0,
  },
  h: {
    value: 1.0 / 256.0,
  },
};

onMounted(() => {
  initCamera();
  initRender();
  initScene();
  initListener();
  renderScene();
});

const initCamera = () => {
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
};

const initRender = () => {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({
    canvas: threeRef.value,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const initScene = () => {
  // plane
  const geometry = new THREE.PlaneGeometry(2, 2);

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
};

const initListener = () => {
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

const renderScene = () => {
  animate();
};

const animate = () => {
  renderer.render(scene, camera);
  stats.update();
  uniforms.time.value = performance.now() / 1000;
  requestAnimationFrame(() => {
    animate();
  });
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
</style>
