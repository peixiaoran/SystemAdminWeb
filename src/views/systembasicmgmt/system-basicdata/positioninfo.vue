<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <div class="table-container">
        <el-table :data="positionList"
                  border
                  stripe
                  height="80%"
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  :element-loading-text="$t('common.loading')"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('systembasicmgmt.positionInfo.index')" width="70" align="center" fixed />
          <el-table-column prop="positionNo" :label="$t('systembasicmgmt.positionInfo.positionNo')" align="center" min-width="120" />
          <el-table-column prop="positionNameCn" :label="$t('systembasicmgmt.positionInfo.positionNameCn')" align="left" min-width="200" />
          <el-table-column prop="positionNameEn" :label="$t('systembasicmgmt.positionInfo.positionNameEn')" align="left" min-width="200" />
          <el-table-column prop="positionDescription" :label="$t('systembasicmgmt.positionInfo.positionDescription')" align="left" min-width="250" />
          <el-table-column :label="$t('common.operation')" min-width="80" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">{{ $t('common.edit') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible"
               :title="$t('systembasicmgmt.positionInfo.editPosition')"
               width="50%"
               :close-on-click-modal="false">
      <div v-loading="dialogLoading" :element-loading-text="$t('common.loading')">
        <el-form v-if="editForm"
                 :inline="true"
                 :model="editForm"
                 label-width="120px"
                 class="dialog-form"
                 role="form"
                 :aria-label="$t('systembasicmgmt.positionInfo.ariaEditLabel')">
          <div class="form-row">
            <el-form-item :label="$t('systembasicmgmt.positionInfo.positionNo')">
              <el-input v-model="editForm.positionNo"
                        :placeholder="$t('systembasicmgmt.positionInfo.positionNoPlaceholder')"
                        style="width:100%"
                        readonly />
            </el-form-item>
            <el-form-item :label="$t('systembasicmgmt.positionInfo.positionNameCn')">
              <el-input v-model="editForm.positionNameCn"
                        :placeholder="$t('systembasicmgmt.positionInfo.positionNameCnPlaceholder')"
                        style="width:100%"
                        readonly />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('systembasicmgmt.positionInfo.positionNameEn')">
              <el-input v-model="editForm.positionNameEn"
                        :placeholder="$t('systembasicmgmt.positionInfo.positionNameEnPlaceholder')"
                        style="width:100%"
                        readonly />
            </el-form-item>
            <!-- 占位项：保持与上方两列布局对齐 -->
            <el-form-item />
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('systembasicmgmt.positionInfo.positionDescription')">
              <el-input v-model="editForm.positionDescription"
                        :placeholder="$t('systembasicmgmt.positionInfo.positionDescriptionPlaceholder')"
                        style="width:100%"
                        type="textarea"
                        :rows="3"
                        readonly />
            </el-form-item>
          </div>
        </el-form>

        <div v-else class="no-data-tip">
          {{ $t('common.noData') }}
        </div>
      </div>

      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.close') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { post } from '@/utils/request'
import {
  GET_USER_POSITION_LIST_API,
  GET_USER_POSITION_ENTITY_API
} from '@/config/api/systembasicmgmt/system-basicdata/positioninfo'

const { t } = useI18n()

const loading = ref(false)
const dialogLoading = ref(false)
const positionList = ref([])
const dialogVisible = ref(false)
const editForm = ref(null)

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

/** 401/403 由全局拦截器统一处理，这里不再重复提示 */
const showApiError = (res, fallbackKey = 'systembasicmgmt.positionInfo.getFailed') => {
  if (res?.code === 401 || res?.code === 403) return
  showMessage(res?.message || t(fallbackKey), Number(res?.code) === 400 ? 'warning' : 'error')
}

const fetchPositionList = async () => {
  loading.value = true
  const res = await post(GET_USER_POSITION_LIST_API.GET_USER_POSITION_LIST, {})
  if (res?.code === 200) {
    positionList.value = res.data || []
  } else {
    showApiError(res)
    positionList.value = []
  }
  loading.value = false
}

const handleEdit = async (row) => {
  dialogLoading.value = true
  dialogVisible.value = true
  editForm.value = null
  const formData = new FormData()
  formData.append('positionId', row.positionId)
  const res = await post(GET_USER_POSITION_ENTITY_API.GET_USER_POSITION_ENTITY, formData)
  if (res?.code === 200) {
    editForm.value = { ...res.data }
  } else {
    showApiError(res)
    dialogVisible.value = false
  }
  dialogLoading.value = false
}

onMounted(() => {
  fetchPositionList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
