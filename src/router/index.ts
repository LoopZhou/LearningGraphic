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
    path: '/fabric',
    name: 'fabric',
    component: () => import('@/views/fabric/index.vue'),
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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
