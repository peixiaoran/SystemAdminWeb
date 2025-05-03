import { defineStore } from 'pinia'
import { post } from '@/utils/request'
import { MENU_API } from '@/config/api/login/api'
import { transformMenuToRoutes } from '@/utils/menuHelper'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuData: [],
    menuLoading: false,
    routes: [],
    addRoutes: [], // 动态添加的路由
    hasPermission: false,
    whiteList: ['/login', '/404', '/403', '/dashboard', '/module-select']
  }),
  
  getters: {
    menuList() {
      return this.menuData
    },
    isMenuLoading() {
      return this.menuLoading
    }
  },
  
  actions: {
    // 加载菜单数据
    async fetchMenuData() {
      try {
        this.menuLoading = true
        
        // 使用与layout/index.vue相同的接口
        const currentDomainId = '1350161679034934501'
        const params = { domainId: currentDomainId }
        
        // 始终从API获取最新的菜单数据
        const res = await post(MENU_API.GET_MENU, params)
        
        if (res.code === '200') {
          // 清空旧数据，使用新获取的数据
          this.menuData = res.data || []
          
          // 重置路由状态
          this.hasPermission = false
          this.routes = []
          this.addRoutes = []
          
          return this.menuData
        } else {
          console.error('获取菜单数据失败:', res.message)
          return []
        }
      } catch (error) {
        console.error('获取菜单数据异常:', error)
        return []
      } finally {
        this.menuLoading = false
      }
    },
    
    // 根据菜单数据生成路由
    generateRoutes(menuData, router) {
      if (!menuData || menuData.length === 0) {
        this.routes = []
        this.addRoutes = []
        return []
      }
      
      // 处理菜单数据为路由格式
      const accessRoutes = []
      
      // 处理每个一级菜单
      menuData.forEach(menu => {
        // 确保菜单有路径
        if (!menu.path) {
          console.warn('菜单缺少路径:', menu)
          return
        }
        
        // 提取path中的系统名称
        const pathParts = menu.path.split('/')
        
        // 创建系统路由
        const systemRoute = {
          path: `/dashboard/${menu.path}`,
          name: menu.menuCode,
          component: () => import('@/layout/index.vue'),
          redirect: `/dashboard/${menu.path}`,  // 添加重定向到首页
          meta: { 
            title: menu.menuName,
            icon: menu.menuIcon || 'Document',
            roles: ['admin'], // 默认角色，实际应从用户数据获取
            requiresAuth: true
          },
          children: []
        }
        
        // 添加默认首页路由
        systemRoute.children.push({
          path: '',
          name: `${menu.menuCode}Index`,
          component: () => {
            // 尝试加载对应的index.vue组件
            try {
              return import(`@/views/dashboard/${menu.path}/index.vue`)
            } catch (e) {
              // 如果找不到对应组件，返回默认组件
              return import('@/views/dashboard/index.vue')
            }
          },
          meta: {
            title: '首页',
            icon: 'HomeFilled',
            roles: ['admin'],
            requiresAuth: true
          }
        })
        
        // 处理子菜单
        if (menu.menuChildList && menu.menuChildList.length > 0) {
          menu.menuChildList.forEach(child => {
            // 确保子菜单有路径
            if (!child.path) {
              console.warn('子菜单缺少路径:', child)
              return
            }
            
            // 子菜单的路由路径
            const childPath = child.path.endsWith('.vue') ? child.path.slice(0, -4) : child.path
            
            // 添加到系统路由的子路由中
            systemRoute.children.push({
              path: childPath,
              name: child.menuCode,
              component: () => {
                // 尝试加载对应的vue组件
                try {
                  return import(`@/views/dashboard/${menu.path}/${childPath}/index.vue`)
                } catch (e) {
                  try {
                    // 尝试直接加载子菜单组件
                    return import(`@/views/dashboard/${menu.path}/${childPath}.vue`)
                  } catch (e2) {
                    // 如果都找不到，返回默认组件
                    return import('@/views/dashboard/index.vue')
                  }
                }
              },
              meta: {
                title: child.menuName,
                icon: child.menuIcon || 'Document',
                roles: ['admin'], // 默认角色
                requiresAuth: true
              }
            })
          })
        }
        
        // 添加到路由列表
        accessRoutes.push(systemRoute)
      })
      
      this.routes = accessRoutes
      this.addRoutes = accessRoutes
      
      // 动态添加路由
      if (router) {
        this.addDynamicRoutes(accessRoutes, router)
      }
      
      return accessRoutes
    },
    
    // 动态添加路由 - 接收router参数避免循环依赖
    addDynamicRoutes(routes, router) {
      if (!routes || routes.length === 0 || !router) return
      
      routes.forEach(route => {
        if (!router.hasRoute(route.name)) {
          router.addRoute(route)
        }
      })
      
      this.hasPermission = true
    },
    
    // 根据路由路径检查权限
    hasRoutePermission(path, router) {
      if (!path) return false
      
      // 不需要权限验证的路由
      if (this.whiteList.includes(path)) return true
      
      // system-admin 首页路径特殊处理
      if (path === '/dashboard/system-admin' || 
          path === '/dashboard/system-admin/' || 
          path === '/dashboard/system-admin/index') {
        if (import.meta.env.DEV) console.log('✅ 特殊处理: system-admin首页路径直接放行')
        return true
      }
      
      // 系统首页路由检查
      const systemHomePattern = /^\/dashboard\/[\w-]+$/
      if (systemHomePattern.test(path)) {
        // 提取系统名称
        const systemName = path.split('/')[2]
        return this.hasSystemPermission(systemName)
      }
      
      // 管理员默认拥有所有权限
      const userRoles = ['admin'] // 实际应从用户store获取
      
      // 验证路由是否存在于生成的路由中
      if (router) {
        // 先检查完整路径匹配
        const matchRoute = router.getRoutes().find(route => route.path === path)
        if (matchRoute) {
          // 检查角色权限
          const roles = matchRoute.meta?.roles || []
          return roles.some(role => userRoles.includes(role))
        }
        
        // 如果完整路径没有匹配，检查是否为二级菜单页面
        if (path.startsWith('/dashboard/')) {
          const pathParts = path.split('/')
          
          // 确保路径至少包含系统名称部分
          if (pathParts.length >= 3) {
            // 检查系统部分路径是否存在
            const systemPath = `/${pathParts[1]}/${pathParts[2]}`
            const systemRoute = router.getRoutes().find(route => route.path === systemPath)
            
            // 如果系统路由存在，检查用户是否有该系统的权限
            if (systemRoute && this.hasSystemPermission(pathParts[2])) {
              // 特殊处理：验证子系统页面权限 - 路径格式: /dashboard/system-xxx/subsystem-xxx/page
              if (pathParts.length >= 5) {
                // 处理子系统页面权限检查
                return this.checkSubSystemPagePermission(pathParts)
              }
              
              // 在开发模式下记录日志，便于调试
              if (import.meta.env.DEV) {
                console.log('允许访问系统页面:', path)
              }
              return true
            }
          }
        }
      }
      
      // 开发环境下日志
      if (import.meta.env.DEV) {
        console.warn('无权限访问路径:', path)
      }
      
      return false
    },
    
    // 检查子系统页面权限 - 新增方法
    checkSubSystemPagePermission(pathParts) {
      // 构建完整的子系统路径，例如: system-admin/system-mgmt
      const systemName = pathParts[2]       // 例如: system-admin
      const subSystemName = pathParts[3]    // 例如: system-mgmt
      const pageName = pathParts[4]         // 例如: program
      const fullPath = `${systemName}/${subSystemName}`
      
      if (import.meta.env.DEV) {
        console.log(`🔍 检查子系统页面权限:`, {
          系统: systemName,
          子系统: subSystemName,
          页面: pageName,
          完整路径: fullPath
        })
      }
      
      // 检查菜单数据中是否包含此页面
      if (this.menuData && this.menuData.length > 0) {
        // 查找匹配的系统菜单
        const systemMenu = this.menuData.find(menu => 
          menu.path && menu.path.toLowerCase() === fullPath
        )
        
        if (systemMenu && systemMenu.menuChildList) {
          // 查找子菜单中是否包含此页面
          const hasPagePermission = systemMenu.menuChildList.some(child => {
            // 检查path是否匹配，例如program.vue或program
            if (child.path) {
              const childPath = child.path.toLowerCase()
              return childPath === `${pageName}.vue` || childPath === pageName
            }
            return false
          })
          
          if (hasPagePermission) {
            if (import.meta.env.DEV) {
              console.log(`✅ 子系统页面权限验证通过: ${pathParts.join('/')}`)
            }
            return true
          } else {
            if (import.meta.env.DEV) {
              console.warn(`❌ 子系统页面无权限: ${pathParts.join('/')}`)
            }
            return false
          }
        }
      }
      
      // 如果找不到菜单或子系统，开发环境下允许访问
      if (import.meta.env.DEV) {
        console.warn(`⚠️ 开发环境下允许访问未找到的子系统页面: ${pathParts.join('/')}`)
        return true
      }
      
      return false
    },
    
    // 检查用户是否有访问指定系统的权限
    hasSystemPermission(systemName) {
      if (!systemName) return false
      
      // 特殊处理: system-admin 特别放行（确保首页可以访问）
      if (systemName === 'system-admin') {
        if (import.meta.env.DEV) console.log('✅ 特殊系统：system-admin 直接放行')
        return true
      }
      
      // 基础系统模块白名单，登录后即可访问
      const baseSystemWhitelist = ['system-admin', 'user-admin', 'content-admin', 'order-admin', 'data-admin', 'message-admin']
      if (baseSystemWhitelist.includes(systemName.toLowerCase())) {
        if (import.meta.env.DEV) console.log('✅ 系统白名单放行:', systemName)
        return true
      }
      
      // 从菜单数据中查找系统
      if (this.menuData && this.menuData.length > 0) {
        // 查找菜单中是否包含此系统
        const systemMenu = this.menuData.find(menu => {
          if (!menu.path) return false
          
          // 规范化路径进行比较
          const menuPath = menu.path.toLowerCase()
          const systemPath = systemName.toLowerCase()
          
          // 如果是复合路径，比较第一部分或完整路径
          if (menuPath.includes('/')) {
            return menuPath.split('/')[0] === systemPath || menuPath === systemPath
          }
          
          return menuPath === systemPath
        })
        
        if (systemMenu) {
          if (import.meta.env.DEV) console.log('✅ 从菜单数据验证通过:', systemName)
          return true
        }
      }
      
      // 开发环境下允许访问所有系统(开发便利性)
      if (import.meta.env.DEV) {
        console.warn('⚠️ 开发环境下允许访问系统:', systemName)
        return true
      }
      
      return false
    },
    
    // 重置状态
    resetState() {
      this.menuData = []
      this.routes = []
      this.addRoutes = []
      this.hasPermission = false
    }
  }
}) 