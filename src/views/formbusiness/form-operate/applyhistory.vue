<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :model="searchForm" :inline="true" class="conventional-filter-form" role="search" :aria-label="$t('formbusiness.applyhistory.filterAriaLabel')">
        <el-form-item :label="$t('formbusiness.applyhistory.formGroupName')">
          <el-select
            v-model="searchForm.formGroupId"
            :placeholder="$t('formbusiness.applyhistory.pleaseSelectFormGroup')"
            filterable
            style="width: 220px;"
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

        <el-form-item :label="$t('formbusiness.applyhistory.formTypeName')">
          <el-select
            v-model="searchForm.formTypeId"
            :placeholder="$t('formbusiness.applyhistory.pleaseSelectFormType')"
            filterable
            style="width: 220px;"
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

        <el-form-item class="form-right-button">
          <el-button
            class="batch-print-btn"
            :disabled="selectedRows.length === 0"
            :loading="batchPrinting"
            @click="handleBatchPrintForm"
          >
            {{ $t('formbusiness.applyhistory.batchPrint') }}
          </el-button>
          <el-button
            type="success"
            :loading="exporting"
            @click="handleExportExcel"
          >
            {{ $t('formbusiness.applyhistory.exportExcel') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table
          ref="formTableRef"
          :data="formList"
          border
          stripe
          :empty-text="$t('common.noData')"
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading || filterPending"
          class="conventional-table"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" fixed :selectable="canShowPrint" />
          <el-table-column type="index" :label="$t('formbusiness.applyhistory.index')" width="70" align="center" fixed />
          <el-table-column prop="formTypeName" :label="$t('formbusiness.applyhistory.formTypeName')" align="center" min-width="220" show-overflow-tooltip />
          <el-table-column :label="$t('formbusiness.applyhistory.formNo')" align="center" min-width="200">
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
          <el-table-column :label="$t('formbusiness.applyhistory.applicantDate')" align="center" min-width="150">
            <template #default="{ row }">
              {{ formatApplicantDate(resolveApplicantDate(row)) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('formbusiness.applyhistory.formStatus')" align="center" min-width="160">
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
          <el-table-column prop="applyUserName" :label="$t('formbusiness.applyhistory.applyUserName')" align="center" min-width="140" show-overflow-tooltip />
          <el-table-column prop="applyUserDeptName" :label="$t('formbusiness.applyhistory.applyUserDeptName')" align="center" min-width="220" show-overflow-tooltip />
          <el-table-column
            :label="$t('formbusiness.applyhistory.operation')"
            align="center"
            min-width="240"
            fixed="right"
          >
            <template #default="{ row }">
              <div class="apply-history-operation-cell">
                <el-link
                  v-if="canShowWithdraw(row)"
                  class="apply-history-withdraw-link"
                  underline="never"
                  @click="handleWithdrawForm(row)"
                >
                  {{ $t('formbusiness.applyhistory.withdraw') }}
                </el-link>
                <el-link
                  v-if="canShowInvalidate(row)"
                  type="danger"
                  underline="never"
                  @click="handleVoidForm(row)"
                >
                  {{ $t('formbusiness.formpending.invalidate') }}
                </el-link>
                <span v-if="!canShowWithdraw(row) && !canShowInvalidate(row) && !canShowPrint(row)">—</span>
                <el-link
                  v-if="canShowPrint(row)"
                  class="apply-history-print-link"
                  underline="never"
                  :disabled="printingFormIds.has(row.formId)"
                  @click="handlePrintForm(row)"
                >
                  <el-icon v-if="printingFormIds.has(row.formId)" class="is-loading" style="margin-right: 4px;"><Loading /></el-icon>
                  {{ printingFormIds.has(row.formId) ? $t('formbusiness.applyhistory.printing') : $t('formbusiness.applyhistory.printPdf') }}
                </el-link>
              </div>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import service, { post } from '@/utils/request'
import { useI18n } from 'vue-i18n'
import { formatApplicantDate, resolveApplicantDate } from '@/utils/formApplicantDate'
import {
  GET_FORMGROUP_DROPDOWN_API,
  GET_FORMTYPE_DROPDOWN_API,
  GET_APPLY_HISTORY_PAGE_API,
  WITHDRAW_FORM_API,
  VOIDED_FORM_API,
  GET_FORM_PENDING_USERS_API,
  PRINT_FORM_PDF_API,
  PRINT_FORM_PDF_BATCH_API,
  EXPORT_APPLY_HISTORY_EXCEL_API
} from '@/config/api/formbusiness/form-operate/applyhistory.js'

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
const formTableRef = ref(null)
const selectedRows = ref([])
const batchPrinting = ref(false)
const exporting = ref(false)
const formPendingReviewersDialogVisible = ref(false)
const formPendingReviewersLoading = ref(false)
const formPendingReviewersList = ref([])

const formGroupPlaceholder = () => ({
  formGroupId: ALL_OPTION_VALUE,
  formGroupName: t('formbusiness.applyhistory.pleaseSelect')
})

const formTypePlaceholder = () => ({
  formTypeId: ALL_OPTION_VALUE,
  formTypeName: t('formbusiness.applyhistory.pleaseSelect')
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
        { formGroupId: ALL_OPTION_VALUE, formGroupName: t('formbusiness.applyhistory.pleaseSelect') },
        ...(res.data || [])
      ]
      if (isUnsetFilter(searchForm.formGroupId)) searchForm.formGroupId = ALL_OPTION_VALUE
      return
    }
    showMessage(res?.message || t('formbusiness.applyhistory.getFormGroupFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
  } catch {
    showMessage(t('formbusiness.applyhistory.getFormGroupFailed'))
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
        { formTypeId: ALL_OPTION_VALUE, formTypeName: t('formbusiness.applyhistory.pleaseSelect') },
        ...(res.data || [])
      ]
      return
    }
    showMessage(res?.message || t('formbusiness.applyhistory.getFormTypeFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
  } catch {
    showMessage(t('formbusiness.applyhistory.getFormTypeFailed'))
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
    const res = await post(GET_APPLY_HISTORY_PAGE_API, params)
    if (res?.code === 200) {
      formList.value = res.data || []
      pagination.totalCount = Number(res.totalCount || 0)
      selectedRows.value = []
      return
    }
    formList.value = []
    showMessage(res?.message || t('formbusiness.applyhistory.getApplyHistoryFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
  } catch {
    formList.value = []
    showMessage(t('formbusiness.applyhistory.getApplyHistoryFailed'))
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

const openPopupWindow = (href) => {
  // 不加 noopener：子页面签核完成后需要通过 window.opener 通知本页面刷新列表
  window.open(href, '_blank')
}

const openFormPage = (row) => {
  if (!row?.viewPath) return
  const path = normalizePath(row.viewPath)
  if (!isPathSafe(path)) {
    showMessage(t('formbusiness.applyhistory.getFailed'))
    return
  }
  const resolved = router.resolve({
    path,
    query: { formTypeId: String(row.formTypeId || ''), formId: String(row.formId || ''), type: 'View' }
  })
  if (!isRouteValid(resolved)) {
    showMessage(t('formbusiness.applyhistory.getFailed'))
    return
  }
  openPopupWindow(resolved.href)
}

const isSuccessCode = (code) => String(code) === '200'

const canShowWithdraw = (row) => canShowInvalidate(row)

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

const isUnderReview = (row) => normalizeStatus(row) === 'underreview'

const canShowInvalidate = (row) => {
  if (!row?.formId) return false
  return isUnderReview(row)
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
      throw new Error(t('formbusiness.applyhistory.printFailed'))
    }

    if (blob.type && blob.type.includes('application/json')) {
      const text = await blob.text()
      let message = t('formbusiness.applyhistory.printFailed')
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
    showMessage(error?.message || t('formbusiness.applyhistory.printFailed'))
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
    const params = {
      formGroupId: normalizeFilterValue(searchForm.formGroupId),
      formTypeId: normalizeFilterValue(searchForm.formTypeId),
      formNo: '',
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
      throw new Error(t('formbusiness.applyhistory.exportFailed'))
    }

    if (blob.type && blob.type.includes('application/json')) {
      const text = await blob.text()
      let message = t('formbusiness.applyhistory.exportFailed')
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
    link.download = `applyhistory_${Date.now()}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    showMessage(error?.message || t('formbusiness.applyhistory.exportFailed'))
  } finally {
    exporting.value = false
  }
}

const handleBatchPrintForm = async () => {
  if (selectedRows.value.length === 0) {
    showMessage(t('formbusiness.applyhistory.pleaseSelectFormsToPrint'), 'warning')
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
      throw new Error(t('formbusiness.applyhistory.batchPrintFailed'))
    }

    if (blob.type && blob.type.includes('application/json')) {
      const text = await blob.text()
      let message = t('formbusiness.applyhistory.batchPrintFailed')
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
    link.download = `forms_${Date.now()}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    formTableRef.value?.clearSelection()
    selectedRows.value = []
  } catch (error) {
    showMessage(error?.message || t('formbusiness.applyhistory.batchPrintFailed'))
  } finally {
    batchPrinting.value = false
  }
}

const handleVoidForm = async (row) => {
  if (!row?.formId) return
  try {
    await ElMessageBox.confirm(
      t('formbusiness.formpending.voidConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  loading.value = true
  try {
    const res = await post(
      VOIDED_FORM_API,
      buildFormData({ formId: String(row.formId) }),
      FORM_DATA_OPTIONS
    )
    if (isSuccessCode(res?.code)) {
      showMessage(res?.message || t('formbusiness.formpending.voidSuccess'), 'success')
      await getFormList()
    } else {
      showMessage(res?.message || t('formbusiness.formpending.voidFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
    }
  } catch {
    showMessage(t('formbusiness.formpending.voidFailed'))
  } finally {
    loading.value = false
  }
}

const handleWithdrawForm = async (row) => {
  if (!row?.formId) return
  try {
    await ElMessageBox.confirm(
      t('formbusiness.applyhistory.withdrawConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  loading.value = true
  try {
    const res = await post(
      WITHDRAW_FORM_API,
      buildFormData({ formId: String(row.formId) }),
      FORM_DATA_OPTIONS
    )
    if (isSuccessCode(res?.code)) {
      const successMsg = res?.message || res?.data || t('formbusiness.applyhistory.withdrawSuccess')
      showMessage(typeof successMsg === 'string' ? successMsg : t('formbusiness.applyhistory.withdrawSuccess'), 'success')
      await getFormList()
    } else {
      showMessage(res?.message || t('formbusiness.applyhistory.withdrawFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
    }
  } catch {
    showMessage(t('formbusiness.applyhistory.withdrawFailed'))
  } finally {
    loading.value = false
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

.batch-print-btn {
  color: #fff;
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

.batch-print-btn:hover:not(.is-disabled) {
  color: #fff;
  background-color: var(--el-color-primary-light-3);
  border-color: var(--el-color-primary-light-3);
}

.batch-print-btn.is-disabled {
  color: #fff;
  background-color: var(--el-color-primary-light-7);
  border-color: var(--el-color-primary-light-7);
}

.apply-history-operation-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.apply-history-operation-cell :deep(.apply-history-withdraw-link) {
  color: #e67e22;
}

.apply-history-operation-cell :deep(.apply-history-withdraw-link:hover) {
  color: #f39c4a;
}

.apply-history-operation-cell :deep(.apply-history-print-link) {
  color: var(--el-color-primary);
}

.apply-history-operation-cell :deep(.apply-history-print-link:hover) {
  color: var(--el-color-primary-light-3);
}

.apply-history-operation-cell :deep(.apply-history-print-link.is-disabled) {
  color: var(--el-link-disabled-text-color);
}

</style>
