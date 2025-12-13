/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 职业实体API
export const GET_USER_LABOR_ENTITY_API = {
    GET_USER_LABOR_ENTITY: 'SystemBasicMgmt/SystemBasicData/UserLabor/GetUserLaborEntity'
}

// 职业列表API
export const GET_USERLABOR_LIST_API = {
    GET_USERLABOR_LIST: 'SystemBasicMgmt/SystemBasicData/UserLabor/GetUserLaborPage'
}

// 职业新增API
export const INSERT_USER_LABOR_API = {
    INSERT_USER_LABOR: 'SystemBasicMgmt/SystemBasicData/UserLabor/InsertUserLabor'
}

// 职业更新API
export const UPDATE_USER_LABOR_API = {
    UPDATE_USER_LABOR: 'SystemBasicMgmt/SystemBasicData/UserLabor/UpdateUserLabor'
}

// 职业删除API
export const DELETE_USER_LABOR_API = {
    DELETE_USER_LABOR: 'SystemBasicMgmt/SystemBasicData/UserLabor/DeleteUserLabor'
}
