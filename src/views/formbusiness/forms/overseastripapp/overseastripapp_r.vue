<template>
  <div
    class="leave-form-page"
    v-loading.fullscreen.lock="formActionLoading"
    :element-loading-text="t('common.loading')"
  >
    <el-config-provider :locale="elementPlusLocale">
    <!-- Skeleton 骨架屏 -->
    <template v-if="loading && !resultState.visible">
      <el-card class="leave-form-card" shadow="never">
        <el-skeleton animated>
          <template #template>
            <div class="sk-title-row">
              <el-skeleton-item variant="text" class="sk-title" />
            </div>
            <div class="sk-divider"></div>

            <div class="sk-body">
              <div class="sk-grid">
                <div v-for="n in 2" :key="`sk-base-${n}`" class="sk-field">
                  <el-skeleton-item variant="text" class="sk-label" />
                  <el-skeleton-item variant="text" class="sk-control" />
                </div>
              </div>

              <div class="sk-grid">
                <div v-for="n in 3" :key="`sk-user-${n}`" class="sk-field">
                  <el-skeleton-item variant="text" class="sk-label" />
                  <el-skeleton-item variant="text" class="sk-control" />
                </div>
              </div>

              <div class="sk-divider" style="margin: 6px 0 24px;"></div>

              <div class="sk-grid">
                <div v-for="n in 2" :key="`sk-site-${n}`" class="sk-field">
                  <el-skeleton-item variant="text" class="sk-label" />
                  <el-skeleton-item variant="text" class="sk-control" />
                </div>
              </div>

              <div class="sk-field sk-field--top">
                <el-skeleton-item variant="text" class="sk-label" />
                <el-skeleton-item variant="text" class="sk-textarea" />
              </div>

              <div class="sk-grid">
                <div v-for="n in 2" :key="`sk-travel-${n}`" class="sk-field">
                  <el-skeleton-item variant="text" class="sk-label" />
                  <el-skeleton-item variant="text" class="sk-control" />
                </div>
              </div>

              <div class="sk-grid">
                <div v-for="n in 3" :key="`sk-date-${n}`" class="sk-field">
                  <el-skeleton-item variant="text" class="sk-label" />
                  <el-skeleton-item variant="text" class="sk-control" />
                </div>
              </div>

              <div class="sk-field sk-field--top">
                <el-skeleton-item variant="text" class="sk-label" />
                <el-skeleton-item variant="text" class="sk-textarea" />
              </div>

              <div class="sk-field sk-field--top">
                <el-skeleton-item variant="text" class="sk-label" />
                <el-skeleton-item variant="text" class="sk-block" />
              </div>

              <div class="sk-divider" style="margin: 6px 0 24px;"></div>

              <div class="sk-field sk-field--top">
                <el-skeleton-item variant="text" class="sk-label" />
                <el-skeleton-item variant="text" class="sk-block" />
              </div>

              <div class="sk-divider" style="margin: 6px 0 24px;"></div>

              <div class="sk-field sk-field--top">
                <el-skeleton-item variant="text" class="sk-label" />
                <el-skeleton-item variant="text" class="sk-textarea" />
              </div>

              <div class="sk-actions">
                <div class="sk-actions-buttons">
                  <el-skeleton-item variant="button" class="sk-action-btn" />
                  <el-skeleton-item variant="button" class="sk-action-btn" />
                  <el-skeleton-item variant="button" class="sk-action-btn" />
                </div>
                <el-skeleton-item variant="text" class="sk-hint" />
              </div>
            </div>
          </template>
        </el-skeleton>
      </el-card>

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
        <p class="forbidden-result__eyebrow">{{ t('formbusiness.overseastripapp.forbiddenReviewEyebrow') }}</p>
        <h2 class="forbidden-result__title">{{ t('formbusiness.overseastripapp.forbiddenReviewTitle') }}</h2>
        <p class="forbidden-result__desc">{{ t('formbusiness.overseastripapp.forbiddenReviewSubTitle') }}</p>
        <span class="result-back-link" @click="closeCurrentPage">[ {{ t('formbusiness.overseastripapp.backToFormPending') }} ]</span>
      </div>
      <el-result
        v-else
        class="result-content"
        :class="{ 'result-content--bad-request': resultState.variant === 'badRequest' }"
        :icon="resultState.status"
        :title="resultState.variant === 'badRequest' ? resultState.detailMessage : t(resultState.titleKey)"
      >
        <template #sub-title>
          <p v-if="resultState.variant === 'badRequest'" class="overseastripapp-bad-request-desc">
            {{ t('formbusiness.overseastripapp.badRequestHint') }}
          </p>
          <span v-else>{{ t(resultState.subTitleKey) }}</span>
        </template>
        <template #extra>
          <span class="result-back-link" @click="closeCurrentPage">[ {{ t('formbusiness.overseastripapp.backToFormPending') }} ]</span>
        </template>
      </el-result>
    </el-card>

    <template v-else>
    <el-card class="leave-form-card" shadow="never">
      <div class="form-title-row">
        <h2 class="form-title">{{ t('formbusiness.overseastripapp.formTitle') }}</h2>
      </div>
      <el-divider style="margin: 22px 0;"></el-divider>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="leave-form" :validate-on-rule-change="false">

        <el-row v-if="isAnyStepFieldVisible(['FormNo', 'ApplyDate'])" :gutter="16" class="basic-info-row" style="justify-content: flex-start;">
          <el-col v-if="isStepFieldVisible('FormNo')" :span="8">
            <el-form-item :label="t('formbusiness.overseastripapp.formNo')" prop="formNo">
              <el-input v-model="form.formNo" :disabled="!isStepFieldEditable('FormNo')" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('ApplyDate')" :span="8">
            <el-form-item :label="t('formbusiness.overseastripapp.applyDate')" prop="applyDate">
              <el-date-picker
                v-model="form.applyDate"
                type="date"
                value-format="YYYY-MM-DD"
                :placeholder="t('formbusiness.overseastripapp.pleaseSelectApplyDate')"
                :disabled="!isStepFieldEditable('ApplyDate')"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row
          v-if="isAnyStepFieldVisible(['UserNo', 'UserName', 'Department'])"
          :gutter="16"
          align="middle"
          class="basic-info-row"
        >
          <el-col v-if="isStepFieldVisible('UserNo')" :span="8">
            <el-form-item :label="t('formbusiness.overseastripapp.applicantUserNo')" prop="applicantUserNo">
              <el-input v-model="form.applicantUserNo" :disabled="!isStepFieldEditable('UserNo')" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('UserName')" :span="8">
            <el-form-item :label="t('formbusiness.overseastripapp.applicantUserName')" prop="applicantUserName">
              <el-input v-model="form.applicantUserName" :disabled="!isStepFieldEditable('UserName')" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('Department')" :span="8">
            <el-form-item :label="t('formbusiness.overseastripapp.applicantDeptName')" prop="applicantDeptName">
              <el-input v-model="form.applicantDeptName" :disabled="!isStepFieldEditable('Department')" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider v-if="isAnyStepFieldVisible(['FormNo', 'ApplyDate', 'UserNo', 'UserName', 'Department'])"></el-divider>

        <el-row v-if="isAnyStepFieldVisible(['DepartureSite', 'DestinationSite'])" :gutter="16">
          <el-col v-if="isStepFieldVisible('DepartureSite')" :span="8">
            <el-form-item :label="t('formbusiness.overseastripapp.departureSite')" prop="departureSite">
              <el-select
                v-model="form.departureSite"
                :placeholder="t('formbusiness.overseastripapp.pleaseSelectDepartureSite')"
                clearable
                :disabled="!isStepFieldEditable('DepartureSite')"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in siteOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('DestinationSite')" :span="8">
            <el-form-item :label="t('formbusiness.overseastripapp.destinationSite')" prop="destinationSite">
              <el-select
                v-model="form.destinationSite"
                :placeholder="t('formbusiness.overseastripapp.pleaseSelectDestinationSite')"
                clearable
                :disabled="!isStepFieldEditable('DestinationSite')"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in siteOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('DestinationSite')" :span="1" class="destination-site-info-col">
            <el-tooltip effect="light" placement="right" trigger="click" raw-content popper-class="site-allowance-tooltip" :content="siteAllowanceTooltipHtml">
              <el-icon class="destination-site-info-icon"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-col>
        </el-row>

        <el-row v-if="isStepFieldVisible('TripReason')" :gutter="16">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.overseastripapp.tripReason')" prop="tripReason">
              <el-input
                v-model="form.tripReason"
                type="textarea"
                :rows="4"
                :placeholder="t('formbusiness.overseastripapp.pleaseInputTripReason')"
                :disabled="!isStepFieldEditable('TripReason')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isAnyStepFieldVisible(['OutboundTravel', 'ReturnTravel'])" :gutter="16">
          <el-col v-if="isStepFieldVisible('OutboundTravel')" :span="8">
            <el-form-item :label="t('formbusiness.overseastripapp.outboundTravel')" prop="outboundTravel">
              <el-select
                v-model="form.outboundTravel"
                :placeholder="t('formbusiness.overseastripapp.pleaseSelectOutboundTravel')"
                clearable
                :disabled="!isStepFieldEditable('OutboundTravel')"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in travelModeOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('ReturnTravel')" :span="8">
            <el-form-item :label="t('formbusiness.overseastripapp.returnTravel')" prop="returnTravel">
              <el-select
                v-model="form.returnTravel"
                :placeholder="t('formbusiness.overseastripapp.pleaseSelectReturnTravel')"
                clearable
                :disabled="!isStepFieldEditable('ReturnTravel')"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in travelModeOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isAnyStepFieldVisible(['StartDate', 'EndDate', 'Days'])" :gutter="16">
          <el-col v-if="isStepFieldVisible('StartDate')" :span="8">
            <el-form-item :label="t('formbusiness.overseastripapp.startDate')" prop="startDate">
              <el-date-picker
                v-model="form.startDate"
                type="date"
                value-format="YYYY-MM-DD"
                :placeholder="t('formbusiness.overseastripapp.pleaseSelectStartDate')"
                clearable
                :disabled="!isStepFieldEditable('StartDate')"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('EndDate')" :span="8">
            <el-form-item :label="t('formbusiness.overseastripapp.endDate')" prop="endDate">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                value-format="YYYY-MM-DD"
                :placeholder="t('formbusiness.overseastripapp.pleaseSelectEndDate')"
                clearable
                :disabled="!isStepFieldEditable('EndDate')"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('Days')" :span="8">
            <el-form-item :label="t('formbusiness.overseastripapp.days')" prop="days">
              <el-input v-model="form.days" :disabled="!isStepFieldEditable('Days')" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isStepFieldVisible('JobDescription')" :gutter="16">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.overseastripapp.jobDescription')" prop="jobDescription">
              <el-input
                v-model="form.jobDescription"
                type="textarea"
                :rows="4"
                :placeholder="t('formbusiness.overseastripapp.pleaseInputJobDescription')"
                :disabled="!isStepFieldEditable('JobDescription')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isStepFieldVisible('Upload') || uploadedAttachments.length > 0" :gutter="16" class="attachment-row">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.overseastripapp.attachments')">
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
                    {{ t('formbusiness.overseastripapp.uploadFile') }}
                  </el-button>
                </div>
                <el-table :data="uploadedAttachments" border size="small" class="attachment-table">
                  <el-table-column type="index" width="55" align="center" label="#" />
                  <el-table-column :label="t('formbusiness.overseastripapp.fileName')" min-width="150">
                    <template #default="{ row }">
                      <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" :title="getAttachmentName(row)">{{ getAttachmentName(row) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('formbusiness.overseastripapp.fileSize')" width="100" align="center">
                    <template #default="{ row }">
                      {{ formatFileSize(getAttachmentSizeKb(row)) }}
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('common.operation')" width="200" align="center">
                    <template #default="{ row, $index }">
                      <el-button
                        type="primary"
                        link
                        size="small"
                        :loading="attachmentActionKeys.has(getAttachmentKey(row))"
                        :disabled="attachmentActionKeys.has(getAttachmentKey(row))"
                        @click="handleDownload(row)"
                      >
                        {{ t('formbusiness.overseastripapp.download') }}
                      </el-button>
                      <el-button
                        type="danger"
                        link
                        size="small"
                        :loading="attachmentActionKeys.has(getAttachmentKey(row))"
                        :disabled="!isStepFieldEditable('Upload') || attachmentActionKeys.has(getAttachmentKey(row))"
                        @click="removeAttachment(row, $index)"
                      >
                        {{ t('formbusiness.overseastripapp.deleteFile') }}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider v-if="isAddReviewVisible()" class="add-review-divider"></el-divider>

        <!-- 加审人员：固定 5 行，顺序 1-5 -->
        <el-row v-if="isAddReviewVisible()" :gutter="16" class="add-review-row">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.overseastripapp.addReview')">
              <el-table ref="addReviewTableRef" :data="addReviewRows" border size="small" class="add-review-table" row-key="_uid">
                <el-table-column width="40" align="center">
                  <template #default>
                    <el-icon
                      class="add-review-drag-handle"
                      :class="{ 'is-disabled': !isAddReviewEditable() }"
                      :title="t('formbusiness.overseastripapp.addReviewDragTip')"
                    >
                      <Rank />
                    </el-icon>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sortOrder"
                  :label="t('formbusiness.overseastripapp.addReviewSortOrder')"
                  width="70"
                  align="center"
                />
                <el-table-column
                  prop="deptName"
                  :label="t('formbusiness.overseastripapp.addReviewDepartment')"
                  min-width="200"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="userNo"
                  :label="t('formbusiness.overseastripapp.addReviewUserNo')"
                  width="120"
                />
                <el-table-column
                  prop="userName"
                  :label="t('formbusiness.overseastripapp.addReviewUserName')"
                  width="130"
                  show-overflow-tooltip
                />
                <el-table-column :label="t('common.operation')" width="150" align="center">
                  <template #default="{ row }">
                    <el-button
                      type="primary"
                      link
                      size="small"
                      :disabled="!isAddReviewEditable()"
                      @click="openAddReviewDialog(row)"
                    >
                      {{ row.userId ? t('formbusiness.overseastripapp.addReviewChange') : t('formbusiness.overseastripapp.addReviewSelect') }}
                    </el-button>
                    <el-button
                      v-if="row.userId"
                      type="danger"
                      link
                      size="small"
                      :loading="addReviewClearingKeys.has(row._uid)"
                      :disabled="!isAddReviewEditable() || addReviewClearingKeys.has(row._uid)"
                      @click="clearAddReviewRow(row)"
                    >
                      {{ t('formbusiness.overseastripapp.addReviewClear') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider class="approval-divider"></el-divider>

        <el-row v-if="isStepFieldVisible('Comments')" :gutter="16" class="approval-comment-row">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.overseastripapp.approvalComment')">
              <el-input
                v-model="approvalComment"
                type="textarea"
                :rows="3"
                :placeholder="t('formbusiness.overseastripapp.approvalCommentPlaceholder')"
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
                  <el-button v-if="isStepFieldVisible('Save')" type="primary" round style="width:80px;" @click="onSubmit" :loading="saving" :disabled="formActionLoading || !isStepFieldEditable('Save')">{{ t('formbusiness.overseastripapp.saveButton') }}</el-button>
                  <el-button v-if="isStepFieldVisible('Submit')" type="success" round style="width:80px;" @click="onSubmitForApproval" :loading="approving" :disabled="formActionLoading || !isStepFieldEditable('Submit')">{{ t('formbusiness.overseastripapp.submitButton') }}</el-button>
                  <el-button v-if="isStepFieldVisible('Reject')" type="danger" round style="width:80px;" @click="onReject" :disabled="formActionLoading || !isStepFieldEditable('Reject')">{{ t('formbusiness.overseastripapp.rejectButton') }}</el-button>
                </div>
                <div class="workflow-view-entry">
                  <div class="workflow-view-hint">
                    <span class="workflow-view-hint-text">{{ t('formbusiness.overseastripapp.viewFullWorkflowHint') }}</span>
                  </div>
                  <el-tooltip :content="t('formbusiness.overseastripapp.viewFullWorkflow')" placement="top">
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

    <ReviewLogCard :records="reviewRecordList" i18n-prefix="formbusiness.overseastripapp" />

    </template>

    <RejectDialog
      v-model:visible="rejectDialogVisible"
      :options="rejectStepDropOptions"
      i18n-prefix="formbusiness.overseastripapp"
      @confirm="handleRejectConfirm"
    />

    <el-dialog
      v-model="addReviewDialogVisible"
      :title="t('formbusiness.overseastripapp.addReviewDialogTitle')"
      width="1100px"
      :close-on-click-modal="false"
      :append-to-body="true"
      destroy-on-close
      @closed="onAddReviewDialogClosed"
    >
      <el-form :inline="true" class="add-review-filter-form">
        <el-form-item :label="t('formbusiness.overseastripapp.addReviewDepartmentFilter')">
          <el-tree-select
            v-model="addReviewFilters.departmentId"
            :data="addReviewDeptOptions"
            :props="{
              value: 'departmentId',
              label: 'departmentName',
              children: 'departmentChildList',
              disabled: 'disabled'
            }"
            check-strictly
            filterable
            :filter-node-method="filterAddReviewDeptNode"
            class="add-review-filter-dept-select"
            popper-class="overseastripapp-dept-tree-popper"
            :placeholder="t('formbusiness.overseastripapp.addReviewPleaseSelectDepartment')"
            @change="handleAddReviewDepartmentChange"
          />
        </el-form-item>
        <el-form-item :label="t('formbusiness.overseastripapp.applicantUserNo')">
          <el-input
            v-model="addReviewFilters.userNo"
            class="add-review-filter-input-userno"
            clearable
            :placeholder="t('formbusiness.overseastripapp.applicantUserNo')"
            @input="handleAddReviewFilterInput"
            @keyup.enter="handleAddReviewSearch"
            @clear="handleAddReviewFilterInput"
          />
        </el-form-item>
        <el-form-item :label="t('formbusiness.overseastripapp.applicantUserName')">
          <el-input
            v-model="addReviewFilters.userName"
            class="add-review-filter-input-compact"
            clearable
            :placeholder="t('formbusiness.overseastripapp.applicantUserName')"
            @input="handleAddReviewFilterInput"
            @keyup.enter="handleAddReviewSearch"
            @clear="handleAddReviewFilterInput"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain :loading="addReviewListLoading" @click="handleAddReviewSearch">{{ t('common.search') }}</el-button>
          <el-button :disabled="addReviewListLoading" @click="handleAddReviewReset">{{ t('common.reset') }}</el-button>
        </el-form-item>
      </el-form>
      <div
        class="add-review-table-wrap"
        v-loading="addReviewListLoading"
        :element-loading-text="t('common.loading')"
      >
        <el-table
          :data="addReviewUserList"
          border
          stripe
          max-height="360"
          class="add-review-select-table"
          :header-cell-style="{ background: '#f5f7fa' }"
          :row-key="(row) => row.userId"
          :empty-text="t('common.noData')"
          @row-click="handleAddReviewRowClick"
        >
          <el-table-column width="48" align="center">
            <template #default="scope">
              <el-radio :model-value="selectedAddReviewUserId"
                        :value="String(scope.row.userId)"
                        @click.stop="handleAddReviewRowClick(scope.row)">
                <span></span>
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="userNo" :label="t('formbusiness.overseastripapp.applicantUserNo')" min-width="110" align="center" />
          <el-table-column prop="userName" :label="t('formbusiness.overseastripapp.applicantUserName')" min-width="120" align="left" show-overflow-tooltip />
          <el-table-column :label="t('formbusiness.overseastripapp.addReviewDepartment')" min-width="160" align="left" show-overflow-tooltip>
            <template #default="{ row }">{{ row.deptName || row.departmentName || '' }}</template>
          </el-table-column>
        </el-table>
      </div>
      <div class="add-review-pagination">
        <el-pagination
          v-model:current-page="addReviewPagination.pageIndex"
          v-model:page-size="addReviewPagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="addReviewPagination.totalCount"
          layout="total, sizes, prev, pager, next"
          @size-change="handleAddReviewSizeChange"
          @current-change="handleAddReviewPageChange"
        />
      </div>
      <template #footer>
        <el-button @click="addReviewDialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :disabled="!selectedAddReviewUser" @click="confirmAddReviewUser">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <WorkflowDrawer
      :visible="workflowDrawerVisible"
      @update:visible="workflowDrawerVisible = $event"
      :loading="workflowDrawerLoading"
      :overview="workflowOverview"
      i18n-prefix="formbusiness.overseastripapp"
    />
    </el-config-provider>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import i18n from '@/i18n'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { Upload, Lock, Rank, QuestionFilled } from '@element-plus/icons-vue'
import Sortable from 'sortablejs'
import ReviewLogCard from '../components/reviewlogcard.vue'
import WorkflowDrawer from '../components/workflowdrawer.vue'
import RejectDialog from '../components/rejectdialog.vue'
import { post, isHandled } from '@/utils/request'
import {
  INIT_OVERSEASTRIPAPP_API,
  GET_OVERSEASTRIPAPP_API,
  SAVE_OVERSEASTRIPAPP_API,
  UPLOAD_FILE_API,
  DELETE_FILE_API,
  GET_FULL_REVIEW_FLOW_API,
  GET_REJECT_STEP_DROP_API,
  APPROVE_OVERSEASTRIPAPP_API,
  REJECT_OVERSEASTRIPAPP_API,
  GET_FORM_NOTIFY_TOKEN_API,
  GET_ADD_REVIEW_DEPARTMENT_DROP_API,
  GET_ADD_REVIEW_USER_PAGE_API,
  INSERT_FORM_ADD_REVIEW_API,
  UPDATE_FORM_ADD_REVIEW_API,
  DELETE_FORM_ADD_REVIEW_API,
  GET_TRAVEL_MODE_DROP_API,
  GET_SITE_DROP_API
} from '@/config/api/formbusiness/forms/overseastripapp'
import { resolveFileUrl, downloadFileFromUrl } from '@/utils/fileUrl'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePMenuStore } from '@/stores/pmenu'
import { MODULE_API } from '@/config/api/modulemenu/menu'
import { normalizeRouteLang, persistRouteLanguage } from '@/utils/routeLanguage'
import { getLocationQueryParam } from '@/utils/hashRouteBootstrap'

