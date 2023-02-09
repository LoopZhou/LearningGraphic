import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Floor {
  experience: Experience;
  scene: THREE.Scene;
  plane!: THREE.Mesh;
  circleFirst!: THREE.Mesh;
  circleSecond!: THREE.Mesh;
  circleThird!: THREE.Mesh;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    // this.setBox();
    this.setFloor();
    this.setCircles();
  }

  setBox() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    const axesHelper = new THREE.AxesHelper(3);
    this.scene.add(axesHelper);
  }

  setFloor() {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffe6a2,
      side: THREE.BackSide,
    });
    // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.plane = new THREE.Mesh(geometry, material);
    this.plane.rotation.x = Math.PI / 2;
    this.plane.position.y = -0.3;
    this.plane.receiveShadow = true;
    this.scene.add(this.plane);
  }

  setCircles() {
    const geometry = new THREE.CircleGeometry(5, 64);
    const material = new THREE.MeshStandardMaterial({ color: 0xe5a1aa });
    const material2 = new THREE.MeshStandardMaterial({ color: 0x8395cd });
    const material3 = new THREE.MeshStandardMaterial({ color: 0x7ad0ac });

    this.circleFirst = new THREE.Mesh(geometry, material);
    this.circleSecond = new THREE.Mesh(geometry, material2);
    this.circleThird = new THREE.Mesh(geometry, material3);

    this.circleFirst.position.y = -0.29;

    this.circleSecond.position.y = -0.28;
    this.circleSecond.position.x = 2;

    this.circleThird.position.y = -0.27;

    this.circleFirst.scale.set(0, 0, 0);
    this.circleSecond.scale.set(0, 0, 0);
    this.circleThird.scale.set(0, 0, 0);

    this.circleFirst.rotation.x =
      this.circleSecond.rotation.x =
      this.circleThird.rotation.x =
        -Math.PI / 2;

    this.circleFirst.receiveShadow =
      this.circleSecond.receiveShadow =
      this.circleThird.receiveShadow =
        true;

    this.scene.add(this.circleFirst);
    this.scene.add(this.circleSecond);
    this.scene.add(this.circleThird);
  }
}
