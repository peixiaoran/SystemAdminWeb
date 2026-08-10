<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="searchForm" class="conventional-filter-form" role="search" aria-label="料号筛选">
        <el-form-item :label="$t('custmat.partnumber.partNumber')">
          <el-input
            v-model="searchForm.partNumber"
            :placeholder="$t('custmat.partnumber.pleaseInputPartNumber')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('custmat.partnumber.status')">
          <el-select
            v-model="searchForm.status"
            :placeholder="$t('common.pleaseSelect')"
            style="width: 140px"
            @change="handleSearch"
          >
            <el-option :label="$t('custmat.partnumber.statusEnabled')" :value="1" />
            <el-option :label="$t('custmat.partnumber.statusDisabled')" :value="0" />
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
            {{ $t('custmat.partnumber.import') }}
          </el-button>
          <el-button type="success" :loading="exportLoading" @click="handleExport">
            {{ $t('custmat.partnumber.export') }}
          </el-button>
          <el-button type="primary" style="margin-left: 24px" @click="handleAdd">
            {{ $t('custmat.partnumber.addPartNumber') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table
          :data="partNumberList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('custmat.partnumber.index')" width="70" align="center" fixed />
          <el-table-column prop="partNumber" :label="$t('custmat.partnumber.partNumber')" align="left" min-width="160" />
          <el-table-column prop="partNameCn" :label="$t('custmat.partnumber.partNameCn')" align="left" min-width="180" />
          <el-table-column prop="partTypeName" :label="$t('custmat.partnumber.partType')" align="left" min-width="140" />
          <el-table-column prop="categoryName" :label="$t('custmat.partnumber.category')" align="left" min-width="140" />
          <el-table-column prop="sourceTypeName" :label="$t('custmat.partnumber.sourceType')" align="left" min-width="140" />
          <el-table-column prop="baseUnit" :label="$t('custmat.partnumber.baseUnit')" align="left" min-width="100" />
          <el-table-column :label="$t('custmat.partnumber.status')" align="center" min-width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status ? 'success' : 'info'">
                {{ scope.row.status ? $t('custmat.partnumber.statusEnabled') : $t('custmat.partnumber.statusDisabled') }}
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
      :title="isEdit ? $t('custmat.partnumber.editPartNumber') : $t('custmat.partnumber.addPartNumber')"
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
          aria-label="料号编辑"
        >
          <div class="form-row">
            <el-form-item :label="$t('custmat.partnumber.partNumber')" prop="partNumber">
              <el-input v-model="form.partNumber" :placeholder="$t('custmat.partnumber.pleaseInputPartNumber')" style="width:100%" />
            </el-form-item>
            <el-form-item :label="$t('custmat.partnumber.partNameCn')" prop="partNameCn">
              <el-input v-model="form.partNameCn" :placeholder="$t('custmat.partnumber.pleaseInputPartNameCn')" style="width:100%" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.partnumber.partNameEn')" prop="partNameEn">
              <el-input v-model="form.partNameEn" :placeholder="$t('custmat.partnumber.pleaseInputPartNameEn')" style="width:100%" />
            </el-form-item>
            <el-form-item :label="$t('custmat.partnumber.specifications')" prop="specifications">
              <el-input v-model="form.specifications" :placeholder="$t('custmat.partnumber.pleaseInputSpecifications')" style="width:100%" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.partnumber.partType')" prop="partType">
              <el-select v-model="form.partType" :placeholder="$t('common.pleaseSelect')" style="width:100%">
                <el-option
                  v-for="item in partTypeOptions"
                  :key="item.partType"
                  :label="item.partTypeName"
                  :value="item.partType"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('custmat.partnumber.category')" prop="category">
              <el-select v-model="form.category" :placeholder="$t('common.pleaseSelect')" style="width:100%">
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.category"
                  :label="item.categoryName"
                  :value="item.category"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.partnumber.model')" prop="model">
              <el-input v-model="form.model" :placeholder="$t('custmat.partnumber.pleaseInputModel')" style="width:100%" />
            </el-form-item>
            <el-form-item :label="$t('custmat.partnumber.drawingNumber')" prop="drawingNumber">
              <el-input v-model="form.drawingNumber" :placeholder="$t('custmat.partnumber.pleaseInputDrawingNumber')" style="width:100%" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.partnumber.version')" prop="version">
              <el-input v-model="form.version" :placeholder="$t('custmat.partnumber.pleaseInputVersion')" style="width:100%" />
            </el-form-item>
            <el-form-item :label="$t('custmat.partnumber.material')" prop="material">
              <el-input v-model="form.material" :placeholder="$t('custmat.partnumber.pleaseInputMaterial')" style="width:100%" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.partnumber.baseUnit')" prop="baseUnit">
              <el-input v-model="form.baseUnit" :placeholder="$t('custmat.partnumber.pleaseInputBaseUnit')" style="width:100%" />
            </el-form-item>
            <el-form-item :label="$t('custmat.partnumber.sourceType')" prop="sourceType">
              <el-select v-model="form.sourceType" :placeholder="$t('common.pleaseSelect')" style="width:100%">
                <el-option
                  v-for="item in sourceTypeOptions"
                  :key="item.sourceType"
                  :label="item.sourceTypeName"
                  :value="item.sourceType"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.partnumber.manufacturer')" prop="manufacturer">
              <el-input v-model="form.manufacturer" :placeholder="$t('custmat.partnumber.pleaseInputManufacturer')" style="width:100%" />
            </el-form-item>
            <el-form-item :label="$t('custmat.partnumber.manufacturerPartNumber')" prop="manufacturerPartNumber">
              <el-input v-model="form.manufacturerPartNumber" :placeholder="$t('custmat.partnumber.pleaseInputManufacturerPartNumber')" style="width:100%" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.partnumber.lotControl')" prop="lotControl">
              <el-switch v-model="form.lotControl" />
            </el-form-item>
            <el-form-item :label="$t('custmat.partnumber.status')" prop="status">
              <el-switch v-model="form.status" />
            </el-form-item>
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('custmat.partnumber.remark')" prop="remark">
              <el-input
                v-model="form.remark"
                :placeholder="$t('custmat.partnumber.pleaseInputRemark')"
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

    <el-dialog
      v-model="importDialogVisible"
      :title="$t('custmat.partnumber.import')"
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
            {{ $t('custmat.partnumber.downloadTemplate') }}
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
          :file-list="importFileList"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            {{ $t('custmat.partnumber.dragFileHint') }}
          </div>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="importDialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" :loading="importLoading" :disabled="!importFile" @click="handleImportSubmit">
            {{ $t('custmat.partnumber.startImport') }}
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
  GET_PART_NUMBER_LIST_API,
  GET_PART_NUMBER_ENTITY_API,
  INSERT_PART_NUMBER_API,
  UPDATE_PART_NUMBER_API,
  DELETE_PART_NUMBER_API,
  GET_PART_TYPE_DROP_API,
  GET_CATEGORY_DROP_API,
  GET_SOURCE_TYPE_DROP_API,
  GET_PART_NUMBER_TEMPLATE_API,
  IMPORT_PART_NUMBER_API,
  GET_PART_NUMBER_EXCEL_API
} from '@/config/api/custmat/custmat-basicinfo/partnumber.js'
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
const partNumberList = ref([])
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

// 下拉选项
const partTypeOptions = ref([])
const categoryOptions = ref([])
const sourceTypeOptions = ref([])

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
  partNumberId: '',
  partNumber: '',
  partNameCn: '',
  partNameEn: null,
  specifications: null,
  partType: '',
  category: '',
  model: null,
  drawingNumber: null,
  version: null,
  material: null,
  baseUnit: '',
  sourceType: null,
  manufacturer: null,
  manufacturerPartNumber: null,
  lotControl: true,
  status: true,
  remark: null
})

