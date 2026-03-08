import i18n from '../i18n'
import router from '../router'

const getTranslatedRouteTitle = (route, t) => {
  return route?.meta?.title ? t(route.meta.title) : ''
}

export function updateRouteTitle() {
  const { t } = i18n.global
  const route = router.currentRoute.value
  const systemTitle = t('common.systemTitle')
  const translatedTitle = getTranslatedRouteTitle(route, t)
  document.title = translatedTitle ? `${translatedTitle} - ${systemTitle}` : systemTitle
}