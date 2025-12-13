import { FILE_BROWSER_BASE_URL } from '@/config/api/base'

const ensureTrailingSlash = (s) => (s.endsWith('/') ? s : `${s}/`)

/**
 * 将后端返回的文件地址/相对路径转换为可访问的 URL
 * - 已是 http(s) 直返
 * - 支持返回值包含 browser 前缀（/browser/... 或 browser/...），会自动去重
 * - 未配置 FILE_BROWSER_BASE_URL 时：原样返回（避免误拼接）
 */
export const resolveFileUrl = (value) => {
  if (!value || typeof value !== 'string') return ''
  if (/^https?:\/\//i.test(value)) return value

  const base = FILE_BROWSER_BASE_URL
  if (!base) return value

  // 去掉多余前缀，统一拼到 {base}/{path}
  let path = value.trim()

  // 若后端返回的是 /browser/xxx 或 browser/xxx，则去掉 browser 前缀避免重复
  path = path.replace(/^\/?browser\/+/i, '')
  // 去掉开头斜杠
  path = path.replace(/^\/+/, '')

  return `${ensureTrailingSlash(base)}${path}`
}


