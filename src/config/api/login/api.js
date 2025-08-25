/**
 * 登录相关API配置
 */
import { BASE_API_URL, API_TIMEOUT, ENABLE_LOGS, ENV_MODE, IS_DEV, IS_PROD, API_BASE_PATHS } from '../config'

// 重新导出公共配置
export { BASE_API_URL, API_TIMEOUT, ENABLE_LOGS, ENV_MODE, IS_DEV, IS_PROD }

// 员工登录
export const LOGIN_API = {
  USER_LOGIN: `${API_BASE_PATHS.SYSTEM_CORE}/SysUserOperate/UserLogin`
}

// 解锁发送验证码
export const UNLOCK_SEND_API = {
  UNLOCK_SEND: `${API_BASE_PATHS.SYSTEM_CORE}/SysUserOperate/UnLockSendVcCode`
}

// 重置密码发送验证码
export const PWD_EXPIRATION_SEND_API = {
  PWD_EXPIRATION_SEND: `${API_BASE_PATHS.SYSTEM_CORE}/SysUserOperate/UnExpirationSendVcCode`
}

// 解锁
export const UNLOCK_API = {
  UNLOCK: `${API_BASE_PATHS.SYSTEM_CORE}/SysUserOperate/UserUnlock`
}

// 密码过期更新
export const PWD_EXPIRATION_UPDATE_API = {
  PWD_EXPIRATION_UPDATE: `${API_BASE_PATHS.SYSTEM_CORE}/SysUserOperate/PwdExpirationUpdate`
}

// 员工退出
export const LOGOUT_API = {
  USER_LOGOUT: `${API_BASE_PATHS.SYSTEM_CORE}/SysUserOperate/UserLogOut`
}

// 查询模块列表
export const MODULE_API = {
  GET_MODULES: `${API_BASE_PATHS.SYSTEM_CORE}/SysDomainMenu/GetSysDomainList`
}

// 查询菜单树结构
export const MENU_API = {
  GET_MENU: `${API_BASE_PATHS.SYSTEM_CORE}/SysDomainMenu/GetSysModuleTreeList`
}