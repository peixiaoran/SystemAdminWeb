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

              <!-- 原请假单引用：选择按钮 + 引用表格 -->
              <div class="sk-field sk-field--top">
                <el-skeleton-item variant="text" class="sk-label" />
                <el-skeleton-item variant="text" class="sk-block" />
              </div>

              <!-- 销假时间 / 销假时数 -->
              <div class="sk-field">
                <el-skeleton-item variant="text" class="sk-label" />
                <el-skeleton-item variant="text" class="sk-control" />
              </div>

              <div class="sk-divider"></div>

              <!-- 送审意见 -->
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

    <!-- 结果页 -->
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
        <p class="forbidden-result__eyebrow">{{ t('formbusiness.leavecancell.forbiddenReviewEyebrow') }}</p>
        <h2 class="forbidden-result__title">{{ t('formbusiness.leavecancell.forbiddenReviewTitle') }}</h2>
        <p class="forbidden-result__desc">{{ t('formbusiness.leavecancell.forbiddenReviewSubTitle') }}</p>
        <span class="result-back-link" @click="closeCurrentPage">[ {{ t('formbusiness.leavecancell.backToFormPending') }} ]</span>
      </div>
      <el-result
        v-else
        class="result-content"
        :class="{ 'result-content--bad-request': resultState.variant === 'badRequest' }"
        :icon="resultState.status"
        :title="resultState.variant === 'badRequest' ? resultState.detailMessage : t(resultState.titleKey)"
      >
        <template #sub-title>
          <p v-if="resultState.variant === 'badRequest'" class="leavecancell-bad-request-desc">
            {{ t('formbusiness.leavecancell.badRequestHint') }}
          </p>
          <span v-else>{{ t(resultState.subTitleKey) }}</span>
        </template>
        <template #extra>
          <span class="result-back-link" @click="closeCurrentPage">[ {{ t('formbusiness.leavecancell.backToFormPending') }} ]</span>
        </template>
      </el-result>
    </el-card>

    <template v-else>
    <el-card class="leave-form-card" shadow="never">
      <div class="form-title-row">
        <h2 class="form-title">{{ t('formbusiness.leavecancell.formTitle') }}</h2>
      </div>
      <el-divider style="margin: 22px 0;"></el-divider>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="leave-form" :validate-on-rule-change="false">

        <!-- 基本信息 -->
        <el-row v-if="isAnyStepFieldVisible(['FormNo', 'ApplyDate'])" :gutter="16" class="basic-info-row" style="justify-content: flex-start;">
          <el-col v-if="isStepFieldVisible('FormNo')" :span="8">
            <el-form-item :label="t('formbusiness.leavecancell.formNo')" prop="formNo">
              <el-input v-model="form.formNo" :disabled="!isStepFieldEditable('FormNo')" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('ApplyDate')" :span="8">
            <el-form-item :label="t('formbusiness.leavecancell.applyDate')" prop="applyDate">
              <el-date-picker
                v-model="form.applyDate"
                type="date"
                value-format="YYYY-MM-DD"
                :placeholder="t('formbusiness.leavecancell.pleaseSelectApplyDate')"
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
            <el-form-item :label="t('formbusiness.leavecancell.applicantUserNo')" prop="applicantUserNo">
              <el-input v-model="form.applicantUserNo" :disabled="!isStepFieldEditable('UserNo')" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('UserName')" :span="8">
            <el-form-item :label="t('formbusiness.leavecancell.applicantUserName')" prop="applicantUserName">
              <el-input v-model="form.applicantUserName" :disabled="!isStepFieldEditable('UserName')" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('Department')" :span="8">
            <el-form-item :label="t('formbusiness.leavecancell.applicantDeptName')" prop="applicantDeptName">
              <el-input v-model="form.applicantDeptName" :disabled="!isStepFieldEditable('Department')" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider v-if="isAnyStepFieldVisible(['FormNo', 'ApplyDate', 'UserNo', 'UserName', 'Department'])"></el-divider>

        <!-- 原请假单引用 -->
        <template v-if="isAnyStepFieldVisible(['SelectLeaveRequest', 'LeaveRequestTable', 'TimePeriod', 'Hour'])">
          <el-row v-if="isAnyStepFieldVisible(['SelectLeaveRequest', 'LeaveRequestTable'])" :gutter="16" class="leave-request-ref-row">
            <el-col v-if="isAnyStepFieldVisible(['SelectLeaveRequest', 'LeaveRequestTable'])" :span="24">
              <el-form-item :label="t('formbusiness.leavecancell.leaveRequestFormNo')">
                <div v-if="isStepFieldVisible('SelectLeaveRequest')" class="leave-request-table-toolbar">
                  <el-button
                    plain
                    size="small"
                    class="leave-request-ref-btn"
                    :disabled="!isStepFieldEditable('SelectLeaveRequest')"
                    :title="t('formbusiness.leavecancell.selectLeaveRequest')"
                    :aria-label="t('formbusiness.leavecancell.selectLeaveRequest')"
                    @click="openLeaveRequestPicker"
                  >
                    <el-icon><Search /></el-icon>
                  </el-button>
                </div>
                <el-table v-if="isStepFieldVisible('LeaveRequestTable')" :data="selectedLeaveRequest ? [selectedLeaveRequest] : []" border size="small" class="leave-request-ref-table" :empty-text="t('common.noData')">
                  <el-table-column prop="leaveRequestNo" :label="t('formbusiness.leavecancell.leaveRequestNoColumn')" min-width="120" align="center" />
                  <el-table-column prop="leaveType" :label="t('formbusiness.leavecancell.leaveTypeColumn')" min-width="100" align="center" />
                  <el-table-column :label="t('formbusiness.leavecancell.leaveTimeRangeColumn')" min-width="260" align="center">
                    <template #default="{ row }">{{ formatDateTimeCell(row.startDateTime) }} ~ {{ formatDateTimeCell(row.endDateTime) }}</template>
                  </el-table-column>
                  <el-table-column :label="t('formbusiness.leavecancell.leaveHoursColumn')" width="90" align="center" class-name="ref-leave-hours-col">
                    <template #default="{ row }">{{ formatHoursCell(row.leaveHours) }}</template>
                  </el-table-column>
                  <el-table-column v-if="isStepFieldVisible('SelectLeaveRequest')" :label="t('common.operation')" width="90" align="center">
                    <template #default>
                      <el-button
                        link
                        size="small"
                        class="leave-request-remove-btn"
                        :loading="leaveRequestRemoveLoading"
                        :disabled="!isStepFieldEditable('SelectLeaveRequest')"
                        @click="removeSelectedLeaveRequest"
                      >{{ t('common.delete') }}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="isAnyStepFieldVisible(['TimePeriod', 'Hour'])" :gutter="16">
            <el-col :span="24" class="cancel-time-hours-row">
              <el-form-item
                v-if="isStepFieldVisible('TimePeriod')"
                :label="t('formbusiness.leavecancell.cancelTimeRange')"
                prop="cancelTimeRange"
                class="cancel-time-range-item"
              >
                <div class="leave-time-range-fields">
                  <el-date-picker
                    v-model="cancelStartDate"
                    type="date"
                    value-format="YYYY-MM-DD"
                    :placeholder="t('formbusiness.leavecancell.pleaseSelectStartDate')"
                    :clearable="false"
                    :disabled-date="isCancelDateDisabled"
                    :disabled="!isStepFieldEditable('TimePeriod')"
                    class="leave-date-picker"
                    style="width: 160px; flex: 0 0 160px;"
                    @change="handleCancelTimeRangeChange"
                  />
                  <el-select
                    v-model="cancelStartTimeOfDay"
                    :placeholder="t('formbusiness.leavecancell.pleaseSelectStartTime')"
                    :clearable="false"
                    :disabled="!isStepFieldEditable('TimePeriod')"
                    class="leave-time-of-day-select"
                    style="width: 130px; flex: 0 0 130px;"
                    @change="handleCancelTimeRangeChange"
                  >
                    <el-option v-for="time in LEAVE_WORK_TIME_OPTIONS" :key="time" :label="time" :value="time" />
                  </el-select>
                  <span class="leave-time-range-separator"> ~ </span>
                  <el-date-picker
                    v-model="cancelEndDate"
                    type="date"
                    value-format="YYYY-MM-DD"
                    :placeholder="t('formbusiness.leavecancell.pleaseSelectEndDate')"
                    :clearable="false"
                    :disabled-date="isCancelDateDisabled"
                    :disabled="!isStepFieldEditable('TimePeriod')"
                    class="leave-date-picker"
                    style="width: 160px; flex: 0 0 160px;"
                    @change="handleCancelTimeRangeChange"
                  />
                  <el-select
                    v-model="cancelEndTimeOfDay"
                    :placeholder="t('formbusiness.leavecancell.pleaseSelectEndTime')"
                    :clearable="false"
                    :disabled="!isStepFieldEditable('TimePeriod')"
                    class="leave-time-of-day-select"
                    style="width: 130px; flex: 0 0 130px;"
                    @change="handleCancelTimeRangeChange"
                  >
                    <el-option v-for="time in LEAVE_WORK_TIME_OPTIONS" :key="time" :label="time" :value="time" />
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item
                v-if="isStepFieldVisible('Hour')"
                :label="t('formbusiness.leavecancell.cancelHours')"
                label-width="auto"
                class="cancel-hours-item"
              >
                <el-input-number
                  v-model="form.cancelHours"
                  class="leave-hours-input"
                  :min="0"
                  :step="0.01"
                  :precision="2"
                  :controls="false"
                  style="width: 110px;"
                  :disabled="!isStepFieldEditable('Hour')"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 上方还有表单项自带的 18px 下边距，6px 上边距使分割线到销假时间与到销假原因的距离一致（均 24px） -->
          <el-divider style="margin: 6px 0 24px;"></el-divider>
        </template>

        <el-row v-if="isStepFieldVisible('Comments')" :gutter="16" class="approval-comment-row">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.leavecancell.approvalComment')">
              <el-input
                v-model="approvalComment"
                type="textarea"
                :rows="3"
                :placeholder="t('formbusiness.leavecancell.approvalCommentPlaceholder')"
                :disabled="!isStepFieldEditable('Comments')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item class="form-actions-form-item">
              <div class="form-actions-row">
                <div class="form-actions-buttons">
                  <el-button v-if="isStepFieldVisible('Save')" type="primary" round style="width:80px;" @click="onSubmit" :loading="saving" :disabled="formActionLoading || !isStepFieldEditable('Save')">{{ t('formbusiness.leavecancell.saveButton') }}</el-button>
                  <el-button v-if="isStepFieldVisible('Submit')" type="success" round style="width:80px;" @click="onSubmitForApproval" :loading="approving" :disabled="formActionLoading || !isStepFieldEditable('Submit')">{{ t('formbusiness.leavecancell.submitButton') }}</el-button>
                  <el-button v-if="isStepFieldVisible('Reject')" type="danger" round style="width:80px;" @click="onReject" :disabled="formActionLoading || !isStepFieldEditable('Reject')">{{ t('formbusiness.leavecancell.rejectButton') }}</el-button>
                </div>
                <div class="workflow-view-entry">
                  <div class="workflow-view-hint">
                    <span class="workflow-view-hint-text">{{ t('formbusiness.leavecancell.viewFullWorkflowHint') }}</span>
                  </div>
                  <el-tooltip :content="t('formbusiness.leavecancell.viewFullWorkflow')" placement="top">
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

    <!-- 审批记录 -->
    <ReviewLogCard :records="reviewRecordList" i18n-prefix="formbusiness.leavecancell" :show-user-sub-row="false" />

    </template>

    <!-- 选择请假单弹窗 -->
    <el-dialog
      v-model="leaveRequestDialogVisible"
      :title="t('formbusiness.leavecancell.selectLeaveRequestTitle')"
      width="1050px"
      :close-on-click-modal="false"
      :append-to-body="true"
      destroy-on-close
      @closed="handleLeaveRequestDialogClosed"
    >
      <el-form :inline="true" class="leave-request-filter-form">
        <el-form-item :label="t('formbusiness.leavecancell.leaveRequestNoColumn')">
          <el-input
            v-model="leaveRequestFilters.leaveRequestNo"
            clearable
            class="leave-request-filter-no"
            :placeholder="t('formbusiness.leavecancell.leaveRequestNoColumn')"
            @keyup.enter="handleLeaveRequestSearch"
            @clear="handleLeaveRequestSearch"
          />
        </el-form-item>
        <el-form-item :label="t('formbusiness.leavecancell.leaveRequestDateRange')">
          <el-date-picker
            v-model="leaveRequestFilters.dateRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            range-separator="-"
            class="leave-request-filter-date"
            :clearable="false"
            :start-placeholder="t('formbusiness.leavecancell.pleaseSelectStartTime')"
            :end-placeholder="t('formbusiness.leavecancell.pleaseSelectEndTime')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain :loading="leaveRequestListLoading" @click="handleLeaveRequestSearch">{{ t('common.search') }}</el-button>
          <el-button :disabled="leaveRequestListLoading" @click="handleLeaveRequestReset">{{ t('common.reset') }}</el-button>
        </el-form-item>
      </el-form>
      <div
        class="leave-request-table-wrap"
        v-loading="leaveRequestListLoading"
        :element-loading-text="t('common.loading')"
      >
        <el-table
          ref="leaveRequestTableRef"
          :data="leaveRequestList"
          border
          stripe
          max-height="360"
          class="leave-request-select-table"
          :header-cell-style="{ background: '#f5f7fa' }"
          :row-key="(row) => row.leaveRequestId"
          :empty-text="t('common.noData')"
          @selection-change="handleLeaveRequestTableSelectionChange"
          @row-click="handleLeaveRequestRowClick"
        >
          <el-table-column type="selection" width="48" align="center" />
          <el-table-column prop="leaveRequestNo" :label="t('formbusiness.leavecancell.leaveRequestNoColumn')" min-width="120" align="center" />
          <el-table-column prop="leaveType" :label="t('formbusiness.leavecancell.leaveTypeColumn')" min-width="100" align="center" />
          <el-table-column :label="t('formbusiness.leavecancell.startDateTimeColumn')" min-width="130" align="center">
            <template #default="{ row }">{{ formatDateTimeCell(row.startDateTime) }}</template>
          </el-table-column>
          <el-table-column :label="t('formbusiness.leavecancell.endDateTimeColumn')" min-width="130" align="center">
            <template #default="{ row }">{{ formatDateTimeCell(row.endDateTime) }}</template>
          </el-table-column>
          <el-table-column prop="leaveHours" :label="t('formbusiness.leavecancell.leaveHoursColumn')" width="90" align="center" />
          <el-table-column prop="applicantDate" :label="t('formbusiness.leavecancell.applicantDateColumn')" width="150" align="center" />
        </el-table>
      </div>
      <div class="leave-request-pagination">
        <el-pagination
          v-model:current-page="leaveRequestPagination.pageIndex"
          v-model:page-size="leaveRequestPagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="leaveRequestPagination.totalCount"
          layout="total, sizes, prev, pager, next"
          @size-change="handleLeaveRequestSizeChange"
          @current-change="handleLeaveRequestPageChange"
        />
      </div>
      <template #footer>
        <el-button @click="leaveRequestDialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="leaveRequestConfirmLoading" :disabled="!selectedLeaveRequestRow" @click="confirmLeaveRequestSelect">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 驳回弹窗 -->
    <el-dialog
      v-model="rejectDialogVisible"
      :title="t('formbusiness.leavecancell.rejectDialogTitle')"
      width="580px"
      :close-on-click-modal="false"
      :append-to-body="true"
      class="modal-penetrable"
      @close="onRejectDialogClose"
    >
      <el-form ref="rejectFormRef" :model="rejectForm" :rules="rejectRules" label-width="100px">
        <el-form-item :label="t('formbusiness.leavecancell.rejectStepLabel')" prop="rejectStepId">
          <el-select
            v-model="rejectForm.rejectStepId"
            :placeholder="t('formbusiness.leavecancell.rejectStepPlaceholder')"
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
        <el-form-item :label="t('formbusiness.leavecancell.rejectReasonLabel')" prop="rejectReason">
          <el-input
            v-model="rejectForm.rejectReason"
            type="textarea"
            :rows="6"
            :placeholder="t('formbusiness.leavecancell.rejectReasonPlaceholder')"
            class="reject-reason-input"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="danger" @click="confirmReject">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 完整审批流程 -->
    <WorkflowDrawer
      :visible="workflowDrawerVisible"
      @update:visible="workflowDrawerVisible = $event"
      :loading="workflowDrawerLoading"
      :overview="workflowOverview"
      i18n-prefix="formbusiness.leavecancell"
      :show-agent-info="false"
    />
    </el-config-provider>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, nextTick } from 'vue'
