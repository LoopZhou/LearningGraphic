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
    path: '/tsx-test',
    name: 'tsx',
    component: () => import('@/views/tsx-test'),
  },
  {
    path: '/raytracer',
    name: 'raytracer',
    component: () => import('@/views/raytracer-canvas.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
