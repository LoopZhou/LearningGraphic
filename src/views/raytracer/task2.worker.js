const appMsg = {
  render,
};

onmessage = function (e) {
  const { method, args = [] } = e.data;

  if (appMsg[method]) {
    appMsg[method](...args);
  } else {
    console.log(`taskWorker: can't find method (${method})`);
  }
};

function renderPixel(v) {
  v.r = v.g = v.b = v.a = 255;
}

function render(task) {
  const { pixels, width, height } = task;

  pixels.forEach((v, i) => {
    renderPixel(v, width, height);
  });
  postMessage({
    method: 'allComplete',
    args: [task],
  });
}
