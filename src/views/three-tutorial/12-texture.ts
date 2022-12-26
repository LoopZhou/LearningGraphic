import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';

// according to https://threejs.org/examples/?q=cube#webgl_geometry_cube
export default class Three12 {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls | null = null;
  stats: Stats = Stats();
  axesHelper: THREE.AxesHelper = new THREE.AxesHelper(3);
  cube: THREE.Mesh = new THREE.Mesh();
  clock: THREE.Clock = new THREE.Clock();

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
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
    this.initListener();
    this.render();
  }

  initCamera(): void {
    this.camera.position.set(0, 0, 400);
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
    this.initMesh();
    this.initHelper();
  }

  initMesh(): void {
    // texture
    const texture = new THREE.TextureLoader().load('textures/crate.gif');
    // cube
    const geometryCube = new THREE.BoxGeometry(200, 200, 200);
    const materialCube = new THREE.MeshBasicMaterial({
      map: texture,
    });
    this.cube = new THREE.Mesh(geometryCube, materialCube);
    this.scene.add(this.cube);
  }

  initHelper(): void {
    this.scene.add(this.axesHelper);
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
    this.animate();
  }

  animate(): void {
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
    this.controls?.update();

    const delta = this.clock.getDelta();

    this.cube.rotation.x += 0.1 * delta;
    this.cube.rotation.y += 0.2 * delta;
    this.cube.rotation.z += 0.5 * delta;

    requestAnimationFrame(() => {
      this.animate();
    });
  }
}
