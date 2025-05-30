import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../layout/index.vue'
import { post } from '@/utils/request'
import { ROUTER_API } from '@/config/api/router/router'
import { useRouteStore } from '@/stores/route'
import { markRaw } from 'vue'

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
    component: markRaw(() => import('../views/login/index.vue')),
    meta: { title: '登录' }
  },
  {
    path: ROUTE_CONFIG.BASE.HOME,
    name: 'ModuleSelect',
    component: markRaw(() => import('../views/module-select/index.vue')),
    meta: { 
      title: '系统模块', 
      [ROUTE_CONFIG.META.AUTH]: true 
    }
  },
  // 根路由重定向 - 仅用于正常导航，不干扰刷新时的路由恢复
  {
    path: '/',
    redirect: ROUTE_CONFIG.BASE.HOME
  },
  // 错误页面路由
  {
    path: ROUTE_CONFIG.BASE.ERROR_403,
    name: 'Forbidden',
    component: markRaw(() => import('../views/error/403.vue')),
    meta: { title: '403' }
  },
  {
    path: ROUTE_CONFIG.BASE.ERROR_404,
    name: 'NotFound',
    component: markRaw(() => import('../views/error/404.vue')),
    meta: { title: '404' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: () => {
      // 简化通配符路由的重定向逻辑
      const token = localStorage.getItem('token')
      if (token) {
        return { path: ROUTE_CONFIG.BASE.HOME }
      } else {
        clearUserDataAndCache();
        return { path: ROUTE_CONFIG.BASE.LOGIN }
      }
    }
  }
]

// 定义动态路由 - 这些路由需要在用户登录后才能访问
// 这个是备用的静态路由，在动态路由加载失败时使用
const asyncRoutes = [
  // 这里可以添加一些备用路由
]

// 检查是否为刷新操作的标志
let isPageRefresh = true;

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
    console.error('Error checking cached routes:', e)
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
    console.error('Error getting routes from storage:', e)
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
    
    // 更新Pinia store
    const routeStore = useRouteStore()
    routeStore.setRoutes(routes)
  } catch (e) {
    console.error('Error saving routes to storage:', e)
  }
}

// 动态添加路由的方法 - 从接口获取
export async function addDynamicRoutes() {
  try {
    // 首先移除所有已添加的动态路由，防止重复
    resetRouter()
    
    // 尝试从内存缓存中获取路由数据
    if (cachedRoutes) {
      const dynamicRoutes = parseRouteData(cachedRoutes)
      addLayoutRouteWithChildren(dynamicRoutes)
      return true
    }
    
    // 尝试从localStorage获取
    if (hasCachedRoutes()) {
      const storedRoutes = getRoutesFromStorage()
      if (storedRoutes && storedRoutes.length > 0) {
        try {
          const dynamicRoutes = parseRouteData(storedRoutes)
          addLayoutRouteWithChildren(dynamicRoutes)
          
          // 更新内存缓存
          cachedRoutes = storedRoutes
          return true
        } catch (error) {
          console.error('Error parsing stored routes:', error)
          clearRoutesCache()
        }
      }
    }
    
    // 从API获取
    try {
      const res = await post(ROUTER_API.GET_ROUTER)
      
      if (res && res.code === '200') {
        let routeData = null
        
        if (res.data && res.data.children && Array.isArray(res.data.children)) {
          routeData = res.data.children
        } else if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          routeData = res.data
        } else {
          console.warn('API returned invalid route data structure')
          addStaticRoutes()
          return false
        }
        
        try {
          const dynamicRoutes = parseRouteData(routeData)
          addLayoutRouteWithChildren(dynamicRoutes)
          
          // 保存到缓存
          saveRoutesToStorage(routeData)
          return true
        } catch (error) {
          console.error('Error parsing API route data:', error)
          addStaticRoutes()
          return false
        }
      } else {
        console.error('API returned non-200 code:', res?.code)
        addStaticRoutes()
        return false
      }
    } catch (error) {
      console.error('API request failed:', error)
      
      // 尝试使用route-store中的数据作为备份
      try {
        const routeStoreData = localStorage.getItem('route-store')
        if (routeStoreData) {
          const parsedData = JSON.parse(routeStoreData)
          if (parsedData && parsedData.routes) {
            const dynamicRoutes = parseRouteData(parsedData.routes)
            addLayoutRouteWithChildren(dynamicRoutes)
            
            // 更新内存缓存
            cachedRoutes = parsedData.routes
            return true
          }
        }
      } catch (backupError) {
        console.error('Backup route recovery failed:', backupError)
      }
      
      // 最后使用静态路由
      addStaticRoutes()
      return false
    }
  } catch (error) {
    console.error('Unexpected error in addDynamicRoutes:', error)
    addStaticRoutes()
    return false
  }
}

