import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../layout/index.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { post } from '@/utils/request'
import { ROUTER_API } from '@/config/api/router/router'
import { useRouteStore } from '@/stores/route'

// 配置NProgress
NProgress.configure({ 
  easing: 'ease', 
  speed: 500, 
  showSpinner: false, 
  trickleSpeed: 200, 
  minimum: 0.3 
})

// 路由配置常量
const ROUTE_CONFIG = {
  // 基础路由
  BASE: {
    HOME: '/module-select',
    LOGIN: '/login',
    ERROR_403: '/403',
    ERROR_404: '/404'
  },
  // 路由元信息
  META: {
    TITLE: 'SystemsAdmin管理系统',
    AUTH: 'requiresAuth'
  }
}

// 定义基础路由 - 这些路由在登录前就可以访问
const constantRoutes = [
  {
    path: ROUTE_CONFIG.BASE.LOGIN,
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: ROUTE_CONFIG.BASE.HOME,
    name: 'ModuleSelect',
    component: () => import('../views/module-select/index.vue'),
    meta: { 
      title: '系统模块', 
      [ROUTE_CONFIG.META.AUTH]: true 
    }
  },
  // 添加重定向路由，确保/路径指向模块选择页面
  {
    path: '/',
    redirect: ROUTE_CONFIG.BASE.HOME
  },
  // 错误页面路由
  {
    path: ROUTE_CONFIG.BASE.ERROR_403,
    name: 'Forbidden',
    component: () => import('../views/error/403.vue'),
    meta: { title: '403' }
  },
  {
    path: ROUTE_CONFIG.BASE.ERROR_404,
    name: 'NotFound',
    component: () => import('../views/error/404.vue'),
    meta: { title: '404' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: to => {
      // 将所有未匹配的路由重定向到登录页面，并清空缓存
      clearUserDataAndCache();
      return { 
        path: ROUTE_CONFIG.BASE.LOGIN
      }
    }
  }
]

// 定义动态路由 - 这些路由需要在用户登录后才能访问
// 这个是备用的静态路由，在动态路由加载失败时使用
const asyncRoutes = [
  
  
]

// 创建路由实例，初始只包含基础路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 存储路由数据的临时变量
let cachedRoutes = null
let cachedRoutesTimestamp = null

// 检查是否有缓存的路由数据
function hasCachedRoutes() {
  try {
    const routeData = localStorage.getItem('route-store')
    if (routeData) {
      const parsed = JSON.parse(routeData)
      if (parsed && parsed.routes && Array.isArray(parsed.routes) && parsed.routes.length > 0) {
        // 检查第一个路由对象，确保格式正确
        const firstRoute = parsed.routes[0]
        if (firstRoute && firstRoute.path && firstRoute.children && Array.isArray(firstRoute.children)) {
          return true
        }
      }
    }
  } catch (e) {
  }
  return false
}

// 从本地存储获取路由数据
function getRoutesFromStorage() {
  try {
    const routeData = localStorage.getItem('route-store')
    if (routeData) {
      const parsed = JSON.parse(routeData)
      if (parsed && parsed.routes) {
        return parsed.routes
      }
    }
  } catch (e) {
  }
  return null
}

// 保存路由数据到本地存储
function saveRoutesToStorage(routes) {
  try {
    const now = new Date().toISOString()
    const data = {
      routes,
      dynamicRoutesLoaded: true,
      lastUpdated: now
    }
    // 保存到route-store键，用于Pinia的持久化存储和路由恢复
    localStorage.setItem('route-store', JSON.stringify(data))
    
    // 更新内存缓存
    cachedRoutes = routes
    cachedRoutesTimestamp = now
  } catch (e) {
  }
}

// 动态添加路由的方法 - 从接口获取
export async function addDynamicRoutes() {
  try {
    // 首先移除所有已添加的动态路由，防止重复
    resetRouter()
    
    // 首先尝试从缓存中获取路由数据
    if (cachedRoutes) {
      const dynamicRoutes = parseRouteData(cachedRoutes)
      
      // 将Layout作为根路由
      const layoutRoute = {
        path: '/',
        name: 'LayoutContainer', // 修改名称避免重复
        component: Layout,
        meta: { 
          [ROUTE_CONFIG.META.AUTH]: true 
        },
        children: dynamicRoutes
      }
      
      // 添加到路由
      router.addRoute(layoutRoute)
      return true
    }
    
    // 其次尝试从localStorage获取
    if (hasCachedRoutes()) {
      const storedRoutes = getRoutesFromStorage()
      
      if (storedRoutes && storedRoutes.length > 0) {
        try {
          const dynamicRoutes = parseRouteData(storedRoutes)
          
          // 将Layout作为根路由
          const layoutRoute = {
            path: '/',
            name: 'LayoutContainer', // 修改名称避免重复
            component: Layout,
            meta: { 
              [ROUTE_CONFIG.META.AUTH]: true 
            },
            children: dynamicRoutes
          }
          
          // 添加到路由
          router.addRoute(layoutRoute)
          
          // 更新内存缓存
          cachedRoutes = storedRoutes
          
          return true
        } catch (error) {
          // 清除无效的缓存数据
          clearRoutesCache()
          // 继续执行，从API获取
        }
      }
    }
    
    // 最后尝试从API获取
    try {
      const res = await post(ROUTER_API.GET_ROUTER)
      
      if (res && res.code === '200') {
        // 适应新格式：API现在返回的是 { data: {路由对象}, code: "200", message: "" }
        // 而不是直接返回路由数组
        let routeData = null
        
        // 检查响应格式
        if (res.data && res.data.children && Array.isArray(res.data.children)) {
          // 新格式：使用res.data中的路由对象
          routeData = res.data.children
        } else if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          // 旧格式：直接使用res.data数组（兼容旧版本）
          routeData = res.data
        } else {
          addStaticRoutes()
          return false
        }
        
        try {
          // 获取到动态路由数据，解析并添加到路由中
          const dynamicRoutes = parseRouteData(routeData)
          
          // 将Layout作为根路由
          const layoutRoute = {
            path: '/',
            name: 'LayoutContainer', // 修改名称避免重复
            component: Layout,
            meta: { 
              [ROUTE_CONFIG.META.AUTH]: true 
            },
            children: dynamicRoutes
          }
          
          // 添加到路由
          router.addRoute(layoutRoute)
          
          // 保存到缓存
          saveRoutesToStorage(routeData)
          
          return true
        } catch (error) {
          addStaticRoutes()
          return false
        }
      } else {
        // 如果接口请求失败，退回使用静态路由
        addStaticRoutes()
        return false
      }
    } catch (error) {
      // 如果API请求出错，尝试使用route-store中的数据作为备份
      try {
        const routeStoreData = localStorage.getItem('route-store')
        if (routeStoreData) {
          const parsedData = JSON.parse(routeStoreData)
          if (parsedData && parsedData.routes && Array.isArray(parsedData.routes) && parsedData.routes.length > 0) {
            const dynamicRoutes = parseRouteData(parsedData.routes)
            
            // 将Layout作为根路由
            const layoutRoute = {
              path: '/',
              name: 'LayoutContainer', // 修改名称避免重复
              component: Layout,
              meta: { 
                [ROUTE_CONFIG.META.AUTH]: true 
              },
              children: dynamicRoutes
            }
            
            // 添加到路由
            router.addRoute(layoutRoute)
            
            // 更新内存缓存
            cachedRoutes = parsedData.routes
            
            return true
          }
        }
      } catch (backupError) {
        // 如果备份恢复也失败，使用静态路由
      }
      
      // 最后使用静态路由
      addStaticRoutes()
      return false
    }
  } catch (error) {
    addStaticRoutes()
    return false
  }
}

