<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('custmat.customernumber.ariaFilterLabel')">
        <el-form-item :label="$t('custmat.customernumber.partNumber')">
          <el-input v-model="filters.partNumber"
                    style="width: 200px"
                    :placeholder="$t('custmat.customernumber.pleaseInputPartNumber')" />
        </el-form-item>
        <el-form-item :label="$t('custmat.customernumber.status')">
          <el-select v-model="filters.status"
                     style="width: 140px"
                     :placeholder="$t('common.pleaseSelect')"
                     @change="handleSearch">
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
        <el-table :data="customerNumberList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
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
               :title="isEdit ? $t('custmat.customernumber.editCustomerNumber') : $t('custmat.customernumber.addCustomerNumber')"
               width="60%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :lock-scroll="true"
               @close="handleDialogClose">
      <div v-loading="dialogLoading">
        <el-form :inline="true"
                 :model="editForm"
                 :rules="formRules"
                 ref="editFormRef"
                 label-width="110px"
                 class="dialog-form"
                 role="form"
                 :aria-label="$t('custmat.customernumber.ariaEditLabel')">
          <div class="form-row">
            <el-form-item :label="$t('custmat.customernumber.partNumber')" prop="partNumber">
              <el-input v-model="editForm.partNumber"
                        style="width:100%"
                        :placeholder="$t('custmat.customernumber.pleaseInputPartNumber')" />
            </el-form-item>
            <el-form-item :label="$t('custmat.customernumber.productNameCn')" prop="productNameCn">
              <el-input v-model="editForm.productNameCn"
                        style="width:100%"
                        :placeholder="$t('custmat.customernumber.pleaseInputProductNameCn')" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.customernumber.productNameEn')" prop="productNameEn">
              <el-input v-model="editForm.productNameEn"
                        style="width:100%"
                        :placeholder="$t('custmat.customernumber.pleaseInputProductNameEn')" />
            </el-form-item>
            <el-form-item :label="$t('custmat.customernumber.specification')" prop="specification">
              <el-input v-model="editForm.specification"
                        style="width:100%"
                        :placeholder="$t('custmat.customernumber.pleaseInputSpecification')" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.customernumber.unit')" prop="unit">
              <el-input v-model="editForm.unit"
                        style="width:100%"
                        :placeholder="$t('custmat.customernumber.pleaseInputUnit')" />
            </el-form-item>
            <el-form-item :label="$t('custmat.customernumber.status')" prop="status">
              <el-switch v-model="editForm.status" />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog v-model="importDialogVisible"
               :title="$t('custmat.customernumber.import')"
               width="520px"
               draggable
               :modal="false"
               :close-on-click-modal="false"
               :append-to-body="true"
               @close="handleImportDialogClose">
      <div class="import-dialog-body">
        <div class="import-template-row">
          <el-button :loading="templateLoading" @click="handleDownloadTemplate">
            {{ $t('custmat.customernumber.downloadTemplate') }}
          </el-button>
        </div>

        <el-upload drag
                   action="#"
                   accept=".xls,.xlsx"
                   :auto-upload="false"
                   :show-file-list="true"
                   :limit="1"
                   :on-change="handleImportFileChange"
                   :on-exceed="handleImportFileExceed"
                   :on-remove="handleImportFileRemove"
                   :file-list="importFileList">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            {{ $t('custmat.customernumber.dragFileHint') }}
          </div>
        </el-upload>
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="importLoading" :disabled="!importFile" @click="handleImportSubmit">
          {{ $t('custmat.customernumber.startImport') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
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
} from '@/config/api/custmat/custmat-basicinfo/customernumber'

const { t } = useI18n()

const DEBOUNCE_MS = 300
let searchTimer = null

/** 实体查询/删除接口按 form-urlencoded 提交 */
const FORM_URLENCODED = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }

const customerNumberList = ref([])
const loading = ref(false)
const dialogLoading = ref(false)
const submitLoading = ref(false)
const editingId = ref(null)
const deletingId = ref(null)
const editFormRef = ref(null)

// 导入相关
const importDialogVisible = ref(false)
const templateLoading = ref(false)
const importLoading = ref(false)
const importFile = ref(null)
const importFileList = ref([])

