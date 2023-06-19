<template>
  <div id="mountNode"></div>
</template>

<script setup>
// 一般图layout
import { onMounted } from 'vue';
import G6 from '@antv/g6';

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
      // type: 'cubic-horizontal',
      sourceAnchor: 0,
    },
    {
      source: '2',
      target: '3',
      // type: 'cubic',
    },
    {
      source: '1',
      target: '3',
      label: 'node1->node3',
      sourceAnchor: 1,
      // type: 'line',
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
      // type: 'polyline',
      targetAnchor: 2,
      style: {
        stroke: '#000',
      },
    },
  ],
};

onMounted(() => {
  // 创建关系图
  const graph = new G6.Graph({
    container: 'mountNode',
    width: 800,
    height: 800,
    modes: {
      default: ['drag-canvas', 'zoom-canvas'],
    },
    defaultNode: {
      type: 'circle',
    },
    defaultEdge: {
      type: 'polyline',
      style: {
        stroke: '#F6BD16',
      },
    },
    layout: {
      // Object，可选，布局的方法及其配置项，默认为 random 布局。
      type: 'force', // random默认/force力学/circular环型/Radial辐射状/Grid表格 ……
      preventOverlap: true,
      nodeSize: 100,
    },
  });
  graph.data(data); // 读取数据源到图上
  graph.render(); // 渲染图
});
</script>