// 清除路由缓存
export function clearRoutesCache() {
  try {
    localStorage.removeItem('route-store')
    cachedRoutes = null
    cachedRoutesTimestamp = null
  } catch (e) {
  }
}

// 解析路由数据函数
function parseRouteData(routeData) {
  return routeData.map(route => {
    // 检查路由名称是否已经存在，如果存在则添加前缀避免冲突
    const routeName = route.name || '';
    
    // 构建路由对象
    const routeConfig = {
      path: route.path,
      name: routeName ? `dynamic_${routeName}` : undefined, // 添加前缀避免冲突
      meta: {
        ...route.meta, // 首先复制所有原始meta属性
        title: route.meta?.title || route.name,
        [ROUTE_CONFIG.META.AUTH]: true,
        // 确保noTag字段被正确处理
        noTag: route.meta?.noTag !== undefined ? route.meta.noTag : null
      }
    }
    
    // 处理重定向
    if (route.redirect) {
      routeConfig.redirect = route.redirect
    }
    
    // 处理组件
    if (route.component) {
      try {
        // 使用@vite-ignore注释忽略Vite的动态导入警告
        routeConfig.component = () => {
          // 添加错误处理逻辑
          try {
            // 使用@vite-ignore注释告诉Vite不要分析这个动态导入
            return import(/* @vite-ignore */ `../views/${route.component}`)
          } catch (error) {
            // 返回一个空组件，它会自动重定向到登录页面
            return {
              render() {
                // 清除用户数据和缓存
                clearUserDataAndCache();
                // 在组件渲染时重定向到登录页面
                router.replace({
                  path: ROUTE_CONFIG.BASE.LOGIN
                });
                return null;
              }
            };
          }
        }
      } catch (error) {
      }
    }
    
    // 递归处理子路由
    if (route.children && route.children.length > 0) {
      routeConfig.children = parseRouteData(route.children)
    }
    
    return routeConfig
  })
}

