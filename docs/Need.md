1、新增国籍列表（无分页、不要筛选部分）GET_NATIONALITY_LIST_API，没有请求参数，返回参数：{
  "code": 200,
  "data": [
    {
      "nationId": "1972220728019390464",
      "nationNameCn": "陆籍",
      "nationNameEn": "Mainland Chinese",
      "remark": ""
    },
  ],
  "message": ""
}
2、新增国籍新增：INSERT_NATIONALITY_API，请求参数：{
  "nationId": "",
  "nationNameCn": "",
  "nationNameEn": "",
  "remark": ""
}，返回参数：{
  "code": 200,
  "data": 1,
  "message": "新增国籍信息成功"
}
3、获取国籍详情：GET_NATIONALITY_ENTITY_API，请求参数：{
  "nationId": ""
}，返回参数：{
  "code": 200,
  "data": {
    "nationId": "1972220728019390464",
    "nationNameCn": "陆籍",
    "nationNameEn": "Mainland Chinese",
    "remark": ""
  },
  "message": ""
}
4、更新国籍：UPDATE_NATIONALITY_API，请求参数：{
  "nationId": "",
  "nationNameCn": "",
  "nationNameEn": "",
  "remark": ""
}，返回参数：{
  "code": 200,
  "data": 1,
  "message": "更新国籍信息成功"
}