/**
 * 业务人员维护API配置文件
 * 集中管理业务人员相关API接口
 */

// 业务人员分页查询API
export const GET_SALES_USER_PAGE_API = {
    GET_SALES_USER_PAGE: 'CustMat/SalesMgmt/SalesUser/GetSalesUserPage'
}

// 业务人员实体查询API
export const GET_SALES_USER_ENTITY_API = {
    GET_SALES_USER_ENTITY: 'CustMat/SalesMgmt/SalesUser/GetSalesUserEntity'
}

// 新增业务人员API
export const INSERT_SALES_USER_API = {
    INSERT_SALES_USER: 'CustMat/SalesMgmt/SalesUser/InsertSalesUser'
}

// 更新业务人员API
export const UPDATE_SALES_USER_API = {
    UPDATE_SALES_USER: 'CustMat/SalesMgmt/SalesUser/UpdateSalesUser'
}

// 删除业务人员API
export const DELETE_SALES_USER_API = {
    DELETE_SALES_USER: 'CustMat/SalesMgmt/SalesUser/DeleteSalesUser'
}

// 业务类型下拉框API
export const GET_SALES_TYPE_DROP_API = {
    GET_SALES_TYPE_DROP: 'CustMat/SalesMgmt/SalesUser/GetSalesTypeDrop'
}

// 部门树下拉框API（弹出框人员选择使用）
export const GET_DEPARTMENT_DROP_API = {
    GET_DEPARTMENT_DROP: 'CustMat/SalesMgmt/SalesUser/GetDepartmentDrop'
}

// 部门树下拉框API（主页面筛选使用）
export const GET_SALES_USER_DEPARTMENT_PAGE_API = {
    GET_SALES_USER_DEPARTMENT_PAGE: 'CustMat/SalesMgmt/SalesUser/GetSalesUserDepartmentPage'
}

// 用户分页查询API（用于新增时选择人员）
export const GET_USER_PAGE_API = {
    GET_USER_PAGE: 'CustMat/SalesMgmt/SalesUser/GetUserPage'
}
