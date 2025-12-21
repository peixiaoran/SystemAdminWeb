/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 字典实体API
export const GET_DICTIONARY_ENTITY_API = {
    GET_DICTIONARY_ENTITY: 'SystemBasicMgmt/SystemConfig/DictionaryInfo/GetDictionaryInfoEntity'
}

// 字典分页API
export const GET_DICTIONARY_PAGES_API = {
  GET_DICTIONARY_PAGES: 'SystemBasicMgmt/SystemConfig/DictionaryInfo/GetDictionaryInfoPage'
}

// 新增字典API
export const INSERT_DICTIONARY_API = {
  INSERT_DICTIONARY: 'SystemBasicMgmt/SystemConfig/DictionaryInfo/InsertDictionaryInfo'
}

// 更新字典API
export const UPDATE_DICTIONARY_API = {
  UPDATE_DICTIONARY: 'SystemBasicMgmt/SystemConfig/DictionaryInfo/UpdateDictionaryInfo'
}

// 删除字典API
export const DELETE_DICTIONARY_API = {
  DELETE_DICTIONARY: 'SystemBasicMgmt/SystemConfig/DictionaryInfo/DeleteDictionaryInfo'
}

// 获取模块下拉列表API
export const GET_MODULE_DROP_DOWN_API = {
  GET_MODULE_DROP_DOWN: 'SystemBasicMgmt/SystemConfig/DictionaryInfo/GetModuleDropDown'
}

// 获取字典类型下拉列表API
export const GET_DIC_TYPE_DROP_DOWN_API = {
  GET_DIC_TYPE_DROP_DOWN: 'SystemBasicMgmt/SystemConfig/DictionaryInfo/GetDicTypeDropDown'
}