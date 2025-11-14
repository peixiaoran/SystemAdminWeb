1、GET_FORMGROUP_DROPDOWN_API是获取表单组别下拉框接口，请求参数为空，返回值：{
  "code": 200,
  "data": [
    {
      "formGroupId": "1987215338470772736",
      "formGroupName": "人事类"
    }
  ],
  "message": null
}
2、GET_APPLYFORM_API接口是申请表单分页接口，请求参数：{
  "formGroupId": "1987215338470772736",
  "formTypeName": "人事类"
  "pageNum": 1,
  "pageSize": 10,
}，返回参数：{
  "code": 200,
  "message": "",
  "data": [
    {
      "formTypeId": "1987217256446300160",
      "formTypeName": "请假单",
      "approvalPath": "formbusiness/forms/leaveform/leaveform_r",
      "description": "请假单用于员工因个人事由、病假、事假、年假等原因需要离开工作岗位时，向所属部门及管理层提出请假申请、审批与备案的业务单据。该单据记录请假类型、请假时间、时长、事由以及审批流程，用于确保人员安排合理、流程合规与人事数据准确。"
    }
  ],
  "totalCount": 1
}，表头写入a标签跳转approvalPath，approvalPath（示例：formbusiness/forms/leaveform/leaveform_r）是表单的审批路径，用于审批流程的跳转，带入formTypeId参数。