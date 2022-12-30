import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'lil-gui';

// according to https://threejs.org/examples/#webgl_animation_keyframes
export default class Three10 {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls | undefined;
  gui: GUI = new GUI();
  stats: Stats = Stats();

  axesHelper: THREE.AxesHelper = new THREE.AxesHelper(10);

  clock: THREE.Clock = new THREE.Clock();
  mixer: THREE.AnimationMixer | undefined;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      40,
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
    this.camera.position.set(5, 2, 8);
    this.camera.lookAt(0, 0, 0);
  }

  initRender(): void {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    document.body.appendChild(this.renderer.domElement);
    document.body.appendChild(this.stats.dom);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0.5, 0);
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
  }

  initScene(): void {
    this.scene.background = new THREE.Color(0xbfe3dd);
    this.initHelper();
    this.initEnv();
    this.initGLTF();
  }

  initHelper(): void {
    this.scene.add(this.axesHelper);
  }

  initEnv(): void {
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
  }

  initGLTF(): void {
    const loader = new GLTFLoader();
    // draco解码器
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('js/libs/draco/gltf/');
    loader.setPath('models/gltf/');
    loader.setDRACOLoader(dracoLoader);
    loader.load('LittlestTokyo.glb', (gltf) => {
      const { scene: model, animations } = gltf;
      model.position.set(1, 1, 0);
      model.scale.set(0.01, 0.01, 0.01);
      this.scene.add(model);

      this.mixer = new THREE.AnimationMixer(model);
      this.mixer.clipAction(animations[0]).play();
    });
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
    this.animate();
  }

  animate(): void {
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
    // 控制器添加阻尼生效，转动控制器的时候有种真实感
    this.controls?.update();

    const delta = this.clock.getDelta();
    this.mixer?.update(delta);

    requestAnimationFrame(() => {
      this.animate();
    });
  }
}
