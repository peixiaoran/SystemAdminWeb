import axios from 'axios'
import i18n from '@/i18n'
import { ElMessage, ElNotification } from 'element-plus'
import { BASE_API_URL, API_TIMEOUT } from '@/config/api/login/api'
import { clearClientSession } from '@/utils/sessionCleanup'

/** replace + reload，避免 hash 跳转后 Pinia 内存态残留 */
const hardRedirectToLogin = (redirectPath = '') => {
  const origin = window.location.origin
  const basePath = window.location.pathname || '/'
  const redirectQuery = redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ''
  window.location.replace(`${origin}${basePath}#/login${redirectQuery}`)
  setTimeout(() => {
    try {
      window.location.reload()
    } catch {
      // ignore
    }
  }, 0)
}

export const ERROR_TYPES = {
  NETWORK: 'network',
  VALIDATION: 'validation',
  BUSINESS: 'business',
  PERMISSION: 'permission',
  UNKNOWN: 'unknown'
}

export const ERROR_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
}

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

  return { message, code, details, context, timestamp: new Date().toISOString() }
}

const showErrorMessage = (errorInfo, level) => {
  ElMessage({
    type: level === ERROR_LEVELS.WARNING ? 'warning' : 'error',
    message: errorInfo.message,
    duration: 5000,
    plain: true,
    showClose: true
  })
}

const showErrorNotification = (errorInfo, level) => {
  ElNotification({
    type: level === ERROR_LEVELS.WARNING ? 'warning' : 'error',
    title: '系统提示',
    message: errorInfo.message,
    duration: 8000,
    showClose: true
  })
}

const logError = () => {}

export const handleError = (error, context = '', options = {}) => {
  const {
    showMessage = true,
    showNotification = false,
    level = ERROR_LEVELS.ERROR,
    type = ERROR_TYPES.UNKNOWN
  } = options

  const errorInfo = parseError(error, context)

  if (showMessage) showErrorMessage(errorInfo, level)
  if (showNotification) showErrorNotification(errorInfo, level)
  logError(errorInfo, context, type)

  return errorInfo
}

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

export const handleFormValidationError = (errors, formRef) => {
  if (formRef?.setFields) formRef.setFields(errors)
  const firstError = Object.values(errors)[0]
  if (firstError) ElMessage.warning(firstError.message || '表单验证失败')
}

