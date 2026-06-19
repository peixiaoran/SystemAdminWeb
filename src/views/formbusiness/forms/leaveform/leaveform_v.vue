<template>
    <div class="leave-form-page">
      <el-config-provider :locale="elementPlusLocale">
      <!-- Skeleton 骨架屏 -->
      <template v-if="loading && !resultState.visible">
        <!-- 表单卡片骨架 -->
        <el-card class="leave-form-card" shadow="never">
          <el-skeleton animated>
            <template #template>
              <!-- 表单标题 -->
              <div style="display:flex; justify-content:center; margin-bottom:24px;">
                <el-skeleton-item variant="text" style="width:200px; height:28px;" />
              </div>
              <!-- 分割线 -->
              <el-skeleton-item variant="text" style="width:100%; height:1px; margin-bottom:24px;" />
  
              <!-- 表单号（1/3 宽） -->
              <div style="display:flex; gap:16px; margin-bottom:22px; padding:0 20px;">
                <el-skeleton-item variant="text" style="width:33%; height:32px;" />
              </div>
  
              <!-- 用户信息（3 列） -->
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
  
              <!-- 流程查询按钮 -->
              <div style="display:flex; justify-content:flex-end; align-items:center; padding:0 20px;">
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
      <el-card
        v-else-if="resultState.visible"
        class="leave-form-card result-card"
        :class="{ 'result-card--forbidden': resultState.variant === 'forbidden' }"
        shadow="never"
      >
        <div v-if="resultState.variant === 'forbidden'" class="forbidden-result">
          <div class="forbidden-result__visual" aria-hidden="true">
            <span class="forbidden-result__orbit forbidden-result__orbit--one"></span>
            <span class="forbidden-result__orbit forbidden-result__orbit--two"></span>
            <span class="forbidden-result__icon-wrap">
              <el-icon class="forbidden-result__icon"><Lock /></el-icon>
            </span>
          </div>
          <p class="forbidden-result__eyebrow">{{ t('formbusiness.leaveform.forbiddenResultEyebrow') }}</p>
          <h2 class="forbidden-result__title">{{ t('formbusiness.leaveform.forbiddenResultTitle') }}</h2>
          <p class="forbidden-result__desc">{{ t('formbusiness.leaveform.forbiddenResultSubTitle') }}</p>
          <el-button class="forbidden-result__action" type="primary" round @click="closeCurrentPage">
            {{ t('formbusiness.leaveform.backToFormPending') }}
          </el-button>
        </div>
        <el-result
          v-else
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
              {{ t('formbusiness.leaveform.backToFormPending') }}
            </el-button>
          </template>
        </el-result>
      </el-card>
  
      <template v-else>
      <el-card class="leave-form-card" shadow="never">
        <!-- 表单标题 -->
        <div class="form-title-row">
          <h2 class="form-title">{{ t('formbusiness.leaveform.formTitle') }}</h2>
        </div>
        <el-divider style="margin: 22px 0;"></el-divider>
  
          <!-- 表单主体（表格化排版） -->
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="leave-form" :validate-on-rule-change="false">
  
          <!-- 基本信息 -->
          <el-row v-if="isAnyStepFieldVisible(['FormNo', 'ApplyDate'])" :gutter="16" class="basic-info-row" style="justify-content: flex-start;">
            <el-col v-if="isStepFieldVisible('FormNo')" :span="8">
              <el-form-item :label="t('formbusiness.leaveform.formNo')" prop="formNo">
                <el-input v-model="form.formNo" disabled />
              </el-form-item>
            </el-col>
            <el-col v-if="isStepFieldVisible('ApplyDate')" :span="8">
              <el-form-item :label="t('formbusiness.leaveform.applyDate')" prop="applyDate">
                <el-date-picker
                  v-model="form.applyDate"
                  type="date"
                  value-format="YYYY-MM-DD"
                  :placeholder="t('formbusiness.leaveform.pleaseSelectApplyDate')"
                  clearable
                  disabled
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
          </el-row>
  
          <!-- 申请人信息 -->
          <el-row
            v-if="isAnyStepFieldVisible(['UserNo', 'UserName', 'Department'])"
            :gutter="16"
            align="middle"
            class="basic-info-row"
          >
            <el-col v-if="isStepFieldVisible('UserNo')" :span="8">
              <el-form-item :label="t('formbusiness.leaveform.applicantUserNo')" prop="applicantUserNo">
                <el-input v-model="form.applicantUserNo" disabled />
              </el-form-item>
            </el-col>
            <el-col v-if="isStepFieldVisible('UserName')" :span="8">
              <el-form-item :label="t('formbusiness.leaveform.applicantUserName')" prop="applicantUserName">
                <el-input v-model="form.applicantUserName" disabled />
              </el-form-item>
            </el-col>
            <el-col v-if="isStepFieldVisible('Department')" :span="8">
              <el-form-item :label="t('formbusiness.leaveform.applicantDeptName')" prop="applicantDeptName">
                <el-input v-model="form.applicantDeptName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
  
          <el-divider v-if="isAnyStepFieldVisible(['FormNo', 'ApplyDate', 'UserNo', 'UserName', 'Department'])"></el-divider>
  
          <!-- 请假信息 -->
          <el-row
            v-if="isAnyStepFieldVisible(['LeaveType', 'LeavePeriod'])"
            :gutter="16"
            style="justify-content: flex-start;"
          >
            <el-col v-if="isStepFieldVisible('LeaveType')" :span="8">
              <el-form-item :label="t('formbusiness.leaveform.leaveType')" prop="leaveType">
                <el-select v-model="form.leaveType" :placeholder="t('formbusiness.leaveform.pleaseSelectLeaveType')" clearable disabled @change="onSelectChange('leaveType')">
                  <el-option v-for="type in leaveTypeOptions" :key="type.value" :label="type.label" :value="type.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="isStepFieldVisible('LeavePeriod')" :span="16">
              <el-form-item :label="t('formbusiness.leaveform.leaveTimeRange')" prop="leaveTimeRange">
                <el-date-picker
                  v-model="form.leaveTimeRange"
                  type="datetimerange"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :start-placeholder="t('formbusiness.leaveform.pleaseSelectStartTime')"
                  :end-placeholder="t('formbusiness.leaveform.pleaseSelectEndTime')"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
  
          <!-- 时长 / 代理人 -->
          <el-row v-if="isAnyStepFieldVisible(['Agent', 'SelectAgent', 'LeaveHours', 'LeaveDays'])" :gutter="16">
            <el-col v-if="isAnyStepFieldVisible(['Agent', 'SelectAgent'])" :span="8">
              <el-form-item :label="t('formbusiness.leaveform.agentUserNo')" prop="agentUserId">
                <el-input
                  class="agent-field-input"
                  :model-value="agentDisplayText"
                  :placeholder="t('formbusiness.leaveform.pleaseSelectAgent')"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col v-if="isAnyStepFieldVisible(['LeaveHours', 'LeaveDays'])" :span="16">
              <el-form-item :label="t('formbusiness.leaveform.leaveHours')" prop="days">
                <el-input-number
                  v-model="form.days"
                  class="leave-hours-input"
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
          <el-row v-if="isStepFieldVisible('LeaveReason')" :gutter="16">
            <el-col :span="24">
              <el-form-item :label="t('formbusiness.leaveform.leaveReason')" prop="reason">
                <el-input v-model="form.reason" type="textarea" :rows="3" :placeholder="t('formbusiness.leaveform.pleaseInputLeaveReason')" disabled />
              </el-form-item>
            </el-col>
          </el-row>
  
          <!-- 附件 -->
          <el-row v-if="isStepFieldVisible('Upload')" :gutter="16">
            <el-col :span="24">
              <el-form-item :label="t('formbusiness.leaveform.attachments')">
                <div class="upload-section">
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
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
  
          <el-row :gutter="16" class="approval-comment-row">
            <el-col :span="24">
              <el-form-item :label="t('formbusiness.leaveform.approvalComment')">
                <el-input
                  v-model="approvalComment"
                  type="textarea"
                  :rows="3"
                  :placeholder="t('formbusiness.leaveform.approvalCommentPlaceholder')"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
  
          <el-row :gutter="16">
            <el-col :span="24">
              <el-form-item class="form-actions-form-item">
                <div class="form-actions-row">
                  <div class="workflow-view-entry">
                    <div class="workflow-view-hint">
                      <el-icon class="workflow-view-hint-icon"><QuestionFilled /></el-icon>
                      <span class="workflow-view-hint-text">{{ t('formbusiness.leaveform.viewFullWorkflowHint') }}</span>
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
                        <el-icon class="workflow-view-icon"><Rank /></el-icon>
                      </el-button>
                    </el-tooltip>
                  </div>
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
            :row-class-name="reviewLogRowClassName"
            :max-height="420"
            size="small"
            class="review-log-table"
          >
            <el-table-column type="index" label="#" width="46" align="center" class-name="review-log-index-col" />
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
              width="160"
              align="left"
            >
              <template #default="{ row }">
                <div class="review-log-user-wrap">
                  <div class="review-log-user-main">
                    <span class="review-log-user-cell">{{ row.originalUserName || row.operationUserName }}</span>
                    <span
                      v-if="row.reviewType && row.reviewType.toLowerCase() === 'automatic'"
                      class="review-log-auto-badge"
                    >{{ row.reviewTypeName }}</span>
                  </div>
                  <div
                    v-if="(row.operationUserName && row.originalUserName && row.operationUserName !== row.originalUserName) || (row.appointmentType && row.appointmentType.toLowerCase() !== 'actual')"
                    class="review-log-sub-row"
                  >
                    <span v-if="row.operationUserName && row.originalUserName && row.operationUserName !== row.originalUserName" class="review-log-original-cell">{{ row.operationUserName }}</span>
                    <span v-if="row.appointmentType && row.appointmentType.toLowerCase() !== 'actual'" class="review-log-appointment-cell">{{ row.appointmentTypeName }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('formbusiness.leaveform.reviewLogResult')"
              width="95"
              align="left"
            >
              <template #default="{ row }">
                <div class="review-log-result-cell">
                  <el-tag
                    :type="getReviewResultTagType(row)"
                    :class="{ 'review-log-tag--withdraw': isReviewWithdrawResult(row) }"
                    size="small"
                  >
                    {{ row.reviewResultName }}
                  </el-tag>
                  <span
                    v-if="isReviewRejectResult(row) && getReviewRejectStepName(row)"
                    class="review-log-reject-step"
                  >（{{ t('formbusiness.leaveform.reviewLogRejectToStep', { step: getReviewRejectStepName(row) }) }}）</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('formbusiness.leaveform.reviewLogComment')"
              min-width="200"
            >
              <template #default="{ row }">
                <div class="review-log-comment-cell">{{ row.comment }}</div>
              </template>
            </el-table-column>
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

      <!-- 假期余额：右侧悬浮（LeaveBalance 权限控制，查看页只读展示） -->
      <aside
        v-if="isStepFieldVisible('LeaveBalance') && (leaveBalanceLoading || leaveBalances.length)"
        class="leave-balance-float"
        :aria-label="t('formbusiness.leaveform.leaveBalance') + t('formbusiness.leaveform.leaveBalanceDaysUnit')"
      >
        <div
          class="leave-balance-float-card"
          v-loading="leaveBalanceLoading"
          element-loading-text=""
        >
          <div class="leave-balance-float-header">
            <span class="leave-balance-float-title">
              {{ t('formbusiness.leaveform.leaveBalance') }}<span class="leave-balance-days-unit">{{ t('formbusiness.leaveform.leaveBalanceDaysUnit') }}</span>
            </span>
            <p class="leave-balance-float-note">{{ t('formbusiness.leaveform.leaveBalanceNote') }}</p>
          </div>
          <div class="leave-balance-hint">
            <div
              v-for="item in leaveBalances"
              :key="item.year"
              class="leave-balance-hint-item"
            >
              <div class="leave-balance-year">{{ item.year }}</div>
              <div class="leave-balance-type-row">
                <span class="leave-balance-type-name">{{ t('formbusiness.leaveform.annualRemainingDays') }}</span>
                <span
                  :class="['leave-balance-days-col', 'leave-balance-days', { 'leave-balance-days--exceeded': isLeaveBalanceExceeded(item, 'annual') }]"
                >{{ formatLeaveBalanceDays(getAdjustedLeaveBalanceDays(item, 'annual')) }}</span>
                <span class="leave-balance-deduct-col">
                  <span
                    v-if="getLeaveBalanceDeductDays(item, 'annual') > 0"
                    class="leave-balance-deduct-inline"
                  >（{{ formatLeaveBalanceDeductDays(getLeaveBalanceDeductDays(item, 'annual')) }}）</span>
                </span>
              </div>
              <div class="leave-balance-type-row">
                <span class="leave-balance-type-name">{{ t('formbusiness.leaveform.sickRemainingDays') }}</span>
                <span
                  :class="['leave-balance-days-col', 'leave-balance-days', { 'leave-balance-days--exceeded': isLeaveBalanceExceeded(item, 'sick') }]"
                >{{ formatLeaveBalanceDays(getAdjustedLeaveBalanceDays(item, 'sick')) }}</span>
                <span class="leave-balance-deduct-col">
                  <span
                    v-if="getLeaveBalanceDeductDays(item, 'sick') > 0"
                    class="leave-balance-deduct-inline"
                  >（{{ formatLeaveBalanceDeductDays(getLeaveBalanceDeductDays(item, 'sick')) }}）</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
      </template>
  
      <el-drawer
        v-model="workflowDrawerVisible"
        :title="t('formbusiness.leaveform.workflowDrawerTitle')"
        direction="rtl"
        size="420px"
        destroy-on-close
        class="leaveform-workflow-drawer"
      >
        <div v-loading="workflowDrawerLoading" class="workflow-drawer-body">
          <template v-if="!workflowDrawerLoading && workflowOverview.stepReviewList?.length">
            <div
              v-for="(step, stepIdx) in workflowOverview.stepReviewList"
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
      </el-config-provider>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, computed, onMounted } from 'vue'
  import i18n from '@/i18n'
  import { ElMessage } from 'element-plus'
  import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
  import en from 'element-plus/dist/locale/en.mjs'
  import { Upload, Document, Download, Delete, Clock, CircleCheck, RemoveFilled, Loading, QuestionFilled, Lock, Rank } from '@element-plus/icons-vue'
  import { post } from '@/utils/request'
  import { INIT_LEAVEFORM_API, GET_LEAVEFORM_DETAIL_API, GET_LEAVEFORM_DROPDOWN_API, GET_LEAVE_BALANCES_API, UPLOAD_FILE_API, GET_FULL_REVIEW_FLOW_API, GET_FORM_NOTIFICATION_TOKEN_API } from '@/config/api/formbusiness/forms/leaveform'
  import { MODULE_API } from '@/config/api/modulemenu/menu'
  import { calculateLeaveHoursForYear } from '@/utils/leaveHours'
