import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 自定义NProgress配置
NProgress.configure({
  easing: 'ease',           // 动画方式
  speed: 500,               // 递增速度
  showSpinner: false,       // 是否显示加载ico
  trickleSpeed: 200,        // 自动递增间隔
  minimum: 0.3,             // 初始化时的最小百分比
  parent: 'body'            // 指定父容器
})

// 解决路由快速切换导致的进度条消失问题
let timer = null
let isFirstLoad = true  // 标记是否是首次加载

export const startProgress = () => {
  if (timer) clearTimeout(timer)
  
  // 如果已经有进度条在运行，先重置
  if (NProgress.isStarted()) {
    NProgress.done()
    NProgress.start()
  } else {
    NProgress.start()
  }
  
  // 首次加载时延迟100ms显示，避免闪烁
  if (isFirstLoad) {
    isFirstLoad = false
    setTimeout(() => {
      NProgress.set(0.1)
    }, 100)
  }
}

export const endProgress = () => {
  if (timer) clearTimeout(timer)
  
  // 延迟结束，避免闪烁
  timer = setTimeout(() => {
    NProgress.done()
  }, 100)
}

export const forceEndProgress = () => {
  if (timer) clearTimeout(timer)
  NProgress.done()
}

export default NProgress 