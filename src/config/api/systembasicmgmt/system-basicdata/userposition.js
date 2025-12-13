/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 职业实体API
export const GET_USER_POSITION_ENTITY_API = {
    GET_USER_POSITION_ENTITY: 'SystemBasicMgmt/SystemBasicData/UserPosition/GetUserPositionEntity'
}

// 职业列表API
export const GET_USER_POSITION_LIST_API = {
  GET_USER_POSITION_LIST: 'SystemBasicMgmt/SystemBasicData/UserPosition/GetUserPositionList'
}