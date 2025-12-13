import axios from 'axios'
import i18n from '@/i18n'
import { ElMessage, ElNotification } from 'element-plus'
import { BASE_API_URL, API_TIMEOUT, LOGIN_API } from '@/config/api/login/api'
import { clearAuthStorage } from '@/utils/authStorage'

/**
 * 强制整页跳转到登录页（带 query 强制刷新），用于 401 会话失效场景。
 * 说明：
 * - 仅修改 hash 不会刷新页面，Pinia 的内存态/缓存可能仍在，导致登录页守卫又跳回 /module-select
 * - 通过增加 search 参数触发浏览器 reload，确保前端内存态被清空
 */
const hardRedirectToLogin = () => {
  const origin = window.location.origin
  const basePath = window.location.pathname || '/'
  const url = `${origin}${basePath}?_logout=${Date.now()}#/login`
  window.location.replace(url)
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

  // 开发环境下在控制台输出详细错误信息
  if (import.meta.env.DEV) {
    console.group(`错误日志 - ${context}`)
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
export const handleNetworkError = (error, options = {}) => {
  const { showMessage = false, showNotification = false, level = ERROR_LEVELS.ERROR } = options

  // 规范化错误信息（超时/权限/服务器错误等）
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
  baseURL: BASE_API_URL, // 使用配置文件中的API基础URL
  timeout: API_TIMEOUT, // 使用配置文件中的超时时间
  // 使用 HttpOnly Cookie 作为认证方式时，必须携带凭证（跨域也需要）
  withCredentials: true
})

// 防抖Map - 防止重复请求
const pendingRequests = new Map()
// 防抖延迟时间（毫秒）
const DEBOUNCE_DELAY = 100

// 全局状态管理 - 跟踪401/403错误发生
let has401ErrorOccurred = false
let has403ErrorOccurred = false

// 生成请求唯一标识
const generateRequestKey = (config) => {
  const { method, url, params, data } = config
  return `${method}:${url}:${JSON.stringify(params || {})}:${JSON.stringify(data || {})}`
}

// 统一处理登出逻辑
/**
 * 执行统一登出流程
 * 说明：清理本地状态与请求缓存，并跳转到登录页
 */
const handleLogout = (options = {}) => {
  const { redirect = true } = options
  
  // 保存语言设置
  const currentLanguage = localStorage.getItem('language')
  
  // Cookie(HttpOnly) 无法由前端直接删除，这里仅清理前端本地状态
  clearAuthStorage()
  
  // 清除所有可能影响路由跳转的 localStorage 数据（包括 Pinia 持久化）
  localStorage.removeItem('tabs-store')
  localStorage.removeItem('pmenu-store')
  localStorage.removeItem('user-store')  // 清除 Pinia 用户状态持久化
  
  // 恢复语言设置
  if (currentLanguage) {
    localStorage.setItem('language', currentLanguage)
  }
  
  // 清除请求防抖状态
  pendingRequests.clear()
  
  // 使用 window.location 强制跳转到登录页（避免循环依赖）
  if (redirect) {
    // 强制整页刷新到登录页，避免 Pinia 内存态导致登录页守卫误跳转
    hardRedirectToLogin()
  }
}

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 获取当前请求的URL路径
    const requestPath = config.url || ''
    
    // 检查是否是登录API
    const isLoginRequest = requestPath.includes(LOGIN_API.USER_LOGIN)
    
    // Cookie(HttpOnly) 登录：不再从 localStorage 注入 Authorization
    // 仅保留 isLoginRequest 判断用于未来扩展（例如登录接口特殊处理）
    void isLoginRequest

    // 添加语言参数到请求头
    const language = localStorage.getItem('language') || 'zh-CN'
    
    // 设置请求头
    config.headers['Accept-Language'] = language
    
    // 为请求添加取消token
    const source = axios.CancelToken.source()
    config.cancelToken = source.token
    
    // 生成请求key用于防抖和缓存
    const requestKey = generateRequestKey(config)
    config.requestKey = requestKey
    
    // 检查是否有相同的请求正在进行（防抖）
    if (pendingRequests.has(requestKey)) {
      const pendingRequest = pendingRequests.get(requestKey)
      // 检查请求时间间隔，如果间隔太短则取消之前的请求
      if (Date.now() - pendingRequest.timestamp < DEBOUNCE_DELAY) {
        // 取消之前的请求
        pendingRequest.source.cancel('Request superseded by newer request')
        // 清理已取消的请求
        pendingRequests.delete(requestKey)
      } else {
        // 如果间隔足够长，允许并发请求
        pendingRequests.delete(requestKey)
      }
    }
    
    // 存储当前请求的取消token和时间戳
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
    
    // 请求完成后从pending中移除
    if (pendingRequests.has(requestKey)) {
      pendingRequests.delete(requestKey)
    }
    
    // 移除XSS清洗，直接返回数据
    return response.data
  },
  error => {
    // 如果是取消的请求，不处理错误
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }
    
    const { config } = error
    if (config && config.requestKey) {
      pendingRequests.delete(config.requestKey)
    }
    
    // 处理超时错误 → 统一交由 createRequest 捕获处理
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      return Promise.reject(error)
    }
    
    // 直接返回错误，让具体的请求处理函数处理错误
    return Promise.reject(error)
  }
)

