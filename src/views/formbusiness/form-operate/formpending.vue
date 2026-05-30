<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :model="searchForm" :inline="true" class="conventional-filter-form" role="search" aria-label="待审批筛选">
        <el-form-item>
          <el-radio-group v-model="listMode" @change="handleListModeChange">
            <el-radio-button value="pendingSubmit">
              {{ $t('formbusiness.formpending.pendingSubmit') }}
            </el-radio-button>
            <el-radio-button value="formPending">
              {{ $t('formbusiness.formpending.formPending') }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('formbusiness.formpending.formGroupName')">
          <el-select
            v-model="searchForm.formGroupId"
            :placeholder="$t('formbusiness.formpending.pleaseSelectFormGroup')"
            filterable
            clearables
            class="pending-filter-select"
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

        <el-form-item :label="$t('formbusiness.formpending.formTypeName')">
          <el-select
            v-model="searchForm.formTypeId"
            :placeholder="$t('formbusiness.formpending.pleaseSelectFormType')"
            filterable
            clearable
            class="pending-filter-select"
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
          :data="formPendingList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading || filterPending"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('formbusiness.formpending.index')" width="70" align="center" fixed />
          <el-table-column :label="$t('formbusiness.formpending.formNo')" align="center" min-width="160">
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
          <el-table-column prop="formTypeName" :label="$t('formbusiness.formpending.formTypeName')" align="center" min-width="180" show-overflow-tooltip />
          <el-table-column :label="$t('formbusiness.formpending.formStatus')" align="center" min-width="160">
            <template #default="{ row }">
              <el-tag type="primary" effect="dark" round>
                {{ row.formStatusName || '-' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('formbusiness.formpending.viewFormPendingReviewers')"
            align="center"
            min-width="200"
          >
            <template #default="{ row }">
              <el-link
                v-if="row.formId"
                type="primary"
                underline="never"
                class="form-pending-reviewers-link"
                @click="openFormPendingReviewers(row)"
              >
                {{ $t('formbusiness.formpending.viewFormPendingReviewers') }}
              </el-link>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="applyUserName" :label="$t('formbusiness.formpending.applyUserName')" align="center" min-width="140" show-overflow-tooltip />
          <el-table-column prop="applyUserDeptName" :label="$t('formbusiness.formpending.applyUserDeptName')" align="center" min-width="220" show-overflow-tooltip />
          <el-table-column
            :label="$t('common.operation')"
            align="center"
            min-width="180"
            fixed="right"
          >
            <template #default="{ row }">
              <el-link
                v-if="row.reviewPath"
                type="primary"
                underline="never"
                @click="openFormPage(row, 'reviewPath')"
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
                {{ $t('formbusiness.formpending.invalidate') }}
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
          @current-change="getFormPendingList"
        />
      </div>
    </el-card>

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
          prop="appointmentType"
          :label="$t('formbusiness.formpending.appointmentType')"
          min-width="120"
          align="center"
          header-align="center"
          show-overflow-tooltip
        >
          <template #default="{ row: r }">{{ r.appointmentType || '-' }}</template>
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
          <template #default="{ row: r }">{{ r.agentUserName || '-' }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { post } from '@/utils/request'
import {
  GET_FORMGROUP_DROPDOWN_API,
  GET_FORMTYPE_DROPDOWN_API,
  GET_FORM_PENDING_SUBMIT_PAGE_API,
  GET_FORM_PENDING_REVIEW_PAGE_API,
  GET_FORM_PENDING_USERS_API,
  VOIDED_FORM_API
} from '@/config/api/formbusiness/form-operate/formpending.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const FORM_DATA_OPTIONS = { headers: { 'Content-Type': 'multipart/form-data' }, skipDedupe: true }
const FILTER_DEBOUNCE_MS = 300
const ALL_OPTION_VALUE = 0
/** 与请假单等弹窗页约定：关闭前 postMessage 触发本页刷新 */
const FORM_PENDING_REFRESH_MSG = 'FORM_PENDING_REFRESH'

const isUnsetFilter = (v) => v === '' || v === undefined || v === null

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
const formPendingList = ref([])
const formPendingReviewersDialogVisible = ref(false)
const formPendingReviewersLoading = ref(false)
const formPendingReviewersList = ref([])
/** 与 v-model 默认 0 同步，避免选项未加载时 el-select 短暂显示数字 0 */
const formGroupPlaceholder = () => ({
  formGroupId: ALL_OPTION_VALUE,
  formGroupName: t('formbusiness.formpending.pleaseSelect')
})
const formTypePlaceholder = () => ({
  formTypeId: ALL_OPTION_VALUE,
  formTypeName: t('formbusiness.formpending.pleaseSelect')
})
const formGroupOptions = ref([formGroupPlaceholder()])
const formTypeOptions = ref([formTypePlaceholder()])
const listMode = ref('formPending')

const searchForm = reactive({
  formGroupId: ALL_OPTION_VALUE,
  formTypeId:  ALL_OPTION_VALUE,
  formNo:      ''
})

const pagination = reactive({
  pageIndex: 1,
  pageSize:  10,
  totalCount: 0
})

const actionText = computed(() =>
  listMode.value === 'pendingSubmit'
    ? t('formbusiness.formpending.submit')
    : t('formbusiness.formpending.approval')
)

const getCurrentListApi = () =>
  listMode.value === 'pendingSubmit' ? GET_FORM_PENDING_SUBMIT_PAGE_API : GET_FORM_PENDING_REVIEW_PAGE_API

const getCurrentListErrorKey = () =>
  listMode.value === 'pendingSubmit'
    ? 'formbusiness.formpending.getPendingSubmitFailed'
    : 'formbusiness.formpending.getPendingReviewFailed'

const normalizeFilterValue = (value) =>
  isUnsetFilter(value) ? String(ALL_OPTION_VALUE) : String(value)

const getFormGroupOptions = async () => {
  try {
    const res = await post(GET_FORMGROUP_DROPDOWN_API, {})
    if (res?.code === 200) {
      formGroupOptions.value = [
        { formGroupId: ALL_OPTION_VALUE, formGroupName: t('formbusiness.formpending.pleaseSelect') },
        ...(res.data || [])
      ]
      if (isUnsetFilter(searchForm.formGroupId)) searchForm.formGroupId = ALL_OPTION_VALUE
      return
    }
    showMessage(res?.message || t('formbusiness.formpending.getFormGroupFailed'))
  } catch {
    showMessage(t('formbusiness.formpending.getFormGroupFailed'))
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
        { formTypeId: ALL_OPTION_VALUE, formTypeName: t('formbusiness.formpending.pleaseSelect') },
        ...(res.data || [])
      ]
      return
    }
    showMessage(res?.message || t('formbusiness.formpending.getFormTypeFailed'))
  } catch {
    showMessage(t('formbusiness.formpending.getFormTypeFailed'))
  }
}

const getFormPendingList = async () => {
  loading.value = true
  try {
    const params = {
      formGroupId: normalizeFilterValue(searchForm.formGroupId),
      formTypeId:  normalizeFilterValue(searchForm.formTypeId),
      formNo:      String(searchForm.formNo || ''),
      pageIndex:   String(pagination.pageIndex),
      pageSize:    String(pagination.pageSize),
      totalCount:  String(pagination.totalCount || 0)
    }
    const res = await post(getCurrentListApi(), params)
    if (res?.code === 200) {
      formPendingList.value = res.data || []
      pagination.totalCount = Number(res.totalCount || 0)
      return
    }
    formPendingList.value = []
    showMessage(res?.message || t(getCurrentListErrorKey()))
  } catch {
    formPendingList.value = []
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
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getFormPendingList()
  })
}

