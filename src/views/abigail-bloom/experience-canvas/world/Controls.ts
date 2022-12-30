import * as THREE from 'three';
import Experience from '../Experience.js';
import GSAP from 'gsap';
// @ts-ignore
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import ASScroll from '@ashthornton/asscroll';

import Sizes from '../utils/Sizes.js';
import Resources from '../utils/Resources.js';
import Time from '../utils/Time.js';
import Camera from '../Camera.js';
import { RoomChildren } from './Room';

export default class Controls {
  experience: Experience;
  scene: THREE.Scene;
  sizes: Sizes;
  resources: Resources;
  time: Time;
  camera: Camera;
  room: THREE.Group | undefined;
  roomChildren: RoomChildren | undefined;
  rectLight!: THREE.RectAreaLight;
  circleFirst: THREE.Mesh;
  circleSecond: THREE.Mesh;
  circleThird: THREE.Mesh;
  asscroll: ASScroll | undefined;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.room = this.experience.world.room?.actualRoom;
    this.room!.children.forEach((child) => {
      if (child.type === 'RectAreaLight') {
        this.rectLight = child as THREE.RectAreaLight;
      }
    });
    this.circleFirst = this.experience.world.floor!.circleFirst;
    this.circleSecond = this.experience.world.floor!.circleSecond;
    this.circleThird = this.experience.world.floor!.circleThird;

    GSAP.registerPlugin(ScrollTrigger);

    (document.querySelector('.page') as HTMLElement).style.overflow = 'visible';

