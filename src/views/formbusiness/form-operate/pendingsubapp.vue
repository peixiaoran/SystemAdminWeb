<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :model="searchForm" :inline="true" class="conventional-filter-form" role="search" aria-label="待审批筛选">
        <el-form-item>
          <el-radio-group v-model="listMode" @change="handleListModeChange">
            <el-radio-button value="pendingSubmission">
              {{ $t('formbusiness.pendingsubapp.pendingSubmission') }}
            </el-radio-button>
            <el-radio-button value="pendingsubapp">
              {{ $t('formbusiness.pendingsubapp.pendingsubapp') }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('formbusiness.pendingsubapp.formGroupName')">
          <el-select
            v-model="searchForm.formGroupId"
            :placeholder="$t('formbusiness.pendingsubapp.pleaseSelectFormGroup')"
            filterable
            clearable
            style="width: 170px"
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

        <el-form-item :label="$t('formbusiness.pendingsubapp.formTypeName')">
          <el-select
            v-model="searchForm.formTypeId"
            :placeholder="$t('formbusiness.pendingsubapp.pleaseSelectFormType')"
            filterable
            clearable
            style="width: 170px"
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

        <el-form-item v-if="listMode === 'pendingsubapp'" :label="$t('formbusiness.pendingsubapp.formStatus')">
          <el-select
            v-model="searchForm.formStatus"
            :placeholder="$t('formbusiness.pendingsubapp.pleaseSelectFormStatus')"
            clearable
            style="width: 170px"
            @change="handleFormStatusChange"
          >
            <el-option
              v-for="item in formStatusOptions"
              :key="item.formStatusCode"
              :label="item.formStatusName"
              :value="item.formStatusCode"
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
          :data="pendingsubappList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading || filterPending"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('formbusiness.pendingsubapp.index')" width="70" align="center" fixed />
          <el-table-column :label="$t('formbusiness.pendingsubapp.formNo')" align="center" min-width="140">
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
          <el-table-column prop="formTypeName" :label="$t('formbusiness.pendingsubapp.formTypeName')" align="center" min-width="140" />
          <el-table-column :label="$t('formbusiness.pendingsubapp.formStatus')" align="center" width="170">
            <template #default="{ row }">
              <el-tag :type="getFormStatusTagType(row)" effect="dark" round>
                {{ row.formStatusName || '-' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="applyUserName" :label="$t('formbusiness.pendingsubapp.applyUserName')" align="center" min-width="80" />
          <el-table-column prop="applyUserDeptName" :label="$t('formbusiness.pendingsubapp.applyUserDeptName')" align="center" min-width="170" />
          <el-table-column :label="$t('common.operation')" align="center" width="160">
            <template #default="{ row }">
              <el-link
                v-if="row.approvalPath"
                type="primary"
                underline="never"
                @click="openFormPage(row, 'approvalPath')"
              >
                {{ getActionText() }}
              </el-link>
              <el-link
                v-if="canShowInvalidate(row)"
                type="danger"
                underline="never"
                style="margin-left: 12px;"
                @click="handleVoidForm(row)"
              >
                {{ $t('formbusiness.pendingsubapp.invalidate') }}
              </el-link>
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
          @current-change="handleCurrentChange"
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
import {
  GET_FORMGROUP_DROPDOWN_API,
  GET_FORMTYPE_DROPDOWN_API,
  GET_FORMSTATUS_DROPDOWN_API,
  GET_PENDING_SUBMISSION_LIST_API,
  GET_PENDING_APPROVAL_LIST_API,
  VOIDED_FORM_API
} from '@/config/api/formbusiness/form-operate/pendingsubapp.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const loading = ref(false)
const filterPending = ref(false)
const pendingsubappList = ref([])
const formGroupOptions = ref([])
const formTypeOptions = ref([])
const formStatusOptions = ref([])
const listMode = ref('pendingsubapp')
const ALL_OPTION_VALUE = '-1'

const searchForm = reactive({
  formGroupId: ALL_OPTION_VALUE,
  formTypeId: ALL_OPTION_VALUE,
  formStatus: '',
  formNo: ''
})

const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0
})

const getFormGroupOptions = async () => {
  try {
    const response = await post(GET_FORMGROUP_DROPDOWN_API, {})
    if (response?.code === 200) {
      formGroupOptions.value = [
        { formGroupId: ALL_OPTION_VALUE, formGroupName: t('formbusiness.pendingsubapp.all') },
        ...(response.data || [])
      ]
      if (!searchForm.formGroupId) {
        searchForm.formGroupId = ALL_OPTION_VALUE
      }
      return
    }
    ElMessage({ message: response?.message || t('formbusiness.pendingsubapp.getFormGroupFailed'), type: 'error', plain: true, showClose: true })
  } catch {
    ElMessage({ message: t('formbusiness.pendingsubapp.getFormGroupFailed'), type: 'error', plain: true, showClose: true })
  }
}

const getFormTypeOptions = async () => {
  formTypeOptions.value = []
  searchForm.formTypeId = ALL_OPTION_VALUE
  if (!searchForm.formGroupId) return

  try {
    const formData = new window.FormData()
    formData.append('formGroupId', String(searchForm.formGroupId))
    const response = await post(GET_FORMTYPE_DROPDOWN_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    if (response?.code === 200) {
      formTypeOptions.value = [
        { formTypeId: ALL_OPTION_VALUE, formTypeName: t('formbusiness.pendingsubapp.all') },
        ...(response.data || [])
      ]
      return
    }
    ElMessage({ message: response?.message || t('formbusiness.pendingsubapp.getFormTypeFailed'), type: 'error', plain: true, showClose: true })
  } catch {
    ElMessage({ message: t('formbusiness.pendingsubapp.getFormTypeFailed'), type: 'error', plain: true, showClose: true })
  }
}

const getFormStatusOptions = async () => {
  try {
    const response = await post(GET_FORMSTATUS_DROPDOWN_API, {})
    if (response?.code === 200) {
      formStatusOptions.value = response.data || []
      return
    }
    ElMessage({ message: response?.message || t('formbusiness.pendingsubapp.getFormStatusFailed'), type: 'error', plain: true, showClose: true })
  } catch {
    ElMessage({ message: t('formbusiness.pendingsubapp.getFormStatusFailed'), type: 'error', plain: true, showClose: true })
  }
}

const getPendingSubAppList = async () => {
  loading.value = true
  try {
    const params = {
      formGroupId: normalizeFilterValue(searchForm.formGroupId),
      formTypeId: normalizeFilterValue(searchForm.formTypeId),
      formStatus: String(searchForm.formStatus || ''),
      formNo: String(searchForm.formNo || ''),
      pageIndex: String(pagination.pageIndex),
      pageSize: String(pagination.pageSize),
      totalCount: String(pagination.totalCount || 0)
    }
    const response = await post(getCurrentListApi(), params)
    if (response?.code === 200) {
      pendingsubappList.value = response.data || []
      pagination.totalCount = Number(response.totalCount || 0)
      return
    }
    pendingsubappList.value = []
    ElMessage({ message: response?.message || t(getCurrentListErrorKey()), type: 'error', plain: true, showClose: true })
  } catch {
    pendingsubappList.value = []
    ElMessage({ message: t(getCurrentListErrorKey()), type: 'error', plain: true, showClose: true })
  } finally {
    loading.value = false
  }
}

let searchTimer = null
let filterTimer = null
const FILTER_DEBOUNCE_MS = 300

const normalizeFilterValue = (value) => {
  return value === undefined || value === null || value === '' ? ALL_OPTION_VALUE : String(value)
}

const getCurrentListApi = () => {
  return listMode.value === 'pendingSubmission'
    ? GET_PENDING_SUBMISSION_LIST_API
    : GET_PENDING_APPROVAL_LIST_API
}

const getCurrentListErrorKey = () => {
  return listMode.value === 'pendingSubmission'
    ? 'formbusiness.pendingsubapp.getPendingSubmissionFailed'
    : 'formbusiness.pendingsubapp.getPendingSubAppFailed'
}

const getActionText = () => {
  return listMode.value === 'pendingSubmission'
    ? t('formbusiness.pendingsubapp.submission')
    : t('formbusiness.pendingsubapp.approval')
}

const scheduleFilterRequest = async (callback) => {
  if (filterTimer) clearTimeout(filterTimer)
  loading.value = true
  filterPending.value = true
  await nextTick()
  filterTimer = setTimeout(async () => {
    try {
      await callback()
    } finally {
      filterPending.value = false
    }
  }, FILTER_DEBOUNCE_MS)
}

const handleListModeChange = () => {
  searchForm.formStatus = ''
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getPendingSubAppList()
  })
}

