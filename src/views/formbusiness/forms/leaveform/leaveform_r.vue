<template>
  <div class="leave-form-page">
    <el-card class="leave-form-card" shadow="never">
      <!-- 第一行：SystemAdmin管理系统文字（独占一行居中） -->
      <div class="system-title-row">
        <h2 class="system-title">{{ t('common.systemTitle') }}</h2>
      </div>
      
      <!-- 第二行：员工请假单文字（独占一行居中） -->
      <div class="form-title-row">
        <h3 class="form-title">{{ t('formbusiness.leaveform.formTitle') }}</h3>
      </div>
      <el-divider style="margin: 22px 0;"></el-divider>

        <!-- 表单主体（表格化排版） -->
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="leave-form">

        <!-- 基本信息 -->
        <el-row :gutter="16" style="justify-content: flex-start;">
          <el-col :span="8">
            <el-form-item :label="t('formbusiness.leaveform.formNo')" prop="formNo">
              <el-input v-model="form.formNo" :placeholder="t('formbusiness.leaveform.pleaseInputLeaveNo')" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('formbusiness.leaveform.importanceCode')" prop="importanceCode">
              <el-select v-model="form.importanceCode" :placeholder="t('formbusiness.leaveform.pleaseSelectImportance')" >
                <el-option v-for="opt in importanceOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 申请人信息 -->
        <el-row :gutter="16" align="middle" class="section-row">
          <el-col :span="8">
            <el-form-item :label="t('formbusiness.leaveform.applicantUserNo')" prop="applicantUserNo">
              <el-input v-model="form.applicantUserNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('formbusiness.leaveform.applicantUserName')" prop="applicantUserName">
              <el-input v-model="form.applicantUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('formbusiness.leaveform.applicantDeptName')" prop="applicantDeptName">
              <el-input v-model="form.applicantDeptName" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider></el-divider>

        <!-- 请假信息 -->
        <el-row :gutter="16" style="justify-content: flex-start;">
          <el-col :span="8">
            <el-form-item :label="t('formbusiness.leaveform.leaveTypeCode')" prop="leaveTypeCode">
              <el-select v-model="form.leaveTypeCode" :placeholder="t('formbusiness.leaveform.pleaseSelectLeaveType')" >
                <el-option v-for="type in leaveTypeOptions" :key="type.value" :label="type.label" :value="type.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 时间区间 -->
        <el-row :gutter="16">
          <el-col :span="16">
            <el-form-item :label="t('formbusiness.leaveform.leaveTimeRange')" prop="leaveTimeRange">
              <el-date-picker
                v-model="form.leaveTimeRange"
                type="datetimerange"
                value-format="YYYY-MM-DD HH:mm:ss"
                :start-placeholder="t('formbusiness.leaveform.pleaseSelectStartTime')"
                :end-placeholder="t('formbusiness.leaveform.pleaseSelectEndTime')"
                @change="handleTimeRangeChange"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 时长 -->
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item :label="t('formbusiness.leaveform.leaveDays')" prop="leaveDays">
              <el-input-number v-model="form.leaveDays" :min="0" :step="0.01" :precision="2" :controls="false" style="width: 200px;" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('formbusiness.leaveform.leaveHours')" prop="leaveHours">
              <el-input-number v-model="form.leaveHours" :min="0" :step="0.01" :precision="2" :controls="false" style="width: 200px;" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('formbusiness.leaveform.leaveHandoverUserName')" prop="leaveHandoverUserName">
              <el-input v-model="form.leaveHandoverUserName" :placeholder="t('formbusiness.leaveform.pleaseInputHandoverUserName')"/>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 事由 -->
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.leaveform.leaveReason')" prop="leaveReason">
              <el-input v-model="form.leaveReason" type="textarea" :rows="3" :placeholder="t('formbusiness.leaveform.pleaseInputLeaveReason')" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 描述 -->
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.leaveform.description')" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="2" :placeholder="t('formbusiness.leaveform.pleaseInputDescription')" />
            </el-form-item>
          </el-col>
        </el-row>

         <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item>
              <el-button type="primary" @click="onSubmit">暂存</el-button>
              <el-button class="submit-btn" @click="onSubmitForApproval">送审</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import i18n from '@/i18n'
import { ElMessage } from 'element-plus'
import { post } from '@/utils/request'
import { INIT_LEAVEFORM_API, GET_LEAVEFORM_DROPDOWN_API, GET_IMPORTANCE_DROPDOWN_API } from '@/config/api/formbusiness/forms/leaveform'

// 获取翻译函数
const { t } = i18n.global

// 表单引用
const formRef = ref(null)

// 默认formtypeId（需求指定）
const defaultFormTypeId = '1987217256446300160'

// 表单模型（与Need.md一致）
const form = reactive({
  formId: '',
  formNo: '',
  description: '',
  importanceCode: '',
  applicantUserNo: '',
  applicantUserName: '',
  applicantDeptName: '',
  leaveTypeCode: '',
  leaveReason: '',
  leaveTimeRange: [],
  leaveDays: 0,
  leaveHours: 0,
  leaveHandoverUserName: ''
})