// 表单验证规则
const rules = {
  partNumber: [
    { required: true, message: () => t('custmat.partnumber.pleaseInputPartNumber'), trigger: 'blur' }
  ],
  partNameCn: [
    { required: true, message: () => t('custmat.partnumber.pleaseInputPartNameCn'), trigger: 'blur' }
  ],
  partType: [
    { required: true, message: () => t('common.pleaseSelect'), trigger: 'change' }
  ],
  category: [
    { required: true, message: () => t('common.pleaseSelect'), trigger: 'change' }
  ],
  baseUnit: [
    { required: true, message: () => t('custmat.partnumber.pleaseInputBaseUnit'), trigger: 'blur' }
  ],
  sourceType: [
    { required: true, message: () => t('common.pleaseSelect'), trigger: 'change' }
  ]
}

// 获取料号类型下拉
const getPartTypeDrop = async () => {
  const response = await post(GET_PART_TYPE_DROP_API.GET_PART_TYPE_DROP)
  if (response.code === 200) {
    partTypeOptions.value = response.data || []
  }
}

// 获取物料分类下拉
const getCategoryDrop = async () => {
  const response = await post(GET_CATEGORY_DROP_API.GET_CATEGORY_DROP)
  if (response.code === 200) {
    categoryOptions.value = response.data || []
  }
}

