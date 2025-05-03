import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../layout/index.vue'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置NProgress
NProgress.configure({ 
  easing: 'ease',
  speed: 500,
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3,
  parent: 'body' // 确保进度条添加到body元素
})

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
    // 移除所有console.log语句
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
  
  // 判断是否是相同系统内的菜单跳转（无需重新获取菜单数据）
  const isSameSystemNavigation = () => {
    // 如果源路径和目标路径都是dashboard下的路径
    if (from.path.startsWith('/dashboard/') && to.path.startsWith('/dashboard/')) {
      const fromParts = from.path.split('/');
      const toParts = to.path.split('/');
      
      // 检查系统部分是否相同 (例如：都是 system-admin)
      if (fromParts.length >= 3 && toParts.length >= 3 && fromParts[2] === toParts[2]) {
        return true;
      }
    }
    return false;
  };
  
  // 设置页面标题 - 始终使用固定标题
  document.title = ROUTE_CONFIG.META.TITLE;

  // 白名单页面直接通过
  if (WHITE_LIST.includes(to.path)) {
    next()
    return
  }

  // 延迟获取store
  const { userStore, menuStore } = await setupStores()

  // 判断是否已登录
  const hasToken = userStore.token

  // 未登录，跳转到登录页面
  if (!hasToken) {
    ElMessage.warning('请先登录')
    next(`/login?redirect=${to.path}`)
    return
  }

  // 系统首页白名单，登录后可直接访问
  if (SYSTEM_HOME_WHITELIST.includes(to.path)) {
    next()
    return
  }
  
  // 直接处理system-admin的index.vue的情况
  if (to.path === '/dashboard/system-admin' || to.path === '/dashboard/system-admin/index' || to.path === '/dashboard/system-admin/') {
    next()
    return
  }

  // 检查是否已经有菜单数据且是系统内导航
  const skipMenuReload = menuStore.hasPermission && isSameSystemNavigation();
  
  // 如果需要跳过菜单重载，直接进行权限检查
  if (skipMenuReload) {
    const hasPermission = menuStore.hasRoutePermission(to.path, router);
    
    if (hasPermission) {
      next();
      return;
    }
    
    // 无权限时，检查是否是复合路径
    if (to.path.includes('/dashboard/') && to.path.split('/').length >= 5) {
      const pathParts = to.path.split('/');
      const fullPath = `${pathParts[2]}/${pathParts[3]}`;
      const pageName = pathParts[4];
      
      // 检查是否有此页面权限
      const hasPagePermission = menuStore.checkSubSystemPagePermission(pathParts);
      
      if (hasPagePermission) {
        next();
        return;
      }
    }
    
    // 无权限时，返回403
    next('/403');
    return;
  }

  // 已登录 - 获取菜单数据并添加路由
  // 强制每次都重新获取菜单数据
  try {
    // 加载菜单数据
    await menuStore.fetchMenuData()
    
    // 生成并添加路由 - 将router传入
    menuStore.generateRoutes(menuStore.menuData, router)
    
    // 进行权限验证
    const hasPermission = menuStore.hasRoutePermission(to.path, router)
    
    if (hasPermission) {
      // 有权限访问
      next()
    } else {
      // 检查是否存在该路由
      const isRouteExists = router.hasRoute(to.name) || 
                           router.getRoutes().some(route => route.path === to.path);
      
      if (isRouteExists) {
        // 检查是否是特殊处理的复合路径系统页面
        const pathParts = to.path.split('/')
        if (pathParts.length >= 5 && 
            pathParts[1] === 'dashboard') {
          
          // 动态处理任意子系统下的页面
          const systemName = pathParts[2]     // 例如: system-admin
          const subSystemName = pathParts[3]  // 例如: system-mgmt
          const pageName = pathParts[4]       // 例如: program
          const fullPath = `${systemName}/${subSystemName}`
          
          // 从menuStore中获取菜单数据
          const menuData = menuStore.menuData
          if (menuData && menuData.length > 0) {
            // 查找匹配的子系统菜单
            const systemMenu = menuData.find(menu => 
              menu.path && menu.path.toLowerCase() === fullPath
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
                next()
                return
              }
            }
          }
        }
        
        // 路由存在但无权限访问
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
          
          if (systemRouteExists && hasSystemPermission) {
            // 允许访问系统下的页面
            next()
          } else {
            // 无系统访问权限
            next('/403')
          }
        } else {
          // 路径格式不正确
          next('/404')
        }
      } else {
        // 路由不存在
        next('/404')
      }
    }
  } catch (error) {
    // 出错时，清空token并跳转到登录页
    userStore.resetState()
    ElMessage.error('获取权限信息失败，请重新登录')
    next(`/login?redirect=${to.path}`)
    NProgress.done()
  }
})

// 路由后置守卫 - 确保在所有路由跳转完成时结束进度条
router.afterEach((to, from) => {
  // 结束进度条
  NProgress.done()
})

// 添加路由错误处理，确保在导航出错时也能结束进度条
router.onError((error) => {
  // 确保在导航出错时结束进度条
  NProgress.done()
})

export default router