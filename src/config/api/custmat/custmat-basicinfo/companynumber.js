/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 料号实体API
export const GET_PART_NUMBER_ENTITY_API = {
    GET_PART_NUMBER_ENTITY: 'CustMat/CustMatBasicInfo/PartNumber/GetPartNumberEntity'
}

// 料号列表API
export const GET_PART_NUMBER_LIST_API = {
    GET_PART_NUMBER_LIST: 'CustMat/CustMatBasicInfo/PartNumber/GetPartNumberPage'
}

// 料号新增API
export const INSERT_PART_NUMBER_API = {
    INSERT_PART_NUMBER: 'CustMat/CustMatBasicInfo/PartNumber/InsertPartNumber'
}

// 料号更新API
export const UPDATE_PART_NUMBER_API = {
    UPDATE_PART_NUMBER: 'CustMat/CustMatBasicInfo/PartNumber/UpdatePartNumber'
}

// 料号删除API
export const DELETE_PART_NUMBER_API = {
    DELETE_PART_NUMBER: 'CustMat/CustMatBasicInfo/PartNumber/DeletePartNumber'
}

// 料号类型下拉API
export const GET_PART_TYPE_DROP_API = {
    GET_PART_TYPE_DROP: 'CustMat/CustMatBasicInfo/PartNumber/GetPartTypeDrop'
}

// 物料分类下拉API
export const GET_CATEGORY_DROP_API = {
    GET_CATEGORY_DROP: 'CustMat/CustMatBasicInfo/PartNumber/GetCategoryDrop'
}

// 来源类型下拉API
export const GET_SOURCE_TYPE_DROP_API = {
    GET_SOURCE_TYPE_DROP: 'CustMat/CustMatBasicInfo/PartNumber/GetSourceTypeDrop'
}

// 料号导入模板下载API
export const GET_PART_NUMBER_TEMPLATE_API = {
    GET_PART_NUMBER_TEMPLATE: 'CustMat/CustMatBasicInfo/PartNumber/GetPartNumberTemplate'
}

// 料号导入API
export const IMPORT_PART_NUMBER_API = {
    IMPORT_PART_NUMBER: 'CustMat/CustMatBasicInfo/PartNumber/ImportPartNumber'
}

// 料号导出API
export const GET_PART_NUMBER_EXCEL_API = {
    GET_PART_NUMBER_EXCEL: 'CustMat/CustMatBasicInfo/PartNumber/GetPartNumberExcel'
}
