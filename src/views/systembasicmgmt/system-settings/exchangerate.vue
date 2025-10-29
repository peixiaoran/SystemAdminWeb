<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">

      <!-- 过滤条件 -->
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="汇率搜索表单">
        <el-form-item :label="$t('systembasicmgmt.exchangeRate.filter.currencyCode')">
          <el-select v-model="filters.currencyCode"
                    style="width: 180px;"
                    :placeholder="$t('systembasicmgmt.exchangeRate.pleaseSelectCurrencyCode')"
                    :clearable="false">
            <el-option v-for="item in currencyOptions"
                      :key="item.currencyCode"
                      :label="item.currencyName"
                      :value="item.currencyCode"
                      :disabled="item.disabled" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.exchangeRate.filter.yearMonth')">
          <el-date-picker v-model="filters.yearMonth"
                         type="month"
                         style="width: 180px;"
                         :placeholder="$t('systembasicmgmt.exchangeRate.pleaseSelectYearMonth')"
                         format="YYYY-MM"
                         value-format="YYYY-MM" />
        </el-form-item>
        <el-form-item class="form-button-group">
          <el-button type="primary" @click="handleSearch" plain>
            {{ $t('common.search') }}
          </el-button>
          <el-button @click="handleReset" plain>
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
        <el-form-item class="form-right-button">
          <el-button type="primary" @click="handleAdd">
            {{ $t('systembasicmgmt.exchangeRate.addExchangeRate') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table :data="exchangeRateList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table">
          <el-table-column type="index" :label="$t('systembasicmgmt.exchangeRate.index')" width="70" align="center" fixed />
          <el-table-column prop="currencyCode" :label="$t('systembasicmgmt.exchangeRate.currencyCode')" align="center" min-width="120" />
          <el-table-column prop="exchangeCurrencyCode" :label="$t('systembasicmgmt.exchangeRate.exchangeCurrencyCode')" align="center" min-width="150" />
          <el-table-column prop="exchangeRate" :label="$t('systembasicmgmt.exchangeRate.exchangeRate')" align="center" min-width="120">
            <template #default="scope">
              {{ scope.row.exchangeRate?.toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column prop="yearMonth" :label="$t('systembasicmgmt.exchangeRate.yearMonth')" align="center" min-width="120" />
          <el-table-column prop="remark" :label="$t('systembasicmgmt.exchangeRate.remark')" align="left" min-width="200" />
          <el-table-column :label="$t('systembasicmgmt.exchangeRate.operation')" min-width="130" fixed="right" align="center">
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
                       @current-change="handlePageChange" />
      </div>
    </el-card>

    <!-- 汇率编辑对话框 -->
    <el-dialog v-model="dialogVisible"
               :title="dialogTitle"
               width="50%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :modal-append-to-body="true"
               :lock-scroll="true"
               @close="handleDialogClose">
      <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="110px" class="dialog-form" role="form" aria-label="汇率编辑表单">
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.exchangeRate.currencyCode')" prop="currencyCode">
            <el-select v-model="editForm.currencyCode"
                    style="width:100%"
                    :placeholder="$t('systembasicmgmt.exchangeRate.pleaseSelectCurrencyCode')"
                    :clearable="false">
              <el-option v-for="item in currencyOptions"
                         :key="item.currencyCode"
                         :label="item.currencyName"
                         :value="item.currencyCode"
                         :disabled="item.disabled" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.exchangeRate.exchangeCurrencyCode')" prop="exchangeCurrencyCode">
            <el-select v-model="editForm.exchangeCurrencyCode"
                    style="width:100%"
                    :placeholder="$t('systembasicmgmt.exchangeRate.pleaseSelectExchangeCurrencyCode')"
                    :clearable="false">
              <el-option v-for="item in currencyOptions"
                         :key="item.currencyCode"
                         :label="item.currencyName"
                         :value="item.currencyCode"
                         :disabled="item.disabled" />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.exchangeRate.exchangeRate')" prop="exchangeRate">
            <el-input v-model.number="editForm.exchangeRate" 
                     type="number" 
                     style="width:100%" 
                     :placeholder="$t('systembasicmgmt.exchangeRate.pleaseInputExchangeRate')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.exchangeRate.yearMonth')" prop="yearMonth">
            <el-date-picker v-model="editForm.yearMonth"
                           type="month"
                           style="width:100%"
                           :placeholder="$t('systembasicmgmt.exchangeRate.pleaseSelectYearMonth')"
                           format="YYYY-MM"
                           value-format="YYYY-MM" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.exchangeRate.remark')" prop="remark">
            <el-input v-model="editForm.remark" 
                     type="textarea" 
                     :rows="3"
                     style="width:100%" 
                     :placeholder="$t('systembasicmgmt.exchangeRate.pleaseInputRemark')" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleSave">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { post } from '@/utils/request'
import { 
  GET_EXCHANGE_RATE_PAGES_API, 
  GET_CURRENCY_DROPDOWN_API,
  GET_EXCHANGE_RATE_ENTITY_API,
  INSERT_EXCHANGE_RATE_API, 
  UPDATE_EXCHANGE_RATE_API,
  DELETE_EXCHANGE_RATE_API
} from '@/config/api/systembasicmgmt/system-settings/exchangerate'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { debounce, PERFORMANCE_CONFIG } from '@/utils/performance'

// 初始化i18n
const { t } = useI18n()

// 汇率数据
const exchangeRateList = ref([])
const loading = ref(false)

// 币别下拉选项
const currencyOptions = ref([])

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
  currencyCode: '',
  yearMonth: ''
})

// 对话框显示状态
const dialogVisible = ref(false)

// 编辑表单
const editForm = reactive({
  exchangeRateId: '',
  currencyCode: '',
  exchangeCurrencyCode: '',
  exchangeRate: '',
  yearMonth: '',
  remark: ''
})

// 对话框标题
const dialogTitle = ref(t('systembasicmgmt.exchangeRate.editExchangeRate'))

// 表单验证规则
const formRules = reactive({
  currencyCode: [
    { required: true, message: t('systembasicmgmt.exchangeRate.pleaseSelectCurrencyCode'), trigger: 'change' }
  ],
  exchangeCurrencyCode: [
    { required: true, message: t('systembasicmgmt.exchangeRate.pleaseSelectExchangeCurrencyCode'), trigger: 'change' }
  ],
  exchangeRate: [
    { required: true, message: t('systembasicmgmt.exchangeRate.pleaseInputExchangeRate'), trigger: 'blur' },
    { type: 'number', message: t('systembasicmgmt.exchangeRate.exchangeRateMustBeNumber'), trigger: 'blur' }
  ],
  yearMonth: [
    { required: true, message: t('systembasicmgmt.exchangeRate.pleaseSelectYearMonth'), trigger: 'change' }
  ]
})

// 在组件挂载后获取数据
onMounted(async () => {
  await fetchCurrencyDropDown()
  fetchExchangeRatePages()
})

// 获取货币下拉框数据
const fetchCurrencyDropDown = async () => {
  const res = await post(GET_CURRENCY_DROPDOWN_API.GET_CURRENCY_DROPDOWN)
  if (res && res.code === 200) {
    currencyOptions.value = res.data || []
    // 设置默认选中第一个有效值
    if (currencyOptions.value.length > 0) {
      const firstValidOption = currencyOptions.value.find(option => !option.disabled)
      if (firstValidOption) {
        filters.currencyCode = firstValidOption.currencyCode
      }
    }
  } else {
    ElMessage.error(res?.message || t('systembasicmgmt.exchangeRate.getCurrencyDropDownFailed'))
  }
}

// 获取汇率实体数据
const fetchExchangeRateEntity = async (exchangeRateId) => {
  try {
    const res = await post(GET_EXCHANGE_RATE_ENTITY_API.GET_EXCHANGE_RATE_ENTITY, { exchangeRateId })
    if (res && res.code === 200) {
      return res.data
    } else {
      ElMessage.error(res?.message || t('systembasicmgmt.exchangeRate.getExchangeRateEntityFailed'))
      return null
    }
  } catch (error) {
    ElMessage.error(t('systembasicmgmt.exchangeRate.getExchangeRateEntityFailed'))
    return null
  }
}

// 获取汇率列表数据
const fetchExchangeRatePages = async () => {
  try {
    loading.value = true
    const params = {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      currencyCode: filters.currencyCode || '',
      yearMonth: filters.yearMonth || ''
    }
    
    const res = await post(GET_EXCHANGE_RATE_PAGES_API.GET_EXCHANGE_RATE_PAGES, params)
    if (res && res.code === 200) {
      exchangeRateList.value = res.data || []
      pagination.totalCount = res.data?.totalCount || 0
    } else {
      ElMessage.error(res?.message || t('systembasicmgmt.exchangeRate.getExchangeRatePagesFailed'))
    }
  } catch (error) {
    ElMessage.error(t('systembasicmgmt.exchangeRate.getExchangeRatePagesFailed'))
  } finally {
    loading.value = false
  }
}

// 使用通用防抖工具
const debouncedFetchExchangeRatePages = debounce(() => {
  fetchExchangeRatePages()
}, PERFORMANCE_CONFIG.DEBOUNCE_DELAY)

// 处理搜索操作（带防抖）
const handleSearch = () => {
  pagination.pageIndex = 1
  loading.value = true
  debouncedFetchExchangeRatePages()
}

// 立即查询数据（不使用防抖，用于保存后刷新）
const fetchExchangeRatePagesImmediate = () => {
  fetchExchangeRatePages()
}

// 处理页码变化
const handlePageChange = (page) => {
  pagination.pageIndex = page
  fetchExchangeRatePages()
}

// 处理每页记录数变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.pageIndex = 1
  fetchExchangeRatePages()
}

// 处理重置操作
const handleReset = () => {
  // 只清空筛选条件，保持currencyCode为第一个有效值
  filters.yearMonth = ''
  // 如果当前没有选中值，设置默认选中第一个有效值
  if (!filters.currencyCode && currencyOptions.value.length > 0) {
    const firstValidOption = currencyOptions.value.find(option => !option.disabled)
    if (firstValidOption) {
      filters.currencyCode = firstValidOption.currencyCode
    }
  }
}

const resetForm = (clearValidation = true) => {
  editForm.exchangeRateId = ''
  editForm.currencyCode = ''
  editForm.exchangeCurrencyCode = ''
  editForm.exchangeRate = ''
  editForm.yearMonth = ''
  editForm.remark = ''
  
  // 设置默认选中第一个有效值
  if (currencyOptions.value.length > 0) {
    const firstValidOption = currencyOptions.value.find(option => !option.disabled)
    if (firstValidOption) {
      editForm.currencyCode = firstValidOption.currencyCode
    }
  }
  
  if (clearValidation && editFormRef.value) {
    nextTick(() => {
      editFormRef.value.clearValidate()
    })
  }
}

// 新增汇率数据
const insertExchangeRate = async () => {
  try {
    const params = {
      currencyCode: editForm.currencyCode,
      exchangeCurrencyCode: editForm.exchangeCurrencyCode,
      exchangeRate: parseFloat(editForm.exchangeRate),
      yearMonth: editForm.yearMonth,
      remark: editForm.remark || ''
    }
    
    const res = await post(INSERT_EXCHANGE_RATE_API.INSERT_EXCHANGE_RATE, params)
    if (res && res.code === 200) {
      ElMessage.success(t('systembasicmgmt.exchangeRate.insertExchangeRateSuccess'))
      dialogVisible.value = false
      fetchExchangeRatePagesImmediate()
    } else {
      ElMessage.error(res?.message || t('systembasicmgmt.exchangeRate.insertExchangeRateFailed'))
    }
  } catch (error) {
    ElMessage.error(t('systembasicmgmt.exchangeRate.insertExchangeRateFailed'))
  }
}

// 更新汇率数据
const updateExchangeRate = async () => {
  try {
    const params = {
      exchangeRateId: editForm.exchangeRateId,
      currencyCode: editForm.currencyCode,
      exchangeCurrencyCode: editForm.exchangeCurrencyCode,
      exchangeRate: parseFloat(editForm.exchangeRate),
      yearMonth: editForm.yearMonth,
      remark: editForm.remark || ''
    }
    
    const res = await post(UPDATE_EXCHANGE_RATE_API.UPDATE_EXCHANGE_RATE, params)
    if (res && res.code === 200) {
      ElMessage.success(t('systembasicmgmt.exchangeRate.updateExchangeRateSuccess'))
      dialogVisible.value = false
      fetchExchangeRatePagesImmediate()
    } else {
      ElMessage.error(res?.message || t('systembasicmgmt.exchangeRate.updateExchangeRateFailed'))
    }
  } catch (error) {
    ElMessage.error(t('systembasicmgmt.exchangeRate.updateExchangeRateFailed'))
  }
}

// 删除汇率数据
const deleteExchangeRate = async (exchangeRateId) => {
  try {
    const res = await post(DELETE_EXCHANGE_RATE_API.DELETE_EXCHANGE_RATE, { exchangeRateId })
    if (res && res.code === 200) {
      ElMessage.success(t('systembasicmgmt.exchangeRate.deleteExchangeRateSuccess'))
      // 如果当前页没有数据了，回到上一页
      if (exchangeRateList.value.length === 1 && pagination.pageIndex > 1) {
        pagination.pageIndex--
      }
      fetchExchangeRatePagesImmediate()
    } else {
      ElMessage.error(res?.message || t('systembasicmgmt.exchangeRate.deleteExchangeRateFailed'))
    }
  } catch (error) {
    ElMessage.error(t('systembasicmgmt.exchangeRate.deleteExchangeRateFailed'))
  }
}

// 处理新增操作
const handleAdd = () => {
  resetForm()
  dialogTitle.value = t('systembasicmgmt.exchangeRate.addExchangeRate')
  dialogVisible.value = true
  
  nextTick(() => {
    editFormRef.value?.focus()
  })
}

// 处理编辑操作
const handleEdit = async (index, row) => {
  const entity = await fetchExchangeRateEntity(row.exchangeRateId)
  if (entity) {
    Object.assign(editForm, entity)
    dialogTitle.value = t('systembasicmgmt.exchangeRate.editExchangeRate')
    dialogVisible.value = true
  }
}

// 处理删除操作
const handleDelete = (index, row) => {
  ElMessageBox.confirm(
    t('systembasicmgmt.exchangeRate.confirmDeleteExchangeRate'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(() => {
    deleteExchangeRate(row.exchangeRateId)
  }).catch(() => {
    // 用户取消删除
  })
}

// 保存编辑结果
const handleSave = () => {
  editFormRef.value.validate((valid) => {
    if (valid) {
      if (editForm.exchangeRateId) {
        updateExchangeRate()
      } else {
        insertExchangeRate()
      }
    }
  })
}

// 处理对话框关闭
const handleDialogClose = () => {
  resetForm()
}
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
  
