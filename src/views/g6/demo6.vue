<template>
  <div id="container"></div>
</template>

<script setup>
// 自定义Dom节点
import { onMounted } from 'vue';
import G6 from '@antv/g6';

G6.registerNode('dom-node', {
  draw: (cfg, group) => {
    const stroke = cfg.style ? cfg.style.stroke || '#5B8FF9' : '#5B8FF9';
    const shape = group.addShape('dom', {
      attrs: {
        width: cfg.size[0],
        height: cfg.size[1],
        html: `
        <div id=${
          cfg.id
        } class='dom-node' style="background-color: #fff; border: 2px solid ${stroke}; border-radius: 5px; width: ${
          cfg.size[0] - 5
        }px; height: ${cfg.size[1] - 5}px; display: flex;">
          <div style="height: 100%; width: 33%; background-color: #CDDDFD">
            <img alt="" style="line-height: 100%; margin-left: 7px;" src="https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*Q_FQT6nwEC8AAAAAAAAAAABkARQnAQ" width="20" height="20" />  
          </div>
          <span style="margin:auto; padding:auto; color: #5B8FF9">${
            cfg.label
          }</span>
        </div>
          `,
      },
      draggable: true,
    });
    return shape;
  },
});

onMounted(() => {
  const container = document.getElementById('container');
  const width = container.scrollWidth;
  const height = container.scrollHeight || 500;
  const graph = new G6.Graph({
    container: 'container',
    width,
    height,
    modes: {
      default: ['drag-canvas', 'drag-node', 'zoom-canvas'],
    },
    fitView: true,
    fitCenter: true,
    renderer: 'svg',
    linkCenter: true,
    defaultNode: {
      type: 'dom-node',
      size: [120, 40],
    },
  });

  /** 数据 */
  const data = {
    nodes: [
      {
        id: 'node1',
        x: 10,
        y: 100,
        label: 'Homepage',
      },
      {
        id: 'node2',
        x: 200,
        y: 100,
        label: 'Subpage',
      },
    ],
    edges: [
      {
        source: 'node1',
        target: 'node2',
      },
    ],
  };

  graph.data(data);
  graph.render();
});
</script>
