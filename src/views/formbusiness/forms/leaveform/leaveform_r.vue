<template>
  <div class="leave-form-page">
    <!-- 简单Skeleton骨架屏 -->
    <el-card v-if="loading && !resultState.visible" class="leave-form-card" shadow="never">
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
    <el-card v-else-if="resultState.visible" class="leave-form-card result-card" shadow="never">
      <el-result
        class="result-content"
        :icon="resultState.status"
        :title="t(resultState.titleKey)"
        :sub-title="t(resultState.subTitleKey)"
      >
        <template #extra>
          <el-button type="primary" @click="closeCurrentPage">
            {{ t('formbusiness.leaveform.backToPendingSubApp') }}
          </el-button>
        </template>
      </el-result>
    </el-card>

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
                <input
                  ref="fileInputRef"
                  type="file"
                  multiple
                  style="display: none;"
                  @change="onNativeFileChange"
                />
                <div class="upload-actions">
                  <el-button class="upload-trigger" type="primary" plain :loading="uploading" :disabled="uploading" @click="openFilePicker">
                    <el-icon><Upload /></el-icon>
                    {{ t('formbusiness.leaveform.uploadFile') }}
                  </el-button>
                  <span v-if="getAttachmentRequirementTip()" class="attachment-tip">
                    {{ getAttachmentRequirementTip() }}
                  </span>
                </div>
                <el-table v-if="uploadedFiles.length > 0" :data="uploadedFiles" border size="small" class="file-table">
                  <el-table-column type="index" width="55" align="center" label="#" />
                  <el-table-column :label="t('formbusiness.leaveform.fileName')" min-width="200">
                    <template #default="{ row }">
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <el-icon style="color: #409eff; flex-shrink: 0;"><Document /></el-icon>
                        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" :title="getFileName(row)">{{ getFileName(row) }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('formbusiness.leaveform.fileSize')" width="100" align="center">
                    <template #default="{ row }">
                      {{ formatFileSize(row.fileSize) }}
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('common.operation')" width="170" align="center">
                    <template #default="{ row, $index }">
                      <el-button type="primary" link size="small" @click="handleDownload(row)">
                        <el-icon><Download /></el-icon>
                        {{ t('formbusiness.leaveform.download') }}
                      </el-button>
                      <el-button type="danger" link size="small" @click="removeFile(row, $index)">
                        <el-icon><Delete /></el-icon>
                        {{ t('formbusiness.leaveform.deleteFile') }}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item class="form-actions-form-item">
              <div class="form-actions-row">
                <div class="form-actions-buttons">
                  <el-button type="primary" round style="width:80px;" @click="onSubmit" :loading="saving" :disabled="saving">{{ t('formbusiness.leaveform.saveButton') }}</el-button>
                  <el-button type="success" round style="width:80px;" @click="onSubmitForApproval" :loading="approving" :disabled="approving">{{ t('formbusiness.leaveform.submitButton') }}</el-button>
                </div>
                <el-tooltip :content="t('formbusiness.leaveform.viewFullWorkflow')" placement="top">
                  <el-button
                    class="workflow-view-btn"
                    circle
                    plain
                    type="primary"
                    :disabled="!form.formId"
                    @click="openWorkflowDrawer"
                  >
                    <el-icon><Guide /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-drawer
      v-model="workflowDrawerVisible"
      :title="t('formbusiness.leaveform.workflowDrawerTitle')"
      direction="rtl"
      size="420px"
      destroy-on-close
      class="leaveform-workflow-drawer"
    >
      <div v-loading="workflowDrawerLoading" class="workflow-drawer-body">
        <template v-if="!workflowDrawerLoading && workflowOverview.workflowApproveUser?.length">
          <div
            v-for="(step, stepIdx) in workflowOverview.workflowApproveUser"
            :key="step.stepId || stepIdx"
            class="workflow-step-block"
          >
            <div class="workflow-step-head">
              <span
                class="workflow-step-icon"
                :class="{
                  'is-done-step': workflowStepHeadState(stepIdx) === 'done',
                  'is-current-step': workflowStepHeadState(stepIdx) === 'current',
                  'is-pending-step': workflowStepHeadState(stepIdx) === 'pending'
                }"
              >
                <el-icon v-if="workflowStepHeadState(stepIdx) === 'done'"><CircleCheck /></el-icon>
                <el-icon v-else-if="workflowStepHeadState(stepIdx) === 'current'"><Clock /></el-icon>
                <el-icon v-else><Minus /></el-icon>
              </span>
              <span class="workflow-step-name">{{ step.stepName }}</span>
            </div>
            <ul v-if="step.stepApproveUser?.length" class="workflow-user-list">
              <li
                v-for="(u, uIdx) in step.stepApproveUser"
                :key="u.userId + '-' + uIdx"
                class="workflow-user-row"
                :class="{ 'workflow-user-row--has-agent': workflowUserHasAgent(u) }"
              >
                <span
                  class="workflow-user-status-icon"
                  :class="workflowUserStatusClass(stepIdx, u.isPending)"
                >
                  <el-icon v-if="workflowUserStatusIcon(stepIdx, u.isPending) === 'done'"><CircleCheck /></el-icon>
                  <el-icon v-else-if="workflowUserStatusIcon(stepIdx, u.isPending) === 'doing'"><Clock /></el-icon>
                  <el-icon v-else><Minus /></el-icon>
                </span>
                <div class="workflow-user-text">
                  <div class="workflow-user-name">
                    {{ u.userName }}<span v-if="u.appointmentTypeName && !workflowUserHasAgent(u)" class="workflow-user-appointment">（{{ u.appointmentTypeName }}）</span>
                  </div>
                  <div v-if="workflowUserHasAgent(u) && (u.agentUserName || u.appointmentTypeName)" class="workflow-user-meta">
                    {{ t('formbusiness.leaveform.workflowAgent') }}：{{ u.agentUserName }}<span v-if="u.appointmentTypeName" class="workflow-user-appointment">（{{ u.appointmentTypeName }}）</span>
                  </div>
                </div>
                <span
                  class="workflow-user-label"
                  :class="'workflow-user-label--' + workflowUserStatusIcon(stepIdx, u.isPending)"
                >{{ workflowUserStatusLabel(stepIdx, u.isPending) }}</span>
              </li>
            </ul>
          </div>
        </template>
        <el-empty v-else-if="!workflowDrawerLoading" :description="t('formbusiness.leaveform.workflowEmpty')" />
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import i18n from '@/i18n'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { Upload, Document, Download, Delete, Guide, Clock, CircleCheck, Minus } from '@element-plus/icons-vue'
import { post } from '@/utils/request'
import { INIT_LEAVEFORM_API, SAVE_LEAVEFORM_API, GET_LEAVEFORM_DETAIL_API, GET_LEAVEFORM_DROPDOWN_API, UPLOAD_FILE_API, DELETE_FILE_API, GET_WORKFLOW_ALL_APPROVE_USER_API } from '@/config/api/formbusiness/forms/leaveform'
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
const workflowDrawerVisible = ref(false)
const workflowDrawerLoading = ref(false)
const workflowOverview = reactive({
  formId: '',
  nowStepId: '',
  rejectLogList: [],
  workflowApproveUser: []
})

