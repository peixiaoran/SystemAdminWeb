<template>
  <div class="error-page-container">
    <div class="error-content-wrapper">
      <!-- Text Content Section -->
      <div class="text-section">
        <div class="error-number">403</div>
        <h1 class="error-title">{{ $t('route.forbidden') }}</h1>
        <p class="error-description">{{ $t('error.accessDenied') }}</p>
        
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
            <!-- Blocked Character -->
            <div class="blocked-character">
              <div class="character-head">
                <div class="eyes">
                  <div class="eye left-eye"></div>
                  <div class="eye right-eye"></div>
                </div>
                <div class="mouth sad-mouth"></div>
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
            
            <!-- Security Shield -->
            <div class="security-shield">
              <div class="shield-body">
                <div class="shield-icon">🛡️</div>
                <div class="shield-lock">🔒</div>
              </div>
              <div class="shield-glow"></div>
            </div>
            
            <!-- Barrier Wall -->
            <div class="barrier-wall">
              <div class="wall-segment" v-for="n in 5" :key="n"></div>
              <div class="wall-warning">⚠️</div>
            </div>
            
            <!-- Permission Card -->
            <div class="permission-card">
              <div class="card-header">
                <div class="card-icon">🔑</div>
                <div class="card-title">{{ $t('error.access') }}</div>
              </div>
              <div class="card-status denied">{{ $t('error.denied') }}</div>
              <div class="card-stripe"></div>
            </div>
            
            <!-- Decoration Elements -->
            <div class="decoration-elements">
              <div class="particle particle-1"></div>
              <div class="particle particle-2"></div>
              <div class="particle particle-3"></div>
              <div class="warning-signs">
                <div class="warning-sign sign-1">⚠️</div>
                <div class="warning-sign sign-2">🚫</div>
                <div class="warning-sign sign-3">⛔</div>
              </div>
              <div class="security-camera">
                <div class="camera-body"></div>
                <div class="camera-lens"></div>
                <div class="camera-light"></div>
              </div>
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
    rgba(239, 68, 68, 0.05) 0%, 
    rgba(251, 146, 60, 0.05) 30%, 
    rgba(252, 211, 77, 0.05) 60%, 
    rgba(255, 255, 255, 0.95) 100%);
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
  padding: 60px;
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
  background: linear-gradient(135deg, var(--el-color-danger), var(--el-color-warning));
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

/* Blocked Character */
.blocked-character {
  position: absolute;
  top: 50%;
  left: 20%;
  transform: translate(-50%, -50%);
  animation: frustrated-bounce 3s ease-in-out infinite;
}

.character-head {
  width: 70px;
  height: 70px;
  background: var(--el-color-danger-light-9);
  border-radius: 50%;
  position: relative;
  margin: 0 auto 8px;
}

.eyes {
  position: absolute;
  top: 25px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 0 18px;
}

.eye {
  width: 6px;
  height: 8px;
  background: var(--el-text-color-primary);
  border-radius: 3px 3px 50% 50%;
  animation: worried-blink 4s infinite;
}

.sad-mouth {
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 4px;
  background: var(--el-text-color-primary);
  border-radius: 20px 20px 0 0;
}

.character-body {
  width: 50px;
  height: 80px;
  background: var(--el-color-danger);
  border-radius: 25px 25px 15px 15px;
  margin: 0 auto;
  position: relative;
}

.character-arms {
  position: absolute;
  top: 15px;
  width: 100%;
}

.arm {
  width: 30px;
  height: 10px;
  background: var(--el-color-danger);
  border-radius: 5px;
  position: absolute;
  top: 0;
}

.left-arm {
  left: -18px;
  transform: rotate(-30deg);
  animation: reach-out 2.5s ease-in-out infinite;
}

.right-arm {
  right: -18px;
  transform: rotate(30deg);
  animation: reach-out 2.5s ease-in-out infinite 0.5s;
}

.character-legs {
  position: absolute;
  bottom: -12px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 0 10px;
}

.leg {
  width: 12px;
  height: 25px;
  background: var(--el-color-danger);
  border-radius: 0 0 6px 6px;
}

/* Security Shield */
.security-shield {
  position: absolute;
  top: 40%;
  right: 20%;
  transform: translateY(-50%);
  animation: shield-pulse 3s ease-in-out infinite;
}

.shield-body {
  width: 80px;
  height: 100px;
  background: linear-gradient(145deg, var(--el-color-primary), var(--el-color-primary-light-3));
  border-radius: 40px 40px 0 40px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.shield-icon {
  font-size: 24px;
  margin-bottom: 8px;
  animation: icon-glow 2s ease-in-out infinite;
}

.shield-lock {
  font-size: 16px;
  opacity: 0.8;
}

.shield-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle, rgba(64, 158, 255, 0.3) 0%, transparent 70%);
  border-radius: 50px 50px 0 50px;
  animation: glow-pulse 2s ease-in-out infinite;
}

