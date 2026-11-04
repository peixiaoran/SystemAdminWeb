import { isUnsupportedDevice, renderUnsupportedNotice } from './utils/deviceGuard'

// 本系统仅支持 PC 端：非电脑设备只显示提示页，不加载应用主体（路由、Element Plus、会话探活等）
if (isUnsupportedDevice()) {
  renderUnsupportedNotice()
} else {
  import('./bootstrap.js')
}
