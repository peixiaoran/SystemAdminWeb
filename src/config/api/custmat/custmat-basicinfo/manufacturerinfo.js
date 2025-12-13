/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 厂商实体API
export const GET_MANUFACTURER_ENTITY_API = {
    GET_MANUFACTURER_ENTITY: 'SystemBasicMgmt/SystemBasicData/Manufacturer/GetManufacturerInfoEntity'
}

// 厂商分页API
export const GET_MANUFACTURER_PAGE_API = {
    GET_MANUFACTURER_PAGE: 'SystemBasicMgmt/SystemBasicData/Manufacturer/GetManufacturerInfoPage'
}

// 厂商新增API
export const INSERT_MANUFACTURER_API = {
    INSERT_MANUFACTURER: 'SystemBasicMgmt/SystemBasicData/Manufacturer/InsertManufacturerInfo'
}

// 厂商更新API
export const UPDATE_MANUFACTURER_API = {
    UPDATE_MANUFACTURER: 'SystemBasicMgmt/SystemBasicData/Manufacturer/UpdateManufacturerInfo'
}

// 厂商删除API
export const DELETE_MANUFACTURER_API = {
    DELETE_MANUFACTURER: 'SystemBasicMgmt/SystemBasicData/Manufacturer/DeleteManufacturerInfo'
}
