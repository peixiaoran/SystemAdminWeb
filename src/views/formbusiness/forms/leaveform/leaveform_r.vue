<template>
  <div class="leave-form-page">
    <!-- Skeleton 骨架屏 -->
    <template v-if="loading && !resultState.visible">
      <!-- 表单卡片骨架 -->
      <el-card class="leave-form-card" shadow="never">
        <el-skeleton animated>
          <template #template>
            <!-- 系统标题 -->
            <div style="display:flex; justify-content:center; margin-bottom:16px;">
              <el-skeleton-item variant="text" style="width:200px; height:28px;" />
            </div>
            <!-- 表单标题 -->
            <div style="display:flex; justify-content:center; margin-bottom:24px;">
              <el-skeleton-item variant="text" style="width:130px; height:22px;" />
            </div>
            <!-- 分割线 -->
            <el-skeleton-item variant="text" style="width:100%; height:1px; margin-bottom:24px;" />

            <!-- 表单号（1/3 宽） -->
            <div style="display:flex; gap:16px; margin-bottom:22px; padding:0 20px;">
              <el-skeleton-item variant="text" style="width:33%; height:32px;" />
            </div>

            <!-- 员工信息（3 列） -->
            <div style="display:flex; gap:16px; margin-bottom:22px; padding:0 20px;">
              <el-skeleton-item variant="text" style="flex:1; height:32px;" />
              <el-skeleton-item variant="text" style="flex:1; height:32px;" />
              <el-skeleton-item variant="text" style="flex:1; height:32px;" />
            </div>
            <!-- 分割线 -->
            <el-skeleton-item variant="text" style="width:100%; height:1px; margin-bottom:22px;" />

            <!-- 请假类型 + 时间范围 -->
            <div style="display:flex; gap:16px; margin-bottom:22px; padding:0 20px;">
              <el-skeleton-item variant="text" style="width:33%; height:32px;" />
              <el-skeleton-item variant="text" style="flex:1; height:32px;" />
            </div>

            <!-- 代理人 + 请假天数 -->
            <div style="display:flex; gap:16px; margin-bottom:22px; padding:0 20px;">
              <el-skeleton-item variant="text" style="width:33%; height:32px;" />
              <el-skeleton-item variant="text" style="width:200px; height:32px;" />
            </div>

            <!-- 请假事由 -->
            <div style="margin-bottom:22px; padding:0 20px;">
              <el-skeleton-item variant="text" style="width:100%; height:76px;" />
            </div>

            <!-- 附件区域 -->
            <div style="margin-bottom:22px; padding:0 20px;">
              <el-skeleton-item variant="button" style="width:100px; height:32px;" />
            </div>

            <!-- 审批意见 -->
            <div style="margin-bottom:22px; padding:0 20px;">
              <el-skeleton-item variant="text" style="width:100%; height:60px;" />
            </div>

            <!-- 操作按钮行 -->
            <div style="display:flex; justify-content:space-between; align-items:center; padding:0 20px;">
              <div style="display:flex; gap:12px;">
                <el-skeleton-item variant="button" style="width:80px; height:32px; border-radius:16px;" />
                <el-skeleton-item variant="button" style="width:80px; height:32px; border-radius:16px;" />
                <el-skeleton-item variant="button" style="width:80px; height:32px; border-radius:16px;" />
              </div>
              <el-skeleton-item variant="circle" style="width:32px; height:32px;" />
            </div>
          </template>
        </el-skeleton>
      </el-card>

      <!-- 审批记录卡片骨架 -->
      <el-card class="leave-form-card review-log-card" shadow="never">
        <el-skeleton animated>
          <template #template>
            <!-- 标题 -->
            <el-skeleton-item variant="text" style="width:80px; height:20px; margin-bottom:16px;" />
            <!-- 表格头 -->
            <el-skeleton-item variant="text" style="width:100%; height:36px; margin-bottom:2px;" />
            <!-- 表格行 × 3 -->
            <el-skeleton-item variant="text" style="width:100%; height:44px; margin-bottom:2px;" />
            <el-skeleton-item variant="text" style="width:100%; height:44px; margin-bottom:2px;" />
            <el-skeleton-item variant="text" style="width:100%; height:44px;" />
          </template>
        </el-skeleton>
      </el-card>
    </template>
    
    <!-- 实际表单内容 -->
    <el-card v-else-if="resultState.visible" class="leave-form-card result-card" shadow="never">
      <el-result
        class="result-content"
        :class="{ 'result-content--bad-request': resultState.variant === 'badRequest' }"
        :icon="resultState.status"
        :title="resultState.variant === 'badRequest' ? resultState.detailMessage : t(resultState.titleKey)"
      >
        <template #sub-title>
          <p v-if="resultState.variant === 'badRequest'" class="leaveform-bad-request-desc">
            {{ t('formbusiness.leaveform.badRequestHint') }}
          </p>
          <span v-else>{{ t(resultState.subTitleKey) }}</span>
        </template>
        <template #extra>
          <el-button type="primary" @click="closeCurrentPage">
            {{ t('formbusiness.leaveform.backToPendingReview') }}
          </el-button>
        </template>
      </el-result>
    </el-card>

    <template v-else>
    <el-card class="leave-form-card" shadow="never" v-loading="saving || approving">
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
              <el-input v-model="form.formNo" disabled />
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
            <el-form-item :label="t('formbusiness.leaveform.leaveType')" prop="leaveType">
              <el-select v-model="form.leaveType" :placeholder="t('formbusiness.leaveform.pleaseSelectLeaveType')" clearable @change="onSelectChange('leaveType')">
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
            <el-form-item :label="t('formbusiness.leaveform.days')" prop="days">
              <el-input-number
                v-model="form.days"
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
            <el-form-item :label="t('formbusiness.leaveform.leaveReason')" prop="reason">
              <el-input v-model="form.reason" type="textarea" :rows="3" :placeholder="t('formbusiness.leaveform.pleaseInputLeaveReason')" />
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
                <el-table v-if="uploadedAttachments.length > 0" :data="uploadedAttachments" border size="small" class="attachment-table">
                  <el-table-column type="index" width="55" align="center" label="#" />
                  <el-table-column :label="t('formbusiness.leaveform.fileName')" min-width="200">
                    <template #default="{ row }">
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <el-icon style="color: #409eff; flex-shrink: 0;"><Document /></el-icon>
                        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" :title="getAttachmentName(row)">{{ getAttachmentName(row) }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('formbusiness.leaveform.fileSize')" width="100" align="center">
                    <template #default="{ row }">
                      {{ formatFileSize(getAttachmentSizeKb(row)) }}
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('common.operation')" width="170" align="center">
                    <template #default="{ row, $index }">
                      <el-button type="primary" link size="small" @click="handleDownload(row)">
                        <el-icon><Download /></el-icon>
                        {{ t('formbusiness.leaveform.download') }}
                      </el-button>
                      <el-button type="danger" link size="small" @click="removeAttachment(row, $index)">
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
            <el-form-item :label="t('formbusiness.leaveform.approvalComment')">
              <el-input
                v-model="approvalComment"
                type="textarea"
                :rows="3"
                :placeholder="t('formbusiness.leaveform.approvalCommentPlaceholder')"
              />
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
                  <el-button type="danger" round style="width:80px;" @click="onReject" :disabled="saving || approving">{{ t('formbusiness.leaveform.rejectButton') }}</el-button>
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
                    <el-icon class="workflow-view-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="4.5" r="2.15" />
                        <line x1="12" y1="6.65" x2="12" y2="9.85" />
                        <circle cx="12" cy="12" r="2.15" />
                        <line x1="12" y1="14.15" x2="12" y2="17.35" />
                        <circle cx="12" cy="19.5" r="2.15" />
                      </svg>
                    </el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 审批记录独立卡片 -->
    <el-card class="leave-form-card review-log-card" shadow="never">
      <div class="review-log-section">
        <div class="review-log-title">{{ t('formbusiness.leaveform.reviewLog') }}</div>
        <el-table
          v-if="reviewLogTableRows.length"
          :data="reviewLogTableRows"
          :span-method="reviewLogSpanMethod"
          :max-height="280"
          size="small"
          class="review-log-table"
        >
          <el-table-column type="index" label="#" width="46" align="center" />
          <el-table-column
            prop="stepName"
            :label="t('formbusiness.leaveform.reviewLogStep')"
            width="130"
            align="left"
          >
            <template #default="{ row }">
              <span class="review-log-step-cell">{{ row.stepName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('formbusiness.leaveform.reviewLogOperationUser')"
            width="220"
            align="left"
          >
            <template #default="{ row }">
              <div class="review-log-user-wrap">
                <!-- 自动标记：右上角小字 -->
                <span
                  v-if="row.reviewType && row.reviewType.toLowerCase() === 'automatic'"
                  class="review-log-auto-badge"
                >{{ row.reviewTypeName }}</span>
                <!-- 第一行：实际操作人 -->
                <span class="review-log-user-cell">{{ row.operationUserName }}</span>
                <!-- 第二行：代理人 + 签核身份（有内容才显示） -->
                <div
                  v-if="(row.originalUserName && row.originalUserName !== row.operationUserName) || (row.appointmentType && row.appointmentType.toLowerCase() !== 'actual')"
                  class="review-log-sub-row"
                >
                  <span v-if="row.originalUserName && row.originalUserName !== row.operationUserName" class="review-log-original-cell">{{ row.originalUserName }}</span>
                  <span v-if="row.appointmentType && row.appointmentType.toLowerCase() !== 'actual'" class="review-log-appointment-cell">{{ row.appointmentTypeName }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('formbusiness.leaveform.reviewLogResult')"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag :type="getReviewResultTagType(row)" size="small">
                {{ row.reviewResultName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="comment"
            :label="t('formbusiness.leaveform.reviewLogComment')"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            :label="t('formbusiness.leaveform.reviewLogDateTime')"
            width="155"
            align="center"
          >
            <template #default="{ row }">{{ formatReviewDateTime(row.reviewDateTime) }}</template>
          </el-table-column>
        </el-table>
        <el-empty
          v-else
          :description="t('formbusiness.leaveform.reviewLogEmpty')"
          style="padding: 20px 0;"
        />
      </div>
    </el-card>
    </template>

    <!-- 驳回弹窗 -->
    <el-dialog
      v-model="rejectDialogVisible"
      :title="t('formbusiness.leaveform.rejectDialogTitle')"
      width="480px"
      :close-on-click-modal="false"
      :append-to-body="true"
      class="modal-penetrable"
      @close="onRejectDialogClose"
    >
      <el-form ref="rejectFormRef" :model="rejectForm" :rules="rejectRules" label-width="100px">
        <el-form-item :label="t('formbusiness.leaveform.rejectStepLabel')" prop="rejectStepId">
          <el-select
            v-model="rejectForm.rejectStepId"
            :placeholder="t('formbusiness.leaveform.rejectStepPlaceholder')"
            style="width: 100%;"
          >
            <el-option
              v-for="step in rejectStepDropOptions"
              :key="step.stepId"
              :label="step.stepName"
              :value="step.stepId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('formbusiness.leaveform.rejectReasonLabel')" prop="rejectReason">
          <el-input
            v-model="rejectForm.rejectReason"
            type="textarea"
            :rows="3"
            :placeholder="t('formbusiness.leaveform.rejectReasonPlaceholder')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="danger" @click="confirmReject" :loading="rejecting">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <el-drawer
      v-model="workflowDrawerVisible"
      :title="t('formbusiness.leaveform.workflowDrawerTitle')"
      direction="rtl"
      size="420px"
      destroy-on-close
      class="leaveform-workflow-drawer"
    >
      <div v-loading="workflowDrawerLoading" class="workflow-drawer-body">
        <template v-if="!workflowDrawerLoading && workflowOverview.stepReviewFlowList?.length">
          <div
            v-for="(step, stepIdx) in workflowOverview.stepReviewFlowList"
            :key="step.stepId || stepIdx"
            class="workflow-step-block"
            :class="{ 'workflow-step-block--skipped': isWorkflowStepSkipped(step) }"
          >
            <div class="workflow-step-head">
              <span
                class="workflow-step-icon"
                :class="{
                  'is-done-step': workflowStepHeadState(step) === 'done',
                  'is-current-step': workflowStepHeadState(step) === 'current',
                  'is-pending-step': workflowStepHeadState(step) === 'pending',
                  'is-skipped-step': workflowStepHeadState(step) === 'skipped'
                }"
              >
                <el-icon v-if="workflowStepHeadState(step) === 'skipped'"><RemoveFilled /></el-icon>
                <el-icon v-else-if="workflowStepHeadState(step) === 'done'"><CircleCheck /></el-icon>
                <el-icon v-else-if="workflowStepHeadState(step) === 'current'"><Loading /></el-icon>
                <el-icon v-else><Clock /></el-icon>
              </span>
              <span class="workflow-step-name">{{ step.stepName }}</span>
              <span v-if="isWorkflowStepSkipped(step)" class="workflow-step-tag workflow-step-tag--skipped">
                {{ t('formbusiness.leaveform.workflowStatusSkipped') }}
              </span>
            </div>
            <ul
              v-if="step.stepReviewUser?.length && !isWorkflowStepSkipped(step)"
              class="workflow-user-list"
            >
              <li
                v-for="(u, uIdx) in step.stepReviewUser"
                :key="String(u.reviewUserId ?? u.ReviewUserId ?? u.userId ?? u.UserId ?? 'u') + '-' + uIdx"
                class="workflow-user-row"
                :class="{ 'workflow-user-row--has-agent': workflowUserHasAgent(u) }"
              >
                <span
                  class="workflow-user-status-icon"
                  :class="workflowUserStatusClass(u)"
                >
                  <el-icon v-if="workflowUserStatusIcon(u) === 'approve'"><CircleCheck /></el-icon>
                  <el-icon v-else-if="workflowUserStatusIcon(u) === 'underReview'"><Loading /></el-icon>
                  <el-icon v-else><Clock /></el-icon>
                </span>
                <div class="workflow-user-text">
                  <div class="workflow-user-name">
                    {{ workflowReviewUserName(u) }}<span v-if="workflowUserShowAppointmentTypeName(u) && !workflowUserHasAgent(u)" class="workflow-user-appointment">（{{ u.appointmentTypeName }}）</span>
                  </div>
                  <div v-if="workflowUserHasAgent(u) && (u.agentUserName || workflowUserShowAppointmentTypeName(u))" class="workflow-user-meta">
                    {{ t('formbusiness.leaveform.workflowAgent') }}：{{ u.agentUserName }}<span v-if="workflowUserShowAppointmentTypeName(u)" class="workflow-user-appointment">（{{ u.appointmentTypeName }}）</span>
                  </div>
                </div>
                <span
                  class="workflow-user-label"
                  :class="'workflow-user-label--' + workflowUserStatusIcon(u)"
                >{{ workflowUserStatusLabel(u) }}</span>
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
import { reactive, ref, computed, onMounted } from 'vue'
import i18n from '@/i18n'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { Upload, Document, Download, Delete, Clock, CircleCheck, RemoveFilled, Loading } from '@element-plus/icons-vue'
import { post } from '@/utils/request'
import { INIT_LEAVEFORM_API, SAVE_LEAVEFORM_API, GET_LEAVEFORM_DETAIL_API, GET_LEAVEFORM_DROPDOWN_API, UPLOAD_FILE_API, DELETE_FILE_API, GET_FULL_REVIEW_FLOW_API, APPROVE_LEAVEFORM_API, REJECT_LEAVEFORM_API, GET_FORM_NOTIFICATION_TOKEN_API } from '@/config/api/formbusiness/forms/leaveform'
import { resolveFileUrl } from '@/utils/fileUrl'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 获取翻译函数
const { t } = i18n.global

// 表单引用
const formRef = ref(null)
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 加载状态
const loading = ref(true)
// 暂存与送审按钮加载状态
const saving = ref(false)
const approving = ref(false)
const workflowDrawerVisible = ref(false)
const workflowDrawerLoading = ref(false)
const workflowOverview = reactive({
  formId: '',
  rejectCount: 0,
  stepReviewFlowList: []
})

/** 步骤是否被跳过：skip = 1 整步置灰且不展示用户明细 */
function isWorkflowStepSkipped (step) {
  return Number(step?.skip) === 1
}

/** 用户签核状态：归一化到 approve / underReview / unsigned 三态 */
function normalizeReviewResult (result) {
  const v = String(result ?? '').trim().toLowerCase()
  if (v === 'approve' || v === 'approved') return 'approve'
  if (v === 'underreview' || v === 'under_review' || v === 'reviewing') return 'underReview'
  return 'unsigned'
}

/**
 * 步骤头部状态（聚合自 stepReviewUser.result）：
 * - skip=1：skipped
 * - 全部 approve：done
 * - 任一 underReview：current
 * - 否则：pending
 */
function workflowStepHeadState (step) {
  if (isWorkflowStepSkipped(step)) return 'skipped'
  const users = Array.isArray(step?.stepReviewUser) ? step.stepReviewUser : []
  if (users.length === 0) return 'pending'
  const states = users.map((u) => normalizeReviewResult(u?.result))
  if (states.every((s) => s === 'approve')) return 'done'
  if (states.some((s) => s === 'underReview')) return 'current'
  return 'pending'
}

function workflowUserStatusIcon (user) {
  return normalizeReviewResult(user?.result)
}

function workflowUserStatusClass (user) {
  const key = workflowUserStatusIcon(user)
  if (key === 'approve') return 'is-user-done'
  if (key === 'underReview') return 'is-user-doing'
  return 'is-user-none'
}

function workflowUserStatusLabel (user) {
  const key = workflowUserStatusIcon(user)
  if (key === 'approve') return t('formbusiness.leaveform.workflowStatusApprove')
  if (key === 'underReview') return t('formbusiness.leaveform.workflowStatusUnderReview')
  return t('formbusiness.leaveform.workflowStatusUnsigned')
}

/** 签核人显示姓名：优先 reviewUserName / ReviewUserName，兼容 userName / UserName */
function workflowReviewUserName (u) {
  const name = u?.reviewUserName ?? u?.ReviewUserName ?? u?.userName ?? u?.UserName
  if (name == null || name === '') return ''
  return String(name)
}

function workflowUserHasAgent (u) {
  const id = u?.agentUserId
  if (id === undefined || id === null || id === '') return false
  return String(id) !== '0'
}

/** appointmentTypeCode 为 Actual 时不展示 appointmentTypeName */
function workflowUserShowAppointmentTypeName (u) {
  if (!u?.appointmentTypeName) return false
  const code = String(u?.appointmentTypeCode ?? u?.AppointmentTypeCode ?? '').trim()
  if (code.toLowerCase() === 'actual') return false
  return true
}

const resultState = reactive({
  visible: false,
  variant: 'standard',
  detailMessage: '',
  status: 'success',
  titleKey: 'formbusiness.leaveform.approvalResultTitle',
  subTitleKey: 'formbusiness.leaveform.approvalResultSubTitle'
})
// 送审意见
const approvalComment = ref('')

// 签核日志列表
const reviewRecordList = ref([])
// 驳回步骤下拉选项
const rejectStepDropOptions = ref([])

/**
 * 按 stepId（无则降级为 stepName）对签核记录分组，保持原始顺序
 */
/**
 * 按 stepId（无则降级 stepName）对排序后的记录分组：
 * 只合并【相邻】的相同步骤，非相邻的同步骤单独成组，
 * 避免 ReviewDateTime 排序后跨位置误合并。
 */
const groupedReviewRecords = computed(() => {
  const groups = []
  for (const record of reviewRecordList.value) {
    const key = record.stepId != null && String(record.stepId) !== ''
      ? String(record.stepId)
      : (record.stepName || '')
    const last = groups[groups.length - 1]
    const lastKey = last
      ? (last.stepId || last.stepName)
      : null
    if (last && lastKey === key) {
      last.records.push(record)
    } else {
      groups.push({ stepId: record.stepId || '', stepName: record.stepName || '', records: [record] })
    }
  }
  return groups
})

/**
 * 将分组数据展平为表格行，附带步骤列合并所需的 _rowSpan
 */
const reviewLogTableRows = computed(() => {
  const rows = []
  for (const group of groupedReviewRecords.value) {
    group.records.forEach((record, rIdx) => {
      rows.push({
        ...record,
        stepName: group.stepName,
        stepId: group.stepId,
        _rowSpan: rIdx === 0 ? group.records.length : 0
      })
    })
  }
  return rows
})

/**
 * 步骤列（第 0 列）按分组合并单元格
 */
function reviewLogSpanMethod ({ columnIndex, rowIndex }) {
  if (columnIndex === 0) {
    const row = reviewLogTableRows.value[rowIndex]
    if (!row) return { rowspan: 1, colspan: 1 }
    return row._rowSpan > 0
      ? { rowspan: row._rowSpan, colspan: 1 }
      : { rowspan: 0, colspan: 0 }
  }
}

// 驳回弹窗状态
const rejectDialogVisible = ref(false)
const rejectFormRef = ref(null)
const rejecting = ref(false)
const rejectForm = reactive({
  rejectStepId: '',
  rejectReason: ''
})

const rejectRules = {
  rejectStepId: [
    { required: true, message: t('formbusiness.leaveform.rejectStepRequired'), trigger: 'change' }
  ],
  rejectReason: [
    { required: true, message: t('formbusiness.leaveform.rejectReasonRequired'), trigger: 'blur' }
  ]
}

// 附件上传状态与列表（相对路径）
const uploading = ref(false)
const uploadedAttachments = ref([])

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
  leaveType: '',
  reason: '',
  leaveTimeRange: [],
  days: 0,
  agentUserNo: ''
})

// 下拉选项（来自接口）
const leaveTypeOptions = ref([])
// 校验规则
const rules = {
  leaveType: [
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
  reason: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'blur' }
  ]
}

/** 将接口或输入值规范为天数（非有限数或负值按 0，保留两位小数） */
function coerceDays (v) {
  if (v === undefined || v === null || v === '') return 0
  const n = Number(v)
  if (!Number.isFinite(n)) return 0
  return parseFloat(Math.max(0, n).toFixed(2))
}

/**
 * 计算请假天数（按自然日，含起止当日）
 * 示例：2025-11-22 08:00:00 至 2025-11-22 17:00:00 => 1.00 天
 */
function calculateDuration () {
  if (!form.leaveTimeRange || form.leaveTimeRange.length !== 2) {
    form.days = coerceDays(0)
    return
  }
  const [startTime, endTime] = form.leaveTimeRange
  if (!startTime || !endTime) {
    form.days = coerceDays(0)
    return
  }
  const start = new Date(typeof startTime === 'string' ? startTime.replace(' ', 'T') : startTime)
  const end = new Date(typeof endTime === 'string' ? endTime.replace(' ', 'T') : endTime)
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    form.days = coerceDays(0)
    return
  }
  const calendarDays = countCalendarDaysInclusive(startTime, endTime)
  form.days = coerceDays(calendarDays)
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
  const total = coerceDays(form.days)
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
    leaveType: normalizeSelectCode(
      data.leaveTypeCode ?? data.LeaveTypeCode ?? data.leaveType ?? data.LeaveType
    ),
    reason:
      data.leaveReason ??
      data.LeaveReason ??
      data.Reason ??
      data.reason ??
      '',
    leaveTimeRange: (() => {
      const start = normalizeDateTime(
        data.leaveStartTime ??
          data.LeaveStartTime ??
          data.startTime ??
          data.starttime
      )
      const end = normalizeDateTime(
        data.leaveEndTime ?? data.LeaveEndTime ?? data.endTime ?? data.endtime
      )
      return start && end ? [start, end] : []
    })(),
    days: coerceDays(
      data.leaveDays ??
        data.LeaveDays ??
        data.leaveHours ??
        data.LeaveHours ??
        data.days ??
        data.Days
    ),
    agentUserNo: data.agentUserNo || ''
  })
  const [rangeStart, rangeEnd] = form.leaveTimeRange || []
  if (rangeStart && rangeEnd) {
    calculateDuration()
  }
  const attachmentList = data.attachmentList
  if (Array.isArray(attachmentList)) {
    uploadedAttachments.value = attachmentList.filter(Boolean)
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
    formRef.value.clearValidate(['leaveType'])
  }
  if (Array.isArray(data.reviewRecordList)) {
    reviewRecordList.value = [...data.reviewRecordList].sort((a, b) => {
      const ta = a.reviewDateTime ? new Date(a.reviewDateTime).getTime() : 0
      const tb = b.reviewDateTime ? new Date(b.reviewDateTime).getTime() : 0
      return ta - tb
    })
  }
  if (Array.isArray(data.rejectStepDrop)) {
    rejectStepDropOptions.value = data.rejectStepDrop
  }
}

