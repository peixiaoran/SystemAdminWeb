import { FILE_BROWSER_BASE_URL } from '@/config/api/base'

const decodeOnce = (value) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * 逐段编码对象键，保留 / 作为目录分隔符
 * 例：20260730/文件 名.jpg -> 20260730/%E6%96%87%E4%BB%B6%20%E5%90%8D.jpg
 */
const encodeObjectKey = (key) =>
  decodeOnce(key)
    .split('/')
    .filter(Boolean)
    .map(encodeURIComponent)
    .join('/')

/**
 * 将后端返回的文件地址/相对路径转换为可访问的 URL
 * - 已是 http(s) 直返
 * - 兼容 minio-console / browser / 桶名前缀，自动去重
 * - 未配置 FILE_BROWSER_BASE_URL 时原样返回，避免误拼接
 */
export const resolveFileUrl = (value) => {
  if (!value || typeof value !== 'string') return ''
  const raw = value.trim()
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw

  const base = FILE_BROWSER_BASE_URL
  if (!base) return raw

  const normalizedBase = base.replace(/\/+$/, '')
  const bucket = normalizedBase.split('/').pop()

  const key = raw
    .replace(/^\/+/, '')
    .replace(/^minio-console\/+/i, '')
    .replace(/^browser\/+/i, '')
    .replace(new RegExp(`^${escapeRegExp(bucket)}\\/+`, 'i'), '')

  const encodedKey = encodeObjectKey(key)
  if (!encodedKey) return ''

  return `${normalizedBase}/${encodedKey}`
}

/**
 * 强制以浏览器文件下载的方式保存文件，而非在标签页内直接打开预览
 * MinIO 等文件地址通常与前端不同源，<a download> 对跨域链接会被浏览器忽略而直接跳转/预览，
 * 因此这里改为拉取 blob 后用同源的 blob: URL 触发下载；拉取失败（如 CORS 限制）时回退为新标签页打开
 */
export const downloadFileFromUrl = async (url, filename) => {
  if (!url) return
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(String(res.status))
    const blob = await res.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename || ''
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(blobUrl)
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
