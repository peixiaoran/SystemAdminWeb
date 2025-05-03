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

// 网域分页API
export const GET_DOMAIN_ENTITY_API = {
    GET_DOMAIN_ENTITY: 'SysBasic/SysManagement/Domain/GetSysDomainEntity'
  }

// 网域分页API
export const GET_DOMAIN_PAGES_API = {
  GET_DOMAIN_PAGES: 'SysBasic/SysManagement/Domain/GetSysDomainPagesList'
}

// 网域新增理API
export const INSERST_DOMAIN_API = {
  INSERST_DOMAIN: 'SysBasic/SysManagement/Domain/InsertSysDomain'
}

// 网域删除API
export const DELETE_DOMAIN_API = {
  DELETE_DOMAIN: 'SysBasic/SysManagement/Domain/DeleteSysDomain'
}

// 网域更新API
export const UPDATE_DOMAIN_API = {
  UPDATE_DOMAIN: 'SysBasic/SysManagement/Domain/UpdateSysDomain'
}


// 可以根据模块添加更多API