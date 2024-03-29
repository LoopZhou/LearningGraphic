import * as THREE from 'three';
import Experience from '../Experience.js';
import GSAP from 'gsap';
// import GUI from 'lil-gui';

export default class Environment {
  experience: Experience;
  scene: THREE.Scene;
  obj = {
    colorObj: { r: 0, g: 0, b: 0 },
    intensity: 3,
  };
  sunLight: THREE.DirectionalLight = new THREE.DirectionalLight('#ffffff', 3);
  ambientLight: THREE.AmbientLight = new THREE.AmbientLight('#ffffff', 1);
  // gui: GUI;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    // this.gui = new GUI({
    //   container: document.querySelector('.hero-main') as HTMLElement,
    // });
    this.setSunlight();
    // this.setGUI();
  }

  setSunlight() {
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 20;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.normalBias = 0.05;
    // const helper = new THREE.CameraHelper(this.sunLight.shadow.camera);
    // this.scene.add(helper);

    this.sunLight.position.set(-1.5, 7, 3);
    this.scene.add(this.sunLight);

    this.scene.add(this.ambientLight);
  }

  /*
  setGUI() {
    this.gui.addColor(this.obj, 'colorObj').onChange(() => {
      this.sunLight.color.copy(this.obj.colorObj);
      this.ambientLight.color.copy(this.obj.colorObj);
    });
    this.gui.add(this.obj, 'intensity', 0, 10).onChange(() => {
      this.sunLight.intensity = this.obj.intensity;
      this.sunLight.ambientLight = this.obj.intensity;
    });
  }
  */

  switchTheme(theme: string) {
    if (theme === 'dark') {
      GSAP.to(this.sunLight.color, {
        r: 0.17254901960784313,
        g: 0.23137254901960785,
        b: 0.6862745098039216,
      });
      GSAP.to(this.ambientLight.color, {
        r: 0.17254901960784313,
        g: 0.23137254901960785,
        b: 0.6862745098039216,
      });
      GSAP.to(this.sunLight, {
        intensity: 0.78,
      });
      GSAP.to(this.ambientLight, {
        intensity: 0.78,
      });
    } else {
      GSAP.to(this.sunLight.color, {
        r: 255 / 255,
        g: 255 / 255,
        b: 255 / 255,
      });
      GSAP.to(this.ambientLight.color, {
        r: 255 / 255,
        g: 255 / 255,
        b: 255 / 255,
      });
      GSAP.to(this.sunLight, {
        intensity: 3,
      });
      GSAP.to(this.ambientLight, {
        intensity: 1,
      });
    }
  }
}
