/**
 * 统一的API配置文件
 * 集中管理所有API相关的基础配置
 * 说明：已移除对 `src/config/api/config.js` 的依赖
 */

// 环境变量
const env = import.meta.env

// 环境标识
export const ENV_MODE = env.MODE
export const IS_DEV = env.DEV
export const IS_PROD = env.PROD

// API基础配置
export const BASE_API_URL = env.VITE_API_BASE_URL
export const API_TIMEOUT = parseInt(env.VITE_API_TIMEOUT || '15000')
export const ENABLE_LOGS = env.VITE_ENABLE_LOGS === 'true'

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