// 添加静态路由的方法（原方法，作为备用）
export function addStaticRoutes() {
  // 移除所有已添加的动态路由，防止重复
  resetRouter()
  
  asyncRoutes.forEach(route => {
    router.addRoute(route)
  })
}

// 重置路由
export function resetRouter() {
  // 移除所有动态添加的路由
  router.getRoutes().forEach(route => {
    if (route.name && route.name !== 'Login' && 
        route.name !== 'ModuleSelect' && 
        route.name !== 'Forbidden' && 
        route.name !== 'NotFound') {
      router.removeRoute(route.name)
    }
  })
}

// 设置路由守卫以设置页面标题和进度条
router.beforeEach(async (to, from, next) => {
  // 启动进度条
  NProgress.start()
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - ${ROUTE_CONFIG.META.TITLE}` : ROUTE_CONFIG.META.TITLE
  
  // 检查当前路由是否有空重定向
  if (to.matched.some(record => record.redirect === '')) {
    // 如果有空重定向，则取消导航
    NProgress.done()
    return next(false)
  }

  // 检查是否需要鉴权
  if (to.matched.some(record => record.meta[ROUTE_CONFIG.META.AUTH])) {
    // 检查是否已登录
    const token = localStorage.getItem('token')
    if (token) {
      // 处理页面刷新时路由丢失的问题
      if (to.matched.length === 0) {
        try {
          // 尝试重新添加动态路由
          const routesAdded = await addDynamicRoutes()
          
          if (routesAdded) {
            // 再次检查路由匹配
            const matchedRoute = router.resolve(to.path)
            if (matchedRoute && matchedRoute.matched && matchedRoute.matched.length > 0) {
              // 路由存在，可以直接进入，使用replace:true确保不留下重复历史记录
              return next({ path: to.fullPath, replace: true })
            } else {
              // 尝试特殊处理：可能是缓存的路由数据不完整，尝试从API刷新
              try {
                // 清除路由缓存（但不清除用户数据）
                clearRoutesCache()
                // 尝试从API强制刷新路由
                const refreshSuccess = await refreshRoutesFromAPI()
                if (refreshSuccess) {
                  // 再次检查路由
                  const refreshedMatch = router.resolve(to.path)
                  if (refreshedMatch && refreshedMatch.matched && refreshedMatch.matched.length > 0) {
                    // 路由存在，可以进入
                    return next({ path: to.fullPath, replace: true })
                  }
                }
              } catch (refreshError) {
                // 刷新失败，回退到登录
              }
              
              // 如果特殊处理也无效，则清除缓存并重定向到登录页面
              clearUserDataAndCache()
              return next({ 
                path: ROUTE_CONFIG.BASE.LOGIN
              })
            }
          } else {
            // 动态路由添加失败，清除缓存并重定向到登录页面
            clearUserDataAndCache()
            return next({ 
              path: ROUTE_CONFIG.BASE.LOGIN
            })
          }
        } catch (error) {
          // 出错时清除缓存并重定向到登录页面
          clearUserDataAndCache()
          return next({ 
            path: ROUTE_CONFIG.BASE.LOGIN
          })
        }
      } else {
        // 处理模块index页面的访问
        const path = to.path
        if (path.includes('/index')) {
          // 如果是模块的index页面，直接放行
          next()
          return
        }
        next()
      }
    } else {
      // 未登录则重定向到登录页
      next({
        path: ROUTE_CONFIG.BASE.LOGIN
      })
    }
  } else {
    // 不需要鉴权的页面直接放行
    next()
  }
})

router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})

// 添加错误处理
router.onError(() => {
  // 确保发生错误时也结束进度条
  NProgress.done()
})

// 清除用户数据和缓存的函数
function clearUserDataAndCache() {
  // 清除token
  localStorage.removeItem('token')
  
  // 清除路由缓存
  clearRoutesCache()
  
  // 清除模块信息
  localStorage.removeItem('currentDomainId')
  localStorage.removeItem('currentSystemName')
  localStorage.removeItem('currentSystemPath')
  localStorage.removeItem('module-store')
  
  // 清除标签缓存
  localStorage.removeItem('tabs-store')
}

// 导出适配老代码的方法名
export { addDynamicRoutes as addRoutes }

// 从API强制刷新路由数据
export async function refreshRoutesFromAPI() {
  try {
    // 请求新的路由数据
    const res = await post(ROUTER_API.GET_ROUTER)
    
    if (res && res.code === '200') {
      // 适应新格式：API现在返回的是 { data: {路由对象}, code: "200", message: "" }
      // 而不是直接返回路由数组
      let routeData = null
      
      // 检查响应格式
      if (res.data && res.data.children && Array.isArray(res.data.children)) {
        // 新格式：使用res.data中的路由对象
        routeData = res.data.children
      } else if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        // 旧格式：直接使用res.data数组（兼容旧版本）
        routeData = res.data
      } else {
        return false
      }
      
      // 先重置路由
      resetRouter()
      
      // 解析并添加新路由
      const dynamicRoutes = parseRouteData(routeData)
      
      // 将Layout作为根路由
      const layoutRoute = {
        path: '/',
        name: 'LayoutContainer',
        component: Layout,
        meta: { 
          [ROUTE_CONFIG.META.AUTH]: true 
        },
        children: dynamicRoutes
      }
      
      // 添加到路由
      router.addRoute(layoutRoute)
      
      // 保存到缓存 - 保存children数组或原始数据
      saveRoutesToStorage(routeData)
      
      // 更新Pinia store
      try {
        const routeStore = useRouteStore()
        routeStore.setRoutes(routeData)
      } catch (storeError) {
        // Pinia store可能还未初始化
      }
      
      return true
    }
    return false
  } catch (error) {
    return false
  }
}

export default router