// 下拉选项（来自接口）
const leaveTypeOptions = ref([])
const importanceOptions = ref([])

// 校验规则
const rules = {
  importanceCode: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'change' }
  ],
  leaveTypeCode: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'change' }
  ],
  leaveTimeRange: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'change' },
    { validator: validateTimeRange, trigger: 'change' }
  ],
  leaveDays: [
    { validator: validateDurationPositive, trigger: 'change' }
  ],
  leaveHours: [
    { validator: validateDurationPositive, trigger: 'change' }
  ],
  leaveHandoverUserName: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'blur' },
    { validator: validateHandoverUserNameRequired, trigger: 'blur' }
  ],
  leaveReason: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'blur' },
    { min: 5, message: t('formbusiness.validation.minLength', { min: 5 }), trigger: 'blur' }
  ]
}

/**
 * 计算请假时长（工作时段9:00-17:00，保留两位小数）
 * 输入：开始/结束时间字符串，输出更新表单的 leaveDays/leaveHours
 */
function calculateDuration () {
  if (!form.leaveTimeRange || form.leaveTimeRange.length !== 2) {
    form.leaveDays = parseFloat((0).toFixed(2))
    form.leaveHours = parseFloat((0).toFixed(2))
    return
  }
  const [startTime, endTime] = form.leaveTimeRange
  if (!startTime || !endTime) {
    form.leaveDays = parseFloat((0).toFixed(2))
    form.leaveHours = parseFloat((0).toFixed(2))
    return
  }
  const start = new Date(startTime)
  const end = new Date(endTime)
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    form.leaveDays = parseFloat((0).toFixed(2))
    form.leaveHours = parseFloat((0).toFixed(2))
    return
  }
  const totalWorkingHours = getWorkingHoursBetween(startTime, endTime)
  const fullDays = Math.floor(totalWorkingHours / 8)
  const remainHours = totalWorkingHours - fullDays * 8
  form.leaveDays = parseFloat(fullDays.toFixed(2))
  form.leaveHours = parseFloat(remainHours.toFixed(2))
}

/**
 * 判断时间是否在工作时段（09:00-17:00）
 * 入参：日期时间字符串
 */
function isWithinWorkingHours (dateTimeStr) {
  if (!dateTimeStr) return false
  const dt = new Date(dateTimeStr)
  if (isNaN(dt.getTime())) return false
  const hours = dt.getHours()
  const minutes = dt.getMinutes()
  const totalMin = hours * 60 + minutes
  const startMin = 9 * 60
  const endMin = 17 * 60
  return totalMin >= startMin && totalMin <= endMin
}

/**
 * 计算两个时间点之间的总小时数（正常计算所有时间）
 * 入参：开始/结束时间字符串
 */
function getWorkingHoursBetween (startStr, endStr) {
  const start = new Date(startStr)
  const end = new Date(endStr)
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return 0
  const totalMs = end.getTime() - start.getTime()
  return parseFloat((totalMs / (1000 * 60 * 60)).toFixed(2))
}

/**
 * 校验开始时间必须选择
 */
function validateStartTimeWorkingHours (rule, value, callback) {
  if (!value) {
    callback(new Error(t('formbusiness.validation.required')))
    return
  }
  callback()
}

/**
 * 校验结束时间必须晚于开始时间
 */
function validateEndTimeWorkingHours (rule, value, callback) {
  if (!value) {
    callback(new Error(t('formbusiness.validation.required')))
    return
  }
  const start = form.leaveStartTime ? new Date(form.leaveStartTime) : null
  const end = new Date(value)
  if (!start || isNaN(start.getTime())) {
    callback(new Error(t('formbusiness.leaveform.pleaseSelectStartTime')))
    return
  }
  if (end <= start) {
    callback(new Error(t('formbusiness.leaveform.endAfterStartError')))
    return
  }
  callback()
}

/**
 * 校验时间范围有效性
 */
function validateTimeRange (rule, value, callback) {
  if (!value || value.length !== 2) {
    callback()
    return
  }
  const [startTime, endTime] = value
  if (!startTime || !endTime) {
    callback()
    return
  }
  const start = new Date(startTime)
  const end = new Date(endTime)
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    callback()
    return
  }
  if (end <= start) {
    callback(new Error(t('formbusiness.leaveform.endAfterStartError')))
    return
  }
  callback()
}

/**
 * 校验请假时长必须大于0（任一字段变更时触发）
 */
function validateDurationPositive (rule, value, callback) {
  const total = (Number(form.leaveDays) || 0) * 8 + (Number(form.leaveHours) || 0)
  if (total <= 0) {
    callback(new Error(t('formbusiness.leaveform.durationRequired')))
    return
  }
  callback()
}

/**
 * 校验交接人姓名非空（去除空格后至少1个字符）
 */
function validateHandoverUserNameRequired (rule, value, callback) {
  if (!value || !String(value).trim()) {
    callback(new Error(t('formbusiness.validation.required')))
    return
  }
  callback()
}

