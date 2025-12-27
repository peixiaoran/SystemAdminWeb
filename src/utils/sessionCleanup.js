export const AUTH_STORAGE_KEYS = [
  'token', // 历史遗留（Cookie 模式下不再使用）
  'user-store',
  'userNameCn',
  'userNameEn',
  'loginNo',
  'userId',
  'currentModuleId',
  'currentModuleName',
  'currentModulePath',
  'currentModuleNameCn',
  'currentModuleNameEn',
  'currentSystemPath',
  'username'
]

const safeStorageGet = (key) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const safeStorageSet = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

const safeStorageRemove = (key) => {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export const clearAuthStorage = () => {
  AUTH_STORAGE_KEYS.forEach(safeStorageRemove)
}

/**
 * 企业标准：退出/会话失效时清理“前端本地态”，但不无脑 localStorage.clear()
 * - Cookie(HttpOnly) 由后端控制，前端无法删除
 * - 这里只清理与登录/菜单/标签相关的本地缓存，避免误伤语言等全局偏好设置
 */
export const clearClientSession = (options = {}) => {
  const { keepLanguage = true } = options

  // 备份语言
  const language = keepLanguage ? safeStorageGet('language') : null

  // 清理认证与用户态
  clearAuthStorage()

  // 清理业务持久化（Pinia persist / tabs）
  safeStorageRemove('tabs-store')
  safeStorageRemove('pmenu-store')

  // 恢复语言
  if (keepLanguage && language) {
    safeStorageSet('language', language)
  }
}


