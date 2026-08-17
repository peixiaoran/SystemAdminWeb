import axios from 'axios'
import i18n from '@/i18n'
import { ElMessage } from 'element-plus'
import { BASE_API_URL, API_TIMEOUT } from '@/config/api/login/api'
import { clearClientSession } from '@/utils/sessionCleanup'

/**
 * ============================================================================
 * HTTP 状态码 / 业务 code 处理总表（仅作用于 post()）
 * ----------------------------------------------------------------------------
 * 场景                     | 提示方式        | 是否跳转        | post() 的返回值
 * -------------------------|-----------------|-----------------|------------------
 * 200 + 业务 code 200      | 无              | 否              | 后端原始响应
 * 200 + 业务 code 401      | 登录页统一弹出  | 硬跳转 /login   | 见下方「静默开关」
 * 200 + 业务 code 403      | 403 页统一弹出  | 硬跳转 /403     | 见下方「静默开关」
 * 200 + 其他业务 code      | 无（页面自行处理）| 否            | 后端原始响应
 * 401 未认证               | 登录页统一弹出  | 硬跳转 /login   | 见下方「静默开关」
 * 403 无权限               | 403 页统一弹出  | 硬跳转 /403     | 见下方「静默开关」
 * 404 接口地址不存在        | error toast     | 否（仅控制台留痕）| handled 失败响应
 * 408 / 504 网关超时        | error toast     | 否              | handled 失败响应
 * 400 / 422 参数校验失败    | warning toast   | 否              | handled 失败响应
 * 其余 4xx（如 409/429）    | warning toast   | 否              | handled 失败响应
 * 5xx 服务端故障            | error toast     | 否              | handled 失败响应
 * 请求超时（客户端中断）     | error toast     | 否              | handled 失败响应
 * 断网 / 无响应             | error toast     | 否              | handled 失败响应
 * 请求被去重取消            | 无              | 否              | reject（调用方需忽略）
 *
 * 「静默开关」：
 *   - 默认（silentAuthError / silentForbiddenError 为 true）返回成功占位响应，
 *     因为页面即将被硬跳转销毁，不应再触发页面自身的错误分支。
 *   - 传 false 时返回 __isHttpError 标记的失败响应，交由页面自行展示（如模块选择页）。
 *
 * 「handled 失败响应」：{ code:200, success:false, __handled:true }，
 *   toast 已在此处弹过，页面用 isHandled(res) 判断后应直接 return，避免重复提示。
 *
 * 注意：postBlob() 不走上表，任何错误都直接 reject 给调用方自行 catch。
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// 部署基路径工具（history 模式，生产为 /systemadminweb/，开发为 /）
// ---------------------------------------------------------------------------

// 始终以 / 结尾
const APP_BASE_URL = (import.meta.env.BASE_URL || '/').replace(/\/*$/, '/')

/** 去除 base 前缀，得到以 / 开头的应用内路由路径 */
const stripAppBase = (pathname) => {
  const base = APP_BASE_URL.replace(/\/$/, '')
  let p = pathname || '/'
  if (base && (p === base || p.startsWith(`${base}/`))) {
    p = p.slice(base.length) || '/'
  }
  return p.startsWith('/') ? p : `/${p}`
}

/** 拼接 base 下的完整目标地址 */
const buildAppUrl = (routePath) => `${window.location.origin}${APP_BASE_URL}${routePath.replace(/^\//, '')}`

// ---------------------------------------------------------------------------
// 常量与模块级状态
// ---------------------------------------------------------------------------

const service = axios.create({
  baseURL: BASE_API_URL,
  timeout: API_TIMEOUT,
  withCredentials: true
})

/** 同 key 请求在该窗口内重复发起时，取消旧请求 */
const DEBOUNCE_DELAY = 100
/** 同一条文案在该窗口内只弹一次，避免并发失败刷屏 */
const TOAST_THROTTLE_MS = 5000

const AUTH_EXPIRED_MESSAGE_KEY = '__auth_expired_message__'
const FORBIDDEN_MESSAGE_KEY = '__forbidden_message__'
const FORBIDDEN_SOURCE_PATH_KEY = '__forbidden_source_path__'

/** 这些路径本身就是「无业务上下文」页，不作为 403 来源、也不作为登录后回跳目标 */
const SKIP_TRACK_PATHS = new Set(['/', '/login', '/module-select', '/403', '/404'])
const SKIP_REDIRECT_PATHS = new Set(['/', '/module-select', '/403', '/404', '/unlock', '/password-expiration'])

