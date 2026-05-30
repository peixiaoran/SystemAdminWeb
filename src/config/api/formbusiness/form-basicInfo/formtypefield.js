/**
 * API配置文件
 * 集中管理表单类型栏位相关 API
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 新增表单类型栏位 API
export const INSERT_FORMTYPEFIELD_ENTITY_API = 'FormBusiness/FormBasicInfo/FormTypeField/InsertFormTypeField'

// 获取表单类型栏位分页 API
export const GET_FORMTYPEFIELD_PAGE_API = 'FormBusiness/FormBasicInfo/FormTypeField/GetFormTypeFieldPage'

// 获取表单类型栏位实体 API
export const GET_FORMTYPEFIELD_ENTITY_API = 'FormBusiness/FormBasicInfo/FormTypeField/GetFormTypeFieldEntity'

// 更新表单类型栏位 API
export const UPDATE_FORMTYPEFIELD_API = 'FormBusiness/FormBasicInfo/FormTypeField/UpdateFormTypeField'

// 删除表单类型栏位 API
export const DELETE_FORMTYPEFIELD_API = 'FormBusiness/FormBasicInfo/FormTypeField/DeleteFormTypeField'

// 获取表单组别下拉列表 API
export const GET_FORMGROUP_DROPDOWN_API = 'FormBusiness/FormBasicInfo/FormTypeField/GetFormGroupDrop'

// 获取表单类型下拉列表 API
export const GET_FORMTYPE_DROPDOWN_API = 'FormBusiness/FormBasicInfo/FormTypeField/GetFormTypeDrop'
