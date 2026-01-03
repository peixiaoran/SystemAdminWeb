<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <!-- 搜索 -->
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="搜索">
        <el-form-item :label="$t('systembasicmgmt.currencyInfo.filter.currencyCode')">
          <el-input v-model="filters.currencyCode" :placeholder="$t('systembasicmgmt.currencyInfo.pleaseInputCurrencyCode')" style="width:170px" />
        </el-form-item>
        <el-form-item style="visibility: hidden; width: 0; margin: 0; padding: 0;">
          <el-input style="width: 0; height: 0; border: none; padding: 0; margin: 0;" />
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
          <el-button type="primary" @click="handleAdd">
            {{ $t('systembasicmgmt.currencyInfo.addCurrency') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <div class="table-container">
        <el-table :data="currencyList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table">
          <el-table-column type="index" :label="$t('systembasicmgmt.currencyInfo.index')" width="70" align="center" fixed />
          <el-table-column prop="currencyCode" :label="$t('systembasicmgmt.currencyInfo.currencyCode')" align="center" min-width="120"/>
          <el-table-column prop="currencyNameCn" :label="$t('systembasicmgmt.currencyInfo.currencyNameCn')" align="left" min-width="150" />
          <el-table-column prop="currencyNameEn" :label="$t('systembasicmgmt.currencyInfo.currencyNameEn')" align="left" min-width="150" />
          <el-table-column prop="isEnabled" :label="$t('systembasicmgmt.currencyInfo.isEnabled')" align="center" min-width="70">
            <template #default="scope">
              <el-tag :type="scope.row.isEnabled === 1 ? 'success' : 'danger'">
                {{ scope.row.isEnabled === 1 ? $t('systembasicmgmt.enabled') : $t('systembasicmgmt.disabled') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remark" :label="$t('systembasicmgmt.currencyInfo.remark')" align="left" min-width="200" />
          <el-table-column :label="$t('systembasicmgmt.currencyInfo.operation')" min-width="130" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">{{ $t('common.edit') }}</el-button>
              <el-button size="small"
                         type="danger"
                         @click="handleDelete(scope.$index, scope.row)">{{ $t('common.delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination v-model:current-page="pagination.pageIndex"
                       v-model:page-size="pagination.pageSize"
                       :page-sizes="[10, 20, 50, 100]"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="pagination.totalCount"
                       @size-change="handleSizeChange"
                       @current-change="handlePageChange"/>
      </div>
    </el-card>

    <!-- 编辑状态弹窗 -->
    <el-dialog v-model="dialogVisible"
               :title="dialogTitle"
               width="50%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :modal-append-to-body="true"
               :lock-scroll="true"
               @close="handleDialogClose">
      <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px" class="dialog-form" role="form" aria-label="编辑表单">
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.currencyInfo.currencyCode')" prop="currencyCode">
            <el-input v-model="editForm.currencyCode" 
                     style="width:100%" 
                     :placeholder="$t('systembasicmgmt.currencyInfo.pleaseInputCurrencyCode')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.currencyInfo.isEnabled')" prop="isEnabled">
            <el-switch v-model="editForm.isEnabled" 
                      :active-value="1"
                      :inactive-value="0"
                      :active-text="$t('common.yes')"
                      :inactive-text="$t('common.no')"
                      inline-prompt
                      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399"/>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.currencyInfo.currencyNameCn')" prop="currencyNameCn">
            <el-input v-model="editForm.currencyNameCn" style="width:100%" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.currencyInfo.currencyNameEn')" prop="currencyNameEn">
            <el-input v-model="editForm.currencyNameEn" style="width:100%" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.currencyInfo.remark')" prop="remark">
            <el-input v-model="editForm.remark" style="width:100%" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogClose">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleSave" :loading="submitLoading">{{ $t('common.save') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { post } from '@/utils/request'
import { 
  GET_CURRENCY_PAGES_API, 
  INSERT_CURRENCY_API, 
  DELETE_CURRENCY_API, 
  GET_CURRENCY_ENTITY_API, 
  UPDATE_CURRENCY_API 
} from '@/config/api/systembasicmgmt/system-config/currency'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { debounce, PERFORMANCE_CONFIG } from '@/utils/performance'

// 初始化i18n
const { t } = useI18n()

// 币别数据
const currencyList = ref([])
const loading = ref(false)
// 提交加载状态
const submitLoading = ref(false)

// 表单引用
const editFormRef = ref(null)

// 分页信息
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0
})

// 过滤条件
const filters = reactive({
  currencyCode: ''
})

// 对话框显示状态
const dialogVisible = ref(false)

// 编辑表单
const editForm = reactive({
  currencyId: '',
  currencyCode: '',
  currencyNameCn: '',
  currencyNameEn: '',
  isEnabled: 1,
  remark: ''
})

// 对话框标题
const dialogTitle = ref(t('systembasicmgmt.currencyInfo.editCurrency'))

// 表单验证规则
const formRules = reactive({
  currencyCode: [
    { required: true, message: t('systembasicmgmt.currencyInfo.pleaseInputCurrencyCode'), trigger: 'blur' }
  ],
  currencyNameCn: [
    { required: true, message: t('systembasicmgmt.currencyInfo.pleaseInputCurrencyNameCn'), trigger: 'blur' }
  ]
})

// 在组件挂载后获取币别数据
onMounted(() => {
  fetchCurrencyPages()
})

// 获取币别实体数据
const fetchCurrencyEntity = async (currencyId) => {
  try {
    const res = await post(GET_CURRENCY_ENTITY_API.GET_CURRENCY_ENTITY, { currencyId })
    if (res && res.code === 200) {
      return res.data
    } else {
      ElMessage({ 
        message: res?.message || t('systembasicmgmt.currencyInfo.getCurrencyEntityFailed'), 
        type: 'error', 
        plain: true, 
        showClose: true 
      })
    }
  } catch (error) {
    ElMessage({ 
      message: t('systembasicmgmt.currencyInfo.getCurrencyEntityFailed'), 
      type: 'error', 
      plain: true, 
      showClose: true 
    })
    return null
  }
}

// 获取币别列表数据
const fetchCurrencyPages = async () => {
  try {
    loading.value = true
    const params = {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      currencyCode: filters.currencyCode || ''
    }
    
    const res = await post(GET_CURRENCY_PAGES_API.GET_CURRENCY_PAGES, params)
    if (res && res.code === 200) {
      currencyList.value = res.data || []
      pagination.totalCount = res.data?.totalCount || 0
    } else {
    ElMessage({ 
      message: res.message, 
      type: 'error', 
      plain: true, 
      showClose: true 
    })
  }
} catch (error) {
  ElMessage({ 
    message: t('systembasicmgmt.currencyInfo.getCurrencyPagesFailed'), 
    type: 'error', 
    plain: true, 
    showClose: true 
  })
} finally {
    loading.value = false
  }
}

// 使用通用防抖工具
const debouncedFetchCurrencyPages = debounce(() => {
  fetchCurrencyPages()
}, PERFORMANCE_CONFIG.DEBOUNCE_DELAY)

// 处理搜索操作（带防抖）
const handleSearch = () => {
  pagination.pageIndex = 1
  loading.value = true
  debouncedFetchCurrencyPages()
}

// 立即查询数据（不使用防抖，用于保存后刷新）
const fetchCurrencyPagesImmediate = () => {
  fetchCurrencyPages()
}

// 重置搜索条件
const handleReset = () => {
  filters.currencyCode = ''
  // 重置后自动触发查询（使用防抖）
  pagination.pageIndex = 1
  loading.value = true
  debouncedFetchCurrencyPages()
}

// 处理页码变化
const handlePageChange = (page) => {
  pagination.pageIndex = page
  fetchCurrencyPages()
}

// 处理每页记录数变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.pageIndex = 1
  fetchCurrencyPages()
}

const resetForm = (clearValidation = true) => {
  editForm.currencyId = ''
  editForm.currencyCode = ''
  editForm.currencyNameCn = ''
  editForm.currencyNameEn = ''
  editForm.isEnabled = 1
  editForm.remark = ''
  
  if (clearValidation && editFormRef.value) {
    nextTick(() => {
      editFormRef.value.clearValidate()
    })
  }
}

 // 新增币别数据
 const insertCurrency = async () => {
   submitLoading.value = true
   const params = {
     currencyCode: editForm.currencyCode,
     currencyNameCn: editForm.currencyNameCn,
     currencyNameEn: editForm.currencyNameEn || '',
     remark: editForm.remark || ''
   }
   
   const res = await post(INSERT_CURRENCY_API.INSERT_CURRENCY, params)
   if (res && res.code === 200) {
     ElMessage({ 
       message: t('systembasicmgmt.currencyInfo.insertCurrencySuccess'), 
       type: 'success', 
       plain: true, 
       showClose: true 
     })
     dialogVisible.value = false
     fetchCurrencyPagesImmediate()
   } else {
      ElMessage({ 
        message: res.message, 
        type: 'error', 
        plain: true, 
        showClose: true 
      })
    }
   submitLoading.value = false
 }

 // 更新币别数据
 const updateCurrency = async () => {
   submitLoading.value = true
   const params = {
     currencyId: editForm.currencyId,
     currencyCode: editForm.currencyCode,
     currencyNameCn: editForm.currencyNameCn,
     currencyNameEn: editForm.currencyNameEn || '',
     isEnabled: editForm.isEnabled,
     remark: editForm.remark || ''
   }
   
   const res = await post(UPDATE_CURRENCY_API.UPDATE_CURRENCY, params)
   if (res && res.code === 200) {
     ElMessage({ 
       message: res.message, 
       type: 'success', 
       plain: true, 
       showClose: true 
     })
     dialogVisible.value = false
     fetchCurrencyPagesImmediate()
   } else {
     ElMessage({ 
       message: res.message, 
       type: 'error', 
       plain: true, 
       showClose: true 
     })
   }
   submitLoading.value = false
 }

// 删除币别数据
const deleteCurrency = async (currencyId) => {
  const res = await post(DELETE_CURRENCY_API.DELETE_CURRENCY, { currencyId })
  if (res && res.code === 200) {
    ElMessage({ 
      message: res.message, 
      type: 'success', 
      plain: true, 
      showClose: true 
    })
    // 如果当前页没有数据了，回到上一页
    if (currencyList.value.length === 1 && pagination.pageIndex > 1) {
      pagination.pageIndex--
    }
    fetchCurrencyPagesImmediate()
  } else {
    ElMessage({ 
      message: res.message, 
      type: 'error', 
      plain: true, 
      showClose: true 
    })
  }
}

// 处理新增操作
const handleAdd = () => {
  resetForm()
  dialogTitle.value = t('systembasicmgmt.currencyInfo.addCurrency')
  dialogVisible.value = true
  
  nextTick(() => {
    editFormRef.value?.focus()
  })
}

// 处理编辑操作
const handleEdit = async (index, row) => {
  const entity = await fetchCurrencyEntity(row.currencyId)
  if (entity) {
    Object.assign(editForm, entity)
    dialogTitle.value = t('systembasicmgmt.currencyInfo.editCurrency')
    dialogVisible.value = true
  }
}

// 处理删除操作
const handleDelete = (index, row) => {
  ElMessageBox.confirm(
    t('systembasicmgmt.currencyInfo.confirmDeleteCurrency'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(() => {
    deleteCurrency(row.currencyId)
  }).catch(() => {
    // 用户取消删除
  })
}

// 保存编辑结果
const handleSave = () => {
  editFormRef.value.validate((valid) => {
    if (valid) {
      if (editForm.currencyId) {
        updateCurrency()
      } else {
        insertCurrency()
      }
    }
  })
}

// 处理对话框关闭
const handleDialogClose = () => {
  resetForm()
  dialogVisible.value = false
}
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
  
