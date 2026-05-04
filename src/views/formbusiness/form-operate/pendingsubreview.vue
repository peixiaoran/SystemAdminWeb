<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :model="searchForm" :inline="true" class="conventional-filter-form" role="search" aria-label="待审批筛选">
        <el-form-item>
          <el-radio-group v-model="listMode" @change="handleListModeChange">
            <el-radio-button value="pendingSubmission">
              {{ $t('formbusiness.pendingsubreview.pendingSubmission') }}
            </el-radio-button>
            <el-radio-button value="pendingsubreview">
              {{ $t('formbusiness.pendingsubreview.pendingsubreview') }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('formbusiness.pendingsubreview.formGroupName')">
          <el-select
            v-model="searchForm.formGroupId"
            :placeholder="$t('formbusiness.pendingsubreview.pleaseSelectFormGroup')"
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

        <el-form-item :label="$t('formbusiness.pendingsubreview.formTypeName')">
          <el-select
            v-model="searchForm.formTypeId"
            :placeholder="$t('formbusiness.pendingsubreview.pleaseSelectFormType')"
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

        <el-form-item v-if="listMode === 'pendingsubreview'" :label="$t('formbusiness.pendingsubreview.formStatus')">
          <el-select
            v-model="searchForm.formStatus"
            :placeholder="$t('formbusiness.pendingsubreview.pleaseSelectFormStatus')"
            clearable
            style="width: 170px"
            @change="handleFilterChange"
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
          :data="pendingsubreviewList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading || filterPending"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('formbusiness.pendingsubreview.index')" width="70" align="center" fixed />
          <el-table-column :label="$t('formbusiness.pendingsubreview.formNo')" align="center" min-width="140">
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
          <el-table-column prop="formTypeName" :label="$t('formbusiness.pendingsubreview.formTypeName')" align="center" min-width="140" />
          <el-table-column :label="$t('formbusiness.pendingsubreview.formStatus')" align="center" width="170">
            <template #default="{ row }">
              <el-tag :type="getFormStatusTagType(row)" effect="dark" round>
                {{ row.formStatusName || '-' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="applyUserName" :label="$t('formbusiness.pendingsubreview.applyUserName')" align="center" min-width="80" />
          <el-table-column prop="applyUserDeptName" :label="$t('formbusiness.pendingsubreview.applyUserDeptName')" align="center" min-width="170" />
          <el-table-column :label="$t('common.operation')" align="center" width="160">
            <template #default="{ row }">
              <el-link
                v-if="row.approvalPath"
                type="primary"
                underline="never"
                @click="openFormPage(row, 'approvalPath')"
              >
                {{ actionText }}
              </el-link>
              <el-link
                v-if="canShowInvalidate(row)"
                type="danger"
                underline="never"
                style="margin-left: 12px;"
                @click="handleVoidForm(row)"
              >
                {{ $t('formbusiness.pendingsubreview.invalidate') }}
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
          @current-change="getPendingSubReviewList"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { post } from '@/utils/request'
import {
  GET_FORMGROUP_DROPDOWN_API,
  GET_FORMTYPE_DROPDOWN_API,
  GET_FORMSTATUS_DROPDOWN_API,
  GET_PENDING_SUBMISSION_LIST_API,
  GET_PENDING_REVIEW_LIST_API,
  VOIDED_FORM_API
} from '@/config/api/formbusiness/form-operate/pendingsubreview.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const FORM_DATA_OPTIONS = { headers: { 'Content-Type': 'multipart/form-data' }, skipDedupe: true }
const FILTER_DEBOUNCE_MS = 300
const ALL_OPTION_VALUE = '-1'

const buildFormData = (params) => {
  const fd = new FormData()
  Object.entries(params).forEach(([k, v]) => fd.append(k, v ?? ''))
  return fd
}

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const loading = ref(false)
const filterPending = ref(false)
const pendingsubreviewList = ref([])
const formGroupOptions = ref([])
const formTypeOptions = ref([])
const formStatusOptions = ref([])
const listMode = ref('pendingsubreview')

const searchForm = reactive({
  formGroupId: ALL_OPTION_VALUE,
  formTypeId:  ALL_OPTION_VALUE,
  formStatus:  '',
  formNo:      ''
})

const pagination = reactive({
  pageIndex: 1,
  pageSize:  10,
  totalCount: 0
})

const actionText = computed(() =>
  listMode.value === 'pendingSubmission'
    ? t('formbusiness.pendingsubreview.submission')
    : t('formbusiness.pendingsubreview.approval')
)

const getCurrentListApi = () =>
  listMode.value === 'pendingSubmission' ? GET_PENDING_SUBMISSION_LIST_API : GET_PENDING_REVIEW_LIST_API

const getCurrentListErrorKey = () =>
  listMode.value === 'pendingSubmission'
    ? 'formbusiness.pendingsubreview.getPendingSubmissionFailed'
    : 'formbusiness.pendingsubreview.getPendingSubReviewFailed'

const normalizeFilterValue = (value) =>
  value === undefined || value === null || value === '' ? ALL_OPTION_VALUE : String(value)

const getFormGroupOptions = async () => {
  try {
    const res = await post(GET_FORMGROUP_DROPDOWN_API, {})
    if (res?.code === 200) {
      formGroupOptions.value = [
        { formGroupId: ALL_OPTION_VALUE, formGroupName: t('formbusiness.pendingsubreview.all') },
        ...(res.data || [])
      ]
      if (!searchForm.formGroupId) searchForm.formGroupId = ALL_OPTION_VALUE
      return
    }
    showMessage(res?.message || t('formbusiness.pendingsubreview.getFormGroupFailed'))
  } catch {
    showMessage(t('formbusiness.pendingsubreview.getFormGroupFailed'))
  }
}

const getFormTypeOptions = async () => {
  formTypeOptions.value = []
  searchForm.formTypeId = ALL_OPTION_VALUE
  if (!searchForm.formGroupId) return
  try {
    const res = await post(GET_FORMTYPE_DROPDOWN_API, buildFormData({ formGroupId: String(searchForm.formGroupId) }), FORM_DATA_OPTIONS)
    if (res?.code === 200) {
      formTypeOptions.value = [
        { formTypeId: ALL_OPTION_VALUE, formTypeName: t('formbusiness.pendingsubreview.all') },
        ...(res.data || [])
      ]
      return
    }
    showMessage(res?.message || t('formbusiness.pendingsubreview.getFormTypeFailed'))
  } catch {
    showMessage(t('formbusiness.pendingsubreview.getFormTypeFailed'))
  }
}

const getFormStatusOptions = async () => {
  try {
    const res = await post(GET_FORMSTATUS_DROPDOWN_API, {})
    if (res?.code === 200) {
      formStatusOptions.value = res.data || []
      return
    }
    showMessage(res?.message || t('formbusiness.pendingsubreview.getFormStatusFailed'))
  } catch {
    showMessage(t('formbusiness.pendingsubreview.getFormStatusFailed'))
  }
}

const getPendingSubReviewList = async () => {
  loading.value = true
  try {
    const params = {
      formGroupId: normalizeFilterValue(searchForm.formGroupId),
      formTypeId:  normalizeFilterValue(searchForm.formTypeId),
      formStatus:  String(searchForm.formStatus || ''),
      formNo:      String(searchForm.formNo     || ''),
      pageIndex:   String(pagination.pageIndex),
      pageSize:    String(pagination.pageSize),
      totalCount:  String(pagination.totalCount || 0)
    }
    const res = await post(getCurrentListApi(), params)
    if (res?.code === 200) {
      pendingsubreviewList.value = res.data || []
      pagination.totalCount = Number(res.totalCount || 0)
      return
    }
    pendingsubreviewList.value = []
    showMessage(res?.message || t(getCurrentListErrorKey()))
  } catch {
    pendingsubreviewList.value = []
    showMessage(t(getCurrentListErrorKey()))
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

const handleListModeChange = () => {
  searchForm.formStatus = ''
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getPendingSubReviewList()
  })
}

const handleFormGroupChange = () => {
  if (!searchForm.formGroupId) searchForm.formGroupId = ALL_OPTION_VALUE
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getFormTypeOptions()
    await getPendingSubReviewList()
  })
}

const handleFilterChange = () => {
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getPendingSubReviewList()
  })
}

