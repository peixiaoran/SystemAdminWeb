/**
 * 预测版本维护API配置文件
 * 集中管理预测版本相关API接口
 */

// 预测版本分页查询API
export const GET_FORECAST_VERSION_PAGE_API = {
    GET_FORECAST_VERSION_PAGE: 'CustMat/RollingForecast/ForecastVersion/GetForecastVersionPage'
}

// 预测版本实体查询API
export const GET_FORECAST_VERSION_ENTITY_API = {
    GET_FORECAST_VERSION_ENTITY: 'CustMat/RollingForecast/ForecastVersion/GetForecastVersionEntity'
}

// 新增预测版本API
export const INSERT_FORECAST_VERSION_API = {
    INSERT_FORECAST_VERSION: 'CustMat/RollingForecast/ForecastVersion/InsertForecastVersion'
}

// 更新预测版本API
export const UPDATE_FORECAST_VERSION_API = {
    UPDATE_FORECAST_VERSION: 'CustMat/RollingForecast/ForecastVersion/UpdateForecastVersion'
}

// 删除预测版本API
export const DELETE_FORECAST_VERSION_API = {
    DELETE_FORECAST_VERSION: 'CustMat/RollingForecast/ForecastVersion/DeleteForecastVersion'
}

// 解锁预测版本API
export const UNLOCK_FORECAST_VERSION_API = {
    UNLOCK_FORECAST_VERSION: 'CustMat/RollingForecast/ForecastVersion/UnlockForecastVersion'
}

// 锁定预测版本API
export const LOCK_FORECAST_VERSION_API = {
    LOCK_FORECAST_VERSION: 'CustMat/RollingForecast/ForecastVersion/LockForecastVersion'
}
