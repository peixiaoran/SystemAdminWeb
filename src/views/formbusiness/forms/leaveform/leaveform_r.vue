<template>
  <div class="leave-form-page">
    <!-- 简单Skeleton骨架屏 -->
    <el-card v-if="loading" class="leave-form-card" shadow="never">
      <div class="system-title-row">
        <el-skeleton animated>
          <template #template>
            <el-skeleton-item variant="text" style="width: 200px; height: 32px;" />
          </template>
        </el-skeleton>
      </div>
      
      <div class="form-title-row">
        <el-skeleton animated>
          <template #template>
            <el-skeleton-item variant="text" style="width: 150px; height: 28px;" />
          </template>
        </el-skeleton>
      </div>
      
      <el-divider style="margin: 22px 0;"></el-divider>
      
      <!-- 简化表单内容骨架 -->
      <div style="padding: 0 16px;">
        <el-skeleton animated>
          <template #template>
            <!-- 基本信息行 -->
            <div style="display: flex; gap: 16px; margin-bottom: 24px;">
              <el-skeleton-item variant="text" style="width: 200px; height: 32px;" />
              <el-skeleton-item variant="text" style="width: 200px; height: 32px;" />
            </div>
            
            <!-- 分割线 -->
            <el-skeleton-item variant="text" style="width: 100%; height: 1px; margin: 16px 0;" />
            
            <!-- 请假信息 -->
            <el-skeleton-item variant="text" style="width: 200px; height: 32px; margin-bottom: 24px;" />
            
            <!-- 时间选择器 -->
            <el-skeleton-item variant="text" style="width: 400px; height: 32px; margin-bottom: 24px;" />
            
            <!-- 时长信息 -->
            <div style="display: flex; gap: 16px; margin-bottom: 24px;">
              <el-skeleton-item variant="text" style="width: 200px; height: 32px;" />
              <el-skeleton-item variant="text" style="width: 200px; height: 32px;" />
              <el-skeleton-item variant="text" style="width: 200px; height: 32px;" />
            </div>
            
            <!-- 文本区域 -->
            <el-skeleton-item variant="text" style="width: 100%; height: 80px; margin-bottom: 24px;" />
            
            <!-- 另一个文本区域 -->
            <el-skeleton-item variant="text" style="width: 100%; height: 60px; margin-bottom: 24px;" />
            
            <!-- 按钮 -->
            <div style="display: flex; gap: 16px;">
              <el-skeleton-item variant="button" style="width: 80px; height: 32px;" />
              <el-skeleton-item variant="button" style="width: 90px; height: 32px;" />
            </div>
          </template>
        </el-skeleton>
      </div>
    </el-card>
    
    <!-- 实际表单内容 -->
    <el-card v-else class="leave-form-card" shadow="never" v-loading="saving || approving">
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
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="leave-form" :validate-on-rule-change="false">

        <!-- 基本信息 -->
        <el-row :gutter="16" style="justify-content: flex-start;">
          <el-col :span="8">
            <el-form-item :label="t('formbusiness.leaveform.formNo')" prop="formNo">
              <el-input v-model="form.formNo" :placeholder="t('formbusiness.leaveform.pleaseInputLeaveNo')" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('formbusiness.leaveform.importanceCode')" prop="importanceCode">
              <el-select v-model="form.importanceCode" :placeholder="t('formbusiness.leaveform.pleaseSelectImportance')" clearable @change="onSelectChange('importanceCode')">
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
              <el-select v-model="form.leaveTypeCode" :placeholder="t('formbusiness.leaveform.pleaseSelectLeaveType')" clearable @change="onSelectChange('leaveTypeCode')">
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
              <el-button type="primary" style="width:80px;" @click="onSubmit" plain :loading="saving" :disabled="saving">{{ t('formbusiness.leaveform.saveButton') }}</el-button>
              <el-button color="#ecc00f" style="width:90px;" @click="onSubmitForApproval" :loading="approving" :disabled="approving">{{ t('formbusiness.leaveform.submitButton') }}</el-button>
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
import { INIT_LEAVEFORM_API, SAVE_LEAVEFORM_API, GET_LEAVEFORM_DETAIL_API, GET_LEAVEFORM_DROPDOWN_API, GET_IMPORTANCE_DROPDOWN_API } from '@/config/api/formbusiness/forms/leaveform'
import { useRoute, useRouter } from 'vue-router'

