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

// 角色实体API
export const GET_ROLE_ENTITY_API = {
    GET_ROLE_ENTITY: 'SystemBasicMgmt/SystemMgmt/RoleInfo/GetRoleEntity'
}

// 角色分页API
export const GET_ROLE_PAGES_API = {
  GET_ROLE_PAGES: 'SystemBasicMgmt/SystemMgmt/RoleInfo/GetRolePage'
}

// 角色新增API
export const INSERT_ROLE_API = {
  INSERT_ROLE: 'SystemBasicMgmt/SystemMgmt/RoleInfo/InsertRole'
}

// 角色删除API
export const DELETE_ROLE_API = {
  DELETE_ROLE: 'SystemBasicMgmt/SystemMgmt/RoleInfo/DeleteRole'
}

// 角色更新API
export const UPDATE_ROLE_API = {
  UPDATE_ROLE: 'SystemBasicMgmt/SystemMgmt/RoleInfo/UpdateRole'
}