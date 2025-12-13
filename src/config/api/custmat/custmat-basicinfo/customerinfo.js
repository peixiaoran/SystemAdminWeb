/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 客户实体API
export const GET_CUSTOMER_ENTITY_API = {
    GET_CUSTOMER_ENTITY: 'CustMat/CustMatBasicInfo/CustomerInfo/GetCustomerEntity'
}

// 客户列表API
export const GET_CUSTOMER_LIST_API = {
    GET_CUSTOMER_LIST: 'CustMat/CustMatBasicInfo/CustomerInfo/GetCustomerPage'
}

// 客户新增API
export const INSERT_CUSTOMER_API = {
    INSERT_CUSTOMER: 'CustMat/CustMatBasicInfo/CustomerInfo/InsertCustomerInfo'
}

// 客户更新API
export const UPDATE_CUSTOMER_API = {
    UPDATE_CUSTOMER: 'CustMat/CustMatBasicInfo/CustomerInfo/UpdateCustomerInfo'
}

// 客户删除API
export const DELETE_CUSTOMER_API = {
    DELETE_CUSTOMER: 'CustMat/CustMatBasicInfo/CustomerInfo/DeleteCustomerInfo'
}
