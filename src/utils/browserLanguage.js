/**
 * 根据浏览器语言判断界面语言：简体中文 → zh-CN，其余一律 en-US。
 * 繁体（zh-TW / zh-HK / zh-MO / zh-Hant*）不属于简体中文，按“其他语言”处理为英文。
 * 本文件不依赖任何模块，可被轻量入口（如 deviceGuard）直接引用。
 */
const TRADITIONAL_RE = /^zh-(tw|hk|mo|hant)/i

export function detectBrowserLanguage() {
  if (typeof navigator === 'undefined') return 'en-US'
  const first = String(
    (navigator.languages && navigator.languages[0]) || navigator.language || ''
  ).trim()
  if (/^zh(-|_|$)/i.test(first) && !TRADITIONAL_RE.test(first.replace('_', '-'))) {
    return 'zh-CN'
  }
  return 'en-US'
}
