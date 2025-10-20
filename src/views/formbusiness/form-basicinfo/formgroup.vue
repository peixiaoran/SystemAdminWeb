<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="searchForm" class="conventional-filter-form" role="search" aria-label="表单组别筛选">
          <el-form-item :label="$t('formbusiness.formgroup.formGroupName')">
            <el-input
              v-model="searchForm.formGroupName"
              :placeholder="$t('formbusiness.formgroup.pleaseInputFormGroupName')"
              clearable
              style="width: 200px"
            />
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
              {{ $t('formbusiness.formgroup.addFormGroup') }}
            </el-button>
          </el-form-item>
        </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table 
          :data="formGroupList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('formbusiness.formgroup.index')" width="70" align="center" fixed />
          <el-table-column prop="formGroupNameCn" :label="$t('formbusiness.formgroup.formGroupNameCn')" align="left" min-width="150" />
          <el-table-column prop="formGroupNameEn" :label="$t('formbusiness.formgroup.formGroupNameEn')" align="left" min-width="150" />
          <el-table-column prop="description" :label="$t('formbusiness.formgroup.description')" align="left" min-width="300" />
          <el-table-column :label="$t('common.operation')" min-width="120" fixed="right" align="center">
            <template #default="scope">
              <el-button 
                size="small" 
                @click="handleEdit(scope.row)"
              >
                {{ $t('common.edit') }}
              </el-button>
              <el-button 
                size="small" 
                type="danger"
                @click="handleDelete(scope.row)"
              >
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
      :title="isEdit ? $t('formbusiness.formgroup.editFormGroup') : $t('formbusiness.formgroup.addFormGroup')"
      width="50%"
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
          label-width="120px" 
          class="dialog-form"
          role="form" 
          aria-label="表单组别编辑"
        >
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.formgroup.formGroupNameCn')" prop="formGroupNameCn">
              <el-input 
                v-model="form.formGroupNameCn" 
                :placeholder="$t('formbusiness.formgroup.pleaseInputFormGroupNameCn')"
                style="width:100%" 
              />
            </el-form-item>
            <el-form-item :label="$t('formbusiness.formgroup.formGroupNameEn')" prop="formGroupNameEn">
              <el-input
                v-model="form.formGroupNameEn"
                :placeholder="$t('formbusiness.formgroup.pleaseInputFormGroupNameEn')"
                style="width:100%" 
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.formgroup.sortOrder')" prop="sortOrder">
              <el-input-number 
                v-model="form.sortOrder" 
                :min="1"
                :max="999"
                style="width:100%" 
              />
            </el-form-item>
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('formbusiness.formgroup.description')" prop="description">
              <el-input 
                v-model="form.description" 
                :placeholder="$t('formbusiness.formgroup.pleaseInputDescription')"
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { post } from '@/utils/request'
import { 
  GET_FORMGROUP_LIST_API,
  GET_FORMGROUP_ENTITY_API,
  INSERT_FORMGROUP_ENTITY_API,
  UPDATE_FORMGROUP_API,
  DELETE_FORMGROUP_ENTITY_API
} from '@/config/api/formbusiness/form-basicInfo/formgroup.js'
import { useI18n } from 'vue-i18n'

// 使用i18n
const { t } = useI18n()

// 响应式数据
const loading = ref(false)
const dialogLoading = ref(false)
const submitLoading = ref(false)
const editingId = ref(null)
const deletingId = ref(null)
const formGroupList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

// 搜索表单
const searchForm = reactive({
  formGroupName: ''
})

// 分页信息
const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
  totalCount: 0
})

// 表单数据
const form = reactive({
  formGroupId: '',
  formGroupNameCn: '',
  formGroupNameEn: '',
  sortOrder: 1,
  description: ''
})

// 表单验证规则
const rules = {
  formGroupNameCn: [
    { required: true, message: () => t('formbusiness.formgroup.pleaseInputFormGroupNameCn'), trigger: 'blur' }
  ],
  formGroupNameEn: [
    { required: true, message: () => t('formbusiness.formgroup.pleaseInputFormGroupNameEn'), trigger: 'blur' }
  ],


}

