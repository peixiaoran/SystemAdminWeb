import axios from 'axios'
import i18n from '@/i18n'
import { ElMessage, ElNotification } from 'element-plus'
import { BASE_API_URL, API_TIMEOUT } from '@/config/api/login/api'
import { clearClientSession } from '@/utils/sessionCleanup'

/**
 * 强制整页跳转到登录页（企业标准：URL 稳定，不使用随机 query），用于 401 会话失效场景。
 * 说明：
 * - 仅修改 hash 不会刷新页面，Pinia 的内存态可能仍在，导致登录页守卫误跳回
 * - 这里使用 replace + reload 的组合，确保整页刷新且地址保持规范：/#/login
 */
const hardRedirectToLogin = (redirectPath = '') => {
  const origin = window.location.origin
  const basePath = window.location.pathname || '/'
  const redirectQuery = redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ''
  const url = `${origin}${basePath}#/login${redirectQuery}`

  window.location.replace(url)
  setTimeout(() => {
    try {
      window.location.reload()
    } catch {
      // ignore
    }
  }, 0)
}

/**
 * ---------------------------
 * 统一错误处理（由 `errorHandler.js` 合并而来）
 * 说明：为了减少重复与跨文件跳转，将错误处理逻辑与请求封装合并维护。
 * 说明：历史上的 `src/utils/errorHandler.js` 已删除。
 * ---------------------------
 */

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
 * 解析错误信息
 * @param {Error|Object} error - 错误对象
 * @param {string} context - 错误上下文
 */
