import * as THREE from 'three';
import Sizes from './utils/Sizes';
import Time from './utils/Time';
import Camera from './Camera';
import Renderer from './Renderer';
import World from './world/World';
import Resources from './utils/Resources.js';
import assets from './Utils/assets.js';
import Preloader from './Preloader';
import Controls from './World/Controls.js';

export default class Experience {
  static instance: Experience;
  canvas!: HTMLCanvasElement;
  scene!: THREE.Scene;
  sizes!: Sizes;
  time!: Time;
  camera!: Camera;
  renderer!: Renderer;
  world!: World;
  resources!: Resources;
  preloader!: Preloader;
  controls!: Controls;

  constructor(canvas: HTMLCanvasElement | undefined = undefined) {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;
    this.scene = new THREE.Scene();
    this.canvas = canvas as HTMLCanvasElement;
    this.sizes = new Sizes();
    this.time = new Time();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.resources = new Resources(assets);
    this.world = new World();
    this.preloader = new Preloader();

    this.preloader.on('enablecontrols', () => {
      this.controls = new Controls();
    });

    this.sizes.on('resize', () => {
      this.resize();
    });

    this.time.on('update', () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.renderer.update();
    this.world.update();
    this.preloader.update();
  }

  switchTheme(theme: string) {
    this.world.environment?.switchTheme(theme);
  }
}
