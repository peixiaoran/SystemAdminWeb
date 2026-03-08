<template>
  <div class="error-shell error-shell--404">
    <div class="error-card">
      <header class="brand-header">
        <div class="brand-block">
          <img src="/favicon.svg" alt="Logo" class="brand-logo" />
          <div class="brand-text">
            <p class="brand-name">{{ t('common.systemTitle') }}</p>
            <span class="brand-subtitle">{{ content.brandSubtitle }}</span>
          </div>
        </div>
        <div class="status-chip">{{ content.statusLabel }}</div>
      </header>

      <div class="content-grid">
        <section class="main-panel">
          <div class="code-mark">404</div>
          <h1 class="headline">{{ content.headline }}</h1>
          <p class="description">{{ content.description }}</p>

          <div class="action-row">
            <el-button type="primary" size="large" :icon="House" @click="goHome">
              {{ t('common.backToHome') }}
            </el-button>
            <el-button size="large" :icon="Refresh" @click="reloadPage">
              {{ content.secondaryAction }}
            </el-button>
          </div>

          <button class="text-action" type="button" @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            <span>{{ content.tertiaryAction }}</span>
          </button>

          <div class="tips-list">
            <div class="tip-item" v-for="tip in content.tips" :key="tip">
              <span class="tip-dot"></span>
              <span>{{ tip }}</span>
            </div>
          </div>
        </section>

        <aside class="side-panel">
          <div class="visual-card">
            <div class="visual-orb"></div>
            <div class="visual-icon-wrap">
              <el-icon class="visual-icon"><Search /></el-icon>
            </div>
            <h2 class="visual-title">{{ content.panelTitle }}</h2>
            <p class="visual-text">{{ content.panelText }}</p>
          </div>

          <div class="path-card">
            <span class="path-label">{{ content.pathLabel }}</span>
            <code class="path-value">{{ route.fullPath || '/404' }}</code>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { House, ArrowLeft, Refresh, Search } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()

const content = computed(() => {
  if (locale.value === 'en-US') {
    return {
      brandSubtitle: 'Clear and focused navigation',
      statusLabel: 'Page Missing',
      headline: 'This page seems to have wandered off',
      description: 'The address may be outdated, incomplete, or the page may have been moved. You can recover quickly from the actions below.',
      secondaryAction: 'Refresh Page',
      tertiaryAction: 'Go Back',
      panelTitle: 'A quick way back',
      panelText: 'Return to the home page to re-enter from the menu, or refresh if you just opened a stale link.',
      pathLabel: 'Requested address',
      tips: [
        'Go back to the previous page and continue browsing from where you came from.',
        'Return to the home page and reopen the page from the navigation menu.',
        'Check whether the link or bookmarked address is complete.'
      ]
    }
  }

  return {
    brandSubtitle: '清晰直接的系统导航体验',
    statusLabel: '页面走丢了',
    headline: '你访问的页面似乎走丢了',
    description: '这个地址可能已经变更、失效，或者链接本身不完整。可以通过下面的操作很快回到正确页面。',
    secondaryAction: '刷新当前页',
    tertiaryAction: '返回上一页',
    panelTitle: '先回到可用入口',
    panelText: '建议从首页菜单重新进入目标页面。如果你是从旧链接或收藏打开的，也可以先刷新一次确认。',
    pathLabel: '请求地址',
    tips: [
      '先返回上一页，继续从刚才的位置浏览。',
      '回到首页，再从菜单重新进入目标页面。',
      '检查地址或收藏链接是否完整、是否已经过期。'
    ]
  }
})

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}

const reloadPage = () => {
  window.location.reload()
}
</script>

<style scoped>
.error-shell {
  min-height: 100vh;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-primary, var(--el-font-family));
  background:
    radial-gradient(circle at top left, rgba(64, 158, 255, 0.16), transparent 30%),
    radial-gradient(circle at bottom right, rgba(230, 162, 60, 0.14), transparent 28%),
    linear-gradient(180deg, #f7faff 0%, #eef4ff 100%);
}

