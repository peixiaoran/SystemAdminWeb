import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { vSafeHtml } from './utils/xssUtils'

// 设置固定标题
document.title = 'SystemsAdmin管理系统'

// 创建应用实例
const app = createApp(App)

// 基础插件注册
app.use(createPinia())
app.use(router)
app.use(ElementPlus, { size: 'default', zIndex: 3000 })

// 注册全局指令
app.directive('safe-html', vSafeHtml)

// 导入所有图标并注册
// 放到最后避免循环依赖问题
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 挂载应用
app.mount('#app') 