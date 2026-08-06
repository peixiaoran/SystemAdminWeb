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

              <!-- 附件表格 -->
              <div class="sk-field sk-field--top">
                <el-skeleton-item variant="text" class="sk-label" />
                <el-skeleton-item variant="text" class="sk-block" />
              </div>

              <!-- 加审人员表格 -->
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
              <div class="sk-actions sk-actions--end">
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
        <p class="forbidden-result__eyebrow">{{ t('formbusiness.documentcirculate.forbiddenViewEyebrow') }}</p>
        <h2 class="forbidden-result__title">{{ t('formbusiness.documentcirculate.forbiddenViewTitle') }}</h2>
        <p class="forbidden-result__desc">{{ t('formbusiness.documentcirculate.forbiddenViewSubTitle') }}</p>
        <el-button class="forbidden-result__action" type="primary" round @click="closeCurrentPage">
          {{ t('formbusiness.documentcirculate.backToFormPending') }}
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
          <p v-if="resultState.variant === 'badRequest'" class="documentcirculate-bad-request-desc">
            {{ t('formbusiness.documentcirculate.badRequestHint') }}
          </p>
          <span v-else>{{ t(resultState.subTitleKey) }}</span>
        </template>
        <template #extra>
          <el-button type="primary" @click="closeCurrentPage">
            {{ t('formbusiness.documentcirculate.backToFormPending') }}
          </el-button>
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

      <!-- 表单主体（表格化排版，全部禁用） -->
      <el-form ref="formRef" :model="form" label-width="100px" class="leave-form" :validate-on-rule-change="false">

        <!-- 基本信息 -->
        <el-row v-if="isAnyStepFieldVisible(['FormNo', 'ApplyDate'])" :gutter="16" class="basic-info-row" style="justify-content: flex-start;">
          <el-col v-if="isStepFieldVisible('FormNo')" :span="8">
            <el-form-item :label="t('formbusiness.documentcirculate.formNo')" prop="formNo">
              <el-input v-model="form.formNo" disabled />
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
            <el-form-item :label="t('formbusiness.documentcirculate.applicantUserNo')" prop="applicantUserNo">
              <el-input v-model="form.applicantUserNo" disabled />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('UserName')" :span="8">
            <el-form-item :label="t('formbusiness.documentcirculate.applicantUserName')" prop="applicantUserName">
              <el-input v-model="form.applicantUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('Department')" :span="8">
            <el-form-item :label="t('formbusiness.documentcirculate.applicantDeptName')" prop="applicantDeptName">
              <el-input v-model="form.applicantDeptName" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider v-if="isAnyStepFieldVisible(['FormNo', 'ApplyDate', 'UserNo', 'UserName', 'Department'])"></el-divider>

        <!-- 发文部门 -->
        <el-row v-if="isStepFieldVisible('IssueDept')" :gutter="16">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.documentcirculate.issueDept')" prop="issueDept">
              <el-input v-model="form.issueDept" disabled />
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
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 内容摘要（富文本，只读） -->
        <el-row v-if="isStepFieldVisible('ContentSummary')" :gutter="16">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.documentcirculate.contentSummary')" prop="contentSummary" class="content-summary-item">
              <div class="content-summary-editor is-disabled">
                <editor-content :editor="editor" class="content-summary-body" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 附件 -->
        <el-row v-if="isStepFieldVisible('Upload') || uploadedAttachments.length > 0" :gutter="16" class="attachment-row">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.documentcirculate.attachments')">
              <div class="upload-section">
                <el-table :data="uploadedAttachments" border size="small" class="attachment-table">
                  <el-table-column type="index" width="55" align="center" label="#" />
                  <el-table-column :label="t('formbusiness.documentcirculate.fileName')" min-width="200">
                    <template #default="{ row }">
                      <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" :title="getAttachmentName(row)">{{ getAttachmentName(row) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('formbusiness.documentcirculate.fileSize')" width="100" align="center">
                    <template #default="{ row }">
                      {{ formatFileSize(getAttachmentSizeKb(row)) }}
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('common.operation')" width="150" align="center">
                    <template #default="{ row }">
                      <el-button type="primary" link size="small" @click="handleDownload(row)">
                        {{ t('formbusiness.documentcirculate.download') }}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider v-if="isAddReviewVisible()" class="add-review-divider"></el-divider>

        <!-- 加审人员：固定 5 行，顺序 1-5（查看页只读，无操作列） -->
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
                  min-width="130"
                  show-overflow-tooltip
                />
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
    <ReviewLogCard :records="reviewRecordList" i18n-prefix="formbusiness.documentcirculate" />

    </template>

    <!-- 完整审批流程 -->
    <WorkflowDrawer
      :visible="workflowDrawerVisible"
      @update:visible="workflowDrawerVisible = $event"
      :loading="workflowDrawerLoading"
      :overview="workflowOverview"
      i18n-prefix="formbusiness.documentcirculate"
    />
    </el-config-provider>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import i18n from '@/i18n'
