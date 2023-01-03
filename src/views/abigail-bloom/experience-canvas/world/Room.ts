import * as THREE from 'three';
import GSAP from 'gsap';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Experience from '../Experience.js';
import Resources from '../utils/Resources.js';
import Time from '../utils/Time.js';
import { Texture } from 'three';
// import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export interface RoomChildren {
  [propName: string]: any;
}

export default class Room {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  time: Time;
  room: GLTF;
  actualRoom: THREE.Group;
  roomChildren: RoomChildren = {};
  lerp = {
    current: 0,
    target: 0,
    ease: 0.1,
  };
  mixer: THREE.AnimationMixer | undefined;
  swim: THREE.AnimationAction | undefined;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.room = this.resources.items.room as GLTF;
    this.actualRoom = this.room.scene;

    this.setModel();
    this.setAnimation();
    this.onMouseMove();
  }

  setModel() {
    this.actualRoom.children.forEach((child) => {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child instanceof THREE.Group) {
        child.children.forEach((groupchild) => {
          groupchild.castShadow = true;
          groupchild.receiveShadow = true;
        });
      }

      // console.log(child);

      if (child.name === 'Aquarium') {
        // console.log(child);
        const childrenAquarium: THREE.Mesh = child.children[0] as THREE.Mesh;
        childrenAquarium.material = new THREE.MeshPhysicalMaterial();
        Object.assign(childrenAquarium.material, {
          roughness: 0,
          ior: 3,
          transmission: 1,
          opacity: 1,
        });

        (childrenAquarium.material as THREE.MeshPhysicalMaterial).color.set(
          0x549dd2
        );
        /*
        child.children[0].material = new THREE.MeshPhysicalMaterial();
        child.children[0].material.roughness = 0;
        child.children[0].material.color.set(0x549dd2);
        child.children[0].material.ior = 3;
        child.children[0].material.transmission = 1;
        child.children[0].material.opacity = 1;
        */
      }

      if (child.name === 'Computer') {
        (child.children[1] as THREE.Mesh).material =
          new THREE.MeshBasicMaterial({
            map: this.resources.items.screen as Texture,
          });
      }

      if (child.name === 'Mini_Floor') {
        child.position.x = -0.289521;
        child.position.z = 8.83572;
      }

      // if (
      //     child.name === "Mailbox" ||
      //     child.name === "Lamp" ||
      //     child.name === "FloorFirst" ||
      //     child.name === "FloorSecond" ||
      //     child.name === "FloorThird" ||
      //     child.name === "Dirt" ||
      //     child.name === "Flower1" ||
      //     child.name === "Flower2"
      // ) {
      //     child.scale.set(0, 0, 0);
      // }

      child.scale.set(0, 0, 0);
      if (child.name === 'Cube') {
        child.scale.set(1, 1, 1);
        child.position.set(0, -1, 0);
        child.rotation.y = Math.PI / 4;
      }

      this.roomChildren[child.name.toLowerCase()] = child;
    });

    const width = 0.5;
    const height = 0.7;
    const intensity = 1;
    const rectLight = new THREE.RectAreaLight(
      0xffffff,
      intensity,
      width,
      height
    );
    rectLight.position.set(7.68244, 7, 0.5);
    rectLight.rotation.x = -Math.PI / 2;
    rectLight.rotation.z = Math.PI / 4;
    this.actualRoom.add(rectLight);

    this.roomChildren.rectLight = rectLight;

    // const rectLightHelper = new RectAreaLightHelper(rectLight);
    // rectLight.add(rectLightHelper);
    // console.log(this.room);

    this.scene.add(this.actualRoom);
    // this.actualRoom.scale.set(0.11, 0.11, 0.11);
    this.actualRoom.scale.set(0.11, 0.11, 0.11);
  }

  setAnimation() {
    this.mixer = new THREE.AnimationMixer(this.actualRoom);
    this.swim = this.mixer.clipAction(this.room.animations[0]);
    this.swim.play();
  }

  onMouseMove() {
    window.addEventListener('mousemove', (e) => {
      const rotation =
        ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
      this.lerp.target = rotation * 0.05;
    });
  }

  update() {
    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );

    this.actualRoom.rotation.y = this.lerp.current * 5;

    this.mixer?.update(this.time.delta * 0.0009);
  }
}
