<template>
  <div class="loading">
    <div class="circle"></div>
    <div class="circle"></div>
    <div class="circle"></div>
  </div>
</template>

<style lang="less" scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;

  .circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin: 6px;
    background-color: var(--color-pink);
    animation: load 1s ease-in-out infinite;
  }

  .circle:nth-child(2) {
    animation-delay: 0.1s;
  }

  .circle:nth-child(3) {
    animation-delay: 0.2s;
  }
}

@keyframes load {
  0% {
    transform: translateY(0);
  }

  20% {
    transform: translateY(-12px);
  }

  40% {
    transform: translateY(0);
  }
}
</style>
