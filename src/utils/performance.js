/**
 * 性能优化工具集
 * 提供各种性能优化相关的工具函数
 */
import { nextTick } from 'vue'

/**
 * 防抖函数
 * @param {Function} func - 需要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait = 300, immediate = false) {
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

/**
 * 节流函数
 * @param {Function} func - 需要节流的函数
 * @param {number} limit - 限制时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(func, limit = 300) {
  let inThrottle = false
  return function throttled(...args) {
    if (inThrottle) return
    inThrottle = true
    func.apply(this, args)
    setTimeout(() => { inThrottle = false }, limit)
  }
}

/**
 * 延迟执行函数
 * @param {number} ms - 延迟时间（毫秒）
 * @returns {Promise} Promise对象
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 异步队列执行器
 * 控制并发数量，避免同时执行过多异步任务
 */
export class AsyncQueue {
  constructor(concurrency = 3) {
    this.concurrency = concurrency
    this.running = 0
    this.queue = []
  }

  /**
   * 添加任务到队列
   * @param {Function} asyncFn - 异步函数
   * @returns {Promise} Promise对象
   */
  add(asyncFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        asyncFn,
        resolve,
        reject
      })
      this.process()
    })
  }

  async process() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      this.running++
      const { asyncFn, resolve, reject } = this.queue.shift()

      ;(async () => {
        try {
          const result = await asyncFn()
          resolve(result)
        } catch (error) {
          reject(error)
        } finally {
          this.running--
          this.process()
        }
      })()
    }
  }
}

/**
 * 缓存装饰器
 * 为函数添加缓存功能
 */
export class FunctionCache {
  constructor(maxSize = 100) {
    this.cache = new Map()
    this.maxSize = maxSize
  }

  /**
   * 生成缓存键
   * @param {Array} args - 函数参数
   * @returns {string} 缓存键
   */
  generateKey(args) {
    try {
      return JSON.stringify(args)
    } catch {
      return String(args)
    }
  }

  /**
   * 包装函数添加缓存
   * @param {Function} fn - 原函数
   * @returns {Function} 带缓存的函数
   */
  wrap(fn) {
    return (...args) => {
      const key = this.generateKey(args)
      
      if (this.cache.has(key)) {
        return this.cache.get(key)
      }

      const result = fn.apply(this, args)
      
      // 如果是Promise，缓存Promise本身
      if (result && typeof result.then === 'function') {
        result.catch(() => {
          // 如果Promise失败，从缓存中移除
          this.cache.delete(key)
        })
      }

      this.set(key, result)
      return result
    }
  }

  /**
   * 设置缓存
   * @param {string} key - 缓存键
   * @param {any} value - 缓存值
   */
  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // 删除最老的缓存项
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    this.cache.set(key, value)
  }

  /**
   * 清除缓存
   */
  clear() {
    this.cache.clear()
  }
}

/**
 * 虚拟滚动辅助函数
 * 计算虚拟滚动的可见范围
 */
export function calculateVisibleRange(scrollTop, itemHeight, containerHeight, totalItems, overscan = 5) {
  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    totalItems - 1
  )
  
  return {
    start: Math.max(0, visibleStart - overscan),
    end: Math.min(totalItems - 1, visibleEnd + overscan),
    visibleStart,
    visibleEnd
  }
}

/**
 * 图片懒加载观察器
 */
export class LazyImageObserver {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    }
    this.observer = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(this.handleIntersection.bind(this), this.options)
      : null
    this.imageMap = new WeakMap()
  }

  /**
   * 观察图片元素
   * @param {HTMLElement} img - 图片元素
   * @param {string} src - 图片源地址
   */
  observe(img, src) {
    if (!this.observer) {
      if (img && src) img.src = src
      return
    }
    this.imageMap.set(img, src)
    this.observer.observe(img)
  }

  /**
   * 停止观察图片元素
   * @param {HTMLElement} img - 图片元素
   */
  unobserve(img) {
    if (!this.observer) return
    this.imageMap.delete(img)
    this.observer.unobserve(img)
  }

  /**
   * 处理交叉观察
   * @param {Array} entries - 观察条目
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        const src = this.imageMap.get(img)
        if (src) {
          img.src = src
          this.unobserve(img)
        }
      }
    })
  }

  /**
   * 销毁观察器
   */
  destroy() {
    if (!this.observer) return
    this.observer.disconnect()
    this.imageMap = new WeakMap()
  }
}

/**
 * DOM操作优化
 */
export const DOMUtils = {
  /**
   * 批量DOM操作
   * @param {Function} callback - 操作回调
   */
  batchUpdate(callback) {
    return nextTick(callback)
  },

  /**
   * 测量DOM元素尺寸
   * @param {HTMLElement} element - DOM元素
   * @returns {Object} 尺寸信息
   */
  measureElement(element) {
    const rect = element.getBoundingClientRect()
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom
    }
  },

  /**
   * 检查元素是否在视口中
   * @param {HTMLElement} element - DOM元素
   * @returns {boolean} 是否在视口中
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }
}

/**
 * 内存管理工具
 */
export const MemoryUtils = {
  /**
   * 清理对象引用
   * @param {Object} obj - 要清理的对象
   */
  cleanup(obj) {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') {
          this.cleanup(obj[key])
        }
        delete obj[key]
      })
    }
  },

  /**
   * 获取内存使用情况（如果支持）
   * @returns {Object|null} 内存使用情况
   */
  getMemoryUsage() {
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      }
    }
    return null
  }
}

// 创建全局实例
export const globalAsyncQueue = new AsyncQueue(3)
export const globalFunctionCache = new FunctionCache(50)
export const globalLazyImageObserver = new LazyImageObserver()

// 导出常用的优化配置
export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_LIMIT: 300,
  CACHE_SIZE: 100,
  ASYNC_CONCURRENCY: 3,
  VIRTUAL_SCROLL_OVERSCAN: 5
}