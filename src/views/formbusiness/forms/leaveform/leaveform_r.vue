<template>
  <div class="leave-form-page">
    <el-card class="leave-form-card" shadow="never">
      <!-- 第一行：SystemAdmin管理系统文字（独占一行居中） -->
      <div class="system-title-row">
        <h2 class="system-title">SystemAdmin 管理系统</h2>
      </div>
      
      <!-- 第二行：请假单文字（独占一行居中） -->
      <div class="form-title-row">
        <h3 class="form-title">{{ t('formbusiness.leaveform.title') }}</h3>
      </div>

      <!-- 表单主体（表格化排版） -->
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="leave-form" status-icon>

        <!-- 基本信息 -->
        <el-row :gutter="16" class="form-row">
          <el-col :span="12">
            <el-form-item :label="t('formbusiness.leaveform.formNo')" prop="formNo">
              <el-input v-model="form.formNo" :placeholder="t('formbusiness.leaveform.pleaseInputLeaveNo')" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('formbusiness.leaveform.description')" prop="description">
              <el-input v-model="form.description" :placeholder="t('formbusiness.leaveform.pleaseInputDescription')" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="form-row">
          <el-col :span="12">
            <el-form-item :label="t('formbusiness.leaveform.importanceCode')" prop="importanceCode">
              <el-select v-model="form.importanceCode" :placeholder="t('formbusiness.leaveform.pleaseSelectImportance')" filterable clearable>
                <el-option v-for="opt in importanceOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 申请人信息（只读） -->
        <el-row :gutter="16" class="form-row">
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

        <el-row :gutter="16" class="form-row">
          <el-col :span="8">
            <el-form-item :label="t('formbusiness.leaveform.applicantPositionNo')" prop="applicantPositionNo">
              <el-input v-model="form.applicantPositionNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('formbusiness.leaveform.applicantPositionName')" prop="applicantPositionName">
              <el-input v-model="form.applicantPositionName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('formbusiness.leaveform.applicantPhone')" prop="applicantPhone">
              <el-input v-model="form.applicantPhone" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 请假信息 -->
        <el-row :gutter="16" class="form-row">
          <el-col :span="12">
            <el-form-item :label="t('formbusiness.leaveform.leaveTypeCode')" prop="leaveTypeCode">
              <el-select v-model="form.leaveTypeCode" :placeholder="t('formbusiness.leaveform.pleaseSelectLeaveType')" filterable clearable>
                <el-option v-for="type in leaveTypeOptions" :key="type.value" :label="type.label" :value="type.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('formbusiness.leaveform.leaveHandoverUserName')" prop="leaveHandoverUserName">
              <el-input v-model="form.leaveHandoverUserName" :placeholder="t('formbusiness.leaveform.pleaseInputHandoverUserName')" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 时间区间 -->
        <el-row :gutter="16" class="form-row">
          <el-col :span="12">
            <el-form-item :label="t('formbusiness.leaveform.leaveStartTime')" prop="leaveStartTime">
              <el-date-picker
                v-model="form.leaveStartTime"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                :placeholder="t('formbusiness.leaveform.pleaseSelectStartTime')"
                @change="handleTimeChange"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('formbusiness.leaveform.leaveEndTime')" prop="leaveEndTime">
              <el-date-picker
                v-model="form.leaveEndTime"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                :placeholder="t('formbusiness.leaveform.pleaseSelectEndTime')"
                @change="handleTimeChange"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 时长 -->
        <el-row :gutter="16" class="form-row">
          <el-col :span="12">
            <el-form-item :label="t('formbusiness.leaveform.leaveDays')" prop="leaveDays">
              <el-input-number v-model="form.leaveDays" :min="0" :step="1" :precision="0" :controls="false" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('formbusiness.leaveform.leaveHours')" prop="leaveHours">
              <el-input-number v-model="form.leaveHours" :min="0" :step="0.5" :precision="1" :controls="false" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 事由 -->
        <el-row :gutter="16" class="form-row">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.leaveform.leaveReason')" prop="leaveReason">
              <el-input v-model="form.leaveReason" type="textarea" :rows="3" :placeholder="t('formbusiness.leaveform.pleaseInputLeaveReason')" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button type="primary" @click="onSubmit">{{ t('common.save') }}</el-button>
          <el-button @click="onReset">{{ t('common.reset') }}</el-button>
        </div>

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
  applicantPositionNo: '',
  applicantPositionName: '',
  applicantPhone: '',
  leaveTypeCode: '',
  leaveReason: '',
  leaveStartTime: '',
  leaveEndTime: '',
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
  leaveStartTime: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'change' }
  ],
  leaveEndTime: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'change' }
  ],
  leaveReason: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'blur' },
    { min: 5, message: t('formbusiness.validation.minLength', { min: 5 }), trigger: 'blur' }
  ]
}

