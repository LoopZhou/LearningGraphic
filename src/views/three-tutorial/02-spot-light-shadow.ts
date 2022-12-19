import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Three01 {
  scene: THREE.Scene | null = null;
  camera: THREE.PerspectiveCamera | null = null;
  renderer: THREE.WebGLRenderer | null = null;

  plane: THREE.Mesh | null = null;
  cylinder: THREE.Mesh | null = null;
  axesHelper: THREE.AxesHelper | null = null;
  controls: OrbitControls | null = null;

  ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 0.2);
  spotLight: THREE.SpotLight = new THREE.SpotLight(0xffffff, 1);

  constructor() {
    this.init();
  }

  init(): void {
    this.initCamera();
    this.initRender();
    this.initScene();
    this.initShadow();
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

    this.controls.addEventListener('change', () => {
      this.render();
    });
  }

  initScene(): void {
    this.scene = new THREE.Scene();

    this.scene.add(this.ambientLight);
    this.spotLight.position.set(-50, 80, 0);
    this.spotLight.angle = Math.PI / 6;
    this.spotLight.penumbra = 0.2;
    this.scene.add(this.spotLight);
    const spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
    this.scene.add(spotLightHelper);

    const geometry = new THREE.PlaneBufferGeometry(200, 200);
    // const material = new THREE.MeshBasicMaterial({ color: 0x808080 }); basicMaterial获取不到spotlight光
    const material = new THREE.MeshPhongMaterial({ color: 0x808080 });
    this.plane = new THREE.Mesh(geometry, material);
    this.plane.rotation.x = -Math.PI / 2;
    this.plane.position.set(0, -10, 0);
    this.scene.add(this.plane);

    const geometryCylinder = new THREE.CylinderGeometry(5, 5, 2, 24, 10);
    const materialCylinder = new THREE.MeshPhongMaterial({ color: 0x408080 });
    this.cylinder = new THREE.Mesh(geometryCylinder, materialCylinder);
    this.cylinder.position.set(0, 10, 0);
    this.scene.add(this.cylinder);

    this.axesHelper = new THREE.AxesHelper(50);
    this.scene.add(this.axesHelper);
  }

  initCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 120, 200);
    this.camera.lookAt(0, 0, 0);
  }

  initShadow(): void {
    this.plane!.receiveShadow = true;
    this.cylinder!.castShadow = true;
    this.spotLight.castShadow = true;
    this.renderer!.shadowMap.enabled = true;
  }

  // 渲染
  render(): void {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(() => {
        this.render();
      });
    }
  }
}
