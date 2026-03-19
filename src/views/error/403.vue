<template>
  <div class="exception-page">
    <div class="exception-container">
      <div class="exception-illustration">
        <div class="code-wrapper">
          <span class="code-text">403</span>
          <div class="code-shadow"></div>
        </div>
        <el-icon class="status-icon"><Lock /></el-icon>
      </div>
      
      <div class="exception-content">
        <h1 class="title">{{ content.headline }}</h1>
        <p class="description">{{ content.description }}</p>
        
        <div class="suggestion-box">
          <div class="suggestion-title">
            <el-icon><InfoFilled /></el-icon>
            <span>{{ content.panelTitle }}</span>
          </div>
          <p class="suggestion-text">{{ content.panelText }}</p>
        </div>

        <div class="actions">
          <el-button type="primary" size="large" class="action-btn" :icon="House" @click="goHome">
            {{ t('common.backToHome') }}
          </el-button>
          <el-button size="large" class="action-btn" :icon="ArrowLeft" @click="goBack">
            {{ content.tertiaryAction }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { House, ArrowLeft, Lock, InfoFilled } from '@element-plus/icons-vue'

const router = useRouter()
const { t, locale } = useI18n()

const content = computed(() => {
  if (locale.value === 'en-US') {
    return {
      headline: 'Access Denied',
      description: 'Sorry, you do not have permission to access this page. This area is restricted to authorized users only.',
      tertiaryAction: 'Go Back',
      panelTitle: 'Need Access?',
      panelText: 'If you believe you should have access to this page, please contact your system administrator to request the necessary permissions.',
    }
  }

  return {
    headline: '访问受限',
    description: '抱歉，您没有权限访问此页面。该区域仅对授权用户开放，请检查您的账号权限。',
    tertiaryAction: '返回上一页',
    panelTitle: '需要访问权限？',
    panelText: '如果您认为自己应该可以访问此页面，请联系系统管理员为您分配相应的角色或权限。',
  }
})

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.exception-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color-page);
  padding: 2rem;
  font-family: var(--el-font-family);
}

.exception-container {
  display: flex;
  align-items: center;
  gap: 6rem;
  max-width: 1000px;
  width: 100%;
  padding: 4rem;
  background: var(--el-bg-color);
  border-radius: var(--el-border-radius-round);
  box-shadow: var(--el-box-shadow-light);
  transition: all 0.3s ease;
}

.exception-container:hover {
  box-shadow: var(--el-box-shadow);
}

.exception-illustration {
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.code-wrapper {
  position: relative;
  z-index: 1;
}

.code-text {
  font-size: 140px;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-5) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 10px 30px rgba(var(--el-color-primary-rgb), 0.2);
  letter-spacing: -4px;
}

.code-shadow {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 20px;
  background: radial-gradient(ellipse at center, rgba(var(--el-color-primary-rgb), 0.15) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
}

.status-icon {
  font-size: 48px;
  color: var(--el-color-primary);
  margin-top: -20px;
  background: var(--el-bg-color);
  padding: 10px;
  border-radius: 50%;
  box-shadow: var(--el-box-shadow-lighter);
  z-index: 2;
}

.exception-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 32px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.description {
  font-size: 16px;
  color: var(--el-text-color-regular);
  margin: 0 0 32px 0;
  line-height: 1.6;
}

.suggestion-box {
  background-color: var(--el-color-primary-light-9);
  border-left: 4px solid var(--el-color-primary);
  padding: 16px 20px;
  border-radius: 0 var(--el-border-radius-base) var(--el-border-radius-base) 0;
  margin-bottom: 32px;
}

.suggestion-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--el-color-primary);
  margin-bottom: 8px;
}

.suggestion-text {
  margin: 0;
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  padding: 0 28px;
  border-radius: var(--el-border-radius-round);
  font-weight: 500;
  transition: transform 0.2s ease;
}

.action-btn:active {
  transform: scale(0.96);
}

@media (max-width: 900px) {
  .exception-container {
    flex-direction: column;
    gap: 3rem;
    padding: 3rem 2rem;
    text-align: center;
  }

  .suggestion-box {
    text-align: left;
  }

  .actions {
    justify-content: center;
  }

  .code-text {
    font-size: 100px;
  }
}

@media (max-width: 480px) {
  .exception-page {
    padding: 1rem;
  }
  
  .actions {
    flex-direction: column;
    width: 100%;
  }

  .action-btn {
    width: 100%;
    margin-left: 0 !important;
  }
}
</style>
