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

// API端点基础路径
export const API_BASE_PATHS = {
  // 系统管理
  SYSTEM_MGMT: 'SystemBasicMgmt/SystemMgmt',
  // 系统基础数据
  SYSTEM_BASIC_DATA: 'SystemBasicMgmt/SystemBasicData',
  // 系统核心API
  SYSTEM_CORE: 'SystemBasicMgmt/SystemBasicCoreApi'
}

// 通用API操作类型
export const API_OPERATIONS = {
  GET_PAGES: 'PagesList',
  GET_ENTITY: 'Entity',
  INSERT: 'Insert',
  UPDATE: 'Update',
  DELETE: 'Delete',
  GET_DROPDOWN: 'DropDown'
} 