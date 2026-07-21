<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :model="searchForm" :inline="true" class="conventional-filter-form" role="search" :aria-label="$t('formbusiness.reviewhistory.filterAriaLabel')">
        <el-form-item :label="$t('formbusiness.reviewhistory.formGroupName')">
          <el-select
            v-model="searchForm.formGroupId"
            :placeholder="$t('formbusiness.reviewhistory.pleaseSelectFormGroup')"
            filterable
            class="history-filter-select"
            @change="handleFormGroupChange"
          >
            <el-option
              v-for="item in formGroupOptions"
              :key="item.formGroupId"
              :label="item.formGroupName"
              :value="item.formGroupId"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('formbusiness.reviewhistory.formTypeName')">
          <el-select
            v-model="searchForm.formTypeId"
            :placeholder="$t('formbusiness.reviewhistory.pleaseSelectFormType')"
            filterable
            class="history-filter-select"
            @change="handleFormTypeChange"
          >
            <el-option
              v-for="item in formTypeOptions"
              :key="item.formTypeId"
              :label="item.formTypeName"
              :value="item.formTypeId"
            />
          </el-select>
        </el-form-item>

        <el-form-item class="form-button-group">
          <el-button type="primary" @click="handleSearch" plain>
            {{ $t('common.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table
          :data="formList"
          border
          stripe
          :empty-text="$t('common.noData')"
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading || filterPending"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('formbusiness.reviewhistory.index')" width="70" align="center" fixed />
          <el-table-column prop="formTypeName" :label="$t('formbusiness.reviewhistory.formTypeName')" align="center" min-width="220" show-overflow-tooltip />
          <el-table-column :label="$t('formbusiness.reviewhistory.formNo')" align="center" min-width="200">
            <template #default="{ row }">
              <el-link
                v-if="row.viewPath"
                type="primary"
                underline="never"
                @click="openFormPage(row)"
              >
                {{ row.formNo || '-' }}
              </el-link>
              <span v-else>{{ row.formNo || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('formbusiness.reviewhistory.applicantDate')" align="center" min-width="150">
            <template #default="{ row }">
              {{ formatApplicantDate(resolveApplicantDate(row)) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('formbusiness.reviewhistory.formStatus')" align="center" min-width="160">
            <template #default="{ row }">
              <el-tag :type="getFormStatusTagType(row)" effect="dark" round>
                {{ row.formStatusName || '-' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('formbusiness.formpending.pendingReviewers')"
            align="center"
            min-width="110"
          >
            <template #default="{ row }">
              <el-link
                v-if="row.formId"
                type="primary"
                underline="never"
                class="form-pending-reviewers-link"
                @click="openFormPendingReviewers(row)"
              >
                {{ $t('common.view') }}
              </el-link>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="applyUserName" :label="$t('formbusiness.reviewhistory.applyUserName')" align="center" min-width="140" show-overflow-tooltip />
          <el-table-column prop="applyUserDeptName" :label="$t('formbusiness.reviewhistory.applyUserDeptName')" align="center" min-width="220" show-overflow-tooltip />
          <el-table-column
            :label="$t('formbusiness.reviewhistory.operation')"
            align="center"
            min-width="120"
            fixed="right"
          >
            <template #default="{ row }">
              <el-link
                v-if="canShowPrint(row)"
                type="primary"
                underline="never"
                :disabled="printingFormIds.has(row.formId)"
                @click="handlePrintForm(row)"
              >
                <el-icon v-if="printingFormIds.has(row.formId)" class="is-loading" style="margin-right: 4px;"><Loading /></el-icon>
                {{ printingFormIds.has(row.formId) ? $t('formbusiness.reviewhistory.printing') : $t('formbusiness.reviewhistory.printPdf') }}
              </el-link>
              <span v-if="!canShowPrint(row)">—</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog
        v-model="formPendingReviewersDialogVisible"
        :title="$t('formbusiness.formpending.formPendingReviewersTitle')"
        width="920px"
        destroy-on-close
        append-to-body
        class="form-pending-reviewers-dialog"
        @closed="onFormPendingReviewersDialogClosed"
      >
        <el-table
          :data="formPendingReviewersList"
          border
          stripe
          max-height="420"
          v-loading="formPendingReviewersLoading"
          :empty-text="$t('formbusiness.formpending.noFormPendingReviewers')"
          :header-cell-style="{ textAlign: 'center', background: '#f5f7fa' }"
          :cell-style="{ textAlign: 'center' }"
        >
          <el-table-column type="index" :label="$t('formbusiness.formpending.index')" width="75" align="center" header-align="center" />
          <el-table-column
            prop="stepName"
            :label="$t('formbusiness.formpending.stepName')"
            min-width="130"
            align="center"
            header-align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="appointmentTypeName"
            :label="$t('formbusiness.formpending.appointmentType')"
            min-width="120"
            align="center"
            header-align="center"
            show-overflow-tooltip
          >
            <template #default="{ row: r }">{{ r.appointmentTypeName || '-' }}</template>
          </el-table-column>
          <el-table-column
            prop="reviewUserName"
            :label="$t('formbusiness.formpending.reviewerUserName')"
            min-width="120"
            align="center"
            header-align="center"
            show-overflow-tooltip
          />
          <el-table-column :label="$t('formbusiness.formpending.agentUserName')" min-width="120" align="center" header-align="center">
            <template #default="{ row }">{{ row.agentUserName || '-' }}</template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.pageIndex"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="getFormList"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import service, { post } from '@/utils/request'
import { useI18n } from 'vue-i18n'
import { formatApplicantDate, resolveApplicantDate } from '@/utils/formApplicantDate'
import {
  GET_FORMGROUP_DROPDOWN_API,
  GET_FORMTYPE_DROPDOWN_API,
  GET_REVIEW_HISTORY_PAGE_API,
  GET_FORM_PENDING_USERS_API,
  PRINT_FORM_PDF_API
} from '@/config/api/formbusiness/form-operate/reviewhistory.js'

const { t } = useI18n()
const router = useRouter()

const FORM_DATA_OPTIONS = { headers: { 'Content-Type': 'multipart/form-data' }, skipDedupe: true }
const FILTER_DEBOUNCE_MS = 300
const ALL_OPTION_VALUE = 0
const ALLOWED_PATH_PREFIXES = ['/formbusiness/']

const isUnsetFilter = (v) => v === '' || v === undefined || v === null

const buildFormData = (params) => {
  const fd = new FormData()
  Object.entries(params).forEach(([k, v]) => fd.append(k, v ?? ''))
  return fd
}

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const normalizeStatus = (row) => String(row?.formStatus ?? '').trim().toLowerCase()

const getFormStatusTagType = (row) => {
  const s = normalizeStatus(row)
  if (s === 'approved') return 'success'
  if (s === 'underreview') return 'warning'
  if (s === 'rejected') return 'danger'
  if (s === 'voided') return 'info'
  return 'primary'
}

const loading = ref(false)
const filterPending = ref(false)
const formList = ref([])
const printingFormIds = ref(new Set())
const formPendingReviewersDialogVisible = ref(false)
const formPendingReviewersLoading = ref(false)
const formPendingReviewersList = ref([])

const formGroupPlaceholder = () => ({
  formGroupId: ALL_OPTION_VALUE,
  formGroupName: t('formbusiness.reviewhistory.pleaseSelect')
})

const formTypePlaceholder = () => ({
  formTypeId: ALL_OPTION_VALUE,
  formTypeName: t('formbusiness.reviewhistory.pleaseSelect')
})

const formGroupOptions = ref([formGroupPlaceholder()])
const formTypeOptions = ref([formTypePlaceholder()])

const searchForm = reactive({
  formGroupId: ALL_OPTION_VALUE,
  formTypeId: ALL_OPTION_VALUE
})

const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0
})

const normalizeFilterValue = (value) =>
  isUnsetFilter(value) ? String(ALL_OPTION_VALUE) : String(value)

const getFormGroupOptions = async () => {
  try {
    const res = await post(GET_FORMGROUP_DROPDOWN_API, {})
    if (res?.code === 200) {
      formGroupOptions.value = [
        { formGroupId: ALL_OPTION_VALUE, formGroupName: t('formbusiness.reviewhistory.pleaseSelect') },
        ...(res.data || [])
      ]
      if (isUnsetFilter(searchForm.formGroupId)) searchForm.formGroupId = ALL_OPTION_VALUE
      return
    }
    showMessage(res?.message || t('formbusiness.reviewhistory.getFormGroupFailed'))
  } catch {
    showMessage(t('formbusiness.reviewhistory.getFormGroupFailed'))
  }
}

const getFormTypeOptions = async () => {
  formTypeOptions.value = [formTypePlaceholder()]
  searchForm.formTypeId = ALL_OPTION_VALUE
  if (isUnsetFilter(searchForm.formGroupId)) return
  try {
    const res = await post(GET_FORMTYPE_DROPDOWN_API, buildFormData({ formGroupId: String(searchForm.formGroupId) }), FORM_DATA_OPTIONS)
    if (res?.code === 200) {
      formTypeOptions.value = [
        { formTypeId: ALL_OPTION_VALUE, formTypeName: t('formbusiness.reviewhistory.pleaseSelect') },
        ...(res.data || [])
      ]
      return
    }
    showMessage(res?.message || t('formbusiness.reviewhistory.getFormTypeFailed'))
  } catch {
    showMessage(t('formbusiness.reviewhistory.getFormTypeFailed'))
  }
}

const getFormList = async () => {
  loading.value = true
  try {
    const params = {
      formGroupId: normalizeFilterValue(searchForm.formGroupId),
      formTypeId: normalizeFilterValue(searchForm.formTypeId),
      formNo: '',
      pageIndex: String(pagination.pageIndex),
      pageSize: String(pagination.pageSize),
      totalCount: String(pagination.totalCount || 0)
    }
    const res = await post(GET_REVIEW_HISTORY_PAGE_API, params)
    if (res?.code === 200) {
      formList.value = res.data || []
      pagination.totalCount = Number(res.totalCount || 0)
      return
    }
    formList.value = []
    showMessage(res?.message || t('formbusiness.reviewhistory.getReviewHistoryFailed'))
  } catch {
    formList.value = []
    showMessage(t('formbusiness.reviewhistory.getReviewHistoryFailed'))
  } finally {
    loading.value = false
  }
}

let debounceTimer = null

const scheduleFilterRequest = async (callback) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  loading.value = true
  filterPending.value = true
  await nextTick()
  debounceTimer = setTimeout(async () => {
    try {
      await callback()
    } finally {
      filterPending.value = false
    }
  }, FILTER_DEBOUNCE_MS)
}

const handleFormGroupChange = () => {
  if (isUnsetFilter(searchForm.formGroupId)) searchForm.formGroupId = ALL_OPTION_VALUE
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getFormTypeOptions()
    await getFormList()
  })
}

const handleFormTypeChange = () => {
  if (isUnsetFilter(searchForm.formTypeId)) searchForm.formTypeId = ALL_OPTION_VALUE
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getFormList()
  })
}

const handleSearch = () => {
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getFormList()
  })
}

