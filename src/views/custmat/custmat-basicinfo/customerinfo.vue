<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('custmat.customer.ariaFilterLabel')">
        <el-form-item :label="$t('custmat.customer.customerCode')">
          <el-input v-model="filters.customerCode"
                    style="width: 200px"
                    :placeholder="$t('custmat.customer.pleaseInputCustomerCode')"
                    clearable />
        </el-form-item>
        <el-form-item :label="$t('custmat.customer.customerName')">
          <el-input v-model="filters.customerName"
                    style="width: 200px"
                    :placeholder="$t('custmat.customer.pleaseInputCustomerName')"
                    clearable />
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
            {{ $t('custmat.customer.addCustomer') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table :data="customerList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('custmat.customer.index')" width="70" align="center" fixed />
          <el-table-column prop="customerCode" :label="$t('custmat.customer.customerCode')" align="left" min-width="160" />
          <el-table-column prop="customerNameCn" :label="$t('custmat.customer.customerNameCn')" align="left" min-width="200" />
          <el-table-column prop="customerNameEn" :label="$t('custmat.customer.customerNameEn')" align="left" min-width="200" />
          <el-table-column prop="description" :label="$t('custmat.customer.customerDescription')" align="left" min-width="250" show-overflow-tooltip />
          <el-table-column :label="$t('common.operation')" min-width="120" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">
                {{ $t('common.edit') }}
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">
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

    <el-dialog v-model="dialogVisible"
               :title="isEdit ? $t('custmat.customer.editCustomer') : $t('custmat.customer.addCustomer')"
               width="50%"
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
                 :aria-label="$t('custmat.customer.ariaEditLabel')">
          <div class="form-row">
            <el-form-item :label="$t('custmat.customer.customerCode')" prop="customerCode">
              <el-input v-model="editForm.customerCode"
                        style="width:100%"
                        :placeholder="$t('custmat.customer.pleaseInputCustomerCode')" />
            </el-form-item>
            <el-form-item :label="$t('custmat.customer.customerNameCn')" prop="customerNameCn">
              <el-input v-model="editForm.customerNameCn"
                        style="width:100%"
                        :placeholder="$t('custmat.customer.pleaseInputCustomerNameCn')" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.customer.customerNameEn')" prop="customerNameEn">
              <el-input v-model="editForm.customerNameEn"
                        style="width:100%"
                        :placeholder="$t('custmat.customer.pleaseInputCustomerNameEn')" />
            </el-form-item>
            <!-- 占位项：保持与上方两列布局对齐 -->
            <el-form-item />
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('custmat.customer.customerDescription')" prop="description">
              <el-input v-model="editForm.description"
                        style="width:100%"
                        type="textarea"
                        :rows="3"
                        :placeholder="$t('custmat.customer.pleaseInputCustomerDescription')" />
            </el-form-item>
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
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { post, isHandled } from '@/utils/request'
import {
  GET_CUSTOMER_LIST_API,
  GET_CUSTOMER_ENTITY_API,
  INSERT_CUSTOMER_API,
  UPDATE_CUSTOMER_API,
  DELETE_CUSTOMER_API
} from '@/config/api/custmat/custmat-basicinfo/customerinfo'

const { t } = useI18n()

const DEBOUNCE_MS = 300
let searchTimer = null

/** 实体查询/删除接口按 form-urlencoded 提交 */
const FORM_URLENCODED = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }

const customerList = ref([])
const loading = ref(false)
const dialogLoading = ref(false)
const submitLoading = ref(false)
const editFormRef = ref(null)

const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
  totalCount: 0
})

const filters = reactive({
  customerCode: '',
  customerName: ''
})

const dialogVisible = ref(false)
const isEdit = ref(false)

const editForm = reactive({
  customerId: '',
  customerCode: '',
  customerNameCn: '',
  customerNameEn: '',
  description: ''
})

const formRules = {
  customerCode: [
    { required: true, message: () => t('custmat.customer.pleaseInputCustomerCode'), trigger: 'blur' }
  ],
  customerNameCn: [
    { required: true, message: () => t('custmat.customer.pleaseInputCustomerNameCn'), trigger: 'blur' }
  ],
  customerNameEn: [
    { required: true, message: () => t('custmat.customer.pleaseInputCustomerNameEn'), trigger: 'blur' }
  ]
}

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

