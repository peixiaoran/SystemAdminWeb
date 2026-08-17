<template>
  <div
    class="leave-form-page"
    v-loading.fullscreen.lock="formActionLoading"
    :element-loading-text="t('common.loading')"
  >
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

              <!-- 操作按钮行 + 流程查看入口 -->
              <div class="sk-actions">
                <div class="sk-actions-buttons">
                  <el-skeleton-item variant="button" class="sk-action-btn" />
                  <el-skeleton-item variant="button" class="sk-action-btn" />
                </div>
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
        <p class="forbidden-result__eyebrow">{{ t('formbusiness.leaverequest.forbiddenReviewEyebrow') }}</p>
        <h2 class="forbidden-result__title">{{ t('formbusiness.leaverequest.forbiddenReviewTitle') }}</h2>
        <p class="forbidden-result__desc">{{ t('formbusiness.leaverequest.forbiddenReviewSubTitle') }}</p>
        <span class="result-back-link" @click="closeCurrentPage">[ {{ t('formbusiness.leaverequest.backToFormPending') }} ]</span>
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
          <span class="result-back-link" @click="closeCurrentPage">[ {{ t('formbusiness.leaverequest.backToFormPending') }} ]</span>
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
              <el-input v-model="form.formNo" :disabled="!isStepFieldEditable('FormNo')" />
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
                :disabled="!isStepFieldEditable('ApplyDate')"
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
              <el-input v-model="form.applicantUserNo" :disabled="!isStepFieldEditable('UserNo')" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('UserName')" :span="8">
            <el-form-item :label="t('formbusiness.leaverequest.applicantUserName')" prop="applicantUserName">
              <el-input v-model="form.applicantUserName" :disabled="!isStepFieldEditable('UserName')" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('Department')" :span="8">
            <el-form-item :label="t('formbusiness.leaverequest.applicantDeptName')" prop="applicantDeptName">
              <el-input v-model="form.applicantDeptName" :disabled="!isStepFieldEditable('Department')" />
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
              <el-select v-model="form.leaveType" :placeholder="t('formbusiness.leaverequest.pleaseSelectLeaveType')" :disabled="!isStepFieldEditable('LeaveType')" @change="onSelectChange('leaveType')">
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
                  v-if="isStepFieldVisible('SelectAgent') && isStepFieldEditable('SelectAgent')"
                  type="primary"
                  plain
                  class="agent-picker-btn"
                  :title="t('formbusiness.leaverequest.selectAgent')"
                  @click="openAgentPicker"
                >
                  <el-icon><Search /></el-icon>
                </el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isAnyStepFieldVisible(['LeavePeriod', 'LeaveHours'])" :gutter="16">
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
                  :clearable="false"
                  :disabled="!isStepFieldEditable('LeavePeriod')"
                  class="leave-date-picker"
                  style="width: 160px; flex: 0 0 160px;"
                  @change="handleTimeRangeChange"
                />
                <el-select
                  v-model="leaveStartTimeOfDay"
                  :placeholder="t('formbusiness.leaverequest.pleaseSelectStartTime')"
                  :clearable="false"
                  :disabled="!isStepFieldEditable('LeavePeriod')"
                  class="leave-time-of-day-select"
                  style="width: 130px; flex: 0 0 130px;"
                  @change="handleTimeRangeChange"
                >
                  <el-option v-for="time in LEAVE_WORK_TIME_OPTIONS" :key="time" :label="time" :value="time" />
                </el-select>
                <span class="leave-time-range-separator"> ~ </span>
                <el-date-picker
                  v-model="leaveEndDate"
                  type="date"
                  value-format="YYYY-MM-DD"
                  :placeholder="t('formbusiness.leaverequest.pleaseSelectEndDate')"
                  :clearable="false"
                  :disabled="!isStepFieldEditable('LeavePeriod')"
                  class="leave-date-picker"
                  style="width: 160px; flex: 0 0 160px;"
                  @change="handleTimeRangeChange"
                />
                <el-select
                  v-model="leaveEndTimeOfDay"
                  :placeholder="t('formbusiness.leaverequest.pleaseSelectEndTime')"
                  :clearable="false"
                  :disabled="!isStepFieldEditable('LeavePeriod')"
                  class="leave-time-of-day-select"
                  style="width: 130px; flex: 0 0 130px;"
                  @change="handleTimeRangeChange"
                >
                  <el-option v-for="time in LEAVE_WORK_TIME_OPTIONS" :key="time" :label="time" :value="time" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item
              v-if="isStepFieldVisible('LeaveHours')"
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
                :disabled="!isStepFieldEditable('LeaveHours')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 事由 -->
        <el-row v-if="isStepFieldVisible('LeaveReason')" :gutter="16">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.leaverequest.leaveReason')" prop="reason">
              <el-input v-model="form.reason" type="textarea" :rows="3" :placeholder="t('formbusiness.leaverequest.pleaseInputLeaveReason')" :disabled="!isStepFieldEditable('LeaveReason')" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 附件上传 -->
        <el-row v-if="isStepFieldVisible('Upload') || uploadedAttachments.length > 0" :gutter="16" class="attachment-row">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.leaverequest.attachments')">
              <div class="upload-section">
                <input
                  ref="fileInputRef"
                  type="file"
                  multiple
                  style="display: none;"
                  @change="onNativeFileChange"
                />
                <div v-if="isStepFieldVisible('Upload')" class="upload-actions">
                  <el-button class="upload-trigger" type="primary" plain :loading="uploading" :disabled="uploading || !isStepFieldEditable('Upload')" @click="openFilePicker">
                    <el-icon><Upload /></el-icon>
                    {{ t('formbusiness.leaverequest.uploadFile') }}
                  </el-button>
                  <span v-if="getAttachmentRequirementTip()" class="attachment-tip">
                    {{ getAttachmentRequirementTip() }}
                  </span>
                </div>
                <el-table :data="uploadedAttachments" border size="small" class="attachment-table">
                  <el-table-column type="index" width="55" align="center" label="#" />
                  <el-table-column :label="t('formbusiness.leaverequest.fileName')" min-width="200">
                    <template #default="{ row }">
                      <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" :title="getAttachmentName(row)">{{ getAttachmentName(row) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('formbusiness.leaverequest.fileSize')" width="100" align="center">
                    <template #default="{ row }">
                      {{ formatFileSize(getAttachmentSizeKb(row)) }}
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('common.operation')" width="150" align="center">
                    <template #default="{ row, $index }">
                      <el-button type="primary" link size="small" @click="handleDownload(row)">
                        {{ t('formbusiness.leaverequest.download') }}
                      </el-button>
                      <el-button type="danger" link size="small" :disabled="!isStepFieldEditable('Upload')" @click="removeAttachment(row, $index)">
                        {{ t('formbusiness.leaverequest.deleteFile') }}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider class="approval-divider"></el-divider>

        <el-row v-if="isStepFieldVisible('Comments')" :gutter="16" class="approval-comment-row">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.leaverequest.approvalComment')">
              <el-input
                v-model="approvalComment"
                type="textarea"
                :rows="3"
                :placeholder="t('formbusiness.leaverequest.approvalCommentPlaceholder')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item class="form-actions-form-item">
              <div class="form-actions-row">
                <div class="form-actions-buttons">
                  <el-button v-if="isStepFieldVisible('Save')" type="primary" round style="width:80px;" @click="onSubmit" :loading="saving" :disabled="formActionLoading || !isStepFieldEditable('Save')">{{ t('formbusiness.leaverequest.saveButton') }}</el-button>
                  <el-button v-if="isStepFieldVisible('Submit')" type="success" round style="width:80px;" @click="onSubmitForApproval" :loading="approving" :disabled="formActionLoading || !isStepFieldEditable('Submit')">{{ t('formbusiness.leaverequest.submitButton') }}</el-button>
                  <el-button v-if="isStepFieldVisible('Reject')" type="danger" round style="width:80px;" @click="onReject" :disabled="formActionLoading || !isStepFieldEditable('Reject')">{{ t('formbusiness.leaverequest.rejectButton') }}</el-button>
                </div>
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
    <ReviewLogCard :records="reviewRecordList" i18n-prefix="formbusiness.leaverequest" />

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
          <!-- 页面初始化或余额查询中：按年度分组的简化骨架（标题与说明为静态文案，无需骨架） -->
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

    <!-- 选择代理人弹窗 -->
    <el-dialog
      v-model="agentDialogVisible"
      :title="t('formbusiness.leaverequest.selectAgentTitle')"
      width="1100px"
      :close-on-click-modal="false"
      :append-to-body="true"
      destroy-on-close
      @closed="handleAgentDialogClosed"
    >
      <el-form :inline="true" class="agent-filter-form">
        <el-form-item :label="t('formbusiness.leaverequest.agentDepartmentFilter')">
          <el-tree-select
            v-model="agentFilters.departmentId"
            :data="agentDepartmentOptions"
            :props="{
              value: 'departmentId',
              label: 'departmentName',
              children: 'departmentChildList',
              disabled: 'disabled'
            }"
            check-strictly
            filterable
            :filter-node-method="agentDepartmentFilterNode"
            class="agent-filter-dept-select"
            :placeholder="t('formbusiness.leaverequest.pleaseSelectDepartment')"
            @change="handleAgentDepartmentChange"
          />
        </el-form-item>
        <el-form-item :label="t('formbusiness.leaverequest.applicantUserNo')">
          <el-input
            v-model="agentFilters.userNo"
            class="agent-filter-input-userno"
            clearable
            :placeholder="t('formbusiness.leaverequest.applicantUserNo')"
            @input="handleAgentFilterInput"
            @keyup.enter="handleAgentSearch"
            @clear="handleAgentFilterInput"
          />
        </el-form-item>
        <el-form-item :label="t('formbusiness.leaverequest.agentUserName')">
          <el-input
            v-model="agentFilters.userName"
            class="agent-filter-input-compact"
            clearable
            :placeholder="t('formbusiness.leaverequest.agentUserName')"
            @input="handleAgentFilterInput"
            @keyup.enter="handleAgentSearch"
            @clear="handleAgentFilterInput"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain :loading="agentListLoading" @click="handleAgentSearch">{{ t('common.search') }}</el-button>
          <el-button :disabled="agentListLoading" @click="handleAgentReset">{{ t('common.reset') }}</el-button>
        </el-form-item>
      </el-form>
      <div
        class="agent-table-wrap"
        v-loading="agentListLoading"
        :element-loading-text="t('common.loading')"
      >
        <el-table
          :data="agentList"
          border
          stripe
          max-height="360"
          class="agent-select-table"
          :header-cell-style="{ background: '#f5f7fa' }"
          :row-key="(row) => row.userId"
          :empty-text="t('common.noData')"
          @row-click="handleAgentRowClick"
        >
          <el-table-column width="48" align="center">
            <template #default="scope">
              <el-radio :model-value="selectedAgentUserId"
                        :value="String(scope.row.userId)"
                        @click.stop="handleAgentRowClick(scope.row)">
                <span></span>
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="userNo" :label="t('formbusiness.leaverequest.applicantUserNo')" min-width="110" align="center" />
          <el-table-column prop="userName" :label="t('formbusiness.leaverequest.agentUserName')" min-width="120" align="left" show-overflow-tooltip />
          <el-table-column prop="departmentName" :label="t('formbusiness.leaverequest.agentDepartment')" min-width="160" align="left" show-overflow-tooltip />
        </el-table>
      </div>
      <div class="agent-pagination">
        <el-pagination
          v-model:current-page="agentPagination.pageIndex"
          v-model:page-size="agentPagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="agentPagination.totalCount"
          layout="total, sizes, prev, pager, next"
          @size-change="handleAgentSizeChange"
          @current-change="handleAgentPageChange"
        />
      </div>
      <template #footer>
        <el-button @click="agentDialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :disabled="!selectedAgent" @click="confirmAgentSelect">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 驳回弹窗 -->
    <el-dialog
      v-model="rejectDialogVisible"
      :title="t('formbusiness.leaverequest.rejectDialogTitle')"
      width="580px"
      :close-on-click-modal="false"
      :append-to-body="true"
      class="modal-penetrable"
      @close="onRejectDialogClose"
    >
      <el-form ref="rejectFormRef" :model="rejectForm" :rules="rejectRules" label-width="100px">
        <el-form-item :label="t('formbusiness.leaverequest.rejectStepLabel')" prop="rejectStepId">
          <el-select
            v-model="rejectForm.rejectStepId"
            :placeholder="t('formbusiness.leaverequest.rejectStepPlaceholder')"
            class="reject-step-select"
          >
            <el-option
              v-for="step in rejectStepDropOptions"
              :key="step.stepId"
              :label="step.stepName"
              :value="step.stepId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('formbusiness.leaverequest.rejectReasonLabel')" prop="rejectReason">
          <el-input
            v-model="rejectForm.rejectReason"
            type="textarea"
            :rows="6"
            :placeholder="t('formbusiness.leaverequest.rejectReasonPlaceholder')"
            class="reject-reason-input"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="danger" @click="confirmReject">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <WorkflowDrawer
      :visible="workflowDrawerVisible"
      @update:visible="workflowDrawerVisible = $event"
      :loading="workflowDrawerLoading"
      :overview="workflowOverview"
      i18n-prefix="formbusiness.leaverequest"
    />
    </el-config-provider>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import i18n from '@/i18n'
