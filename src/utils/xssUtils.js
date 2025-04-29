/**
 * XSS防护工具函数
 */
import DOMPurify from 'dompurify'

/**
 * 配置DOMPurify
 * 根据项目需求进行额外配置
 */
DOMPurify.setConfig({
  FORBID_TAGS: ['script', 'style', 'iframe', 'frame', 'object', 'embed', 'form'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'href', 'src']
})

/**
 * 清理HTML内容，防止XSS攻击
 * @param {string} html 需要清理的HTML内容
 * @returns {string} 清理后的安全HTML
 */
export const sanitizeHtml = (html) => {
  if (typeof html !== 'string') {
    return html
  }
  return DOMPurify.sanitize(html)
}

/**
 * 递归清理对象中所有字符串值，防止XSS攻击
 * @param {any} data 需要清理的数据
 * @returns {any} 清理后的数据
 */
export const sanitizeData = (data) => {
  // 处理null或undefined
  if (data == null) {
    return data
  }
  
  // 处理字符串
  if (typeof data === 'string') {
    return sanitizeHtml(data)
  }
  
  // 处理数组
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item))
  }
  
  // 处理对象
  if (typeof data === 'object') {
    const cleanedObject = {}
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        cleanedObject[key] = sanitizeData(data[key])
      }
    }
    return cleanedObject
  }
  
  // 其他类型直接返回（数字、布尔值等）
  return data
}

/**
 * 将文本内容转义为纯文本（移除所有HTML标签）
 * @param {string} text 需要转义的文本内容
 * @returns {string} 转义后的纯文本
 */
export const escapeHtml = (text) => {
  if (typeof text !== 'string') {
    return text
  }
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Vue指令：v-safe-html
 * 用于替代v-html，安全地渲染HTML内容
 */
export const vSafeHtml = {
  mounted(el, binding) {
    el.innerHTML = sanitizeHtml(binding.value)
  },
  updated(el, binding) {
    el.innerHTML = sanitizeHtml(binding.value)
  }
}

/**
 * 验证输入是否包含潜在的XSS攻击代码
 * @param {string} input 输入内容
 * @returns {boolean} 是否包含潜在风险
 */
export const containsXssRisk = (input) => {
  if (typeof input !== 'string') {
    return false
  }
  
  // 检查常见的XSS攻击模式
  const xssPatterns = [
    /<script\b[^>]*>(.*?)<\/script>/gmi,
    /javascript\s*:/gmi,
    /on\w+\s*=/gmi,
    /<iframe\b[^>]*>(.*?)<\/iframe>/gmi,
    /<embed\b[^>]*>(.*?)<\/embed>/gmi,
    /<object\b[^>]*>(.*?)<\/object>/gmi
  ]
  
  return xssPatterns.some(pattern => pattern.test(input))
}

export default {
  sanitizeHtml,
  sanitizeData,
  escapeHtml,
  vSafeHtml,
  containsXssRisk
} 