const { t, locale } = i18n.global

const elementPlusLocale = computed(() => (locale.value === 'en-US' ? en : zhCn))

const FORM_PENDING_ROUTE_PATH = '/formbusiness/form-operate/formpending'
const FORMBUSINESS_MODULE_PATH = 'formbusiness'

const formRef = ref(null)
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const pmenuStore = usePMenuStore()

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
  titleKey: 'formbusiness.overseastripapp.approvalResultTitle',
  subTitleKey: 'formbusiness.overseastripapp.approvalResultSubTitle'
})

const approvalComment = ref('')
const reviewRecordList = ref([])
const stepFieldPermissionMap = ref({})
const rejectStepDropOptions = ref([])
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
  departureSite: '',
  departureSiteName: '',
  destinationSite: '',
  tripReason: '',
  startDate: '',
  endDate: '',
  days: '',
  outboundTravel: '',
  returnTravel: '',
  jobDescription: ''
})

/** 目的厂区不能与出发厂区相同 */
function validateDestinationSite (rule, value, callback) {
  if (value && form.departureSite && String(value) === String(form.departureSite)) {
    callback(new Error(t('formbusiness.overseastripapp.destinationSiteSameAsDeparture')))
    return
  }
  callback()
}

// 出发厂区变更时，联动重新校验目的厂区是否与之重复
watch(() => form.departureSite, () => {
  formRef.value?.validateField('destinationSite', () => {})
})