import i18n from '@/i18n'
import { ElMessage, ElNotification } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { Lock, Search } from '@element-plus/icons-vue'
import ReviewLogCard from '../components/reviewlogcard.vue'
import WorkflowDrawer from '../components/workflowdrawer.vue'
import { post, isHandled } from '@/utils/request'
import {
  INIT_LEAVECANCELL_API,
  GET_LEAVEREQUEST_VIEW_API,
  GET_LEAVEREQUEST_DETAIL_API,
  GET_LEAVECANCELL_API,
  SAVE_LEAVECANCELL_API,
  VALIDATE_LEAVECANCELL_API,
  GET_FULL_REVIEW_FLOW_API,
  GET_REJECT_STEP_DROP_API,
  APPROVE_LEAVECANCELL_API,
  REJECT_LEAVECANCELL_API
} from '@/config/api/formbusiness/forms/leavecancell'
import { calculateLeaveTotalHours, isLeaveTimeRangeAllowed, LEAVE_WORK_TIME_OPTIONS } from '@/utils/leaveHours'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const { t, locale } = i18n.global

const elementPlusLocale = computed(() => (locale.value === 'en-US' ? en : zhCn))

const formRef = ref(null)
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(true)
const saving = ref(false)
const approving = ref(false)
const rejecting = ref(false)
const formActionLoading = computed(() => saving.value || approving.value || rejecting.value)

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
  titleKey: 'formbusiness.leavecancell.approvalResultTitle',
  subTitleKey: 'formbusiness.leavecancell.approvalResultSubTitle'
})