/** 业务码失败提示：400 视为告警，其余视为错误 */
const showApiError = (res, fallbackKey) => {
  showMessage(res?.message || t(fallbackKey), Number(res?.code) === 400 ? 'warning' : 'error')
}

const fetchCustomerList = async () => {
  loading.value = true
  try {
    const res = await post(GET_CUSTOMER_LIST_API.GET_CUSTOMER_LIST, {
      customerCode: filters.customerCode,
      customerName: filters.customerName,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: pagination.totalCount
    })

    if (isHandled(res)) {
      customerList.value = []
      return
    }

    if (res?.code === 200) {
      customerList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      showApiError(res, 'custmat.customer.getFailed')
      customerList.value = []
    }
  } catch {
    showMessage(t('custmat.customer.getFailed'))
    customerList.value = []
  } finally {
    loading.value = false
  }
}

const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchCustomerList()
  }, DEBOUNCE_MS)
}

const resetEditForm = () => {
  Object.assign(editForm, {
    customerId: '',
    customerCode: '',
    customerNameCn: '',
    customerNameEn: '',
    description: ''
  })
}

const handleSearch = () => scheduleSearch()

const handleReset = () => {
  filters.customerCode = ''
  filters.customerName = ''
  scheduleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchCustomerList()
}

const handlePageChange = () => {
  fetchCustomerList()
}

const handleAdd = () => {
  resetEditForm()
  isEdit.value = false
  dialogVisible.value = true
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleEdit = async (row) => {
  dialogLoading.value = true
  dialogVisible.value = true
  isEdit.value = true

  try {
    const res = await post(
      GET_CUSTOMER_ENTITY_API.GET_CUSTOMER_ENTITY,
      new URLSearchParams({ customerId: String(row.customerId) }),
      FORM_URLENCODED
    )

    if (isHandled(res)) {
      dialogVisible.value = false
      return
    }

    if (res?.code === 200) {
      Object.assign(editForm, {
        customerId: res.data.customerId,
        customerCode: res.data.customerCode,
        customerNameCn: res.data.customerNameCn,
        customerNameEn: res.data.customerNameEn,
        description: res.data.description
      })
    } else {
      showApiError(res, 'custmat.customer.getFailed')
      dialogVisible.value = false
    }
  } catch {
    showMessage(t('custmat.customer.getFailed'))
    dialogVisible.value = false
  } finally {
    dialogLoading.value = false
    nextTick(() => editFormRef.value?.clearValidate())
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('custmat.customer.deleteConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }

  try {
    const res = await post(
      DELETE_CUSTOMER_API.DELETE_CUSTOMER,
      new URLSearchParams({ customerId: String(row.customerId) }),
      FORM_URLENCODED
    )

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message, 'success')
      fetchCustomerList()
    } else {
      showApiError(res, 'custmat.customer.operationFailed')
    }
  } catch {
    showMessage(t('custmat.customer.operationFailed'))
  }
}

const handleSave = async () => {
  const valid = await editFormRef.value?.validate().catch(() => false)
  // 校验失败时 el-form 已在界面上标红，无需额外提示
  if (!valid) return

  submitLoading.value = true
  try {
    const api = isEdit.value ? UPDATE_CUSTOMER_API.UPDATE_CUSTOMER : INSERT_CUSTOMER_API.INSERT_CUSTOMER
    const res = await post(api, {
      customerId: editForm.customerId,
      customerCode: editForm.customerCode,
      customerNameCn: editForm.customerNameCn,
      customerNameEn: editForm.customerNameEn,
      description: editForm.description
    })

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message, 'success')
      dialogVisible.value = false
      fetchCustomerList()
    } else {
      showApiError(res, 'custmat.customer.operationFailed')
    }
  } catch {
    showMessage(t('custmat.customer.operationFailed'))
  } finally {
    submitLoading.value = false
  }
}

const handleDialogClose = () => {
  resetEditForm()
  dialogLoading.value = false
  editFormRef.value?.clearValidate()
}

onMounted(() => {
  fetchCustomerList()
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