/** 进行中的请求：requestKey -> { source, timestamp } */
const pendingRequests = new Map()
/** 最近弹过的 toast：message -> timestamp */
const recentToasts = new Map()

let has401ErrorOccurred = false

const t = (key, params) => i18n.global.t(key, params)

// ---------------------------------------------------------------------------
// 基础工具
// ---------------------------------------------------------------------------

const getLanguage = () => localStorage.getItem('language') || 'zh-CN'

const safeSessionSet = (key, value) => {
  try {
    sessionStorage.setItem(key, value)
  } catch {
    // 隐私模式下 sessionStorage 可能不可写，忽略
  }
}

const getRawCurrentPath = () => {
  try {
    return stripAppBase(window.location.pathname)
  } catch {
    return ''
  }
}

/** 当前页面路径；无业务上下文的页面返回空串 */
const getCurrentRoutePath = () => {
  const current = getRawCurrentPath()
  if (!current.startsWith('/') || SKIP_TRACK_PATHS.has(current)) return ''
  return current
}

/** 登出后可回跳的路径；登录页/错误页等不作为回跳目标 */
const getRedirectPathAfterLogout = () => {
  const current = getRawCurrentPath()
  if (!current.startsWith('/') || current.startsWith('/login') || SKIP_REDIRECT_PATHS.has(current)) return ''
  return current
}

const showToast = (message, type = 'error') => {
  ElMessage({ type, message, duration: 3000, plain: true, showClose: true })
}

/**
 * 按「文案」节流的 toast：
 * 同一条错误在 TOAST_THROTTLE_MS 内只弹一次（例如一个页面并发三个接口全部 404，只提示一次），
 * 但不同错误互不遮蔽（旧实现是全局单一时间戳，会导致后发生的其它错误被静默吞掉）。
 */
const showThrottledToast = (message, type = 'error') => {
  const now = Date.now()
  const last = recentToasts.get(message)
  if (last !== undefined && now - last <= TOAST_THROTTLE_MS) return

  // 顺带清理过期记录，避免 Map 随运行时间无限增长
  for (const [key, ts] of recentToasts) {
    if (now - ts > TOAST_THROTTLE_MS) recentToasts.delete(key)
  }

  recentToasts.set(message, now)
  showToast(message, type)
}

const isTimeoutError = (error) => {
  if (!error) return false
  if (error.code === 'ECONNABORTED' || error.code === 'TIMEOUT') return true
  const msg = typeof error.message === 'string' ? error.message.toLowerCase() : ''
  return msg.includes('timeout')
}

/**
 * 请求体序列化（用于生成去重 key）。
 * 注意：URLSearchParams / FormData 经 JSON.stringify 一律得到 "{}"，
 * 会让「同一接口 + 不同参数」的并发请求算成重复请求而被误取消，必须单独处理。
 */
const serializeBody = (body) => {
  if (body == null) return ''
  if (typeof body === 'string') return body
  if (body instanceof URLSearchParams) return body.toString()
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    return Array.from(body.entries())
      .map(([key, value]) => (
        typeof File !== 'undefined' && value instanceof File
          ? `${key}:${value.name}:${value.size}:${value.lastModified}`
          : `${key}:${value}`
      ))
      .join('&')
  }
  if (typeof Blob !== 'undefined' && body instanceof Blob) return `blob:${body.size}:${body.type}`
  try {
    return JSON.stringify(body) ?? ''
  } catch {
    return ''
  }
}

const generateRequestKey = ({ method, url, params, data }) =>
  `${method}:${url}:${serializeBody(params)}:${serializeBody(data)}`

// ---------------------------------------------------------------------------
// 统一响应形态
// ---------------------------------------------------------------------------

/** 错误已在拦截层提示/接管，页面无需再提示 */
const createHandledResponse = ({ success, handled = false }) => ({
  code: 200,
  data: null,
  totalCount: 0,
  message: '',
  success,
  ...(handled ? { __handled: true } : {})
})

/** 认证/授权失败，且调用方要求自行处理（silentXxx = false） */
const createAuthFailureResponse = (code, message) => ({
  code,
  data: null,
  message,
  success: false,
  __isHttpError: true
})

export const isHandled = (res) => res?.__handled === true

/**
 * 区分「HTTP 状态码错误」（如 500/502/400/404 等，请求本身失败）
 * 与「HTTP 200 内返回的业务 resultful code 失败」（请求成功，业务逻辑判定失败）。
 * 前者页面展示时应使用 error 提示，后者沿用 warning。
 */
export const isHttpError = (res) => res?.__isHttpError === true

