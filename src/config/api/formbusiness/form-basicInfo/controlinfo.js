/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 新增控件实体API
export const INSERT_CONTROL_ENTITY_API = 'FormBusiness/FormBasicInfo/ControlInfo/InsertControlInfo'

// 获取控件分页API
export const GET_CONTROL_PAGE_API = 'FormBusiness/FormBasicInfo/ControlInfo/GetControlInfoPage'

// 删除控件API
export const DELETE_CONTROL_API = 'FormBusiness/FormBasicInfo/ControlInfo/DeleteControlInfo'
