import { defineStore } from 'pinia';

export const useRaytracerStore = defineStore({
  id: 'raytracer',
  state: () => {
    return {
      imageWidth: 800,
      imageHeight: 400,
      // imageWidth: 1280,
      // imageHeight: 720,
    };
  },
});