/**
 * 计算请假时长（天与小时）
 * 输入：开始时间与结束时间，输出更新表单的days与hours
 */
function calculateDuration () {
  if (!form.leaveStartTime || !form.leaveEndTime) {
    form.leaveDays = 0
    form.leaveHours = 0
    return
  }
  const start = new Date(form.leaveStartTime).getTime()
  const end = new Date(form.leaveEndTime).getTime()
  if (isNaN(start) || isNaN(end) || end <= start) {
    form.leaveDays = 0
    form.leaveHours = 0
    return
  }
  const diffMs = end - start
  const totalHours = diffMs / (1000 * 60 * 60)
  form.leaveDays = Math.floor(totalHours / 24)
  form.leaveHours = parseFloat((totalHours % 24).toFixed(1))
}

/**
 * 时间选择变更处理
 * 说明：在开始/结束时间变化时重新计算时长
 */
function handleTimeChange () {
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
    const formData = new FormData()
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
      applicantPositionNo: data.applicantPositionNo || '',
      applicantPositionName: data.applicantPositionName || '',
      applicantPhone: data.applicantPhone || '',
      leaveTypeCode: data.leaveTypeCode || '',
      leaveReason: data.leaveReason || '',
      leaveStartTime: data.leaveStartTime || '',
      leaveEndTime: data.leaveEndTime || '',
      leaveDays: data.leaveDays ?? 0,
      leaveHours: data.leaveHours ?? 0,
      leaveHandoverUserName: data.leaveHandoverUserName || ''
    })
  } catch (err) {
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
  } catch (err) {
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
  } catch (err) {
    ElMessage.error(t('messages.networkError'))
  }
}

/**
 * 重置表单
 * 说明：清空用户可编辑字段并重置校验状态
 */
function onReset () {
  form.description = ''
  form.importanceCode = ''
  form.leaveTypeCode = ''
  form.leaveReason = ''
  form.leaveStartTime = ''
  form.leaveEndTime = ''
  form.leaveDays = 0
  form.leaveHours = 0
  form.leaveHandoverUserName = ''
  formRef.value?.clearValidate()
}

/**
 * 提交请假单（占位）
 * 说明：执行校验，通过后仅提示成功（后续可接入保存接口）
 */
function onSubmit () {
  formRef.value?.validate((valid) => {
    if (!valid) return
    ElMessage.success(t('messages.saveSuccess'))
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
.leave-form-page {
  padding: 16px;
}
.leave-form-card {
  max-width: 800px;
  margin: 0 auto;
}

.system-title-row {
  text-align: center;
  margin-bottom: 16px;
}

.system-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.form-title-row {
  text-align: center;
  margin-bottom: 24px;
}

.form-title {
  font-size: 20px;
  font-weight: 600;
  color: #606266;
  margin: 0;
}

.form-row {
  margin-bottom: 8px;
}

.form-actions {
  margin-top: 12px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.leave-form {
  padding: 0 20px;
}
</style>