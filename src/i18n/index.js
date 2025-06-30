import { createI18n } from 'vue-i18n'
import zhTW from './locales/zh-TW.js'
import enUS from './locales/en-US.js'

// 创建i18n实例
const i18n = createI18n({
  legacy: false, // 使用组合式API
  locale: localStorage.getItem('language') || 'zh-TW', // 从localStorage获取保存的语言，默认中文繁体
  fallbackLocale: 'zh-TW', // 回退语言
  messages: {
    'zh-TW': zhTW,
    'en-US': enUS
  },
  silentTranslationWarn: true, // 关闭翻译警告
  silentFallbackWarn: true, // 关闭回退警告
})

export default i18n 