import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { post } from '@/utils/request'

// 用户信息存储
export const useUserStore = defineStore('user', {
  state: () => ({
    userId: '',
    username: localStorage.getItem('username') || '管理员',
    avatar: '',
    token: localStorage.getItem('token') || '',
    roles: [],
    permissions: []
  }),
  
  getters: {
    // 是否已登录
    isLoggedIn: (state) => !!state.token
  },
  
  actions: {
    // 设置用户信息
    setUserInfo(userInfo) {
      if (!userInfo) return
      
      this.userId = userInfo.userId
      this.username = userInfo.username
      this.avatar = userInfo.avatar
      
      // 保存用户名到localStorage
      localStorage.setItem('username', userInfo.username)
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
        // 这里可以添加登出API调用
        // const res = await post('logout')
        
        // 清除本地存储
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('currentDomainId')
        localStorage.removeItem('currentSystemName')
        localStorage.removeItem('currentSystemPath')
        
        // 重置状态
        this.token = ''
        this.userId = ''
        this.username = ''
        this.avatar = ''
        this.roles = []
        this.permissions = []
        
        return true
      } catch (error) {
        console.error('登出失败:', error)
        ElMessage.error('登出失败，请稍后重试')
        return false
      }
    }
  }
}) 