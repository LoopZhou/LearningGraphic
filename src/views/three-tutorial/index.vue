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
