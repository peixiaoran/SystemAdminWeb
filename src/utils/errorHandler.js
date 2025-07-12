/**
 * 统一错误处理工具
 * 提供更好的错误处理和用户友好的提示
 */
import { ElMessage, ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'

// 错误类型定义
export const ERROR_TYPES = {
  NETWORK: 'network',
  VALIDATION: 'validation',
  BUSINESS: 'business',
  PERMISSION: 'permission',
  UNKNOWN: 'unknown'
}

// 错误级别定义
export const ERROR_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
}

/**
 * 统一错误处理函数
 * @param {Error|Object} error - 错误对象
 * @param {string} context - 错误上下文
 * @param {Object} options - 配置选项
 */
export const handleError = (error, context = '', options = {}) => {
  const {
    showMessage = true,
    showNotification = false,
    level = ERROR_LEVELS.ERROR,
    type = ERROR_TYPES.UNKNOWN
  } = options

  // 获取错误信息
  const errorInfo = parseError(error, context)
  
  // 显示用户友好的错误提示
  if (showMessage) {
    showErrorMessage(errorInfo, level)
  }
  
  if (showNotification) {
    showErrorNotification(errorInfo, level)
  }
  
  // 记录错误日志
  logError(errorInfo, context, type)
  
  return errorInfo
}

/**
 * 解析错误信息
 * @param {Error|Object} error - 错误对象
 * @param {string} context - 错误上下文
 */
const parseError = (error, context) => {
  let message = '未知错误'
  let code = 'UNKNOWN'
  let details = null
  
  if (error?.response) {
    // HTTP错误
    const { status, data } = error.response
    code = `HTTP_${status}`
    message = data?.message || `HTTP错误 ${status}`
    details = data
  } else if (error?.code) {
    // 业务错误
    code = error.code
    message = error.message || '业务处理失败'
    details = error.data
  } else if (error?.message) {
    // 一般错误
    message = error.message
    code = 'GENERAL_ERROR'
  } else if (typeof error === 'string') {
    // 字符串错误
    message = error
    code = 'STRING_ERROR'
  }
  
  return {
    message,
    code,
    details,
    context,
    timestamp: new Date().toISOString()
  }
}

/**
 * 显示错误消息
 * @param {Object} errorInfo - 错误信息
 * @param {string} level - 错误级别
 */
const showErrorMessage = (errorInfo, level) => {
  const messageType = level === ERROR_LEVELS.WARNING ? 'warning' : 'error'
  ElMessage({
    type: messageType,
    message: errorInfo.message,
    duration: 5000,
    showClose: true
  })
}

/**
 * 显示错误通知
 * @param {Object} errorInfo - 错误信息
 * @param {string} level - 错误级别
 */
const showErrorNotification = (errorInfo, level) => {
  const notificationType = level === ERROR_LEVELS.WARNING ? 'warning' : 'error'
  ElNotification({
    type: notificationType,
    title: '系统提示',
    message: errorInfo.message,
    duration: 8000,
    showClose: true
  })
}

/**
 * 记录错误日志
 * @param {Object} errorInfo - 错误信息
 * @param {string} context - 错误上下文
 * @param {string} type - 错误类型
 */
const logError = (errorInfo, context, type) => {
  const logData = {
    ...errorInfo,
    type,
    userAgent: navigator.userAgent,
    url: window.location.href
  }
  
  // 开发环境下在控制台输出详细错误信息
  if (import.meta.env.DEV) {
    console.group(`🚨 错误日志 - ${context}`)
    console.error('错误信息:', errorInfo.message)
    console.error('错误代码:', errorInfo.code)
    console.error('错误详情:', errorInfo.details)
    console.error('完整日志:', logData)
    console.groupEnd()
  }
  
  // 生产环境下可以发送到错误监控服务
  if (import.meta.env.PROD) {
    // 这里可以集成错误监控服务，如Sentry等
    // sendToErrorMonitoring(logData)
  }
}

/**
 * 创建带有错误处理的异步函数包装器
 * @param {Function} asyncFn - 异步函数
 * @param {string} context - 错误上下文
 * @param {Object} options - 配置选项
 */
export const withErrorHandling = (asyncFn, context, options = {}) => {
  return async (...args) => {
    try {
      return await asyncFn(...args)
    } catch (error) {
      handleError(error, context, options)
      throw error // 重新抛出错误以便调用者处理
    }
  }
}

/**
 * 表单验证错误处理
 * @param {Object} errors - 验证错误对象
 * @param {Object} formRef - 表单引用
 */
export const handleFormValidationError = (errors, formRef) => {
  if (formRef && formRef.setFields) {
    formRef.setFields(errors)
  }
  
  const firstError = Object.values(errors)[0]
  if (firstError) {
    ElMessage.warning(firstError.message || '表单验证失败')
  }
}

/**
 * 网络错误处理
 * @param {Error} error - 网络错误
 */
export const handleNetworkError = (error) => {
  let message = '网络连接失败，请检查网络设置'
  
  if (error.code === 'NETWORK_ERROR') {
    message = '网络连接失败，请检查网络设置'
  } else if (error.code === 'TIMEOUT') {
    message = '请求超时，请稍后重试'
  } else if (error.response?.status === 401) {
    message = '登录已过期，请重新登录'
    // 这里可以触发重新登录逻辑
  } else if (error.response?.status === 403) {
    message = '没有权限访问此资源'
  } else if (error.response?.status >= 500) {
    message = '服务器内部错误，请稍后重试'
  }
  
  return handleError(error, '网络请求', {
    showMessage: true,
    type: ERROR_TYPES.NETWORK
  })
} 