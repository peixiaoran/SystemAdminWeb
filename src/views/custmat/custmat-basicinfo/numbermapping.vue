<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('custmat.numbermapping.ariaFilterLabel')">
        <el-form-item :label="$t('custmat.numbermapping.customerPartNumber')">
          <el-input v-model="filters.customerPartNumber"
                    style="width: 200px"
                    clearable
                    :placeholder="$t('custmat.numbermapping.pleaseInputCustomerPartNumber')" />
        </el-form-item>
        <el-form-item :label="$t('custmat.numbermapping.companyPartNumber')">
          <el-input v-model="filters.companyPartNumber"
                    style="width: 200px"
                    clearable
                    :placeholder="$t('custmat.numbermapping.pleaseInputCompanyPartNumber')" />
        </el-form-item>
        <el-form-item :label="$t('custmat.numbermapping.status')">
          <el-select v-model="filters.status"
                     style="width: 140px"
                     clearable
                     :placeholder="$t('common.pleaseSelect')">
            <el-option :label="$t('custmat.numbermapping.statusEnabled')" :value="1" />
            <el-option :label="$t('custmat.numbermapping.statusDisabled')" :value="0" />
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
          <el-button type="primary" @click="handleAdd">
            {{ $t('custmat.numbermapping.addNumberMapping') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table :data="numberMappingList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('custmat.numbermapping.index')" width="70" align="center" fixed />
          <el-table-column prop="customerPartNumber" :label="$t('custmat.numbermapping.customerPartNumber')" align="left" min-width="180" />
          <el-table-column prop="companyPartNumber" :label="$t('custmat.numbermapping.companyPartNumber')" align="left" min-width="180" />
          <el-table-column prop="effectiveFrom" :label="$t('custmat.numbermapping.effectiveFrom')" align="center" min-width="140" :formatter="formatDateCell" />
          <el-table-column prop="effectiveTo" :label="$t('custmat.numbermapping.effectiveTo')" align="center" min-width="140" :formatter="formatDateCell" />
          <el-table-column :label="$t('custmat.numbermapping.status')" align="center" min-width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status ? 'success' : 'info'">
                {{ scope.row.status ? $t('custmat.numbermapping.statusEnabled') : $t('custmat.numbermapping.statusDisabled') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.operation')" min-width="180" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)" :loading="editingId === scope.row.mappingId">
                {{ $t('common.edit') }}
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)" :loading="deletingId === scope.row.mappingId">
                {{ $t('common.delete') }}
              </el-button>
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

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible"
               :title="isEdit ? $t('custmat.numbermapping.editNumberMapping') : $t('custmat.numbermapping.addNumberMapping')"
               width="820px"
               :close-on-click-modal="false"
               :append-to-body="true"
               :lock-scroll="true"
               @close="handleDialogClose">
      <div v-loading="dialogLoading">
        <el-form :inline="true"
                 :model="editForm"
                 :rules="formRules"
                 ref="editFormRef"
                 label-width="130px"
                 class="dialog-form"
                 role="form"
                 :aria-label="$t('custmat.numbermapping.ariaEditLabel')">
          <div class="form-row">
            <el-form-item :label="$t('custmat.numbermapping.customerPartNumber')" prop="customerPartNumber">
              <el-select v-model="editForm.customerPartNumber"
                         filterable
                         remote
                         reserve-keyword
                         style="width:100%"
                         :remote-method="handleSearchCustomerPartNumber"
                         :loading="customerPartNumberLoading"
                         :placeholder="$t('custmat.numbermapping.pleaseSelectCustomerPartNumber')">
                <el-option v-for="item in customerPartNumberOptions" :key="item.value" :label="item.value" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('custmat.numbermapping.companyPartNumber')" prop="companyPartNumber">
              <el-select v-model="editForm.companyPartNumber"
                         filterable
                         remote
                         reserve-keyword
                         style="width:100%"
                         :remote-method="handleSearchCompanyPartNumber"
                         :loading="companyPartNumberLoading"
                         :placeholder="$t('custmat.numbermapping.pleaseSelectCompanyPartNumber')">
                <el-option v-for="item in companyPartNumberOptions" :key="item.value" :label="item.value" :value="item.value" />
              </el-select>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.numbermapping.effectiveFrom')" prop="effectiveFrom">
              <el-date-picker v-model="editForm.effectiveFrom"
                               type="date"
                               value-format="YYYY-MM-DD"
                               style="width:100%"
                               :placeholder="$t('custmat.numbermapping.pleaseSelectEffectiveFrom')" />
            </el-form-item>
            <el-form-item :label="$t('custmat.numbermapping.effectiveTo')" prop="effectiveTo">
              <el-date-picker v-model="editForm.effectiveTo"
                               type="date"
                               value-format="YYYY-MM-DD"
                               style="width:100%"
                               :placeholder="$t('custmat.numbermapping.pleaseSelectEffectiveTo')" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.numbermapping.status')" prop="status">
              <el-switch v-model="editForm.status" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <!-- 占位项：保持与上方两列布局对齐 -->
            <el-form-item />
          </div>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { post, isHandled } from '@/utils/request'
import {
  GET_NUMBER_MAPPING_LIST_API,
  GET_NUMBER_MAPPING_ENTITY_API,
  INSERT_NUMBER_MAPPING_API,
  UPDATE_NUMBER_MAPPING_API,
  DELETE_NUMBER_MAPPING_API,
  GET_CUSTOMER_PART_NUMBER_DROP_API,
  GET_COMPANY_PART_NUMBER_DROP_API
} from '@/config/api/custmat/custmat-basicinfo/numbermapping'

const { t } = useI18n()

const REMOTE_SEARCH_DEBOUNCE_MS = 300

/** 实体查询/删除接口按 form-urlencoded 提交 */
const FORM_URLENCODED = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }

const numberMappingList = ref([])
const loading = ref(false)
const dialogLoading = ref(false)
const submitLoading = ref(false)
const editingId = ref(null)
const deletingId = ref(null)
const editFormRef = ref(null)

// 客户料号/公司料号远程搜索下拉
const customerPartNumberOptions = ref([])
const customerPartNumberLoading = ref(false)
let customerPartNumberTimer = null

const companyPartNumberOptions = ref([])
const companyPartNumberLoading = ref(false)
let companyPartNumberTimer = null

const pagination = reactive({
  pageIndex: 1,
  pageSize: 50,
  totalCount: 0
})

const filters = reactive({
  customerPartNumber: '',
  companyPartNumber: '',
  status: ''
})

const dialogVisible = ref(false)
const isEdit = ref(false)

const editForm = reactive({
  mappingId: '',
  customerPartNumber: '',
  companyPartNumber: '',
  effectiveFrom: '',
  effectiveTo: null,
  status: 1
})

const formRules = {
  customerPartNumber: [
    { required: true, message: () => t('custmat.numbermapping.pleaseSelectCustomerPartNumber'), trigger: 'change' }
  ],
  companyPartNumber: [
    { required: true, message: () => t('custmat.numbermapping.pleaseSelectCompanyPartNumber'), trigger: 'change' }
  ],
  effectiveFrom: [
    { required: true, message: () => t('custmat.numbermapping.pleaseSelectEffectiveFrom'), trigger: 'change' }
  ]
}

/** 表格日期列：后端返回的 DateTime 字符串（如 2024-01-01T00:00:00）只展示日期部分 */
const formatDateCell = (row, column, cellValue) => cellValue ? String(cellValue).split('T')[0] : ''

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

/** 业务码失败提示：400 视为告警，其余视为错误 */
const showApiError = (res, fallbackKey) => {
  showMessage(res?.message || t(fallbackKey), Number(res?.code) === 400 ? 'warning' : 'error')
}

/** 分页列表查询参数 */
const buildQueryParams = () => ({
  customerPartNumber: filters.customerPartNumber,
  companyPartNumber: filters.companyPartNumber,
  status: filters.status === '' ? null : Number(filters.status),
  pageIndex: pagination.pageIndex,
  pageSize: pagination.pageSize,
  totalCount: pagination.totalCount
})

const fetchNumberMappingList = async () => {
  loading.value = true
  try {
    const res = await post(GET_NUMBER_MAPPING_LIST_API.GET_NUMBER_MAPPING_LIST, buildQueryParams())

    if (isHandled(res)) {
      numberMappingList.value = []
      return
    }

    if (res?.code === 200) {
      numberMappingList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      showApiError(res, 'custmat.numbermapping.getFailed')
      numberMappingList.value = []
    }
  } catch {
    showMessage(t('custmat.numbermapping.getFailed'))
    numberMappingList.value = []
  } finally {
    loading.value = false
  }
}

// 客户料号远程搜索（防抖）
const handleSearchCustomerPartNumber = (keyword) => {
  if (customerPartNumberTimer) clearTimeout(customerPartNumberTimer)
  if (!keyword) {
    customerPartNumberOptions.value = []
    return
  }
  customerPartNumberTimer = setTimeout(async () => {
    customerPartNumberLoading.value = true
    try {
      const res = await post(
        GET_CUSTOMER_PART_NUMBER_DROP_API.GET_CUSTOMER_PART_NUMBER_DROP,
        new URLSearchParams({ keyword }),
        FORM_URLENCODED
      )
      customerPartNumberOptions.value = res?.code === 200 ? (res.data || []) : []
    } catch {
      customerPartNumberOptions.value = []
    } finally {
      customerPartNumberLoading.value = false
    }
  }, REMOTE_SEARCH_DEBOUNCE_MS)
}

// 公司料号远程搜索（防抖）
const handleSearchCompanyPartNumber = (keyword) => {
  if (companyPartNumberTimer) clearTimeout(companyPartNumberTimer)
  if (!keyword) {
    companyPartNumberOptions.value = []
    return
  }
  companyPartNumberTimer = setTimeout(async () => {
    companyPartNumberLoading.value = true
    try {
      const res = await post(
        GET_COMPANY_PART_NUMBER_DROP_API.GET_COMPANY_PART_NUMBER_DROP,
        new URLSearchParams({ keyword }),
        FORM_URLENCODED
      )
      companyPartNumberOptions.value = res?.code === 200 ? (res.data || []) : []
    } catch {
      companyPartNumberOptions.value = []
    } finally {
      companyPartNumberLoading.value = false
    }
  }, REMOTE_SEARCH_DEBOUNCE_MS)
}

const resetEditForm = () => {
  Object.assign(editForm, {
    mappingId: '',
    customerPartNumber: '',
    companyPartNumber: '',
    effectiveFrom: '',
    effectiveTo: null,
    status: 1
  })
  customerPartNumberOptions.value = []
  companyPartNumberOptions.value = []
}

const handleSearch = () => {
  pagination.pageIndex = 1
  fetchNumberMappingList()
}

const handleReset = () => {
  filters.customerPartNumber = ''
  filters.companyPartNumber = ''
  filters.status = ''
  handleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchNumberMappingList()
}

const handlePageChange = () => {
  fetchNumberMappingList()
}

const handleAdd = () => {
  resetEditForm()
  isEdit.value = false
  dialogVisible.value = true
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleEdit = async (row) => {
  editingId.value = row.mappingId
  dialogLoading.value = true
  dialogVisible.value = true
  isEdit.value = true

  try {
    const res = await post(
      GET_NUMBER_MAPPING_ENTITY_API.GET_NUMBER_MAPPING_ENTITY,
      new URLSearchParams({ mappingId: String(row.mappingId) }),
      FORM_URLENCODED
    )

    if (isHandled(res)) {
      dialogVisible.value = false
      return
    }

    if (res?.code === 200) {
      const data = res.data
      Object.assign(editForm, {
        mappingId: data.mappingId,
        customerPartNumber: data.customerPartNumber,
        companyPartNumber: data.companyPartNumber,
        effectiveFrom: data.effectiveFrom,
        effectiveTo: data.effectiveTo,
        status: data.status
      })
      // 预置当前值，使远程搜索下拉能正常回显已选料号
      customerPartNumberOptions.value = data.customerPartNumber ? [{ value: data.customerPartNumber }] : []
      companyPartNumberOptions.value = data.companyPartNumber ? [{ value: data.companyPartNumber }] : []
    } else {
      showApiError(res, 'custmat.numbermapping.getFailed')
      dialogVisible.value = false
    }
  } catch {
    showMessage(t('custmat.numbermapping.getFailed'))
    dialogVisible.value = false
  } finally {
    dialogLoading.value = false
    editingId.value = null
    nextTick(() => editFormRef.value?.clearValidate())
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('custmat.numbermapping.deleteConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }

  deletingId.value = row.mappingId
  try {
    const res = await post(
      DELETE_NUMBER_MAPPING_API.DELETE_NUMBER_MAPPING,
      new URLSearchParams({ mappingId: String(row.mappingId) }),
      FORM_URLENCODED
    )

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message, 'success')
      fetchNumberMappingList()
    } else {
      showApiError(res, 'custmat.numbermapping.operationFailed')
    }
  } catch {
    showMessage(t('custmat.numbermapping.operationFailed'))
  } finally {
    deletingId.value = null
  }
}

const handleSave = async () => {
  const valid = await editFormRef.value?.validate().catch(() => false)
  // 校验失败时 el-form 已在界面上标红，无需额外提示
  if (!valid) return

  submitLoading.value = true
  try {
    const api = isEdit.value
      ? UPDATE_NUMBER_MAPPING_API.UPDATE_NUMBER_MAPPING
      : INSERT_NUMBER_MAPPING_API.INSERT_NUMBER_MAPPING
    const res = await post(api, {
      mappingId: editForm.mappingId,
      customerPartNumber: editForm.customerPartNumber,
      companyPartNumber: editForm.companyPartNumber,
      effectiveFrom: editForm.effectiveFrom,
      effectiveTo: editForm.effectiveTo,
      status: editForm.status
    })

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message, 'success')
      dialogVisible.value = false
      fetchNumberMappingList()
    } else {
      showApiError(res, 'custmat.numbermapping.operationFailed')
    }
  } catch {
    showMessage(t('custmat.numbermapping.operationFailed'))
  } finally {
    submitLoading.value = false
  }
}

const handleDialogClose = () => {
  resetEditForm()
  editFormRef.value?.clearValidate()
}

onMounted(() => {
  fetchNumberMappingList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
