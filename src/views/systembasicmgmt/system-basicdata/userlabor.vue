<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('systembasicmgmt.userLabor.searchFormLabel')">
        <el-form-item :label="$t('systembasicmgmt.userLabor.laborName')">
          <el-input v-model="filters.laborName"
                    style="width: 220px"
                    :placeholder="$t('systembasicmgmt.userLabor.pleaseInputLaborName')" />
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
            {{ $t('systembasicmgmt.userLabor.addLabor') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table :data="laborList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('systembasicmgmt.userLabor.index')" width="70" align="center" fixed />
          <el-table-column prop="laborNameCn" :label="$t('systembasicmgmt.userLabor.laborNameCn')" align="left" min-width="100" />
          <el-table-column prop="laborNameEn" :label="$t('systembasicmgmt.userLabor.laborNameEn')" align="left" min-width="200" />
          <el-table-column prop="description" :label="$t('systembasicmgmt.userLabor.description')" align="left" min-width="300">
            <template #default="scope">
              <el-tooltip v-if="scope.row.description"
                          :content="scope.row.description"
                          placement="top"
                          effect="dark"
                          popper-class="fixed-width-tooltip">
                <span class="ellipsis-cell">{{ scope.row.description }}</span>
              </el-tooltip>
              <span v-else class="ellipsis-cell">-</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.operation')" min-width="100" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">{{ $t('common.edit') }}</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">{{ $t('common.delete') }}</el-button>
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
                       @current-change="handlePageChange" />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible"
               :title="isEdit ? $t('systembasicmgmt.userLabor.editLabor') : $t('systembasicmgmt.userLabor.addLabor')"
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
                 label-width="100px"
                 class="dialog-form"
                 role="form"
                 :aria-label="$t('systembasicmgmt.userLabor.editFormLabel')">
          <div class="form-row">
            <el-form-item :label="$t('systembasicmgmt.userLabor.laborNameCn')" prop="laborNameCn">
              <el-input v-model="editForm.laborNameCn"
                        style="width:100%"
                        :placeholder="$t('systembasicmgmt.userLabor.pleaseInputLaborNameCn')" />
            </el-form-item>
            <el-form-item :label="$t('systembasicmgmt.userLabor.laborNameEn')" prop="laborNameEn">
              <el-input v-model="editForm.laborNameEn"
                        style="width:100%"
                        :placeholder="$t('systembasicmgmt.userLabor.pleaseInputLaborNameEn')" />
            </el-form-item>
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('systembasicmgmt.userLabor.description')" prop="description">
              <el-input v-model="editForm.description"
                        style="width:100%"
                        type="textarea"
                        :rows="3"
                        :placeholder="$t('systembasicmgmt.userLabor.pleaseInputDescription')" />
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
import { post } from '@/utils/request'
import {
  GET_USERLABOR_LIST_API,
  GET_USER_LABOR_ENTITY_API,
  INSERT_USER_LABOR_API,
  UPDATE_USER_LABOR_API,
  DELETE_USER_LABOR_API
} from '@/config/api/systembasicmgmt/system-basicdata/userlabor'

const { t } = useI18n()

const DEBOUNCE_MS = 300
let searchTimer = null

const laborList = ref([])
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
  laborName: ''
})

const dialogVisible = ref(false)
const isEdit = ref(false)

const editForm = reactive({
  laborId: '',
  laborNameCn: '',
  laborNameEn: '',
  description: ''
})

const formRules = {
  laborNameCn: [
    { required: true, message: () => t('systembasicmgmt.userLabor.pleaseInputLaborNameCn'), trigger: 'blur' }
  ],
  laborNameEn: [
    { required: true, message: () => t('systembasicmgmt.userLabor.pleaseInputLaborNameEn'), trigger: 'blur' }
  ]
}

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

/** 401/403 由全局拦截器统一处理，这里不再重复提示 */
const showApiError = (res, fallbackKey = 'systembasicmgmt.userLabor.getFailed') => {
  if (res?.code === 401 || res?.code === 403) return
  showMessage(res?.message || t(fallbackKey), Number(res?.code) === 400 ? 'warning' : 'error')
}

const fetchLaborList = async () => {
  loading.value = true
  const res = await post(GET_USERLABOR_LIST_API.GET_USERLABOR_LIST, {
    laborName: filters.laborName,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  })
  if (res?.code === 200) {
    laborList.value = res.data || []
    pagination.totalCount = res.totalCount || 0
  } else {
    showApiError(res)
    laborList.value = []
  }
  loading.value = false
}

const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchLaborList()
  }, DEBOUNCE_MS)
}

const resetEditForm = () => {
  Object.assign(editForm, { laborId: '', laborNameCn: '', laborNameEn: '', description: '' })
}

const handleSearch = () => scheduleSearch()

const handleReset = () => {
  filters.laborName = ''
  scheduleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchLaborList()
}

const handlePageChange = () => {
  fetchLaborList()
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
  const formData = new FormData()
  formData.append('laborId', row.laborId)
  const res = await post(GET_USER_LABOR_ENTITY_API.GET_USER_LABOR_ENTITY, formData)
  if (res?.code === 200) {
    Object.assign(editForm, res.data)
  } else {
    showApiError(res)
    dialogVisible.value = false
  }
  dialogLoading.value = false
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.userLabor.deleteConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  const formData = new FormData()
  formData.append('laborId', row.laborId)
  const res = await post(DELETE_USER_LABOR_API.DELETE_USER_LABOR, formData)
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    fetchLaborList()
  } else {
    showApiError(res)
  }
}

const handleSave = async () => {
  const valid = await editFormRef.value?.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  const api = isEdit.value ? UPDATE_USER_LABOR_API.UPDATE_USER_LABOR : INSERT_USER_LABOR_API.INSERT_USER_LABOR
  const res = await post(api, { ...editForm })
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    dialogVisible.value = false
    fetchLaborList()
  } else {
    showApiError(res, 'systembasicmgmt.userLabor.operationFailed')
  }
  submitLoading.value = false
}

const handleDialogClose = () => {
  resetEditForm()
  editFormRef.value?.clearValidate()
}

onMounted(() => {
  fetchLaborList()
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.ellipsis-cell {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