/**
 * 封装HTTP请求方法，添加全局错误处理和缓存
 * 错误处理策略：
 * - HTTP 401：不提示，立即清理登录状态并跳转到登录页
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
    // 允许调用方控制 401/403 的处理策略（用于 /me 探活闭环等场景）
    const { silentAuthError = true, disableAutoLogout = false, ...axiosOptions } = options
    const config = {
      url,
      method: 'post',
      data,
      ...axiosOptions
    }
    
    const response = await service(config)
    return response
  } catch (error) {
    // 如果是取消的请求，直接返回
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }
    
    // 仅按 HTTP 状态码处理：
    // - 400/401/403/404：在这里做统一处理（401/403 走全局跳转；400/404 返回标准错误对象）
    // - 其它状态码：一律“正常返回” response.data，让各页面按业务码/业务逻辑自行处理
    if (error && error.response) {
      const status = error.response.status
      const responseData = error.response.data

      // 除 400/401/403/404 之外全部正常返回
      if (![400, 401, 403, 404].includes(status)) {
        return responseData
      }

      if (status === 401) {
        // 认证失效（HTTP 401）：只在第一次时显示登录过期警告提示
        if (!has401ErrorOccurred) {
          has401ErrorOccurred = true
          ElMessage({
            type: 'warning',
            message: i18n.global.t('systembasicmgmt.errorHandler.unauthorized'),
            duration: 3000,
            plain: true,
            showClose: true
          })
          // 立即执行登出；默认跳转登录（可被 disableAutoLogout 关闭，由上层自行控制跳转）
          handleLogout({ redirect: !options.disableAutoLogout })
        }
        // 默认返回"静默成功"避免各业务页面重复提示；但允许调用方拿到明确 401（用于会话探活闭环）
        if (options.silentAuthError === false) {
          return { code: 401, data: null, message: i18n.global.t('systembasicmgmt.errorHandler.unauthorized'), success: false }
        }
        return { code: 200, data: null, totalCount: 0, message: '', success: true }
      }
      
      if (status === 403) {
        // 权限不足（HTTP 403）：直接跳转到403页面；不需要任何提示信息
        has403ErrorOccurred = true
        window.location.href = '/#/403'
        // 记录错误但不返回提示文案
        handleNetworkError(error, { showMessage: false })
        // 返回"静默成功"结果，避免各业务页面再次弹出错误提示
        return {
          code: 200,
          data: null,
          totalCount: 0,
          message: '',
          success: true
        }
      }
      
      // 仅处理 400/404：返回标准错误对象（同时保留后端返回体，供页面自行按需处理）
      const info = handleNetworkError(error, { showMessage: false })
      return {
        code: status,
        data: responseData ?? null,
        message: responseData?.message || info.message,
        success: false
      }
    }
    
    // 非HTTP错误（网络/未知）
    const info = handleNetworkError(error, { showMessage: false })
    return {
      code: -1,
      data: null,
      message: info.message,
      success: false
    }
  }
}

// 仅导出 POST 请求（约定：业务系统所有接口均使用 POST，业务码由页面自行处理）
export const post = createPostRequest()

// 取消所有pending请求
export const cancelAllRequests = () => {
  for (const [key, requestInfo] of pendingRequests.entries()) {
    requestInfo.source.cancel('Request cancelled by user')
  }
  pendingRequests.clear()
}

// 重置认证错误标志，允许新的请求继续发送
export const resetAuthErrorState = () => {
  has401ErrorOccurred = false
  has403ErrorOccurred = false
}

// 已移除sanitizeHtml函数，不再需要

export default service
