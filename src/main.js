import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router, { addRoutes } from './router'
import './assets/main.css'
import pinia from './stores'
import NProgress from 'nprogress'

// 设置固定标题
document.title = 'SystemsAdmin管理系统'

// 监听页面刷新事件
window.addEventListener('beforeunload', () => {
  NProgress.start()
})

window.addEventListener('load', () => {
  // 确保页面加载完成后结束进度条
  setTimeout(() => {
    NProgress.done()
  }, 200) // 短暂延迟确保DOM完全加载
})

// 检查用户是否已登录，如果已登录则添加动态路由
const token = localStorage.getItem('token')
if (token) {
  // 初始化时添加动态路由
  addRoutes()
}

// 创建应用实例
const app = createApp(App)

// 基础插件注册
app.use(pinia)
app.use(router)
app.use(ElementPlus, { size: 'default', zIndex: 3000 })

// 导入所有图标并注册
// 放到最后避免循环依赖问题
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 挂载应用
app.mount('#app') 