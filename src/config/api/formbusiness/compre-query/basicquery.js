/**
 * API配置文件
 * 集中管理 basicquery 相关 API
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

export const GET_FORMGROUP_DROPDOWN_API = 'FormBusiness/CompreQuery/BasicQuery/GetFormGroupDrop'

export const GET_FORMTYPE_DROPDOWN_API = 'FormBusiness/CompreQuery/BasicQuery/GetFormTypeDrop'

export const GET_FORMSTATUS_DROPDOWN_API = 'FormBusiness/CompreQuery/BasicQuery/GetFormStatusDrop'

export const GET_BASIC_FORM_QUERY_PAGE_API = 'FormBusiness/CompreQuery/BasicQuery/GetFormQueryPage'

export const GET_FORM_PENDING_USERS_API = 'FormBusiness/CompreQuery/BasicQuery/GetFormPendingUsers'

export const PRINT_FORM_PDF_API = 'FormBusiness/CompreQuery/BasicQuery/PrintFormPdf'

export const PRINT_FORM_PDF_BATCH_API = 'FormBusiness/CompreQuery/BasicQuery/PrintFormPdfBatch'

export const EXPORT_APPLY_HISTORY_EXCEL_API = 'FormBusiness/CompreQuery/BasicQuery/ExportFormQueryExcel'