const parseError = (error, context) => {
  let message = '未知错误'
  let code = 'UNKNOWN'
  let details = null

  if (error?.response) {
    const { status, data } = error.response
    code = `HTTP_${status}`
    message = data?.message || `HTTP错误 ${status}`
    details = data
  } else if (error?.code) {
    code = error.code
    message = error.message || '业务处理失败'
    details = error.data
  } else if (error?.message) {
    message = error.message
    code = 'GENERAL_ERROR'
  } else if (typeof error === 'string') {
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
    plain: true,
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

  if (import.meta.env.DEV) {
    console.group(`错误日志 - ${context}`)
    console.error('错误信息:', errorInfo.message)
    console.error('错误代码:', errorInfo.code)
    console.error('错误详情:', errorInfo.details)
    console.error('完整日志:', logData)
    console.groupEnd()
  }

  if (import.meta.env.PROD) {
    // 这里可以集成错误监控服务，如Sentry等
    // sendToErrorMonitoring(logData)
  }
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

  const errorInfo = parseError(error, context)

  if (showMessage) {
    showErrorMessage(errorInfo, level)
  }

  if (showNotification) {
    showErrorNotification(errorInfo, level)
  }

  logError(errorInfo, context, type)

  return errorInfo
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
      throw error
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
export const handleNetworkError = (error, options = {}) => {
  const { showMessage = false, showNotification = false, level = ERROR_LEVELS.ERROR } = options

  let normalized
  if (error?.code === 'ECONNABORTED' || error?.code === 'TIMEOUT' || (typeof error?.message === 'string' && error.message.toLowerCase().includes('timeout'))) {
    normalized = { code: 'TIMEOUT', message: i18n.global.t('systembasicmgmt.errorHandler.timeout'), details: error.response?.data }
  } else if (error?.response?.status === 401) {
    normalized = { code: 'HTTP_401', message: i18n.global.t('systembasicmgmt.errorHandler.unauthorized'), details: error.response?.data }
  } else if (error?.response?.status === 403) {
    normalized = { code: 'HTTP_403', message: i18n.global.t('systembasicmgmt.errorHandler.forbidden'), details: error.response?.data }
  } else if (error?.response?.status >= 500) {
    normalized = { code: `HTTP_${error.response.status}`, message: i18n.global.t('systembasicmgmt.errorHandler.serverError'), details: error.response?.data }
  } else {
    normalized = { code: error?.code || 'NETWORK_ERROR', message: i18n.global.t('systembasicmgmt.errorHandler.networkError'), details: error.response?.data }
  }

  return handleError(normalized, '网络请求', {
    showMessage,
    showNotification,
    level,
    type: ERROR_TYPES.NETWORK
  })
}

// 创建axios实例 - 使用环境变量中的API基础URL
const service = axios.create({
  baseURL: BASE_API_URL,
  timeout: API_TIMEOUT,
  withCredentials: true
})

const pendingRequests = new Map()
const DEBOUNCE_DELAY = 100

let has401ErrorOccurred = false
let has403ErrorOccurred = false

const AUTH_EXPIRED_MESSAGE_KEY = '__auth_expired_message__'

const generateRequestKey = (config) => {
  const { method, url, params, data } = config
  return `${method}:${url}:${JSON.stringify(params || {})}:${JSON.stringify(data || {})}`
}

const safeSessionSet = (key, value) => {
  try {
    sessionStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

const handleLogout = (options = {}) => {
  const { redirect = true } = options
  
  clearClientSession({ keepLanguage: true })
  
  pendingRequests.clear()
  
  if (redirect) {
    let current = ''
    try {
      const hash = window.location.hash || ''
      current = hash.startsWith('#') ? hash.slice(1) : hash
      // 如果是登录页，不设置 redirect
      if (current.startsWith('/login')) current = ''
      // 如果是默认首页（module-select），也不设置 redirect，因为登录后会自动跳转到首页
      if (current === '/module-select' || current === '/') current = ''
      // 如果是错误页面，不设置 redirect
      if (current === '/403' || current === '/404') current = ''
      // 如果是特殊流程页面，不设置 redirect
      if (current === '/unlock' || current === '/password-expiration') current = ''
      // 如果路径不以 / 开头，清空
      if (!current.startsWith('/')) current = ''
    } catch {
      current = ''
    }

    hardRedirectToLogin(current)
  }
}

// 请求拦截器
service.interceptors.request.use(
  config => {
    const language = localStorage.getItem('language') || 'zh-CN'
    
    config.headers['Accept-Language'] = language
    
    const source = axios.CancelToken.source()
    config.cancelToken = source.token
    
    const requestKey = generateRequestKey(config)
    config.requestKey = requestKey
    
    if (pendingRequests.has(requestKey)) {
      const pendingRequest = pendingRequests.get(requestKey)
      if (Date.now() - pendingRequest.timestamp < DEBOUNCE_DELAY) {
        pendingRequest.source.cancel('Request superseded by newer request')
        pendingRequests.delete(requestKey)
      } else {
        pendingRequests.delete(requestKey)
      }
    }
    
    pendingRequests.set(requestKey, {
      source: source,
      timestamp: Date.now()
    })
    
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const { config } = response
    const requestKey = config.requestKey
    
    if (pendingRequests.has(requestKey)) {
      pendingRequests.delete(requestKey)
    }
    
    return response.data
  },
  error => {
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }
    
    const { config } = error
    if (config && config.requestKey) {
      pendingRequests.delete(config.requestKey)
    }
    
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      return Promise.reject(error)
    }
    
    return Promise.reject(error)
  }
)

/**
 * 封装HTTP请求方法，添加全局错误处理和缓存
 * 错误处理策略：
 * - HTTP 401：提示“登录已过期”，清理登录状态并跳转到登录页（登录页会补弹一次提示，避免整页刷新导致提示看不到）
 * - HTTP 403：不提示，直接跳转到403错误页
 * - 其它HTTP错误：返回标准错误对象，由调用方自行处理提示
 * - 取消与超时：透传错误供调用方自行处理
 * @returns {Function} 发起请求的异步函数
 */
/**
 * 创建请求方法
 * 说明：封装HTTP请求的通用处理，包含401/403等状态的统一处理与提示
 */
const createPostRequest = () => async (url, data, options = {}) => {
  try {
    const { silentAuthError: _silentAuthError = true, disableAutoLogout: _disableAutoLogout = false, ...axiosOptions } = options
    const config = {
      url,
      method: 'post',
      data,
      ...axiosOptions
    }
    const response = await service(config)
    return response
  } catch (error) {
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }
    
    if (error && error.response) {
      const status = error.response.status
      const responseData = error.response.data

      if (![400, 401, 403, 404].includes(status)) {
        return responseData
      }

      if (status === 401) {
        const { silentAuthError = true, disableAutoLogout = false } = options
        if (!has401ErrorOccurred) {
          has401ErrorOccurred = true
          safeSessionSet(AUTH_EXPIRED_MESSAGE_KEY, i18n.global.t('systembasicmgmt.errorHandler.unauthorized'))
          ElMessage({
            type: 'warning',
            message: i18n.global.t('systembasicmgmt.errorHandler.unauthorized'),
            duration: 3000,
            plain: true,
            showClose: true
          })
          handleLogout({ redirect: !disableAutoLogout })
        }
        if (silentAuthError === false) {
          return { code: 401, data: null, message: i18n.global.t('systembasicmgmt.errorHandler.unauthorized'), success: false }
        }
        return { code: 200, data: null, totalCount: 0, message: '', success: true }
      }
      
      if (status === 403) {
        has403ErrorOccurred = true
        const origin = window.location.origin
        const basePath = window.location.pathname || '/'
        window.location.replace(`${origin}${basePath}#/403`)
        handleNetworkError(error, { showMessage: false })
        return {
          code: 200,
          data: null,
          totalCount: 0,
          message: '',
          success: true
        }
      }
      
      const info = handleNetworkError(error, { showMessage: false })
      return {
        code: status,
        data: responseData ?? null,
        message: responseData?.message || info.message,
        success: false
      }
    }
    
    const info = handleNetworkError(error, { showMessage: false })
    return {
      code: -1,
      data: null,
      message: info.message,
      success: false
    }
  }
}

export const post = createPostRequest()

export const cancelAllRequests = () => {
  for (const [key, requestInfo] of pendingRequests.entries()) {
    requestInfo.source.cancel('Request cancelled by user')
  }
  pendingRequests.clear()
}

export const resetAuthErrorState = () => {
  has401ErrorOccurred = false
  has403ErrorOccurred = false
}

export default service
