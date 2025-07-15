import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../layout/index.vue'
import i18n from '../i18n'

// 获取翻译函数
const { t } = i18n.global

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
    TITLE: t('common.systemTitle'),
    AUTH: 'requiresAuth'
  }
}

// 定义基础路由 - 这些路由在登录前就可以访问
const constantRoutes = [
  {
    path: ROUTE_CONFIG.BASE.LOGIN,
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    meta: { title: 'route.login' }
  },
  {
    path: ROUTE_CONFIG.BASE.HOME,
    name: 'ModuleSelect',
    component: () => import('../views/module-select/index.vue'),
    meta: { 
      title: 'route.moduleSelect', 
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
    component: () => import('../views/error/403.vue'),
    meta: { title: 'route.forbidden' }
  },
  {
    path: ROUTE_CONFIG.BASE.ERROR_404,
    name: 'NotFound',
    component: () => import('../views/error/404.vue'),
    meta: { title: 'route.notFound' }
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
    path: '/SystemBasicMgmt',
    component: Layout,
    redirect: '/SystemBasicMgmt/index',
    children: [
      {
        path: 'index',
        name: 'SystemBasicMgmtIndex',
        component: () => import('../views/SystemBasicMgmt/index.vue'),
        meta: { 
          title: 'route.SystemBasicMgmt', 
          icon: 'Setting',
          [ROUTE_CONFIG.META.AUTH]: true,
          noTag: true
        }
      },
      // 系统管理子模块 - 使用嵌套结构
      {
        path: 'system-mgmt',
        name: 'SystemMgmt',
        redirect: '/SystemBasicMgmt/system-mgmt',
        meta: { 
          title: 'route.systemMgmt', 
          icon: 'Setting',
          [ROUTE_CONFIG.META.AUTH]: true,
          noTag: true
        },
        children: [
          {
            path: 'role',
            name: 'SystemRole',
            component: () => import('../views/SystemBasicMgmt/system-mgmt/role.vue'),
            meta: { 
              title: 'route.role', 
              icon: 'Avatar',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'domain',
            name: 'SystemDomain',
            component: () => import('../views/SystemBasicMgmt/system-mgmt/domain.vue'),
            meta: { 
              title: 'route.domain', 
              icon: 'Menu',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'module',
            name: 'SystemModule',
            component: () => import('../views/SystemBasicMgmt/system-mgmt/module.vue'),
            meta: { 
              title: 'route.module', 
              icon: 'Operation',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'program',
            name: 'SystemProgram',
            component: () => import('../views/SystemBasicMgmt/system-mgmt/program.vue'),
            meta: { 
              title: 'route.program', 
              icon: 'Share',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'roledomain',
            name: 'SystemRoleDomain',
            component: () => import('../views/SystemBasicMgmt/system-mgmt/roledomain.vue'),
            meta: { 
              title: 'route.roleDomain', 
              icon: 'MoreFilled',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'rolemodule',
            name: 'SystemRoleModule',
            component: () => import('../views/SystemBasicMgmt/system-mgmt/rolemodule.vue'),
            meta: { 
              title: 'route.roleModule', 
              icon: 'MoreFilled',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'roleprogram',
            name: 'SystemRoleProgram',
            component: () => import('../views/SystemBasicMgmt/system-mgmt/roleprogram.vue'),
            meta: { 
              title: 'route.roleProgram', 
              icon: 'MoreFilled',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'personal',
            name: 'SystemPersonalInfo',
            component: () => import('../views/SystemBasicMgmt/system-mgmt/personal.vue'),
            meta: { 
              title: 'route.personalInfo', 
              icon: 'User',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          }
        ]
      },
      // 基础数据管理子模块 - 使用嵌套结构
      {
        path: 'system-basicdata',
        name: 'SystemBasicData',
        redirect: '/SystemBasicMgmt/system-basicdata',
        meta: { 
          title: 'route.systemBasicData',
          icon: 'List',
          [ROUTE_CONFIG.META.AUTH]: true,
          noTag: true
        },
        children: [
          {
            path: 'companyinfo',
            name: 'SystemCompanyInfo',
            component: () => import('../views/SystemBasicMgmt/system-basicdata/companyinfo.vue'),
            meta: { 
              title: 'route.companyInfo', 
              icon: 'OfficeBuilding',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'departmentinfo',
            name: 'SystemDepartmentInfo',
            component: () => import('../views/SystemBasicMgmt/system-basicdata/departmentinfo.vue'),
            meta: { 
              title: 'route.departmentInfo', 
              icon: 'School',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'departmentlevel',
            name: 'SystemDepartmentLevel',
            component: () => import('../views/SystemBasicMgmt/system-basicdata/departmentlevel.vue'),
            meta: { 
              title: 'route.departmentLevel', 
              icon: 'GoldMedal',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'userposition',
            name: 'SystemUserPosition',
            component: () => import('../views/SystemBasicMgmt/system-basicdata/userposition.vue'),
            meta: { 
              title: 'route.userPosition', 
              icon: 'GoldMedal',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'userinfo',
            name: 'SystemUserInfo',
            component: () => import('../views/SystemBasicMgmt/system-basicdata/userinfo.vue'),
            meta: { 
              title: 'route.userInfo', 
              icon: 'UserFilled',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'useragent',
            name: 'SystemUseragent',
            component: () => import('../views/SystemBasicMgmt/system-basicdata/useragent.vue'),
            meta: { 
              title: 'route.userAgent', 
              icon: 'GoodsFilled',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          }
        ]
      },
      // 基础数据管理子模块 - 使用嵌套结构
      {
        path: 'system-settings',
        name: 'SystemSettings',
        redirect: '/SystemBasicMgmt/system-settings',
        meta: { 
          title: 'route.systemSettings',
          icon: 'Setting',
          [ROUTE_CONFIG.META.AUTH]: true,
          noTag: true
        },
        children: [
          {
            path: 'dictionaryinfo',
            name: 'DictionaryInfo',
            component: () => import('../views/SystemBasicMgmt/system-settings/dictionaryinfo.vue'),
            meta: { 
              title: 'route.dictionaryInfo', 
              icon: 'Collection',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'currencyinfo',
            name: 'CurrencyInfo',
            component: () => import('../views/SystemBasicMgmt/system-settings/currencyinfo.vue'),
            meta: { 
              title: 'route.currencyInfo', 
              icon: 'Money',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'exchangerateInfo',
            name: 'exchangerateInfo',
            component: () => import('../views/SystemBasicMgmt/system-settings/exchangerateInfo.vue'),
            meta: { 
              title: 'route.exchangerateInfo', 
              icon: 'Switch',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
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
  const translatedTitle = to.meta.title ? t(to.meta.title) : '';
  document.title = translatedTitle ? `${translatedTitle} - ${t('common.systemTitle')}` : t('common.systemTitle');
  
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