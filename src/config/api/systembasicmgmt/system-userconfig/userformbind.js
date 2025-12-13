/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

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

