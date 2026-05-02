/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 初始化请假单 API
export const INIT_LEAVEFORM_API = 'FormBusiness/Forms/LeaveForm/InitializeLevel'

// 保存请假单API
export const SAVE_LEAVEFORM_API = 'FormBusiness/Forms/LeaveForm/SaveLeaveForm'

// 获取请假单详情API
export const GET_LEAVEFORM_DETAIL_API = 'FormBusiness/Forms/LeaveForm/GetLeaveForm'

// 获取请假类型下拉框API
export const GET_LEAVEFORM_DROPDOWN_API = 'FormBusiness/Forms/LeaveForm/GetLeaveTypeDrop'

// 获取重要性下拉框API
export const GET_IMPORTANCE_DROPDOWN_API = 'FormBusiness/Forms/LeaveForm/GetImportanceDrop'

// 上传附件API
export const UPLOAD_FILE_API = 'FormBusiness/Forms/LeaveForm/UploadAttachment'

// 删除附件API
export const DELETE_FILE_API = 'FormBusiness/Forms/LeaveForm/DeleteAttachment'

// 获取完整签核流程API
export const GET_FULL_REVIEW_FLOW_API = 'FormBusiness/Forms/LeaveForm/GetFullReviewFlow'

// 送审请假单API
export const APPROVE_LEAVEFORM_API = 'FormBusiness/Forms/LeaveForm/ApproveLeaveForm'