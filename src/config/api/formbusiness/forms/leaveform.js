/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

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
