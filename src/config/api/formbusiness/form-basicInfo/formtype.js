/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 新增表单类型实体API
export const INSERT_FORMTYPE_ENTITY_API = 'FormBusiness/FormBasicInfo/FormType/InsertFormTypeInfo'

// 获取表单类型实体API
export const GET_FORMTYPE_ENTITY_API = 'FormBusiness/FormBasicInfo/FormType/GetFormTypeEntity'

// 获取表单类型分页列表API
export const GET_FORMTYPE_PAGE_API = 'FormBusiness/FormBasicInfo/FormType/GetFormTypePage'

// 更新表单类型API
export const UPDATE_FORMTYPE_API = 'FormBusiness/FormBasicInfo/FormType/UpdateFormTypeInfo'

// 删除表单类型API
export const DELETE_FORMTYPE_ENTITY_API = 'FormBusiness/FormBasicInfo/FormType/DeleteFormTypeInfo'

// 获取表单组别下拉列表API
export const GET_FORMTYPE_DROPDOWN_API = 'FormBusiness/FormBasicInfo/FormType/GetFormGroupDropDown'