    if (
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.setSmoothScroll();
    }
    this.setScrollTrigger();
  }

  setupASScroll(): ASScroll {
    // https://github.com/ashthornton/asscroll
    const asscroll = new ASScroll({
      ease: 0.5,
      disableRaf: true,
    });

    GSAP.ticker.add(asscroll.update);

    ScrollTrigger.defaults({
      scroller: asscroll.containerElement,
    });

    ScrollTrigger.scrollerProxy(asscroll.containerElement, {
      scrollTop(value: number) {
        if (arguments.length) {
          asscroll.currentPos = value;
          return;
        }
        return asscroll.currentPos;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      fixedMarkers: true,
    });

    asscroll.on('update', ScrollTrigger.update);
    ScrollTrigger.addEventListener('refresh', asscroll.resize);

    requestAnimationFrame(() => {
      asscroll.enable({
        newScrollElements: document.querySelectorAll(
          '.gsap-marker-start, .gsap-marker-end, [asscroll]'
        ),
      });
    });
    return asscroll;
  }

  setSmoothScroll() {
    this.asscroll = this.setupASScroll();
  }

  setScrollTrigger() {
    ScrollTrigger.matchMedia({
      //Desktop
      '(min-width: 969px)': () => {
        // console.log("fired desktop");

        this.room?.scale.set(0.11, 0.11, 0.11);
        this.rectLight.width = 0.5;
        this.rectLight.height = 0.7;
        this.camera.orthographicCamera.position.set(0, 6.5, 10);
        this.room?.position.set(0, 0, 0);
        // First section -----------------------------------------
        const firstMoveTimeline = GSAP.timeline({
          scrollTrigger: {
            trigger: '.first-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            // markers: true,
            invalidateOnRefresh: true,
          },
        });
        firstMoveTimeline.fromTo(
          this.room!.position,
          { x: 0, y: 0, z: 0 },
          {
            x: () => {
              return this.sizes.width * 0.0014;
            },
          }
        );

        // Second section -----------------------------------------
        const secondMoveTimeline = GSAP.timeline({
          scrollTrigger: {
            trigger: '.second-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
          .to(
            this.room!.position,
            {
              x: () => {
                return 1;
              },
              z: () => {
                return this.sizes.height * 0.0032;
              },
            },
            'same'
          )
          .to(
            this.room!.scale,
            {
              x: 0.4,
              y: 0.4,
              z: 0.4,
            },
            'same'
          )
          .to(
            this.rectLight,
            {
              width: 0.5 * 4,
              height: 0.7 * 4,
            },
            'same'
          );

        // Third section -----------------------------------------
        const thirdMoveTimeline = GSAP.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }).to(this.camera.orthographicCamera.position, {
          y: 1.5,
          x: -4.1,
        });
      },

      // Mobile
      '(max-width: 968px)': () => {
        // console.log("fired mobile");

        // Resets
        this.room?.scale.set(0.07, 0.07, 0.07);
        this.room?.position.set(0, 0, 0);
        this.rectLight.width = 0.3;
        this.rectLight.height = 0.4;
        this.camera.orthographicCamera.position.set(0, 6.5, 10);

        // First section -----------------------------------------
        const firstMoveTimeline = GSAP.timeline({
          scrollTrigger: {
            trigger: '.first-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            // invalidateOnRefresh: true,
          },
        }).to(this.room!.scale, {
          x: 0.1,
          y: 0.1,
          z: 0.1,
        });

        // Second section -----------------------------------------
        const secondMoveTimeline = GSAP.timeline({
          scrollTrigger: {
            trigger: '.second-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
          .to(
            this.room!.scale,
            {
              x: 0.25,
              y: 0.25,
              z: 0.25,
            },
            'same'
          )
          .to(
            this.rectLight,
            {
              width: 0.3 * 3.4,
              height: 0.4 * 3.4,
            },
            'same'
          )
          .to(
            this.room!.position,
            {
              x: 1.5,
            },
            'same'
          );

        // Third section -----------------------------------------
        const thirdMoveTimeline = GSAP.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }).to(this.room!.position, {
          z: -4.5,
        });
      },

      // all
      all: () => {
        const sections = document.querySelectorAll('.section');
        sections.forEach((section) => {
          const progressWrapper = section.querySelector('.progress-wrapper');
          const progressBar = section.querySelector('.progress-bar');

          if (section.classList.contains('right')) {
            GSAP.to(section, {
              borderTopLeftRadius: 10,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top top',
                scrub: 0.6,
              },
            });
            GSAP.to(section, {
              borderBottomLeftRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: 'bottom bottom',
                end: 'bottom top',
                scrub: 0.6,
              },
            });
          } else {
            GSAP.to(section, {
              borderTopRightRadius: 10,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top top',
                scrub: 0.6,
              },
            });
            GSAP.to(section, {
              borderBottomRightRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: 'bottom bottom',
                end: 'bottom top',
                scrub: 0.6,
              },
            });
          }
          GSAP.from(progressBar, {
            scaleY: 0,
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.4,
              pin: progressWrapper,
              pinSpacing: false,
            },
          });
        });

        // All animations
        // First section -----------------------------------------
        const firstCircle = GSAP.timeline({
          scrollTrigger: {
            trigger: '.first-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        }).to(this.circleFirst.scale, {
          x: 3,
          y: 3,
          z: 3,
        });

        // Second section -----------------------------------------
        const secondCircle = GSAP.timeline({
          scrollTrigger: {
            trigger: '.second-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        })
          .to(
            this.circleSecond.scale,
            {
              x: 3,
              y: 3,
              z: 3,
            },
            'same'
          )
          .to(
            this.room!.position,
            {
              y: 0.7,
            },
            'same'
          );

        // Third section -----------------------------------------
        const thirdCircle = GSAP.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        }).to(this.circleThird.scale, {
          x: 3,
          y: 3,
          z: 3,
        });

        // Mini Platform Animations
        const secondPartTimeline = GSAP.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'center center',
          },
        });

        let first, second, third, fourth, fifth, sixth, seventh, eighth, ninth;
        this.room?.children.forEach((child) => {
          if (child.name === 'Mini_Floor') {
            first = GSAP.to(child.position, {
              x: -5.44055,
              z: 13.6135,
              duration: 0.3,
            });
          }
          if (child.name === 'Mailbox') {
            second = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
            });
          }
          if (child.name === 'Lamp') {
            third = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 0.3,
            });
          }
          if (child.name === 'FloorFirst') {
            fourth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 0.3,
            });
          }
          if (child.name === 'FloorSecond') {
            fifth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
            });
          }
          if (child.name === 'FloorThird') {
            sixth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 0.3,
            });
          }
          if (child.name === 'Dirt') {
            seventh = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 0.3,
            });
          }
          if (child.name === 'Flower1') {
            eighth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 0.3,
            });
          }
          if (child.name === 'Flower2') {
            ninth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 0.3,
            });
          }
        });
        first && secondPartTimeline.add(first);
        second && secondPartTimeline.add(second);
        third && secondPartTimeline.add(third);
        fourth && secondPartTimeline.add(fourth, '-=0.2');
        fifth && secondPartTimeline.add(fifth, '-=0.2');
        sixth && secondPartTimeline.add(sixth, '-=0.2');
        seventh && secondPartTimeline.add(seventh, '-=0.2');
        eighth && secondPartTimeline.add(eighth);
        ninth && secondPartTimeline.add(ninth, '-=0.1');
      },
    });
  }
}
