import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    redirect: 'home',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home-index.vue'),
  },
  {
    path: '/render-triangle',
    name: 'render-triangle',
    component: () => import('@/views/render-triangle/index.vue'),
  },
  {
    path: '/color-triangle',
    name: 'color-triangle',
    component: () => import('@/views/color-triangle/index.vue'),
  },
  {
    path: '/three-tutorial/:example',
    name: 'three-tutorial',
    component: () => import('@/views/three-tutorial/index.vue'),
  },
  {
    path: '/donut',
    name: 'donut',
    component: () => import('@/views/donut/index.vue'),
  },
  {
    path: '/abigail-bloom',
    name: 'abigail-bloom',
    component: () => import('@/views/abigail-bloom/index.vue'),
  },
  {
    path: '/three-point',
    name: 'three-point',
    component: () => import('@/views/three-point/index.vue'),
  },
  {
    path: '/shader',
    name: 'shader',
    component: () => import('@/views/shader/index.vue'),
  },
  {
    path: '/babylonjs-demo',
    name: 'babylonjs-demo',
    component: () => import('@/views/babylonjs-demo/index.vue'),
    children: [
      {
        path: 'demo',
        component: () => import('@/views/babylonjs-demo/demo.vue'),
      },
      {
        path: 'setup',
        component: () => import('@/views/babylonjs-demo/setup.vue'),
      },
      {
        path: 'setup-new',
        component: () => import('@/views/babylonjs-demo/setup-new.vue'),
      },
    ],
  },
  {
    path: '/g6',
    name: 'g6',
    component: () => import('@/views/g6/index.vue'),
    children: [
      {
        path: 'demo',
        component: () => import('@/views/g6/demo.vue'),
      },
      {
        path: 'demo2',
        component: () => import('@/views/g6/demo2.vue'),
      },
      {
        path: 'demo3',
        component: () => import('@/views/g6/demo3.vue'),
      },
      {
        path: 'demo4',
        component: () => import('@/views/g6/demo4.vue'),
      },
      {
        path: 'demo5',
        component: () => import('@/views/g6/demo5.vue'),
      },
      {
        path: 'demo6',
        component: () => import('@/views/g6/demo6.vue'),
      },
      {
        path: 'demo7',
        component: () => import('@/views/g6/demo7.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