import { ElMessage } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { Lock } from '@element-plus/icons-vue'
import ReviewLogCard from '../components/reviewlogcard.vue'
import WorkflowDrawer from '../components/workflowdrawer.vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table'
import { post } from '@/utils/request'
import {
  GET_DOCUMENTCIRCULATE_API,
  GET_FULL_REVIEW_FLOW_API,
  GET_FORM_NOTIFY_TOKEN_API
} from '@/config/api/formbusiness/forms/documentcirculate'
import { MODULE_API } from '@/config/api/modulemenu/menu'
import { resolveFileUrl, downloadFileFromUrl } from '@/utils/fileUrl'
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
const uploadedAttachments = ref([])

/* ---------------- 加审人员（查看页只读，仅显隐受权限控制） ---------------- */

const ADD_REVIEW_MAX_ROWS = 5
// 后端加审字典存在 AddReivew 拼写，两种键都判断，避免键名不匹配时误放行
const ADD_REVIEW_FIELD_KEYS = ['AddReview', 'AddReivew']

const createAddReviewRows = () =>
  Array.from({ length: ADD_REVIEW_MAX_ROWS }, (_, idx) => ({
    sortOrder: idx + 1,
    userId: '',
    userNo: '',
    userName: '',
    deptName: ''
  }))

const addReviewRows = ref(createAddReviewRows())

// 权限键缺失时 isStepFieldVisible 默认返回 true，故用 every：任一拼写判否即隐藏
function isAddReviewVisible () {
  return ADD_REVIEW_FIELD_KEYS.every((key) => isStepFieldVisible(key))
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
    }
  }
  addReviewRows.value = rows
}

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

// 内容摘要富文本编辑器（查看页始终只读；扩展需与 documentcirculate_r.vue 编辑态保持一致，否则送审内容里的
// 下划线/颜色/高亮/对齐/表格会因扩展缺失而渲染不出来）
const editor = useEditor({
  content: '',
  editable: false,
  extensions: [
    StarterKit,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Table.configure({ resizable: false }),
    TableRow,
    TableHeader,
    TableCell
  ]
})

function setContentSummaryEditorContent (html) {
  const value = html || ''
  if (editor.value && editor.value.getHTML() !== value) {
    editor.value.commands.setContent(value, false)
  }
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})

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
      map[normalizeFieldKey(fieldKey)] = {
        isVisible: normalizePermissionFlag(item.isVisible ?? item.IsVisible, true),
        isEditable: false
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
  resultState.titleKey = 'formbusiness.documentcirculate.forbiddenViewTitle'
  resultState.subTitleKey = 'formbusiness.documentcirculate.forbiddenViewSubTitle'
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

function bindFormData (data) {
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
      new URLSearchParams({ formId: String(formId || ''), type: String(route.query.type || 'View') }),
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
    bindFormData(res.data || {})
  } catch {
    // ignore
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

function getAttachmentSizeKb (row) {
  return row?.attachmentSize ?? row?.fileSize
}

function handleDownload (file) {
  const url = resolveFileUrl(getAttachmentPath(file))
  if (!url) return
  downloadFileFromUrl(url, getAttachmentName(file))
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
    loading.value = true

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
  gap: 16px;
  margin: 24px 0 18px 100px;
}

.sk-actions--end {
  justify-content: flex-end;
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
}

.content-summary-body :deep(.ProseMirror th) {
  background: #f5f7fa;
  font-weight: 600;
  text-align: left;
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

.approval-comment-row :deep(.el-form-item) {
  align-items: flex-start;
}

.approval-divider {
  margin: 6px 0 24px;
}

.add-review-table {
  width: 100%;
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

</style>
