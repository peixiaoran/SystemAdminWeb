import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router, { addDynamicRoutes } from './router'
import './assets/main.css'
import pinia from './stores'
import i18n from './i18n'

// 获取存储的语言
const language = localStorage.getItem('language') || 'zh-CN'

// 创建应用实例
const app = createApp(App)

// 基础插件注册
app.use(pinia)
app.use(router)
app.use(i18n) // 先注册i18n
app.use(ElementPlus, { size: 'default', zIndex: 3000 })

// 导入所有图标并注册
// 放到最后避免循环依赖问题
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 根据当前语言设置标题 - 确保在i18n初始化后调用
const setDocumentTitle = () => {
  const title = i18n.global.t('common.systemTitle')
  document.title = title
}

// 检查用户是否已登录，如果已登录则添加动态路由
const token = localStorage.getItem('token')
if (token) {
  // 使用最简单的方式加载路由，避免任何复杂的嵌套
  console.log('检测到用户已登录，开始加载动态路由')
  addDynamicRoutes()
    .then(success => {
      if (success) {
        console.log('动态路由加载成功')
      } else {
        console.warn('动态路由加载失败，使用静态路由')
      }
    })
    .catch(error => {
      console.error('路由加载出错:', error)
    })
}

// 设置标题 - 确保在i18n初始化后调用
setDocumentTitle()

// 挂载应用
app.mount('#app') 