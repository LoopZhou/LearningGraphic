import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Three01 {
  scene: THREE.Scene | null = null;
  camera: THREE.PerspectiveCamera | null = null;
  renderer: THREE.WebGLRenderer | null = null;
  cube: THREE.Mesh | null = null;
  axesHelper: THREE.AxesHelper | null = null;
  controls: OrbitControls | null = null;

  constructor() {
    this.init();
  }

  init(): void {
    this.initScene();
    this.initCamera();
    this.initRender();
    this.render();
  }

  initRender(): void {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(
      this.camera as THREE.PerspectiveCamera,
      this.renderer.domElement
    );
  }

  initScene(): void {
    this.scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    this.axesHelper = new THREE.AxesHelper(3);
    this.scene.add(this.axesHelper);
  }

  initCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
  }

  // 渲染
  render(): void {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
      if (this.cube) {
        this.cube.rotation.y += 0.1;
      }
      requestAnimationFrame(() => {
        this.render();
      });
    }
  }
}
