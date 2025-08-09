userlabor页面需求
1、新增请求参数：{
  "laborId": "",
  "laborNameCh": "",
  "laborNameEn": "1",
  "laborDescription": ""
}，返回参数：{
  "code": 200,
  "data": null
  "Message": "",
}
2、更新请求参数：{
  "laborId": "",
  "laborNameCh": "",
  "laborNameEn": "",
  "laborDescription": ""
}，返回参数：{
  "code": 200,
  "data": null
  "Message": "",
}
3、删除请求参数：{
  "laborId": ""
}，返回参数：{
  "code": 200,
  "data": null
  "Message": "",
}
4、查询请求参数：{
  "laborNo": "",
  "laborName": "",
  "pageIndex": 1,
  "pageSize": 1,
  "totalCount": 1
}，返回参数：{
  "code": "200",
  "data": [
    {
      "laborId": "",
      "laborNo": "",
      "laborNameCh": "",
      "laborNameEn": "",
      "laborDescription": ""
    }
  ],
  "totalNumber": 2,
  "totalPage": 1,
  "message": ""
}
5、根据id查询请求参数：{
  "laborId": ""
}，返回参数：{
  "code": "200",
  "data": {
    "laborId": "",
    "laborNo": "",
    "laborNameCh": "",
    "laborNameEn": "",
    "laborDescription": ""
  },
  "message": ""
}
对应的接口已经写好到js当中了，帮我写一下页面的代码。



