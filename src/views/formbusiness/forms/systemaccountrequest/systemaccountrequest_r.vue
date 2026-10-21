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
              <!-- 单据基础信息 -->
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

              <!-- 需求人信息：部门占两格，其余三格一行 -->
              <div class="sk-grid">
                <div class="sk-field sk-field--wide">
                  <el-skeleton-item variant="text" class="sk-label" />
                  <el-skeleton-item variant="text" class="sk-control" />
                </div>
              </div>

              <div class="sk-grid">
                <div v-for="n in 3" :key="`sk-requester-${n}`" class="sk-field">
                  <el-skeleton-item variant="text" class="sk-label" />
                  <el-skeleton-item variant="text" class="sk-control" />
                </div>
              </div>

              <div class="sk-grid">
                <div v-for="n in 3" :key="`sk-contact-${n}`" class="sk-field">
                  <el-skeleton-item variant="text" class="sk-label" />
                  <el-skeleton-item variant="text" class="sk-control" />
                </div>
              </div>

              <div class="sk-field sk-field--top">
                <el-skeleton-item variant="text" class="sk-label" />
                <el-skeleton-item variant="text" class="sk-textarea" />
              </div>

              <div class="sk-divider" style="margin: 6px 0 24px;"></div>

              <!-- 系统明细 -->
              <div class="sk-field sk-field--top">
                <el-skeleton-item variant="text" class="sk-label" />
                <el-skeleton-item variant="text" class="sk-block sk-block--card" />
              </div>

              <div class="sk-divider" style="margin: 6px 0 24px;"></div>

              <!-- 附件 -->
              <div class="sk-field sk-field--top">
                <el-skeleton-item variant="text" class="sk-label" />
                <el-skeleton-item variant="text" class="sk-block" />
              </div>

              <div class="sk-divider" style="margin: 6px 0 24px;"></div>

              <!-- 加审人员 -->
              <div class="sk-field sk-field--top">
                <el-skeleton-item variant="text" class="sk-label" />
                <el-skeleton-item variant="text" class="sk-block" />
              </div>

              <div class="sk-divider" style="margin: 6px 0 24px;"></div>

              <!-- 送审意见 -->
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
        <p class="forbidden-result__eyebrow">{{ t('formbusiness.systemaccountrequest.forbiddenReviewEyebrow') }}</p>
        <h2 class="forbidden-result__title">{{ t('formbusiness.systemaccountrequest.forbiddenReviewTitle') }}</h2>
        <p class="forbidden-result__desc">{{ t('formbusiness.systemaccountrequest.forbiddenReviewSubTitle') }}</p>
        <span class="result-back-link" @click="closeCurrentPage">[ {{ t('formbusiness.systemaccountrequest.backToFormPending') }} ]</span>
      </div>
      <el-result
        v-else
        class="result-content"
        :class="{ 'result-content--bad-request': resultState.variant === 'badRequest' }"
        :icon="resultState.status"
        :title="resultState.variant === 'badRequest' ? resultState.detailMessage : t(resultState.titleKey)"
      >
        <template #sub-title>
          <p v-if="resultState.variant === 'badRequest'" class="systemaccountrequest-bad-request-desc">
            {{ t('formbusiness.systemaccountrequest.badRequestHint') }}
          </p>
          <span v-else>{{ t(resultState.subTitleKey) }}</span>
        </template>
        <template #extra>
          <span class="result-back-link" @click="closeCurrentPage">[ {{ t('formbusiness.systemaccountrequest.backToFormPending') }} ]</span>
        </template>
      </el-result>
    </el-card>

    <template v-else>
    <el-card class="leave-form-card" shadow="never">
      <div class="form-title-row">
        <h2 class="form-title">{{ t('formbusiness.systemaccountrequest.formTitle') }}</h2>
      </div>
      <el-divider style="margin: 22px 0;"></el-divider>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="leave-form" :validate-on-rule-change="false">

        <el-row v-if="isAnyStepFieldVisible(['FormNo', 'ApplyDate'])" :gutter="16" class="basic-info-row" style="justify-content: flex-start;">
          <el-col v-if="isStepFieldVisible('FormNo')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.formNo')" prop="formNo">
              <el-input v-model="form.formNo" :disabled="!isStepFieldEditable('FormNo')" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('ApplyDate')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.applyDate')" prop="applyDate">
              <el-date-picker
                v-model="form.applyDate"
                type="date"
                value-format="YYYY-MM-DD"
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
            <el-form-item :label="t('formbusiness.systemaccountrequest.applicantUserNo')" prop="applicantUserNo">
              <el-input v-model="form.applicantUserNo" :disabled="!isStepFieldEditable('UserNo')" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('UserName')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.applicantUserName')" prop="applicantUserName">
              <el-input v-model="form.applicantUserName" :disabled="!isStepFieldEditable('UserName')" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('Department')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.applicantDeptName')" prop="applicantDeptName">
              <el-input v-model="form.applicantDeptName" :disabled="!isStepFieldEditable('Department')" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider v-if="isAnyStepFieldVisible(['FormNo', 'ApplyDate', 'UserNo', 'UserName', 'Department'])"></el-divider>

        <!-- 需求人信息（表头级，整单一份） -->
        <el-row v-if="isStepFieldVisible('RequesterUserDept')" :gutter="16" class="basic-info-row requester-row">
          <el-col :span="16">
            <el-form-item :label="t('formbusiness.systemaccountrequest.requesterUserDept')" prop="requesterUserDept">
              <el-tree-select
                v-model="form.requesterUserDept"
                :data="departmentOptions"
                :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList' }"
                node-key="departmentId"
                check-strictly
                filterable
                clearable
                :filter-node-method="filterDepartmentNode"
                :placeholder="t('formbusiness.systemaccountrequest.pleaseSelectRequesterUserDept')"
                :disabled="!isStepFieldEditable('RequesterUserDept')"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isAnyStepFieldVisible(['RequesterUserNo', 'RequesterUserNameCn', 'RequesterUserNameEn'])" :gutter="16" class="basic-info-row requester-row">
          <el-col v-if="isStepFieldVisible('RequesterUserNo')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.requesterUserNo')" prop="requesterUserNo">
              <el-input
                v-model="form.requesterUserNo"
                maxlength="20"
                :placeholder="t('formbusiness.systemaccountrequest.pleaseInputRequesterUserNo')"
                :disabled="!isStepFieldEditable('RequesterUserNo')"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('RequesterUserNameCn')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.requesterUserNameCn')" prop="requesterUserNameCn">
              <el-input
                v-model="form.requesterUserNameCn"
                maxlength="15"
                :placeholder="t('formbusiness.systemaccountrequest.pleaseInputRequesterUserNameCn')"
                :disabled="!isStepFieldEditable('RequesterUserNameCn')"
                @blur="revalidateRequesterNames"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('RequesterUserNameEn')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.requesterUserNameEn')" prop="requesterUserNameEn">
              <el-input
                v-model="form.requesterUserNameEn"
                maxlength="50"
                :placeholder="t('formbusiness.systemaccountrequest.pleaseInputRequesterUserNameEn')"
                :disabled="!isStepFieldEditable('RequesterUserNameEn')"
                @blur="revalidateRequesterNames"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isAnyStepFieldVisible(['Nationality', 'RequesterGender', 'RequesterEmail'])" :gutter="16" class="basic-info-row requester-row">
          <el-col v-if="isStepFieldVisible('Nationality')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.nationality')" prop="nationalityId">
              <el-select
                v-model="form.nationalityId"
                filterable
                clearable
                :placeholder="t('formbusiness.systemaccountrequest.pleaseSelectNationality')"
                :disabled="!isStepFieldEditable('Nationality')"
                style="width: 100%;"
              >
                <el-option v-for="item in nationalityOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('RequesterGender')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.requesterGender')" prop="requesterGender">
              <el-select
                v-model="form.requesterGender"
                clearable
                :placeholder="t('formbusiness.systemaccountrequest.pleaseSelectRequesterGender')"
                :disabled="!isStepFieldEditable('RequesterGender')"
                style="width: 100%;"
              >
                <el-option v-for="item in genderOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('RequesterEmail')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.requesterEmail')" prop="requesterEmail">
              <el-input
                v-model="form.requesterEmail"
                maxlength="100"
                :placeholder="t('formbusiness.systemaccountrequest.pleaseInputRequesterEmail')"
                :disabled="!isStepFieldEditable('RequesterEmail')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isStepFieldVisible('Reason')" :gutter="16" class="reason-row requester-row">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.systemaccountrequest.reason')" prop="reason">
              <el-input
                v-model="form.reason"
                type="textarea"
                maxlength="500"
                show-word-limit
                :rows="3"
                :placeholder="t('formbusiness.systemaccountrequest.pleaseInputReason')"
                :disabled="!isStepFieldEditable('Reason')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider></el-divider>

        <!-- 系统明细：每个系统一行 -->
        <el-row v-if="isAnyStepFieldVisible(ROW_FIELD_KEYS)" :gutter="16" class="systems-row">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.systemaccountrequest.systems')">
              <div class="systems-section">
                <div v-if="isStepFieldVisible('AddDelItem')" class="systems-actions">
                  <el-button type="primary" plain size="small" :disabled="!isAddDelItemAllowed()" @click="addSystemRow">
                    <el-icon><Plus /></el-icon>
                    {{ t('formbusiness.systemaccountrequest.addSystem') }}
                  </el-button>
                </div>
                <div v-for="(row, index) in form.systems" :key="row._uid" class="system-item">
                  <div class="system-card">
                  <div class="system-card__header">
                    <span class="system-card__title">#{{ index + 1 }}</span>
                    <div class="system-card__header-right">
                      <el-button v-if="isStepFieldVisible('AddDelItem')" type="danger" link size="small" :disabled="!isAddDelItemAllowed()" @click="removeSystemRow(index)">
                        {{ t('formbusiness.systemaccountrequest.deleteRow') }}
                      </el-button>
                    </div>
                  </div>
                  <div class="system-card__body">
                    <div class="system-card__col">
                      <div class="system-card__field" v-if="isStepFieldVisible('System')">
                        <span class="system-card__label">{{ t('formbusiness.systemaccountrequest.system') }}</span>
                        <span v-if="!isStepFieldEditable('System')" class="system-card__value">{{ getSystemText(row) }}</span>
                        <el-form-item v-else class="system-card__item" label-width="0" :error="row._errors.system">
                        <el-select
                          v-model="row.system"
                          filterable
                          :placeholder="t('formbusiness.systemaccountrequest.pleaseSelectSystem')"
                          style="width: 100%;"
                          @change="onSystemChange(row)"
                        >
                          <el-option
                            v-for="item in systemOptions"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code"
                            :disabled="isSystemUsedByOtherRow(item.code, row)"
                          />
                        </el-select>
                        </el-form-item>
                      </div>
                      <div class="system-card__field" v-if="isStepFieldVisible('Sites')">
                        <span class="system-card__label">{{ t('formbusiness.systemaccountrequest.sites') }}</span>
                        <span v-if="!isStepFieldEditable('Sites')" class="system-card__value">{{ getSitesText(row) }}</span>
                        <el-form-item v-else class="system-card__item" label-width="0" :error="row._errors.sites">
                        <el-select
                          v-model="row.sites"
                          multiple
                          collapse-tags
                          collapse-tags-tooltip
                          :placeholder="t('formbusiness.systemaccountrequest.pleaseSelectSites')"
                          style="width: 100%;"
                          @change="onSitesChange(row)"
                        >
                          <el-option v-for="item in siteOptions" :key="item.code" :label="item.name" :value="item.code" />
                        </el-select>
                        </el-form-item>
                      </div>
                      <div class="system-card__field system-card__field--full" v-if="isStepFieldVisible('Permissions')">
                        <span class="system-card__label">{{ t('formbusiness.systemaccountrequest.permissions') }}</span>
                        <span v-if="!isStepFieldEditable('Permissions')" class="system-card__value">{{ getPermissionsText(row) }}</span>
                        <el-form-item v-else class="system-card__item" label-width="0" :error="row._errors.permissions">
                        <el-select
                          v-model="row.permissions"
                          multiple
                          :loading="row._permLoading"
                          :placeholder="t('formbusiness.systemaccountrequest.pleaseSelectPermissions')"
                          :disabled="!row.system || row.sites.length === 0"
                          @change="onPermissionsChange(row)"
                          style="width: 100%;"
                        >
                          <el-option v-for="item in row._permOptions" :key="item.code" :label="item.name" :value="item.code">
                            <span>{{ item.name }}</span>
                            <span v-if="item.notes" class="permission-notes">{{ item.notes }}</span>
                          </el-option>
                        </el-select>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="system-card__rating" v-if="isStepFieldVisible('Rating')">
                  <span class="system-card__label">{{ t('formbusiness.systemaccountrequest.rating') }}</span>
                  <el-form-item class="system-card__item" label-width="0" :error="row._errors.rating">
                    <el-rate v-model="row.rating" :disabled="!isStepFieldEditable('Rating')" @change="row._errors.rating = ''" />
                  </el-form-item>
                </div>
                </div>
                <el-empty v-if="form.systems.length === 0" :image-size="50" :description="t('common.noData')" />
                <!-- 系统为 Workflow 时，在系统明细下方提供「发送 Passkey 绑定邮件」入口 -->
                <div v-if="isPasskeyMailVisible" class="passkey-mail-bar">
                  <el-button type="primary" plain size="small" :disabled="!isStepFieldEditable('PassKeySendEmail')" @click="openPasskeyMailDialog">
                    {{ t('formbusiness.systemaccountrequest.passkeyMailButton') }}
                  </el-button>
                  <span class="passkey-mail-tip">{{ t('formbusiness.systemaccountrequest.passkeyMailTip') }}</span>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider></el-divider>

        <el-row v-if="isStepFieldVisible('Upload') || uploadedAttachments.length > 0" :gutter="16" class="attachment-row">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.systemaccountrequest.attachments')">
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
                    {{ t('formbusiness.systemaccountrequest.uploadFile') }}
                  </el-button>
                </div>
                <el-table :data="uploadedAttachments" border size="small" class="attachment-table">
                  <el-table-column type="index" width="55" align="center" label="#" />
                  <el-table-column :label="t('formbusiness.systemaccountrequest.fileName')" min-width="150">
                    <template #default="{ row }">
                      <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" :title="getAttachmentName(row)">{{ getAttachmentName(row) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('formbusiness.systemaccountrequest.fileSize')" width="100" align="center">
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
                        {{ t('formbusiness.systemaccountrequest.download') }}
                      </el-button>
                      <el-button
                        v-if="isStepFieldEditable('Upload')"
                        type="danger"
                        link
                        size="small"
                        :loading="attachmentActionKeys.has(getAttachmentKey(row))"
                        :disabled="attachmentActionKeys.has(getAttachmentKey(row))"
                        @click="removeAttachment(row, $index)"
                      >
                        {{ t('formbusiness.systemaccountrequest.deleteFile') }}
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
            <el-form-item :label="t('formbusiness.systemaccountrequest.addReview')">
              <el-table ref="addReviewTableRef" :data="addReviewRows" border size="small" class="add-review-table" row-key="_uid">
                <el-table-column v-if="isAddReviewEditable()" width="40" align="center">
                  <template #default>
                    <el-icon
                      class="add-review-drag-handle"
                      :class="{ 'is-disabled': !isAddReviewEditable() }"
                      :title="t('formbusiness.systemaccountrequest.addReviewDragTip')"
                    >
                      <Rank />
                    </el-icon>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sortOrder"
                  :label="t('formbusiness.systemaccountrequest.addReviewSortOrder')"
                  width="70"
                  align="center"
                />
                <el-table-column
                  prop="deptName"
                  :label="t('formbusiness.systemaccountrequest.addReviewDepartment')"
                  min-width="180"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="userNo"
                  :label="t('formbusiness.systemaccountrequest.addReviewUserNo')"
                  width="130"
                />
                <el-table-column
                  prop="userName"
                  :label="t('formbusiness.systemaccountrequest.addReviewUserName')"
                  width="190"
                  show-overflow-tooltip
                />
                <el-table-column v-if="isAddReviewEditable()" :label="t('common.operation')" width="150" align="center">
                  <template #default="{ row }">
                    <el-button
                      type="primary"
                      link
                      size="small"
                      @click="openAddReviewDialog(row)"
                    >
                      {{ row.userId ? t('formbusiness.systemaccountrequest.addReviewChange') : t('formbusiness.systemaccountrequest.addReviewSelect') }}
                    </el-button>
                    <el-button
                      v-if="row.userId"
                      type="danger"
                      link
                      size="small"
                      :loading="addReviewClearingKeys.has(row._uid)"
                      :disabled="addReviewClearingKeys.has(row._uid)"
                      @click="clearAddReviewRow(row)"
                    >
                      {{ t('formbusiness.systemaccountrequest.addReviewClear') }}
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
            <el-form-item :label="t('formbusiness.systemaccountrequest.approvalComment')">
              <el-input
                v-model="approvalComment"
                type="textarea"
                :rows="3"
                :placeholder="t('formbusiness.systemaccountrequest.approvalCommentPlaceholder')"
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
                  <el-button v-if="isStepFieldVisible('Save')" type="primary" round style="width:80px;" @click="onSubmit" :loading="saving" :disabled="formActionLoading || !isStepFieldEditable('Save')">{{ t('formbusiness.systemaccountrequest.saveButton') }}</el-button>
                  <el-button v-if="isStepFieldVisible('Submit')" type="success" round style="width:80px;" @click="onSubmitForApproval" :loading="approving" :disabled="formActionLoading || !isStepFieldEditable('Submit')">{{ t('formbusiness.systemaccountrequest.submitButton') }}</el-button>
                  <el-button v-if="isStepFieldVisible('Reject')" type="danger" round style="width:80px;" @click="onReject" :disabled="formActionLoading || !isStepFieldEditable('Reject')">{{ t('formbusiness.systemaccountrequest.rejectButton') }}</el-button>
                </div>
                <div class="workflow-view-entry">
                  <div class="workflow-view-hint">
                    <span class="workflow-view-hint-text">{{ t('formbusiness.systemaccountrequest.viewFullWorkflowHint') }}</span>
                  </div>
                  <el-tooltip :content="t('formbusiness.systemaccountrequest.viewFullWorkflow')" placement="top">
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

    <ReviewLogCard :records="reviewRecordList" i18n-prefix="formbusiness.systemaccountrequest" />

    </template>

    <RejectDialog
      v-model:visible="rejectDialogVisible"
      :options="rejectStepDropOptions"
      i18n-prefix="formbusiness.systemaccountrequest"
      @confirm="handleRejectConfirm"
    />

    <el-dialog
      v-model="addReviewDialogVisible"
      :title="t('formbusiness.systemaccountrequest.addReviewDialogTitle')"
      width="1100px"
      :close-on-click-modal="false"
      :append-to-body="true"
      destroy-on-close
      @closed="onAddReviewDialogClosed"
    >
      <el-form :inline="true" class="add-review-filter-form">
        <el-form-item :label="t('formbusiness.systemaccountrequest.addReviewDepartmentFilter')">
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
            :placeholder="t('formbusiness.systemaccountrequest.addReviewPleaseSelectDepartment')"
            @change="handleAddReviewDepartmentChange"
          />
        </el-form-item>
        <el-form-item :label="t('formbusiness.systemaccountrequest.applicantUserNo')">
          <el-input
            v-model="addReviewFilters.userNo"
            class="add-review-filter-input-userno"
            clearable
            :placeholder="t('formbusiness.systemaccountrequest.applicantUserNo')"
            @input="handleAddReviewFilterInput"
            @keyup.enter="handleAddReviewSearch"
            @clear="handleAddReviewFilterInput"
          />
        </el-form-item>
        <el-form-item :label="t('formbusiness.systemaccountrequest.applicantUserName')">
          <el-input
            v-model="addReviewFilters.userName"
            class="add-review-filter-input-compact"
            clearable
            :placeholder="t('formbusiness.systemaccountrequest.applicantUserName')"
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
          <el-table-column prop="userNo" :label="t('formbusiness.systemaccountrequest.applicantUserNo')" min-width="110" align="center" />
          <el-table-column prop="userName" :label="t('formbusiness.systemaccountrequest.applicantUserName')" min-width="120" align="left" show-overflow-tooltip />
          <el-table-column :label="t('formbusiness.systemaccountrequest.addReviewDepartment')" min-width="160" align="left" show-overflow-tooltip>
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

    <el-dialog
      v-model="passkeyMailDialogVisible"
      :title="t('formbusiness.systemaccountrequest.passkeyMailTitle')"
      width="560px"
      append-to-body
      :close-on-click-modal="false"
      @closed="resetPasskeyMailForm"
    >
      <el-form ref="passkeyMailFormRef" :model="passkeyMailForm" :rules="passkeyMailRules" label-width="120px" @submit.prevent>
        <el-form-item :label="t('formbusiness.systemaccountrequest.passkeyMailUserNo')" prop="userNo">
          <el-input v-model="passkeyMailForm.userNo" clearable :disabled="passkeyMailSending" />
        </el-form-item>
        <el-form-item :label="t('formbusiness.systemaccountrequest.passkeyMailEmail')" prop="email">
          <el-input v-model="passkeyMailForm.email" clearable :disabled="passkeyMailSending" @keyup.enter="submitPasskeyMail" />
        </el-form-item>
        <div class="passkey-mail-tip">{{ t('formbusiness.systemaccountrequest.passkeyMailTip') }}</div>
      </el-form>
      <template #footer>
        <el-button :disabled="passkeyMailSending" @click="passkeyMailDialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="passkeyMailSending" @click="submitPasskeyMail">
          {{ t('formbusiness.systemaccountrequest.passkeyMailSend') }}
        </el-button>
      </template>
    </el-dialog>

    <WorkflowDrawer
      :visible="workflowDrawerVisible"
      @update:visible="workflowDrawerVisible = $event"
      :loading="workflowDrawerLoading"
      :overview="workflowOverview"
      i18n-prefix="formbusiness.systemaccountrequest"
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
import { Upload, Lock, Rank, Plus } from '@element-plus/icons-vue'
import Sortable from 'sortablejs'
import ReviewLogCard from '../components/reviewlogcard.vue'
import WorkflowDrawer from '../components/workflowdrawer.vue'
import RejectDialog from '../components/rejectdialog.vue'
import { post, isHandled } from '@/utils/request'
import {
  GET_SYSTEM_DROP_API,
  GET_SITE_DROP_API,
  GET_DEPARTMENT_DROP_API,
  GET_NATIONALITY_DROP_API,
  GET_PERMISSIONS_DROP_API,
  INIT_SYSTEMACCOUNTREQUEST_API,
  GET_SYSTEMACCOUNTREQUEST_API,
  SAVE_SYSTEMACCOUNTREQUEST_API,
  SEND_PASSKEY_BIND_MAIL_API,
  UPLOAD_FILE_API,
  DELETE_FILE_API,
  GET_FULL_REVIEW_FLOW_API,
  GET_REJECT_STEP_DROP_API,
  APPROVE_SYSTEMACCOUNTREQUEST_API,
  REJECT_SYSTEMACCOUNTREQUEST_API,
  GET_FORM_NOTIFY_TOKEN_API,
  GET_ADD_REVIEW_DEPARTMENT_DROP_API,
  GET_ADD_REVIEW_USER_PAGE_API,
  INSERT_FORM_ADD_REVIEW_API,
  UPDATE_FORM_ADD_REVIEW_API,
  DELETE_FORM_ADD_REVIEW_API
} from '@/config/api/formbusiness/forms/systemaccountrequest'
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
  titleKey: 'formbusiness.systemaccountrequest.approvalResultTitle',
  subTitleKey: 'formbusiness.systemaccountrequest.approvalResultSubTitle'
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
  requesterUserDept: '',
  requesterUserNo: '',
  requesterUserNameCn: '',
  requesterUserNameEn: '',
  requesterGender: null,
  nationalityId: '',
  requesterEmail: '',
  reason: '',
  systems: []
})

