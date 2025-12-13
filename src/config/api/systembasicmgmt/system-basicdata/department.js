/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 部门实体API
export const GET_DEPARTMENT_ENTITY_API = {
    GET_DEPARTMENT_ENTITY: 'SystemBasicMgmt/SystemBasicData/DepartmentInfo/GetDepartmentInfoEntity'
}

// 部门树形API
export const GET_DEPARTMENT_TREE_API = {
  GET_DEPARTMENT_TREE: 'SystemBasicMgmt/SystemBasicData/DepartmentInfo/GetDepartmentInfoTree'
}

// 部门新增API
export const INSERT_DEPARTMENT_API = {
  INSERT_DEPARTMENT: 'SystemBasicMgmt/SystemBasicData/DepartmentInfo/InsertDepartmentInfo'
}

// 部门删除API
export const DELETE_DEPARTMENT_API = {
  DELETE_DEPARTMENT: 'SystemBasicMgmt/SystemBasicData/DepartmentInfo/DeleteDepartmentInfo'
}

// 部门更新API
export const UPDATE_DEPARTMENT_API = {
  UPDATE_DEPARTMENT: 'SystemBasicMgmt/SystemBasicData/DepartmentInfo/UpdateDepartmentInfo'
}

// 上级部门下拉框API
export const GET_DEPARTMENT_TREE_DROPDOWN_API = {
  GET_DEPARTMENT_TREE_DROPDOWN: 'SystemBasicMgmt/SystemBasicData/DepartmentInfo/GetDepartmentDropDown'
}

// 部门级别下拉框API
export const GET_DEPARTMENTLEVEL_DROPDOWN_API = {
  GET_DEPARTMENTLEVEL_DROPDOWN: 'SystemBasicMgmt/SystemBasicData/DepartmentInfo/GetDepartmentLevelDropdown'
}