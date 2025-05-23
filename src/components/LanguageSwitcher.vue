<template>
  <div class="language-switcher">
    <el-dropdown @command="handleCommand" trigger="click">
      <span class="language-selector">
        <el-icon class="language-icon"><Edit /></el-icon>
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

const { t, locale } = useI18n()

// 获取所有支持的语言选项
const languages = computed(() => {
  return {
    'zh-CN': t('login.languages.zh-CN'),
    'zh-TW': t('login.languages.zh-TW'),
    'en-US': t('login.languages.en-US'),
    'vi-VN': t('login.languages.vi-VN')
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
    
    // 更新标题
    document.title = t('common.systemTitle')
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
  transition: background-color 0.3s;
}

.language-selector:hover {
  background-color: #f5f7fa;
}

.language-icon {
  margin-right: 6px;
  font-size: 16px;
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
</style> 