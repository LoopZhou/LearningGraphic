import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ShadowMapViewer } from 'three/examples/jsm/utils/ShadowMapViewer';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'lil-gui';

// according to https://threejs.org/examples/?q=shadowmap%20view#webgl_shadowmap_viewer
export default class Three05 {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls | null = null;
  gui: GUI = new GUI();
  stats: Stats = Stats();

  axesHelper: THREE.AxesHelper = new THREE.AxesHelper(3);

  ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0x404040);
  spotLight: THREE.SpotLight = new THREE.SpotLight(0xffffff);
  dirLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);

  torusKnot: THREE.Mesh = new THREE.Mesh();
  cube: THREE.Mesh = new THREE.Mesh();
  ground: THREE.Mesh = new THREE.Mesh();

  clock: THREE.Clock = new THREE.Clock();

  dirLightShadowMapViewer: ShadowMapViewer | undefined;
  spotLightShadowMapViewer: ShadowMapViewer | undefined;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
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
    this.buildGUI();
    this.initListener();
    this.render();
  }

  initCamera(): void {
    this.camera.position.set(0, 15, 35);
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
    this.initLight();
    this.initMesh();
    this.initShadow();
    this.initHelper();
    this.initShadowMapViewer();
  }

  initLight(): void {
    this.scene.add(this.ambientLight);

    this.spotLight.name = 'Spot Light';
    this.spotLight.angle = Math.PI / 5;
    this.spotLight.penumbra = 0.3;
    this.spotLight.position.set(10, 10, 5);
    this.scene.add(this.spotLight);

    this.dirLight.name = 'Dir. Light';
    this.dirLight.position.set(0, 10, 0);
    this.scene.add(this.dirLight);
  }

  initShadow(): void {
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;

    this.spotLight.castShadow = true;
    this.spotLight.shadow.camera.near = 8;
    this.spotLight.shadow.camera.far = 30;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;

    this.dirLight.castShadow = true;
    this.dirLight.shadow.camera.near = 1;
    this.dirLight.shadow.camera.far = 10;
    this.dirLight.shadow.camera.right = 15;
    this.dirLight.shadow.camera.left = -15;
    this.dirLight.shadow.camera.top = 15;
    this.dirLight.shadow.camera.bottom = -15;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;

    this.torusKnot.castShadow = true;
    this.torusKnot.receiveShadow = true;

    this.cube.castShadow = true;
    this.cube.receiveShadow = true;

    this.ground.castShadow = false;
    this.ground.receiveShadow = true;
  }

  initMesh(): void {
    // torusKnot
    const geometry = new THREE.TorusKnotGeometry(25, 8, 75, 20);
    let material = new THREE.MeshPhongMaterial({
      color: 0x888888,
      shininess: 150,
      specular: 0x222222,
    });
    this.torusKnot = new THREE.Mesh(geometry, material);
    this.torusKnot.scale.multiplyScalar(1 / 18);
    this.torusKnot.position.y = 3;
    this.scene.add(this.torusKnot);

    // cube
    let geometryCube = new THREE.BoxGeometry(3, 3, 3);
    this.cube = new THREE.Mesh(geometryCube, material);
    this.cube.position.set(8, 3, 8);
    this.scene.add(this.cube);

    // ground
    geometryCube = new THREE.BoxGeometry(10, 0.15, 10);
    material = new THREE.MeshPhongMaterial({
      color: 0xa0adaf,
      shininess: 150,
      specular: 0x111111,
    });
    this.ground = new THREE.Mesh(geometryCube, material);
    this.ground.scale.multiplyScalar(3);
    this.scene.add(this.ground);
  }

  initHelper(): void {
    this.scene.add(this.ambientLight);
    this.scene.add(new THREE.CameraHelper(this.spotLight.shadow.camera));
    this.scene.add(new THREE.CameraHelper(this.dirLight.shadow.camera));
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

      this.resizeShadowMapViewer();
      this.dirLightShadowMapViewer?.updateForWindowResize();
      this.spotLightShadowMapViewer?.updateForWindowResize();
    });
  }

  initShadowMapViewer(): void {
    this.dirLightShadowMapViewer = new ShadowMapViewer(this.dirLight);
    this.spotLightShadowMapViewer = new ShadowMapViewer(this.spotLight);
    this.resizeShadowMapViewer();
  }

  resizeShadowMapViewer(): void {
    const size = window.innerWidth * 0.15;

    if (this.dirLightShadowMapViewer) {
      this.dirLightShadowMapViewer.position.x = 10;
      this.dirLightShadowMapViewer.position.y = 50;
      this.dirLightShadowMapViewer.size.width = size;
      this.dirLightShadowMapViewer.size.height = size;
      this.dirLightShadowMapViewer.update(); //Required when setting position or size directly
    }

    if (this.spotLightShadowMapViewer) {
      this.spotLightShadowMapViewer.size.set(size, size);
      this.spotLightShadowMapViewer.position.set(size + 20, 50);
      // spotLightShadowMapViewer.update();	//NOT required because .set updates automatically
    }
  }
  // 渲染
  render(): void {
    this.animate();
  }

  animate(): void {
    this.renderer.render(this.scene, this.camera);
    this.dirLightShadowMapViewer?.render(this.renderer);
    this.spotLightShadowMapViewer?.render(this.renderer);
    this.stats.update();

    const delta = this.clock.getDelta();

    this.torusKnot.rotation.x += 0.25 * delta;
    this.torusKnot.rotation.y += 2 * delta;
    this.torusKnot.rotation.z += 1 * delta;

    this.cube.rotation.x += 0.1 * delta;
    this.cube.rotation.y += 0.2 * delta;
    this.cube.rotation.z += 0.5 * delta;

    requestAnimationFrame(() => {
      this.animate();
    });
  }
}