const handleFormGroupChange = () => {
  if (isUnsetFilter(searchForm.formGroupId)) searchForm.formGroupId = ALL_OPTION_VALUE
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getFormTypeOptions()
    await getFormPendingList()
  })
}

const handleFilterChange = () => {
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getFormPendingList()
  })
}

const handleFormTypeChange = () => {
  if (isUnsetFilter(searchForm.formTypeId)) searchForm.formTypeId = ALL_OPTION_VALUE
  handleFilterChange()
}

const handleSearch = () => {
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getFormPendingList()
  })
}

const handleReset = () => {
  searchForm.formNo      = ''
  searchForm.formGroupId = ALL_OPTION_VALUE
  searchForm.formTypeId  = ALL_OPTION_VALUE
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getFormTypeOptions()
    await getFormPendingList()
  })
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  getFormPendingList()
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

const openFormPage = (row, pathKey) => {
  if (!row?.[pathKey]) return
  const path = normalizePath(row[pathKey])
  if (!isPathSafe(path)) {
    showMessage(t('formbusiness.formpending.getFailed'))
    return
  }
  const resolved = router.resolve({
    path,
    query: { formTypeId: String(row.formTypeId || ''), formId: String(row.formId || '') }
  })
  if (!isRouteValid(resolved)) {
    showMessage(t('formbusiness.formpending.getFailed'))
    return
  }
  openPopupWindow(resolved.href, pathKey === 'reviewPath' ? 'pending_approval' : 'form_view')
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
    const res = await post(VOIDED_FORM_API, buildFormData({ formId: String(row.formId) }), FORM_DATA_OPTIONS)
    if (res?.code === 200) {
      showMessage(res.message || t('formbusiness.formpending.voidSuccess'), 'success')
      await getFormPendingList()
    } else {
      showMessage(res?.message || t('formbusiness.formpending.voidFailed'))
    }
  } catch {
    showMessage(t('formbusiness.formpending.voidFailed'))
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

const onFormPendingRefreshMessage = (event) => {
  if (event.origin !== window.location.origin) return
  if (event.data?.type !== FORM_PENDING_REFRESH_MSG) return
  getFormPendingList()
}

onMounted(async () => {
  window.addEventListener('message', onFormPendingRefreshMessage)
  await getFormGroupOptions()
  await getFormTypeOptions()
  await getFormPendingList()
})

onUnmounted(() => {
  window.removeEventListener('message', onFormPendingRefreshMessage)
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.table-container {
  /* flex 子项允许收缩，否则宽表无法在卡片内正确出现内部横向滚动条 */
  min-width: 0;
}

.conventional-table :deep(.el-table) {
  min-width: 1280px;
}

.pending-filter-select {
  width: 220px;
  min-width: 200px;
}

.form-pending-reviewers-link {
  font-size: 12px;
  line-height: 1.2;
}
</style>
