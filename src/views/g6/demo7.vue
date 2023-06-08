<template>
  <div id="container"></div>
  <div id="minimap"></div>
</template>

<script setup>
// 插件的使用
import { onMounted } from 'vue';
import G6 from '@antv/g6';

const treeData = {
  id: 'root',
  label: 'Root',
  children: [
    {
      id: 'SubTreeNode1',
      label: 'subroot1',
      children: [
        {
          id: 'SubTreeNode1.1',
          label: 'subroot1.1',
        },
      ],
    },
    {
      id: 'SubTreeNode2',
      label: 'subroot2',
      children: [
        {
          id: 'SubTreeNode2.1',
          label: 'subroot2.1',
        },
        {
          id: 'SubTreeNode2.2',
          label: 'subroot2.2',
        },
      ],
    },
  ],
};

let graph = null;

onMounted(() => {
  // 创建关系图
  if (!graph) {
    const grid = new G6.Grid();
    const minimap = new G6.Minimap({
      size: [100, 100],
      container: 'minimap',
      type: 'delegate',
    });

    graph = new G6.TreeGraph({
      container: 'container',
      width: 500,
      height: 500,
      modes: {
        default: ['drag-canvas'],
      },
      defaultEdge: {
        shape: 'cubic-horizontal',
        style: {
          stroke: '#A3B1BF',
        },
      },
      defaultNode: {
        shape: 'rect',
        labelCfg: {
          style: {
            fill: '#000000A6',
            fontSize: 10,
          },
        },
        style: {
          stroke: '#72CC4A',
          width: 150,
        },
      },
      layout: {
        type: 'dendrogram', // 布局类型
        direction: 'LR', // 自左至右布局，可选的有 H / V / LR / RL / TB / BT
        nodeSep: 50, // 节点之间间距
        rankSep: 200, // 每个层级之间的间距
      },
      plugins: [grid, minimap], // 配置 Grid 插件和 Minimap 插件
    });
  }
  graph.data(treeData);
  graph.render();
  graph.fitView();
});
</script>

<style lang="less" scoped>
#minimap {
  height: 100px;
  width: 200px;
  background: white;
  position: absolute;
  top: 16px;
  left: 16px;
  opacity: 0.5;
  z-index: 99;
}
</style>
