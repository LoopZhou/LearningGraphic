import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';
// import { OimoPhysics } from 'three/examples/jsm/libs/OimoPhysics';
import { GUI } from 'lil-gui';

// according to https://threejs.org/examples/#physics_oimo_instancing
export default class Three05 {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls | null = null;
  gui: GUI = new GUI();
  stats: Stats = Stats();

  axesHelper: THREE.AxesHelper = new THREE.AxesHelper(3);

  light: THREE.HemisphereLight = new THREE.HemisphereLight(0xffffff, 0x888888);

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
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
    this.buildGUI();
    this.initListener();
    this.render();
  }

  initCamera(): void {
    this.camera.position.set(10, 10, 10);
    this.camera.lookAt(0, 0, 0);
  }

  initRender(): void {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    document.body.appendChild(this.stats.dom);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  initScene(): void {
    this.light.position.set(0, 1, 0);
    this.scene.add(this.light);
    this.scene.add(this.axesHelper);
  }

  buildGUI(): void {
    this.gui = new GUI();
    this.gui.close();
  }

  initListener(): void {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // 渲染
  render(): void {
    this.renderer.render(this.scene, this.camera);
    this.animate();
  }

  animate(): void {
    this.controls?.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => {
      this.animate();
    });
  }
}
