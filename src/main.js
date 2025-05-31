import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import pinia from './stores'
import i18n from './i18n'
import { updateRouteTitle } from './utils/updateRouteTitle'

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

// 检查用户是否已登录，如果已登录则添加动态路由
const token = localStorage.getItem('token')
if (token) {
  // 简单记录用户已登录状态，所有路由都已在router/index.js中静态定义
  console.log('检测到用户已登录')
}

// 等待路由就绪后初始化标题
router.isReady().then(() => {
  // 初始化标题
  updateRouteTitle()
  
  // 挂载应用
  app.mount('#app')
}) 