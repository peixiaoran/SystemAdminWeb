import { FILE_BROWSER_BASE_URL } from '@/config/api/base'

const ensureTrailingSlash = (s) => (s.endsWith('/') ? s : `${s}/`)
const isHttpUrl = (s) => /^https?:\/\//i.test(s)
const normalizeBrowserPath = (s) => {
  return s
    .replace(/^\/?browser\/+/i, '')
    .replace(/^\/+/, '')
}

/**
 * 将后端返回的文件地址/相对路径转换为可访问的 URL
 * - 已是 http(s) 直返
 * - 支持返回值包含 browser 前缀（/browser/... 或 browser/...），会自动去重
 * - 未配置 FILE_BROWSER_BASE_URL 时：原样返回（避免误拼接）
 */
export const resolveFileUrl = (value) => {
  if (!value || typeof value !== 'string') return ''
  const raw = value.trim()
  if (!raw) return ''
  if (isHttpUrl(raw)) return raw

  const base = FILE_BROWSER_BASE_URL
  if (!base) return raw

  const path = normalizeBrowserPath(raw)

  return `${ensureTrailingSlash(base)}${path}`
}
