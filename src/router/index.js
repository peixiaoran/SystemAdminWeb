import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../layout/index.vue'
import { ElMessage } from 'element-plus'

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
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    ...baseRoutes,
    ...generateDashboardRoutes(),
    ...errorRoutes
  ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查是否需要登录权限
  if (to.meta[ROUTE_CONFIG.META.AUTH] && !localStorage.getItem('token')) {
    next(ROUTE_CONFIG.BASE.LOGIN)
  } else {
    next()
  }
})

export default router