function getWorkflowCurrentStepIndex () {
  const cur = String(workflowOverview.nowStepId || '')
  if (!cur) return -1
  const list = workflowOverview.workflowApproveUser || []
  return list.findIndex((s) => String(s?.stepId || '') === cur)
}

function workflowStepPhase (stepIdx) {
  const curIdx = getWorkflowCurrentStepIndex()
  if (curIdx < 0) return 'after'
  if (stepIdx < curIdx) return 'done'
  if (stepIdx === curIdx) return 'current'
  return 'after'
}

function workflowStepHeadState (stepIdx) {
  const phase = workflowStepPhase(stepIdx)
  if (phase === 'done') return 'done'
  if (phase === 'current') return 'current'
  return 'pending'
}

function workflowUserStatusIcon (stepIdx, isPending) {
  const phase = workflowStepPhase(stepIdx)
  if (phase === 'done') return 'done'
  if (phase === 'after') return 'none'
  return Number(isPending) === 1 ? 'done' : 'doing'
}

function workflowUserStatusClass (stepIdx, isPending) {
  const key = workflowUserStatusIcon(stepIdx, isPending)
  if (key === 'done') return 'is-user-done'
  if (key === 'doing') return 'is-user-doing'
  return 'is-user-none'
}

function workflowUserStatusLabel (stepIdx, isPending) {
  const phase = workflowStepPhase(stepIdx)
  if (phase === 'done') {
    return t('formbusiness.leaveform.workflowStatusApproved')
  }
  if (phase === 'after') {
    return t('formbusiness.leaveform.workflowStatusNotSigned')
  }
  return Number(isPending) === 1
    ? t('formbusiness.leaveform.workflowStatusApproved')
    : t('formbusiness.leaveform.workflowStatusSigning')
}

