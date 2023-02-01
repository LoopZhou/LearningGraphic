varying vec2 vUv;

// 图层混合
void main () {
  // 渐变： 横向黑色->红色（0-1）
  // gl_FragColor = vec4(vUv.x, 0.0, 0.0, 1.0);

  // 渐变： 纵向红色->黑色 (1-0)
  // gl_FragColor = vec4(vUv.y, 0.0, 0.0, 1.0);

  // step函数: 一半黑色， 一半红色
  // float x = step(0.5, vUv.x);
  // gl_FragColor = vec4(x, 0, 0, 1);

  // smoothstep: 从0.4-0.6有黑色到红色的过滤效果
  // float x = smoothstep(0.4, 0.6, vUv.x);
  // gl_FragColor = vec4(x, 0, 0, 1);

  // sin: 从黑到红
  // float x = sin(vUv.x);
  // gl_FragColor = vec4(x, 0, 0, 1);

  // cos
  // float x = cos(vUv.x);
  // gl_FragColor = vec4(x, 0, 0, 1);

  // sin增加频率，黑红条纹
  // float x = sin(vUv.x * 20.0);
  // gl_FragColor = vec4(x, 0, 0, 1);

  // 渐变： 
  //     绿色 黄色
  //     黑色 红色
  gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
}