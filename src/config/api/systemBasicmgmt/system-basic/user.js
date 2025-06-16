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

// 用户分页API
export const GET_USER_PAGES_API = {
    GET_USER_PAGES: 'SystemBasicMgmt/SystemBasicData/UserInfo/GetUserInfoPagesList'
}

// 用户新增API
export const INSERST_USER_API = {
  INSERST_USER: 'SystemBasicMgmt/SystemBasicData/UserInfo/InsertUserInfo'
}

// 用户删除API
export const DELETE_USER_API = {
  DELETE_USER: 'SystemBasicMgmt/SystemBasicData/UserInfo/DeleteUserInfo'
}

// 用户更新API
export const UPDATE_USER_API = {
  UPDATE_USER: 'SystemBasicMgmt/SystemBasicData/UserInfo/UpdateUserInfo'
}

// 用户实体API
export const GET_USER_ENTITY_API = {
  GET_USER_ENTITY: 'SystemBasicMgmt/SystemBasicData/UserInfo/GetUserInfoEntity'
}

// 部门下拉框API
export const GET_DEPARTMENT_DROPDOWN_API = {
    GET_DEPARTMENT_DROPDOWN: 'SystemBasicMgmt/SystemBasicData/UserInfo/GetDepartmentDropDown'
}

// 职位下拉框API
export const GET_USER_POSITION_DROPDOWN_API = {
    GET_USER_POSITION_DROPDOWN: 'SystemBasicMgmt/SystemBasicData/UserInfo/GetUserPositionDropDown'
}

// 角色下拉框API
export const GET_ROLE_DROPDOWN_API = {
    GET_ROLE_DROPDOWN: 'SystemBasicMgmt/SystemBasicData/UserInfo/GetRoleDropDown'
}

// 性别下拉框API
export const GET_GENDER_DROPDOWN_API = {
  GET_GENDER_DROPDOWN: 'SystemBasicMgmt/SystemBasicData/UserInfo/GetGenderDropDown'
}

// 雇佣类型下拉框API
export const GET_EMPLOYMENT_TYPE_DROPDOWN_API = {
  GET_EMPLOYMENT_TYPE_DROPDOWN: 'SystemBasicMgmt/SystemBasicData/UserInfo/GetEmploymentType'
}

// 导出用户API
export const EXPORT_USERS_API = {
  EXPORT_USERS: 'SystemBasicMgmt/SystemBasicData/UserInfo/ExportUsersToExcel'
}

// 导出用户PDFAPI
export const EXPORT_USERS_PDF_API = {
  EXPORT_USERS_PDF: 'SystemBasicMgmt/SystemBasicData/UserInfo/ExportUsersToPdf'
}

