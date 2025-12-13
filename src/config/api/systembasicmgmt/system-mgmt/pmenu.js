/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 一级菜单分页API
export const GET_PMENU_ENTITY_API = {
    GET_PMENU_ENTITY: 'SystemBasicMgmt/SystemMgmt/PMenuInfo/GetPMenuEntity'
}

// 一级菜单分页API
export const GET_PMENU_PAGES_API = {
    GET_PMENU_PAGES: 'SystemBasicMgmt/SystemMgmt/PMenuInfo/GetPMenuPage'
}

// 一级菜单新增API
export const INSERT_PMENU_API = {
    INSERT_PMENU: 'SystemBasicMgmt/SystemMgmt/PMenuInfo/InsertPMenu'
}

// 一级菜单删除API
export const DELETE_PMENU_API = {
    DELETE_PMENU: 'SystemBasicMgmt/SystemMgmt/PMenuInfo/DeletePMenu'
}

// 模块下拉框
export const GET_MODULE_DROP_API = {
  GET_MODULE_DROP: 'SystemBasicMgmt/SystemMgmt/PMenuInfo/GetModuleDropDown'
}

// 一级菜单更新API
export const UPDATE_PMENU_API = {
    UPDATE_PMENU: 'SystemBasicMgmt/SystemMgmt/PMenuInfo/UpdatePMenu'
}