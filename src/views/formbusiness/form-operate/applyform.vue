<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :model="searchForm" :inline="true" class="conventional-filter-form" role="search" aria-label="表单类型筛选">
        <el-form-item :label="$t('formbusiness.applyform.formGroupName')">
          <el-select
            v-model="searchForm.formGroupId"
            :placeholder="$t('formbusiness.applyform.pleaseSelectFormGroup')"
            filterable
            style="width: 180px"
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
        <el-form-item :label="$t('formbusiness.applyform.formTypeName')">
          <el-input
            v-model="searchForm.formTypeName"
            :placeholder="$t('formbusiness.applyform.pleaseInputFormTypeName')"
            clearable
            @clear="scheduleSearch"
            @keyup.enter="scheduleSearch"
          />
        </el-form-item>
        <el-form-item class="form-button-group">
          <el-button type="primary" @click="scheduleSearch" plain>
            {{ $t('common.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table
          :data="formTypeList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading || debouncePending"
          class="conventional-table"
        :empty-text="$t('common.noData')"
        >
          <el-table-column type="index" :label="$t('formbusiness.applyform.index')" width="70" align="center" fixed />
          <el-table-column :label="$t('formbusiness.applyform.apply')" align="center" width="150">
            <template #default="scope">
              <el-link
                v-if="scope.row.reviewPath"
                type="primary"
                underline="never"
                @click="openApproval(scope.row)"
              >
                {{ $t('formbusiness.applyform.apply') }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="formTypeName" :label="$t('formbusiness.applyform.formName')" align="center" width="240" />
          <el-table-column prop="description" :label="$t('formbusiness.applyform.description')" align="left" min-width="900">
            <template #default="scope">
              <el-tooltip
                v-if="scope.row.description"
                :content="scope.row.description"
                placement="top"
                effect="dark"
                popper-class="fixed-width-tooltip"
              >
                <span class="ellipsis-cell">{{ scope.row.description }}</span>
              </el-tooltip>
              <span v-else class="ellipsis-cell">-</span>
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
          @current-change="getFormTypeList"
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
import {
  GET_APPLYFORM_API,
  GET_FORMGROUP_DROPDOWN_API
} from '@/config/api/formbusiness/form-operate/applyform.js'

const { t } = useI18n()
const router = useRouter()

const FILTER_DEBOUNCE_MS = 300
const ALLOWED_PATH_PREFIXES = ['/formbusiness/']

const loading = ref(false)
const debouncePending = ref(false)
const formTypeList = ref([])
const formGroupOptions = ref([])

const searchForm = reactive({
  formGroupId: '',
  formTypeName: ''
})

const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
  totalCount: 0
})

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const getFormGroupOptions = async () => {
  try {
    const res = await post(GET_FORMGROUP_DROPDOWN_API, {})
    if (res.code === 200) {
      formGroupOptions.value = res.data || []
      if (formGroupOptions.value.length > 0 && !searchForm.formGroupId) {
        searchForm.formGroupId = formGroupOptions.value[0].formGroupId
      }
    } else {
      showMessage(res.message)
    }
  } catch {
    showMessage(t('formbusiness.applyform.getFormGroupFailed'))
  }
}

const getFormTypeList = async () => {
  loading.value = true
  try {
    const res = await post(GET_APPLYFORM_API, {
      formGroupId: searchForm.formGroupId,
      formTypeName: searchForm.formTypeName,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: pagination.totalCount
    })
    if (res.code === 200) {
      formTypeList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      showMessage(res.message)
      formTypeList.value = []
    }
  } catch {
    showMessage(t('formbusiness.applyform.getFailed'))
    formTypeList.value = []
  } finally {
    loading.value = false
  }
}

let debounceTimer = null

const scheduleSearch = async () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  loading.value = true
  debouncePending.value = true
  await nextTick()
  debounceTimer = setTimeout(async () => {
    try {
      pagination.pageIndex = 1
      await getFormTypeList()
    } finally {
      debouncePending.value = false
    }
  }, FILTER_DEBOUNCE_MS)
}

const handleFormGroupChange = () => {
  if (!searchForm.formGroupId) {
    searchForm.formGroupId = formGroupOptions.value[0]?.formGroupId ?? ''
  }
  scheduleSearch()
}

const handleReset = () => {
  searchForm.formTypeName = ''
  searchForm.formGroupId = formGroupOptions.value[0]?.formGroupId ?? ''
  scheduleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  getFormTypeList()
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

const openApproval = (row) => {
  if (!row?.reviewPath) return
  const path = normalizePath(row.reviewPath)
  if (!isPathSafe(path)) {
    showMessage(t('formbusiness.applyform.getFailed'))
    return
  }
  const to = { path, query: { formTypeId: String(row.formTypeId || ''), formId: String(row.formId || '') } }
  const resolved = router.resolve(to)
  if (!isRouteValid(resolved)) {
    showMessage(t('formbusiness.applyform.getFailed'))
    return
  }
  openPopupWindow(resolved.href, 'apply_form')
}

onMounted(async () => {
  await getFormGroupOptions()
  getFormTypeList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

:global(.fixed-width-tooltip) {
  width: 800px;
  max-width: 800px;
  white-space: normal;
  word-break: break-word;
}

.ellipsis-cell {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
