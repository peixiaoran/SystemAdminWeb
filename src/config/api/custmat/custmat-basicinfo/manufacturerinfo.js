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

// 厂商实体API
export const GET_MANUFACTURER_ENTITY_API = {
    GET_MANUFACTURER_ENTITY: 'CustMat/CustMatBasicInfo/ManufacturerInfo/GetManufacturerInfoEntity'
}

// 厂商分页API
export const GET_MANUFACTURER_PAGE_API = {
    GET_MANUFACTURER_PAGE: 'CustMat/CustMatBasicInfo/ManufacturerInfo/GetManufacturerInfoPage'
}

// 厂商新增API
export const INSERT_MANUFACTURER_API = {
    INSERT_MANUFACTURER: 'CustMat/CustMatBasicInfo/ManufacturerInfo/InsertManufacturerInfo'
}

// 厂商更新API
export const UPDATE_MANUFACTURER_API = {
    UPDATE_MANUFACTURER: 'CustMat/CustMatBasicInfo/ManufacturerInfo/UpdateManufacturerInfo'
}

// 厂商删除API
export const DELETE_MANUFACTURER_API = {
    DELETE_MANUFACTURER: 'CustMat/CustMatBasicInfo/ManufacturerInfo/DeleteManufacturerInfo'
}
