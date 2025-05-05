<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-left">
        <h1 class="error-code">403</h1>
        <h2 class="error-title">访问被拒绝</h2>
        <p class="error-message">抱歉，您没有权限访问此页面</p>
        <el-button type="primary" class="back-button" @click="goToLogin">
          <el-icon><ArrowLeft /></el-icon>
          返回登录
        </el-button>
      </div>
      <div class="error-right">
        <!-- 动态小人图像 -->
        <div class="error-animation">
          <div class="character">
            <div class="head"></div>
            <div class="body"></div>
            <div class="arms"></div>
            <div class="legs"></div>
            <div class="shadow"></div>
          </div>
          <div class="lock">
            <div class="lock-body"></div>
            <div class="lock-hole"></div>
            <div class="lock-hook"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  overflow: hidden;
  padding: 20px;
}

.error-content {
  display: flex;
  width: 100%;
  max-width: 1200px;
  height: 80vh;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.error-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  padding: 60px;
}

.error-code {
  font-size: 120px;
  font-weight: 800;
  margin: 0;
  color: #e74c3c;
  line-height: 1;
  background: linear-gradient(45deg, #e74c3c, #f39c12);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 10px 20px rgba(231, 76, 60, 0.15);
  animation: pulse 2s infinite;
}

.error-title {
  font-size: 36px;
  font-weight: 600;
  color: #2c3e50;
  margin: 20px 0 10px;
}

.error-message {
  font-size: 18px;
  line-height: 1.6;
  color: #7f8c8d;
  margin-bottom: 40px;
  max-width: 400px;
}

.back-button {
  width: fit-content;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 500;
  background: #e74c3c;
  border: none;
  border-radius: 50px;
  box-shadow: 0 8px 15px rgba(231, 76, 60, 0.2);
  transition: all 0.3s ease;
}

.back-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 20px rgba(231, 76, 60, 0.3);
  background: #d63031;
}

.error-right {
  width: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
  border-radius: 0 24px 24px 0;
  overflow: hidden;
}

/* 动态小人动画 */
.error-animation {
  position: relative;
  width: 300px;
  height: 300px;
}

.character {
  position: absolute;
  top: 50%;
  left: 30%;
  transform: translateY(-50%);
  width: 120px;
  height: 200px;
  animation: bounce 2s infinite;
}

.head {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  background: #34495e;
  border-radius: 50%;
  z-index: 2;
}

.body {
  position: absolute;
  top: 55px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 80px;
  background: #34495e;
  border-radius: 20px;
  z-index: 1;
}

.arms {
  position: absolute;
  top: 75px;
  left: 50%;
  transform: translateX(-50%);
  width: 90px;
  height: 20px;
  background: #34495e;
  border-radius: 10px;
  z-index: 0;
}

.legs {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  border-radius: 0 0 30px 30px;
  background: #34495e;
}

.shadow {
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 15px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  animation: shadow 2s infinite;
}

.lock {
  position: absolute;
  top: 50%;
  right: 20%;
  transform: translateY(-50%);
  animation: shake 2s infinite;
}

.lock-body {
  width: 80px;
  height: 100px;
  background: #e74c3c;
  border-radius: 10px;
  position: relative;
}

.lock-hole {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: white;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}

.lock-hook {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  border: 10px solid #e74c3c;
  border-bottom: none;
  border-radius: 20px 20px 0 0;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-50%);
  }
  50% {
    transform: translateY(-60%);
  }
}

@keyframes shadow {
  0%, 100% {
    width: 70px;
    opacity: 0.2;
  }
  50% {
    width: 60px;
    opacity: 0.15;
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateY(-50%) rotate(0deg);
  }
  25% {
    transform: translateY(-50%) rotate(5deg);
  }
  75% {
    transform: translateY(-50%) rotate(-5deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* 响应式设计 */
@media (max-width: 992px) {
  .error-content {
    flex-direction: column;
    height: auto;
  }
  
  .error-left, .error-right {
    width: 100%;
    padding: 40px;
  }
  
  .error-right {
    border-radius: 0 0 24px 24px;
    min-height: 300px;
  }
  
  .error-code {
    font-size: 100px;
  }
  
  .error-title {
    font-size: 30px;
  }
}

@media (max-width: 576px) {
  .error-left {
    padding: 30px;
  }
  
  .error-code {
    font-size: 80px;
  }
  
  .error-title {
    font-size: 24px;
  }
  
  .error-message {
    font-size: 16px;
  }
}
</style> 