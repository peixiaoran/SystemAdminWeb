/**
 * 用户兼任API配置文件
 * 集中管理用户兼任相关API接口
 */

// 用户兼任分页查询API
export const GET_USER_PARTTIME_PAGES_API = {
    GET_USER_PARTTIME_PAGES: 'SystemBasicMgmt/UserSettings/UserPartTime/GetUserPartTimePage'
}

// 用户分页API
export const GET_USER_PARTTIMEVIEW_API = {
    GET_USER_PARTTIMEVIEW: 'SystemBasicMgmt/UserSettings/UserPartTime/GetUserPartTimeView'
}

// 用户兼任实体API
export const GET_USER_PARTTIMEENTITY_API = {
    GET_USER_PARTTIMEENTITY: 'SystemBasicMgmt/UserSettings/UserPartTime/GetUserPartTimeEntity'
}

// 新增用户兼任API
export const INSERT_USER_PARTTIME_API = {
    INSERT_USER_PARTTIME: 'SystemBasicMgmt/UserSettings/UserPartTime/InsertUserPartTime'
}

// 删除用户兼任API
export const DELETE_USER_PARTTIME_API = {
    DELETE_USER_PARTTIME: 'SystemBasicMgmt/UserSettings/UserPartTime/DeleteUserPartTime'
}

// 更新用户兼任API
export const UPDATE_USER_PARTTIME_API = {
    UPDATE_USER_PARTTIME: 'SystemBasicMgmt/UserSettings/UserPartTime/UpdateUserPartTime'
}

// 部门下拉框API
export const GET_DEPARTMENT_DROPDOWN_API = {
    GET_DEPARTMENT_DROPDOWN: 'SystemBasicMgmt/UserSettings/UserPartTime/GetDepartmentDrop'
}

// 职级下拉框API
export const GET_POSITION_DROPDOWN_API = {
    GET_POSITION_DROPDOWN: 'SystemBasicMgmt/UserSettings/UserPartTime/GetPositionDrop'
}

// 职业下拉框API
export const GET_LABOR_DROPDOWN_API = {
    GET_LABOR_DROPDOWN: 'SystemBasicMgmt/UserSettings/UserPartTime/GetLaborDrop'
}