// 导出相关
const exportLoading = ref(false)

const pagination = reactive({
  pageIndex: 1,
  pageSize: 50,
  totalCount: 0
})

const filters = reactive({
  partNumber: '',
  status: ''
})

const dialogVisible = ref(false)
const isEdit = ref(false)

const editForm = reactive({
  customerNumberId: '',
  partNumber: '',
  productNameCn: '',
  productNameEn: null,
  specification: null,
  unit: '',
  status: true
})

const formRules = {
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

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

/** 业务码失败提示：400 视为告警，其余视为错误 */
const showApiError = (res, fallbackKey) => {
  showMessage(res?.message || t(fallbackKey), Number(res?.code) === 400 ? 'warning' : 'error')
}

/** 分页列表与导出共用的查询参数 */
const buildQueryParams = () => ({
  partNumber: filters.partNumber,
  status: filters.status === '' ? null : Number(filters.status),
  pageIndex: pagination.pageIndex,
  pageSize: pagination.pageSize,
  totalCount: pagination.totalCount
})

/**
 * 后端出错时会返回 JSON 而非 Excel，需要读出里面的错误信息
 * @param {Blob} blob 接口返回的二进制内容
 * @param {string} fallbackKey 无法解析出错误信息时使用的兜底文案 key
 */
const assertDownloadableBlob = async (blob, fallbackKey) => {
  if (!(blob instanceof Blob) || blob.size === 0) {
    throw new Error(t(fallbackKey))
  }
  if (blob.type && blob.type.includes('application/json')) {
    const text = await blob.text()
    let message = t(fallbackKey)
    try {
      message = JSON.parse(text)?.message || message
    } catch {
      // 非 JSON 内容时沿用默认文案
    }
    throw new Error(message)
  }
}

const downloadBlob = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

const fetchCustomerNumberList = async () => {
  loading.value = true
  try {
    const res = await post(GET_CUSTOMER_NUMBER_LIST_API.GET_CUSTOMER_NUMBER_LIST, buildQueryParams())

    if (isHandled(res)) {
      customerNumberList.value = []
      return
    }

    if (res?.code === 200) {
      customerNumberList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      showApiError(res, 'custmat.customernumber.getFailed')
      customerNumberList.value = []
    }
  } catch {
    showMessage(t('custmat.customernumber.getFailed'))
    customerNumberList.value = []
  } finally {
    loading.value = false
  }
}

const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchCustomerNumberList()
  }, DEBOUNCE_MS)
}

const resetEditForm = () => {
  Object.assign(editForm, {
    customerNumberId: '',
    partNumber: '',
    productNameCn: '',
    productNameEn: null,
    specification: null,
    unit: '',
    status: true
  })
}

const handleSearch = () => scheduleSearch()

const handleReset = () => {
  filters.partNumber = ''
  filters.status = ''
  scheduleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchCustomerNumberList()
}

const handlePageChange = () => {
  fetchCustomerNumberList()
}

