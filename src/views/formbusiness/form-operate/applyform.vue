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
          @clear="handleFormGroupClear"
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
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        />
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

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table 
          :data="formTypeList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading || debouncePending"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('formbusiness.applyform.index')" width="70" align="center" fixed />
          <el-table-column :label="$t('formbusiness.applyform.apply')" align="center" width="130">
            <template #default="scope">
              <el-link
                v-if="scope.row.approvalPath"
                type="primary"
                underline="never"
                @click="openApproval(scope.row)"
              >
                {{ $t('formbusiness.applyform.apply') }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="formTypeName" :label="$t('formbusiness.applyform.formName')" align="center" min-width="200" />
          <el-table-column prop="description" :label="$t('formbusiness.applyform.description')" align="left" width="900">
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
  GET_APPLYFORM_API,
  GET_FORMGROUP_DROPDOWN_API
} from '@/config/api/formbusiness/form-operate/applyform.js'
import { useI18n } from 'vue-i18n'

// 使用i18n
const { t } = useI18n()

// 响应式数据
const loading = ref(false)
const debouncePending = ref(false)
const formTypeList = ref([])
const formGroupOptions = ref([])
const router = useRouter()

// 搜索表单
const searchForm = reactive({
  formGroupId: '',
  formTypeName: ''
})

// 分页信息
const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
  totalCount: 0
})

// 表单验证规则
const rules = {
  formGroupId: [
    { required: true, message: () => t('formbusiness.applyform.pleaseSelectFormGroup'), trigger: 'change' }
  ],
  formTypeNameCn: [
    { required: true, message: () => t('formbusiness.applyform.pleaseInputFormTypeNameCn'), trigger: 'blur' }
  ],
  formTypeNameEn: [
    { required: true, message: () => t('formbusiness.applyform.pleaseInputFormTypeNameEn'), trigger: 'blur' }
  ],
  prefix: [
    { required: true, message: () => t('formbusiness.applyform.pleaseInputPrefix'), trigger: 'blur' }
  ],
  reviewPath: [
    { required: false, trigger: 'blur' }
  ],
  viewPath: [
    { required: false, trigger: 'blur' }
  ]
}

/**
 * 获取表单组别下拉选项
 */
const getFormGroupOptions = async () => {
  try {
    const response = await post(GET_FORMGROUP_DROPDOWN_API, {})
    if (response.code === 200) {
      formGroupOptions.value = response.data || []
      // 默认选中第一个选项
      if (formGroupOptions.value.length > 0 && !searchForm.formGroupId) {
        searchForm.formGroupId = formGroupOptions.value[0].formGroupId
      }
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    ElMessage({
      message: t('formbusiness.applyform.getFormGroupFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
  }
}

/**
 * 获取申请表单列表
 */
const getFormTypeList = async () => {
  loading.value = true
  try {
    const params = {
      formGroupId: searchForm.formGroupId,
      formTypeName: searchForm.formTypeName,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: pagination.totalCount
    }
    
    const response = await post(GET_APPLYFORM_API, params)
    if (response.code === 200) {
      formTypeList.value = response.data || []
      pagination.totalCount = response.totalCount || 0
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
      formTypeList.value = []
    }
  } catch (error) {
    ElMessage({
      message: t('formbusiness.applyform.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
    formTypeList.value = []
  } finally {
    loading.value = false
  }
}

// 防抖搜索优化
let searchTimer = null
let filterTimer = null
const FILTER_DEBOUNCE_MS = 300

const getDefaultFormGroupId = () => {
  return formGroupOptions.value.length > 0 ? formGroupOptions.value[0].formGroupId : ''
}

const scheduleFilterRequest = async () => {
  if (filterTimer) clearTimeout(filterTimer)
  loading.value = true
  debouncePending.value = true
  await nextTick()
  filterTimer = setTimeout(async () => {
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
    searchForm.formGroupId = getDefaultFormGroupId()
  }
  scheduleFilterRequest()
}

const handleFormGroupClear = () => {
  searchForm.formGroupId = getDefaultFormGroupId()
  handleFormGroupChange()
}

/**
 * 搜索
 */
const handleSearch = async () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  debouncePending.value = true
  await nextTick()
  searchTimer = setTimeout(async () => {
    try {
      pagination.pageIndex = 1
      await getFormTypeList()
    } finally {
      debouncePending.value = false
    }
  }, 300) // 300ms防抖
}

/**
 * 重置搜索
 * 清空文本框，下拉框恢复到默认第一个值，并重新获取数据
 */
const handleReset = async () => {
  searchForm.formTypeName = ''
  if (formGroupOptions.value.length > 0) {
    searchForm.formGroupId = formGroupOptions.value[0].formGroupId
  }
  if (searchTimer) clearTimeout(searchTimer)
  if (filterTimer) clearTimeout(filterTimer)
  loading.value = true
  debouncePending.value = true
  await nextTick()
  searchTimer = setTimeout(async () => {
    try {
      pagination.pageIndex = 1
      await getFormTypeList()
    } finally {
      debouncePending.value = false
    }
  }, FILTER_DEBOUNCE_MS)
}

/**
 * 分页大小改变
 */
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.pageIndex = 1
  getFormTypeList()
}

/**
 * 当前页改变
 */
const handleCurrentChange = (val) => {
  pagination.pageIndex = val
  getFormTypeList()
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

const FORM_POPUP_WIDTH = 1170
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

const openApproval = (row) => {
  if (!row || !row.approvalPath) return
  const path = normalizePath(row.approvalPath)
  if (!isPathSafe(path)) {
    ElMessage({ message: t('formbusiness.applyform.getFailed'), type: 'error', plain: true, showClose: true })
    return
  }
  const to = { path, query: { formTypeId: String(row.formTypeId || ''), formId: String(row.formId || '') } }
  const resolved = router.resolve(to)
  if (!isRouteValid(resolved)) {
    ElMessage({ message: t('formbusiness.applyform.getFailed'), type: 'error', plain: true, showClose: true })
    return
  }
  openPopupWindow(resolved.href, 'apply_form')
}

// 组件挂载时获取数据
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