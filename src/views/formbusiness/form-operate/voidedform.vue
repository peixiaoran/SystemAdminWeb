<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :model="searchForm" :inline="true" class="conventional-filter-form" role="search" aria-label="已作废表单筛选">
        <el-form-item :label="$t('formbusiness.voidedform.formGroupName')">
          <el-select
            v-model="searchForm.formGroupId"
            :placeholder="$t('formbusiness.voidedform.pleaseSelectFormGroup')"
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

        <el-form-item :label="$t('formbusiness.voidedform.formTypeName')">
          <el-select
            v-model="searchForm.formTypeId"
            :placeholder="$t('formbusiness.voidedform.pleaseSelectFormType')"
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
      </el-form>

      <div class="table-container">
        <el-table
          :data="formVoidedList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading || filterPending"
          class="conventional-table"
          :empty-text="$t('common.noData')"
        >
          <el-table-column type="index" :label="$t('formbusiness.voidedform.index')" width="70" align="center" fixed />
          <el-table-column prop="formTypeName" :label="$t('formbusiness.voidedform.formTypeName')" align="center" min-width="180" show-overflow-tooltip />
          <el-table-column :label="$t('formbusiness.voidedform.formNo')" align="center" min-width="160">
            <template #default="{ row }">
              <el-link
                v-if="row.viewPath"
                type="primary"
                underline="never"
                @click="openFormPage(row, 'viewPath')"
              >
                {{ row.formNo || '-' }}
              </el-link>
              <span v-else>{{ row.formNo || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('formbusiness.voidedform.formStatus')" align="center" min-width="160">
            <template #default="{ row }">
              <el-tag type="danger" effect="dark" round>
                {{ row.formStatusName || '-' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('formbusiness.voidedform.applicantDate')" align="center" min-width="170">
            <template #default="{ row }">
              {{ formatApplicantDate(resolveApplicantDate(row)) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('formbusiness.voidedform.voidedDate')" align="center" min-width="170">
            <template #default="{ row }">
              {{ formatVoidedDate(row.voidedDate) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.operation')" min-width="110" fixed="right" align="center">
            <template #default="{ row }">
              <el-button
                type="danger"
                size="small"
                :loading="deletingFormId === row.formId"
                :disabled="deleteLoading"
                @click="handleDeleteForm(row)"
              >
                {{ $t('formbusiness.voidedform.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.pageIndex"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="getFormVoidedList"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { post } from '@/utils/request'
import { useI18n } from 'vue-i18n'
import { formatApplicantDate, resolveApplicantDate } from '@/utils/formApplicantDate'
import {
  GET_FORMGROUP_DROPDOWN_API,
  GET_FORMTYPE_DROPDOWN_API,
  GET_FORM_VOIDED_PAGE_API,
  DELETE_FORM_API
} from '@/config/api/formbusiness/form-operate/voidedform.js'

const { t } = useI18n()
const router = useRouter()

const FORM_DATA_OPTIONS = { headers: { 'Content-Type': 'multipart/form-data' }, skipDedupe: true }
const FILTER_DEBOUNCE_MS = 300
const ALL_OPTION_VALUE = 0
const ALLOWED_PATH_PREFIXES = ['/formbusiness/']

const isUnsetFilter = (v) => v === '' || v === undefined || v === null

const FORM_URLENCODED_CONFIG = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
}

const buildFormData = (params) => {
  const fd = new FormData()
  Object.entries(params).forEach(([k, v]) => fd.append(k, v ?? ''))
  return fd
}

const buildFormParams = (params) => {
  const formParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    formParams.append(key, value ?? '')
  })
  return formParams
}

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const formatVoidedDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch {
    return dateStr || '-'
  }
}

const loading = ref(false)
const filterPending = ref(false)
const formVoidedList = ref([])

const formGroupPlaceholder = () => ({
  formGroupId: ALL_OPTION_VALUE,
  formGroupName: t('formbusiness.voidedform.pleaseSelect')
})

const formTypePlaceholder = () => ({
  formTypeId: ALL_OPTION_VALUE,
  formTypeName: t('formbusiness.voidedform.pleaseSelect')
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
        { formGroupId: ALL_OPTION_VALUE, formGroupName: t('formbusiness.voidedform.pleaseSelect') },
        ...(res.data || [])
      ]
      if (isUnsetFilter(searchForm.formGroupId)) searchForm.formGroupId = ALL_OPTION_VALUE
      return
    }
    showMessage(res?.message || t('formbusiness.voidedform.getFormGroupFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
  } catch {
    showMessage(t('formbusiness.voidedform.getFormGroupFailed'))
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
        { formTypeId: ALL_OPTION_VALUE, formTypeName: t('formbusiness.voidedform.pleaseSelect') },
        ...(res.data || [])
      ]
      return
    }
    showMessage(res?.message || t('formbusiness.voidedform.getFormTypeFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
  } catch {
    showMessage(t('formbusiness.voidedform.getFormTypeFailed'))
  }
}

const getFormVoidedList = async () => {
  loading.value = true
  try {
    const params = {
      formGroupId: normalizeFilterValue(searchForm.formGroupId),
      formTypeId: normalizeFilterValue(searchForm.formTypeId),
      pageIndex: String(pagination.pageIndex),
      pageSize: String(pagination.pageSize),
      totalCount: String(pagination.totalCount || 0)
    }
    const res = await post(GET_FORM_VOIDED_PAGE_API, params)
    if (res?.code === 200) {
      formVoidedList.value = res.data || []
      pagination.totalCount = Number(res.totalCount || 0)
      return
    }
    formVoidedList.value = []
    showMessage(res?.message || t('formbusiness.voidedform.getVoidedFormsFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
  } catch {
    formVoidedList.value = []
    showMessage(t('formbusiness.voidedform.getVoidedFormsFailed'))
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
    await getFormVoidedList()
  })
}

const handleFilterChange = () => {
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getFormVoidedList()
  })
}

const handleFormTypeChange = () => {
  if (isUnsetFilter(searchForm.formTypeId)) searchForm.formTypeId = ALL_OPTION_VALUE
  handleFilterChange()
}

const handleSearch = () => {
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getFormVoidedList()
  })
}

const handleReset = () => {
  searchForm.formGroupId = ALL_OPTION_VALUE
  searchForm.formTypeId = ALL_OPTION_VALUE
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getFormTypeOptions()
    await getFormVoidedList()
  })
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  getFormVoidedList()
}

const deleteLoading = ref(false)
const deletingFormId = ref(null)

const handleDeleteForm = async (row) => {
  const formId = row?.formId
  if (!formId) {
    showMessage(t('formbusiness.voidedform.deleteFailed'))
    return
  }
  try {
    await ElMessageBox.confirm(
      t('formbusiness.voidedform.deleteConfirm'),
      t('common.tip'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  deleteLoading.value = true
  deletingFormId.value = formId
  try {
    const res = await post(
      DELETE_FORM_API,
      buildFormParams({ formId: String(formId) }),
      FORM_URLENCODED_CONFIG
    )
    if (res?.code === 200 && res.data === true) {
      showMessage(t('formbusiness.voidedform.deleteSuccess'), 'success')
      // 删掉当前页最后一条时回退一页，避免停在空白页
      if (formVoidedList.value.length === 1 && pagination.pageIndex > 1) {
        pagination.pageIndex -= 1
      }
      await getFormVoidedList()
      return
    }
    showMessage(res?.message || t('formbusiness.voidedform.deleteFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
  } catch {
    showMessage(t('formbusiness.voidedform.deleteFailed'))
  } finally {
    deleteLoading.value = false
    deletingFormId.value = null
  }
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

const openFormPage = (row, pathKey) => {
  if (!row?.[pathKey]) return
  const path = normalizePath(row[pathKey])
  if (!isPathSafe(path)) {
    showMessage(t('formbusiness.voidedform.getFailed'))
    return
  }
  const resolved = router.resolve({
    path,
    query: { formTypeId: String(row.formTypeId || ''), formId: String(row.formId || '') }
  })
  if (!isRouteValid(resolved)) {
    showMessage(t('formbusiness.voidedform.getFailed'))
    return
  }
  openPopupWindow(resolved.href, 'form_view')
}

onMounted(async () => {
  await getFormGroupOptions()
  await getFormTypeOptions()
  await getFormVoidedList()
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


</style>