// 仅对当前步骤可编辑的栏位做必填校验：只读栏位用户改不了，必填会让保存/送审无法进行
const rules = computed(() => {
  const requiredWhenEditable = (fieldKey, messageKey, trigger) =>
    isStepFieldEditable(fieldKey)
      ? [{ required: true, message: t(messageKey), trigger }]
      : []

  const namesRule = (fieldKey) =>
    isStepFieldEditable(fieldKey)
      ? [{
          validator: (_rule, _value, callback) => {
            if (String(form.requesterUserNameCn || '').trim() || String(form.requesterUserNameEn || '').trim()) {
              callback()
            } else {
              callback(new Error(t('formbusiness.systemaccountrequest.requesterUserNameRequired')))
            }
          },
          trigger: 'blur'
        }]
      : []

  return {
    requesterUserDept: requiredWhenEditable('RequesterUserDept', 'formbusiness.systemaccountrequest.pleaseSelectRequesterUserDept', 'change'),
    requesterUserNo: requiredWhenEditable('RequesterUserNo', 'formbusiness.systemaccountrequest.pleaseInputRequesterUserNo', 'blur'),
    // 中/英文姓名至少填一个（外籍人员可能没有中文名）
    requesterUserNameCn: namesRule('RequesterUserNameCn'),
    requesterUserNameEn: namesRule('RequesterUserNameEn'),
    nationalityId: requiredWhenEditable('Nationality', 'formbusiness.systemaccountrequest.pleaseSelectNationality', 'change'),
    requesterGender: requiredWhenEditable('RequesterGender', 'formbusiness.systemaccountrequest.pleaseSelectRequesterGender', 'change'),
    requesterEmail: isStepFieldEditable('RequesterEmail')
      ? [
          { required: true, message: t('formbusiness.systemaccountrequest.pleaseInputRequesterEmail'), trigger: 'blur' },
          { type: 'email', message: t('formbusiness.systemaccountrequest.requesterEmailInvalid'), trigger: 'blur' }
        ]
      : [],
    reason: requiredWhenEditable('Reason', 'formbusiness.systemaccountrequest.pleaseInputReason', 'blur')
  }
})

