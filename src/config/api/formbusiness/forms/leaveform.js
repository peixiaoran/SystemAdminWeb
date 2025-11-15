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

// 初始化请假单API
export const INIT_LEAVEFORM_API = 'FormBusiness/Forms/LeaveForm/InitLeaveForm'

// 保存请假单API
export const SAVE_LEAVEFORM_API = 'FormBusiness/Forms/LeaveForm/SaveLeaveForm'

// 获取请假单详情API
export const GET_LEAVEFORM_DETAIL_API = 'FormBusiness/Forms/LeaveForm/GetLeaveForm'

// 获取请假类型下拉框API
export const GET_LEAVEFORM_DROPDOWN_API = 'FormBusiness/Forms/LeaveForm/GetLeaveTypeDropDown'

// 获取重要性下拉框API
export const GET_IMPORTANCE_DROPDOWN_API = 'FormBusiness/Forms/LeaveForm/GetImportanceDropDown'