const handleReset = () => {
  searchForm.formGroupId = ALL_OPTION_VALUE
  searchForm.formTypeId = ALL_OPTION_VALUE
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getFormTypeOptions()
    await getFormList()
  })
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  getFormList()
}

const normalizePath = (p) => {
  if (!p || typeof p !== 'string') return ''
  const path = p.trim().replace(/^#/, '')
  return path.startsWith('/') ? path : `/${path}`
}

const isPathSafe = (path) => {
  if (!path) return false
  if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:/.test(path)) return false
  if (/[<>"'`]/.test(path)) return false
  return ALLOWED_PATH_PREFIXES.some(prefix => path.startsWith(prefix))
}

const isRouteValid = (resolved) => {
  if (!resolved?.matched?.length) return false
  return !resolved.matched.some(r => r.path === '/:pathMatch(.*)*')
}

const openPopupWindow = (href, namePrefix = 'review_history_view') => {
  const aw = window.screen.availWidth
  const ah = window.screen.availHeight
  const features = [
    `width=${aw}`, `height=${ah}`, 'left=0', 'top=0', 'resizable=yes', 'scrollbars=yes'
  ].join(',')
  const popup = window.open(href, `${namePrefix}_${Date.now()}`, features)
  popup?.focus()
  try {
    popup?.moveTo(0, 0)
    popup?.resizeTo(aw, ah)
  } catch { /* resizeTo not available in all browsers */ }
}

const openFormPage = (row) => {
  if (!row?.viewPath) return
  const path = normalizePath(row.viewPath)
  if (!isPathSafe(path)) {
    showMessage(t('formbusiness.reviewhistory.getFailed'))
    return
  }
  const resolved = router.resolve({
    path,
    query: { formTypeId: String(row.formTypeId || ''), formId: String(row.formId || '') }
  })
  if (!isRouteValid(resolved)) {
    showMessage(t('formbusiness.reviewhistory.getFailed'))
    return
  }
  openPopupWindow(resolved.href)
}

const onFormPendingReviewersDialogClosed = () => {
  formPendingReviewersList.value = []
}

const openFormPendingReviewers = async (row) => {
  if (!row?.formId) return
  formPendingReviewersDialogVisible.value = true
  formPendingReviewersLoading.value = true
  formPendingReviewersList.value = []
  try {
    const res = await post(
      GET_FORM_PENDING_USERS_API,
      buildFormData({ formId: String(row.formId) }),
      FORM_DATA_OPTIONS
    )
    if (res?.code === 200) {
      formPendingReviewersList.value = Array.isArray(res.data) ? res.data : []
      return
    }
    formPendingReviewersDialogVisible.value = false
    showMessage(res?.message || t('formbusiness.formpending.getFormPendingReviewersFailed'))
  } catch {
    formPendingReviewersDialogVisible.value = false
    showMessage(t('formbusiness.formpending.getFormPendingReviewersFailed'))
  } finally {
    formPendingReviewersLoading.value = false
  }
}

const canShowPrint = (row) =>
  !!row?.formId && normalizeStatus(row) === 'approved'

const handlePrintForm = async (row) => {
  if (!row?.formId || printingFormIds.value.has(row.formId)) return
  printingFormIds.value.add(row.formId)
  try {
    const blob = await service({
      url: PRINT_FORM_PDF_API,
      method: 'post',
      data: buildFormData({ formId: String(row.formId) }),
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob'
    })

    if (!(blob instanceof Blob) || blob.size === 0) {
      throw new Error(t('formbusiness.reviewhistory.printFailed'))
    }

    if (blob.type && blob.type.includes('application/json')) {
      const text = await blob.text()
      let message = t('formbusiness.reviewhistory.printFailed')
      try {
        const json = JSON.parse(text)
        message = json?.message || message
      } catch {
        // ignore
      }
      throw new Error(message)
    }

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${row.formNo || 'form'}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    showMessage(error?.message || t('formbusiness.reviewhistory.printFailed'))
  } finally {
    printingFormIds.value.delete(row.formId)
  }
}

onMounted(async () => {
  await getFormGroupOptions()
  await getFormTypeOptions()
  await getFormList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.table-container {
  min-width: 0;
}

.conventional-table :deep(.el-table) {
  min-width: 1280px;
}

.history-filter-select {
  width: 220px;
  min-width: 200px;
}
</style>
