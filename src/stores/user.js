import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { post } from '@/utils/request'
import { LOGOUT_API } from '@/config/api/login/api'

// 员工信息存储
export const useUserStore = defineStore('user', {
  state: () => ({
    userId: '',
    userNameCh: '',
    userNameEn: '',
    loginNo: '',
    avatar: '',
    token: localStorage.getItem('token') || '',
    roles: [],
    permissions: []
  }),
  
  getters: {
    // 是否已登录
    isLoggedIn: (state) => !!state.token,
    
    // 根据当前语言获取用户名
    getDisplayName: (state) => {
      const currentLanguage = localStorage.getItem('language') || 'zh-TW'
      if (currentLanguage === 'zh-TW') {
        return state.userNameCh || state.loginNo || '管理员'
      } else {
        return state.userNameEn || state.userNameCh || state.loginNo || 'Admin'
      }
    }
  },
  
  actions: {
    // 设置员工信息
    setUserInfo(userInfo) {
      if (!userInfo) return
      
      this.userId = userInfo.userId
      this.userNameCh = userInfo.userNameCh
      this.userNameEn = userInfo.userNameEn
      this.loginNo = userInfo.loginNo
      this.avatar = userInfo.avatar
      
      // 保存用户信息到localStorage
      localStorage.setItem('userNameCh', userInfo.userNameCh)
      localStorage.setItem('userNameEn', userInfo.userNameEn)
      localStorage.setItem('loginNo', userInfo.loginNo)
    },
    
    // 设置Token
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    
    // 设置角色和权限
    setRolesAndPermissions(roles, permissions) {
      this.roles = roles || []
      this.permissions = permissions || []
    },
    
    // 登出
    async logout() {
      try {
        // 调用退出登录API
        await post(LOGOUT_API.USER_LOGOUT)
        
        // 路由现在是静态的，不需要清除路由缓存和重置路由
        
        // 清除本地存储
        localStorage.removeItem('token')
        localStorage.removeItem('userNameCh')
        localStorage.removeItem('userNameEn')
        localStorage.removeItem('loginNo')
        localStorage.removeItem('currentDomainId')
        localStorage.removeItem('currentSystemName')
        localStorage.removeItem('currentSystemPath')
        
        // 重置状态
        this.token = ''
        this.userId = ''
        this.userNameCh = ''
        this.userNameEn = ''
        this.loginNo = ''
        this.avatar = ''
        this.roles = []
        this.permissions = []
        
        return true
      } catch (error) {
        ElMessage.error('登出失败，请重试')
        return false
      } finally {
        // 确保状态被重置，即使出错也执行
        this.resetState()
      }
    },
    
    // 重置状态
    resetState() {
      this.token = ''
      this.userId = ''
      this.userNameCh = ''
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
    paths: ['token', 'userNameCh', 'userNameEn', 'loginNo', 'userId', 'avatar', 'roles', 'permissions']
  }
})