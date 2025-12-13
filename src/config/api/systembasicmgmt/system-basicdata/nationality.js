/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

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