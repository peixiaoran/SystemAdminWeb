import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { post } from '@/utils/request'
import { LOGOUT_API, ME_API } from '@/config/api/login/api'
import { clearAuthStorage } from '@/utils/authStorage'
import i18n from '@/i18n'

// /me 探活：做简单缓存，避免每次路由跳转都打一次
let meInFlightPromise = null
let lastMeAt = 0
const ME_TTL_MS = 30 * 1000

// 员工信息存储
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
    // 是否已登录
    // Cookie(HttpOnly) 模式下前端无法读取 token；以用户标识是否存在作为“已登录”的前端态
    isLoggedIn: (state) => !!(state.loginNo || state.userId),
    
    // 根据当前语言获取用户名
    getDisplayName: (state) => {
      // 使用 i18n 的响应式 locale，避免切换语言必须 reload 才更新显示
      const currentLanguage = i18n?.global?.locale?.value || localStorage.getItem('language') || 'zh-CN'
      if (currentLanguage === 'zh-CN') {
        return state.userNameCn || state.loginNo || '管理员'
      } else {
        return state.userNameEn || state.userNameCn || state.loginNo || 'Admin'
      }
    }
  },
  
  actions: {
    // 设置员工信息
    setUserInfo(userInfo) {
      if (!userInfo) return
      
      this.userId = userInfo.userId
      this.userNameCn = userInfo.userNameCn
      this.userNameEn = userInfo.userNameEn
      this.loginNo = userInfo.loginNo
      this.avatar = userInfo.avatar
      
      // 保存用户信息到localStorage
      localStorage.setItem('userNameCn', userInfo.userNameCn)
      localStorage.setItem('userNameEn', userInfo.userNameEn)
      localStorage.setItem('loginNo', userInfo.loginNo)
      localStorage.setItem('userId', userInfo.userId)
    },
    
    // 设置角色和权限
    setRolesAndPermissions(roles, permissions) {
      this.roles = roles || []
      this.permissions = permissions || []
    },
    
    /**
     * 会话探活：请求 /me 同步 Cookie 会话与前端本地态
     * - success: true  => 更新 store/localStorage
     * - success: false => 清理 store/localStorage（Cookie 由后端控制，前端不可删）
     */
    async probeSession(options = {}) {
      const { force = false } = options
      const now = Date.now()

      // 若未配置探活接口且未使用默认值（兜底保护），直接不探活，避免请求落到 baseURL 根路径
      if (!ME_API?.ME) {
        return this.isLoggedIn
      }

      // 命中缓存（仅在本地已是登录态时生效）
      if (!force && this.isLoggedIn && now - lastMeAt < ME_TTL_MS) {
        return true
      }

      // 合并并发请求
      if (!force && meInFlightPromise) {
        return meInFlightPromise
      }

      meInFlightPromise = (async () => {
        try {
          // 关键：关闭 request.js 的 401 自动跳转，把控制权交给路由守卫/调用方
          const res = await post(ME_API.ME, {}, { silentAuthError: false, disableAutoLogout: true })

          // 约定：code===200 且 data 有用户标识 => 会话有效
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

            // 可选：角色/权限
            if (Array.isArray(data?.roles) || Array.isArray(data?.permissions)) {
              this.setRolesAndPermissions(data?.roles || [], data?.permissions || [])
            }

            lastMeAt = Date.now()
            return true
          }

          // 会话无效：清理前端态
          clearAuthStorage()
          this.resetState()
          return false
        } catch (e) {
          // 网络异常/超时：不强制登出，交给后续请求与 401 处理；这里保守返回当前前端态
          return this.isLoggedIn
        } finally {
          meInFlightPromise = null
        }
      })()

      return meInFlightPromise
    },

    // 登出
    async logout() {
      try {
        // 调用退出登录API
        const response = await post(LOGOUT_API.USER_LOGOUT)
        
        // 检查返回结果
        if (response && response.code === 200) {
          // 清除本地存储
          clearAuthStorage()
          
          // 重置状态
          this.userId = ''
          this.userNameCn = ''
          this.userNameEn = ''
          this.loginNo = ''
          this.avatar = ''
          this.roles = []
          this.permissions = []
          
          return { success: true, data: response.data, message: response.message }
        } else {
          // 如果返回码不是200，显示错误信息
          const errorMsg = response?.message || '登出失败，请重试'
          ElMessage.error(errorMsg)
          return { success: false, message: errorMsg }
        }
      } catch (error) {
        console.error('Logout error:', error)
        ElMessage.error('登出失败，请重试')
        return { success: false, message: '登出失败，请重试' }
      } finally {
        // 确保状态被重置，即使出错也执行
        this.resetState()
      }
    },
    
    // 重置状态
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
  
  // 启用持久化 - 使用3.x版本API
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['userNameCn', 'userNameEn', 'loginNo', 'userId', 'avatar', 'roles', 'permissions']
  }
})