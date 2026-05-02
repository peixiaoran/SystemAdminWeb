/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 获取表单组别下拉框API
export const GET_FORMGROUP_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowRuleStep/GetFormGroupDrop'

// 获取表单类别下拉框API
export const GET_FORMTYPE_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowRuleStep/GetFormTypeDrop'

// 获取流程规则下拉框API
export const GET_WORKFLOWRULE_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowRuleStep/GetWorkflowRuleDrop'

// 获取流程步骤下拉框API
export const GET_WORKFLOWSTEP_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowRuleStep/GetWorkflowStepDrop'

// 新增流程规则步骤API
export const INSERT_WORKFLOWRULESTEP_API = 'FormBusiness/FormWorkFlow/WorkflowRuleStep/InsertWorkflowRuleStep'

// 删除流程规则步骤API
export const DELETE_WORKFLOWRULESTEP_API = 'FormBusiness/FormWorkFlow/WorkflowRuleStep/DeleteWorkflowRuleStep'

// 更新流程规则步骤API
export const UPDATE_WORKFLOWRULESTEP_API = 'FormBusiness/FormWorkFlow/WorkflowRuleStep/UpdateWorkflowRuleStep'

// 获取流程规则步骤实体API
export const GET_WORKFLOWRULESTEP_ENTITY_API = 'FormBusiness/FormWorkFlow/WorkflowRuleStep/GetWorkflowRuleStepEntity'

// 获取流程规则步骤列表API
export const GET_WORKFLOWRULESTEP_LIST_API = 'FormBusiness/FormWorkFlow/WorkflowRuleStep/GetWorkflowRuleStepList'