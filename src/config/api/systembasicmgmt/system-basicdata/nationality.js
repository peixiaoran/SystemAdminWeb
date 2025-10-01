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

// 国籍分页API
export const GET_NATIONALITY_ENTITY_API = {
    GET_NATIONALITY_ENTITY: 'SystemBasicMgmt/SystemBasicData/NationalityInfo/GetNationalityEntity'
}

// 国籍列表API
export const GET_NATIONALITY_LIST_API = {
  GET_NATIONALITY_LIST: 'SystemBasicMgmt/SystemBasicData/NationalityInfo/GetNationalityInfoList'
}

// 国籍新增API
export const INSERT_NATIONALITY_API = {
  INSERT_NATIONALITY: 'SystemBasicMgmt/SystemBasicData/NationalityInfo/InsertNationalityInfo'
}

// 国籍删除API
export const DELETE_NATIONALITY_API = {
  DELETE_NATIONALITY: 'SystemBasicMgmt/SystemBasicData/NationalityInfo/DeleteNationalityInfo'
}

// 国籍更新API
export const UPDATE_NATIONALITY_API = {
  UPDATE_NATIONALITY: 'SystemBasicMgmt/SystemBasicData/NationalityInfo/UpdateNationalityInfo'
}