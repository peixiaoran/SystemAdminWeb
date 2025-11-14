import axios from 'axios'
import i18n from '@/i18n'
import { BASE_API_URL, API_TIMEOUT, LOGIN_API } from '@/config/api/login/api'
import { handleNetworkError } from '@/utils/errorHandler'

// 创建axios实例 - 使用环境变量中的API基础URL
const service = axios.create({
  baseURL: BASE_API_URL, // 使用配置文件中的API基础URL
  timeout: API_TIMEOUT // 使用配置文件中的超时时间
})

// 请求缓存Map - 用于缓存GET请求结果
const requestCache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

// 防抖Map - 防止重复请求
const pendingRequests = new Map()
// 防抖延迟时间（毫秒）
const DEBOUNCE_DELAY = 100

// 生成请求唯一标识
const generateRequestKey = (config) => {
  const { method, url, params, data } = config
  return `${method}:${url}:${JSON.stringify(params || {})}:${JSON.stringify(data || {})}`
}

// 统一处理登出逻辑（不再显示登录过期提示）
const handleLogout = () => {
  localStorage.removeItem('token')
  // 清除缓存
  requestCache.clear()
  pendingRequests.clear()
  // 使用window.location而不是router
  window.location.href = '/#/login'
}

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 获取当前请求的URL路径
    const requestPath = config.url
    
    // 检查是否是登录API
    const isLoginRequest = requestPath.includes(LOGIN_API.USER_LOGIN)
    
    // 只有非登录请求才添加token
    const token = localStorage.getItem('token')
    if (token && !isLoginRequest) {
      // 让每个非登录请求携带token
      config.headers['Authorization'] = `Bearer ${token}`
    }

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
    
    // 对GET请求进行缓存（排除登录等敏感请求）
    if (config.method === 'get' && !config.url.includes('login')) {
      const cacheData = {
        data: response.data,
        timestamp: Date.now()
      }
      requestCache.set(requestKey, cacheData)
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

// 清理过期缓存
const cleanExpiredCache = () => {
  const now = Date.now()
  for (const [key, value] of requestCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      requestCache.delete(key)
    }
  }
}

// 定期清理缓存
setInterval(cleanExpiredCache, 60000) // 每分钟清理一次

/**
 * 封装HTTP请求方法，添加全局错误处理和缓存
 * 错误处理策略：
 * - HTTP 401：不提示，立即清理登录状态并跳转到登录页
 * - 业务码 401（data.code === 401）：不提示，行为与HTTP 401一致
 * - HTTP 403：不提示，直接跳转到403错误页
 * - 其它HTTP错误：返回标准错误对象，由调用方自行处理提示
 * - 取消与超时：透传错误供调用方自行处理
 * @param {string} method - 请求方法：get | post | put | delete
 * @returns {Function} 发起请求的异步函数
 */
const createRequest = (method) => async (url, data, options = {}) => {
  try {
    const config = {
      url,
      method,
      [['get', 'delete'].includes(method) ? 'params' : 'data']: data,
      ...options
    }
    
    // 检查GET请求缓存
    if (method === 'get' && !options.skipCache) {
      const requestKey = generateRequestKey(config)
      const cached = requestCache.get(requestKey)
      
      if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        return cached.data
      }
    }
    
    const response = await service(config)
    return response
  } catch (error) {
    // 如果是取消的请求，直接返回
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }
    
    // 处理特定状态码
    if (error && error.response) {
      const status = error.response.status
      if (status === 401) {
        // 认证失效（HTTP 401）：直接登出并跳转登录，不再显示过期提示
        handleLogout()
        // 不显示额外的错误提示
        handleNetworkError(error, { showMessage: false })
        return {
          code: 401,
          data: null,
          message: '认证已过期，请重新登录',
          success: false
        }
      }
      
      if (status === 403) {
        // 权限不足（HTTP 403）：直接跳转到403页面；不需要任何提示信息
        window.location.href = '/#/403'
        // 记录错误但不返回提示文案
        handleNetworkError(error, { showMessage: false })
        return {
          code: 403,
          data: null,
          message: '权限不足，无法访问该资源',
          success: false
        }
      }
      
      // 处理业务错误
      // 业务码401：直接登出并跳转登录，不再显示过期提示
      if (error.response.data?.code === 401) {
        handleLogout()
        // 不显示额外的错误提示
        handleNetworkError(error, { showMessage: false })
        return {
          code: 401,
          data: null,
          message: '认证已过期，请重新登录',
          success: false
        }
      }
      if (error.response.data?.code && error.response.data.code !== 200) {
        return {
          code: error.response.data.code,
          data: null,
          message: error.response.data.message,
          success: false
        }
      }
      
      // 其它HTTP错误统一提示
      const info = handleNetworkError(error, { showMessage: false })
      return {
        code: status,
        data: null,
        message: info.message,
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

// 导出各种请求方法
export const get = createRequest('get')
export const post = createRequest('post')
export const put = createRequest('put')
export const del = createRequest('delete')

// 提供清除缓存的方法
export const clearCache = () => {
  requestCache.clear()
}

// 取消所有pending请求
export const cancelAllRequests = () => {
  for (const [key, requestInfo] of pendingRequests.entries()) {
    requestInfo.source.cancel('Request cancelled by user')
  }
  pendingRequests.clear()
}

// 已移除sanitizeHtml函数，不再需要

export default service