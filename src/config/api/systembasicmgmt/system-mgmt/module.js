/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 网域实体API
export const GET_MODULE_ENTITY_API = {
    GET_MODULE_ENTITY: 'SystemBasicMgmt/SystemMgmt/ModuleInfo/GetModuleEntity'
}

// 模块分页API
export const GET_MODULE_PAGES_API = {
  GET_MODULE_PAGES: 'SystemBasicMgmt/SystemMgmt/ModuleInfo/GetModulePage'
}

// 模块新增API
export const INSERT_MODULE_API = {
  INSERT_MODULE: 'SystemBasicMgmt/SystemMgmt/ModuleInfo/InsertModule'
}

// 模块删除API
export const DELETE_MODULE_API = {
  DELETE_MODULE: 'SystemBasicMgmt/SystemMgmt/ModuleInfo/DeleteModule'
}

// 网域更新API
export const UPDATE_MODULE_API = {
  UPDATE_MODULE: 'SystemBasicMgmt/SystemMgmt/ModuleInfo/UpdateModule'
}