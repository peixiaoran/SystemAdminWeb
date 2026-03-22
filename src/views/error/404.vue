<template>
  <div class="error-page">
    <div class="bg-dots" />
    <canvas ref="starsCanvas" class="stars-canvas" />
    <div class="content-wrapper">
      <div class="icon-area">
        <svg class="planet-icon" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="70" cy="70" r="32" fill="url(#planetGrad)" opacity="0.1" />
          <circle cx="70" cy="70" r="32" stroke="url(#planetStroke)" stroke-width="1.5" opacity="0.35" />
          <ellipse
            cx="70" cy="70" rx="52" ry="14"
            stroke="url(#ringStroke)"
            stroke-width="1.2"
            opacity="0.25"
            transform="rotate(-20 70 70)"
          />
          <circle cx="62" cy="62" r="5" fill="#1a1a1a" opacity="0.06" />
          <circle cx="78" cy="74" r="3.5" fill="#1a1a1a" opacity="0.05" />
          <circle cx="66" cy="80" r="2.5" fill="#1a1a1a" opacity="0.04" />
          <circle class="star star-1" cx="20" cy="28" r="1.2" fill="#1a1a1a" opacity="0.2" />
          <circle class="star star-2" cx="118" cy="38" r="1" fill="#1a1a1a" opacity="0.15" />
          <circle class="star star-3" cx="30" cy="108" r="0.8" fill="#1a1a1a" opacity="0.18" />
          <circle class="star star-4" cx="112" cy="100" r="1.1" fill="#1a1a1a" opacity="0.12" />
          <circle class="star star-5" cx="45" cy="18" r="0.6" fill="#1a1a1a" opacity="0.2" />
          <defs>
            <linearGradient id="planetGrad" x1="38" y1="38" x2="102" y2="102">
              <stop offset="0%" stop-color="#1a1a1a" />
              <stop offset="100%" stop-color="#606060" />
            </linearGradient>
            <linearGradient id="planetStroke" x1="38" y1="38" x2="102" y2="102">
              <stop offset="0%" stop-color="#1a1a1a" />
              <stop offset="100%" stop-color="#909090" />
            </linearGradient>
            <linearGradient id="ringStroke" x1="18" y1="70" x2="122" y2="70">
              <stop offset="0%" stop-color="transparent" />
              <stop offset="30%" stop-color="#1a1a1a" />
              <stop offset="70%" stop-color="#1a1a1a" />
              <stop offset="100%" stop-color="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div class="text-area">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">{{ $t('error.title404') }}</h2>
        <p class="error-desc">{{ $t('error.desc404Line1') }}</p>
        <p class="error-desc secondary">{{ $t('error.desc404Line2') }}</p>
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const starsCanvas = ref(null)
let animationId = null

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

onMounted(() => {
  const canvas = starsCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let width = canvas.width = window.innerWidth
  let height = canvas.height = window.innerHeight

  const particles = Array.from({ length: 35 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.2 + 0.3,
    dx: (Math.random() - 0.5) * 0.15,
    dy: (Math.random() - 0.5) * 0.15,
    opacity: Math.random() * 0.15 + 0.05,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.008 + 0.003
  }))

  const draw = () => {
    ctx.clearRect(0, 0, width, height)
    particles.forEach(p => {
      p.x += p.dx
      p.y += p.dy
      p.pulse += p.pulseSpeed
      if (p.x < 0) p.x = width
      if (p.x > width) p.x = 0
      if (p.y < 0) p.y = height
      if (p.y > height) p.y = 0
      const alpha = p.opacity + Math.sin(p.pulse) * 0.04
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(26, 26, 26, ${Math.max(0, alpha)})`
      ctx.fill()
    })
    animationId = requestAnimationFrame(draw)
  }

  const handleResize = () => {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
  }
  window.addEventListener('resize', handleResize)
  draw()

  onBeforeUnmount(() => {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('resize', handleResize)
  })
})
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

.stars-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
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

.planet-icon {
  width: 130px;
  height: 130px;
}

.star {
  animation: twinkle 3s ease-in-out infinite;
}
.star-1 { animation-delay: 0s; }
.star-2 { animation-delay: 0.7s; }
.star-3 { animation-delay: 1.4s; }
.star-4 { animation-delay: 2.1s; }
.star-5 { animation-delay: 0.4s; }

@keyframes twinkle {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.05; }
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
  max-width: 420px;
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
