import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// reference: https://github.com/ksbisht941/threejs-donut
export default class DonutRender {
  scene: THREE.Scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
  renderer: THREE.WebGLRenderer | undefined;

  ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 0.8);
  directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(
    0xffffff,
    1
  );
  spotLight: THREE.SpotLight = new THREE.SpotLight(0xffffff, 1);
  donut: THREE.Group | undefined;
  sphereShadow: THREE.Mesh | undefined;
  clock: THREE.Clock = new THREE.Clock();

  currentSection = 0;
  transformDonut = [
    {
      rotationZ: 0.45,
      positionX: 1.5,
    },
    {
      rotationZ: -0.45,
      positionX: -1.5,
    },
    {
      rotationZ: 0.0314,
      positionX: 0,
    },
  ];
  uniforms = {
    uAlpha: {
      value: 1.0,
    },
  };

  constructor() {
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
    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);
  }

  initRender(): void {
    const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  initScene(): void {
    this.initLight();
    this.initMesh();
    this.loadModel();
  }

  initLight(): void {
    this.scene.add(this.ambientLight);

    this.directionalLight.position.set(1, 2, 0);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);
  }

  initMesh(): void {
    // 模拟阴影
    const textureLoader = new THREE.TextureLoader();
    const alphaShadow = textureLoader.load('textures/simpleShadow.jpg');
    this.sphereShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.5),
      new THREE.MeshBasicMaterial({
        transparent: true,
        color: 0x000000,
        opacity: 0.5,
        alphaMap: alphaShadow,
      })
    );
    this.sphereShadow.rotation.x = -Math.PI * 0.5;
    this.sphereShadow.position.y = -1;
    this.sphereShadow.position.x = 1.5;
    this.scene.add(this.sphereShadow);

    // 蒙版，通过调整uAlpha是否显示canvas
    const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    const overlayMaterial = new THREE.ShaderMaterial({
      vertexShader: `
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `,
      fragmentShader: `
            uniform float uAlpha;
            void main() {
                gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
            }
        `,
      uniforms: this.uniforms,
      transparent: true,
    });
    const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
    this.scene.add(overlay);
  }

  loadModel(): void {
    const loadingBarElement = document.querySelector(
      '.loading-bar'
    ) as HTMLElement;
    const loadingManager = new THREE.LoadingManager(
      () => {
        // 加载完成
        setTimeout(() => {
          // 去掉canvas蒙版
          gsap.to(this.uniforms.uAlpha, {
            duration: 1.5,
            ease: 'power2.inOut',
            value: 0,
          });
          // loading动画结束
          loadingBarElement.classList.add('ended');
          loadingBarElement.style.transform = '';
        }, 500);
      },
      (itemUrl, itemsLoaded, itemsTotal) => {
        // 加载过程中：（当前资源，已加载资源，资源总数）
        // eslint-disable-next-line no-console
        console.log('progress', itemUrl, itemsLoaded, itemsTotal);
        const progressRatio = itemsLoaded / itemsTotal;
        loadingBarElement.style.transform = `scaleX(${progressRatio})`;
      }
    );
    new GLTFLoader(loadingManager)
      .setPath('models/gltf/donut/')
      .load('scene.gltf', (gltf) => {
        this.donut = gltf.scene;
        const radius = 8.5;
        this.donut.position.x = 1.5;
        this.donut.rotation.x = Math.PI * 0.2;
        this.donut.rotation.z = Math.PI * 0.15;
        this.donut.scale.set(radius, radius, radius);
        this.scene.add(this.donut);
      });
  }

  initListener(): void {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer?.setSize(window.innerWidth, window.innerHeight);
    });

    const donutElement = document.querySelector('.donut') as HTMLElement;
    donutElement.addEventListener('scroll', () => {
      const { scrollTop } = donutElement;
      const newSection = Math.round(scrollTop / window.innerHeight);

      if (newSection !== this.currentSection) {
        this.currentSection = newSection;

        if (this.donut && this.sphereShadow) {
          gsap.to(this.donut.rotation, {
            duration: 1.5,
            ease: 'power2.inOut',
            z: this.transformDonut[this.currentSection].rotationZ,
          });
          gsap.to(this.donut.position, {
            duration: 1.5,
            ease: 'power2.inOut',
            x: this.transformDonut[this.currentSection].positionX,
          });

          gsap.to(this.sphereShadow.position, {
            duration: 1.5,
            ease: 'power2.inOut',
            x: this.transformDonut[this.currentSection].positionX - 0.2,
          });
        }
      }
    });
  }

  // 渲染
  render(): void {
    if (this.renderer) {
      const elapsedTime = this.clock.getElapsedTime();
      if (this.donut && this.sphereShadow) {
        this.donut.position.y = Math.sin(elapsedTime * 0.5) * 0.1 - 0.1;
        Object.assign(this.sphereShadow.material, {
          opacity: (1 - Math.abs(this.donut.position.y)) * 0.3,
        });
      }

      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(() => {
        this.render();
      });
    }
  }
}
