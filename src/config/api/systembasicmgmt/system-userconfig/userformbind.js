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

// 员工分页API
export const GET_USER_PAGES_API = {
    GET_USER_PAGES: 'SystemBasicMgmt/SystemUserConfig/UserFormBind/GetUserInfoPage'
}

// 员工表单绑定视图树API
export const GET_USER_FORM_BIND_VIEW_TREE_API = {
    GET_USER_FORM_BIND_VIEW_TREE: 'SystemBasicMgmt/SystemUserConfig/UserFormBind/GetUserFormBindViewTree'
}

// 员工表单绑定更新API
export const UPDATE_USER_FORM_BIND_API = {
    UPDATE_USER_FORM_BIND: 'SystemBasicMgmt/SystemUserConfig/UserFormBind/UpdateUserFormBind'
}

// 部门下拉框API
export const GET_DEPARTMENT_DROPDOWN_API = {
    GET_DEPARTMENT_DROPDOWN: 'SystemBasicMgmt/SystemUserConfig/UserFormBind/GetDepartmentDropDown'
}

