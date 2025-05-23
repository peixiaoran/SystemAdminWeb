import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import zhTW from './locales/zh-TW'
import enUS from './locales/en-US'
import viVN from './locales/vi-VN'

// 创建i18n实例
const i18n = createI18n({
  legacy: false, // 使用组合式API
  locale: localStorage.getItem('language') || 'zh-CN', // 从localStorage获取保存的语言，默认中文简体
  fallbackLocale: 'zh-CN', // 回退语言
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en-US': enUS,
    'vi-VN': viVN
  },
  silentTranslationWarn: true, // 关闭翻译警告
  silentFallbackWarn: true, // 关闭回退警告
})

export default i18n 