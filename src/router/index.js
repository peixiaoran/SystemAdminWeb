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
    redirect: ROUTE_CONFIG.BASE.ERROR_404
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
          console.log('本地缓存路由数据有效')
          return true
        }
      }
    }
  } catch (e) {
    console.error('读取缓存路由数据失败', e)
  }
  console.log('本地缓存路由数据无效或不存在')
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
    console.error('解析缓存路由数据失败', e)
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
    localStorage.setItem('route-store', JSON.stringify(data))
    cachedRoutes = routes
    cachedRoutesTimestamp = now
  } catch (e) {
    console.error('保存路由数据失败', e)
  }
}

// 动态添加路由的方法 - 从接口获取
export async function addDynamicRoutes() {
  try {
    // 首先移除所有已添加的动态路由，防止重复
    resetRouter()
    
    // 首先尝试从缓存中获取路由数据
    if (cachedRoutes) {
      console.log('使用内存中的路由缓存')
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
      console.log('动态路由加载成功(内存缓存)')
      return true
    }
    
    // 其次尝试从localStorage获取
    if (hasCachedRoutes()) {
      console.log('使用localStorage中的路由缓存')
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
          
          console.log('动态路由加载成功(localStorage缓存)')
          return true
        } catch (error) {
          console.error('解析localStorage缓存的路由数据失败，将尝试从API获取', error)
          // 清除无效的缓存数据
          clearRoutesCache()
          // 继续执行，从API获取
        }
      }
    }
    
    // 最后尝试从API获取
    console.log('从API获取路由数据')
    const res = await post(ROUTER_API.GET_ROUTER)
    
    if (res && res.code === '200' && res.data && Array.isArray(res.data) && res.data.length > 0) {
      // 验证API返回的数据格式是否正确
      const firstRoute = res.data[0]
      if (!firstRoute || !firstRoute.path || !Array.isArray(firstRoute.children)) {
        console.error('API返回的路由数据格式不正确，使用静态路由')
        addStaticRoutes()
        return false
      }
      
      try {
        // 获取到动态路由数据，解析并添加到路由中
        const dynamicRoutes = parseRouteData(res.data)
        
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
        saveRoutesToStorage(res.data)
        
        console.log('动态路由加载成功(API)')
        return true
      } catch (error) {
        console.error('解析API返回的路由数据失败，使用静态路由', error)
        addStaticRoutes()
        return false
      }
    } else {
      // 如果接口请求失败，退回使用静态路由
      console.warn('获取动态路由失败或数据为空，使用静态路由')
      addStaticRoutes()
      return false
    }
  } catch (error) {
    console.error('加载动态路由出错，使用静态路由', error)
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
    console.error('清除路由缓存失败', e)
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
        [ROUTE_CONFIG.META.AUTH]: true
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
            console.error(`加载组件 ${route.component} 失败:`, error)
            // 返回一个错误页面组件
            return import('../views/error/404.vue')
          }
        }
      } catch (error) {
        console.error(`设置组件 ${route.component} 失败:`, error)
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
            console.log('刷新页面：动态路由添加成功')
            
            // 再次检查路由匹配
            const matchedRoute = router.resolve(to.path)
            if (matchedRoute && matchedRoute.matched && matchedRoute.matched.length > 0) {
              // 路由已添加成功，重定向到原始路径
              return next({ ...to, replace: true })
            } else {
              // 路由添加成功但目标路由不存在
              console.warn('目标路由不存在，重定向到首页')
              return next({ path: '/', replace: true })
            }
          } else {
            // 如果动态路由添加失败，使用静态路由
            console.warn('动态路由添加失败，使用静态路由')
            addStaticRoutes()
            return next({ ...to, replace: true })
          }
        } catch (error) {
          console.error('处理路由刷新时出错', error)
          // 出错时重定向到首页
          return next({ path: '/', replace: true })
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
        path: ROUTE_CONFIG.BASE.LOGIN,
        query: { redirect: to.fullPath }
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

// 导出适配老代码的方法名
export { addDynamicRoutes as addRoutes }
export default router