<template>
  <div id="mountNode"></div>
</template>

<script setup>
// 基本示例
import { onMounted } from 'vue';
import G6 from '@antv/g6';

const data = {
  // 点集
  nodes: [
    {
      id: 'node1', // String，该节点存在则必须，节点的唯一标识
      x: 100, // Number，可选，节点位置的 x 值
      y: 200, // Number，可选，节点位置的 y 值
    },
    {
      id: 'node2', // String，该节点存在则必须，节点的唯一标识
      x: 300, // Number，可选，节点位置的 x 值
      y: 200, // Number，可选，节点位置的 y 值
      label: 'node2',
      type: 'circle',
      size: 60,
    },
  ],
  // 边集
  edges: [
    {
      source: 'node1', // String，必须，起始点 id
      target: 'node2', // String，必须，目标点 id
    },
  ],
};

onMounted(() => {
  // 创建关系图
  const graph = new G6.Graph({
    container: 'mountNode', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
    width: 800, // Number，必须，图的宽度
    height: 500, // Number，必须，图的高度
  });
  graph.data(data); // 读取数据源到图上
  graph.render(); // 渲染图
});
</script>
