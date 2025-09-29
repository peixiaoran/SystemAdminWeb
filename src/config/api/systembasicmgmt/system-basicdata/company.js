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

// 公司分页API
export const GET_COMPANY_ENTITY_API = {
    GET_COMPANY_ENTITY: 'SystemBasicMgmt/SystemBasicData/CompanyInfo/GetCompanyInfoEntity'
}

// 公司分页API
export const GET_COMPANY_PAGES_API = {
  GET_COMPANY_PAGES: 'SystemBasicMgmt/SystemBasicData/CompanyInfo/GetCompanyInfoPage'
}

// 公司新增API
export const INSERT_COMPANY_API = {
  INSERT_COMPANY: 'SystemBasicMgmt/SystemBasicData/CompanyInfo/InsertCompanyInfo'
}

// 公司删除API
export const DELETE_COMPANY_API = {
  DELETE_COMPANY: 'SystemBasicMgmt/SystemBasicData/CompanyInfo/DeleteCompanyInfo'
}

// 公司更新API
export const UPDATE_COMPANY_API = {
  UPDATE_COMPANY: 'SystemBasicMgmt/SystemBasicData/CompanyInfo/UpdateCompanyInfo'
}