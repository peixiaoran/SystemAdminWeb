<template>
  <div class="leave-form-page">
    <el-config-provider :locale="elementPlusLocale">
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

              <div class="sk-actions sk-actions--end">
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
        <p class="forbidden-result__eyebrow">{{ t('formbusiness.systemaccountrequest.forbiddenViewEyebrow') }}</p>
        <h2 class="forbidden-result__title">{{ t('formbusiness.systemaccountrequest.forbiddenViewTitle') }}</h2>
        <p class="forbidden-result__desc">{{ t('formbusiness.systemaccountrequest.forbiddenViewSubTitle') }}</p>
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

      <el-form ref="formRef" :model="form" label-width="100px" class="leave-form" :validate-on-rule-change="false">

        <el-row v-if="isAnyStepFieldVisible(['FormNo', 'ApplyDate'])" :gutter="16" class="basic-info-row" style="justify-content: flex-start;">
          <el-col v-if="isStepFieldVisible('FormNo')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.formNo')" prop="formNo">
              <KeywordHighlightField :value="form.formNo" :keyword="searchKeyword" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('ApplyDate')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.applyDate')" prop="applyDate">
              <KeywordHighlightField
                :value="form.applyDate"
                :keyword="searchKeyword"
                :prefix-icon="Calendar"
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
              <KeywordHighlightField :value="form.applicantUserNo" :keyword="searchKeyword" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('UserName')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.applicantUserName')" prop="applicantUserName">
              <KeywordHighlightField :value="form.applicantUserName" :keyword="searchKeyword" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('Department')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.applicantDeptName')" prop="applicantDeptName">
              <KeywordHighlightField :value="form.applicantDeptName" :keyword="searchKeyword" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider v-if="isAnyStepFieldVisible(['FormNo', 'ApplyDate', 'UserNo', 'UserName', 'Department'])"></el-divider>

                <el-row v-if="isStepFieldVisible('RequesterUserDept')" :gutter="16" class="basic-info-row requester-row">
          <el-col :span="16">
            <el-form-item :label="t('formbusiness.systemaccountrequest.requesterUserDept')">
              <KeywordHighlightField :value="requesterDeptName" :keyword="searchKeyword" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isAnyStepFieldVisible(['RequesterUserNo', 'RequesterUserNameCn', 'RequesterUserNameEn'])" :gutter="16" class="basic-info-row requester-row">
          <el-col v-if="isStepFieldVisible('RequesterUserNo')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.requesterUserNo')">
              <KeywordHighlightField :value="form.requesterUserNo" :keyword="searchKeyword" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('RequesterUserNameCn')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.requesterUserNameCn')">
              <KeywordHighlightField :value="form.requesterUserNameCn" :keyword="searchKeyword" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('RequesterUserNameEn')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.requesterUserNameEn')">
              <KeywordHighlightField :value="form.requesterUserNameEn" :keyword="searchKeyword" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isAnyStepFieldVisible(['Nationality', 'RequesterGender', 'RequesterEmail'])" :gutter="16" class="basic-info-row requester-row">
          <el-col v-if="isStepFieldVisible('Nationality')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.nationality')">
              <KeywordHighlightField :value="nationalityName" :keyword="searchKeyword" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('RequesterGender')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.requesterGender')">
              <KeywordHighlightField :value="requesterGenderText" :keyword="searchKeyword" />
            </el-form-item>
          </el-col>
          <el-col v-if="isStepFieldVisible('RequesterEmail')" :span="8">
            <el-form-item :label="t('formbusiness.systemaccountrequest.requesterEmail')">
              <KeywordHighlightField :value="form.requesterEmail" :keyword="searchKeyword" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isStepFieldVisible('Reason')" :gutter="16" class="reason-row requester-row">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.systemaccountrequest.reason')">
              <KeywordHighlightField :value="form.reason" :keyword="searchKeyword" multiline :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider></el-divider>

        <el-row v-if="isAnyStepFieldVisible(ROW_FIELD_KEYS)" :gutter="16" class="systems-row">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.systemaccountrequest.systems')">
              <div class="systems-section-v">
              <div v-for="(row, index) in form.systems" :key="index" class="system-card">
                <div class="system-card__header">
                  <span class="system-card__title">#{{ index + 1 }}</span>
                </div>
                <div class="system-card__body">
                  <div class="system-card__col">
                    <div class="system-card__field" v-if="isStepFieldVisible('System')">
                      <span class="system-card__label">{{ t('formbusiness.systemaccountrequest.system') }}</span>
                      <span class="system-card__value" v-html="highlightKeywordHtml(getSystemName(row.system), searchKeyword)"></span>
                    </div>
                    <div class="system-card__field" v-if="isStepFieldVisible('Sites')">
                      <span class="system-card__label">{{ t('formbusiness.systemaccountrequest.sites') }}</span>
                      <span class="system-card__value" v-html="highlightKeywordHtml(getSiteNames(row.sites), searchKeyword)"></span>
                    </div>
                    <div class="system-card__field system-card__field--full" v-if="isStepFieldVisible('Permissions')">
                      <span class="system-card__label">{{ t('formbusiness.systemaccountrequest.permissions') }}</span>
                      <span class="system-card__value" v-html="highlightKeywordHtml(getPermissionNames(row), searchKeyword)"></span>
                    </div>
                  </div>
                </div>
                <div class="system-card__footer" v-if="isStepFieldVisible('Rating')">
                  <span class="system-card__label">{{ t('formbusiness.systemaccountrequest.rating') }}</span>
                  <el-rate :model-value="row.rating" disabled />
                </div>
              </div>
              <el-empty v-if="form.systems.length === 0" :image-size="50" :description="t('common.noData')" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider></el-divider>

        <el-row v-if="isStepFieldVisible('Upload') || uploadedAttachments.length > 0" :gutter="16" class="attachment-row">
          <el-col :span="24">
            <el-form-item :label="t('formbusiness.systemaccountrequest.attachments')">
              <div class="upload-section">
                <el-table :data="uploadedAttachments" border size="small" class="attachment-table">
                  <el-table-column type="index" width="55" align="center" label="#" />
                  <el-table-column :label="t('formbusiness.systemaccountrequest.fileName')" min-width="150">
                    <template #default="{ row }">
                      <span
                        style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                        :title="getAttachmentName(row)"
                        v-html="highlightKeywordHtml(getAttachmentName(row), searchKeyword)"
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('formbusiness.systemaccountrequest.fileSize')" width="100" align="center">
                    <template #default="{ row }">
                      {{ formatFileSize(getAttachmentSizeKb(row)) }}
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('common.operation')" width="170" align="center">
                    <template #default="{ row }">
                      <el-button
                        type="primary"
                        link
                        size="small"
                        :loading="downloadingKeys.has(getAttachmentKey(row))"
                        :disabled="downloadingKeys.has(getAttachmentKey(row))"
                        @click="handleDownload(row)"
                      >
                        {{ t('formbusiness.systemaccountrequest.download') }}
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
            <el-form-item :label="t('formbusiness.systemaccountrequest.addReview')">
              <el-table :data="addReviewRows" border size="small" class="add-review-table">
                <el-table-column
                  prop="sortOrder"
                  :label="t('formbusiness.systemaccountrequest.addReviewSortOrder')"
                  width="70"
                  align="center"
                />
                <el-table-column
                  :label="t('formbusiness.systemaccountrequest.addReviewDepartment')"
                  min-width="180"
                  show-overflow-tooltip
                >
                  <template #default="{ row }">
                    <span v-html="highlightKeywordHtml(row.deptName, searchKeyword)"></span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="t('formbusiness.systemaccountrequest.addReviewUserNo')"
                  width="130"
                >
                  <template #default="{ row }">
                    <span v-html="highlightKeywordHtml(row.userNo, searchKeyword)"></span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="t('formbusiness.systemaccountrequest.addReviewUserName')"
                  width="190"
                  show-overflow-tooltip
                >
                  <template #default="{ row }">
                    <span v-html="highlightKeywordHtml(row.userName, searchKeyword)"></span>
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
              <KeywordHighlightField :value="approvalComment" :keyword="searchKeyword" multiline :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item class="form-actions-form-item">
              <div class="form-actions-row">
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
import { reactive, ref, computed, onMounted } from 'vue'
import i18n from '@/i18n'
import { ElMessage, ElNotification } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { Lock, Calendar } from '@element-plus/icons-vue'
import ReviewLogCard from '../components/reviewlogcard.vue'
import WorkflowDrawer from '../components/workflowdrawer.vue'
import KeywordHighlightField from '../components/keywordhighlightfield.vue'
import { post } from '@/utils/request'
import {
  GET_SYSTEM_DROP_API,
  GET_SITE_DROP_API,
  GET_DEPARTMENT_DROP_API,
  GET_NATIONALITY_DROP_API,
  GET_PERMISSIONS_DROP_API,
  GET_SYSTEMACCOUNTREQUEST_API,
  GET_FULL_REVIEW_FLOW_API,
  GET_FORM_NOTIFY_TOKEN_API
} from '@/config/api/formbusiness/forms/systemaccountrequest'
import { MODULE_API } from '@/config/api/modulemenu/menu'
import { resolveFileUrl, downloadFileFromUrl } from '@/utils/fileUrl'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePMenuStore } from '@/stores/pmenu'
import { normalizeRouteLang, persistRouteLanguage } from '@/utils/routeLanguage'
import { getLocationQueryParam } from '@/utils/hashRouteBootstrap'
import { resolveRouteKeyword, highlightKeywordHtml } from '@/utils/keywordHighlight'
import '@/assets/styles/keywordHighlight.css'

