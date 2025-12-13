/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 货币实体API
export const GET_CURRENCY_ENTITY_API = {
    GET_CURRENCY_ENTITY: 'SystemBasicMgmt/SystemSettings/CurrencyInfo/GetCurrencyInfoEntity'
}

// 货币分页API
export const GET_CURRENCY_PAGES_API = {
  GET_CURRENCY_PAGES: 'SystemBasicMgmt/SystemSettings/CurrencyInfo/GetCurrencyInfoPage'
}

// 新增货币API
export const INSERT_CURRENCY_API = {
  INSERT_CURRENCY: 'SystemBasicMgmt/SystemSettings/CurrencyInfo/InsertCurrencyInfo'
}

// 更新货币API
export const UPDATE_CURRENCY_API = {
  UPDATE_CURRENCY: 'SystemBasicMgmt/SystemSettings/CurrencyInfo/UpdateCurrencyInfo'
}

// 删除货币API
export const DELETE_CURRENCY_API = {
  DELETE_CURRENCY: 'SystemBasicMgmt/SystemSettings/CurrencyInfo/DeleteCurrencyInfo'
}