.error-card {
  width: min(1120px, 100%);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(64, 158, 255, 0.14);
  border-radius: 28px;
  box-shadow: 0 24px 60px rgba(17, 24, 39, 0.10);
  backdrop-filter: blur(18px);
  padding: 28px;
}

.brand-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-logo {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
}

.brand-name {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-color-primary, var(--el-text-color-primary));
}

.brand-subtitle {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  color: var(--text-color-secondary, var(--el-text-color-secondary));
}

.status-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(64, 158, 255, 0.12);
  color: var(--primary-color, var(--el-color-primary));
  font-size: 13px;
  font-weight: 600;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  gap: 24px;
}

.main-panel,
.side-panel {
  min-width: 0;
}

.main-panel {
  padding: 20px 8px 8px 8px;
}

.code-mark {
  font-size: clamp(72px, 12vw, 120px);
  line-height: 0.92;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin-bottom: 14px;
  color: var(--primary-color, var(--el-color-primary));
}

.headline {
  margin: 0 0 14px;
  font-size: clamp(28px, 4vw, 44px);
  line-height: 1.18;
  font-weight: 700;
  color: var(--text-color-primary, var(--el-text-color-primary));
  max-width: 680px;
}

.description {
  margin: 0 0 28px;
  max-width: 620px;
  font-size: 17px;
  line-height: 1.75;
  color: var(--text-color-regular, var(--el-text-color-regular));
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.action-row :deep(.el-button) {
  min-width: 156px;
  height: 46px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
}

.text-action {
  margin-top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  color: var(--primary-color, var(--el-color-primary));
  font-size: 14px;
  font-weight: 600;
}

.tips-list {
  margin-top: 28px;
  display: grid;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(64, 158, 255, 0.06);
  color: var(--text-color-regular, var(--el-text-color-regular));
  line-height: 1.6;
}

.tip-dot {
  width: 8px;
  height: 8px;
  margin-top: 8px;
  border-radius: 50%;
  background: var(--warning-color, var(--el-color-warning));
  flex-shrink: 0;
}

.side-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.visual-card,
.path-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid rgba(64, 158, 255, 0.12);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(245, 249, 255, 0.92));
}

.visual-card {
  min-height: 360px;
  padding: 26px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.visual-orb {
  position: absolute;
  top: 28px;
  right: 28px;
  width: 210px;
  height: 210px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(64, 158, 255, 0.20), rgba(64, 158, 255, 0.03) 70%);
}

.visual-icon-wrap {
  position: absolute;
  top: 46px;
  left: 26px;
  width: 88px;
  height: 88px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.18), rgba(230, 162, 60, 0.18));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55);
}

.visual-icon {
  font-size: 40px;
  color: var(--primary-color, var(--el-color-primary));
}

.visual-title {
  position: relative;
  margin: 0 0 10px;
  font-size: 24px;
  line-height: 1.3;
  color: var(--text-color-primary, var(--el-text-color-primary));
}

.visual-text {
  position: relative;
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-color-regular, var(--el-text-color-regular));
}

.path-card {
  padding: 18px 20px;
}

.path-label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--text-color-secondary, var(--el-text-color-secondary));
}

.path-value {
  display: block;
  overflow-wrap: anywhere;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-color-primary, var(--el-text-color-primary));
  background: rgba(17, 24, 39, 0.04);
  border-radius: 12px;
  padding: 10px 12px;
}

@media (max-width: 960px) {
  .error-shell {
    padding: 20px;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .visual-card {
    min-height: 280px;
  }
}

@media (max-width: 640px) {
  .error-card {
    padding: 20px;
    border-radius: 22px;
  }

  .brand-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .description {
    font-size: 16px;
  }

  .action-row {
    display: grid;
    grid-template-columns: 1fr;
  }

  .action-row :deep(.el-button) {
    width: 100%;
  }

  .visual-card {
    min-height: 240px;
  }

  .visual-orb {
    width: 150px;
    height: 150px;
  }
}
</style>