const { t, locale } = i18n.global

const elementPlusLocale = computed(() => (locale.value === 'en-US' ? en : zhCn))

const formRef = ref(null)
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const pmenuStore = usePMenuStore()

const searchKeyword = ref('')

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
  titleKey: 'formbusiness.systemaccountrequest.approvalResultTitle',
  subTitleKey: 'formbusiness.systemaccountrequest.approvalResultSubTitle'
})

const approvalComment = ref('')
const reviewRecordList = ref([])
const stepFieldPermissionMap = ref({})
const uploadedAttachments = ref([])

function getResCode (res) {
  return res?.code ?? res?.Code
}

function isOk (res) {
  return Number(getResCode(res)) === 200
}

/* ---------------- 加审人员（查看页只读） ---------------- */

const ADD_REVIEW_MAX_ROWS = 5
// 权限键缺失时 isStepFieldVisible 默认返回 true，故用 every：任一拼写判否即生效
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

/* ---------------- 编码 → 名称映射 ---------------- */

const systemOptions = ref([])
const siteOptions = ref([])
const departmentOptions = ref([])

async function loadDepartmentOptions () {
  try {
    const res = await post(GET_DEPARTMENT_DROP_API, {})
    departmentOptions.value = isOk(res) && Array.isArray(res.data) ? res.data : []
  } catch {
    departmentOptions.value = []
  }
}

