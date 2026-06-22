/**
 * API配置文件
 * 集中管理 VoidedForm 相关 API
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 获取表单组别下拉框API
export const GET_FORMGROUP_DROPDOWN_API = 'FormBusiness/FormOperate/VoidedForm/GetFormGroupDrop'

// 获取表单类型下拉框API
export const GET_FORMTYPE_DROPDOWN_API = 'FormBusiness/FormOperate/VoidedForm/GetFormTypeDrop'

// 获取表单状态下拉框API
export const GET_FORMSTATUS_DROPDOWN_API = 'FormBusiness/FormOperate/VoidedForm/GetFormStatusDrop'

// 获取已作废分页API
export const GET_FORM_VOIDED_PAGE_API = 'FormBusiness/FormOperate/VoidedForm/GetVoidedFormsPage'
