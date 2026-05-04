<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">

      <!-- 过滤条件 -->
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="字典搜索表单">
        <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.filter.module')">
          <el-select v-model="filters.moduleId"
                    style="width: 180px;"
                    :placeholder="$t('systembasicmgmt.dictionaryInfo.pleaseSelectModule')"
                    @change="handleModuleChange"
                    :clearable="false">
            <el-option
                v-for="module in moduleList"
                :key="module.moduleId"
                :label="module.moduleName"
                :value="module.moduleId"
                :disabled="module.disabled" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.filter.dicType')">
          <el-select v-model="filters.dicType"
                    style="width: 180px;"
                    :placeholder="$t('systembasicmgmt.dictionaryInfo.pleaseSelectDicType')"
                    :clearable="false"
                    @change="handleDicTypeChange">
            <el-option
                v-for="dicType in dicTypeList"
                :key="dicType.dicTypeCode"
                :label="dicType.dicTypeName"
                :value="dicType.dicTypeCode" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.filter.dicNameCn')">
          <el-input v-model="filters.dicName"
                   style="width: 180px;"
                   :placeholder="$t('systembasicmgmt.dictionaryInfo.pleaseInputDicNameCn')"
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
            {{ $t('systembasicmgmt.dictionaryInfo.addDictionary') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table :data="dictionaryList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table">
          <el-table-column type="index" :label="$t('systembasicmgmt.dictionaryInfo.index')" width="70" align="center" fixed />
          <el-table-column prop="dicType" :label="$t('systembasicmgmt.dictionaryInfo.dicType')" align="center" min-width="200" />
          <el-table-column prop="dicCode" :label="$t('systembasicmgmt.dictionaryInfo.dicCode')" align="left" min-width="180" />
          <el-table-column prop="dicNameCn" :label="$t('systembasicmgmt.dictionaryInfo.dicNameCn')" align="left" min-width="230" />
          <el-table-column prop="dicNameEn" :label="$t('systembasicmgmt.dictionaryInfo.dicNameEn')" align="left" min-width="230" />
          <el-table-column prop="sortOrder" :label="$t('systembasicmgmt.dictionaryInfo.sortOrder')" align="center" min-width="120" />
          <el-table-column :label="$t('systembasicmgmt.dictionaryInfo.operation')" min-width="130" fixed="right" align="center">
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

    <!-- 编辑状态对话框 -->
    <el-dialog v-model="dialogVisible"
               :title="dialogTitle"
               width="50%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :lock-scroll="true"
               @close="handleDialogClose">
      <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px" class="dialog-form" role="form" aria-label="字典编辑表单">
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.module')" prop="moduleId">
            <el-select v-model="editForm.moduleId"
                      style="width:100%"
                      :placeholder="$t('systembasicmgmt.dictionaryInfo.pleaseSelectModule')"
                      :clearable="false">
              <el-option
                  v-for="module in moduleList"
                  :key="module.moduleId"
                  :label="module.moduleName"
                  :value="module.moduleId" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.dicType')" prop="dicType">
            <el-input v-model="editForm.dicType"
                     style="width:100%"
                     :placeholder="$t('systembasicmgmt.dictionaryInfo.pleaseInputDicType')" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.dicCode')" prop="dicCode">
            <el-input v-model="editForm.dicCode"
                     style="width:100%"
                     :placeholder="$t('systembasicmgmt.dictionaryInfo.pleaseInputDicCode')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.dicNameCn')" prop="dicNameCn">
            <el-input v-model="editForm.dicNameCn"
                     style="width:100%"
                     :placeholder="$t('systembasicmgmt.dictionaryInfo.pleaseInputDicNameCn')" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.dicNameEn')" prop="dicNameEn">
            <el-input v-model="editForm.dicNameEn"
                     style="width:100%"
                     :placeholder="$t('systembasicmgmt.dictionaryInfo.pleaseInputDicNameEn')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.sortOrder')" prop="sortOrder">
            <el-input-number v-model="editForm.sortOrder"
                           :step="1"
                           style="width:100%"
                           :placeholder="$t('systembasicmgmt.dictionaryInfo.pleaseInputSortOrder')" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="handleCancel">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave" :loading="submitLoading">{{ $t('common.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { post } from '@/utils/request'
import {
  GET_DICTIONARY_PAGES_API,
  INSERT_DICTIONARY_API,
  DELETE_DICTIONARY_API,
  GET_DICTIONARY_ENTITY_API,
  UPDATE_DICTIONARY_API,
  GET_MODULE_DROP_DOWN_API,
  GET_DIC_TYPE_DROP_DOWN_API
} from '@/config/api/systembasicmgmt/system-config/dictionary'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const DEBOUNCE_MS = 300
let searchTimer = null

const dictionaryList = ref([])
const loading = ref(false)
const submitLoading = ref(false)
const moduleList = ref([])
const dicTypeList = ref([])
const editFormRef = ref(null)

const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
  totalCount: 0
})

