/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 查询员工操作日志分页API
export const GET_USER_LOGIN_LOG_PAGES_API = {
  GET_USER_LOGIN_LOG_PAGES: 'SystemBasicMgmt/SystemSettings/UserLoginLog/GetUserLoginLogPage'
}