// 添加带有Layout父路由的路由
function addLayoutRouteWithChildren(childrenRoutes) {
  const layoutRoute = {
    path: '/',
    name: 'LayoutContainer',
    component: markRaw(Layout),
    meta: { 
      [ROUTE_CONFIG.META.AUTH]: true 
    },
    children: childrenRoutes
  }
  
  router.addRoute(layoutRoute)
}

// 清除路由缓存
export function clearRoutesCache() {
  try {
    localStorage.removeItem('route-store')
    cachedRoutes = null
    cachedRoutesTimestamp = null
    
    // 更新Pinia store
    const routeStore = useRouteStore()
    routeStore.clearRoutes()
  } catch (e) {
    console.error('Error clearing route cache:', e)
  }
}

// 解析路由数据函数
function parseRouteData(routeData) {
  return routeData.map(route => {
    const routeConfig = {
      path: route.path,
      name: route.name ? `dynamic_${route.name}` : undefined,
      meta: {
        ...route.meta,
        title: route.meta?.title || route.name,
        [ROUTE_CONFIG.META.AUTH]: true,
        noTag: route.meta?.noTag !== undefined ? route.meta.noTag : null
      }
    }
    
    if (route.redirect) {
      routeConfig.redirect = route.redirect
    }
    
    if (route.component) {
      try {
        routeConfig.component = markRaw(() => import(/* @vite-ignore */ `../views/${route.component}`))
      } catch (error) {
        console.error(`Error loading component for route ${route.path}:`, error)
        routeConfig.component = markRaw({
          template: '<div>Component load error</div>'
        })
      }
    }
    
    if (route.children && route.children.length > 0) {
      routeConfig.children = parseRouteData(route.children)
    }
    
    return routeConfig
  })
}

// 添加静态路由的方法
export function addStaticRoutes() {
  resetRouter()
  
  asyncRoutes.forEach(route => {
    router.addRoute(route)
  })
}

// 重置路由
export function resetRouter() {
  // 获取当前所有路由
  const currentRoutes = router.getRoutes()
  
  // 移除所有动态添加的路由
  currentRoutes.forEach(route => {
    if (route.name && 
        route.name !== 'Login' && 
        route.name !== 'ModuleSelect' && 
        route.name !== 'Forbidden' && 
        route.name !== 'NotFound') {
      router.removeRoute(route.name)
    }
  })
}

