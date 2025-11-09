<template>
  <div class="leave-form-page">
    <el-card class="leave-form-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>{{ t('formbusiness.leaveform.title') }}</span>
        </div>
      </template>

      <!-- 表单主体 -->
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="leave-form" status-icon>

        <!-- 基本信息 -->
        <el-row :gutter="16" class="form-row">
          <el-col :span="12">
            <el-form-item :label="t('formbusiness.leaveform.leaveId')" prop="leaveId">
              <el-input v-model="form.leaveId" :placeholder="t('formbusiness.leaveform.pleaseInputLeaveId')" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('formbusiness.leaveform.leaveNo')" prop="leaveNo">
              <el-input v-model="form.leaveNo" :placeholder="t('formbusiness.leaveform.pleaseInputLeaveNo')" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="form-row">
          <el-col :span="12">
            <el-form-item :label="t('formbusiness.leaveform.leaveApplicantId')" prop="leaveApplicantId">
              <el-select v-model="form.leaveApplicantId" :placeholder="t('formbusiness.leaveform.pleaseSelectLeaveApplicant')" filterable clearable>
                <el-option v-for="user in applicantOptions" :key="user.value" :label="user.label" :value="user.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('formbusiness.leaveform.leaveTypeId')" prop="leaveTypeId">
              <el-select v-model="form.leaveTypeId" :placeholder="t('formbusiness.leaveform.pleaseSelectLeaveType')" filterable clearable>
                <el-option v-for="type in leaveTypeOptions" :key="type.value" :label="type.label" :value="type.value" />
              </el-select>
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

        <!-- 交接与事由 -->
        <el-row :gutter="16" class="form-row">
          <el-col :span="12">
            <el-form-item :label="t('formbusiness.leaveform.leaveHandoverUserId')" prop="leaveHandoverUserId">
              <el-select v-model="form.leaveHandoverUserId" :placeholder="t('formbusiness.leaveform.pleaseSelectHandoverUser')" filterable clearable>
                <el-option v-for="user in handoverOptions" :key="user.value" :label="user.label" :value="user.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
import { reactive, ref } from 'vue'
import i18n from '@/i18n'
import { ElMessage } from 'element-plus'

// 获取翻译函数
const { t } = i18n.global

// 表单引用
const formRef = ref(null)

// 表单模型
const form = reactive({
  leaveId: '',
  leaveNo: '',
  leaveApplicantId: '',
  leaveTypeId: '',
  leaveReason: '',
  leaveStartTime: '',
  leaveEndTime: '',
  leaveDays: 0,
  leaveHours: 0,
  leaveHandoverUserId: ''
})

// 下拉选项（占位数据，可后续替换为接口）
const applicantOptions = [
  { label: 'U1001 - Alice', value: 'U1001' },
  { label: 'U1002 - Bob', value: 'U1002' },
  { label: 'U1003 - Carol', value: 'U1003' }
]

const handoverOptions = [
  { label: 'U2001 - David', value: 'U2001' },
  { label: 'U2002 - Emily', value: 'U2002' },
  { label: 'U2003 - Frank', value: 'U2003' }
]

const leaveTypeOptions = [
  { label: t('formbusiness.leaveform.types.annual'), value: 'annual' },
  { label: t('formbusiness.leaveform.types.sick'), value: 'sick' },
  { label: t('formbusiness.leaveform.types.personal'), value: 'personal' }
]

// 校验规则
const rules = {
  leaveNo: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'blur' }
  ],
  leaveApplicantId: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'change' }
  ],
  leaveTypeId: [
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
 * 重置表单
 * 说明：清空表单并重置校验状态
 */
function onReset () {
  form.leaveId = ''
  form.leaveNo = ''
  form.leaveApplicantId = ''
  form.leaveTypeId = ''
  form.leaveReason = ''
  form.leaveStartTime = ''
  form.leaveEndTime = ''
  form.leaveDays = 0
  form.leaveHours = 0
  form.leaveHandoverUserId = ''
  formRef.value?.clearValidate()
}

/**
 * 提交请假单
 * 说明：执行校验，通过后提交（占位实现）
 */
function onSubmit () {
  formRef.value?.validate((valid) => {
    if (!valid) return
    // 此处可替换为真实提交逻辑
    // console.log('Submit payload:', { ...form })
    ElMessage.success(t('formbusiness.messages.saveSuccess'))
  })
}
</script>

<style scoped>
.leave-form-page {
  padding: 16px;
}
.leave-form-card {
  max-width: 1000px;
  margin: 0 auto;
}
.form-row {
  margin-bottom: 8px;
}
.form-actions {
  margin-top: 12px;
  display: flex;
  gap: 12px;
}
</style>