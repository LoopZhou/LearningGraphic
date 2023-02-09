import * as THREE from 'three';
import { EventEmitter } from 'events';
import Experience from '../Experience.js';
import Sizes from '../utils/Sizes';
import Resources from '../utils/Resources.js';
import Camera from '../Camera.js';

import Floor from './Floor.js';
import Environment from './Environment.js';
import Room from './Room.js';

export default class World extends EventEmitter {
  experience: Experience;
  sizes: Sizes;
  scene: THREE.Scene;
  canvas: HTMLCanvasElement;
  camera: Camera;
  floor: Floor | undefined;
  environment: Environment | undefined;
  room: Room | undefined;
  resources: Resources;

  constructor() {
    super();
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;
    this.resources = this.experience.resources;

    this.environment = new Environment();
    this.floor = new Floor();
    // load scene
    this.resources.on('ready', () => {
      this.room = new Room();
      this.emit('worldready');
    });
  }

  update() {
    if (this.room) {
      this.room.update();
    }
  }
}
