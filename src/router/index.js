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

// 基础路由配置
const routes = [
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
  // Layout布局路由
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    meta: { 
      [ROUTE_CONFIG.META.AUTH]: true 
    },
    children: [
      // 默认首页
      {
        path: 'index',
        name: 'DashboardIndex',
        component: () => import('../views/index.vue'),
        meta: { 
          title: '系统首页', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      },
      // 系統基本管理相关路由
      {
        path: 'basic-systemmgmt',
        name: 'BasicSystemMgmt',
        component: () => import('../views/basic-systemmgmt/index.vue'),
        meta: { 
          title: '系統基本管理', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      },
      // 基本資料模組
      {
        path: 'basic-systemmgmt/system-basic',
        name: 'SystemBasic',
        redirect: '',
        meta: { 
          title: '基本資料模組', 
          [ROUTE_CONFIG.META.AUTH]: true
        }
      },
      // 公司资料维护
      {
        path: 'basic-systemmgmt/system-basic/commpany',
        name: 'SystemBasicCompany',
        component: () => import('../views/basic-systemmgmt/system-basic/commpany.vue'),
        meta: { 
          title: '公司資料維護', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      },
      // 系统管理模块
      {
        path: 'basic-systemmgmt/system-mgmt',
        name: 'SystemMgmt',
        redirect: '/basic-systemmgmt/system-mgmt',
        meta: { 
          title: '系統管理模組', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      },
      // 域名管理页面
      {
        path: 'basic-systemmgmt/system-mgmt/domain',
        name: 'SystemMgmtDomain',
        component: () => import('../views/basic-systemmgmt/system-mgmt/domain.vue'),
        meta: { 
          title: '網域資料維護', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      },
      // 模块管理页面
      {
        path: 'basic-systemmgmt/system-mgmt/module',
        name: 'SystemMgmtModule',
        component: () => import('../views/basic-systemmgmt/system-mgmt/module.vue'),
        meta: { 
          title: '模塊資料維護', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      },
      // 程序管理页面
      {
        path: 'basic-systemmgmt/system-mgmt/program',
        name: 'SystemMgmtProgram',
        component: () => import('../views/basic-systemmgmt/system-mgmt/program.vue'),
        meta: { 
          title: '程式資料維護', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      },
      // 角色管理页面
      {
        path: 'basic-systemmgmt/system-mgmt/role',
        name: 'SystemMgmtRole',
        component: () => import('../views/basic-systemmgmt/system-mgmt/role.vue'),
        meta: { 
          title: '角色資料維護', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      },
      // 角色網域資料維護
      {
        path: 'basic-systemmgmt/system-mgmt/roledomain',
        name: 'SystemMgmtRoleDomain',
        component: () => import('../views/basic-systemmgmt/system-mgmt/roledomain.vue'),
        meta: { 
          title: '角色網域綁定', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      },
      // 角色模塊資料維護
      {
        path: 'basic-systemmgmt/system-mgmt/rolemodule',
        name: 'SystemMgmtRoleModule',
        component: () => import('../views/basic-systemmgmt/system-mgmt/rolemodule.vue'),
        meta: { 
          title: '角色模組綁定', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      },
      // 角色程式資料維護
      {
        path: 'basic-systemmgmt/system-mgmt/roleprogram',
        name: 'SystemMgmtRoleProgram',
        component: () => import('../views/basic-systemmgmt/system-mgmt/roleprogram.vue'),
        meta: { 
          title: '角色程式綁定', 
          [ROUTE_CONFIG.META.AUTH]: true 
        }
      }
    ]
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

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

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
  
  // 继续导航
  next()
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