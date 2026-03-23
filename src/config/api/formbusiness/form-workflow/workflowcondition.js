/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 获取表单组别下拉框API
export const GET_FORMGROUP_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowCondition/GetFormGroupDropDown'

// 获取表单类别下拉框API
export const GET_FORMTYPE_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowCondition/GetFormTypeDropDown'

// 获取流程条件列表API
export const GET_WORKFLOWCONDITION_LIST_API = 'FormBusiness/FormWorkFlow/WorkflowCondition/GetWorkflowConditionPage'

// 新增流程条件API
export const INSERT_WORKFLOWCONDITION_API = 'FormBusiness/FormWorkFlow/WorkflowCondition/InsertWorkflowCondition'

// 删除流程条件API
export const DELETE_WORKFLOWCONDITION_API = 'FormBusiness/FormWorkFlow/WorkflowCondition/DeleteWorkflowCondition'

// 获取流程条件详情API
export const GET_WORKFLOWCONDITION_ENTITY_API = 'FormBusiness/FormWorkFlow/WorkflowCondition/GetWorkflowConditionEntity'

// 更新流程条件API
export const UPDATE_WORKFLOWCONDITION_API = 'FormBusiness/FormWorkFlow/WorkflowCondition/UpdateWorkflowCondition'
