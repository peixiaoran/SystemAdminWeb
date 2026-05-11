/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 获取表单组别下拉框API
export const GET_FORMGROUP_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowStep/GetFormGroupDrop'

// 获取表单类别下拉框API
export const GET_FORMTYPE_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowStep/GetFormTypeDrop'

// 获取流程步骤列表API
export const GET_WORKFLOWSTEP_LIST_API = 'FormBusiness/FormWorkFlow/WorkflowStep/GetWorkflowStepList'

// 新增流程步骤API
export const INSERT_WORKFLOWSTEP_API = 'FormBusiness/FormWorkFlow/WorkflowStep/InsertWorkflowStep'

// 获取指派规则下拉框API
export const GET_ASSIGNMENT_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowStep/GetAssignmentDrop'

// 获取步骤签核级别下拉框API
export const GET_ARCHI_LEVEL_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowStep/GetArchiLevelDrop'

// 获取步骤审批方式下拉框API
export const GET_REVIEW_MODE_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowStep/GetReviewModeDrop'

// 获取部门级别下拉框API
export const GET_DEPARTMENT_LEVEL_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowStep/GetDepartmentLevelDrop'

// 获取员工职级下拉框API
export const GET_USER_POSITION_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowStep/GetPositionDrop'

// 获取部门下拉框API
export const GET_DEPARTMENT_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowStep/GetDepartmentDrop'

// 获取用户信息分页API
export const GET_USER_INFO_PAGE_API = 'FormBusiness/FormWorkFlow/WorkflowStep/GetUserInfoPage'

// 删除流程步骤API
export const DELETE_WORKFLOWSTEP_API = 'FormBusiness/FormWorkFlow/WorkflowStep/DeleteWorkflowStep'

// 获取流程步骤实体API
export const GET_WORKFLOWSTEP_ENTITY_API = 'FormBusiness/FormWorkFlow/WorkflowStep/GetWorkflowStepEntity'

// 更新流程步骤API
export const UPDATE_WORKFLOWSTEP_API = 'FormBusiness/FormWorkFlow/WorkflowStep/UpdateWorkflowStep'