import { unref } from 'vue'

/** 从 el-form 的 rules 中取出必填字段名 */
export const getRequiredKeys = (rules) => {
  const source = unref(rules) || {}
  return Object.keys(source).filter((key) => {
    const list = [].concat(source[key] || [])
    return list.some((rule) => rule && rule.required)
  })
}

/**
 * 提交参数规整：非必填的空字符串转为 null（后端非必填字段要求 null，而不是 ''）
 * @param {Object} payload 提交参数（仅处理第一层）
 * @param {Object|Array<string>} [required] 表单 rules 对象，或必填字段名数组；必填字段保持原值
 * @param {Array<string>} [keepKeys] 后端要求为字符串、不允许 null 的字段（如新增时传 '' 的主键 id），保持原值
 */
export const emptyToNull = (payload, required = [], keepKeys = []) => {
  const requiredKeys = Array.isArray(required) ? required : getRequiredKeys(required)
  const result = { ...payload }
  Object.keys(result).forEach((key) => {
    if (requiredKeys.includes(key) || keepKeys.includes(key)) return
    const value = result[key]
    if (typeof value === 'string' && value.trim() === '') {
      result[key] = null
    }
  })
  return result
}