/**
 * 从错误响应体中提取展示给用户的文案：
 * 1. 自定义业务错误体的 message 字段
 * 2. ASP.NET Core 模型校验失败的 ProblemDetails 格式（errors 里第一条校验消息，其次 title）
 * 3. 都没有则用 fallback 兜底
 */
const extractHttpErrorMessage = (responseData, fallback) => {
  if (responseData && typeof responseData === 'object') {
    if (responseData.message) return responseData.message

    const errors = responseData.errors
    if (errors && typeof errors === 'object') {
      const firstFieldErrors = Object.values(errors)[0]
      const firstMessage = Array.isArray(firstFieldErrors) ? firstFieldErrors[0] : firstFieldErrors
      if (firstMessage) return firstMessage
    }

    if (responseData.title) return responseData.title
  }

  return fallback
}

// ---------------------------------------------------------------------------
// 各状态码的处理策略
// ---------------------------------------------------------------------------

/** replace + reload，避免跳转后 Pinia 内存态残留 */
const hardRedirectToLogin = (redirectPath = '') => {
  const redirectQuery = redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ''
  window.location.replace(buildAppUrl(`login${redirectQuery}`))
  setTimeout(() => {
    try {
      window.location.reload()
    } catch {
      // ignore
    }
  }, 0)
}

const handleLogout = ({ redirect = true } = {}) => {
  clearClientSession({ keepLanguage: true })
  pendingRequests.clear()
  if (redirect) hardRedirectToLogin(getRedirectPathAfterLogout())
}

/** 401：会话失效。清理本地态并硬跳转登录页（整页刷新，杜绝残留状态） */
const handleUnauthorized = (options = {}) => {
  const { silentAuthError = true, disableAutoLogout = false } = options
  const unauthorizedMessage = t('systembasicmgmt.errorHandler.unauthorized')

  // 并发请求同时 401 时只处理一次，避免重复跳转/重复提示
  if (!has401ErrorOccurred) {
    has401ErrorOccurred = true
    if (disableAutoLogout) {
      // 不跳转，只能在当前页面立即提示
      showToast(unauthorizedMessage, 'warning')
    } else {
      // 即将硬跳转刷新到登录页，改由登录页 onMounted 统一弹出，避免跳转前后重复提示
      safeSessionSet(AUTH_EXPIRED_MESSAGE_KEY, unauthorizedMessage)
    }
    handleLogout({ redirect: !disableAutoLogout })
  }

  return silentAuthError === false
    ? createAuthFailureResponse(401, unauthorizedMessage)
    : createHandledResponse({ success: true })
}

/** 403：已登录但无权限。硬跳转 403 页，并记录来源路径供标签栏清理 */
const handleForbidden = (error = null, options = {}) => {
  const { silentForbiddenError = true } = options
  const forbiddenMessage = error?.response?.data?.message || t('systembasicmgmt.errorHandler.forbidden')

  if (silentForbiddenError === false) {
    return createAuthFailureResponse(403, forbiddenMessage)
  }

  const currentPath = getCurrentRoutePath()
  if (currentPath) safeSessionSet(FORBIDDEN_SOURCE_PATH_KEY, currentPath)
  // 即将硬跳转到 403 页面，这里弹的 toast 会被跳转打断，改由 403 页面 onMounted 统一弹出
  safeSessionSet(FORBIDDEN_MESSAGE_KEY, forbiddenMessage)

  window.location.replace(buildAppUrl('403'))

  return createHandledResponse({ success: true })
}

/**
 * 404：请求的接口地址在后端不存在（后端未实现，或前端 API 常量写错）。
 * 这属于开发期缺陷，而非「页面不存在」，因此只在控制台输出定位信息 + toast 提示，
 * 不跳转 /404 页面 —— 页面级 404 由 vue-router 的通配符路由负责。
 */
const logApiNotFound = (error, responseData) => {
  const { baseURL = '', url = '', method, data, params } = error?.config || {}
  const separator = baseURL && !baseURL.endsWith('/') && url && !url.startsWith('/') ? '/' : ''
  // eslint-disable-next-line no-console -- 定位后端缺失接口的开发期日志，生产构建由 dropConsole 剥离
  console.error(
    `[API 404] 接口地址不存在: ${String(method || 'post').toUpperCase()} ${baseURL}${separator}${url}`,
    {
      页面路由: getCurrentRoutePath(),
      请求参数: data ?? params,
      响应内容: responseData
    }
  )
}

/**
 * 有响应但状态码非 2xx 时的统一处理。
 * 401/403 会接管导航，其余仅提示并返回 handled 失败响应。
 */