/**
 * 时间范围选择变更处理
 * 说明：在时间范围变化时重新计算时长
 */
function handleTimeRangeChange () {
  calculateDuration()
}

/**
 * 初始化请假单
 * 入参：固定formtypeId；出参：绑定返回的data到表单
 * 错误处理：401/403不提示，其他错误提示加载失败
 */
async function initLeaveForm () {
  try {
    // 创建FormData对象，使用FormFrom格式而不是JSON
    const formData = new window.FormData()
    formData.append('formTypeId', defaultFormTypeId)
    
    const res = await post(INIT_LEAVEFORM_API, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    if (!res) return
    if (res.code !== 200) {
      ElMessage.error(res.message || t('messages.loadError'))
      return
    }
    const data = res.data || {}
    Object.assign(form, {
      formId: data.formId || '',
      formNo: data.formNo || '',
      description: data.description || '',
      importanceCode: data.importanceCode || '',
      applicantUserNo: data.applicantUserNo || '',
      applicantUserName: data.applicantUserName || '',
      applicantDeptName: data.applicantDeptName || '',
      leaveTypeCode: data.leaveTypeCode || '',
      leaveReason: data.leaveReason || '',
      leaveTimeRange: data.leaveStartTime && data.leaveEndTime ? [data.leaveStartTime, data.leaveEndTime] : [],
      leaveDays: data.leaveDays ?? 0,
      leaveHours: data.leaveHours ?? 0,
      leaveHandoverUserName: data.leaveHandoverUserName || ''
    })
  } catch {
    // 网络/异常错误提示
    ElMessage.error(t('messages.networkError'))
  }
}

/**
 * 获取请假类型下拉
 * 入参：无；出参：转换为{label,value}数组
 * 错误处理：401/403不提示，其他错误提示加载失败
 */
async function getLeaveTypeOptions () {
  try {
    const res = await post(GET_LEAVEFORM_DROPDOWN_API, {})
    if (!res) return
    if (res.code !== 200) {
      ElMessage.error(res.message || t('messages.loadError'))
      return
    }
    const list = Array.isArray(res.data) ? res.data : []
    leaveTypeOptions.value = list.map(item => ({
      label: item.leaveTypeName,
      value: String(item.leaveTypeCode)
    }))
  } catch {
    ElMessage.error(t('messages.networkError'))
  }
}

/**
 * 获取重要性下拉
 * 入参：无；出参：转换为{label,value}数组
 * 错误处理：401/403不提示，其他错误提示加载失败
 */
async function getImportanceOptions () {
  try {
    const res = await post(GET_IMPORTANCE_DROPDOWN_API, {})
    if (!res) return
    if (res.code !== 200) {
      ElMessage.error(res.message || t('messages.loadError'))
      return
    }
    const list = Array.isArray(res.data) ? res.data : []
    importanceOptions.value = list.map(item => ({
      label: item.importanceName,
      value: String(item.importanceCode)
    }))
  } catch {
    ElMessage.error(t('messages.networkError'))
  }
}



/**
 * 提交请假单（占位）
 * 说明：执行校验，通过后仅提示成功（后续可接入保存接口）
 */
function onSubmit () {
  formRef.value?.validate((valid) => {
    if (!valid) return
    plan(t('messages.saveSuccess'))
  })
}

/**
 * 送审请假单
 * 说明：执行校验，通过后提示送审成功
 */
function onSubmitForApproval () {
  formRef.value?.validate((valid) => {
    if (!valid) return
    plan('送审成功')
  })
}

/**
 * 页面挂载
 * 说明：加载初始化数据与下拉
 */
onMounted(async () => {
  await Promise.all([getLeaveTypeOptions(), getImportanceOptions()])
  await initLeaveForm()
})
</script>

<style scoped>

/* 这一行里的 form-item 取消底部间距，防止和 divider 叠加 */
.section-row .el-form-item {
  margin-bottom: 0;
}

/* 分割线上下间距统一控制 */
.section-divider {
  margin: 16px 0; /* 上下相同 => 分割线与上下两行视觉距离一致 */
}

.leave-form-page {
  padding: 16px;
}
.leave-form-card {
  max-width: 1000px;
  margin: 0 auto;
}

.system-title-row {
  text-align: center;
  margin-bottom: 16px;
}

.system-title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.form-title-row {
  text-align: center;
  margin-bottom: 24px;
}

.form-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.submit-btn {
  background-color: #fff3cd;
  border-color: #ffeaa7;
  color: #856404;
}

.submit-btn:hover {
  background-color: #ffeaa7;
  border-color: #fdcb6e;
  color: #856404;
}

.leave-form {
  padding: 0 20px;
}

/* 表单项当标签换行时居中对齐，避免两行时样式错乱 */
.leave-form :deep(.el-form-item) {
  align-items: center;
}

.leave-form :deep(.el-form-item__label) {
  text-align: left;
  white-space: normal;
  word-break: break-word;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  line-height: 1.2;
}
</style>