/** 结束日期不能早于开始日期 */
function validateTripDateRange (rule, value, callback) {
  if (!form.startDate || !form.endDate) {
    callback()
    return
  }
  const startTime = new Date(form.startDate).getTime()
  const endTime = new Date(form.endDate).getTime()
  if (!Number.isNaN(startTime) && !Number.isNaN(endTime) && endTime < startTime) {
    callback(new Error(t('formbusiness.overseastripapp.dateRangeInvalid')))
    return
  }
  callback()
}

// 仅对当前步骤可编辑的栏位做必填校验：只读栏位用户改不了，必填会让保存/送审无法进行
const rules = computed(() => {
  const requiredWhenEditable = (fieldKey, messageKey, trigger) =>
    isStepFieldEditable(fieldKey)
      ? [{ required: true, message: t(messageKey), trigger }]
      : []

  return {
    destinationSite: [
      ...requiredWhenEditable('DestinationSite', 'formbusiness.overseastripapp.pleaseSelectDestinationSite', 'change'),
      ...(isStepFieldEditable('DestinationSite') ? [{ validator: validateDestinationSite, trigger: 'change' }] : [])
    ],
    tripReason: requiredWhenEditable('TripReason', 'formbusiness.overseastripapp.pleaseInputTripReason', 'blur'),
    startDate: [
      ...requiredWhenEditable('StartDate', 'formbusiness.overseastripapp.pleaseSelectStartDate', 'change'),
      ...(isStepFieldEditable('StartDate') ? [{ validator: validateTripDateRange, trigger: 'change' }] : [])
    ],
    endDate: [
      ...requiredWhenEditable('EndDate', 'formbusiness.overseastripapp.pleaseSelectEndDate', 'change'),
      ...(isStepFieldEditable('EndDate') ? [{ validator: validateTripDateRange, trigger: 'change' }] : [])
    ],
    outboundTravel: requiredWhenEditable('OutboundTravel', 'formbusiness.overseastripapp.pleaseSelectOutboundTravel', 'change'),
    returnTravel: requiredWhenEditable('ReturnTravel', 'formbusiness.overseastripapp.pleaseSelectReturnTravel', 'change'),
    jobDescription: requiredWhenEditable('JobDescription', 'formbusiness.overseastripapp.pleaseInputJobDescription', 'blur')
  }
})

