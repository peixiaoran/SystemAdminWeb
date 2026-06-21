<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :model="searchForm" :inline="true" class="conventional-filter-form" role="search" aria-label="已作废表单筛选">
        <el-form-item :label="$t('formbusiness.invalidform.formGroupName')">
          <el-select
            v-model="searchForm.formGroupId"
            :placeholder="$t('formbusiness.invalidform.pleaseSelectFormGroup')"
            filterable
            class="invalidform-filter-select"
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

        <el-form-item :label="$t('formbusiness.invalidform.formTypeName')">
          <el-select
            v-model="searchForm.formTypeId"
            :placeholder="$t('formbusiness.invalidform.pleaseSelectFormType')"
            filterable
            class="invalidform-filter-select"
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

        <el-form-item :label="$t('formbusiness.invalidform.formStatus')">
          <el-select
            v-model="searchForm.formStatus"
            :placeholder="$t('formbusiness.invalidform.pleaseSelectFormStatus')"
            filterable
            class="invalidform-filter-select"
            @change="handleFilterChange"
          >
            <el-option
              v-for="item in formStatusOptions"
              :key="item.formStatus"
              :label="item.formStatusName"
              :value="item.formStatus"
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
          :data="formInvalidList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading || filterPending"
          class="conventional-table"
          :empty-text="$t('common.noData')"
        >
          <el-table-column type="index" :label="$t('formbusiness.invalidform.index')" width="70" align="center" fixed />
          <el-table-column prop="formTypeName" :label="$t('formbusiness.invalidform.formTypeName')" align="center" min-width="180" show-overflow-tooltip />
          <el-table-column :label="$t('formbusiness.invalidform.formNo')" align="center" min-width="160">
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
          <el-table-column :label="$t('formbusiness.invalidform.formStatus')" align="center" min-width="160">
            <template #default="{ row }">
              <el-tag type="info" round>
                {{ row.formStatusName || '-' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('formbusiness.invalidform.applicantDate')" align="center" min-width="170">
            <template #default="{ row }">
              {{ formatApplicantDate(resolveApplicantDate(row)) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('formbusiness.invalidform.voidedDate')" align="center" min-width="170">
            <template #default="{ row }">
              {{ formatVoidedDate(row.voidedDate) }}
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
          @current-change="getFormInvalidList"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { post } from '@/utils/request'
import { useI18n } from 'vue-i18n'
import { formatApplicantDate, resolveApplicantDate } from '@/utils/formApplicantDate'
import {
  GET_FORMGROUP_DROPDOWN_API,
  GET_FORMTYPE_DROPDOWN_API,
  GET_FORMSTATUS_DROPDOWN_API,
  GET_FORM_INVALID_PAGE_API
} from '@/config/api/formbusiness/form-operate/invalidform.js'

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
const formInvalidList = ref([])

const formGroupPlaceholder = () => ({
  formGroupId: ALL_OPTION_VALUE,
  formGroupName: t('formbusiness.invalidform.pleaseSelect')
})

const formTypePlaceholder = () => ({
  formTypeId: ALL_OPTION_VALUE,
  formTypeName: t('formbusiness.invalidform.pleaseSelect')
})

const formStatusPlaceholder = () => ({
  formStatus: '',
  formStatusName: t('formbusiness.invalidform.pleaseSelect')
})

const formGroupOptions = ref([formGroupPlaceholder()])
const formTypeOptions = ref([formTypePlaceholder()])
const formStatusOptions = ref([formStatusPlaceholder()])

const searchForm = reactive({
  formGroupId: ALL_OPTION_VALUE,
  formTypeId: ALL_OPTION_VALUE,
  formStatus: ''
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
        { formGroupId: ALL_OPTION_VALUE, formGroupName: t('formbusiness.invalidform.pleaseSelect') },
        ...(res.data || [])
      ]
      if (isUnsetFilter(searchForm.formGroupId)) searchForm.formGroupId = ALL_OPTION_VALUE
      return
    }
    showMessage(res?.message || t('formbusiness.invalidform.getFormGroupFailed'))
  } catch {
    showMessage(t('formbusiness.invalidform.getFormGroupFailed'))
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
        { formTypeId: ALL_OPTION_VALUE, formTypeName: t('formbusiness.invalidform.pleaseSelect') },
        ...(res.data || [])
      ]
      return
    }
    showMessage(res?.message || t('formbusiness.invalidform.getFormTypeFailed'))
  } catch {
    showMessage(t('formbusiness.invalidform.getFormTypeFailed'))
  }
}

const getFormStatusOptions = async () => {
  try {
    const res = await post(GET_FORMSTATUS_DROPDOWN_API, {})
    if (res?.code === 200) {
      formStatusOptions.value = [
        { formStatus: '', formStatusName: t('formbusiness.invalidform.pleaseSelect') },
        // 过滤掉 formStatus 为 null/undefined 的脏数据，避免 el-option value 触发类型校验告警
        ...(res.data || []).filter((item) => !isUnsetFilter(item?.formStatus))
      ]
      return
    }
    showMessage(res?.message || t('formbusiness.invalidform.getFormStatusFailed'))
  } catch {
    showMessage(t('formbusiness.invalidform.getFormStatusFailed'))
  }
}

const getFormInvalidList = async () => {
  loading.value = true
  try {
    const params = {
      formGroupId: normalizeFilterValue(searchForm.formGroupId),
      formTypeId: normalizeFilterValue(searchForm.formTypeId),
      formStatus: String(searchForm.formStatus || ''),
      pageIndex: String(pagination.pageIndex),
      pageSize: String(pagination.pageSize),
      totalCount: String(pagination.totalCount || 0)
    }
    const res = await post(GET_FORM_INVALID_PAGE_API, params)
    if (res?.code === 200) {
      formInvalidList.value = res.data || []
      pagination.totalCount = Number(res.totalCount || 0)
      return
    }
    formInvalidList.value = []
    showMessage(res?.message || t('formbusiness.invalidform.getInvalidFormsFailed'))
  } catch {
    formInvalidList.value = []
    showMessage(t('formbusiness.invalidform.getInvalidFormsFailed'))
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
    await getFormInvalidList()
  })
}

const handleFilterChange = () => {
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getFormInvalidList()
  })
}

const handleFormTypeChange = () => {
  if (isUnsetFilter(searchForm.formTypeId)) searchForm.formTypeId = ALL_OPTION_VALUE
  handleFilterChange()
}

const handleSearch = () => {
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getFormInvalidList()
  })
}

const handleReset = () => {
  searchForm.formGroupId = ALL_OPTION_VALUE
  searchForm.formTypeId = ALL_OPTION_VALUE
  searchForm.formStatus = ''
  scheduleFilterRequest(async () => {
    pagination.pageIndex = 1
    await getFormTypeOptions()
    await getFormInvalidList()
  })
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  getFormInvalidList()
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
    showMessage(t('formbusiness.invalidform.getFailed'))
    return
  }
  const resolved = router.resolve({
    path,
    query: { formTypeId: String(row.formTypeId || ''), formId: String(row.formId || '') }
  })
  if (!isRouteValid(resolved)) {
    showMessage(t('formbusiness.invalidform.getFailed'))
    return
  }
  openPopupWindow(resolved.href, 'form_view')
}

onMounted(async () => {
  await getFormGroupOptions()
  await getFormStatusOptions()
  await getFormTypeOptions()
  await getFormInvalidList()
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

.invalidform-filter-select {
  width: 220px;
  min-width: 200px;
}

</style>
