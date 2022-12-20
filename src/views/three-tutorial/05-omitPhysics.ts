import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OimoPhysics } from 'three/examples/jsm/physics/OimoPhysics';
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

  hemiLight: THREE.HemisphereLight = new THREE.HemisphereLight(
    0xffffff,
    0x888888
  );
  dirLight: THREE.DirectionalLight = new THREE.DirectionalLight();

  physics: OimoPhysics;

  floor: THREE.Mesh = new THREE.Mesh();
  boxes: THREE.InstancedMesh | undefined;
  spheres: THREE.InstancedMesh | undefined;

  count: number;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.count = 100;

    this.init();
  }

  init(): void {
    this.initCamera();
    this.initRender();
    this.initScene();
    this.buildGUI();
    this.initListener();
    this.enabledPhysics();
    this.render();
  }

  initCamera(): void {
    this.camera.position.set(4, 4, 4);
    this.camera.lookAt(0, 0, 0);
  }

  initRender(): void {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);
    document.body.appendChild(this.stats.dom);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  initScene(): void {
    this.scene.background = new THREE.Color(0x888888);
    this.scene.add(this.axesHelper);
    this.initLight();
    this.initMesh();
  }

  initLight(): void {
    this.hemiLight.position.set(0, 1, 0);
    this.hemiLight.intensity = 0.35;
    this.scene.add(this.hemiLight);

    this.dirLight.position.set(5, 5, -5);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.camera.zoom = 2;
    this.scene.add(this.dirLight);
  }

  initMesh(): void {
    // plane
    const geometry = new THREE.BoxGeometry(10, 5, 10);
    const material = new THREE.ShadowMaterial({ color: 0x111111 });
    this.floor = new THREE.Mesh(geometry, material);
    this.floor.position.y = -2.5;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    // box
    const geometryBox = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const materialBox = new THREE.MeshLambertMaterial();
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    this.boxes = new THREE.InstancedMesh(geometryBox, materialBox, this.count);
    this.boxes.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
    this.boxes.castShadow = true;
    this.boxes.receiveShadow = true;
    for (let i = 0; i < this.boxes.count; i++) {
      matrix.setPosition(
        Math.random() - 0.5, // x: -0.5~0.5
        Math.random() * 2, // y: 0~2
        Math.random() - 0.5 // z: -0.5~0.5
      );
      this.boxes.setMatrixAt(i, matrix);
      this.boxes.setColorAt(i, color.setHex(0xffffff * Math.random()));
    }
    this.scene.add(this.boxes);

    // sphere
    const geometrySphere = new THREE.IcosahedronGeometry(0.075, 3);
    this.spheres = new THREE.InstancedMesh(
      geometrySphere,
      materialBox,
      this.count
    );
    this.spheres.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
    this.spheres.castShadow = true;
    this.spheres.receiveShadow = true;

    for (let i = 0; i < this.spheres.count; i++) {
      matrix.setPosition(
        Math.random() - 0.5,
        Math.random() * 2,
        Math.random() - 0.5
      );
      this.spheres.setMatrixAt(i, matrix);
      this.spheres.setColorAt(i, color.setHex(0xffffff * Math.random()));
    }
    this.scene.add(this.spheres);
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

  async enabledPhysics() {
    this.physics = await OimoPhysics();
    this.physics.addMesh(this.floor);
    this.physics.addMesh(this.boxes, 1);
    this.physics.addMesh(this.spheres, 1);
  }

  // 渲染
  render(): void {
    this.animate();
  }

  animate(): void {
    this.renderer.render(this.scene, this.camera);
    this.stats.update();

    if (this.physics) {
      let index = Math.floor(Math.random() * this.boxes!.count);
      const position = new THREE.Vector3();
      position.set(0, 2, 0);
      this.physics.setMeshPosition(this.boxes, position, index);

      index = Math.floor(Math.random() * this.spheres!.count);
      position.set(0, Math.random() + 1, 0);
      this.physics.setMeshPosition(this.spheres, position, index);
    }

    requestAnimationFrame(() => {
      this.animate();
    });
  }
}
