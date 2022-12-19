<template>
  <div></div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
// import Base from './01-base-three';
// import SpotLightExample from './02-spot-light-shadow';

// const base = new SpotLightExample();

// http://localhost:4000/#/three-tutorial/01-base-three
// http://localhost:4000/#/three-tutorial/02-spot-light-shadow
const { example = '01-base-three' } = useRoute().params;
const exampleFile = await import(`./${example}`);
new exampleFile.default();
</script>
