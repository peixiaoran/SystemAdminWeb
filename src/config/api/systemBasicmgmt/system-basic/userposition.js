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

// 公司实体API
export const GET_USER_POSITION_ENTITY_API = {
    GET_USER_POSITION_ENTITY: 'SystemBasicMgmt/SystemBasicData/UserPosition/GetUserPositionEntity'
}

// 公司列表API
export const GET_USER_POSITION_LIST_API = {
  GET_USER_POSITION_LIST: 'SystemBasicMgmt/SystemBasicData/UserPosition/GetUserPositionList'
}