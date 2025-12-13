/**
 * 认证/会话相关本地存储清理
 * 说明：Cookie(HttpOnly) 无法由前端删除，这里仅清理前端本地状态缓存
 */

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

export const clearAuthStorage = () => {
  AUTH_STORAGE_KEYS.forEach((k) => {
    try {
      localStorage.removeItem(k)
    } catch (e) {
      // ignore
      void e
    }
  })
}


