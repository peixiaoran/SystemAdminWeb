import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../views/layout/index.vue'
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
  {
    path: '/unlock',
    name: 'Unlock',
    component: () => import('../views/unlock/index.vue'),
    meta: { title: 'route.unlock' }
  },
  {
    path: '/password-expiration',
    name: 'PasswordExpiration',
    component: () => import('../views/password-expiration/index.vue'),
    meta: { title: 'route.passwordExpiration' }
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
const pmenuRoutes = [
  // 系统基础管理模块路由
  {
    path: '/systembasicmgmt',
    component: Layout,
    redirect: '/systembasicmgmt/index',
    children: [
      {
        path: 'index',
        name: 'SystemBasicMgmtIndex',
        component: () => import('../views/systembasicmgmt/index.vue'),
        meta: { 
          title: 'route.systembasicmgmt',
          icon: 'Setting',
          [ROUTE_CONFIG.META.AUTH]: true,
          noTag: true
        }
      },
      // 系统管理子模块 - 使用嵌套结构
      {
        path: 'system-mgmt',
        name: 'System-Mgmt',
        redirect: '/systembasicmgmt/system-mgmt',
        meta: { 
          title: 'route.systemMgmt', 
          icon: 'Setting',
          [ROUTE_CONFIG.META.AUTH]: true,
          noTag: true
        },
        children: [
          {
            path: 'role',
            name: 'Role',
            component: () => import('../views/systembasicmgmt/system-mgmt/role.vue'),
            meta: { 
              title: 'route.role',
              icon: 'Avatar',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'module',
            name: 'Module',
            component: () => import('../views/systembasicmgmt/system-mgmt/module.vue'),
            meta: { 
              title: 'route.module', 
              icon: 'Menu',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'pmenu',
            name: 'PMenu',
            component: () => import('../views/systembasicmgmt/system-mgmt/pmenu.vue'),
            meta: { 
              title: 'route.pmenu', 
              icon: 'Operation',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'smenu',
            name: 'SMenu',
            component: () => import('../views/systembasicmgmt/system-mgmt/smenu.vue'),
            meta: { 
              title: 'route.smenu', 
              icon: 'Share',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          }
        ]
      },
      // 基础数据管理子模块 - 使用嵌套结构
      {
        path: 'system-basicdata',
        name: 'System-BasicData',
        redirect: '/systembasicmgmt/system-basicdata',
        meta: { 
          title: 'route.systemBasicData',
          icon: 'List',
          [ROUTE_CONFIG.META.AUTH]: true,
          noTag: true
        },
        children: [

          {
            path: 'departmentinfo',
            name: 'DepartmentInfo',
            component: () => import('../views/systembasicmgmt/system-basicdata/departmentinfo.vue'),
            meta: { 
              title: 'route.departmentInfo', 
              icon: 'School',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'departmentlevel',
            name: 'DepartmentLevel',
            component: () => import('../views/systembasicmgmt/system-basicdata/departmentlevel.vue'),
            meta: { 
              title: 'route.departmentLevel', 
              icon: 'CollectionTag',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'userposition',
            name: 'UserPosition',
            component: () => import('../views/systembasicmgmt/system-basicdata/userposition.vue'),
            meta: { 
              title: 'route.userposition', 
              icon: 'GoldMedal',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'nationality',
            name: 'Nationality',
            component: () => import('../views/systembasicmgmt/system-basicdata/nationality.vue'),
            meta: { 
              title: 'route.nationality', 
              icon: 'DeleteLocation',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'userlabor',
            name: 'UserLabor',
            component: () => import('../views/systembasicmgmt/system-basicdata/userlabor.vue'),
            meta: { 
              title: 'route.userlabor', 
              icon: 'Postcard',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'userinfo',
            name: 'UserInfo',
            component: () => import('../views/systembasicmgmt/system-basicdata/userinfo.vue'),
            meta: { 
              title: 'route.userinfo', 
              icon: 'UserFilled',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'personal',
            name: 'Personal',
            component: () => import('../views/systembasicmgmt/system-basicdata/personal.vue'),
            meta: { 
              title: 'route.personalinfo', 
              icon: 'User',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          }
        ]
      },
      // 用户配置子模块 - 使用嵌套结构
      {
        path: 'system-userconfig',
        name: 'System-UserConfig',
        redirect: '/systembasicmgmt/system-userconfig',
        meta: { 
          title: 'route.userconfig',
          icon: 'SetUp',
          [ROUTE_CONFIG.META.AUTH]: true,
          noTag: true
        },
        children: [
          {
            path: 'useragent',
            name: 'UserAgent',
            component: () => import('../views/systembasicmgmt/system-userconfig/useragent.vue'),
            meta: { 
              title: 'route.useragent', 
              icon: 'Handbag',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'userparttime',
            name: 'UserPartTime',
            component: () => import('../views/systembasicmgmt/system-userconfig/userparttime.vue'),
            meta: { 
              title: 'route.userparttime', 
              icon: 'ShoppingBag',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            },
          },
          {
            path: 'userformbind',
            name: 'UserFormBind',
            component: () => import('../views/systembasicmgmt/system-userconfig/userformbind.vue'),
            meta: { 
              title: 'route.userformbind', 
              icon: 'Management',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            },
          }
        ]
      },
      // 基础数据管理子模块 - 使用嵌套结构
      {
        path: 'system-settings',
        name: 'System-Settings',
        redirect: '/systembasicmgmt/system-settings',
        meta: { 
          title: 'route.settings',
          icon: 'Setting',
          [ROUTE_CONFIG.META.AUTH]: true,
          noTag: true
        },
        children: [
          {
            path: 'dictionaryinfo',
            name: 'DictionaryInfo',
            component: () => import('../views/systembasicmgmt/system-settings/dictionaryinfo.vue'),
            meta: { 
              title: 'route.dictionaryinfo', 
              icon: 'Reading',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'currencyinfo',
            name: 'CurrencyInfo',
            component: () => import('../views/systembasicmgmt/system-settings/currencyinfo.vue'),
            meta: { 
              title: 'route.currencyinfo', 
              icon: 'Money',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'exchangerate',
            name: 'ExchangeRate',
            component: () => import('../views/systembasicmgmt/system-settings/exchangerate.vue'),
            meta: { 
              title: 'route.exchangerate', 
              icon: 'Switch',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          },
          {
            path: 'userloginlog',
            name: 'UserLoginLog',
            component: () => import('../views/systembasicmgmt/system-settings/userloginlog.vue'),
            meta: { 
              title: 'route.userloginlog', 
              icon: 'Tickets',
              [ROUTE_CONFIG.META.AUTH]: true,
              noTag: false
            }
          }
        ]
      },
    ]
  },
  {
      path: '/formbusiness',
      component: Layout,
      redirect: '/formbusiness/index',
      children: [
        {
          path: 'index',
          name: 'FormBusiness',
          component: () => import('../views/formbusiness/index.vue'),
          meta: { 
            title: 'route.formbusiness', 
            icon: 'Notebook',
            [ROUTE_CONFIG.META.AUTH]: true,
            noTag: true
          }
        },
        // 表单基础信息子模块 - 使用嵌套结构
        {
          path: 'form-basicinfo',
          name: 'FormBasicInfo',
          redirect: '/formbusiness/form-basicinfo',
          meta: { 
            title: 'route.formbasicinfo',
            icon: 'Tickets',
            [ROUTE_CONFIG.META.AUTH]: true,
            noTag: true
          },
          children: [
            {
              path: 'formgroup',
              name: 'FormGroup',
              component: () => import('../views/formbusiness/form-basicinfo/formgroup.vue'),
              meta: { 
                title: 'route.formGroup', 
                icon: 'Collection',
                [ROUTE_CONFIG.META.AUTH]: true,
                noTag: false
              }
            },
            {
              path: 'formtype',
              name: 'FormType',
              component: () => import('../views/formbusiness/form-basicinfo/formtype.vue'),
              meta: { 
                title: 'route.formType', 
                icon: 'Postcard',
                [ROUTE_CONFIG.META.AUTH]: true,
                noTag: false
              }
            },
          ]
        }
      ]
  },
  {
      path: '/custmat',
      component: Layout,
      redirect: '/custmat/index',
      children: [
        {
          path: 'index',
          name: 'CustMat',
          component: () => import('../views/custmat/index.vue'),
          meta: { 
            title: 'route.custmat', 
            icon: 'Notebook',
            [ROUTE_CONFIG.META.AUTH]: true,
            noTag: true
          }
        },
        // 表单基础信息子模块 - 使用嵌套结构
        {
          path: 'custmat-basicinfo',
          name: 'CustMatBasicInfo',
          redirect: '/custmat/custmat-basicinfo',
          meta: { 
            title: 'route.custmatbasicinfo',
            icon: 'Tickets',
            [ROUTE_CONFIG.META.AUTH]: true,
            noTag: true
          },
          children: [
            {
              path: 'customerinfo',
              name: 'CustomerInfo',
              component: () => import('../views/custmat/custmat-basicinfo/customerinfo.vue'),
              meta: { 
                title: 'route.custmatCustomer', 
                icon: 'Collection',
                [ROUTE_CONFIG.META.AUTH]: true,
                noTag: false
              }
            },
          ]
        }
      ]
  }
]

// 创建路由实例，合并所有路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...constantRoutes, ...pmenuRoutes],
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
      localStorage.removeItem('currentModuleId')
      localStorage.removeItem('currentModuleName')
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
export { ROUTE_CONFIG, constantRoutes, pmenuRoutes }

// 导出路由实例
export default router