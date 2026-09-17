<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" class="conventional-filter-form" role="search" :aria-label="$t('formbusiness.generalquery.filterAriaLabel')">
        <el-form-item>
          <el-button :icon="Filter" @click="filterDialogVisible = true">
            {{ $t('formbusiness.generalquery.filterQuery') }}
          </el-button>
          <el-button :icon="RefreshLeft" :title="$t('formbusiness.generalquery.clearAll')" @click="handleClearFiltersAndSearch" />
        </el-form-item>

        <el-form-item class="form-right-button">
          <el-button
            type="primary"
            :icon="Document"
            :disabled="selectedRows.length === 0"
            :loading="batchPrinting"
            @click="handleBatchPrintForm"
          >
            {{ $t('formbusiness.generalquery.batchPrint') }}
          </el-button>
          <el-button
            type="success"
            :loading="exporting"
            @click="handleExportExcel"
          >
            {{ $t('formbusiness.generalquery.exportExcel') }}
          </el-button>
        </el-form-item>
      </el-form>

      <el-dialog
        v-model="filterDialogVisible"
        :title="$t('formbusiness.generalquery.filterQuery')"
        width="900px"
        destroy-on-close
        append-to-body
      >
        <el-form :model="searchForm" :inline="true" label-width="120px" class="dialog-form filter-dialog">
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.generalquery.formGroupName')">
              <el-select
                v-model="searchForm.formGroupId"
                :placeholder="$t('formbusiness.generalquery.pleaseSelectFormGroup')"
                filterable
                clearable
                style="width: 100%;"
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
            <el-form-item :label="$t('formbusiness.generalquery.formTypeName')">
              <el-select
                v-model="searchForm.formTypeId"
                :placeholder="$t('formbusiness.generalquery.pleaseSelectFormType')"
                filterable
                clearable
                style="width: 100%;"
              >
                <el-option
                  v-for="item in formTypeOptions"
                  :key="item.formTypeId"
                  :label="item.formTypeName"
                  :value="item.formTypeId"
                />
              </el-select>
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item :label="$t('formbusiness.generalquery.formStatus')">
              <el-select
                v-model="searchForm.formStatus"
                :placeholder="$t('formbusiness.generalquery.pleaseSelect')"
                filterable
                clearable
                style="width: 100%;"
              >
                <el-option
                  v-for="item in formStatusOptions"
                  :key="item.formStatus"
                  :label="item.formStatusName"
                  :value="item.formStatus"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('formbusiness.generalquery.formNo')">
              <el-input v-model="searchForm.formNo" clearable style="width: 100%;" />
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item :label="$t('formbusiness.generalquery.keyword')">
              <el-input v-model="searchForm.keyword" clearable style="width: 100%;" />
            </el-form-item>
            <el-form-item :label="$t('formbusiness.generalquery.dateRange')">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="-"
                :start-placeholder="$t('formbusiness.generalquery.startDate')"
                :end-placeholder="$t('formbusiness.generalquery.endDate')"
                value-format="YYYY-MM-DD"
                style="width: 100%;"
              />
            </el-form-item>
          </div>
        </el-form>

        <template #footer>
          <div class="filter-dialog-footer">
            <el-button @click="handleClearFilters">
              {{ $t('formbusiness.generalquery.clearAll') }}
            </el-button>
            <el-button type="primary" @click="handleSearch">
              {{ $t('common.confirm') }}
            </el-button>
          </div>
        </template>
      </el-dialog>

      <div class="table-container">
        <el-table
          ref="formTableRef"
          :data="formList"
          border
          stripe
          :empty-text="$t('common.noData')"
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" fixed :selectable="canShowPrint" />
          <el-table-column type="index" :label="$t('formbusiness.generalquery.index')" width="70" align="center" fixed />
          <el-table-column prop="formTypeName" :label="$t('formbusiness.generalquery.formTypeName')" align="center" min-width="220" show-overflow-tooltip />
          <el-table-column :label="$t('formbusiness.generalquery.formNo')" align="center" min-width="200">
            <template #default="{ row }">
              <el-link
                v-if="row.viewPath"
                type="primary"
                underline="never"
                @click="openFormPage(row)"
              >
                <span v-html="highlightKeyword(row.formNo)"></span>
              </el-link>
              <span v-else v-html="highlightKeyword(row.formNo)"></span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('formbusiness.generalquery.applicantDate')" align="center" min-width="150">
            <template #default="{ row }">
              {{ formatApplicantDate(resolveApplicantDate(row)) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('formbusiness.generalquery.formStatus')" align="center" min-width="160">
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
                v-if="row.formId && isUnderReview(row)"
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
          <el-table-column prop="applyUserName" :label="$t('formbusiness.generalquery.applyUserName')" align="center" min-width="140" show-overflow-tooltip />
          <el-table-column prop="applyUserDeptName" :label="$t('formbusiness.generalquery.applyUserDeptName')" align="center" min-width="220" show-overflow-tooltip />
          <el-table-column
            :label="$t('formbusiness.generalquery.operation')"
            align="center"
            min-width="160"
            fixed="right"
          >
            <template #default="{ row }">
              <el-button
                v-if="canShowPrint(row)"
                type="primary"
                link
                :loading="printingFormIds.has(row.formId)"
                @click="handlePrintForm(row)"
              >
                {{ printingFormIds.has(row.formId) ? $t('formbusiness.generalquery.printing') : $t('formbusiness.generalquery.printPdf') }}
              </el-button>
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Filter, RefreshLeft, Document } from '@element-plus/icons-vue'
import service, { post } from '@/utils/request'
import { useI18n } from 'vue-i18n'
import { formatApplicantDate, resolveApplicantDate } from '@/utils/formApplicantDate'
import {
  GET_FORMGROUP_DROPDOWN_API,
  GET_FORMTYPE_DROPDOWN_API,
  GET_FORMSTATUS_DROPDOWN_API,
  GET_GENERAL_FORM_QUERY_PAGE_API,
  GET_FORM_PENDING_USERS_API,
  PRINT_FORM_PDF_API,
  PRINT_FORM_PDF_BATCH_API,
  EXPORT_APPLY_HISTORY_EXCEL_API
} from '@/config/api/formbusiness/compre-query/generalquery.js'

const { t } = useI18n()
const router = useRouter()

const FORM_DATA_OPTIONS = { headers: { 'Content-Type': 'multipart/form-data' }, skipDedupe: true }
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

/**
 * 下载类接口（responseType: 'blob'）失败时，axios 对非 2xx 状态码会直接 reject，
 * 此时 error.response.data 仍是 Blob，不读取的话只能看到 axios 泛化的
 * "Request failed with status code xxx"，看不到后端真实的失败原因（如具体校验信息）。
 */
const resolveBlobErrorMessage = async (error, fallbackKey) => {
  const data = error?.response?.data
  if (data instanceof Blob) {
    try {
      const json = JSON.parse(await data.text())
      if (json?.message) return json.message
    } catch {
    }
  }
  return error?.message || t(fallbackKey)
}

const escapeHtml = (str) => String(str ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const appliedKeyword = ref('')

const highlightKeyword = (text) => {
  const escapedText = escapeHtml(text || '-')
  const keyword = appliedKeyword.value.trim()
  if (!keyword) return escapedText
  const pattern = new RegExp(escapeRegExp(escapeHtml(keyword)), 'gi')
  return escapedText.replace(pattern, (match) => `<mark class="keyword-highlight">${match}</mark>`)
}

const normalizeStatus = (row) => String(row?.formStatus ?? '').trim().toLowerCase()

const isUnderReview = (row) => normalizeStatus(row) === 'underreview'

const getFormStatusTagType = (row) => {
  const s = normalizeStatus(row)
  if (s === 'approved') return 'success'
  if (s === 'underreview') return 'warning'
  if (s === 'rejected') return 'danger'
  if (s === 'voided') return 'info'
  return 'primary'
}

const loading = ref(false)
const formList = ref([])
const printingFormIds = ref(new Set())
const formTableRef = ref(null)
const selectedRows = ref([])
const batchPrinting = ref(false)
const exporting = ref(false)
const filterDialogVisible = ref(false)
const formPendingReviewersDialogVisible = ref(false)
const formPendingReviewersLoading = ref(false)
const formPendingReviewersList = ref([])

const formGroupOptions = ref([])
const formTypeOptions = ref([])
const formStatusOptions = ref([])

const defaultSearchForm = () => ({
  formGroupId: '',
  formTypeId: '',
  formStatus: '',
  formNo: '',
  keyword: '',
  dateRange: []
})

const searchForm = reactive(defaultSearchForm())

const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0
})

