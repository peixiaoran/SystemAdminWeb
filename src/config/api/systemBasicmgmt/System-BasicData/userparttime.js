/**
 * 员工兼任API配置文件
 * 集中管理员工兼任相关API接口
 */

// 员工兼任分页查询API
export const GET_USER_PARTTIME_PAGES_API = {
    GET_USER_PARTTIME_PAGES: 'SystemBasicMgmt/SystemBasicData/UserPartTime/GetUserPartTimePage'
}

// 员工分页API
export const GET_USER_PAGES_API = {
    GET_USER_PAGES: 'SystemBasicMgmt/SystemBasicData/UserPartTime/GetUserInfoPage'
}

// 新增员工兼任API
export const INSERT_USER_PARTTIME_API = {
    INSERT_USER_PARTTIME: 'SystemBasicMgmt/SystemBasicData/UserPartTime/InsertUserPartTime'
}

// 删除员工兼任API
export const DELETE_USER_PARTTIME_API = {
    DELETE_USER_PARTTIME: 'SystemBasicMgmt/SystemBasicData/UserPartTime/DeleteUserPartTime'
}

// 部门下拉框API
export const GET_DEPARTMENT_DROPDOWN_API = {
    GET_DEPARTMENT_DROPDOWN: 'SystemBasicMgmt/SystemBasicData/UserPartTime/GetDepartmentDropDown'
}

// 职级下拉框API
export const GET_POSITION_DROPDOWN_API = {
    GET_POSITION_DROPDOWN: 'SystemBasicMgmt/SystemBasicData/UserPartTime/GetUserPositionDropDown'
}

// 职业下拉框API
export const GET_LABOR_DROPDOWN_API = {
    GET_LABOR_DROPDOWN: 'SystemBasicMgmt/SystemBasicData/UserPartTime/GetLabor'
}