// 获取翻译函数
const { t } = i18n.global

// 表单引用
const formRef = ref(null)
const route = useRoute()
const router = useRouter()

// 加载状态
const loading = ref(true)
// 暂存与送审按钮加载状态
const saving = ref(false)
const approving = ref(false)

// 默认formtypeId（需求指定）
const defaultFormTypeId = '1987217256446300160'
const currentFormTypeId = ref('')

// 表单模型（与Need.md一致）
/**
 * 表单模型
 */
const form = reactive({
  formId: '',
  formNo: '',
  description: '',
  importanceCode: null,
  applicantUserNo: '',
  applicantUserName: '',
  applicantDeptName: '',
  applicantDeptId: '',
  applicantTime: '',
  leaveTypeCode: null,
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

  leaveHandoverUserName: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'blur' },
    { validator: validateHandoverUserNameRequired, trigger: 'blur' }
  ],
  leaveReason: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'blur' }
  ]
}

/**
 * 计算请假时长：将总小时拆分为“天 + 小时”
 * 规则：24小时=1天；向下取整为“天”，余数为“小时”（保留两位小数）
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
  const start = new Date(typeof startTime === 'string' ? startTime.replace(' ', 'T') : startTime)
  const end = new Date(typeof endTime === 'string' ? endTime.replace(' ', 'T') : endTime)
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    form.leaveDays = parseFloat((0).toFixed(2))
    form.leaveHours = parseFloat((0).toFixed(2))
    return
  }
  const totalHours = getWorkingHoursBetween(startTime, endTime)
  const wholeDays = Math.floor(totalHours / 24)
  form.leaveDays = wholeDays
  form.leaveHours = parseFloat(totalHours.toFixed(2))
}

/**
 * 计算两个时间点之间的总小时数（正常计算所有时间）
 * 入参：开始/结束时间字符串
 */
