<template>
  <div>
    <canvas ref="threeRef" />
  </div>
</template>

<script setup lang="ts">
// refer: https://github.com/ezewu/three-point
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import TWEEN from 'three-tween';

const threeRef = ref(null);
const bufArrays = [];
let geometry;
let current = 0;
let scene;
let camera;
let renderer;
let controls;
let points;

onMounted(() => {
  initCamera();
  initRender();
  initScene();
  initListener();
  renderScene();
});

const initCamera = () => {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    80
  );
  camera.position.set(0, 0, 6);
};

const initRender = () => {
  scene = new THREE.Scene();
  scene.background = backgroundTexture();

  renderer = new THREE.WebGLRenderer({
    canvas: threeRef.value,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  controls = new OrbitControls(camera, renderer.domElement);
};

const backgroundTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(
    0,
    0,
    window.innerWidth,
    window.innerHeight,
    0
  );
  gradient.addColorStop(0, '#4e22b7');
  gradient.addColorStop(1, '#3292ff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const canvasTexture = new THREE.CanvasTexture(canvas);
  return canvasTexture;
};

const initScene = () => {
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);
  const manager = new THREE.LoadingManager();

  manager.onLoad = () => {
    transition();
  };

  const gltfLoader = new GLTFLoader(manager);
  gltfLoader.setPath('models/gltf/');
  gltfLoader.load('box.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.geometry.translate(0, 0.5, 0);
        const { array } = child.geometry.attributes.position;
        bufArrays.push(array);
      }
    });
  });

  gltfLoader.load('/box1.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.geometry.scale(0.5, 0.5, 0.5);
        const { array } = child.geometry.attributes.position;
        bufArrays.push(array);
      }
    });
  });

  gltfLoader.load('/sphere.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.geometry.translate(1, 0, 0);
        const { array } = child.geometry.attributes.position;
        bufArrays.push(array);
      }
    });
  });

  geometry = new THREE.BufferGeometry();
  const vertices = [];
  geometry.tween = [];
  for (let i = 0; i < 26016; i++) {
    const position = THREE.MathUtils.randFloat(-4, 4);
    geometry.tween.push(
      new TWEEN.Tween({ position }).easing(TWEEN.Easing.Exponential.In)
    );
    vertices.push(position);
  }

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(vertices), 3)
  );
  points = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size: 0.032,
      map: new THREE.TextureLoader().load('/textures/white-dot.png'),
      alphaTest: 0.1,
      opacity: 0.5,
      transparent: true,
      depthTest: true,
    })
  );

  scene.add(points);
};

const initListener = () => {
  const onWindowResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };

  window.addEventListener('resize', onWindowResize, false);
};

const renderScene = () => {
  controls.update();
  renderer.render(scene, camera);

  points.rotation.x += 0.0003;
  points.rotation.y += 0.001;
  points.rotation.z += 0.002;

  TWEEN.update();

  requestAnimationFrame(renderScene);
};

const transition = () => {
  for (let i = 0, j = 0; i < 26016; i++, j++) {
    const item = geometry.tween[i];
    if (j >= bufArrays[current].length) {
      j = 0;
    }
    item
      .to(
        { position: bufArrays[current][j] },
        THREE.MathUtils.randFloat(1000, 4000)
      )
      .onUpdate(function () {
        // 是this.position, onUpdate中的this, 需要用外部的this需要在外层赋值如self = this;使用self
        geometry.attributes.position.array[i] = this.position;
        geometry.attributes.position.needsUpdate = true;
      })
      .start();
  }
  setTimeout(() => {
    transition();
  }, 5000);
  current = (current + 1) % 3;
};
</script>
