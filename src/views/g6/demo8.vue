<template>
  <div id="mountNode"></div>
</template>

<script setup>
// 节点和边的属性配置
import { onMounted } from 'vue';
import G6 from '@antv/g6';

const getPath = (startPoint, endPoint, maxRadius = 20) => {
  const { startX, startY } = startPoint;
  const { endX, endY } = endPoint;

  const diffX = Math.abs(startX - endX);
  const diffY = Math.abs(startY - endY);
  const radiusX = diffX / 2;
  const radiusY = diffY / 2;
  const radius =
    Math.min(radiusX, radiusY) > maxRadius
      ? maxRadius
      : Math.min(radiusX, radiusY);

  const middleX = (startX + endX) / 2;
  if (startX > endX && startY > endY) {
    return [
      ['M', startX, startY],
      ['L', middleX + radius, startY],
      ['A', radius, radius, 0, 0, 1, middleX, startY - radius],
      ['L', middleX, endY + radius],
      ['A', radius, radius, 0, 0, 0, middleX - radius, endY],
      ['L', endX, endY],
    ];
  }
  if (startX < endX && startY < endY) {
    return [
      ['M', startX, startY],
      ['L', middleX - radius, startY],
      ['A', radius, radius, 0, 0, 1, middleX, startY + radius],
      ['L', middleX, endY - radius],
      ['A', radius, radius, 0, 0, 0, middleX + radius, endY],
      ['L', endX, endY],
    ];
  }
  if (startX > endX && startY < endY) {
    return [
      ['M', startX, startY],
      ['L', middleX + radius, startY],
      ['A', radius, radius, 0, 0, 0, middleX, startY + radius],
      ['L', middleX, endY - radius],
      ['A', radius, radius, 0, 0, 1, middleX - radius, endY],
      ['L', endX, endY],
    ];
  }
  return [
    ['M', startX, startY],
    ['L', middleX - radius, startY],
    ['A', radius, radius, 0, 0, 0, middleX, startY - radius],
    ['L', middleX, endY + radius],
    ['A', radius, radius, 0, 0, 1, middleX + radius, endY],
    ['L', endX, endY],
  ];
};

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
  // 自定义边
  G6.registerEdge('customEdge', {
    draw(cfg, group) {
      const startPoint = cfg.startPoint;
      const endPoint = cfg.endPoint;

      const { x: sX, y: sY } = startPoint;
      const { x: eX, y: eY } = endPoint;
      // const startX = sX - 10;
      const startX = sX;
      const startY = sY;
      // const endX = eX + 10;
      const endX = eX;
      const endY = eY;
      const shape = group.addShape('path', {
        attrs: {
          stroke: '#333',
          // path: [
          //   ['M', startPoint.x, startPoint.y],
          //   ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y], // 三分之一处
          //   ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y], // 三分之二处
          //   ['L', endPoint.x, endPoint.y],
          // ],
          path: getPath(
            {
              startX,
              startY,
            },
            {
              endX,
              endY,
            }
          ),
        },
        // must be assigned in G6 3.3 and later versions. it can be any value you want
        name: 'path-shape',
      });
      return shape;
    },
  });

  // 创建关系图
  const graph = new G6.Graph({
    container: 'mountNode',
    width: 800,
    height: 800,
    // translate the graph to align the canvas's center, support by v3.5.1
    // fitCenter: true,
    // make the edge link to the centers of the end nodes
    // linkCenter: true,
    defaultNode: {
      type: 'circle',
    },
    defaultEdge: {
      type: 'customEdge',
      style: {
        stroke: '#F6BD16',
      },
    },
  });
  graph.data(data); // 读取数据源到图上
  graph.render(); // 渲染图
});
</script>
