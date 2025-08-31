页面新增编辑员工兼任，点击后弹出新增编辑弹窗，调用接口GET_USER_PARTTIMEENTITY_API，{
  "userId": "",
  "old_PartTimeDeptId": "",
  "old_PartTimePositionId": "",
  "old_PartTimeLaborId": ""
}，返回数据{
  "code": 200,
  "data": {
    "userId": 1961846945383321600,
    "partTimeDeptId": 1929535196076576800,
    "partTimePositionId": 1351601258426794000,
    "partTimeLaborId": 1956395917238210600,
    "startTime": "2025/8/1 0:00:00",
    "endTime": "2025/8/31 0:00:00",
    "createdBy": 1903486709602062300,
    "createdDate": "2025/8/31 2:02:01",
    "modifiedBy": null,
    "modifiedDate": null
  },
  "message": ""
}，员工表格根据userId选中，点击修改调用接口UPDATE_USER_PARTTIME_API，{
  "userId": "",
  "old_PartTimeDeptId": "",--点击修改时，旧的部门id
  "old_PartTimePositionId": "",--点击修改时，旧的职级id
  "old_PartTimeLaborId": "",--点击修改时，旧的岗位id
  "partTimeDeptId": "",--点击修改时，新的部门id
  "partTimePositionId": "",--点击修改时，新的职级id
  "partTimeLaborId": "",--点击修改时，新的岗位id
  "startTime": "",--点击修改时，新的开始时间
  "endTime": ""--点击修改时，新的结束时间
},返回数据{
  "code": 200,
  "data": null,
  "message": ""
}，i18n配置一下。