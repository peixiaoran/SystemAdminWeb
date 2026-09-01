/**
 * 业务人员料号维护API配置文件
 * 集中管理业务人员料号相关API接口
 */

// 业务人员料号分页查询API
export const GET_NUMBER_ASSIGN_PAGE_API = {
    GET_NUMBER_ASSIGN_PAGE: 'CustMat/SalesMgmt/NumberAssign/GetNumberAssignPage'
}

// 业务人员料号实体查询API
export const GET_NUMBER_ASSIGN_ENTITY_API = {
    GET_NUMBER_ASSIGN_ENTITY: 'CustMat/SalesMgmt/NumberAssign/GetNumberAssignEntity'
}

// 新增业务人员料号API
export const INSERT_NUMBER_ASSIGN_API = {
    INSERT_NUMBER_ASSIGN: 'CustMat/SalesMgmt/NumberAssign/InsertNumberAssign'
}

// 更新业务人员料号API
export const UPDATE_NUMBER_ASSIGN_API = {
    UPDATE_NUMBER_ASSIGN: 'CustMat/SalesMgmt/NumberAssign/UpdateNumberAssign'
}

// 删除业务人员料号API
export const DELETE_NUMBER_ASSIGN_API = {
    DELETE_NUMBER_ASSIGN: 'CustMat/SalesMgmt/NumberAssign/DeleteNumberAssign'
}

// 业务人员下拉框API
export const GET_SALES_USER_DROP_API = {
    GET_SALES_USER_DROP: 'CustMat/SalesMgmt/NumberAssign/GetSalesUserDrop'
}

// 公司料号远程搜索下拉框API
export const GET_COMPANY_PART_NUMBER_DROP_API = {
    GET_COMPANY_PART_NUMBER_DROP: 'CustMat/SalesMgmt/NumberAssign/GetCompanyNumberDrop'
}

// 料号详情查询API
export const GET_PART_NUMBER_DETAIL_API = {
    GET_PART_NUMBER_DETAIL: 'CustMat/SalesMgmt/NumberAssign/GetPartNumberDetail'
}

// 客户下拉框API
export const GET_CUSTOMER_DROP_API = {
    GET_CUSTOMER_DROP: 'CustMat/SalesMgmt/NumberAssign/GetCustomerDrop'
}

// 按客户批量新增/覆盖业务人员料号API
export const BATCH_UPSERT_NUMBER_ASSIGN_API = {
    BATCH_UPSERT_NUMBER_ASSIGN: 'CustMat/SalesMgmt/NumberAssign/BatchUpsertNumberAssign'
}

// 导出业务人员料号Excel API
export const EXPORT_NUMBER_ASSIGN_EXCEL_API = {
    EXPORT_NUMBER_ASSIGN_EXCEL: 'CustMat/SalesMgmt/NumberAssign/ExportNumberAssignExcel'
}
