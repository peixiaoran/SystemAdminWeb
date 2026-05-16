import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { post } from '@/utils/request'
import { LOGOUT_API, ME_API } from '@/config/api/login/api'
import { clearAuthStorage } from '@/utils/sessionCleanup'
import i18n from '@/i18n'

// /me 探活缓存：30s TTL + 并发合并
let meInFlightPromise = null
let lastMeAt = 0
const ME_TTL_MS = 30 * 1000

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: '',
    userNameCn: '',
    userNameEn: '',
    loginNo: '',
    avatar: '',
    roles: [],
    permissions: []
  }),

  getters: {
    // Cookie(HttpOnly) 模式：以本地用户标识是否存在作为前端登录态
    isLoggedIn: (state) => !!(state.loginNo || state.userId),

    getDisplayName: (state) => {
      const lang = i18n?.global?.locale?.value || localStorage.getItem('language') || 'zh-CN'
      return lang === 'zh-CN'
        ? (state.userNameCn || state.loginNo || '管理员')
        : (state.userNameEn || state.userNameCn || state.loginNo || 'Admin')
    }
  },

  actions: {
    setUserInfo(userInfo) {
      if (!userInfo) return
      this.userId = userInfo.userId
      this.userNameCn = userInfo.userNameCn
      this.userNameEn = userInfo.userNameEn
      this.loginNo = userInfo.loginNo
      this.avatar = userInfo.avatar
      // 注意：不需要手动 localStorage.setItem，persist 插件已负责持久化
    },

    setRolesAndPermissions(roles, permissions) {
      this.roles = roles || []
      this.permissions = permissions || []
    },

    /**
     * 会话探活：调用 /me 校验 Cookie 会话并同步前端状态
     * - 已登录且在 TTL 内：直接命中缓存
     * - 并发调用：合并为同一个请求
     * - 网络异常：保守返回当前前端态，不强制登出
     */
    async probeSession(options = {}) {
      const { force = false } = options
      const now = Date.now()

      if (!ME_API?.ME) return this.isLoggedIn
      if (!force && this.isLoggedIn && now - lastMeAt < ME_TTL_MS) return true
      if (!force && meInFlightPromise) return meInFlightPromise

      meInFlightPromise = (async () => {
        try {
          const res = await post(ME_API.ME, {}, { silentAuthError: false, disableAutoLogout: true })
          const data = res?.data
          const userId = data?.userId || data?.id || ''
          const loginNo = data?.loginNo || data?.userNo || ''

          if (res?.code === 200 && (userId || loginNo)) {
            this.setUserInfo({
              userId,
              loginNo,
              userNameCn: data?.userNameCn || data?.userName || '',
              userNameEn: data?.userNameEn || '',
              avatar: data?.avatar || data?.avatarAddress || ''
            })
            if (Array.isArray(data?.roles) || Array.isArray(data?.permissions)) {
              this.setRolesAndPermissions(data?.roles || [], data?.permissions || [])
            }
            lastMeAt = Date.now()
            return true
          }

          clearAuthStorage()
          this.resetState()
          return false
        } catch {
          return this.isLoggedIn
        } finally {
          meInFlightPromise = null
        }
      })()

      return meInFlightPromise
    },

    async logout() {
      try {
        const response = await post(LOGOUT_API.USER_LOGOUT)
        if (response?.code === 200) {
          clearAuthStorage()
          return { success: true, data: response.data, message: response.message }
        }
        const errorMsg = response?.message || '登出失败，请重试'
        ElMessage.error(errorMsg)
        return { success: false, message: errorMsg }
      } catch {
        ElMessage.error('登出失败，请重试')
        return { success: false, message: '登出失败，请重试' }
      } finally {
        this.resetState()
      }
    },

    resetState() {
      this.userId = ''
      this.userNameCn = ''
      this.userNameEn = ''
      this.loginNo = ''
      this.avatar = ''
      this.roles = []
      this.permissions = []
    }
  },

  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['userNameCn', 'userNameEn', 'loginNo', 'userId', 'avatar', 'roles', 'permissions']
  }
})
