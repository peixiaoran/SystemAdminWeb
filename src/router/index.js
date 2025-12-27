import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../views/layout/index.vue'
import i18n from '../i18n'
import { useUserStore } from '@/stores/user'

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
    // 错误页不加入标签（例如请求 403 跳转）
    meta: { title: 'route.forbidden', noTag: true }
  },
  {
    path: ROUTE_CONFIG.BASE.ERROR_404,
    name: 'NotFound',
    component: () => import('../views/error/404.vue'),
    // 错误页不加入标签（例如请求 404/路由未命中跳转）
    meta: { title: 'route.notFound', noTag: true }
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
            path: 'nationalityinfo',
            name: 'NationalityInfo',
            component: () => import('../views/systembasicmgmt/system-basicdata/nationalityinfo.vue'),
            meta: { 
              title: 'route.nationalityInfo', 
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
        path: 'user-settings',
        name: 'User-Settings',
        redirect: '/systembasicmgmt/user-settings',
        meta: { 
          title: 'route.userSettings',
          icon: 'SetUp',
          [ROUTE_CONFIG.META.AUTH]: true,
          noTag: true
        },
        children: [
          {
            path: 'useragent',
            name: 'UserAgent',
            component: () => import('../views/systembasicmgmt/user-settings/useragent.vue'),
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
            component: () => import('../views/systembasicmgmt/user-settings/userparttime.vue'),
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
            component: () => import('../views/systembasicmgmt/user-settings/userformbind.vue'),
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
        path: 'system-config',
        name: 'System-Config',
        redirect: '/systembasicmgmt/system-config',
        meta: { 
          title: 'route.systemConfig',
          icon: 'Setting',
          [ROUTE_CONFIG.META.AUTH]: true,
          noTag: true
        },
        children: [
          {
            path: 'dictionaryinfo',
            name: 'DictionaryInfo',
            component: () => import('../views/systembasicmgmt/system-config/dictionaryinfo.vue'),
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
            component: () => import('../views/systembasicmgmt/system-config/currencyinfo.vue'),
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
            component: () => import('../views/systembasicmgmt/system-config/exchangerate.vue'),
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
            component: () => import('../views/systembasicmgmt/system-config/userloginlog.vue'),
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
              path: 'controlInfo',
              name: 'ControlInfo',
              component: () => import('../views/formbusiness/form-basicinfo/controlinfo.vue'),
              meta: { 
                title: 'route.controlInfo', 
                icon: 'Link',
                [ROUTE_CONFIG.META.AUTH]: true,
                noTag: false
              }
            },
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
        },
         // 表单基础信息子模块 - 使用嵌套结构
        {
          path: 'form-operate',
          name: 'FormOperate',
          redirect: '/formbusiness/form-operate',
          meta: { 
            title: 'route.formoperate',
            icon: 'Notebook',
            [ROUTE_CONFIG.META.AUTH]: true,
            noTag: true
          },
          children: [
            {
              path: 'applyform',
              name: 'ApplyForm',
              component: () => import('../views/formbusiness/form-operate/applyform.vue'),
              meta: { 
                title: 'route.applyform', 
                icon: 'DocumentAdd',
                [ROUTE_CONFIG.META.AUTH]: true,
                noTag: false
              }
            }
          ]
        }
      ]
  },
  // 独立请假单申请页面（不使用Layout，无标签）
  {
    path: '/formbusiness/forms/leaveform/leaveform_r',
    name: 'LeaveFormR',
    component: () => import('../views/formbusiness/forms/leaveform/leaveform_r.vue'),
    meta: {
      title: 'route.leaveform_r',
      [ROUTE_CONFIG.META.AUTH]: true,
      noTag: true
    }
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
            icon: 'Promotion',
            [ROUTE_CONFIG.META.AUTH]: true,
            noTag: true
          },
          children: [
            {
              path: 'manufacturerinfo',
              name: 'ManufacturerInfo',
              component: () => import('../views/custmat/custmat-basicinfo/manufacturerinfo.vue'),
              meta: { 
                title: 'route.custmatManufacturer', 
                icon: 'Van',
                [ROUTE_CONFIG.META.AUTH]: true,
                noTag: false
              }
            },
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
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  const translatedTitle = to.meta.title ? t(to.meta.title) : '';
  document.title = translatedTitle ? `${translatedTitle} - ${t('common.systemTitle')}` : t('common.systemTitle');

  // 登录页：若 Cookie 会话仍有效，自动跳到首页
  if (to.path === ROUTE_CONFIG.BASE.LOGIN) {
    const userStore = useUserStore()
    const ok = await userStore.probeSession()
    if (ok) {
      // 企业标准：支持 login?redirect=xxx，已登录则直接回跳
      const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : ''
      if (redirect && redirect.startsWith('/')) {
        next({ path: redirect })
      } else {
      next({ path: ROUTE_CONFIG.BASE.HOME })
      }
      return
    }
  }
  
  // 检查是否需要登录权限
  if (to.meta.requiresAuth) {
    // Cookie 会话闭环：优先探活 /me，同步并校验会话有效性
    const userStore = useUserStore()
    const ok = await userStore.probeSession()
    if (!ok) {
      // 企业标准：未登录访问受保护页 => 跳登录，并携带回跳地址
      next({ path: ROUTE_CONFIG.BASE.LOGIN, query: { redirect: to.fullPath } })
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