/* ---------------- 响应判断 ---------------- */

function getResCode (res) {
  return res?.code ?? res?.Code
}

function isOk (res) {
  return Number(getResCode(res)) === 200
}

function isForbiddenCode (code) {
  return String(code) === '403'
}

/** 402：业务性校验未通过，以告警而非错误呈现 */
function isValidationWarningCode (code) {
  return String(code) === '402'
}

function isBadRequestResponse (res) {
  return Number(getResCode(res)) === 400
}

/* ---------------- 下拉数据 ---------------- */

const systemOptions = ref([])
const siteOptions = ref([])
const departmentOptions = ref([])

// 性别取值与系统用户一致：1=男，2=女
const genderOptions = computed(() => [
  { value: 1, label: t('formbusiness.systemaccountrequest.genderMale') },
  { value: 2, label: t('formbusiness.systemaccountrequest.genderFemale') }
])

/** 中/英文姓名互相依赖，一个失焦后两个输入框的校验状态都要刷新 */
function revalidateRequesterNames () {
  formRef.value?.validateField(['requesterUserNameCn', 'requesterUserNameEn']).catch(() => {})
}

const nationalityOptions = ref([])

async function loadNationalityOptions () {
  try {
    const res = await post(GET_NATIONALITY_DROP_API, {})
    const raw = isOk(res) && Array.isArray(res.data) ? res.data : []
    nationalityOptions.value = raw.map((item) => ({ code: String(item.nationalityId), name: item.nationName }))
  } catch {
    nationalityOptions.value = []
  }
}

