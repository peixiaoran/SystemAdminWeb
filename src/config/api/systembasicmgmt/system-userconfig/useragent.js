/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 员工分页API
export const GET_USER_PAGES_API = {
    GET_USER_PAGES: 'SystemBasicMgmt/SystemUserConfig/UserAgent/GetUserInfoPage'
}

// 员工代理人视图API
export const GET_USER_VIEW_API = {
    GET_USER_VIEW: 'SystemBasicMgmt/SystemUserConfig/UserAgent/GetUserInfoAgentView'
}

// 员工代理列表API
export const GET_USER_AGENT_API = {
    GET_USER_AGENT: 'SystemBasicMgmt/SystemUserConfig/UserAgent/GetUserAgentList',
    GET_USER_PRO_AGENT: 'SystemBasicMgmt/SystemUserConfig/UserAgent/GetUserAgentProactiveList'
}

// 员工代理新增API
export const GET_USER_AGENT_INSERT_API = {
    GET_USER_AGENT_INSERT: 'SystemBasicMgmt/SystemUserConfig/UserAgent/InsertUserAgent'
}

// 员工代理删除API
export const GET_USER_AGENT_DELETE_API = {
    GET_USER_AGENT_DELETE: 'SystemBasicMgmt/SystemUserConfig/UserAgent/DeleteUserAgent'
}

// 部门下拉框API
export const GET_DEPARTMENT_DROPDOWN_API = {
    GET_DEPARTMENT_DROPDOWN: 'SystemBasicMgmt/SystemUserConfig/UserAgent/GetDepartmentDropDown'
}