/** 开始/结束日期互相联动重新校验，避免只改一个时另一个的报错没刷新 */
watch([() => form.startDate, () => form.endDate], ([start, end]) => {
  formRef.value?.validateField(['startDate', 'endDate'], () => {})

  if (!start || !end) {
    form.days = ''
    return
  }
  const startTime = new Date(start).getTime()
  const endTime = new Date(end).getTime()
  if (Number.isNaN(startTime) || Number.isNaN(endTime) || endTime < startTime) {
    form.days = ''
    return
  }
  const diffDays = Math.round((endTime - startTime) / 86400000) + 1
  form.days = String(diffDays)
})

const travelModeOptions = ref([])

async function loadTravelModeOptions () {
  try {
    const res = await post(GET_TRAVEL_MODE_DROP_API, {})
    const raw = res && isSuccessCode(res.code) && Array.isArray(res.data) ? res.data : []
    travelModeOptions.value = raw.map((item) => ({
      code: item.travelMode,
      name: item.travelModeName
    }))
  } catch {
    travelModeOptions.value = []
  }
}

const siteOptions = ref([])

async function loadSiteOptions () {
  try {
    const res = await post(GET_SITE_DROP_API, {})
    const raw = res && isSuccessCode(res.code) && Array.isArray(res.data) ? res.data : []
    siteOptions.value = raw.map((item) => ({
      code: item.site,
      name: item.siteName
    }))
  } catch {
    siteOptions.value = []
  }
}

/** 厂区间每日出差补助，仅作前端提示用，非后端数据 */
const SITE_ALLOWANCE_ORDER = ['ESK', 'ESC', 'ETW', 'EGY', 'ESV', 'EMJ', 'ESH', 'MTY']
/** key 一律按字母升序拼接，与 getSiteAllowanceAmount 排序后的 key 保持一致，避免查不到误判为 0 */
const SITE_ALLOWANCE_AMOUNTS = {
  'EGY-EMJ': 70, 'EGY-ESC': 60, 'EGY-ESH': 150, 'EGY-ESK': 60, 'EGY-ESV': 65, 'EGY-ETW': 40, 'EGY-MTY': 150,
  'EMJ-ESC': 75, 'EMJ-ESH': 145, 'EMJ-ESK': 75, 'EMJ-ESV': 55, 'EMJ-ETW': 70, 'EMJ-MTY': 145,
  'ESC-ESH': 150, 'ESC-ESK': 30, 'ESC-ESV': 70, 'ESC-ETW': 60, 'ESC-MTY': 150,
  'ESH-ESK': 150, 'ESH-ESV': 140, 'ESH-ETW': 150, 'ESH-MTY': 60,
  'ESK-ESV': 70, 'ESK-ETW': 60, 'ESK-MTY': 150,
  'ESV-ETW': 65, 'ESV-MTY': 140,
  'ETW-MTY': 150
}

function getSiteAllowanceAmount (codeA, codeB) {
  if (codeA === codeB) return 0
  const key = [codeA, codeB].sort().join('-')
  return SITE_ALLOWANCE_AMOUNTS[key] ?? 0
}

function formatAllowanceAmount (amount) {
  return `$${amount.toLocaleString('en-US')}`
}

const siteAllowanceTooltipHtml = computed(() => {
  const codes = SITE_ALLOWANCE_ORDER
  const departure = form.departureSite
  const destination = form.destinationSite

  const descHtml = `<div class="site-allowance-desc">${t('formbusiness.overseastripapp.siteAllowanceDesc')}</div>`

  if (!departure) {
    return `${descHtml}<div class="site-allowance-empty">${t('formbusiness.overseastripapp.siteAllowanceEmpty')}</div>`
  }

  const destLabel = t('formbusiness.overseastripapp.siteAllowanceDestLabel')
  const amountLabel = t('formbusiness.overseastripapp.siteAllowanceAmountLabel')
  const rows = codes
    .filter((code) => code !== departure)
    .map((code) => {
      const amount = getSiteAllowanceAmount(departure, code)
      const isCurrentRow = code === destination
      return `<tr${isCurrentRow ? ' class="is-current-rule"' : ''}><th>${t(`formbusiness.overseastripapp.siteAllowanceNames.${code}`)}</th><td>${formatAllowanceAmount(amount)}</td></tr>`
    }).join('')
  return `${descHtml}<table class="site-allowance-table"><thead><tr><th>${destLabel}</th><th>${amountLabel}</th></tr></thead><tbody>${rows}</tbody></table>`
})

onBeforeUnmount(() => {
  clearAddReviewSearchTimer()
  destroyAddReviewSortable()
})

const rejectDialogVisible = ref(false)

const uploading = ref(false)
const uploadedAttachments = ref([])
const fileInputRef = ref(null)

/* ---------------- 加审人员 ---------------- */

const ADD_REVIEW_MAX_ROWS = 5
// 权限键缺失时 isStepFieldVisible/Editable 默认返回 true，故用 every：任一拼写判否即生效
const ADD_REVIEW_FIELD_KEYS = ['AddReview', 'AddReivew']

