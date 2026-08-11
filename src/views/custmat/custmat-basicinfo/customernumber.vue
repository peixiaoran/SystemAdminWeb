<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="searchForm" class="conventional-filter-form" role="search" :aria-label="$t('custmat.customernumber.ariaFilterLabel')">
        <el-form-item :label="$t('custmat.customernumber.partNumber')">
          <el-input
            v-model="searchForm.partNumber"
            :placeholder="$t('custmat.customernumber.pleaseInputPartNumber')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('custmat.customernumber.status')">
          <el-select
            v-model="searchForm.status"
            :placeholder="$t('common.pleaseSelect')"
            style="width: 140px"
            @change="handleSearch"
          >
            <el-option :label="$t('custmat.customernumber.statusEnabled')" :value="1" />
            <el-option :label="$t('custmat.customernumber.statusDisabled')" :value="0" />
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
          <el-button type="warning" @click="handleOpenImport">
            {{ $t('custmat.customernumber.import') }}
          </el-button>
          <el-button type="success" :loading="exportLoading" @click="handleExport">
            {{ $t('custmat.customernumber.export') }}
          </el-button>
          <el-button type="primary" style="margin-left: 24px" @click="handleAdd">
            {{ $t('custmat.customernumber.addCustomerNumber') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table
          :data="customerNumberList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('custmat.customernumber.index')" width="70" align="center" fixed />
          <el-table-column prop="partNumber" :label="$t('custmat.customernumber.partNumber')" align="left" min-width="160" />
          <el-table-column prop="productNameCn" :label="$t('custmat.customernumber.productNameCn')" align="left" min-width="180" />
          <el-table-column prop="productNameEn" :label="$t('custmat.customernumber.productNameEn')" align="left" min-width="180" />
          <el-table-column prop="specification" :label="$t('custmat.customernumber.specification')" align="left" min-width="160" />
          <el-table-column prop="unit" :label="$t('custmat.customernumber.unit')" align="left" min-width="100" />
          <el-table-column :label="$t('custmat.customernumber.status')" align="center" min-width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status ? 'success' : 'info'">
                {{ scope.row.status ? $t('custmat.customernumber.statusEnabled') : $t('custmat.customernumber.statusDisabled') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.operation')" min-width="180" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)" :loading="editingId === scope.row.customerNumberId">
                {{ $t('common.edit') }}
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)" :loading="deletingId === scope.row.customerNumberId">
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
      :title="isEdit ? $t('custmat.customernumber.editCustomerNumber') : $t('custmat.customernumber.addCustomerNumber')"
      width="60%"
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
          label-width="110px"
          class="dialog-form"
          role="form"
          :aria-label="$t('custmat.customernumber.ariaEditLabel')"
        >
          <div class="form-row">
            <el-form-item :label="$t('custmat.customernumber.partNumber')" prop="partNumber">
              <el-input v-model="form.partNumber" :placeholder="$t('custmat.customernumber.pleaseInputPartNumber')" style="width:100%" />
            </el-form-item>
            <el-form-item :label="$t('custmat.customernumber.productNameCn')" prop="productNameCn">
              <el-input v-model="form.productNameCn" :placeholder="$t('custmat.customernumber.pleaseInputProductNameCn')" style="width:100%" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.customernumber.productNameEn')" prop="productNameEn">
              <el-input v-model="form.productNameEn" :placeholder="$t('custmat.customernumber.pleaseInputProductNameEn')" style="width:100%" />
            </el-form-item>
            <el-form-item :label="$t('custmat.customernumber.specification')" prop="specification">
              <el-input v-model="form.specification" :placeholder="$t('custmat.customernumber.pleaseInputSpecification')" style="width:100%" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.customernumber.unit')" prop="unit">
              <el-input v-model="form.unit" :placeholder="$t('custmat.customernumber.pleaseInputUnit')" style="width:100%" />
            </el-form-item>
            <el-form-item :label="$t('custmat.customernumber.status')" prop="status">
              <el-switch v-model="form.status" />
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

    <el-dialog
      v-model="importDialogVisible"
      :title="$t('custmat.customernumber.import')"
      width="520px"
      draggable
      :modal="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      @close="handleImportDialogClose"
    >
      <div class="import-dialog-body">
        <div class="import-template-row">
          <el-button :loading="templateLoading" @click="handleDownloadTemplate">
            {{ $t('custmat.customernumber.downloadTemplate') }}
          </el-button>
        </div>

        <el-upload
          drag
          action="#"
          accept=".xls,.xlsx"
          :auto-upload="false"
          :show-file-list="true"
          :limit="1"
          :on-change="handleImportFileChange"
          :on-exceed="handleImportFileExceed"
          :on-remove="handleImportFileRemove"
          :file-list="importFileList"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            {{ $t('custmat.customernumber.dragFileHint') }}
          </div>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="importDialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" :loading="importLoading" :disabled="!importFile" @click="handleImportSubmit">
            {{ $t('custmat.customernumber.startImport') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { post, postBlob, isHandled } from '@/utils/request'
import {
  GET_CUSTOMER_NUMBER_LIST_API,
  GET_CUSTOMER_NUMBER_ENTITY_API,
  INSERT_CUSTOMER_NUMBER_API,
  UPDATE_CUSTOMER_NUMBER_API,
  DELETE_CUSTOMER_NUMBER_API,
  GET_CUSTOMER_NUMBER_TEMPLATE_API,
  IMPORT_CUSTOMER_NUMBER_API,
  GET_CUSTOMER_NUMBER_EXCEL_API
} from '@/config/api/custmat/custmat-basicinfo/customernumber.js'
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
const customerNumberList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

// 导入相关
const importDialogVisible = ref(false)
const templateLoading = ref(false)
const importLoading = ref(false)
const importFile = ref(null)
const importFileList = ref([])

// 导出相关
const exportLoading = ref(false)

// 搜索表单
const searchForm = reactive({
  partNumber: '',
  status: ''
})

// 分页信息
const pagination = reactive({
  pageIndex: 1,
  pageSize: 50,
  totalCount: 0
})

// 表单数据
const form = reactive({
  customerNumberId: '',
  partNumber: '',
  productNameCn: '',
  productNameEn: null,
  specification: null,
  unit: '',
  status: true
})

// 表单验证规则
const rules = {
  partNumber: [
    { required: true, message: () => t('custmat.customernumber.pleaseInputPartNumber'), trigger: 'blur' }
  ],
  productNameCn: [
    { required: true, message: () => t('custmat.customernumber.pleaseInputProductNameCn'), trigger: 'blur' }
  ],
  unit: [
    { required: true, message: () => t('custmat.customernumber.pleaseInputUnit'), trigger: 'blur' }
  ]
}

// 构建分页/导出共用的查询参数
const buildQueryParams = () => ({
  partNumber: searchForm.partNumber,
  status: searchForm.status === '' ? null : Number(searchForm.status),
  pageIndex: pagination.pageIndex,
  pageSize: pagination.pageSize,
  totalCount: pagination.totalCount
})

// 获取客户料号列表
const getCustomerNumberList = async () => {
  loading.value = true
  try {
    const params = buildQueryParams()

    const response = await post(GET_CUSTOMER_NUMBER_LIST_API.GET_CUSTOMER_NUMBER_LIST, params)

    if (isHandled(response)) {
      customerNumberList.value = []
      return
    }

    if (response.code === 200) {
      customerNumberList.value = response.data || []
      pagination.totalCount = response.totalCount || 0
    } else {
      ElMessage({
        message: response.message,
        type: Number(response.code) === 400 ? 'warning' : 'error',
        plain: true,
        showClose: true
      })
      customerNumberList.value = []
    }
  } catch (error) {
    ElMessage({
      message: t('custmat.customernumber.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
    customerNumberList.value = []
  } finally {
    loading.value = false
  }
}

// 使用通用防抖工具
const debouncedGetCustomerNumberList = debounce(() => {
  getCustomerNumberList()
}, PERFORMANCE_CONFIG.DEBOUNCE_DELAY)

// 处理搜索操作（带防抖）
const handleSearch = () => {
  pagination.pageIndex = 1
  loading.value = true
  debouncedGetCustomerNumberList()
}

// 重置搜索
const handleReset = () => {
  searchForm.partNumber = ''
  searchForm.status = ''
  loading.value = true
  pagination.pageIndex = 1
  getCustomerNumberList()
}

// 分页大小改变
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.pageIndex = 1
  getCustomerNumberList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  pagination.pageIndex = val
  getCustomerNumberList()
}

// 重置表单
const resetForm = () => {
  form.customerNumberId = ''
  form.partNumber = ''
  form.productNameCn = ''
  form.productNameEn = null
  form.specification = null
  form.unit = ''
  form.status = true
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
  editingId.value = row.customerNumberId
  dialogLoading.value = true
  dialogVisible.value = true
  isEdit.value = true

  try {
    const response = await post(
      GET_CUSTOMER_NUMBER_ENTITY_API.GET_CUSTOMER_NUMBER_ENTITY,
      new URLSearchParams({ customerNumberId: String(row.customerNumberId) }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    if (isHandled(response)) {
      dialogVisible.value = false
      return
    }

    if (response.code === 200) {
      const data = response.data
      form.customerNumberId = data.customerNumberId
      form.partNumber = data.partNumber
      form.productNameCn = data.productNameCn
      form.productNameEn = data.productNameEn
      form.specification = data.specification
      form.unit = data.unit
      form.status = data.status
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
      message: t('custmat.customernumber.getFailed'),
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
      t('custmat.customernumber.deleteConfirm'),
      t('common.tip'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    deletingId.value = row.customerNumberId

    const response = await post(
      DELETE_CUSTOMER_NUMBER_API.DELETE_CUSTOMER_NUMBER,
      new URLSearchParams({ customerNumberId: String(row.customerNumberId) }),
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
      getCustomerNumberList()
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
        message: t('custmat.customernumber.operationFailed'),
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
      customerNumberId: form.customerNumberId,
      partNumber: form.partNumber,
      productNameCn: form.productNameCn,
      productNameEn: form.productNameEn,
      specification: form.specification,
      unit: form.unit,
      status: form.status
    }

    const api = isEdit.value ? UPDATE_CUSTOMER_NUMBER_API.UPDATE_CUSTOMER_NUMBER : INSERT_CUSTOMER_NUMBER_API.INSERT_CUSTOMER_NUMBER
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
      getCustomerNumberList()
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
         message: t('custmat.customernumber.operationFailed'),
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

// 打开导入弹窗
const handleOpenImport = () => {
  importFile.value = null
  importFileList.value = []
  importDialogVisible.value = true
}

// 导入弹窗关闭
const handleImportDialogClose = () => {
  importFile.value = null
  importFileList.value = []
}

// 选择/替换导入文件
const handleImportFileChange = (uploadFile) => {
  importFile.value = uploadFile.raw
  importFileList.value = [uploadFile]
}

// 超出单文件限制时替换为最新选择的文件
const handleImportFileExceed = (files) => {
  const file = files[0]
  importFile.value = file
  importFileList.value = [{ name: file.name, raw: file }]
}

// 移除已选文件
const handleImportFileRemove = () => {
  importFile.value = null
  importFileList.value = []
}

// 下载导入模板（文件名由前端拼接，中英文用空格分隔）
const handleDownloadTemplate = async () => {
  templateLoading.value = true
  try {
    const response = await postBlob(GET_CUSTOMER_NUMBER_TEMPLATE_API.GET_CUSTOMER_NUMBER_TEMPLATE)
    const blob = response.data

    if (!(blob instanceof Blob) || blob.size === 0) {
      throw new Error(t('custmat.customernumber.downloadTemplateFailed'))
    }

    if (blob.type && blob.type.includes('application/json')) {
      const text = await blob.text()
      let message = t('custmat.customernumber.downloadTemplateFailed')
      try {
        const json = JSON.parse(text)
        message = json?.message || message
      } catch {
        // ignore
      }
      throw new Error(message)
    }

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '客户料号导入模板 CustomerNumberTemplate.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    ElMessage({
      message: error?.message || t('custmat.customernumber.downloadTemplateFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
  } finally {
    templateLoading.value = false
  }
}

// 导出客户料号Excel（查询条件与分页列表一致，文件名由前端拼接）
const handleExport = async () => {
  exportLoading.value = true
  try {
    const response = await postBlob(GET_CUSTOMER_NUMBER_EXCEL_API.GET_CUSTOMER_NUMBER_EXCEL, buildQueryParams())
    const blob = response.data

    if (!(blob instanceof Blob) || blob.size === 0) {
      throw new Error(t('custmat.customernumber.exportFailed'))
    }

    if (blob.type && blob.type.includes('application/json')) {
      const text = await blob.text()
      let message = t('custmat.customernumber.exportFailed')
      try {
        const json = JSON.parse(text)
        message = json?.message || message
      } catch {
        // ignore
      }
      throw new Error(message)
    }

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '客户料号信息 CustomerNumber.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    ElMessage({
      message: error?.message || t('custmat.customernumber.exportFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
  } finally {
    exportLoading.value = false
  }
}

// 提交导入
const handleImportSubmit = async () => {
  if (!importFile.value) return

  // 选择文件后若磁盘上的文件被修改/替换，浏览器会拒绝再次读取该文件句柄
  // （表现为上传时 net::ERR_UPLOAD_FILE_CHANGED），这里提前尝试读取以给出明确提示
  try {
    await importFile.value.slice(0, 1).arrayBuffer()
  } catch (error) {
    ElMessage({
      message: t('custmat.customernumber.fileChangedError'),
      type: 'error',
      plain: true,
      showClose: true
    })
    importFile.value = null
    importFileList.value = []
    return
  }

  importLoading.value = true
  try {
    const formData = new FormData()
    formData.append('file', importFile.value)

    const response = await post(IMPORT_CUSTOMER_NUMBER_API.IMPORT_CUSTOMER_NUMBER, formData)

    if (isHandled(response)) return

    if (response.code === 200) {
      ElMessage({
        message: response.message || t('common.success'),
        type: 'success',
        plain: true,
        showClose: true
      })
      importDialogVisible.value = false
      getCustomerNumberList()
    } else {
      ElMessage({
        message: response.message,
        type: Number(response.code) === 400 ? 'warning' : 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    ElMessage({
      message: t('custmat.customernumber.operationFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
  } finally {
    importLoading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getCustomerNumberList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.import-dialog-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.import-template-row {
  display: flex;
  justify-content: flex-end;
}
</style>