function filterDepartmentNode (value, data) {
  if (!value || !data?.departmentName) return true
  return data.departmentName.includes(value)
}

async function loadDepartmentOptions () {
  try {
    const res = await post(GET_DEPARTMENT_DROP_API, {})
    const raw = isOk(res) && Array.isArray(res.data) ? res.data : []
    // 部门 Id 统一转字符串，与保存/回显的 requesterUserDept 对齐
    const normalize = (dept) => ({
      ...dept,
      departmentId: String(dept.departmentId),
      departmentChildList: Array.isArray(dept.departmentChildList) ? dept.departmentChildList.map(normalize) : []
    })
    departmentOptions.value = raw.filter((dept) => dept && dept.departmentId != null).map(normalize)
  } catch {
    departmentOptions.value = []
  }
}

async function loadSystemOptions () {
  try {
    const res = await post(GET_SYSTEM_DROP_API, {})
    const raw = isOk(res) && Array.isArray(res.data) ? res.data : []
    systemOptions.value = raw.map((item) => ({ code: String(item.system), name: item.systemName }))
  } catch {
    systemOptions.value = []
  }
}

async function loadSiteOptions () {
  try {
    const res = await post(GET_SITE_DROP_API, {})
    const raw = isOk(res) && Array.isArray(res.data) ? res.data : []
    siteOptions.value = raw.map((item) => ({ code: String(item.site), name: item.siteName }))
  } catch {
    siteOptions.value = []
  }
}

// 权限接口按「系统+单个厂区」查询，缓存避免重复请求
const permissionCache = new Map()

