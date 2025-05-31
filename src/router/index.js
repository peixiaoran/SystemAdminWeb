import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../layout/index.vue'
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
  // 通配符路由
  {
    path: '/:pathMatch(.*)*',
    redirect: ROUTE_CONFIG.BASE.ERROR_404
  }
]

// 定义模块路由 - 需要登录权限的业务模块路由
const moduleRoutes = [
  // 系统基础管理模块路由
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
      // 系统管理子模块 - 使用嵌套结构
      {
        path: 'system-mgmt',
        name: 'SystemMgmt',
        redirect: '/systemBasicmgmt/system-mgmt/role',
        meta: { 
          title: '系统管理', 
          icon: 'Setting',
          [ROUTE_CONFIG.META.AUTH]: true 
        },
        children: [
          {
            path: 'role',
            name: 'SystemRole',
            component: markRaw(() => import('../views/systemBasicmgmt/system-mgmt/role.vue')),
            meta: { 
              title: '角色管理', 
              icon: 'User',
              [ROUTE_CONFIG.META.AUTH]: true
            }
          },
          {
            path: 'domain',
            name: 'SystemDomain',
            component: markRaw(() => import('../views/systemBasicmgmt/system-mgmt/domain.vue')),
            meta: { 
              title: '领域管理', 
              icon: 'Menu',
              [ROUTE_CONFIG.META.AUTH]: true
            }
          },
          {
            path: 'module',
            name: 'SystemModule',
            component: markRaw(() => import('../views/systemBasicmgmt/system-mgmt/module.vue')),
            meta: { 
              title: '模块管理', 
              icon: 'Monitor',
              [ROUTE_CONFIG.META.AUTH]: true
            }
          },
          {
            path: 'program',
            name: 'SystemProgram',
            component: markRaw(() => import('../views/systemBasicmgmt/system-mgmt/program.vue')),
            meta: { 
              title: '程序管理', 
              icon: 'Document',
              [ROUTE_CONFIG.META.AUTH]: true
            }
          },
          {
            path: 'roledomain',
            name: 'SystemRoleDomain',
            component: markRaw(() => import('../views/systemBasicmgmt/system-mgmt/roledomain.vue')),
            meta: { 
              title: '角色领域关系', 
              icon: 'Connection',
              [ROUTE_CONFIG.META.AUTH]: true
            }
          },
          {
            path: 'rolemodule',
            name: 'SystemRoleModule',
            component: markRaw(() => import('../views/systemBasicmgmt/system-mgmt/rolemodule.vue')),
            meta: { 
              title: '角色模块关系', 
              icon: 'Connection',
              [ROUTE_CONFIG.META.AUTH]: true
            }
          },
          {
            path: 'roleprogram',
            name: 'SystemRoleProgram',
            component: markRaw(() => import('../views/systemBasicmgmt/system-mgmt/roleprogram.vue')),
            meta: { 
              title: '角色程序关系', 
              icon: 'Connection',
              [ROUTE_CONFIG.META.AUTH]: true
            }
          }
        ]
      },
      // 基础数据管理子模块 - 使用嵌套结构
      {
        path: 'system-basicdata',
        name: 'SystemBasicData',
        redirect: '/systemBasicmgmt/system-basicdata/userinfo',
        meta: { 
          title: '基础数据管理',
          icon: 'DataAnalysis',
          [ROUTE_CONFIG.META.AUTH]: true 
        },
        children: [
          {
            path: 'userinfo',
            name: 'SystemUserInfo',
            component: markRaw(() => import('../views/systemBasicmgmt/system-basicdata/userinfo.vue')),
            meta: { 
              title: '用户信息', 
              icon: 'UserFilled',
              [ROUTE_CONFIG.META.AUTH]: true
            }
          },
          {
            path: 'companyinfo',
            name: 'SystemCompanyInfo',
            component: markRaw(() => import('../views/systemBasicmgmt/system-basicdata/companyinfo.vue')),
            meta: { 
              title: '公司信息', 
              icon: 'Discount',
              [ROUTE_CONFIG.META.AUTH]: true
            }
          }
        ]
      }
    ]
  }
  // 可以继续添加其他模块的路由...
]

// 创建路由实例，合并所有路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...constantRoutes, ...moduleRoutes],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 设置路由守卫
router.beforeEach((to, from, next) => {
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

// 导出路由配置常量
export { ROUTE_CONFIG, constantRoutes, moduleRoutes }

// 导出路由实例
export default router