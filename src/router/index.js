import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../layout/index.vue'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 自动导入所有views下的路由模块
const modules = import.meta.glob('../views/**/*.vue')

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

// 基础路由配置
const baseRoutes = [
  {
    path: '/',
    redirect: ROUTE_CONFIG.BASE.HOME
  },
  {
    path: '/dashboard',
    redirect: ROUTE_CONFIG.BASE.HOME
  },
  // 添加重定向路由，用于刷新页面
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('../views/redirect/index.vue'),
        meta: { title: '重定向', noCache: true }
      }
    ]
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
  {
    path: ROUTE_CONFIG.BASE.LOGIN,
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    meta: { title: '登录' }
  }
]

// 错误页面路由
const errorRoutes = [
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

// 模块映射配置
const MODULE_MAP = {
  'user-admin': { 
    title: '用户管理系统', 
    icon: 'User' 
  },
  'content-admin': { 
    title: '内容管理系统', 
    icon: 'Document' 
  },
  'order-admin': { 
    title: '订单管理系统', 
    icon: 'ShoppingCart' 
  },
  'data-admin': { 
    title: '数据分析系统', 
    icon: 'DataAnalysis' 
  },
  'system-admin': { 
    title: '系统设置', 
    icon: 'Setting' 
  },
  'message-admin': { 
    title: '消息中心', 
    icon: 'Message' 
  }
}

// 白名单路径，不需要权限验证
const WHITE_LIST = [
  '/login', 
  '/404', 
  '/403', 
  '/dashboard', 
  '/module-select'
]

// 系统首页白名单，需要登录但不需要特定权限
const SYSTEM_HOME_WHITELIST = [
  '/dashboard/system-admin',
  '/dashboard/user-admin',
  '/dashboard/content-admin',
  '/dashboard/order-admin',
  '/dashboard/data-admin',
  '/dashboard/message-admin'
]

// 添加调试信息以帮助排查问题
function logRouteInfo(prefix, to, extra = {}) {
  if (import.meta.env.DEV) {
    console.group(`🔍 ${prefix}`)
    console.log('Target path:', to.path)
    console.log('Route name:', to.name)
    console.log('Route params:', to.params)
    console.log('Route query:', to.query)
    console.log('Route meta:', to.meta)
    
    if (Object.keys(extra).length > 0) {
      Object.entries(extra).forEach(([key, value]) => {
        console.log(`${key}:`, value)
      })
    }
    console.groupEnd()
  }
}

// 生成dashboard下的路由
function generateDashboardRoutes() {
  const dashboardRoutes = []

  // 遍历所有模块
  Object.keys(MODULE_MAP).forEach(moduleName => {
    const moduleConfig = MODULE_MAP[moduleName]
    
    // 支持复合路径格式，如system-admin/system-mgmt
    const moduleKeys = Object.keys(MODULE_MAP);
    
    // 创建模块路由
    const moduleRoute = {
      path: `/dashboard/${moduleName}`,
      component: Layout,
      redirect: `/dashboard/${moduleName}`,
      meta: { 
        title: moduleConfig.title, 
        icon: moduleConfig.icon,
        [ROUTE_CONFIG.META.AUTH]: true
      },
      children: []
    }

    // 添加首页路由
    moduleRoute.children.push({
      path: '',
      name: `${toPascalCase(moduleName)}Index`,
      component: () => import(`../views/dashboard/${moduleName}/index.vue`),
      meta: { 
        title: '首页', 
        icon: 'HomeFilled',
        [ROUTE_CONFIG.META.AUTH]: true
      }
    })

    // 动态添加子路由
    Object.keys(modules).forEach(key => {
      // 支持system-admin/system-mgmt和system-admin两种路径格式
      const mainPathRegex = new RegExp(`../views/dashboard/${moduleName}/(.+)\\.vue$`);
      const nestedPathRegex = new RegExp(`../views/dashboard/${moduleName}/([-\\w]+)/([-\\w]+)\\.vue$`);
      
      const matchPath = key.match(mainPathRegex);
      const matchNestedPath = key.match(nestedPathRegex);
      
      if (matchPath) {
        const routeConfig = processRoutePath(matchPath[1], moduleName)
        if (routeConfig) {
          moduleRoute.children.push(routeConfig)
        }
      }
      
      // 特殊处理system-admin/system-mgmt子路径
      if (moduleName === 'system-admin' && matchNestedPath) {
        const subFolder = matchNestedPath[1]; // system-mgmt
        const fileName = matchNestedPath[2];  // domain
        
        const subRouteConfig = {
          path: `${subFolder}/${fileName}`,
          name: `SystemAdmin${toPascalCase(subFolder)}${toPascalCase(fileName)}`,
          component: modules[key],
          meta: { 
            title: formatFileName(fileName), 
            icon: getFileIcon('system-admin', subFolder, fileName),
            [ROUTE_CONFIG.META.AUTH]: true
          }
        };
        
        moduleRoute.children.push(subRouteConfig);
      }
    })

    dashboardRoutes.push(moduleRoute)
  })

  return dashboardRoutes
}

// 处理路由路径
function processRoutePath(fullPath, moduleName) {
  const pathParts = fullPath.split('/')
  const fileName = pathParts[pathParts.length - 1]
  
  // 处理index.vue文件
  if (fileName === 'index') {
    return processIndexRoute(pathParts.slice(0, -1), moduleName)
  }
  
  // 处理非index.vue文件
  return processNonIndexRoute(pathParts, moduleName)
}

// 处理index路由
function processIndexRoute(pathSegments, moduleName) {
  if (pathSegments.length === 1) {
    return createRouteConfig(
      pathSegments[0],
      moduleName,
      pathSegments[0],
      getModuleTitle(moduleName, pathSegments[0]),
      getModuleIcon(moduleName, pathSegments[0])
    )
  }
  
  if (pathSegments.length > 1) {
    const routePath = pathSegments[pathSegments.length - 1]
    const routeName = pathSegments.map(segment => toPascalCase(segment)).join('')
    
    return createRouteConfig(
      routePath,
      moduleName,
      routeName,
      getNestedModuleTitle(moduleName, pathSegments),
      getNestedModuleIcon(moduleName, pathSegments)
    )
  }
  
  return null
}

// 处理非index路由
function processNonIndexRoute(pathParts, moduleName) {
  const dirSegments = pathParts.slice(0, -1)
  const fileName = pathParts[pathParts.length - 1]
  
  if (dirSegments.length === 0) {
    return createRouteConfig(
      fileName,
      moduleName,
      fileName,
      getFileTitle(moduleName, fileName),
      getFileIcon(moduleName, fileName)
    )
  }
  
  const subModule = dirSegments[dirSegments.length - 1]
  const routePath = `${subModule}/${fileName}`
  const routeName = `${toPascalCase(moduleName)}${toPascalCase(subModule)}${toPascalCase(fileName)}`
  
  const title = dirSegments.length === 1
    ? getFileTitle(moduleName, subModule, fileName)
    : getNestedFileTitle(moduleName, dirSegments, fileName)
    
  const icon = dirSegments.length === 1
    ? getFileIcon(moduleName, subModule, fileName)
    : getNestedFileIcon(moduleName, dirSegments, fileName)
    
  return createRouteConfig(routePath, moduleName, routeName, title, icon)
}

// 创建路由配置对象
function createRouteConfig(path, moduleName, name, title, icon) {
  return {
    path,
    name: `${toPascalCase(moduleName)}${name}`,
    component: modules[`../views/dashboard/${moduleName}/${path}.vue`],
    meta: { 
      title,
      icon,
      [ROUTE_CONFIG.META.AUTH]: true
    }
  }
}

// 辅助函数：转换为PascalCase
function toPascalCase(str) {
  return str.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
}

// 图标映射配置
const ICON_MAPS = {
  modules: {
    'user-admin': {
      'user-list': 'UserFilled',
      'user-group': 'UserFilled',
      'role': 'Lock',
      'menu': 'Lock'
    },
    'content-admin': {
      'article-list': 'Document',
      'category': 'Folder',
      'image': 'Picture'
    },
    'order-admin': {
      'order-list': 'List',
      'product-list': 'Goods',
      'product-category': 'Goods',
      'customer': 'User'
    },
    'data-admin': {
      'data-report': 'PieChart',
      'real-time': 'Monitor',
      'user-analysis': 'TrendCharts',
      'traffic-analysis': 'TrendCharts'
    },
    'system-admin': {
      'system-config': 'Setting',
      'backup': 'Upload',
      'log': 'Document'
    },
    'message-admin': {
      'message-list': 'ChatDotRound',
      'template': 'Document',
      'email': 'Message'
    }
  },
  logs: {
    'domain': 'List',
    'login-log': 'UserFilled'
  },
  files: {
    'system-admin': {
      'system-config': {
        'index2': 'Setting'
      }
    }
  }
}

// 辅助函数：获取模块标题
function getModuleTitle(moduleName, subModule) {
  return subModule.replace(/-/g, ' ')
}

// 辅助函数：获取模块图标
function getModuleIcon(moduleName, subModule) {
  return ICON_MAPS.modules[moduleName]?.[subModule] || 'Document'
}

// 辅助函数：获取文件标题
function getFileTitle(moduleName, subModule, fileName) {
  if (fileName) {
    return formatFileName(fileName)
  }
  return formatFileName(subModule)
}

// 辅助函数：获取文件图标
function getFileIcon(moduleName, subModule, fileName) {
  if (fileName) {
    return ICON_MAPS.files[moduleName]?.[subModule]?.[fileName] || 
           getModuleIcon(moduleName, subModule)
  }
  return ICON_MAPS.files[moduleName]?.[fileName] || 'Document'
}

// 辅助函数：获取嵌套文件标题
function getNestedFileTitle(moduleName, pathSegments, fileName) {
  return formatFileName(fileName)
}

// 辅助函数：获取嵌套文件图标
function getNestedFileIcon(moduleName, pathSegments, fileName) {
  const lastSegment = pathSegments[pathSegments.length - 1]
  
  if (moduleName === 'system-admin' && pathSegments[0] === 'SysMgetModule') {
    return getLogModuleIcon(lastSegment)
  }
  
  let currentMap = ICON_MAPS.files[moduleName]
  if (currentMap) {
    for (const segment of pathSegments) {
      if (currentMap[segment]) {
        currentMap = currentMap[segment]
      } else {
        currentMap = null
        break
      }
    }
    
    if (currentMap && currentMap[fileName]) {
      return currentMap[fileName]
    }
  }
  
  return getNestedModuleIcon(moduleName, pathSegments)
}

// 辅助函数：格式化文件名为标题
function formatFileName(fileName) {
  if (fileName.startsWith('index')) {
    const suffix = fileName.substring(5)
    return suffix ? `页面${suffix}` : ''
  }
  
  return fileName.replace(/-/g, ' ').split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// 辅助函数：获取嵌套模块的标题
function getNestedModuleTitle(moduleName, pathSegments) {
  const lastSegment = pathSegments[pathSegments.length - 1]
  return lastSegment.replace(/-/g, ' ').split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// 辅助函数：获取嵌套模块的图标
function getNestedModuleIcon(moduleName, pathSegments) {
  return 'Document'
}

// 辅助函数：获取日志模块图标
function getLogModuleIcon(subModule) {
  return ICON_MAPS.logs[subModule] || 'Document'
}

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...baseRoutes, ...generateDashboardRoutes(), ...errorRoutes],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 延迟加载pinia store以避免循环依赖
let userStore = null
let menuStore = null

const setupStores = async () => {
  if (!userStore || !menuStore) {
    // 延迟导入pinia store
    const { useUserStore, useMenuStore } = await import('../stores')
    const pinia = (await import('../stores')).default
    userStore = useUserStore(pinia)
    menuStore = useMenuStore(pinia)
  }
  return { userStore, menuStore }
}

// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  // 开始显示进度条
  NProgress.start()
  
  // 添加详细日志
  if (import.meta.env.DEV) {
    logRouteInfo('路由导航请求', to, { from: from.path })
  }
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - ${ROUTE_CONFIG.META.TITLE}` : ROUTE_CONFIG.META.TITLE

  // 白名单页面直接通过
  if (WHITE_LIST.includes(to.path)) {
    if (import.meta.env.DEV) console.log('✅ 白名单路径，直接通过:', to.path)
    return next()
  }

  // 延迟获取store
  const { userStore, menuStore } = await setupStores()

  // 判断是否已登录
  const hasToken = userStore.token

  // 未登录，跳转到登录页面
  if (!hasToken) {
    ElMessage.warning('请先登录')
    return next(`/login?redirect=${to.path}`)
  }

  // 系统首页白名单，登录后可直接访问
  if (SYSTEM_HOME_WHITELIST.includes(to.path)) {
    if (import.meta.env.DEV) console.log('✅ 系统首页白名单，直接通过:', to.path)
    return next()
  }
  
  // 直接处理system-admin的index.vue的情况
  if (to.path === '/dashboard/system-admin' || to.path === '/dashboard/system-admin/index' || to.path === '/dashboard/system-admin/') {
    if (import.meta.env.DEV) console.log('✅ system-admin首页特殊处理，直接通过:', to.path)
    return next()
  }

  // 已登录 - 获取菜单数据并添加路由
  if (!menuStore.menuData.length) {
    try {
      if (import.meta.env.DEV) console.log('🔄 加载菜单数据...')
      // 加载菜单数据
      await menuStore.fetchMenuData()
      
      // 生成并添加路由 - 将router传入
      menuStore.generateRoutes(menuStore.menuData, router)
      
      if (import.meta.env.DEV) console.log('✅ 菜单数据加载完成，重新导航:', to.path)
      // 确保路由已加载完成，重新导航到目标页面
      next({ ...to, replace: true })
      NProgress.done()
    } catch (error) {
      console.error('❌ 加载菜单数据失败:', error)
      // 出错时，清空token并跳转到登录页
      userStore.resetState()
      ElMessage.error('获取权限信息失败，请重新登录')
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  } else {
    // 菜单数据已存在 - 进行权限验证
    const hasPermission = menuStore.hasRoutePermission(to.path, router)
    
    if (import.meta.env.DEV) {
      console.log(`🔐 权限检查 ${to.path}: ${hasPermission ? '有权限' : '无权限'}`)
    }
    
    if (hasPermission) {
      // 有权限访问
      next()
    } else {
      // 检查是否存在该路由
      const isRouteExists = router.hasRoute(to.name) || 
                          router.getRoutes().some(route => route.path === to.path);
      
      if (import.meta.env.DEV) {
        console.log(`🧭 路由存在检查 ${to.path}: ${isRouteExists ? '存在' : '不存在'}`)
      }
      
      if (isRouteExists) {
        // 检查是否是特殊处理的复合路径系统页面
        const pathParts = to.path.split('/')
        if (pathParts.length >= 5 && 
            pathParts[1] === 'dashboard' && 
            pathParts[2] === 'system-admin' && 
            pathParts[3] === 'system-mgmt') {
          
          // 特殊处理system-admin/system-mgmt下的页面
          const pageName = pathParts[4]
          
          // 从menuStore中获取菜单数据
          const menuData = menuStore.menuData
          if (menuData && menuData.length > 0) {
            // 查找system-admin/system-mgmt菜单
            const systemMenu = menuData.find(menu => 
              menu.path && menu.path.toLowerCase() === 'system-admin/system-mgmt'
            )
            
            if (systemMenu && systemMenu.menuChildList) {
              // 检查是否有对应子页面的权限
              const hasPagePermission = systemMenu.menuChildList.some(child => {
                if (child.path) {
                  const childPath = child.path.toLowerCase()
                  return childPath === `${pageName}.vue` || childPath === pageName
                }
                return false
              })
              
              if (hasPagePermission) {
                if (import.meta.env.DEV) {
                  console.log(`✅ 特殊处理: 有权限访问子系统页面 ${to.path}`)
                }
                next()
                return
              }
            }
          }
        }
        
        // 路由存在但无权限访问
        if (import.meta.env.DEV) console.log('❌ 路由存在但无权限，跳转到403:', to.path)
        next('/403')
      } else if (to.path.startsWith('/dashboard/')) {
        // 尝试处理动态URL访问的系统子页面
        const pathParts = to.path.split('/')
        
        if (pathParts.length >= 4) {
          // 检查是否有访问此系统模块的权限
          const systemPath = `/${pathParts[1]}/${pathParts[2]}`
          
          // 验证系统路由和权限
          const systemRouteExists = router.getRoutes().some(route => route.path === systemPath)
          const hasSystemPermission = menuStore.hasSystemPermission(pathParts[2])
          
          if (import.meta.env.DEV) {
            console.log(`🔍 系统路径检查 ${systemPath}:`, { 
              systemRouteExists, 
              hasSystemPermission 
            })
          }
          
          if (systemRouteExists && hasSystemPermission) {
            // 允许访问系统下的页面，但记录警告日志
            console.warn('访问未在菜单中注册的页面:', to.path)
            next()
          } else {
            // 无系统访问权限
            if (import.meta.env.DEV) console.log('❌ 无系统访问权限，跳转到403:', to.path)
            next('/403')
          }
        } else {
          // 路径格式不正确
          if (import.meta.env.DEV) console.log('❌ 路径格式不正确，跳转到404:', to.path)
          next('/404')
        }
      } else {
        // 路由不存在
        if (import.meta.env.DEV) console.log('❌ 路由不存在，跳转到404:', to.path)
        next('/404')
      }
    }
  }
})

// 路由后置守卫
router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})

export default router