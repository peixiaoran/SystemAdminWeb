import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../layout/index.vue'
import { markRaw } from 'vue'
import { startProgress, endProgress } from '../plugins/nprogress'

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
  // 根路由重定向
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
  // 系统基础管理模块静态路由
  {
    path: '/systemBasicmgmt',
    component: Layout,
    redirect: '/systemBasicmgmt/index',
    children: [
      {
        path: 'index',
        name: 'SystemBasicmgmtIndex',
        component: markRaw(() => import('../views/systemBasicmgmt/index.vue')),
        meta: { 
          title: '系统基础管理', 
          icon: 'Setting',
          [ROUTE_CONFIG.META.AUTH]: true
        }
      },
      // 系统管理子路由
      {
        path: 'system-mgmt/role',
        name: 'SystemRole',
        component: markRaw(() => import('../views/systemBasicmgmt/system-mgmt/role.vue')),
        meta: { 
          title: '角色管理', 
          icon: 'User',
          [ROUTE_CONFIG.META.AUTH]: true
        }
      },
      {
        path: 'system-mgmt/domain',
        name: 'SystemDomain',
        component: markRaw(() => import('../views/systemBasicmgmt/system-mgmt/domain.vue')),
        meta: { 
          title: '领域管理', 
          icon: 'Folder',
          [ROUTE_CONFIG.META.AUTH]: true
        }
      },
      {
        path: 'system-mgmt/module',
        name: 'SystemModule',
        component: markRaw(() => import('../views/systemBasicmgmt/system-mgmt/module.vue')),
        meta: { 
          title: '模块管理', 
          icon: 'Monitor',
          [ROUTE_CONFIG.META.AUTH]: true
        }
      },
      {
        path: 'system-mgmt/program',
        name: 'SystemProgram',
        component: markRaw(() => import('../views/systemBasicmgmt/system-mgmt/program.vue')),
        meta: { 
          title: '程序管理', 
          icon: 'Document',
          [ROUTE_CONFIG.META.AUTH]: true
        }
      },
      {
        path: 'system-mgmt/roledomain',
        name: 'SystemRoleDomain',
        component: markRaw(() => import('../views/systemBasicmgmt/system-mgmt/roledomain.vue')),
        meta: { 
          title: '角色领域关系', 
          icon: 'Connection',
          [ROUTE_CONFIG.META.AUTH]: true
        }
      },
      {
        path: 'system-mgmt/rolemodule',
        name: 'SystemRoleModule',
        component: markRaw(() => import('../views/systemBasicmgmt/system-mgmt/rolemodule.vue')),
        meta: { 
          title: '角色模块关系', 
          icon: 'Connection',
          [ROUTE_CONFIG.META.AUTH]: true
        }
      },
      {
        path: 'system-mgmt/roleprogram',
        name: 'SystemRoleProgram',
        component: markRaw(() => import('../views/systemBasicmgmt/system-mgmt/roleprogram.vue')),
        meta: { 
          title: '角色程序关系', 
          icon: 'Connection',
          [ROUTE_CONFIG.META.AUTH]: true
        }
      },
      // 基础数据子路由
      {
        path: 'system-basicdata/userinfo',
        name: 'SystemUserInfo',
        component: markRaw(() => import('../views/systemBasicmgmt/system-basicdata/userinfo.vue')),
        meta: { 
          title: '用户信息', 
          icon: 'User',
          [ROUTE_CONFIG.META.AUTH]: true
        }
      },
      {
        path: 'system-basicdata/companyinfo',
        name: 'SystemCompanyInfo',
        component: markRaw(() => import('../views/systemBasicmgmt/system-basicdata/companyinfo.vue')),
        meta: { 
          title: '公司信息', 
          icon: 'Office',
          [ROUTE_CONFIG.META.AUTH]: true
        }
      }
    ]
  },
  // 通配符路由
  {
    path: '/:pathMatch(.*)*',
    redirect: ROUTE_CONFIG.BASE.ERROR_404
  }
]

// 创建路由实例，包含所有静态路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 设置路由守卫
router.beforeEach((to, from, next) => {
  // 开始进度条
  startProgress()
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - ${ROUTE_CONFIG.META.TITLE}` : ROUTE_CONFIG.META.TITLE
  
  // 检查是否需要登录权限
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    
    if (!token) {
      // 清除本地数据
      localStorage.removeItem('username')
      localStorage.removeItem('currentDomainId')
      localStorage.removeItem('currentSystemName')
      localStorage.removeItem('currentSystemPath')
      
      // 重定向到登录页
      next({ path: ROUTE_CONFIG.BASE.LOGIN })
      return
    }
  }
  
  // 继续导航
  next()
})

// 路由跳转完成后结束进度条
router.afterEach(() => {
  // 延迟结束进度条，确保加载时间足够
  setTimeout(() => {
    endProgress()
  }, 200)
})

// 路由错误时结束进度条
router.onError(() => {
  endProgress()
})

// 导出路由实例
export default router