const createAddReviewRows = () =>
  Array.from({ length: ADD_REVIEW_MAX_ROWS }, (_, idx) => ({
    _uid: `add-review-row-${idx}`,
    sortOrder: idx + 1,
    userId: '',
    userNo: '',
    userName: '',
    deptName: '',
    persisted: false,
    dirty: false
  }))

const addReviewRows = ref(createAddReviewRows())
const addReviewDialogVisible = ref(false)
const addReviewTargetSortOrder = ref(0)
const addReviewDeptOptions = ref([])
const addReviewUserList = ref([])
const addReviewListLoading = ref(false)
const selectedAddReviewUser = ref(null)
const selectedAddReviewUserId = ref('')
const addReviewFilters = reactive({ departmentId: '', userNo: '', userName: '' })
const addReviewPagination = reactive({ pageIndex: 1, pageSize: 10, totalCount: 0 })
const ADD_REVIEW_SEARCH_DEBOUNCE_MS = 300
let addReviewSearchTimer = null
let addReviewListRequestId = 0

/** 详情反填：按 sortOrder 归位，顺序缺失或越界则顺延填入空行 */
function applyAddReviewList (list) {
  const rows = createAddReviewRows()
  if (Array.isArray(list)) {
    for (const item of list) {
      if (!item) continue
      const userId = item.userId
      if (userId == null || String(userId) === '') continue
      const sortOrder = Number(item.sortOrder)
      const row = (Number.isInteger(sortOrder) && sortOrder >= 1 && sortOrder <= ADD_REVIEW_MAX_ROWS)
        ? rows[sortOrder - 1]
        : rows.find((r) => !r.userId)
      if (!row) continue
      row.userId = String(userId)
      row.userNo = item.userNo ?? ''
      row.userName = item.userName ?? ''
      row.deptName = item.deptName ?? ''
      row.persisted = true
      row.dirty = false
    }
  }
  addReviewRows.value = rows
}

function filterAddReviewDeptNode (value, data) {
  if (!value || !data?.departmentName) return true
  return data.departmentName.includes(value)
}

/** 取树中第一个可选部门，逐层向下找 */
function findFirstEnabledAddReviewDept (departments) {
  for (const dept of departments) {
    if (!dept?.disabled) return dept.departmentId
    if (Array.isArray(dept.departmentChildList) && dept.departmentChildList.length > 0) {
      const childResult = findFirstEnabledAddReviewDept(dept.departmentChildList)
      if (childResult) return childResult
    }
  }
  return ''
}

function resolveDefaultAddReviewDepartmentId () {
  return findFirstEnabledAddReviewDept(addReviewDeptOptions.value) || ''
}

async function loadAddReviewDeptOptions () {
  if (addReviewDeptOptions.value.length > 0) return
  try {
    const res = await post(GET_ADD_REVIEW_DEPARTMENT_DROP_API, {}, { silentForbiddenError: false })
    const raw = res && isSuccessCode(res.code) && Array.isArray(res.data) ? res.data : []
    const validate = (dept) => {
      if (!dept || dept.departmentId == null || dept.departmentName == null) return false
      if (Array.isArray(dept.departmentChildList)) {
        dept.departmentChildList = dept.departmentChildList.filter(validate)
      }
      return true
    }
    addReviewDeptOptions.value = raw.filter(validate)
  } catch {
    addReviewDeptOptions.value = []
  }
}

async function fetchAddReviewUserList () {
  const requestId = ++addReviewListRequestId
  addReviewListLoading.value = true
  try {
    const res = await post(GET_ADD_REVIEW_USER_PAGE_API, {
      formId: String(form.formId || ''),
      departmentId: addReviewFilters.departmentId || '',
      userNo: addReviewFilters.userNo || '',
      userName: addReviewFilters.userName || '',
      pageIndex: String(addReviewPagination.pageIndex),
      pageSize: String(addReviewPagination.pageSize),
      totalCount: String(addReviewPagination.totalCount || 0)
    }, { silentForbiddenError: false })
    if (requestId !== addReviewListRequestId) return
    if (!res || !isSuccessCode(res.code)) {
      addReviewUserList.value = []
      addReviewPagination.totalCount = 0
      return
    }
    addReviewUserList.value = Array.isArray(res.data) ? res.data : []
    addReviewPagination.totalCount = Number(res.totalCount) || 0
  } catch {
    if (requestId !== addReviewListRequestId) return
    addReviewUserList.value = []
    addReviewPagination.totalCount = 0
  } finally {
    if (requestId === addReviewListRequestId) {
      addReviewListLoading.value = false
    }
  }
}

function clearAddReviewSearchTimer () {
  if (addReviewSearchTimer) {
    clearTimeout(addReviewSearchTimer)
    addReviewSearchTimer = null
  }
}

function scheduleAddReviewListFetch () {
  clearAddReviewSearchTimer()
  addReviewSearchTimer = setTimeout(() => {
    addReviewSearchTimer = null
    fetchAddReviewUserList()
  }, ADD_REVIEW_SEARCH_DEBOUNCE_MS)
}

function fetchAddReviewUserListImmediate () {
  clearAddReviewSearchTimer()
  return fetchAddReviewUserList()
}

function handleAddReviewFilterInput () {
  addReviewPagination.pageIndex = 1
  scheduleAddReviewListFetch()
}

function handleAddReviewSearch () {
  addReviewPagination.pageIndex = 1
  fetchAddReviewUserListImmediate()
}

function handleAddReviewReset () {
  addReviewFilters.departmentId = resolveDefaultAddReviewDepartmentId()
  addReviewFilters.userNo = ''
  addReviewFilters.userName = ''
  addReviewPagination.pageIndex = 1
  fetchAddReviewUserListImmediate()
}

function handleAddReviewDepartmentChange () {
  addReviewPagination.pageIndex = 1
  scheduleAddReviewListFetch()
}

function handleAddReviewPageChange () {
  fetchAddReviewUserListImmediate()
}

function handleAddReviewSizeChange () {
  addReviewPagination.pageIndex = 1
  fetchAddReviewUserListImmediate()
}

function handleAddReviewRowClick (row) {
  if (!row?.userId) return
  const isSelected = String(selectedAddReviewUserId.value) === String(row.userId)
  if (isSelected) {
    selectedAddReviewUserId.value = ''
    selectedAddReviewUser.value = null
  } else {
    selectedAddReviewUserId.value = String(row.userId)
    selectedAddReviewUser.value = row
  }
}

async function openAddReviewDialog (row) {
  addReviewTargetSortOrder.value = row.sortOrder
  selectedAddReviewUserId.value = row.userId ? String(row.userId) : ''
  selectedAddReviewUser.value = row.userId
    ? { userId: row.userId, userNo: row.userNo, userName: row.userName, deptName: row.deptName }
    : null
  addReviewFilters.userNo = ''
  addReviewFilters.userName = ''
  addReviewPagination.pageIndex = 1
  addReviewPagination.totalCount = 0
  addReviewUserList.value = []
  addReviewDialogVisible.value = true
  await loadAddReviewDeptOptions()
  addReviewFilters.departmentId = resolveDefaultAddReviewDepartmentId()
  await fetchAddReviewUserListImmediate()
}

function onAddReviewDialogClosed () {
  clearAddReviewSearchTimer()
  addReviewListRequestId += 1
  addReviewListLoading.value = false
  addReviewUserList.value = []
  addReviewPagination.totalCount = 0
  selectedAddReviewUser.value = null
  selectedAddReviewUserId.value = ''
  addReviewTargetSortOrder.value = 0
}

