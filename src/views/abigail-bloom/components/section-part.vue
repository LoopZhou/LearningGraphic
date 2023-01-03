<template>
  <section :class="['first-section', 'section', position]">
    <div
      :class="[
        'progress-wrapper',
        position === 'right'
          ? 'progress-bar-wrapper-right'
          : 'progress-bar-wrapper-left',
      ]"
    >
      <div class="progress-bar"></div>
    </div>

    <div class="section-intro-wrapper">
      <h1 class="section-title">
        <span class="section-title-text">{{ title }}</span>
        <div class="section-title-decoration styleOne"></div>
        <div class="section-title-decoration styleTwo"></div>
        <div class="section-title-decoration styleThree"></div>
      </h1>
      <span class="section-number">{{ number }}</span>
    </div>

    <div class="section-detail-wrapper">
      <slot name="detail"></slot>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  number: {
    type: String,
    default: '',
  },
  position: {
    type: String,
    default: 'left',
  },
  theme: {
    type: Object,
    default: () => ({
      color: 'var(--color-pink)',
    }),
  },
});

const themeborer = `2px solid ${props.theme.color}`;
</script>
<style lang="less" scoped>
.section {
  position: relative;
  width: 50%;
  padding: 1000px 4%;
  margin: 0;
  background-color: var(--color-background);
  overflow: hidden;
}

.left {
  margin-right: auto;
  border-top-right-radius: 700px 700px;
  border-bottom-right-radius: 0 0;
}

.right {
  margin-left: auto;
  border-top-left-radius: 700px 700px;
  border-bottom-left-radius: 0 0;
}

.progress-wrapper {
  height: 0;
  width: 12px;
  z-index: 9999;

  &.progress-bar-wrapper-left {
    position: absolute;
    top: 0;
    left: 0;
  }

  &.progress-bar-wrapper-right {
    position: absolute;
    top: 0;
    right: 0;
  }

  .progress-bar {
    height: 100vh;
    width: 100%;
    background-color: v-bind('theme.color');
    transform-origin: top center;
    transform: scaleY(1);
  }
}

.section-intro-wrapper {
  position: relative;
  padding: 20% 5%;
  border-bottom: 2px solid v-bind('theme.color');
  padding-bottom: 400px;

  .section-title {
    position: relative;
    color: v-bind('theme.color');

    .section-title-text {
      display: block;
      font-size: 40px;
      font-weight: 500;
      transform-origin: left;
      transform: skewY(25deg);
      z-index: 5;
      text-transform: uppercase;
      color: v-bind('theme.color');
    }

    .section-title-decoration {
      position: absolute;
      display: block;
      width: 100%;
      max-width: 278px;
      height: 60px;
      border: 1px solid v-bind('theme.color');
      transform-origin: left;
      transform: skewY(-25deg);
    }

    .styleOne {
      top: 0;
    }

    .styleTwo {
      top: 80px;
    }

    .styleThree {
      top: 80px;
      transform: skewY(25deg);
      background-color: v-bind('theme.color');
    }
  }

  .section-number {
    position: absolute;
    bottom: 15px;
    right: 0;
    color: v-bind('theme.color');
    font-size: 24px;
  }
}

.section-detail-wrapper {
  position: relative;
  padding: 20% 5%;
}
</style>
