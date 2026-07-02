import { FILE_BROWSER_BASE_URL } from '@/config/api/base'

/**
 * 将后端返回的文件地址/相对路径转换为可访问的 URL
 * - 已是 http(s) 直返
 * - 兼容 browser 前缀（/browser/... 或 browser/...），自动去重
 * - 未配置 FILE_BROWSER_BASE_URL 时原样返回，避免误拼接
 */
export const resolveFileUrl = (value) => {
  if (!value || typeof value !== 'string') return ''
  const raw = value.trim()
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw

  const base = FILE_BROWSER_BASE_URL
  if (!base) return raw

  const path = raw.replace(/^\/?browser\/+/i, '').replace(/^\/+/, '')
  return `${base.endsWith('/') ? base : `${base}/`}${path}`
}