function getWorkingHoursBetween (startStr, endStr) {
  const start = new Date(typeof startStr === 'string' ? startStr.replace(' ', 'T') : startStr)
  const end = new Date(typeof endStr === 'string' ? endStr.replace(' ', 'T') : endStr)
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return 0
  const totalMs = end.getTime() - start.getTime()
  return parseFloat((totalMs / (1000 * 60 * 60)).toFixed(2))
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
  const start = new Date(typeof startTime === 'string' ? startTime.replace(' ', 'T') : startTime)
  const end = new Date(typeof endTime === 'string' ? endTime.replace(' ', 'T') : endTime)
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
  const total = Number(form.leaveHours) || 0
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
 * 下拉选择变更时触发字段校验
 * 入参：字段名；出参：无（用于清除红色提示）
 */
function onSelectChange (field) {
  if (!formRef.value) return
  try {
    formRef.value.validateField(field)
  } catch (e) {
    // ignore
  }
}

/**
 * 规范化日期时间字符串为"YYYY-MM-DD HH:mm:ss"
 * 入参：字符串/Date/时间戳；出参：符合value-format的字符串，非法返回空字符串
 */
function normalizeDateTime (val) {
  if (!val) return ''
  let d
  if (val instanceof Date) {
    d = val
  } else if (typeof val === 'number') {
    d = new Date(val)
  } else if (typeof val === 'string') {
    const s = val.trim()
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/)
    if (m) {
      return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6]}`
    }
    const slash = s.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})/)
    if (slash) {
      const pad = (n) => String(n).padStart(2, '0')
      const Y = slash[1]
      const M = pad(slash[2])
      const D = pad(slash[3])
      const H = pad(slash[4])
      const mi = pad(slash[5])
      const S = pad(slash[6])
      return `${Y}-${M}-${D} ${H}:${mi}:${S}`
    }
    const msMatch = s.match(/\/Date\((\d+)\)\//)
    if (msMatch) {
      d = new Date(Number(msMatch[1]))
    } else {
      d = new Date(s.replace('T', ' ').replace(/Z$/, ''))
    }
  }
  if (!d || isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  const Y = d.getFullYear()
  const M = pad(d.getMonth() + 1)
  const D = pad(d.getDate())
  const H = pad(d.getHours())
  const m = pad(d.getMinutes())
  const S = pad(d.getSeconds())
  return `${Y}-${M}-${D} ${H}:${m}:${S}`
}

/**
 * 将 "YYYY-MM-DD HH:mm:ss" 转为可被 Date 可靠解析的 ISO 字符串
 * 入参：字符串；出参：替换空格为'T'后的字符串
 */
function toISO (str) {
  return typeof str === 'string' ? str.replace(' ', 'T') : str
}

/**
 * 初始化请假单
 * 入参：固定formtypeId；出参：绑定返回的data到表单
 * 错误处理：401/403不提示，其他错误提示加载失败
 */
/**
 * 绑定接口返回数据到表单
 */
function bindFormData (data) {
  Object.assign(form, {
    formTypeId: data.formTypeId || '',
    formId: data.formId || '',
    formNo: data.formNo || '',
    description: data.description || '',
    importanceCode: normalizeSelectCode(data.importanceCode),
    applicantUserNo: data.applicantUserNo || '',
    applicantUserName: data.applicantUserName || '',
    applicantDeptName: data.applicantDeptName || '',
    applicantDeptId: data.applicantDeptId || '',
    applicantTime: data.applicantTime || '',
    leaveTypeCode: normalizeSelectCode(data.leaveTypeCode),
    leaveReason: data.leaveReason || '',
    leaveTimeRange: (() => {
      const start = normalizeDateTime(data.LeaveStartTime || data.leaveStartTime)
      const end = normalizeDateTime(data.LeaveEndTime || data.leaveEndTime)
      return start && end ? [start, end] : []
    })(),
    leaveDays: data.leaveDays ?? 0,
    leaveHours: data.leaveHours ?? 0,
    leaveHandoverUserName: data.leaveHandoverUserName || ''
  })
  // 绑定返回的formTypeId作为当前类型（若有）
  if (data && data.formTypeId) {
    currentFormTypeId.value = String(data.formTypeId)
  }
  // 路由驱动：当存在formId时，将其同步到URL，保证刷新后按详情加载
  if (form.formId) {
    const nextQuery = {
      ...route.query,
      formId: String(form.formId),
      formTypeId: String(currentFormTypeId.value || route.query.formTypeId || defaultFormTypeId)
    }
    router.replace({ path: route.path, query: nextQuery })
  }
  // 赋值后清理可能残留的校验错误提示
  if (formRef.value) {
    formRef.value.clearValidate(['importanceCode', 'leaveTypeCode'])
  }
}

/**
 * 规范化下拉选择值：接口返回为-1时视为未选择
 */
function normalizeSelectCode (val) {
  if (val === -1 || String(val) === '-1') return undefined
  return val === undefined || val === null ? undefined : String(val)
}

/**
 * 初始化请假单
 */
async function initLeaveForm () {
  try {
    // 创建FormData对象，使用FormFrom格式而不是JSON
    const formData = new window.FormData()
    formData.append('formTypeId', currentFormTypeId.value || defaultFormTypeId)
    
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
    bindFormData(data)
  } catch {
    // 网络/异常错误提示
    ElMessage.error(t('messages.networkError'))
  }
}

/**
 * 获取请假单详情
 * 入参：表单ID（字符串），以FormData方式提交
 */
async function getLeaveFormDetail (id) {
  try {
    const formData = new window.FormData()
    formData.append('formId', String(id))
    const res = await post(GET_LEAVEFORM_DETAIL_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (!res) return
    if (res.code !== 200) {
      ElMessage.error(res.message || t('messages.loadError'))
      return
    }
    const data = res.data || {}
    bindFormData(data)
  } catch {
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
/**
 * 保存请假单：执行校验，通过后调用保存接口
 */
async function onSubmit () {
  saving.value = true
  formRef.value?.validate(async (valid) => {
    if (!valid) { saving.value = false; return }
    const payload = {
      formTypeId: String(currentFormTypeId.value || defaultFormTypeId),
      description: (form.description || '').trim(),
      importanceCode: form.importanceCode == null || form.importanceCode === '' ? -1 : Number(form.importanceCode),
      formId: String(form.formId || ''),
      formNo: form.formNo || '',
      applicantTime: form.applicantTime || '',
      applicantUserNo: form.applicantUserNo || '',
      applicantUserName: form.applicantUserName || '',
      applicantDeptId: Number(form.applicantDeptId || 0),
      applicantDeptName: form.applicantDeptName || '',
      leaveTypeCode: form.leaveTypeCode == null || form.leaveTypeCode === '' ? -1 : Number(form.leaveTypeCode),
      leaveReason: (form.leaveReason || '').trim(),
      leaveStartTime: Array.isArray(form.leaveTimeRange) && form.leaveTimeRange[0] ? form.leaveTimeRange[0] : '',
      leaveEndTime: Array.isArray(form.leaveTimeRange) && form.leaveTimeRange[1] ? form.leaveTimeRange[1] : '',
      leaveDays: Number(form.leaveDays || 0),
      leaveHours: Number(form.leaveHours || 0),
      leaveHandoverUserName: (form.leaveHandoverUserName || '').trim()
    }
    try {
      const res = await post(SAVE_LEAVEFORM_API, payload)
      if (res && res.code === 200) {
        ElMessage({ message: res.message || t('messages.saveSuccess'), type: 'success', plain: true, showClose: true })
      } else {
        ElMessage({ message: res?.message || t('messages.saveError'), type: 'error', plain: true, showClose: true })
      }
    } catch {
      ElMessage({ message: t('messages.networkError'), type: 'error', plain: true, showClose: true })
    } finally {
      saving.value = false
    }
  })
}

/**
 * 送审请假单：显示加载中，校验通过后再结束加载
 */
async function onSubmitForApproval () {
  approving.value = true
  try {
    const valid = await new Promise((resolve) => {
      formRef.value?.validate((v) => resolve(!!v))
    })
    if (!valid) return
    // 占位：如需调用送审接口，请在此添加异步请求
    await new Promise((r) => setTimeout(r, 600))
    ElMessage({ message: t('formbusiness.leaveform.submitSuccess'), type: 'success', plain: true, showClose: true })
  } finally {
    approving.value = false
  }
}

/**
 * 页面挂载
 * 说明：加载初始化数据与下拉
 */
onMounted(async () => {
  try {
    loading.value = true
    await Promise.all([getLeaveTypeOptions(), getImportanceOptions()])
    const initialFormId = String(route.query.formId || route.params?.formId || form.formId || '')
    currentFormTypeId.value = String(route.query.formTypeId || defaultFormTypeId)
    if (initialFormId) {
      form.formId = initialFormId
      await getLeaveFormDetail(initialFormId)
    } else {
      await initLeaveForm()
    }
  } catch (error) {
    console.error('加载失败:', error)
    ElMessage.error(t('messages.loadError'))
  } finally {
    loading.value = false
  }
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
  border: 1.5px solid #c0c4cc;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  background: #ffffff;
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

.leave-form {
  padding: 0 20px;
}

.leave-form :deep(.el-input__wrapper),
.leave-form :deep(.el-select .el-input__wrapper),
.leave-form :deep(.el-date-editor) {
  border-color: #c0c4cc;
}

.leave-form :deep(.el-input__wrapper.is-focus),
.leave-form :deep(.el-select .el-input__wrapper.is-focus),
.leave-form :deep(.el-date-editor.is-active) {
  box-shadow: 0 0 0 2px rgba(192, 196, 204, 0.35) inset;
  border-color: #a8abb2;
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