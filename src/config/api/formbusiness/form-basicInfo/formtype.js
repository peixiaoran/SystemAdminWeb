/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

// 环境变量
const env = import.meta.env

// 环境标识
export const ENV_MODE = env.MODE
export const IS_DEV = env.DEV
export const IS_PROD = env.PROD

// API基础配置
export const BASE_API_URL = env.VITE_API_BASE_URL
export const API_TIMEOUT = parseInt(env.VITE_API_TIMEOUT || '15000')
export const ENABLE_LOGS = env.VITE_ENABLE_LOGS === 'true'

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