const handleAdd = () => {
  resetEditForm()
  isEdit.value = false
  dialogVisible.value = true
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleEdit = async (row) => {
  editingId.value = row.customerNumberId
  dialogLoading.value = true
  dialogVisible.value = true
  isEdit.value = true

  try {
    const res = await post(
      GET_CUSTOMER_NUMBER_ENTITY_API.GET_CUSTOMER_NUMBER_ENTITY,
      new URLSearchParams({ customerNumberId: String(row.customerNumberId) }),
      FORM_URLENCODED
    )

    if (isHandled(res)) {
      dialogVisible.value = false
      return
    }

    if (res?.code === 200) {
      Object.assign(editForm, {
        customerNumberId: res.data.customerNumberId,
        partNumber: res.data.partNumber,
        productNameCn: res.data.productNameCn,
        productNameEn: res.data.productNameEn,
        specification: res.data.specification,
        unit: res.data.unit,
        status: res.data.status
      })
    } else {
      showApiError(res, 'custmat.customernumber.getFailed')
      dialogVisible.value = false
    }
  } catch {
    showMessage(t('custmat.customernumber.getFailed'))
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
      t('custmat.customernumber.deleteConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }

  deletingId.value = row.customerNumberId
  try {
    const res = await post(
      DELETE_CUSTOMER_NUMBER_API.DELETE_CUSTOMER_NUMBER,
      new URLSearchParams({ customerNumberId: String(row.customerNumberId) }),
      FORM_URLENCODED
    )

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message, 'success')
      fetchCustomerNumberList()
    } else {
      showApiError(res, 'custmat.customernumber.operationFailed')
    }
  } catch {
    showMessage(t('custmat.customernumber.operationFailed'))
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
      ? UPDATE_CUSTOMER_NUMBER_API.UPDATE_CUSTOMER_NUMBER
      : INSERT_CUSTOMER_NUMBER_API.INSERT_CUSTOMER_NUMBER
    const res = await post(api, {
      customerNumberId: editForm.customerNumberId,
      partNumber: editForm.partNumber,
      productNameCn: editForm.productNameCn,
      productNameEn: editForm.productNameEn,
      specification: editForm.specification,
      unit: editForm.unit,
      status: editForm.status
    })

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message, 'success')
      dialogVisible.value = false
      fetchCustomerNumberList()
    } else {
      showApiError(res, 'custmat.customernumber.operationFailed')
    }
  } catch {
    showMessage(t('custmat.customernumber.operationFailed'))
  } finally {
    submitLoading.value = false
  }
}

const handleDialogClose = () => {
  resetEditForm()
  editFormRef.value?.clearValidate()
}

const handleOpenImport = () => {
  importFile.value = null
  importFileList.value = []
  importDialogVisible.value = true
}

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

const handleImportFileRemove = () => {
  importFile.value = null
  importFileList.value = []
}

// 下载导入模板（文件名由前端拼接，中英文用空格分隔）
const handleDownloadTemplate = async () => {
  templateLoading.value = true
  try {
    const res = await postBlob(GET_CUSTOMER_NUMBER_TEMPLATE_API.GET_CUSTOMER_NUMBER_TEMPLATE)
    await assertDownloadableBlob(res?.data, 'custmat.customernumber.downloadTemplateFailed')
    downloadBlob(res.data, '客户料号导入模板 Customer Number Import Template.xlsx')
  } catch (error) {
    showMessage(error?.message || t('custmat.customernumber.downloadTemplateFailed'))
  } finally {
    templateLoading.value = false
  }
}

// 导出客户料号 Excel（查询条件与分页列表一致，文件名由前端拼接）
const handleExport = async () => {
  exportLoading.value = true
  try {
    const res = await postBlob(GET_CUSTOMER_NUMBER_EXCEL_API.GET_CUSTOMER_NUMBER_EXCEL, buildQueryParams())
    await assertDownloadableBlob(res?.data, 'custmat.customernumber.exportFailed')
    downloadBlob(res.data, '客户料号信息 CustomerNumber.xlsx')
  } catch (error) {
    showMessage(error?.message || t('custmat.customernumber.exportFailed'))
  } finally {
    exportLoading.value = false
  }
}

const handleImportSubmit = async () => {
  if (!importFile.value) return

  // 选择文件后若磁盘上的文件被修改/替换，浏览器会拒绝再次读取该文件句柄
  // （表现为上传时 net::ERR_UPLOAD_FILE_CHANGED），这里提前尝试读取以给出明确提示
  try {
    await importFile.value.slice(0, 1).arrayBuffer()
  } catch {
    showMessage(t('custmat.customernumber.fileChangedError'))
    importFile.value = null
    importFileList.value = []
    return
  }

  importLoading.value = true
  try {
    const formData = new FormData()
    formData.append('file', importFile.value)

    const res = await post(IMPORT_CUSTOMER_NUMBER_API.IMPORT_CUSTOMER_NUMBER, formData)

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message || t('common.success'), 'success')
      importDialogVisible.value = false
      fetchCustomerNumberList()
    } else {
      showApiError(res, 'custmat.customernumber.operationFailed')
    }
  } catch {
    showMessage(t('custmat.customernumber.operationFailed'))
  } finally {
    importLoading.value = false
  }
}

onMounted(() => {
  fetchCustomerNumberList()
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
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
