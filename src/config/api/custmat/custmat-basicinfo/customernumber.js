/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 客户料号实体API
export const GET_CUSTOMER_NUMBER_ENTITY_API = {
    GET_CUSTOMER_NUMBER_ENTITY: 'CustMat/CustMatBasicInfo/CustomerNumber/GetCustomerNumberEntity'
}

// 客户料号列表API
export const GET_CUSTOMER_NUMBER_LIST_API = {
    GET_CUSTOMER_NUMBER_LIST: 'CustMat/CustMatBasicInfo/CustomerNumber/GetCustomerNumberPage'
}

// 客户料号新增API
export const INSERT_CUSTOMER_NUMBER_API = {
    INSERT_CUSTOMER_NUMBER: 'CustMat/CustMatBasicInfo/CustomerNumber/InsertCustomerNumber'
}

// 客户料号更新API
export const UPDATE_CUSTOMER_NUMBER_API = {
    UPDATE_CUSTOMER_NUMBER: 'CustMat/CustMatBasicInfo/CustomerNumber/UpdateCustomerNumber'
}

// 客户料号删除API
export const DELETE_CUSTOMER_NUMBER_API = {
    DELETE_CUSTOMER_NUMBER: 'CustMat/CustMatBasicInfo/CustomerNumber/DeleteCustomerNumber'
}

// 客户料号导入模板下载API
export const GET_CUSTOMER_NUMBER_TEMPLATE_API = {
    GET_CUSTOMER_NUMBER_TEMPLATE: 'CustMat/CustMatBasicInfo/CustomerNumber/GetCustomerNumberTemplate'
}

// 客户料号导入API
export const IMPORT_CUSTOMER_NUMBER_API = {
    IMPORT_CUSTOMER_NUMBER: 'CustMat/CustMatBasicInfo/CustomerNumber/ImportCustomerNumber'
}

// 客户料号导出API
export const GET_CUSTOMER_NUMBER_EXCEL_API = {
    GET_CUSTOMER_NUMBER_EXCEL: 'CustMat/CustMatBasicInfo/CustomerNumber/GetCustomerNumberExcel'
}

// 客户下拉API
export const GET_CUSTOMER_DROP_API = {
    GET_CUSTOMER_DROP: 'CustMat/CustMatBasicInfo/CustomerNumber/GetCustomerDrop'
}
