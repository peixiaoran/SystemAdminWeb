/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 初始化传签单API
export const INIT_DOCUMENTCIRCULATE_API = 'FormBusiness/Forms/DocumentCirculate/InitDocumentCirculate'

// 获取传签单详情API
export const GET_DOCUMENTCIRCULATE_API = 'FormBusiness/Forms/DocumentCirculate/GetDocumentCirculate'

// 暂存传签单API
export const SAVE_DOCUMENTCIRCULATE_API = 'FormBusiness/Forms/DocumentCirculate/SaveDocumentCirculate'

// 上传附件API
export const UPLOAD_FILE_API = 'FormBusiness/Forms/PublicForm/UploadAttachment'

// 删除附件API
export const DELETE_FILE_API = 'FormBusiness/Forms/PublicForm/DeleteAttachment'

// 获取完整签核流程API
export const GET_FULL_REVIEW_FLOW_API = 'FormBusiness/Forms/PublicForm/GetFullReviewFlow'

// 获取驳回步骤下拉框API
export const GET_REJECT_STEP_DROP_API = 'FormBusiness/Forms/PublicForm/GetRejectStepDrop'

// 送审传签单API
export const APPROVE_DOCUMENTCIRCULATE_API = 'FormBusiness/Forms/PublicForm/FromApprove'

// 驳回传签单API
export const REJECT_DOCUMENTCIRCULATE_API = 'FormBusiness/Forms/PublicForm/FromReject'

// 获取表单通知令牌API
export const GET_FORM_NOTIFY_TOKEN_API = 'FormBusiness/Forms/PublicForm/GetFormNotifyToken'

// 加审人员选择：部门下拉框API
export const GET_ADD_REVIEW_DEPARTMENT_DROP_API = 'FormBusiness/Forms/PublicForm/GetDepartmentDrop'

// 加审人员选择：分页查询可加审人员API
export const GET_ADD_REVIEW_USER_PAGE_API = 'FormBusiness/Forms/PublicForm/GetAddReviewUserPage'

// 新增加审人员API
export const INSERT_FORM_ADD_REVIEW_API = 'FormBusiness/Forms/PublicForm/InsertFormAddReview'

// 更新加审人员API
export const UPDATE_FORM_ADD_REVIEW_API = 'FormBusiness/Forms/PublicForm/UpdateFormAddReview'

// 删除加审人员API
export const DELETE_FORM_ADD_REVIEW_API = 'FormBusiness/Forms/PublicForm/DeleteFormAddReview'
