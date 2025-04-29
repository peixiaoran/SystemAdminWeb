<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-icon">
        <el-icon><Lock /></el-icon>
      </div>
      <h1 class="error-code">403</h1>
      <h2 class="error-title">无权访问</h2>
      <p class="error-message">抱歉，您没有权限访问此页面</p>
      <div class="error-actions">
        <el-button type="primary" @click="goBack" :icon="ArrowLeft">返回上一页</el-button>
        <el-button @click="goHome" :icon="HomeFilled">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Lock, ArrowLeft, HomeFilled } from '@element-plus/icons-vue'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/module-select')
}
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.error-content {
  text-align: center;
  padding: 48px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  backdrop-filter: blur(10px);
}

.error-icon {
  margin-bottom: 24px;
}

.error-icon .el-icon {
  font-size: 64px;
  color: #E6A23C;
}

.error-code {
  font-size: 72px;
  color: #E6A23C;
  margin: 0 0 16px;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.error-title {
  font-size: 24px;
  color: #303133;
  margin: 0 0 12px;
  font-weight: 500;
}

.error-message {
  font-size: 16px;
  color: #606266;
  margin: 0 0 32px;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.el-button {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style> 