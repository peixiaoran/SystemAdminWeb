import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { post } from '@/utils/request'
import { LOGOUT_API, ME_API } from '@/config/api/login/api'
import { clearAuthStorage } from '@/utils/sessionCleanup'
import i18n from '@/i18n'

let meInFlightPromise = null
let lastMeAt = 0
const ME_TTL_MS = 30 * 1000
const LOGOUT_FAILED_MSG = '登出失败，请重试'

const getResultCode = (response) => Number(response?.code ?? response?.Code)

const isSuccessResult = (response) => getResultCode(response) === 200

/** 登出 Result 406：JWT/会话已失效 */
const isLogoutSessionExpired = (response) => getResultCode(response) === 406

const parseMeUser = (data) => {
  if (!data) return null
  const userId = data.userId || data.id || ''
  const loginNo = data.loginNo || data.userNo || ''
  if (!userId && !loginNo) return null
  return {
    userId,
    loginNo,
    userNameCn: data.userNameCn || data.userName || '',
    userNameEn: data.userNameEn || '',
    avatar: data.avatar || data.avatarAddress || '',
    roles: Array.isArray(data.roles) ? data.roles : [],
    permissions: Array.isArray(data.permissions) ? data.permissions : []
  }
}

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
    },

    setRolesAndPermissions(roles, permissions) {
      this.roles = roles || []
      this.permissions = permissions || []
    },

    async probeSession(options = {}) {
      const { force = false } = options
      const now = Date.now()

      if (!ME_API?.ME) return this.isLoggedIn
      if (!force && this.isLoggedIn && now - lastMeAt < ME_TTL_MS) return true
      if (!force && meInFlightPromise) return meInFlightPromise

      meInFlightPromise = (async () => {
        try {
          const res = await post(ME_API.ME, {}, { silentAuthError: false, disableAutoLogout: true })
          const user = parseMeUser(res?.data)

          if (isSuccessResult(res) && user) {
            this.setUserInfo(user)
            if (user.roles.length || user.permissions.length) {
              this.setRolesAndPermissions(user.roles, user.permissions)
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
        const sessionExpired = isLogoutSessionExpired(response)

        if (isSuccessResult(response) || sessionExpired) {
          clearAuthStorage()
          return {
            success: true,
            data: sessionExpired ? null : (response?.data ?? null),
            message: sessionExpired ? '' : (response?.message || '')
          }
        }

        const errorMsg = response?.message || LOGOUT_FAILED_MSG
        ElMessage.error(errorMsg)
        return { success: false, message: errorMsg }
      } catch {
        ElMessage.error(LOGOUT_FAILED_MSG)
        return { success: false, message: LOGOUT_FAILED_MSG }
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