const nationalityOptions = ref([])

async function loadNationalityOptions () {
  try {
    const res = await post(GET_NATIONALITY_DROP_API, {})
    nationalityOptions.value = isOk(res) && Array.isArray(res.data) ? res.data : []
  } catch {
    nationalityOptions.value = []
  }
}

/** 国籍只存 Id，依赖国籍下拉把 Id 映射成名称展示 */
const nationalityName = computed(() => {
  if (!form.nationalityId) return ''
  const matched = nationalityOptions.value.find((item) => String(item.nationId) === String(form.nationalityId))
  return matched?.nationName || form.nationalityId
})

function findDepartmentName (list, id) {
  for (const dept of list || []) {
    if (String(dept.departmentId) === String(id)) return dept.departmentName
    const childName = findDepartmentName(dept.departmentChildList, id)
    if (childName) return childName
  }
  return ''
}

/** 需求人部门只存 Id，依赖部门树把 Id 映射成名称展示 */
const requesterDeptName = computed(() =>
  form.requesterUserDept ? (findDepartmentName(departmentOptions.value, form.requesterUserDept) || form.requesterUserDept) : ''
)

// 性别取值与系统用户一致：1=男，2=女
const requesterGenderText = computed(() => {
  if (String(form.requesterGender) === '1') return t('formbusiness.systemaccountrequest.genderMale')
  if (String(form.requesterGender) === '2') return t('formbusiness.systemaccountrequest.genderFemale')
  return ''
})
// 权限名称按「系统|厂区|权限编码」缓存，明细行里的权限只存编码
const permissionNameMap = ref({})

async function loadSystemOptions () {
  try {
    const res = await post(GET_SYSTEM_DROP_API, {})
    systemOptions.value = isOk(res) && Array.isArray(res.data) ? res.data : []
  } catch {
    systemOptions.value = []
  }
}

async function loadSiteOptions () {
  try {
    const res = await post(GET_SITE_DROP_API, {})
    siteOptions.value = isOk(res) && Array.isArray(res.data) ? res.data : []
  } catch {
    siteOptions.value = []
  }
}

/** 逐个厂区拉取权限名称，写入编码→名称映射（同一系统下编码相同视为同一权限） */
async function loadPermissionNames (rows) {
  const jobs = []
  for (const row of rows) {
    if (!row.system) continue
    for (const site of row.sites) {
      jobs.push((async () => {
        try {
          const formData = new window.FormData()
          formData.append('system', row.system)
          formData.append('site', site)
          const res = await post(GET_PERMISSIONS_DROP_API, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            silentForbiddenError: false
          })
          return { system: row.system, list: isOk(res) && Array.isArray(res.data) ? res.data : [] }
        } catch {
          return { system: row.system, list: [] }
        }
      })())
    }
  }
  const results = await Promise.all(jobs)
  const map = { ...permissionNameMap.value }
  for (const { system, list } of results) {
    for (const item of list) {
      map[`${system}|${item.permissions}`] = item.permissionsName
    }
  }
  permissionNameMap.value = map
}

