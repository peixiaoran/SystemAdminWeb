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
    GET_USER_PAGES: 'SystemBasicMgmt/SystemBasicData/UserAgent/GetUserInfoPagesList'
}

// 员工代理人视图API
export const GET_USER_VIEW_API = {
    GET_USER_VIEW: 'SystemBasicMgmt/SystemBasicData/UserAgent/GetUserInfoAgentView'
}

// 员工代理列表API
export const GET_USER_AGENT_API = {
    GET_USER_AGENT: 'SystemBasicMgmt/SystemBasicData/UserAgent/GetUserAgentList'
}

// 员工代理新增API
export const GET_USER_AGENT_INSERT_API = {
    GET_USER_AGENT_INSERT: 'SystemBasicMgmt/SystemBasicData/UserAgent/InsertUserAgent'
}

// 员工代理删除API
export const GET_USER_AGENT_DELETE_API = {
    GET_USER_AGENT_DELETE: 'SystemBasicMgmt/SystemBasicData/UserAgent/DeleteUserAgent'
}