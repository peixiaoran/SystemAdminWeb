<template>
  <main class="error-page forbidden-page">
    <div class="error-orbit error-orbit-one"></div>
    <div class="error-orbit error-orbit-two"></div>
    <section class="error-content">
      <p class="error-eyebrow">{{ $t('error.eyebrow403') }}</p>
      <h1 class="error-code">403</h1>
      <h2 class="error-title">{{ $t('error.title403') }}</h2>
      <p class="error-desc">{{ $t('error.desc403') }}</p>
      <div class="error-actions">
        <el-button type="primary" round size="large" @click="goHome">{{ $t('error.backToModuleSelect') }}</el-button>
        <el-button round size="large" @click="goBack">{{ $t('error.backToPrev') }}</el-button>
      </div>
    </section>
    <section class="error-visual" aria-hidden="true">
      <div class="shield">
        <div class="shield-lock">
          <span></span>
        </div>
      </div>
      <div class="pulse pulse-one"></div>
      <div class="pulse pulse-two"></div>
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
    radial-gradient(circle at 14% 18%, rgba(245, 158, 11, 0.22), transparent 30%),
    radial-gradient(circle at 84% 18%, rgba(59, 130, 246, 0.16), transparent 28%),
    linear-gradient(135deg, #fffaf0 0%, #f8fafc 46%, #eef6ff 100%);
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
  color: #b45309;
}

.error-code {
  margin: 0;
  font-size: clamp(96px, 16vw, 188px);
  line-height: 0.86;
  letter-spacing: -0.08em;
  color: transparent;
  background: linear-gradient(135deg, #92400e, #f59e0b 45%, #2563eb);
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

.shield {
  position: relative;
  width: min(42vw, 320px);
  aspect-ratio: 0.82;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(255, 247, 237, 0.72));
  clip-path: polygon(50% 0, 88% 14%, 82% 68%, 50% 100%, 18% 68%, 12% 14%);
  filter: drop-shadow(0 30px 45px rgba(146, 64, 14, 0.2));
}

.shield::before {
  content: '';
  position: absolute;
  inset: 16px;
  clip-path: inherit;
  background: linear-gradient(145deg, rgba(251, 191, 36, 0.24), rgba(37, 99, 235, 0.18));
}

.shield-lock {
  position: absolute;
  left: 50%;
  top: 47%;
  width: 84px;
  height: 66px;
  transform: translate(-50%, -50%);
  border-radius: 22px;
  background: #1e293b;
  box-shadow: inset 0 -10px 0 rgba(255, 255, 255, 0.08);
}

.shield-lock::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 52px;
  width: 48px;
  height: 42px;
  transform: translateX(-50%);
  border: 10px solid #1e293b;
  border-bottom: 0;
  border-radius: 28px 28px 0 0;
}

.shield-lock span {
  position: absolute;
  left: 50%;
  top: 27px;
  width: 10px;
  height: 22px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: #fbbf24;
}

.pulse,
.error-orbit {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
}

.pulse-one {
  width: 128px;
  height: 128px;
  right: 16%;
  top: 16%;
  background: rgba(245, 158, 11, 0.16);
}

.pulse-two {
  width: 74px;
  height: 74px;
  left: 14%;
  bottom: 18%;
  background: rgba(37, 99, 235, 0.12);
}

.error-orbit-one {
  width: 340px;
  height: 340px;
  left: -120px;
  bottom: -140px;
  border: 1px solid rgba(245, 158, 11, 0.18);
}

.error-orbit-two {
  width: 520px;
  height: 520px;
  right: -220px;
  top: -180px;
  border: 1px solid rgba(37, 99, 235, 0.14);
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

  .shield {
    width: 220px;
  }
}
</style>
