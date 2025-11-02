1、厂商列表分页查询接口：GET_MANUFACTURER_PAGE_API，请求参数：{
  "manufacturerCode": "",
  "manufacturerName": "",
  "pageIndex": 1,
  "pageSize": 1,
  "totalCount": 1
}，返回参数：{
  "code": 200,
  "message": "",
  "data": [
    {
      "manufacturerId": 1,
      "manufacturerCode": "1",
      "manufacturerNameCh": "1",
      "manufacturerNameEn": "1",
      "email": "1",
      "fax": "1",
      "description": "1"
    }
  ],
  "totalCount": 1
}
2、厂商新增接口：INSERT_MANUFACTURER_API，请求参数：{
  "manufacturerCode": "1",
  "manufacturerNameCh": "1",
  "manufacturerNameEn": "1",
  "email": "1",
  "fax": "1",
  "description": "1"
}，返回参数：{
  "code": 200,
  "message": "",
  "data": 1
}
3、厂商更新接口：UPDATE_MANUFACTURER_API，请求参数：{
  "manufacturerId": "1",
  "manufacturerCode": "1",
  "manufacturerNameCh": "1",
  "manufacturerNameEn": "1",
  "email": "1",
  "fax": "1",
  "description": "1"
}，返回参数：{
  "code": 200,
  "message": "",
  "data": 1
}
4、厂商删除接口：DELETE_MANUFACTURER_API，请求参数：{
  "manufacturerId": "1"
}，返回参数：{
  "code": 200,
  "message": "",
  "data": 1
}
5、厂商详情接口：GET_MANUFACTURER_ENTITY_API，请求参数：{
  "manufacturerId": "1"
}，返回参数：{
  "code": 200,
  "message": "",
  "data": {
    "manufacturerId": 1,
    "manufacturerCode": "1",
    "manufacturerNameCh": "1",
    "manufacturerNameEn": "1",
    "email": "1",
    "fax": "1",
    "description": "1"
  }
}