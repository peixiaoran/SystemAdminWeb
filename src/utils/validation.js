/**
 * 输入验证工具
 * 提供安全的输入验证和数据清理功能
 */

// 常用的正则表达式
export const REGEX_PATTERNS = {
  // 邮箱验证
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // 手机号验证（中国大陆）
  MOBILE: /^1[3-9]\d{9}$/,
  // 身份证验证（中国大陆）
  ID_CARD: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  // 用户名验证（字母、数字、下划线，3-20位）
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  // 密码验证（至少8位，包含字母和数字）
  PASSWORD: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  // 数字验证
  NUMBER: /^\d+$/,
  // 小数验证
  DECIMAL: /^\d+(\.\d+)?$/,
  // 中文验证
  CHINESE: /^[\u4e00-\u9fa5]+$/,
  // URL验证
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  // IP地址验证
  IP: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  // 邮政编码验证
  POSTAL_CODE: /^[1-9]\d{5}$/,
  // 安全的文件名验证
  SAFE_FILENAME: /^[a-zA-Z0-9._-]+$/
}

// 验证函数集合
export const validators = {
  /**
   * 验证是否为空
   * @param {any} value - 要验证的值
   * @returns {boolean} 是否为空
   */
  isEmpty(value) {
    return value === null || value === undefined || value === '' || 
           (Array.isArray(value) && value.length === 0) ||
           (typeof value === 'object' && Object.keys(value).length === 0)
  },

  /**
   * 验证是否为有效邮箱
   * @param {string} email - 邮箱地址
   * @returns {boolean} 是否有效
   */
  isEmail(email) {
    return typeof email === 'string' && REGEX_PATTERNS.EMAIL.test(email)
  },

  /**
   * 验证是否为有效手机号
   * @param {string} mobile - 手机号
   * @returns {boolean} 是否有效
   */
  isMobile(mobile) {
    return typeof mobile === 'string' && REGEX_PATTERNS.MOBILE.test(mobile)
  },

  /**
   * 验证是否为有效身份证号
   * @param {string} idCard - 身份证号
   * @returns {boolean} 是否有效
   */
  isIdCard(idCard) {
    if (typeof idCard !== 'string' || !REGEX_PATTERNS.ID_CARD.test(idCard)) {
      return false
    }
    
    // 验证校验位
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    
    let sum = 0
    for (let i = 0; i < 17; i++) {
      sum += parseInt(idCard[i]) * weights[i]
    }
    
    const checkCode = checkCodes[sum % 11]
    return idCard[17].toUpperCase() === checkCode
  },

  /**
   * 验证用户名
   * @param {string} username - 用户名
   * @returns {boolean} 是否有效
   */
  isUsername(username) {
    return typeof username === 'string' && REGEX_PATTERNS.USERNAME.test(username)
  },

  /**
   * 验证密码强度
   * @param {string} password - 密码
   * @returns {boolean} 是否有效
   */
  isPassword(password) {
    return typeof password === 'string' && REGEX_PATTERNS.PASSWORD.test(password)
  },

  /**
   * 验证是否为数字
   * @param {any} value - 要验证的值
   * @returns {boolean} 是否为数字
   */
  isNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value)
  },

  /**
   * 验证是否为正整数
   * @param {any} value - 要验证的值
   * @returns {boolean} 是否为正整数
   */
  isPositiveInteger(value) {
    return Number.isInteger(value) && value > 0
  },

  /**
   * 验证字符串长度
   * @param {string} str - 字符串
   * @param {number} min - 最小长度
   * @param {number} max - 最大长度
   * @returns {boolean} 是否符合长度要求
   */
  isLength(str, min = 0, max = Infinity) {
    if (typeof str !== 'string') return false
    return str.length >= min && str.length <= max
  },

  /**
   * 验证是否为有效URL
   * @param {string} url - URL地址
   * @returns {boolean} 是否有效
   */
  isURL(url) {
    return typeof url === 'string' && REGEX_PATTERNS.URL.test(url)
  },

  /**
   * 验证是否为有效IP地址
   * @param {string} ip - IP地址
   * @returns {boolean} 是否有效
   */
  isIP(ip) {
    return typeof ip === 'string' && REGEX_PATTERNS.IP.test(ip)
  },

  /**
   * 验证是否包含危险字符
   * @param {string} str - 要验证的字符串
   * @returns {boolean} 是否包含危险字符
   */
  hasDangerousChars(str) {
    if (typeof str !== 'string') return false
    
    const dangerousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /onload=/gi,
      /onerror=/gi,
      /onclick=/gi,
      /onmouseover=/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>.*?<\/embed>/gi
    ]
    
    return dangerousPatterns.some(pattern => pattern.test(str))
  },

  /**
   * 验证文件名是否安全
   * @param {string} filename - 文件名
   * @returns {boolean} 是否安全
   */
  isSafeFilename(filename) {
    if (typeof filename !== 'string') return false
    
    // 检查危险的文件名
    const dangerousNames = [
      'con', 'prn', 'aux', 'nul',
      'com1', 'com2', 'com3', 'com4', 'com5', 'com6', 'com7', 'com8', 'com9',
      'lpt1', 'lpt2', 'lpt3', 'lpt4', 'lpt5', 'lpt6', 'lpt7', 'lpt8', 'lpt9'
    ]
    
    const nameWithoutExt = filename.toLowerCase().split('.')[0]
    if (dangerousNames.includes(nameWithoutExt)) return false
    
    // 检查文件名格式
    return REGEX_PATTERNS.SAFE_FILENAME.test(filename)
  }
}