function workflowUserHasAgent (u) {
  const id = u?.agentUserId
  if (id === undefined || id === null || id === '') return false
  return String(id) !== '0'
}

const resultState = reactive({
  visible: false,
  status: 'success',
  titleKey: 'formbusiness.leaveform.approvalResultTitle',
  subTitleKey: 'formbusiness.leaveform.approvalResultSubTitle'
})
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
  if (Array.isArray(data.fileList)) {
    uploadedFiles.value = data.fileList.filter(Boolean)
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

function isForbiddenCode(code) {
  return String(code) === '403'
}

function showResult(status, titleKey, subTitleKey) {
  resultState.visible = true
  resultState.status = status
  resultState.titleKey = titleKey
  resultState.subTitleKey = subTitleKey
}

function closeCurrentPage() {
  window.close()
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
      },
      silentForbiddenError: false
    })
    if (isForbiddenCode(res?.code)) {
      showResult('warning', 'formbusiness.leaveform.forbiddenResultTitle', 'formbusiness.leaveform.forbiddenResultSubTitle')
      return
    }
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
      headers: { 'Content-Type': 'multipart/form-data' },
      silentForbiddenError: false
    })
    if (!res) return
    if (isForbiddenCode(res.code)) {
      showResult('warning', 'formbusiness.leaveform.forbiddenResultTitle', 'formbusiness.leaveform.forbiddenResultSubTitle')
      return
    }
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
      const res = await post(SAVE_LEAVEFORM_API, payload, {
        silentForbiddenError: false
      })
      if (isForbiddenCode(res?.code)) {
        showResult('warning', 'formbusiness.leaveform.forbiddenResultTitle', 'formbusiness.leaveform.forbiddenResultSubTitle')
      } else if (res && res.code === 200) {
        ElNotification({
          title: '',
          message: res.message,
          type: 'success'
        })
      } else {
        ElNotification({
          title: '',
          message: res?.message,
          type: 'error'
        })
      }
    } catch {
      
    } finally {
      saving.value = false
    }
  })
}

async function fetchWorkflowAllApproveUser () {
  const fromId = String(form.formId || '')
  if (!fromId) return
  workflowDrawerLoading.value = true
  try {
    const formData = new window.FormData()
    formData.append('fromId', fromId)
    const res = await post(GET_WORKFLOW_ALL_APPROVE_USER_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      silentForbiddenError: false
    })
    if (isForbiddenCode(res?.code)) {
      showResult('warning', 'formbusiness.leaveform.forbiddenResultTitle', 'formbusiness.leaveform.forbiddenResultSubTitle')
      workflowDrawerVisible.value = false
      return
    }
    if (!res || res.code !== 200) {
      ElMessage.error(res?.message || t('formbusiness.leaveform.workflowLoadFailed'))
      return
    }
    const data = res.data || {}
    workflowOverview.formId = data.formId || ''
    workflowOverview.nowStepId = data.nowStepId || ''
    workflowOverview.rejectLogList = Array.isArray(data.rejectLogList) ? data.rejectLogList : []
    workflowOverview.workflowApproveUser = Array.isArray(data.workflowApproveUser) ? data.workflowApproveUser : []
  } catch {
    ElMessage.error(t('formbusiness.leaveform.workflowLoadFailed'))
  } finally {
    workflowDrawerLoading.value = false
  }
}

