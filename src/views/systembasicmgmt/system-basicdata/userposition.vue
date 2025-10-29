<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <!-- 表格区域 -->
      <div class="table-container">
        <el-table :data="positionList" style="width: 100%" border stripe height="80%" :header-cell-style="{ background: '#f5f7fa' }" v-loading="loading" :element-loading-text="$t('common.loading')" class="conventional-table">
          <el-table-column type="index" :label="$t('systembasicmgmt.userPosition.index')" width="70" align="center" fixed />
          <el-table-column prop="positionNo" :label="$t('systembasicmgmt.userPosition.positionNo')" align="center" min-width="120" />
          <el-table-column prop="positionNameCn" :label="$t('systembasicmgmt.userPosition.positionNameCn')" align="left" min-width="200" />
          <el-table-column prop="positionNameEn" :label="$t('systembasicmgmt.userPosition.positionNameEn')" align="left" min-width="200" />
          <el-table-column prop="positionDescription" :label="$t('systembasicmgmt.userPosition.positionDescription')" align="left" min-width="250" />
          <el-table-column :label="$t('common.operation')" min-width="100" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)" :loading="editingId === scope.row.positionId">
                {{ $t('common.edit') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    
    <!-- 编辑状态对话框 -->
    <el-dialog 
      v-model="dialogVisible"
      :title="$t('systembasicmgmt.userPosition.editPosition')"
      width="50%"
      :close-on-click-modal="false"
    >
      <div v-loading="editLoading" :element-loading-text="$t('common.loading')">
        <el-form 
          v-if="editForm"
          :inline="true" 
          :model="editForm" 
          label-width="120px" 
          class="dialog-form"
        >
          <div class="form-row">
            <el-form-item :label="$t('systembasicmgmt.userPosition.positionNo')">
              <el-input 
                v-model="editForm.positionNo" 
                :placeholder="$t('systembasicmgmt.userPosition.positionNoPlaceholder')"
                style="width:100%" 
                readonly
              />
            </el-form-item>
            <el-form-item :label="$t('systembasicmgmt.userPosition.positionNameCn')">
              <el-input
                v-model="editForm.positionNameCn"
                :placeholder="$t('systembasicmgmt.userPosition.positionNameCnPlaceholder')"
                style="width:100%" 
                readonly
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('systembasicmgmt.userPosition.positionNameEn')">
              <el-input 
                v-model="editForm.positionNameEn" 
                :placeholder="$t('systembasicmgmt.userPosition.positionNameEnPlaceholder')"
                style="width:100%" 
                readonly
              />
            </el-form-item>
            <el-form-item></el-form-item>
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('systembasicmgmt.userPosition.positionDescription')">
              <el-input 
                v-model="editForm.positionDescription" 
                :placeholder="$t('systembasicmgmt.userPosition.positionDescriptionPlaceholder')"
                style="width:100%" 
                type="textarea" 
                :rows="3" 
                readonly
              />
            </el-form-item>
          </div>
        </el-form>
        
        <div v-else class="no-data-tip">
          {{ $t('common.noData') }}
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">
            {{ $t('common.cancel') }}
          </el-button>
          <el-button @click="handleReset">{{ $t('common.reset') }}</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            {{ $t('common.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { post } from '@/utils/request'
import { 
  GET_USER_POSITION_LIST_API, 
  GET_USER_POSITION_ENTITY_API 
} from '@/config/api/systembasicmgmt/system-basicdata/userposition.js'
import { useI18n } from 'vue-i18n'

// 使用i18n
const { t } = useI18n()

// 响应式数据
const loading = ref(false)
const editLoading = ref(false)
const editingId = ref(null)
const positionList = ref([])
const dialogVisible = ref(false)
const editForm = ref(null)

// 获取职业列表
const getPositionList = async () => {
  loading.value = true
  try {
    const response = await post(GET_USER_POSITION_LIST_API.GET_USER_POSITION_LIST, {})
    if (response.code === 200) {
      positionList.value = response.data || []
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
      positionList.value = []
    }
  } catch (error) {
    ElMessage({
      message: t('systembasicmgmt.userPosition.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
    positionList.value = []
  } finally {
    loading.value = false
  }
}

// 处理编辑
const handleEdit = async (index, row) => {
  editingId.value = row.positionId
  editLoading.value = true
  dialogVisible.value = true
  editForm.value = null
  
  try {
    // 构造请求参数 - 使用JSON格式发送positionId
    const requestData = {
      positionId: row.positionId
    }
    
    const response = await post(GET_USER_POSITION_ENTITY_API.GET_USER_POSITION_ENTITY, requestData)
    
    if (response.code === 200) {
      editForm.value = { ...response.data }
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
      dialogVisible.value = false
    }
  } catch (error) {
    ElMessage({
      message: t('systembasicmgmt.userPosition.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
    dialogVisible.value = false
  } finally {
    editLoading.value = false
    editingId.value = null
  }
}

// 重置表单
const handleReset = () => {
  if (editForm.value) {
    // 重新获取当前职位数据以重置表单
    handleEdit(0, editForm.value)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getPositionList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>

