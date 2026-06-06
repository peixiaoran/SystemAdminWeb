import { getLocationQueryParam } from '@/utils/hashRouteBootstrap'

export const SUPPORTED_LANGUAGES = ['zh-CN', 'en-US']

/** 归一化语言代码，非受支持的语言返回空字符串 */
export function normalizeRouteLang (raw) {
  const value = String(raw ?? '').trim()
  if (!value) return ''
  return SUPPORTED_LANGUAGES.find((lang) => lang.toLowerCase() === value.toLowerCase()) || ''
}

/** 从 URL 读取 ?lang= 参数（兼容 path 外链与 hash 内 query） */
export function resolveRouteLanguageFromUrl () {
  return normalizeRouteLang(getLocationQueryParam('lang', 'Lang'))
}

/** 写入语言到 localStorage，返回归一化后的语言代码 */
export function persistRouteLanguage (lang) {
  const normalized = normalizeRouteLang(lang)
  if (normalized) localStorage.setItem('language', normalized)
  return normalized
}