const handleFormGroupChange = () => {
  if (!searchForm.formGroupId) {
    searchForm.formGroupId = ALL_OPTION_VALUE
  }
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getFormTypeOptions()
    await getPendingSubAppList()
  })
}

const handleFilterChange = () => {
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getPendingSubAppList()
  })
}

const handleFormTypeChange = () => {
  if (!searchForm.formTypeId) {
    searchForm.formTypeId = ALL_OPTION_VALUE
  }
  handleFilterChange()
}

const handleFormStatusChange = () => {
  handleFilterChange()
}

const handleSearch = async () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  filterPending.value = true
  await nextTick()
  searchTimer = setTimeout(async () => {
    try {
      pagination.pageIndex = 1
      await getPendingSubAppList()
    } finally {
      filterPending.value = false
    }
  }, 300)
}

const handleReset = async () => {
  searchForm.formStatus = ''
  searchForm.formNo = ''
  searchForm.formGroupId = ALL_OPTION_VALUE
  searchForm.formTypeId = ALL_OPTION_VALUE
  pagination.pageIndex = 1
  await getFormTypeOptions()
  await getPendingSubAppList()
}

const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.pageIndex = 1
  getPendingSubAppList()
}

const handleCurrentChange = (val) => {
  pagination.pageIndex = val
  getPendingSubAppList()
}

