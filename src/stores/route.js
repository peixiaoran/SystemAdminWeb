import { defineStore } from 'pinia'
import { post } from '@/utils/request'
import { ROUTER_API } from '@/config/api/router/router'

// 路由信息存储
export const useRouteStore = defineStore('route', {
  state: () => ({
    routes: [], // 存储路由配置
    dynamicRoutesLoaded: false, // 是否已加载动态路由
    lastUpdated: null // 最后更新时间
  }),
  
  getters: {
    // 是否已加载路由
    hasLoadedRoutes: (state) => state.dynamicRoutesLoaded && state.routes.length > 0,
    
    // 获取所有路由
    getRoutes: (state) => state.routes
  },
  
  actions: {
    // 设置路由配置
    setRoutes(routes) {
      this.routes = routes || []
      this.dynamicRoutesLoaded = true
      this.lastUpdated = new Date().toISOString()
    },
    
    // 清除路由信息
    clearRoutes() {
      this.routes = []
      this.dynamicRoutesLoaded = false
      this.lastUpdated = null
    },
    
    // 从API获取路由配置
    async fetchRoutes() {
      try {
        const res = await post(ROUTER_API.GET_ROUTER)
        
        if (res.code !== '200') {
          return null
        }
        
        if (res && res.data) {
          // 更新路由状态
          this.setRoutes(res.data)
          return {
            success: true,
            data: res.data
          }
        } else {
          return null
        }
      } catch (error) {
        return null
      }
    }
  },
  
  // 启用持久化，这样刷新页面后仍能保持路由状态
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'route-store',
        storage: localStorage,
        paths: ['routes', 'dynamicRoutesLoaded', 'lastUpdated']
      }
    ]
  }
}) 