const normalizeFilterValue = (value) => isUnsetFilter(value) ? '' : String(value)

const getFormGroupOptions = async () => {
  try {
    const res = await post(GET_FORMGROUP_DROPDOWN_API, {})
    if (res?.code === 200) {
      formGroupOptions.value = res.data || []
      return
    }
    showMessage(res?.message || t('formbusiness.generalquery.getFormGroupFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
  } catch {
    showMessage(t('formbusiness.generalquery.getFormGroupFailed'))
  }
}

const getFormTypeOptions = async () => {
  formTypeOptions.value = []
  searchForm.formTypeId = ''
  if (isUnsetFilter(searchForm.formGroupId)) return
  try {
    const res = await post(GET_FORMTYPE_DROPDOWN_API, buildFormData({ formGroupId: String(searchForm.formGroupId) }), FORM_DATA_OPTIONS)
    if (res?.code === 200) {
      formTypeOptions.value = res.data || []
      return
    }
    showMessage(res?.message || t('formbusiness.generalquery.getFormTypeFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
  } catch {
    showMessage(t('formbusiness.generalquery.getFormTypeFailed'))
  }
}

const getFormStatusOptions = async () => {
  try {
    const res = await post(GET_FORMSTATUS_DROPDOWN_API, {})
    if (res?.code === 200) {
      formStatusOptions.value = res.data || []
      return
    }
    showMessage(res?.message || t('formbusiness.generalquery.getFormStatusFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
  } catch {
    showMessage(t('formbusiness.generalquery.getFormStatusFailed'))
  }
}

const getFormList = async () => {
  loading.value = true
  try {
    const [startDate, endDate] = searchForm.dateRange || []
    const params = {
      formGroupId: normalizeFilterValue(searchForm.formGroupId),
      formTypeId: normalizeFilterValue(searchForm.formTypeId),
      formStatus: normalizeFilterValue(searchForm.formStatus),
      formNo: searchForm.formNo || '',
      keyword: searchForm.keyword || '',
      startDate: startDate || null,
      endDate: endDate || null,
      pageIndex: String(pagination.pageIndex),
      pageSize: String(pagination.pageSize),
      totalCount: String(pagination.totalCount || 0)
    }
    const res = await post(GET_GENERAL_FORM_QUERY_PAGE_API, params)
    if (res?.code === 200) {
      formList.value = res.data || []
      pagination.totalCount = Number(res.totalCount || 0)
      selectedRows.value = []
      appliedKeyword.value = params.keyword
      return
    }
    formList.value = []
    showMessage(res?.message || t('formbusiness.generalquery.getGeneralFormQueryFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
  } catch {
    formList.value = []
    showMessage(t('formbusiness.generalquery.getGeneralFormQueryFailed'))
  } finally {
    loading.value = false
  }
}

const handleFormGroupChange = () => {
  getFormTypeOptions()
}

const handleSearch = () => {
  filterDialogVisible.value = false
  pagination.pageIndex = 1
  getFormList()
}

const handleClearFilters = async () => {
  Object.assign(searchForm, defaultSearchForm())
  await getFormTypeOptions()
}

const handleClearFiltersAndSearch = async () => {
  await handleClearFilters()
  pagination.pageIndex = 1
  await getFormList()
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

const openPopupWindow = (href) => {
  window.open(href, '_blank')
}

const openFormPage = (row) => {
  if (!row?.viewPath) return
  const path = normalizePath(row.viewPath)
  if (!isPathSafe(path)) {
    showMessage(t('formbusiness.generalquery.getFailed'))
    return
  }
  const query = { formTypeId: String(row.formTypeId || ''), formId: String(row.formId || ''), type: 'Verification' }
  if (appliedKeyword.value) {
    query.keyword = appliedKeyword.value
  }
  const resolved = router.resolve({ path, query })
  if (!isRouteValid(resolved)) {
    showMessage(t('formbusiness.generalquery.getFailed'))
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
    showMessage(res?.message || t('formbusiness.formpending.getFormPendingReviewersFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
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
      throw new Error(t('formbusiness.generalquery.printFailed'))
    }

    if (blob.type && blob.type.includes('application/json')) {
      const text = await blob.text()
      let message = t('formbusiness.generalquery.printFailed')
      try {
        const json = JSON.parse(text)
        message = json?.message || message
      } catch {
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
    showMessage(await resolveBlobErrorMessage(error, 'formbusiness.generalquery.printFailed'))
  } finally {
    printingFormIds.value.delete(row.formId)
  }
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

const handleExportExcel = async () => {
  exporting.value = true
  try {
    const [startDate, endDate] = searchForm.dateRange || []
    const params = {
      formGroupId: normalizeFilterValue(searchForm.formGroupId),
      formTypeId: normalizeFilterValue(searchForm.formTypeId),
      formStatus: normalizeFilterValue(searchForm.formStatus),
      formNo: searchForm.formNo || '',
      keyword: searchForm.keyword || '',
      startDate: startDate || null,
      endDate: endDate || null,
      pageIndex: String(pagination.pageIndex),
      pageSize: String(pagination.pageSize),
      totalCount: String(pagination.totalCount || 0)
    }
    const blob = await service({
      url: EXPORT_APPLY_HISTORY_EXCEL_API,
      method: 'post',
      data: params,
      responseType: 'blob'
    })

    if (!(blob instanceof Blob) || blob.size === 0) {
      throw new Error(t('formbusiness.generalquery.exportFailed'))
    }

    if (blob.type && blob.type.includes('application/json')) {
      const text = await blob.text()
      let message = t('formbusiness.generalquery.exportFailed')
      try {
        const json = JSON.parse(text)
        message = json?.message || message
      } catch {
      }
      throw new Error(message)
    }

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `generalquery_${Date.now()}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    showMessage(await resolveBlobErrorMessage(error, 'formbusiness.generalquery.exportFailed'))
  } finally {
    exporting.value = false
  }
}

const handleBatchPrintForm = async () => {
  if (selectedRows.value.length === 0) {
    showMessage(t('formbusiness.generalquery.pleaseSelectFormsToPrint'), 'warning')
    return
  }
  batchPrinting.value = true
  try {
    const formIds = selectedRows.value.map((row) => String(row.formId))
    const blob = await service({
      url: PRINT_FORM_PDF_BATCH_API,
      method: 'post',
      data: formIds,
      headers: { 'Content-Type': 'application/json' },
      responseType: 'blob'
    })

    if (!(blob instanceof Blob) || blob.size === 0) {
      throw new Error(t('formbusiness.generalquery.batchPrintFailed'))
    }

    if (blob.type && blob.type.includes('application/json')) {
      const text = await blob.text()
      let message = t('formbusiness.generalquery.batchPrintFailed')
      try {
        const json = JSON.parse(text)
        message = json?.message || message
      } catch {
      }
      throw new Error(message)
    }

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `forms_${Date.now()}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    formTableRef.value?.clearSelection()
    selectedRows.value = []
  } catch (error) {
    showMessage(await resolveBlobErrorMessage(error, 'formbusiness.generalquery.batchPrintFailed'))
  } finally {
    batchPrinting.value = false
  }
}

onMounted(async () => {
  await getFormGroupOptions()
  await getFormTypeOptions()
  await getFormStatusOptions()
  await getFormList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.table-container {
  min-width: 0;
}

.conventional-table :deep(.el-table) {
  min-width: 1180px;
}

.filter-dialog .form-row .el-form-item {
  flex: 0 0 calc(50% - 10px);
}

.filter-dialog .form-row .el-form-item:last-child {
  margin-right: 0;
}

.filter-dialog .form-row:last-of-type .el-form-item {
  flex: 0 0 auto;
  width: calc(50% - 10px);
}

.filter-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.conventional-table :deep(.keyword-highlight) {
  background-color: #fadb14;
  color: inherit;
  padding: 0 1px;
  border-radius: 2px;
}
</style>
