<template>
  <div class="error-page-container">
    <div class="error-content-wrapper">
      <!-- Text Content Section -->
      <div class="text-section">
        <div class="error-number">404</div>
        <h1 class="error-title">{{ $t('route.notFound') }}</h1>
        <p class="error-description">{{ $t('error.pageNotFound') }}</p>
        
        <div class="action-buttons">
          <el-button 
            type="primary" 
            size="large" 
            @click="goHome"
            :icon="House"
            class="home-button">
            {{ $t('common.backToHome') }}
          </el-button>
          <el-button 
            size="large" 
            @click="goBack"
            :icon="ArrowLeft"
            class="back-button">
            {{ $t('common.goBack') }}
          </el-button>
        </div>
      </div>
      
      <!-- Illustration Section -->
      <div class="illustration-section">
        <div class="floating-elements">
          <!-- Main Illustration -->
          <div class="main-illustration">
            <div class="search-character">
              <div class="character-head">
                <div class="eyes">
                  <div class="eye left-eye"></div>
                  <div class="eye right-eye"></div>
                </div>
                <div class="mouth"></div>
              </div>
              <div class="character-body"></div>
              <div class="character-arms">
                <div class="arm left-arm"></div>
                <div class="arm right-arm"></div>
              </div>
              <div class="character-legs">
                <div class="leg left-leg"></div>
                <div class="leg right-leg"></div>
              </div>
            </div>
            
            <!-- Search Tools -->
            <div class="magnifier">
              <div class="magnifier-glass"></div>
              <div class="magnifier-handle"></div>
            </div>
            
            <!-- Map Paper -->
            <div class="map-paper">
              <div class="map-lines">
                <div class="line" v-for="n in 6" :key="n"></div>
              </div>
              <div class="map-dots">
                <div class="dot" v-for="n in 8" :key="n"></div>
              </div>
            </div>
            
            <!-- Decoration Elements -->
            <div class="decoration-elements">
              <div class="cloud cloud-1"></div>
              <div class="cloud cloud-2"></div>
              <div class="star star-1"></div>
              <div class="star star-2"></div>
              <div class="star star-3"></div>
              <div class="question-mark">?</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { House, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()
const { t } = useI18n()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.error-page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.1) 0%, 
    rgba(219, 234, 254, 0.1) 30%, 
    rgba(254, 249, 195, 0.1) 60%, 
    rgba(243, 244, 246, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: var(--el-font-family);
}