const approvalComment = ref('')
const reviewRecordList = ref([])
const stepFieldPermissionMap = ref({})
const rejectStepDropOptions = ref([])

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
  leaveRequestId: '',
  cancelTimeRange: [],
  cancelHours: undefined
})

// leaveRequestId 无实际输入控件承载，不接入 el-form 的 prop/rules 校验体系（避免字段下方常驻红字），
// 是否已选请假单改为暂存/送审时手动判断，见 onSubmit / onSubmitForApproval
// cancelTimeRange 的业务性校验（时间过早/过晚、超出可销时数等）统一交给后端 ValidateLeaveCancell 接口
const rules = {
  cancelTimeRange: [
    // type: 'array' 必须显式声明，否则 async-validator 不会把空数组 [] 判为空值
    { required: true, type: 'array', message: t('formbusiness.validation.required'), trigger: 'blur' }
  ]
}

const leaveRequestRemoveLoading = ref(false)

// 请假单选择弹窗
const leaveRequestDialogVisible = ref(false)
const leaveRequestListLoading = ref(false)
const leaveRequestList = ref([])
const leaveRequestTableRef = ref(null)
const isAdjustingLeaveRequestSelection = ref(false)
const selectedLeaveRequestRow = ref(null)
const selectedLeaveRequestRowId = ref('')
const selectedLeaveRequest = ref(null)
const leaveRequestConfirmLoading = ref(false)
const leaveRequestFilters = reactive({
  leaveRequestNo: '',
  dateRange: []
})
const leaveRequestPagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0
})
let leaveRequestListRequestId = 0

const rejectDialogVisible = ref(false)
const rejectFormRef = ref(null)
const rejectForm = reactive({
  rejectStepId: '',
  rejectReason: ''
})
const rejectRules = {
  rejectStepId: [
    { required: true, message: t('formbusiness.leavecancell.rejectStepRequired'), trigger: 'change' }
  ],
  rejectReason: [
    { required: true, message: t('formbusiness.leavecancell.rejectReasonRequired'), trigger: 'blur' }
  ]
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
        if (Number(res?.code) === 400) { ElMessage.warning(res?.message || t('formbusiness.leavecancell.workflowLoadFailed')) } else { ElMessage.error(res?.message || t('formbusiness.leavecancell.workflowLoadFailed')) }
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
    ElMessage.error(t('formbusiness.leavecancell.workflowLoadFailed'))
  } finally {
    workflowDrawerLoading.value = false
  }
}

