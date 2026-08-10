<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="searchForm" class="conventional-filter-form" role="search" aria-label="客户信息筛选">
        <el-form-item :label="$t('custmat.customer.customerCode')">
          <el-input
            v-model="searchForm.customerCode"
            :placeholder="$t('custmat.customer.pleaseInputCustomerCode')"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('custmat.customer.customerName')">
          <el-input
            v-model="searchForm.customerName"
            :placeholder="$t('custmat.customer.pleaseInputCustomerName')"
            clearable
            style="width: 200px"
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
        <el-form-item class="form-right-button">
          <el-button type="primary" @click="handleAdd">
            {{ $t('custmat.customer.addCustomer') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table
          :data="customerList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('custmat.customer.index')" width="70" align="center" fixed />
          <el-table-column prop="customerCode" :label="$t('custmat.customer.customerCode')" align="left" min-width="160" />
          <el-table-column prop="customerNameCn" :label="$t('custmat.customer.customerNameCn')" align="left" min-width="200" />
          <el-table-column prop="customerNameEn" :label="$t('custmat.customer.customerNameEn')" align="left" min-width="200" />
          <el-table-column prop="description" :label="$t('custmat.customer.customerDescription')" align="left" min-width="250" />
          <el-table-column :label="$t('common.operation')" min-width="120" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)" :loading="editingId === scope.row.customerId">
                {{ $t('common.edit') }}
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)" :loading="deletingId === scope.row.customerId">
                {{ $t('common.delete') }}
              </el-button>
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

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? $t('custmat.customer.editCustomer') : $t('custmat.customer.addCustomer')"
      width="50%"
      :close-on-click-modal="false"
      :append-to-body="true"
      :modal-append-to-body="true"
      :lock-scroll="true"
      @close="handleDialogClose"
    >
      <div v-loading="dialogLoading">
        <el-form
          :inline="true"
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
          class="dialog-form"
          role="form"
          aria-label="客户信息编辑"
        >
          <div class="form-row">
            <el-form-item :label="$t('custmat.customer.customerCode')" prop="customerCode">
              <el-input
                v-model="form.customerCode"
                :placeholder="$t('custmat.customer.pleaseInputCustomerCode')"
                style="width:100%"
              />
            </el-form-item>
            <el-form-item :label="$t('custmat.customer.customerNameCn')" prop="customerNameCn">
              <el-input
                v-model="form.customerNameCn"
                :placeholder="$t('custmat.customer.pleaseInputCustomerNameCn')"
                style="width:100%"
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.customer.customerNameEn')" prop="customerNameEn">
              <el-input
                v-model="form.customerNameEn"
                :placeholder="$t('custmat.customer.pleaseInputCustomerNameEn')"
                style="width:100%"
              />
            </el-form-item>
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('custmat.customer.customerDescription')" prop="description">
              <el-input
                v-model="form.description"
                :placeholder="$t('custmat.customer.pleaseInputCustomerDescription')"
                style="width:100%"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { post, isHandled } from '@/utils/request'
import {
  GET_CUSTOMER_LIST_API,
  GET_CUSTOMER_ENTITY_API,
  INSERT_CUSTOMER_API,
  UPDATE_CUSTOMER_API,
  DELETE_CUSTOMER_API
} from '@/config/api/custmat/custmat-basicinfo/customerinfo.js'
import { useI18n } from 'vue-i18n'
import { debounce, PERFORMANCE_CONFIG } from '@/utils/performance'

// 使用i18n
const { t } = useI18n()

// 响应式数据
const loading = ref(false)
const dialogLoading = ref(false)
const submitLoading = ref(false)
const editingId = ref(null)
const deletingId = ref(null)
const customerList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

// 搜索表单
const searchForm = reactive({
  customerCode: '',
  customerName: ''
})

// 分页信息
const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
  totalCount: 0
})

// 表单数据
const form = reactive({
  customerId: '',
  customerCode: '',
  customerNameCn: '',
  customerNameEn: '',
  description: ''
})

