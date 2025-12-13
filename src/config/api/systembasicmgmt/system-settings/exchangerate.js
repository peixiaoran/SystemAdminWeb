/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 查询汇率分页API
export const GET_EXCHANGE_RATE_PAGES_API = {
  GET_EXCHANGE_RATE_PAGES: 'SystemBasicMgmt/SystemSettings/ExchangeRate/GetExchangeRatePage'
}

// 查询汇率详情API
export const GET_EXCHANGE_RATE_ENTITY_API = {
  GET_EXCHANGE_RATE_ENTITY: 'SystemBasicMgmt/SystemSettings/ExchangeRate/GetExchangeRateEntity'
}

// 查询币别下拉框API
export const GET_CURRENCY_DROPDOWN_API = {
  GET_CURRENCY_DROPDOWN: 'SystemBasicMgmt/SystemSettings/ExchangeRate/GetCurrencyInfoDropDown'
}

// 新增汇率API
export const INSERT_EXCHANGE_RATE_API = {
  INSERT_EXCHANGE_RATE: 'SystemBasicMgmt/SystemSettings/ExchangeRate/InsertExchangeRate'
}

// 更新汇率API
export const UPDATE_EXCHANGE_RATE_API = {
  UPDATE_EXCHANGE_RATE: 'SystemBasicMgmt/SystemSettings/ExchangeRate/UpdateExchangeRate'
}

// 删除汇率API
export const DELETE_EXCHANGE_RATE_API = {
  DELETE_EXCHANGE_RATE: 'SystemBasicMgmt/SystemSettings/ExchangeRate/DeleteExchangeRate'
}