// 设置路由守卫
router.beforeEach(async (to, from, next) => {
  // 检查是否是刷新操作（from路径为空表示刷新）
  const isRefresh = from.path === '';
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - ${ROUTE_CONFIG.META.TITLE}` : ROUTE_CONFIG.META.TITLE
  
  // 如果当前是页面首次加载或刷新
  if (isPageRefresh) {
    // 重置刷新标志，以便后续导航不被视为刷新
    isPageRefresh = false;
    
    // 保存原始访问路径，将用于后续恢复
    const originalPath = to.fullPath || to.path;
    
    // 检查是否已登录
    const token = localStorage.getItem('token');
    if (token) {
      // 尝试恢复标签页和路由状态
      console.log('检测到页面刷新，尝试恢复路由状态，原始路径:', originalPath);
      
      // 如果是刷新到module-select页面，先检查是否有保存的标签页
      if (to.path === '/module-select' || to.path === '/') {
        // 尝试从localStorage获取上次访问的页面
        try {
          const tabsStore = localStorage.getItem('tabs-store');
          if (tabsStore) {
            const tabsData = JSON.parse(tabsStore);
            // 如果有保存的活动标签且不是module-select
            if (tabsData && tabsData.activeTabName && 
                tabsData.activeTabName !== '/module-select' && 
                tabsData.visitedTabs && 
                tabsData.visitedTabs.length > 0) {
              
              // 先添加动态路由
              await addDynamicRoutes();
              
              // 然后导航到保存的标签页
              console.log('检测到保存的标签页，尝试恢复到:', tabsData.activeTabName);
              return next({ path: tabsData.activeTabName, replace: true });
            }
          }
        } catch (e) {
          console.error('恢复标签页出错:', e);
        }
      }
      
      // 尝试添加动态路由
      try {
        console.log('尝试恢复动态路由');
        const routesAdded = await addDynamicRoutes();
        
        if (routesAdded) {
          // 动态路由添加成功
          console.log('动态路由恢复成功，继续导航');
          return next();
        } else {
          // 动态路由添加失败，但仍然尝试继续导航
          console.warn('动态路由恢复失败，但仍继续导航');
          return next();
        }
      } catch (error) {
        console.error('动态路由恢复错误:', error);
        return next();
      }
    } else {
      // 未登录且需要鉴权的页面，重定向到登录页
      if (to.matched.some(record => record.meta[ROUTE_CONFIG.META.AUTH])) {
        return next({ path: ROUTE_CONFIG.BASE.LOGIN, replace: true });
      }
      // 其他情况继续导航
      return next();
    }
  }
  
  // 非刷新导航的处理 (正常的路由切换)
  if (to.matched.some(record => record.meta[ROUTE_CONFIG.META.AUTH])) {
    const token = localStorage.getItem('token');
    if (token) {
      // 已登录，检查路由是否存在
      if (to.matched.length === 0) {
        console.log('路由不存在，尝试添加动态路由');
        try {
          const routesAdded = await addDynamicRoutes();
          if (routesAdded) {
            // 重新导航（会再次触发路由守卫）
            return next({ path: to.fullPath, replace: true });
          } else {
            console.warn('动态路由添加失败，导航到模块选择页');
            return next({ path: ROUTE_CONFIG.BASE.HOME, replace: true });
          }
        } catch (error) {
          console.error('动态路由添加出错:', error);
          return next({ path: ROUTE_CONFIG.BASE.HOME, replace: true });
        }
      } else {
        // 路由存在，直接导航
        return next();
      }
    } else {
      // 未登录，重定向到登录页
      return next({ path: ROUTE_CONFIG.BASE.LOGIN, replace: true });
    }
  } else {
    // 不需要鉴权的页面直接放行
    return next();
  }
})

// 清除用户数据和缓存的函数
function clearUserDataAndCache() {
  localStorage.removeItem('token')
  clearRoutesCache()
  localStorage.removeItem('currentDomainId')
  localStorage.removeItem('currentSystemName')
  localStorage.removeItem('currentSystemPath')
  localStorage.removeItem('module-store')
  localStorage.removeItem('tabs-store')
}

// 导出适配老代码的方法名
export { addDynamicRoutes as addRoutes }

// 从API强制刷新路由数据
export async function refreshRoutesFromAPI() {
  try {
    const res = await post(ROUTER_API.GET_ROUTER)
    
    if (res && res.code === '200') {
      let routeData = null
      
      if (res.data && res.data.children && Array.isArray(res.data.children)) {
        routeData = res.data.children
      } else if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        routeData = res.data
      } else {
        return false
      }
      
      // 重置路由
      resetRouter()
      
      const dynamicRoutes = parseRouteData(routeData)
      
      // 创建并添加Layout父路由
      addLayoutRouteWithChildren(dynamicRoutes)
      
      // 保存到缓存
      saveRoutesToStorage(routeData)
      
      return true
    }
    return false
  } catch (error) {
    console.error('Error refreshing routes from API:', error)
    return false
  }
}

export default router