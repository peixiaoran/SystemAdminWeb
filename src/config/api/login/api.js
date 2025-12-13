/**
 * 统一的API配置文件
 * 集中管理所有API相关的基础配置
 * 说明：已移除对 `src/config/api/config.js` 的依赖
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'
const env = import.meta.env

// 会话探活 / 当前用户信息（Cookie 会话闭环）
// - 由于不同后端实现差异较大，这里默认不启用（避免 /me 404）
// - 如需启用，请在环境变量中配置：VITE_AUTH_ME_API（需带前导 “/”，例如：/SystemBasicMgmt/SystemAuth/SysUserOperate/GetCurrentUser）
export const ME_API = {
  // 约定：若 baseURL 形如 https://host/api（无尾斜杠），这里必须带前导 “/”
  ME: env.VITE_AUTH_ME_API || ''
}

// 员工登录
export const LOGIN_API = {
  USER_LOGIN: 'SystemBasicMgmt/SystemAuth/SysUserOperate/UserLogin'
}

// 解锁发送验证码
export const UNLOCK_SEND_API = {
  UNLOCK_SEND: 'SystemBasicMgmt/SystemAuth/SysUserOperate/UnLockSendVcCode'
}

// 重置密码发送验证码
export const PWD_EXPIRATION_SEND_API = {
  PWD_EXPIRATION_SEND: 'SystemBasicMgmt/SystemAuth/SysUserOperate/UnExpirationSendVcCode'
}

// 解锁
export const UNLOCK_API = {
  UNLOCK: 'SystemBasicMgmt/SystemAuth/SysUserOperate/UserUnlock'
}

// 密码过期更新
export const PWD_EXPIRATION_UPDATE_API = {
  PWD_EXPIRATION_UPDATE: 'SystemBasicMgmt/SystemAuth/SysUserOperate/PwdExpirationUpdate'
}

// 员工退出
export const LOGOUT_API = {
  USER_LOGOUT: 'SystemBasicMgmt/SystemAuth/SysUserOperate/UserLogOut'
}

// 查询模块列表
export const MODULE_API = {
  GET_MODULES: 'SystemBasicMgmt/SystemAuth/SysModuleMenu/GetModuleList'
}

// 查询菜单树结构
export const MENU_API = {
  GET_MENU: 'SystemBasicMgmt/SystemAuth/SysModuleMenu/GetMenuTreeList'
}