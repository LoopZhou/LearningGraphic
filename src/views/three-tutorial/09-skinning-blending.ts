import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'lil-gui';

// according to https://threejs.org/examples/#webgl_animation_skinning_blending
export default class Three09 {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls | undefined;
  gui: GUI = new GUI();
  stats: Stats = Stats();
  axesHelper: THREE.AxesHelper = new THREE.AxesHelper(5);
  clock: THREE.Clock = new THREE.Clock();

  hemiLight: THREE.HemisphereLight | undefined;
  dirLight: THREE.DirectionalLight | undefined;

  actions: THREE.AnimationAction[] = [];
  model: THREE.Group | undefined;
  skeleton: THREE.SkeletonHelper | undefined;
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
    // this.camera.position.set(1, 2, -3);
    this.camera.position.set(2, 2, -5);
    this.camera.lookAt(0, 1, 0);
  }

  initRender(): void {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;

    document.body.appendChild(this.renderer.domElement);
    document.body.appendChild(this.stats.dom);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  initScene(): void {
    this.scene.background = new THREE.Color(0xa0a0a0);
    this.scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

    this.initHelper();
    this.initLight();
    this.initMesh();
    this.initGLTF();
  }

  initHelper(): void {
    this.scene.add(this.axesHelper);
  }

  initLight(): void {
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    this.hemiLight.position.set(0, 20, 0);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xffffff);
    this.dirLight.position.set(-3, 10, -10);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.camera.top = 2;
    this.dirLight.shadow.camera.bottom = -2;
    this.dirLight.shadow.camera.left = -2;
    this.dirLight.shadow.camera.right = 2;
    this.dirLight.shadow.camera.near = 0.1;
    this.dirLight.shadow.camera.far = 40;
    this.scene.add(this.dirLight);
  }

  initMesh(): void {
    // ground
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshPhongMaterial({
      color: 0x999999,
      // depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
  }

  initGLTF(): void {
    new GLTFLoader().setPath('models/gltf/').load('Soldier.glb', (gltf) => {
      const { scene: model, animations } = gltf;
      model.traverse((object) => {
        if ((<THREE.Mesh>object).isMesh) {
          object.castShadow = true;
        }
      });
      this.model = model;
      this.scene.add(this.model);

      this.skeleton = new THREE.SkeletonHelper(this.model);
      this.skeleton.visible = false;
      this.scene.add(this.skeleton);

      this.mixer = new THREE.AnimationMixer(model);
      const idleAction = this.mixer.clipAction(animations[0]);
      const walkAction = this.mixer.clipAction(animations[3]);
      const runAction = this.mixer.clipAction(animations[1]);
      this.actions = [idleAction, walkAction, runAction];
      this.actions[1].play();
    });
  }

  initListener(): void {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  buildGUI(): void {
    this.gui = new GUI({ width: 310 });
    this.visibleGUI();
    this.activeGUI();
    this.weightGUI();
  }

  visibleGUI(): void {
    const settingVisible = {
      'show model': true,
      'show skeleton': false,
    };
    const visibilityFolder = this.gui.addFolder('Visibility');
    visibilityFolder
      .add(settingVisible, 'show model')
      .onChange((visibility: boolean) => {
        if (this.model) {
          this.model.visible = visibility;
        }
      });

    visibilityFolder
      .add(settingVisible, 'show skeleton')
      .onChange((visibility: boolean) => {
        if (this.skeleton) {
          this.skeleton.visible = visibility;
        }
      });
  }

  activeGUI(): void {
    const deactivateAll = () => {
      this.actions.forEach((action) => {
        action.stop();
      });
    };
    const activeAll = () => {
      this.actions.forEach((action) => {
        action.play();
      });
    };
    const pauseContinue = () => {
      if (this.actions[0].paused) {
        this.actions.forEach((action) => {
          action.paused = false;
        });
      } else {
        this.actions.forEach((action) => {
          action.paused = true;
        });
      }
    };
    const setting = {
      'deactivate all': deactivateAll,
      'activate all': activeAll,
      'pause/continue': pauseContinue,
    };
    const activeFolder = this.gui.addFolder('Active');
    activeFolder.add(setting, 'deactivate all');
    activeFolder.add(setting, 'activate all');
    activeFolder.add(setting, 'pause/continue');
  }

  weightGUI(): void {
    const setting = {
      'modify idle weight': 0.0,
      'modify walk weight': 1.0,
      'modify run weight': 0.0,
      'modify time scale': 1.0,
    };

    const setWeight = (action: THREE.AnimationAction, weight: number) => {
      action.enabled = true;
      action.setEffectiveTimeScale(1);
      action.setEffectiveWeight(weight);
    };

    const modifyTimeScale = (speed: number) => {
      if (this.mixer) {
        this.mixer.timeScale = speed;
      }
    };

    const weightFolder = this.gui.addFolder('Weight');
    weightFolder
      .add(setting, 'modify idle weight', 0.0, 1.0, 0.01)
      .listen()
      .onChange((weight: number) => {
        setWeight(this.actions[0], weight);
      });

    weightFolder
      .add(setting, 'modify walk weight', 0.0, 1.0, 0.01)
      .listen()
      .onChange((weight: number) => {
        setWeight(this.actions[1], weight);
      });

    weightFolder
      .add(setting, 'modify run weight', 0.0, 1.0, 0.01)
      .listen()
      .onChange((weight: number) => {
        setWeight(this.actions[2], weight);
      });

    weightFolder
      .add(setting, 'modify time scale', 0.0, 1.5, 0.01)
      .onChange(modifyTimeScale);
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
