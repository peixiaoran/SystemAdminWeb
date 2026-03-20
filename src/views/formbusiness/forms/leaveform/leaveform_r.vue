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

        <!-- 时长 / 代理人 -->
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item :label="t('formbusiness.leaveform.agentUserNo')" prop="agentUserNo">
              <el-input v-model="form.agentUserNo" :placeholder="t('formbusiness.leaveform.pleaseInputAgentUserNo')" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item :label="t('formbusiness.leaveform.leaveHours')" prop="leaveHours">
              <el-input-number
                v-model="form.leaveHours"
                :min="0"
                :step="0.01"
                :precision="2"
                :controls="false"
                style="width: 200px;"
                disabled
              />
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

        <!-- 附件上传 -->
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.leaveform.attachments')">
              <div class="upload-section">
                <el-upload
                  :show-file-list="false"
                  :http-request="handleUploadRequest"
                  multiple
                  :disabled="uploading"
                >
                  <el-button type="primary" plain :loading="uploading" :disabled="uploading">
                    <el-icon><Upload /></el-icon>
                    {{ t('formbusiness.leaveform.uploadFile') }}
                  </el-button>
                </el-upload>
                <div v-if="uploadedFiles.length > 0" class="file-list">
                  <div v-for="(file, idx) in uploadedFiles" :key="idx" class="file-item">
                    <el-icon class="file-icon"><Document /></el-icon>
                    <span class="file-name" :title="getFileName(file)">{{ getFileName(file) }}</span>
                    <el-button type="primary" link size="small" @click="handleDownload(file)">
                      <el-icon><Download /></el-icon>
                      {{ t('formbusiness.leaveform.download') }}
                    </el-button>
                    <el-button type="danger" link size="small" @click="removeFile(idx)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item>
              <el-button type="primary" style="width:80px;" @click="onSubmit" :loading="saving" :disabled="saving">{{ t('formbusiness.leaveform.saveButton') }}</el-button>
              <el-button type="warning" style="width:80px;" @click="onSubmitForApproval" :loading="approving" :disabled="approving">送审</el-button>
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
import { Upload, Document, Download, Delete } from '@element-plus/icons-vue'
import { post } from '@/utils/request'
import { INIT_LEAVEFORM_API, SAVE_LEAVEFORM_API, GET_LEAVEFORM_DETAIL_API, GET_LEAVEFORM_DROPDOWN_API, UPLOAD_FILE_API } from '@/config/api/formbusiness/forms/leaveform'
import { resolveFileUrl } from '@/utils/fileUrl'
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
// 附件上传状态与列表（相对路径）
const uploading = ref(false)
const uploadedFiles = ref([])

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
  applicantUserNo: '',
  applicantUserName: '',
  applicantDeptName: '',
  applicantDeptId: '',
  applicantTime: '',
  leaveTypeCode: '',
  leaveReason: '',
  leaveTimeRange: [],
  leaveHours: 0,
  agentUserNo: ''
})

// 下拉选项（来自接口）
const leaveTypeOptions = ref([])
// 校验规则
const rules = {
  leaveTypeCode: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'change' }
  ],
  leaveTimeRange: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'change' },
    { validator: validateTimeRange, trigger: 'change' }
  ],

  agentUserNo: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'blur' },
    { validator: validateHandoverUserNameRequired, trigger: 'blur' }
  ],
  leaveReason: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'blur' }
  ]
}

/**
 * 计算请假时长（按日计数规则）
 * 规则：天数按跨越的自然日计算（包含起止当日）；小时为实际跨度小时数（保留两位小数）
 * 示例：2025-11-22 08:00:00 至 2025-11-22 17:00:00 => 天数 1.00，小时 9.00
 */
function calculateDuration () {
  if (!form.leaveTimeRange || form.leaveTimeRange.length !== 2) {
    form.leaveHours = parseFloat((0).toFixed(2))
    return
  }
  const [startTime, endTime] = form.leaveTimeRange
  if (!startTime || !endTime) {
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
 * 计算跨越的自然日天数（包含起止当日）
 * 入参：开始/结束时间字符串或Date
 * 返回：end > start 时返回至少 1 的天数；否则返回 0
 */
function countCalendarDaysInclusive (startStr, endStr) {
  const start = new Date(typeof startStr === 'string' ? startStr.replace(' ', 'T') : startStr)
  const end = new Date(typeof endStr === 'string' ? endStr.replace(' ', 'T') : endStr)
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return 0
  const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  const msPerDay = 24 * 60 * 60 * 1000
  const diffDays = Math.floor((endDate.getTime() - startDate.getTime()) / msPerDay)
  return diffDays + 1
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
    agentUserNo: data.agentUserNo || ''
  })
  // 绑定附件列表（接口返回 attachments 为相对路径数组）
  if (Array.isArray(data.attachments)) {
    uploadedFiles.value = data.attachments.filter(Boolean)
  }
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
    formRef.value.clearValidate(['leaveTypeCode'])
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
 * 初始化请假单（生成 formId 后立即调用详情接口）
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
    if (!res || res.code !== 200) {
      return
    }
    // 接口返回 Result<int>，data 为新表单ID
    const newFormId = String(res.data)

    form.formId = newFormId
    // 默认请假时间：今天 ~ 明天（占位，后续详情会覆盖）
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0)
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 18, 0, 0)
    const pad = (n) => (n < 10 ? `0${n}` : `${n}`)
    const formatDateTime = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    form.leaveTimeRange = [formatDateTime(start), formatDateTime(end)]

    // 重要：在初始化成功后，立刻调用详情接口，真正加载表单编号和员工信息
    await getLeaveFormDetail(newFormId)
  } catch {

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
      ElMessage.error(res.message)
      return
    }
    const data = res.data || {}
    bindFormData(data)
  } catch {

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
      ElMessage.error(res.message)
      return
    }
    const list = Array.isArray(res.data) ? res.data : []
    leaveTypeOptions.value = list.map(item => ({
      label: item.leaveTypeName,
      value: String(item.leaveTypeCode)
    }))
  } catch {

  }
}