const ALLOWED_PATH_PREFIXES = ['/formbusiness/']

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

const FORM_POPUP_WIDTH = 1100
const FORM_POPUP_HEIGHT = 850

const openPopupWindow = (href, namePrefix = 'form_popup') => {
  const left = Math.max(Math.floor((window.screen.width - FORM_POPUP_WIDTH) / 2), 0)
  const top = Math.max(Math.floor((window.screen.height - FORM_POPUP_HEIGHT) / 2), 0)
  const features = [
    `width=${FORM_POPUP_WIDTH}`,
    `height=${FORM_POPUP_HEIGHT}`,
    `left=${left}`,
    `top=${top}`,
    'resizable=yes',
    'scrollbars=yes'
  ].join(',')
  const popup = window.open(href, `${namePrefix}_${Date.now()}`, features)
  popup?.focus()
}

const openFormPage = (row, pathKey) => {
  if (!row || !row[pathKey]) return
  const path = normalizePath(row[pathKey])
  if (!isPathSafe(path)) {
    ElMessage({ message: t('formbusiness.pendingsubapp.getFailed'), type: 'error', plain: true, showClose: true })
    return
  }
  const to = {
    path,
    query: {
      formTypeId: String(row.formTypeId || ''),
      formId: String(row.formId || '')
    }
  }
  const resolved = router.resolve(to)
  if (!isRouteValid(resolved)) {
    ElMessage({ message: t('formbusiness.pendingsubapp.getFailed'), type: 'error', plain: true, showClose: true })
    return
  }
  openPopupWindow(resolved.href, pathKey === 'approvalPath' ? 'pending_approval' : 'form_view')
}

const getFormStatusCode = (row) => {
  if (row?.formStatus) return String(row.formStatus)
  const matched = formStatusOptions.value.find(item => item.formStatusName === row?.formStatusName)
  return matched?.formStatusCode || ''
}

const getFormStatusTagType = (row) => {
  const code = getFormStatusCode(row)
  if (code === 'PendingSubmission') return 'warning'
  if (code === 'UnderReview') return 'primary'
  if (code === 'Rejected') return 'danger'
  if (code === 'Approved') return 'success'
  if (code === 'Voided') return 'info'
  return ''
}

const handleVoidForm = async (row) => {
  if (!row?.formId) return
  try {
    await ElMessageBox.confirm(
      t('formbusiness.pendingsubapp.voidConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  loading.value = true
  try {
    const formData = new window.FormData()
    formData.append('formId', String(row.formId))
    const res = await post(VOIDED_FORM_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    if (res?.code === 200) {
      ElMessage({ message: res.message || t('formbusiness.pendingsubapp.voidSuccess'), type: 'success', plain: true, showClose: true })
      await getPendingSubAppList()
    } else {
      ElMessage({ message: res?.message || t('formbusiness.pendingsubapp.voidFailed'), type: 'error', plain: true, showClose: true })
    }
  } catch {
    ElMessage({ message: t('formbusiness.pendingsubapp.voidFailed'), type: 'error', plain: true, showClose: true })
  } finally {
    loading.value = false
  }
}

const canShowInvalidate = (row) => {
  const value = row?.isDelete
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value === 1
  if (typeof value === 'string') return ['1', 'true', 'yes', 'y'].includes(value.trim().toLowerCase())
  return false
}

onMounted(async () => {
  await Promise.all([getFormGroupOptions(), getFormStatusOptions()])
  await getFormTypeOptions()
  await getPendingSubAppList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.table-container {
  overflow-x: auto;
}

.conventional-table {
  min-width: 960px;
}
</style>