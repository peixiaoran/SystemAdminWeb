/**
 * 料号版本趋势API配置文件
 * 集中管理料号版本趋势相关API接口
 */

// 销售料号分页查询API
export const GET_SALES_NUMBER_PAGE_API = {
    GET_SALES_NUMBER_PAGE: 'CustMat/RollingForecast/NumberTrend/GetSalesNumberPage'
}

// 预测版本下拉查询API
export const GET_FORECAST_VERSION_DROP_API = {
    GET_FORECAST_VERSION_DROP: 'CustMat/RollingForecast/NumberTrend/GetForecastVersionDrop'
}

// 料号版本趋势用量统计API（按料号+版本统计天/周/合计用量）
export const GET_NUMBER_TREND_API = {
    GET_NUMBER_TREND: 'CustMat/RollingForecast/NumberTrend/GetNumberTrend'
}