function openWorkflowDrawer () {
  if (!form.formId) {
    ElMessage.warning(t('formbusiness.leaveform.workflowNeedFormId'))
    return
  }
  workflowDrawerVisible.value = true
  fetchWorkflowAllApproveUser()
}

/**
 * 送审请假单：确认弹窗期间不加载；用户点确定后再进入加载并完成送审结果展示
 */
async function onSubmitForApproval () {
  const valid = await new Promise((resolve) => {
    formRef.value?.validate((v) => resolve(!!v))
  })
  if (!valid) return
  if (shouldRequireAttachment() && uploadedFiles.value.length === 0) {
    ElMessage({ message: getAttachmentRequirementTip(), type: 'warning', plain: true, showClose: true })
    return
  }
  try {
    await ElMessageBox.confirm(
      t('formbusiness.leaveform.submitConfirmMessage'),
      t('formbusiness.leaveform.submitConfirmTitle'),
      {
        type: 'warning',
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        closeOnClickModal: false
      }
    )
  } catch {
    return
  }
  approving.value = true
  try {
    showResult('success', 'formbusiness.leaveform.approvalResultTitle', 'formbusiness.leaveform.approvalResultSubTitle')
  } finally {
    approving.value = false
  }
}

const fileInputRef = ref(null)

const leaveTypeAttachmentTipMap = [
  { keywords: ['sick'], key: 'attachmentTipSick' },
  { keywords: ['marriage'], key: 'attachmentTipMarriage' },
  { keywords: ['maternity'], key: 'attachmentTipMaternity' },
  { keywords: ['paternity'], key: 'attachmentTipPaternity' },
  { keywords: ['nursing'], key: 'attachmentTipNursing' },
  { keywords: ['bereavement'], key: 'attachmentTipBereavement' }
]

function isSuccessCode(code) {
  return String(code) === '200'
}

function getCurrentLeaveTypeOption() {
  const current = leaveTypeOptions.value.find(item => String(item.value) === String(form.leaveTypeCode || ''))
  return current || null
}

function normalizeLeaveTypeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '')
}

function getAttachmentRequirementKey() {
  const current = getCurrentLeaveTypeOption()
  const candidates = [
    normalizeLeaveTypeText(form.leaveTypeCode),
    normalizeLeaveTypeText(current?.label),
    normalizeLeaveTypeText(current?.value)
  ].filter(Boolean)

  const matched = leaveTypeAttachmentTipMap.find(item =>
    item.keywords.some(keyword => candidates.some(text => text.includes(keyword)))
  )

  return matched?.key || ''
}

function getAttachmentRequirementTip() {
  const key = getAttachmentRequirementKey()
  return key ? t(`formbusiness.leaveform.${key}`) : ''
}

function shouldRequireAttachment() {
  return !!getAttachmentRequirementKey()
}

function openFilePicker() {
  if (uploading.value) return
  fileInputRef.value?.click()
}

function onNativeFileChange(event) {
  const files = Array.from(event?.target?.files || [])
  if (files.length > 0) {
    batchUpload(files)
  }
}

/**
 * 批量上传：将所有待上传文件合并为一个请求发送
 */
