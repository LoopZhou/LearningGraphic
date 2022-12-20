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

const { example = '01-base-three' } = useRoute().params;
const exampleFile = await import(`./${example}`);
new exampleFile.default();
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
</style>
