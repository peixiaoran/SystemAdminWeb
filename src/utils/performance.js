/**
 * 性能优化工具函数
 */

/**
 * 防抖函数 - 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
 * @param {Function} func 要防抖的函数
 * @param {number} wait 等待时间（毫秒）
 * @param {boolean} immediate 是否立即执行
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait = 300, immediate = false) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func.apply(this, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(this, args)
  }
}

/**
 * 节流函数 - 规定在一个单位时间内，只能触发一次函数
 * @param {Function} func 要节流的函数
 * @param {number} limit 时间间隔（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(func, limit = 300) {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 简单的内存缓存类
 */
export class MemoryCache {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) { // 默认5分钟过期
    this.cache = new Map()
    this.maxSize = maxSize
    this.ttl = ttl
  }

  set(key, value) {
    // 如果缓存已满，删除最旧的项
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    })
  }

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    // 检查是否过期
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  has(key) {
    return this.get(key) !== null
  }

  delete(key) {
    return this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }

  // 清理过期项
  cleanup() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

/**
 * 创建一个带缓存的函数
 * @param {Function} fn 要缓存的函数
 * @param {number} ttl 缓存时间（毫秒）
 * @returns {Function} 带缓存的函数
 */
export function memoize(fn, ttl = 5 * 60 * 1000) {
  const cache = new MemoryCache(50, ttl)
  
  return function memoizedFunction(...args) {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn.apply(this, args)
    cache.set(key, result)
    
    return result
  }
}

/**
 * 延迟执行函数
 * @param {number} ms 延迟时间（毫秒）
 * @returns {Promise} Promise对象
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 批量处理函数 - 将多个操作合并为一次执行
 * @param {Function} fn 要批量执行的函数
 * @param {number} wait 等待时间（毫秒）
 * @returns {Function} 批量处理后的函数
 */
export function batchProcess(fn, wait = 100) {
  let items = []
  let timeout = null

  return function(item) {
    items.push(item)
    
    if (timeout) clearTimeout(timeout)
    
    timeout = setTimeout(() => {
      fn(items)
      items = []
      timeout = null
    }, wait)
  }
}

/**
 * 检查是否为移动设备
 * @returns {boolean} 是否为移动设备
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * 获取设备像素比
 * @returns {number} 设备像素比
 */
export function getDevicePixelRatio() {
  return window.devicePixelRatio || 1
}

/**
 * 检查是否支持WebP格式
 * @returns {Promise<boolean>} 是否支持WebP
 */
export function supportsWebP() {
  return new Promise(resolve => {
    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
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
    
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.options)
  }

  observe(element) {
    this.observer.observe(element)
  }

  unobserve(element) {
    this.observer.unobserve(element)
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        const src = img.dataset.src
        
        if (src) {
          img.src = src
          img.removeAttribute('data-src')
          this.observer.unobserve(img)
        }
      }
    })
  }

  disconnect() {
    this.observer.disconnect()
  }
}

/**
 * 虚拟滚动类 - 用于大列表性能优化
 */
export class VirtualScroll {
  constructor(container, itemHeight, renderItem) {
    this.container = container
    this.itemHeight = itemHeight
    this.renderItem = renderItem
    this.data = []
    this.visibleStart = 0
    this.visibleEnd = 0
    this.scrollTop = 0
    
    this.init()
  }

  init() {
    this.container.addEventListener('scroll', this.handleScroll.bind(this))
    this.updateVisibleRange()
  }

  setData(data) {
    this.data = data
    this.updateVisibleRange()
    this.render()
  }

  handleScroll() {
    this.scrollTop = this.container.scrollTop
    this.updateVisibleRange()
    this.render()
  }

  updateVisibleRange() {
    const containerHeight = this.container.clientHeight
    const totalHeight = this.data.length * this.itemHeight
    
    this.visibleStart = Math.floor(this.scrollTop / this.itemHeight)
    this.visibleEnd = Math.min(
      this.visibleStart + Math.ceil(containerHeight / this.itemHeight) + 1,
      this.data.length
    )
  }

  render() {
    const visibleData = this.data.slice(this.visibleStart, this.visibleEnd)
    const offsetY = this.visibleStart * this.itemHeight
    
    this.container.innerHTML = `
      <div style="height: ${this.data.length * this.itemHeight}px; position: relative;">
        <div style="transform: translateY(${offsetY}px);">
          ${visibleData.map((item, index) => this.renderItem(item, this.visibleStart + index)).join('')}
        </div>
      </div>
    `
  }
}

// 全局性能监控
export const performanceMonitor = {
  // 记录性能指标
  mark(name) {
    if (performance.mark) {
      performance.mark(name)
    }
  },

  // 测量性能
  measure(name, startMark, endMark) {
    if (performance.measure) {
      performance.measure(name, startMark, endMark)
    }
  },

  // 获取性能数据
  getEntries(type) {
    if (performance.getEntriesByType) {
      return performance.getEntriesByType(type)
    }
    return []
  },

  // 清理性能数据
  clearMarks(name) {
    if (performance.clearMarks) {
      performance.clearMarks(name)
    }
  }
}

export default {
  debounce,
  throttle,
  MemoryCache,
  memoize,
  delay,
  batchProcess,
  isMobile,
  getDevicePixelRatio,
  supportsWebP,
  LazyImageObserver,
  VirtualScroll,
  performanceMonitor
} 