// 数据清理函数
export const sanitizers = {
  /**
   * 清理HTML标签
   * @param {string} str - 要清理的字符串
   * @returns {string} 清理后的字符串
   */
  stripHtml(str) {
    if (typeof str !== 'string') return ''
    return str.replace(/<[^>]*>/g, '')
  },

  /**
   * 转义HTML特殊字符
   * @param {string} str - 要转义的字符串
   * @returns {string} 转义后的字符串
   */
  escapeHtml(str) {
    if (typeof str !== 'string') return ''
    
    const htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
    
    return str.replace(/[&<>"'/]/g, (match) => htmlEscapes[match])
  },

  /**
   * 清理SQL注入字符
   * @param {string} str - 要清理的字符串
   * @returns {string} 清理后的字符串
   */
  sanitizeSql(str) {
    if (typeof str !== 'string') return ''
    
    // 移除或转义危险的SQL字符
    return str.replace(/['";\\]/g, '')
  },

  /**
   * 清理文件路径
   * @param {string} path - 文件路径
   * @returns {string} 清理后的路径
   */
  sanitizePath(path) {
    if (typeof path !== 'string') return ''
    
    // 移除路径遍历字符
    return path.replace(/\.\./g, '').replace(/[\\\/]/g, '')
  },

  /**
   * 清理用户输入
   * @param {string} input - 用户输入
   * @param {Object} options - 清理选项
   * @returns {string} 清理后的输入
   */
  sanitizeInput(input, options = {}) {
    if (typeof input !== 'string') return ''
    
    const {
      stripHtml = true,
      escapeHtml = false,
      maxLength = 1000,
      allowedChars = null
    } = options
    
    let result = input
    
    // 限制长度
    if (maxLength && result.length > maxLength) {
      result = result.substring(0, maxLength)
    }
    
    // 清理HTML
    if (stripHtml) {
      result = this.stripHtml(result)
    }
    
    // 转义HTML
    if (escapeHtml) {
      result = this.escapeHtml(result)
    }
    
    // 只允许特定字符
    if (allowedChars) {
      const regex = new RegExp(`[^${allowedChars}]`, 'g')
      result = result.replace(regex, '')
    }
    
    return result.trim()
  }
}

// 表单验证规则生成器
export const createValidationRules = {
  /**
   * 必填规则
   * @param {string} message - 错误消息
   * @returns {Object} 验证规则
   */
  required(message = '此字段为必填项') {
    return {
      required: true,
      message,
      trigger: 'blur'
    }
  },

  /**
   * 邮箱验证规则
   * @param {string} message - 错误消息
   * @returns {Object} 验证规则
   */
  email(message = '请输入有效的邮箱地址') {
    return {
      validator: (rule, value, callback) => {
        if (!value || validators.isEmail(value)) {
          callback()
        } else {
          callback(new Error(message))
        }
      },
      trigger: 'blur'
    }
  },

  /**
   * 手机号验证规则
   * @param {string} message - 错误消息
   * @returns {Object} 验证规则
   */
  mobile(message = '请输入有效的手机号') {
    return {
      validator: (rule, value, callback) => {
        if (!value || validators.isMobile(value)) {
          callback()
        } else {
          callback(new Error(message))
        }
      },
      trigger: 'blur'
    }
  },

  /**
   * 长度验证规则
   * @param {number} min - 最小长度
   * @param {number} max - 最大长度
   * @param {string} message - 错误消息
   * @returns {Object} 验证规则
   */
  length(min, max, message) {
    if (!message) {
      message = `长度必须在 ${min} 到 ${max} 个字符之间`
    }
    
    return {
      validator: (rule, value, callback) => {
        if (!value || validators.isLength(value, min, max)) {
          callback()
        } else {
          callback(new Error(message))
        }
      },
      trigger: 'blur'
    }
  },

  /**
   * 自定义验证规则
   * @param {Function} validator - 验证函数
   * @param {string} message - 错误消息
   * @returns {Object} 验证规则
   */
  custom(validator, message = '验证失败') {
    return {
      validator: (rule, value, callback) => {
        if (validator(value)) {
          callback()
        } else {
          callback(new Error(message))
        }
      },
      trigger: 'blur'
    }
  }
}

// 安全检查工具
export const securityCheck = {
  /**
   * 检查输入是否安全
   * @param {string} input - 输入内容
   * @returns {Object} 检查结果
   */
  checkInput(input) {
    const issues = []
    
    if (validators.hasDangerousChars(input)) {
      issues.push('包含危险字符')
    }
    
    if (input && input.length > 10000) {
      issues.push('输入过长')
    }
    
    return {
      safe: issues.length === 0,
      issues
    }
  },

  /**
   * 检查文件是否安全
   * @param {File} file - 文件对象
   * @returns {Object} 检查结果
   */
  checkFile(file) {
    const issues = []
    
    if (!validators.isSafeFilename(file.name)) {
      issues.push('文件名不安全')
    }
    
    // 检查文件大小（10MB限制）
    if (file.size > 10 * 1024 * 1024) {
      issues.push('文件过大')
    }
    
    // 检查文件类型
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/json',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      issues.push('文件类型不允许')
    }
    
    return {
      safe: issues.length === 0,
      issues
    }
  }
}

// 默认导出
export default {
  REGEX_PATTERNS,
  validators,
  sanitizers,
  createValidationRules,
  securityCheck
} 