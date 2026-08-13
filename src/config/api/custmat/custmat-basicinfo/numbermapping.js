/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 料号对照实体API
export const GET_NUMBER_MAPPING_ENTITY_API = {
    GET_NUMBER_MAPPING_ENTITY: 'CustMat/CustMatBasicInfo/NumberMapping/GetNumberMappingEntity'
}

// 料号对照列表API
export const GET_NUMBER_MAPPING_LIST_API = {
    GET_NUMBER_MAPPING_LIST: 'CustMat/CustMatBasicInfo/NumberMapping/GetNumberMappingPage'
}

// 料号对照新增API
export const INSERT_NUMBER_MAPPING_API = {
    INSERT_NUMBER_MAPPING: 'CustMat/CustMatBasicInfo/NumberMapping/InsertNumberMapping'
}

// 料号对照更新API
export const UPDATE_NUMBER_MAPPING_API = {
    UPDATE_NUMBER_MAPPING: 'CustMat/CustMatBasicInfo/NumberMapping/UpdateNumberMapping'
}

// 料号对照删除API
export const DELETE_NUMBER_MAPPING_API = {
    DELETE_NUMBER_MAPPING: 'CustMat/CustMatBasicInfo/NumberMapping/DeleteNumberMapping'
}

// 客户料号模糊搜索下拉API
export const GET_CUSTOMER_PART_NUMBER_DROP_API = {
    GET_CUSTOMER_PART_NUMBER_DROP: 'CustMat/CustMatBasicInfo/NumberMapping/GetCustomerPartNumberDrop'
}

// 公司料号模糊搜索下拉API
export const GET_COMPANY_PART_NUMBER_DROP_API = {
    GET_COMPANY_PART_NUMBER_DROP: 'CustMat/CustMatBasicInfo/NumberMapping/GetCompanyPartNumberDrop'
}

// 料号对照导入模板下载API
export const GET_NUMBER_MAPPING_TEMPLATE_API = {
    GET_NUMBER_MAPPING_TEMPLATE: 'CustMat/CustMatBasicInfo/NumberMapping/GetNumberMappingTemplate'
}

// 料号对照导入API
export const IMPORT_NUMBER_MAPPING_API = {
    IMPORT_NUMBER_MAPPING: 'CustMat/CustMatBasicInfo/NumberMapping/ImportNumberMapping'
}

// 料号对照导出API
export const GET_NUMBER_MAPPING_EXCEL_API = {
    GET_NUMBER_MAPPING_EXCEL: 'CustMat/CustMatBasicInfo/NumberMapping/GetNumberMappingExcel'
}