/* Barrier Wall */
.barrier-wall {
  position: absolute;
  top: 50%;
  left: 45%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: wall-shake 4s ease-in-out infinite;
}

.wall-segment {
  width: 60px;
  height: 15px;
  background: linear-gradient(135deg, var(--el-color-warning), var(--el-color-warning-light-3));
  border-radius: 3px;
  position: relative;
}

.wall-segment:nth-child(odd) {
  margin-left: -10px;
}

.wall-warning {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  animation: warning-blink 1.5s ease-in-out infinite;
}

/* Permission Card */
.permission-card {
  position: absolute;
  bottom: 15%;
  left: 25%;
  width: 100px;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 8px;
  transform: rotate(-8deg);
  animation: card-float 4s ease-in-out infinite;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.card-icon {
  font-size: 12px;
}

.card-title {
  font-size: 10px;
  font-weight: bold;
  color: var(--el-text-color-regular);
}

.card-status {
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  padding: 2px;
  border-radius: 4px;
  margin-bottom: 4px;
}

.card-status.denied {
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.card-stripe {
  height: 8px;
  background: linear-gradient(90deg, 
    var(--el-color-danger) 0%, 
    var(--el-color-warning) 50%, 
    var(--el-color-danger) 100%);
  border-radius: 2px;
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

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--el-color-danger);
  border-radius: 50%;
  animation: particle-float 3s ease-in-out infinite;
}

.particle-1 {
  top: 20%;
  left: 60%;
  animation-delay: 0s;
}

.particle-2 {
  top: 35%;
  right: 10%;
  animation-delay: 1s;
}

.particle-3 {
  bottom: 30%;
  left: 70%;
  animation-delay: 2s;
}

.warning-signs {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.warning-sign {
  position: absolute;
  font-size: 20px;
  animation: sign-pulse 2s ease-in-out infinite;
}

.sign-1 {
  top: 15%;
  right: 5%;
  animation-delay: 0s;
}

.sign-2 {
  top: 60%;
  right: 15%;
  animation-delay: 0.7s;
}

.sign-3 {
  bottom: 20%;
  right: 8%;
  animation-delay: 1.4s;
}

/* Security Camera */
.security-camera {
  position: absolute;
  top: 10%;
  right: 30%;
  transform: rotate(-15deg);
  animation: camera-scan 4s ease-in-out infinite;
}

.camera-body {
  width: 25px;
  height: 15px;
  background: var(--el-text-color-secondary);
  border-radius: 3px;
  position: relative;
}

.camera-lens {
  position: absolute;
  top: 50%;
  right: -8px;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: var(--el-text-color-primary);
  border-radius: 50%;
  border: 2px solid var(--el-color-info);
}

.camera-light {
  position: absolute;
  top: -5px;
  left: 3px;
  width: 4px;
  height: 4px;
  background: var(--el-color-danger);
  border-radius: 50%;
  animation: camera-blink 1s ease-in-out infinite;
}

/* Animation Definitions */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes frustrated-bounce {
  0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
  25% { transform: translate(-50%, -50%) translateY(-5px); }
  50% { transform: translate(-50%, -50%) translateY(0px); }
  75% { transform: translate(-50%, -50%) translateY(-3px); }
}

@keyframes worried-blink {
  0%, 85%, 100% { height: 8px; }
  90%, 95% { height: 2px; }
}

@keyframes reach-out {
  0%, 100% { transform: rotate(-30deg); }
  50% { transform: rotate(-45deg); }
}

@keyframes shield-pulse {
  0%, 100% { transform: translateY(-50%) scale(1); }
  50% { transform: translateY(-50%) scale(1.05); }
}

@keyframes icon-glow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.3); }
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes wall-shake {
  0%, 100% { transform: translateY(-50%) translateX(0px); }
  25% { transform: translateY(-50%) translateX(1px); }
  75% { transform: translateY(-50%) translateX(-1px); }
}

@keyframes warning-blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0.3; }
}

@keyframes card-float {
  0%, 100% { transform: rotate(-8deg) translateY(0px); }
  50% { transform: rotate(-6deg) translateY(-4px); }
}

@keyframes particle-float {
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
  50% { transform: translateY(-15px) scale(1.2); opacity: 1; }
}

@keyframes sign-pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
}

@keyframes camera-scan {
  0%, 100% { transform: rotate(-15deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(-20deg); }
}

@keyframes camera-blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0.3; }
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

