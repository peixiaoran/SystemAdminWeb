<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('custmat.companynumber.ariaFilterLabel')">
        <el-form-item :label="$t('custmat.companynumber.partNumber')">
          <el-input v-model="filters.partNumber"
                    style="width: 200px"
                    :placeholder="$t('custmat.companynumber.pleaseInputPartNumber')" />
        </el-form-item>
        <el-form-item :label="$t('custmat.companynumber.status')">
          <el-select v-model="filters.status"
                     style="width: 140px"
                     :placeholder="$t('common.pleaseSelect')"
                     @change="handleSearch">
            <el-option :label="$t('custmat.companynumber.statusEnabled')" :value="1" />
            <el-option :label="$t('custmat.companynumber.statusDisabled')" :value="0" />
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
            {{ $t('custmat.companynumber.import') }}
          </el-button>
          <el-button type="success" :loading="exportLoading" @click="handleExport">
            {{ $t('custmat.companynumber.export') }}
          </el-button>
          <el-button type="primary" style="margin-left: 24px" @click="handleAdd">
            {{ $t('custmat.companynumber.addCompanyNumber') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table :data="companyNumberList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('custmat.companynumber.index')" width="70" align="center" fixed />
          <el-table-column prop="partNumber" :label="$t('custmat.companynumber.partNumber')" align="left" min-width="160" />
          <el-table-column prop="productNameCn" :label="$t('custmat.companynumber.productNameCn')" align="left" min-width="180" />
          <el-table-column prop="partTypeName" :label="$t('custmat.companynumber.partType')" align="left" min-width="140" />
          <el-table-column prop="categoryName" :label="$t('custmat.companynumber.category')" align="left" min-width="140" />
          <el-table-column prop="sourceTypeName" :label="$t('custmat.companynumber.sourceType')" align="left" min-width="140" />
          <el-table-column prop="unit" :label="$t('custmat.companynumber.unit')" align="left" min-width="100" />
          <el-table-column :label="$t('custmat.companynumber.status')" align="center" min-width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status ? 'success' : 'info'">
                {{ scope.row.status ? $t('custmat.companynumber.statusEnabled') : $t('custmat.companynumber.statusDisabled') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.operation')" min-width="180" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)" :loading="editingId === scope.row.partNumberId">
                {{ $t('common.edit') }}
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)" :loading="deletingId === scope.row.partNumberId">
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
               :title="isEdit ? $t('custmat.companynumber.editCompanyNumber') : $t('custmat.companynumber.addCompanyNumber')"
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
                 :aria-label="$t('custmat.companynumber.ariaEditLabel')">
          <div class="form-row">
            <el-form-item :label="$t('custmat.companynumber.partNumber')" prop="partNumber">
              <el-input v-model="editForm.partNumber"
                        style="width:100%"
                        :placeholder="$t('custmat.companynumber.pleaseInputPartNumber')" />
            </el-form-item>
            <el-form-item :label="$t('custmat.companynumber.productNameCn')" prop="productNameCn">
              <el-input v-model="editForm.productNameCn"
                        style="width:100%"
                        :placeholder="$t('custmat.companynumber.pleaseInputProductNameCn')" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.companynumber.productNameEn')" prop="productNameEn">
              <el-input v-model="editForm.productNameEn"
                        style="width:100%"
                        :placeholder="$t('custmat.companynumber.pleaseInputProductNameEn')" />
            </el-form-item>
            <el-form-item :label="$t('custmat.companynumber.specifications')" prop="specifications">
              <el-input v-model="editForm.specifications"
                        style="width:100%"
                        :placeholder="$t('custmat.companynumber.pleaseInputSpecifications')" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.companynumber.partType')" prop="partType">
              <el-select v-model="editForm.partType" style="width:100%" :placeholder="$t('common.pleaseSelect')">
                <el-option v-for="item in partTypeOptions"
                           :key="item.partType"
                           :label="item.partTypeName"
                           :value="item.partType" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('custmat.companynumber.category')" prop="category">
              <el-select v-model="editForm.category" style="width:100%" :placeholder="$t('common.pleaseSelect')">
                <el-option v-for="item in categoryOptions"
                           :key="item.category"
                           :label="item.categoryName"
                           :value="item.category" />
              </el-select>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.companynumber.model')" prop="model">
              <el-input v-model="editForm.model"
                        style="width:100%"
                        :placeholder="$t('custmat.companynumber.pleaseInputModel')" />
            </el-form-item>
            <el-form-item :label="$t('custmat.companynumber.drawingNumber')" prop="drawingNumber">
              <el-input v-model="editForm.drawingNumber"
                        style="width:100%"
                        :placeholder="$t('custmat.companynumber.pleaseInputDrawingNumber')" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.companynumber.version')" prop="version">
              <el-input v-model="editForm.version"
                        style="width:100%"
                        :placeholder="$t('custmat.companynumber.pleaseInputVersion')" />
            </el-form-item>
            <el-form-item :label="$t('custmat.companynumber.unit')" prop="unit">
              <el-input v-model="editForm.unit"
                        style="width:100%"
                        :placeholder="$t('custmat.companynumber.pleaseInputUnit')" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.companynumber.sourceType')" prop="sourceType">
              <el-select v-model="editForm.sourceType" style="width:100%" :placeholder="$t('common.pleaseSelect')">
                <el-option v-for="item in sourceTypeOptions"
                           :key="item.sourceType"
                           :label="item.sourceTypeName"
                           :value="item.sourceType" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('custmat.companynumber.manufacturer')" prop="manufacturer">
              <el-input v-model="editForm.manufacturer"
                        style="width:100%"
                        :placeholder="$t('custmat.companynumber.pleaseInputManufacturer')" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.companynumber.manufacturerNumber')" prop="manufacturerNumber">
              <el-input v-model="editForm.manufacturerNumber"
                        style="width:100%"
                        :placeholder="$t('custmat.companynumber.pleaseInputManufacturerNumber')" />
            </el-form-item>
            <el-form-item :label="$t('custmat.companynumber.lotControl')" prop="lotControl">
              <el-switch v-model="editForm.lotControl" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.companynumber.status')" prop="status">
              <el-switch v-model="editForm.status" />
            </el-form-item>
            <!-- 占位项：保持与上方两列布局对齐 -->
            <el-form-item />
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('custmat.companynumber.remark')" prop="remark">
              <el-input v-model="editForm.remark"
                        style="width:100%"
                        type="textarea"
                        :rows="3"
                        :placeholder="$t('custmat.companynumber.pleaseInputRemark')" />
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
               :title="$t('custmat.companynumber.import')"
               width="520px"
               draggable
               :modal="false"
               :close-on-click-modal="false"
               :append-to-body="true"
               @close="handleImportDialogClose">
      <div class="import-dialog-body">
        <div class="import-template-row">
          <el-button :loading="templateLoading" @click="handleDownloadTemplate">
            {{ $t('custmat.companynumber.downloadTemplate') }}
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
            {{ $t('custmat.companynumber.dragFileHint') }}
          </div>
        </el-upload>
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="importLoading" :disabled="!importFile" @click="handleImportSubmit">
          {{ $t('custmat.companynumber.startImport') }}
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
  GET_COMPANY_NUMBER_LIST_API,
  GET_COMPANY_NUMBER_ENTITY_API,
  INSERT_COMPANY_NUMBER_API,
  UPDATE_COMPANY_NUMBER_API,
  DELETE_COMPANY_NUMBER_API,
  GET_PART_TYPE_DROP_API,
  GET_CATEGORY_DROP_API,
  GET_SOURCE_TYPE_DROP_API,
  GET_COMPANY_NUMBER_TEMPLATE_API,
  IMPORT_COMPANY_NUMBER_API,
  GET_COMPANY_NUMBER_EXCEL_API
} from '@/config/api/custmat/custmat-basicinfo/companynumber'

const { t } = useI18n()

const DEBOUNCE_MS = 300
let searchTimer = null

/** 实体查询/删除接口按 form-urlencoded 提交 */
const FORM_URLENCODED = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }

const companyNumberList = ref([])
const loading = ref(false)
const dialogLoading = ref(false)
const submitLoading = ref(false)
const editingId = ref(null)
const deletingId = ref(null)
const editFormRef = ref(null)

// 下拉选项
const partTypeOptions = ref([])
const categoryOptions = ref([])
const sourceTypeOptions = ref([])

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
  partNumberId: '',
  partNumber: '',
  productNameCn: '',
  productNameEn: null,
  specifications: null,
  partType: '',
  category: '',
  model: null,
  drawingNumber: null,
  version: null,
  unit: '',
  sourceType: null,
  manufacturer: null,
  manufacturerNumber: null,
  lotControl: true,
  status: true,
  remark: null
})

