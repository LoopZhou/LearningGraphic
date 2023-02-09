<template>
  <h1>Babylonjs Demo</h1>
  <canvas ref="babylonCanvas" class="baby-canvas"></canvas>
</template>

<script>
import {
  Scene,
  Engine,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  PointLight,
  MeshBuilder,
} from '@babylonjs/core';
import { onMounted, onUnmounted, ref } from 'vue';

export default {
  setup() {
    const babylonCanvas = ref(null);
    const scene = ref(null);
    const engine = ref(null);

    const createScene = () => {
      if (!babylonCanvas.value) {
        return;
      } // 初始化3D引擎

      engine.value = new Engine(babylonCanvas.value); // 创建一个场景

      scene.value = new Scene(engine.value); // 添加一个相机，并绑定鼠标事件

      const camera = new ArcRotateCamera(
        'Camera',
        Math.PI / 2,
        Math.PI / 2,
        2,
        new Vector3(0, 0, 5),
        scene.value
      );

      camera.attachControl(babylonCanvas.value, true); // 添加一组灯光到场景

      const light1 = new HemisphericLight(
        'light1',
        new Vector3(1, 1, 0),
        scene.value
      );

      const light2 = new PointLight(
        'light2',
        new Vector3(0, 1, -1),
        scene.value
      ); // 添加一个球体到场景中

      const sphere = MeshBuilder.CreateSphere(
        'sphere',
        { diameter: 2 },
        scene.value
      ); // 最后一步调用engine的runRenderLoop方案，执行scene.render()，让我们的3d场景渲染起来

      engine.value.runRenderLoop(() => {
        return scene.value && scene.value?.render();
      });
    };

    onMounted(() => {
      createScene();
    });
    // you need to return the ref to the babylonJS canvas
    return {
      babylonCanvas,
    };
  },
};
</script>
