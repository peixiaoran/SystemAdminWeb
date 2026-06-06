const IGNORE_PATH_PREFIXES = ['/assets', '/favicon.ico', '/src']

const isStaticAssetPath = (pathname) => /\.[a-zA-Z0-9]+$/.test(pathname)

/** 合并主 URL 与 hash 内的 query 参数（hash 路由下外链参数可能落在任一侧） */
export function parseLocationQuery () {
  const params = new URLSearchParams()
  try {
    const url = new URL(window.location.href)
    url.searchParams.forEach((value, key) => params.set(key, value))

    const hash = url.hash || ''
    const qIndex = hash.indexOf('?')
    if (qIndex >= 0) {
      new URLSearchParams(hash.slice(qIndex + 1)).forEach((value, key) => {
        if (!params.has(key)) params.set(key, value)
      })
    }
  } catch {
    /* noop */
  }
  return params
}

/** 按优先级返回首个非空的 query 参数值 */
export function getLocationQueryParam (...names) {
  const params = parseLocationQuery()
  for (const name of names) {
    const value = params.get(name)
    if (value != null && value !== '') return value
  }
  return ''
}

/**
 * 将 path 风格外链（无 #）规范为 hash 路由：
 * /formbusiness/...?token=xxx -> /#/formbusiness/...?token=xxx
 * 返回是否发生了跳转。
 */
export function bootstrapHashRouteIfNeeded () {
  try {
    const { pathname, search, hash, origin } = window.location
    const bareHash = !hash || hash === '#' || hash === '#/'
    if (!bareHash || !pathname || pathname === '/') return false
    if (IGNORE_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return false
    if (isStaticAssetPath(pathname)) return false

    const target = `${origin}/#${pathname}${search || ''}`
    if (target === window.location.href) return false
    window.location.replace(target)
    return true
  } catch {
    return false
  }
}