async function fetchPermissionsBySite (system, site) {
  const key = `${system}|${site}`
  if (permissionCache.has(key)) return permissionCache.get(key)
  const formData = new window.FormData()
  formData.append('system', system)
  formData.append('site', site)
  const res = await post(GET_PERMISSIONS_DROP_API, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    silentForbiddenError: false
  })
  const raw = isOk(res) && Array.isArray(res.data) ? res.data : []
  const list = raw.map((item) => ({
    code: String(item.permissions),
    name: item.permissionsName,
    notes: item.permissionsNotes
  }))
  if (isOk(res)) permissionCache.set(key, list)
  return list
}

/** 厂区多选时逐个厂区调用，按 permissions 去重合并 */
async function refreshRowPermissions (row, pruneSelected) {
  const seq = ++row._permSeq
  if (!row.system || row.sites.length === 0) {
    row._permOptions = []
    row._permLoading = false
    if (pruneSelected) row.permissions = []
    return
  }
  row._permLoading = true
  try {
    const lists = await Promise.all(row.sites.map((site) => fetchPermissionsBySite(row.system, site)))
    if (seq !== row._permSeq) return
    const merged = new Map()
    for (const list of lists) {
      for (const item of list) {
        if (!merged.has(item.code)) merged.set(item.code, item)
      }
    }
    row._permOptions = [...merged.values()]
    if (pruneSelected) {
      row.permissions = row.permissions.filter((code) => merged.has(code))
    }
  } catch {
    if (seq !== row._permSeq) return
    row._permOptions = []
  } finally {
    if (seq === row._permSeq) row._permLoading = false
  }
}

/* ---------------- 系统明细 ---------------- */

let rowUidSeed = 0

function createSystemRow (data = {}) {
  return {
    _uid: `system-row-${++rowUidSeed}`,
    system: data.system != null ? String(data.system) : '',
    sites: Array.isArray(data.sites) ? data.sites.map(String) : [],
    permissions: Array.isArray(data.permissions) ? data.permissions.map(String) : [],
    rating: Number(data.rating) || 0,
    _permOptions: [],
    _permLoading: false,
    _permSeq: 0,
    _errors: { system: '', sites: '', permissions: '', rating: '' }
  }
}

function addSystemRow () {
  form.systems.push(createSystemRow())
  scheduleDraftSave()
}

function removeSystemRow (index) {
  const [removed] = form.systems.splice(index, 1)
  if (removed) removed._permSeq += 1
  scheduleDraftSave()
}

/** 明细增删、选择系统/厂区/权限后自动暂存：跳过必填校验，静默执行，失败不提示 */
let draftSaveTimer = null
let draftSaving = false

function scheduleDraftSave () {
  if (!form.formId) return
  clearTimeout(draftSaveTimer)
  draftSaveTimer = setTimeout(runDraftSave, 600)
}

async function runDraftSave () {
  if (!form.formId) return
  // 正在手动保存/送审/驳回，或上一次暂存未完成：稍后再试，避免并发覆盖
  if (draftSaving || formActionLoading.value) {
    scheduleDraftSave()
    return
  }
  draftSaving = true
  try {
    await saveSystemAccountRequestRequest()
  } catch {
    // 静默：用户点击保存/送审时仍会完整校验并保存
  } finally {
    draftSaving = false
  }
}

/** 字段不可编辑时以文本展示，避免禁用的下拉框看不到完整内容 */
function getSystemText (row) {
  if (!row.system) return '-'
  return systemOptions.value.find((item) => item.code === row.system)?.name || row.system
}

function getSitesText (row) {
  if (!row.sites.length) return '-'
  return row.sites.map((code) => siteOptions.value.find((item) => item.code === code)?.name || code).join('、')
}

function getPermissionsText (row) {
  if (!row.permissions.length) return '-'
  const options = row._permOptions || []
  return row.permissions.map((code) => options.find((item) => item.code === code)?.name || code).join('、')
}

function isSystemUsedByOtherRow (code, row) {
  return form.systems.some((r) => r !== row && r.system === code)
}

async function onSystemChange (row) {
  row._errors.system = ''
  row.permissions = []
  await refreshRowPermissions(row, true)
  scheduleDraftSave()
}

async function onSitesChange (row) {
  row._errors.sites = ''
  await refreshRowPermissions(row, true)
  scheduleDraftSave()
}

function onPermissionsChange (row) {
  row._errors.permissions = ''
  scheduleDraftSave()
}

function isBlankSystemRow (row) {
  return !row.system && row.sites.length === 0 && row.permissions.length === 0
}

// 明细各栏位的权限键（应用到每一行）
const ROW_FIELD_KEYS = ['System', 'Sites', 'Permissions', 'Rating']

/** 增删明细行：由 AddDelItem 权限键控制（权限键缺失时与其他栏位一致，默认允许） */
function isAddDelItemAllowed () {
  return isStepFieldVisible('AddDelItem') && isStepFieldEditable('AddDelItem')
}

/* ---------------- 发送 Passkey 绑定邮件 ---------------- */

/** 判断明细行的系统是否为 Workflow（按系统编码或名称匹配，不区分大小写） */
function isWorkflowSystemRow (row) {
  if (!row.system) return false
  const code = String(row.system).trim().toLowerCase()
  if (code === 'workflow') return true
  const name = systemOptions.value.find((item) => item.code === row.system)?.name || ''
  return String(name).trim().toLowerCase().startsWith('workflow')
}

// 权限键 PassKeySendEmail：缺失时默认可见可编辑，由系统菜单权限配置
const isPasskeyMailVisible = computed(() =>
  isStepFieldVisible('PassKeySendEmail') && form.systems.some(isWorkflowSystemRow)
)

const passkeyMailDialogVisible = ref(false)
const passkeyMailSending = ref(false)
const passkeyMailFormRef = ref(null)
const passkeyMailForm = reactive({ userNo: '', email: '' })
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passkeyMailRules = {
  userNo: [{ required: true, message: () => t('formbusiness.systemaccountrequest.passkeyMailUserNoRequired'), trigger: 'blur' }],
  email: [
    { required: true, message: () => t('formbusiness.systemaccountrequest.passkeyMailEmailRequired'), trigger: 'blur' },
    { pattern: EMAIL_PATTERN, message: () => t('formbusiness.systemaccountrequest.passkeyMailEmailFormat'), trigger: 'blur' }
  ]
}

function resetPasskeyMailForm () {
  passkeyMailForm.userNo = ''
  passkeyMailForm.email = ''
  passkeyMailFormRef.value?.clearValidate()
}

function openPasskeyMailDialog () {
  // 默认带入需求人工号与邮箱，IT 可修改
  passkeyMailForm.userNo = form.requesterUserNo?.trim() || ''
  passkeyMailForm.email = form.requesterEmail?.trim() || ''
  passkeyMailDialogVisible.value = true
}