/** 保存单行加审人员：该顺序已落库走 Update，否则走 Insert；静默不提示 */
async function saveAddReviewRow (row, isUpdate) {
  const formId = String(form.formId || '')
  if (!formId || !row.userId) return
  try {
    const res = await post(
      isUpdate ? UPDATE_FORM_ADD_REVIEW_API : INSERT_FORM_ADD_REVIEW_API,
      {
        formId,
        deptName: row.deptName || '',
        userId: String(row.userId),
        userNo: row.userNo || '',
        userName: row.userName || '',
        sortOrder: String(row.sortOrder)
      },
      { silentForbiddenError: false }
    )
    if (res && isSuccessCode(res.code)) {
      row.persisted = true
      row.dirty = false
    }
  } catch {
    // 静默：失败时保留 dirty，保存表单时再补一次
  }
}

async function confirmAddReviewUser () {
  const user = selectedAddReviewUser.value
  const row = addReviewRows.value.find((r) => r.sortOrder === addReviewTargetSortOrder.value)
  if (!user?.userId || !row) {
    addReviewDialogVisible.value = false
    return
  }
  const isUpdate = row.persisted
  row.userId = String(user.userId)
  row.userNo = user.userNo ?? ''
  row.userName = user.userName ?? ''
  row.deptName = user.deptName ?? user.departmentName ?? ''
  row.dirty = true
  addReviewDialogVisible.value = false
  await saveAddReviewRow(row, isUpdate)
}

/** 删除某一顺序在后端的加审记录，静默失败 */
async function deleteAddReviewRecord (sortOrder, userId) {
  const formId = String(form.formId || '')
  if (!formId || !userId) return
  try {
    const formData = new window.FormData()
    formData.append('formId', formId)
    formData.append('userId', String(userId))
    formData.append('sortOrder', String(sortOrder))
    await post(DELETE_FORM_ADD_REVIEW_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true,
      silentForbiddenError: false
    })
  } catch {
    // 静默：删除失败不打断页面操作
  }
}

const addReviewClearingKeys = reactive(new Set())

/** 清空该行：已落库则先删除，全程静默不提示 */
async function clearAddReviewRow (row) {
  if (addReviewClearingKeys.has(row._uid)) return
  addReviewClearingKeys.add(row._uid)
  try {
    if (row.persisted && row.userId) {
      await deleteAddReviewRecord(row.sortOrder, row.userId)
    }
    row.userId = ''
    row.userNo = ''
    row.userName = ''
    row.deptName = ''
    row.persisted = false
    row.dirty = false
  } finally {
    addReviewClearingKeys.delete(row._uid)
  }
}

async function handleAddReviewDragEnd (oldIndex, newIndex) {
  if (!isAddReviewEditable() || oldIndex === newIndex || oldIndex == null || newIndex == null) return

  const rows = addReviewRows.value
  const previousPersistedByPosition = rows.map((r) => r.persisted)
  const previousUserIdByPosition = rows.map((r) => r.userId)

  const [movedRow] = rows.splice(oldIndex, 1)
  rows.splice(newIndex, 0, movedRow)

  const start = Math.min(oldIndex, newIndex)
  const end = Math.max(oldIndex, newIndex)
  const tasks = []
  rows.forEach((row, idx) => {
    row.sortOrder = idx + 1
    if (idx < start || idx > end) return
    row.persisted = previousPersistedByPosition[idx]
    tasks.push(syncAddReviewRowAfterReorder(row, previousUserIdByPosition[idx]))
  })
  await Promise.all(tasks)
}

const addReviewTableRef = ref(null)
let addReviewSortableInstance = null

function destroyAddReviewSortable () {
  addReviewSortableInstance?.destroy()
  addReviewSortableInstance = null
}

async function setupAddReviewSortable () {
  await nextTick()
  const tbody = addReviewTableRef.value?.$el?.querySelector('.el-table__body-wrapper tbody')
  if (!tbody) return
  destroyAddReviewSortable()
  addReviewSortableInstance = Sortable.create(tbody, {
    handle: '.add-review-drag-handle',
    animation: 150,
    disabled: !isAddReviewEditable(),
    onEnd (evt) {
      handleAddReviewDragEnd(evt.oldIndex, evt.newIndex)
    }
  })
}

const isAddReviewSectionMounted = computed(() => !loading.value && !resultState.visible && isAddReviewVisible())

watch(isAddReviewSectionMounted, (mounted) => {
  if (mounted) setupAddReviewSortable()
  else destroyAddReviewSortable()
})

watch(() => isAddReviewEditable(), (editable) => {
  addReviewSortableInstance?.option('disabled', !editable)
})

onMounted(() => {
  if (isAddReviewSectionMounted.value) setupAddReviewSortable()
})

/** 重排内容后同步该行：仍有数据则按该顺序原有落库状态新增/更新；变空且原有记录则删除旧记录 */
async function syncAddReviewRowAfterReorder (row, previousUserId) {
  if (row.userId) {
    row.dirty = true
    await saveAddReviewRow(row, row.persisted)
    return
  }
  if (row.persisted) {
    await deleteAddReviewRecord(row.sortOrder, previousUserId)
    row.persisted = false
    row.dirty = false
  }
}

/** 保存表单前补发未成功落库的加审行 */
async function syncAddReviewRows () {
  for (const row of addReviewRows.value) {
    if (!row.dirty || !row.userId) continue
    await saveAddReviewRow(row, row.persisted)
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
        const message = res?.message || t('formbusiness.overseastripapp.workflowLoadFailed')
        showFormActionNotice(message, Number(res?.code) === 400 ? 'warning' : 'error')
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
    showFormActionNotice(t('formbusiness.overseastripapp.workflowLoadFailed'), 'error')
  } finally {
    workflowDrawerLoading.value = false
  }
}

function openWorkflowDrawer () {
  if (!form.formId) {
    ElMessage.warning(t('formbusiness.overseastripapp.workflowNeedFormId'))
    return
  }
  workflowDrawerVisible.value = true
  fetchFullReviewFlow()
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
      const fieldKey = item?.fieldKey ?? item?.FieldKey ?? item?.fieldName ?? item?.FieldName
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

// 权限键缺失时 isStepFieldVisible/Editable 默认返回 true，故用 every：任一拼写判否即生效
function isAddReviewVisible () {
  return ADD_REVIEW_FIELD_KEYS.every((key) => isStepFieldVisible(key))
}

function isAddReviewEditable () {
  return ADD_REVIEW_FIELD_KEYS.every((key) => isStepFieldEditable(key))
}

function isForbiddenCode (code) {
  return String(code) === '403'
}

/** 402：业务性校验未通过，以告警而非错误呈现 */
function isValidationWarningCode (code) {
  return String(code) === '402'
}

function isBadRequestResponse (res) {
  return Number(res?.code) === 400
}

function isSuccessCode (code) {
  return String(code) === '200'
}

function showResult (status, titleKey, subTitleKey) {
  resultState.variant = 'standard'
  resultState.detailMessage = ''
  resultState.visible = true
  resultState.status = status
  resultState.titleKey = titleKey
  resultState.subTitleKey = subTitleKey
}

function getFirstValidateErrorMessage (invalidFields) {
  const firstField = Object.values(invalidFields || {})[0]
  return firstField?.[0]?.message || t('formbusiness.overseastripapp.validateFailed')
}

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
  resultState.titleKey = 'formbusiness.overseastripapp.forbiddenReviewTitle'
  resultState.subTitleKey = 'formbusiness.overseastripapp.forbiddenReviewSubTitle'
}