const handleHttpErrorStatus = (error, options) => {
  const { status, data: responseData } = error.response

  // 会话/权限类：接管导航，页面拿不到也不需要处理
  if (status === 401) return handleUnauthorized(options)
  if (status === 403) return handleForbidden(error, options)

  // 网关超时类：与客户端超时使用同一套文案，避免用户看到无意义的「HTTP错误 504」
  if (status === 408 || status === 504) {
    showThrottledToast(t('systembasicmgmt.errorHandler.timeout'), 'error')
    return createHandledResponse({ success: false, handled: true })
  }

  // 接口地址不存在：控制台留痕，便于对照 Swagger 排查
  if (status === 404) logApiNotFound(error, responseData)

  const isServerFault = status >= 500
  const fallback = isServerFault
    ? t('systembasicmgmt.errorHandler.serverError')
    : t('systembasicmgmt.errorHandler.httpError', { status })

  // 4xx 是请求方问题（参数/校验/权限/频率），warning 即可；5xx 是服务端故障，用 error
  showThrottledToast(extractHttpErrorMessage(responseData, fallback), isServerFault ? 'error' : 'warning')

  return createHandledResponse({ success: false, handled: true })
}

// ---------------------------------------------------------------------------
// 拦截器
// ---------------------------------------------------------------------------

service.interceptors.request.use(
  (config) => {
    config.headers['Accept-Language'] = getLanguage()

    const source = axios.CancelToken.source()
    config.cancelToken = source.token

    // 文件下载等不参与去重，避免用户连点被取消后抛出 Cancel 错误
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
    // 文件下载需要完整响应（要读 Content-Disposition 等 header），其余场景直接解包 data
    return response.config?.rawResponse === true ? response : response.data
  },
  (error) => {
    // 被取消的请求：map 里的条目已被那个「更新的请求」占用，此处不能删，否则会误清新请求
    if (axios.isCancel(error)) return Promise.reject(error)
    const requestKey = error.config?.requestKey
    if (requestKey) pendingRequests.delete(requestKey)
    return Promise.reject(error)
  }
)

// ---------------------------------------------------------------------------
// 对外 API
// ---------------------------------------------------------------------------

/**
 * 统一 POST。错误一律在内部消化为「handled 失败响应」，页面用 isHandled(res) 判断后直接 return。
 * 唯一会 reject 的情况是请求被去重取消。
 *
 * @param {object} [options.silentAuthError=true]     401 时是否返回成功占位（false 则返回 __isHttpError 响应）
 * @param {object} [options.silentForbiddenError=true] 403 时是否跳转 403 页（false 则返回 __isHttpError 响应）
 * @param {object} [options.disableAutoLogout=false]  401 时不跳转登录页，仅在当前页提示
 * @param {object} [options.allowLoginBusinessCodes=false] 跳过业务 code 401/403 的拦截（登录流程专用）
 * @param {object} [options.skipDedupe=false]         跳过并发去重
 */
export const post = async (url, data, options = {}) => {
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

    // HTTP 200 但业务 code 表示会话/权限失效，与真实 401/403 同等对待
    if (!allowLoginBusinessCodes) {
      if (response?.code === 401) return handleUnauthorized(options)
      if (response?.code === 403) return handleForbidden(null, options)
    }

    return response
  } catch (error) {
    // 去重取消：交由调用方忽略，不提示
    if (axios.isCancel(error)) return Promise.reject(error)

    // 客户端超时（未收到响应）
    if (isTimeoutError(error)) {
      showThrottledToast(t('systembasicmgmt.errorHandler.timeout'), 'error')
      return createHandledResponse({ success: false, handled: true })
    }

    // 有响应：按状态码分流
    if (error?.response) return handleHttpErrorStatus(error, options)

    // 无响应：真正的断网等网络故障
    showThrottledToast(t('systembasicmgmt.errorHandler.networkError'), 'error')
    return createHandledResponse({ success: false, handled: true })
  }
}

/**
 * 文件下载专用：返回完整 axios 响应（可读取 headers，如 Content-Disposition 里的文件名）。
 * 与 post() 不同，这里不吞错误 —— 任何失败都 reject，由调用方自行 catch 并提示。
 */
export const postBlob = (url, data, options = {}) =>
  service({
    url,
    method: 'post',
    data,
    responseType: 'blob',
    rawResponse: true,
    skipDedupe: true,
    ...options
  })

/** 登录成功后重置，使下一轮会话能重新触发 401 处理与错误提示 */
export const resetAuthErrorState = () => {
  has401ErrorOccurred = false
  recentToasts.clear()
}

export default service
