import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../layout/index.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

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
const asyncRoutes = [
  // Layout布局路由
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    meta: { 
      [ROUTE_CONFIG.META.AUTH]: true 
    },
    children: [
      // 为每个模块创建index路由
      {
        path: "eForm/index",
        name: "eForm",
        component: () => import('../views/eForm/index.vue'),
        meta: { 
          title: '表单管理', 
          [ROUTE_CONFIG.META.AUTH]: true,
          noTag: true // 标记不需要添加标签
        }
      },
      // 为每个模块创建index路由
      {
        path: "systemBasicmgmt/index",
        name: "SystemBasicMgmt",
        component: () => import('../views/systemBasicmgmt/index.vue'),
        meta: { 
          title: '系統基本管理', 
          [ROUTE_CONFIG.META.AUTH]: true,
          noTag: true // 标记不需要添加标签
        }
      },
      // 基本資料模組
      {
        path: '/SystemBasicmgmt/system-basic',
        name: 'SystemBasic',
        redirect: '',
        meta: { 
          title: '基本資料模組', 
          [ROUTE_CONFIG.META.AUTH]: true
        }
      },
      // 公司资料维护
      {
        path: 'systemBasicmgmt/system-basic/commpany',
        name: 'SystemBasicCompany',
        component: () => import('../views/systemBasicmgmt/system-basicdata/commpany.vue'),
        meta: { 
          title: '公司資料維護', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      },
      // 系统管理模块
      {
        path: '/systemBasicmgmt/system-mgmt',
        name: 'SystemMgmt',
        redirect: '',
        meta: { 
          title: '系統管理模組', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      },
      // 域名管理页面
      {
        path: 'systemBasicmgmt/system-mgmt/domain',
        name: 'SystemMgmtDomain',
        component: () => import('../views/systemBasicmgmt/system-mgmt/domain.vue'),
        meta: { 
          title: '網域資料維護', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      },
      // 模块管理页面
      {
        path: 'systemBasicmgmt/system-mgmt/module',
        name: 'SystemMgmtModule',
        component: () => import('../views/systemBasicmgmt/system-mgmt/module.vue'),
        meta: { 
          title: '模塊資料維護', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      },
      // 程序管理页面
      {
        path: 'systemBasicmgmt/system-mgmt/program',
        name: 'SystemMgmtProgram',
        component: () => import('../views/systemBasicmgmt/system-mgmt/program.vue'),
        meta: { 
          title: '程式資料維護', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      },
      // 角色管理页面
      {
        path: 'systemBasicmgmt/system-mgmt/role',
        name: 'SystemMgmtRole',
        component: () => import('../views/systemBasicmgmt/system-mgmt/role.vue'),
        meta: { 
          title: '角色資料維護', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      },
      // 角色網域資料維護
      {
        path: 'systemBasicmgmt/system-mgmt/roledomain',
        name: 'SystemMgmtRoleDomain',
        component: () => import('../views/systemBasicmgmt/system-mgmt/roledomain.vue'),
        meta: { 
          title: '角色網域綁定', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      },
      // 角色模塊資料維護
      {
        path: 'systemBasicmgmt/system-mgmt/rolemodule',
        name: 'SystemMgmtRoleModule',
        component: () => import('../views/systemBasicmgmt/system-mgmt/rolemodule.vue'),
        meta: { 
          title: '角色模組綁定', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      },
      // 角色程式資料維護
      {
        path: 'systemBasicmgmt/system-mgmt/roleprogram',
        name: 'SystemMgmtRoleProgram',
        component: () => import('../views/systemBasicmgmt/system-mgmt/roleprogram.vue'),
        meta: { 
          title: '角色程式綁定', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      }
    ]
  }
]

// 创建路由实例，初始只包含基础路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 动态添加路由的方法
export function addRoutes() {
  asyncRoutes.forEach(route => {
    router.addRoute(route)
  })
}

// 重置路由
export function resetRouter() {
  // 移除所有动态添加的路由
  asyncRoutes.forEach(route => {
    if (route.name) {
      router.removeRoute(route.name)
    }
  })
}

// 设置路由守卫以设置页面标题和进度条
router.beforeEach((to, from, next) => {
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
        // 重新添加动态路由
        addRoutes()
        // 如果是以/index结尾的路径，可能是模块首页
        if (to.path.endsWith('/index')) {
          // 重定向到相同的路由，此时路由已经被重新添加
          return next({ ...to, replace: true })
        }
        // 对于其他路径，也重新导航
        return next({ ...to, replace: true })
      }
      
      // 处理模块index页面的访问
      const path = to.path
      if (path.includes('/index')) {
        // 如果是模块的index页面，直接放行
        next()
        return
      }
      next()
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

export default router