const filters = reactive({
  moduleId: '',
  dicType: '',
  dicName: ''
})

const dialogVisible = ref(false)
const dialogTitle = ref(t('systembasicmgmt.dictionaryInfo.editDictionary'))

const editForm = reactive({
  dicId: '',
  moduleId: '',
  dicType: '',
  dicCode: '',
  dicNameCn: '',
  dicNameEn: '',
  sortOrder: 0
})

const formRules = {
  moduleId: [
    { required: true, message: t('systembasicmgmt.dictionaryInfo.pleaseSelectModule'), trigger: 'change' }
  ],
  dicType: [
    { required: true, message: t('systembasicmgmt.dictionaryInfo.pleaseInputDicType'), trigger: 'blur' }
  ],
  dicCode: [
    { required: true, message: t('systembasicmgmt.dictionaryInfo.pleaseInputDicCode'), trigger: 'blur' }
  ],
  dicNameCn: [
    { required: true, message: t('systembasicmgmt.dictionaryInfo.pleaseInputDicNameCn'), trigger: 'blur' }
  ],
  dicNameEn: [
    { required: true, message: t('systembasicmgmt.dictionaryInfo.pleaseInputDicNameEn'), trigger: 'blur' }
  ],
  sortOrder: [
    { required: true, message: t('systembasicmgmt.dictionaryInfo.pleaseInputSortOrder'), trigger: 'blur' },
    { type: 'number', message: t('systembasicmgmt.dictionaryInfo.pleaseInputSortOrder'), trigger: 'blur' }
  ]
}

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const scheduleSearch = () => {
  pagination.pageIndex = 1
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => fetchDictionaryPages(), DEBOUNCE_MS)
}

onMounted(async () => {
  await fetchModuleDropDown()
  await fetchDicTypeDropDown()
  fetchDictionaryPages()
})

const fetchModuleDropDown = async () => {
  try {
    const res = await post(GET_MODULE_DROP_DOWN_API.GET_MODULE_DROP_DOWN)
    if (res && res.code === 200) {
      moduleList.value = res.data || []
      if (moduleList.value.length > 0 && !filters.moduleId) {
        filters.moduleId = moduleList.value[0].moduleId
      }
    } else {
      showMessage(res?.message || t('systembasicmgmt.dictionaryInfo.getModuleDropDownFailed'))
    }
  } catch {
    showMessage(t('systembasicmgmt.dictionaryInfo.getModuleDropDownFailed'))
  }
}