.error-content-wrapper {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 60px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.text-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.error-number {
  font-size: 160px;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  animation: pulse 2s ease-in-out infinite;
}

.error-title {
  font-size: 48px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.error-description {
  font-size: 18px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 420px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.home-button, .back-button {
  height: 48px;
  padding: 0 24px;
  font-size: 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.home-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.3);
}

.back-button:hover {
  transform: translateY(-2px);
  background-color: var(--el-fill-color-light);
}

.illustration-section {
  position: relative;
  height: 500px;
  overflow: hidden;
}

.floating-elements {
  position: relative;
  width: 100%;
  height: 100%;
}

.main-illustration {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Search Character */
.search-character {
  position: absolute;
  top: 50%;
  left: 30%;
  transform: translate(-50%, -50%);
  animation: float 4s ease-in-out infinite;
}

.character-head {
  width: 80px;
  height: 80px;
  background: var(--el-color-primary-light-9);
  border-radius: 50%;
  position: relative;
  margin: 0 auto 8px;
  border: 3px solid var(--el-color-primary-light-5);
}

.eyes {
  position: absolute;
  top: 28px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 0 20px;
}

.eye {
  width: 8px;
  height: 8px;
  background: var(--el-text-color-primary);
  border-radius: 50%;
  animation: blink 3s infinite;
}

.mouth {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 10px;
  border: 2px solid var(--el-text-color-primary);
  border-top: none;
  border-radius: 0 0 20px 20px;
}

.character-body {
  width: 60px;
  height: 100px;
  background: var(--el-color-primary);
  border-radius: 30px 30px 20px 20px;
  margin: 0 auto;
  position: relative;
}

.character-arms {
  position: absolute;
  top: 20px;
  width: 100%;
}

.arm {
  width: 35px;
  height: 12px;
  background: var(--el-color-primary);
  border-radius: 6px;
  position: absolute;
  top: 0;
}

.left-arm {
  left: -20px;
  transform: rotate(-20deg);
  animation: wave-left 2s ease-in-out infinite;
}

.right-arm {
  right: -20px;
  transform: rotate(20deg);
}

.character-legs {
  position: absolute;
  bottom: -15px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 0 15px;
}

.leg {
  width: 15px;
  height: 30px;
  background: var(--el-color-primary);
  border-radius: 0 0 8px 8px;
}

/* Magnifier */
.magnifier {
  position: absolute;
  top: 30%;
  right: 25%;
  animation: search-move 3s ease-in-out infinite;
}

.magnifier-glass {
  width: 50px;
  height: 50px;
  border: 4px solid var(--el-color-warning);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  position: relative;
}

.magnifier-handle {
  width: 25px;
  height: 6px;
  background: var(--el-color-warning);
  border-radius: 3px;
  position: absolute;
  bottom: -15px;
  right: -12px;
  transform: rotate(45deg);
}

/* Map Paper */
.map-paper {
  position: absolute;
  bottom: 20%;
  left: 15%;
  width: 120px;
  height: 90px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 12px;
  transform: rotate(-10deg);
  animation: paper-float 5s ease-in-out infinite;
}

.map-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.line {
  height: 2px;
  background: var(--el-color-info-light-5);
  border-radius: 1px;
}

.line:nth-child(1) { width: 80%; }
.line:nth-child(2) { width: 100%; }
.line:nth-child(3) { width: 60%; }
.line:nth-child(4) { width: 90%; }
.line:nth-child(5) { width: 70%; }
.line:nth-child(6) { width: 50%; }

.map-dots {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  background: var(--el-color-danger);
  border-radius: 50%;
  animation: dot-pulse 2s ease-in-out infinite;
}

.dot:nth-child(odd) {
  animation-delay: 0.5s;
}

/* Decoration Elements */
.decoration-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  opacity: 0.6;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
}

.cloud-1 {
  width: 60px;
  height: 30px;
  top: 15%;
  right: 10%;
  animation: cloud-drift 20s linear infinite;
}

.cloud-1::before {
  width: 30px;
  height: 30px;
  top: -15px;
  left: 10px;
}

.cloud-1::after {
  width: 40px;
  height: 40px;
  top: -20px;
  right: 10px;
}

.cloud-2 {
  width: 40px;
  height: 20px;
  top: 70%;
  left: 5%;
  animation: cloud-drift 25s linear infinite reverse;
}

.cloud-2::before {
  width: 20px;
  height: 20px;
  top: -10px;
  left: 5px;
}

.cloud-2::after {
  width: 25px;
  height: 25px;
  top: -12px;
  right: 5px;
}

.star {
  position: absolute;
  color: var(--el-color-warning);
  font-size: 16px;
  animation: twinkle 2s ease-in-out infinite;
}

.star::before {
  content: '✦';
}

.star-1 {
  top: 10%;
  left: 20%;
  animation-delay: 0s;
}

.star-2 {
  top: 25%;
  right: 15%;
  animation-delay: 0.7s;
}

.star-3 {
  bottom: 15%;
  right: 5%;
  animation-delay: 1.4s;
}

.question-mark {
  position: absolute;
  top: 20%;
  left: 50%;
  font-size: 36px;
  font-weight: bold;
  color: var(--el-color-primary);
  animation: bounce-question 3s ease-in-out infinite;
}

/* Animation Definitions */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes float {
  0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
  50% { transform: translate(-50%, -50%) translateY(-10px); }
}

@keyframes blink {
  0%, 90%, 100% { opacity: 1; }
  95% { opacity: 0; }
}

@keyframes wave-left {
  0%, 100% { transform: rotate(-20deg); }
  50% { transform: rotate(-40deg); }
}

@keyframes search-move {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(5deg); }
}

@keyframes paper-float {
  0%, 100% { transform: rotate(-10deg) translateY(0px); }
  50% { transform: rotate(-12deg) translateY(-5px); }
}

@keyframes dot-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.7; }
}

@keyframes cloud-drift {
  from { transform: translateX(-20px); }
  to { transform: translateX(20px); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes bounce-question {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-10px) scale(1.1); }
}

/* Responsive Design */
@media (max-width: 992px) {
  .error-content-wrapper {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 40px;
    text-align: center;
  }
  
  .illustration-section {
    height: 350px;
  }
  
  .error-number {
    font-size: 120px;
  }
  
  .error-title {
    font-size: 36px;
  }
  
  .text-section {
    align-items: center;
  }
}

@media (max-width: 640px) {
  .error-content-wrapper {
    padding: 30px 20px;
  }
  
  .error-number {
    font-size: 96px;
  }
  
  .error-title {
    font-size: 28px;
  }
  
  .error-description {
    font-size: 16px;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .home-button, .back-button {
    width: 100%;
  }
  
  .illustration-section {
    height: 280px;
  }
}
</style> 

