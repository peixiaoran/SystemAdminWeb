/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
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

// 登录相关API
export const LOGIN_API = {
  USER_LOGIN: 'SysBasic/SysBasics/SysLoginControllers/UserLogin'
}

// 模块相关API
export const MODULE_API = {
  GET_MODULES: 'SysBasic/SysBasics/SysLoginControllers/GetSysDomainList'
}

// 菜单相关API
export const MENU_API = {
  GET_MENU: 'SysBasic/SysBasics/SysLoginControllers/GetSysModuleTreeList'
}

// 网域新增理API
export const INSERST_DOMAIN_API = {
  INSERST_DOMAIN: 'SysBasic/SysBasics/DomainControllers/InsertSysDomain'
}

// 网域删除API
export const DELETE_DOMAIN_API = {
  DELETE_DOMAIN: 'SysBasic/SysBasics/DomainControllers/DeleteSysDomain'
}

// 网域类型API
export const GET_DOMAIN_TYPE_API = {
  GET_DOMAIN_TYPE: 'SysBasic/SysBasics/DomainControllers/GetDomainTypeList'
}


// 可以根据模块添加更多API