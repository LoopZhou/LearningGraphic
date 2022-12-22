import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'lil-gui';

// according to https://github.com/mrdoob/three.js/blob/master/examples/misc_animation_keys.html
export default class Three07 {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls | undefined;
  gui: GUI = new GUI();
  stats: Stats = Stats();

  axesHelper: THREE.AxesHelper = new THREE.AxesHelper(30);

  cube: THREE.Mesh = new THREE.Mesh();

  clock: THREE.Clock = new THREE.Clock();
  mixer: THREE.AnimationMixer | undefined;

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
    this.camera.position.set(50, 50, 50);
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
    this.initMesh();
    this.initHelper();
    this.initAnimation();
  }

  initMesh(): void {
    // cube
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
    });
    const geometry = new THREE.BoxGeometry(3, 3, 3);
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(0, 0, 0);
    this.scene.add(this.cube);
  }

  initHelper(): void {
    this.scene.add(this.axesHelper);
  }

  initAnimation(): void {
    // POSITION
    const positionKF = new THREE.VectorKeyframeTrack(
      '.position',
      [0, 1, 2, 3],
      [0, 0, 0, 30, 0, 0, 30, 30, 0, 0, 0, 0]
    );

    // SCALE
    const scaleKF = new THREE.VectorKeyframeTrack(
      '.scale',
      [0, 1, 2, 3],
      [1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1]
    );

    // ROTATION
    // Rotation should be performed using quaternions, using a THREE.QuaternionKeyframeTrack
    // Interpolating Euler angles (.rotation property) can be problematic and is currently not supported

    // set up rotation about x axis
    const xAxis = new THREE.Vector3(1, 0, 0);

    const qInitial = new THREE.Quaternion().setFromAxisAngle(xAxis, 0);
    const qFinal = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI);
    const quaternionKF = new THREE.QuaternionKeyframeTrack(
      '.quaternion',
      [0, 1, 2, 3],
      [
        qInitial.x,
        qInitial.y,
        qInitial.z,
        qInitial.w,
        qFinal.x,
        qFinal.y,
        qFinal.z,
        qFinal.w,
        qFinal.x,
        qFinal.y,
        qFinal.z,
        qFinal.w,
        qInitial.x,
        qInitial.y,
        qInitial.z,
        qInitial.w,
      ]
    );

    // COLOR
    const colorKF = new THREE.ColorKeyframeTrack(
      '.material.color',
      [0, 1, 2, 3],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0],
      THREE.InterpolateDiscrete
    );

    // OPACITY
    const opacityKF = new THREE.NumberKeyframeTrack(
      '.material.opacity',
      [0, 1, 2, 3],
      [1, 0, 0.5, 1]
    );

    const clip = new THREE.AnimationClip('Action', 4, [
      scaleKF,
      positionKF,
      quaternionKF,
      colorKF,
      opacityKF,
    ]);

    // setup the THREE.AnimationMixer
    this.mixer = new THREE.AnimationMixer(this.cube);

    // create a ClipAction and set it to play
    const clipAction = this.mixer.clipAction(clip);
    clipAction.play();
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

    const delta = this.clock.getDelta();

    if (this.mixer) {
      this.mixer.update(delta);
    }

    requestAnimationFrame(() => {
      this.animate();
    });
  }
}
