<template>
  <button @click="switchMode">切换模式</button>
  <div id="mountNode"></div>
</template>

<script setup>
// 交互模式
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
      type: 'rect',
      anchorPoints: [
        [0, 1],
        [1, 1],
        [1, 0],
      ],
      style: {
        fill: 'gray',
      },
    },
    {
      id: '2',
      x: 100,
      y: 400,
      label: 'node2',
      type: 'circle',
      size: 60,
    },
    {
      id: '3',
      x: 400,
      y: 400,
      label: 'node3',
      type: 'triangle',
      size: 10,
    },
    {
      id: '4',
      x: 400,
      y: 40,
      label: 'node4',
      type: 'diamond',
      size: 60,
    },
  ],
  // 边集
  edges: [
    {
      source: '1',
      target: '2',
      type: 'cubic-horizontal',
      sourceAnchor: 0,
    },
    {
      source: '2',
      target: '3',
      type: 'cubic',
    },
    {
      source: '1',
      target: '3',
      label: 'node1->node3',
      sourceAnchor: 1,
      type: 'line',
      style: {
        startArrow: {
          path: G6.Arrow.diamond(10, 10),
          fill: '#ccc',
          stroke: '#0f0',
        },
        endArrow: true,
      },
    },
    {
      source: '4',
      target: '1',
      label: 'node1->node4',
      type: 'polyline',
      targetAnchor: 2,
      style: {
        stroke: '#000',
      },
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
    },
    defaultEdge: {
      type: 'polyline',
      style: {
        stroke: '#F6BD16',
      },
    },
    modes: {
      // 支持的 behavior
      default: ['drag-canvas', 'zoom-canvas'],
      edit: ['click-select'],
    },
  });
  graph.value.data(data); // 读取数据源到图上
  graph.value.render(); // 渲染图

  graph.value.on('nodeselectchange', (e) => {
    // 当前操作的 item
    console.log(e.target);
  });
});
</script>
