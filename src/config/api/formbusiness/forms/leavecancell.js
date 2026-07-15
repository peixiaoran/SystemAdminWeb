/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 初始化销假单API
export const INIT_LEAVECANCELL_API = 'FormBusiness/Forms/LeaveCancell/InitLeaveCancell'

// 获取销假单详情API
export const GET_LEAVECANCELL_API = 'FormBusiness/Forms/LeaveCancell/GetLeaveCancell'

// 保存销假单API
export const SAVE_LEAVECANCELL_API = 'FormBusiness/Forms/LeaveCancell/SaveLeaveCancell'

// 获取原请假单查看信息API
export const GET_LEAVEREQUEST_VIEW_API = 'FormBusiness/Forms/LeaveCancell/GetLeaveRequestView'

// 获取驳回步骤下拉框API
export const GET_REJECT_STEP_DROP_API = 'FormBusiness/Forms/PublicForm/GetRejectStepDrop'

// 送审销假单API
export const APPROVE_LEAVECANCELL_API = 'FormBusiness/Forms/PublicForm/FromApprove'

// 驳回销假单API
export const REJECT_LEAVECANCELL_API = 'FormBusiness/Forms/PublicForm/FromReject'
