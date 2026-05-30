/**
 * API配置文件
 * 集中管理 FormPending 相关 API
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 获取表单组别下拉框API
export const GET_FORMGROUP_DROPDOWN_API = 'FormBusiness/FormOperate/FormPending/GetFormGroupDrop'

// 获取表单类型下拉框API
export const GET_FORMTYPE_DROPDOWN_API = 'FormBusiness/FormOperate/FormPending/GetFormTypeDrop'

// 获取表单状态下拉框API
export const GET_FORMSTATUS_DROPDOWN_API = 'FormBusiness/FormOperate/FormPending/GetFormStatusDrop'

// 获取待送审分页API
export const GET_FORM_PENDING_SUBMIT_PAGE_API = 'FormBusiness/FormOperate/FormPending/GetPendingSubmitPage'

// 获取待签核分页API
export const GET_FORM_PENDING_REVIEW_PAGE_API = 'FormBusiness/FormOperate/FormPending/GetPendingReviewPage'

// 获取表单当前待审批人列表
export const GET_FORM_PENDING_USERS_API = 'FormBusiness/FormOperate/FormPending/GetFormPendingUsers'

// 作废表单API
export const VOIDED_FORM_API = 'FormBusiness/FormOperate/FormPending/VoidedForm'