function getSystemName (code) {
  const matched = systemOptions.value.find((item) => String(item.system) === String(code))
  return matched?.systemName || code || ''
}

function getSiteNames (codes) {
  return (codes || [])
    .map((code) => siteOptions.value.find((item) => String(item.site) === String(code))?.siteName || code)
    .join('、')
}

function getPermissionNames (row) {
  return (row.permissions || [])
    .map((code) => permissionNameMap.value[`${row.system}|${code}`] || code)
    .join('、')
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
        showResultNotice(res?.message || t('formbusiness.systemaccountrequest.workflowLoadFailed'), 'error')
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
    showResultNotice(t('formbusiness.systemaccountrequest.workflowLoadFailed'), 'error')
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

function normalizeFieldKey (fieldKey) {
  return String(fieldKey ?? '').replace(/\s+/g, '')
}

function normalizePermissionFlag (val, defaultValue = true) {
  if (val === undefined || val === null || val === '') return defaultValue
  return Number(val) === 1
}

/** 查看页全部不可编辑，仅保留可见性控制 */
function applyStepFieldPermissions (list) {
  const map = {}
  if (Array.isArray(list)) {
    for (const item of list) {
      const fieldKey = item?.fieldKey ?? item?.FieldKey ?? item?.fieldName ?? item?.FieldName
      if (!fieldKey) continue
      const isVisible = normalizePermissionFlag(item.isVisible ?? item.IsVisible, true)
      const key = normalizeFieldKey(fieldKey)
      const prev = map[key]
      // 同一 fieldKey 在权限列表中出现多次时，取更严格（更受限）的一条，避免被后一条静默覆盖
      map[key] = { isVisible: prev ? (prev.isVisible && isVisible) : isVisible, isEditable: false }
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

// 权限键缺失时 isStepFieldVisible 默认返回 true，故用 every：任一拼写判否即生效
function isAddReviewVisible () {
  return ADD_REVIEW_FIELD_KEYS.every((key) => isStepFieldVisible(key))
}

// 明细各栏位的权限键（应用到每一行）
const ROW_FIELD_KEYS = ['System', 'Sites', 'Permissions', 'Rating']

/** 业务 API code 状态码提示：统一走右上角通知，与编辑页保持一致 */
function showResultNotice (message, type = 'error') {
  const text = typeof message === 'string' ? message.trim() : ''
  ElNotification({
    title: '',
    message: text || t('common.operationFailed'),
    type,
    position: 'top-right'
  })
}

function isForbiddenCode (code) {
  return String(code) === '403'
}

function isBadRequestResponse (res) {
  return Number(getResCode(res)) === 400
}

function showForbiddenResult () {
  resultState.variant = 'forbidden'
  resultState.detailMessage = ''
  resultState.visible = true
  resultState.status = 'warning'
  resultState.titleKey = 'formbusiness.systemaccountrequest.forbiddenViewTitle'
  resultState.subTitleKey = 'formbusiness.systemaccountrequest.forbiddenViewSubTitle'
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

/** 后端日期字段常带 T00:00:00 等时间部分，展示时只需要日期部分 */
function toDateOnly (val) {
  if (!val) return ''
  const text = String(val).trim()
  return text.length >= 10 ? text.slice(0, 10) : text
}

function bindFormData (data) {
  const rows = (Array.isArray(data.systems) ? data.systems : []).filter(Boolean).map((item) => ({
    system: item.system != null ? String(item.system) : '',
    sites: Array.isArray(item.sites) ? item.sites.map(String) : [],
    permissions: Array.isArray(item.permissions) ? item.permissions.map(String) : [],
    rating: Number(item.rating) || 0
  }))

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
  loadPermissionNames(rows)

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

async function getSystemAccountRequestDetail (formId) {
  try {
    const res = await post(
      GET_SYSTEMACCOUNTREQUEST_API,
      new URLSearchParams({ formId: String(formId || ''), type: String(route.query.type || 'View') }),
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
        showResultNotice(res.message, 'error')
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

const downloadingKeys = reactive(new Set())

function getAttachmentKey (row) {
  return String(row?.attachmentId ?? row?.fileId ?? '') || String(getAttachmentPath(row) ?? '')
}

async function handleDownload (file) {
  const url = resolveFileUrl(getAttachmentPath(file))
  if (!url) return
  const key = getAttachmentKey(file)
  if (downloadingKeys.has(key)) return
  downloadingKeys.add(key)
  try {
    await downloadFileFromUrl(url, getAttachmentName(file))
  } finally {
    downloadingKeys.delete(key)
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
    loading.value = true
    searchKeyword.value = resolveRouteKeyword(route)
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

.sk-field--wide {
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

.systems-section-v {
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.system-card__footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
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
  min-height: 32px;
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