const formRules = {
  partNumber: [
    { required: true, message: () => t('custmat.companynumber.pleaseInputPartNumber'), trigger: 'blur' }
  ],
  productNameCn: [
    { required: true, message: () => t('custmat.companynumber.pleaseInputProductNameCn'), trigger: 'blur' }
  ],
  partType: [
    { required: true, message: () => t('common.pleaseSelect'), trigger: 'change' }
  ],
  category: [
    { required: true, message: () => t('common.pleaseSelect'), trigger: 'change' }
  ],
  unit: [
    { required: true, message: () => t('custmat.companynumber.pleaseInputUnit'), trigger: 'blur' }
  ],
  sourceType: [
    { required: true, message: () => t('common.pleaseSelect'), trigger: 'change' }
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

const fetchPartTypeDropdown = async () => {
  const res = await post(GET_PART_TYPE_DROP_API.GET_PART_TYPE_DROP)
  if (res?.code === 200) {
    partTypeOptions.value = res.data || []
  }
}

const fetchCategoryDropdown = async () => {
  const res = await post(GET_CATEGORY_DROP_API.GET_CATEGORY_DROP)
  if (res?.code === 200) {
    categoryOptions.value = res.data || []
  }
}

const fetchSourceTypeDropdown = async () => {
  const res = await post(GET_SOURCE_TYPE_DROP_API.GET_SOURCE_TYPE_DROP)
  if (res?.code === 200) {
    sourceTypeOptions.value = res.data || []
  }
}

const fetchDialogDropdowns = () => {
  fetchPartTypeDropdown()
  fetchCategoryDropdown()
  fetchSourceTypeDropdown()
}

const fetchCompanyNumberList = async () => {
  loading.value = true
  try {
    const res = await post(GET_COMPANY_NUMBER_LIST_API.GET_COMPANY_NUMBER_LIST, buildQueryParams())

    if (isHandled(res)) {
      companyNumberList.value = []
      return
    }

    if (res?.code === 200) {
      companyNumberList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      showApiError(res, 'custmat.companynumber.getFailed')
      companyNumberList.value = []
    }
  } catch {
    showMessage(t('custmat.companynumber.getFailed'))
    companyNumberList.value = []
  } finally {
    loading.value = false
  }
}

const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchCompanyNumberList()
  }, DEBOUNCE_MS)
}

