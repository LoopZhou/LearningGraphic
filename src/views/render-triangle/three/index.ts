import * as THREE from 'three';

export default class ThreeJs {
  scene: THREE.Scene | null = null;
  camera: THREE.OrthographicCamera | null = null;
  renderer: THREE.WebGLRenderer | null = null;

  constructor() {
    this.init();
  }

  init(): void {
    this.initRender();
    this.initScene();
    this.initCamera();
    this.initGeometry();
    this.render();
  }

  initRender(): void {
    const canvas = document.getElementById('three');
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(canvas?.clientWidth || 0, canvas?.clientHeight || 0);
    this.renderer.setClearColor(0xffffff, 1.0);
    canvas?.appendChild(this.renderer.domElement);
  }

  initScene(): void {
    this.scene = new THREE.Scene();
  }

  initCamera(): void {
    this.camera = new THREE.OrthographicCamera(-100, 100, -100, 0, -0.1, 1000);
  }

  initGeometry(): void {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([100, 0, 0, 0, -100, 0, -100, 0, 0]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const triangle = new THREE.Mesh(geometry, material);
    this.scene?.add(triangle);
  }

  // 渲染
  render(): void {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
