<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <!-- 过滤条件 -->
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('systembasicmgmt.dictionaryInfo.ariaFilterLabel')">
        <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.filter.module')">
          <el-select v-model="filters.moduleId"
                     style="width: 220px"
                     :placeholder="$t('systembasicmgmt.dictionaryInfo.pleaseSelectModule')"
                     :clearable="false"
                     @change="handleModuleChange">
            <el-option v-for="item in moduleOptions"
                       :key="item.moduleId"
                       :label="item.moduleName"
                       :value="item.moduleId"
                       :disabled="item.disabled" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.filter.dicType')">
          <el-select v-model="filters.dicType"
                     style="width: 220px"
                     :placeholder="$t('systembasicmgmt.dictionaryInfo.pleaseSelectDicType')"
                     :clearable="false"
                     @change="handleDicTypeChange">
            <el-option v-for="item in dicTypeOptions"
                       :key="item.dicTypeCode"
                       :label="item.dicTypeName"
                       :value="item.dicTypeCode" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.filter.dicNameCn')">
          <el-input v-model="filters.dicName"
                    style="width: 220px"
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
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('systembasicmgmt.dictionaryInfo.index')" width="70" align="center" fixed />
          <el-table-column prop="dicType" :label="$t('systembasicmgmt.dictionaryInfo.dicType')" align="center" min-width="200" />
          <el-table-column prop="dicCode" :label="$t('systembasicmgmt.dictionaryInfo.dicCode')" align="left" min-width="180" />
          <el-table-column prop="dicNameCn" :label="$t('systembasicmgmt.dictionaryInfo.dicNameCn')" align="left" min-width="230" />
          <el-table-column prop="dicNameEn" :label="$t('systembasicmgmt.dictionaryInfo.dicNameEn')" align="left" min-width="230" />
          <el-table-column prop="sortOrder" :label="$t('systembasicmgmt.dictionaryInfo.sortOrder')" align="center" min-width="120" />
          <el-table-column :label="$t('systembasicmgmt.dictionaryInfo.operation')" min-width="130" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">{{ $t('common.edit') }}</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">{{ $t('common.delete') }}</el-button>
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
               :title="dialogTitle"
               width="50%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :lock-scroll="true"
               @close="handleDialogClose">
      <el-form :inline="true"
               :model="editForm"
               :rules="formRules"
               ref="editFormRef"
               label-width="100px"
               class="dialog-form"
               role="form"
               :aria-label="$t('systembasicmgmt.dictionaryInfo.ariaEditLabel')">
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.module')" prop="moduleId">
            <el-select v-model="editForm.moduleId"
                       style="width:100%"
                       :placeholder="$t('systembasicmgmt.dictionaryInfo.pleaseSelectModule')"
                       :clearable="false">
              <el-option v-for="item in moduleOptions"
                         :key="item.moduleId"
                         :label="item.moduleName"
                         :value="item.moduleId" />
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
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave" :loading="submitLoading">{{ $t('common.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()

const DEBOUNCE_MS = 300
let searchTimer = null

