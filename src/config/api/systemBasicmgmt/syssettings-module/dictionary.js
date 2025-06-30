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

// 字典实体API
export const GET_DICTIONARY_ENTITY_API = {
    GET_DICTIONARY_ENTITY: 'SystemBasicMgmt/SystemSettingsModule/Dictionary/GetDictionaryInfoEntity'
}

// 字典分页API
export const GET_DICTIONARY_PAGES_API = {
  GET_DICTIONARY_PAGES: 'SystemBasicMgmt/SystemSettingsModule/Dictionary/GetDictionaryInfoPage'
}

// 新增字典API
export const INSERT_DICTIONARY_API = {
  INSERT_DICTIONARY: 'SystemBasicMgmt/SystemSettingsModule/Dictionary/InsertDictionaryInfo'
}

// 更新字典API
export const UPDATE_DICTIONARY_API = {
  UPDATE_DICTIONARY: 'SystemBasicMgmt/SystemSettingsModule/Dictionary/UpdateDictionaryInfo'
}

// 删除字典API
export const DELETE_DICTIONARY_API = {
  DELETE_DICTIONARY: 'SystemBasicMgmt/SystemSettingsModule/Dictionary/DeleteDictionaryInfo'
}