<template>
  <main class="error-page">
    <section class="error-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">{{ $t('error.title404') }}</h2>
      <p class="error-desc">{{ $t('error.desc404') }}</p>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">{{ $t('error.backToModuleSelect') }}</el-button>
        <el-button @click="goBack">{{ $t('error.backToPrev') }}</el-button>
      </div>
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
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: #f9fafb;
}

.error-content {
  max-width: 560px;
  text-align: center;
}

.error-code {
  margin: 0;
  font-size: 120px;
  line-height: 1;
  letter-spacing: 0.1em;
  color: #1f2937;
  font-weight: 700;
}

.error-title {
  margin: 20px 0 16px;
  font-size: 32px;
  line-height: 1.3;
  font-weight: 600;
  color: #111827;
}

.error-desc {
  margin: 0 0 32px;
  font-size: 16px;
  line-height: 1.6;
  color: #6b7280;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
