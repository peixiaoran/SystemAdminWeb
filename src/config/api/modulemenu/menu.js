/**
 * 统一的API配置文件
 * 集中管理所有API相关的基础配置
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

// 查询模块列表
export const MODULE_API = {
    GET_MODULES: 'SystemBasicMgmt/SystemAuth/SysModuleMenu/GetModuleList'
}
  
// 查询菜单树结构
export const MENU_API = {
    GET_MENU: 'SystemBasicMgmt/SystemAuth/SysModuleMenu/GetMenuTreeList'
}