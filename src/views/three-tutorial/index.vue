<template>
  <div></div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
// http://localhost:4000/#/three-tutorial/01-base-three
// http://localhost:4000/#/three-tutorial/02-spot-light-shadow
// http://localhost:4000/#/three-tutorial/03-gui
// http://localhost:4000/#/three-tutorial/04-instance-raycaster
// http://localhost:4000/#/three-tutorial/05-omitPhysics
// http://localhost:4000/#/three-tutorial/06-shadow-map-viewer
// http://localhost:4000/#/three-tutorial/07-animation
// http://localhost:4000/#/three-tutorial/08-gltf-loader
// http://localhost:4000/#/three-tutorial/09-skinning-blending
// http://localhost:4000/#/three-tutorial/10-littlest-tokyo
// http://localhost:4000/#/three-tutorial/11-clipping
// http://localhost:4000/#/three-tutorial/12-texture
// http://localhost:4000/#/three-tutorial/13-shader-plane
// http://localhost:4000/#/three-tutorial/14-shader-cube
// http://localhost:4000/#/three-tutorial/15-shader-lava
// http://localhost:4000/#/three-tutorial/16-shader-posteffect

const { example = '01-base-three' } = useRoute().params;
const importModules = import.meta.globEager('./*.ts');
const current = importModules[`./${example}.ts`];
if (current) {
  new current.default();
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
</style>