function showBadRequestResult (message) {
  const msg = typeof message === 'string' ? message.trim() : ''
  resultState.variant = 'badRequest'
  resultState.detailMessage = msg || t('formbusiness.overseastripapp.badRequestFallbackMessage')
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

/** 弹出窗口才能被 window.close() 关闭，否则浏览器会拦截，此时改为跳转回待签核列表 */
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

/** 签核完成后关闭当前页面并通知父页面刷新；非脚本打开的页面关不掉，改为跳转回待签核列表 */
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

/** 后端日期字段常带 T00:00:00 等时间部分，date-picker 的 value-format 是 YYYY-MM-DD，需先截掉时间部分 */
function toDateOnly (val) {
  if (!val) return ''
  const text = String(val).trim()
  return text.length >= 10 ? text.slice(0, 10) : text
}

async function bindFormData (data) {
  Object.assign(form, {
    formId: data.formId != null ? String(data.formId) : '',
    formNo: data.formNo || '',
    formStatus: data.formStatus || '',
    formStatusName: data.formStatusName || '',
    applyDate: toDateOnly(data.applicantDate),
    applicantUserNo: data.applicantUserNo || '',
    applicantUserName: data.applicantUserName || '',
    applicantDeptName: data.applicantDeptName || '',
    departureSite: data.departureSite || '',
    departureSiteName: data.departureSiteName || '',
    destinationSite: data.destinationSite || '',
    tripReason: data.tripReason || '',
    startDate: toDateOnly(data.startDate),
    endDate: toDateOnly(data.endDate),
    days: data.days || '',
    outboundTravel: data.outboundTravel || '',
    returnTravel: data.returnTravel || '',
    jobDescription: data.jobDescription || ''
  })

  const attachmentList = data.attachment
  if (Array.isArray(attachmentList)) {
    uploadedAttachments.value = attachmentList.filter(Boolean)
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

  applyAddReviewList(data.addReview)

  if (form.formId) {
    const nextQuery = {
      ...route.query,
      formId: String(form.formId),
      formTypeId: String(currentFormTypeId.value || route.query.formTypeId || '')
    }
    router.replace({ path: route.path, query: nextQuery })
  }
}

async function getOverseasTripAppDetail (formId) {
  try {
    const res = await post(
      GET_OVERSEASTRIPAPP_API,
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
        showFormActionNotice(res.message, Number(res?.code) === 400 ? 'warning' : 'error')
      }
      return
    }
    await bindFormData(res.data || {})
    if (isStepFieldVisible('Reject')) {
      await fetchRejectStepDrop()
    }
  } catch {}
}

/** InitOverseasTripApp：新建出差申请单初始化。返回完整实体则直接 bind，仅返回 formId 时再拉详情 */
async function initOverseasTripApp () {
  try {
    const formData = new window.FormData()
    formData.append('formTypeId', currentFormTypeId.value || String(route.query.formTypeId || ''))
    const res = await post(INIT_OVERSEASTRIPAPP_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      silentForbiddenError: false
    })
    if (isForbiddenCode(res?.code)) {
      showForbiddenResult()
      return
    }
    if (!res || res.code !== 200) {
      if (isBadRequestResponse(res)) {
        showBadRequestResult(res?.message)
      } else if (res?.message) {
        showFormActionNotice(res.message, Number(res?.code) === 400 ? 'warning' : 'error')
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
    await getOverseasTripAppDetail(newFormId)
  } catch {}
}

function buildSaveOverseasTripAppPayload () {
  return {
    formId: String(form.formId || ''),
    destinationSite: form.destinationSite || null,
    tripReason: form.tripReason || null,
    startDate: form.startDate || null,
    endDate: form.endDate || null,
    days: form.days || '',
    outboundTravel: form.outboundTravel || null,
    returnTravel: form.returnTravel || null,
    jobDescription: form.jobDescription || null
  }
}

async function saveOverseasTripAppRequest () {
  // 先同步加审人员，再保存表单；保存与送审两条路径都经过这里
  await syncAddReviewRows()
  return post(SAVE_OVERSEASTRIPAPP_API, buildSaveOverseasTripAppPayload(), {
    silentForbiddenError: false
  })
}

async function onSubmit () {
  const valid = await new Promise((resolve) => {
    formRef.value?.validate((ok) => resolve(!!ok))
  })
  if (!valid) return
  saving.value = true
  try {
    const res = await saveOverseasTripAppRequest()
    if (isForbiddenCode(res?.code)) {
      showFormActionNotice(t('formbusiness.overseastripapp.forbiddenResultSubTitle'), 'warning')
    } else if (isHandled(res)) {
      // 请求未真正到达后端，request.js 已提示过一次
    } else if (res && isSuccessCode(res.code)) {
      if (!form.formId && res.data) form.formId = String(res.data)
      showFormActionNotice(res.message || t('messages.saveSuccess'), 'success')
    } else if (isValidationWarningCode(res?.code)) {
      showFormActionNotice(res?.message, 'warning')
    } else if (isBadRequestResponse(res)) {
      showFormActionNotice(res?.message || t('formbusiness.overseastripapp.badRequestFallbackMessage'), 'warning')
    } else {
      showFormActionNotice(res?.message || t('messages.saveError'), 'error')
    }
  } catch {} finally {
    saving.value = false
  }
}

async function saveOverseasTripAppBeforeSubmit () {
  const saveRes = await saveOverseasTripAppRequest()
  if (isForbiddenCode(saveRes?.code)) {
    showFormActionNotice(t('formbusiness.overseastripapp.forbiddenResultSubTitle'), 'warning')
    return false
  }
  if (isHandled(saveRes)) {
    return false
  }
  if (!saveRes || !isSuccessCode(saveRes.code)) {
    if (isValidationWarningCode(saveRes?.code)) {
      showFormActionNotice(saveRes?.message, 'warning')
    } else if (isBadRequestResponse(saveRes)) {
      showFormActionNotice(saveRes?.message || t('formbusiness.overseastripapp.badRequestFallbackMessage'), 'warning')
    } else {
      showFormActionNotice(saveRes?.message || t('messages.saveError'), 'error')
    }
    return false
  }
  if (!form.formId && saveRes.data) form.formId = String(saveRes.data)
  return true
}

/** 送审：校验 → 暂存 → 送审 */
async function onSubmitForApproval () {
  const invalidFields = await new Promise((resolve) => {
    formRef.value?.validate((valid, fields) => resolve(valid ? null : fields))
  })
  if (invalidFields) {
    showFormActionNotice(getFirstValidateErrorMessage(invalidFields), 'warning')
    return
  }
  try {
    await ElMessageBox.confirm(
      t('formbusiness.overseastripapp.submitConfirmMessage'),
      t('formbusiness.overseastripapp.submitConfirmTitle'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  approving.value = true
  try {
    const saved = await saveOverseasTripAppBeforeSubmit()
    if (!saved) return

    const formId = String(form.formId || '')
    if (!formId) {
      showFormActionNotice(t('formbusiness.overseastripapp.workflowNeedFormId'), 'warning')
      return
    }

    const res = await post(APPROVE_OVERSEASTRIPAPP_API, {
      formId,
      rejectStepId: '0',
      comment: approvalComment.value || ''
    }, {
      silentForbiddenError: false,
      silentAuthError: false,
      disableAutoLogout: true
    })
    if (isForbiddenCode(res?.code)) {
      showFormActionNotice(t('formbusiness.overseastripapp.forbiddenResultSubTitle'), 'warning')
      return
    }
    if (isHandled(res)) {
      return
    }
    if (res && isSuccessCode(res.code)) {
      showResult('success', 'formbusiness.overseastripapp.approvalResultTitle', 'formbusiness.overseastripapp.approvalResultSubTitle')
      return
    }
    if (isValidationWarningCode(res?.code)) {
      showFormActionNotice(res?.message, 'warning')
      return
    }
    if (isBadRequestResponse(res)) {
      showFormActionNotice(res?.message || t('formbusiness.overseastripapp.badRequestFallbackMessage'), 'warning')
      return
    }
    showFormActionNotice(res?.message || t('formbusiness.overseastripapp.submitFailed'), 'error')
  } catch {} finally {
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
        const message = res?.message || t('formbusiness.messages.loadError')
        showFormActionNotice(message, Number(res?.code) === 400 ? 'warning' : 'error')
      }
      rejectStepDropOptions.value = []
      return false
    }
    rejectStepDropOptions.value = Array.isArray(res.data) ? res.data : []
    return true
  } catch {
    rejectStepDropOptions.value = []
    showFormActionNotice(t('formbusiness.messages.loadError'), 'error')
    return false
  }
}

function onReject () {
  const formId = String(form.formId || '')
  if (!formId) {
    ElMessage.warning(t('formbusiness.overseastripapp.workflowNeedFormId'))
    return
  }
  rejectDialogVisible.value = true
}

async function handleRejectConfirm ({ rejectStepId, rejectReason }) {
  const formId = String(form.formId || '')
  if (!formId) {
    ElMessage.warning(t('formbusiness.overseastripapp.workflowNeedFormId'))
    return
  }

  await nextTick()

  rejecting.value = true
  try {
    const res = await post(REJECT_OVERSEASTRIPAPP_API, {
      formId,
      rejectStepId,
      comment: rejectReason
    }, { silentForbiddenError: false })

    if (isForbiddenCode(res?.code)) {
      showForbiddenResult()
      return
    }
    if (res && isSuccessCode(res.code)) {
      showResult('success', 'formbusiness.overseastripapp.rejectResultTitle', 'formbusiness.overseastripapp.rejectResultSubTitle')
      return
    }
    if (isBadRequestResponse(res)) {
      showBadRequestResult(res?.message)
      return
    }
    ElNotification({ title: '', message: res?.message || t('formbusiness.overseastripapp.rejectFailed'), type: 'error' })
  } catch {
    ElNotification({ title: '', message: t('formbusiness.overseastripapp.rejectFailed'), type: 'error' })
  } finally {
    rejecting.value = false
  }
}

function openFilePicker () {
  if (uploading.value) return
  fileInputRef.value?.click()
}

function onNativeFileChange (event) {
  const files = Array.from(event?.target?.files || [])
  if (files.length > 0) {
    batchUpload(files)
  }
}

async function batchUpload (filesToUpload) {
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
    } else if (isHandled(res)) {
      // 请求未真正到达后端，request.js 已提示过一次
    } else {
      showFormActionNotice(res?.message || t('formbusiness.overseastripapp.uploadFailed'), 'error')
    }
  } catch {
    showFormActionNotice(t('formbusiness.overseastripapp.uploadFailed'), 'error')
  } finally {
    uploading.value = false
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

function formatFileSize (sizeKB) {
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
  return row?.attachmentSize ?? row?.fileSize
}

const attachmentActionKeys = reactive(new Set())

function getAttachmentKey (row) {
  return String(getAttachmentId(row) ?? '') || String(getAttachmentPath(row) ?? '')
}

async function handleDownload (file) {
  const url = resolveFileUrl(getAttachmentPath(file))
  if (!url) return
  const key = getAttachmentKey(file)
  if (attachmentActionKeys.has(key)) return
  attachmentActionKeys.add(key)
  try {
    await downloadFileFromUrl(url, getAttachmentName(file))
  } finally {
    attachmentActionKeys.delete(key)
  }
}

async function removeAttachment (file, idx) {
  const key = getAttachmentKey(file)
  if (attachmentActionKeys.has(key)) return
  attachmentActionKeys.add(key)
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
      showFormActionNotice(res?.message || t('formbusiness.overseastripapp.deleteFailed'), 'error')
    }
  } catch {
    showFormActionNotice(t('formbusiness.overseastripapp.deleteFailed'), 'error')
  } finally {
    attachmentActionKeys.delete(key)
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
      silentForbiddenError: false
    })
    if (isForbiddenCode(res?.code)) {
      showForbiddenResult()
      return ''
    }
    if (!res || res.code !== 200) {
      if (isBadRequestResponse(res)) {
        showBadRequestResult(res?.message)
      }
      return ''
    }
    const data = res.data || {}
    const loginNo = data.loginNo ?? data.userNo ?? data.LoginNo ?? data.UserNo
    if (loginNo) userStore.loginNo = String(loginNo)
    return data.formId != null ? String(data.formId) : ''
  } catch {
    return ''
  }
}

