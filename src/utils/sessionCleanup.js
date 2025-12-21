import { clearAuthStorage } from '@/utils/authStorage'

/**
 * 企业标准：退出/会话失效时清理“前端本地态”，但不无脑 localStorage.clear()
 * - Cookie(HttpOnly) 由后端控制，前端无法删除
 * - 这里只清理与登录/菜单/标签相关的本地缓存，避免误伤语言等全局偏好设置
 */
export const clearClientSession = (options = {}) => {
  const { keepLanguage = true } = options

  // 备份语言
  const language = keepLanguage ? localStorage.getItem('language') : null

  // 清理认证与用户态
  clearAuthStorage()

  // 清理业务持久化（Pinia persist / tabs）
  try {
    localStorage.removeItem('tabs-store')
    localStorage.removeItem('pmenu-store')
  } catch (e) {
    // ignore
    void e
  }

  // 恢复语言
  if (keepLanguage && language) {
    try {
      localStorage.setItem('language', language)
    } catch (e) {
      // ignore
      void e
    }
  }
}


