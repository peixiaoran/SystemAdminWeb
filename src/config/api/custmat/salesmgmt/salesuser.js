/**
 * 业务人员维护API配置文件
 * 集中管理业务人员相关API接口
 */

// 业务人员分页查询API
export const GET_SALES_USER_PAGE_API = {
    GET_SALES_USER_PAGE: 'CustMat/Sales/SalesUser/GetSalesUserPage'
}

// 业务人员实体查询API
export const GET_SALES_USER_ENTITY_API = {
    GET_SALES_USER_ENTITY: 'CustMat/Sales/SalesUser/GetSalesUserEntity'
}

// 新增业务人员API
export const INSERT_SALES_USER_API = {
    INSERT_SALES_USER: 'CustMat/Sales/SalesUser/InsertSalesUser'
}

// 更新业务人员API
export const UPDATE_SALES_USER_API = {
    UPDATE_SALES_USER: 'CustMat/Sales/SalesUser/UpdateSalesUser'
}

// 删除业务人员API
export const DELETE_SALES_USER_API = {
    DELETE_SALES_USER: 'CustMat/Sales/SalesUser/DeleteSalesUser'
}

// 业务类型下拉框API
export const GET_SALES_TYPE_DROP_API = {
    GET_SALES_TYPE_DROP: 'CustMat/Sales/SalesUser/GetSalesTypeDrop'
}

// 部门树下拉框API
export const GET_DEPARTMENT_DROP_API = {
    GET_DEPARTMENT_DROP: 'CustMat/Sales/SalesUser/GetDepartmentDrop'
}

// 用户分页查询API（用于新增时选择人员）
export const GET_USER_PAGE_API = {
    GET_USER_PAGE: 'CustMat/Sales/SalesUser/GetUserPage'
}
