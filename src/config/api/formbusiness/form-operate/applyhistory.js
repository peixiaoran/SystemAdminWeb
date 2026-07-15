/**
 * API配置文件
 * 集中管理 FormPending 相关 API
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

export const GET_FORMGROUP_DROPDOWN_API = 'FormBusiness/FormOperate/ApplyHistory/GetFormGroupDrop'

export const GET_FORMTYPE_DROPDOWN_API = 'FormBusiness/FormOperate/ApplyHistory/GetFormTypeDrop'

export const GET_APPLY_HISTORY_PAGE_API = 'FormBusiness/FormOperate/ApplyHistory/GetApplyHistoryPage'

export const WITHDRAW_FORM_API = 'FormBusiness/FormOperate/ApplyHistory/WithdrawForm'

export const VOIDED_FORM_API = 'FormBusiness/FormOperate/ApplyHistory/VoidedForm'

export const GET_FORM_PENDING_USERS_API = 'FormBusiness/FormOperate/ApplyHistory/GetFormPendingUsers'

export const PRINT_FORM_PDF_API = 'FormBusiness/FormOperate/ApplyHistory/PrintFormPdf'