import i18n from '../i18n'
import router from '../router'

export function updateRouteTitle() {
  const { t } = i18n.global
  const route = router.currentRoute.value
  const systemTitle = t('common.systemTitle')
  const translatedTitle = route?.meta?.title ? t(route.meta.title) : ''
  document.title = translatedTitle ? `${translatedTitle} - ${systemTitle}` : systemTitle
}