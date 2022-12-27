import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import vertexShader from '../../assets/shader/vertex/basic-cube.vert?raw';
import fragmentShader from '../../assets/shader/frag/lava.frag?raw';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';

// according to https://threejs.org/examples/?q=shader#webgl_shader_lava
export default class Three15 {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls | undefined;
  composer: EffectComposer | undefined;
  stats: Stats = Stats();
  clock: THREE.Clock = new THREE.Clock();
  mesh: THREE.Mesh = new THREE.Mesh();
  uniforms = {
    fogDensity: {
      value: 0.45,
    },
    fogColor: {
      value: new THREE.Vector3(0, 0, 0),
    },
    time: {
      value: 1.0,
    },
    uvScale: {
      value: new THREE.Vector2(3.0, 1.0),
    },
    texture1: {
      value: new THREE.TextureLoader().load('textures/lava/cloud.png'),
    },
    texture2: {
      value: new THREE.TextureLoader().load('textures/lava/lavatile.jpg'),
    },
  };

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      1,
      3000
    );
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.init();
  }

  init(): void {
    this.initCamera();
    this.initRender();
    this.initScene();
    this.initPostProcess();
    this.initListener();
    this.render();
  }

  initCamera(): void {
    this.camera.position.z = 4;
  }

  initRender(): void {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    document.body.appendChild(this.stats.dom);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.composer = new EffectComposer(this.renderer);
  }

  initScene(): void {
    this.uniforms.texture1.value.wrapS = THREE.RepeatWrapping;
    this.uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
    this.uniforms.texture2.value.wrapS = THREE.RepeatWrapping;
    this.uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

    const size = 0.65;
    const geometry = new THREE.TorusGeometry(size, 0.3, 30, 30);
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = 0.3;
    this.scene.add(mesh);
  }

  initPostProcess(): void {
    const renderModel = new RenderPass(this.scene, this.camera);
    // strength = 1, kernelSize = 25, sigma = 4, resolution = 256
    const effectBloom = new BloomPass(2);
    const effectFilm = new FilmPass(0.35, 0.95, 2048, 0);

    this.composer?.addPass(renderModel);
    this.composer?.addPass(effectBloom);
    this.composer?.addPass(effectFilm);
  }

  initListener(): void {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.composer?.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // 渲染
  render(): void {
    this.animate();
  }

  animate(): void {
    // this.renderer.render(this.scene, this.camera);
    this.composer?.render(0.01);
    this.stats.update();
    this.controls?.update();
    const delta = this.clock.getDelta();
    this.uniforms.time.value += delta * 1;

    requestAnimationFrame(() => {
      this.animate();
    });
  }
}