/**
 * 规范化下拉选择值：接口返回为-1时视为未选择
 */
function normalizeSelectCode (val) {
  if (val === undefined || val === null || val === '') return undefined
  if (val === -1 || String(val) === '-1') return undefined
  return String(val)
}

function isForbiddenCode(code) {
  return String(code) === '403'
}

/** HTTP 400：request 封装将 status 写入 code，message 来自后端 */
function isBadRequestResponse (res) {
  return Number(res?.code) === 400 || String(res?.code) === '400'
}

function showResult(status, titleKey, subTitleKey) {
  resultState.variant = 'standard'
  resultState.detailMessage = ''
  resultState.visible = true
  resultState.status = status
  resultState.titleKey = titleKey
  resultState.subTitleKey = subTitleKey
}

function showBadRequestResult (message) {
  const msg = typeof message === 'string' ? message.trim() : ''
  resultState.variant = 'badRequest'
  resultState.detailMessage = msg || t('formbusiness.leaveform.badRequestFallbackMessage')
  resultState.visible = true
  resultState.status = 'warning'
  resultState.titleKey = ''
  resultState.subTitleKey = ''
}

/** 与待审批列表页约定：弹窗关闭前通知 opener 刷新列表 */
const PENDING_REVIEW_REFRESH_MSG = 'PENDING_REVIEW_REFRESH'