export const handleNetworkError = (error, options = {}) => {
  const { showMessage = false, showNotification = false, level = ERROR_LEVELS.ERROR } = options

  let normalized
  if (isTimeoutError(error)) {
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

  return handleError(normalized, '网络请求', { showMessage, showNotification, level, type: ERROR_TYPES.NETWORK })
}

const service = axios.create({
  baseURL: BASE_API_URL,
  timeout: API_TIMEOUT,
  withCredentials: true
})

const pendingRequests = new Map()
const DEBOUNCE_DELAY = 100
const NETWORK_ERROR_COOLDOWN_MS = 5000
const TIMEOUT_COOLDOWN_MS = 5000

let has401ErrorOccurred = false
let lastNetworkErrorTime = 0
let lastTimeoutShownTime = 0

const AUTH_EXPIRED_MESSAGE_KEY = '__auth_expired_message__'
const FORBIDDEN_SOURCE_PATH_KEY = '__forbidden_source_path__'
const SKIP_TRACK_HASH_PATHS = new Set(['/', '/login', '/module-select', '/403', '/404'])
const SKIP_REDIRECT_HASH_PATHS = new Set(['/', '/module-select', '/403', '/404', '/unlock', '/password-expiration'])

const isTimeoutError = (error) => {
  if (!error) return false
  if (error.code === 'ECONNABORTED' || error.code === 'TIMEOUT') return true
  const msg = typeof error.message === 'string' ? error.message.toLowerCase() : ''
  return msg.includes('timeout')
}

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

const getRawCurrentHashPath = () => {
  try {
    const hash = window.location.hash || ''
    return hash.startsWith('#') ? hash.slice(1) : hash
  } catch {
    return ''
  }
}

const getCurrentHashPath = () => {
  const current = getRawCurrentHashPath()
  if (!current.startsWith('/') || SKIP_TRACK_HASH_PATHS.has(current)) return ''
  return current
}

const getRedirectPathAfterLogout = () => {
  const current = getRawCurrentHashPath()
  if (!current.startsWith('/') || current.startsWith('/login') || SKIP_REDIRECT_HASH_PATHS.has(current)) return ''
  return current
}

const createHandledResponse = ({ success, handled = false }) => ({
  code: 200,
  data: null,
  totalCount: 0,
  message: '',
  success,
  ...(handled ? { __handled: true } : {})
})

const createAuthFailureResponse = (code, message) => ({
  code,
  data: null,
  message,
  success: false
})

export const isHandled = (res) => res?.__handled === true

const showWarningMessage = (message) => {
  ElMessage({ type: 'warning', message, duration: 3000, plain: true, showClose: true })
}

const markThrottledWarning = (cooldownMs, lastShownAt) => {
  const now = Date.now()
  if (now - lastShownAt <= cooldownMs) return null
  return now
}

const handleUnauthorized = (options = {}) => {
  const { silentAuthError = true, disableAutoLogout = false } = options
  const unauthorizedMessage = i18n.global.t('systembasicmgmt.errorHandler.unauthorized')

  if (!has401ErrorOccurred) {
    has401ErrorOccurred = true
    safeSessionSet(AUTH_EXPIRED_MESSAGE_KEY, unauthorizedMessage)
    showWarningMessage(unauthorizedMessage)
    handleLogout({ redirect: !disableAutoLogout })
  }

  return silentAuthError === false
    ? createAuthFailureResponse(401, unauthorizedMessage)
    : createHandledResponse({ success: true })
}

const handleForbidden = (error = null, options = {}) => {
  const { silentForbiddenError = true } = options
  const forbiddenMessage = error?.response?.data?.message || i18n.global.t('systembasicmgmt.errorHandler.forbidden')

  if (silentForbiddenError === false) {
    return createAuthFailureResponse(403, forbiddenMessage)
  }

  const currentPath = getCurrentHashPath()
  if (currentPath) safeSessionSet(FORBIDDEN_SOURCE_PATH_KEY, currentPath)

  const origin = window.location.origin
  const basePath = window.location.pathname || '/'
  window.location.replace(`${origin}${basePath}#/403`)

  if (error) handleNetworkError(error, { showMessage: false })
  return createHandledResponse({ success: true })
}

const handleLogout = (options = {}) => {
  clearClientSession({ keepLanguage: true })
  pendingRequests.clear()
  if (options.redirect !== false) {
    hardRedirectToLogin(getRedirectPathAfterLogout())
  }
}

service.interceptors.request.use(
  (config) => {
    config.headers['Accept-Language'] = localStorage.getItem('language') || 'zh-CN'

    const source = axios.CancelToken.source()
    config.cancelToken = source.token

    if (config.skipDedupe === true) return config

    const requestKey = generateRequestKey(config)
    config.requestKey = requestKey

    const pending = pendingRequests.get(requestKey)
    if (pending) {
      if (Date.now() - pending.timestamp < DEBOUNCE_DELAY) {
        pending.source.cancel('Request superseded by newer request')
      }
      pendingRequests.delete(requestKey)
    }

    pendingRequests.set(requestKey, { source, timestamp: Date.now() })
    return config
  },
  (error) => Promise.reject(error)
)

service.interceptors.response.use(
  (response) => {
    const requestKey = response.config?.requestKey
    if (requestKey) pendingRequests.delete(requestKey)
    return response.data
  },
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error)
    const requestKey = error.config?.requestKey
    if (requestKey) pendingRequests.delete(requestKey)
    return Promise.reject(error)
  }
)

const createPostRequest = () => async (url, data, options = {}) => {
  const {
    skipDedupe = false,
    allowLoginBusinessCodes = false,
    ...axiosOptions
  } = options

  try {
    const response = await service({
      url,
      method: 'post',
      data,
      skipDedupe,
      ...axiosOptions
    })

    if (!allowLoginBusinessCodes) {
      if (response?.code === 401) return handleUnauthorized(options)
      if (response?.code === 403) return handleForbidden(null, options)
    }

    return response
  } catch (error) {
    if (axios.isCancel(error)) return Promise.reject(error)

    if (isTimeoutError(error)) {
      const ts = markThrottledWarning(TIMEOUT_COOLDOWN_MS, lastTimeoutShownTime)
      if (ts) {
        lastTimeoutShownTime = ts
        lastNetworkErrorTime = ts
        showWarningMessage(i18n.global.t('systembasicmgmt.errorHandler.timeout'))
      }
      return createHandledResponse({ success: false, handled: true })
    }

    if (error?.response) {
      const { status, data: responseData } = error.response

      if (![400, 401, 403, 404].includes(status)) return responseData
      if (status === 401) return handleUnauthorized(options)
      if (status === 403) return handleForbidden(error, options)

      const info = handleNetworkError(error, { showMessage: false })
      return {
        code: status,
        data: responseData ?? null,
        message: responseData?.message || info.message,
        success: false
      }
    }

    const info = handleNetworkError(error, { showMessage: false })
    const ts = markThrottledWarning(NETWORK_ERROR_COOLDOWN_MS, lastNetworkErrorTime)
    if (ts) {
      lastNetworkErrorTime = ts
      showWarningMessage(info.message)
    }

    return createHandledResponse({ success: false, handled: true })
  }
}

export const post = createPostRequest()

export const cancelAllRequests = () => {
  for (const [, requestInfo] of pendingRequests.entries()) {
    requestInfo.source.cancel('Request cancelled by user')
  }
  pendingRequests.clear()
}

export const resetAuthErrorState = () => {
  has401ErrorOccurred = false
  lastTimeoutShownTime = 0
  lastNetworkErrorTime = 0
}

export default service
