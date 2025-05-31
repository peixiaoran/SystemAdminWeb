import i18n from '../i18n'
import router from '../router'

/**
 * 更新当前路由的标题
 * 在语言切换后调用此函数以更新页面标题
 */
export function updateRouteTitle() {
  const { t } = i18n.global
  const route = router.currentRoute.value
  
  // 获取翻译后的标题
  const translatedTitle = route.meta.title ? t(route.meta.title) : ''
  
  // 更新页面标题
  document.title = translatedTitle ? `${translatedTitle} - ${t('common.systemTitle')}` : t('common.systemTitle')
} 