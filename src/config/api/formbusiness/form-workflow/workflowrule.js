/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 获取表单组别下拉框API
export const GET_FORMGROUP_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowRule/GetFormGroupDrop'

// 获取表单类别下拉框API
export const GET_FORMTYPE_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowRule/GetFormTypeDrop'

// 获取职位列表API
export const GET_POSITION_LIST_API = 'FormBusiness/FormWorkFlow/WorkflowRule/GetPositionDrop'

// 新增流程规则API
export const INSERT_WORKFLOWRULE_API = 'FormBusiness/FormWorkFlow/WorkflowRule/InsertWorkflowRule'

// 更新流程规则API
export const DELETE_WORKFLOWRULE_API = 'FormBusiness/FormWorkFlow/WorkflowRule/DeleteWorkflowRule'

// 删除流程规则API
export const UPDATE_WORKFLOWRULE_API = 'FormBusiness/FormWorkFlow/WorkflowRule/UpdateWorkflowRule'

// 获取流程规则实体API
export const GET_WORKFLOWRULE_ENTITY_API = 'FormBusiness/FormWorkFlow/WorkflowRule/GetWorkflowRuleEntity'


// 获取流程规则分页API
export const GET_WORKFLOWRULE_PAGE_API = 'FormBusiness/FormWorkFlow/WorkflowRule/GetWorkflowRulePage'