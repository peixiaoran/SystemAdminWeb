/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 程序实体API
export const GET_SMENU_ENTITY_API = {
  GET_SMENU_ENTITY: 'SystemBasicMgmt/SystemMgmt/SMenuInfo/GetSMenuEntity'
}

// 程序分页API
export const GET_SMENU_PAGES_API = {
  GET_SMENU_PAGES: 'SystemBasicMgmt/SystemMgmt/SMenuInfo/GetSMenuPage'
}

// 程序新增API
export const INSERT_SMENU_API = {
  INSERT_SMENU: 'SystemBasicMgmt/SystemMgmt/SMenuInfo/InsertSMenu'
}

// 程序删除API
export const DELETE_SMENU_API = {
  DELETE_SMENU: 'SystemBasicMgmt/SystemMgmt/SMenuInfo/DeleteSMenu'
}

// 网域下拉框
export const GET_MODULE_DROP_API = {
  GET_MODULE_DROP: 'SystemBasicMgmt/SystemMgmt/SMenuInfo/GetModuleDropDown'
}

// 父菜单下拉框
export const GET_PMENU_DROP_API = {
  GET_PMENU_TYPE: 'SystemBasicMgmt/SystemMgmt/SMenuInfo/GetPMenuDropDown'
}

// 程序更新API
export const UPDATE_SMENU_API = {
  UPDATE_SMENU: 'SystemBasicMgmt/SystemMgmt/SMenuInfo/UpdateSMenu'
}