async function submitPasskeyMail () {
  if (passkeyMailSending.value) return
  const valid = await passkeyMailFormRef.value?.validate().catch(() => false)
  if (!valid) return
  passkeyMailSending.value = true
  try {
    const res = await post(SEND_PASSKEY_BIND_MAIL_API, {
      userNo: passkeyMailForm.userNo.trim(),
      email: passkeyMailForm.email.trim()
    })
    if (isHandled(res)) return
    if (isOk(res)) {
      showFormActionNotice(res.message, 'success')
      passkeyMailDialogVisible.value = false
      return
    }
    // 404 未找到用户 / 400 邮箱格式 / 429 发送过于频繁 为可预期的业务提示，其余视为失败
    const code = Number(res?.code)
    showFormActionNotice(
      res?.message || t('formbusiness.systemaccountrequest.passkeyMailSendFailed'),
      [400, 404, 429].includes(code) ? 'warning' : 'error'
    )
  } catch {
    showFormActionNotice(t('formbusiness.systemaccountrequest.passkeyMailSendFailed'), 'error')
  } finally {
    passkeyMailSending.value = false
  }
}

/** 明细行内容可录入：任一可录入栏位（系统/厂区/权限/评分）可编辑即为 true，用于提交前校验 */
function isSystemsEditable () {
  return ['System', 'Sites', 'Permissions', 'Rating'].some((key) => isStepFieldVisible(key) && isStepFieldEditable(key))
}

/** 后端不校验必填，由前端校验；明细可为空，整行留空的行视为未填写直接忽略；错误以红字显示在对应控件下方，返回是否通过 */
function validateSystems () {
  const seen = new Set()
  let passed = true
  form.systems.forEach((row, i) => {
    row._errors = { system: '', sites: '', permissions: '', rating: '' }
    if (isBlankSystemRow(row)) return
    const no = i + 1
    const errors = row._errors
    // 只校验当前步骤可编辑的栏位，只读栏位用户改不了
    if (isStepFieldEditable('System')) {
      if (!row.system) errors.system = t('formbusiness.systemaccountrequest.rowSystemRequired', { row: no })
      else if (seen.has(row.system)) errors.system = t('formbusiness.systemaccountrequest.rowSystemDuplicated', { row: no })
      else seen.add(row.system)
    }
    if (isStepFieldEditable('Sites') && row.sites.length === 0) errors.sites = t('formbusiness.systemaccountrequest.rowSitesRequired', { row: no })
    if (isStepFieldEditable('Permissions') && row.permissions.length === 0) errors.permissions = t('formbusiness.systemaccountrequest.rowPermissionsRequired', { row: no })
    // 评分可见且可编辑时必须评分
    if (isStepFieldVisible('Rating') && isStepFieldEditable('Rating') && !(Number(row.rating) > 0)) errors.rating = t('formbusiness.systemaccountrequest.rowRatingRequired', { row: no })
    if (Object.values(errors).some(Boolean)) passed = false
  })
  return passed
}

