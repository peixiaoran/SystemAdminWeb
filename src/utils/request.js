import axios from 'axios'
import { BASE_API_URL, API_TIMEOUT, LOGIN_API } from '@/config/api/login/api'

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

// 生成请求唯一标识
const generateRequestKey = (config) => {
  const { method, url, params, data } = config
  return `${method}:${url}:${JSON.stringify(params || {})}:${JSON.stringify(data || {})}`
}

// 统一处理登出逻辑
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
    const language = localStorage.getItem('language') || 'zh-TW'
    // 添加厂区参数到请求头
    const factory = localStorage.getItem('factory') || 'ETW'
    
    // 设置请求头
    config.headers['Accept-Language'] = language
    config.headers['Factory'] = factory
    
    // 为请求添加取消token
    const source = axios.CancelToken.source()
    config.cancelToken = source.token
    
    // 生成请求key用于防抖和缓存
    const requestKey = generateRequestKey(config)
    config.requestKey = requestKey
    
    // 检查是否有相同的请求正在进行（防抖）
    if (pendingRequests.has(requestKey)) {
      // 取消之前的请求
      const prevSource = pendingRequests.get(requestKey)
      prevSource.cancel('Request superseded by newer request')
    }
    
    // 存储当前请求的取消token
    pendingRequests.set(requestKey, source)
    
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

// 封装HTTP请求方法，添加全局错误处理和缓存
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
    if (error.response) {
      switch (error.response.status) {
        case 401:
          handleLogout()
          break
        case 403:
          handleLogout()
          break
        default:
          // 处理业务错误
          if (error.response.data?.code && error.response.data.code !== 200) {
            return {
              code: error.response.data.code,
              data: null,
              message: error.response.data.message,
              success: false
            }
          }
      }
    }
    
    // 阻止后续处理
    return new Promise(() => {})
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
  for (const [key, source] of pendingRequests.entries()) {
    source.cancel('Request cancelled by user')
  }
  pendingRequests.clear()
}

// 提供一个空的sanitizeHtml函数以保持兼容性
export const sanitizeHtml = (html) => html

export default service 