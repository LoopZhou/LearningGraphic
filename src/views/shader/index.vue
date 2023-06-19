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
// import fragmentShader from './frag/texture-stroke.frag?raw';
// import fragmentShader from './frag/texture-dots.frag?raw';
// import fragmentShader from './frag/sin-wave.frag?raw';
// import fragmentShader from './frag/texture-blur.frag?raw';
// import fragmentShader from './frag/texture-mask.frag?raw';
// import fragmentShader from './frag/texture-noise.frag?raw';
// import fragmentShader from './frag/texture-uv.frag?raw';
// import fragmentShader from './frag/texture-dissolve.frag?raw';
// import fragmentShader from './frag/texture-mosaic.frag?raw';
// import fragmentShader from './frag/texture-bloom.frag?raw';
// import fragmentShader from './frag/texture-progress.frag?raw';
// import fragmentShader from './frag/texture-silhouette.frag?raw';
// import fragmentShader from './frag/uv-circle.frag?raw';
// import fragmentShader from './frag/uv-circle-regular.frag?raw';
// import fragmentShader from './frag/fwidth-coord.frag?raw';
// import fragmentShader from './frag/fwidth-grid.frag?raw';
// import fragmentShader from './frag/fwidth-line.frag?raw';
// import fragmentShader from './frag/fwidth-sin.frag?raw';
// import fragmentShader from './frag/fwidth-smoothstep.frag?raw';
// import fragmentShader from './frag/fwidth-checkerboard.frag?raw';
// import fragmentShader from './frag/raymarch.frag?raw';
import fragmentShader from './frag/tiles.frag?raw';

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
    // value: new THREE.TextureLoader().load('textures/crate.git'),
  },
  blendTexture: {
    value: new THREE.TextureLoader().load('textures/simpleShadow.jpg'),
  },
  whiteDocTexture: {
    value: new THREE.TextureLoader().load('textures/white-dot.png'),
  },
  noiseTexture: {
    value: new THREE.TextureLoader().load('textures/perlin_noise.jpg'),
  },
  v: {
    value: 1.0 / 256.0,
  },
  h: {
    value: 1.0 / 256.0,
  },
  resolution: {
    value: {
      x: 1.0 * window.innerWidth,
      y: 1.0 * window.innerHeight,
    },
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
    uniforms.resolution.value = {
      x: 1.0 * window.innerWidth,
      y: 1.0 * window.innerHeight,
    };
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
