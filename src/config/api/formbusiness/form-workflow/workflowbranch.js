/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 获取表单组别下拉框API
export const GET_FORMGROUP_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowBranch/GetFormGroupDrop'

// 获取表单类别下拉框API
export const GET_FORMTYPE_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowBranch/GetFormTypeDrop'

// 获取流程分支分页列表API
export const GET_WORKFLOWBRANCH_LIST_API = 'FormBusiness/FormWorkFlow/WorkflowBranch/GetWorkflowBranchPage'

// 新增流程分支API
export const INSERT_WORKFLOWBRANCH_API = 'FormBusiness/FormWorkFlow/WorkflowBranch/InsertWorkflowBranch'

// 删除流程分支API
export const DELETE_WORKFLOWBRANCH_API = 'FormBusiness/FormWorkFlow/WorkflowBranch/DeleteWorkflowBranch'

// 获取流程分支实体API
export const GET_WORKFLOWBRANCH_ENTITY_API = 'FormBusiness/FormWorkFlow/WorkflowBranch/GetWorkflowBranchEntity'

// 更新流程分支API
export const UPDATE_WORKFLOWBRANCH_API = 'FormBusiness/FormWorkFlow/WorkflowBranch/UpdateWorkflowBranch'
