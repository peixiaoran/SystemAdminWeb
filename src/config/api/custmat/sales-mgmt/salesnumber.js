/**
 * 业务人员料号维护API配置文件
 * 集中管理业务人员料号相关API接口
 */

// 业务人员料号分页查询API
export const GET_SALES_NUMBER_PAGE_API = {
    GET_SALES_NUMBER_PAGE: 'CustMat/SalesMgmt/SalesNumber/GetSalesNumberPage'
}

// 业务人员料号实体查询API
export const GET_SALES_NUMBER_ENTITY_API = {
    GET_SALES_NUMBER_ENTITY: 'CustMat/SalesMgmt/SalesNumber/GetSalesNumberEntity'
}

// 新增业务人员料号API
export const INSERT_SALES_NUMBER_API = {
    INSERT_SALES_NUMBER: 'CustMat/SalesMgmt/SalesNumber/InsertSalesNumber'
}

// 更新业务人员料号API
export const UPDATE_SALES_NUMBER_API = {
    UPDATE_SALES_NUMBER: 'CustMat/SalesMgmt/SalesNumber/UpdateSalesNumber'
}

// 删除业务人员料号API
export const DELETE_SALES_NUMBER_API = {
    DELETE_SALES_NUMBER: 'CustMat/SalesMgmt/SalesNumber/DeleteSalesNumber'
}

// 业务人员下拉框API
export const GET_SALES_USER_DROP_API = {
    GET_SALES_USER_DROP: 'CustMat/SalesMgmt/SalesNumber/GetSalesUserDrop'
}

// 公司料号远程搜索下拉框API
export const GET_COMPANY_PART_NUMBER_DROP_API = {
    GET_COMPANY_PART_NUMBER_DROP: 'CustMat/SalesMgmt/SalesNumber/GetCompanyNumberDrop'
}

// 料号详情查询API
export const GET_PART_NUMBER_DETAIL_API = {
    GET_PART_NUMBER_DETAIL: 'CustMat/SalesMgmt/SalesNumber/GetPartNumberDetail'
}
