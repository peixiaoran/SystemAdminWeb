/**
 * API配置文件
 * 集中管理 FormHistory 相关 API
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

export const GET_FORMGROUP_DROPDOWN_API = 'FormBusiness/FormOperate/FormHistory/GetFormGroupDrop'

export const GET_FORMTYPE_DROPDOWN_API = 'FormBusiness/FormOperate/FormHistory/GetFormTypeDrop'

export const GET_FORMSTATUS_DROPDOWN_API = 'FormBusiness/FormOperate/FormHistory/GetFormStatusDrop'

export const GET_APPLY_HISTORY_PAGE_API = 'FormBusiness/FormOperate/FormHistory/GetApplyHistoryPage'

export const GET_REVIEW_HISTORY_PAGE_API = 'FormBusiness/FormOperate/FormHistory/GetReviewHistoryPage'
