/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 获取表单组别下拉框API
export const GET_FORMGROUP_DROPDOWN_API = 'FormBusiness/FormOperate/PendingSubReview/GetFormGroupDrop'

// 获取表单类型下拉框API
export const GET_FORMTYPE_DROPDOWN_API = 'FormBusiness/FormOperate/PendingSubReview/GetFormTypeDrop'

// 获取表单状态下拉框API
export const GET_FORMSTATUS_DROPDOWN_API = 'FormBusiness/FormOperate/PendingSubReview/GetFormStatusDrop'

// 获取待送审列表API
export const GET_PENDING_SUBMISSION_LIST_API = 'FormBusiness/FormOperate/PendingSubReview/GetPendingSubmissionPage'

// 获取待签核列表API
export const GET_PENDING_REVIEW_LIST_API = 'FormBusiness/FormOperate/PendingSubReview/GetPendingReviewPage'

// 作废表单API
export const VOIDED_FORM_API = 'FormBusiness/FormOperate/PendingSubReview/VoidedForm'
