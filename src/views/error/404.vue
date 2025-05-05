<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-left">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">页面未找到</h2>
        <p class="error-message">抱歉，您访问的页面不存在或已被移除</p>
        <el-button type="primary" class="back-button" @click="goToLogin">
          <el-icon><ArrowLeft /></el-icon>
          返回登录
        </el-button>
      </div>
      <div class="error-right">
        <!-- 动态小人与地图场景 -->
        <div class="error-animation">
          <div class="map">
            <div class="map-grid"></div>
          </div>
          <div class="character">
            <div class="head"></div>
            <div class="body"></div>
            <div class="arms"></div>
            <div class="legs"></div>
            <div class="shadow"></div>
          </div>
          <div class="compass">
            <div class="compass-circle"></div>
            <div class="compass-arrow"></div>
          </div>
          <div class="search">
            <div class="search-magnifier"></div>
            <div class="search-handle"></div>
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
  color: #3498db;
  line-height: 1;
  background: linear-gradient(45deg, #3498db, #2980b9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 10px 20px rgba(52, 152, 219, 0.15);
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
  background: #3498db;
  border: none;
  border-radius: 50px;
  box-shadow: 0 8px 15px rgba(52, 152, 219, 0.2);
  transition: all 0.3s ease;
}

.back-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 20px rgba(52, 152, 219, 0.3);
  background: #2980b9;
}

.error-right {
  width: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
  border-radius: 0 24px 24px 0;
  overflow: hidden;
}

/* 动态小人与地图场景 */
.error-animation {
  position: relative;
  width: 300px;
  height: 300px;
}

.map {
  position: absolute;
  width: 200px;
  height: 200px;
  background: #ecf0f1;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: rotate(-15deg);
  animation: float 3s infinite;
  z-index: 1;
}

.map-grid {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background-image: 
    linear-gradient(#bdc3c7 1px, transparent 1px),
    linear-gradient(90deg, #bdc3c7 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.5;
}

.character {
  position: absolute;
  top: 60%;
  left: 60%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 140px;
  z-index: 2;
  animation: search 4s infinite;
}

.head {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: #34495e;
  border-radius: 50%;
  z-index: 2;
}

.body {
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 60px;
  background: #3498db;
  border-radius: 15px;
  z-index: 1;
}

.arms {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 15px;
  background: #3498db;
  border-radius: 10px;
  z-index: 0;
}

.legs {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  border-radius: 0 0 20px 20px;
  background: #34495e;
}

.shadow {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  animation: shadow 4s infinite;
}

.compass {
  position: absolute;
  bottom: 40px;
  right: 40px;
  width: 50px;
  height: 50px;
  z-index: 3;
}

.compass-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #e74c3c;
  border-radius: 50%;
  border: 3px solid #34495e;
}

.compass-arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 20px;
  background: #34495e;
  transform-origin: bottom center;
  transform: translate(-50%, -100%);
  animation: rotate 3s infinite linear;
}

.search {
  position: absolute;
  top: 30%;
  right: 20%;
  z-index: 3;
  transform: rotate(30deg);
  animation: bounce 2s infinite;
}

.search-magnifier {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 5px solid #34495e;
  border-radius: 50%;
}

.search-handle {
  position: absolute;
  top: 25px;
  left: 25px;
  width: 15px;
  height: 5px;
  background: #34495e;
  transform: rotate(45deg);
  border-radius: 2px;
}

@keyframes float {
  0%, 100% {
    transform: rotate(-15deg) translateY(0);
  }
  50% {
    transform: rotate(-15deg) translateY(-10px);
  }
}

@keyframes search {
  0%, 100% {
    transform: translate(-50%, -50%);
  }
  25% {
    transform: translate(-60%, -40%);
  }
  50% {
    transform: translate(-40%, -40%);
  }
  75% {
    transform: translate(-40%, -60%);
  }
}

@keyframes shadow {
  0%, 100% {
    width: 50px;
    opacity: 0.2;
  }
  50% {
    width: 40px;
    opacity: 0.15;
  }
}

@keyframes rotate {
  from {
    transform: translate(-50%, -100%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -100%) rotate(360deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: rotate(30deg) translateY(0);
  }
  50% {
    transform: rotate(30deg) translateY(-5px);
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