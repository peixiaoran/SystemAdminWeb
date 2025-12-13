/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'

// 新增事件实体API
export const INSERT_EVENT_ENTITY_API = 'FormBusiness/FormBasicInfo/EventInfo/InsertEventInfo'

// 获取事件分页API
export const GET_EVENT_PAGE_API = 'FormBusiness/FormBasicInfo/EventInfo/GetEventInfoPage'

// 删除事件API
export const DELETE_EVENT_API = 'FormBusiness/FormBasicInfo/EventInfo/DeleteEventInfo'

// 获取控件下拉列表API
export const GET_CONTROL_DROPDOWN_API = 'FormBusiness/FormBasicInfo/EventInfo/GetControlDropDown'

// 获取事件实体API
export const GET_EVENT_ENTITY_API = 'FormBusiness/FormBasicInfo/EventInfo/GetEventInfo'