onMounted(async () => {
  try {
    await syncRouteLanguage()
    currentFormTypeId.value = String(route.query.formTypeId || '')
    loadTravelModeOptions()
    loadSiteOptions()

    const routeToken = route.query.token || route.query.Token || getLocationQueryParam('token', 'Token')
    if (routeToken) {
      const tokenFormId = await resolveTokenFormId(String(routeToken))
      if (tokenFormId) {
        form.formId = tokenFormId
        await getOverseasTripAppDetail(tokenFormId)
      }
      return
    }

    const routeFormId = route.query.formId || route.params?.formId
    if (routeFormId) {
      form.formId = String(routeFormId)
      await getOverseasTripAppDetail(form.formId)
    } else {
      await initOverseasTripApp()
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

.sk-block {
  flex: 1;
  min-width: 0;
  height: 130px;
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

.result-content {
  width: 100%;
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

.overseastripapp-bad-request-desc {
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
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  line-height: 1.2;
}

.basic-info-row .el-form-item {
  margin-bottom: 0;
}

.basic-info-row + .basic-info-row {
  margin-top: 18px;
}

.approval-comment-row :deep(.el-form-item) {
  align-items: flex-start;
}

.approval-divider {
  margin: 6px 0 24px;
}

.add-review-table {
  width: 100%;
}

.add-review-drag-handle {
  cursor: grab;
  color: var(--el-text-color-secondary);
}

.add-review-drag-handle:active {
  cursor: grabbing;
}

.add-review-drag-handle.is-disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.attachment-row :deep(.el-form-item__label),
.approval-comment-row :deep(.el-form-item__label) {
  min-height: 32px;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.attachment-table {
  width: 100%;
}

.approval-comment-row {
  margin-top: 12px;
}

.approval-comment-row .el-form-item {
  margin-bottom: 6px;
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
  gap: 12px;
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

/* 选人弹窗：与请假单选择代理人弹窗保持一致 */
.add-review-filter-form {
  margin-bottom: 12px;
}

.add-review-filter-form .add-review-filter-dept-select {
  width: 180px;
}

.add-review-filter-form .add-review-filter-input-userno {
  width: 155px;
}

.add-review-filter-form .add-review-filter-input-compact {
  width: 168px;
}

.add-review-table-wrap {
  position: relative;
  min-height: 360px;
}

.add-review-select-table {
  width: 100%;
}

.add-review-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.destination-site-info-col {
  display: flex;
  align-items: center;
  height: 32px;
}

.destination-site-info-icon {
  flex-shrink: 0;
  cursor: pointer;
  color: var(--el-text-color-placeholder);
  font-size: 16px;
}
</style>

<style>
/* el-tooltip 的弹层通过 Teleport 挂到 body 下，且内容是原始 HTML 字符串，不受本组件 scoped 样式约束，因此单独放在非 scoped 块中 */
.site-allowance-tooltip.el-popper {
  max-width: 280px;
}

.site-allowance-desc {
  margin-bottom: 6px;
  font-size: 11px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}

.site-allowance-empty {
  font-size: 11px;
  color: var(--el-text-color-secondary);
}

.site-allowance-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

.site-allowance-table th,
.site-allowance-table td {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  padding: 3px 6px;
  text-align: center;
}

.site-allowance-table thead th {
  background-color: var(--el-fill-color-light, #f5f7fa);
  font-weight: 600;
}

.site-allowance-table tbody th {
  background-color: var(--el-fill-color-light, #f5f7fa);
  font-weight: 600;
  text-align: left;
}

.site-allowance-table tr.is-current-rule th,
.site-allowance-table tr.is-current-rule td {
  background-color: #fdf1e6;
  color: var(--el-color-warning, #e6a23c);
  font-weight: 700;
}
</style>
