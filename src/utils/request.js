import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { BASE_API_URL, API_TIMEOUT, IS_DEV, LOGIN_API } from '@/config/api/login/api'
import { sanitizeData, sanitizeHtml } from './xssUtils'

// 创建axios实例 - 使用环境变量中的API基础URL
const service = axios.create({
  baseURL: BASE_API_URL, // 使用配置文件中的API基础URL
  timeout: API_TIMEOUT // 使用配置文件中的超时时间
})

// 统一处理登出逻辑
const handleLogout = () => {
  localStorage.removeItem('token')
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

    // 添加语言参数
    const language = localStorage.getItem('language') || 'zh-CN'
    // 添加厂区参数
    const factory = localStorage.getItem('factory') || 'ETW'
    
    if (config.method === 'post' || config.method === 'put') {
      config.data = {
        ...config.data,
        language,
        factory
      }
    } else if (config.method === 'get' || config.method === 'delete') {
      config.params = {
        ...config.params,
        language,
        factory
      }
    }
    
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据进行XSS清洗
    return sanitizeData(response.data)
  },
  error => {
    // 直接返回错误，让具体的请求处理函数处理错误
    return Promise.reject(error)
  }
)

// 封装HTTP请求方法，添加全局错误处理
const createRequest = (method) => async (url, data) => {
  try {
    const response = await service({
      url,
      method,
      [['get', 'delete'].includes(method) ? 'params' : 'data']: data
    })
    return response
  } catch (error) {
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

// 导出XSS处理函数，供组件内使用
export { sanitizeHtml } from './xssUtils'

export default service 