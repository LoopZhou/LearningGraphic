import * as THREE from 'three';
import Experience from './Experience.js';
import Sizes from './utils/Sizes.js';

export default class Camera {
  experience: Experience;
  sizes: Sizes;
  scene: THREE.Scene;
  perspectiveCamera!: THREE.PerspectiveCamera;
  orthographicCamera!: THREE.OrthographicCamera;

  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;

    this.createPerspectiveCamera();
    this.createOrthographicCamera();
  }

  createPerspectiveCamera() {
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      35,
      this.sizes.aspect,
      0.1,
      1000
    );
    // this.perspectiveCamera.position.x = 29;
    // this.perspectiveCamera.position.y = 14;
    this.perspectiveCamera.position.z = 12;
    this.scene.add(this.perspectiveCamera);
  }

  createOrthographicCamera() {
    this.orthographicCamera = new THREE.OrthographicCamera(
      (-this.sizes.aspect * this.sizes.frustrum) / 2,
      (this.sizes.aspect * this.sizes.frustrum) / 2,
      this.sizes.frustrum / 2,
      -this.sizes.frustrum / 2,
      -50,
      50
    );

    // 6.5
    this.orthographicCamera.position.y = 5.65;
    this.orthographicCamera.position.z = 10;
    this.orthographicCamera.rotation.x = -Math.PI / 6;
    this.scene.add(this.orthographicCamera);
  }

  resize() {
    // Updating Perspective Camera on Resize
    this.perspectiveCamera.aspect = this.sizes.aspect;
    this.perspectiveCamera.updateProjectionMatrix();

    // Updating Orthographic Camera on Resize
    this.orthographicCamera.left =
      (-this.sizes.aspect * this.sizes.frustrum) / 2;
    this.orthographicCamera.right =
      (this.sizes.aspect * this.sizes.frustrum) / 2;
    this.orthographicCamera.top = this.sizes.frustrum / 2;
    this.orthographicCamera.bottom = -this.sizes.frustrum / 2;
    this.orthographicCamera.updateProjectionMatrix();
  }
}
