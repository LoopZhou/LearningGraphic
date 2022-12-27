import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import vertexShader from '../../assets/shader/vertex/basic-cube.vert?raw';
import fragment1 from '../../assets/shader/frag/shader-plane.frag?raw';
// import fragment2 from '../../assets/shader/frag/cube2.frag?raw';
import fragment2 from '../../assets/shader/frag/plasma.frag?raw';
import fragment3 from '../../assets/shader/frag/cube3.frag?raw';
import fragment4 from '../../assets/shader/frag/cube4.frag?raw';

// according to https://threejs.org/examples/?q=shader#webgl_shader2
export default class Three14 {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls | undefined;
  stats: Stats = Stats();
  clock: THREE.Clock = new THREE.Clock();
  mesh: THREE.Mesh = new THREE.Mesh();
  uniforms1 = {
    time: {
      value: 1.0,
    },
  };
  uniforms2 = {
    time: {
      value: 1.0,
    },
    colorTexture: {
      value: new THREE.TextureLoader().load('textures/disturb.jpg'),
    },
  };

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      3000
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
    this.camera.position.z = 4;
  }

  initRender(): void {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    document.body.appendChild(this.stats.dom);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  initScene(): void {
    this.uniforms2.colorTexture.value.wrapS = THREE.RepeatWrapping;
    this.uniforms2.colorTexture.value.wrapT = THREE.RepeatWrapping;

    const params = {
      shader1: {
        uniform: this.uniforms1,
        frag: fragment1,
      },
      shader2: {
        uniform: this.uniforms2,
        frag: fragment2,
      },
      shader3: {
        uniform: this.uniforms1,
        frag: fragment3,
      },
      shader4: {
        uniform: this.uniforms1,
        frag: fragment4,
      },
    };

    const geometry = new THREE.BoxGeometry(0.75, 0.75, 0.75);

    (Object.keys(params) as (keyof typeof params)[]).forEach((key, index) => {
      const item = params[key];
      const material = new THREE.ShaderMaterial({
        uniforms: item.uniform,
        vertexShader,
        fragmentShader: item.frag,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = index - (Object.keys(params).length - 1) / 2;
      mesh.position.y = (index % 2) - 0.5;
      this.scene.add(mesh);
    });
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

    this.uniforms1.time.value += delta * 5;
    this.uniforms2.time.value = this.clock.elapsedTime;
    for (let i = 0; i < this.scene.children.length; i++) {
      const object = this.scene.children[i];

      object.rotation.y += delta * 0.5 * (i % 2 ? 1 : -1);
      object.rotation.x += delta * 0.5 * (i % 2 ? -1 : 1);
    }

    requestAnimationFrame(() => {
      this.animate();
    });
  }
}
