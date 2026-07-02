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
 * 退出/会话失效时清理前端本地态，但不做 localStorage.clear()：
 * Cookie(HttpOnly) 由后端控制；这里只清理登录/菜单/标签相关缓存，避免误伤语言等全局偏好。
 */
export const clearClientSession = (options = {}) => {
  const { keepLanguage = true } = options
  const language = keepLanguage ? safeStorageGet('language') : null

  clearAuthStorage()
  safeStorageRemove('tabs-store')
  safeStorageRemove('pmenu-store')

  if (keepLanguage && language) {
    safeStorageSet('language', language)
  }
}
