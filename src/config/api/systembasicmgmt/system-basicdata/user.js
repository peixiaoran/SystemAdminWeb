/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 员工分页API
export const GET_USER_PAGES_API = {
    GET_USER_PAGES: 'SystemBasicMgmt/SystemBasicData/UserInfo/GetUserInfoPage'
}

// 员工新增API
export const INSERT_USER_API = {
  INSERT_USER: 'SystemBasicMgmt/SystemBasicData/UserInfo/InsertUserInfo'
}

// 员工删除API
export const DELETE_USER_API = {
  DELETE_USER: 'SystemBasicMgmt/SystemBasicData/UserInfo/DeleteUserInfo'
}

// 员工更新API
export const UPDATE_USER_API = {
  UPDATE_USER: 'SystemBasicMgmt/SystemBasicData/UserInfo/UpdateUserInfo'
}

// 员工实体API
export const GET_USER_ENTITY_API = {
  GET_USER_ENTITY: 'SystemBasicMgmt/SystemBasicData/UserInfo/GetUserInfoEntity'
}

// 部门下拉框API
export const GET_DEPARTMENT_DROPDOWN_API = {
    GET_DEPARTMENT_DROPDOWN: 'SystemBasicMgmt/SystemBasicData/UserInfo/GetDepartmentDropDown'
}

// 职业下拉框API
export const GET_USER_POSITION_DROPDOWN_API = {
    GET_USER_POSITION_DROPDOWN: 'SystemBasicMgmt/SystemBasicData/UserInfo/GetUserPositionDropDown'
}

// 角色下拉框API
export const GET_ROLE_DROPDOWN_API = {
    GET_ROLE_DROPDOWN: 'SystemBasicMgmt/SystemBasicData/UserInfo/GetRoleDropDown'
}

// 国籍下拉框API
export const GET_NATIONALITY_DROPDOWN_API = {
  GET_NATIONALITY_DROPDOWN: 'SystemBasicMgmt/SystemBasicData/UserInfo/GetNationalityDropDown'
}

// 员工职业下拉框API
export const GET_LABOR_TYPE_DROPDOWN_API = {
  GET_LABOR_TYPE_DROPDOWN: 'SystemBasicMgmt/SystemBasicData/UserInfo/GetLaborDropDown'
}

// 导出员工API
export const EXPORT_USERS_API = {
  EXPORT_USERS: 'SystemBasicMgmt/SystemBasicData/UserInfo/ExportUsersToExcel'
}

// 更新头像上传API
export const UPLOAD_AVATAR_UPDATE_API = {
  UPLOAD_AVATAR_UPDATE: 'SystemBasicMgmt/SystemBasicData/UserInfo/UploadAvatarUpdate'
}

// 新增头像上传API
export const UPLOAD_AVATAR_INSERT_API = {
  UPLOAD_AVATAR_INSERT: 'SystemBasicMgmt/SystemBasicData/UserInfo/UploadAvatarInsert'
}

// 导出员工ExcelAPI
export const EXPORT_USERS_EXCEL_API = {
  EXPORT_USERS_EXCEL: 'SystemBasicMgmt/SystemBasicData/UserInfo/ExportUserExcel'
}