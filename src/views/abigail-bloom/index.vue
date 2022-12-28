<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div :class="['abigail-bloom', isLightTheme ? 'light-theme' : 'dark-theme']">
    <div class="experience">
      <canvas class="experience-canvas"></canvas>
    </div>

    <!-- Preloader -->
    <div class="preloader">
      <div class="preloader-wrapper">
        <loading />
      </div>
    </div>

    <!-- Page -->
    <div class="page" asscroll-container>
      <theme-switch v-model="isLightTheme" @click="onChangeTheme" />

      <div class="page-wrapper" asscroll>
        <hero-section />

        <div class="first-move section-margin"></div>

        <section-part class="section-part" title="About Me" number="01">
          <template #detail>
            <h3 class="section-heading">Hello!</h3>
            <p class="section-text">
              Hi there 👋! I'm a third-year digital media student from UK
              currently studying in Germany. My dream is to work for Disney or
              Pixar one day.
            </p>
            <p class="section-text">
              I love creating art and playing with my cats! I also like drinking
              bubble tea and going for hikes! Totally hippie lol ✌️. Welcome to
              my portfolio!
            </p>
          </template>
        </section-part>

        <div class="second-move section-margin"></div>

        <section-part
          class="section-part"
          title="My Work"
          number="02"
          position="right"
          :theme="{
            color: 'var(--color-blue)',
          }"
        >
          <template #detail>
            <h3 class="section-heading">Candycane Village</h3>
            <p class="section-text">
              This project is in progress but it's about a super colorful
              village where the entire world including the people are candies.
              So far the story is that they are set out to explore their "space"
              only to realize it's a human that will try to destroy them.
            </p>
            <h3 class="section-heading">Rebecca's Reddish Radishes</h3>
            <p class="section-text">
              Oh what's that? Why, it's a red radish! Oop, another one! In this
              playful and comedy animation, Rebecca, a young farmer, decided to
              plant radishes for the first time, but there is a big twist!
            </p>
            <h3 class="section-heading">Flora</h3>
            <p class="section-text">
              A heartwarming story about a little orphan girl who tries to find
              her way back home.
            </p>
          </template>
        </section-part>

        <div class="third-move section-margin"></div>
        <section-part
          class="section-part"
          title="Contact Me"
          number="03"
          :theme="{
            color: 'var(--color-green)',
          }"
        >
          <template #detail>
            <h3 class="section-heading">ArtStation</h3>
            <p class="section-text">
              I post all my work here. I don't want to link it yet because I
              want to sort it out a little bit!
            </p>
            <h3 class="section-heading">Instagram</h3>
            <p class="section-text">
              Check out my personal instagram for travel pics and food and
              stuff.
            </p>
            <h3 class="section-heading">LinkedIn</h3>
            <p class="section-text">Career updates and so much more!</p>
          </template>
        </section-part>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Loading from './components/loading.vue';
import ThemeSwitch from './components/theme-switch.vue';
import HeroSection from './components/hero-section.vue';
import SectionPart from './components/section-part.vue';

const isLightTheme = ref(true);

const onChangeTheme = () => {
  console.log('onChangeTheme');
};

onMounted(() => {
  console.log('onMounted');
});
</script>

<style lang="less">
@import './style/theme.less';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

<style lang="less" scoped>
.abigail-bloom {
  .experience {
    position: fixed;
    width: 100vw;
    height: 100vh;

    .experience-canvas {
      width: 100%;
      height: 100%;
    }
  }

  .preloader {
    position: fixed;
    background-color: var(--color-background);
    width: 100%;
    height: 100vh;
    opacity: 0;
    z-index: 999999;

    .preloader-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }
  }

  .page {
    z-index: 99999;
    width: 100%;
    height: 100vh;
    // overflow: hidden;

    .page-wrapper {
      position: relative;
    }
  }

  .section-part {
    .section-heading {
      font-size: 18px;
      font-weight: 700;
      line-height: 1.8;
      margin-top: 64px;
      color: var(--color-text);
    }

    .section-text {
      line-height: 2;
      margin-top: 18px;
      font-size: 16px;
      color: var(--color-text);
    }
  }
}

.section-margin {
  height: 3000px;
  width: 100%;
}
</style>
