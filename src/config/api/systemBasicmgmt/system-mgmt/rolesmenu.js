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

// 更新角色二级菜单分页API
export const UPDATE_ROLE_SMENU_API = {
  UPDATE_ROLE_SMENU: 'SystemBasicMgmt/SystemMgmt/RoleSMenu/UpdateRoleSMenu'
}

// 获取角色二级菜单列表API
export const GET_ROLE_SMENU_API = {
  GET_ROLE_SMENU: 'SystemBasicMgmt/SystemMgmt/RoleSMenu/GetRoleSMenuList'
}

// 获取角色下拉列表API
export const GET_ROLE_DROPDOWN_API = {
    GET_ROLE_DROPDOWN: 'SystemBasicMgmt/SystemMgmt/RoleSMenu/GetRoleDropDown'
}

// 获取模块下拉列表API
export const GET_MODULE_DROPDOWN_API = {
    GET_MODULE_DROPDOWN: 'SystemBasicMgmt/SystemMgmt/RoleSMenu/GetModuleDropDown'
}

// 获取一级菜单下拉列表API
export const GET_PMENU_DROPDOWN_API = {
    GET_PMENU_DROPDOWN: 'SystemBasicMgmt/SystemMgmt/RoleSMenu/GetPMenuDropDown'
}
