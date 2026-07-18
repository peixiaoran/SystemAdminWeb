/** 合并主 URL 与 hash 内的 query 参数（history 路由下参数在 search，兼容遗留 hash 外链） */
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
