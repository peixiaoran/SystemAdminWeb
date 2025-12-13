/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 查询申请单详情API
export const GET_APPLYFORM_API = 'FormBusiness/FormOperate/ApplyForm/GetApplyFormPage'

// 获取表单组别下拉框API
export const GET_FORMGROUP_DROPDOWN_API = 'FormBusiness/FormOperate/ApplyForm/GetFormGroupDropDown'