function notifyOpenerRefreshPendingReview () {
  try {
    if (!window.opener || window.opener.closed) return
    window.opener.postMessage({ type: PENDING_REVIEW_REFRESH_MSG }, window.location.origin)
  } catch {
    /* opener 跨域或不可用时忽略 */
  }
}

function closeCurrentPage () {
  notifyOpenerRefreshPendingReview()
  window.close()
}

/**
 * 初始化请假单（InitializeLevel）
 * 正常情况 data 为完整实体，直接 bindFormData，不再请求 GetLeaveForm。
 * 兼容旧版：若 data 仅为表单 ID（数字或字符串），则占位时间并拉取详情。
 */
async function initLeaveForm () {
  try {
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
      if (isBadRequestResponse(res)) {
        showBadRequestResult(res?.message)
      }
      return
    }
    const raw = res.data
    if (raw == null) {
      return
    }
    // InitializeLevel：data 为完整实体对象；旧版仅返回表单 ID（number / 数字字符串）
    if (typeof raw === 'object' && !Array.isArray(raw)) {
      bindFormData(raw)
      return
    }

    const newFormId = String(raw)
    form.formId = newFormId
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0)
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 18, 0, 0)
    const pad = (n) => (n < 10 ? `0${n}` : `${n}`)
    const formatDateTime = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    form.leaveTimeRange = [formatDateTime(start), formatDateTime(end)]
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
      if (isBadRequestResponse(res)) {
        showBadRequestResult(res?.message)
      } else {
        ElMessage.error(res.message)
      }
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
      if (isBadRequestResponse(res)) {
        showBadRequestResult(res?.message)
      } else {
        ElMessage.error(res.message)
      }
      return
    }
    const list = Array.isArray(res.data) ? res.data : []
    leaveTypeOptions.value = list.map(item => ({
      label: item.leaveTypeName,
      value: String(item.leaveTypeCode ?? item.leaveType ?? '')
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
      LeaveTypeCode: form.leaveType || '',
      LeaveReason: (form.reason || '').trim(),
      LeaveStartTime: startTime ? toISO(startTime) : null,
      LeaveEndTime: endTime ? toISO(endTime) : null,
      LeaveDays: coerceDays(form.days),
      LeaveHours: coerceDays(form.days),
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
          type: 'success',
          position: 'top-left'
        })
      } else if (isBadRequestResponse(res)) {
        showBadRequestResult(res?.message)
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

/**
 * 拉取完整签核流程：调用 GetFullReviewFlow，参数 formId（multipart）；签核人标识参数名为 ReviewUserId（原 UserId）
 * 数据结构：{ formId, rejectCount, stepReviewFlowList: [{ stepId, stepName, skip, stepReviewUser: [{ reviewUserId, reviewUserName, result, ... }] }] }（兼容旧 userId、userName）
 */
async function fetchFullReviewFlow () {
  const formId = String(form.formId || '')
  if (!formId) return
  workflowDrawerLoading.value = true
  try {
    const formData = new window.FormData()
    formData.append('formId', formId)
    formData.append('ReviewUserId', String(userStore.userId || ''))
    const res = await post(GET_FULL_REVIEW_FLOW_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      silentForbiddenError: false
    })
    if (isForbiddenCode(res?.code)) {
      showResult('warning', 'formbusiness.leaveform.forbiddenResultTitle', 'formbusiness.leaveform.forbiddenResultSubTitle')
      workflowDrawerVisible.value = false
      return
    }
    if (!res || res.code !== 200) {
      workflowDrawerVisible.value = false
      if (isBadRequestResponse(res)) {
        showBadRequestResult(res?.message)
      } else {
        ElMessage.error(res?.message || t('formbusiness.leaveform.workflowLoadFailed'))
      }
      return
    }
    const data = res.data || {}
    workflowOverview.formId = data.formId || ''
    workflowOverview.rejectCount = Number(data.rejectCount) || 0
    workflowOverview.stepReviewFlowList = Array.isArray(data.stepReviewFlowList) ? data.stepReviewFlowList : []
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
  fetchFullReviewFlow()
}

/**
 * 打开驳回弹窗
 */
function onReject () {
  rejectForm.rejectStepId = ''
  rejectForm.rejectReason = ''
  rejectDialogVisible.value = true
}

function onRejectDialogClose () {
  rejectFormRef.value?.clearValidate()
}

async function confirmReject () {
  const valid = await new Promise((resolve) => {
    rejectFormRef.value?.validate((v) => resolve(!!v))
  })
  if (!valid) return

  const formId = String(form.formId || '')
  if (!formId) {
    ElMessage.warning(t('formbusiness.leaveform.workflowNeedFormId'))
    return
  }

  rejecting.value = true
  try {
    const res = await post(REJECT_LEAVEFORM_API, {
      formId,
      rejectStepId: rejectForm.rejectStepId,
      comment: rejectForm.rejectReason
    }, { silentForbiddenError: false })

    if (isForbiddenCode(res?.code)) {
      showResult('warning', 'formbusiness.leaveform.forbiddenResultTitle', 'formbusiness.leaveform.forbiddenResultSubTitle')
      rejectDialogVisible.value = false
      return
    }
    if (res && isSuccessCode(res.code)) {
      rejectDialogVisible.value = false
      showResult('success', 'formbusiness.leaveform.rejectResultTitle', 'formbusiness.leaveform.rejectResultSubTitle')
      return
    }
    if (isBadRequestResponse(res)) {
      showBadRequestResult(res?.message)
      rejectDialogVisible.value = false
      return
    }
    ElNotification({ title: '', message: res?.message || t('formbusiness.leaveform.rejectFailed'), type: 'error' })
  } catch {
    ElNotification({ title: '', message: t('formbusiness.leaveform.rejectFailed'), type: 'error' })
  } finally {
    rejecting.value = false
  }
}

/**
 * 格式化签核时间显示
 */
function formatReviewDateTime (dt) {
  if (!dt) return ''
  return normalizeDateTime(dt)
}

/**
 * 根据 reviewResult 枚举值（优先）或 reviewResultName 文字返回 el-tag type
 * Approve → success, Reject/Rejected → danger, Return → warning, 其余 → info
 */
function getReviewResultTagType (row) {
  const code = String(row?.reviewResult ?? '').trim().toLowerCase()
  if (code === 'approve' || code === 'approved') return 'success'
  if (code === 'reject' || code === 'rejected') return 'danger'
  if (code === 'return') return 'warning'
  if (code) return 'info'
  // fallback：按中文名称匹配
  const name = String(row?.reviewResultName ?? '').toLowerCase()
  if (name.includes('核准') || name.includes('通过') || name.includes('同意')) return 'success'
  if (name.includes('驳回') || name.includes('拒绝')) return 'danger'
  return 'info'
}

/**
 * 送审请假单：确认弹窗期间不加载；用户点确定后再进入加载并完成送审结果展示
 */
async function onSubmitForApproval () {
  const valid = await new Promise((resolve) => {
    formRef.value?.validate((v) => resolve(!!v))
  })
  if (!valid) return
  if (shouldRequireAttachment() && uploadedAttachments.value.length === 0) {
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
  const formId = String(form.formId || '')
  if (!formId) {
    ElMessage.warning(t('formbusiness.leaveform.workflowNeedFormId'))
    return
  }
  approving.value = true
  try {
    const res = await post(APPROVE_LEAVEFORM_API, {
      formId,
      rejectStepId: '0',
      comment: approvalComment.value || ''
    }, { silentForbiddenError: false })
    if (isForbiddenCode(res?.code)) {
      showResult('warning', 'formbusiness.leaveform.forbiddenResultTitle', 'formbusiness.leaveform.forbiddenResultSubTitle')
      return
    }
    if (res && isSuccessCode(res.code)) {
      showResult('success', 'formbusiness.leaveform.approvalResultTitle', 'formbusiness.leaveform.approvalResultSubTitle')
      return
    }
    if (isBadRequestResponse(res)) {
      showBadRequestResult(res?.message)
      return
    }
    ElNotification({
      title: '',
      message: res?.message || t('formbusiness.leaveform.submitFailed'),
      type: 'error'
    })
  } catch {

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
  const current = leaveTypeOptions.value.find(item => String(item.value) === String(form.leaveType || ''))
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
    normalizeLeaveTypeText(form.leaveType),
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
      uploadedAttachments.value = [...uploadedAttachments.value, ...files]
    } else if (res && isBadRequestResponse(res)) {
      showBadRequestResult(res?.message)
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

/** FormAttachment 字段优先，兼容旧 FormFile */
function getAttachmentName (row) {
  return row?.attachmentName ?? row?.fileName ?? ''
}

function getAttachmentPath (row) {
  return row?.attachmentPath ?? row?.filePath ?? ''
}

function getAttachmentId (row) {
  return row?.attachmentId ?? row?.fileId ?? ''
}

/** 附件大小（KB），新字段 attachmentSize，旧 fileSize */
function getAttachmentSizeKb (row) {
  const v = row?.attachmentSize ?? row?.fileSize
  return v
}

/**
 * 下载文件：使用 resolveFileUrl 拼接 VITE_FILE_BROWSER_BASE_URL，触发浏览器下载
 */
function handleDownload(file) {
  const url = resolveFileUrl(getAttachmentPath(file))
  if (!url) return
  const a = document.createElement('a')
  a.href = url
  a.download = getAttachmentName(file)
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * 删除附件：调用 DELETE_FILE_API（后端 FormAttachment：attachmentId / attachmentPath）
 */
async function removeAttachment (file, idx) {
  try {
    const formData = new window.FormData()
    formData.append('attachmentId', String(getAttachmentId(file)))
    formData.append('attachmentPath', String(getAttachmentPath(file)))
    const res = await post(DELETE_FILE_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    if (res && isSuccessCode(res.code)) {
      uploadedAttachments.value.splice(idx, 1)
    } else if (isBadRequestResponse(res)) {
      showBadRequestResult(res?.message)
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
/**
 * 通过 token 换取表单信息
 * 入参：tokenValue（URL query 参数 token）
 * 出参：成功返回 formId 字符串，失败返回 null
 */
/**
 * 通过 token 换取表单信息并同步用户身份到 userStore
 * 后端同时写入 Cookie JWT + 返回用户信息；前端需将用户信息同步到 Pinia，
 * 否则 userStore.isLoggedIn = false，后续路由守卫仍会跳转登录页。
 * 出参：成功返回 formId 字符串，失败返回 null
 */
async function resolveTokenFormId (tokenValue) {
  try {
    const formData = new window.FormData()
    formData.append('tokenValue', String(tokenValue))
    const res = await post(GET_FORM_NOTIFICATION_TOKEN_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      // token 本身尚未换取会话，禁止 401/403 触发全局硬跳转登录页
      disableAutoLogout: true,
      silentAuthError: false,
      silentForbiddenError: false
    })
    if (isForbiddenCode(res?.code)) {
      showResult('warning', 'formbusiness.leaveform.forbiddenResultTitle', 'formbusiness.leaveform.forbiddenResultSubTitle')
      return null
    }
    if (!res || res.code !== 200) {
      if (isBadRequestResponse(res)) {
        showBadRequestResult(res?.message)
      } else {
        ElMessage.error(res?.message || t('formbusiness.messages.loadError'))
      }
      return null
    }
    const data = res.data || {}
    const formId = data.formId ? String(data.formId) : null
    if (!formId) return null

    // 将后端返回的用户信息写入 userStore，令 isLoggedIn = true，
    // 否则路由守卫 probeSession() 检测不到登录态，跳转其他页面仍会被打回登录页。
    // 注意：仅设 loginNo（工号），不设 userId（内部数字 ID）——
    //   userId 将在后续 probeSession() 调用 /me 时由服务端返回的真实值覆盖；
    //   若此处误将 userNo 赋给 userId，fetchFullReviewFlow 等接口会携带错误的 ID 参数。
    userStore.setUserInfo({
      userId: '',
      loginNo: data.userNo || '',
      userNameCn: data.userNameCn || '',
      userNameEn: data.userNameEn || '',
      avatar: data.avatarAddress || ''
    })

    return formId
  } catch {
    ElMessage.error(t('formbusiness.messages.loadError'))
    return null
  }
}

onMounted(async () => {
  try {
    loading.value = true

    currentFormTypeId.value = String(route.query.formTypeId || defaultFormTypeId)

    // token 场景：必须先换取身份（后端写入 Cookie JWT），再发其他任何需要鉴权的请求
    // 若先调 getLeaveTypeOptions() 等接口，此时没有 Cookie 会收到 401，
    // request.js 拦截器会直接 hardRedirectToLogin()，完全绕过 Vue Router。
    const routeToken = route.query.token || route.query.Token
    if (routeToken) {
      const tokenFormId = await resolveTokenFormId(String(routeToken))
      if (tokenFormId) {
        // Cookie 已由后端写入，后续请求均可正常鉴权
        await Promise.all([getLeaveTypeOptions()])
        form.formId = tokenFormId
        await getLeaveFormDetail(tokenFormId)
      }
      return
    }

    // 普通场景：已有 session，直接并行加载
    await Promise.all([getLeaveTypeOptions()])
    const routeFormId = route.query.formId || route.params?.formId
    if (routeFormId) {
      form.formId = String(routeFormId)
      await getLeaveFormDetail(form.formId)
    } else {
      // 新建场景：InitializeLevel 返回完整实体则只调 init；旧接口仅返回 ID 时内部会再调 GetLeaveForm
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
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
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

/* 400：主文案为 title，居中；下方为说明段落 */
.result-content--bad-request :deep(.el-result__title) {
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.6;
  color: #303133;
  word-break: break-word;
  white-space: pre-wrap;
}

.result-content--bad-request :deep(.el-result__subtitle) {
  margin-top: 14px;
}

.leaveform-bad-request-desc {
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
  font-size: 13px;
  line-height: 1.6;
  color: #909399;
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

.attachment-table {
  width: 100%;
  margin-top: 4px;
}

.form-actions-form-item {
  margin-top: 24px;
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

.workflow-view-icon {
  font-size: 18px;
}

.workflow-view-icon svg {
  width: 1em;
  height: 1em;
  display: block;
}

.leaveform-workflow-drawer :deep(.el-drawer__header) {
  padding: 10px 20px !important;
  margin: 0 !important;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.leaveform-workflow-drawer :deep(.el-drawer__title) {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
}

.leaveform-workflow-drawer :deep(.el-drawer__body) {
  padding: 10px 20px 20px !important;
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

.workflow-step-icon.is-current-step .el-icon {
  animation: workflow-step-rotate 1.4s linear infinite;
}

/* 未到步骤 / 后续流程：中性灰，与「未签核」同一视觉体系 */
.workflow-step-icon.is-pending-step {
  color: var(--el-color-info);
  background: var(--el-color-info-light-9, var(--el-fill-color-light));
}

/* skip=1：更淡的灰，与「未到/未签核」区分 */
.workflow-step-icon.is-skipped-step {
  color: var(--el-text-color-disabled);
  background: var(--el-fill-color-darker);
}

.workflow-step-block--skipped {
  border-left-color: var(--el-border-color-extra-light, var(--el-border-color-lighter));
  opacity: 0.65;
}

.workflow-step-block--skipped .workflow-step-name {
  color: var(--el-text-color-disabled);
  font-weight: 500;
}

.workflow-step-name {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.workflow-step-tag {
  margin-left: 8px;
  padding: 1px 6px;
  font-size: 11px;
  line-height: 1.4;
  border-radius: 4px;
}

.workflow-step-tag--skipped {
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-darker);
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

.workflow-user-status-icon.is-user-doing .el-icon {
  animation: workflow-step-rotate 1.4s linear infinite;
}

.workflow-user-status-icon.is-user-none {
  color: var(--el-color-info);
}

@keyframes workflow-step-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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

.workflow-user-label--approve {
  color: var(--el-color-success);
}

.workflow-user-label--underReview {
  color: var(--el-color-primary);
}

.workflow-user-label--unsigned {
  color: var(--el-color-info);
}

/* 审批记录独立卡片 */
.review-log-card {
  margin-top: 10px;
}

/* ===== 审批记录区域 ===== */
.review-log-section {
  padding: 0 20px 20px;
}

.review-log-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
}

.review-log-table {
  width: 100%;
}

.review-log-step-cell {
  font-size: 13px;
  color: var(--el-text-color-primary);
}

.review-log-user-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
}

.review-log-auto-badge {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 10px;
  line-height: 1.4;
  color: var(--el-color-info);
  background: var(--el-color-info-light-9);
  border-radius: 3px;
  padding: 0 4px;
}

.review-log-user-cell {
  font-size: 13px;
  color: var(--el-text-color-primary);
}

.review-log-sub-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
}

.review-log-original-cell {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.review-log-appointment-cell {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* ===== 驳回弹窗（modal-penetrable：半透明遮罩） ===== */
.modal-penetrable :deep(.el-overlay) {
  background-color: rgba(0, 0, 0, 0.25);
}

</style>
