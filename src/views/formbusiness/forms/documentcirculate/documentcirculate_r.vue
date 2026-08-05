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

              <!-- 发文部门 -->
              <div class="sk-field">
                <el-skeleton-item variant="text" class="sk-label" />
                <el-skeleton-item variant="text" class="sk-control" />
              </div>

              <!-- 传签目的 -->
              <div class="sk-field sk-field--top">
                <el-skeleton-item variant="text" class="sk-label" />
                <el-skeleton-item variant="text" class="sk-textarea" />
              </div>

              <!-- 内容摘要 -->
              <div class="sk-field sk-field--top">
                <el-skeleton-item variant="text" class="sk-label" />
                <el-skeleton-item variant="text" class="sk-block" />
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
        <p class="forbidden-result__eyebrow">{{ t('formbusiness.documentcirculate.forbiddenReviewEyebrow') }}</p>
        <h2 class="forbidden-result__title">{{ t('formbusiness.documentcirculate.forbiddenReviewTitle') }}</h2>
        <p class="forbidden-result__desc">{{ t('formbusiness.documentcirculate.forbiddenReviewSubTitle') }}</p>
        <span class="result-back-link" @click="closeCurrentPage">[ {{ t('formbusiness.documentcirculate.backToFormPending') }} ]</span>
      </div>
      <el-result
        v-else
        class="result-content"
        :class="{ 'result-content--bad-request': resultState.variant === 'badRequest' }"
        :icon="resultState.status"
        :title="resultState.variant === 'badRequest' ? resultState.detailMessage : t(resultState.titleKey)"
      >
        <template #sub-title>
          <p v-if="resultState.variant === 'badRequest'" class="documentcirculate-bad-request-desc">
            {{ t('formbusiness.documentcirculate.badRequestHint') }}
          </p>
          <span v-else>{{ t(resultState.subTitleKey) }}</span>
        </template>
        <template #extra>
          <span class="result-back-link" @click="closeCurrentPage">[ {{ t('formbusiness.documentcirculate.backToFormPending') }} ]</span>
        </template>
      </el-result>
    </el-card>

    <template v-else>
    <el-card class="leave-form-card" shadow="never">
      <!-- 表单标题 -->
      <div class="form-title-row">
        <h2 class="form-title">{{ t('formbusiness.documentcirculate.formTitle') }}</h2>
      </div>
      <el-divider style="margin: 22px 0;"></el-divider>

      <!-- 表单主体（表格化排版） -->
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="leave-form" :validate-on-rule-change="false">

        <!-- 基本信息 -->
        <el-row v-if="isAnyStepFieldVisible(['FormNo', 'ApplyDate'])" :gutter="16" class="basic-info-row" style="justify-content: flex-start;">
          <el-col v-if="isStepFieldVisible('FormNo')" :span="8">
            <el-form-item :label="t('formbusiness.documentcirculate.formNo')" prop="formNo">
              <el-input v-model="form.formNo" :disabled="!isStepFieldEditable('FormNo')" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('ApplyDate')" :span="8">
            <el-form-item :label="t('formbusiness.documentcirculate.applyDate')" prop="applyDate">
              <el-date-picker
                v-model="form.applyDate"
                type="date"
                value-format="YYYY-MM-DD"
                :placeholder="t('formbusiness.documentcirculate.pleaseSelectApplyDate')"
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
            <el-form-item :label="t('formbusiness.documentcirculate.applicantUserNo')" prop="applicantUserNo">
              <el-input v-model="form.applicantUserNo" :disabled="!isStepFieldEditable('UserNo')" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('UserName')" :span="8">
            <el-form-item :label="t('formbusiness.documentcirculate.applicantUserName')" prop="applicantUserName">
              <el-input v-model="form.applicantUserName" :disabled="!isStepFieldEditable('UserName')" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('Department')" :span="8">
            <el-form-item :label="t('formbusiness.documentcirculate.applicantDeptName')" prop="applicantDeptName">
              <el-input v-model="form.applicantDeptName" :disabled="!isStepFieldEditable('Department')" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider v-if="isAnyStepFieldVisible(['FormNo', 'ApplyDate', 'UserNo', 'UserName', 'Department'])"></el-divider>

        <!-- 发文部门 -->
        <el-row v-if="isStepFieldVisible('IssueDept')" :gutter="16">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.documentcirculate.issueDept')" prop="issueDept">
              <el-input
                v-model="form.issueDept"
                :placeholder="t('formbusiness.documentcirculate.pleaseInputIssueDept')"
                :disabled="!isStepFieldEditable('IssueDept')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 传签目的 -->
        <el-row v-if="isStepFieldVisible('CirculationPurpose')" :gutter="16">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.documentcirculate.circulationPurpose')" prop="circulationPurpose">
              <el-input
                v-model="form.circulationPurpose"
                type="textarea"
                :rows="4"
                :placeholder="t('formbusiness.documentcirculate.pleaseInputCirculationPurpose')"
                :disabled="!isStepFieldEditable('CirculationPurpose')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 内容摘要（富文本） -->
        <el-row v-if="isStepFieldVisible('ContentSummary')" :gutter="16">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.documentcirculate.contentSummary')" prop="contentSummary" class="content-summary-item">
              <div class="content-summary-editor" :class="{ 'is-disabled': !isStepFieldEditable('ContentSummary') }">
                <div v-if="isStepFieldEditable('ContentSummary')" class="content-summary-toolbar">
                  <button type="button" class="cs-tb-btn" :class="{ 'is-active': editor?.isActive('bold') }" title="Bold" @click="editor?.chain().focus().toggleBold().run()">B</button>
                  <button type="button" class="cs-tb-btn cs-tb-btn--italic" :class="{ 'is-active': editor?.isActive('italic') }" title="Italic" @click="editor?.chain().focus().toggleItalic().run()">I</button>
                  <button type="button" class="cs-tb-btn cs-tb-btn--underline" :class="{ 'is-active': editor?.isActive('underline') }" title="Underline" @click="editor?.chain().focus().toggleUnderline().run()">U</button>
                  <button type="button" class="cs-tb-btn cs-tb-btn--strike" :class="{ 'is-active': editor?.isActive('strike') }" title="Strike" @click="editor?.chain().focus().toggleStrike().run()">S</button>
                  <span class="cs-tb-sep"></span>
                  <button type="button" class="cs-tb-btn" :class="{ 'is-active': editor?.isActive('heading', { level: 1 }) }" title="H1" @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()">H1</button>
                  <button type="button" class="cs-tb-btn" :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }" title="H2" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()">H2</button>
                  <button type="button" class="cs-tb-btn" :class="{ 'is-active': editor?.isActive('heading', { level: 3 }) }" title="H3" @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()">H3</button>
                  <span class="cs-tb-sep"></span>
                  <button type="button" class="cs-tb-btn" :class="{ 'is-active': editor?.isActive({ textAlign: 'left' }) }" title="Align left" @click="editor?.chain().focus().setTextAlign('left').run()">⇤</button>
                  <button type="button" class="cs-tb-btn" :class="{ 'is-active': editor?.isActive({ textAlign: 'center' }) }" title="Align center" @click="editor?.chain().focus().setTextAlign('center').run()">⇔</button>
                  <button type="button" class="cs-tb-btn" :class="{ 'is-active': editor?.isActive({ textAlign: 'right' }) }" title="Align right" @click="editor?.chain().focus().setTextAlign('right').run()">⇥</button>
                  <span class="cs-tb-sep"></span>
                  <button type="button" class="cs-tb-btn" :class="{ 'is-active': editor?.isActive('bulletList') }" title="Bullet list" @click="editor?.chain().focus().toggleBulletList().run()">•</button>
                  <button type="button" class="cs-tb-btn" :class="{ 'is-active': editor?.isActive('orderedList') }" title="Ordered list" @click="editor?.chain().focus().toggleOrderedList().run()">1.</button>
                  <button type="button" class="cs-tb-btn" :class="{ 'is-active': editor?.isActive('blockquote') }" title="Blockquote" @click="editor?.chain().focus().toggleBlockquote().run()">”</button>
                  <button type="button" class="cs-tb-btn" :class="{ 'is-active': editor?.isActive('codeBlock') }" title="Code block" @click="editor?.chain().focus().toggleCodeBlock().run()">{ }</button>
                  <button type="button" class="cs-tb-btn" title="Horizontal rule" @click="editor?.chain().focus().setHorizontalRule().run()">―</button>
                  <span class="cs-tb-sep"></span>
                  <label class="cs-tb-color" title="Text color">
                    A
                    <input type="color" @input="onTextColorInput" />
                  </label>
                  <button type="button" class="cs-tb-btn" :class="{ 'is-active': editor?.isActive('highlight') }" title="Highlight" @click="editor?.chain().focus().toggleHighlight({ color: '#fff3a3' }).run()">
                    <el-icon><MagicStick /></el-icon>
                  </button>
                  <button type="button" class="cs-tb-btn" :class="{ 'is-active': editor?.isActive('link') }" title="Link" @click="onToggleLink">
                    <el-icon><Link /></el-icon>
                  </button>
                  <button type="button" class="cs-tb-btn" title="Insert table" @click="editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()">
                    <el-icon><Grid /></el-icon>
                  </button>
                  <span class="cs-tb-sep"></span>
                  <button type="button" class="cs-tb-btn" title="Undo" @click="editor?.chain().focus().undo().run()">⟲</button>
                  <button type="button" class="cs-tb-btn" title="Redo" @click="editor?.chain().focus().redo().run()">⟳</button>
                </div>
                <div v-if="isStepFieldEditable('ContentSummary') && editor?.isActive('table')" class="content-summary-toolbar content-summary-toolbar--table">
                  <button type="button" class="cs-tb-btn" :title="t('formbusiness.documentcirculate.tableAddColumn')" @click="editor?.chain().focus().addColumnBefore().run()"><el-icon><Plus /></el-icon>{{ t('formbusiness.documentcirculate.tableColumn') }}</button>
                  <button type="button" class="cs-tb-btn" :title="t('formbusiness.documentcirculate.tableDeleteColumn')" @click="editor?.chain().focus().deleteColumn().run()"><el-icon><Minus /></el-icon>{{ t('formbusiness.documentcirculate.tableColumn') }}</button>
                  <button type="button" class="cs-tb-btn" :title="t('formbusiness.documentcirculate.tableAddRow')" @click="editor?.chain().focus().addRowAfter().run()"><el-icon><Plus /></el-icon>{{ t('formbusiness.documentcirculate.tableRow') }}</button>
                  <button type="button" class="cs-tb-btn" :title="t('formbusiness.documentcirculate.tableDeleteRow')" @click="editor?.chain().focus().deleteRow().run()"><el-icon><Minus /></el-icon>{{ t('formbusiness.documentcirculate.tableRow') }}</button>
                  <span class="cs-tb-sep"></span>
                  <button type="button" class="cs-tb-btn" :title="t('formbusiness.documentcirculate.tableDeleteTable')" @click="editor?.chain().focus().deleteTable().run()"><el-icon><Close /></el-icon>{{ t('formbusiness.documentcirculate.tableDeleteTable') }}</button>
                </div>
                <editor-content :editor="editor" class="content-summary-body" @click="onContentSummaryClick" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 附件上传 -->
        <el-row v-if="isStepFieldVisible('Upload') || uploadedAttachments.length > 0" :gutter="16" class="attachment-row">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.documentcirculate.attachments')">
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
                    {{ t('formbusiness.documentcirculate.uploadFile') }}
                  </el-button>
                </div>
                <el-table :data="uploadedAttachments" border size="small" class="attachment-table">
                  <el-table-column type="index" width="55" align="center" label="#" />
                  <el-table-column :label="t('formbusiness.documentcirculate.fileName')" min-width="200">
                    <template #default="{ row }">
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <el-icon style="color: #409eff; flex-shrink: 0;"><Document /></el-icon>
                        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" :title="getAttachmentName(row)">{{ getAttachmentName(row) }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('formbusiness.documentcirculate.fileSize')" width="100" align="center">
                    <template #default="{ row }">
                      {{ formatFileSize(getAttachmentSizeKb(row)) }}
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('common.operation')" width="170" align="center">
                    <template #default="{ row, $index }">
                      <el-button type="primary" link size="small" @click="handleDownload(row)">
                        <el-icon><Download /></el-icon>
                        {{ t('formbusiness.documentcirculate.download') }}
                      </el-button>
                      <el-button type="danger" link size="small" :disabled="!isStepFieldEditable('Upload')" @click="removeAttachment(row, $index)">
                        <el-icon><Delete /></el-icon>
                        {{ t('formbusiness.documentcirculate.deleteFile') }}
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
            <el-form-item :label="t('formbusiness.documentcirculate.addReview')">
              <el-table :data="addReviewRows" border size="small" class="add-review-table">
                <el-table-column
                  prop="sortOrder"
                  :label="t('formbusiness.documentcirculate.addReviewSortOrder')"
                  width="70"
                  align="center"
                />
                <el-table-column
                  prop="deptName"
                  :label="t('formbusiness.documentcirculate.addReviewDepartment')"
                  min-width="200"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="userNo"
                  :label="t('formbusiness.documentcirculate.addReviewUserNo')"
                  width="120"
                />
                <el-table-column
                  prop="userName"
                  :label="t('formbusiness.documentcirculate.addReviewUserName')"
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
                      {{ row.userId ? t('formbusiness.documentcirculate.addReviewChange') : t('formbusiness.documentcirculate.addReviewSelect') }}
                    </el-button>
                    <el-button
                      v-if="row.userId"
                      type="danger"
                      link
                      size="small"
                      :disabled="!isAddReviewEditable()"
                      @click="clearAddReviewRow(row)"
                    >
                      {{ t('formbusiness.documentcirculate.addReviewClear') }}
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
            <el-form-item :label="t('formbusiness.documentcirculate.approvalComment')">
              <el-input
                v-model="approvalComment"
                type="textarea"
                :rows="3"
                :placeholder="t('formbusiness.documentcirculate.approvalCommentPlaceholder')"
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
                  <el-button v-if="isStepFieldVisible('Save')" type="primary" round style="width:80px;" @click="onSubmit" :loading="saving" :disabled="formActionLoading || !isStepFieldEditable('Save')">{{ t('formbusiness.documentcirculate.saveButton') }}</el-button>
                  <el-button v-if="isStepFieldVisible('Submit')" type="success" round style="width:80px;" @click="onSubmitForApproval" :loading="approving" :disabled="formActionLoading || !isStepFieldEditable('Submit')">{{ t('formbusiness.documentcirculate.submitButton') }}</el-button>
                  <el-button v-if="isStepFieldVisible('Reject')" type="danger" round style="width:80px;" @click="onReject" :disabled="formActionLoading || !isStepFieldEditable('Reject')">{{ t('formbusiness.documentcirculate.rejectButton') }}</el-button>
                </div>
                <div class="workflow-view-entry">
                  <div class="workflow-view-hint">
                    <span class="workflow-view-hint-text">{{ t('formbusiness.documentcirculate.viewFullWorkflowHint') }}</span>
                  </div>
                  <el-tooltip :content="t('formbusiness.documentcirculate.viewFullWorkflow')" placement="top">
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
        <div class="review-log-title">{{ t('formbusiness.documentcirculate.reviewLog') }}</div>
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
            :label="t('formbusiness.documentcirculate.reviewLogStep')"
            width="150"
            align="left"
          >
            <template #default="{ row }">
              <span class="review-log-step-cell">{{ row.stepName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('formbusiness.documentcirculate.reviewLogOperationUser')"
            width="165"
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
            :label="t('formbusiness.documentcirculate.reviewLogResult')"
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
                >（{{ t('formbusiness.documentcirculate.reviewLogRejectToStep', { step: getReviewRejectStepName(row) }) }}）</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('formbusiness.documentcirculate.reviewLogComment')"
            min-width="200"
          >
            <template #default="{ row }">
              <div class="review-log-comment-cell">{{ row.comment }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('formbusiness.documentcirculate.reviewLogDateTime')"
            width="180"
            align="center"
          >
            <template #default="{ row }">
              <span class="review-log-datetime-cell">{{ formatReviewDateTime(row.reviewDateTime) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-empty
          v-else
          :description="t('formbusiness.documentcirculate.reviewLogEmpty')"
          style="padding: 20px 0;"
        />
      </div>
    </el-card>

    </template>

    <!-- 驳回弹窗 -->
    <el-dialog
      v-model="rejectDialogVisible"
      :title="t('formbusiness.documentcirculate.rejectDialogTitle')"
      width="580px"
      :close-on-click-modal="false"
      :append-to-body="true"
      class="modal-penetrable"
      @close="onRejectDialogClose"
    >
      <el-form ref="rejectFormRef" :model="rejectForm" :rules="rejectRules" label-width="100px">
        <el-form-item :label="t('formbusiness.documentcirculate.rejectStepLabel')" prop="rejectStepId">
          <el-select
            v-model="rejectForm.rejectStepId"
            :placeholder="t('formbusiness.documentcirculate.rejectStepPlaceholder')"
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
        <el-form-item :label="t('formbusiness.documentcirculate.rejectReasonLabel')" prop="rejectReason">
          <el-input
            v-model="rejectForm.rejectReason"
            type="textarea"
            :rows="6"
            :placeholder="t('formbusiness.documentcirculate.rejectReasonPlaceholder')"
            class="reject-reason-input"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="danger" @click="confirmReject">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 加审人员选择 -->
    <el-dialog
      v-model="addReviewDialogVisible"
      :title="t('formbusiness.documentcirculate.addReviewDialogTitle')"
      width="1100px"
      :close-on-click-modal="false"
      :append-to-body="true"
      destroy-on-close
      @closed="onAddReviewDialogClosed"
    >
      <el-form :inline="true" class="add-review-filter-form">
        <el-form-item :label="t('formbusiness.documentcirculate.addReviewDepartment')">
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
            popper-class="documentcirculate-dept-tree-popper"
            :placeholder="t('formbusiness.documentcirculate.addReviewPleaseSelectDepartment')"
            @change="handleAddReviewDepartmentChange"
          />
        </el-form-item>
        <el-form-item :label="t('formbusiness.documentcirculate.applicantUserNo')">
          <el-input
            v-model="addReviewFilters.userNo"
            class="add-review-filter-input-userno"
            clearable
            :placeholder="t('formbusiness.documentcirculate.applicantUserNo')"
            @input="handleAddReviewFilterInput"
            @keyup.enter="handleAddReviewSearch"
            @clear="handleAddReviewFilterInput"
          />
        </el-form-item>
        <el-form-item :label="t('formbusiness.documentcirculate.applicantUserName')">
          <el-input
            v-model="addReviewFilters.userName"
            class="add-review-filter-input-compact"
            clearable
            :placeholder="t('formbusiness.documentcirculate.applicantUserName')"
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
          ref="addReviewTableRef"
          :data="addReviewUserList"
          border
          stripe
          max-height="360"
          class="add-review-select-table"
          :header-cell-style="{ background: '#f5f7fa' }"
          :row-key="(row) => row.userId"
          :empty-text="t('common.noData')"
          @selection-change="handleAddReviewTableSelectionChange"
          @row-click="handleAddReviewRowClick"
        >
          <el-table-column type="selection" width="48" align="center" />
          <el-table-column prop="userNo" :label="t('formbusiness.documentcirculate.applicantUserNo')" min-width="110" align="center" />
          <el-table-column prop="userName" :label="t('formbusiness.documentcirculate.applicantUserName')" min-width="120" align="left" show-overflow-tooltip />
          <el-table-column :label="t('formbusiness.documentcirculate.addReviewDepartment')" min-width="160" align="left" show-overflow-tooltip>
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

    <!-- 完整审批流程 -->
    <el-drawer
      v-model="workflowDrawerVisible"
      :title="t('formbusiness.documentcirculate.workflowDrawerTitle')"
      direction="rtl"
      size="420px"
      destroy-on-close
      class="documentcirculate-workflow-drawer"
    >
      <div v-loading="workflowDrawerLoading" class="workflow-drawer-loading-host">
      <div class="workflow-drawer-body">
        <div
          v-if="!workflowDrawerLoading && workflowOverview.rejectCount > 0"
          class="workflow-reject-count"
        >
          {{ t('formbusiness.documentcirculate.workflowRejectCount', { count: workflowOverview.rejectCount }) }}
        </div>
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
                {{ t('formbusiness.documentcirculate.workflowStatusSkipped') }}
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
                    {{ t('formbusiness.documentcirculate.workflowAgent') }}：{{ u.agentUserName }}
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
        <el-empty v-else-if="!workflowDrawerLoading" :description="t('formbusiness.documentcirculate.workflowEmpty')" />
      </div>
      </div>
    </el-drawer>
    </el-config-provider>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import i18n from '@/i18n'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { Upload, Document, Download, Delete, Clock, CircleCheck, RemoveFilled, Loading, Lock, Link, Grid, Plus, Minus, Close, MagicStick } from '@element-plus/icons-vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table'
import { post, isHandled } from '@/utils/request'
import {
  INIT_DOCUMENTCIRCULATE_API,
  GET_DOCUMENTCIRCULATE_API,
  SAVE_DOCUMENTCIRCULATE_API,
  UPLOAD_FILE_API,
  DELETE_FILE_API,
  GET_FULL_REVIEW_FLOW_API,
  GET_REJECT_STEP_DROP_API,
  APPROVE_DOCUMENTCIRCULATE_API,
  REJECT_DOCUMENTCIRCULATE_API,
  GET_FORM_NOTIFY_TOKEN_API,
  GET_ADD_REVIEW_DEPARTMENT_DROP_API,
  GET_ADD_REVIEW_USER_PAGE_API,
  INSERT_FORM_ADD_REVIEW_API,
  UPDATE_FORM_ADD_REVIEW_API,
  DELETE_FORM_ADD_REVIEW_API
} from '@/config/api/formbusiness/forms/documentcirculate'
import { resolveFileUrl } from '@/utils/fileUrl'
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
  titleKey: 'formbusiness.documentcirculate.approvalResultTitle',
  subTitleKey: 'formbusiness.documentcirculate.approvalResultSubTitle'
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
  applicantDeptId: '',
  issueDept: '',
  circulationPurpose: '',
  contentSummary: ''
})

/** 富文本判空：空编辑器的 getHTML() 返回 <p></p>，须按纯文本判断 */
function isRichTextEmpty (html) {
  return String(html || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim() === ''
}

function validateContentSummary (rule, value, callback) {
  if (isRichTextEmpty(value)) {
    callback(new Error(t('formbusiness.documentcirculate.pleaseInputContentSummary')))
    return
  }
  callback()
}

// 仅对当前步骤可编辑的栏位做必填校验：只读栏位用户改不了，必填会让保存/送审无法进行
const rules = computed(() => {
  const requiredWhenEditable = (fieldKey, messageKey) =>
    isStepFieldEditable(fieldKey)
      ? [{ required: true, message: t(messageKey), trigger: 'blur' }]
      : []

  return {
    issueDept: requiredWhenEditable('IssueDept', 'formbusiness.documentcirculate.pleaseInputIssueDept'),
    circulationPurpose: requiredWhenEditable('CirculationPurpose', 'formbusiness.documentcirculate.pleaseInputCirculationPurpose'),
    contentSummary: isStepFieldEditable('ContentSummary')
      ? [{ required: true, validator: validateContentSummary, trigger: 'change' }]
      : []
  }
})

// 内容摘要富文本编辑器
const editor = useEditor({
  content: '',
  extensions: [
    StarterKit.configure({
      link: {
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' }
      }
    }),
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    Placeholder.configure({ placeholder: () => t('formbusiness.documentcirculate.contentSummaryPlaceholder') })
  ],
  onUpdate: ({ editor: ed }) => {
    form.contentSummary = ed.getHTML()
    // 仅在有内容时触发校验，用于清掉已有的必填提示；空内容不主动报错，避免加载时误报
    if (!isRichTextEmpty(form.contentSummary)) {
      formRef.value?.validateField('contentSummary', () => {})
    }
  }
})

function setContentSummaryEditorContent (html) {
  const value = html || ''
  if (editor.value && editor.value.getHTML() !== value) {
    editor.value.commands.setContent(value, false)
  }
}

function onTextColorInput (event) {
  const value = event?.target?.value
  if (!value) return
  editor.value?.chain().focus().setColor(value).run()
}

/** Link 扩展设置了 openOnClick: false（避免编辑时误触跳转），这里补一个手动打开：
 *  只读态直接点击打开；可编辑态需按住 Ctrl/Cmd 点击，避免和光标定位冲突 */
function onContentSummaryClick (event) {
  const anchor = event.target?.closest?.('a')
  if (!anchor?.href) return
  const isEditable = isStepFieldEditable('ContentSummary')
  if (!isEditable || event.ctrlKey || event.metaKey) {
    event.preventDefault()
    window.open(anchor.href, '_blank', 'noopener,noreferrer')
  }
}

async function onToggleLink () {
  if (!editor.value) return
  if (editor.value.isActive('link')) {
    editor.value.chain().focus().unsetLink().run()
    return
  }
  try {
    const { value } = await ElMessageBox.prompt(
      t('formbusiness.documentcirculate.linkUrlPlaceholder'),
      t('formbusiness.documentcirculate.linkDialogTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        inputPattern: /^https?:\/\/.+/i,
        inputErrorMessage: t('formbusiness.documentcirculate.linkInvalidUrl')
      }
    )
    editor.value.chain().focus().extendMarkRange('link').setLink({ href: value }).run()
  } catch {
    // 用户取消
  }
}

watch(() => isStepFieldEditable('ContentSummary'), (val) => {
  editor.value?.setEditable(val)
}, { immediate: true })

onBeforeUnmount(() => {
  editor.value?.destroy()
  clearAddReviewSearchTimer()
})

const rejectDialogVisible = ref(false)
const rejectFormRef = ref(null)
const rejectForm = reactive({
  rejectStepId: '',
  rejectReason: ''
})
const rejectRules = {
  rejectStepId: [
    { required: true, message: t('formbusiness.documentcirculate.rejectStepRequired'), trigger: 'change' }
  ],
  rejectReason: [
    { required: true, message: t('formbusiness.documentcirculate.rejectReasonRequired'), trigger: 'blur' }
  ]
}

const uploading = ref(false)
const uploadedAttachments = ref([])
const fileInputRef = ref(null)

/* ---------------- 加审人员 ---------------- */

const ADD_REVIEW_MAX_ROWS = 5
// 后端加审字典存在 AddReivew 拼写，两种键都判断，避免键名不匹配时误放行
const ADD_REVIEW_FIELD_KEYS = ['AddReview', 'AddReivew']

const createAddReviewRows = () =>
  Array.from({ length: ADD_REVIEW_MAX_ROWS }, (_, idx) => ({
    sortOrder: idx + 1,
    userId: '',
    userNo: '',
    userName: '',
    deptName: '',
    persisted: false, // 后端该顺序已有记录 → 走 Update，否则走 Insert
    dirty: false      // 本地有改动，待随表单保存一并同步
  }))

const addReviewRows = ref(createAddReviewRows())
const addReviewDialogVisible = ref(false)
const addReviewTargetSortOrder = ref(0)
const addReviewDeptOptions = ref([])
const addReviewUserList = ref([])
const addReviewListLoading = ref(false)
const addReviewTableRef = ref(null)
const isAdjustingAddReviewSelection = ref(false)
const selectedAddReviewUser = ref(null)
const selectedAddReviewUserId = ref('')
const addReviewFilters = reactive({ departmentId: '', userNo: '', userName: '' })
const addReviewPagination = reactive({ pageIndex: 1, pageSize: 10, totalCount: 0 })
const ADD_REVIEW_SEARCH_DEBOUNCE_MS = 300
let addReviewSearchTimer = null
let addReviewListRequestId = 0

// 权限键缺失时 isStepFieldVisible/Editable 默认返回 true，故用 every：任一拼写判否即生效
function isAddReviewVisible () {
  return ADD_REVIEW_FIELD_KEYS.every((key) => isStepFieldVisible(key))
}

function isAddReviewEditable () {
  return ADD_REVIEW_FIELD_KEYS.every((key) => isStepFieldEditable(key))
}

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
    restoreAddReviewTableSelection()
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

/** 翻页后回显已选中行 */
function restoreAddReviewTableSelection () {
  if (!selectedAddReviewUserId.value || !addReviewTableRef.value) return
  const matchedRow = addReviewUserList.value.find((item) => String(item.userId) === selectedAddReviewUserId.value)
  if (!matchedRow) return
  selectedAddReviewUser.value = matchedRow
  isAdjustingAddReviewSelection.value = true
  nextTick(() => {
    addReviewTableRef.value?.clearSelection()
    addReviewTableRef.value?.toggleRowSelection(matchedRow, true)
    isAdjustingAddReviewSelection.value = false
  })
}

// 勾选列表现为单选：只保留最后勾选的一行
function handleAddReviewTableSelectionChange (selection) {
  if (isAdjustingAddReviewSelection.value) return
  if (selection.length === 0) {
    selectedAddReviewUserId.value = ''
    selectedAddReviewUser.value = null
    return
  }
  const lastRow = selection[selection.length - 1]
  selectedAddReviewUserId.value = String(lastRow.userId)
  selectedAddReviewUser.value = lastRow
  if (selection.length > 1 && addReviewTableRef.value) {
    isAdjustingAddReviewSelection.value = true
    nextTick(() => {
      addReviewTableRef.value.clearSelection()
      addReviewTableRef.value.toggleRowSelection(lastRow, true)
      isAdjustingAddReviewSelection.value = false
    })
  }
}

function handleAddReviewRowClick (row) {
  if (isAdjustingAddReviewSelection.value || !row?.userId || !addReviewTableRef.value) return
  const isSelected = String(selectedAddReviewUserId.value) === String(row.userId)
  if (isSelected) {
    selectedAddReviewUserId.value = ''
    selectedAddReviewUser.value = null
  } else {
    selectedAddReviewUserId.value = String(row.userId)
    selectedAddReviewUser.value = row
  }
  isAdjustingAddReviewSelection.value = true
  nextTick(() => {
    addReviewTableRef.value.clearSelection()
    if (!isSelected) {
      addReviewTableRef.value.toggleRowSelection(row, true)
    }
    isAdjustingAddReviewSelection.value = false
  })
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
  // 部门默认选中第一个可选项，并作为初次查询条件带入
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
  // 该顺序原本是否已有记录，须在覆盖行数据前取，用于区分新增/修改
  const isUpdate = row.persisted
  row.userId = String(user.userId)
  row.userNo = user.userNo ?? ''
  row.userName = user.userName ?? ''
  row.deptName = user.deptName ?? user.departmentName ?? ''
  row.dirty = true
  addReviewDialogVisible.value = false
  await saveAddReviewRow(row, isUpdate)
}

/** 清空该行：已落库则先删除，全程静默不提示 */
async function clearAddReviewRow (row) {
  const formId = String(form.formId || '')
  if (formId && row.persisted && row.userId) {
    try {
      const formData = new window.FormData()
      formData.append('formId', formId)
      formData.append('userId', String(row.userId))
      formData.append('sortOrder', String(row.sortOrder))
      await post(DELETE_FORM_ADD_REVIEW_API, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        skipDedupe: true,
        silentForbiddenError: false
      })
    } catch {
      // 静默：删除失败不打断页面操作
    }
  }
  row.userId = ''
  row.userNo = ''
  row.userName = ''
  row.deptName = ''
  row.persisted = false
  row.dirty = false
}

/** 保存表单前补发未成功落库的加审行（弹窗确定时已保存过的不会重复提交） */
async function syncAddReviewRows () {
  for (const row of addReviewRows.value) {
    if (!row.dirty || !row.userId) continue
    await saveAddReviewRow(row, row.persisted)
  }
}

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
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
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
  if (key === 'approve') return t('formbusiness.documentcirculate.workflowStatusApprove')
  if (key === 'underReview') return t('formbusiness.documentcirculate.workflowStatusUnderReview')
  return t('formbusiness.documentcirculate.workflowStatusUnsigned')
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
        ElMessage.error(res?.message || t('formbusiness.documentcirculate.workflowLoadFailed'))
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
    ElMessage.error(t('formbusiness.documentcirculate.workflowLoadFailed'))
  } finally {
    workflowDrawerLoading.value = false
  }
}

function openWorkflowDrawer () {
  if (!form.formId) {
    ElMessage.warning(t('formbusiness.documentcirculate.workflowNeedFormId'))
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
      const fieldKey = item?.fieldName ?? item?.FieldName ?? item?.fieldKey ?? item?.FieldKey
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

/** 402：业务性校验未通过（如加签人员规则等），以告警而非错误呈现 */
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
  resultState.titleKey = 'formbusiness.documentcirculate.forbiddenReviewTitle'
  resultState.subTitleKey = 'formbusiness.documentcirculate.forbiddenReviewSubTitle'
}

function showBadRequestResult (message) {
  const msg = typeof message === 'string' ? message.trim() : ''
  resultState.variant = 'badRequest'
  resultState.detailMessage = msg || t('formbusiness.documentcirculate.badRequestFallbackMessage')
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

async function bindFormData (data) {
  Object.assign(form, {
    formId: data.formId != null ? String(data.formId) : '',
    formNo: data.formNo || '',
    formStatus: data.formStatus || '',
    formStatusName: data.formStatusName || '',
    applyDate: data.applicantDate || '',
    applicantUserNo: data.applicantUserNo || '',
    applicantUserName: data.applicantUserName || '',
    applicantDeptName: data.applicantDeptName || '',
    issueDept: data.issueDept || '',
    circulationPurpose: data.circulationPurpose || '',
    contentSummary: data.contentSummary || ''
  })
  setContentSummaryEditorContent(form.contentSummary)

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
}

async function getDocumentCirculateDetail (formId) {
  try {
    const res = await post(
      GET_DOCUMENTCIRCULATE_API,
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
        ElMessage.error(res.message)
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

/** InitDocumentCirculate：新建传签单初始化。返回完整实体则直接 bind，仅返回 formId 时再拉详情 */
async function initDocumentCirculate () {
  try {
    const formData = new window.FormData()
    formData.append('formTypeId', currentFormTypeId.value || String(route.query.formTypeId || ''))
    const res = await post(INIT_DOCUMENTCIRCULATE_API, formData, {
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
        ElMessage.error(res.message)
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
    await getDocumentCirculateDetail(newFormId)
  } catch {
    // ignore
  }
}

function buildSaveDocumentCirculatePayload () {
  return {
    formId: String(form.formId || ''),
    issueDept: form.issueDept || null,
    circulationPurpose: form.circulationPurpose || null,
    contentSummary: form.contentSummary || null
  }
}

async function saveDocumentCirculateRequest () {
  // 先同步加审人员，再保存表单；保存与送审两条路径都经过这里
  await syncAddReviewRows()
  return post(SAVE_DOCUMENTCIRCULATE_API, buildSaveDocumentCirculatePayload(), {
    silentForbiddenError: false
  })
}

async function onSubmit () {
  // 校验不通过时只保留表单内的红色提示，不再额外弹窗
  const valid = await new Promise((resolve) => {
    formRef.value?.validate((ok) => resolve(!!ok))
  })
  if (!valid) return
  saving.value = true
  try {
    const res = await saveDocumentCirculateRequest()
    if (isForbiddenCode(res?.code)) {
      showFormActionNotice(t('formbusiness.documentcirculate.forbiddenResultSubTitle'), 'warning')
    } else if (isHandled(res)) {
      // 请求未真正到达后端，request.js 已提示过一次
    } else if (res && isSuccessCode(res.code)) {
      if (!form.formId && res.data) form.formId = String(res.data)
      showFormActionNotice(res.message || t('messages.saveSuccess'), 'success')
    } else if (isValidationWarningCode(res?.code)) {
      showFormActionNotice(res?.message, 'warning')
    } else if (isBadRequestResponse(res)) {
      showFormActionNotice(res?.message || t('formbusiness.documentcirculate.badRequestFallbackMessage'), 'warning')
    } else {
      showFormActionNotice(res?.message || t('messages.saveError'), 'warning')
    }
  } catch {
    // ignore
  } finally {
    saving.value = false
  }
}

async function saveDocumentCirculateBeforeSubmit () {
  const saveRes = await saveDocumentCirculateRequest()
  if (isForbiddenCode(saveRes?.code)) {
    showFormActionNotice(t('formbusiness.documentcirculate.forbiddenResultSubTitle'), 'warning')
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
      showFormActionNotice(saveRes?.message || t('formbusiness.documentcirculate.badRequestFallbackMessage'), 'warning')
    } else {
      showFormActionNotice(saveRes?.message || t('messages.saveError'), 'warning')
    }
    return false
  }
  if (!form.formId && saveRes.data) form.formId = String(saveRes.data)
  return true
}

/** 送审：暂存 → 送审 */
async function onSubmitForApproval () {
  // 校验不通过时只保留表单内的红色提示，不再额外弹窗
  const valid = await new Promise((resolve) => {
    formRef.value?.validate((ok) => resolve(!!ok))
  })
  if (!valid) return
  approving.value = true
  try {
    const saved = await saveDocumentCirculateBeforeSubmit()
    if (!saved) return

    const formId = String(form.formId || '')
    if (!formId) {
      showFormActionNotice(t('formbusiness.documentcirculate.workflowNeedFormId'), 'warning')
      return
    }

    const res = await post(APPROVE_DOCUMENTCIRCULATE_API, {
      formId,
      rejectStepId: '0',
      comment: approvalComment.value || ''
    }, {
      silentForbiddenError: false,
      silentAuthError: false,
      disableAutoLogout: true
    })
    if (isForbiddenCode(res?.code)) {
      showFormActionNotice(t('formbusiness.documentcirculate.forbiddenResultSubTitle'), 'warning')
      return
    }
    if (isHandled(res)) {
      return
    }
    if (res && isSuccessCode(res.code)) {
      showResult('success', 'formbusiness.documentcirculate.approvalResultTitle', 'formbusiness.documentcirculate.approvalResultSubTitle')
      return
    }
    if (isValidationWarningCode(res?.code)) {
      showFormActionNotice(res?.message, 'warning')
      return
    }
    if (isBadRequestResponse(res)) {
      showFormActionNotice(res?.message || t('formbusiness.documentcirculate.badRequestFallbackMessage'), 'warning')
      return
    }
    showFormActionNotice(res?.message || t('formbusiness.documentcirculate.submitFailed'), 'warning')
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
        ElMessage.error(res?.message || t('formbusiness.messages.loadError'))
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
    ElMessage.warning(t('formbusiness.documentcirculate.workflowNeedFormId'))
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
    ElMessage.warning(t('formbusiness.documentcirculate.workflowNeedFormId'))
    return
  }

  const rejectStepId = rejectForm.rejectStepId
  const rejectReason = rejectForm.rejectReason
  rejectDialogVisible.value = false
  await nextTick()

  rejecting.value = true
  try {
    const res = await post(REJECT_DOCUMENTCIRCULATE_API, {
      formId,
      rejectStepId,
      comment: rejectReason
    }, { silentForbiddenError: false })

    if (isForbiddenCode(res?.code)) {
      showForbiddenResult()
      return
    }
    if (res && isSuccessCode(res.code)) {
      showResult('success', 'formbusiness.documentcirculate.rejectResultTitle', 'formbusiness.documentcirculate.rejectResultSubTitle')
      return
    }
    if (isBadRequestResponse(res)) {
      showBadRequestResult(res?.message)
      return
    }
    ElNotification({ title: '', message: res?.message || t('formbusiness.documentcirculate.rejectFailed'), type: 'error' })
  } catch {
    ElNotification({ title: '', message: t('formbusiness.documentcirculate.rejectFailed'), type: 'error' })
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

function handleDownload (file) {
  const url = resolveFileUrl(getAttachmentPath(file))
  if (!url) return
  const a = document.createElement('a')
  a.href = url
  a.download = getAttachmentName(file)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
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
      ElMessage({ message: res?.message || t('formbusiness.documentcirculate.deleteFailed'), type: 'error', plain: true, showClose: true })
    }
  } catch {
    ElMessage({ message: t('formbusiness.documentcirculate.deleteFailed'), type: 'error', plain: true, showClose: true })
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

    const routeToken = route.query.token || route.query.Token || getLocationQueryParam('token', 'Token')
    if (routeToken) {
      const tokenFormId = await resolveTokenFormId(String(routeToken))
      if (tokenFormId) {
        form.formId = tokenFormId
        await getDocumentCirculateDetail(tokenFormId)
      }
      return
    }

    const routeFormId = route.query.formId || route.params?.formId
    if (routeFormId) {
      form.formId = String(routeFormId)
      await getDocumentCirculateDetail(form.formId)
    } else {
      await initDocumentCirculate()
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

.documentcirculate-bad-request-desc {
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

.content-summary-item :deep(.el-form-item__content) {
  align-items: flex-start;
}

.content-summary-editor {
  width: 100%;
  border: 1px solid #c0c4cc;
  border-radius: 4px;
  overflow: hidden;
}

.content-summary-editor.is-disabled {
  background: var(--el-disabled-bg-color, #f5f7fa);
}

.content-summary-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 8px;
  border-bottom: 1px solid #e4e7ed;
  background: #fafafa;
  flex-wrap: wrap;
}

.cs-tb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: 0 6px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: #606266;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.cs-tb-btn:hover {
  background: #ecf5ff;
  color: var(--el-color-primary);
}

.cs-tb-btn.is-active {
  background: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary-light-7);
  color: var(--el-color-primary);
}

.cs-tb-btn--italic {
  font-style: italic;
}

.cs-tb-btn--strike {
  text-decoration: line-through;
}

.cs-tb-btn--underline {
  text-decoration: underline;
}

.cs-tb-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cs-tb-color {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: 0 6px;
  border-radius: 4px;
  color: #606266;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.cs-tb-color:hover {
  background: #ecf5ff;
  color: var(--el-color-primary);
}

.cs-tb-color input[type='color'] {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  border: none;
  padding: 0;
}

.cs-tb-sep {
  display: inline-block;
  width: 1px;
  height: 16px;
  margin: 0 4px;
  background: #e4e7ed;
}

.content-summary-toolbar--table {
  border-bottom: 1px dashed #e4e7ed;
  background: #f5f9ff;
}

.content-summary-toolbar--table .cs-tb-btn {
  font-weight: 400;
  gap: 2px;
}

.content-summary-body {
  padding: 10px 12px;
  min-height: 180px;
  max-height: 420px;
  overflow-y: auto;
}

.content-summary-body :deep(.ProseMirror) {
  min-height: 160px;
  outline: none;
  font-size: 14px;
  line-height: 1.6;
  color: #303133;
}

.content-summary-body :deep(.ProseMirror p) {
  margin: 0 0 8px;
}

.content-summary-body :deep(.ProseMirror ul),
.content-summary-body :deep(.ProseMirror ol) {
  padding-left: 20px;
  margin: 0 0 8px;
}

.content-summary-body :deep(.ProseMirror blockquote) {
  margin: 0 0 8px;
  padding-left: 12px;
  border-left: 3px solid #dcdfe6;
  color: #909399;
}

.content-summary-body :deep(.ProseMirror table) {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 0 0 8px;
}

.content-summary-body :deep(.ProseMirror th),
.content-summary-body :deep(.ProseMirror td) {
  min-width: 60px;
  border: 1px solid #dcdfe6;
  padding: 6px 8px;
  vertical-align: top;
  position: relative;
}

.content-summary-body :deep(.ProseMirror th) {
  background: #f5f7fa;
  font-weight: 600;
  text-align: left;
}

.content-summary-body :deep(.ProseMirror .selectedCell) {
  background: color-mix(in srgb, var(--el-color-primary) 12%, transparent);
}

.content-summary-body :deep(.ProseMirror pre) {
  background: #282c34;
  color: #f5f5f5;
  padding: 10px 12px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0 0 8px;
}

.content-summary-body :deep(.ProseMirror hr) {
  border: none;
  border-top: 1px solid #dcdfe6;
  margin: 12px 0;
}

.content-summary-body :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: #a8abb2;
  float: left;
  height: 0;
  pointer-events: none;
}

.approval-comment-row :deep(.el-form-item) {
  align-items: flex-start;
}

/* 加审标签相对整张表格上下居中（沿用 .leave-form 的 align-items: center） */
.add-review-table {
  width: 100%;
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

.approval-divider {
  margin: 6px 0 24px;
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

.documentcirculate-workflow-drawer :deep(.el-drawer__header) {
  padding: 10px 20px !important;
  margin: 0 !important;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.documentcirculate-workflow-drawer :deep(.el-drawer__title) {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
}

.documentcirculate-workflow-drawer :deep(.el-drawer__body) {
  padding: 10px 20px 20px !important;
}

.workflow-drawer-loading-host {
  height: 100%;
}

.workflow-drawer-body {
  height: 100%;
  overflow-y: auto;
  /* 留出滚动条宽度，避免右侧审批状态与滚动条重叠 */
  padding-right: 20px;
}

.workflow-reject-count {
  margin-bottom: 28px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--el-color-danger);
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
  font-size: 14px;
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
  margin-top: 2px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.workflow-user-label {
  flex-shrink: 0;
  font-size: 12px;
  white-space: nowrap;
  margin-top: 2px;
  margin-left: 4px;
  margin-right: 4px;
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

.review-log-datetime-cell {
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

.review-log-sub-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
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

<!-- 加审选人的部门树下拉挂载到 body，需非 scoped 样式，参考 workflowstep.vue -->
<style>
.documentcirculate-dept-tree-popper {
  width: auto !important;
  min-width: 320px !important;
}
.documentcirculate-dept-tree-popper .el-select-dropdown__wrap,
.documentcirculate-dept-tree-popper .el-scrollbar__view,
.documentcirculate-dept-tree-popper .el-tree {
  width: 100% !important;
  min-width: 100% !important;
}
.documentcirculate-dept-tree-popper .el-tree-node__content {
  height: 36px;
  line-height: 36px;
  padding-left: 12px;
  width: 100% !important;
  min-width: 100% !important;
}
</style>
