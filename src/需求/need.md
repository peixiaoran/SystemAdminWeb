1、帮我修改下币别页面和路由。
2、请求分页参数：{
  "currencyCode": "",
  "pageIndex": 1,
  "pageSize": 1,
  "totalCount": 1
}，返回参数：{
  "data": [
    {
      "currencyId": 1,
      "currencyCode": "USD",
      "currencyNameCh": "美元",
      "currencyNameEn": "Dollar",
      "currencyState": true,
      "remark": ""
    }
  ],
  "code": "200",
  "totalNumber": 1,
  "totalPage": 1,
  "message": ""
}
2、请求实体参数：{
  "currencyId": "1"
}，返回参数：{
  "data": {
    "currencyId": 1,
    "currencyCode": "USD",
    "currencyNameCh": "美元",
    "currencyNameEn": "Dollar",
    "currencyState": false,
    "remark": ""
  },
  "code": "200",
  "message": ""
}
3、i18n也实现一下