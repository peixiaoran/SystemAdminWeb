<template>
  <div class="error-page error-page--404">
    <div class="header-actions">
      <language-switcher class="language-switcher" />
    </div>

    <div class="error-main">
      <div class="error-card">
        <div class="error-card__hero">
          <span class="error-code" aria-hidden="true">404</span>
          <div class="error-icon-wrap">
            <el-icon :size="56" class="error-icon">
              <Compass />
            </el-icon>
          </div>
        </div>
        <div class="error-card__body">
          <h1 class="error-title">{{ $t('error.title404') }}</h1>
          <p class="error-desc">{{ $t('error.desc404Line1') }}</p>
          <p class="error-desc error-desc--muted">{{ $t('error.desc404Line2') }}</p>
          <div class="error-actions">
            <el-button class="btn-secondary" @click="goBack">
              {{ $t('error.backToPrev') }}
            </el-button>
            <el-button type="primary" class="btn-primary" @click="goHome">
              {{ $t('error.returnToHomeBase') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Compass } from '@element-plus/icons-vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.replace('/module-select')
  }
}

function goHome() {
  router.push('/module-select')
}
</script>

<style scoped>
/* 与 module-select 一致布局；404 使用靛蓝 / 天青冷色区分 */
.error-page {
  min-height: 100vh;
  background: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0 30px 60px;
  overflow: hidden;
}

.error-page--404::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(120% 70% at 50% -15%, rgba(37, 99, 235, 0.1) 0%, transparent 52%),
    radial-gradient(75% 45% at 0% 70%, rgba(14, 165, 233, 0.06) 0%, transparent 48%);
  z-index: 0;
}

.header-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 12px 0 0 0;
  position: relative;
  z-index: 1;
}

.language-switcher {
  margin-right: 0;
}

.error-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
  position: relative;
  z-index: 1;
}

.error-card {
  width: 100%;
  max-width: 620px;
  border-radius: 24px;
  overflow: hidden;
  background: #ffffff;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.08),
    0 4px 16px rgba(0, 0, 0, 0.04);
}

.error-card__hero {
  position: relative;
  padding: 40px 32px 28px;
  background: linear-gradient(180deg, #eff6ff 0%, #e0f2fe 48%, #fff 100%);
}

.error-code {
  display: block;
  font-size: clamp(72px, 18vw, 112px);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.04em;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 45%, #0ea5e9 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-align: center;
  user-select: none;
}

.error-icon-wrap {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.error-icon {
  color: #2563eb;
  opacity: 0.92;
}

.error-card__body {
  padding: 28px 36px 36px;
  text-align: center;
}

.error-title {
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: 0.02em;
}

.error-desc {
  margin: 0 0 10px;
  font-size: 14px;
  line-height: 1.65;
  color: #606266;
}

.error-desc--muted {
  margin-bottom: 28px;
  font-size: 13px;
  color: #909399;
}

.error-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.btn-secondary {
  border-radius: 12px !important;
  padding: 12px 22px !important;
  font-weight: 500 !important;
  border-color: #e4e7ed !important;
  color: #606266 !important;
}

.btn-secondary:hover {
  border-color: #dcdfe6 !important;
  color: #1a1a1a !important;
  background: #f5f7fa !important;
}

.btn-primary {
  border-radius: 12px !important;
  padding: 12px 24px !important;
  font-weight: 500 !important;
  letter-spacing: 0.3px;
  border: none !important;
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 55%, #0ea5e9 100%) !important;
  box-shadow: 0 8px 22px rgba(37, 99, 235, 0.3) !important;
}

.btn-primary:hover,
.btn-primary:focus {
  background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%) !important;
  box-shadow: 0 10px 26px rgba(29, 78, 216, 0.38) !important;
}

@media (max-width: 576px) {
  .error-page {
    padding: 0 16px 40px;
  }

  .error-card__body {
    padding: 22px 20px 28px;
  }

  .error-actions {
    flex-direction: column;
  }

  .error-actions .el-button {
    width: 100%;
  }
}
</style>