import { ElMessage, ElNotification } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { Upload, Search, Lock } from '@element-plus/icons-vue'
import ReviewLogCard from '../components/reviewlogcard.vue'
import WorkflowDrawer from '../components/workflowdrawer.vue'
import { post, isHandled } from '@/utils/request'
import { INIT_LEAVEREQUEST_API, SAVE_LEAVEREQUEST_API, GET_LEAVEREQUEST_DETAIL_API, GET_LEAVEREQUEST_DROPDOWN_API, GET_LEAVE_BALANCES_API, VALIDATE_LEAVE_BALANCE_API, GET_DEPARTMENT_DROPDOWN_API, GET_AGENT_USER_INFO_API, UPLOAD_FILE_API, DELETE_FILE_API, GET_FULL_REVIEW_FLOW_API, GET_REJECT_STEP_DROP_API, APPROVE_LEAVEREQUEST_API, REJECT_LEAVEREQUEST_API, GET_FORM_NOTIFY_TOKEN_API } from '@/config/api/formbusiness/forms/leaverequest'
import {
  calculateLeaveTotalHours,
  calculateLeaveHoursForYear,
  isLeaveTimeRangeAllowed,
  LEAVE_WORK_TIME_OPTIONS
} from '@/utils/leaveHours'
import { resolveFileUrl, downloadFileFromUrl } from '@/utils/fileUrl'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { normalizeRouteLang, persistRouteLanguage } from '@/utils/routeLanguage'
import { getLocationQueryParam } from '@/utils/hashRouteBootstrap'

