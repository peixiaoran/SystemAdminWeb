<template>
  <div class="error-page">
    <div class="bg-dots" />
    <div class="content-wrapper">
      <div class="icon-area">
        <svg class="shield-icon" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M60 10L15 30V55C15 82.5 34.5 108 60 115C85.5 108 105 82.5 105 55V30L60 10Z"
            fill="url(#shieldGrad)"
            opacity="0.08"
          />
          <path
            d="M60 16L21 33.5V55C21 79.5 38.4 103.2 60 109.5C81.6 103.2 99 79.5 99 55V33.5L60 16Z"
            stroke="url(#shieldStroke)"
            stroke-width="1.5"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M60 45V70"
            stroke="#1a1a1a"
            stroke-width="3.5"
            stroke-linecap="round"
            opacity="0.6"
          />
          <circle cx="60" cy="80" r="2.5" fill="#1a1a1a" opacity="0.6" />
          <defs>
            <linearGradient id="shieldGrad" x1="15" y1="10" x2="105" y2="115">
              <stop offset="0%" stop-color="#1a1a1a" />
              <stop offset="100%" stop-color="#606060" />
            </linearGradient>
            <linearGradient id="shieldStroke" x1="15" y1="10" x2="105" y2="115">
              <stop offset="0%" stop-color="#1a1a1a" />
              <stop offset="100%" stop-color="#909090" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div class="text-area">
        <h1 class="error-code">403</h1>
        <h2 class="error-title">{{ $t('error.title403') }}</h2>
        <p class="error-desc">{{ $t('error.desc403Line1') }}</p>
        <p class="error-desc secondary">{{ $t('error.desc403Line2') }}</p>
      </div>

      <div class="action-area">
        <button class="btn-back" @click="goBack">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ $t('error.backToPrev') }}
        </button>
        <button class="btn-home" @click="goHome">
          {{ $t('error.returnToHomeBase') }}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 13L11 8L6 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.replace('/login')
  }
}

const goHome = () => {
  router.replace('/module-select')
}
</script>

<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #fafafa;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.bg-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, #d0d0d0 0.8px, transparent 0.8px);
  background-size: 28px 28px;
  opacity: 0.5;
  mask-image: radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 100%);
}

.content-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.icon-area {
  margin-bottom: 12px;
  animation: gentleFloat 6s ease-in-out infinite;
}

@keyframes gentleFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.shield-icon {
  width: 110px;
  height: 110px;
}

.text-area {
  margin-bottom: 40px;
}

.error-code {
  font-size: 80px;
  font-weight: 200;
  letter-spacing: -2px;
  margin: 0 0 4px;
  line-height: 1;
  background: linear-gradient(135deg, #1a1a1a 0%, #999 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-title {
  font-size: 20px;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0 0 20px;
  letter-spacing: 0.5px;
}

.error-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 6px;
  line-height: 1.7;
  max-width: 400px;
}

.error-desc.secondary {
  color: #999;
  font-size: 13px;
}

.action-area {
  display: flex;
  gap: 14px;
}

.btn-back,
.btn-home {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-back {
  background: #fff;
  color: #1a1a1a;
  border: 1px solid #e5e5e5;
}

.btn-back:hover {
  background: #f5f5f5;
  border-color: #d0d0d0;
}

.btn-home {
  background: #1a1a1a;
  color: #fff;
  border: none;
  box-shadow: 0 4px 12px rgba(26, 26, 26, 0.15);
}

.btn-home:hover {
  background: #333;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(26, 26, 26, 0.2);
}

.btn-back:active,
.btn-home:active {
  transform: translateY(0);
}

@media (max-width: 480px) {
  .error-code {
    font-size: 60px;
  }
  .action-area {
    flex-direction: column;
  }
  .content-wrapper {
    padding: 24px;
  }
}
</style>
