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

// 查询汇率分页API
export const GET_EXCHANGE_RATE_PAGES_API = {
  GET_EXCHANGE_RATE_PAGES: 'SystemBasicMgmt/SystemSettings/ExchangeRateInfo/GetExchangeRateInfoPage'
}

// 查询汇率详情API
export const GET_EXCHANGE_RATE_ENTITY_API = {
  GET_EXCHANGE_RATE_ENTITY: 'SystemBasicMgmt/SystemSettings/ExchangeRateInfo/GetExchangeRateInfoEntity'
}

// 查询币别下拉框API
export const GET_CURRENCY_DROPDOWN_API = {
  GET_CURRENCY_DROPDOWN: 'SystemBasicMgmt/SystemSettings/ExchangeRateInfo/GetCurrencyInfoDropDown'
}

// 新增汇率API
export const INSERT_EXCHANGE_RATE_API = {
  INSERT_EXCHANGE_RATE: 'SystemBasicMgmt/SystemSettings/ExchangeRateInfo/InsertExchangeRateInfo'
}

// 更新汇率API
export const UPDATE_EXCHANGE_RATE_API = {
  UPDATE_EXCHANGE_RATE: 'SystemBasicMgmt/SystemSettings/ExchangeRateInfo/UpdateExchangeRateInfo'
}

// 删除汇率API
export const DELETE_EXCHANGE_RATE_API = {
  DELETE_EXCHANGE_RATE: 'SystemBasicMgmt/SystemSettings/ExchangeRateInfo/DeleteExchangeRateInfo'
}