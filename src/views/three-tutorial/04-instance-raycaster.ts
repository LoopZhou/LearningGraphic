import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'lil-gui';

// according to https://threejs.org/examples/#webgl_instancing_raycast
export default class Three04 {
  scene: THREE.Scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    100
  );
  renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  controls: OrbitControls | null = null;
  gui: GUI = new GUI();

  axesHelper: THREE.AxesHelper = new THREE.AxesHelper(3);

  light: THREE.HemisphereLight = new THREE.HemisphereLight(0xffffff, 0x888888);
  mesh: THREE.InstancedMesh | null = null;

  color: THREE.Color = new THREE.Color();
  white: THREE.Color = new THREE.Color().setHex(0xffffff);
  mouse: THREE.Vector2 = new THREE.Vector2(1, 1);
  raycaster: THREE.Raycaster = new THREE.Raycaster();

  indexNum: number;

  constructor() {
    this.init();
    this.indexNum = 0;
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

    this.controls = new OrbitControls(
      this.camera as THREE.PerspectiveCamera,
      this.renderer.domElement
    );
    // this.controls.enableDamping = true;
    // this.controls.enableZoom = false;
    // this.controls.enablePan = false;
  }

  initScene(): void {
    this.light.position.set(0, 1, 0);
    this.scene.add(this.light);
    this.scene.add(this.axesHelper);
    this.initMesh();
  }

  initMesh(): void {
    const geometry = new THREE.IcosahedronGeometry(0.5, 3);
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const amount = 10;
    const count = Math.pow(amount, 3);

    this.mesh = new THREE.InstancedMesh(geometry, material, count);
    let i = 0;
    const offset = (amount - 1) / 2;
    const matrix = new THREE.Matrix4();

    for (let x = 0; x < amount; x++) {
      for (let y = 0; y < amount; y++) {
        for (let z = 0; z < amount; z++) {
          matrix.setPosition(offset - x, offset - y, offset - z);
          this.mesh.setMatrixAt(i, matrix);
          this.mesh.setColorAt(i, this.white);
          i++;
        }
      }
    }

    this.scene.add(this.mesh);
  }

  buildGUI(): void {
    this.gui = new GUI();
    this.gui.add(this.mesh!, 'count', 0, Math.pow(10, 3));
    this.gui.close();
  }

  initListener(): void {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.addEventListener('mousemove', (event: MouseEvent) => {
      event.preventDefault();
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }

  // 渲染
  render(): void {
    this.renderer.render(this.scene, this.camera);
    this.animate();
  }

  animate(): void {
    this.controls?.update();
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersection = this.raycaster.intersectObject(this.mesh!);
    if (intersection.length) {
      const instanceId = intersection[0].instanceId;
      this.mesh?.getColorAt(instanceId as number, this.color);
      if (this.color.equals(this.white)) {
        this.mesh?.setColorAt(
          instanceId as number,
          this.color.setHex(Math.random() * 0xffffff)
        );
        this.mesh!.instanceColor!.needsUpdate = true;
        this.indexNum++;
        // eslint-disable-next-line no-console
        console.log('indexNum', this.indexNum);
      }
    }
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => {
      this.animate();
    });
  }
}