function openWorkflowDrawer () {
  if (!form.formId) {
    ElMessage.warning(t('formbusiness.leavecancell.workflowNeedFormId'))
    return
  }
  workflowDrawerVisible.value = true
  fetchFullReviewFlow()
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
    const msMatch = s.match(/\/Date\((\d+)\)\//)
    if (msMatch) {
      d = new Date(Number(msMatch[1]))
    } else {
      d = new Date(s.replace('T', ' ').replace(/Z$/, ''))
    }
  }
  if (!d || isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function formatDateTimeCell (val) {
  return normalizeDateTime(val) || '-'
}

/** 时数保留两位小数展示 */
function formatHoursCell (val) {
  if (val === undefined || val === null || val === '') return '-'
  const n = Number(val)
  return Number.isFinite(n) ? n.toFixed(2) : '-'
}

function toISO (str) {
  return typeof str === 'string' ? str.replace(' ', 'T') : str
}

function formatDateTimeValue (date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function resolveCancelTimeRangeFromData (data) {
  const start = normalizeDateTime(data.startDateTime)
  const end = normalizeDateTime(data.endDateTime)
  if (!start || !end) return []
  return [start, end]
}

function resolveCancelHoursFromData (data) {
  const val = data.cancellHours
  if (val === undefined || val === null || val === '') return undefined
  const n = Number(val)
  return Number.isFinite(n) ? n : undefined
}

/** 请假信息表格数据：优先使用 GetLeaveRequestDetail 返回值 */
async function fetchLeaveRequestDetail (leaveRequestId) {
  if (!leaveRequestId) return null
  try {
    const res = await post(
      GET_LEAVEREQUEST_DETAIL_API,
      new URLSearchParams({ leaveRequestId: String(leaveRequestId) }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )
    if (!res || res.code !== 200) return null
    return res.data || null
  } catch {
    return null
  }
}

async function bindFormData (data) {
  Object.assign(form, {
    formId: data.formId != null ? String(data.formId) : '',
    formNo: data.formNo || '',
    formStatus: data.formStatus || '',
    applyDate: data.applicantDate || '',
    applicantUserNo: data.applicantUserNo || '',
    applicantUserName: data.applicantUserName || '',
    applicantDeptName: data.applicantDeptName || '',
    leaveRequestId: data.leaveRequestId != null ? String(data.leaveRequestId) : '',
    cancelTimeRange: resolveCancelTimeRangeFromData(data),
    cancelHours: resolveCancelHoursFromData(data)
  })

  if (data.leaveRequestId) {
    const detail = await fetchLeaveRequestDetail(data.leaveRequestId)
    selectedLeaveRequest.value = {
      leaveRequestId: detail?.leaveRequestId ?? data.leaveRequestId,
      leaveRequestNo: detail?.leaveRequestNo || data.leaveRequestNo || '',
      leaveType: detail?.leaveTypeName || detail?.leaveType || '',
      startDateTime: detail?.startDateTime ?? data.leaveStartDateTime,
      endDateTime: detail?.endDateTime ?? data.leaveEndDateTime,
      leaveHours: detail?.leaveHours ?? data.leaveHours,
      cancellableHours: undefined
    }
  }

  const reviewRecords = data.reviewRecord
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

  if (form.formId) {
    const nextQuery = {
      ...route.query,
      formId: String(form.formId)
    }
    router.replace({ path: route.path, query: nextQuery })
  }
}

async function getLeaveCancellDetail (formId) {
  try {
    const res = await post(
      GET_LEAVECANCELL_API,
      new URLSearchParams({ formId: String(formId || ''), type: 'Review' }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        silentForbiddenError: false
      }
    )
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
    await bindFormData(res.data || {})
    if (isStepFieldVisible('Reject')) {
      await fetchRejectStepDrop()
    }
  } catch {
    // ignore
  }
}

/** InitLeaveCancell：新建销假单初始化。返回完整实体则直接 bind，仅返回 formId 时再拉详情 */
async function initLeaveCancell () {
  try {
    const res = await post(
      INIT_LEAVECANCELL_API,
      new URLSearchParams({ formTypeId: String(route.query.formTypeId || '') }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        silentForbiddenError: false
      }
    )
    if (isForbiddenCode(res?.code)) {
      showForbiddenResult()
      return
    }
    if (!res || res.code !== 200) {
      if (isBadRequestResponse(res)) {
        showBadRequestResult(res?.message)
      } else if (res?.message) {
        if (Number(res?.code) === 400) { ElMessage.warning(res.message) } else { ElMessage.error(res.message) }
      }
      return
    }
    const raw = res.data
    if (raw == null) return
    if (typeof raw === 'object' && !Array.isArray(raw)) {
      await bindFormData(raw)
      return
    }
    const newFormId = String(raw)
    form.formId = newFormId
    await getLeaveCancellDetail(newFormId)
  } catch {
    // ignore
  }
}

function getOriginalLeaveStart () {
  if (!selectedLeaveRequest.value) return null
  const iso = normalizeDateTime(selectedLeaveRequest.value.startDateTime)
  const d = iso ? new Date(toISO(iso)) : null
  return d && !isNaN(d.getTime()) ? d : null
}

function getOriginalLeaveEnd () {
  if (!selectedLeaveRequest.value) return null
  const iso = normalizeDateTime(selectedLeaveRequest.value.endDateTime)
  const d = iso ? new Date(toISO(iso)) : null
  return d && !isNaN(d.getTime()) ? d : null
}

/** 本年度起点（1月1日 08:00），销假开始时间不得早于该时间 */
function getCurrentYearWorkStart () {
  const now = new Date()
  return new Date(now.getFullYear(), 0, 1, 8, 0, 0)
}

/** 销假开始时间下限：原请假开始时间与本年度起点中较晚者（去年及更早的请假时段不可销假） */
function getMinCancelStartDateTime () {
  const originalStart = getOriginalLeaveStart()
  const yearStart = getCurrentYearWorkStart()
  if (originalStart && originalStart > yearStart) return originalStart
  return yearStart
}

/** 销假结束时间上限：不得超过原请假单结束时间 */
function getMaxCancelEndDateTime () {
  return getOriginalLeaveEnd()
}

function isCancelDateDisabled (date) {
  // 是否选择请假单不再影响日期可选性，仅在有原请假单时按其时间范围限制；未选择时不限制，交由暂存/送审时的校验提示
  if (!selectedLeaveRequest.value) return false
  const min = getMinCancelStartDateTime()
  const max = getMaxCancelEndDateTime()
  if (!min || !max) return false
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const minDay = new Date(min.getFullYear(), min.getMonth(), min.getDate())
  const maxDay = new Date(max.getFullYear(), max.getMonth(), max.getDate())
  return d < minDay || d > maxDay
}

// 展示层拆分：form.cancelTimeRange 仍是 [startDateTime, endDateTime]（"YYYY-MM-DD HH:mm:ss"），
// 保存/送审时经 toISO 转 T 格式不受影响，这里拆成开始日期/时间段、结束日期/时间段四个可视化字段
const CANCEL_DEFAULT_START_TIME = '08:00'
const CANCEL_DEFAULT_END_TIME = '17:00'

function splitCancelDateTime (val) {
  if (!val) return { date: '', time: '' }
  const s = String(val)
  const spaceIdx = s.indexOf(' ')
  if (spaceIdx === -1) return { date: s, time: '' }
  return { date: s.slice(0, spaceIdx), time: s.slice(spaceIdx + 1, spaceIdx + 6) }
}

function setCancelStart (date, time) {
  const end = Array.isArray(form.cancelTimeRange) ? (form.cancelTimeRange[1] || '') : ''
  const start = date ? `${date} ${time}:00` : ''
  form.cancelTimeRange = (start || end) ? [start, end] : []
}

function setCancelEnd (date, time) {
  const start = Array.isArray(form.cancelTimeRange) ? (form.cancelTimeRange[0] || '') : ''
  const end = date ? `${date} ${time}:00` : ''
  form.cancelTimeRange = (start || end) ? [start, end] : []
}

const cancelStartDate = computed({
  get () {
    const [start] = Array.isArray(form.cancelTimeRange) ? form.cancelTimeRange : []
    return splitCancelDateTime(start).date
  },
  set (val) {
    setCancelStart(val, cancelStartTimeOfDay.value)
  }
})

const cancelStartTimeOfDay = computed({
  get () {
    const [start] = Array.isArray(form.cancelTimeRange) ? form.cancelTimeRange : []
    return splitCancelDateTime(start).time || CANCEL_DEFAULT_START_TIME
  },
  set (val) {
    setCancelStart(cancelStartDate.value, val)
  }
})

const cancelEndDate = computed({
  get () {
    const [, end] = Array.isArray(form.cancelTimeRange) ? form.cancelTimeRange : []
    return splitCancelDateTime(end).date
  },
  set (val) {
    setCancelEnd(val, cancelEndTimeOfDay.value)
  }
})

const cancelEndTimeOfDay = computed({
  get () {
    const [, end] = Array.isArray(form.cancelTimeRange) ? form.cancelTimeRange : []
    return splitCancelDateTime(end).time || CANCEL_DEFAULT_END_TIME
  },
  set (val) {
    setCancelEnd(cancelEndDate.value, val)
  }
})

/** 销假时数：与请假单时数计算规则一致（08-12/13-17，午休不计） */
function calculateCancelDuration () {
  if (!form.cancelTimeRange || form.cancelTimeRange.length !== 2) {
    form.cancelHours = undefined
    return
  }
  const [startTime, endTime] = form.cancelTimeRange
  if (!startTime || !endTime || !isLeaveTimeRangeAllowed(startTime, endTime)) {
    form.cancelHours = undefined
    return
  }
  form.cancelHours = calculateLeaveTotalHours(startTime, endTime)
}

function handleCancelTimeRangeChange () {
  // 只重新计算时数，校验交给控件失焦（blur）时触发，与其余表单控件保持一致
  calculateCancelDuration()
}

function applySelectedLeaveRequest (row) {
  selectedLeaveRequest.value = { ...row }
  form.leaveRequestId = String(row.leaveRequestId || '')
  const minStart = getMinCancelStartDateTime()
  const maxEnd = getMaxCancelEndDateTime()
  form.cancelTimeRange = (minStart && maxEnd && minStart < maxEnd)
    ? [formatDateTimeValue(minStart), formatDateTimeValue(maxEnd)]
    : []
  calculateCancelDuration()
}

/** 移除已选请假单：清空本地引用与销假时间/时数，并同步保存 */
async function removeSelectedLeaveRequest () {
  selectedLeaveRequest.value = null
  form.leaveRequestId = ''
  form.cancelTimeRange = []
  form.cancelHours = undefined
  nextTick(() => formRef.value?.clearValidate('cancelTimeRange'))

  leaveRequestRemoveLoading.value = true
  try {
    const res = await saveLeaveCancellRequest()
    if (isForbiddenCode(res?.code)) {
      showFormActionNotice(t('formbusiness.leavecancell.forbiddenResultSubTitle'), 'warning')
      return
    }
    if (res && isSuccessCode(res.code)) {
      if (!form.formId && res.data) form.formId = String(res.data)
    } else if (isBadRequestResponse(res)) {
      showFormActionNotice(res?.message || t('formbusiness.leavecancell.badRequestFallbackMessage'), 'warning')
    } else {
      showFormActionNotice(res?.message || t('messages.saveError'), 'warning')
    }
  } catch {
    showFormActionNotice(t('messages.saveError'), 'warning')
  } finally {
    leaveRequestRemoveLoading.value = false
  }
}

/** 请假单查询默认日期范围：今天往前 1 周到往后 1 周 */
function getDefaultLeaveRequestDateRange () {
  const start = new Date()
  const end = new Date()
  start.setDate(start.getDate() - 7)
  end.setDate(end.getDate() + 7)
  const pad = (n) => String(n).padStart(2, '0')
  const format = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  return [format(start), format(end)]
}

async function openLeaveRequestPicker () {
  selectedLeaveRequestRow.value = selectedLeaveRequest.value ? { ...selectedLeaveRequest.value } : null
  selectedLeaveRequestRowId.value = selectedLeaveRequest.value ? String(selectedLeaveRequest.value.leaveRequestId) : ''
  leaveRequestFilters.leaveRequestNo = ''
  leaveRequestFilters.dateRange = getDefaultLeaveRequestDateRange()
  leaveRequestPagination.pageIndex = 1
  leaveRequestDialogVisible.value = true
  await fetchLeaveRequestListImmediate()
}

function fetchLeaveRequestListImmediate () {
  return fetchLeaveRequestList()
}

async function fetchLeaveRequestList () {
  const requestId = ++leaveRequestListRequestId
  leaveRequestListLoading.value = true
  try {
    const res = await post(GET_LEAVEREQUEST_VIEW_API, {
      leaveRequestNo: leaveRequestFilters.leaveRequestNo || '',
      startDate: leaveRequestFilters.dateRange?.[0] || '',
      endDate: leaveRequestFilters.dateRange?.[1] || '',
      pageIndex: String(leaveRequestPagination.pageIndex),
      pageSize: String(leaveRequestPagination.pageSize),
      totalCount: String(leaveRequestPagination.totalCount || 0)
    })
    if (requestId !== leaveRequestListRequestId) return
    if (isForbiddenCode(res?.code)) {
      showForbiddenResult()
      leaveRequestList.value = []
      leaveRequestPagination.totalCount = 0
      return
    }
    if (!res || res.code !== 200) {
      if (isBadRequestResponse(res)) {
        showBadRequestResult(res?.message)
      } else {
        if (Number(res?.code) === 400) { ElMessage.warning(res?.message || t('formbusiness.leavecancell.getLeaveRequestListFailed')) } else { ElMessage.error(res?.message || t('formbusiness.leavecancell.getLeaveRequestListFailed')) }
      }
      leaveRequestList.value = []
      leaveRequestPagination.totalCount = 0
      return
    }
    leaveRequestList.value = Array.isArray(res.data) ? res.data : []
    leaveRequestPagination.totalCount = Number(res.totalCount) || 0
    restoreLeaveRequestTableSelection()
  } catch {
    if (requestId !== leaveRequestListRequestId) return
    leaveRequestList.value = []
    leaveRequestPagination.totalCount = 0
    ElMessage.error(t('formbusiness.leavecancell.getLeaveRequestListFailed'))
  } finally {
    if (requestId === leaveRequestListRequestId) {
      leaveRequestListLoading.value = false
    }
  }
}

function handleLeaveRequestSearch () {
  leaveRequestPagination.pageIndex = 1
  fetchLeaveRequestListImmediate()
}

function handleLeaveRequestReset () {
  leaveRequestFilters.leaveRequestNo = ''
  leaveRequestFilters.dateRange = getDefaultLeaveRequestDateRange()
  leaveRequestPagination.pageIndex = 1
  fetchLeaveRequestListImmediate()
}

function handleLeaveRequestPageChange () {
  fetchLeaveRequestListImmediate()
}

function handleLeaveRequestSizeChange () {
  leaveRequestPagination.pageIndex = 1
  fetchLeaveRequestListImmediate()
}

function restoreLeaveRequestTableSelection () {
  if (!selectedLeaveRequestRowId.value || !leaveRequestTableRef.value) return
  const matchedRow = leaveRequestList.value.find((item) => String(item.leaveRequestId) === selectedLeaveRequestRowId.value)
  if (!matchedRow) return
  selectedLeaveRequestRow.value = matchedRow
  isAdjustingLeaveRequestSelection.value = true
  nextTick(() => {
    leaveRequestTableRef.value?.clearSelection()
    leaveRequestTableRef.value?.toggleRowSelection(matchedRow, true)
    isAdjustingLeaveRequestSelection.value = false
  })
}

function handleLeaveRequestTableSelectionChange (selection) {
  if (isAdjustingLeaveRequestSelection.value) return
  if (selection.length === 0) {
    selectedLeaveRequestRowId.value = ''
    selectedLeaveRequestRow.value = null
    return
  }
  const lastRow = selection[selection.length - 1]
  selectedLeaveRequestRowId.value = String(lastRow.leaveRequestId)
  selectedLeaveRequestRow.value = lastRow
  if (selection.length > 1 && leaveRequestTableRef.value) {
    isAdjustingLeaveRequestSelection.value = true
    nextTick(() => {
      leaveRequestTableRef.value.clearSelection()
      leaveRequestTableRef.value.toggleRowSelection(lastRow, true)
      isAdjustingLeaveRequestSelection.value = false
    })
  }
}

function handleLeaveRequestRowClick (row) {
  if (isAdjustingLeaveRequestSelection.value || !row?.leaveRequestId || !leaveRequestTableRef.value) return
  const isSelected = String(selectedLeaveRequestRowId.value) === String(row.leaveRequestId)
  if (isSelected) {
    selectedLeaveRequestRowId.value = ''
    selectedLeaveRequestRow.value = null
  } else {
    selectedLeaveRequestRowId.value = String(row.leaveRequestId)
    selectedLeaveRequestRow.value = row
  }
  isAdjustingLeaveRequestSelection.value = true
  nextTick(() => {
    leaveRequestTableRef.value.clearSelection()
    if (!isSelected) {
      leaveRequestTableRef.value.toggleRowSelection(row, true)
    }
    isAdjustingLeaveRequestSelection.value = false
  })
}

async function confirmLeaveRequestSelect () {
  leaveRequestConfirmLoading.value = true
  try {
    // 先本地应用所选请假单，得到 leaveRequestId 与默认销假时间范围
    applySelectedLeaveRequest(selectedLeaveRequestRow.value)
    // 先关闭弹窗，再在后台保存，避免保存期间遮挡表单
    leaveRequestDialogVisible.value = false
    // 勾选确认即调用 SaveLeaveCancell 保存（无需校验表单必填项）
    const res = await saveLeaveCancellRequest()
    if (isForbiddenCode(res?.code)) {
      showFormActionNotice(t('formbusiness.leavecancell.forbiddenResultSubTitle'), 'warning')
      return
    }
    if (res && isSuccessCode(res.code)) {
      if (!form.formId && res.data) form.formId = String(res.data)
    } else if (isBadRequestResponse(res)) {
      showFormActionNotice(res?.message || t('formbusiness.leavecancell.badRequestFallbackMessage'), 'warning')
    } else {
      showFormActionNotice(res?.message || t('messages.saveError'), 'warning')
    }
  } catch {
    showFormActionNotice(t('messages.saveError'), 'warning')
  } finally {
    leaveRequestConfirmLoading.value = false
  }
}

function handleLeaveRequestDialogClosed () {
  leaveRequestListRequestId += 1
  leaveRequestListLoading.value = false
  selectedLeaveRequestRow.value = null
  selectedLeaveRequestRowId.value = ''
  leaveRequestList.value = []
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

function isForbiddenCode (code) {
  return String(code) === '403'
}

/** 402：业务性校验未通过（如可销时数不足等），以告警而非错误呈现 */
function isValidationWarningCode (code) {
  return String(code) === '402'
}

function isBadRequestResponse (res) {
  return Number(res?.code) === 400
}

function showResult (status, titleKey, subTitleKey) {
  resultState.variant = 'standard'
  resultState.detailMessage = ''
  resultState.visible = true
  resultState.status = status
  resultState.titleKey = titleKey
  resultState.subTitleKey = subTitleKey
}

function isSuccessCode (code) {
  return String(code) === '200'
}

/** 取表单校验失败结果中第一条错误信息，用于暂存/送审时的右上角提示 */
function getFirstValidateErrorMessage (invalidFields) {
  const firstField = Object.values(invalidFields || {})[0]
  return firstField?.[0]?.message || t('formbusiness.leavecancell.validateFailed')
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

function showForbiddenResult () {
  resultState.variant = 'forbidden'
  resultState.detailMessage = ''
  resultState.visible = true
  resultState.status = 'warning'
  resultState.titleKey = 'formbusiness.leavecancell.forbiddenReviewTitle'
  resultState.subTitleKey = 'formbusiness.leavecancell.forbiddenReviewSubTitle'
}

function showBadRequestResult (message) {
  const msg = typeof message === 'string' ? message.trim() : ''
  resultState.variant = 'badRequest'
  resultState.detailMessage = msg || t('formbusiness.leavecancell.badRequestFallbackMessage')
  resultState.visible = true
  resultState.status = 'warning'
  resultState.titleKey = ''
  resultState.subTitleKey = ''
}

function notifyOpenerRefreshFormPending () {
  try {
    if (!window.opener || window.opener.closed) return
    window.opener.postMessage({ type: 'FORM_PENDING_REFRESH' }, window.location.origin)
  } catch {
    /* opener 跨域或不可用时忽略 */
  }
}

/** 签核完成后关闭当前页面，并通知父页面（待审列表）刷新 */
function closeCurrentPage () {
  notifyOpenerRefreshFormPending()
  window.close()
}

function buildSaveLeaveCancellPayload () {
  const [startTime, endTime] = Array.isArray(form.cancelTimeRange) ? form.cancelTimeRange : []
  return {
    formId: String(form.formId || ''),
    leaveRequestId: String(form.leaveRequestId || ''),
    // 后端 startDateTime/endDateTime 为 DateTime?，空字符串无法反序列化为 null，需显式传 null
    startDateTime: startTime ? toISO(startTime) : null,
    endDateTime: endTime ? toISO(endTime) : null
  }
}

async function saveLeaveCancellRequest () {
  console.log(buildSaveLeaveCancellPayload())
  return post(SAVE_LEAVECANCELL_API, buildSaveLeaveCancellPayload(), {
    silentForbiddenError: false
  })
}

async function validateLeaveCancellRequest () {
  return post(VALIDATE_LEAVECANCELL_API, buildSaveLeaveCancellPayload(), {
    silentForbiddenError: false
  })
}

/** 保存/送审前调用 ValidateLeaveCancell，校验通过（code=200 且 data=true）才返回 true */
async function validateLeaveCancellBeforeAction () {
  const res = await validateLeaveCancellRequest()
  if (isForbiddenCode(res?.code)) {
    showFormActionNotice(t('formbusiness.leavecancell.forbiddenResultSubTitle'), 'warning')
    return false
  }
  // 请求未真正到达后端（网络异常/超时等），request.js 已提示过一次，不能当作校验通过放行
  if (isHandled(res)) {
    return false
  }
  if (!res || !isSuccessCode(res.code)) {
    if (isValidationWarningCode(res?.code)) {
      showFormActionNotice(res?.message, 'warning')
    } else if (isBadRequestResponse(res)) {
      showFormActionNotice(res?.message || t('formbusiness.leavecancell.badRequestFallbackMessage'), 'warning')
    } else {
      showFormActionNotice(res?.message || t('formbusiness.leavecancell.validateFailed'), 'warning')
    }
    return false
  }
  if (res.data === false) {
    showFormActionNotice(res?.message || t('formbusiness.leavecancell.validateFailed'), 'warning')
    return false
  }
  return true
}

async function saveLeaveCancellBeforeSubmit () {
  const saveRes = await saveLeaveCancellRequest()
  if (isForbiddenCode(saveRes?.code)) {
    showFormActionNotice(t('formbusiness.leavecancell.forbiddenResultSubTitle'), 'warning')
    return false
  }
  // 请求未真正到达后端（网络异常/超时等），request.js 已提示过一次，不能当作保存成功放行
  if (isHandled(saveRes)) {
    return false
  }
  if (!saveRes || !isSuccessCode(saveRes.code)) {
    if (isValidationWarningCode(saveRes?.code)) {
      showFormActionNotice(saveRes?.message, 'warning')
    } else if (isBadRequestResponse(saveRes)) {
      showFormActionNotice(saveRes?.message || t('formbusiness.leavecancell.badRequestFallbackMessage'), 'warning')
    } else {
      showFormActionNotice(saveRes?.message || t('messages.saveError'), 'warning')
    }
    return false
  }
  // formId 一旦建立即不可变：仅在为空（真正新建）时才采纳 save 返回值，
  // 避免更新态下后端返回的状态标志（如 1）覆盖真实 formId
  if (!form.formId && saveRes.data) form.formId = String(saveRes.data)
  return true
}

async function onSubmit () {
  if (!form.leaveRequestId) {
    showFormActionNotice(t('formbusiness.leavecancell.pleaseSelectLeaveRequest'), 'warning')
    return
  }
  const invalidFields = await new Promise((resolve) => {
    formRef.value?.validate((valid, fields) => resolve(valid ? null : fields))
  })
  if (invalidFields) {
    showFormActionNotice(getFirstValidateErrorMessage(invalidFields), 'warning')
    return
  }
  // 暂存时除必填外的业务性校验（时间过早/过晚、超出可销时数等）不在前端判断，
  // 统一交给 ValidateLeaveCancell 接口返回的提示信息
  saving.value = true
  try {
    const validated = await validateLeaveCancellBeforeAction()
    if (!validated) return
    const res = await saveLeaveCancellRequest()
    if (isForbiddenCode(res?.code)) {
      showFormActionNotice(t('formbusiness.leavecancell.forbiddenResultSubTitle'), 'warning')
    } else if (isHandled(res)) {
      // 请求未真正到达后端，request.js 已提示过一次
    } else if (res && isSuccessCode(res.code)) {
      if (!form.formId && res.data) form.formId = String(res.data)
      showFormActionNotice(res.message || t('messages.saveSuccess'), 'success')
    } else if (isValidationWarningCode(res?.code)) {
      showFormActionNotice(res?.message, 'warning')
    } else if (isBadRequestResponse(res)) {
      showFormActionNotice(res?.message || t('formbusiness.leavecancell.badRequestFallbackMessage'), 'warning')
    } else {
      showFormActionNotice(res?.message || t('messages.saveError'), 'warning')
    }
  } catch {
    // ignore
  } finally {
    saving.value = false
  }
}

/** 送审：校验 → 暂存 → 送审 */
async function onSubmitForApproval () {
  if (!form.leaveRequestId) {
    showFormActionNotice(t('formbusiness.leavecancell.pleaseSelectLeaveRequest'), 'warning')
    return
  }
  const invalidFields = await new Promise((resolve) => {
    formRef.value?.validate((valid, fields) => resolve(valid ? null : fields))
  })
  if (invalidFields) {
    showFormActionNotice(getFirstValidateErrorMessage(invalidFields), 'warning')
    return
  }
  approving.value = true
  try {
    // 送审前：先校验 → 再保存 → 再送审
    const validated = await validateLeaveCancellBeforeAction()
    if (!validated) return

    const saved = await saveLeaveCancellBeforeSubmit()
    if (!saved) return

    const formId = String(form.formId || '')
    if (!formId) {
      showFormActionNotice(t('formbusiness.leavecancell.workflowNeedFormId'), 'warning')
      return
    }

    const res = await post(APPROVE_LEAVECANCELL_API, {
      formId,
      rejectStepId: '0',
      comment: approvalComment.value || ''
    }, {
      silentForbiddenError: false,
      silentAuthError: false,
      disableAutoLogout: true
    })
    if (isForbiddenCode(res?.code)) {
      showFormActionNotice(t('formbusiness.leavecancell.forbiddenResultSubTitle'), 'warning')
      return
    }
    if (isHandled(res)) {
      return
    }
    if (res && isSuccessCode(res.code)) {
      showResult('success', 'formbusiness.leavecancell.approvalResultTitle', 'formbusiness.leavecancell.approvalResultSubTitle')
      return
    }
    if (isValidationWarningCode(res?.code)) {
      showFormActionNotice(res?.message, 'warning')
      return
    }
    if (isBadRequestResponse(res)) {
      showFormActionNotice(res?.message || t('formbusiness.leavecancell.badRequestFallbackMessage'), 'warning')
      return
    }
    showFormActionNotice(res?.message || t('formbusiness.leavecancell.submitFailed'), 'warning')
  } catch {
    // ignore
  } finally {
    approving.value = false
  }
}

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
    ElMessage.warning(t('formbusiness.leavecancell.workflowNeedFormId'))
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
    ElMessage.warning(t('formbusiness.leavecancell.workflowNeedFormId'))
    return
  }

  const rejectStepId = rejectForm.rejectStepId
  const rejectReason = rejectForm.rejectReason
  rejectDialogVisible.value = false
  await nextTick()

  rejecting.value = true
  try {
    const res = await post(REJECT_LEAVECANCELL_API, {
      formId,
      rejectStepId,
      comment: rejectReason
    }, { silentForbiddenError: false })

    if (isForbiddenCode(res?.code)) {
      showForbiddenResult()
      return
    }
    if (res && isSuccessCode(res.code)) {
      showResult('success', 'formbusiness.leavecancell.rejectResultTitle', 'formbusiness.leavecancell.rejectResultSubTitle')
      return
    }
    if (isBadRequestResponse(res)) {
      showBadRequestResult(res?.message)
      return
    }
    ElNotification({ title: '', message: res?.message || t('formbusiness.leavecancell.rejectFailed'), type: 'error' })
  } catch {
    ElNotification({ title: '', message: t('formbusiness.leavecancell.rejectFailed'), type: 'error' })
  } finally {
    rejecting.value = false
  }
}

onMounted(async () => {
  try {
    const routeFormId = route.query.formId || route.params?.formId
    if (routeFormId) {
      form.formId = String(routeFormId)
      await getLeaveCancellDetail(form.formId)
    } else {
      await initLeaveCancell()
    }
  } catch {
    ElMessage.error(t('formbusiness.messages.loadError'))
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
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

.sk-textarea {
  flex: 1;
  min-width: 0;
  height: 76px;
}

/* 原请假单引用：选择按钮 + 单行引用表格 */
.sk-block {
  flex: 1;
  min-width: 0;
  height: 110px;
}

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
  /* el-card 默认 overflow: hidden、el-card__body 默认 overflow: auto，
     都会裁掉溢出到卡片边框外的可销假时数入口 */
  overflow: visible;
}

.leave-form-card :deep(.el-card__body) {
  overflow: visible;
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

.leavecancell-bad-request-desc {
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

.leave-form {
  padding: 0 20px;
}

.leave-form :deep(.el-input__wrapper),
.leave-form :deep(.el-select .el-input__wrapper),
.leave-form :deep(.el-date-editor) {
  border-color: #c0c4cc;
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

.leave-form :deep(.el-select) {
  width: 100%;
}

.basic-info-row .el-form-item {
  margin-bottom: 0;
}

.basic-info-row + .basic-info-row {
  margin-top: 18px;
}

.approval-comment-row {
  margin-top: 12px;
}

.approval-comment-row .el-form-item {
  margin-bottom: 6px;
}

/* 选择请假单入口：固定在表格右上方（el-form-item__content 默认 flex 布局，需撑满宽度才能靠右） */
.leave-request-table-toolbar {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-bottom: 12px;
}

/* 选择 / 更改请假单入口：文字保持黑色，悬停时也不转为主题蓝 */
.leave-request-ref-btn {
  --el-button-text-color: var(--el-text-color-primary);
  --el-button-hover-text-color: var(--el-text-color-primary);
  --el-button-active-text-color: var(--el-text-color-primary);
  --el-button-hover-link-text-color: var(--el-text-color-primary);
  --el-button-hover-border-color: var(--el-border-color-hover);
  --el-button-active-border-color: var(--el-border-color-hover);
  --el-button-hover-bg-color: var(--el-fill-color-light);
  --el-button-active-bg-color: var(--el-fill-color-light);
}

.leave-request-ref-row {
  position: relative;
}

/* 原请假单引用行与销假时间行的间距收紧 */
.leave-request-ref-row .el-form-item {
  margin-bottom: 4px;
}

.leave-request-ref-table {
  width: 100%;
  font-size: 13px;
}

/* 表体文字：深灰色，字号与表单一致 */
.leave-request-ref-table :deep(.el-table__body .cell) {
  color: #4c4c4c;
  font-size: 13px;
}

/* 请假时数列：仅数值加黑色，列头颜色不变 */
.leave-request-ref-table :deep(.el-table__body .ref-leave-hours-col .cell) {
  color: #000000;
  font-weight: 700;
}

/* 移除按钮：红色字体 */
.leave-request-ref-table :deep(.leave-request-remove-btn) {
  color: #c00c1f;
}

.leave-request-ref-table :deep(.leave-request-remove-btn:hover) {
  color: #e6485c;
}

.leave-time-range-fields {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  flex-wrap: wrap;
}

.leave-time-range-separator {
  flex-shrink: 0;
  color: var(--el-text-color-secondary);
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

/* 销假时数不再单独分栏：紧随销假时间字段之后，标签宽度自适应使文本框紧贴标签 */
.cancel-time-hours-row {
  display: flex;
  align-items: flex-start;
  gap: 16px 24px;
  flex-wrap: wrap;
}

.cancel-time-hours-row .cancel-time-range-item {
  flex: 0 1 auto;
  min-width: 0;
}

.cancel-time-hours-row .cancel-time-range-item :deep(.el-form-item__content) {
  min-width: 0;
}

.cancel-time-hours-row .cancel-hours-item {
  flex: 0 0 auto;
}

.leave-form :deep(.leave-hours-input .el-input__inner),
.leave-form :deep(.leave-hours-input .el-input__wrapper input) {
  color: #0058cc;
  font-weight: 700;
  -webkit-text-fill-color: #0058cc;
}

.leave-form :deep(.leave-hours-input.is-disabled .el-input__inner),
.leave-form :deep(.leave-hours-input.is-disabled .el-input__wrapper input) {
  color: #0058cc;
  -webkit-text-fill-color: #0058cc;
}

.leave-request-filter-form .el-form-item {
  margin-bottom: 12px;
}

.leave-request-filter-form .leave-request-filter-no {
  width: 200px;
}

.leave-request-filter-form .leave-request-filter-date {
  width: 230px;
}

.leave-request-table-wrap {
  margin-top: 4px;
}

.leave-request-select-table {
  width: 100%;
}

.leave-request-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
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
  font-size: 14px;
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