/**
 * 保存请假单：执行校验，通过后调用保存接口
 */
async function onSubmit () {
  saving.value = true
  formRef.value?.validate(async (valid) => {
    if (!valid) { saving.value = false; return }
    const [startTime, endTime] = Array.isArray(form.leaveTimeRange) ? form.leaveTimeRange : []
    const payload = {
      formTypeId: String(currentFormTypeId.value || defaultFormTypeId || ''),
      formId: String(form.formId || ''),
      formNo: form.formNo || '',
      leaveTypeCode: form.leaveTypeCode || '',
      leaveReason: (form.leaveReason || '').trim(),
      leaveStartTime: startTime ? toISO(startTime) : null,
      leaveEndTime: endTime ? toISO(endTime) : null,
      leaveHours: form.leaveHours ? Number(form.leaveHours) : 0,
      agentUserNo: (form.agentUserNo || '').trim()
    }
    try {
      const res = await post(SAVE_LEAVEFORM_API, payload)
      if (res && res.code === 200) {
        ElMessage({ message: res.message || t('messages.saveSuccess'), type: 'success', plain: true, showClose: true })
      } else {
        ElMessage({ message: res?.message || t('messages.saveError'), type: 'error', plain: true, showClose: true })
      }
    } catch {
      
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
 * el-upload 自定义上传处理
 * 将文件以 multipart/form-data 发送至 UPLOAD_FILE_API，
 * 服务端返回 List<string> 相对路径，追加到 uploadedFiles 列表
 */
async function handleUploadRequest(options) {
  uploading.value = true
  try {
    const currentFormId = String(form.formId || '')
    const rawFile = options.file instanceof File ? options.file : options.file?.raw

    if (!currentFormId) {
      throw new Error('formId不能为空')
    }
    if (!rawFile) {
      throw new Error('文件不能为空')
    }

    const formData = new window.FormData()
    formData.append('formId', currentFormId)
    formData.append('fileList', rawFile, rawFile.name)
    const res = await post(UPLOAD_FILE_API, formData)
    if (res && res.code === 200) {
      const paths = Array.isArray(res.data) ? res.data : []
      uploadedFiles.value = [...uploadedFiles.value, ...paths]
      ElMessage({ message: t('formbusiness.leaveform.uploadSuccess'), type: 'success', plain: true, showClose: true })
      options.onSuccess(res)
    } else {
      ElMessage({ message: res?.message || t('formbusiness.leaveform.uploadFailed'), type: 'error', plain: true, showClose: true })
      options.onError(new Error(res?.message || 'Upload failed'))
    }
  } catch (e) {
    ElMessage({ message: e?.message || t('formbusiness.leaveform.uploadFailed'), type: 'error', plain: true, showClose: true })
    options.onError(e)
  } finally {
    uploading.value = false
  }
}

/**
 * 从相对路径中提取文件名（取最后一段）
 */
function getFileName(relativePath) {
  if (!relativePath) return ''
  return relativePath.split('/').pop() || relativePath
}

/**
 * 下载文件：使用 resolveFileUrl 拼接 VITE_FILE_BROWSER_BASE_URL，触发浏览器下载
 */
function handleDownload(relativePath) {
  const url = resolveFileUrl(relativePath)
  if (!url) return
  const a = document.createElement('a')
  a.href = url
  a.download = getFileName(relativePath)
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * 从附件列表中移除指定索引的文件
 */
function removeFile(idx) {
  uploadedFiles.value.splice(idx, 1)
}

/**
 * 页面挂载
 * 说明：加载初始化数据与下拉
 */
onMounted(async () => {
  try {
    loading.value = true
    await Promise.all([getLeaveTypeOptions()])
    // 优先从路由获取 formId（编辑场景）
    const routeFormId = route.query.formId || route.params?.formId
    currentFormTypeId.value = String(route.query.formTypeId || defaultFormTypeId)
    if (routeFormId) {
      form.formId = String(routeFormId)
      await getLeaveFormDetail(form.formId)
    } else {
      // 新建场景：仅调用 initLeaveForm，内部会自动再调一次 GetLeaveForm
      await initLeaveForm()
    }
  } catch (error) {
    ElMessage.error(t('formbusiness.messages.loadError'))
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

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  font-size: 13px;
  color: #303133;
}

.file-icon {
  color: #409eff;
  font-size: 16px;
  flex-shrink: 0;
}

.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
</style>
