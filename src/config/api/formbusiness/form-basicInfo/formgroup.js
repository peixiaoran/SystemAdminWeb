/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 新增表单组别实体API
export const INSERT_FORMGROUP_ENTITY_API = 'FormBusiness/FormBasicInfo/FormGroup/InsertFormGroupInfo'

// 获取表单组别实体API
export const GET_FORMGROUP_ENTITY_API = 'FormBusiness/FormBasicInfo/FormGroup/GetFormGroupEntity'

// 获取表单组别列表API
export const GET_FORMGROUP_LIST_API = 'FormBusiness/FormBasicInfo/FormGroup/GetFormGroupPage'

// 更新表单组别API
export const UPDATE_FORMGROUP_API = 'FormBusiness/FormBasicInfo/FormGroup/UpdateFormGroupInfo'

// 删除表单组别API
export const DELETE_FORMGROUP_ENTITY_API = 'FormBusiness/FormBasicInfo/FormGroup/DeleteFormGroupInfo'