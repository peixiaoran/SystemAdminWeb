<template>
  <div class="leave-form-page">
    <el-config-provider :locale="elementPlusLocale">
    <!-- Skeleton 骨架屏 -->
    <template v-if="loading && !resultState.visible">
      <el-card class="leave-form-card" shadow="never">
        <el-skeleton animated>
          <template #template>
            <div style="display:flex; justify-content:center; margin-bottom:24px;">
              <el-skeleton-item variant="text" style="width:200px; height:28px;" />
            </div>
            <el-skeleton-item variant="text" style="width:100%; height:1px; margin-bottom:24px;" />

            <div style="display:flex; gap:16px; margin-bottom:22px; padding:0 20px;">
              <el-skeleton-item variant="text" style="width:33%; height:32px;" />
            </div>

            <div style="display:flex; gap:16px; margin-bottom:22px; padding:0 20px;">
              <el-skeleton-item variant="text" style="flex:1; height:32px;" />
              <el-skeleton-item variant="text" style="flex:1; height:32px;" />
              <el-skeleton-item variant="text" style="flex:1; height:32px;" />
            </div>
            <el-skeleton-item variant="text" style="width:100%; height:1px; margin-bottom:22px;" />

            <div style="display:flex; gap:16px; margin-bottom:22px; padding:0 20px;">
              <el-skeleton-item variant="text" style="flex:1; height:32px;" />
              <el-skeleton-item variant="text" style="flex:1; height:32px;" />
            </div>

            <div style="margin-bottom:22px; padding:0 20px;">
              <el-skeleton-item variant="text" style="width:100%; height:76px;" />
            </div>

            <div style="margin-bottom:22px; padding:0 20px;">
              <el-skeleton-item variant="text" style="width:100%; height:60px;" />
            </div>

            <div style="display:flex; justify-content:flex-end; align-items:center; padding:0 20px;">
              <el-skeleton-item variant="circle" style="width:32px; height:32px;" />
            </div>
          </template>
        </el-skeleton>
      </el-card>

      <el-card class="leave-form-card review-log-card" shadow="never">
        <el-skeleton animated>
          <template #template>
            <el-skeleton-item variant="text" style="width:80px; height:20px; margin-bottom:16px;" />
            <el-skeleton-item variant="text" style="width:100%; height:36px; margin-bottom:2px;" />
            <el-skeleton-item variant="text" style="width:100%; height:44px; margin-bottom:2px;" />
            <el-skeleton-item variant="text" style="width:100%; height:44px;" />
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
        <p class="forbidden-result__eyebrow">{{ t('formbusiness.leavecancell.forbiddenViewEyebrow') }}</p>
        <h2 class="forbidden-result__title">{{ t('formbusiness.leavecancell.forbiddenViewTitle') }}</h2>
        <p class="forbidden-result__desc">{{ t('formbusiness.leavecancell.forbiddenViewSubTitle') }}</p>
        <el-button class="forbidden-result__action" type="primary" round @click="closeCurrentPage">
          {{ t('formbusiness.leavecancell.backToFormPending') }}
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
          <p v-if="resultState.variant === 'badRequest'" class="leavecancell-bad-request-desc">
            {{ t('formbusiness.leavecancell.badRequestHint') }}
          </p>
          <span v-else>{{ t(resultState.subTitleKey) }}</span>
        </template>
        <template #extra>
          <el-button type="primary" @click="closeCurrentPage">
            {{ t('formbusiness.leavecancell.backToFormPending') }}
          </el-button>
        </template>
      </el-result>
    </el-card>

    <template v-else>
    <el-card class="leave-form-card" shadow="never">
      <div class="form-title-row">
        <h2 class="form-title">{{ t('formbusiness.leavecancell.formTitle') }}</h2>
      </div>
      <el-divider style="margin: 22px 0;"></el-divider>

      <el-form ref="formRef" :model="form" label-width="100px" class="leave-form" :validate-on-rule-change="false">

        <!-- 基本信息 -->
        <el-row v-if="isAnyStepFieldVisible(['FormNo', 'ApplyDate'])" :gutter="16" class="basic-info-row" style="justify-content: flex-start;">
          <el-col v-if="isStepFieldVisible('FormNo')" :span="8">
            <el-form-item :label="t('formbusiness.leavecancell.formNo')" prop="formNo">
              <el-input v-model="form.formNo" disabled />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('ApplyDate')" :span="8">
            <el-form-item :label="t('formbusiness.leavecancell.applyDate')" prop="applyDate">
              <el-date-picker
                v-model="form.applyDate"
                type="date"
                value-format="YYYY-MM-DD"
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
            <el-form-item :label="t('formbusiness.leavecancell.applicantUserNo')" prop="applicantUserNo">
              <el-input v-model="form.applicantUserNo" disabled />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('UserName')" :span="8">
            <el-form-item :label="t('formbusiness.leavecancell.applicantUserName')" prop="applicantUserName">
              <el-input v-model="form.applicantUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('Department')" :span="8">
            <el-form-item :label="t('formbusiness.leavecancell.applicantDeptName')" prop="applicantDeptName">
              <el-input v-model="form.applicantDeptName" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider v-if="isAnyStepFieldVisible(['FormNo', 'ApplyDate', 'UserNo', 'UserName', 'Department'])"></el-divider>

        <!-- 原请假单引用 -->
        <template v-if="isStepFieldVisible('LeaveRequestRef')">
          <el-row :gutter="16" class="leave-request-ref-row">
            <el-col :span="24">
              <el-form-item :label="t('formbusiness.leavecancell.leaveRequestFormNo')" prop="leaveRequestId">
                <el-table :data="selectedLeaveRequest ? [selectedLeaveRequest] : []" border size="small" class="leave-request-ref-table" :empty-text="t('common.noData')">
                  <el-table-column prop="leaveRequestNo" :label="t('formbusiness.leavecancell.leaveRequestNoColumn')" min-width="120" align="center" />
                  <el-table-column prop="leaveType" :label="t('formbusiness.leavecancell.leaveTypeColumn')" min-width="100" align="center" />
                  <el-table-column :label="t('formbusiness.leavecancell.leaveTimeRangeColumn')" min-width="300" align="center">
                    <template #default="{ row }">{{ formatDateTimeCell(row.startDateTime) }} ~ {{ formatDateTimeCell(row.endDateTime) }}</template>
                  </el-table-column>
                  <el-table-column :label="t('formbusiness.leavecancell.leaveHoursColumn')" width="90" align="center" class-name="ref-leave-hours-col">
                    <template #default="{ row }">{{ formatHoursCell(row.leaveHours) }}</template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>

            <!-- 本单可销假时数：与原请假单引用行同一水平线，悬浮在表单卡片右侧 -->
            <aside class="remaining-cancell-hours-float">
              <el-popover
                placement="top"
                popper-class="remaining-cancell-hours-popper"
                :title="t('formbusiness.leavecancell.remainingCancellHoursTitle')"
                :width="150"
                trigger="click"
                @show="fetchRemainingCancellHours"
                @hide="resetRemainingCancellHours"
              >
                <template #reference>
                  <button type="button" class="remaining-cancell-hours-btn" :aria-label="t('formbusiness.leavecancell.viewRemainingCancellHours')">
                    <svg class="hand-drawn-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <circle cx="16" cy="16.5" r="10.5" fill="#E6D8B8" stroke="#1f1f1f" stroke-width="1.8" />
                      <path d="M16 16.5 V9.8" stroke="#1f1f1f" stroke-width="1.8" stroke-linecap="round" />
                      <path d="M16 16.5 L20.6 18.7" stroke="#1f1f1f" stroke-width="1.8" stroke-linecap="round" />
                      <circle cx="16" cy="16.5" r="1.15" fill="#1f1f1f" />
                    </svg>
                  </button>
                </template>
                <div class="remaining-cancell-hours-body">
                  <span
                    v-if="remainingCancellHoursLoading || !remainingCancellHoursFetched"
                    class="remaining-cancell-hours-dots"
                    role="status"
                    :aria-label="t('common.loading')"
                  >
                    <i></i><i></i><i></i>
                  </span>
                  <span
                    v-else-if="remainingCancellHoursValue !== null"
                    class="remaining-cancell-hours-value"
                  >
                    {{ t('formbusiness.leavecancell.remainingCancellHoursValue', { hours: formatHoursCell(remainingCancellHoursValue) }) }}
                  </span>
                  <span v-else class="remaining-cancell-hours-empty">
                    {{ t('formbusiness.leavecancell.remainingCancellHoursEmpty') }}
                  </span>
                </div>
              </el-popover>
            </aside>
          </el-row>

          <el-row :gutter="16">
            <el-col :span="24" class="cancel-time-hours-row">
              <el-form-item :label="t('formbusiness.leavecancell.cancelTimeRange')" class="cancel-time-range-item">
                <div class="leave-time-range-fields">
                  <el-date-picker
                    :model-value="cancelStartDate"
                    type="date"
                    value-format="YYYY-MM-DD"
                    :placeholder="t('formbusiness.leavecancell.pleaseSelectStartDate')"
                    :clearable="false"
                    disabled
                    class="leave-date-picker"
                    style="width: 160px; flex: 0 0 160px;"
                  />
                  <el-time-select
                    :model-value="cancelStartTimeOfDay"
                    start="08:00"
                    end="17:00"
                    step="00:10"
                    :placeholder="t('formbusiness.leavecancell.pleaseSelectStartTime')"
                    :clearable="false"
                    disabled
                    class="leave-time-of-day-select"
                    style="width: 135px; flex: 0 0 135px;"
                  />
                  <span class="leave-time-range-separator"> ~ </span>
                  <el-date-picker
                    :model-value="cancelEndDate"
                    type="date"
                    value-format="YYYY-MM-DD"
                    :placeholder="t('formbusiness.leavecancell.pleaseSelectEndDate')"
                    :clearable="false"
                    disabled
                    class="leave-date-picker"
                    style="width: 160px; flex: 0 0 160px;"
                  />
                  <el-time-select
                    :model-value="cancelEndTimeOfDay"
                    start="08:00"
                    end="17:00"
                    step="00:10"
                    :placeholder="t('formbusiness.leavecancell.pleaseSelectEndTime')"
                    :clearable="false"
                    disabled
                    class="leave-time-of-day-select"
                    style="width: 135px; flex: 0 0 135px;"
                  />
                </div>
              </el-form-item>
              <el-form-item :label="t('formbusiness.leavecancell.cancelHours')" label-width="auto" class="cancel-hours-item">
                <el-input-number
                  v-model="form.cancelHours"
                  class="leave-hours-input"
                  :precision="2"
                  :controls="false"
                  style="width: 110px;"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 上方还有表单项自带的 18px 下边距，6px 上边距使分割线到销假时间与到销假原因的距离一致（均 24px） -->
          <el-divider style="margin: 6px 0 24px;"></el-divider>
        </template>

        <el-row :gutter="16" class="approval-comment-row">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.leavecancell.approvalComment')">
              <el-input v-model="approvalComment" type="textarea" :rows="3" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item class="form-actions-form-item">
              <div class="form-actions-row">
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
    <el-card class="leave-form-card review-log-card" shadow="never">
      <div class="review-log-section">
        <div class="review-log-title">{{ t('formbusiness.leavecancell.reviewLog') }}</div>
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
            :label="t('formbusiness.leavecancell.reviewLogStep')"
            width="130"
            align="left"
          >
            <template #default="{ row }">
              <span class="review-log-step-cell">{{ row.stepName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('formbusiness.leavecancell.reviewLogOperationUser')"
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
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('formbusiness.leavecancell.reviewLogResult')"
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
                >（{{ t('formbusiness.leavecancell.reviewLogRejectToStep', { step: getReviewRejectStepName(row) }) }}）</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('formbusiness.leavecancell.reviewLogComment')"
            min-width="200"
          >
            <template #default="{ row }">
              <div class="review-log-comment-cell">{{ row.comment }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('formbusiness.leavecancell.reviewLogDateTime')"
            width="155"
            align="center"
          >
            <template #default="{ row }">{{ formatReviewDateTime(row.reviewDateTime) }}</template>
          </el-table-column>
        </el-table>
        <el-empty
          v-else
          :description="t('formbusiness.leavecancell.reviewLogEmpty')"
          style="padding: 20px 0;"
        />
      </div>
    </el-card>

    </template>

    <!-- 完整审批流程 -->
    <el-drawer
      v-model="workflowDrawerVisible"
      :title="t('formbusiness.leavecancell.workflowDrawerTitle')"
      direction="rtl"
      size="420px"
      destroy-on-close
      class="leavecancell-workflow-drawer"
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
                {{ t('formbusiness.leavecancell.workflowStatusSkipped') }}
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
                  <div class="workflow-user-name">{{ workflowReviewUserName(u) }}</div>
                </div>
                <span
                  class="workflow-user-label"
                  :class="'workflow-user-label--' + workflowUserStatusIcon(u)"
                >{{ workflowUserStatusLabel(u) }}</span>
              </li>
            </ul>
          </div>
        </template>
        <el-empty v-else-if="!workflowDrawerLoading" :description="t('formbusiness.leavecancell.workflowEmpty')" />
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
import { Clock, CircleCheck, RemoveFilled, Loading, Lock } from '@element-plus/icons-vue'
import { post } from '@/utils/request'
import { MODULE_API } from '@/config/api/modulemenu/menu'
import { GET_LEAVECANCELL_API, GET_LEAVEREQUEST_DETAIL_API, GET_REMAINING_CANCELL_HOURS_API, GET_FULL_REVIEW_FLOW_API } from '@/config/api/formbusiness/forms/leavecancell'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePMenuStore } from '@/stores/pmenu'

// GET_LEAVECANCELL_API（销假单明细，只读）已接入；
// INIT_LEAVECANCELL_API / SAVE_LEAVECANCELL_API 及送审驳回相关接口在本只读页面无需使用

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

const selectedLeaveRequest = ref(null)

// 本单可销假时数 popover
const remainingCancellHoursLoading = ref(false)
const remainingCancellHoursValue = ref(null)
const remainingCancellHoursFetched = ref(false)

/** 点击"查看本单可销假时数"按钮，拉取当前请假单的剩余可销时数 */
async function fetchRemainingCancellHours () {
  const leaveRequestId = selectedLeaveRequest.value?.leaveRequestId ?? form.leaveRequestId
  // 打开即进入加载态，直到接口返回才展示时数，避免先闪一下空值/旧值
  remainingCancellHoursLoading.value = true
  remainingCancellHoursValue.value = null
  if (!leaveRequestId) {
    remainingCancellHoursLoading.value = false
    remainingCancellHoursFetched.value = true
    return
  }
  try {
    const res = await post(
      GET_REMAINING_CANCELL_HOURS_API,
      new URLSearchParams({ leaveRequestId: String(leaveRequestId), formId: String(form.formId || '') }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )
    if (res && res.code === 200) {
      remainingCancellHoursValue.value = res.data ?? null
    } else {
      ElMessage.error(res?.message || t('formbusiness.leavecancell.getRemainingCancellHoursFailed'))
    }
  } catch {
    ElMessage.error(t('formbusiness.leavecancell.getRemainingCancellHoursFailed'))
  } finally {
    remainingCancellHoursLoading.value = false
    remainingCancellHoursFetched.value = true
  }
}

/** 关闭 popover 时复位状态，下次打开重新加载，避免闪现上一次的时数 */
function resetRemainingCancellHours () {
  remainingCancellHoursFetched.value = false
  remainingCancellHoursValue.value = null
  remainingCancellHoursLoading.value = false
}

// 展示层拆分：form.cancelTimeRange 仍是 [startDateTime, endDateTime]（"YYYY-MM-DD HH:mm:ss"），与 r 页面保持一致
const CANCEL_DEFAULT_START_TIME = '08:00'
const CANCEL_DEFAULT_END_TIME = '17:00'

function splitCancelDateTime (val) {
  if (!val) return { date: '', time: '' }
  const s = String(val)
  const spaceIdx = s.indexOf(' ')
  if (spaceIdx === -1) return { date: s, time: '' }
  return { date: s.slice(0, spaceIdx), time: s.slice(spaceIdx + 1, spaceIdx + 6) }
}

const cancelStartDate = computed(() => {
  const [start] = Array.isArray(form.cancelTimeRange) ? form.cancelTimeRange : []
  return splitCancelDateTime(start).date
})

const cancelStartTimeOfDay = computed(() => {
  const [start] = Array.isArray(form.cancelTimeRange) ? form.cancelTimeRange : []
  return splitCancelDateTime(start).time || CANCEL_DEFAULT_START_TIME
})

const cancelEndDate = computed(() => {
  const [, end] = Array.isArray(form.cancelTimeRange) ? form.cancelTimeRange : []
  return splitCancelDateTime(end).date
})

const cancelEndTimeOfDay = computed(() => {
  const [, end] = Array.isArray(form.cancelTimeRange) ? form.cancelTimeRange : []
  return splitCancelDateTime(end).time || CANCEL_DEFAULT_END_TIME
})

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

function reviewLogRowClassName ({ row }) {
  return isReviewWithdrawResult(row) ? 'review-log-row--withdraw' : ''
}

function isReviewWithdrawResult (row) {
  return String(row?.reviewResult ?? '').trim().toLowerCase() === 'withdraw'
}

function isReviewRejectResult (row) {
  return String(row?.reviewResult ?? '').trim().toLowerCase() === 'reject'
}

function getReviewRejectStepName (row) {
  return row?.rejectStepName || ''
}

function formatReviewDateTime (dt) {
  if (!dt) return ''
  const d = new Date(dt)
  if (isNaN(d.getTime())) return String(dt)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function getReviewResultTagType (row) {
  const result = String(row?.reviewResult ?? '').trim().toLowerCase()
  if (result === 'approve' || result === 'approved') return 'success'
  if (result === 'reject') return 'danger'
  if (result === 'withdraw') return 'info'
  return ''
}

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
  if (key === 'approve') return t('formbusiness.leavecancell.workflowStatusApprove')
  if (key === 'underReview') return t('formbusiness.leavecancell.workflowStatusUnderReview')
  return t('formbusiness.leavecancell.workflowStatusUnsigned')
}

function workflowReviewUserName (u) {
  const name = u?.reviewUserName ?? u?.ReviewUserName ?? u?.userName ?? u?.UserName
  if (name == null || name === '') return ''
  return String(name)
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
        ElMessage.error(res?.message || t('formbusiness.leavecancell.workflowLoadFailed'))
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
      const fieldKey = item?.fieldName ?? item?.FieldName
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

function isAnyStepFieldVisible (fieldKeys) {
  return fieldKeys.some(key => isStepFieldVisible(key))
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

  applyStepFieldPermissions(data.stepFieldPermission)
}

async function getLeaveCancellDetail (formId) {
  try {
    const res = await post(
      GET_LEAVECANCELL_API,
      new URLSearchParams({ formId: String(formId || ''), type: 'View' }),
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
        ElMessage.error(res.message)
      }
      return
    }
    await bindFormData(res.data || {})
  } catch {
    // ignore
  }
}

function isForbiddenCode (code) {
  return String(code) === '403'
}

function isBadRequestResponse (res) {
  return Number(res?.code) === 400
}

function showForbiddenResult () {
  resultState.variant = 'forbidden'
  resultState.detailMessage = ''
  resultState.visible = true
  resultState.status = 'warning'
  resultState.titleKey = 'formbusiness.leavecancell.forbiddenViewTitle'
  resultState.subTitleKey = 'formbusiness.leavecancell.forbiddenViewSubTitle'
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

const FORM_PENDING_ROUTE_PATH = '/formbusiness/form-operate/formpending'
const FORMBUSINESS_MODULE_PATH = 'formbusiness'

function isPopupWindow () {
  try {
    return !!(window.opener && !window.opener.closed)
  } catch {
    return !!window.opener
  }
}

function notifyOpenerRefreshFormPending () {
  try {
    if (!window.opener || window.opener.closed) return
    window.opener.postMessage({ type: 'FORM_PENDING_REFRESH' }, window.location.origin)
  } catch {
    /* opener 跨域或不可用时忽略 */
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
      matched.moduleNameCn || matched.ModuleNameCn || matched.moduleNameCh || matched.ModuleNameCh ||
      matched.moduleName || matched.ModuleName || ''
    const nameEn =
      matched.moduleNameEn || matched.ModuleNameEn || matched.moduleName || matched.ModuleName || ''
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

onMounted(async () => {
  try {
    const routeFormId = route.query.formId || route.params?.formId
    if (routeFormId) {
      form.formId = String(routeFormId)
      await getLeaveCancellDetail(form.formId)
    }
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

.leave-request-ref-row {
  position: relative;
}

/* 原请假单引用行与销假时间行的间距收紧 */
.leave-request-ref-row .el-form-item {
  margin-bottom: 4px;
}

/* 本单可销假时数：与原请假单引用行同一水平线，悬浮在表单卡片右侧外部
   （偏移量 = 表单内边距 20px + 卡片内边距 20px + 边框，再减去 el-row 的 8px 负边距） */
.remaining-cancell-hours-float {
  position: absolute;
  top: 50%;
  left: calc(100% + 42px);
  z-index: 20;
  display: flex;
  transform: translateY(-50%);
}

/* 窄屏时卡片右侧无空间，隐藏悬浮入口 */
@media (max-width: 1120px) {
  .remaining-cancell-hours-float {
    display: none;
  }
}

.remaining-cancell-hours-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border: none;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
}

.remaining-cancell-hours-btn .hand-drawn-icon {
  width: 30px;
  height: 30px;
  display: block;
}

.remaining-cancell-hours-body {
  min-height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 1.5;
}

.remaining-cancell-hours-value {
  font-weight: 700;
  color: #0058cc;
}

.remaining-cancell-hours-empty {
  color: var(--el-text-color-secondary);
}

/* 加载中：三个灰点依次起伏 */
.remaining-cancell-hours-dots {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 16px;
}

.remaining-cancell-hours-dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--el-text-color-placeholder);
  animation: remaining-hours-dot 1.2s ease-in-out infinite;
}

.remaining-cancell-hours-dots i:nth-child(2) {
  animation-delay: 0.16s;
}

.remaining-cancell-hours-dots i:nth-child(3) {
  animation-delay: 0.32s;
}

@keyframes remaining-hours-dot {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.45;
  }

  30% {
    transform: translateY(-5px);
    opacity: 1;
  }
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

/* 请假时数列：仅数值加深红色，列头颜色不变 */
.leave-request-ref-table :deep(.el-table__body .ref-leave-hours-col .cell) {
  color: #c00c1f;
  font-weight: 700;
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

.leavecancell-workflow-drawer :deep(.el-drawer__header) {
  padding: 10px 20px !important;
  margin: 0 !important;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.leavecancell-workflow-drawer :deep(.el-drawer__title) {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
}

.leavecancell-workflow-drawer :deep(.el-drawer__body) {
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

.workflow-step-block--skipped {
  border-left-color: var(--el-border-color-extra-light, var(--el-border-color-lighter));
  opacity: 0.65;
}

.workflow-step-block--skipped .workflow-step-name {
  color: var(--el-text-color-disabled);
  font-weight: 500;
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

.workflow-step-icon.is-pending-step {
  color: var(--el-color-info);
  background: var(--el-color-info-light-9, var(--el-fill-color-light));
}

.workflow-step-icon.is-skipped-step {
  color: var(--el-text-color-disabled);
  background: var(--el-fill-color-darker);
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
</style>

<!-- popover 内容被 teleport 到 body，需用非 scoped 样式控制字号 -->
<style>
.remaining-cancell-hours-popper.el-popover.el-popper {
  padding: 10px 12px;
}

.remaining-cancell-hours-popper .el-popover__title {
  font-size: 13px;
  margin-bottom: 8px;
}

</style>
