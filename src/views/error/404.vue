<template>
  <main class="error-page not-found-page">
    <div class="star star-one"></div>
    <div class="star star-two"></div>
    <div class="star star-three"></div>
    <section class="error-content">
      <p class="error-eyebrow">{{ $t('error.eyebrow404') }}</p>
      <h1 class="error-code">404</h1>
      <h2 class="error-title">{{ $t('error.title404') }}</h2>
      <p class="error-desc">{{ $t('error.desc404') }}</p>
      <div class="error-actions">
        <el-button type="primary" round size="large" @click="goHome">{{ $t('error.backToModuleSelect') }}</el-button>
        <el-button round size="large" @click="goBack">{{ $t('error.backToPrev') }}</el-button>
      </div>
    </section>
    <section class="error-visual" aria-hidden="true">
      <div class="planet">
        <div class="planet-ring"></div>
        <div class="planet-glow"></div>
      </div>
      <div class="path-line"></div>
      <div class="dot dot-one"></div>
      <div class="dot dot-two"></div>
      <div class="dot dot-three"></div>
    </section>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.replace('/module-select')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }
  goHome()
}
</script>

<style scoped>
.error-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(320px, 560px) minmax(280px, 1fr);
  align-items: center;
  gap: 48px;
  padding: 72px clamp(28px, 7vw, 96px);
  color: #172033;
  background:
    radial-gradient(circle at 20% 20%, rgba(96, 165, 250, 0.18), transparent 30%),
    radial-gradient(circle at 82% 18%, rgba(168, 85, 247, 0.16), transparent 28%),
    linear-gradient(135deg, #f8fbff 0%, #f4f7ff 46%, #eef2ff 100%);
}

.error-content {
  position: relative;
  z-index: 2;
}

.error-eyebrow {
  margin: 0 0 16px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-size: 13px;
  font-weight: 700;
  color: #4f46e5;
}

.error-code {
  margin: 0;
  font-size: clamp(96px, 16vw, 188px);
  line-height: 0.86;
  letter-spacing: -0.08em;
  color: transparent;
  background: linear-gradient(135deg, #1d4ed8, #60a5fa 42%, #a855f7);
  -webkit-background-clip: text;
  background-clip: text;
}

.error-title {
  margin: 28px 0 14px;
  font-size: clamp(28px, 4vw, 44px);
  line-height: 1.12;
  font-weight: 800;
}

.error-desc {
  max-width: 520px;
  margin: 0;
  font-size: 16px;
  line-height: 1.8;
  color: #64748b;
}

.error-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 34px;
}

.error-visual {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  min-height: 420px;
}

.planet {
  position: relative;
  width: min(40vw, 300px);
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.95) 0 10%, transparent 11%),
    linear-gradient(145deg, #93c5fd 0%, #6366f1 56%, #312e81 100%);
  box-shadow:
    0 34px 70px rgba(59, 130, 246, 0.22),
    inset -24px -34px 50px rgba(30, 41, 59, 0.28);
}

.planet-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 138%;
  height: 32%;
  transform: translate(-50%, -50%) rotate(-14deg);
  border: 16px solid rgba(255, 255, 255, 0.72);
  border-left-color: rgba(96, 165, 250, 0.28);
  border-right-color: rgba(168, 85, 247, 0.22);
  border-radius: 50%;
  box-shadow: 0 18px 38px rgba(79, 70, 229, 0.12);
}

.planet-glow {
  position: absolute;
  inset: -36px;
  z-index: -1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.2), transparent 68%);
}

.path-line {
  position: absolute;
  width: 62%;
  height: 42%;
  border-top: 2px dashed rgba(79, 70, 229, 0.28);
  border-radius: 50%;
  transform: rotate(-24deg);
}

.dot,
.star {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
}

.dot {
  width: 10px;
  height: 10px;
  background: #4f46e5;
  box-shadow: 0 0 18px rgba(79, 70, 229, 0.45);
}

.dot-one {
  right: 18%;
  top: 20%;
}

.dot-two {
  left: 16%;
  bottom: 26%;
  background: #60a5fa;
}

.dot-three {
  right: 28%;
  bottom: 16%;
  background: #a855f7;
}

.star {
  background: rgba(79, 70, 229, 0.18);
}

.star-one {
  width: 190px;
  height: 190px;
  left: -64px;
  bottom: -70px;
}

.star-two {
  width: 96px;
  height: 96px;
  left: 47%;
  top: 12%;
  background: rgba(96, 165, 250, 0.16);
}

.star-three {
  width: 320px;
  height: 320px;
  right: -150px;
  top: -130px;
  background: rgba(168, 85, 247, 0.12);
}

@media (max-width: 860px) {
  .error-page {
    grid-template-columns: 1fr;
    gap: 12px;
    padding-top: 56px;
  }

  .error-visual {
    min-height: 260px;
  }

  .planet {
    width: 220px;
  }
}
</style>