// 获取来源类型下拉
const getSourceTypeDrop = async () => {
  const response = await post(GET_SOURCE_TYPE_DROP_API.GET_SOURCE_TYPE_DROP)
  if (response.code === 200) {
    sourceTypeOptions.value = response.data || []
  }
}

// 构建分页/导出共用的查询参数
const buildQueryParams = () => ({
  partNumber: searchForm.partNumber,
  status: searchForm.status === '' ? null : Number(searchForm.status),
  pageIndex: pagination.pageIndex,
  pageSize: pagination.pageSize,
  totalCount: pagination.totalCount
})

// 获取料号列表
const getPartNumberList = async () => {
  loading.value = true
  try {
    const params = buildQueryParams()

    const response = await post(GET_PART_NUMBER_LIST_API.GET_PART_NUMBER_LIST, params)

    if (isHandled(response)) {
      partNumberList.value = []
      return
    }

    if (response.code === 200) {
      partNumberList.value = response.data || []
      pagination.totalCount = response.totalCount || 0
    } else {
      ElMessage({
        message: response.message,
        type: Number(response.code) === 400 ? 'warning' : 'error',
        plain: true,
        showClose: true
      })
      partNumberList.value = []
    }
  } catch (error) {
    ElMessage({
      message: t('custmat.partnumber.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
    partNumberList.value = []
  } finally {
    loading.value = false
  }
}

// 使用通用防抖工具
const debouncedGetPartNumberList = debounce(() => {
  getPartNumberList()
}, PERFORMANCE_CONFIG.DEBOUNCE_DELAY)

// 处理搜索操作（带防抖）
const handleSearch = () => {
  pagination.pageIndex = 1
  loading.value = true
  debouncedGetPartNumberList()
}

// 重置搜索
const handleReset = () => {
  searchForm.partNumber = ''
  searchForm.status = ''
  loading.value = true
  pagination.pageIndex = 1
  getPartNumberList()
}

// 分页大小改变
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.pageIndex = 1
  getPartNumberList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  pagination.pageIndex = val
  getPartNumberList()
}

// 重置表单
const resetForm = () => {
  form.partNumberId = ''
  form.partNumber = ''
  form.partNameCn = ''
  form.partNameEn = null
  form.specifications = null
  form.partType = ''
  form.category = ''
  form.model = null
  form.drawingNumber = null
  form.version = null
  form.material = null
  form.baseUnit = ''
  form.sourceType = null
  form.manufacturer = null
  form.manufacturerPartNumber = null
  form.lotControl = true
  form.status = true
  form.remark = null
}

// 新增
const handleAdd = () => {
  resetForm()
  isEdit.value = false
  dialogVisible.value = true
  getPartTypeDrop()
  getCategoryDrop()
  getSourceTypeDrop()
  nextTick(() => {
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  })
}

// 编辑
const handleEdit = async (row) => {
  editingId.value = row.partNumberId
  dialogLoading.value = true
  dialogVisible.value = true
  isEdit.value = true
  getPartTypeDrop()
  getCategoryDrop()
  getSourceTypeDrop()

  try {
    const response = await post(
      GET_PART_NUMBER_ENTITY_API.GET_PART_NUMBER_ENTITY,
      new URLSearchParams({ partNumberId: String(row.partNumberId) }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    if (isHandled(response)) {
      dialogVisible.value = false
      return
    }

    if (response.code === 200) {
      const data = response.data
      form.partNumberId = data.partNumberId
      form.partNumber = data.partNumber
      form.partNameCn = data.partNameCn
      form.partNameEn = data.partNameEn
      form.specifications = data.specifications
      form.partType = data.partType
      form.category = data.category
      form.model = data.model
      form.drawingNumber = data.drawingNumber
      form.version = data.version
      form.material = data.material
      form.baseUnit = data.baseUnit
      form.sourceType = data.sourceType
      form.manufacturer = data.manufacturer
      form.manufacturerPartNumber = data.manufacturerPartNumber
      form.lotControl = data.lotControl
      form.status = data.status
      form.remark = data.remark
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
      message: t('custmat.partnumber.getFailed'),
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
      t('custmat.partnumber.deleteConfirm'),
      t('common.tip'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    deletingId.value = row.partNumberId

    const response = await post(
      DELETE_PART_NUMBER_API.DELETE_PART_NUMBER,
      new URLSearchParams({ partNumberId: String(row.partNumberId) }),
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
      getPartNumberList()
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
        message: t('custmat.partnumber.operationFailed'),
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
      partNumberId: form.partNumberId,
      partNumber: form.partNumber,
      partNameCn: form.partNameCn,
      partNameEn: form.partNameEn,
      specifications: form.specifications,
      partType: form.partType,
      category: form.category,
      model: form.model,
      drawingNumber: form.drawingNumber,
      version: form.version,
      material: form.material,
      baseUnit: form.baseUnit,
      sourceType: form.sourceType,
      manufacturer: form.manufacturer,
      manufacturerPartNumber: form.manufacturerPartNumber,
      lotControl: form.lotControl,
      status: form.status,
      remark: form.remark
    }

    const api = isEdit.value ? UPDATE_PART_NUMBER_API.UPDATE_PART_NUMBER : INSERT_PART_NUMBER_API.INSERT_PART_NUMBER
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
      getPartNumberList()
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
         message: t('custmat.partnumber.operationFailed'),
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

// 下载导入模板（文件名由前端拼接，中英文用空格分隔）
const handleDownloadTemplate = async () => {
  templateLoading.value = true
  try {
    const response = await postBlob(GET_PART_NUMBER_TEMPLATE_API.GET_PART_NUMBER_TEMPLATE)
    const blob = response.data

    if (!(blob instanceof Blob) || blob.size === 0) {
      throw new Error(t('custmat.partnumber.downloadTemplateFailed'))
    }

    if (blob.type && blob.type.includes('application/json')) {
      const text = await blob.text()
      let message = t('custmat.partnumber.downloadTemplateFailed')
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
    link.download = '料号导入模板 PartNumberTemplate.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    ElMessage({
      message: error?.message || t('custmat.partnumber.downloadTemplateFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
  } finally {
    templateLoading.value = false
  }
}

// 导出料号Excel（查询条件与分页列表一致，文件名由前端拼接）
const handleExport = async () => {
  exportLoading.value = true
  try {
    const response = await postBlob(GET_PART_NUMBER_EXCEL_API.GET_PART_NUMBER_EXCEL, buildQueryParams())
    const blob = response.data

    if (!(blob instanceof Blob) || blob.size === 0) {
      throw new Error(t('custmat.partnumber.exportFailed'))
    }

    if (blob.type && blob.type.includes('application/json')) {
      const text = await blob.text()
      let message = t('custmat.partnumber.exportFailed')
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
    link.download = `料号信息 PartNumber_${Date.now()}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    ElMessage({
      message: error?.message || t('custmat.partnumber.exportFailed'),
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
      message: t('custmat.partnumber.fileChangedError'),
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

    const response = await post(IMPORT_PART_NUMBER_API.IMPORT_PART_NUMBER, formData)

    if (isHandled(response)) return

    if (response.code === 200) {
      ElMessage({
        message: response.message || t('common.success'),
        type: 'success',
        plain: true,
        showClose: true
      })
      importDialogVisible.value = false
      getPartNumberList()
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
      message: t('custmat.partnumber.operationFailed'),
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
  getPartNumberList()
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