const fetchDicTypeDropDown = async () => {
  try {
    const formData = new FormData()
    formData.append('moduleId', String(filters.moduleId || ''))
    const res = await post(GET_DIC_TYPE_DROP_DOWN_API.GET_DIC_TYPE_DROP_DOWN, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    if (res && res.code === 200) {
      dicTypeList.value = res.data || []
      if (dicTypeList.value.length > 0 && !filters.dicType) {
        filters.dicType = dicTypeList.value[0].dicTypeCode
      }
    } else {
      showMessage(res?.message || t('systembasicmgmt.dictionaryInfo.getDicTypeDropDownFailed'))
    }
  } catch {
    showMessage(t('systembasicmgmt.dictionaryInfo.getDicTypeDropDownFailed'))
  }
}

const fetchDictionaryEntity = async (dicId) => {
  try {
    const res = await post(GET_DICTIONARY_ENTITY_API.GET_DICTIONARY_ENTITY, { dicId })
    if (res && res.code === 200) {
      return res.data
    }
    showMessage(res?.message || t('systembasicmgmt.dictionaryInfo.getDictionaryEntityFailed'))
    return null
  } catch {
    showMessage(t('systembasicmgmt.dictionaryInfo.getDictionaryEntityFailed'))
    return null
  }
}

const fetchDictionaryPages = async () => {
  try {
    loading.value = true
    const params = {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      moduleId: filters.moduleId || '',
      dicType: filters.dicType || '',
      dicName: filters.dicName || ''
    }
    const res = await post(GET_DICTIONARY_PAGES_API.GET_DICTIONARY_PAGES, params)
    if (res && res.code === 200) {
      dictionaryList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      showMessage(res?.message || t('systembasicmgmt.dictionaryInfo.getDictionaryPagesFailed'))
    }
  } catch {
    showMessage(t('systembasicmgmt.dictionaryInfo.getDictionaryPagesFailed'))
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  scheduleSearch()
}

const handleReset = async () => {
  filters.dicName = ''
  filters.moduleId = moduleList.value.length > 0 ? moduleList.value[0].moduleId : ''
  filters.dicType = ''
  await fetchDicTypeDropDown()
  scheduleSearch()
}

const handleModuleChange = async () => {
  filters.dicType = ''
  await fetchDicTypeDropDown()
  scheduleSearch()
}

const handleDicTypeChange = () => {
  scheduleSearch()
}

const handlePageChange = () => {
  fetchDictionaryPages()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchDictionaryPages()
}

const resetForm = () => {
  Object.assign(editForm, {
    dicId: '',
    moduleId: '',
    dicType: '',
    dicCode: '',
    dicNameCn: '',
    dicNameEn: '',
    sortOrder: 0
  })
}

const insertDictionary = async () => {
  submitLoading.value = true
  const params = {
    moduleId: editForm.moduleId,
    dicType: (editForm.dicType || '').trim(),
    dicCode: String(editForm.dicCode ?? '').trim(),
    dicNameCn: (editForm.dicNameCn || '').trim(),
    dicNameEn: (editForm.dicNameEn || '').trim(),
    sortOrder: Number(editForm.sortOrder)
  }
  const res = await post(INSERT_DICTIONARY_API.INSERT_DICTIONARY, params)
  if (res && res.code === 200) {
    showMessage(res.message, 'success')
    dialogVisible.value = false
    fetchDictionaryPages()
  } else {
    showMessage(res?.message)
  }
  submitLoading.value = false
}

const updateDictionary = async () => {
  submitLoading.value = true
  const params = {
    dicId: editForm.dicId,
    moduleId: editForm.moduleId,
    dicType: (editForm.dicType || '').trim(),
    dicCode: String(editForm.dicCode ?? '').trim(),
    dicNameCn: (editForm.dicNameCn || '').trim(),
    dicNameEn: (editForm.dicNameEn || '').trim(),
    sortOrder: Number(editForm.sortOrder)
  }
  const res = await post(UPDATE_DICTIONARY_API.UPDATE_DICTIONARY, params)
  if (res && res.code === 200) {
    showMessage(res.message, 'success')
    dialogVisible.value = false
    fetchDictionaryPages()
  } else {
    showMessage(res?.message || t('systembasicmgmt.dictionaryInfo.updateDictionaryFailed'))
  }
  submitLoading.value = false
}

const deleteDictionary = async (dicId) => {
  const res = await post(DELETE_DICTIONARY_API.DELETE_DICTIONARY, { dicId })
  if (res && res.code === 200) {
    showMessage(res.message, 'success')
    if (dictionaryList.value.length === 1 && pagination.pageIndex > 1) {
      pagination.pageIndex--
    }
    fetchDictionaryPages()
  } else {
    showMessage(res?.message || t('systembasicmgmt.dictionaryInfo.deleteDictionaryFailed'))
  }
}

const handleAdd = () => {
  resetForm()
  dialogTitle.value = t('systembasicmgmt.dictionaryInfo.addDictionary')
  dialogVisible.value = true
}

const handleEdit = async (index, row) => {
  resetForm()
  const dictionaryData = await fetchDictionaryEntity(row.dicId)
  if (dictionaryData) {
    Object.assign(editForm, {
      ...dictionaryData,
      moduleId: String(dictionaryData.moduleId || ''),
      dicCode: String(dictionaryData.dicCode ?? '')
    })
    dialogTitle.value = t('systembasicmgmt.dictionaryInfo.editDictionary')
    dialogVisible.value = true
    nextTick(() => {
      editFormRef.value?.clearValidate()
    })
  }
}

const handleCancel = () => {
  dialogVisible.value = false
}

const handleDelete = async (index, row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.dictionaryInfo.deleteConfirm', { dicCode: row.dicCode }),
      t('common.tip'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
  } catch {
    return
  }
  deleteDictionary(row.dicId)
}

const handleSave = async () => {
  const valid = await editFormRef.value?.validate().catch(() => false)
  if (!valid) return
  if (editForm.dicId) {
    updateDictionary()
  } else {
    insertDictionary()
  }
}

const handleDialogClose = () => {
  resetForm()
  editFormRef.value?.clearValidate()
}
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
