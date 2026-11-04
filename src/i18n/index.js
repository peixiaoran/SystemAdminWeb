import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.js'
import enUS from './locales/en-US.js'
import { detectBrowserLanguage } from '@/utils/browserLanguage'
import { persistRouteLanguage, resolveRouteLanguageFromUrl } from '@/utils/routeLanguage'

function resolveInitialLocale () {
  const routeLang = resolveRouteLanguageFromUrl()
  if (routeLang) return persistRouteLanguage(routeLang)
  // 用户已选择过的语言优先；首次访问则按浏览器语言判断（简体中文 → 中文，其余 → 英文）
  const stored = localStorage.getItem('language')
  if (stored) return stored
  return persistRouteLanguage(detectBrowserLanguage())
}

// 创建i18n实例
const i18n = createI18n({
  legacy: false, // 使用组合式API
  locale: resolveInitialLocale(), // URL ?lang= 优先，其次 localStorage
  fallbackLocale: 'zh-CN', // 回退语言
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  },
  silentTranslationWarn: true, // 关闭翻译警告
  silentFallbackWarn: true, // 关闭回退警告
})

export default i18n