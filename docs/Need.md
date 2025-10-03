1、新增用户绑定表单页面，只保留用户分页不变，操作列增加编辑绑定功能，点击后将userId作为json参数调用GET_USER_FORM_BIND_VIEW_TREE_API接口，返回json:{
  "code": 200,
  "data": [
    {
      "parentId": "0",
      "formGroupTypeId": "1969051016183812096",
      "formGroupTypeName": "人事类",
      "formGroupTypeDescription": "",
      "disabled": false,
      "isChecked": true,
      "children": [
        {
          "parentId": "1969051016183812096",
          "formGroupTypeId": "1971095904945573888",
          "formGroupTypeName": "员工入职申请单",
          "formGroupTypeDescription": "新员工入职信息登记、账号与设备申请",
          "disabled": false,
          "isChecked": false,
          "children": []
        }
      ]
    },
    {
      "parentId": "0",
      "formGroupTypeId": "1969052085492256768",
      "formGroupTypeName": "工程类",
      "formGroupTypeDescription": "",
      "disabled": false,
      "isChecked": false,
      "children": []
    }
  ],
  "message": ""
}使用el-dialog展示，并且使用可选择的树形数据（treeProps.checkStrictly 是false）