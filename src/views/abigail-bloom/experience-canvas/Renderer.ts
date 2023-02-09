import * as THREE from 'three';
import Experience from './Experience';
import Camera from './Camera';
import Sizes from './utils/Sizes';

export default class Renderer {
  experience: Experience;
  canvas: HTMLCanvasElement;
  camera: Camera;
  sizes: Sizes;
  scene: THREE.Scene;
  renderer!: THREE.WebGLRenderer;

  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.setRenderer();
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      // alpha: true,
    });

    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.CineonToneMapping;
    this.renderer.toneMappingExposure = 1.75;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.resize();
  }

  resize() {
    const { width, height, pixelRatio } = this.sizes;
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(pixelRatio);
  }

  update() {
    // this.renderer.render(this.scene, this.camera.perspectiveCamera);
    this.renderer.render(this.scene, this.camera.orthographicCamera);
  }
}