async function batchUpload(filesToUpload) {
  uploading.value = true
  try {
    const currentFormId = String(form.formId || '')
    const formData = new window.FormData()
    formData.append('formId', currentFormId)
    for (const item of filesToUpload) {
      if (item instanceof File) {
        formData.append('files', item, item.name)
      }
    }
    const res = await post(UPLOAD_FILE_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    if (res && isSuccessCode(res.code)) {
      const files = Array.isArray(res.data) ? res.data : []
      uploadedFiles.value = [...uploadedFiles.value, ...files]
    }
  } catch (e) {
  } finally {
    uploading.value = false
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

/**
 * 格式化文件大小（KB）为可读字符串
 */
function formatFileSize(sizeKB) {
  if (!sizeKB && sizeKB !== 0) return '-'
  const size = Number(sizeKB)
  if (size < 1024) return `${size} KB`
  return `${(size / 1024).toFixed(2)} MB`
}

function getFileName(file) {
  return file?.fileName || ''
}

/**
 * 下载文件：使用 resolveFileUrl 拼接 VITE_FILE_BROWSER_BASE_URL，触发浏览器下载
 */
function handleDownload(file) {
  const url = resolveFileUrl(file?.filePath)
  if (!url) return
  const a = document.createElement('a')
  a.href = url
  a.download = getFileName(file)
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * 删除附件：调用 DELETE_FILE_API 后从列表移除
 */
async function removeFile(file, idx) {
  try {
    const formData = new window.FormData()
    formData.append('fileId', String(file.fileId || ''))
    formData.append('filePath', String(file.filePath || ''))
    const res = await post(DELETE_FILE_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    if (res && isSuccessCode(res.code)) {
      uploadedFiles.value.splice(idx, 1)
    } else {
      ElMessage({ message: res?.message || t('formbusiness.leaveform.deleteFailed'), type: 'error', plain: true, showClose: true })
    }
  } catch {
    ElMessage({ message: t('formbusiness.leaveform.deleteFailed'), type: 'error', plain: true, showClose: true })
  }
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

.result-card {
  border: none;
  box-shadow: none;
  min-height: calc(100vh - 32px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-content {
  width: 100%;
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

.upload-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.upload-trigger {
  width: auto;
  align-self: flex-start;
}

.attachment-tip {
  display: inline-flex;
  align-items: center;
  color: #e6a23c;
  font-size: 13px;
  line-height: 1.4;
}

.file-table {
  width: 100%;
  margin-top: 4px;
}

.form-actions-form-item :deep(.el-form-item__content) {
  width: 100%;
}

.form-actions-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
  flex-wrap: wrap;
}

.form-actions-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.workflow-view-btn {
  flex-shrink: 0;
}

.workflow-drawer-body {
  min-height: 120px;
}

.workflow-step-block {
  padding-bottom: 20px;
  border-left: 2px solid var(--el-border-color-lighter);
  margin-left: 11px;
  padding-left: 20px;
}

.workflow-step-block:last-child {
  border-left-color: transparent;
}

.workflow-step-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  margin-left: -31px;
}

.workflow-step-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 14px;
  flex-shrink: 0;
}

.workflow-step-icon.is-done-step {
  color: var(--el-color-success);
  background: var(--el-color-success-light-9);
}

.workflow-step-icon.is-current-step {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.workflow-step-icon.is-pending-step {
  color: var(--el-text-color-placeholder);
  background: var(--el-fill-color-light);
}

.workflow-step-name {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.workflow-user-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.workflow-user-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0 8px 4px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.workflow-user-row:last-child {
  border-bottom: none;
}

.workflow-user-status-icon {
  display: inline-flex;
  margin-top: 2px;
  flex-shrink: 0;
}

.workflow-user-status-icon.is-user-done {
  color: var(--el-color-success);
}

.workflow-user-status-icon.is-user-doing {
  color: var(--el-color-primary);
}

.workflow-user-status-icon.is-user-none {
  color: var(--el-text-color-placeholder);
}

.workflow-user-text {
  flex: 1;
  min-width: 0;
}

.workflow-user-name {
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.workflow-user-appointment {
  color: var(--el-text-color-secondary);
}

.workflow-user-meta {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
}

/* 仅「代理人：xxx」一行：略右移，与上行姓名拉开一点纵向间距 */
.workflow-user-row--has-agent .workflow-user-meta {
  margin-left: 12px;
  margin-top: 8px;
}

.workflow-user-label {
  flex-shrink: 0;
  font-size: 12px;
  white-space: nowrap;
  margin-top: 2px;
}

.workflow-user-label--done {
  color: var(--el-color-success);
}

.workflow-user-label--doing {
  color: var(--el-color-primary);
}

.workflow-user-label--none {
  color: var(--el-text-color-placeholder);
}

</style>
