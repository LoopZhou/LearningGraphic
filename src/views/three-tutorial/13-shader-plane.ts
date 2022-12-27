import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import vertexShader from '../../assets/shader/vertex/basic.vert?raw';
// import fragmentShader from '../../assets/shader/frag/basic.frag?raw';
import fragmentShader from '../../assets/shader/frag/shader-plane.frag?raw';

// according to https://threejs.org/examples/?q=shader#webgl_shader
export default class Three13 {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  stats: Stats = Stats();
  mesh: THREE.Mesh = new THREE.Mesh();
  uniforms = {
    time: {
      value: 1.0,
    },
  };

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.init();
  }

  init(): void {
    this.initRender();
    this.initScene();
    this.initListener();
    this.render();
  }

  initRender(): void {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    document.body.appendChild(this.stats.dom);
  }

  initScene(): void {
    // plane
    const geometry = new THREE.PlaneGeometry(2, 2);

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
  }

  initListener(): void {
    window.addEventListener('resize', () => {
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

    this.uniforms.time.value = performance.now() / 1000;

    requestAnimationFrame(() => {
      this.animate();
    });
  }
}
