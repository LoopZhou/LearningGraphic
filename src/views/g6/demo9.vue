<template>
  <button @click="switchMode">切换模式</button>
  <div id="mountNode"></div>
</template>

<script setup>
// Combo
import { onMounted, watch, ref } from 'vue';
import G6 from '@antv/g6';

const currentMode = ref('default');
const graph = ref(null);
const data = {
  // 点集
  nodes: [
    {
      id: '1',
      x: 100,
      y: 100,
      label: 'node1',
      comboId: 'rect_combo',
    },
    {
      id: '2',
      x: 100,
      y: 400,
      label: 'node2',
      size: 60,
    },
    {
      id: '3',
      x: 400,
      y: 400,
      label: 'node3',
      size: 60,
    },
    {
      id: '4',
      x: 400,
      y: 40,
      label: 'node4',
      size: 60,
      comboId: 'circle_combo',
    },
  ],
  // 边集
  edges: [
    {
      source: '1',
      target: '2',
    },
    {
      source: '2',
      target: '3',
    },
    {
      source: '1',
      target: '3',
    },
    {
      source: '4',
      target: '1',
    },
  ],
  combos: [
    {
      id: 'circle_combo',
      type: 'circle',
      label: 'Circle',
    },
    {
      id: 'rect_combo',
      type: 'rect',
      label: 'Rect',
    },
  ],
};

const switchMode = () => {
  if (currentMode.value === 'default') {
    currentMode.value = 'edit';
  } else {
    currentMode.value = 'default';
  }
};

watch(currentMode, () => {
  graph.value.setMode(currentMode.value);
});

onMounted(() => {
  // 创建关系图
  graph.value = new G6.Graph({
    container: 'mountNode',
    width: 800,
    height: 800,
    // translate the graph to align the canvas's center, support by v3.5.1
    // fitCenter: true,
    // make the edge link to the centers of the end nodes
    // linkCenter: true,
    fitView: true,
    fitViewPadding: 50,
    defaultNode: {
      type: 'circle',
      size: 60,
    },
    defaultEdge: {
      type: 'line',
      style: {
        stroke: '#F6BD16',
      },
    },
    modes: {
      // 支持的 behavior
      default: ['drag-canvas', 'zoom-canvas'],
      edit: ['click-select'],
    },
    // 必须将 groupByTypes 设置为 false，带有 combo 的图中元素的视觉层级才能合理
    groupByTypes: false,
  });
  graph.value.data(data); // 读取数据源到图上
  graph.value.render(); // 渲染图

  graph.value.on('nodeselectchange', (e) => {
    // 当前操作的 item
    console.log(e.target);
  });
});
</script>