// 表单验证规则
const rules = {
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

// 获取客户列表
const getCustomerList = async () => {
  loading.value = true
  try {
    const params = {
      customerCode: searchForm.customerCode,
      customerName: searchForm.customerName,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: pagination.totalCount
    }

    const response = await post(GET_CUSTOMER_LIST_API.GET_CUSTOMER_LIST, params)

    if (isHandled(response)) {
      customerList.value = []
      return
    }

    if (response.code === 200) {
      customerList.value = response.data || []
      pagination.totalCount = response.totalCount || 0
    } else {
      ElMessage({
        message: response.message,
        type: Number(response.code) === 400 ? 'warning' : 'error',
        plain: true,
        showClose: true
      })
      customerList.value = []
    }
  } catch (error) {
    ElMessage({
      message: t('custmat.customer.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
    customerList.value = []
  } finally {
    loading.value = false
  }
}

// 使用通用防抖工具
const debouncedGetCustomerList = debounce(() => {
  getCustomerList()
}, PERFORMANCE_CONFIG.DEBOUNCE_DELAY)

// 处理搜索操作（带防抖）
const handleSearch = () => {
  pagination.pageIndex = 1
  loading.value = true
  debouncedGetCustomerList()
}

// 重置搜索
const handleReset = () => {
  searchForm.customerCode = ''
  searchForm.customerName = ''
  loading.value = true // 立即显示加载状态
  pagination.pageIndex = 1
  getCustomerList()
}

// 分页大小改变
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.pageIndex = 1
  getCustomerList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  pagination.pageIndex = val
  getCustomerList()
}

// 重置表单
const resetForm = () => {
  form.customerId = ''
  form.customerCode = ''
  form.customerNameCn = ''
  form.customerNameEn = ''
  form.description = ''
}

// 新增
const handleAdd = () => {
  resetForm()
  isEdit.value = false
  dialogVisible.value = true
  nextTick(() => {
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  })
}

// 编辑
const handleEdit = async (row) => {
  editingId.value = row.customerId
  dialogLoading.value = true
  dialogVisible.value = true
  isEdit.value = true

  try {
    const response = await post(
      GET_CUSTOMER_ENTITY_API.GET_CUSTOMER_ENTITY,
      new URLSearchParams({ customerId: String(row.customerId) }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    if (isHandled(response)) {
      dialogVisible.value = false
      return
    }

    if (response.code === 200) {
      const data = response.data
      form.customerId = data.customerId
      form.customerCode = data.customerCode
      form.customerNameCn = data.customerNameCn
      form.customerNameEn = data.customerNameEn
      form.description = data.description
    } else {
      ElMessage({
        message: response.message,
        type: Number(response.code) === 400 ? 'warning' : 'error',
        plain: true,
        showClose: true
      })
      dialogVisible.value = false
    }
  } catch (error) {
    ElMessage({
      message: t('custmat.customer.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
    dialogVisible.value = false
  } finally {
    dialogLoading.value = false
    editingId.value = null
  }
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('custmat.customer.deleteConfirm'),
      t('common.tip'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    deletingId.value = row.customerId

    const response = await post(
      DELETE_CUSTOMER_API.DELETE_CUSTOMER,
      new URLSearchParams({ customerId: String(row.customerId) }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    if (isHandled(response)) return

    if (response.code === 200) {
      ElMessage({
        message: response.message,
        type: 'success',
        plain: true,
        showClose: true
      })
      getCustomerList()
    } else {
      ElMessage({
        message: response.message,
        type: Number(response.code) === 400 ? 'warning' : 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage({
        message: t('custmat.customer.operationFailed'),
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } finally {
    deletingId.value = null
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    submitLoading.value = true

    const params = {
      customerId: form.customerId,
      customerCode: form.customerCode,
      customerNameCn: form.customerNameCn,
      customerNameEn: form.customerNameEn,
      description: form.description
    }

    const api = isEdit.value ? UPDATE_CUSTOMER_API.UPDATE_CUSTOMER : INSERT_CUSTOMER_API.INSERT_CUSTOMER
    const response = await post(api, params)

    if (isHandled(response)) return

    if (response.code === 200) {
      ElMessage({
        message: response.message,
        type: 'success',
        plain: true,
        showClose: true
      })
      dialogVisible.value = false
      getCustomerList()
    } else {
      ElMessage({
        message: response.message,
        type: Number(response.code) === 400 ? 'warning' : 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
     if (error !== false) {
       ElMessage({
         message: t('custmat.customer.operationFailed'),
         type: 'error',
         plain: true,
         showClose: true
       })
     }
   } finally {
     submitLoading.value = false
   }
}

// 对话框关闭
const handleDialogClose = () => {
  resetForm()
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getCustomerList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
