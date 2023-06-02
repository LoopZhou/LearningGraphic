<template>
  <div>
    <canvas
      id="canvas"
      width="400"
      height="400"
      style="border: 1px solid #ccc"
    ></canvas>

    <canvas
      id="canvas2"
      width="400"
      height="400"
      style="border: 1px solid #ccc"
    ></canvas>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { fabric } from 'fabric';

function init() {
  const canvas = new fabric.Canvas('canvas');

  // 创建一个长方形
  const rect = new fabric.Rect({
    top: 30, // 距离容器顶部 30px
    left: 30, // 距离容器左侧 30px
    width: 100, // 宽 100px
    height: 60, // 高 60px
    fill: 'green', // 填充
  });

  // 圆形
  const circle = new fabric.Circle({
    radius: 30, // 圆的半径
    top: 30, // 距离容器顶部 20px
    left: 150, // 距离容器左侧 20px
    fill: 'pink', // 填充 粉色
  });

  // 文本
  const text = new fabric.Text('Hello World', {
    top: 200,
    left: 200,
    fontSize: 16,
    backgroundColor: 'green', // 背景色：绿色
    fill: 'orange', // 填充色：橙色
    stroke: '#f6416c', // 边框颜色：粉色
    strokeWidth: 1, // 边框粗细：1px
    strokeDashArray: [5, 2, 4], // 边框虚线规则：填充20px 空5px 填充14px 空20px 填充5px ……
    shadow: '10px 20px 6px rgba(10, 20, 30, 0.4)', // 投影：向右偏移10px，向下偏移20px，羽化6px，投影颜色及透明度
    transparentCorners: false, // 选中时，角是被填充了。true 空心；false 实心
    borderColor: '#16f1fc', // 选中时，边框颜色：天蓝
    borderScaleFactor: 1, // 选中时，边的粗细：5px
    borderDashArray: [20, 5, 10, 7], // 选中时，虚线边的规则
    cornerColor: '#a1de93', // 选中时，角的颜色是 青色
    cornerStrokeColor: 'pink', // 选中时，角的边框的颜色是 粉色
    cornerStyle: 'circle', // 选中时，叫的属性。默认rect 矩形；circle 圆形
    cornerSize: 20, // 选中时，角的大小为20
    cornerDashArray: [10, 2, 6], // 选中时，虚线角的规则
    selectionBackgroundColor: '#7f1300', // 选中时，选框的背景色：朱红
    padding: 2, // 选中时，选择框离元素的内边距
    borderOpacityWhenMoving: 0.6, // 当对象活动和移动时，对象控制边界的不透明度
  });

  // 可编辑文本
  const itext = new fabric.IText('abcde');
  canvas.add(itext);

  canvas.add(rect);
  canvas.add(circle);
  canvas.add(text);
  canvas.add(itext);

  // 不可交互
  const canvas2 = new fabric.StaticCanvas('canvas2');
  const rect2 = new fabric.Rect({
    top: 30, // 距离容器顶部 30px
    left: 30, // 距离容器左侧 30px
    width: 100, // 宽 100px
    height: 60, // 高 60px
    fill: 'red', // 填充 红色
  });

  canvas2.add(rect2);
}

onMounted(() => {
  init();
});
</script>
