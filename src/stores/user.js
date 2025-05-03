import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
    roles: ['admin'], // 默认角色，实际应从登录接口获取
  }),
  
  getters: {
    isLoggedIn() {
      return !!this.token
    },
    userRoles() {
      return this.roles
    }
  },
  
  actions: {
    // 登录
    async login(credentials) {
      try {
        const { username, password } = credentials
        const result = await post(LOGIN_API.LOGIN, {
          userName: username,
          userPwd: password
        })

        if (result.code === '200' && result.data) {
          this.token = result.data.accessToken
          this.userInfo = result.data
          localStorage.setItem(TOKEN_KEY, this.token)
          localStorage.setItem(USER_INFO_KEY, JSON.stringify(this.userInfo))
          return true
        } else {
          ElMessage.error(result.message || '登录失败')
          return false
        }
      } catch (error) {
        ElMessage.error('登录服务异常')
        return false
      }
    },
    
    // 登出
    async logout() {
      this.resetState()
      
      // 使用延迟导入menuStore避免循环依赖
      const { useMenuStore } = await import('./menu')
      const menuStore = useMenuStore()
      menuStore.resetState()
      
      // 清除本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      
      // 跳转到登录页
      window.location.href = '/login'
    },
    
    // 设置令牌
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    
    // 设置用户信息
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    
    // 设置用户角色
    setRoles(roles) {
      this.roles = roles
    },
    
    // 检查用户是否有访问权限
    hasPermission(route) {
      if (!route.meta || !route.meta.roles) return true
      
      return this.roles.some(role => route.meta.roles.includes(role))
    },
    
    // 获取用户可访问的路由
    filterAccessRoutes(routes) {
      const accessRoutes = []
      
      routes.forEach(route => {
        const tmpRoute = { ...route }
        
        if (this.hasPermission(tmpRoute)) {
          if (tmpRoute.children) {
            tmpRoute.children = this.filterAccessRoutes(tmpRoute.children)
          }
          accessRoutes.push(tmpRoute)
        }
      })
      
      return accessRoutes
    },
    
    // 重置状态
    resetState() {
      this.token = ''
      this.userInfo = {}
      this.roles = []
    }
  }
}) 