// 获取表单组别列表
const getFormGroupList = async () => {
  loading.value = true
  try {
    const params = {
      formGroupName: searchForm.formGroupName,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: pagination.totalCount
    }
    
    const response = await post(GET_FORMGROUP_LIST_API, params)
    if (response.code === 200) {
      formGroupList.value = response.data || []
      pagination.totalCount = response.totalCount || 0
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
      formGroupList.value = []
    }
  } catch (error) {
    console.error('获取表单组别列表失败:', error)
    ElMessage({
      message: t('formbusiness.formgroup.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
    formGroupList.value = []
  } finally {
    loading.value = false
  }
}

// 防抖搜索优化
let searchTimer = null

// 搜索
const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true // 立即显示加载状态
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    getFormGroupList()
  }, 300) // 300ms防抖
}

// 重置搜索
const handleReset = () => {
  searchForm.formGroupName = ''
}

// 分页大小改变
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.pageIndex = 1
  getFormGroupList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  pagination.pageIndex = val
  getFormGroupList()
}

// 重置表单
const resetForm = () => {
  form.formGroupId = ''
  form.formGroupNameCn = ''
  form.formGroupNameEn = ''
  form.sortOrder = 1
  form.description = ''
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
  editingId.value = row.formGroupId
  dialogLoading.value = true
  dialogVisible.value = true
  isEdit.value = true
  
  try {
    const params = {
      formGroupId: row.formGroupId,
      formGroupNameCn: '',
      formGroupNameEn: '',
      sortOrder: 1,
      description: ''
    }
    
    const response = await post(GET_FORMGROUP_ENTITY_API, params)
    
    if (response.code === 200) {
      const data = response.data
      form.formGroupId = data.formGroupId
      form.formGroupNameCn = data.formGroupNameCn
      form.formGroupNameEn = data.formGroupNameEn
      form.sortOrder = data.sortOrder
      form.description = data.description
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
    console.error('获取表单组别详情失败:', error)
    ElMessage({
      message: t('formbusiness.formgroup.getFailed'),
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
      t('formbusiness.formgroup.deleteConfirm'),
      t('common.warning'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
    
    deletingId.value = row.formGroupId
    
    const params = {
      formGroupId: row.formGroupId,
      formGroupNameCn: row.formGroupNameCn,
      formGroupNameEn: row.formGroupNameEn,
      sortOrder: row.sortOrder,
      description: row.description
    }
    
    const response = await post(DELETE_FORMGROUP_ENTITY_API, params)
    
    if (response.code === 200) {
      ElMessage({
        message: response.message,
        type: 'success',
        plain: true,
        showClose: true
      })
      getFormGroupList()
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除表单组别失败:', error)
      ElMessage({
        message: t('formbusiness.formgroup.operationFailed'),
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
      formGroupId: form.formGroupId,
      formGroupNameCn: form.formGroupNameCn,
      formGroupNameEn: form.formGroupNameEn,
      sortOrder: form.sortOrder,
      description: form.description
    }
    
    const api = isEdit.value ? UPDATE_FORMGROUP_API : INSERT_FORMGROUP_ENTITY_API
    const response = await post(api, params)
    
    if (response.code === 200) {
      ElMessage({
        message: response.message,
        type: 'success',
        plain: true,
        showClose: true
      })
      dialogVisible.value = false
      getFormGroupList()
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    // 如果是表单验证失败，不显示错误提示，让Element Plus自己处理
    if (error !== false && typeof error === 'object' && error.message) {
      console.error('提交表单失败:', error)
      ElMessage({
        message: t('formbusiness.formgroup.operationFailed'),
        type: 'error',
        plain: true,
        showClose: true
      })
    }
    // 表单验证失败时，error通常是false或者验证错误对象，不显示Operation Failed
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

// 组件挂载时获取数据
onMounted(() => {
  getFormGroupList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>

