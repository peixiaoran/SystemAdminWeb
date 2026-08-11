/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 公司料号实体API
export const GET_COMPANY_NUMBER_ENTITY_API = {
    GET_COMPANY_NUMBER_ENTITY: 'CustMat/CustMatBasicInfo/CompanyNumber/GetCompanyNumberEntity'
}

// 公司料号列表API
export const GET_COMPANY_NUMBER_LIST_API = {
    GET_COMPANY_NUMBER_LIST: 'CustMat/CustMatBasicInfo/CompanyNumber/GetCompanyNumberPage'
}

// 公司料号新增API
export const INSERT_COMPANY_NUMBER_API = {
    INSERT_COMPANY_NUMBER: 'CustMat/CustMatBasicInfo/CompanyNumber/InsertCompanyNumber'
}

// 公司料号更新API
export const UPDATE_COMPANY_NUMBER_API = {
    UPDATE_COMPANY_NUMBER: 'CustMat/CustMatBasicInfo/CompanyNumber/UpdateCompanyNumber'
}

// 公司料号删除API
export const DELETE_COMPANY_NUMBER_API = {
    DELETE_COMPANY_NUMBER: 'CustMat/CustMatBasicInfo/CompanyNumber/DeleteCompanyNumber'
}

// 料号类型下拉API
export const GET_PART_TYPE_DROP_API = {
    GET_PART_TYPE_DROP: 'CustMat/CustMatBasicInfo/CompanyNumber/GetPartTypeDrop'
}

// 物料分类下拉API
export const GET_CATEGORY_DROP_API = {
    GET_CATEGORY_DROP: 'CustMat/CustMatBasicInfo/CompanyNumber/GetCategoryDrop'
}

// 来源类型下拉API
export const GET_SOURCE_TYPE_DROP_API = {
    GET_SOURCE_TYPE_DROP: 'CustMat/CustMatBasicInfo/CompanyNumber/GetSourceTypeDrop'
}

// 公司料号导入模板下载API
export const GET_COMPANY_NUMBER_TEMPLATE_API = {
    GET_COMPANY_NUMBER_TEMPLATE: 'CustMat/CustMatBasicInfo/CompanyNumber/GetCompanyNumberTemplate'
}

// 公司料号导入API
export const IMPORT_COMPANY_NUMBER_API = {
    IMPORT_COMPANY_NUMBER: 'CustMat/CustMatBasicInfo/CompanyNumber/ImportCompanyNumber'
}

// 公司料号导出API
export const GET_COMPANY_NUMBER_EXCEL_API = {
    GET_COMPANY_NUMBER_EXCEL: 'CustMat/CustMatBasicInfo/CompanyNumber/GetCompanyNumberExcel'
}
