/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 获取表单组别下拉框API
export const GET_FORMGROUP_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowStep/GetFormGroupDropDown'

// 获取表单类别下拉框API
export const GET_FORMTYPE_DROPDOWN_API = 'FormBusiness/FormWorkFlow/WorkflowStep/GetFormTypeDropDown'

// 获取流程步骤分页列表API
export const GET_WORKFLOWSTEP_PAGE_API = 'FormBusiness/FormWorkFlow/WorkflowStep/GetWorkflowStepPage'

