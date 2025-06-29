<template>
  <div class="language-switcher">
    <el-dropdown @command="handleCommand" trigger="click">
      <span class="language-selector">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="language-icon">
          <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
        </svg>
        <span class="language-text">{{ currentLanguageLabel }}</span>
        <el-icon><ArrowDown /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="(label, value) in languages" :key="value" :command="value" :class="{ 'active': locale === value }">
            <span>{{ label }}</span>
            <el-icon v-if="locale === value"><Check /></el-icon>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { updateRouteTitle } from '@/utils/updateRouteTitle'
import { ArrowDown, Check } from '@element-plus/icons-vue'

const { t, locale } = useI18n()

// 获取所有支持的语言选项
const languages = computed(() => {
  return {
    'zh-CN': t('login.languages.zh-CN'),
    'zh-TW': t('login.languages.zh-TW'),
    'en-US': t('login.languages.en-US')
  }
})

// 获取当前语言标签
const currentLanguageLabel = computed(() => {
  return languages.value[locale.value] || languages.value['zh-CN']
})

// 切换语言
const handleCommand = (command) => {
  if (command !== locale.value) {
    locale.value = command
    localStorage.setItem('language', command)
    
    // 更新路由标题
    updateRouteTitle()
  }
}
</script>

<style scoped>
.language-switcher {
  display: inline-block;
}

.language-selector {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 12px;
  height: 32px;
  border-radius: 4px;
}

.language-icon {
  margin-right: 6px;
  width: 16px;
  height: 16px;
  color: #606266;
}

.language-text {
  margin: 0 4px;
  font-size: 14px;
}

:deep(.el-dropdown-menu__item.active) {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

:deep(.el-dropdown-menu__item.active:hover) {
  color: var(--el-color-primary);
}

/* 语言切换下拉菜单圆角化样式 */
:deep(.el-dropdown-menu) {
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  min-width: 160px;
}

:deep(.el-dropdown-menu__item) {
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 4px;
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style> 

