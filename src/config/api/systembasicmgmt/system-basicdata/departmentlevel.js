/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 公司实体API
export const GET_DEPARTMENT_LEVEL_ENTITY_API = {
    GET_DEPARTMENT_LEVEL_ENTITY: 'SystemBasicMgmt/SystemBasicData/DepartmentLevel/GetDepartmentLevelEntity'
}

// 公司列表API
export const GET_DEPARTMENT_LEVEL_LIST_API = {
  GET_DEPARTMENT_LEVEL_LIST: 'SystemBasicMgmt/SystemBasicData/DepartmentLevel/GetDepartmentLevelList'
}

// 公司新增API
export const INSERT_DEPARTMENT_LEVEL_API = {
  INSERT_DEPARTMENT_LEVEL: 'SystemBasicMgmt/SystemBasicData/DepartmentLevel/InsertDepartmentLevel'
}

// 公司删除API
export const DELETE_DEPARTMENT_LEVEL_API = {
  DELETE_DEPARTMENT_LEVEL: 'SystemBasicMgmt/SystemBasicData/DepartmentLevel/DeleteDepartmentLevel'
}

// 公司更新API
export const UPDATE_DEPARTMENT_LEVEL_API = {
  UPDATE_DEPARTMENT_LEVEL: 'SystemBasicMgmt/SystemBasicData/DepartmentLevel/UpdateDepartmentLevel'
}