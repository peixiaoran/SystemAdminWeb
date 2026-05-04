<template>
<div class="conventional-table-container">
  <el-card class="conventional-card">
    <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="国籍信息">
      <el-form-item :label="$t('systembasicmgmt.nationalityInfo.filter.nationalityName')">
        <el-input style="width: 180px;"
                  v-model="filters.nationalityName"
                  :placeholder="$t('systembasicmgmt.nationalityInfo.pleaseInputName')" />
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
          {{ $t('systembasicmgmt.nationalityInfo.addNationality') }}
        </el-button>
      </el-form-item>
    </el-form>

    <div class="table-container">
      <el-table :data="nationalityList"
                border
                stripe
                :header-cell-style="{ background: '#f5f7fa' }"
                v-loading="loading"
                class="conventional-table">
        <el-table-column type="index" :label="$t('systembasicmgmt.nationalityInfo.index')" width="70" align="center" fixed />
        <el-table-column prop="nationNameCn" :label="$t('systembasicmgmt.nationalityInfo.nationNameCn')" align="left" min-width="240" />
        <el-table-column prop="nationNameEn" :label="$t('systembasicmgmt.nationalityInfo.nationNameEn')" align="left" min-width="360" />
        <el-table-column prop="remark" :label="$t('systembasicmgmt.nationalityInfo.remark')" align="left" min-width="450" />
        <el-table-column :label="$t('systembasicmgmt.nationalityInfo.operation')" min-width="150" fixed="right" align="center">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">{{ $t('common.edit') }}</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">{{ $t('common.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-wrapper">
      <el-pagination v-model:current-page="pagination.pageIndex"
                     v-model:page-size="pagination.pageSize"
                     :page-sizes="[10, 20, 50, 100]"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="pagination.totalCount"
                     @size-change="handleSizeChange"
                     @current-change="handlePageChange"/>
    </div>
  </el-card>

  <el-dialog v-model="dialogVisible"
             :title="dialogTitle"
             width="50%"
             :close-on-click-modal="false"
             :append-to-body="true"
             :lock-scroll="true"
             @close="handleDialogClose">
    <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="120px" class="dialog-form" role="form" aria-label="编辑国籍信息">
      <div class="form-row">
        <el-form-item :label="$t('systembasicmgmt.nationalityInfo.nationNameCn')" prop="nationNameCn">
          <el-input v-model="editForm.nationNameCn" :placeholder="$t('systembasicmgmt.nationalityInfo.pleaseInputNameCn')" style="width:100%" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.nationalityInfo.nationNameEn')" prop="nationNameEn">
          <el-input v-model="editForm.nationNameEn" :placeholder="$t('systembasicmgmt.nationalityInfo.pleaseInputNameEn')" style="width:100%" />
        </el-form-item>
      </div>
      <div class="form-row full-width">
        <el-form-item :label="$t('systembasicmgmt.nationalityInfo.remark')">
          <el-input v-model="editForm.remark" style="width:100%" type="textarea" :rows="3" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleSave" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { post } from '@/utils/request'
import {
  GET_NATIONALITY_LIST_API,
  INSERT_NATIONALITY_API,
  DELETE_NATIONALITY_API,
  GET_NATIONALITY_ENTITY_API,
  UPDATE_NATIONALITY_API
} from '@/config/api/systembasicmgmt/system-basicdata/nationality'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const DEBOUNCE_MS = 300

const { t } = useI18n()

const nationalityList = ref([])
const loading = ref(false)
const submitLoading = ref(false)
const editFormRef = ref(null)

const filters = reactive({
  nationalityName: ''
})

const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0
})

const dialogVisible = ref(false)
const dialogTitle = ref('')

const editForm = reactive({
  nationId: '',
  nationNameCn: '',
  nationNameEn: '',
  remark: ''
})

const formRules = {
  nationNameCn: [
    { required: true, message: () => t('systembasicmgmt.nationalityInfo.pleaseInputNameCn'), trigger: 'blur' }
  ],
  nationNameEn: [
    { required: true, message: () => t('systembasicmgmt.nationalityInfo.pleaseInputNameEn'), trigger: 'blur' }
  ]
}

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const fetchNationalityList = async () => {
  loading.value = true
  const res = await post(GET_NATIONALITY_LIST_API.GET_NATIONALITY_LIST, {})
  if (res?.code === 200) {
    nationalityList.value = res.data || []
    pagination.totalCount = res.totalCount || 0
  } else if (res) {
    showMessage(res.message)
  }
  loading.value = false
}

let searchTimer = null
const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchNationalityList()
  }, DEBOUNCE_MS)
}

const handleSearch = () => scheduleSearch()

const handleReset = () => {
  filters.nationalityName = ''
  scheduleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchNationalityList()
}

const handlePageChange = () => {
  fetchNationalityList()
}

const fetchNationalityEntity = async (nationId) => {
  const formData = new FormData()
  formData.append('nationId', nationId)
  const res = await post(GET_NATIONALITY_ENTITY_API.GET_NATIONALITY_ENTITY, formData)
  if (res?.code === 200) {
    Object.assign(editForm, res.data)
  }
}

const resetEditForm = () => {
  Object.assign(editForm, { nationId: '', nationNameCn: '', nationNameEn: '', remark: '' })
}

const handleAdd = () => {
  resetEditForm()
  dialogTitle.value = t('systembasicmgmt.nationalityInfo.addNationality')
  dialogVisible.value = true
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleEdit = async (index, row) => {
  resetEditForm()
  await fetchNationalityEntity(row.nationId)
  dialogTitle.value = t('systembasicmgmt.nationalityInfo.editNationality')
  dialogVisible.value = true
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleDelete = async (index, row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.nationalityInfo.deleteConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  const formData = new FormData()
  formData.append('nationId', row.nationId)
  const res = await post(DELETE_NATIONALITY_API.DELETE_NATIONALITY, formData)
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    fetchNationalityList()
  } else {
    showMessage(res?.message)
  }
}

const handleSave = async () => {
  const valid = await editFormRef.value?.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  const api = editForm.nationId
    ? UPDATE_NATIONALITY_API.UPDATE_NATIONALITY
    : INSERT_NATIONALITY_API.INSERT_NATIONALITY
  const res = await post(api, { ...editForm })
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    dialogVisible.value = false
    fetchNationalityList()
  } else {
    showMessage(res?.message)
  }
  submitLoading.value = false
}

const handleDialogClose = () => {
  resetEditForm()
  editFormRef.value?.clearValidate()
}

onMounted(() => {
  fetchNationalityList()
})
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style>