const { t, locale } = i18n.global

const elementPlusLocale = computed(() => (locale.value === 'en-US' ? en : zhCn))

const formRef = ref(null)
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(true)
const saving = ref(false)
const approving = ref(false)
const workflowDrawerVisible = ref(false)
const workflowDrawerLoading = ref(false)
const workflowOverview = reactive({
  formId: '',
  rejectCount: 0,
  stepReviewList: []
})

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
const rejectStepDropOptions = ref([])

const rejectDialogVisible = ref(false)
const rejectFormRef = ref(null)
const rejecting = ref(false)
const formActionLoading = computed(() => saving.value || approving.value || rejecting.value)
const rejectForm = reactive({
  rejectStepId: '',
  rejectReason: ''
})

const rejectRules = {
  rejectStepId: [
    { required: true, message: t('formbusiness.leaverequest.rejectStepRequired'), trigger: 'change' }
  ],
  rejectReason: [
    { required: true, message: t('formbusiness.leaverequest.rejectReasonRequired'), trigger: 'blur' }
  ]
}

const uploading = ref(false)
const uploadedAttachments = ref([])
const currentFormStatus = ref('')

const currentFormTypeId = ref('')

const form = reactive({
  formId: '',
  formNo: '',
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

const agentDialogVisible = ref(false)
const agentListLoading = ref(false)
const agentList = ref([])
const agentDepartmentOptions = ref([])
const selectedAgent = ref(null)
const selectedAgentUserId = ref('')
const agentFilters = reactive({
  departmentId: '',
  userNo: '',
  userName: ''
})
const agentPagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0
})
const AGENT_SEARCH_DEBOUNCE_MS = 300
let agentSearchTimer = null
let agentListRequestId = 0

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
const leaveBalances = ref([])
const leaveBalanceLoading = ref(false)
const leaveBalanceQueryRange = ref(['', ''])
let leaveBalanceRequestId = 0
const rules = {
  leaveType: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'change' }
  ],
  leaveTimeRange: [
    { required: true, message: t('formbusiness.validation.required'), trigger: 'change' }
  ],

  agentUserId: [
    { required: true, message: () => t('formbusiness.leaverequest.pleaseSelectAgent'), trigger: 'change' },
    { validator: validateAgentRequired, trigger: 'change' }
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

// 展示层拆分：form.leaveTimeRange 仍是 [startDateTime, endDateTime]（"YYYY-MM-DD HH:mm:ss"），
// 保存/送审时经 toISO 转 T 格式不受影响，这里拆成开始日期/时间段、结束日期/时间段四个可视化字段
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

/** 8-12 / 13-17 计工时，午休不计 */
function calculateDuration () {
  if (!form.leaveTimeRange || form.leaveTimeRange.length !== 2) {
    form.days = undefined
    return
  }
  const [startTime, endTime] = form.leaveTimeRange
  if (!startTime || !endTime) {
    form.days = undefined
    return
  }
  if (!isLeaveTimeRangeAllowed(startTime, endTime)) {
    form.days = undefined
    return
  }
  const hours = calculateLeaveTotalHours(startTime, endTime)
  form.days = coerceDays(hours)
}

function validateAgentRequired (rule, value, callback) {
  if (!isStepFieldVisible('SelectAgent') || !isStepFieldEditable('SelectAgent')) {
    callback()
    return
  }
  if (!value || !String(value).trim()) {
    callback(new Error(t('formbusiness.leaverequest.pleaseSelectAgent')))
    return
  }
  callback()
}

function normalizeFieldKey (fieldKey) {
  return String(fieldKey ?? '').replace(/\s+/g, '')
}

function handleTimeRangeChange () {
  // 仅重新计算时数，不再请求假期余额接口（避免整个余额卡片出现骨架刷新）
  calculateDuration()
  resetLeaveBalanceQueryRange(form.leaveTimeRange)
  nextTick(() => {
    formRef.value?.validateField('leaveTimeRange')
  })
}

function resetLeaveBalanceQueryRange (range) {
  if (!Array.isArray(range)) {
    leaveBalanceQueryRange.value = ['', '']
    return
  }
  leaveBalanceQueryRange.value = [
    range[0] ? String(range[0]) : '',
    range[1] ? String(range[1]) : ''
  ]
}

function getLeaveBalanceQueryRange () {
  const [formStart, formEnd] = Array.isArray(form.leaveTimeRange) ? form.leaveTimeRange : []
  const [queryStart, queryEnd] = leaveBalanceQueryRange.value
  return [
    formStart ? String(formStart) : queryStart || '',
    formEnd ? String(formEnd) : queryEnd || ''
  ]
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
  if (currentFormStatus.value === 'approved') return rawDays
  const remainingHours = rawDays * 8 - getSelectedLeaveHoursByYear(item.year)
  return remainingHours / 8
}

function isLeaveBalanceAffected (year, type) {
  if (currentFormStatus.value === 'voided') return false
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

  const years = resolveLeaveBalanceYears(getLeaveBalanceQueryRange())
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
        if (Number(res?.code) === 400) { ElMessage.warning(res.message) } else { ElMessage.error(res.message) }
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
    applyDate: resolveApplyDateFromData(data),
    applicantUserNo: data.applicantUserNo || '',
    // 详情接口回传的是 PascalCase 的 ApplicantUserName
    applicantUserName: data.applicantUserName || data.ApplicantUserName || '',
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
  const [rangeStart, rangeEnd] = form.leaveTimeRange || []
  if (rangeStart && rangeEnd) {
    calculateDuration()
  }
  currentFormStatus.value = String(data.formStatus ?? data.FormStatus ?? '').trim().toLowerCase()
  resetLeaveBalanceQueryRange(form.leaveTimeRange)
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
      formTypeId: String(currentFormTypeId.value || route.query.formTypeId || '')
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

function isStepFieldVisible (fieldKey) {
  const perm = stepFieldPermissionMap.value[normalizeFieldKey(fieldKey)]
  if (!perm) return true
  return perm.isVisible
}

function isStepFieldEditable (fieldKey) {
  const perm = stepFieldPermissionMap.value[normalizeFieldKey(fieldKey)]
  if (!perm) return true
  return perm.isEditable
}

function isAnyStepFieldVisible (fieldKeys) {
  return fieldKeys.some(key => isStepFieldVisible(key))
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

function isLeaveBalanceValidationFailedCode (code) {
  return String(code) === '402'
}

/** 暂存/送审右上角提示 */
function showFormActionNotice (message, type = 'success') {
  const text = typeof message === 'string' ? message.trim() : ''
  ElNotification({
    title: '',
    message: text || (type === 'success' ? t('common.success') : t('common.operationFailed')),
    type,
    position: 'top-right'
  })
}

function showPlainWarningMessage (message) {
  showFormActionNotice(message || t('formbusiness.leaverequest.leaveBalanceValidateFailed'), 'warning')
}

function isBadRequestResponse (res) {
  return Number(res?.code) === 400
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
  resultState.titleKey = 'formbusiness.leaverequest.forbiddenReviewTitle'
  resultState.subTitleKey = 'formbusiness.leaverequest.forbiddenReviewSubTitle'
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

/** 签核完成后关闭当前页面，并通知父页面（待审列表）刷新 */
function closeCurrentPage () {
  notifyOpenerRefreshFormPending()
  window.close()
}

/** InitLeaveRequest：返回完整实体则直接 bind，旧版仅返回 formId 时再拉详情 */
async function initLeaveRequest () {
  try {
    const formData = new window.FormData()
    formData.append('formTypeId', currentFormTypeId.value || '')

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
    formData.append('type', 'Review')
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
        if (Number(res?.code) === 400) { ElMessage.warning(res.message) } else { ElMessage.error(res.message) }
      }
      return
    }
    const data = res.data || {}
    bindFormData(data)
    if (isStepFieldVisible('Reject')) {
      await fetchRejectStepDrop()
    }
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
        if (Number(res?.code) === 400) { ElMessage.warning(res.message) } else { ElMessage.error(res.message) }
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

function buildSaveLeaveRequestPayload () {
  const [startTime, endTime] = Array.isArray(form.leaveTimeRange) ? form.leaveTimeRange : []
  const leaveReason = (form.reason || '').trim()
  const leaveType = normalizeNullableText(form.leaveType)
  const agentUserId = normalizeNullableText(form.agentUserId)
  const agentUserName = buildAgentDisplayValue(form.agentUserNo, form.agentUserName)

  return {
    formId: String(form.formId || ''),
    leaveType: leaveType || null,
    leaveReason: leaveReason || null,
    startDateTime: startTime ? toISO(startTime) : '',
    endDateTime: endTime ? toISO(endTime) : '',
    agentUserId: agentUserId || null,
    agentUserName: agentUserName || null
  }
}

async function saveLeaveRequestRequest () {
  return post(SAVE_LEAVEREQUEST_API, buildSaveLeaveRequestPayload(), {
    silentForbiddenError: false
  })
}

async function validateLeaveBalance (formId) {
  const formData = new window.FormData()
  formData.append('formId', formId)
  const res = await post(VALIDATE_LEAVE_BALANCE_API, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    silentForbiddenError: false,
    disableAutoLogout: true
  })
  if (isForbiddenCode(res?.code)) {
    showFormActionNotice(t('formbusiness.leaverequest.forbiddenResultSubTitle'), 'warning')
    return false
  }
  if (isLeaveBalanceValidationFailedCode(res?.code)) {
    showPlainWarningMessage(res?.message)
    return false
  }
  if (isSuccessCode(res?.code) && res.data === true) {
    return true
  }
  if (isBadRequestResponse(res)) {
    showFormActionNotice(res?.message || t('formbusiness.leaverequest.badRequestFallbackMessage'), 'warning')
    return false
  }
  // 请求未真正到达后端（网络异常/超时等），request.js 已提示过一次，这里不再额外弹出"余额校验未通过"造成误导
  if (isHandled(res)) {
    return false
  }
  showFormActionNotice(res?.message || t('formbusiness.leaverequest.leaveBalanceValidateFailed'), 'warning')
  return false
}

async function saveLeaveRequestBeforeSubmit () {
  const saveRes = await saveLeaveRequestRequest()
  if (isForbiddenCode(saveRes?.code)) {
    showFormActionNotice(t('formbusiness.leaverequest.forbiddenResultSubTitle'), 'warning')
    return false
  }
  // 请求未真正到达后端（网络异常/超时等），request.js 已提示过一次，不能当作保存成功放行
  if (isHandled(saveRes)) {
    return false
  }
  if (!saveRes || !isSuccessCode(saveRes.code)) {
    if (isLeaveBalanceValidationFailedCode(saveRes?.code)) {
      showPlainWarningMessage(saveRes?.message)
    } else if (isBadRequestResponse(saveRes)) {
      showFormActionNotice(saveRes?.message || t('formbusiness.leaverequest.badRequestFallbackMessage'), 'warning')
    } else {
      showFormActionNotice(saveRes?.message || t('messages.saveError'), 'warning')
    }
    return false
  }
  return true
}

async function onSubmit () {
  saving.value = true
  formRef.value?.validate(async (valid) => {
    if (!valid) { saving.value = false; return }
    try {
      const res = await saveLeaveRequestRequest()
      if (isForbiddenCode(res?.code)) {
        showFormActionNotice(t('formbusiness.leaverequest.forbiddenResultSubTitle'), 'warning')
      } else if (isHandled(res)) {
        // 请求未真正到达后端，request.js 已提示过一次
      } else if (res && isSuccessCode(res.code)) {
        // 暂存后同样执行假期余额校验，未通过时只提示校验结果（数据已保存）
        const formId = String(form.formId || '')
        if (formId && !(await validateLeaveBalance(formId))) return
        showFormActionNotice(res.message || t('messages.saveSuccess'), 'success')
      } else if (isLeaveBalanceValidationFailedCode(res?.code)) {
        showPlainWarningMessage(res?.message)
      } else if (isBadRequestResponse(res)) {
        showFormActionNotice(res?.message || t('formbusiness.leaverequest.badRequestFallbackMessage'), 'warning')
      } else {
        showFormActionNotice(res?.message || t('messages.saveError'), 'warning')
      }
    } catch {
      // ignore
    } finally {
      saving.value = false
    }
  })
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
        if (Number(res?.code) === 400) { ElMessage.warning(res?.message || t('formbusiness.leaverequest.workflowLoadFailed')) } else { ElMessage.error(res?.message || t('formbusiness.leaverequest.workflowLoadFailed')) }
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

async function openAgentPicker () {
  selectedAgent.value = null
  selectedAgentUserId.value = form.agentUserId ? String(form.agentUserId) : ''
  if (form.agentUserId) {
    selectedAgent.value = {
      userId: form.agentUserId,
      userNo: form.agentUserNo,
      userName: form.agentUserName
    }
  }
  await fetchAgentDepartmentOptions()
  const defaultDepartmentId = resolveDefaultAgentDepartmentId()
  const prefilledUserNo = normalizeNullableText(form.agentUserNo)
  Object.assign(agentFilters, {
    departmentId: prefilledUserNo ? '' : defaultDepartmentId,
    userNo: prefilledUserNo,
    userName: ''
  })
  agentPagination.pageIndex = 1
  agentDialogVisible.value = true
  await fetchAgentUserListImmediate()
}

function clearAgentSearchTimer () {
  if (agentSearchTimer) {
    clearTimeout(agentSearchTimer)
    agentSearchTimer = null
  }
}

function scheduleAgentListFetch (showLoading = true) {
  clearAgentSearchTimer()
  agentSearchTimer = setTimeout(() => {
    agentSearchTimer = null
    fetchAgentUserList(showLoading)
  }, AGENT_SEARCH_DEBOUNCE_MS)
}

function fetchAgentUserListImmediate () {
  clearAgentSearchTimer()
  return fetchAgentUserList()
}

function agentDepartmentFilterNode (value, data) {
  if (!value) return true
  return String(data?.departmentName ?? '').includes(value)
}

function findFirstEnabledDepartment (departments) {
  for (const dept of departments) {
    if (!dept?.disabled) return dept.departmentId
    if (Array.isArray(dept.departmentChildList) && dept.departmentChildList.length > 0) {
      const childResult = findFirstEnabledDepartment(dept.departmentChildList)
      if (childResult) return childResult
    }
  }
  return ''
}

function departmentExistsInTree (departments, departmentId) {
  if (!departmentId) return false
  for (const dept of departments) {
    if (String(dept?.departmentId) === String(departmentId)) return true
    if (Array.isArray(dept?.departmentChildList) && departmentExistsInTree(dept.departmentChildList, departmentId)) {
      return true
    }
  }
  return false
}

function resolveDefaultAgentDepartmentId () {
  const applicantDeptId = form.applicantDeptId ? String(form.applicantDeptId) : ''
  if (applicantDeptId && departmentExistsInTree(agentDepartmentOptions.value, applicantDeptId)) {
    return applicantDeptId
  }
  return findFirstEnabledDepartment(agentDepartmentOptions.value) || ''
}

async function fetchAgentDepartmentOptions () {
  if (agentDepartmentOptions.value.length > 0) return
  try {
    const res = await post(GET_DEPARTMENT_DROPDOWN_API, {})
    if (res?.code === 200) {
      agentDepartmentOptions.value = Array.isArray(res.data) ? res.data : []
      return
    }
    agentDepartmentOptions.value = []
    if (Number(res?.code) === 400) { ElMessage.warning(res?.message || t('formbusiness.leaverequest.getDepartmentFailed')) } else { ElMessage.error(res?.message || t('formbusiness.leaverequest.getDepartmentFailed')) }
  } catch {
    agentDepartmentOptions.value = []
    ElMessage.error(t('formbusiness.leaverequest.getDepartmentFailed'))
  }
}

function handleAgentDepartmentChange () {
  agentPagination.pageIndex = 1
  scheduleAgentListFetch(false)
}

async function fetchAgentUserList (showLoading = true) {
  const requestId = ++agentListRequestId
  if (showLoading) agentListLoading.value = true
  try {
    const res = await post(GET_AGENT_USER_INFO_API, {
      formId: String(form.formId || ''),
      departmentId: agentFilters.departmentId || '',
      userNo: agentFilters.userNo || '',
      userName: agentFilters.userName || '',
      pageIndex: String(agentPagination.pageIndex),
      pageSize: String(agentPagination.pageSize),
      totalCount: String(agentPagination.totalCount || 0)
    })
    if (requestId !== agentListRequestId) return
    if (isForbiddenCode(res?.code)) {
      showForbiddenResult()
      agentList.value = []
      agentPagination.totalCount = 0
      return
    }
    if (!res || res.code !== 200) {
      if (isBadRequestResponse(res)) {
        showBadRequestResult(res?.message)
      } else {
        if (Number(res?.code) === 400) { ElMessage.warning(res?.message || t('formbusiness.leaverequest.getAgentListFailed')) } else { ElMessage.error(res?.message || t('formbusiness.leaverequest.getAgentListFailed')) }
      }
      agentList.value = []
      agentPagination.totalCount = 0
      return
    }
    agentList.value = Array.isArray(res.data) ? res.data : []
    agentPagination.totalCount = Number(res.totalCount) || 0
  } catch {
    if (requestId !== agentListRequestId) return
    agentList.value = []
    agentPagination.totalCount = 0
    ElMessage.error(t('formbusiness.leaverequest.getAgentListFailed'))
  } finally {
    if (requestId === agentListRequestId) {
      agentListLoading.value = false
    }
  }
}

function handleAgentFilterInput () {
  agentPagination.pageIndex = 1
  scheduleAgentListFetch()
}

function handleAgentSearch () {
  agentPagination.pageIndex = 1
  fetchAgentUserListImmediate()
}

function handleAgentReset () {
  agentFilters.departmentId = resolveDefaultAgentDepartmentId()
  agentFilters.userNo = ''
  agentFilters.userName = ''
  agentPagination.pageIndex = 1
  fetchAgentUserListImmediate()
}

function handleAgentPageChange () {
  fetchAgentUserListImmediate()
}

function handleAgentSizeChange () {
  agentPagination.pageIndex = 1
  fetchAgentUserListImmediate()
}

function handleAgentRowClick (row) {
  if (!row?.userId) return
  const isSelected = String(selectedAgentUserId.value) === String(row.userId)
  if (isSelected) {
    selectedAgentUserId.value = ''
    selectedAgent.value = null
  } else {
    selectedAgentUserId.value = String(row.userId)
    selectedAgent.value = row
  }
}

function confirmAgentSelect () {
  if (!selectedAgent.value?.userId) {
    ElMessage.warning(t('formbusiness.leaverequest.pleaseSelectAgent'))
    return
  }
  form.agentUserId = String(selectedAgent.value.userId)
  form.agentUserNo = selectedAgent.value.userNo || ''
  form.agentUserName = selectedAgent.value.userName || ''
  agentDialogVisible.value = false
  formRef.value?.validateField('agentUserId')
}

function handleAgentDialogClosed () {
  clearAgentSearchTimer()
  agentListRequestId += 1
  agentListLoading.value = false
  selectedAgent.value = null
  selectedAgentUserId.value = ''
  agentList.value = []
}

onUnmounted(() => {
  clearAgentSearchTimer()
})

async function fetchRejectStepDrop () {
  const formId = String(form.formId || '')
  if (!formId) return false
  try {
    const formData = new window.FormData()
    formData.append('formId', formId)
    const res = await post(GET_REJECT_STEP_DROP_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      silentForbiddenError: false
    })
    if (isForbiddenCode(res?.code)) {
      showForbiddenResult()
      return false
    }
    if (!res || res.code !== 200) {
      if (isBadRequestResponse(res)) {
        showBadRequestResult(res?.message)
      } else {
        if (Number(res?.code) === 400) { ElMessage.warning(res?.message || t('formbusiness.messages.loadError')) } else { ElMessage.error(res?.message || t('formbusiness.messages.loadError')) }
      }
      rejectStepDropOptions.value = []
      return false
    }
    rejectStepDropOptions.value = Array.isArray(res.data) ? res.data : []
    return true
  } catch {
    rejectStepDropOptions.value = []
    ElMessage.error(t('formbusiness.messages.loadError'))
    return false
  }
}

function onReject () {
  const formId = String(form.formId || '')
  if (!formId) {
    ElMessage.warning(t('formbusiness.leaverequest.workflowNeedFormId'))
    return
  }
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
    ElMessage.warning(t('formbusiness.leaverequest.workflowNeedFormId'))
    return
  }

  const rejectStepId = rejectForm.rejectStepId
  const rejectReason = rejectForm.rejectReason
  rejectDialogVisible.value = false
  await nextTick()

  rejecting.value = true
  try {
    const res = await post(REJECT_LEAVEREQUEST_API, {
      formId,
      rejectStepId,
      comment: rejectReason
    }, { silentForbiddenError: false })

    if (isForbiddenCode(res?.code)) {
      showForbiddenResult()
      return
    }
    if (res && isSuccessCode(res.code)) {
      showResult('success', 'formbusiness.leaverequest.rejectResultTitle', 'formbusiness.leaverequest.rejectResultSubTitle')
      return
    }
    if (isBadRequestResponse(res)) {
      showBadRequestResult(res?.message)
      return
    }
    ElNotification({ title: '', message: res?.message || t('formbusiness.leaverequest.rejectFailed'), type: 'error' })
  } catch {
    ElNotification({ title: '', message: t('formbusiness.leaverequest.rejectFailed'), type: 'error' })
  } finally {
    rejecting.value = false
  }
}

/** 送审：暂存 → 余额验证 → 送审 */
async function onSubmitForApproval () {
  const valid = await new Promise((resolve) => {
    formRef.value?.validate((v) => resolve(!!v))
  })
  if (!valid) return
  if (shouldRequireAttachment() && uploadedAttachments.value.length === 0) {
    showFormActionNotice(getAttachmentRequirementTip(), 'warning')
    return
  }
  const formId = String(form.formId || '')
  if (!formId) {
    showFormActionNotice(t('formbusiness.leaverequest.workflowNeedFormId'), 'warning')
    return
  }
  approving.value = true
  try {
    const saved = await saveLeaveRequestBeforeSubmit()
    if (!saved) return

    const balanceValid = await validateLeaveBalance(formId)
    if (!balanceValid) return

    const res = await post(APPROVE_LEAVEREQUEST_API, {
      formId,
      rejectStepId: '0',
      comment: approvalComment.value || ''
    }, {
      silentForbiddenError: false,
      silentAuthError: false,
      disableAutoLogout: true
    })
    if (isLeaveBalanceValidationFailedCode(res?.code)) {
      showPlainWarningMessage(res?.message)
      return
    }
    if (isForbiddenCode(res?.code)) {
      showFormActionNotice(t('formbusiness.leaverequest.forbiddenResultSubTitle'), 'warning')
      return
    }
    if (isHandled(res)) {
      return
    }
    if (res && isSuccessCode(res.code)) {
      showResult('success', 'formbusiness.leaverequest.approvalResultTitle', 'formbusiness.leaverequest.approvalResultSubTitle')
      return
    }
    if (isBadRequestResponse(res)) {
      showFormActionNotice(res?.message || t('formbusiness.leaverequest.badRequestFallbackMessage'), 'warning')
      return
    }
    showFormActionNotice(res?.message || t('formbusiness.leaverequest.submitFailed'), 'warning')
  } catch {
    // ignore
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
  return key ? t(`formbusiness.leaverequest.${key}`) : ''
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
  } catch {
    // ignore
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
  downloadFileFromUrl(url, getAttachmentName(file))
}

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
      ElMessage({ message: res?.message || t('formbusiness.leaverequest.deleteFailed'), type: 'error', plain: true, showClose: true })
    }
  } catch {
    ElMessage({ message: t('formbusiness.leaverequest.deleteFailed'), type: 'error', plain: true, showClose: true })
  }
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

/** token 换会话并同步 userStore（仅设 loginNo，不设 userId） */
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
        if (Number(res?.code) === 400) { ElMessage.warning(res?.message || t('formbusiness.messages.loadError')) } else { ElMessage.error(res?.message || t('formbusiness.messages.loadError')) }
      }
      return null
    }
    const data = res.data || {}
    const formId = data.formId ? String(data.formId) : null
    if (!formId) return null

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
    await syncRouteLanguage()
    loading.value = true

    currentFormTypeId.value = String(route.query.formTypeId || '')

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