const handleFormTypeChange = () => {
  if (!searchForm.formTypeId) searchForm.formTypeId = ALL_OPTION_VALUE
  handleFilterChange()
}

const handleSearch = () => {
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getPendingSubReviewList()
  })
}

const handleReset = () => {
  searchForm.formStatus  = ''
  searchForm.formNo      = ''
  searchForm.formGroupId = ALL_OPTION_VALUE
  searchForm.formTypeId  = ALL_OPTION_VALUE
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getFormTypeOptions()
    await getPendingSubReviewList()
  })
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  getPendingSubReviewList()
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

// 新窗口铺满可用屏幕；部分浏览器策略下 resizeTo/moveTo 不可用，已用 features 尽量铺满
const openPopupWindow = (href, namePrefix = 'form_popup') => {
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

const openFormPage = (row, pathKey) => {
  if (!row?.[pathKey]) return
  const path = normalizePath(row[pathKey])
  if (!isPathSafe(path)) {
    showMessage(t('formbusiness.pendingsubreview.getFailed'))
    return
  }
  const resolved = router.resolve({
    path,
    query: { formTypeId: String(row.formTypeId || ''), formId: String(row.formId || '') }
  })
  if (!isRouteValid(resolved)) {
    showMessage(t('formbusiness.pendingsubreview.getFailed'))
    return
  }
  openPopupWindow(resolved.href, pathKey === 'approvalPath' ? 'pending_approval' : 'form_view')
}

const getFormStatusCode = (row) => {
  if (row?.formStatus) return String(row.formStatus)
  return formStatusOptions.value.find(i => i.formStatusName === row?.formStatusName)?.formStatusCode || ''
}

const getFormStatusTagType = (row) => {
  const code = getFormStatusCode(row)
  if (code === 'PendingSubmission') return 'warning'
  if (code === 'UnderReview')       return 'primary'
  if (code === 'Rejected')          return 'danger'
  if (code === 'Approved')          return 'success'
  if (code === 'Voided')            return 'info'
  return ''
}

const handleVoidForm = async (row) => {
  if (!row?.formId) return
  try {
    await ElMessageBox.confirm(
      t('formbusiness.pendingsubreview.voidConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  loading.value = true
  try {
    const res = await post(VOIDED_FORM_API, buildFormData({ formId: String(row.formId) }), FORM_DATA_OPTIONS)
    if (res?.code === 200) {
      showMessage(res.message || t('formbusiness.pendingsubreview.voidSuccess'), 'success')
      await getPendingSubReviewList()
    } else {
      showMessage(res?.message || t('formbusiness.pendingsubreview.voidFailed'))
    }
  } catch {
    showMessage(t('formbusiness.pendingsubreview.voidFailed'))
  } finally {
    loading.value = false
  }
}

const canShowInvalidate = (row) => {
  const value = row?.isDelete
  if (typeof value === 'boolean') return value
  if (typeof value === 'number')  return value === 1
  if (typeof value === 'string')  return ['1', 'true', 'yes', 'y'].includes(value.trim().toLowerCase())
  return false
}

onMounted(async () => {
  await Promise.all([getFormGroupOptions(), getFormStatusOptions()])
  await getFormTypeOptions()
  await getPendingSubReviewList()
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
