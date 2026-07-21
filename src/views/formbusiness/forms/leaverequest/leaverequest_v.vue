<template>
    <div class="leave-form-page">
      <el-config-provider :locale="elementPlusLocale">
      <!-- Skeleton 骨架屏：分区、内边距、标签列宽与下方真实表单对应 -->
      <template v-if="loading && !resultState.visible">
        <!-- 表单卡片骨架 -->
        <el-card class="leave-form-card" shadow="never">
          <el-skeleton animated>
            <template #template>
              <!-- 表单标题 -->
              <div class="sk-title-row">
                <el-skeleton-item variant="text" class="sk-title" />
              </div>
              <div class="sk-divider"></div>

              <div class="sk-body">
                <!-- 表单号 / 申请日期 -->
                <div class="sk-grid">
                  <div v-for="n in 2" :key="`sk-base-${n}`" class="sk-field">
                    <el-skeleton-item variant="text" class="sk-label" />
                    <el-skeleton-item variant="text" class="sk-control" />
                  </div>
                </div>

                <!-- 申请人工号 / 姓名 / 部门 -->
                <div class="sk-grid">
                  <div v-for="n in 3" :key="`sk-user-${n}`" class="sk-field">
                    <el-skeleton-item variant="text" class="sk-label" />
                    <el-skeleton-item variant="text" class="sk-control" />
                  </div>
                </div>

                <div class="sk-divider"></div>

                <!-- 请假类别 / 代理人 -->
                <div class="sk-grid">
                  <div v-for="n in 2" :key="`sk-leave-${n}`" class="sk-field">
                    <el-skeleton-item variant="text" class="sk-label" />
                    <el-skeleton-item variant="text" class="sk-control" />
                  </div>
                </div>

                <!-- 请假时间 / 时数 -->
                <div class="sk-field">
                  <el-skeleton-item variant="text" class="sk-label" />
                  <el-skeleton-item variant="text" class="sk-control" />
                </div>

                <!-- 请假事由 -->
                <div class="sk-field sk-field--top">
                  <el-skeleton-item variant="text" class="sk-label" />
                  <el-skeleton-item variant="text" class="sk-textarea" />
                </div>

                <!-- 附件：上传按钮 + 附件表格 -->
                <div class="sk-field sk-field--top">
                  <el-skeleton-item variant="text" class="sk-label" />
                  <el-skeleton-item variant="text" class="sk-block" />
                </div>

                <!-- 审批意见 -->
                <div class="sk-field sk-field--top">
                  <el-skeleton-item variant="text" class="sk-label" />
                  <el-skeleton-item variant="text" class="sk-textarea" />
                </div>

                <!-- 流程查看入口（查看页无操作按钮） -->
                <div class="sk-actions">
                  <el-skeleton-item variant="text" class="sk-hint" />
                </div>
              </div>
            </template>
          </el-skeleton>
        </el-card>

        <!-- 审批记录卡片骨架 -->
        <el-card class="leave-form-card review-log-card" shadow="never">
          <el-skeleton animated>
            <template #template>
              <div class="sk-log">
                <el-skeleton-item variant="text" class="sk-section-title" />
                <el-skeleton-item variant="text" class="sk-block sk-block--log" />
              </div>
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
          <p class="forbidden-result__eyebrow">{{ t('formbusiness.leaverequest.forbiddenViewEyebrow') }}</p>
          <h2 class="forbidden-result__title">{{ t('formbusiness.leaverequest.forbiddenViewTitle') }}</h2>
          <p class="forbidden-result__desc">{{ t('formbusiness.leaverequest.forbiddenViewSubTitle') }}</p>
          <el-button class="forbidden-result__action" type="primary" round @click="closeCurrentPage">
            {{ t('formbusiness.leaverequest.backToFormPending') }}
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
            <p v-if="resultState.variant === 'badRequest'" class="leaverequest-bad-request-desc">
              {{ t('formbusiness.leaverequest.badRequestHint') }}
            </p>
            <span v-else>{{ t(resultState.subTitleKey) }}</span>
          </template>
          <template #extra>
            <el-button type="primary" @click="closeCurrentPage">
              {{ t('formbusiness.leaverequest.backToFormPending') }}
            </el-button>
          </template>
        </el-result>
      </el-card>
  
      <template v-else>
      <el-card class="leave-form-card" shadow="never">
        <!-- 表单标题 -->
        <div class="form-title-row">
          <h2 class="form-title">{{ t('formbusiness.leaverequest.formTitle') }}</h2>
        </div>
        <el-divider style="margin: 22px 0;"></el-divider>
  
          <!-- 表单主体（表格化排版） -->
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="leave-form" :validate-on-rule-change="false">
  
          <!-- 基本信息 -->
          <el-row v-if="isAnyStepFieldVisible(['FormNo', 'ApplyDate'])" :gutter="16" class="basic-info-row" style="justify-content: flex-start;">
            <el-col v-if="isStepFieldVisible('FormNo')" :span="8">
              <el-form-item :label="t('formbusiness.leaverequest.formNo')" prop="formNo">
                <el-input v-model="form.formNo" disabled />
              </el-form-item>
            </el-col>
            <el-col v-if="isStepFieldVisible('ApplyDate')" :span="8">
              <el-form-item :label="t('formbusiness.leaverequest.applyDate')" prop="applyDate">
                <el-date-picker
                  v-model="form.applyDate"
                  type="date"
                  value-format="YYYY-MM-DD"
                  :placeholder="t('formbusiness.leaverequest.pleaseSelectApplyDate')"
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
              <el-form-item :label="t('formbusiness.leaverequest.applicantUserNo')" prop="applicantUserNo">
                <el-input v-model="form.applicantUserNo" disabled />
              </el-form-item>
            </el-col>
            <el-col v-if="isStepFieldVisible('UserName')" :span="8">
              <el-form-item :label="t('formbusiness.leaverequest.applicantUserName')" prop="applicantUserName">
                <el-input v-model="form.applicantUserName" disabled />
              </el-form-item>
            </el-col>
            <el-col v-if="isStepFieldVisible('Department')" :span="8">
              <el-form-item :label="t('formbusiness.leaverequest.applicantDeptName')" prop="applicantDeptName">
                <el-input v-model="form.applicantDeptName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
  
          <el-divider v-if="isAnyStepFieldVisible(['FormNo', 'ApplyDate', 'UserNo', 'UserName', 'Department'])"></el-divider>
  
          <!-- 请假信息：类别 / 代理人 / 时数 -->
          <el-row
            v-if="isAnyStepFieldVisible(['LeaveType', 'Agent', 'SelectAgent'])"
            :gutter="16"
            style="justify-content: flex-start;"
          >
            <el-col v-if="isStepFieldVisible('LeaveType')" :span="8">
              <el-form-item :label="t('formbusiness.leaverequest.leaveType')" prop="leaveType">
                <el-select v-model="form.leaveType" :placeholder="t('formbusiness.leaverequest.pleaseSelectLeaveType')" disabled @change="onSelectChange('leaveType')">
                  <el-option v-for="type in leaveTypeOptions" :key="type.value" :label="type.label" :value="type.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="isAnyStepFieldVisible(['Agent', 'SelectAgent'])" :span="8">
              <el-form-item :label="t('formbusiness.leaverequest.agentUserNo')" prop="agentUserId">
                <div class="agent-field-control">
                  <el-input
                    :model-value="agentDisplayText"
                    :placeholder="t('formbusiness.leaverequest.pleaseSelectAgent')"
                    disabled
                  />
                  <el-button
                    v-if="isStepFieldVisible('SelectAgent')"
                    type="primary"
                    plain
                    disabled
                    class="agent-picker-btn"
                    :title="t('formbusiness.leaverequest.selectAgent')"
                  >
                    <el-icon><Search /></el-icon>
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="isAnyStepFieldVisible(['LeavePeriod', 'LeaveHours', 'LeaveDays'])" :gutter="16">
            <el-col :span="24" class="leave-time-hours-row">
              <el-form-item
                v-if="isStepFieldVisible('LeavePeriod')"
                :label="t('formbusiness.leaverequest.leaveTimeRange')"
                prop="leaveTimeRange"
                class="leave-time-range-item"
              >
                <div class="leave-time-range-fields">
                  <el-date-picker
                    v-model="leaveStartDate"
                    type="date"
                    value-format="YYYY-MM-DD"
                    :placeholder="t('formbusiness.leaverequest.pleaseSelectStartDate')"
                    disabled
                    class="leave-date-picker"
                    style="width: 165px; flex: 0 0 165px;"
                  />
                  <el-time-select
                    v-model="leaveStartTimeOfDay"
                    start="08:00"
                    end="17:00"
                    step="00:10"
                    :placeholder="t('formbusiness.leaverequest.pleaseSelectStartTime')"
                    disabled
                    class="leave-time-of-day-select"
                    style="width: 130px; flex: 0 0 130px;"
                  />
                  <span class="leave-time-range-separator"> ~ </span>
                  <el-date-picker
                    v-model="leaveEndDate"
                    type="date"
                    value-format="YYYY-MM-DD"
                    :placeholder="t('formbusiness.leaverequest.pleaseSelectEndDate')"
                    disabled
                    class="leave-date-picker"
                    style="width: 165px; flex: 0 0 165px;"
                  />
                  <el-time-select
                    v-model="leaveEndTimeOfDay"
                    start="08:00"
                    end="17:00"
                    step="00:10"
                    :placeholder="t('formbusiness.leaverequest.pleaseSelectEndTime')"
                    disabled
                    class="leave-time-of-day-select"
                    style="width: 130px; flex: 0 0 130px;"
                  />
                </div>
              </el-form-item>
              <el-form-item
                v-if="isAnyStepFieldVisible(['LeaveHours', 'LeaveDays'])"
                :label="t('formbusiness.leaverequest.leaveHours')"
                prop="days"
                label-width="auto"
                class="leave-hours-item"
              >
                <el-input-number
                  v-model="form.days"
                  class="leave-hours-input"
                  :min="0"
                  :step="0.01"
                  :precision="2"
                  :controls="false"
                  style="width: 110px;"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
  
          <!-- 事由 -->
          <el-row v-if="isStepFieldVisible('LeaveReason')" :gutter="16">
            <el-col :span="24">
              <el-form-item :label="t('formbusiness.leaverequest.leaveReason')" prop="reason">
                <el-input v-model="form.reason" type="textarea" :rows="3" :placeholder="t('formbusiness.leaverequest.pleaseInputLeaveReason')" disabled />
              </el-form-item>
            </el-col>
          </el-row>
  
          <!-- 附件 -->
          <el-row v-if="isStepFieldVisible('Upload') || uploadedAttachments.length > 0" :gutter="16">
            <el-col :span="24">
              <el-form-item :label="t('formbusiness.leaverequest.attachments')">
                <div class="upload-section">
                  <el-table :data="uploadedAttachments" border size="small" class="attachment-table">
                    <el-table-column type="index" width="55" align="center" label="#" />
                    <el-table-column :label="t('formbusiness.leaverequest.fileName')" min-width="200">
                      <template #default="{ row }">
                        <div style="display: flex; align-items: center; gap: 6px;">
                          <el-icon style="color: #409eff; flex-shrink: 0;"><Document /></el-icon>
                          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" :title="getAttachmentName(row)">{{ getAttachmentName(row) }}</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column :label="t('formbusiness.leaverequest.fileSize')" width="100" align="center">
                      <template #default="{ row }">
                        {{ formatFileSize(getAttachmentSizeKb(row)) }}
                      </template>
                    </el-table-column>
                    <el-table-column :label="t('common.operation')" width="170" align="center">
                      <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="handleDownload(row)">
                          <el-icon><Download /></el-icon>
                          {{ t('formbusiness.leaverequest.download') }}
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
              <el-form-item :label="t('formbusiness.leaverequest.approvalComment')">
                <el-input
                  v-model="approvalComment"
                  type="textarea"
                  :rows="3"
                  :placeholder="t('formbusiness.leaverequest.approvalCommentPlaceholder')"
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
                      <span class="workflow-view-hint-text">{{ t('formbusiness.leaverequest.viewFullWorkflowHint') }}</span>
                    </div>
                    <el-tooltip :content="t('formbusiness.leaverequest.viewFullWorkflow')" placement="top">
                      <span
                        class="workflow-view-icon"
                        :class="{ 'is-disabled': !form.formId }"
                        @click="openWorkflowDrawer"
                      >
                        <svg class="hand-drawn-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <rect x="4.5" y="5.5" width="11" height="7.5" rx="2.4" fill="#E6D8B8" stroke="#1f1f1f" stroke-width="1.8" stroke-linejoin="round" />
                          <path d="M15.5 9.3 H20.5 Q23 9.3 23 11.9 V18.5" fill="none" stroke="#1f1f1f" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                          <rect x="17.5" y="19" width="11" height="7.5" rx="2.4" fill="none" stroke="#1f1f1f" stroke-width="1.8" stroke-linejoin="round" />
                        </svg>
                      </span>
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
          <div class="review-log-title">{{ t('formbusiness.leaverequest.reviewLog') }}</div>
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
              :label="t('formbusiness.leaverequest.reviewLogStep')"
              width="130"
              align="left"
            >
              <template #default="{ row }">
                <span class="review-log-step-cell">{{ row.stepName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('formbusiness.leaverequest.reviewLogOperationUser')"
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
              :label="t('formbusiness.leaverequest.reviewLogResult')"
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
                  >（{{ t('formbusiness.leaverequest.reviewLogRejectToStep', { step: getReviewRejectStepName(row) }) }}）</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('formbusiness.leaverequest.reviewLogComment')"
              min-width="200"
            >
              <template #default="{ row }">
                <div class="review-log-comment-cell">{{ row.comment }}</div>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('formbusiness.leaverequest.reviewLogDateTime')"
              width="155"
              align="center"
            >
              <template #default="{ row }">{{ formatReviewDateTime(row.reviewDateTime) }}</template>
            </el-table-column>
          </el-table>
          <el-empty
            v-else
            :description="t('formbusiness.leaverequest.reviewLogEmpty')"
            style="padding: 20px 0;"
          />
        </div>
      </el-card>

      </template>

      <!-- 假期余额：右侧悬浮（LeaveBalance 权限控制，加载中显示骨架） -->
      <aside
        v-if="!resultState.visible && (loading || isStepFieldVisible('LeaveBalance'))"
        class="leave-balance-float"
        :aria-label="t('formbusiness.leaverequest.leaveBalance') + t('formbusiness.leaverequest.leaveBalanceDaysUnit')"
      >
        <div class="leave-balance-float-card">
          <div class="leave-balance-float-header">
            <el-skeleton v-if="loading || leaveBalanceLoading" animated>
              <template #template>
                <el-skeleton-item variant="text" class="sk-balance-title" />
                <el-skeleton-item variant="text" class="sk-balance-note" />
              </template>
            </el-skeleton>
            <template v-else>
              <span class="leave-balance-float-title">
                {{ t('formbusiness.leaverequest.leaveBalance') }}<span class="leave-balance-days-unit">{{ t('formbusiness.leaverequest.leaveBalanceDaysUnit') }}</span>
              </span>
              <p class="leave-balance-float-note">{{ t('formbusiness.leaverequest.leaveBalanceNote') }}</p>
            </template>
          </div>
          <div class="leave-balance-hint">
            <!-- 页面初始化或余额查询中：按年度分组的简化骨架 -->
            <el-skeleton v-if="loading || leaveBalanceLoading" class="sk-balance" animated>
              <template #template>
                <div v-for="n in 2" :key="`sk-balance-${n}`" class="sk-balance-item">
                  <el-skeleton-item variant="text" class="sk-balance-year" />
                  <el-skeleton-item variant="text" class="sk-balance-line" />
                  <el-skeleton-item variant="text" class="sk-balance-line" />
                </div>
              </template>
            </el-skeleton>
            <template v-else>
            <div
              v-for="item in leaveBalances"
              :key="item.year"
              class="leave-balance-hint-item"
            >
              <div class="leave-balance-year">{{ item.year }}</div>
              <div class="leave-balance-type-row">
                <span class="leave-balance-type-name">{{ t('formbusiness.leaverequest.annualRemainingDays') }}</span>
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
                <span class="leave-balance-type-name">{{ t('formbusiness.leaverequest.sickRemainingDays') }}</span>
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
            <!-- 未查询到余额时保留卡片，仅提示空数据 -->
            <div v-if="!leaveBalances.length" class="leave-balance-empty">
              {{ t('formbusiness.leaverequest.leaveBalanceEmpty') }}
            </div>
            </template>
          </div>
        </div>
      </aside>
  
      <el-drawer
        v-model="workflowDrawerVisible"
        :title="t('formbusiness.leaverequest.workflowDrawerTitle')"
        direction="rtl"
        size="420px"
        destroy-on-close
        class="leaverequest-workflow-drawer"
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
                  {{ t('formbusiness.leaverequest.workflowStatusSkipped') }}
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
                      {{ t('formbusiness.leaverequest.workflowAgent') }}：{{ u.agentUserName }}
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
          <el-empty v-else-if="!workflowDrawerLoading" :description="t('formbusiness.leaverequest.workflowEmpty')" />
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
  import { Document, Download, Clock, CircleCheck, RemoveFilled, Loading, Lock, Search } from '@element-plus/icons-vue'
  import { post } from '@/utils/request'
  import { INIT_LEAVEREQUEST_API, GET_LEAVEREQUEST_DETAIL_API, GET_LEAVEREQUEST_DROPDOWN_API, GET_LEAVE_BALANCES_API, GET_FULL_REVIEW_FLOW_API, GET_FORM_NOTIFY_TOKEN_API } from '@/config/api/formbusiness/forms/leaverequest'
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
    if (key === 'approve') return t('formbusiness.leaverequest.workflowStatusApprove')
    if (key === 'underReview') return t('formbusiness.leaverequest.workflowStatusUnderReview')
    return t('formbusiness.leaverequest.workflowStatusUnsigned')
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
    titleKey: 'formbusiness.leaverequest.approvalResultTitle',
    subTitleKey: 'formbusiness.leaverequest.approvalResultSubTitle'
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

  // 展示层拆分：form.leaveTimeRange 仍是 [startDateTime, endDateTime]（"YYYY-MM-DD HH:mm:ss"），与 r 页面保持一致
  const LEAVE_DEFAULT_START_TIME = '08:00'
  const LEAVE_DEFAULT_END_TIME = '17:00'

  function splitLeaveDateTime (val) {
    if (!val) return { date: '', time: '' }
    const s = String(val)
    const spaceIdx = s.indexOf(' ')
    if (spaceIdx === -1) return { date: s, time: '' }
    return { date: s.slice(0, spaceIdx), time: s.slice(spaceIdx + 1, spaceIdx + 6) }
  }

  function setLeaveStart (date, time) {
    const end = Array.isArray(form.leaveTimeRange) ? (form.leaveTimeRange[1] || '') : ''
    const start = date ? `${date} ${time}:00` : ''
    form.leaveTimeRange = (start || end) ? [start, end] : []
  }

  function setLeaveEnd (date, time) {
    const start = Array.isArray(form.leaveTimeRange) ? (form.leaveTimeRange[0] || '') : ''
    const end = date ? `${date} ${time}:00` : ''
    form.leaveTimeRange = (start || end) ? [start, end] : []
  }

  const leaveStartDate = computed({
    get () {
      const [start] = Array.isArray(form.leaveTimeRange) ? form.leaveTimeRange : []
      return splitLeaveDateTime(start).date
    },
    set (val) {
      setLeaveStart(val, leaveStartTimeOfDay.value)
    }
  })

  const leaveStartTimeOfDay = computed({
    get () {
      const [start] = Array.isArray(form.leaveTimeRange) ? form.leaveTimeRange : []
      return splitLeaveDateTime(start).time || LEAVE_DEFAULT_START_TIME
    },
    set (val) {
      setLeaveStart(leaveStartDate.value, val)
    }
  })

  const leaveEndDate = computed({
    get () {
      const [, end] = Array.isArray(form.leaveTimeRange) ? form.leaveTimeRange : []
      return splitLeaveDateTime(end).date
    },
    set (val) {
      setLeaveEnd(val, leaveEndTimeOfDay.value)
    }
  })

  const leaveEndTimeOfDay = computed({
    get () {
      const [, end] = Array.isArray(form.leaveTimeRange) ? form.leaveTimeRange : []
      return splitLeaveDateTime(end).time || LEAVE_DEFAULT_END_TIME
    },
    set (val) {
      setLeaveEnd(leaveEndDate.value, val)
    }
  })

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
      callback(new Error(t('formbusiness.leaverequest.endAfterStartError')))
      return
    }
    callback()
  }
  
  function onSelectChange (field) {
    if (!formRef.value) return
    try {
      formRef.value.validateField(field)
    } catch {
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
    if (String(form.formStatus ?? '').trim().toLowerCase() === 'approved') return rawDays
    const remainingHours = rawDays * 8 - getSelectedLeaveHoursByYear(item.year)
    return remainingHours / 8
  }

  function isLeaveBalanceAffected (year, type) {
    if (String(form.formStatus ?? '').trim().toLowerCase() === 'voided') return false
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
      ElMessage.error(t('formbusiness.leaverequest.getLeaveBalanceFailed'))
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
  
  function showForbiddenResult () {
    resultState.variant = 'forbidden'
    resultState.detailMessage = ''
    resultState.visible = true
    resultState.status = 'warning'
    resultState.titleKey = 'formbusiness.leaverequest.forbiddenViewTitle'
    resultState.subTitleKey = 'formbusiness.leaverequest.forbiddenViewSubTitle'
  }
  
  function showBadRequestResult (message) {
    const msg = typeof message === 'string' ? message.trim() : ''
    resultState.variant = 'badRequest'
    resultState.detailMessage = msg || t('formbusiness.leaverequest.badRequestFallbackMessage')
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
  
  /** InitLeaveRequest：返回完整实体则直接 bind，旧版仅返回 formId 时再拉详情 */
  async function initLeaveRequest () {
    try {
      const formData = new window.FormData()
      formData.append('formTypeId', currentFormTypeId.value || defaultFormTypeId)
  
      const res = await post(INIT_LEAVEREQUEST_API, formData, {
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
      await getLeaveRequestDetail(newFormId)
    } catch {
      // ignore
    }
  }
  
  async function getLeaveRequestDetail (id) {
    try {
      const formData = new window.FormData()
      formData.append('formId', String(id))
      formData.append('type', 'View')
      const res = await post(GET_LEAVEREQUEST_DETAIL_API, formData, {
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
      // ignore
    }
  }
  
  async function getLeaveTypeOptions () {
    try {
      const res = await post(GET_LEAVEREQUEST_DROPDOWN_API, {})
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
      // ignore
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
          ElMessage.error(res?.message || t('formbusiness.leaverequest.workflowLoadFailed'))
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
      ElMessage.error(t('formbusiness.leaverequest.workflowLoadFailed'))
    } finally {
      workflowDrawerLoading.value = false
    }
  }
  
  function openWorkflowDrawer () {
    if (!form.formId) {
      ElMessage.warning(t('formbusiness.leaverequest.workflowNeedFormId'))
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
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
  
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
      const res = await post(GET_FORM_NOTIFY_TOKEN_API, formData, {
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
          form.formId = tokenFormId
          // 下拉选项与表单详情相互独立，并行拉取以缩短加载等待
          await Promise.all([getLeaveTypeOptions(), getLeaveRequestDetail(tokenFormId)])
        }
        return
      }

      const routeFormId = route.query.formId || route.params?.formId
      if (routeFormId) {
        form.formId = String(routeFormId)
        // 下拉选项与表单详情相互独立，并行拉取以缩短加载等待
        await Promise.all([getLeaveTypeOptions(), getLeaveRequestDetail(form.formId)])
      } else {
        await Promise.all([getLeaveTypeOptions(), initLeaveRequest()])
      }
    } catch {
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
  /* 骨架屏：内边距、标签列宽、控件高度与真实表单一一对应 */
  .sk-title-row {
    text-align: center;
    margin-bottom: 24px;
  }

  /* 对应 .form-title：20px 加粗标题的行高 */
  .sk-title {
    display: inline-block;
    width: 180px;
    height: 26px;
  }

  .sk-divider {
    height: 1px;
    margin: 22px 0;
    background: var(--el-border-color-lighter);
  }

  /* 对应 .leave-form 的左右内边距 */
  .sk-body {
    padding: 0 20px;
  }

  .sk-grid {
    display: flex;
    gap: 0 16px;
  }

  .sk-grid .sk-field {
    width: calc((100% - 32px) / 3);
  }

  .sk-field {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    margin-bottom: 18px;
  }

  .sk-field--top {
    align-items: flex-start;
  }

  /* label-width: 100px 减去与控件之间的间距 */
  .sk-label {
    flex: none;
    width: 88px;
    height: 14px;
  }

  .sk-control {
    flex: 1;
    min-width: 0;
    height: 32px;
  }

  /* 对应 rows=3 的文本域 */
  .sk-textarea {
    flex: 1;
    min-width: 0;
    height: 76px;
  }

  /* 对应上传按钮 + 附件表格整体 */
  .sk-block {
    flex: 1;
    min-width: 0;
    height: 120px;
  }

  /* 无 label 的操作行：内容区左侧留出 label-width */
  .sk-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 24px 0 18px 100px;
  }

  .sk-hint {
    flex: none;
    width: 170px;
    height: 22px;
  }

  /* 对应 .review-log-section */
  .sk-log {
    padding: 0 20px 20px;
  }

  .sk-section-title {
    width: 90px;
    height: 22px;
    margin-bottom: 12px;
  }

  .sk-block--log {
    width: 100%;
    height: 220px;
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
  
  .leaverequest-bad-request-desc {
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

  .agent-field-control {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .agent-field-control .el-input {
    flex: 1;
    min-width: 0;
  }

  .agent-picker-btn {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    padding: 0;
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

  .leave-time-range-fields {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    flex-wrap: wrap;
  }

  .leave-date-picker :deep(.el-input__wrapper) {
    padding-left: 8px;
    padding-right: 6px;
  }

  .leave-date-picker :deep(.el-input__inner) {
    font-size: 13px;
  }

  .leave-time-of-day-select {
    flex-shrink: 0;
  }

  .leave-time-range-separator {
    flex-shrink: 0;
    color: var(--el-text-color-secondary);
  }

  /* 请假时数不再单独分栏：紧随请假时间字段之后，标签宽度自适应使文本框紧贴标签 */
  .leave-time-hours-row {
    display: flex;
    align-items: flex-start;
    gap: 16px 24px;
    flex-wrap: wrap;
  }

  .leave-time-hours-row .leave-time-range-item {
    flex: 0 1 auto;
    min-width: 0;
  }

  .leave-time-hours-row .leave-time-range-item :deep(.el-form-item__content) {
    min-width: 0;
  }

  .leave-time-hours-row .leave-hours-item {
    flex: 0 0 auto;
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
    color: #c00c1f;
    font-weight: 700;
    -webkit-text-fill-color: #c00c1f;
  }

  .leave-form :deep(.leave-hours-input.is-disabled .el-input__inner),
  .leave-form :deep(.leave-hours-input.is-disabled .el-input__wrapper input) {
    color: #c00c1f;
    -webkit-text-fill-color: #c00c1f;
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
  }

  .workflow-view-hint {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }


  .workflow-view-hint-text {
    font-size: 13px;
    color: var(--el-text-color-secondary);
    line-height: 1.5;
    letter-spacing: 0.3px;
  }

  .workflow-view-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
  }

  .workflow-view-icon .hand-drawn-icon {
    width: 22px;
    height: 22px;
    display: block;
  }

  .workflow-view-icon.is-disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  .leaverequest-workflow-drawer :deep(.el-drawer__header) {
    padding: 10px 20px !important;
    margin: 0 !important;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }
  
  .leaverequest-workflow-drawer :deep(.el-drawer__title) {
    font-size: 15px;
    font-weight: 500;
    line-height: 1.4;
    margin: 0;
  }
  
  .leaverequest-workflow-drawer :deep(.el-drawer__body) {
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
    right: auto;
    z-index: 20;
    /* 固定较窄宽度并紧贴表单右侧，不再拉伸到屏幕右边缘 */
    width: 240px;
    max-width: calc(50vw - 500px - var(--leave-balance-form-gap) - var(--leave-balance-side-gap));
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

  /* 假期余额骨架：与标题、说明、年度分组的高度对齐 */
  .sk-balance-title {
    width: 96px;
    height: 18px;
  }

  .sk-balance-note {
    width: 100%;
    height: 16px;
    margin-top: 6px;
  }

  .sk-balance {
    width: 100%;
  }

  .sk-balance-item {
    width: 100%;
    padding: 8px 0;
    border-bottom: 1px dashed var(--el-border-color-lighter);
  }

  .sk-balance-item:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  .sk-balance-year {
    width: 48px;
    height: 16px;
    margin-bottom: 8px;
  }

  .sk-balance-line {
    width: 100%;
    height: 16px;
    margin-bottom: 8px;
  }

  .sk-balance-line:last-child {
    margin-bottom: 0;
  }

  .leave-balance-empty {
    width: 100%;
    padding: 6px 0;
    font-size: 12px;
    color: var(--el-text-color-secondary);
    text-align: center;
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
    color: #c00c1f;
    font-size: 12px;
    font-weight: 700;
  }

  @media (max-width: 1340px) {
    .leave-balance-float {
      top: auto;
      bottom: 24px;
      left: 16px;
      right: 16px;
      width: auto;
      max-width: none;
      transform: none;
    }
  }
  
  </style>
  