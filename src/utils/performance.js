const DEFAULT_DEBOUNCE_DELAY = 300

/**
 * 防抖函数：附带 cancel / flush / pending 控制方法
 * @param {Function} func - 需要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait = DEFAULT_DEBOUNCE_DELAY, immediate = false) {
  let timer = null
  let lastArgs = null
  let lastThis = null
  let lastResult

  const clear = () => {
    if (timer) clearTimeout(timer)
    timer = null
  }

  const invokeLater = () => {
    const ctx = lastThis
    const args = lastArgs
    lastArgs = lastThis = null
    timer = null
    if (!immediate) lastResult = func.apply(ctx, args)
  }

  function debounced(...args) {
    lastArgs = args
    lastThis = this

    const callNow = immediate && !timer
    clear()
    timer = setTimeout(invokeLater, wait)

    if (callNow) {
      const ctx = lastThis
      const a = lastArgs
      lastArgs = lastThis = null
      lastResult = func.apply(ctx, a)
    }

    return lastResult
  }

  debounced.cancel = () => {
    clear()
    lastArgs = lastThis = null
  }

  debounced.flush = () => {
    if (!timer) return undefined
    clear()
    const ctx = lastThis
    const args = lastArgs
    lastArgs = lastThis = null
    lastResult = func.apply(ctx, args)
    return lastResult
  }

  debounced.pending = () => !!timer

  return debounced
}

export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: DEFAULT_DEBOUNCE_DELAY
}