.result-back-link {
  display: inline-block;
  margin-top: 16px;
  color: var(--el-color-primary);
  cursor: pointer;
  font-size: 14px;
  letter-spacing: 0.5px;
}
.result-back-link:hover {
  opacity: 0.75;
}

.basic-info-row .el-form-item {
  margin-bottom: 0;
}

/* 附件、送审意见的内容较高，标签顶部对齐，与上一行的间距同「事由」保持一致 */
.attachment-row :deep(.el-form-item),
.approval-comment-row :deep(.el-form-item) {
  align-items: flex-start;
}

/* 送审意见上方的分割线：上下留白严格各 24px。
   前面是普通表单行时，表单项自带 18px 下边距，补 6px； */
.approval-divider {
  margin: 6px 0 24px;
}

.attachment-row :deep(.el-form-item__label),
.approval-comment-row :deep(.el-form-item__label) {
  min-height: 32px;
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
  overflow-y: scroll;
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
  justify-content: space-between;
  gap: 16px;
  margin: 24px 0 18px 100px;
}

.sk-actions-buttons {
  display: flex;
  gap: 12px;
}

.sk-action-btn {
  width: 80px;
  height: 32px;
  border-radius: 16px;
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

.review-log-card.leave-form-card {
  margin-top: 10px;
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


.leave-form :deep(.el-select) {
  width: 100%;
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

.agent-field-control {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.agent-field-control .el-input {
  flex: 1;
  min-width: 0;
}

/* 按钮移到输入框右侧外部，保持输入框与请假类别框等宽 */
.agent-picker-btn {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  padding: 0;
}

.agent-filter-form {
  margin-bottom: 12px;
}

.agent-select-table :deep(.el-radio) {
  height: auto;
  margin-right: 0;
}

.agent-filter-form .agent-filter-dept-select {
  width: 240px;
}

.agent-filter-form .agent-filter-input-userno {
  width: 155px;
}

.agent-filter-form .agent-filter-input-compact {
  width: 168px;
}

.agent-table-wrap {
  position: relative;
  min-height: 360px;
}

.agent-select-table {
  width: 100%;
}

.agent-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.modal-penetrable :deep(.el-overlay) {
  background-color: rgba(0, 0, 0, 0.25);
}

.reject-step-select {
  width: 260px;
  max-width: 100%;
}

.reject-reason-input {
  width: 100%;
}

</style>
