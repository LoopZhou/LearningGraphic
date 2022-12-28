<template>
  <section class="hero">
    <div class="hero-wrapper">
      <!-- Intro Stuff -->
      <div class="intro-text">Welcome to my portfolio!</div>
      <div class="arrow-svg-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
          <path
            fill="currentColor"
            d="M12 14.95q-.2 0-.375-.063-.175-.062-.325-.212L6.675 10.05q-.275-.275-.262-.688.012-.412.287-.687.275-.275.7-.275.425 0 .7.275l3.9 3.9 3.925-3.925q.275-.275.688-.263.412.013.687.288.275.275.275.7 0 .425-.275.7l-4.6 4.6q-.15.15-.325.212-.175.063-.375.063Z"
          />
        </svg>
      </div>

      <div class="hero-main">
        <h1 class="hero-main-title">Abigail Bloom</h1>
        <p class="hero-main-description">Digital Media Student | 3D Artist</p>
      </div>

      <div class="hero-second">
        <p class="hero-second-subheading first-sub">AbigailBloom</p>
        <p class="hero-second-subheading second-sub">Portfolio</p>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
.hero {
  width: 100vw;
  height: 100vh;

  .hero-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    margin: 0 auto;
    max-width: 1100px;
  }

  .intro-text {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    font-weight: 500;
    font-size: 16px;
    color: var(--color-text);
    transform: translate(-50%, -50%);
  }

  .arrow-svg-wrapper {
    position: absolute;
    top: 90%;
    left: 50%;
    opacity: 0;
    color: var(--color-text);
    transform: translate(-50%, -50%);
    animation: bounce 0.5s ease-in alternate infinite;
  }

  .hero-main {
    position: absolute;
    bottom: 168px;
    left: 0;
    color: var(--color-text);

    .hero-main-title {
      font-size: 64px;
      color: var(--color-text);
    }

    .hero-main-description {
      font-size: 18px;
      color: var(--color-text);
    }
  }

  .hero-second {
    position: absolute;
    top: calc(50% - 120px);
    right: 0;
    color: var(--color-text);

    .hero-second-subheading {
      font-size: 32px;
      text-transform: uppercase;
      color: var(--color-text);
    }
  }
}
</style>