import { resolveFileUrl } from '@/utils/fileUrl'
  import { useRoute, useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  import { usePMenuStore } from '@/stores/pmenu'
  import { normalizeRouteLang, persistRouteLanguage } from '@/utils/routeLanguage'
  import { getLocationQueryParam } from '@/utils/hashRouteBootstrap'
  
  const { t, locale } = i18n.global
  
  const elementPlusLocale = computed(() => (locale.value === 'en-US' ? en : zhCn))
  
  const formRef = ref(null)
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  const pmenuStore = usePMenuStore()
  
  const loading = ref(true)
  const workflowDrawerVisible = ref(false)
  const workflowDrawerLoading = ref(false)
  const workflowOverview = reactive({
    formId: '',
    rejectCount: 0,
    stepReviewList: []
  })
  
  /** skip=1 时整步置灰 */
  function isWorkflowStepSkipped (step) {
    return Number(step?.skip) === 1
  }
  
  function normalizeReviewResult (result) {
    const v = String(result ?? '').trim().toLowerCase()
    if (v === 'approve' || v === 'approved') return 'approve'
    if (v === 'underreview' || v === 'under_review' || v === 'reviewing') return 'underReview'
    return 'unsigned'
  }
  
  /** 步骤头状态：skip / done / current / pending */
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
  
  function workflowUserShowAppointmentTypeName (u) {
    if (!u?.appointmentTypeName) return false
    const code = String(
      u?.appointmentType ?? u?.AppointmentType ?? u?.appointmentTypeCode ?? u?.AppointmentTypeCode ?? ''
    ).trim()
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
  const approvalComment = ref('')
  
  const reviewRecordList = ref([])
  const stepFieldPermissionMap = ref({})
  /** 相邻相同 stepId 分组（避免排序后跨段误合并） */
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
  
  /** 序号列按 stepId 分组合并 */
  function reviewLogSpanMethod ({ columnIndex, rowIndex }) {
    if (columnIndex === 0) {
      const row = reviewLogTableRows.value[rowIndex]
      if (!row) return { rowspan: 1, colspan: 1 }
      return row._rowSpan > 0
        ? { rowspan: row._rowSpan, colspan: 1 }
        : { rowspan: 0, colspan: 0 }
    }
  }
  
  const uploading = ref(false)
  const uploadedAttachments = ref([])

  const leaveBalances = ref([])
  const leaveBalanceLoading = ref(false)
  let leaveBalanceRequestId = 0
  
  const defaultFormTypeId = '1987217256446300160'
  const currentFormTypeId = ref('')
  
  const form = reactive({
    formId: '',
    formNo: '',
    formStatus: '',
    formStatusName: '',
    applyDate: '',
    applicantUserNo: '',
    applicantUserName: '',
    applicantDeptName: '',
    applicantDeptId: '',
    leaveType: '',
    reason: '',
    leaveTimeRange: [],
    days: 0,
    agentUserId: '',
    agentUserNo: '',
    agentUserName: ''
  })

  function buildAgentDisplayValue (agentUserNo, agentUserName) {
    const parts = []
    const no = normalizeNullableText(agentUserNo)
    const name = normalizeNullableText(agentUserName)
    if (no) parts.push(no)
    if (name) parts.push(name)
    return parts.join(' / ')
  }

  function parseAgentDisplayValue (displayValue) {
    const text = normalizeNullableText(displayValue)
    if (!text) {
      return { agentUserNo: '', agentUserName: '' }
    }
    const separatorIndex = text.indexOf(' / ')
    if (separatorIndex === -1) {
      return { agentUserNo: '', agentUserName: text }
    }
    return {
      agentUserNo: text.slice(0, separatorIndex).trim(),
      agentUserName: text.slice(separatorIndex + 3).trim()
    }
  }

  const agentDisplayText = computed(() => buildAgentDisplayValue(form.agentUserNo, form.agentUserName))

  const leaveTypeOptions = ref([])
  const rules = {
    leaveType: [
      { required: true, message: t('formbusiness.validation.required'), trigger: 'change' }
    ],
    leaveTimeRange: [
      { required: true, message: t('formbusiness.validation.required'), trigger: 'change' },
      { validator: validateTimeRange, trigger: 'change' }
    ],
    reason: [
      { required: true, message: t('formbusiness.validation.required'), trigger: 'blur' }
    ]
  }

  function coerceDays (v) {
    if (v === undefined || v === null || v === '') return 0
    const n = Number(v)
    if (!Number.isFinite(n)) return 0
    return parseFloat(Math.max(0, n).toFixed(2))
  }

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
  
  function onSelectChange (field) {
    if (!formRef.value) return
    try {
      formRef.value.validateField(field)
    } catch (e) {
      // ignore
    }
  }

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
  
  function toISO (str) {
    return typeof str === 'string' ? str.replace(' ', 'T') : str
  }

  function bindFormData (data) {
    Object.assign(form, {
      formTypeId: data.formTypeId || '',
      formId: data.formId || '',
      formNo: data.formNo || '',
      formStatus: data.formStatus ?? data.FormStatus ?? data.formStatusCode ?? data.FormStatusCode ?? '',
      formStatusName: data.formStatusName ?? data.FormStatusName ?? '',
      applyDate: resolveApplyDateFromData(data),
      applicantUserNo: data.applicantUserNo || '',
      applicantUserName: data.applicantUserName || '',
      applicantDeptName: data.applicantDeptName || '',
      applicantDeptId: data.applicantDeptId || '',
      leaveType: resolveLeaveTypeFromData(data),
      reason:
        data.leaveReason ??
        data.LeaveReason ??
        data.Reason ??
        data.reason ??
        '',
      leaveTimeRange: resolveLeaveTimeRangeFromData(data),
      days: resolveLeaveHoursFromData(data),
      ...resolveAgentFromData(data)
    })
    const attachmentList = data.attachment ?? data.attachmentList ?? data.Attachment
    if (Array.isArray(attachmentList)) {
      uploadedAttachments.value = attachmentList.filter(Boolean)
    }
    if (data && data.formTypeId) {
      currentFormTypeId.value = String(data.formTypeId)
    }
    if (form.formId) {
      const nextQuery = {
        ...route.query,
        formId: String(form.formId),
        formTypeId: String(currentFormTypeId.value || route.query.formTypeId || defaultFormTypeId)
      }
      router.replace({ path: route.path, query: nextQuery })
    }
    if (formRef.value) {
      formRef.value.clearValidate(['leaveType'])
    }
    const reviewRecords = data.reviewRecord ?? data.reviewRecordList ?? data.ReviewRecord
    if (Array.isArray(reviewRecords)) {
      reviewRecordList.value = [...reviewRecords].sort((a, b) => {
        const ta = a.reviewDateTime ? new Date(a.reviewDateTime).getTime() : 0
        const tb = b.reviewDateTime ? new Date(b.reviewDateTime).getTime() : 0
        return ta - tb
      })
    }
    applyStepFieldPermissions(
      data.stepFieldPermission ??
        data.stepFieldPermissionList ??
        data.StepFieldPermissionList ??
        data.StepFieldPermission
    )
    fetchLeaveBalances()
  }

  function normalizeFieldKey (fieldKey) {
    return String(fieldKey ?? '').replace(/\s+/g, '')
  }

  function normalizePermissionFlag (val, defaultValue = true) {
    if (val === undefined || val === null || val === '') return defaultValue
    return Number(val) === 1
  }

  function applyStepFieldPermissions (list) {
    const map = {}
    if (Array.isArray(list)) {
      for (const item of list) {
        const fieldKey = item?.fieldKey ?? item?.FieldKey
        if (!fieldKey) continue
        const disabledRaw = item.isDisabled ?? item.IsDisabled
        const isEditable = (disabledRaw !== undefined && disabledRaw !== null && disabledRaw !== '')
          ? Number(disabledRaw) !== 1
          : normalizePermissionFlag(item.isEditable ?? item.IsEditable, true)
        map[normalizeFieldKey(fieldKey)] = {
          isVisible: normalizePermissionFlag(item.isVisible ?? item.IsVisible, true),
          isEditable
        }
      }
    }
    stepFieldPermissionMap.value = map
  }

  function resolveStepFieldPermission (fieldKey) {
    const key = normalizeFieldKey(fieldKey)
    const map = stepFieldPermissionMap.value
    if (map[key]) return map[key]
    if (key === 'LeaveHours' && map.LeaveDays) return map.LeaveDays
    if (key === 'LeaveDays' && map.LeaveHours) return map.LeaveHours
    if (key === 'SelectAgent' && map.Agent) return map.Agent
    if (key === 'Agent' && map.SelectAgent) return map.SelectAgent
    if (key === 'AttachmentTable' && map.Upload) return map.Upload
    return null
  }

  function isStepFieldVisible (fieldKey) {
    const perm = resolveStepFieldPermission(fieldKey)
    if (!perm) return true
    return perm.isVisible
  }

  function isStepFieldEditable () {
    return false
  }

  function isAnyStepFieldVisible (fieldKeys) {
    return fieldKeys.some(key => isStepFieldVisible(key))
  }

  function resolveLeaveBalanceYears (leaveTimeRange) {
    const [startTime, endTime] = Array.isArray(leaveTimeRange) ? leaveTimeRange : []
    const startDate = startTime ? new Date(toISO(startTime)) : null
    const endDate = endTime ? new Date(toISO(endTime)) : null
    const startValid = startDate && !Number.isNaN(startDate.getTime())
    const endValid = endDate && !Number.isNaN(endDate.getTime())

    if (startValid && endValid) {
      const startYear = startDate.getFullYear()
      const endYear = endDate.getFullYear()
      const fromYear = Math.min(startYear, endYear)
      const toYear = Math.max(startYear, endYear)
      const years = []
      for (let year = fromYear; year <= toYear; year += 1) {
        years.push(year)
      }
      return years
    }
    if (startValid) return [startDate.getFullYear()]
    if (endValid) return [endDate.getFullYear()]
    return [new Date().getFullYear()]
  }

  function formatLeaveBalanceDays (val) {
    if (val === undefined || val === null || val === '') return '-'
    const n = Number(val)
    return Number.isFinite(n) ? formatLeaveBalanceNumber(n) : '-'
  }

  function formatLeaveBalanceNumber (val) {
    if (!Number.isFinite(val)) return '-'
    return Number(val).toFixed(2)
  }

  function formatLeaveBalanceDeductDays (val) {
    const n = Number(val)
    if (!Number.isFinite(n) || n <= 0) return ''
    return `-${n.toFixed(2)}`
  }

  function getLeaveBalanceRawDays (item, type) {
    return type === 'annual' ? item?.annualRemainingDays : item?.sickRemainingDays
  }

  function getAdjustedLeaveBalanceDays (item, type) {
    const rawDays = Number(getLeaveBalanceRawDays(item, type))
    if (!Number.isFinite(rawDays)) return getLeaveBalanceRawDays(item, type)
    if (!isLeaveBalanceAffected(item?.year, type)) return rawDays
    const remainingHours = rawDays * 8 - getSelectedLeaveHoursByYear(item.year)
    return remainingHours / 8
  }

  function isLeaveBalanceAffected (year, type) {
    return resolveSelectedLeaveBalanceType() === type && getSelectedLeaveHoursByYear(year) > 0
  }

  function getLeaveBalanceDeductDays (item, type) {
    if (!isLeaveBalanceAffected(item?.year, type)) return 0
    const hours = getSelectedLeaveHoursByYear(item.year)
    return hours > 0 ? hours / 8 : 0
  }

  function isLeaveBalanceExceeded (item, type) {
    const adjustedDays = Number(getAdjustedLeaveBalanceDays(item, type))
    if (Number.isFinite(adjustedDays) && adjustedDays < 0) return true

    if (resolveSelectedLeaveBalanceType() !== type) return false
    const rawDays = Number(getLeaveBalanceRawDays(item, type))
    if (!Number.isFinite(rawDays)) return false
    const selectedHours = getSelectedLeaveHoursByYear(item.year)
    return selectedHours > 0 && selectedHours > rawDays * 8
  }

  function resolveSelectedLeaveBalanceType () {
    const current = getCurrentLeaveTypeOption()
    const candidates = [
      normalizeLeaveTypeText(form.leaveType),
      normalizeLeaveTypeText(current?.label),
      normalizeLeaveTypeText(current?.value)
    ].filter(Boolean)
    if (candidates.some((text) =>
      text.includes('annual') ||
      text.includes('yearleave') ||
      text.includes('annualleave') ||
      text.includes('年假') ||
      text.includes('年休')
    )) return 'annual'
    if (candidates.some((text) => text.includes('sick') || text.includes('病假'))) return 'sick'
    return ''
  }

  function getSelectedLeaveHoursByYear (year) {
    const [startTime, endTime] = Array.isArray(form.leaveTimeRange) ? form.leaveTimeRange : []
    if (!startTime || !endTime) return 0
    return calculateLeaveHoursForYear(year, startTime, endTime)
  }

  function normalizeLeaveBalanceItem (item) {
    return {
      year: Number(item?.year ?? item?.Year ?? 0),
      annualRemainingDays: item?.annualRemainingDays ?? item?.AnnualRemainingDays,
      sickRemainingDays: item?.sickRemainingDays ?? item?.SickRemainingDays
    }
  }

  async function fetchLeaveBalances () {
    if (!isStepFieldVisible('LeaveBalance')) return

    const formId = String(form.formId || '')
    if (!formId) {
      leaveBalances.value = []
      return
    }

    const years = resolveLeaveBalanceYears(form.leaveTimeRange)
    const requestId = ++leaveBalanceRequestId
    leaveBalanceLoading.value = true
    try {
      const formData = new window.FormData()
      formData.append('formId', formId)
      formData.append('years', years.join(','))
      const res = await post(GET_LEAVE_BALANCES_API, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        silentForbiddenError: false
      })
      if (requestId !== leaveBalanceRequestId) return
      if (isForbiddenCode(res?.code)) {
        showForbiddenResult()
        leaveBalances.value = []
        return
      }
      if (!res || res.code !== 200) {
        leaveBalances.value = []
        if (isBadRequestResponse(res)) {
          showBadRequestResult(res?.message)
        } else if (res?.message) {
          ElMessage.error(res.message)
        }
        return
      }
      const list = Array.isArray(res.data) ? res.data : []
      leaveBalances.value = list
        .map(normalizeLeaveBalanceItem)
        .filter((item) => item.year)
        .sort((a, b) => a.year - b.year)
    } catch {
      if (requestId !== leaveBalanceRequestId) return
      leaveBalances.value = []
      ElMessage.error(t('formbusiness.leaveform.getLeaveBalanceFailed'))
    } finally {
      if (requestId === leaveBalanceRequestId) {
        leaveBalanceLoading.value = false
      }
    }
  }
  
  function normalizeSelectCode (val) {
    if (val === undefined || val === null || val === '') return undefined
    if (val === -1 || String(val) === '-1') return undefined
    return String(val)
  }

  function normalizeNullableText (val) {
    if (val === undefined || val === null) return ''
    return String(val)
  }

  function normalizeLeaveHoursValue (val) {
    if (val === undefined || val === null || val === '') return undefined
    const n = Number(val)
    if (!Number.isFinite(n)) return undefined
    return parseFloat(Math.max(0, n).toFixed(2))
  }

  function resolveLeaveTypeFromData (data) {
    return normalizeSelectCode(
      data.leaveType ??
        data.LeaveType ??
        data.leaveTypeCode ??
        data.LeaveTypeCode ??
        data.leaveTypeId ??
        data.LeaveTypeId ??
        null
    ) ?? ''
  }

  function resolveLeaveTimeRangeFromData (data) {
    const start = normalizeDateTime(
      data.startDateTime ??
        data.StartDateTime ??
        data.leaveStartTime ??
        data.LeaveStartTime ??
        data.startTime ??
        data.starttime ??
        null
    )
    const end = normalizeDateTime(
      data.endDateTime ??
        data.EndDateTime ??
        data.leaveEndTime ??
        data.LeaveEndTime ??
        data.endTime ??
        data.endtime ??
        null
    )
    if (!start || !end) return []
    return [start, end]
  }

  function resolveLeaveHoursFromData (data) {
    return normalizeLeaveHoursValue(
      data.leaveHours ??
        data.LeaveHours ??
        data.leaveDays ??
        data.LeaveDays ??
        data.days ??
        data.Days ??
        null
    )
  }

  function resolveApplyDateFromData (data) {
    const raw = data.applyDate ?? data.ApplyDate ?? data.applicantDate ?? data.ApplicantDate ?? data.applicantTime ?? data.ApplicantTime ?? ''
    if (!raw) return ''
    const text = String(raw).trim()
    if (text.length >= 10) return text.slice(0, 10)
    const d = new Date(text)
    if (isNaN(d.getTime())) return text
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }

  function resolveAgentFromData (data) {
    const agentUserId = normalizeNullableText(data.agentUserId ?? data.AgentUserId)
    let agentUserNo = normalizeNullableText(data.agentUserNo ?? data.AgentUserNo)
    let agentUserName = normalizeNullableText(data.agentUserName ?? data.AgentUserName)

    if (!agentUserNo && agentUserName.includes(' / ')) {
      const parsed = parseAgentDisplayValue(agentUserName)
      agentUserNo = parsed.agentUserNo
      agentUserName = parsed.agentUserName
    }

    return {
      agentUserId,
      agentUserNo,
      agentUserName
    }
  }
  
  function isForbiddenCode(code) {
    return String(code) === '403'
  }
  
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

  function showForbiddenResult () {
    resultState.variant = 'forbidden'
    resultState.detailMessage = ''
    resultState.visible = true
    resultState.status = 'warning'
    resultState.titleKey = 'formbusiness.leaveform.forbiddenResultTitle'
    resultState.subTitleKey = 'formbusiness.leaveform.forbiddenResultSubTitle'
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
  
  const FORM_PENDING_REFRESH_MSG = 'FORM_PENDING_REFRESH'

  function notifyOpenerRefreshFormPending () {
    try {
      if (!window.opener || window.opener.closed) return
      window.opener.postMessage({ type: FORM_PENDING_REFRESH_MSG }, window.location.origin)
    } catch {
      /* opener 跨域或不可用时忽略 */
    }
  }
  
  const FORM_PENDING_ROUTE_PATH = '/formbusiness/form-operate/formpending'
  const FORMBUSINESS_MODULE_PATH = 'formbusiness'

  function isPopupWindow () {
    try {
      return !!(window.opener && !window.opener.closed)
    } catch {
      return !!window.opener
    }
  }
  
  async function ensureFormbusinessModuleSelected () {
    if (
      pmenuStore.currentModuleId &&
      pmenuStore.currentModulePath === FORMBUSINESS_MODULE_PATH
    ) {
      return true
    }
    try {
      const res = await post(MODULE_API.GET_MODULES)
      if (!res || res.code !== 200) return false
      const list = Array.isArray(res.data) ? res.data : []
      const matched = list.find((m) => {
        const seg = String(m?.path || '').split('/').filter(Boolean)[0]
        return seg === FORMBUSINESS_MODULE_PATH
      })
      if (!matched) return false
      const nameCn =
        matched.moduleNameCn ||
        matched.ModuleNameCn ||
        matched.moduleNameCh ||
        matched.ModuleNameCh ||
        matched.moduleName ||
        matched.ModuleName ||
        ''
      const nameEn =
        matched.moduleNameEn ||
        matched.ModuleNameEn ||
        matched.moduleName ||
        matched.ModuleName ||
        ''
      pmenuStore.setCurrentPMenu(
        String(matched.moduleId || ''),
        nameCn || nameEn || FORMBUSINESS_MODULE_PATH,
        FORMBUSINESS_MODULE_PATH,
        nameCn,
        nameEn
      )
      return !!matched.moduleId
    } catch {
      return false
    }
  }
  
  async function closeCurrentPage () {
    if (isPopupWindow()) {
      notifyOpenerRefreshFormPending()
      window.close()
      return
    }
    const ok = await ensureFormbusinessModuleSelected()
    if (ok) {
      router.push(FORM_PENDING_ROUTE_PATH)
    } else {
      router.push('/module-select')
    }
  }
  
  /** InitLeaveForm：返回完整实体则直接 bind，旧版仅返回 formId 时再拉详情 */
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
        showForbiddenResult()
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
  
  async function getLeaveFormDetail (id) {
    try {
      const formData = new window.FormData()
      formData.append('formId', String(id))
      formData.append('type', 'View')
      const res = await post(GET_LEAVEFORM_DETAIL_API, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        silentForbiddenError: false
      })
      if (!res) return
      if (isForbiddenCode(res.code)) {
        showForbiddenResult()
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
        label: item.leaveTypeName ?? item.LeaveTypeName ?? '',
        value: String(
          item.leaveTypeCode ??
            item.LeaveTypeCode ??
            item.leaveTypeId ??
            item.LeaveTypeId ??
            item.leaveType ??
            item.LeaveType ??
            ''
        )
      }))
    } catch {
  
    }
  }
  
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
        showForbiddenResult()
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
      workflowOverview.stepReviewList = Array.isArray(data.stepReviewList)
        ? data.stepReviewList
        : (Array.isArray(data.stepReviewFlowList) ? data.stepReviewFlowList : [])
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
  
  function isReviewWithdrawResult (row) {
    const code = String(row?.reviewResult ?? '').trim().toLowerCase()
    if (code === 'withdraw' || code === 'withdrawn') return true
    const name = String(row?.reviewResultName ?? '').trim().toLowerCase()
    return name === 'withdraw' || name === 'withdrawn' || name === '撤回'
  }

  function reviewLogRowClassName ({ row }) {
    return isReviewWithdrawResult(row) ? 'review-log-row--withdraw' : ''
  }

  function isReviewRejectResult (row) {
    const code = String(row?.reviewResult ?? '').trim().toLowerCase()
    if (code === 'reject' || code === 'rejected') return true
    const name = String(row?.reviewResultName ?? '').trim().toLowerCase()
    return name === '驳回' || name === 'reject' || name === 'rejected'
  }
  
  function getReviewRejectStepName (row) {
    const v = row?.rejectStepName ?? row?.RejectStepName
    if (v == null || v === '') return ''
    return String(v)
  }
  
  function formatReviewDateTime (dt) {
    if (!dt) return ''
    return normalizeDateTime(dt)
  }
  
  function getReviewResultTagType (row) {
    const code = String(row?.reviewResult ?? '').trim().toLowerCase()
    if (code === 'approve' || code === 'approved') return 'success'
    if (code === 'reject' || code === 'rejected') return 'danger'
    if (code === 'return') return 'warning'
    if (code === 'withdraw' || code === 'withdrawn') return 'info'
    const name = String(row?.reviewResultName ?? '').trim().toLowerCase()
    if (name === '通过' || name === 'approve' || name === 'approved') return 'success'
    if (name === '驳回' || name === 'reject' || name === 'rejected') return 'danger'
    if (name === '退回' || name === 'return') return 'warning'
    if (name === 'withdraw' || name === 'withdrawn' || name === '撤回') return 'info'
    return 'info'
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
  
  function formatFileSize(sizeKB) {
    if (!sizeKB && sizeKB !== 0) return '-'
    const size = Number(sizeKB)
    if (size < 1024) return `${size} KB`
    return `${(size / 1024).toFixed(2)} MB`
  }
  
  function getAttachmentName (row) {
    return row?.attachmentName ?? row?.fileName ?? ''
  }
  
  function getAttachmentPath (row) {
    return row?.attachmentPath ?? row?.filePath ?? ''
  }
  
  function getAttachmentId (row) {
    return row?.attachmentId ?? row?.fileId ?? ''
  }
  
  function getAttachmentSizeKb (row) {
    const v = row?.attachmentSize ?? row?.fileSize
    return v
  }
  
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
  
  function removeAttachment () {}
  
  async function syncRouteLanguage () {
    const lang = persistRouteLanguage(
      normalizeRouteLang(route.query.lang ?? route.query.Lang ?? getLocationQueryParam('lang', 'Lang'))
    )
    if (!lang) return
    if (locale.value !== lang) locale.value = lang
  
    if (route.query.lang != null || route.query.Lang != null) {
      const restQuery = { ...route.query }
      delete restQuery.lang
      delete restQuery.Lang
      try {
        await router.replace({ path: route.path, query: restQuery })
      } catch {
        /* 重复/取消导航忽略 */
      }
    }
  }
  
  async function resolveTokenFormId (tokenValue) {
    try {
      const formData = new window.FormData()
      formData.append('tokenValue', String(tokenValue))
      const res = await post(GET_FORM_NOTIFICATION_TOKEN_API, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        disableAutoLogout: true,
        silentAuthError: false,
        silentForbiddenError: false
      })
      if (isForbiddenCode(res?.code)) {
        showForbiddenResult()
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
      return data.formId ? String(data.formId) : null
    } catch {
      ElMessage.error(t('formbusiness.messages.loadError'))
      return null
    }
  }
  
  onMounted(async () => {
    try {
      await syncRouteLanguage()
      loading.value = true
  
      currentFormTypeId.value = String(route.query.formTypeId || defaultFormTypeId)
  
      const routeToken = route.query.token || route.query.Token || getLocationQueryParam('token', 'Token')
      if (routeToken) {
        const tokenFormId = await resolveTokenFormId(String(routeToken))
        if (tokenFormId) {
          await Promise.all([getLeaveTypeOptions()])
          form.formId = tokenFormId
          await getLeaveFormDetail(tokenFormId)
        }
        return
      }

      await Promise.all([getLeaveTypeOptions()])
      const routeFormId = route.query.formId || route.params?.formId
      if (routeFormId) {
        form.formId = String(routeFormId)
        await getLeaveFormDetail(form.formId)
      } else {
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

  .basic-info-row .el-form-item {
    margin-bottom: 0;
  }
  
  .approval-comment-row {
    margin-top: -6px;
  }
  
  .approval-comment-row .el-form-item {
    margin-bottom: 6px;
  }
  
  .basic-info-row + .basic-info-row {
    margin-top: 18px;
  }
  
  
  
  .section-divider {
    margin: 16px 0;
  }
  
  .leave-form-page {
    position: relative;
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

  .result-card--forbidden {
    border: none;
    background:
      radial-gradient(circle at 18% 22%, rgba(245, 158, 11, 0.1), transparent 36%),
      radial-gradient(circle at 82% 18%, rgba(59, 130, 246, 0.08), transparent 32%),
      linear-gradient(180deg, #fffdf8 0%, #ffffff 52%, #f8fbff 100%);
  }

  .forbidden-result {
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    padding: 48px 24px 40px;
    text-align: center;
  }

  .forbidden-result__visual {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 28px;
  }

  .forbidden-result__orbit {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  .forbidden-result__orbit--one {
    inset: 0;
    border: 1px solid rgba(245, 158, 11, 0.22);
  }

  .forbidden-result__orbit--two {
    inset: 14px;
    border: 1px solid rgba(37, 99, 235, 0.12);
  }

  .forbidden-result__icon-wrap {
    position: absolute;
    inset: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: linear-gradient(145deg, #fff7ed, #eff6ff);
    box-shadow:
      0 10px 28px rgba(146, 64, 14, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }

  .forbidden-result__icon {
    font-size: 34px;
    color: #b45309;
  }

  .forbidden-result__eyebrow {
    margin: 0 0 10px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #d97706;
  }

  .forbidden-result__title {
    margin: 0 0 12px;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.35;
    color: #1e293b;
  }

  .forbidden-result__desc {
    max-width: 400px;
    margin: 0 auto 28px;
    font-size: 14px;
    line-height: 1.75;
    color: #64748b;
  }

  .forbidden-result__action {
    min-width: 168px;
  }
  
  .result-content {
    width: 100%;
  }
  
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
  
  .form-title-row {
    text-align: center;
    margin-bottom: 24px;
  }
  
  .form-title {
    font-size: 20px;
    font-weight: bold;
    color: #303133;
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

  .leave-form :deep(.el-select) {
    width: 100%;
  }

  .agent-field-input {
    width: 100%;
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

  .leave-form :deep(.leave-hours-input .el-input__inner),
  .leave-form :deep(.leave-hours-input .el-input__wrapper input) {
    color: var(--el-color-danger);
    font-weight: 700;
    -webkit-text-fill-color: var(--el-color-danger);
  }

  .leave-form :deep(.leave-hours-input.is-disabled .el-input__inner),
  .leave-form :deep(.leave-hours-input.is-disabled .el-input__wrapper input) {
    color: var(--el-color-danger);
    -webkit-text-fill-color: var(--el-color-danger);
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
    justify-content: flex-end;
    width: 100%;
    gap: 12px;
    flex-wrap: wrap;
  }
  
  .workflow-view-entry {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  .workflow-view-entry:hover {
    transform: translateY(-1px);
  }

  .workflow-view-hint {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .workflow-view-hint-icon {
    font-size: 17px;
    color: var(--el-color-primary);
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }

  .workflow-view-entry:hover .workflow-view-hint-icon {
    transform: scale(1.1);
  }

  .workflow-view-hint-text {
    font-size: 13px;
    color: var(--el-text-color-regular);
    line-height: 1.5;
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  .workflow-view-btn {
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  .workflow-view-btn:hover {
    transform: translateY(-2px);
  }

  .workflow-view-icon {
    font-size: 18px;
    transition: transform 0.3s ease;
  }

  .workflow-view-btn:hover .workflow-view-icon {
    transform: rotate(90deg);
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
  
.review-log-card {
    margin-top: 10px;
  }
  
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
  
  .review-log-table :deep(.el-table__body .el-table__cell) {
    vertical-align: top;
  }

  .review-log-table :deep(.el-table__body .review-log-index-col) {
    vertical-align: middle;
  }

  .review-log-table :deep(.review-log-row--withdraw > td.el-table__cell) {
    background-color: var(--el-fill-color-lighter);
    color: var(--el-text-color-secondary);
  }

  .review-log-table :deep(.review-log-row--withdraw .review-log-step-cell),
  .review-log-table :deep(.review-log-row--withdraw .review-log-user-cell),
  .review-log-table :deep(.review-log-row--withdraw .review-log-comment-cell),
  .review-log-table :deep(.review-log-row--withdraw .review-log-original-cell),
  .review-log-table :deep(.review-log-row--withdraw .review-log-appointment-cell) {
    color: var(--el-text-color-secondary);
  }

  .review-log-tag--withdraw {
    --el-tag-bg-color: var(--el-fill-color);
    --el-tag-border-color: var(--el-border-color-lighter);
    --el-tag-text-color: var(--el-text-color-secondary);
  }
  
  .review-log-step-cell {
    font-size: 13px;
    color: var(--el-text-color-primary);
  }
  
  .review-log-user-wrap {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
  
  .review-log-user-main {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
  }
  
  .review-log-auto-badge {
    flex-shrink: 0;
    margin-left: auto;
    font-size: 10px;
    line-height: 1.4;
    color: var(--el-color-info);
    background: var(--el-color-info-light-9);
    border-radius: 3px;
    padding: 0 4px;
    white-space: nowrap;
  }
  
  .review-log-user-cell {
    flex: 1;
    min-width: 0;
    font-size: 13px;
    color: var(--el-text-color-primary);
    word-break: break-all;
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
  
  .review-log-result-cell {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .review-log-reject-step {
    font-size: 12px;
    line-height: 1.5;
    color: var(--el-text-color-secondary);
    word-break: break-all;
  }
  
  .review-log-comment-cell {
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.5;
    font-size: 13px;
    color: var(--el-text-color-primary);
  }

  .leave-balance-float {
    --leave-balance-form-gap: 8px;
    --leave-balance-side-gap: 20px;
    position: fixed;
    top: 35%;
    left: calc(50% + 500px + var(--leave-balance-form-gap));
    right: var(--leave-balance-side-gap);
    z-index: 20;
    width: auto;
    max-width: 420px;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .leave-balance-float-card {
    pointer-events: auto;
    padding: 14px 14px 16px;
    border: 1px solid var(--el-border-color-light);
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
  }

  .leave-balance-float-header {
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .leave-balance-float-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    line-height: 1.4;
  }

  .leave-balance-float-note {
    margin: 6px 0 0;
    font-size: 11px;
    line-height: 1.45;
    color: var(--el-text-color-secondary);
  }

  .leave-balance-days-unit {
    margin-left: 2px;
    font-size: 11px;
    font-weight: 400;
    color: var(--el-text-color-secondary);
  }

  .leave-balance-hint {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    min-height: 20px;
    line-height: 1.5;
  }

  .leave-balance-float-card :deep(.el-loading-text) {
    display: none;
  }

  .leave-balance-float-card :deep(.el-loading-mask) {
    background-color: rgba(255, 255, 255, 0.72);
  }

  .leave-balance-float-card :deep(.el-loading-spinner) {
    margin-top: 0;
  }

  .leave-balance-float-card :deep(.el-loading-spinner .circular) {
    width: 16px;
    height: 16px;
  }

  .leave-balance-float-card :deep(.el-loading-spinner .path) {
    stroke: var(--el-text-color-secondary, #909399);
  }

  .leave-balance-hint-item {
    width: 100%;
    padding: 8px 0;
    border-bottom: 1px dashed var(--el-border-color-lighter);
    font-size: 12px;
    color: var(--el-text-color-regular);
  }

  .leave-balance-hint-item:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  .leave-balance-year {
    margin-bottom: 6px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .leave-balance-type-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 52px 56px;
    column-gap: 2px;
    align-items: baseline;
    line-height: 1.7;
  }

  .leave-balance-type-name {
    min-width: 0;
    color: var(--el-text-color-regular);
  }

  .leave-balance-days-col {
    justify-self: end;
    text-align: right;
    white-space: nowrap;
  }

  .leave-balance-deduct-col {
    justify-self: start;
    min-width: 56px;
    white-space: nowrap;
  }

  .leave-balance-days {
    color: #0058cc;
    font-weight: 700;
  }

  .leave-balance-days--exceeded {
    color: var(--el-color-danger);
    font-weight: 700;
  }

  .leave-balance-deduct-inline {
    color: var(--el-color-danger);
    font-size: 12px;
    font-weight: 700;
  }

  @media (max-width: 1340px) {
    .leave-balance-float {
      top: auto;
      bottom: 24px;
      left: 16px;
      right: 16px;
      max-width: none;
      transform: none;
    }
  }
  
  </style>
  