const resetEditForm = () => {
  Object.assign(editForm, {
    partNumberId: '',
    partNumber: '',
    productNameCn: '',
    productNameEn: null,
    specifications: null,
    partType: '',
    category: '',
    model: null,
    drawingNumber: null,
    version: null,
    unit: '',
    sourceType: null,
    manufacturer: null,
    manufacturerNumber: null,
    lotControl: true,
    status: true,
    remark: null
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
  fetchCompanyNumberList()
}

const handlePageChange = () => {
  fetchCompanyNumberList()
}

const handleAdd = () => {
  resetEditForm()
  isEdit.value = false
  dialogVisible.value = true
  fetchDialogDropdowns()
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleEdit = async (row) => {
  editingId.value = row.partNumberId
  dialogLoading.value = true
  dialogVisible.value = true
  isEdit.value = true
  fetchDialogDropdowns()

  try {
    const res = await post(
      GET_COMPANY_NUMBER_ENTITY_API.GET_COMPANY_NUMBER_ENTITY,
      new URLSearchParams({ partNumberId: String(row.partNumberId) }),
      FORM_URLENCODED
    )

    if (isHandled(res)) {
      dialogVisible.value = false
      return
    }

    if (res?.code === 200) {
      const data = res.data
      Object.assign(editForm, {
        partNumberId: data.partNumberId,
        partNumber: data.partNumber,
        productNameCn: data.productNameCn,
        productNameEn: data.productNameEn,
        specifications: data.specifications,
        partType: data.partType,
        category: data.category,
        model: data.model,
        drawingNumber: data.drawingNumber,
        version: data.version,
        unit: data.unit,
        sourceType: data.sourceType,
        manufacturer: data.manufacturer,
        manufacturerNumber: data.manufacturerNumber,
        lotControl: data.lotControl,
        status: data.status,
        remark: data.remark
      })
    } else {
      showApiError(res, 'custmat.companynumber.getFailed')
      dialogVisible.value = false
    }
  } catch {
    showMessage(t('custmat.companynumber.getFailed'))
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
      t('custmat.companynumber.deleteConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }

  deletingId.value = row.partNumberId
  try {
    const res = await post(
      DELETE_COMPANY_NUMBER_API.DELETE_COMPANY_NUMBER,
      new URLSearchParams({ partNumberId: String(row.partNumberId) }),
      FORM_URLENCODED
    )

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message, 'success')
      fetchCompanyNumberList()
    } else {
      showApiError(res, 'custmat.companynumber.operationFailed')
    }
  } catch {
    showMessage(t('custmat.companynumber.operationFailed'))
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
      ? UPDATE_COMPANY_NUMBER_API.UPDATE_COMPANY_NUMBER
      : INSERT_COMPANY_NUMBER_API.INSERT_COMPANY_NUMBER
    const res = await post(api, {
      partNumberId: editForm.partNumberId,
      partNumber: editForm.partNumber,
      productNameCn: editForm.productNameCn,
      productNameEn: editForm.productNameEn,
      specifications: editForm.specifications,
      partType: editForm.partType,
      category: editForm.category,
      model: editForm.model,
      drawingNumber: editForm.drawingNumber,
      version: editForm.version,
      unit: editForm.unit,
      sourceType: editForm.sourceType,
      manufacturer: editForm.manufacturer,
      manufacturerNumber: editForm.manufacturerNumber,
      lotControl: editForm.lotControl,
      status: editForm.status,
      remark: editForm.remark
    })

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message, 'success')
      dialogVisible.value = false
      fetchCompanyNumberList()
    } else {
      showApiError(res, 'custmat.companynumber.operationFailed')
    }
  } catch {
    showMessage(t('custmat.companynumber.operationFailed'))
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

// 下载导入模板（文件名根据当前语言取自 i18n）
const handleDownloadTemplate = async () => {
  templateLoading.value = true
  try {
    const res = await postBlob(GET_COMPANY_NUMBER_TEMPLATE_API.GET_COMPANY_NUMBER_TEMPLATE)
    await assertDownloadableBlob(res?.data, 'custmat.companynumber.downloadTemplateFailed')
    downloadBlob(res.data, `${t('custmat.companynumber.templateFileName')}.xlsx`)
  } catch (error) {
    showMessage(error?.message || t('custmat.companynumber.downloadTemplateFailed'))
  } finally {
    templateLoading.value = false
  }
}

// 导出公司料号 Excel（查询条件与分页列表一致，文件名根据当前语言取自 i18n）
const handleExport = async () => {
  exportLoading.value = true
  try {
    const res = await postBlob(GET_COMPANY_NUMBER_EXCEL_API.GET_COMPANY_NUMBER_EXCEL, buildQueryParams())
    await assertDownloadableBlob(res?.data, 'custmat.companynumber.exportFailed')
    downloadBlob(res.data, `${t('custmat.companynumber.exportFileName')}.xlsx`)
  } catch (error) {
    showMessage(error?.message || t('custmat.companynumber.exportFailed'))
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
    showMessage(t('custmat.companynumber.fileChangedError'))
    importFile.value = null
    importFileList.value = []
    return
  }

  importLoading.value = true
  try {
    const formData = new FormData()
    formData.append('file', importFile.value)

    const res = await post(IMPORT_COMPANY_NUMBER_API.IMPORT_COMPANY_NUMBER, formData)

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message || t('common.success'), 'success')
      importDialogVisible.value = false
      fetchCompanyNumberList()
    } else {
      showApiError(res, 'custmat.companynumber.operationFailed')
    }
  } catch {
    showMessage(t('custmat.companynumber.operationFailed'))
  } finally {
    importLoading.value = false
  }
}

onMounted(() => {
  fetchCompanyNumberList()
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
