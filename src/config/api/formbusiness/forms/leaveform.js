/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 初始化请假单 API
export const INIT_LEAVEFORM_API = 'FormBusiness/Forms/LeaveForm/InitLeaveForm'

// 保存请假单API
export const SAVE_LEAVEFORM_API = 'FormBusiness/Forms/LeaveForm/SaveLeaveForm'

// 获取请假单详情API
export const GET_LEAVEFORM_DETAIL_API = 'FormBusiness/Forms/LeaveForm/GetLeaveForm'

// 获取请假类型下拉框API
export const GET_LEAVEFORM_DROPDOWN_API = 'FormBusiness/Forms/LeaveForm/GetLeaveTypeDrop'

// 获取请假余额信息API
export const GET_LEAVE_BALANCES_API = 'FormBusiness/Forms/LeaveForm/GetLeaveBalances'

// 获取部门下拉框API
export const GET_DEPARTMENT_DROPDOWN_API = 'FormBusiness/Forms/LeaveForm/GetDepartmentDrop'

// 获取可代理用户信息API
export const GET_AGENT_USER_INFO_API = 'FormBusiness/Forms/LeaveForm/GetUserInfoAgentView'

// 上传附件API
export const UPLOAD_FILE_API = 'FormBusiness/Forms/PublicForm/UploadAttachment'

// 删除附件API
export const DELETE_FILE_API = 'FormBusiness/Forms/PublicForm/DeleteAttachment'

// 获取完整签核流程API
export const GET_FULL_REVIEW_FLOW_API = 'FormBusiness/Forms/PublicForm/GetFullReviewFlow'

// 获取驳回步骤下拉框API
export const GET_REJECT_STEP_DROP_API = 'FormBusiness/Forms/PublicForm/GetRejectStepDrop'

// 送审请假单API
export const APPROVE_LEAVEFORM_API = 'FormBusiness/Forms/PublicForm/FromApprove'

// 驳回请假单API
export const REJECT_LEAVEFORM_API = 'FormBusiness/Forms/PublicForm/FromReject'

// 获取表单通知令牌API
export const GET_FORM_NOTIFICATION_TOKEN_API = 'FormBusiness/Forms/PublicForm/GetFormNotificationToken'