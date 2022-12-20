<template>
  <div>
    <!-- <h2>渲染方式对比: 彩色三角形</h2> -->
    <!--
    <h3>triange - css</h3>
    <div class="triangle-css" />

    <h3>triange - svg</h3>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewport="0,0,200,100"
      width="200"
      height="100"
    >
      <polygon points="0,100 100,0 200,100" style="fill: red" />
    </svg>

    <h3>triange - canvas</h3>
    <canvas id="2d" width="200" height="100" />

    <h3>triange - webgl</h3>
    <canvas id="webgl" width="200" height="100" />
    -->

    <h3>triange - webgpu</h3>
    <canvas id="webgpu" width="200" height="100" />

    <!--
    <h3>triange - three</h3>
    <div id="three" style="width: 200px; height: 100px" />
    -->
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import WebGPU from './webgpu/index';

export default {
  name: 'ColorTriangle',
  setup() {
    const colorPicker = ref(null);

    onMounted(() => {
      new WebGPU();
    });
  },
};
</script>

<style lang="less" scoped>
.triangle-css {
  width: 0;
  height: 0;
  border-left: 100px solid transparent;
  border-right: 100px solid transparent;
  border-bottom: 100px solid red;
  border-top: 0;
}
</style>