onBeforeUnmount(() => {
  clearTimeout(draftSaveTimer)
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
    const raw = isOk(res) && Array.isArray(res.data) ? res.data : []
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
    if (!isOk(res)) {
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
        deptName: row.deptName || null,
        userId: String(row.userId),
        userNo: row.userNo || null,
        userName: row.userName || null,
        sortOrder: String(row.sortOrder)
      },
      { silentForbiddenError: false }
    )
    if (isOk(res)) {
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
  if (!isAddReviewEditable()) return
  if (oldIndex === newIndex || oldIndex == null || newIndex == null) return

  const rows = addReviewRows.value
  const previousPersistedByPosition = rows.map((r) => r.persisted)
  const previousUserIdByPosition = rows.map((r) => r.userId)

  const [movedRow] = rows.splice(oldIndex, 1)
  rows.splice(newIndex, 0, movedRow)

  const start = Math.min(oldIndex, newIndex)
  const end = Math.max(oldIndex, newIndex)
  const deleteTasks = []
  rows.forEach((row, idx) => {
    row.sortOrder = idx + 1
    if (idx < start || idx > end) return
    row.persisted = previousPersistedByPosition[idx]
    if (row.userId) {
      row.dirty = true
    } else if (row.persisted) {
      deleteTasks.push(deleteAddReviewRecord(row.sortOrder, previousUserIdByPosition[idx]).then(() => {
        row.persisted = false
        row.dirty = false
      }))
    }
  })
  await Promise.all(deleteTasks)
  await saveAddReviewRowsBatch(rows)
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

onMounted(() => {
  if (!loading.value && !resultState.visible) setupAddReviewSortable()
})

// 栏位权限在详情加载后才确定，权限变化时同步开关拖拽
watch(() => isAddReviewEditable(), (editable) => {
  addReviewSortableInstance?.option('disabled', !editable)
})

watch(() => loading.value || resultState.visible, (blocked) => {
  if (!blocked) setupAddReviewSortable()
  else destroyAddReviewSortable()
})

/** 拖拽排序后，仅将有加审数据的行整体作为 List 一次性提交，避免逐行多次请求 */
async function saveAddReviewRowsBatch (rows) {
  const formId = String(form.formId || '')
  if (!formId) return
  const list = rows
    .filter((row) => row.userId)
    .map((row) => ({
      formId,
      deptName: row.deptName || null,
      userId: String(row.userId),
      userNo: row.userNo || null,
      userName: row.userName || null,
      sortOrder: String(row.sortOrder)
    }))
  if (!list.length) return
  try {
    const res = await post(UPDATE_FORM_ADD_REVIEW_API, list, { silentForbiddenError: false })
    if (isOk(res)) {
      rows.forEach((row) => {
        if (row.userId) {
          row.persisted = true
          row.dirty = false
        }
      })
    } else if (isBadRequestResponse(res)) {
      showFormActionNotice(res?.message || t('formbusiness.systemaccountrequest.addReviewReorderFailed'), 'warning')
    }
  } catch {
    // 静默：失败时保留 dirty，保存表单时再补一次
  }
}

/** 保存表单前补发未成功落库的加审行 */
async function syncAddReviewRows () {
  for (const row of addReviewRows.value) {
    if (!row.dirty || !row.userId) continue
    await saveAddReviewRow(row, row.persisted)
  }
}

/* ---------------- 流程 ---------------- */

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
    if (isForbiddenCode(getResCode(res))) {
      showForbiddenResult()
      workflowDrawerVisible.value = false
      return
    }
    if (!isOk(res)) {
      workflowDrawerVisible.value = false
      if (isBadRequestResponse(res)) {
        showBadRequestResult(res?.message)
      } else {
        const message = res?.message || t('formbusiness.systemaccountrequest.workflowLoadFailed')
        showFormActionNotice(message, 'error')
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
    showFormActionNotice(t('formbusiness.systemaccountrequest.workflowLoadFailed'), 'error')
  } finally {
    workflowDrawerLoading.value = false
  }
}

function openWorkflowDrawer () {
  if (!form.formId) {
    ElMessage.warning(t('formbusiness.systemaccountrequest.workflowNeedFormId'))
    return
  }
  workflowDrawerVisible.value = true
  fetchFullReviewFlow()
}

/* ---------------- 栏位权限 ---------------- */

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
      const isVisible = normalizePermissionFlag(item.isVisible ?? item.IsVisible, true)
      const key = normalizeFieldKey(fieldKey)
      const prev = map[key]
      // 同一 fieldKey 在权限列表中出现多次时，取更严格（更受限）的一条，避免被后一条静默覆盖
      map[key] = prev
        ? { isVisible: prev.isVisible && isVisible, isEditable: prev.isEditable && isEditable }
        : { isVisible, isEditable }
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

/* ---------------- 结果页 / 通知 ---------------- */

function showResult (status, titleKey, subTitleKey) {
  resultState.variant = 'standard'
  resultState.detailMessage = ''
  resultState.visible = true
  resultState.status = status
  resultState.titleKey = titleKey
  resultState.subTitleKey = subTitleKey
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
  resultState.titleKey = 'formbusiness.systemaccountrequest.forbiddenReviewTitle'
  resultState.subTitleKey = 'formbusiness.systemaccountrequest.forbiddenReviewSubTitle'
}

function showBadRequestResult (message) {
  const msg = typeof message === 'string' ? message.trim() : ''
  resultState.variant = 'badRequest'
  resultState.detailMessage = msg || t('formbusiness.systemaccountrequest.badRequestFallbackMessage')
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
    if (!isOk(res)) return false
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

/* ---------------- 数据绑定 / 加载 ---------------- */

/** 后端日期字段常带 T00:00:00 等时间部分，date-picker 的 value-format 是 YYYY-MM-DD，需先截掉时间部分 */
function toDateOnly (val) {
  if (!val) return ''
  const text = String(val).trim()
  return text.length >= 10 ? text.slice(0, 10) : text
}

async function bindFormData (data) {
  const rows = Array.isArray(data.systems) ? data.systems.filter(Boolean).map(createSystemRow) : []
  Object.assign(form, {
    formId: data.formId != null ? String(data.formId) : '',
    formNo: data.formNo || '',
    formStatus: data.formStatus || '',
    formStatusName: data.formStatusName || '',
    applyDate: toDateOnly(data.applicantDate),
    applicantUserNo: data.applicantUserNo || '',
    applicantUserName: data.applicantUserName || '',
    applicantDeptName: data.applicantDeptName || '',
    requesterUserDept: data.requesterUserDept != null ? String(data.requesterUserDept) : '',
    requesterUserNo: data.requesterUserNo ?? '',
    requesterUserNameCn: data.requesterUserNameCn ?? '',
    requesterUserNameEn: data.requesterUserNameEn ?? '',
    nationalityId: data.nationalityId != null ? String(data.nationalityId) : '',
    requesterGender: data.requesterGender != null && data.requesterGender !== '' ? Number(data.requesterGender) : null,
    requesterEmail: data.requesterEmail ?? '',
    reason: data.reason ?? '',
    systems: rows
  })
  // 新建时没有明细，默认给一空行方便填写
  if (form.systems.length === 0) form.systems.push(createSystemRow())
  form.systems.forEach((row) => refreshRowPermissions(row, false))

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

async function getSystemAccountRequestDetail (formId) {
  try {
    const res = await post(
      GET_SYSTEMACCOUNTREQUEST_API,
      new URLSearchParams({ formId: String(formId || ''), type: 'Review' }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        silentForbiddenError: false
      }
    )
    if (!res) return
    if (isForbiddenCode(getResCode(res))) {
      showForbiddenResult()
      return
    }
    if (!isOk(res)) {
      if (isBadRequestResponse(res)) {
        showBadRequestResult(res?.message)
      } else {
        showFormActionNotice(res.message, 'error')
      }
      return
    }
    await bindFormData(res.data || {})
    if (isStepFieldVisible('Reject')) {
      await fetchRejectStepDrop()
    }
  } catch {}
}

/** InitSystemAccountRequest：新建申请单初始化，只创建表单实例，不创建明细 */
async function initSystemAccountRequest () {
  try {
    const formData = new window.FormData()
    formData.append('formTypeId', currentFormTypeId.value || String(route.query.formTypeId || ''))
    const res = await post(INIT_SYSTEMACCOUNTREQUEST_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      silentForbiddenError: false
    })
    if (isForbiddenCode(getResCode(res))) {
      showForbiddenResult()
      return
    }
    if (!isOk(res)) {
      if (isBadRequestResponse(res)) {
        showBadRequestResult(res?.message)
      } else if (res?.message) {
        showFormActionNotice(res.message, 'error')
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
    await getSystemAccountRequestDetail(newFormId)
  } catch {}
}

/* ---------------- 保存 / 送审 / 驳回 ---------------- */

function buildSaveSystemAccountRequestPayload () {
  return {
    formId: String(form.formId || ''),
    requesterUserDept: form.requesterUserDept || null,
    requesterUserNo: form.requesterUserNo?.trim() || null,
    requesterUserNameCn: form.requesterUserNameCn?.trim() || null,
    requesterUserNameEn: form.requesterUserNameEn?.trim() || null,
    nationalityId: form.nationalityId || null,
    requesterGender: form.requesterGender ?? null,
    requesterEmail: form.requesterEmail?.trim() || null,
    reason: form.reason || null,
    systems: form.systems
      .filter((row) => !isBlankSystemRow(row))
      .map((row) => ({
        system: row.system,
        sites: [...row.sites],
        permissions: [...row.permissions],
        rating: row.rating > 0 ? row.rating : null
      }))
  }
}

async function saveSystemAccountRequestRequest () {
  // 先同步加审人员，再保存表单；保存与送审两条路径都经过这里
  await syncAddReviewRows()
  return post(SAVE_SYSTEMACCOUNTREQUEST_API, buildSaveSystemAccountRequestPayload(), {
    silentForbiddenError: false
  })
}

/** 表头校验 + 明细校验，未通过时已给出提示 */
async function validateAll () {
  const valid = await new Promise((resolve) => {
    formRef.value?.validate((ok) => resolve(!!ok))
  })
  if (!valid) return false
  if (isSystemsEditable()) {
    if (!validateSystems()) {
      await nextTick()
      document.querySelector('.system-card .is-error')?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return false
    }
  }
  return true
}

async function onSubmit () {
  if (!(await validateAll())) return
  saving.value = true
  try {
    const res = await saveSystemAccountRequestRequest()
    if (isForbiddenCode(getResCode(res))) {
      showFormActionNotice(t('formbusiness.systemaccountrequest.forbiddenResultSubTitle'), 'warning')
    } else if (isHandled(res)) {
      // 请求未真正到达后端，request.js 已提示过一次
    } else if (isOk(res)) {
      showFormActionNotice(res.message || t('messages.saveSuccess'), 'success')
    } else if (isValidationWarningCode(getResCode(res))) {
      showFormActionNotice(res?.message, 'warning')
    } else if (isBadRequestResponse(res)) {
      showFormActionNotice(res?.message || t('formbusiness.systemaccountrequest.badRequestFallbackMessage'), 'warning')
    } else {
      showFormActionNotice(res?.message || t('messages.saveError'), 'error')
    }
  } catch {} finally {
    saving.value = false
  }
}

async function saveSystemAccountRequestBeforeSubmit () {
  const saveRes = await saveSystemAccountRequestRequest()
  if (isForbiddenCode(getResCode(saveRes))) {
    showFormActionNotice(t('formbusiness.systemaccountrequest.forbiddenResultSubTitle'), 'warning')
    return false
  }
  if (isHandled(saveRes)) {
    return false
  }
  if (!isOk(saveRes)) {
    if (isValidationWarningCode(getResCode(saveRes))) {
      showFormActionNotice(saveRes?.message, 'warning')
    } else if (isBadRequestResponse(saveRes)) {
      showFormActionNotice(saveRes?.message || t('formbusiness.systemaccountrequest.badRequestFallbackMessage'), 'warning')
    } else {
      showFormActionNotice(saveRes?.message || t('messages.saveError'), 'error')
    }
    return false
  }
  return true
}

/** 送审：校验 → 暂存 → 送审 */
async function onSubmitForApproval () {
  if (!(await validateAll())) return
  try {
    await ElMessageBox.confirm(
      t('formbusiness.systemaccountrequest.submitConfirmMessage'),
      t('formbusiness.systemaccountrequest.submitConfirmTitle'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  approving.value = true
  try {
    const saved = await saveSystemAccountRequestBeforeSubmit()
    if (!saved) return

    const formId = String(form.formId || '')
    if (!formId) {
      showFormActionNotice(t('formbusiness.systemaccountrequest.workflowNeedFormId'), 'warning')
      return
    }

    const res = await post(APPROVE_SYSTEMACCOUNTREQUEST_API, {
      formId,
      rejectStepId: '0',
      comment: approvalComment.value || null
    }, {
      silentForbiddenError: false,
      silentAuthError: false,
      disableAutoLogout: true
    })
    if (isForbiddenCode(getResCode(res))) {
      showFormActionNotice(t('formbusiness.systemaccountrequest.forbiddenResultSubTitle'), 'warning')
      return
    }
    if (isHandled(res)) {
      return
    }
    if (isOk(res)) {
      showResult('success', 'formbusiness.systemaccountrequest.approvalResultTitle', 'formbusiness.systemaccountrequest.approvalResultSubTitle')
      return
    }
    if (isValidationWarningCode(getResCode(res))) {
      showFormActionNotice(res?.message, 'warning')
      return
    }
    if (isBadRequestResponse(res)) {
      showFormActionNotice(res?.message || t('formbusiness.systemaccountrequest.badRequestFallbackMessage'), 'warning')
      return
    }
    showFormActionNotice(res?.message || t('formbusiness.systemaccountrequest.submitFailed'), 'error')
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
    if (isForbiddenCode(getResCode(res))) {
      showForbiddenResult()
      return false
    }
    if (!isOk(res)) {
      if (isBadRequestResponse(res)) {
        showBadRequestResult(res?.message)
      } else {
        showFormActionNotice(res?.message || t('formbusiness.messages.loadError'), 'error')
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
    ElMessage.warning(t('formbusiness.systemaccountrequest.workflowNeedFormId'))
    return
  }
  rejectDialogVisible.value = true
}

async function handleRejectConfirm ({ rejectStepId, rejectReason }) {
  const formId = String(form.formId || '')
  if (!formId) {
    ElMessage.warning(t('formbusiness.systemaccountrequest.workflowNeedFormId'))
    return
  }

  await nextTick()

  rejecting.value = true
  try {
    const res = await post(REJECT_SYSTEMACCOUNTREQUEST_API, {
      formId,
      rejectStepId,
      comment: rejectReason
    }, { silentForbiddenError: false })

    if (isForbiddenCode(getResCode(res))) {
      showForbiddenResult()
      return
    }
    if (isOk(res)) {
      showResult('success', 'formbusiness.systemaccountrequest.rejectResultTitle', 'formbusiness.systemaccountrequest.rejectResultSubTitle')
      return
    }
    if (isBadRequestResponse(res)) {
      showBadRequestResult(res?.message)
      return
    }
    showFormActionNotice(res?.message || t('formbusiness.systemaccountrequest.rejectFailed'), 'error')
  } catch {
    showFormActionNotice(t('formbusiness.systemaccountrequest.rejectFailed'), 'error')
  } finally {
    rejecting.value = false
  }
}

/* ---------------- 附件 ---------------- */

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
    if (isOk(res)) {
      const files = Array.isArray(res.data) ? res.data : []
      uploadedAttachments.value = [...uploadedAttachments.value, ...files]
    } else if (isHandled(res)) {
      // 请求未真正到达后端，request.js 已提示过一次
    } else {
      showFormActionNotice(res?.message || t('formbusiness.systemaccountrequest.uploadFailed'), 'error')
    }
  } catch {
    showFormActionNotice(t('formbusiness.systemaccountrequest.uploadFailed'), 'error')
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
    if (isOk(res)) {
      uploadedAttachments.value.splice(idx, 1)
    } else if (isBadRequestResponse(res)) {
      showBadRequestResult(res?.message)
    } else {
      showFormActionNotice(res?.message || t('formbusiness.systemaccountrequest.deleteFailed'), 'error')
    }
  } catch {
    showFormActionNotice(t('formbusiness.systemaccountrequest.deleteFailed'), 'error')
  } finally {
    attachmentActionKeys.delete(key)
  }
}

/* ---------------- 路由 / 初始化 ---------------- */

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
    if (isForbiddenCode(getResCode(res))) {
      showForbiddenResult()
      return ''
    }
    if (!isOk(res)) {
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
    loadSystemOptions()
    loadSiteOptions()
    loadDepartmentOptions()
    loadNationalityOptions()

    const routeToken = route.query.token || route.query.Token || getLocationQueryParam('token', 'Token')
    if (routeToken) {
      const tokenFormId = await resolveTokenFormId(String(routeToken))
      if (tokenFormId) {
        form.formId = tokenFormId
        await getSystemAccountRequestDetail(tokenFormId)
      }
      return
    }

    const routeFormId = route.query.formId || route.params?.formId
    if (routeFormId) {
      form.formId = String(routeFormId)
      await getSystemAccountRequestDetail(form.formId)
    } else {
      await initSystemAccountRequest()
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

.sk-block {
  flex: 1;
  min-width: 0;
  height: 130px;
}

.sk-grid .sk-field--wide {
  width: calc((100% - 32px) / 3 * 2 + 16px);
}

.sk-textarea {
  flex: 1;
  min-width: 0;
  height: 76px;
}

.sk-block--card {
  height: 120px;
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

.systemaccountrequest-bad-request-desc {
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

.reason-row {
  margin-top: 18px;
}

.requester-row :deep(.el-form-item__label) {
  white-space: nowrap;
}

.basic-info-row .el-form-item {
  margin-bottom: 0;
}

.basic-info-row + .basic-info-row {
  margin-top: 18px;
}

.systems-row {
  margin-top: 6px;
}

.systems-row :deep(.el-form-item) {
  align-items: flex-start;
}

.systems-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.system-card {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 10px 14px 14px;
  background: #fafbfc;
}

.system-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.system-card__title {
  font-weight: 600;
  color: #303133;
}

.system-card__header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.system-card__body {
  display: block;
}

.system-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

/* 评分位于明细卡片下方 */
.system-card__rating {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 4px;
}

.system-card__col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
  min-width: 0;
}

.system-card__field--full {
  grid-column: 1 / -1;
}

/* 明细行内校验：沿用 Element Plus 红字，错误提示在控件下方占位显示 */
.system-card__item {
  margin-bottom: 0;
}

.system-card__item :deep(.el-form-item__error) {
  position: static;
  padding-top: 4px;
}

.passkey-mail-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.passkey-mail-tip {
  font-size: 12px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}

.systems-actions {
  display: flex;
  align-items: center;
}

.systems-title {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-right: 12px;
}

.system-card__field {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.system-card__field > :last-child {
  flex: 1;
  min-width: 0;
}

.system-card__field--top {
  align-items: flex-start;
}

.system-card__label {
  flex: none;
  width: 84px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.system-card__value {
  word-break: break-word;
  line-height: 1.5;
}

.system-card__value--multiline {
  white-space: pre-wrap;
}

.permission-notes {
  margin-left: 12px;
  float: right;
  font-size: 12px;
  color: var(--el-text-color-secondary);
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

.add-review-drag-handle.is-disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.add-review-drag-handle:active {
  cursor: grabbing;
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
</style>