const dictionaryList = ref([])
const loading = ref(false)
const submitLoading = ref(false)
const moduleOptions = ref([])
const dicTypeOptions = ref([])
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
    { required: true, message: () => t('systembasicmgmt.dictionaryInfo.pleaseSelectModule'), trigger: 'change' }
  ],
  dicType: [
    { required: true, message: () => t('systembasicmgmt.dictionaryInfo.pleaseInputDicType'), trigger: 'blur' }
  ],
  dicCode: [
    { required: true, message: () => t('systembasicmgmt.dictionaryInfo.pleaseInputDicCode'), trigger: 'blur' }
  ],
  dicNameCn: [
    { required: true, message: () => t('systembasicmgmt.dictionaryInfo.pleaseInputDicNameCn'), trigger: 'blur' }
  ],
  dicNameEn: [
    { required: true, message: () => t('systembasicmgmt.dictionaryInfo.pleaseInputDicNameEn'), trigger: 'blur' }
  ],
  sortOrder: [
    { required: true, message: () => t('systembasicmgmt.dictionaryInfo.pleaseInputSortOrder'), trigger: 'blur' },
    { type: 'number', message: () => t('systembasicmgmt.dictionaryInfo.pleaseInputSortOrder'), trigger: 'blur' }
  ]
}

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const fetchModuleDropdown = async () => {
  try {
    const res = await post(GET_MODULE_DROP_DOWN_API.GET_MODULE_DROP_DOWN)
    if (res?.code === 200) {
      moduleOptions.value = res.data || []
      if (moduleOptions.value.length > 0 && !filters.moduleId) {
        filters.moduleId = moduleOptions.value[0].moduleId
      }
    } else {
      showMessage(res?.message || t('systembasicmgmt.dictionaryInfo.getModuleDropdownFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
    }
  } catch {
    showMessage(t('systembasicmgmt.dictionaryInfo.getModuleDropdownFailed'))
  }
}

const fetchDicTypeDropdown = async () => {
  try {
    const formData = new FormData()
    formData.append('moduleId', String(filters.moduleId || ''))
    const res = await post(GET_DIC_TYPE_DROP_DOWN_API.GET_DIC_TYPE_DROP_DOWN, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    if (res?.code === 200) {
      dicTypeOptions.value = res.data || []
      if (dicTypeOptions.value.length > 0 && !filters.dicType) {
        filters.dicType = dicTypeOptions.value[0].dicTypeCode
      }
    } else {
      showMessage(res?.message || t('systembasicmgmt.dictionaryInfo.getDicTypeDropdownFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
    }
  } catch {
    showMessage(t('systembasicmgmt.dictionaryInfo.getDicTypeDropdownFailed'))
  }
}

const fetchDictionaryPages = async () => {
  loading.value = true
  try {
    const res = await post(GET_DICTIONARY_PAGES_API.GET_DICTIONARY_PAGES, {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      moduleId: filters.moduleId || '',
      dicType: filters.dicType || '',
      dicName: filters.dicName || ''
    })
    if (res?.code === 200) {
      dictionaryList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      showMessage(res?.message || t('systembasicmgmt.dictionaryInfo.getDictionaryPagesFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
    }
  } catch {
    showMessage(t('systembasicmgmt.dictionaryInfo.getDictionaryPagesFailed'))
  } finally {
    loading.value = false
  }
}

const fetchDictionaryEntity = async (dicId) => {
  try {
    const res = await post(GET_DICTIONARY_ENTITY_API.GET_DICTIONARY_ENTITY, { dicId })
    if (res?.code === 200) {
      return res.data
    }
    showMessage(res?.message || t('systembasicmgmt.dictionaryInfo.getDictionaryEntityFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
    return null
  } catch {
    showMessage(t('systembasicmgmt.dictionaryInfo.getDictionaryEntityFailed'))
    return null
  }
}

const buildSubmitParams = () => ({
  moduleId: editForm.moduleId,
  dicType: (editForm.dicType || '').trim(),
  dicCode: String(editForm.dicCode ?? '').trim(),
  dicNameCn: (editForm.dicNameCn || '').trim(),
  dicNameEn: (editForm.dicNameEn || '').trim(),
  sortOrder: Number(editForm.sortOrder)
})

const insertDictionary = async () => {
  submitLoading.value = true
  const res = await post(INSERT_DICTIONARY_API.INSERT_DICTIONARY, buildSubmitParams())
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    dialogVisible.value = false
    fetchDictionaryPages()
  } else {
    showMessage(res?.message, Number(res?.code) === 400 ? 'warning' : 'error')
  }
  submitLoading.value = false
}

const updateDictionary = async () => {
  submitLoading.value = true
  const res = await post(UPDATE_DICTIONARY_API.UPDATE_DICTIONARY, { dicId: editForm.dicId, ...buildSubmitParams() })
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    dialogVisible.value = false
    fetchDictionaryPages()
  } else {
    showMessage(res?.message || t('systembasicmgmt.dictionaryInfo.updateDictionaryFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
  }
  submitLoading.value = false
}

const deleteDictionary = async (dicId) => {
  const res = await post(DELETE_DICTIONARY_API.DELETE_DICTIONARY, { dicId })
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    // 删除的是当前页最后一条时回到上一页，避免停留在空页
    if (dictionaryList.value.length === 1 && pagination.pageIndex > 1) {
      pagination.pageIndex--
    }
    fetchDictionaryPages()
  } else {
    showMessage(res?.message || t('systembasicmgmt.dictionaryInfo.deleteDictionaryFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
  }
}

const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchDictionaryPages()
  }, DEBOUNCE_MS)
}

const resetEditForm = () => {
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

const handleSearch = () => scheduleSearch()

const handleReset = async () => {
  loading.value = true
  filters.dicName = ''
  filters.moduleId = moduleOptions.value.length > 0 ? moduleOptions.value[0].moduleId : ''
  filters.dicType = ''
  await fetchDicTypeDropdown()
  scheduleSearch()
}

const handleModuleChange = async () => {
  loading.value = true
  filters.dicType = ''
  await fetchDicTypeDropdown()
  scheduleSearch()
}

const handleDicTypeChange = () => scheduleSearch()

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchDictionaryPages()
}

const handlePageChange = () => {
  fetchDictionaryPages()
}

const handleAdd = () => {
  resetEditForm()
  dialogTitle.value = t('systembasicmgmt.dictionaryInfo.addDictionary')
  dialogVisible.value = true
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleEdit = async (row) => {
  resetEditForm()
  const dictionaryData = await fetchDictionaryEntity(row.dicId)
  if (!dictionaryData) return
  Object.assign(editForm, {
    ...dictionaryData,
    moduleId: String(dictionaryData.moduleId || ''),
    dicCode: String(dictionaryData.dicCode ?? '')
  })
  dialogTitle.value = t('systembasicmgmt.dictionaryInfo.editDictionary')
  dialogVisible.value = true
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.dictionaryInfo.deleteConfirm', { dicCode: row.dicCode }),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
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
  resetEditForm()
  editFormRef.value?.clearValidate()
}

onMounted(async () => {
  await fetchModuleDropdown()
  await fetchDicTypeDropdown()
  fetchDictionaryPages()
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
