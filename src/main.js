import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import pinia from './stores'
import i18n from './i18n'
import { updateRouteTitle } from './utils/updateRouteTitle'

// 获取存储的语言
const language = localStorage.getItem('language') || 'zh-CN'

// 根据语言设置Element Plus的locale
const getElementLocale = (lang) => {
  return lang === 'en-US' ? en : zhCn
}

// 创建应用实例
const app = createApp(App)

// 基础插件注册
app.use(pinia)
app.use(router)
app.use(i18n) // 先注册i18n
app.use(ElementPlus, { 
  size: 'default', 
  zIndex: 2200,
  locale: getElementLocale(language),
  // 全局配置所有对话框默认添加到 body
  namespace: 'el'
})

// 导入所有图标并注册
// 放到最后避免循环依赖问题
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局配置 Element Plus 组件默认属性
app.config.globalProperties.$ELEMENT = {
  size: 'default',
  zIndex: 2200,
  dialog: {
    appendToBody: true,
    destroyOnClose: false,
    closeOnClickModal: false,
    lockScroll: true,
    modal: true,
    modalAppendToBody: true
  }
}

// 等待路由就绪后初始化标题
router.isReady().then(() => {
  // 初始化标题
  updateRouteTitle()
  
  // 挂载应用
  app.mount('#app')
  
  // 优化的对话框处理 - 即时处理避免闪烁
  let dialogObserver = null
  
  // 创建一个高效且即时的对话框处理函数
  const handleDialogElements = () => {
    const dialogWrappers = document.querySelectorAll('.el-dialog__wrapper')
    const overlays = document.querySelectorAll('.el-overlay')
    
    dialogWrappers.forEach((wrapper) => {
      if (wrapper.parentNode !== document.body) {
        document.body.appendChild(wrapper)
      }
    })
    
    overlays.forEach((overlay) => {
      if (overlay.parentNode !== document.body) {
        document.body.appendChild(overlay)
      }
    })
  }
  
  // 优化的观察器回调 - 立即处理对话框相关元素
  const optimizedObserverCallback = (mutations) => {
    let needsDialogHandling = false
    
    // 检查变化中是否包含对话框相关元素
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          // 检查是否是对话框相关元素
          if (node.classList?.contains('el-dialog__wrapper') || 
              node.classList?.contains('el-overlay') ||
              node.querySelector?.('.el-dialog__wrapper') ||
              node.querySelector?.('.el-overlay')) {
            needsDialogHandling = true
          }
        }
      })
    })
    
    // 立即处理对话框相关变化
    if (needsDialogHandling) {
      // 使用双重requestAnimationFrame确保DOM完全更新
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          handleDialogElements()
        })
      })
    }
  }
  
  // 启用观察器
  dialogObserver = new MutationObserver(optimizedObserverCallback)
  dialogObserver.observe(document.body, {
    childList: true,
    subtree: true // 需要观察子树来捕获对话框元素
  })
})